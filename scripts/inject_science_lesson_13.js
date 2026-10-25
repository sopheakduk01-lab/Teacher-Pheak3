import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Injecting Science Lesson 13 into App Bundle ===");

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

let code = fs.readFileSync(filePath, 'utf8');
console.log("Original bundle length:", code.length);

// 1. Prepare Zi13 and Iz13
const l13Questions = JSON.parse(fs.readFileSync('scripts/lesson13_questions.json', 'utf8'));
const zi13Questions = l13Questions.map(q => ({
  q: q.question,
  opts: q.options.map(o => ({
    t: o.text,
    c: o.isCorrect,
    e: o.explanation
  }))
}));

const zi13Code = `Zi13=${JSON.stringify(zi13Questions)},Iz13={id:"science-lesson-13-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ១៣ - ធាតុគីមី អង្គធាតុសុទ្ធ និងល្បាយ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:25,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ១៣ ៖ ធាតុគីមី អង្គធាតុសុទ្ធ និងល្បាយ (ជំពូកទី ៤)",questions:Zi13},`;

// Inject Zi13 & Iz13 right before Iz={id:"quiz-s
const izAnchor = 'questions:Zi12},';
const izPos = code.indexOf(izAnchor);
if (izPos === -1) {
  console.error("Could not find Iz12 anchor!");
  process.exit(1);
}
code = code.slice(0, izPos + izAnchor.length) + zi13Code + code.slice(izPos + izAnchor.length);
console.log("1. Inserted Zi13 and Iz13 successfully!");

// 2. Add Iz13 to unshift array
const unshiftAnchor = 'at.unshift(Iz12),';
const unshiftPos = code.indexOf(unshiftAnchor);
if (unshiftPos === -1) {
  console.error("Could not find unshift Iz12 anchor!");
  process.exit(1);
}
const unshiftIz13 = `at.some(ys=>ys.id===Iz13.id||ys.title.includes("មេរៀនទី ១៣"))||at.unshift(Iz13),`;
code = code.slice(0, unshiftPos + unshiftAnchor.length) + unshiftIz13 + code.slice(unshiftPos + unshiftAnchor.length);
console.log("2. Inserted Iz13 unshift successfully!");

// 3. Inject Rz13 component code
let rz13Raw = fs.readFileSync('scripts/rz13_component_code.js', 'utf8').trim();
if (rz13Raw.startsWith('var Rz13 =')) {
  rz13Raw = rz13Raw.replace(/^var Rz13\s*=\s*/, '');
}
if (rz13Raw.endsWith(';')) {
  rz13Raw = rz13Raw.slice(0, -1);
}

// Place Rz13 right before Rz12
const rz12Anchor = 'Rz12=({';
const rz12Pos = code.indexOf(rz12Anchor);
if (rz12Pos === -1) {
  console.error("Could not find Rz12 anchor!");
  process.exit(1);
}
code = code.slice(0, rz12Pos) + "Rz13=" + rz13Raw + ",\n" + code.slice(rz12Pos);
console.log("3. Inserted Rz13 component definition successfully!");

// 4. Inject Xe13, Oe13, ze13, qe13 states
const stateAnchor = '[ze12,qe12]=y.useState("tab-hero");';
const statePos = code.indexOf(stateAnchor);
if (statePos === -1) {
  console.error("Could not find stateAnchor!");
  process.exit(1);
}
const stateCode = `,[Xe13,Oe13]=y.useState(!1),[ze13,qe13]=y.useState("tab-hero")`;
code = code.slice(0, statePos + stateAnchor.length - 1) + stateCode + code.slice(statePos + stateAnchor.length - 1);
console.log("4. Inserted Xe13/Oe13 state hooks successfully!");

// 5. Inject primary modal Rz13
const modalAnchor = 'e.jsx(Rz12,{isOpen:Xe12,onClose:()=>Oe12(!1),onShowToast:u,initialTab:ze12}),';
const modalPos = code.indexOf(modalAnchor);
if (modalPos === -1) {
  console.error("Could not find modalAnchor!");
  process.exit(1);
}
const modalRz13 = `e.jsx(Rz13,{isOpen:Xe13,onClose:()=>Oe13(!1),onShowToast:u,initialTab:ze13}),`;
code = code.slice(0, modalPos + modalAnchor.length) + modalRz13 + code.slice(modalPos + modalAnchor.length);
console.log("5. Inserted primary modal Rz13 successfully!");

// 6. Inject student portal modal activeLessonModal===13
const almAnchor = 'activeLessonModal===12&&e.jsx(Rz12,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})';
const almPos = code.indexOf(almAnchor);
if (almPos === -1) {
  console.error("Could not find activeLessonModal 12 anchor!");
  process.exit(1);
}
const alm13 = `,activeLessonModal===13&&e.jsx(Rz13,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})`;
code = code.slice(0, almPos + almAnchor.length) + alm13 + code.slice(almPos + almAnchor.length);
console.log("6. Inserted student portal activeLessonModal 13 successfully!");

// 7. Inject quiz click handler for Lesson 13
const quizClickAnchor = 'if(Pt.id.includes("lesson-12")||Pt.id.includes("lesson12")||Pt.title.includes("មេរៀនទី ១២")||Pt.title.includes("ការប្រែប្រួលរូបធាតុ"))qe12("tab-quiz"),Oe12(!0);else ';
const quizClickPos = code.indexOf(quizClickAnchor);
if (quizClickPos === -1) {
  console.error("Could not find quizClickAnchor!");
  process.exit(1);
}
const quizClick13 = `if(Pt.id.includes("lesson-13")||Pt.id.includes("lesson13")||Pt.title.includes("មេរៀនទី ១៣")||Pt.title.includes("ធាតុគីមី"))qe13("tab-quiz"),Oe13(!0);else `;
code = code.slice(0, quizClickPos) + quizClick13 + code.slice(quizClickPos);
console.log("7. Inserted quiz click routing for Lesson 13 successfully!");

// 8. Inject Card 13 into Science Lessons list
const card12Start = code.indexOf('(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-blue-500/90');
if (card12Start === -1) {
  console.error("Could not find Card 12 start!");
  process.exit(1);
}

const card13Jsx = `(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-emerald-500/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-emerald-400/50",children:[` +
  `e.jsxs("div",{children:[` +
    `e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900",children:[` +
      `e.jsx("img",{src:"https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600",alt:"ធាតុគីមី អង្គធាតុសុទ្ធ និងល្បាយ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),` +
      `e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-teal-900/40 to-transparent"}),` +
      `e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[` +
        `e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"⚛️"}),` +
        `e.jsx("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"})` +
      `]}),` +
      `e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[` +
        `e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ១៣ ៖ ធាតុគីមី អង្គធាតុសុទ្ធ និងល្បាយ"}),` +
        `e.jsx("p",{className:"text-[10px] text-emerald-200 mt-0.5 font-bold drop-shadow-sm",children:"ជំពូកទី ៤ • ៤០ សំណួរ QCM"})` +
      `]})` +
    `]}),` +
    `e.jsxs("div",{className:"p-4 space-y-3",children:[` +
      `e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"សិក្សាពីធាតុគីមីទាំង ១០៦ ធាតុ អង្គធាតុសុទ្ធ (អង្គធាតុទោល និងសមាសធាតុ) ល្បាយស្មើរសាច់ និងមិនស្មើរសាច់ ព្រមទាំងវិធីញែកល្បាយ ៥ សំខាន់។"}),` +
      `e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-emerald-900 bg-emerald-50/80 p-2 rounded-xl border border-emerald-100",children:[` +
        `e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"text-emerald-500"},{children:"⚛️"})," ១០៦ ធាតុ"]}),` +
        `e.jsx("span",{className:"text-slate-300",children:"•"}),` +
        `e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"text-teal-600"},{children:"🧪"})," អង្គធាតុសុទ្ធ/ល្បាយ"]}),` +
        `e.jsx("span",{className:"text-slate-300",children:"•"}),` +
        `e.jsxs("span",{className:"flex items-center gap-1 text-emerald-800",children:[e.jsx("span",{className:"text-emerald-600"},{children:"📝"})," ៤០ QCM"]})` +
      `]})` +
    `]})` +
  `]}),` +
  `e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[` +
    `e.jsxs("button",{onClick:()=>{Ut||(qe13("tab-hero"),Oe13(!0));},className:"w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[` +
      `e.jsx("span",{children:"🔬"}),` +
      `e.jsx("span",{children:"រៀន & ស្វែងយល់"})` +
    `]}),` +
    `e.jsxs("button",{onClick:()=>{Ut||(qe13("tab-quiz"),Oe13(!0));},className:"w-full py-2.5 bg-gradient-to-r from-emerald-800 via-teal-600 to-emerald-600 hover:from-emerald-900 hover:to-teal-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[` +
      `e.jsx("span",{children:"📝"}),` +
      `e.jsx("span",{children:"ប្រឡង ៤០ QCM"})` +
    `]})` +
  `]})` +
`]})` + ",";

// Put Card 13 right before Card 12
code = code.slice(0, card12Start) + card13Jsx + code.slice(card12Start);
console.log("8. Inserted Science Lesson 13 Card successfully!");

// Validate bundle with esbuild
try {
  esbuild.transformSync(code, { loader: "js" });
  console.log("ESBUILD VALIDATION: Bundle code passes 100% without syntax errors!");
  fs.writeFileSync(filePath, code, 'utf8');
  if (!fs.existsSync('dist/assets')) {
    fs.mkdirSync('dist/assets', { recursive: true });
  }
  fs.writeFileSync(distPath, code, 'utf8');
  console.log("Saved bundled assets to public and dist successfully! New bundle length:", code.length);
} catch (err) {
  console.error("Error in modified bundle:", err.message);
  process.exit(1);
}
