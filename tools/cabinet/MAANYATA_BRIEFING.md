# PROJECT MAANYATA (मान्यता) — THE DEFINITIVE SYSTEM BRIEFING
*Decentralized, Sovereign, Worker-Owned Digital Passbook for Informal Domestic Labor*
*Architect: Krishiv (Mira Road, Mumbai Metropolitan Region / MMR, India)*
*Production Target: https://project-maanyata.pages.dev | Sub-50KB Vanilla HTML5/CSS3/ES6*

---

## 1. Executive Summary & Philosophy
Project Maanyata (मान्यता = "recognition, validation, dignity") is a sovereign, offline-first digital credentials passbook for India's 50 million informal domestic workers (housekeepers, cooks, nannies, caregivers, drivers, and gardeners).

Unlike commercial society gatekeeping apps (e.g. MyGate, NoBrokerHood) or predatory gig platforms (Urban Company) that treat workers as tracked commodities, surveillance targets, or commission-extracted labor, Maanyata is **worker-owned, zero-cloud-debt, and sovereign**. The domestic worker owns her work history, cryptographically verified tenures, and references directly on her own phone.

---

## 2. The Core Personas & Ground Truth
1. **Sunita Devi (38, Domestic Cook & Housekeeper - The Hero Persona):**
   - Works across 4 apartments in Vasudev Complex, Mira Road.
   - Operates a budget Android smartphone with a cracked screen, intermittent 2G/4G connectivity, and Hindi/Bhojpuri literacy.
   - She carries her Maanyata QR passbook. When seeking work in a new flat or society, she presents her verified tenure and endorsements on her own terms, without depending on middleman agencies.
2. **Mrs. Sharma (Flat 402, Resident Employer):**
   - Tech-literate, safety-conscious apartment resident.
   - Signs cryptographic endorsements verifying Sunita Devi's work tenure (e.g., "Worked with us from Jan 2022 to Present with stellar reliability").
   - Pays Sunita Devi directly via cash or UPI without platform cuts.
3. **Bahadur Singh (Security Guard, Gate 2):**
   - Works gruelling 12-hour shifts at the society gate under extreme weather.
   - Needs instantaneous (<2 seconds) offline verification of incoming workers.
   - Scans the worker's QR passbook on a basic smartphone without typing, login walls, or internet access.
4. **Narang Uncle / Society Secretary:**
   - Managing Committee elder at Vasudev Complex Co-operative Housing Society (CHS).
   - Obsessed with committee liability, society security, and audit compliance under the Maharashtra Co-operative Societies (MCS) Act 1960.
   - Receptive to formal, respectful institutional documentation that guarantees legal compliance and zero financial risk for the CHS.

---

## 3. The 5 Hardened Invariants (Non-Negotiable Rules)
1. **Rule 1: Zero-Gate Reverse Attestation (No Biometric Turnstiles / No Gatekeeper Surveillance)**
   - Maanyata rejects turnstiles, biometric facial recognition at boom barriers, and intrusive tracking.
   - Workers hold and present their own credentials ("Reverse Attestation"). The security guard verifies the passbook; the system does not track the worker's minute-by-minute movements.
2. **Rule 2: Positive-Only Attestation (No 1-Star Defamation / No Blacklists)**
   - There are NO 1-star ratings, NO public negative reviews, and NO "Do Not Rent/Hire" (DNR) blacklists.
   - If an employer-worker relationship ends amicably, positive tenure is attested. If it ends acrimoniously, the tenure simply ceases to accrue or remains unendorsed. This prevents vindictive employers from destroying a woman's entire livelihood over a broken teacup.
3. **Rule 3: Zero Commission / Zero Wage Custody (₹0 Platform Cut)**
   - Maanyata never touches wages, handles escrows for salaries, or extracts transactional percentages.
   - All remuneration is bilateral direct P2P (cash or direct UPI to worker's bank/UPI ID).
   - This keeps Maanyata 100% exempt from Reserve Bank of India (RBI) Payment Aggregator regulations and eliminates platform extortion.
4. **Rule 4: Sovereign Aadhaar Privacy & DPDP Act 2023 Compliance**
   - Secure Aadhaar QR parsing is conducted strictly inside client-side RAM using public keys.
   - The raw 12-digit Aadhaar UID is NEVER stored in LocalStorage, IndexedDB, server logs, or cookies.
   - Only masked identifier `XXXX-XXXX-1234` and a salted cryptographic hash:
     `SHA-256("MAANYATA:" + masked_uid + ":" + uppercase_name + ":" + yob)`
     are stored for duplicate detection.
5. **Rule 5: Anti-Inflation Monotonic Calendar Span Union**
   - Work experience cannot be double-counted or artificially inflated.
   - If two households attest overlapping time frames (e.g., Flat 402 attests Jan 2023 - Dec 2023 and Flat 501 attests Jun 2023 - May 2024), the aggregate verified tenure is calculated as the mathematical union of unique calendar months (Jan 2023 - May 2024 = 17 months, NOT 12 + 12 = 24 months).

---

## 4. Legal & Institutional Framework
- **Maharashtra Co-operative Societies (MCS) Act 1960 (Section 81):**
  - Housing societies require audited verification records of regular service providers.
  - Maanyata provides an annual compliance certificate and audit trail for CHS committees (billed at ₹4,999/year for society verification compliance).
  - A ₹2,500 dispute guarantee is held in tripartite escrow to insulate managing committees from frivolous claims.
- **Digital Personal Data Protection (DPDP) Act 2023:**
  - Purpose limitation, verifiable consent, zero surveillance tracking, and right to complete data erasure.

---

## 5. Technical Constraints & Code Hygiene
- **Sub-50KB Vanilla Architecture:** Pure HTML5, CSS3, ES6 JavaScript. Zero npm packages, zero React/Vue/Tailwind build steps, zero external CDN dependencies that fail offline.
- **Physical Touch Target Rule:** Every interactive button, input, dropdown, and toggle MUST have a minimum bounding box of 44×44px (WCAG 2.1 AAA mobile ergonomics).
- **Font-Size Rule:** Text inputs must never be smaller than 16px to prevent iOS Safari auto-zooming.
- **Verification Suite:** `node tools/verify_all.mjs` must always pass with 0 errors before any code is committed.
