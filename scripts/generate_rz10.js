import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import esbuild from 'esbuild';

console.log("--- Generating Rz10 component code for Science Lesson 10 (Digestive System) ---");

const questions = JSON.parse(fs.readFileSync('scripts/lesson10_questions.json', 'utf8'));

const code = `var Rz10 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);
  const [activeOrgan, setActiveOrgan] = y.useState(1);

  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
      };
    }
  }, [r, n]);

  const quizQuestions = ${JSON.stringify(questions)};

  const handleSelectAnswer = (qIdx, optIdx) => {
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const score = Object.keys(userAnswers).reduce((acc, qIdx) => {
    const q = quizQuestions[qIdx];
    if (q && q.options[userAnswers[qIdx]] && q.options[userAnswers[qIdx]].isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const playTone = (freq = 523.25, type = "sine") => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  };

  const organsList = [
    {
      id: 1,
      name: "មាត់ (Mouth)",
      icon: "👄",
      juice: "ទឹកមាត់ (Saliva)",
      length: "បបូរមាត់, ធ្មេញ, អណ្តាត",
      role: "បបូរមាត់ទទួលអាហារ, អណ្តាតច្របល់, ធ្មេញទំពារកិនទម្លុះអាហារដែលធ្វើឱ្យសើមដោយទឹកមាត់។ ទឹកមាត់បំប្លែងអាហារលើកទី១។",
      state: "អាហារល្អិតៗ ហើយសើម"
    },
    {
      id: 2,
      name: "ដើមក (Pharynx) & បំពង់អាហារ (Esophagus)",
      icon: "🫁",
      juice: "គ្មាន",
      length: "ស្ថិតនៅចន្លោះបំពង់កនិងក្រពះ",
      role: "ដើមកទទួលអាហារពីមាត់ ហើយបំពង់អាហារបញ្ជូនអាហារបន្តទៅកាន់ក្រពះ។",
      state: "អាហារល្អិតៗ ហើយសើម"
    },
    {
      id: 3,
      name: "ក្រពះ (Stomach)",
      icon: "🫄",
      juice: "រសក្រពះ (Gastric Juice)",
      length: "សរីរាង្គកោងរាងដូចថង់",
      role: "ច្របល់និងបំប្លែងអាហារមួយចំនួនឱ្យទៅជាអាហាររំលាយ ដោយសារអង់ស៊ីមក្នុងរសក្រពះ។",
      state: "អាហាររំលាយ (Chyme)"
    },
    {
      id: 4,
      name: "ពោះវៀនតូច (Small Intestine)",
      icon: "🌀",
      juice: "ទឹកប្រមាត់, រសលំពែង, រសពោះវៀនតូច",
      length: "ប្រវែង ៧ ទៅ ៨ ម៉ែត្រ (7–8m)",
      role: "បំប្លែងអាហារមិនទាន់រំលាយដែលនៅសល់ឱ្យទៅជាអាហាររំលាយ។ សារធាតុចិញ្ចឹមត្រូវបានស្រូបតាមភ្នាសពោះវៀនតូចចូលក្នុងឈាមយកទៅចិញ្ចឹមសារពាង្គកាយ។",
      state: "សារធាតុចិញ្ចឹមរាវ (Nutrients in Blood)"
    },
    {
      id: 5,
      name: "ពោះវៀនធំ (Large Intestine)",
      icon: "➰",
      juice: "គ្មាន",
      length: "ប្រវែង ១.២ ទៅ ១.៥ ម៉ែត្រ (1.2–1.5m)",
      role: "ទទួលអាហារដែលមិនរំលាយ (កាកសំណល់) ស្រូបយករាវដែលនៅសល់ រុញកាកសំណល់ទៅកាន់ទ្វារធំ។",
      state: "កាកសំណល់អាហារ (Feces)"
    },
    {
      id: 6,
      name: "ទ្វារធំ / ទ្វារលាមក (Anus)",
      icon: "🚪",
      juice: "គ្មាន",
      length: "ច្រកចេញចុងក្រោយ",
      role: "បញ្ចេញកាកសំណល់អាហារ (លាមក) មកក្រៅរាងកាយ។",
      state: "លាមក (Excreted Feces)"
    }
  ];

  return e.jsx("div", {
    "data-modal-open": "true",
    className: "fixed inset-0 z-[100] overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-['Battambang']",
    children: e.jsxs("div", {
      className: "bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-emerald-200 dark:border-emerald-900 overflow-hidden flex flex-col max-h-[92vh]",
      children: [
        // Modal Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-4 sm:p-6 text-white flex items-center justify-between shrink-0 shadow-md",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3 sm:gap-4",
              children: [
                e.jsx("div", {
                  className: "w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shadow-inner",
                  children: "🥗"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("span", {
                      className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 uppercase tracking-wider",
                      children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ • ជំពូកទី ៣"
                    }),
                    e.jsx("h2", {
                      className: "text-lg sm:text-xl font-extrabold text-white mt-0.5 leading-tight font-moul",
                      children: "មេរៀនទី ១០ ៖ ប្រព័ន្ធរំលាយអាហារ"
                    }),
                    e.jsx("p", {
                      className: "text-xs text-emerald-100 mt-0.5 hidden sm:block",
                      children: "សៀវភៅពុម្ពក្រសួងអប់រំ ទំព័រទី ៦០ ដល់ ៦៣ • ៤០ សំណួរ QCM ពេញលេញ"
                    })
                  ]
                })
              ]
            }),
            e.jsx("button", {
              onClick: t,
              className: "w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg font-bold transition cursor-pointer border border-white/20",
              children: "✕"
            })
          ]
        }),

        // Tab Navigation Bar
        e.jsx("div", {
          className: "bg-slate-100 dark:bg-slate-800/80 p-2 border-b border-slate-200 dark:border-slate-700 shrink-0 overflow-x-auto no-scrollbar",
          children: e.jsxs("div", {
            className: "flex items-center gap-2 min-w-max",
            children: [
              { id: "tab-hero", label: "ទិដ្ឋភាពទូទៅ", icon: "📖" },
              { id: "tab-organs", label: "១. រូបផ្គុំ & តួនាទី", icon: "⚙️" },
              { id: "tab-health", label: "២. ជំងឺ & អនាម័យ", icon: "🩺" },
              { id: "tab-quiz", label: "៣. សំណួរ ៤០ QCM", icon: "❓" }
            ].map(tab => e.jsxs("button", {
              type: "button",
              onClick: () => i(tab.id),
              className: \`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer \${n === tab.id ? "bg-emerald-600 text-white shadow-md" : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"}\`,
              children: [
                e.jsx("span", { children: tab.icon }),
                e.jsx("span", { children: tab.label })
              ]
            }, tab.id))
          })
        }),

        // Modal Scrollable Content Body
        e.jsxs("div", {
          className: "p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50 dark:bg-slate-900/50",
          children: [
            // Tab 1: Hero Overview
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-200 dark:border-emerald-800/60 p-5 rounded-3xl space-y-3",
                  children: [
                    e.jsx("h3", {
                      className: "text-base font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-moul",
                      children: "🌟 និយមន័យនៃការរំលាយអាហារ"
                    }),
                    e.jsx("p", {
                      className: "text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed",
                      children: "អាហារជាតម្រូវការចាំបាច់បំផុតរបស់មនុស្ស ក្រៅពីខ្យល់និងទឹក។ អាហារដែលយើងបរិភោគ ត្រូវបំបែកជាសារធាតុងាយមុននឹងបញ្ជូនទៅឱ្យគ្រប់ផ្នែកទាំងអស់នៃសារពាង្គកាយ។ លំនាំនៃការបំបែកអាហារនេះហៅថា «ការរំលាយអាហារ» ដែលប្រព្រឹត្តទៅនៅក្នុង «ប្រព័ន្ធរំលាយអាហារ»។"
                    })
                  ]
                }),

                // Food Journey Flow
                e.jsxs("div", {
                  className: "bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs",
                  children: [
                    e.jsx("h3", {
                      className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-moul",
                      children: "🔄 ផ្លូវធ្វើដំណើរនៃអាហារក្នុងប្រព័ន្ធរំលាយអាហារ"
                    }),
                    e.jsxs("div", {
                      className: "flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700 dark:text-slate-300 pt-1",
                      children: [
                        e.jsx("span", { className: "px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200", children: "១. អាហារ" }),
                        e.jsx("span", { children: "➔" }),
                        e.jsx("span", { className: "px-3 py-1.5 rounded-xl bg-teal-100 text-teal-900 border border-teal-200", children: "២. មាត់" }),
                        e.jsx("span", { children: "➔" }),
                        e.jsx("span", { className: "px-3 py-1.5 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-200", children: "៣. ដើមក (បំពង់ក)" }),
                        e.jsx("span", { children: "➔" }),
                        e.jsx("span", { className: "px-3 py-1.5 rounded-xl bg-blue-100 text-blue-900 border border-blue-200", children: "៤. បំពង់អាហារ" }),
                        e.jsx("span", { children: "➔" }),
                        e.jsx("span", { className: "px-3 py-1.5 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-200", children: "៥. ក្រពះ" }),
                        e.jsx("span", { children: "➔" }),
                        e.jsx("span", { className: "px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 border border-purple-200", children: "៦. ពោះវៀនតូច (7-8m)" }),
                        e.jsx("span", { children: "➔" }),
                        e.jsx("span", { className: "px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200", children: "៧. ពោះវៀនធំ (1.2-1.5m)" }),
                        e.jsx("span", { children: "➔" }),
                        e.jsx("span", { className: "px-3 py-1.5 rounded-xl bg-rose-100 text-rose-900 border border-rose-200", children: "៨. ទ្វារធំ (ទ្វារលាមក)" })
                      ]
                    })
                  ]
                }),

                // Key Info Highlights
                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "bg-emerald-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-1.5",
                      children: [
                        e.jsxs("span", { className: "font-bold text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2", children: [e.jsx("span", { children: "📏" }), "ប្រវែងពោះវៀនតូច"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "មានប្រវែង ៧ ទៅ ៨ ម៉ែត្រ (7–8m) ជាសរីរាង្គបំប្លែងអាហារចុងក្រោយ និងស្រូបយកសារធាតុចិញ្ចឹមចូលទៅក្នុងឈាម។" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-teal-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-teal-200 dark:border-slate-700 space-y-1.5",
                      children: [
                        e.jsxs("span", { className: "font-bold text-xs text-teal-800 dark:text-teal-300 flex items-center gap-2", children: [e.jsx("span", { children: "➰" }), "ប្រវែងពោះវៀនធំ"] }),
                        e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: "មានប្រវែង ១.២ ទៅ ១.៥ ម៉ែត្រ (1.2–1.5m) មានតួនាទីដឹកនាំកាកសំណល់អាហារដែលមិនរំលាយទៅបញ្ចេញតាមទ្វារធំ។" })
                      ]
                    })
                  ]
                }),

                // Quick CTA
                e.jsxs("div", {
                  className: "flex justify-end gap-3 pt-2",
                  children: [
                    e.jsxs("button", {
                      type: "button",
                      onClick: () => i("tab-organs"),
                      className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer",
                      children: ["មើលតួនាទីសរីរាង្គនីមួយៗ ➔"]
                    })
                  ]
                })
              ]
            }),

            // Tab 2: Organs & Functions
            n === "tab-organs" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [
                    e.jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white font-moul", children: "⚙️ តួនាទីនៃសរីរាង្គនិងរសរំលាយអាហារ" }),
                    e.jsx("span", { className: "text-xs text-slate-500", children: "សៀវភៅពុម្ព ទំព័រ ៦១" })
                  ]
                }),

                e.jsxs("div", {
                  className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                  children: organsList.map(organ => e.jsxs("div", {
                    className: \`p-4 rounded-2xl border transition duration-200 cursor-pointer space-y-2 \${activeOrgan === organ.id ? "bg-emerald-50 dark:bg-slate-800 border-emerald-400 ring-2 ring-emerald-300/40" : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-300"}\`,
                    onClick: () => setActiveOrgan(organ.id),
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          e.jsxs("div", { className: "flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white", children: [e.jsx("span", { className: "text-lg", children: organ.icon }), organ.name] }),
                          e.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold", children: organ.length })
                        ]
                      }),
                      e.jsxs("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: [e.jsx("strong", { className: "text-emerald-700 dark:text-emerald-400", children: "រសរំលាយអាហារ ៖ " }), organ.juice] }),
                      e.jsxs("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: [e.jsx("strong", { className: "text-teal-700 dark:text-teal-400", children: "តួនាទី ៖ " }), organ.role] }),
                      e.jsxs("div", { className: "pt-1 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]", children: [
                        e.jsx("span", { className: "text-slate-500", children: "ស្ថានភាពចំណីអាហារ ៖" }),
                        e.jsx("span", { className: "font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg", children: organ.state })
                      ] })
                    ]
                  }, organ.id))
                })
              ]
            }),

            // Tab 3: Health & Hygiene
            n === "tab-health" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "bg-amber-50 dark:bg-slate-800 p-5 rounded-3xl border border-amber-200 dark:border-slate-700 space-y-3",
                  children: [
                    e.jsx("h3", { className: "text-sm font-bold text-amber-900 dark:text-amber-300 font-moul", children: "🩺 ជំងឺនៃប្រព័ន្ធរំលាយអាហារ និងមូលហេតុ" }),
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs",
                      children: [
                        e.jsxs("div", { className: "p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-amber-200/80 space-y-1", children: [
                          e.jsx("span", { className: "font-bold text-rose-600", children: "• ពុកធ្មេញ ៖" }),
                          e.jsx("p", { className: "text-slate-600 dark:text-slate-300", children: "បណ្តាលមកពីការមិនបានធ្វើអនាម័យមាត់ធ្មេញ ឬបរិភោគអាហារក្តៅពេក/ត្រជាក់ពេក។" })
                        ] }),
                        e.jsxs("div", { className: "p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-amber-200/80 space-y-1", children: [
                          e.jsx("span", { className: "font-bold text-rose-600", children: "• ជំងឺក្រពះ ៖" }),
                          e.jsx("p", { className: "text-slate-600 dark:text-slate-300", children: "បណ្តាលមកពីការបរិភោគអាហារហឹរពេក ឬបរិភោគមិនទៀងពេល។" })
                        ] }),
                        e.jsxs("div", { className: "p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-amber-200/80 space-y-1", children: [
                          e.jsx("span", { className: "font-bold text-rose-600", children: "• ទល់លាមក ៖" }),
                          e.jsx("p", { className: "text-slate-600 dark:text-slate-300", children: "បណ្តាលមកពីការបរិភោគអាហាររឹងពេក និងខ្វះធាតុទឹក ឬផ្លែឈើ។" })
                        ] }),
                        e.jsxs("div", { className: "p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-amber-200/80 space-y-1", children: [
                          e.jsx("span", { className: "font-bold text-rose-600", children: "• រលាកពោះវៀន / រាក ៖" }),
                          e.jsx("p", { className: "text-slate-600 dark:text-slate-300", children: "បណ្តាលមកពីការបរិភោគអាហារមិនស្អាត ឬគ្មានអនាម័យត្រឹមត្រូវ។" })
                        ] })
                      ]
                    })
                  ]
                }),

                // Hygiene Rules Box
                e.jsxs("div", {
                  className: "bg-emerald-50 dark:bg-slate-800 p-5 rounded-3xl border border-emerald-200 dark:border-slate-700 space-y-3",
                  children: [
                    e.jsx("h3", { className: "text-sm font-bold text-emerald-900 dark:text-emerald-300 font-moul", children: "✨ ៦ វិធានការអនាម័យប្រព័ន្ធរំលាយអាហារ" }),
                    e.jsxs("ul", {
                      className: "space-y-2 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside leading-relaxed",
                      children: [
                        e.jsx("li", { children: "ធ្វើអនាម័យមាត់ ធ្មេញឱ្យបានទៀងទាត់" }),
                        e.jsx("li", { children: "ទំពារអាហារឱ្យបានម៉ត់ល្អមុនពេលលេប" }),
                        e.jsx("li", { children: "បរិភោគអាហារឱ្យបានទៀងពេលរាល់ថ្ងៃ" }),
                        e.jsx("li", { children: "បរិភោគចំណីអាហារដែលមានអនាម័យនិងជីវជាតិត្រឹមត្រូវ" }),
                        e.jsx("li", { children: "ចៀសវាងការបរិភោគអាហារច្រើនហួស អាហារក្តៅពេក រឹងពេក និងហឹរពេក" }),
                        e.jsx("li", { children: "បរិភោគអាហារជួយសម្រួលដល់ការបត់ជើងធំដូចជា ល្ហុង និងចេក..." })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 4: 40 QCM Quiz
            n === "tab-quiz" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                // Quiz Question Header
                e.jsxs("div", {
                  className: "bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl flex items-center justify-between shadow-md",
                  children: [
                    e.jsxs("div", {
                      children: [
                        e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded", children: "តេស្តវាស់ស្ទង់សមត្ថភាព" }),
                        e.jsx("h3", { className: "text-sm font-bold mt-1 font-moul", children: "សំណួរ ៤០ QCM ៖ មេរៀនទី ១០ ប្រព័ន្ធរំលាយអាហារ" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "text-right",
                      children: [
                        e.jsxs("span", { className: "text-xs font-bold bg-white/20 px-3 py-1 rounded-xl", children: ["សំណួរទី ", currentQIndex + 1, " / ៤០"] }),
                        e.jsxs("p", { className: "text-[10px] text-emerald-100 mt-1", children: ["ឆ្លើយត្រូវ ៖ ", score, " / ៤០"] })
                      ]
                    })
                  ]
                }),

                // Active Question Card
                quizQuestions[currentQIndex] && e.jsxs("div", {
                  className: "bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm",
                  children: [
                    e.jsx("h4", {
                      className: "text-sm font-bold text-slate-900 dark:text-white leading-relaxed font-moul",
                      children: quizQuestions[currentQIndex].question
                    }),

                    e.jsx("div", {
                      className: "space-y-2.5 pt-2",
                      children: quizQuestions[currentQIndex].options.map((opt, optIdx) => {
                        const isSelected = userAnswers[currentQIndex] === optIdx;
                        return e.jsxs("button", {
                          type: "button",
                          onClick: () => {
                            playTone(isSelected ? 400 : 600, 0.08);
                            handleSelectAnswer(currentQIndex, optIdx);
                          },
                          className: \`w-full p-3.5 rounded-2xl text-xs font-semibold text-left transition border flex items-center justify-between cursor-pointer \${isSelected ? "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/40" : "bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600"}\`,
                          children: [
                            e.jsxs("span", {
                              className: "flex items-center gap-3",
                              children: [
                                e.jsx("span", {
                                  className: \`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border \${isSelected ? "bg-white text-emerald-800 border-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"}\`,
                                  children: String.fromCharCode(65 + optIdx)
                                }),
                                e.jsx("span", { children: opt.text })
                              ]
                            }),
                            isSelected && e.jsx("span", { children: "✓" })
                          ]
                        }, optIdx);
                      })
                    }),

                    // Answer explanation box if answered
                    userAnswers[currentQIndex] !== undefined && e.jsxs("div", {
                      className: \`p-3.5 rounded-2xl text-xs space-y-1 animate-fadeIn \${quizQuestions[currentQIndex].options[userAnswers[currentQIndex]]?.isCorrect ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-rose-50 text-rose-900 border border-rose-200"}\`,
                      children: [
                        e.jsxs("div", { className: "font-bold flex items-center gap-1.5", children: [
                          e.jsx("span", { children: quizQuestions[currentQIndex].options[userAnswers[currentQIndex]]?.isCorrect ? "✅ ត្រឹមត្រូវ!" : "❌ មិនទាន់ត្រឹមត្រូវ!" }),
                        ] }),
                        e.jsx("p", { className: "text-[11px] leading-relaxed", children: quizQuestions[currentQIndex].explanation })
                      ]
                    }),

                    // Quiz Navigation Controls
                    e.jsxs("div", {
                      className: "flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => setCurrentQIndex(prev => Math.max(0, prev - 1)),
                          disabled: currentQIndex === 0,
                          className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs transition cursor-pointer",
                          children: "← សំណួរមុន"
                        }),
                        currentQIndex < 39 ?
                          e.jsx("button", {
                            type: "button",
                            onClick: () => setCurrentQIndex(prev => Math.min(39, prev + 1)),
                            className: "px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer",
                            children: "សំណួរបន្ទាប់ →"
                          }) :
                          e.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              setIsFinished(!0);
                              s && s(\`បញ្ចប់តេស្ត! អ្នកឆ្លើយត្រូវ \${score} / ៤០ សំណួរ\`);
                            },
                            className: "px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md transition cursor-pointer",
                            children: ["🏆 បញ្ចប់ការប្រឡង (", score, "/៤០)"]
                          })
                      ]
                    })
                  ]
                }),

                // Finish Results Summary Box
                isFinished && e.jsxs("div", {
                  className: "bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-xl space-y-3 animate-in zoom-in-95 duration-200",
                  children: [
                    e.jsx("h3", { className: "text-base font-bold font-moul", children: "🎉 លទ្ធផលការប្រឡងតេស្តមេរៀនទី ១០" }),
                    e.jsxs("div", { className: "flex items-center gap-4 text-xs font-bold", children: [
                      e.jsxs("span", { children: ["ពិន្ទុសរុប ៖ ", score, " / ៤០ (", Math.round((score / 40) * 100), "%)"] }),
                      e.jsxs("span", { children: ["រង្វាន់ XP ៖ +", score * 50, " XP ⭐"] })
                    ] }),
                    e.jsx("p", { className: "text-xs text-emerald-100", children: score >= 28 ? "អបអរសាទរ! អ្នកបានឆ្លងកាត់ការវាស់ស្ទង់សមត្ថភាពមេរៀនទី ១០ យ៉ាងជោគជ័យ។" : "សូមព្យាយាមអានមេរៀនឡើងវិញ និងធ្វើតេស្តម្តងទៀតដើម្បីពង្រឹងចំណេះដឹងបន្ថែម។" }),
                    e.jsx("button", {
                      type: "button",
                      onClick: () => {
                        setIsFinished(!1);
                        setUserAnswers({});
                        setCurrentQIndex(0);
                      },
                      className: "px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 transition cursor-pointer",
                      children: "🔄 ធ្វើតេស្តឡើងវិញ"
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
};`;

// Validate syntax
try {
  esbuild.transformSync(code, { loader: "js" });
  console.log("ESBUILD VALIDATION: Rz10 code passes 100%!");
  fs.writeFileSync('scripts/rz10_component_code.js', code);
  console.log("Successfully created scripts/rz10_component_code.js!");
} catch (err) {
  console.error("Syntax error building Rz10:", err.message);
  process.exit(1);
}
