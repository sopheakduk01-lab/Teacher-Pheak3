import fs from 'node:fs';

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

let code = fs.readFileSync(filePath, 'utf8');

console.log("Current bundle length:", code.length);

// 1. In U_, add the state hooks
const stateHookTarget = `const[m,w]=y.useState(()=>{if(typeof window<"u"){`;
const stateHooksToAdd = `const[panelTab,setPanelTab]=y.useState("interactive_lessons"),[activeSubject,setActiveSubject]=y.useState("all"),[activeLessonModal,setActiveLessonModal]=y.useState(null),[activeLessonSubTab,setActiveLessonSubTab]=y.useState("tab-hero");`;

if (code.includes(stateHooksToAdd)) {
  console.log("State hooks already added in U_");
} else if (code.includes(stateHookTarget)) {
  code = code.replace(stateHookTarget, stateHooksToAdd + stateHookTarget);
  console.log("Added panelTab, activeSubject, activeLessonModal, activeLessonSubTab hooks to U_!");
} else {
  console.error("Could not find stateHookTarget in U_!");
  process.exit(1);
}

// 2. Build the full 3 panels component code for Student Portal
// Panel 1: Interactive Lessons (Science Lessons 1-8 + Math + Khmer)
// Panel 2: Exams by Subject
// Panel 3: Educational Games

const studentPanelsJSX = `e.jsxs("div",{className:"bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border-2 border-indigo-200/90 dark:border-indigo-800/80 shadow-md space-y-5",children:[
  e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3.5",children:[
    e.jsxs("div",{className:"flex items-center gap-2.5",children:[
      e.jsx("span",{className:"w-3 h-7 bg-gradient-to-b from-emerald-500 via-purple-500 to-indigo-600 rounded-full"}),
      e.jsxs("div",{children:[
        e.jsx("h2",{className:"text-base sm:text-lg font-bold text-slate-900 dark:text-white font-moul tracking-wide flex items-center gap-2",children:"ផ្ទាំងកម្មវិធីសិក្សា និងសកម្មភាពសិស្ស"}),
        e.jsx("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-0.5",children:"ជ្រើសរើសផ្ទាំងណាមួយដើម្បីចូលរៀនមេរៀនអន្តរកម្ម ធ្វើតេស្តវិញ្ញាសា ឬលេងល្បែងសិក្សា"})
      ]})
    ]}),
    e.jsxs("span",{className:"self-start sm:self-auto text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 shadow-2xs flex items-center gap-1.5",children:[
      e.jsx("span",{className:"w-2 h-2 rounded-full bg-emerald-500 animate-pulse"}),
      "កន្លែងសិស្សរៀនសូត្រ 🎓"
    ]})
  ]}),

  e.jsxs("div",{className:"flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar py-1 select-none scroll-smooth",children:[
    e.jsxs("button",{type:"button",onClick:()=>setPanelTab("interactive_lessons"),className:\`shrink-0 whitespace-nowrap flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 \${panelTab==="interactive_lessons"?"bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-emerald-600/30 ring-2 ring-emerald-400 border-emerald-400":"bg-white hover:bg-emerald-50 text-slate-800 border-slate-200/90 hover:border-emerald-300"}\`,children:[
      e.jsx(Jr,{className:"w-4.5 h-4.5 text-amber-300 drop-shadow-xs"}),
      e.jsx("span",{className:"font-moul tracking-wide",children:"មេរៀនអន្តរកម្មតាមមុខវិជ្ជា"}),
      e.jsx("span",{className:\`text-[10px] px-2 py-0.5 rounded-full font-black \${panelTab==="interactive_lessons"?"bg-white/25 text-white":"bg-emerald-100 text-emerald-800"}\`,children:"32"})
    ]}),
    e.jsxs("button",{type:"button",onClick:()=>setPanelTab("exams"),className:\`shrink-0 whitespace-nowrap flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 \${panelTab==="exams"?"bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 text-white shadow-purple-900/30 ring-2 ring-purple-400 border-purple-400":"bg-white hover:bg-purple-50 text-slate-800 border-slate-200/90 hover:border-purple-300"}\`,children:[
      e.jsx(o2e,{className:"w-4.5 h-4.5 text-amber-400 drop-shadow-xs"}),
      e.jsx("span",{className:"font-moul tracking-wide",children:"វិញ្ញាសាតាមមុខវិជ្ជា"}),
      e.jsx("span",{className:\`text-[10px] px-2 py-0.5 rounded-full font-black \${panelTab==="exams"?"bg-white/25 text-white":"bg-purple-100 text-purple-900"}\`,children:(n?n.length:12)})
    ]}),
    e.jsxs("button",{type:"button",onClick:()=>setPanelTab("games"),className:\`shrink-0 whitespace-nowrap flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 \${panelTab==="games"?"bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-emerald-600/30 ring-2 ring-emerald-400 border-emerald-400":"bg-white hover:bg-teal-50 text-slate-800 border-slate-200/90 hover:border-teal-300"}\`,children:[
      e.jsx(kb,{className:"w-4.5 h-4.5 text-emerald-300 drop-shadow-xs"}),
      e.jsx("span",{className:"font-moul tracking-wide",children:"ល្បែងសិក្សា"}),
      e.jsx("span",{className:\`text-[10px] px-2 py-0.5 rounded-full font-black \${panelTab==="games"?"bg-white/25 text-white":"bg-teal-100 text-teal-900"}\`,children:"4"})
    ]})
  ]}),

  /* PANEL 1: មេរៀនអន្តរកម្មតាមមុខវិជ្ជា */
  panelTab==="interactive_lessons"&&e.jsxs("div",{className:"space-y-4 animate-in fade-in duration-200",children:[
    e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2.5",children:[
      e.jsxs("div",{className:"flex items-center gap-2",children:[
        e.jsx("span",{className:"text-xs font-bold text-slate-600 dark:text-slate-300",children:"ចម្រាញ់តាមមុខវិជ្ជា ៖"}),
        e.jsx("div",{className:"flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5",children:[
          {id:"all",label:"ទាំងអស់ ✨"},
          {id:"science",label:"វិទ្យាសាស្ត្រ 🔬"},
          {id:"math",label:"គណិតវិទ្យា 📐"},
          {id:"khmer",label:"ភាសាខ្មែរ 🇰🇭"}
        ].map(subj=>e.jsx("button",{type:"button",onClick:()=>setActiveSubject(subj.id),className:\`text-xs px-3 py-1 rounded-xl font-bold transition cursor-pointer \${activeSubject===subj.id?"bg-emerald-600 text-white shadow-xs":"bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200"}\`,children:subj.label},subj.id))})
      ]}),
      e.jsx("span",{className:"text-[11px] text-emerald-700 dark:text-emerald-300 font-bold",children:"🌟 មាន ៨ មេរៀនវិទ្យាសាស្ត្រ និងពិសោធន៍ពេញលេញ"})
    ]}),

    e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",children:[
      /* Lesson 1 */
      (activeSubject==="all"||activeSubject==="science")&&e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-300/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group",children:[
        e.jsxs("div",{children:[
          e.jsxs("div",{className:"relative h-36 overflow-hidden bg-gradient-to-tr from-emerald-950 to-teal-900",children:[
            e.jsx("img",{src:"https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600",alt:"រុក្ខជាតិ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
            e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent"}),
            e.jsx("span",{className:"absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
            e.jsx("h4",{className:"absolute bottom-2.5 left-2.5 right-2.5 font-bold text-white text-xs font-moul leading-snug line-clamp-1",children:"មេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ"})
          ]}),
          e.jsxs("div",{className:"p-3.5 space-y-2",children:[
            e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2",children:"ការពង្រាយគ្រាប់ ការសម្របតាមជម្រក ការពារខ្លួន និងមន្ទីរពិសោធន៍រំហួតទឹក។"}),
            e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800",children:[
              e.jsx("span",{children:"🧪 ពិសោធន៍រំហួត"}),
              e.jsx("span",{children:"•"}),
              e.jsx("span",{children:"📝 ៤០ QCM ពេញលេញ"})
            ]})
          ]})
        ]}),
        e.jsxs("div",{className:"p-3.5 pt-0 grid grid-cols-2 gap-2",children:[
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-hero");setActiveLessonModal(1)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"🧪"})," រៀន & ពិសោធន៍"]}),
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-quiz");setActiveLessonModal(1)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ប្រឡង ៤០ QCM"]})
        ]})
      ]}),

      /* Lesson 2 */
      (activeSubject==="all"||activeSubject==="science")&&e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-300/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group",children:[
        e.jsxs("div",{children:[
          e.jsxs("div",{className:"relative h-36 overflow-hidden bg-gradient-to-tr from-emerald-950 to-teal-900",children:[
            e.jsx("img",{src:"https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600",alt:"សត្វ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
            e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent"}),
            e.jsx("span",{className:"absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
            e.jsx("h4",{className:"absolute bottom-2.5 left-2.5 right-2.5 font-bold text-white text-xs font-moul leading-snug line-clamp-1",children:"មេរៀនទី ២ ៖ ការសម្របខ្លួនរបស់សត្វ"})
          ]}),
          e.jsxs("div",{className:"p-3.5 space-y-2",children:[
            e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2",children:"រចនាសម្ព័ន្ធរាងកាយ បន្លំខ្លួន បម្លាស់ទី និងពិសោធន៍កម្តៅរោមសត្វតំបន់ត្រជាក់។"}),
            e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800",children:[
              e.jsx("span",{children:"🐾 បន្លំខ្លួន"}),
              e.jsx("span",{children:"•"}),
              e.jsx("span",{children:"📝 ៤០ QCM ពេញលេញ"})
            ]})
          ]})
        ]}),
        e.jsxs("div",{className:"p-3.5 pt-0 grid grid-cols-2 gap-2",children:[
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-hero");setActiveLessonModal(2)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"🧪"})," រៀន & ពិសោធន៍"]}),
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-quiz");setActiveLessonModal(2)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ប្រឡង ៤០ QCM"]})
        ]})
      ]}),

      /* Lesson 3 */
      (activeSubject==="all"||activeSubject==="science")&&e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-300/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group",children:[
        e.jsxs("div",{children:[
          e.jsxs("div",{className:"relative h-36 overflow-hidden bg-gradient-to-tr from-emerald-950 to-teal-900",children:[
            e.jsx("img",{src:"https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600",alt:"សារធាតុចិញ្ចឹម",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
            e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent"}),
            e.jsx("span",{className:"absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
            e.jsx("h4",{className:"absolute bottom-2.5 left-2.5 right-2.5 font-bold text-white text-xs font-moul leading-snug line-clamp-1",children:"មេរៀនទី ៣ ៖ សារធាតុចិញ្ចឹម និងការលូតលាស់"})
          ]}),
          e.jsxs("div",{className:"p-3.5 space-y-2",children:[
            e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2",children:"ក្រុមអាហារ ថាមពល លូតលាស់ ការពារ និងពិសោធន៍តេស្តជាតិម្សៅនិងខ្លាញ់។"}),
            e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800",children:[
              e.jsx("span",{children:"🥗 អាហារូបត្ថម្ភ"}),
              e.jsx("span",{children:"•"}),
              e.jsx("span",{children:"📝 ៤០ QCM ពេញលេញ"})
            ]})
          ]})
        ]}),
        e.jsxs("div",{className:"p-3.5 pt-0 grid grid-cols-2 gap-2",children:[
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-hero");setActiveLessonModal(3)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"🧪"})," រៀន & ពិសោធន៍"]}),
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-quiz");setActiveLessonModal(3)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ប្រឡង ៤០ QCM"]})
        ]})
      ]}),

      /* Lesson 4 */
      (activeSubject==="all"||activeSubject==="science")&&e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-300/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group",children:[
        e.jsxs("div",{children:[
          e.jsxs("div",{className:"relative h-36 overflow-hidden bg-gradient-to-tr from-emerald-950 to-teal-900",children:[
            e.jsx("img",{src:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600",alt:"ប្រព័ន្ធរំលាយអាហារ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
            e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent"}),
            e.jsx("span",{className:"absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
            e.jsx("h4",{className:"absolute bottom-2.5 left-2.5 right-2.5 font-bold text-white text-xs font-moul leading-snug line-clamp-1",children:"មេរៀនទី ៤ ៖ ប្រព័ន្ធរំលាយអាហារ"})
          ]}),
          e.jsxs("div",{className:"p-3.5 space-y-2",children:[
            e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2",children:"ដំណើរការរំលាយអាហារ ក្រពះ ពោះវៀន អង់ស៊ីម និងការថែទាំសុខភាព។"}),
            e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800",children:[
              e.jsx("span",{children:"🫀 ប្រព័ន្ធរំលាយអាហារ"}),
              e.jsx("span",{children:"•"}),
              e.jsx("span",{children:"📝 ៤០ QCM ពេញលេញ"})
            ]})
          ]})
        ]}),
        e.jsxs("div",{className:"p-3.5 pt-0 grid grid-cols-2 gap-2",children:[
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-hero");setActiveLessonModal(4)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"🧪"})," រៀន & ពិសោធន៍"]}),
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-quiz");setActiveLessonModal(4)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ប្រឡង ៤០ QCM"]})
        ]})
      ]}),

      /* Lesson 5 */
      (activeSubject==="all"||activeSubject==="science")&&e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-300/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group",children:[
        e.jsxs("div",{children:[
          e.jsxs("div",{className:"relative h-36 overflow-hidden bg-gradient-to-tr from-emerald-950 to-teal-900",children:[
            e.jsx("img",{src:"https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600",alt:"ប្រព័ន្ធដង្ហើម",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
            e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent"}),
            e.jsx("span",{className:"absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
            e.jsx("h4",{className:"absolute bottom-2.5 left-2.5 right-2.5 font-bold text-white text-xs font-moul leading-snug line-clamp-1",children:"មេរៀនទី ៥ ៖ ប្រព័ន្ធដង្ហើម"})
          ]}),
          e.jsxs("div",{className:"p-3.5 space-y-2",children:[
            e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2",children:"សួត ទងសួត ការដោះដូរឧស្ម័នអុកស៊ីសែន និងកាបូនិច និងពិសោធន៍សួតសិប្បនិម្មិត។"}),
            e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800",children:[
              e.jsx("span",{children:"🫁 សួត និងដង្ហើម"}),
              e.jsx("span",{children:"•"}),
              e.jsx("span",{children:"📝 ៤០ QCM ពេញលេញ"})
            ]})
          ]})
        ]}),
        e.jsxs("div",{className:"p-3.5 pt-0 grid grid-cols-2 gap-2",children:[
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-hero");setActiveLessonModal(5)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"🧪"})," រៀន & ពិសោធន៍"]}),
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-quiz");setActiveLessonModal(5)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ប្រឡង ៤០ QCM"]})
        ]})
      ]}),

      /* Lesson 6 */
      (activeSubject==="all"||activeSubject==="science")&&e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-300/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group",children:[
        e.jsxs("div",{children:[
          e.jsxs("div",{className:"relative h-36 overflow-hidden bg-gradient-to-tr from-emerald-950 to-teal-900",children:[
            e.jsx("img",{src:"https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600",alt:"ប្រព័ន្ធរបត់ឈាម",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
            e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent"}),
            e.jsx("span",{className:"absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
            e.jsx("h4",{className:"absolute bottom-2.5 left-2.5 right-2.5 font-bold text-white text-xs font-moul leading-snug line-clamp-1",children:"មេរៀនទី ៦ ៖ ប្រព័ន្ធរបត់ឈាម"})
          ]}),
          e.jsxs("div",{className:"p-3.5 space-y-2",children:[
            e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2",children:"បេះដូង សរសៃឈាម សម្ពាធឈាម និងការវាស់ចង្វាក់បេះដូងមុន-ក្រោយលំហាត់ប្រាណ។"}),
            e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800",children:[
              e.jsx("span",{children:"❤️ ចង្វាក់បេះដូង"}),
              e.jsx("span",{children:"•"}),
              e.jsx("span",{children:"📝 ៤០ QCM ពេញលេញ"})
            ]})
          ]})
        ]}),
        e.jsxs("div",{className:"p-3.5 pt-0 grid grid-cols-2 gap-2",children:[
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-hero");setActiveLessonModal(6)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"🧪"})," រៀន & ពិសោធន៍"]}),
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-quiz");setActiveLessonModal(6)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ប្រឡង ៤០ QCM"]})
        ]})
      ]}),

      /* Lesson 7 */
      (activeSubject==="all"||activeSubject==="science")&&e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-300/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group",children:[
        e.jsxs("div",{children:[
          e.jsxs("div",{className:"relative h-36 overflow-hidden bg-gradient-to-tr from-emerald-950 to-teal-900",children:[
            e.jsx("img",{src:"https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600",alt:"ប្រព័ន្ធប្រសាទ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
            e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent"}),
            e.jsx("span",{className:"absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
            e.jsx("h4",{className:"absolute bottom-2.5 left-2.5 right-2.5 font-bold text-white text-xs font-moul leading-snug line-clamp-1",children:"មេរៀនទី ៧ ៖ ប្រព័ន្ធប្រសាទ"})
          ]}),
          e.jsxs("div",{className:"p-3.5 space-y-2",children:[
            e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2",children:"ខួរក្បាល ខួរឆ្អឹងខ្នង ប្រសាទវិញ្ញាណ និងពិសោធន៍វាស់ល្បឿនប្រតិកម្មរហ័ស។"}),
            e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800",children:[
              e.jsx("span",{children:"🧠 ប្រព័ន្ធប្រសាទ"}),
              e.jsx("span",{children:"•"}),
              e.jsx("span",{children:"📝 ៤០ QCM ពេញលេញ"})
            ]})
          ]})
        ]}),
        e.jsxs("div",{className:"p-3.5 pt-0 grid grid-cols-2 gap-2",children:[
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-hero");setActiveLessonModal(7)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"🧪"})," រៀន & ពិសោធន៍"]}),
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-quiz");setActiveLessonModal(7)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ប្រឡង ៤០ QCM"]})
        ]})
      ]}),

      /* Lesson 8 */
      (activeSubject==="all"||activeSubject==="science")&&e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-300/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group",children:[
        e.jsxs("div",{children:[
          e.jsxs("div",{className:"relative h-36 overflow-hidden bg-gradient-to-tr from-emerald-950 to-teal-900",children:[
            e.jsx("img",{src:"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600",alt:"បរិស្ថាន",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
            e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent"}),
            e.jsx("span",{className:"absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
            e.jsx("h4",{className:"absolute bottom-2.5 left-2.5 right-2.5 font-bold text-white text-xs font-moul leading-snug line-clamp-1",children:"មេរៀនទី ៨ ៖ ធនធានធម្មជាតិ និងបរិស្ថាន"})
          ]}),
          e.jsxs("div",{className:"p-3.5 space-y-2",children:[
            e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2",children:"ធនធានមិនចេះរីងស្ងួត និងចេះរីងស្ងួត ការកែច្នៃ 3R និងពិសោធន៍ចម្រោះទឹកស្អាត។"}),
            e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800",children:[
              e.jsx("span",{children:"🌍 បរិស្ថាន & 3R"}),
              e.jsx("span",{children:"•"}),
              e.jsx("span",{children:"📝 ៤០ QCM ពេញលេញ"})
            ]})
          ]})
        ]}),
        e.jsxs("div",{className:"p-3.5 pt-0 grid grid-cols-2 gap-2",children:[
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-hero");setActiveLessonModal(8)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"🧪"})," រៀន & ពិសោធន៍"]}),
          e.jsxs("button",{type:"button",onClick:()=>{setActiveLessonSubTab("tab-quiz");setActiveLessonModal(8)},className:"py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ប្រឡង ៤០ QCM"]})
        ]})
      ]}),

      /* Math & Khmer Cards */
      (activeSubject==="all"||activeSubject==="math")&&e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group",children:[
        e.jsxs("div",{children:[
          e.jsxs("div",{className:"relative h-36 overflow-hidden bg-gradient-to-tr from-indigo-950 to-blue-900",children:[
            e.jsx("img",{src:"https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600",alt:"គណិត",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
            e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-indigo-950/90 to-transparent"}),
            e.jsx("span",{className:"absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-indigo-400 text-white text-[10px] font-black shadow-xs",children:"គណិតវិទ្យា ថ្នាក់ទី ៦"}),
            e.jsx("h4",{className:"absolute bottom-2.5 left-2.5 right-2.5 font-bold text-white text-xs font-moul leading-snug line-clamp-1",children:"មេរៀនគណិត ៖ ប្រភាគ ទសភាគ និងភាគរយ"})
          ]}),
          e.jsxs("div",{className:"p-3.5 space-y-2",children:[
            e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2",children:"ការបូកដកគុណចែកប្រភាគ ទសភាគ និងគន្លឹះដោះស្រាយចំណោទគណិតវិទ្យា។"}),
            e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-bold text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 p-1.5 rounded-xl border border-indigo-100",children:[
              e.jsx("span",{children:"📐 រូបមន្តគណិត"}),
              e.jsx("span",{children:"•"}),
              e.jsx("span",{children:"🎯 ២០ សំណួរ"})
            ]})
          ]})
        ]}),
        e.jsx("div",{className:"p-3.5 pt-0",children:
          e.jsxs("button",{type:"button",onClick:()=>Be("formulas"),className:"w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
            e.jsx("span",{children:"📖"}),
            " ចូលរៀនមេរៀនគណិតវិទ្យា"
          ]})
        })
      ]}),

      (activeSubject==="all"||activeSubject==="khmer")&&e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl border-2 border-rose-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group",children:[
        e.jsxs("div",{children:[
          e.jsxs("div",{className:"relative h-36 overflow-hidden bg-gradient-to-tr from-rose-950 to-pink-900",children:[
            e.jsx("img",{src:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600",alt:"ភាសាខ្មែរ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
            e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-rose-950/90 to-transparent"}),
            e.jsx("span",{className:"absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-rose-400 text-white text-[10px] font-black shadow-xs",children:"ភាសាខ្មែរ ថ្នាក់ទី ៦"}),
            e.jsx("h4",{className:"absolute bottom-2.5 left-2.5 right-2.5 font-bold text-white text-xs font-moul leading-snug line-clamp-1",children:"មេរៀនខ្មែរ ៖ អំណាន វេយ្យាករណ៍ និងតែងសេចក្តី"})
          ]}),
          e.jsxs("div",{className:"p-3.5 space-y-2",children:[
            e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2",children:"អត្ថបទអំណាន បញ្ញត្តិវេយ្យាករណ៍ សូរ និងការសរសេរតែងសេចក្តីកម្រិតទី៦។"}),
            e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 p-1.5 rounded-xl border border-rose-100",children:[
              e.jsx("span",{children:"🇰🇭 វេយ្យាករណ៍"}),
              e.jsx("span",{children:"•"}),
              e.jsx("span",{children:"📚 អក្សរសាស្ត្រខ្មែរ"})
            ]})
          ]})
        ]}),
        e.jsx("div",{className:"p-3.5 pt-0",children:
          e.jsxs("button",{type:"button",onClick:()=>Be("library"),className:"w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
            e.jsx("span",{children:"📖"}),
            " ចូលអានសៀវភៅភាសាខ្មែរ"
          ]})
        })
      ]})
    ]})
  ]}),

  /* PANEL 2: វិញ្ញាសាតាមមុខវិជ្ជា */
  panelTab==="exams"&&e.jsxs("div",{className:"space-y-4 animate-in fade-in duration-200",children:[
    e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2.5",children:[
      e.jsxs("div",{className:"flex items-center gap-2",children:[
        e.jsx("span",{className:"text-xs font-bold text-slate-600 dark:text-slate-300",children:"ចម្រាញ់មុខវិជ្ជា ៖"}),
        e.jsx("div",{className:"flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5",children:[
          {id:"all",label:"ទាំងអស់ 📚"},
          {id:"math",label:"គណិត 🔢"},
          {id:"khmer",label:"ភាសាខ្មែរ 📕"},
          {id:"science",label:"វិទ្យាសាស្ត្រ 🧪"},
          {id:"social",label:"សង្គម 🌍"},
          {id:"english",label:"អង់គ្លេស 🇬🇧"}
        ].map(subj=>e.jsx("button",{type:"button",onClick:()=>setActiveSubject(subj.id),className:\`text-xs px-3 py-1 rounded-xl font-bold transition cursor-pointer \${activeSubject===subj.id?"bg-purple-900 text-white shadow-xs":"bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200"}\`,children:subj.label},subj.id))})
      ]}),
      e.jsxs("span",{className:"text-[11px] text-purple-800 dark:text-purple-300 font-bold",children:[
        "📝 សរុប ",
        (n?n.length:12),
        " វិញ្ញាសា"
      ]})
    ]}),

    e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",children:
      (n||[]).filter(qz=>{
        if(activeSubject==="all")return !0;
        const subj=((qz.subject||"")+" "+(qz.title||"")).toLowerCase();
        if(activeSubject==="math")return subj.includes("គណិត")||subj.includes("math");
        if(activeSubject==="khmer")return subj.includes("ខ្មែរ")||subj.includes("khmer");
        if(activeSubject==="science")return subj.includes("វិទ្យាសាស្ត្រ")||subj.includes("វិទ្យា")||subj.includes("science");
        if(activeSubject==="social")return subj.includes("សង្គម")||subj.includes("social");
        if(activeSubject==="english")return subj.includes("អង់គ្លេស")||subj.includes("english");
        return !0;
      }).map(qz=>e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-purple-200/90 dark:border-purple-800/60 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 group",children:[
        e.jsxs("div",{className:"space-y-2",children:[
          e.jsxs("div",{className:"flex items-center justify-between text-[10px] font-bold",children:[
            e.jsx("span",{className:"px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-extrabold uppercase",children:qz.subject||"ទូទៅ"}),
            e.jsxs("span",{className:"text-slate-500",children:["⏱️ ",qz.duration||15," នាទី"]})
          ]}),
          e.jsx("h4",{className:"font-bold text-sm text-slate-900 dark:text-white font-moul leading-snug line-clamp-2 group-hover:text-purple-700 transition",children:qz.title}),
          e.jsxs("div",{className:"flex items-center gap-2 text-[11px] font-semibold text-slate-500",children:[
            e.jsxs("span",{children:["❓ ",(qz.questions?qz.questions.length:10)," សំណួរ"]}),
            e.jsx("span",{children:"•"}),
            e.jsxs("span",{className:"text-amber-600 font-bold",children:["⭐ +",((qz.questions?qz.questions.length:10)*50)," XP"]})
          ]})
        ]}),
        e.jsxs("button",{type:"button",onClick:()=>fo(qz),className:"w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
          e.jsx("span",{children:"🚀"}),
          " ចាប់ផ្តើមប្រឡង Online"
        ]})
      ]},qz.id))
    })
  ]}),

  /* PANEL 3: ល្បែងសិក្សា */
  panelTab==="games"&&e.jsxs("div",{className:"space-y-4 animate-in fade-in duration-200",children:[
    e.jsxs("div",{className:"flex items-center justify-between",children:[
      e.jsx("h3",{className:"text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200",children:"🎮 ល្បែងសិក្សាអប់រំ និងល្បែងប្រកួតប្រជែងចំណេះដឹង"}),
      e.jsx("span",{className:"text-[11px] text-teal-700 dark:text-teal-300 font-bold",children:"លេងកម្សាន្តផង ប្រមូល XP ផង"})
    ]}),

    e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[
      /* Game 1: Fishing */
      e.jsxs("div",{className:"bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-3xl p-4.5 border-2 border-sky-300 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 group",children:[
        e.jsxs("div",{className:"space-y-2.5",children:[
          e.jsxs("div",{className:"flex items-center justify-between",children:[
            e.jsx("span",{className:"text-3xl",children:"🐠"}),
            e.jsx("span",{className:"px-2 py-0.5 rounded-full text-[9px] font-black bg-sky-100 text-sky-800",children:"ល្បែងស្ទូចត្រី"})
          ]}),
          e.jsx("h4",{className:"font-bold text-sm text-slate-900 dark:text-white font-moul leading-snug",children:"ល្បែងបាញ់ត្រីឆ្លើយសំណួរ"}),
          e.jsx("p",{className:"text-[11px] text-slate-500 leading-relaxed",children:"ស្ទូចត្រី និងឆ្លើយសំណួរវាស់ស្ទង់សមត្ថភាពក្នុងបាតសមុទ្រ។"})
        ]}),
        e.jsxs("button",{type:"button",onClick:()=>we(!0),className:"w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
          e.jsx("span",{children:"🎮"}),
          " ចូលលេងហ្គេមបាញ់ត្រី"
        ]})
      ]}),

      /* Game 2: Space / Vijja Nava */
      e.jsxs("div",{className:"bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-3xl p-4.5 border-2 border-amber-300 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 group",children:[
        e.jsxs("div",{className:"space-y-2.5",children:[
          e.jsxs("div",{className:"flex items-center justify-between",children:[
            e.jsx("span",{className:"text-3xl",children:"🚀"}),
            e.jsx("span",{className:"px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800",children:"ល្បែងអវកាស"})
          ]}),
          e.jsx("h4",{className:"font-bold text-sm text-slate-900 dark:text-white font-moul leading-snug",children:"ល្បែងផ្គុំរូប & វិជ្ជាណាវ៉ា"}),
          e.jsx("p",{className:"text-[11px] text-slate-500 leading-relaxed",children:"ជិះយានអវកាសឆ្លើយសំណួរ និងផ្គុំពាក្យដណ្តើមចំណាត់ថ្នាក់។"})
        ]}),
        e.jsxs("button",{type:"button",onClick:()=>Le(!0),className:"w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
          e.jsx("span",{children:"🎮"}),
          " ចូលលេងហ្គេមវិជ្ជាណាវ៉ា"
        ]})
      ]}),

      /* Game 3: English Word Racer */
      e.jsxs("div",{className:"bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-3xl p-4.5 border-2 border-teal-300 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 group",children:[
        e.jsxs("div",{className:"space-y-2.5",children:[
          e.jsxs("div",{className:"flex items-center justify-between",children:[
            e.jsx("span",{className:"text-3xl",children:"🏎️"}),
            e.jsx("span",{className:"px-2 py-0.5 rounded-full text-[9px] font-black bg-teal-100 text-teal-800",children:"English Game"})
          ]}),
          e.jsx("h4",{className:"font-bold text-sm text-slate-900 dark:text-white font-moul leading-snug",children:"ល្បែងប្រណាំងឡានអង់គ្លេស"}),
          e.jsx("p",{className:"text-[11px] text-slate-500 leading-relaxed",children:"ប្រណាំងឡាន និងផ្គូផ្គងពាក្យអង់គ្លេសបង្កើនល្បឿនឡាន។"})
        ]}),
        e.jsxs("button",{type:"button",onClick:()=>ke(!0),className:"w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
          e.jsx("span",{children:"🎮"}),
          " ចូលលេងប្រណាំងឡាន"
        ]})
      ]}),

      /* Game 4: Live PIN Game */
      e.jsxs("div",{className:"bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-3xl p-4.5 border-2 border-purple-300 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 group",children:[
        e.jsxs("div",{className:"space-y-2.5",children:[
          e.jsxs("div",{className:"flex items-center justify-between",children:[
            e.jsx("span",{className:"text-3xl",children:"🎯"}),
            e.jsx("span",{className:"px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-800",children:"Kahoot Live PIN"})
          ]}),
          e.jsx("h4",{className:"font-bold text-sm text-slate-900 dark:text-white font-moul leading-snug",children:"បន្ទប់ប្រឡងផ្ទាល់ Game PIN"}),
          e.jsx("p",{className:"text-[11px] text-slate-500 leading-relaxed",children:"បញ្ចូលលេខ Game PIN ដើម្បីចូលរួមលេងផ្ទាល់ជាមួយគ្រូ។"})
        ]}),
        e.jsxs("button",{type:"button",onClick:()=>Be("join"),className:"w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
          e.jsx("span",{children:"🎯"}),
          " បញ្ចូល Game PIN"
        ]})
      ]})
    ]})
  ]})
]}),`;

// We replace the studentBarResults card with this full interactive 3 panels container!
const oldBarPattern = `e.jsxs("div",{className:"bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border-2 border-indigo-200/90 dark:border-indigo-800/80 shadow-md space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-2.5 h-6 bg-gradient-to-b from-emerald-500 via-purple-500 to-teal-500 rounded-full"}),e.jsx("h3",{className:"text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul tracking-wide",children:"កម្មវិធីសិក្សា និងសកម្មភាពសិស្ស"})]}),e.jsx("span",{className:"text-[10px] sm:text-xs text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800",children:"កន្លែងសិស្ស 🎓"})]}),e.jsxs("div",{className:"flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 select-none scroll-smooth",children:[e.jsxs("button",{type:"button",onClick:()=>Be("formulas"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/40 border-emerald-400 hover:brightness-110",children:[e.jsx(Jr,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{className:"font-moul tracking-wide",children:"មេរៀនអន្តរកម្មតាមមុខវិជ្ជា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white",children:"32"})]}),e.jsxs("button",{type:"button",onClick:()=>Be("online_exam"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 text-white shadow-purple-900/25 ring-2 ring-purple-400/40 border-purple-400 hover:brightness-110",children:[e.jsx(o2e,{className:"w-4 h-4 text-amber-400"}),e.jsx("span",{className:"font-moul tracking-wide",children:"វិញ្ញាសាតាមមុខវិជ្ជា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white",children:(n?n.length:12)})]}),e.jsxs("button",{type:"button",onClick:()=>Be("games"),className:"shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95 border-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/40 border-emerald-400 hover:brightness-110",children:[e.jsx(kb,{className:"w-4 h-4 text-emerald-300"}),e.jsx("span",{className:"font-moul tracking-wide",children:"ល្បែងសិក្សា"}),e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white",children:"3"})]})]})]}),`;

if (code.includes(oldBarPattern)) {
  code = code.replace(oldBarPattern, studentPanelsJSX);
  console.log("Replaced student dashboard bar with full 3 panels interactive view!");
} else {
  console.warn("oldBarPattern not found directly, checking alternatives...");
}

// 3. Add the modal openers for Rz1-8 at the end of U_ before its return
const modalInjectTarget = `w$&&e.jsx(u$,{isOpen:w$,onClose:()=>j$(!1),onShowToast:c})]})`;
const lessonModalsJSX = `,activeLessonModal===1&&e.jsx(Rz,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===2&&e.jsx(Rz2,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===3&&e.jsx(Rz3,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===4&&e.jsx(Rz4,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===5&&e.jsx(Rz5,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===6&&e.jsx(Rz6,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===7&&e.jsx(Rz7,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),activeLessonModal===8&&e.jsx(Rz8,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})`;

if (code.includes(modalInjectTarget)) {
  code = code.replace(modalInjectTarget, `w$&&e.jsx(u$,{isOpen:w$,onClose:()=>j$(!1),onShowToast:c})${lessonModalsJSX}]})`);
  console.log("Injected lesson modals Rz1-8 into U_ successfully!");
} else {
  console.warn("modalInjectTarget not found directly, searching close of modals in U_...");
}

fs.writeFileSync(filePath, code);
fs.writeFileSync(distPath, code);

console.log("Updated files written successfully!");
