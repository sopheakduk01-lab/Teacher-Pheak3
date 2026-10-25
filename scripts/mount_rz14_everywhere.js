import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Mounting Rz14 JSX Component Everywhere in App Bundles ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Mount Rz14 in main App JSX
  const m2Pattern = 'e.jsx(Rz13,{isOpen:Xe13,onClose:()=>Oe13(!1),onShowToast:u,initialTab:ze13}),';
  const m2Replacement = 'e.jsx(Rz14,{isOpen:Xe14,onClose:()=>Oe14(!1),onShowToast:u,initialTab:ze14}),e.jsx(Rz13,{isOpen:Xe13,onClose:()=>Oe13(!1),onShowToast:u,initialTab:ze13}),';

  if (code.includes(m2Pattern) && !code.includes('isOpen:Xe14')) {
    code = code.replace(m2Pattern, m2Replacement);
    console.log("Mounted Rz14 in main App JSX for " + filePath);
  } else {
    console.log("Main App JSX Rz14 already mounted or pattern missing in " + filePath);
  }

  // 2. Mount Rz14 in Teacher/Student Lesson Portal JSX
  const m3Pattern = 'activeLessonModal===13&&e.jsx(Rz13,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})';
  const m3Replacement = 'activeLessonModal===14&&e.jsx(Rz14,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===13&&e.jsx(Rz13,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})';

  if (code.includes(m3Pattern) && !code.includes('activeLessonModal===14')) {
    code = code.replace(m3Pattern, m3Replacement);
    console.log("Mounted Rz14 in Lesson Portal JSX for " + filePath);
  } else {
    console.log("Lesson Portal JSX Rz14 already mounted or pattern missing in " + filePath);
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + filePath);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Saved " + filePath + " successfully!");
  } catch (err) {
    console.error("Validation error in " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== Rz14 Mounting Completed Everywhere! ===");
