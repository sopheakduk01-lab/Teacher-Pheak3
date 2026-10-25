import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("--- Generating Rz14 component for Science Lesson 14 (Ultra-Beautiful Modern Redesign) ---");

const questions = JSON.parse(fs.readFileSync('scripts/lesson14_questions.json', 'utf8'));

const componentCode = `var Rz14 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);
  const [isSpeaking, setIsSpeaking] = y.useState(!1);
  const [soundEnabled, setSoundEnabled] = y.useState(!0);

  // Lab 1: Lever Simulator State
  const [leverType, setLeverType] = y.useState("type1");
  const [leverLoad, setLeverLoad] = y.useState(60);
  const [leverEffortArm, setLeverEffortArm] = y.useState(3);
  const [leverLoadArm, setLeverLoadArm] = y.useState(1);

  // Lab 2: Inclined Plane State
  const [rampLength, setRampLength] = y.useState(4);
  const [rampHeight, setRampHeight] = y.useState(2);
  const [planeLoad, setPlaneLoad] = y.useState(100);
  const [isPushing, setIsPushing] = y.useState(!1);
  const [pushProgress, setPushProgress] = y.useState(0);

  // Lab 3: Pulley System State
  const [pulleyType, setPulleyType] = y.useState("fixed");
  const [pulleyLoad, setPulleyLoad] = y.useState(120);
  const [isPulling, setIsPulling] = y.useState(!1);
  const [pullProgress, setPullProgress] = y.useState(0);

  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
      };
    }
  }, [r, n]);

  const rawQuestions = ${JSON.stringify(questions)};

  const shuffleArray = (arr) => {
    if (!arr || !Array.isArray(arr)) return [];
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const shuffleQuiz = (list) => {
    if (!list || !Array.isArray(list)) return [];
    return list.map(q => {
      const rawOpts = q.opts || q.options || [];
      return {
        question: q.q || q.question || "",
        options: shuffleArray(rawOpts).map(o => ({
          text: o.t || o.text || "",
          isCorrect: o.c !== undefined ? Boolean(o.c) : Boolean(o.isCorrect),
          explanation: o.e || o.explanation || "ចម្លើយត្រឹមត្រូវត្រូវបានកំណត់ផ្អែកលើខ្លឹមសារពុម្ពវិទ្យាសាស្ត្រថ្នាក់ទី ៦។"
        }))
      };
    });
  };

  const [shuffledQuestions, setShuffledQuestions] = y.useState(() => shuffleQuiz(rawQuestions));

  const activeQuestions = shuffledQuestions && shuffledQuestions.length > 0 ? shuffledQuestions : shuffleQuiz(rawQuestions);

  const score = Object.keys(userAnswers).reduce((acc, qIdx) => {
    const q = activeQuestions[qIdx];
    if (q && q.options && q.options[userAnswers[qIdx]] && q.options[userAnswers[qIdx]].isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const playTone = (freq, type = "sine", duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
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
    if (isSpeaking) {
      if (window.stopKhmerAudio) window.stopKhmerAudio();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(!1);
      return;
    }
    if (!textToRead) return;
    setIsSpeaking(!0);
    s && s("កំពុងអានជាសំឡេងភាសាខ្មែរ...");
    if (window.playKhmerSpeech) {
      window.playKhmerSpeech(
        textToRead,
        () => setIsSpeaking(!0),
        () => setIsSpeaking(!1),
        () => setIsSpeaking(!1)
      );
    } else if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(textToRead);
        utter.lang = "km-KH";
        utter.rate = 0.9;
        utter.onstart = () => setIsSpeaking(!0);
        utter.onend = () => setIsSpeaking(!1);
        utter.onerror = () => setIsSpeaking(!1);
        window.speechSynthesis.speak(utter);
      } catch (err) {
        setIsSpeaking(!1);
      }
    } else {
      setIsSpeaking(!1);
    }
  };

  const lesson14KeyTakeaways = "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ១៤ ៖ ម៉ាស៊ីនងាយ ដែលប្អូនៗត្រូវចងចាំ ៖ " +
  "ទី ១. ឃ្នាស់ ៖ ជាម៉ាស៊ីនងាយចល័តជុំវិញចំណុចទ្រ។ មាន ៣ ផ្នែកគឺ បន្ទុក (Load), កម្លាំងចលករ (Effort), និងចំណុចទ្រ (Fulcrum)។ ឃ្នាស់ចែកជា ៣ ប្រភេទគឺ ៖ " +
  "ឃ្នាស់ប្រភេទទី ១ ៖ ចំណុចទ្រនៅកណ្តាល ដូចជា កន្ត្រៃ, ជញ្ជីង, និងរ៉ាស់តង់។ " +
  "ឃ្នាស់ប្រភេទទី ២ ៖ បន្ទុកនៅកណ្តាល ដូចជា រទេះរុញដៃមួយ, និងប្រដាប់គាស់ដប។ " +
  "ឃ្នាស់ប្រភេទទី ៣ ៖ កម្លាំងចលករនៅកណ្តាល ដូចជា ចង្កឹះ, និងប្រដាប់ចាប់ទឹកកក។ ដៃឃ្នាស់កាន់តែវែង កម្លាំងចលករកាន់តែតូច! " +
  "ទី ២. ប្លង់ទេរ ៖ ជាផ្ទៃរាបទេរសម្រាប់លើកដាក់វត្ថុ។ បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច។ ឧបករណ៍ច្នៃចេញពីប្លង់ទេរមាន ៖ ពូថៅ, កាំបិត, ជណ្តើរ, និងផ្លែស្វាន។ " +
  "ទី ៣. រ៉ក ៖ ជាកង់មានចង្អូរ និងខ្សែ។ រ៉កមាន ៣ ប្រភេទគឺ ៖ " +
  "រ៉កនឹង (N=1) ៖ ប្តូរទិសដៅកម្លាំង ប៉ុន្តែមិនចំណេញកម្លាំងទេ។ (កម្លាំងចលករ = ទម្ងន់បន្ទុក)។ " +
  "រ៉កចល័ត (N=2) ៖ កាត់បន្ថយកម្លាំងពាក់កណ្តាល! (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ២)។ " +
  "ប្រព័ន្ធរ៉ក (N=4) ៖ កាត់បន្ថយកម្លាំង ៤ ដង! (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ៤)។ " +
  "សូមចងចាំចំណុចសំខាន់ៗទាំងនេះដើម្បីទទួលបានពិន្ទុល្អ!";

  // Calculations for Lab 1 (Lever)
  const calcLeverEffort = Math.round((leverLoad * leverLoadArm) / Math.max(0.5, leverEffortArm));
  const leverSavings = Math.max(0, Math.round(((leverLoad - calcLeverEffort) / leverLoad) * 100));

  // Calculations for Lab 2 (Inclined Plane)
  const calcPlaneEffort = Math.round((planeLoad * rampHeight) / Math.max(0.1, rampLength));
  const planeSavings = Math.max(0, Math.round(((planeLoad - calcPlaneEffort) / planeLoad) * 100));

  // Calculations for Lab 3 (Pulley)
  const pulleyN = pulleyType === "fixed" ? 1 : pulleyType === "movable" ? 2 : 4;
  const calcPulleyEffort = Math.round(pulleyLoad / pulleyN);
  const pulleySavings = Math.round(((pulleyLoad - calcPulleyEffort) / pulleyLoad) * 100);

  return e.jsx("div", {
    className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn",
    children: e.jsxs("div", {
      className: "bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh] text-slate-800",
      children: [
        // Modern Premium Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 p-4 sm:p-5 text-white flex items-center justify-between shadow-lg relative overflow-hidden shrink-0 border-b border-white/10",
          children: [
            // Glowing background blur effects
            e.jsx("div", { className: "absolute -top-12 -left-12 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" }),
            e.jsx("div", { className: "absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" }),

            e.jsxs("div", {
              className: "flex items-center gap-3.5 z-10",
              children: [
                e.jsx("div", {
                  className: "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-lg ring-1 ring-white/20 shrink-0",
                  children: "⚙️"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2 mb-1",
                      children: [
                        e.jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-xs", children: "មេរៀនទី ១៤" }),
                        e.jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-sky-100 font-bold text-[10px] border border-white/20", children: "ជំពូកទី ៤ • ថ្នាក់ទី ៦" })
                      ]
                    }),
                    e.jsx("h2", {
                      className: "text-base sm:text-xl font-bold font-moul text-white drop-shadow-md line-clamp-1",
                      children: "ម៉ាស៊ីនងាយ (Simple Machines)"
                    })
                  ]
                })
              ]
            }),

            e.jsxs("div", {
              className: "flex items-center gap-2 z-10",
              children: [
                e.jsx("button", {
                  type: "button",
                  onClick: () => toggleSpeech(lesson14KeyTakeaways),
                  className: "px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-sm " + (isSpeaking ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse ring-2 ring-amber-300/50" : "bg-white/15 text-white border-white/25 hover:bg-white/25"),
                  title: "ស្ដាប់ការពន្យល់ចំណុចគន្លឹះមេរៀន",
                  children: isSpeaking ? "⏹️ បញ្ឈប់ការស្ដាប់ពន្យល់" : "🎧 ស្តាប់ពន្យល់ចំណុចសំខាន់ៗ"
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: () => {
                    setSoundEnabled(!soundEnabled);
                    playTone(600, "sine", 0.1);
                  },
                  className: "w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition border border-white/25 cursor-pointer shadow-sm",
                  title: soundEnabled ? "បិទសំឡេង" : "បើកសំឡេង",
                  children: soundEnabled ? "🔔" : "🔕"
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: t,
                  className: "w-10 h-10 rounded-2xl bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center transition border border-rose-400/40 cursor-pointer font-bold shadow-sm",
                  children: "✕"
                })
              ]
            })
          ]
        }),

        // Tab Navigation Bar
        e.jsx("div", {
          className: "bg-slate-100/90 border-b border-slate-200/80 p-2 overflow-x-auto no-scrollbar shrink-0 shadow-inner",
          children: e.jsxs("div", {
            className: "flex items-center gap-2 min-w-max",
            children: [
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-hero"); playTone(500); },
                className: "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs " + (n === "tab-hero" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-2 ring-blue-400/40" : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"),
                children: "📖 ១. មេរៀនសង្ខេប"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-lever"); playTone(520); },
                className: "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs " + (n === "tab-lever" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md ring-2 ring-amber-400/40" : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"),
                children: "⚖️ ២. ក្លែងធ្វើឃ្នាស់"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-ramp"); playTone(540); },
                className: "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs " + (n === "tab-ramp" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-400/40" : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"),
                children: "📐 ៣. ក្លែងធ្វើប្លង់ទេរ"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-pulley"); playTone(560); },
                className: "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs " + (n === "tab-pulley" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-purple-400/40" : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"),
                children: "🏗️ ៤. ក្លែងធ្វើរ៉ក"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-quiz"); playTone(600); },
                className: "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs " + (n === "tab-quiz" ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md ring-2 ring-rose-400/40" : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"),
                children: "🎯 ៥. តេស្ត QCM (៤០)"
              })
            ]
          })
        }),

        // Tab Content Body
        e.jsx("div", {
          className: "p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/70 space-y-6",
          children: [
            // TAB 1: HERO LESSON SUMMARY
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                // Top Hero Banner
                e.jsxs("div", {
                  className: "bg-gradient-to-br from-blue-900 via-indigo-900 to-sky-900 rounded-3xl p-6 text-white shadow-md border border-indigo-800/60 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-3 max-w-xl z-10",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("span", { className: "px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-400/30 backdrop-blur-md", children: "មេរៀនទី ១៤ • វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" }),
                            e.jsx("span", { className: "px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold shadow-xs", children: "ជំពូកទី ៤" })
                          ]
                        }),
                        e.jsx("h1", {
                          className: "text-xl sm:text-3xl font-bold font-moul text-white drop-shadow-md",
                          children: "ម៉ាស៊ីនងាយ (Simple Machines)"
                        }),
                        e.jsx("p", {
                          className: "text-xs sm:text-sm text-sky-100/90 leading-relaxed font-normal",
                          children: "ម៉ាស៊ីនងាយ គឺជាឧបករណ៍ដែលជួយសម្រួលដល់ការលើក គាស់ ឬរំកិលវត្ថុធ្ងន់ៗដោយប្រើប្រាស់កម្លាំងចលករតូចជាងទម្ងន់បន្ទុក។ ម៉ាស៊ីនងាយចម្បងក្នុងមេរៀននេះរួមមាន ឃ្នាស់, ប្លង់ទេរ, និងរ៉ក។"
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full md:w-auto",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-lever"); playTone(500); },
                          className: "w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2",
                          children: "⚙️ ពិសោធន៍ម៉ាស៊ីនងាយ"
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-quiz"); playTone(600); },
                          className: "w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2",
                          children: "📝 ប្រឡង QCM ៤០ សំណួរ"
                        })
                      ]
                    })
                  ]
                }),

                // 3 Main Simple Machines Cards Grid
                e.jsxs("div", {
                  className: "grid grid-cols-1 md:grid-cols-3 gap-5",
                  children: [
                    // Card 1: ឃ្នាស់ (Levers)
                    e.jsxs("div", {
                      className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition duration-300 space-y-4 flex flex-col justify-between group",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-3.5",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsx("div", { className: "w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-inner", children: "⚖️" }),
                                e.jsx("span", { className: "px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-extrabold text-xs border border-amber-200", children: "១. ឃ្នាស់ (Lever)" })
                              ]
                            }),
                            e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "១. ឃ្នាស់" }),
                            e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed font-normal", children: "ជាឧបករណ៍ធ្វើពីរុក្ខជាតិរឹងមាំ ឬលោហៈចល័តជុំវិញចំណុចទ្រ។ មាន ៣ ផ្នែកសំខាន់ ៖ កម្លាំងចលករ (Effort), កម្លាំងទប់ (Load), និងចំណុចទ្រ (Fulcrum)។" }),
                            e.jsxs("div", {
                              className: "bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-2 text-xs text-amber-950 font-medium",
                              children: [
                                e.jsx("p", { className: "font-bold text-amber-900 border-b border-amber-200/60 pb-1", children: "📌 ប្រភេទឃ្នាស់ ៣ យ៉ាង ៖" }),
                                e.jsx("p", { children: "• ប្រភេទទី ១ ៖ ចំណុចទ្រនៅកណ្តាល (កន្ត្រៃ, ជញ្ជីង)" }),
                                e.jsx("p", { children: "• ប្រភេទទី ២ ៖ បន្ទុកនៅកណ្តាល (រទេះរុញដៃមួយ)" }),
                                e.jsx("p", { children: "• ប្រភេទទី ៣ ៖ កម្លាំងចលករនៅកណ្តាល (ចង្កឹះ)" })
                              ]
                            })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-lever"); playTone(500); },
                          className: "w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition cursor-pointer text-center",
                          children: "ពិសោធន៍ឃ្នាស់ ៣ ប្រភេទ →"
                        })
                      ]
                    }),

                    // Card 2: ប្លង់ទេរ (Inclined Plane)
                    e.jsxs("div", {
                      className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-400/80 transition duration-300 space-y-4 flex flex-col justify-between group",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-3.5",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsx("div", { className: "w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-inner", children: "📐" }),
                                e.jsx("span", { className: "px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-200", children: "២. ប្លង់ទេរ (Ramp)" })
                              ]
                            }),
                            e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "២. ប្លង់ទេរ" }),
                            e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed font-normal", children: "ជាផ្ទៃរាបទេរសម្រាប់ជួយលើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់។ បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករដែលត្រូវប្រើកាន់តែតូច។" }),
                            e.jsxs("div", {
                              className: "bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2 text-xs text-emerald-950 font-medium",
                              children: [
                                e.jsx("p", { className: "font-bold text-emerald-900 border-b border-emerald-200/60 pb-1", children: "📌 គោលការណ៍កម្លាំង ៖" }),
                                e.jsx("p", { children: "• លើកត្រង់ ៖ កម្លាំងចលករ = ទម្ងន់បន្ទុក" }),
                                e.jsx("p", { children: "• រុញតាមប្លង់ទេរ ៖ កម្លាំងចលករ < ទម្ងន់បន្ទុក" }),
                                e.jsx("p", { children: "• ឧបករណ៍ច្នៃ ៖ ពូថៅ, កាំបិត, ជណ្តើរ, ផ្លែស្វាន" })
                              ]
                            })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-ramp"); playTone(540); },
                          className: "w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer text-center",
                          children: "ពិសោធន៍ប្លង់ទេរ និងមុំទេរ →"
                        })
                      ]
                    }),

                    // Card 3: រ៉ក (Pulleys)
                    e.jsxs("div", {
                      className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-400/80 transition duration-300 space-y-4 flex flex-col justify-between group",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-3.5",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsx("div", { className: "w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-inner", children: "🏗️" }),
                                e.jsx("span", { className: "px-3 py-1 rounded-xl bg-purple-50 text-purple-800 font-extrabold text-xs border border-purple-200", children: "៣. រ៉ក (Pulley)" })
                              ]
                            }),
                            e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "៣. រ៉ក" }),
                            e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed font-normal", children: "ជាកង់មានចង្អូរ និងខ្សែសម្រាប់លើកបន្ទុក។ ចែកជា ៣ ប្រភេទ ៖ រ៉កនឹង (N=1), រ៉កចល័ត (N=2), និងប្រព័ន្ធរ៉ក (N=4)។" }),
                            e.jsxs("div", {
                              className: "bg-purple-50/80 p-3.5 rounded-2xl border border-purple-200/80 space-y-2 text-xs text-purple-950 font-medium",
                              children: [
                                e.jsx("p", { className: "font-bold text-purple-900 border-b border-purple-200/60 pb-1", children: "📌 រូបមន្តចំណេញកម្លាំង ៖" }),
                                e.jsx("p", { children: "• រ៉កនឹង (N=1) ៖ កម្លាំង = បន្ទុក (ប្តូរទិសដៅ)" }),
                                e.jsx("p", { children: "• រ៉កចល័ត (N=2) ៖ កម្លាំង = បន្ទុក / ២ (ចំណេញ ៥០%)" }),
                                e.jsx("p", { children: "• ប្រព័ន្ធរ៉ក (N=4) ៖ កម្លាំង = បន្ទុក / ៤ (ចំណេញ ៧៥%)" })
                              ]
                            })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-pulley"); playTone(560); },
                          className: "w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition cursor-pointer text-center",
                          children: "ពិសោធន៍ប្រព័ន្ធរ៉ក និងគណនា →"
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 2: LEVER SIMULATOR
            n === "tab-lever" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-lg font-moul", children: "⚖️ បន្ទប់ពិសោធន៍ក្លែងធ្វើឃ្នាស់ (Lever Simulator)" }),
                            e.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "ជ្រើសរើសប្រភេទឃ្នាស់ កំណត់ទម្ងន់បន្ទុក និងប្រវែងដៃឃ្នាស់ដើម្បីសង្កេតកម្លាំងចលករ" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("button", {
                              type: "button",
                              onClick: () => setLeverType("type1"),
                              className: "px-3.5 py-2 rounded-2xl text-xs font-bold cursor-pointer transition border " + (leverType === "type1" ? "bg-amber-600 text-white border-amber-600 shadow-xs" : "bg-slate-100 text-slate-700 border-slate-200/80"),
                              children: "ប្រភេទទី ១ (កន្ត្រៃ)"
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => setLeverType("type2"),
                              className: "px-3.5 py-2 rounded-2xl text-xs font-bold cursor-pointer transition border " + (leverType === "type2" ? "bg-amber-600 text-white border-amber-600 shadow-xs" : "bg-slate-100 text-slate-700 border-slate-200/80"),
                              children: "ប្រភេទទី ២ (រទេះរុញ)"
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => setLeverType("type3"),
                              className: "px-3.5 py-2 rounded-2xl text-xs font-bold cursor-pointer transition border " + (leverType === "type3" ? "bg-amber-600 text-white border-amber-600 shadow-xs" : "bg-slate-100 text-slate-700 border-slate-200/80"),
                              children: "ប្រភេទទី ៣ (ចង្កឹះ)"
                            })
                          ]
                        })
                      ]
                    }),

                    // Interactive Sliders Controls
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-5 bg-amber-50/50 p-5 rounded-2xl border border-amber-200/70",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📦 ទម្ងន់បន្ទុក (Load):" }),
                                e.jsxs("span", { className: "text-amber-800 font-extrabold text-sm", children: [leverLoad, " kg"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 10,
                              max: 150,
                              step: 10,
                              value: leverLoad,
                              onChange: (e) => setLeverLoad(Number(e.target.value)),
                              className: "w-full accent-amber-600 cursor-pointer"
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📏 ប្រវែងដៃចលករ (Effort Arm):" }),
                                e.jsxs("span", { className: "text-amber-800 font-extrabold text-sm", children: [leverEffortArm, " m"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 1,
                              max: 5,
                              step: 0.5,
                              value: leverEffortArm,
                              onChange: (e) => setLeverEffortArm(Number(e.target.value)),
                              className: "w-full accent-amber-600 cursor-pointer"
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📐 ប្រវែងដៃបន្ទុក (Load Arm):" }),
                                e.jsxs("span", { className: "text-amber-800 font-extrabold text-sm", children: [leverLoadArm, " m"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 0.5,
                              max: 3,
                              step: 0.5,
                              value: leverLoadArm,
                              onChange: (e) => setLeverLoadArm(Number(e.target.value)),
                              className: "w-full accent-amber-600 cursor-pointer"
                            })
                          ]
                        })
                      ]
                    }),

                    // Canvas Visual
                    e.jsxs("div", {
                      className: "bg-slate-950 rounded-3xl p-6 text-white flex flex-col items-center justify-center relative min-h-[240px] overflow-hidden border border-slate-800 shadow-inner",
                      children: [
                        e.jsx("div", {
                          className: "w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[45px] border-b-amber-500 absolute bottom-6 z-10 drop-shadow-md",
                          style: { left: "50%", transform: "translateX(-50%)" }
                        }),
                        e.jsxs("div", {
                          className: "w-[82%] h-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 rounded-full absolute bottom-[70px] z-20 shadow-xl flex items-center justify-between px-5 transition-transform duration-500",
                          style: { transform: "rotate(-2deg)" },
                          children: [
                            e.jsxs("div", {
                              className: "bg-rose-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-lg -translate-y-9 flex items-center gap-1.5 border border-rose-400 animate-bounce",
                              children: [
                                e.jsx("span", { children: "📦 បន្ទុក" }),
                                e.jsxs("span", { className: "text-yellow-300 font-extrabold", children: [leverLoad, "kg"] })
                              ]
                            }),
                            e.jsx("div", {
                              className: "bg-slate-950/90 text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-400/40 shadow-xs",
                              children: leverType === "type1" ? "ចំណុចទ្រកណ្តាល" : leverType === "type2" ? "បន្ទុកកណ្តាល" : "ចលករកណ្តាល"
                            }),
                            e.jsxs("div", {
                              className: "bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-lg -translate-y-9 flex items-center gap-1.5 border border-emerald-400",
                              children: [
                                e.jsx("span", { children: "💪 កម្លាំងចលករ" }),
                                e.jsxs("span", { className: "text-emerald-200 font-extrabold", children: [calcLeverEffort, "kg"] })
                              ]
                            })
                          ]
                        }),
                        e.jsx("div", { className: "w-full h-2 bg-slate-800 absolute bottom-4 rounded-full" })
                      ]
                    }),

                    // Stats Output Grid
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-center",
                      children: [
                        e.jsxs("div", {
                          className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-slate-500", children: "ទម្ងន់បន្ទុកដើម" }),
                            e.jsxs("p", { className: "text-lg font-extrabold text-slate-800", children: [leverLoad, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-amber-50 p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-amber-800", children: "កម្លាំងចលករត្រូវប្រើ" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-amber-900", children: [calcLeverEffort, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-emerald-800", children: "កម្រិតចំណេញកម្លាំង" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-emerald-900", children: ["ចំណេញ ", leverSavings, "%"] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 3: INCLINED PLANE SIMULATOR
            n === "tab-ramp" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-lg font-moul", children: "📐 បន្ទប់ពិសោធន៍ក្លែងធ្វើប្លង់ទេរ (Inclined Plane Simulator)" }),
                            e.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "ប្រៀបធៀបកម្លាំងលើកត្រង់ធៀបនឹងកម្លាំងរុញតាមប្លង់ទេរ" })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            setIsPushing(!0);
                            setPushProgress(0);
                            playTone(700, "sine", 0.3);
                            let p = 0;
                            const inv = setInterval(() => {
                              p += 10;
                              setPushProgress(p);
                              if (p >= 100) {
                                clearInterval(inv);
                                setIsPushing(!1);
                                s && s("បានរុញបន្ទុកឡើងដល់កំពូលប្លង់ទេររចនារួចរាល់!");
                              }
                            }, 120);
                          },
                          className: "px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2 self-start sm:self-auto",
                          children: isPushing ? "🚀 កំពុងរុញឡើង..." : "▶️ ចាប់ផ្តើមរុញបន្ទុក"
                        })
                      ]
                    }),

                    // Controls
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-5 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200/70",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📦 ទម្ងន់បន្ទុក (Load):" }),
                                e.jsxs("span", { className: "text-emerald-800 font-extrabold text-sm", children: [planeLoad, " kg"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 20,
                              max: 200,
                              step: 20,
                              value: planeLoad,
                              onChange: (e) => setPlaneLoad(Number(e.target.value)),
                              className: "w-full accent-emerald-600 cursor-pointer"
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📏 ប្រវែងប្លង់ទេរ (Ramp Length):" }),
                                e.jsxs("span", { className: "text-emerald-800 font-extrabold text-sm", children: [rampLength, " m"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 2,
                              max: 10,
                              step: 1,
                              value: rampLength,
                              onChange: (e) => setRampLength(Number(e.target.value)),
                              className: "w-full accent-emerald-600 cursor-pointer"
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "🏔️ កម្ពស់ប្លង់ទេរ (Height):" }),
                                e.jsxs("span", { className: "text-emerald-800 font-extrabold text-sm", children: [rampHeight, " m"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 1,
                              max: 4,
                              step: 1,
                              value: rampHeight,
                              onChange: (e) => setRampHeight(Number(e.target.value)),
                              className: "w-full accent-emerald-600 cursor-pointer"
                            })
                          ]
                        })
                      ]
                    }),

                    // Canvas Visual
                    e.jsxs("div", {
                      className: "bg-slate-950 rounded-3xl p-6 text-white relative min-h-[240px] flex items-end justify-start border border-slate-800 shadow-inner overflow-hidden",
                      children: [
                        e.jsx("div", {
                          className: "w-0 h-0 border-b-[150px] border-b-emerald-800/80 border-l-[340px] border-l-transparent absolute bottom-6 right-10 shadow-xl"
                        }),
                        e.jsxs("div", {
                          className: "bg-amber-500 text-slate-950 font-extrabold text-xs px-3.5 py-2.5 rounded-2xl shadow-2xl z-20 absolute transition-all duration-300 flex items-center gap-1.5 border border-amber-300",
                          style: {
                            right: \`\${10 + (pushProgress * 2.8)}px\`,
                            bottom: \`\${24 + (pushProgress * 1.2)}px\`
                          },
                          children: [
                            e.jsx("span", { className: "text-lg", children: "📦" }),
                            e.jsxs("span", { children: [planeLoad, "kg"] })
                          ]
                        }),
                        e.jsx("div", { className: "w-full h-2 bg-slate-800 absolute bottom-4 rounded-full" })
                      ]
                    }),

                    // Output Stats Grid
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-center",
                      children: [
                        e.jsxs("div", {
                          className: "bg-rose-50 p-4 rounded-2xl border border-rose-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-rose-800", children: "លើកឡើងត្រង់" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-rose-900", children: [planeLoad, " kg (១០០%)"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-emerald-800", children: "រុញតាមប្លង់ទេរ" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-emerald-900", children: [calcPlaneEffort, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-sky-50 p-4 rounded-2xl border border-sky-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-sky-800", children: "កម្រិតចំណេញកម្លាំង" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-sky-900", children: ["ចំណេញ ", planeSavings, "%"] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 4: PULLEY SYSTEM SIMULATOR
            n === "tab-pulley" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-lg font-moul", children: "🏗️ បន្ទប់ពិសោធន៍ក្លែងធ្វើរ៉ក (Pulley Simulator)" }),
                            e.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "ប្រៀបធៀបរ៉កនឹង, រ៉កចល័ត, និងប្រព័ន្ធរ៉កលើការចំណេញកម្លាំង" })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            setIsPulling(!0);
                            setPullProgress(0);
                            playTone(800, "sine", 0.3);
                            let p = 0;
                            const inv = setInterval(() => {
                              p += 10;
                              setPullProgress(p);
                              if (p >= 100) {
                                clearInterval(inv);
                                setIsPulling(!1);
                                s && s("បានទាញបន្ទុកឡើងដល់កំពូលដោយជោគជ័យ!");
                              }
                            }, 100);
                          },
                          className: "px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2 self-start sm:self-auto",
                          children: isPulling ? "🪢 កំពុងទាញ..." : "▶️ ទាញខ្សែរ៉ក"
                        })
                      ]
                    }),

                    // Controls
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-5 bg-purple-50/50 p-5 rounded-2xl border border-purple-200/70",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx("label", { className: "text-xs font-bold text-slate-800", children: "⚙️ ជ្រើសរើសប្រភេទរ៉ក ៖" }),
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("button", {
                                  type: "button",
                                  onClick: () => setPulleyType("fixed"),
                                  className: "flex-1 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition border " + (pulleyType === "fixed" ? "bg-purple-600 text-white border-purple-600 shadow-xs" : "bg-white text-slate-700 border-slate-200/80"),
                                  children: "រ៉កនឹង (N=1)"
                                }),
                                e.jsx("button", {
                                  type: "button",
                                  onClick: () => setPulleyType("movable"),
                                  className: "flex-1 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition border " + (pulleyType === "movable" ? "bg-purple-600 text-white border-purple-600 shadow-xs" : "bg-white text-slate-700 border-slate-200/80"),
                                  children: "រ៉កចល័ត (N=2)"
                                }),
                                e.jsx("button", {
                                  type: "button",
                                  onClick: () => setPulleyType("system"),
                                  className: "flex-1 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition border " + (pulleyType === "system" ? "bg-purple-600 text-white border-purple-600 shadow-xs" : "bg-white text-slate-700 border-slate-200/80"),
                                  children: "ប្រព័ន្ធរ៉ក (N=4)"
                                })
                              ]
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "🏋️ ទម្ងន់បន្ទុក (Load Weight):" }),
                                e.jsxs("span", { className: "text-purple-800 font-extrabold text-sm", children: [pulleyLoad, " kg"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 40,
                              max: 400,
                              step: 40,
                              value: pulleyLoad,
                              onChange: (e) => setPulleyLoad(Number(e.target.value)),
                              className: "w-full accent-purple-600 cursor-pointer"
                            })
                          ]
                        })
                      ]
                    }),

                    // Canvas Visual
                    e.jsxs("div", {
                      className: "bg-slate-950 rounded-3xl p-6 text-white flex items-center justify-around relative min-h-[240px] border border-slate-800 shadow-inner overflow-hidden",
                      children: [
                        e.jsxs("div", {
                          className: "flex flex-col items-center gap-2",
                          children: [
                            e.jsx("div", { className: "w-18 h-18 rounded-full border-4 border-amber-400 bg-slate-800 flex items-center justify-center text-2xl font-bold animate-spin-slow shadow-xl", children: "⚙️" }),
                            e.jsx("span", { className: "text-xs font-bold text-amber-300", children: pulleyType === "fixed" ? "រ៉កនឹង ១" : pulleyType === "movable" ? "រ៉ក ២ (ចល័ត)" : "ប្រព័ន្ធរ៉ក ៤" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-rose-600 text-white font-extrabold text-sm px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 flex items-center gap-3 border border-rose-400",
                          style: { transform: \`translateY(-\${pullProgress * 0.8}px)\` },
                          children: [
                            e.jsx("span", { className: "text-3xl", children: "🧱" }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("p", { className: "text-[10px] text-rose-200 uppercase font-bold tracking-wider", children: "បន្ទុកលើក" }),
                                e.jsxs("p", { className: "text-lg", children: [pulleyLoad, " kg"] })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // Output Stats Grid
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-center",
                      children: [
                        e.jsxs("div", {
                          className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-slate-500", children: "ចំនួនរ៉ក (N)" }),
                            e.jsxs("p", { className: "text-base font-extrabold text-slate-800", children: [pulleyN, " រ៉ក"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-purple-50 p-4 rounded-2xl border border-purple-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-purple-800", children: "កម្លាំងចលករត្រូវទាញ" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-purple-900", children: [calcPulleyEffort, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-emerald-800", children: "កម្រិតចំណេញកម្លាំង" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-emerald-900", children: ["ចំណេញ ", pulleySavings, "%"] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 5: 40 QCM QUIZ ENGINE
            n === "tab-quiz" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                !isFinished ? e.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    // Quiz Header Controls
                    e.jsxs("div", {
                      className: "bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2.5",
                          children: [
                            e.jsxs("span", {
                              className: "px-3.5 py-1.5 rounded-2xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200/80 shadow-2xs",
                              children: ["សំណួរទី ", currentQIndex + 1, " / ", activeQuestions.length]
                            }),
                            e.jsxs("span", {
                              className: "px-3.5 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 shadow-2xs",
                              children: ["ពិន្ទុ ៖ ", score, " / ", activeQuestions.length]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("button", {
                              type: "button",
                              onClick: () => {
                                setShuffledQuestions(shuffleQuiz(rawQuestions));
                                setUserAnswers({});
                                setCurrentQIndex(0);
                                setIsFinished(!1);
                                playTone(440, "sine", 0.1);
                                s && s("បានច្របល់សំណួរ និងជម្រើសចម្លើយឡើងវិញ!");
                              },
                              className: "px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200/80 shadow-2xs",
                              children: "🔀 ច្របល់ចម្លើយ"
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => {
                                const q = activeQuestions[currentQIndex];
                                if (!q) return;
                                const fullQuestionText = "សំណួរទី " + (currentQIndex + 1) + " ៖ " + q.question + "។ " + (q.options || []).map((opt, i) => "ជម្រើស " + String.fromCharCode(65 + i) + " ៖ " + opt.text).join("។ ");
                                toggleSpeech(fullQuestionText);
                              },
                              className: "px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-2xs " + (isSpeaking ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200/80"),
                              children: isSpeaking ? "⏹️ បញ្ឈប់ការអាន" : "🔊 អានសំណួរ & ជម្រើស"
                            })
                          ]
                        })
                      ]
                    }),

                    // Question Palette (1 to 40)
                    e.jsx("div", {
                      className: "flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1.5 no-scrollbar bg-white p-3.5 rounded-3xl border border-slate-200/90 shadow-sm",
                      children: activeQuestions.map((q, idx) => {
                        const isAnswered = userAnswers[idx] !== undefined;
                        const isCorrect = isAnswered && q.options && q.options[userAnswers[idx]] && q.options[userAnswers[idx]].isCorrect;
                        const isCurrent = idx === currentQIndex;
                        let btnStyle = "bg-slate-100 text-slate-600 border-slate-200/80";
                        if (isCurrent) {
                          btnStyle = "bg-blue-600 text-white font-extrabold ring-2 ring-blue-400 border-blue-600 shadow-xs scale-105";
                        } else if (isAnswered) {
                          btnStyle = isCorrect ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600";
                        }
                        return e.jsx("button", {
                          key: idx,
                          type: "button",
                          onClick: () => { setCurrentQIndex(idx); playTone(500, "sine", 0.05); },
                          className: "w-8.5 h-8.5 rounded-xl text-xs font-bold shrink-0 transition border flex items-center justify-center cursor-pointer " + btnStyle,
                          children: idx + 1
                        }, idx);
                      })
                    }),

                    // Current Question Card
                    (() => {
                      const q = activeQuestions[currentQIndex];
                      if (!q) return null;
                      const selectedOptIdx = userAnswers[currentQIndex];
                      const isAnswered = selectedOptIdx !== undefined;

                      return e.jsxs("div", {
                        className: "bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-6",
                        children: [
                          e.jsx("h3", {
                            className: "text-sm sm:text-base font-bold text-slate-900 leading-relaxed",
                            children: q.question
                          }),

                          // Options Grid
                          e.jsx("div", {
                            className: "grid grid-cols-1 gap-3",
                            children: (q.options || []).map((opt, optIdx) => {
                              const isSelected = selectedOptIdx === optIdx;
                              let optStyle = "bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200/80";
                              if (isAnswered) {
                                if (opt.isCorrect) {
                                  optStyle = "bg-emerald-50 text-emerald-950 border-emerald-300 font-bold shadow-2xs";
                                } else if (isSelected) {
                                  optStyle = "bg-rose-50 text-rose-950 border-rose-300 font-bold shadow-2xs";
                                } else {
                                  optStyle = "bg-slate-50/50 opacity-60 text-slate-500 border-slate-200/60";
                                }
                              }

                              return e.jsxs("button", {
                                key: optIdx,
                                type: "button",
                                disabled: isAnswered,
                                onClick: () => {
                                  const newAns = { ...userAnswers, [currentQIndex]: optIdx };
                                  setUserAnswers(newAns);
                                  if (opt.isCorrect) {
                                    playTone(800, "sine", 0.2);
                                    s && s("ត្រឹមត្រូវ! 👏");
                                  } else {
                                    playTone(300, "sawtooth", 0.2);
                                    s && s("មិនទាន់ត្រឹមត្រូវទេ!");
                                  }
                                },
                                className: "p-4 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer " + optStyle,
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-center gap-3.5",
                                    children: [
                                      e.jsx("span", {
                                        className: "w-7 h-7 rounded-xl bg-slate-200/80 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs",
                                        children: String.fromCharCode(65 + optIdx)
                                      }),
                                      e.jsx("span", { className: "leading-relaxed", children: opt.text })
                                    ]
                                  }),
                                  isAnswered && opt.isCorrect && e.jsx("span", { className: "text-emerald-600 font-bold text-lg", children: "✓" }),
                                  isAnswered && isSelected && !opt.isCorrect && e.jsx("span", { className: "text-rose-600 font-bold text-lg", children: "✕" })
                                ]
                              }, optIdx);
                            })
                          }),

                          // Explanation Box
                          isAnswered && q.options[selectedOptIdx] && e.jsxs("div", {
                            className: "p-4.5 rounded-2xl text-xs space-y-1.5 bg-blue-50/90 border border-blue-200/80 text-blue-950 animate-fadeIn shadow-2xs",
                            children: [
                              e.jsx("p", { className: "font-bold text-blue-950 flex items-center gap-1.5", children: "💡 ការពន្យល់ ៖" }),
                              e.jsx("p", { className: "leading-relaxed text-blue-900/90", children: q.options[selectedOptIdx].explanation || "ចម្លើយត្រឹមត្រូវត្រូវបានកំណត់ផ្អែកលើខ្លឹមសារពុម្ពវិទ្យាសាស្ត្រថ្នាក់ទី ៦។" })
                            ]
                          }),

                          // Prev / Next Navigation
                          e.jsxs("div", {
                            className: "flex items-center justify-between pt-3 border-t border-slate-100",
                            children: [
                              e.jsx("button", {
                                type: "button",
                                disabled: currentQIndex === 0,
                                onClick: () => { setCurrentQIndex(prev => prev - 1); playTone(500, "sine", 0.05); },
                                className: "px-4.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs disabled:opacity-40 cursor-pointer border border-slate-200/80 shadow-2xs",
                                children: "← សំណួរមុន"
                              }),
                              currentQIndex < activeQuestions.length - 1 ? e.jsx("button", {
                                type: "button",
                                onClick: () => { setCurrentQIndex(prev => prev + 1); playTone(600, "sine", 0.05); },
                                className: "px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer",
                                children: "សំណួរបន្ទាប់ →"
                              }) : e.jsx("button", {
                                type: "button",
                                onClick: () => {
                                  setIsFinished(!0);
                                  playTone(900, "sine", 0.4);
                                },
                                className: "px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer",
                                children: "🏁 បញ្ចប់ការប្រឡង"
                              })
                            ]
                          })
                        ]
                      });
                    })()
                  ]
                }) : e.jsxs("div", {
                  className: "bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-md text-center space-y-6 max-w-lg mx-auto animate-scaleUp",
                  children: [
                    e.jsx("div", { className: "w-22 h-22 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-5xl mx-auto shadow-inner ring-4 ring-emerald-50", children: "🏆" }),
                    e.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        e.jsx("h3", { className: "text-xl font-bold font-moul text-slate-900", children: "លទ្ធផលការប្រឡង QCM មេរៀនទី ១៤" }),
                        e.jsx("p", { className: "text-xs text-slate-500", children: "អ្នកបានឆ្លើយសំណួរទាំង ៤០ រួចរាល់ហើយ!" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 shadow-inner",
                      children: [
                        e.jsxs("p", { className: "text-3xl font-extrabold text-emerald-600", children: [score, " / ", activeQuestions.length] }),
                        e.jsx("p", { className: "text-xs font-bold text-slate-700", children: score >= 28 ? "🎉 ឆ្នើមណាស់! អ្នកយល់ដឹងច្បាស់លើមេរៀនម៉ាស៊ីនងាយ!" : "អស្ចារ្យ! ព្យាយាមរំលឹកឡើងវិញដើម្បីទទួលបានពិន្ទុពេញ!" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "flex items-center justify-center gap-3 pt-2",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            setUserAnswers({});
                            setCurrentQIndex(0);
                            setIsFinished(!1);
                            setShuffledQuestions(shuffleQuiz(rawQuestions));
                            playTone(500, "sine", 0.1);
                          },
                          className: "px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer",
                          children: "🔄 ប្រឡងឡើងវិញ"
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            setIsFinished(!1);
                            setCurrentQIndex(0);
                          },
                          className: "px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer border border-slate-200/80",
                          children: "🔍 ពិនិត្យចម្លើយឡើងវិញ"
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
};`;

try {
  esbuild.transformSync(componentCode, { loader: "js" });
  console.log("ESBUILD VALIDATION: Ultra-beautiful Rz14 code passes 100%!");
  fs.writeFileSync('scripts/rz14_component_code.js', componentCode, 'utf8');
  console.log("Successfully updated scripts/rz14_component_code.js");
} catch (err) {
  console.error("Syntax Error in Rz14:", err.message);
  process.exit(1);
}
