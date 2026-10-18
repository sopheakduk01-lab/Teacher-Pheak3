import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

console.log("--- Generating Rz7 component code for Science Lesson 7 (Puberty) ---");

// Read questions
const questions = JSON.parse(fs.readFileSync('scripts/lesson7_questions.json', 'utf8'));

const code = `var Rz7 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [l, o] = y.useState(!1);
  const [c, d] = y.useState(0);
  const [u, h] = y.useState(!1);

  // Custom tab states
  const [genderTab, setGenderTab] = y.useState("male"); // male vs female
  const [psychTab, setPsychTab] = y.useState("mood"); // mood, independence, self_image, peers, attraction
  const [hygieneStep, setHygieneStep] = y.useState("shower"); // shower, face, clothes, sanitary, diet, sleep

  // Game 1 state: Physical Changes Classification Game (Male vs Female)
  const [game1Score, setGame1Score] = y.useState(0);
  const [game1Answers, setGame1Answers] = y.useState({});
  const game1Items = [
    { id: "voice", name: "សំឡេងប្រែជាធំ & បែកស្អក", type: "male", icon: "🎙️" },
    { id: "period", name: "ការចាប់ផ្តើមមានរដូវលើកដំបូង", type: "female", icon: "🌸" },
    { id: "beard", name: "ដុះពុកមាត់ & ពុកចង្កា", type: "male", icon: "🧔" },
    { id: "breasts", name: "សុដន់ចាប់ផ្តើមរីកធំឡើង", type: "female", icon: "👚" },
    { id: "wet_dream", name: "យល់សប្តិបញ្ចេញទឹកកាម", type: "male", icon: "🌙" },
    { id: "hips", name: "អាងត្រគាករីកទូលាយធំ", type: "female", icon: "💃" }
  ];

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
    { id: "tab-def", label: "១. និយមន័យ", icon: "🌟" },
    { id: "tab-physical", label: "២. បម្រែបម្រួលរាងកាយ", icon: "⚡" },
    { id: "tab-emotional", label: "៣. បម្រែបម្រួលផ្លូវចិត្ត", icon: "🧠" },
    { id: "tab-hygiene", label: "៤. អនាម័យ & សុខភាព", icon: "🧼" },
    { id: "tab-lab", label: "៥. ល្បែងអន្តរកម្ម", icon: "🎮" },
    { id: "tab-quiz", label: "៦. កម្រង ៤០ QCM", icon: "❓", special: !0 }
  ];

  return e.jsx("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300 font-['Battambang']",
    children: e.jsxs("div", {
      className: "bg-white w-full max-w-5xl h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-500/30 relative",
      children: [
        // Modal Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-800 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-md border-b border-amber-500/50",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("div", {
                  className: "w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-inner",
                  children: "🌟"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("h2", { className: "text-base sm:text-lg font-bold text-white font-['Battambang'] leading-tight", children: "មេរៀនទី ៧ ៖ ភាពពេញវ័យ (Puberty)" }),
                    e.jsx("p", { className: "text-[11px] text-amber-200 font-medium", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ | ជំពូកទី ៣ ៖ មនុស្ស ភាពពេញវ័យ និងជំងឺ (សៀវភៅពុម្ពទំព័រ ៤០ - ៤៥)" })
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
            className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border \${n === tab.id ? (tab.special ? "bg-amber-500 text-white border-amber-600 shadow-sm" : "bg-amber-600 text-white border-amber-700 shadow-sm") : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold"}\`,
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
                  className: "relative rounded-3xl overflow-hidden p-6 sm:p-8 text-white bg-gradient-to-br from-amber-600 via-orange-600 to-indigo-800 shadow-lg border border-amber-500/50",
                  children: [
                    e.jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" }),
                    e.jsxs("div", {
                      className: "relative z-10 max-w-2xl space-y-3",
                      children: [
                        e.jsx("span", { className: "px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md inline-block", children: "📖 មេរៀនទី ៧ នៃជំពូកទី ៣" }),
                        e.jsx("h1", { className: "text-2xl sm:text-3xl font-black font-['Battambang'] leading-snug", children: "ភាពពេញវ័យ (Puberty)" }),
                        e.jsx("p", { className: "text-sm text-amber-100 leading-relaxed", children: "ភាពពេញវ័យជាដំណាក់កាលអន្តរកាលនៃការលូតលាស់ពីរូបរាងកុមារភាពទៅកាន់មនុស្សពេញវ័យ។ សិក្សាអំពីបម្រែបម្រួលរាងកាយ ឥទ្ធិពលអ័រម៉ូន បម្រែបម្រួលផ្លូវចិត្ត និងការថែរក្សាអនាម័យសុខភាព។" }),
                        e.jsxs("div", {
                          className: "pt-2 flex flex-wrap gap-2",
                          children: [
                            e.jsx("button", { onClick: () => i("tab-def"), className: "px-4 py-2 bg-white text-amber-900 font-bold rounded-xl text-xs shadow hover:bg-amber-50 transition-all", children: "ចាប់ផ្តើមរៀន ➔" }),
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
                      className: "bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-lg", children: "🌟" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "១. និយមន័យ & អ័រម៉ូន" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ដំណាក់កាលអន្តរកាលកុមារទៅមនុស្សធំ ដោយសារអ័រម៉ូន។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-orange-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-orange-100 text-orange-800 font-bold flex items-center justify-center text-lg", children: "⚡" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "២. បម្រែបម្រួលរាងកាយ" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "លក្ខណៈជីវសាស្ត្រក្មេងប្រុស (១២-១៦) និងក្មេងស្រី (១០-១៤)។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-lg", children: "🧠" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "៣. បម្រែបម្រួលផ្លូវចិត្ត" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "អារម្មណ៍ប្រែប្រួល ចង់បានឯករាជ្យ និងមិត្តភក្តិ។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-2",
                      children: [
                        e.jsx("div", { className: "w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg", children: "🧼" }),
                        e.jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "៤. អនាម័យសុខភាព" }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ការងូតទឹក ការថែស្បែកមុខ អាហារ និងការគេង ៨-៩ ម៉ោង។" })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 2: DEFINITION
            n === "tab-def" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-amber-800 font-bold text-base", children: [e.jsx("span", { children: "🌟" }), "ផ្នែកទី ១ ៖ និយមន័យនៃភាពពេញវ័យ"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60", children: "ភាពពេញវ័យ គឺជាដំណាក់កាលអន្តរកាលនៃការលូតលាស់និងការផ្លាស់ប្តូរពីរូបរាងកុមារភាព ឈានឆ្ពោះទៅរកភាពជាមនុស្សពេញវ័យពេញលក្ខណៈ។" })
                  ]
                }),

                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "flex items-center gap-2 text-amber-900 font-bold text-sm", children: [e.jsx("span", { className: "text-xl", children: "👧" }), "អាយុពេញវ័យកុមារី (ក្មេងស្រី)"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ចាប់ផ្តើមចន្លោះអាយុ ១០ ដល់ ១៤ ឆ្នាំ (ច្រើនលឿនជាងក្មេងប្រុសប្រហែល ១-២ ឆ្នាំ)។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "flex items-center gap-2 text-indigo-900 font-bold text-sm", children: [e.jsx("span", { className: "text-xl", children: "👦" }), "អាយុពេញវ័យកុមារា (ក្មេងប្រុស)"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ចាប់ផ្តើមចន្លោះអាយុ ១២ ដល់ ១៦ ឆ្នាំ។" })
                      ]
                    })
                  ]
                }),

                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-purple-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("h3", { className: "font-bold text-xs text-purple-900 flex items-center gap-2", children: [e.jsx("span", { children: "🧪" }), "ឥទ្ធិពលនៃអ័រម៉ូនភេទ"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ការផ្លាស់ប្តូរទាំងនេះកើតឡើងដោយសារឥទ្ធិពលនៃអ័រម៉ូនភេទ ដែលផលិតចេញពីក្រពេញអ៊ីប៉ូភីស (Pituitary Gland) ក្នុងខួរក្បាល រួមជាមួយពងស្វាសចំពោះក្មេងប្រុស (Testosterone) និងអូវែចំពោះក្មេងស្រី (Estrogen)។" })
                  ]
                })
              ]
            }),

            // TAB 3: PHYSICAL CHANGES
            n === "tab-physical" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-amber-800 font-bold text-base", children: [e.jsx("span", { children: "⚡" }), "ផ្នែកទី ២ ៖ បម្រែបម្រួលរាងកាយនៅវ័យពេញវ័យ"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ការប្រែប្រួលរាងកាយប្រព្រឹត្តទៅខុសៗគ្នារវាងយុវជន និងយុវតី ៖" })
                  ]
                }),

                // Gender selector buttons
                e.jsxs("div", {
                  className: "flex gap-2",
                  children: [
                    e.jsxs("button", {
                      onClick: () => setGenderTab("male"),
                      className: \`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-2 \${genderTab === "male" ? "bg-amber-600 text-white border-amber-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}\`,
                      children: [e.jsx("span", { children: "👦" }), "១. ចំពោះយុវជន (ក្មេងប្រុស)"]
                    }),
                    e.jsxs("button", {
                      onClick: () => setGenderTab("female"),
                      className: \`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-2 \${genderTab === "female" ? "bg-purple-600 text-white border-purple-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}\`,
                      children: [e.jsx("span", { children: "👧" }), "២. ចំពោះយុវតី (ក្មេងស្រី)"]
                    })
                  ]
                }),

                genderTab === "male" ? e.jsxs("div", {
                  className: "bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-3 animate-in fade-in duration-200",
                  children: [
                    e.jsx("h3", { className: "font-bold text-amber-900 text-sm", children: "បម្រែបម្រួលរាងកាយក្មេងប្រុស ៖" }),
                    e.jsxs("ul", {
                      className: "space-y-2 text-xs text-slate-700 leading-relaxed list-disc list-inside",
                      children: [
                        e.jsx("li", { children: "កម្ពស់និងទម្ងន់កើនឡើងលឿន រាងកាយធំមាំ សាច់ដុំរីកធំ និងស្មាទូលាយ" }),
                        e.jsx("li", { children: "សំឡេងចាប់ផ្តើមប្រែជាធំ ស្អកបែកសំឡេង និងលៀនពកបំពង់កច្បាស់" }),
                        e.jsx("li", { children: "ចាប់ផ្តើមដុះរោមនៅលើផ្ទៃមុខ (ពុកមាត់ ពុកចង្កា) រោមក្រោមឃ្លៀក និងរោមលើប្រដាប់ភេទ" }),
                        e.jsx("li", { children: "ប្រដាប់បន្តពូជ (លិង្គ និងពងស្វាស) រីកធំឡើង ចាប់ផ្តើមផលិតស្ពែម និងមានបាតុភូតយល់សប្តិបញ្ចេញទឹកកាម" }),
                        e.jsx("li", { children: "ក្រពេញញើសនិងក្រពេញខ្លាញ់ដំណើរការខ្លាំង បង្កឱ្យមានក្លិនខ្លួន និងកើតមុនលើផ្ទៃមុខ" })
                      ]
                    })
                  ]
                }) : e.jsxs("div", {
                  className: "bg-white p-6 rounded-2xl border border-purple-200 shadow-sm space-y-3 animate-in fade-in duration-200",
                  children: [
                    e.jsx("h3", { className: "font-bold text-purple-900 text-sm", children: "បម្រែបម្រួលរាងកាយក្មេងស្រី ៖" }),
                    e.jsxs("ul", {
                      className: "space-y-2 text-xs text-slate-700 leading-relaxed list-disc list-inside",
                      children: [
                        e.jsx("li", { children: "កម្ពស់លូតលាស់លឿន អាងត្រគាករីកសាយធំ រាងកាយមូលក្លំ និងមានរាងកោងស្អាត" }),
                        e.jsx("li", { children: "សុដន់ចាប់ផ្តើមរីកធំឡើង និងឡើងទន់ល្មើយ" }),
                        e.jsx("li", { children: "ចាប់ផ្តើមដុះរោមនៅក្រោមឃ្លៀក និងរោមជុំវិញប្រដាប់ភេទ" }),
                        e.jsx("li", { children: "សរីរាង្គបន្តពូជខាងក្នុងលូតលាស់ពេញលេញ អូវែចាប់ផ្តើមបញ្ចេញអូវុល និងចាប់ផ្តើមមានរដូវលើកដំបូង" }),
                        e.jsx("li", { children: "ស្បែកឡើងរលោង ប៉ុន្តែក៏អាចកើតមុន និងមានញើសក្លិនខ្លួនដោយសារក្រពេញខ្លាញ់និងញើស" })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 4: EMOTIONAL & SOCIAL
            n === "tab-emotional" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-indigo-800 font-bold text-base", children: [e.jsx("span", { children: "🧠" }), "ផ្នែកទី ៣ ៖ បម្រែបម្រួលអារម្មណ៍ ចិត្តសាស្ត្រ និងសង្គម"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ក្រៅពីការផ្លាស់ប្តូរផ្នែករូបរាងកាយ យុវវ័យក៏ជួបប្រទះការផ្លាស់ប្តូរផ្នែកផ្លូវចិត្តយ៉ាងខ្លាំងផងដែរ ៖" })
                  ]
                }),

                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "font-bold text-xs text-indigo-900 flex items-center gap-2", children: [e.jsx("span", { children: "🎭" }), "អារម្មណ៍ប្រែប្រួលរហ័ស"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ងាយឆាប់ខឹង មួរម៉ៅ អន់ចិត្ត ឬសប្បាយចិត្តលឿនខុសធម្មតាដោយសារការប្រែប្រួលអ័រម៉ូន។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "font-bold text-xs text-indigo-900 flex items-center gap-2", children: [e.jsx("span", { children: "🦅" }), "ចង់បានភាពឯករាជ្យ"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ចង់ធ្វើការសម្រេចចិត្តដោយខ្លួនឯង មិនសូវចង់ឱ្យឪពុកម្តាយតាមដាន ឬបង្គាប់បញ្ជាច្រើនពេក។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "font-bold text-xs text-indigo-900 flex items-center gap-2", children: [e.jsx("span", { children: "🪞" }), "ការចាប់អារម្មណ៍លើរូបរាង"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "យកចិត្តទុកដាក់ខ្លាំងលើសម្រស់ ការតុបតែងខ្លួន និងការព្រួយបារម្ភពីមុនលើមុខ។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm space-y-2",
                      children: [
                        e.jsxs("div", { className: "font-bold text-xs text-indigo-900 flex items-center gap-2", children: [e.jsx("span", { children: "🤝" }), "ការឱ្យតម្លៃលើមិត្តភក្តិ"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ចូលចិត្តចំណាយពេលជាមួយមិត្តរួមវ័យ ត្រូវការការទទួលស្គាល់ និងការលើកទឹកចិត្តពីមិត្តភក្តិ។" })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 5: HYGIENE
            n === "tab-hygiene" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-emerald-800 font-bold text-base", children: [e.jsx("span", { children: "🧼" }), "ផ្នែកទី ៤ ៖ ការថែរក្សាអនាម័យ និងសុខភាពអំឡុងពេលពេញវ័យ"] }),
                    e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "ដើម្បីឆ្លងកាត់វ័យនេះដោយសុវត្ថិភាព និងមានទំនុកចិត្ត យើងត្រូវអនុវត្តវិធានការសុខភាពសំខាន់ៗ ៦ យ៉ាង៖" })
                  ]
                }),

                e.jsxs("div", {
                  className: "space-y-3",
                  children: [
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "🚿" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "១. ងូតទឹកជារៀងរាល់ថ្ងៃ" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ងូតទឹកសម្អាតរាងកាយយ៉ាងតិច ២ ដងក្នុងមួយថ្ងៃ ដោយប្រើសាប៊ូដុសកន្លែងមានញើសច្រើន (ក្លៀក និងប្រដាប់ភេទ)។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "🧴" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "២. លាងមុខថ្នមៗ" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "លាងសម្អាតមុខជាមួយទឹកស្អាត មិនត្រូវច្របាច់ ឬញេចមុនឡើយ ព្រោះអាចបង្កការរលាកឆ្លងរោគ។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "👕" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "៣. សម្លៀកបំពាក់កប្បាស" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ផ្លាស់ប្តូរសម្លៀកបំពាក់ក្នុងរាល់ថ្ងៃ និងជ្រើសរើសក្រណាត់កប្បាសទន់ស្រូបញើសបានល្អ។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "🌸" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "៤. អនាម័យសំឡីរដូវ" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "ចំពោះយុវតី ត្រូវផ្លាស់ប្តូរសំឡីអនាម័យរៀងរាល់ ៣ ទៅ ៤ ម៉ោងម្តងនៅពេលមានរដូវ និងកត់ត្រាថ្ងៃមកដំបូង។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "🥗" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "៥. អាហារូបត្ថម្ភ & ហាត់ប្រាណ" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "បរិភោគអាហារសម្បូរជីវជាតិ (បន្លែ ផ្លែឈើ សាច់ ត្រី ស៊ុត ទឹកដោះគោ) ផឹកទឹកឱ្យបានច្រើន និងហាត់ប្រាណទៀងទាត់។" })] })] }),
                    e.jsxs("div", { className: "p-4 bg-white rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm", children: [e.jsx("span", { className: "text-xl", children: "🛌" }), e.jsxs("div", { children: [e.jsx("h4", { className: "font-bold text-xs text-emerald-900", children: "៦. គេងសម្រាក ៨-៩ ម៉ោង" }), e.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "គេងសម្រាកឱ្យបានគ្រប់គ្រាន់ពី ៨ ទៅ ៩ ម៉ោងក្នុងមួយយប់ និងចៀសវាងការសេពគ្រឿងស្រវឹងឬបារី។" })] })] })
                  ]
                })
              ]
            }),

            // TAB 6: LAB / GAMES
            n === "tab-lab" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-300",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2",
                  children: [
                    e.jsxs("div", { className: "flex items-center gap-2 text-amber-800 font-bold text-base", children: [e.jsx("span", { children: "🎮" }), "ល្បែងអន្តរកម្មស្វែងយល់ពីបម្រែបម្រួលភាពពេញវ័យ"] }),
                    e.jsx("p", { className: "text-xs text-slate-600", children: "សាកល្បងចំណេះដឹងរបស់អ្នកលើការបែងចែកបម្រែបម្រួលរាងកាយក្មេងប្រុស vs ក្មេងស្រី!" })
                  ]
                }),

                // GAME 1: PUBERTY CHANGES CLASSIFIER
                e.jsxs("div", {
                  className: "bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-4",
                  children: [
                    e.jsxs("div", { className: "flex items-center justify-between", children: [
                      e.jsxs("h3", { className: "font-bold text-xs text-amber-900 flex items-center gap-1.5", children: [e.jsx("span", { children: "🎯" }), "ល្បែងទី ១ ៖ ចាត់ថ្នាក់បម្រែបម្រួលរាងកាយក្មេងប្រុស vs ក្មេងស្រី"] }),
                      e.jsxs("span", { className: "text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full", children: ["ពិន្ទុ ៖ ", game1Score, " / ", game1Items.length] })
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
                                  className: "flex-1 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold",
                                  children: "ក្មេងប្រុស"
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
                                  children: "ក្មេងស្រី"
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

            // TAB 7: 40 QCM QUIZ ENGINE
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
                          e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2", children: "មេរៀនទី ៧ ៖ ភាពពេញវ័យ" }),
                          e.jsx("p", { className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1", children: "ចម្លើយត្រូវបានរៀបចំឆ្លាស់គ្នាស្មើៗគ្នា (ក, ខ, គ, ឃ) និងមានប្រវែងស្មើគ្នាដើម្បីវាស់ស្ទង់ការយល់ដឹងពិតប្រាកដ shadow-xs" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-2xl shrink-0",
                        children: [
                          e.jsx("span", { className: "text-xs text-emerald-800 dark:text-emerald-300 font-bold", children: "ឆ្លើយត្រូវ៖" }),
                          e.jsxs("span", { className: "text-xl font-bold text-emerald-700 dark:text-emerald-400", children: [Object.keys(userAnswers).filter(idx => {
                            const item = Zi7[idx];
                            if (!item) return false;
                            const opts = item.options || item.opts;
                            const sel = opts[userAnswers[idx]];
                            return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                          }).length, " / ", Zi7.length] })
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
                          e.jsxs("span", { className: "text-xs text-emerald-700 dark:text-emerald-400 font-semibold", children: ["បានឆ្លើយ៖ ", Object.keys(userAnswers).length, " / ", Zi7.length] })
                        ]
                      }),
                      e.jsx("div", {
                        className: "grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5 max-h-32 overflow-y-auto p-1",
                        children: Zi7.map((qItem, qIdx) => {
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
                        const item = Zi7[idx];
                        if (!item) return false;
                        const opts = item.options || item.opts;
                        const sel = opts[userAnswers[idx]];
                        return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                      }).length, " លើ ", Zi7.length, " សំណួរ (", Math.round((Object.keys(userAnswers).filter(idx => {
                        const item = Zi7[idx];
                        if (!item) return false;
                        const opts = item.options || item.opts;
                        const sel = opts[userAnswers[idx]];
                        return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                      }).length / Zi7.length) * 100), "%)!"] }),
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
                                  e.jsx("span", { className: "text-xs text-slate-400", children: "មេរៀនទី ៧" })
                                ]
                              }),
                              e.jsxs("span", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: ["សំណួរ ", currentQIndex + 1, " / ", Zi7.length] })
                            ]
                          }),
                          e.jsxs("h3", { className: "text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug", children: [currentQIndex + 1, ". ", Zi7[currentQIndex] ? (Zi7[currentQIndex].question || Zi7[currentQIndex].q) : ""] }),
                          e.jsx("div", {
                            className: "space-y-2.5 pt-1 w-full",
                            children: (Zi7[currentQIndex] ? (Zi7[currentQIndex].options || Zi7[currentQIndex].opts) : []).map((opt, optIdx) => {
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
                              const curItem = Zi7[currentQIndex];
                              const opts = curItem ? (curItem.options || curItem.opts) : [];
                              const selOpt = opts[userAnswers[currentQIndex]];
                              const isCorr = selOpt ? (selOpt.isCorrect !== undefined ? selOpt.isCorrect : selOpt.c) : false;
                              return isCorr ? "mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200" : "mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200";
                            })(),
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2 font-bold text-xs sm:text-sm mb-1",
                                children: (() => {
                                  const curItem = Zi7[currentQIndex];
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
                                const curItem = Zi7[currentQIndex];
                                return curItem ? (curItem.exp || curItem.e || (curItem.options || curItem.opts)[userAnswers[currentQIndex]]?.exp || (curItem.options || curItem.opts)[userAnswers[currentQIndex]]?.e || "") : "";
                              })() })
                            ]
                          }) : e.jsxs("div", {
                            className: "mt-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-center gap-2 text-xs italic",
                            children: [
                              e.jsx("span", { children: "💡" }),
                              e.jsxs("span", { children: ["ជំនួយស្មារតី៖ ", Zi7[currentQIndex] ? (Zi7[currentQIndex].hint || Zi7[currentQIndex].h) : ""] })
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
                          e.jsxs("span", { className: "text-xs font-bold text-slate-500 dark:text-slate-400", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ", Zi7.length] }),
                          e.jsxs("button", {
                            onClick: () => {
                              playTone(600, 0.08);
                              if (currentQIndex < Zi7.length - 1) {
                                setCurrentQIndex(prev => prev + 1);
                              } else {
                                setIsFinished(!1);
                                setIsFinished(!0);
                                try { playTone(783.99, 0.3); } catch(e){}
                              }
                            },
                            className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-md cursor-pointer flex items-center gap-1.5",
                            children: [
                              e.jsx("span", { children: currentQIndex === Zi7.length - 1 ? "បញ្ចប់តេស្ត" : "សំណួរបន្ទាប់" }),
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
  console.log("Zi7 code parses cleanly with ZERO syntax errors!");
  fs.writeFileSync("scripts/rz7_component_code.js", code);
  console.log("Written scripts/rz7_component_code.js successfully!");
} catch (err) {
  console.error("Syntax error generating Zi7:", err);
  process.exit(1);
}
