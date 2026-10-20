import fs from 'node:fs';
import esbuild from 'esbuild';

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

if (!fs.existsSync(filePath)) {
  console.error("Bundle file not found!");
  process.exit(1);
}

let code = fs.readFileSync(filePath, 'utf8');
console.log("Initial bundle code length:", code.length);

// 1. Prepare questions for Zi11 in compact format
const questionsRaw = JSON.parse(fs.readFileSync('scripts/lesson11_questions.json', 'utf8'));
const zi11Questions = questionsRaw.map(q => ({
  q: q.question,
  opts: q.options.map(o => ({
    t: o.text,
    c: o.isCorrect,
    e: o.explanation
  }))
}));

// Check if already injected
if (code.includes("Rz11=")) {
  console.log("Rz11 already injected!");
  process.exit(0);
}

// 2. Inject Zi11 and Iz11 into question/quiz definitions list
const zi10Target = 'questions:Zi10},';
if (code.includes(zi10Target)) {
  const zi11Injection = `questions:Zi10},Zi11=${JSON.stringify(zi11Questions)},Iz11={id:"science-lesson-11-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ១១ - ប្រដាប់របត់ឈាម",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ១១ ៖ ប្រដាប់របត់ឈាម (ជំពូកទី ៣ ៖ មនុស្ស ភាពពេញវ័យ និងជំងឺ)",questions:Zi11},`;
  code = code.replace(zi10Target, zi11Injection);
  console.log("1. Injected Zi11 and Iz11 successfully!");
} else {
  console.error("zi10Target not found!");
  process.exit(1);
}

// 3. Load Rz11 component code from scripts/rz11_component_code.js
let rz11Raw = fs.readFileSync('scripts/rz11_component_code.js', 'utf8').trim();
if (rz11Raw.startsWith('var Rz11 =')) {
  rz11Raw = rz11Raw.replace(/^var Rz11\s*=\s*/, '');
}
if (rz11Raw.endsWith(';')) {
  rz11Raw = rz11Raw.slice(0, -1);
}

const rzTarget = '\nRz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"})=>{';
if (code.includes(rzTarget)) {
  code = code.replace(rzTarget, `\nRz11=${rz11Raw},\nRz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"})=>{`);
  console.log("2. Injected Rz11 component successfully!");
} else {
  console.error("rzTarget not found!");
  process.exit(1);
}

// 4. Inject state variables in InteractiveSharedSection
const statesTarget = ',[Xe10,Oe10]=y.useState(!1),[ze10,qe10]=y.useState("tab-hero")';
if (code.includes(statesTarget)) {
  code = code.replace(statesTarget, statesTarget + ',[Xe11,Oe11]=y.useState(!1),[ze11,qe11]=y.useState("tab-hero")');
  console.log("3. Injected Xe11, Oe11 state variables successfully!");
} else {
  console.error("statesTarget not found!");
  process.exit(1);
}

// 5. Inject Lesson 11 Card in UI
const lesson10CardTarget = '(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-emerald-400/90';
const lesson11CardJSX = `(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-rose-500/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-rose-400/50",children:[
  e.jsxs("div",{children:[
    e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-rose-950 via-red-900 to-slate-900",children:[
      e.jsx("img",{src:"https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600",alt:"ប្រដាប់របត់ឈាម",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
      e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-rose-950/95 via-rose-900/40 to-transparent"}),
      e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[
        e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"🫀"}),
        e.jsx("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"})
      ]}),
      e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[
        e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ១១ ៖ ប្រដាប់របត់ឈាម"}),
        e.jsx("p",{className:"text-[10px] text-rose-200 mt-0.5 font-bold drop-shadow-sm",children:"ជំពូកទី ៣ • ទំព័រ ៦៤-៦៧ • ៤០ សំណួរ QCM"})
      ]})
    ]}),
    e.jsxs("div",{className:"p-4 space-y-3",children:[
      e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"រូបផ្គុំបេះដូង ៤ថត ចលនាចង្វាក់បេះដូង ៣ដំណាក់ សរសៃឈាមទាំង ៣ប្រភេទ ជីពចរ ជំងឺ និងអនាម័យប្រដាប់របត់ឈាម។"}),
      e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-rose-900 bg-rose-50/80 p-2 rounded-xl border border-rose-100",children:[
        e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Jr,{className:"w-2.5 h-2.5 text-rose-500"})," បេះដូង ៤ ថត"]}),
        e.jsx("span",{className:"text-slate-300",children:"•"}),
        e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Za,{className:"w-2.5 h-2.5 text-blue-600"})," ជីពចរតាមវ័យ"]}),
        e.jsx("span",{className:"text-slate-300",children:"•"}),
        e.jsxs("span",{className:"flex items-center gap-1 text-rose-800",children:[e.jsx(Ns,{className:"w-2.5 h-2.5 text-rose-600"})," ៤០ QCM ពេញលេញ"]})
      ]})
    ]})
  ]}),
  e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[
    e.jsxs("button",{onClick:()=>{Ut||(qe11("tab-hero"),Oe11(!0));},className:"w-full py-2.5 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
      e.jsx("span",{children:"🔬"}),
      e.jsx("span",{children:"រៀន & ស្វែងយល់"})
    ]}),
    e.jsxs("button",{onClick:()=>{Ut||(qe11("tab-quiz"),Oe11(!0));},className:"w-full py-2.5 bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
      e.jsx("span",{children:"📝"}),
      e.jsx("span",{children:"ប្រឡង ៤០ QCM"})
    ]})
  ]})
]}),`;

if (code.includes(lesson10CardTarget)) {
  code = code.replace(lesson10CardTarget, lesson11CardJSX + lesson10CardTarget);
  console.log("4. Injected Lesson 11 Card into UI successfully!");
} else {
  console.error("lesson10CardTarget not found!");
  process.exit(1);
}

// 6. Modal Opener
const modalTarget = 'e.jsx(Rz10,{isOpen:Xe10,onClose:()=>Oe10(!1),onShowToast:u,initialTab:ze10}),';
if (code.includes(modalTarget)) {
  code = code.replace(modalTarget, modalTarget + 'e.jsx(Rz11,{isOpen:Xe11,onClose:()=>Oe11(!1),onShowToast:u,initialTab:ze11}),');
  console.log("5. Injected Rz11 modal opener successfully!");
} else {
  console.error("modalTarget not found!");
  process.exit(1);
}

// 7. Exam Click Handler
const examClickTarget = 'if(Pt.id.includes("lesson-10")||Pt.id.includes("lesson10")||Pt.title.includes("មេរៀនទី ១០")||Pt.title.includes("ប្រដាប់រំលាយអាហារ"))qe10("tab-quiz"),Oe10(!0);else ';
if (code.includes(examClickTarget)) {
  code = code.replace(examClickTarget, 'if(Pt.id.includes("lesson-11")||Pt.id.includes("lesson11")||Pt.title.includes("មេរៀនទី ១១")||Pt.title.includes("ប្រដាប់របត់ឈាម"))qe11("tab-quiz"),Oe11(!0);else ' + examClickTarget);
  console.log("6. Injected exam click handler successfully!");
} else {
  console.error("examClickTarget not found!");
  process.exit(1);
}

// 8. Student Portal Modal Opener
const studentModalTarget = 'activeLessonModal===10&&e.jsx(Rz10,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})';
if (code.includes(studentModalTarget)) {
  code = code.replace(studentModalTarget, studentModalTarget + ',activeLessonModal===11&&e.jsx(Rz11,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})');
  console.log("7. Injected student modal opener successfully!");
} else {
  console.error("studentModalTarget not found!");
  process.exit(1);
}

// 9. Quizzes Memo
const quizMemoTarget = 'at.some(ys=>ys.id===Iz10.id||ys.title.includes("មេរៀនទី ១០"))||at.unshift(Iz10),';
if (code.includes(quizMemoTarget)) {
  code = code.replace(quizMemoTarget, 'at.some(ys=>ys.id===Iz11.id||ys.title.includes("មេរៀនទី ១១"))||at.unshift(Iz11),' + quizMemoTarget);
  console.log("8. Injected Iz11 into quizzes memo successfully!");
} else {
  console.error("quizMemoTarget not found!");
  process.exit(1);
}

// 10. Validate syntax using esbuild before saving!
try {
  esbuild.transformSync(code, { loader: "js" });
  console.log("ESBUILD VALIDATION: Bundle code passed 100%!");
} catch (err) {
  console.error("Syntax Error in bundled code:", err.message);
  process.exit(1);
}

// Write to public and dist
fs.writeFileSync(filePath, code);
if (fs.existsSync(distPath)) {
  fs.writeFileSync(distPath, code);
}
console.log("SUCCESS! All Lesson 11 components and data successfully injected into the application!");
