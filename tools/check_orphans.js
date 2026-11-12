const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const missing = [];

files.forEach(f => {
  const txt = fs.readFileSync(f, 'utf8');
  const regex = /(?:src|href)=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(txt)) !== null) {
    const p = match[1].split('?')[0].replace(/^\//, '');
    if (!p.startsWith('http') && !p.startsWith('data:') && !p.startsWith('#') && !p.startsWith('mailto:') && !p.startsWith('//') && !p.endsWith('.html') && !p.endsWith('.png') && !p.endsWith('.jpg') && !p.endsWith('.svg') && !p.endsWith('.ico') && !p.endsWith('.webmanifest')) {
      if (p.endsWith('.js') || p.endsWith('.css')) {
        if (!fs.existsSync(p)) {
          missing.push({ file: f, target: p });
        }
      }
    }
  }
});

console.log('ORPHAN_ASSETS_COUNT=' + missing.length);
if (missing.length > 0) {
  console.log(JSON.stringify(missing, null, 2));
}

// Check _redirects coverage
if (fs.existsSync('_redirects')) {
  const redirects = fs.readFileSync('_redirects', 'utf8');
  console.log('=== _redirects Content ===\n' + redirects.trim());
}
