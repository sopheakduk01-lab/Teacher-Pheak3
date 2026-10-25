import fs from 'node:fs';

const code = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

const rzRegex = /(Rz\d+)\s*=\s*(\{|\()/g;
let match;
while ((match = rzRegex.exec(code)) !== null) {
  console.log("Found component definition:", match[1], "at index:", match.index);
}
