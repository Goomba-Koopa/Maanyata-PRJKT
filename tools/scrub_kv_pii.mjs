// tools/scrub_kv_pii.mjs - One-time migration to sanitize PII and restore tenure in MAANYATA_KV
import fs from "node:fs";
import path from "node:path";
import { maskUnit } from "../functions/api/_common.js";

const envPath = path.resolve(".env");
let apiToken = process.env.CLOUDFLARE_API_TOKEN;
let accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("CLOUDFLARE_API_TOKEN=")) {
      apiToken = trimmed.split("=")[1].trim();
    }
    if (trimmed.startsWith("CLOUDFLARE_ACCOUNT_ID=")) {
      accountId = trimmed.split("=")[1].trim();
    }
  }
}

const NAMESPACE_ID = "4e0ac0a7441d430297bee2115a0e9690";
const BASE_API = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${NAMESPACE_ID}`;

const headers = {
  Authorization: `Bearer ${apiToken}`,
  "Content-Type": "application/json"
};

async function fetchKV(key) {
  const res = await fetch(`${BASE_API}/values/${encodeURIComponent(key)}`, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to get KV key ${key}: ${res.statusText}`);
  return await res.text();
}

async function putKV(key, value) {
  const res = await fetch(`${BASE_API}/values/${encodeURIComponent(key)}`, {
    method: "PUT",
    headers,
    body: typeof value === "string" ? value : JSON.stringify(value)
  });
  if (!res.ok) throw new Error(`Failed to put KV key ${key}: ${res.statusText}`);
}

async function listKVKeys() {
  const res = await fetch(`${BASE_API}/keys?limit=1000`, { headers });
  if (!res.ok) throw new Error(`Failed to list keys: ${res.statusText}`);
  const data = await res.json();
  return data.result || [];
}

async function main() {
  console.log("=== STARTING MAANYATA_KV PII SCRUB & TENURE RESTORATION ===");
  console.log(`Account ID: ${accountId}`);
  console.log(`Namespace:  ${NAMESPACE_ID}`);

  const keys = await listKVKeys();
  console.log(`Found ${keys.length} total keys in KV:`, keys.map(k => k.name));

  const directorySummary = [];

  for (const k of keys) {
    if (k.name.startsWith("worker:")) {
      const raw = await fetchKV(k.name);
      if (!raw) continue;
      let worker;
      try {
        worker = JSON.parse(raw);
      } catch (e) {
        console.warn(`Could not parse ${k.name}:`, e);
        continue;
      }

      console.log(`\nSanitizing worker: ${worker.id} (${worker.name})...`);

      // 1. Scrub References: Mask unit and remove phone/contact PII
      if (Array.isArray(worker.references)) {
        worker.references.forEach((ref, idx) => {
          const oldUnit = ref.unit;
          const oldContact = ref.contact;
          ref.unit = maskUnit(ref.unit);
          ref.contact = null; // NEVER STORE RAW PHONE NUMBERS IN KV
          console.log(`  Ref ${idx + 1}: Unit '${oldUnit}' -> '${ref.unit}' | Contact '${oldContact}' -> null`);
        });
      }

      // 2. Restore Veteran Tenure (Sunita Devi baseline is 8.5 Yrs)
      if (worker.id === "sunita-devi-01") {
        const curTenure = parseFloat(worker.tenure) || 0;
        if (curTenure < 8.5) {
          console.log(`  Restoring Sunita Devi tenure: ${worker.tenure} -> 8.5 Yrs`);
          worker.tenure = "8.5 Yrs";
        }
      }

      // 3. Put sanitized worker back to KV
      await putKV(k.name, JSON.stringify(worker));
      console.log(`  ✓ Successfully updated KV key ${k.name}`);

      // Add to summary
      directorySummary.push({
        id: worker.id,
        name: worker.name,
        role: worker.role,
        uan: worker.uan,
        tenure: worker.tenure,
        households: worker.households,
        society: worker.society,
        traits: worker.traits,
        boundaries: worker.boundaries,
        references: (worker.references || []).slice(0, 5),
        createdAt: worker.createdAt || new Date().toISOString()
      });
    }
  }

  // 4. Update directory:summary in KV for O(1) single-subrequest reads
  if (directorySummary.length > 0) {
    console.log(`\nUpdating directory:summary with ${directorySummary.length} workers...`);
    await putKV("directory:summary", JSON.stringify(directorySummary));
    console.log("✓ directory:summary successfully updated in production KV!");
  }

  console.log("\n=== MIGRATION COMPLETE: All PII scrubbed, tenure preserved, and summary indexed! ===");
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
