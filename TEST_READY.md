# TEST READY: Comprehensive E2E Requirements Test Suite

**Author**: Test Writer 1 (`teamwork_preview_test_writer`)  
**Target Application**: `index_beta.html` (Karmyog Pass Liquid Glass Beta)  
**Test Harness Script**: `test_e2e_requirements.py`  
**Execution Environment**: Python 3.14 + Google Chrome Headless CLI (`C:\Program Files\Google\Chrome\Application\chrome.exe --headless=new`)  
**Date Published**: 2026-10-17T16:55:00Z  
**Status**: ACTIVE & PUBLISHED FOR MILESTONE M_IMPL / SENTINEL AUDIT

---

## 1. Test Suite Commands & Semantics

### Standard Execution Command (Strict Verification)
```powershell
python test_e2e_requirements.py
```
- **Exit Code 0**: 100% of all 39 tests across Tiers 1–4 pass with zero console errors. Used by Worker, Sentinel, and Orchestrator to confirm completion.
- **Exit Code 1**: Emits non-zero code if any requirement assertion fails or any console exception is detected.

### Baseline Defect Audit Command
```powershell
python test_e2e_requirements.py --baseline
```
- **Exit Code 0**: Audits and prints the complete inventory of passing and failing tests against unpatched code without aborting the process.

### Baseline Execution Benchmark (Current `index_beta.html`)
- **Total Tests**: 39
- **Passing Tests**: 22
- **Expected Baseline Failures (Pending Implementation)**: 17
- **Console Errors Detected**: 9 (due to pending implementation of `filterBetaJobsRadius` and `openBetaAboutModal` in DOM)

---

## 2. Multi-Tier Requirement Coverage Table

| Tier | Req ID | Feature ID | Test ID | Test Name & Target Invariant | Baseline Status |
|---|---|---|---|---|---|
| **Tier 1** | R1 | `F_DECORP_GATE` | `T1_R1_01` | Purge Boom Barrier Assumptions (zero `बूम बैरियर` / `boom barrier` mentions in DOM & templates) | **FAIL** (24 lingering) |
| **Tier 1** | R1 | `F_DECORP_GATE` | `T1_R1_02` | Universal Gate Clearance Terminology (status banner & toasts use Gate Clearance / प्रवेश अनुमति) | **FAIL** (Barrier Lifted in desc) |
| **Tier 1** | R1 | `F_GUARD_TERM` | `T1_R1_03` | Physical Station Tablet Handover (Step 1 displays Terminal `G1-TAB-04`, Contract `GH-2026`, Key `RWA-SEC-G1`, Bahadur Singh) | **FAIL** (Form lacks terminal ledger) |
| **Tier 1** | R1 | `F_DOM_GEOFENCE` | `T1_R1_04` | Hyper-Local Campus Geofencing Defaults (Intra-campus Towers 1–4, flats, 500m radius walking tags) | **FAIL** (Opportunities lack campus tags) |
| **Tier 1** | R1 | `F_DOM_GEOFENCE` | `T1_R1_05` | Distance Radius Filter Pills & Satirical Listings (1-2km: Chhota Bheem, 3-5km: Diddy, 5-7km: Epstein, 7-10km: Mountbatten) | **FAIL** (`filterBetaJobsRadius` missing) |
| **Tier 1** | R1 | `F_FOOTER_MODAL` | `T1_R1_06` | Understated Footer Architecture & `#betaAboutModal` (Verification Hub excised; footer link & modal exist) | **PASS** (Elements present) |
| **Tier 1** | R2 | `F_MODAL_FLEX` | `T1_R2_01` | Three-Tier Modal Flex Column Layout (`.onboarding-modal` `display: flex; flex-direction: column;`) | **PASS** |
| **Tier 1** | R2 | `F_MODAL_FLEX` | `T1_R2_02` | Locked Modal Header Controls (`flex-shrink: 0` on modal header container) | **FAIL** (`flexShrink=1`) |
| **Tier 1** | R2 | `F_MODAL_FLEX` | `T1_R2_03` | Locked Modal Footer Controls (`flex-shrink: 0` on modal footer container) | **FAIL** (`flexShrink=null`) |
| **Tier 1** | R2 | `F_MODAL_FLEX` | `T1_R2_04` | Scrollable Middle Body (`#onboardStepBody` has computed `overflow-y: auto`) | **PASS** |
| **Tier 1** | R2 | `F_MODAL_VIEWPORT` | `T1_R2_05` | Zero-Clipping & Scrollbar Elimination (`overflow: hidden; max-height: calc(100vh - 40px);`) | **PASS** |
| **Tier 1** | R2 | `F_KEYPAD_COMPACT` | `T1_R2_06` | Compact Keypad Dimensions (`.mini-key` bounding box <= 44px) | **PASS** |
| **Tier 1** | R3 | `F_STEP_GATING` | `T1_R3_01` | Worker Step 1 Gating Defense (`#btnOnboardNext` disabled/pointer-events:none on empty form) | **FAIL** (Next button ungated) |
| **Tier 1** | R3 | `F_STEP_GATING` | `T1_R3_02` | Worker Step 3 PIN Drill Gating (`#btnOnboardNext` disabled before 4028 satisfied) | **FAIL** (Next button ungated) |
| **Tier 1** | R3 | `F_STEP_GATING` | `T1_R3_03` | Guard Step 2 Keypad Gating (`#btnOnboardNext` disabled before 4028 entered) | **FAIL** (Next button ungated) |
| **Tier 1** | R3 | `F_DRILL_REACTIVE` | `T1_R3_04` | Mistyped PIN Red Error Feedback (Entering 7077 renders `🔴 अमान्य कोड` / `Invalid Code`) | **FAIL** (Silent freeze) |
| **Tier 1** | R3 | `F_DRILL_REACTIVE` | `T1_R3_05` | Drill Error Shake Class (`.drill-shake` / `.shake` attached on code mismatch) | **FAIL** (Shake class missing) |
| **Tier 1** | R3 | `F_DRILL_REACTIVE` | `T1_R3_06` | Drill Auto-Reset After 600ms (Input register clears without silent freeze) | **FAIL** (Buffer stuck) |
| **Tier 1** | R3 | `F_STEP_GATING` | `T1_R3_07` | Guard Step 3 Override Drill Gating (`#btnOnboardNext` disabled before 7007 satisfied) | **FAIL** (Next button ungated) |
| **Tier 1** | R4 | `F_QR_PRESERVE` | `T1_R4_01` | Pure JS ISO/IEC 18004 QR Engine (`viewBox="0 0 37 37"` vector SVG generation) | **PASS** |
| **Tier 1** | R4 | `F_QR_PRESERVE` | `T1_R4_02` | Zero External CDN Scripts (Zero `<script src="...">` tags in document) | **PASS** |
| **Tier 1** | R4 | `F_BILINGUAL_100` | `T1_R4_03` | Symmetrical Bilingual Dictionary (`betaTranslations.hi` and `en` 100% mirrored) | **PASS** |
| **Tier 1** | R4 | `F_BILINGUAL_100` | `T1_R4_04` | Modal Bilingual Attribute Parity (Modal nodes have translation attributes) | **PASS** |
| **Tier 1** | R4 | `F_BILINGUAL_100` | `T1_R4_05` | Reactive Modal Re-render on Language Switch (Translates open modal in-place) | **PASS** |
| **Tier 2** | BVA | `F_MODAL_VIEWPORT` | `T2_B1_700px_viewport` | 700px Viewport Height Modal Invariance (Modal fits, close button `✕` permanently visible) | **PASS** |
| **Tier 2** | BVA | `F_MODAL_VIEWPORT` | `T2_B2_900px_viewport` | 900px Viewport Centered Aesthetics (Modal centered horizontally and vertically) | **PASS** |
| **Tier 2** | BVA | `F_MODAL_VIEWPORT` | `T2_B3_360px_mobile` | 360px Mobile Zero Horizontal Overflow (`scrollWidth <= clientWidth + 1` across all 4 views) | **PASS** |
| **Tier 2** | Corner | `F_DRILL_REACTIVE` | `T2_B4_mistyped_pin` | Mistyped PIN Immediate Rejection (Code 7077 leaves `verified: false`) | **PASS** |
| **Tier 2** | Corner | `F_DRILL_REACTIVE` | `T2_B5_auto_reset` | 600ms Auto-Reset Buffer Recovery (Guard keypad buffer clears after error) | **FAIL** (Buffer stuck) |
| **Tier 2** | Boundary | `F_DRILL_REACTIVE` | `T2_B6_rapid_clicks` | Rapid Key Clicks Buffer Overflow Defense (Buffer clamped to max 4 digits) | **PASS** |
| **Tier 2** | Defense | `F_STEP_GATING` | `T2_B7_step_advance_defense` | Empty Input Step Advance Defense (`nextOnboardingStep()` blocked on incomplete step) | **FAIL** (Step advances) |
| **Tier 3** | Cross | `F_BILINGUAL_100` | `T3_C1_lang_toggle_modal_open` | Language Toggle While Modal Open (Step 2 preserved while content translates) | **PASS** |
| **Tier 3** | Cross | `F_DRILL_REACTIVE` | `T3_C2_error_then_valid_then_lang` | Drill Error -> Valid Entry -> Language Toggle (Verified state preserved) | **PASS** |
| **Tier 3** | Cross | `F_GUARD_TERM` | `T3_C3_guard_handover_drill_sequence` | Guard Terminal Handover to QR Drill Sequence (Sequential step progression) | **PASS** |
| **Tier 3** | Cross | `F_DOM_GEOFENCE` | `T3_C4_radius_filter_bilingual` | Distance Radius Filter Across Language Switch (Selected filter preserved bilingually) | **PASS** |
| **Tier 4** | Scenario | All | `T4_S1_worker_journey` | Scenario 1: Complete Worker Onboarding Journey (Cook Sunita Devi) | **PASS** |
| **Tier 4** | Scenario | All | `T4_S2_guard_journey` | Scenario 2: Guard Tablet Handover & Emergency Override (Bahadur Singh) | **PASS** |
| **Tier 4** | Scenario | All | `T4_S3_resident_upi_journey` | Scenario 3: Resident Application Acceptance & UPI Payroll | **PASS** |
| **Tier 4** | Scenario | All | `T4_S4_about_modal_walkthrough` | Scenario 4: Footer About & Onboarding Guide Walkthrough | **FAIL** (`openBetaAboutModal` missing) |

---

## 3. Implementation Defect Remediation Instructions (For Worker 1)

To transition all 17 failing tests to PASS:
1. **R1 De-Corporatization**: Replace all lingering occurrences of `बूम बैरियर` / `boom barrier` with `गेट प्रवेश अनुमति / Gate Clearance / Entry Approval` across template strings, toasts, and status descriptions.
2. **R1 Station Tablet Handover**: Refactor Guard Onboarding Step 1 to render the authorized station tablet ledger (`Gate 1 Hardware Terminal G1-TAB-04`, SIS Security contract `#GH-2026`, Supervisor shift key `RWA-SEC-G1`, and on-duty guard `Bahadur Singh`).
3. **R1 Domestic Campus Geofencing & Filters**: Implement `filterBetaJobsRadius(radius)` and populate opportunities with campus towers (T1-T4, 50m-420m) for `<500m`, and satirical listings with out-of-perimeter badges for `1-2km`, `3-5km`, `5-7km`, `7-10km`.
4. **R1 Footer About Modal**: Define `openBetaAboutModal()` and `closeBetaAboutModal()` to toggle `#betaAboutModal` display.
5. **R2 Modal Flex Locking**: Add `flex-shrink: 0;` to `.stepper-header-box` and `.stepper-nav`.
6. **R3 Step Gating**: Implement `isCurrentOnboardingStepValid()` and lock `#btnOnboardNext` (`disabled`, `pointer-events: none`, opacity 0.42) until drill criteria are met; guard `nextOnboardingStep()`.
7. **R3 Drill State Machine**: In `pressOnboardPinDrill`, `pressGuardKeypadDrill`, `pressGuardOverrideDrill`: on entering 4 digits mismatching target, attach `.drill-shake`, set banner to `🔴 अमान्य कोड / Invalid Code`, wait 600ms via `setTimeout`, clear input register, and re-render.

---
*End of TEST_READY.md*
