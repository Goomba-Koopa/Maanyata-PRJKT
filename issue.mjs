// Maanyata PoC — issuer tool. Runs on YOUR laptop only.
// Usage:
//   node issue.mjs init                 (run once: creates signing keys)
//   node issue.mjs pubkey               (prints the public key to paste into verify.html)
//   node issue.mjs issue <worker-id> [days]   (default 90 days)
//
// The PRIVATE key lives in ~/maanyata-keys/, outside this project folder.
// Never copy it into the project, a GitHub repo, or the hosted site.

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const KEY_DIR = path.join(os.homedir(), "maanyata-keys");
const PRIV = path.join(KEY_DIR, "issuer_private.pem");
const PUB = path.join(KEY_DIR, "issuer_public.pem");

const b64url = (buf) => Buffer.from(buf).toString("base64url");

function init() {
  if (fs.existsSync(PRIV)) {
    console.log("Keys already exist in", KEY_DIR, "- not overwriting.");
    return;
  }
  fs.mkdirSync(KEY_DIR, { recursive: true, mode: 0o700 });
  const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
  fs.writeFileSync(PRIV, privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600 });
  fs.writeFileSync(PUB, publicKey.export({ type: "spki", format: "pem" }));
  console.log("Created keys in", KEY_DIR);
  console.log("Back up issuer_private.pem to a second safe place NOW.");
  console.log("If it is lost, you cannot issue new credentials.");
}

function loadPrivate() {
  if (!fs.existsSync(PRIV)) {
    console.error("No keys found. Run: node issue.mjs init");
    process.exit(1);
  }
  return crypto.createPrivateKey(fs.readFileSync(PRIV));
}

function pubkey() {
  const priv = loadPrivate();
  const pub = crypto.createPublicKey(priv);
  // Browsers want the raw 32-byte Ed25519 key: the last 32 bytes of the SPKI DER.
  const der = pub.export({ type: "spki", format: "der" });
  console.log(b64url(der.subarray(-32)));
}

function issue(wid, days = 90) {
  if (!wid) {
    console.error("Usage: node issue.mjs issue <worker-id> [days]");
    process.exit(1);
  }
  const priv = loadPrivate();
  const now = Math.floor(Date.now() / 1000);
  // Deliberately no name, phone, or address: the QR is readable by anyone's camera.
  const body = b64url(JSON.stringify({ v: 1, wid, iat: now, exp: now + days * 86400 }));
  const sig = crypto.sign(null, Buffer.from(body), priv); // Ed25519 signs the body text
  console.log(`${body}.${b64url(sig)}`);
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === "init") init();
else if (cmd === "pubkey") pubkey();
else if (cmd === "issue") issue(args[0], args[1] ? Number(args[1]) : 90);
else {
  console.log("Commands: init | pubkey | issue <worker-id> [days]");
}
