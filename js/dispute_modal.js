/**
 * js/dispute_modal.js — Project Maanyata (मान्यता)
 *
 * Modular, self-contained UI modal for logging a formal contract dispute
 * under the Bonded Trust & Anti-Spite Protocol.
 *
 * Statutory Invariants:
 *  - Mandatory ₹2,500 Investigation Escrow deposit.
 *  - Anti-Spite Forfeiture Warning: Frivolous/false claims forfeit ₹2,000 to the worker and ₹500 fee.
 *  - Mandatory Police Station NC / General Diary Number and Jurisdiction Station Name.
 *  - Simulated UPI Escrow deposit trigger (upi://pay...).
 *  - Cold, neutral system language (zero preachy/activist wording).
 */
(function (global) {
  "use strict";

  let activeContractData = null;
  let activeCallback = null;
  let escrowConfirmed = false;

  const MODAL_ID = "maanyataDisputeModalOverlay";

  function injectStylesIfNeeded() {
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
        max-width: 540px;
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
        font-size: 20px;
        cursor: pointer;
        padding: 0 4px;
        line-height: 1;
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
        padding: 8px 12px;
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
        font-size: 14px;
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
        min-height: 72px;
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
      .mny-dispute-btn-upi {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #15803D;
        color: #FFFFFF;
        font-weight: 700;
        font-size: 13px;
        padding: 10px 14px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        margin-top: 10px;
        width: 100%;
      }
      .mny-dispute-btn-upi:hover {
        background: #166534;
      }
      .mny-dispute-status-pill {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        margin-top: 8px;
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
        border-radius: 6px;
        border: none;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 0.04em;
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
              Formal Contract Dispute Lodging
            </h2>
            <button type="button" class="mny-dispute-close" id="mnyDisputeCloseBtn" aria-label="Close dialog">&times;</button>
          </div>

          <div class="mny-dispute-body">
            <!-- Statutory Warning -->
            <div class="mny-dispute-alert">
              <div class="mny-dispute-alert-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Warning: Frivolous Claim Forfeiture Rule
              </div>
              Under Maanyata Bonded Trust Protocol, lodging a formal dispute requires an investigation escrow deposit of <strong>₹2,500.00</strong>.
              If statutory review or committee inquiry determines this claim to be frivolous, retaliatory, or false, <strong>₹2,000.00 forfeits directly to the worker</strong> as compensatory restitution, and <strong>₹500.00</strong> is retained as administrative review fee.
            </div>

            <!-- Contract & Worker Identifiers -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
              <div>
                <label class="mny-dispute-label">Contract ID</label>
                <div class="mny-dispute-static" id="mnyDispContractId">—</div>
              </div>
              <div>
                <label class="mny-dispute-label">Respondent Worker</label>
                <div class="mny-dispute-static" id="mnyDispWorkerName">—</div>
              </div>
            </div>

            <!-- Dispute Category -->
            <div class="mny-dispute-row">
              <label class="mny-dispute-label" for="mnyDispCategory">Ground of Dispute</label>
              <select id="mnyDispCategory" class="mny-dispute-select">
                <option value="UNANNOUNCED_ABANDONMENT">Unannounced Absence / Service Abandonment (>48h)</option>
                <option value="MATERIAL_DAMAGE">Material Damage or Property Misappropriation</option>
                <option value="SAFETY_BREACH">Security / Premises Safety Rule Breach</option>
                <option value="SCOPE_DISAGREEMENT">Scope of Work Disagreement</option>
              </select>
            </div>

            <!-- Factual Narrative -->
            <div class="mny-dispute-row">
              <label class="mny-dispute-label" for="mnyDispReason">Factual Statement (Evidence-Based)</label>
              <textarea id="mnyDispReason" class="mny-dispute-textarea" placeholder="Detail specific dates, incident timeline, and factual grounds. Abusive or defamatory language is strictly rejected."></textarea>
            </div>

            <!-- Police NC & Station -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
              <div>
                <label class="mny-dispute-label" for="mnyDispPoliceNc">Police Station NC Number *</label>
                <input type="text" id="mnyDispPoliceNc" class="mny-dispute-input" placeholder="e.g. NC/4821/2026 or GD-102" required>
              </div>
              <div>
                <label class="mny-dispute-label" for="mnyDispStationName">Jurisdiction Station Name *</label>
                <input type="text" id="mnyDispStationName" class="mny-dispute-input" placeholder="e.g. Mira Road PS" required>
              </div>
            </div>

            <!-- Investigation Escrow Section -->
            <div class="mny-dispute-escrow-box">
              <div class="mny-dispute-escrow-amount">
                <span>₹2,500.00</span>
                <span class="mny-dispute-escrow-sub">Statutory Investigation Escrow</span>
              </div>
              <p style="font-size: 12px; color: #475569; margin: 6px 0 0;">
                Funds remain locked in neutral trust during verification. Released upon confirmed resolution.
              </p>
              <button type="button" id="mnyDispUpiBtn" class="mny-dispute-btn-upi">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                Deposit ₹2,500 via UPI Escrow
              </button>
              <div id="mnyDispEscrowStatus" class="mny-dispute-status-pill mny-status-pending">
                Escrow Pending: ₹2,500 Required
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

  function setupEventListeners(el) {
    const closeBtn = el.querySelector("#mnyDisputeCloseBtn");
    const cancelBtn = el.querySelector("#mnyDispCancelBtn");
    const upiBtn = el.querySelector("#mnyDispUpiBtn");
    const submitBtn = el.querySelector("#mnyDispSubmitBtn");
    const ncInput = el.querySelector("#mnyDispPoliceNc");
    const stationInput = el.querySelector("#mnyDispStationName");
    const reasonInput = el.querySelector("#mnyDispReason");

    function validateForm() {
      const hasNc = !!ncInput.value.trim();
      const hasStation = !!stationInput.value.trim();
      const hasReason = reasonInput.value.trim().length >= 10;
      submitBtn.disabled = !(hasNc && hasStation && hasReason && escrowConfirmed);
    }

    closeBtn.addEventListener("click", () => DisputeModal.close());
    cancelBtn.addEventListener("click", () => DisputeModal.close());

    ncInput.addEventListener("input", validateForm);
    stationInput.addEventListener("input", validateForm);
    reasonInput.addEventListener("input", validateForm);

    upiBtn.addEventListener("click", () => {
      // Simulate UPI escrow locking
      const upiUri = "upi://pay?pa=escrow.maanyata@upi&pn=Maanyata%20Trust%20Escrow&am=2500.00&cu=INR&tn=Dispute%20Escrow%20Deposit";
      // Try opening UPI URI or prompt
      try {
        const link = document.createElement("a");
        link.href = upiUri;
        link.click();
      } catch (e) {}

      escrowConfirmed = true;
      const statusEl = el.querySelector("#mnyDispEscrowStatus");
      statusEl.className = "mny-dispute-status-pill mny-status-locked";
      statusEl.textContent = "✓ ₹2,500 Escrow Deposited & Held in Trust";
      upiBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Escrow Confirmed (Ref #TX-ESC-${Date.now().toString(36).toUpperCase()})
      `;
      upiBtn.disabled = true;
      upiBtn.style.opacity = "0.85";
      validateForm();
    });

    submitBtn.addEventListener("click", async () => {
      if (!activeContractData) return;
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Recording Dispute...";

        const reason = reasonInput.value.trim();
        const category = el.querySelector("#mnyDispCategory").value;
        const fullReason = `[${category}] ${reason}`;
        const ncNumber = ncInput.value.trim();
        const stationName = stationInput.value.trim();

        const store = (typeof MaanyataStore !== "undefined")
          ? MaanyataStore
          : (global.MaanyataStore || (typeof window !== "undefined" ? window.MaanyataStore : null));

        if (store && store.initiateDispute) {
          const updated = await store.initiateDispute({
            contractId: activeContractData.contractId,
            reason: fullReason,
            escrowAmount: 2500,
            policeNcNumber: ncNumber,
            stationName: stationName
          });

          if (typeof activeCallback === "function") {
            activeCallback(updated);
          }
        }

        DisputeModal.close();
        if (typeof global.alert === "function") {
          global.alert(`Formal dispute recorded under Contract ID ${activeContractData.contractId}.\nPolice NC: ${ncNumber}\nInvestigation Escrow: ₹2,500.00 Locked.`);
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Lodge Formal Dispute";
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
      escrowConfirmed = false;

      const el = getModalElement();
      el.querySelector("#mnyDispContractId").textContent = contractId || "c-demo-default";
      el.querySelector("#mnyDispWorkerName").textContent = `${workerName} (${workerId || "ID verified"})`;
      el.querySelector("#mnyDispReason").value = "";
      el.querySelector("#mnyDispPoliceNc").value = "";
      el.querySelector("#mnyDispStationName").value = "";

      const statusEl = el.querySelector("#mnyDispEscrowStatus");
      statusEl.className = "mny-dispute-status-pill mny-status-pending";
      statusEl.textContent = "Escrow Pending: ₹2,500 Required";

      const upiBtn = el.querySelector("#mnyDispUpiBtn");
      upiBtn.disabled = false;
      upiBtn.style.opacity = "1";
      upiBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        Deposit ₹2,500 via UPI Escrow
      `;

      const submitBtn = el.querySelector("#mnyDispSubmitBtn");
      submitBtn.disabled = true;
      submitBtn.textContent = "Lodge Formal Dispute";

      el.classList.add("is-visible");
    },
    close() {
      if (typeof document === "undefined") return;
      const el = document.getElementById(MODAL_ID);
      if (el) el.classList.remove("is-visible");
      activeContractData = null;
      activeCallback = null;
    }
  };

  global.DisputeModal = DisputeModal;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = DisputeModal;
  }
})(typeof window !== "undefined" ? window : globalThis);
