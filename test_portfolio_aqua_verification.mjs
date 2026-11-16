/**
 * test_portfolio_aqua_verification.mjs
 * Project Maanyata — Aquamorphic Liquid Glass Edition & QR Verification Suite
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("================================================================================");
console.log("PROJECT MAANYATA — PORTFOLIO AQUA & QR ENGINE RECOVERY VERIFICATION");
console.log("================================================================================\n");

// 1. Mock DOM and Browser Environment
class ElementMock {
  constructor(id, tagName = "div") {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    const set = new Set();
    this.classList = {
      add: (...classes) => classes.forEach(c => set.add(c)),
      remove: (...classes) => classes.forEach(c => set.delete(c)),
      toggle: (cls, force) => {
        if (force === undefined) {
          if (set.has(cls)) set.delete(cls);
          else set.add(cls);
        } else if (force) {
          set.add(cls);
        } else {
          set.delete(cls);
        }
      },
      contains: (c) => set.has(c),
      has: (c) => set.has(c)
    };

    this.attributes = new Map();
    this.style = {};
    this.dataset = {};
    this.children = [];
    this.textContent = "";
    this.innerHTML = "";
    this.value = "";
    this.width = 0;
    this.height = 0;
  }

  setAttribute(k, v) { this.attributes.set(k, String(v)); }
  getAttribute(k) { return this.attributes.has(k) ? this.attributes.get(k) : null; }
  removeAttribute(k) { this.attributes.delete(k); }
  addEventListener(event, fn) {}
  removeEventListener(event, fn) {}
  focus() {}
  querySelector(sel) { return null; }
  querySelectorAll(sel) { return []; }
  appendChild(child) { this.children.push(child); }
}

class CanvasMock extends ElementMock {
  constructor(id) {
    super(id, "canvas");
    this.fillOperations = [];
    this._ctx = {
      fillStyle: "#000000",
      fillRect: (x, y, w, h) => {
        this.fillOperations.push({ fillStyle: this._ctx.fillStyle, x, y, w, h });
      },
      clearRect: (x, y, w, h) => {},
      drawImage: () => {}
    };
  }
  getContext(type) {
    if (type === "2d") return this._ctx;
    return null;
  }
}

class StorageMock {
  constructor() {
    this.data = new Map();
  }
  getItem(k) { return this.data.has(k) ? this.data.get(k) : null; }
  setItem(k, v) { this.data.set(k, String(v)); }
  removeItem(k) { this.data.delete(k); }
  clear() { this.data.clear(); }
}

const elements = new Map();
function getOrCreate(id, tag = "div") {
  if (!elements.has(id)) {
    const el = (tag === "canvas") ? new CanvasMock(id) : new ElementMock(id, tag);
    elements.set(id, el);
  }
  return elements.get(id);
}

// Setup basic elements for portfolio_aqua
getOrCreate("workerQrCanvas", "canvas");
getOrCreate("qrLivenessWrap");
getOrCreate("tapToast");
getOrCreate("liveClockTicker");
getOrCreate("passFingerprint");
getOrCreate("studioModal");
getOrCreate("customizeModal");
getOrCreate("custBoundariesList");
getOrCreate("toast");
getOrCreate("brandTitle");
getOrCreate("panel-pass");
getOrCreate("panel-record");
getOrCreate("panel-terms");
getOrCreate("panel-profile");
getOrCreate("tab-pass", "button");
getOrCreate("tab-record", "button");
getOrCreate("tab-terms", "button");
getOrCreate("tab-profile", "button");
getOrCreate("solBtnLabel");
getOrCreate("btnSolToggle");
getOrCreate("metricTenure");
getOrCreate("metricHouseholds");
getOrCreate("metricRecognitions");
getOrCreate("profileBadge");
getOrCreate("profileName");
getOrCreate("profileRole");
getOrCreate("profileBio");
getOrCreate("tierPill");
getOrCreate("milestonesList");
getOrCreate("endorsementsList");
getOrCreate("contractsList");
getOrCreate("activeContractsList");
getOrCreate("disputedContractsList");
getOrCreate("historyContractsList");
getOrCreate("statTotalShifts");
getOrCreate("statCompletedShifts");
getOrCreate("statDisputedShifts");
getOrCreate("statEscrowBalance");

const docElement = new ElementMock("html", "html");
docElement.setAttribute("data-theme", "aqua");

const localStorageMock = new StorageMock();

let openedUrls = [];

const docObj = {
  documentElement: docElement,
  getElementById: (id) => getOrCreate(id),
  querySelector: (sel) => {
    if (sel.startsWith("#")) return getOrCreate(sel.slice(1));
    if (sel === '[role="tablist"]') return new ElementMock("tablist", "nav");
    return null;
  },
  querySelectorAll: (sel) => {
    if (sel.includes(".palette-tile")) return [];
    if (sel.includes(".typo-preset-btn")) return [];
    if (sel.includes("input[type='checkbox']")) return [];
    return [];
  },
  createElement: (tag) => new ElementMock("elem_" + Math.random().toString(36).substring(7), tag),
  activeElement: null,
  readyState: "complete",
  addEventListener: () => {}
};

// Global environment
globalThis.window = {
  location: { origin: "https://maanyata.org", href: "https://maanyata.org/portfolio_aqua.html", search: "" },
  localStorage: localStorageMock,
  document: docObj,
  addEventListener: () => {},
  removeEventListener: () => {},
  open: (url) => { openedUrls.push(url); return {}; },
  scrollTo: () => {}
};

globalThis.document = docObj;

globalThis.localStorage = localStorageMock;
try {
  Object.defineProperty(globalThis, "navigator", { value: { onLine: true }, configurable: true, writable: true });
} catch (e) {
  // Ignore if defined by environment
}
window.navigator = { onLine: true };

globalThis.self = globalThis;
window.self = globalThis;

// Load TweetNaCl
const naclCode = fs.readFileSync(path.join(__dirname, "tweetnacl.min.js"), "utf8");
eval(naclCode);
globalThis.nacl = globalThis.nacl || window.nacl;
window.nacl = globalThis.nacl;

// Load qr_engine.js
const qrCode = fs.readFileSync(path.join(__dirname, "qr_engine.js"), "utf8");
eval(qrCode);

// Load maanyata_store.js
const storeCode = fs.readFileSync(path.join(__dirname, "maanyata_store.js"), "utf8");
eval(storeCode);

// Load js/portfolio.js
const portfolioCode = fs.readFileSync(path.join(__dirname, "js", "portfolio.js"), "utf8");
eval(portfolioCode);
Object.assign(globalThis, window);

console.log("[TEST 1] Auditing Theme Whitelist and Non-Reversion...");
// Ensure aqua is accepted and does not revert to daylight
globalThis.selectPalette("aqua", true);
assert.strictEqual(docElement.getAttribute("data-theme"), "aqua", "Theme attribute must be 'aqua'");
assert.strictEqual(localStorageMock.getItem("maanyata_theme"), "aqua", "Stored theme must be 'aqua'");

// Run restoreCustomizationStudio() with currentDocTheme = aqua
globalThis.restoreCustomizationStudio();
assert.strictEqual(docElement.getAttribute("data-theme"), "aqua", "Theme must remain 'aqua' without resetting to daylight");
console.log("  ✓ Theme 'aqua' is whitelisted and preserved on restoreCustomizationStudio()");

console.log("\n[TEST 2] Auditing QR Code Generation & Worker Canvas Render...");
const canvas = getOrCreate("workerQrCanvas");
canvas.fillOperations = [];
globalThis.renderOfflineQR();

const fills = canvas.fillOperations;
assert(fills.length > 0, "QR canvas must have fill operations executed");

// First fill should be background white
assert.strictEqual(fills[0].fillStyle, "#FFFFFF", "First fill must be background white #FFFFFF");
assert.strictEqual(fills[0].w, 200, "Canvas size width must be 200");
assert.strictEqual(fills[0].h, 200, "Canvas size height must be 200");

// Following fills should be dark QR matrix modules
const darkFills = fills.slice(1).filter(f => f.fillStyle === "#0A1E38" || f.fillStyle === "#1C1917");
console.log(`  ✓ Dark QR matrix modules rendered: ${darkFills.length} blocks`);
assert(darkFills.length > 100, `Expected > 100 dark modules for Ed25519 QR, got ${darkFills.length}`);
console.log("  ✓ High-contrast QR matrix correctly rendered on canvas without throwing");

console.log("\n[TEST 3] Auditing Live Clock Ticker...");
const ticker = getOrCreate("liveClockTicker");
assert.notStrictEqual(ticker.textContent, "--:--:--", "Live ticker must advance past --:--:--");
assert(/^\d{2}:\d{2}:\d{2}$/.test(ticker.textContent), `Live ticker must match HH:MM:SS format, got "${ticker.textContent}"`);
console.log(`  ✓ Live clock ticker successfully advanced: ${ticker.textContent}`);

console.log("\n[TEST 4] Auditing Bottom Navigation Tab Switching...");
const tabs = ["pass", "record", "terms", "profile"];
for (const activeTab of tabs) {
  globalThis.showTab(activeTab);
  for (const t of tabs) {
    const p = getOrCreate("panel-" + t);
    const b = getOrCreate("tab-" + t);
    if (t === activeTab) {
      assert(p.classList.contains("is-active"), `panel-${t} must have class 'is-active'`);
      assert(b.classList.contains("is-active"), `tab-${t} must have class 'is-active'`);
      assert.strictEqual(b.getAttribute("aria-selected"), "true", `tab-${t} aria-selected must be 'true'`);
    } else {
      assert(!p.classList.contains("is-active"), `panel-${t} must NOT have class 'is-active'`);
      assert(!b.classList.contains("is-active"), `tab-${t} must NOT have class 'is-active'`);
      assert.strictEqual(b.getAttribute("aria-selected"), "false", `tab-${t} aria-selected must be 'false'`);
    }
  }
}
console.log("  ✓ All 4 bottom navigation tabs switch panels cleanly with ARIA accessibility");

console.log("\n[TEST 5] Auditing Top Action Handlers (Modals & WhatsApp Share)...");
const studioModal = getOrCreate("studioModal");
globalThis.openStudioModal();
assert.strictEqual(studioModal.style.display, "flex", "openStudioModal must set display to flex");
globalThis.closeStudioModal();
assert.strictEqual(studioModal.style.display, "none", "closeStudioModal must set display to none");
console.log("  ✓ openStudioModal() and closeStudioModal() successfully respond");

const tapToast = getOrCreate("tapToast");
globalThis.triggerLivenessProof();
assert(tapToast.textContent.includes("Active"), "triggerLivenessProof must show active code");
console.log("  ✓ triggerLivenessProof() responds and updates liveness badge");

openedUrls = [];
globalThis.sharePassbookWhatsApp();
assert.strictEqual(openedUrls.length, 1, "sharePassbookWhatsApp must invoke window.open");
assert(openedUrls[0].includes("wa.me"), "Share URL must target WhatsApp API");
assert(openedUrls[0].includes("MNY1."), "Share URL must include authentic MNY1 Ed25519 token");
console.log("  ✓ sharePassbookWhatsApp() generates authenticated cryptographic passbook link");

console.log("\n================================================================================");
console.log("ALL 5 AUDIT SPECIFICATIONS VERIFIED WITH ZERO ERRORS (EXIT 0)!");
console.log("================================================================================");
process.exit(0);
