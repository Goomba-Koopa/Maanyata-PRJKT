# Maanyata proof of concept

This tests one idea: a signed code can be checked at the gate with no internet and no server.

## What is here

- `issue.mjs`: runs on your laptop. Creates the signing keys and issues worker codes.
- `verify.html`: the gate checker. Works offline once loaded. Can be hosted on GitHub Pages like AXIOM.

## Steps (about an hour)

1. Install Node.js (version 18 or newer).
2. In this folder, run `node issue.mjs init`. Keys are created in `~/maanyata-keys/`, not in this folder.
3. Back up `~/maanyata-keys/issuer_private.pem` somewhere safe that is not this project.
4. Run `node issue.mjs pubkey`. Copy the output into `verify.html`, replacing `PASTE_PUBLIC_KEY_HERE`.
5. Run `node issue.mjs issue wkr-001`. Copy the long text it prints.
6. Open `verify.html` on a phone (camera needs https or localhost), paste the text, and tap Check code. You should see green.
7. Change one letter in the text and check again. You should see red.

## Known limits (be honest about these)

- Ed25519 in browsers needs a recent browser (Chrome 137+, Safari 17+, Firefox 129+). Older cheap Android phones may not support it. Test on the phone you actually plan to use.
- The camera scan uses jsQR from a CDN. It needs internet once to load the page.
- A screenshot of a valid code still passes. A photo check is needed to fix that, and is not in this PoC.
- Nothing here has been tested in a real browser or phone yet.

## Never do

- Do not commit `~/maanyata-keys/` or any `.pem` file to GitHub.
- Do not put the private key in `verify.html`. Only the public key belongs there.
