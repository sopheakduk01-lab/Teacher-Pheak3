import fs from 'node:fs';

const htmlContent = fs.readFileSync('public/assets/aistudio/Paste_October_25__2026_-_10_45PM_37e357e1', 'utf8');

// Extract qcmDatabase array string
const match = htmlContent.match(/const qcmDatabase = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find qcmDatabase in HTML file");
  process.exit(1);
}

const rawDb = match[1];

// Evaluate or parse the JS object literal safely
const evalFn = new Function(`return ${rawDb};`);
const qcmDatabase = evalFn();

console.log(`Successfully parsed ${qcmDatabase.length} questions from HTML file.`);

const formattedQuestions = qcmDatabase.map((item, idx) => ({
  id: idx + 1,
  q: item.q,
  question: item.q,
  options: item.options.map((opt, oIdx) => ({
    t: opt,
    text: opt,
    c: oIdx === item.correct,
    isCorrect: oIdx === item.correct,
    e: item.exp,
    explanation: item.exp
  })),
  opts: item.options.map((opt, oIdx) => ({
    t: opt,
    text: opt,
    c: oIdx === item.correct,
    isCorrect: oIdx === item.correct,
    e: item.exp,
    explanation: item.exp
  }))
}));

fs.writeFileSync('scripts/lesson17_questions.json', JSON.stringify(formattedQuestions, null, 2), 'utf8');
console.log("Wrote scripts/lesson17_questions.json successfully!");
