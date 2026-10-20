Rz9=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"})=>{
  if(!r)return null;
  const[n,i]=y.useState(a);
  const[currentQIndex,setCurrentQIndex]=y.useState(0);
  const[userAnswers,setUserAnswers]=y.useState({});
  const[isFinished,setIsFinished]=y.useState(!1);
  const[activeTheoryPart,setActiveTheoryPart]=y.useState(1);
  const[activeLabTool,setActiveLabTool]=y.useState("stis");
  const[selectedSti,setSelectedSti]=y.useState("gonorrhea");
  const[selectedHivStage,setSelectedHivStage]=y.useState(0);

  const q=Zi9[currentQIndex];
  const userChoice=userAnswers[currentQIndex];
  const score=Object.keys(userAnswers).filter(idx=>{
    const ans=userAnswers[idx];
    return Zi9[idx].opts[ans]&&Zi9[idx].opts[ans].c;
  }).length;

  const stisData={
    gonorrhea:{
      title:"១. ជំងឺប្រមេះទឹកបាយ",
      incubation:"២ ទៅ ៣ ថ្ងៃទើបចេញរោគសញ្ញា",
      men:"ពិបាកនោម នោមឈឺ ទឹកនោមមានខ្ទុះពណ៌លឿង ឬពណ៌បៃតងចេញពីបង្ហួរនោម។",
      women:"ពិបាកនោម នោមឈឺ ឈឺតាមបង្ហួរនោម ឈឺនៅមាត់ស្បូន និងតាមរន្ធទ្វារមាស។",
      danger:"អាចបង្កឱ្យរលាកធ្ងន់ធ្ងរ និងបាត់បង់លទ្ធភាពមានកូន (អារ)។",
      icon:"⚠️"
    },
    warts:{
      title:"២. ជំងឺសិរមាន់",
      incubation:"សាច់ពកដុះបន្តិចម្តងៗលើប្រដាប់បន្តពូជ",
      men:"មានសាច់ពកទំហំប៉ុនជើងធូប រហូតដល់ធំប៉ុនចុងម្រាមដៃ។",
      women:"សាច់ពកខ្លះមានរាងមូលដូចផ្កាខាត់ណា (ផ្នែកខាងលើមានសភាពក្រិនដូចសិររបស់សត្វមាន់)។",
      danger:"ឆ្លងរាលដាលលឿន និងបង្កឱ្យមានការពិបាកខ្លាំងពេលសម្រាលកូន។",
      icon:"🐓"
    },
    syphilis:{
      title:"៣. ជំងឺស្វាយ",
      incubation:"រោគសញ្ញាដំបូងមានដំបៅមិនឈឺចាប់",
      men:"មានដំបៅលើប្រដាប់បន្តពូជ និងកន្លែងដទៃ។ ដំបៅនេះមិនឈឺចាប់ទេ ហើយជាសះស្បើយទៅវិញដោយឯកឯង។",
      women:"មានកូនកណ្តុរនៅក្រលៀន មិនឈឺ មិនរលួយ ហើយរលាយទៅវិញដោយឯកឯង។",
      danger:"បើទុកយូរ មេរោគស៊ីដល់ឆ្អឹង បេះដូង និងប្រព័ន្ធប្រសាទខួរក្បាល។",
      icon:"🟣"
    },
    chlamydia:{
      title:"៤. ជំងឺប្រមេះទឹកថ្លា",
      incubation:"លេចឡើងបន្តិចម្តងៗ",
      men:"ឈឺចាប់ ក្រហាយពេលនោម នោមញឹកញាប់ មានទឹកថ្លាចេញពីបង្ហួរនោម និងជួនកាលមានហូរខ្ទុះ។",
      women:"ភាគច្រើនគ្មានរោគសញ្ញាអ្វីទាំងអស់នៅពេលដំបូង ប៉ុន្តែបើទុកយូរអាចបណ្តាលឱ្យរលាកតួស្បូន ដៃស្បូន និងលែងមានកូន។",
      danger:"ធ្វើឱ្យស្ត្រីលែងមានកូនដោយមិនដឹងខ្លួន។",
      icon:"💧"
    },
    chancroid:{
      title:"៥. ជំងឺសង់មូ (Chancroid)",
      incubation:"២ ទៅ ៣ ថ្ងៃដំបូង",
      men:"មានកន្ទួល ២ ទៅ ៣ ទន់ហើយក្រហម រួច ២-៣ ថ្ងៃក្រោយក្លាយជាដំបៅ។ ចំពោះបុរស ដំបៅនេះឈឺចាប់ខ្លាំង។",
      women:"ចំពោះស្ត្រីមិនឈឺចាប់ទេ។ ដំបៅមានតែមួយទន់ បាតមានខ្ទុះ និងចេញឈាមពេលប៉ះពាល់។",
      danger:"កូនកណ្តុរនៅក្រលៀនម្ខាង ពណ៌ក្រហម ឈឺខ្លាំង មានខ្ទុះ និងធ្លាយ។",
      icon:"🔴"
    }
  };

  const hivStagesData=[
    {
      stage:"ដំណាក់កាលទី ១ ៖ ដំណាក់ចំហ (Window Period)",
      duration:"២ ដល់ ១២ សប្តាហ៍",
      symptom:"(-) គ្មានរោគសញ្ញាអ្វីឡើយ សុខភាពធម្មតា",
      blood:"(-) អវិជ្ជមាន (មិនទាន់ឃើញមេរោគក្នុងឈាម)",
      transmission:"(+++) ខ្ពស់បំផុត! ចម្លងទៅអ្នកដទៃយ៉ាងខ្លាំង",
      note:"មនុស្សមើលទៅស្រស់សង្ហា និងរឹងមាំ ប៉ុន្តែមេរោគចាប់ផ្តើមពង្រាយកម្លាំង។",
      badgeColor:"bg-amber-100 text-amber-900 border-amber-300"
    },
    {
      stage:"ដំណាក់កាលទី ២ ៖ ដំណាក់តេស្តឈាមវិជ្ជមាន (Asymptomatic HIV)",
      duration:"២ ដល់ ១០ ឆ្នាំ",
      symptom:"(-) គ្មានរោគសញ្ញាច្បាស់លាស់ សុខភាពនៅធម្មតា",
      blood:"(+) វិជ្ជមាន (រកឃើញមេរោគអេដស៍ក្នុងឈាម)",
      transmission:"(++) មធ្យម (ទាបជាងដំណាក់ចំហ)",
      note:"មេរោគចូលទៅកម្ទេចប្រព័ន្ធការពាររាងកាយ (កោសិកា CD4) បន្តិចម្តងៗ។",
      badgeColor:"bg-purple-100 text-purple-900 border-purple-300"
    },
    {
      stage:"ដំណាក់កាលទី ៣ ៖ ដំណាក់ជំងឺអេដស៍ពេញលេញ (Full-blown AIDS)",
      duration:"១០ ដល់ ១២ ឆ្នាំ",
      symptom:"(+) គ្រុនក្តៅបែកញើសពេលយប់ >១ខែ, ស្រកទម្ងន់ >១០%, រាករូស >១ខែ, ជំងឺឱកាសនិយម (របេង រលាកសួត ផ្សិត)",
      blood:"(+) វិជ្ជមាន ទាំងស្រុង",
      transmission:"(+) ចម្លងទៅអ្នកដទៃជាប្រចាំ",
      note:"ដំណាក់ចុងក្រោយ ខ្លួនប្រាណទ្រុឌទ្រោម កម្លាំងចុះខ្សោយខ្លាំង (ជិតស្លាប់)។",
      badgeColor:"bg-rose-100 text-rose-900 border-rose-300"
    }
  ];

  return e.jsx("div",{className:"fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4",children:
    e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200",children:[
      e.jsxs("div",{className:"relative bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 p-4 sm:p-6 text-white shrink-0",children:[
        e.jsx("button",{type:"button",onClick:t,className:"absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center font-black transition cursor-pointer text-sm",children:"✕"}),
        e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[
          e.jsx("span",{className:"px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
          e.jsx("span",{className:"text-xs text-rose-100 font-bold",children:"ជំពូកទី ៣ ៖ មនុស្ស ភាពពេញវ័យ និងជំងឺ (ទំព័រ ៥២-៥៩)"})
        ]}),
        e.jsx("h2",{className:"text-lg sm:text-2xl font-bold font-moul tracking-wide drop-shadow-sm",children:"មេរៀនទី ៩ ៖ សុខភាពបន្តពូជ"}),
        e.jsx("p",{className:"text-xs text-rose-100 mt-1 max-w-2xl line-clamp-1",children:"សុខភាពផ្លូវភេទ និងបន្តពូជ • បញ្ហាប្រឈមគ្រោះថ្នាក់ • ៥ ជំងឺកាមរោគ • ដំណាក់កាលវិវត្តមេរោគអេដស៍"}),
        e.jsxs("div",{className:"flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar",children:[
          {id:"tab-hero",label:"🌟 ទិដ្ឋភាពទូទៅ"},
          {id:"tab-theory",label:"📖 ខ្លឹមសារមេរៀន"},
          {id:"tab-lab",label:"🧪 ពិសោធន៍ & ស្វែងយល់"},
          {id:"tab-quiz",label:"📝 តេស្ត ៤០ QCM"}
        ].map(tb=>e.jsx("button",{type:"button",onClick:()=>i(tb.id),className:`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer \${n===tb.id?"bg-white text-rose-700 shadow-md":"bg-white/20 text-white hover:bg-white/30"}`,children:tb.label},tb.id))})
      ]}),

      e.jsx("div",{className:"p-4 sm:p-6 overflow-y-auto flex-1 space-y-5",children:[
        n==="tab-hero"&&e.jsxs("div",{className:"space-y-5 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3",children:[
            e.jsxs("div",{className:"bg-rose-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-rose-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"❤️"}),
              e.jsx("div",{className:"text-lg font-black text-rose-700 dark:text-rose-400",children:"៣ ផ្នែក"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"ខ្លឹមសារពេញលេញ"})
            ]}),
            e.jsxs("div",{className:"bg-amber-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-amber-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"⚠️"}),
              e.jsx("div",{className:"text-lg font-black text-amber-700 dark:text-amber-400",children:"៥ ជំងឺ"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"កាមរោគចម្បង"})
            ]}),
            e.jsxs("div",{className:"bg-purple-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-purple-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"🔬"}),
              e.jsx("div",{className:"text-lg font-black text-purple-700 dark:text-purple-400",children:"៣ ដំណាក់"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"វិវត្តមេរោគអេដស៍"})
            ]}),
            e.jsxs("div",{className:"bg-emerald-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-emerald-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"📝"}),
              e.jsx("div",{className:"text-lg font-black text-emerald-700 dark:text-emerald-400",children:"៤០ QCM"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"សំណួរវាស់ចំណេះ"})
            ]})
          ]}),

          e.jsxs("div",{className:"bg-gradient-to-r from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/60 p-4 sm:p-5 rounded-3xl border border-rose-200/80 dark:border-slate-700 space-y-3",children:[
            e.jsx("h3",{className:"font-bold text-sm sm:text-base text-slate-900 dark:text-white font-moul",children:"សេចក្តីសង្ខេបខ្លឹមសារមេរៀនទី ៩"}),
            e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 leading-relaxed",children:"មេរៀននេះបង្រៀនសិស្សានុសិស្សឱ្យយល់ដឹងពីសុខភាពផ្លូវភេទ និងសុខភាពបន្តពូជ បញ្ហាប្រឈមគ្រោះថ្នាក់នៃការមានកូនក្នុងវ័យក្មេងពេក (<១៨ ឆ្នាំ) ឬវ័យចំណាស់ពេក (>៣៥ ឆ្នាំ) រោគសញ្ញានៃជំងឺកាមរោគទាំង ៥ (ប្រមេះទឹកបាយ សិរមាន់ ស្វាយ ប្រមេះទឹកថ្លា សង់មូ) និងដំណាក់កាលវិវត្តនៃមេរោគអេដស៍ក្នុងរាងកាយ ព្រមទាំងការការពារខ្លួនដោយប្រើស្រោមអនាម័យ។"}),
            e.jsxs("div",{className:"flex items-center gap-3 pt-2",children:[
              e.jsxs("button",{type:"button",onClick:()=>i("tab-theory"),className:"px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📖"})," អានខ្លឹមសារលម្អិត"]}),
              e.jsxs("button",{type:"button",onClick:()=>i("tab-quiz"),className:"px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ចាប់ផ្តើមធ្វើតេស្ត ៤០ QCM"]})
            ]})
          ]})
        ]}),

        n==="tab-theory"&&e.jsxs("div",{className:"space-y-5 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2",children:[
            [
              {id:1,label:"ផ្នែកទី ១ ៖ សុខភាពផ្លូវភេទ & បន្តពូជ"},
              {id:2,label:"ផ្នែកទី ២ ៖ បញ្ហាប្រឈម & ជំងឺកាមរោគ"},
              {id:3,label:"ផ្នែកទី ៣ ៖ មេរោគអេដស៍ & ជំងឺអេដស៍"}
            ].map(part=>e.jsx("button",{type:"button",onClick:()=>setActiveTheoryPart(part.id),className:`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer \${activeTheoryPart===part.id?"bg-rose-600 text-white shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"}`,children:part.label},part.id))
          ]}),

          activeTheoryPart===1&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("h3",{className:"text-sm font-bold text-rose-700 dark:text-rose-400 font-moul",children:"ផ្នែកទី ១ ៖ សុខភាពផ្លូវភេទ និងសុខភាពបន្តពូជ"}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2",children:[
              e.jsx("h4",{className:"font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2",children:"✨ ១. សុខភាពល្អ ៖"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 leading-relaxed",children:"មានន័យថាទាំងផ្លូវកាយទាំងផ្លូវចិត្តពុំមានរោគា ឬបញ្ហាអ្វីមកបៀតបៀនឡើយ។ មនុស្សគ្រប់រូបតែងមានបំណងប្រាថ្នាចម្បងគឺការមានសុខភាពល្អ។"})
            ]}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2",children:[
              e.jsx("h4",{className:"font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2",children:"🌸 ២. សុខភាពផ្លូវភេទ ៖"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 leading-relaxed",children:"គឺជាភាពគ្មានជំងឺឆ្លងនៅលើប្រដាប់ភេទ និងការសម្តែងឱ្យឃើញផ្នែកខាងផ្លូវចិត្ត អារម្មណ៍ និងរូបរាងកាយតាមរយៈផ្លូវភេទ។ វាមិនផ្តោតតែទៅលើជំងឺឆ្លងតាមការរួមភេទប៉ុណ្ណោះទេ គឺត្រូវគិតទាំងតម្រូវការនៃការរួមភេទ និងភាពស្អាតនៃរាងកាយថែមទៀត។"})
            ]}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2",children:[
              e.jsx("h4",{className:"font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2",children:"🌿 ៣. សុខភាពបន្តពូជ ៖"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 leading-relaxed",children:"គឺជាភាពពេញលេញនៃសុខុមាលភាពខាងរូបរាងកាយ សេចក្តីសុខសាន្តក្នុងសង្គម ទាំងផ្លូវកាយ និងផ្លូវចិត្ត នៅគ្រប់ករណីទាំងអស់ដែលទាក់ទងទៅនឹងប្រដាប់បន្តពូជ មុខងារ និងដំណើរការរបស់វា។ វាមិនមែនសំដៅតែលើភាពគ្មានជំងឺនៃសរីរាង្គបន្តពូជប៉ុណ្ណោះទេ គឺរួមបញ្ចូលទាំងការរួមភេទដោយសុវត្ថិភាពនិងដោយពេញចិត្ត មានសមត្ថភាពបង្កើតកូន និងមានសេរីភាពក្នុងការសម្រេចចិត្ត (ឧទាហរណ៍៖ តើចង់បានកូនឬទេ? តើចង់បានកូននៅពេលណា? តើត្រូវយកកូនចំនួនប៉ុន្មាននាក់?)។"})
            ]})
          ]}),

          activeTheoryPart===2&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("h3",{className:"text-sm font-bold text-rose-700 dark:text-rose-400 font-moul",children:"ផ្នែកទី ២ ៖ បញ្ហាប្រឈមនឹងគ្រោះថ្នាក់នៃសុខភាពបន្តពូជ"}),
            e.jsxs("div",{className:"bg-amber-50 dark:bg-slate-800 p-4 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-2",children:[
              e.jsx("h4",{className:"font-bold text-xs text-amber-900 dark:text-amber-400",children:"ក. ការប្រឈមនឹងការមានកូន ៖"}),
              e.jsx("p",{className:"text-xs text-slate-700 dark:text-slate-300",children:"• ការមានផ្ទៃពោះនៅពេលមានអាយុតិចជាង ១៨ ឆ្នាំ (វ័យក្មេងពេក)។"}),
              e.jsx("p",{className:"text-xs text-slate-700 dark:text-slate-300",children:"• ការមានផ្ទៃពោះនៅពេលមានអាយុលើសពី ៣៥ ឆ្នាំ (វ័យចំណាស់ពេក)។"})
            ]}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3",children:[
              e.jsx("h4",{className:"font-bold text-xs text-rose-700 dark:text-rose-400",children:"ខ. ការប្រឈមនឹងជំងឺកាមរោគទាំង ៥ ៖"}),
              e.jsx("p",{className:"text-xs text-slate-500",children:"ជំងឺកាមរោគជាជំងឺរលាកប្រដាប់បន្តពូជធ្ងន់ធ្ងរ ដែលអាចបណ្តាលឱ្យគ្មានលទ្ធភាពមានកូន និងអាចជាជំងឺឆ្លងរាលដាល ប្រសិនបើពុំបានព្យាបាលឱ្យបានជាសះស្បើយ។ កើតឡើងដោយសារការមានគូស្នេហ៍ច្រើន និងមិនបានប្រើប្រាស់ស្រោមអនាម័យ៖"}),
              e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2",children:
                Object.keys(stisData).map(k=>{
                  const d=stisData[k];
                  return e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1.5",children:[
                    e.jsxs("div",{className:"flex items-center justify-between",children:[
                      e.jsxs("span",{className:"font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5",children:[e.jsx("span",{children:d.icon}),d.title]}),
                      e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold",children:d.incubation})
                    ]}),
                    e.jsxs("p",{className:"text-[11px] text-slate-600 dark:text-slate-300",children:[e.jsx("strong",{className:"text-blue-600",children:"បុរស ៖ "}),d.men]}),
                    e.jsxs("p",{className:"text-[11px] text-slate-600 dark:text-slate-300",children:[e.jsx("strong",{className:"text-pink-600",children:"ស្ត្រី ៖ "}),d.women]}),
                    e.jsxs("p",{className:"text-[10px] text-rose-600 dark:text-rose-400 font-bold",children:[e.jsx("span",{children:"⚠️ ផលវិបាក ៖ "}),d.danger]})
                  ]},k)
                })
              })
            ]})
          ]}),

          activeTheoryPart===3&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("h3",{className:"text-sm font-bold text-rose-700 dark:text-rose-400 font-moul",children:"ផ្នែកទី ៣ ៖ ការប្រឈមនឹងមេរោគអេដស៍ និងជំងឺអេដស៍ (HIV/AIDS)"}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2",children:[
              e.jsx("h4",{className:"font-bold text-xs text-slate-900 dark:text-white",children:"១. រោគសញ្ញាទូទៅរបស់អ្នកជំងឺអេដស៍ ៖"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"• គ្រុនក្តៅ និងបែកញើសនៅពេលយប់ជាញឹកញាប់ដោយគ្មានមូលហេតុលើសពី ១ ខែ។"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"• ស្រកទម្ងន់ ១០ ភាគរយ ឬច្រើនជាងនេះធៀបទៅនឹងទម្ងន់ខ្លួន។"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"• រាករូសលើសពី ១ ខែ អស់កម្លាំងល្ហិតល្ហៃជាប្រចាំដោយគ្មានមូលហេតុ។"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"• មានរមាស់លើស្បែក និងមានផ្សិតនៅបំពង់ក។"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"• កើតជំងឺឱកាសនិយមផ្សេងៗ ដូចជា ជំងឺរបេង រលាកសួត ឡើងកូនកណ្តុរ ផ្សិតក្នុងមាត់ និងរាករូសធ្ងន់ធ្ងរ។"})
            ]}),

            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3",children:[
              e.jsx("h4",{className:"font-bold text-xs text-slate-900 dark:text-white",children:"២. តារាង ៣ ដំណាក់កាលវិវត្តនៃមេរោគអេដស៍ក្នុងរាងកាយ ៖"}),
              e.jsx("div",{className:"space-y-2.5",children:
                hivStagesData.map((st,idx)=>e.jsxs("div",{className:"p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-1.5",children:[
                  e.jsxs("div",{className:"flex items-center justify-between",children:[
                    e.jsx("span",{className:"font-bold text-xs text-slate-900 dark:text-white font-moul",children:st.stage}),
                    e.jsx("span",{className:`text-[10px] px-2.5 py-0.5 rounded-full font-bold border \${st.badgeColor}`,children:st.duration})
                  ]}),
                  e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]",children:[
                    e.jsxs("div",{children:[e.jsx("strong",{children:"រោគសញ្ញា ៖ "}),st.symptom]}),
                    e.jsxs("div",{children:[e.jsx("strong",{children:"ពិនិត្យឈាម ៖ "}),st.blood]}),
                    e.jsxs("div",{children:[e.jsx("strong",{children:"ការចម្លងរោគ ៖ "}),st.transmission]})
                  ]}),
                  e.jsxs("p",{className:"text-[10px] text-slate-500 italic pt-1 border-t border-slate-200/60 dark:border-slate-800",children:["💡 ",st.note]})
                ]},idx))
              }),
              e.jsxs("div",{className:"p-3 rounded-xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-xs text-amber-900 dark:text-amber-300 font-bold flex items-center gap-2",children:[
                e.jsx("span",{className:"text-base",children:"⚠️"}),
                "ចំណាំសំខាន់ ៖ មនុស្សដែលមានរូបរាងស្អាត ស្រស់សង្ហា មិនប្រាកដថាគ្មានមេរោគអេដស៍ឡើយ។"
              ]})
            ]})
          ]})
        ]}),

        n==="tab-lab"&&e.jsxs("div",{className:"space-y-5 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2",children:[
            e.jsx("button",{type:"button",onClick:()=>setActiveLabTool("stis"),className:`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer \${activeLabTool==="stis"?"bg-rose-600 text-white shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`,children:"🔬 ស្វែងយល់ពី ៥ ជំងឺកាមរោគ"}),
            e.jsx("button",{type:"button",onClick:()=>setActiveLabTool("hiv_stages"),className:`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer \${activeLabTool==="hiv_stages"?"bg-purple-700 text-white shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`,children:"⏱️ បន្ទាត់ពេលវេលា ៣ ដំណាក់កាលអេដស៍"})
          ]}),

          activeLabTool==="stis"&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("p",{className:"text-xs text-slate-500",children:"ចុចជ្រើសរើសជំងឺកាមរោគណាមួយ ដើម្បីស្វែងយល់ពីរោគសញ្ញាលើបុរស-ស្ត្រី និងផលវិបាក ៖"}),
            e.jsx("div",{className:"flex items-center gap-2 overflow-x-auto no-scrollbar py-1",children:
              Object.keys(stisData).map(k=>e.jsxs("button",{type:"button",onClick:()=>setSelectedSti(k),className:`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer \${selectedSti===k?"bg-rose-600 text-white shadow-md":"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"}`,children:[
                e.jsx("span",{children:stisData[k].icon}),
                stisData[k].title
              ]},k))
            }),
            (()=>{
              const cur=stisData[selectedSti];
              return e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-rose-200 dark:border-slate-700 shadow-sm space-y-4",children:[
                e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3",children:[
                  e.jsxs("h4",{className:"font-bold text-base text-slate-900 dark:text-white font-moul flex items-center gap-2",children:[e.jsx("span",{className:"text-2xl",children:cur.icon}),cur.title]}),
                  e.jsxs("span",{className:"text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full",children:["រយៈពេលសម្ងំ ៖ ",cur.incubation]})
                ]}),
                e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[
                  e.jsxs("div",{className:"p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5",children:[
                    e.jsx("h5",{className:"font-bold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1",children:"👨 រោគសញ្ញាចំពោះបុរស"}),
                    e.jsx("p",{className:"text-xs text-slate-700 dark:text-slate-300 leading-relaxed",children:cur.men})
                  ]}),
                  e.jsxs("div",{className:"p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 space-y-1.5",children:[
                    e.jsx("h5",{className:"font-bold text-xs text-pink-900 dark:text-pink-300 flex items-center gap-1",children:"👩 រោគសញ្ញាចំពោះស្ត្រី"}),
                    e.jsx("p",{className:"text-xs text-slate-700 dark:text-slate-300 leading-relaxed",children:cur.women})
                  ]})
                ]}),
                e.jsxs("div",{className:"p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-300 font-bold flex items-center gap-2",children:[
                  e.jsx("span",{className:"text-xl",children:"⚠️"}),
                  e.jsxs("span",{children:[e.jsx("strong",{children:"ផលវិបាកធ្ងន់ធ្ងរ ៖ "}),cur.danger]})
                ]}),
                e.jsxs("div",{className:"p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-300 font-bold flex items-center gap-2",children:[
                  e.jsx("span",{children:"🛡️"}),
                  "វិធីការពារចម្បង ៖ ប្រើប្រាស់ស្រោមអនាម័យពេលរួមភេទជាប់លាប់ និងស្មោះត្រង់មួយនឹងមួយ។"
                ]})
              ]});
            })()
          ]}),

          activeLabTool==="hiv_stages"&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("p",{className:"text-xs text-slate-500",children:"ចុចជ្រើសរើសដំណាក់កាលណាមួយ ដើម្បីស្វែងយល់ពីលក្ខណៈវិវត្តរបស់មេរោគអេដស៍ ៖"}),
            e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-2.5",children:
              hivStagesData.map((st,idx)=>e.jsxs("button",{type:"button",onClick:()=>setSelectedHivStage(idx),className:`p-3.5 rounded-2xl text-left border-2 transition cursor-pointer \${selectedHivStage===idx?"border-purple-600 bg-purple-50 dark:bg-purple-950/50 shadow-md":"border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"}`,children:[
                e.jsx("div",{className:"text-[10px] text-purple-700 dark:text-purple-400 font-bold uppercase",children:`ដំណាក់កាលទី \${idx+1}`}),
                e.jsx("div",{className:"font-bold text-xs text-slate-900 dark:text-white font-moul mt-0.5",children:st.stage.split("៖")[1]||st.stage}),
                e.jsx("div",{className:"text-[11px] text-slate-500 mt-1 font-semibold",children:`⏱️ \${st.duration}`})
              ]},idx))
            }),
            (()=>{
              const st=hivStagesData[selectedHivStage];
              return e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-purple-200 dark:border-slate-700 shadow-sm space-y-4",children:[
                e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3",children:[
                  e.jsx("h4",{className:"font-bold text-sm sm:text-base text-slate-900 dark:text-white font-moul",children:st.stage}),
                  e.jsx("span",{className:`text-xs px-3 py-1 rounded-full font-bold border \${st.badgeColor}`,children:st.duration})
                ]}),
                e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[
                  e.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1",children:[
                    e.jsx("div",{className:"text-xs font-bold text-slate-500",children:"រោគសញ្ញាក្នុងខ្លួន"}),
                    e.jsx("div",{className:"text-xs font-bold text-slate-900 dark:text-white leading-snug",children:st.symptom})
                  ]}),
                  e.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1",children:[
                    e.jsx("div",{className:"text-xs font-bold text-slate-500",children:"លទ្ធផលពិនិត្យឈាម"}),
                    e.jsx("div",{className:"text-xs font-bold text-slate-900 dark:text-white leading-snug",children:st.blood})
                  ]}),
                  e.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1",children:[
                    e.jsx("div",{className:"text-xs font-bold text-slate-500",children:"កម្រិតចម្លងរោគទៅអ្នកដទៃ"}),
                    e.jsx("div",{className:"text-xs font-bold text-rose-600 dark:text-rose-400 leading-snug",children:st.transmission})
                  ]})
                ]}),
                e.jsxs("div",{className:"p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 text-xs text-purple-900 dark:text-purple-300 leading-relaxed font-semibold",children:[
                  e.jsx("strong",{children:"💡 ការពន្យល់ ៖ "}),
                  st.note
                ]})
              ]});
            })()
          ]})
        ]}),

        n==="tab-quiz"&&e.jsxs("div",{className:"space-y-4 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3",children:[
            e.jsxs("div",{children:[
              e.jsxs("span",{className:"text-xs font-bold text-rose-700 dark:text-rose-400 font-moul",children:["សំណួរទី ",(currentQIndex+1)," / ៤០"]}),
              e.jsx("p",{className:"text-[11px] text-slate-500",children:"ជ្រើសរើសចម្លើយដែលត្រឹមត្រូវបំផុត"})
            ]}),
            e.jsxs("div",{className:"flex items-center gap-2",children:[
              e.jsxs("span",{className:"px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold",children:["ពិន្ទុ ៖ ",score," / ",Object.keys(userAnswers).length]}),
              e.jsx("button",{type:"button",onClick:()=>{setUserAnswers({});setIsFinished(!1);setCurrentQIndex(0);s&&s("បានចាប់ផ្តើមតេស្តឡើងវិញ");},className:"text-xs px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer",children:"🔄 ធ្វើឡើងវិញ"})
            ]})
          ]}),

          e.jsx("div",{className:"flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1",children:
            Zi9.map((_,idx)=>{
              const ans=userAnswers[idx];
              const isCurr=currentQIndex===idx;
              const isAns=ans!==undefined;
              const isCor=isAns&&Zi9[idx].opts[ans]&&Zi9[idx].opts[ans].c;
              return e.jsx("button",{type:"button",onClick:()=>setCurrentQIndex(idx),className:`shrink-0 w-7 h-7 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center justify-center \${isCurr?"ring-2 ring-rose-500 ring-offset-1 font-black":""} \${isAns?(isCor?"bg-emerald-500 text-white":"bg-rose-500 text-white"):"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`,children:(idx+1)},idx);
            })
          }),

          e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-4",children:[
            e.jsxs("h4",{className:"text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug",children:[
              e.jsxs("span",{className:"text-rose-600 font-moul mr-2",children:[`សំណួរទី \${currentQIndex+1} ៖`]}),
              q.q
            ]}),

            e.jsx("div",{className:"grid grid-cols-1 gap-2.5",children:
              q.opts.map((opt,optIdx)=>{
                const isSelected=userChoice===optIdx;
                const isAnswered=userChoice!==undefined;
                let optStyle="bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700";
                if(isAnswered){
                  if(opt.c){
                    optStyle="bg-emerald-500 text-white border-emerald-600 shadow-md font-bold";
                  }else if(isSelected){
                    optStyle="bg-rose-500 text-white border-rose-600 shadow-md font-bold";
                  }else{
                    optStyle="bg-slate-50 dark:bg-slate-900/40 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60";
                  }
                }
                const prefix=["ក. ","ខ. ","គ. ","ឃ. "][optIdx]||"";
                return e.jsxs("button",{type:"button",onClick:()=>{
                  if(userChoice!==undefined)return;
                  setUserAnswers(prev=>({...prev,[currentQIndex]:optIdx}));
                  if(opt.c){
                    s&&s("ចម្លើយត្រឹមត្រូវ! +50 XP ⭐");
                  }
                },disabled:userChoice!==undefined,className:`w-full text-left p-3.5 rounded-2xl border-2 text-xs transition-all flex items-center justify-between cursor-pointer \${optStyle}`,children:[
                  e.jsxs("span",{className:"flex items-center gap-2",children:[
                    e.jsx("span",{className:"font-bold shrink-0",children:prefix}),
                    opt.t
                  ]}),
                  isAnswered&&(opt.c?e.jsx("span",{className:"text-sm",children:"✓"}):isSelected?e.jsx("span",{className:"text-sm",children:"✕"}):null)
                ]},optIdx);
              })
            }),

            userChoice!==undefined&&e.jsxs("div",{className:`p-3.5 rounded-2xl text-xs space-y-1 animate-in fade-in duration-200 \${q.opts[userChoice]&&q.opts[userChoice].c?"bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-300":"bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-900 dark:text-rose-300"}`,children:[
              e.jsx("div",{className:"font-bold flex items-center gap-1.5",children:q.opts[userChoice]&&q.opts[userChoice].c?"🎉 ពូកែណាស់! ចម្លើយត្រឹមត្រូវ":"⚠️ មិនទាន់ត្រឹមត្រូវទេ"}),
              e.jsx("p",{className:"leading-relaxed text-[11px]",children:(q.opts.find(o=>o.c)||{}).e||"ចម្លើយត្រឹមត្រូវតាមខ្លឹមសារសៀវភៅពុម្ពវិទ្យាសាស្ត្រថ្នាក់ទី ៦។"})
            ]}),

            e.jsxs("div",{className:"flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60",children:[
              e.jsx("button",{type:"button",onClick:()=>setCurrentQIndex(prev=>Math.max(0,prev-1)),disabled:currentQIndex===0,className:"px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs transition cursor-pointer",children:"← សំណួរមុន"}),
              currentQIndex<39?
                e.jsx("button",{type:"button",onClick:()=>setCurrentQIndex(prev=>Math.min(39,prev+1)),className:"px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer",children:"សំណួរបន្ទាប់ →"}):
                e.jsxs("button",{type:"button",onClick:()=>{setIsFinished(!0);s&&s(`បញ្ចប់តេស្ត! អ្នកឆ្លើយត្រូវ \${score} / ៤០ សំណួរ`);},className:"px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md transition cursor-pointer",children:["🏆 បញ្ចប់ការប្រឡង (",score,"/៤០)"]})
            ]})
          ]}),

          isFinished&&e.jsxs("div",{className:"bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-xl space-y-3 animate-in zoom-in-95 duration-200",children:[
            e.jsx("h3",{className:"text-base font-bold font-moul",children:"🎉 លទ្ធផលការប្រឡងតេស្តមេរៀនទី ៩"}),
            e.jsxs("div",{className:"flex items-center gap-4 text-xs font-bold",children:[
              e.jsxs("span",{children:["ពិន្ទុសរុប ៖ ",score," / ៤០ (",Math.round((score/40)*100),"%)"]}),
              e.jsxs("span",{children:["រង្វាន់ XP ៖ +",score*50," XP ⭐"]})
            ]}),
            e.jsx("p",{className:"text-xs text-emerald-100",children:score>=28?"អបអរសាទរ! អ្នកបានឆ្លងកាត់ការវាស់ស្ទង់សមត្ថភាពមេរៀនទី ៩ យ៉ាងជោគជ័យ។":"សូមព្យាយាមអានមេរៀនឡើងវិញ និងធ្វើតេស្តម្តងទៀតដើម្បីពង្រឹងចំណេះដឹងបន្ថែម។"}),
            e.jsx("button",{type:"button",onClick:()=>{setIsFinished(!1);setUserAnswers({});setCurrentQIndex(0);},className:"px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 transition cursor-pointer",children:"🔄 ធ្វើតេស្តឡើងវិញ"})
          ]})
        ]})
      ]})
    ]})}
  );
};