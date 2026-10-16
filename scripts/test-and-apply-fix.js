import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

console.log('--- Starting Science Lesson 2 Fix Script ---');

const backupPath = path.resolve('public/assets/index-BwPwHqBe.js.original_bak');
if (!fs.existsSync(backupPath)) {
  console.error('Backup public/assets/index-BwPwHqBe.js.original_bak does not exist!');
  process.exit(1);
}

let code = fs.readFileSync(backupPath, 'utf8');
console.log('Loaded pristine backup code, size:', code.length);

// 1. Prepare Zi2 questions
const injectScript = fs.readFileSync(path.resolve('scripts/inject-science-lesson-2.js'), 'utf8');
// Extract Zi2_raw array
const rawStart = injectScript.indexOf('const Zi2_raw = [');
const rawEnd = injectScript.indexOf('];', rawStart) + 2;
const zi2RawCode = "Zi2_raw = " + injectScript.substring(rawStart + "const Zi2_raw = ".length, rawEnd);

// Evaluate Zi2_raw in a sandbox to get the pure array
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(zi2RawCode, sandbox);
const Zi2_raw = sandbox.Zi2_raw;
console.log('Extracted Zi2_raw with questions count:', Zi2_raw.length);

const Zi2_data = JSON.stringify(Zi2_raw.map(item => ({
  question: item.q,
  options: item.opts.map(o => ({ text: o.t, isCorrect: o.c, exp: o.e })),
  hint: item.h
})));

// 2. Prepare Iz2 definition
// Note: Zi2 is in scope when Iz2 is evaluated
const Iz2_data = `{id:"quiz-science-lesson-2-40q",title:"វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ | មេរៀនទី ២ ៖ ការដាំដំណាំ (៤០ សំណួរ QCM)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionCount:40,isPublic:!0,imageUrl:"https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600",questions:Zi2.map((r,t)=>{var i;const s=["a","b","c","d"],a=["red","blue","yellow","green"],n=["▲","◆","●","■"];return{id:t+1,question:r.question,timeLimit:25,points:1e3,options:r.options.map((l,o)=>({id:s[o],text:l.text,isCorrect:l.isCorrect,color:a[o],shape:n[o]})),explanation:(i=r.options.find(l=>l.isCorrect))==null?void 0:i.exp}}),createdAt:new Date().toISOString()}`;

// 3. Inject Zi2 and Iz2 right before ,Iz={id:"quiz-science-lesson-1-40q"
const izTarget = `,Iz={id:"quiz-science-lesson-1-40q"`;
const izIdx = code.indexOf(izTarget);
if (izIdx === -1) {
  throw new Error('Target ,Iz={id:"quiz-science-lesson-1-40q" not found!');
}

console.log('Injecting Zi2 and Iz2 before Iz at index:', izIdx);
code = code.slice(0, izIdx) + `,Zi2=${Zi2_data},Iz2=${Iz2_data}` + code.slice(izIdx);

// 4. Inject exam-science-lesson2-40q into g4 right before exam-science-lesson1-40q
const exam1Target = `{id:"exam-science-lesson1-40q"`;
const exam1Idx = code.indexOf(exam1Target);
if (exam1Idx === -1) {
  throw new Error('Target {id:"exam-science-lesson1-40q" not found!');
}

const exam2_str = `{id:"exam-science-lesson2-40q",title:"វិញ្ញាសាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ ៖ មេរៀនទី២ ការដាំដំណាំ (៤០ សំណួរ)",subject:"science",subjectName:"វិទ្យាសាស្ត្រ",subjectIcon:"🌱",grade:"ថ្នាក់ទី៦",category:"quick",categoryLabel:"មេរៀនទី២ (៤០ សំណួរ)",durationMinutes:60,totalPoints:40,badgeColor:"bg-emerald-50 text-emerald-800 border-emerald-300",questions:Zi2.map((r,t)=>{var s;return{id:t+1,question:r.question,options:r.options.map(a=>({text:a.text,isCorrect:a.isCorrect})),explanation:(s=r.options.find(a=>a.isCorrect))==null?void 0:s.exp,points:1}})},`;

console.log('Injecting exam-science-lesson2-40q before exam-science-lesson1-40q at index:', exam1Idx);
code = code.slice(0, exam1Idx) + exam2_str + code.slice(exam1Idx);

// 5. Inject Rz2 right beside Rz
const rzTarget = `,Rz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"})=>`;
const rzIdx = code.indexOf(rzTarget);
if (rzIdx === -1) {
  throw new Error('Target ,Rz=({isOpen:...})=> not found!');
}

let rz2Code = fs.readFileSync(path.resolve('scripts/rz2_component_code.js'), 'utf8').trim();
// Strip leading "var Rz2 =" or "var Rz2="
if (rz2Code.startsWith('var Rz2 =') || rz2Code.startsWith('var Rz2=')) {
  rz2Code = rz2Code.replace(/^var\s+Rz2\s*=\s*/, '');
}
// Strip trailing semicolon if present
if (rz2Code.endsWith(';')) {
  rz2Code = rz2Code.slice(0, -1);
}

console.log('Injecting Rz2 before Rz at index:', rzIdx);
code = code.slice(0, rzIdx) + `,Rz2=${rz2Code}` + code.slice(rzIdx);

// 6. HomeTab state: add Xe2 and ze2
const stateTarget = `[Xe,Oe]=y.useState(!1),[ze,qe]=y.useState("tab-hero")`;
const stateIdx = code.indexOf(stateTarget);
if (stateIdx === -1) {
  throw new Error('Target [Xe,Oe]=y.useState(!1),[ze,qe]=y.useState("tab-hero") not found!');
}

console.log('Injecting state variables [Xe2,Oe2] and [ze2,qe2] at index:', stateIdx);
code = code.slice(0, stateIdx) + `[Xe,Oe]=y.useState(!1),[ze,qe]=y.useState("tab-hero"),[Xe2,Oe2]=y.useState(!1),[ze2,qe2]=y.useState("tab-hero")` + code.slice(stateIdx + stateTarget.length);

// 7. HomeTab carousel: add Card 2 right next to Card 1
const card1EndTarget = `]},"science-lesson-1")`;
const card1EndIdx = code.indexOf(card1EndTarget);
if (card1EndIdx === -1) {
  throw new Error('Target ]},"science-lesson-1") not found!');
}

const card2Code = fs.readFileSync(path.resolve('scripts/card2_jsx.js'), 'utf8').trim();
console.log('Injecting Science Lesson 2 Carousel Card at index:', card1EndIdx);
code = code.slice(0, card1EndIdx + card1EndTarget.length) + ',' + card2Code + code.slice(card1EndIdx + card1EndTarget.length);

// 8. HomeTab quiz launcher click handler
const clickTarget = `else if(Ds)qe("tab-quiz"),Oe(!0);`;
const clickIdx = code.indexOf(clickTarget);
if (clickIdx === -1) {
  throw new Error('Target else if(Ds)qe("tab-quiz"),Oe(!0); not found!');
}

const clickReplacement = `else if(Ds){if(Pt.id.includes("lesson-2")||Pt.id.includes("lesson2")||Pt.title.includes("មេរៀនទី ២")||Pt.title.includes("ការដាំដំណាំ"))qe2("tab-quiz"),Oe2(!0);else qe("tab-quiz"),Oe(!0);}`;
console.log('Injecting quiz launcher condition at index:', clickIdx);
code = code.slice(0, clickIdx) + clickReplacement + code.slice(clickIdx + clickTarget.length);

// 9. HomeTab modal render: render Rz2 alongside Rz
const modalTarget = `e.jsx(Rz,{isOpen:Xe,onClose:()=>Oe(!1),onShowToast:u,initialTab:ze})`;
const modalIdx = code.indexOf(modalTarget);
if (modalIdx === -1) {
  throw new Error('Target e.jsx(Rz,{isOpen:Xe,...}) not found!');
}

const modalReplacement = `e.jsx(Rz,{isOpen:Xe,onClose:()=>Oe(!1),onShowToast:u,initialTab:ze}),e.jsx(Rz2,{isOpen:Xe2,onClose:()=>Oe2(!1),onShowToast:u,initialTab:ze2})`;
console.log('Injecting Rz2 modal JSX at index:', modalIdx);
code = code.slice(0, modalIdx) + modalReplacement + code.slice(modalIdx + modalTarget.length);

console.log('--- All modifications complete. Verifying bundle syntax... ---');
try {
  // Test parsing the modified bundle with node vm Script
  new vm.Script(code);
  console.log('SUCCESS: Full modified bundle parses with ZERO syntax errors!');
} catch (err) {
  console.error('PARSE ERROR in modified bundle:', err);
  process.exit(1);
}

// Write to public and dist
console.log('Writing to public/assets/index-BwPwHqBe.js and dist/assets/index-BwPwHqBe.js...');
fs.writeFileSync(path.resolve('public/assets/index-BwPwHqBe.js'), code);
fs.writeFileSync(path.resolve('dist/assets/index-BwPwHqBe.js'), code);

console.log('--- Science Lesson 2 successfully applied and verified! ---');
