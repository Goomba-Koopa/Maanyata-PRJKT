/**
 * test_core_crypto_and_store.mjs
 * Comprehensive Forensic Audit & Hardening Test Suite for Project Maanyata:
 * 1. js/aadhaar_verifier.js
 * 2. maanyata_store.js
 * 3. js/dispute_modal.js
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("================================================================================");
console.log("   PROJECT MAANYATA — CORE CODE & OFFLINE CRYPTO FORENSIC AUDIT SUITE           ");
console.log("================================================================================\n");

// --------------------------------------------------------------------------------
// SECTION 1: AUDIT & VERIFY js/aadhaar_verifier.js
// --------------------------------------------------------------------------------
console.log("--- [SECTION 1] AUDITING js/aadhaar_verifier.js ---");

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const AadhaarVerifier = require("./js/aadhaar_verifier.js");

assert(AadhaarVerifier, "AadhaarVerifier must be exported");

// Check 1.1: Masking Aadhaar to DPDP Act standard
console.log("[Test 1.1] Testing Aadhaar masking (DPDP Act standard)...");
assert.strictEqual(AadhaarVerifier.maskAadhaar("987654321234"), "XXXX-XXXX-1234");
assert.strictEqual(AadhaarVerifier.maskAadhaar("1234"), "XXXX-XXXX-1234");
assert.strictEqual(AadhaarVerifier.maskAadhaar(""), "XXXX-XXXX-XXXX");
assert.strictEqual(AadhaarVerifier.maskAadhaar(null), "XXXX-XXXX-XXXX");
console.log("✓ Aadhaar masking adheres to XXXX-XXXX-1234 standard");

// Check 1.2: SHA-256 Digest Generation
console.log("\n[Test 1.2] Testing SHA-256 digest generation...");
const testInput = "MAANYATA:XXXX-XXXX-4921:SUNITA DEVI:1988";
const expectedHash = require("node:crypto").createHash("sha256").update(testInput).digest("hex");
const actualHash = await AadhaarVerifier.computeSha256(testInput);
assert.strictEqual(actualHash, expectedHash, "SHA-256 digest must match standard Node crypto SHA-256");
console.log(`✓ SHA-256 identity digest matches standard: ${actualHash}`);

// Check 1.3: Sandbox / Test Card Generation and Decoding (DPDP Verification)
console.log("\n[Test 1.3] Testing Sandbox Test Card generation & DPDP compliance...");
const testCardPayload = AadhaarVerifier.createTestCard({
  name: "Sunita Devi",
  yob: "1988",
  gender: "F",
  last4: "4921"
});
assert(testCardPayload.startsWith(AadhaarVerifier.TEST_PAYLOAD_PREFIX), "Must start with test prefix");

const decodedTestCard = await AadhaarVerifier.decodeAndVerify(testCardPayload);
assert.strictEqual(decodedTestCard.success, true);
assert.strictEqual(decodedTestCard.verified, true);
assert.strictEqual(decodedTestCard.isTestMode, true);
assert.strictEqual(decodedTestCard.name, "Sunita Devi");
assert.strictEqual(decodedTestCard.yob, "1988");
assert.strictEqual(decodedTestCard.gender, "F");
assert.strictEqual(decodedTestCard.maskedAadhaar, "XXXX-XXXX-4921");
assert.strictEqual(decodedTestCard.identityHash, expectedHash);
// Invariant check: raw 12-digit UID must NOT exist in decoded object
assert.strictEqual(decodedTestCard.raw.uid, undefined, "Raw 12-digit UID must NOT be present in raw");
console.log("✓ Sandbox test card successfully parsed and verified without raw UID storage");

// Check 1.4: XML V1 QR Code Parsing & Raw UID Sanitization
console.log("\n[Test 1.4] Testing XML V1 QR code parsing & raw UID purge...");
const raw12Uid = "918273645192";
const sampleXml = `<?xml version="1.0" encoding="UTF-8"?><PrintLetterBarcodeData uid="${raw12Uid}" name="Ramesh Kumar" gender="M" yob="1982" co="S/O Somnath" house="Flat 102" dist="Thane" state="Maharashtra" pc="401107" />`;

const decodedXml = await AadhaarVerifier.decodeAndVerify(sampleXml);
assert.strictEqual(decodedXml.success, true);
assert.strictEqual(decodedXml.name, "Ramesh Kumar");
assert.strictEqual(decodedXml.yob, "1982");
assert.strictEqual(decodedXml.gender, "M");
assert.strictEqual(decodedXml.maskedAadhaar, "XXXX-XXXX-5192");
// Invariant check: verify that raw 12-digit UID is NEVER stored in output
const serializedXml = JSON.stringify(decodedXml);
assert(!serializedXml.includes(raw12Uid), "Raw 12-digit UID must NEVER appear in output object or serialized JSON");
assert.strictEqual(decodedXml.raw.uid, undefined, "raw.uid must be purged");
console.log("✓ XML V1 QR parsed with raw 12-digit UID completely excluded from memory and serialization");

// Check 1.5: JSON Digital Pass Envelope Parsing & Raw UID Purge
console.log("\n[Test 1.5] Testing JSON Digital Pass envelope & DPDP purge...");
const jsonPass = JSON.stringify({
  uid: "123456789012",
  name: "Asha Kumari",
  yob: "1994",
  gender: "F",
  isTestMode: true,
  verified: true
});
const decodedJson = await AadhaarVerifier.decodeAndVerify(jsonPass);
assert.strictEqual(decodedJson.name, "Asha Kumari");
assert.strictEqual(decodedJson.maskedAadhaar, "XXXX-XXXX-9012");
const serializedJson = JSON.stringify(decodedJson);
assert(!serializedJson.includes("123456789012"), "Raw 12-digit UID must NEVER be present in JSON pass output");
assert.strictEqual(decodedJson.raw.uid, undefined, "raw.uid must be purged");
console.log("✓ JSON Digital Pass verified with zero raw UID retention");

// Check 1.6: Dual-Mode Scanning Interfaces (WebRTC Video Frame + File Upload)
console.log("\n[Test 1.6] Testing Dual-Mode Scanning Interfaces (WebRTC & File Upload)...");
assert.strictEqual(typeof AadhaarVerifier.scanVideoFrame, "function", "scanVideoFrame must be a function");
assert.strictEqual(typeof AadhaarVerifier.scanImageFile, "function", "scanImageFile must be a function");

// Verify scanVideoFrame gracefully returns null when video is not ready
const mockVideoNotReady = { readyState: 0, HAVE_ENOUGH_DATA: 4 };
const mockCanvas = {};
const videoResult = AadhaarVerifier.scanVideoFrame(mockVideoNotReady, mockCanvas);
assert.strictEqual(videoResult, null, "Must return null when video has not received enough data");

// Verify scanVideoFrame calls scanner when video is ready
let scannerCalled = false;
globalThis.jsQR = function (data, width, height, opts) {
  scannerCalled = true;
  return { data: testCardPayload };
};
const mockCtx = {
  drawImage: () => {},
  getImageData: () => ({ data: new Uint8ClampedArray(100), width: 10, height: 10 })
};
const mockVideoReady = {
  readyState: 4,
  HAVE_ENOUGH_DATA: 4,
  videoWidth: 640,
  videoHeight: 480
};
const mockCanvasElement = {
  getContext: () => mockCtx
};
const frameData = AadhaarVerifier.scanVideoFrame(mockVideoReady, mockCanvasElement);
assert.strictEqual(scannerCalled, true, "jsQR scanner must be invoked on video frame");
assert.strictEqual(frameData, testCardPayload, "Extracted frame payload must match testCardPayload");
delete globalThis.jsQR;
console.log("✓ WebRTC live camera frame scanning interface verified");


// --------------------------------------------------------------------------------
// SECTION 2: AUDIT & VERIFY maanyata_store.js
// --------------------------------------------------------------------------------
console.log("\n--- [SECTION 2] AUDITING maanyata_store.js ---");

const MaanyataStore = require("./maanyata_store.js");
assert(MaanyataStore, "MaanyataStore must export object");

// Check 2.1: Blank Initial Seed State (SEEDS = [])
console.log("[Test 2.1] Testing 100% blank boot state (SEEDS = [])...");
MaanyataStore.reset();
assert.deepStrictEqual(MaanyataStore.SEEDS, [], "SEEDS array must be strictly empty []");
const initialWorkers = await MaanyataStore.workers.getAll();
assert.strictEqual(initialWorkers.length, 0, "Initial workers list must be exactly 0 (blank boot state)");
const initialContracts = await MaanyataStore.contracts.getAll();
assert.strictEqual(initialContracts.length, 0, "Initial contracts list must be exactly 0 (blank boot state)");
console.log("✓ Store boots 100% blank with zero dummy or synthetic records");

// Check 2.2: 4-State Contract Machine & Direct Settlement Prevention
console.log("\n[Test 2.2] Testing 4-State Contract Machine & settlement prevention on disputed contracts...");
const states = MaanyataStore.CONTRACT_STATE;
assert.strictEqual(states.ACTIVE, "ACTIVE");
assert.strictEqual(states.SETTLED, "SETTLED");
assert.strictEqual(states.DISPUTED, "DISPUTED");
assert.strictEqual(states.QUARANTINED, "QUARANTINED");

// Step A: Start Contract -> ACTIVE
const c1 = await MaanyataStore.contracts.start({
  workerId: "w-test-sunita",
  employerUnit: "Flat B-402, Vasudev Complex",
  roleScope: "Daily Cooking and Housekeeping",
  shiftHours: 2.5
});
assert.strictEqual(c1.state, "ACTIVE");
assert.strictEqual(c1.maskedUnit, "Flat B-***, Vasudev Complex");

// Step B: Settle an ACTIVE contract -> SETTLED
const settledC1 = await MaanyataStore.contracts.settle({ contractId: c1.id });
assert.strictEqual(settledC1.state, "SETTLED");
assert.ok(settledC1.settledAt, "Must record settledAt timestamp");

// Step C: Start a second contract and dispute it -> DISPUTED
const c2 = await MaanyataStore.contracts.start({
  workerId: "w-test-ramesh",
  employerUnit: "Flat C-104, Vasudev Complex",
  roleScope: "Society Driver Services",
  shiftHours: 4.0
});
assert.strictEqual(c2.state, "ACTIVE");

const disputedC2 = await MaanyataStore.contracts.dispute({
  contractId: c2.id,
  reason: "Unannounced service abandonment exceeding 72 hours",
  escrowAmount: 2500,
  policeNcNumber: "NC-8492/2026",
  stationName: "Mira Road Police Station"
});
assert.strictEqual(disputedC2.state, "DISPUTED");
assert.strictEqual(disputedC2.dispute.escrowAmount, 2500);
assert.strictEqual(disputedC2.dispute.escrowLocked, true);
assert.strictEqual(disputedC2.dispute.policeNcNumber, "NC-8492/2026");

// Step D: Invariant Enforcement — Direct settlement of DISPUTED contract MUST fail!
let settlementPrevented = false;
try {
  await MaanyataStore.contracts.settle({ contractId: c2.id });
} catch (err) {
  settlementPrevented = true;
  assert(err.message.includes("Cannot settle contract in DISPUTED state"), "Error message must state state invariant");
}
assert.strictEqual(settlementPrevented, true, "Direct settlement of disputed contract MUST throw an error");

// Step E: Quarantine a third contract -> QUARANTINED
const c3 = await MaanyataStore.contracts.start({
  workerId: "w-test-asha",
  employerUnit: "Row House 14, Vasudev Complex",
  roleScope: "Childcare Assistant"
});
const quarantinedC3 = await MaanyataStore.contracts.quarantine({
  contractId: c3.id,
  reason: "Premises security investigation regarding access key"
});
assert.strictEqual(quarantinedC3.state, "QUARANTINED");

// Invariant Enforcement — Direct settlement of QUARANTINED contract MUST fail!
let quarantineSettlementPrevented = false;
try {
  await MaanyataStore.contracts.settle({ contractId: c3.id });
} catch (err) {
  quarantineSettlementPrevented = true;
  assert(err.message.includes("Cannot settle contract in QUARANTINED state"));
}
assert.strictEqual(quarantineSettlementPrevented, true, "Direct settlement of quarantined contract MUST throw an error");
console.log("✓ All 4 contract states verified; direct settlement of DISPUTED and QUARANTINED contracts is strictly blocked");

// Check 2.3: Malice / Frivolous Dispute Forfeiture Resolution
console.log("\n[Test 2.3] Testing Malice Forfeiture Resolution (₹2,000 to worker)...");
const resolvedC2 = await MaanyataStore.contracts.resolve({
  contractId: c2.id,
  outcome: "FRIVOLOUS_CLAIM_DISMISSED"
});
assert.strictEqual(resolvedC2.state, "SETTLED");
assert.strictEqual(resolvedC2.dispute.status, "RESOLVED");
assert.strictEqual(resolvedC2.dispute.outcome, "FRIVOLOUS_CLAIM_DISMISSED");
assert.strictEqual(resolvedC2.dispute.compensatoryPayoutTo, "WORKER", "Must forfeit ₹2,000 compensatory payout to WORKER");
assert.strictEqual(resolvedC2.dispute.escrowLocked, false, "Escrow must unlock upon resolution");
console.log("✓ Frivolous dispute forfeiture correctly awards compensatory restitution to worker");

// Check 2.4: Cluster Reserve Accounting (15% allocation rule)
console.log("\n[Test 2.4] Testing Cluster Reserve 15% allocation accounting...");
assert.strictEqual(MaanyataStore.getClusterReserveBalance(), 0, "Initial reserve balance must be 0");

// Deposit annual society fee: ₹4,999.00 -> 15% = ₹749.85
const crState1 = MaanyataStore.allocateSocietyFee({
  societyName: "Vasudev Complex CHS",
  feeAmount: 4999
});
assert.strictEqual(crState1.balance, 749.85, "15% of ₹4,999 must equal ₹749.85");
assert.strictEqual(MaanyataStore.getClusterReserveBalance(), 749.85);

// Deposit second society fee: ₹4,999.00 -> Balance becomes ₹1,499.70
const crState2 = MaanyataStore.allocateSocietyFee({
  societyName: "Greenwood Palms CHS",
  feeAmount: 4999
});
assert.strictEqual(crState2.balance, 1499.70, "Cumulative reserve balance must equal ₹1,499.70");
assert.strictEqual(MaanyataStore.getClusterReserveBalance(), 1499.70);
assert.strictEqual(crState2.transactions.length, 2, "Must record 2 ledger transactions");
console.log(`✓ Cluster reserve accounting verified (15% per society fee = ₹749.85; total: ₹${crState2.balance})`);

// Check 2.5: Zero-Residue Storage Purge via reset()
console.log("\n[Test 2.5] Testing reset() for zero residue...");
// Add test worker and endorsements
const savedWorker = await MaanyataStore.workers.save({
  name: "Sunita Devi",
  role: "Senior Cook",
  society: "Vasudev Complex CHS"
});
await MaanyataStore.endorse({
  workerId: savedWorker.id,
  by: "Dr. Arvind Mehta",
  unit: "Flat A-301, Vasudev Complex",
  keys: true,
  skills: ["cooking"],
  note: "Exemplary culinary craftsmanship."
});

const preResetWorkers = await MaanyataStore.workers.getAll();
assert.strictEqual(preResetWorkers.length, 1);
const preResetContracts = await MaanyataStore.contracts.getAll();
assert.strictEqual(preResetContracts.length, 3);
assert.strictEqual(MaanyataStore.getClusterReserveBalance(), 1499.70);

// Now execute store reset
MaanyataStore.reset();

const postResetWorkers = await MaanyataStore.workers.getAll();
assert.strictEqual(postResetWorkers.length, 0, "Post-reset workers must be 0");
const postResetContracts = await MaanyataStore.contracts.getAll();
assert.strictEqual(postResetContracts.length, 0, "Post-reset contracts must be 0");
assert.strictEqual(MaanyataStore.getClusterReserveBalance(), 0, "Post-reset cluster reserve must be 0");
console.log("✓ reset() cleanly and completely purges all data with zero residue");


// --------------------------------------------------------------------------------
// SECTION 3: AUDIT & VERIFY js/dispute_modal.js
// --------------------------------------------------------------------------------
console.log("\n--- [SECTION 3] AUDITING js/dispute_modal.js ---");

const DisputeModal = require("./js/dispute_modal.js");
assert(DisputeModal, "DisputeModal must export object");
assert.strictEqual(typeof DisputeModal.open, "function", "DisputeModal.open must be a function");
assert.strictEqual(typeof DisputeModal.close, "function", "DisputeModal.close must be a function");

// Verify modal code contains required statutory text & elements
const disputeModalJs = fs.readFileSync("./js/dispute_modal.js", "utf8");
assert(disputeModalJs.includes("₹2,500"), "Must include mandatory ₹2,500 escrow requirement");
assert(disputeModalJs.includes("₹2,000.00 forfeits directly to the worker"), "Must include ₹2,000 forfeiture warning");
assert(disputeModalJs.includes("₹500.00"), "Must include ₹500 administrative review fee");
assert(disputeModalJs.includes("Police Station NC Number"), "Must require Police Station NC Number");
assert(disputeModalJs.includes("Jurisdiction Station Name"), "Must require Jurisdiction Station Name");
assert(disputeModalJs.includes("upi://pay"), "Must include UPI escrow trigger URI");
console.log("✓ js/dispute_modal.js contains all mandatory statutory escrow, Police NC, and forfeiture rules");

console.log("\n================================================================================");
console.log("   ALL FORENSIC AUDIT & HARDENING CHECKS PASSED WITH 100% GROUND TRUTH!         ");
console.log("================================================================================\n");
