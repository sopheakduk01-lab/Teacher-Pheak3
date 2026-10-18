import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const lessons = [
  {
    num: 2,
    name: 'Rz2',
    out: 'scripts/rz2_component_code.js',
    title: 'មេរៀនទី ២ ៖ ការដាំដំណាំ',
    badge: 'មេរៀនទី ២',
    icon: '🌱',
    colorFrom: 'from-emerald-600',
    colorVia: 'via-teal-600',
    colorTo: 'to-green-700',
    json: 'scripts/lesson2_questions.json',
    tabs: [
      { id: 'tab-hero', label: 'ទិដ្ឋភាពទូទៅ', icon: '📖' },
      { id: 'tab-preparation', label: 'ការរៀបចំដី', icon: '🚜' },
      { id: 'tab-planting', label: 'បច្ចេកទេសដាំ', icon: '🌱' },
      { id: 'tab-care', label: 'ការថែទាំ', icon: '💧' },
      { id: 'tab-quiz', label: 'សំណួរ ៤០ QCM', icon: '❓' }
    ],
    heroTitle: 'មេរៀនទី ២ ៖ ការដាំដំណាំ (Crop Planting)',
    heroDesc: 'ការដាំដំណាំជាសកម្មភាពកសិកម្មសំខាន់ដើម្បីផលិតអាហារទ្រទ្រង់ជីវិតមនុស្ស និងសត្វ។ ការយល់ដឹងពីបច្ចេកទេសជ្រើសរើសទីតាំង រៀបចំដី ជ្រើសរើសពូជ និងការថែទាំ ជួយឱ្យទទួលបានទិន្នផលខ្ពស់។'
  },
  {
    num: 3,
    name: 'Rz3',
    out: 'scripts/rz3_component_code.js',
    title: 'មេរៀនទី ៣ ៖ ការចិញ្ចឹមសត្វ',
    badge: 'មេរៀនទី ៣',
    icon: '🐄',
    colorFrom: 'from-amber-600',
    colorVia: 'via-orange-600',
    colorTo: 'to-yellow-700',
    json: 'scripts/lesson3_questions.json',
    tabs: [
      { id: 'tab-hero', label: 'ទិដ្ឋភាពទូទៅ', icon: '📖' },
      { id: 'tab-housing', label: 'ទ្រុង និងជម្រក', icon: '🏠' },
      { id: 'tab-feeding', label: 'ចំណីអាហារ', icon: '🌾' },
      { id: 'tab-health', label: 'សុខភាពសត្វ', icon: '💉' },
      { id: 'tab-quiz', label: 'សំណួរ ៤០ QCM', icon: '❓' }
    ],
    heroTitle: 'មេរៀនទី ៣ ៖ ការចិញ្ចឹមសត្វ (Animal Husbandry)',
    heroDesc: 'ការចិញ្ចឹមសត្វផ្តល់នូវសាច់ ទឹកដោះ ពង និងកម្លាំងអូសទាញ។ ការសាងសង់ទ្រុងមានអនាម័យ ការផ្តល់ចំណីមានជាតិបំប៉ន និងការចាក់វ៉ាក់សាំងការពារជំងឺជាកត្តាសំខាន់។'
  },
  {
    num: 4,
    name: 'Rz4',
    out: 'scripts/rz4_component_code.js',
    title: 'មេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ',
    badge: 'មេរៀនទី ៤',
    icon: '🏞️',
    colorFrom: 'from-cyan-600',
    colorVia: 'via-teal-600',
    colorTo: 'to-blue-700',
    json: 'scripts/lesson4_questions.json',
    tabs: [
      { id: 'tab-hero', label: 'ទិដ្ឋភាពទូទៅ', icon: '📖' },
      { id: 'tab-definition', label: 'និយមន័យបរិស្ថាន', icon: '🌍' },
      { id: 'tab-components', label: 'សមាសភាគបរិស្ថាន', icon: '🌲' },
      { id: 'tab-quiz', label: 'សំណួរ ៤០ QCM', icon: '❓' }
    ],
    heroTitle: 'មេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ (Natural Environment)',
    heroDesc: 'បរិស្ថានគឺជាអ្វីៗទាំងអស់ដែលនៅជុំវិញខ្លួនយើង រួមមានភាវៈមានជីវិត និងភាវៈគ្មានជីវិត។ បរិស្ថានចែកជាពីរគឺ បរិស្ថានធម្មជាតិ និងបរិស្ថានសង្គម/កែច្នៃ។'
  },
  {
    num: 5,
    name: 'Rz5',
    out: 'scripts/rz5_component_code.js',
    title: 'មេរៀនទី ៥ ៖ ធនធានធម្មជាតិ',
    badge: 'មេរៀនទី ៥',
    icon: '💎',
    colorFrom: 'from-emerald-600',
    colorVia: 'via-green-600',
    colorTo: 'to-teal-700',
    json: 'scripts/lesson5_questions.json',
    tabs: [
      { id: 'tab-hero', label: 'ទិដ្ឋភាពទូទៅ', icon: '📖' },
      { id: 'tab-renewable', label: 'ធនធានកកើតឡើងវិញ', icon: '🔄' },
      { id: 'tab-nonrenewable', label: 'ធនធានមិនកកើតឡើងវិញ', icon: '⛏️' },
      { id: 'tab-conservation', label: 'ការអភិរក្សធនធាន', icon: '🛡️' },
      { id: 'tab-quiz', label: 'សំណួរ ៤០ QCM', icon: '❓' }
    ],
    heroTitle: 'មេរៀនទី ៥ ៖ ធនធានធម្មជាតិ (Natural Resources)',
    heroDesc: 'ធនធានធម្មជាតិគឺជាអ្វីៗដែលកើតឡើងដោយឯកឯងពីធម្មជាតិ ហើយមនុស្សអាចប្រើប្រាស់បាន។ ធនធានចែកជាប្រភេទកកើតឡើងវិញ (ទឹក ដី ព្រៃឈើ) និងមិនកកើតឡើងវិញ (រ៉ែ ប្រេងកាត)។'
  },
  {
    num: 6,
    name: 'Rz6',
    out: 'scripts/rz6_component_code.js',
    title: 'មេរៀនទី ៦ ៖ ប្រដាប់បន្តពូជមនុស្ស',
    badge: 'មេរៀនទី ៦',
    icon: '🧬',
    colorFrom: 'from-violet-600',
    colorVia: 'via-purple-600',
    colorTo: 'to-indigo-700',
    json: 'scripts/lesson6_questions.json',
    tabs: [
      { id: 'tab-hero', label: 'ទិដ្ឋភាពទូទៅ', icon: '📖' },
      { id: 'tab-male', label: 'ប្រដាប់បន្តពូជបុរស', icon: '♂️' },
      { id: 'tab-female', label: 'ប្រដាប់បន្តពូជស្ត្រី', icon: '♀️' },
      { id: 'tab-quiz', label: 'សំណួរ ៤០ QCM', icon: '❓' }
    ],
    heroTitle: 'មេរៀនទី ៦ ៖ ប្រដាប់បន្តពូជមនុស្ស (Human Reproductive System)',
    heroDesc: 'ការបន្តពូជជាលក្ខណៈជីវសាស្ត្រដើម្បីបង្កើតកូនចៅ និងធានាការរស់នៅគង់វង្សនៃពូជពង្ស។ ប្រដាប់បន្តពូជបុរសផលិតស្ពែម និងប្រដាប់បន្តពូជស្ត្រីផលិតអូវុល។'
  },
  {
    num: 7,
    name: 'Rz7',
    out: 'scripts/rz7_component_code.js',
    title: 'មេរៀនទី ៧ ៖ ភាពពេញវ័យ',
    badge: 'មេរៀនទី ៧',
    icon: '🌱',
    colorFrom: 'from-indigo-600',
    colorVia: 'via-blue-600',
    colorTo: 'to-sky-700',
    json: 'scripts/lesson7_questions.json',
    tabs: [
      { id: 'tab-hero', label: 'ទិដ្ឋភាពទូទៅ', icon: '📖' },
      { id: 'tab-puberty_def', label: 'និយមន័យភាពពេញវ័យ', icon: '✨' },
      { id: 'tab-male_changes', label: 'បម្រែបម្រួលប្រុស', icon: '👦' },
      { id: 'tab-female_changes', label: 'បម្រែបម្រួលស្រី', icon: '👧' },
      { id: 'tab-hygiene', label: 'អនាម័យខ្លួនប្រាណ', icon: '🧼' },
      { id: 'tab-quiz', label: 'សំណួរ ៤០ QCM', icon: '❓' }
    ],
    heroTitle: 'មេរៀនទី ៧ ៖ ភាពពេញវ័យ (Puberty & Adolescence)',
    heroDesc: 'ភាពពេញវ័យជាដំណាក់កាលផ្លាស់ប្តូរពីរូបរាងកុមារភាពឈានឆ្ពោះទៅរកមនុស្សពេញវ័យ។ ការផ្លាស់ប្តូរកើតឡើងដោយសារឥទ្ធិពលអ័រម៉ូនភេទ។'
  },
  {
    num: 8,
    name: 'Rz8',
    out: 'scripts/rz8_component_code.js',
    title: 'មេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌',
    badge: 'មេរៀនទី ៨',
    icon: '🛡️',
    colorFrom: 'from-rose-600',
    colorVia: 'via-pink-600',
    colorTo: 'to-teal-700',
    json: 'scripts/lesson8_questions.json',
    tabs: [
      { id: 'tab-hero', label: 'ទិដ្ឋភាពទូទៅ', icon: '📖' },
      { id: 'tab-methods', label: 'វិធីសាស្ត្រពន្យារកំណើត', icon: '🛡️' },
      { id: 'tab-consequences', label: 'ផលវិបាកនៃការមានផ្ទៃពោះ', icon: '⚠️' },
      { id: 'tab-behavior', label: 'ការអនុវត្តត្រឹមត្រូវ', icon: '💡' },
      { id: 'tab-quiz', label: 'សំណួរ ៤០ QCM', icon: '❓' }
    ],
    heroTitle: 'មេរៀនទី ៨ ៖ ការការពារកុំឱ្យមានគភ៌ (Contraception & Prevention)',
    heroDesc: 'ការការពារកុំឱ្យមានគភ៌ ឬការពន្យារកំណើត គឺជាវិធានការរារាំងមិនឱ្យមេជីវិតឈ្មោលជួបមេជីវិតញី ឬរារាំងមិនឱ្យអូវុលជ្រុះ ឬស៊ីកូតទំនៅនឹងស្បូន។'
  }
];

lessons.forEach(l => {
  console.log(`--- Building ${l.name} for ${l.title} ---`);
  const questionsData = JSON.parse(fs.readFileSync(l.json, 'utf8'));
  const quizQuestionsJSON = JSON.stringify(questionsData);
  const tabsJSON = JSON.stringify(l.tabs);

  const code = `var ${l.name} = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [l, o] = y.useState(!1);
  const [c, d] = y.useState(0);
  const [u, h] = y.useState(!1);
  
  // QCM Lesson 1 style interactive states
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);

  const quizQuestions = ${quizQuestionsJSON};

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
    playTone(300, 0.15);
    setTimeout(() => playTone(200, 0.2), 120);
  };

  return e.jsx("div", {
    className: "fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn font-['Battambang']",
    children: e.jsxs("div", {
      className: "bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]",
      children: [
        e.jsxs("div", {
          className: "bg-gradient-to-r ${l.colorFrom} ${l.colorVia} ${l.colorTo} p-4 sm:p-6 text-white flex items-center justify-between shrink-0 shadow-md",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("span", { className: "text-3xl sm:text-4xl", children: "${l.icon}" }),
                e.jsxs("div", {
                  children: [
                    e.jsx("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 border border-white/30 backdrop-blur-md", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ • ${l.badge}" }),
                    e.jsx("h2", { className: "text-lg sm:text-2xl font-black mt-1 leading-tight", children: "${l.title}" })
                  ]
                })
              ]
            }),
            e.jsx("button", {
              onClick: t,
              className: "w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center font-bold text-lg active:scale-95 cursor-pointer",
              children: "✕"
            })
          ]
        }),
        e.jsx("div", {
          className: "bg-slate-100 dark:bg-slate-800/80 p-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar",
          children: ${tabsJSON}.map(tab => e.jsxs("button", {
            onClick: () => i(tab.id),
            className: "px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap " + (n === tab.id ? "bg-slate-900 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"),
            children: [e.jsx("span", { children: tab.icon }), tab.label]
          }))
        }),
        e.jsxs("div", {
          className: "p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 dark:text-slate-200",
          children: [
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "${l.heroTitle}" }),
                e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed", children: "${l.heroDesc}" })
              ]
            }),
            n === "tab-quiz" && e.jsx("div", {
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
                          e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2", children: "${l.title}" }),
                          e.jsx("p", { className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1", children: "ចម្លើយត្រូវបានរៀបចំឆ្លាស់គ្នាស្មើៗគ្នា (ក, ខ, គ, ឃ) និងមានប្រវែងស្មើគ្នាដើម្បីវាស់ស្ទង់ការយល់ដឹងពិតប្រាកដ។" })
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
                                  e.jsx("span", { className: "text-xs text-slate-400", children: "${l.badge}" })
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
            })
          ]
        })
      ]
    })
  });
};`;

  // Verify syntax
  try {
    new vm.Script(code);
    fs.writeFileSync(l.out, code);
    console.log(`SUCCESS: ${l.out} written and verified with ZERO syntax errors!`);
  } catch (err) {
    console.error(`SYNTAX ERROR building ${l.out}:`, err);
  }
});
