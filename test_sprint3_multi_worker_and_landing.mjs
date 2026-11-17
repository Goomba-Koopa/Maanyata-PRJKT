/**
 * test_sprint3_multi_worker_and_landing.mjs
 * Project Maanyata — Sprint 3 Mandate Verification Suite:
 * Institutional Landing Decoupling & Multi-Worker Storage Engine
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("================================================================================");
console.log("PROJECT MAANYATA — SPRINT 3 VERIFICATION: LANDING DECOUPLING & MULTI-WORKER ENGINE");
console.log("================================================================================\n");

// -----------------------------------------------------------------------------
// [SECTION 1] AUDITING index.html (Institutional Landing Page)
// -----------------------------------------------------------------------------
console.log("[TEST 1] Auditing index.html Institutional Decoupling...");
const indexHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

// Must NOT contain direct cheat personas
assert(!indexHtml.includes("Mrs. Pooja Sharma"), "index.html must not contain cheat resident persona");
assert(!indexHtml.includes("RWA Secretary Narang"), "index.html must not contain cheat RWA secretary persona");
assert(!indexHtml.includes("Open Endorsement Portal"), "index.html must not contain direct unauthenticated endorsement shortcut");

// Must contain institutional statutory references
assert(indexHtml.includes("MCS Act 1960"), "index.html must highlight MCS Act 1960 compliance");
assert(indexHtml.includes("138") && indexHtml.includes("139"), "index.html must reference Model Bye-Laws 138 & 139");
assert(indexHtml.includes("DPDP Act 2023"), "index.html must highlight DPDP Act 2023 privacy");

// Must contain primary CTAs
assert(indexHtml.includes('href="/verify.html"'), "index.html must contain CTA to /verify.html");
assert(indexHtml.includes('href="/directory.html"'), "index.html must contain CTA to /directory.html");
assert(indexHtml.includes('href="/rwa_pilot_proposal.html"'), "index.html must contain CTA to /rwa_pilot_proposal.html");

// Must contain discreet demo launchpad link in footer
assert(indexHtml.includes('href="/demo.html"'), "index.html must contain discreet footer link to demo.html");
console.log("  ✓ index.html successfully decoupled into prestigious institutional portal with zero open cheat buttons");

// -----------------------------------------------------------------------------
// [SECTION 2] AUDITING demo.html (Evaluator Demo Switchboard)
// -----------------------------------------------------------------------------
console.log("\n[TEST 2] Auditing demo.html Evaluator Launchpad Parity...");
const demoHtml = fs.readFileSync(path.join(__dirname, "demo.html"), "utf8");

assert(demoHtml.includes("portfolio.html"), "demo.html must link to portfolio.html");
assert(demoHtml.includes("portfolio_aqua.html"), "demo.html must link to portfolio_aqua.html");
assert(demoHtml.includes("endorse.html"), "demo.html must link to endorse.html");
assert(demoHtml.includes("verify.html"), "demo.html must link to verify.html");
assert(demoHtml.includes("directory.html"), "demo.html must link to directory.html");
assert(demoHtml.includes("onboard.html"), "demo.html must link to onboard.html");
assert(demoHtml.includes("rwa_pilot_proposal.html"), "demo.html must link to rwa_pilot_proposal.html");
console.log("  ✓ demo.html provides full 7-surface evaluator switchboard access including Aquamorphic edition");

// -----------------------------------------------------------------------------
// [SECTION 3] AUDITING Multi-Worker Slug Creation & Coexistence
// -----------------------------------------------------------------------------
console.log("\n[TEST 3] Auditing Multi-Worker Storage Engine & Slug Generation...");
class StorageMock {
  constructor() { this.store = new Map(); }
  getItem(k) { return this.store.has(k) ? this.store.get(k) : null; }
  setItem(k, v) { this.store.set(k, String(v)); }
  removeItem(k) { this.store.delete(k); }
  clear() { this.store.clear(); }
  key(i) { return Array.from(this.store.keys())[i] || null; }
  get length() { return this.store.size; }
}

const mockStorage = new StorageMock();

function simulateOnboarding(name, role) {
  const nameSlug = (name || "worker").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "worker";
  const workerId = `w_${nameSlug}_${Date.now().toString(36)}`;
  const workerData = {
    id: workerId,
    name: name,
    role: role,
    tenure: "0 Yrs",
    households: 0,
    boundaries: ["Clean water & soap", "Agreed rest day"]
  };
  mockStorage.setItem("mny_worker_" + workerId, JSON.stringify(workerData));
  mockStorage.setItem("maanyata_active_user", JSON.stringify({ role: "worker", id: workerId, name: name }));
  return { workerId, redirectUrl: `/portfolio_aqua.html?worker=${encodeURIComponent(workerId)}` };
}

const worker1 = simulateOnboarding("Ramesh Kumar", "Driver & Chauffeur");
const worker2 = simulateOnboarding("Pooja Patil", "Childcare & Nanny");

assert(worker1.workerId.startsWith("w_ramesh_kumar_"), "Worker 1 must have slug w_ramesh_kumar_...");
assert(worker2.workerId.startsWith("w_pooja_patil_"), "Worker 2 must have slug w_pooja_patil_...");
assert.notStrictEqual(worker1.workerId, worker2.workerId, "Worker IDs must be unique");

// Verify coexistence
const rameshRaw = mockStorage.getItem("mny_worker_" + worker1.workerId);
const poojaRaw = mockStorage.getItem("mny_worker_" + worker2.workerId);
assert(rameshRaw, "Ramesh Kumar profile must exist in multi-worker storage");
assert(poojaRaw, "Pooja Patil profile must exist in multi-worker storage");
assert.strictEqual(JSON.parse(rameshRaw).name, "Ramesh Kumar", "Ramesh Kumar name intact");
assert.strictEqual(JSON.parse(poojaRaw).name, "Pooja Patil", "Pooja Patil name intact");

assert(worker1.redirectUrl.includes("portfolio_aqua.html?worker=w_ramesh_kumar_"), "Redirect must point to portfolio_aqua.html with worker query");
console.log("  ✓ Multi-worker slug generator creates non-colliding storage keys: w_ramesh_kumar and w_pooja_patil");

// -----------------------------------------------------------------------------
// [SECTION 4] AUDITING js/portfolio.js Dynamic Worker Parameter Resolution
// -----------------------------------------------------------------------------
console.log("\n[TEST 4] Auditing js/portfolio.js Dynamic ?worker= / ?id= Resolution...");
globalThis.window = {
  location: { search: `?worker=${encodeURIComponent(worker1.workerId)}`, hash: "", origin: "https://maanyata.org", pathname: "/portfolio_aqua.html" },
  localStorage: mockStorage,
  addEventListener: () => {}
};
globalThis.document = {
  documentElement: { getAttribute: () => "aqua", setAttribute: () => {}, classList: { add: () => {} }, style: { setProperty: () => {} } },
  getElementById: () => ({ textContent: "", innerHTML: "", style: {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} }, setAttribute: () => {} }),
  querySelector: () => ({ textContent: "", innerHTML: "", style: {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} }, setAttribute: () => {} }),
  querySelectorAll: () => [],
  addEventListener: () => {},
  readyState: "loading"
};
globalThis.localStorage = mockStorage;

// Evaluate portfolio.js
const portfolioJs = fs.readFileSync(path.join(__dirname, "js", "portfolio.js"), "utf8");
eval(portfolioJs);

const loadedRamesh = window.loadPortfolio();
assert.strictEqual(loadedRamesh.name, "Ramesh Kumar", "Must dynamically load Ramesh Kumar when ?worker= specified");
assert.strictEqual(loadedRamesh.role, "Driver & Chauffeur", "Must load Ramesh Kumar's specific role");

// Test with worker2
window.location.search = `?id=${encodeURIComponent(worker2.workerId)}`;
const loadedPooja = window.loadPortfolio();
assert.strictEqual(loadedPooja.name, "Pooja Patil", "Must dynamically load Pooja Patil when ?id= specified");

// Test default fallback (no query param)
window.location.search = "";
mockStorage.removeItem("maanyata_active_user");
const defaultLoaded = window.loadPortfolio();
assert.strictEqual(defaultLoaded.id, "sunita-devi-01", "Must default to Sunita Devi when no worker query or active user");
console.log("  ✓ js/portfolio.js correctly resolves ?worker=<id>, ?id=<id>, and falls back to sunita-devi-01");

// -----------------------------------------------------------------------------
// [SECTION 5] AUDITING directory.html Multi-Worker Discovery
// -----------------------------------------------------------------------------
console.log("\n[TEST 5] Auditing directory.html Multi-Worker Discovery...");
const directoryHtml = fs.readFileSync(path.join(__dirname, "directory.html"), "utf8");

// Verify directory scanning logic handles mny_worker_
assert(directoryHtml.includes("mny_worker_"), "directory.html must scan for mny_worker_ keys");
assert(directoryHtml.includes("portfolio_aqua.html?worker="), "directory.html must link cards to portfolio_aqua.html?worker=");
console.log("  ✓ directory.html integrates mny_worker_* multi-worker storage and links to portfolio_aqua");

console.log("\n================================================================================");
console.log("ALL SPRINT 3 VERIFICATION TESTS PASSED WITH 100% GROUND TRUTH (EXIT 0)!");
console.log("================================================================================");
process.exit(0);
