// POST /api/endorse - Ingest and verify an attestation on Cloudflare Edge
// Hardened against Evil-Heavy vectors (Defamation, Rate Flooding, Fabricated Addresses)

import {
  getKVWorker,
  saveKVWorker,
  isSafeContent,
  validateResidence,
  normalizeUnit,
  maskUnit,
  stripZeroWidth,
  getClientIP,
  checkRateLimit
} from "./_common.js";

export async function onRequestPost(context) {
  try {
    const contentLength = parseInt(context.request.headers.get("content-length") || "0", 10);
    if (contentLength > 8192) {
      return new Response(JSON.stringify({ success: false, error: "Payload exceeds size limit (max 8KB)." }), {
        status: 413,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const kv = context.env.MAANYATA_KV;
    const clientIp = getClientIP(context.request);

    // 1. IP Rate Limiting Guard (Prevents KV write exhaustion & automated spam)
    const rateCheck = await checkRateLimit(kv, clientIp, "endorse");
    if (!rateCheck.allowed) {
      return new Response(JSON.stringify({ success: false, error: rateCheck.error }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const data = await context.request.json();

    // 2. Extract & Sanitize Fields (Strip zero-width characters)
    const workerId = stripZeroWidth(data.workerId || "").slice(0, 60);
    const rawBy = stripZeroWidth(data.by || "Resident Attestation").slice(0, 60);
    const rawUnit = stripZeroWidth(data.unit || "").slice(0, 90);
    const rawSociety = stripZeroWidth(data.society || "").slice(0, 80);
    const rawNote = stripZeroWidth(data.note || "").slice(0, 300);
    const rawContact = stripZeroWidth(data.contact || "").slice(0, 25);
    const traits = Array.isArray(data.traits) ? data.traits.map(t => stripZeroWidth(t).slice(0, 40)).slice(0, 10) : [];
    const tenureYears = Math.min(35, Math.max(0.5, parseFloat(data.tenureYears) || 1));
    const locationTag = stripZeroWidth(data.locationTag || "⚠️ Remote Attestation").slice(0, 60);
    const locationVerified = Boolean(data.locationVerified);

    if (!workerId) {
      return new Response(JSON.stringify({ success: false, error: "Target workerId is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 3. Strict Content Safety & Defamation Blacklist
    if (!isSafeContent(rawNote) || !isSafeContent(rawUnit) || !isSafeContent(rawBy) || !isSafeContent(rawSociety)) {
      return new Response(JSON.stringify({
        success: false,
        error: "Attestation Guard: Content contains prohibited language, slurs, or defamatory accusations. Project Maanyata is strictly an instrument of positive craft attestation."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 4. Grounded Residence Validation Engine
    const resValidation = validateResidence(rawUnit, rawSociety);
    if (!resValidation.valid) {
      return new Response(JSON.stringify({
        success: false,
        error: resValidation.error || "Attestation Guard: Invalid residence unit."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 5. Retrieve Worker from KV
    const worker = await getKVWorker(kv, workerId);
    if (!worker) {
      return new Response(JSON.stringify({ success: false, error: "Worker not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 6. Semantic Address Normalization Guard (Prevent Duplicate Inflation)
    const normInput = normalizeUnit(rawUnit);
    const existingIndex = (worker.references || []).findIndex(
      r => (r.unitNorm ? r.unitNorm === normInput : normalizeUnit(r.unit) === normInput)
    );

    if (existingIndex !== -1) {
      return new Response(JSON.stringify({
        success: false,
        error: `Attestation Guard: Residence ${rawUnit} has already submitted an attestation on this passbook.`
      }), {
        status: 409,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 7. Build New Attestation Record
    const currentYear = new Date().getFullYear();
    const startYear = Math.round(currentYear - tenureYears);

    const maskedUnit = maskUnit(rawUnit);
    const newReference = {
      id: `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      quote: rawNote || "Verified honest household service and reliable assistance.",
      author: rawBy || "Resident Attestation",
      unit: maskedUnit,
      unitNorm: normInput, // Normalization anchor for duplicate lock
      contact: null, // PII Scrubbed: Phone numbers never stored in public KV
      tenure: `${tenureYears} Yrs Attested`,
      startYear,
      certified: true,
      locationVerified,
      locationTag,
      timestamp: Date.now()
    };

    worker.references = worker.references || [];
    worker.references.unshift(newReference);

    // Increment traits (Guarded against prototype pollution)
    worker.traits = worker.traits || {};
    traits.forEach(t => {
      if (typeof t !== "string" || t === "__proto__" || t === "constructor" || t === "prototype") return;
      if (worker.traits[t]) {
        worker.traits[t].count += 1;
      } else {
        worker.traits[t] = { count: 1, icon: "⭐" };
      }
    });

    // Recalculate unique households and tenure
    const uniqueUnits = new Set(
      worker.references.filter(r => r.certified !== false && r.unit).map(r => normalizeUnit(r.unit))
    );
    worker.households = Math.max(worker.households || 0, uniqueUnits.size);

    // Monotonic Tenure Invariant + Truth Disaggregation
    // Disaggregates Declared Lifetime Baseline from Signed In-App Attestations
    const existingBaselineYears = parseFloat(worker.tenureBaseline || worker.tenure) || 0.5;
    const certifiedStartYears = worker.references
      .filter(r => r.certified && r.startYear)
      .map(r => r.startYear);

    if (certifiedStartYears.length > 0) {
      const earliestYear = Math.min(...certifiedStartYears);
      const calculatedYears = Math.max(0.5, currentYear - earliestYear);
      const finalTenureYears = Math.max(existingBaselineYears, calculatedYears);
      worker.tenure = `${finalTenureYears} Yrs`;
      worker.tenureBaseline = `${existingBaselineYears} Yrs (Declared Baseline)`;
      worker.tenureAttested = `${calculatedYears} Yrs (Resident-Signed)`;
    } else {
      worker.tenure = `${existingBaselineYears} Yrs`;
      worker.tenureBaseline = `${existingBaselineYears} Yrs (Declared Baseline)`;
      worker.tenureAttested = `0 Yrs`;
    }

    // 8. Persist to Cloudflare KV
    if (kv) {
      await saveKVWorker(kv, worker);
    }

    return new Response(JSON.stringify({ success: true, worker, reference: newReference }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message || "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
