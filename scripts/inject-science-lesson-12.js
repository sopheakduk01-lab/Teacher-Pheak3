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

// 1. Prepare questions for Zi12
const questionsRaw = JSON.parse(fs.readFileSync('scripts/lesson12_questions.json', 'utf8'));
const zi12Questions = questionsRaw.map(q => ({
  q: q.question,
  opts: q.options.map(o => ({
    t: o.text,
    c: o.isCorrect,
    e: o.explanation
  }))
}));

// Load Rz12 component code
let rz12Raw = fs.readFileSync('scripts/rz12_component_code.js', 'utf8').trim();
if (rz12Raw.startsWith('var Rz12 =')) {
  rz12Raw = rz12Raw.replace(/^var Rz12\s*=\s*/, '');
}
if (rz12Raw.endsWith(';')) {
  rz12Raw = rz12Raw.slice(0, -1);
}

// 2. Inject Zi12 and Iz12
if (!code.includes("Zi12=")) {
  const zi11Target = 'questions:Zi11},';
  if (code.includes(zi11Target)) {
    const zi12Injection = `questions:Zi11},Zi12=${JSON.stringify(zi12Questions)},Iz12={id:"science-lesson-12-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ១២ - ការប្រែប្រួលរូបធាតុ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:20,durationMinutes:15,passingScore:70,description:"សំណួរពហុជ្រើសរើស ២០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ១២ ៖ ការប្រែប្រួលរូបធាតុ (ជំពូកទី ៤)",questions:Zi12},`;
    code = code.replace(zi11Target, zi12Injection);
    console.log("1. Injected Zi12 and Iz12 successfully!");
  }
}

// 3. Inject/Update Rz12
if (code.includes("Rz12=")) {
  console.log("Rz12 already exists, updating component code...");
  const rz12Marker = "Rz12=";
  const rz11Marker = ",\nRz11=";
  const startIndex = code.indexOf(rz12Marker);
  const endIndex = code.indexOf(rz11Marker, startIndex);
  if (startIndex !== -1 && endIndex !== -1) {
    code = code.slice(0, startIndex + rz12Marker.length) + rz12Raw + code.slice(endIndex);
    console.log("Updated Rz12 component code successfully!");
  }
} else {
  const rz11TargetMark = 'Rz11=';
  if (code.includes(rz11TargetMark)) {
    code = code.replace(rz11TargetMark, `Rz12=${rz12Raw},\nRz11=`);
    console.log("2. Injected Rz12 component successfully!");
  }
}

// 4. Inject state variables
if (!code.includes("Xe12,Oe12")) {
  const statesTarget = ',[Xe11,Oe11]=y.useState(!1),[ze11,qe11]=y.useState("tab-hero")';
  if (code.includes(statesTarget)) {
    code = code.replace(statesTarget, statesTarget + ',[Xe12,Oe12]=y.useState(!1),[ze12,qe12]=y.useState("tab-hero")');
    console.log("3. Injected Xe12, Oe12 state variables successfully!");
  }
}

// 5. Inject Lesson 12 Card
if (!code.includes("មេរៀនទី ១២ ៖ ការប្រែប្រួលរូបធាតុ")) {
  const lesson11CardTarget = '(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-rose-500/90';
  const lesson12CardJSX = `(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-blue-500/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-blue-400/50",children:[
  e.jsxs("div",{children:[
    e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-blue-950 via-indigo-900 to-slate-900",children:[
      e.jsx("img",{src:"https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600",alt:"ការប្រែប្រួលរូបធាតុ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
      e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-900/40 to-transparent"}),
      e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[
        e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"🧪"}),
        e.jsx("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"})
      ]}),
      e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[
        e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ១២ ៖ ការប្រែប្រួលរូបធាតុ"}),
        e.jsx("p",{className:"text-[10px] text-blue-200 mt-0.5 font-bold drop-shadow-sm",children:"ជំពូកទី ៤ • ២០ សំណួរ QCM"})
      ]})
    ]}),
    e.jsxs("div",{className:"p-4 space-y-3",children:[
      e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"សិក្សាពីភាពរូប (រឹង រាវ ឧស្ម័ន) ការប្រែប្រួលលក្ខណៈរូប និងគីមី ល្បាយស្មើសាច់ និងមិនស្មើសាច់ ព្រមទាំងកត្តាដែលធ្វើឱ្យរូបធាតុប្រែប្រួល។"}),
      e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-blue-900 bg-blue-50/80 p-2 rounded-xl border border-blue-100",children:[
        e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"text-blue-500"},{children:"🧊"})," ភាពរូប ៣"]}),
        e.jsx("span",{className:"text-slate-300",children:"•"}),
        e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"text-indigo-600"},{children:"🔄"})," ប្រែប្រួលរូប/គីមី"]}),
        e.jsx("span",{className:"text-slate-300",children:"•"}),
        e.jsxs("span",{className:"flex items-center gap-1 text-blue-800",children:[e.jsx("span",{className:"text-blue-600"},{children:"📝"})," ២០ QCM"]})
      ]})
    ]})
  ]}),
  e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[
    e.jsxs("button",{onClick:()=>{Ut||(qe12("tab-hero"),Oe12(!0));},className:"w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
      e.jsx("span",{children:"🔬"}),
      e.jsx("span",{children:"រៀន & ស្វែងយល់"})
    ]}),
    e.jsxs("button",{onClick:()=>{Ut||(qe12("tab-quiz"),Oe12(!0));},className:"w-full py-2.5 bg-gradient-to-r from-blue-800 via-indigo-600 to-blue-600 hover:from-blue-900 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
      e.jsx("span",{children:"📝"}),
      e.jsx("span",{children:"ប្រឡង ២០ QCM"})
    ]})
  ]})
]}),`;
  if (code.includes(lesson11CardTarget)) {
    code = code.replace(lesson11CardTarget, lesson12CardJSX + lesson11CardTarget);
    console.log("4. Injected Lesson 12 Card into UI successfully!");
  }
}

// 6. Modal Opener
if (!code.includes("Rz12,{isOpen:Xe12")) {
  const modalTarget = 'e.jsx(Rz11,{isOpen:Xe11,onClose:()=>Oe11(!1),onShowToast:u,initialTab:ze11}),';
  if (code.includes(modalTarget)) {
    code = code.replace(modalTarget, modalTarget + 'e.jsx(Rz12,{isOpen:Xe12,onClose:()=>Oe12(!1),onShowToast:u,initialTab:ze12}),');
    console.log("5. Injected Rz12 modal opener successfully!");
  }
}

// 7. Exam Click Handler
if (!code.includes('Pt.title.includes("មេរៀនទី ១២")||Pt.title.includes("ការប្រែប្រួលរូបធាតុ"))qe12("tab-quiz")')) {
  const examClickTarget = 'if(Pt.id.includes("lesson-11")||Pt.id.includes("lesson11")||Pt.title.includes("មេរៀនទី ១១")||Pt.title.includes("ប្រដាប់របត់ឈាម"))qe11("tab-quiz"),Oe11(!0);else ';
  if (code.includes(examClickTarget)) {
    code = code.replace(examClickTarget, 'if(Pt.id.includes("lesson-12")||Pt.id.includes("lesson12")||Pt.title.includes("មេរៀនទី ១២")||Pt.title.includes("ការប្រែប្រួលរូបធាតុ"))qe12("tab-quiz"),Oe12(!0);else ' + examClickTarget);
    console.log("6. Injected exam click handler successfully!");
  }
}

// 8. Student Portal Modal Opener
if (!code.includes("activeLessonModal===12&&e.jsx(Rz12")) {
  const studentModalTarget = 'activeLessonModal===11&&e.jsx(Rz11,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})';
  if (code.includes(studentModalTarget)) {
    code = code.replace(studentModalTarget, studentModalTarget + ',activeLessonModal===12&&e.jsx(Rz12,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})');
    console.log("7. Injected student modal opener successfully!");
  }
}

// 9. Quizzes Memo
if (!code.includes("id===Iz12.id")) {
  const quizMemoTarget = 'at.some(ys=>ys.id===Iz11.id||ys.title.includes("មេរៀនទី ១១"))||at.unshift(Iz11),';
  if (code.includes(quizMemoTarget)) {
    code = code.replace(quizMemoTarget, quizMemoTarget + 'at.some(ys=>ys.id===Iz12.id||ys.title.includes("មេរៀនទី ១២"))||at.unshift(Iz12),');
    console.log("8. Injected Iz12 into quizzes memo successfully!");
  }
}

// 10. Validate syntax
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
console.log("SUCCESS! Lesson 12 component updated/injected successfully!");
