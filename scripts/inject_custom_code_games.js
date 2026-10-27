import fs from "node:fs";
import esbuild from "esbuild";
import vm from "node:vm";

const filePath = "public/assets/index-BwPwHqBe.js";
const distPath = "dist/assets/index-BwPwHqBe.js";
const bakPath = "public/assets/index-BwPwHqBe.js.original_bak";

let code = fs.readFileSync(filePath, "utf8");
const bak = fs.readFileSync(bakPath, "utf8");

console.log("Initial bundle size:", code.length);

// 0. Ensure 100% idempotency: strip any previous injection in `code` before re-injecting
const prevDefStart = code.indexOf(",GAME_SUBJECT_OPTIONS=[") !== -1
  ? code.indexOf(",GAME_SUBJECT_OPTIONS=[")
  : code.indexOf(",DEFAULT_MATH_BATTLE_GAME=");
const prevKzInjected = code.indexOf(",Kz=[DEFAULT_MATH_BATTLE_GAME,{id:\"camera_quiz\"");
if (prevDefStart !== -1 && prevKzInjected !== -1 && prevKzInjected > prevDefStart) {
  code = code.slice(0, prevDefStart) + ",Kz=[{id:\"camera_quiz\"" + code.slice(prevKzInjected + ",Kz=[DEFAULT_MATH_BATTLE_GAME,{id:\"camera_quiz\"".length);
  console.log("Stripped previous DEFAULT_MATH_BATTLE_GAME & CodeGameModalsHost definition.");
}

// Revert previous InteractiveSharedSection & Student Hub replacements if present
const prevReplacementsToRevert = [
  [
    `const[H,O]=y.useState("all");const customKzGames=useCustomCodeGames();const allKzGames=y.useMemo(()=>[DEFAULT_MATH_BATTLE_GAME,ADD_CODE_GAME_CARD,...customKzGames,...Kz.filter(g=>g.id!=="math_battle_quest_abyss"&&g.id!=="add_custom_code_game_card")],[customKzGames]);`,
    `const[H,O]=y.useState("all");`
  ],
  [
    `const[H,O]=y.useState("all");const customKzGames=useCustomCodeGames();const allKzGames=y.useMemo(()=>[DEFAULT_MATH_BATTLE_GAME,...customKzGames,...Kz.filter(g=>g.id!=="math_battle_quest_abyss")],[customKzGames]);`,
    `const[H,O]=y.useState("all");`
  ],
  [
    `children:allKzGames.length`,
    `children:Kz.length`
  ],
  [
    `e.jsxs("div",{className:"flex items-center gap-1.5 self-end sm:self-auto",children:[E==="games"&&e.jsxs("button",{type:"button",onClick:()=>window.openAddCodeGameModal&&window.openAddCodeGameModal(),className:"px-3 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer transition active:scale-95 shrink-0",children:[e.jsx("span",{children:"➕"}),e.jsx("span",{children:"បញ្ចូលកូដល្បែងសិក្សា"})]}),e.jsx("button",{onClick:()=>hr("left")`,
    `e.jsxs("div",{className:"flex items-center gap-1.5 self-end sm:self-auto",children:[e.jsx("button",{onClick:()=>hr("left")`
  ],
  [
    `const at=allKzGames.filter(Pt=>H==="all"||Pt.id==="add_custom_code_game_card"||Pt.isMultiSubject||Pt.subjectKey==="all"||Pt.subject==="គ្រប់មុខវិជ្ជា"?!0:Pt.subjectKey===H||Pt.subject===H||Pt.khmerSubject===H);`,
    `const at=Kz.filter(Pt=>H==="all"?!0:Pt.subjectKey===H||Pt.subject===H);`
  ],
  [
    `const at=allKzGames.filter(Pt=>H==="all"||Pt.id==="add_custom_code_game_card"?!0:Pt.subjectKey===H||Pt.subject===H);`,
    `const at=Kz.filter(Pt=>H==="all"?!0:Pt.subjectKey===H||Pt.subject===H);`
  ],
  [
    `const at=allKzGames.filter(Pt=>H==="all"?!0:Pt.subjectKey===H||Pt.subject===H);`,
    `const at=Kz.filter(Pt=>H==="all"?!0:Pt.subjectKey===H||Pt.subject===H);`
  ],
  [
    `onClick:()=>{Ut||(Pt.actionType==="modal_add_code_game"?window.openAddCodeGameModal&&window.openAddCodeGameModal():Pt.actionType==="modal_code_game"||Pt.isCustom?window.playCodeGame&&window.playCodeGame(Pt,H):Pt.actionType==="modal_fishing"?De(!0):Pt.actionType==="modal_vijjanava"?be(!0):Pt.actionType==="modal_english"?Et(!0):Pt.actionType==="modal_camera"?or(!0):be(!0))}`,
    `onClick:()=>{Ut||(Pt.actionType==="modal_fishing"?De(!0):Pt.actionType==="modal_vijjanava"?be(!0):Pt.actionType==="modal_english"?Et(!0):Pt.actionType==="modal_camera"?or(!0):be(!0))}`
  ],
  [
    `onClick:()=>{Ut||(Pt.actionType==="modal_add_code_game"?window.openAddCodeGameModal&&window.openAddCodeGameModal():Pt.actionType==="modal_code_game"||Pt.isCustom?window.playCodeGame&&window.playCodeGame(Pt):Pt.actionType==="modal_fishing"?De(!0):Pt.actionType==="modal_vijjanava"?be(!0):Pt.actionType==="modal_english"?Et(!0):Pt.actionType==="modal_camera"?or(!0):be(!0))}`,
    `onClick:()=>{Ut||(Pt.actionType==="modal_fishing"?De(!0):Pt.actionType==="modal_vijjanava"?be(!0):Pt.actionType==="modal_english"?Et(!0):Pt.actionType==="modal_camera"?or(!0):be(!0))}`
  ],
  [
    `onClick:()=>{Ut||(Pt.actionType==="modal_code_game"||Pt.isCustom?window.playCodeGame&&window.playCodeGame(Pt):Pt.actionType==="modal_fishing"?De(!0):Pt.actionType==="modal_vijjanava"?be(!0):Pt.actionType==="modal_english"?Et(!0):Pt.actionType==="modal_camera"?or(!0):be(!0))}`,
    `onClick:()=>{Ut||(Pt.actionType==="modal_fishing"?De(!0):Pt.actionType==="modal_vijjanava"?be(!0):Pt.actionType==="modal_english"?Et(!0):Pt.actionType==="modal_camera"?or(!0):be(!0))}`
  ],
  [
    `e.jsxs("div",{className:"flex items-center gap-1",children:[Pt.isCustom&&e.jsx("button",{type:"button",onClick:ev=>{ev.stopPropagation();window.openAddCodeGameModal&&window.openAddCodeGameModal(Pt)},className:"w-6 h-6 rounded-full bg-white/25 hover:bg-amber-400 hover:text-slate-950 backdrop-blur-md text-white flex items-center justify-center text-[11px] cursor-pointer transition",title:"កែប្រែកូដ",children:"✏️"}),Pt.isCustom&&e.jsx("button",{type:"button",onClick:ev=>{ev.stopPropagation();window.deleteCustomCodeGame&&window.deleteCustomCodeGame(Pt.id,ev)},className:"w-6 h-6 rounded-full bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md text-white flex items-center justify-center text-[11px] cursor-pointer transition",title:"លុបល្បែង",children:"🗑️"}),e.jsx("span",{className:"text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-white border border-white/20",children:Pt.grade})]})`,
    `e.jsx("span",{className:"text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-white border border-white/20",children:Pt.grade})`
  ],
  [
    `vt&&e.jsx(iCe,{isOpen:vt,onClose:()=>or(!1),studentName:r.name||"សិស្សឆ្នើម",initialQuizzes:he}),e.jsx(CodeGameModalsHost,{onShowToast:u,appQuizzes:he})`,
    `vt&&e.jsx(iCe,{isOpen:vt,onClose:()=>or(!1),studentName:r.name||"សិស្សឆ្នើម",initialQuizzes:he})`
  ],
  [
    `vt&&e.jsx(iCe,{isOpen:vt,onClose:()=>or(!1),studentName:r.name||"សិស្សឆ្នើម",initialQuizzes:he}),e.jsx(CodeGameModalsHost,{onShowToast:u})`,
    `vt&&e.jsx(iCe,{isOpen:vt,onClose:()=>or(!1),studentName:r.name||"សិស្សឆ្នើម",initialQuizzes:he})`
  ],
  [
    `e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg font-bold text-slate-900 font-moul",children:"ល្បែងសិក្សាអន្តរកម្ម (Educational Games Hub)"}),e.jsx("p",{className:"text-xs text-slate-500",children:"លេងល្បែងកម្សាន្តអប់រំ និងពង្រឹងចំណេះដឹងតាមបែបសប្បាយ"})]}),e.jsxs("button",{type:"button",onClick:()=>window.openAddCodeGameModal&&window.openAddCodeGameModal(),className:"px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-black rounded-2xl text-xs shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95 self-start sm:self-auto",children:[e.jsx("span",{children:"➕"}),e.jsx("span",{children:"បញ្ចូលកូដល្បែងសិក្សា"})]})]})`,
    `e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg font-bold text-slate-900 font-moul",children:"ល្បែងសិក្សាអន្តរកម្ម (Educational Games Hub)"}),e.jsx("p",{className:"text-xs text-slate-500",children:"លេងល្បែងកម្សាន្តអប់រំ និងពង្រឹងចំណេះដឹងតាមបែបសប្បាយ"})]})`
  ],
  [
    `e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs(sr.div,{whileHover:{y:-4},className:"bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner",children:"🏹"}),e.jsx("h3",{className:"text-base font-bold font-moul text-amber-100",children:"សមរភូមិព្រួញគណិតវិទ្យា"}),e.jsx("p",{className:"text-xs text-amber-50 leading-relaxed",children:"ជ្រើសរើសវីរបុរសបាញ់ព្រួញទាំង ៥ ប្រើជំនាញពិសេសឆ្លើយចំណោទគណិតវិទ្យាការពារសង្វៀនជ្រោះជ្រៅ!"})]}),e.jsx("button",{onClick:()=>{window.playCodeGame&&window.playCodeGame(DEFAULT_MATH_BATTLE_GAME)},className:"w-full py-3 bg-white text-rose-950 rounded-2xl font-black text-xs hover:bg-amber-300 hover:text-slate-950 transition shadow-sm cursor-pointer",children:"🏹 ចូលសមរភូមិប្រយុទ្ធ"})]}),e.jsxs(sr.div,{whileHover:{y:-4},className:"bg-gradient-to-br from-sky-500 to-blue-700`,
    `e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs(sr.div,{whileHover:{y:-4},className:"bg-gradient-to-br from-sky-500 to-blue-700`
  ]
];

for (const [prev, orig] of prevReplacementsToRevert) {
  if (code.includes(prev)) {
    code = code.replaceAll(prev, orig);
  }
}

// 1. Restore clean `poe` from original_bak so there are no duplicate declarations
const poeStartMarker = ",poe=({quizzes:r=[],onPlayQuiz:t,onShowToast:s})=>{";
const poeEndMarker = ",Ett=[{keywords:[\"ការ៉េ\"";

const cPoeStart = code.indexOf(poeStartMarker);
const cPoeEnd = code.indexOf(poeEndMarker, cPoeStart);
const bPoeStart = bak.indexOf(poeStartMarker);
const bPoeEnd = bak.indexOf(poeEndMarker, bPoeStart);

if (cPoeStart !== -1 && cPoeEnd !== -1 && bPoeStart !== -1 && bPoeEnd !== -1) {
  code = code.slice(0, cPoeStart) + bak.slice(bPoeStart, bPoeEnd) + code.slice(cPoeEnd);
  console.log("Restored clean poe component from backup.");
}

// 2. Define the Global Custom Code Game System & App Subject Content Harvester right before Kz=[
const kzMarker = ",Kz=[{id:\"camera_quiz\"";
const kzMarkerIdx = code.indexOf(kzMarker);
if (kzMarkerIdx === -1) {
  console.error("Could not find Kz=[ marker!");
  process.exit(1);
}

const codeGameSystemDef = `,GAME_SUBJECT_OPTIONS=[
  {id:"គណិតវិទ្យា",label:"គណិតវិទ្យា",icon:"🔢"},
  {id:"ភាសាខ្មែរ",label:"ភាសាខ្មែរ",icon:"📖"},
  {id:"វិទ្យាសាស្ត្រ",label:"វិទ្យាសាស្ត្រ",icon:"🔬"},
  {id:"សិក្សាសង្គម",label:"សិក្សាសង្គម",icon:"🏛️"},
  {id:"អប់រំសុខភាព",label:"អប់រំសុខភាព",icon:"❤️"},
  {id:"ភាសាអង់គ្លេស",label:"ភាសាអង់គ្លេស",icon:"🔤"},
  {id:"all",label:"ចម្រុះគ្រប់មុខវិជ្ជា",icon:"✨"}
],normalizeSubjectName=(rawSubj)=>{
  const s = String(rawSubj || "").trim();
  if (!s) return "គណិតវិទ្យា";
  if (s.includes("គណិត") || /math/i.test(s)) return "គណិតវិទ្យា";
  if (s.includes("ខ្មែរ") || /khmer/i.test(s)) return "ភាសាខ្មែរ";
  if (s.includes("វិទ្យាសាស្ត្រ") || /science/i.test(s)) return "វិទ្យាសាស្ត្រ";
  if (s.includes("សង្គម") || s.includes("ប្រវត្តិ") || s.includes("ភូមិ") || s.includes("សីលធម៌") || /social/i.test(s)) return "សិក្សាសង្គម";
  if (s.includes("សុខភាព") || /health/i.test(s)) return "អប់រំសុខភាព";
  if (s.includes("អង់គ្លេស") || /english/i.test(s)) return "ភាសាអង់គ្លេស";
  return "គណិតវិទ្យា";
},normalizeOneAppQuestion=(qObj, subj, setId, setTitle, fallbackPool=[])=>{
  if (!qObj || typeof qObj !== "object") return null;
  const qText = String(qObj.question || qObj.q || qObj.prompt || qObj.text || "").trim();
  if (!qText) return null;
  let choices = [];
  let correct = 0;
  let explain = String(qObj.explanation || qObj.explain || qObj.exp || qObj.hint || "").trim();

  if (Array.isArray(qObj.options) && qObj.options.length > 0) {
    if (typeof qObj.options[0] === "object" && qObj.options[0] !== null) {
      choices = qObj.options.map(o => String(o.text || o.label || o.value || "").trim()).filter(Boolean);
      const cIdx = qObj.options.findIndex(o => Boolean(o && o.isCorrect));
      correct = cIdx >= 0 ? cIdx : 0;
      const cObj = qObj.options[correct];
      if (!explain && cObj && cObj.exp) explain = String(cObj.exp).trim();
    } else {
      choices = qObj.options.map(o => String(o).trim()).filter(Boolean);
      if (typeof qObj.correctAnswer === "number") correct = qObj.correctAnswer;
      else if (typeof qObj.answerIndex === "number") correct = qObj.answerIndex;
      else if (typeof qObj.correct === "number") correct = qObj.correct;
      else if (typeof qObj.answer === "string") {
        const idx = choices.findIndex(c => c.toLowerCase() === qObj.answer.trim().toLowerCase());
        correct = idx >= 0 ? idx : 0;
      }
    }
  } else if (Array.isArray(qObj.choices) && qObj.choices.length > 0) {
    choices = qObj.choices.map(o => String(o).trim()).filter(Boolean);
    correct = typeof qObj.correct === "number" ? qObj.correct : (typeof qObj.correctAnswer === "number" ? qObj.correctAnswer : 0);
  } else if (qObj.correct && Array.isArray(qObj.wrongs)) {
    const rightAns = String(qObj.correct).trim();
    const wrongList = qObj.wrongs.map(w => String(w).trim()).filter(Boolean).slice(0, 3);
    choices = [rightAns, ...wrongList];
    correct = 0;
  } else if (typeof qObj.correctAnswer === "boolean") {
    choices = ["ពិត (ត្រូវ)", "មិនពិត (ខុស)", "មិនប្រាកដ", "គ្មានចម្លើយ"];
    correct = qObj.correctAnswer ? 0 : 1;
  } else if (typeof qObj.correctAnswer === "string" || typeof qObj.answer === "string") {
    const rightAns = String(qObj.correctAnswer || qObj.answer).trim();
    if (!rightAns) return null;
    const distractors = fallbackPool.filter(d => d && d !== rightAns).slice(0, 3);
    while (distractors.length < 3) {
      distractors.push("ចម្លើយផ្សេងទៀត " + (distractors.length + 1));
    }
    choices = [rightAns, ...distractors];
    correct = 0;
  }

  if (choices.length < 2) return null;
  while (choices.length < 4) {
    choices.push("ជម្រើសទី " + (choices.length + 1));
  }
  if (choices.length > 4) {
    const rightVal = choices[correct] || choices[0];
    const others = choices.filter((_, idx) => idx !== correct).slice(0, 3);
    choices = [rightVal, ...others];
    correct = 0;
  }
  if (correct < 0 || correct >= choices.length) correct = 0;

  return {
    q: qText,
    choices,
    correct,
    explain: explain || ("ចម្លើយត្រឹមត្រូវ៖ " + choices[correct]),
    subject: subj,
    setId: setId || ("set_" + subj),
    setTitle: setTitle || subj
  };
},buildAppSubjectCatalog=(extraQuizzes=[])=>{
  const subjKeys = ["គណិតវិទ្យា","ភាសាខ្មែរ","វិទ្យាសាស្ត្រ","សិក្សាសង្គម","អប់រំសុខភាព","ភាសាអង់គ្លេស"];
  const catalog = {};
  subjKeys.forEach(k => {
    catalog[k] = { sets: [], questions: [], _seenSetIds: new Set(), _seenQuestions: new Set() };
  });

  const addSetToSubject = (rawSubj, setId, setTitle, rawQuestions) => {
    const subj = normalizeSubjectName(rawSubj);
    const bucket = catalog[subj];
    if (!bucket || !Array.isArray(rawQuestions) || rawQuestions.length === 0) return;
    const cleanSetId = String(setId || (subj + "_" + bucket.sets.length)).trim();
    const cleanTitle = String(setTitle || subj).trim();
    const fallbackAnswers = rawQuestions
      .map(q => String((q && (q.correctAnswer || q.answer || q.correct)) || "").trim())
      .filter(s => s && s.length < 80);

    const normalizedList = [];
    rawQuestions.forEach(rq => {
      const nq = normalizeOneAppQuestion(rq, subj, cleanSetId, cleanTitle, fallbackAnswers);
      if (nq && ! normalizedList.some(x => x.q === nq.q)) {
        normalizedList.push(nq);
      }
    });
    if (normalizedList.length === 0) return;

    let existingSet = bucket.sets.find(s => s.id === cleanSetId || s.title === cleanTitle);
    if (!existingSet) {
      existingSet = { id: cleanSetId, title: cleanTitle, subject: subj, questions: [] };
      bucket.sets.push(existingSet);
    }
    normalizedList.forEach(nq => {
      if (!existingSet.questions.some(x => x.q === nq.q)) {
        existingSet.questions.push(nq);
      }
      if (!bucket._seenQuestions.has(nq.q)) {
        bucket._seenQuestions.add(nq.q);
        bucket.questions.push(nq);
      }
    });
  };

  try {
    // 1. $h: 20 Grade 6 Math Lessons (40 QCM questions each = 800 questions)
    if (typeof $h !== "undefined" && Array.isArray($h)) {
      $h.forEach(lesson => {
        if (lesson && Array.isArray(lesson.questions)) {
          addSetToSubject("គណិតវិទ្យា", "math_l" + lesson.lessonNumber, lesson.title || ("មេរៀនទី " + lesson.lessonNumber), lesson.questions);
        }
      });
    }
    // 2. f1: 4 Grade 6 Health Education Lessons (40 QCM questions each = 160 questions)
    if (typeof f1 !== "undefined" && Array.isArray(f1)) {
      f1.forEach(lesson => {
        if (lesson && Array.isArray(lesson.questions)) {
          addSetToSubject("អប់រំសុខភាព", "health_l" + lesson.lessonNumber, lesson.title || ("មេរៀនទី " + lesson.lessonNumber), lesson.questions);
        }
      });
    }
    // 3. IS: 40-question Comprehensive Health Education QCM Exam
    if (typeof IS !== "undefined" && Array.isArray(IS)) {
      addSetToSubject("អប់រំសុខភាព", "health_exam_40q", "វិញ្ញាសារួម QCM ៤០ សំណួរ ៖ អប់រំសុខភាព ថ្នាក់ទី៦", IS);
    }
    // 4. Xu: 40-question Grade 6 English MoEYS Exam
    if (typeof Xu !== "undefined" && Array.isArray(Xu)) {
      addSetToSubject("ភាសាអង់គ្លេស", "english_moeys_40q", "វិញ្ញាសាភាសាអង់គ្លេស ថ្នាក់ទី៦ (៤០ សំណួរ MoEYS)", Xu);
    }
    // 5. Zi: 40-question Grade 6 Science Lesson 1
    if (typeof Zi !== "undefined" && Array.isArray(Zi)) {
      addSetToSubject("វិទ្យាសាស្ត្រ", "science_lesson1_40q", "មេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ (៤០ សំណួរ QCM)", Zi);
    }
    // 6. g4: All Built-in Semester & Subject Exams
    if (typeof g4 !== "undefined" && Array.isArray(g4)) {
      g4.forEach(ex => {
        if (ex && Array.isArray(ex.questions) && ex.questions.length > 0) {
          addSetToSubject(ex.subject || "គណិតវិទ្យា", "exam_" + (ex.id || ex.title), ex.title || "វិញ្ញាសាប្រឡង", ex.questions);
        }
      });
    }
    // 7. Gw: Built-in Quizzes
    if (typeof Gw !== "undefined" && Array.isArray(Gw)) {
      Gw.forEach(qz => {
        if (qz && Array.isArray(qz.questions) && qz.questions.length > 0) {
          if (qz.id === "quiz-3") {
            const sciQs = qz.questions.filter(q => /រុក្ខជាតិ|ទឹក|សីតុណ្ហភាព|រស្មីសំយោគ|អុកស៊ីសែន|ភព|សត្វ/.test(q.question || ""));
            const socQs = qz.questions.filter(q => !sciQs.includes(q));
            if (sciQs.length > 0) addSetToSubject("វិទ្យាសាស្ត្រ", "quiz_sci_general", "កម្រងសំណួរពុទ្ធិវិទ្យាសាស្ត្រ", sciQs);
            if (socQs.length > 0) addSetToSubject("សិក្សាសង្គម", "quiz_soc_general", "កម្រងសំណួរចំណេះដឹងទូទៅ និងសិក្សាសង្គម", socQs);
          } else {
            addSetToSubject(qz.subject || "ភាសាខ្មែរ", "quiz_" + (qz.id || qz.title), qz.title || "កម្រងសំណួរ", qz.questions);
          }
        }
      });
    }
    // 8. A3e: Built-in Homework sets
    if (typeof A3e !== "undefined" && Array.isArray(A3e)) {
      A3e.forEach(hw => {
        if (hw && Array.isArray(hw.questions) && hw.questions.length > 0) {
          addSetToSubject(hw.subject || "គណិតវិទ្យា", "hw_" + (hw.id || hw.title), "កិច្ចការផ្ទះ ៖ " + (hw.title || ""), hw.questions);
        }
      });
    }
    // 9. Cw: All 6 Subject Lesson Summaries (sum-khmer, sum-math, sum-science, sum-social, sum-health, sum-english)
    if (typeof Cw !== "undefined" && Array.isArray(Cw)) {
      Cw.forEach(sumObj => {
        if (!sumObj || !Array.isArray(sumObj.chapters)) return;
        const subj = normalizeSubjectName(sumObj.subject || sumObj.title);
        sumObj.chapters.forEach((ch, cIdx) => {
          if (!ch) return;
          const chQuestions = [];
          if (Array.isArray(ch.practiceQuestions)) {
            ch.practiceQuestions.forEach(pq => chQuestions.push(pq));
          }
          if (Array.isArray(ch.vocabulary) && ch.vocabulary.length >= 2) {
            const allMeanings = ch.vocabulary.map(v => String(v.meaning || "").trim()).filter(Boolean);
            ch.vocabulary.forEach(v => {
              if (!v || !v.word || !v.meaning) return;
              const rightM = String(v.meaning).trim();
              const wrongs = allMeanings.filter(m => m !== rightM).slice(0, 3);
              while (wrongs.length < 3) wrongs.push("អត្ថន័យផ្សេងទៀត " + (wrongs.length + 1));
              chQuestions.push({
                question: "តើពាក្យគន្លឹះ «" + v.word + "» មានអត្ថន័យដូចម្ដេច?",
                options: [rightM, ...wrongs],
                answerIndex: 0,
                explanation: v.word + " ៖ " + rightM
              });
            });
          }
          if (chQuestions.length > 0) {
            addSetToSubject(subj, (sumObj.id || "sum") + "_ch" + (cIdx + 1), "សង្ខេបមេរៀន ៖ " + (ch.chapterTitle || sumObj.title), chQuestions);
          }
        });
      });
    }
    // 10. N8 & fg: Grade 6 English Units & Vocabulary
    if (typeof N8 !== "undefined" && Array.isArray(N8)) {
      N8.forEach((unit, uIdx) => {
        if (!unit) return;
        const unitQs = [];
        const vocabMeanings = Array.isArray(unit.vocabulary) ? unit.vocabulary.map(v => v.khmerMeaning).filter(Boolean) : [];
        if (Array.isArray(unit.vocabulary)) {
          unit.vocabulary.forEach(v => {
            if (!v || !v.word || !v.khmerMeaning) return;
            const others = vocabMeanings.filter(m => m !== v.khmerMeaning).slice(0, 3);
            while (others.length < 3) others.push("អត្ថន័យផ្សេងទៀត " + (others.length + 1));
            unitQs.push({
              question: "What is the Khmer meaning of '" + v.word + "'?",
              options: [v.khmerMeaning, ...others],
              correctAnswer: 0,
              explanation: v.word + " = " + v.khmerMeaning + (v.example ? " (" + v.example + ")" : "")
            });
          });
        }
        if (unit.languageFocus && Array.isArray(unit.languageFocus.practiceExercises)) {
          unit.languageFocus.practiceExercises.forEach(ex => {
            if (ex && ex.prompt && Array.isArray(ex.options)) {
              const ansIdx = ex.options.findIndex(o => o === ex.answer);
              unitQs.push({
                question: ex.prompt,
                options: ex.options,
                correctAnswer: ansIdx >= 0 ? ansIdx : 0,
                explanation: "Correct answer: " + (ex.answer || ex.options[0])
              });
            }
          });
        }
        if (unit.reading && Array.isArray(unit.reading.questions)) {
          unit.reading.questions.forEach(rq => {
            if (rq && rq.question && Array.isArray(rq.options)) {
              const ansIdx = rq.options.findIndex(o => o === rq.answer);
              unitQs.push({
                question: rq.question,
                options: rq.options,
                correctAnswer: ansIdx >= 0 ? ansIdx : 0,
                explanation: "Correct answer: " + (rq.answer || rq.options[0])
              });
            }
          });
        }
        if (unitQs.length > 0) {
          addSetToSubject("ភាសាអង់គ្លេស", "eng_unit_" + (unit.id || uIdx), (unit.unitNumber ? unit.unitNumber + ": " : "") + (unit.unitTitle || "English Unit"), unitQs);
        }
      });
    }
    if (typeof fg !== "undefined" && Array.isArray(fg) && fg.length >= 4) {
      const allM = fg.map(v => v.meaning).filter(Boolean);
      const fgQs = fg.map(v => {
        const others = allM.filter(m => m !== v.meaning).sort(() => Math.random() - 0.5).slice(0, 3);
        return {
          question: "What does '" + v.word + "' " + (v.emoji || "") + " mean in Khmer?",
          options: [v.meaning, ...others],
          correctAnswer: 0,
          explanation: v.example || (v.word + " = " + v.meaning)
        };
      });
      addSetToSubject("ភាសាអង់គ្លេស", "eng_vocab_app", "វាក្យសព្ទភាសាអង់គ្លេសក្នុង App (Vocabulary)", fgQs);
    }
    // 11. Built-in Khmer Spelling Bee (Ru) & Word Pairs (Dtt)
    if (typeof Ru !== "undefined" && Array.isArray(Ru) && Ru.length > 0) {
      addSetToSubject("ភាសាខ្មែរ", "khmer_spelling_bee", "អក្ខរាវិរុទ្ធភាសាខ្មែរក្នុង App (Spelling Bee)", Ru);
    }
    if (typeof Dtt !== "undefined" && Array.isArray(Dtt) && Dtt.length >= 4) {
      const allMatches = Dtt.map(d => d.match).filter(Boolean);
      const pairQs = Dtt.map(d => {
        const others = allMatches.filter(m => m !== d.match).slice(0, 3);
        return {
          question: "ជ្រើសរើសដៃគូពាក្យ (" + (d.category || "ភាសាខ្មែរ") + ") ត្រូវនឹងពាក្យ «" + d.word + "» ៖",
          options: [d.match, ...others],
          correctAnswer: 0,
          explanation: "«" + d.word + "» គូនឹង «" + d.match + "» (" + (d.category || "") + ")"
        };
      });
      addSetToSubject("ភាសាខ្មែរ", "khmer_word_pairs", "ល្បែងផ្គូផ្គងពាក្យខ្មែរក្នុង App (ពាក្យផ្ទុយ និងសទិសសព្ទ)", pairQs);
    }
    // 12. Grade 6 MoEYS Curriculum Lessons across subjects (N$, C$, fCe, hCe, pCe, mCe, bCe)
    const curriculumArrays = [
      typeof N$ !== "undefined" ? N$ : null,
      typeof C$ !== "undefined" ? C$ : null,
      typeof fCe !== "undefined" ? fCe : null,
      typeof hCe !== "undefined" ? hCe : null,
      typeof pCe !== "undefined" ? pCe : null,
      typeof mCe !== "undefined" ? mCe : null,
      typeof bCe !== "undefined" ? bCe : null
    ];
    curriculumArrays.forEach(arr => {
      if (!Array.isArray(arr)) return;
      arr.forEach(lesson => {
        if (!lesson || !lesson.subject) return;
        const subj = normalizeSubjectName(lesson.subject);
        const lQs = [];
        if (Array.isArray(lesson.questions)) lQs.push(...lesson.questions);
        if (Array.isArray(lesson.quiz)) lQs.push(...lesson.quiz);
        if (Array.isArray(lesson.exercises)) {
          lesson.exercises.forEach(ex => {
            if (ex && (ex.question || ex.q)) lQs.push(ex);
          });
        }
        if (Array.isArray(lesson.vocabulary) && lesson.vocabulary.length >= 2) {
          const allDefs = lesson.vocabulary.map(v => String(v.definition || v.meaning || "").trim()).filter(Boolean);
          lesson.vocabulary.forEach(v => {
            const def = String(v.definition || v.meaning || "").trim();
            if (!v.word || !def) return;
            const others = allDefs.filter(d => d !== def).slice(0, 3);
            while (others.length < 3) others.push("អត្ថន័យផ្សេងទៀត " + (others.length + 1));
            lQs.push({
              question: "ក្នុង" + (lesson.title || "មេរៀន") + " តើពាក្យ «" + v.word + "» មានន័យដូចម្ដេច?",
              options: [def, ...others],
              correctAnswer: 0,
              explanation: v.word + " ៖ " + def
            });
          });
        }
        if (lQs.length > 0) {
          addSetToSubject(subj, "curr_" + (lesson.id || lesson.title), lesson.title || "មេរៀនកម្មវិធីសិក្សា", lQs);
        }
      });
    });
    // 13. Extra live quizzes passed from app state (he / r) + localStorage quizzes
    if (Array.isArray(extraQuizzes)) {
      extraQuizzes.forEach(qz => {
        if (qz && Array.isArray(qz.questions) && qz.questions.length > 0) {
          addSetToSubject(qz.subject || qz.khmerSubject || "គណិតវិទ្យា", "live_" + (qz.id || qz.title), qz.title || "កម្រងសំណួរក្នុង App", qz.questions);
        }
      });
    }
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.includes("custom_games")) continue;
      const raw = localStorage.getItem(k);
      if (!raw || (raw[0] !== "[" && raw[0] !== "{")) continue;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(item => {
            if (item && Array.isArray(item.questions) && item.questions.length > 0) {
              addSetToSubject(item.subject || item.khmerSubject || "គណិតវិទ្យា", "ls_" + (item.id || item.title || k), item.title || "សំណួររបស់គ្រូក្នុង App", item.questions);
            }
          });
        }
      } catch {}
    }
  } catch (err) {
    console.warn("Catalog harvest warning:", err);
  }

  // Build "all" combined subject catalog
  const allSets = [];
  const allQuestions = [];
  subjKeys.forEach(k => {
    delete catalog[k]._seenSetIds;
    delete catalog[k]._seenQuestions;
    catalog[k].sets.forEach(s => allSets.push(s));
    catalog[k].questions.forEach(q => allQuestions.push(q));
  });
  catalog["all"] = { sets: allSets, questions: allQuestions };

  if (typeof window !== "undefined") {
    window.__APP_SUBJECT_CATALOG__ = catalog;
  }
  return catalog;
},DEFAULT_MATH_BATTLE_GAME={
  id:"math_battle_quest_abyss",
  title:"សមរភូមិព្រួញអន្តរកម្ម៖ សង្វៀនជ្រោះជ្រៅ",
  subTitle:"Battle Quest: ខ្លឹមសារមេរៀន និងវិញ្ញាសាក្នុង App តាមមុខវិជ្ជា",
  subject:"គណិតវិទ្យា",
  subjectKey:"គណិតវិទ្យា",
  khmerSubject:"គណិតវិទ្យា",
  isMultiSubject:!0,
  grade:"ថ្នាក់ទី ៤-៦",
  icon:"🏹",
  badge:"ខ្លឹមសារក្នុង App តាមមុខវិជ្ជា • វីរបុរស ៥រូប",
  gradient:"from-amber-500 via-orange-600 to-rose-700",
  color:"from-amber-500 via-orange-600 to-rose-700",
  imageUrl:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
  description:"ទាញយកសំណួរពីមេរៀន និងវិញ្ញាសាដែលមានស្រាប់នៅក្នុង App តាមមុខវិជ្ជាទាំង ៦ (គណិតវិទ្យា ២០មេរៀន ភាសាខ្មែរ វិទ្យាសាស្ត្រ សិក្សាសង្គម អប់រំសុខភាព ភាសាអង់គ្លេស)!",
  tags:["ខ្លឹមសារក្នុង App","គណិតវិទ្យា","ភាសាខ្មែរ","វិទ្យាសាស្ត្រ","សិក្សាសង្គម"],
  actionType:"modal_code_game",
  playText:"🏹 ចូលសមរភូមិប្រយុទ្ធ",
  isBuiltInCodeGame:!0,
  embedUrl:"/math-battle-quest.html"
},ADD_CODE_GAME_CARD={
  id:"add_custom_code_game_card",
  title:"បញ្ចូលល្បែងសិក្សាថ្មីដោយកូដ",
  subTitle:"Paste HTML5 / CSS / JS / Iframe Game",
  subject:"គ្រប់មុខវិជ្ជា",
  subjectKey:"all",
  khmerSubject:"គ្រប់មុខវិជ្ជា",
  isMultiSubject:!0,
  grade:"គ្រប់ថ្នាក់",
  icon:"➕",
  badge:"បង្កើត ឬបិទភ្ជាប់កូដហ្គេម",
  gradient:"from-purple-600 via-indigo-600 to-rose-600",
  color:"from-purple-600 via-indigo-600 to-rose-600",
  imageUrl:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
  description:"បិទភ្ជាប់កូដ HTML5 ពេញលេញ (<!DOCTYPE html>), កូដ JavaScript/CSS ឬបញ្ចូលឯកសារ .html ហើយប្រើខ្លឹមសារមេរៀនក្នុង App តាមមុខវិជ្ជា!",
  tags:["HTML5 / JS","បញ្ចូលកូដផ្ទាល់ខ្លួន","ខ្លឹមសារក្នុង App"],
  actionType:"modal_add_code_game",
  playText:"➕ បញ្ចូលកូដល្បែងថ្មី"
},patchPastedGameHtml=(rawHtml)=>{
  if (!rawHtml || typeof rawHtml !== "string") return "";
  let html = rawHtml;
  if (html.includes("QUESTION_ROSTER") && html.includes("let curQ;")) {
    html = html.replace("let curQ;", "window.__activeQuestion = null; let curQ;");
    html = html.replace(
      "document.getElementById('question-number').innerText",
      "window.__activeQuestion = curQ; document.getElementById('question-number').innerText"
    );
    html = html.replace(
      /const curQ = currentQuestionIdx < QUESTION_ROSTER\\.length \\? QUESTION_ROSTER\\[currentQuestionIdx\\] : null;/g,
      "const curQ = window.__activeQuestion || (currentQuestionIdx < QUESTION_ROSTER.length ? QUESTION_ROSTER[currentQuestionIdx] : null);"
    );
    html = html.replace(
      /let curQ = currentQuestionIdx < QUESTION_ROSTER\\.length \\? QUESTION_ROSTER\\[currentQuestionIdx\\] : null;/g,
      "let curQ = window.__activeQuestion || (currentQuestionIdx < QUESTION_ROSTER.length ? QUESTION_ROSTER[currentQuestionIdx] : null);"
    );
  }
  if (html.includes("Math Battle Quest") && html.includes("arena-viewport") && !html.includes("mbq-clean-layout-fix")) {
    const cleanCss = \`<style id="mbq-clean-layout-fix">
      html, body { height: 100% !important; max-height: 100vh !important; overflow: hidden !important; margin: 0 !important; }
      #game-container { height: 100% !important; max-height: 100vh !important; max-width: 100% !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; }
      header { flex-shrink: 0 !important; padding-top: 6px !important; padding-bottom: 6px !important; }
      main { flex: 1 1 0% !important; min-height: 0 !important; padding-bottom: 4px !important; display: flex !important; flex-direction: column !important; justify-content: flex-end !important; }
      .arena-viewport { height: clamp(100px, 20vh, 185px) !important; bottom: 0 !important; }
      #hero-sprite, #enemy-sprite { min-width: 0 !important; min-height: 0 !important; width: clamp(76px, 16vh, 134px) !important; height: clamp(76px, 16vh, 134px) !important; }
      #hero-sprite svg, #enemy-sprite svg { width: 100% !important; height: 100% !important; }
      #boss-taunt-bubble { top: 4px !important; right: 100% !important; margin-right: 8px !important; }
      footer { flex-shrink: 0 !important; padding-bottom: 8px !important; }
      #choices-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 6px !important; }
      #question-text { min-height: 28px !important; font-size: clamp(12px, 1.8vh, 16px) !important; }
    </style>\`;
    html = html.replace("</head>", cleanCss + "</head>");
  }
  if (html.includes("QUESTION_ROSTER") && !html.includes("mbq-app-catalog-bridge")) {
    const multiSubjBridge = \`<script id="mbq-app-catalog-bridge">
      (function(){
        function shuffleQuestionChoices(item) {
          const pairs = (item.choices || []).map((c, idx) => ({ text: c, isRight: idx === (item.correct || 0) }));
          for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = pairs[i]; pairs[i] = pairs[j]; pairs[j] = tmp;
          }
          return {
            q: item.q,
            choices: pairs.map(p => p.text),
            correct: Math.max(0, pairs.findIndex(p => p.isRight)),
            explain: item.explain || ""
          };
        }
        function applyAppQuestions(subj, setId, directQuestions) {
          if (typeof QUESTION_ROSTER === "undefined") return;
          let list = [];
          if (Array.isArray(directQuestions) && directQuestions.length > 0) {
            list = directQuestions;
          } else {
            const cat = (window.parent && window.parent.__APP_SUBJECT_CATALOG__) || window.__APP_SUBJECT_CATALOG__;
            if (cat) {
              const bucket = cat[subj] || cat["គណិតវិទ្យា"];
              if (bucket) {
                if (setId && setId !== "all") {
                  const foundSet = (bucket.sets || []).find(s => s.id === setId);
                  if (foundSet && Array.isArray(foundSet.questions)) list = foundSet.questions;
                }
                if (list.length === 0 && Array.isArray(bucket.questions)) {
                  list = bucket.questions;
                }
              }
            }
          }
          if (list.length > 0) {
            QUESTION_ROSTER.length = 0;
            list.forEach(item => QUESTION_ROSTER.push(shuffleQuestionChoices(item)));
            if (typeof currentQuestionIdx !== "undefined") currentQuestionIdx = 0;
            if (typeof loadQuestion === "function") loadQuestion();
          }
        }
        window.addEventListener("message", function(ev) {
          if (ev.data && ev.data.type === "SELECT_SUBJECT") {
            applyAppQuestions(ev.data.subject || "គណិតវិទ្យា", ev.data.setId || "all", ev.data.questions);
          }
        });
        window.addEventListener("load", function() {
          setTimeout(function() {
            applyAppQuestions("គណិតវិទ្យា", "all", null);
          }, 80);
        });
      })();
    <\\/script>\`;
    html = html.replace("</body>", multiSubjBridge + "</body>");
  }
  return html;
},getStoredCustomGames=()=>{
  try {
    const v2 = JSON.parse(localStorage.getItem("teacher_custom_games_v2") || "[]");
    const v1 = JSON.parse(localStorage.getItem("teacher_custom_games") || "[]");
    const merged = [...(Array.isArray(v2)?v2:[])];
    if (Array.isArray(v1)) {
      v1.forEach(g => {
        if (g && g.id && !merged.some(m => m.id === g.id)) merged.push(g);
      });
    }
    return merged.map(g => ({
      ...g,
      embedCode: g.embedCode ? patchPastedGameHtml(g.embedCode) : g.embedCode,
      subject: g.subject || g.khmerSubject || "គណិតវិទ្យា",
      subjectKey: g.subjectKey || g.khmerSubject || g.subject || "គណិតវិទ្យា",
      khmerSubject: g.khmerSubject || g.subject || "គណិតវិទ្យា",
      isMultiSubject: Boolean(g.isMultiSubject || g.subject === "គ្រប់មុខវិជ្ជា" || g.khmerSubject === "គ្រប់មុខវិជ្ជា" || (g.embedCode && g.embedCode.includes("QUESTION_ROSTER"))),
      subTitle: g.subTitle || "Custom Interactive Code Game",
      badge: g.badge || "ល្បែងកូដអន្តរកម្ម",
      gradient: g.gradient || g.color || "from-purple-600 via-indigo-600 to-rose-600",
      color: g.color || g.gradient || "from-purple-600 via-indigo-600 to-rose-600",
      imageUrl: g.imageUrl || "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
      tags: Array.isArray(g.tags) ? g.tags : [g.khmerSubject || "ល្បែងសិក្សា", "កូដផ្ទាល់ខ្លួន"],
      actionType: "modal_code_game",
      playText: g.playText || "🎮 ចូលលេងឥឡូវនេះ",
      isCustom: !0
    }));
  } catch {
    return [];
  }
},saveStoredCustomGames=(list)=>{
  try {
    localStorage.setItem("teacher_custom_games_v2", JSON.stringify(list));
    localStorage.setItem("teacher_custom_games", JSON.stringify(list));
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("custom-games-updated"));
  }
},useCustomCodeGames=()=>{
  const [games, setGames] = y.useState(() => getStoredCustomGames());
  y.useEffect(() => {
    const syncLocal = () => setGames(getStoredCustomGames());
    window.addEventListener("custom-games-updated", syncLocal);
    fetch("/api/custom-games")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && Array.isArray(data.games) && data.games.length > 0) {
          const cur = getStoredCustomGames();
          let changed = false;
          data.games.forEach(sg => {
            if (sg && sg.id && !cur.some(c => c.id === sg.id)) {
              cur.unshift(sg);
              changed = true;
            }
          });
          if (changed) saveStoredCustomGames(cur);
        }
      })
      .catch(() => {});
    return () => window.removeEventListener("custom-games-updated", syncLocal);
  }, []);
  return games;
},codeModalInstances=new Set(),CodeGameModalsHost=({onShowToast:s,appQuizzes:extraQuizzes=[]})=>{
  const [showAdd, setShowAdd] = y.useState(!1);
  const [editId, setEditId] = y.useState(null);
  const [title, setTitle] = y.useState("");
  const [subject, setSubject] = y.useState("គណិតវិទ្យា");
  const [grade, setGrade] = y.useState("ថ្នាក់ទី ៤-៦");
  const [icon, setIcon] = y.useState("🏹");
  const [desc, setDesc] = y.useState("");
  const [codeInfoText, setCodeInfoText] = y.useState("មិនទាន់មានកូដ");
  const [hasCode, setHasCode] = y.useState(!1);
  const [playingGame, setPlayingGame] = y.useState(null);
  const [activePlaySubject, setActivePlaySubject] = y.useState("គណិតវិទ្យា");
  const [activePlaySetId, setActivePlaySetId] = y.useState("all");
  const [blobPlayUrl, setBlobPlayUrl] = y.useState(null);
  const [reloadKey, setReloadKey] = y.useState(0);
  const fileInputRef = y.useRef(null);
  const codeTextareaRef = y.useRef(null);
  const iframeRef = y.useRef(null);
  const pendingCodeRef = y.useRef("");
  const instanceRef = y.useRef(null);

  const appCatalog = y.useMemo(() => buildAppSubjectCatalog(extraQuizzes), [extraQuizzes, playingGame]);
  const currentSubjectBucket = (appCatalog && appCatalog[activePlaySubject]) || (appCatalog && appCatalog["គណិតវិទ្យា"]) || { sets: [], questions: [] };
  const currentSubjectSets = currentSubjectBucket.sets || [];

  const postSelectionToGameIframe = (subjId, setId) => {
    try {
      const cat = window.__APP_SUBJECT_CATALOG__ || appCatalog;
      const bucket = (cat && cat[subjId]) || { sets: [], questions: [] };
      let questionsToSend = bucket.questions || [];
      if (setId && setId !== "all") {
        const found = (bucket.sets || []).find(st => st.id === setId);
        if (found && Array.isArray(found.questions) && found.questions.length > 0) {
          questionsToSend = found.questions;
        }
      }
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: "SELECT_SUBJECT",
          subject: subjId,
          setId: setId || "all",
          questions: questionsToSend
        }, "*");
      }
    } catch {}
  };

  const sendSubjectToGameIframe = (subjId) => {
    setActivePlaySubject(subjId);
    setActivePlaySetId("all");
    postSelectionToGameIframe(subjId, "all");
  };

  const sendLessonSetToGameIframe = (setId) => {
    setActivePlaySetId(setId);
    postSelectionToGameIframe(activePlaySubject, setId);
  };

  y.useEffect(() => {
    const onChildMsg = (ev) => {
      if (ev && ev.data && ev.data.type === "GAME_CHANGED_SUBJECT") {
        if (ev.data.subject) setActivePlaySubject(ev.data.subject);
        if (ev.data.setId) setActivePlaySetId(ev.data.setId);
      }
    };
    window.addEventListener("message", onChildMsg);
    return () => window.removeEventListener("message", onChildMsg);
  }, []);

  const updateCodeStatsFromValue = (rawVal) => {
    const c = String(rawVal || "").trim();
    pendingCodeRef.current = c;
    setHasCode(c.length > 0);
    if (!c) {
      setCodeInfoText("មិនទាន់មានកូដ");
    } else if (/<!doctype|<html/i.test(c)) {
      setCodeInfoText("✅ កូដគេហទំព័រហ្គេម HTML5 ពេញលេញ (" + (Math.round((c.length / 1024) * 10) / 10) + " KB)");
    } else if (/^<iframe/i.test(c)) {
      setCodeInfoText("✅ កូដ Iframe Embed");
    } else if (/^(https?:\\/\\/|\\/)/i.test(c)) {
      setCodeInfoText("✅ តំណភ្ជាប់ URL ផ្ទាល់");
    } else {
      setCodeInfoText("✅ កូដ HTML / JS / CSS (" + c.length + " តួអក្សរ)");
    }
  };

  const setTextareaCode = (val) => {
    const str = String(val || "");
    pendingCodeRef.current = str;
    if (codeTextareaRef.current) {
      codeTextareaRef.current.value = str;
    }
    updateCodeStatsFromValue(str);
  };

  y.useEffect(() => {
    if (showAdd && codeTextareaRef.current) {
      codeTextareaRef.current.value = pendingCodeRef.current || "";
    }
  }, [showAdd]);

  y.useEffect(() => {
    if (!playingGame) {
      setBlobPlayUrl(null);
      return;
    }
    const rawCode = patchPastedGameHtml((playingGame.embedCode || "").trim());
    if (!rawCode && playingGame.embedUrl) {
      const sep = playingGame.embedUrl.includes("?") ? "&" : "?";
      setBlobPlayUrl(playingGame.embedUrl + sep + "subject=" + encodeURIComponent(activePlaySubject || "គណិតវិទ្យា"));
      return;
    }
    if (/^(https?:\\/\\/|\\/)/i.test(rawCode) && !rawCode.includes("<")) {
      setBlobPlayUrl(rawCode);
      return;
    }
    if (/^<iframe\\b/i.test(rawCode) && !/<html|<!doctype/i.test(rawCode)) {
      const srcMatch = rawCode.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        setBlobPlayUrl(srcMatch[1]);
        return;
      }
    }
    const fullDoc = /<!doctype|<html/i.test(rawCode)
      ? rawCode
      : \`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><script src="https://cdn.tailwindcss.com"><\\/script><link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Kantumruy+Pro:wght@400;600;700&display=swap" rel="stylesheet"><style>body{margin:0;font-family:'Kantumruy Pro','Battambang',sans-serif;}</style></head><body>\${rawCode}</body></html>\`;
    const blob = new Blob([fullDoc], { type: "text/html;charset=utf-8" });
    const objUrl = URL.createObjectURL(blob);
    setBlobPlayUrl(objUrl);
    return () => {
      try { URL.revokeObjectURL(objUrl); } catch {}
    };
  }, [playingGame, reloadKey]);

  y.useEffect(() => {
    const inst = {
      openAdd: (gameToEdit = null) => {
        if (gameToEdit && gameToEdit.id) {
          setEditId(gameToEdit.id);
          setTitle(gameToEdit.title || "");
          setSubject(gameToEdit.khmerSubject || gameToEdit.subject || "គណិតវិទ្យា");
          setGrade(gameToEdit.grade || "ថ្នាក់ទី ៤-៦");
          setIcon(typeof gameToEdit.icon === "string" ? gameToEdit.icon : "🎮");
          setDesc(gameToEdit.description || "");
          if (gameToEdit.embedCode) {
            setTextareaCode(gameToEdit.embedCode);
          } else if (gameToEdit.embedUrl) {
            setTextareaCode("");
            fetch(gameToEdit.embedUrl).then(r => r.text()).then(t => setTextareaCode(t)).catch(() => {});
          }
        } else {
          setEditId(null);
          setTitle("");
          setSubject("គណិតវិទ្យា");
          setGrade("ថ្នាក់ទី ៤-៦");
          setIcon("🏹");
          setDesc("");
          setTextareaCode("");
        }
        setShowAdd(!0);
      },
      play: (game, preferredSubject = null) => {
        if (!game) return;
        buildAppSubjectCatalog(extraQuizzes);
        const initSubj = preferredSubject && preferredSubject !== "all"
          ? preferredSubject
          : (game.khmerSubject && game.khmerSubject !== "គ្រប់មុខវិជ្ជា" ? game.khmerSubject : "គណិតវិទ្យា");
        setActivePlaySubject(initSubj);
        setActivePlaySetId("all");
        setPlayingGame(game);
        setReloadKey(k => k + 1);
      },
      toast: s
    };
    instanceRef.current = inst;
    codeModalInstances.add(inst);

    window.openAddCodeGameModal = (gameToEdit = null) => {
      const first = [...codeModalInstances][0];
      if (first) first.openAdd(gameToEdit);
    };
    window.playCodeGame = (game, preferredSubject = null) => {
      const first = [...codeModalInstances][0];
      if (first) first.play(game, preferredSubject);
    };
    window.deleteCustomCodeGame = (id, evt) => {
      if (evt && evt.stopPropagation) evt.stopPropagation();
      const cur = getStoredCustomGames().filter(g => g.id !== id);
      saveStoredCustomGames(cur);
      fetch("/api/custom-games/" + encodeURIComponent(id), { method: "DELETE" }).catch(() => {});
      const first = [...codeModalInstances][0];
      if (first && first.toast) first.toast("🗑️ បានលុបល្បែងសិក្សាដោយជោគជ័យ!");
    };

    return () => {
      codeModalInstances.delete(inst);
    };
  }, [s, extraQuizzes]);

  y.useEffect(() => {
    if (playingGame || showAdd) {
      document.body.classList.add("qcm-open", "answering-exam");
    } else {
      document.body.classList.remove("qcm-open", "answering-exam");
    }
    return () => {
      document.body.classList.remove("qcm-open", "answering-exam");
    };
  }, [playingGame, showAdd]);

  const autoDetectTitleFromCode = (content, fallbackName = "") => {
    if (title.trim()) return;
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\\/title>/i);
    if (titleMatch && titleMatch[1]) {
      const rawT = titleMatch[1].trim();
      setTitle(rawT.includes("Math Battle Quest") ? "សមរភូមិព្រួញអន្តរកម្ម៖ សង្វៀនជ្រោះជ្រៅ" : rawT);
    } else if (fallbackName) {
      setTitle(fallbackName.replace(/\\.(html?|txt|js)$/i, ""));
    }
  };

  const handleFileUpload = (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (eLoad) => {
      const content = patchPastedGameHtml(String((eLoad.target && eLoad.target.result) || ""));
      setTextareaCode(content);
      autoDetectTitleFromCode(content, file.name);
      s && s("📂 បានទាញយកកូដពីឯកសារដោយជោគជ័យ!");
    };
    reader.readAsText(file);
  };

  const handleClipboardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        const patched = patchPastedGameHtml(text);
        setTextareaCode(patched);
        autoDetectTitleFromCode(patched, "ល្បែងសិក្សាអន្តរកម្មថ្មី");
        s && s("📋 បានបិទភ្ជាប់កូដពី Clipboard ដោយជោគជ័យ!");
      } else {
        s && s("⚠️ មិនមានកូដនៅក្នុង Clipboard ទេ សូមចម្លងកូដជាមុនសិន!");
      }
    } catch {
      if (codeTextareaRef.current) {
        codeTextareaRef.current.focus();
      }
      s && s("💡 សូមចុច Ctrl+V (ឬ Cmd+V) នៅក្នុងប្រអប់កូដខាងក្រោម!");
    }
  };

  const handleLoadMathBattleTemplate = () => {
    fetch("/math-battle-quest.html")
      .then(r => r.text())
      .then(txt => {
        setTextareaCode(txt);
        if (!title.trim()) setTitle("សមរភូមិព្រួញអន្តរកម្ម៖ សង្វៀនជ្រោះជ្រៅ");
        if (!desc.trim()) setDesc("ប្រើខ្លឹមសារមេរៀន និងវិញ្ញាសាដែលមានស្រាប់ក្នុង App តាមមុខវិជ្ជាទាំង ៦!");
        setSubject("គ្រប់មុខវិជ្ជា");
        setIcon("🏹");
        s && s("🏹 បានដាក់កូដគំរូ សមរភូមិព្រួញអន្តរកម្ម (ភ្ជាប់ខ្លឹមសារក្នុង App ស្រាប់) រួចរាល់!");
      })
      .catch(() => {});
  };

  const handleSave = () => {
    const rawVal = codeTextareaRef.current ? codeTextareaRef.current.value : pendingCodeRef.current;
    const finalCode = patchPastedGameHtml(String(rawVal || "").trim());
    if (!finalCode) {
      s && s("⚠️ សូមបិទភ្ជាប់កូដល្បែង (HTML / JS / Iframe) ជាមុនសិន!");
      return;
    }
    let finalTitle = title.trim();
    if (!finalTitle) {
      const tMatch = finalCode.match(/<title[^>]*>([^<]+)<\\/title>/i);
      finalTitle = (tMatch && tMatch[1]) ? tMatch[1].trim() : "ល្បែងសិក្សាអន្តរកម្មថ្មី";
    }
    const cur = getStoredCustomGames();
    const newGame = {
      id: editId && !String(editId).startsWith("math_battle") ? editId : "custom_" + Date.now(),
      title: finalTitle,
      subTitle: "Custom Interactive Game",
      subject: subject,
      subjectKey: subject === "គ្រប់មុខវិជ្ជា" ? "all" : subject,
      khmerSubject: subject,
      isMultiSubject: subject === "គ្រប់មុខវិជ្ជា" || finalCode.includes("QUESTION_ROSTER"),
      grade: grade,
      icon: icon || "🎮",
      badge: "ល្បែងកូដអន្តរកម្ម",
      gradient: "from-purple-600 via-indigo-600 to-rose-600",
      color: "from-purple-600 via-indigo-600 to-rose-600",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
      description: desc.trim() || "ល្បែងសិក្សាអន្តរកម្មបញ្ចូលដោយកូដផ្ទាល់ខ្លួន",
      tags: [subject, "ល្បែងកូដអន្តរកម្ម", grade],
      actionType: "modal_code_game",
      playText: "🎮 ចូលលេងឥឡូវនេះ",
      isCustom: !0,
      embedCode: finalCode
    };
    const filtered = cur.filter(g => g.id !== newGame.id);
    const updated = [newGame, ...filtered];
    saveStoredCustomGames(updated);
    fetch("/api/custom-games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGame)
    }).catch(() => {});
    setShowAdd(!1);
    s && s("🎉 បានរក្សាទុក និងបើកល្បែងសិក្សាថ្មីដោយជោគជ័យ!");
    setPlayingGame(newGame);
  };

  if (!playingGame && !showAdd) return null;

  const modalContent = e.jsxs(e.Fragment, {
    children: [
      playingGame && e.jsxs("div", {
        "data-modal-open": "true",
        style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh", zIndex: 99999 },
        className: "fixed inset-0 z-[99999] bg-slate-950 flex flex-col overflow-hidden animate-fade-in",
        children: [
          e.jsxs("div", {
            className: "px-3 sm:px-4 py-1.5 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-2 min-w-0",
                children: [
                  e.jsx("span", {
                    className: "w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-base shadow-md shrink-0",
                    children: typeof playingGame.icon === "string" ? playingGame.icon : "🎮"
                  }),
                  e.jsxs("div", {
                    className: "min-w-0",
                    children: [
                      e.jsx("h3", {
                        className: "text-xs sm:text-sm font-black text-white truncate max-w-[160px] sm:max-w-[220px]",
                        children: playingGame.title
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-1 text-[10px] text-amber-300 font-bold",
                        children: [
                          e.jsx("span", { children: activePlaySubject === "all" ? "ចម្រុះគ្រប់មុខវិជ្ជា" : activePlaySubject }),
                          e.jsx("span", { children: "•" }),
                          e.jsx("span", { className: "text-emerald-300", children: (currentSubjectBucket.questions ? currentSubjectBucket.questions.length : 0) + " សំណួរក្នុង App" })
                        ]
                      })
                    ]
                  })
                ]
              }),
              e.jsxs("div", {
                className: "flex flex-wrap items-center gap-1.5 max-w-full",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full",
                    children: GAME_SUBJECT_OPTIONS.map(opt => {
                      const subjCount = (appCatalog && appCatalog[opt.id] && appCatalog[opt.id].questions) ? appCatalog[opt.id].questions.length : 0;
                      return e.jsxs("button", {
                        type: "button",
                        onClick: () => sendSubjectToGameIframe(opt.id),
                        className: \`px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-black flex items-center gap-1 whitespace-nowrap cursor-pointer transition shrink-0 border \${activePlaySubject === opt.id ? "bg-amber-400 text-slate-950 border-amber-200 shadow-md" : "bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700"}\`,
                        children: [
                          e.jsx("span", { children: opt.icon }),
                          e.jsx("span", { children: opt.label }),
                          subjCount > 0 && e.jsx("span", {
                            className: \`text-[9px] px-1 rounded-full \${activePlaySubject === opt.id ? "bg-slate-950/20 text-slate-950" : "bg-slate-900 text-amber-300"}\`,
                            children: subjCount
                          })
                        ]
                      }, opt.id);
                    })
                  }),
                  currentSubjectSets.length > 0 && e.jsxs("select", {
                    value: activePlaySetId,
                    onChange: ev => sendLessonSetToGameIframe(ev.target.value),
                    title: "ជ្រើសរើសមេរៀន ឬវិញ្ញាសាដែលមានស្រាប់ក្នុង App",
                    className: "px-2.5 py-1 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/50 text-[10px] sm:text-[11px] font-bold max-w-[200px] sm:max-w-[260px] truncate cursor-pointer focus:outline-none",
                    children: [
                      e.jsx("option", {
                        value: "all",
                        children: "📑 គ្រប់មេរៀន/វិញ្ញាសាទាំងអស់ (" + (currentSubjectBucket.questions ? currentSubjectBucket.questions.length : 0) + " សំណួរ)"
                      }),
                      ...currentSubjectSets.map(st => e.jsx("option", {
                        value: st.id,
                        children: "📘 " + st.title + " (" + st.questions.length + " សំណួរ)"
                      }, st.id))
                    ]
                  })
                ]
              }),
              e.jsxs("div", {
                className: "flex items-center gap-1.5 shrink-0",
                children: [
                  e.jsxs("button", {
                    type: "button",
                    onClick: () => setReloadKey(k => k + 1),
                    className: "px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition active:scale-95",
                    title: "ចាប់ផ្តើមល្បែងឡើងវិញ",
                    children: [e.jsx("span", { children: "🔄" }), e.jsx("span", { className: "hidden sm:inline", children: "លេងម្ដងទៀត" })]
                  }),
                  e.jsxs("button", {
                    type: "button",
                    onClick: () => {
                      const g = playingGame;
                      setPlayingGame(null);
                      window.openAddCodeGameModal && window.openAddCodeGameModal(g);
                    },
                    className: "px-2.5 py-1.5 rounded-xl bg-indigo-950/90 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition active:scale-95",
                    title: "មើល ឬកែប្រែកូដល្បែងនេះ",
                    children: [e.jsx("span", { children: "💻" }), e.jsx("span", { className: "hidden sm:inline", children: "កូដ" })]
                  }),
                  e.jsxs("button", {
                    type: "button",
                    onClick: () => setPlayingGame(null),
                    className: "px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1 cursor-pointer transition active:scale-95",
                    children: [e.jsx("span", { children: "✕" }), e.jsx("span", { children: "បិទ" })]
                  })
                ]
              })
            ]
          }),
          e.jsx("div", {
            className: "flex-1 w-full h-full relative overflow-hidden bg-slate-950",
            children: blobPlayUrl ? e.jsx("iframe", {
              ref: iframeRef,
              key: "play_" + reloadKey + "_" + blobPlayUrl,
              src: blobPlayUrl,
              onLoad: () => {
                postSelectionToGameIframe(activePlaySubject, activePlaySetId);
              },
              title: playingGame.title,
              className: "w-full h-full border-0 bg-slate-950",
              allow: "autoplay; fullscreen; microphone; camera; accelerometer; gyroscope; clipboard-read; clipboard-write"
            }) : e.jsx("div", {
              className: "w-full h-full flex items-center justify-center text-amber-300 font-bold text-sm",
              children: "កំពុងរៀបចំសង្វៀនល្បែងសិក្សា..."
            })
          })
        ]
      }),
      showAdd && e.jsx("div", {
        "data-modal-open": "true",
        style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh", zIndex: 99998 },
        className: "fixed inset-0 z-[99998] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in",
        children: e.jsxs("div", {
          className: "bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border-2 border-purple-500/30 space-y-4 max-h-[92vh] flex flex-col",
          children: [
            e.jsxs("div", {
              className: "flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0",
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [
                    e.jsx("span", {
                      className: "w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md",
                      children: icon || "🎮"
                    }),
                    e.jsxs("div", {
                      children: [
                        e.jsx("h3", {
                          className: "text-base sm:text-lg font-black text-slate-900 dark:text-white font-moul",
                          children: editId ? "កែប្រែល្បែងសិក្សាដោយកូដ" : "បញ្ចូលល្បែងសិក្សាថ្មីដោយកូដ"
                        }),
                        e.jsx("p", {
                          className: "text-xs text-slate-500 dark:text-slate-400",
                          children: "បិទភ្ជាប់កូដ HTML5 (<!DOCTYPE html>) ហើយប្រើខ្លឹមសារមេរៀនក្នុង App ស្រាប់តាមមុខវិជ្ជា"
                        })
                      ]
                    })
                  ]
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: () => setShowAdd(!1),
                  className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 flex items-center justify-center text-sm font-black cursor-pointer",
                  children: "✕"
                })
              ]
            }),
            e.jsxs("div", {
              className: "space-y-4 overflow-y-auto pr-1 flex-1",
              children: [
                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                  children: [
                    e.jsxs("div", {
                      className: "sm:col-span-2 space-y-1",
                      children: [
                        e.jsx("label", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "ចំណងជើងល្បែងសិក្សា (ប្រសិនបើទុកទទេ នឹងទាញពី <title> ស្វ័យប្រវត្តិ)" }),
                        e.jsx("input", {
                          type: "text",
                          value: title,
                          onChange: ev => setTitle(ev.target.value),
                          placeholder: "ឧ. សមរភូមិព្រួញអន្តរកម្ម៖ សង្វៀនជ្រោះជ្រៅ...",
                          className: "w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        e.jsx("label", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "រូបតំណាង (Emoji)" }),
                        e.jsxs("div", {
                          className: "flex items-center gap-1.5",
                          children: [
                            e.jsx("input", {
                              type: "text",
                              value: icon,
                              onChange: ev => setIcon(ev.target.value),
                              className: "w-14 px-2 py-2 text-center text-base rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                            }),
                            e.jsx("div", {
                              className: "flex items-center gap-1 overflow-x-auto no-scrollbar py-1",
                              children: ["🏹","🎮","🧮","🚀","🧩","👑","🔬","📖"].map(em => e.jsx("button", {
                                type: "button",
                                onClick: () => setIcon(em),
                                className: \`w-7 h-7 rounded-lg text-sm flex items-center justify-center shrink-0 cursor-pointer border \${icon===em?"bg-purple-100 border-purple-500":"bg-slate-50 border-slate-200 hover:bg-slate-100"}\`,
                                children: em
                              }, em))
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "grid grid-cols-2 gap-3",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        e.jsx("label", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "មុខវិជ្ជា" }),
                        e.jsxs("select", {
                          value: subject,
                          onChange: ev => setSubject(ev.target.value),
                          className: "w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white",
                          children: [
                            e.jsx("option", { value: "គ្រប់មុខវិជ្ជា", children: "✨ គ្រប់មុខវិជ្ជា (ប្រើខ្លឹមសារក្នុង App តាមមុខវិជ្ជា)" }),
                            e.jsx("option", { value: "គណិតវិទ្យា", children: "🔢 គណិតវិទ្យា" }),
                            e.jsx("option", { value: "ភាសាខ្មែរ", children: "📖 ភាសាខ្មែរ" }),
                            e.jsx("option", { value: "វិទ្យាសាស្ត្រ", children: "🔬 វិទ្យាសាស្ត្រ" }),
                            e.jsx("option", { value: "សិក្សាសង្គម", children: "🏛️ សិក្សាសង្គម" }),
                            e.jsx("option", { value: "អប់រំសុខភាព", children: "❤️ អប់រំសុខភាព" }),
                            e.jsx("option", { value: "ភាសាអង់គ្លេស", children: "🔤 ភាសាអង់គ្លេស" })
                          ]
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        e.jsx("label", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "កម្រិតថ្នាក់" }),
                        e.jsxs("select", {
                          value: grade,
                          onChange: ev => setGrade(ev.target.value),
                          className: "w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white",
                          children: [
                            e.jsx("option", { value: "ថ្នាក់ទី ៤-៦", children: "ថ្នាក់ទី ៤-៦" }),
                            e.jsx("option", { value: "ថ្នាក់ទី ១-៦", children: "ថ្នាក់ទី ១-៦" }),
                            e.jsx("option", { value: "ថ្នាក់ទី ១-៣", children: "ថ្នាក់ទី ១-៣" }),
                            e.jsx("option", { value: "ថ្នាក់ទី ៦", children: "ថ្នាក់ទី ៦" }),
                            e.jsx("option", { value: "គ្រប់ថ្នាក់", children: "គ្រប់ថ្នាក់" })
                          ]
                        })
                      ]
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "space-y-1",
                  children: [
                    e.jsx("label", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "ការពិពណ៌នាខ្លីអំពីល្បែង" }),
                    e.jsx("input", {
                      type: "text",
                      value: desc,
                      onChange: ev => setDesc(ev.target.value),
                      placeholder: "ពិពណ៌នាខ្លីៗអំពីរបៀបលេង ឬគោលបំណងមេរៀន...",
                      className: "w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-white"
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-wrap items-center justify-between gap-2",
                      children: [
                        e.jsx("label", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "កូដល្បែង (HTML / CSS / JS / Iframe / URL) *" }),
                        e.jsxs("div", {
                          className: "flex flex-wrap items-center gap-1.5",
                          children: [
                            e.jsx("input", {
                              ref: fileInputRef,
                              type: "file",
                              accept: ".html,.htm,.txt,.js",
                              onChange: handleFileUpload,
                              className: "hidden"
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: handleClipboardPaste,
                              className: "px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition",
                              children: [e.jsx("span", { children: "📋" }), e.jsx("span", { children: "បិទភ្ជាប់កូដ (Paste)" })]
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => fileInputRef.current && fileInputRef.current.click(),
                              className: "px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition",
                              children: [e.jsx("span", { children: "📂" }), e.jsx("span", { children: "ឯកសារ .html" })]
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: handleLoadMathBattleTemplate,
                              className: "px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition",
                              children: [e.jsx("span", { children: "🏹" }), e.jsx("span", { children: "កូដគំរូ Battle Quest" })]
                            }),
                            hasCode && e.jsx("button", {
                              type: "button",
                              onClick: () => setTextareaCode(""),
                              className: "px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[11px] font-bold cursor-pointer",
                              children: "សម្អាត"
                            })
                          ]
                        })
                      ]
                    }),
                    e.jsx("textarea", {
                      ref: codeTextareaRef,
                      rows: 7,
                      defaultValue: pendingCodeRef.current,
                      onInput: ev => {
                        const val = ev.target.value || "";
                        updateCodeStatsFromValue(val);
                        if (val.length > 30 && !title.trim()) {
                          autoDetectTitleFromCode(val);
                        }
                      },
                      placeholder: "<!DOCTYPE html>\\n<html lang=\\"km\\">\\n  ... បិទភ្ជាប់កូដ HTML ពេញលេញ ឬ <iframe src=\\"...\\"></iframe> នៅទីនេះ ...",
                      className: "w-full px-3.5 py-2.5 text-xs rounded-2xl bg-slate-900 text-emerald-300 border border-slate-700 font-mono leading-relaxed focus:ring-2 focus:ring-purple-500"
                    }),
                    e.jsxs("div", {
                      className: "flex items-center justify-between text-[11px]",
                      children: [
                        e.jsx("span", { className: "font-bold text-purple-600 dark:text-purple-400", children: codeInfoText }),
                        e.jsx("span", { className: "text-slate-400", children: "ភ្ជាប់ខ្លឹមសារមេរៀន និងវិញ្ញាសាក្នុង App ស្រាប់តាមមុខវិជ្ជា" })
                      ]
                    })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0",
              children: [
                e.jsx("button", {
                  type: "button",
                  onClick: () => setShowAdd(!1),
                  className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer",
                  children: "បោះបង់"
                }),
                e.jsxs("button", {
                  type: "button",
                  onClick: handleSave,
                  className: "px-5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-black rounded-xl text-xs shadow-lg shadow-purple-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95 transition",
                  children: [e.jsx("span", { children: "🚀" }), e.jsx("span", { children: "រក្សាទុក & បើកលេងភ្លាមៗ" })]
                })
              ]
            })
          ]
        })
      })
    ]
  });
  return typeof document !== "undefined" && document.body && typeof Xo !== "undefined" && Xo.createPortal
    ? Xo.createPortal(modalContent, document.body)
    : modalContent;
}`;

code = code.slice(0, kzMarkerIdx) + codeGameSystemDef + code.slice(kzMarkerIdx);
console.log("Injected buildAppSubjectCatalog, DEFAULT_MATH_BATTLE_GAME, ADD_CODE_GAME_CARD, and CodeGameModalsHost before Kz.");

// 3. Add DEFAULT_MATH_BATTLE_GAME as the first item inside Kz=[
code = code.replace(",Kz=[{id:\"camera_quiz\"", ",Kz=[DEFAULT_MATH_BATTLE_GAME,{id:\"camera_quiz\"");

// 4. Inside InteractiveSharedSection, hook up useCustomCodeGames(), add the "+ បញ្ចូលកូដល្បែងសិក្សា" button and card, and render custom games in the carousel
const issStateTarget = `const[H,O]=y.useState("all");`;
const issStateReplacement = `const[H,O]=y.useState("all");const customKzGames=useCustomCodeGames();const allKzGames=y.useMemo(()=>[DEFAULT_MATH_BATTLE_GAME,ADD_CODE_GAME_CARD,...customKzGames,...Kz.filter(g=>g.id!=="math_battle_quest_abyss"&&g.id!=="add_custom_code_game_card")],[customKzGames]);`;

if (code.includes(issStateTarget)) {
  code = code.replace(issStateTarget, issStateReplacement);
  console.log("Added customKzGames and allKzGames to InteractiveSharedSection.");
} else {
  console.error("Could not find issStateTarget!");
  process.exit(1);
}

// Replace Kz.length with allKzGames.length inside InteractiveSharedSection
code = code.replaceAll("children:Kz.length", "children:allKzGames.length");

// Add "+ បញ្ចូលកូដល្បែងសិក្សា" button next to scroll left/right buttons in InteractiveSharedSection
const scrollBtnsTarget = `e.jsxs("div",{className:"flex items-center gap-1.5 self-end sm:self-auto",children:[e.jsx("button",{onClick:()=>hr("left")`;
const scrollBtnsReplacement = `e.jsxs("div",{className:"flex items-center gap-1.5 self-end sm:self-auto",children:[E==="games"&&e.jsxs("button",{type:"button",onClick:()=>window.openAddCodeGameModal&&window.openAddCodeGameModal(),className:"px-3 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer transition active:scale-95 shrink-0",children:[e.jsx("span",{children:"➕"}),e.jsx("span",{children:"បញ្ចូលកូដល្បែងសិក្សា"})]}),e.jsx("button",{onClick:()=>hr("left")`;

if (code.includes(scrollBtnsTarget)) {
  code = code.replace(scrollBtnsTarget, scrollBtnsReplacement);
  console.log("Added '+ បញ្ចូលកូដល្បែងសិក្សា' button to InteractiveSharedSection header.");
}

// Update Kz.filter in InteractiveSharedSection to use allKzGames.filter and show multi-subject games under every subject filter
const kzFilterTarget = `const at=Kz.filter(Pt=>H==="all"?!0:Pt.subjectKey===H||Pt.subject===H);`;
const kzFilterReplacement = `const at=allKzGames.filter(Pt=>H==="all"||Pt.id==="add_custom_code_game_card"||Pt.isMultiSubject||Pt.subjectKey==="all"||Pt.subject==="គ្រប់មុខវិជ្ជា"?!0:Pt.subjectKey===H||Pt.subject===H||Pt.khmerSubject===H);`;
if (code.includes(kzFilterTarget)) {
  code = code.replace(kzFilterTarget, kzFilterReplacement);
  console.log("Updated Kz.filter to allKzGames.filter in InteractiveSharedSection.");
}

// Update the play button handler on cards in InteractiveSharedSection to pass the selected subject H to window.playCodeGame(Pt, H)
const cardPlayBtnTarget = `onClick:()=>{Ut||(Pt.actionType==="modal_fishing"?De(!0):Pt.actionType==="modal_vijjanava"?be(!0):Pt.actionType==="modal_english"?Et(!0):Pt.actionType==="modal_camera"?or(!0):be(!0))}`;
const cardPlayBtnReplacement = `onClick:()=>{Ut||(Pt.actionType==="modal_add_code_game"?window.openAddCodeGameModal&&window.openAddCodeGameModal():Pt.actionType==="modal_code_game"||Pt.isCustom?window.playCodeGame&&window.playCodeGame(Pt,H):Pt.actionType==="modal_fishing"?De(!0):Pt.actionType==="modal_vijjanava"?be(!0):Pt.actionType==="modal_english"?Et(!0):Pt.actionType==="modal_camera"?or(!0):be(!0))}`;

if (code.includes(cardPlayBtnTarget)) {
  code = code.replace(cardPlayBtnTarget, cardPlayBtnReplacement);
  console.log("Updated card play button in InteractiveSharedSection to launch code games with selected subject.");
}

// Also add Edit/Delete buttons on custom games in InteractiveSharedSection card footer
const cardGradeBadgeTarget = `e.jsx("span",{className:"text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-white border border-white/20",children:Pt.grade})`;
const cleanGradeBadgeReplacement = `e.jsxs("div",{className:"flex items-center gap-1",children:[Pt.isCustom&&e.jsx("button",{type:"button",onClick:ev=>{ev.stopPropagation();window.openAddCodeGameModal&&window.openAddCodeGameModal(Pt)},className:"w-6 h-6 rounded-full bg-white/25 hover:bg-amber-400 hover:text-slate-950 backdrop-blur-md text-white flex items-center justify-center text-[11px] cursor-pointer transition",title:"កែប្រែកូដ",children:"✏️"}),Pt.isCustom&&e.jsx("button",{type:"button",onClick:ev=>{ev.stopPropagation();window.deleteCustomCodeGame&&window.deleteCustomCodeGame(Pt.id,ev)},className:"w-6 h-6 rounded-full bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md text-white flex items-center justify-center text-[11px] cursor-pointer transition",title:"លុបល្បែង",children:"🗑️"}),e.jsx("span",{className:"text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-white border border-white/20",children:Pt.grade})]})`;

if (code.includes(cardGradeBadgeTarget)) {
  code = code.replace(cardGradeBadgeTarget, cleanGradeBadgeReplacement);
  console.log("Added edit/delete buttons to custom game cards in InteractiveSharedSection.");
}

// Mount CodeGameModalsHost at the end of InteractiveSharedSection with appQuizzes: he
const issEndModalTarget = `vt&&e.jsx(iCe,{isOpen:vt,onClose:()=>or(!1),studentName:r.name||"សិស្សឆ្នើម",initialQuizzes:he})`;
const issEndModalReplacement = `vt&&e.jsx(iCe,{isOpen:vt,onClose:()=>or(!1),studentName:r.name||"សិស្សឆ្នើម",initialQuizzes:he}),e.jsx(CodeGameModalsHost,{onShowToast:u,appQuizzes:he})`;
if (code.includes(issEndModalTarget)) {
  code = code.replace(issEndModalTarget, issEndModalReplacement);
  console.log("Mounted CodeGameModalsHost inside InteractiveSharedSection with appQuizzes:he.");
}

// 5. Enhance `poe` (មជ្ឈមណ្ឌលល្បែងសិក្សាអន្តរកម្ម) so it displays DEFAULT_MATH_BATTLE_GAME, ADD_CODE_GAME_CARD, all custom games, all 7 subject filter tabs, and "+ បញ្ចូលកូដល្បែងសិក្សា" button!
const poeListTarget = `jr=()=>{vt(0),Cr(0),Ve(null),ct(!1),w("click")},he=[{id:"math"`;
const poeListReplacement = `jr=()=>{vt(0),Cr(0),Ve(null),ct(!1),w("click")},customPoeGames=useCustomCodeGames(),he=[DEFAULT_MATH_BATTLE_GAME,ADD_CODE_GAME_CARD,...customPoeGames,{id:"math"`;

if (code.includes(poeListTarget)) {
  code = code.replace(poeListTarget, poeListReplacement);
  console.log("Added DEFAULT_MATH_BATTLE_GAME, ADD_CODE_GAME_CARD, and customPoeGames to poe game list.");
} else {
  console.error("Could not find poeListTarget!");
  process.exit(1);
}

// Update poe's subject filter check to support multi-subject games across all subjects
const poeSubjectCheckTarget = `const Ge=o==="all"||Re.khmerSubject===o,xt=`;
const poeSubjectCheckReplacement = `const Ge=o==="all"||Re.khmerSubject===o||Re.subject===o||Re.isMultiSubject||Re.subjectKey==="all"||Re.khmerSubject==="គ្រប់មុខវិជ្ជា",xt=`;
if (code.includes(poeSubjectCheckTarget)) {
  code = code.replace(poeSubjectCheckTarget, poeSubjectCheckReplacement);
  console.log("Updated poe subject filter check to include multi-subject games.");
}

// Expand poe's subject filter tabs from 4 to all 7 subjects
const poeSubjectTabsTarget = `[{id:"all",label:"ទាំងអស់"},{id:"ភាសាខ្មែរ",label:"ភាសាខ្មែរ"},{id:"គណិតវិទ្យា",label:"គណិតវិទ្យា"},{id:"វិទ្យាសាស្ត្រ",label:"វិទ្យាសាស្ត្រ"}]`;
const poeSubjectTabsReplacement = `[{id:"all",label:"ទាំងអស់"},{id:"គណិតវិទ្យា",label:"🔢 គណិតវិទ្យា"},{id:"ភាសាខ្មែរ",label:"📖 ភាសាខ្មែរ"},{id:"វិទ្យាសាស្ត្រ",label:"🔬 វិទ្យាសាស្ត្រ"},{id:"សិក្សាសង្គម",label:"🏛️ សិក្សាសង្គម"},{id:"អប់រំសុខភាព",label:"❤️ អប់រំសុខភាព"},{id:"ភាសាអង់គ្លេស",label:"🔤 ភាសាអង់គ្លេស"}]`;
if (code.includes(poeSubjectTabsTarget)) {
  code = code.replace(poeSubjectTabsTarget, poeSubjectTabsReplacement);
  console.log("Expanded poe subject filter tabs to all 7 subjects.");
}

// Add "+ បញ្ចូលកូដល្បែងសិក្សា" button in poe's search/filter bar
const poeFilterBarTarget = `e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4",children:[e.jsxs("div",{className:"relative w-full sm:w-72"`;
const poeFilterBarReplacement = `e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2 w-full sm:w-auto",children:[e.jsxs("button",{type:"button",onClick:()=>window.openAddCodeGameModal&&window.openAddCodeGameModal(),className:"px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-black rounded-2xl text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 cursor-pointer transition active:scale-95 shrink-0",children:[e.jsx("span",{children:"➕"}),e.jsx("span",{children:"បញ្ចូលកូដល្បែងសិក្សា"})]}),e.jsxs("div",{className:"relative flex-1 sm:w-64"`;

if (code.includes(poeFilterBarTarget)) {
  const poeInputEndTarget = `placeholder:"ស្វែងរកល្បែងសិក្សា...",className:"w-full pl-10 pr-4 py-2 text-xs font-medium rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-100"})]}`;
  const poeInputEndReplacement = `placeholder:"ស្វែងរកល្បែងសិក្សា...",className:"w-full pl-10 pr-4 py-2 text-xs font-medium rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-100"})]})]}`;
  code = code.replace(poeFilterBarTarget, poeFilterBarReplacement);
  code = code.replace(poeInputEndTarget, poeInputEndReplacement);
  console.log("Added '+ បញ្ចូលកូដល្បែងសិក្សា' button to poe filter bar.");
}

// In poe card rendering: support string/emoji icons (like "🏹" or "🎮") as well as component icons (`e.jsx(Ge, ...)`)
const poeIconTarget = `children:e.jsx(Ge,{className:"w-7 h-7"})`;
const poeIconReplacement = `children:typeof Ge==="string"?e.jsx("span",{className:"text-2xl",children:Ge}):e.jsx(Ge,{className:"w-7 h-7"})`;
if (code.includes(poeIconTarget)) {
  code = code.replace(poeIconTarget, poeIconReplacement);
  console.log("Updated poe card icon rendering to support emoji icons.");
}

// In poe card play button: pass selected subject `o` to window.playCodeGame(Re, o)
const poePlayTarget = `onClick:()=>{n(Re.id),Re.id==="math"&&U(),Re.id==="pairs"&&fe(),Re.id==="sentence"&&De(0),Re.id==="spelling"&&jr()}`;
const poePlayReplacement = `onClick:()=>{if(Re.actionType==="modal_add_code_game"){window.openAddCodeGameModal&&window.openAddCodeGameModal();return;}if(Re.actionType==="modal_code_game"||Re.isCustom){window.playCodeGame&&window.playCodeGame(Re,o);return;}n(Re.id),Re.id==="math"&&U(),Re.id==="pairs"&&fe(),Re.id==="sentence"&&De(0),Re.id==="spelling"&&jr()}`;
if (code.includes(poePlayTarget)) {
  code = code.replace(poePlayTarget, poePlayReplacement);
  console.log("Updated poe card play button to launch code games with selected subject.");
}

// Also add Edit/Delete buttons next to play button in poe cards for custom games
const poeCardFooterTarget = `e.jsxs("button",{onClick:()=>{if(Re.actionType==="modal_add_code_game"`;
const poeCardFooterReplacement = `e.jsxs("div",{className:"flex items-center gap-2",children:[Re.isCustom&&e.jsx("button",{type:"button",onClick:ev=>{ev.stopPropagation();window.openAddCodeGameModal&&window.openAddCodeGameModal(Re)},className:"p-2.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 text-xs cursor-pointer transition",title:"កែប្រែកូដ",children:"✏️"}),Re.isCustom&&e.jsx("button",{type:"button",onClick:ev=>{ev.stopPropagation();window.deleteCustomCodeGame&&window.deleteCustomCodeGame(Re.id,ev)},className:"p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs cursor-pointer transition",title:"លុបល្បែង",children:"🗑️"}),e.jsxs("button",{onClick:()=>{if(Re.actionType==="modal_add_code_game"`;
const poeCardFooterEndTarget = `e.jsx("span",{children:"ចាប់ផ្តើមលេង"})]})]})]},Re.id)`;
const poeCardFooterEndReplacement = `e.jsx("span",{children:Re.playText||"ចាប់ផ្តើមលេង"})]})]})]})]},Re.id)`;

if (code.includes(poeCardFooterTarget) && code.includes(poeCardFooterEndTarget)) {
  code = code.replace(poeCardFooterTarget, poeCardFooterReplacement);
  code = code.replace(poeCardFooterEndTarget, poeCardFooterEndReplacement);
  console.log("Added Edit/Delete buttons to custom game cards in poe.");
}

const poeEndTarget = `Ze&&e.jsxs("div",{className:"p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium",children:["💡 ",Ru[Et].explanation]})]})]})]})},Ett=`;
const poeEndReplacement = `Ze&&e.jsxs("div",{className:"p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium",children:["💡 ",Ru[Et].explanation]})]})]}),e.jsx(CodeGameModalsHost,{onShowToast:s,appQuizzes:r})]})},Ett=`;
if (code.includes(poeEndTarget)) {
  code = code.replace(poeEndTarget, poeEndReplacement);
  console.log("Mounted CodeGameModalsHost inside poe with appQuizzes:r.");
}

// 6. Also in Student Portal's Educational Games Hub (De==="games"), add Math Battle Quest card & "+ បញ្ចូលកូដល្បែងសិក្សា" button!
const studentHubHeaderTarget = `e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg font-bold text-slate-900 font-moul",children:"ល្បែងសិក្សាអន្តរកម្ម (Educational Games Hub)"}),e.jsx("p",{className:"text-xs text-slate-500",children:"លេងល្បែងកម្សាន្តអប់រំ និងពង្រឹងចំណេះដឹងតាមបែបសប្បាយ"})]})`;
const studentHubHeaderReplacement = `e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg font-bold text-slate-900 font-moul",children:"ល្បែងសិក្សាអន្តរកម្ម (Educational Games Hub)"}),e.jsx("p",{className:"text-xs text-slate-500",children:"លេងល្បែងកម្សាន្តអប់រំ និងពង្រឹងចំណេះដឹងតាមបែបសប្បាយ"})]}),e.jsxs("button",{type:"button",onClick:()=>window.openAddCodeGameModal&&window.openAddCodeGameModal(),className:"px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-black rounded-2xl text-xs shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95 self-start sm:self-auto",children:[e.jsx("span",{children:"➕"}),e.jsx("span",{children:"បញ្ចូលកូដល្បែងសិក្សា"})]})]})`;

if (code.includes(studentHubHeaderTarget)) {
  code = code.replace(studentHubHeaderTarget, studentHubHeaderReplacement);
  console.log("Added '+ បញ្ចូលកូដល្បែងសិក្សា' button to Student Educational Games Hub header.");
}

const studentHubGridTarget = `e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs(sr.div,{whileHover:{y:-4},className:"bg-gradient-to-br from-sky-500 to-blue-700`;
const studentHubGridReplacement = `e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs(sr.div,{whileHover:{y:-4},className:"bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner",children:"🏹"}),e.jsx("h3",{className:"text-base font-bold font-moul text-amber-100",children:"សមរភូមិព្រួញគណិតវិទ្យា"}),e.jsx("p",{className:"text-xs text-amber-50 leading-relaxed",children:"ជ្រើសរើសវីរបុរសបាញ់ព្រួញទាំង ៥ ប្រើជំនាញពិសេសឆ្លើយចំណោទគណិតវិទ្យាការពារសង្វៀនជ្រោះជ្រៅ!"})]}),e.jsx("button",{onClick:()=>{window.playCodeGame&&window.playCodeGame(DEFAULT_MATH_BATTLE_GAME)},className:"w-full py-3 bg-white text-rose-950 rounded-2xl font-black text-xs hover:bg-amber-300 hover:text-slate-950 transition shadow-sm cursor-pointer",children:"🏹 ចូលសមរភូមិប្រយុទ្ធ"})]}),e.jsxs(sr.div,{whileHover:{y:-4},className:"bg-gradient-to-br from-sky-500 to-blue-700`;

if (code.includes(studentHubGridTarget)) {
  code = code.replace(studentHubGridTarget, studentHubGridReplacement);
  console.log("Added Math Battle Quest card to Student Educational Games Hub grid.");
}

// 7. Validate with esbuild and vm.Script!
console.log("--- Validating with esbuild ---");
try {
  esbuild.transformSync(code, { loader: "js" });
  console.log("ESBUILD VALIDATION: 100% SUCCESS!");
} catch (err) {
  console.error("ESBUILD ERROR:", err.message);
  if (err.errors && err.errors[0]) console.error(err.errors[0].location);
  process.exit(1);
}

console.log("--- Validating with vm.Script ---");
try {
  new vm.Script(code);
  console.log("VM.SCRIPT VALIDATION: 100% SUCCESS!");
} catch (err) {
  console.error("VM.SCRIPT ERROR:", err.message);
  process.exit(1);
}

fs.writeFileSync(filePath, code, "utf8");
if (fs.existsSync("dist/assets")) {
  fs.writeFileSync(distPath, code, "utf8");
}
console.log("Successfully wrote updated bundle! Final size:", code.length);
