# Master Briefing for Claude — Project Maanyata (मान्यता)
**Architectural Dossier, Domain Reality & Frontend Design System Brief**

**From:** Antigravity (AI Pair-Programming Agent)  
**To:** Claude  
**Lead Architect & Systems Engineer:** Krishiv Sukul (Class 7, 12 years old, Mira Road, Thane, MMR, Maharashtra, India)  
**Target Repository:** `C:\Users\chand\OneDrive\Desktop\Maanyata POC`  
**Live Production Endpoint:** `https://project-maanyata.pages.dev`  
**Deployment Target:** Cloudflare Pages (Vanilla HTML5 / Modern CSS / Vanilla ES6 JavaScript, Zero Frameworks)  
**Date of Record:** November 3, 2026  

---

## 1. Project Soul & Core Mission

### The Real-World Problem in Indian High-Rises
In urban Indian apartment complexes (such as those across the Mumbai Metropolitan Region), over 50 million informal domestic workers (cooks, maids, ayahs, geriatric companions, drivers) face systematic dehumanization:
1. **Arbitrary Gate Harassment & Surveillance:** Commercial gate-management SaaS apps (MyGate, NoBrokerHood) treat workers as security risks or corporate inventory. Workers are forced to queue at gates, endure biometric scans on broken tablets, and face unilateral blacklists where a single spiteful resident can push a button and permanently destroy a worker's livelihood across an entire society.
2. **Invisible Seniority & Zero Portability:** A veteran cook like Sunita Devi who has worked with unblemished honesty for 15 years across 20 homes possesses **zero formal institutional proof** of her career. When a building's committee changes or she moves to a neighboring complex, her seniority resets to Day 0.
3. **Predatory Middlemen:** Commercial agencies (BookMyBai, Urban Company) extract 20% to 30% monthly commission cuts and hold wages in proprietary app wallets.

### The Maanyata Solution: "Just a Passport"
Project Maanyata (मान्यता — *Dignity / Sovereign Recognition*) is a **decentralized, worker-owned digital passbook and trust protocol**.
* **Not a Gate App:** It does not control gates, turnstiles, or boom barriers.
* **Not an Agency:** It takes **₹0.00 commission**, never touches wages, and has no corporate middleman.
* **A Sovereign Passport:** Like a physical Indian passport, it belongs exclusively to the worker. It records only **verified positive stamps of honorable craft and service continuity**. It operates offline via standard WebCrypto Ed25519 optical QR codes and runs client-side in standard browser memory.

---

## 2. The Three Human Personas (Frontend Design Stakeholders)

Claude, your design scheme must be engineered around three specific human beings living in **Vasudev Complex, Mira Road**:

### Persona 1: Sunita Devi (The Worker)
* **Demographics:** 42-year-old North Indian domestic cook living in Naya Nagar / Mira Road. 
* **Hardware & Network:** A ₹6,000 budget Android smartphone (Redmi/Poco, 3GB RAM) with a spider-web cracked screen. The top-right corner of the touch digitizer is dead. Prepaid Jio/Airtel 1.5 GB/day plan, frequently throttled to 64 kbps by 3:00 PM.
* **Literacy & UI Needs:** Speaks fluent Hindi and conversational Marathi; limited English textual literacy. Cannot read dense paragraphs or complex English settings menus.
* **Design Mandates:**
  * **Large, Thumb-Friendly Tap Targets:** Minimum 48px to 56px. Zero essential buttons in screen corners.
  * **Visual & Symbolic Hierarchy:** Clear icons, high-contrast badges, bold typography, and vernacular micro-copy (*"रसोइया"*, *"प्रमाणित सेवा"*).
  * **Pride & Dignity:** Her profile must look like an executive diploma or diplomatic credential, never a sterile police suspect record or a food delivery driver card.

### Persona 2: Pooja / Mrs. Sharma (The Resident Employer)
* **Demographics:** 34-year-old working professional living in Flat 204, Wing B, Vasudev Complex.
* **Hardware:** iPhone 13 or Samsung Galaxy S-series on 5G / Home Wi-Fi.
* **Mindset:** Busy, stressed, boiling milk at 7:15 AM while getting kids ready for school. 
* **Design Mandates:**
  * **15-Second Frictionless Endorsement:** Cannot be asked to fill out 10-field surveys or write essays. Taps 3 checkboxes (`[✓ Cooking]`, `[✓ Punctual]`, `[1 Year]`), shows screen for a 2-second scan, done.
  * **Clear Trust Signals:** Needs clean, instant proof of tenure and skills without wading through messy comments or drama.

### Persona 3: Bahadur Singh (The Gate Security Guard)
* **Demographics:** 52-year-old security guard standing for 12 hours at the iron gate of Vasudev Complex.
* **Hardware:** Society-provided budget Android tablet or his own cracked phone.
* **Environment:** Glaring, washed-out midday sunlight (35°C) or dim sodium-vapor streetlights at night; dust, honking delivery bikes, and impatient residents.
* **Design Mandates:**
  * **0.5-Second Visual Decision:** Large, bold binary indicator (Clear **GREEN** Verified vs. Sharp **RED** Rejection).
  * **Prominent Face Portrait:** High-resolution 76×76px photo hero so he can glance at the screen, glance at the human face, and wave them through.
  * **Offline Resilience:** Scanner must decode and verify WebCrypto Ed25519 signatures in airplane mode with zero network latency.

---

## 3. Physical & Cultural Anchor: Vasudev Complex

* **Location:** Vasudev Complex, Opp. Shanti Park, Mira Road (East), Thane / MMR, Maharashtra - 401107.
* **Topology:** Real 7-wing complex (Wings A, B, C, D, E, F, G), 4-story buildings (Flats 1 to 404), with distinctive ground-floor residential units (`G-1`, `G-2`, `G-3`, `G-4`, `001`, `002`).
* **The "No-Building" Invariant:** The platform does not sell to or seek authorization from the Housing Society Managing Committee. The atomic unit of trust is **strictly bilateral (Worker ↔ Employer)**. The physical building is treated merely as a geographic neighborhood cluster tag.

---

## 4. Master Architectural & Ethical Invariants

Before designing a single CSS class or layout, Claude must understand the unshakeable rules of this system:

1. **The Positive-Only Attestation Invariant (Anti-MyGate):**
   * **No 1-star ratings. No negative feedback boxes. No "Do Not Rehire" (DNR) tags.**
   * In informal labor markets, negative reviews become unilateral weapons of extortion used by abusive employers over broken teacups or wage disputes.
   * If a household has a good experience, they mint a verified competency badge. If they have a bad experience, they simply refuse to endorse. The **absence of an endorsement** is the loudest signal in the world.
2. **The "Why Lie?" Tenure Truth Invariant:**
   * Never conflate unverified form inputs with cryptographic proof.
   * The UI strictly disaggregates:
     * **Declared Career Baseline:** e.g., `8.5 Yrs (Self-Reported Career Start)`
     * **Platform-Verified Attestation:** e.g., `2.0 Yrs (Signed In-App across 3 Households)`
   * The **Monotonic Tenure Invariant** ($\text{Tenure} = \max(\text{Baseline}, \text{Attested})$) ensures a new digital endorsement can never downgrade or wipe out veteran seniority.
3. **The Strict Payment Invariant (Zero Regulatory & Platform Debt):**
   * **Maanyata does NOT touch money, wallets, escrow, or salary advances.**
   * All payments are made directly between resident and worker via **Cash in Hand or Direct UPI (GPay/PhonePe)**.
   * Avoids Reserve Bank of India (RBI) Payment Aggregator regulations (₹15 Crore net worth requirement) and prevents workers from suspecting platform commission cuts.
4. **The Pure Structured Whitelist (Zero-Text Defamation Shield):**
   * Public passbooks do not display free-form text comments from employers.
   * Endorsements grant strictly standardized, pre-vetted competency badges (`[Cooking: North Indian]`, `[Punctual]`, `[Keys Held]`, `[Childcare]`, `[Elderly Care]`). Eliminates weaponized innuendo.
5. **Multi-Layered Privacy Shield (Burglary Casing Protection):**
   * Public passes and directories never expose raw phone numbers (`contact: null`).
   * Flat numbers are masked on public passes (`Flat B-***, Vasudev Complex`).
   * Government UAN is masked (`UAN ****-****-4921`).

---

## 5. Current Codebase Page Inventory

All code is written in pure vanilla HTML5, CSS3, and ES6 JavaScript, deployed directly on Cloudflare Pages:

| File | Purpose | Key UI Elements |
| :--- | :--- | :--- |
| [`portfolio.html`](file:///C:/Users/chand/OneDrive/Desktop/Maanyata%20POC/portfolio.html) | The Core Worker Passbook | Dual-mode view (`?view=hire` for residents vs worker passbook view). 76×76px photo hero, 500ms liveness ticker (`HH:MM:SS`), verified badges, Dignity Charter terms, offline QR modal. |
| [`directory.html`](file:///C:/Users/chand/OneDrive/Desktop/Maanyata%20POC/directory.html) | Community Worker Directory | Dynamic society switcher (`Vasudev Complex`), craft category filters (Cook, Maid, Nanny, Driver), worker summary cards, verified badges, XSS-escaped rendering. |
| [`onboard.html`](file:///C:/Users/chand/OneDrive/Desktop/Maanyata%20POC/onboard.html) | Trilingual Worker Onboarding | Live webcam selfie capture (`getUserMedia`), craft selection pills, trilingual Dignity Charter pledge (English, Hindi, Marathi). |
| [`endorse.html`](file:///C:/Users/chand/OneDrive/Desktop/Maanyata%20POC/endorse.html) | Resident Attestation Portal | Society/Wing/Flat selector pre-configured for Vasudev Complex, tenure selector, structured competency badge picker, zero-width stripping & profanity filter. |
| [`verify.html`](file:///C:/Users/chand/OneDrive/Desktop/Maanyata%20POC/verify.html) | Gatekeeper Scanner Terminal | Fast full-screen camera QR reader using `jsQR.js`, WebCrypto Ed25519 signature verification, binary full-screen Green/Red state overlays. |

---

## 6. Frontend Design Scheme Requirements (What Claude Must Deliver)

Claude, Krishiv needs an un-bloated, deeply grounded, world-class **Frontend Design Scheme / Design System** that unifies all 6 pages.

### Design Principles to Embody:
1. **The Anti-SaaS Palette (Warm, Earthy, Authoritative Dignity):**
   * **Banned:** Generic Silicon Valley purple gradients, Discord dark mode, AI neon cyan/magenta sparkles, muddy pond water greens.
   * **Mandated:** Authentic, high-contrast Indian palette reflecting dignity, craft, and parchment/passport authority:
     * **Primary Brand / Authority:** Rich Deep Saffron / Terracotta (`#C2410C` / `#9A3412`) or Deep Navy Royal (`#0F172A` / `#1E293B`).
     * **Passbook Parchment Canvas:** Crisp warm white / cream / slate ivory (`#FAF9F6` / `#F8FAFC`).
     * **Trust & Verification Green:** Deep Forest / Emerald Seal Green (`#15803D` / `#166534`) with high-contrast white text (not neon lime).
     * **Typography Ink:** Deep Slate / Charcoal (`#0F172A` / `#1E293B`) ensuring a minimum 7:1 contrast ratio against light backgrounds.
2. **Solar & Lighting Resilience:**
   * The UI must be completely legible under **100,000 lumens of direct midday sunlight** (blazing white exposure) and under **dim sodium-vapor streetlights at gate kiosks**.
   * High contrast, solid borders (1px to 1.5px solid borders), clear card boundaries, zero washed-out low-contrast gray text (`#94A3B8` on white is banned).
3. **Typography & Dual-Script Harmony:**
   * English + Devanagari (Hindi/Marathi) pairing that looks intentional, balanced, and dignified.
   * Clean, highly readable system or open fonts (e.g. `Plus Jakarta Sans` or `Inter` paired seamlessly with `Noto Sans Devanagari`).
4. **Sub-50KB Zero-Framework Architecture:**
   * **Pure Vanilla CSS.** No Tailwind build step, no Sass preprocessors, no React/Vue runtime overhead.
   * Everything must load in under 400ms on a throttled 64 kbps connection.
   * **Zero External Icon Fonts:** Use bespoke inline SVGs (`shape-rendering="geometricPrecision"`). No external FontAwesome or Google Material Icons CDNs that break when offline.
5. **Tactile Physicality:**
   * The UI should feel like holding a **physical, laminated document or leather-bound passport**. Subtle card elevation, embossed seal badges, clean micro-interactions.

---

### Hand-off Note to Claude
Claude, Krishiv is a rigorous first-principles systems engineer. He does not want corporate fluff, generic component lists, or decorative templates. He wants a **tangible, cohesive design specification with exact hex codes, typographic scales, button states, card tokens, responsive micro-layouts, and CSS architectural rules** that can be directly implemented into Project Maanyata.

Ground every design choice in the physical reality of **Sunita, Pooja, and Bahadur in Vasudev Complex**.
