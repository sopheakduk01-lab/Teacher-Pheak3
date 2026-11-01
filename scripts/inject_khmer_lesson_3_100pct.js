import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Building 100% Complete Khmer Grade 6 Lesson 3 Interactive Module ===");

// 1. Read the user's exact pasted HTML file for Lesson 3 (1,553 lines, 133,414 bytes)
const pastedPath = 'public/assets/aistudio/Paste_November_01__2026_-_3_51PM_c8a1c5cf';
let rawHtml = fs.readFileSync(pastedPath, 'utf8');

// 2. Add Khmer Speech Synthesis polyfill (/api/tts + fallback) so toggleSpeechCurrentTab() works on all devices
const khmerSpeechPolyfill = `
  <script>
    (function() {
      var currentAudio = null;
      var cancelPlayback = false;

      var splitKhmerChunks = function(text, maxLen) {
        if (!text) return [];
        maxLen = maxLen || 140;
        text = text.replace(/[\\u200B-\\u200D\\uFEFF]/g, '').replace(/\\s+/g, ' ').trim();
        var segments = text.split(/([។\\n!?]+)/);
        var sentences = [];
        for (var i = 0; i < segments.length; i += 2) {
          var s = (segments[i] || '') + (segments[i + 1] || '');
          s = s.trim();
          if (s) sentences.push(s);
        }
        if (sentences.length === 0 && text.trim()) {
          sentences = [text.trim()];
        }
        var chunks = [];
        for (var j = 0; j < sentences.length; j++) {
          var sent = sentences[j];
          if (sent.length <= maxLen) {
            chunks.push(sent);
          } else {
            var words = sent.split(/\\s+/);
            var cur = "";
            for (var k = 0; k < words.length; k++) {
              var w = words[k];
              if ((cur + " " + w).length <= maxLen) {
                cur = cur ? (cur + " " + w) : w;
              } else {
                if (cur) chunks.push(cur);
                if (w.length > maxLen) {
                  for (var m = 0; m < w.length; m += maxLen) {
                    chunks.push(w.slice(m, m + maxLen));
                  }
                  cur = "";
                } else {
                  cur = w;
                }
              }
            }
            if (cur) chunks.push(cur);
          }
        }
        return chunks;
      };

      window.stopKhmerLessonAudio = function() {
        cancelPlayback = true;
        if (currentAudio) {
          try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
          } catch (e) {}
          currentAudio = null;
        }
      };

      window.playKhmerLessonSpeech = function(text, onStart, onEnd, onError) {
        window.stopKhmerLessonAudio();
        cancelPlayback = false;
        if (!text || !text.trim()) {
          if (onEnd) onEnd();
          return;
        }
        var chunks = splitKhmerChunks(text, 140);
        if (!chunks.length) {
          if (onEnd) onEnd();
          return;
        }
        if (onStart) onStart();
        var index = 0;
        function playNext() {
          if (cancelPlayback || index >= chunks.length) {
            currentAudio = null;
            if (onEnd) onEnd();
            return;
          }
          var chunk = chunks[index++];
          var primaryUrl = "/api/tts?text=" + encodeURIComponent(chunk);
          var fallbackUrl = "https://translate.google.com/translate_tts?ie=UTF-8&tl=km&client=tw-ob&q=" + encodeURIComponent(chunk);
          var audio = new Audio();
          currentAudio = audio;
          var handled = false;
          var nextStep = function() {
            if (handled) return;
            handled = true;
            if (currentAudio === audio) currentAudio = null;
            playNext();
          };
          audio.onended = nextStep;
          audio.onerror = function() {
            if (cancelPlayback) { nextStep(); return; }
            var fbAudio = new Audio(fallbackUrl);
            currentAudio = fbAudio;
            fbAudio.onended = nextStep;
            fbAudio.onerror = nextStep;
            fbAudio.play().catch(nextStep);
          };
          audio.src = primaryUrl;
          audio.play().catch(function() {
            if (cancelPlayback) { nextStep(); return; }
            var fbAudio = new Audio(fallbackUrl);
            currentAudio = fbAudio;
            fbAudio.onended = nextStep;
            fbAudio.onerror = function(err) {
              if (onError) onError(err);
              nextStep();
            };
            fbAudio.play().catch(nextStep);
          });
        }
        playNext();
      };
    })();
  </script>
`;

rawHtml = rawHtml.replace('</head>', khmerSpeechPolyfill + '\n</head>');

// 3. Add Close button right next to Theme Toggle in the header so user can close modal directly
const darkModeBtnBlock = `        <button onclick="toggleDarkMode()" class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-400 flex items-center justify-center transition">
          <i class="fa-solid fa-moon dark:hidden text-sm"></i>
          <i class="fa-solid fa-sun hidden dark:inline text-sm"></i>
        </button>`;

const closeBtnAddition = darkModeBtnBlock + `

        <!-- Close Lesson Modal Button -->
        <button id="closeModalBtn" onclick="closeKhmerLesson3Modal()" class="w-9 h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-sm cursor-pointer" title="បិទមេរៀន">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>`;

if (rawHtml.includes(darkModeBtnBlock)) {
  rawHtml = rawHtml.replace(darkModeBtnBlock, closeBtnAddition);
  console.log("Added Close Modal button to Lesson 3 header.");
}

// 4. Upgrade toggleSpeechCurrentTab() to use window.playKhmerLessonSpeech
const oldTtsBlock = `    let isSpeaking = false;
    function toggleSpeechCurrentTab() {
      if (!('speechSynthesis' in window)) return;
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
        return;
      }
      const panel = document.getElementById(currentTabId);
      if (!panel) return;
      const text = panel.innerText.slice(0, 500);

      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'km-KH';
      u.rate = 0.9;
      u.onend = () => { isSpeaking = false; document.getElementById('ttsBtnText').innerText = "អានសំឡេង"; };
      u.onerror = () => { isSpeaking = false; document.getElementById('ttsBtnText').innerText = "អានសំឡេង"; };

      window.speechSynthesis.speak(u);
      isSpeaking = true;
      document.getElementById('ttsBtnText').innerText = "បញ្ឈប់";
    }`;

const newTtsBlock = `    let isSpeaking = false;
    function closeKhmerLesson3Modal() {
      if (window.stopKhmerLessonAudio) window.stopKhmerLessonAudio();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'CLOSE_KHMER_LESSON_3' }, '*');
      }
    }

    function toggleSpeechCurrentTab() {
      if (isSpeaking) {
        if (window.stopKhmerLessonAudio) window.stopKhmerLessonAudio();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        isSpeaking = false;
        document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
        return;
      }
      const panel = document.getElementById(currentTabId);
      if (!panel) return;
      const text = panel.innerText.slice(0, 900);

      if (window.playKhmerLessonSpeech) {
        isSpeaking = true;
        document.getElementById('ttsBtnText').innerText = "បញ្ឈប់";
        window.playKhmerLessonSpeech(
          text,
          () => {
            isSpeaking = true;
            document.getElementById('ttsBtnText').innerText = "បញ្ឈប់";
          },
          () => {
            isSpeaking = false;
            document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
          },
          () => {
            isSpeaking = false;
            document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
          }
        );
        return;
      }

      if (!('speechSynthesis' in window)) return;
      const u = new SpeechSynthesisUtterance(text.slice(0, 500));
      u.lang = 'km-KH';
      u.rate = 0.9;
      u.onend = () => { isSpeaking = false; document.getElementById('ttsBtnText').innerText = "អានសំឡេង"; };
      u.onerror = () => { isSpeaking = false; document.getElementById('ttsBtnText').innerText = "អានសំឡេង"; };

      window.speechSynthesis.speak(u);
      isSpeaking = true;
      document.getElementById('ttsBtnText').innerText = "បញ្ឈប់";
    }`;

if (rawHtml.includes(oldTtsBlock)) {
  rawHtml = rawHtml.replace(oldTtsBlock, newTtsBlock);
  console.log("Upgraded Lesson 3 toggleSpeechCurrentTab with real Khmer TTS audio.");
}

// 5. Support ?tab=tab-qcm on DOMContentLoaded
const oldDomLoaded = `    window.addEventListener('DOMContentLoaded', () => {
      initQcmSystem();
    });`;

const newDomLoaded = `    window.addEventListener('DOMContentLoaded', () => {
      initQcmSystem();
      try {
        const params = new URLSearchParams(window.location.search);
        const initTab = params.get('tab');
        if (initTab && document.getElementById(initTab)) {
          switchTab(initTab);
        }
        const stuName = params.get('student');
        if (stuName && document.getElementById('studentNameInput')) {
          document.getElementById('studentNameInput').value = stuName;
        }
      } catch (e) {}
    });`;

if (rawHtml.includes(oldDomLoaded)) {
  rawHtml = rawHtml.replace(oldDomLoaded, newDomLoaded);
  console.log("Added URL parameter ?tab= support on Lesson 3 DOMContentLoaded.");
}

// 6. Balance the 40-question qcmDataset in Lesson 3 to exact [10, 10, 10, 10] with no consecutive duplicate answers
const PERMS_4 = [
  [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 2, 3, 1], [0, 3, 1, 2], [0, 3, 2, 1],
  [1, 0, 2, 3], [1, 0, 3, 2], [1, 2, 0, 3], [1, 2, 3, 0], [1, 3, 0, 2], [1, 3, 2, 0],
  [2, 0, 1, 3], [2, 0, 3, 1], [2, 1, 0, 3], [2, 1, 3, 0], [2, 3, 0, 1], [2, 3, 1, 0],
  [3, 0, 1, 2], [3, 0, 2, 1], [3, 1, 0, 2], [3, 1, 2, 0], [3, 2, 0, 1], [3, 2, 1, 0]
];

function generateBalancedTargets(len, seed = 303) {
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

function reorderOptionsArray(opts, currentCorrectIdx, targetIdx, qIndex = 0) {
  if (!Array.isArray(opts) || opts.length !== 4) return opts;
  const correctIdx = currentCorrectIdx >= 0 && currentCorrectIdx < 4 ? currentCorrectIdx : 0;
  const correctOpt = opts[correctIdx];
  const distractors = opts.filter((_, idx) => idx !== correctIdx);
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

const dsMarker = 'const qcmDataset = [';
const dsIdx = rawHtml.indexOf(dsMarker);
let balancedKhmer3 = [];
if (dsIdx !== -1) {
  const arrStart = dsIdx + 'const qcmDataset = '.length;
  const extracted = extractBracketed(rawHtml, arrStart);
  if (extracted) {
    const rawQuestions = eval('(' + extracted.text + ')');
    const targets = generateBalancedTargets(rawQuestions.length, 303);
    const dist = [0, 0, 0, 0];
    balancedKhmer3 = rawQuestions.map((item, idx) => {
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
    const formattedDataset = '[\n' + balancedKhmer3.map(item => {
      return `      {\n        q: ${JSON.stringify(item.q)},\n        options: ${JSON.stringify(item.options)},\n        ans: ${item.ans},\n        exp: ${JSON.stringify(item.exp)}\n      }`;
    }).join(',\n') + '\n    ]';
    rawHtml = rawHtml.slice(0, arrStart) + formattedDataset + rawHtml.slice(extracted.endIdx);
    console.log("Balanced Lesson 3 qcmDataset (40 qs) -> dist [A,B,C,D]:", dist);
  }
}

// Write public/khmer-lesson-3.html and dist/khmer-lesson-3.html
fs.writeFileSync('public/khmer-lesson-3.html', rawHtml, 'utf8');
if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/khmer-lesson-3.html', rawHtml, 'utf8');
}
console.log("Saved public/khmer-lesson-3.html (" + rawHtml.length + " bytes).");

// 7. Build ZiKhmer3 & IzKhmer3
const qcmQuestions3 = balancedKhmer3.map(item => ({
  q: item.q,
  opts: item.options.map((opt, idx) => ({
    t: opt,
    c: idx === item.ans,
    e: item.exp
  }))
}));

const ziKhmer3Code = `ZiKhmer3=${JSON.stringify(qcmQuestions3)},IzKhmer3={id:"khmer-lesson-3-quiz",title:"ភាសាខ្មែរ ថ្នាក់ទី៦ | មេរៀនទី ៣ ៖ ធនធានរ៉ែនៅប្រទេសកម្ពុជា (៤០ សំណួរ QCM)",subject:"ភាសាខ្មែរ",grade:"ថ្នាក់ទី ៦",questionCount:40,questionsCount:40,durationMinutes:25,passingScore:70,isPublic:!0,imageUrl:"https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600",description:"តេស្តពហុជ្រើសរើស QCM ៤០ សំណួរ (Step-by-Step) វាស់ស្ទង់សមត្ថភាពមេរៀនទី៣ ធនធានរ៉ែនៅប្រទេសកម្ពុជា (ទំព័រ ៣៣-៤៦) ព្រមទាំងមានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សា",questions:ZiKhmer3},`;

// 8. Build RzKhmer3 modal component that renders 100% of /khmer-lesson-3.html
const rzKhmer3Def = `RzKhmer3=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-intro"})=>{
  if(!r)return null;
  y.useEffect(()=>{
    document.body.classList.add("qcm-open","answering-exam");
    const onMsg = (ev) => {
      if (ev && ev.data && ev.data.type === "CLOSE_KHMER_LESSON_3") {
        t && t();
      }
    };
    window.addEventListener("message", onMsg);
    return () => {
      document.body.classList.remove("qcm-open","answering-exam");
      window.removeEventListener("message", onMsg);
      if (window.stopKhmerAudio) window.stopKhmerAudio();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  },[t]);
  const targetTab = (a==="tab-quiz"||a==="quiz"||a==="tab-qcm") ? "tab-qcm" : "tab-intro";
  const iframeSrc = "/khmer-lesson-3.html?v=20261101_100pct&tab=" + encodeURIComponent(targetTab);
  return e.jsx("div",{
    "data-modal-open":"true",
    className:"fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col overflow-hidden animate-fadeIn",
    children:e.jsx("iframe",{
      src:iframeSrc,
      title:"ភាសាខ្មែរ ថ្នាក់ទី៦ មេរៀនទី៣ | ធនធានរ៉ែនៅប្រទេសកម្ពុជា (ទំព័រ ៣៣-៤៦)",
      className:"w-full h-full border-0 flex-1 bg-slate-50 dark:bg-slate-950",
      allow:"autoplay"
    })
  });
}`;

// 9. Build the Khmer Lesson 3 card for InteractiveSharedSection
const khmerLesson3CardJSX = `(H==="all"||H==="ភាសាខ្មែរ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border-2 border-amber-500/90 overflow-hidden shadow-md hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-2 ring-amber-400/40",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-amber-900 via-yellow-800 to-stone-900",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600",alt:"ភាសាខ្មែរ ថ្នាក់ទី៦ មេរៀនទី៣",className:"absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 opacity-75"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-slate-950/95 via-amber-950/50 to-transparent"}),e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"💎"}),e.jsx("span",{className:"text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"ភាសាខ្មែរ ថ្នាក់ទី ៦"})]}),e.jsx("span",{className:"absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs",children:"មេរៀនទី ៣ • 100%"}),e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ៣ ៖ ធនធានរ៉ែនៅប្រទេសកម្ពុជា"}),e.jsx("p",{className:"text-[10px] text-amber-200 mt-0.5 font-medium drop-shadow-sm",children:"ទំព័រ ៣៣ ដល់ ៤៦ • កម្មវិធីសិក្សាអន្តរកម្មពេញលេញ ៨ ផ្នែក"})]})]}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"១.សេចក្តីផ្តើម (ទ.៣៣) • ២.ថ្មកំបោរ & កត់ត្រា • ៣.តារាងរ៉ែក្នុងដី • ៤.ត្បូងស្វាយ • ៥.គុណនាមចង្អុល • ៦.រ៉ែប្រេងកាត • ៧.ដែក & រ៉ែមាស • ៨.QCM ៤០ សំណួរ"}),e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-100",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Jr,{className:"w-2.5 h-2.5 text-amber-600"})," ៨ ផ្នែកពេញលេញ"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Za,{className:"w-2.5 h-2.5 text-amber-700"})," លំហាត់អន្តរកម្ម & វេយ្យាករណ៍"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1 text-emerald-800",children:[e.jsx(Ns,{className:"w-2.5 h-2.5 text-emerald-600"})," ៤០ QCM & វិញ្ញាបនបត្រ"]})]})]})]}),e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[e.jsxs("button",{onClick:()=>{Ut||(qeKhmer3("tab-intro"),OeKhmer3(!0));},className:"w-full py-2.5 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-700 hover:to-yellow-700 text-white font-bold rounded-xl text-[11px] transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📚"}),e.jsx("span",{children:"រៀនអន្តរកម្ម"})]}),e.jsxs("button",{onClick:()=>{Ut||(qeKhmer3("tab-qcm"),OeKhmer3(!0));},className:"w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-700 hover:from-emerald-700 hover:to-amber-800 text-white font-bold rounded-xl text-[11px] transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"🏆"}),e.jsx("span",{children:"តេស្ត QCM ៤០"})]})]})]}),`;

// 10. Patch bundle files
const bundleFiles = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

for (const filePath of bundleFiles) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // A. Inject ZiKhmer3 & IzKhmer3 right after IzKhmer2
  if (!code.includes('IzKhmer3=')) {
    const anchor = 'questions:ZiKhmer2},';
    const pos = code.indexOf(anchor);
    if (pos !== -1) {
      code = code.slice(0, pos + anchor.length) + ziKhmer3Code + code.slice(pos + anchor.length);
      console.log("Injected ZiKhmer3 & IzKhmer3 in " + filePath);
    } else {
      console.error("Could not find ZiKhmer2 anchor in " + filePath);
    }
  }

  // B. Unshift IzKhmer3 into quiz list in lCe
  if (!code.includes('IzKhmer3.id')) {
    const unshiftAnchor = 'at.some(ys=>ys.id===IzKhmer2.id)||at.unshift(IzKhmer2),';
    const pos = code.indexOf(unshiftAnchor);
    if (pos !== -1) {
      const unshiftCode = `at.some(ys=>ys.id===IzKhmer3.id)||at.unshift(IzKhmer3),`;
      code = code.slice(0, pos + unshiftAnchor.length) + unshiftCode + code.slice(pos + unshiftAnchor.length);
      console.log("Unshifted IzKhmer3 into quiz list in " + filePath);
    }
  }

  // C. Inject RzKhmer3 component definition right before RzKhmer2=({
  if (!code.includes('RzKhmer3=({')) {
    const rzAnchor = 'RzKhmer2=({';
    const pos = code.indexOf(rzAnchor);
    if (pos !== -1) {
      code = code.slice(0, pos) + rzKhmer3Def + ",\n" + code.slice(pos);
      console.log("Injected RzKhmer3 definition in " + filePath);
    }
  } else {
    const startIdx = code.indexOf('RzKhmer3=({');
    const endIdx = code.indexOf(',\nRzKhmer2=({', startIdx);
    if (startIdx !== -1 && endIdx !== -1) {
      code = code.slice(0, startIdx) + rzKhmer3Def + code.slice(endIdx);
      console.log("Updated RzKhmer3 definition in " + filePath);
    }
  }

  // D. Inject [XeKhmer3,OeKhmer3] state hooks in InteractiveSharedSection
  if (!code.includes('[XeKhmer3,OeKhmer3]')) {
    const stateAnchor = '[XeKhmer2,OeKhmer2]=y.useState(!1),[zeKhmer2,qeKhmer2]=y.useState("tab-rights"),';
    if (code.includes(stateAnchor)) {
      code = code.replace(
        stateAnchor,
        stateAnchor + '[XeKhmer3,OeKhmer3]=y.useState(!1),[zeKhmer3,qeKhmer3]=y.useState("tab-intro"),'
      );
      console.log("Injected XeKhmer3 state hooks in InteractiveSharedSection for " + filePath);
    }
  }

  // E. Inject Khmer Lesson 3 card right after Khmer Lesson 2 card in InteractiveSharedSection
  if (!code.includes('qeKhmer3("tab-intro")')) {
    const card2EndAnchor = 'e.jsxs("button",{onClick:()=>{Ut||(qeKhmer2("tab-qcm"),OeKhmer2(!0));},className:"w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-700 hover:to-indigo-800 text-white font-bold rounded-xl text-[11px] transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"🏆"}),e.jsx("span",{children:"តេស្ត QCM ៤០"})]})]})]}),';
    const pos = code.indexOf(card2EndAnchor);
    if (pos !== -1) {
      code = code.slice(0, pos + card2EndAnchor.length) + khmerLesson3CardJSX + code.slice(pos + card2EndAnchor.length);
      console.log("Injected Khmer Lesson 3 card right after Khmer Lesson 2 card in " + filePath);
    } else {
      console.error("Could not find card2EndAnchor in " + filePath);
    }
  }

  // F. Mount RzKhmer3 in InteractiveSharedSection modal list
  if (!code.includes('e.jsx(RzKhmer3,{isOpen:XeKhmer3')) {
    const mountAnchor = 'e.jsx(RzKhmer2,{isOpen:XeKhmer2,onClose:()=>OeKhmer2(!1),onShowToast:u,initialTab:zeKhmer2}),';
    if (code.includes(mountAnchor)) {
      code = code.replace(
        mountAnchor,
        mountAnchor + 'e.jsx(RzKhmer3,{isOpen:XeKhmer3,onClose:()=>OeKhmer3(!1),onShowToast:u,initialTab:zeKhmer3}),'
      );
      console.log("Mounted RzKhmer3 in InteractiveSharedSection for " + filePath);
    }
  }

  // G. Handle IzKhmer3 exam click in E==="exams" inside InteractiveSharedSection
  if (!code.includes('Pt.id==="khmer-lesson-3-quiz"')) {
    const examClickAnchor = 'else if(Pt.id==="khmer-lesson-2-quiz"){qeKhmer2("tab-qcm");OeKhmer2(!0);}';
    if (code.includes(examClickAnchor)) {
      code = code.replace(
        examClickAnchor,
        examClickAnchor + 'else if(Pt.id==="khmer-lesson-3-quiz"){qeKhmer3("tab-qcm");OeKhmer3(!0);}'
      );
      console.log("Added IzKhmer3 exam click handler in " + filePath);
    }
  }

  // H. Also mount RzKhmer3 in Student Portal activeLessonModal
  if (!code.includes('activeLessonModal==="khmer3"')) {
    const portalMountAnchor = 'activeLessonModal==="khmer2"&&e.jsx(RzKhmer2,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),';
    if (code.includes(portalMountAnchor)) {
      code = code.replace(
        portalMountAnchor,
        portalMountAnchor + 'activeLessonModal==="khmer3"&&e.jsx(RzKhmer3,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),'
      );
      console.log("Mounted RzKhmer3 in Student Portal for " + filePath);
    }
  }

  // I. Register ZiKhmer3 in buildAppSubjectCatalog under "ភាសាខ្មែរ"
  if (!code.includes('khmer_lesson3_40q')) {
    const khmer2CatalogAnchor = '["khmer_lesson2_40q", "មេរៀនទី ២ ៖ ក្ដីសង្ឃឹមរបស់កុមារ (៤០ សំណួរ QCM)", typeof ZiKhmer2 !== "undefined" ? ZiKhmer2 : null]';
    if (code.includes(khmer2CatalogAnchor)) {
      code = code.replace(
        khmer2CatalogAnchor,
        khmer2CatalogAnchor + ',\n      ["khmer_lesson3_40q", "មេរៀនទី ៣ ៖ ធនធានរ៉ែនៅប្រទេសកម្ពុជា (៤០ សំណួរ QCM)", typeof ZiKhmer3 !== "undefined" ? ZiKhmer3 : null]'
      );
      console.log("Registered khmer_lesson3_40q in buildAppSubjectCatalog for " + filePath);
    }
  }

  // J. Validate with esbuild
  try {
    esbuild.transformSync(code, { loader: 'js' });
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Validation & Save SUCCESS for " + filePath);
  } catch (err) {
    console.error("Syntax validation failed for " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== Completed 100% Khmer Grade 6 Lesson 3 Injection! ===");
