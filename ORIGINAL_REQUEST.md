# Original User Request

## 2026-10-17T16:27:54Z

Overhaul and harden the Karmyog Pass Liquid Glass Beta (`index_beta.html`) to eliminate all artificial corporate assumptions (removing boom-barrier relays in favor of universal gate entry clearance, geofencing domestic staff opportunities strictly to campus flats, converting guard onboarding into an authorized physical gate terminal handover, and moving onboarding/purpose to an understated footer link), while resolving modal viewport clipping, drill feedback freezes, and gating loopholes.

Working directory: c:\Users\chand\Documents\antigravity\kind-einstein
Integrity mode: development
Requested team: Multi-agent craftsmanship swarm governed by Executive Secretary (/secretary) and verified under /humility

## Requirements

### R1. Grounding Domain Reality & De-Corporatization
- **Gate Entry Clearance (No Boom Barrier Assumption)**: Eliminate all assumptions of automated electronic "boom barriers" (`बूम बैरियर रिले`). Replace with universal gate entry clearance (`गेट प्रवेश अनुमति / Gate Clearance / Entry Approval`), supporting manual iron swing gates, wicket doors, or simple guard register sign-offs.
- **Physical Guard Station Terminal Handover**: Security guards do not sign up on the public internet. Guard onboarding represents an authorized physical station tablet handover (`Gate 1 Hardware Terminal G1-TAB-04`, SIS Security contract #GH-2026, Supervisor shift key `RWA-SEC-G1`, On-duty Guard: Bahadur Singh).
- **Hyper-Local Campus Geofencing**: Domestic workers (cooks, housekeepers, drivers) do not commute between distant metro areas. Constrain domestic opportunities strictly to Gulmohar Heights Society campus (Towers 1–4, 500m walking radius) with explicit flat numbers and walking distance markers.
- **Understated Footer Architecture**: Remove the oversized 3-column "Verification Hub" banner from `#view-overview`. Place an understated "About / उद्देश्य एवं ऑनबोर्डिंग गाइड" link in the footer that opens a clean modal.

### R2. Modal Ergonomics, Viewport Height & Zero-Clipping
- Redesign `.onboarding-modal` as a flex column container (`max-height: calc(100vh - 40px); overflow: hidden;`).
- Lock the header (close button `✕`, role tag, step title, and stepper bubbles) and footer controls at top and bottom (`flex-shrink: 0`).
- Compact the keypad and drill chamber (`mini-key`: 44px, compact paddings) so the entire modal fits comfortably within standard laptop and mobile viewports with zero header clipping and zero ugly outer scrollbars.

### R3. Drill State Machine & Reactive Validation Feedback
- Fix the silent freeze on mistyped codes (e.g. entering `7077` instead of `7007`): on 4 digits, if code mismatches, immediately trigger a red shake state (`🔴 अमान्य कोड / Invalid Code`), auto-clear after 600ms, and allow immediate retry without freezing.
- Enforce strict step gating: lock the "Next Step →" button (`disabled`, `pointer-events: none`, reduced opacity) until the step's verification drill is genuinely satisfied.

### R4. ISO/IEC 18004 QR & 100% Reactive Bilingual Integrity
- Preserve the genuine pure JS ISO/IEC 18004 QR generator engine.
- Maintain 100% reactive bilingual consistency across Hindi and English with zero hardcoded or untranslated strings.

## Acceptance Criteria

### Visual & Viewport Integrity
- [ ] No modal header clipping or outer modal window scrollbars on standard 900px or 700px viewport heights.
- [ ] Stepper track, role tag, and close button remain permanently visible.
- [ ] Zero horizontal overflow on 360px budget mobile.

### Verification & Drill Reliability
- [ ] Mistyping digits triggers a distinct red error state with auto-reset instead of a silent hang.
- [ ] "Next Step →" button is physically unclickable until the drill is successfully completed.
- [ ] Headless Chrome visual test passes with zero console errors.


## 2026-10-17T16:43:50Z

[USER SCOPE ENHANCEMENT]:
The user requested adding an active distance radius filter to the domestic jobs / opportunities section with the following tiers:
- 'Under 500m' (Default, shows legitimate intra-campus jobs: Gulmohar Heights Towers 1–4, Flats B-402, A-201, D-502, C-1104).
- '1–2 km'
- '3–5 km'
- '5–7 km'
- '7–10 km'

For the non-local tiers (> 500m), include satirical/dummy non-sensible listings as explicitly requested by the user:
e.g. 'Chhota Bheem\'s House' (1-2 km), 'Diddy\'s Daycare' (3-5 km), 'Epstein Temple' (5-7 km), 'Mountbatten Ruler Estate' (7-10 km), etc., with clear dummy/out-of-perimeter badges, proving the distance filter works while highlighting that domestic staff work within the society.

Ensure this filter and the dummy selections are included in the implementation and verified in the test suite.


## 2026-10-21T12:46:27Z

Execute a complete, surgical purge of all taxidermy sandbox theater from `c:\Users\chand\Documents\antigravity\kind-einstein\index_beta.html`, implement the clean 4-step mobile auth flow sketched by Krishiv, wire all 6 role-specific verifications (closing the unverified address loophole), and fix the deceased-guard pension absurdity.

Working directory: c:\Users\chand\Documents\antigravity\kind-einstein
Integrity mode: development

## Requirements

### R1. Pencil-Sketched 4-Step Mobile Auth Flow
Implement the exact 4-screen flow from Krishiv's notebook sketch:
- **Screen 1**: Front Door with `SIGN UP`, `LOGIN`, and optional 1-tap `Sign in with Google` for residents. Clean, uncluttered mobile typography, zero awkward bilingual parentheses in buttons.
- **Screen 2**: `Before we start... Who are you?` role selection grid with bespoke inline SVGs (House Helper, Guard, Resident, Independent Resident, Residential Admin, Other Enterprise).
- **Screen 3**: Dynamic role-specific `Verify` step:
  - House Helper: Phone Number or e-Shram UAN + 1-time SMS OTP simulation.
  - Security Guard: Station ID (`G1-TAB-04`) + Shift Key (`RWA-SEC-G1`).
  - Resident: Building Code (`GH-2026`) + Flat (`B-402`) + OTP.
  - Independent Resident: Electricity Meter CA Number (`MSEDCL-402819`) + Mobile OTP (closing the unverified address loophole).
  - Residential Admin: Society Registration (`BOM/HSG/2018`) + Master Passcode + 2FA toggle.
  - Other Enterprise: Vendor ID (`Blinkit`/`Urban Company`) + Order Ticket ID (`BK-9482`).
- **Screen 4**: Minimalist `Login Successful` checkmark animation (1.2s) smoothly transitioning into the active role dashboard. Persistent `← Switch Role / Logout` button in all role dashboards to return to Screen 1.

### R2. The Ruthless Purge of Taxidermy Sandbox Theater
Scrape all artificial, absurd sandbox features out of `index_beta.html`:
- **Nuke Drill Simulators**: Delete the 4-step modal simulators (`Step 1: Physical Station Tablet Handover`, `Step 4: Camera QR Scanner Simulator`, SIS Security contracts).
- **Nuke Havells Plumbing Lab**: Delete the hydraulic schematic, 4-building manifold, 2.1 Bar pressure telemetry, and Havells relays. A gate security pass does not manage water pumps.
- **Nuke Deceased-Guard Pension Bug**: Fix the UPI modal! Remove `स्व. बहादुर सिंह` (Bahadur Singh is alive at the gate). Point UPI transfers directly to the domestic worker (`Sunita Devi • sunita.devi@okhdfcbank`).
- **Nuke Council Mode & Solidarity Grid**: Delete "Lone Bahadur Mode", "Council Mode", "Ramu Late?", and fake loitering alarms.
- **Nuke Fake Chatbot**: Remove the auto-responder hotline that blindly echoes "Acknowledged, Bahadur".

### R3. Humorous & Grounded Job Roster (In-Perimeter & Out-of-Perimeter)
Patch `betaState.jobs` and `betaState.dummyJobs`:
- **In-Perimeter (< 500m)**:
  - Tower A, Flat A-101: Jethalal Gada's Jalebi-Fafda Early Morning Cook (07:00-08:30, ₹8,500/mo)
  - Tower B, Flat B-404: Bhide Master's Blackboard & Chalk Specialist (14:00-16:00, ₹5,000/mo)
  - Tower C, Flat C-702: Majnu Bhai's Live Canvas Duster (11:00-13:30, ₹9,000/mo)
  - Tower D, Flat D-1201: Munna Bhaiya's Carpet Vacuuming Specialist (17:00-19:00, ₹11,000/mo, "Zero questions asked about red stains")
- **Out-of-Perimeter (> 1km)**:
  - 1-2 km: Chhota Bheem's Royal Ladoo Taster (Dholakpur Palace, ₹12,000/mo)
  - 3-5 km: Antilia Helipad Seagull Shocker & Z-Security Chai Master (Altamount Road, ₹28,000/mo)
  - 5-7 km: Hogwarts Gryffindor Common Room Chimney Sweeper (₹35,000/mo)
  - 7-10 km: KGF Gold Mine Dust Cleaner (Rocky Bhai Den, ₹50,000/mo)

### R4. Visual & Responsive Integrity (Humility Check)
- Zero system emojis for icons: All icons must be bespoke inline geometric SVGs (`shape-rendering="geometricPrecision"`).
- Clean palette: Crisp white/slate canvas (`#F8FAFC` / `#FFFFFF`), slate ink (`#0F172A`), zero murky pond water.
- 360px Mobile-first verification: Tested with headless Chrome at 360x740 and 1200x900 viewports.
- Zero console errors and zero syntax errors during automated regression execution.

## Acceptance Criteria
- [ ] Automated headless test suite passes 100% with 0 console errors.
- [ ] All Havells plumbing schematics and drill simulator modals completely eradicated.
- [ ] UPI modal pays Sunita Devi, not `स्व. बहादुर सिंह`.
- [ ] Screen 1 (`SIGN UP` / `LOGIN`) renders with clean mobile spacing and zero dual-language text wrapping.
- [ ] Screen 2 (`Before we start... Who are you?`) dynamically lists all 6 roles with precision SVGs.
- [ ] Screen 3 validates inputs (including CA number for Independent Resident).
- [ ] Screen 4 transitions smoothly into the role dashboard.
- [ ] Screenshots captured and audited for 1200px desktop and 360px mobile views.


## 2026-10-21T13:15:02Z

What if we have to report something. Let's say a guard is seeing a Blinkit Driver delivering his package, open his buttcheeks, and start pooping on the gate entrance.
