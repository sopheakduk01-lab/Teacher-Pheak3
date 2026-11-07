const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public', 'assets', 'index-BwPwHqBe.js');
let content = fs.readFileSync(filePath, 'utf8');

const dreStart = content.indexOf('dre=({students');
console.log('dreStart:', dreStart);

const switcherIdx = content.indexOf('e.jsxs("div",{className:"flex items-center gap-1 bg-slate-100 p-1 rounded-2xl",children:[', dreStart);
console.log('switcherIdx:', switcherIdx);
if (switcherIdx !== -1) {
  console.log(content.slice(switcherIdx, switcherIdx + 300));
}
