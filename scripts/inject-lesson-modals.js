import fs from 'node:fs';

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

let code = fs.readFileSync(filePath, 'utf8');

const target = `e.jsxs("p",{className:"text-[11px] text-slate-400",children:["🔒 លេខកូដសម្ងាត់គ្រូលំនាំដើមគឺ ",e.jsx("strong",{children:"8888"})," (អាចកែប្រែក្នុងប្រវត្តិរូបគ្រូ)"]})})]})})})]})]`;
const lessonModalsJSX = `,activeLessonModal===1&&e.jsx(Rz,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===2&&e.jsx(Rz2,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===3&&e.jsx(Rz3,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===4&&e.jsx(Rz4,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===5&&e.jsx(Rz5,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===6&&e.jsx(Rz6,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===7&&e.jsx(Rz7,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===8&&e.jsx(Rz8,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})]`;

const replacement = `e.jsxs("p",{className:"text-[11px] text-slate-400",children:["🔒 លេខកូដសម្ងាត់គ្រូលំនាំដើមគឺ ",e.jsx("strong",{children:"8888"})," (អាចកែប្រែក្នុងប្រវត្តិរូបគ្រូ)"]})})]})})})]})` + lessonModalsJSX;

if (code.includes("activeLessonModal===1")) {
  console.log("activeLessonModal modals already injected!");
} else if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(filePath, code);
  fs.writeFileSync(distPath, code);
  console.log("Successfully injected Rz1-8 lesson modals into U_!");
} else {
  console.error("target not found!");
  process.exit(1);
}
