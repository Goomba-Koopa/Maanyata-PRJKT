/**
 * Comprehensive Maanyata Sovereign Passbook & Edge Security Stress Test Loop
 * Tests:
 * - Stage 1: Resident Endorsement (Pooja Rao, Flat 402 Greenwood Palms, 5 Yrs) via simulated endorse.js + mock KV.
 * - Stage 2: Sunita Hydration via worker/[id].js.
 * - Stage 3: WhatsApp Token Generation via canonical Ed25519 seed (containing payload.ref).
 * - Stage 4: Employer Token Verification (signature valid, payload decodes, references has Pooja Rao's attestation).
 * - EVIL HEAVY ATTACK BATTERY:
 *   * Attack 1: Mrs. Malini's Spiteful Accusation — Attempt note: "She is a chor, stole my necklace". Assert 400 REJECTION by Attestation Guard.
 *   * Attack 2: The Clock-Warp Replay — Attempt token with exp = now - 1000. Assert REJECTION by verifyEd25519Token.
 *   * Attack 3: The QR Counterfeiter — Tamper 1 character in base64 payload without valid private key. Assert REJECTION by Ed25519 detached verify.
 *   * Attack 4: The Ghost Address — Attempt unit: "093, Fake Slum Towers". Assert 400 REJECTION by Residence Guard.
 */

import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { createRequire } from "module";

import { onRequestPost as postEndorse } from "../functions/api/endorse.js";
import { onRequestGet as getWorkerById } from "../functions/api/worker/[id].js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

// In-Memory KV Simulator matching Cloudflare Worker KV
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

function createContext(url, method, body, headers = {}, mockKV) {
  const reqHeaders = new Map(Object.entries(headers));
  return {
    request: {
      method,
      url,
      headers: {
        get: (h) => reqHeaders.get(h.toLowerCase()) || null
      },
      json: async () => (body ? (typeof body === "string" ? JSON.parse(body) : body) : {})
    },
    env: {
      MAANYATA_KV: mockKV
    },
    params: {}
  };
}

// Set up portfolio.js sandbox
function createPortfolioContext(initialSearch = "") {
  const naclPath = path.join(rootDir, "tweetnacl.min.js");
  const naclCode = fs.readFileSync(naclPath, "utf8");

  const context = vm.createContext({
    module: { exports: {}, require },
    console,
    setTimeout,
    clearTimeout,
    TextEncoder,
    TextDecoder,
    Uint8Array,
    URLSearchParams,
    atob: (b) => Buffer.from(b, "base64").toString("binary"),
    btoa: (b) => Buffer.from(b, "binary").toString("base64"),
    window: {
      addEventListener: () => {},
      location: { search: initialSearch, hash: "", origin: "https://maanyata.org" }
    },
    document: {
      readyState: "loading",
      addEventListener: () => {},
      getElementById: () => null,
      documentElement: { setAttribute: () => {} }
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {}
    }
  });

  vm.runInContext(naclCode, context);
  context.nacl = context.module.exports;
  context.window.nacl = context.nacl;

  const portfolioPath = path.join(rootDir, "js", "portfolio.js");
  const portfolioCode = fs.readFileSync(portfolioPath, "utf8");
  vm.runInContext(portfolioCode, context);

  return context;
}

let passed = 0;
let total = 0;

async function runTest(name, fn) {
  total++;
  try {
    await fn();
    passed++;
    console.log(`[PASS] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    throw err;
  }
}

async function main() {
  console.log("================================================================================");
  console.log("PROJECT MAANYATA — STRESS TEST LOOP & EVIL HEAVY ATTACK BATTERY");
  console.log("================================================================================\n");

  const kv = new MockKV();
  const portfolioCtx = createPortfolioContext();

  // STAGE 1: Resident Endorsement
  let stage1Worker = null;
  await runTest("Stage 1: Resident Endorsement (Pooja Rao, Flat 402 Greenwood Palms, 5 Yrs)", async () => {
    const ctx = createContext(
      "https://maanyata.org/api/endorse",
      "POST",
      {
        workerId: "sunita-devi-01",
        by: "Pooja Rao",
        unit: "Flat 402, Greenwood Palms CHS",
        society: "Greenwood Palms CHS",
        note: "5 Yrs, Verified by Pooja Rao in Greenwood Palms. Completely honest and punctual.",
        traits: ["Exceptional Cooking", "Trusted With House Keys"],
        tenureYears: 5,
        locationVerified: true,
        locationTag: "✓ On-Premises Verified Attestation"
      },
      { "CF-Connecting-IP": "192.168.1.101" },
      kv
    );

    const res = await postEndorse(ctx);
    const data = await res.json();
    if (res.status !== 200 || !data.success) {
      throw new Error(`Endorsement failed: status ${res.status}, error: ${data.error}`);
    }

    const storedWorkerRaw = await kv.get("worker:sunita-devi-01");
    if (!storedWorkerRaw) throw new Error("Worker not persisted in KV!");
    stage1Worker = JSON.parse(storedWorkerRaw);

    const ref = stage1Worker.references.find(r => r.author === "Pooja Rao");
    if (!ref) throw new Error("Reference from Pooja Rao missing from worker references!");
    if (!ref.unit.includes("Greenwood Palms CHS") || ref.unit.includes("402")) {
      throw new Error(`Unit masking failed: ${ref.unit}`);
    }
    if (!ref.tenure.includes("5 Yrs")) {
      throw new Error(`Tenure mismatch: expected '5 Yrs', got '${ref.tenure}'`);
    }
  });

  // STAGE 2: Sunita Hydration
  let hydratedWorker = null;
  await runTest("Stage 2: Sunita Hydration via /api/worker/[id]", async () => {
    const ctx = createContext("https://maanyata.org/api/worker/sunita-devi-01", "GET", null, {}, kv);
    ctx.params = { id: "sunita-devi-01" };

    const res = await getWorkerById(ctx);
    const data = await res.json();
    if (res.status !== 200 || !data.success || !data.worker) {
      throw new Error(`Worker hydration failed: status ${res.status}`);
    }
    hydratedWorker = data.worker;

    const poojaRef = hydratedWorker.references.find(r => r.author === "Pooja Rao");
    if (!poojaRef) throw new Error("Hydrated worker missing Pooja Rao reference!");
    if (poojaRef.certified !== true) throw new Error("Reference not certified!");
  });

  // STAGE 3: WhatsApp Token Generation
  let generatedToken = null;
  await runTest("Stage 3: WhatsApp Token Generation via canonical Ed25519 seed", async () => {
    // Inject the hydrated worker into portfolioCtx.portfolio inside vm context
    portfolioCtx.tempWorker = JSON.parse(JSON.stringify(hydratedWorker));
    vm.runInContext(`portfolio = tempWorker;`, portfolioCtx);

    const token = vm.runInContext(
      `generateEd25519Token(
        portfolio.id,
        portfolio.name,
        portfolio.role,
        5,
        portfolio.households,
        portfolio.traits,
        portfolio.boundaries
      )`,
      portfolioCtx
    );

    if (!token || typeof token !== "string" || !token.startsWith("MNY1.")) {
      throw new Error(`Invalid token format: ${token}`);
    }

    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Token must have 3 segments (MNY1.payload.sig)");

    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);

    if (!payload.ref) throw new Error("Token payload missing top verified reference (payload.ref)!");
    if (payload.ref.author !== "Pooja Rao") {
      throw new Error(`Expected author 'Pooja Rao', got '${payload.ref.author}'`);
    }
    if (!payload.ref.unit.includes("Greenwood Palms CHS") || payload.ref.unit.includes("402")) {
      throw new Error(`Privacy masking violation in token payload: ${payload.ref.unit}`);
    }

    generatedToken = token;
  });

  // STAGE 4: Employer Token Verification
  await runTest("Stage 4: Employer Token Verification & Reference Card Display", async () => {
    // Simulate employer browsing to portfolio with ?token=generatedToken
    const employerCtx = createPortfolioContext(`?token=${encodeURIComponent(generatedToken)}`);

    const employerPortfolio = vm.runInContext(`portfolio`, employerCtx);
    if (!employerPortfolio) throw new Error("Employer failed to load portfolio from token!");

    if (!employerPortfolio.references || employerPortfolio.references.length === 0) {
      throw new Error("Employer portfolio has empty references list!");
    }

    const displayedRef = employerPortfolio.references[0];
    if (displayedRef.author !== "Pooja Rao") {
      throw new Error(`Displayed reference author mismatch: ${displayedRef.author}`);
    }
    if (!displayedRef.quote.includes("5 Yrs") || !displayedRef.quote.includes("Pooja Rao")) {
      throw new Error(`Displayed reference quote missing key terms: ${displayedRef.quote}`);
    }
  });

  // EVIL HEAVY ATTACK BATTERY
  console.log("\n--- EVIL HEAVY ATTACK BATTERY ---");

  // Attack 1: Mrs. Malini's Spiteful Accusation
  await runTest("Attack 1: Mrs. Malini's Spiteful Accusation — Attempt 'She is a chor, stole my necklace'", async () => {
    const ctx = createContext(
      "https://maanyata.org/api/endorse",
      "POST",
      {
        workerId: "sunita-devi-01",
        by: "Mrs. Malini",
        unit: "Flat 201, Greenwood Palms CHS",
        society: "Greenwood Palms CHS",
        note: "She is a chor, stole my necklace and ran away!",
        tenureYears: 1
      },
      { "CF-Connecting-IP": "192.168.1.102" },
      kv
    );

    const res = await postEndorse(ctx);
    const data = await res.json();
    if (res.status !== 400 || !data.error.includes("Attestation Guard")) {
      throw new Error(`Spiteful accusation was NOT rejected! Status: ${res.status}, Data: ${JSON.stringify(data)}`);
    }
  });

  // Attack 2: The Clock-Warp Replay
  await runTest("Attack 2: The Clock-Warp Replay — Expired token (exp = now - 1000) rejected", async () => {
    // Generate an expired token using vm context
    const expiredToken = vm.runInContext(`
      (() => {
        const kp = nacl.sign.keyPair.fromSeed(CANONICAL_DEMO_SEED);
        const expiredPayload = {
          wid: "sunita-devi-01",
          name: "Sunita Devi",
          role: "Culinary Specialist",
          attestedYears: 5,
          households: 1,
          exp: Math.floor(Date.now() / 1000) - 1000
        };
        const bodyStr = JSON.stringify(expiredPayload);
        const bodyB64 = base64UrlEncode(bodyStr);
        const msgBytes = new TextEncoder().encode(bodyB64);
        const sigBytes = nacl.sign.detached(msgBytes, kp.secretKey);
        const sigB64 = base64UrlEncode(sigBytes);
        return "MNY1." + bodyB64 + "." + sigB64;
      })()
    `, portfolioCtx);

    portfolioCtx.expiredToken = expiredToken;
    const verified = vm.runInContext(`verifyEd25519Token(expiredToken)`, portfolioCtx);
    if (verified !== null) {
      throw new Error("Expired token was accepted! Must be rejected.");
    }
  });

  // Attack 3: The QR Counterfeiter
  await runTest("Attack 3: The QR Counterfeiter — Tampered payload rejected by Ed25519 verify", async () => {
    const parts = generatedToken.split(".");
    const originalBodyB64 = parts[1];
    const sigB64 = parts[2];

    // Tamper 1 character in the body base64
    const tamperedChar = originalBodyB64[originalBodyB64.length - 1] === "A" ? "B" : "A";
    const tamperedBodyB64 = originalBodyB64.slice(0, -1) + tamperedChar;
    const counterfeitToken = `MNY1.${tamperedBodyB64}.${sigB64}`;

    portfolioCtx.counterfeitToken = counterfeitToken;
    const verified = vm.runInContext(`verifyEd25519Token(counterfeitToken)`, portfolioCtx);
    if (verified !== null) {
      throw new Error("Counterfeit tampered token was accepted! Signature check failed to reject.");
    }
  });

  // Attack 4: The Ghost Address
  await runTest("Attack 4: The Ghost Address — Fabricated unit '093, Fake Slum Towers' rejected", async () => {
    const ctx = createContext(
      "https://maanyata.org/api/endorse",
      "POST",
      {
        workerId: "sunita-devi-01",
        by: "Ghost Landlord",
        unit: "093, Fake Slum Towers",
        society: "Fake Slum Towers",
        note: "Reliable worker at fake place",
        tenureYears: 2
      },
      { "CF-Connecting-IP": "192.168.1.103" },
      kv
    );

    const res = await postEndorse(ctx);
    const data = await res.json();
    if (res.status !== 400 || !data.error.includes("Attestation Guard")) {
      throw new Error(`Ghost address was NOT rejected! Status: ${res.status}, Data: ${JSON.stringify(data)}`);
    }
  });

  console.log("\n================================================================================");
  console.log(`STRESS TEST RESULTS: ${passed}/${total} PASS (100% SUCCESS)`);
  console.log("================================================================================");
}

main().catch((err) => {
  console.error("FATAL ERROR in stress test loop:", err);
  process.exit(1);
});
