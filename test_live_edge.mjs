const BASE_URL = "https://project-maanyata.pages.dev";

async function runLiveTests() {
  console.log("=== RUNNING LIVE CLOUDFLARE EDGE TESTS ===");

  // 1. Test Societies
  console.log("\n1. Fetching /api/societies...");
  const socRes = await fetch(`${BASE_URL}/api/societies`);
  const socData = await socRes.json();
  console.log(`Status: ${socRes.status}`);
  console.log(`Societies loaded: ${socData.societies.length} societies found`);
  const vasudev = socData.societies.find(s => s.name === "Vasudev Complex");
  console.log(`Vasudev Complex present: ${!!vasudev}`);

  // 2. Test Fabricated Address '093, Shanti Paradise Homes'
  console.log("\n2. Testing Fabricated Residence: '093, Shanti Paradise Homes'...");
  const fakeRes = await fetch(`${BASE_URL}/api/endorse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workerId: "sunita-devi-01",
      unit: "093, Shanti Paradise Homes",
      society: "Shanti Paradise Homes",
      note: "Reliable helper."
    })
  });
  const fakeData = await fakeRes.json();
  console.log(`Status: ${fakeRes.status} (Expected: 400)`);
  console.log(`Response:`, fakeData);

  // 3. Test Zero-Width Defamation Bypass: 'c\u200Bh\u200Bo\u200Br'
  console.log("\n3. Testing Zero-Width Hidden Defamation...");
  const defRes = await fetch(`${BASE_URL}/api/endorse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workerId: "sunita-devi-01",
      unit: "G-1, 001, Vasudev Complex",
      society: "Vasudev Complex",
      note: "She is a c\u200Bh\u200Bo\u200Br"
    })
  });
  const defData = await defRes.json();
  console.log(`Status: ${defRes.status} (Expected: 400)`);
  console.log(`Response:`, defData);

  // 4. Test User Test Case: 'G-1, 001, Vasudev Complex'
  console.log("\n4. Testing Legitimate Endorsement: 'G-1, 001, Vasudev Complex'...");
  const legitRes = await fetch(`${BASE_URL}/api/endorse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workerId: "sunita-devi-01",
      unit: "G-1, 001, Vasudev Complex",
      society: "Vasudev Complex",
      note: "Exceptional cooking and honest service.",
      traits: ["Exceptional Cooking"],
      tenureYears: 2
    })
  });
  const legitData = await legitRes.json();
  console.log(`Status: ${legitRes.status} (Expected: 200 or 409 if already registered)`);
  console.log(`Success:`, legitData.success);
  if (legitData.worker) {
    console.log(`Worker: ${legitData.worker.name}, Households: ${legitData.worker.households}, Tenure: ${legitData.worker.tenure}`);
  } else {
    console.log(`Error:`, legitData.error);
  }

  // 5. Test Fresh Unit Endorsement
  console.log("\n5. Testing Fresh Unit in Vasudev Complex: 'Flat 204, Vasudev Complex'...");
  const freshRes = await fetch(`${BASE_URL}/api/endorse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workerId: "sunita-devi-01",
      unit: "Flat 204, Vasudev Complex",
      society: "Vasudev Complex",
      note: "Punctual, wonderful meals, completely trustworthy.",
      traits: ["Always On Time", "Exceptional Cooking"],
      tenureYears: 1
    })
  });
  const freshData = await freshRes.json();
  console.log(`Status: ${freshRes.status} (Expected: 200 or 409)`);
  console.log(`Success:`, freshData.success);
  if (freshData.worker) {
    console.log(`New Households Count: ${freshData.worker.households}`);
  }

  // 6. Fetch Worker Details from Edge
  console.log("\n6. Fetching Worker Passbook /api/worker/sunita-devi-01...");
  const wRes = await fetch(`${BASE_URL}/api/worker/sunita-devi-01`);
  const wData = await wRes.json();
  console.log(`Status: ${wRes.status}`);
  console.log(`Passbook Name: ${wData.worker?.name}`);
  console.log(`Total References on Passbook: ${wData.worker?.references?.length}`);
  const latestRef = wData.worker?.references?.[0];
  console.log(`Latest Reference Unit: ${latestRef?.unit}`);
  console.log(`Latest Reference Quote: "${latestRef?.quote}"`);
}

runLiveTests().catch(console.error);
