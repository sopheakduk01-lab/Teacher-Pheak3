import fs from 'node:fs';
import vm from 'node:vm';

const clean = text => text.replace(/\s*\([^)]*\)/g, '').trim();

// Read Zi2_raw from inject-science-lesson-2.js
const injectScript = fs.readFileSync('scripts/inject-science-lesson-2.js', 'utf8');
const rawStart = injectScript.indexOf('const Zi2_raw = [');
const rawEnd = injectScript.indexOf('];', rawStart) + 2;
const zi2RawCode = "Zi2_raw = " + injectScript.substring(rawStart + "const Zi2_raw = ".length, rawEnd);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(zi2RawCode, sandbox);
const Zi2_raw = sandbox.Zi2_raw;

console.log("Original Zi2 questions count:", Zi2_raw.length);

// Re-balance Zi2_raw options so correct answers rotate 0, 1, 2, 3 (ក, ខ, គ, ឃ)
// Target pattern: 0, 1, 2, 3, 0, 1, 2, 3...
const rebalancedZi2 = Zi2_raw.map((item, qIdx) => {
  const targetCorrectIdx = qIdx % 4; // 0=A, 1=B, 2=C, 3=D

  // Clean title and hint
  const questionTitle = clean(item.q);
  const hintText = clean(item.h);

  // Find original correct option and original wrong options
  const origCorrectOpt = item.opts.find(o => o.c);
  const origWrongOpts = item.opts.filter(o => !o.c);

  // Build new options array of length 4
  const newOpts = new Array(4);

  // Put correct option at targetCorrectIdx
  newOpts[targetCorrectIdx] = {
    t: clean(origCorrectOpt.t),
    c: true,
    e: clean(origCorrectOpt.e)
  };

  // Fill the remaining 3 slots with cleaned wrong options
  let wrongPtr = 0;
  for (let i = 0; i < 4; i++) {
    if (i !== targetCorrectIdx) {
      const wrong = origWrongOpts[wrongPtr++];
      newOpts[i] = {
        t: clean(wrong.t),
        c: false,
        e: clean(wrong.e)
      };
    }
  }

  return {
    q: questionTitle,
    opts: newOpts,
    h: hintText
  };
});

// Verify distribution
const counts = [0, 0, 0, 0];
rebalancedZi2.forEach(q => {
  const correctIdx = q.opts.findIndex(o => o.c);
  counts[correctIdx]++;
});

console.log("Rebalanced Zi2 distribution (A, B, C, D):", counts);
if (counts[0] !== 10 || counts[1] !== 10 || counts[2] !== 10 || counts[3] !== 10) {
  console.error("Zi2 rebalance failed!");
  process.exit(1);
}

// Save to lesson2_questions.json
fs.writeFileSync('scripts/lesson2_questions.json', JSON.stringify(rebalancedZi2, null, 2));
console.log("Saved rebalanced Lesson 2 questions to scripts/lesson2_questions.json!");
