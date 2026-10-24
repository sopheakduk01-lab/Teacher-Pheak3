import fs from 'node:fs';
import esbuild from 'esbuild';

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

let code = fs.readFileSync(filePath, 'utf8');
console.log("Initial bundle length:", code.length);

// 1. Prepare 40 Questions for Zi11 and Iz11
const l11Questions = JSON.parse(fs.readFileSync('scripts/lesson11_questions.json', 'utf8'));
const zi11Questions = l11Questions.map(q => ({
  q: q.question,
  opts: q.options.map(o => ({
    t: o.text,
    c: o.isCorrect,
    e: o.explanation
  }))
}));

const zi11Marker = 'Zi11=';
const zi11EndMarker = 'questions:Zi11},';
const zi11Start = code.indexOf(zi11Marker);
const zi11End = code.indexOf(zi11EndMarker, zi11Start);

if (zi11Start !== -1 && zi11End !== -1) {
  const newZi11AndIz11 = `Zi11=${JSON.stringify(zi11Questions)},Iz11={id:"science-lesson-11-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ១១ - ប្រដាប់របត់ឈាម",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:25,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ១១ ៖ ប្រដាប់របត់ឈាម (ជំពូកទី ៣ ៖ មនុស្ស ភាពពេញវ័យ និងជំងឺ)",questions:Zi11},`;
  code = code.slice(0, zi11Start) + newZi11AndIz11 + code.slice(zi11End + zi11EndMarker.length);
  console.log("1. Replaced Zi11 and Iz11 with 40 questions successfully!");
} else {
  console.error("Could not find Zi11 and Iz11 markers!");
  process.exit(1);
}

// 2. Prepare 40 Questions for Zi12 and Iz12
const l12Questions = JSON.parse(fs.readFileSync('scripts/lesson12_questions.json', 'utf8'));
const zi12Questions = l12Questions.map(q => ({
  q: q.question,
  opts: q.options.map(o => ({
    t: o.text,
    c: o.isCorrect,
    e: o.explanation
  }))
}));

const zi12Marker = 'Zi12=';
const zi12EndMarker = 'questions:Zi12},';
const zi12Start = code.indexOf(zi12Marker);
const zi12End = code.indexOf(zi12EndMarker, zi12Start);

if (zi12Start !== -1 && zi12End !== -1) {
  const newZi12AndIz12 = `Zi12=${JSON.stringify(zi12Questions)},Iz12={id:"science-lesson-12-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ១២ - ការប្រែប្រួលរូបធាតុ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:25,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ១២ ៖ ការប្រែប្រួលរូបធាតុ (ជំពូកទី ៤)",questions:Zi12},`;
  code = code.slice(0, zi12Start) + newZi12AndIz12 + code.slice(zi12End + zi12EndMarker.length);
  console.log("2. Replaced Zi12 and Iz12 with 40 questions successfully!");
} else {
  console.error("Could not find Zi12 and Iz12 markers!");
  process.exit(1);
}

// 2. Prepare Rz12 component code
let rz12Raw = fs.readFileSync('scripts/rz12_component_code.js', 'utf8').trim();
if (rz12Raw.startsWith('var Rz12 =')) {
  rz12Raw = rz12Raw.replace(/^var Rz12\s*=\s*/, '');
}
if (rz12Raw.endsWith(';')) {
  rz12Raw = rz12Raw.slice(0, -1);
}

// Replace Rz12 in bundle
const rz12StartMarker = 'Rz12=';
const rz12EndMarker = 'Rz11=';
const rz12Start = code.indexOf(rz12StartMarker);
const rz12End = code.indexOf(rz12EndMarker, rz12Start);

if (rz12Start !== -1 && rz12End !== -1) {
  code = code.slice(0, rz12Start + rz12StartMarker.length) + rz12Raw + ",\n" + code.slice(rz12End);
  console.log("2. Replaced Rz12 component with enhanced 40 QCM & Fullscreen version successfully!");
} else {
  console.error("Could not find Rz12 and Rz11 markers!");
  process.exit(1);
}

// 3. Prepare Rz11 component code
let rz11Raw = fs.readFileSync('scripts/rz11_component_code.js', 'utf8').trim();
if (rz11Raw.startsWith('var Rz11 =')) {
  rz11Raw = rz11Raw.replace(/^var Rz11\s*=\s*/, '');
}
if (rz11Raw.endsWith(';')) {
  rz11Raw = rz11Raw.slice(0, -1);
}

// Replace Rz11 in bundle
const rz11StartMarker = 'Rz11=';
const rz11EndMarker = ',Rz=';
const rz11Start = code.indexOf(rz11StartMarker);
const rz11End = code.indexOf(rz11EndMarker, rz11Start);

if (rz11Start !== -1 && rz11End !== -1) {
  code = code.slice(0, rz11Start + rz11StartMarker.length) + rz11Raw + code.slice(rz11End);
  console.log("3. Replaced Rz11 component with enhanced Fullscreen & Shuffled Options version successfully!");
} else {
  console.error("Could not find Rz11 and Rz markers!");
  process.exit(1);
}

// 4. Update Card text from 20 to 40 questions
code = code.replace(/ជំពូកទី ៤ • ២០ សំណួរ QCM/g, 'ជំពូកទី ៤ • ៤០ សំណួរ QCM');
code = code.replace(/២០ QCM/g, '៤០ QCM');
code = code.replace(/ប្រឡង ២០ QCM/g, 'ប្រឡង ៤០ QCM');
console.log("4. Updated Card labels to 40 QCM!");

// 5. Validate bundle
try {
  esbuild.transformSync(code, { loader: "js" });
  console.log("ESBUILD VALIDATION: Bundle syntax passed 100%!");
} catch (err) {
  console.error("Syntax Error in bundled code:", err.message);
  process.exit(1);
}

// Write to files
fs.writeFileSync(filePath, code, 'utf8');
if (fs.existsSync(distPath)) {
  fs.writeFileSync(distPath, code, 'utf8');
}
console.log("SUCCESS! Both Lesson 11 & Lesson 12 fully updated in bundle!");
