import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

console.log("--- Generating Rz5 component code for Science Lesson 5 (Natural Resources) ---");

// Read questions
const questions = JSON.parse(fs.readFileSync('scripts/lesson5_questions.json', 'utf8'));

const code = `var Rz5 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [l, o] = y.useState(!1);
  const [c, d] = y.useState(0);
  const [u, h] = y.useState(!1);

  // Custom states for interactive tabs
  const [resCategory, setResCategory] = y.useState("renewable"); // renewable vs non_renewable
  const [khmerResource, setKhmerResource] = y.useState("forest"); // forest, water, soil, minerals, wildlife
  const [threatTab, setThreatTab] = y.useState("overuse"); // overuse, population, pollution, tech
  const [actionTab, setActionTab] = y.useState("saving"); // saving, 3r, conservation, clean_energy, law

  // Game 1 state (Clean Energy & Resource Sorter)
  const [game1State, setGame1State] = y.useState({
    score: 0,
    items: [
      { id: 1, name: "ពន្លឺព្រះអាទិត្យ", type: "renewable", icon: "☀️" },
      { id: 2, name: "ប្រេងកាត", type: "non_renewable", icon: "🛢️" },
      { id: 3, name: "ខ្យល់ធម្មជាតិ", type: "renewable", icon: "💨" },
      { id: 4, name: "ធ្យូងថ្ម", type: "non_renewable", icon: "🪨" },
      { id: 5, name: "ព្រៃឈើស្កឹមស្កៃ", type: "renewable", icon: "🌲" },
      { id: 6, name: "រ៉ែមាស & ដែក", type: "non_renewable", icon: "💎" }
    ],
    placed: {},
    completed: !1
  });

  // Game 2 state (Sustainable Actions Matching)
  const [game2Score, setGame2Score] = y.useState(0);
  const [game2Answers, setGame2Answers] = y.useState({});

  // Audio tone synthesizer
  const playTone = (freq, duration = 0.15) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const playSuccessSound = () => {
    playTone(523.25, 0.12);
    setTimeout(() => playTone(659.25, 0.12), 100);
    setTimeout(() => playTone(783.99, 0.25), 200);
  };

  const playErrorSound = () => {
    playTone(220, 0.15);
    setTimeout(() => playTone(180, 0.25), 120);
  };

  // Quiz Engine State
  const quizQuestions = ${JSON.stringify(questions)};
  const [Y, U] = y.useState(0);
  const [q, ae] = y.useState({});
  const [re, me] = y.useState({});

  const isCurrentAnswered = q[Y] !== undefined;

  const handleSelectOption = (qIdx, optIdx) => {
    if (q[qIdx] !== undefined) return;
    const isCorr = quizQuestions[qIdx].opts[optIdx].c;
    ae(prev => ({ ...prev, [qIdx]: optIdx }));
    if (isCorr) {
      playSuccessSound();
      d(prev => prev + 1);
    } else {
      playErrorSound();
    }
  };

  const handleNextQuestion = () => {
    if (Y < quizQuestions.length - 1) {
      U(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (Y > 0) {
      U(prev => prev - 1);
    }
  };

  const handleResetQuiz = () => {
    U(0);
    ae({});
    d(0);
    me({});
  };

  const toggleHint = (qIdx) => {
    me(prev => ({ ...prev, [qIdx]: !prev[qIdx] }));
  };

  const tabsList = [
    { id: "tab-hero", label: "ទិដ្ឋភាពទូទៅ", icon: "📌" },
    { id: "tab-def", label: "១. និយមន័យ & ប្រភេទ", icon: "💎" },
    { id: "tab-cambodia", label: "២. ធនធានកម្ពុជា", icon: "🇰🇭" },
    { id: "tab-importance", label: "៣. សារៈសំខាន់", icon: "⭐" },
    { id: "tab-threats", label: "៤. បញ្ហាប្រឈម", icon: "⚠️" },
    { id: "tab-sustainability", label: "៥. និរន្តរភាព", icon: "🌱" },
    { id: "tab-lab", label: "៦. ល្បែងអន្តរកម្ម", icon: "🎮" },
    { id: "tab-quiz", label: "៧. កម្រង ៤០ QCM", icon: "❓", special: !0 }
  ];

  return e.jsx("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300 font-['Battambang']",
    children: e.jsxs("div", {
      className: "bg-white w-full max-w-5xl h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-500/30 relative",
      children: [
        // Modal Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-md border-b border-emerald-700/50",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("div", {
                  className: "w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-inner",
                  children: "💎"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("h2", { className: "text-base sm:text-lg font-bold text-white font-['Battambang'] leading-tight", children: "មេរៀនទី ៥ ៖ ធនធានធម្មជាតិ (Natural Resources)" }),
                    e.jsx("p", { className: "text-[11px] text-emerald-200 font-medium", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ | ជំពូកទី ២ ៖ បរិស្ថាន (សៀវភៅពុម្ពទំព័រ ២៨ - ៣២)" })
                  ]
                })
              ]
            }),
            e.jsx("button", {
              onClick: t,
              className: "w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-all active:scale-95 text-lg border border-white/20",
              children: "✕"
            })
          ]
        }),

        // Navigation Tabs Bar
        e.jsx("div", {
          className: "bg-slate-100 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0",
          children: tabsList.map(tab => e.jsxs("button", {
            onClick: () => i(tab.id),
            className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border \${n === tab.id ? (tab.special ? "bg-amber-500 text-white border-amber-600 shadow-sm" : "bg-emerald-700 text-white border-emerald-800 shadow-sm") : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold"}\`,
            children: [
              e.jsx("span", { children: tab.icon }),
              e.jsx("span", { children: tab.label })
            ]
          }))
        }),

        // Modal Content Body
        e.jsxs("div", {
          className: "flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-6",
          children: [
            // TAB 1: HERO OVERVIEW
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "relative rounded-3xl overflow-hidden p-6 sm:p-8 text-white bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900 shadow-lg border border-emerald-700/50",
                  children: [
                    e.jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" }),
                    e.jsxs("div", {
                      className: "relative z-10 max-w-2xl space-y-3",
                      children: [
                        e.jsx("span", { className: "px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md inline-block", children: "📖 មេរៀនទី ៥ នៃជំពូកទី ២" }),
                        e.jsx("h1", { className: "text-2xl sm:text-3xl font-black font-['Battambang'] leading-snug", children: "ធនធានធម្មជាតិ (Natural Resources)" }),
                        e.jsx("p", { className: "text-sm text-emerald-100 leading-relaxed", children: "ធនធានធម្មជាតិជាទ្រព្យសម្បត្តិមហាសាលដែលកើតឡើងដោយឯកឯងពីធម្មជាតិ។ សិក្សាអំពីធនធានកកើតឡើងវិញ ធនធានមិនកកើតឡើងវិញ ធនធានសម្បូរបែបនៅកម្ពុជា និងការគ្រប់គ្រងប្រកបដោយនិរន្តរភាព។" }),
                        e.jsxs("div", {
                          className: "pt-2 flex flex-wrap gap-2",
                          children: [
                            e.jsx("button", { onClick: () => i("tab-def"), className: "px-4 py-2 bg-white text-emerald-900 font-bold rounded-xl text-xs shadow hover:bg-emerald-50 transition-all", children: "ចាប់ផ្តើមរៀន ➔" }),
                            e.jsx("button", { onClick: () => i("tab-quiz"), className: "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow transition-all", children: "ធ្វើតេស្ត ៤០ QCM ❓" })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Key Objectives Grid
                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg", children: "💎" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "១. ការបែងចែកប្រភេទ" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "យល់ដឹងពីធនធានកកើតឡើងវិញ និងធនធានមិនកកើតឡើងវិញ។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-teal-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-lg", children: "🇰🇭" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "២. ធនធាននៅកម្ពុជា" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ស្គាល់ធនធានព្រៃឈើ ទឹក ដី រ៉ែ និងសត្វព្រៃដ៏សម្បូរបែប។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-lg", children: "⚠️" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "៣. បញ្ហាប្រឈម" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "យល់ដឹងពីមូលហេតុនៃការបាត់បង់ និងការបំផ្លិចបំផ្លាញធនធាន។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg", children: "🌱" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "៤. និរន្តរភាព (3R)" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "វិធានការអភិរក្ស ការប្រើថាមពលស្អាត និងការគោរពច្បាប់។" })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 2: DEFINITION & CLASSIFICATION
            n === "tab-def" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-emerald-800 font-bold text-base", children: [e.jsx("span", { children: "💎" }), "ផ្នែកទី ១ ៖ និយមន័យ និងការបែងចែកធនធានធម្មជាតិ"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/60", children: "ធនធានធម្មជាតិ គឺជាអ្វីៗទាំងអស់ដែលកើតឡើងដោយឯកឯងពីធម្មជាតិ ហើយមនុស្សអាចទាញយកមកប្រើប្រាស់ដើម្បីទ្រទ្រង់ជីវិត និងការរស់នៅប្រចាំថ្ងៃ។" })
                  ]
                }),

                // Selector Buttons
                e.jsxs("div", {
                  className: "flex gap-2",
                  children: [
                    e.jsxs("button", {
                      onClick: () => setResCategory("renewable"),
                      className: \`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-2 \${resCategory === "renewable" ? "bg-emerald-700 text-white border-emerald-800 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}\`,
                      children: [e.jsx("span", { children: "☀️" }), "១. ធនធានកកើតឡើងវិញ (Renewable)"]
                    }),
                    e.jsxs("button", {
                      onClick: () => setResCategory("non_renewable"),
                      className: \`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-2 \${resCategory === "non_renewable" ? "bg-amber-700 text-white border-amber-800 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}\`,
                      children: [e.jsx("span", { children: "🛢️" }), "២. ធនធានមិនកកើតឡើងវិញ (Non-renewable)"]
                    })
                  ]
                }),

                // Dynamic Card Content
                resCategory === "renewable" ? e.jsxs("div", {
                  className: "bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-4 animate-in fade-in duration-200",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-emerald-800 font-bold text-base", children: [e.jsx("span", { children: "🌿" }), "ធនធានធម្មជាតិកកើតឡើងវិញ (Renewable Resources)"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ជាធនធានដែលអាចជំនួស ឬកកើតឡើងវិញដោយធម្មជាតិក្នុងរយៈពេលសមស្រប ប្រសិនបើយើងប្រើប្រាស់ដោយចេះថែរក្សា មិនទាញយកហួសប្រមាណ។" }),
                    e.jsxs("div", {
                      className: "grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2",
                      children: [
                        e.jsxs("div", { className: "p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "💧" }), e.jsx("div", { className: "font-bold text-xs text-emerald-900", children: "ធនធានទឹក" }), e.jsx("div", { className: "text-[10px] text-emerald-700", children: "វដ្តទឹកធម្មជាតិ" })] }),
                        e.jsxs("div", { className: "p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "🌲" }), e.jsx("div", { className: "font-bold text-xs text-emerald-900", children: "ព្រៃឈើ & ដើមឈើ" }), e.jsx("div", { className: "text-[10px] text-emerald-700", children: "ដាំជំនួសឡើងវិញ" })] }),
                        e.jsxs("div", { className: "p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "☀️" }), e.jsx("div", { className: "font-bold text-xs text-emerald-900", children: "ពន្លឺព្រះអាទិត្យ" }), e.jsx("div", { className: "text-[10px] text-emerald-700", children: "គ្មានថ្ងៃរីងស្ងួត" })] }),
                        e.jsxs("div", { className: "p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "💨" }), e.jsx("div", { className: "font-bold text-xs text-emerald-900", children: "ខ្យល់អាកាស" }), e.jsx("div", { className: "text-[10px] text-emerald-700", children: "ចរន្តខ្យល់ធម្មជាតិ" })] }),
                        e.jsxs("div", { className: "p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "🐅" }), e.jsx("div", { className: "font-bold text-xs text-emerald-900", children: "សត្វព្រៃ" }), e.jsx("div", { className: "text-[10px] text-emerald-700", children: "ការបង្កើតកូនចៅ" })] }),
                        e.jsxs("div", { className: "p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "🌱" }), e.jsx("div", { className: "font-bold text-xs text-emerald-900", children: "ដីកសិកម្ម" }), e.jsx("div", { className: "text-[10px] text-emerald-700", children: "ការស្ដារជីជាតិ" })] })
                      ]
                    })
                  ]
                }) : e.jsxs("div", {
                  className: "bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-4 animate-in fade-in duration-200",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-amber-800 font-bold text-base", children: [e.jsx("span", { children: "🛢️" }), "ធនធានធម្មជាតិមិនកកើតឡើងវិញ (Non-renewable Resources)"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ជាធនធានដែលត្រូវចំណាយពេលរាប់លានឆ្នាំដើម្បីកកើត ហើយនៅពេលប្រើអស់គឺអស់រលីង មិនអាចជំនួសឡើងវិញបានឡើយ។" }),
                    e.jsxs("div", {
                      className: "grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2",
                      children: [
                        e.jsxs("div", { className: "p-3 bg-amber-50 rounded-xl border border-amber-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "🛢️" }), e.jsx("div", { className: "font-bold text-xs text-amber-900", children: "ប្រេងកាត" }), e.jsx("div", { className: "text-[10px] text-amber-700", children: "ឥន្ធនៈផូស៊ីល" })] }),
                        e.jsxs("div", { className: "p-3 bg-amber-50 rounded-xl border border-amber-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "🪨" }), e.jsx("div", { className: "font-bold text-xs text-amber-900", children: "ធ្យូងថ្ម" }), e.jsx("div", { className: "text-[10px] text-amber-700", children: "រ៉ែដុតបង្កើតកម្ដៅ" })] }),
                        e.jsxs("div", { className: "p-3 bg-amber-50 rounded-xl border border-amber-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "🔥" }), e.jsx("div", { className: "font-bold text-xs text-amber-900", children: "ឧស្ម័នធម្មជាតិ" }), e.jsx("div", { className: "text-[10px] text-amber-700", children: "ឧស្ម័នក្រោមបាតសមុទ្រ" })] }),
                        e.jsxs("div", { className: "p-3 bg-amber-50 rounded-xl border border-amber-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "💎" }), e.jsx("div", { className: "font-bold text-xs text-amber-900", children: "រ៉ែមាស & ត្បូង" }), e.jsx("div", { className: "text-[10px] text-amber-700", children: "លោហៈមានតម្លៃ" })] }),
                        e.jsxs("div", { className: "p-3 bg-amber-50 rounded-xl border border-amber-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "⚙️" }), e.jsx("div", { className: "font-bold text-xs text-amber-900", children: "រ៉ែដែក & ទង់ដែង" }), e.jsx("div", { className: "text-[10px] text-amber-700", children: "លោហៈសំណង់" })] }),
                        e.jsxs("div", { className: "p-3 bg-amber-50 rounded-xl border border-amber-100 text-center space-y-1", children: [e.jsx("div", { className: "text-2xl", children: "🧱" }), e.jsx("div", { className: "font-bold text-xs text-amber-900", children: "ថ្មកំបោរ" }), e.jsx("div", { className: "text-[10px] text-amber-700", children: "ផលិតស៊ីម៉ងត៍" })] })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 3: CAMBODIA'S RESOURCES
            n === "tab-cambodia" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-emerald-800 font-bold text-base", children: [e.jsx("span", { children: "🇰🇭" }), "ផ្នែកទី ២ ៖ ប្រភេទធនធានធម្មជាតិសំខាន់ៗនៅកម្ពុជា"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ប្រទេសកម្ពុជាសម្បូរទៅដោយធនធានធម្មជាតិយ៉ាងសម្បូរបែបដែលទ្រទ្រង់សេដ្ឋកិច្ច និងជីវភាពប្រជាជន។" })
                  ]
                }),

                // Resource Buttons
                e.jsx("div", {
                  className: "grid grid-cols-2 sm:grid-cols-5 gap-2",
                  children: [
                    { id: "forest", label: "ព្រៃឈើ", icon: "🌲" },
                    { id: "water", label: "ទឹក & ត្រី", icon: "🐟" },
                    { id: "soil", label: "ដីធ្លី", icon: "🌾" },
                    { id: "minerals", label: "រ៉ែ & ប្រេង", icon: "💎" },
                    { id: "wildlife", label: "សត្វព្រៃ", icon: "🐅" }
                  ].map(res => e.jsxs("button", {
                    onClick: () => setKhmerResource(res.id),
                    className: \`p-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1.5 \${khmerResource === res.id ? "bg-emerald-700 text-white border-emerald-800 shadow-md" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}\`,
                    children: [e.jsx("span", { className: "text-xl", children: res.icon }), e.jsx("span", { children: res.label })]
                  }))
                }),

                // Resource Content
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-4 animate-in fade-in duration-200",
                  children: [
                    khmerResource === "forest" && e.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        e.jsxs("h3", { className: "font-bold text-emerald-900 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "🌲" }), "១. ធនធានព្រៃឈើនៅកម្ពុជា"] }),
                        e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ផ្តល់ឈើប្រណិត ជម្រកសត្វព្រៃ ឱសថបុរាណ អនុផលព្រៃឈើ (ឃ្មុំ វល្លិ) និងជួយរក្សាលំនឹងបរិស្ថាន ស្រូបយកឧស្ម័នពុលកាបូនិច។" })
                      ]
                    }),
                    khmerResource === "water" && e.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        e.jsxs("h3", { className: "font-bold text-emerald-900 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "🐟" }), "២. ធនធានទឹក និងមច្ឆាជាតិ"] }),
                        e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ទន្លេមេគង្គ បឹងទន្លេសាប និងសមុទ្រ ផ្គត់ផ្គង់ទឹកសម្រាប់កសិកម្ម ផ្តល់ត្រីសាច់រាប់លានតោនក្នុងមួយឆ្នាំៗ និងជាផ្លូវដឹកជញ្ជូនផ្លូវទឹកដ៏សំខាន់។" })
                      ]
                    }),
                    khmerResource === "soil" && e.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        e.jsxs("h3", { className: "font-bold text-emerald-900 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "🌾" }), "៣. ធនធានដីធ្លី"] }),
                        e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ដីក្រហម (កំពង់ចាម ត្បូងឃ្មុំ រតនគិរី) ដីល្បាប់មាត់ស្ទឹងបឹង ដីខ្សាច់ និងដីឥដ្ឋ ស័ក្តិសមសម្រាប់ដំណាំស្រូវ កៅស៊ូ ម្រេច និងដំណាំហូបផ្លែ។" })
                      ]
                    }),
                    khmerResource === "minerals" && e.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        e.jsxs("h3", { className: "font-bold text-emerald-900 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "💎" }), "៤. ធនធានរ៉ែ និងថាមពល"] }),
                        e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ថ្មកំបោរ (កំពត) ថ្មសំណង់ ដែក ត្បូងមានតម្លៃ (ប៉ៃលិន) ប្រេងកាត និងឧស្ម័នធម្មជាតិក្នុងបាតសមុទ្រកម្ពុជា។" })
                      ]
                    }),
                    khmerResource === "wildlife" && e.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        e.jsxs("h3", { className: "font-bold text-emerald-900 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "🐅" }), "៥. ធនធានសត្វព្រៃ"] }),
                        e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "សត្វព្រៃកម្រជាច្រើនប្រភេទដូចជា ដំរីអាស៊ី គោព្រៃ (សត្វតំណាងជាតិ) ខ្លា រមាំង និងសត្វស្លាបទឹកកម្រនៅដែនជម្រកព្រែកទាល់ បឹងទន្លេសាប។" })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 4: IMPORTANCE
            n === "tab-importance" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-emerald-800 font-bold text-base", children: [e.jsx("span", { children: "⭐" }), "ផ្នែកទី ៣ ៖ សារៈសំខាន់នៃធនធានធម្មជាតិ"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ធនធានធម្មជាតិផ្តល់អត្ថប្រយោជន៍មហាសាលដល់ជីវិតរស់នៅ សេដ្ឋកិច្ច និងប្រព័ន្ធអេកូឡូស៊ី។" })
                  ]
                }),

                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "flex items-center gap-2 text-emerald-900 font-bold text-sm", children: [e.jsx("span", { className: "text-xl", children: "❤️" }), "១. ទ្រទ្រង់ជីវិតមនុស្ស និងសត្វ"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ផ្តល់ទឹកសម្រាប់ផឹក ចំណីអាហារ ឱសថព្យាបាលជំងឺ និងខ្យល់អុកស៊ីសែនស្អាតសម្រាប់ដកដង្ហើម។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-teal-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "flex items-center gap-2 text-teal-900 font-bold text-sm", children: [e.jsx("span", { className: "text-xl", children: "📈" }), "២. ទ្រទ្រង់សេដ្ឋកិច្ចជាតិ"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ជាប្រភពវត្ថុធាតុដើមសម្រាប់ឧស្សាហកម្ម កសិកម្ម ការសាងសង់ និងការនាំចេញទៅក្រៅប្រទេស។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "flex items-center gap-2 text-amber-900 font-bold text-sm", children: [e.jsx("span", { className: "text-xl", children: "🏕️" }), "៣. អភិវឌ្ឍន៍វិស័យទេសចរណ៍"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "តំបន់អេកូទេសចរណ៍ ឆ្នេរសមុទ្រ ទឹកជ្រោះ និងឧទ្យានជាតិទាក់ទាញភ្ញៀវទេសចរ បង្កើតការងារ និងចំណូល។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "flex items-center gap-2 text-emerald-900 font-bold text-sm", children: [e.jsx("span", { className: "text-xl", children: "🌍" }), "៤. រក្សាតុល្យភាពអេកូឡូស៊ី"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ការពារការហូរច្រោះដី ទប់ទល់នឹងខ្យល់ព្យុះ កាត់បន្ថយការឡើងកម្ដៅ និងបម្រែបម្រួលអាកាសធាតុ។" })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 5: THREATS & DELETION
            n === "tab-threats" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-amber-800 font-bold text-base", children: [e.jsx("span", { children: "⚠️" }), "ផ្នែកទី ៤ ៖ បញ្ហាប្រឈម និងការថយចុះនៃធនធានធម្មជាតិ"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "បច្ចុប្បន្ន ធនធានធម្មជាតិកំពុងរងការបំផ្លិចបំផ្លាញ និងថយចុះយ៉ាងឆាប់រហ័សដោយសារសកម្មភាពមនុស្ស។" })
                  ]
                }),

                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "font-bold text-amber-900 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "🪓" }), "១. ការទាញយកលើសកម្រិត"] }),
                        e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ការកាប់ឈើហួសកម្រិត ការនេសាទខុសច្បាប់ (ប្រើចរន្តអគ្គិសនី) និងការបរបាញ់សត្វព្រៃកម្រ។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "font-bold text-amber-900 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "👨‍👩‍👧‍👦" }), "២. កំណើនប្រជាជនយ៉ាងលឿន"] }),
                        e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "តម្រូវការដីធ្លីដើម្បីសាងសង់លំនៅឋាន រោងចក្រ និងពង្រីកផ្ទៃដីកសិកម្មទន្ទ្រានព្រៃ។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "font-bold text-amber-900 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "🏭" }), "៣. ការបំពុលបរិស្ថាន"] }),
                        e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ការបង្ហូរជាតិគីមីពុលចូលដីនិងទឹក ការបោះសំរាមប្លាស្ទិក បំផ្លាញគុណភាពធនធានធម្មជាតិ។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "font-bold text-amber-900 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "🚜" }), "៤. បច្ចេកវិទ្យាបំផ្លិចបំផ្លាញ"] }),
                        e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ការប្រើថ្នាំពុលកសិកម្ម ការឆក់ត្រី និងការប្រើគ្រឿងចក្រកាយដីរ៉ែគ្មានការគ្រប់គ្រង។" })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 6: SUSTAINABLE MANAGEMENT
            n === "tab-sustainability" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-emerald-800 font-bold text-base", children: [e.jsx("span", { children: "🌱" }), "ផ្នែកទី ៥ ៖ វិធានការគ្រប់គ្រង និងការប្រើប្រាស់ប្រកបដោយនិរន្តរភាព"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ដើម្បីធានាថាធនធានធម្មជាតិនៅតែមានសម្រាប់កូនចៅជំនាន់ក្រោយ យើងត្រូវអនុវត្តវិធានការសំខាន់ៗ ៥ យ៉ាង៖" })
                  ]
                }),

                e.jsxs("div", {
                  className: "space-y-3",
                  children: [
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "p-2 bg-emerald-100 text-emerald-800 rounded-lg text-lg", children: "💡" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "១. ប្រើប្រាស់ដោយសន្សំសំចៃ" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ប្រើប្រាស់ដោយមានប្រសិទ្ធភាពខ្ពស់ មិនខ្ជះខ្ជាយ ដូចជា ការបិទភ្លើង បិទទឹកពេលលែងប្រើប្រាស់។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "p-2 bg-emerald-100 text-emerald-800 rounded-lg text-lg", children: "♻️" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "២. អនុវត្តគោលការណ៍ 3R" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "Reduce (កាត់បន្ថយ), Reuse (ប្រើឡើងវិញ), និង Recycle (កែច្នៃកាកសំណល់ដែក ក្រដាស ប្លាស្ទិក)។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "p-2 bg-emerald-100 text-emerald-800 rounded-lg text-lg", children: "🏞️" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "៣. ការពារ និងអភិរក្សតំបន់ធម្មជាតិ" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "បង្កើតតំបន់ការពារទេសភាព ដែនជម្រកសត្វព្រៃ និងឧទ្យានជាតិអភិរក្សព្រៃឈើ។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "p-2 bg-emerald-100 text-emerald-800 rounded-lg text-lg", children: "☀️" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "៤. ប្រើប្រាស់ថាមពលកកើតឡើងវិញ" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ប្រើថាមពលពន្លឺព្រះអាទិត្យ ថាមពលខ្យល់ និងថាមពលវារីអគ្គិសនី ជំនួសធ្យូងថ្មនិងប្រេងកាត។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "p-2 bg-emerald-100 text-emerald-800 rounded-lg text-lg", children: "⚖️" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "៥. គោរពច្បាប់បរិស្ថានយ៉ាងតឹងរ៉ឹង" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ចូលរួមបង្ក្រាបបទល្មើសព្រៃឈើ ការនេសាទខុសច្បាប់ និងការទន្ទ្រានយកដីរដ្ឋ។" })] })] })
                  ]
                })
              ]
            }),

            // TAB 7: LAB / INTERACTIVE GAMES
            n === "tab-lab" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-emerald-800 font-bold text-base", children: [e.jsx("span", { children: "🎮" }), "ល្បែងអន្តរកម្មស្វែងយល់ពីធនធានធម្មជាតិ"] }),
                    e.jsx("p", { className: "text-xs text-slate-600", children: "ចូលរួមលេងល្បែងអន្តរកម្មដើម្បីសាកល្បងចំណេះដឹងរបស់អ្នកលើការបែងចែកប្រភេទធនធាន!" })
                  ]
                }),

                // GAME 1: RESOURCE SORTING GAME
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-4",
                  children: [
                    e.jsxs("div", { className: "flex items-center justify-between", children: [
                      e.jsxs("h3", { className: "font-bold text-xs text-emerald-900 flex items-center gap-1.5", children: [e.jsx("span", { children: "🎯" }), "ល្បែងទី ១ ៖ បែងចែកប្រភេទធនធានកកើតឡើងវិញ vs មិនកកើតឡើងវិញ"] }),
                      e.jsxs("span", { className: "text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full", children: ["ពិន្ទុ ៖ ", game1State.score, " / ៦"] })
                    ]}),

                    e.jsx("div", {
                      className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5",
                      children: game1State.items.map(item => {
                        const status = game1State.placed[item.id];
                        return e.jsxs("div", {
                          className: \`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all \${status === "correct" ? "bg-emerald-50 border-emerald-300 text-emerald-800" : status === "wrong" ? "bg-red-50 border-red-300 text-red-800" : "bg-slate-50 border-slate-200 text-slate-800"}\`,
                          children: [
                            e.jsx("span", { className: "text-2xl", children: item.icon }),
                            e.jsx("span", { className: "font-bold text-xs", children: item.name }),
                            !status ? e.jsxs("div", {
                              className: "flex gap-1 w-full mt-1",
                              children: [
                                e.jsx("button", {
                                  onClick: () => {
                                    if (item.type === "renewable") {
                                      playSuccessSound();
                                      setGame1State(prev => ({ ...prev, score: prev.score + 1, placed: { ...prev.placed, [item.id]: "correct" } }));
                                    } else {
                                      playErrorSound();
                                      setGame1State(prev => ({ ...prev, placed: { ...prev.placed, [item.id]: "wrong" } }));
                                    }
                                  },
                                  className: "flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold",
                                  children: "កកើតឡើងវិញ"
                                }),
                                e.jsx("button", {
                                  onClick: () => {
                                    if (item.type === "non_renewable") {
                                      playSuccessSound();
                                      setGame1State(prev => ({ ...prev, score: prev.score + 1, placed: { ...prev.placed, [item.id]: "correct" } }));
                                    } else {
                                      playErrorSound();
                                      setGame1State(prev => ({ ...prev, placed: { ...prev.placed, [item.id]: "wrong" } }));
                                    }
                                  },
                                  className: "flex-1 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold",
                                  children: "មិនកកើត"
                                })
                              ]
                            }) : e.jsx("span", { className: "text-[11px] font-bold mt-1", children: status === "correct" ? "✅ ត្រឹមត្រូវ!" : "❌ មិនត្រឹមត្រូវ!" })
                          ]
                        });
                      })
                    })
                  ]
                })
              ]
            }),

            // TAB 8: 40 QCM QUIZ ENGINE
            n === "tab-quiz" && e.jsx("div", {
              className: "space-y-6 animate-fadeIn font-['Battambang'] w-full",
              children: e.jsxs("div", {
                className: "bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm w-full",
                children: [
                  e.jsxs("div", {
                    className: "border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              e.jsx("span", { className: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "តេស្តវាស់ស្ទង់សមត្ថភាពពេញលេញ" }),
                              e.jsx("span", { className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full", children: "៤០ សំណួរ QCM" })
                            ]
                          }),
                          e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2", children: "មេរៀនទី ៥ ៖ ធនធានធម្មជាតិ" }),
                          e.jsx("p", { className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1", children: "ចម្លើយត្រូវបានរៀបចំឆ្លាស់គ្នាស្មើៗគ្នា (ក, ខ, គ, ឃ) និងមានប្រវែងស្មើគ្នាដើម្បីវាស់ស្ទង់ការយល់ដឹងពិតប្រាកដ shadow-xs" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-2xl shrink-0",
                        children: [
                          e.jsx("span", { className: "text-xs text-emerald-800 dark:text-emerald-300 font-bold", children: "ឆ្លើយត្រូវ៖" }),
                          e.jsxs("span", { className: "text-xl font-bold text-emerald-700 dark:text-emerald-400", children: [Object.keys(userAnswers).filter(idx => {
                            const item = Zi5[idx];
                            if (!item) return false;
                            const opts = item.options || item.opts;
                            const sel = opts[userAnswers[idx]];
                            return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                          }).length, " / ", Zi5.length] })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "mb-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 w-full",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                          e.jsx("span", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "តារាងលេខសំណួរ (ចុចលើលេខដើម្បីផ្លាស់ប្តូរ)៖" }),
                          e.jsxs("span", { className: "text-xs text-emerald-700 dark:text-emerald-400 font-semibold", children: ["បានឆ្លើយ៖ ", Object.keys(userAnswers).length, " / ", Zi5.length] })
                        ]
                      }),
                      e.jsx("div", {
                        className: "grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5 max-h-32 overflow-y-auto p-1",
                        children: Zi5.map((qItem, qIdx) => {
                          const isCurrent = qIdx === currentQIndex;
                          const isAnswered = userAnswers[qIdx] !== undefined;
                          const opts = qItem.options || qItem.opts;
                          const sel = isAnswered ? opts[userAnswers[qIdx]] : null;
                          const isCorrect = isAnswered && sel && (sel.isCorrect !== undefined ? sel.isCorrect : sel.c);
                          return e.jsx("button", {
                            onClick: () => { playTone(600, 0.08); setCurrentQIndex(qIdx); },
                            className: "w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold border transition flex items-center justify-center cursor-pointer " + (isCurrent ? "border-2 border-emerald-700 bg-emerald-600 text-white shadow-md" : isAnswered ? (isCorrect ? "bg-emerald-100 dark:bg-emerald-900/60 border-emerald-400 text-emerald-800 dark:text-emerald-200" : "bg-rose-100 dark:bg-rose-900/60 border-rose-400 text-rose-800 dark:text-rose-200") : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"),
                            children: qIdx + 1
                          }, qIdx);
                        })
                      })
                    ]
                  }),
                  isFinished ? e.jsxs("div", {
                    className: "mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white text-center space-y-4 shadow-xl border border-emerald-600 w-full",
                    children: [
                      e.jsx("div", { className: "w-20 h-20 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-4xl shadow-lg animate-bounce", children: "🏆" }),
                      e.jsx("h3", { className: "text-2xl sm:text-3xl font-bold", children: "អបអរសាទរ! អ្នកបានបញ្ចប់តេស្តទាំង ៤០ សំណួរ!" }),
                      e.jsxs("p", { className: "text-sm text-emerald-100 max-w-lg mx-auto", children: ["អ្នកឆ្លើយត្រូវ ", Object.keys(userAnswers).filter(idx => {
                        const item = Zi5[idx];
                        if (!item) return false;
                        const opts = item.options || item.opts;
                        const sel = opts[userAnswers[idx]];
                        return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                      }).length, " លើ ", Zi5.length, " សំណួរ (", Math.round((Object.keys(userAnswers).filter(idx => {
                        const item = Zi5[idx];
                        if (!item) return false;
                        const opts = item.options || item.opts;
                        const sel = opts[userAnswers[idx]];
                        return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                      }).length / Zi5.length) * 100), "%)!"] }),
                      e.jsx("div", {
                        className: "pt-2 flex justify-center gap-3",
                        children: e.jsxs("button", {
                          onClick: () => { setUserAnswers({}); setCurrentQIndex(0); setIsFinished(!1); },
                          className: "px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition shadow-lg flex items-center gap-2 cursor-pointer",
                          children: [e.jsx("span", { children: "🔄" }), e.jsx("span", { children: "ធ្វើតេស្តឡើងវិញ" })]
                        })
                      })
                    ]
                  }) : e.jsxs("div", {
                    className: "space-y-6 w-full",
                    children: [
                      e.jsxs("div", {
                        className: "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 min-h-[300px] space-y-4 w-full",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx("span", { className: "px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" }),
                                  e.jsx("span", { className: "text-xs text-slate-400", children: "មេរៀនទី ៥" })
                                ]
                              }),
                              e.jsxs("span", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: ["សំណួរ ", currentQIndex + 1, " / ", Zi5.length] })
                            ]
                          }),
                          e.jsxs("h3", { className: "text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug", children: [currentQIndex + 1, ". ", Zi5[currentQIndex] ? (Zi5[currentQIndex].question || Zi5[currentQIndex].q) : ""] }),
                          e.jsx("div", {
                            className: "space-y-2.5 pt-1 w-full",
                            children: (Zi5[currentQIndex] ? (Zi5[currentQIndex].options || Zi5[currentQIndex].opts) : []).map((opt, optIdx) => {
                              const isAnswered = userAnswers[currentQIndex] !== undefined;
                              const selectedOptIdx = userAnswers[currentQIndex];
                              const khLabels = ["ក", "ខ", "គ", "ឃ"];
                              const isOptCorrect = opt.isCorrect !== undefined ? opt.isCorrect : opt.c;
                              let optClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800 dark:text-slate-200";
                              let badgeIcon = e.jsx("span", { className: "w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0", children: khLabels[optIdx] });
                              if (isAnswered) {
                                if (isOptCorrect) {
                                  optClass = "bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs";
                                  badgeIcon = e.jsx("span", { className: "w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0", children: "✓" });
                                } else if (selectedOptIdx === optIdx) {
                                  optClass = "bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-950 dark:text-rose-100";
                                  badgeIcon = e.jsx("span", { className: "w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0", children: "✗" });
                                } else {
                                  optClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60";
                                }
                              }
                              return e.jsxs("button", {
                                onClick: () => {
                                  if (userAnswers[currentQIndex] !== undefined) return;
                                  setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }));
                                  if (isOptCorrect) playSuccessSound(); else playErrorSound();
                                },
                                className: "w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition flex items-center gap-3 cursor-pointer " + optClass,
                                children: [
                                  badgeIcon,
                                  e.jsx("span", { className: "text-xs sm:text-sm font-medium flex-1 leading-relaxed", children: opt.text || opt.t })
                                ]
                              }, optIdx);
                            })
                          }),
                          userAnswers[currentQIndex] !== undefined ? e.jsxs("div", {
                            className: (() => {
                              const curItem = Zi5[currentQIndex];
                              const opts = curItem ? (curItem.options || curItem.opts) : [];
                              const selOpt = opts[userAnswers[currentQIndex]];
                              const isCorr = selOpt ? (selOpt.isCorrect !== undefined ? selOpt.isCorrect : selOpt.c) : false;
                              return isCorr ? "mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200" : "mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200";
                            })(),
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2 font-bold text-xs sm:text-sm mb-1",
                                children: (() => {
                                  const curItem = Zi5[currentQIndex];
                                  const opts = curItem ? (curItem.options || curItem.opts) : [];
                                  const selOpt = opts[userAnswers[currentQIndex]];
                                  const isCorr = selOpt ? (selOpt.isCorrect !== undefined ? selOpt.isCorrect : selOpt.c) : false;
                                  return isCorr ? [
                                    e.jsx("span", { className: "text-emerald-600 font-bold", children: "✓" }),
                                    e.jsx("span", { children: "ត្រឹមត្រូវណាស់!" })
                                  ] : [
                                    e.jsx("span", { className: "text-rose-600 font-bold", children: "✗" }),
                                    e.jsx("span", { children: "មិនទាន់ត្រឹមត្រូវទេ!" })
                                  ];
                                })()
                              }),
                              e.jsx("p", { className: "text-xs text-slate-700 dark:text-slate-300 leading-relaxed", children: (() => {
                                const curItem = Zi5[currentQIndex];
                                return curItem ? (curItem.exp || curItem.e || (curItem.options || curItem.opts)[userAnswers[currentQIndex]]?.exp || (curItem.options || curItem.opts)[userAnswers[currentQIndex]]?.e || "") : "";
                              })() })
                            ]
                          }) : e.jsxs("div", {
                            className: "mt-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-center gap-2 text-xs italic",
                            children: [
                              e.jsx("span", { children: "💡" }),
                              e.jsxs("span", { children: ["ជំនួយស្មារតី៖ ", Zi5[currentQIndex] ? (Zi5[currentQIndex].hint || Zi5[currentQIndex].h) : ""] })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center justify-between pt-2 w-full",
                        children: [
                          e.jsxs("button", {
                            disabled: currentQIndex === 0,
                            onClick: () => { playTone(600, 0.08); setCurrentQIndex(prev => Math.max(0, prev - 1)); },
                            className: "px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5",
                            children: [e.jsx("span", { children: "◄" }), e.jsx("span", { children: "សំណួរមុន" })]
                          }),
                          e.jsxs("span", { className: "text-xs font-bold text-slate-500 dark:text-slate-400", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ", Zi5.length] }),
                          e.jsxs("button", {
                            onClick: () => {
                              playTone(600, 0.08);
                              if (currentQIndex < Zi5.length - 1) {
                                setCurrentQIndex(prev => prev + 1);
                              } else {
                                setIsFinished(!1);
                                setIsFinished(!0);
                                try { playTone(783.99, 0.3); } catch(e){}
                              }
                            },
                            className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-md cursor-pointer flex items-center gap-1.5",
                            children: [
                              e.jsx("span", { children: currentQIndex === Zi5.length - 1 ? "បញ្ចប់តេស្ត" : "សំណួរបន្ទាប់" }),
                              e.jsx("span", { children: "►" })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            })

          ]
        })
      ]
    })
  });
};
`;

try {
  new vm.Script(code);
  console.log("Zi5 code parses cleanly with ZERO syntax errors!");
  fs.writeFileSync("scripts/rz5_component_code.js", code);
  console.log("Written scripts/rz5_component_code.js successfully!");
} catch (err) {
  console.error("Syntax error generating Zi5:", err);
  process.exit(1);
}
