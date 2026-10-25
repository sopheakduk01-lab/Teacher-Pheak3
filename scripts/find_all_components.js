import fs from 'node:fs';

const code = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

const matches = [...code.matchAll(/var\s+(Rz\w*|qcm\w*|Lesson\w*|Modal\w*)\s*=/g)];
for (const m of matches) {
  console.log(m[1], "at index", m.index);
}
