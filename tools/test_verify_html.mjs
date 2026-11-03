import crypto from "node:crypto";
import fs from "node:fs";

console.log("=== VERIFYING CRYPTOGRAPHIC PASS CHECK LOGIC ===");

const ISSUER_PUBLIC_KEY_B64URL = "nDSxM880-_l5Vtzjkhp_Mj6D7kfx4fp0zWKWl66Alps";

function b64urlToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(Buffer.from(s, "base64"));
}

// Load pure-JS TweetNaCl fallback
const naclCode = fs.readFileSync(new URL("../tweetnacl.min.js", import.meta.url), "utf8");
const fnNacl = new Function("module", "exports", naclCode);
const naclMod = { exports: {} };
fnNacl(naclMod, naclMod.exports);
const nacl = naclMod.exports.sign ? naclMod.exports : global.nacl;

async function checkCodeLogic(raw, forceFallback = false) {
  const trimmed = raw.trim();
  let token = trimmed;
  if (trimmed.includes("?")) {
    try {
      const url = new URL(trimmed.startsWith("http") ? trimmed : `https://dummy.host/${trimmed}`);
      token = url.searchParams.get("token") || url.searchParams.get("sig") || url.searchParams.get("p") || trimmed;
    } catch(e) {}
  }

  // Reject unsigned raw JSON
  if (token.startsWith("{") || !token.includes(".")) {
    return { ok: false, msg: "REJECTED: Unsigned pass" };
  }

  const [body, sig] = token.split(".");
  if (!body || !sig) {
    return { ok: false, msg: "REJECTED: Malformed Code" };
  }

  const pubBytes = b64urlToBytes(ISSUER_PUBLIC_KEY_B64URL);
  const sigBytes = b64urlToBytes(sig);
  const msgBytes = Buffer.from(body);

  let ok = false;

  // Strategy 1: WebCrypto Ed25519 (unless forceFallback is true)
  if (!forceFallback && crypto.subtle && crypto.subtle.verify) {
    try {
      const key = await crypto.subtle.importKey(
        "raw",
        pubBytes,
        { name: "Ed25519" },
        false,
        ["verify"]
      );
      ok = await crypto.subtle.verify("Ed25519", key, sigBytes, msgBytes);
    } catch(e) {
      ok = false;
    }
  }

  // Strategy 2: Pure-JS TweetNaCl Fallback for legacy Android WebViews
  if (!ok && nacl && nacl.sign && nacl.sign.detached) {
    try {
      ok = nacl.sign.detached.verify(msgBytes, sigBytes, pubBytes);
    } catch(e) {
      ok = false;
    }
  }

  if (!ok) {
    return { ok: false, msg: "REJECTED: Forged or Tampered Pass" };
  }

  const data = JSON.parse(Buffer.from(body, "base64url").toString());
  const now = Math.floor(Date.now() / 1000);
  if (data.exp && data.exp < now) {
    return { ok: false, msg: "EXPIRED PASS" };
  }

  return { ok: true, data };
}

async function run() {
  // Test 1: Fake unsigned JSON payload
  const fakePayload = JSON.stringify({ v: 2, name: "Impostor", endorsements: [{ verified: true, keys: true }] });
  const fakeResult = await checkCodeLogic(fakePayload);
  console.log("1. Unsigned fake JSON:", !fakeResult.ok ? "BLOCKED (Correct)" : "FAILED TO BLOCK");

  // Test 2: Fake unsigned URL ?p=
  const fakeUrl = "https://project-maanyata.pages.dev/verify.html?p=" + Buffer.from(fakePayload).toString("base64url");
  const fakeUrlResult = await checkCodeLogic(fakeUrl);
  console.log("2. Unsigned fake ?p= URL:", !fakeUrlResult.ok ? "BLOCKED (Correct)" : "FAILED TO BLOCK");

  // Test 3: Valid signed pass
  // Generate a valid signed pass using issue.mjs
  const { execSync } = await import("node:child_process");
  const validToken = execSync("node issue.mjs issue sunita-devi-01", { encoding: "utf8" }).trim();
  const validResult = await checkCodeLogic(validToken);
  console.log("3. Cryptographically signed pass:", validResult.ok ? "ACCEPTED (Verified)" : "FAILED TO VERIFY");

  // Test 4: Tampered signed pass
  const tamperedToken = validToken.slice(0, -4) + "AAAA";
  const tamperedResult = await checkCodeLogic(tamperedToken);
  console.log("4. Tampered signature pass:", !tamperedResult.ok ? "BLOCKED (Correct)" : "FAILED TO BLOCK");

  // Test 5: Legacy Android WebView Simulation (WebCrypto disabled, forced pure-JS fallback)
  const legacyResult = await checkCodeLogic(validToken, true);
  console.log("5. Legacy Android WebView pure-JS fallback:", legacyResult.ok ? "ACCEPTED (Verified via TweetNaCl)" : "FAILED TO VERIFY");

  const legacyTampered = await checkCodeLogic(tamperedToken, true);
  console.log("6. Legacy Android WebView tampered rejection:", !legacyTampered.ok ? "BLOCKED (Correct)" : "FAILED TO BLOCK");

  if (!fakeResult.ok && !fakeUrlResult.ok && validResult.ok && !tamperedResult.ok && legacyResult.ok && !legacyTampered.ok) {
    console.log("\nALL CRYPTOGRAPHIC TESTS PASSED (WebCrypto + Pure-JS Fallback)!");
  } else {
    process.exit(1);
  }
}

run();
