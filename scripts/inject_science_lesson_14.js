import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Injecting Science Lesson 14 into App Bundles ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

// Read questions
const l14Questions = JSON.parse(fs.readFileSync('scripts/lesson14_questions.json', 'utf8'));
const zi14Questions = l14Questions.map(q => ({
  q: q.q || q.question,
  opts: (q.opts || q.options || []).map(o => ({
    t: o.t || o.text,
    c: o.c !== undefined ? o.c : o.isCorrect,
    e: o.e || o.explanation
  }))
}));

const zi14Code = `Zi14=${JSON.stringify(zi14Questions)},Iz14={id:"science-lesson-14-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ១៤ - ម៉ាស៊ីនងាយ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:25,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ១៤ ៖ ម៉ាស៊ីនងាយ (ជំពូកទី ៤)",questions:Zi14},`;

// Read Rz14 code
let rz14Raw = fs.readFileSync('scripts/rz14_component_code.js', 'utf8').trim();
if (rz14Raw.startsWith('var Rz14 =')) {
  rz14Raw = rz14Raw.replace(/^var Rz14\s*=\s*/, '');
}
if (rz14Raw.endsWith(';')) {
  rz14Raw = rz14Raw.slice(0, -1);
}

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // Check if Zi14 already injected
  if (!code.includes('Iz14=')) {
    const izAnchor = 'questions:Zi13},';
    const izPos = code.indexOf(izAnchor);
    if (izPos !== -1) {
      code = code.slice(0, izPos + izAnchor.length) + zi14Code + code.slice(izPos + izAnchor.length);
    }
  }

  // Check unshift
  if (!code.includes('Iz14.id')) {
    const unshiftAnchor = 'at.unshift(Iz13),';
    const unshiftPos = code.indexOf(unshiftAnchor);
    if (unshiftPos !== -1) {
      const unshiftIz14 = `at.some(ys=>ys.id===Iz14.id||ys.title.includes("មេរៀនទី ១៤"))||at.unshift(Iz14),`;
      code = code.slice(0, unshiftPos + unshiftAnchor.length) + unshiftIz14 + code.slice(unshiftPos + unshiftAnchor.length);
    }
  }

  // Check Rz14 component definition
  if (!code.includes('Rz14=({')) {
    const rz13Anchor = 'Rz13=({';
    const rz13Pos = code.indexOf(rz13Anchor);
    if (rz13Pos !== -1) {
      code = code.slice(0, rz13Pos) + "Rz14=" + rz14Raw + ",\n" + code.slice(rz13Pos);
    }
  } else {
    // Replace existing Rz14 definition
    const rz14Idx = code.indexOf("Rz14=({");
    const rz13Idx = code.indexOf(",\nRz13=({", rz14Idx);
    if (rz14Idx !== -1 && rz13Idx !== -1) {
      code = code.slice(0, rz14Idx) + "Rz14=" + rz14Raw + code.slice(rz13Idx);
    }
  }

  // Check Xe14 state hook
  if (!code.includes('[Xe14,Oe14]')) {
    const stateAnchor = '[ze13,qe13]=y.useState("tab-hero");';
    const statePos = code.indexOf(stateAnchor);
    if (statePos !== -1) {
      const stateCode = `,[Xe14,Oe14]=y.useState(!1),[ze14,qe14]=y.useState("tab-hero")`;
      code = code.slice(0, statePos + stateAnchor.length - 1) + stateCode + code.slice(statePos + stateAnchor.length - 1);
    }
  }

  // Check JSX mount <Rz14 ... />
  if (!code.includes('isOpen:Xe14')) {
    const jsxAnchor = 'isOpen:Xe13,onClose:()=>Oe13(!1),onShowToast:s,initialTab:ze13';
    const jsxPos = code.indexOf(jsxAnchor);
    if (jsxPos !== -1) {
      const rz13FullPattern = `e.jsx(Rz13,{isOpen:Xe13,onClose:()=>Oe13(!1),onShowToast:s,initialTab:ze13}),`;
      const rz14Jsx = `e.jsx(Rz14,{isOpen:Xe14,onClose:()=>Oe14(!1),onShowToast:s,initialTab:ze14}),`;
      const pIdx = code.indexOf(rz13FullPattern);
      if (pIdx !== -1) {
        code = code.slice(0, pIdx) + rz14Jsx + code.slice(pIdx);
      }
    }
  }

  // Check trigger handler for science lesson 14
  if (!code.includes('មេរៀនទី ១៤')) {
    // Add click trigger for lesson 14
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + filePath);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Injected Lesson 14 into " + filePath + " successfully!");
  } catch (err) {
    console.error("Validation error in " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== All files successfully injected with Science Lesson 14 ===");
