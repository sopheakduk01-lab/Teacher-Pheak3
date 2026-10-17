import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

console.log("--- Generating Rz6 component code for Science Lesson 6 (Human Reproductive System) ---");

// Read questions
const questions = JSON.parse(fs.readFileSync('scripts/lesson6_questions.json', 'utf8'));

const code = `var Rz6 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [l, o] = y.useState(!1);
  const [c, d] = y.useState(0);
  const [u, h] = y.useState(!1);

  // Custom tab states
  const [malePart, setMalePart] = y.useState("testes"); // testes, scrotum, epididymis, vas_deferens, glands, penis
  const [femalePart, setFemalePart] = y.useState("ovaries"); // ovaries, oviducts, uterus, cervix, vagina
  const [lifeStage, setLifeStage] = y.useState("ovulation"); // ovulation, fertilization, zygote, implantation, gestation
  const [hygieneTopic, setHygieneTopic] = y.useState("daily"); // daily, clothing, soaps, sanitary, doctor

  // Game 1 state: Organ Classification Game (Male vs Female)
  const [game1Score, setGame1Score] = y.useState(0);
  const [game1Answers, setGame1Answers] = y.useState({});
  const game1Items = [
    { id: "testes", name: "ពងស្វាស", type: "male", icon: "🟢" },
    { id: "ovaries", name: "ក្រពេញអូវែ", type: "female", icon: "🟣" },
    { id: "uterus", name: "ស្បូន", type: "female", icon: "🌺" },
    { id: "vas_deferens", name: "បំពង់នាំស្ពែម", type: "male", icon: "⚡" },
    { id: "oviducts", name: "ដៃស្បូន (បំពង់នាំអូវុល)", type: "female", icon: "🌿" },
    { id: "epididymis", name: "អេពីឌីឌីម", type: "male", icon: "🧪" }
  ];

  // Game 2 state: Life Stages Ordering Game
  const [game2Score, setGame2Score] = y.useState(0);
  const [game2Step, setGame2Step] = y.useState(1);

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
    { id: "tab-general", label: "១. តួនាទីទូទៅ", icon: "🧬" },
    { id: "tab-male", label: "២. ប្រដាប់បន្តពូជបុរស", icon: "♂️" },
    { id: "tab-female", label: "៣. ប្រដាប់បន្តពូជស្ត្រី", icon: "♀️" },
    { id: "tab-life", label: "៤. កកើតជីវិតថ្មី", icon: "👶" },
    { id: "tab-hygiene", label: "៥. អនាម័យសុខភាព", icon: "🧼" },
    { id: "tab-lab", label: "៦. ល្បែងអន្តរកម្ម", icon: "🎮" },
    { id: "tab-quiz", label: "៧. កម្រង ៤០ QCM", icon: "❓", special: !0 }
  ];

  return e.jsx("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300 font-['Battambang']",
    children: e.jsxs("div", {
      className: "bg-white w-full max-w-5xl h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-rose-500/30 relative",
      children: [
        // Modal Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-rose-700 via-pink-800 to-purple-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-md border-b border-rose-600/50",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("div", {
                  className: "w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-inner",
                  children: "🧬"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("h2", { className: "text-base sm:text-lg font-bold text-white font-['Battambang'] leading-tight", children: "មេរៀនទី ៦ ៖ ប្រដាប់បន្តពូជមនុស្ស (Human Reproductive System)" }),
                    e.jsx("p", { className: "text-[11px] text-rose-200 font-medium", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ | ជំពូកទី ៣ ៖ មនុស្ស ភាពពេញវ័យ និងជំងឺ (សៀវភៅពុម្ពទំព័រ ៣៤ - ៣៩)" })
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
            className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border \${n === tab.id ? (tab.special ? "bg-amber-500 text-white border-amber-600 shadow-sm" : "bg-rose-700 text-white border-rose-800 shadow-sm") : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold"}\`,
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
                  className: "relative rounded-3xl overflow-hidden p-6 sm:p-8 text-white bg-gradient-to-br from-rose-700 via-pink-800 to-purple-900 shadow-lg border border-rose-600/50",
                  children: [
                    e.jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" }),
                    e.jsxs("div", {
                      className: "relative z-10 max-w-2xl space-y-3",
                      children: [
                        e.jsx("span", { className: "px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md inline-block", children: "📖 មេរៀនទី ៦ នៃជំពូកទី ៣" }),
                        e.jsx("h1", { className: "text-2xl sm:text-3xl font-black font-['Battambang'] leading-snug", children: "ប្រដាប់បន្តពូជមនុស្ស (Human Reproductive System)" }),
                        e.jsx("p", { className: "text-sm text-rose-100 leading-relaxed", children: "ការបន្តពូជជាលក្ខណៈជីវសាស្ត្រធម្មជាតិដ៏សំខាន់សម្រាប់បង្កើតកូនចៅ និងធានាការរស់នៅគង់វង្សនៃពូជពង្សមនុស្សលោក។ សិក្សាអំពីរចនាសម្ព័ន្ធប្រដាប់បន្តពូជបុរសនិងស្ត្រី ដំណើរការកកើតជីវិត និងអនាម័យសុខភាព។" }),
                        e.jsxs("div", {
                          className: "pt-2 flex flex-wrap gap-2",
                          children: [
                            e.jsx("button", { onClick: () => i("tab-general"), className: "px-4 py-2 bg-white text-rose-900 font-bold rounded-xl text-xs shadow hover:bg-rose-50 transition-all", children: "ចាប់ផ្តើមរៀន ➔" }),
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
                      className: "bg-white p-4 rounded-2xl border border-rose-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-lg", children: "♂️" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "១. ប្រដាប់បន្តពូជបុរស" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ពងស្វាស ថង់ពងស្វាស អេពីឌីឌីម បំពង់នាំស្ពែម និងក្រពេញ។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-purple-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-lg", children: "♀️" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "២. ប្រដាប់បន្តពូជស្ត្រី" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ក្រពេញអូវែ ដៃស្បូន ស្បូន កស្បូន និងទ្វារមាស។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-pink-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-pink-100 text-pink-800 font-bold flex items-center justify-center text-lg", children: "👶" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "៣. ដំណើរការកកើតជីវិត" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ការបញ្ចេញអូវុល ការបង្កកំណើត ស៊ីកូត និងគភ៌ ៩ ខែ។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg", children: "🧼" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "៤. អនាម័យសុខភាព" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ការលាងសម្អាត សម្លៀកបំពាក់កប្បាស និងការពិគ្រោះពេទ្យ។" })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 2: GENERAL ROLE
            n === "tab-general" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-rose-800 font-bold text-base", children: [e.jsx("span", { children: "🧬" }), "ផ្នែកទី ១ ៖ តួនាទីទូទៅនៃប្រដាប់បន្តពូជមនុស្ស"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ការបន្តពូជជាលក្ខណៈជីវសាស្ត្រធម្មជាតិដ៏សំខាន់របស់មនុស្ស ដើម្បីបង្កើតកូនចៅ និងធានាការរស់នៅគង់វង្សនៃពូជពង្សមនុស្សលោក។" })
                  ]
                }),

                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-rose-200 shadow-sm space-y-2 text-center",
                      children: [
                        e.jsx("div", { className: "text-3xl", children: "👨‍👩‍👧" }),
                        e.jsx("h3", { className: "font-bold text-xs text-rose-900", children: "១. ការបន្តពូជពង្ស" }),
                        e.jsx("p", { className: "text-[11px] text-slate-600 leading-relaxed", children: "បង្កើតកូនចៅបន្តវេនពីមួយជំនាន់ទៅមួយជំនាន់។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-purple-200 shadow-sm space-y-2 text-center",
                      children: [
                        e.jsx("div", { className: "text-3xl", children: "កោសិកា" }),
                        e.jsx("h3", { className: "font-bold text-xs text-purple-900", children: "២. ការបន្តពូជបែបភេទ" }),
                        e.jsx("p", { className: "text-[11px] text-slate-600 leading-relaxed", children: "រួមផ្សំគ្នារវាងកោសិកាបន្តពូជឈ្មោល និងកោសិកាបន្តពូជញី។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-pink-200 shadow-sm space-y-2 text-center",
                      children: [
                        e.jsx("div", { className: "text-3xl", children: "🚻" }),
                        e.jsx("h3", { className: "font-bold text-xs text-pink-900", children: "៣. ប្រភេទពីរសំខាន់" }),
                        e.jsx("p", { className: "text-[11px] text-slate-600 leading-relaxed", children: "ប្រដាប់បន្តពូជបុរស និងប្រដាប់បន្តពូជស្ត្រី។" })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 3: MALE SYSTEM
            n === "tab-male" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-rose-800 font-bold text-base", children: [e.jsx("span", { children: "♂️" }), "ផ្នែកទី ២ ៖ រចនាសម្ព័ន្ធ និងតួនាទីនៃប្រដាប់បន្តពូជបុរស"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ប្រដាប់បន្តពូជបុរសមានសរីរាង្គសំខាន់ៗដែលបំពេញមុខងារផលិត និងដឹកនាំមេជីវិតឈ្មោល (ស្ពែម)។" })
                  ]
                }),

                // Organ Buttons
                e.jsx("div", {
                  className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
                  children: [
                    { id: "testes", label: "១. ពងស្វាស", icon: "🟢" },
                    { id: "scrotum", label: "២. ថង់ពងស្វាស", icon: "🛡️" },
                    { id: "epididymis", label: "៣. អេពីឌីឌីម", icon: "🧪" },
                    { id: "vas_deferens", label: "៤. បំពង់នាំស្ពែម", icon: "⚡" },
                    { id: "glands", label: "៥. ក្រពេញបន្ថែម", icon: "💧" },
                    { id: "penis", label: "៦. លិង្គ", icon: "🍆" }
                  ].map(part => e.jsxs("button", {
                    onClick: () => setMalePart(part.id),
                    className: \`p-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 \${malePart === part.id ? "bg-rose-700 text-white border-rose-800 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}\`,
                    children: [e.jsx("span", { children: part.icon }), e.jsx("span", { children: part.label })]
                  }))
                }),

                // Male Part Content Card
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-2xl border border-rose-200 shadow-sm space-y-3 animate-in fade-in duration-200",
                  children: [
                    malePart === "testes" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-rose-900 text-sm", children: "១. ពងស្វាស (Testes)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "មានចំនួនពីរ ស្ថិតនៅក្នុងថង់ពងស្វាសខាងក្រៅរាងកាយ មាននាទីផលិតកោសិកាមេជីវិតឈ្មោល (ស្ពែម) និងផលិតអ័រម៉ូនភេទប្រុស (Testosterone)។" })] }),
                    malePart === "scrotum" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-rose-900 text-sm", children: "២. ថង់ពងស្វាស (Scrotum)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ស្រោមស្បែកការពារពងស្វាស និងជួយរក្សាសីតុណ្ហភាពឱ្យទាបជាងសីតុណ្ហភាពរាងកាយប្រហែល ២ ទៅ ៣ អង្សាសេ ដើម្បីឱ្យស្ពែមលូតលាស់ល្អ។" })] }),
                    malePart === "epididymis" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-rose-900 text-sm", children: "៣. អេពីឌីឌីម (Epididymis)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ជាបំពង់រុំព័ទ្ធពីលើពងស្វាសសម្រាប់ស្តុកទុកមេជីវិតឈ្មោលឱ្យលូតលាស់ពេញវ័យ និងមានសមត្ថភាពធ្វើចលនាហែល។" })] }),
                    malePart === "vas_deferens" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-rose-900 text-sm", children: "៤. បំពង់នាំស្ពែម (Vas Deferens)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "បំពង់វែងតភ្ជាប់ពីអេពីឌីឌីមទៅកាន់បង្ហួរនោម ដើម្បីនាំយកមេជីវិតឈ្មោលពេលមានការបញ្ចេញទឹកកាម។" })] }),
                    malePart === "glands" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-rose-900 text-sm", children: "៥. ក្រពេញបន្ថែម (Prostate & Seminal Vesicles)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "រួមមានក្រពេញប្រូស្តាត និងថង់ទឹកកាម បញ្ចេញសារធាតុរាវចិញ្ចឹមស្ពែម និងជួយឱ្យស្ពែមងាយធ្វើចលនា។" })] }),
                    malePart === "penis" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-rose-900 text-sm", children: "៦. លិង្គ (Penis)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "សរីរាង្គខាងក្រៅសម្រាប់បញ្ចេញទឹកនោម និងបញ្ចេញទឹកកាមចូលទៅក្នុងទ្វារមាសស្ត្រីពេលរួមដំណេក។" })] })
                  ]
                })
              ]
            }),

            // TAB 4: FEMALE SYSTEM
            n === "tab-female" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-purple-800 font-bold text-base", children: [e.jsx("span", { children: "♀️" }), "ផ្នែកទី ៣ ៖ រចនាសម្ព័ន្ធ និងតួនាទីនៃប្រដាប់បន្តពូជស្ត្រី"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ប្រដាប់បន្តពូជស្ត្រីបំពេញមុខងារផលិតមេជីវិតញី (អូវុល) ទទួលស្ពែម បង្កកំណើត និងទ្រទ្រង់គភ៌។" })
                  ]
                }),

                // Female Organ Buttons
                e.jsx("div", {
                  className: "grid grid-cols-2 sm:grid-cols-5 gap-2",
                  children: [
                    { id: "ovaries", label: "១. ក្រពេញអូវែ", icon: "🟣" },
                    { id: "oviducts", label: "២. ដៃស្បូន", icon: "🌿" },
                    { id: "uterus", label: "៣. ស្បូន", icon: "🌺" },
                    { id: "cervix", label: "៤. កស្បូន", icon: "⭕" },
                    { id: "vagina", label: "៥. ទ្វារមាស", icon: "🌸" }
                  ].map(part => e.jsxs("button", {
                    onClick: () => setFemalePart(part.id),
                    className: \`p-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 \${femalePart === part.id ? "bg-purple-700 text-white border-purple-800 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}\`,
                    children: [e.jsx("span", { children: part.icon }), e.jsx("span", { children: part.label })]
                  }))
                }),

                // Female Part Content Card
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-2xl border border-purple-200 shadow-sm space-y-3 animate-in fade-in duration-200",
                  children: [
                    femalePart === "ovaries" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-purple-900 text-sm", children: "១. ក្រពេញអូវែ (Ovaries)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "មានចំនួនពីរ ស្ថិតនៅសងខាងក្នុងអាងត្រគាក មាននាទីផលិតកោសិកាមេជីវិតញី (អូវុល) និងផលិតអ័រម៉ូនភេទស្រី (Estrogen & Progesterone)។" })] }),
                    femalePart === "oviducts" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-purple-900 text-sm", children: "២. ដៃស្បូន ឬបំពង់នាំអូវុល (Fallopian Tubes)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "បំពង់តភ្ជាប់ពីអូវែទៅស្បូន ជាកន្លែងដែលការបង្កកំណើតរវាងស្ពែមនិងអូវុលកើតឡើងជាទូទៅ។" })] }),
                    femalePart === "uterus" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-purple-900 text-sm", children: "៣. ស្បូន (Uterus)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "សរីរាង្គសាច់ដុំរាងដូចផ្លែសឺរ មានភ្នាសខាងក្នុងក្រាស់ ជាទីកន្លែងសម្រាប់កូនកកើត ទ្រទ្រង់ និងលូតលាស់អំឡុងពេលមានគភ៌។" })] }),
                    femalePart === "cervix" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-purple-900 text-sm", children: "៤. កស្បូន (Cervix)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ផ្នែកចង្អៀតខាងក្រោមនៃស្បូន ដែលបើកចំហភ្ជាប់ទៅកាន់ទ្វារមាស។" })] }),
                    femalePart === "vagina" && e.jsxs("div", { className: "space-y-2", children: [e.jsx("h3", { className: "font-bold text-purple-900 text-sm", children: "៥. ទ្វារមាស (Vagina)" }), e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "បំពង់សាច់ដុំយឺតភ្ជាប់ពីកស្បូនទៅខាងក្រៅ ជាផ្លូវសម្រាប់ទទួលលិង្គពេលរួមដំណេក ជាផ្លូវធ្លាក់ឈាមរដូវ និងជាផ្លូវសម្រាប់ទារកកើតចេញមកក្រៅ។" })] })
                  ]
                })
              ]
            }),

            // TAB 5: LIFE JOURNEY
            n === "tab-life" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-pink-800 font-bold text-base", children: [e.jsx("span", { children: "👶" }), "ផ្នែកទី ៤ ៖ ដំណើរនៃការកកើតជីវិតថ្មី (Fertilization & Gestation)"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ការកកើតជីវិតថ្មីនៃមនុស្សប្រព្រឹត្តទៅតាមដំណាក់កាលសំខាន់ៗចំនួន ៣ យ៉ាង៖" })
                  ]
                }),

                e.jsxs("div", {
                  className: "space-y-3",
                  children: [
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-pink-200 shadow-sm flex items-start gap-3", children: [e.jsx("span", { className: "p-2 bg-pink-100 text-pink-800 rounded-lg font-bold text-sm", children: "១" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-pink-900", children: "១. ការបញ្ចេញអូវុល (Ovulation)" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ជារៀងរាល់ខែ អូវែម្ខាងតែងតែបញ្ចេញអូវុលទុំមួយធ្លាក់ចូលទៅក្នុងដៃស្បូន។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-purple-200 shadow-sm flex items-start gap-3", children: [e.jsx("span", { className: "p-2 bg-purple-100 text-purple-800 rounded-lg font-bold text-sm", children: "២" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-purple-900", children: "២. ការបង្កកំណើត (Fertilization)" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "កើតឡើងនៅពេលមេជីវិតឈ្មោល (ស្ពែម) មួយជ្រៀតចូលបង្កាត់ជាមួយអូវុលនៅក្នុងដៃស្បូន បង្កើតបានជាស៊ីកូត (Zygote)។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-rose-200 shadow-sm flex items-start gap-3", children: [e.jsx("span", { className: "p-2 bg-rose-100 text-rose-800 rounded-lg font-bold text-sm", children: "៣" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-rose-900", children: "៣. ការកកើតគភ៌ (Implantation & Gestation)" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ស៊ីកូតបំបែកកោសិកាជាបន្តបន្ទាប់ ធ្វើដំណើរទៅទំនៅនឹងភ្នាសស្បូន ហើយលូតលាស់ជាទារករយៈពេលប្រមាណ ៩ ខែ ដោយទទួលបានអាហារតាមទងសុក។" })] })] })
                  ]
                })
              ]
            }),

            // TAB 6: HYGIENE
            n === "tab-hygiene" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-emerald-800 font-bold text-base", children: [e.jsx("span", { children: "🧼" }), "ផ្នែកទី ៥ ៖ អនាម័យ និងការថែរក្សាប្រដាប់បន្តពូជ"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ដើម្បីចៀសវាងការឆ្លងមេរោគ និងថែរក្សាសុខភាពបន្តពូជឱ្យបានល្អ យើងត្រូវអនុវត្តវិធានការសំខាន់ៗ ៥ យ៉ាង៖" })
                  ]
                }),

                e.jsxs("div", {
                  className: "space-y-3",
                  children: [
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "💧" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "១. លាងសម្អាតប្រចាំថ្ងៃ" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "លាងសម្អាតប្រដាប់បន្តពូជជារៀងរាល់ថ្ងៃដោយទឹកស្អាត និងជូតឱ្យស្ងួតល្អជានិច្ច។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "👕" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "២. សម្លៀកបំពាក់កប្បាស" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ផ្លាស់ប្តូរសម្លៀកបំពាក់ក្នុងយ៉ាងហោចណាស់មួយថ្ងៃម្តង ហើយប្រើក្រណាត់កប្បាសមានខ្យល់ចេញចូលស្រួល។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "🚫" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "៣. ហាមប្រើសាប៊ូកាត់ខ្លាំង" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ហាមប្រើសាប៊ូដែលមានជាតិកាត់ខ្លាំង ឬទឹកអប់បាញ់លាងសម្អាតប្រដាប់បន្តពូជឡើយ។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "🌸" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "៤. អនាម័យពេលមានរដូវ" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "សម្រាប់យុវតី ត្រូវផ្លាស់ប្តូរសំឡីអនាម័យឱ្យបានញឹកញាប់ពេលមានរដូវយ៉ាងតិច ៣ ទៅ ៤ ម៉ោងម្តង។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "🩺" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "៥. ពិគ្រោះជាមួយគ្រូពេទ្យ" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ទៅជួបគ្រូពេទ្យជំនាញនៅពេលមានអាការមិនប្រក្រតីដូចជារមាស់ រលាក ឬធ្លាក់សខុសធម្មតា។" })] })] })
                  ]
                })
              ]
            }),

            // TAB 7: LAB / GAMES
            n === "tab-lab" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-rose-800 font-bold text-base", children: [e.jsx("span", { children: "🎮" }), "ល្បែងអន្តរកម្មស្វែងយល់ពីប្រដាប់បន្តពូជ"] }),
                    e.jsx("p", { className: "text-xs text-slate-600", children: "សាកល្បងចំណេះដឹងរបស់អ្នកលើការចាត់ថ្នាក់សរីរាង្គបន្តពូជបុរសនិងស្ត្រី!" })
                  ]
                }),

                // GAME 1: ORGAN CLASSIFICATION GAME
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-rose-200 shadow-sm space-y-4",
                  children: [
                    e.jsxs("div", { className: "flex items-center justify-between", children: [
                      e.jsxs("h3", { className: "font-bold text-xs text-rose-900 flex items-center gap-1.5", children: [e.jsx("span", { children: "🎯" }), "ល្បែងទី ១ ៖ ចាត់ថ្នាក់សរីរាង្គបន្តពូជបុរស vs ស្ត្រី"] }),
                      e.jsxs("span", { className: "text-xs font-bold px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full", children: ["ពិន្ទុ ៖ ", game1Score, " / ", game1Items.length] })
                    ]}),

                    e.jsx("div", {
                      className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5",
                      children: game1Items.map(item => {
                        const status = game1Answers[item.id];
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
                                    if (item.type === "male") {
                                      playSuccessSound();
                                      setGame1Score(prev => prev + 1);
                                      setGame1Answers(prev => ({ ...prev, [item.id]: "correct" }));
                                    } else {
                                      playErrorSound();
                                      setGame1Answers(prev => ({ ...prev, [item.id]: "wrong" }));
                                    }
                                  },
                                  className: "flex-1 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold",
                                  children: "បុរស"
                                }),
                                e.jsx("button", {
                                  onClick: () => {
                                    if (item.type === "female") {
                                      playSuccessSound();
                                      setGame1Score(prev => prev + 1);
                                      setGame1Answers(prev => ({ ...prev, [item.id]: "correct" }));
                                    } else {
                                      playErrorSound();
                                      setGame1Answers(prev => ({ ...prev, [item.id]: "wrong" }));
                                    }
                                  },
                                  className: "flex-1 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-bold",
                                  children: "ស្ត្រី"
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
            n === "tab-quiz" && e.jsxs("div", {
              className: "space-y-5 animate-in fade-in duration-300",
              children: [
                // Top Quiz Header
                e.jsxs("div", {
                  className: "bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-3",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-3",
                      children: [
                        e.jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xl", children: "❓" }),
                        e.jsxs("div", {
                          children: [
                            e.jsxs("h3", { className: "font-bold text-slate-800 text-sm", children: ["សំណួរទី ", Y + 1, " នៃ ", quizQuestions.length] }),
                            e.jsx("p", { className: "text-xs text-slate-500", children: "កម្រង ៤០ សំណួរ QCM ពង្រឹងចំណេះដឹងមេរៀនទី ៦" })
                          ]
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "flex items-center gap-3",
                      children: [
                        e.jsxs("div", {
                          className: "px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5",
                          children: [
                            e.jsx("span", { children: "🏆" }),
                            e.jsxs("span", { children: ["ពិន្ទុ ៖ ", c, " / ", quizQuestions.length] })
                          ]
                        }),
                        e.jsx("button", {
                          onClick: handleResetQuiz,
                          className: "px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200",
                          children: "🔄 ធ្វើឡើងវិញ"
                        })
                      ]
                    })
                  ]
                }),

                // Progress Bar
                e.jsx("div", {
                  className: "w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner",
                  children: e.jsx("div", {
                    className: "bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300",
                    style: { width: \`\${((Y + 1) / quizQuestions.length) * 100}%\` }
                  })
                }),

                // Question Card
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-start justify-between gap-3",
                      children: [
                        e.jsxs("h2", { className: "text-base sm:text-lg font-bold text-slate-900 leading-snug font-['Battambang']", children: [\`សំណួរទី \${Y + 1} ៖ \`, quizQuestions[Y].q] }),
                        quizQuestions[Y].h && e.jsx("button", {
                          onClick: () => toggleHint(Y),
                          className: "px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 hover:bg-amber-100 shrink-0",
                          children: "💡 ជំនួយ"
                        })
                      ]
                    }),

                    // Hint box
                    re[Y] && quizQuestions[Y].h && e.jsxs("div", {
                      className: "p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium animate-in fade-in duration-200 flex items-center gap-2",
                      children: [e.jsx("span", { children: "💡" }), e.jsx("span", { children: quizQuestions[Y].h })]
                    }),

                    // 4 Options Grid
                    e.jsx("div", {
                      className: "grid grid-cols-1 gap-3",
                      children: quizQuestions[Y].opts.map((opt, optIdx) => {
                        const isChosen = q[Y] === optIdx;
                        const isAns = q[Y] !== undefined;
                        const labelPrefix = ["ក. ", "ខ. ", "គ. ", "ឃ. "][optIdx];

                        let btnStyle = "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                        if (isAns) {
                          if (opt.c) {
                            btnStyle = "bg-emerald-50 text-emerald-900 border-emerald-400 font-bold shadow-sm";
                          } else if (isChosen) {
                            btnStyle = "bg-red-50 text-red-900 border-red-300 font-bold";
                          } else {
                            btnStyle = "bg-slate-50 text-slate-400 border-slate-200 opacity-60";
                          }
                        }

                        return e.jsxs("button", {
                          disabled: isAns,
                          onClick: () => handleSelectOption(Y, optIdx),
                          className: \`p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between font-['Battambang'] \${btnStyle}\`,
                          children: [
                            e.jsxs("div", { className: "flex items-start gap-2", children: [e.jsx("span", { className: "font-bold shrink-0", children: labelPrefix }), e.jsx("span", { children: opt.t })] }),
                            isAns && opt.c && e.jsx("span", { className: "text-emerald-600 font-bold text-base shrink-0", children: "✓" }),
                            isAns && isChosen && !opt.c && e.jsx("span", { className: "text-red-500 font-bold text-base shrink-0", children: "✕" })
                          ]
                        });
                      })
                    }),

                    // Explanation Box
                    isCurrentAnswered && e.jsxs("div", {
                      className: \`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 space-y-1 \${quizQuestions[Y].opts[q[Y]].c ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"}\`,
                      children: [
                        e.jsx("div", { className: "font-bold text-xs flex items-center gap-1.5", children: quizQuestions[Y].opts[q[Y]].c ? "✅ ចម្លើយត្រឹមត្រូវ!" : "❌ មិនទាន់ត្រឹមត្រូវទេ!" }),
                        e.jsxs("p", { children: [e.jsx("span", { className: "font-bold", children: "ពន្យល់ ៖ " }), quizQuestions[Y].opts[q[Y]].e || (quizQuestions[Y].opts.find(o => o.c)?.e || "")] })
                      ]
                    }),

                    // Bottom Question Nav Buttons
                    e.jsxs("div", {
                      className: "pt-4 border-t border-slate-100 flex items-center justify-between",
                      children: [
                        e.jsx("button", {
                          disabled: Y === 0,
                          onClick: handlePrevQuestion,
                          className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-all border border-slate-200",
                          children: "⬅️ សំណួរមុន"
                        }),
                        e.jsx("button", {
                          disabled: Y === quizQuestions.length - 1,
                          onClick: handleNextQuestion,
                          className: "px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-rose-700/20",
                          children: "សំណួរបន្ទាប់ ➡️"
                        })
                      ]
                    })
                  ]
                })
              ]
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
  console.log("Rz6 code parses cleanly with ZERO syntax errors!");
} catch (err) {
  console.error("PARSE ERROR in Rz6 component code:", err);
  process.exit(1);
}

fs.writeFileSync('scripts/rz6_component_code.js', code);
console.log("Written scripts/rz6_component_code.js successfully!");
