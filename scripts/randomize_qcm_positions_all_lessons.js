import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Randomizing QCM Correct Answer Positions with Fisher-Yates Shuffle ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

// Pseudo-random generator with seed for reproducibility or true random
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomizeQuestions(questions) {
  const numQ = questions.length;
  // Create an array with balanced counts (e.g. 10 of 0, 10 of 1, 10 of 2, 10 of 3)
  const baseIndices = [];
  const countPerOpt = Math.ceil(numQ / 4);
  for (let opt = 0; opt < 4; opt++) {
    for (let c = 0; c < countPerOpt; c++) {
      if (baseIndices.length < numQ) {
        baseIndices.push(opt);
      }
    }
  }

  // Perform multiple Fisher-Yates shuffles to ensure complete randomness without sequential pattern
  let randomTargets = shuffleArray(baseIndices);
  randomTargets = shuffleArray(randomTargets);

  const updatedQuestions = questions.map((q, idx) => {
    const opts = q.opts || q.options || [];
    if (!opts || opts.length === 0) return q;

    const currentCorrectIdx = opts.findIndex(o => o.c !== undefined ? o.c : o.isCorrect);
    if (currentCorrectIdx === -1) return q;

    const targetIdx = randomTargets[idx];
    if (currentCorrectIdx === targetIdx) return q;

    // Swap options array so correct answer moves to targetIdx
    const newOpts = [...opts];
    const temp = newOpts[currentCorrectIdx];
    newOpts[currentCorrectIdx] = newOpts[targetIdx];
    newOpts[targetIdx] = temp;

    return {
      ...q,
      opts: newOpts,
      options: newOpts
    };
  });

  // Calculate final counts and check pattern
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const patternSample = [];
  updatedQuestions.forEach((q, i) => {
    const opts = q.opts || q.options || [];
    const cIdx = opts.findIndex(o => o.c !== undefined ? o.c : o.isCorrect);
    if (cIdx !== -1) counts[cIdx]++;
    if (i < 15) patternSample.push(['ក (A)', 'ខ (B)', 'គ (C)', 'ឃ (D)'][cIdx]);
  });

  return { updatedQuestions, counts, patternSample };
}

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // Process all science lessons Zi1 through Zi17
  for (let lNum = 1; lNum <= 17; lNum++) {
    const lName = `Zi${lNum}`;
    const reg = new RegExp(`${lName}=(\\[[\\s\\S]*?\\]),Iz`);
    const match = code.match(reg);
    if (match) {
      try {
        const qArray = JSON.parse(match[1]);
        const { updatedQuestions, counts, patternSample } = randomizeQuestions(qArray);
        console.log(`Lesson ${lNum} (${lName}): counts =`, counts, `Sample sequence = [${patternSample.join(', ')}]`);

        const newString = `${lName}=${JSON.stringify(updatedQuestions)},Iz`;
        code = code.replace(reg, newString);
      } catch (e) {
        console.error(`Error parsing ${lName}:`, e.message);
      }
    }
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + filePath);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Saved randomized QCM options into " + filePath + " successfully!");
  } catch (err) {
    console.error("Validation error in " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== All Lessons QCM Answers Completely Randomized & Shuffled! ===");
