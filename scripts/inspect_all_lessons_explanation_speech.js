import fs from 'node:fs';

const code = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

console.log("=== Inspecting Explanation Speech across Rz1 - Rz17 ===");

for (let i = 1; i <= 17; i++) {
  const rzName = `Rz${i}=({`;
  const pos = code.indexOf(rzName);
  if (pos !== -1) {
    const chunk = code.slice(pos, pos + 10000);
    const hasQuestionSpeech = chunk.includes('ស្ដាប់សំណួរ') || chunk.includes('speakText');
    const hasExpSpeech = chunk.includes('ស្ដាប់ពន្យល់');
    const hasOverviewSpeech = chunk.includes('ស្ដាប់ការអាន') || chunk.includes('ស្ដាប់មេរៀន') || chunk.includes('ស្ដាប់ពន្យល់មេរៀន');
    console.log(`Lesson ${i} (${rzName}): QuestionSpeech=${hasQuestionSpeech}, ExpSpeech=${hasExpSpeech}, OverviewSpeech=${hasOverviewSpeech}`);
  } else {
    console.log(`Lesson ${i} (${rzName}): NOT FOUND in main bundle!`);
  }
}
