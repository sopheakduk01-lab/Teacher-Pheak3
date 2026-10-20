import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';
import vm from 'node:vm';

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

let code = fs.readFileSync(filePath, 'utf8');
console.log("Initial file size:", code.length);

// 1. Load Rz9 and Rz10 code
let rz9Code = fs.readFileSync('scripts/rz9_component_code.js', 'utf8').trim();
if (rz9Code.endsWith(";")) rz9Code = rz9Code.slice(0, -1);

let rz10Code = fs.readFileSync('scripts/rz10_component_code.js', 'utf8').trim();
if (rz10Code.startsWith("var Rz10 =") || rz10Code.startsWith("var Rz10=")) {
  rz10Code = rz10Code.replace(/^var\s+Rz10\s*=\s*/, "");
}
if (rz10Code.endsWith(";")) rz10Code = rz10Code.slice(0, -1);

// 2. Inject Rz9 and Rz10 right before Rz=
const rzMarker = "},Rz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a=\"tab-hero\"";
if (!code.includes(rzMarker)) {
  console.error("rzMarker not found!");
  process.exit(1);
}

const rz9And10Def = "}," + rz9Code + ",Rz10=" + rz10Code;
code = code.replace(rzMarker, rz9And10Def + rzMarker);
console.log("1. Injected Rz9 and Rz10 component definitions!");

// 3. Inject State variables for Lesson 9 & 10 in InteractiveSharedSection
const statesMarker = ",[Xe8,Oe8]=y.useState(!1),[ze8,qe8]=y.useState(\"tab-hero\"),[Ie,De]";
const states9And10 = ",[Xe8,Oe8]=y.useState(!1),[ze8,qe8]=y.useState(\"tab-hero\"),[Xe9,Oe9]=y.useState(!1),[ze9,qe9]=y.useState(\"tab-hero\"),[Xe10,Oe10]=y.useState(!1),[ze10,qe10]=y.useState(\"tab-hero\"),[Ie,De]";

if (code.includes(statesMarker)) {
  code = code.replace(statesMarker, states9And10);
  console.log("2. Injected modal state variables for Lesson 9 & 10!");
} else {
  console.error("statesMarker not found!");
  process.exit(1);
}

// 4. Inject Modals inside InteractiveSharedSection
const modalMarker = "e.jsx(Rz8,{isOpen:Xe8,onClose:()=>Oe8(!1),onShowToast:u,initialTab:ze8}),";
const modals9And10 = "e.jsx(Rz9,{isOpen:Xe9,onClose:()=>Oe9(!1),onShowToast:u,initialTab:ze9}),e.jsx(Rz10,{isOpen:Xe10,onClose:()=>Oe10(!1),onShowToast:u,initialTab:ze10}),";

if (code.includes(modalMarker)) {
  code = code.replace(modalMarker, modalMarker + modals9And10);
  console.log("3. Injected Rz9 & Rz10 modals inside InteractiveSharedSection!");
} else {
  console.error("modalMarker not found!");
  process.exit(1);
}

// 5. Inject Lesson 9 & 10 Cards into Science Carousel inside InteractiveSharedSection
const card8EndMarker = "(H===\"all\"||H===\"អប់រំសុខភាព\")";
let card8Pos = code.indexOf(card8EndMarker);
if (card8Pos !== -1) {
  const lesson9CardJSX = `(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-rose-400/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-rose-300/40",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-rose-950 via-pink-900 to-slate-900",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600",alt:"សុខភាពបន្តពូជ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-rose-950/95 via-rose-900/40 to-transparent"}),e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"❤️"}),e.jsx("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"})]}),e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ៩ ៖ សុខភាពបន្តពូជ"}),e.jsx("p",{className:"text-[10px] text-rose-200 mt-0.5 font-bold drop-shadow-sm",children:"ជំពូកទី ៣ • ទំព័រ ៥២-៥៩ • ៤០ សំណួរ QCM"})]})]}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"សុខភាពផ្លូវភេទ និងបន្តពូជ ការប្រឈមនៃការមានកូន ជំងឺកាមរោគទាំង ៥ និង ៣ ដំណាក់កាលអេដស៍។"}),e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-rose-900 bg-rose-50/80 p-2 rounded-xl border border-rose-100",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Jr,{className:"w-2.5 h-2.5 text-amber-500"})," ៣ ផ្នែកធំៗ"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Za,{className:"w-2.5 h-2.5 text-rose-600"})," ៥ ជំងឺកាមរោគ"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1 text-rose-800",children:[e.jsx(Ns,{className:"w-2.5 h-2.5 text-rose-600"})," ៤០ QCM ពេញលេញ"]})]})]})]}),e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[e.jsxs("button",{onClick:()=>{Ut||(qe9("tab-hero"),Oe9(!0));},className:"w-full py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 hover:from-rose-700 hover:to-indigo-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"🧪"}),e.jsx("span",{children:"រៀន & ស្វែងយល់"})]}),e.jsxs("button",{onClick:()=>{Ut||(qe9("tab-quiz"),Oe9(!0));},className:"w-full py-2.5 bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-700 hover:from-indigo-800 hover:to-rose-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📝"}),e.jsx("span",{children:"ប្រឡង ៤០ QCM"})]})]})]}),`;

  const lesson10CardJSX = `(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-emerald-400/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-emerald-300/40",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600",alt:"ប្រព័ន្ធរំលាយអាហារ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-teal-900/40 to-transparent"}),e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"🥗"}),e.jsx("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"})]}),e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ១០ ៖ ប្រព័ន្ធរំលាយអាហារ"}),e.jsx("p",{className:"text-[10px] text-emerald-200 mt-0.5 font-bold drop-shadow-sm",children:"ជំពូកទី ៣ • ទំព័រ ៦០-៦៣ • ៤០ សំណួរ QCM"})]})]}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"បំពង់រំលាយអាហារ តួនាទីសរីរាង្គនីមួយៗ រសរំលាយអាហារ ជំងឺពុកធ្មេញ ក្រពះ ទល់លាមក និង ៦ វិធានការអនាម័យ។"}),e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-emerald-900 bg-emerald-50/80 p-2 rounded-xl border border-emerald-100",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Jr,{className:"w-2.5 h-2.5 text-amber-500"})," ៦ សរីរាង្គ"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Za,{className:"w-2.5 h-2.5 text-emerald-600"})," ៦ វិធានការ"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1 text-emerald-800",children:[e.jsx(Ns,{className:"w-2.5 h-2.5 text-emerald-600"})," ៤០ QCM ពេញលេញ"]})]})]})]}),e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[e.jsxs("button",{onClick:()=>{Ut||(qe10("tab-hero"),Oe10(!0));},className:"w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-700 hover:to-indigo-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"🧪"}),e.jsx("span",{children:"រៀន & ស្វែងយល់"})]}),e.jsxs("button",{onClick:()=>{Ut||(qe10("tab-quiz"),Oe10(!0));},className:"w-full py-2.5 bg-gradient-to-r from-indigo-700 via-teal-700 to-emerald-700 hover:from-indigo-800 hover:to-emerald-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📝"}),e.jsx("span",{children:"ប្រឡង ៤០ QCM"})]})]})]}),`;

  code = code.substring(0, card8Pos) + lesson9CardJSX + lesson10CardJSX + code.substring(card8Pos);
  console.log("4. Injected Lesson 9 & 10 Cards into Science Carousel!");
} else {
  console.error("card8EndMarker not found!");
  process.exit(1);
}

// 6. Inject Quiz Click Handlers for Lesson 9 & 10
const quiz8Marker = "else if(Pt.id.includes(\"lesson-8\")||Pt.id.includes(\"lesson8\")||Pt.title.includes(\"មេរៀនទី ៨\")||Pt.title.includes(\"ការការពារកុំឱ្យមានគភ៌\"))qe8(\"tab-quiz\"),Oe8(!0);";
const quiz9And10Def = "if(Pt.id.includes(\"lesson-10\")||Pt.id.includes(\"lesson10\")||Pt.title.includes(\"មេរៀនទី ១០\")||Pt.title.includes(\"ប្រព័ន្ធរំលាយអាហារ\"))qe10(\"tab-quiz\"),Oe10(!0);else if(Pt.id.includes(\"lesson-9\")||Pt.id.includes(\"lesson9\")||Pt.title.includes(\"មេរៀនទី ៩\")||Pt.title.includes(\"សុខភាពបន្តពូជ\"))qe9(\"tab-quiz\"),Oe9(!0);else ";

if (code.includes(quiz8Marker)) {
  code = code.replace(quiz8Marker, quiz9And10Def + quiz8Marker);
  console.log("5. Injected Quiz Click Handlers for Lesson 9 & 10!");
} else {
  console.error("quiz8Marker not found!");
  process.exit(1);
}

// 7. Inject Iz9 and Iz10 quiz items into quiz list
const iz8Marker = "Iz8={id:\"quiz-science-lesson8-40q\",title:\"វិញ្ញាសាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ • មេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌ (៤០ QCM)\",subject:\"វិទ្យាសាស្ត្រ\",questionCount:40,isPublic:!0,imageUrl:\"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600\"}";
const iz9And10Def = ",Iz9={id:\"quiz-science-lesson9-40q\",title:\"វិញ្ញាសាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ • មេរៀនទី ៩ ៖ សុខភាពបន្តពូជ (៤០ QCM)\",subject:\"វិទ្យាសាស្ត្រ\",questionCount:40,isPublic:!0,imageUrl:\"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600\"},Iz10={id:\"quiz-science-lesson10-40q\",title:\"វិញ្ញាសាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ • មេរៀនទី ១០ ៖ ប្រព័ន្ធរំលាយអាហារ (៤០ QCM)\",subject:\"វិទ្យាសាស្ត្រ\",questionCount:40,isPublic:!0,imageUrl:\"https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600\"}";

if (code.includes(iz8Marker)) {
  code = code.replace(iz8Marker, iz8Marker + iz9And10Def);
  console.log("6. Defined Iz9 & Iz10 quiz items!");
} else {
  console.error("iz8Marker not found!");
  process.exit(1);
}

// 8. Inject Iz9 & Iz10 to he quiz memo list
const iz8MemoMarker = "at.some(ys=>ys.id===Iz8.id||ys.title.includes(\"មេរៀនទី ៨\"))||at.unshift(Iz8),";
const iz9And10MemoDef = "at.some(ys=>ys.id===Iz9.id||ys.title.includes(\"មេរៀនទី ៩\"))||at.unshift(Iz9),at.some(ys=>ys.id===Iz10.id||ys.title.includes(\"មេរៀនទី ១០\"))||at.unshift(Iz10),";

if (code.includes(iz8MemoMarker)) {
  code = code.replace(iz8MemoMarker, iz8MemoMarker + iz9And10MemoDef);
  console.log("7. Added Iz9 & Iz10 to he quiz memo list!");
} else {
  console.error("iz8MemoMarker not found!");
  process.exit(1);
}

// Validate with esbuild
console.log("--- Validating with esbuild ---");
try {
  esbuild.transformSync(code, { loader: "js" });
  console.log("ESBUILD VALIDATION: SUCCESS 100%!");
} catch (err) {
  console.error("ESBUILD ERROR:", err.message);
  process.exit(1);
}

// Validate with vm.Script
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
if (!fs.existsSync('dist/assets')) {
  fs.mkdirSync('dist/assets', { recursive: true });
}
fs.writeFileSync(distPath, code);
console.log("SUCCESSFULLY INJECTED Science Lessons 9 & 10! Final size:", code.length);
