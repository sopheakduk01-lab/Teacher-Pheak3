import fs from 'node:fs';

const code = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

const start = code.indexOf('Rz17=({');
const end = code.indexOf(',\nRz16=({', start);

console.log("Rz17 range:", start, "to", end);
if (start !== -1 && end !== -1) {
  const rz17Def = code.slice(start, end);
  console.log("Rz17 Definition Length:", rz17Def.length);
  fs.writeFileSync('scripts/rz17_extracted.js', rz17Def, 'utf8');
}
