// tests/test_cloudflare_deployment_hardening.js
// Automated verification suite for Project Maanyata Cloudflare Pages Hardening

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} ${details ? '- ' + details : ''}`);
    failed++;
  }
}

console.log('================================================================');
console.log('PROJECT MAANYATA — CLOUDFLARE PAGES HARDENING VERIFICATION TEST');
console.log('================================================================\n');

// 1. Audit _headers
console.log('--- 1. AUDITING _headers ---');
const headersContent = fs.readFileSync(path.join(__dirname, '..', '_headers'), 'utf-8');

assert(headersContent.includes('Strict-Transport-Security: max-age=31536000'), 'HSTS header configured');
assert(headersContent.includes('X-Frame-Options: SAMEORIGIN'), 'X-Frame-Options configured');
assert(headersContent.includes('X-Content-Type-Options: nosniff'), 'X-Content-Type-Options configured');
assert(headersContent.includes('Referrer-Policy: strict-origin-when-cross-origin'), 'Referrer-Policy configured');

// Check Permissions-Policy
const permMatch = headersContent.match(/Permissions-Policy:\s*([^\r\n]+)/);
assert(permMatch && permMatch[1].includes('camera=(self)'), 'Permissions-Policy grants camera access for Aadhaar/QR scanning');
assert(permMatch && permMatch[1].includes('geolocation=(self)'), 'Permissions-Policy grants geolocation for physical geofence verification');
assert(permMatch && permMatch[1].includes('microphone=()'), 'Permissions-Policy restricts microphone');

// Check CSP
const cspMatch = headersContent.match(/Content-Security-Policy:\s*([^\r\n]+)/);
assert(cspMatch !== null, 'Content-Security-Policy header present');
if (cspMatch) {
  const csp = cspMatch[1];
  assert(csp.includes("script-src 'self' 'unsafe-inline'"), 'CSP allows self and inline scripts for vanilla HTML/JS engines');
  assert(csp.includes("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"), 'CSP allows Google Fonts styles and inline styles');
  assert(csp.includes("font-src 'self' https://fonts.gstatic.com"), 'CSP allows Google Fonts webfonts');
  assert(csp.includes("img-src 'self' data: blob:"), 'CSP allows data and blob URLs for canvas/QR/selfie image processing');
  assert(csp.includes("media-src 'self' blob: data:"), 'CSP allows media stream for WebRTC live camera scanner');
  assert(csp.includes("connect-src 'self'"), 'CSP allows connect-src for API communication');
}

// Check Cache-Control for HTML and clean URLs
assert(headersContent.includes('/verify\n  Cache-Control: public, max-age=0, must-revalidate'), 'Clean route /verify has immediate freshness (max-age=0)');
assert(headersContent.includes('/portfolio\n  Cache-Control: public, max-age=0, must-revalidate'), 'Clean route /portfolio has immediate freshness (max-age=0)');
assert(headersContent.includes('/directory\n  Cache-Control: public, max-age=0, must-revalidate'), 'Clean route /directory has immediate freshness (max-age=0)');
assert(headersContent.includes('/sw.js\n  Cache-Control: public, max-age=0, must-revalidate'), 'Service Worker /sw.js has max-age=0 (preventing stale service worker lock)');

// 2. Audit _redirects & Clean Routing
console.log('\n--- 2. AUDITING _redirects & CLEAN ROUTING ---');
const redirectsContent = fs.readFileSync(path.join(__dirname, '..', '_redirects'), 'utf-8');

const requiredRoutes = [
  ['/verify', '/verify.html'],
  ['/portfolio', '/portfolio.html'],
  ['/directory', '/directory.html'],
  ['/onboard', '/onboard.html'],
  ['/endorse', '/endorse.html'],
  ['/proposal', '/rwa_pilot_proposal.html'],
  ['/rwa_pilot_proposal', '/rwa_pilot_proposal.html'],
  ['/sandstone_dossier', '/sandstone_dossier.html'],
  ['/vasudev_dossier', '/vasudev_dossier.html'],
  ['/beta', '/index_beta.html']
];

for (const [cleanRoute, targetFile] of requiredRoutes) {
  const linePattern = new RegExp(`^${cleanRoute}\\s+${targetFile}\\s+200`, 'm');
  assert(linePattern.test(redirectsContent), `Clean URL rewrite: ${cleanRoute} -> ${targetFile} (200 OK)`);
}

// 3. Audit sw.js (Service Worker)
console.log('\n--- 3. AUDITING sw.js (SERVICE WORKER) ---');
const swContent = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf-8');

assert(swContent.includes('const CACHE_NAME = "maanyata-v12-live";'), 'Cache version is incremented to maanyata-v12-live');
assert(swContent.includes('event.request.mode === "navigate"'), 'Navigation requests intercepted for Network-First strategy');
assert(swContent.includes('getCachedNavigationResponse'), 'Offline fallback routing helper getCachedNavigationResponse present');
assert(swContent.includes('./js/aadhaar_verifier.js'), 'Offline cache includes js/aadhaar_verifier.js for offline Aadhaar verification');
assert(swContent.includes('./js/dispute_modal.js'), 'Offline cache includes js/dispute_modal.js');

// 4. Audit _routes.json and wrangler.jsonc
console.log('\n--- 4. AUDITING _routes.json & wrangler.jsonc ---');
const routes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '_routes.json'), 'utf-8'));
assert(routes.version === 1 && routes.include.includes('/api/*'), '_routes.json targets /api/* exclusively');

const wranglerContent = fs.readFileSync(path.join(__dirname, '..', 'wrangler.jsonc'), 'utf-8');
assert(wranglerContent.includes('"pages_build_output_dir": "."'), 'wrangler.jsonc specifies pages_build_output_dir as root');
assert(wranglerContent.includes('"binding": "MAANYATA_KV"'), 'wrangler.jsonc configures MAANYATA_KV binding');

// 5. Audit Functions & API fallback
console.log('\n--- 5. AUDITING FUNCTIONS & API FALLBACK ---');
assert(fs.existsSync(path.join(__dirname, '..', 'functions', 'api', '[[catchall]].js')), '[[catchall]].js API fallback handler exists');

const apiFiles = [
  'endorse.js',
  'issue.js',
  'societies.js',
  'workers.js',
  '[[catchall]].js'
];

for (const f of apiFiles) {
  const p = path.join(__dirname, '..', 'functions', 'api', f);
  assert(fs.existsSync(p), `API route functions/api/${f} exists`);
}

// Run wrangler build verification
console.log('\n--- 6. RUNNING WRANGLER COMPILATION CHECK ---');
try {
  const buildOut = execSync('cmd.exe /c npx wrangler pages functions build', { encoding: 'utf-8', cwd: path.join(__dirname, '..') });
  assert(buildOut.includes('Compiled Worker successfully'), 'Cloudflare Pages Functions compile with zero errors');
} catch (e) {
  assert(false, 'Wrangler compilation check failed', e.message);
}

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
}
