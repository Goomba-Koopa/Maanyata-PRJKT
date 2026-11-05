# Project Maanyata (मान्यता) — Roles & Pages Manifest

> **Ground Truth Architecture**: This manifest defines every production HTML page in Project Maanyata. Each page corresponds to an authentic stakeholder persona in a housing society ecosystem, with zero synthetic placeholders, zero corporate surveillance, and cryptographic Ed25519 offline guarantees.

---

## 1. Core Ecosystem Roles Matrix

| File | Target Persona | Primary Purpose | Tech / Cryptographic Substrate |
| :--- | :--- | :--- | :--- |
| [`portfolio.html`](./portfolio.html) | **The Domestic Worker**<br>*(Sunita Devi)* | Personal sovereign work passbook, verified tenure, craft badges, dynamic live QR code for gate access. | LocalStorage/IndexedDB state, Ed25519 signed payload, dynamic liveness ticker, bilingual Devanagari UI. |
| [`endorse.html`](./endorse.html) | **The Employing Resident**<br>*(Mrs. Sharma / Pooja)* | 15-second zero-friction tap endorsement to attest positive craft skills, tenure milestones, and character traits. | URL query parameter prefill (`?worker=...`), cryptographic endorsement recording, anti-retaliation positive-only attestation. |
| [`directory.html`](./directory.html) | **The Society Resident / Hiring Household** | Browse verified active domestic staff inside the society complex categorized by craft (cook, housekeeping, nanny, eldercare). | Real-time craft filter chips, verified badge filters, zero wage-bidding, direct WhatsApp / call connection. |
| [`onboard.html`](./onboard.html) | **The New Worker (Self-Registration)** | Self-sovereign worker onboarding: issue initial portable pass with selfie photo, shift windows, and Dignity terms. | Client-side photo canvas capture, Ed25519 keypair generation / registration, dignity charter agreement. |
| [`verify.html`](./verify.html) | **The Gate Security Guard**<br>*(Bahadur Singh)* | High-speed camera QR scanner to verify worker pass Ed25519 signature completely offline in under 0.5s. | WebRTC camera stream, `jsQR.js` frame parser, `tweetnacl.min.js` offline signature verification, color-coded high-contrast result HUD. |
| [`rwa_pilot_proposal.html`](./rwa_pilot_proposal.html) | **The Society Committee / RWA Secretary**<br>*(Narang / Management)* | Formal 30-day zero-cost society pilot proposal, legal memorandum, operational SOPs, and board resolution. | Clean printable document styling, financial breakdown, privacy & legal compliance, risk analysis. |
| [`index.html`](./index.html) | **Root Switchboard / Launchpad** | Clean visual entry point linking directly to all 6 stakeholder role interfaces for demonstrations, field testing, and pilots. | Pure vanilla CSS/JS, responsive grid, zero external framework dependencies, instant offline navigation. |

---

## 2. Granular Page Specifications

### 2.1 `portfolio.html` — The Domestic Worker's Sovereign Passbook
* **Persona**: Sunita Devi (Domestic Cook / Housekeeping Professional).
* **Objective**: Complete worker data sovereignty. Eliminates gate humiliation, physical paper pass loss, and reliance on platform middle-men.
* **Key Features**:
  * Sovereign Work Pass with live anti-screenshot liveness ticker.
  * Verified tenure display (months & years of verified service).
  * Craft endorsements with resident signatures.
  * WhatsApp passbook export / share link.
  * Offline-capable PWA service worker caching.
* **Direct Entry**: [Open Worker Portfolio](portfolio.html)

### 2.2 `endorse.html` — The Employing Resident's Tap Endorsement
* **Persona**: Mrs. Pooja Sharma (Tower B, Flat 402 resident employer).
* **Objective**: Give domestic staff a verifiable, portable credential in 15 seconds without administrative red tape.
* **Key Features**:
  * 15-second tap workflow: select verified craft (Cooking, Housekeeping, Childcare, Eldercare).
  * Positive-only trait chips (Punctual, Hygienic, Trustworthy, Specialized Cuisine).
  * Pre-populates worker ID from URL parameter (e.g. `endorse.html?worker=M-7F2A-4921`).
  * Cryptographic signature recorded into the worker's decentralized record.
* **Direct Entry**: [Open Endorsement Portal](endorse.html)

### 2.3 `directory.html` — Society Resident Discovery Directory
* **Persona**: Society Resident seeking trusted, verified domestic staff already working inside the gates.
* **Objective**: Transparent internal discovery based on verified tenure and craft rather than exploitative third-party agencies.
* **Key Features**:
  * Filter by craft: All, Cook, Housekeeping, Nanny, Eldercare.
  * Search by worker name or tower unit.
  * Displays verified tenure (e.g., "18 mo in society", "4 active households").
  * Zero algorithmic rating penalties or commission deductions.
* **Direct Entry**: [Open Staff Directory](directory.html)

### 2.4 `onboard.html` — Worker Self-Registration Portal
* **Persona**: New domestic worker entering the society ecosystem.
* **Objective**: Issue sovereign digital credentials directly to the worker's device with zero intermediary extortion.
* **Key Features**:
  * Instant camera or photo upload for passport headshot.
  * Primary craft selection and preferred shift windows (e.g., 07:00 – 11:00 Morning).
  * Dignity Charter acceptance: guarantees fair wages, resting hours, and basic human dignity.
  * Generates cryptographic passport seed stored strictly in device local storage.
* **Direct Entry**: [Open Worker Onboarding](onboard.html)

### 2.5 `verify.html` — Security Guard Gate Scanner
* **Persona**: Bahadur Singh (Main Gate Security Guard, Gate 1).
* **Objective**: Sub-500ms offline verification of incoming domestic staff without requiring internet access or central server queries.
* **Key Features**:
  * High-framerate camera QR code reader via `jsQR`.
  * Offline Ed25519 cryptographic public key validation (`tweetnacl`).
  * Full-screen color feedback: Green (Valid Pass), Red (Tampered/Expired), Amber (Idle).
  * Manual token paste fallback input when optical camera is unavailable.
* **Direct Entry**: [Open Guard Verifier](verify.html)

### 2.6 `rwa_pilot_proposal.html` — RWA Executive Proposal & Pilot Charter
* **Persona**: RWA President / General Secretary (Narang / Managing Committee).
* **Objective**: Comprehensive governance dossier for securing formal Apartment Owners Association (AOA/RWA) board approval for a 30-day pilot.
* **Key Features**:
  * Pilot charter and phase rollout schedule (Week 1–4).
  * Zero-cost infrastructure overview (runs on existing resident & guard smartphones).
  * Legal indemnity, data privacy safeguards, and anti-surveillance protocols.
  * Direct print-to-PDF formatting for physical board meetings.
* **Direct Entry**: [Open RWA Pilot Proposal](rwa_pilot_proposal.html)

### 2.7 `index.html` — System Launchpad & Role Switchboard
* **Persona**: Field Test Director, RWA Members, Residents, and Demonstration Evaluators.
* **Objective**: Unified visual index presenting the complete Maanyata architecture with direct navigation to every stakeholder surface.
* **Direct Entry**: [Open Launchpad](index.html)

---

## 3. Auxiliary Test & Tooling Files (Moved to `tests/`)
All diagnostic benches, palette audits, and CLI test harnesses are compartmentalized in [`tests/`](./tests/):
- `tests/test_palette_catppuccin.html`: Color contrast & accessibility palette benchmark.
- `tests/test_palette_monokai.html`: High-contrast dark theme evaluation.
- `tests/test_palette_olive.html`: Warm heritage palette benchmark.
- `tests/test_palette_shared.css`: Shared styling for test palette harness.
- `tests/test_palette_shared.js`: Dynamic palette switching runtime.
- `tests/test_edge_defenses.mjs`: Cloudflare Workers edge defense suite.
- `tests/test_edge_e2e.mjs`: End-to-end edge verification suite.
- `tests/test_live_edge.mjs`: Production edge health check script.
