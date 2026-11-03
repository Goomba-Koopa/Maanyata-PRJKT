import { onRequestGet as getSocieties } from "./functions/api/societies.js";
import { onRequestPost as postEndorse } from "./functions/api/endorse.js";
import { onRequestPost as postWorkers, onRequestGet as getWorkers } from "./functions/api/workers.js";
import { onRequestGet as getWorkerById } from "./functions/api/worker/[id].js";

console.log("=== RUNNING LOCAL EDGE E2E SECURITY SUITE ===");

// In-memory KV simulator matching Cloudflare Worker KV API
class MockKV {
  constructor() {
    this.map = new Map();
  }
  async get(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  async put(key, val, options) {
    this.map.set(key, String(val));
  }
  async delete(key) {
    this.map.delete(key);
  }
  async list({ prefix } = {}) {
    const keys = [];
    for (const k of this.map.keys()) {
      if (!prefix || k.startsWith(prefix)) {
        keys.push({ name: k });
      }
    }
    return { keys };
  }
}

const mockKV = new MockKV();

function createContext(url, method, body, headers = {}) {
  const reqHeaders = new Map(Object.entries(headers));
  return {
    request: {
      method,
      url,
      headers: {
        get: (h) => reqHeaders.get(h.toLowerCase()) || null
      },
      json: async () => (body ? JSON.parse(body) : {})
    },
    env: {
      MAANYATA_KV: mockKV
    },
    params: {}
  };
}

async function run() {
  let passed = 0;
  let total = 0;

  async function check(name, fn) {
    total++;
    try {
      await fn();
      passed++;
      console.log(`[PASS] ${name}`);
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
    }
  }

  // 1. GET /api/societies
  await check("GET /api/societies returns pilot societies", async () => {
    const res = await getSocieties();
    const data = await res.json();
    if (!data.success || !Array.isArray(data.societies)) throw new Error("Invalid response");
    const vasudev = data.societies.find(s => s.name === "Vasudev Complex");
    if (!vasudev) throw new Error("Vasudev Complex missing from manifest!");
  });

  // 2. Reject zero-width hidden defamation
  await check("POST /api/endorse blocks hidden unicode slur 'c\\u200Bh\\u200Bo\\u200Br'", async () => {
    const ctx = createContext("https://edge.test/api/endorse", "POST", JSON.stringify({
      workerId: "sunita-devi-01",
      unit: "Flat B-402, Maryland Palms CHS",
      society: "Maryland Palms CHS",
      note: "She is a c\u200Bh\u200Bo\u200Br"
    }), { "CF-Connecting-IP": "10.0.0.1" });

    const res = await postEndorse(ctx);
    const data = await res.json();
    if (res.status !== 400 || !data.error.includes("Attestation Guard")) {
      throw new Error(`Expected 400 rejection, got status ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  // 3. Reject fabricated address '093, Shanti Paradise Homes'
  await check("POST /api/endorse blocks fabricated '093, Shanti Paradise Homes'", async () => {
    const ctx = createContext("https://edge.test/api/endorse", "POST", JSON.stringify({
      workerId: "sunita-devi-01",
      unit: "093, Shanti Paradise Homes",
      society: "Shanti Paradise Homes",
      note: "Reliable worker"
    }), { "CF-Connecting-IP": "10.0.0.2" });

    const res = await postEndorse(ctx);
    const data = await res.json();
    if (res.status !== 400) {
      throw new Error(`Expected 400 rejection, got status ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  // 4. Accept user test case 'G-1, 001, Vasudev Complex'
  await check("POST /api/endorse accepts valid 'G-1, 001, Vasudev Complex'", async () => {
    const ctx = createContext("https://edge.test/api/endorse", "POST", JSON.stringify({
      workerId: "sunita-devi-01",
      unit: "G-1, 001, Vasudev Complex",
      society: "Vasudev Complex",
      note: "Master cook and completely honest.",
      traits: ["Exceptional Cooking", "Trusted With House Keys"],
      tenureYears: 2
    }), { "CF-Connecting-IP": "10.0.0.3" });

    const res = await postEndorse(ctx);
    const data = await res.json();
    if (res.status !== 200 || !data.success) {
      throw new Error(`Expected 200 success, got status ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  // 5. Anti-inflation duplicate lock
  await check("POST /api/endorse blocks duplicate endorsement from same residence", async () => {
    const ctx = createContext("https://edge.test/api/endorse", "POST", JSON.stringify({
      workerId: "sunita-devi-01",
      unit: "G-1, 001, Vasudev Complex",
      society: "Vasudev Complex",
      note: "Submitting again to inflate rating",
      traits: ["Always On Time"]
    }), { "CF-Connecting-IP": "10.0.0.4" });

    const res = await postEndorse(ctx);
    const data = await res.json();
    if (res.status !== 409) {
      throw new Error(`Expected 409 conflict, got status ${res.status}`);
    }
  });

  // 6. Rate Limiting DoS Protection
  await check("POST /api/endorse enforces IP rate limit after 5 submissions", async () => {
    const spammerIP = "192.168.1.99";
    for (let i = 1; i <= 5; i++) {
      const ctx = createContext("https://edge.test/api/endorse", "POST", JSON.stringify({
        workerId: "sunita-devi-01",
        unit: `Flat B-${100 + i}, Maryland Palms CHS`,
        society: "Maryland Palms CHS",
        note: "Good service"
      }), { "CF-Connecting-IP": spammerIP });
      await postEndorse(ctx);
    }

    // 6th request from same IP must be 429
    const spamCtx = createContext("https://edge.test/api/endorse", "POST", JSON.stringify({
      workerId: "sunita-devi-01",
      unit: "Flat B-501, Maryland Palms CHS",
      society: "Maryland Palms CHS",
      note: "Spam request"
    }), { "CF-Connecting-IP": spammerIP });

    const res = await postEndorse(spamCtx);
    if (res.status !== 429) {
      throw new Error(`Expected 429 rate limit, got status ${res.status}`);
    }
  });

  console.log(`\nLocal E2E Security Tests Finished: ${passed}/${total} passed!`);
  if (passed !== total) process.exit(1);
}

run();
