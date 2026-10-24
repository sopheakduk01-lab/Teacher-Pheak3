import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

console.log("=== Master Injector: Science Lessons 2, 3, 4, 5, 6, 7 & 8 ===");

const backupPath = path.resolve("public/assets/index-BwPwHqBe.js.original_bak");
if (!fs.existsSync(backupPath)) {
  console.error("Backup file not found!");
  process.exit(1);
}

let code = fs.readFileSync(backupPath, "utf8");
console.log("Loaded pristine backup code, size:", code.length);

function createRng(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function shuffleOptionsAndBalance(questions, seed) {
  const rng = createRng(seed);
  const targetAnsSeq = [
    0,2,1,3, 1,0,3,2, 2,3,0,1, 3,1,2,0, 0,3,1,2,
    2,0,3,1, 1,2,0,3, 3,0,2,1, 0,1,3,2, 2,3,1,0
  ];
  return questions.map((q, idx) => {
    const targetCorrectIdx = targetAnsSeq[idx % targetAnsSeq.length];
    const opts = q.opts || q.options;
    const isStandardFormat = !!q.options;
    const isCorrect = (o) => isStandardFormat ? !!o.isCorrect : !!o.c;
    const origCorrect = opts.find(isCorrect);
    const origDistractors = opts.filter(o => !isCorrect(o));
    
    for (let i = origDistractors.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [origDistractors[i], origDistractors[j]] = [origDistractors[j], origDistractors[i]];
    }
    
    const newOpts = [];
    let distractorCounter = 0;
    for (let i = 0; i < 4; i++) {
      if (i === targetCorrectIdx) {
        newOpts.push(origCorrect);
      } else {
        newOpts.push(origDistractors[distractorCounter++]);
      }
    }
    
    if (isStandardFormat) {
      return {
        question: q.question,
        options: newOpts,
        hint: q.hint
      };
    } else {
      return {
        q: q.q,
        opts: newOpts,
        h: q.h
      };
    }
  });
}

// 1. Zi Shuffle
const ziStart = code.indexOf("Zi=[");
if (ziStart !== -1) {
  let depth = 0;
  let ziEnd = -1;
  for (let i = ziStart + 3; i < code.length; i++) {
    if (code[i] === "[") depth++;
    if (code[i] === "]") {
      depth--;
      if (depth === 0) {
        ziEnd = i + 1;
        break;
      }
    }
  }
  if (ziEnd !== -1) {
    const origZiSlice = code.substring(ziStart + 3, ziEnd);
    const origZi = vm.runInNewContext(origZiSlice);
    const shuffledZi = shuffleOptionsAndBalance(origZi, 42);
    console.log("Replacing original Zi with shuffled Zi in code...");
    code = code.slice(0, ziStart + 3) + JSON.stringify(shuffledZi) + code.slice(ziEnd);
  }
}

// 2. Questions JSONs
const questions2 = JSON.parse(fs.readFileSync("scripts/lesson2_questions.json", "utf8"));
const questions3 = JSON.parse(fs.readFileSync("scripts/lesson3_questions.json", "utf8"));
const questions4 = JSON.parse(fs.readFileSync("scripts/lesson4_questions.json", "utf8"));
const questions5 = JSON.parse(fs.readFileSync("scripts/lesson5_questions.json", "utf8"));
const questions6 = JSON.parse(fs.readFileSync("scripts/lesson6_questions.json", "utf8"));
const questions7 = JSON.parse(fs.readFileSync("scripts/lesson7_questions.json", "utf8"));
const questions8 = JSON.parse(fs.readFileSync("scripts/lesson8_questions.json", "utf8"));

const shuffled2 = shuffleOptionsAndBalance(questions2, 101);
const shuffled3 = shuffleOptionsAndBalance(questions3, 202);
const shuffled4 = shuffleOptionsAndBalance(questions4, 303);
const shuffled5 = shuffleOptionsAndBalance(questions5, 404);
const shuffled6 = shuffleOptionsAndBalance(questions6, 505);
const shuffled7 = shuffleOptionsAndBalance(questions7, 606);
const shuffled8 = shuffleOptionsAndBalance(questions8, 707);

const zi2Str = "Zi2=" + JSON.stringify(shuffled2);
const zi3Str = "Zi3=" + JSON.stringify(shuffled3);
const zi4Str = "Zi4=" + JSON.stringify(shuffled4);
const zi5Str = "Zi5=" + JSON.stringify(shuffled5);
const zi6Str = "Zi6=" + JSON.stringify(shuffled6);
const zi7Str = "Zi7=" + JSON.stringify(shuffled7);
const zi8Str = "Zi8=" + JSON.stringify(shuffled8);

const iz2Str = 'Iz2={id:"science-lesson-2-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ២ - ការដាំដំណាំ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ២ ៖ ការដាំដំណាំ",questions:Zi2}';
const iz3Str = 'Iz3={id:"science-lesson-3-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ៣ - ការចិញ្ចឹមសត្វ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ៣ ៖ ការចិញ្ចឹមសត្វ",questions:Zi3}';
const iz4Str = 'Iz4={id:"science-lesson-4-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ៤ - បរិស្ថានធម្មជាតិ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ",questions:Zi4}';
const iz5Str = 'Iz5={id:"science-lesson-5-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ៥ - ធនធានធម្មជាតិ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ៥ ៖ ធនធានធម្មជាតិ",questions:Zi5}';
const iz6Str = 'Iz6={id:"science-lesson-6-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ៦ - ប្រដាប់បន្តពូជមនុស្ស",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ៦ ៖ ប្រដាប់បន្តពូជមនុស្ស",questions:Zi6}';
const iz7Str = 'Iz7={id:"science-lesson-7-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ៧ - ភាពពេញវ័យ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ៧ ៖ ភាពពេញវ័យ",questions:Zi7}';
const iz8Str = 'Iz8={id:"science-lesson-8-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ៨ - ការការពារកុំឱ្យមានគភ៌",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌",questions:Zi8}';

const izTarget = "Iz={id:";
const izIdx = code.indexOf(izTarget);
if (izIdx === -1) throw new Error("Target Iz={id: not found!");

console.log("Injecting Zi2..8, Iz2..8 before Iz at index:", izIdx);
code = code.slice(0, izIdx) + `${zi2Str},${iz2Str},${zi3Str},${iz3Str},${zi4Str},${iz4Str},${zi5Str},${iz5Str},${zi6Str},${zi6Str},${zi7Str},${iz7Str},${zi8Str},${zi8Str},`.replaceAll(",Zi", ",zi").replaceAll(",Iz", ",iz").replaceAll("${zi", "${zi").replaceAll("${iz", "${iz") + code.slice(izIdx);
// Wait, I see the error in my CodeContent. I should just write the correct line.
code = code.slice(0, izIdx) + `${zi2Str},${iz2Str},${zi3Str},${iz3Str},${zi4Str},${zi4Str},${zi5Str},${iz5Str},${zi6Str},${zi6Str},${zi7Str},${iz7Str},${zi8Str},${iz8Str},` + code.slice(izIdx);
// Actually, let me just fix it properly in the next tool call.
// I'll just write the whole file with the FIX.
