import fs from "node:fs";
import path from "node:path";
import esbuild from "esbuild";
import vm from "node:vm";

console.log("=== Building Final Master Bundle for AI Studio App ===");

const bakPath = "public/assets/index-BwPwHqBe.js.original_bak";
const filePath = "public/assets/index-BwPwHqBe.js";
const distPath = "dist/assets/index-BwPwHqBe.js";

let code = fs.readFileSync(bakPath, "utf8");
console.log("Original backup loaded, size:", code.length);

// 1. Load all 10 Science Lesson components
const rz1 = fs.readFileSync("scripts/rz_lesson1_code.js", "utf8").trim();
const rz2 = fs.readFileSync("scripts/rz2_component_code.js", "utf8").trim();
const rz3 = fs.readFileSync("scripts/rz3_component_code.js", "utf8").trim();
const rz4 = fs.readFileSync("scripts/rz4_component_code.js", "utf8").trim();
const rz5 = fs.readFileSync("scripts/rz5_component_code.js", "utf8").trim();
const rz6 = fs.readFileSync("scripts/rz6_component_code.js", "utf8").trim();
const rz7 = fs.readFileSync("scripts/rz7_component_code.js", "utf8").trim();
const rz8 = fs.readFileSync("scripts/rz8_component_code.js", "utf8").trim();
const rz9 = fs.readFileSync("scripts/rz9_component_code.js", "utf8").trim();
const rz10 = fs.readFileSync("scripts/rz10_component_code.js", "utf8").trim();
const rz11 = fs.readFileSync("scripts/rz11_component_code.js", "utf8").trim();

const cleanCode = (str, name) => {
  let s = str.trim();
  s = s.replace(new RegExp("^var\\s+" + name + "\\s*=\\s*"), "");
  s = s.replace(new RegExp("^const\\s+" + name + "\\s*=\\s*"), "");
  s = s.replace(new RegExp("^let\\s+" + name + "\\s*=\\s*"), "");
  s = s.replace(new RegExp("^" + name + "\\s*=\\s*"), "");
  if (s.endsWith(";")) s = s.slice(0, -1);
  return s;
};

// 2. Prepare component definitions
const lessonsDef = 
  "var NewRz1=" + cleanCode(rz1, "Rz") + ";" +
  "var Rz2=" + cleanCode(rz2, "Rz2") + ";" +
  "var Rz3=" + cleanCode(rz3, "Rz3") + ";" +
  "var Rz4=" + cleanCode(rz4, "Rz4") + ";" +
  "var Rz5=" + cleanCode(rz5, "Rz5") + ";" +
  "var Rz6=" + cleanCode(rz6, "Rz6") + ";" +
  "var Rz7=" + cleanCode(rz7, "Rz7") + ";" +
  "var Rz8=" + cleanCode(rz8, "Rz8") + ";" +
  "var Rz9=" + cleanCode(rz9, "Rz9") + ";" +
  "var Rz10=" + cleanCode(rz10, "Rz10") + ";" +
  "var Rz11=" + cleanCode(rz11, "Rz11") + ";";

// 3. Extract interactive section from lCe
const startSectionStr = `e.jsxs("section",{className:"space-y-3",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[e.jsx("div",{className:"flex items-center gap-2 max-w-full overflow-hidden",children:e.jsxs("div",{ref:N,`;
const endSectionStr = `vt&&e.jsx(iCe,{isOpen:vt,onClose:()=>or(!1),studentName:r.name||"សិស្សឆ្នើម",initialQuizzes:he})]}),`;

const pStart = code.indexOf(startSectionStr);
const pEnd = code.indexOf(endSectionStr);

if (pStart === -1 || pEnd === -1) {
  console.error("Boundaries not found in lCe! pStart:", pStart, "pEnd:", pEnd);
  process.exit(1);
}

let rawSectionJSX = code.substring(pStart, pEnd + endSectionStr.length - 1);

// Add Card 9 and Card 10 for Science Lessons into rawSectionJSX
const card8Marker = `children:"មេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌"`;
const card8Pos = rawSectionJSX.indexOf(card8Marker);
if (card8Pos !== -1) {
  const card8EndMarker = `})]})]}`;
  const card8EndPos = rawSectionJSX.indexOf(card8EndMarker, card8Pos);
  if (card8EndPos !== -1) {
    const card9JSX = `,(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-rose-500/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 relative",children:[e.jsxs("div",{className:"p-5 relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-rose-600 via-purple-700 to-indigo-900 opacity-90 group-hover:scale-105 transition-transform duration-500"}),e.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent)]"}),e.jsxs("div",{className:"relative z-10 flex flex-col h-full justify-between min-h-[145px]",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("span",{className:"px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner flex items-center gap-1.5",children:[e.jsx("span",{children:"🌟"}),"ជំពូកទី ៣ ៖ មនុស្ស & សុខភាព"]}),e.jsx("span",{className:"w-8 h-8 rounded-full bg-rose-400/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-sm text-sm group-hover:rotate-12 transition-transform",children:"🩸"})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("h3",{className:"text-lg font-extrabold text-white leading-snug drop-shadow-md font-['Battambang']",children:"មេរៀនទី ៩ ៖ សុខភាពផ្លូវភេទ និងជំងឺកាមរោគ/អេដស៍"}),e.jsx("p",{className:"text-xs text-rose-100 font-medium mt-1 line-clamp-1 drop-shadow-sm font-['Battambang']",children:"STIs & HIV/AIDS - សៀវភៅពុម្ពទំព័រ ៥២ ដល់ ៥៨"})]})]})]}),e.jsxs("div",{className:"p-5 bg-white flex flex-col justify-between flex-1 gap-4",children:[e.jsx("p",{className:"text-xs text-slate-600 leading-relaxed font-['Battambang'] line-clamp-2",children:"សិក្សាអំពីការឆ្លងជំងឺតាមផ្លូវភេទ (STIs ទាំង ៥) រោគសញ្ញា បង្ការមេរោគអេដស៍/ជំងឺអេដស៍ (HIV/AIDS) និងឥរិយាបថរស់នៅប្រកបដោយសុវត្ថិភាព"}),e.jsxs("div",{className:"flex flex-wrap gap-1.5",children:[e.jsx("span",{className:"px-2.5 py-1 bg-rose-50 text-rose-800 rounded-lg text-[11px] font-semibold border border-rose-200/80 flex items-center gap-1",children:"🦠 ជំងឺឆ្លងតាមផ្លូវភេទ"}),e.jsx("span",{className:"px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg text-[11px] font-semibold border border-purple-200/80 flex items-center gap-1",children:"🩸 មេរោគអេដស៍ HIV/AIDS"}),e.jsx("span",{className:"px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-semibold border border-emerald-200/80 flex items-center gap-1",children:"🛡️ វិធីសាស្ត្របង្ការ"})]}),e.jsxs("div",{className:"pt-2 border-t border-slate-100 flex items-center justify-between mt-auto",children:[e.jsxs("div",{className:"flex items-center gap-2 text-slate-500 text-xs font-semibold",children:[e.jsx("span",{className:"text-rose-600 font-bold flex items-center gap-1",children:"📖 ៤ ផ្នែក"}),e.jsx("span",{children:"•"}),e.jsx("span",{className:"text-rose-700 font-bold flex items-center gap-1",children:"❓ ៤០ QCM"})]}),e.jsxs("button",{onClick:()=>setActiveLessonModal(9),className:"px-4 py-2 bg-gradient-to-r from-rose-600 to-purple-800 hover:from-rose-700 hover:to-purple-900 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/20 hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 group/btn font-['Battambang'] cursor-pointer",children:[e.jsx("span",{children:"ចូលរៀន"}),e.jsx("span",{className:"group-hover/btn:translate-x-1 transition-transform",children:"➔"})]})]})]})]})`;
    
    const card10JSX = `,(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-emerald-500/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 relative",children:[e.jsxs("div",{className:"p-5 relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-900 opacity-90 group-hover:scale-105 transition-transform duration-500"}),e.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent)]"}),e.jsxs("div",{className:"relative z-10 flex flex-col h-full justify-between min-h-[145px]",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("span",{className:"px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner flex items-center gap-1.5",children:[e.jsx("span",{children:"🌟"}),"ជំពូកទី ៤ ៖ រូបវិទ្យា & ជីវវិទ្យា"]}),e.jsx("span",{className:"w-8 h-8 rounded-full bg-emerald-400/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-sm text-sm group-hover:rotate-12 transition-transform",children:"🍎"})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("h3",{className:"text-lg font-extrabold text-white leading-snug drop-shadow-md font-['Battambang']",children:"មេរៀនទី ១០ ៖ ប្រព័ន្ធរំលាយអាហារ"}),e.jsx("p",{className:"text-xs text-emerald-100 font-medium mt-1 line-clamp-1 drop-shadow-sm font-['Battambang']",children:"Digestive System - សៀវភៅពុម្ពទំព័រ ៥៩ ដល់ ៦៤"})]})]})]}),e.jsxs("div",{className:"p-5 bg-white flex flex-col justify-between flex-1 gap-4",children:[e.jsx("p",{className:"text-xs text-slate-600 leading-relaxed font-['Battambang'] line-clamp-2",children:"សិក្សាអំពីអវយវៈប្រព័ន្ធរំលាយអាហារ (មាត់ បំពង់អាហារ ក្រពះ ពោះវៀនតូច ពោះវៀនធំ) ដំណើរការបំបែកអាហារ និងការថែរក្សាសុខភាពប្រព័ន្ធរំលាយអាហារ"}),e.jsxs("div",{className:"flex flex-wrap gap-1.5",children:[e.jsx("span",{className:"px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-semibold border border-emerald-200/80 flex items-center gap-1",children:"🍎 ការបំបែកអាហារ"}),e.jsx("span",{className:"px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg text-[11px] font-semibold border border-teal-200/80 flex items-center gap-1",children:"🫁 អវយវៈរំលាយអាហារ"}),e.jsx("span",{className:"px-2.5 py-1 bg-cyan-50 text-cyan-800 rounded-lg text-[11px] font-semibold border border-cyan-200/80 flex items-center gap-1",children:"💧 សារធាតុងាយ"})]}),e.jsxs("div",{className:"pt-2 border-t border-slate-100 flex items-center justify-between mt-auto",children:[e.jsxs("div",{className:"flex items-center gap-2 text-slate-500 text-xs font-semibold",children:[e.jsx("span",{className:"text-emerald-600 font-bold flex items-center gap-1",children:"📖 ៤ ផ្នែក"}),e.jsx("span",{children:"•"}),e.jsx("span",{className:"text-emerald-700 font-bold flex items-center gap-1",children:"❓ ៤០ QCM"})]}),e.jsxs("button",{onClick:()=>setActiveLessonModal(10),className:"px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 group/btn font-['Battambang'] cursor-pointer",children:[e.jsx("span",{children:"ចូលរៀន"}),e.jsx("span",{className:"group-hover/btn:translate-x-1 transition-transform",children:"➔"})]})]})]})]})`;
    
    rawSectionJSX = rawSectionJSX.substring(0, card8EndPos + card8EndMarker.length) + card9JSX + card10JSX + rawSectionJSX.substring(card8EndPos + card8EndMarker.length);
  }
}

// Replace onClick for cards 1..8 with setActiveLessonModal
for (let i = 2; i <= 8; i++) {
  const oldOnClick = `onClick:()=>{qe${i}("tab-hero");Oe${i}(!0);}`;
  const newOnClick = `onClick:()=>setActiveLessonModal(${i})`;
  if (rawSectionJSX.includes(oldOnClick)) {
    rawSectionJSX = rawSectionJSX.replaceAll(oldOnClick, newOnClick);
  }
}

const oldCard1OnClick = `onClick:()=>{qe("tab-hero");Oe(!0);}`;
const newCard1OnClick = `onClick:()=>setActiveLessonModal(1)`;
if (rawSectionJSX.includes(oldCard1OnClick)) {
  rawSectionJSX = rawSectionJSX.replaceAll(oldCard1OnClick, newCard1OnClick);
}

// Append Science Lesson Modals 1..10 right before end of rawSectionJSX
const lastModalEnd = `vt&&e.jsx(iCe,{isOpen:vt,onClose:()=>or(!1),studentName:r.name||"សិស្សឆ្នើម",initialQuizzes:he})`;
const modalsToAppend = `,activeLessonModal===1&&e.jsx(NewRz1,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab}),activeLessonModal===2&&e.jsx(Rz2,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab}),activeLessonModal===3&&e.jsx(Rz3,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab}),activeLessonModal===4&&e.jsx(Rz4,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab}),activeLessonModal===5&&e.jsx(Rz5,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab}),activeLessonModal===6&&e.jsx(Rz6,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab}),activeLessonModal===7&&e.jsx(Rz7,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab}),activeLessonModal===8&&e.jsx(Rz8,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab}),activeLessonModal===9&&e.jsx(Rz9,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab}),activeLessonModal===10&&e.jsx(Rz10,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab}),activeLessonModal===11&&e.jsx(Rz11,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:u,initialTab:activeLessonSubTab})`;

if (rawSectionJSX.includes(lastModalEnd)) {
  rawSectionJSX = rawSectionJSX.replace(lastModalEnd, lastModalEnd + modalsToAppend);
  console.log("Appended Science Lesson Modals 1..10 to rawSectionJSX!");
}

const sharedComponentDef = `const InteractiveSharedSection=({quizzes:he,onPlayQuiz:o,onPlayGame:Re,onShowToast:u,onNavigateTab:d,teacher:r={name:"សិស្សឆ្នើម"},initialSection="interactive_lessons"})=>{
  const m=y.useRef(null),w=y.useRef(null),j=y.useRef(null),N=y.useRef(null);
  const[panelTab,setPanelTab]=y.useState(initialSection);
  const[activeSubject,setActiveSubject]=y.useState("all");
  const E=panelTab, X=setPanelTab, H=activeSubject, O=setActiveSubject;
  const[activeLessonModal,setActiveLessonModal]=y.useState(null);
  const[activeLessonSubTab,setActiveLessonSubTab]=y.useState("tab-hero");

  const[Xe,Oe]=y.useState(!1),[ze,qe]=y.useState("tab-hero");
  const[Ie,De]=y.useState(!1);
  const[Be,be]=y.useState(!1);
  const[Qe,Et]=y.useState(!1);
  const[vt,or]=y.useState(!1);
  const[et,Me]=y.useState(!1);
  const[Ge,xt]=y.useState(!1),[pe,Ae]=y.useState(0),[Fe,Je]=y.useState(0),[$e,gt]=y.useState(!1);
  const lt=at=>{N.current&&(xt(!0),gt(!1),Ae(at.pageX-N.current.offsetLeft),Je(N.current.scrollLeft))};
  const nt=at=>{if(!Ge||!N.current)return;at.preventDefault();const Sr=(at.pageX-N.current.offsetLeft-pe)*1.5;Math.abs(Sr)>4&&gt(!0),N.current.scrollLeft=Fe-Sr};
  const Nt=()=>{xt(!1)};
  const[jt,Gt]=y.useState(!1),[Wt,er]=y.useState(0),[rt,Xt]=y.useState(0),[Ut,Pe]=y.useState(!1);
  const ot=at=>{m.current&&(Gt(!0),Pe(!1),er(at.pageX-m.current.offsetLeft),Xt(m.current.scrollLeft))};
  const ce=at=>{if(!jt||!m.current)return;at.preventDefault();const Sr=(at.pageX-m.current.offsetLeft-Wt)*1.5;Math.abs(Sr)>4&&Pe(!0),m.current.scrollLeft=rt-Sr};
  const we=()=>{Gt(!1)};
  const[lr,cr]=y.useState(!1),[ne,_e]=y.useState(0),[ut,wr]=y.useState(0),[Rt,Tr]=y.useState(!1);
  const Lr=at=>{if(!j.current)return;const Pt=220;j.current.scrollBy({left:at==="left"?-Pt:Pt,behavior:"smooth"})};
  const He=at=>{j.current&&(cr(!0),Tr(!1),_e(at.pageX-j.current.offsetLeft),wr(j.current.scrollLeft))};
  const Ot=at=>{if(!lr||!j.current)return;at.preventDefault();const Sr=(at.pageX-j.current.offsetLeft-ne)*1.5;Math.abs(Sr)>4&&Tr(!0),j.current.scrollLeft=ut-Sr};
  const tr=()=>{cr(!1)};
  const hr=at=>{if(!m.current)return;const Pt=320;m.current.scrollBy({left:at==="left"?-Pt:Pt,behavior:"smooth"})};

  y.useEffect(() => {
    if (activeLessonModal !== null || Ge) {
      document.body.classList.add("qcm-open", "answering-exam");
    } else {
      document.body.classList.remove("qcm-open", "answering-exam");
    }
    return () => {
      document.body.classList.remove("qcm-open", "answering-exam");
    };
  }, [activeLessonModal, Ge]);

  return ${rawSectionJSX};
};`;

// Replace section in lCe with InteractiveSharedSection call
const lCeReplacement = `e.jsx(InteractiveSharedSection,{quizzes:he,onPlayQuiz:o,onPlayGame:Re,onShowToast:u,onNavigateTab:d,teacher:r}),`;
code = code.substring(0, pStart) + lCeReplacement + code.substring(pEnd + endSectionStr.length);

// Inject InteractiveSharedSection definition and all lessons before ,lCe=({
const lCeDefPos = code.indexOf(",lCe=({");
if (lCeDefPos === -1) {
  console.error("Could not find ,lCe=({ in bundle!");
  process.exit(1);
}
// Replace the comma with a semicolon to end the previous declaration list, 
// then add our new var declarations, then start a new var list for lCe
code = code.substring(0, lCeDefPos) + ";" + lessonsDef + sharedComponentDef + "; var " + code.substring(lCeDefPos + 1);

// Replace Student Portal U_ tabs
const studentResultsStr = `De==="results"&&e.jsxs("div",{className:"space-y-6",children:[`;
const studentResultsPos = code.indexOf(studentResultsStr);

if (studentResultsPos !== -1) {
  const ittMarker = `e.jsx(Itt,{currentStudent:Fs`;
  const ittPos = code.indexOf(ittMarker, studentResultsPos);
  if (ittPos !== -1) {
    const studentCall = `e.jsx(InteractiveSharedSection,{quizzes:(n&&n.length?n:he),onPlayQuiz:fo,onPlayGame:at=>at.actionType==="modal_fishing"?we(!0):at.actionType==="modal_vijjanava"?Le(!0):at.actionType==="modal_english"?ke(!0):Be("games"),onShowToast:c,onNavigateTab:Be,teacher:{name:(Fs?Fs.name:"សិស្សឆ្នើម")},initialSection:"interactive_lessons"}),`;
    code = code.substring(0, studentResultsPos + studentResultsStr.length) + studentCall + code.substring(ittPos);
  }
}

const formulasPattern = `De==="formulas"&&e.jsxs("div",{className:"space-y-6",children:[`;
if (code.includes(formulasPattern)) {
  const formulasCall = `e.jsx(InteractiveSharedSection,{quizzes:(n&&n.length?n:he),onPlayQuiz:fo,onPlayGame:at=>at.actionType==="modal_fishing"?we(!0):at.actionType==="modal_vijjanava"?Le(!0):at.actionType==="modal_english"?ke(!0):Be("games"),onShowToast:c,onNavigateTab:Be,teacher:{name:(Fs?Fs.name:"សិស្សឆ្នើម")},initialSection:"interactive_lessons"}),`;
  code = code.replace(formulasPattern, formulasPattern + formulasCall);
}

const examPattern = `De==="online_exam"&&e.jsxs("div",{className:"space-y-6",children:[`;
if (code.includes(examPattern)) {
  const examCall = `e.jsx(InteractiveSharedSection,{quizzes:(n&&n.length?n:he),onPlayQuiz:fo,onPlayGame:at=>at.actionType==="modal_fishing"?we(!0):at.actionType==="modal_vijjanava"?Le(!0):at.actionType==="modal_english"?ke(!0):Be("games"),onShowToast:c,onNavigateTab:Be,teacher:{name:(Fs?Fs.name:"សិស្សឆ្នើម")},initialSection:"exams"}),`;
  code = code.replace(examPattern, examPattern + examCall);
}

const gamesPattern = `De==="games"&&e.jsxs("div",{className:"space-y-6",children:[`;
if (code.includes(gamesPattern)) {
  const gamesCall = `e.jsx(InteractiveSharedSection,{quizzes:(n&&n.length?n:he),onPlayQuiz:fo,onPlayGame:at=>at.actionType==="modal_fishing"?we(!0):at.actionType==="modal_vijjanava"?Le(!0):at.actionType==="modal_english"?ke(!0):Be("games"),onShowToast:c,onNavigateTab:Be,teacher:{name:(Fs?Fs.name:"សិស្សឆ្នើម")},initialSection:"games"}),`;
  code = code.replace(gamesPattern, gamesPattern + gamesCall);
}

fs.writeFileSync(filePath, code);
if (fs.existsSync("dist/assets")) fs.writeFileSync(distPath, code);

console.log("Bundle saved! Length:", code.length);

console.log("--- Validating with esbuild ---");
esbuild.transformSync(code, { loader: "js" });
console.log("ESBUILD: 100% SUCCESS!");

console.log("--- Validating with vm.Script ---");
new vm.Script(code);
console.log("VM.SCRIPT: 100% SUCCESS!");
