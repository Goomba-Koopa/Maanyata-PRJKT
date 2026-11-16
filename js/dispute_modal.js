/**
 * js/dispute_modal.js — Project Maanyata (मान्यता)
 *
 * Modular, self-contained UI modal for logging a formal contract dispute
 * under the Verified Trust & Anti-Spite Protocol.
 *
 * Statutory & Architectural Invariants:
 *  - Zero-Custody Architecture: Project Maanyata never holds, routes, or simulates funds.
 *  - Administrative Investigation Escrow: Documented offline at Housing Society / Police level.
 *  - Anti-Spite Forfeiture Warning: Frivolous/false claims forfeit ₹2,000.00 directly to the worker as compensatory restitution, and ₹500.00 administrative review fee.
 *  - Dual-Jurisdiction Logging: Police Station NC Number and/or Housing Society Committee Reference.
 *  - Immutable Local Audit Trail: Timestamped record logged in localStorage ('maanyata_disputes_audit').
 *  - 100% Bilingual (English & Hindi) with zero emojis (Lucide SVGs only).
 */
(function (global) {
  "use strict";

  let activeContractData = null;
  let activeCallback = null;

  const MODAL_ID = "maanyataDisputeModalOverlay";

  const I18N = {
    en: {
      title: "Formal Contract Dispute Lodging",
      alertTitle: "Warning: Frivolous Claim Forfeiture Rule",
      alertBody: "Under Maanyata Verified Trust Protocol, lodging a formal dispute requires an investigation escrow deposit of <strong>₹2,500.00</strong>. If statutory review or committee inquiry determines this claim to be frivolous, retaliatory, or false, <strong>₹2,000.00 forfeits directly to the worker</strong> as compensatory restitution, and <strong>₹500.00</strong> is retained as administrative review fee.",
      contractIdLabel: "Contract ID",
      workerLabel: "Respondent Worker",
      groundLabel: "Ground of Dispute",
      reasons: {
        UNANNOUNCED_ABANDONMENT: "Unannounced Absence / Service Abandonment (>48h)",
        MATERIAL_DAMAGE: "Material Damage or Property Misappropriation",
        SAFETY_BREACH: "Security / Premises Safety Rule Breach",
        SCOPE_DISAGREEMENT: "Scope of Work Disagreement",
        WAGE_WITHHOLDING: "Wage / Compensation Disagreement",
        HARASSMENT_RETALIATION: "Harassment or Hostile Work Conditions"
      },
      statementLabel: "Factual Statement (Evidence-Based)",
      statementPlaceholder: "Detail specific dates, incident timeline, and factual grounds. Abusive or defamatory language is strictly rejected.",
      policeNcLabel: "Police Station NC Number (Optional with Society Ref)",
      policeNcPlaceholder: "e.g. NC/4821/2026 or GD-102",
      stationLabel: "Jurisdiction Station Name",
      stationPlaceholder: "e.g. Mira Road Police Station",
      societyRefLabel: "Housing Society Committee Ref (Optional with NC)",
      societyRefPlaceholder: "e.g. SWA-MC/2026/044 or Managing Committee Diary",
      escrowSub: "Statutory Investigation Escrow (Admin Held)",
      escrowNotice: "Zero-Custody Architecture: Project Maanyata never holds client funds. The ₹2,500 dispute escrow is documented in physical or ledger trust by your Housing Society Management Committee or Escrow Trustee during verification.",
      auditAck: "I confirm this dispute is lodged with factual evidence and will be arbitrated by the RWA Committee or Police authorities.",
      statusPending: "Audit Pending: Documentation & Confirmation Required",
      statusReady: "✓ Audit Record Ready for Logging",
      cancelBtn: "Cancel",
      submitBtn: "Lodge Formal Dispute",
      recording: "Recording Dispute...",
      successMsg: (cId, ref) => `Formal administrative dispute recorded under Contract ID ${cId}.\nAudit Reference: ${ref}\nLogged to local audit register for committee review.`
    },
    hi: {
      title: "प्रशासनिक अनुबंध विवाद पंजीकरण",
      alertTitle: "चेतावनी: दुर्भावनापूर्ण शिकायत पर जब्ती नियम",
      alertBody: "मान्यता सत्यापित ट्रस्ट प्रोटोकॉल के अंतर्गत औपचारिक विवाद दर्ज करने हेतु <strong>₹2,500.00</strong> का जांच एस्क्रो अनिवार्य है। यदि समिति या जांच में यह शिकायत झूठी अथवा प्रतिशोधात्मक पाई जाती है, तो <strong>₹2,000.00 forfeits directly to the worker</strong> (सीधे कामगार को क्षतिपूर्ति के रूप में मिलेंगे), तथा <strong>₹500.00</strong> प्रशासनिक समीक्षा शुल्क के रूप में रखे जाएंगे।",
      contractIdLabel: "अनुबंध पहचान (Contract ID)",
      workerLabel: "प्रतिवादी कामगार",
      groundLabel: "विवाद का आधार",
      reasons: {
        UNANNOUNCED_ABANDONMENT: "बिना सूचना अनुपस्थिति / सेवा परित्याग (>48 घंटे)",
        MATERIAL_DAMAGE: "सामग्री क्षति अथवा संपत्ति का अनुचित उपयोग",
        SAFETY_BREACH: "सुरक्षा / परिसर नियमों का उल्लंघन",
        SCOPE_DISAGREEMENT: "कार्य विवरण एवं दायरे पर असहमति",
        WAGE_WITHHOLDING: "वेतन अथवा भुगतान संबंधी असहमति",
        HARASSMENT_RETALIATION: "उत्पीड़न अथवा अनुचित व्यवहार"
      },
      statementLabel: "तथ्यात्मक विवरण (साक्ष्य आधारित)",
      statementPlaceholder: "विशिष्ट तिथियां, घटनाक्रम और तथ्यात्मक विवरण लिखें। अपमानजनक भाषा पूर्णतः अस्वीकृत है।",
      policeNcLabel: "Police Station NC Number (पुलिस स्टेशन NC नंबर)",
      policeNcPlaceholder: "उदा. NC/4821/2026 या GD-102",
      stationLabel: "Jurisdiction Station Name (संबंधित थाना क्षेत्र)",
      stationPlaceholder: "उदा. मीरा रोड पुलिस स्टेशन",
      societyRefLabel: "Housing Society Committee Ref (सोसायटी शिकायत संदर्भ)",
      societyRefPlaceholder: "उदा. SWA-MC/2026/044 या प्रबंध समिति डायरी",
      escrowSub: "वैधानिक जांच एस्क्रो (प्रशासनिक ट्रस्ट)",
      escrowNotice: "शून्य-कस्टडी सिद्धांत: प्रोजेक्ट मान्यता कभी भी धनराशि नहीं रखता। ₹2,500 का विवाद एस्क्रो आपकी हाउसिंग सोसायटी प्रबंधन समिति या मध्यस्थ के पास ऑफ़लाइन दर्ज रहता है।",
      auditAck: "मैं पुष्टि करता/करती हूँ कि यह विवाद तथ्यात्मक साक्ष्य पर आधारित है और RWA समिति अथवा पुलिस प्राधिकरण द्वारा समीक्षाधीन रहेगा।",
      statusPending: "ऑडिट लंबित: आवश्यक जानकारी एवं पुष्टि अनिवार्य",
      statusReady: "✓ प्रशासनिक ऑडिट पंजीकरण हेतु तैयार",
      cancelBtn: "रद्द करें",
      submitBtn: "औपचारिक विवाद दर्ज करें",
      recording: "विवाद दर्ज किया जा रहा है...",
      successMsg: (cId, ref) => `अनुबंध ID ${cId} के अंतर्गत औपचारिक विवाद दर्ज किया गया।\nऑडिट संदर्भ: ${ref}\nस्थानीय प्रशासनिक रजिस्टर में सुरक्षित।`
    }
  };

  function getCurrentLang() {
    try {
      if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem("mny_lang");
        if (stored === "hi") return "hi";
      }
      if (typeof document !== "undefined" && document.documentElement.getAttribute("lang") === "hi") {
        return "hi";
      }
    } catch (e) {}
    return "en";
  }

  function injectStylesIfNeeded() {
    if (typeof document === "undefined") return;
    if (document.getElementById("maanyataDisputeModalStyles")) return;
    const style = document.createElement("style");
    style.id = "maanyataDisputeModalStyles";
    style.textContent = `
      .mny-dispute-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(4px);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #1E293B;
      }
      .mny-dispute-overlay.is-visible {
        display: flex;
      }
      .mny-dispute-card {
        background: #FFFFFF;
        border-radius: 12px;
        width: 100%;
        max-width: 560px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        border: 1px solid #CBD5E1;
      }
      .mny-dispute-header {
        background: #0F172A;
        color: #F8FAFC;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #C2410C;
      }
      .mny-dispute-title {
        font-size: 15px;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .mny-dispute-close {
        background: transparent;
        border: none;
        color: #94A3B8;
        font-size: 24px;
        cursor: pointer;
        padding: 0 8px;
        line-height: 1;
        min-height: 44px;
        min-width: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .mny-dispute-close:hover {
        color: #FFFFFF;
      }
      .mny-dispute-body {
        padding: 20px;
      }
      .mny-dispute-alert {
        background: #FEF2F2;
        border: 1px solid #FCA5A5;
        border-left: 4px solid #B91C1C;
        border-radius: 6px;
        padding: 12px 14px;
        margin-bottom: 16px;
        font-size: 13px;
        line-height: 1.45;
        color: #991B1B;
      }
      .mny-dispute-alert-title {
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .mny-dispute-row {
        margin-bottom: 14px;
      }
      .mny-dispute-label {
        display: block;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #475569;
        margin-bottom: 5px;
      }
      .mny-dispute-static {
        background: #F1F5F9;
        padding: 10px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #334155;
        border: 1px solid #E2E8F0;
        font-family: ui-monospace, SFMono-Regular, monospace;
      }
      .mny-dispute-input, .mny-dispute-select, .mny-dispute-textarea {
        width: 100%;
        padding: 10px 12px;
        border-radius: 6px;
        border: 1px solid #CBD5E1;
        font-size: 16px;
        color: #0F172A;
        background: #FFFFFF;
        box-sizing: border-box;
        font-family: inherit;
      }
      .mny-dispute-input:focus, .mny-dispute-select:focus, .mny-dispute-textarea:focus {
        outline: none;
        border-color: #C2410C;
        box-shadow: 0 0 0 2px rgba(194, 65, 12, 0.2);
      }
      .mny-dispute-textarea {
        min-height: 76px;
        resize: vertical;
      }
      .mny-dispute-escrow-box {
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 14px;
        margin-top: 14px;
        margin-bottom: 16px;
      }
      .mny-dispute-escrow-amount {
        font-size: 20px;
        font-weight: 800;
        color: #0F172A;
        display: flex;
        align-items: baseline;
        gap: 6px;
      }
      .mny-dispute-escrow-sub {
        font-size: 12px;
        color: #64748B;
        font-weight: normal;
      }
      .mny-dispute-status-pill {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .mny-status-pending {
        background: #FEF3C7;
        color: #92400E;
        border: 1px solid #FCD34D;
      }
      .mny-status-locked {
        background: #DCFCE7;
        color: #166534;
        border: 1px solid #86EFAC;
      }
      .mny-dispute-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      .mny-dispute-submit {
        flex: 1;
        background: #C2410C;
        color: #FFFFFF;
        font-weight: 700;
        font-size: 14px;
        padding: 12px;
        min-height: 44px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        transition: background 0.15s ease;
      }
      .mny-dispute-submit:hover:not(:disabled) {
        background: #9A3412;
      }
      .mny-dispute-submit:disabled {
        background: #94A3B8;
        cursor: not-allowed;
      }
      .mny-dispute-cancel {
        background: #FFFFFF;
        color: #475569;
        font-weight: 600;
        font-size: 14px;
        padding: 12px 18px;
        min-height: 44px;
        border-radius: 6px;
        border: 1px solid #CBD5E1;
        cursor: pointer;
      }
      .mny-dispute-cancel:hover {
        background: #F8FAFC;
      }
    `;
    document.head.appendChild(style);
  }

  function getModalElement() {
    let el = document.getElementById(MODAL_ID);
    if (!el) {
      injectStylesIfNeeded();
      el = document.createElement("div");
      el.id = MODAL_ID;
      el.className = "mny-dispute-overlay";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-labelledby", "mnyDisputeTitle");

      el.innerHTML = `
        <div class="mny-dispute-card">
          <div class="mny-dispute-header">
            <h2 class="mny-dispute-title" id="mnyDisputeTitle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M3.6 9h16.8L12 2 3.6 9z"/></svg>
              <span id="mnyDisputeTitleText">Formal Contract Dispute Lodging</span>
            </h2>
            <button type="button" class="mny-dispute-close" id="mnyDisputeCloseBtn" aria-label="Close dialog">&times;</button>
          </div>

          <div class="mny-dispute-body">
            <!-- Statutory Warning -->
            <div class="mny-dispute-alert">
              <div class="mny-dispute-alert-title" id="mnyDispAlertTitle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Warning: Frivolous Claim Forfeiture Rule
              </div>
              <div id="mnyDispAlertBody">
                Under Maanyata Verified Trust Protocol, lodging a formal dispute requires an investigation escrow deposit of <strong>₹2,500.00</strong>.
                If statutory review or committee inquiry determines this claim to be frivolous, retaliatory, or false, <strong>₹2,000.00 forfeits directly to the worker</strong> as compensatory restitution, and <strong>₹500.00</strong> is retained as administrative review fee.
              </div>
            </div>

            <!-- Contract & Worker Identifiers -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
              <div>
                <label class="mny-dispute-label" id="mnyDispContractIdLabel">Contract ID</label>
                <div class="mny-dispute-static" id="mnyDispContractId">—</div>
              </div>
              <div>
                <label class="mny-dispute-label" id="mnyDispWorkerLabel">Respondent Worker</label>
                <div class="mny-dispute-static" id="mnyDispWorkerName">—</div>
              </div>
            </div>

            <!-- Dispute Category -->
            <div class="mny-dispute-row">
              <label class="mny-dispute-label" for="mnyDispCategory" id="mnyDispGroundLabel">Ground of Dispute</label>
              <select id="mnyDispCategory" class="mny-dispute-select">
                <option value="UNANNOUNCED_ABANDONMENT">Unannounced Absence / Service Abandonment (>48h)</option>
                <option value="MATERIAL_DAMAGE">Material Damage or Property Misappropriation</option>
                <option value="SAFETY_BREACH">Security / Premises Safety Rule Breach</option>
                <option value="SCOPE_DISAGREEMENT">Scope of Work Disagreement</option>
                <option value="WAGE_WITHHOLDING">Wage / Compensation Disagreement</option>
                <option value="HARASSMENT_RETALIATION">Harassment or Hostile Work Conditions</option>
              </select>
            </div>

            <!-- Factual Narrative -->
            <div class="mny-dispute-row">
              <label class="mny-dispute-label" for="mnyDispReason" id="mnyDispStatementLabel">Factual Statement (Evidence-Based)</label>
              <textarea id="mnyDispReason" class="mny-dispute-textarea" placeholder="Detail specific dates, incident timeline, and factual grounds. Abusive or defamatory language is strictly rejected."></textarea>
            </div>

            <!-- Police NC & Station -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
              <div>
                <label class="mny-dispute-label" for="mnyDispPoliceNc" id="mnyDispPoliceNcLabel">Police Station NC Number</label>
                <input type="text" id="mnyDispPoliceNc" class="mny-dispute-input" placeholder="e.g. NC/4821/2026 or GD-102">
              </div>
              <div>
                <label class="mny-dispute-label" for="mnyDispStationName" id="mnyDispStationLabel">Jurisdiction Station Name</label>
                <input type="text" id="mnyDispStationName" class="mny-dispute-input" placeholder="e.g. Mira Road Police Station">
              </div>
            </div>

            <!-- Housing Society Committee Reference -->
            <div class="mny-dispute-row">
              <label class="mny-dispute-label" for="mnyDispSocietyRef" id="mnyDispSocietyRefLabel">Housing Society Committee Complaint Ref</label>
              <input type="text" id="mnyDispSocietyRef" class="mny-dispute-input" placeholder="e.g. SWA-MC/2026/044 or Managing Committee Diary">
            </div>

            <!-- Administrative Escrow & Zero-Custody Section -->
            <div class="mny-dispute-escrow-box">
              <div class="mny-dispute-escrow-amount">
                <span>₹2,500.00</span>
                <span class="mny-dispute-escrow-sub" id="mnyDispEscrowSub">Statutory Investigation Escrow</span>
              </div>
              <p id="mnyDispEscrowNotice" style="font-size: 12px; color: #475569; margin: 6px 0 10px; line-height: 1.45;">
                Zero-Custody Guarantee: Project Maanyata never holds client funds. The ₹2,500 dispute escrow is documented in physical or ledger trust by your Housing Society Management Committee or Escrow Trustee during verification.
              </p>
              <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #334155; cursor: pointer; user-select: none;">
                <input type="checkbox" id="mnyDispAckCheckbox" style="margin-top: 2px; width: 18px; height: 18px; accent-color: #C2410C;">
                <span id="mnyDispAckText">I confirm this dispute is lodged with factual evidence and will be arbitrated by the RWA Committee or Police authorities.</span>
              </label>
              <div id="mnyDispAuditStatus" class="mny-dispute-status-pill mny-status-pending" style="margin-top: 10px;">
                Audit Pending: Documentation & Confirmation Required
              </div>
            </div>

            <!-- Actions -->
            <div class="mny-dispute-actions">
              <button type="button" class="mny-dispute-cancel" id="mnyDispCancelBtn">Cancel</button>
              <button type="button" class="mny-dispute-submit" id="mnyDispSubmitBtn" disabled>
                Lodge Formal Dispute
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(el);
      setupEventListeners(el);
    }
    return el;
  }

  function applyLocalization(el) {
    const lang = getCurrentLang();
    const d = I18N[lang] || I18N.en;

    const titleText = el.querySelector("#mnyDisputeTitleText");
    if (titleText) titleText.textContent = d.title;

    const alertTitle = el.querySelector("#mnyDispAlertTitle");
    if (alertTitle) {
      alertTitle.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        ${d.alertTitle}
      `;
    }

    const alertBody = el.querySelector("#mnyDispAlertBody");
    if (alertBody) alertBody.innerHTML = d.alertBody;

    const cIdLbl = el.querySelector("#mnyDispContractIdLabel");
    if (cIdLbl) cIdLbl.textContent = d.contractIdLabel;

    const wLbl = el.querySelector("#mnyDispWorkerLabel");
    if (wLbl) wLbl.textContent = d.workerLabel;

    const gLbl = el.querySelector("#mnyDispGroundLabel");
    if (gLbl) gLbl.textContent = d.groundLabel;

    const stmtLbl = el.querySelector("#mnyDispStatementLabel");
    if (stmtLbl) stmtLbl.textContent = d.statementLabel;

    const reasonInput = el.querySelector("#mnyDispReason");
    if (reasonInput) reasonInput.placeholder = d.statementPlaceholder;

    const ncLbl = el.querySelector("#mnyDispPoliceNcLabel");
    if (ncLbl) ncLbl.textContent = d.policeNcLabel;

    const ncInput = el.querySelector("#mnyDispPoliceNc");
    if (ncInput) ncInput.placeholder = d.policeNcPlaceholder;

    const stnLbl = el.querySelector("#mnyDispStationLabel");
    if (stnLbl) stnLbl.textContent = d.stationLabel;

    const stnInput = el.querySelector("#mnyDispStationName");
    if (stnInput) stnInput.placeholder = d.stationPlaceholder;

    const socLbl = el.querySelector("#mnyDispSocietyRefLabel");
    if (socLbl) socLbl.textContent = d.societyRefLabel;

    const socInput = el.querySelector("#mnyDispSocietyRef");
    if (socInput) socInput.placeholder = d.societyRefPlaceholder;

    const escSub = el.querySelector("#mnyDispEscrowSub");
    if (escSub) escSub.textContent = d.escrowSub;

    const escNotice = el.querySelector("#mnyDispEscrowNotice");
    if (escNotice) escNotice.textContent = d.escrowNotice;

    const ackTxt = el.querySelector("#mnyDispAckText");
    if (ackTxt) ackTxt.textContent = d.auditAck;

    const cancelBtn = el.querySelector("#mnyDispCancelBtn");
    if (cancelBtn) cancelBtn.textContent = d.cancelBtn;

    const submitBtn = el.querySelector("#mnyDispSubmitBtn");
    if (submitBtn && !submitBtn.disabled) submitBtn.textContent = d.submitBtn;

    // Update categories
    const catSelect = el.querySelector("#mnyDispCategory");
    if (catSelect) {
      Array.from(catSelect.options).forEach(opt => {
        if (d.reasons[opt.value]) {
          opt.textContent = d.reasons[opt.value];
        }
      });
    }
  }

  function setupEventListeners(el) {
    const closeBtn = el.querySelector("#mnyDisputeCloseBtn");
    const cancelBtn = el.querySelector("#mnyDispCancelBtn");
    const submitBtn = el.querySelector("#mnyDispSubmitBtn");
    const ncInput = el.querySelector("#mnyDispPoliceNc");
    const stationInput = el.querySelector("#mnyDispStationName");
    const societyRefInput = el.querySelector("#mnyDispSocietyRef");
    const reasonInput = el.querySelector("#mnyDispReason");
    const ackCheckbox = el.querySelector("#mnyDispAckCheckbox");
    const statusEl = el.querySelector("#mnyDispAuditStatus");

    function validateForm() {
      const hasNc = !!ncInput.value.trim();
      const hasStation = !!stationInput.value.trim();
      const hasSocRef = !!societyRefInput.value.trim();
      const hasRef = hasSocRef || (hasNc && hasStation) || hasNc;
      const hasReason = reasonInput.value.trim().length >= 10;
      const isAcked = ackCheckbox.checked;

      const isValid = hasRef && hasReason && isAcked;
      submitBtn.disabled = !isValid;

      const lang = getCurrentLang();
      const d = I18N[lang] || I18N.en;

      if (isValid) {
        statusEl.className = "mny-dispute-status-pill mny-status-locked";
        statusEl.textContent = d.statusReady;
      } else {
        statusEl.className = "mny-dispute-status-pill mny-status-pending";
        statusEl.textContent = d.statusPending;
      }
    }

    closeBtn.addEventListener("click", () => DisputeModal.close());
    cancelBtn.addEventListener("click", () => DisputeModal.close());

    ncInput.addEventListener("input", validateForm);
    stationInput.addEventListener("input", validateForm);
    societyRefInput.addEventListener("input", validateForm);
    reasonInput.addEventListener("input", validateForm);
    ackCheckbox.addEventListener("change", validateForm);

    submitBtn.addEventListener("click", async () => {
      if (!activeContractData) return;
      const lang = getCurrentLang();
      const d = I18N[lang] || I18N.en;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = d.recording;

        const reason = reasonInput.value.trim();
        const category = el.querySelector("#mnyDispCategory").value;
        const fullReason = `[${category}] ${reason}`;
        const ncNumber = ncInput.value.trim();
        const stationName = stationInput.value.trim();
        const societyRef = societyRefInput.value.trim();

        // 1. Generate immutable local administrative audit record
        const auditId = `DISP-AUDIT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const auditEntry = {
          auditId,
          contractId: activeContractData.contractId,
          workerName: activeContractData.workerName,
          workerId: activeContractData.workerId,
          category,
          reason: fullReason,
          policeNcNumber: ncNumber || null,
          stationName: stationName || null,
          societyRef: societyRef || null,
          escrowDocumented: 2500,
          disputeStatus: "LODGED_PENDING_ADMIN_REVIEW",
          timestamp: new Date().toISOString()
        };

        try {
          if (typeof localStorage !== "undefined") {
            const rawAudit = localStorage.getItem("maanyata_disputes_audit");
            const auditList = rawAudit ? JSON.parse(rawAudit) : [];
            auditList.push(auditEntry);
            localStorage.setItem("maanyata_disputes_audit", JSON.stringify(auditList));
          }
        } catch (e) {
          console.warn("Could not write dispute audit to localStorage:", e);
        }

        // 2. Commit to store state
        const store = (typeof MaanyataStore !== "undefined")
          ? MaanyataStore
          : (global.MaanyataStore || (typeof window !== "undefined" ? window.MaanyataStore : null));

        let updated = null;
        if (store && store.initiateDispute) {
          updated = await store.initiateDispute({
            contractId: activeContractData.contractId,
            reason: fullReason,
            escrowAmount: 2500,
            policeNcNumber: ncNumber || (societyRef ? `SOC:${societyRef}` : "ADMIN-PENDING"),
            stationName: stationName || (societyRef ? "Housing Society Management Committee" : "Local Jurisdiction Review"),
            societyRef: societyRef || null
          });
        }

        if (typeof activeCallback === "function") {
          activeCallback(updated || auditEntry);
        }

        DisputeModal.close();
        if (typeof global.alert === "function") {
          global.alert(d.successMsg(activeContractData.contractId, auditId));
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = d.submitBtn;
        if (typeof global.alert === "function") {
          global.alert("Error recording dispute: " + err.message);
        }
      }
    });
  }

  const DisputeModal = {
    open({ contractId, workerName = "Attested Worker", workerId = "", onSubmitted } = {}) {
      if (typeof document === "undefined") return;
      activeContractData = { contractId, workerName, workerId };
      activeCallback = onSubmitted;

      const el = getModalElement();
      applyLocalization(el);

      el.querySelector("#mnyDispContractId").textContent = contractId || "c-demo-default";
      el.querySelector("#mnyDispWorkerName").textContent = `${workerName} (${workerId || "ID verified"})`;
      el.querySelector("#mnyDispReason").value = "";
      el.querySelector("#mnyDispPoliceNc").value = "";
      el.querySelector("#mnyDispStationName").value = "";
      el.querySelector("#mnyDispSocietyRef").value = "";
      el.querySelector("#mnyDispAckCheckbox").checked = false;

      const lang = getCurrentLang();
      const d = I18N[lang] || I18N.en;

      const statusEl = el.querySelector("#mnyDispAuditStatus");
      statusEl.className = "mny-dispute-status-pill mny-status-pending";
      statusEl.textContent = d.statusPending;

      const submitBtn = el.querySelector("#mnyDispSubmitBtn");
      submitBtn.disabled = true;
      submitBtn.textContent = d.submitBtn;

      el.classList.add("is-visible");
    },
    close() {
      if (typeof document === "undefined") return;
      const el = document.getElementById(MODAL_ID);
      if (el) el.classList.remove("is-visible");
      activeContractData = null;
      activeCallback = null;
    },
    getAuditLog() {
      try {
        if (typeof localStorage !== "undefined") {
          const raw = localStorage.getItem("maanyata_disputes_audit");
          return raw ? JSON.parse(raw) : [];
        }
      } catch (e) {}
      return [];
    }
  };

  global.DisputeModal = DisputeModal;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = DisputeModal;
  }
})(typeof window !== "undefined" ? window : globalThis);
