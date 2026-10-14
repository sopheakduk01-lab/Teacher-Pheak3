const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'src', 'data', 'mathLessonQcm');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Write lesson1.ts referencing existing 40Q
fs.writeFileSync(
  path.join(outDir, 'lesson1.ts'),
  `import { MATH_LESSON_1_40_QUESTIONS, MATH_LESSON_1_FORMULAS } from '../mathLesson1Exam40Q';
import { MathQCMQuestion, MathFormulaSection } from '../mathQcmTypes';

export const LESSON_1_QUESTIONS: MathQCMQuestion[] = MATH_LESSON_1_40_QUESTIONS;
export const LESSON_1_FORMULAS: MathFormulaSection[] = MATH_LESSON_1_FORMULAS;
`
);

console.log('Lesson 1 written successfully.');
