import {
  stripZeroWidth,
  isSafeContent,
  validateResidence,
  isValidResidenceUnit,
  normalizeUnit,
  maskUnit
} from "../functions/api/_common.js";

console.log("=== RUNNING EDGE DEFENSE UNIT TESTS ===");

let passed = 0;
let total = 0;

function test(title, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`[PASS] ${title}`);
  } catch (e) {
    console.error(`[FAIL] ${title}: ${e.message}`);
  }
}

// 1. Zero-width character & Defamation bypass tests
test("Zero-width characters are stripped", () => {
  const hidden = "c\u200Bh\u200Bo\u200Br";
  const stripped = stripZeroWidth(hidden);
  if (stripped !== "chor") throw new Error(`Expected 'chor', got '${stripped}'`);
});

test("Defamation with zero-width evasion is caught", () => {
  const hidden = "She is a c\u200Bh\u200Bo\u200Br and s\u200Bt\u200Be\u200Ba\u200Bl\u200Bs";
  if (isSafeContent(hidden)) throw new Error("Should have caught hidden defamation!");
});

test("Clean, positive endorsement passes content safety", () => {
  const note = "Exceptional cooking, very honest and trustworthy with house keys.";
  if (!isSafeContent(note)) throw new Error("Clean positive note was falsely blocked!");
});

test("Direct criminal accusations are blocked", () => {
  if (isSafeContent("Chor hai, stole money")) throw new Error("Should block 'chor' / 'stole'");
  if (isSafeContent("Police complaint lodged")) throw new Error("Should block 'police'");
  if (isSafeContent("Committed fraud 420")) throw new Error("Should block 'fraud' / '420'");
});

// 2. Residence validation tests
test("User case: 'G-1, 001, Vasudev Complex' passes validation", () => {
  const res = validateResidence("G-1, 001, Vasudev Complex", "Vasudev Complex");
  if (!res.valid) throw new Error(`Expected valid, got: ${res.error}`);
});

test("User case: '093, Shanti Paradise Homes' fails validation (fabricated place)", () => {
  const res = validateResidence("093, Shanti Paradise Homes", "");
  if (res.valid) throw new Error("Expected invalid for fabricated building!");
});

test("Legitimate Maryland Palms apartment passes", () => {
  const res = validateResidence("Flat B-402, Maryland Palms CHS", "Maryland Palms CHS");
  if (!res.valid) throw new Error(`Expected valid, got: ${res.error}`);
});

test("Out of range flat in Maryland Palms fails", () => {
  const res = validateResidence("Flat B-9999, Maryland Palms CHS", "Maryland Palms CHS");
  if (res.valid) throw new Error("Expected out-of-range flat to fail!");
});

test("Dummy garbage inputs fail", () => {
  if (isValidResidenceUnit("ff")) throw new Error("ff should fail");
  if (isValidResidenceUnit("asdf")) throw new Error("asdf should fail");
  if (isValidResidenceUnit("qwerty")) throw new Error("qwerty should fail");
  if (isValidResidenceUnit("none")) throw new Error("none should fail");
});

test("Privacy masking suppresses flat number and preserves society", () => {
  const masked = maskUnit("Flat B-402, Maryland Palms CHS");
  if (masked.includes("B-402") || masked.includes("402")) throw new Error(`Expected flat number to be purged, got ${masked}`);
  if (!masked.includes("Maryland Palms CHS")) throw new Error(`Expected Maryland Palms CHS, got ${masked}`);
});

console.log(`\nResults: ${passed}/${total} passed`);
if (passed !== total) process.exit(1);
