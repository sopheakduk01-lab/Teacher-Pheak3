import fs from 'node:fs';

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

let code = fs.readFileSync(filePath, 'utf8');

console.log("Original file size:", code.length);

// 1. Move interactive lessons section in lCe (Home Page) up to right after Z3e
const z3ePattern = `return e.jsxs("div",{className:"space-y-6",children:[e.jsx(Z3e,{teacher:r,currentYear:t,onOpenProfile:c,onNavigateTab:d,onShowToast:u,onOpenYearManager:s,onOpenNotices:h}),`;

const startStr = `e.jsxs("section",{className:"space-y-3",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[e.jsx("div",{className:"flex items-center gap-2 max-w-full overflow-hidden",children:e.jsxs("div",{ref:N,`;
const endStr = `vt&&e.jsx(iCe,{isOpen:vt,onClose:()=>or(!1),studentName:r.name||"សិស្សឆ្នើម",initialQuizzes:he})]}),`;

const pStart = code.indexOf(startStr);
const pEnd = code.indexOf(endStr);

if (pStart === -1 || pEnd === -1) {
  console.error("Could not find interactive section in lCe!");
  process.exit(1);
}

let sectionContent = code.substring(pStart, pEnd + endStr.length);

// Remove the section from its original lower position in lCe
code = code.substring(0, pStart) + code.substring(pEnd + endStr.length);

// Insert it right after Z3e at the top of lCe
const z3ePos = code.indexOf(z3ePattern);
if (z3ePos === -1) {
  console.error("Could not find Z3e pattern in lCe!");
  process.exit(1);
}

const insertPos = z3ePos + z3ePattern.length;
code = code.substring(0, insertPos) + sectionContent + code.substring(insertPos);
console.log("Moved interactive lessons section to top of Home Page successfully!");

// 2. Update the sidebar items in Htt for the student drawer/sidebar
const oldHtt = `{id:"formulas",label:"រៀន & រូបមន្តទី៦",shortLabel:"រៀន",icon:bs,color:"text-emerald-600"},{id:"games",label:"ល្បែងសិក្សាអន្តរកម្ម",shortLabel:"ល្បែងសិក្សា",icon:kb,color:"text-purple-600",badge:"🎮"},{id:"join",label:"ចូលរួម Game PIN",shortLabel:"Game PIN",icon:dT,color:"text-rose-600",badge:"🎯"},{id:"library",label:"បណ្ណាល័យសៀវភៅ",shortLabel:"បណ្ណាល័យ",icon:hC,color:"text-teal-600",badge:"📚"},{id:"online_exam",label:"ប្រឡង & តេស្ត Online",shortLabel:"តេស្ត",icon:Vs,color:"text-rose-600",badge:"⭐"}`;
const newHtt = `{id:"formulas",label:"មេរៀនអន្តរកម្មតាមមុខវិជ្ជា",shortLabel:"មេរៀន",icon:Jr,color:"text-emerald-600",badge:"32"},{id:"online_exam",label:"វិញ្ញាសាតាមមុខវិជ្ជា",shortLabel:"វិញ្ញាសា",icon:o2e,color:"text-purple-600",badge:"⭐"},{id:"games",label:"ល្បែងសិក្សា",shortLabel:"ល្បែងសិក្សា",icon:kb,color:"text-teal-600",badge:"🎮"},{id:"join",label:"ចូលរួម Game PIN",shortLabel:"Game PIN",icon:dT,color:"text-rose-600",badge:"🎯"},{id:"library",label:"បណ្ណាល័យសៀវភៅ",shortLabel:"បណ្ណាល័យ",icon:hC,color:"text-teal-600",badge:"📚"}`;

if (code.includes(oldHtt)) {
  code = code.replace(oldHtt, newHtt);
  console.log("Updated Htt student drawer items successfully!");
} else {
  console.warn("oldHtt target not found, checking alternatives...");
}

// 3. Add the 3-button interactive bar in Student Portal (U_)
// On results (Student Home Dashboard)
const studentBarResults = `e.jsxs("div",{className:"bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border-2 border-indigo-200/90 dark:border-indigo-800/80 shadow-md space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-2.5 h-6 bg-gradient-to-b from-emerald-500 via-purple-500 to-teal-500 rounded-full"}),e.jsx("h3",{className:"text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul tracking-wide",children:"កម្មវិធីសិក្សា និងសកម្មភាពសិស្ស"})]}),e.jsx("span",{className:"text-[10px] sm:text-xs text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800",children:"កន្លែងសិស្ស 🎓"})]}),e.jsxs("div",{className:"flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 select-none scroll-smooth",children:[e.jsxs("button",{type:"button",onClick:()=>Be("formulas"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/40 border-emerald-400 hover:brightness-110",children:[e.jsx(Jr,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{className:"font-moul tracking-wide",children:"មេរៀនអន្តរកម្មតាមមុខវិជ្ជា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white",children:"32"})]}),e.jsxs("button",{type:"button",onClick:()=>Be("online_exam"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 text-white shadow-purple-900/25 ring-2 ring-purple-400/40 border-purple-400 hover:brightness-110",children:[e.jsx(o2e,{className:"w-4 h-4 text-amber-400"}),e.jsx("span",{className:"font-moul tracking-wide",children:"វិញ្ញាសាតាមមុខវិជ្ជា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white",children:(n?n.length:12)})]}),e.jsxs("button",{type:"button",onClick:()=>Be("games"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/40 border-emerald-400 hover:brightness-110",children:[e.jsx(kb,{className:"w-4 h-4 text-emerald-300"}),e.jsx("span",{className:"font-moul tracking-wide",children:"ល្បែងសិក្សា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white",children:"3"})]})]})]}),`;

const resultsTarget = `De==="results"&&e.jsxs("div",{className:"space-y-6",children:[`;
if (code.includes(resultsTarget)) {
  code = code.replace(resultsTarget, resultsTarget + studentBarResults);
  console.log("Added 3-button card to student results dashboard!");
}

// In formulas tab (Interactive Lessons)
const studentBarFormulas = `e.jsxs("div",{className:"flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 select-none scroll-smooth mb-2",children:[e.jsxs("button",{type:"button",onClick:()=>Be("formulas"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/40 border-emerald-400",children:[e.jsx(Jr,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{className:"font-moul tracking-wide",children:"មេរៀនអន្តរកម្មតាមមុខវិជ្ជា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white",children:"32"})]}),e.jsxs("button",{type:"button",onClick:()=>Be("online_exam"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 border-2 bg-white hover:bg-purple-50 text-slate-800 border-slate-200/90",children:[e.jsx(o2e,{className:"w-4 h-4 text-amber-500"}),e.jsx("span",{className:"font-moul tracking-wide",children:"វិញ្ញាសាតាមមុខវិជ្ជា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-purple-100 text-purple-900",children:(n?n.length:12)})]}),e.jsxs("button",{type:"button",onClick:()=>Be("games"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 border-2 bg-white hover:bg-teal-50 text-slate-800 border-slate-200/90",children:[e.jsx(kb,{className:"w-4 h-4 text-teal-500"}),e.jsx("span",{className:"font-moul tracking-wide",children:"ល្បែងសិក្សា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-teal-100 text-teal-900",children:"3"})]})]}),`;

const formulasTarget = `De==="formulas"&&e.jsxs("div",{className:"space-y-6",children:[`;
if (code.includes(formulasTarget)) {
  code = code.replace(formulasTarget, formulasTarget + studentBarFormulas);
  console.log("Added 3-button navigation to student formulas tab!");
}

// In online_exam tab (Exams by Subject)
const studentBarExam = `e.jsxs("div",{className:"flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 select-none scroll-smooth mb-2",children:[e.jsxs("button",{type:"button",onClick:()=>Be("formulas"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 border-2 bg-white hover:bg-emerald-50 text-slate-800 border-slate-200/90",children:[e.jsx(Jr,{className:"w-4 h-4 text-amber-500"}),e.jsx("span",{className:"font-moul tracking-wide",children:"មេរៀនអន្តរកម្មតាមមុខវិជ្ជា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-emerald-100 text-emerald-800",children:"32"})]}),e.jsxs("button",{type:"button",onClick:()=>Be("online_exam"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 text-white shadow-purple-900/25 ring-2 ring-purple-400/40 border-purple-400",children:[e.jsx(o2e,{className:"w-4 h-4 text-amber-400"}),e.jsx("span",{className:"font-moul tracking-wide",children:"វិញ្ញាសាតាមមុខវិជ្ជា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white",children:(n?n.length:12)})]}),e.jsxs("button",{type:"button",onClick:()=>Be("games"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 border-2 bg-white hover:bg-teal-50 text-slate-800 border-slate-200/90",children:[e.jsx(kb,{className:"w-4 h-4 text-teal-500"}),e.jsx("span",{className:"font-moul tracking-wide",children:"ល្បែងសិក្សា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-teal-100 text-teal-900",children:"3"})]})]}),`;

const examTarget = `De==="online_exam"&&e.jsxs("div",{className:"space-y-6",children:[`;
if (code.includes(examTarget)) {
  code = code.replace(examTarget, examTarget + studentBarExam);
  console.log("Added 3-button navigation to student online_exam tab!");
}

// In games tab (Educational Games)
const studentBarGames = `e.jsxs("div",{className:"flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 select-none scroll-smooth mb-2",children:[e.jsxs("button",{type:"button",onClick:()=>Be("formulas"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 border-2 bg-white hover:bg-emerald-50 text-slate-800 border-slate-200/90",children:[e.jsx(Jr,{className:"w-4 h-4 text-amber-500"}),e.jsx("span",{className:"font-moul tracking-wide",children:"មេរៀនអន្តរកម្មតាមមុខវិជ្ជា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-emerald-100 text-emerald-800",children:"32"})]}),e.jsxs("button",{type:"button",onClick:()=>Be("online_exam"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 border-2 bg-white hover:bg-purple-50 text-slate-800 border-slate-200/90",children:[e.jsx(o2e,{className:"w-4 h-4 text-amber-500"}),e.jsx("span",{className:"font-moul tracking-wide",children:"វិញ្ញាសាតាមមុខវិជ្ជា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-purple-100 text-purple-900",children:(n?n.length:12)})]}),e.jsxs("button",{type:"button",onClick:()=>Be("games"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/40 border-emerald-400",children:[e.jsx(kb,{className:"w-4 h-4 text-emerald-300"}),e.jsx("span",{className:"font-moul tracking-wide",children:"ល្បែងសិក្សា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white",children:"3"})]})]}),`;

const gamesTarget = `De==="games"&&e.jsxs("div",{className:"space-y-6",children:[`;
if (code.includes(gamesTarget)) {
  code = code.replace(gamesTarget, gamesTarget + studentBarGames);
  console.log("Added 3-button navigation to student games tab!");
}

// Write the updated code back
fs.writeFileSync(filePath, code);
fs.writeFileSync(distPath, code);

console.log("Updated files written successfully!");
