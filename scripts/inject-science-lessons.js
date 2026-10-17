import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

console.log('=== Master Injector: Science Lessons 2, 3, 4, 5, 6 & 7 ===');

const backupPath = path.resolve('public/assets/index-BwPwHqBe.js.original_bak');
if (!fs.existsSync(backupPath)) {
  console.error('Backup public/assets/index-BwPwHqBe.js.original_bak does not exist!');
  process.exit(1);
}

let code = fs.readFileSync(backupPath, 'utf8');
console.log('Loaded pristine backup code, size:', code.length);

// --- Shuffle Zi (Lesson 1) options so it is unpredictable ---
function createRng(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateShuffledAnswerIndices(seed) {
  const rng = createRng(seed);
  let pool = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 10; j++) pool.push(i);
  }
  let valid = false;
  let attempts = 0;
  while (!valid && attempts < 1000) {
    attempts++;
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    let maxConsec = 1, currConsec = 1;
    for (let k = 1; k < pool.length; k++) {
      if (pool[k] === pool[k-1]) {
        currConsec++;
        if (currConsec > maxConsec) maxConsec = currConsec;
      } else {
        currConsec = 1;
      }
    }
    if (maxConsec <= 2) valid = true;
  }
  return pool;
}

const ziStart = code.indexOf("Zi=[");
if (ziStart !== -1) {
  let depth = 0, ziEnd = -1;
  for (let i = ziStart + 3; i < code.length; i++) {
    if (code[i] === "[") depth++;
    else if (code[i] === "]") {
      depth--;
      if (depth === 0) {
        ziEnd = i + 1;
        break;
      }
    }
  }
  if (ziEnd !== -1) {
    const rawZiStr = "var Zi = " + code.substring(ziStart + 3, ziEnd) + ";";
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(rawZiStr, sandbox);
    const Zi = sandbox.Zi;
    const targetIndices = generateShuffledAnswerIndices(99999);
    Zi.forEach((q, qIdx) => {
      const targetCorrectIdx = targetIndices[qIdx];
      const currentCorrectIdx = q.options.findIndex(o => o.isCorrect || o.c);
      if (currentCorrectIdx !== targetCorrectIdx) {
        const temp = q.options[targetCorrectIdx];
        q.options[targetCorrectIdx] = q.options[currentCorrectIdx];
        q.options[currentCorrectIdx] = temp;
      }
    });
    console.log("Replacing original Zi with shuffled Zi in code...");
    code = code.slice(0, ziStart + 3) + JSON.stringify(Zi) + code.slice(ziEnd);
  }
}

// 1. Prepare Zi2 & Iz2
const Zi2_raw = JSON.parse(fs.readFileSync(path.resolve('scripts/lesson2_questions.json'), 'utf8'));
const Zi2_data = JSON.stringify(Zi2_raw.map(item => ({
  question: item.q,
  options: item.opts.map(o => ({ text: o.t, isCorrect: o.c, exp: o.e })),
  hint: item.h
})));
const Iz2_data = `{id:"quiz-science-lesson-2-40q",title:"វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ | មេរៀនទី ២ ៖ ការដាំដំណាំ (៤០ សំណួរ QCM)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionCount:40,isPublic:!0,imageUrl:"https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600",questions:Zi2.map((r,t)=>{var i;const s=["a","b","c","d"],a=["red","blue","yellow","green"],n=["▲","◆","●","■"];return{id:t+1,question:r.question,timeLimit:25,points:1e3,options:r.options.map((l,o)=>({id:s[o],text:l.text,isCorrect:l.isCorrect,color:a[o],shape:n[o]})),explanation:(i=r.options.find(l=>l.isCorrect))==null?void 0:i.exp}}),createdAt:new Date().toISOString()}`;

// 2. Prepare Zi3 & Iz3
const Zi3_raw = JSON.parse(fs.readFileSync(path.resolve('scripts/lesson3_questions.json'), 'utf8'));
const Zi3_data = JSON.stringify(Zi3_raw.map(item => ({
  question: item.q,
  options: item.opts.map(o => ({ text: o.t, isCorrect: o.c, exp: o.e })),
  hint: item.h
})));
const Iz3_data = `{id:"quiz-science-lesson-3-40q",title:"វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ | មេរៀនទី ៣ ៖ ការថែរក្សាសត្វ (៤០ សំណួរ QCM)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionCount:40,isPublic:!0,imageUrl:"https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600",questions:Zi3.map((r,t)=>{var i;const s=["a","b","c","d"],a=["red","blue","yellow","green"],n=["▲","◆","●","■"];return{id:t+1,question:r.question,timeLimit:25,points:1e3,options:r.options.map((l,o)=>({id:s[o],text:l.text,isCorrect:l.isCorrect,color:a[o],shape:n[o]})),explanation:(i=r.options.find(l=>l.isCorrect))==null?void 0:i.exp}}),createdAt:new Date().toISOString()}`;

// 3. Prepare Zi4 & Iz4
const Zi4_raw = JSON.parse(fs.readFileSync(path.resolve('scripts/lesson4_questions.json'), 'utf8'));
const Zi4_data = JSON.stringify(Zi4_raw.map(item => ({
  question: item.q,
  options: item.opts.map(o => ({ text: o.t, isCorrect: o.c, exp: o.e })),
  hint: item.h
})));
const Iz4_data = `{id:"quiz-science-lesson-4-40q",title:"វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ | មេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ (៤០ សំណួរ QCM)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionCount:40,isPublic:!0,imageUrl:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",questions:Zi4.map((r,t)=>{var i;const s=["a","b","c","d"],a=["red","blue","yellow","green"],n=["▲","◆","●","■"];return{id:t+1,question:r.question,timeLimit:25,points:1e3,options:r.options.map((l,o)=>({id:s[o],text:l.text,isCorrect:l.isCorrect,color:a[o],shape:n[o]})),explanation:(i=r.options.find(l=>l.isCorrect))==null?void 0:i.exp}}),createdAt:new Date().toISOString()}`;

// 4. Prepare Zi5 & Iz5
const Zi5_raw = JSON.parse(fs.readFileSync(path.resolve('scripts/lesson5_questions.json'), 'utf8'));
const Zi5_data = JSON.stringify(Zi5_raw.map(item => ({
  question: item.q,
  options: item.opts.map(o => ({ text: o.t, isCorrect: o.c, exp: o.e })),
  hint: item.h
})));
const Iz5_data = `{id:"quiz-science-lesson-5-40q",title:"វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ | មេរៀនទី ៥ ៖ ធនធានធម្មជាតិ (៤០ សំណួរ QCM)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionCount:40,isPublic:!0,imageUrl:"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600",questions:Zi5.map((r,t)=>{var i;const s=["a","b","c","d"],a=["red","blue","yellow","green"],n=["▲","◆","●","■"];return{id:t+1,question:r.question,timeLimit:25,points:1e3,options:r.options.map((l,o)=>({id:s[o],text:l.text,isCorrect:l.isCorrect,color:a[o],shape:n[o]})),explanation:(i=r.options.find(l=>l.isCorrect))==null?void 0:i.exp}}),createdAt:new Date().toISOString()}`;

// 5. Prepare Zi6 & Iz6
const Zi6_raw = JSON.parse(fs.readFileSync(path.resolve('scripts/lesson6_questions.json'), 'utf8'));
const Zi6_data = JSON.stringify(Zi6_raw.map(item => ({
  question: item.q,
  options: item.opts.map(o => ({ text: o.t, isCorrect: o.c, exp: o.e })),
  hint: item.h
})));
const Iz6_data = `{id:"quiz-science-lesson-6-40q",title:"វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ | មេរៀនទី ៦ ៖ ប្រដាប់បន្តពូជមនុស្ស (៤០ សំណួរ QCM)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionCount:40,isPublic:!0,imageUrl:"https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=600",questions:Zi6.map((r,t)=>{var i;const s=["a","b","c","d"],a=["red","blue","yellow","green"],n=["▲","◆","●","■"];return{id:t+1,question:r.question,timeLimit:25,points:1e3,options:r.options.map((l,o)=>({id:s[o],text:l.text,isCorrect:l.isCorrect,color:a[o],shape:n[o]})),explanation:(i=r.options.find(l=>l.isCorrect))==null?void 0:i.exp}}),createdAt:new Date().toISOString()}`;

// 6. Prepare Zi7 & Iz7
const Zi7_raw = JSON.parse(fs.readFileSync(path.resolve('scripts/lesson7_questions.json'), 'utf8'));
const Zi7_data = JSON.stringify(Zi7_raw.map(item => ({
  question: item.q,
  options: item.opts.map(o => ({ text: o.t, isCorrect: o.c, exp: o.e })),
  hint: item.h
})));
const Iz7_data = `{id:"quiz-science-lesson-7-40q",title:"វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ | មេរៀនទី ៧ ៖ ភាពពេញវ័យ (៤០ សំណួរ QCM)",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionCount:40,isPublic:!0,imageUrl:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",questions:Zi7.map((r,t)=>{var i;const s=["a","b","c","d"],a=["red","blue","yellow","green"],n=["▲","◆","●","■"];return{id:t+1,question:r.question,timeLimit:25,points:1e3,options:r.options.map((l,o)=>({id:s[o],text:l.text,isCorrect:l.isCorrect,color:a[o],shape:n[o]})),explanation:(i=r.options.find(l=>l.isCorrect))==null?void 0:i.exp}}),createdAt:new Date().toISOString()}`;

// Inject Zi2..7 & Iz2..7 before Iz
const izTarget = `,Iz={id:"quiz-science-lesson-1-40q"`;
const izIdx = code.indexOf(izTarget);
if (izIdx === -1) {
  throw new Error('Target ,Iz={id:"quiz-science-lesson-1-40q"... not found!');
}

console.log('Injecting Zi2..7, Iz2..7 before Iz at index:', izIdx);
code = code.slice(0, izIdx) + `,Zi2=${Zi2_data},Iz2=${Iz2_data},Zi3=${Zi3_data},Iz3=${Iz3_data},Zi4=${Zi4_data},Iz4=${Iz4_data},Zi5=${Zi5_data},Iz5=${Iz5_data},Zi6=${Zi6_data},Iz6=${Iz6_data},Zi7=${Zi7_data},Iz7=${Iz7_data}` + code.slice(izIdx);

// Inject exam2..7 before exam1
const exam1Target = `{id:"exam-science-lesson1-40q"`;
const exam1Idx = code.indexOf(exam1Target);
if (exam1Idx === -1) {
  throw new Error('Target exam1 not found!');
}

const exam2_str = `{id:"exam-science-lesson2-40q",title:"វិញ្ញាសាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ ៖ មេរៀនទី២ ការដាំដំណាំ (៤០ សំណួរ)",subject:"science",subjectName:"វិទ្យាសាស្ត្រ",subjectIcon:"🌱",grade:"ថ្នាក់ទី៦",category:"quick",categoryLabel:"មេរៀនទី២ (៤០ សំណួរ)",durationMinutes:60,totalPoints:40,badgeColor:"bg-emerald-50 text-emerald-800 border-emerald-300",questions:Zi2.map((r,t)=>{var s;return{id:t+1,question:r.question,options:r.options.map(a=>({text:a.text,isCorrect:a.isCorrect})),explanation:(s=r.options.find(a=>a.isCorrect))==null?void 0:s.exp,points:1}})},`;
const exam3_str = `{id:"exam-science-lesson3-40q",title:"វិញ្ញាសាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ ៖ មេរៀនទី៣ ការថែរក្សាសត្វ (៤០ សំណួរ)",subject:"science",subjectName:"វិទ្យាសាស្ត្រ",subjectIcon:"🐄",grade:"ថ្នាក់ទី៦",category:"quick",categoryLabel:"មេរៀនទី៣ (៤០ សំណួរ)",durationMinutes:60,totalPoints:40,badgeColor:"bg-amber-50 text-amber-800 border-amber-300",questions:Zi3.map((r,t)=>{var s;return{id:t+1,question:r.question,options:r.options.map(a=>({text:a.text,isCorrect:a.isCorrect})),explanation:(s=r.options.find(a=>a.isCorrect))==null?void 0:s.exp,points:1}})},`;
const exam4_str = `{id:"exam-science-lesson4-40q",title:"វិញ្ញាសាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ ៖ មេរៀនទី៤ បរិស្ថានធម្មជាតិ (៤០ សំណួរ)",subject:"science",subjectName:"វិទ្យាសាស្ត្រ",subjectIcon:"🌍",grade:"ថ្នាក់ទី៦",category:"quick",categoryLabel:"មេរៀនទី៤ (៤០ សំណួរ)",durationMinutes:60,totalPoints:40,badgeColor:"bg-sky-50 text-sky-800 border-sky-300",questions:Zi4.map((r,t)=>{var s;return{id:t+1,question:r.question,options:r.options.map(a=>({text:a.text,isCorrect:a.isCorrect})),explanation:(s=r.options.find(a=>a.isCorrect))==null?void 0:s.exp,points:1}})},`;
const exam5_str = `{id:"exam-science-lesson5-40q",title:"វិញ្ញាសាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ ៖ មេរៀនទី៥ ធនធានធម្មជាតិ (៤០ សំណួរ)",subject:"science",subjectName:"វិទ្យាសាស្ត្រ",subjectIcon:"💎",grade:"ថ្នាក់ទី៦",category:"quick",categoryLabel:"មេរៀនទី៥ (៤០ សំណួរ)",durationMinutes:60,totalPoints:40,badgeColor:"bg-teal-50 text-teal-800 border-teal-300",questions:Zi5.map((r,t)=>{var s;return{id:t+1,question:r.question,options:r.options.map(a=>({text:a.text,isCorrect:a.isCorrect})),explanation:(s=r.options.find(a=>a.isCorrect))==null?void 0:s.exp,points:1}})},`;
const exam6_str = `{id:"exam-science-lesson6-40q",title:"វិញ្ញាសាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ ៖ មេរៀនទី៦ ប្រដាប់បន្តពូជមនុស្ស (៤០ សំណួរ)",subject:"science",subjectName:"វិទ្យាសាស្ត្រ",subjectIcon:"🧬",grade:"ថ្នាក់ទី៦",category:"quick",categoryLabel:"មេរៀនទី៦ (៤០ សំណួរ)",durationMinutes:60,totalPoints:40,badgeColor:"bg-rose-50 text-rose-800 border-rose-300",questions:Zi6.map((r,t)=>{var s;return{id:t+1,question:r.question,options:r.options.map(a=>({text:a.text,isCorrect:a.isCorrect})),explanation:(s=r.options.find(a=>a.isCorrect))==null?void 0:s.exp,points:1}})},`;
const exam7_str = `{id:"exam-science-lesson7-40q",title:"វិញ្ញាសាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ ៖ មេរៀនទី៧ ភាពពេញវ័យ (៤០ សំណួរ)",subject:"science",subjectName:"វិទ្យាសាស្ត្រ",subjectIcon:"🌟",grade:"ថ្នាក់ទី៦",category:"quick",categoryLabel:"មេរៀនទី៧ (៤០ សំណួរ)",durationMinutes:60,totalPoints:40,badgeColor:"bg-amber-50 text-amber-800 border-amber-300",questions:Zi7.map((r,t)=>{var s;return{id:t+1,question:r.question,options:r.options.map(a=>({text:a.text,isCorrect:a.isCorrect})),explanation:(s=r.options.find(a=>a.isCorrect))==null?void 0:s.exp,points:1}})},`;

console.log('Injecting exam2..7 before exam1 at index:', exam1Idx);
code = code.slice(0, exam1Idx) + exam2_str + exam3_str + exam4_str + exam5_str + exam6_str + exam7_str + code.slice(exam1Idx);

// Inject Rz2..7 beside Rz
const rzTarget = `,Rz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"})=>`;
const rzIdx = code.indexOf(rzTarget);
if (rzIdx === -1) {
  throw new Error('Target ,Rz=({isOpen:...})=> not found!');
}

let rz2Code = fs.readFileSync(path.resolve('scripts/rz2_component_code.js'), 'utf8').trim();
if (rz2Code.startsWith('var Rz2 =') || rz2Code.startsWith('var Rz2=')) rz2Code = rz2Code.replace(/^var\s+Rz2\s*=\s*/, '');
if (rz2Code.endsWith(';')) rz2Code = rz2Code.slice(0, -1);

let rz3Code = fs.readFileSync(path.resolve('scripts/rz3_component_code.js'), 'utf8').trim();
if (rz3Code.startsWith('var Rz3 =') || rz3Code.startsWith('var Rz3=')) rz3Code = rz3Code.replace(/^var\s+Rz3\s*=\s*/, '');
if (rz3Code.endsWith(';')) rz3Code = rz3Code.slice(0, -1);

let rz4Code = fs.readFileSync(path.resolve('scripts/rz4_component_code.js'), 'utf8').trim();
if (rz4Code.startsWith('var Rz4 =') || rz4Code.startsWith('var Rz4=')) rz4Code = rz4Code.replace(/^var\s+Rz4\s*=\s*/, '');
if (rz4Code.endsWith(';')) rz4Code = rz4Code.slice(0, -1);

let rz5Code = fs.readFileSync(path.resolve('scripts/rz5_component_code.js'), 'utf8').trim();
if (rz5Code.startsWith('var Rz5 =') || rz5Code.startsWith('var Rz5=')) rz5Code = rz5Code.replace(/^var\s+Rz5\s*=\s*/, '');
if (rz5Code.endsWith(';')) rz5Code = rz5Code.slice(0, -1);

let rz6Code = fs.readFileSync(path.resolve('scripts/rz6_component_code.js'), 'utf8').trim();
if (rz6Code.startsWith('var Rz6 =') || rz6Code.startsWith('var Rz6=')) rz6Code = rz6Code.replace(/^var\s+Rz6\s*=\s*/, '');
if (rz6Code.endsWith(';')) rz6Code = rz6Code.slice(0, -1);

let rz7Code = fs.readFileSync(path.resolve('scripts/rz7_component_code.js'), 'utf8').trim();
if (rz7Code.startsWith('var Rz7 =') || rz7Code.startsWith('var Rz7=')) rz7Code = rz7Code.replace(/^var\s+Rz7\s*=\s*/, '');
if (rz7Code.endsWith(';')) rz7Code = rz7Code.slice(0, -1);

console.log('Injecting Rz2, Rz3, Rz4, Rz5, Rz6, Rz7 before Rz at index:', rzIdx);
code = code.slice(0, rzIdx) + `,Rz2=${rz2Code},Rz3=${rz3Code},Rz4=${rz4Code},Rz5=${rz5Code},Rz6=${rz6Code},Rz7=${rz7Code}` + code.slice(rzIdx);

// HomeTab state variables
const stateTarget = `[Xe,Oe]=y.useState(!1),[ze,qe]=y.useState("tab-hero")`;
const stateIdx = code.indexOf(stateTarget);
if (stateIdx === -1) {
  throw new Error('Target state variables not found!');
}

console.log('Injecting state variables for Lesson 2..7 at index:', stateIdx);
code = code.slice(0, stateIdx) + `[Xe,Oe]=y.useState(!1),[ze,qe]=y.useState("tab-hero"),[Xe2,Oe2]=y.useState(!1),[ze2,qe2]=y.useState("tab-hero"),[Xe3,Oe3]=y.useState(!1),[ze3,qe3]=y.useState("tab-hero"),[Xe4,Oe4]=y.useState(!1),[ze4,qe4]=y.useState("tab-hero"),[Xe5,Oe5]=y.useState(!1),[ze5,qe5]=y.useState("tab-hero"),[Xe6,Oe6]=y.useState(!1),[ze6,qe6]=y.useState("tab-hero"),[Xe7,Oe7]=y.useState(!1),[ze7,qe7]=y.useState("tab-hero")` + code.slice(stateIdx + stateTarget.length);

// HomeTab carousel
const card1EndTarget = `]},"science-lesson-1")`;
const card1EndIdx = code.indexOf(card1EndTarget);
if (card1EndIdx === -1) {
  throw new Error('Target ]},"science-lesson-1") not found!');
}

const card2Code = fs.readFileSync(path.resolve('scripts/card2_jsx.js'), 'utf8').trim();
const card3Code = fs.readFileSync(path.resolve('scripts/card3_jsx.js'), 'utf8').trim();
const card4Code = fs.readFileSync(path.resolve('scripts/card4_jsx.js'), 'utf8').trim();
const card5Code = fs.readFileSync(path.resolve('scripts/card5_jsx.js'), 'utf8').trim();
const card6Code = fs.readFileSync(path.resolve('scripts/card6_jsx.js'), 'utf8').trim();
const card7Code = fs.readFileSync(path.resolve('scripts/card7_jsx.js'), 'utf8').trim();

console.log('Injecting Card 2, 3, 4, 5, 6, 7 into carousel at index:', card1EndIdx);
code = code.slice(0, card1EndIdx + card1EndTarget.length) + ',' + card2Code + ',' + card3Code + ',' + card4Code + ',' + card5Code + ',' + card6Code + ',' + card7Code + code.slice(card1EndIdx + card1EndTarget.length);

// Quizzes list unshift
const unshiftTarget = `return at.some(ys=>ys.id===Iz.id||ys.subject==="វិទ្យាសាស្ត្រ"&&ys.title.includes("មេរៀនទី ១"))||at.unshift(Iz),at`;
const unshiftIdx = code.indexOf(unshiftTarget);
if (unshiftIdx !== -1) {
  console.log('Injecting Iz2, Iz3, Iz4, Iz5, Iz6, Iz7 into quizzes unshift at index:', unshiftIdx);
  const unshiftReplacement = `return at.some(ys=>ys.id===Iz2.id||ys.title.includes("មេរៀនទី ២"))||at.unshift(Iz2),at.some(ys=>ys.id===Iz3.id||ys.title.includes("មេរៀនទី ៣"))||at.unshift(Iz3),at.some(ys=>ys.id===Iz4.id||ys.title.includes("មេរៀនទី ៤"))||at.unshift(Iz4),at.some(ys=>ys.id===Iz5.id||ys.title.includes("មេរៀនទី ៥"))||at.unshift(Iz5),at.some(ys=>ys.id===Iz6.id||ys.title.includes("មេរៀនទី ៦"))||at.unshift(Iz6),at.some(ys=>ys.id===Iz7.id||ys.title.includes("មេរៀនទី ៧"))||at.unshift(Iz7),at.some(ys=>ys.id===Iz.id||ys.subject==="វិទ្យាសាស្ត្រ"&&ys.title.includes("មេរៀនទី ១"))||at.unshift(Iz),at`;
  code = code.slice(0, unshiftIdx) + unshiftReplacement + code.slice(unshiftIdx + unshiftTarget.length);
}

// HomeTab quiz launcher click handler
const clickTarget = `else if(Ds)qe("tab-quiz"),Oe(!0);`;
const clickIdx = code.indexOf(clickTarget);
if (clickIdx === -1) {
  throw new Error('Target else if(Ds)qe("tab-quiz"),Oe(!0); not found!');
}

const clickReplacement = `else if(Ds){if(Pt.id.includes("lesson-7")||Pt.id.includes("lesson7")||Pt.title.includes("មេរៀនទី ៧")||Pt.title.includes("ភាពពេញវ័យ"))qe7("tab-quiz"),Oe7(!0);else if(Pt.id.includes("lesson-6")||Pt.id.includes("lesson6")||Pt.title.includes("មេរៀនទី ៦")||Pt.title.includes("ប្រដាប់បន្តពូជមនុស្ស"))qe6("tab-quiz"),Oe6(!0);else if(Pt.id.includes("lesson-5")||Pt.id.includes("lesson5")||Pt.title.includes("មេរៀនទី ៥")||Pt.title.includes("ធនធានធម្មជាតិ"))qe5("tab-quiz"),Oe5(!0);else if(Pt.id.includes("lesson-4")||Pt.id.includes("lesson4")||Pt.title.includes("មេរៀនទី ៤")||Pt.title.includes("បរិស្ថានធម្មជាតិ"))qe4("tab-quiz"),Oe4(!0);else if(Pt.id.includes("lesson-3")||Pt.id.includes("lesson3")||Pt.title.includes("មេរៀនទី ៣")||Pt.title.includes("ការថែរក្សាសត្វ"))qe3("tab-quiz"),Oe3(!0);else if(Pt.id.includes("lesson-2")||Pt.id.includes("lesson2")||Pt.title.includes("មេរៀនទី ២")||Pt.title.includes("ការដាំដំណាំ"))qe2("tab-quiz"),Oe2(!0);else qe("tab-quiz"),Oe(!0);}`;
console.log('Injecting quiz launcher condition at index:', clickIdx);
code = code.slice(0, clickIdx) + clickReplacement + code.slice(clickIdx + clickTarget.length);

// HomeTab modal render
const modalTarget = `e.jsx(Rz,{isOpen:Xe,onClose:()=>Oe(!1),onShowToast:u,initialTab:ze})`;
const modalIdx = code.indexOf(modalTarget);
if (modalIdx === -1) {
  throw new Error('Target e.jsx(Rz,{isOpen:Xe,...}) not found!');
}

const modalReplacement = `e.jsx(Rz,{isOpen:Xe,onClose:()=>Oe(!1),onShowToast:u,initialTab:ze}),e.jsx(Rz2,{isOpen:Xe2,onClose:()=>Oe2(!1),onShowToast:u,initialTab:ze2}),e.jsx(Rz3,{isOpen:Xe3,onClose:()=>Oe3(!1),onShowToast:u,initialTab:ze3}),e.jsx(Rz4,{isOpen:Xe4,onClose:()=>Oe4(!1),onShowToast:u,initialTab:ze4}),e.jsx(Rz5,{isOpen:Xe5,onClose:()=>Oe5(!1),onShowToast:u,initialTab:ze5}),e.jsx(Rz6,{isOpen:Xe6,onClose:()=>Oe6(!1),onShowToast:u,initialTab:ze6}),e.jsx(Rz7,{isOpen:Xe7,onClose:()=>Oe7(!1),onShowToast:u,initialTab:ze7})`;
console.log('Injecting Rz2..7 modal JSX at index:', modalIdx);
code = code.slice(0, modalIdx) + modalReplacement + code.slice(modalIdx + modalTarget.length);

console.log('--- All modifications complete. Verifying bundle syntax... ---');
try {
  new vm.Script(code);
  console.log('SUCCESS: Full modified bundle parses with ZERO syntax errors!');
} catch (err) {
  console.error('PARSE ERROR in modified bundle:', err);
  process.exit(1);
}

const distAssetsDir = path.resolve('dist/assets');
if (!fs.existsSync(distAssetsDir)) {
  fs.mkdirSync(distAssetsDir, { recursive: true });
}

console.log('Writing to public/assets/index-BwPwHqBe.js and dist/assets/index-BwPwHqBe.js...');
fs.writeFileSync(path.resolve('public/assets/index-BwPwHqBe.js'), code);
fs.writeFileSync(path.resolve('dist/assets/index-BwPwHqBe.js'), code);

console.log('=== Master Injector: Science Lessons 2, 3, 4, 5, 6 & 7 Successfully Integrated! ===');
