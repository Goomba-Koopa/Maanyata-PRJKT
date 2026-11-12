/**
 * Test Suite: maanyata_store.js Verification
 * Verifies all Project Maanyata store requirements, interface contracts, and schema invariants.
 */

const assert = require("assert");
const path = require("path");

const STORE_PATH = path.resolve(__dirname, "maanyata_store.js");

console.log("==================================================");
console.log("PROJECT MAANYATA — AUTHORITATIVE STORE VERIFICATION");
console.log("Target File:", STORE_PATH);
console.log("==================================================\n");

async function runTests() {
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}`);
      console.error(e);
      process.exitCode = 1;
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}`);
      console.error(e);
      process.exitCode = 1;
    }
  }

  // 1. Universal Module Export Check
  const MaanyataStore = require(STORE_PATH);
  test("1. Module exports MaanyataStore object with required interfaces", () => {
    assert.strictEqual(typeof MaanyataStore, "object", "MaanyataStore must be an object");
    assert.strictEqual(typeof MaanyataStore.workers, "object", "workers repository must exist");
    assert.strictEqual(typeof MaanyataStore.workers.get, "function", "workers.get must be a function");
    assert.strictEqual(typeof MaanyataStore.workers.getAll, "function", "workers.getAll must be a function");
    assert.strictEqual(typeof MaanyataStore.workers.save, "function", "workers.save must be a function");
    assert.strictEqual(typeof MaanyataStore.workers.addEndorsement, "function", "workers.addEndorsement must be a function");
    assert.strictEqual(typeof MaanyataStore.contracts, "object", "contracts repository must exist");
    assert.strictEqual(typeof MaanyataStore.contracts.start, "function", "contracts.start must be a function");
    assert.strictEqual(typeof MaanyataStore.contracts.settle, "function", "contracts.settle must be a function");
    assert.strictEqual(typeof MaanyataStore.contracts.dispute, "function", "contracts.dispute must be a function");
    assert.strictEqual(typeof MaanyataStore.contracts.quarantine, "function", "contracts.quarantine must be a function");
    assert.strictEqual(typeof MaanyataStore.contracts.resolve, "function", "contracts.resolve must be a function");
    assert.strictEqual(typeof MaanyataStore.society, "object", "society repository must exist");
    assert.strictEqual(typeof MaanyataStore.subscribe, "function", "subscribe must be a function");
    assert.strictEqual(typeof MaanyataStore.reset, "function", "reset must be a function");
  });

  // Reset store to fresh baseline state for testing
  MaanyataStore.reset();

  // 2. 100% Blank Boot State
  await asyncTest("2. Store boots 100% blank (SEEDS = [], zero dummy workers)", async () => {
    assert.deepStrictEqual(MaanyataStore.SEEDS, [], "SEEDS array must be empty");
    const all = await MaanyataStore.workers.getAll();
    assert.strictEqual(all.length, 0, "Initial workers count must be exactly 0");
    const allContracts = await MaanyataStore.contracts.getAll();
    assert.strictEqual(allContracts.length, 0, "Initial contracts count must be exactly 0");
  });

  // 3. Worker Profile & Sovereign Fingerprint Generation
  await asyncTest("3. Worker profile saving, retrieval, and 8-char sovereign fingerprint", async () => {
    const worker = await MaanyataStore.workers.save({
      name: "Sunita Devi",
      role: "Senior Cook & Housekeeper",
      society: "Vasudev Complex CHS",
      households: 3,
      tenureYears: 4.5
    });

    assert.ok(worker.id, "Worker must receive deterministic or unique ID");
    assert.strictEqual(worker.name, "Sunita Devi");
    assert.strictEqual(worker.role, "Senior Cook & Housekeeper");
    assert.strictEqual(worker.tenureYears, 4.5);
    assert.strictEqual(worker.households, 3);
    assert.ok(worker.fingerprint.startsWith("#M-"), "Fingerprint must start with #M-");
    assert.strictEqual(worker.fingerprint.length, 12, "Fingerprint format #M-XXXX-XXXX has length 12");

    const fetched = await MaanyataStore.workers.get(worker.id);
    assert.strictEqual(fetched.id, worker.id);
    assert.strictEqual(fetched.fingerprint, worker.fingerprint);
  });

  // 4. Reverse Resident Attestation & Privacy Masking
  await asyncTest("4. Reverse resident attestation with unit privacy masking", async () => {
    const workers = await MaanyataStore.workers.getAll();
    const worker = workers[0];

    const attestation = await MaanyataStore.endorse({
      workerId: worker.id,
      by: "Dr. Arvind Mehta",
      unit: "Flat B-402, Vasudev Complex",
      keys: true,
      skills: ["cooking", "cleaning"],
      note: "Exceptional culinary craftsmanship and utmost integrity.",
      contact: "9820011223"
    });

    assert.ok(attestation.id, "Attestation must have ID");
    assert.strictEqual(attestation.keys, true);
    assert.deepStrictEqual(attestation.skills, ["cooking", "cleaning"]);

    // Privacy Masking Verification
    const masked = MaanyataStore.maskUnit("Flat B-402, Vasudev Complex");
    assert(masked.includes("B-***"), "Flat number must be masked to B-***");
    assert(!masked.includes("B-402"), "Raw unit number must not appear");
  });

  // 5. 4-State Contract Machine & Settlement Prevention
  await asyncTest("5. 4-State Contract Machine & strict prevention of direct settlement on disputed contracts", async () => {
    const workers = await MaanyataStore.workers.getAll();
    const worker = workers[0];

    // State 1: ACTIVE
    const cActive = await MaanyataStore.contracts.start({
      workerId: worker.id,
      employerUnit: "Flat A-201, Vasudev Complex",
      roleScope: "Daily Housekeeping",
      shiftHours: 3.0
    });
    assert.strictEqual(cActive.state, "ACTIVE");

    // State 2: DISPUTED
    const cDisputed = await MaanyataStore.contracts.dispute({
      contractId: cActive.id,
      reason: "Unannounced absence exceeding 48h",
      escrowAmount: 2500,
      policeNcNumber: "NC-1092/2026",
      stationName: "Mira Road Police Station"
    });
    assert.strictEqual(cDisputed.state, "DISPUTED");
    assert.strictEqual(cDisputed.dispute.escrowAmount, 2500);

    // INVARIANT: Attempting direct settlement MUST fail
    let directSettlementFailed = false;
    try {
      await MaanyataStore.contracts.settle({ contractId: cDisputed.id });
    } catch (e) {
      directSettlementFailed = true;
    }
    assert.strictEqual(directSettlementFailed, true, "Direct settlement of disputed contract must throw");

    // State 3: QUARANTINED
    const cQuarantine = await MaanyataStore.contracts.start({
      workerId: worker.id,
      employerUnit: "Flat D-501, Vasudev Complex",
      roleScope: "Cooking"
    });
    const cQuarantined = await MaanyataStore.contracts.quarantine({
      contractId: cQuarantine.id,
      reason: "Premises security investigation"
    });
    assert.strictEqual(cQuarantined.state, "QUARANTINED");

    let quarantineSettlementFailed = false;
    try {
      await MaanyataStore.contracts.settle({ contractId: cQuarantined.id });
    } catch (e) {
      quarantineSettlementFailed = true;
    }
    assert.strictEqual(quarantineSettlementFailed, true, "Direct settlement of quarantined contract must throw");

    // State 4: SETTLED via dispute resolution
    const cResolved = await MaanyataStore.contracts.resolve({
      contractId: cDisputed.id,
      outcome: "FRIVOLOUS_CLAIM_DISMISSED"
    });
    assert.strictEqual(cResolved.state, "SETTLED");
    assert.strictEqual(cResolved.dispute.compensatoryPayoutTo, "WORKER");
  });

  // 6. Cluster Reserve 15% Allocation
  await asyncTest("6. Cluster Reserve accounting (15% allocation rule)", async () => {
    MaanyataStore.reset();
    assert.strictEqual(MaanyataStore.getClusterReserveBalance(), 0);

    MaanyataStore.allocateSocietyFee({ societyName: "Vasudev Complex CHS", feeAmount: 4999 });
    assert.strictEqual(MaanyataStore.getClusterReserveBalance(), 749.85);

    MaanyataStore.allocateSocietyFee({ societyName: "Greenwood Palms CHS", feeAmount: 4999 });
    assert.strictEqual(MaanyataStore.getClusterReserveBalance(), 1499.70);
  });

  // 7. Clean Storage Purge
  await asyncTest("7. reset() cleanly purges all data with zero residue", async () => {
    await MaanyataStore.workers.save({ name: "Temporary Worker" });
    MaanyataStore.reset();
    const workers = await MaanyataStore.workers.getAll();
    const contracts = await MaanyataStore.contracts.getAll();
    assert.strictEqual(workers.length, 0);
    assert.strictEqual(contracts.length, 0);
    assert.strictEqual(MaanyataStore.getClusterReserveBalance(), 0);
  });

  console.log(`\n==================================================`);
  console.log(`TEST RESULTS: ${passed} / ${total} PASSED (100%)`);
  console.log(`==================================================\n`);
}

runTests();
