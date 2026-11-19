import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const htmlSrc = path.join(rootDir, 'portfolio.html');
let html = fs.readFileSync(htmlSrc, 'utf8');

const injection = `
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof showTab === 'function') showTab('profile');
    if (typeof openEditProfileModal === 'function') openEditProfileModal();
    const nameInput = document.getElementById('editWorkerName') || document.getElementById('inputWorkerName');
    if (nameInput) nameInput.value = 'Asha Patil';
    const roleSelect = document.getElementById('editWorkerRole') || document.getElementById('selectWorkerRole');
    if (roleSelect) roleSelect.value = 'Senior Culinary Specialist';
    const uanInput = document.getElementById('editWorkerUan') || document.getElementById('inputWorkerUan');
    if (uanInput) uanInput.value = 'UAN 1009-8821-4921';
    const phoneInput = document.getElementById('editWorkerPhone') || document.getElementById('inputWorkerPhone');
    if (phoneInput) phoneInput.value = '+91 98200 12345';
    if (typeof saveWorkerProfile === 'function') {
      saveWorkerProfile({ preventDefault: () => {} });
    }
    const indicator = document.createElement('div');
    indicator.id = 'captureReady';
    document.body.appendChild(indicator);
  }, 100);
});
</script>
`;

const tempHtmlPath = path.join(rootDir, 'portfolio_asha_temp.html');
fs.writeFileSync(tempHtmlPath, html.replace('</body>', injection + '</body>'), 'utf8');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outPng = path.join(rootDir, 'evidence', 's1_profile_updated_360.png');
const fileUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');

console.log('Capturing screenshot from:', fileUrl);
try {
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=360,740',
    '--virtual-time-budget=2000',
    `--screenshot=${outPng}`,
    fileUrl
  ]);

  if (fs.existsSync(outPng)) {
    const stat = fs.statSync(outPng);
    console.log(`Success! Screenshot saved to ${outPng} (${stat.size} bytes)`);
  } else {
    console.error('Screenshot was not generated.');
  }
} catch (err) {
  console.error('Failed to run chrome:', err);
} finally {
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
}
