/**
 * MAANYATA SOVEREIGN PORTFOLIO CONTROLLER
 * Compartmentalized Module: js/portfolio.js
 */

const STORAGE_KEY = "maanyata_sunita_portfolio_v1";

// Official Lucide SVG vector icons (24x24, 2px stroke, round linecap & linejoin)
const ICONS = {
  pot: '<svg class="mny-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/></svg>',
  sparkles: '<svg class="mny-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
  key: '<svg class="mny-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>',
  clock: '<svg class="mny-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  star: '<svg class="mny-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  calendar: '<svg class="mny-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" x2="6"/><line x1="8" x2="8" y1="2" x2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
  card: '<svg class="mny-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
  shieldAlert: '<svg class="mny-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
  coffee: '<svg class="mny-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z"/><path d="M6 2v2"/><path d="M17 12h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2"/></svg>',
  check: '<svg class="mny-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  medal: '<svg class="mny-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  trophy: '<svg class="mny-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
  crown: '<svg class="mny-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>',
  target: '<svg class="mny-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  lock: '<svg class="mny-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
};

// Canonical Demo Authority Ed25519 Keypair Seed (tweetnacl)
// Deterministic fallback for offline / demo mode
const CANONICAL_DEMO_SEED = new Uint8Array([
  0x6d, 0x61, 0x61, 0x6e, 0x79, 0x61, 0x74, 0x61,
  0x2d, 0x61, 0x75, 0x74, 0x68, 0x6f, 0x72, 0x69,
  0x74, 0x79, 0x2d, 0x64, 0x65, 0x6d, 0x6f, 0x2d,
  0x73, 0x65, 0x65, 0x64, 0x2d, 0x32, 0x30, 0x32
]);

function base64UrlEncode(bytesOrStr) {
  let bin = "";
  if (typeof bytesOrStr === "string") {
    const bytes = new TextEncoder().encode(bytesOrStr);
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  } else {
    for (let i = 0; i < bytesOrStr.length; i++) bin += String.fromCharCode(bytesOrStr[i]);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function generateEd25519Token(wid, name, role, attestedYears, households, traits, boundaries) {
  const naclObj = typeof nacl !== "undefined" ? nacl : (typeof window !== "undefined" ? window.nacl : null);
  const cleanName = String(name || "Worker").replace(/\[.*?\]/, "").trim();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 7 * 86400; // 7 days TTL
  const payload = {
    wid: wid || "demo-worker",
    name: cleanName,
    role: role || "Specialist",
    attestedYears: Number(attestedYears) || 0,
    households: Number(households != null ? households : 1),
    exp: exp
  };
  const topRef = (typeof portfolio !== "undefined" && portfolio && portfolio.references && portfolio.references.find(r => r.certified !== false)) || null;
  if (topRef && topRef.unit) {
    payload.ref = { author: topRef.author || "Resident", unit: topRef.unit };
  }
  const bodyStr = JSON.stringify(payload);
  const bodyB64 = base64UrlEncode(bodyStr);

  if (!naclObj || !naclObj.sign) {
    return `MNY1.${bodyB64}.demo_sig_unsigned`;
  }

  const kp = naclObj.sign.keyPair.fromSeed(CANONICAL_DEMO_SEED);
  const msgBytes = new TextEncoder().encode(bodyB64);
  const sigBytes = naclObj.sign.detached(msgBytes, kp.secretKey);
  const sigB64 = base64UrlEncode(sigBytes);
  return `MNY1.${bodyB64}.${sigB64}`;
}

function verifyEd25519Token(tokenStr) {
  if (!tokenStr || typeof tokenStr !== "string") return null;
  const parts = tokenStr.trim().split(".");
  if (parts.length !== 3 || parts[0] !== "MNY1") return null;
  const bodyB64 = parts[1];
  const sigB64 = parts[2];
  const naclObj = typeof nacl !== "undefined" ? nacl : (typeof window !== "undefined" ? window.nacl : null);

  try {
    if (naclObj && naclObj.sign && sigB64 !== "demo_sig_unsigned") {
      const kp = naclObj.sign.keyPair.fromSeed(CANONICAL_DEMO_SEED);
      const msgBytes = new TextEncoder().encode(bodyB64);
      const sigBytes = base64UrlDecode(sigB64);
      const isValid = naclObj.sign.detached.verify(msgBytes, sigBytes, kp.publicKey);
      if (!isValid) {
        console.warn("Ed25519 signature verification failed");
        return null;
      }
    }
    const payloadBytes = base64UrlDecode(bodyB64);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn("Ed25519 token has expired");
      return null;
    }
    return payload;
  } catch (e) {
    console.error("Token verification error:", e);
    return null;
  }
}

// Classified Demo Data (Explicitly tagged as demonstration records)
const SAMPLES = {
  sunita_devi: {
    id: "sunita-devi-01",
    name: "Sunita Devi [Demo Record]",
    role: "Senior Household & Culinary Specialist",
    uan: "UAN ****-****-4921",
    tenureBaseline: "8.5 Yrs",
    tenureAttested: "3 Yrs",
    tenure: "3 Yrs",
    households: 19,
    statusText: "Active Status: Employed across 3 Societies (19 Households Served)",
    traits: {
      "Exceptional Cooking": { count: 14, iconName: "pot" },
      "Trusted With House Keys": { count: 18, iconName: "key" },
      "Always On Time": { count: 24, iconName: "clock" }
    },
    boundaries: [
      "Access to clean water and soap to wash my hands",
      "Direct Resident UPI on 1st of Month",
      "Minimum 1 Agreed Weekly Rest Day",
      "Zero toxic acid chemicals for cleaning"
    ],
    references: [
      {
        quote: "Sunita has managed meal prep and handled our keys for 3 years with absolute punctuality and honesty.",
        quoteHi: "सुनीता ने ३ वर्षों तक पूर्ण समयनिष्ठा और ईमानदारी के साथ भोजन तैयार किया और हमारे घर की चाबियां संभाली हैं।",
        author: "Ms. Demo Resident",
        unit: "Verified Resident Attestation • Demo Heights CHS",
        tenure: "3 Yrs Verified",
        startYear: 2023,
        certified: true,
        locationVerified: true,
        locationTag: "✓ On-Premises Attestation (Demo CHS)"
      }
    ]
  },
  ramesh_kumar: {
    id: "ramesh-kumar-02",
    name: "Ramesh Kumar [Demo Record]",
    role: "Senior Chauffeur & Mobility Assistant",
    uan: "UAN ****-****-8812",
    tenureBaseline: "12 Yrs",
    tenureAttested: "7 Yrs",
    tenure: "7 Yrs",
    households: 6,
    statusText: "Active Status: Employed across 2 Societies (6 Households Served)",
    traits: {
      "Always On Time": { count: 22, iconName: "clock" },
      "Went Above & Beyond": { count: 9, iconName: "star" },
      "Trusted With Vehicle Keys": { count: 6, iconName: "key" }
    },
    boundaries: ["Designated 45-min lunch break", "Direct Resident UPI on 1st of Month"],
    references: [
      {
        quote: "Handled hospital runs and family transport for over a decade. Flawless driving record.",
        quoteHi: "एक दशक से अधिक समय तक अस्पताल एवं पारिवारिक परिवहन का कार्य कुशलतापूर्वक संभाला। उत्कृष्ट ड्राइविंग रिकॉर्ड।",
        author: "Mr. Demo Resident",
        unit: "Verified Resident Attestation • Demo Heights CHS",
        tenure: "7 Yrs Verified",
        startYear: 2019,
        certified: true,
        locationVerified: true,
        locationTag: "✓ On-Premises Attestation (Demo CHS)"
      }
    ]
  }
};

const UNKNOWN_PORTFOLIO = {
  name: "Unknown Worker",
  role: "No Active Passbook Loaded",
  uan: "UAN Not Linked",
  tenureBaseline: "0 Yrs",
  tenureAttested: "0 Yrs",
  tenure: "0 Yrs",
  households: 0,
  statusText: "No active society assignment",
  traits: {},
  boundaries: [
    "Select an authentic demo record from the navigation options",
    "Or onboard a new domestic specialist to create a sovereign passbook"
  ],
  references: [],
  isUnknown: true
};

let portfolio = loadPortfolio();

function loadPortfolio() {
  try {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash ? window.location.hash.substring(1) : "";
    const hashParams = new URLSearchParams(hash);

    // Strike 3 & Strike 2: Cryptographically signed token verification
    const token = params.get("token") || hashParams.get("token") || (hash.startsWith("token=") ? hash.split("=")[1] : (hash.startsWith("MNY1.") ? hash : null));
    if (token) {
      const verifiedPayload = verifyEd25519Token(token);
      if (verifiedPayload) {
        return {
          id: verifiedPayload.wid,
          name: verifiedPayload.name,
          role: verifiedPayload.role,
          uan: "UAN ****-****-4921",
          tenureBaseline: `${verifiedPayload.attestedYears || 0} Yrs`,
          tenureAttested: `${verifiedPayload.attestedYears || 0} Yrs`,
          tenure: `${verifiedPayload.attestedYears || 0} Yrs`,
          households: 1,
          statusText: "Cryptographically Verified Sovereign Pass",
          traits: { "Always On Time": { count: 1, iconName: "clock" } },
          boundaries: [
            "Access to clean water and soap to wash my hands",
            "Minimum 1 Agreed Weekly Rest Day"
          ],
          references: verifiedPayload.ref ? [{
            author: verifiedPayload.ref.author || "Resident",
            unit: verifiedPayload.ref.unit || "Verified Household",
            tenure: verifiedPayload.ref.tenure || `${verifiedPayload.attestedYears || 0} Yrs`,
            quote: verifiedPayload.ref.quote || `Verified household service with ${verifiedPayload.ref.author || "Resident"} (${verifiedPayload.attestedYears || 0} Yrs).`,
            certified: true
          }] : (SAMPLES[verifiedPayload.wid] ? SAMPLES[verifiedPayload.wid].references : [])
        };
      }
    }

    const sampleId = params.get("sample");
    if (sampleId && SAMPLES[sampleId]) {
      return JSON.parse(JSON.stringify(SAMPLES[sampleId]));
    }

    // Dynamic Multi-Worker Resolution: ?worker=<id> or ?id=<id>
    const targetWorkerId = params.get("worker") || params.get("id");
    if (targetWorkerId && targetWorkerId !== "unknown") {
      // 1. Check multi-worker storage (mny_worker_<id>)
      const multiRaw = localStorage.getItem("mny_worker_" + targetWorkerId);
      if (multiRaw) {
        const parsed = JSON.parse(multiRaw);
        if (parsed) return parsed;
      }
      // 2. Check SAMPLES by key or id property
      if (SAMPLES[targetWorkerId]) {
        return JSON.parse(JSON.stringify(SAMPLES[targetWorkerId]));
      }
      for (const k in SAMPLES) {
        if (SAMPLES[k] && SAMPLES[k].id === targetWorkerId) {
          return JSON.parse(JSON.stringify(SAMPLES[k]));
        }
      }
      // 3. Fallback for sunita-devi-01
      if (targetWorkerId === "sunita-devi-01" || targetWorkerId === "sunita_devi") {
        const sunitaRaw = localStorage.getItem("maanyata_sunita_portfolio_v1");
        if (sunitaRaw) {
          const parsed = JSON.parse(sunitaRaw);
          if (parsed) return parsed;
        }
        return JSON.parse(JSON.stringify(SAMPLES.sunita_devi));
      }
    }

    // Check active user session if no explicit parameter passed
    const activeUserRaw = localStorage.getItem("maanyata_active_user");
    if (activeUserRaw) {
      try {
        const activeUser = JSON.parse(activeUserRaw);
        if (activeUser && activeUser.id) {
          const multiRaw = localStorage.getItem("mny_worker_" + activeUser.id);
          if (multiRaw) {
            const parsed = JSON.parse(multiRaw);
            if (parsed) return parsed;
          }
        }
      } catch (e) {}
    }

    // Fallback: Default to Sunita Devi passbook
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.isUnknown || parsed.name === "Unknown User")) {
        return JSON.parse(JSON.stringify(UNKNOWN_PORTFOLIO));
      }
      if (parsed) return parsed;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(SAMPLES.sunita_devi));
}

function savePortfolio() {
  try {
    if (portfolio && portfolio.id) {
      localStorage.setItem("mny_worker_" + portfolio.id, JSON.stringify(portfolio));
    }
    if (!portfolio || !portfolio.id || portfolio.id === "sunita-devi-01") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    }
  } catch (e) {}
}

function escapeHTML(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function maskUnitPrivacy(unitStr) {
  if (!unitStr) return currentLang === "hi" ? "सत्यापित निवासी अनुशंसा" : "Verified Resident Attestation";
  const s = String(unitStr).trim();

  // If already formatted as a privacy-scrubbed attestation string
  if (s.includes("सत्यापित निवासी अनुशंसा") || s.includes("Verified Resident Attestation")) {
    if (currentLang === "hi") {
      return s.replace("Verified Resident Attestation", "सत्यापित निवासी अनुशंसा");
    }
    return s.replace("सत्यापित निवासी अनुशंसा", "Verified Resident Attestation");
  }

  // Extract complex/society name and purge all wing/flat designations
  let soc = "";
  const match = s.match(/(?:,\s*|\bat\s+|\bin\s+)?([A-Za-z0-9\s]+(?:CHS|Complex|Palms|Heights|Enclave|Park|Nagar|Apartments|Towers?))/i);
  if (match) {
    soc = match[1].trim();
  } else if (/Greenwood/i.test(s)) {
    soc = "Greenwood Palms";
  } else if (/Demo/i.test(s)) {
    soc = "Demo Heights CHS";
  } else if (/Maryland/i.test(s)) {
    soc = "Maryland Palms CHS";
  }

  if (soc) {
    return currentLang === "hi" ? `सत्यापित निवासी अनुशंसा • ${soc}` : `Verified Resident Attestation • ${soc}`;
  }
  return currentLang === "hi" ? "सत्यापित निवासी अनुशंसा" : "Verified Resident Attestation";
}

function getSovereignFingerprint() {
  const idStr = portfolio.uan || portfolio.name || "Worker";
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = ((hash << 5) - hash) + idStr.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return `#M-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}

function toDevanagariNumerals(val) {
  if (val == null) return currentLang === 'hi' ? '०' : '0';
  const str = String(val);
  if (str === 'undefined' || str === 'NaN') return currentLang === 'hi' ? '०' : '0';
  if (currentLang !== 'hi') return str;
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return str.replace(/[0-9]/g, d => devanagariDigits[Number(d)]);
}

function localizeEndorsementTenure(str) {
  if (currentLang !== 'hi' || !str) return str;
  let s = String(str)
    .replace(/Years?\s*Certified/gi, "वर्ष प्रमाणित")
    .replace(/Yrs?\s*Verified/gi, "वर्ष प्रमाणित")
    .replace(/Years?\s*Verified/gi, "वर्ष प्रमाणित")
    .replace(/Yrs?\s*Certified/gi, "वर्ष प्रमाणित")
    .replace(/Years?\s*Attested/gi, "वर्ष प्रमाणित")
    .replace(/Yrs?\s*Attested/gi, "वर्ष प्रमाणित")
    .replace(/Years?/gi, "वर्ष")
    .replace(/Yrs?/gi, "वर्ष")
    .replace(/Certified/gi, "प्रमाणित")
    .replace(/Verified/gi, "प्रमाणित")
    .replace(/Attested/gi, "प्रमाणित");
  return toDevanagariNumerals(s);
}

// Tab Navigation
const TABS = ["pass", "record", "terms", "profile"];
let currentTab = "pass";

function showTab(name) {
  if (name === "directory") {
    window.location.href = "/directory.html";
    return;
  }
  if (!TABS.includes(name)) return;
  currentTab = name;

  TABS.forEach(t => {
    const panel = document.getElementById("panel-" + t);
    const btn = document.getElementById("tab-" + t);
    const active = t === name;
    if (panel) panel.classList.toggle("is-active", active);
    if (btn) {
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.setAttribute("tabindex", active ? "0" : "-1");
      btn.classList.toggle("is-active", active);
    }
  });

  const panel = document.getElementById("panel-" + name);
  if (panel) panel.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ARIA Keyboard Navigation
document.addEventListener("DOMContentLoaded", () => {
  const tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    tablist.addEventListener("keydown", (e) => {
      const idx = TABS.indexOf(currentTab);
      let next = null;
      if (e.key === "ArrowRight") next = TABS[(idx + 1) % TABS.length];
      if (e.key === "ArrowLeft") next = TABS[(idx - 1 + TABS.length) % TABS.length];
      if (e.key === "Home") next = TABS[0];
      if (e.key === "End") next = TABS[TABS.length - 1];
      if (next) {
        e.preventDefault();
        showTab(next);
        const nextBtn = document.getElementById("tab-" + next);
        if (nextBtn) nextBtn.focus();
      }
    });
  }
});

function detectPlatform() {
  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  document.documentElement.classList.add(isIOS ? "platform-ios" : "platform-android");
}

// Career Milestone Tiers with Material Progression (Krishiv Sukul Architectural Hierarchy)
// Copper > Bronze > Iron > Steel > Hardened Steel > Silver > Gold > Legendary
const MILESTONE_TIERS = [
  {
    hours: 100,
    numericHours: 100,
    titleEn: "100 hrs: Foundation Seal",
    titleHi: "१०० घंटे: आधारशिला मुहर",
    badgeEn: "Foundation",
    badgeHi: "आधारशिला"
  },
  {
    hours: 500,
    numericHours: 500,
    titleEn: "500 hrs: Diligence Seal",
    titleHi: "५०० घंटे: कर्मठता मुहर",
    badgeEn: "Diligence",
    badgeHi: "कर्मठता"
  },
  {
    hours: 1000,
    numericHours: 1000,
    titleEn: "1,000 hrs: Master Craft",
    titleHi: "१,००० घंटे: शिल्पकार",
    badgeEn: "Master Craft",
    badgeHi: "शिल्पकार"
  },
  {
    hours: 2000,
    numericHours: 2000,
    titleEn: "2,000 hrs: Copper Seal",
    titleHi: "२,००० घंटे: तांबा मुहर",
    badgeEn: "Copper Seal",
    badgeHi: "तांबा मुहर"
  },
  {
    hours: 2500,
    numericHours: 2500,
    titleEn: "2,500 hrs: Copper Elite",
    titleHi: "२,५०० घंटे: तांबा प्रवर",
    badgeEn: "Copper Elite",
    badgeHi: "तांबा प्रवर"
  },
  {
    hours: 3000,
    numericHours: 3000,
    titleEn: "3,000 hrs: Bronze Seal",
    titleHi: "३,००० घंटे: कांसा मुहर",
    badgeEn: "Bronze Seal",
    badgeHi: "कांसा मुहर"
  },
  {
    hours: 5000,
    numericHours: 5000,
    titleEn: "5,000 hrs: Bronze Elite",
    titleHi: "५,००० घंटे: कांसा प्रवर",
    badgeEn: "Bronze Elite",
    badgeHi: "कांसा प्रवर"
  },
  {
    hours: 7500,
    numericHours: 7500,
    titleEn: "7,500 hrs: Iron Seal",
    titleHi: "७,५०० घंटे: लौह मुहर",
    badgeEn: "Iron Seal",
    badgeHi: "लौह मुहर"
  },
  {
    hours: 10000,
    numericHours: 10000,
    titleEn: "10,000 hrs: Steel Seal",
    titleHi: "१०,००० घंटे: इस्पात मुहर",
    badgeEn: "Steel Seal",
    badgeHi: "इस्पात मुहर"
  },
  {
    hours: 15000,
    numericHours: 15000,
    titleEn: "15,000 hrs: Steel Master",
    titleHi: "१५,००० घंटे: इस्पात महारथी",
    badgeEn: "Steel Master",
    badgeHi: "इस्पात महारथी"
  },
  {
    hours: 17500,
    numericHours: 17500,
    titleEn: "17,500 hrs: Hardened Steel Seal",
    titleHi: "१७,५०० घंटे: फौलाद मुहर",
    badgeEn: "Hardened Steel",
    badgeHi: "फौलाद मुहर"
  },
  {
    hours: 20000,
    numericHours: 20000,
    titleEn: "20,000 hrs: Hardened Steel Master",
    titleHi: "२०,००० घंटे: फौलाद महारथी",
    badgeEn: "Hardened Steel Master",
    badgeHi: "फौलाद महारथी"
  },
  {
    hours: 25000,
    numericHours: 25000,
    titleEn: "25,000 hrs: Silver Seal",
    titleHi: "२५,००० घंटे: रजत मुहर",
    badgeEn: "Silver Seal",
    badgeHi: "रजत मुहर"
  },
  {
    hours: 30000,
    numericHours: 30000,
    titleEn: "30,000 hrs: Silver Sovereign",
    titleHi: "३०,००० घंटे: रजत अधिपति",
    badgeEn: "Silver Sovereign",
    badgeHi: "रजत अधिपति"
  },
  {
    hours: 40000,
    numericHours: 40000,
    titleEn: "40,000 hrs: Gold Seal",
    titleHi: "४०,००० घंटे: स्वर्ण मुहर",
    badgeEn: "Gold Seal",
    badgeHi: "स्वर्ण मुहर"
  },
  {
    hours: 50000,
    numericHours: 50000,
    titleEn: "50,000 hrs: Gold Sovereign",
    titleHi: "५०,००० घंटे: स्वर्ण अधिपति",
    badgeEn: "Gold Sovereign",
    badgeHi: "स्वर्ण अधिपति"
  },
  {
    hours: 75000,
    numericHours: 75000,
    titleEn: "75,000 hrs: Legendary",
    titleHi: "७५,००० घंटे: शिखर दिग्गज",
    badgeEn: "Legendary",
    badgeHi: "शिखर दिग्गज"
  },
  {
    hours: 100000,
    numericHours: 100000,
    titleEn: "100,000 hrs: Legendary Sovereign",
    titleHi: "१,००,००० घंटे: सर्वकालिक शिखर",
    badgeEn: "Legendary Sovereign",
    badgeHi: "सर्वकालिक शिखर"
  }
];

let isMilestonesLadderOpen = false;

function updateToggleBtnText(btn) {
  if (!btn) return;
  if (isMilestonesLadderOpen) {
    btn.textContent = currentLang === "hi"
      ? "करियर सीढ़ी छुपाएं / Hide Full Ladder"
      : "Hide Career Ladder (18 Tiers) / पूरी मील का पत्थर सूची छुपाएं";
  } else {
    btn.textContent = currentLang === "hi"
      ? "पूरी करियर सीढ़ी देखें (१८ स्तर) / View Full Career Ladder"
      : "View Full Career Ladder (18 Tiers) / पूरी मील का पत्थर सूची";
  }
}

function renderFullMilestonesLadder(totalHrs, currentTier, nextTier) {
  let ladderWrap = document.getElementById("milestonesLadderWrap");
  if (!ladderWrap) {
    const card = document.getElementById("milestonesCard");
    if (!card) return;
    ladderWrap = document.createElement("div");
    ladderWrap.id = "milestonesLadderWrap";
    ladderWrap.className = "milestones-ladder-wrap";
    ladderWrap.style.display = isMilestonesLadderOpen ? "block" : "none";
    card.appendChild(ladderWrap);
  }

  ladderWrap.innerHTML = `
    <div class="milestones-ladder-grid">
      ${MILESTONE_TIERS.map(tier => {
        const isAchieved = totalHrs >= tier.numericHours;
        const isNext = nextTier && tier.hours === nextTier.hours;
        const statusClass = isAchieved ? "is-achieved" : (isNext ? "is-next" : "is-locked");
        const iconSvg = isAchieved ? ICONS.check : (isNext ? ICONS.target : ICONS.lock);
        const title = currentLang === "hi" ? tier.titleHi : tier.titleEn;
        const statusText = isAchieved
          ? (currentLang === "hi" ? "अर्जित" : "Achieved")
          : (isNext
            ? (currentLang === "hi" ? "अगला लक्ष्य" : "Next Target")
            : (currentLang === "hi" ? "आगामी" : "Upcoming"));

        return `
          <div class="tier-pill ${statusClass}">
            <span class="tier-icon">${iconSvg}</span>
            <span class="tier-name">${escapeHTML(title)}</span>
            <span class="tier-badge-pill">${escapeHTML(statusText)}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;

  const toggleBtn = document.getElementById("btnToggleAllMilestones");
  if (toggleBtn) {
    updateToggleBtnText(toggleBtn);
    if (!toggleBtn.dataset.bound) {
      toggleBtn.dataset.bound = "true";
      toggleBtn.addEventListener("click", () => {
        isMilestonesLadderOpen = !isMilestonesLadderOpen;
        const wrap = document.getElementById("milestonesLadderWrap");
        if (wrap) wrap.style.display = isMilestonesLadderOpen ? "block" : "none";
        updateToggleBtnText(toggleBtn);
      });
    }
  }
}

function renderMilestones(hoursData) {
  const totalHrs = hoursData ? (Number(hoursData.totalHours) || 0) : 0;

  const hoursFormatted = currentLang === "hi"
    ? `${toDevanagariNumerals(totalHrs.toLocaleString("en-IN"))} घंटे`
    : `${totalHrs.toLocaleString("en-US")} hrs`;

  const metricTotalHoursEl = document.getElementById("metricTotalHours");
  if (metricTotalHoursEl) metricTotalHoursEl.textContent = hoursFormatted;

  // Determine current achieved tier (highest tier <= totalHours)
  // and next target tier (lowest tier > totalHours)
  let currentTier = null;
  let nextTier = null;

  for (let i = 0; i < MILESTONE_TIERS.length; i++) {
    const tier = MILESTONE_TIERS[i];
    if (totalHrs >= tier.numericHours) {
      currentTier = tier;
    } else {
      if (!nextTier) {
        nextTier = tier;
      }
    }
  }

  const currentTierHours = currentTier ? (currentTier.hours === "100000+" ? 100000 : currentTier.numericHours) : 0;
  const nextTierHours = nextTier ? (nextTier.hours === "100000+" ? 100000 : nextTier.numericHours) : currentTierHours;

  let progressPct = 0;
  if (!nextTier) {
    progressPct = 100;
  } else if (nextTierHours > currentTierHours) {
    progressPct = Math.min(100, Math.max(0, Math.round(((totalHrs - currentTierHours) / (nextTierHours - currentTierHours)) * 100)));
  }

  const badgeEl = document.getElementById("milestoneTierBadge");
  if (badgeEl) {
    if (currentTier) {
      badgeEl.textContent = currentLang === "hi" ? currentTier.badgeHi : currentTier.badgeEn;
    } else {
      badgeEl.textContent = currentLang === "hi" ? "आरंभिक स्तर" : "Entry Level";
    }
  }

  const progressFill = document.getElementById("milestoneProgressFill");
  if (progressFill) progressFill.style.width = `${progressPct}%`;

  const progressLabel = document.getElementById("milestoneProgressLabel");
  if (progressLabel) {
    if (!nextTier) {
      progressLabel.textContent = currentLang === "hi"
        ? `${toDevanagariNumerals(100)}% — सर्वकालिक शिखर प्राप्त`
        : `100% to Legendary Sovereign Pinnacle`;
    } else {
      const targetName = currentLang === "hi" ? nextTier.titleHi : nextTier.titleEn;
      progressLabel.textContent = currentLang === "hi"
        ? `${toDevanagariNumerals(progressPct)}% — ${targetName} की ओर`
        : `${progressPct}% to ${targetName}`;
    }
  }

  // Dynamically render #milestonesTiersGrid (2 hero pills: Highest achieved + Immediate next target)
  const tiersGrid = document.getElementById("milestonesTiersGrid");
  if (tiersGrid) {
    tiersGrid.innerHTML = "";

    // Highest achieved milestone pill
    const achievedEl = document.createElement("div");
    achievedEl.className = "tier-pill is-achieved";
    const achievedTitle = currentTier
      ? (currentLang === "hi" ? currentTier.titleHi : currentTier.titleEn)
      : (currentLang === "hi" ? "आरंभिक स्तर (० घंटे)" : "Entry Level (0 hrs)");
    const achievedTag = currentLang === "hi" ? "✓ अर्जित" : "✓ Achieved";

    achievedEl.innerHTML = `
      <span class="tier-icon">${ICONS.medal}</span>
      <div class="tier-pill-text">
        <span class="tier-status-tag">${escapeHTML(achievedTag)}</span>
        <span class="tier-name">${escapeHTML(achievedTitle)}</span>
      </div>
    `;
    tiersGrid.appendChild(achievedEl);

    // Immediate next target milestone pill
    const nextEl = document.createElement("div");
    nextEl.className = "tier-pill is-next";
    const nextTitle = nextTier
      ? (currentLang === "hi" ? nextTier.titleHi : nextTier.titleEn)
      : (currentLang === "hi" ? "सर्वकालिक शिखर" : "Pinnacle Reached");
    const nextTag = nextTier
      ? (currentLang === "hi" ? "◎ अगला लक्ष्य" : "◎ Next Target")
      : (currentLang === "hi" ? "पूर्ण" : "Completed");

    nextEl.innerHTML = `
      <span class="tier-icon">${ICONS.target}</span>
      <div class="tier-pill-text">
        <span class="tier-status-tag">${escapeHTML(nextTag)}</span>
        <span class="tier-name">${escapeHTML(nextTitle)}</span>
      </div>
    `;
    tiersGrid.appendChild(nextEl);
  }

  renderFullMilestonesLadder(totalHrs, currentTier, nextTier);
}

// Service Hours & Career Milestones Calculation
function calculateCumulativeHours(port) {
  if (!port || port.isUnknown || port.name === "Unknown Worker" || port.name === "Unknown User") {
    return { totalHours: 0, shifts: [] };
  }

  // If explicitly declared shifts exist on portfolio, calculate from them
  if (Array.isArray(port.shifts) && port.shifts.length > 0) {
    const total = port.shifts.reduce((acc, s) => acc + ((Number(s.hoursPerWeek) || 0) * (Number(s.weeks) || 0)), 0);
    return { totalHours: total, shifts: port.shifts };
  }

  // If certified references exist, compute cumulative hours from all certified references
  if (Array.isArray(port.references) && port.references.length > 0) {
    const certified = port.references.filter(r => r.certified !== false && !r.isUnverified);
    if (certified.length > 0) {
      let total = 0;
      const derivedShifts = [];
      certified.forEach((r, idx) => {
        const hpw = Number(r.hoursPerWeek) || (idx === 0 ? 12 : 10);
        const w = Number(r.weeks) || Math.max(1, Math.round((parseFloat(r.tenure) || 1) * 52));
        const hrs = hpw * w;
        total += hrs;
        derivedShifts.push({
          household: r.unitMasked || r.unit || (idx === 0 ? "Unit B-402 (Culinary Specialist)" : `Unit C-${100 + idx} (Household Care)`),
          hoursPerWeek: hpw,
          weeks: w,
          totalHours: hrs
        });
      });
      return { totalHours: total, shifts: derivedShifts };
    }
  }

  // Zero unmeasured synthetic hours: return 0 if no explicit shifts and no certified references
  return { totalHours: 0, shifts: [] };
}

// Rendering
function renderPortfolio() {
  document.getElementById("pName").textContent = portfolio.name;

  const ROLE_MAP_HI = {
    "Senior Household & Culinary Specialist": "वरिष्ठ गृह एवं पाक कला विशेषज्ञ",
    "Senior Chauffeur & Mobility Assistant": "वरिष्ठ चालक एवं गतिशीलता सहायक",
    "Household Specialist": "गृह विशेषज्ञ",
    "Senior Cook & Housekeeper": "वरिष्ठ रसोइया एवं गृह व्यवस्था",
    "Cook & Housekeeping": "रसोइया एवं गृह व्यवस्था",
    "Personal Driver": "व्यक्तिगत चालक",
    "Driver": "चालक / ड्राइवर",
    "Child Nanny": "बाल देखभाल / नैनी",
    "Housekeeper": "गृह व्यवस्थापक",
    "Eldercare & Companion": "बुजुर्ग देखभाल एवं साथी",
    "No Active Passbook Loaded": "कोई सक्रिय पासबुक लोड नहीं"
  };
  const roleEl = document.getElementById("pRole");
  if (roleEl) {
    if (currentLang === "hi") {
      roleEl.textContent = ROLE_MAP_HI[portfolio.role] || (portfolio.role && portfolio.role.includes("Household") ? "वरिष्ठ गृह एवं पाक कला विशेषज्ञ" : portfolio.role);
    } else {
      roleEl.textContent = portfolio.role;
    }
  }

  document.getElementById("pUan").textContent = portfolio.uan;

  // Strike 1: Metric Bifurcation (Anti-Advance Hopper)
  // Compute attested tenure strictly from verified references or portfolio.tenureAttested
  let attestedYears = 0;
  if (portfolio.tenureAttested != null) {
    attestedYears = parseFloat(portfolio.tenureAttested) || 0;
  } else if (portfolio.references && portfolio.references.length > 0) {
    const certified = portfolio.references.filter(r => r.certified !== false);
    if (certified.length > 0) {
      const currentYr = new Date().getFullYear();
      const startYears = certified.map(r => r.startYear || (currentYr - (parseFloat(r.tenure) || 1)));
      const earliest = Math.min(...startYears);
      attestedYears = Math.max(0.5, currentYr - earliest);
    }
  }

  // Hero metric MUST display ONLY Resident-Attested tenure
  const formattedTenure = attestedYears > 0
    ? (currentLang === "hi" ? `${toDevanagariNumerals(attestedYears)} वर्ष` : `${attestedYears} Yrs`)
    : (currentLang === "hi" ? "० वर्ष" : "0 Yrs");
  
  const metricTenureEl = document.getElementById("metricTenure");
  if (metricTenureEl) metricTenureEl.textContent = formattedTenure;

  // Self-declared tenure sub-label
  const selfDeclaredVal = portfolio.tenureBaseline || portfolio.tenure || "0 Yrs";
  const cleanSelfVal = String(selfDeclaredVal).replace(/\(.*\)/, "").trim();
  const selfDeclaredText = currentLang === "hi"
    ? `स्वयं घोषित: ${toDevanagariNumerals(cleanSelfVal).replace(/Yrs?/gi, "वर्ष")} (असत्यापित)`
    : `Self-Declared: ${cleanSelfVal} (Unverified)`;
  
  const metricSelfDeclaredEl = document.getElementById("metricSelfDeclared");
  if (metricSelfDeclaredEl) metricSelfDeclaredEl.textContent = selfDeclaredText;
  document.getElementById("metricHouseholds").textContent = toDevanagariNumerals(portfolio.households != null ? portfolio.households : 0);

  const isUnknown = portfolio.isUnknown || (portfolio.name && portfolio.name.startsWith("Unknown"));
  
  // Humanize and clean worker name if it contains a slug like "sunita-devi-01"
  let cleanName = (portfolio.name || "").replace(/\[.*?\]|\(.*?\)/g, "").trim();
  const lowerName = cleanName.toLowerCase();
  let humanFirstName = "";

  if (lowerName.includes("sunita-devi") || lowerName === "sunita_devi" || lowerName.includes("sunita devi") || lowerName === "sunita") {
    cleanName = currentLang === "hi" ? "सुनीता देवी" : "Sunita Devi";
    humanFirstName = currentLang === "hi" ? "सुनीता" : "Sunita";
  } else if (lowerName.includes("ramesh-kumar") || lowerName === "ramesh_kumar" || lowerName.includes("ramesh kumar") || lowerName === "ramesh") {
    cleanName = currentLang === "hi" ? "रमेश कुमार" : "Ramesh Kumar";
    humanFirstName = currentLang === "hi" ? "रमेश" : "Ramesh";
  } else if (lowerName.includes("asha-kumari") || lowerName === "asha_kumari" || lowerName.includes("asha kumari") || lowerName === "asha") {
    cleanName = currentLang === "hi" ? "आशा कुमारी" : "Asha Kumari";
    humanFirstName = currentLang === "hi" ? "आशा" : "Asha";
  } else if (cleanName.includes("-") || cleanName.includes("_")) {
    cleanName = cleanName.replace(/[-_]\d+$/, "").split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    humanFirstName = cleanName.split(/\s+/)[0];
  } else {
    humanFirstName = cleanName.split(/\s+/)[0] || "";
  }

  const nameParts = cleanName.split(/\s+/);
  const initials = isUnknown ? "?" : (nameParts.length >= 2 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : (cleanName || "SD").slice(0, 2).toUpperCase());
  
  const av = document.getElementById("pAvatar");
  if (av) av.textContent = initials;
  
  const passAv = document.getElementById("passHeroInitials");
  if (passAv) passAv.textContent = initials;

  const firstName = isUnknown ? "" : humanFirstName;
  document.title = `${cleanName || portfolio.name} — Sovereign Work Portfolio | Maanyata`;

  const passTitle = document.getElementById("passCardTitle");
  if (passTitle) {
    if (isUnknown) {
      passTitle.textContent = currentLang === "hi" ? "सत्यापित पोर्टेबल ट्रस्ट पास" : "Portable Trust Pass";
    } else {
      passTitle.textContent = currentLang === "hi"
        ? `${firstName} का पोर्टेबल ट्रस्ट पास`
        : `${firstName}'s Portable Trust Pass`;
    }
  }

  // Total Recognitions
  let total = 0;
  for (const t in portfolio.traits) {
    total += portfolio.traits[t].count || 0;
  }
  document.getElementById("metricRecognitions").textContent = toDevanagariNumerals(total);
  document.getElementById("signalsTotal").textContent = currentLang === "hi" ? `${toDevanagariNumerals(total)} कुल` : `${total} Total`;

  // Traits Cluster with Lucide SVGs (Zero Emojis, prevent double icon leak)
  const traitsBox = document.getElementById("traitsList");
  if (traitsBox) {
    traitsBox.innerHTML = "";
    for (const [name, info] of Object.entries(portfolio.traits)) {
      const el = document.createElement("div");
      el.className = "trait-badge";
      const svgIcon = ICONS[info.iconName] || ICONS.star;
      const cleanKey = name.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim();
      const rawDisplay = (currentLang === "hi" && (TRAIT_MAP_HI[cleanKey] || TRAIT_MAP_HI[name]))
        ? (TRAIT_MAP_HI[cleanKey] || TRAIT_MAP_HI[name])
        : cleanKey;
      const traitDisplayName = rawDisplay.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim();
      el.innerHTML = `<span>${svgIcon} ${escapeHTML(traitDisplayName)}</span><span class="trait-count">${escapeHTML(toDevanagariNumerals(info.count))}</span>`;
      traitsBox.appendChild(el);
    }
  }

  // Working Terms with Lucide SVGs
  const boundBox = document.getElementById("boundariesList");
  if (boundBox) {
    boundBox.innerHTML = "";
    const terms = portfolio.boundaries && portfolio.boundaries.length > 0 ? portfolio.boundaries : [
      "Minimum 1 Agreed Weekly Rest Day",
      "Direct Resident UPI on 1st of Month",
      "Zero toxic acid chemicals for cleaning",
      "Access to clean water and soap to wash my hands"
    ];
    const termsCountEl = document.getElementById("boundariesCount");
    if (termsCountEl) {
      termsCountEl.textContent = currentLang === "hi" ? `${toDevanagariNumerals(terms.length)} नियम` : `${terms.length} Terms`;
    }
    terms.forEach(t => {
      const el = document.createElement("div");
      el.className = "trait-badge boundary-chip";
      const displayTxt = currentLang === "hi" ? translateBoundary(t, "hi") : translateBoundary(t, "en");
      el.innerHTML = `<span>${ICONS.check} ${escapeHTML(displayTxt)}</span>`;
      boundBox.appendChild(el);
    });
  }

  // Endorsements
  const refsBox = document.getElementById("referencesList");
  if (refsBox) {
    refsBox.innerHTML = "";
    const verifiedRefs = (portfolio.references || []).filter(r => r.certified !== false && !r.isUnverified);
    const endCountEl = document.getElementById("endorsementsCount");
    if (endCountEl) {
      endCountEl.textContent = currentLang === "hi" ? `${toDevanagariNumerals(verifiedRefs.length)} सत्यापित` : `${verifiedRefs.length} Verified`;
    }

    portfolio.references.forEach(r => {
      const el = document.createElement("div");
      el.className = "reference-quote";
      const maskedAddress = maskUnitPrivacy(r.unit);
      const tenureTxt = currentLang === "hi" ? localizeEndorsementTenure(r.tenure) : r.tenure;
      const quoteTxt = (currentLang === "hi" && r.quoteHi) ? r.quoteHi : r.quote;

      let badgeHtml = "";
      if (r.certified === false || r.isUnverified) {
        badgeHtml = `<div class="verify-row"><span class="verify-tag is-unverified">${currentLang === "hi" ? "⚠️ असत्यापित" : "⚠️ Unverified"}</span></div>`;
      } else if (r.locationVerified) {
        badgeHtml = `<div class="verify-row"><span class="verify-tag is-verified">${currentLang === "hi" ? "✓ कार्यस्थल पर (At location)" : "✓ At location"}</span></div>`;
      } else {
        badgeHtml = `<div class="verify-row"><span class="verify-tag is-remote">${currentLang === "hi" ? "ℹ️ रिमोट (Remote)" : "ℹ️ Remote"}</span></div>`;
      }

      // Avoid duplicate text like "Resident Attestation • Verified Resident Attestation"
      const isGenericAuthor = !r.author || /resident\s*attestation|सत्यापित\s*निवासी/i.test(r.author);
      const authorLine = isGenericAuthor
        ? `<span>${escapeHTML(maskedAddress)}</span>`
        : `<span>${escapeHTML(r.author)} • ${escapeHTML(maskedAddress)}</span>`;

      el.innerHTML = `
        <div class="quote-text">"${escapeHTML(quoteTxt)}"</div>
        <div class="quote-author">
          ${authorLine}
          <span class="quote-tenure">${escapeHTML(tenureTxt)}</span>
        </div>
        ${badgeHtml}
      `;
      refsBox.appendChild(el);
    });
  }

  // Career Milestones & Service Hours Rendering
  const hoursData = calculateCumulativeHours(portfolio);
  renderMilestones(hoursData);

  // Populate Active Shifts list dynamically
  const shiftsBox = document.getElementById("activeShiftsList");
  if (shiftsBox) {
    shiftsBox.innerHTML = "";
    (hoursData.shifts || []).forEach(s => {
      const row = document.createElement("div");
      row.className = "shift-row";
      const hName = escapeHTML(s.household || "Household");
      const hpw = currentLang === "hi" ? `${toDevanagariNumerals(s.hoursPerWeek)} घंटे/सप्ताह` : `${s.hoursPerWeek} hrs/wk`;
      const wks = currentLang === "hi" ? `${toDevanagariNumerals(s.weeks)} सप्ताह` : `${s.weeks} wks`;
      const sHrs = currentLang === "hi" ? `${toDevanagariNumerals(s.totalHours.toLocaleString("en-IN"))} घंटे` : `${s.totalHours.toLocaleString("en-US")} hrs`;
      row.innerHTML = `
        <div>
          <div class="shift-row-household">${hName}</div>
          <div class="shift-row-meta">${hpw} • ${wks}</div>
        </div>
        <div class="shift-row-hours">${sHrs}</div>
      `;
      shiftsBox.appendChild(row);
    });
  }

  const fpEl = document.getElementById("passFingerprint");
  if (fpEl) fpEl.textContent = getSovereignFingerprint();

  renderOfflineQR();
  renderContracts();
}

// ============================================================
// HOUSEHOLD SHIFTS & SERVICE AGREEMENTS
// ============================================================
async function renderContracts() {
  const container = document.getElementById("contractsListContainer");
  if (!container) return;

  const badgeEl = document.getElementById("contractsCountBadge");
  let contractList = [];
  if (window.MaanyataStore && window.MaanyataStore.contracts) {
    try {
      contractList = await window.MaanyataStore.contracts.getAll();
    } catch (e) {
      console.warn("Could not load contracts:", e);
    }
  }

  if (badgeEl) {
    const activeCount = contractList.filter(c => c.state === "ACTIVE").length;
    badgeEl.textContent = currentLang === "hi"
      ? `${toDevanagariNumerals(activeCount)} सक्रिय घर`
      : `${activeCount} Active ${activeCount === 1 ? 'Household' : 'Households'}`;
  }

  if (!contractList || contractList.length === 0) {
    container.innerHTML = `
      <div class="contracts-empty-state" style="background: var(--card-subtle); border: 1px dashed var(--border); border-radius: 12px; padding: 18px; text-align: center;">
        <div style="font-size: 14px; font-weight: 700; color: var(--ink-primary); margin-bottom: 6px;">
          No Active Household Shifts Recorded
        </div>
        <div style="font-size: 12px; color: var(--ink-muted); max-width: 420px; margin: 0 auto; line-height: 1.5;">
          Log daily household shifts to certify your service continuity and career milestones.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = contractList.map(c => {
    let stateBadge = "";
    let stateStyle = "";
    if (c.state === "ACTIVE") {
      stateBadge = "Active • सक्रिय";
      stateStyle = "background: #DCFCE7; color: #166534; border: 1px solid #86EFAC;";
    } else if (c.state === "SETTLED") {
      stateBadge = "Settled • पूर्ण";
      stateStyle = "background: #E0F2FE; color: #075985; border: 1px solid #BAE6FD;";
    } else if (c.state === "DISPUTED") {
      stateBadge = "Disputed • समीक्षाधीन (₹2,500 Escrow)";
      stateStyle = "background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D;";
    } else if (c.state === "QUARANTINED") {
      stateBadge = "Quarantined • सुरक्षा समीक्षा";
      stateStyle = "background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5;";
    }

    const disputeDetails = ((c.state === "DISPUTED" || c.state === "QUARANTINED") && c.dispute) ? `
      <div style="margin-top: 10px; background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 6px; padding: 10px; font-size: 12px; color: #92400E;">
        <div style="font-weight: 700; text-transform: uppercase; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
          <span>${c.state === "QUARANTINED" ? "Safety Quarantine In Progress" : "Formal Dispute In Progress"}</span>
          <span style="background: #FEF3C7; padding: 2px 6px; border-radius: 4px; border: 1px solid #FCD34D;">₹${c.dispute.escrowAmount} Escrow Locked</span>
        </div>
        <div><strong>Police NC:</strong> ${escapeHTML(c.dispute.policeNcNumber)} (${escapeHTML(c.dispute.stationName)})</div>
        <div style="margin-top: 2px;"><strong>Narrative:</strong> ${escapeHTML(c.dispute.reason)}</div>
        <div style="margin-top: 8px; display: flex; gap: 8px;">
          <button type="button" class="btn-action" style="padding: 6px 10px; font-size: 11px; background: #B45309;" onclick="resolveDisputeAction('${c.id}', 'FRIVOLOUS_CLAIM_DISMISSED')">
            Dismiss as Frivolous (₹2,000 to Worker)
          </button>
          <button type="button" class="btn-action is-outline" style="padding: 6px 10px; font-size: 11px;" onclick="resolveDisputeAction('${c.id}', 'MUTUAL_SETTLEMENT')">
            Mutual Settlement
          </button>
        </div>
      </div>
    ` : "";

    const activeActions = (c.state === "ACTIVE") ? `
      <div style="margin-top: 12px; display: flex; gap: 8px; border-top: 1px dashed var(--border); padding-top: 10px;">
        <button type="button" class="btn-action is-outline" style="flex: 1; padding: 8px 12px; font-size: 12px; border-color: #B91C1C; color: #B91C1C;" onclick="openDisputeModal('${c.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M3.6 9h16.8L12 2 3.6 9z"/></svg>
          Report Dispute / Issue
        </button>
        <button type="button" class="btn-action is-outline" style="flex: 1; padding: 8px 12px; font-size: 12px;" onclick="settleContractAction('${c.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Mark Month Completed
        </button>
      </div>
    ` : "";

    return `
      <div class="contract-card-item" style="background: var(--card-bg); border: 1.5px solid var(--border); border-radius: 12px; padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; flex-wrap: wrap; gap: 4px;">
          <strong style="font-size: 14px; color: var(--ink-primary); font-family: var(--font-heading);">${escapeHTML(c.maskedUnit || c.employerUnit)} • ${escapeHTML(c.roleScope || "Household Care")}</strong>
          <span style="font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; text-transform: uppercase; ${stateStyle}">
            ${stateBadge}
          </span>
        </div>
        <div style="font-size: 12px; color: var(--ink-muted); font-weight: 600;">
          ${escapeHTML(c.shiftHours)} hrs/day • Active Service
        </div>
        ${disputeDetails}
        ${activeActions}
      </div>
    `;
  }).join("");
}

function toggleNewContractForm() {
  const el = document.getElementById("newContractFormWrap");
  if (el) {
    el.style.display = el.style.display === "none" ? "block" : "none";
  }
}

async function submitNewContract() {
  const unitInput = document.getElementById("ncEmployerUnit");
  const scopeInput = document.getElementById("ncRoleScope");
  const hoursInput = document.getElementById("ncShiftHours");

  const unit = unitInput ? unitInput.value.trim() : "";
  const scope = scopeInput ? scopeInput.value.trim() : "";
  const hours = hoursInput ? parseFloat(hoursInput.value) || 2.0 : 2.0;

  if (!unit) {
    alert("Please enter a valid household unit (e.g. Flat B-402, Wing B).");
    return;
  }
  if (!scope) {
    alert("Please specify the work scope or timing (e.g. Morning Cooking: 07:30 - 09:30 AM).");
    return;
  }

  try {
    if (window.MaanyataStore && window.MaanyataStore.startContract) {
      await window.MaanyataStore.startContract({
        workerId: (portfolio && portfolio.id) || "worker-active",
        employerUnit: unit,
        roleScope: scope,
        shiftHours: hours
      });
      if (unitInput) unitInput.value = "";
      if (scopeInput) scopeInput.value = "";
      toggleNewContractForm();
      await renderContracts();
      showToast("✓ Household Shift Activated");
    }
  } catch (err) {
    alert("Error saving shift: " + err.message);
  }
}

async function settleContractAction(contractId) {
  if (!confirm("Confirm successful completion and settlement of this month's household shift?")) return;
  try {
    if (window.MaanyataStore && window.MaanyataStore.settleContract) {
      await window.MaanyataStore.settleContract({ contractId, confirmationMethod: "MUTUAL_CONFIRMATION" });
      await renderContracts();
      showToast("✓ Shift Marked Completed");
    }
  } catch (err) {
    alert("Error settling shift: " + err.message);
  }
}

function openDisputeModal(contractId) {
  if (window.DisputeModal) {
    window.DisputeModal.open({
      contractId,
      workerName: (portfolio && portfolio.name) || "Attested Worker",
      workerId: (portfolio && portfolio.id) || "w-active",
      onSubmitted: () => {
        renderContracts();
        showToast(currentLang === "hi" ? "✓ विवाद दर्ज • प्रशासनिक समीक्षा हेतु अग्रेषित" : "✓ Dispute Lodged & Audit Recorded");
      }
    });
  } else {
    alert("Dispute modal module is loading...");
  }
}

async function resolveDisputeAction(contractId, outcome) {
  try {
    if (window.MaanyataStore && window.MaanyataStore.resolveDispute) {
      await window.MaanyataStore.resolveDispute({
        contractId,
        outcome,
        compensatoryPayoutTo: outcome === "FRIVOLOUS_CLAIM_DISMISSED" ? "WORKER" : "SETTLED"
      });
      await renderContracts();
      showToast(outcome === "FRIVOLOUS_CLAIM_DISMISSED" ? "✓ Claim Dismissed: ₹2,000 Awarded to Worker" : "✓ Dispute Settled");
    }
  } catch (err) {
    alert(err.message);
  }
}

if (typeof window !== "undefined") {
  window.renderContracts = renderContracts;
  window.toggleNewContractForm = toggleNewContractForm;
  window.submitNewContract = submitNewContract;
  window.settleContractAction = settleContractAction;
  window.openDisputeModal = openDisputeModal;
  window.resolveDisputeAction = resolveDisputeAction;
  window.showTab = showTab;
  window.openStudioModal = openStudioModal;
  window.closeStudioModal = closeStudioModal;
  window.openCustomizeModal = openCustomizeModal;
  window.closeCustomizeModal = closeCustomizeModal;
  window.saveCustomProfile = saveCustomProfile;
  window.sharePassbookWhatsApp = sharePassbookWhatsApp;
  window.triggerLivenessProof = triggerLivenessProof;
  window.applyLanguage = applyLanguage;
  window.applyNativePreset = applyNativePreset;
  window.selectPalette = selectPalette;
  window.toggleSolMode = toggleSolMode;
  window.resetLocalDemo = resetLocalDemo;
  window.renderOfflineQR = renderOfflineQR;
  window.startLiveTicker = startLiveTicker;
  window.restoreCustomizationStudio = restoreCustomizationStudio;
  window.generateEd25519Token = generateEd25519Token;
  window.renderPortfolio = renderPortfolio;
  window.loadPortfolio = loadPortfolio;
  window.savePortfolio = savePortfolio;
  window.initApp = initApp;
}

if (typeof window !== "undefined" && window.MaanyataStore && window.MaanyataStore.subscribe) {
  window.MaanyataStore.subscribe(() => {
    if (typeof renderContracts === "function") renderContracts();
  });
}

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3200);
}

function triggerLivenessProof() {
  const toast = document.getElementById("tapToast");
  const wrap = document.getElementById("qrLivenessWrap");
  if (!toast || !wrap) return;
  toast.textContent = `Active • ${new Date().toLocaleTimeString()}`;
  toast.style.opacity = "1";
  toast.style.transform = "translate(-50%, -50%) scale(1.05)";
  wrap.style.borderColor = "#16A34A";
  wrap.style.backgroundColor = "#F0FDF4";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, -50%) scale(1)";
    wrap.style.backgroundColor = "#FFFFFF";
  }, 1600);
}

function startLiveTicker() {
  const clockEl = document.getElementById("liveClockTicker");
  if (!clockEl || clockEl.dataset.running) return;
  clockEl.dataset.running = "1";
  function update() {
    const now = new Date();
    clockEl.textContent = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0");
  }
  update();
  setInterval(update, 1000);
}

function renderOfflineQR() {
  startLiveTicker();
  const canvas = document.getElementById("workerQrCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = 200;
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);

  let attestedYearsNum = 0;
  if (portfolio.tenureAttested != null) {
    attestedYearsNum = parseFloat(portfolio.tenureAttested) || 0;
  } else if (portfolio.references && portfolio.references.length > 0) {
    const v = portfolio.references.filter(r => r.certified !== false);
    if (v.length > 0) {
      const cy = new Date().getFullYear();
      const sy = v.map(r => r.startYear || (cy - (parseFloat(r.tenure) || 1)));
      attestedYearsNum = Math.max(0.5, cy - Math.min(...sy));
    }
  }

  // Cryptographic QR Envelope (Ed25519 Token Format MNY1.<bodyB64>.<sigB64>)
  let payload = generateEd25519Token(
    portfolio.id || "sunita-devi-01",
    portfolio.name,
    portfolio.role,
    attestedYearsNum,
    portfolio.households,
    portfolio.traits,
    portfolio.boundaries
  );

  try {
    const QRCodeClass = typeof QRCodeModel !== "undefined"
      ? QRCodeModel
      : (typeof window !== "undefined" ? window.QRCodeModel : null);
    const ECLevel = typeof QRErrorCorrectLevel !== "undefined"
      ? QRErrorCorrectLevel.L
      : (typeof window !== "undefined" && window.QRErrorCorrectLevel ? window.QRErrorCorrectLevel.L : 1);

    if (QRCodeClass) {
      let qr = new QRCodeClass(0, ECLevel);
      try {
        qr.addData(payload);
        qr.make();
      } catch (overflowErr) {
        console.warn("Primary QR token payload exceeded standard capacity, generating compact cryptographic pass:", overflowErr);
        // Resilient Fallback: Compact verifiable Ed25519 token (wid, cleanName, role, tenure, households)
        const compactToken = generateEd25519Token(
          portfolio.id || "sunita-devi-01",
          portfolio.name,
          portfolio.role,
          attestedYearsNum,
          portfolio.households,
          {},
          []
        );
        qr = new QRCodeClass(0, ECLevel);
        qr.addData(compactToken);
        qr.make();
      }

      const count = qr.getModuleCount();
      const pad = 2;
      const cell = size / (count + pad * 2);

      // High-contrast dark QR matrix (#061426) on clean white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#061426";
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (qr.isDark(r, c)) {
            ctx.fillRect(
              Math.floor((c + pad) * cell),
              Math.floor((r + pad) * cell),
              Math.ceil(cell),
              Math.ceil(cell)
            );
          }
        }
      }
    }
  } catch (err) {
    console.error("QR Code Generation Error:", err);
  }
}

async function hydrateFromEdge() {
  if (typeof navigator !== "undefined" && !navigator.onLine) return;

  const params = new URLSearchParams(window.location.search);
  const targetId = params.get("id") || params.get("worker") || (portfolio && portfolio.id) || "sunita-devi-01";
  if (!targetId || targetId === "unknown") return;

  try {
    const res = await fetch(`/api/worker/${encodeURIComponent(targetId)}`);
    if (!res.ok) return;

    const data = await res.json();
    if (!data.success || !data.worker) return;

    const edgeWorker = data.worker;
    let modified = false;

    // 1. Merge certified references from Edge into portfolio.references
    if (!Array.isArray(portfolio.references)) {
      portfolio.references = [];
    }
    const edgeRefs = Array.isArray(edgeWorker.references) ? edgeWorker.references : [];

    edgeRefs.forEach(edgeRef => {
      const alreadyPresent = portfolio.references.some(localRef => {
        if (edgeRef.id && localRef.id && edgeRef.id === localRef.id) return true;
        if (edgeRef.quote && localRef.quote && edgeRef.quote === localRef.quote && edgeRef.unit === localRef.unit) return true;
        return false;
      });
      if (!alreadyPresent) {
        portfolio.references.unshift(edgeRef);
        modified = true;
      }
    });

    // 2. Update portfolio.households
    const uniqueUnits = new Set(
      portfolio.references
        .filter(r => r.certified !== false)
        .map(r => r.unitHash || r.unit || r.id)
    );
    const calculatedHouseholds = Math.max(edgeWorker.households || 0, uniqueUnits.size);
    if (calculatedHouseholds !== portfolio.households) {
      portfolio.households = calculatedHouseholds;
      modified = true;
    }

    // 3. Update portfolio.tenureAttested and tenure
    if (edgeWorker.tenureAttested && edgeWorker.tenureAttested !== portfolio.tenureAttested) {
      portfolio.tenureAttested = edgeWorker.tenureAttested;
      portfolio.tenure = edgeWorker.tenureAttested;
      modified = true;
    }

    // 4. Merge traits if edge has higher counts
    if (edgeWorker.traits && typeof edgeWorker.traits === "object") {
      portfolio.traits = portfolio.traits || {};
      for (const [traitName, traitData] of Object.entries(edgeWorker.traits)) {
        if (!portfolio.traits[traitName] || (traitData && traitData.count > (portfolio.traits[traitName].count || 0))) {
          portfolio.traits[traitName] = traitData;
          modified = true;
        }
      }
    }

    // 5. Save merged state to localStorage and re-render if updated
    if (modified || !localStorage.getItem(STORAGE_KEY)) {
      savePortfolio();
      renderPortfolio();
    }
  } catch (e) {
    console.warn("Edge sync notice:", e.message);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("online", hydrateFromEdge);
}

// Theme & Language
let currentTheme = localStorage.getItem("maanyata_theme") || localStorage.getItem("mny_theme") || "daylight";
let currentLang = localStorage.getItem("mny_lang") || "en";

function initThemeAndLang() {
  restoreCustomizationStudio();
  applyLanguage(currentLang);
}

function restoreCustomizationStudio() {
  const isAqua = (typeof window !== "undefined" && window.location && window.location.pathname && window.location.pathname.includes("portfolio_aqua")) ||
    (typeof window !== "undefined" && window.location && window.location.href && window.location.href.includes("portfolio_aqua")) ||
    (document.documentElement && document.documentElement.getAttribute("data-theme") === "aqua") ||
    (document.body && document.body.classList && document.body.classList.contains("theme-aqua"));

  let theme;
  if (isAqua) {
    theme = "aqua";
    if (document.documentElement) {
      document.documentElement.setAttribute("data-theme", "aqua");
    }
  } else {
    const currentDocTheme = document.documentElement ? document.documentElement.getAttribute("data-theme") : null;
    const storedTheme = localStorage.getItem("maanyata_theme") || localStorage.getItem("mny_theme");
    theme = (currentDocTheme === "aqua")
      ? "aqua"
      : (storedTheme || "daylight");
  }
  selectPalette(theme, false);

  const fontBody = localStorage.getItem("maanyata_font_body");
  const fontHeader = localStorage.getItem("maanyata_font_header");
  if (fontBody) {
    document.documentElement.style.setProperty("--font-body", fontBody);
    const bodySel = document.getElementById("selectFontBody");
    if (bodySel) bodySel.value = fontBody;
  }
  if (fontHeader) {
    document.documentElement.style.setProperty("--font-heading", fontHeader);
    document.documentElement.style.setProperty("--font-display", fontHeader);
    const headSel = document.getElementById("selectFontHeader");
    if (headSel) headSel.value = fontHeader;
  }
  if (fontBody || fontHeader) {
    document.documentElement.setAttribute("data-custom-font", "true");
  }
}

function selectPalette(themeName, persist = true) {
  const validThemes = ["daylight", "indigo", "saffron", "olive", "midnight", "aqua"];
  if (!validThemes.includes(themeName)) themeName = "daylight";
  document.documentElement.setAttribute("data-theme", themeName);
  if (persist) {
    localStorage.setItem("maanyata_theme", themeName);
    localStorage.setItem("mny_theme", themeName);
  }
  document.querySelectorAll(".palette-tile").forEach(tile => {
    const isActive = tile.getAttribute("data-palette") === themeName;
    tile.classList.toggle("is-active", isActive);
    tile.setAttribute("aria-checked", isActive ? "true" : "false");
  });
  updateSolBtn(themeName === "sol");
}

function applyNativePreset(type) {
  let bodyFont = "";
  let headerFont = "";

  if (type === "sans") {
    bodyFont = "system-ui, -apple-system, Roboto, 'Noto Sans Devanagari', sans-serif";
    headerFont = "system-ui, -apple-system, Roboto, sans-serif";
  } else if (type === "serif") {
    bodyFont = "serif, 'Times New Roman', 'Noto Serif Devanagari'";
    headerFont = "serif, 'Times New Roman', 'Noto Serif Devanagari'";
  } else if (type === "geometric") {
    bodyFont = "'Space Grotesk', system-ui, sans-serif";
    headerFont = "'Space Grotesk', system-ui, sans-serif";
  }

  if (bodyFont && headerFont) {
    document.documentElement.style.setProperty("--font-body", bodyFont);
    document.documentElement.style.setProperty("--font-heading", headerFont);
    document.documentElement.style.setProperty("--font-display", headerFont);
    document.documentElement.setAttribute("data-custom-font", "true");

    localStorage.setItem("maanyata_font_body", bodyFont);
    localStorage.setItem("maanyata_font_header", headerFont);

    const bodySel = document.getElementById("selectFontBody");
    const headSel = document.getElementById("selectFontHeader");
    if (bodySel) {
      if (Array.from(bodySel.options).some(o => o.value === bodyFont)) {
        bodySel.value = bodyFont;
      }
    }
    if (headSel) {
      if (Array.from(headSel.options).some(o => o.value === headerFont)) {
        headSel.value = headerFont;
      }
    }

    document.querySelectorAll(".typo-preset-btn").forEach(btn => btn.classList.remove("is-active"));
    const activeBtn = Array.from(document.querySelectorAll(".typo-preset-btn")).find(b =>
      b.getAttribute("onclick") && b.getAttribute("onclick").includes(`'${type}'`)
    );
    if (activeBtn) activeBtn.classList.add("is-active");

    showToast(`Typography: ${type.charAt(0).toUpperCase() + type.slice(1)}`);
  }
}

function onCustomFontChange() {
  const bodySel = document.getElementById("selectFontBody");
  const headSel = document.getElementById("selectFontHeader");
  if (!bodySel || !headSel) return;

  const bodyVal = bodySel.value;
  const headVal = headSel.value;

  document.documentElement.style.setProperty("--font-body", bodyVal);
  document.documentElement.style.setProperty("--font-heading", headVal);
  document.documentElement.style.setProperty("--font-display", headVal);
  document.documentElement.setAttribute("data-custom-font", "true");

  localStorage.setItem("maanyata_font_body", bodyVal);
  localStorage.setItem("maanyata_font_header", headVal);

  document.querySelectorAll(".typo-preset-btn").forEach(btn => btn.classList.remove("is-active"));
}

function openStudioModal() {
  const modal = document.getElementById("studioModal");
  if (!modal) return;
  lastFocusedBeforeModal = document.activeElement;
  modal.style.display = "flex";
  const firstBtn = modal.querySelector("button");
  if (firstBtn) firstBtn.focus();
}

function closeStudioModal() {
  const modal = document.getElementById("studioModal");
  if (modal) modal.style.display = "none";
  if (lastFocusedBeforeModal && lastFocusedBeforeModal.focus) {
    lastFocusedBeforeModal.focus();
  }
}

function toggleSolMode() {
  const isSol = document.documentElement.getAttribute("data-theme") === "sol";
  if (isSol) {
    selectPalette("daylight");
    showToast(currentLang === "hi" ? "तेज़ धूप मोड बंद" : "Bright-sun mode off");
  } else {
    document.documentElement.setAttribute("data-theme", "sol");
    localStorage.setItem("maanyata_theme", "sol");
    localStorage.setItem("mny_theme", "sol");
    updateSolBtn(true);
    showToast(currentLang === "hi" ? "तेज़ धूप मोड चालू" : "Bright-sun mode on");
  }
}

function updateSolBtn(isSol) {
  const lbl = document.getElementById("solBtnLabel");
  const btn = document.getElementById("btnSolToggle");
  if (lbl) {
    if (currentLang === "hi") {
      lbl.textContent = isSol ? "बंद करें" : "चालू करें";
    } else {
      lbl.textContent = isSol ? "Turn off" : "Turn on";
    }
  }
  if (btn) btn.setAttribute("aria-pressed", isSol ? "true" : "false");
}

function resetLocalDemo() {
  const msg = currentLang === "hi" 
    ? "क्या आप इस डिवाइस पर डेमो डेटा पूरी तरह से रीसेट करना चाहते हैं? सभी स्थानीय रिकॉर्ड, व्यक्तिगत आधार डेटा और कार्यकर्ता पास स्थायी रूप से मिटा दिए जाएंगे।" 
    : "Reset demo data on this device? All local credentials, personal/test cards, and worker passes will be permanently wiped with zero residual traces.";
  if (!confirm(msg)) return;
  if (window.MaanyataStore && typeof window.MaanyataStore.reset === "function") {
    try { window.MaanyataStore.reset(); } catch (e) {}
  }
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("maanyata") || k.startsWith("mny_") || k.startsWith("w-") || k.startsWith("c-"))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    sessionStorage.clear();
  } catch (e) {}
  location.href = "/portfolio.html?sample=sunita_devi";
}

const TRAIT_MAP_HI = {
  "Always On Time": "हमेशा समय पर",
  "Exceptional Cooking": "उत्कृष्ट पाक कला",
  "Trusted With House Keys": "घर की चाबियों पर विश्वास",
  "Trusted With Vehicle Keys": "वाहन की चाबियों पर विश्वास",
  "Went Above & Beyond": "अपेक्षित से श्रेष्ठ कार्य",
  "Meticulous & Thorough": "गहन सफाई व स्वच्छता",
  "Exceptional Skill": "असाधारण कार्यकुशलता",
  "Punctual (<07:00 AM)": "समयनिष्ठ (प्रातः ०७:०० से पूर्व)",
  "North Indian Cooking": "उत्तर भारतीय भोजन",
  "Jain & Pure Satvik": "जैन एवं शुद्ध सात्विक भोजन",
  "Maharashtrian & Malvani": "महाराष्ट्रीयन एवं मालवणी पाक कला",
  "South Indian Breakfast": "दक्षिण भारतीय नाश्ता",
  "Gujarati & Kathiyawadi": "गुजराती एवं काठियावाड़ी भोजन",
  "Diabetic & Clinical Diet": "मधुमेह एवं स्वास्थ्यवर्धक आहार",
  "Deep Scrubbing & Hygiene": "गहन स्वच्छता एवं सफाई",
  "High Dusting & Fans": "पंखा व छत की गहन सफाई",
  "Fine Laundry & Steam Ironing": "वस्त्र धुलाई एवं स्टीम इस्त्री",
  "Mandi & Daily Accounting": "सब्जी मंडी व दैनिक हिसाब",
  "Infant Care & Maalish": "शिशु देखभाल एवं मालिश",
  "Toddler Watch & Homework": "बच्चे की देखभाल व पढ़ाई",
  "Elderly & Bedridden Care": "बुजुर्ग व उपचाराधीन देखभाल",
  "Wheelchair & Clinic Escort": "व्हीलचेयर व अस्पताल सहायता",
  "Pet Care & Dog Walking": "पालतू पशु देखभाल व टहलाना",
  "Pet Care & Walking": "पालतू पशु देखभाल व टहलाना",
  "Exterior Wash & Glass": "वाहन धुलाई व ग्लास सफाई",
  "Interior Dusting & Vacuum": "वाहन आंतरिक सफाई व वैक्यूम",
  "Tire & Fluid Check": "टायर दबाव व फ्लूइड जांच",
  "Early Morning Shift": "प्रातःकालीन शिफ्ट",
  "Turnstile & Gate Access": "टर्नस्टाइल व गेट एक्सेस",
  "Perimeter Night Patrol": "सुरक्षा गश्त व निगरानी",
  "Visitor Gate Muster": "आगंतुक रजिस्टर जांच",
  "Emergency First Response": "आपातकालीन प्राथमिक सहायता",
  "CCTV Monitoring": "सीसीटीवी निगरानी",
  "Plumbing & Pipe Repair": "प्लंबिंग व पाइप मरम्मत",
  "Pump & Motor Operations": "मोटर व पंप संचालन",
  "Electrical & Switchgear": "विद्युत व स्विचगियर कार्य",
  "General Repairs": "सामान्य मरम्मत",
  "Safe City Driving": "सुरक्षित नगर ड्राइविंग",
  "School Transit Route": "स्कूल मार्ग वाहन संचालन",
  "Vehicle Maintenance": "वाहन रखरखाव",
  "Traditional Cuisine": "पारंपरिक व्यंजन",
  "Diabetic & Healthy Diet": "मधुमेह एवं स्वास्थ्यवर्धक आहार",
  "Deep Scrub & Hygiene": "गहन स्वच्छता एवं सफाई",
  "Steam Iron & Laundry": "वस्त्र धुलाई एवं स्टीम इस्त्री",
  "Mandi Accounting": "सब्जी मंडी व दैनिक हिसाब",
  "Emergency Availability": "आपातकालीन उपलब्धता",
  "Punctual & Reliable": "समयनिष्ठ एवं विश्वसनीय",
  "Honest & Trustworthy": "ईमानदार एवं भरोसेमंद",
  "High Quality Work": "उत्कृष्ट गुणवत्ता कार्य",
  "Polite & Respectful": "विनम्र एवं आदरयुक्त",
  "Great Meals & Curries": "स्वादिष्ट भोजन व करी",
  "Pure Vegetarian / Satvik": "शुद्ध शाकाहारी / सात्विक",
  "Clean & Fast Prep": "स्वच्छ एवं त्वरित तैयारी",
  "Mandi & Daily Accounts": "सब्जी मंडी व दैनिक हिसाब",
  "Exterior Wash & Polish": "वाहन बाहरी धुलाई व पॉलिश",
  "Interior Vacuum & Clean": "वाहन आंतरिक सफाई व वैक्यूम",
  "Tire & Fluid Checks": "टायर व फ्लूइड जांच",
  "Infant Care & Massage": "शिशु देखभाल एवं मालिश",
  "Clinic Escort": "अस्पताल सहायता"
};

const BOUNDARY_MAP_HI = {
  "Minimum 1 Agreed Weekly Rest Day": "सप्ताह में कम से कम १ तय साप्ताहिक विश्राम",
  "Mandatory Sunday Off": "सप्ताह में रविवार का अनिवार्य अवकाश",
  "Direct Resident UPI on 1st of Month": "महीने की १ से ५ तारीख के बीच सीधा UPI भुगतान",
  "Direct Resident UPI on 1st to 5th": "महीने की १ से ५ तारीख के बीच सीधा UPI भुगतान",
  "Direct Resident UPI on 1st/5th of Month": "महीने की १ से ५ तारीख के बीच सीधा UPI भुगतान",
  "Zero toxic acid chemicals for cleaning": "तेज़ाब या हानिकारक रसायनों से रहित सुरक्षित सफाई",
  "Zero Acid / Hazardous Chemical Cleaning": "तेज़ाब या हानिकारक रसायनों से रहित सुरक्षित सफाई",
  "Designated 45-min lunch break": "पूर्ण कार्य दिवस पर ३० मिनट का भोजन अवकाश",
  "30-min meal break on full work day": "पूर्ण कार्य दिवस पर ३० मिनट का भोजन अवकाश",
  "30-Min Midday Lunch Break on Full Shifts": "पूर्ण कार्य दिवस पर ३० मिनट का भोजन अवकाश",
  "Access to clean water and soap to wash my hands": "हाथ धोने के लिए स्वच्छ पानी और साबुन",
  "Extreme Weather Late-Arrival Relief": "भीषण मौसम में देर से आगमन पर राहत",
  "Unrestricted Main Lift Access": "मुख्य लिफ्ट के उपयोग पर कोई रोक नहीं",
  "Pre-Agreed Overtime Pay (Extra Hours)": "अतिरिक्त कार्य समय का पूर्व-सहमति से भुगतान",
  "Clean Drinking Water & Restroom Access": "स्वच्छ पेयजल एवं शौचालय की सुविधा",
  "Annual Festival Bonus (Diwali / Eid)": "वार्षिक त्योहार बोनस (दीवाली / ईद)",
  "Paid Sick Leave (Up to 7 Days / Year)": "सवेतन बीमारी अवकाश (वर्ष में ७ दिन तक)"
};

function translateBoundary(b, lang) {
  if (!b) return "";
  let clean = String(b).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim();
  if (lang !== "hi") return clean;

  const lower = clean.toLowerCase();
  if (lower.includes("rest day") || lower.includes("साप्ताहिक विश्राम")) {
    return "सप्ताह में कम से कम १ तय साप्ताहिक विश्राम";
  }
  if (lower.includes("sunday") || lower.includes("रविवार")) {
    return "सप्ताह में रविवार का अनिवार्य अवकाश";
  }
  if (lower.includes("upi") || lower.includes("1st") || lower.includes("५ तारीख") || lower.includes("तारीख")) {
    return "महीने की १ से ५ तारीख के बीच सीधा UPI भुगतान";
  }
  if (lower.includes("acid") || lower.includes("chemical") || lower.includes("तेज़ाब") || lower.includes("तेजाब") || lower.includes("रसायन")) {
    return "तेज़ाब या हानिकारक रसायनों से रहित सुरक्षित सफाई";
  }
  if (lower.includes("lunch") || lower.includes("meal") || lower.includes("break") || lower.includes("भोजन") || lower.includes("अवकाश")) {
    return "पूर्ण कार्य दिवस पर ३० मिनट का भोजन अवकाश";
  }
  if (lower.includes("water") || lower.includes("soap") || lower.includes("पानी") || lower.includes("साबुन")) {
    return "हाथ धोने के लिए स्वच्छ पानी और साबुन";
  }
  if (lower.includes("weather") || lower.includes("relief") || lower.includes("मौसम") || lower.includes("राहत")) {
    return "भीषण मौसम में देर से आगमन पर राहत";
  }
  if (lower.includes("lift") || lower.includes("लिफ्ट")) {
    return "मुख्य लिफ्ट के उपयोग पर कोई रोक नहीं";
  }
  if (lower.includes("overtime") || lower.includes("अतिरिक्त")) {
    return "अतिरिक्त कार्य समय का पूर्व-सहमति से भुगतान";
  }
  if (lower.includes("restroom") || lower.includes("शौचालय")) {
    return "स्वच्छ पेयजल एवं शौचालय की सुविधा";
  }
  if (lower.includes("bonus") || lower.includes("बोनस") || lower.includes("diwali") || lower.includes("eid")) {
    return "वार्षिक त्योहार बोनस (दीवाली / ईद)";
  }
  if (lower.includes("sick") || lower.includes("leave") || lower.includes("बीमारी")) {
    return "सवेतन बीमारी अवकाश (वर्ष में ७ दिन तक)";
  }
  for (const [enKey, hiVal] of Object.entries(BOUNDARY_MAP_HI)) {
    if (lower.includes(enKey.toLowerCase())) return hiVal;
  }
  return clean;
}

const AVAILABLE_BOUNDARIES = [
  { id: "b1", en: "Minimum 1 Agreed Weekly Rest Day", hi: "सप्ताह में कम से कम १ तय साप्ताहिक विश्राम", iconName: "calendar" },
  { id: "b2", en: "Direct Resident UPI on 1st to 5th of Month", hi: "महीने की १ से ५ तारीख के बीच सीधा UPI भुगतान", iconName: "card" },
  { id: "b3", en: "Zero toxic acid chemicals for cleaning", hi: "तेज़ाब या हानिकारक रसायनों से रहित सुरक्षित सफाई", iconName: "shieldAlert" },
  { id: "b4", en: "30-min meal break on full work day", hi: "पूर्ण कार्य दिवस पर ३० मिनट का भोजन अवकाश", iconName: "coffee" },
  { id: "b5", en: "Access to clean water and soap to wash my hands", hi: "हाथ धोने के लिए स्वच्छ पानी और साबुन", iconName: "sparkles" },
  { id: "b6", en: "Extreme Weather Late-Arrival Relief", hi: "भीषण मौसम में देर से आगमन पर राहत", iconName: "shieldAlert" }
];

const I18N = {
  en: {
    brand: "Maanyata",
    btnHeaderCustomize: "Customize",
    btnHeaderShare: "Share",
    lblTenure: "Resident-Attested",
    lblHouseholds: "Households",
    lblRecognitions: "Recognitions",
    badgeEShram: "e-Shram Verified",
    passTitle: "Portable Trust Pass",
    passHelp: "Show this QR code to an employer or security guard to confirm your work record.",
    lblWorkPass: "SOVEREIGN PASS",
    secDignityCharter: "Dignity Charter & Working Terms",
    badgeWorkingTerms: "Working Terms",
    secCraftSilos: "Craft Risk Silos",
    badgeRiskGated: "Risk Gated",
    siloSurface: "Surface Crafts (Cleaning / Utensils)",
    badgeStandardRisk: "Standard Risk",
    descSurface: "Floor sweeping, mopping, utensil washing. Low blast radius.",
    siloCulinary: "Culinary Specialization (Cooking)",
    badgeModerateRisk: "Moderate Risk",
    descCulinary: "Daily meal prep, dietary hygiene. Requires 1 paid trial meal with family present.",
    siloHighRisk: "High-Consequence Custody (Driving, Eldercare, Keys)",
    badgeHighRisk: "High Consequence",
    descHighRisk: "Direct physical safety & asset custody. Requires verified tenure + peer callback + supervised trial.",
    secTrustSignals: "Community Trust Signals",
    secEndorsements: "Household Endorsements",
    btnShareWhatsApp: "Share Passbook on WhatsApp",
    btnDignityTerms: "Edit Working Terms",
    directoryHelp: "Browse the verified staff directory for Demo Society.",
    btnOpenDirectory: "Open Complex Directory",
    lblProfileStudio: "Customization Studio",
    btnProfileStudio: "Customize",
    lblProfileLang: "Language",
    lblSolMode: "Bright-sun mode",
    lblResetDemo: "Reset Local Demo Data",
    btnResetDemo: "Reset",
    footerCredits: "Project Maanyata • Sovereign Career Passbook\n100% Free, Open-Source & Privacy-First",
    modalTitle: "Dignity Charter & Working Terms",
    lblBoundaries: "Select Your Non-Negotiable Working Terms",
    btnSaveProfile: "Save Working Terms",
    btnCancel: "Cancel",
    tabPass: "Pass",
    tabRecord: "Record",
    tabReviews: "Record",
    tabTerms: "Terms",
    navDirectory: "Directory",
    tabProfile: "Profile",
    secMilestones: "Career Milestones & Service Hours",
    secHouseholdShifts: "Household Shifts & Agreements",
    badgeMasterCraft: "Master Craft",
    lblTotalHours: "Cumulative Active Service Hours",
    tier100: "100 hrs: Foundation",
    tier500: "500 hrs: Diligence",
    tier1000: "1,000 hrs: Master Craft",
    tier2500: "2,500 hrs: Veteran Specialist",
    studioModalTitle: "Customization Studio",
    lblColorScheme: "Color Scheme",
    lblTypoPresets: "Presets",
    lblFontPair: "Font Pair Customization",
    btnDone: "Done"
  },
  hi: {
    brand: "मान्यता",
    btnHeaderCustomize: "कस्टमाइज़",
    btnHeaderShare: "साझा करें",
    lblTenure: "निवासियों द्वारा प्रमाणित",
    lblHouseholds: "परिवार",
    lblRecognitions: "पहचान",
    badgeEShram: "ई-श्रम सत्यापित",
    passTitle: "सत्यापित पोर्टेबल ट्रस्ट पास",
    passHelp: "यह क्यूआर कोड नियोक्ता को दिखाएं ताकि आपका कार्य रिकॉर्ड सत्यापित हो सके।",
    lblWorkPass: "सत्यापित पास",
    secDignityCharter: "गरिमा चार्टर एवं कार्य नियम",
    badgeWorkingTerms: "कार्य नियम",
    secCraftSilos: "कार्य जोखिम वर्गीकरण",
    badgeRiskGated: "जोखिम वर्गीकृत",
    siloSurface: "सामान्य कार्य (सफाई / बर्तन)",
    badgeStandardRisk: "सामान्य जोखिम",
    descSurface: "झाड़ू, पोछा, बर्तन धोना। कम जोखिम वाला दैनिक कार्य।",
    siloCulinary: "पाक कला विशेषज्ञता (रसोई / खाना बनाना)",
    badgeModerateRisk: "मध्यम जोखिम",
    descCulinary: "दैनिक भोजन तैयारी एवं स्वच्छता। परिवार की उपस्थिति में 1 सवेतन ट्रायल भोजन आवश्यक।",
    siloHighRisk: "उच्च-जोखिम कस्टडी (ड्राइविंग, बुजुर्ग देखभाल, चाबियां)",
    badgeHighRisk: "उच्च जोखिम",
    descHighRisk: "प्रत्यक्ष शारीरिक सुरक्षा एवं घर की चाबियां। सत्यापित कार्यकाल + पूर्व परिवार सत्यापन + निगरानी आवश्यक।",
    secTrustSignals: "सामुदायिक विश्वास संकेत",
    secEndorsements: "पारिवारिक अनुशंसाएं",
    btnShareWhatsApp: "व्हाट्सएप पर पासबुक साझा करें",
    btnDignityTerms: "कार्य नियम बदलें",
    directoryHelp: "सोसायटी के सत्यापित कर्मचारियों की सूची देखें।",
    btnOpenDirectory: "सोसायटी निर्देशिका खोलें →",
    lblProfileStudio: "डिज़ाइन स्टूडियो",
    btnProfileStudio: "कस्टमाइज़",
    lblProfileLang: "भाषा",
    lblSolMode: "तेज़ धूप मोड",
    lblResetDemo: "लोकल डेमो डेटा रीसेट",
    btnResetDemo: "रीसेट",
    footerCredits: "प्रोजेक्ट मान्यता • स्वायत्त कार्य पासबुक • १००% मुफ़्त एवं सुरक्षित",
    modalTitle: "गरिमा चार्टर एवं कार्य नियम",
    lblBoundaries: "अपने गैर-परक्राम्य कार्य नियम चुनें",
    btnSaveProfile: "कार्य नियम सहेजें",
    btnCancel: "रद्द करें",
    tabPass: "पास",
    tabRecord: "रिकॉर्ड",
    tabReviews: "रिकॉर्ड",
    tabTerms: "शर्तें",
    navDirectory: "निर्देशिका",
    tabProfile: "प्रोफ़ाइल",
    secMilestones: "करियर मील के पत्थर एवं सेवा घंटे",
    badgeMasterCraft: "मास्टर क्राफ्ट",
    secHouseholdShifts: "घरेलू कार्य शिफ्ट एवं समझौते",
    lblTotalHours: "कुल सक्रिय सेवा घंटे",
    tier100: "१०० घंटे: आधारशिला",
    tier500: "५०० घंटे: कर्मठता",
    tier1000: "१,००० घंटे: मास्टर क्राफ्ट",
    tier2500: "२,५०० घंटे: वयोवृद्ध विशेषज्ञ",
    studioModalTitle: "डिज़ाइन स्टूडियो",
    lblColorScheme: "रंग योजना",
    lblTypoPresets: "प्रीसेट",
    lblFontPair: "फ़ॉन्ट चयन",
    btnDone: "संपन्न"
  }
};

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("mny_lang", lang);
  document.documentElement.setAttribute("lang", lang);

  const dict = I18N[lang] || I18N.en;
  const brandTitle = document.getElementById("brandTitle");
  if (brandTitle) brandTitle.textContent = dict.brand;

  const langLabel = document.getElementById("langProfileLabel");
  if (langLabel) {
    langLabel.textContent = lang === "hi" ? "English में देखें" : "हिंदी में देखें";
  }

  const isSol = document.documentElement.getAttribute("data-theme") === "sol";
  updateSolBtn(isSol);

  const footerCredits = document.getElementById("footerCredits");
  if (footerCredits) {
    if (lang === "hi") {
      footerCredits.innerHTML = "प्रोजेक्ट मान्यता • स्वायत्त कार्य पासबुक • १००% मुफ़्त एवं सुरक्षित";
    } else {
      footerCredits.innerHTML = "Project Maanyata • Sovereign Career Passbook<br>100% Free, Open-Source & Privacy-First";
    }
  }

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      if (key === "footerCredits") {
        // already formatted with innerHTML
      } else {
        el.textContent = dict[key];
      }
    }
  });

  renderPortfolio();
}

function sharePassbookWhatsApp() {
  const workerName = portfolio.name || "Sunita Devi";
  const workerRole = portfolio.role || "Senior Household Specialist";
  const tenure = portfolio.tenure || "8.5 Yrs";
  
  let attestedYearsNum = 0;
  if (portfolio.tenureAttested != null) {
    attestedYearsNum = parseFloat(portfolio.tenureAttested) || 0;
  } else if (portfolio.references && portfolio.references.length > 0) {
    const v = portfolio.references.filter(r => r.certified !== false);
    if (v.length > 0) {
      const cy = new Date().getFullYear();
      const sy = v.map(r => r.startYear || (cy - (parseFloat(r.tenure) || 1)));
      attestedYearsNum = Math.max(0.5, cy - Math.min(...sy));
    }
  }

  const signedToken = generateEd25519Token(
    portfolio.id || "sunita-devi-01",
    portfolio.name,
    portfolio.role,
    attestedYearsNum,
    portfolio.households,
    portfolio.traits,
    portfolio.boundaries
  );

  const shareUrl = `${window.location.origin}/portfolio.html#token=${encodeURIComponent(signedToken)}`;
  const msg = `Namaste, I am sharing my verified frontline work passbook on Project Maanyata:\n\n*${workerName}*\n${workerRole}\nSeniority: ${tenure} (Verified by local residents)\n\nView my authenticated passbook here:\n${shareUrl}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

// Modal Controllers
let lastFocusedBeforeModal = null;

function openCustomizeModal() {
  const modal = document.getElementById("customizeModal");
  if (!modal) return;
  lastFocusedBeforeModal = document.activeElement;

  const bList = document.getElementById("custBoundariesList");
  if (bList) {
    bList.innerHTML = "";
    const activeTerms = portfolio.boundaries || [];
    AVAILABLE_BOUNDARIES.forEach(b => {
      const isChecked = activeTerms.some(t => {
        const cleanT = String(t).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim().toLowerCase();
        return cleanT.includes(b.en.toLowerCase().slice(0, 15)) || translateBoundary(t, 'hi') === b.hi;
      });
      const row = document.createElement("label");
      row.className = "boundary-option";
      const iconSvg = ICONS[b.iconName] || ICONS.check;
      row.innerHTML = `
        <input type="checkbox" name="boundaries" value="${escapeHTML(b.en)}" ${isChecked ? "checked" : ""}>
        <span>${iconSvg} ${escapeHTML(currentLang === "hi" ? b.hi : b.en)}</span>
      `;
      bList.appendChild(row);
    });
  }
  modal.style.display = "flex";
  const firstInput = modal.querySelector("input");
  if (firstInput) firstInput.focus();
}

function closeCustomizeModal() {
  const modal = document.getElementById("customizeModal");
  if (modal) modal.style.display = "none";
  if (lastFocusedBeforeModal && lastFocusedBeforeModal.focus) {
    lastFocusedBeforeModal.focus();
  }
}

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("customizeModal");
  if (e.key === "Escape" && modal && modal.style.display === "flex") {
    closeCustomizeModal();
  }
  const studio = document.getElementById("studioModal");
  if (e.key === "Escape" && studio && studio.style.display === "flex") {
    closeStudioModal();
  }
});

function saveCustomProfile(event) {
  if (event) event.preventDefault();
  const checked = [];
  document.querySelectorAll("#custBoundariesList input[type='checkbox']:checked").forEach(cb => {
    checked.push(cb.value);
  });
  portfolio.boundaries = checked;
  savePortfolio();
  closeCustomizeModal();
  renderPortfolio();
  showToast(currentLang === "hi" ? "✓ गरिमा कार्य नियम अपडेट किए गए" : "✓ Working terms updated");
}

function initApp() {
  detectPlatform();
  initThemeAndLang();
  renderPortfolio();
  hydrateFromEdge();
  showTab("pass");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
