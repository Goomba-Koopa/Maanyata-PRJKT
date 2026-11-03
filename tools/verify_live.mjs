const BASE_URL = "https://project-maanyata.pages.dev";

async function verify() {
  console.log("=== VERIFYING LIVE PRODUCTION ENDPOINTS ===");
  const res = await fetch(`${BASE_URL}/api/workers`);
  const data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(`Workers returned: ${data.workers?.length}`);

  let phoneFound = false;
  let unmaskedUnitFound = false;

  data.workers.forEach(w => {
    console.log(`\nWorker: ${w.name} | Tenure: ${w.tenure} | Households: ${w.households}`);
    (w.references || []).forEach((r, i) => {
      console.log(`  [Ref ${i + 1}] Unit: "${r.unit}" | Contact: ${r.contact}`);
      if (r.contact !== null && r.contact !== undefined) {
        phoneFound = true;
      }
      if (/\b\d{2,4}\b/.test(r.unit) && !r.unit.includes("***")) {
        unmaskedUnitFound = true;
      }
    });
  });

  console.log("\n--- AUDIT ASSERTIONS ---");
  console.log("1. Zero unmasked phone numbers present:", !phoneFound ? "PASSED (Clean)" : "FAILED (PII leaked)");
  console.log("2. Units properly privacy-masked:", !unmaskedUnitFound ? "PASSED (Masked)" : "FAILED (Unmasked)");
  
  const sunita = data.workers.find(w => w.id === "sunita-devi-01");
  console.log("3. Sunita Devi tenure restored:", sunita?.tenure === "8.5 Yrs" ? "PASSED (8.5 Yrs)" : `FAILED (${sunita?.tenure})`);

  if (phoneFound || unmaskedUnitFound || sunita?.tenure !== "8.5 Yrs") {
    process.exit(1);
  }
}

verify().catch(e => {
  console.error("Verification failed:", e);
  process.exit(1);
});
