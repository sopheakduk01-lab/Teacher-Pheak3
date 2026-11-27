const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const targetPath = path.join(__dirname, "../public/assets/index-BwPwHqBe.js");
let src = fs.readFileSync(targetPath, "utf8");

function replaceExact(needle, replacement, label) {
  const parts = src.split(needle);
  if (parts.length !== 2) {
    throw new Error(`[${label}] Expected exact 1 occurrence, found ${parts.length - 1}`);
  }
  src = parts[0] + replacement + parts[1];
  console.log(`✓ Patched: ${label}`);
}

const GUIDE_COMP_CODE = `,GuidePageComp=({teacher:r,currentYear:t,onNavigateTab:a,onOpenAdminSection:o,onOpenAccountSync:s,onOpenYearManager:ym,onOpenProfile:p,onShowToast:c})=>{
  const [cat,setCat]=y.useState("all");
  const [q,setQ]=y.useState("");
  const [doneIds,setDoneIds]=y.useState(()=>{
    try{
      const raw=localStorage.getItem("teacher_guide_checklist_v1");
      if(raw){const arr=JSON.parse(raw);if(Array.isArray(arr))return arr;}
    }catch{}
    return [];
  });
  const toggleDone=id=>{
    setDoneIds(prev=>{
      const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];
      try{localStorage.setItem("teacher_guide_checklist_v1",JSON.stringify(next));}catch{}
      return next;
    });
  };
  const resetDone=()=>{
    setDoneIds([]);
    try{localStorage.removeItem("teacher_guide_checklist_v1");}catch{}
    c&&c("បានកំណត់បញ្ជីត្រួតពិនិត្យវឌ្ឍនភាពឡើងវិញ!");
  };

  const cats=[
    {id:"all",label:"ទាំងអស់ (១២ ជំពូក)"},
    {id:"setup",label:"១. ដើមឆ្នាំ & គណនី"},
    {id:"students",label:"២. សិស្ស វត្តមាន & ពិន្ទុ"},
    {id:"teaching",label:"៣. កាលវិភាគ & បង្រៀន"},
    {id:"classroom",label:"៤. ប្លង់តុ & អនាម័យ"},
    {id:"plc",label:"៥. PLC & សាលាគំរូ"},
    {id:"print",label:"៦. ព្រីន PDF & សុវត្ថិភាព"}
  ];

  const modules=[
    {
      id:"m_profile_year",
      num:"០១",
      cat:"setup",
      catLabel:"ដើមឆ្នាំ & គណនី",
      title:"កំណត់ប្រវត្តិរូបគ្រូ សាលារៀន ថ្នាក់ និងឆ្នាំសិក្សា",
      path:"របាខាងលើ › ប្រវត្តិរូបគ្រូ & ឆ្នាំសិក្សា",
      summary:"បំពេញព័ត៌មានគ្រូបង្រៀន និងឆ្នាំសិក្សាត្រឹមត្រូវជាមុន ដើម្បីឱ្យគ្រប់ឯកសារផ្លូវការ PDF ដាក់ឈ្មោះគ្រូ នាយក សាលា និងថ្នាក់ដោយស្វ័យប្រវត្តិ។",
      steps:[
        "ចុចលើឈ្មោះគ្រូ ឬរូប Profile នៅរបាខាងលើ រួចបំពេញឈ្មោះគ្រូ លេខទូរស័ព្ទ រូបថត ឈ្មោះសាលារៀន ឈ្មោះនាយក/នាយិកា និងកម្រិតថ្នាក់ (ឧ. ថ្នាក់ទី ៥ ក)។",
        "ចុចប៊ូតុង ឆ្នាំសិក្សា នៅផ្នែកខាងលើ ដើម្បីជ្រើសរើស ឬបង្កើតឆ្នាំសិក្សាថ្មី (ឧ. ២០២៥ - ២០២៦) — ប្រព័ន្ធនឹងបំបែកទិន្នន័យសិស្ស វត្តមាន និងពិន្ទុតាមឆ្នាំនីមួយៗ។",
        "បើចង់ប្តូរពុម្ពអក្សរខ្មែរ (Kantumruy Pro, Battambang, Siemreap) ឬពណ៌ផ្ទៃខាងក្រោយ ចុច រៀបចំរូបរាង (Customize) នៅរបាចំហៀង ឬផ្នែកខាងលើ។"
      ],
      tip:"ការបំពេញឈ្មោះនាយកសាលា និងឈ្មោះសាលាឱ្យត្រឹមត្រូវតាំងពីដំបូង ជួយឱ្យតារាងកិត្តិយស ប្លង់តុ វេនអនាម័យ និងប័ណ្ណសម្គាល់ខ្លួនសិស្សចេញហត្ថលេខាត្រឹមត្រូវភ្លាម។",
      warning:"ត្រូវប្រាកដថាអ្នកបានជ្រើសឆ្នាំសិក្សាត្រឹមត្រូវមុនពេលនាំចូលបញ្ជីសិស្សថ្មី ដើម្បីកុំឱ្យច្រឡំជាមួយទិន្នន័យឆ្នាំចាស់។",
      actionLabel:"បើកប្រវត្តិរូបគ្រូ",
      onAction:()=>p&&p()
    },
    {
      id:"m_students_import",
      num:"០២",
      cat:"students",
      catLabel:"សិស្ស វត្តមាន & ពិន្ទុ",
      title:"បញ្ចូលបញ្ជីសិស្ស រូបថត និងប័ណ្ណសម្គាល់ខ្លួន (ID Cards)",
      path:"រដ្ឋបាលគ្រូ › ១. ទិន្នន័យសិស្ស & ឌីជីថល › បញ្ជី & ប្រវត្តិរូប",
      summary:"បង្កើតមូលដ្ឋានទិន្នន័យសិស្សទាំងមូលតែម្តង រួចប្រើបានគ្រប់កន្លែងដូចជា វត្តមាន ពិន្ទុ ប្លង់តុ គណៈកម្មាធិការ និងកាតសិស្ស។",
      steps:[
        "ចូល រដ្ឋបាលគ្រូ › ១. ទិន្នន័យសិស្ស & ឌីជីថល › បញ្ជី & ប្រវត្តិរូប។",
        "ចុច + បន្ថែមសិស្សថ្មី ដើម្បីបញ្ចូលម្តងម្នាក់ ឬចុច នាំចូល Excel/CSV ដើម្បីទាញបញ្ជីសិស្សរាប់សិបនាក់ចូលព្រមគ្នា (មានឈ្មោះ ភេទ ថ្ងៃកំណើត អត្តលេខ អាណាព្យាបាល និងស្ថានភាពគ្រួសារ)។",
        "បន្ថែមរូបថតសិស្សម្នាក់ៗ ដើម្បីឱ្យរូបបង្ហាញស្វ័យប្រវត្តិលើ ប័ណ្ណសម្គាល់ខ្លួន (ID Cards), ប្លង់តុសិស្ស និងតារាងកិត្តិយស។",
        "បើកផ្ទាំង ប័ណ្ណសម្គាល់ខ្លួនសិស្ស (ID Cards) ដើម្បីព្រីនកាតសិស្សដែលមាន QR Code សម្រាប់ស្កែនវត្តមាន ឬប្រើក្នុងទំព័រសិស្ស។"
      ],
      tip:"គួរបញ្ចូលព័ត៌មានស្ថានភាពពិសេសរបស់សិស្ស (ដូចជា សិស្សភ្នែកខ្សោយ ត្រូវអង្គុយជួរមុខ ឬសិស្សត្រួតថ្នាក់) ដើម្បីឱ្យប្រព័ន្ធប្លង់តុជួយរៀបចំកន្លែងអង្គុយបានសមស្រប។",
      warning:"រូបថតសិស្សគួរប្រើទំហំតូចល្មម (ប្រព័ន្ធជួយបង្រួមទំហំស្វ័យប្រវត្តិ) ដើម្បីរក្សាទុកក្នុងឧបករណ៍បានលឿន និងមិនពេញអង្គចងចាំ។",
      actionLabel:"ទៅកាន់បញ្ជីសិស្ស",
      onAction:()=>o&&o("sec1","students")
    },
    {
      id:"m_attendance_thursday",
      num:"០៣",
      cat:"students",
      catLabel:"សិស្ស វត្តមាន & ពិន្ទុ",
      title:"ស្រង់វត្តមានប្រចាំថ្ងៃ សៀវភៅតាមដាន និងរបាយការណ៍ថ្ងៃព្រហស្បតិ៍",
      path:"រដ្ឋបាលគ្រូ › ១. ទិន្នន័យសិស្ស & ឌីជីថល › ស្រង់វត្តមានសិស្ស",
      summary:"កត់ត្រាវត្តមានព្រឹក/រសៀលរហ័សទាន់ចិត្ត ហើយតភ្ជាប់ទិន្នន័យទៅសៀវភៅតាមដាន និងរបាយការណ៍ប្រចាំសប្តាហ៍ MoEYS ដោយស្វ័យប្រវត្តិ។",
      steps:[
        "បើកផ្ទាំង ស្រង់វត្តមានសិស្ស រួចជ្រើសរើសកាលបរិច្ឆេទ និងវេន (ព្រឹក ឬ រសៀល)។",
        "ចុចប៊ូតុងសម្គាល់សិស្សមករៀនជុំគ្នាទាំងអស់ រួចចុចកែតែសិស្សដែល អវត្តមានមានច្បាប់ (P), ឥតច្បាប់ (A) ឬ មកយឺត (L) ដើម្បីចំណេញពេល។",
        "ចុច រក្សាទុកវត្តមាន — ស្ថិតិអវត្តមាននឹងបង្ហាញក្នុង សៀវភៅតាមដានការសិក្សា និង របាយការណ៍ថ្ងៃព្រហស្បតិ៍ ភ្លាមៗ។"
      ],
      tip:"រាល់ថ្ងៃព្រហស្បតិ៍ គ្រូគ្រាន់តែបើកផ្ទាំង របាយការណ៍ថ្ងៃព្រហស្បតិ៍ ដើម្បីពិនិត្យតួលេខសរុប និងព្រីនបញ្ជូនជូននាយកសាលាដោយមិនបាច់បូកលេខដោយដៃឡើយ។",
      warning:"កុំភ្លេចចុចប៊ូតុង រក្សាទុកវត្តមាន ក្រោយពេលគូសធីករួចរាល់ រាល់ពេលស្រង់វត្តមានប្រចាំថ្ងៃ។",
      actionLabel:"បើកស្រង់វត្តមាន",
      onAction:()=>o&&o("sec1","attendance")
    },
    {
      id:"m_grades_honor_pri",
      num:"០៤",
      cat:"students",
      catLabel:"សិស្ស វត្តមាន & ពិន្ទុ",
      title:"បញ្ចូលពិន្ទុប្រចាំខែ/ឆមាស តារាងកិត្តិយស និងស្ថិតិ PRI",
      path:"រដ្ឋបាលគ្រូ › ១. ទិន្នន័យសិស្ស & ឌីជីថល › ពិន្ទុ & និទ្ទេស",
      summary:"គណនាពិន្ទុសរុប មធ្យមភាគ ចំណាត់ថ្នាក់ និទ្ទេស A–F និងបង្កើតតារាងកិត្តិយសសិស្សឆ្នើមព្រមទាំងស្ថិតិ PRI តាមស្តង់ដាក្រសួង។",
      steps:[
        "ចូលផ្ទាំង ពិន្ទុ & និទ្ទេស ជ្រើសរើសខែ (តុលា–កក្កដា) ឬឆមាសទី ១ / ទី ២ និងកំណត់មុខវិជ្ជារងសកម្មតាមថ្នាក់របស់អ្នក។",
        "បំពេញពិន្ទុសិស្សតាមមុខវិជ្ជានីមួយៗ — ប្រព័ន្ធនឹងគណនាមធ្យមភាគ ចំណាត់ថ្នាក់ និងនិទ្ទេស A, B, C, D, E, F ស្វ័យប្រវត្តិ។",
        "ចុចផ្ទាំង តារាងកិត្តិយស (ឆ្នើម MoEYS) ដើម្បីទទួលបានតារាងសិស្សពូកែលេខ ១ ដល់ ៥ មានរូបថតស្អាតសម្រាប់ព្រីនជូនសិស្ស និងអាណាព្យាបាល។",
        "ចុចផ្ទាំង ស្ថិតិ PRI និង PLP MoEYS Portal ដើម្បីមើលសមាមាត្រសិស្ស សិស្សជាប់/ធ្លាក់ និងស្ថិតិអប់រំផ្លូវការ។"
      ],
      tip:"អ្នកអាចកែលក្ខខណ្ឌកម្រិតពិន្ទុនិទ្ទេស (ឧ. A >= 8.50) នៅក្នុងការកំណត់ពិន្ទុឱ្យត្រូវតាមការណែនាំរបស់សាលារៀន។",
      warning:"ក្រោយបញ្ចូលពិន្ទុប្រចាំខែរួច គួរទាញយក Backup (.json) ទុកម្តង ដើម្បីការពារការបាត់បង់ទិន្នន័យសំខាន់។",
      actionLabel:"បើកតារាងពិន្ទុ",
      onAction:()=>o&&o("sec1","grades")
    },
    {
      id:"m_timetable_syllabus",
      num:"០៥",
      cat:"teaching",
      catLabel:"ការបង្រៀន & គរុកោសល្យ",
      title:"រៀបចំកាលវិភាគបង្រៀនពណ៌ស្អាត និងកម្មវិធីសិក្សាប្រចាំឆ្នាំ",
      path:"រដ្ឋបាលគ្រូ › ២. ការបង្រៀន & គរុកោសល្យ › កាលវិភាគបង្រៀន",
      summary:"កំណត់ម៉ោងសិក្សា ចន្ទ–សៅរ៍ ព្រឹក/រសៀល ជាមួយពណ៌សម្គាល់តាមមុខវិជ្ជាច្បាស់លាស់ និងព្រីនបិទជញ្ជាំងថ្នាក់យ៉ាងស្អាត។",
      steps:[
        "ចូល រដ្ឋបាលគ្រូ › ២. ការបង្រៀន & គរុកោសល្យ › កាលវិភាគបង្រៀន។",
        "ពិនិត្យមុខវិជ្ជាតាមម៉ោងសិក្សា ចន្ទ ដល់ សៅរ៍ — ប្រព័ន្ធដាក់ពណ៌ផ្សេងៗគ្នាតាមមុខវិជ្ជា (ភាសាខ្មែរ គណិតវិទ្យា វិទ្យាសាស្ត្រ សិក្សាសង្គម អង់គ្លេស អប់រំកាយ) ដើម្បីងាយមើលទាំងគ្រូ និងសិស្ស។",
        "កែសម្រួលម៉ោង ឬមុខវិជ្ជាតាមកាលវិភាគជាក់ស្តែងរបស់ថ្នាក់ រួចចុច ព្រីន / PDF (ត្រូវបើក Background graphics ពេល Save PDF ដើម្បីឱ្យចេញពណ៌ស្អាត)។",
        "បន្តចូល កម្មវិធីប្រចាំឆ្នាំ/ត្រីមាស ដើម្បីតាមដានផែនការបង្រៀនប្រចាំខែ និងមេរៀនដែលត្រូវបញ្ចប់។"
      ],
      tip:"ពេលព្រីនកាលវិភាគ សូមជ្រើសក្រដាស A4 ផ្តេក (Landscape) ដើម្បីឱ្យតារាងម៉ោងសិក្សាចន្ទ–សៅរ៍ទូលាយ និងអានច្បាស់ពីចម្ងាយ។",
      warning:"បើព្រីនចេញពណ៌ស-ខ្មៅ សូមពិនិត្យមើលធីក Background graphics នៅក្នុងផ្ទាំង Print dialog របស់ Browser។",
      actionLabel:"បើកកាលវិភាគបង្រៀន",
      onAction:()=>o&&o("sec2","timetable")
    },
    {
      id:"m_lessonplan_quiz",
      num:"០៦",
      cat:"teaching",
      catLabel:"ការបង្រៀន & គរុកោសល្យ",
      title:"កិច្ចតែងការបង្រៀន, Logbook, ស្លាយ និងប្រឡងអន្តរកម្ម (PIN/QR)",
      path:"រដ្ឋបាលគ្រូ › ២. ការបង្រៀន & គរុកោសល្យ › កិច្ចតែងការបង្រៀន",
      summary:"រៀបចំកិច្ចតែងការបង្រៀន ៥ ជំហាន កត់ត្រាវឌ្ឍនភាពក្នុង Logbook និងបង្កើតតេស្ត/ល្បែងសិក្សាសម្រាប់សិស្សលេងក្នុងថ្នាក់។",
      steps:[
        "ចូល កិច្ចតែងការបង្រៀន ជ្រើសមុខវិជ្ជា និងមេរៀន រួចពិនិត្យឬកែសម្រួលវត្ថុបំណង សម្ភារៈឧបទេស និងជំហានបង្រៀនទាំង ៥។",
        "ក្រោយបង្រៀនរាល់ថ្ងៃ សូមកត់ត្រាខ្លឹមសារមេរៀន និងការឆ្លុះបញ្ចាំងក្នុង Logbook និងប្រើ ស្លាយបង្រៀន ដើម្បីបង្ហាញលើអេក្រង់/Projector។",
        "ប្រើមុខងារ បង្កើតសំណួរប្រឡង នៅរបាខាងឆ្វេង ដើម្បីបង្កើតតេស្ត QCM ឬបើកល្បែងសិក្សាអន្តរកម្ម និងបង្ហាញ Game PIN / QR ឱ្យសិស្សចូលប្រកួតភ្លាមៗ។"
      ],
      tip:"គ្រូអាចប្រើសន្លឹកវាយតម្លៃ (Rubrics) ក្នុងផ្នែកទី ២ ដើម្បីដាក់ពិន្ទុគម្រោង ឬការធ្វើបទបង្ហាញរបស់ក្រុមសិស្សបានយ៉ាងសុក្រឹត។",
      warning:"មុនបើក Live Quiz ក្នុងថ្នាក់ សូមផ្ទៀងផ្ទាត់សំណួរ និងចម្លើយត្រឹមត្រូវឱ្យបានច្បាស់លាស់ជាមុន។",
      actionLabel:"បើកកិច្ចតែងការ",
      onAction:()=>o&&o("sec2","lessonplan")
    },
    {
      id:"m_seating_onepage",
      num:"០៧",
      cat:"classroom",
      catLabel:"ប្លង់តុ & អនាម័យ",
      title:"រៀបចំប្លង់តុសិស្ស & កន្លែងអង្គុយ (ព្រីន PDF តែ ១ ទំព័រស្អាត)",
      path:"រដ្ឋបាលគ្រូ › ៣. ការរៀបចំថ្នាក់ & សម្ភារៈ › ប្លង់តុសិស្ស & កន្លែងអង្គុយ",
      summary:"រៀបចំទីតាំងកៅអីសិស្សតាមជួរ និងចំនួនសិស្សក្នុង ១ តុ ដោយគិតពីតម្រូវការពិសេស រួចព្រីនចេញជា PDF តែ ១ ទំព័រ A4 ផ្តេកគត់។",
      steps:[
        "ចូល រដ្ឋបាលគ្រូ › ៣. ការរៀបចំថ្នាក់ & សម្ភារៈ › ប្លង់តុសិស្ស & កន្លែងអង្គុយ។",
        "កំណត់ចំនួនជួរតុ ចំនួនតុក្នុង ១ ជួរ និងចំនួនសិស្សក្នុង ១ តុ ឱ្យត្រូវតាមទំហំបន្ទប់រៀនជាក់ស្តែង។",
        "ប្រើប៊ូតុង រៀបចំប្លង់តុស្វ័យប្រវត្តិ (ឆ្លាតវៃ) ដើម្បីដាក់សិស្សភ្នែកខ្សោយឬមានតម្រូវការពិសេសនៅជួរមុខ ឬចុចប្តូរទីតាំងសិស្សម្នាក់ៗដោយផ្ទាល់។",
        "ចុចប៊ូតុង ព្រីន / PDF — ប្រព័ន្ធនឹងគណនាខ្នាតស្វ័យប្រវត្តិ (Auto-Fit Scale) ឱ្យប្លង់តុទាំងមូល ក្បាលសៀវភៅ និងហត្ថលេខាស្ថិតនៅក្នុង ១ ទំព័រ A4 ផ្តេកតែមួយគត់ មិនហៀរទំព័រទី ២ ឡើយ។"
      ],
      tip:"គួរប្តូរទីតាំងប្លង់តុសិស្សរៀងរាល់ ១ ឬ ២ ខែម្តង ដើម្បីឱ្យសិស្សមានឱកាសសហការរៀនសូត្រជាមួយមិត្តភក្តិថ្មីៗ និងផ្លាស់ប្តូរមុំមើលក្តារខៀន។",
      warning:"នៅក្នុងផ្ទាំង Print របស់ Browser សូមរក្សា Margins ជា None ឬ Default និង Scale ជា 100% ព្រោះប្រព័ន្ធបានបង្រួមឱ្យត្រូវ ១ ទំព័ររួចជាស្រេច។",
      actionLabel:"បើកប្លង់តុសិស្ស",
      onAction:()=>o&&o("sec3","seating")
    },
    {
      id:"m_sanitation_monthly",
      num:"០៨",
      cat:"classroom",
      catLabel:"ប្លង់តុ & អនាម័យ",
      title:"គណៈកម្មាធិការ & វេនអនាម័យប្រចាំសប្តាហ៍ (ដូរសកម្មភាព ១ ខែម្តង)",
      path:"រដ្ឋបាលគ្រូ › ៣. ការរៀបចំថ្នាក់ & សម្ភារៈ › តារាងគណៈកម្មាធិការ និងវេនអនាម័យ",
      summary:"អនុសាខានីមួយៗ (ទី ១ ដល់ ទី ៦) ដឹកនាំសកម្មភាពប្រចាំថ្ងៃដដែលពេញ ១ ខែ (ចន្ទ–សៅរ៍) ដោយមិនឆ្លាស់វេនរាល់ថ្ងៃ ហើយប្តូរសកម្មភាពគ្នា ១ ខែម្តង។",
      steps:[
        "ចូល រដ្ឋបាលគ្រូ › ៣. ការរៀបចំថ្នាក់ & សម្ភារៈ › តារាងគណៈកម្មាធិការ និងវេនអនាម័យប្រចាំសប្តាហ៍។",
        "កំណត់ឈ្មោះសិស្សប្រធាន អនុប្រធាន និងសមាជិកក្នុងអនុសាខាទាំង ៦ (អនុសាខាទី ១ ដល់ អនុសាខាទី ៦)។",
        "ពិនិត្យតារាងប្រចាំសប្តាហ៍៖ អនុសាខានីមួយៗទទួលបន្ទុកសកម្មភាពប្រចាំថ្ងៃរបស់ខ្លួនជាប់រហូតពីថ្ងៃចន្ទ ដល់ថ្ងៃសៅរ៍ ពេញ ១ ខែ (មិនបាច់ប្តូររាល់ថ្ងៃទេ ដើម្បីឱ្យសិស្សទម្លាប់ល្អ និងស្ទាត់ជំនាញ)។",
        "រៀងរាល់ដើមខែថ្មី គ្រូគ្រាន់តែជ្រើស ខែទី ១ ដល់ ៦ ឬចុចប៊ូតុង 🔄 ដូរសកម្មភាពខែបន្ទាប់ នោះប្រព័ន្ធនឹងបង្វិលសកម្មភាពទាំង ៦ ជូនអនុសាខានីមួយៗដោយស្វ័យប្រវត្តិ រួចចុចព្រីនបិទលើក្តារព័ត៌មាន។"
      ],
      tip:"ការដូរសកម្មភាព ១ ខែម្តងជួយឱ្យប្រធានអនុសាខានីមួយៗងាយតាមដានសមាជិក និងមានភាពជាម្ចាស់ការលើផ្នែករបស់ខ្លួនពេញមួយខែ។",
      warning:"កុំភ្លេចចុច រក្សាទុក បន្ទាប់ពីប្តូរខែវេនអនាម័យ ឬប្តូរឈ្មោះសិស្សក្នុងអនុសាខា។",
      actionLabel:"បើកតារាងវេនអនាម័យ",
      onAction:()=>o&&o("sec3","sanitation_committee")
    },
    {
      id:"m_rules_inventory",
      num:"០៩",
      cat:"classroom",
      catLabel:"ប្លង់តុ & អនាម័យ",
      title:"បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន & បញ្ជីសារពើភណ្ឌសម្ភារៈ (ពណ៌ផ្លូវការ)",
      path:"រដ្ឋបាលគ្រូ › ៣. ការរៀបចំថ្នាក់ & សម្ភារៈ › បទបញ្ជា & សារពើភណ្ឌ",
      summary:"កំណត់វិន័យរួមក្នុងថ្នាក់ និងគ្រប់គ្រងចំនួនតុ កៅអី សម្ភារៈឧបទេសជាមួយគុណភាពល្អ/ខូច ព្រីនចេញជាពណ៌ច្បាស់ស្អាត។",
      steps:[
        "ចូលផ្ទាំង បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន ដើម្បីពិនិត្យ កែប្រែ ឬបន្ថែមចំណុចបទបញ្ជាដែលសិស្សបានព្រមព្រៀងគ្នានៅដើមឆ្នាំ។",
        "ចុចព្រីនបទបញ្ជាផ្ទៃក្នុងជាផ្ទាំងពណ៌ស្អាត ដើម្បីដាក់បង្ហាញនៅទីកន្លែងដែលសិស្សងាយមើលឃើញរាល់ថ្ងៃ។",
        "បើកផ្ទាំង សារពើភណ្ឌថ្នាក់រៀន ដើម្បីកត់ត្រាសម្ភារៈទាំងអស់ក្នុងបន្ទប់ (តុគ្រូ តុសិស្ស ក្តារខៀន ទូ សៀវភៅ កង្ហារ) ព្រមទាំងស្ថានភាព (ល្អ / មធ្យម / ខូច)។",
        "ធ្វើបច្ចុប្បន្នភាពសារពើភណ្ឌនៅដើមឆ្នាំ និងចុងឆ្នាំសិក្សា រួចព្រីនរបាយការណ៍ពណ៌ផ្លូវការប្រគល់ជូនគណៈគ្រប់គ្រងសាលា។"
      ],
      tip:"ដាក់ស្លាកលេខសម្ភារៈឱ្យត្រូវតាមបញ្ជីសារពើភណ្ឌ និងត្រួតពិនិត្យជាមួយគណៈកម្មការថ្នាក់រៀងរាល់ចុងខែ។",
      warning:"រាល់សម្ភារៈខូចខាតគួរកត់ចំណាំក្នុងប្រអប់ផ្សេងៗ ដើម្បីស្នើសុំជួសជុលឬប្តូរថ្មីទាន់ពេល។",
      actionLabel:"បើកបទបញ្ជា & សារពើភណ្ឌ",
      onAction:()=>o&&o("sec3","rules")
    },
    {
      id:"m_plc_model_school",
      num:"១០",
      cat:"plc",
      catLabel:"PLC & សាលាគំរូ",
      title:"កំណត់ហេតុ PLC, ស្វ័យសិក្សា និងស្តង់ដាសាលាគំរូ ៥ (ប្រកាស ១២៦៩)",
      path:"រដ្ឋបាលគ្រូ › ៤. PLC & ស្វ័យសិក្សា",
      summary:"កត់ត្រាការប្រជុំសហគមន៍សិក្សាវិជ្ជាជីវៈ (PLC) តាមដាន CPD Credits និងវាយតម្លៃស្តង់ដាសាលារៀនគំរូទាំង ៥។",
      steps:[
        "ចូល រដ្ឋបាលគ្រូ › ៤. PLC & ស្វ័យសិក្សា › កំណត់ហេតុ PLC ដើម្បីបង្កើតកំណត់ហេតុប្រជុំក្រុមបច្ចេកទេសប្រចាំខែ (ប្រធានបទ ចំណុចខ្លាំង បញ្ហាប្រឈម និងដំណោះស្រាយ)។",
        "ប្រើផ្ទាំង ស្វ័យសិក្សា (គ្រូបឋម MoEYS) និង CPD Credits ដើម្បីកត់ត្រាម៉ោងបណ្តុះបណ្តាលវិជ្ជាជីវៈបន្តរបស់គ្រូ។",
        "បើក ស្តង់ដាសាលាគំរូ ៥ (ប្រកាស ១២៦៩) ដើម្បីត្រួតពិនិត្យលក្ខណៈវិនិច្ឆ័យផ្នែកបង្រៀន បរិស្ថានសិក្សា និងការចូលរួមរបស់សហគមន៍។",
        "ប្រើ កិច្ចព្រមព្រៀង & ទំនាក់ទំនងមាតាបិតា ដើម្បីរៀបចំលិខិតរដ្ឋបាល និងទំនាក់ទំនងអាណាព្យាបាលសិស្សតាម Telegram។"
      ],
      tip:"រក្សាកំណត់ហេតុ PLC ឱ្យបានទៀងទាត់រៀងរាល់ខែ ព្រោះជាភស្តុតាងសំខាន់សម្រាប់ការវាយតម្លៃសាលារៀនគំរូ និង CPD របស់គ្រូ។",
      warning:"គួរភ្ជាប់ខ្លឹមសារកែលម្អពី PLC ទៅអនុវត្តផ្ទាល់ក្នុងកិច្ចតែងការបង្រៀនសប្តាហ៍បន្ទាប់។",
      actionLabel:"បើកផ្នែក PLC",
      onAction:()=>o&&o("sec4","plc")
    },
    {
      id:"m_pdf_print_settings",
      num:"១១",
      cat:"print",
      catLabel:"ព្រីន PDF & សុវត្ថិភាព",
      title:"វិធីកំណត់ Browser & Printer ឱ្យព្រីន PDF ចេញពណ៌ស្អាត និងមិនដាច់ទំព័រ",
      path:"គ្រប់ប៊ូតុង ព្រីន / ទាញយក PDF",
      summary:"ការកំណត់សាមញ្ញ ៣ ចំណុចនៅពេលព្រីន ដើម្បីឱ្យកាលវិភាគ បទបញ្ជា សារពើភណ្ឌ ប្លង់តុ និងតារាងកិត្តិយសចេញពណ៌ពេញលេញល្អឥតខ្ចោះ។",
      steps:[
        "អនុញ្ញាតផ្ទាំង Pop-up៖ បើចុចព្រីនហើយមិនឃើញផ្ទាំង Print លោតឡើង សូមចុចរូបសញ្ញា Pop-up blocked នៅខាងស្តាំរបាអាសយដ្ឋាន Browser រួចជ្រើស Always allow pop-ups។",
        "បើកពណ៌ផ្ទៃខាងក្រោយ៖ ក្នុងផ្ទាំង Print របស់ Chrome/Edge ចុច More settings › ធីកលើពាក្យ Background graphics (សំខាន់បំផុត ដើម្បីឱ្យក្បាលតារាង ពណ៌កាលវិភាគ និងស៊ុមចេញពណ៌)។",
        "កំណត់ក្រដាស & ខ្នាត៖ ប្រើ Paper size = A4, Margins = None ឬ Default, Scale = Default (100%) — ចំពោះប្លង់តុសិស្ស ប្រព័ន្ធកំណត់ A4 ផ្តេក ១ ទំព័រស្វ័យប្រវត្តិ។"
      ],
      tip:"បើចង់រក្សាទុកផ្ញើតាម Telegram មុនពេលព្រីន សូមជ្រើស Destination ជា Save as PDF ជាមុនសិន ដើម្បីផ្ទៀងផ្ទាត់ទម្រង់លើអេក្រង់។",
      warning:"បើមិនធីក Background graphics ទេ ពណ៌ក្បាលតារាង និងកាលវិភាគនឹងក្លាយជាពណ៌ស-ខ្មៅនៅលើក្រដាស PDF។",
      actionLabel:"សាកល្បងព្រីនការណែនាំនេះ",
      onAction:()=>printGuidePdf()
    },
    {
      id:"m_backup_restore",
      num:"១២",
      cat:"print",
      catLabel:"ព្រីន PDF & សុវត្ថិភាព",
      title:"ការបម្រុងទុកទិន្នន័យ (Backup .json) និងការផ្ទេរឆ្លងឧបករណ៍",
      path:"រដ្ឋបាលគ្រូ › Backup / Share (.json) ឬ របាចំហៀង › Backup",
      summary:"ការពារទិន្នន័យសិស្ស ពិន្ទុ វត្តមាន កិច្ចតែងការ និងប្លង់តុទាំងអស់កុំឱ្យបាត់បង់ពេលលាង Browser ឬផ្លាស់ប្តូរកុំព្យូទ័រ/ទូរស័ព្ទថ្មី។",
      steps:[
        "រៀងរាល់ចុងសប្តាហ៍ ឬក្រោយបញ្ចូលទិន្នន័យច្រើន ចុចប៊ូតុង Backup / Share (.json) នៅផ្នែកខាងលើនៃរដ្ឋបាលគ្រូ ដើម្បីទាញយកឯកសារ .json រក្សាទុក។",
        "ផ្ញើឯកសារ .json នោះចូល Saved Messages ក្នុង Telegram ឬ Google Drive ផ្ទាល់ខ្លួនរបស់គ្រូដើម្បីសុវត្ថិភាពខ្ពស់។",
        "ពេលបើកកម្មវិធីលើកុំព្យូទ័រ ឬទូរស័ព្ទថ្មី ចុច Cloud Sync / Backup នៅរបាចំហៀង រួចជ្រើស Restore ពីឯកសារ .json នោះ ទិន្នន័យទាំងអស់នឹងត្រឡប់មកវិញ ១០០%។"
      ],
      tip:"គួរដាក់ឈ្មោះ ឬរក្សាទុកឯកសារ Backup តាមខែ (ឧ. ចុងខែវិច្ឆិកា ចុងខែធ្នូ) ដើម្បីងាយស្រួលទាញយកមកវិញគ្រប់ពេល។",
      warning:"កុំលុប Browser site data / cache ដោយមិនទាន់បានទាញយកឯកសារ Backup (.json) ទុកជាមុនឡើយ។",
      actionLabel:"បើក Backup & Cloud Sync",
      onAction:()=>s&&s()
    }
  ];

  const schoolName=(r&&r.school)||"សាលាបឋមសិក្សា";
  const teacherName=(r&&r.name)||"លោកគ្រូ / អ្នកគ្រូ";
  const gradeName=(r&&r.grade)||"ថ្នាក់រៀន";
  const yearLabel=t||(r&&r.academicYear)||"២០២៥ - ២០២៦";

  const filtered=modules.filter(m=>{
    const okCat=cat==="all"||m.cat===cat;
    if(!okCat)return !1;
    const term=q.trim().toLowerCase();
    if(!term)return !0;
    const blob=[m.title,m.catLabel,m.path,m.summary,m.tip,m.warning,...m.steps].join(" ").toLowerCase();
    return blob.includes(term);
  });

  const printGuidePdf=()=>{
    const w=window.open("","_blank");
    if(!w){c&&c("សូមអនុញ្ញាត Pop-up នៅក្នុង Browser ដើម្បីព្រីនសៀវភៅណែនាំ!");return;}
    const listHtml=filtered.map(m=>\`
      <div class="mod">
        <div class="mod-head">
          <span class="mod-num">\${m.num}</span>
          <div>
            <div class="mod-title">\${m.title}</div>
            <div class="mod-path">\${m.catLabel} · \${m.path}</div>
          </div>
        </div>
        <p class="mod-sum">\${m.summary}</p>
        <ol class="steps">\${m.steps.map(st=>\`<li>\${st}</li>\`).join("")}</ol>
        <div class="notes">
          <div><strong>គន្លឹះអនុវត្ត៖</strong> \${m.tip}</div>
          <div><strong>ចំណាំសំខាន់៖</strong> \${m.warning}</div>
        </div>
      </div>
    \`).join("");
    w.document.write(\`<!DOCTYPE html><html lang="km"><head><meta charset="utf-8"/><title>សៀវភៅណែនាំអនុវត្តលម្អិត</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Moul&display=swap');
      @page{size:A4 portrait;margin:14mm;}
      *{box-sizing:border-box;}
      body{font-family:'Kantumruy Pro',sans-serif;color:#0f172a;margin:0;font-size:11px;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .hdr{border-bottom:2px solid #1e3a8a;padding-bottom:10px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-end;gap:12px;}
      .hdr h1{font-family:'Moul',serif;font-size:15px;color:#1e3a8a;margin:0 0 4px 0;}
      .hdr .meta{font-size:10.5px;color:#475569;}
      .mod{border:1px solid #cbd5e1;border-radius:10px;padding:11px 13px;margin-bottom:11px;break-inside:avoid;background:#fff;}
      .mod-head{display:flex;align-items:flex-start;gap:9px;margin-bottom:6px;}
      .mod-num{background:#1e3a8a;color:#fff;font-weight:800;font-size:11px;padding:3px 7px;border-radius:6px;flex-shrink:0;}
      .mod-title{font-weight:800;font-size:12.5px;color:#0f172a;}
      .mod-path{font-size:10px;color:#475569;}
      .mod-sum{margin:0 0 6px 0;color:#334155;}
      .steps{margin:0 0 7px 0;padding-left:18px;}
      .steps li{margin-bottom:3px;}
      .notes{background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:6px 9px;font-size:10.5px;color:#334155;display:grid;gap:3px;}
    </style></head><body>
    <div class="hdr">
      <div>
        <h1>សៀវភៅណែនាំអនុវត្តលម្អិត — រដ្ឋបាលគ្រូបឋមសិក្សា</h1>
        <div class="meta">គ្រូបង្រៀន៖ \${teacherName} · \${schoolName} · \${gradeName} · ឆ្នាំសិក្សា \${yearLabel}</div>
      </div>
      <div class="meta">ចំនួនជំពូក៖ \${filtered.length}</div>
    </div>
    \${listHtml}
    <script>window.onload=function(){setTimeout(function(){window.print();},350);};<\/script>
    </body></html>\`);
    w.document.close();
  };

  const progressPct=Math.round((doneIds.length/modules.length)*100);

  return e.jsxs("div",{className:"max-w-6xl mx-auto space-y-6 pb-16",children:[
    /* Header Banner */
    e.jsxs("section",{className:"bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5",children:[
      e.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5",children:[
        e.jsxs("div",{className:"space-y-2 max-w-3xl",children:[
          e.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold",children:[
            e.jsx("span",{children:"មគ្គុទ្ទេសក៍ប្រើប្រាស់ប្រព័ន្ធ"}),
            e.jsx("span",{"aria-hidden":"true",children:"·"}),
            e.jsx("span",{children:schoolName}),
            e.jsx("span",{"aria-hidden":"true",children:"·"}),
            e.jsx("span",{children:gradeName}),
            e.jsx("span",{"aria-hidden":"true",children:"·"}),
            e.jsxs("span",{children:["ឆ្នាំសិក្សា ",yearLabel]})
          ]}),
          e.jsx("h1",{className:"text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white font-moul leading-snug",children:"សៀវភៅណែនាំអនុវត្តលម្អិត"}),
          e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-300 leading-relaxed",children:"ការណែនាំតាមលំដាប់ជំហានច្បាស់លាស់ សម្រាប់គ្រូបង្រៀនអនុវត្តប្រចាំថ្ងៃ សប្តាហ៍ និងប្រចាំខែ ពីការបញ្ចូលទិន្នន័យសិស្ស រហូតដល់ការព្រីនឯកសាររដ្ឋបាលផ្លូវការជា PDF ស្អាតៗ។"})
        ]}),
        e.jsxs("div",{className:"flex flex-wrap items-center gap-2.5 shrink-0",children:[
          e.jsxs("button",{type:"button",onClick:printGuidePdf,className:"px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap",children:[
            e.jsx(Rx,{className:"w-4 h-4"}),
            e.jsx("span",{children:"ព្រីនសៀវភៅណែនាំ (A4)"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>a&&a("admin"),className:"px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap",children:[
            e.jsx("span",{children:"ទៅកាន់រដ្ឋបាលទាំង ៤"}),
            e.jsx(Ps,{className:"w-4 h-4"})
          ]})
        ]})
      ]}),

      /* Checklist Progress */
      e.jsxs("div",{className:"pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[
        e.jsxs("div",{className:"flex-1 space-y-1.5",children:[
          e.jsxs("div",{className:"flex items-center justify-between text-xs font-semibold",children:[
            e.jsxs("span",{className:"text-slate-700 dark:text-slate-200",children:["វឌ្ឍនភាពនៃការអនុវត្តតាមជំពូក (គ្រូ៖ ",teacherName,")"]}),
            e.jsxs("span",{className:"tabular-nums text-sky-700 dark:text-sky-400 font-bold",children:[doneIds.length," / ",modules.length," ជំពូក (",progressPct,"%)"]})
          ]}),
          e.jsx("div",{className:"w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden",children:
            e.jsx("div",{className:"h-full rounded-full bg-sky-600 transition-all duration-300",style:{width:\`\${progressPct}%\`}})
          })
        ]}),
        doneIds.length>0&&e.jsx("button",{type:"button",onClick:resetDone,className:"px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shrink-0",children:"កំណត់ឡើងវិញ"})
      ]})
    ]}),

    /* Search & Category Filters */
    e.jsxs("section",{className:"bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3.5",children:[
      e.jsxs("div",{className:"relative",children:[
        e.jsx(py,{className:"w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"}),
        e.jsx("input",{
          type:"text",
          value:q,
          onChange:ev=>setQ(ev.target.value),
          placeholder:"ស្វែងរកការណែនាំ... (ឧ. ប្លង់តុ ១ ទំព័រ, វេនអនាម័យ, កាលវិភាគ, Excel, Backup, PDF)",
          className:"w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
        }),
        q&&e.jsx("button",{type:"button",onClick:()=>setQ(""),className:"absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-300 cursor-pointer",children:"សម្អាត"})
      ]}),
      e.jsx("div",{className:"flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar",children:
        cats.map(ct=>{
          const act=cat===ct.id;
          return e.jsx("button",{
            type:"button",
            onClick:()=>setCat(ct.id),
            className:\`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer \${act?"bg-sky-600 text-white shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}\`,
            children:ct.label
          },ct.id);
        })
      })
    ]}),

    /* Operational Cadence Overview when viewing All without search */
    cat==="all"&&!q.trim()&&e.jsxs("section",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5",children:[
      [
        {k:"ប្រចាំថ្ងៃ (Daily)",t:"ស្រង់វត្តមានព្រឹក/រសៀល & Logbook",d:"គូសធីកវត្តមានក្នុង ១ នាទី និងកត់ត្រាការបង្រៀនតាមកាលវិភាគ។",onClick:()=>setCat("students")},
        {k:"ប្រចាំសប្តាហ៍ (Weekly)",t:"របាយការណ៍ថ្ងៃព្រហស្បតិ៍ & Backup",d:"ទាញរបាយការណ៍អវត្តមានថ្ងៃព្រហស្បតិ៍ និងទាញទុក Backup (.json)។",onClick:()=>setCat("print")},
        {k:"ប្រចាំខែ (Monthly)",t:"ពិន្ទុប្រចាំខែ & ដូរវេនអនាម័យ",d:"បញ្ចូលពិន្ទុ ចេញតារាងកិត្តិយស និងបង្វិលសកម្មភាពអនុសាខា ១–៦។",onClick:()=>setCat("classroom")},
        {k:"ដើមឆ្នាំ & ចុងឆ្នាំ",t:"បញ្ជីសិស្ស ប្លង់តុ & សារពើភណ្ឌ",d:"នាំចូលសិស្ស Excel រៀបប្លង់តុ ១ ទំព័រ បទបញ្ជា និងកត់សារពើភណ្ឌ។",onClick:()=>setCat("setup")}
      ].map((card,idx)=>e.jsxs("button",{
        type:"button",
        onClick:card.onClick,
        className:"text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:border-sky-400 dark:hover:border-sky-600 transition shadow-2xs cursor-pointer space-y-1.5",
        children:[
          e.jsx("div",{className:"text-xs font-bold text-sky-700 dark:text-sky-400",children:card.k}),
          e.jsx("div",{className:"text-sm font-bold text-slate-900 dark:text-white leading-snug",children:card.t}),
          e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-400 leading-relaxed",children:card.d})
        ]
      },idx))
    ]}),

    /* Modules List */
    filtered.length===0?e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-3",children:[
      e.jsx("p",{className:"text-sm font-bold text-slate-700 dark:text-slate-200",children:"រកមិនឃើញខ្លឹមសារដែលត្រូវនឹងពាក្យស្វែងរកនេះទេ។"}),
      e.jsx("button",{type:"button",onClick:()=>{setQ("");setCat("all");},className:"px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold cursor-pointer",children:"បង្ហាញជំពូកទាំងអស់"})
    ]}):e.jsx("div",{className:"space-y-4",children:
      filtered.map(m=>{
        const isDone=doneIds.includes(m.id);
        return e.jsxs("article",{
          className:\`bg-white dark:bg-slate-900 rounded-2xl border transition p-5 sm:p-6 shadow-xs space-y-4 \${isDone?"border-emerald-300 dark:border-emerald-700/70":"border-slate-200 dark:border-slate-800"}\`,
          children:[
            /* Module Header */
            e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-start justify-between gap-3",children:[
              e.jsxs("div",{className:"flex items-start gap-3.5 min-w-0",children:[
                e.jsx("div",{className:\`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm tabular-nums shrink-0 \${isDone?"bg-emerald-600 text-white":"bg-slate-900 dark:bg-slate-800 text-white"}\`,children:m.num}),
                e.jsxs("div",{className:"space-y-1 min-w-0",children:[
                  e.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400",children:[
                    e.jsx("span",{className:"font-semibold text-sky-700 dark:text-sky-400",children:m.catLabel}),
                    e.jsx("span",{"aria-hidden":"true",children:"·"}),
                    e.jsx("span",{children:m.path})
                  ]}),
                  e.jsx("h2",{className:"text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug",children:m.title})
                ]})
              ]}),
              e.jsxs("div",{className:"flex items-center gap-2 shrink-0",children:[
                e.jsxs("button",{
                  type:"button",
                  onClick:()=>toggleDone(m.id),
                  className:\`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap \${isDone?"bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300":"bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"}\`,
                  children:[
                    e.jsx(hs,{className:"w-4 h-4"}),
                    e.jsx("span",{children:isDone?"បានអនុវត្តរួច":"ធីករួចរាល់"})
                  ]
                }),
                e.jsxs("button",{
                  type:"button",
                  onClick:m.onAction,
                  className:"px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                  children:[
                    e.jsx("span",{children:m.actionLabel}),
                    e.jsx(Ps,{className:"w-3.5 h-3.5"})
                  ]
                })
              ]})
            ]}),

            e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-300 leading-relaxed",children:m.summary}),

            /* Numbered Step-by-Step List */
            e.jsx("div",{className:"space-y-2.5 pt-1",children:
              m.steps.map((st,sIdx)=>e.jsxs("div",{className:"flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800",children:[
                e.jsx("span",{className:"w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold tabular-nums flex items-center justify-center shrink-0 mt-0.5",children:sIdx+1}),
                e.jsx("p",{className:"text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed",children:st})
              ]},sIdx))
            }),

            /* Tip & Important Note */
            e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 pt-1",children:[
              e.jsxs("div",{className:"p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 text-xs leading-relaxed text-slate-700 dark:text-slate-300",children:[
                e.jsx("strong",{className:"block text-sky-800 dark:text-sky-300 mb-1",children:"គន្លឹះអនុវត្តល្អ៖"}),
                e.jsx("span",{children:m.tip})
              ]}),
              e.jsxs("div",{className:"p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs leading-relaxed text-slate-700 dark:text-slate-300",children:[
                e.jsx("strong",{className:"block text-amber-800 dark:text-amber-300 mb-1",children:"ចំណាំសំខាន់៖"}),
                e.jsx("span",{children:m.warning})
              ]})
            ]})
          ]
        },m.id);
      })
    })
  ]});
}`;

// 1. Add sidebar nav item in k3e
replaceExact(
  `{id:"admin",label:"រដ្ឋបាលគ្រូបឋម (៤ ផ្នែក)",shortLabel:"រដ្ឋបាលគ្រូ",icon:tY,color:"text-purple-700"},`,
  `{id:"admin",label:"រដ្ឋបាលគ្រូបឋម (៤ ផ្នែក)",shortLabel:"រដ្ឋបាលគ្រូ",icon:tY,color:"text-purple-700"},{id:"guide",label:"ការណែនាំអនុវត្តលម្អិត",shortLabel:"ការណែនាំ",icon:Rx,color:"text-sky-600",badge:"📘 ថ្មី"},`,
  "Sidebar k3e item"
);

// 2. Add mobile bottom dock item in P3e
replaceExact(
  `{id:"admin",label:"រដ្ឋបាលគ្រូ",icon:tY},`,
  `{id:"admin",label:"រដ្ឋបាលគ្រូ",icon:tY},{id:"guide",label:"ការណែនាំ",icon:Rx,badge:"📘"},`,
  "Mobile dock P3e item"
);

// 3. Add hero quick-access button in Z3e
replaceExact(
  `children:"គ្រប់គ្រងការងាររដ្ឋបាល"})]})\n            ]}),`,
  `children:"គ្រប់គ្រងការងាររដ្ឋបាល"})]})\n            ]}),\n            e.jsxs("button",{type:"button",onClick:()=>a("guide"),className:"shrink-0 px-3 py-2 rounded-2xl border-2 border-sky-200 hover:border-sky-400 bg-white hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-sm hover:shadow-md active:scale-95 text-left cursor-pointer group",title:"បើកទំព័រការណែនាំអនុវត្តលម្អិតតាមជំហាន",children:[e.jsx("div",{className:"w-8 h-8 rounded-xl bg-sky-100 text-sky-700 shrink-0 flex items-center justify-center",children:e.jsx(Rx,{className:"w-5 h-5"})}),e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:"block text-[10px] sm:text-xs font-bold text-sky-700 font-moul tracking-wide truncate leading-tight",children:"ការណែនាំអនុវត្ត"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-500 block truncate font-semibold leading-tight mt-0.5",children:"ជំហានប្រើប្រាស់លម្អិត"})]})]}),`,
  "Hero Z3e quick button"
);

// 4. Support deep-linking sub-tabs in sec3 (ue) and sec4 (de) inside ytt
replaceExact(
  `[J,se]=y.useState(!1),[le,me]=y.useState(()=>{try{const oe=sessionStorage.getItem("target_admin_section");if(oe){const ft=JSON.parse(oe);if(sessionStorage.removeItem("target_admin_section"),ft.sub&&["timetable","syllabus","lessonplan","slides","assessment"].includes(ft.sub))return ft.sub}}catch{}return"timetable"}),[ue,fe]=y.useState("committee"),[de,Ce]=y.useState("plc")`,
  `[J,se]=y.useState(!1),[le,me]=y.useState(()=>{try{const oe=sessionStorage.getItem("target_admin_section");if(oe){const ft=JSON.parse(oe);if(ft.sub&&["timetable","syllabus","lessonplan","slides","assessment"].includes(ft.sub))return ft.sub}}catch{}return"timetable"}),[ue,fe]=y.useState(()=>{try{const oe=sessionStorage.getItem("target_admin_section");if(oe){const ft=JSON.parse(oe);if(ft.sub&&["committee","seating","sanitation_committee","rules","inventory","materials"].includes(ft.sub))return ft.sub}}catch{}return"committee"}),[de,Ce]=y.useState(()=>{try{const oe=sessionStorage.getItem("target_admin_section");if(oe){const ft=JSON.parse(oe);if(sessionStorage.removeItem("target_admin_section"),ft.sub&&["plc","self_study","model_school","cpd","agreements","parents","letters"].includes(ft.sub))return ft.sub}}catch{try{sessionStorage.removeItem("target_admin_section")}catch{}}return"plc"})`,
  "ytt sec3/sec4 deep-link init"
);

// 5. Inject GuidePageComp right before krt
replaceExact(
  `Si="primary_teacher_admin_v2";function krt(){`,
  `Si="primary_teacher_admin_v2"${GUIDE_COMP_CODE};function krt(){`,
  "Inject GuidePageComp"
);

// 6. Render GuidePageComp in krt when s === "guide"
replaceExact(
  `s==="games"&&e.jsx(poe,{quizzes:H,onPlayQuiz:we,onShowToast:Re})`,
  `s==="games"&&e.jsx(poe,{quizzes:H,onPlayQuiz:we,onShowToast:Re}),s==="guide"&&e.jsx(GuidePageComp,{teacher:c,currentYear:n,onNavigateTab:a,onOpenAdminSection:(main,sub)=>{try{sessionStorage.setItem("target_admin_section",JSON.stringify({main,sub}))}catch{}a("admin")},onOpenAccountSync:()=>se(!0),onOpenYearManager:()=>o(!0),onOpenProfile:()=>Xe(!0),onShowToast:Re})`,
  "Render GuidePageComp route in krt"
);

// 7. Route Crt's onOpenGuidelineModal to "guide"
replaceExact(
  `onOpenGuidelineModal:()=>a("home")`,
  `onOpenGuidelineModal:()=>a("guide")`,
  "Route Crt guideline button to guide"
);

// AST check via TypeScript parser
console.log("Running TypeScript AST parse check...");
const sf = ts.createSourceFile("index-BwPwHqBe.js", src, ts.ScriptTarget.Latest, false, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  for (const d of sf.parseDiagnostics.slice(0, 10)) {
    const pos = sf.getLineAndCharacterOfPosition(d.start);
    console.error(`Parse error at line ${pos.line + 1}, col ${pos.character + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`);
  }
  process.exit(1);
}
console.log("✓ TypeScript AST parse check passed (0 diagnostics)!");

fs.writeFileSync(targetPath, src, "utf8");
console.log("✓ Successfully wrote updated bundle!");
