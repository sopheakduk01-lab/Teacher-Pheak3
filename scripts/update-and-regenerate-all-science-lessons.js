import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execSync } from 'child_process';

const lessons = [
  { num: 2, script: 'scripts/create_rz2.js', out: 'scripts/rz2_component_code.js', title: 'មេរៀនទី ២ ៖ ការដាំដំណាំ', badge: 'មេរៀនទី ២' },
  { num: 3, script: 'scripts/generate_rz3.js', out: 'scripts/rz3_component_code.js', title: 'មេរៀនទី ៣ ៖ ការចិញ្ចឹមសត្វ', badge: 'មេរៀនទី ៣' },
  { num: 4, script: 'scripts/generate_rz4.js', out: 'scripts/rz4_component_code.js', title: 'មេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ', badge: 'មេរៀនទី ៤' },
  { num: 5, script: 'scripts/generate_rz5.js', out: 'scripts/rz5_component_code.js', title: 'មេរៀនទី ៥ ៖ ធនធានធម្មជាតិ', badge: 'មេរៀនទី ៥' },
  { num: 6, script: 'scripts/generate_rz6.js', out: 'scripts/rz6_component_code.js', title: 'មេរៀនទី ៦ ៖ ប្រដាប់បន្តពូជមនុស្ស', badge: 'មេរៀនទី ៦' },
  { num: 7, script: 'scripts/generate_rz7.js', out: 'scripts/rz7_component_code.js', title: 'មេរៀនទី ៧ ៖ ភាពពេញវ័យ', badge: 'មេរៀនទី ៧' },
  { num: 8, script: 'scripts/generate_rz8.js', out: 'scripts/rz8_component_code.js', title: 'មេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌', badge: 'មេរៀនទី ៨' }
];

function buildLesson1QuizUI(title, badge) {
  return `n === "tab-quiz" && e.jsx("div", {
              className: "space-y-6 animate-fadeIn font-['Battambang']",
              children: e.jsxs("div", {
                className: "bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm",
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
                          e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2", children: "${title}" }),
                          e.jsx("p", { className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1", children: "ចម្លើយត្រូវបានរៀបចំឆ្លាស់គ្នាស្មើៗគ្នា (ក, ខ, គ, ឃ) និងមានប្រវែងស្មើគ្នាដើម្បីវាស់ស្ទង់ការយល់ដឹងពិតប្រាកដ shadow-xs" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-2xl shrink-0",
                        children: [
                          e.jsx("span", { className: "text-xs text-emerald-800 dark:text-emerald-300 font-bold", children: "ឆ្លើយត្រូវ៖" }),
                          e.jsxs("span", { className: "text-xl font-bold text-emerald-700 dark:text-emerald-400", children: [Object.keys(userAnswers).filter(idx => quizQuestions[idx].opts[userAnswers[idx]].c).length, " / ", quizQuestions.length] })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "mb-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                          e.jsx("span", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "តារាងលេខសំណួរ (ចុចលើលេខដើម្បីផ្លាស់ប្តូរ)៖" }),
                          e.jsxs("span", { className: "text-xs text-emerald-700 dark:text-emerald-400 font-semibold", children: ["បានឆ្លើយ៖ ", Object.keys(userAnswers).length, " / ", quizQuestions.length] })
                        ]
                      }),
                      e.jsx("div", {
                        className: "grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5 max-h-32 overflow-y-auto p-1",
                        children: quizQuestions.map((qItem, qIdx) => {
                          const isCurrent = qIdx === currentQIndex;
                          const isAnswered = userAnswers[qIdx] !== undefined;
                          const isCorrect = isAnswered && qItem.opts[userAnswers[qIdx]].c;
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
                    className: "mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white text-center space-y-4 shadow-xl border border-emerald-600",
                    children: [
                      e.jsx("div", { className: "w-20 h-20 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-4xl shadow-lg animate-bounce", children: "🏆" }),
                      e.jsx("h3", { className: "text-2xl sm:text-3xl font-bold", children: "អបអរសាទរ! អ្នកបានបញ្ចប់តេស្តទាំង ៤០ សំណួរ!" }),
                      e.jsxs("p", { className: "text-sm text-emerald-100 max-w-lg mx-auto", children: ["អ្នកឆ្លើយត្រូវ ", Object.keys(userAnswers).filter(idx => quizQuestions[idx].opts[userAnswers[idx]].c).length, " លើ ", quizQuestions.length, " សំណួរ (", Math.round((Object.keys(userAnswers).filter(idx => quizQuestions[idx].opts[userAnswers[idx]].c).length / quizQuestions.length) * 100), "%)!"] }),
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
                    className: "space-y-6",
                    children: [
                      e.jsxs("div", {
                        className: "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 min-h-[300px] space-y-4",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx("span", { className: "px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" }),
                                  e.jsx("span", { className: "text-xs text-slate-400", children: "${badge}" })
                                ]
                              }),
                              e.jsxs("span", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: ["សំណួរ ", currentQIndex + 1, " / ", quizQuestions.length] })
                            ]
                          }),
                          e.jsxs("h3", { className: "text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug", children: [currentQIndex + 1, ". ", quizQuestions[currentQIndex].q] }),
                          e.jsx("div", {
                            className: "space-y-2.5 pt-1",
                            children: quizQuestions[currentQIndex].opts.map((opt, optIdx) => {
                              const isAnswered = userAnswers[currentQIndex] !== undefined;
                              const selectedOptIdx = userAnswers[currentQIndex];
                              const khLabels = ["ក", "ខ", "គ", "ឃ"];

                              let optClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800 dark:text-slate-200";
                              let badgeIcon = e.jsx("span", { className: "w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0", children: khLabels[optIdx] });

                              if (isAnswered) {
                                if (opt.c) {
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
                                  if (opt.c) playSuccessSound(); else playErrorSound();
                                },
                                className: "w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition flex items-center gap-3 cursor-pointer " + optClass,
                                children: [
                                  badgeIcon,
                                  e.jsx("span", { className: "text-xs sm:text-sm font-medium flex-1 leading-relaxed", children: opt.t })
                                ]
                              }, optIdx);
                            })
                          }),
                          userAnswers[currentQIndex] !== undefined ? e.jsxs("div", {
                            className: (quizQuestions[currentQIndex].opts[userAnswers[currentQIndex]].c ? "mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200" : "mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"),
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2 font-bold text-xs sm:text-sm mb-1",
                                children: quizQuestions[currentQIndex].opts[userAnswers[currentQIndex]].c ? [
                                  e.jsx("span", { className: "text-emerald-600 font-bold", children: "✓" }),
                                  e.jsx("span", { children: "ត្រឹមត្រូវណាស់!" })
                                ] : [
                                  e.jsx("span", { className: "text-rose-600 font-bold", children: "✗" }),
                                  e.jsx("span", { children: "មិនទាន់ត្រឹមត្រូវទេ!" })
                                ]
                              }),
                              e.jsx("p", { className: "text-xs text-slate-700 dark:text-slate-300 leading-relaxed", children: quizQuestions[currentQIndex].opts[userAnswers[currentQIndex]].e })
                            ]
                          }) : e.jsxs("div", {
                            className: "mt-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-center gap-2 text-xs italic",
                            children: [
                              e.jsx("span", { children: "💡" }),
                              e.jsxs("span", { children: ["ជំនួយស្មារតី៖ ", quizQuestions[currentQIndex].h] })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center justify-between pt-2",
                        children: [
                          e.jsxs("button", {
                            disabled: currentQIndex === 0,
                            onClick: () => { playTone(600, 0.08); setCurrentQIndex(prev => Math.max(0, prev - 1)); },
                            className: "px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5",
                            children: [e.jsx("span", { children: "◄" }), e.jsx("span", { children: "សំណួរមុន" })]
                          }),
                          e.jsxs("span", { className: "text-xs font-bold text-slate-500 dark:text-slate-400", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ", quizQuestions.length] }),
                          e.jsxs("button", {
                            onClick: () => {
                              playTone(600, 0.08);
                              if (currentQIndex < quizQuestions.length - 1) {
                                setCurrentQIndex(prev => prev + 1);
                              } else {
                                setIsFinished(!1);
                                setIsFinished(!0);
                                try { playTone(783.99, 0.3); } catch(e){}
                              }
                            },
                            className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-md cursor-pointer flex items-center gap-1.5",
                            children: [
                              e.jsx("span", { children: currentQIndex === quizQuestions.length - 1 ? "បញ្ចប់តេស្ត" : "សំណួរបន្ទាប់" }),
                              e.jsx("span", { children: "►" })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            })`;
}

lessons.forEach(l => {
  console.log(`--- Updating ${l.script} ---`);
  let code = fs.readFileSync(l.script, 'utf8');
  // Add state hooks and body class hook to generator script
  if (!code.includes('const [currentQIndex')) {
    const stateHookReplacement = `const [n, i] = y.useState(a); 
  const [currentQIndex, setCurrentQIndex] = y.useState(0); 
  const [userAnswers, setUserAnswers] = y.useState({}); 
  const [isFinished, setIsFinished] = y.useState(!1);
  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
      };
    }
  }, [r]);`;
    
    code = code.replace(/const\s*\[n,\s*i\]\s*=\s*y\.useState\(a\);/, stateHookReplacement);
  }

  // Replace tab-quiz section in generator script
  const startIdx = code.indexOf('n === "tab-quiz" &&');
  if (startIdx !== -1) {
    const endIdx = code.indexOf(')\n          ]', startIdx);
    if (endIdx !== -1) {
      const newQuizUI = buildLesson1QuizUI(l.title, l.badge);
      code = code.substring(0, startIdx) + newQuizUI + code.substring(endIdx);
      fs.writeFileSync(l.script, code);
      console.log(`Updated generator script ${l.script} successfully!`);
    } else {
      console.log(`endIdx not found in ${l.script}`);
    }
  } else {
    console.log(`startIdx not found in ${l.script}`);
  }

  // Run generator script to produce output file
  console.log(`Executing ${l.script}...`);
  execSync('node ' + l.script, { stdio: 'inherit' });

  // Verify generated code syntax
  const generatedCode = fs.readFileSync(l.out, 'utf8');
  try {
    new vm.Script(generatedCode);
    console.log(`SUCCESS: ${l.out} parsed cleanly with ZERO syntax errors!`);
  } catch (err) {
    console.error(`SYNTAX ERROR in ${l.out}:`, err);
  }
});
