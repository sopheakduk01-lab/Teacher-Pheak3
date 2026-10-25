import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Injecting Science Lesson 15 into App Bundles ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

// Read questions
const l15Questions = JSON.parse(fs.readFileSync('scripts/lesson15_questions.json', 'utf8'));
const zi15Questions = l15Questions.map(q => ({
  q: q.q || q.question,
  opts: (q.opts || q.options || []).map(o => ({
    t: o.t || o.text,
    c: o.c !== undefined ? o.c : o.isCorrect,
    e: o.e || o.explanation
  }))
}));

const zi15Code = `Zi15=${JSON.stringify(zi15Questions)},Iz15={id:"science-lesson-15-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ១៥ - អគ្គិសនី",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:25,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ១៥ ៖ អគ្គិសនី (ជំពូកទី ៥)",questions:Zi15},`;

// Read Rz15 code
let rz15Raw = fs.readFileSync('scripts/rz15_component_code.js', 'utf8').trim();
if (rz15Raw.startsWith('var Rz15 =')) {
  rz15Raw = rz15Raw.replace(/^var Rz15\s*=\s*/, '');
}
if (rz15Raw.endsWith(';')) {
  rz15Raw = rz15Raw.slice(0, -1);
}

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Inject Zi15 and Iz15
  if (!code.includes('Iz15=')) {
    const izAnchor = 'questions:Zi14},';
    const izPos = code.indexOf(izAnchor);
    if (izPos !== -1) {
      code = code.slice(0, izPos + izAnchor.length) + zi15Code + code.slice(izPos + izAnchor.length);
      console.log("Injected Zi15 & Iz15 in " + filePath);
    }
  }

  // 2. Unshift Iz15 in quiz list
  if (!code.includes('Iz15.id')) {
    const unshiftAnchor = 'at.unshift(Iz14),';
    const unshiftPos = code.indexOf(unshiftAnchor);
    if (unshiftPos !== -1) {
      const unshiftIz15 = `at.some(ys=>ys.id===Iz15.id||ys.title.includes("មេរៀនទី ១៥"))||at.unshift(Iz15),`;
      code = code.slice(0, unshiftPos) + unshiftIz15 + code.slice(unshiftPos);
      console.log("Unshifted Iz15 in " + filePath);
    }
  }

  // 3. Inject Rz15 component definition
  if (!code.includes('Rz15=({')) {
    const rz14Anchor = 'Rz14=({';
    const rz14Pos = code.indexOf(rz14Anchor);
    if (rz14Pos !== -1) {
      code = code.slice(0, rz14Pos) + "Rz15=" + rz15Raw + ",\n" + code.slice(rz14Pos);
      console.log("Injected Rz15 definition in " + filePath);
    }
  } else {
    // Replace existing Rz15 definition
    const rz15Idx = code.indexOf("Rz15=({");
    const rz14Idx = code.indexOf(",\nRz14=({", rz15Idx);
    if (rz15Idx !== -1 && rz14Idx !== -1) {
      code = code.slice(0, rz15Idx) + "Rz15=" + rz15Raw + code.slice(rz14Idx);
      console.log("Updated Rz15 definition in " + filePath);
    }
  }

  // 4. Inject Xe15 state hook in main App
  if (!code.includes('[Xe15,Oe15]')) {
    const stateAnchor = ',[Xe14,Oe14]=y.useState(!1),[ze14,qe14]=y.useState("tab-hero")';
    if (code.includes(stateAnchor)) {
      const stateReplacement = ',[Xe15,Oe15]=y.useState(!1),[ze15,qe15]=y.useState("tab-hero")' + stateAnchor;
      code = code.replace(stateAnchor, stateReplacement);
      console.log("Injected Xe15 hooks in " + filePath);
    }
  }

  // 5. Mount Rz15 in main App JSX
  if (!code.includes('isOpen:Xe15')) {
    const m2Pattern = 'e.jsx(Rz14,{isOpen:Xe14,onClose:()=>Oe14(!1),onShowToast:u,initialTab:ze14}),';
    if (code.includes(m2Pattern)) {
      const m2Replacement = 'e.jsx(Rz15,{isOpen:Xe15,onClose:()=>Oe15(!1),onShowToast:u,initialTab:ze15}),' + m2Pattern;
      code = code.replace(m2Pattern, m2Replacement);
      console.log("Mounted Rz15 in main App JSX for " + filePath);
    }
  }

  // 6. Mount Rz15 in Portal JSX
  if (!code.includes('activeLessonModal===15')) {
    const m3Pattern = 'activeLessonModal===14&&e.jsx(Rz14,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})';
    if (code.includes(m3Pattern)) {
      const m3Replacement = 'activeLessonModal===15&&e.jsx(Rz15,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),' + m3Pattern;
      code = code.replace(m3Pattern, m3Replacement);
      console.log("Mounted Rz15 in Portal JSX for " + filePath);
    }
  }

  // 7. Click triggers for Lesson 15
  // Support clicking cards containing "មេរៀនទី ១៥" or "អគ្គិសនី"
  const clickPattern = 'if(ys.includes("មេរៀនទី ១៤")||ys.includes("ម៉ាស៊ីនងាយ")){Oe14(!1);return}';
  if (code.includes(clickPattern) && !code.includes('មេរៀនទី ១៥')) {
    const clickReplacement = 'if(ys.includes("មេរៀនទី ១៥")||ys.includes("អគ្គិសនី")){Oe15(!1);return}' + clickPattern;
    code = code.replace(clickPattern, clickReplacement);
    console.log("Injected Lesson 15 click trigger in " + filePath);
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + filePath);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Injected Lesson 15 into " + filePath + " successfully!");
  } catch (err) {
    console.error("Validation error in " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== All files successfully injected with Science Lesson 15 ===");
