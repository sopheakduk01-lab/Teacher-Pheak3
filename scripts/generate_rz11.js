import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("--- Generating Rz11 component for Science Lesson 11 (Circulatory System) ---");

const questions = JSON.parse(fs.readFileSync('scripts/lesson11_questions.json', 'utf8'));

const code = `var Rz11 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);
  const [activeHeartPart, setActiveHeartPart] = y.useState("la");
  const [cardiacPhase, setCardiacPhase] = y.useState(1);
  const [isPlayingCycle, setIsPlayingCycle] = y.useState(!1);
  const [selectedAgeGroup, setSelectedAgeGroup] = y.useState("adult");
  const [selectedEmotion, setSelectedEmotion] = y.useState("rest");
  const [activeVessel, setActiveVessel] = y.useState("capillary");
  const [isSpeaking, setIsSpeaking] = y.useState(!1);
  const [soundEnabled, setSoundEnabled] = y.useState(!0);

  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
      };
    }
  }, [r, n]);

  const quizQuestions = ${JSON.stringify(questions)};

  const score = Object.keys(userAnswers).reduce((acc, qIdx) => {
    const q = quizQuestions[qIdx];
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

  const playHeartBeatSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // First beat (LUB - lower frequency, slightly longer)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(80, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.12);

      // Second beat (DUB - higher pitch, snappier)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(110, ctx.currentTime + 0.16);
      osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.28);
      gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.16);
      osc2.stop(ctx.currentTime + 0.28);
    } catch (e) {}
  };

  // Cardiac cycle timer
  y.useEffect(() => {
    let interval = null;
    if (isPlayingCycle) {
      interval = setInterval(() => {
        setCardiacPhase(prev => {
          const next = prev >= 3 ? 1 : prev + 1;
          if (next === 1 || next === 2) playHeartBeatSound();
          return next;
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlayingCycle, soundEnabled]);

  // Text to Speech
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

  y.useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const heartParts = {
    ra: {
      name: "ថតលើស្ដាំ (Right Atrium)",
      type: "chamber",
      blood: "ឈាមសម្បូរ CO₂ (ឧស្ម័នកាបូនិច)",
      color: "bg-blue-600 text-white border-blue-400",
      pill: "bg-blue-100 text-blue-900 border-blue-300",
      role: "ទទួលឈាមសម្បូរឧស្ម័នកាបូនិច (CO₂) ពីគ្រប់សារពាង្គកាយតាមរយៈ «វ៉ែនកាវ» រួចកន្ត្រាក់បញ្ជូនទៅកាន់ថតក្រោមស្ដាំ។",
      icon: "💙"
    },
    rv: {
      name: "ថតក្រោមស្ដាំ (Right Ventricle)",
      type: "chamber",
      blood: "ឈាមសម្បូរ CO₂ (ឧស្ម័នកាបូនិច)",
      color: "bg-indigo-600 text-white border-indigo-400",
      pill: "bg-indigo-100 text-indigo-900 border-indigo-300",
      role: "កន្ត្រាក់បាញ់បញ្ជូនឈាមសម្បូរ CO₂ ចេញពីបេះដូងទៅកាន់ «សួត» តាមរយៈ «អាអកតែសួត» ដើម្បីច្រោះយកអុកស៊ីសែន។",
      icon: "🫁"
    },
    la: {
      name: "ថតលើឆ្វេង (Left Atrium)",
      type: "chamber",
      blood: "ឈាមសម្បូរ O₂ (អុកស៊ីសែន)",
      color: "bg-rose-600 text-white border-rose-400",
      pill: "bg-rose-100 text-rose-900 border-rose-300",
      role: "ទទួលឈាមក្រហមស្រស់សម្បូរអុកស៊ីសែន (O₂) ត្រឡប់មកពីសួតវិញតាមរយៈ «វ៉ែនសួត» រួចកន្ត្រាក់បញ្ជូនទៅថតក្រោមឆ្វេង។",
      icon: "❤️"
    },
    lv: {
      name: "ថតក្រោមឆ្វេង (Left Ventricle)",
      type: "chamber",
      blood: "ឈាមសម្បូរ O₂ (អុកស៊ីសែន)",
      color: "bg-red-600 text-white border-red-400",
      pill: "bg-red-100 text-red-900 border-red-300",
      role: "ជាថតដែលមានសាច់ដុំក្រាស់ជាងគេបំផុត! មាននាទីកន្ត្រាក់យ៉ាងខ្លាំងដើម្បីបាញ់បញ្ជូនឈាមសម្បូរ O₂ ទៅកាន់គ្រប់កោសិកានៃសារពាង្គកាយតាម «អាអកតែអាក»។",
      icon: "🔥"
    },
    aorta: {
      name: "អាអកតែអាក (Aorta)",
      type: "vessel",
      blood: "ឈាមសម្បូរ O₂",
      color: "bg-rose-700 text-white border-rose-500",
      pill: "bg-rose-100 text-rose-900 border-rose-300",
      role: "ជាសរសៃឈាមអាអកតែធំជាងគេបង្អស់ក្នុងរាងកាយ នាំឈាមក្រហមស្រស់ចេញពីថតក្រោមឆ្វេងទៅចិញ្ចឹមសារពាង្គកាយ។",
      icon: "🚀"
    },
    pulm_art: {
      name: "អាអកតែសួត (Pulmonary Artery)",
      type: "vessel",
      blood: "ឈាមសម្បូរ CO₂",
      color: "bg-cyan-700 text-white border-cyan-500",
      pill: "bg-cyan-100 text-cyan-900 border-cyan-300",
      role: "នាំឈាមសម្បូរឧស្ម័នកាបូនិចចេញពីថតក្រោមស្ដាំឆ្ពោះទៅកាន់សួតទាំងសងខាង។",
      icon: "💨"
    },
    vena_cava: {
      name: "វ៉ែនកាវ (Vena Cava)",
      type: "vessel",
      blood: "ឈាមសម្បូរ CO₂",
      color: "bg-blue-700 text-white border-blue-500",
      pill: "bg-blue-100 text-blue-900 border-blue-300",
      role: "ជាសរសៃឈាមវ៉ែនធំៗប្រមូលឈាមសម្បូរ CO₂ ពីក្បាល ដៃ ជើង និងដងខ្លួនត្រឡប់ចូលថតលើស្ដាំនៃបេះដូង។",
      icon: "↩️"
    },
    pulm_vein: {
      name: "វ៉ែនសួត (Pulmonary Vein)",
      type: "vessel",
      blood: "ឈាមសម្បូរ O₂",
      color: "bg-pink-700 text-white border-pink-500",
      pill: "bg-pink-100 text-pink-900 border-pink-300",
      role: "នាំឈាមដែលបានផ្លាស់ប្តូរឧស្ម័ននៅសួតរួច (សម្បូរអុកស៊ីសែន) ត្រឡប់ចូលមកថតលើឆ្វេងនៃបេះដូង។",
      icon: "↪️"
    }
  };

  const currentPart = heartParts[activeHeartPart] || heartParts.la;

  // Pulse rates by age and condition
  const ageRates = {
    baby: { label: "ទារក (១ថ្ងៃ ➔ ១ឆ្នាំ)", base: "100 - 125", bpm: 110, desc: "បេះដូងកន្ត្រាក់លឿនបំផុតដើម្បីទ្រទ្រង់ការលូតលាស់រហ័ស" },
    child: { label: "កុមារ (១ឆ្នាំ ➔ ១៥ឆ្នាំ)", base: "75 - 100", bpm: 85, desc: "ចង្វាក់បេះដូងថយចុះបន្តិចសមស្របនឹងទំហំរាងកាយ" },
    adult: { label: "មនុស្សពេញវ័យ (១៥ឆ្នាំ ➔ ចំណាស់)", base: "65 - 85", bpm: 72, desc: "ចង្វាក់ជីពចរស្ថិរភាពនៅពេលនៅស្ងៀម" }
  };

  const emotionMultipliers = {
    rest: { label: "នៅស្ងៀម (Rest)", factor: 1.0, color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: "🧘" },
    walk: { label: "ដើរធម្មតា (Walking)", factor: 1.15, color: "text-blue-600 bg-blue-50 border-blue-200", icon: "🚶" },
    run: { label: "រត់ហាត់ប្រាណ (Running)", factor: 1.5, color: "text-amber-600 bg-amber-50 border-amber-200", icon: "🏃" },
    excited: { label: "រំភើប / ខឹង / ភ័យ (Excited/Fear)", factor: 1.6, color: "text-rose-600 bg-rose-50 border-rose-200", icon: "⚡" }
  };

  const calculatedBpm = Math.round((ageRates[selectedAgeGroup]?.bpm || 72) * (emotionMultipliers[selectedEmotion]?.factor || 1.0));

  return e.jsx("div", {
    "data-modal-open": "true",
    className: "fixed inset-0 z-[100] overflow-y-auto bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-['Battambang']",
    children: e.jsxs("div", {
      className: "bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 overflow-hidden flex flex-col max-h-[94vh]",
      children: [
        // Modal Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-md",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3 sm:gap-4",
              children: [
                e.jsx("div", {
                  className: "w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shadow-inner animate-pulse",
                  children: "🫀"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2 flex-wrap",
                      children: [
                        e.jsx("span", {
                          className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 uppercase tracking-wider",
                          children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ • ជំពូកទី ៣"
                        }),
                        e.jsx("span", {
                          className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider",
                          children: "មេរៀនទី ១១ ពេញលេញ"
                        })
                      ]
                    }),
                    e.jsx("h2", {
                      className: "text-lg sm:text-xl font-extrabold text-white mt-1 leading-tight font-moul",
                      children: "មេរៀនទី ១១ ៖ ប្រដាប់របត់ឈាម"
                    }),
                    e.jsx("p", {
                      className: "text-xs text-rose-100 mt-0.5 hidden sm:block",
                      children: "រូបផ្គុំបេះដូង ៤ថត • ចង្វាក់ ៣ដំណាក់ • សរសៃឈាម ៣ប្រភេទ • ជីពចរ • ជំងឺ & អនាម័យ • ៤០ សំណួរ QCM"
                    })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                e.jsxs("button", {
                  type: "button",
                  onClick: () => toggleSpeech("មេរៀនទី ១១ ប្រដាប់របត់ឈាម។ មនុស្សគ្រប់រូបត្រូវការអាហារដើម្បីរស់។ ប្រដាប់រំលាយអាហាររំលាយអាហារដែលយើងបរិភោគ។ ឈាមបែងចែកអាហារដែលរំលាយរួចទៅចិញ្ចឹមកោសិកាដែលមាននៅក្នុងខ្លួន។ ប្រដាប់របត់ឈាមផ្គុំឡើងដោយបេះដូង និងសរសៃឈាម។"),
                  className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border \${isSpeaking ? "bg-amber-400 text-slate-900 border-amber-500 animate-pulse" : "bg-white/20 text-white border-white/30 hover:bg-white/30"}\`,
                  children: [
                    e.jsx("span", { children: isSpeaking ? "⏹️" : "🔊" }),
                    e.jsx("span", { className: "hidden md:inline", children: isSpeaking ? "ឈប់អាន" : "ស្តាប់ការអាន" })
                  ]
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: () => setSoundEnabled(!soundEnabled),
                  title: soundEnabled ? "បិទសំឡេងបេះដូង" : "បើកសំឡេងបេះដូង",
                  className: "w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold transition cursor-pointer border border-white/20",
                  children: soundEnabled ? "🔔" : "🔕"
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: t,
                  className: "w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg font-bold transition cursor-pointer border border-white/20",
                  children: "✕"
                })
              ]
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
              { id: "tab-heart", label: "១. បេះដូង ៤ថត & ចង្វាក់ ៣ដំណាក់", icon: "🫀" },
              { id: "tab-pulse", label: "២. ជីពចរ & សរសៃឈាមទាំង ៣", icon: "📈" },
              { id: "tab-health", label: "៣. ជំងឺ & អនាម័យ", icon: "🩺" },
              { id: "tab-quiz", label: "៤. សំណួរ ៤០ QCM", icon: "❓" }
            ].map(tab => e.jsxs("button", {
              type: "button",
              onClick: () => {
                i(tab.id);
                playTone(440, "sine", 0.08);
              },
              className: \`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer \${n === tab.id ? "bg-rose-600 text-white shadow-md scale-102" : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"}\`,
              children: [
                e.jsx("span", { children: tab.icon }),
                e.jsx("span", { children: tab.label })
              ]
            }, tab.id))
          })
        }),

        // Scrollable Body
        e.jsxs("div", {
          className: "p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/60 dark:bg-slate-900/50",
          children: [
            // TAB 1: Hero Overview
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                // Top Concept Banner
                e.jsxs("div", {
                  className: "bg-gradient-to-br from-rose-500/10 via-red-500/5 to-amber-500/10 border border-rose-200 dark:border-rose-800/60 p-5 rounded-3xl space-y-3 shadow-xs",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between",
                      children: [
                        e.jsx("h3", {
                          className: "text-base font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2 font-moul",
                          children: "🌟 និយមន័យនៃប្រដាប់របត់ឈាម"
                        }),
                        e.jsx("span", {
                          className: "text-xs font-bold px-3 py-1 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300",
                          children: "Circulatory System"
                        })
                      ]
                    }),
                    e.jsx("p", {
                      className: "text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed",
                      children: "មនុស្សគ្រប់រូបត្រូវការអាហារដើម្បីរស់។ ប្រដាប់រំលាយអាហាររំលាយអាហារដែលយើងបរិភោគ។ ឈាមបែងចែកអាហារដែលរំលាយរួច ទៅចិញ្ចឹមកោសិកាដែលមាននៅក្នុងខ្លួន។"
                    }),
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2",
                      children: [
                        e.jsxs("div", {
                          className: "bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-rose-200 dark:border-slate-700 space-y-1 shadow-xs",
                          children: [
                            e.jsx("span", { className: "text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5", children: "🩸 តើប្រដាប់របត់ឈាមជាអ្វី?" }),
                            e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 font-bold", children: "ប្រដាប់របត់ឈាម គឺជាប្រព័ន្ធដឹកនាំឈាមនៅក្នុងសារពាង្គកាយ។" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-rose-200 dark:border-slate-700 space-y-1 shadow-xs",
                          children: [
                            e.jsx("span", { className: "text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5", children: "🧩 តើរូបផ្គុំនៃប្រដាប់របត់ឈាមមានអ្វីខ្លះ?" }),
                            e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 font-bold", children: "ប្រដាប់របត់ឈាមផ្គុំឡើងដោយ បេះដូង និង សរសៃឈាម។" })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Interactive Organs Transport Map (រូបភាពបង្ហាញពី៖ ខួរក្បាល, សួត, បេះដូង, ពោះវៀន, សាច់ដុំ)
                e.jsxs("div", {
                  className: "bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between flex-wrap gap-2",
                      children: [
                        e.jsx("h3", {
                          className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-moul",
                          children: "🗺️ សរីរាង្គទទួលឈាមតាមសៀវភៅពុម្ព (ខួរក្បាល, សួត, បេះដូង, ពោះវៀន, សាច់ដុំ)"
                        }),
                        e.jsx("span", { className: "text-[11px] text-slate-500", children: "ចុចលើសរីរាង្គនីមួយៗដើម្បីស្វែងយល់" })
                      ]
                    }),
                    e.jsx("div", {
                      className: "grid grid-cols-2 sm:grid-cols-5 gap-3",
                      children: [
                        { name: "ខួរក្បាល", en: "Brain", icon: "🧠", desc: "ត្រូវការឈាមសម្បូរ O₂ និងគ្លុយកូសជានិច្ចដើម្បីបញ្ជាសារពាង្គកាយ", color: "from-purple-500 to-indigo-600" },
                        { name: "សួត", en: "Lungs", icon: "🫁", desc: "ផ្លាស់ប្តូរឧស្ម័ន បញ្ចេញ CO₂ និងបញ្ចូល O₂ ទៅក្នុងឈាម", color: "from-cyan-500 to-blue-600" },
                        { name: "បេះដូង", en: "Heart", icon: "🫀", desc: "ម៉ាស៊ីនបូមបឺតនិងបញ្ជូនឈាមទៅគ្រប់ផ្នែកទាំងអស់", color: "from-rose-500 to-red-600" },
                        { name: "ពោះវៀន", en: "Intestines", icon: "🌀", desc: "ផ្តល់សារធាតុចិញ្ចឹមដែលរំលាយរួចចូលក្នុងឈាម", color: "from-emerald-500 to-teal-600" },
                        { name: "សាច់ដុំ", en: "Muscles", icon: "💪", desc: "ទទួល O₂ និងសារធាតុចិញ្ចឹមដើម្បីបង្កើតថាមពលចលនា", color: "from-amber-500 to-orange-600" }
                      ].map((org, idx) => e.jsxs("div", {
                        key: idx,
                        className: "p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:shadow-md transition text-center space-y-1 group",
                        children: [
                          e.jsx("div", { className: "text-3xl group-hover:scale-110 transition duration-200", children: org.icon }),
                          e.jsx("div", { className: "font-bold text-xs text-slate-900 dark:text-white font-moul", children: org.name }),
                          e.jsx("div", { className: "text-[10px] text-slate-400", children: org.en }),
                          e.jsx("p", { className: "text-[10px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2 pt-1", children: org.desc })
                        ]
                      }))
                    })
                  ]
                }),

                // Two Primary Roles Card
                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "bg-emerald-50/80 dark:bg-slate-800 p-4 rounded-3xl border border-emerald-200 dark:border-slate-700 space-y-2",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs font-moul",
                          children: [e.jsx("span", { children: "🥗" }), "១. ដឹកនាំសារធាតុចិញ្ចឹម & កាកសំណល់"]
                        }),
                        e.jsx("p", {
                          className: "text-xs text-slate-700 dark:text-slate-300 leading-relaxed",
                          children: "នាំសារធាតុចិញ្ចឹម (ដែលរំលាយរួចពីពោះវៀនតូច) ទៅឱ្យកោសិកានិងប្រមូលកាកសំណល់ពីកោសិកាមកវិញ ដើម្បីបញ្ចេញចោលតាមសរីរាង្គបញ្ចេញកាកសំណល់។"
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "bg-rose-50/80 dark:bg-slate-800 p-4 rounded-3xl border border-rose-200 dark:border-slate-700 space-y-2",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs font-moul",
                          children: [e.jsx("span", { children: "🌬️" }), "២. ដឹកនាំអុកស៊ីសែន & ឧស្ម័នកាបូនិច"]
                        }),
                        e.jsx("p", {
                          className: "text-xs text-slate-700 dark:text-slate-300 leading-relaxed",
                          children: "ផ្តល់អុកស៊ីសែន (O₂) ទៅឱ្យកោសិកាសម្រាប់ដកដង្ហើមថាមពល និងប្រមូលនូវឧស្ម័នកាបូនិច (CO₂) ពីកោសិកាមកកាន់សួតវិញដើម្បីបញ្ចេញមកក្រៅ។"
                        })
                      ]
                    })
                  ]
                }),

                // Quick Navigation Button
                e.jsxs("div", {
                  className: "flex justify-end gap-3 pt-2",
                  children: [
                    e.jsxs("button", {
                      type: "button",
                      onClick: () => {
                        i("tab-heart");
                        playTone(523, "sine", 0.1);
                      },
                      className: "px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer",
                      children: ["ស្វែងយល់រូបផ្គុំបេះដូង ៤ ថត & ចង្វាក់ ៣ ដំណាក់ ➔"]
                    })
                  ]
                })
              ]
            }),

            // TAB 2: Heart, 4 Chambers & 3-Phase Simulator
            n === "tab-heart" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                // Heart Nature Banner
                e.jsxs("div", {
                  className: "bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between flex-wrap gap-2",
                      children: [
                        e.jsx("h3", {
                          className: "text-base font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2 font-moul",
                          children: "🫀 ក. បេះដូង (The Heart)"
                        }),
                        e.jsx("span", {
                          className: "text-xs font-bold px-3 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-300",
                          children: "សាច់ដុំរលីង • ក្នុងទ្រូងខាងឆ្វេង"
                        })
                      ]
                    }),
                    e.jsxs("ul", {
                      className: "text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed",
                      children: [
                        e.jsx("li", { children: "បេះដូងជាសាច់ដុំរលីងមួយដែលស្ថិតនៅក្នុងទ្រូងផ្នែកខាងឆ្វេង។" }),
                        e.jsx("li", { children: "បេះដូងមាននាទីសម្រាប់បឺតនិងបញ្ជូនឈាមទៅគ្រប់ផ្នែកទាំងអស់នៃសារពាង្គកាយតាមសរសៃឈាម។" }),
                        e.jsx("li", { children: "បេះដូងមាន ៤ថត គឺថតលើពីរ និងថតក្រោមពីរ (ថតលើស្ដាំ, ថតលើឆ្វេង, ថតក្រោមស្ដាំ, ថតក្រោមឆ្វេង)។" }),
                        e.jsx("li", { children: "សរសៃឈាមធំៗភ្ជាប់បេះដូង៖ អាអកតែអាក, អាអកតែសួត, វ៉ែនកាវ, វ៉ែនសួត។" })
                      ]
                    })
                  ]
                }),

                // Interactive 4 Chambers & Vessels Diagram Explorer
                e.jsxs("div", {
                  className: "bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between flex-wrap gap-2",
                      children: [
                        e.jsx("h4", {
                          className: "text-sm font-bold text-slate-900 dark:text-white font-moul",
                          children: "🔍 រូបផ្គុំបេះដូងអន្តរកម្ម (ចុចលើថត ឬសរសៃឈាម)"
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2 text-[10px] font-bold",
                          children: [
                            e.jsxs("span", { className: "px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1", children: [e.jsx("span", { className: "w-2 h-2 rounded-full bg-red-600 inline-block" }), "ឈាម O₂ ក្រហម"] }),
                            e.jsxs("span", { className: "px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1", children: [e.jsx("span", { className: "w-2 h-2 rounded-full bg-blue-600 inline-block" }), "ឈាម CO₂ ខៀវ"] })
                          ]
                        })
                      ]
                    }),

                    // Interactive SVG Box
                    e.jsxs("div", {
                      className: "grid grid-cols-1 lg:grid-cols-12 gap-5 items-center",
                      children: [
                        // SVG Diagram
                        e.jsx("div", {
                          className: "lg:col-span-6 bg-slate-900 rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner border border-slate-700 min-h-[300px]",
                          children: e.jsxs("svg", {
                            viewBox: "0 0 400 360",
                            className: "w-full max-w-[340px] drop-shadow-xl",
                            children: [
                              // Background Glow
                              e.jsx("circle", { cx: "200", cy: "180", r: "140", fill: "rgba(225, 29, 72, 0.08)" }),

                              // Aorta (Top Red Arch)
                              e.jsx("path", {
                                d: "M 180 120 C 180 50, 270 50, 260 110 L 235 110 C 240 75, 205 75, 200 120 Z",
                                fill: activeHeartPart === "aorta" ? "#ef4444" : "#b91c1c",
                                stroke: activeHeartPart === "aorta" ? "#fecdd3" : "#7f1d1d",
                                strokeWidth: activeHeartPart === "aorta" ? "3" : "1.5",
                                className: "cursor-pointer transition hover:opacity-90",
                                onClick: () => { setActiveHeartPart("aorta"); playTone(580, "triangle"); }
                              }),
                              e.jsx("text", { x: "235", y: "45", fill: "#fca5a5", fontSize: "11", fontWeight: "bold", textAnchor: "middle", children: "អាអកតែអាក" }),

                              // Pulmonary Artery (Blue Cross Arch)
                              e.jsx("path", {
                                d: "M 160 130 C 150 80, 110 85, 90 100 L 105 115 C 120 100, 140 100, 150 130 Z",
                                fill: activeHeartPart === "pulm_art" ? "#38bdf8" : "#0284c7",
                                stroke: activeHeartPart === "pulm_art" ? "#bae6fd" : "#0369a1",
                                strokeWidth: activeHeartPart === "pulm_art" ? "3" : "1.5",
                                className: "cursor-pointer transition hover:opacity-90",
                                onClick: () => { setActiveHeartPart("pulm_art"); playTone(480, "triangle"); }
                              }),
                              e.jsx("text", { x: "90", y: "80", fill: "#7dd3fc", fontSize: "11", fontWeight: "bold", textAnchor: "middle", children: "អាអកតែសួត" }),

                              // Vena Cava (Top-Left Blue Pipe)
                              e.jsx("rect", {
                                x: "90", y: "110", width: "35", height: "55", rx: "8",
                                fill: activeHeartPart === "vena_cava" ? "#3b82f6" : "#1d4ed8",
                                stroke: activeHeartPart === "vena_cava" ? "#bfdbfe" : "#1e40af",
                                strokeWidth: activeHeartPart === "vena_cava" ? "3" : "1.5",
                                className: "cursor-pointer transition",
                                onClick: () => { setActiveHeartPart("vena_cava"); playTone(420, "triangle"); }
                              }),
                              e.jsx("text", { x: "75", y: "140", fill: "#93c5fd", fontSize: "10", fontWeight: "bold", textAnchor: "end", children: "វ៉ែនកាវ" }),

                              // Pulmonary Vein (Right Pinkish Pipe)
                              e.jsx("rect", {
                                x: "275", y: "125", width: "35", height: "45", rx: "8",
                                fill: activeHeartPart === "pulm_vein" ? "#f43f5e" : "#be123c",
                                stroke: activeHeartPart === "pulm_vein" ? "#fecdd3" : "#9f1239",
                                strokeWidth: activeHeartPart === "pulm_vein" ? "3" : "1.5",
                                className: "cursor-pointer transition",
                                onClick: () => { setActiveHeartPart("pulm_vein"); playTone(620, "triangle"); }
                              }),
                              e.jsx("text", { x: "320", y: "150", fill: "#fda4af", fontSize: "10", fontWeight: "bold", textAnchor: "start", children: "វ៉ែនសួត" }),

                              // Main Heart Body Outline
                              // Left Atrium (Right side of diagram anatomically)
                              e.jsx("path", {
                                d: "M 205 130 C 240 130, 275 150, 275 190 C 275 205, 230 205, 205 205 Z",
                                fill: activeHeartPart === "la" ? "#e11d48" : "#9f1239",
                                stroke: activeHeartPart === "la" ? "#ffffff" : "#4c0519",
                                strokeWidth: activeHeartPart === "la" ? "3" : "1.5",
                                className: "cursor-pointer transition",
                                onClick: () => { setActiveHeartPart("la"); playTone(650, "sine"); }
                              }),
                              e.jsx("text", { x: "240", y: "175", fill: "#ffffff", fontSize: "11", fontWeight: "bold", textAnchor: "middle", children: "ថតលើឆ្វេង" }),

                              // Right Atrium (Left side of diagram anatomically)
                              e.jsx("path", {
                                d: "M 195 130 C 160 130, 125 150, 125 190 C 125 205, 170 205, 195 205 Z",
                                fill: activeHeartPart === "ra" ? "#2563eb" : "#1e40af",
                                stroke: activeHeartPart === "ra" ? "#ffffff" : "#1e3a8a",
                                strokeWidth: activeHeartPart === "ra" ? "3" : "1.5",
                                className: "cursor-pointer transition",
                                onClick: () => { setActiveHeartPart("ra"); playTone(400, "sine"); }
                              }),
                              e.jsx("text", { x: "160", y: "175", fill: "#ffffff", fontSize: "11", fontWeight: "bold", textAnchor: "middle", children: "ថតលើស្ដាំ" }),

                              // Septum Vertical Line
                              e.jsx("line", { x1: "200", y1: "130", x2: "200", y2: "330", stroke: "#0f172a", strokeWidth: "6" }),

                              // Right Ventricle (Lower Left of diagram)
                              e.jsx("path", {
                                d: "M 195 210 L 130 210 C 130 260, 160 300, 195 325 Z",
                                fill: activeHeartPart === "rv" ? "#3b82f6" : "#1d4ed8",
                                stroke: activeHeartPart === "rv" ? "#ffffff" : "#172554",
                                strokeWidth: activeHeartPart === "rv" ? "3" : "1.5",
                                className: "cursor-pointer transition",
                                onClick: () => { setActiveHeartPart("rv"); playTone(450, "sine"); }
                              }),
                              e.jsx("text", { x: "165", y: "260", fill: "#ffffff", fontSize: "11", fontWeight: "bold", textAnchor: "middle", children: "ថតក្រោមស្ដាំ" }),

                              // Left Ventricle (Lower Right of diagram, thickest muscle)
                              e.jsx("path", {
                                d: "M 205 210 L 270 210 C 270 270, 240 315, 205 335 Z",
                                fill: activeHeartPart === "lv" ? "#dc2626" : "#881337",
                                stroke: activeHeartPart === "lv" ? "#ffffff" : "#4c0519",
                                strokeWidth: activeHeartPart === "lv" ? "3.5" : "2",
                                className: "cursor-pointer transition",
                                onClick: () => { setActiveHeartPart("lv"); playTone(700, "sine"); }
                              }),
                              e.jsx("text", { x: "235", y: "260", fill: "#ffffff", fontSize: "11", fontWeight: "bold", textAnchor: "middle", children: "ថតក្រោមឆ្វេង" }),

                              // Center heart pulsing indicator
                              e.jsx("circle", {
                                cx: "200", cy: "210", r: "8",
                                fill: "#fbbf24",
                                className: "animate-ping opacity-75"
                              })
                            ]
                          })
                        }),

                        // Detail Panel for selected part
                        e.jsxs("div", {
                          className: "lg:col-span-6 space-y-4",
                          children: [
                            e.jsxs("div", {
                              className: \`p-5 rounded-3xl border-2 space-y-3 transition \${currentPart.color} shadow-lg\`,
                              children: [
                                e.jsxs("div", {
                                  className: "flex items-center justify-between",
                                  children: [
                                    e.jsxs("span", {
                                      className: "text-2xl",
                                      children: [currentPart.icon, " ", currentPart.name]
                                    }),
                                    e.jsx("span", {
                                      className: "px-3 py-1 rounded-full text-[11px] font-bold bg-white/25 backdrop-blur-md border border-white/30 text-white",
                                      children: currentPart.type === "chamber" ? "ថតបេះដូង" : "សរសៃឈាមធំ"
                                    })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "flex items-center gap-2 text-xs font-bold bg-black/20 p-2.5 rounded-2xl",
                                  children: [
                                    e.jsx("span", { children: "ប្រភេទឈាម ៖" }),
                                    e.jsx("span", { className: "underline", children: currentPart.blood })
                                  ]
                                }),
                                e.jsx("p", {
                                  className: "text-xs sm:text-sm leading-relaxed text-white/95",
                                  children: currentPart.role
                                })
                              ]
                            }),

                            // Part Selector Buttons Grid
                            e.jsxs("div", {
                              className: "space-y-1.5",
                              children: [
                                e.jsx("span", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "ជ្រើសរើសផ្នែកដើម្បីពិនិត្យ ៖" }),
                                e.jsx("div", {
                                  className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
                                  children: [
                                    { id: "ra", label: "ថតលើស្ដាំ" },
                                    { id: "la", label: "ថតលើឆ្វេង" },
                                    { id: "rv", label: "ថតក្រោមស្ដាំ" },
                                    { id: "lv", label: "ថតក្រោមឆ្វេង" },
                                    { id: "aorta", label: "អាអកតែអាក" },
                                    { id: "pulm_art", label: "អាអកតែសួត" },
                                    { id: "vena_cava", label: "វ៉ែនកាវ" },
                                    { id: "pulm_vein", label: "វ៉ែនសួត" }
                                  ].map(p => e.jsx("button", {
                                    key: p.id,
                                    type: "button",
                                    onClick: () => { setActiveHeartPart(p.id); playTone(500, "sine"); },
                                    className: \`p-2 rounded-xl text-xs font-bold transition text-center cursor-pointer border \${activeHeartPart === p.id ? "bg-rose-600 text-white border-rose-700 shadow-sm" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-200"}\`,
                                    children: p.label
                                  }))
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Interactive 3-Phase Cardiac Cycle Simulator
                e.jsxs("div", {
                  className: "bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 sm:p-6 rounded-3xl border border-slate-700 space-y-4 shadow-xl",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between flex-wrap gap-2",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h4", { className: "text-base font-bold text-amber-400 font-moul", children: "🔄 ៣ ដំណាក់នៃចង្វាក់បេះដូង (Cardiac Cycle Simulator)" }),
                            e.jsx("p", { className: "text-xs text-slate-300", children: "ក្នុងមួយចង្វាក់បេះដូងចែកចេញជា ៣ ដំណាក់កាលជាប់ៗគ្នា" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => {
                                setIsPlayingCycle(!isPlayingCycle);
                                if (!isPlayingCycle) playHeartBeatSound();
                              },
                              className: \`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md \${isPlayingCycle ? "bg-amber-500 hover:bg-amber-600 text-slate-950" : "bg-rose-600 hover:bg-rose-700 text-white"}\`,
                              children: [
                                e.jsx("span", { children: isPlayingCycle ? "⏸️ ផ្អាក" : "▶️ ចាក់ស្វ័យប្រវត្តិ" })
                              ]
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => {
                                const next = cardiacPhase >= 3 ? 1 : cardiacPhase + 1;
                                setCardiacPhase(next);
                                playHeartBeatSound();
                              },
                              className: "px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition cursor-pointer",
                              children: "ដំណាក់បន្ទាប់ ➔"
                            })
                          ]
                        })
                      ]
                    }),

                    // 3 Phase Cards
                    e.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-3",
                      children: [
                        {
                          step: 1,
                          title: "ដំណាក់ទី ១ ៖ កន្ត្រាក់ថតលើ",
                          sub: "Atrial Systole (~0.1 វិនាទី)",
                          desc: "ការកន្ត្រាក់ថតលើទាំងពីរព្រមគ្នា។ ឈាមពីថតលើស្ដាំ និងឆ្វេង ត្រូវច្របាច់ទម្លាក់ចូលទៅក្នុងថតក្រោមទាំងពីរ។",
                          color: "border-blue-500",
                          activeBg: "bg-blue-900/60 ring-2 ring-blue-400"
                        },
                        {
                          step: 2,
                          title: "ដំណាក់ទី ២ ៖ កន្ត្រាក់ថតក្រោម",
                          sub: "Ventricular Systole (~0.3 វិនាទី)",
                          desc: "ការកន្ត្រាក់ថតក្រោមទាំងពីរព្រមគ្នា។ បាញ់ឈាមចេញពីបេះដូង ៖ ថតក្រោមស្ដាំទៅសួត (អាអកតែសួត) និងថតក្រោមឆ្វេងទៅរាងកាយ (អាអកតែអាក)។",
                          color: "border-rose-500",
                          activeBg: "bg-rose-900/60 ring-2 ring-rose-400"
                        },
                        {
                          step: 3,
                          title: "ដំណាក់ទី ៣ ៖ សម្រាកទូទៅ",
                          sub: "Cardiac Diastole (~0.4 វិនាទី)",
                          desc: "ការសម្រាកទូទៅនៃបេះដូង។ ថតទាំង ៤ សម្រាកដើម្បីឱ្យឈាមថ្មីហូរចូលពេញថតលើទាំងពីរជាថ្មីម្តងទៀត។",
                          color: "border-emerald-500",
                          activeBg: "bg-emerald-900/60 ring-2 ring-emerald-400"
                        }
                      ].map(ph => e.jsxs("div", {
                        key: ph.step,
                        onClick: () => { setCardiacPhase(ph.step); playHeartBeatSound(); },
                        className: \`p-4 rounded-2xl border transition cursor-pointer \${ph.color} \${cardiacPhase === ph.step ? ph.activeBg : "bg-slate-800/60 opacity-70 hover:opacity-100"}\`,
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between mb-1.5",
                            children: [
                              e.jsx("span", { className: "text-xs font-bold text-amber-300 font-moul", children: ph.title }),
                              cardiacPhase === ph.step && e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" })
                            ]
                          }),
                          e.jsx("div", { className: "text-[10px] text-slate-400 mb-2 font-mono", children: ph.sub }),
                          e.jsx("p", { className: "text-xs text-slate-200 leading-relaxed", children: ph.desc })
                        ]
                      }))
                    })
                  ]
                })
              ]
            }),

            // TAB 3: Pulse & 3 Blood Vessels
            n === "tab-pulse" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                // Pulse by Age Interactive Simulator
                e.jsxs("div", {
                  className: "bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between flex-wrap gap-2",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "text-base font-bold text-rose-800 dark:text-rose-300 font-moul", children: "📈 ចង្វាក់បេះដូង ឬ ជីពចរ (Pulse Rate)" }),
                            e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300", children: "បេះដូងធ្វើចលនាតាមចង្វាក់ដែលហៅថា ចង្វាក់បេះដូង ឬជីពចរ។ ប្រែប្រួលតាមភេទ អាយុ និងអារម្មណ៍។" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-4 py-2 rounded-2xl",
                          children: [
                            e.jsx("span", { className: "text-2xl animate-bounce", children: "💓" }),
                            e.jsxs("div", {
                              children: [
                                e.jsxs("div", { className: "text-base font-extrabold text-rose-700 dark:text-rose-300 font-mono", children: [calculatedBpm, " BPM"] }),
                                e.jsx("div", { className: "text-[10px] text-slate-500 font-bold", children: "ដងក្នុង ១ នាទី" })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // Age Groups Tabs
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx("span", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "១. ជ្រើសរើសវ័យ (គិតក្នុងពេលនៅស្ងៀម) ៖" }),
                        e.jsx("div", {
                          className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                          children: Object.entries(ageRates).map(([key, val]) => e.jsxs("button", {
                            key: key,
                            type: "button",
                            onClick: () => { setSelectedAgeGroup(key); playTone(540, "sine", 0.08); },
                            className: \`p-3 rounded-2xl border text-left transition cursor-pointer \${selectedAgeGroup === key ? "bg-rose-600 text-white border-rose-700 shadow-md" : "bg-slate-50 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100"}\`,
                            children: [
                              e.jsx("div", { className: "font-bold text-xs font-moul", children: val.label }),
                              e.jsxs("div", { className: \`text-sm font-extrabold mt-1 \${selectedAgeGroup === key ? "text-amber-200" : "text-rose-600 dark:text-rose-400"}\`, children: [val.base, " ដង/នាទី"] }),
                              e.jsx("div", { className: \`text-[10px] mt-1 line-clamp-1 \${selectedAgeGroup === key ? "text-rose-100" : "text-slate-500"}\`, children: val.desc })
                            ]
                          }))
                        })
                      ]
                    }),

                    // Emotion & Physical Activity Factor
                    e.jsxs("div", {
                      className: "space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700",
                      children: [
                        e.jsx("span", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "២. សាកល្បងផ្លាស់ប្តូរស្ថានភាពអារម្មណ៍ ឬចលនា ៖" }),
                        e.jsx("div", {
                          className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
                          children: Object.entries(emotionMultipliers).map(([key, val]) => e.jsxs("button", {
                            key: key,
                            type: "button",
                            onClick: () => { setSelectedEmotion(key); playTone(600, "triangle", 0.1); },
                            className: \`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer \${selectedEmotion === key ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100"}\`,
                            children: [
                              e.jsx("span", { children: val.icon }),
                              e.jsx("span", { children: val.label })
                            ]
                          }))
                        })
                      ]
                    })
                  ]
                }),

                // 3 Types of Blood Vessels Comparison
                e.jsxs("div", {
                  className: "bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between flex-wrap gap-2",
                      children: [
                        e.jsx("h3", { className: "text-base font-bold text-slate-900 dark:text-white font-moul", children: "🩸 ខ. សរសៃឈាមទាំង ៣ ប្រភេទ (Blood Vessels)" }),
                        e.jsx("span", { className: "text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200", children: "អាអកតែ • វ៉ែន • សរសៃប្តូរ" })
                      ]
                    }),

                    e.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                      children: [
                        {
                          id: "artery",
                          name: "១. អាអកតែ (Artery)",
                          role: "នាំឈាមចេញពីបេះដូងទៅសារពាង្គកាយ",
                          feature: "ជញ្ជាំងក្រាស់ យឺត និងរឹងមាំ ដើម្បីទ្រាំទ្រសម្ពាធឈាមខ្ពស់ដែលបាញ់ចេញពីបេះដូង។",
                          icon: "🔴",
                          tag: "នាំឈាមចេញពីបេះដូង",
                          color: "border-rose-400 bg-rose-50/50 dark:bg-slate-900/60"
                        },
                        {
                          id: "vein",
                          name: "២. វ៉ែន (Vein)",
                          role: "នាំឈាមពីសារពាង្គកាយត្រឡប់ចូលបេះដូង",
                          feature: "មានប្រឹស (Valves) នៅតាមបណ្តោយសរសៃ ដើម្បីការពារកុំឱ្យឈាមហូរត្រឡប់ក្រោយវិញ។",
                          icon: "🔵",
                          tag: "នាំឈាមចូលបេះដូង",
                          color: "border-blue-400 bg-blue-50/50 dark:bg-slate-900/60"
                        },
                        {
                          id: "capillary",
                          name: "៣. សរសៃប្តូរ (Capillaries)",
                          role: "ភ្ជាប់អាអកតែទៅវ៉ែន និងផ្លាស់ប្តូរជីវជាតិ",
                          feature: "មានភ្នាសស្តើងបំផុតដែលអាចឱ្យធាតុរាវឆ្លងកាត់បាន ៖ ដឹកនាំសារធាតុចិញ្ចឹម+O₂ ទៅឱ្យកោសិកា និងទទួលយកកាកសំណល់+CO₂ ត្រឡប់មកវិញ។",
                          icon: "🟣",
                          tag: "តភ្ជាប់ & ផ្លាស់ប្តូរជីវជាតិ",
                          color: "border-purple-400 bg-purple-50/50 dark:bg-slate-900/60"
                        }
                      ].map(v => e.jsxs("div", {
                        key: v.id,
                        onClick: () => { setActiveVessel(v.id); playTone(520, "sine"); },
                        className: \`p-4 rounded-3xl border-2 transition cursor-pointer space-y-2.5 \${v.color} \${activeVessel === v.id ? "ring-2 ring-purple-500 shadow-md" : "hover:border-purple-300"}\`,
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              e.jsxs("span", { className: "font-bold text-xs text-slate-900 dark:text-white font-moul flex items-center gap-1.5", children: [v.icon, v.name] }),
                              e.jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs", children: v.tag })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "text-xs font-bold text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-slate-800/80 p-2 rounded-xl",
                            children: ["តួនាទី ៖ ", v.role]
                          }),
                          e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: v.feature })
                        ]
                      }))
                    }),

                    // Microscopic Capillary Gas & Nutrient Exchange Zoom Box
                    e.jsxs("div", {
                      className: "bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 rounded-3xl border border-purple-700/60 space-y-3 shadow-lg",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2 font-bold text-sm text-purple-200 font-moul",
                          children: [e.jsx("span", { children: "🔬" }), "ទិដ្ឋភាពមីក្រូទស្សន៍ ៖ ការផ្លាស់ប្តូរធាតុរាវនៅភ្នាសសរសៃប្តូរ (Capillary Exchange)"]
                        }),
                        e.jsx("p", {
                          className: "text-xs text-purple-100 leading-relaxed",
                          children: "សរសៃប្តូរមានភ្នាសស្តើងដែលអាចឱ្យធាតុរាវឆ្លងកាត់បាន។ ធាតុរាវនេះដឹកនាំសារធាតុចិញ្ចឹមនិងអុកស៊ីសែនទៅឱ្យកោសិកានៃសារពាង្គកាយ ហើយទទួលយកកាកសំណល់និងឧស្ម័នកាបូនិចពីកោសិកាមកវិញ។"
                        }),
                        e.jsxs("div", {
                          className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs",
                          children: [
                            e.jsxs("div", {
                              className: "bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-emerald-400/30 flex items-center gap-3",
                              children: [
                                e.jsx("span", { className: "text-2xl", children: "🎁" }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("div", { className: "font-bold text-emerald-300", children: "ផ្តល់ឱ្យកោសិកា ➔" }),
                                    e.jsx("div", { className: "text-[11px] text-slate-200", children: "សារធាតុចិញ្ចឹម (គ្លុយកូស, អាស៊ីតអាមីណេ...) + អុកស៊ីសែន (O₂)" })
                                  ]
                                })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-rose-400/30 flex items-center gap-3",
                              children: [
                                e.jsx("span", { className: "text-2xl", children: "🗑️" }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("div", { className: "font-bold text-rose-300", children: "ទទួលយកមកវិញ ➔" }),
                                    e.jsx("div", { className: "text-[11px] text-slate-200", children: "កាកសំណល់មេតាប៉ូលីស + ឧស្ម័នកាបូនិច (CO₂)" })
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
              ]
            }),

            // TAB 4: Diseases & Hygiene
            n === "tab-health" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                // Diseases of Circulatory System
                e.jsxs("div", {
                  className: "bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between flex-wrap gap-2",
                      children: [
                        e.jsx("h3", { className: "text-base font-bold text-rose-800 dark:text-rose-300 font-moul", children: "🩺 ៣. ក. ជំងឺនៃប្រដាប់របត់ឈាម" }),
                        e.jsx("span", { className: "text-xs font-bold px-3 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-300", children: "ជំងឺគ្រោះថ្នាក់ដែលត្រូវប្រុងប្រយ័ត្ន" })
                      ]
                    }),
                    e.jsx("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
                      children: [
                        { name: "ជំងឺបេះដូងរីក", en: "Cardiomegaly", icon: "🫀", desc: "បេះដូងរីកមាឌខុសប្រក្រតី ធ្វើឱ្យសមត្ថភាពបូមឈាមធ្លាក់ចុះ" },
                        { name: "ប្រឹសបេះដូងពុំមានដំណើរការ", en: "Valvular Disease", icon: "🚪", desc: "ប្រឹសបេះដូងបិទបើកមិនជិត បណ្តាលឱ្យឈាមហូរត្រឡប់ក្រោយ" },
                        { name: "ខ្លាញ់រុំបេះដូង", en: "Pericardial Fat", icon: "🧈", desc: "កោសិកាខ្លាញ់កកកុញជុំវិញបេះដូង រារាំងចលនាកន្ត្រាក់" },
                        { name: "ខ្លាញ់ក្នុងសរសៃឈាម", en: "Atherosclerosis", icon: "🩸", desc: "កូឡេស្តេរ៉ុលកកស្ទះក្នុងសរសៃឈាម បណ្តាលឱ្យឡើងឈាម និងស្ទះសរសៃឈាម" }
                      ].map((d, idx) => e.jsxs("div", {
                        key: idx,
                        className: "p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-slate-900/40 space-y-2",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              e.jsx("span", { className: "text-2xl", children: d.icon }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("h5", { className: "font-bold text-xs text-rose-900 dark:text-rose-300 font-moul leading-tight", children: d.name }),
                                  e.jsx("div", { className: "text-[10px] text-slate-400", children: d.en })
                                ]
                              })
                            ]
                          }),
                          e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: d.desc })
                        ]
                      }))
                    })
                  ]
                }),

                // Warning Symptoms Matrix
                e.jsxs("div", {
                  className: "bg-amber-50 dark:bg-slate-800 p-5 rounded-3xl border border-amber-200 dark:border-slate-700 space-y-4 shadow-xs",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between flex-wrap gap-2",
                      children: [
                        e.jsx("h4", { className: "text-sm font-bold text-amber-900 dark:text-amber-300 font-moul", children: "⚠️ អាការរោគសញ្ញាព្រមាន (កាលណាប្រដាប់របត់ឈាមពុំដំណើរការប្រក្រតី)" }),
                        e.jsx("span", { className: "text-[11px] font-bold text-rose-600 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-rose-200", children: "ត្រូវប្រញាប់ទៅពិគ្រោះជាមួយគ្រូពេទ្យ!" })
                      ]
                    }),
                    e.jsx("div", {
                      className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200",
                      children: [
                        "🤕 ឈឺក្បាល វិលមុខ",
                        "🌀 ខ្យល់គរ",
                        "📈 សម្ពាធឈាមឡើងខ្ពស់",
                        "📉 សម្ពាធឈាមចុះទាប",
                        "💓 ញ័រដើមទ្រូង",
                        "🫁 តឹងទ្រូង ស្ទះដង្ហើម",
                        "⚡ ប្រកាច់",
                        "🥶 ឧស្សាហ៍ត្រជាក់ដៃជើង"
                      ].map((sym, idx) => e.jsx("div", {
                        key: idx,
                        className: "p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 shadow-xs flex items-center justify-center text-center",
                        children: sym
                      }))
                    })
                  ]
                }),

                // 4 Golden Rules for Healthy Circulatory System
                e.jsxs("div", {
                  className: "bg-emerald-50 dark:bg-slate-800 p-5 rounded-3xl border border-emerald-200 dark:border-slate-700 space-y-4 shadow-xs",
                  children: [
                    e.jsx("h4", { className: "text-base font-bold text-emerald-900 dark:text-emerald-300 font-moul", children: "🛡️ ខ. អនាម័យប្រដាប់របត់ឈាម (វិធានការមាសទាំង ៤)" }),
                    e.jsx("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                      children: [
                        {
                          num: "១",
                          title: "កុំស្លៀកពាក់ចង្អៀត & កុំរឹតខ្សែក្រវាត់តឹងពេក",
                          desc: "ការស្លៀកពាក់ចង្អៀតពេកធ្វើឱ្យសង្កត់លើសរសៃឈាម រារាំងចរន្តឈាមរត់ទៅកាន់សរីរាង្គផ្សេងៗ។",
                          icon: "👖"
                        },
                        {
                          num: "២",
                          title: "បរិភោគបន្លែ និងផ្លែឈើឱ្យបានច្រើន",
                          desc: "ផ្តល់ជាតិកាកសរសៃ វីតាមីន និងសារធាតុប្រឆាំងអុកស៊ីតកម្ម ជួយកាត់បន្ថយខ្លាញ់កូឡេស្តេរ៉ុលក្នុងសរសៃឈាម។",
                          icon: "🥦"
                        },
                        {
                          num: "៣",
                          title: "កុំធ្វើការងារហួសកម្លាំង & កុំផឹកស្រាច្រើន",
                          desc: "ការធ្វើការហួសកម្លាំងនិងគ្រឿងស្រវឹងបណ្តាលឱ្យបេះដូងធ្វើការធ្ងន់ធ្ងរ សម្ពាធឈាមឡើងខ្ពស់ និងខូចសរសៃឈាម។",
                          icon: "🚫"
                        },
                        {
                          num: "៤",
                          title: "ឧស្សាហ៍ហាត់ប្រាណតាមសម្រួលឱ្យបានញឹកញាប់",
                          desc: "ការហាត់ប្រាណទៀងទាត់ (ដើរ រត់ត្រុយៗ ជិះកង់) ជួយឱ្យសាច់ដុំបេះដូងរឹងមាំ និងចលនាឈាមដើរស្រួល។",
                          icon: "🏃"
                        }
                      ].map(rule => e.jsxs("div", {
                        key: rule.num,
                        className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 space-y-1.5 shadow-xs",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              e.jsx("span", { className: "w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0", children: rule.num }),
                              e.jsx("h5", { className: "font-bold text-xs text-emerald-950 dark:text-emerald-300 font-moul leading-snug", children: rule.title })
                            ]
                          }),
                          e.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-9", children: rule.desc })
                        ]
                      }))
                    })
                  ]
                })
              ]
            }),

            // TAB 5: 40 QCM Questions Exam
            n === "tab-quiz" && e.jsxs("div", {
              className: "space-y-5 animate-fadeIn",
              children: [
                // Exam Header & Navigation Palette
                e.jsxs("div", {
                  className: "bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between flex-wrap gap-2",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "text-base font-bold text-slate-900 dark:text-white font-moul", children: "📝 តេស្តវាស់ស្ទង់សមត្ថភាព ៖ ៤០ សំណួរ QCM" }),
                            e.jsx("p", { className: "text-xs text-slate-500", children: "សំណួរពហុជ្រើសរើសស្រង់ចេញពីខ្លឹមសារមេរៀនទី ១១ ពេញលេញ" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2 font-bold text-xs",
                          children: [
                            e.jsxs("span", { className: "px-3 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200", children: ["សំណួរទី ", currentQIndex + 1, " / ៤០"] }),
                            e.jsxs("span", { className: "px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200", children: ["ពិន្ទុ ៖ ", score, " / ៤០"] })
                          ]
                        })
                      ]
                    }),

                    // Question Number Jump Palette
                    e.jsx("div", {
                      className: "flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar",
                      children: quizQuestions.map((q, idx) => {
                        const isAnswered = userAnswers[idx] !== undefined;
                        const isCorrect = isAnswered && q.options[userAnswers[idx]]?.isCorrect;
                        let btnStyle = "bg-slate-100 text-slate-600 border-slate-200";
                        if (currentQIndex === idx) btnStyle = "bg-rose-600 text-white font-extrabold ring-2 ring-rose-400";
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

                // Current Question Box
                (() => {
                  const q = quizQuestions[currentQIndex];
                  const userChoice = userAnswers[currentQIndex];
                  return e.jsxs("div", {
                    className: "bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-1",
                        children: [
                          e.jsxs("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ៤០"] }),
                          e.jsx("h4", { className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed font-moul pt-1", children: q.question })
                        ]
                      }),

                      // Options List
                      e.jsx("div", {
                        className: "space-y-2.5 pt-1",
                        children: q.options.map((opt, optIdx) => {
                          const isSelected = userChoice === optIdx;
                          const isAnswered = userChoice !== undefined;
                          let optStyle = "bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700";
                          if (isAnswered) {
                            if (opt.isCorrect) {
                              optStyle = "bg-emerald-500 text-white border-emerald-600 shadow-md font-bold";
                            } else if (isSelected) {
                              optStyle = "bg-rose-500 text-white border-rose-600 shadow-md font-bold";
                            } else {
                              optStyle = "bg-slate-50 dark:bg-slate-900/40 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60";
                            }
                          }
                          const prefix = ["ក. ", "ខ. ", "គ. ", "ឃ. "][optIdx] || "";
                          return e.jsxs("button", {
                            key: optIdx,
                            type: "button",
                            onClick: () => {
                              if (userChoice !== undefined) return;
                              setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }));
                              if (opt.isCorrect) {
                                playTone(659.25, "sine", 0.25);
                                s && s("ចម្លើយត្រឹមត្រូវ! +50 XP ⭐");
                              } else {
                                playTone(220, "sawtooth", 0.3);
                              }
                            },
                            disabled: userChoice !== undefined,
                            className: \`w-full text-left p-3.5 rounded-2xl border-2 text-xs transition-all flex items-center justify-between cursor-pointer \${optStyle}\`,
                            children: [
                              e.jsxs("span", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx("span", { className: "font-bold shrink-0", children: prefix }),
                                  opt.text
                                ]
                              }),
                              isAnswered && (opt.isCorrect ? e.jsx("span", { className: "text-sm", children: "✓" }) : isSelected ? e.jsx("span", { className: "text-sm", children: "✕" }) : null)
                            ]
                          });
                        })
                      }),

                      // Explanation Box
                      userChoice !== undefined && e.jsxs("div", {
                        className: \`p-3.5 rounded-2xl text-xs space-y-1 animate-in fade-in duration-200 \${q.options[userChoice]?.isCorrect ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-300" : "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-900 dark:text-rose-300"}\`,
                        children: [
                          e.jsx("div", { className: "font-bold flex items-center gap-1.5", children: q.options[userChoice]?.isCorrect ? "🎉 ពូកែណាស់! ចម្លើយត្រឹមត្រូវ" : "⚠️ មិនទាន់ត្រឹមត្រូវទេ" }),
                          e.jsx("p", { className: "leading-relaxed text-[11px]", children: q.explanation })
                        ]
                      }),

                      // Bottom Prev / Next Navigation
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
                              className: "px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer",
                              children: "សំណួរបន្ទាប់ →"
                            }) :
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => {
                                setIsFinished(!0);
                                playTone(880, "triangle", 0.5);
                                s && s(\`បញ្ចប់តេស្ត! អ្នកឆ្លើយត្រូវ \${score} / ៤០ សំណួរ\`);
                              },
                              className: "px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer",
                              children: ["🏆 បញ្ចប់ការប្រឡង (", score, "/៤០)"]
                            })
                        ]
                      })
                    ]
                  });
                })(),

                // Results Summary
                isFinished && e.jsxs("div", {
                  className: "bg-gradient-to-r from-rose-600 to-amber-600 text-white p-5 sm:p-6 rounded-3xl shadow-xl space-y-3 animate-in zoom-in-95 duration-200",
                  children: [
                    e.jsx("h3", { className: "text-base font-bold font-moul", children: "🎉 លទ្ធផលការប្រឡងតេស្តមេរៀនទី ១១" }),
                    e.jsxs("div", {
                      className: "flex items-center gap-4 text-xs font-bold",
                      children: [
                        e.jsxs("span", { children: ["ពិន្ទុសរុប ៖ ", score, " / ៤០ (", Math.round((score / 40) * 100), "%)"] }),
                        e.jsxs("span", { children: ["រង្វាន់ XP ៖ +", score * 50, " XP ⭐"] })
                      ]
                    }),
                    e.jsx("p", {
                      className: "text-xs text-rose-100",
                      children: score >= 28 ? "អបអរសាទរ! អ្នកបានឆ្លងកាត់ការវាស់ស្ទង់សមត្ថភាពមេរៀនទី ១១ (ប្រដាប់របត់ឈាម) យ៉ាងឆ្នើម។" : "សូមព្យាយាមអានមេរៀនឡើងវិញ និងធ្វើតេស្តម្តងទៀតដើម្បីពង្រឹងចំណេះដឹងបន្ថែម។"
                    }),
                    e.jsx("button", {
                      type: "button",
                      onClick: () => {
                        setIsFinished(!1);
                        setUserAnswers({});
                        setCurrentQIndex(0);
                      },
                      className: "px-4 py-2 rounded-xl bg-white text-rose-800 font-bold text-xs shadow-md hover:bg-rose-50 transition cursor-pointer",
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

// Validate with esbuild
try {
  esbuild.transformSync(code, { loader: "js" });
  console.log("ESBUILD VALIDATION: Rz11 code passes 100% without any syntax errors!");
  fs.writeFileSync('scripts/rz11_component_code.js', code);
  console.log("Successfully created scripts/rz11_component_code.js!");
} catch (err) {
  console.error("Syntax error building Rz11:", err.message);
  process.exit(1);
}
