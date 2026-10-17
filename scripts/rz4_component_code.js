var Rz4 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [l, o] = y.useState(!1);
  const [c, d] = y.useState(0);
  const [u, h] = y.useState(!1);

  // Components tab state
  const [compCategory, setCompCategory] = y.useState("biotic");

  // Ecosystem tab state
  const [chainRole, setChainRole] = y.useState("producer");

  // Threats tab state
  const [threatCategory, setThreatCategory] = y.useState("deforest");

  // Conservation tab state
  const [actionCategory, setActionCategory] = y.useState("3r");

  // Lab simulator states
  const [labForest, setLabForest] = y.useState(3); // 1-3
  const [labEmissions, setLabEmissions] = y.useState(1); // 1-3
  const [labRecycle, setLabRecycle] = y.useState(2); // 1-3
  const [labProtect, setLabProtect] = y.useState(!0);

  // Matching & Sequence games states
  const [seqSteps, setSeqSteps] = y.useState([3, 1, 4, 2]);
  const [seqResult, setSeqResult] = y.useState(null);
  const [matchAns, setMatchAns] = y.useState({ 1: "", 2: "", 3: "", 4: "", 5: "" });
  const [matchResult, setMatchResult] = y.useState(null);

  // 40 QCM states
  const [Y, U] = y.useState(0);
  const [q, ae] = y.useState({});
  const [ie, re] = y.useState(!1);
  const [toastMsg, setToastMsg] = y.useState(null);

  y.useEffect(() => {
    a && i(a);
  }, [a, r]);

  const J = Ie => {
    try {
      const De = window.AudioContext || window.webkitAudioContext;
      if (!De) return;
      const Be = new De(), be = Be.createOscillator(), Qe = Be.createGain();
      be.connect(Qe), Qe.connect(Be.destination);
      const Et = Be.currentTime;
      Ie === "correct" ? (
        be.type = "triangle",
        be.frequency.setValueAtTime(523.25, Et),
        be.frequency.exponentialRampToValueAtTime(783.99, Et + .15),
        be.frequency.exponentialRampToValueAtTime(1046.5, Et + .3),
        Qe.gain.setValueAtTime(.2, Et),
        Qe.gain.exponentialRampToValueAtTime(.01, Et + .35),
        be.start(Et),
        be.stop(Et + .35)
      ) : Ie === "wrong" ? (
        be.type = "sawtooth",
        be.frequency.setValueAtTime(300, Et),
        be.frequency.linearRampToValueAtTime(180, Et + .25),
        Qe.gain.setValueAtTime(.18, Et),
        Qe.gain.exponentialRampToValueAtTime(.01, Et + .3),
        be.start(Et),
        be.stop(Et + .3)
      ) : Ie === "click" && (
        be.type = "sine",
        be.frequency.setValueAtTime(600, Et),
        Qe.gain.setValueAtTime(.04, Et),
        Qe.gain.exponentialRampToValueAtTime(.001, Et + .08),
        be.start(Et),
        be.stop(Et + .08)
      );
    } catch (e) {}
  };

  const se = () => {
    try {
      rd({ particleCount: 85, spread: 75, origin: { y: .6 } });
    } catch (e) {}
  };

  const showNotif = (title, message, isSuccess = !0) => {
    setToastMsg({ title, message, isSuccess });
    setTimeout(() => { setToastMsg(null); }, 3800);
  };

  const me = () => {
    if (!("speechSynthesis" in window)) {
      showNotif("មិនគាំទ្រ", "Browser របស់អ្នកមិនគាំទ្រមុខងារអានជាសំឡេងឡើយ។", !1);
      return;
    }
    if (u) {
      window.speechSynthesis.cancel();
      h(!1);
      return;
    }
    const Ie = n === "tab-hero"
      ? "មេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ ថ្នាក់ទី ៦។ បរិស្ថានគឺជាអ្វីៗទាំងអស់ដែលនៅជុំវិញខ្លួនយើង រួមមានបរិស្ថានធម្មជាតិ និងបរិស្ថានកែច្នៃ។ បរិស្ថានធម្មជាតិផ្សំឡើងពីកត្តាជីវៈ និងកត្តាអជីវៈ ដែលមានទំនាក់ទំនងគ្នាយ៉ាងជិតស្និទ្ធ។"
      : n === "tab-components"
      ? "ចំណុចទី ១ និយមន័យ និងសមាសភាគបរិស្ថាន។ សមាសភាគមានជីវិត រួមមាន មនុស្ស សត្វ រុក្ខជាតិ បាក់តេរី។ សមាសភាគគ្មានជីវិត រួមមាន ដី ទឹក ខ្យល់ ពន្លឺថ្ងៃ និងសីតុណ្ហភាព។"
      : n === "tab-ecosystem"
      ? "ចំណុចទី ២ ទំនាក់ទំនងក្នុងប្រព័ន្ធអេកូឡូស៊ី និងច្រវាក់អាហារ។ រុក្ខជាតិជាផលិតករ សត្វស៊ីរុក្ខជាតិជាអ្នកប្រើប្រាស់ថ្នាក់ទី១ សត្វស៊ីសាច់ជាអ្នកប្រើប្រាស់ថ្នាក់បន្ត និងបាក់តេរីជាអ្នករំលាយធាតុ។"
      : n === "tab-threats"
      ? "ចំណុចទី ៣ ការគំរាមកំហែងបរិស្ថាន។ ការកាប់បំផ្លាញព្រៃឈើ ការបំពុលទឹក ការបំពុលខ្យល់ និងការបរបាញ់សត្វព្រៃ បង្កឱ្យមានការប្រែប្រួលអាកាសធាតុ និងគ្រោះធម្មជាតិ។"
      : n === "tab-conservation"
      ? "ចំណុចទី ៤ វិធានការការពារ និងអភិរក្ស។ ចូលរួមដាំដើមឈើ អនុវត្តគោលការណ៍ 3R កាត់បន្ថយ ប្រើឡើងវិញ កែច្នៃ មិនបំពុលទឹក និងការពារសត្វព្រៃ។"
      : n === "tab-lab"
      ? "មន្ទីរពិសោធន៍អេកូឡូស៊ីនិម្មិត។ សាកល្បងកែប្រែគម្របព្រៃឈើ ការបញ្ចេញផ្សែងពុល និងការកែច្នៃសំរាម ដើម្បីតាមដានតុល្យភាពធម្មជាតិ។"
      : n === "tab-match"
      ? "ល្បែងផ្គូផ្គង និងរៀបលំដាប់លំដោយ ច្រវាក់អាហារ និងគោលការណ៍អភិរក្សបរិស្ថាន។"
      : `កម្រង ៤០ សំណួរ QCM មេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ។ សំណួរទី ${Y + 1} ៖ ${Zi4[Y].question}`;
    const De = new SpeechSynthesisUtterance(Ie);
    De.lang = "km-KH";
    De.rate = .9;
    De.onstart = () => h(!0);
    De.onend = () => h(!1);
    De.onerror = () => h(!1);
    window.speechSynthesis.speak(De);
  };

  const addProgress = amt => {
    d(prev => Math.min(100, prev + amt));
  };

  // Lab calculations
  const calcLabStatus = () => {
    let score = 100;
    let issues = [];

    // Forest cover
    if (labForest === 1) {
      score -= 35;
      issues.push("បាត់បង់ព្រៃឈើធ្ងន់ធ្ងរ បណ្តាលឱ្យឡើងកម្ដៅ និងហូរច្រោះដី!");
    } else if (labForest === 2) {
      score -= 15;
      issues.push("គម្របព្រៃឈើមធ្យម គួរបង្កើនការដាំដើមឈើបន្ថែម!");
    }

    // Industrial emissions
    if (labEmissions === 3) {
      score -= 35;
      issues.push("ការបញ្ចេញផ្សែងពុលខ្លាំង បង្កបាតុភូតផ្ទះកញ្ចក់ និងបំពុលខ្យល់!");
    } else if (labEmissions === 2) {
      score -= 15;
      issues.push("ការបញ្ចេញផ្សែងពុលកម្រិតមធ្យម!");
    }

    // Recycling
    if (labRecycle === 1) {
      score -= 25;
      issues.push("ខ្វះការកែច្នៃសំរាម បង្កការកកកុញសំណល់ប្លាស្ទិកកខ្វក់!");
    }

    // Wildlife protection
    if (!labProtect) {
      score -= 20;
      issues.push("គ្មានការការពារសត្វព្រៃ ប្រឈមនឹងការបាត់បង់ជីវចម្រុះ!");
    }

    score = Math.max(10, Math.min(100, score));

    const health = score >= 85 ? "បរិស្ថានស្អាត តុល្យភាពធម្មជាតិល្អប្រសើរ (Balanced Environment)"
      : score >= 55 ? "បរិស្ថានរងការបំពុលមធ្យម ត្រូវការអភិរក្សបន្ថែម (Moderate Pollution)"
      : "បរិស្ថានរងការបំផ្លាញធ្ងន់ធ្ងរ ប្រឈមគ្រោះមហន្តរាយ! (Severe Damage)";

    const color = score >= 85 ? "text-sky-700 bg-sky-50 border-sky-300"
      : score >= 55 ? "text-amber-700 bg-amber-50 border-amber-300"
      : "text-rose-700 bg-rose-50 border-rose-300";

    const aqi = labEmissions === 3 ? "១៨០ (កខ្វក់ខ្លាំង)" : labEmissions === 2 ? "៩៥ (មធ្យម)" : "២៥ (បរិសុទ្ធល្អ)";
    const tempIndex = labForest === 1 && labEmissions === 3 ? "+២.៥ °C (ឡើងកម្ដៅខ្លាំង)" : labForest === 3 ? "+០.២ °C (ធម្មតា)" : "+១.០ °C (ក្តៅល្មម)";

    return { score, issues, health, color, aqi, tempIndex };
  };

  const labStatus = calcLabStatus();

  // Sequence game checker (Food Chain: Producer -> Herbivore -> Carnivore -> Decomposer)
  const checkSequence = () => {
    const isCorrect = seqSteps.join(",") === "1,2,3,4";
    if (isCorrect) {
      J("correct");
      se();
      setSeqResult({ success: !0, msg: "អបអរសាទរ! អ្នកបានរៀបលំដាប់ច្រវាក់អាហារក្នុងធម្មជាតិបានត្រឹមត្រូវ ១០០%!" });
      addProgress(15);
    } else {
      J("wrong");
      setSeqResult({ success: !1, msg: "លំដាប់មិនទាន់ត្រឹមត្រូវទេ។ ច្រវាក់អាហារចាប់ផ្តើមពី រុក្ខជាតិ (ផលិតករ) -> សត្វស៊ីរុក្ខជាតិ -> សត្វស៊ីសាច់ -> អ្នករំលាយធាតុ!" });
    }
  };

  const moveSeq = (fromIdx, toIdx) => {
    const updated = [...seqSteps];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setSeqSteps(updated);
    setSeqResult(null);
    J("click");
  };

  // Match game checker
  const checkMatch = () => {
    const correctPairs = { 1: "c", 2: "a", 3: "e", 4: "b", 5: "d" };
    let correctCount = 0;
    Object.keys(correctPairs).forEach(k => {
      if (matchAns[k] === correctPairs[k]) correctCount++;
    });
    if (correctCount === 5) {
      J("correct");
      se();
      setMatchResult({ success: !0, msg: "អស្ចារ្យណាស់! អ្នកបានផ្គូផ្គងកត្តាបរិស្ថាន និងវិធានការការពារបានត្រឹមត្រូវទាំងអស់ (៥/៥)!" });
      addProgress(20);
    } else {
      J("wrong");
      setMatchResult({ success: !1, msg: `អ្នកផ្គូផ្គងត្រូវបាន ${correctCount} / ៥។ សូមព្យាយាមផ្គូផ្គងឡើងវិញ!` });
    }
  };

  // 40 QCM answer handler
  const handleAnswer = (qIdx, optIdx) => {
    if (q[qIdx] !== undefined) return;
    const isCorrect = Zi4[qIdx].options[optIdx].isCorrect;
    ae(prev => ({ ...prev, [qIdx]: optIdx }));
    re(!0);
    if (isCorrect) {
      J("correct");
      addProgress(2.5);
    } else {
      J("wrong");
    }
  };

  const nextQuestion = () => {
    if (Y < Zi4.length - 1) {
      Y === Zi4.length - 2 && se();
      U(prev => prev + 1);
      re(q[Y + 1] !== undefined);
      J("click");
    }
  };

  const prevQuestion = () => {
    if (Y > 0) {
      U(prev => prev - 1);
      re(q[Y - 1] !== undefined);
      J("click");
    }
  };

  const calcQuizStats = () => {
    let corr = 0;
    Object.keys(q).forEach(k => {
      const idx = parseInt(k);
      const chosen = q[idx];
      if (Zi4[idx].options[chosen] && Zi4[idx].options[chosen].isCorrect) corr++;
    });
    return { answered: Object.keys(q).length, correct: corr };
  };

  const quizStats = calcQuizStats();

  const navTabs = [
    { id: "tab-hero", label: "១. ទិដ្ឋភាពទូទៅ", icon: "🌍" },
    { id: "tab-components", label: "២. សមាសភាគបរិស្ថាន", icon: "🌿" },
    { id: "tab-ecosystem", label: "៣. ច្រវាក់អាហារ", icon: "🔄" },
    { id: "tab-threats", label: "៤. ការបំពុល & ការប្រែប្រួល", icon: "⚠️" },
    { id: "tab-conservation", label: "៥. វិធានការអភិរក្ស 3R", icon: "🌱" },
    { id: "tab-lab", label: "៦. ពិសោធន៍អេកូឡូស៊ី", icon: "🔬" },
    { id: "tab-match", label: "៧. ល្បែងផ្គូផ្គង & រៀបលំដាប់", icon: "🧩" },
    { id: "tab-quiz", label: "៨. កម្រង ៤០ សំណួរ QCM", icon: "❓", special: !0 }
  ];

  return e.jsx("div", {
    className: `fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex flex-col ${l ? "p-0" : "p-2 sm:p-4 md:p-6"}`,
    children: e.jsxs("div", {
      className: `bg-slate-50 text-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-sky-500/30 w-full ${l ? "h-screen rounded-none" : "max-w-7xl mx-auto min-h-[90vh]"}`,
      children: [
        // Header
        e.jsx("header", {
          className: "bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs",
          children: e.jsxs("div", {
            className: "flex items-center justify-between w-full gap-4",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  e.jsx("div", {
                    className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-600 to-emerald-700 flex items-center justify-center text-white text-xl shadow-md",
                    children: "🌍"
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsx("span", { className: "text-[10px] font-black px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 uppercase tracking-wider", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" }),
                          e.jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "ជំពូកទី ២ • មេរៀនទី ៤" })
                        ]
                      }),
                      e.jsx("h1", {
                        className: "text-sm sm:text-base font-bold text-slate-900 leading-tight font-moul",
                        children: "មេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ (Natural Environment)"
                      })
                    ]
                  })
                ]
              }),
              e.jsxs("div", {
                className: "flex items-center gap-2 sm:gap-3",
                children: [
                  e.jsxs("button", {
                    onClick: me,
                    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${u ? "bg-rose-50 text-rose-700 border border-rose-300 animate-pulse" : "bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300"}`,
                    title: "អានមេរៀនជាសំឡេងខ្មែរ",
                    children: [
                      e.jsx("span", { children: u ? "🔊" : "🔈" }),
                      e.jsx("span", { className: "hidden sm:inline", children: u ? "កំពុងអាន..." : "អានជាសំឡេង" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "hidden md:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200",
                    children: [
                      e.jsx("span", { className: "text-[11px] font-bold text-emerald-800", children: "វឌ្ឍនភាព ៖" }),
                      e.jsxs("span", { className: "text-xs font-bold text-emerald-900", children: [c, " %"] })
                    ]
                  }),
                  e.jsx("button", {
                    onClick: () => o(!l),
                    className: "p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer",
                    title: l ? "ចាកចេញពីពេញអេក្រង់" : "ពេញអេក្រង់",
                    children: l ? "⤓" : "⤢"
                  }),
                  e.jsx("button", {
                    onClick: t,
                    className: "p-2 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-xl transition cursor-pointer font-bold",
                    title: "បិទផ្ទាំង",
                    children: "✕"
                  })
                ]
              })
            ]
          })
        }),

        // Navigation
        e.jsx("nav", {
          className: "bg-slate-900 text-white shadow-inner border-t border-slate-800",
          children: e.jsx("div", {
            className: "max-w-7xl mx-auto px-2 sm:px-6 lg:px-8",
            children: e.jsx("div", {
              className: "flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar text-xs sm:text-sm font-medium",
              children: navTabs.map(item => {
                const isActive = n === item.id;
                return e.jsxs("button", {
                  onClick: () => { J("click"); i(item.id); },
                  className: `px-3.5 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${isActive ? "bg-gradient-to-r from-sky-600 to-teal-700 text-white shadow-md font-bold" : item.special ? "bg-sky-600/30 text-sky-200 hover:bg-sky-600 hover:text-white" : "bg-transparent text-slate-300 hover:bg-slate-800"}`,
                  children: [
                    e.jsx("span", { children: item.icon }),
                    e.jsx("span", { children: item.label })
                  ]
                }, item.id);
              })
            })
          })
        }),

        // Main
        e.jsxs("main", {
          className: "flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full overflow-y-auto",
          children: [
            toastMsg && e.jsxs("div", {
              className: `mb-4 p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-in fade-in ${toastMsg.isSuccess ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-rose-50 border-rose-300 text-rose-800"}`,
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    e.jsx("span", { children: toastMsg.isSuccess ? "✅" : "⚠️" }),
                    e.jsxs("span", { children: [toastMsg.title, " ៖ ", toastMsg.message] })
                  ]
                }),
                e.jsx("button", { onClick: () => setToastMsg(null), className: "text-slate-400 hover:text-slate-700", children: "✕" })
              ]
            }),

            // Tab 1: Hero
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-950 via-teal-950 to-slate-900 text-white p-6 sm:p-10 shadow-lg border border-sky-600/30",
                  children: [
                    e.jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" }),
                    e.jsxs("div", {
                      className: "relative z-10 max-w-3xl space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold",
                          children: [
                            e.jsx("span", { children: "🌍" }),
                            e.jsx("span", { children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ • ជំពូកទី ២ (បរិស្ថាន)" })
                          ]
                        }),
                        e.jsx("h2", {
                          className: "text-2xl sm:text-4xl font-extrabold font-moul leading-tight text-sky-100",
                          children: "មេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ"
                        }),
                        e.jsx("p", {
                          className: "text-xs sm:text-sm text-slate-300 leading-relaxed",
                          children: "បរិស្ថានគឺជាអ្វីៗទាំងអស់ដែលនៅជុំវិញខ្លួនយើង រួមមានភាវៈមានជីវិត និងភាវៈគ្មានជីវិត។ បរិស្ថានធម្មជាតិផ្តល់ស្បៀងអាហារ ទឹកស្អាត ខ្យល់ដង្ហើម និងជម្រកដល់ជីវចម្រុះ។ យើងត្រូវរួមគ្នាថែរក្សា និងអភិរក្សបរិស្ថានឱ្យបានស្អាតបៃតងជានិច្ច។"
                        }),
                        e.jsxs("div", {
                          className: "flex flex-wrap gap-2.5 pt-2",
                          children: [
                            e.jsxs("button", {
                              onClick: () => { J("click"); i("tab-lab"); },
                              className: "px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-600 hover:from-sky-600 hover:to-teal-700 text-slate-950 font-black rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer",
                              children: [e.jsx("span", { children: "🔬" }), e.jsx("span", { children: "ពិសោធន៍អេកូឡូស៊ីនិម្មិត" })]
                            }),
                            e.jsxs("button", {
                              onClick: () => { J("click"); i("tab-quiz"); },
                              className: "px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer",
                              children: [e.jsx("span", { children: "❓" }), e.jsx("span", { children: "ប្រឡង ៤០ QCM ពេញលេញ" })]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // 4 Pillars Grid
                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                  children: [
                    { title: "១. សមាសភាគបរិស្ថាន", icon: "🌿", desc: "កត្តាជីវៈ (មនុស្ស សត្វ រុក្ខជាតិ) និងកត្តាអជីវៈ (ដី ទឹក ខ្យល់ ពន្លឺថ្ងៃ)", tab: "tab-components", bg: "from-emerald-500/10 to-teal-500/10 border-emerald-300" },
                    { title: "២. ច្រវាក់អាហារ", icon: "🔄", desc: "ផលិតករ (រុក្ខជាតិ), អ្នកប្រើប្រាស់ (សត្វស៊ីរុក្ខជាតិ/សាច់) និងអ្នករំលាយធាតុ", tab: "tab-ecosystem", bg: "from-sky-500/10 to-blue-500/10 border-sky-300" },
                    { title: "៣. ការបំពុល & ប្រែប្រួល", icon: "⚠️", desc: "ការកាប់ព្រៃឈើ បំពុលទឹក បំពុលខ្យល់ និងការឡើងកម្ដៅផែនដី", tab: "tab-threats", bg: "from-amber-500/10 to-rose-500/10 border-amber-300" },
                    { title: "៤. អភិរក្ស & 3R", icon: "🌱", desc: "ដាំដើមឈើ គោលការណ៍ 3R កាត់បន្ថយ ប្រើឡើងវិញ និងកែច្នៃសំរាម", tab: "tab-conservation", bg: "from-teal-500/10 to-cyan-500/10 border-teal-300" }
                  ].map((col, idx) => e.jsxs("div", {
                    key: idx,
                    onClick: () => { J("click"); i(col.tab); },
                    className: `p-5 rounded-2xl bg-gradient-to-br ${col.bg} border shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3`,
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx("span", { className: "text-2xl", children: col.icon }),
                          e.jsx("h3", { className: "font-bold text-slate-900 text-sm font-moul", children: col.title })
                        ]
                      }),
                      e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: col.desc }),
                      e.jsxs("span", { className: "text-[11px] font-bold text-sky-700 flex items-center gap-1", children: [e.jsx("span", { children: "ស្វែងយល់បន្ថែម" }), e.jsx("span", { children: "→" })] })
                    ]
                  }))
                })
              ]
            }),

            // Tab 2: Components
            n === "tab-components" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "ផ្នែកទី ១ ៖ សមាសភាគបរិស្ថាន" }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "បរិស្ថានធម្មជាតិ និងសមាសភាគផ្សំ" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "ស្វែងយល់ពីរចនាសម្ព័ន្ធកត្តាជីវៈ និងកត្តាអជីវៈ ៖" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex gap-2",
                          children: [
                            e.jsxs("button", {
                              onClick: () => { J("click"); setCompCategory("biotic"); },
                              className: `px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${compCategory === "biotic" ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
                              children: [e.jsx("span", { children: "🌱" }), e.jsx("span", { children: "កត្តាជីវៈ (មានជីវិត)" })]
                            }),
                            e.jsxs("button", {
                              onClick: () => { J("click"); setCompCategory("abiotic"); },
                              className: `px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${compCategory === "abiotic" ? "bg-sky-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
                              children: [e.jsx("span", { children: "☀️" }), e.jsx("span", { children: "កត្តាអជីវៈ (គ្មានជីវិត)" })]
                            })
                          ]
                        })
                      ]
                    }),

                    compCategory === "biotic" ? e.jsxs("div", {
                      className: "p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-3",
                          children: [
                            e.jsx("span", { className: "text-3xl", children: "🦋" }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "១. សមាសភាគមានជីវិត (កត្តាជីវៈ / Biotic Factors)" }),
                                e.jsx("p", { className: "text-xs text-emerald-800 font-bold", children: "សារពាង្គកាយរស់ទាំងអស់នៅក្នុងធម្មជាតិ" })
                              ]
                            })
                          ]
                        }),
                        e.jsx("div", {
                          className: "grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700",
                          children: [
                            { title: "មនុស្ស និង សត្វ", desc: "មនុស្ស សត្វចិញ្ចឹម សត្វព្រៃ បសុបក្សី និងមច្ឆាជាតិ", icon: "🐅" },
                            { title: "រុក្ខជាតិ និង ព្រៃឈើ", desc: "ដើមឈើធំៗ ស្មៅ ដំណាំ បន្លែ ផ្លែឈើ និងសារាយទឹក", icon: "🌳" },
                            { title: "មីក្រូសារពាង្គកាយ", desc: "ពពួកបាក់តេរី ផ្សិត និងសារពាង្គកាយល្អិតៗក្នុងដី", icon: "🦠" }
                          ].map((item, idx) => e.jsxs("div", {
                            key: idx,
                            className: "p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5",
                            children: [
                              e.jsxs("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1.5", children: [e.jsx("span", { children: item.icon }), item.title] }),
                              e.jsx("p", { className: "text-[11px] text-slate-600 leading-relaxed", children: item.desc })
                            ]
                          }))
                        })
                      ]
                    }) : e.jsxs("div", {
                      className: "p-6 rounded-3xl bg-sky-50/60 border border-sky-200 space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-3",
                          children: [
                            e.jsx("span", { className: "text-3xl", children: "🏞️" }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "២. សមាសភាគគ្មានជីវិត (កត្តាអជីវៈ / Abiotic Factors)" }),
                                e.jsx("p", { className: "text-xs text-sky-800 font-bold", children: "ធាតុអរូប និងរូបធាតុធម្មជាតិទ្រទ្រង់ជីវិត" })
                              ]
                            })
                          ]
                        }),
                        e.jsx("div", {
                          className: "grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-700",
                          children: [
                            { title: "ដី និង ថ្ម", desc: "ផ្តល់ជម្រក រ៉ែ និងជីវជាតិដល់ឫសរុក្ខជាតិ", icon: "🪨" },
                            { title: "ទឹកស្អាត", desc: "ទ្រទ្រង់កោសិកា រក្សាសំណើម និងរំលាយអាហារ", icon: "💧" },
                            { title: "ខ្យល់ដង្ហើម", desc: "ផ្តល់អុកស៊ីសែនដកដង្ហើម និងកាបូនិចធ្វើរស្មីសំយោគ", icon: "💨" },
                            { title: "ពន្លឺ និង កម្ដៅ", desc: "ថាមពលព្រះអាទិត្យសម្រាប់រស្មីសំយោគ និងសីតុណ្ហភាព", icon: "☀️" }
                          ].map((item, idx) => e.jsxs("div", {
                            key: idx,
                            className: "p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5",
                            children: [
                              e.jsxs("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1.5", children: [e.jsx("span", { children: item.icon }), item.title] }),
                              e.jsx("p", { className: "text-[11px] text-slate-600 leading-relaxed", children: item.desc })
                            ]
                          }))
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 3: Ecosystem
            n === "tab-ecosystem" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4",
                      children: [
                        e.jsx("span", { className: "bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "ផ្នែកទី ២ ៖ ប្រព័ន្ធអេកូឡូស៊ី" }),
                        e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "ទំនាក់ទំនងក្នុងច្រវាក់អាហារ (Food Chain)" }),
                        e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "តួនាទី ៤ យ៉ាងក្នុងខ្សែច្រវាក់អាហារធម្មជាតិ ៖" })
                      ]
                    }),

                    e.jsx("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                      children: [
                        { role: "១. ផលិតករ (Producers)", title: "រុក្ខជាតិបៃតង", desc: "ផលិតអាហារដោយខ្លួនឯងតាមរស្មីសំយោគ ដោយប្រើពន្លឺថ្ងៃ ទឹក និងកាបូនិច", icon: "🌱", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
                        { role: "២. អ្នកប្រើប្រាស់ថ្នាក់ទី១", title: "សត្វស៊ីរុក្ខជាតិ", desc: "គោ ក្របី កណ្តូប ទន្សាយ ស៊ីស្មៅនិងស្លឹកឈើជាអាហារប្រចាំថ្ងៃ", icon: "🐇", color: "bg-amber-50 border-amber-200 text-amber-900" },
                        { role: "៣. អ្នកប្រើប្រាស់ថ្នាក់បន្ត", title: "សត្វស៊ីសាច់", desc: "កង្កែបស៊ីកណ្តូប ពស់ស៊ីកង្កែប ឥន្ទ្រីស៊ីពស់ ខ្លាស៊ីសាច់សត្វ", icon: "🦅", color: "bg-rose-50 border-rose-200 text-rose-900" },
                        { role: "៤. អ្នករំលាយធាតុ (Decomposers)", title: "បាក់តេរី & ផ្សិត", desc: "រំលាយសាកសពសត្វនិងរុក្ខជាតិពុកផុយឱ្យក្លាយជាជីជាតិក្នុងដីវិញ", icon: "🍄", color: "bg-purple-50 border-purple-200 text-purple-900" }
                      ].map((item, idx) => e.jsxs("div", {
                        key: idx,
                        className: `p-5 rounded-2xl border ${item.color} space-y-2`,
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              e.jsx("span", { className: "text-2xl", children: item.icon }),
                              e.jsx("span", { className: "text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/80", children: item.role })
                            ]
                          }),
                          e.jsx("h4", { className: "font-bold text-xs font-moul", children: item.title }),
                          e.jsx("p", { className: "text-[11px] leading-relaxed opacity-90", children: item.desc })
                        ]
                      }))
                    })
                  ]
                })
              ]
            }),

            // Tab 4: Threats
            n === "tab-threats" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4",
                      children: [
                        e.jsx("span", { className: "bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "ផ្នែកទី ៤ ៖ ការគំរាមកំហែង" }),
                        e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "ការបំពុល និងការប្រែប្រួលបរិស្ថាន" }),
                        e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "បញ្ហាប្រឈមធំៗ ៤ យ៉ាងដែលបណ្តាលមកពីសកម្មភាពមនុស្ស ៖" })
                      ]
                    }),

                    e.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: [
                        { title: "១. ការកាប់បំផ្លាញព្រៃឈើ", desc: "បាត់បង់ជម្រកសត្វព្រៃ ហូរច្រោះដី រាំងស្ងួត ទឹកជំនន់ និងកើនឡើងកម្ដៅផែនដី", icon: "🪓", color: "border-rose-200 bg-rose-50/50" },
                        { title: "២. ការបំពុលទឹក", desc: "បង្ហូរទឹកស្អុយរោងចក្រ ចាក់គីមី និងបោះសំរាមប្លាស្ទិកចូលស្ទឹងបឹងបួ សម្លាប់មច្ឆាជាតិ", icon: "☣️", color: "border-amber-200 bg-amber-50/50" },
                        { title: "៣. ការបំពុលខ្យល់", desc: "ផ្សែងពុលពីរថយន្ត ម៉ូតូ រោងចក្រ និងការដុតសំរាម បង្កជំងឺសួត និងផ្ទះកញ្ចក់", icon: "🏭", color: "border-slate-200 bg-slate-100/50" },
                        { title: "៤. ការបរបាញ់សត្វព្រៃខុសច្បាប់", desc: "ធ្វើឱ្យសត្វព្រៃកម្រជិតផុតពូជ និងបាត់បង់តុល្យភាពច្រវាក់អាហារក្នុងធម្មជាតិ", icon: "🏹", color: "border-purple-200 bg-purple-50/50" }
                      ].map((item, idx) => e.jsxs("div", {
                        key: idx,
                        className: `p-5 rounded-2xl border ${item.color} space-y-2`,
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              e.jsx("span", { className: "text-2xl", children: item.icon }),
                              e.jsx("h3", { className: "font-bold text-slate-900 text-sm font-moul", children: item.title })
                            ]
                          }),
                          e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: item.desc })
                        ]
                      }))
                    })
                  ]
                })
              ]
            }),

            // Tab 5: Conservation 3R
            n === "tab-conservation" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4",
                      children: [
                        e.jsx("span", { className: "bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "ផ្នែកទី ៥ ៖ វិធានការអភិរក្ស" }),
                        e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "ការថែរក្សា និងអភិរក្សបរិស្ថាន (3R Principles)" }),
                        e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "សកម្មភាព ៥ យ៉ាងដែលយើងត្រូវចូលរួមទាំងអស់គ្នា ៖" })
                      ]
                    }),

                    e.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                      children: [
                        { title: "Reduce (កាត់បន្ថយ)", desc: "កាត់បន្ថយការប្រើប្រាស់ថង់ប្លាស្ទិក ប្រើកន្ត្រកក្រណាត់ និងសន្សំសំចៃទឹកភ្លើង", icon: "📉" },
                        { title: "Reuse (ប្រើឡើងវិញ)", desc: "យកដបទឹក ដបកែវ និងប្រអប់ចាស់ៗមកប្រើប្រាស់ឡើងវិញឱ្យអស់លទ្ធភាព", icon: "🔄" },
                        { title: "Recycle (កែច្នៃ)", desc: "ញែកសំរាមសើមធ្វើជីកំប៉ុស្ត រីឯកដាស ប្លាស្ទិក កំប៉ុង យកទៅរោងចក្រកែច្នៃ", icon: "♻️" }
                      ].map((item, idx) => e.jsxs("div", {
                        key: idx,
                        className: "p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              e.jsx("span", { className: "text-2xl", children: item.icon }),
                              e.jsx("h3", { className: "font-bold text-sm font-moul", children: item.title })
                            ]
                          }),
                          e.jsx("p", { className: "text-xs leading-relaxed text-emerald-800", children: item.desc })
                        ]
                      }))
                    })
                  ]
                })
              ]
            }),

            // Tab 6: Lab Ecosystem Simulator
            n === "tab-lab" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4",
                      children: [
                        e.jsx("span", { className: "bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "មន្ទីរពិសោធន៍និម្មិត" }),
                        e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "បន្ទប់ពិសោធន៍តុល្យភាពអេកូឡូស៊ី (Ecosystem Simulator)" }),
                        e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "កែប្រែកត្តាបរិស្ថាន និងសង្កេតមើលគុណភាពខ្យល់ សីតុណ្ហភាព និងជីវចម្រុះ ៖" })
                      ]
                    }),

                    // Controls
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                      children: [
                        e.jsxs("div", {
                          className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🌳" }), "គម្របព្រៃឈើ"] }),
                            e.jsxs("select", {
                              value: labForest,
                              onChange: e => { J("click"); setLabForest(parseInt(e.target.value)); },
                              className: "w-full p-2 text-xs bg-white rounded-xl border border-slate-200 cursor-pointer font-bold",
                              children: [
                                e.jsx("option", { value: 3, children: "ព្រៃឈើសម្បូរបែប ៨០% (ល្អបំផុត) ✓" }),
                                e.jsx("option", { value: 2, children: "ព្រៃឈើមធ្យម ៤០%" }),
                                e.jsx("option", { value: 1, children: "បាត់បង់ព្រៃឈើធ្ងន់ធ្ងរ ១០%" })
                              ]
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🏭" }), "ការបញ្ចេញផ្សែងពុល"] }),
                            e.jsxs("select", {
                              value: labEmissions,
                              onChange: e => { J("click"); setLabEmissions(parseInt(e.target.value)); },
                              className: "w-full p-2 text-xs bg-white rounded-xl border border-slate-200 cursor-pointer font-bold",
                              children: [
                                e.jsx("option", { value: 1, children: "ថាមពលស្អាត គ្មានផ្សែង (ល្អ) ✓" }),
                                e.jsx("option", { value: 2, children: "ផ្សែងពុលកម្រិតមធ្យម" }),
                                e.jsx("option", { value: 3, children: "ផ្សែងពុលរោងចក្រខ្លាំង (អាសន្ន!)" })
                              ]
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "♻️" }), "ការគ្រប់គ្រងសំរាម 3R"] }),
                            e.jsxs("select", {
                              value: labRecycle,
                              onChange: e => { J("click"); setLabRecycle(parseInt(e.target.value)); },
                              className: "w-full p-2 text-xs bg-white rounded-xl border border-slate-200 cursor-pointer font-bold",
                              children: [
                                e.jsx("option", { value: 3, children: "កែច្នៃ 3R ពេញលេញ ✓" }),
                                e.jsx("option", { value: 2, children: "កែច្នៃមធ្យម" }),
                                e.jsx("option", { value: 1, children: "បោះចោលសំរាមពាសវាល" })
                              ]
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🐅" }), "ច្បាប់អភិរក្សសត្វព្រៃ"] }),
                            e.jsxs("label", {
                              className: "flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-2 font-bold",
                              children: [
                                e.jsx("input", { type: "checkbox", checked: labProtect, onChange: () => { J("click"); setLabProtect(!labProtect); } }),
                                e.jsx("span", { children: "ការពារតំបន់ជម្រកសត្វព្រៃ" })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // Output Dashboard
                    e.jsxs("div", {
                      className: `p-6 rounded-3xl border ${labStatus.color} space-y-4`,
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between flex-wrap gap-3",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-3",
                              children: [
                                e.jsx("span", { className: "text-3xl", children: "🌍" }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("h3", { className: "font-bold text-slate-900 text-sm font-moul", children: "ស្ថានភាពបរិស្ថានផែនដី" }),
                                    e.jsx("p", { className: "text-xs font-bold", children: labStatus.health })
                                  ]
                                })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "text-right",
                              children: [
                                e.jsxs("div", { className: "text-2xl font-black font-moul", children: [labStatus.score, " %"] }),
                                e.jsx("span", { className: "text-[10px] font-bold text-slate-500", children: "សន្ទស្សន៍សុខភាពបរិស្ថាន" })
                              ]
                            })
                          ]
                        }),

                        e.jsx("div", {
                          className: "w-full bg-slate-200 h-3 rounded-full overflow-hidden",
                          children: e.jsx("div", {
                            className: `h-full transition-all duration-500 ${labStatus.score >= 80 ? "bg-emerald-500" : labStatus.score >= 50 ? "bg-amber-500" : "bg-rose-500"}`,
                            style: { width: `${labStatus.score}%` }
                          })
                        }),

                        e.jsxs("div", {
                          className: "grid grid-cols-2 gap-2 text-xs font-bold pt-2",
                          children: [
                            e.jsxs("div", { className: "bg-white/80 p-3 rounded-2xl border border-slate-200", children: [e.jsx("span", { className: "text-slate-500", children: "សន្ទស្សន៍ខ្យល់ AQI ៖ " }), e.jsx("span", { className: "text-sky-800", children: labStatus.aqi })] }),
                            e.jsxs("div", { className: "bg-white/80 p-3 rounded-2xl border border-slate-200", children: [e.jsx("span", { className: "text-slate-500", children: "ការប្រែប្រួលសីតុណ្ហភាព ៖ " }), e.jsx("span", { className: "text-rose-800", children: labStatus.tempIndex })] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 7: Matching and Sequence Games
            n === "tab-match" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                // Game 1
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-3 flex items-center justify-between",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full uppercase", children: "ល្បែងទី ១" }),
                            e.jsx("h3", { className: "text-base sm:text-lg font-bold text-slate-900 mt-1 font-moul", children: "រៀបលំដាប់ ៤ ថ្នាក់នៃច្រវាក់អាហារក្នុងធម្មជាតិ" })
                          ]
                        }),
                        e.jsx("span", { className: "text-xl", children: "🔄" })
                      ]
                    }),
                    e.jsx("p", { className: "text-xs text-slate-600", children: "ចុចប៊ូតុង ↑ ឬ ↓ ដើម្បីរៀបលំដាប់ច្រវាក់អាហារឱ្យបានត្រឹមត្រូវ ៖" }),

                    e.jsx("div", {
                      className: "space-y-2",
                      children: seqSteps.map((stepNum, idx) => {
                        const stepLabels = {
                          1: "១. ផលិតករ ៖ រុក្ខជាតិបៃតងផលិតអាហារតាមរស្មីសំយោគ 🌱",
                          2: "២. អ្នកប្រើប្រាស់ថ្នាក់ទី១ ៖ សត្វស៊ីរុក្ខជាតិ (គោ ក្របី កណ្តូប) 🐇",
                          3: "៣. អ្នកប្រើប្រាស់ថ្នាក់បន្ត ៖ សត្វស៊ីសាច់ (កង្កែប ពស់ ឥន្ទ្រី) 🦅",
                          4: "៤. អ្នករំលាយធាតុ ៖ បាក់តេរីនិងផ្សិតរំលាយសាកសពជាជី 🍄"
                        };
                        return e.jsxs("div", {
                          key: stepNum,
                          className: "flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-6 h-6 rounded-lg bg-sky-500 text-slate-950 flex items-center justify-center font-black", children: idx + 1 }),
                                e.jsx("span", { children: stepLabels[stepNum] })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "flex gap-1",
                              children: [
                                e.jsx("button", {
                                  onClick: () => idx > 0 && moveSeq(idx, idx - 1),
                                  disabled: idx === 0,
                                  className: "px-2 py-1 bg-white hover:bg-slate-200 disabled:opacity-30 rounded-lg border border-slate-200 cursor-pointer",
                                  children: "↑"
                                }),
                                e.jsx("button", {
                                  onClick: () => idx < seqSteps.length - 1 && moveSeq(idx, idx + 1),
                                  disabled: idx === seqSteps.length - 1,
                                  className: "px-2 py-1 bg-white hover:bg-slate-200 disabled:opacity-30 rounded-lg border border-slate-200 cursor-pointer",
                                  children: "↓"
                                })
                              ]
                            })
                          ]
                        });
                      })
                    }),

                    e.jsxs("div", {
                      className: "flex items-center gap-3 pt-2",
                      children: [
                        e.jsx("button", {
                          onClick: checkSequence,
                          className: "px-5 py-2 bg-gradient-to-r from-sky-600 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer",
                          children: "ផ្ទៀងផ្ទាត់ចម្លើយ ✓"
                        }),
                        seqResult && e.jsx("span", {
                          className: `text-xs font-bold ${seqResult.success ? "text-emerald-700" : "text-rose-700"}`,
                          children: seqResult.msg
                        })
                      ]
                    })
                  ]
                }),

                // Game 2
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-3 flex items-center justify-between",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase", children: "ល្បែងទី ២" }),
                            e.jsx("h3", { className: "text-base sm:text-lg font-bold text-slate-900 mt-1 font-moul", children: "ផ្គូផ្គងកត្តាបរិស្ថាន និងវិធានការការពារ" })
                          ]
                        }),
                        e.jsx("span", { className: "text-xl", children: "🧩" })
                      ]
                    }),

                    e.jsx("div", {
                      className: "space-y-3",
                      children: [
                        { id: 1, term: "១. ព្រៃឈើ" },
                        { id: 2, term: "២. គោលការណ៍ 3R" },
                        { id: 3, term: "៣. ឧស្ម័នផ្ទះកញ្ចក់" },
                        { id: 4, term: "៤. កត្តាជីវៈ" },
                        { id: 5, term: "៥. ថាមពលស្អាត" }
                      ].map(item => e.jsxs("div", {
                        key: item.id,
                        className: "p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs",
                        children: [
                          e.jsx("span", { className: "font-bold text-slate-800", children: item.term }),
                          e.jsxs("select", {
                            value: matchAns[item.id],
                            onChange: e => {
                              J("click");
                              const val = e.target.value;
                              setMatchAns(prev => ({ ...prev, [item.id]: val }));
                              setMatchResult(null);
                            },
                            className: "p-2 bg-white rounded-xl border border-slate-200 text-xs font-bold cursor-pointer max-w-sm",
                            children: [
                              e.jsx("option", { value: "", children: "-- ជ្រើសរើសចម្លើយផ្គូផ្គង --" }),
                              e.jsx("option", { value: "a", children: "កាត់បន្ថយ ប្រើឡើងវិញ និងកែច្នៃ" }),
                              e.jsx("option", { value: "b", children: "មនុស្ស សត្វ រុក្ខជាតិ និងបាក់តេរី" }),
                              e.jsx("option", { value: "c", children: "សួតនៃផែនដី ស្រូបកាបូនិច បញ្ចេញអុកស៊ីសែន" }),
                              e.jsx("option", { value: "d", children: "ថាមពលពន្លឺព្រះអាទិត្យ និងថាមពលខ្យល់" }),
                              e.jsx("option", { value: "e", children: "កើនឡើងបណ្តាលឱ្យឡើងកម្ដៅភពផែនដី" })
                            ]
                          })
                        ]
                      }))
                    }),

                    e.jsxs("div", {
                      className: "flex items-center gap-3 pt-2",
                      children: [
                        e.jsx("button", {
                          onClick: checkMatch,
                          className: "px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer",
                          children: "ផ្ទៀងផ្ទាត់ការផ្គូផ្គង ✓"
                        }),
                        matchResult && e.jsx("span", {
                          className: `text-xs font-bold ${matchResult.success ? "text-emerald-700" : "text-rose-700"}`,
                          children: matchResult.msg
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 8: 40 QCM Quiz
            n === "tab-quiz" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "កម្រង ៤០ សំណួរ QCM វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "មេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ (៤០ សំណួរ)" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "ជ្រើសរើសចម្លើយត្រឹមត្រូវតែមួយគត់សម្រាប់សំណួរនីមួយៗ ៖" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2",
                          children: [
                            e.jsx("span", { children: "🏆" }),
                            e.jsxs("span", { children: ["ពិន្ទុ ៖ ", quizStats.correct, " / ", Zi4.length] })
                          ]
                        })
                      ]
                    }),

                    // Question navigator bubbles
                    e.jsx("div", {
                      className: "flex gap-1.5 flex-wrap overflow-x-auto py-2",
                      children: Zi4.map((_, qIdx) => {
                        const isAns = q[qIdx] !== undefined;
                        const isCorr = isAns && Zi4[qIdx].options[q[qIdx]].isCorrect;
                        const isCur = Y === qIdx;
                        return e.jsx("button", {
                          onClick: () => { U(qIdx); re(q[qIdx] !== undefined); J("click"); },
                          className: `w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer ${isCur ? "ring-2 ring-sky-500 scale-110 font-black shadow-md" : ""} ${isAns ? isCorr ? "bg-emerald-600 text-white" : "bg-rose-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
                          children: qIdx + 1
                        }, qIdx);
                      })
                    }),

                    // Question Card
                    e.jsxs("div", {
                      className: "bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-5",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between",
                          children: [
                            e.jsxs("span", { className: "text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-xl", children: ["សំណួរទី ", Y + 1, " នៃ ", Zi4.length] }),
                            Zi4[Y].hint && e.jsxs("span", { className: "text-[11px] text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 flex items-center gap-1", children: [e.jsx("span", { children: "💡" }), Zi4[Y].hint] })
                          ]
                        }),
                        e.jsx("h3", {
                          className: "text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-moul",
                          children: Zi4[Y].question
                        }),

                        // Options grid
                        e.jsx("div", {
                          className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2",
                          children: Zi4[Y].options.map((opt, optIdx) => {
                            const isChosen = q[Y] === optIdx;
                            const isAnswered = q[Y] !== undefined;
                            let btnStyle = "p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-start gap-3 ";
                            if (isAnswered) {
                              if (opt.isCorrect) {
                                btnStyle += "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-xs";
                              } else if (isChosen) {
                                btnStyle += "bg-rose-100 border-rose-400 text-rose-950";
                              } else {
                                btnStyle += "bg-white/60 border-slate-200 text-slate-400 opacity-60";
                              }
                            } else {
                              btnStyle += "bg-white hover:bg-sky-50 border-slate-200 hover:border-sky-300 text-slate-800 hover:shadow-xs";
                            }

                            const letters = ["ក", "ខ", "គ", "ឃ"];
                            return e.jsxs("button", {
                              onClick: () => handleAnswer(Y, optIdx),
                              disabled: isAnswered,
                              className: btnStyle,
                              children: [
                                e.jsx("span", {
                                  className: `w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${isAnswered ? opt.isCorrect ? "bg-emerald-600 text-white" : isChosen ? "bg-rose-600 text-white" : "bg-slate-200 text-slate-600" : "bg-slate-100 text-slate-700"}`,
                                  children: letters[optIdx]
                                }),
                                e.jsx("span", { className: "leading-relaxed pt-0.5", children: opt.text })
                              ]
                            }, optIdx);
                          })
                        }),

                        // Explanation
                        q[Y] !== undefined && e.jsxs("div", {
                          className: `p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed animate-in fade-in duration-200 ${Zi4[Y].options[q[Y]].isCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-amber-50 border-amber-300 text-amber-950"}`,
                          children: [
                            e.jsxs("div", {
                              className: "font-bold flex items-center gap-1.5 mb-1",
                              children: [
                                e.jsx("span", { children: Zi4[Y].options[q[Y]].isCorrect ? "✅ ចម្លើយត្រឹមត្រូវ!" : "❌ មិនទាន់ត្រឹមត្រូវទេ!" }),
                                e.jsx("span", { className: "text-slate-600 font-normal", children: "• ពន្យល់ ៖" })
                              ]
                            }),
                            e.jsx("p", { children: Zi4[Y].options.find(o => o.isCorrect).exp })
                          ]
                        }),

                        // Bottom nav
                        e.jsxs("div", {
                          className: "flex items-center justify-between pt-4 border-t border-slate-200",
                          children: [
                            e.jsxs("button", {
                              onClick: prevQuestion,
                              disabled: Y === 0,
                              className: "px-4 py-2 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1",
                              children: [e.jsx("span", { children: "←" }), e.jsx("span", { children: "សំណួរមុន" })]
                            }),
                            e.jsxs("span", {
                              className: "text-xs font-bold text-slate-500",
                              children: ["ឆ្លើយបាន ៖ ", quizStats.answered, " / ", Zi4.length]
                            }),
                            Y < Zi4.length - 1 ? e.jsxs("button", {
                              onClick: nextQuestion,
                              className: "px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1",
                              children: [e.jsx("span", { children: "សំណួរបន្ទាប់" }), e.jsx("span", { children: "→" })]
                            }) : e.jsx("button", {
                              onClick: () => {
                                se();
                                J("correct");
                                showNotif("អបអរសាទរ!", `អ្នកបានបញ្ចប់ ៤០ សំណួរ QCM មេរៀនទី ៤ ដោយទទួលបានពិន្ទុ ${quizStats.correct} / ៤០!`);
                              },
                              className: "px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer animate-pulse",
                              children: "ប្រគល់វិញ្ញាសា (Submit) 🎉"
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
      ]
    })
  });
};