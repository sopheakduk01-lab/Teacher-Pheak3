import fs from 'node:fs';

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

let code = fs.readFileSync(filePath, 'utf8');

console.log("Initial file length:", code.length);

// 1. Extract the section from lCe
const startSectionStr = `e.jsxs("section",{className:"space-y-3",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[e.jsx("div",{className:"flex items-center gap-2 max-w-full overflow-hidden",children:e.jsxs("div",{ref:N,`;
const endSectionStr = `vt&&e.jsx(iCe,{isOpen:vt,onClose:()=>or(!1),studentName:r.name||"សិស្សឆ្នើម",initialQuizzes:he})]}),`;

const pStart = code.indexOf(startSectionStr);
const pEnd = code.indexOf(endSectionStr);

if (pStart === -1 || pEnd === -1) {
  console.error("Could not find section in lCe! pStart:", pStart, "pEnd:", pEnd);
  process.exit(1);
}

// Get section without trailing comma
const rawSectionJSX = code.substring(pStart, pEnd + endSectionStr.length - 1);
console.log("Extracted rawSectionJSX, length:", rawSectionJSX.length);

// 2. Build InteractiveSharedSection component
const sharedComponentDef = `const InteractiveSharedSection=({quizzes:he,onPlayQuiz:o,onPlayGame:Re,onShowToast:u,onNavigateTab:d,teacher:r={name:"សិស្សឆ្នើម"}})=>{
  const m=y.useRef(null),w=y.useRef(null),j=y.useRef(null),N=y.useRef(null);
  const[E,X]=y.useState("interactive_lessons");
  const[H,O]=y.useState("all");
  const[M,setM]=y.useState(null);
  const[Xe,Oe]=y.useState(!1),[ze,qe]=y.useState("tab-hero");
  const[Xe2,Oe2]=y.useState(!1),[ze2,qe2]=y.useState("tab-hero");
  const[Xe3,Oe3]=y.useState(!1),[ze3,qe3]=y.useState("tab-hero");
  const[Xe4,Oe4]=y.useState(!1),[ze4,qe4]=y.useState("tab-hero");
  const[Xe5,Oe5]=y.useState(!1),[ze5,qe5]=y.useState("tab-hero");
  const[Xe6,Oe6]=y.useState(!1),[ze6,qe6]=y.useState("tab-hero");
  const[Xe7,Oe7]=y.useState(!1),[ze7,qe7]=y.useState("tab-hero");
  const[Xe8,Oe8]=y.useState(!1),[ze8,qe8]=y.useState("tab-hero");
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
  return ${rawSectionJSX};
};`;

// 3. Inject InteractiveSharedSection definition right before lCe=
const lCeDefPos = code.indexOf("lCe=({");
if (lCeDefPos === -1) {
  console.error("Could not find lCe=({ in code!");
  process.exit(1);
}

// 4. Replace section in lCe with e.jsx(InteractiveSharedSection, ...)
const lCeReplacement = `e.jsx(InteractiveSharedSection,{quizzes:he,onPlayQuiz:o,onPlayGame:Re,onShowToast:u,onNavigateTab:d,teacher:r}),`;

code = code.substring(0, pStart) + lCeReplacement + code.substring(pEnd + endSectionStr.length);
console.log("Replaced section in lCe with InteractiveSharedSection call!");

// Now inject the component definition before lCe=
const newLCeDefPos = code.indexOf("lCe=({");
code = code.substring(0, newLCeDefPos) + sharedComponentDef + "\n" + code.substring(newLCeDefPos);
console.log("Injected InteractiveSharedSection component definition successfully!");

// 5. In U_ (Student Portal), replace the studentPanelsJSX with e.jsx(InteractiveSharedSection, ...)
const studentTargetStart = `De==="results"&&e.jsxs("div",{className:"space-y-6",children:[`;
const uResultsPos = code.indexOf(studentTargetStart);

if (uResultsPos === -1) {
  console.error("Could not find studentTargetStart in U_!");
  process.exit(1);
}

// Find where studentPanelsJSX was placed (it is between studentTargetStart and e.jsx(Itt, ...)
const ittPos = code.indexOf(`e.jsx(Itt,{currentStudent:Fs`, uResultsPos);
if (ittPos === -1) {
  console.error("Could not find Itt in U_!");
  process.exit(1);
}

const studentCall = `e.jsx(InteractiveSharedSection,{quizzes:(n&&n.length?n:he),onPlayQuiz:fo,onPlayGame:at=>at.actionType==="modal_fishing"?we(!0):at.actionType==="modal_vijjanava"?Le(!0):at.actionType==="modal_english"?ke(!0):Be("games"),onShowToast:c,onNavigateTab:Be,teacher:{name:(Fs?Fs.name:"សិស្សឆ្នើម")}}),`;

// Replace everything between studentTargetStart and ittPos with studentCall
const beforeItt = code.substring(uResultsPos + studentTargetStart.length, ittPos);
console.log("Replacing beforeItt in student portal (length " + beforeItt.length + ")");

code = code.substring(0, uResultsPos + studentTargetStart.length) + studentCall + code.substring(ittPos);
console.log("Injected InteractiveSharedSection into Student Portal!");

// Save files
fs.writeFileSync(filePath, code);
fs.writeFileSync(distPath, code);
console.log("Files written successfully! Final length:", code.length);
