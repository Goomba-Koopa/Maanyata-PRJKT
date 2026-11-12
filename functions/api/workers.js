// GET /api/workers - List all registered workers
// POST /api/workers - Register a new domestic worker into the sovereign directory
// Hardened against Evil-Heavy vectors (DoS, Spam Flooding, Name Injection)

import {
  INITIAL_SEEDS,
  isSafeContent,
  saveKVWorker,
  stripZeroWidth,
  getClientIP,
  checkRateLimit
} from "./_common.js";

export async function onRequestGet(context) {
  const kv = context.env.MAANYATA_KV;
  let workers = [];

  if (kv) {
    // 1. Single-subrequest directory read (O(1) subrequest instead of N+1 loop)
    const summaryRaw = await kv.get("directory:summary");
    if (summaryRaw) {
      try { workers = JSON.parse(summaryRaw); } catch (e) {}
    }

    if (!workers || workers.length === 0) {
      // Seed initially if empty
      for (const seed of INITIAL_SEEDS) {
        await saveKVWorker(kv, seed);
      }
      workers = [...INITIAL_SEEDS];
    }
  } else {
    workers = [...INITIAL_SEEDS];
  }

  return new Response(JSON.stringify({ success: true, workers }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=10, s-maxage=30",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

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

    // 1. Rate limit registration (Max 3 registrations per IP per 10 mins)
    const rateCheck = await checkRateLimit(kv, clientIp, "worker_create");
    if (!rateCheck.allowed) {
      return new Response(JSON.stringify({ success: false, error: rateCheck.error }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const data = await context.request.json();

    const rawName = stripZeroWidth(data.name || "").slice(0, 60);
    const rawRole = stripZeroWidth(data.role || "Household Specialist").slice(0, 60);
    const rawSociety = stripZeroWidth(data.society || "Maryland Palms CHS, Mira Road").slice(0, 80);
    const rawUan = stripZeroWidth(data.uan || "").slice(0, 30);
    const rawTenure = stripZeroWidth(data.tenure || "0.5 Yrs").slice(0, 20);

    if (rawName.length < 2) {
      return new Response(JSON.stringify({ success: false, error: "Valid worker name is required (min 2 chars)." }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!isSafeContent(rawName) || !isSafeContent(rawRole) || !isSafeContent(rawSociety)) {
      return new Response(JSON.stringify({ success: false, error: "Content contains prohibited terms." }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const workerId = `w-${slug}-${Date.now().toString(36).slice(-4)}`;

    // Clean traits to prevent prototype pollution and arbitrary blob injection
    const cleanTraits = {};
    if (data.traits && typeof data.traits === "object" && !Array.isArray(data.traits)) {
      Object.keys(data.traits).slice(0, 10).forEach(key => {
        if (key === "__proto__" || key === "constructor" || key === "prototype") return;
        const cleanKey = stripZeroWidth(key).slice(0, 40);
        if (isSafeContent(cleanKey)) {
          const val = data.traits[key];
          cleanTraits[cleanKey] = {
            count: Math.min(1000, Math.max(1, parseInt(val?.count, 10) || 1)),
            icon: typeof val?.icon === "string" ? val.icon.slice(0, 4) : "⭐"
          };
        }
      });
    }
    if (Object.keys(cleanTraits).length === 0) {
      cleanTraits["Always On Time"] = { count: 1, icon: "clock" };
    }

    const cleanBoundaries = Array.isArray(data.boundaries)
      ? data.boundaries
          .map(b => stripZeroWidth(String(b)).slice(0, 80))
          .filter(b => b.length > 0 && isSafeContent(b))
          .slice(0, 8)
      : [
          "Access to clean water & soap to wash hands",
          "Extreme Weather Late-Arrival Relief",
          "Minimum 1 Agreed Weekly Rest Day"
        ];

    const newWorker = {
      id: workerId,
      name: rawName,
      role: rawRole,
      uan: rawUan || `UAN ****-****-${Math.floor(1000 + Math.random() * 9000)}`,
      tenure: rawTenure,
      households: 1,
      society: rawSociety,
      traits: cleanTraits,
      boundaries: cleanBoundaries,
      references: [],
      createdAt: new Date().toISOString()
    };

    if (kv) {
      await saveKVWorker(kv, newWorker);
    }

    return new Response(JSON.stringify({ success: true, worker: newWorker }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message || "Failed to register worker." }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
