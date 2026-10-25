import fs from 'node:fs';

const code = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

const pos = code.indexOf('Rz17');
if (pos !== -1) {
  console.log("Context before Rz17:", JSON.stringify(code.slice(pos - 30, pos + 30)));
}
const pos2 = code.indexOf('Rz16');
if (pos2 !== -1) {
  console.log("Context before Rz16:", JSON.stringify(code.slice(pos2 - 30, pos2 + 30)));
}
