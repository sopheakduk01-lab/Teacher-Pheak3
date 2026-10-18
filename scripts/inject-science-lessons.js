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
code = code.slice(0, izIdx) + `${zi2Str},${iz2Str},${zi3Str},${iz3Str},${zi4Str},${iz4Str},${zi5Str},${iz5Str},${zi6Str},${iz6Str},${zi7Str},${iz7Str},${zi8Str},${iz8Str},` + code.slice(izIdx);

const examTarget = "exam1={id:";
const examIdx = code.indexOf(examTarget);
if (examIdx !== -1) {
  const exam2Str = 'exam2={id:"exam-science-lesson-2",title:"ប្រឡងឆមាស ៖ មេរៀនទី ២ (ការដាំដំណាំ)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"ការប្រឡងតេស្តសមត្ថភាពមេរៀនទី ២ ៖ ការដាំដំណាំ",questions:Zi2}';
  const exam3Str = 'exam3={id:"exam-science-lesson-3",title:"ប្រឡងឆមាស ៖ មេរៀនទី ៣ (ការចិញ្ចឹមសត្វ)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"ការប្រឡងតេស្តសមត្ថភាពមេរៀនទី ៣ ៖ ការចិញ្ចឹមសត្វ",questions:Zi3}';
  const exam4Str = 'exam4={id:"exam-science-lesson-4",title:"ប្រឡងឆមាស ៖ មេរៀនទី ៤ (បរិស្ថានធម្មជាតិ)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"ការប្រឡងតេស្តសមត្ថភាពមេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ",questions:Zi4}';
  const exam5Str = 'exam5={id:"exam-science-lesson-5",title:"ប្រឡងឆមាស ៖ មេរៀនទី ៥ (ធនធានធម្មជាតិ)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"ការប្រឡងតេស្តសមត្ថភាពមេរៀនទី ៥ ៖ ធនធានធម្មជាតិ",questions:Zi5}';
  const exam6Str = 'exam6={id:"exam-science-lesson-6",title:"ប្រឡងឆមាស ៖ មេរៀនទី ៦ (ប្រដាប់បន្តពូជមនុស្ស)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"ការប្រឡងតេស្តសមត្ថភាពមេរៀនទី ៦ ៖ ប្រដាប់បន្តពូជមនុស្ស",questions:Zi6}';
  const exam7Str = 'exam7={id:"exam-science-lesson-7",title:"ប្រឡងឆមាស ៖ មេរៀនទី ៧ (ភាពពេញវ័យ)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"ការប្រឡងតេស្តសមត្ថភាពមេរៀនទី ៧ ៖ ភាពពេញវ័យ",questions:Zi7}';
  const exam8Str = 'exam8={id:"exam-science-lesson-8",title:"ប្រឡងឆមាស ៖ មេរៀនទី ៨ (ការការពារកុំឱ្យមានគភ៌)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"ការប្រឡងតេស្តសមត្ថភាពមេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌",questions:Zi8}';

  console.log("Injecting exam2..8 before exam1 at index:", examIdx);
  code = code.slice(0, examIdx) + `${exam2Str},${exam3Str},${exam4Str},${exam5Str},${exam6Str},${exam7Str},${exam8Str},` + code.slice(examIdx);
}

const qChar = String.fromCharCode(34);
const rzTarget = "Rz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a=" + qChar + "tab-hero" + qChar + "})";
const rzIdx = code.indexOf(rzTarget);
if (rzIdx === -1) throw new Error("Target Rz=... not found!");

let rz2Code = fs.readFileSync(path.resolve("scripts/rz2_component_code.js"), "utf8").trim();
if (rz2Code.startsWith("var Rz2 =") || rz2Code.startsWith("var Rz2=")) rz2Code = rz2Code.replace(/^var\s+Rz2\s*=\s*/, "");
if (rz2Code.endsWith(";")) rz2Code = rz2Code.slice(0, -1);

let rz3Code = fs.readFileSync(path.resolve("scripts/rz3_component_code.js"), "utf8").trim();
if (rz3Code.startsWith("var Rz3 =") || rz3Code.startsWith("var Rz3=")) rz3Code = rz3Code.replace(/^var\s+Rz3\s*=\s*/, "");
if (rz3Code.endsWith(";")) rz3Code = rz3Code.slice(0, -1);

let rz4Code = fs.readFileSync(path.resolve("scripts/rz4_component_code.js"), "utf8").trim();
if (rz4Code.startsWith("var Rz4 =") || rz4Code.startsWith("var Rz4=")) rz4Code = rz4Code.replace(/^var\s+Rz4\s*=\s*/, "");
if (rz4Code.endsWith(";")) rz4Code = rz4Code.slice(0, -1);

let rz5Code = fs.readFileSync(path.resolve("scripts/rz5_component_code.js"), "utf8").trim();
if (rz5Code.startsWith("var Rz5 =") || rz5Code.startsWith("var Rz5=")) rz5Code = rz5Code.replace(/^var\s+Rz5\s*=\s*/, "");
if (rz5Code.endsWith(";")) rz5Code = rz5Code.slice(0, -1);

let rz6Code = fs.readFileSync(path.resolve("scripts/rz6_component_code.js"), "utf8").trim();
if (rz6Code.startsWith("var Rz6 =") || rz6Code.startsWith("var Rz6=")) rz6Code = rz6Code.replace(/^var\s+Rz6\s*=\s*/, "");
if (rz6Code.endsWith(";")) rz6Code = rz6Code.slice(0, -1);

let rz7Code = fs.readFileSync(path.resolve("scripts/rz7_component_code.js"), "utf8").trim();
if (rz7Code.startsWith("var Rz7 =") || rz7Code.startsWith("var Rz7=")) rz7Code = rz7Code.replace(/^var\s+Rz7\s*=\s*/, "");
if (rz7Code.endsWith(";")) rz7Code = rz7Code.slice(0, -1);

let rz8Code = fs.readFileSync(path.resolve("scripts/rz8_component_code.js"), "utf8").trim();
if (rz8Code.startsWith("var Rz8 =") || rz8Code.startsWith("var Rz8=")) rz8Code = rz8Code.replace(/^var\s+Rz8\s*=\s*/, "");
if (rz8Code.endsWith(";")) rz8Code = rz8Code.slice(0, -1);

console.log("Injecting Rz2..8 before Rz at index:", rzIdx);
code = code.slice(0, rzIdx) + `Rz2=${rz2Code},Rz3=${rz3Code},Rz4=${rz4Code},Rz5=${rz5Code},Rz6=${rz6Code},Rz7=${rz7Code},Rz8=${rz8Code},` + code.slice(rzIdx);

const stateTarget = '[Xe,Oe]=y.useState(!1),[ze,qe]=y.useState("tab-hero")';
const stateIdx = code.indexOf(stateTarget);
if (stateIdx === -1) throw new Error("Target state variables not found!");

console.log("Injecting state variables for Lesson 2..8 at index:", stateIdx);
code = code.slice(0, stateIdx) + '[Xe,Oe]=y.useState(!1),[ze,qe]=y.useState("tab-hero"),[Xe2,Oe2]=y.useState(!1),[ze2,qe2]=y.useState("tab-hero"),[Xe3,Oe3]=y.useState(!1),[ze3,qe3]=y.useState("tab-hero"),[Xe4,Oe4]=y.useState(!1),[ze4,qe4]=y.useState("tab-hero"),[Xe5,Oe5]=y.useState(!1),[ze5,qe5]=y.useState("tab-hero"),[Xe6,Oe6]=y.useState(!1),[ze6,qe6]=y.useState("tab-hero"),[Xe7,Oe7]=y.useState(!1),[ze7,qe7]=y.useState("tab-hero"),[Xe8,Oe8]=y.useState(!1),[ze8,qe8]=y.useState("tab-hero")' + code.slice(stateIdx + stateTarget.length);

const card1EndTarget = ']},"science-lesson-1")';
const card1EndIdx = code.indexOf(card1EndTarget);
if (card1EndIdx === -1) throw new Error("Target card1EndTarget not found!");

const card2Code = fs.readFileSync(path.resolve("scripts/card2_jsx.js"), "utf8").trim();
const card3Code = fs.readFileSync(path.resolve("scripts/card3_jsx.js"), "utf8").trim();
const card4Code = fs.readFileSync(path.resolve("scripts/card4_jsx.js"), "utf8").trim();
const card5Code = fs.readFileSync(path.resolve("scripts/card5_jsx.js"), "utf8").trim();
const card6Code = fs.readFileSync(path.resolve("scripts/card6_jsx.js"), "utf8").trim();
const card7Code = fs.readFileSync(path.resolve("scripts/card7_jsx.js"), "utf8").trim();
const card8Code = fs.readFileSync(path.resolve("scripts/card8_jsx.js"), "utf8").trim();

console.log("Injecting Card 2..8 into carousel at index:", card1EndIdx);
code = code.slice(0, card1EndIdx + card1EndTarget.length) + "," + card2Code + "," + card3Code + "," + card4Code + "," + card5Code + "," + card6Code + "," + card7Code + "," + card8Code + code.slice(card1EndIdx + card1EndTarget.length);

const unshiftTarget = 'return at.some(ys=>ys.id===Iz.id||ys.subject==="វិទ្យាសាស្ត្រ"&&ys.title.includes("មេរៀនទី ១"))||at.unshift(Iz),at';
const unshiftIdx = code.indexOf(unshiftTarget);
if (unshiftIdx !== -1) {
  console.log("Injecting Iz2..8 into quizzes unshift at index:", unshiftIdx);
  const unshiftReplacement = 'return at.some(ys=>ys.id===Iz2.id||ys.title.includes("មេរៀនទី ២"))||at.unshift(Iz2),at.some(ys=>ys.id===Iz3.id||ys.title.includes("មេរៀនទី ៣"))||at.unshift(Iz3),at.some(ys=>ys.id===Iz4.id||ys.title.includes("មេរៀនទី ៤"))||at.unshift(Iz4),at.some(ys=>ys.id===Iz5.id||ys.title.includes("មេរៀនទី ៥"))||at.unshift(Iz5),at.some(ys=>ys.id===Iz6.id||ys.title.includes("មេរៀនទី ៦"))||at.unshift(Iz6),at.some(ys=>ys.id===Iz7.id||ys.title.includes("មេរៀនទី ៧"))||at.unshift(Iz7),at.some(ys=>ys.id===Iz8.id||ys.title.includes("មេរៀនទី ៨"))||at.unshift(Iz8),at.some(ys=>ys.id===Iz.id||ys.subject==="វិទ្យាសាស្ត្រ"&&ys.title.includes("មេរៀនទី ១"))||at.unshift(Iz),at';
  code = code.slice(0, unshiftIdx) + unshiftReplacement + code.slice(unshiftIdx + unshiftTarget.length);
}

const clickTarget = 'else if(Ds)qe("tab-quiz"),Oe(!0);';
const clickIdx = code.indexOf(clickTarget);
if (clickIdx === -1) throw new Error("Target clickTarget not found!");

const clickReplacement = 'else if(Ds){if(Pt.id.includes("lesson-8")||Pt.id.includes("lesson8")||Pt.title.includes("មេរៀនទី ៨")||Pt.title.includes("ការការពារកុំឱ្យមានគភ៌"))qe8("tab-quiz"),Oe8(!0);else if(Pt.id.includes("lesson-7")||Pt.id.includes("lesson7")||Pt.title.includes("មេរៀនទី ៧")||Pt.title.includes("ភាពពេញវ័យ"))qe7("tab-quiz"),Oe7(!0);else if(Pt.id.includes("lesson-6")||Pt.id.includes("lesson6")||Pt.title.includes("មេរៀនទី ៦")||Pt.title.includes("ប្រដាប់បន្តពូជមនុស្ស"))qe6("tab-quiz"),Oe6(!0);else if(Pt.id.includes("lesson-5")||Pt.id.includes("lesson5")||Pt.title.includes("មេរៀនទី ៥")||Pt.title.includes("ធនធានធម្មជាតិ"))qe5("tab-quiz"),Oe5(!0);else if(Pt.id.includes("lesson-4")||Pt.id.includes("lesson4")||Pt.title.includes("មេរៀនទី ៤")||Pt.title.includes("បរិស្ថានធម្មជាតិ"))qe4("tab-quiz"),Oe4(!0);else if(Pt.id.includes("lesson-3")||Pt.id.includes("lesson3")||Pt.title.includes("មេរៀនទី ៣")||Pt.title.includes("ការថែរក្សាសត្វ"))qe3("tab-quiz"),Oe3(!0);else if(Pt.id.includes("lesson-2")||Pt.id.includes("lesson2")||Pt.title.includes("មេរៀនទី ២")||Pt.title.includes("ការដាំដំណាំ"))qe2("tab-quiz"),Oe2(!0);else qe("tab-quiz"),Oe(!0);}';
console.log("Injecting quiz launcher condition at index:", clickIdx);
code = code.slice(0, clickIdx) + clickReplacement + code.slice(clickIdx + clickTarget.length);

const modalTarget = 'e.jsx(Rz,{isOpen:Xe,onClose:()=>Oe(!1),onShowToast:u,initialTab:ze})';
const modalIdx = code.indexOf(modalTarget);
if (modalIdx === -1) throw new Error("Target modalTarget not found!");

const modalReplacement = 'e.jsx(Rz,{isOpen:Xe,onClose:()=>Oe(!1),onShowToast:u,initialTab:ze}),e.jsx(Rz2,{isOpen:Xe2,onClose:()=>Oe2(!1),onShowToast:u,initialTab:ze2}),e.jsx(Rz3,{isOpen:Xe3,onClose:()=>Oe3(!1),onShowToast:u,initialTab:ze3}),e.jsx(Rz4,{isOpen:Xe4,onClose:()=>Oe4(!1),onShowToast:u,initialTab:ze4}),e.jsx(Rz5,{isOpen:Xe5,onClose:()=>Oe5(!1),onShowToast:u,initialTab:ze5}),e.jsx(Rz6,{isOpen:Xe6,onClose:()=>Oe6(!1),onShowToast:u,initialTab:ze6}),e.jsx(Rz7,{isOpen:Xe7,onClose:()=>Oe7(!1),onShowToast:u,initialTab:ze7}),e.jsx(Rz8,{isOpen:Xe8,onClose:()=>Oe8(!1),onShowToast:u,initialTab:ze8})';
console.log("Injecting Rz2..8 modal JSX at index:", modalIdx);
code = code.slice(0, modalIdx) + modalReplacement + code.slice(modalIdx + modalTarget.length);

console.log("--- All modifications complete. Verifying bundle syntax... ---");
try {
  new vm.Script(code);
  console.log("SUCCESS: Full modified bundle parses with ZERO syntax errors!");
} catch (err) {
  console.error("PARSE ERROR in modified bundle:", err);
  process.exit(1);
}

const distAssetsDir = path.resolve("dist/assets");
if (!fs.existsSync(distAssetsDir)) {
  fs.mkdirSync(distAssetsDir, { recursive: true });
}

console.log("Writing to public/assets/index-BwPwHqBe.js and dist/assets/index-BwPwHqBe.js...");
fs.writeFileSync(path.resolve("public/assets/index-BwPwHqBe.js"), code);
fs.writeFileSync(path.resolve("dist/assets/index-BwPwHqBe.js"), code);

console.log("=== Master Injector: Science Lessons 2..8 Successfully Integrated! ===");
