import fs from 'node:fs';

const code = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

const matches = [...code.matchAll(/([A-Za-z0-9_]{2,15})\s*=\s*\(\s*\{\s*isOpen/g)];
for (const m of matches) {
  console.log("Modal component:", m[1], "at index:", m.index);
}
