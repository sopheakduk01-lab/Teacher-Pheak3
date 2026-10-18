import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

console.log("--- Generating Rz8 component code for Science Lesson 8 (Contraception & Prevention) ---");

const questions = JSON.parse(fs.readFileSync("scripts/lesson8_questions.json", "utf8"));

const code = `var Rz8 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a); const [currentQIndex, setCurrentQIndex] = y.useState(0); const [userAnswers, setUserAnswers] = y.useState({}); const [isFinished, setIsFinished] = y.useState(!1);
  const [l, o] = y.useState(!1);
  const [c, d] = y.useState(0);
  const [u, h] = y.useState(!1);

  // Custom tab states
  const [methodFilter, setMethodFilter] = y.useState("all"); // all, temp, perm

  // Game 1 state: Contraception Methods Classification Game
  const [gameScore, setGameScore] = y.useState(0);
  const [gameAnswers, setGameAnswers] = y.useState({});
  const gameItems = [
    { id: "condom", name: "ស្រោមអនាម័យបុរស និងស្ត្រី", type: "temp", icon: "🛡️" },
    { id: "pills", name: "ថ្នាំលេបពន្យារកំណើតប្រចាំថ្ងៃ", type: "temp", icon: "💊" },
    { id: "vasectomy", name: "ការចងបំពង់នាំស្ពែមចំពោះបុរស", type: "perm", icon: "✂️" },
    { id: "tubal", name: "ការចងដៃស្បូនចំពោះស្ត្រី", type: "perm", icon: "🏥" },
    { id: "iud", name: "កងដាក់ក្នុងស្បូនរបស់ស្ត្រី", type: "temp", icon: "🩺" },
    { id: "implant", name: "កងបង្កប់ក្រោមស្បែកដៃ", type: "temp", icon: "💉" }
  ];

  const playTone = (freq, duration = 0.15) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
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

  const quizQuestions = ${JSON.stringify(questions)};

  const handleOptionSelect = (qIndex, optIndex) => {
    if (l) return;
    const isCorrect = quizQuestions[qIndex].opts[optIndex].c;
    if (isCorrect) {
      d(prev => prev + 1);
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  return e.jsx("div", {
    className: "fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn font-['Battambang']",
    children: e.jsxs("div", {
      className: "bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900 overflow-hidden flex flex-col max-h-[92vh]",
      children: [
        // Modal Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-rose-600 via-pink-600 to-teal-700 p-4 sm:p-6 text-white flex items-center justify-between shrink-0 shadow-md",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3 sm:gap-4",
              children: [
                e.jsx("div", {
                  className: "w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shadow-inner",
                  children: "🛡️"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("span", {
                      className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 uppercase tracking-wider",
                      children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ • ជំពូកទី ៣"
                    }),
                    e.jsx("h2", {
                      className: "text-lg sm:text-xl font-extrabold text-white mt-0.5 leading-tight",
                      children: "មេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌"
                    })
                  ]
                })
              ]
            }),
            e.jsx("button", {
              onClick: t,
              className: "w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-95 text-lg font-bold",
              children: "✕"
            })
          ]
        }),

        // Navigation Bar
        e.jsx("div", {
          className: "bg-slate-100 dark:bg-slate-800 p-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0",
          children: [
            { id: "tab-hero", label: "ទិដ្ឋភាពទូទៅ", icon: "🏠" },
            { id: "tab-foundations", label: "១. មូលដ្ឋានគ្រឹះ", icon: "🌱" },
            { id: "tab-risks", label: "២. ផលវិបាកវ័យសិក្សា", icon: "⚠️" },
            { id: "tab-methods", label: "៣. មធ្យោបាយពន្យារកំណើត", icon: "🛡️" },
            { id: "tab-behavior", label: "៤. ឥរិយាបថសុវត្ថិភាព", icon: "💡" },
            { id: "tab-game", label: "ល្បែងសិក្សា", icon: "🎮" },
            { id: "tab-quiz", label: "សំណួរ ៤០ QCM", icon: "❓" }
          ].map(tab => e.jsxs("button", {
            onClick: () => i(tab.id),
            className: "px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap " + (n === tab.id ? "bg-rose-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"),
            children: [e.jsx("span", { children: tab.icon }), tab.label]
          }))
        }),

        // Modal Main Content Body
        e.jsxs("div", {
          className: "p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 dark:text-slate-200",
          children: [
            // Tab 1: Hero / Overview
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-500 via-pink-600 to-teal-800 text-white p-6 sm:p-8 shadow-xl",
                  children: [
                    e.jsxs("div", {
                      className: "relative z-10 space-y-3 max-w-2xl",
                      children: [
                        e.jsx("span", { className: "px-3 py-1 rounded-full text-xs font-bold bg-white/20 border border-white/30 backdrop-blur-md", children: "សៀវភៅពុម្ពទំព័រទី ៤៦ ដល់ ៥១" }),
                        e.jsx("h1", { className: "text-2xl sm:text-3xl font-black leading-tight", children: "មេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌" }),
                        e.jsx("p", { className: "text-sm text-rose-100 leading-relaxed", children: "ការយល់ដឹងពីការការពារកុំឱ្យមានគភ៌ ជួយឱ្យយុវវ័យចៀសវាងការមានផ្ទៃពោះទាំងវ័យក្មេង ការពារសុខភាពបន្តពូជ និងជួយឱ្យគ្រួសារមានលទ្ធភាពរៀបចំផែនការគ្រួសារបានល្អប្រសើរ។" }),
                        e.jsxs("div", {
                          className: "pt-2 flex flex-wrap gap-3",
                          children: [
                            e.jsxs("button", { onClick: () => i("tab-foundations"), className: "px-4 py-2.5 bg-white text-rose-700 font-bold rounded-xl text-xs shadow-lg hover:bg-rose-50 transition active:scale-95", children: ["ចាប់ផ្តើមរៀន ➔"] }),
                            e.jsxs("button", { onClick: () => i("tab-quiz"), className: "px-4 py-2.5 bg-rose-700/80 hover:bg-rose-700 text-white font-bold rounded-xl text-xs border border-white/30 transition active:scale-95", children: ["ធ្វើតេស្ត ៤០ QCM ❓"] })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // 4 Section Cards Grid
                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                  children: [
                    e.jsxs("div", { onClick: () => i("tab-foundations"), className: "p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 hover:shadow-md transition cursor-pointer group", children: [
                      e.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [e.jsx("span", { className: "text-2xl group-hover:scale-110 transition-transform", children: "🌱" }), e.jsx("h3", { className: "font-bold text-rose-900 dark:text-rose-300", children: "ផ្នែកទី ១ ៖ មូលដ្ឋានគ្រឹះនៃការមានគភ៌" })] }),
                      e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400 leading-relaxed", children: "និយមន័យនៃការមានគភ៌ ការរារាំងការបង្កកំណើត និងអត្ថប្រយោជន៍នៃការយល់ដឹង។" })
                    ]}),
                    e.jsxs("div", { onClick: () => i("tab-risks"), className: "p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 hover:shadow-md transition cursor-pointer group", children: [
                      e.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [e.jsx("span", { className: "text-2xl group-hover:scale-110 transition-transform", children: "⚠️" }), e.jsx("h3", { className: "font-bold text-amber-900 dark:text-amber-300", children: "ផ្នែកទី ២ ៖ ផលវិបាកវ័យសិក្សា" })] }),
                      e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400 leading-relaxed", children: "ផលប៉ះពាល់ផ្នែករាងកាយ ផ្លូវចិត្ត ការសិក្សា និងបន្ទុកសេដ្ឋកិច្ចសង្គម។" })
                    ]}),
                    e.jsxs("div", { onClick: () => i("tab-methods"), className: "p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 hover:shadow-md transition cursor-pointer group", children: [
                      e.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [e.jsx("span", { className: "text-2xl group-hover:scale-110 transition-transform", children: "🛡️" }), e.jsx("h3", { className: "font-bold text-teal-900 dark:text-teal-300", children: "ផ្នែកទី ៣ ៖ មធ្យោបាយពន្យារកំណើត" })] }),
                      e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400 leading-relaxed", children: "មធ្យោបាយបណ្តោះអាសន្ន និងមធ្យោបាយអចិន្ត្រៃយ៍ (ស្រោមអនាម័យ ថ្នាំលេប កងស្បូន កងដៃ)។" })
                    ]}),
                    e.jsxs("div", { onClick: () => i("tab-behavior"), className: "p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 hover:shadow-md transition cursor-pointer group", children: [
                      e.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [e.jsx("span", { className: "text-2xl group-hover:scale-110 transition-transform", children: "💡" }), e.jsx("h3", { className: "font-bold text-indigo-900 dark:text-indigo-300", children: "ផ្នែកទី ៤ ៖ ឥរិយាបថសុវត្ថិភាព" })] }),
                      e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400 leading-relaxed", children: "ការអត់ធ្មត់មិនរួមភេទ ចេះបដិសេធ ចៀសវាងគ្រឿងស្រវឹង និងការពិភាក្សាជាមួយមនុស្សចាស់។" })
                    ]})
                  ]
                })
              ]
            }),

            // Tab 2: Foundations
            n === "tab-foundations" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", { className: "p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-3", children: [
                  e.jsxs("h3", { className: "text-lg font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2", children: [e.jsx("span", { children: "🌱" }), "១. មូលដ្ឋានគ្រឹះនៃការមានគភ៌ និងការការពារ"] }),
                  e.jsx("p", { className: "text-sm leading-relaxed", children: "ការមានគភ៌ ឬការមានផ្ទៃពោះ កើតឡើងនៅពេលមានការជួបគ្នារវាងកោសិកាមេជីវិតឈ្មោល (ស្ពែម) និងកោសិកាមេជីវិតញី (អូវុល) រួចកកើតជាស៊ីកូតដែលទៅកកើតលូតលាស់ក្នុងស្បូន។" }),
                  e.jsxs("div", { className: "p-4 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-800 space-y-2", children: [
                    e.jsx("h4", { className: "font-bold text-rose-700 dark:text-rose-400 text-xs uppercase tracking-wider", children: "តើអ្វីជាការការពារកុំឱ្យមានគភ៌ (ពន្យារកំណើត)?" }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ជាវិធានការឬមធ្យោបាយទាំងឡាយណាដែលរារាំងមិនឱ្យមេជីវិតឈ្មោលជួបជាមួយមេជីវិតញី ឬរារាំងមិនឱ្យអូវុលជ្រុះ ឬមិនឱ្យស៊ីកូតទំនៅនឹងស្បូន។" })
                  ]})
                ]}),
                e.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  e.jsxs("div", { className: "p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 space-y-2", children: [
                    e.jsxs("h4", { className: "font-bold text-teal-800 dark:text-teal-300 text-sm flex items-center gap-1.5", children: [e.jsx("span", { children: "🎯" }), "ចៀសវាងការមានផ្ទៃពោះវ័យក្មេង"] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ជួយឱ្យយុវវ័យអាចផ្តោតលើការសិក្សា រៀនសូត្របានចប់សព្វគ្រប់ និងត្រៀមខ្លួនសម្រាប់អនាគត។" })
                  ]}),
                  e.jsxs("div", { className: "p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 space-y-2", children: [
                    e.jsxs("h4", { className: "font-bold text-indigo-800 dark:text-indigo-300 text-sm flex items-center gap-1.5", children: [e.jsx("span", { children: "👨‍👩‍👧" }), "ការរៀបចំផែនការគ្រួសារ"] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ជួយឱ្យគ្រួសារនាពេលអនាគតមានលទ្ធភាពសេដ្ឋកិច្ច និងសុខភាពមាំមួនក្នុងការចិញ្ចឹមកូន។" })
                  ]})
                ]})
              ]
            }),

            // Tab 3: Risks in School Age
            n === "tab-risks" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", { className: "p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-3", children: [
                  e.jsxs("h3", { className: "text-lg font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2", children: [e.jsx("span", { children: "⚠️" }), "២. ផលវិបាកនៃការមានគភ៌ក្នុងវ័យសិក្សា (វ័យជំទង់)"] }),
                  e.jsx("p", { className: "text-sm leading-relaxed text-slate-700 dark:text-slate-300", children: "ការមានគភ៌នៅវ័យក្មេង ឬវ័យសិក្សា បង្កផលប៉ះពាល់យ៉ាងធ្ងន់ធ្ងរដល់ផ្នែកសំខាន់ៗចំនួន ៤ ៖" })
                ]}),
                e.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  e.jsxs("div", { className: "p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2", children: [
                    e.jsxs("h4", { className: "font-bold text-rose-800 dark:text-rose-300 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "🩺" }), "១. សុខភាពរាងកាយ"] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "អាងត្រគាកតូច ងាយប្រឈមនឹងការសម្រាលកូនពិបាក ការធ្លាក់ឈាមធ្ងន់ធ្ងរ និងទារកកើតមិនគ្រប់ខែ ឬខ្វះទម្ងន់។" })
                  ]}),
                  e.jsxs("div", { className: "p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 space-y-2", children: [
                    e.jsxs("h4", { className: "font-bold text-purple-800 dark:text-purple-300 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "🧠" }), "២. សុខភាពផ្លូវចិត្ត"] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "កើតមានការភ័យខ្លាច ខ្មាសអៀន ភាពតានតឹងចិត្ត និងជំងឺបាក់ទឹកចិត្តធ្ងន់ធ្ងរ។" })
                  ]}),
                  e.jsxs("div", { className: "p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-2", children: [
                    e.jsxs("h4", { className: "font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "📚" }), "៣. ការសិក្សា និងអនាគត"] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ត្រូវបោះបង់ការសិក្សា បាត់បង់ឱកាសការងារល្អ និងបាត់បង់អនាគតភ្លឺស្វាង។" })
                  ]}),
                  e.jsxs("div", { className: "p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2", children: [
                    e.jsxs("h4", { className: "font-bold text-blue-800 dark:text-blue-300 text-sm flex items-center gap-2", children: [e.jsx("span", { children: "💰" }), "៤. បន្ទុកសេដ្ឋកិច្ច និងសង្គម"] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ខ្វះលទ្ធភាពរកប្រាក់ចំណូលចិញ្ចឹមកូន បង្កើតបន្ទុកដល់ឪពុកម្តាយ និងប្រឈមនឹងការរើសអើង។" })
                  ]})
                ]})
              ]
            }),

            // Tab 4: Contraception Methods
            n === "tab-methods" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", { className: "p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 space-y-3", children: [
                  e.jsxs("h3", { className: "text-lg font-bold text-teal-900 dark:text-teal-300 flex items-center gap-2", children: [e.jsx("span", { children: "🛡️" }), "៣. វិធីសាស្ត្រ និងមធ្យោបាយពន្យារកំណើតសំខាន់ៗ"] }),
                  e.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 leading-relaxed", children: "មធ្យោបាយពន្យារកំណើតត្រូវបានបែងចែកជាពីរប្រភេទធំៗគឺ មធ្យោបាយបណ្តោះអាសន្ន និងមធ្យោបាយអចិន្ត្រៃយ៍។" })
                ]}),

                // Filter Buttons
                e.jsxs("div", { className: "flex items-center gap-2", children: [
                  e.jsx("button", { onClick: () => setMethodFilter("all"), className: "px-3 py-1.5 rounded-xl text-xs font-bold transition " + (methodFilter === "all" ? "bg-teal-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300") + "", children: "ទាំងអស់" }),
                  e.jsx("button", { onClick: () => setMethodFilter("temp"), className: "px-3 py-1.5 rounded-xl text-xs font-bold transition " + (methodFilter === "temp" ? "bg-teal-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300") + "", children: "បណ្តោះអាសន្ន" }),
                  e.jsx("button", { onClick: () => setMethodFilter("perm"), className: "px-3 py-1.5 rounded-xl text-xs font-bold transition " + (methodFilter === "perm" ? "bg-teal-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300") + "", children: "អចិន្ត្រៃយ៍ (ការក្រៀវ)" })
                ]}),

                e.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  (methodFilter === "all" || methodFilter === "temp") && e.jsxs("div", { className: "p-4 rounded-xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-900 shadow-xs space-y-2", children: [
                    e.jsxs("div", { className: "flex items-center gap-2", children: [e.jsx("span", { className: "text-xl", children: "🛡️" }), e.jsx("h4", { className: "font-bold text-teal-800 dark:text-teal-300 text-sm", children: "ស្រោមអនាម័យបុរស និងស្ត្រី" })] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ជាមធ្យោបាយតែមួយគត់ដែលអាចការពារទាំងការមានគភ៌ និងការពារជំងឺឆ្លងតាមការរួមភេទ រួមទាំងមេរោគអេដស៍។" })
                  ]}),
                  (methodFilter === "all" || methodFilter === "temp") && e.jsxs("div", { className: "p-4 rounded-xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-900 shadow-xs space-y-2", children: [
                    e.jsxs("div", { className: "flex items-center gap-2", children: [e.jsx("span", { className: "text-xl", children: "💊" }), e.jsx("h4", { className: "font-bold text-teal-800 dark:text-teal-300 text-sm", children: "ថ្នាំលេបពន្យារកំណើត" })] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ថ្នាំលេបប្រចាំថ្ងៃមាននាទីទប់ស្កាត់ការបញ្ចេញអូវុលពីក្រពេញអូវែ និងធ្វើឱ្យទឹករំអិលមាត់ស្បូនខាប់។" })
                  ]}),
                  (methodFilter === "all" || methodFilter === "temp") && e.jsxs("div", { className: "p-4 rounded-xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-900 shadow-xs space-y-2", children: [
                    e.jsxs("div", { className: "flex items-center gap-2", children: [e.jsx("span", { className: "text-xl", children: "💉" }), e.jsx("h4", { className: "font-bold text-teal-800 dark:text-teal-300 text-sm", children: "ថ្នាំចាក់ពន្យារកំណើត" })] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ចាក់ការពារម្តងអាចការពារបានរយៈពេល ៣ ខែពេញ ដោយទប់ស្កាត់ការធ្លាក់អូវុល។" })
                  ]}),
                  (methodFilter === "all" || methodFilter === "temp") && e.jsxs("div", { className: "p-4 rounded-xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-900 shadow-xs space-y-2", children: [
                    e.jsxs("div", { className: "flex items-center gap-2", children: [e.jsx("span", { className: "text-xl", children: "🩺" }), e.jsx("h4", { className: "font-bold text-teal-800 dark:text-teal-300 text-sm", children: "កងដាក់ក្នុងស្បូន" })] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ឧបករណ៍តូចមួយដែលគ្រូពេទ្យដាក់ចូលក្នុងស្បូនស្ត្រី ដើម្បីរារាំងស្ពែមមិនឱ្យបង្កកំណើត ឬមិនឱ្យស៊ីកូតទំស្បូន។" })
                  ]}),
                  (methodFilter === "all" || methodFilter === "temp") && e.jsxs("div", { className: "p-4 rounded-xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-900 shadow-xs space-y-2", children: [
                    e.jsxs("div", { className: "flex items-center gap-2", children: [e.jsx("span", { className: "text-xl", children: "💪" }), e.jsx("h4", { className: "font-bold text-teal-800 dark:text-teal-300 text-sm", children: "កងបង្កប់ក្រោមស្បែកដៃ" })] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "បង្កប់បំពង់តូចមួយក្រោមស្បែកដៃស្ត្រី អាចការពារបានរយៈពេលពី ៣ ទៅ ៥ ឆ្នាំ។" })
                  ]}),
                  (methodFilter === "all" || methodFilter === "perm") && e.jsxs("div", { className: "p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 shadow-xs space-y-2", children: [
                    e.jsxs("div", { className: "flex items-center gap-2", children: [e.jsx("span", { className: "text-xl", children: "✂️" }), e.jsx("h4", { className: "font-bold text-rose-800 dark:text-rose-300 text-sm", children: "ការចងបំពង់នាំស្ពែម (បុរស)" })] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ការវះកាត់តូចមួយដើម្បីកាត់និងចងផ្តាច់បំពង់នាំស្ពែម មិនឱ្យស្ពែមចេញមកក្រៅជារៀងរហូត។" })
                  ]}),
                  (methodFilter === "all" || methodFilter === "perm") && e.jsxs("div", { className: "p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 shadow-xs space-y-2", children: [
                    e.jsxs("div", { className: "flex items-center gap-2", children: [e.jsx("span", { className: "text-xl", children: "🏥" }), e.jsx("h4", { className: "font-bold text-rose-800 dark:text-rose-300 text-sm", children: "ការចងដៃស្បូន (ស្ត្រី)" })] }),
                    e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "ការវះកាត់ចងនិងកាត់បំពង់នាំអូវុល មិនឱ្យអូវុលជួបគ្នាជាមួយស្ពែមបានជារៀងរហូត។" })
                  ]})
                ]})
              ]
            }),

            // Tab 5: Behavioral Safety
            n === "tab-behavior" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", { className: "p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-3", children: [
                  e.jsxs("h3", { className: "text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2", children: [e.jsx("span", { children: "💡" }), "៤. ឥរិយាបថការពារខ្លួនសម្រាប់យុវវ័យ"] }),
                  e.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 leading-relaxed", children: "ដើម្បីចៀសវាងការមានគភ៌ដោយចៃដន្យ និងការពារសុខភាពបន្តពូជ យុវវ័យត្រូវអនុវត្ត ៥ ចំណុចសំខាន់ ៖" })
                ]}),

                e.jsxs("div", { className: "space-y-3", children: [
                  [
                    { title: "១. ប្រកាន់ខ្ជាប់នូវការអត់ធ្មត់", desc: "មិនរួមភេទក្នុងវ័យសិក្សា ដែលជាវិធីសុវត្ថិភាពបំផុត ១០០ ភាគរយ។", icon: "🛡️" },
                    { title: "២. ចេះបដិសេធដោយម៉ឺងម៉ាត់", desc: "យល់ដឹងពីវិធីបដិសេធចំពោះការលួងលោម ឬការបង្ខិតបង្ខំពីដៃគូ ឬមិត្តភក្តិ។", icon: "🚫" },
                    { title: "៣. ចៀសវាងគ្រឿងស្រវឹង និងគ្រឿងញៀន", desc: "សារធាតុទាំងនេះធ្វើឱ្យបាត់បង់ម្ចាស់ការលើខ្លួនឯង និងងាយប្រឈមគ្រោះថ្នាក់។", icon: "🍷" },
                    { title: "៤. មិននៅស្ងាត់ពីរនាក់នៅកន្លែងស្ងាត់កំបាំង", desc: "ចៀសវាងទីកន្លែងកំបាំងជាមួយមិត្តភក្តិភេទផ្ទុយគ្នា។", icon: "👥" },
                    { title: "៥. ពិភាក្សាជាមួយមនុស្សចាស់ជិតស្និទ្ធ", desc: "ពិភាក្សាជាមួយឪពុកម្តាយ អាណាព្យាបាល គ្រូបង្រៀន ឬគ្រូពេទ្យជំនាញ។", icon: "👨‍🏫" }
                  ].map((item, idx) => e.jsxs("div", {
                    className: "p-4 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 flex items-start gap-3 shadow-xs",
                    children: [
                      e.jsx("span", { className: "text-2xl shrink-0 p-1 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg", children: item.icon }),
                      e.jsxs("div", { children: [
                        e.jsx("h4", { className: "font-bold text-indigo-900 dark:text-indigo-300 text-sm", children: item.title }),
                        e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed", children: item.desc })
                      ]})
                    ]
                  }))
                ]})
              ]
            }),

            // Tab 6: Interactive Game
            n === "tab-game" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", { className: "p-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white space-y-2", children: [
                  e.jsxs("h3", { className: "text-lg font-extrabold flex items-center gap-2", children: [e.jsx("span", { children: "🎮" }), "ល្បែងបែងចែកមធ្យោបាយពន្យារកំណើត"] }),
                  e.jsx("p", { className: "text-xs text-purple-100", children: "ចាត់ថ្នាក់មធ្យោបាយខាងក្រោមឱ្យបានត្រឹមត្រូវថាជា បណ្តោះអាសន្ន ឬ អចិន្ត្រៃយ៍ ៖" })
                ]}),

                e.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  gameItems.map(item => e.jsxs("div", {
                    className: "p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs",
                    children: [
                      e.jsxs("div", { className: "flex items-center gap-2", children: [e.jsx("span", { className: "text-2xl", children: item.icon }), e.jsx("span", { className: "font-bold text-xs text-slate-800 dark:text-slate-200", children: item.name })] }),
                      e.jsxs("div", { className: "flex gap-2", children: [
                        e.jsx("button", {
                          onClick: () => {
                            const isCorrect = item.type === "temp";
                            setGameAnswers(prev => ({ ...prev, [item.id]: isCorrect }));
                            if (isCorrect) playSuccessSound(); else playErrorSound();
                          },
                          className: "flex-1 py-1.5 rounded-lg text-xs font-bold transition " + (gameAnswers[item.id] === true && item.type === "temp" ? "bg-emerald-600 text-white" : gameAnswers[item.id] === false ? "bg-rose-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200") + "",
                          children: "បណ្តោះអាសន្ន"
                        }),
                        e.jsx("button", {
                          onClick: () => {
                            const isCorrect = item.type === "perm";
                            setGameAnswers(prev => ({ ...prev, [item.id]: isCorrect }));
                            if (isCorrect) playSuccessSound(); else playErrorSound();
                          },
                          className: "flex-1 py-1.5 rounded-lg text-xs font-bold transition " + (gameAnswers[item.id] === true && item.type === "perm" ? "bg-emerald-600 text-white" : gameAnswers[item.id] === false ? "bg-rose-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200") + "",
                          children: "អចិន្ត្រៃយ៍"
                        })
                      ]})
                    ]
                  }))
                ]})
              ]
            }),

            // Tab 7: 40 QCM Quiz
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
                          e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2", children: "មេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌" }),
                          e.jsx("p", { className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1", children: "ចម្លើយត្រូវបានរៀបចំឆ្លាស់គ្នាស្មើៗគ្នា (ក, ខ, គ, ឃ) និងមានប្រវែងស្មើគ្នាដើម្បីវាស់ស្ទង់ការយល់ដឹងពិតប្រាកដ shadow-xs" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-2xl shrink-0",
                        children: [
                          e.jsx("span", { className: "text-xs text-emerald-800 dark:text-emerald-300 font-bold", children: "ឆ្លើយត្រូវ៖" }),
                          e.jsxs("span", { className: "text-xl font-bold text-emerald-700 dark:text-emerald-400", children: [Object.keys(userAnswers).filter(idx => {
                            const item = Zi8[idx];
                            if (!item) return false;
                            const opts = item.options || item.opts;
                            const sel = opts[userAnswers[idx]];
                            return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                          }).length, " / ", Zi8.length] })
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
                          e.jsxs("span", { className: "text-xs text-emerald-700 dark:text-emerald-400 font-semibold", children: ["បានឆ្លើយ៖ ", Object.keys(userAnswers).length, " / ", Zi8.length] })
                        ]
                      }),
                      e.jsx("div", {
                        className: "grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5 max-h-32 overflow-y-auto p-1",
                        children: Zi8.map((qItem, qIdx) => {
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
                        const item = Zi8[idx];
                        if (!item) return false;
                        const opts = item.options || item.opts;
                        const sel = opts[userAnswers[idx]];
                        return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                      }).length, " លើ ", Zi8.length, " សំណួរ (", Math.round((Object.keys(userAnswers).filter(idx => {
                        const item = Zi8[idx];
                        if (!item) return false;
                        const opts = item.options || item.opts;
                        const sel = opts[userAnswers[idx]];
                        return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                      }).length / Zi8.length) * 100), "%)!"] }),
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
                                  e.jsx("span", { className: "text-xs text-slate-400", children: "មេរៀនទី ៨" })
                                ]
                              }),
                              e.jsxs("span", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: ["សំណួរ ", currentQIndex + 1, " / ", Zi8.length] })
                            ]
                          }),
                          e.jsxs("h3", { className: "text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug", children: [currentQIndex + 1, ". ", Zi8[currentQIndex] ? (Zi8[currentQIndex].question || Zi8[currentQIndex].q) : ""] }),
                          e.jsx("div", {
                            className: "space-y-2.5 pt-1 w-full",
                            children: (Zi8[currentQIndex] ? (Zi8[currentQIndex].options || Zi8[currentQIndex].opts) : []).map((opt, optIdx) => {
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
                              const curItem = Zi8[currentQIndex];
                              const opts = curItem ? (curItem.options || curItem.opts) : [];
                              const selOpt = opts[userAnswers[currentQIndex]];
                              const isCorr = selOpt ? (selOpt.isCorrect !== undefined ? selOpt.isCorrect : selOpt.c) : false;
                              return isCorr ? "mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200" : "mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200";
                            })(),
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2 font-bold text-xs sm:text-sm mb-1",
                                children: (() => {
                                  const curItem = Zi8[currentQIndex];
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
                                const curItem = Zi8[currentQIndex];
                                return curItem ? (curItem.exp || curItem.e || (curItem.options || curItem.opts)[userAnswers[currentQIndex]]?.exp || (curItem.options || curItem.opts)[userAnswers[currentQIndex]]?.e || "") : "";
                              })() })
                            ]
                          }) : e.jsxs("div", {
                            className: "mt-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-center gap-2 text-xs italic",
                            children: [
                              e.jsx("span", { children: "💡" }),
                              e.jsxs("span", { children: ["ជំនួយស្មារតី៖ ", Zi8[currentQIndex] ? (Zi8[currentQIndex].hint || Zi8[currentQIndex].h) : ""] })
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
                          e.jsxs("span", { className: "text-xs font-bold text-slate-500 dark:text-slate-400", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ", Zi8.length] }),
                          e.jsxs("button", {
                            onClick: () => {
                              playTone(600, 0.08);
                              if (currentQIndex < Zi8.length - 1) {
                                setCurrentQIndex(prev => prev + 1);
                              } else {
                                setIsFinished(!1);
                                setIsFinished(!0);
                                try { playTone(783.99, 0.3); } catch(e){}
                              }
                            },
                            className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-md cursor-pointer flex items-center gap-1.5",
                            children: [
                              e.jsx("span", { children: currentQIndex === Zi8.length - 1 ? "បញ្ចប់តេស្ត" : "សំណួរបន្ទាប់" }),
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
  console.log("Zi8 code parses cleanly with ZERO syntax errors!");
  fs.writeFileSync("scripts/rz8_component_code.js", code);
  console.log("Written scripts/rz8_component_code.js successfully!");
} catch (err) {
  console.error("Syntax error generating Zi8:", err);
  process.exit(1);
}
