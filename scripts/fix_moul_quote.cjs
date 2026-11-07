const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public', 'assets', 'index-BwPwHqBe.js');
let content = fs.readFileSync(filePath, 'utf8');

const idx = content.indexOf('const printMoeysRegister=');
if (idx !== -1) {
  const snippet = content.slice(idx, idx + 1000);
  console.log(snippet);
  // Let us replace font-family: 'Moul',serif with font-family: \"Moul\",serif
  const fixed = snippet.replace(/font-family:'Moul',serif/g, 'font-family:"Moul",serif');
  content = content.slice(0, idx) + fixed + content.slice(idx + 1000);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed successfully!');
}
