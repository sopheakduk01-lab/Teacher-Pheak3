import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Checking & Rebalancing QCM Correct Option Distribution for Lessons 15, 16, 17 ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

function rebalanceQuestionArray(questions) {
  // Target balance: ~10 for A(0), ~10 for B(1), ~10 for C(2), ~10 for D(3)
  const targetIndices = [];
  const numQ = questions.length;
  for (let i = 0; i < numQ; i++) {
    targetIndices.push(i % 4); // 0, 1, 2, 3, 0, 1, 2, 3...
  }

  // Shuffle targetIndices deterministically based on question index so it's not strictly repeating 0,1,2,3
  for (let i = numQ - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1);
    const temp = targetIndices[i];
    targetIndices[i] = targetIndices[j];
    targetIndices[j] = temp;
  }

  const updatedQuestions = questions.map((q, idx) => {
    const opts = q.opts || q.options || [];
    if (!opts || opts.length === 0) return q;

    // Find current correct option
    const correctIdx = opts.findIndex(o => o.c !== undefined ? o.c : o.isCorrect);
    if (correctIdx === -1) return q;

    const newTargetIdx = targetIndices[idx];
    if (correctIdx === newTargetIdx) return q;

    // Swap correct option to newTargetIdx
    const newOpts = [...opts];
    const temp = newOpts[correctIdx];
    newOpts[correctIdx] = newOpts[newTargetIdx];
    newOpts[newTargetIdx] = temp;

    return {
      ...q,
      opts: newOpts,
      options: newOpts
    };
  });

  // Calculate new distribution
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };
  updatedQuestions.forEach(q => {
    const opts = q.opts || q.options || [];
    const cIdx = opts.findIndex(o => o.c !== undefined ? o.c : o.isCorrect);
    if (cIdx !== -1) counts[cIdx]++;
  });

  return { updatedQuestions, counts };
}

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // Process Zi15, Zi16, Zi17
  const lessons = ['Zi15', 'Zi16', 'Zi17'];

  lessons.forEach(lName => {
    const reg = new RegExp(`${lName}=(\\[[\\s\\S]*?\\]),Iz`);
    const match = code.match(reg);
    if (match) {
      const qArray = JSON.parse(match[1]);
      console.log(`Original ${lName} total questions: ${qArray.length}`);

      // Count initial distribution
      const initialCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
      qArray.forEach(q => {
        const opts = q.opts || q.options || [];
        const cIdx = opts.findIndex(o => o.c !== undefined ? o.c : o.isCorrect);
        if (cIdx !== -1) initialCounts[cIdx]++;
      });
      console.log(`Initial ${lName} distribution:`, initialCounts);

      const { updatedQuestions, counts } = rebalanceQuestionArray(qArray);
      console.log(`Balanced ${lName} distribution:`, counts);

      const newString = `${lName}=${JSON.stringify(updatedQuestions)},Iz`;
      code = code.replace(reg, newString);
    } else {
      console.error(`Could not find ${lName} in ${filePath}`);
    }
  });

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + filePath);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Saved rebalanced QCM options into " + filePath + " successfully!");
  } catch (err) {
    console.error("Validation error in " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== Lessons 15, 16, 17 QCM Options Successfully Rebalanced Across A, B, C, D! ===");
