// POST /api/issue - Issue an authentic Ed25519 Sovereign QR Envelope
import { stripZeroWidth, getKVWorker } from "./_common.js";

// Canonical Demo Authority Key (PKCS8 DER for Ed25519)
// Seed: "maanyata-authority-demo-seed-202"
// Generates public key: F2nd-C6Eit0X-E32vtz06TUdZ8rVP4qeeYQZUVUZfpE
const CANONICAL_DEMO_SEED = new Uint8Array([
  0x6d, 0x61, 0x61, 0x6e, 0x79, 0x61, 0x74, 0x61,
  0x2d, 0x61, 0x75, 0x74, 0x68, 0x6f, 0x72, 0x69,
  0x74, 0x79, 0x2d, 0x64, 0x65, 0x6d, 0x6f, 0x2d,
  0x73, 0x65, 0x65, 0x64, 0x2d, 0x32, 0x30, 0x32
]);

// PKCS#8 ASN.1 prefix for Ed25519 seed (RFC 8410)
const ED25519_PKCS8_PREFIX = new Uint8Array([
  0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06,
  0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20
]);

function buildPKCS8(seedBytes) {
  const pkcs8 = new Uint8Array(ED25519_PKCS8_PREFIX.length + seedBytes.length);
  pkcs8.set(ED25519_PKCS8_PREFIX, 0);
  pkcs8.set(seedBytes, ED25519_PKCS8_PREFIX.length);
  return pkcs8;
}

function b64url(buf) {
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const wid = stripZeroWidth(data.wid || data.workerId || "demo-sunita-01").slice(0, 60);
    const name = stripZeroWidth(data.name || "Worker").slice(0, 60);
    const role = stripZeroWidth(data.role || "Specialist").slice(0, 60);
    const attestedYears = Number(data.attestedYears || 0);

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 7 * 86400; // 7 days TTL

    const payload = {
      wid,
      name,
      role,
      attestedYears,
      exp
    };

    const payloadStr = JSON.stringify(payload);
    const payloadB64 = b64url(new TextEncoder().encode(payloadStr));

    // Sign payload using deterministic Sovereign Authority Ed25519 key
    const pkcs8Key = buildPKCS8(CANONICAL_DEMO_SEED);
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      pkcs8Key,
      { name: "Ed25519" },
      false,
      ["sign"]
    );
    const sigBuf = await crypto.subtle.sign("Ed25519", privateKey, new TextEncoder().encode(payloadB64));
    const sigB64 = b64url(sigBuf);

    const token = `MNY1.${payloadB64}.${sigB64}`;

    return new Response(JSON.stringify({ success: true, token, payload }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message || "Sign error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
