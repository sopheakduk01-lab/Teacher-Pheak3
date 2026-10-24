var Rz12 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);
  const [activeMatterState, setActiveMatterState] = y.useState("solid");
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

  const quizQuestions = [
    {"id":1,"question":"សំណួរទី ១ ៖ តើអ្វីទៅដែលហៅថា «រូបធាតុ»?","options":[{"text":"ជារបស់ទាំងឡាយដែលមានម៉ាស មានមាឌ និងទម្ងន់តាំងក្នុងលំហ","isCorrect":true},{"text":"ជាពន្លឺព្រះអាទិត្យតែម្យ៉ាងគត់","isCorrect":false},{"text":"ជាចំហាយទឹកដែលមិលមិនឃើញ","isCorrect":false},{"text":"ជាអ្វីដែលគ្មានទម្ងន់","isCorrect":false}],"explanation":"រូបធាតុ គឺជារបស់ទាំងឡាយដែលមានម៉ាស មានមាឌ និងទម្ងន់តាំងក្នុងលំហ។"},
    {"id":2,"question":"សំណួរទី ២ ៖ តើវត្ថុទាំងឡាយផ្សំឡើងពីអ្វី?","options":[{"text":"ផ្សំឡើងពីភាគល្អិតតូចៗ ហៅថា «ធូលី»","isCorrect":true},{"text":"ផ្សំឡើងពីទឹកតែមួយមុខ","isCorrect":false},{"text":"ផ្សំឡើងពីខ្យល់","isCorrect":false},{"text":"ផ្សំឡើងពីមាស","isCorrect":false}],"explanation":"រូបធាតុទាំងអស់ផ្សំឡើងពីភាគល្អិតតូចៗ ហៅថា «ធូលី» (យោងតាមមេរៀន)។"},
    {"id":3,"question":"សំណួរទី ៣ ៖ តើគេអាចសម្គាល់រូបធាតុដោយសារអ្វីខ្លះ?","options":[{"text":"ភាពរូប ពណ៌ រាង ទំហំ រសជាតិ ក្លិន","isCorrect":true},{"text":"មានតែទំហំប៉ុណ្ណោះ","isCorrect":false},{"text":"មានតែពណ៌ស","isCorrect":false},{"text":"មានតែរសជាតិផ្អែម","isCorrect":false}],"explanation":"គេអាចសំគាល់រូបធាតុដោយសារភាពរូប (រឹង រាវ និងឧស្ម័ន) ពណ៌ រាង ទំហំ រសជាតិ ក្លិន...។"},
    {"id":4,"question":"សំណួរទី ៤ ៖ តើភាពរូបនៃរូបធាតុមានប៉ុន្មានយ៉ាង?","options":[{"text":"៣ យ៉ាង (រឹង រាវ និងឧស្ម័ន)","isCorrect":true},{"text":"២ យ៉ាង","isCorrect":false},{"text":"៤ យ៉ាង","isCorrect":false},{"text":"៥ យ៉ាង","isCorrect":false}],"explanation":"ភាពរូបនៃរូបធាតុមាន ៣ គឺ រឹង រាវ និងឧស្ម័ន។"},
    {"id":5,"question":"សំណួរទី ៥ ៖ តើការប្រែប្រួលនៃរូបធាតុចែកចេញជាប៉ុន្មានប្រភេទ?","options":[{"text":"២ ប្រភេទ (ការប្រែប្រួលលក្ខណៈរូប និង លក្ខណៈគីមី)","isCorrect":true},{"text":"៣ ប្រភេទ","isCorrect":false},{"text":"៤ ប្រភេទ","isCorrect":false},{"text":"គ្មានការប្រែប្រួលទេ","isCorrect":false}],"explanation":"ការប្រែប្រួលចែកជាពីរ គឺ៖ ការប្រែប្រួលលក្ខណៈរូប និង ការប្រែប្រួលលក្ខណៈគីមី។"},
    {"id":6,"question":"សំណួរទី ៦ ៖ តើការប្រែប្រួលលក្ខណៈរូបគឺជាអ្វី?","options":[{"text":"ការប្រែប្រួលភាពរូបតែនៅរក្សាធាតុដើមដដែល","isCorrect":true},{"text":"ការប្រែប្រួលដែលបាត់បង់ធាតុដើមទាំងស្រុង","isCorrect":false},{"text":"ការប្រែប្រួលដែលបង្កើតសារធាតុថ្មី","isCorrect":false},{"text":"ការប្រែប្រួលដែលមិនអាចត្រឡប់មកដើមវិញបាន","isCorrect":false}],"explanation":"នៅពេលរូបធាតុមួយមានការប្រែប្រួលភាពរូប ហើយនៅតែរក្សាធាតុផ្សំ ឬធាតុដើមរបស់វាដដែល គេហៅថា ការប្រែប្រួលលក្ខណៈរូប។"},
    {"id":7,"question":"សំណួរទី ៧ ៖ តើមួយណាជាឧទាហរណ៍នៃការប្រែប្រួលលក្ខណៈរូប?","options":[{"text":"ដុំទឹកកករលាយជាទឹក","isCorrect":true},{"text":"ការដុតក្រដាសឱ្យក្លាយជាផេះ","isCorrect":false},{"text":"ដែកគោលច្រែះ","isCorrect":false},{"text":"សាច់ត្រីស្ងោរឆ្អិន","isCorrect":false}],"explanation":"ដុំទឹកកករលាយជាទឹក គឺជាការប្រែប្រួលលក្ខណៈរូប ព្រោះវានៅតែជាទឹកដដែល។"},
    {"id":8,"question":"សំណួរទី ៨ ៖ តើល្បាយគឺជាអ្វី?","options":[{"text":"ការលាយរូបធាតុពីរ ឬច្រើនបញ្ចូលគ្នា","isCorrect":true},{"text":"ការបំបែករូបធាតុឱ្យតូចបំផុត","isCorrect":false},{"text":"ការដុតរូបធាតុឱ្យរលាយ","isCorrect":false},{"text":"ការបង្កកទឹកឱ្យទៅជាទឹកកក","isCorrect":false}],"explanation":"ល្បាយ គឺជាការលាយរូបធាតុពីរ ឬច្រើនបញ្ចូលគ្នា។"},
    {"id":9,"question":"សំណួរទី ៩ ៖ តើល្បាយមានប៉ុន្មានប្រភេទ?","options":[{"text":"២ ប្រភេទ (ស្មើសាច់ និង មិនស្មើសាច់)","isCorrect":true},{"text":"៣ ប្រភេទ","isCorrect":false},{"text":"៤ ប្រភេទ","isCorrect":false},{"text":"៥ ប្រភេទ","isCorrect":false}],"explanation":"ល្បាយមាន ២ ប្រភេទ គឺ ល្បាយស្មើសាច់ និងល្បាយមិនស្មើសាច់។"},
    {"id":10,"question":"សំណួរទី ១០ ៖ តើល្បាយស្មើសាច់គឺជាអ្វី?","options":[{"text":"ជាល្បាយដែលមិនអាចមើលឃើញធាតុបង្ករបស់វាបាន","isCorrect":true},{"text":"ជាល្បាយដែលមើលឃើញធាតុបង្កច្បាស់ៗ","isCorrect":false},{"text":"ជាល្បាយដែលមិនចូលគ្នា","isCorrect":false},{"text":"ជាល្បាយដែលមានពណ៌ខ្មៅ","isCorrect":false}],"explanation":"ល្បាយស្មើសាច់៖ ជាល្បាយដែលមិនអាចមើលឃើញធាតុបង្ក ឬធាតុផ្សំរបស់វាបាន (ដូចជា ល្បាយទឹកនិងស្ករ)។"},
    {"id":11,"question":"សំណួរទី ១១ ៖ តើមួយណាជាឧទាហរណ៍នៃល្បាយស្មើសាច់?","options":[{"text":"ល្បាយទឹកនិងអំបិល","isCorrect":true},{"text":"ល្បាយបាយនិងល្ង","isCorrect":false},{"text":"ល្បាយទឹកនិងខ្សាច់","isCorrect":false},{"text":"ល្បាយថ្មនិងដី","isCorrect":false}],"explanation":"ទឹកនិងអំបិលរលាយចូលគ្នាស្មើសាច់ មើលមិនឃើញគ្រាប់អំបិលឡើយ។"},
    {"id":12,"question":"សំណួរទី ១២ ៖ តើការប្រែប្រួលលក្ខណៈគីមីគឺជាអ្វី?","options":[{"text":"ការប្រែប្រួលដែលបាត់បង់លក្ខណៈដើមទាំងស្រុង","isCorrect":true},{"text":"ការប្រែប្រួលតែរូបរាងខាងក្រៅ","isCorrect":false},{"text":"ការប្រែប្រួលដែលរក្សាធាតុដើមដដែល","isCorrect":false},{"text":"ការប្រែប្រួលភាពរូបពីរឹងទៅរាវ","isCorrect":false}],"explanation":"នៅពេលរូបធាតុទាំងឡាយប្រែប្រួលលក្ខណៈដើមរបស់វាទាំងស្រុង ដូចជា ទ្រង់ទ្រាយ ពណ៌ ក្លិន រសជាតិ... គេហៅថា ការប្រែប្រួលលក្ខណៈគីមី។"},
    {"id":13,"question":"សំណួរទី ១៣ ៖ តើមួយណាជាឧទាហរណ៍នៃការប្រែប្រួលលក្ខណៈគីមី?","options":[{"text":"ការដុតក្រដាសក្លាយជាផេះ","isCorrect":true},{"text":"ការបំបែកកែវឱ្យបែក","isCorrect":false},{"text":"ការហួតទឹក","isCorrect":false},{"text":"ការរលាយទឹកកក","isCorrect":false}],"explanation":"ផេះមិនអាចត្រឡប់ទៅជាក្រដាសវិញបានទេ ហើយវាមានលក្ខណៈខុសពីក្រដាសទាំងស្រុង។"},
    {"id":14,"question":"សំណួរទី ១៤ ៖ តើកត្តាអ្វីខ្លះដែលធ្វើឱ្យមានការប្រែប្រួលរូបធាតុ?","options":[{"text":"កម្ដៅ បាក់តេរី និងសារធាតុផ្សេងៗ","isCorrect":true},{"text":"មានតែពន្លឺព្រះច័ន្ទ","isCorrect":false},{"text":"មានតែសំឡេង","isCorrect":false},{"text":"មានតែការសម្លឹងមើល","isCorrect":false}],"explanation":"កត្តាដែលធ្វើឱ្យប្រែប្រួលគឺ៖ កម្ដៅ, បាក់តេរី, និងសារធាតុផ្សេងៗ (ខ្យល់ ទឹកមាត់ ទឹកភ្លៀង...)។"},
    {"id":15,"question":"សំណួរទី ១៥ ៖ តើកម្ដៅធ្វើឱ្យអង្ករប្រែប្រួលទៅជាអ្វី?","options":[{"text":"បាយ ឬ បបរ","isCorrect":true},{"text":"ដែកគោល","isCorrect":false},{"text":"ទឹកសុទ្ធ","isCorrect":false},{"text":"មាស","isCorrect":false}],"explanation":"អង្ករដាំ (ប្រើកម្ដៅ) ក្លាយជាបាយ ឬបបរ ដែលជាការប្រែប្រួលលក្ខណៈគីមី។"},
    {"id":16,"question":"សំណួរទី ១៦ ៖ តើបាក់តេរីធ្វើឱ្យបាយដំណើបលាយមេក្លាយទៅជាអ្វី?","options":[{"text":"ត្រប៉ែ","isCorrect":true},{"text":"ទឹកកក","isCorrect":false},{"text":"អំបិល","isCorrect":false},{"text":"ដីខ្សាច់","isCorrect":false}],"explanation":"បាយដំណើបលាយមេ ហើយគ្របទុក ២ ទៅ ៣ ថ្ងៃ ក្លាយជាត្រប៉ែ ដោយសារអំពើរបស់បាក់តេរី (មេដំបែ)។"},
    {"id":17,"question":"សំណួរទី ១៧ ៖ តើខ្យល់ធ្វើឱ្យដែកគោលប្រែប្រួលដូចម្ដេច?","options":[{"text":"ក្លាយជាដែកគោលច្រែះ","isCorrect":true},{"text":"ក្លាយជាមាស","isCorrect":false},{"text":"រលាយបាត់ទៅ","isCorrect":false},{"text":"រឹងជាងមុន","isCorrect":false}],"explanation":"ខ្យល់ (អុកស៊ីសែន) ធ្វើឱ្យដែកគោលក្លាយជាច្រែះ ដែលជាការប្រែប្រួលគីមី។"},
    {"id":18,"question":"សំណួរទី ១៨ ៖ តើទឹកមាត់ធ្វើឱ្យស្នូលនំប៉័ងប្រែប្រួលទៅជាអ្វី?","options":[{"text":"ជាតិស្ករ (គ្លុយកូស)","isCorrect":true},{"text":"ជាតិអំបិល","isCorrect":false},{"text":"ជាតិអាស៊ីត","isCorrect":false},{"text":"ជាតិខ្លាញ់","isCorrect":false}],"explanation":"ទឹកមាត់មានអង់ស៊ីមដែលបំប្លែងម្សៅក្នុងនំប៉័ងឱ្យទៅជាជាតិស្ករ។"},
    {"id":19,"question":"សំណួរទី ១៩ ៖ តើមួយណាជាឧទាហរណ៍នៃល្បាយមិនស្មើសាច់?","options":[{"text":"ល្បាយបាយនិងល្ង","isCorrect":true},{"text":"ល្បាយទឹកនិងស្ករ","isCorrect":false},{"text":"ខ្យល់បរិសុទ្ធ","isCorrect":false},{"text":"ទឹកសមុទ្រ","isCorrect":false}],"explanation":"ល្បាយបាយនិងល្ង យើងអាចមើលឃើញគ្រាប់ល្ងដាច់ដោយឡែកពីគ្រាប់បាយ។"},
    {"id":20,"question":"សំណួរទី ២០ ៖ តើទឹកភ្លៀងធ្វើឱ្យប្រាសាទថ្មមានការប្រែប្រួលដូចម្ដេច?","options":[{"text":"ធ្វើឱ្យថ្មសឹកសេចរិល ឬពុកផុយ","isCorrect":true},{"text":"ធ្វើឱ្យប្រាសាទថ្មីជាងមុន","isCorrect":false},{"text":"ធ្វើឱ្យប្រាសាទក្លាយជាដែក","isCorrect":false},{"text":"គ្មានផលប៉ះពាល់អ្វីទេ","isCorrect":false}],"explanation":"ទឹកភ្លៀង (ជាពិសេសភ្លៀងអាស៊ីត) ធ្វើឱ្យប្រាសាទ ឬថ្មសឹកសេចរិល ឬពុកផុយ។"}
  ];

  const score = Object.keys(userAnswers).reduce((acc, qIdx) => {
    const q = quizQuestions[qIdx];
    if (q && q.options[userAnswers[qIdx]] && q.options[userAnswers[qIdx]].isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

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
    className: "fixed inset-0 z-[100] overflow-y-auto bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300 font-['Battambang']",
    children: e.jsxs("div", {
      onClick: (ev) => ev.stopPropagation(),
      className: "relative w-full max-w-5xl h-full sm:h-[90vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300",
      children: [
            e.jsxs("div", {
              className: "bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-4 sm:p-6 text-white shrink-0 relative overflow-hidden",
              children: [
                e.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" }),
                e.jsxs("div", {
                  className: "relative flex items-center justify-between",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-4",
                      children: [
                        e.jsx("div", { className: "w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-lg border border-white/30", children: "🔬" }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("h2", { className: "text-lg sm:text-2xl font-bold font-moul leading-tight", children: "មេរៀនទី ១២ ៖ ការប្រែប្រួលរូបធាតុ" }),
                            e.jsx("p", { className: "text-blue-100 text-[10px] sm:text-xs font-bold opacity-90", children: "ជំពូកទី ៤ • វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" })
                          ]
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        e.jsx("button", {
                          onClick: () => setSoundEnabled(!soundEnabled),
                          className: `w-10 h-10 rounded-xl flex items-center justify-center transition-all ${soundEnabled ? "bg-white/20 text-white" : "bg-slate-800/40 text-slate-300"}`,
                          children: e.jsx("i", { className: `fa-solid ${soundEnabled ? "fa-volume-high" : "fa-volume-xmark"}` })
                        }),
                        e.jsx("button", { onClick: t, className: "w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer", children: e.jsx("i", { className: "fa-solid fa-xmark" }) })
                      ]
                    })
                  ]
                }),
                e.jsx("div", {
                  className: "flex items-center gap-1 mt-6 overflow-x-auto no-scrollbar pb-1",
                  children: [{ id: "tab-hero", icon: "🏠", label: "ទិដ្ឋភាពទូទៅ" }, { id: "tab-lesson", icon: "📖", label: "ខ្លឹមសារមេរៀន" }, { id: "tab-states", icon: "🧊", label: "ភាពរូបធាតុ" }, { id: "tab-changes", icon: "🔄", label: "ការប្រែប្រួល" }, { id: "tab-quiz", icon: "📝", label: "តេស្តសមត្ថភាព" }].map(tab => e.jsxs("button", {
                    key: tab.id,
                    onClick: () => i(tab.id),
                    className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${n === tab.id ? "bg-white text-blue-800 shadow-md" : "text-white hover:bg-white/10"}`,
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
                              e.jsxs("button", { onClick: () => i("tab-lesson"), className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center gap-2", children: [e.jsx("i", { className: "fa-solid fa-book-open" }), " ចាប់ផ្ដើមរៀន"] }),
                              e.jsxs("button", { onClick: () => toggleSpeech("រូបធាតុ គឺជារបស់ទាំងឡាយដែលមានម៉ាស មានមាឌ និងទម្ងន់តាំងក្នុងលំហ។"), className: "px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2", children: [e.jsx("i", { className: `fa-solid ${isSpeaking ? "fa-stop" : "fa-play"}` }), isSpeaking ? " បញ្ឈប់អាន" : " ស្តាប់ការពន្យល់"] })
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
                    children: [{ icon: "🧊", title: "រឹង (Solid)", desc: "ដូចជា ទឹកកក ថ្ម" }, { icon: "💧", title: "រាវ (Liquid)", desc: "ដូចជា ទឹក ប្រេង" }, { icon: "☁️", title: "ឧស្ម័ន (Gas)", desc: "ដូចជា ខ្យល់" }].map((item, idx) => e.jsxs("div", {
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
                className: "max-w-3xl mx-auto space-y-10",
                children: [
                  e.jsxs("section", {
                    className: "space-y-4",
                    children: [
                      e.jsxs("div", { className: "flex items-center gap-3 border-b-2 border-blue-500 pb-2", children: [e.jsx("span", { className: "text-2xl", children: "១." }), e.jsx("h3", { className: "text-xl font-bold text-slate-900 font-moul", children: "រូបធាតុ" })] }),
                      e.jsxs("div", {
                        className: "bg-blue-50 p-6 rounded-3xl border border-blue-100 leading-loose text-slate-800 space-y-4",
                        children: [
                          e.jsx("p", { children: "វត្ថុទាំងឡាយទោះជាភវៈមានជីវិត ឬគ្មានជីវិតក្តី មើលឃើញឬមិនអាចមើលឃើញក្តី ស្ទាបកាន់បាន ឬមិនអាចស្ទាបឬកាន់បានក្តី សុទ្ធតែផ្សំឡើងពីរូបធាតុទាំងអស់។" }),
                          e.jsxs("p", { className: "font-bold text-blue-800", children: [e.jsx("span", { className: "bg-blue-200 px-2 py-1 rounded-lg mr-2", children: "💡" }), "រូបធាតុទាំងអស់ផ្សំឡើងពីភាគល្អិតតូចៗ ហៅថា «ធូលី»។"] }),
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
                        children: ["ភាពរូប (រឹង រាវ ឧស្ម័ន)", "ពណ៌", "រាង", "ទំហំ", "រសជាតិ", "ក្លិន"].map((l, i) => e.jsx("div", { className: "p-4 bg-white rounded-2xl border border-slate-200 text-center font-bold text-slate-700 text-sm", children: l }, i))
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
                            className: "p-6 bg-emerald-50 rounded-3xl border border-emerald-100",
                            children: [
                              e.jsx("h4", { className: "font-bold text-emerald-800 mb-2 font-moul", children: "ក. ការប្រែប្រួលលក្ខណៈរូប" }),
                              e.jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: "ការប្រែប្រួលភាពរូប (រឹង រាវ ឧស្ម័ន) ហើយនៅតែរក្សាធាតុផ្សំ ឬធាតុដើមរបស់វាដដែល។" }),
                              e.jsx("div", { className: "mt-3 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-3 py-2 rounded-xl", children: "ឧទាហរណ៍៖ ដុំទឹកកករលាយជាទឹក" })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "p-6 bg-rose-50 rounded-3xl border border-rose-100",
                            children: [
                              e.jsx("h4", { className: "font-bold text-rose-800 mb-2 font-moul", children: "ខ. ការប្រែប្រួលលក្ខណៈគីមី" }),
                              e.jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: "ការប្រែប្រួលលក្ខណៈដើមរបស់វាទាំងស្រុង ដូចជា ទ្រង់ទ្រាយ ពណ៌ ក្លិន រសជាតិ...។" }),
                              e.jsx("div", { className: "mt-3 text-[10px] font-bold text-rose-700 bg-rose-100 px-3 py-2 rounded-xl", children: "ឧទាហរណ៍៖ ការដុតក្រដាសក្លាយជាផេះ" })
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
                    className: "flex flex-wrap justify-center gap-4",
                    children: Object.keys(matterStates).map(key => e.jsxs("button", {
                      key: key,
                      onClick: () => setActiveMatterState(key),
                      className: `flex flex-col items-center p-6 rounded-3xl transition-all border-2 w-32 sm:w-40 ${activeMatterState === key ? "bg-white border-blue-500 shadow-xl scale-105" : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200"}`,
                      children: [
                        e.jsx("span", { className: "text-4xl mb-2", children: matterStates[key].icon }),
                        e.jsx("span", { className: "font-bold text-xs text-slate-900", children: matterStates[key].name })
                      ]
                    }))
                  }),
                  e.jsxs("div", {
                    key: activeMatterState,
                    className: `p-8 rounded-3xl bg-gradient-to-br ${matterStates[activeMatterState].color} text-white shadow-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-300`,
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-4",
                        children: [
                          e.jsx("div", { className: "text-6xl", children: matterStates[activeMatterState].icon }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("h3", { className: "text-3xl font-bold font-moul", children: matterStates[activeMatterState].name }),
                              e.jsx("p", { className: "text-blue-50 text-sm opacity-90", children: "ការរៀបរាប់ពីភាគល្អិតនៃរូបធាតុ" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
                        children: [
                          e.jsxs("div", {
                            className: "bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20",
                            children: [
                              e.jsx("h5", { className: "font-black text-xs uppercase tracking-widest mb-2 opacity-70", children: "លក្ខណៈពិសេស" }),
                              e.jsx("p", { className: "text-lg leading-relaxed", children: matterStates[activeMatterState].desc })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20",
                            children: [
                              e.jsx("h5", { className: "font-black text-xs uppercase tracking-widest mb-2 opacity-70", children: "ឧទាហរណ៍" }),
                              e.jsx("p", { className: "text-lg leading-relaxed", children: matterStates[activeMatterState].examples })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }) : n === "tab-changes" ? e.jsxs("div", {
                className: "max-w-4xl mx-auto space-y-12",
                children: [
                  e.jsxs("div", {
                    className: "text-center space-y-2",
                    children: [
                      e.jsx("h3", { className: "text-2xl font-bold font-moul text-slate-900", children: "កត្តាដែលធ្វើឱ្យប្រែប្រួល" }),
                      e.jsx("p", { className: "text-slate-500", children: "មានកត្តាធំៗចំនួន ៣ ដែលជម្រុញឱ្យរូបធាតុប្រែប្រួល" })
                    ]
                  }),
                  e.jsx("div", {
                    className: "grid grid-cols-1 sm:grid-cols-3 gap-6",
                    children: [{
                      title: "កម្ដៅ (Heat)",
                      icon: "🔥",
                      color: "bg-orange-50 border-orange-200 text-orange-800",
                      items: ["អង្ករដាំក្លាយជាបាយ", "ស្ករកម្ដៅក្លាយជាចត់", "សាច់ត្រីស្ងោរឆ្អិន"]
                    }, {
                      title: "បាក់តេរី (Bacteria)",
                      icon: "🦠",
                      color: "bg-green-50 border-green-200 text-green-800",
                      items: ["បាយដំណើបក្លាយជាត្រប៉ែ", "ទឹកដោះគោទុកចោលក្លាយជាជូរ", "អាហារផ្អូម"]
                    }, {
                      title: "សារធាតុផ្សេងៗ",
                      icon: "💧",
                      color: "bg-blue-50 border-blue-200 text-blue-800",
                      items: ["ខ្យល់ធ្វើឱ្យដែកច្រែះ", "ទឹកមាត់បំប្លែងម្សៅជាស្ករ", "ទឹកភ្លៀងធ្វើឱ្យថ្មសឹក"]
                    }].map((cat, idx) => e.jsxs("div", {
                      key: idx,
                      className: `p-6 rounded-3xl border ${cat.color} space-y-4 shadow-sm hover:shadow-md transition-all`,
                      children: [
                        e.jsxs("div", { className: "flex items-center gap-3", children: [e.jsx("span", { className: "text-3xl", children: cat.icon }), e.jsx("h4", { className: "font-bold font-moul text-sm", children: cat.title })] }),
                        e.jsx("ul", { className: "space-y-2", children: cat.items.map((item, i) => e.jsxs("li", { className: "flex items-center gap-2 text-xs", children: [e.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-current opacity-50" }), item] }, i)) })
                      ]
                    }))
                  })
                ]
              }) : n === "tab-quiz" ? isFinished ? e.jsxs("div", {
                className: "max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95 duration-500",
                children: [
                  e.jsxs("div", {
                    className: "relative inline-block",
                    children: [
                      e.jsx("div", { className: "absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full" }),
                      e.jsx("div", { className: "relative text-8xl mb-4", children: score > 15 ? "🏆" : score > 10 ? "🥈" : "🥉" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      e.jsx("h2", { className: "text-3xl font-bold font-moul text-slate-900", children: "អបអរសាទរ!" }),
                      e.jsxs("p", { className: "text-slate-500", children: ["អ្នកបានបញ្ចប់ការធ្វើតេស្តមេរៀនទី ១២ ដោយទទួលបានពិន្ទុ ", e.jsx("span", { className: "font-bold text-blue-600 text-2xl", children: score }), " ក្នុងចំណោម ", e.jsx("span", { className: "font-bold", children: quizQuestions.length })] }),
                      e.jsx("div", {
                        className: "w-full max-w-xs mx-auto h-3 bg-slate-100 rounded-full mt-4 overflow-hidden",
                        children: e.jsx("div", { className: "h-full bg-blue-500", style: { width: `${(score / quizQuestions.length) * 100}%` } })
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex flex-wrap justify-center gap-4 pt-4",
                    children: [
                      e.jsxs("button", { onClick: () => { setIsFinished(!1); setUserAnswers({}); setCurrentQIndex(0); }, className: "px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2", children: [e.jsx("i", { className: "fa-solid fa-rotate-right" }), " ធ្វើតេស្តម្ដងទៀត"] }),
                      e.jsxs("button", { onClick: t, className: "px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2", children: [e.jsx("i", { className: "fa-solid fa-xmark" }), " ចាកចេញ"] })
                    ]
                  })
                ]
              }) : e.jsxs("div", {
                className: "max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsxs("div", { className: "w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold", children: [currentQIndex + 1] }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-wider", children: "សំណួរ" }),
                              e.jsx("p", { className: "text-xs font-bold text-slate-700", children: `${currentQIndex + 1} នៃ ${quizQuestions.length}` })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsx("span", { className: "text-xs font-bold text-slate-500", children: "វឌ្ឍនភាព" }),
                          e.jsx("div", {
                            className: "w-32 h-2 bg-slate-100 rounded-full overflow-hidden",
                            children: e.jsx("div", { className: "h-full bg-blue-500 transition-all duration-500", style: { width: `${((currentQIndex + 1) / quizQuestions.length) * 100}%` } })
                          })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8",
                    children: [
                      e.jsx("h3", { className: "text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed", children: quizQuestions[currentQIndex].question }),
                      e.jsx("div", {
                        className: "grid grid-cols-1 gap-4",
                        children: quizQuestions[currentQIndex].options.map((opt, idx) => e.jsxs("button", {
                          key: idx,
                          onClick: () => {
                            const newAns = { ...userAnswers, [currentQIndex]: idx };
                            setUserAnswers(newAns);
                            if (currentQIndex < quizQuestions.length - 1) {
                              setTimeout(() => setCurrentQIndex(currentQIndex + 1), 300);
                            } else {
                              setTimeout(() => setIsFinished(!0), 500);
                            }
                          },
                          className: `group relative p-5 rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.98] flex items-center gap-4 ${userAnswers[currentQIndex] === idx ? "border-blue-500 bg-blue-50/50 shadow-md" : "border-slate-100 bg-slate-50/30 hover:border-blue-200 hover:bg-white"}`,
                          children: [
                            e.jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-all ${userAnswers[currentQIndex] === idx ? "bg-blue-600 text-white shadow-blue-200" : "bg-white text-slate-400 group-hover:text-blue-500 border border-slate-200 shadow-xs"}`, children: String.fromCharCode(65 + idx) }),
                            e.jsx("span", { className: `font-bold text-sm sm:text-base ${userAnswers[currentQIndex] === idx ? "text-blue-900" : "text-slate-600 group-hover:text-slate-900"}`, children: opt.text })
                          ]
                        }, idx))
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex justify-between items-center px-2",
                    children: [
                      e.jsxs("button", { onClick: () => currentQIndex > 0 && setCurrentQIndex(currentQIndex - 1), disabled: currentQIndex === 0, className: "flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors", children: [e.jsx("i", { className: "fa-solid fa-arrow-left" }), " សំណួរមុន"] }),
                      e.jsxs("button", { onClick: () => currentQIndex < quizQuestions.length - 1 && setCurrentQIndex(currentQIndex + 1), disabled: userAnswers[currentQIndex] === undefined || currentQIndex === quizQuestions.length - 1, className: "flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 disabled:opacity-30 disabled:pointer-events-none transition-colors", children: ["សំណួរបន្ទាប់ ", e.jsx("i", { className: "fa-solid fa-arrow-right" })] })
                    ]
                  })
                ]
              }) : null
            })
          ]
        })
      })
    };

