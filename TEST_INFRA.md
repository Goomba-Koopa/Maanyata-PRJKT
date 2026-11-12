# E2E Test Infrastructure Specification: Karmyog Pass Liquid Glass Beta

**Author**: Test Writer 1 (`teamwork_preview_test_writer`)  
**Project**: Karmyog Pass Liquid Glass Beta Overhaul & Hardening  
**Scope**: Requirements R1–R4, Features F_DECORP_GATE to F_FINAL_HARDEN  
**Target File**: `index_beta.html`  
**Automated Harness**: `test_e2e_requirements.py` (Python 3.14 + Headless Google Chrome)

---

## 1. Test Philosophy & Principles

The Karmyog Pass Liquid Glass Beta is a high-integrity, zero-dependency, single-file Progressive Web Application intended for physical gatekeepers, domestic staff, and apartment residents in residential societies (specifically Gulmohar Heights Society). To guarantee that the application functions with unyielding reliability in physical security environments, the test infrastructure adheres to five non-negotiable principles:

1. **Physical Reality Grounding (Zero Artificial Facades)**:
   Tests verify physical security constraints rather than mock corporate metaphors. Automated tests strictly probe for universal gate entry clearance (iron swing gates, wicket doors, guard sign-offs) and reject any lingering corporate assumptions (such as automated vehicular boom-barrier relays).

2. **Defensive State Machine & Gating Verification**:
   Onboarding steps are treated as locked security chambers. A step's forward navigation (`#btnOnboardNext`) must remain physically disabled, pointer-inaccessible, and visually dimmed until the drill or credential requirements of that step are verified. Tests actively attempt to breach step transitions before drills are completed.

3. **Multi-Viewport Visual & Ergonomic Invariance**:
   Gatekeepers and domestic workers access the interface on varied devices: from ruggedized station tablets (700px viewport height) to budget smartphones (360px screen width). Tests directly measure DOM bounding rects, client/scroll heights, overflow properties, and key dimensions (mini-keys <= 44px) across 1280x900 (laptop/desktop), 1280x700 (compact tablet), and 360x740 (budget mobile).

4. **100% Bilingual Symmetrical Parity**:
   Every state, notification, badge, button, and modal element must respond reactively to language toggles (`hi` <-> `en`) without silent drops, orphaned English/Hindi tokens, or modal resets.

5. **Pure Mathematical QR Engine Safeguard**:
   The ISO/IEC 18004 QR generator engine operates on GF(2^8) Galois Field arithmetic and Reed-Solomon polynomial division without third-party libraries. Tests inspect raw SVG output strings, viewBox dimensions, and module counts to ensure zero engine regressions.

---

## 2. Feature Inventory & Requirement Mapping

| Feature ID | Requirement | Feature Name & Scope | Test Tier | Verifiable Invariants |
|---|---|---|---|---|
| `F_DECORP_GATE` | R1 | Universal Gate Entry Clearance | Tier 1, Tier 3 | Zero `बूम बैरियर` / `boom barrier` occurrences; status titles say `APPROVED` / `OVERRIDE`; descriptions use `गेट प्रवेश अनुमति` / `Gate Clearance`. |
| `F_GUARD_TERM` | R1 | Physical Station Tablet Handover | Tier 1, Tier 4 | Guard Step 1 displays station hardware terminal (`Gate 1 Hardware Terminal G1-TAB-04`), contract `#GH-2026`, supervisor key `RWA-SEC-G1`, and guard name `Bahadur Singh`. |
| `F_DOM_GEOFENCE` | R1 | Hyper-Local Campus Geofencing & Radius Filters | Tier 1, Tier 3 | Domestic opportunities in `#view-worker` default to intra-campus ('Under 500m', Towers 1-4, B-402, A-201, D-502, C-1104, 50m-420m badges). Distance radius filter pills support >500m tiers: '1–2 km' (Chhota Bheem's House), '3–5 km' (Diddy's Daycare), '5–7 km' (Epstein Temple), '7–10 km' (Mountbatten Ruler Estate) with out-of-perimeter badges. |
| `F_FOOTER_MODAL` | R1 | Understated Footer Architecture | Tier 1, Tier 4 | Overview view has zero 3-column "Verification Hub" banner; semantic `<footer>` contains "About / उद्देश्य एवं ऑनबोर्डिंग गाइड" link; opening `#betaAboutModal`. |
| `F_MODAL_FLEX` | R2 | Three-Tier Locked Modal Layout | Tier 1, Tier 2 | `.onboarding-modal` has `display: flex; flex-direction: column;`; header and footer have `flex-shrink: 0`; body `#onboardStepBody` has `overflow-y: auto`. |
| `F_MODAL_VIEWPORT` | R2 | Zero-Clipping & Scrollbar Elimination | Tier 1, Tier 2 | `.onboarding-modal` has `max-height: calc(100vh - 40px); overflow: hidden;`; header elements (`✕`, bubbles, title) remain visible at 700px & 900px viewports. |
| `F_KEYPAD_COMPACT` | R2 | Compact Keypad & Drill Chamber | Tier 1, Tier 2 | `.mini-key` bounding box width and height <= 44px; grid gap <= 6px; drill chamber fits within compact viewport heights without parent scrolling. |
| `F_DRILL_REACTIVE` | R3 | Reactive Error Shake & Auto-Reset | Tier 1, Tier 2, Tier 3 | Entering mistyped 4 digits (e.g. `7077`) immediately triggers red error banner (`🔴 अमान्य कोड` / `Invalid Code`) and `.shake`/`.drill-shake`, auto-clearing after 600ms without freezing. |
| `F_STEP_GATING` | R3 | Strict Step Gating | Tier 1, Tier 2 | `#btnOnboardNext` is disabled (`disabled` attr, `pointer-events: none`, opacity ~0.4) until drill is satisfied; `nextOnboardingStep()` blocks invalid transitions. |
| `F_QR_PRESERVE` | R4 | Pure JS ISO/IEC 18004 QR Engine | Tier 1, Tier 4 | `generateQRCodeSVG()` produces valid `<svg>` with `viewBox="0 0 37 37"`; zero external CDN dependencies in `<script>` tags; authentic matrix encoding. |
| `F_BILINGUAL_100` | R4 | 100% Reactive Bilingual Integrity | Tier 1, Tier 3 | Parity between `betaTranslations.hi` and `en` keys; zero hardcoded modal text; dynamic re-render on language switch while modal is active. |
| `F_TEST_INFRA` | R1–R4 | Automated Headless Chrome E2E Suite | Tiers 1–4 | `test_e2e_requirements.py` executes in headless Chrome, capturing structured JSON test results and detecting 0 console errors. |
| `F_FINAL_HARDEN` | All | Full E2E Hardening & Humility Pass | Tier 4, Tier 5 | Full suite passes cleanly without flakiness or regressions. |

---

## 3. Test Architecture & Execution Framework

### 3.1 Technology Stack
- **Test Orchestrator**: Python 3.14 standard library (`subprocess`, `tempfile`, `json`, `os`, `re`, `shutil`).
- **Browser Runtime**: Google Chrome Headless (`C:\Program Files\Google\Chrome\Application\chrome.exe --headless=new`).
- **Execution Mechanism**: Dynamic HTML injection harness. The target `index_beta.html` is wrapped into an isolated runner document inside an ephemeral temp directory (`tempfile.mkdtemp()`). The test suite script is injected before `</body>`.
- **IPC & Data Extraction**: The in-page test framework records assertion results, viewport geometry metrics, and any caught unhandled `window.onerror` console exceptions into an in-memory accumulator. On completion, it serializes results into a JSON payload embedded within `<script id="e2e-test-results" type="application/json">`. Chrome dumps the executed DOM via `--dump-dom`, and the Python harness parses the structured JSON.

### 3.2 Viewport Matrix
Each test run verifies specific viewport configurations:
1. **Desktop / Laptop Viewport**: `--window-size=1280,900` (evaluates baseline UI ergonomics, centered glass modals, table log rendering).
2. **Compact Hardware Station Tablet**: `--window-size=1280,700` (evaluates modal flex height constraints, locked header/footer visibility, zero outer modal window scrolling).
3. **Budget Mobile Screen**: `--window-size=360,740` (evaluates responsive wrapping, zero horizontal overflow: `scrollWidth <= clientWidth`, 44px keypad touch target spacing).

### 3.3 Test Organization by Tiers

```
test_e2e_requirements.py
├── Tier 1: Feature Coverage (>=5 tests per requirement R1, R2, R3, R4)
│   ├── R1-T1..T6: Gate Clearance, Station Tablet Handover, Geofencing, Understated Footer
│   ├── R2-T1..T5: Flex Column Layout, Zero Clipping, 44px Mini-Key, Locked Header/Footer
│   ├── R3-T1..T6: Strict Gating (Steps 1, 2, 3), 4-Digit Mismatch Error, Shake Class, Auto-Reset
│   └── R4-T1..T6: Pure JS QR Engine, Zero CDNs, Symmetrical Translations, Reactive Modal Re-render
├── Tier 2: Boundary & Corner Cases
│   ├── B1: 700px Viewport Height Modal Bounding Rect & Scrollbar Invariance
│   ├── B2: 900px Viewport Centered Glass Aesthetics
│   ├── B3: 360px Budget Mobile Zero Horizontal Overflow
│   ├── B4: Mistyped PIN 7077 Immediate Rejection (No Freeze)
│   ├── B5: 600ms Auto-Reset Buffer Recovery
│   ├── B6: Rapid Key Clicks (>4 digits overflow protection)
│   └── B7: Empty Input Step Advance Defense
├── Tier 3: Cross-Feature Combinations
│   ├── C1: Language Toggle while Onboarding Modal Open (Reactive Body Update)
│   ├── C2: Drill Error followed by Correct Code Entry and Language Toggle
│   ├── C3: Guard Terminal Handover to QR Drill Multi-Step Sequence
│   └── C4: Resident Slot Allocation & Direct UPI Deep Link Bilingual Parity
└── Tier 4: Real-World Scenarios
    ├── S1: Complete Domestic Worker Onboarding Journey (Cook Sunita Devi)
    ├── S2: Complete Guard Physical Tablet Handover & Emergency Override Drill
    ├── S3: Resident Pass Setup, Application Acceptance & UPI Payroll Generation
    └── S4: Footer About & Onboarding Guide Modal Walkthrough
```

---

## 4. Real-World Scenarios Specification (Tier 4)

### Scenario S1: Complete Domestic Worker Onboarding Journey
- **Persona**: Sunita Devi, Senior Cook seeking domestic employment at Gulmohar Heights Society.
- **Path**:
  1. Opens Worker Onboarding from `#view-worker`.
  2. Step 1: Selects trade `cook`, enters phone and name. Verifies Next button unlocked upon valid details.
  3. Step 2: Reviews hyper-local campus flat assignments (Towers 1 & 4, 500m radius), selects Morning Shift. Advances to Step 3.
  4. Step 3: Enters worker PIN `4028` on the compact dialpad. Verifies success feedback (`🟢 PIN सत्यापित`).
  5. Step 4: Inspects generated ISO/IEC 18004 QR pass bearing payload `KARMYOG:PIN=4028...`.
  6. Completes onboarding and returns to dock.

### Scenario S2: Guard Physical Station Tablet Handover & Drills
- **Persona**: Bahadur Singh, Security Guard reporting for morning duty at Gate 1.
- **Path**:
  1. Opens Guard Drill from `#view-guard`.
  2. Step 1: Inspects station terminal ledger (`G1-TAB-04`, SIS Security contract `#GH-2026`, Supervisor shift key `RWA-SEC-G1`).
  3. Step 2: Executes Worker PIN Clearance drill: enters `4028`, tests universal gate entry clearance approval (zero boom barrier references).
  4. Step 3: Executes Emergency Supervisor Override drill: enters `7007`, tests force gate clearance override.
  5. Step 4: Executes QR scanner simulation, verifies scan confirmation.
  6. Completes onboarding and logs shift handover.

### Scenario S3: Resident Pass Setup & UPI Payroll Flow
- **Persona**: Flat Resident (B-402, Vikram Sharma) setting up domestic staff pass and direct payroll.
- **Path**:
  1. Switches to Resident view.
  2. Inspects pending candidate application for Evening Cook.
  3. Accepts application, generating provisioned PIN `5678` in society staff roster.
  4. Opens Liquid Glass UPI Payment modal for helper salary ₹14,000.
  5. Validates generated UPI URI (`upi://pay?pa=sunita.devi@okhdfcbank&pn=Sunita%20Devi&am=14000...`) and real ISO/IEC 18004 QR code SVG.
  6. Closes modal cleanly.

### Scenario S4: Footer About & Onboarding Guide Modal Walkthrough
- **Persona**: Resident or Society Committee Member seeking understanding of Karmyog Pass principles.
- **Path**:
  1. Navigates to Overview view.
  2. Scrolls to understated footer (`.beta-footer`).
  3. Clicks "About / उद्देश्य एवं ऑनबोर्डिंग गाइड" link.
  4. Verifies `#betaAboutModal` opens with society manifesto, de-corporatized gate clearance explanation, and zero boom-barrier jargon.
  5. Toggles language between Hindi and English; verifies modal text reactively translates.
  6. Closes modal cleanly.

---

## 5. Coverage & Quality Thresholds

| Metric | Threshold | Rationale |
|---|---|---|
| **Total Test Count** | >= 40 tests | Comprehensive multi-tier coverage of all 13 features |
| **Tier 1 Requirement Tests** | >= 5 tests per R1, R2, R3, R4 (>= 20 total) | Mandatory minimum defined in Project Specification |
| **Console Errors** | Exactly 0 | High-clarity client application must produce zero unhandled runtime exceptions |
| **Viewport Invariance** | 100% pass across 900px, 700px, 360px | Zero clipping, zero modal outer scrollbars, zero horizontal layout breakage |
| **QR Engine Integrity** | 100% pure JS (zero external script dependencies) | Cryptographic/mathematical independence and security |
| **Baseline Reporting** | Categorized PASS / FAIL | Clear documentation of pending features for implementation worker |

---
*End of Test Infrastructure Specification*
