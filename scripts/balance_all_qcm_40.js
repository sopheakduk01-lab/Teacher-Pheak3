import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Balancing All 40-Question QCM Datasets Across the App to [10, 10, 10, 10] ===");

// All 24 permutations of [0, 1, 2, 3]
const PERMS_4 = [
  [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 2, 3, 1], [0, 3, 1, 2], [0, 3, 2, 1],
  [1, 0, 2, 3], [1, 0, 3, 2], [1, 2, 0, 3], [1, 2, 3, 0], [1, 3, 0, 2], [1, 3, 2, 0],
  [2, 0, 1, 3], [2, 0, 3, 1], [2, 1, 0, 3], [2, 1, 3, 0], [2, 3, 0, 1], [2, 3, 1, 0],
  [3, 0, 1, 2], [3, 0, 2, 1], [3, 1, 0, 2], [3, 1, 2, 0], [3, 2, 0, 1], [3, 2, 1, 0]
];

/**
 * Generates a deterministic array of `len` target answer indices (0..3)
 * with an exact [10, 10, 10, 10] distribution (for len=40) and no two consecutive identical indices.
 */
function generateBalancedTargets(len, seed = 1) {
  const targets = [];
  let prevLast = -1;
  const numBlocks = Math.ceil(len / 4);
  for (let b = 0; b < numBlocks; b++) {
    let pickIdx = (seed * 7 + b * 11 + 3) % PERMS_4.length;
    let chosen = PERMS_4[pickIdx];
    for (let attempt = 0; attempt < PERMS_4.length; attempt++) {
      const candidate = PERMS_4[(pickIdx + attempt) % PERMS_4.length];
      if (candidate[0] !== prevLast) {
        chosen = candidate;
        break;
      }
    }
    for (let k = 0; k < 4 && targets.length < len; k++) {
      targets.push(chosen[k]);
    }
    prevLast = chosen[3];
  }
  return targets;
}

/**
 * Reorders a 4-option array so that the correct option is placed at `targetIdx`
 * while preserving the relative order (rotated deterministically) of the 3 distractors.
 */
function reorderOptionsArray(opts, currentCorrectIdx, targetIdx, qIndex = 0) {
  if (!Array.isArray(opts) || opts.length !== 4) return opts;
  const correctIdx = currentCorrectIdx >= 0 && currentCorrectIdx < 4 ? currentCorrectIdx : 0;
  const correctOpt = opts[correctIdx];
  const distractors = opts.filter((_, idx) => idx !== correctIdx);
  // Rotate distractors slightly by qIndex so distractor positions also vary naturally
  const rot = qIndex % 3;
  const rotatedDistractors = [
    distractors[rot % 3],
    distractors[(rot + 1) % 3],
    distractors[(rot + 2) % 3]
  ];
  const result = [];
  let dPtr = 0;
  for (let i = 0; i < 4; i++) {
    if (i === targetIdx) {
      result.push(correctOpt);
    } else {
      result.push(rotatedDistractors[dPtr++]);
    }
  }
  return result;
}

/**
 * Helper to extract a balanced `[...]` literal from source code starting at `startIdx`.
 */
function extractBracketed(str, startIdx) {
  let depth = 0, inStr = false, strChar = '', esc = false;
  for (let i = startIdx; i < str.length; i++) {
    const ch = str[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (inStr) {
      if (ch === strChar) inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = true;
      strChar = ch;
      continue;
    }
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) return { text: str.slice(startIdx, i + 1), endIdx: i + 1 };
    }
  }
  return null;
}

// ============================================================================
// 1. Balance standalone HTML files: public/khmer-lesson-1.html & public/khmer-lesson-2.html
// ============================================================================
function balanceHtmlQcmDataset(htmlPath, distHtmlPath, seed) {
  if (!fs.existsSync(htmlPath)) return null;
  let html = fs.readFileSync(htmlPath, 'utf8');
  const marker = 'const qcmDataset = [';
  const mIdx = html.indexOf(marker);
  if (mIdx === -1) {
    console.error("Could not find qcmDataset in " + htmlPath);
    return null;
  }
  const arrStart = mIdx + 'const qcmDataset = '.length;
  const extracted = extractBracketed(html, arrStart);
  if (!extracted) {
    console.error("Could not extract qcmDataset array in " + htmlPath);
    return null;
  }

  const rawQuestions = eval('(' + extracted.text + ')');
  const targets = generateBalancedTargets(rawQuestions.length, seed);
  const dist = [0, 0, 0, 0];

  const balancedQuestions = rawQuestions.map((item, idx) => {
    const tIdx = targets[idx];
    const newOptions = reorderOptionsArray(item.options, item.ans, tIdx, idx);
    dist[tIdx]++;
    return {
      q: item.q,
      options: newOptions,
      ans: tIdx,
      exp: item.exp
    };
  });

  const formattedDataset = '[\n' + balancedQuestions.map(item => {
    return `      {\n        q: ${JSON.stringify(item.q)},\n        options: ${JSON.stringify(item.options)},\n        ans: ${item.ans},\n        exp: ${JSON.stringify(item.exp)}\n      }`;
  }).join(',\n') + '\n    ]';

  html = html.slice(0, arrStart) + formattedDataset + html.slice(extracted.endIdx);
  fs.writeFileSync(htmlPath, html, 'utf8');
  if (distHtmlPath && fs.existsSync('dist')) {
    fs.writeFileSync(distHtmlPath, html, 'utf8');
  }
  console.log(`Balanced ${htmlPath} (${balancedQuestions.length} qs) -> dist [A,B,C,D]:`, dist);
  return balancedQuestions;
}

const balancedKhmer1 = balanceHtmlQcmDataset('public/khmer-lesson-1.html', 'dist/khmer-lesson-1.html', 101);
const balancedKhmer2 = balanceHtmlQcmDataset('public/khmer-lesson-2.html', 'dist/khmer-lesson-2.html', 202);

// ============================================================================
// 2. Balance all 40-question QCM arrays in public/assets/index-BwPwHqBe.js & dist/assets/index-BwPwHqBe.js
// ============================================================================
const qcmArrayVars = [
  // 20 Grade 6 Math Lessons (40 QCM each)
  'OS', 'yL', 'jL', 'NL', 'CL', 'kL', 'BL', 'PL', 'AL', 'SL',
  'TL', 'DL', 'EL', 'OL', 'HL', 'IL', 'LL', 'RL', 'ML', 'FL',
  // 4 Grade 6 Health Education Lessons (40 QCM each)
  'zL', 'XL', 'GL', 'VL',
  // Comprehensive Health 40Q & English MoEYS 40Q
  'IS', 'Xu',
  // Khmer Grade 6 Lesson 1 & Lesson 2 (40 QCM each)
  'ZiKhmer1', 'ZiKhmer2'
];

const bundlePaths = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

for (const bundlePath of bundlePaths) {
  if (!fs.existsSync(bundlePath)) continue;
  let code = fs.readFileSync(bundlePath, 'utf8');

  qcmArrayVars.forEach((varName, vIdx) => {
    const token = varName + '=[{';
    const pos = code.indexOf(token);
    if (pos === -1) {
      console.warn(`Could not find ${varName} in ${bundlePath}`);
      return;
    }
    const arrStart = pos + varName.length + 1;
    const extracted = extractBracketed(code, arrStart);
    if (!extracted) {
      console.warn(`Could not extract bracketed array for ${varName} in ${bundlePath}`);
      return;
    }

    // Special case: for ZiKhmer1 and ZiKhmer2, sync directly with balancedKhmer1 / balancedKhmer2
    if (varName === 'ZiKhmer1' && balancedKhmer1) {
      const zi1 = balancedKhmer1.map(item => ({
        q: item.q,
        opts: item.options.map((opt, idx) => ({
          t: opt,
          c: idx === item.ans,
          e: item.exp
        }))
      }));
      code = code.slice(0, arrStart) + JSON.stringify(zi1) + code.slice(extracted.endIdx);
      console.log(`Synced balanced ${varName} in ${bundlePath}`);
      return;
    }
    if (varName === 'ZiKhmer2' && balancedKhmer2) {
      const zi2 = balancedKhmer2.map(item => ({
        q: item.q,
        opts: item.options.map((opt, idx) => ({
          t: opt,
          c: idx === item.ans,
          e: item.exp
        }))
      }));
      code = code.slice(0, arrStart) + JSON.stringify(zi2) + code.slice(extracted.endIdx);
      console.log(`Synced balanced ${varName} in ${bundlePath}`);
      return;
    }

    const arr = eval('(' + extracted.text + ')');
    const targets = generateBalancedTargets(arr.length, 300 + vIdx * 17);
    const dist = [0, 0, 0, 0];

    const newArr = arr.map((q, qIdx) => {
      const tIdx = targets[qIdx];
      if (Array.isArray(q.options) && q.options.length === 4 && typeof q.options[0] === 'object') {
        const curIdx = q.options.findIndex(o => Boolean(o.isCorrect));
        const reordered = reorderOptionsArray(q.options, curIdx, tIdx, qIdx).map((o, idx) => ({
          ...o,
          isCorrect: idx === tIdx
        }));
        dist[tIdx]++;
        return { ...q, options: reordered };
      } else if (Array.isArray(q.opts) && q.opts.length === 4 && typeof q.opts[0] === 'object') {
        const curIdx = q.opts.findIndex(o => Boolean(o.c));
        const reordered = reorderOptionsArray(q.opts, curIdx, tIdx, qIdx).map((o, idx) => ({
          ...o,
          c: idx === tIdx
        }));
        dist[tIdx]++;
        return { ...q, opts: reordered };
      }
      return q;
    });

    code = code.slice(0, arrStart) + JSON.stringify(newArr) + code.slice(extracted.endIdx);
    console.log(`Balanced ${varName.padEnd(9)} (${newArr.length} qs) in ${bundlePath} -> dist [A,B,C,D]:`, dist);
  });

  // Also update RzKhmer1 and RzKhmer2 iframe cache-buster so browser loads the newly balanced HTML files
  code = code.replace('/khmer-lesson-1.html?v=20261029_100pct', '/khmer-lesson-1.html?v=20261031_balanced');
  code = code.replace('/khmer-lesson-2.html?v=20261031_100pct', '/khmer-lesson-2.html?v=20261031_balanced');

  // Also ensure ZiKhmer1 and ZiKhmer2 are registered in buildAppSubjectCatalog under "ភាសាខ្មែរ"
  const sciAnchor = 'sciLessonsList.forEach(([id, title, arr]) => {';
  if (code.includes(sciAnchor) && !code.includes('khmer_lesson1_40q')) {
    const khmerCatalogBlock = `
    const khmerLessonsList = [
      ["khmer_lesson1_40q", "មេរៀនទី ១ ៖ ការប្រើវចនានុក្រម & កតញ្ញូប្រាំប្រការ (៤០ សំណួរ QCM)", typeof ZiKhmer1 !== "undefined" ? ZiKhmer1 : null],
      ["khmer_lesson2_40q", "មេរៀនទី ២ ៖ ក្ដីសង្ឃឹមរបស់កុមារ (៤០ សំណួរ QCM)", typeof ZiKhmer2 !== "undefined" ? ZiKhmer2 : null]
    ];
    khmerLessonsList.forEach(([id, title, arr]) => {
      if (Array.isArray(arr)) addSetToSubject("ភាសាខ្មែរ", id, title, arr);
    });
    `;
    code = code.replace(sciAnchor, khmerCatalogBlock + sciAnchor);
    console.log("Added ZiKhmer1 & ZiKhmer2 to buildAppSubjectCatalog in " + bundlePath);
  }

  // Also fix the 2-option AR camera game at 5584254 so it always includes the actual correct option and 1 wrong option
  const oldArMapping = 'const Q=re.questions.map(R=>{var J,se,le;return{text:R.question,optA:((J=R.options[0])==null?void 0:J.text)||"?",optB:((se=R.options[1])==null?void 0:se.text)||"?",correct:(le=R.options[0])!=null&&le.isCorrect?"A":"B"}}).slice(0,15);';
  const newArMapping = 'const Q=re.questions.map((R,rIdx)=>{const cOpt=(R.options||[]).find(o=>o&&o.isCorrect)||(R.options||[])[0]||{text:"?"};const wOpt=(R.options||[]).find(o=>o&&!o.isCorrect)||(R.options||[])[1]||{text:"?"};const putA=rIdx%2===0;return{text:R.question,optA:putA?cOpt.text:wOpt.text,optB:putA?wOpt.text:cOpt.text,correct:putA?"A":"B"}}).slice(0,15);';
  if (code.includes(oldArMapping)) {
    code = code.replace(oldArMapping, newArMapping);
    console.log("Updated 2-option AR game mapping in " + bundlePath);
  }

  // Validate syntax with esbuild
  try {
    esbuild.transformSync(code, { loader: 'js' });
    fs.writeFileSync(bundlePath, code, 'utf8');
    console.log("Syntax validation & save SUCCESS for " + bundlePath);
  } catch (err) {
    console.error("Syntax validation FAILED for " + bundlePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== All 40-Question QCM Sets Balanced Successfully! ===");
