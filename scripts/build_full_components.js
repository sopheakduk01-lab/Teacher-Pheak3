import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("Starting build of enhanced Rz11 and Rz12 with 40 QCM, Fullscreen, and Shuffled Options...");

// 1. Load Lesson 11 and Lesson 12 40 Questions
const l11Questions = JSON.parse(fs.readFileSync('scripts/lesson11_questions.json', 'utf8'));
const l12Questions = JSON.parse(fs.readFileSync('scripts/lesson12_questions.json', 'utf8'));
console.log(`Loaded ${l11Questions.length} questions for Lesson 11.`);
console.log(`Loaded ${l12Questions.length} questions for Lesson 12.`);

// 2. Enhance Rz11
let rz11Code = fs.readFileSync('scripts/rz11_component_code.js', 'utf8');

// Replace quizQuestions in rz11Code with rebalanced questions
const qqStart = rz11Code.indexOf('const quizQuestions =');
const qqEnd = rz11Code.indexOf(';', qqStart);
if (qqStart !== -1 && qqEnd !== -1) {
  rz11Code = rz11Code.slice(0, qqStart) + `const quizQuestions = ${JSON.stringify(l11Questions)}` + rz11Code.slice(qqEnd);
  console.log("Successfully replaced quizQuestions in Rz11 with rebalanced 40 questions!");
}

// Add isFullScreen state and shuffle functions to Rz11 if not present
if (!rz11Code.includes("isFullScreen")) {
  rz11Code = rz11Code.replace(
    'const [soundEnabled, setSoundEnabled] = y.useState(!0);',
    'const [soundEnabled, setSoundEnabled] = y.useState(!0);\n  const [isFullScreen, setIsFullScreen] = y.useState(!0);'
  );
}

if (!rz11Code.includes("shuffledQuestions")) {
  const shuffleHelpers = `
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const shuffleQuiz = (list) => list.map(q => ({
    ...q,
    options: shuffleArray(q.options)
  }));
  const [shuffledQuestions, setShuffledQuestions] = y.useState(() => shuffleQuiz(quizQuestions));
`;
  rz11Code = rz11Code.replace('const score = Object.keys(userAnswers)', shuffleHelpers + '\n  const score = Object.keys(userAnswers)');
  
  // Update score calculation to use shuffledQuestions
  rz11Code = rz11Code.replace(
    'const q = quizQuestions[qIdx];',
    'const q = (shuffledQuestions || quizQuestions)[qIdx];'
  );

  // Update question reference in quiz tab
  rz11Code = rz11Code.replace(
    'children: quizQuestions.map((q, idx) => {',
    'children: (shuffledQuestions || quizQuestions).map((q, idx) => {'
  );
  rz11Code = rz11Code.replace(
    'const q = quizQuestions[currentQIndex];',
    'const q = (shuffledQuestions || quizQuestions)[currentQIndex];'
  );

  // Add shuffle button in exam header
  const targetExamHeader = 'e.jsx("p", { className: "text-xs text-slate-500", children: "សំណួរពហុជ្រើសរើសស្រង់ចេញពីខ្លឹមសារមេរៀនទី ១១ ពេញលេញ" })';
  const shuffleBtn = `e.jsx("p", { className: "text-xs text-slate-500", children: "សំណួរពហុជ្រើសរើសស្រង់ចេញពីខ្លឹមសារមេរៀនទី ១១ ពេញលេញ" }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => {
                                setShuffledQuestions(shuffleQuiz(quizQuestions));
                                setUserAnswers({});
                                setCurrentQIndex(0);
                                s && s("បានឆ្លាស់លំដាប់ចម្លើយដោយជោគជ័យ! 🔀");
                              },
                              className: "mt-2 px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer w-fit shadow-xs",
                              title: "ចុចដើម្បីឆ្លាស់ជម្រើសចម្លើយដោយចៃដន្យ",
                              children: [
                                e.jsx("span", { children: "🔀" }),
                                e.jsx("span", { children: "ឆ្លាស់ចម្លើយ (Shuffle)" })
                              ]
                            })`;
  rz11Code = rz11Code.replace(targetExamHeader, shuffleBtn);

  // Update retry button in Rz11
  rz11Code = rz11Code.replace(
    'setIsFinished(!1);\n                        setUserAnswers({});\n                        setCurrentQIndex(0);',
    'setIsFinished(!1);\n                        setUserAnswers({});\n                        setCurrentQIndex(0);\n                        setShuffledQuestions(shuffleQuiz(quizQuestions));'
  );
}

// Fullscreen layout in Rz11
if (!rz11Code.includes('title: isFullScreen ? "បង្រួមបង្អួច" : "ពង្រីកពេញអេក្រង់"')) {
  // Add fullscreen button in modal header
  const headerBtnTarget = 'children: soundEnabled ? "🔔" : "🔕"\n                }),';
  const fsBtn = `children: soundEnabled ? "🔔" : "🔕"
                }),
                e.jsxs("button", {
                  type: "button",
                  onClick: () => setIsFullScreen(!isFullScreen),
                  title: isFullScreen ? "បង្រួមបង្អួច" : "ពង្រីកពេញអេក្រង់",
                  className: "px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 flex items-center gap-1.5 text-white text-xs font-bold transition cursor-pointer border border-white/30",
                  children: [
                    e.jsx("span", { children: isFullScreen ? "⛶" : "🗖" }),
                    e.jsx("span", { className: "hidden sm:inline", children: isFullScreen ? "បង្រួម" : "ពេញអេក្រង់" })
                  ]
                }),`;
  rz11Code = rz11Code.replace(headerBtnTarget, fsBtn);

  // Update outer container and inner container classes for fullscreen
  const oldOuterTarget = 'className: "fixed inset-0 z-[100] overflow-y-auto bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-[\'Battambang\']",\n    children: e.jsxs("div", {\n      className: "bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 overflow-hidden flex flex-col max-h-[94vh]",';
  const newOuterClasses = `onClick: (ev) => { if (ev.target === ev.currentTarget) t(); },
    className: isFullScreen ?
      "fixed inset-0 z-[100] w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-['Battambang'] p-0" :
      "fixed inset-0 z-[100] overflow-y-auto bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-['Battambang']",
    children: e.jsxs("div", {
      onClick: (ev) => ev.stopPropagation(),
      className: isFullScreen ?
        "bg-white dark:bg-slate-900 w-full h-full min-h-screen sm:min-h-screen flex flex-col overflow-hidden rounded-none border-0" :
        "bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 overflow-hidden flex flex-col max-h-[94vh]",`;
  rz11Code = rz11Code.replace(oldOuterTarget, newOuterClasses);
}

fs.writeFileSync('scripts/rz11_component_code.js', rz11Code, 'utf8');
console.log("Updated scripts/rz11_component_code.js successfully!");

// Validate Rz11
try {
  const testRz11 = `const y = { useState: () => [null, () => {}], useEffect: () => {} }; const e = { jsx: () => {}, jsxs: () => {} }; ${rz11Code}`;
  esbuild.transformSync(testRz11, { loader: "js" });
  console.log("Rz11 validation passed 100%!");
} catch (e) {
  console.error("Rz11 validation failed:", e.message);
  process.exit(1);
}

// 3. Build Rz12 with 40 QCM questions, Fullscreen, and Shuffled Options
const rz12Code = `var Rz12 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);
  const [activeMatterState, setActiveMatterState] = y.useState("solid");
  const [isSpeaking, setIsSpeaking] = y.useState(!1);
  const [soundEnabled, setSoundEnabled] = y.useState(!0);
  const [isFullScreen, setIsFullScreen] = y.useState(!0);

  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
      };
    }
  }, [r, n]);

  const quizQuestions = ${JSON.stringify(l12Questions)};

  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const shuffleQuiz = (list) => list.map(q => ({
    ...q,
    options: shuffleArray(q.options)
  }));

  const [shuffledQuestions, setShuffledQuestions] = y.useState(() => shuffleQuiz(quizQuestions));

  const score = Object.keys(userAnswers).reduce((acc, qIdx) => {
    const q = (shuffledQuestions || quizQuestions)[qIdx];
    if (q && q.options[userAnswers[qIdx]] && q.options[userAnswers[qIdx]].isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const playTone = (freq = 523.25, type = "sine", duration = 0.2) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const toggleSpeech = (textToRead) => {
    if (!window.speechSynthesis) {
      s && s("ឧបករណ៍របស់អ្នកមិនគាំទ្រសំឡេងអានស្វ័យប្រវត្តិទេ");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(!1);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(textToRead);
      utter.lang = "km-KH";
      utter.rate = 0.9;
      utter.onend = () => setIsSpeaking(!1);
      utter.onerror = () => setIsSpeaking(!1);
      window.speechSynthesis.speak(utter);
      setIsSpeaking(!0);
      s && s("កំពុងអានខ្លឹមសារមេរៀន...");
    } catch (err) {
      setIsSpeaking(!1);
    }
  };

  const matterStates = {
    solid: {
      name: "ភាពរឹង (Solid)",
      icon: "🧊",
      desc: "មានរូបរាងច្បាស់លាស់ និងមាឌច្បាស់លាស់។ ភាគល្អិតតូចៗផ្ដុំគ្នាជិតស្និទ្ធបំផុត។",
      examples: "ទឹកកក, ថ្ម, ដែក, សៀវភៅ...",
      color: "from-blue-600 to-cyan-500"
    },
    liquid: {
      name: "ភាពរាវ (Liquid)",
      icon: "💧",
      desc: "មានមាឌច្បាស់លាស់ ប៉ុន្តែរូបរាងប្រែប្រួលតាមភាជន៍ដាក់។ ភាគល្អិតអាចរំកិលចុះឡើងបាន។",
      examples: "ទឹក, ប្រេង, ទឹកដោះគោ, ទឹកអាស៊ីត...",
      color: "from-blue-400 to-indigo-500"
    },
    gas: {
      name: "ឧស្ម័ន (Gas)",
      icon: "☁️",
      desc: "មិនមានរូបរាង និងមាឌច្បាស់លាស់ឡើយ។ ភាគល្អិតនៅដាច់ពីគ្នាឆ្ងាយ និងធ្វើចលនាលឿន។",
      examples: "ខ្យល់, ចំហាយទឹក, អុកស៊ីសែន...",
      color: "from-slate-400 to-slate-200"
    }
  };

  return e.jsx("div", {
    "data-modal-open": "true",
    onClick: (ev) => { if (ev.target === ev.currentTarget) t(); },
    className: isFullScreen ?
      "fixed inset-0 z-[100] w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-['Battambang'] p-0" :
      "fixed inset-0 z-[100] overflow-y-auto bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300 font-['Battambang']",
    children: e.jsxs("div", {
      onClick: (ev) => ev.stopPropagation(),
      className: isFullScreen ?
        "relative w-full h-full min-h-screen sm:min-h-screen flex flex-col overflow-hidden rounded-none border-0 bg-white" :
        "relative w-full max-w-5xl h-full sm:h-[92vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300",
      children: [
        e.jsxs("div", {
          className: "bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-4 sm:p-5 text-white shrink-0 relative overflow-hidden shadow-md",
          children: [
            e.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" }),
            e.jsxs("div", {
              className: "relative flex items-center justify-between",
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-3 sm:gap-4",
                  children: [
                    e.jsx("div", { className: "w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-lg border border-white/30", children: "🔬" }),
                    e.jsxs("div", {
                      children: [
                        e.jsx("h2", { className: "text-lg sm:text-2xl font-bold font-moul leading-tight", children: "មេរៀនទី ១២ ៖ ការប្រែប្រួលរូបធាតុ" }),
                        e.jsx("p", { className: "text-blue-100 text-[10px] sm:text-xs font-bold opacity-90", children: "ជំពូកទី ៤ • វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ • ៤០ សំណួរ QCM" })
                      ]
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    e.jsxs("button", {
                      type: "button",
                      onClick: () => toggleSpeech("មេរៀនទី ១២ ៖ ការប្រែប្រួលរូបធាតុ។ វត្ថុទាំងឡាយទោះជាភវៈមានជីវិត ឬគ្មានជីវិតក្តី មើលឃើញឬមិនអាចមើលឃើញក្តី សុទ្ធតែផ្សំឡើងពីរូបធាតុទាំងអស់។ រូបធាតុទាំងអស់ផ្សំឡើងពីភាគល្អិតតូចៗ ហៅថា ធូលី។ រូបធាតុ គឺជារបស់ទាំងឡាយដែលមានម៉ាស មានមាឌ និងទម្ងន់តាំងក្នុងលំហ។"),
                      className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border \${isSpeaking ? "bg-amber-400 text-slate-900 border-amber-500 animate-pulse" : "bg-white/20 text-white border-white/30 hover:bg-white/30"}\`,
                      children: [
                        e.jsx("span", { children: isSpeaking ? "⏹️" : "🔊" }),
                        e.jsx("span", { className: "hidden md:inline", children: isSpeaking ? "ឈប់អាន" : "ស្តាប់ការអាន" })
                      ]
                    }),
                    e.jsx("button", {
                      type: "button",
                      onClick: () => setSoundEnabled(!soundEnabled),
                      className: \`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer \${soundEnabled ? "bg-white/20 text-white" : "bg-slate-800/40 text-slate-300"}\`,
                      title: soundEnabled ? "បិទសំឡេង" : "បើកសំឡេង",
                      children: e.jsx("i", { className: \`fa-solid \${soundEnabled ? "fa-volume-high" : "fa-volume-xmark"}\` })
                    }),
                    e.jsxs("button", {
                      type: "button",
                      onClick: () => setIsFullScreen(!isFullScreen),
                      title: isFullScreen ? "បង្រួមបង្អួច" : "ពង្រីកពេញអេក្រង់",
                      className: "px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 flex items-center gap-1.5 text-white text-xs font-bold transition cursor-pointer border border-white/30",
                      children: [
                        e.jsx("span", { children: isFullScreen ? "⛶" : "🗖" }),
                        e.jsx("span", { className: "hidden sm:inline", children: isFullScreen ? "បង្រួម" : "ពេញអេក្រង់" })
                      ]
                    }),
                    e.jsx("button", {
                      type: "button",
                      onClick: t,
                      className: "w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer",
                      title: "បិទផ្ទាំង",
                      children: e.jsx("i", { className: "fa-solid fa-xmark" })
                    })
                  ]
                })
              ]
            }),
            e.jsx("div", {
              className: "flex items-center gap-1 mt-5 overflow-x-auto no-scrollbar pb-1",
              children: [
                { id: "tab-hero", icon: "🏠", label: "ទិដ្ឋភាពទូទៅ" },
                { id: "tab-lesson", icon: "📖", label: "ខ្លឹមសារមេរៀន" },
                { id: "tab-states", icon: "🧊", label: "ភាពរូបធាតុ" },
                { id: "tab-changes", icon: "🔄", label: "ការប្រែប្រួល" },
                { id: "tab-quiz", icon: "📝", label: "៤០ សំណួរ QCM" }
              ].map(tab => e.jsxs("button", {
                type: "button",
                key: tab.id,
                onClick: () => {
                  i(tab.id);
                  playTone(440, "sine", 0.08);
                },
                className: \`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer \${n === tab.id ? "bg-white text-blue-800 shadow-md" : "text-white hover:bg-white/10"}\`,
                children: [e.jsx("span", { children: tab.icon }), e.jsx("span", { children: tab.label })]
              }, tab.id))
            })
          ]
        }),

        e.jsx("div", {
          className: "flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8 no-scrollbar",
          children: n === "tab-hero" ? e.jsxs("div", {
            className: "max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
            children: [
              e.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
                children: [
                  e.jsxs("div", {
                    className: "space-y-6",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider", children: "សេចក្តីផ្ដើម" }),
                          e.jsx("h1", { className: "text-3xl sm:text-4xl font-bold text-slate-900 leading-tight font-moul", children: "តើអ្វីទៅជារូបធាតុ?" }),
                          e.jsx("p", { className: "text-slate-600 leading-relaxed text-sm sm:text-base", children: "គ្រប់វត្ថុទាំងអស់ដែលនៅជុំវិញខ្លួនយើង មិនថាមានជីវិត ឬគ្មានជីវិត មើលឃើញ ឬមើលមិនឃើញ សុទ្ធតែផ្សំឡើងពីរូបធាតុទាំងអស់។ រូបធាតុជារបស់ដែលមានម៉ាស មាឌ និងទម្ងន់។" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                          e.jsxs("button", { type: "button", onClick: () => i("tab-lesson"), className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer", children: [e.jsx("i", { className: "fa-solid fa-book-open" }), " ចាប់ផ្ដើមរៀន"] }),
                          e.jsxs("button", { type: "button", onClick: () => i("tab-quiz"), className: "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer", children: [e.jsx("i", { className: "fa-solid fa-clipboard-question" }), " ធ្វើតេស្ត ៤០ QCM"] })
                        ]
                      })
                    ]
                  }),
                  e.jsx("div", {
                    className: "relative",
                    children: e.jsx("img", { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800", alt: "Science", className: "w-full h-auto rounded-3xl shadow-2xl border-4 border-white" })
                  })
                ]
              }),
              e.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                children: [{ icon: "🧊", title: "រឹង (Solid)", desc: "ដូចជា ទឹកកក ថ្ម ដែក សៀវភៅ" }, { icon: "💧", title: "រាវ (Liquid)", desc: "ដូចជា ទឹក ប្រេង ទឹកដោះគោ" }, { icon: "☁️", title: "ឧស្ម័ន (Gas)", desc: "ដូចជា ខ្យល់ ចំហាយទឹក" }].map((item, idx) => e.jsxs("div", {
                  key: idx,
                  className: "p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center space-y-2 hover:shadow-md transition-all",
                  children: [
                    e.jsx("div", { className: "text-4xl mb-2", children: item.icon }),
                    e.jsx("h4", { className: "font-bold text-slate-900 font-moul text-sm", children: item.title }),
                    e.jsx("p", { className: "text-xs text-slate-500", children: item.desc })
                  ]
                }))
              })
            ]
          }) : n === "tab-lesson" ? e.jsxs("div", {
            className: "max-w-4xl mx-auto space-y-8",
            children: [
              e.jsxs("section", {
                className: "space-y-4",
                children: [
                  e.jsxs("div", { className: "flex items-center gap-3 border-b-2 border-blue-500 pb-2", children: [e.jsx("span", { className: "text-2xl", children: "១." }), e.jsx("h3", { className: "text-xl font-bold text-slate-900 font-moul", children: "រូបធាតុ (Matter)" })] }),
                  e.jsxs("div", {
                    className: "bg-blue-50 p-6 rounded-3xl border border-blue-100 leading-loose text-slate-800 space-y-3",
                    children: [
                      e.jsx("p", { children: "វត្ថុទាំងឡាយទោះជាភវៈមានជីវិត ឬគ្មានជីវិតក្តី មើលឃើញឬមិនអាចមើលឃើញក្តី ស្ទាបកាន់បាន ឬមិនអាចស្ទាបឬកាន់បានក្តី សុទ្ធតែផ្សំឡើងពីរូបធាតុទាំងអស់។" }),
                      e.jsxs("p", { className: "font-bold text-blue-900 bg-white/70 p-3 rounded-2xl border border-blue-200", children: [e.jsx("span", { className: "bg-blue-200 px-2 py-1 rounded-lg mr-2", children: "💡" }), "រូបធាតុទាំងអស់ផ្សំឡើងពីភាគល្អិតតូចៗ ហៅថា «ធូលី»។"] }),
                      e.jsx("p", { children: "រូបធាតុ គឺជារបស់ទាំងឡាយដែលមានម៉ាស មានមាឌ និងទម្ងន់តាំងក្នុងលំហ។" })
                    ]
                  })
                ]
              }),
              e.jsxs("section", {
                className: "space-y-4",
                children: [
                  e.jsxs("div", { className: "flex items-center gap-3 border-b-2 border-indigo-500 pb-2", children: [e.jsx("span", { className: "text-2xl", children: "២." }), e.jsx("h3", { className: "text-xl font-bold text-slate-900 font-moul", children: "លក្ខណៈរូបនៃរូបធាតុ" })] }),
                  e.jsx("div", {
                    className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
                    children: ["ភាពរូប (រឹង រាវ ឧស្ម័ន)", "ពណ៌ (Color)", "រាង (Shape)", "ទំហំ (Size)", "រសជាតិ (Taste)", "ក្លិន (Odor)"].map((l, idx) => e.jsx("div", { key: idx, className: "p-4 bg-white rounded-2xl border border-slate-200 text-center font-bold text-slate-700 text-sm shadow-xs", children: l }))
                  })
                ]
              }),
              e.jsxs("section", {
                className: "space-y-4",
                children: [
                  e.jsxs("div", { className: "flex items-center gap-3 border-b-2 border-emerald-500 pb-2", children: [e.jsx("span", { className: "text-2xl", children: "៣." }), e.jsx("h3", { className: "text-xl font-bold text-slate-900 font-moul", children: "ការប្រែប្រួលនៃរូបធាតុ" })] }),
                  e.jsxs("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                    children: [
                      e.jsxs("div", {
                        className: "p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-2",
                        children: [
                          e.jsx("h4", { className: "font-bold text-emerald-800 font-moul", children: "ក. ការប្រែប្រួលលក្ខណៈរូប" }),
                          e.jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: "នៅពេលរូបធាតុមួយមានការប្រែប្រួលភាពរូប (រឹង រាវ ឧស្ម័ន) ហើយនៅតែរក្សាធាតុផ្សំ ឬធាតុដើមរបស់វាដដែល។" }),
                          e.jsx("div", { className: "text-xs font-bold text-emerald-800 bg-emerald-100 p-2.5 rounded-xl", children: "ឧទាហរណ៍៖ ដុំទឹកកករលាយជាទឹក, ទឹកពុះក្លាយជាចំហាយទឹក" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "p-6 bg-rose-50 rounded-3xl border border-rose-100 space-y-2",
                        children: [
                          e.jsx("h4", { className: "font-bold text-rose-800 font-moul", children: "ខ. ការប្រែប្រួលលក្ខណៈគីមី" }),
                          e.jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: "នៅពេលរូបធាតុទាំងឡាយប្រែប្រួលលក្ខណៈដើមរបស់វាទាំងស្រុង ដូចជា ទ្រង់ទ្រាយ ពណ៌ ក្លិន រសជាតិ...។" }),
                          e.jsx("div", { className: "text-xs font-bold text-rose-800 bg-rose-100 p-2.5 rounded-xl", children: "ឧទាហរណ៍៖ ការដុតក្រដាសក្លាយជាផេះ, ដែកគោលច្រែះ" })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }) : n === "tab-states" ? e.jsxs("div", {
            className: "max-w-4xl mx-auto space-y-8",
            children: [
              e.jsx("div", {
                className: "flex justify-center gap-3",
                children: Object.keys(matterStates).map(key => e.jsxs("button", {
                  key,
                  type: "button",
                  onClick: () => setActiveMatterState(key),
                  className: \`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer \${activeMatterState === key ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"}\`,
                  children: [e.jsx("span", { children: matterStates[key].icon }), e.jsx("span", { children: matterStates[key].name })]
                }))
              }),
              e.jsxs("div", {
                className: "bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-4",
                    children: [
                      e.jsx("div", { className: "text-5xl", children: matterStates[activeMatterState].icon }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("h3", { className: "text-2xl font-bold font-moul text-slate-900", children: matterStates[activeMatterState].name }),
                          e.jsx("p", { className: "text-sm text-slate-500", children: matterStates[activeMatterState].desc })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "p-4 bg-slate-50 rounded-2xl border border-slate-100",
                    children: [
                      e.jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1", children: "ឧទាហរណ៍ជាក់ស្ដែង" }),
                      e.jsx("p", { className: "text-base font-bold text-slate-700", children: matterStates[activeMatterState].examples })
                    ]
                  })
                ]
              })
            ]
          }) : n === "tab-changes" ? e.jsxs("div", {
            className: "max-w-4xl mx-auto space-y-8",
            children: [
              e.jsxs("div", {
                className: "bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200 space-y-4",
                children: [
                  e.jsx("h3", { className: "text-xl font-bold text-amber-900 font-moul", children: "កត្តាដែលធ្វើឱ្យប្រែប្រួលរូបធាតុ" }),
                  e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                    children: [
                      e.jsxs("div", {
                        className: "bg-white p-5 rounded-2xl border border-amber-100 space-y-2 shadow-xs",
                        children: [
                          e.jsx("div", { className: "text-3xl", children: "🔥" }),
                          e.jsx("h4", { className: "font-bold text-slate-800 font-moul text-sm", children: "១. កម្ដៅ" }),
                          e.jsx("p", { className: "text-xs text-slate-600", children: "អង្ករដាំក្លាយជាបាយ, ស្ករកម្ដៅក្លាយជាចត់/ច្នាង, សាច់ត្រីយកទៅស្ងោរប្រែពណ៌ក្លិនរសជាតិ" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "bg-white p-5 rounded-2xl border border-amber-100 space-y-2 shadow-xs",
                        children: [
                          e.jsx("div", { className: "text-3xl", children: "🦠" }),
                          e.jsx("h4", { className: "font-bold text-slate-800 font-moul text-sm", children: "២. បាក់តេរី" }),
                          e.jsx("p", { className: "text-xs text-slate-600", children: "បាយដំណើបលាយមេក្លាយជាត្រប៉ែ, ទឹកដោះគោទុកចោលក្លាយជាជូរផ្អូម, ផ្អក ប្រហុក" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "bg-white p-5 rounded-2xl border border-amber-100 space-y-2 shadow-xs",
                        children: [
                          e.jsx("div", { className: "text-3xl", children: "🌧️" }),
                          e.jsx("h4", { className: "font-bold text-slate-800 font-moul text-sm", children: "៣. សារធាតុផ្សេងៗ" }),
                          e.jsx("p", { className: "text-xs text-slate-600", children: "ខ្យល់ធ្វើឱ្យដែកច្រែះ, ទឹកធ្វើឱ្យឈើពុកផុយ, ទឹកភ្លៀងធ្វើឱ្យថ្មសឹកសេចរិល" })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }) : n === "tab-quiz" ? isFinished ? e.jsxs("div", {
            className: "max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-500",
            children: [
              e.jsxs("div", {
                className: "relative inline-block",
                children: [
                  e.jsx("div", { className: "absolute -inset-4 bg-blue-100 rounded-full blur-xl opacity-70" }),
                  e.jsx("div", { className: "relative text-8xl mb-4", children: score >= 35 ? "🏆" : score >= 28 ? "🥇" : score >= 20 ? "🥈" : "🥉" })
                ]
              }),
              e.jsxs("div", {
                className: "space-y-2",
                children: [
                  e.jsx("h2", { className: "text-3xl font-bold font-moul text-slate-900", children: "អបអរសាទរ!" }),
                  e.jsxs("p", { className: "text-slate-600 text-base", children: ["អ្នកបានបញ្ចប់ការធ្វើតេស្តមេរៀនទី ១២ ដោយទទួលបានពិន្ទុ ", e.jsx("span", { className: "font-bold text-blue-600 text-3xl", children: score }), " ក្នុងចំណោម ", e.jsx("span", { className: "font-bold text-2xl", children: (shuffledQuestions || quizQuestions).length }), " សំណួរ"] }),
                  e.jsx("div", {
                    className: "w-full max-w-sm mx-auto h-3.5 bg-slate-100 rounded-full mt-4 overflow-hidden border border-slate-200",
                    children: e.jsx("div", { className: "h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700", style: { width: \`\${(score / (shuffledQuestions || quizQuestions).length) * 100}%\` } })
                  }),
                  e.jsx("p", { className: "text-xs font-bold text-slate-400 mt-1", children: \`អត្រាជោគជ័យ ៖ \${Math.round((score / (shuffledQuestions || quizQuestions).length) * 100)}%\` })
                ]
              }),
              e.jsxs("div", {
                className: "flex flex-wrap justify-center gap-4 pt-4",
                children: [
                  e.jsxs("button", {
                    type: "button",
                    onClick: () => {
                      setIsFinished(!1);
                      setUserAnswers({});
                      setCurrentQIndex(0);
                      setShuffledQuestions(shuffleQuiz(quizQuestions));
                      s && s("បានកំណត់តេស្តឡើងវិញ និងឆ្លាស់លំដាប់ចម្លើយ! 🔀");
                    },
                    className: "px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer",
                    children: [e.jsx("i", { className: "fa-solid fa-rotate-right" }), " ធ្វើតេស្តម្ដងទៀត (ឆ្លាស់ចម្លើយ)"]
                  }),
                  e.jsxs("button", {
                    type: "button",
                    onClick: t,
                    className: "px-8 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer",
                    children: [e.jsx("i", { className: "fa-solid fa-xmark" }), " ចាកចេញ"]
                  })
                ]
              })
            ]
          }) : e.jsxs("div", {
            className: "max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500",
            children: [
              // Exam Header & Question Palette
              e.jsxs("div", {
                className: "bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-3 shadow-xs",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between flex-wrap gap-2",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("h3", { className: "text-base font-bold text-slate-900 font-moul", children: "📝 តេស្តវាស់ស្ទង់សមត្ថភាព ៖ ៤០ សំណួរ QCM" }),
                          e.jsx("p", { className: "text-xs text-slate-500", children: "សំណួរពហុជ្រើសរើស ជំពូកទី ៤ • ការប្រែប្រួលរូបធាតុ" }),
                          e.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              setShuffledQuestions(shuffleQuiz(quizQuestions));
                              setUserAnswers({});
                              setCurrentQIndex(0);
                              s && s("បានឆ្លាស់លំដាប់ចម្លើយដោយជោគជ័យ! 🔀");
                            },
                            className: "mt-2 px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs",
                            title: "ចុចដើម្បីឆ្លាស់ជម្រើសចម្លើយដោយចៃដន្យ",
                            children: [
                              e.jsx("span", { children: "🔀" }),
                              e.jsx("span", { children: "ឆ្លាស់ចម្លើយ (Shuffle Options)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2 font-bold text-xs",
                        children: [
                          e.jsxs("span", { className: "px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200", children: ["សំណួរទី ", currentQIndex + 1, " / ៤០"] }),
                          e.jsxs("span", { className: "px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200", children: ["ពិន្ទុ ៖ ", score, " / ៤០"] })
                        ]
                      })
                    ]
                  }),

                  // Question Palette 1-40
                  e.jsx("div", {
                    className: "flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar",
                    children: (shuffledQuestions || quizQuestions).map((q, idx) => {
                      const isAnswered = userAnswers[idx] !== undefined;
                      const isCorrect = isAnswered && q.options[userAnswers[idx]]?.isCorrect;
                      let btnStyle = "bg-slate-100 text-slate-600 border-slate-200";
                      if (currentQIndex === idx) btnStyle = "bg-blue-600 text-white font-extrabold ring-2 ring-blue-400";
                      else if (isAnswered) {
                        btnStyle = isCorrect ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600";
                      }
                      return e.jsx("button", {
                        key: idx,
                        type: "button",
                        onClick: () => setCurrentQIndex(idx),
                        className: \`w-7 h-7 shrink-0 rounded-lg text-[11px] font-bold border transition cursor-pointer flex items-center justify-center \${btnStyle}\`,
                        children: idx + 1
                      });
                    })
                  })
                ]
              }),

              // Question Box
              (() => {
                const curQ = (shuffledQuestions || quizQuestions)[currentQIndex];
                const userChoice = userAnswers[currentQIndex];
                const isAnswered = userChoice !== undefined;
                return e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        e.jsxs("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ៤០"] }),
                        e.jsx("h3", { className: "text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-moul pt-1", children: curQ.question })
                      ]
                    }),

                    // Shuffled Options List
                    e.jsx("div", {
                      className: "space-y-3 pt-1",
                      children: curQ.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        let optStyle = "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200";
                        if (isAnswered) {
                          if (opt.isCorrect) {
                            optStyle = "bg-emerald-500 text-white border-emerald-600 shadow-md font-bold";
                          } else if (isSelected) {
                            optStyle = "bg-rose-500 text-white border-rose-600 shadow-md font-bold";
                          } else {
                            optStyle = "bg-slate-50 text-slate-400 border-slate-200 opacity-60";
                          }
                        }
                        const prefix = ["ក. ", "ខ. ", "គ. ", "ឃ. "][optIdx] || "";
                        return e.jsxs("button", {
                          key: optIdx,
                          type: "button",
                          onClick: () => {
                            if (isAnswered) return;
                            setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }));
                            if (opt.isCorrect) {
                              playTone(659.25, "sine", 0.25);
                              s && s("ចម្លើយត្រឹមត្រូវ! +50 XP ⭐");
                            } else {
                              playTone(220, "sawtooth", 0.3);
                            }
                          },
                          disabled: isAnswered,
                          className: \`w-full text-left p-4 rounded-2xl border-2 text-sm transition-all flex items-center justify-between cursor-pointer \${optStyle}\`,
                          children: [
                            e.jsxs("span", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "font-bold shrink-0", children: prefix }),
                                opt.text
                              ]
                            }),
                            isAnswered && (opt.isCorrect ? e.jsx("span", { className: "text-base font-bold", children: "✓" }) : isSelected ? e.jsx("span", { className: "text-base font-bold", children: "✕" }) : null)
                          ]
                        });
                      })
                    }),

                    // Explanation Box
                    isAnswered && e.jsxs("div", {
                      className: \`p-4 rounded-2xl text-xs space-y-1.5 animate-in fade-in duration-200 \${curQ.options[userChoice]?.isCorrect ? "bg-emerald-50 border border-emerald-200 text-emerald-900" : "bg-rose-50 border border-rose-200 text-rose-900"}\`,
                      children: [
                        e.jsx("div", { className: "font-bold flex items-center gap-1.5 text-sm", children: curQ.options[userChoice]?.isCorrect ? "🎉 ពូកែណាស់! ចម្លើយត្រឹមត្រូវ" : "⚠️ មិនទាន់ត្រឹមត្រូវទេ" }),
                        e.jsx("p", { className: "leading-relaxed", children: curQ.explanation })
                      ]
                    }),

                    // Navigation Controls
                    e.jsxs("div", {
                      className: "flex items-center justify-between pt-3 border-t border-slate-100",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => setCurrentQIndex(prev => Math.max(0, prev - 1)),
                          disabled: currentQIndex === 0,
                          className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs transition cursor-pointer",
                          children: "← សំណួរមុន"
                        }),
                        currentQIndex < (shuffledQuestions || quizQuestions).length - 1 ?
                          e.jsx("button", {
                            type: "button",
                            onClick: () => setCurrentQIndex(prev => Math.min((shuffledQuestions || quizQuestions).length - 1, prev + 1)),
                            className: "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer",
                            children: "សំណួរបន្ទាប់ →"
                          }) :
                          e.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              setIsFinished(!0);
                              playTone(880, "triangle", 0.5);
                              s && s(\`បញ្ចប់តេស្ត! អ្នកឆ្លើយត្រូវ \${score} / ៤០ សំណួរ\`);
                            },
                            className: "px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5",
                            children: [
                              e.jsx("span", { children: "🏁" }),
                              e.jsx("span", { children: "មើលលទ្ធផលពិន្ទុ" })
                            ]
                          })
                      ]
                    })
                  ]
                });
              })()
            ]
          }) : null
        })
      ]
    })
  });
};
`;

fs.writeFileSync('scripts/rz12_component_code.js', rz12Code, 'utf8');
console.log("Written enhanced scripts/rz12_component_code.js with 40 questions, Fullscreen, and Shuffled Options!");

// Validate Rz12
try {
  const testRz12 = `const y = { useState: () => [null, () => {}], useEffect: () => {} }; const e = { jsx: () => {}, jsxs: () => {} }; ${rz12Code}`;
  esbuild.transformSync(testRz12, { loader: "js" });
  console.log("Rz12 validation passed 100%!");
} catch (e) {
  console.error("Rz12 validation failed:", e.message);
  process.exit(1);
}

console.log("ALL BUILDS SUCCESSFUL!");
