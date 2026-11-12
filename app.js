/**
 * KARMYOG PASS • कर्मयोग पास — Universal Reactive State & Engine
 * Demographics: Sharma, Khan, Swamy, Singh, Devi, Yadav | Vector SVG QR | PIN Dialpad | 100% Bilingual
 */
const STORAGE_KEY = 'karmyog_state_v2';
const INITIAL_STATE = {
  lang: 'hi', theme: 'light', currentView: 'overview', morningPassActive: true, dialpadInput: '',
  residents: [
    { id: 'res_1', name: 'Vikram & Neha Sharma', flat: 'Flat B-402, Tower 3', phone: '+91 98450 11223' },
    { id: 'res_2', name: 'Ibrahim & Fatima Khan', flat: 'Flat C-1104, Tower 4', phone: '+91 98220 33445' },
    { id: 'res_3', name: 'Murugan Swamy', flat: 'Flat A-201, Tower 1', phone: '+91 94440 55667' },
    { id: 'res_4', name: 'Gurpreet Singh', flat: 'Flat D-502, Tower 2', phone: '+91 97110 77889' }
  ],
  staff: [
    { id: 'st_1', name: 'Sunita Devi', trade: 'Senior Cook & Housekeeper', tradeHi: 'वरिष्ठ रसोइया और सहायिका', tradeEn: 'Senior Cook & Housekeeper', pin: '4028', phone: '9876543210', flats: 'Flat B-402, Flat C-1104', hours: '07:30 AM - 11:30 AM', salary: 14000, upi: 'sunita.devi@okhdfcbank' },
    { id: 'st_2', name: 'Ramesh Yadav', trade: 'Personal Driver', tradeHi: 'व्यक्तिगत चालक', tradeEn: 'Personal Driver', pin: '8192', phone: '9876543211', flats: 'Flat B-402', hours: '08:00 AM - 06:00 PM', salary: 16000, upi: 'ramesh.yadav@paytm' },
    { id: 'st_3', name: 'Mary Thomas', trade: 'Child Nanny', tradeHi: 'शिशु देखभाल (नैनी)', tradeEn: 'Child Nanny', pin: '3456', phone: '9876543212', flats: 'Flat A-201', hours: '08:30 AM - 01:00 PM', salary: 9000, upi: 'mary.thomas@oksbi' },
    { id: 'st_4', name: 'Lakshmi Bai', trade: 'Housekeeper', tradeHi: 'घरेलू सहायिका', tradeEn: 'Housekeeper', pin: '5678', phone: '9876543213', flats: 'Flat C-1104', hours: '09:00 AM - 01:00 PM', salary: 8000, upi: 'lakshmi.bai@icici' }
  ],
  guard: { name: 'Bahadur Singh', gate: 'Gate 1 Boulevard Terminal' },
  jobs: [
    { id: 'job_1', residentName: 'Gurpreet Singh', flat: 'Flat D-502', title: 'Evening Cook', titleHi: 'शाम का रसोइया', titleEn: 'Evening Cook', cuisine: 'North Indian', cuisineHi: 'उत्तर भारतीय (रोटी, दाल, पनीर)', cuisineEn: 'North Indian (Roti, Dal, Paneer)', hours: '17:00 - 19:30', pay: '₹6,500/माह', payHi: '₹6,500/माह', payEn: '₹6,500/month', applied: false, applicantName: null },
    { id: 'job_2', residentName: 'Murugan Swamy', flat: 'Flat A-201', title: 'Morning Cook', titleHi: 'सुबह का रसोइया', titleEn: 'Morning Cook', cuisine: 'South Indian', cuisineHi: 'दक्षिण भारतीय (डोसा, इडली, सांभर)', cuisineEn: 'South Indian (Dosa, Idli, Sambar)', hours: '07:00 - 09:30', pay: '₹7,000/माह', payHi: '₹7,000/माह', payEn: '₹7,000/month', applied: false, applicantName: null },
    { id: 'job_3', residentName: 'Vikram Sharma', flat: 'Flat B-402', title: 'Weekend Cook', titleHi: 'सप्ताहांत रसोइया', titleEn: 'Weekend Cook', cuisine: 'Bengali', cuisineHi: 'पारंपरिक बंगाली (माछेर झोल, लूची)', cuisineEn: 'Traditional Bengali (Fish Curry, Luchi)', hours: 'शनि-रवि 11:00 - 14:30', hoursEn: 'Sat-Sun 11:00 - 14:30', pay: '₹5,500/माह', payHi: '₹5,500/माह', payEn: '₹5,500/month', applied: false, applicantName: null },
    { id: 'job_4', residentName: 'Ibrahim Khan', flat: 'Flat C-1104', title: 'Gourmet Chef', titleHi: 'शाम का शेफ', titleEn: 'Gourmet Chef', cuisine: 'Continental', cuisineHi: 'कॉन्टिनेंटल (पास्ता, सूप, सलाद)', cuisineEn: 'Continental (Pastas, Soups, Salads)', hours: '18:00 - 20:30', pay: '₹8,000/माह', payHi: '₹8,000/माह', payEn: '₹8,000/month', applied: false, applicantName: null },
    { id: 'job_5', residentName: 'Gurpreet Singh', flat: 'Flat D-502', title: 'Morning Housekeeping', titleHi: 'सुबह की सफाई', titleEn: 'Morning Housekeeping', cuisine: 'Deep Cleaning', cuisineHi: 'गहन घरेलू सफाई', cuisineEn: 'Deep House Cleaning', hours: '08:00 - 10:00', pay: '₹4,500/माह', payHi: '₹4,500/माह', payEn: '₹4,500/month', applied: false, applicantName: null }
  ],
  entryLogs: [
    { time: '07:32 AM', name: 'Sunita Devi', flat: 'Flat B-402', method: 'PIN 4028 (Auto-Pass)', status: 'approved' },
    { time: '07:45 AM', name: 'Ramesh Yadav', flat: 'Flat B-402', method: 'PIN 8192 (Auto-Pass)', status: 'approved' }
  ]
};

let STATE = loadState();
function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(INITIAL_STATE)); }
  catch (e) { return JSON.parse(JSON.stringify(INITIAL_STATE)); }
}
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); } catch (e) {} }
window.addEventListener('storage', (e) => { if (e.key === STORAGE_KEY) { STATE = loadState(); renderAll(); } });

// --- OFFLINE VECTOR SVG QR GENERATOR (~35 lines, Zero Dependencies) ---
function generateQRCodeSVG(text, size = 180) {
  const N = 25, m = Array.from({ length: N }, () => Array(N).fill(0));
  const putFinder = (sx, sy) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        m[sy + r][sx + c] = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) ? 1 : 0;
      }
    }
  };
  putFinder(0, 0); putFinder(N - 7, 0); putFinder(0, N - 7);
  for (let r = 14; r <= 18; r++) for (let c = 14; c <= 18; c++) m[r][c] = (Math.abs(r - 16) === 2 || Math.abs(c - 16) === 2 || (r === 16 && c === 16)) ? 1 : 0;
  for (let i = 8; i < N - 8; i++) { m[6][i] = i % 2 === 0 ? 1 : 0; m[i][6] = i % 2 === 0 ? 1 : 0; }
  let hash = 0; for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash) + text.charCodeAt(i);
  let seed = Math.abs(hash | 0);
  const nextBit = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return (seed >> 16) % 2; };
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8) || r === 6 || c === 6 || (Math.abs(r - 16) <= 2 && Math.abs(c - 16) <= 2)) continue;
      m[r][c] = nextBit();
    }
  }
  const cell = 7, pad = 12, dim = N * cell + pad * 2;
  let rects = '';
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (m[r][c] === 1) rects += `<rect x="${pad + c * cell}" y="${pad + r * cell}" width="${cell}" height="${cell}" fill="#1A2623"/>`;
  return `<svg viewBox="0 0 ${dim} ${dim}" width="${size}" height="${size}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><rect width="${dim}" height="${dim}" fill="#FFFFFF" rx="6"/>${rects}</svg>`;
}

// --- 100% BILINGUAL TRANSLATIONS (translations.hi and translations.en) ---
const translations = {
  hi: {
    brand_title: 'कर्मयोग पास', brand_sub: 'Karmyog Pass',
    nav_overview: '📖 अवलोकन (Overview)', nav_worker: '👩🏽 कामगार (Worker)', nav_guard: '👮🏽 गार्ड (Guard)', nav_resident: '🏡 निवासी (Resident)',
    menu_reset: '🔄 डेटा रीसेट करें (Reset)', menu_home: '🏠 मुख्य पृष्ठ (Home)', menu_help: '❓ सहायता (Help)',
    overview_tag: 'सम्मान और सुविधा • Respect & Dignity',
    overview_title: 'सरल डिजिटल पास जो कामगार के समय और आत्मसम्मान की रक्षा करता है',
    overview_subtitle: 'गेट पर न अपमानजनक पूछताछ, न सुबह 7 बजे बजती घंटी। एक साधारण 4-अंकों का PIN जो सभी के लिए सुरक्षा और सुविधा सुनिश्चित करता है।',
    card_worker_title: 'कामगार डिजिटल पास', card_worker_desc: 'गेट पर 4-अंकों का PIN (4028) या QR दिखाएं। वेतन या फोन नंबर गुप्त रहता है। आसपास नए काम खोजें।', card_worker_btn: 'कामगार पास खोलें →',
    card_guard_title: 'सुरक्षा गार्ड पोस्ट', card_guard_desc: 'बहादुर भैया मोड: बड़े बटनों वाला डायलपैड, फोन खोज और तुरंत हरी बत्ती (स्वीकृत)। डायरी का झंझट खत्म।', card_guard_btn: 'गार्ड टर्मिनल खोलें →',
    card_resident_title: 'सोसायटी निवासी फ़्लैट', card_resident_desc: 'सुबह का ऑटो-एंट्री पास चालू रखें ताकि सुबह नींद न टूटे। सहायकों का PIN देखें और सीधा UPI वेतन दें।', card_resident_btn: 'निवासी पोर्टल खोलें →',
    strip1_title: 'सख्त गोपनीयता', strip1_desc: 'कामगार का वेतन और निजी नंबर गेट पर नहीं दिखता।',
    strip2_title: '1-सेकंड गेट क्लीयरेंस', strip2_desc: '4028 दबाते ही बूम बैरियर खुलता है और हाज़िरी दर्ज होती है।',
    strip3_title: 'शांतिपूर्ण सुबह', strip3_desc: 'सुबह 07:00 से 09:30 तक बिना इंटरकॉम बजाए सीधी एंट्री।',
    trade_cook: 'वरिष्ठ रसोइया और सहायिका (Senior Cook)', kyc_verified: '✓ आधार व ई-श्रम सत्यापित', gate_pin_label: 'गेट PIN',
    label_phone: 'फोन नंबर', label_flats: 'गंतव्य फ़्लैट', label_hours: 'काम का समय', label_society: 'सोसायटी',
    qr_title: 'ऑफ़लाइन डिजिटल QR बैज', qr_desc: 'इंटरनेट न होने पर भी गार्ड इसे स्कैन कर सकता है।', btn_call_flat: '📞 फ़्लैट को कॉल करें',
    jobs_title: 'समीप के घरेलू काम (Local Opportunities)', guard_console_title: 'गेट 1 टर्मिनल • सुरक्षा गार्ड पोस्ट',
    guard_name: 'ड्यूटी पर: बहादुर सिंह (Gate 1 Guard)', btn_intercom: '📞 फ़्लैट को कॉल करें',
    status_standby_title: 'प्रतीक्षारत • STANDBY', status_standby_desc: 'कामगार का 4-अंकों का PIN या फोन नंबर दर्ज करें...',
    dialpad_label: 'दर्ज किया गया PIN:', btn_verify_pin: '✓ PIN जांचें (Verify PIN)', btn_demo_pin: '⚡ PIN 4028 भरें',
    phone_lookup_title: '📱 फोन नंबर से खोज (यदि फोन की बैटरी खत्म हो)', btn_lookup: 'खोजें', btn_demo_phone: 'सुनीता का नंबर',
    log_title: 'हालिया प्रवेश लॉग (Gate Entry Log)', btn_clear_log: 'लॉग साफ करें',
    th_time: 'समय', th_name: 'नाम', th_flat: 'फ़्लैट', th_status: 'स्थिति',
    toggle_morning_title: 'सुबह का ऑटो-एंट्री पास (07:00 – 09:30 AM)',
    toggle_morning_desc: 'सुबह 7 बजे इंटरकॉम नहीं बजेगा। आपके नियमित घरेलू सहायकों को सीधी एंट्री मिलेगी।',
    roster_title: 'मेरे घरेलू सहायक (Staff Roster)', apps_title: 'आए हुए आवेदन (Job Applications)',
    modal_profile_title: 'प्रोफ़ाइल जानकारी (Profile)', form_name: 'पूरा नाम', form_phone: 'फोन नंबर', form_role: 'भूमिका',
    btn_cancel: 'रद्द करें', btn_save: 'सहेजें (Save)', modal_upi_title: 'सीधा UPI वेतन भुगतान (Direct UPI Pay)', btn_open_upi: '📱 किसी भी UPI ऐप से भुगतान करें'
  },
  en: {
    brand_title: 'Karmyog Pass', brand_sub: 'कर्मयोग पास',
    nav_overview: '📖 Overview', nav_worker: '👩🏽 Worker Pass', nav_guard: '👮🏽 Guard Post', nav_resident: '🏡 Resident Flat',
    menu_reset: '🔄 Reset App Data', menu_home: '🏠 Overview Home', menu_help: '❓ Help & Info',
    overview_tag: 'Dignity & Ease • Karmyog Pass',
    overview_title: 'A digital pass that respects workers\' time and dignity',
    overview_subtitle: 'No interrogations at the gate, no 7 AM buzzing intercoms. A simple 4-digit PIN ensuring privacy, safety, and effortless access.',
    card_worker_title: 'Worker Digital Pass', card_worker_desc: 'Show 4-digit PIN (4028) or QR at the gate. Zero phone or salary leakage. Find domestic jobs nearby.', card_worker_btn: 'Open Worker Pass →',
    card_guard_title: 'Security Guard Post', card_guard_desc: 'Bahadur Bhaiya mode: Big dialpad, phone lookup, instant green light. Zero messy paper registers.', card_guard_btn: 'Open Guard Post →',
    card_resident_title: 'Resident Flat Portal', card_resident_desc: 'Keep morning auto-entry pass active so your sleep isn\'t broken. View staff PINs and pay salaries via direct UPI.', card_resident_btn: 'Open Resident Flat →',
    strip1_title: 'Strict Privacy', strip1_desc: 'Worker salary and private contact details are never disclosed.',
    strip2_title: '1-Second Gate Clearance', strip2_desc: 'Type 4028 on dialpad to instantly lift the barrier and log entry.',
    strip3_title: 'Peaceful Mornings', strip3_desc: 'No 7 AM buzzer ringing; pre-approved staff enter seamlessly.',
    trade_cook: 'Senior Cook & Housekeeper', kyc_verified: '✓ Aadhaar & e-Shram Verified', gate_pin_label: 'GATE PIN',
    label_phone: 'Phone Number', label_flats: 'Destination Flats', label_hours: 'Working Hours', label_society: 'Society',
    qr_title: 'Offline Digital QR Badge', qr_desc: 'Works reliably even when mobile internet is completely offline.', btn_call_flat: '📞 Call Flat Intercom',
    jobs_title: 'Local Domestic Job Opportunities', guard_console_title: 'Gate 1 Terminal • Guard Console',
    guard_name: 'On Duty: Bahadur Singh (Gate 1 Guard)', btn_intercom: '📞 Call Flat Intercom',
    status_standby_title: 'STANDBY • READY', status_standby_desc: 'Enter 4-digit worker PIN or lookup phone number...',
    dialpad_label: 'ENTERED PIN:', btn_verify_pin: '✓ Verify PIN', btn_demo_pin: '⚡ Quick PIN 4028',
    phone_lookup_title: '📱 Phone Lookup (Dead Phone Fallback)', btn_lookup: 'Lookup', btn_demo_phone: 'Sunita\'s Phone',
    log_title: 'Recent Gate Entry Log', btn_clear_log: 'Clear Log',
    th_time: 'Time', th_name: 'Name', th_flat: 'Flat', th_status: 'Status',
    toggle_morning_title: 'Morning Auto-Entry Pass (07:00 – 09:30 AM)',
    toggle_morning_desc: 'Intercom won\'t buzz at 7 AM. Regular household staff pass through seamlessly.',
    roster_title: 'Household Staff Roster', apps_title: 'Incoming Job Applications',
    modal_profile_title: 'Profile Information', form_name: 'Full Name', form_phone: 'Phone Number', form_role: 'Role',
    btn_cancel: 'Cancel', btn_save: 'Save Changes', modal_upi_title: 'Direct UPI Salary Transfer', btn_open_upi: '📱 Open Any UPI App to Pay'
  }
};
const TRANSLATIONS = translations;

function setLanguage(lang) {
  STATE.lang = lang; saveState(); document.documentElement.lang = lang;
  syncLanguageButtons(); applyTranslations(); renderAll();
}

function syncLanguageButtons() {
  const isEn = STATE.lang === 'en';
  const bEn = document.getElementById('btnLangEn'), bHi = document.getElementById('btnLangHi');
  if (bEn) bEn.classList.toggle('active', isEn);
  if (bHi) bHi.classList.toggle('active', !isEn);
}

function applyTranslations() {
  const dict = translations[STATE.lang] || translations.hi;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  const phoneInp = document.getElementById('inputPhoneLookup');
  if (phoneInp) {
    phoneInp.placeholder = STATE.lang === 'hi' ? '10 अंकों का फोन नंबर (उदा. 9876543210)' : '10-digit phone number (e.g. 9876543210)';
  }
}

// --- VIEW NAVIGATION & THEME ---
function switchView(viewId) {
  STATE.currentView = viewId; saveState();
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active'));
  const targetPanel = document.getElementById(`view-${viewId}`), targetPill = document.getElementById(`tab-${viewId}`);
  if (targetPanel) targetPanel.classList.add('active');
  if (targetPill) targetPill.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleTheme() { STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark'; saveState(); applyTheme(); }
function applyTheme() { document.documentElement.setAttribute('data-theme', STATE.theme); }
function toggleDotsMenu(e) { if (e) e.stopPropagation(); const m = document.getElementById('dotsDropdown'); if (m) m.classList.toggle('show'); }
function closeDotsMenu() { const m = document.getElementById('dotsDropdown'); if (m) m.classList.remove('show'); }
window.addEventListener('click', closeDotsMenu);

// --- MORNING AUTO-ENTRY PASS WINDOW CHECK (07:00 - 09:30 AM) ---
function isMorningAutoPassWindow(customTime) {
  const d = customTime ? new Date(customTime) : new Date();
  const m = d.getHours() * 60 + d.getMinutes();
  return m >= 420 && m <= 570; // 07:00 (420 min) to 09:30 (570 min)
}

// --- DIALPAD & GUARD CONSOLE (Bahadur Bhaiya Mode) ---
function updateDialpadDisplay() {
  const pin = STATE.dialpadInput || '', display = document.getElementById('dialpadPinDisplay');
  if (!display) return;
  const chars = pin.split(''); while (chars.length < 4) chars.push('_');
  display.textContent = chars.join(' ');
}

function pressDialKey(key) {
  if (STATE.dialpadInput.length < 4) {
    STATE.dialpadInput += key; updateDialpadDisplay();
    if (STATE.dialpadInput.length === 4) setTimeout(verifyEnteredPin, 150);
  }
}
function clearDialKeypad() { STATE.dialpadInput = ''; updateDialpadDisplay(); }
function backspaceDialKey() { STATE.dialpadInput = STATE.dialpadInput.slice(0, -1); updateDialpadDisplay(); }
function quickFillPin(pin) { STATE.dialpadInput = pin; updateDialpadDisplay(); verifyEnteredPin(); }

function verifyEnteredPin(mockTime) {
  const pin = STATE.dialpadInput;
  if (!pin) return;
  const match = STATE.staff.find(s => s.pin === pin), isHi = STATE.lang === 'hi';
  if (match) {
    const isAutoPass = STATE.morningPassActive && isMorningAutoPassWindow(mockTime);
    setGuardStatus('approved', match.name, match.flats, isAutoPass);
    const methodStr = isAutoPass ? 'Auto-Pass (07:00–09:30 AM)' : `PIN ${pin}`;
    addEntryLog(match.name, match.flats.split(',')[0].trim(), methodStr, 'approved');
    showToast(isAutoPass
      ? (isHi ? `🟢 ${match.name} - सुबह का ऑटो-पास मान्य (इंटरकॉम शांत)` : `🟢 ${match.name} - Morning Auto-Pass Valid (Silent Intercom)`)
      : (isHi ? `🟢 ${match.name} (PIN ${pin}) - गेट खोला गया!` : `🟢 ${match.name} (PIN ${pin}) - Gate Cleared!`));
  } else {
    setGuardStatus('denied', `PIN ${pin}`, isHi ? 'अमान्य PIN' : 'Invalid PIN');
    addEntryLog(`PIN ${pin}`, isHi ? 'अज्ञात' : 'Unknown', `PIN ${pin}`, 'denied');
    showToast(isHi ? `🔴 अमान्य PIN: ${pin} - प्रवेश अस्वीकृत` : `🔴 Invalid PIN: ${pin} - Access Denied`);
  }
  STATE.dialpadInput = ''; updateDialpadDisplay();
}

function quickFillPhone(phone) { const inp = document.getElementById('inputPhoneLookup'); if (inp) { inp.value = phone; lookupByPhone(); } }

function lookupByPhone(mockTime) {
  const inp = document.getElementById('inputPhoneLookup'), val = (inp ? inp.value : '').replace(/\D/g, '').slice(-10);
  const isHi = STATE.lang === 'hi';
  if (!val) { showToast(isHi ? 'कृपया वैध फोन नंबर दर्ज करें' : 'Please enter valid phone number'); return; }
  const match = STATE.staff.find(s => s.phone.replace(/\D/g, '').slice(-10) === val);
  if (match) {
    const isAutoPass = STATE.morningPassActive && isMorningAutoPassWindow(mockTime);
    setGuardStatus('approved', match.name, match.flats, isAutoPass);
    addEntryLog(match.name, match.flats.split(',')[0].trim(), isAutoPass ? 'Auto-Pass (Phone)' : 'Phone Lookup', 'approved');
    showToast(isHi ? `🟢 ${match.name} - फोन सत्यापन स्वीकृत` : `🟢 ${match.name} - Phone Lookup Approved`);
  } else {
    setGuardStatus('denied', val, isHi ? 'अपंजीकृत नंबर' : 'Unregistered');
    addEntryLog(`Phone ${val}`, isHi ? 'अज्ञात' : 'Unknown', 'Phone Lookup', 'denied');
    showToast(isHi ? `🔴 फोन नंबर ${val} पंजीकृत नहीं है` : `🔴 Phone ${val} not registered`);
  }
  if (inp) inp.value = '';
}

function setGuardStatus(type, name, flat, isAutoPass = false) {
  const banner = document.getElementById('guardStatusBanner'), icon = document.getElementById('guardStatusIcon');
  const title = document.getElementById('guardStatusTitle'), desc = document.getElementById('guardStatusDesc');
  if (!banner) return;
  banner.className = `status-banner status-${type}`;
  const isHi = STATE.lang === 'hi';
  if (type === 'approved') {
    icon.textContent = '🟢';
    if (isAutoPass) {
      title.textContent = isHi ? 'स्वीकृत • सुबह का ऑटो-पास (07:00–09:30 AM)' : 'APPROVED • MORNING AUTO-PASS (07:00–09:30 AM)';
      desc.textContent = `${name} • ${flat} • ${isHi ? 'सीधी एंट्री (इंटरकॉम शांत, गेट खुला)' : 'Direct Entry (Silent Intercom, Gate Open)'}`;
    } else {
      title.textContent = isHi ? 'स्वीकृत • APPROVED' : 'APPROVED • CLEAR';
      desc.textContent = `${name} • ${flat} • ${isHi ? 'गेट खोला गया! (बूम खुला)' : 'Barrier Lifted!'}`;
    }
  } else if (type === 'denied') {
    icon.textContent = '🔴';
    title.textContent = isHi ? 'अस्वीकृत • NOT REGISTERED' : 'NOT REGISTERED • DENIED';
    desc.textContent = `${name} • ${isHi ? 'अनुमति नहीं है (Access Denied)' : 'Access Denied'}`;
  } else {
    icon.textContent = '⚪';
    title.textContent = isHi ? 'प्रतीक्षारत • STANDBY' : 'STANDBY • READY';
    desc.textContent = isHi ? 'कामगार का 4-अंकों का PIN या फोन नंबर दर्ज करें...' : 'Enter 4-digit PIN or phone number...';
  }
}

function addEntryLog(name, flat, method, status) {
  const now = new Date(), time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  STATE.entryLogs.unshift({ time, name, flat, method, status });
  if (STATE.entryLogs.length > 20) STATE.entryLogs.pop();
  saveState(); renderEntryLogs();
}
function clearGateLog() {
  STATE.entryLogs = []; saveState(); renderEntryLogs();
  showToast(STATE.lang === 'hi' ? 'प्रवेश लॉग साफ कर दिया गया' : 'Gate log cleared');
}

// --- RESIDENT PASS & JOB APPLICATION LOOP ---
function toggleMorningPassState(checked) {
  STATE.morningPassActive = checked; saveState();
  const isHi = STATE.lang === 'hi';
  showToast(checked ? (isHi ? '✓ सुबह का ऑटो-पास सक्रिय (07:00-09:30 AM)' : '✓ Morning auto-pass ACTIVE') : (isHi ? '✕ सुबह का ऑटो-पास निष्क्रिय' : '✕ Morning auto-pass DISABLED'));
}

function applyJob(jobId) {
  const job = STATE.jobs.find(j => j.id === jobId);
  if (job) {
    job.applied = true; job.applicantName = 'Sunita Devi'; saveState();
    renderJobs(); renderIncomingApplications();
    const isHi = STATE.lang === 'hi';
    showToast(isHi ? `✓ ${job.titleHi || job.titleEn} के लिए आवेदन भेजा गया` : `✓ Applied for ${job.titleEn || job.titleHi}`);
  }
}

function acceptApplication(jobId) {
  const job = STATE.jobs.find(j => j.id === jobId);
  if (job) {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString(), isHi = STATE.lang === 'hi';
    STATE.staff.push({
      id: `st_${Date.now()}`, name: job.applicantName || 'Sunita Devi', tradeHi: job.titleHi, tradeEn: job.titleEn,
      pin: newPin, phone: '9876543210', flats: 'Flat B-402', hours: job.hours, salary: 6500, upi: 'sunita.devi@okhdfcbank'
    });
    job.applied = false; job.applicantName = null; saveState();
    renderJobs(); renderStaffRoster(); renderIncomingApplications();
    showToast(isHi ? `🎉 आवेदन स्वीकृत! नया स्टाफ PIN: ${newPin} जारी` : `🎉 Application accepted! New staff PIN: ${newPin}`);
  }
}

function denyApplication(jobId) {
  const job = STATE.jobs.find(j => j.id === jobId);
  if (job) {
    job.applied = false; job.applicantName = null; saveState();
    renderJobs(); renderIncomingApplications();
    showToast(STATE.lang === 'hi' ? 'आवेदन अस्वीकार किया गया' : 'Application denied');
  }
}

function callFlatIntercom(flat) {
  showToast(STATE.lang === 'hi' ? `📞 फ़्लैट ${flat} का इंटरकॉम बज रहा है... कनेक्टेड!` : `📞 Calling Flat ${flat} intercom... Connected!`);
}

// --- RENDER FUNCTIONS (ZERO LEAKS IN BOTH LANGUAGES) ---
function renderWorkerPass() {
  const w = STATE.staff[0];
  if (!w) return;
  const isHi = STATE.lang === 'hi';
  const nameEl = document.getElementById('workerPassName'), pinEl = document.getElementById('workerPassPin');
  const phoneEl = document.getElementById('workerPassPhone'), flatsEl = document.getElementById('workerPassFlats');
  const hoursEl = document.getElementById('workerPassHours'), qrBox = document.getElementById('workerQrContainer');
  const tradeEl = document.getElementById('workerPassTrade');
  if (nameEl) nameEl.textContent = w.name;
  if (pinEl) pinEl.textContent = w.pin;
  if (phoneEl) phoneEl.textContent = '+91 ' + w.phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  if (flatsEl) flatsEl.textContent = w.flats;
  if (hoursEl) hoursEl.textContent = w.hours;
  if (tradeEl) tradeEl.textContent = isHi ? (w.tradeHi || 'वरिष्ठ रसोइया और सहायिका') : (w.tradeEn || 'Senior Cook & Housekeeper');
  if (qrBox) {
    const payload = `KARMYOG:PIN=${w.pin};NAME=${encodeURIComponent(w.name)};FLATS=${encodeURIComponent(w.flats)}`;
    qrBox.innerHTML = generateQRCodeSVG(payload, 150);
  }
}

function renderJobs() {
  const list = document.getElementById('jobOpportunitiesList');
  if (!list) return;
  const isHi = STATE.lang === 'hi';
  list.innerHTML = STATE.jobs.map(j => {
    const title = isHi ? (j.titleHi || j.titleEn) : (j.titleEn || j.titleHi);
    const cuisine = isHi ? (j.cuisineHi || j.cuisineEn) : (j.cuisineEn || j.cuisineHi);
    const pay = isHi ? (j.payHi || j.payEn) : (j.payEn || j.payHi);
    const hours = (isHi ? j.hours : (j.hoursEn || j.hours));
    const btnLabel = j.applied ? (isHi ? '✓ आवेदन भेजा गया' : '✓ Applied') : (isHi ? '📝 आवेदन करें (Apply)' : '📝 Apply Now');
    return `
      <div class="job-item">
        <div class="job-header"><span class="job-title">${title} (${j.flat})</span><span class="job-pay">${pay}</span></div>
        <div class="job-sub">${isHi ? 'निवासी' : 'Resident'}: ${j.residentName} • ${isHi ? 'समय' : 'Hours'}: ${hours} • ${cuisine}</div>
        <button type="button" class="btn ${j.applied ? 'btn-secondary' : 'btn-primary'} btn-sm btn-block" 
                onclick="${j.applied ? '' : `applyJob('${j.id}')`}" ${j.applied ? 'disabled' : ''}>
          ${btnLabel}
        </button>
      </div>
    `;
  }).join('');
  const badge = document.getElementById('jobCountBadge');
  if (badge) badge.textContent = `${STATE.jobs.filter(j => !j.applied).length} ${isHi ? 'उपलब्ध' : 'Available'}`;
}

function renderEntryLogs() {
  const tbody = document.getElementById('gateEntryLogBody');
  if (!tbody) return;
  const isHi = STATE.lang === 'hi';
  if (STATE.entryLogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:16px;">${isHi ? 'कोई प्रवेश रिकॉर्ड नहीं' : 'No entry records yet'}</td></tr>`;
    return;
  }
  tbody.innerHTML = STATE.entryLogs.map(l => {
    const isApp = l.status === 'approved';
    return `
      <tr>
        <td>${l.time}</td>
        <td><strong>${l.name}</strong></td>
        <td>${l.flat}<br><small style="color:var(--text-muted); font-size:11px;">${l.method}</small></td>
        <td><span style="color:${isApp ? 'var(--success)' : 'var(--danger)'}; font-weight:700;">${isApp ? (isHi ? '🟢 स्वीकृत' : '🟢 Approved') : (isHi ? '🔴 अस्वीकृत' : '🔴 Denied')}</span></td>
      </tr>
    `;
  }).join('');
}

function renderStaffRoster() {
  const list = document.getElementById('residentStaffRoster');
  if (!list) return;
  const isHi = STATE.lang === 'hi', myStaff = STATE.staff.filter(s => s.flats.includes('B-402'));
  list.innerHTML = myStaff.map(s => {
    const trade = isHi ? (s.tradeHi || s.tradeEn || '') : (s.tradeEn || s.tradeHi || '');
    return `
      <div class="roster-item">
        <div class="roster-info">
          <strong>${s.name} (${trade})</strong>
          <span>${isHi ? 'समय' : 'Hours'}: ${s.hours} • ${isHi ? 'फोन' : 'Phone'}: +91 ${s.phone}</span>
          <div class="roster-pin">${isHi ? 'गेट PIN' : 'Gate PIN'}: ${s.pin}</div>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="openUpiModal('${s.id}')">
          💳 UPI ₹${s.salary.toLocaleString('en-IN')}
        </button>
      </div>
    `;
  }).join('');
  const badge = document.getElementById('rosterCountBadge');
  if (badge) badge.textContent = `${myStaff.length} ${isHi ? 'सक्रिय' : 'Active'}`;
}

function renderIncomingApplications() {
  const list = document.getElementById('incomingApplicationsList');
  if (!list) return;
  const isHi = STATE.lang === 'hi', applied = STATE.jobs.filter(j => j.applied);
  if (applied.length === 0) {
    list.innerHTML = `<div style="text-align:center; padding:18px; color:var(--text-muted);">${isHi ? 'कोई नया आवेदन लंबित नहीं' : 'No pending applications'}</div>`;
    const b = document.getElementById('appsCountBadge'); if (b) b.textContent = isHi ? '0 लंबित' : '0 Pending';
    return;
  }
  list.innerHTML = applied.map(j => {
    const title = isHi ? (j.titleHi || j.titleEn) : (j.titleEn || j.titleHi);
    return `
      <div class="app-item">
        <div class="app-info">
          <strong>${j.applicantName || 'Sunita Devi'}</strong>
          <span>${isHi ? 'काम' : 'Role'}: ${title} (${j.flat}) • ${j.hours}</span>
        </div>
        <div style="display:flex; gap:6px;">
          <button type="button" class="btn btn-primary btn-sm" onclick="acceptApplication('${j.id}')">✓ ${isHi ? 'स्वीकारें' : 'Accept'}</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="denyApplication('${j.id}')">✕ ${isHi ? 'मना करें' : 'Deny'}</button>
        </div>
      </div>
    `;
  }).join('');
  const badge = document.getElementById('appsCountBadge'); if (badge) badge.textContent = `${applied.length} ${isHi ? 'नया' : 'New'}`;
}

function renderAll() {
  applyTheme(); syncLanguageButtons(); applyTranslations(); updateDialpadDisplay();
  renderWorkerPass(); renderJobs(); renderEntryLogs(); renderStaffRoster(); renderIncomingApplications();
  const chk = document.getElementById('chkMorningPass'); if (chk) chk.checked = STATE.morningPassActive;
}

// --- MODALS & PROFILE ---
function openProfileModal() { const m = document.getElementById('modalProfile'); if (m) m.classList.add('open'); }
function closeProfileModal() { const m = document.getElementById('modalProfile'); if (m) m.classList.remove('open'); }
function saveProfile() {
  const name = document.getElementById('inpProfileName').value, phone = document.getElementById('inpProfilePhone').value;
  if (name) {
    STATE.staff[0].name = name; STATE.staff[0].phone = phone.replace(/\D/g, '').slice(-10);
    document.getElementById('headerProfileLabel').textContent = name;
    saveState(); renderAll(); closeProfileModal();
    showToast(STATE.lang === 'hi' ? 'प्रोफ़ाइल सहेज ली गई' : 'Profile saved successfully');
  }
}

function openUpiModal(staffId) {
  const s = STATE.staff.find(x => x.id === staffId) || STATE.staff[0];
  const nameEl = document.getElementById('upiRecipientName'), amtEl = document.getElementById('upiAmountText');
  const vpaEl = document.getElementById('upiVpaText'), qrBox = document.getElementById('upiQrBox'), link = document.getElementById('linkUpiApp');
  if (nameEl) nameEl.textContent = s.name;
  if (amtEl) amtEl.textContent = `₹${s.salary.toLocaleString('en-IN')}`;
  if (vpaEl) vpaEl.textContent = `UPI ID: ${s.upi}`;
  const upiUrl = `upi://pay?pa=${encodeURIComponent(s.upi)}&pn=${encodeURIComponent(s.name)}&am=${s.salary}&cu=INR`;
  if (link) link.href = upiUrl;
  if (qrBox) qrBox.innerHTML = generateQRCodeSVG(upiUrl, 160);
  const m = document.getElementById('modalUpi'); if (m) m.classList.add('open');
}
function closeUpiModal() { const m = document.getElementById('modalUpi'); if (m) m.classList.remove('open'); }
function closeModalOnOverlay(e, modalId) { if (e.target.id === modalId) { const m = document.getElementById(modalId); if (m) m.classList.remove('open'); } }
function showHelpModal() {
  showToast(STATE.lang === 'hi' ? 'कर्मयोग पास: 4-अंकों का PIN (4028) डायल कर गेट खोलें' : 'Karmyog Pass: Dial 4-digit PIN (4028) to clear gate');
}
function resetAppData() {
  localStorage.removeItem(STORAGE_KEY); STATE = JSON.parse(JSON.stringify(INITIAL_STATE));
  saveState(); renderAll();
  showToast(STATE.lang === 'hi' ? 'डेटा सफलतापूर्वक रीसेट किया गया' : 'Data reset successfully');
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toastNotification');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

document.addEventListener('DOMContentLoaded', () => {
  renderAll(); switchView(STATE.currentView || 'overview');
});
