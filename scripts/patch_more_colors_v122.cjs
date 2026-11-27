const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const targetPath = path.join(process.cwd(), "public/assets/index-BwPwHqBe.js");
let src = fs.readFileSync(targetPath, "utf8");

function replaceExact(label, oldStr, newStr) {
  if (!src.includes(oldStr)) {
    throw new Error("Missing target block: " + label);
  }
  const idx = src.indexOf(oldStr);
  if (src.indexOf(oldStr, idx + 1) !== -1) {
    throw new Error("Non-unique target block: " + label);
  }
  src = src.replace(oldStr, newStr);
  console.log("Patched:", label);
}

// Helper JS snippet injected right above oCe/cCe/xCe and used across timetable exports + xCe + Oi
const ttHelperCode = `const __ttSubjectColor=(val,isBw)=>{if(isBw)return{bg:"",text:"",cls:"bg-white text-black"};const s=(val||"").trim();if(!s)return{bg:"#ffffff",text:"#0f172a",cls:"bg-white text-slate-900"};if(s.includes("ទង់ជាតិ"))return{bg:"#ffe4e6",text:"#9f1239",cls:"bg-rose-100 text-rose-900"};if(s.includes("ចេញលេង"))return{bg:"#fef3c7",text:"#92400e",cls:"bg-amber-100 text-amber-900"};if(s.includes("ខ្មែរ")||s.includes("អំណាន")||s.includes("សរសេរ"))return{bg:"#e0f2fe",text:"#0c4a6e",cls:"bg-sky-50 text-sky-900"};if(s.includes("គណិត"))return{bg:"#e0e7ff",text:"#312e81",cls:"bg-indigo-50 text-indigo-900"};if(s.includes("វិទ្យា"))return{bg:"#d1fae5",text:"#065f46",cls:"bg-emerald-50 text-emerald-900"};if(s.includes("សង្គម")||s.includes("សីលធម៌")||s.includes("ប្រវត្តិ")||s.includes("ភូមិ"))return{bg:"#fef3c7",text:"#78350f",cls:"bg-amber-50 text-amber-900"};if(s.includes("អប់រំកាយ")||s.includes("កីឡា"))return{bg:"#ffe4e6",text:"#881337",cls:"bg-rose-50 text-rose-900"};if(s.includes("សិល្បៈ")||s.includes("គំនូរ")||s.includes("ចម្រៀង"))return{bg:"#fae8ff",text:"#701a75",cls:"bg-fuchsia-50 text-fuchsia-900"};if(s.includes("អង់គ្លេស")||s.toLowerCase().includes("english"))return{bg:"#cffafe",text:"#155e75",cls:"bg-cyan-50 text-cyan-900"};if(s.includes("បំណិន")||s.includes("ពលកម្ម")||s.includes("ស្វ័យសិក្សា")||s.includes("ប្រជុំ"))return{bg:"#ecfccb",text:"#3f6212",cls:"bg-lime-50 text-lime-900"};return{bg:"#f8fafc",text:"#1e293b",cls:"bg-slate-50 text-slate-800"};};`;

// 1. Word (.doc) export oCe: colorful headers + subject cells
replaceExact(
  "oCe_timetable_word_css",
  `  table.timetable-grid th {
    background-color: #FCE4D6;
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-weight: normal;
    font-size: 9.5pt;
  }
  .bg-flag {
    background-color: #FFF0F0;
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-size: 9.5pt;
    color: #900;
  }
  .bg-break {
    background-color: #FFFDF0;
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-size: 9.5pt;
    color: #B45309;
  }`,
  `  table.timetable-grid th {
    background-color: #0284c7;
    color: #ffffff;
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-weight: normal;
    font-size: 9.5pt;
  }
  .bg-flag {
    background-color: #ffe4e6;
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-size: 9.5pt;
    color: #9f1239;
  }
  .bg-break {
    background-color: #fef3c7;
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-size: 9.5pt;
    color: #92400e;
  }`
);

replaceExact(
  "oCe_timetable_word_table",
  `    <thead>
      <tr>
        <th style="width: 11%;">ម៉ោងសិក្សា</th>
        <th style="width: 9%;">រយៈពេល</th>
        <th style="width: 13%;">ចន្ទ</th>
        <th style="width: 13%;">អង្គារ</th>
        <th style="width: 13%;">ពុធ</th>
        <th style="width: 13%;">ព្រហស្បតិ៍</th>
        <th style="width: 13%;">សុក្រ</th>
        <th style="width: 13%;">សៅរ៍</th>
      </tr>
    </thead>
    <tbody>
      \${r.rows.map(l=>l.type==="flag"?\`
            <tr>
              <td style="font-weight: bold;">\${l.time}</td>
              <td>\${l.duration}</td>
              <td colspan="6" class="bg-flag">\${l.mon}</td>
            </tr>\`:l.type==="break"?\`
            <tr>
              <td style="font-weight: bold;">\${l.time}</td>
              <td>\${l.duration}</td>
              <td colspan="6" class="bg-break">\${l.mon}</td>
            </tr>\`:\`
          <tr>
            <td style="font-weight: bold;">\${l.time}</td>
            <td>\${l.duration}</td>
            <td>\${l.mon}</td>
            <td>\${l.tue}</td>
            <td>\${l.wed}</td>
            <td>\${l.thu}</td>
            <td>\${l.fri}</td>
            <td>\${l.sat}</td>
          </tr>\`).join("")}
    </tbody>`,
  `    <thead>
      <tr>
        <th style="width: 11%; background-color: #0f766e; color: #ffffff;">ម៉ោងសិក្សា</th>
        <th style="width: 9%; background-color: #0d9488; color: #ffffff;">រយៈពេល</th>
        <th style="width: 13%; background-color: #f59e0b; color: #ffffff;">ចន្ទ</th>
        <th style="width: 13%; background-color: #4f46e5; color: #ffffff;">អង្គារ</th>
        <th style="width: 13%; background-color: #059669; color: #ffffff;">ពុធ</th>
        <th style="width: 13%; background-color: #ea580c; color: #ffffff;">ព្រហស្បតិ៍</th>
        <th style="width: 13%; background-color: #0284c7; color: #ffffff;">សុក្រ</th>
        <th style="width: 13%; background-color: #e11d48; color: #ffffff;">សៅរ៍</th>
      </tr>
    </thead>
    <tbody>
      \${r.rows.map(l=>{if(l.type==="flag")return\`
            <tr>
              <td style="font-weight: bold; background-color: #f0fdfa; color: #115e59;">\${l.time}</td>
              <td style="background-color: #f8fafc;">\${l.duration}</td>
              <td colspan="6" class="bg-flag">🚩 \${l.mon}</td>
            </tr>\`;if(l.type==="break")return\`
            <tr>
              <td style="font-weight: bold; background-color: #f0fdfa; color: #115e59;">\${l.time}</td>
              <td style="background-color: #f8fafc;">\${l.duration}</td>
              <td colspan="6" class="bg-break">🔔 \${l.mon}</td>
            </tr>\`;const cMon=__ttSubjectColor(l.mon,false),cTue=__ttSubjectColor(l.tue,false),cWed=__ttSubjectColor(l.wed,false),cThu=__ttSubjectColor(l.thu,false),cFri=__ttSubjectColor(l.fri,false),cSat=__ttSubjectColor(l.sat,false);return\`
          <tr>
            <td style="font-weight: bold; background-color: #f0fdfa; color: #115e59;">\${l.time}</td>
            <td style="background-color: #f8fafc; color: #334155;">\${l.duration}</td>
            <td style="background-color: \${cMon.bg}; color: \${cMon.text}; font-weight: bold;">\${l.mon}</td>
            <td style="background-color: \${cTue.bg}; color: \${cTue.text}; font-weight: bold;">\${l.tue}</td>
            <td style="background-color: \${cWed.bg}; color: \${cWed.text}; font-weight: bold;">\${l.wed}</td>
            <td style="background-color: \${cThu.bg}; color: \${cThu.text}; font-weight: bold;">\${l.thu}</td>
            <td style="background-color: \${cFri.bg}; color: \${cFri.text}; font-weight: bold;">\${l.fri}</td>
            <td style="background-color: \${cSat.bg}; color: \${cSat.text}; font-weight: bold;">\${l.sat}</td>
          </tr>\`;}).join("")}
    </tbody>`
);

// 2. Print standard Word HTML cCe: inject helper + vibrant headers & subject cells when !t
replaceExact(
  "cCe_timetable_print_css_and_table",
  `    table.data-table th {
      background-color: \${t?"#eee":"#FCE4D6"};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9.5pt;
      font-weight: normal;
    }
    .flag-row {
      background-color: \${t?"#fff":"#fff0f0"};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9pt;
      color: \${t?"#000":"#900"};
    }
    .break-row {
      background-color: \${t?"#fff":"#fffdf0"};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9pt;
      color: \${t?"#000":"#b45309"};
    }`,
  `    table.data-table th {
      background-color: \${t?"#eee":"#0284c7"};
      color: \${t?"#000":"#ffffff"};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9.5pt;
      font-weight: normal;
    }
    .flag-row {
      background-color: \${t?"#fff":"#ffe4e6"};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9pt;
      color: \${t?"#000":"#9f1239"};
    }
    .break-row {
      background-color: \${t?"#fff":"#fef3c7"};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9pt;
      color: \${t?"#000":"#92400e"};
    }`
);

replaceExact(
  "cCe_timetable_print_tbody",
  `      <thead>
        <tr>
          <th style="width: 11%;">ម៉ោងសិក្សា</th>
          <th style="width: 9%;">រយៈពេល</th>
          <th style="width: 13%;">ចន្ទ</th>
          <th style="width: 13%;">អង្គារ</th>
          <th style="width: 13%;">ពុធ</th>
          <th style="width: 13%;">ព្រហស្បតិ៍</th>
          <th style="width: 13%;">សុក្រ</th>
          <th style="width: 13%;">សៅរ៍</th>
        </tr>
      </thead>
      <tbody>
        \${r.rows.map(i=>i.type==="flag"?\`
              <tr>
                <td style="font-weight: bold; font-family: monospace;">\${i.time}</td>
                <td>\${i.duration}</td>
                <td colspan="6" class="flag-row">\${i.mon}</td>
              </tr>\`:i.type==="break"?\`
              <tr>
                <td style="font-weight: bold; font-family: monospace;">\${i.time}</td>
                <td>\${i.duration}</td>
                <td colspan="6" class="break-row">\${i.mon}</td>
              </tr>\`:\`
            <tr>
              <td style="font-weight: bold; font-family: monospace;">\${i.time}</td>
              <td>\${i.duration}</td>
              <td>\${i.mon}</td>
              <td>\${i.tue}</td>
              <td>\${i.wed}</td>
              <td>\${i.thu}</td>
              <td>\${i.fri}</td>
              <td>\${i.sat}</td>
            </tr>\`).join("")}
      </tbody>`,
  `      <thead>
        <tr>
          <th style="width: 11%; \${t?"":"background-color: #0f766e; color: #ffffff;"}">ម៉ោងសិក្សា</th>
          <th style="width: 9%; \${t?"":"background-color: #0d9488; color: #ffffff;"}">រយៈពេល</th>
          <th style="width: 13%; \${t?"":"background-color: #f59e0b; color: #ffffff;"}">ចន្ទ</th>
          <th style="width: 13%; \${t?"":"background-color: #4f46e5; color: #ffffff;"}">អង្គារ</th>
          <th style="width: 13%; \${t?"":"background-color: #059669; color: #ffffff;"}">ពុធ</th>
          <th style="width: 13%; \${t?"":"background-color: #ea580c; color: #ffffff;"}">ព្រហស្បតិ៍</th>
          <th style="width: 13%; \${t?"":"background-color: #0284c7; color: #ffffff;"}">សុក្រ</th>
          <th style="width: 13%; \${t?"":"background-color: #e11d48; color: #ffffff;"}">សៅរ៍</th>
        </tr>
      </thead>
      <tbody>
        \${r.rows.map(i=>{if(i.type==="flag")return\`
              <tr>
                <td style="font-weight: bold; font-family: monospace; \${t?"":"background-color: #f0fdfa; color: #115e59;"}">\${i.time}</td>
                <td style="\${t?"":"background-color: #f8fafc;"}">\${i.duration}</td>
                <td colspan="6" class="flag-row">🚩 \${i.mon}</td>
              </tr>\`;if(i.type==="break")return\`
              <tr>
                <td style="font-weight: bold; font-family: monospace; \${t?"":"background-color: #f0fdfa; color: #115e59;"}">\${i.time}</td>
                <td style="\${t?"":"background-color: #f8fafc;"}">\${i.duration}</td>
                <td colspan="6" class="break-row">🔔 \${i.mon}</td>
              </tr>\`;const cMon=__ttSubjectColor(i.mon,t),cTue=__ttSubjectColor(i.tue,t),cWed=__ttSubjectColor(i.wed,t),cThu=__ttSubjectColor(i.thu,t),cFri=__ttSubjectColor(i.fri,t),cSat=__ttSubjectColor(i.sat,t);return\`
            <tr>
              <td style="font-weight: bold; font-family: monospace; \${t?"":"background-color: #f0fdfa; color: #115e59;"}">\${i.time}</td>
              <td style="\${t?"":"background-color: #f8fafc; color: #334155;"}">\${i.duration}</td>
              <td style="\${t?"":\`background-color: \${cMon.bg}; color: \${cMon.text}; font-weight: bold;\`}">\${i.mon}</td>
              <td style="\${t?"":\`background-color: \${cTue.bg}; color: \${cTue.text}; font-weight: bold;\`}">\${i.tue}</td>
              <td style="\${t?"":\`background-color: \${cWed.bg}; color: \${cWed.text}; font-weight: bold;\`}">\${i.wed}</td>
              <td style="\${t?"":\`background-color: \${cThu.bg}; color: \${cThu.text}; font-weight: bold;\`}">\${i.thu}</td>
              <td style="\${t?"":\`background-color: \${cFri.bg}; color: \${cFri.text}; font-weight: bold;\`}">\${i.fri}</td>
              <td style="\${t?"":\`background-color: \${cSat.bg}; color: \${cSat.text}; font-weight: bold;\`}">\${i.sat}</td>
            </tr>\`;}).join("")}
      </tbody>`
);

// 3. Inject __ttSubjectColor and upgrade xCe timetable UI (Color Mode ON by default + vibrant UI)
replaceExact(
  "xCe_timetable_component",
  `const q9="primary_school_timetable_custom_v2",dCe=[{label:"ភាសាខ្មែរ",icon:"📘"},{label:"គណិតវិទ្យា",icon:"📐"},{label:"វិទ្យាសាស្ត្រ",icon:"🔬"},{label:"សិក្សាសង្គម",icon:"🌏"},{label:"អប់រំកាយ",icon:"⚽"},{label:"សិល្បៈ",icon:"🎨"},{label:"ភាសាអង់គ្លេស",icon:"🇬🇧"},{label:"ស្វ័យសិក្សា",icon:"💡"},{label:"ចេញលេង",icon:"☕"},{label:"គោរពទង់ជាតិ",icon:"🇰🇭"},{label:"បំប៉នភាសាខ្មែរ",icon:"📖"},{label:"បំប៉នគណិតវិទ្យា",icon:"🧮"},{label:"បំណិនជីវិត",icon:"🌱"}],xCe=({grade:r="ថ្នាក់ទី ៤-៦",onShowToast:t,isModalView:s=!1,onCloseModal:a})=>{const[n,i]=y.useState(()=>{const Y=localStorage.getItem(q9);if(Y)try{return JSON.parse(Y)}catch(U){console.error("Error parsing saved timetable:",U)}return Mz}),[l,o]=y.useState("all"),[c,d]=y.useState(!0),[u,h]=y.useState(!0)`,
  `${ttHelperCode}const q9="primary_school_timetable_custom_v2",dCe=[{label:"ភាសាខ្មែរ",icon:"📘"},{label:"គណិតវិទ្យា",icon:"📐"},{label:"វិទ្យាសាស្ត្រ",icon:"🔬"},{label:"សិក្សាសង្គម",icon:"🌏"},{label:"អប់រំកាយ",icon:"⚽"},{label:"សិល្បៈ",icon:"🎨"},{label:"ភាសាអង់គ្លេស",icon:"🇬🇧"},{label:"ស្វ័យសិក្សា",icon:"💡"},{label:"ចេញលេង",icon:"☕"},{label:"គោរពទង់ជាតិ",icon:"🇰🇭"},{label:"បំប៉នភាសាខ្មែរ",icon:"📖"},{label:"បំប៉នគណិតវិទ្យា",icon:"🧮"},{label:"បំណិនជីវិត",icon:"🌱"}],xCe=({grade:r="ថ្នាក់ទី ៤-៦",onShowToast:t,isModalView:s=!1,onCloseModal:a})=>{const[n,i]=y.useState(()=>{const Y=localStorage.getItem(q9);if(Y)try{return JSON.parse(Y)}catch(U){console.error("Error parsing saved timetable:",U)}return Mz}),[l,o]=y.useState("all"),[c,d]=y.useState(!0),[u,h]=y.useState(!1)`
);

replaceExact(
  "xCe_timetable_toolbar_and_sheet",
  `e.jsx("div",{className:"w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 flex items-center justify-center font-black text-xl shadow-xs",children:"📄"}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h3",{className:"font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base",children:"កាលវិភាគបង្រៀនផ្លូវការ (ស្តង់ដារ Microsoft Word & MoEYS)"}),e.jsx("span",{className:"text-[10px] bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded-md",children:"A4 Landscape ផ្តេក"}),e.jsxs("span",{className:"text-[10px] bg-purple-100 text-purple-950 font-bold px-2 py-0.5 rounded-md",children:["វេន",n.shift]})]}),e.jsxs("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-0.5",children:[n.schoolName," • ឆ្នាំសិក្សា ",n.academicYear]})]})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("button",{onClick:()=>{const Y=!m;w(Y),Y&&t&&t("បានបើកមុខងារកែសម្រួល៖ ចុចលើប្រអប់ក្នុងតារាងដើម្បីកែប្រែ ឬជ្រើសមុខវិជ្ជា!")},className:\`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 \${m?"bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-1":"bg-indigo-600 hover:bg-indigo-700 text-white"}\`,children:[m?e.jsx(ea,{className:"w-4 h-4"}):e.jsx(Wa,{className:"w-4 h-4"}),e.jsx("span",{children:m?"រួចរាល់ (រក្សាទុក)":"✏️ កែសម្រួលកាលវិភាគ"})]}),m&&e.jsxs("button",{onClick:H,className:"px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1",title:"កំណត់ទិន្នន័យដើមឡើងវិញ",children:[e.jsx(En,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"កំណត់ឡើងវិញ"})]}),e.jsxs("button",{onClick:()=>A(!0),className:"px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition shadow-md flex items-center gap-1.5 active:scale-95",title:"កំណត់ និងកែសម្រួលទម្រង់កាលវិភាគមុនទាញយកជា PDF",children:[e.jsx(Vs,{className:"w-4 h-4 text-red-200"}),e.jsx("span",{children:"ទាញយក / កែសម្រួល PDF"})]}),e.jsxs("button",{onClick:X,className:"px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 active:scale-95",title:"ទាញយកឯកសារ Word ដើម្បីបើកកែប្រែ ឬព្រីនក្នុង Microsoft Word",children:[e.jsx(wi,{className:"w-4 h-4 text-blue-200"}),e.jsx("span",{children:"ទាញយក Word (.doc)"})]}),e.jsxs("button",{onClick:E,className:"px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 active:scale-95",children:[e.jsx(ts,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{children:"បោះពុម្ពស្តង់ដារ Word"})]})`,
  `e.jsx("div",{className:"w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md",children:"📅"}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsx("h3",{className:"font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base",children:"កាលវិភាគសិក្សា និងបង្រៀនផ្លូវការ (MoEYS)"}),e.jsx("span",{className:"text-[10px] bg-amber-100 text-amber-900 border border-amber-200 font-bold px-2 py-0.5 rounded-full",children:"A4 Landscape ផ្តេក"}),e.jsxs("span",{className:"text-[10px] bg-sky-100 text-sky-900 border border-sky-200 font-bold px-2 py-0.5 rounded-full",children:["វេន",n.shift]})]}),e.jsxs("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-0.5",children:[n.schoolName," • ឆ្នាំសិក្សា ",n.academicYear]})]})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("button",{onClick:()=>{const Y=!m;w(Y),Y&&t&&t("បានបើកមុខងារកែសម្រួល៖ ចុចលើប្រអប់ក្នុងតារាងដើម្បីកែប្រែ ឬជ្រើសមុខវិជ្ជា!")},className:\`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 \${m?"bg-gradient-to-r from-emerald-500 to-teal-600 text-white ring-2 ring-emerald-400 ring-offset-1":"bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white"}\`,children:[m?e.jsx(ea,{className:"w-4 h-4"}):e.jsx(Wa,{className:"w-4 h-4"}),e.jsx("span",{children:m?"រួចរាល់ (រក្សាទុក)":"✏️ កែសម្រួលកាលវិភាគ"})]}),m&&e.jsxs("button",{onClick:H,className:"px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1",title:"កំណត់ទិន្នន័យដើមឡើងវិញ",children:[e.jsx(En,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"កំណត់ឡើងវិញ"})]}),e.jsxs("button",{onClick:()=>A(!0),className:"px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-extrabold transition shadow-md flex items-center gap-1.5 active:scale-95",title:"កំណត់ និងកែសម្រួលទម្រង់កាលវិភាគមុនទាញយកជា PDF",children:[e.jsx(Vs,{className:"w-4 h-4 text-rose-100"}),e.jsx("span",{children:"ទាញយក / កែសម្រួល PDF"})]}),e.jsxs("button",{onClick:X,className:"px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 active:scale-95",title:"ទាញយកឯកសារ Word ដើម្បីបើកកែប្រែ ឬព្រីនក្នុង Microsoft Word",children:[e.jsx(wi,{className:"w-4 h-4 text-blue-100"}),e.jsx("span",{children:"ទាញយក Word (.doc)"})]}),e.jsxs("button",{onClick:E,className:"px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 active:scale-95",children:[e.jsx(ts,{className:"w-4 h-4 text-amber-200"}),e.jsx("span",{children:"បោះពុម្ពស្តង់ដារ Word"})]})`
);

replaceExact(
  "xCe_timetable_grid_colors",
  `e.jsxs("div",{className:"no-print flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar",children:[e.jsx("span",{className:"text-slate-500 shrink-0",children:"ជ្រើសរើសថ្ងៃ៖"}),Z.map(Y=>e.jsx("button",{onClick:()=>o(Y.key),className:\`px-3 py-1.5 rounded-xl shrink-0 transition \${l===Y.key?"bg-purple-900 text-white font-extrabold shadow-sm":"bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"}\`,children:Y.label},Y.key))]}),e.jsxs("div",{className:\`printable-timetable \${u?"bw-print-mode":""} bg-white text-black p-6 sm:p-10 rounded-2xl border-2 border-slate-300 shadow-2xl space-y-5 w-full max-w-full px-2 sm:px-6 lg:px-8 mx-auto font-sans leading-normal transition-all\`,style:{fontFamily:"'Kantumruy Pro', 'Siemreap', 'Battambang', Arial, sans-serif"},children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4 pb-1 items-start",children:[e.jsx("div",{className:"space-y-1 text-left",children:m?e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("input",{type:"text",value:n.office,onChange:Y=>i({...n,office:Y.target.value}),className:"w-full text-xs font-bold border border-slate-300 rounded p-1 bg-amber-50/50",placeholder:"ឈ្មោះការិយាល័យ..."}),e.jsx("input",{type:"text",value:n.schoolName,onChange:Y=>i({...n,schoolName:Y.target.value}),className:"w-full text-xs font-moul border border-slate-300 rounded p-1 bg-amber-50/50",placeholder:"ឈ្មោះសាលារៀន..."})]}):e.jsxs("div",{children:[e.jsx("p",{className:"text-xs sm:text-sm font-bold text-slate-800 leading-tight",children:n.office}),e.jsx("p",{className:"font-moul text-xs sm:text-sm text-slate-900 mt-0.5 leading-tight",children:n.schoolName})]})}),e.jsxs("div",{className:"text-center space-y-0.5",children:[e.jsx("h4",{className:\`font-moul text-xs sm:text-sm md:text-base leading-tight \${u?"text-black":"text-amber-950"}\`,children:n.countryHeader}),e.jsx("h5",{className:"font-moul text-xs sm:text-sm text-black leading-tight",children:n.motto}),e.jsx("div",{className:"text-[10px] text-slate-500 font-mono leading-none",children:"rr2ss"})]})]}),e.jsx("div",{className:"text-center space-y-1 pt-1 pb-2",children:m?e.jsxs("div",{className:"space-y-1 max-w-xl mx-auto",children:[e.jsx("input",{type:"text",value:n.title,onChange:Y=>i({...n,title:Y.target.value}),className:"w-full text-center font-moul text-sm border border-slate-300 rounded p-1 bg-amber-50/50"}),e.jsxs("div",{className:"flex gap-2 justify-center text-xs",children:[e.jsx("input",{type:"text",value:n.academicYear,onChange:Y=>i({...n,academicYear:Y.target.value}),className:"text-center border border-slate-300 rounded p-1 w-28 bg-amber-50/50",placeholder:"ឆ្នាំសិក្សា"}),e.jsx("input",{type:"text",value:n.system,onChange:Y=>i({...n,system:Y.target.value}),className:"text-center border border-slate-300 rounded p-1 w-28 bg-amber-50/50",placeholder:"ប្រព័ន្ធ"}),e.jsx("input",{type:"text",value:n.shift,onChange:Y=>i({...n,shift:Y.target.value}),className:"text-center border border-slate-300 rounded p-1 w-20 bg-amber-50/50",placeholder:"វេន"})]})]}):e.jsxs("div",{children:[e.jsx("h2",{className:\`font-moul text-sm sm:text-base md:text-lg \${u?"text-black":"text-blue-900"}\`,children:n.title}),e.jsxs("p",{className:"text-xs sm:text-sm font-bold text-slate-800",children:["ឆ្នាំសិក្សា ",n.academicYear," (",n.system,") (",n.shift,")"]})]})}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-center border-collapse text-xs border-[1.5px] border-black",children:[e.jsx("thead",{children:e.jsxs("tr",{className:\`\${u?"bg-slate-200":"bg-[#FCE4D6]"} text-black font-moul border-b border-black\`,children:[e.jsx("th",{className:"p-2.5 border border-black min-w-[90px] font-normal text-[11px]",children:"ម៉ោងសិក្សា"}),e.jsx("th",{className:"p-2.5 border border-black min-w-[70px] font-normal text-[11px]",children:"រយៈពេល"}),(l==="all"||l==="mon")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"ចន្ទ"}),(l==="all"||l==="tue")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"អង្គារ"}),(l==="all"||l==="wed")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"ពុធ"}),(l==="all"||l==="thu")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"ព្រហស្បតិ៍"}),(l==="all"||l==="fri")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"សុក្រ"}),(l==="all"||l==="sat")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"សៅរ៍"}),m&&e.jsx("th",{className:"p-2 border border-black w-10 text-center font-normal text-[11px]",children:"លុប"})]})}),e.jsx("tbody",{children:n.rows.map((Y,U)=>Y.type==="flag"?e.jsxs("tr",{className:\`\${u?"bg-white":"bg-rose-50"} text-black font-bold border-b border-black\`,children:[e.jsx("td",{className:"p-2 border border-black font-mono font-bold text-xs",children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:"p-2 border border-black text-xs font-normal",children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),e.jsx("td",{colSpan:l==="all"?6:1,className:\`p-2 border border-black font-moul text-xs \${u?"text-black":"text-rose-900"} tracking-wider\`,children:m?e.jsx("input",{type:"text",value:Y.mon,onChange:q=>{const ae=q.target.value,ie=[...n.rows];ie[U]={...ie[U],mon:ae,tue:ae,wed:ae,thu:ae,fri:ae,sat:ae},i({...n,rows:ie})},className:"w-full text-center border rounded p-1 bg-white font-bold"}):\`🚩 \${Y.mon}\`}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U):Y.type==="break"?e.jsxs("tr",{className:\`\${u?"bg-white":"bg-amber-50"} text-black font-bold border-b border-black\`,children:[e.jsx("td",{className:"p-2 border border-black font-mono font-bold text-xs",children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:"p-2 border border-black text-xs font-normal",children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),e.jsx("td",{colSpan:l==="all"?6:1,className:\`p-2 border border-black font-moul text-xs \${u?"text-black":"text-amber-900"} tracking-wider\`,children:m?e.jsx("input",{type:"text",value:Y.mon,onChange:q=>{const ae=q.target.value,ie=[...n.rows];ie[U]={...ie[U],mon:ae,tue:ae,wed:ae,thu:ae,fri:ae,sat:ae},i({...n,rows:ie})},className:"w-full text-center border rounded p-1 bg-white font-bold"}):\`🔔 \${Y.mon}\`}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U):e.jsxs("tr",{className:"border-b border-black hover:bg-slate-50",children:[e.jsx("td",{className:"p-2 border border-black font-mono font-bold text-black text-xs",children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:"p-2 border border-black text-black text-xs",children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),["mon","tue","wed","thu","fri","sat"].map(q=>{if(l!=="all"&&l!==q)return null;const ae=(D==null?void 0:D.rowIndex)===U&&(D==null?void 0:D.field)===q;return e.jsx("td",{className:\`p-1.5 border border-black text-xs font-bold transition \${ae?"bg-purple-100 ring-2 ring-purple-500 ring-inset":""}\`,children:m?e.jsx("input",{type:"text",value:Y[q],onFocus:()=>T({rowIndex:U,field:q}),onChange:ie=>O(U,q,ie.target.value),className:"w-full text-center border border-slate-300 rounded p-1 text-xs bg-white font-bold focus:border-purple-600 focus:outline-none"}):Y[q]},q)}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរនេះ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U))})]})}),c&&e.jsxs("div",{className:"pt-2 space-y-1.5 text-xs text-black",children:[e.jsx("h5",{className:"font-bold underline text-rose-950",children:e.jsx("span",{children:"កំណត់សម្គាល់៖"})})`,
  `e.jsxs("div",{className:"no-print flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar",children:[e.jsx("span",{className:"text-slate-500 shrink-0",children:"ជ្រើសរើសថ្ងៃ៖"}),Z.map(Y=>e.jsx("button",{onClick:()=>o(Y.key),className:\`px-3.5 py-1.5 rounded-xl shrink-0 transition cursor-pointer \${l===Y.key?"bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold shadow-sm":"bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-sky-50 hover:border-sky-300"}\`,children:Y.label},Y.key))]}),e.jsxs("div",{className:\`printable-timetable \${u?"bw-print-mode":""} \${u?"bg-white border-2 border-slate-300":"bg-gradient-to-b from-sky-50/40 via-white to-emerald-50/30 border-2 border-sky-200"} text-black p-6 sm:p-10 rounded-3xl shadow-2xl space-y-5 w-full max-w-full px-2 sm:px-6 lg:px-8 mx-auto font-sans leading-normal transition-all\`,style:{fontFamily:"'Kantumruy Pro', 'Siemreap', 'Battambang', Arial, sans-serif"},children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4 pb-1 items-start",children:[e.jsx("div",{className:"space-y-1 text-left",children:m?e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("input",{type:"text",value:n.office,onChange:Y=>i({...n,office:Y.target.value}),className:"w-full text-xs font-bold border border-slate-300 rounded p-1 bg-amber-50/50",placeholder:"ឈ្មោះការិយាល័យ..."}),e.jsx("input",{type:"text",value:n.schoolName,onChange:Y=>i({...n,schoolName:Y.target.value}),className:"w-full text-xs font-moul border border-slate-300 rounded p-1 bg-amber-50/50",placeholder:"ឈ្មោះសាលារៀន..."})]}):e.jsxs("div",{children:[e.jsx("p",{className:"text-xs sm:text-sm font-bold text-slate-800 leading-tight",children:n.office}),e.jsx("p",{className:\`font-moul text-xs sm:text-sm mt-0.5 leading-tight \${u?"text-slate-900":"text-teal-800"}\`,children:n.schoolName})]})}),e.jsxs("div",{className:"text-center space-y-0.5",children:[e.jsx("h4",{className:\`font-moul text-xs sm:text-sm md:text-base leading-tight \${u?"text-black":"text-blue-900"}\`,children:n.countryHeader}),e.jsx("h5",{className:\`font-moul text-xs sm:text-sm leading-tight \${u?"text-black":"text-amber-700"}\`,children:n.motto}),e.jsx("div",{className:"text-[10px] text-slate-500 font-mono leading-none",children:"— ༺ ៚ ༻ —"})]})]}),e.jsx("div",{className:"text-center space-y-1 pt-1 pb-2",children:m?e.jsxs("div",{className:"space-y-1 max-w-xl mx-auto",children:[e.jsx("input",{type:"text",value:n.title,onChange:Y=>i({...n,title:Y.target.value}),className:"w-full text-center font-moul text-sm border border-slate-300 rounded p-1 bg-amber-50/50"}),e.jsxs("div",{className:"flex gap-2 justify-center text-xs",children:[e.jsx("input",{type:"text",value:n.academicYear,onChange:Y=>i({...n,academicYear:Y.target.value}),className:"text-center border border-slate-300 rounded p-1 w-28 bg-amber-50/50",placeholder:"ឆ្នាំសិក្សា"}),e.jsx("input",{type:"text",value:n.system,onChange:Y=>i({...n,system:Y.target.value}),className:"text-center border border-slate-300 rounded p-1 w-28 bg-amber-50/50",placeholder:"ប្រព័ន្ធ"}),e.jsx("input",{type:"text",value:n.shift,onChange:Y=>i({...n,shift:Y.target.value}),className:"text-center border border-slate-300 rounded p-1 w-20 bg-amber-50/50",placeholder:"វេន"})]})]}):e.jsxs("div",{className:"space-y-1",children:[e.jsx("h2",{className:\`font-moul text-sm sm:text-base md:text-lg \${u?"text-black":"text-sky-800"}\`,children:n.title}),e.jsxs("p",{className:\`text-xs sm:text-sm font-bold inline-block px-3.5 py-0.5 rounded-full \${u?"text-slate-800":"bg-sky-100/80 text-sky-900 border border-sky-200"}\`,children:["ឆ្នាំសិក្សា ",n.academicYear," (",n.system,") (",n.shift,")"]})]})}),e.jsx("div",{className:"overflow-x-auto rounded-xl",children:e.jsxs("table",{className:\`w-full text-center border-collapse text-xs \${u?"border-[1.5px] border-black":"border-2 border-sky-300"}\`,children:[e.jsx("thead",{children:e.jsxs("tr",{className:\`\${u?"bg-slate-200 text-black":"text-white"} font-moul border-b border-black\`,children:[e.jsx("th",{className:\`p-2.5 border \${u?"border-black":"border-teal-800 bg-teal-700"} min-w-[90px] font-normal text-[11px]\`,children:"ម៉ោងសិក្សា"}),e.jsx("th",{className:\`p-2.5 border \${u?"border-black":"border-teal-700 bg-teal-600"} min-w-[70px] font-normal text-[11px]\`,children:"រយៈពេល"}),(l==="all"||l==="mon")&&e.jsx("th",{className:\`p-2.5 border \${u?"border-black":"border-amber-600 bg-amber-500"} min-w-[110px] font-normal text-[11px]\`,children:"ចន្ទ"}),(l==="all"||l==="tue")&&e.jsx("th",{className:\`p-2.5 border \${u?"border-black":"border-indigo-700 bg-indigo-600"} min-w-[110px] font-normal text-[11px]\`,children:"អង្គារ"}),(l==="all"||l==="wed")&&e.jsx("th",{className:\`p-2.5 border \${u?"border-black":"border-emerald-700 bg-emerald-600"} min-w-[110px] font-normal text-[11px]\`,children:"ពុធ"}),(l==="all"||l==="thu")&&e.jsx("th",{className:\`p-2.5 border \${u?"border-black":"border-orange-600 bg-orange-500"} min-w-[110px] font-normal text-[11px]\`,children:"ព្រហស្បតិ៍"}),(l==="all"||l==="fri")&&e.jsx("th",{className:\`p-2.5 border \${u?"border-black":"border-sky-700 bg-sky-600"} min-w-[110px] font-normal text-[11px]\`,children:"សុក្រ"}),(l==="all"||l==="sat")&&e.jsx("th",{className:\`p-2.5 border \${u?"border-black":"border-rose-600 bg-rose-500"} min-w-[110px] font-normal text-[11px]\`,children:"សៅរ៍"}),m&&e.jsx("th",{className:"p-2 border border-black w-10 text-center font-normal text-[11px] bg-slate-700 text-white",children:"លុប"})]})}),e.jsx("tbody",{children:n.rows.map((Y,U)=>Y.type==="flag"?e.jsxs("tr",{className:\`\${u?"bg-white":"bg-rose-100"} text-black font-bold border-b \${u?"border-black":"border-rose-200"}\`,children:[e.jsx("td",{className:\`p-2 border \${u?"border-black":"border-sky-200 bg-teal-50/70 text-teal-900"} font-mono font-bold text-xs\`,children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:\`p-2 border \${u?"border-black":"border-sky-200 bg-slate-50"} text-xs font-normal\`,children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),e.jsx("td",{colSpan:l==="all"?6:1,className:\`p-2 border \${u?"border-black text-black":"border-rose-200 text-rose-900 bg-rose-100"} font-moul text-xs tracking-wider\`,children:m?e.jsx("input",{type:"text",value:Y.mon,onChange:q=>{const ae=q.target.value,ie=[...n.rows];ie[U]={...ie[U],mon:ae,tue:ae,wed:ae,thu:ae,fri:ae,sat:ae},i({...n,rows:ie})},className:"w-full text-center border rounded p-1 bg-white font-bold"}):\`🚩 \${Y.mon}\`}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U):Y.type==="break"?e.jsxs("tr",{className:\`\${u?"bg-white":"bg-amber-100"} text-black font-bold border-b \${u?"border-black":"border-amber-200"}\`,children:[e.jsx("td",{className:\`p-2 border \${u?"border-black":"border-sky-200 bg-teal-50/70 text-teal-900"} font-mono font-bold text-xs\`,children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:\`p-2 border \${u?"border-black":"border-sky-200 bg-slate-50"} text-xs font-normal\`,children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),e.jsx("td",{colSpan:l==="all"?6:1,className:\`p-2 border \${u?"border-black text-black":"border-amber-200 text-amber-900 bg-amber-100"} font-moul text-xs tracking-wider\`,children:m?e.jsx("input",{type:"text",value:Y.mon,onChange:q=>{const ae=q.target.value,ie=[...n.rows];ie[U]={...ie[U],mon:ae,tue:ae,wed:ae,thu:ae,fri:ae,sat:ae},i({...n,rows:ie})},className:"w-full text-center border rounded p-1 bg-white font-bold"}):\`🔔 \${Y.mon}\`}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U):e.jsxs("tr",{className:\`border-b \${u?"border-black hover:bg-slate-50":"border-sky-200"}\`,children:[e.jsx("td",{className:\`p-2 border \${u?"border-black text-black":"border-sky-200 bg-teal-50/70 text-teal-900"} font-mono font-bold text-xs\`,children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:\`p-2 border \${u?"border-black text-black":"border-sky-200 bg-slate-50 text-slate-700"} text-xs font-semibold\`,children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),["mon","tue","wed","thu","fri","sat"].map(q=>{if(l!=="all"&&l!==q)return null;const ae=(D==null?void 0:D.rowIndex)===U&&(D==null?void 0:D.field)===q,sc=__ttSubjectColor(Y[q],u);return e.jsx("td",{className:\`p-1.5 border \${u?"border-black":"border-sky-200"} text-xs font-bold transition \${sc.cls} \${ae?"ring-2 ring-purple-500 ring-inset":""}\`,children:m?e.jsx("input",{type:"text",value:Y[q],onFocus:()=>T({rowIndex:U,field:q}),onChange:ie=>O(U,q,ie.target.value),className:"w-full text-center border border-slate-300 rounded p-1 text-xs bg-white font-bold focus:border-purple-600 focus:outline-none"}):Y[q]},q)}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរនេះ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U))})]})}),c&&e.jsxs("div",{className:\`pt-2 space-y-1.5 text-xs \${u?"text-black":"bg-sky-50/80 border border-sky-200 rounded-2xl p-3.5 text-slate-800"}\`,children:[e.jsx("h5",{className:\`font-bold underline \${u?"text-rose-950":"text-sky-900"}\`,children:e.jsx("span",{children:"កំណត់សម្គាល់៖"})})`
);

// 4. Oi PDF Editor & Export for timetable (HTML output + Live Preview)
replaceExact(
  "Oi_timetable_pdf_html",
  `        <table style="width: 100%; border-collapse: collapse; font-size: 0.88em; text-align: center; margin-bottom: 14px;">
          <thead>
            <tr style="\${dr} font-family: \${He};">
              <th style="\${hr} \${at} \${qt} width: 11%;">ម៉ោង / វេន</th>
              <th style="\${hr} \${at} \${qt} width: 9%;">រយៈពេល</th>
              <th style="\${hr} \${at} \${qt} width: 13.3%;">ថ្ងៃចន្ទ</th>
              <th style="\${hr} \${at} \${qt} width: 13.3%;">ថ្ងៃអង្គារ</th>
              <th style="\${hr} \${at} \${qt} width: 13.3%;">ថ្ងៃពុធ</th>
              <th style="\${hr} \${at} \${qt} width: 13.3%;">ថ្ងៃព្រហស្បតិ៍</th>
              <th style="\${hr} \${at} \${qt} width: 13.3%;">ថ្ងៃសុក្រ</th>
              <th style="\${hr} \${at} \${qt} width: 13.3%;">ថ្ងៃសៅរ៍</th>
            </tr>
          </thead>
          <tbody>
            \${ds.map((At,Ue)=>{const Ir=At.type==="break"||At.mon==="ចេញលេង"||At.tue==="ចេញលេង",ks=At.type==="flag"||At.mon==="គោរពទង់ជាតិ";let zs=Ue%2===1?ne.altRowBg:"#ffffff";return Ir&&(zs=Tr),ks&&(zs=Rt),\`
                  <tr style="background-color: \${zs};">
                    <td style="\${hr} \${at} font-weight: bold; color: \${_e}; font-size: 0.9em;">
                      \${At.time||"-"}
                    </td>
                    <td style="\${hr} \${at} font-size: 0.82em; color: #475569;">
                      \${At.duration||"-"}
                    </td>
                    <td style="\${hr} \${at} \${Ir||ks?"font-weight: bold;":""}">
                      \${At.mon||"-"}
                    </td>
                    <td style="\${hr} \${at} \${Ir||ks?"font-weight: bold;":""}">
                      \${At.tue||"-"}
                    </td>
                    <td style="\${hr} \${at} \${Ir||ks?"font-weight: bold;":""}">
                      \${At.wed||"-"}
                    </td>
                    <td style="\${hr} \${at} \${Ir||ks?"font-weight: bold;":""}">
                      \${At.thu||"-"}
                    </td>
                    <td style="\${hr} \${at} \${Ir||ks?"font-weight: bold;":""}">
                      \${At.fri||"-"}
                    </td>
                    <td style="\${hr} \${at} \${Ir||ks?"font-weight: bold;":""}">
                      \${At.sat||"-"}
                    </td>
                  </tr>
                \`}).join("")}
          </tbody>
        </table>`,
  `        <table style="width: 100%; border-collapse: collapse; font-size: 0.88em; text-align: center; margin-bottom: 14px;">
          <thead>
            <tr style="font-family: \${He};">
              <th style="\${hr} \${at} background-color: #0f766e; color: #ffffff; width: 11%;">ម៉ោង / វេន</th>
              <th style="\${hr} \${at} background-color: #0d9488; color: #ffffff; width: 9%;">រយៈពេល</th>
              <th style="\${hr} \${at} background-color: #f59e0b; color: #ffffff; width: 13.3%;">ថ្ងៃចន្ទ</th>
              <th style="\${hr} \${at} background-color: #4f46e5; color: #ffffff; width: 13.3%;">ថ្ងៃអង្គារ</th>
              <th style="\${hr} \${at} background-color: #059669; color: #ffffff; width: 13.3%;">ថ្ងៃពុធ</th>
              <th style="\${hr} \${at} background-color: #ea580c; color: #ffffff; width: 13.3%;">ថ្ងៃព្រហស្បតិ៍</th>
              <th style="\${hr} \${at} background-color: #0284c7; color: #ffffff; width: 13.3%;">ថ្ងៃសុក្រ</th>
              <th style="\${hr} \${at} background-color: #e11d48; color: #ffffff; width: 13.3%;">ថ្ងៃសៅរ៍</th>
            </tr>
          </thead>
          <tbody>
            \${ds.map((At,Ue)=>{const Ir=At.type==="break"||At.mon==="ចេញលេង"||At.tue==="ចេញលេង",ks=At.type==="flag"||At.mon==="គោរពទង់ជាតិ";const cMon=__ttSubjectColor(At.mon,false),cTue=__ttSubjectColor(At.tue,false),cWed=__ttSubjectColor(At.wed,false),cThu=__ttSubjectColor(At.thu,false),cFri=__ttSubjectColor(At.fri,false),cSat=__ttSubjectColor(At.sat,false);return\`
                  <tr>
                    <td style="\${hr} \${at} background-color: #f0fdfa; font-weight: bold; color: #115e59; font-size: 0.9em;">
                      \${At.time||"-"}
                    </td>
                    <td style="\${hr} \${at} background-color: #f8fafc; font-size: 0.82em; color: #334155;">
                      \${At.duration||"-"}
                    </td>
                    <td style="\${hr} \${at} background-color: \${Ir?"#fef3c7":ks?"#ffe4e6":cMon.bg}; color: \${Ir?"#92400e":ks?"#9f1239":cMon.text}; font-weight: bold;">
                      \${At.mon||"-"}
                    </td>
                    <td style="\${hr} \${at} background-color: \${Ir?"#fef3c7":ks?"#ffe4e6":cTue.bg}; color: \${Ir?"#92400e":ks?"#9f1239":cTue.text}; font-weight: bold;">
                      \${At.tue||"-"}
                    </td>
                    <td style="\${hr} \${at} background-color: \${Ir?"#fef3c7":ks?"#ffe4e6":cWed.bg}; color: \${Ir?"#92400e":ks?"#9f1239":cWed.text}; font-weight: bold;">
                      \${At.wed||"-"}
                    </td>
                    <td style="\${hr} \${at} background-color: \${Ir?"#fef3c7":ks?"#ffe4e6":cThu.bg}; color: \${Ir?"#92400e":ks?"#9f1239":cThu.text}; font-weight: bold;">
                      \${At.thu||"-"}
                    </td>
                    <td style="\${hr} \${at} background-color: \${Ir?"#fef3c7":ks?"#ffe4e6":cFri.bg}; color: \${Ir?"#92400e":ks?"#9f1239":cFri.text}; font-weight: bold;">
                      \${At.fri||"-"}
                    </td>
                    <td style="\${hr} \${at} background-color: \${Ir?"#fef3c7":ks?"#ffe4e6":cSat.bg}; color: \${Ir?"#92400e":ks?"#9f1239":cSat.text}; font-weight: bold;">
                      \${At.sat||"-"}
                    </td>
                  </tr>
                \`}).join("")}
          </tbody>
        </table>`
);

replaceExact(
  "Oi_timetable_live_preview",
  `e.jsx("div",{className:"overflow-x-auto border-2 border-slate-800 rounded-lg",children:e.jsxs("table",{className:"w-full border-collapse text-center text-xs",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-blue-50 text-blue-950 font-bold border-b-2 border-slate-800",children:[e.jsx("th",{className:"p-2 border border-slate-300 w-24",children:"ម៉ោង / វេន"}),e.jsx("th",{className:"p-2 border border-slate-300 w-20",children:"រយៈពេល"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃចន្ទ"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃអង្គារ"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃពុធ"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃព្រហស្បតិ៍"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃសុក្រ"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃសៅរ៍"})]})}),e.jsx("tbody",{children:(Tt=Qe.rows)==null?void 0:Tt.map((ne,_e)=>{const ut=ne.type==="break"||ne.mon==="ចេញលេង"||ne.tue==="ចេញលេង",wr=ne.type==="flag"||ne.mon==="គោរពទង់ជាតិ";return e.jsxs("tr",{className:\`border-b border-slate-300 \${ut?"bg-amber-50 font-bold":wr?"bg-blue-50 font-bold":_e%2===1?"bg-slate-50/70":"bg-white"}\`,children:[e.jsx("td",{className:"p-1 border border-slate-300 font-bold text-blue-900",children:e.jsx("input",{type:"text",value:ne.time,onChange:Rt=>Je(_e,"time",Rt.target.value),className:"w-full text-center bg-transparent outline-none font-bold text-xs p-0.5 hover:bg-purple-50 rounded"})}),e.jsx("td",{className:"p-1 border border-slate-300 text-slate-600",children:e.jsx("input",{type:"text",value:ne.duration,onChange:Rt=>Je(_e,"duration",Rt.target.value),className:"w-full text-center bg-transparent outline-none text-xs p-0.5 hover:bg-purple-50 rounded"})}),["mon","tue","wed","thu","fri","sat"].map(Rt=>{const Tr=(ze==null?void 0:ze.rowIndex)===_e&&(ze==null?void 0:ze.day)===Rt;return e.jsx("td",{className:\`p-1 border border-slate-300 transition \${Tr?"bg-purple-100 ring-2 ring-purple-600 font-bold":""}\`,children:e.jsx("input",{type:"text",value:ne[Rt]||"",onFocus:()=>qe({rowIndex:_e,day:Rt}),onChange:Lr=>Je(_e,Rt,Lr.target.value),className:"w-full text-center bg-transparent outline-none text-xs p-0.5 hover:bg-purple-50 rounded font-medium"})},Rt)})]},_e)})})]})})`,
  `e.jsx("div",{className:"overflow-x-auto border-2 border-sky-300 rounded-xl",children:e.jsxs("table",{className:"w-full border-collapse text-center text-xs",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"text-white font-bold border-b-2 border-sky-300",children:[e.jsx("th",{className:"p-2 border border-teal-800 bg-teal-700 w-24",children:"ម៉ោង / វេន"}),e.jsx("th",{className:"p-2 border border-teal-700 bg-teal-600 w-20",children:"រយៈពេល"}),e.jsx("th",{className:"p-2 border border-amber-600 bg-amber-500",children:"ថ្ងៃចន្ទ"}),e.jsx("th",{className:"p-2 border border-indigo-700 bg-indigo-600",children:"ថ្ងៃអង្គារ"}),e.jsx("th",{className:"p-2 border border-emerald-700 bg-emerald-600",children:"ថ្ងៃពុធ"}),e.jsx("th",{className:"p-2 border border-orange-600 bg-orange-500",children:"ថ្ងៃព្រហស្បតិ៍"}),e.jsx("th",{className:"p-2 border border-sky-700 bg-sky-600",children:"ថ្ងៃសុក្រ"}),e.jsx("th",{className:"p-2 border border-rose-600 bg-rose-500",children:"ថ្ងៃសៅរ៍"})]})}),e.jsx("tbody",{children:(Tt=Qe.rows)==null?void 0:Tt.map((ne,_e)=>{const ut=ne.type==="break"||ne.mon==="ចេញលេង"||ne.tue==="ចេញលេង",wr=ne.type==="flag"||ne.mon==="គោរពទង់ជាតិ";return e.jsxs("tr",{className:\`border-b border-sky-200 \${ut?"bg-amber-100 font-bold":wr?"bg-rose-100 font-bold":"bg-white"}\`,children:[e.jsx("td",{className:"p-1 border border-sky-200 bg-teal-50/70 font-bold text-teal-900",children:e.jsx("input",{type:"text",value:ne.time,onChange:Rt=>Je(_e,"time",Rt.target.value),className:"w-full text-center bg-transparent outline-none font-bold text-xs p-0.5 hover:bg-purple-50 rounded"})}),e.jsx("td",{className:"p-1 border border-sky-200 bg-slate-50 text-slate-700",children:e.jsx("input",{type:"text",value:ne.duration,onChange:Rt=>Je(_e,"duration",Rt.target.value),className:"w-full text-center bg-transparent outline-none text-xs p-0.5 hover:bg-purple-50 rounded"})}),["mon","tue","wed","thu","fri","sat"].map(Rt=>{const Tr=(ze==null?void 0:ze.rowIndex)===_e&&(ze==null?void 0:ze.day)===Rt,sc=__ttSubjectColor(ne[Rt],false);return e.jsx("td",{className:\`p-1 border border-sky-200 transition \${ut?"bg-amber-100 text-amber-900":wr?"bg-rose-100 text-rose-900":sc.cls} \${Tr?"ring-2 ring-purple-600 font-bold":""}\`,children:e.jsx("input",{type:"text",value:ne[Rt]||"",onFocus:()=>qe({rowIndex:_e,day:Rt}),onChange:Lr=>Je(_e,Rt,Lr.target.value),className:"w-full text-center bg-transparent outline-none text-xs p-0.5 hover:bg-white/60 rounded font-bold"})},Rt)})]},_e)})})]})})`
);

// 5. FCe Classroom Rules Modal (Print HTML + Live Preview)
replaceExact(
  "FCe_rules_html_css_and_list",
  `    .title-banner {
      text-align: center;
      margin: 10px 0 14px 0;
      padding: 6px 0;
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      background: \${R?"#f3f4f6":"#f0fdf4"};
    }
    .title-banner h2 {
      font-size: 14pt;
      font-weight: 700;
      color: \${R?"#000":"#14532d"};
      letter-spacing: 0.5px;
    }
    .rules-list {
      margin-bottom: 15px;
    }
    .rule-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .rule-title {
      font-weight: 700;
      min-width: 75px;
      color: \${R?"#000":"#1e1b4b"};
    }`,
  `    .title-banner {
      text-align: center;
      margin: 10px 0 14px 0;
      padding: 8px 12px;
      border: \${R?"2px solid #000":"2px solid #8b5cf6"};
      border-radius: 10px;
      background: \${R?"#f3f4f6":"linear-gradient(135deg, #ede9fe, #e0f2fe)"};
    }
    .title-banner h2 {
      font-size: 14pt;
      font-weight: 700;
      color: \${R?"#000":"#5b21b6"};
      letter-spacing: 0.5px;
    }
    .rules-list {
      margin-bottom: 15px;
    }
    .rule-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 7px;
      padding: 6px 10px;
      border-radius: 8px;
      page-break-inside: avoid;
    }
    .rule-title {
      font-weight: 800;
      min-width: 78px;
      text-align: center;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 9.5pt;
      color: \${R?"#000":"#ffffff"};
    }`
);

replaceExact(
  "FCe_rules_html_list_items",
  `    <!-- Rules List -->
    <div class="rules-list">
      \${o.map(le=>\`
        <div class="rule-item">
          <div class="rule-title">\${le.title} ៖</div>
          <div class="rule-desc">\${le.description}</div>
        </div>
      \`).join("")}
    </div>`,
  `    <!-- Rules List -->
    <div class="rules-list">
      \${o.map((le,idx)=>{const cols=["#0284c7","#059669","#d97706","#e11d48","#4f46e5","#0d9488"],bgs=["#f0f9ff","#ecfdf5","#fffbeb","#fff1f2","#eef2ff","#f0fdfa"],c=cols[idx%cols.length],bg=bgs[idx%bgs.length];return\`
        <div class="rule-item" style="\${R?"border-bottom:1px solid #e2e8f0;":\`background-color:\${bg}; border-left: 4px solid \${c};\`}">
          <div class="rule-title" style="\${R?"background:#f1f5f9;color:#000;":\`background-color:\${c}; color:#ffffff;\`}">\${le.title}</div>
          <div class="rule-desc">\${le.description}</div>
        </div>
      \`;}).join("")}
    </div>`
);

replaceExact(
  "FCe_rules_modal_preview",
  `e.jsxs("div",{className:"text-center py-2.5 px-4 bg-purple-50 rounded-xl border border-purple-200 mb-4",children:[e.jsx("h2",{className:"font-moul text-base sm:text-lg text-purple-950",children:"បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន"}),e.jsxs("p",{className:"text-xs text-purple-900 font-bold mt-0.5",children:["ឆ្នាំសិក្សា ",M]})]}),e.jsxs("p",{className:"text-xs sm:text-sm font-medium mb-4 leading-relaxed text-slate-900",children:["យោងតាមសំណូមពរ និងការសម្រេចឯកភាពគ្នារវាងលោកគ្រូ អ្នកគ្រូ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ថ្នាក់ទី"," ",e.jsx("strong",{className:"text-purple-950 font-black",children:s.grade})," នៃ"," ",e.jsx("strong",{className:"text-purple-950 font-black",children:s.school})," បានដាក់ចេញនូវ"," ",e.jsx("strong",{className:"text-purple-950 font-black",children:"«បទបញ្ជាផ្ទៃក្នុង»"})," សម្រាប់អនុវត្តដូចតទៅ៖"]}),e.jsx("div",{className:"space-y-3 mb-6 text-xs sm:text-sm",children:o.map(R=>e.jsx("div",{className:"group relative flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50/60 border border-transparent hover:border-purple-200 transition",children:d===R.id?e.jsxs("div",{className:"flex-1 space-y-2 bg-white p-3 rounded-xl border border-purple-300 shadow-sm",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("input",{type:"text",value:h,onChange:J=>m(J.target.value),className:"w-28 px-2.5 py-1.5 border rounded-lg font-bold text-xs"}),e.jsx("input",{type:"text",value:w,onChange:J=>j(J.target.value),className:"flex-1 px-2.5 py-1.5 border rounded-lg text-xs"})]}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx("button",{type:"button",onClick:()=>u(null),className:"px-3 py-1 rounded bg-slate-200 text-slate-700 font-bold text-xs",children:"បោះបង់"}),e.jsx("button",{type:"button",onClick:()=>Y(R.id),className:"px-3 py-1 rounded bg-purple-900 text-white font-bold text-xs",children:"រក្សាទុក"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"font-bold text-purple-950 shrink-0 min-w-[75px]",children:[R.title," ៖"]}),e.jsx("div",{className:"flex-1 text-slate-800 leading-relaxed text-justify",children:R.description}),e.jsxs("div",{className:"no-print opacity-0 group-hover:opacity-100 transition flex items-center gap-1 shrink-0 bg-white shadow-sm border border-slate-200 rounded-lg p-1",children:[e.jsx("button",{type:"button",onClick:()=>Z(R),title:"កែសម្រួល",className:"p-1 hover:bg-purple-100 text-purple-700 rounded",children:e.jsx(Wa,{className:"w-3.5 h-3.5"})}),e.jsx("button",{type:"button",onClick:()=>U(R.id),title:"លុប",className:"p-1 hover:bg-rose-100 text-rose-600 rounded",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})]})]})},R.id))})`,
  `e.jsxs("div",{className:"text-center py-3 px-4 bg-gradient-to-r from-violet-100 via-sky-50 to-emerald-100 rounded-2xl border-2 border-violet-300 mb-4 shadow-xs",children:[e.jsx("h2",{className:"font-moul text-base sm:text-lg text-violet-900",children:"បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន"}),e.jsxs("p",{className:"text-xs text-violet-700 font-bold mt-0.5",children:["ឆ្នាំសិក្សា ",M]})]}),e.jsxs("p",{className:"text-xs sm:text-sm font-medium mb-4 leading-relaxed text-slate-900 bg-sky-50/70 border-l-4 border-sky-500 px-3.5 py-2.5 rounded-r-xl",children:["យោងតាមសំណូមពរ និងការសម្រេចឯកភាពគ្នារវាងលោកគ្រូ អ្នកគ្រូ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ថ្នាក់ទី"," ",e.jsx("strong",{className:"text-violet-900 font-black",children:s.grade})," នៃ"," ",e.jsx("strong",{className:"text-violet-900 font-black",children:s.school})," បានដាក់ចេញនូវ"," ",e.jsx("strong",{className:"text-violet-900 font-black",children:"«បទបញ្ជាផ្ទៃក្នុង»"})," សម្រាប់អនុវត្តដូចតទៅ៖"]}),e.jsx("div",{className:"space-y-2.5 mb-6 text-xs sm:text-sm",children:o.map((R,idx)=>{const pal=[{card:"bg-sky-50/70 border-sky-200 hover:border-sky-300",badge:"bg-sky-600 text-white"},{card:"bg-emerald-50/70 border-emerald-200 hover:border-emerald-300",badge:"bg-emerald-600 text-white"},{card:"bg-amber-50/70 border-amber-200 hover:border-amber-300",badge:"bg-amber-500 text-white"},{card:"bg-rose-50/70 border-rose-200 hover:border-rose-300",badge:"bg-rose-500 text-white"},{card:"bg-indigo-50/70 border-indigo-200 hover:border-indigo-300",badge:"bg-indigo-600 text-white"},{card:"bg-teal-50/70 border-teal-200 hover:border-teal-300",badge:"bg-teal-600 text-white"}][idx%6];return e.jsx("div",{className:\`group relative flex items-start gap-3 p-3 rounded-xl border transition \${pal.card}\`,children:d===R.id?e.jsxs("div",{className:"flex-1 space-y-2 bg-white p-3 rounded-xl border border-purple-300 shadow-sm",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("input",{type:"text",value:h,onChange:J=>m(J.target.value),className:"w-28 px-2.5 py-1.5 border rounded-lg font-bold text-xs"}),e.jsx("input",{type:"text",value:w,onChange:J=>j(J.target.value),className:"flex-1 px-2.5 py-1.5 border rounded-lg text-xs"})]}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx("button",{type:"button",onClick:()=>u(null),className:"px-3 py-1 rounded bg-slate-200 text-slate-700 font-bold text-xs",children:"បោះបង់"}),e.jsx("button",{type:"button",onClick:()=>Y(R.id),className:"px-3 py-1 rounded bg-purple-900 text-white font-bold text-xs",children:"រក្សាទុក"})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:\`font-extrabold shrink-0 min-w-[78px] text-center px-2.5 py-0.5 rounded-full text-xs shadow-2xs \${pal.badge}\`,children:R.title}),e.jsx("div",{className:"flex-1 text-slate-800 leading-relaxed text-justify font-medium",children:R.description}),e.jsxs("div",{className:"no-print opacity-0 group-hover:opacity-100 transition flex items-center gap-1 shrink-0 bg-white shadow-sm border border-slate-200 rounded-lg p-1",children:[e.jsx("button",{type:"button",onClick:()=>Z(R),title:"កែសម្រួល",className:"p-1 hover:bg-purple-100 text-purple-700 rounded",children:e.jsx(Wa,{className:"w-3.5 h-3.5"})}),e.jsx("button",{type:"button",onClick:()=>U(R.id),title:"លុប",className:"p-1 hover:bg-rose-100 text-rose-600 rounded",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})]})]})},R.id)})})`
);

// 6. sec2 timetable sub-tab button
replaceExact(
  "sec2_timetable_subtab",
  `q==="sec2"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"no-print flex gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar",children:[{id:"timetable",label:"កាលវិភាគបង្រៀន",icon:Is},{id:"syllabus",label:"កម្មវិធីប្រចាំឆ្នាំ/ត្រីមាស",icon:Za},{id:"lessonplan",label:"កិច្ចតែងការបង្រៀន (Lesson Plan)",icon:Rx},{id:"slides",label:"ស្លាយបង្រៀន",icon:gh},{id:"assessment",label:"កញ្ចប់ឯកសារវាយតម្លៃ (Rubrics)",icon:Vs}].map(oe=>{const ft=oe.icon,ir=le===oe.id;return e.jsxs("button",{onClick:()=>me(oe.id),className:\`px-3.5 py-2.5 rounded-2xl shrink-0 transition flex items-center gap-2 \${ir?"bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold":"bg-gradient-to-r from-white to-purple-50/50 hover:bg-purple-50 text-slate-800 border border-purple-200/60 shadow-2xs font-semibold"}\`,children:[e.jsx(ft,{className:\`w-4 h-4 \${ir?"text-amber-300":"text-slate-500"}\`}),e.jsx("span",{children:oe.label})]},oe.id)})})`,
  `q==="sec2"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"no-print flex gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar",children:[{id:"timetable",label:"កាលវិភាគបង្រៀន",icon:Is},{id:"syllabus",label:"កម្មវិធីប្រចាំឆ្នាំ/ត្រីមាស",icon:Za},{id:"lessonplan",label:"កិច្ចតែងការបង្រៀន (Lesson Plan)",icon:Rx},{id:"slides",label:"ស្លាយបង្រៀន",icon:gh},{id:"assessment",label:"កញ្ចប់ឯកសារវាយតម្លៃ (Rubrics)",icon:Vs}].map(oe=>{const ft=oe.icon,ir=le===oe.id,actCls=oe.id==="timetable"?"bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20 font-bold":"bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold";return e.jsxs("button",{onClick:()=>me(oe.id),className:\`px-3.5 py-2.5 rounded-2xl shrink-0 transition flex items-center gap-2 cursor-pointer \${ir?actCls:"bg-white hover:bg-sky-50 text-slate-800 border border-slate-200 hover:border-sky-300 shadow-2xs font-semibold"}\`,children:[e.jsx(ft,{className:\`w-4 h-4 \${ir?"text-white":"text-slate-500"}\`}),e.jsx("span",{children:oe.label})]},oe.id)})})`
);

// 7. sec3 sub-tab buttons + inventory UI + rules UI
replaceExact(
  "sec3_subtabs_inventory_rules",
  `const actCls=oe.id==="seating"?"bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-bold":oe.id==="sanitation_committee"?"bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md font-bold":"bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold";`,
  `const actCls=oe.id==="seating"?"bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-bold":oe.id==="sanitation_committee"?"bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md font-bold":oe.id==="rules"?"bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/20 font-bold":oe.id==="inventory"?"bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 font-bold":"bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold";`
);

replaceExact(
  "sec3_inventory_cards",
  `ue==="inventory"&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-[28px] border border-slate-200/80 shadow-xs",children:[e.jsxs("div",{children:[e.jsxs("h3",{className:"font-extrabold text-base text-slate-900 flex items-center gap-2",children:[e.jsx(Lg,{className:"w-5 h-5 text-amber-600"}),e.jsx("span",{children:"បញ្ជីសារពើភណ្ឌថ្នាក់រៀន (Inventory)"})]}),e.jsx("p",{className:"text-xs text-slate-500 mt-1",children:"គ្រប់គ្រងចំនួន និងស្ថានភាពសម្ភារ (តុ, កៅអី, ក្តារខៀន, កង្ហារ, អំពូលភ្លើង, ធ្នើសៀវភៅ) និងស្នើសុំជួសជុល"})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("button",{type:"button",onClick:()=>hd(!0),className:"px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-red-600/20 active:scale-95",title:"កំណត់ និងកែសម្រួលទម្រង់ឯកសារមុនទាញយកជា PDF",children:[e.jsx(Vs,{className:"w-4 h-4 text-red-200"}),e.jsx("span",{children:"ទាញយក / កែសម្រួល PDF"})]}),e.jsxs("button",{onClick:()=>it(!0),className:"no-print bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-md shadow-amber-600/20 active:scale-95 flex items-center gap-2",children:[e.jsx(ca,{className:"w-4 h-4"})," បន្ថែមសម្ភារថ្មី"]})]})]}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",children:T.map(oe=>e.jsxs("div",{className:"bg-white p-4 rounded-[22px] border border-slate-200/80 shadow-xs hover:border-amber-300 transition space-y-3 flex flex-col justify-between",children:[e.jsxs("div",{className:"flex justify-between items-start gap-2",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 inline-block mb-1",children:oe.category}),e.jsx("h4",{className:"font-extrabold text-slate-900 text-sm",children:oe.name})]}),e.jsx("div",{className:"w-9 h-9 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center font-black text-amber-700 text-xs shadow-inner shrink-0",children:oe.qty})]}),e.jsxs("div",{className:"flex justify-between items-center pt-2 border-t border-slate-100 text-[11px]",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"text-slate-500 font-medium",children:"ស្ថានភាព៖"}),e.jsx("span",{className:\`px-2.5 py-0.5 rounded-full font-bold border \${oe.condition==="ល្អ"?"bg-emerald-50 text-emerald-800 border-emerald-200/60":oe.condition==="មធ្យម"?"bg-amber-50 text-amber-800 border-amber-200/60":"bg-red-50 text-red-800 border-red-200/60"}\`,children:oe.condition})]}),e.jsxs("div",{className:"flex items-center gap-1 no-print",children:[e.jsx("button",{type:"button",onClick:()=>{oi(oe),ll(oe.name),Bi(oe.qty),z0(oe.condition),Pp(oe.category||"សម្ភារថ្នាក់រៀន"),na(!0)},className:"p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition",title:"កែសម្រួលសម្ភារ",children:e.jsx(Wa,{className:"w-3.5 h-3.5"})}),e.jsx("button",{type:"button",onClick:()=>{confirm(\`តើអ្នកពិតជាចង់លុបសម្ភារ "\${oe.name}" នេះមែនទេ?\`)&&(H(oe.id),F("បានលុបសម្ភារចេញពីសារពើភណ្ឌ!"))},className:"p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 transition",title:"លុបសម្ភារ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})]})]})]},oe.id))})]})`,
  `ue==="inventory"&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-amber-50/90 via-white to-orange-50/70 p-5 rounded-[28px] border-2 border-amber-200 shadow-xs",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shrink-0",children:e.jsx(Lg,{className:"w-5 h-5"})}),e.jsxs("div",{children:[e.jsxs("h3",{className:"font-extrabold text-base text-slate-900 flex items-center gap-2",children:[e.jsx("span",{children:"បញ្ជីសារពើភណ្ឌថ្នាក់រៀន (Inventory)"}),e.jsxs("span",{className:"px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-black",children:[T.length," មុខ"]})]}),e.jsx("p",{className:"text-xs text-slate-600 mt-0.5",children:"គ្រប់គ្រងចំនួន និងស្ថានភាពសម្ភារ (តុ, កៅអី, ក្តារខៀន, កង្ហារ, អំពូលភ្លើង, ធ្នើសៀវភៅ) និងស្នើសុំជួសជុល"})]})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("button",{type:"button",onClick:()=>hd(!0),className:"px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-rose-500/20 active:scale-95 cursor-pointer",title:"កំណត់ និងកែសម្រួលទម្រង់ឯកសារមុនទាញយកជា PDF",children:[e.jsx(Vs,{className:"w-4 h-4 text-rose-100"}),e.jsx("span",{children:"ទាញយក / កែសម្រួល PDF"})]}),e.jsxs("button",{onClick:()=>it(!0),className:"no-print bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold transition shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-2 cursor-pointer",children:[e.jsx(ca,{className:"w-4 h-4"})," បន្ថែមសម្ភារថ្មី"]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3",children:[e.jsxs("div",{className:"bg-gradient-to-br from-sky-50 to-white border border-sky-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-[11px] font-bold text-sky-700",children:"ប្រភេទសម្ភារ"}),e.jsx("div",{className:"text-xl font-black text-sky-950 mt-0.5",children:T.length})]}),e.jsx("div",{className:"w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-sm shadow-xs",children:"📦"})]}),e.jsxs("div",{className:"bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-[11px] font-bold text-indigo-700",children:"បរិមាណសរុប"}),e.jsx("div",{className:"text-xl font-black text-indigo-950 mt-0.5",children:T.reduce((a,b)=>a+(Number(b.qty)||0),0)})]}),e.jsx("div",{className:"w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs",children:"🪑"})]}),e.jsxs("div",{className:"bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-[11px] font-bold text-emerald-700",children:"ស្ថានភាពល្អ"}),e.jsx("div",{className:"text-xl font-black text-emerald-900 mt-0.5",children:T.filter(x=>x.condition==="ល្អ").length})]}),e.jsx("div",{className:"w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-xs",children:"✅"})]}),e.jsxs("div",{className:"bg-gradient-to-br from-rose-50 to-white border border-rose-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-[11px] font-bold text-rose-700",children:"មធ្យម / ជួសជុល"}),e.jsx("div",{className:"text-xl font-black text-rose-900 mt-0.5",children:T.filter(x=>x.condition!=="ល្អ").length})]}),e.jsx("div",{className:"w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-sm shadow-xs",children:"🛠️"})]})]}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5",children:T.map((oe,idx)=>{const isGood=oe.condition==="ល្អ",isMed=oe.condition==="មធ្យម",catPal=[{bar:"bg-sky-500",badge:"bg-sky-100 text-sky-900 border-sky-200",qty:"from-sky-500 to-blue-600"},{bar:"bg-emerald-500",badge:"bg-emerald-100 text-emerald-900 border-emerald-200",qty:"from-emerald-500 to-teal-600"},{bar:"bg-amber-500",badge:"bg-amber-100 text-amber-900 border-amber-200",qty:"from-amber-500 to-orange-600"},{bar:"bg-indigo-500",badge:"bg-indigo-100 text-indigo-900 border-indigo-200",qty:"from-indigo-500 to-violet-600"},{bar:"bg-rose-500",badge:"bg-rose-100 text-rose-900 border-rose-200",qty:"from-rose-500 to-pink-600"},{bar:"bg-teal-500",badge:"bg-teal-100 text-teal-900 border-teal-200",qty:"from-teal-500 to-cyan-600"}][idx%6];return e.jsxs("div",{className:\`overflow-hidden rounded-[22px] border-2 shadow-xs hover:shadow-md transition flex flex-col justify-between \${isGood?"bg-gradient-to-br from-emerald-50/40 via-white to-sky-50/30 border-emerald-200/80 hover:border-emerald-300":isMed?"bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 border-amber-200 hover:border-amber-300":"bg-gradient-to-br from-rose-50/70 via-white to-red-50/40 border-rose-200 hover:border-rose-300"}\`,children:[e.jsx("div",{className:\`h-1.5 w-full \${catPal.bar}\`}),e.jsxs("div",{className:"p-4 space-y-3 flex-1 flex flex-col justify-between",children:[e.jsxs("div",{className:"flex justify-between items-start gap-2",children:[e.jsxs("div",{children:[e.jsx("span",{className:\`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border inline-block mb-1.5 \${catPal.badge}\`,children:oe.category}),e.jsx("h4",{className:"font-extrabold text-slate-900 text-sm",children:oe.name})]}),e.jsx("div",{className:\`w-10 h-10 rounded-2xl bg-gradient-to-br \${catPal.qty} text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0\`,children:oe.qty})]}),e.jsxs("div",{className:"flex justify-between items-center pt-2.5 border-t border-slate-200/70 text-[11px]",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"text-slate-500 font-bold",children:"ស្ថានភាព៖"}),e.jsx("span",{className:\`px-2.5 py-0.5 rounded-full font-extrabold border \${isGood?"bg-emerald-100 text-emerald-900 border-emerald-300":isMed?"bg-amber-100 text-amber-900 border-amber-300":"bg-rose-100 text-rose-900 border-rose-300"}\`,children:oe.condition})]}),e.jsxs("div",{className:"flex items-center gap-1 no-print",children:[e.jsx("button",{type:"button",onClick:()=>{oi(oe),ll(oe.name),Bi(oe.qty),z0(oe.condition),Pp(oe.category||"សម្ភារថ្នាក់រៀន"),na(!0)},className:"p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition cursor-pointer",title:"កែសម្រួលសម្ភារ",children:e.jsx(Wa,{className:"w-3.5 h-3.5"})}),e.jsx("button",{type:"button",onClick:()=>{confirm(\`តើអ្នកពិតជាចង់លុបសម្ភារ "\${oe.name}" នេះមែនទេ?\`)&&(H(oe.id),F("បានលុបសម្ភារចេញពីសារពើភណ្ឌ!"))},className:"p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer",title:"លុបសម្ភារ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})]})]})]})]},oe.id)})})]})`
);

replaceExact(
  "sec3_rules_cards",
  `ue==="rules"&&e.jsxs("div",{className:"bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-6",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-100",children:[e.jsxs("div",{children:[e.jsxs("h3",{className:"font-extrabold text-base text-slate-900 flex items-center gap-2",children:[e.jsx(qa,{className:"w-5 h-5 text-purple-700"}),e.jsxs("span",{children:["បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន (Classroom Rules - ",_d.length," ប្រការ)"]})]}),e.jsx("p",{className:"text-xs text-slate-500 mt-0.5",children:"បទដ្ឋានរួមដែលគ្រូ និងសិស្សព្រមព្រៀងគ្នា (ការស្លៀកពាក់, វិន័យម៉ោងពេល, អនាម័យ, ការគោរពគ្នា)"})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("button",{type:"button",onClick:()=>_i(!0),className:"px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs transition flex items-center gap-1.5 active:scale-95",children:[e.jsx(ca,{className:"w-4 h-4"}),e.jsx("span",{children:"បន្ថែមប្រការថ្មី"})]}),e.jsxs("button",{type:"button",onClick:()=>G0(!0),className:"px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-red-600/20 active:scale-95",title:"កំណត់ និងកែសម្រួលទម្រង់ឯកសារមុនទាញយកជា PDF",children:[e.jsx(Vs,{className:"w-4 h-4 text-red-200"}),e.jsx("span",{children:"ទាញយក / កែសម្រួល PDF"})]}),e.jsxs("button",{type:"button",onClick:()=>gc(!0),className:"px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-800 hover:from-purple-800 hover:to-indigo-700 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-purple-900/20 active:scale-95",children:[e.jsx(ts,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{children:"រៀបចំ និងបោះពុម្ព A4 ១០០%"})]})]})]}),r5&&e.jsxs("div",{className:"bg-purple-50/70 border border-purple-200 p-4 rounded-2xl space-y-3",children:[e.jsx("h4",{className:"font-bold text-xs text-purple-950 uppercase tracking-wide",children:"បន្ថែមប្រការថ្មី"}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[e.jsx("input",{type:"text",placeholder:"ចំណងជើង (ឧ. ប្រការ១៣)",value:mn,onChange:oe=>Sa(oe.target.value),className:"px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white"}),e.jsx("input",{type:"text",placeholder:"ខ្លឹមសារប្រការ...",value:Ud,onChange:oe=>vc(oe.target.value),className:"px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white sm:col-span-2"})]}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx("button",{type:"button",onClick:()=>_i(!1),className:"px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold",children:"បោះបង់"}),e.jsx("button",{type:"button",onClick:()=>{if(!mn.trim()||!Ud.trim())return;const oe=Math.max(0,..._d.map(ft=>ft.id))+1;zf([..._d,{id:oe,title:mn.trim(),description:Ud.trim()}]),Sa(""),vc(""),_i(!1)},className:"px-4 py-1.5 rounded-lg bg-purple-900 text-white text-xs font-bold hover:bg-purple-800",children:"រក្សាទុក"})]})]}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",children:_d.map((oe,ft)=>e.jsxs("div",{className:"bg-gradient-to-br from-slate-50 to-purple-50/40 p-4 rounded-2xl border border-slate-200/80 space-y-2 relative group hover:shadow-sm transition",children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsx("span",{className:"px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 font-extrabold text-xs",children:oe.title}),e.jsxs("div",{className:"flex items-center gap-1 opacity-0 group-hover:opacity-100 transition",children:[e.jsx("button",{type:"button",onClick:()=>{Jd(oe.id),Xv(oe.title),jx(oe.description)},className:"p-1.5 rounded-lg hover:bg-purple-200 text-purple-800",title:"កែសម្រួល",children:e.jsx(Wa,{className:"w-3.5 h-3.5"})}),e.jsx("button",{type:"button",onClick:()=>{confirm("តើអ្នកពិតជាចង់លុបប្រការនេះមែនទេ?")&&zf(_d.filter(ir=>ir.id!==oe.id))},className:"p-1.5 rounded-lg hover:bg-rose-100 text-rose-700",title:"លុប",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})]})]}),Fv===oe.id?e.jsxs("div",{className:"space-y-2 pt-1",children:[e.jsx("input",{type:"text",value:zv,onChange:ir=>Xv(ir.target.value),className:"w-full px-2.5 py-1 text-xs rounded border border-purple-300 font-bold"}),e.jsx("textarea",{value:yu,onChange:ir=>jx(ir.target.value),className:"w-full px-2.5 py-1 text-xs rounded border border-purple-300 h-16 resize-none"}),e.jsxs("div",{className:"flex justify-end gap-1.5",children:[e.jsx("button",{type:"button",onClick:()=>Jd(null),className:"px-2 py-1 rounded bg-slate-200 text-slate-700 text-[10px] font-bold",children:"បោះបង់"}),e.jsx("button",{type:"button",onClick:()=>{zf(_d.map(ir=>ir.id===oe.id?{...ir,title:zv,description:yu}:ir)),Jd(null)},className:"px-2.5 py-1 rounded bg-purple-900 text-white text-[10px] font-bold",children:"រក្សាទុក"})]})]}):e.jsx("div",{children:e.jsx("p",{className:"text-xs text-slate-700 mt-1 leading-relaxed",children:oe.description})})]},oe.id))})]})`,
  `ue==="rules"&&e.jsxs("div",{className:"bg-gradient-to-b from-violet-50/40 via-white to-sky-50/30 p-6 rounded-[28px] border-2 border-violet-200/80 shadow-xs space-y-6",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-violet-100",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-md shrink-0",children:e.jsx(qa,{className:"w-5 h-5"})}),e.jsxs("div",{children:[e.jsxs("h3",{className:"font-extrabold text-base text-slate-900 flex items-center gap-2 flex-wrap",children:[e.jsx("span",{children:"បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន (Classroom Rules)"}),e.jsxs("span",{className:"px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-900 border border-violet-200 text-[11px] font-black",children:[_d.length," ប្រការ"]})]}),e.jsx("p",{className:"text-xs text-slate-600 mt-0.5",children:"បទដ្ឋានរួមដែលគ្រូ និងសិស្សព្រមព្រៀងគ្នា (ការស្លៀកពាក់, វិន័យម៉ោងពេល, អនាម័យ, ការគោរពគ្នា)"})]})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("button",{type:"button",onClick:()=>_i(!0),className:"px-3.5 py-2 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-900 border border-violet-200 font-bold text-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer",children:[e.jsx(ca,{className:"w-4 h-4"}),e.jsx("span",{children:"បន្ថែមប្រការថ្មី"})]}),e.jsxs("button",{type:"button",onClick:()=>G0(!0),className:"px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-rose-500/20 active:scale-95 cursor-pointer",title:"កំណត់ និងកែសម្រួលទម្រង់ឯកសារមុនទាញយកជា PDF",children:[e.jsx(Vs,{className:"w-4 h-4 text-rose-100"}),e.jsx("span",{children:"ទាញយក / កែសម្រួល PDF"})]}),e.jsxs("button",{type:"button",onClick:()=>gc(!0),className:"px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-violet-600/20 active:scale-95 cursor-pointer",children:[e.jsx(ts,{className:"w-4 h-4 text-amber-200"}),e.jsx("span",{children:"រៀបចំ និងបោះពុម្ព A4 ១០០%"})]})]})]}),r5&&e.jsxs("div",{className:"bg-violet-50 border border-violet-200 p-4 rounded-2xl space-y-3",children:[e.jsx("h4",{className:"font-bold text-xs text-violet-950 uppercase tracking-wide",children:"បន្ថែមប្រការថ្មី"}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[e.jsx("input",{type:"text",placeholder:"ចំណងជើង (ឧ. ប្រការ១៣)",value:mn,onChange:oe=>Sa(oe.target.value),className:"px-3 py-2 text-xs rounded-xl border border-violet-200 bg-white"}),e.jsx("input",{type:"text",placeholder:"ខ្លឹមសារប្រការ...",value:Ud,onChange:oe=>vc(oe.target.value),className:"px-3 py-2 text-xs rounded-xl border border-violet-200 bg-white sm:col-span-2"})]}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx("button",{type:"button",onClick:()=>_i(!1),className:"px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold",children:"បោះបង់"}),e.jsx("button",{type:"button",onClick:()=>{if(!mn.trim()||!Ud.trim())return;const oe=Math.max(0,..._d.map(ft=>ft.id))+1;zf([..._d,{id:oe,title:mn.trim(),description:Ud.trim()}]),Sa(""),vc(""),_i(!1)},className:"px-4 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-bold hover:bg-violet-700",children:"រក្សាទុក"})]})]}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5",children:_d.map((oe,ft)=>{const pal=[{bar:"bg-sky-500",card:"bg-gradient-to-br from-sky-50/80 via-white to-blue-50/40 border-sky-200 hover:border-sky-300",badge:"bg-gradient-to-r from-sky-500 to-blue-600 text-white"},{bar:"bg-emerald-500",card:"bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border-emerald-200 hover:border-emerald-300",badge:"bg-gradient-to-r from-emerald-500 to-teal-600 text-white"},{bar:"bg-amber-500",card:"bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/40 border-amber-200 hover:border-amber-300",badge:"bg-gradient-to-r from-amber-500 to-orange-500 text-white"},{bar:"bg-rose-500",card:"bg-gradient-to-br from-rose-50/80 via-white to-pink-50/40 border-rose-200 hover:border-rose-300",badge:"bg-gradient-to-r from-rose-500 to-pink-600 text-white"},{bar:"bg-indigo-500",card:"bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40 border-indigo-200 hover:border-indigo-300",badge:"bg-gradient-to-r from-indigo-500 to-violet-600 text-white"},{bar:"bg-teal-500",card:"bg-gradient-to-br from-teal-50/80 via-white to-cyan-50/40 border-teal-200 hover:border-teal-300",badge:"bg-gradient-to-r from-teal-500 to-cyan-600 text-white"}][ft%6];return e.jsxs("div",{className:\`overflow-hidden rounded-2xl border-2 relative group hover:shadow-md transition flex flex-col \${pal.card}\`,children:[e.jsx("div",{className:\`h-1.5 w-full \${pal.bar}\`}),e.jsxs("div",{className:"p-4 space-y-2.5 flex-1",children:[e.jsxs("div",{className:"flex justify-between items-start gap-2",children:[e.jsx("span",{className:\`px-3 py-1 rounded-full font-extrabold text-xs shadow-2xs \${pal.badge}\`,children:oe.title}),e.jsxs("div",{className:"flex items-center gap-1 opacity-0 group-hover:opacity-100 transition",children:[e.jsx("button",{type:"button",onClick:()=>{Jd(oe.id),Xv(oe.title),jx(oe.description)},className:"p-1.5 rounded-lg bg-white/80 hover:bg-violet-100 text-violet-700 border border-violet-200",title:"កែសម្រួល",children:e.jsx(Wa,{className:"w-3.5 h-3.5"})}),e.jsx("button",{type:"button",onClick:()=>{confirm("តើអ្នកពិតជាចង់លុបប្រការនេះមែនទេ?")&&zf(_d.filter(ir=>ir.id!==oe.id))},className:"p-1.5 rounded-lg bg-white/80 hover:bg-rose-100 text-rose-600 border border-rose-200",title:"លុប",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})]})]}),Fv===oe.id?e.jsxs("div",{className:"space-y-2 pt-1",children:[e.jsx("input",{type:"text",value:zv,onChange:ir=>Xv(ir.target.value),className:"w-full px-2.5 py-1 text-xs rounded border border-violet-300 font-bold bg-white"}),e.jsx("textarea",{value:yu,onChange:ir=>jx(ir.target.value),className:"w-full px-2.5 py-1 text-xs rounded border border-violet-300 h-16 resize-none bg-white"}),e.jsxs("div",{className:"flex justify-end gap-1.5",children:[e.jsx("button",{type:"button",onClick:()=>Jd(null),className:"px-2 py-1 rounded bg-slate-200 text-slate-700 text-[10px] font-bold",children:"បោះបង់"}),e.jsx("button",{type:"button",onClick:()=>{zf(_d.map(ir=>ir.id===oe.id?{...ir,title:zv,description:yu}:ir)),Jd(null)},className:"px-2.5 py-1 rounded bg-violet-600 text-white text-[10px] font-bold",children:"រក្សាទុក"})]})]}):e.jsx("div",{children:e.jsx("p",{className:"text-xs text-slate-800 mt-1 leading-relaxed font-medium",children:oe.description})})]})]},oe.id)})})]})`
);

// 8. Rules & Inventory PDF customTableHtml (Oi)
replaceExact(
  "Oi_rules_and_inventory_pdf_html",
  `              <div style="font-family: inherit; font-size: 11pt; color: #1e293b; line-height: 1.6;">
                <div style="margin-bottom: 14px; font-weight: 600; text-indent: 20px;">
                  យោងតាមសំណូមពរ និងការសម្រេចឯកភាពគ្នារវាងលោកគ្រូ អ្នកគ្រូ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ថ្នាក់ទី <b>\${r.grade||"ថ្នាក់ទី ៤A"}</b> នៃ <b>\${r.school||"សាលាបឋមសិក្សាគំរូ"}</b> បានដាក់ចេញនូវ <b>«បទបញ្ជាផ្ទៃក្នុង»</b> សម្រាប់អនុវត្តដូចតទៅ៖
                </div>
                <div style="margin-bottom: 15px;">
                  \${_d.map(ft=>\`
                    <div style="display: flex; align-items: flex-start; margin-bottom: 10px; page-break-inside: avoid;">
                      <div style="font-weight: 700; min-width: 85px; color: #1e1b4b;">\${ft.title} ៖</div>
                      <div style="flex: 1; text-align: justify;">\${ft.description}</div>
                    </div>
                  \`).join("")}
                </div>
                <div style="margin-top: 15px; font-style: italic; font-size: 10pt; text-align: center; page-break-inside: avoid;">
                  សិស្សទាំងអស់ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ត្រូវអាន យល់ដឹង និងអនុវត្តតាមបទបញ្ជាផ្ទៃក្នុងនេះឱ្យបានខ្ជាប់ខ្ជួន។
                </div>
              </div>
            \`,onShowToast:F})})(),(()=>{const oe=r.academicYear||"២០២៥ - ២០២៦";return e.jsx(Oi,{isOpen:qd,onClose:()=>hd(!1),documentType:"general",title:"កំណត់ទម្រង់ & ទាញយក PDF បញ្ជីសារពើភណ្ឌថ្នាក់រៀន",initialHeader:{docTitle:"បញ្ជីសារពើភណ្ឌសម្ភារឧបទេស និងទ្រព្យសម្បត្តិថ្នាក់រៀន",docSubtitle:\`ស្ថិតិ និងស្ថានភាពសម្ភារប្រើប្រាស់ក្នុងថ្នាក់ ឆ្នាំសិក្សា \${oe}\`,schoolName:r.school||"សាលាបឋមសិក្សាគំរូ",teacherName:r.name||"",gradeLevel:r.grade||"ថ្នាក់ទី ៤A",academicYear:oe,officeInfo:"មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី"},customTableHtml:\`
              <div style="font-family: inherit; font-size: 10pt; color: #1e293b;">
                <div style="margin-bottom: 12px; font-weight: bold;">
                  បញ្ជីរាយនាមសម្ភារ តុ កៅអី ក្តារខៀន កង្ហារ អំពូលភ្លើង និងសម្ភារឧបទេសប្រចាំថ្នាក់ទី <b>\${r.grade||"ថ្នាក់ទី ៤A"}</b>៖
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                  <thead>
                    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 45px;">ល.រ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">ឈ្មោះសម្ភារ / ប្រភេទ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 100px;">ប្រភេទ / ក្រុម</th>
                      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 70px;">បរិមាណ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 110px;">ស្ថានភាព</th>
                    </tr>
                  </thead>
                  <tbody>
                    \${T.map((ft,ir)=>\`
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">\${ir+1}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold;">\${ft.name}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">\${ft.category}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold;">\${ft.qty}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold; color: \${ft.condition==="ល្អ"?"#047857":ft.condition==="មធ្យម"?"#b45309":"#b91c1c"};">\${ft.condition}</td>
                      </tr>
                    \`).join("")}
                  </tbody>
                </table>

              </div>`,
  `              <div style="font-family: inherit; font-size: 10.5pt; color: #1e293b; line-height: 1.55;">
                <div style="margin-bottom: 12px; font-weight: 600; text-indent: 18px; background: linear-gradient(90deg, #f5f3ff, #e0f2fe); border-left: 4px solid #7c3aed; border-radius: 8px; padding: 10px 14px;">
                  យោងតាមសំណូមពរ និងការសម្រេចឯកភាពគ្នារវាងលោកគ្រូ អ្នកគ្រូ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ថ្នាក់ទី <b style="color:#5b21b6;">\${r.grade||"ថ្នាក់ទី ៤A"}</b> នៃ <b style="color:#5b21b6;">\${r.school||"សាលាបឋមសិក្សាគំរូ"}</b> បានដាក់ចេញនូវ <b style="color:#5b21b6;">«បទបញ្ជាផ្ទៃក្នុង»</b> សម្រាប់អនុវត្តដូចតទៅ៖
                </div>
                <div style="margin-bottom: 14px;">
                  \${_d.map((ft,idx)=>{const cols=["#0284c7","#059669","#d97706","#e11d48","#4f46e5","#0d9488"],bgs=["#f0f9ff","#ecfdf5","#fffbeb","#fff1f2","#eef2ff","#f0fdfa"],c=cols[idx%cols.length],bg=bgs[idx%bgs.length];return\`
                    <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; padding: 7px 10px; background-color: \${bg}; border-left: 4px solid \${c}; border-radius: 8px; page-break-inside: avoid;">
                      <div style="font-weight: 800; min-width: 82px; text-align: center; padding: 2px 8px; border-radius: 999px; background-color: \${c}; color: #ffffff; font-size: 9.5pt;">\${ft.title}</div>
                      <div style="flex: 1; text-align: justify; color: #0f172a;">\${ft.description}</div>
                    </div>
                  \`;}).join("")}
                </div>
                <div style="margin-top: 12px; font-style: italic; font-weight: 700; font-size: 9.5pt; text-align: center; color: #5b21b6; background-color: #faf5ff; border: 1px dashed #c4b5fd; border-radius: 8px; padding: 8px 12px; page-break-inside: avoid;">
                  សិស្សទាំងអស់ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ត្រូវអាន យល់ដឹង និងអនុវត្តតាមបទបញ្ជាផ្ទៃក្នុងនេះឱ្យបានខ្ជាប់ខ្ជួន។
                </div>
              </div>
            \`,onShowToast:F})})(),(()=>{const oe=r.academicYear||"២០២៥ - ២០២៦";return e.jsx(Oi,{isOpen:qd,onClose:()=>hd(!1),documentType:"general",title:"កំណត់ទម្រង់ & ទាញយក PDF បញ្ជីសារពើភណ្ឌថ្នាក់រៀន",initialHeader:{docTitle:"បញ្ជីសារពើភណ្ឌសម្ភារឧបទេស និងទ្រព្យសម្បត្តិថ្នាក់រៀន",docSubtitle:\`ស្ថិតិ និងស្ថានភាពសម្ភារប្រើប្រាស់ក្នុងថ្នាក់ ឆ្នាំសិក្សា \${oe}\`,schoolName:r.school||"សាលាបឋមសិក្សាគំរូ",teacherName:r.name||"",gradeLevel:r.grade||"ថ្នាក់ទី ៤A",academicYear:oe,officeInfo:"មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី"},customTableHtml:\`
              <div style="font-family: inherit; font-size: 10pt; color: #1e293b;">
                <div style="margin-bottom: 12px; font-weight: bold; background: linear-gradient(90deg, #fffbeb, #fff7ed); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 8px 12px; color: #78350f;">
                  បញ្ជីរាយនាមសម្ភារ តុ កៅអី ក្តារខៀន កង្ហារ អំពូលភ្លើង និងសម្ភារឧបទេសប្រចាំថ្នាក់ទី <b>\${r.grade||"ថ្នាក់ទី ៤A"}</b>៖
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                  <thead>
                    <tr style="background: linear-gradient(90deg, #f59e0b, #ea580c); color: #ffffff;">
                      <th style="border: 1px solid #d97706; padding: 8px; text-align: center; width: 45px;">ល.រ</th>
                      <th style="border: 1px solid #d97706; padding: 8px; text-align: left;">ឈ្មោះសម្ភារ / ប្រភេទ</th>
                      <th style="border: 1px solid #d97706; padding: 8px; text-align: center; width: 110px;">ប្រភេទ / ក្រុម</th>
                      <th style="border: 1px solid #d97706; padding: 8px; text-align: center; width: 75px;">បរិមាណ</th>
                      <th style="border: 1px solid #d97706; padding: 8px; text-align: center; width: 115px;">ស្ថានភាព</th>
                    </tr>
                  </thead>
                  <tbody>
                    \${T.map((ft,ir)=>{const cBg=ft.condition==="ល្អ"?"#dcfce7":ft.condition==="មធ្យម"?"#fef3c7":"#ffe4e6",cTx=ft.condition==="ល្អ"?"#047857":ft.condition==="មធ្យម"?"#b45309":"#be123c";return\`
                      <tr style="background-color: \${ir%2===0?"#ffffff":"#fffbeb"};">
                        <td style="border: 1px solid #fde68a; padding: 7px; text-align: center; font-weight: bold; color: #92400e;">\${ir+1}</td>
                        <td style="border: 1px solid #fde68a; padding: 7px; font-weight: bold; color: #0f172a;">\${ft.name}</td>
                        <td style="border: 1px solid #fde68a; padding: 7px; text-align: center;"><span style="background-color: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 999px; font-size: 8.5pt; font-weight: bold;">\${ft.category}</span></td>
                        <td style="border: 1px solid #fde68a; padding: 7px; text-align: center; font-weight: 800; color: #b45309;">\${ft.qty}</td>
                        <td style="border: 1px solid #fde68a; padding: 7px; text-align: center;"><span style="background-color: \${cBg}; color: \${cTx}; padding: 2px 10px; border-radius: 999px; font-weight: bold; font-size: 8.5pt;">\${ft.condition}</span></td>
                      </tr>
                    \`;}).join("")}
                    <tr style="background-color: #fef3c7; font-weight: bold; color: #78350f;">
                      <td colspan="3" style="border: 1px solid #f59e0b; padding: 7px 10px; text-align: right;">សរុបរួម (\${T.length} មុខ)</td>
                      <td style="border: 1px solid #f59e0b; padding: 7px; text-align: center; font-size: 10.5pt; color: #c2410c;">\${T.reduce((a,b)=>a+(Number(b.qty)||0),0)}</td>
                      <td style="border: 1px solid #f59e0b; padding: 7px; text-align: center;">ល្អ៖ \${T.filter(x=>x.condition==="ល្អ").length}</td>
                    </tr>
                  </tbody>
                </table>

              </div>`
);

// Parse validation with TypeScript before saving!
const sf = ts.createSourceFile("bundle.js", src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("PARSE ERRORS:", sf.parseDiagnostics.slice(0, 5).map(d => d.messageText));
  process.exit(1);
}

fs.writeFileSync(targetPath, src, "utf8");
console.log("SUCCESS: patched more colors v122, 0 parse diagnostics, length:", src.length);
