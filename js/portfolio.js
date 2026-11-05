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
  check: '<svg class="mny-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
};

// Classified Demo Data (Explicitly tagged as demonstration records)
const SAMPLES = {
  sunita_devi: {
    name: "Sunita Devi [Demo Record]",
    role: "Senior Household & Culinary Specialist",
    uan: "UAN ****-****-4921",
    tenure: "8.5 Yrs",
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
        quote: "Sunita has managed meal prep and handled our keys for 4 years with absolute punctuality and honesty.",
        author: "Ms. Demo Resident",
        unit: "Flat A-502, Demo Heights CHS",
        tenure: "4 Yrs Verified",
        certified: true,
        locationVerified: true,
        locationTag: "On-Premises Attestation (Demo CHS)"
      }
    ]
  },
  ramesh_kumar: {
    name: "Ramesh Kumar [Demo Record]",
    role: "Senior Chauffeur & Mobility Assistant",
    uan: "UAN ****-****-8812",
    tenure: "12 Yrs",
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
        author: "Mr. Demo Resident",
        unit: "Flat B-301, Demo Heights CHS",
        tenure: "7 Yrs Verified",
        certified: true,
        locationVerified: true,
        locationTag: "On-Premises Attestation (Demo CHS)"
      }
    ]
  }
};

const UNKNOWN_PORTFOLIO = {
  name: "Unknown Worker",
  role: "No Active Passbook Loaded",
  uan: "UAN Not Linked",
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
    const sampleId = params.get("sample");
    if (sampleId && SAMPLES[sampleId]) {
      return JSON.parse(JSON.stringify(SAMPLES[sampleId]));
    }

    const workerParam = params.get("worker") || params.get("name");
    const craftParam = params.get("craft") || params.get("role");
    if (workerParam) {
      const lower = workerParam.trim().toLowerCase();
      if (lower === "unknown" || lower === "unknown user") {
        return JSON.parse(JSON.stringify(UNKNOWN_PORTFOLIO));
      }
      for (const key of Object.keys(SAMPLES)) {
        if (SAMPLES[key].name.toLowerCase().includes(lower)) {
          return JSON.parse(JSON.stringify(SAMPLES[key]));
        }
      }
      return {
        name: workerParam + " [Demo Record]",
        role: craftParam || "Household Specialist",
        uan: "UAN ****-****-4921",
        tenure: "1.0 Yr",
        households: 1,
        statusText: "Active Status: Employed in 1 Household",
        traits: { "Always On Time": { count: 1, iconName: "clock" } },
        boundaries: ["Access to clean water and soap to wash my hands", "Minimum 1 Agreed Weekly Rest Day"],
        references: []
      };
    }

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
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
  if (!unitStr) return "Complex Resident";
  const s = String(unitStr).trim();
  return s.replace(/(^|\s|,)\b\d{2,4}\b/g, "$1***").replace(/\b([A-Za-z0-9]+)-(\d{2,4})\b/g, "$1-***");
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

// Tab Navigation
const TABS = ["pass", "record", "terms", "directory", "profile"];
let currentTab = "pass";

function showTab(name) {
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

// Rendering
function renderPortfolio() {
  document.getElementById("pName").textContent = portfolio.name;
  document.getElementById("pRole").textContent = portfolio.role;
  document.getElementById("pUan").textContent = portfolio.uan;
  document.getElementById("metricTenure").textContent = portfolio.tenure;
  document.getElementById("metricHouseholds").textContent = portfolio.households;

  const isUnknown = portfolio.isUnknown || portfolio.name.startsWith("Unknown");
  const nameParts = (portfolio.name || "").replace(/\[.*?\]/, "").trim().split(/\s+/);
  const initials = isUnknown ? "?" : (nameParts.length >= 2 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : (portfolio.name || "SD").slice(0, 2).toUpperCase());
  
  const av = document.getElementById("pAvatar");
  if (av) av.textContent = initials;
  
  const passAv = document.getElementById("passHeroInitials");
  if (passAv) passAv.textContent = initials;

  const firstName = isUnknown ? "Worker" : (nameParts[0] || "Worker");
  document.title = `${portfolio.name} — Sovereign Work Portfolio | Maanyata`;

  const passTitle = document.getElementById("passCardTitle");
  if (passTitle) passTitle.textContent = `${firstName}'s Portable Trust Pass`;

  // Total Recognitions
  let total = 0;
  for (const t in portfolio.traits) {
    total += portfolio.traits[t].count || 0;
  }
  document.getElementById("metricRecognitions").textContent = total;
  document.getElementById("signalsTotal").textContent = currentLang === "hi" ? `${total} कुल` : `${total} Total`;

  // Traits Cluster with Lucide SVGs (Zero Emojis)
  const traitsBox = document.getElementById("traitsList");
  if (traitsBox) {
    traitsBox.innerHTML = "";
    for (const [name, info] of Object.entries(portfolio.traits)) {
      const el = document.createElement("div");
      el.className = "trait-badge";
      const svgIcon = ICONS[info.iconName] || ICONS.star;
      const traitDisplayName = (currentLang === "hi" && TRAIT_MAP_HI[name]) ? TRAIT_MAP_HI[name] : name;
      el.innerHTML = `<span>${svgIcon} ${escapeHTML(traitDisplayName)}</span><span class="trait-count">${escapeHTML(info.count)}</span>`;
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
      termsCountEl.textContent = currentLang === "hi" ? `${terms.length} नियम` : `${terms.length} Terms`;
    }
    terms.forEach(t => {
      const el = document.createElement("div");
      el.className = "trait-badge boundary-chip";
      const displayTxt = currentLang === "hi" ? translateBoundary(t, "hi") : t;
      el.innerHTML = `<span>${ICONS.check} ${escapeHTML(displayTxt)}</span>`;
      boundBox.appendChild(el);
    });
  }

  // Endorsements
  const refsBox = document.getElementById("referencesList");
  if (refsBox) {
    refsBox.innerHTML = "";
    const verifiedRefs = (portfolio.references || []).filter(r => r.certified !== false);
    const endCountEl = document.getElementById("endorsementsCount");
    if (endCountEl) {
      endCountEl.textContent = currentLang === "hi" ? `${verifiedRefs.length} सत्यापित` : `${verifiedRefs.length} Verified`;
    }

    portfolio.references.forEach(r => {
      const el = document.createElement("div");
      el.className = "reference-quote";
      const locationBadge = r.locationTag ? `<div class="location-badge ${r.locationVerified ? 'is-verified' : 'is-pending'}">${escapeHTML(r.locationTag)}</div>` : "";
      const tagTxt = currentLang === "hi" ? "✓ प्रमाणित ऑन-प्रिमाइस संदर्भ" : "✓ Certified On-Premises Attestation";
      const maskedAddress = maskUnitPrivacy(r.unit);

      el.innerHTML = `
        <div class="quote-text">"${escapeHTML(r.quote)}"</div>
        <div class="quote-author">
          <span>${escapeHTML(r.author)} • ${escapeHTML(maskedAddress)}</span>
          <span class="quote-tenure">${escapeHTML(r.tenure)}</span>
        </div>
        ${locationBadge}
        <div class="verify-row"><span class="verify-tag">${tagTxt}</span></div>
      `;
      refsBox.appendChild(el);
    });
  }

  const fpEl = document.getElementById("passFingerprint");
  if (fpEl) fpEl.textContent = getSovereignFingerprint();

  renderOfflineQR();
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
  const size = 140;
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);

  const payload = `https://project-maanyata.pages.dev/portfolio.html?id=${encodeURIComponent(portfolio.id || "demo-sunita-01")}`;

  try {
    if (typeof QRCodeModel !== "undefined") {
      const qr = new QRCodeModel(0, QRErrorCorrectLevel.M);
      qr.addData(payload);
      qr.make();
      const count = qr.getModuleCount();
      const pad = 2;
      const cell = size / (count + pad * 2);

      ctx.fillStyle = "#1C1917";
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (qr.isDark(r, c)) {
            ctx.fillRect(Math.round((c + pad) * cell), Math.round((r + pad) * cell), Math.ceil(cell), Math.ceil(cell));
          }
        }
      }
    }
  } catch (err) {
    console.error("QR Code Generation Error:", err);
  }
}

async function hydrateFromEdge() {
  const params = new URLSearchParams(window.location.search);
  const workerId = params.get("id");
  if (!workerId || workerId === "unknown") return;

  try {
    const res = await fetch(`/api/worker/${encodeURIComponent(workerId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.worker) {
        portfolio = data.worker;
        savePortfolio();
        renderPortfolio();
      }
    }
  } catch (e) {
    console.warn("Edge sync notice:", e.message);
  }
}

// Theme & Language
let currentTheme = localStorage.getItem("mny_theme") || "daylight";
let currentLang = localStorage.getItem("mny_lang") || "en";

function initThemeAndLang() {
  if (currentTheme === "sol") {
    document.documentElement.setAttribute("data-theme", "sol");
    updateSolBtn(true);
  }
  applyLanguage(currentLang);
}

function toggleSolMode() {
  const isSol = document.documentElement.getAttribute("data-theme") === "sol";
  if (isSol) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("mny_theme", "daylight");
    updateSolBtn(false);
    showToast("Bright-sun mode off");
  } else {
    document.documentElement.setAttribute("data-theme", "sol");
    localStorage.setItem("mny_theme", "sol");
    updateSolBtn(true);
    showToast("Bright-sun mode on");
  }
}

function updateSolBtn(isSol) {
  const lbl = document.getElementById("solBtnLabel");
  const btn = document.getElementById("btnSolToggle");
  if (lbl) lbl.textContent = isSol ? "Turn off" : "Turn on";
  if (btn) btn.setAttribute("aria-pressed", isSol ? "true" : "false");
}

function resetLocalDemo() {
  if (!confirm("Reset demo data on this device?")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.href = "portfolio.html?sample=sunita_devi";
}

const TRAIT_MAP_HI = {
  "Always On Time": "हमेशा समय पर",
  "Exceptional Cooking": "उत्कृष्ट पाक कला",
  "Trusted With House Keys": "घर की चाबियों पर विश्वास",
  "Went Above & Beyond": "अपेक्षित से श्रेष्ठ कार्य"
};

const BOUNDARY_MAP_HI = {
  "Minimum 1 Agreed Weekly Rest Day": "सप्ताह में कम से कम 1 तय साप्ताहिक विश्राम",
  "Direct Resident UPI on 1st of Month": "महीने की 1 तारीख को सीधा UPI भुगतान",
  "Zero toxic acid chemicals for cleaning": "सफाई में हानिकारक तेजाब का शून्य उपयोग",
  "Access to clean water and soap to wash my hands": "हाथ धोने के लिए स्वच्छ पानी और साबुन",
  "Extreme Weather Late-Arrival Relief": "भीषण मौसम में देर से आगमन पर राहत"
};

function translateBoundary(b, lang) {
  if (lang !== "hi" || !b) return b;
  for (const [enKey, hiVal] of Object.entries(BOUNDARY_MAP_HI)) {
    if (b.toLowerCase().includes(enKey.toLowerCase())) return hiVal;
  }
  return b;
}

const AVAILABLE_BOUNDARIES = [
  { id: "b1", en: "Minimum 1 Agreed Weekly Rest Day", hi: "सप्ताह में कम से कम 1 तय साप्ताहिक विश्राम", iconName: "calendar" },
  { id: "b2", en: "Direct Resident UPI on 1st of Month", hi: "महीने की 1 तारीख को सीधा UPI भुगतान", iconName: "card" },
  { id: "b3", en: "Zero toxic acid chemicals for cleaning", hi: "सफाई में हानिकारक तेजाब का शून्य उपयोग", iconName: "shieldAlert" },
  { id: "b4", en: "Access to clean water and soap to wash my hands", hi: "हाथ धोने के लिए स्वच्छ पानी और साबुन", iconName: "sparkles" },
  { id: "b5", en: "Extreme Weather Late-Arrival Relief", hi: "भीषण मौसम में देर से आगमन पर राहत", iconName: "shieldAlert" }
];

const I18N = {
  en: {
    brand: "Maanyata",
    lblTenure: "Tenure",
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
    btnVerifyGate: "Verify Pass",
    modalTitle: "Dignity Charter & Working Terms",
    lblBoundaries: "Select Your Non-Negotiable Working Terms",
    btnSaveProfile: "Save Working Terms",
    btnCancel: "Cancel",
    navDirectory: "Directory"
  },
  hi: {
    brand: "मान्यता",
    lblTenure: "कार्यकाल",
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
    btnVerifyGate: "पास सत्यापित करें",
    modalTitle: "गरिमा चार्टर एवं कार्य नियम",
    lblBoundaries: "अपने गैर-परक्राम्य कार्य नियम चुनें",
    btnSaveProfile: "कार्य नियम सहेजें",
    btnCancel: "रद्द करें",
    navDirectory: "निर्देशिका"
  }
};

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("mny_lang", lang);
  document.documentElement.setAttribute("lang", lang);

  const dict = I18N[lang] || I18N.en;
  const brandTitle = document.getElementById("brandTitle");
  if (brandTitle) brandTitle.textContent = dict.brand;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  renderPortfolio();
}

function sharePassbookWhatsApp() {
  const workerName = portfolio.name || "Sunita Devi";
  const workerRole = portfolio.role || "Senior Household Specialist";
  const tenure = portfolio.tenure || "8.5 Yrs";
  const url = window.location.href.split("#")[0];
  const msg = `Namaste, I am sharing my verified frontline work passbook on Project Maanyata:\n\n*${workerName}*\n${workerRole}\nSeniority: ${tenure} (Verified by local residents)\n\nView my authenticated passbook here:\n${url}`;
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
      const isChecked = activeTerms.some(t => t.toLowerCase().includes(b.en.toLowerCase().slice(0, 15)));
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
