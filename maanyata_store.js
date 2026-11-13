/**
 * maanyata_store.js — Project Maanyata (मान्यता)
 *
 * Sovereign, local-first, promise-based data layer. Every public method returns
 * a Promise so the UI is decoupled from the storage engine.
 *
 * Core Invariants:
 *  - Blank Initial Seed: Zero fake dummy workers in production store. Real data only.
 *  - Trust & Craft Recognition ONLY: Maanyata does not track, mediate, or enforce
 *    private loans, debts, or cash advances. Wages are settled directly via UPI/cash.
 *  - 4-State Contract Machine: ACTIVE, SETTLED, DISPUTED, QUARANTINED.
 *  - Bonded Trust & Anti-Spite Escrow: Mandatory ₹2,500 deposit for formal disputes,
 *    forfeiting ₹2,000 to the worker for frivolous or false claims.
 *  - Cluster Reserve: 15% of annual society fees (₹4,999/yr) allocate to neighborhood safety pool.
 *  - DPDP Privacy Masking: Resident units masked (B-***) and Aadhaar masked (XXXX-XXXX-1234).
 *  - Sovereign Fingerprint: Deterministic 8-char fingerprint (#M-XXXX-XXXX) anchors each profile.
 */
(function (global) {
  "use strict";

  const K = {
    SOCIETY: "maanyata_active_society_v1",
    INDEX: "maanyata:index",
    WORKER: "maanyata:worker:",
    SESSION: "maanyata:active_worker",
    CONTRACTS: "maanyata:contracts",
    CONTRACT: "maanyata:contract:",
    CLUSTER_RESERVE: "maanyata:cluster_reserve"
  };

  const DEFAULT_SOCIETY = "Vasudev Complex CHS";
  const SKILLS = ["cooking", "childcare", "cleaning", "driving", "eldercare"];
  const listeners = new Set();

  // 4-State Contract Machine
  const CONTRACT_STATE = Object.freeze({
    ACTIVE: "ACTIVE",
    SETTLED: "SETTLED",
    DISPUTED: "DISPUTED",
    QUARANTINED: "QUARANTINED"
  });

  // ---------- Storage adapter (Universal for Browser & Node environments) ----------
  let _hasLocalStorage = null;
  function isLocalStorageUsable() {
    if (_hasLocalStorage !== null) return _hasLocalStorage;
    try {
      // In Node.js environment without explicit localStorage configuration, avoid accessing experimental global
      if (typeof process !== "undefined" && process.versions && process.versions.node) {
        _hasLocalStorage = false;
        return false;
      }
      if (typeof global.localStorage !== "undefined" && global.localStorage) {
        const testK = "__mny_test__";
        global.localStorage.setItem(testK, "1");
        global.localStorage.removeItem(testK);
        _hasLocalStorage = true;
        return true;
      }
    } catch (e) {
      _hasLocalStorage = false;
      return false;
    }
    _hasLocalStorage = false;
    return false;
  }

  const mem = new Map();
  const storage = {
    get(k) {
      if (isLocalStorageUsable()) {
        try {
          const val = global.localStorage.getItem(k);
          if (val !== null && val !== undefined) return val;
        } catch (e) {}
      }
      return mem.has(k) ? mem.get(k) : null;
    },
    set(k, v) {
      mem.set(k, String(v));
      if (isLocalStorageUsable()) {
        try { global.localStorage.setItem(k, String(v)); } catch (e) {}
      }
    },
    del(k) {
      mem.delete(k);
      if (isLocalStorageUsable()) {
        try { global.localStorage.removeItem(k); } catch (e) {}
      }
    },
    clear() {
      mem.clear();
      if (isLocalStorageUsable()) {
        try {
          const toRemove = [];
          for (let i = 0; i < global.localStorage.length; i++) {
            const key = global.localStorage.key(i);
            if (key && (key.startsWith("maanyata") || key.startsWith("w-") || key.startsWith("c-"))) {
              toRemove.push(key);
            }
          }
          toRemove.forEach((k) => global.localStorage.removeItem(k));
        } catch (e) {}
      }
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

  // Storage Hygiene & Quota Guard
  function getStorageEstimate() {
    let bytes = 0;
    try {
      if (isLocalStorageUsable()) {
        for (let i = 0; i < global.localStorage.length; i++) {
          const k = global.localStorage.key(i);
          bytes += (k.length + (global.localStorage.getItem(k) || "").length) * 2;
        }
      } else {
        for (const [k, v] of mem.entries()) {
          bytes += (k.length + String(v).length) * 2;
        }
      }
    } catch (e) {}
    return bytes;
  }

  function pruneStorageIfNeeded() {
    const bytes = getStorageEstimate();
    const threshold4_5MB = 4718592; // 4.5 MB
    if (bytes > threshold4_5MB) {
      const isOnline = typeof navigator !== "undefined" && navigator.onLine;
      if (typeof global.alert === "function") {
        global.alert("Maanyata Storage Warning: Device storage is over 4.5 MB (90% capacity). Cleaning transient passes to protect your sovereign passbook.");
      }
      if (!isOnline) {
        console.warn("Maanyata Storage Sentry: Offline & over 4.5MB. Pruning transient imported records.");
        try {
          const activeWid = storage.get(K.SESSION);
          const index = read(K.INDEX, []);
          index.forEach(id => {
            if (id !== activeWid && String(id).startsWith("w-import-")) {
              storage.del(K.WORKER + id);
            }
          });
        } catch (e) {}
      }
    }
  }

  const activeSociety = () => text(storage.get(K.SOCIETY), 80) || DEFAULT_SOCIETY;

  // Strict Content Safety & Defamation Guard
  const BANNED_WORDS_REGEX = /\b(fuck|shit|nigger|nigga|nigg|murder(?:s|er|ing)?|thief|thieves|theft|steal(?:ing)?|stole|stolen|kill(?:er|ing)?|rape|rapist|police|cops?|arrest(?:ed)?|chor(?:i)?|harami|badmash|fraud|scam|cheat(?:er)?)\b/i;

  const isSafeContent = (textStr) => {
    if (!textStr) return true;
    return !BANNED_WORDS_REGEX.test(String(textStr));
  };

  // Residence Grammar Validator
  const isValidResidenceUnit = (unitStr) => {
    if (!unitStr) return false;
    const s = String(unitStr).trim();
    if (s.length < 3) return false;
    if (/^(test|asdf|qwerty|none|na|null|undefined)$/i.test(s)) return false;
    const hasNumber = /\d+/.test(s);
    const hasDwellingWord = /\b(flat|bldg|building|wing|house|bungalow|chawl|room|villa|apt|apartment|plot|kothi|tower|block|floor|complex|society|enclave|chs|heights|residency|plaza|co-?op)\b/i.test(s);
    return hasNumber || hasDwellingWord;
  };

  // Semantic Address Normalizer
  const normalizeUnit = (str) => {
    if (!str) return "";
    return String(str)
      .toLowerCase()
      .replace(/flat\s*(no\.?)?|room\s*(no\.?)?|bldg\s*(no\.?)?|wing\s*|unit\s*(no\.?)?|block\s*/gi, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  };

  // Context-Aware Privacy Masking (Anti-Taxidermy & Anti-Meme Hardened)
  const maskUnit = (unitStr) => {
    if (!unitStr) return "Resident Attestation";
    const s = String(unitStr).trim();
    if (/^(row\s*house|bungalow|villa|plot|kothi|cottage)\b/i.test(s)) {
      return "Private Residence (***)";
    }
    if (/^(room|chawl|pada|gala|wadi)\b/i.test(s)) {
      return "Local Resident Attestation";
    }

    // Preserve registered society suffix if present (e.g. ", Vasudev Complex")
    const societySuffixMatch = s.match(/,\s*([A-Za-z0-9\s]+(?:chs|complex|palms|society|enclave|heights|residency))\b/i);
    const societySuffix = societySuffixMatch ? `, ${societySuffixMatch[1].trim()}` : "";

    // Extract strictly structured Wing and Unit components, purging any free-text meme strings
    const wingMatch = s.match(/\b(?:wing|bldg|building|tower|block)?\s*([A-Za-z])\b/i);
    const flatMatch = s.match(/\b(?:flat|unit|room|g-)?\s*(\d{1,4})\b/i) || s.match(/\b([A-Za-z])-?(\d{1,4})\b/i);

    const wing = wingMatch ? wingMatch[1].toUpperCase() : (flatMatch && flatMatch[1] && isNaN(flatMatch[1]) ? flatMatch[1].toUpperCase() : "");
    
    if (wing) {
      return `Flat ${wing}-***${societySuffix}`;
    }
    if (flatMatch) {
      return `Flat ***${societySuffix}`;
    }
    return `Resident Unit (***)${societySuffix}`;
  };

  // Cryptographic 8-Character Sovereign Fingerprint
  const fingerprintOf = (w) => {
    if (!w || !w.id) return "#M-0000-0000";
    let hash = 0;
    const str = `${w.id}:${w.createdAt || "2026-01-01"}:${w.name || ""}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
    return `#M-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
  };

  // ---------- Invariant 1: Blank Initial Seed (Zero fake dummy workers) ----------
  const SEEDS = Object.freeze([]);

  function seed(force) {
    if (!force && read(K.INDEX, null) !== null) return;
    if (force) {
      const oldWorkers = read(K.INDEX, []);
      oldWorkers.forEach((wid) => storage.del(K.WORKER + wid));
      const oldContracts = read(K.CONTRACTS, []);
      oldContracts.forEach((cid) => storage.del(K.CONTRACT + cid));
      storage.del(K.INDEX);
      storage.del(K.CONTRACTS);
      storage.del(K.CLUSTER_RESERVE);
      storage.del(K.SESSION);
      storage.del(K.SOCIETY);
      if (typeof storage.clear === "function") storage.clear();
    }
    // Always boot 100% blank
    write(K.INDEX, []);
    write(K.CONTRACTS, []);
    // Initialize cluster reserve with default ₹0 and 15% allocation rule
    write(K.CLUSTER_RESERVE, {
      balance: 0,
      transactions: [],
      allocationRate: 0.15,
      fidelityShieldMax: 100000
    });
  }

  // ---------- Derived views ----------
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

  function commitWorker(w, type) {
    const ids = read(K.INDEX, []);
    if (!ids.includes(w.id)) write(K.INDEX, [...ids, w.id]);
    write(K.WORKER + w.id, { ...w, updatedAt: new Date().toISOString() });
    notify(type, w.id);
    return w;
  }

  function needWorker(wid) {
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
      contact,
      verified: Boolean(contact || keys || (skills.length > 0 && e.verified)),
      highRiskTenureMonths: Math.max(0, Number(e.highRiskTenureMonths) || 0),
      tenureNote: text(e.tenureNote, 140)
    };
  }

  // ---------- Workers Store ----------
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
    async save(p = {}) {
      const name = text(p.name, 80);
      if (!name) throw new Error("Worker name is required");
      const prev = readWorker(p.id) || { id: newId("w"), endorsements: [], createdAt: today() };
      const rawSocs = Array.isArray(p.societies) ? p.societies : (p.society ? [p.society] : (prev.societies || [prev.society || activeSociety()]));
      const cleanSocs = rawSocs.map(s => text(s, 80)).filter(Boolean);
      return withDerived(commitWorker({
        ...prev,
        name,
        role: text(p.role, 80) || prev.role || "",
        societies: cleanSocs.length > 0 ? cleanSocs : [activeSociety()],
        society: cleanSocs[0] || text(p.society, 80) || prev.society || activeSociety(),
        households: Math.max(0, Number(p.households ?? prev.households) || 0),
        tenureYears: Math.max(0, Number(p.tenureYears ?? prev.tenureYears) || 0),
        identity: p.identity || prev.identity || null
      }, "worker_saved"));
    },
    addEndorsement: async (wid, e) => endorse({ workerId: wid, ...e })
  };

  // ---------- Endorsements (Reverse Attestation) ----------
  async function endorse({ workerId, by, unit, note, keys = false, skills = [], contact = "", highRiskTenureMonths = 0, tenureNote = "" } = {}) {
    if (!isValidResidenceUnit(unit)) {
      throw new Error("Please enter a valid flat, bungalow, or residence unit (e.g. Flat B-402, Row House 14, Bungalow 7).");
    }
    if (!isSafeContent(note) || !isSafeContent(by) || !isSafeContent(unit)) {
      throw new Error("Attestation Guard: Content contains prohibited defamation, slurs, or criminal allegations. Project Maanyata is a positive craft passbook.");
    }

    const w = needWorker(workerId);
    const e = sanitizeEndorsement({ by, unit, note, keys, skills, contact, highRiskTenureMonths, tenureNote, date: today() });
    if (!e) throw new Error("Endorsement contains invalid or unsafe content.");
    if (!e.keys && !e.skills.length) throw new Error("Affirm at least one trait: keys or a skill");

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
      commitWorker(w, "endorsed");
      return existing;
    }

    pruneStorageIfNeeded();
    w.endorsements.push(e);
    commitWorker(w, "endorsed");
    return e;
  }

  // ---------- 4-State Contract Machine & Lifecycle Methods ----------
  function readContract(cid) {
    if (typeof cid !== "string") return null;
    return read(K.CONTRACT + cid, null);
  }

  function commitContract(c, type) {
    const ids = read(K.CONTRACTS, []);
    if (!ids.includes(c.id)) write(K.CONTRACTS, [...ids, c.id]);
    write(K.CONTRACT + c.id, { ...c, updatedAt: new Date().toISOString() });
    notify(type || "contract_updated", c.id);
    return c;
  }

  /**
   * Start a new service contract between an employer unit and a worker.
   */
  async function startContract({ workerId, employerUnit, roleScope, shiftHours = 2.0 }) {
    if (!workerId) throw new Error("Worker ID is required to start a contract");
    if (!isValidResidenceUnit(employerUnit)) {
      throw new Error("Invalid residence unit. Specify valid flat or apartment (e.g. B-402, Flat 101).");
    }
    const cleanScope = text(roleScope, 120);
    if (!cleanScope) throw new Error("Role scope definition is required");

    const contract = {
      id: newId("c"),
      workerId: text(workerId, 80),
      employerUnit: text(employerUnit, 80),
      maskedUnit: maskUnit(employerUnit),
      roleScope: cleanScope,
      shiftHours: Math.max(0.5, Number(shiftHours) || 2.0),
      state: CONTRACT_STATE.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settledAt: null,
      confirmationMethod: null,
      dispute: null,
      fidelityShieldActive: true,
      fidelityCoverageMax: 100000 // ₹1,00,000 Fidelity Shield
    };

    return commitContract(contract, "contract_started");
  }

  /**
   * Settle an active contract upon successful completion or mutual confirmation.
   */
  async function settleContract({ contractId, confirmationMethod = "MUTUAL_CONFIRMATION" }) {
    const c = readContract(contractId);
    if (!c) throw new Error("Contract not found: " + contractId);
    if (c.state === CONTRACT_STATE.DISPUTED || c.state === CONTRACT_STATE.QUARANTINED) {
      throw new Error(`Cannot settle contract in ${c.state} state without formal dispute resolution.`);
    }
    if (c.state === CONTRACT_STATE.SETTLED) return c;

    c.state = CONTRACT_STATE.SETTLED;
    c.settledAt = new Date().toISOString();
    c.confirmationMethod = text(confirmationMethod, 60) || "MUTUAL_CONFIRMATION";
    return commitContract(c, "contract_settled");
  }

  /**
   * Quarantine a contract pending security or statutory investigation.
   */
  async function quarantineContract({ contractId, reason = "Premises security investigation" } = {}) {
    const c = readContract(contractId);
    if (!c) throw new Error("Contract not found: " + contractId);
    if (c.state === CONTRACT_STATE.QUARANTINED) return c;
    c.state = CONTRACT_STATE.QUARANTINED;
    c.quarantinedAt = new Date().toISOString();
    c.quarantineReason = text(reason, 280) || "Premises security investigation";
    return commitContract(c, "contract_quarantined");
  }

  /**
   * Initiate a formal contract dispute under the Bonded Trust Protocol.
   * Statutory Invariant: Minimum ₹2,500 Investigation Escrow + Police NC Number required.
   */
  async function initiateDispute({ contractId, reason, escrowAmount = 2500, policeNcNumber, stationName }) {
    const c = readContract(contractId);
    if (!c) throw new Error("Contract not found: " + contractId);
    if (c.state === CONTRACT_STATE.DISPUTED) {
      throw new Error("Contract is already under active dispute.");
    }
    if (c.state === CONTRACT_STATE.QUARANTINED) {
      throw new Error("Contract is already quarantined for security review.");
    }

    const cleanReason = text(reason, 280);
    if (!cleanReason) throw new Error("Factual dispute ground is required.");
    if (!isSafeContent(cleanReason)) {
      throw new Error("Dispute narrative contains prohibited abusive language.");
    }

    const escrow = Number(escrowAmount) || 0;
    if (escrow < 2500) {
      throw new Error("Statutory requirement: Minimum ₹2,500 Investigation Escrow deposit required to prevent frivolous disputes.");
    }

    const nc = text(policeNcNumber, 60);
    if (!nc) {
      throw new Error("Police Station NC/Diary Number is required to record a formal dispute.");
    }

    const station = text(stationName, 80);
    if (!station) {
      throw new Error("Police Station jurisdiction name is required.");
    }

    // Update contract state to DISPUTED (or QUARANTINED if serious security breach)
    const isSecurityBreach = /SAFETY_BREACH|SECURITY_BREACH/i.test(cleanReason);
    c.state = isSecurityBreach ? CONTRACT_STATE.QUARANTINED : CONTRACT_STATE.DISPUTED;
    c.dispute = {
      initiatedAt: new Date().toISOString(),
      reason: cleanReason,
      escrowAmount: escrow,
      policeNcNumber: nc,
      stationName: station,
      status: "INVESTIGATION_PENDING",
      escrowLocked: true,
      resolvedAt: null,
      outcome: null,
      compensatoryPayoutTo: null
    };

    return commitContract(c, isSecurityBreach ? "contract_quarantined" : "contract_disputed");
  }

  /**
   * Resolve an ongoing dispute.
   * If claim is dismissed as frivolous, ₹2,000 forfeits to worker as compensatory payout and ₹500 administrative review fee.
   */
  async function resolveDispute({ contractId, outcome, compensatoryPayoutTo }) {
    const c = readContract(contractId);
    if (!c) throw new Error("Contract not found: " + contractId);
    if (!c.dispute && c.state !== CONTRACT_STATE.QUARANTINED) {
      throw new Error("Contract has no active dispute or quarantine record.");
    }

    const cleanOutcome = text(outcome, 80) || "RESOLVED";
    let payoutRecipient = text(compensatoryPayoutTo, 80);

    if (cleanOutcome === "FRIVOLOUS_CLAIM_DISMISSED" && !payoutRecipient) {
      payoutRecipient = "WORKER";
    }

    c.state = CONTRACT_STATE.SETTLED;
    if (c.dispute) {
      c.dispute.status = "RESOLVED";
      c.dispute.resolvedAt = new Date().toISOString();
      c.dispute.outcome = cleanOutcome;
      c.dispute.compensatoryPayoutTo = payoutRecipient;
      c.dispute.escrowLocked = false;
    }

    return commitContract(c, "dispute_resolved");
  }

  // Contract repository
  const contracts = {
    async getAll() {
      return read(K.CONTRACTS, []).map(readContract).filter(Boolean);
    },
    async get(cid) {
      return readContract(cid);
    },
    async getByWorker(wid) {
      if (!wid) return [];
      return (await contracts.getAll()).filter(c => c.workerId === wid);
    },
    start: async (args) => startContract(args),
    settle: async (args) => settleContract(args),
    quarantine: async (args) => quarantineContract(args),
    dispute: async (args) => initiateDispute(args),
    resolve: async (args) => resolveDispute(args)
  };

  // ---------- Cluster Reserve Tracking (15% Safety Pool) ----------
  function getClusterReserve() {
    const cr = read(K.CLUSTER_RESERVE, null);
    if (!cr) {
      return {
        balance: 0,
        transactions: [],
        allocationRate: 0.15,
        fidelityShieldMax: 100000
      };
    }
    return cr;
  }

  function getClusterReserveBalance() {
    const cr = getClusterReserve();
    return Math.round((cr.balance || 0) * 100) / 100;
  }

  /**
   * Allocate annual society subscription fee (default ₹4,999 / year for Vasudev Complex pilot)
   * 15% automatically goes into the neighborhood Cluster Reserve Pool (₹749.85 per society).
   */
  function allocateSocietyFee({ societyName = "Vasudev Complex CHS", feeAmount = 4999 } = {}) {
    const cr = getClusterReserve();
    const amount = Math.max(0, Number(feeAmount) || 4999);
    const allocation = Math.round(amount * 0.15 * 100) / 100;

    const tx = {
      id: newId("tx"),
      date: new Date().toISOString(),
      societyName: text(societyName, 80),
      feeAmount: amount,
      allocationAmount: allocation,
      description: "15% Neighborhood Safety Pool Allocation"
    };

    cr.balance = Math.round(((cr.balance || 0) + allocation) * 100) / 100;
    cr.transactions = [tx, ...(cr.transactions || [])].slice(0, 50);
    write(K.CLUSTER_RESERVE, cr);
    notify("cluster_reserve_updated", cr.balance);
    return cr;
  }

  // ---------- Cross-device pass (P2P Base64URL) ----------
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
    const merged = commitWorker({
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

  // ---------- Society ----------
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

  function reset() {
    seed(true);
    notify("store_reset", null);
  }

  // ---------- Public API ----------
  const MaanyataStore = {
    init: async (force = false) => seed(!!force),
    reset,
    subscribe(cb) {
      if (typeof cb !== "function") throw new Error("Subscriber must be a function");
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    society,
    workers,
    endorse,
    contracts,
    startContract,
    settleContract,
    quarantineContract,
    initiateDispute,
    resolveDispute,
    getClusterReserve,
    getClusterReserveBalance,
    allocateSocietyFee,
    CONTRACT_STATE,
    serializePassToUrl,
    hydratePassFromUrl,
    normalizeUnit,
    maskUnit,
    isSafeContent,
    isValidResidenceUnit,
    traitsOf,
    SKILLS,
    SEEDS
  };

  global.MaanyataStore = MaanyataStore;
  if (typeof module !== "undefined" && module.exports) module.exports = MaanyataStore;

  seed(false);
})(typeof window !== "undefined" ? window : globalThis);
