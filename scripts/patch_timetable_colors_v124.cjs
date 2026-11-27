const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

// 1. Define global helper ttSubjStyle right before function cCe
const cceFnOld = `function cCe(r,t=!1){`;
const ttHelper = `const ttSubjStyle=(v)=>{
  const s=String(v||"").trim();
  if(!s||s==="មុខវិជ្ជា..."||s==="-")return{cls:"bg-white text-slate-500",bg:"#ffffff",fg:"#475569"};
  if(s.includes("គោរពទង់ជាតិ"))return{cls:"bg-rose-100 text-rose-900",bg:"#ffe4e6",fg:"#881337"};
  if(s.includes("ចេញលេង"))return{cls:"bg-amber-100 text-amber-900",bg:"#fef3c7",fg:"#78350f"};
  if(s.includes("ខ្មែរ")||s.includes("អំណាន")||s.includes("សរសេរ")||s.includes("តែងសេចក្តី"))return{cls:"bg-sky-50 text-sky-900",bg:"#e0f2fe",fg:"#0c4a6e"};
  if(s.includes("គណិត"))return{cls:"bg-amber-50 text-amber-900",bg:"#fef3c7",fg:"#78350f"};
  if(s.includes("វិទ្យា"))return{cls:"bg-emerald-50 text-emerald-900",bg:"#d1fae5",fg:"#064e3b"};
  if(s.includes("សង្គម")||s.includes("សីលធម៌")||s.includes("ពលរដ្ឋ")||s.includes("ភូមិ")||s.includes("ប្រវត្តិ"))return{cls:"bg-indigo-50 text-indigo-900",bg:"#e0e7ff",fg:"#312e81"};
  if(s.includes("អង់គ្លេស")||s.toLowerCase().includes("eng"))return{cls:"bg-rose-50 text-rose-900",bg:"#ffe4e6",fg:"#881337"};
  if(s.includes("សិល្បៈ")||s.includes("អប់រំកាយ")||s.includes("កីឡា")||s.includes("គំនូរ")||s.includes("ចម្រៀង"))return{cls:"bg-purple-50 text-purple-900",bg:"#f3e8ff",fg:"#581c87"};
  return{cls:"bg-cyan-50 text-cyan-900",bg:"#cffafe",fg:"#155e75"};
};
function cCe(r,t=!1){`;
if (!src.includes(cceFnOld)) throw new Error("Missing cceFnOld");
src = src.replace(cceFnOld, ttHelper);

// 2. Enhance cCe Word/A4 print timetable colors when Color mode (!t) is active
const cceTableOld = `    table.data-table th {
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
    }`;
const cceTableNew = `    table.data-table th {
      background-color: \${t?"#eee":"#0d9488"};
      color: \${t?"#000":"#fff"};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9.5pt;
      font-weight: normal;
    }
    .flag-row {
      background-color: \${t?"#fff":"#ffe4e6"};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9pt;
      color: \${t?"#000":"#881337"};
    }
    .break-row {
      background-color: \${t?"#fff":"#fef3c7"};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9pt;
      color: \${t?"#000":"#78350f"};
    }`;
if (!src.includes(cceTableOld)) throw new Error("Missing cceTableOld");
src = src.replace(cceTableOld, cceTableNew);

const cceRowsOld = `    <!-- Table Grid -->
    <table class="data-table">
      <thead>
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
              </tr>\`:` + "`" + `
            <tr>
              <td style="font-weight: bold; font-family: monospace;">\${i.time}</td>
              <td>\${i.duration}</td>
              <td>\${i.mon}</td>
              <td>\${i.tue}</td>
              <td>\${i.wed}</td>
              <td>\${i.thu}</td>
              <td>\${i.fri}</td>
              <td>\${i.sat}</td>
            </tr>` + "`" + `).join("")}
      </tbody>
    </table>`;

const cceRowsNew = `    <!-- Table Grid -->
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 11%;\${t?"":"background:#059669;color:#fff;"}">ម៉ោងសិក្សា</th>
          <th style="width: 9%;\${t?"":"background:#0d9488;color:#fff;"}">រយៈពេល</th>
          <th style="width: 13%;\${t?"":"background:#f59e0b;color:#fff;"}">ចន្ទ</th>
          <th style="width: 13%;\${t?"":"background:#9333ea;color:#fff;"}">អង្គារ</th>
          <th style="width: 13%;\${t?"":"background:#10b981;color:#fff;"}">ពុធ</th>
          <th style="width: 13%;\${t?"":"background:#f97316;color:#fff;"}">ព្រហស្បតិ៍</th>
          <th style="width: 13%;\${t?"":"background:#0284c7;color:#fff;"}">សុក្រ</th>
          <th style="width: 13%;\${t?"":"background:#e11d48;color:#fff;"}">សៅរ៍</th>
        </tr>
      </thead>
      <tbody>
        \${r.rows.map(i=>i.type==="flag"?\`
              <tr>
                <td style="font-weight: bold; font-family: monospace;\${t?"":"background:#f0fdfa;color:#0f766e;"}">\${i.time}</td>
                <td style="\${t?"":"background:#f0fdfa;color:#0f766e;"}">\${i.duration}</td>
                <td colspan="6" class="flag-row">\${i.mon}</td>
              </tr>\`:i.type==="break"?\`
              <tr>
                <td style="font-weight: bold; font-family: monospace;\${t?"":"background:#f0fdfa;color:#0f766e;"}">\${i.time}</td>
                <td style="\${t?"":"background:#f0fdfa;color:#0f766e;"}">\${i.duration}</td>
                <td colspan="6" class="break-row">\${i.mon}</td>
              </tr>\`:` + "`" + `
            <tr>
              <td style="font-weight: bold; font-family: monospace;\${t?"":"background:#f0fdfa;color:#0f766e;"}">\${i.time}</td>
              <td style="\${t?"":"background:#f8fafc;color:#334155;"}">\${i.duration}</td>
              \${[i.mon,i.tue,i.wed,i.thu,i.fri,i.sat].map(sub=>{const st=ttSubjStyle(sub);return t?\`<td>\${sub}</td>\`:\`<td style="background:\${st.bg};color:\${st.fg};font-weight:700;">\${sub}</td>\`;}).join("")}
            </tr>` + "`" + `).join("")}
      </tbody>
    </table>`;
if (!src.includes(cceRowsOld)) throw new Error("Missing cceRowsOld");
src = src.replace(cceRowsOld, cceRowsNew);

// 3. Default xCe to Color Mode (u = false) instead of B&W (u = true)
const xceStateOld = `return Mz}),[l,o]=y.useState("all"),[c,d]=y.useState(!0),[u,h]=y.useState(!0),[m,w]=y.useState(!1)`;
const xceStateNew = `return Mz}),[l,o]=y.useState("all"),[c,d]=y.useState(!0),[u,h]=y.useState(!1),[m,w]=y.useState(!1)`;
if (!src.includes(xceStateOld)) throw new Error("Missing xceStateOld");
src = src.replace(xceStateOld, xceStateNew);

// 4. xCe top control header vibrant gradient banner + action buttons
const xceHdrOld = `e.jsxs("div",{className:"no-print bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4",children:[e.jsxs("div",{className:"flex flex-wrap justify-between items-center gap-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 flex items-center justify-center font-black text-xl shadow-xs",children:"📄"}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h3",{className:"font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base",children:"កាលវិភាគបង្រៀនផ្លូវការ (ស្តង់ដារ Microsoft Word & MoEYS)"}),e.jsx("span",{className:"text-[10px] bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded-md",children:"A4 Landscape ផ្តេក"}),e.jsxs("span",{className:"text-[10px] bg-purple-100 text-purple-950 font-bold px-2 py-0.5 rounded-md",children:["វេន",n.shift]})]}),e.jsxs("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-0.5",children:[n.schoolName," • ឆ្នាំសិក្សា ",n.academicYear]})]})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("button",{onClick:()=>{const Y=!m;w(Y),Y&&t&&t("បានបើកមុខងារកែសម្រួល៖ ចុចលើប្រអប់ក្នុងតារាងដើម្បីកែប្រែ ឬជ្រើសមុខវិជ្ជា!")},className:\`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 \${m?"bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-1":"bg-indigo-600 hover:bg-indigo-700 text-white"}\`,children:[m?e.jsx(ea,{className:"w-4 h-4"}):e.jsx(Wa,{className:"w-4 h-4"}),e.jsx("span",{children:m?"រួចរាល់ (រក្សាទុក)":"✏️ កែសម្រួលកាលវិភាគ"})]}),m&&e.jsxs("button",{onClick:H,className:"px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1",title:"កំណត់ទិន្នន័យដើមឡើងវិញ",children:[e.jsx(En,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"កំណត់ឡើងវិញ"})]}),e.jsxs("button",{onClick:()=>A(!0),className:"px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition shadow-md flex items-center gap-1.5 active:scale-95",title:"កំណត់ និងកែសម្រួលទម្រង់កាលវិភាគមុនទាញយកជា PDF",children:[e.jsx(Vs,{className:"w-4 h-4 text-red-200"}),e.jsx("span",{children:"ទាញយក / កែសម្រួល PDF"})]}),e.jsxs("button",{onClick:X,className:"px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 active:scale-95",title:"ទាញយកឯកសារ Word ដើម្បីបើកកែប្រែ ឬព្រីនក្នុង Microsoft Word",children:[e.jsx(wi,{className:"w-4 h-4 text-blue-200"}),e.jsx("span",{children:"ទាញយក Word (.doc)"})]}),e.jsxs("button",{onClick:E,className:"px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 active:scale-95",children:[e.jsx(ts,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{children:"បោះពុម្ពស្តង់ដារ Word"})]}),s&&a&&e.jsx("button",{onClick:a,className:"px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition",children:"បិទ"})]})]}),`;

const xceHdrNew = `e.jsxs("div",{className:"no-print bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[28px] border-2 border-sky-200 dark:border-slate-800 shadow-sm space-y-4",children:[e.jsxs("div",{className:"bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white p-4 sm:p-5 rounded-2xl shadow-sm flex flex-wrap justify-between items-center gap-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0",children:"📅"}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsx("h3",{className:"font-extrabold text-white text-sm sm:text-base",children:"កាលវិភាគបង្រៀនផ្លូវការ (ស្តង់ដារ MoEYS)"}),e.jsxs("span",{className:"text-[11px] bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-lg",children:["A4 ផ្តេក · វេន",n.shift]})]}),e.jsxs("p",{className:"text-xs text-sky-100 font-semibold mt-0.5",children:[n.schoolName," • ឆ្នាំសិក្សា ",n.academicYear]})]})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("button",{onClick:()=>{const Y=!m;w(Y),Y&&t&&t("បានបើកមុខងារកែសម្រួល៖ ចុចលើប្រអប់ក្នុងតារាងដើម្បីកែប្រែ ឬជ្រើសមុខវិជ្ជា!")},className:\`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 \${m?"bg-emerald-500 hover:bg-emerald-600 text-white ring-2 ring-white":"bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 text-white"}\`,children:[m?e.jsx(ea,{className:"w-4 h-4"}):e.jsx(Wa,{className:"w-4 h-4"}),e.jsx("span",{children:m?"រួចរាល់ (រក្សាទុក)":"✏️ កែសម្រួលកាលវិភាគ"})]}),m&&e.jsxs("button",{onClick:H,className:"px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer",title:"កំណត់ទិន្នន័យដើមឡើងវិញ",children:[e.jsx(En,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"កំណត់ឡើងវិញ"})]}),e.jsxs("button",{onClick:()=>A(!0),className:"px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 text-white text-xs font-extrabold transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95",title:"កំណត់ និងកែសម្រួលទម្រង់កាលវិភាគមុនទាញយកជា PDF",children:[e.jsx(Vs,{className:"w-4 h-4 text-white"}),e.jsx("span",{children:"ទាញយក PDF"})]}),e.jsxs("button",{onClick:X,className:"px-3.5 py-2 rounded-xl bg-white hover:bg-sky-50 text-sky-900 text-xs font-extrabold transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95",title:"ទាញយកឯកសារ Word ដើម្បីបើកកែប្រែ ឬព្រីនក្នុង Microsoft Word",children:[e.jsx(wi,{className:"w-4 h-4 text-sky-600"}),e.jsx("span",{children:"Word (.doc)"})]}),e.jsxs("button",{onClick:E,className:"px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95",children:[e.jsx(ts,{className:"w-4 h-4 text-white"}),e.jsx("span",{children:"បោះពុម្ព A4"})]}),s&&a&&e.jsx("button",{onClick:a,className:"px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition cursor-pointer",children:"បិទ"})]})]}),`;
if (!src.includes(xceHdrOld)) throw new Error("Missing xceHdrOld");
src = src.replace(xceHdrOld, xceHdrNew);

// 5. Color quick-fill chips in xCe edit panel
const dceMapOld = `dCe.map(Y=>e.jsxs("button",{type:"button",onClick:()=>z(Y.label),className:"px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 border-2 border-purple-200 dark:border-purple-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-black transition flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 cursor-pointer",children:[e.jsx("span",{className:"text-base",children:Y.icon}),e.jsx("span",{children:Y.label})]},Y.label))`;
const dceMapNew = `dCe.map(Y=>{const st=ttSubjStyle(Y.label);return e.jsxs("button",{type:"button",onClick:()=>z(Y.label),className:\`px-3.5 py-2 rounded-xl border-2 border-sky-200 hover:opacity-90 text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 cursor-pointer \${st.cls}\`,children:[e.jsx("span",{className:"text-base",children:Y.icon}),e.jsx("span",{children:Y.label})]},Y.label);})`;
if (!src.includes(dceMapOld)) throw new Error("Missing dceMapOld");
src = src.replace(dceMapOld, dceMapNew);

// 6. Active day filter button + printable sheet frame + vibrant day headers + subject color cells in xCe
const dayFilterOld = `e.jsx("span",{className:"text-slate-500 shrink-0",children:"ជ្រើសរើសថ្ងៃ៖"}),Z.map(Y=>e.jsx("button",{onClick:()=>o(Y.key),className:\`px-3 py-1.5 rounded-xl shrink-0 transition \${l===Y.key?"bg-purple-900 text-white font-extrabold shadow-sm":"bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"}\`,children:Y.label},Y.key))`;
const dayFilterNew = `e.jsx("span",{className:"text-slate-600 font-extrabold shrink-0",children:"ជ្រើសរើសថ្ងៃ៖"}),Z.map(Y=>e.jsx("button",{onClick:()=>o(Y.key),className:\`px-3.5 py-1.5 rounded-xl shrink-0 transition cursor-pointer \${l===Y.key?"bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold shadow-sm":"bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-sky-50"}\`,children:Y.label},Y.key))`;
if (!src.includes(dayFilterOld)) throw new Error("Missing dayFilterOld");
src = src.replace(dayFilterOld, dayFilterNew);

const sheetFrameOld = `printable-timetable \${u?"bw-print-mode":""} bg-white text-black p-6 sm:p-10 rounded-2xl border-2 border-slate-300 shadow-2xl space-y-5`;
const sheetFrameNew = `printable-timetable \${u?"bw-print-mode":""} bg-white text-black p-5 sm:p-8 rounded-3xl border-2 \${u?"border-slate-300":"border-sky-300"} shadow-xl space-y-5`;
if (!src.includes(sheetFrameOld)) throw new Error("Missing sheetFrameOld");
src = src.replace(sheetFrameOld, sheetFrameNew);

const ttTheadOld = `e.jsx("thead",{children:e.jsxs("tr",{className:\`\${u?"bg-slate-200":"bg-[#FCE4D6]"} text-black font-moul border-b border-black\`,children:[e.jsx("th",{className:"p-2.5 border border-black min-w-[90px] font-normal text-[11px]",children:"ម៉ោងសិក្សា"}),e.jsx("th",{className:"p-2.5 border border-black min-w-[70px] font-normal text-[11px]",children:"រយៈពេល"}),(l==="all"||l==="mon")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"ចន្ទ"}),(l==="all"||l==="tue")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"អង្គារ"}),(l==="all"||l==="wed")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"ពុធ"}),(l==="all"||l==="thu")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"ព្រហស្បតិ៍"}),(l==="all"||l==="fri")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"សុក្រ"}),(l==="all"||l==="sat")&&e.jsx("th",{className:"p-2.5 border border-black min-w-[110px] font-normal text-[11px]",children:"សៅរ៍"}),m&&e.jsx("th",{className:"p-2 border border-black w-10 text-center font-normal text-[11px]",children:"លុប"})]})}),`;

const ttTheadNew = `e.jsx("thead",{children:e.jsxs("tr",{className:\`\${u?"bg-slate-200 text-black":"text-white"} font-moul border-b border-black\`,children:[e.jsx("th",{className:\`p-2.5 border border-black min-w-[90px] font-normal text-[11px] \${u?"":"bg-emerald-600 text-white"}\`,children:"ម៉ោងសិក្សា"}),e.jsx("th",{className:\`p-2.5 border border-black min-w-[70px] font-normal text-[11px] \${u?"":"bg-teal-600 text-white"}\`,children:"រយៈពេល"}),(l==="all"||l==="mon")&&e.jsx("th",{className:\`p-2.5 border border-black min-w-[110px] font-normal text-[11px] \${u?"":"bg-amber-500 text-white"}\`,children:"ចន្ទ"}),(l==="all"||l==="tue")&&e.jsx("th",{className:\`p-2.5 border border-black min-w-[110px] font-normal text-[11px] \${u?"":"bg-purple-600 text-white"}\`,children:"អង្គារ"}),(l==="all"||l==="wed")&&e.jsx("th",{className:\`p-2.5 border border-black min-w-[110px] font-normal text-[11px] \${u?"":"bg-emerald-500 text-white"}\`,children:"ពុធ"}),(l==="all"||l==="thu")&&e.jsx("th",{className:\`p-2.5 border border-black min-w-[110px] font-normal text-[11px] \${u?"":"bg-orange-500 text-white"}\`,children:"ព្រហស្បតិ៍"}),(l==="all"||l==="fri")&&e.jsx("th",{className:\`p-2.5 border border-black min-w-[110px] font-normal text-[11px] \${u?"":"bg-sky-500 text-white"}\`,children:"សុក្រ"}),(l==="all"||l==="sat")&&e.jsx("th",{className:\`p-2.5 border border-black min-w-[110px] font-normal text-[11px] \${u?"":"bg-rose-500 text-white"}\`,children:"សៅរ៍"}),m&&e.jsx("th",{className:\`p-2 border border-black w-10 text-center font-normal text-[11px] \${u?"":"bg-slate-700 text-white"}\`,children:"លុប"})]})}),`;
if (!src.includes(ttTheadOld)) throw new Error("Missing ttTheadOld");
src = src.replace(ttTheadOld, ttTheadNew);

const ttTbodyOld = `e.jsx("tbody",{children:n.rows.map((Y,U)=>Y.type==="flag"?e.jsxs("tr",{className:\`\${u?"bg-white":"bg-rose-50"} text-black font-bold border-b border-black\`,children:[e.jsx("td",{className:"p-2 border border-black font-mono font-bold text-xs",children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:"p-2 border border-black text-xs font-normal",children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),e.jsx("td",{colSpan:l==="all"?6:1,className:\`p-2 border border-black font-moul text-xs \${u?"text-black":"text-rose-900"} tracking-wider\`,children:m?e.jsx("input",{type:"text",value:Y.mon,onChange:q=>{const ae=q.target.value,ie=[...n.rows];ie[U]={...ie[U],mon:ae,tue:ae,wed:ae,thu:ae,fri:ae,sat:ae},i({...n,rows:ie})},className:"w-full text-center border rounded p-1 bg-white font-bold"}):\`🚩 \${Y.mon}\`}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U):Y.type==="break"?e.jsxs("tr",{className:\`\${u?"bg-white":"bg-amber-50"} text-black font-bold border-b border-black\`,children:[e.jsx("td",{className:"p-2 border border-black font-mono font-bold text-xs",children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:"p-2 border border-black text-xs font-normal",children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),e.jsx("td",{colSpan:l==="all"?6:1,className:\`p-2 border border-black font-moul text-xs \${u?"text-black":"text-amber-900"} tracking-wider\`,children:m?e.jsx("input",{type:"text",value:Y.mon,onChange:q=>{const ae=q.target.value,ie=[...n.rows];ie[U]={...ie[U],mon:ae,tue:ae,wed:ae,thu:ae,fri:ae,sat:ae},i({...n,rows:ie})},className:"w-full text-center border rounded p-1 bg-white font-bold"}):\`🔔 \${Y.mon}\`}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U):e.jsxs("tr",{className:"border-b border-black hover:bg-slate-50",children:[e.jsx("td",{className:"p-2 border border-black font-mono font-bold text-black text-xs",children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:"p-2 border border-black text-black text-xs",children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),["mon","tue","wed","thu","fri","sat"].map(q=>{if(l!=="all"&&l!==q)return null;const ae=(D==null?void 0:D.rowIndex)===U&&(D==null?void 0:D.field)===q;return e.jsx("td",{className:\`p-1.5 border border-black text-xs font-bold transition \${ae?"bg-purple-100 ring-2 ring-purple-500 ring-inset":""}\`,children:m?e.jsx("input",{type:"text",value:Y[q],onFocus:()=>T({rowIndex:U,field:q}),onChange:ie=>O(U,q,ie.target.value),className:"w-full text-center border border-slate-300 rounded p-1 text-xs bg-white font-bold focus:border-purple-600 focus:outline-none"}):Y[q]},q)}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរនេះ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U))})`;

const ttTbodyNew = `e.jsx("tbody",{children:n.rows.map((Y,U)=>Y.type==="flag"?e.jsxs("tr",{className:\`\${u?"bg-white text-black":"bg-rose-100 text-rose-900"} font-bold border-b border-black\`,children:[e.jsx("td",{className:\`p-2 border border-black font-mono font-bold text-xs \${u?"":"bg-teal-50 text-teal-900"}\`,children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:\`p-2 border border-black text-xs font-bold \${u?"":"bg-sky-50 text-sky-900"}\`,children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),e.jsx("td",{colSpan:l==="all"?6:1,className:\`p-2 border border-black font-moul text-xs \${u?"text-black":"text-rose-900"} tracking-wider\`,children:m?e.jsx("input",{type:"text",value:Y.mon,onChange:q=>{const ae=q.target.value,ie=[...n.rows];ie[U]={...ie[U],mon:ae,tue:ae,wed:ae,thu:ae,fri:ae,sat:ae},i({...n,rows:ie})},className:"w-full text-center border rounded p-1 bg-white font-bold"}):\`🚩 \${Y.mon}\`}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U):Y.type==="break"?e.jsxs("tr",{className:\`\${u?"bg-white text-black":"bg-amber-100 text-amber-900"} font-bold border-b border-black\`,children:[e.jsx("td",{className:\`p-2 border border-black font-mono font-bold text-xs \${u?"":"bg-teal-50 text-teal-900"}\`,children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:\`p-2 border border-black text-xs font-bold \${u?"":"bg-sky-50 text-sky-900"}\`,children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),e.jsx("td",{colSpan:l==="all"?6:1,className:\`p-2 border border-black font-moul text-xs \${u?"text-black":"text-amber-900"} tracking-wider\`,children:m?e.jsx("input",{type:"text",value:Y.mon,onChange:q=>{const ae=q.target.value,ie=[...n.rows];ie[U]={...ie[U],mon:ae,tue:ae,wed:ae,thu:ae,fri:ae,sat:ae},i({...n,rows:ie})},className:"w-full text-center border rounded p-1 bg-white font-bold"}):\`🔔 \${Y.mon}\`}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U):e.jsxs("tr",{className:"border-b border-black",children:[e.jsx("td",{className:\`p-2 border border-black font-mono font-extrabold text-xs \${u?"text-black bg-white":"text-teal-900 bg-teal-50"}\`,children:m?e.jsx("input",{type:"text",value:Y.time,onChange:q=>O(U,"time",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs font-mono bg-white"}):Y.time}),e.jsx("td",{className:\`p-2 border border-black font-bold text-xs \${u?"text-black bg-white":"text-sky-900 bg-sky-50"}\`,children:m?e.jsx("input",{type:"text",value:Y.duration,onChange:q=>O(U,"duration",q.target.value),className:"w-full text-center border rounded p-0.5 text-xs bg-white"}):Y.duration}),["mon","tue","wed","thu","fri","sat"].map(q=>{if(l!=="all"&&l!==q)return null;const ae=(D==null?void 0:D.rowIndex)===U&&(D==null?void 0:D.field)===q;const sc=u?"bg-white text-black":ttSubjStyle(Y[q]).cls;return e.jsx("td",{className:\`p-1.5 border border-black text-xs font-extrabold transition \${ae?"bg-purple-100 ring-2 ring-purple-500 ring-inset":sc}\`,children:m?e.jsx("input",{type:"text",value:Y[q],onFocus:()=>T({rowIndex:U,field:q}),onChange:ie=>O(U,q,ie.target.value),className:"w-full text-center border border-slate-300 rounded p-1 text-xs bg-white font-bold focus:border-purple-600 focus:outline-none"}):Y[q]},q)}),m&&e.jsx("td",{className:"p-1 border border-black text-center",children:e.jsx("button",{type:"button",onClick:()=>G(U),className:"p-1 text-red-500 hover:text-red-700",title:"លុបជួរនេះ",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})})]},U))})`;
if (!src.includes(ttTbodyOld)) throw new Error("Missing ttTbodyOld");
src = src.replace(ttTbodyOld, ttTbodyNew);

// 7. Pass initialStyles to timetable Oi modal so it prints crisp 1-page landscape
const ttOiCallOld = `documentType:"timetable",title:"កំណត់ទម្រង់ & ទាញយក PDF កាលវិភាគបង្រៀន",initialHeader:{`;
const ttOiCallNew = `documentType:"timetable",title:"កំណត់ទម្រង់ & ទាញយក PDF កាលវិភាគបង្រៀន",initialStyles:{orientation:"landscape",marginSize:"tight",fontSize:"small",signaturesLayout:"side_by_side",showStampBox:!1,fitOnePage:!0},initialHeader:{`;
if (!src.includes(ttOiCallOld)) throw new Error("Missing ttOiCallOld");
src = src.replace(ttOiCallOld, ttOiCallNew);

// 8. Colorful Oi timetable Ut() template when not B&W theme
const oiTtUtOld = `        <table style="width: 100%; border-collapse: collapse; font-size: 0.88em; text-align: center; margin-bottom: 14px;">
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
        </table>`;

const oiTtUtNew = `        <table style="width: 100%; border-collapse: collapse; font-size: 0.88em; text-align: center; margin-bottom: 10px;">
          <thead>
            <tr style="\${dr} font-family: \${He};">
              <th style="\${hr} \${at} \${V.colorTheme==="bw"?qt:"background:#059669;color:#fff;"} width: 11%;">ម៉ោង / វេន</th>
              <th style="\${hr} \${at} \${V.colorTheme==="bw"?qt:"background:#0d9488;color:#fff;"} width: 9%;">រយៈពេល</th>
              <th style="\${hr} \${at} \${V.colorTheme==="bw"?qt:"background:#f59e0b;color:#fff;"} width: 13.3%;">ថ្ងៃចន្ទ</th>
              <th style="\${hr} \${at} \${V.colorTheme==="bw"?qt:"background:#9333ea;color:#fff;"} width: 13.3%;">ថ្ងៃអង្គារ</th>
              <th style="\${hr} \${at} \${V.colorTheme==="bw"?qt:"background:#10b981;color:#fff;"} width: 13.3%;">ថ្ងៃពុធ</th>
              <th style="\${hr} \${at} \${V.colorTheme==="bw"?qt:"background:#f97316;color:#fff;"} width: 13.3%;">ថ្ងៃព្រហស្បតិ៍</th>
              <th style="\${hr} \${at} \${V.colorTheme==="bw"?qt:"background:#0284c7;color:#fff;"} width: 13.3%;">ថ្ងៃសុក្រ</th>
              <th style="\${hr} \${at} \${V.colorTheme==="bw"?qt:"background:#e11d48;color:#fff;"} width: 13.3%;">ថ្ងៃសៅរ៍</th>
            </tr>
          </thead>
          <tbody>
            \${ds.map((At,Ue)=>{const isBw=V.colorTheme==="bw",Ir=At.type==="break"||At.mon==="ចេញលេង"||At.tue==="ចេញលេង",ks=At.type==="flag"||At.mon==="គោរពទង់ជាតិ";let zs=Ue%2===1?ne.altRowBg:"#ffffff";Ir&&(zs=isBw?Tr:"#fef3c7");ks&&(zs=isBw?Rt:"#ffe4e6");const cCell=(val)=>{if(isBw||Ir||ks)return \`\${hr} \${at} \${Ir||ks?"font-weight: bold;":""}\`;const st=ttSubjStyle(val);return \`\${hr} \${at} background:\${st.bg}; color:\${st.fg}; font-weight: bold;\`;};return \`
                  <tr style="background-color: \${zs};">
                    <td style="\${hr} \${at} font-weight: bold; color: \${isBw?_e:"#0f766e"}; background: \${isBw?zs:"#f0fdfa"}; font-size: 0.9em;">
                      \${At.time||"-"}
                    </td>
                    <td style="\${hr} \${at} font-size: 0.82em; color: \${isBw?"#475569":"#0c4a6e"}; background: \${isBw?zs:"#f0f9ff"};">
                      \${At.duration||"-"}
                    </td>
                    <td style="\${cCell(At.mon)}">\${At.mon||"-"}</td>
                    <td style="\${cCell(At.tue)}">\${cCell(At.tue)}</td>
                    <td style="\${cCell(At.wed)}">\${cCell(At.wed)}</td>
                    <td style="\${cCell(At.thu)}">\${cCell(At.thu)}</td>
                    <td style="\${cCell(At.fri)}">\${cCell(At.fri)}</td>
                    <td style="\${cCell(At.sat)}">\${cCell(At.sat)}</td>
                  </tr>
                \`}).join("")}
          </tbody>
        </table>`;
if (!src.includes(oiTtUtOld)) throw new Error("Missing oiTtUtOld");
src = src.replace(oiTtUtOld, oiTtUtNew);

// 9. Colorful React live preview inside Oi for timetable
const oiReactOld = `e.jsx("thead",{children:e.jsxs("tr",{className:"bg-blue-50 text-blue-950 font-bold border-b-2 border-slate-800",children:[e.jsx("th",{className:"p-2 border border-slate-300 w-24",children:"ម៉ោង / វេន"}),e.jsx("th",{className:"p-2 border border-slate-300 w-20",children:"រយៈពេល"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃចន្ទ"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃអង្គារ"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃពុធ"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃព្រហស្បតិ៍"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃសុក្រ"}),e.jsx("th",{className:"p-2 border border-slate-300",children:"ថ្ងៃសៅរ៍"})]})}),e.jsx("tbody",{children:(Tt=Qe.rows)==null?void 0:Tt.map((ne,_e)=>{const ut=ne.type==="break"||ne.mon==="ចេញលេង"||ne.tue==="ចេញលេង",wr=ne.type==="flag"||ne.mon==="គោរពទង់ជាតិ";return e.jsxs("tr",{className:\`border-b border-slate-300 \${ut?"bg-amber-50 font-bold":wr?"bg-blue-50 font-bold":_e%2===1?"bg-slate-50/70":"bg-white"}\`,children:[e.jsx("td",{className:"p-1 border border-slate-300 font-bold text-blue-900",children:e.jsx("input",{type:"text",value:ne.time,onChange:Rt=>Je(_e,"time",Rt.target.value),className:"w-full text-center bg-transparent outline-none font-bold text-xs p-0.5 hover:bg-purple-50 rounded"})}),e.jsx("td",{className:"p-1 border border-slate-300 text-slate-600",children:e.jsx("input",{type:"text",value:ne.duration,onChange:Rt=>Je(_e,"duration",Rt.target.value),className:"w-full text-center bg-transparent outline-none text-xs p-0.5 hover:bg-purple-50 rounded"})}),["mon","tue","wed","thu","fri","sat"].map(Rt=>{const Tr=(ze==null?void 0:ze.rowIndex)===_e&&(ze==null?void 0:ze.day)===Rt;return e.jsx("td",{className:\`p-1 border border-slate-300 transition \${Tr?"bg-purple-100 ring-2 ring-purple-600 font-bold":""}\`,children:e.jsx("input",{type:"text",value:ne[Rt]||"",onFocus:()=>qe({rowIndex:_e,day:Rt}),onChange:Lr=>Je(_e,Rt,Lr.target.value),className:"w-full text-center bg-transparent outline-none text-xs p-0.5 hover:bg-purple-50 rounded font-medium"})},Rt)})]},_e)})})`;

const oiReactNew = `e.jsx("thead",{children:e.jsxs("tr",{className:"text-white font-bold border-b-2 border-slate-800",children:[e.jsx("th",{className:"p-2 border border-slate-300 bg-emerald-600 w-24",children:"ម៉ោង / វេន"}),e.jsx("th",{className:"p-2 border border-slate-300 bg-teal-600 w-20",children:"រយៈពេល"}),e.jsx("th",{className:"p-2 border border-slate-300 bg-amber-500",children:"ថ្ងៃចន្ទ"}),e.jsx("th",{className:"p-2 border border-slate-300 bg-purple-600",children:"ថ្ងៃអង្គារ"}),e.jsx("th",{className:"p-2 border border-slate-300 bg-emerald-500",children:"ថ្ងៃពុធ"}),e.jsx("th",{className:"p-2 border border-slate-300 bg-orange-500",children:"ថ្ងៃព្រហស្បតិ៍"}),e.jsx("th",{className:"p-2 border border-slate-300 bg-sky-500",children:"ថ្ងៃសុក្រ"}),e.jsx("th",{className:"p-2 border border-slate-300 bg-rose-500",children:"ថ្ងៃសៅរ៍"})]})}),e.jsx("tbody",{children:(Tt=Qe.rows)==null?void 0:Tt.map((ne,_e)=>{const ut=ne.type==="break"||ne.mon==="ចេញលេង"||ne.tue==="ចេញលេង",wr=ne.type==="flag"||ne.mon==="គោរពទង់ជាតិ";return e.jsxs("tr",{className:\`border-b border-slate-300 \${ut?"bg-amber-100 font-bold":wr?"bg-rose-100 font-bold":"bg-white"}\`,children:[e.jsx("td",{className:"p-1 border border-slate-300 font-bold text-teal-900 bg-teal-50",children:e.jsx("input",{type:"text",value:ne.time,onChange:Rt=>Je(_e,"time",Rt.target.value),className:"w-full text-center bg-transparent outline-none font-bold text-xs p-0.5 hover:bg-white rounded"})}),e.jsx("td",{className:"p-1 border border-slate-300 text-sky-900 bg-sky-50 font-semibold",children:e.jsx("input",{type:"text",value:ne.duration,onChange:Rt=>Je(_e,"duration",Rt.target.value),className:"w-full text-center bg-transparent outline-none text-xs p-0.5 hover:bg-white rounded"})}),["mon","tue","wed","thu","fri","sat"].map(Rt=>{const Tr=(ze==null?void 0:ze.rowIndex)===_e&&(ze==null?void 0:ze.day)===Rt;const sc=ut?"bg-amber-100 text-amber-900":wr?"bg-rose-100 text-rose-900":ttSubjStyle(ne[Rt]).cls;return e.jsx("td",{className:\`p-1 border border-slate-300 transition \${Tr?"bg-purple-100 ring-2 ring-purple-600 font-bold":sc}\`,children:e.jsx("input",{type:"text",value:ne[Rt]||"",onFocus:()=>qe({rowIndex:_e,day:Rt}),onChange:Lr=>Je(_e,Rt,Lr.target.value),className:"w-full text-center bg-transparent outline-none text-xs p-0.5 hover:bg-white/70 rounded font-bold"})},Rt)})]},_e)})})`;
if (!src.includes(oiReactOld)) throw new Error("Missing oiReactOld");
src = src.replace(oiReactOld, oiReactNew);

// 10. Vibrant active tab button for Timetable in sec2
const sec2TabOld = `[{id:"timetable",label:"កាលវិភាគបង្រៀន",icon:Is},{id:"syllabus",label:"កម្មវិធីប្រចាំឆ្នាំ/ត្រីមាស",icon:Za},{id:"lessonplan",label:"កិច្ចតែងការបង្រៀន (Lesson Plan)",icon:Rx},{id:"slides",label:"ស្លាយបង្រៀន",icon:gh},{id:"assessment",label:"កញ្ចប់ឯកសារវាយតម្លៃ (Rubrics)",icon:Vs}].map(oe=>{const ft=oe.icon,ir=le===oe.id;return e.jsxs("button",{onClick:()=>me(oe.id),className:\`px-3.5 py-2.5 rounded-2xl shrink-0 transition flex items-center gap-2 \${ir?"bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold":"bg-gradient-to-r from-white to-purple-50/50 hover:bg-purple-50 text-slate-800 border border-purple-200/60 shadow-2xs font-semibold"}\`,children:[e.jsx(ft,{className:\`w-4 h-4 \${ir?"text-amber-300":"text-slate-500"}\`}),e.jsx("span",{children:oe.label})]},oe.id)})`;
const sec2TabNew = `[{id:"timetable",label:"កាលវិភាគបង្រៀន",icon:Is},{id:"syllabus",label:"កម្មវិធីប្រចាំឆ្នាំ/ត្រីមាស",icon:Za},{id:"lessonplan",label:"កិច្ចតែងការបង្រៀន (Lesson Plan)",icon:Rx},{id:"slides",label:"ស្លាយបង្រៀន",icon:gh},{id:"assessment",label:"កញ្ចប់ឯកសារវាយតម្លៃ (Rubrics)",icon:Vs}].map(oe=>{const ft=oe.icon,ir=le===oe.id;const actC=oe.id==="timetable"?"bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md font-bold":"bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold";return e.jsxs("button",{onClick:()=>me(oe.id),className:\`px-3.5 py-2.5 rounded-2xl shrink-0 transition flex items-center gap-2 cursor-pointer \${ir?actC:"bg-white hover:bg-sky-50 text-slate-800 border border-slate-200 hover:border-sky-300 shadow-2xs font-semibold"}\`,children:[e.jsx(ft,{className:\`w-4 h-4 \${ir?"text-white":"text-slate-500"}\`}),e.jsx("span",{children:oe.label})]},oe.id)})`;
if (!src.includes(sec2TabOld)) throw new Error("Missing sec2TabOld");
src = src.replace(sec2TabOld, sec2TabNew);

fs.writeFileSync(FILE, src, "utf8");

const sf = ts.createSourceFile(FILE, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("Parse diagnostics:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("SUCCESS: patched vibrant timetable colors v124, 0 parse diagnostics, length:", src.length);
