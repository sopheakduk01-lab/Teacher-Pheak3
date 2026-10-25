import fs from 'node:fs';

const code = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

const rz17Start = code.indexOf('Rz17=({');
if (rz17Start !== -1) {
  console.log("Found Rz17 at index", rz17Start);
  const rz17Code = code.slice(rz17Start, rz17Start + 12000);
  console.log("Rz17 snippet length:", rz17Code.length);
  // Look for speakText occurrences in Rz17
  const speakMatches = rz17Code.match(/speakText\([^)]+\)/g);
  console.log("speakText calls in Rz17:", speakMatches);
} else {
  console.log("Rz17 NOT FOUND");
}
