import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';

console.log("=== Updating ALL Science Lessons (2 to 14) with Speech Audio & Fullscreen Mode ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

// Lesson audio descriptions
const lessonSummaries = {
  2: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ២ ៖ ការដាំដំណាំ ៖ ទី ១. សារសំខាន់ ៖ កសិកម្មជាប្រភពស្បៀងអាហារ និងសេដ្ឋកិច្ចដ៏សំខាន់។ ទី ២. បច្ចេកទេសដាំដុះ ៖ រួមមាន ៥ ជំហានសំខាន់ៗគឺ ៖ ការរៀបចំដី, ការជ្រើសរើសគ្រាប់ពូជល្អ, វិធីសាស្ត្រដាំ, ការថែទាំ (ស្រោចទឹក ជ្រោយដី ដាក់ជី កម្ចាត់សត្វល្អិត), និងការប្រមូលផលរក្សាទុក។",
  3: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ៣ ៖ ការថែរក្សាសត្វ ៖ ទី ១. ប្រយោជន៍នៃសត្វចិញ្ចឹម ៖ ផ្តល់អាហារូបត្ថម្ភ (សាច់ ទឹកដោះ ពង) កម្លាំងអូសទាញ ជីធម្មជាតិ និងប្រាក់ចំណូល។ ទី ២. វិធីថែរក្សាសត្វ ៖ ត្រូវរៀបចំទ្រុង ឬជម្រកស្អាត មានពន្លឺ និងខ្យល់ចេញចូល, ផ្តល់ចំណី និងទឹកស្អាតគ្រប់គ្រាន់, រក្សាអនាម័យ, និងចាក់វ៉ាក់សាំងការពារជំងឺជាប្រចាំ។",
  4: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ ៖ ទី ១. បរិស្ថាន ៖ ជាអ្វីៗទាំងអស់ដែលនៅជុំវិញខ្លួនយើង។ ទី ២. កត្តាបង្ក ៖ បរិស្ថានធម្មជាតិផ្សំឡើងពី កត្តាជីវៈ (មនុស្ស សត្វ រុក្ខជាតិ មីក្រូសារពាង្គកាយ) និងកត្តាអជីវៈ (ដី ទឹក ខ្យល់ ពន្លឺព្រះអាទិត្យ ថ្ម) ដែលមានទំនាក់ទំនងរស់នៅអាស្រ័យផលគ្នាទៅវិញទៅមក។",
  5: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ៥ ៖ ធនធានធម្មជាតិ ៖ ទី ១. ធនធានធម្មជាតិ ៖ ជាអ្វីៗដែលមានក្នុងធម្មជាតិ ហើយផ្តល់ផលប្រយោជន៍ដល់មនុស្ស។ ទី ២. ប្រភេទធនធាន ៖ ចែកជា ធនធានកើតឡើងវិញ (ដូចជា ព្រៃឈើ ទឹក ខ្យល់ ពន្លឺថ្ងៃ) និងធនធានមិនកើតឡើងវិញ (ដូចជា រ៉ែ ប្រេងកាត ធ្យូងថ្ម)។ ទី ៣. ការអភិរក្ស ៖ ត្រូវប្រើប្រាស់ដោយសន្សំសំចៃ ចូលរួមដាំដើមឈើឡើងវិញ និងការពារប្រភពទឹក។",
  6: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ៦ ៖ ប្រដាប់បន្តពូជមនុស្ស ៖ ទី ១. តួនាទី ៖ ការបន្តពូជជាលក្ខណៈជីវសាស្ត្រដើម្បីបង្កើតកូនចៅ និងធានាការរស់នៅគង់វង្សនៃពូជពង្ស។ ទី ២. សរីរាង្គបង្ក ៖ ប្រដាប់បន្តពូជបុរសផលិតស្ពែម និងប្រដាប់បន្តពូជស្ត្រីផលិតអូវុល។",
  7: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ៧ ៖ ភាពពេញវ័យ ៖ ទី ១. ភាពពេញវ័យ ៖ ជាដំណាក់កាលផ្លាស់ប្តូរពីរូបរាងកុមារភាពឈានឆ្ពោះទៅរកមនុស្សពេញវ័យ។ ទី ២. បម្រែបម្រួល ៖ កើតឡើងដោយសារឥទ្ធិពលអ័រម៉ូនភេទ។ ទី ៣. អនាម័យ ៖ ត្រូវរក្សាអនាម័យខ្លួនប្រាណ និងផ្លូវចិត្តឱ្យបានល្អ។",
  8: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌ ៖ ទី ១. ការការពារ ៖ គឺជាវិធានការរារាំងមិនឱ្យមេជីវិតឈ្មោលជួបមេជីវិតញី ឬរារាំងមិនឱ្យអូវុលជ្រុះ។ ទី ២. វិធីសាស្ត្រពន្យារកំណើត ៖ មានវិធីធម្មជាតិ និងវិធីសាស្ត្រទំនើបវេជ្ជសាស្ត្រ។",
  9: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ៩ ៖ ប្រដាប់រំលាយអាហារ ៖ ទី ១. តួនាទី ៖ រំលាយអាហារធំៗឱ្យទៅជាសារធាតុចិញ្ចឹមតូចៗដើម្បីបឺតស្រូបចូលក្នុងឈាម។ ទី ២. សរីរាង្គបង្ក ៖ មាត់ បំពង់អាហារ ក្រពះ ពោះវៀនតូច ពោះវៀនធំ និងគូទខ្យង។",
  10: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ១០ ៖ ប្រដាប់ដកដង្ហើម ៖ ទី ១. តួនាទី ៖ ស្រូបយកឧស្ម័នអុកស៊ីសែនចូល និងបញ្ចេញឧស្ម័នកាបូនិចមកក្រៅ។ ទី ២. សរីរាង្គបង្ក ៖ រន្ធច្រមុះ បំពង់ខ្យល់ មែកបំពង់ខ្យល់ និងសួតទាំងពីរ។",
  11: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ១១ ៖ ប្រដាប់របត់ឈាម ៖ ទី ១. តួនាទី ៖ ដឹកនាំសារធាតុចិញ្ចឹម និងអុកស៊ីសែនទៅកាន់គ្រប់កោសិកានៃរាងកាយ។ ទី ២. សរីរាង្គបង្ក ៖ បេះដូង (មាន ៤ ថត) និងសរសៃឈាម (អាទែ វេន សរសៃឈាមបក)។",
  12: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ១២ ៖ ការប្រែប្រួលរូបធាតុ ៖ ទី ១. ភាពរូប ៖ មាន ៣ គឺ រឹង រាវ និងឧស្ម័ន។ ទី ២. ការប្រែប្រួលរូប ៖ មិនបង្កើតអង្គធាតុថ្មីឡើយ។ ទី ៣. ការប្រែប្រួលគីមី ៖ បង្កើតអង្គធាតុថ្មីដែលមានលក្ខណៈខុសពីអង្គធាតុដើម។",
  13: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ១៣ ៖ ធាតុគីមី អង្គធាតុសុទ្ធ និងល្បាយ ៖ ទី ១. ធាតុគីមី ៖ ជាភាគល្អិតតូចៗបំផុតនៃរូបធាតុ (១០៦ ធាតុ)។ ទី ២. អង្គធាតុសុទ្ធ ៖ ផ្សំឡើងពីធាតុគីមីតែមួយប្រភេទ។ ទី ៣. ល្បាយ ៖ ល្បាយស្មើរសាច់ និងល្បាយមិនស្មើរសាច់។",
  14: "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ១៤ ៖ ម៉ាស៊ីនងាយ ៖ ទី ១. ឃ្នាស់ ៖ ចល័តជុំវិញចំណុចទ្រ មាន ៣ ប្រភេទ។ ទី ២. ប្លង់ទេរ ៖ ផ្ទៃរាបសម្រាប់លើកដាក់វត្ថុ។ ទី ៣. រ៉ក ៖ រ៉កនឹង (F=P), រ៉កចល័ត (F=P/2), និងប្រព័ន្ធរ៉ក (F=P/4)។"
};

// Rebuild build_all_rz_components.js to add audio speech + fullscreen toggle for Rz2-Rz8
const lessons = [
  { num: 2, name: 'Rz2', json: 'scripts/lesson2_questions.json', title: 'មេរៀនទី ២ ៖ ការដាំដំណាំ', icon: '🌱' },
  { num: 3, name: 'Rz3', json: 'scripts/lesson3_questions.json', title: 'មេរៀនទី ៣ ៖ ការចិញ្ចឹមសត្វ', icon: '🐄' },
  { num: 4, name: 'Rz4', json: 'scripts/lesson4_questions.json', title: 'មេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ', icon: '🏞️' },
  { num: 5, name: 'Rz5', json: 'scripts/lesson5_questions.json', title: 'មេរៀនទី ៥ ៖ ធនធានធម្មជាតិ', icon: '💎' },
  { num: 6, name: 'Rz6', json: 'scripts/lesson6_questions.json', title: 'មេរៀនទី ៦ ៖ ប្រដាប់បន្តពូជមនុស្ស', icon: '🧬' },
  { num: 7, name: 'Rz7', json: 'scripts/lesson7_questions.json', title: 'មេរៀនទី ៧ ៖ ភាពពេញវ័យ', icon: '🌱' },
  { num: 8, name: 'Rz8', json: 'scripts/lesson8_questions.json', title: 'មេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌', icon: '🛡️' }
];

for (const l of lessons) {
  const outPath = `scripts/rz${l.num}_component_code.js`;
  if (!fs.existsSync(l.json)) continue;
  const questionsData = JSON.parse(fs.readFileSync(l.json, 'utf8'));
  const questionsJSON = JSON.stringify(questionsData);
  const audioText = lessonSummaries[l.num];

  const code = `var ${l.name} = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [isFullscreen, setIsFullscreen] = y.useState(false);
  const [isSpeaking, setIsSpeaking] = y.useState(false);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);

  const quizQuestions = ${questionsJSON};

  const toggleSpeech = (textToRead) => {
    if (isSpeaking) {
      if (window.stopKhmerAudio) window.stopKhmerAudio();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      s && s("បានបិទសំឡេងអាន");
      return;
    }
    if (!textToRead) return;
    setIsSpeaking(true);
    s && s("កំពុងអានជាសំឡេងភាសាខ្មែរ...");

    if (window.playKhmerSpeech) {
      window.playKhmerSpeech(
        textToRead,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    } else if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(textToRead);
        utter.lang = "km-KH";
        utter.rate = 0.88;
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
      } catch (err) {
        setIsSpeaking(false);
      }
    } else {
      setIsSpeaking(false);
    }
  };

  const toggleFullscreen = () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    if (s) s(nextState ? "បានបើករបៀបបង្ហាញពេញអេក្រង់ (Full Screen)" : "បានចាកចេញពីរបៀបពេញអេក្រង់");
  };

  const currentQ = quizQuestions[currentQIndex];
  const qAudioText = currentQ ? (currentQ.q + "។ ចម្លើយ ៖ " + currentQ.opts.map((o, idx) => ['ក', 'ខ', 'គ', 'ឃ'][idx] + ". " + o.t).join(". ") + (userAnswers[currentQIndex] !== undefined ? "។ " + currentQ.opts[userAnswers[currentQIndex]].e : "")) : "";

  return e.jsx("div", {
    className: "fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fadeIn",
    children: e.jsxs("div", {
      className: isFullscreen ? "bg-white dark:bg-slate-900 w-screen h-screen rounded-none border-0 overflow-hidden flex flex-col z-50 text-slate-800 dark:text-slate-100" : "bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] text-slate-800 dark:text-slate-100",
      children: [
        e.jsxs("div", {
          className: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-md",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("span", { className: "text-3xl sm:text-4xl", children: "${l.icon}" }),
                e.jsxs("div", {
                  children: [
                    e.jsx("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 border border-white/30 backdrop-blur-md", children: "${l.title}" }),
                    e.jsx("h2", { className: "text-base sm:text-xl font-bold mt-1 leading-tight", children: "${l.title}" })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                e.jsxs("button", {
                  type: "button",
                  onClick: () => toggleSpeech("${audioText}"),
                  className: "px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer " + (isSpeaking ? "bg-amber-400 text-slate-950 animate-pulse" : "bg-white/20 text-white hover:bg-white/30"),
                  children: [e.jsx("span", { children: isSpeaking ? "⏹️" : "🔊" }), e.jsx("span", { className: "hidden sm:inline", children: isSpeaking ? "បញ្ឈប់" : "ស្ដាប់ពន្យល់សំឡេង" })]
                }),
                e.jsxs("button", {
                  type: "button",
                  onClick: toggleFullscreen,
                  className: "px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white cursor-pointer",
                  children: [e.jsx("span", { children: isFullscreen ? "🗗" : "⛶" }), e.jsx("span", { className: "hidden sm:inline", children: isFullscreen ? "បង្រួម" : "ពេញអេក្រង់" })]
                }),
                e.jsx("button", {
                  onClick: t,
                  className: "w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center font-bold text-lg cursor-pointer",
                  children: "✕"
                })
              ]
            })
          ]
        }),
        e.jsxs("div", {
          className: "p-4 sm:p-6 overflow-y-auto flex-1 space-y-6",
          children: [
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-4 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3",
                  children: [
                    e.jsx("p", { className: "text-xs sm:text-sm text-emerald-900 dark:text-emerald-100 font-medium leading-relaxed", children: "${audioText}" }),
                    e.jsxs("button", {
                      type: "button",
                      onClick: () => toggleSpeech("${audioText}"),
                      className: "px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs hover:bg-emerald-700",
                      children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់ពន្យល់"]
                    })
                  ]
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: () => i("tab-quiz"),
                  className: "w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition cursor-pointer text-center",
                  children: "📝 ចាប់ផ្តើមធ្វើតេស្ត QCM ៤០ សំណួរ"
                })
              ]
            }),
            n === "tab-quiz" && e.jsxs("div", {
              className: "space-y-4 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800",
                  children: [
                    e.jsxs("span", { className: "text-xs font-bold text-emerald-600", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ", quizQuestions.length] }),
                    e.jsxs("button", {
                      type: "button",
                      onClick: () => toggleSpeech(qAudioText),
                      className: "px-3 py-1 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1",
                      children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់សំណួរ"]
                    })
                  ]
                }),
                e.jsx("div", { className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed", children: currentQ ? (currentQIndex + 1 + ". " + currentQ.q) : "" }),
                currentQ && e.jsx("div", {
                  className: "space-y-2 pt-2",
                  children: currentQ.opts.map((opt, optIdx) => {
                    const isAns = userAnswers[currentQIndex] !== undefined;
                    const isSel = userAnswers[currentQIndex] === optIdx;
                    let btnCls = "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100";
                    if (isAns) {
                      if (opt.c) btnCls = "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-950 font-bold";
                      else if (isSel) btnCls = "bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-950";
                      else btnCls = "bg-slate-50 dark:bg-slate-800 opacity-50";
                    }
                    return e.jsxs("button", {
                      type: "button",
                      onClick: () => setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIdx })),
                      className: "w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between " + btnCls,
                      children: [
                        e.jsxs("span", { children: [['ក.', 'ខ.', 'គ.', 'ឃ.'][optIdx], " ", opt.t] }),
                        isAns && (opt.c ? e.jsx("span", { className: "text-emerald-600 font-bold", children: "✓" }) : isSel ? e.jsx("span", { className: "text-rose-600 font-bold", children: "✕" }) : null)
                      ]
                    }, optIdx);
                  })
                }),
                userAnswers[currentQIndex] !== undefined && currentQ && e.jsxs("div", {
                  className: "p-4 rounded-xl text-xs sm:text-sm flex items-start justify-between gap-2 " + (currentQ.opts[userAnswers[currentQIndex]].c ? "bg-emerald-50 text-emerald-950 border border-emerald-200" : "bg-rose-50 text-rose-950 border border-rose-200"),
                  children: [
                    e.jsxs("div", { children: [e.jsx("strong", { children: currentQ.opts[userAnswers[currentQIndex]].c ? "ត្រឹមត្រូវ! " : "មិនទាន់ត្រឹមត្រូវទេ! " }), currentQ.opts[userAnswers[currentQIndex]].e] }),
                    e.jsxs("button", {
                      type: "button",
                      onClick: () => toggleSpeech(currentQ.opts[userAnswers[currentQIndex]].e),
                      className: "px-2 py-1 bg-white text-xs font-bold rounded-lg border shrink-0 cursor-pointer",
                      children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់ពន្យល់"]
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800",
                  children: [
                    e.jsxs("button", {
                      disabled: currentQIndex === 0,
                      onClick: () => setCurrentQIndex(prev => Math.max(0, prev - 1)),
                      className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer",
                      children: ["◄ ", "សំណួរមុន"]
                    }),
                    e.jsxs("button", {
                      disabled: currentQIndex === quizQuestions.length - 1,
                      onClick: () => setCurrentQIndex(prev => Math.min(quizQuestions.length - 1, prev + 1)),
                      className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer",
                      children: ["សំណួរបន្ទាប់ ", "►"]
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

  fs.writeFileSync(outPath, code, 'utf8');
  console.log(`Updated ${outPath} with speech audio + fullscreen support`);
}

// Now update public/assets/index-BwPwHqBe.js and dist/assets/index-BwPwHqBe.js for Rz2 to Rz14
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let bundleCode = fs.readFileSync(f, 'utf8');

  for (let num = 2; num <= 14; num++) {
    const compFile = `scripts/rz${num}_component_code.js`;
    if (!fs.existsSync(compFile)) continue;
    let raw = fs.readFileSync(compFile, 'utf8').trim();
    if (raw.startsWith(`var Rz${num} =`)) raw = raw.replace(new RegExp(`^var Rz${num}\\s*=\\s*`), '');
    if (raw.endsWith(';')) raw = raw.slice(0, -1);

    const matchStr = `Rz${num}=({`;
    const idx = bundleCode.indexOf(matchStr);
    if (idx !== -1) {
      // Find end of component by looking for next component definition or end pattern
      const nextCompIdx = bundleCode.indexOf(`,\nRz${num - 1}=({`, idx);
      if (nextCompIdx !== -1) {
        bundleCode = bundleCode.slice(0, idx) + `Rz${num}=` + raw + bundleCode.slice(nextCompIdx);
        console.log(`Replaced Rz${num} in ${f}`);
      }
    }
  }

  try {
    esbuild.transformSync(bundleCode, { loader: 'js' });
    console.log(`VALIDATION SUCCESS for ${f}`);
    fs.writeFileSync(f, bundleCode, 'utf8');
    console.log(`Updated ${f} successfully!`);
  } catch (err) {
    console.error(`Validation error in ${f}:`, err.message);
    process.exit(1);
  }
}

console.log("=== ALL SCIENCE LESSONS UPDATED WITH SPEECH AUDIO AND FULLSCREEN MODE ===");
