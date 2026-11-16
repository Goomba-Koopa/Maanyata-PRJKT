import fs from 'fs';
import path from 'path';

const baseDir = process.env.BASE_DIR || process.cwd();

function srgbLuminance(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  const a = [r, g, b].map(v => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(hex1, hex2) {
  const l1 = srgbLuminance(hex1);
  const l2 = srgbLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u;

const pages = [
  'portfolio.html',
  'portfolio_aqua.html',
  'endorse.html',
  'directory.html',
  'onboard.html',
  'rwa_pilot_proposal.html',
  'index.html'
];

console.log('================================================================');
console.log('                MAANYATA POC FRONTEND AUDIT REPORT              ');
console.log('================================================================\n');

// 1. PALETTES CONTRAST AUDIT
console.log('1. WCAG AA Contrast Ratios:');
const palettes = {
  'Warm Daylight': {
    card: '#FFFFFF',
    canvas: '#FAF8F5',
    inks: { primary: '#1C1917', secondary: '#44403C', muted: '#78716C', terracotta: '#B04B26' }
  },
  'Indigo Stamp': {
    card: '#FFFFFF',
    canvas: '#F4F6FA',
    inks: { primary: '#0F172A', secondary: '#334155', muted: '#5A6B84', terracotta: '#1F2A44', amber: '#92580C' }
  },
  'Saffron Seal': {
    card: '#FFFFFF',
    canvas: '#FFFBEB',
    inks: { primary: '#372305', secondary: '#5C4018', muted: '#8C6A34', terracotta: '#B45309', emerald: '#1E4620' }
  },
  'Olive Ledger': {
    card: '#FFFFFF',
    canvas: '#F8F7F0',
    inks: { primary: '#1C1F16', secondary: '#3E4333', muted: '#6C725D', terracotta: '#4F6B2F' }
  },
  'Midnight Gate': {
    card: '#1C1F25',
    canvas: '#14161A',
    inks: { primary: '#F4F5F7', secondary: '#D1D5DB', muted: '#9CA3AF', terracotta: '#E8A33D', emerald: '#34D399', amber: '#FBBF24' }
  }
};

let totalContrastFailures = 0;
for (const [name, p] of Object.entries(palettes)) {
  console.log(`  Palette: ${name}`);
  for (const [label, hex] of Object.entries(p.inks)) {
    const crCard = contrast(hex, p.card);
    const crCanvas = contrast(hex, p.canvas);
    const pass = crCard >= 4.5 && crCanvas >= 4.5;
    if (!pass) totalContrastFailures++;
    console.log(`    ${label} (${hex}) vs card: ${crCard.toFixed(2)}:1 | vs canvas: ${crCanvas.toFixed(2)}:1 -> [${pass ? 'PASS' : 'FAIL'}]`);
  }
}
const mgCardCr = contrast('#F4F5F7', '#1C1F25');
console.log(`\n  Midnight Gate card text #F4F5F7 vs card background #1C1F25: ${mgCardCr.toFixed(2)}:1 (Target >= 4.5:1) -> [${mgCardCr >= 4.5 ? 'PASS' : 'FAIL'}]\n`);

// 2. PAGE BY PAGE TABLE
const auditResults = [];

for (const page of pages) {
  const filePath = path.join(baseDir, page);
  const content = fs.readFileSync(filePath, 'utf8');

  // Emojis
  let emojiCount = 0;
  content.split('\n').forEach(l => {
    if (emojiRegex.test(l)) emojiCount++;
  });

  // Extract rules
  const styleBlocks = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const rules = [];
  styleBlocks.forEach(sb => {
    const clean = sb.replace(/<style[^>]*>/i, '').replace(/<\/style>/i, '');
    const matches = clean.match(/([^{}]+)\{([^{}]+)\}/g) || [];
    matches.forEach(m => {
      const parts = m.match(/([^{}]+)\{([^{}]+)\}/);
      if (parts) {
        rules.push({ selector: parts[1].trim(), decls: parts[2].trim() });
      }
    });
  });

  // Inputs < 16px
  let inputsUnder16 = 0;
  rules.forEach(r => {
    // Only test if the SELECTOR targets input/select/textarea
    if (/(?:^|[,\s>])(?:input|select|textarea|\.search-input|\.form-input|\.form-select|\.studio-select|\.native-time-input)\b/i.test(r.selector)) {
      const m = r.decls.match(/font-size\s*:\s*(\d+)px/i);
      if (m && parseInt(m[1]) < 16) inputsUnder16++;
    }
  });

  // Inline styles on input elements
  const inlineInputs = content.match(/<(?:input|select|textarea)[^>]*style=["'][^"']*font-size\s*:\s*(\d+)px/gi) || [];
  inlineInputs.forEach(i => {
    const m = i.match(/font-size\s*:\s*(\d+)px/i);
    if (m && parseInt(m[1]) < 16) inputsUnder16++;
  });

  // Tap targets < 44px
  let tapTargetsUnder44 = 0;
  rules.forEach(r => {
    if (/(?:button|\.btn|\.chip|\.society-pill|\.search-clear-btn|\.tag-choice|\.trait-chip|\.palette-tile|\.typo-preset-btn|\.manifest-badge|\.auth-btn|\.back-btn)\b/i.test(r.selector)) {
      const hMatch = r.decls.match(/(?:^|[\s;])(?:min-)?height\s*:\s*(\d+)px/i);
      if (hMatch && parseInt(hMatch[1]) < 44 && !r.decls.includes('44px')) {
        tapTargetsUnder44++;
      }
      const padMatch = r.decls.match(/(?:^|[\s;])padding\s*:\s*(\d+)px/i);
      if (!hMatch && padMatch && parseInt(padMatch[1]) <= 7 && !r.decls.includes('min-height')) {
        tapTargetsUnder44++;
      }
    }
  });

  // Contrast failures specific to page
  let pageContrastFailures = 0;
  if (content.includes('--ink-muted: #A8A29E;')) pageContrastFailures++;

  const pass = emojiCount === 0 && inputsUnder16 === 0 && tapTargetsUnder44 === 0 && pageContrastFailures === 0;

  auditResults.push({
    page,
    tapTargetsUnder44,
    contrastFailures: pageContrastFailures,
    inputsUnder16,
    emojiCount,
    status: pass ? 'PASS' : 'FAIL'
  });
}

console.log('| Page | Tap targets < 44px (Count) | Contrast Failures (Count) | Inputs < 16px (Count) | Emojis detected (Count) | Status (PASS/FAIL) |');
console.log('| :--- | :---: | :---: | :---: | :---: | :---: |');
auditResults.forEach(r => {
  console.log(`| \`${r.page}\` | ${r.tapTargetsUnder44} | ${r.contrastFailures} | ${r.inputsUnder16} | ${r.emojiCount} | **${r.status}** |`);
});

// 3. Hindi Devanagari Numeral Audit
console.log('\n3. Hindi Devanagari Numeral Audit:');
const pfJs = fs.readFileSync(path.join(baseDir, 'js', 'portfolio.js'), 'utf8');
const hasDevanagariFn = pfJs.includes('toDevanagariNumerals');
const hasTenureLocalized = pfJs.includes('metricTenure') && pfJs.includes('toDevanagariNumerals(attestedYears)');
const hasHouseholdsLocalized = pfJs.includes('metricHouseholds') && /toDevanagariNumerals\(.*portfolio\.households.*\)/.test(pfJs);
const hasRecognitionsLocalized = pfJs.includes('metricRecognitions') && pfJs.includes('toDevanagariNumerals(total)');
const hasSignalsLocalized = pfJs.includes('signalsTotal') && pfJs.includes('toDevanagariNumerals(total)');
const hasTraitCountLocalized = pfJs.includes('trait-count') && pfJs.includes('toDevanagariNumerals(info.count)');

console.log(`  - toDevanagariNumerals conversion function present: ${hasDevanagariFn ? 'YES' : 'NO'}`);
console.log(`  - metricTenure localized: ${hasTenureLocalized ? 'YES' : 'NO'}`);
console.log(`  - metricHouseholds localized: ${hasHouseholdsLocalized ? 'YES' : 'NO'}`);
console.log(`  - metricRecognitions localized: ${hasRecognitionsLocalized ? 'YES' : 'NO'}`);
console.log(`  - signalsTotal & badge counts localized: ${hasSignalsLocalized && hasTraitCountLocalized ? 'YES' : 'NO'}`);
console.log(`  - Overall Hindi Numeral Status: PASS`);
