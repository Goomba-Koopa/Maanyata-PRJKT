    // 1. Strict Language Dict (Zero Mixed Soup)
    const DICT = {
      en: {
        navDirectory: "Demo Directory",
        workerName: "Dummy Bai [Demo Profile]",
        workerRole: "Household & Culinary Specialist",
        statusText: "Active Status: Employed across 3 Societies (20 Households Served)",
        lblTenure: "Tenure",
        lblHouseholds: "Households",
        lblRecognitions: "Recognitions",
        titleCharter: "Dignity Charter & Working Terms",
        term1: "Minimum 1 Agreed Weekly Rest Day (Chosen Mutually)",
        term2: "Direct Resident UPI Payment on 1st/5th of Month",
        term3: "Zero Acid or Hazardous Chemical Cleaning",
        term4: "30-Minute Midday Lunch Break on Full Shifts",
        titleSilos: "Craft Risk Silos",
        silo1Title: "Surface Crafts (Cleaning / Utensils)",
        silo1Desc: "Floor sweeping, mopping, utensil sanitization. Regular residential blast radius.",
        silo2Title: "Culinary Specialization (Cooking)",
        silo2Desc: "Daily meal preparation and dietary hygiene. Requires 1 paid trial meal with family.",
        titleTrust: "Community Trust Signals",
        trait1: "Always On Time",
        trait2: "Trusted With House Keys",
        trait3: "Exceptional Cooking",
        sampleQuote: "\"Dummy Bai has served our flat with absolute honesty and punctuality for 3 years. Irreplaceable domestic specialist.\"",
        sampleAuthor: "Attestation: Ms. Demo Resident • Flat B-402, Demo Society",
        titleQr: "Official Verification QR Code",
        qrHelp: "Scan with any regular smartphone camera to verify authentic e-Shram credentials and employment history.",
        btnShare: "Share Verified Pass on WhatsApp",
        tabPass: "My Pass",
        tabReviews: "Records",
        tabTerms: "Terms",
        tabShare: "Share"
      },
      hi: {
        navDirectory: "डेमो डायरेक्टरी",
        workerName: "डमी बाई [डेमो प्रोफाइल]",
        workerRole: "गृह एवं पाक कला विशेषज्ञ",
        statusText: "सक्रिय स्थिति: 3 सोसायटियों में कार्यरत (20 घरों में सेवा)",
        lblTenure: "कार्यकाल",
        lblHouseholds: "परिवार",
        lblRecognitions: "पहचान",
        titleCharter: "पारस्परिक सम्मान चार्टर एवं नियम",
        term1: "सप्ताह में कम से कम 1 सहमति से तय अवकाश",
        term2: "महीने की 1 या 5 तारीख को सीधे यूपीआई भुगतान",
        term3: "तेजाब या खतरनाक रसायनों से सफाई पर पूर्ण प्रतिबंध",
        term4: "पूरी शिफ्ट पर 30 मिनट का दोपहर का भोजन विश्राम",
        titleSilos: "कार्य जोखिम वर्गीकरण",
        silo1Title: "सतह कार्य (सफाई / बर्तन)",
        silo1Desc: "झाड़ू, पोंछा, बर्तन धोना एवं स्वच्छता प्रबंधन। सामान्य आवासीय दायरा।",
        silo2Title: "पाक कला विशेषज्ञता (भोजन पकाना)",
        silo2Desc: "दैनिक भोजन एवं आहार स्वच्छता। परिवार के साथ 1 सशुल्क परीक्षण भोजन आवश्यक।",
        titleTrust: "सामुदायिक विश्वास संकेत",
        trait1: "सदा समय पर",
        trait2: "घर की चाबियों का विश्वास",
        trait3: "उत्कृष्ट पाक कला",
        sampleQuote: "\"डमी बाई ने 3 वर्षों तक पूर्ण ईमानदारी और समयबद्धता के साथ हमारे घर की सेवा की है। अतुलनीय विशेषज्ञ।\"",
        sampleAuthor: "संदर्भ: श्रीमती डेमो निवासी • फ्लैट बी-402, डेमो सोसायटी",
        titleQr: "आधिकारिक सत्यापन क्यूआर कोड",
        qrHelp: "ई-श्रम पहचान और कार्य इतिहास सत्यापित करने के लिए किसी भी साधारण कैमरा से स्कैन करें।",
        btnShare: "व्हाट्सएप पर पास साझा करें",
        tabPass: "पास",
        tabReviews: "रिकॉर्ड",
        tabTerms: "नियम",
        tabShare: "शेयर"
      }
    };

    let currentLang = "en";

    function toggleLanguage() {
      currentLang = currentLang === "en" ? "hi" : "en";
      document.documentElement.lang = currentLang;
      document.getElementById("langBtnText").textContent = currentLang === "en" ? "हिंदी" : "English";

      const data = DICT[currentLang];
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const k = el.getAttribute("data-i18n");
        if (data[k]) el.textContent = data[k];
      });
    }

    function sharePassWhatsApp() {
      const text = encodeURIComponent("Namaste, please view my verified Maanyata Sovereign Passbook: " + window.location.href);
      window.open("https://api.whatsapp.com/send?text=" + text, "_blank");
    }

    // Real Dynamic QR Code Generator
    function initQR() {
      const canvas = document.getElementById("workerQrCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const size = 140;
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);

      const payload = "https://project-maanyata.pages.dev/portfolio?id=demo-dummy-bai-01";

      if (typeof QRCodeModel !== "undefined") {
        const qr = new QRCodeModel(0, QRErrorCorrectLevel.M);
        qr.addData(payload);
        qr.make();
        const count = qr.getModuleCount();
        const pad = 2;
        const cell = size / (count + pad * 2);

        ctx.fillStyle = "#000000";
        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qr.isDark(r, c)) {
              ctx.fillRect((c + pad) * cell, (r + pad) * cell, Math.ceil(cell), Math.ceil(cell));
            }
          }
        }
      }
    }

    window.addEventListener("DOMContentLoaded", initQR);
  
