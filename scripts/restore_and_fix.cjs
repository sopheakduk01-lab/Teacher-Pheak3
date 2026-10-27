const fs = require('fs');
const esbuild = require('esbuild');

const bakPath = 'public/assets/index-BwPwHqBe.js.original_bak';
const pubPath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

if (!fs.existsSync(bakPath)) {
  console.error('Backup not found!');
  process.exit(1);
}

let code = fs.readFileSync(bakPath, 'utf8');

// If we want to inject font controls into QCM headers or anywhere, let's do it cleanly.
// Wait, where are QCM headers rendered in index-BwPwHqBe.js?
// Let's search for speakText or question card header.
// Let's check if index.html already has the global font widget (it does!).
// Do we need to inject font resizer buttons into QCM headers inside index-BwPwHqBe.js? 
// The global floating widget (#app-global-font-widget) is already present on every page via index.html!
// But if some code tried to inject buttons into QCM headers and created a syntax error, let's see what happens if we just use the original backup or add the font controls without syntax errors.

console.log('Restoring from original backup...');
fs.writeFileSync(pubPath, code, 'utf8');
if (!fs.existsSync('dist/assets')) {
  fs.mkdirSync('dist/assets', { recursive: true });
}
fs.writeFileSync(distPath, code, 'utf8');

try {
  esbuild.transformSync(code, { loader: 'js' });
  console.log('Restored backup transformed & validated successfully!');
} catch (err) {
  console.error('Validation error on restored backup:', err);
  process.exit(1);
}
