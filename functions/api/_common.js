// Project Maanyata Edge Engine - Shared Core
// Server-Side Defense, Content Safety & State Management for Cloudflare Edge
// Hardened against Evil-Heavy Adversarial Vectors (Defamation, DoS, Fabricated Residences)

// 1. Invisible & Zero-Width Stripper (Prevents regex evasion like c\u200Bh\u200Bo\u200Br)
export function stripZeroWidth(str) {
  if (!str) return "";
  return String(str)
    // Strip zero-width spaces, joiners, non-joiners, word joiners, soft hyphens, BOM
    .replace(/[\u200B-\u200D\u2060\uFEFF\u00A0\u2000-\u200F\u2028-\u202F\uFFF0-\uFFFF\u00AD]/g, "")
    // Strip control characters (except newline/tab if any)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

// 2. Comprehensive Defamation, Criminal Accusation & Abuse Filter
// Strictly enforces the Positive Craft Attestation Principle of Project Maanyata
export const BANNED_WORDS_REGEX = new RegExp(
  "\\b(" + [
    // Criminal accusations / defamation
    "murder(?:s|er|ing)?", "kill(?:er|ing)?", "rape", "rapist",
    "thief", "thieves", "theft", "steal(?:ing)?", "stole", "stolen", "chor(?:i|on)?",
    "police", "cops?", "arrest(?:ed)?", "fir", "jail", "lockup", "court",
    "fraud(?:ster)?", "scam(?:mer)?", "cheat(?:er|ing)?", "420", "dhokha(?:baaz)?", "gaban",
    // Profanity / Vulgarity (English & Hindi/Hinglish)
    "fuck(?:ing|er)?", "shit", "bitch", "bastard", "asshole",
    "harami", "badmash", "kameena", "kamina", "saala", "saali", "suar", "kutta", "kutte",
    "madarchod", "behenchod", "bhosd(?:i|ike)?", "chutiya", "gandu", "randi",
    "breast", "jiggler", "sex", "porn", "xxx", "penis", "vagina", "escort", "strip", "whore", "slut", "cock", "dick",
    // Casteist slurs & discriminatory hatred
    "chamar", "bhangi", "chura", "mleccha", "katua", "nigger", "nigga", "nigg",
    // Substance / Poison / Violence
    "poison", "zehar", "narcotics", "drugs", "charas", "ganja", "chaku", "knife", "weapon", "maar\\s*peet",
    // Defamatory work trashing (Maanyata is strictly positive attestation; disputes belong in labor forums, not public passes)
    "kaamchor", "nikamma", "chor\\s*hai", "useless", "kachra"
  ].join("|") + ")\\b",
  "i"
);

export function isSafeContent(textStr) {
  if (!textStr) return true;
  const cleaned = stripZeroWidth(textStr);
  return !BANNED_WORDS_REGEX.test(cleaned);
}

// 3. Grounded Pilot Society Manifest (Mira Road East / MMR)
export const PILOT_SOCIETIES = [
  {
    name: "Vasudev Complex",
    aliases: ["vasudev complex", "vasudev", "vasudev chs"],
    area: "Opp. Shanti Park, Mira Road (East)",
    wings: ["A", "B", "C", "D", "E", "F", "G"],
    flatMin: 1,
    flatMax: 404,
    specialUnits: ["G-1", "G-2", "G-3", "G-4", "001", "002", "003", "004", "1", "2", "3", "4"]
  },
  {
    name: "Maryland Palms CHS",
    aliases: ["maryland palms", "maryland palms chs", "maryland"],
    area: "Silver Park, Mira Road (East)",
    wings: ["A", "B", "C", "D"],
    flatMin: 101,
    flatMax: 704
  },
  {
    name: "Greenwood Palms CHS",
    aliases: ["greenwood palms", "greenwood palms chs", "greenwood"],
    area: "Silver Park, Mira Road (East)",
    wings: ["A", "B"],
    flatMin: 101,
    flatMax: 404
  },
  {
    name: "Shanti Park",
    aliases: ["shanti park", "shanti park chs", "shanti nagar"],
    area: "Sectors 1-6, Mira Road (East)",
    wings: ["1", "2", "3", "4", "5", "6", "A", "B", "C", "D", "E", "F"],
    flatMin: 101,
    flatMax: 404
  },
  {
    name: "Silver Park CHS",
    aliases: ["silver park", "silver park chs"],
    area: "Mira Road (East)",
    wings: ["A", "B", "C"],
    flatMin: 101,
    flatMax: 704
  },
  {
    name: "Evershine Nagar CHS",
    aliases: ["evershine", "evershine nagar", "evershine enclave"],
    area: "Mira Road (East)",
    wings: ["A", "B", "C", "D", "E", "F"],
    flatMin: 101,
    flatMax: 1204
  },
  {
    name: "Lodha Aqua",
    aliases: ["lodha aqua", "lodha"],
    area: "WE Highway, Mira Road (East)",
    wings: ["A", "B", "C", "D", "E", "F"],
    flatMin: 101,
    flatMax: 2204
  },
  {
    name: "Pleasant Park",
    aliases: ["pleasant park", "pleasant park chs"],
    area: "Mira Road (East)",
    wings: ["A", "B", "C", "D"],
    flatMin: 101,
    flatMax: 404
  }
];

// 4. Structured Residence Unit Validation & Verification Engine
export function validateResidence(unitStr, societyName = "") {
  if (!unitStr) {
    return { valid: false, error: "Residence address is required." };
  }

  const cleanUnit = stripZeroWidth(unitStr);
  const cleanSociety = stripZeroWidth(societyName);

  if (cleanUnit.length < 3) {
    return { valid: false, error: "Residence address is too short (min 3 chars)." };
  }
  if (cleanUnit.length > 90) {
    return { valid: false, error: "Residence address exceeds length limit." };
  }

  // Reject generic spam strings
  if (/^(test|asdf|qwerty|none|na|null|undefined|ff|xxx|aaa|dummy|random)$/i.test(cleanUnit)) {
    return { valid: false, error: "Invalid test or placeholder residence address." };
  }

  // Combined text to inspect
  const fullText = `${cleanUnit} ${cleanSociety}`.trim();

  // Match against known pilot societies
  const lowerFull = fullText.toLowerCase();
  const matchedSociety = PILOT_SOCIETIES.find(soc =>
    soc.aliases.some(alias => lowerFull.includes(alias)) ||
    (cleanSociety && soc.aliases.some(alias => cleanSociety.toLowerCase().includes(alias)))
  );

  if (matchedSociety) {
    // For Vasudev Complex: check special units like G-1, 001, G-001, Flat 302, Wing G 001
    if (matchedSociety.name === "Vasudev Complex") {
      const isSpecial = matchedSociety.specialUnits.some(sp => {
        const regex = new RegExp(`(^|\\b|\\s)${sp}(\\b|\\s|$)`, "i");
        return regex.test(cleanUnit);
      });
      if (isSpecial) {
        return { valid: true, society: matchedSociety.name, unit: cleanUnit };
      }
    }

    // Check row house / bungalow pattern
    if (/^(row\s*house|bungalow|villa|plot|kothi)\s*\d+/i.test(cleanUnit)) {
      return { valid: true, society: matchedSociety.name, unit: cleanUnit };
    }

    // Extract Wing and Flat Number
    const wingMatch = cleanUnit.match(/\b(?:wing|bldg|building|tower)?\s*([A-Za-z0-9])\b/i);
    const flatMatch = cleanUnit.match(/\b(\d{1,4})\b/);

    if (flatMatch) {
      const flatNum = parseInt(flatMatch[1], 10);
      if (flatNum >= matchedSociety.flatMin && flatNum <= matchedSociety.flatMax) {
        return { valid: true, society: matchedSociety.name, unit: cleanUnit };
      } else {
        return {
          valid: false,
          error: `Attestation Guard: Flat number ${flatNum} is outside the verified range for ${matchedSociety.name} (${matchedSociety.flatMin} to ${matchedSociety.flatMax}).`
        };
      }
    }

    return {
      valid: false,
      error: `Attestation Guard: Could not detect a valid flat number for ${matchedSociety.name}.`
    };
  }

  // Structural grammar check for other registered societies:
  // Must have:
  // 1. A dwelling identifier (Flat, Wing, Room, Unit, Row House, Bungalow, Villa, etc.) with a number
  // 2. A complex/society type word (CHS, Society, Complex, Enclave, Heights, Tower, Apartments, Park, Nagar, etc.)
  const hasDwellingPattern = /\b(flat|room|unit|wing|bldg|building|house|bungalow|row\s*house|villa|plot|kothi|floor|g-\d+)\s*#?:?\s*([A-Za-z0-9-]+)/i.test(cleanUnit) ||
                             /\btower\b\s*#?:?\s*([0-9]+|[A-Za-z]\b)/i.test(cleanUnit) ||
                             /\b[A-Za-z]-?\d{1,4}\b/.test(cleanUnit);

  const hasComplexTerm = /\b(chs|co-?op|society|complex|enclave|heights|residency|plaza|park|nagar|apartments|gardens?|view|palms|estate|tower|towers)\b/i.test(fullText);

  if (hasDwellingPattern && (hasComplexTerm || cleanSociety.length >= 4)) {
    return { valid: true, society: cleanSociety || "Registered Residence", unit: cleanUnit };
  }

  return {
    valid: false,
    error: "Attestation Guard: Invalid residential address. Please specify both dwelling unit and verified complex (e.g. 'Flat B-402, Maryland Palms CHS' or 'G-1, 001, Vasudev Complex')."
  };
}

export function isValidResidenceUnit(unitStr, societyName = "") {
  return validateResidence(unitStr, societyName).valid;
}

// 5. Semantic Normalization, HMAC Hashing & Privacy Masking (Zero-Knowledge Wing Suppression)
export const UNIT_SALT = "maanyata:privacy:salt:v1";

export function normalizeUnit(str) {
  if (!str) return "";
  const cleaned = stripZeroWidth(str);
  return cleaned
    .toLowerCase()
    .replace(/flat\s*(no\.?)?|room\s*(no\.?)?|bldg\s*(no\.?)?|wing\s*|unit\s*(no\.?)?|block\s*|tower\s*/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export async function hashUnitHMAC(normalizedUnit) {
  if (!normalizedUnit) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(`${UNIT_SALT}:${normalizedUnit}`);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

// Zero-Knowledge Wing & Flat Suppression ($k >> 1$)
// Purges all unit numbers, wing letters, and flat numbers from public view
export function maskUnit(unitStr, societyName = "", lang = "en") {
  const s = stripZeroWidth(unitStr || "");
  const socName = stripZeroWidth(societyName || "");

  // Detect society from societyName or unitStr
  let matchedSoc = "";
  if (socName && socName.length >= 3) {
    matchedSoc = socName;
  } else {
    for (const pilot of PILOT_SOCIETIES) {
      if (pilot.aliases.some(alias => s.toLowerCase().includes(alias))) {
        matchedSoc = pilot.name;
        break;
      }
    }
    if (!matchedSoc) {
      const complexMatch = s.match(/\b([A-Za-z0-9\s]+(?:CHS|Complex|Palms|Heights|Enclave|Park|Nagar|Apartments|Towers?))\b/i);
      if (complexMatch) {
        matchedSoc = complexMatch[1].trim();
      }
    }
  }

  // Strip trailing or leading wing/flat designations from detected society
  if (matchedSoc) {
    matchedSoc = matchedSoc.replace(/^(Flat|Wing|Tower|Bldg|Unit)\s+[A-Za-z0-9-]+\s*,?\s*/i, "").trim();
  }

  if (lang === "hi") {
    return matchedSoc ? `सत्यापित निवासी अनुशंसा • ${matchedSoc}` : "सत्यापित निवासी अनुशंसा";
  }
  return matchedSoc ? `Verified Resident Attestation • ${matchedSoc}` : "Verified Resident Attestation";
}

// 6. Edge IP Rate Limiter & Abuse Prevention (Guards KV Quota)
export function getClientIP(request) {
  return request.headers.get("cf-connecting-ip") ||
         request.headers.get("x-real-ip") ||
         request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
         "127.0.0.1";
}

export async function checkRateLimit(kv, clientIp, action = "endorse") {
  if (!kv || !clientIp) return { allowed: true };
  const key = `rate:${action}:${clientIp}`;
  const now = Math.floor(Date.now() / 1000);
  const windowSec = 600; // 10 minute sliding window
  const maxAllowed = action === "endorse" ? 5 : 3;

  try {
    const raw = await kv.get(key);
    let count = 0;
    if (raw) {
      const data = JSON.parse(raw);
      count = data.count || 0;
    }
    if (count >= maxAllowed) {
      return {
        allowed: false,
        error: `Security Guard: Rate limit reached (${maxAllowed} submissions per 10 mins). Please try again shortly.`
      };
    }
    await kv.put(key, JSON.stringify({ count: count + 1, updated: now }), { expirationTtl: windowSec });
  } catch (e) {
    // Graceful degradation if KV rate limit check has issues
  }
  return { allowed: true };
}

// 7. Initial Seeds (Privacy Hardened: Scrubbed PII & Zero-Knowledge Attestations)
export const INITIAL_SEEDS = [
  {
    id: "sunita-devi-01",
    name: "Sunita Devi",
    role: "Senior Culinary Specialist & Meal Prep",
    uan: "UAN ****-****-4921",
    tenureBaseline: "8.5 Yrs",
    tenureAttested: "3 Yrs",
    tenure: "3 Yrs",
    households: 19,
    society: "Maryland Palms CHS, Mira Road",
    traits: {
      "Exceptional Cooking": { count: 14, iconName: "pot" },
      "Trusted With House Keys": { count: 18, iconName: "key" },
      "Always On Time": { count: 24, iconName: "clock" }
    },
    boundaries: [
      "Access to clean water & soap to wash hands",
      "Extreme Weather Late-Arrival Relief",
      "Minimum 1 Agreed Weekly Rest Day",
      "Direct Resident UPI on 1st of Month"
    ],
    references: [
      {
        id: "e-sunita-1",
        quote: "Master of North Indian and diabetic-friendly cooking. Has held our flat keys for 3 years without a single issue.",
        author: "Pooja Rao",
        unit: "Verified Resident Attestation • Greenwood Palms CHS",
        tenure: "3 Yrs Verified",
        startYear: 2023,
        certified: true,
        locationVerified: true,
        locationTag: "✓ On-Premises Verified (Maryland Palms)",
        contact: null
      }
    ]
  },
  {
    id: "ramesh-kumar-02",
    name: "Ramesh Kumar",
    role: "Chauffeur & Senior Mobility Assistant",
    uan: "UAN ****-****-8812",
    tenureBaseline: "12 Yrs",
    tenureAttested: "7 Yrs",
    tenure: "7 Yrs",
    households: 6,
    society: "Maryland Palms CHS, Mira Road",
    traits: {
      "Always On Time": { count: 22, iconName: "clock" },
      "Went Above & Beyond": { count: 9, iconName: "star" },
      "Trusted With House Keys": { count: 6, iconName: "key" }
    },
    boundaries: [
      "Designated 45-min lunch break",
      "Direct Resident UPI on 1st of Month"
    ],
    references: [
      {
        id: "e-ramesh-1",
        quote: "Handled hospital runs and school drop-offs for over a decade. Flawless driving record in Mumbai traffic.",
        author: "Anand Mehta",
        unit: "Verified Resident Attestation • Maryland Palms CHS",
        tenure: "7 Yrs Verified",
        startYear: 2019,
        certified: true,
        locationVerified: true,
        locationTag: "✓ On-Premises Verified (Maryland Palms)",
        contact: null
      }
    ]
  },
  {
    id: "asha-kumari-03",
    name: "Asha Kumari",
    role: "Deep Cleaning & Sanitization Specialist",
    uan: "UAN ****-****-3319",
    tenureBaseline: "5 Yrs",
    tenureAttested: "3 Yrs",
    tenure: "3 Yrs",
    households: 8,
    society: "Maryland Palms CHS, Mira Road",
    traits: {
      "Meticulous & Thorough": { count: 16, iconName: "sparkles" },
      "Always On Time": { count: 11, iconName: "clock" }
    },
    boundaries: [
      "Zero toxic acid chemicals",
      "Minimum 1 Agreed Weekly Rest Day"
    ],
    references: [
      {
        id: "e-asha-1",
        quote: "Leaves every corner sparkling. Never uses harsh chemicals, very polite and diligent.",
        author: "Dr. K. Merchant",
        unit: "Verified Resident Attestation • Maryland Palms CHS",
        tenure: "3 Yrs Verified",
        startYear: 2023,
        certified: true,
        locationVerified: true,
        locationTag: "✓ On-Premises Verified (Maryland Palms)",
        contact: null
      }
    ]
  }
];

export async function getKVWorker(kv, id) {
  if (!id) return null;
  const normalizedId = (id === "demo-sunita-01") ? "sunita-devi-01" : id;
  const key = `worker:${normalizedId}`;
  if (kv) {
    const raw = await kv.get(key);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    if (normalizedId !== id) {
      const rawAlt = await kv.get(`worker:${id}`);
      if (rawAlt) {
        try { return JSON.parse(rawAlt); } catch (e) {}
      }
    }
  }
  return INITIAL_SEEDS.find(s => s.id === normalizedId || s.id === id || s.name.toLowerCase() === id.toLowerCase()) || null;
}

export async function saveKVWorker(kv, worker) {
  if (!worker || !worker.id) return false;
  if (kv) {
    // 1. Privacy Scrubbing: mask all reference units, purge unitNorm, and strip raw contact PII
    if (worker.references && Array.isArray(worker.references)) {
      worker.references.forEach(r => {
        if (r.unit) r.unit = maskUnit(r.unit);
        delete r.unitNorm;
        r.contact = null; // PII never stored in public KV
      });
      // Cap at 50 references per worker to prevent KV object size bloat
      if (worker.references.length > 50) {
        worker.references = worker.references.slice(0, 50);
      }
    }

    // 2. Persist full worker object
    await kv.put(`worker:${worker.id}`, JSON.stringify(worker));

    // 3. Maintain directory:summary for O(1) single-subrequest listing
    try {
      const summaryRaw = await kv.get("directory:summary");
      let directory = [];
      if (summaryRaw) {
        try { directory = JSON.parse(summaryRaw); } catch (e) {}
      } else {
        directory = INITIAL_SEEDS.map(s => ({ ...s }));
      }

      const workerSummary = {
        id: worker.id,
        name: worker.name,
        role: worker.role,
        uan: worker.uan,
        tenure: worker.tenure,
        households: worker.households,
        society: worker.society,
        traits: worker.traits,
        boundaries: worker.boundaries,
        references: (worker.references || []).slice(0, 5),
        createdAt: worker.createdAt || new Date().toISOString()
      };

      const existingIdx = directory.findIndex(w => w.id === worker.id);
      if (existingIdx !== -1) {
        directory[existingIdx] = workerSummary;
      } else {
        directory.unshift(workerSummary);
        if (directory.length > 200) directory = directory.slice(0, 200);
      }
      await kv.put("directory:summary", JSON.stringify(directory));
    } catch (sumErr) {
      console.warn("Directory summary sync error:", sumErr);
    }
    
    // 4. Maintain worker ID index
    const indexRaw = await kv.get("workers:index");
    let ids = [];
    if (indexRaw) {
      try { ids = JSON.parse(indexRaw); } catch (e) {}
    }
    if (!ids.includes(worker.id)) {
      ids.push(worker.id);
      if (ids.length > 500) ids = ids.slice(-500);
      await kv.put("workers:index", JSON.stringify(ids));
    }
    return true;
  }
  return false;
}
