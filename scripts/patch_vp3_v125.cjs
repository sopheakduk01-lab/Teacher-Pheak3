const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const targetPath = path.join(process.cwd(), "public/assets/index-BwPwHqBe.js");
let code = fs.readFileSync(targetPath, "utf8");

function replaceExact(label, oldStr, newStr) {
  const idx = code.indexOf(oldStr);
  if (idx === -1) {
    throw new Error(`Pattern not found for [${label}]`);
  }
  const second = code.indexOf(oldStr, idx + 1);
  if (second !== -1) {
    throw new Error(`Pattern matched multiple times for [${label}]`);
  }
  code = code.slice(0, idx) + newStr + code.slice(idx + oldStr.length);
  console.log(`✓ Applied: ${label}`);
}

// 1. buildVisualSeatingHtml: renderSeat + legend + CSS
replaceExact(
  "buildVisualSeatingHtml renderSeat VP3",
  `    const isPres=!!st.isPresident;
    const isVP1=!!st.isVicePresident1;
    const isVP2=!!st.isVicePresident2;
    const isEye=!!(st.needsEyeCare&&hi);
    const isSlow=!!st.isSlowLearner;
    const ringCol=isPres?"#f59e0b":isVP1?"#4f46e5":isVP2?"#0891b2":isGirl?"#ec4899":"#0284c7";
    const seatBg=dark?(isPres?"#312008":st.isLeader?"#1e1b4b":isEye?"#2b2108":"#0f172a"):(isPres?"#fef3c7":isVP1?"#e0e7ff":isVP2?"#cffafe":isEye?"#fef9c3":isGirl?"#fdf2f8":"#f0f9ff");
    const seatBdr=dark?"#334155":(isPres?"#f59e0b":isVP1?"#818cf8":isVP2?"#22d3ee":isEye?"#eab308":isGirl?"#f9a8d4":"#bae6fd");
    let tagHtml="";
    if(isPres)tagHtml=\`<div class="sp-badge sp-b-pres">👑 ប្រធានថ្នាក់</div>\`;
    else if(isVP1)tagHtml=\`<div class="sp-badge sp-b-vp1">🎖️ អនុប្រធាន១</div>\`;
    else if(isVP2)tagHtml=\`<div class="sp-badge sp-b-vp2">🎖️ អនុប្រធាន២</div>\`;
    else if(isEye)tagHtml=\`<div class="sp-badge sp-b-eye">👁️ ជួរមុខ</div>\`;`,
  `    const isPres=!!st.isPresident;
    const isVP1=!!st.isVicePresident1;
    const isVP2=!!st.isVicePresident2;
    const isVP3=!!st.isVicePresident3;
    const isEye=!!(st.needsEyeCare&&hi);
    const isSlow=!!st.isSlowLearner;
    const ringCol=isPres?"#f59e0b":isVP1?"#4f46e5":isVP2?"#0891b2":isVP3?"#7c3aed":isGirl?"#ec4899":"#0284c7";
    const seatBg=dark?(isPres?"#312008":st.isLeader?"#1e1b4b":isEye?"#2b2108":"#0f172a"):(isPres?"#fef3c7":isVP1?"#e0e7ff":isVP2?"#cffafe":isVP3?"#f3e8ff":isEye?"#fef9c3":isGirl?"#fdf2f8":"#f0f9ff");
    const seatBdr=dark?"#334155":(isPres?"#f59e0b":isVP1?"#818cf8":isVP2?"#22d3ee":isVP3?"#c084fc":isEye?"#eab308":isGirl?"#f9a8d4":"#bae6fd");
    let tagHtml="";
    if(isPres)tagHtml=\`<div class="sp-badge sp-b-pres">👑 ប្រធានថ្នាក់</div>\`;
    else if(isVP1)tagHtml=\`<div class="sp-badge sp-b-vp1">🎖️ អនុប្រធាន១</div>\`;
    else if(isVP2)tagHtml=\`<div class="sp-badge sp-b-vp2">🎖️ អនុប្រធាន២</div>\`;
    else if(isVP3)tagHtml=\`<div class="sp-badge sp-b-vp3">🎖️ អនុប្រធាន៣</div>\`;
    else if(isEye)tagHtml=\`<div class="sp-badge sp-b-eye">👁️ ជួរមុខ</div>\`;`
);

replaceExact(
  "buildVisualSeatingHtml legend & sp-b-vp3 CSS",
  `        <span>🎖️ អនុប្រធាន</span>
        <span>·</span>
        <span>👁️ ជួរមុខ (ខ្សោយភ្នែក)</span>`,
  `        <span>🎖️ អនុប្រធាន (ទី១ · ទី២ · ទី៣)</span>
        <span>·</span>
        <span>👁️ ជួរមុខ (ខ្សោយភ្នែក)</span>`
);

replaceExact(
  "scCss sp-b-vp3",
  `    .sp-b-vp1{background:#e0e7ff;color:#3730a3;}
    .sp-b-vp2{background:#cffafe;color:#155e75;}`,
  `    .sp-b-vp1{background:#e0e7ff;color:#3730a3;}
    .sp-b-vp2{background:#cffafe;color:#155e75;}
    .sp-b-vp3{background:#f3e8ff;color:#6b21a8;}`
);

// 2. RCe modal updates
replaceExact(
  "RCe lookup X3",
  `const D=a||[],T=D.find(q=>q.id===u.presidentId),E=D.find(q=>q.id===u.vicePresident1Id),X=D.find(q=>q.id===u.vicePresident2Id),H=()=>`,
  `const D=a||[],T=D.find(q=>q.id===u.presidentId),E=D.find(q=>q.id===u.vicePresident1Id),X=D.find(q=>q.id===u.vicePresident2Id),X3=D.find(q=>q.id===u.vicePresident3Id),H()=>`
    .replace("X3=D.find(q=>q.id===u.vicePresident3Id),H()=>", "X3=D.find(q=>q.id===u.vicePresident3Id),H=()=>")
);

replaceExact(
  "RCe leadership tab badge count",
  `{id:"leadership",label:"១. រើសប្រធាន & អនុប្រធាន",icon:x0,count:(T?1:0)+(E?1:0)+(X?1:0)}`,
  `{id:"leadership",label:"១. រើសប្រធាន & អនុប្រធាន",icon:x0,count:(T?1:0)+(E?1:0)+(X?1:0)+(X3?1:0)}`
);

replaceExact(
  "RCe leadership tab intro & 4-card grid",
  `children:["ជ្រើសរើស ",e.jsx("strong",{children:"ប្រធានថ្នាក់"}),", ",e.jsx("strong",{children:"អនុប្រធានទី១"}),", និង ",e.jsx("strong",{children:"អនុប្រធានទី២"})," ដើម្បីដឹកនាំគ្រប់គ្រងវិន័យ អនាម័យ និងជួយណែនាំមិត្តរួមថ្នាក់។"]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[`,
  `children:["ជ្រើសរើស ",e.jsx("strong",{children:"ប្រធានថ្នាក់"}),", ",e.jsx("strong",{children:"អនុប្រធានទី១"}),", ",e.jsx("strong",{children:"អនុប្រធានទី២"}),", និង ",e.jsx("strong",{children:"អនុប្រធានទី៣"})," ដើម្បីដឹកនាំគ្រប់គ្រងវិន័យ អនាម័យ និងជួយណែនាំមិត្តរួមថ្នាក់។"]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",children:[`
);

replaceExact(
  "RCe VP3 leadership card + 4 role cards",
  `children:["លេខរៀង #",X.rollNo||X.id," • ទទួលបន្ទុកសកម្មភាព ស្រោចផ្កា & កីឡា"]})]}):e.jsx("div",{className:"p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 italic text-center",children:"មិនទាន់បានជ្រើសរើស"})]})]}),e.jsxs("div",{className:"bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3",children:[e.jsxs("h4",{className:"text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2",children:[e.jsx(qa,{className:"w-4 h-4 text-indigo-600"}),e.jsx("span",{children:"តួនាទី និងភារកិច្ចរបស់ថ្នាក់ដឹកនាំសិស្ស"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600",children:[e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1",children:[e.jsx("div",{className:"font-bold text-slate-900 text-amber-900",children:"👑 ប្រធានថ្នាក់៖"}),e.jsx("div",{children:"• ជួយគ្រូគ្រប់គ្រងវិន័យទូទៅក្នុងថ្នាក់"}),e.jsx("div",{children:"• ត្រួតពិនិត្យវត្តមាន និងរបាយការណ៍"}),e.jsx("div",{children:"• ដឹកនាំប្រជុំ និងសម្របសម្រួលអនុសាខាទាំង៦"})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1",children:[e.jsx("div",{className:"font-bold text-slate-900 text-indigo-900",children:"🎖️ អនុប្រធានទី១៖"}),e.jsx("div",{children:"• ទទួលបន្ទុកផ្នែកសិក្សា និងមិត្តជួយមិត្ត"}),e.jsx("div",{children:"• ជួយមើលការខុសត្រូវសិស្សរៀនយឺត"}),e.jsx("div",{children:"• ពិនិត្យសៀវភៅស្វ័យសិក្សា និងកិច្ចការផ្ទះ"})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1",children:[e.jsx("div",{className:"font-bold text-slate-900 text-purple-900",children:"🎖️ អនុប្រធានទី២៖"}),e.jsx("div",{children:"• ទទួលបន្ទុកអនាម័យ បរិស្ថាន និងកីឡា"}),e.jsx("div",{children:"• ត្រួតពិនិត្យវែនសម្អាតរបស់អនុសាខាទាំង៦"}),e.jsx("div",{children:"• ពិនិត្យការថែទាំសួនបន្លែ និងផ្កាក្នុងសាលា"})]})]})]})]}),c==="special_needs"`,
  `children:["លេខរៀង #",X.rollNo||X.id," • ទទួលបន្ទុកសកម្មភាព ស្រោចផ្កា & កីឡា"]})]}):e.jsx("div",{className:"p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 italic text-center",children:"មិនទាន់បានជ្រើសរើស"})]}),e.jsxs("div",{className:"bg-white p-5 rounded-2xl border-2 border-teal-200 shadow-sm space-y-3 relative overflow-hidden",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("span",{className:"inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-100 text-teal-950 font-black text-xs border border-teal-200",children:[e.jsx(Ns,{className:"w-3.5 h-3.5 text-teal-600"}),"អនុប្រធានទី៣"]}),e.jsx("span",{className:"text-xs font-bold text-teal-600",children:"🎖️ 3rd VP"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-black text-slate-700 block",children:"ជ្រើសរើសអនុប្រធានទី៣៖"}),e.jsxs("select",{value:u.vicePresident3Id||"",onChange:q=>{var re;const ae=q.target.value?Number(q.target.value):null,ie={...u,vicePresident3Id:ae};h(ie),i(ie),l(\`🎖️ បានជ្រើសរើសអនុប្រធានទី៣៖ \${((re=D.find(Q=>Q.id===ae))==null?void 0:re.name)||"គ្មាន"}\`)},className:"w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none",children:[e.jsx("option",{value:"",children:"-- សូមជ្រើសរើសអនុប្រធានទី៣ --"}),D.map(q=>e.jsxs("option",{value:q.id,children:["#",q.rollNo||q.id," - ",q.name," (",q.gender,")"]},q.id))]})]}),X3?e.jsxs("div",{className:"p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs space-y-1 text-slate-800",children:[e.jsxs("div",{className:"font-bold text-teal-950 flex items-center gap-1.5",children:[e.jsx(hs,{className:"w-4 h-4 text-emerald-600"}),e.jsxs("span",{children:[X3.name," (",X3.gender,")"]})]}),e.jsxs("p",{className:"text-[11px] text-slate-600",children:["លេខរៀង #",X3.rollNo||X3.id," • ជួយសម្របសម្រួលសណ្តាប់ធ្នាប់ វត្តមាន & អនុសាខា"]})]}):e.jsx("div",{className:"p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 italic text-center",children:"មិនទាន់បានជ្រើសរើស"})]})]}),e.jsxs("div",{className:"bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3",children:[e.jsxs("h4",{className:"text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2",children:[e.jsx(qa,{className:"w-4 h-4 text-indigo-600"}),e.jsx("span",{children:"តួនាទី និងភារកិច្ចរបស់ថ្នាក់ដឹកនាំសិស្ស"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-600",children:[e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1",children:[e.jsx("div",{className:"font-bold text-slate-900 text-amber-900",children:"👑 ប្រធានថ្នាក់៖"}),e.jsx("div",{children:"• ជួយគ្រូគ្រប់គ្រងវិន័យទូទៅក្នុងថ្នាក់"}),e.jsx("div",{children:"• ត្រួតពិនិត្យវត្តមាន និងរបាយការណ៍"}),e.jsx("div",{children:"• ដឹកនាំប្រជុំ និងសម្របសម្រួលអនុសាខាទាំង៦"})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1",children:[e.jsx("div",{className:"font-bold text-slate-900 text-indigo-900",children:"🎖️ អនុប្រធានទី១៖"}),e.jsx("div",{children:"• ទទួលបន្ទុកផ្នែកសិក្សា និងមិត្តជួយមិត្ត"}),e.jsx("div",{children:"• ជួយមើលការខុសត្រូវសិស្សរៀនយឺត"}),e.jsx("div",{children:"• ពិនិត្យសៀវភៅស្វ័យសិក្សា និងកិច្ចការផ្ទះ"})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1",children:[e.jsx("div",{className:"font-bold text-slate-900 text-purple-900",children:"🎖️ អនុប្រធានទី២៖"}),e.jsx("div",{children:"• ទទួលបន្ទុកអនាម័យ បរិស្ថាន និងកីឡា"}),e.jsx("div",{children:"• ត្រួតពិនិត្យវែនសម្អាតរបស់អនុសាខាទាំង៦"}),e.jsx("div",{children:"• ពិនិត្យការថែទាំសួនបន្លែ និងផ្កាក្នុងសាលា"})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1",children:[e.jsx("div",{className:"font-bold text-slate-900 text-teal-900",children:"🎖️ អនុប្រធានទី៣៖"}),e.jsx("div",{children:"• ជួយសម្របសម្រួលសណ្តាប់ធ្នាប់ និងវត្តមាន"}),e.jsx("div",{children:"• តាមដានសម្ភារៈសិក្សា និងបរិក្ខារក្នុងថ្នាក់"}),e.jsx("div",{children:"• ជួយប្រធាន និងអនុប្រធានទាំង២ក្នុងការងារអនុសាខា"})]})]})]})]}),c==="special_needs"`
);

replaceExact(
  "RCe special_needs VP3 badge",
  `const ae=u.eyeCareIds.includes(q.id),ie=u.slowLearnerIds.includes(q.id),re=u.presidentId===q.id,Q=u.vicePresident1Id===q.id,R=u.vicePresident2Id===q.id,J=F(q.id);`,
  `const ae=u.eyeCareIds.includes(q.id),ie=u.slowLearnerIds.includes(q.id),re=u.presidentId===q.id,Q=u.vicePresident1Id===q.id,R=u.vicePresident2Id===q.id,R3=u.vicePresident3Id===q.id,J=F(q.id);`
);

replaceExact(
  "RCe special_needs VP3 pill",
  `R&&e.jsx("span",{className:"px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 font-black",children:"🎖️ អនុប្រធាន២"}),J&&`,
  `R&&e.jsx("span",{className:"px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 font-black",children:"🎖️ អនុប្រធាន២"}),R3&&e.jsx("span",{className:"px-1.5 py-0.2 rounded bg-teal-100 text-teal-900 font-black",children:"🎖️ អនុប្រធាន៣"}),J&&`
);

replaceExact(
  "RCe sub_branches VP3 badge",
  `u.vicePresident2Id===Q.id&&e.jsx("span",{className:"text-[9px] px-1 bg-purple-100 text-purple-900 rounded font-bold",children:"🎖️២"}),e.jsx("button",{type:"button",onClick:()=>M(Q.id,0)`,
  `u.vicePresident2Id===Q.id&&e.jsx("span",{className:"text-[9px] px-1 bg-purple-100 text-purple-900 rounded font-bold",children:"🎖️២"}),u.vicePresident3Id===Q.id&&e.jsx("span",{className:"text-[9px] px-1 bg-teal-100 text-teal-900 rounded font-bold",children:"🎖️៣"}),e.jsx("button",{type:"button",onClick:()=>M(Q.id,0)`
);

replaceExact(
  "RCe weekly_duty leader summary",
  `e.jsxs("div",{children:["• ",e.jsx("strong",{children:"អនុប្រធានទី១ & ទី២៖"})," ",(E==null?void 0:E.name)||"(គ្មាន)"," & ",(X==null?void 0:X.name)||"(គ្មាន)"]})`,
  `e.jsxs("div",{children:["• ",e.jsx("strong",{children:"អនុប្រធានទី១ · ទី២ · ទី៣៖"})," ",(E==null?void 0:E.name)||"(គ្មាន)"," · ",(X==null?void 0:X.name)||"(គ្មាន)"," · ",(X3==null?void 0:X3.name)||"(គ្មាន)"]})`
);

replaceExact(
  "RCe print_preview org chart 3 VPs",
  `e.jsxs("div",{className:"grid grid-cols-2 gap-6 sm:gap-16 pt-1",children:[e.jsxs("div",{className:"p-2 rounded-xl border-2 border-rose-400 bg-rose-50/50 text-center min-w-[120px]",children:[e.jsx("div",{className:"text-[10px] font-moul text-rose-700",children:"អនុប្រធានទី១"}),e.jsx("div",{className:"text-xs font-bold text-rose-900 mt-0.5",children:(E==null?void 0:E.name)||"យិន ធារ័ត្ន"})]}),e.jsxs("div",{className:"p-2 rounded-xl border-2 border-purple-400 bg-purple-50/50 text-center min-w-[120px]",children:[e.jsx("div",{className:"text-[10px] font-moul text-purple-700",children:"អនុប្រធានទី២"}),e.jsx("div",{className:"text-xs font-bold text-purple-900 mt-0.5",children:(X==null?void 0:X.name)||"រមឹ ស្រីកា"})]})]})`,
  `e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pt-1",children:[e.jsxs("div",{className:"p-2 rounded-xl border-2 border-rose-400 bg-rose-50/50 text-center min-w-[115px]",children:[e.jsx("div",{className:"text-[10px] font-moul text-rose-700",children:"អនុប្រធានទី១"}),e.jsx("div",{className:"text-xs font-bold text-rose-900 mt-0.5",children:(E==null?void 0:E.name)||"យិន ធារ័ត្ន"})]}),e.jsxs("div",{className:"p-2 rounded-xl border-2 border-purple-400 bg-purple-50/50 text-center min-w-[115px]",children:[e.jsx("div",{className:"text-[10px] font-moul text-purple-700",children:"អនុប្រធានទី២"}),e.jsx("div",{className:"text-xs font-bold text-purple-900 mt-0.5",children:(X==null?void 0:X.name)||"រមឹ ស្រីកា"})]}),e.jsxs("div",{className:"p-2 rounded-xl border-2 border-teal-400 bg-teal-50/50 text-center min-w-[115px]",children:[e.jsx("div",{className:"text-[10px] font-moul text-teal-700",children:"អនុប្រធានទី៣"}),e.jsx("div",{className:"text-xs font-bold text-teal-900 mt-0.5",children:(X3==null?void 0:X3.name)||"គ្មាន"})]})]})`
);

replaceExact(
  "RCe bottom summary bar",
  `e.jsxs("span",{children:["ថ្នាក់ដឹកនាំ៖ ",e.jsx("strong",{children:(T==null?void 0:T.name)||"មិនទាន់រើស"})," (ប្រធាន) | ",e.jsx("strong",{children:(E==null?void 0:E.name)||"គ្មាន"})," & ",e.jsx("strong",{children:(X==null?void 0:X.name)||"គ្មាន"})," (អនុប្រធាន)"]})`,
  `e.jsxs("span",{children:["ថ្នាក់ដឹកនាំ៖ ",e.jsx("strong",{children:(T==null?void 0:T.name)||"មិនទាន់រើស"})," (ប្រធាន) | ",e.jsx("strong",{children:(E==null?void 0:E.name)||"គ្មាន"}),", ",e.jsx("strong",{children:(X==null?void 0:X.name)||"គ្មាន"})," & ",e.jsx("strong",{children:(X3==null?void 0:X3.name)||"គ្មាន"})," (អនុប្រធាន)"]})`
);

// 3. A2 seating generator
replaceExact(
  "A2 leaders and seats VP3",
  `      w=n.filter(X=>X.id===a.presidentId||X.id===a.vicePresident1Id||X.id===a.vicePresident2Id),
      j=n.filter(X=>!a.eyeCareIds.includes(X.id)&&!a.slowLearnerIds.includes(X.id)&&X.id!==a.presidentId&&X.id!==a.vicePresident1Id&&X.id!==a.vicePresident2Id),`,
  `      w=n.filter(X=>X.id===a.presidentId||X.id===a.vicePresident1Id||X.id===a.vicePresident2Id||X.id===a.vicePresident3Id),
      j=n.filter(X=>!a.eyeCareIds.includes(X.id)&&!a.slowLearnerIds.includes(X.id)&&X.id!==a.presidentId&&X.id!==a.vicePresident1Id&&X.id!==a.vicePresident2Id&&X.id!==a.vicePresident3Id),`
);

replaceExact(
  "A2 seatLeft & seatRight VP3",
  `    if(B){
      const X=a?a.presidentId===B.id:j===0,H=a?a.vicePresident1Id===B.id:j===1,O=a?a.vicePresident2Id===B.id:j===2,
        z=a?a.eyeCareIds.includes(B.id):h===1,M=a?a.slowLearnerIds.includes(B.id):!1,V=d(B.id);
      let G="សមាជិក";
      X?G="ប្រធានថ្នាក់":H?G="អនុប្រធានទី១":O?G="អនុប្រធានទី២":M?G="សិស្សរៀនយឺត (ជំនួយ)":z?G="សិស្សខ្សោយភ្នែក":B.familyStatus&&(G=\`សិស្ស (\${B.familyStatus})\`);
      T={id:B.id,rollNo:B.rollNo||j+1,name:B.name,gender:B.gender||"ប្រុស",role:G,photo:B.photo||B.avatar||B.photoUrl||"",
        isLeader:X||H||O,isPresident:X,isVicePresident1:H,isVicePresident2:O,isTopStudent:j<5,needsEyeCare:z,isSlowLearner:M,subBranch:V,
        notes:z?"ជួរមុខជិតក្តារខៀន":M?"ត្រូវការបង្រៀនបន្ថែម":void 0};
    }else T={id:-100-w,rollNo:0,name:"(ទំនេរ)",gender:"ប្រុស",role:"កៅអីទំនេរ"};
    let E;
    if(A){
      const X=a?a.presidentId===A.id:!1,H=a?a.vicePresident1Id===A.id:N===1,O=a?a.vicePresident2Id===A.id:N===2,
        z=a?a.eyeCareIds.includes(A.id):h===1,M=a?a.slowLearnerIds.includes(A.id):!1,V=d(A.id);
      let G="សមាជិក";
      X?G="ប្រធានថ្នាក់":H?G="អនុប្រធានទី១":O?G="អនុប្រធានទី២":M?G="សិស្សរៀនយឺត (ជំនួយ)":z?G="សិស្សខ្សោយភ្នែក":A.familyStatus&&(G=\`សិស្ស (\${A.familyStatus})\`);
      E={id:A.id,rollNo:A.rollNo||N+1,name:A.name,gender:A.gender||"ស្រី",role:G,photo:A.photo||A.avatar||A.photoUrl||"",
        isLeader:X||H||O,isPresident:X,isVicePresident1:H,isVicePresident2:O,isTopStudent:N<5,needsEyeCare:z,isSlowLearner:M,subBranch:V,
        notes:z?"ជួរមុខជិតក្តារខៀន":M?"ត្រូវការបង្រៀនបន្ថែម":void 0};
    }`,
  `    if(B){
      const X=a?a.presidentId===B.id:j===0,H=a?a.vicePresident1Id===B.id:j===1,O=a?a.vicePresident2Id===B.id:j===2,O3=a?a.vicePresident3Id===B.id:j===3,
        z=a?a.eyeCareIds.includes(B.id):h===1,M=a?a.slowLearnerIds.includes(B.id):!1,V=d(B.id);
      let G="សមាជិក";
      X?G="ប្រធានថ្នាក់":H?G="អនុប្រធានទី១":O?G="អនុប្រធានទី២":O3?G="អនុប្រធានទី៣":M?G="សិស្សរៀនយឺត (ជំនួយ)":z?G="សិស្សខ្សោយភ្នែក":B.familyStatus&&(G=\`សិស្ស (\${B.familyStatus})\`);
      T={id:B.id,rollNo:B.rollNo||j+1,name:B.name,gender:B.gender||"ប្រុស",role:G,photo:B.photo||B.avatar||B.photoUrl||"",
        isLeader:X||H||O||O3,isPresident:X,isVicePresident1:H,isVicePresident2:O,isVicePresident3:O3,isTopStudent:j<5,needsEyeCare:z,isSlowLearner:M,subBranch:V,
        notes:z?"ជួរមុខជិតក្តារខៀន":M?"ត្រូវការបង្រៀនបន្ថែម":void 0};
    }else T={id:-100-w,rollNo:0,name:"(ទំនេរ)",gender:"ប្រុស",role:"កៅអីទំនេរ"};
    let E;
    if(A){
      const X=a?a.presidentId===A.id:!1,H=a?a.vicePresident1Id===A.id:N===1,O=a?a.vicePresident2Id===A.id:N===2,O3=a?a.vicePresident3Id===A.id:N===3,
        z=a?a.eyeCareIds.includes(A.id):h===1,M=a?a.slowLearnerIds.includes(A.id):!1,V=d(A.id);
      let G="សមាជិក";
      X?G="ប្រធានថ្នាក់":H?G="អនុប្រធានទី១":O?G="អនុប្រធានទី២":O3?G="អនុប្រធានទី៣":M?G="សិស្សរៀនយឺត (ជំនួយ)":z?G="សិស្សខ្សោយភ្នែក":A.familyStatus&&(G=\`សិស្ស (\${A.familyStatus})\`);
      E={id:A.id,rollNo:A.rollNo||N+1,name:A.name,gender:A.gender||"ស្រី",role:G,photo:A.photo||A.avatar||A.photoUrl||"",
        isLeader:X||H||O||O3,isPresident:X,isVicePresident1:H,isVicePresident2:O,isVicePresident3:O3,isTopStudent:N<5,needsEyeCare:z,isSlowLearner:M,subBranch:V,
        notes:z?"ជួរមុខជិតក្តារខៀន":M?"ត្រូវការបង្រៀនបន្ថែម":void 0};
    }`
);

// 4. MCe state, handlers, reset, Cr, committeeHtml, vMode==="committee", and seat modal h role editing
replaceExact(
  "MCe initial state VP3",
  `return Ve.forEach((ct,Ft)=>{kt[Ft%6+1].push(ct)}),{presidentId:Ve[0]||1,vicePresident1Id:Ve[1]||2,vicePresident2Id:Ve[2]||3,slowLearnerIds:[],eyeCareIds:[Ve[3],Ve[4]].filter(Boolean),subBranches:kt,dailyTasks:dm};`,
  `return Ve.forEach((ct,Ft)=>{kt[Ft%6+1].push(ct)}),{presidentId:Ve[0]||1,vicePresident1Id:Ve[1]||2,vicePresident2Id:Ve[2]||3,vicePresident3Id:Ve[3]||4,slowLearnerIds:[],eyeCareIds:[Ve[4],Ve[5]].filter(Boolean),subBranches:kt,dailyTasks:dm};`
);

replaceExact(
  "MCe handlers ge/Xe/Oe/Oe3 + De reset preserves q",
  `  const ge=Ze=>{var ct;const Ve={...q,presidentId:Ze};Q(Ve);const kt=((ct=de.find(Ft=>Ft.id===Ze))==null?void 0:ct.name)||"សិស្ស";s(\`👑 បានតែងតាំង «\${kt}» ជាប្រធានថ្នាក់!\`)};
  const Xe=Ze=>{var ct;const Ve={...q,vicePresident1Id:Ze};Q(Ve);const kt=((ct=de.find(Ft=>Ft.id===Ze))==null?void 0:ct.name)||"សិស្ស";s(\`🎖️ បានតែងតាំង «\${kt}» ជាអនុប្រធានទី ១!\`)};
  const Oe=Ze=>{var ct;const Ve={...q,vicePresident2Id:Ze};Q(Ve);const kt=((ct=de.find(Ft=>Ft.id===Ze))==null?void 0:ct.name)||"សិស្ស";s(\`🎖️ បានតែងតាំង «\${kt}» ជាអនុប្រធានទី ២!\`)};
  const Ie=()=>{
    if(!de||de.length===0){s("មិនទាន់មានបញ្ជីសិស្សទេ!");return}
    const Ze={1:[],2:[],3:[],4:[],5:[],6:[]};
    de.forEach((kt,ct)=>{Ze[ct%6+1].push(kt.id)});
    Q({...q,subBranches:Ze}),s("✨ បានបែងចែកសិស្សទៅអនុសាខាទាំង ៦ ដោយស្មើភាពស្វ័យប្រវត្តិ!");
  };
  const De=()=>{
    t&&t.length>0?(re(A2(t,Z,r.grade)),s(\`✨ បានរៀបប្លង់តុស្វ័យប្រវត្តិតាមទិន្នន័យសិស្ស \${t.length} នាក់ (\${Z} ជួរទទឹង)\`)):(re(K$()),s("✨ បានរៀបប្លង់តុស្វ័យប្រវត្តិតាមគំរូ ៤ ជួរទទឹង × ៦ ជួរបណ្តាយ"));
  };`,
  `  const ge=Ze=>{var ct;const id=Ze||null,Ve={...q,presidentId:id};Q(Ve);const kt=((ct=de.find(Ft=>Ft.id===id))==null?void 0:ct.name)||"គ្មាន";s(id?\`👑 បានតែងតាំង «\${kt}» ជាប្រធានថ្នាក់!\`:"👑 បានដកតំណែងប្រធានថ្នាក់")};
  const Xe=Ze=>{var ct;const id=Ze||null,Ve={...q,vicePresident1Id:id};Q(Ve);const kt=((ct=de.find(Ft=>Ft.id===id))==null?void 0:ct.name)||"គ្មាន";s(id?\`🎖️ បានតែងតាំង «\${kt}» ជាអនុប្រធានទី ១!\`:"🎖️ បានដកតំណែងអនុប្រធានទី ១")};
  const Oe=Ze=>{var ct;const id=Ze||null,Ve={...q,vicePresident2Id:id};Q(Ve);const kt=((ct=de.find(Ft=>Ft.id===id))==null?void 0:ct.name)||"គ្មាន";s(id?\`🎖️ បានតែងតាំង «\${kt}» ជាអនុប្រធានទី ២!\`:"🎖️ បានដកតំណែងអនុប្រធានទី ២")};
  const Oe3=Ze=>{var ct;const id=Ze||null,Ve={...q,vicePresident3Id:id};Q(Ve);const kt=((ct=de.find(Ft=>Ft.id===id))==null?void 0:ct.name)||"គ្មាន";s(id?\`🎖️ បានតែងតាំង «\${kt}» ជាអនុប្រធានទី ៣!\`:"🎖️ បានដកតំណែងអនុប្រធានទី ៣")};
  const assignSeatRole=(st,rk)=>{
    if(!st||st.id<=0)return;
    const nxt={...q};
    if(nxt.presidentId===st.id)nxt.presidentId=null;
    if(nxt.vicePresident1Id===st.id)nxt.vicePresident1Id=null;
    if(nxt.vicePresident2Id===st.id)nxt.vicePresident2Id=null;
    if(nxt.vicePresident3Id===st.id)nxt.vicePresident3Id=null;
    let rLbl="សមាជិក";
    if(rk==="pres"){nxt.presidentId=st.id;rLbl="ប្រធានថ្នាក់";}
    else if(rk==="vp1"){nxt.vicePresident1Id=st.id;rLbl="អនុប្រធានទី១";}
    else if(rk==="vp2"){nxt.vicePresident2Id=st.id;rLbl="អនុប្រធានទី២";}
    else if(rk==="vp3"){nxt.vicePresident3Id=st.id;rLbl="អនុប្រធានទី៣";}
    else if(st.needsEyeCare){rLbl="សិស្សខ្សោយភ្នែក";}
    else if(st.isSlowLearner){rLbl="សិស្សរៀនយឺត (ជំនួយ)";}
    Q(nxt);
    m({...st,role:rLbl,isLeader:rk!=="member",isPresident:rk==="pres",isVicePresident1:rk==="vp1",isVicePresident2:rk==="vp2",isVicePresident3:rk==="vp3"});
    s(\`✅ បានកែតម្រូវតួនាទី «\${st.name}» ជា «\${rLbl}»!\`);
  };
  const Ie=()=>{
    if(!de||de.length===0){s("មិនទាន់មានបញ្ជីសិស្សទេ!");return}
    const Ze={1:[],2:[],3:[],4:[],5:[],6:[]};
    de.forEach((kt,ct)=>{Ze[ct%6+1].push(kt.id)});
    Q({...q,subBranches:Ze}),s("✨ បានបែងចែកសិស្សទៅអនុសាខាទាំង ៦ ដោយស្មើភាពស្វ័យប្រវត្តិ!");
  };
  const De=()=>{
    t&&t.length>0?(re(A2(t,Z,r.grade,q)),s(\`✨ បានរៀបប្លង់តុស្វ័យប្រវត្តិតាមទិន្នន័យសិស្ស \${t.length} នាក់ (\${Z} ជួរទទឹង)\`)):(re(K$()),s("✨ បានរៀបប្លង់តុស្វ័យប្រវត្តិតាមគំរូ ៤ ជួរទទឹង × ៦ ជួរបណ្តាយ"));
  };`
);

replaceExact(
  "MCe Cr cardCls, ringCls, badge for VP3",
  `      :(Ze.isPresident?"bg-amber-50 border-amber-400 shadow-xs":Ze.isVicePresident1?"bg-indigo-50 border-indigo-300 shadow-xs":Ze.isVicePresident2?"bg-cyan-50 border-cyan-300 shadow-xs":Ft?"bg-amber-50 border-amber-300 shadow-2xs":isGirl?"bg-pink-50 border-pink-200 hover:border-pink-400":"bg-sky-50 border-sky-200 hover:border-sky-400");
    const ringCls=Ze.isPresident?"border-amber-400":Ze.isVicePresident1?"border-indigo-500":Ze.isVicePresident2?"border-cyan-500":isGirl?"border-pink-400":"border-sky-400";`,
  `      :(Ze.isPresident?"bg-amber-50 border-amber-400 shadow-xs":Ze.isVicePresident1?"bg-indigo-50 border-indigo-300 shadow-xs":Ze.isVicePresident2?"bg-cyan-50 border-cyan-300 shadow-xs":Ze.isVicePresident3?"bg-purple-50 border-purple-300 shadow-xs":Ft?"bg-amber-50 border-amber-300 shadow-2xs":isGirl?"bg-pink-50 border-pink-200 hover:border-pink-400":"bg-sky-50 border-sky-200 hover:border-sky-400");
    const ringCls=Ze.isPresident?"border-amber-400":Ze.isVicePresident1?"border-indigo-500":Ze.isVicePresident2?"border-cyan-500":Ze.isVicePresident3?"border-purple-500":isGirl?"border-pink-400":"border-sky-400";`
);

replaceExact(
  "MCe Cr badge text for VP3",
  `        :Ze.isVicePresident2?e.jsx("span",{className:dark?"text-cyan-300":"text-cyan-700",children:"🎖️ អនុទី២"})
        :Ft?e.jsx`,
  `        :Ze.isVicePresident2?e.jsx("span",{className:dark?"text-cyan-300":"text-cyan-700",children:"🎖️ អនុទី២"})
        :Ze.isVicePresident3?e.jsx("span",{className:dark?"text-purple-300":"text-purple-700",children:"🎖️ អនុទី៣"})
        :Ft?e.jsx`
);

replaceExact(
  "MCe committeeHtml 4 leadership boxes",
  `  const committeeHtml=sanPdf?\`<div style="font-family:'Kantumruy Pro','Siemreap',sans-serif;font-size:10pt;color:#0f172a;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;">
      <div style="border:2px solid #f59e0b;border-radius:10px;overflow:hidden;background:#fffbeb;text-align:center;">
        <div style="background:linear-gradient(90deg,#f59e0b,#ea580c);color:#fff;padding:5px 8px;font-size:8.5pt;font-weight:800;">👑 ប្រធានថ្នាក់</div>
        <div style="padding:7px 8px;font-size:10.5pt;font-weight:800;color:#78350f;">\${escS(((de.find(u=>u.id===q.presidentId))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="border:2px solid #6366f1;border-radius:10px;overflow:hidden;background:#eef2ff;text-align:center;">
        <div style="background:linear-gradient(90deg,#2563eb,#4f46e5);color:#fff;padding:5px 8px;font-size:8.5pt;font-weight:800;">🎖️ អនុប្រធានទី ១</div>
        <div style="padding:7px 8px;font-size:10.5pt;font-weight:800;color:#312e81;">\${escS(((de.find(u=>u.id===q.vicePresident1Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="border:2px solid #06b6d4;border-radius:10px;overflow:hidden;background:#ecfeff;text-align:center;">
        <div style="background:linear-gradient(90deg,#06b6d4,#0d9488);color:#fff;padding:5px 8px;font-size:8.5pt;font-weight:800;">🎖️ អនុប្រធានទី ២</div>
        <div style="padding:7px 8px;font-size:10.5pt;font-weight:800;color:#155e75;">\${escS(((de.find(u=>u.id===q.vicePresident2Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
    </div>`,
  `  const committeeHtml=sanPdf?\`<div style="font-family:'Kantumruy Pro','Siemreap',sans-serif;font-size:10pt;color:#0f172a;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;">
      <div style="border:2px solid #f59e0b;border-radius:10px;overflow:hidden;background:#fffbeb;text-align:center;">
        <div style="background:linear-gradient(90deg,#f59e0b,#ea580c);color:#fff;padding:5px 6px;font-size:8pt;font-weight:800;">👑 ប្រធានថ្នាក់</div>
        <div style="padding:6px 6px;font-size:9.5pt;font-weight:800;color:#78350f;">\${escS(((de.find(u=>u.id===q.presidentId))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="border:2px solid #6366f1;border-radius:10px;overflow:hidden;background:#eef2ff;text-align:center;">
        <div style="background:linear-gradient(90deg,#2563eb,#4f46e5);color:#fff;padding:5px 6px;font-size:8pt;font-weight:800;">🎖️ អនុប្រធានទី ១</div>
        <div style="padding:6px 6px;font-size:9.5pt;font-weight:800;color:#312e81;">\${escS(((de.find(u=>u.id===q.vicePresident1Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="border:2px solid #06b6d4;border-radius:10px;overflow:hidden;background:#ecfeff;text-align:center;">
        <div style="background:linear-gradient(90deg,#06b6d4,#0d9488);color:#fff;padding:5px 6px;font-size:8pt;font-weight:800;">🎖️ អនុប្រធានទី ២</div>
        <div style="padding:6px 6px;font-size:9.5pt;font-weight:800;color:#155e75;">\${escS(((de.find(u=>u.id===q.vicePresident2Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="border:2px solid #9333ea;border-radius:10px;overflow:hidden;background:#faf5ff;text-align:center;">
        <div style="background:linear-gradient(90deg,#7c3aed,#9333ea);color:#fff;padding:5px 6px;font-size:8pt;font-weight:800;">🎖️ អនុប្រធានទី ៣</div>
        <div style="padding:6px 6px;font-size:9.5pt;font-weight:800;color:#581c87;">\${escS(((de.find(u=>u.id===q.vicePresident3Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
    </div>`
);

replaceExact(
  "MCe seating legend VP1-3",
  `        e.jsx("span",{children:"🎖️ អនុប្រធាន"}),`,
  `        e.jsx("span",{children:"🎖️ អនុប្រធាន (ទី១ · ទី២ · ទី៣)"}),`
);

replaceExact(
  "MCe committee view 4-column leadership selector",
  `      e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3.5",children:[
        e.jsxs("div",{className:"rounded-2xl border-2 border-amber-300 bg-amber-50 overflow-hidden shadow-xs",children:[
          e.jsx("div",{className:"bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-2 text-xs font-extrabold text-white",children:"👑 ប្រធានថ្នាក់"}),
          e.jsx("div",{className:"p-3",children:
            e.jsxs("select",{value:q.presidentId||"",onChange:Ze=>ge(Number(Ze.target.value)),className:"w-full p-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-amber-500",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសប្រធានថ្នាក់ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},` + "`pres2-${Ze.id}`" + `))
            ]})
          })
        ]}),
        e.jsxs("div",{className:"rounded-2xl border-2 border-indigo-300 bg-indigo-50 overflow-hidden shadow-xs",children:[
          e.jsx("div",{className:"bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-extrabold text-white",children:"🎖️ អនុប្រធានទី ១"}),
          e.jsx("div",{className:"p-3",children:
            e.jsxs("select",{value:q.vicePresident1Id||"",onChange:Ze=>Xe(Number(Ze.target.value)),className:"w-full p-2 bg-white border border-indigo-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ១ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},` + "`vp12-${Ze.id}`" + `))
            ]})
          })
        ]}),
        e.jsxs("div",{className:"rounded-2xl border-2 border-cyan-300 bg-cyan-50 overflow-hidden shadow-xs",children:[
          e.jsx("div",{className:"bg-gradient-to-r from-cyan-500 to-teal-500 px-3.5 py-2 text-xs font-extrabold text-white",children:"🎖️ អនុប្រធានទី ២"}),
          e.jsx("div",{className:"p-3",children:
            e.jsxs("select",{value:q.vicePresident2Id||"",onChange:Ze=>Oe(Number(Ze.target.value)),className:"w-full p-2 bg-white border border-cyan-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-cyan-500",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ២ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},` + "`vp22-${Ze.id}`" + `))
            ]})
          })
        ]})
      ]}),`,
  `      e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5",children:[
        e.jsxs("div",{className:"rounded-2xl border-2 border-amber-300 bg-amber-50 overflow-hidden shadow-xs",children:[
          e.jsx("div",{className:"bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-2 text-xs font-extrabold text-white",children:"👑 ប្រធានថ្នាក់"}),
          e.jsx("div",{className:"p-3",children:
            e.jsxs("select",{value:q.presidentId||"",onChange:Ze=>ge(Ze.target.value?Number(Ze.target.value):null),className:"w-full p-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-amber-500",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសប្រធានថ្នាក់ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},` + "`pres2-${Ze.id}`" + `))
            ]})
          })
        ]}),
        e.jsxs("div",{className:"rounded-2xl border-2 border-indigo-300 bg-indigo-50 overflow-hidden shadow-xs",children:[
          e.jsx("div",{className:"bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-extrabold text-white",children:"🎖️ អនុប្រធានទី ១"}),
          e.jsx("div",{className:"p-3",children:
            e.jsxs("select",{value:q.vicePresident1Id||"",onChange:Ze=>Xe(Ze.target.value?Number(Ze.target.value):null),className:"w-full p-2 bg-white border border-indigo-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ១ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},` + "`vp12-${Ze.id}`" + `))
            ]})
          })
        ]}),
        e.jsxs("div",{className:"rounded-2xl border-2 border-cyan-300 bg-cyan-50 overflow-hidden shadow-xs",children:[
          e.jsx("div",{className:"bg-gradient-to-r from-cyan-500 to-teal-500 px-3.5 py-2 text-xs font-extrabold text-white",children:"🎖️ អនុប្រធានទី ២"}),
          e.jsx("div",{className:"p-3",children:
            e.jsxs("select",{value:q.vicePresident2Id||"",onChange:Ze=>Oe(Ze.target.value?Number(Ze.target.value):null),className:"w-full p-2 bg-white border border-cyan-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-cyan-500",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ២ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},` + "`vp22-${Ze.id}`" + `))
            ]})
          })
        ]}),
        e.jsxs("div",{className:"rounded-2xl border-2 border-purple-300 bg-purple-50 overflow-hidden shadow-xs",children:[
          e.jsx("div",{className:"bg-gradient-to-r from-violet-600 to-purple-600 px-3.5 py-2 text-xs font-extrabold text-white",children:"🎖️ អនុប្រធានទី ៣"}),
          e.jsx("div",{className:"p-3",children:
            e.jsxs("select",{value:q.vicePresident3Id||"",onChange:Ze=>Oe3(Ze.target.value?Number(Ze.target.value):null),className:"w-full p-2 bg-white border border-purple-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-purple-500",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ៣ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},` + "`vp32-${Ze.id}`" + `))
            ]})
          })
        ]})
      ]}),`
);

// 5. Seat click modal h: allow directly editing student's leadership role from the seating chart!
replaceExact(
  "MCe seat click modal h editable role selector",
  `            e.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs",children:[
              e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-500",children:"តួនាទីក្នុងថ្នាក់៖"}),e.jsx("span",{className:"font-bold text-slate-900",children:h.role})]}),
              e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-500",children:"ស្ថានភាពភ្នែក៖"}),e.jsx("span",{className:\`font-bold \${h.needsEyeCare?"text-amber-700":"text-emerald-700"}\`,children:h.needsEyeCare?"👁️ ខ្សោយភ្នែក (អង្គុយជួរមុខ)":"✅ ភ្នែកធម្មតា"})]}),
              e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-500",children:"កម្រិតសិក្សា៖"}),e.jsx("span",{className:\`font-bold \${h.isSlowLearner?"text-rose-700":"text-slate-700"}\`,children:h.isSlowLearner?"📘 ត្រូវការជំនួយបន្ថែម":"✅ រៀនធម្មតា"})]})
            ]}),`,
  `            e.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs",children:[
              e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[
                e.jsx("span",{className:"text-slate-600 font-bold shrink-0",children:"តួនាទីក្នុងថ្នាក់៖"}),
                e.jsxs("select",{
                  value:q.presidentId===h.id||h.isPresident?"pres":q.vicePresident1Id===h.id||h.isVicePresident1?"vp1":q.vicePresident2Id===h.id||h.isVicePresident2?"vp2":q.vicePresident3Id===h.id||h.isVicePresident3?"vp3":"member",
                  onChange:ev=>assignSeatRole(h,ev.target.value),
                  className:"px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-900 outline-none focus:border-purple-500",
                  children:[
                    e.jsx("option",{value:"member",children:"សមាជិកថ្នាក់"}),
                    e.jsx("option",{value:"pres",children:"👑 ប្រធានថ្នាក់"}),
                    e.jsx("option",{value:"vp1",children:"🎖️ អនុប្រធានទី ១"}),
                    e.jsx("option",{value:"vp2",children:"🎖️ អនុប្រធានទី ២"}),
                    e.jsx("option",{value:"vp3",children:"🎖️ អនុប្រធានទី ៣"})
                  ]
                })
              ]}),
              e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-500",children:"ស្ថានភាពភ្នែក៖"}),e.jsx("span",{className:\`font-bold \${h.needsEyeCare?"text-amber-700":"text-emerald-700"}\`,children:h.needsEyeCare?"👁️ ខ្សោយភ្នែក (អង្គុយជួរមុខ)":"✅ ភ្នែកធម្មតា"})]}),
              e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-500",children:"កម្រិតសិក្សា៖"}),e.jsx("span",{className:\`font-bold \${h.isSlowLearner?"text-rose-700":"text-slate-700"}\`,children:h.isSlowLearner?"📘 ត្រូវការជំនួយបន្ថែម":"✅ រៀនធម្មតា"})]})
            ]}),`
);

// Parse AST before writing
const sf = ts.createSourceFile("index-BwPwHqBe.js", code, ts.ScriptTarget.Latest, true);
const diags = sf.parseDiagnostics || [];
if (diags.length > 0) {
  console.error("TS Parse diagnostics:", diags.map(d => d.messageText));
  process.exit(1);
}

fs.writeFileSync(targetPath, code, "utf8");
console.log("✅ Successfully patched Vice President 3 across seating chart & committee tables (0 AST errors).");
