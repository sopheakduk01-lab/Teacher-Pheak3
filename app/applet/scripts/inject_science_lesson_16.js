import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Injecting Science Lesson 16 into App Bundles ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

// Read questions
const l16Questions = JSON.parse(fs.readFileSync('scripts/lesson16_questions.json', 'utf8'));
const zi16Questions = l16Questions.map(q => ({
  q: q.q || q.question,
  opts: (q.opts || q.options || []).map(o => ({
    t: o.t || o.text,
    c: o.c !== undefined ? o.c : o.isCorrect,
    e: o.e || o.explanation
  }))
}));

const zi16Code = `Zi16=${JSON.stringify(zi16Questions)},Iz16={id:"science-lesson-16-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ១៦ - ធាតុអាកាស",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:25,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ១៦ ៖ ធាតុអាកាស (ជំពូកទី ៥)",questions:Zi16},`;

// Read Rz16 code
let rz16Raw = fs.readFileSync('scripts/rz16_component_code.js', 'utf8').trim();
if (rz16Raw.startsWith('var Rz16 =')) {
  rz16Raw = rz16Raw.replace(/^var Rz16\s*=\s*/, '');
}
if (rz16Raw.endsWith(';')) {
  rz16Raw = rz16Raw.slice(0, -1);
}

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Inject Zi16 and Iz16
  if (!code.includes('Iz16=')) {
    const izAnchor = 'questions:Zi15},';
    const izPos = code.indexOf(izAnchor);
    if (izPos !== -1) {
      code = code.slice(0, izPos + izAnchor.length) + zi16Code + code.slice(izPos + izAnchor.length);
      console.log("Injected Zi16 & Iz16 in " + filePath);
    } else {
      console.error("Could not find Zi15 anchor in " + filePath);
    }
  }

  // 2. Unshift Iz16 in quiz list
  if (!code.includes('Iz16.id')) {
    const unshiftAnchor = 'at.unshift(Iz15),';
    const unshiftPos = code.indexOf(unshiftAnchor);
    if (unshiftPos !== -1) {
      const unshiftIz16 = `at.some(ys=>ys.id===Iz16.id||ys.title.includes("មេរៀនទី ១៦"))||at.unshift(Iz16),`;
      code = code.slice(0, unshiftPos) + unshiftIz16 + code.slice(unshiftPos);
      console.log("Unshifted Iz16 in " + filePath);
    } else {
      console.error("Could not find Iz15 unshift anchor in " + filePath);
    }
  }

  // 3. Inject Rz16 component definition
  if (!code.includes('Rz16=({')) {
    const rz15Anchor = 'Rz15=({';
    const rz15Pos = code.indexOf(rz15Anchor);
    if (rz15Pos !== -1) {
      code = code.slice(0, rz15Pos) + "Rz16=" + rz16Raw + ",\n" + code.slice(rz15Pos);
      console.log("Injected Rz16 definition in " + filePath);
    } else {
      console.error("Could not find Rz15 definition anchor in " + filePath);
    }
  } else {
    // Replace existing Rz16 definition
    const rz16Idx = code.indexOf("Rz16=({");
    const rz15Idx = code.indexOf(",\nRz15=({", rz16Idx);
    if (rz16Idx !== -1 && rz15Idx !== -1) {
      code = code.slice(0, rz16Idx) + "Rz16=" + rz16Raw + code.slice(rz15Idx);
      console.log("Updated Rz16 definition in " + filePath);
    }
  }

  // 4. Inject Xe16 state hook in main App
  if (!code.includes('[Xe16,Oe16]')) {
    const stateAnchor = ',[Xe15,Oe15]=y.useState(!1),[ze15,qe15]=y.useState("tab-hero")';
    if (code.includes(stateAnchor)) {
      const stateReplacement = ',[Xe16,Oe16]=y.useState(!1),[ze16,qe16]=y.useState("tab-hero")' + stateAnchor;
      code = code.replace(stateAnchor, stateReplacement);
      console.log("Injected Xe16 hooks in " + filePath);
    } else {
      console.error("Could not find Xe15 state anchor in " + filePath);
    }
  }

  // 5. Mount Rz16 in main App JSX
  if (!code.includes('isOpen:Xe16')) {
    const m2Pattern = 'e.jsx(Rz15,{isOpen:Xe15,onClose:()=>Oe15(!1),onShowToast:u,initialTab:ze15}),';
    if (code.includes(m2Pattern)) {
      const m2Replacement = 'e.jsx(Rz16,{isOpen:Xe16,onClose:()=>Oe16(!1),onShowToast:u,initialTab:ze16}),' + m2Pattern;
      code = code.replace(m2Pattern, m2Replacement);
      console.log("Mounted Rz16 in main App JSX for " + filePath);
    } else {
      console.error("Could not find Rz15 main JSX mount anchor in " + filePath);
    }
  }

  // 6. Mount Rz16 in Portal JSX
  if (!code.includes('activeLessonModal===16')) {
    const m3Pattern = 'activeLessonModal===15&&e.jsx(Rz15,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})';
    if (code.includes(m3Pattern)) {
      const m3Replacement = 'activeLessonModal===16&&e.jsx(Rz16,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),' + m3Pattern;
      code = code.replace(m3Pattern, m3Replacement);
      console.log("Mounted Rz16 in Portal JSX for " + filePath);
    } else {
      console.error("Could not find activeLessonModal===15 anchor in " + filePath);
    }
  }

  // 7. Click triggers for Lesson 16
  const clickPattern = 'if(ys.includes("មេរៀនទី ១៥")||ys.includes("អគ្គិសនី")){Oe15(!1);return}';
  if (code.includes(clickPattern) && !code.includes('មេរៀនទី ១៦')) {
    const clickReplacement = 'if(ys.includes("មេរៀនទី ១៦")||ys.includes("ធាតុអាកាស")){Oe16(!1);return}' + clickPattern;
    code = code.replace(clickPattern, clickReplacement);
    console.log("Injected Lesson 16 click trigger in " + filePath);
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + filePath);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Injected Lesson 16 into " + filePath + " successfully!");
  } catch (err) {
    console.error("Validation error in " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== All files successfully injected with Science Lesson 16 ===");
