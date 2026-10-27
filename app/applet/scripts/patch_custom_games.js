import fs from "node:fs";
import path from "node:path";
import esbuild from "esbuild";
import vm from "node:vm";

const rootDir = path.resolve(process.cwd(), process.cwd().endsWith("scripts") ? ".." : ".");
const filePath = path.join(rootDir, "public/assets/index-BwPwHqBe.js");
const distPath = path.join(rootDir, "dist/assets/index-BwPwHqBe.js");

console.log("Root dir:", rootDir);

let code = fs.readFileSync(filePath, "utf8");
console.log("Loaded bundle for patching custom games, length:", code.length);

const poeMarker = "poe=({quizzes:r=[],onPlayQuiz:t,onShowToast:s})=>{";
const poePos = code.indexOf(poeMarker);

if (poePos === -1) {
  console.error("Could not find poe component in bundle!");
  process.exit(1);
}

// 1. Inject custom games state and handlers right after poe=...=>{
const stateInjection = `const [customGames,setCustomGames]=y.useState(()=>{try{return JSON.parse(localStorage.getItem("teacher_custom_games")||"[]")}catch{return[]}});` +
  `const [showAddGameModal,setShowAddGameModal]=y.useState(false);` +
  `const [newGameTitle,setNewGameTitle]=y.useState("");` +
  `const [newGameSubject,setNewGameSubject]=y.useState("ភាសាខ្មែរ");` +
  `const [newGameGrade,setNewGameGrade]=y.useState("ថ្នាក់ទី ៤-៦");` +
  `const [newGameDesc,setNewGameDesc]=y.useState("");` +
  `const [newGameCode,setNewGameCode]=y.useState("");` +
  `const [newGameIcon,setNewGameIcon]=y.useState("🎮");` +
  `const [playingCustomGame,setPlayingCustomGame]=y.useState(null);` +
  `const handleSaveCustomGame=()=>{if(!newGameTitle.trim()||!newGameCode.trim()){s&&s("⚠️ សូមបញ្ចូលចំណងជើងល្បែង និងកូដបញ្ចូលឱ្យបានត្រឹមត្រូវ!");return;}const ng={id:"custom_"+Date.now(),title:newGameTitle.trim(),khmerSubject:newGameSubject,grade:newGameGrade,icon:newGameIcon||"🎮",color:"from-purple-600 via-indigo-600 to-pink-600",description:newGameDesc.trim()||"ល្បែងសិក្សាអន្តរកម្មបញ្ចូលដោយគ្រូ/សិស្ស",tags:[newGameSubject,"ល្បែងផ្ទាល់ខ្លួន"],isCustom:true,embedCode:newGameCode.trim()};const upd=[ng,...customGames];setCustomGames(upd);try{localStorage.setItem("teacher_custom_games",JSON.stringify(upd))}catch(e){}setShowAddGameModal(false);setNewGameTitle("");setNewGameDesc("");setNewGameCode("");s&&s("🎉 បានបញ្ចូលល្បែងសិក្សាថ្មីដោយជោគជ័យ!")};` +
  `const handleDeleteCustomGame=(id,evt)=>{evt.stopPropagation();if(confirm("តើអ្នកពិតជាចង់លុបល្បែងសិក្សានេះមែនទេ?")){const upd=customGames.filter(g=>g.id!==id);setCustomGames(upd);try{localStorage.setItem("teacher_custom_games",JSON.stringify(upd))}catch(e){}s&&s("🗑️ បានលុបល្បែងសិក្សាជោគជ័យ។")}};`;

code = code.substring(0, poePos + poeMarker.length) + stateInjection + code.substring(poePos + poeMarker.length);

// 2. Combine customGames with he
const heMarker = "he=[{id:\"math\"";
const hePos = code.indexOf(heMarker);
if (hePos !== -1) {
  code = code.substring(0, hePos) + "const allGames=[...customGames,...{id:\"math\"" + code.substring(hePos + 14);
} else {
  console.warn("he marker not found exactly");
}

code = code.replaceAll("he.map(", "allGames.filter(Re=>{const matchSub=o===\"all\"||Re.khmerSubject===o;const matchSearch=!h||Re.title.toLowerCase().includes(h.toLowerCase())||Re.description.toLowerCase().includes(h.toLowerCase());return matchSub&&matchSearch}).map(");

const hubHeaderMarker = 'a==="hub"&&e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4",children:e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4",children:[';

const addGameBtn = 'e.jsx("button",{onClick:()=>setShowAddGameModal(true),className:"px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 cursor-pointer transition active:scale-95 shrink-0",children:[e.jsx("span",{children:"➕"}),e.jsx("span",{children:"បញ្ចូលល្បែងដោយកូដ"})]}),';

if (code.includes(hubHeaderMarker)) {
  code = code.replace(hubHeaderMarker, hubHeaderMarker + addGameBtn);
  console.log("Injected Add Game button!");
}

const mathTabMarker = 'a==="math"&&';
const mathTabPos = code.indexOf(mathTabMarker, poePos);

const modalsJSX = 'showAddGameModal&&e.jsx("div",{className:"fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in",children:e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-[32px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 relative",children:[e.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center text-lg",children:"🎮"}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-base font-extrabold text-slate-900 dark:text-slate-100",children:"បញ្ចូលល្បែងសិក្សាថ្មីដោយកូដ"}),e.jsx("p",{className:"text-xs text-slate-500",children:"បន្ថែម Embed Code ឬ iframe របស់អ្នកផ្ទាល់"})]})]}),e.jsx("button",{onClick:()=>setShowAddGameModal(false),className:"w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center text-sm font-bold cursor-pointer",children:"✕"})]}),e.jsxs("div",{className:"space-y-4 max-h-[70vh] overflow-y-auto pr-1",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-bold text-slate-700 dark:text-slate-300",children:"ចំណងជើងល្បែង *"}),e.jsx("input",{type:"text",value:newGameTitle,onChange:e=>setNewGameTitle(e.target.value),placeholder:"ឧ. ល្បែងតេស្តចំណេះដឹងទូទៅ...",className:"w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-medium focus:ring-2 focus:ring-purple-500"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-bold text-slate-700 dark:text-slate-300",children:"មុខវិជ្ជា"}),e.jsxs("select",{value:newGameSubject,onChange:e=>setNewGameSubject(e.target.value),className:"w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-medium focus:ring-2 focus:ring-purple-500",children:[e.jsx("option",{value:"ភាសាខ្មែរ",children:"ភាសាខ្មែរ"}),e.jsx("option",{value:"គណិតវិទ្យា",children:"គណិតវិទ្យា"}),e.jsx("option",{value:"វិទ្យាសាស្ត្រ",children:"វិទ្យាសាស្ត្រ"}),e.jsx("option",{value:"សិក្សាសង្គម",children:"សិក្សាសង្គម"}),e.jsx("option",{value:"អប់រំសុខភាព",children:"អប់រំសុខភាព"}),e.jsx("option",{value:"ភាសាអង់គ្លេស",children:"ភាសាអង់គ្លេស"}),e.jsx("option",{value:"គ្រប់មុខវិជ្ជា",children:"គ្រប់មុខវិជ្ជា"})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-bold text-slate-700 dark:text-slate-300",children:"ថ្នាក់ទី"}),e.jsxs("select",{value:newGameGrade,onChange:e=>setNewGameGrade(e.target.value),className:"w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-medium focus:ring-2 focus:ring-purple-500",children:[e.jsx("option",{value:"ថ្នាក់ទី ១-៣",children:"ថ្នាក់ទី ១-៣"}),e.jsx("option",{value:"ថ្នាក់ទី ៤-៦",children:"ថ្នាក់ទី ៤-៦"}),e.jsx("option",{value:"គ្រប់ថ្នាក់",children:"គ្រប់ថ្នាក់"})]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-bold text-slate-700 dark:text-slate-300",children:"រូបតំណាង (Emoji)"}),e.jsx("input",{type:"text",value:newGameIcon,onChange:e=>setNewGameIcon(e.target.value),placeholder:"🎮",className:"w-full px-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-medium focus:ring-2 focus:ring-purple-500"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-bold text-slate-700 dark:text-slate-300",children:"ការពិពណ៌នាខ្លី"}),e.jsx("input",{type:"text",value:newGameDesc,onChange:e=>setNewGameDesc(e.target.value),placeholder:"ពិពណ៌នាអំពីល្បែងនេះ...",className:"w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-medium focus:ring-2 focus:ring-purple-500"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-bold text-slate-700 dark:text-slate-300",children:"កូដបញ្ចូល (Embed Code / iframe / URL) *"}),e.jsx("textarea",{rows:4,value:newGameCode,onChange:e=>setNewGameCode(e.target.value),placeholder:\`<iframe src="https://wordwall.net/embed/..." width="100%" height="500" frameborder="0" allowfullscreen></iframe>\`,className:"w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-medium focus:ring-2 focus:ring-purple-500 font-mono"}),e.jsx("p",{className:"text-[11px] text-slate-400",children:"អ្នកអាចដាក់កូដ iframe ពី Wordwall, Kahoot, Quizizz, Google Forms ឬ URL គេហទំព័រហ្គេមណាមួយ។"})]})]}),e.jsxs("div",{className:"flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800",children:[e.jsx("button",{onClick:()=>setShowAddGameModal(false),className:"px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer",children:"បោះបង់"}),e.jsx("button",{onClick:handleSaveCustomGame,className:"px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 cursor-pointer",children:"រក្សាទុក & បញ្ចូលល្បែង"})]})]})}),';

if (mathTabPos !== -1) {
  code = code.substring(0, mathTabPos) + modalsJSX + code.substring(mathTabPos);
  console.log("Injected Add Game Modal!");
}

fs.writeFileSync(filePath, code);
if (fs.existsSync(path.join(rootDir, "dist/assets"))) {
  fs.writeFileSync(distPath, code);
}

console.log("Bundle successfully patched with custom games feature!");

esbuild.transformSync(code, { loader: "js" });
console.log("ESBUILD validation passed!");
new vm.Script(code);
console.log("VM.SCRIPT validation passed!");
