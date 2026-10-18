import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';
import vm from 'node:vm';

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

let code = fs.readFileSync(filePath, 'utf8');
console.log("Original file size:", code.length);

// 1. Fix Rz9 syntax error:
// Line 193 in stisData map had an extra paren:
const badStisBlock = `                  ]},k)\n                })\n              )\n            ]})`;
const goodStisBlock = `                  ]},k)\n                })\n              })\n            ]})`;
if (code.includes(badStisBlock)) {
  code = code.replace(badStisBlock, goodStisBlock);
  console.log("Fixed Rz9 stisData map syntax!");
} else {
  console.log("badStisBlock not found or already fixed.");
}

// 2. Fix Rz9 end syntax:
const badRz9End = `    ]})\n  );\n};,\nRz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"`;
const goodRz9End = `    ]})\n  })\n},\nRz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"`;
if (code.includes(badRz9End)) {
  code = code.replace(badRz9End, goodRz9End);
  console.log("Fixed Rz9 end syntax!");
} else {
  console.log("badRz9End not found or already fixed.");
}

// 3. Update InteractiveSharedSection signature to support initialSection and sync on change:
const origIssHeader = `const InteractiveSharedSection=({quizzes:he,onPlayQuiz:o,onPlayGame:Re,onShowToast:u,onNavigateTab:d,teacher:r={name:"សិស្សឆ្នើម"}})=>{  const m=y.useRef(null),w=y.useRef(null),j=y.useRef(null),N=y.useRef(null);  const[E,X]=y.useState("interactive_lessons");`;
const newIssHeader = `const InteractiveSharedSection=({quizzes:he,onPlayQuiz:o,onPlayGame:Re,onShowToast:u,onNavigateTab:d,teacher:r={name:"សិស្សឆ្នើម"},initialSection="interactive_lessons"})=>{  const m=y.useRef(null),w=y.useRef(null),j=y.useRef(null),N=y.useRef(null);  const[E,X]=y.useState(initialSection);  y.useEffect(()=>{X(initialSection)},[initialSection]);`;

if (code.includes(origIssHeader)) {
  code = code.replace(origIssHeader, newIssHeader);
  console.log("Updated InteractiveSharedSection signature with initialSection & sync effect!");
} else {
  console.log("origIssHeader not found, checking if already updated...");
}

// 4. Update the 3 tab buttons in InteractiveSharedSection to also notify onNavigateTab:
const origTabButtons = `e.jsxs("button",{onClick:()=>{$e||(X("interactive_lessons"),O("all"))},className:\`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 \${E==="interactive_lessons"?"bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-emerald-600/20 ring-2 ring-emerald-400/40":"bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200"}\`,children:[e.jsx(Jr,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{children:"មេរៀនអន្តរកម្មតាមមុខវិជ្ជា"}),e.jsx("span",{className:\`text-[10px] px-1.5 py-0.5 rounded-full font-bold \${E==="interactive_lessons"?"bg-white/20 text-white":"bg-emerald-100 text-emerald-800"}\`,children:"32"})]}),e.jsxs("button",{onClick:()=>{$e||(X("exams"),O("all"))},className:\`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 \${E==="exams"?"bg-gradient-to-r from-purple-800 via-indigo-700 to-rose-700 text-white shadow-purple-900/20 ring-2 ring-purple-400/40":"bg-white hover:bg-purple-50 text-slate-700 border border-slate-200"}\`,children:[e.jsx(o2e,{className:"w-4 h-4 text-amber-400"}),e.jsx("span",{children:"វិញ្ញាសាតាមមុខវិជ្ជា"}),e.jsx("span",{className:\`text-[10px] px-1.5 py-0.5 rounded-full font-bold \${E==="exams"?"bg-white/20 text-white":"bg-purple-100 text-purple-900"}\`,children:(he?he.length:12)})]}),e.jsxs("button",{onClick:()=>{$e||(X("games"),O("all"))},className:\`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 \${E==="games"?"bg-gradient-to-r from-teal-700 via-emerald-600 to-indigo-700 text-white shadow-teal-900/20 ring-2 ring-teal-400/40":"bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200"}\`,children:[e.jsx(kb,{className:"w-4 h-4 text-emerald-400"}),e.jsx("span",{children:"ល្បែងសិក្សា"}),e.jsx("span",{className:\`text-[10px] px-1.5 py-0.5 rounded-full font-bold \${E==="games"?"bg-white/20 text-white":"bg-emerald-100 text-emerald-900"}\`,children:Kz.length})]})`;

const newTabButtons = `e.jsxs("button",{onClick:()=>{$e||(X("interactive_lessons"),O("all"),d&&d("formulas"))},className:\`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 \${E==="interactive_lessons"?"bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-emerald-600/20 ring-2 ring-emerald-400/40":"bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200"}\`,children:[e.jsx(Jr,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{children:"មេរៀនអន្តរកម្មតាមមុខវិជ្ជា"}),e.jsx("span",{className:\`text-[10px] px-1.5 py-0.5 rounded-full font-bold \${E==="interactive_lessons"?"bg-white/20 text-white":"bg-emerald-100 text-emerald-800"}\`,children:"32"})]}),e.jsxs("button",{onClick:()=>{$e||(X("exams"),O("all"),d&&d("online_exam"))},className:\`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 \${E==="exams"?"bg-gradient-to-r from-purple-800 via-indigo-700 to-rose-700 text-white shadow-purple-900/20 ring-2 ring-purple-400/40":"bg-white hover:bg-purple-50 text-slate-700 border border-slate-200"}\`,children:[e.jsx(o2e,{className:"w-4 h-4 text-amber-400"}),e.jsx("span",{children:"វិញ្ញាសាតាមមុខវិជ្ជា"}),e.jsx("span",{className:\`text-[10px] px-1.5 py-0.5 rounded-full font-bold \${E==="exams"?"bg-white/20 text-white":"bg-purple-100 text-purple-900"}\`,children:(he?he.length:12)})]}),e.jsxs("button",{onClick:()=>{$e||(X("games"),O("all"),d&&d("games"))},className:\`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 \${E==="games"?"bg-gradient-to-r from-teal-700 via-emerald-600 to-indigo-700 text-white shadow-teal-900/20 ring-2 ring-teal-400/40":"bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200"}\`,children:[e.jsx(kb,{className:"w-4 h-4 text-emerald-400"}),e.jsx("span",{children:"ល្បែងសិក្សា"}),e.jsx("span",{className:\`text-[10px] px-1.5 py-0.5 rounded-full font-bold \${E==="games"?"bg-white/20 text-white":"bg-emerald-100 text-emerald-900"}\`,children:Kz.length})]})`;

if (code.includes(origTabButtons)) {
  code = code.replace(origTabButtons, newTabButtons);
  console.log("Updated InteractiveSharedSection tab buttons with onNavigateTab notifications!");
} else {
  console.log("origTabButtons pattern not found exactly.");
}

// 5. In Student Portal (U_):
// Update De==="formulas" to render InteractiveSharedSection with initialSection="interactive_lessons"
// Update De==="online_exam" to render InteractiveSharedSection with initialSection="exams"
// Update De==="games" to render InteractiveSharedSection with initialSection="games"

const studentSharedCall = (initSec) => `e.jsx(InteractiveSharedSection,{quizzes:(n&&n.length?n:he),onPlayQuiz:fo,onPlayGame:at=>at.actionType==="modal_fishing"?we(!0):at.actionType==="modal_vijjanava"?Le(!0):at.actionType==="modal_english"?ke(!0):Be("games"),onShowToast:c,onNavigateTab:Be,teacher:{name:(Fs?Fs.name:"សិស្សឆ្នើម")},initialSection:"${initSec}"})`;

// In De==="results":
const resultsIssTarget = `e.jsx(InteractiveSharedSection,{quizzes:(n&&n.length?n:he),onPlayQuiz:fo,onPlayGame:at=>at.actionType==="modal_fishing"?we(!0):at.actionType==="modal_vijjanava"?Le(!0):at.actionType==="modal_english"?ke(!0):Be("games"),onShowToast:c,onNavigateTab:Be,teacher:{name:(Fs?Fs.name:"សិស្សឆ្នើម")}});`;
const resultsIssTarget2 = `e.jsx(InteractiveSharedSection,{quizzes:(n&&n.length?n:he),onPlayQuiz:fo,onPlayGame:at=>at.actionType==="modal_fishing"?we(!0):at.actionType==="modal_vijjanava"?Le(!0):at.actionType==="modal_english"?ke(!0):Be("games"),onShowToast:c,onNavigateTab:Be,teacher:{name:(Fs?Fs.name:"សិស្សឆ្នើម")}}),`;

if (code.includes(resultsIssTarget2)) {
  code = code.replace(resultsIssTarget2, studentSharedCall("interactive_lessons") + ",");
  console.log("Updated InteractiveSharedSection call in De===results!");
}

// Now in De==="formulas":
const formulasPattern = `De==="formulas"&&e.jsxs("div",{className:"space-y-6",children:[`;
if (code.includes(formulasPattern)) {
  code = code.replace(formulasPattern, formulasPattern + studentSharedCall("interactive_lessons") + ",");
  console.log("Injected InteractiveSharedSection into De===formulas!");
}

// In De==="online_exam":
const examPattern = `De==="online_exam"&&e.jsxs("div",{className:"space-y-6",children:[`;
if (code.includes(examPattern)) {
  code = code.replace(examPattern, examPattern + studentSharedCall("exams") + ",");
  console.log("Injected InteractiveSharedSection into De===online_exam!");
}

// In De==="games":
const gamesPattern = `De==="games"&&e.jsxs("div",{className:"space-y-6",children:[`;
if (code.includes(gamesPattern)) {
  code = code.replace(gamesPattern, gamesPattern + studentSharedCall("games") + ",");
  console.log("Injected InteractiveSharedSection into De===games!");
}

// 6. Test syntax with esbuild and vm.Script
console.log("--- Validating with esbuild ---");
try {
  esbuild.transformSync(code, { loader: "js" });
  console.log("ESBUILD VALIDATION: SUCCESS 100%!");
} catch (err) {
  console.error("ESBUILD ERROR:", err.message);
  process.exit(1);
}

console.log("--- Validating with vm.Script ---");
try {
  new vm.Script(code);
  console.log("VM.SCRIPT VALIDATION: SUCCESS 100%!");
} catch (err) {
  console.error("VM.SCRIPT ERROR:", err.message);
  process.exit(1);
}

// Write to files
fs.writeFileSync(filePath, code);
fs.writeFileSync(distPath, code);
console.log("Saved files successfully! Final size:", code.length);
