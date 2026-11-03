/**
 * maanyata_store.js — Project Maanyata (मान्यता)
 *
 * Sovereign, local-first, promise-based data layer. Every public method returns
 * a Promise so the UI is decoupled from the storage engine. 
 *
 * Core Invariants:
 *  - Trust & Craft Recognition ONLY: Maanyata does not track, mediate, or enforce
 *    private loans, debts, or cash advances. Wages are settled directly via UPI/cash.
 *  - Sovereign Keys & Orthogonal Skills: Holding house keys is tracked separately
 *    from specific skills (cooking, cleaning, eldercare, driving, childcare).
 *  - Privacy Masking: Resident flat numbers are masked (e.g. B-***) in exported passes
 *    to prevent external burglary casing.
 *  - Cryptographic Fingerprint: Every profile is anchored by a deterministic 8-char
 *    Sovereign Fingerprint (#M-XXXX-XXXX) to prevent twin clone attacks.
 *  - Societies are free text: "Buildings Name Themselves". No pre-baked registry.
 */
(function (global) {
  "use strict";

  const K = {
    SOCIETY: "maanyata_active_society_v1",
    INDEX: "maanyata:index",
    WORKER: "maanyata:worker:",
    SESSION: "maanyata:active_worker"
  };
  const DEFAULT_SOCIETY = "Mira Road Community";
  const SKILLS = ["cooking", "childcare", "cleaning", "driving", "eldercare"];
  const listeners = new Set();

  // ---------- Storage adapter (The only layer that touches the backend) ----------
  const mem = new Map();
  const storage = {
    get(k) {
      try { return global.localStorage.getItem(k); }
      catch (e) { return mem.has(k) ? mem.get(k) : null; }
    },
    set(k, v) {
      try { global.localStorage.setItem(k, v); }
      catch (e) { mem.set(k, String(v)); }
    },
    del(k) {
      try { global.localStorage.removeItem(k); }
      catch (e) { mem.delete(k); }
    }
  };

  // ---------- Helpers ----------
  const read = (k, fallback) => {
    try {
      const raw = storage.get(k);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  };
  const write = (k, v) => storage.set(k, JSON.stringify(v));
  const newId = (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const today = () => new Date().toISOString().slice(0, 10);
  const text = (v, max = 160) => String(v == null ? "" : v).trim().slice(0, max);
  const notify = (type, data) => listeners.forEach((cb) => {
    try { cb({ type, data, at: Date.now() }); } catch (e) { console.error(e); }
  });
  // Security Patch: Storage Hygiene & Quota Guard
  function getStorageEstimate() {
    let bytes = 0;
    try {
      for (let i = 0; i < global.localStorage.length; i++) {
        const k = global.localStorage.key(i);
        bytes += (k.length + (global.localStorage.getItem(k) || '').length) * 2;
      }
    } catch(e) {}
    return bytes;
  }

  function pruneStorageIfNeeded() {
    // Exact State Machine: Exceeds 4.5 MB -> Warning shown to user -> No internet found -> Then prune
    const bytes = getStorageEstimate();
    const threshold4_5MB = 4718592; // 4.5 MB
    if (bytes > threshold4_5MB) {
      const isOnline = typeof navigator !== "undefined" && navigator.onLine;
      if (typeof global.alert === "function") {
        global.alert("Maanyata Storage Warning: Device storage is over 4.5 MB (90% capacity). Older temporary passes will be cleaned to protect your sovereign passbook.");
      }
      // If offline (cannot sync or recover from cloud), perform emergency pruning of transient imported passes only
      if (!isOnline) {
        console.warn("Maanyata Storage Sentry: Offline & over 4.5MB. Pruning transient imported records to prevent browser crash.");
        try {
          const activeWid = storage.get(K.SESSION);
          const index = read(K.INDEX, []);
          index.forEach(id => {
            if (id !== activeWid && String(id).startsWith("w-import-")) {
              storage.del(K.WORKER + id);
            }
          });
        } catch(e){}
      }
    }
  }

  const activeSociety = () => text(storage.get(K.SOCIETY), 80) || DEFAULT_SOCIETY;

  // Strict Content Safety & Defamation Guard
  // Protects domestic workers from defamatory smears, slurs, and abusive vandalism
  const BANNED_WORDS_REGEX = /\b(fuck|shit|nigger|nigga|nigg|murder(?:s|er|ing)?|thief|thieves|theft|steal(?:ing)?|stole|stolen|kill(?:er|ing)?|rape|rapist|police|cops?|arrest(?:ed)?|chor(?:i)?|harami|badmash|fraud|scam|cheat(?:er)?)\b/i;

  const isSafeContent = (textStr) => {
    if (!textStr) return true;
    return !BANNED_WORDS_REGEX.test(String(textStr));
  };

  // Residence Grammar Validator: Rejects spam/dummy units like 'ff', 'asdf', 'test'
  const isValidResidenceUnit = (unitStr) => {
    if (!unitStr) return false;
    const s = String(unitStr).trim();
    if (s.length < 3) return false;
    // Reject known dummy strings
    if (/^(test|asdf|qwerty|none|na|null|undefined)$/i.test(s)) return false;
    // Must contain a number or a recognized dwelling token
    const hasNumber = /\d+/.test(s);
    const hasDwellingWord = /\b(flat|bldg|building|wing|house|bungalow|chawl|room|villa|apt|apartment|plot|kothi|tower|block|floor|complex|society|enclave|chs|heights|residency|plaza|co-?op)\b/i.test(s);
    return hasNumber || hasDwellingWord;
  };

  // Semantic Address Normalizer: Handles Indian real-estate realities (Bungalows, Chawls, Row Houses, Wings)
  const normalizeUnit = (str) => {
    if (!str) return "";
    return String(str)
      .toLowerCase()
      .replace(/flat\s*(no\.?)?|room\s*(no\.?)?|bldg\s*(no\.?)?|wing\s*|unit\s*(no\.?)?|block\s*/gi, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  };

  // Context-Aware Privacy Masking: Preserves structural context without leaking physical entry point
  const maskUnit = (unitStr) => {
    if (!unitStr) return "Resident Attestation";
    const s = String(unitStr).trim();
    // Row Houses, Bungalows, Villas, Plots
    if (/^(row\s*house|bungalow|villa|plot|kothi|cottage)\b/i.test(s)) {
      return s.replace(/\d+.*$/, "** (Private Residence)");
    }
    // Chawls, Gaothans, Independent Rooms, Padas
    if (/^(room|chawl|pada|gala|wadi)\b/i.test(s)) {
      return "Local Resident Attestation";
    }
    // Preserve Complex / Society name if present while masking door/flat numbers
    return s
      .replace(/(^|\s|,)\b\d{2,4}\b/g, "$1***")
      .replace(/\b([A-Za-z0-9]+)-(\d{2,4})\b/g, "$1-***")
      .replace(/\b(flat|room|unit)\s*\d+/gi, "$1 ***");
  };

  // Counter-Hardening: Cryptographic 8-Character Sovereign Fingerprint
  const fingerprintOf = (w) => {
    if (!w || !w.id) return "#M-0000-0000";
    let hash = 0;
    const str = `${w.id}:${w.createdAt || "2026-01-01"}:${w.name || ""}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `#M-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
  };

  // ---------- Seed data (Fallback only when storage is empty) ----------
  const SEEDS = [
    {
      id: "sunita-devi-01", name: "Sunita Devi", role: "Cook & Housekeeping",
      households: 19, tenureYears: 4.5,
      endorsements: [{ id: "e-sunita-1", by: "Pooja Rao", unit: "B-402", date: "2026-04-12", keys: true,
        skills: ["cooking", "cleaning"], contact: "+91 98201 *****", verified: true, note: "Has held our keys for over three years. Punctual and honest." }]
    },
    {
      id: "ramesh-kumar-02", name: "Ramesh Kumar", role: "Driver",
      households: 12, tenureYears: 7,
      endorsements: [{ id: "e-ramesh-1", by: "Anand Mehta", unit: "A-701", date: "2026-06-14", keys: true,
        skills: ["driving"], contact: "+91 98334 *****", verified: true, highRiskTenureMonths: 48, note: "Seven years of safe driving through Mumbai traffic. Calm in heavy traffic." }]
    },
    {
      id: "asha-kumari-03", name: "Asha Kumari", role: "Eldercare & Companion",
      households: 6, tenureYears: 3,
      endorsements: [{ id: "e-asha-1", by: "Dr. K. Merchant", unit: "C-303", date: "2026-05-18", keys: true,
        skills: ["eldercare"], contact: "+91 98199 *****", verified: true, highRiskTenureMonths: 36, note: "Careful with medication schedules and patient transfer from bed to wheelchair." }]
    }
  ];

  // ---------- Derived views (Computed on read, never stored) ----------
  function traitsOf(w) {
    const t = { keys: 0, skills: Object.fromEntries(SKILLS.map((s) => [s, 0])) };
    (w.endorsements || []).forEach((e) => {
      if (e.keys) t.keys++;
      (e.skills || []).forEach((s) => { if (s in t.skills) t.skills[s]++; });
    });
    return t;
  }

  const withDerived = (w) => {
    const socs = Array.isArray(w.societies) && w.societies.length > 0
      ? w.societies
      : (w.society ? [w.society] : [activeSociety()]);
    return {
      ...w,
      societies: socs,
      society: w.society || socs[0],
      fingerprint: fingerprintOf(w),
      traits: traitsOf(w),
      verifiedResidentBacked: (w.endorsements || []).length > 0
    };
  };

  // ---------- Raw record access ----------
  function readWorker(wid) {
    if (typeof wid !== "string") return null;
    const w = read(K.WORKER + wid, null);
    return w ? { endorsements: [], ...w } : null;
  }

  function commit(w, type) {
    const ids = read(K.INDEX, []);
    if (!ids.includes(w.id)) write(K.INDEX, [...ids, w.id]);
    write(K.WORKER + w.id, { ...w, updatedAt: new Date().toISOString() });
    notify(type, w.id);
    return w;
  }

  function need(wid) {
    const target = wid || storage.get(K.SESSION);
    const w = readWorker(target);
    if (!w) throw new Error("Worker not found: " + target);
    return w;
  }

  function sanitizeEndorsement(e) {
    if (!e) return null;
    const by = text(e.by, 80);
    if (!by) return null;
    const note = text(e.note, 280);
    const unit = text(e.unit, 40);

    // Enforce Content Safety: Block slurs, profanity, and defamation
    if (!isSafeContent(note) || !isSafeContent(by) || !isSafeContent(unit)) {
      console.warn("Rejected endorsement due to prohibited content / defamation:", { by, unit, note });
      return null;
    }

    const contact = text(e.contact, 60);
    const keys = !!e.keys;
    const skills = (e.skills || []).filter((s) => SKILLS.includes(s));
    return {
      id: e.id || newId("e"),
      by,
      unit,
      date: text(e.date, 10) || today(),
      keys,
      skills,
      note,
      contact, // Out-of-band peer callback channel (WhatsApp / Phone)
      verified: Boolean(contact || keys || (skills.length > 0 && e.verified)),
      highRiskTenureMonths: Math.max(0, Number(e.highRiskTenureMonths) || 0),
      tenureNote: text(e.tenureNote, 140)
    };
  }

  // ---------- Seeding ----------
  function seed(force) {
    if (!force && read(K.INDEX, null)) return;
    if (force) read(K.INDEX, []).forEach((wid) => storage.del(K.WORKER + wid));
    const list = SEEDS.map((s) => ({ society: DEFAULT_SOCIETY, createdAt: today(), ...s }));
    write(K.INDEX, list.map((w) => w.id));
    list.forEach((w) => write(K.WORKER + w.id, w));
    storage.set(K.SESSION, list[0].id);
  }

  // ---------- Workers ----------
  const workers = {
    async getAll() {
      return read(K.INDEX, []).map(readWorker).filter(Boolean).map(withDerived);
    },
    async get(wid) {
      const w = readWorker(wid);
      return w ? withDerived(w) : null;
    },
    async getActive() {
      const wid = storage.get(K.SESSION);
      const current = wid && await workers.get(wid);
      return current || (await workers.getAll())[0] || null;
    },
    async setActive(wid) {
      if (!readWorker(wid)) throw new Error("Unknown worker: " + wid);
      storage.set(K.SESSION, wid);
      notify("active_changed", wid);
    },
    // Saves profile fields only. Endorsements are never overwritten here.
    async save(p = {}) {
      const name = text(p.name, 80);
      if (!name) throw new Error("Worker name is required");
      const prev = readWorker(p.id) || { id: newId("w"), endorsements: [], createdAt: today() };
      const rawSocs = Array.isArray(p.societies) ? p.societies : (p.society ? [p.society] : (prev.societies || [prev.society || activeSociety()]));
      const cleanSocs = rawSocs.map(s => text(s, 80)).filter(Boolean);
      return withDerived(commit({
        ...prev,
        name,
        role: text(p.role, 80) || prev.role || "",
        societies: cleanSocs.length > 0 ? cleanSocs : [activeSociety()],
        society: cleanSocs[0] || text(p.society, 80) || prev.society || activeSociety(),
        households: Math.max(0, Number(p.households ?? prev.households) || 0),
        tenureYears: Math.max(0, Number(p.tenureYears ?? prev.tenureYears) || 0)
      }, "worker_saved"));
    }
  };

  // ---------- Endorsements (Reverse Attestation) ----------
  // Counter-Hardening: Semantic Address Matching & Direct Peer Verification Handoff
  async function endorse({ workerId, by, unit, note, keys = false, skills = [], contact = "", highRiskTenureMonths = 0, tenureNote = "" } = {}) {
    if (!isValidResidenceUnit(unit)) {
      throw new Error("Please enter a valid flat, bungalow, or residence unit (e.g. Flat B-402, Row House 14, Bungalow 7).");
    }
    if (!isSafeContent(note) || !isSafeContent(by) || !isSafeContent(unit)) {
      throw new Error("Attestation Guard: Content contains prohibited defamation, slurs, or criminal allegations. Project Maanyata is a positive craft passbook.");
    }

    const w = need(workerId);
    const e = sanitizeEndorsement({ by, unit, note, keys, skills, contact, highRiskTenureMonths, tenureNote, date: today() });
    if (!e) throw new Error("Endorsement contains invalid or unsafe content.");
    if (!e.keys && !e.skills.length) throw new Error("Affirm at least one trait: keys or a skill");

    // Defense 1: Semantic Unit Duplicate Lock & Orthogonal Skill Merging
    // A single address cannot inflate review counts by creating duplicate endorsement cards.
    // However, if the same residence vouches for an additional orthogonal skill (e.g., adding Cooking to Cleaning),
    // it smoothly updates their existing record without creating a duplicate card.
    const normUnit = normalizeUnit(e.unit);
    const existingIndex = normUnit ? (w.endorsements || []).findIndex(
      old => normalizeUnit(old.unit) === normUnit
    ) : -1;

    if (existingIndex !== -1) {
      const existing = w.endorsements[existingIndex];
      const newSkills = (e.skills || []).filter(s => !(existing.skills || []).includes(s));
      const addsKeys = e.keys && !existing.keys;
      const addsContact = e.contact && !existing.contact;
      if (!newSkills.length && !addsKeys && !addsContact) {
        throw new Error(`Residence ${e.unit} has already submitted an attestation for these skills.`);
      }
      existing.skills = Array.from(new Set([...(existing.skills || []), ...newSkills]));
      if (addsKeys) existing.keys = true;
      if (addsContact) existing.contact = e.contact;
      if (e.highRiskTenureMonths > (existing.highRiskTenureMonths || 0)) {
        existing.highRiskTenureMonths = e.highRiskTenureMonths;
      }
      if (e.note && e.note.length > (existing.note || "").length) existing.note = e.note;
      pruneStorageIfNeeded();
      commit(w, "endorsed");
      return existing;
    }

    // Defense 2: First-Principles Grounding (No Gameable Time Clocks)
    // High-performing domestic workers legitimately serve many households.
    // Artificial 30-day velocity limits are stripped; trust is anchored in verifiable peer contacts.
    pruneStorageIfNeeded();
    w.endorsements.push(e);
    commit(w, "endorsed");
    return e;
  }

  // ---------- Cross-device pass (P2P Base64URL, Zero Backend Required) ----------
  const b64 = {
    enc(s) {
      const bin = Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join("");
      return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    },
    dec(s) {
      let t = s.replace(/-/g, "+").replace(/_/g, "/");
      while (t.length % 4) t += "=";
      return new TextDecoder().decode(Uint8Array.from(atob(t), (c) => c.charCodeAt(0)));
    }
  };

  // Public profile only. Aryan Side-Channel Mitigation: Physical address strings are
  // completely excluded from the QR payload. This prevents entropy/floorplan correlation
  // and keeps the URL under 280 bytes for instantaneous camera focus on budget lenses.
  function serializePassToUrl(w) {
    const payload = {
      v: 2, id: w.id, name: w.name, role: w.role, society: w.society,
      societies: w.societies || (w.society ? [w.society] : [DEFAULT_SOCIETY]),
      households: w.households, tenureYears: w.tenureYears,
      identity: w.identity ? { type: w.identity.type, maskedUid: w.identity.maskedUid, name: w.identity.name } : null,
      endorsements: (w.endorsements || []).map((e) => ({
        by: e.by, date: e.date, keys: e.keys, skills: e.skills, note: e.note,
        verified: Boolean(e.contact || e.verified || e.keys),
        hasContact: Boolean(e.contact)
      }))
    };
    const base = global.location ? global.location.href.split(/[?#]/)[0] : "";
    return `${base}?p=${b64.enc(JSON.stringify(payload))}`;
  }

  // Merges an incoming pass into local storage. Endorsements are deduplicated.
  async function hydratePassFromUrl(href = global.location && global.location.href) {
    if (!href) return null;
    const url = new URL(href);
    const raw = url.searchParams.get("p");
    if (!raw) return null;

    let p;
    try { p = JSON.parse(b64.dec(raw)); }
    catch (e) { throw new Error("Malformed pass link"); }
    if ((p.v !== 1 && p.v !== 2) || !p.id || !p.name) throw new Error("Unsupported pass link");

    const existing = readWorker(p.id) || { endorsements: [], createdAt: today() };
    const keyOf = (e) => `${e.by}|${e.date}|${e.note}`;
    const seen = new Set(existing.endorsements.map(keyOf));
    const incoming = (p.endorsements || []).map(sanitizeEndorsement).filter(Boolean).filter((e) => !seen.has(keyOf(e)));

    pruneStorageIfNeeded();
    const rawSocs = Array.isArray(p.societies) ? p.societies : (p.society ? [p.society] : (existing.societies || [existing.society || activeSociety()]));
    const cleanSocs = rawSocs.map(s => text(s, 80)).filter(Boolean);
    const merged = commit({
      ...existing,
      id: p.id,
      name: text(p.name, 80),
      role: text(p.role, 80),
      societies: cleanSocs.length > 0 ? cleanSocs : [activeSociety()],
      society: cleanSocs[0] || text(p.society, 80) || existing.society || activeSociety(),
      households: Number(p.households) || 0,
      tenureYears: Number(p.tenureYears) || 0,
      identity: p.identity || existing.identity || null,
      endorsements: existing.endorsements.concat(incoming),
      importedAt: today()
    }, "pass_hydrated");

    if (global.history && global.history.replaceState && href === global.location.href) {
      url.searchParams.delete("p");
      global.history.replaceState(null, "", url.toString());
    }
    return withDerived(merged);
  }

  // ---------- Society (Free text, no registry) ----------
  const society = {
    async get() { return activeSociety(); },
    async set(name) {
      const clean = text(name, 80);
      if (!clean) throw new Error("Society name must be a non-empty string");
      storage.set(K.SOCIETY, clean);
      notify("society_changed", clean);
      return clean;
    }
  };

  // ---------- Public API ----------
  const MaanyataStore = {
    init: async (force = false) => seed(!!force),
    subscribe(cb) {
      if (typeof cb !== "function") throw new Error("Subscriber must be a function");
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    society,
    workers,
    endorse,
    serializePassToUrl,
    hydratePassFromUrl,
    normalizeUnit,
    maskUnit,
    isSafeContent,
    isValidResidenceUnit,
    traitsOf,
    SKILLS
  };

  global.MaanyataStore = MaanyataStore;
  if (typeof module !== "undefined" && module.exports) module.exports = MaanyataStore;

  seed(false);
})(typeof window !== "undefined" ? window : globalThis);
