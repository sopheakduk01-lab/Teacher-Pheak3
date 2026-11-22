const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

// 1. Vibrant active tab colors in sec3 for seating & sanitation_committee
const tabOld = `return e.jsxs("button",{onClick:()=>fe(oe.id),className:\`px-3.5 py-2.5 rounded-2xl shrink-0 transition flex items-center gap-2 \${ir?"bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold":"bg-gradient-to-r from-white to-purple-50/50 hover:bg-purple-50 text-slate-800 border border-purple-200/60 shadow-2xs font-semibold"}\`,children:[e.jsx(ft,{className:\`w-4 h-4 \${ir?"text-amber-300":"text-slate-500"}\`}),e.jsx("span",{children:oe.label})]},oe.id)`;
const tabNew = `const actCls=oe.id==="seating"?"bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-bold":oe.id==="sanitation_committee"?"bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md font-bold":"bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold";return e.jsxs("button",{onClick:()=>fe(oe.id),className:\`px-3.5 py-2.5 rounded-2xl shrink-0 transition flex items-center gap-2 cursor-pointer \${ir?actCls:"bg-white hover:bg-sky-50 text-slate-800 border border-slate-200 hover:border-sky-300 shadow-2xs font-semibold"}\`,children:[e.jsx(ft,{className:\`w-4 h-4 \${ir?"text-white":"text-slate-500"}\`}),e.jsx("span",{children:oe.label})]},oe.id)`;
if (!src.includes(tabOld)) throw new Error("Missing tabOld");
src = src.replace(tabOld, tabNew);

// 2. Make 6-branch palette (wm) crisp and bright for both cards and table cells
const wmOld = `wm=[{headerBg:"bg-blue-600",headerText:"text-white",border:"border-blue-300",lightBg:"bg-blue-50/50",badge:"bg-blue-100 text-blue-900 border-blue-200",dot:"bg-blue-500"},{headerBg:"bg-rose-600",headerText:"text-white",border:"border-rose-300",lightBg:"bg-rose-50/50",badge:"bg-rose-100 text-rose-900 border-rose-200",dot:"bg-rose-500"},{headerBg:"bg-amber-600",headerText:"text-white",border:"border-amber-300",lightBg:"bg-amber-50/50",badge:"bg-amber-100 text-amber-900 border-amber-200",dot:"bg-amber-500"},{headerBg:"bg-emerald-600",headerText:"text-white",border:"border-emerald-300",lightBg:"bg-emerald-50/50",badge:"bg-emerald-100 text-emerald-900 border-emerald-200",dot:"bg-emerald-500"},{headerBg:"bg-purple-600",headerText:"text-white",border:"border-purple-300",lightBg:"bg-purple-50/50",badge:"bg-purple-100 text-purple-900 border-purple-200",dot:"bg-purple-500"},{headerBg:"bg-orange-600",headerText:"text-white",border:"border-orange-300",lightBg:"bg-orange-50/50",badge:"bg-orange-100 text-orange-900 border-orange-200",dot:"bg-orange-500"}]`;
const wmNew = `wm=[{headerBg:"bg-gradient-to-r from-sky-500 to-blue-600",headerText:"text-white",border:"border-sky-300",lightBg:"bg-sky-50",badge:"bg-sky-100 text-sky-900 border-sky-300",dot:"bg-sky-500",hex:"#0284c7",hexBg:"#e0f2fe",hexBdr:"#7dd3fc",hexTxt:"#0c4a6e"},{headerBg:"bg-gradient-to-r from-rose-500 to-pink-600",headerText:"text-white",border:"border-rose-300",lightBg:"bg-rose-50",badge:"bg-rose-100 text-rose-900 border-rose-300",dot:"bg-rose-500",hex:"#e11d48",hexBg:"#ffe4e6",hexBdr:"#fda4af",hexTxt:"#881337"},{headerBg:"bg-gradient-to-r from-amber-500 to-orange-500",headerText:"text-white",border:"border-amber-300",lightBg:"bg-amber-50",badge:"bg-amber-100 text-amber-900 border-amber-300",dot:"bg-amber-500",hex:"#d97706",hexBg:"#fef3c7",hexBdr:"#fcd34d",hexTxt:"#78350f"},{headerBg:"bg-gradient-to-r from-emerald-500 to-teal-600",headerText:"text-white",border:"border-emerald-300",lightBg:"bg-emerald-50",badge:"bg-emerald-100 text-emerald-900 border-emerald-300",dot:"bg-emerald-500",hex:"#059669",hexBg:"#d1fae5",hexBdr:"#6ee7b7",hexTxt:"#064e3b"},{headerBg:"bg-gradient-to-r from-purple-600 to-indigo-600",headerText:"text-white",border:"border-purple-300",lightBg:"bg-purple-50",badge:"bg-purple-100 text-purple-900 border-purple-300",dot:"bg-purple-500",hex:"#7c3aed",hexBg:"#f3e8ff",hexBdr:"#d8b4fe",hexTxt:"#581c87"},{headerBg:"bg-gradient-to-r from-cyan-500 to-teal-500",headerText:"text-white",border:"border-cyan-300",lightBg:"bg-cyan-50",badge:"bg-cyan-100 text-cyan-900 border-cyan-300",dot:"bg-cyan-500",hex:"#0891b2",hexBg:"#cffafe",hexBdr:"#67e8f9",hexTxt:"#164e63"}]`;
if (!src.includes(wmOld)) throw new Error("Missing wmOld");
src = src.replace(wmOld, wmNew);

// 3. Fresh colorful 1:1 visual PDF seats, desks, groups & stage in buildVisualSeatingHtml
const visSeatOld = `    const ringCol=isPres?"#f59e0b":isVP1?"#6366f1":isVP2?"#0891b2":isGirl?"#f472b6":"#60a5fa";
    const seatBg=dark?(isPres?"#312008":st.isLeader?"#1e1b4b":isEye?"#2b2108":"#0f172a"):(isPres?"#fffbeb":isVP1?"#eef2ff":isVP2?"#ecfeff":isEye?"#fffbeb":"#ffffff");
    const seatBdr=dark?"#334155":(isPres?"#fcd34d":isVP1?"#a5b4fc":isVP2?"#67e8f9":isEye?"#fbbf24":"#e2e8f0");`;
const visSeatNew = `    const ringCol=isPres?"#f59e0b":isVP1?"#4f46e5":isVP2?"#0891b2":isGirl?"#ec4899":"#0284c7";
    const seatBg=dark?(isPres?"#312008":st.isLeader?"#1e1b4b":isEye?"#2b2108":"#0f172a"):(isPres?"#fef3c7":isVP1?"#e0e7ff":isVP2?"#cffafe":isEye?"#fef9c3":isGirl?"#fdf2f8":"#f0f9ff");
    const seatBdr=dark?"#334155":(isPres?"#f59e0b":isVP1?"#818cf8":isVP2?"#22d3ee":isEye?"#eab308":isGirl?"#f9a8d4":"#bae6fd");`;
if (!src.includes(visSeatOld)) throw new Error("Missing visSeatOld");
src = src.replace(visSeatOld, visSeatNew);

const visDeskOld = `  const renderDesk=(d,extraLabel="")=>{
    const isFront=d.rowIndex===1&&hi;
    const isCenter=d.deskType==="center_leader";
    const deskBg=dark?"#1e293b":"#ffffff";
    const deskBdr=bw?"#1e293b":dark?(isCenter?"#6366f1":isFront?"#d97706":"#334155"):(isCenter?"#a5b4fc":isFront?"#f59e0b":"#e2c799");
    const hdrBg=bw?"#f1f5f9":dark?(isCenter?"#312e81":isFront?"#78350f":"#0f172a"):(isCenter?"#eef2ff":isFront?"#fef3c7":"#fdf6e9");
    const hdrCol=dark?"#e2e8f0":"#78350f";
    const numTag=extraLabel||\`តុ \${fr(d.colIndex+(d.rowIndex-1)*cols)}\`;`;
const visDeskNew = `  const dPal=[
    {hdr:"linear-gradient(90deg,#0ea5e9,#2563eb)",bdr:"#7dd3fc"},
    {hdr:"linear-gradient(90deg,#10b981,#0d9488)",bdr:"#6ee7b7"},
    {hdr:"linear-gradient(90deg,#f59e0b,#ea580c)",bdr:"#fcd34d"},
    {hdr:"linear-gradient(90deg,#f43f5e,#db2777)",bdr:"#fda4af"},
    {hdr:"linear-gradient(90deg,#6366f1,#7c3aed)",bdr:"#a5b4fc"},
    {hdr:"linear-gradient(90deg,#06b6d4,#0d9488)",bdr:"#67e8f9"}
  ];
  const renderDesk=(d,extraLabel="")=>{
    const isFront=d.rowIndex===1&&hi;
    const isCenter=d.deskType==="center_leader";
    const pal=dPal[((d.colIndex||1)-1)%dPal.length];
    const deskBg=dark?"#1e293b":"#ffffff";
    const deskBdr=bw?"#1e293b":dark?(isCenter?"#6366f1":isFront?"#d97706":"#334155"):pal.bdr;
    const hdrBg=bw?"#f1f5f9":dark?(isCenter?"#312e81":isFront?"#78350f":"#0f172a"):pal.hdr;
    const hdrCol=bw?"#0f172a":"#ffffff";
    const numTag=extraLabel||\`តុ \${fr(d.colIndex+(d.rowIndex-1)*cols)}\`;`;
if (!src.includes(visDeskOld)) throw new Error("Missing visDeskOld");
src = src.replace(visDeskOld, visDeskNew);

const visStageOld = `  const stageHtml=\`
    <div class="sp-stage" style="background:\${dark?"#0b1120":"#faf8f5"};border:1.5px solid \${bw?"#334155":dark?"#334155":"#e5d5b5"};border-radius:16px;padding:12px;">
      <div class="sp-top-stage">
        <div class="sp-chalkboard" style="\${bw?"background:#f1f5f9;color:#000;border:2px solid #000;":"background:linear-gradient(180deg,#14532d 0%,#064e3b 100%);color:#ffffff;border:4px solid #92400e;"}">`;
const visStageNew = `  const stageHtml=\`
    <div class="sp-stage" style="background:\${dark?"#0b1120":"linear-gradient(180deg,#f0f9ff 0%,#ffffff 50%,#ecfdf5 100%)"};border:2px solid \${bw?"#334155":dark?"#334155":"#6ee7b7"};border-radius:16px;padding:12px;">
      <div class="sp-top-stage">
        <div class="sp-chalkboard" style="\${bw?"background:#f1f5f9;color:#000;border:2px solid #000;":"background:linear-gradient(90deg,#059669 0%,#0d9488 50%,#059669 100%);color:#ffffff;border:4px solid #f59e0b;"}">`;
if (!src.includes(visStageOld)) throw new Error("Missing visStageOld");
src = src.replace(visStageOld, visStageNew);

// 4. Fresh colorful Group themes + Cr student seat card + or desk card in MCe
const grpOld = `      {groupId:"g1",groupNumber:1,groupName:\`ក្រុមទី ១ (\${kt.length} តុ)\`,groupMotto:"សាមគ្គីភាព និងការច្នៃប្រឌិតខ្ពស់",leaderName:vr(kt),colorTheme:{hdrBg:"bg-purple-50 border-purple-200",titleCol:"text-purple-900",box:"border-purple-200 bg-purple-50/30"},desks:kt},
      {groupId:"g2",groupNumber:2,groupName:\`ក្រុមទី ២ (\${ct.length} តុ)\`,groupMotto:"ស្រាវជ្រាវ ស្វែងយល់ និងបង្កើតថ្មី",leaderName:vr(ct),colorTheme:{hdrBg:"bg-blue-50 border-blue-200",titleCol:"text-blue-900",box:"border-blue-200 bg-blue-50/30"},desks:ct},
      {groupId:"g3",groupNumber:3,groupName:\`ក្រុមទី ៣ (\${Ft.length} តុ)\`,groupMotto:"រួមគិត រួមធ្វើ រួមទទួលបានជោគជ័យ",leaderName:vr(Ft),colorTheme:{hdrBg:"bg-emerald-50 border-emerald-200",titleCol:"text-emerald-900",box:"border-emerald-200 bg-emerald-50/30"},desks:Ft},
      {groupId:"g4",groupNumber:4,groupName:\`ក្រុមទី ៤ (\${jr.length} តុ)\`,groupMotto:"អំណានទូលំទូលាយ បញ្ញាភ្លឺថ្លា",leaderName:vr(jr),colorTheme:{hdrBg:"bg-amber-50 border-amber-200",titleCol:"text-amber-900",box:"border-amber-200 bg-amber-50/30"},desks:jr}`;
const grpNew = `      {groupId:"g1",groupNumber:1,groupName:\`ក្រុមទី ១ (\${kt.length} តុ)\`,groupMotto:"សាមគ្គីភាព និងការច្នៃប្រឌិតខ្ពស់",leaderName:vr(kt),colorTheme:{hdrBg:"bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-600 text-white",titleCol:"text-white",subCol:"text-purple-100",box:"border-purple-300 bg-purple-50/50"},desks:kt},
      {groupId:"g2",groupNumber:2,groupName:\`ក្រុមទី ២ (\${ct.length} តុ)\`,groupMotto:"ស្រាវជ្រាវ ស្វែងយល់ និងបង្កើតថ្មី",leaderName:vr(ct),colorTheme:{hdrBg:"bg-gradient-to-r from-sky-500 to-blue-600 border-sky-500 text-white",titleCol:"text-white",subCol:"text-sky-100",box:"border-sky-300 bg-sky-50"},desks:ct},
      {groupId:"g3",groupNumber:3,groupName:\`ក្រុមទី ៣ (\${Ft.length} តុ)\`,groupMotto:"រួមគិត រួមធ្វើ រួមទទួលបានជោគជ័យ",leaderName:vr(Ft),colorTheme:{hdrBg:"bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-600 text-white",titleCol:"text-white",subCol:"text-emerald-100",box:"border-emerald-300 bg-emerald-50/50"},desks:Ft},
      {groupId:"g4",groupNumber:4,groupName:\`ក្រុមទី ៤ (\${jr.length} តុ)\`,groupMotto:"អំណានទូលំទូលាយ បញ្ញាភ្លឺថ្លា",leaderName:vr(jr),colorTheme:{hdrBg:"bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 text-white",titleCol:"text-white",subCol:"text-amber-100",box:"border-amber-300 bg-amber-50/50"},desks:jr}`;
if (!src.includes(grpOld)) throw new Error("Missing grpOld");
src = src.replace(grpOld, grpNew);

// Group header text color alignment in render
const grpHdrOld = `              e.jsx("h4",{className:\`font-extrabold text-sm \${dark?"text-white":Ze.colorTheme.titleCol}\`,children:Ze.groupName}),
              e.jsxs("p",{className:\`text-[11px] font-semibold \${dark?"text-slate-300":"text-slate-600"}\`,children:["ប្រធានក្រុម៖ ",Ze.leaderName]})
            ]}),
            e.jsxs("span",{className:"text-xs font-bold text-slate-500",children:[fr(Ze.desks.length)," តុទ្វេ"]})`;
const grpHdrNew = `              e.jsx("h4",{className:\`font-extrabold text-sm \${dark?"text-white":Ze.colorTheme.titleCol}\`,children:Ze.groupName}),
              e.jsxs("p",{className:\`text-[11px] font-semibold \${dark?"text-slate-300":(Ze.colorTheme.subCol||"text-white")}\`,children:["ប្រធានក្រុម៖ ",Ze.leaderName]})
            ]}),
            e.jsxs("span",{className:\`text-xs font-extrabold \${dark?"text-slate-300":"text-white"}\`,children:[fr(Ze.desks.length)," តុទ្វេ"]})`;
if (!src.includes(grpHdrOld)) throw new Error("Missing grpHdrOld");
src = src.replace(grpHdrOld, grpHdrNew);

// Cr student seat & or desk card vivid palette
const crOld = `    const cardCls=dark
      ?(Ze.isPresident?"bg-amber-950/50 border-amber-400/70":jr?"bg-indigo-950/70 border-indigo-400/60":Ft?"bg-amber-950/40 border-amber-500/50":"bg-slate-900/90 border-slate-700 hover:border-slate-500")
      :(Ze.isPresident?"bg-amber-50/80 border-amber-300 shadow-2xs":Ze.isVicePresident1?"bg-indigo-50/60 border-indigo-200 shadow-2xs":Ze.isVicePresident2?"bg-cyan-50/60 border-cyan-200 shadow-2xs":Ft?"bg-amber-50/60 border-amber-300 shadow-2xs":"bg-white border-slate-200/90 hover:border-amber-300");
    const ringCls=Ze.isPresident?"border-amber-400":Ze.isVicePresident1?"border-indigo-400":Ze.isVicePresident2?"border-cyan-500":isGirl?"border-pink-300":"border-sky-300";`;
const crNew = `    const cardCls=dark
      ?(Ze.isPresident?"bg-amber-950/50 border-amber-400/70":jr?"bg-indigo-950/70 border-indigo-400/60":Ft?"bg-amber-950/40 border-amber-500/50":"bg-slate-900/90 border-slate-700 hover:border-slate-500")
      :(Ze.isPresident?"bg-amber-50 border-amber-400 shadow-xs":Ze.isVicePresident1?"bg-indigo-50 border-indigo-300 shadow-xs":Ze.isVicePresident2?"bg-cyan-50 border-cyan-300 shadow-xs":Ft?"bg-amber-50 border-amber-300 shadow-2xs":isGirl?"bg-pink-50 border-pink-200 hover:border-pink-400":"bg-sky-50 border-sky-200 hover:border-sky-400");
    const ringCls=Ze.isPresident?"border-amber-400":Ze.isVicePresident1?"border-indigo-500":Ze.isVicePresident2?"border-cyan-500":isGirl?"border-pink-400":"border-sky-400";`;
if (!src.includes(crOld)) throw new Error("Missing crOld");
src = src.replace(crOld, crNew);

const orOld = `  const or=(Ze)=>{
    const kt=Ze.rowIndex===1,ct=Ze.deskType==="center_leader";
    const Ft=J.trim()!==""&&(Ze.seatLeft.name.toLowerCase().includes(J.toLowerCase())||Ze.seatRight.name.toLowerCase().includes(J.toLowerCase())||Ze.deskLabel.toLowerCase().includes(J.toLowerCase()));
    const deskFrame=dark
      ?(ct?"bg-slate-900 border-indigo-500/50":"bg-slate-900 border-slate-700")
      :(ct?"bg-white border-indigo-200 shadow-sm":kt&&o?"bg-white border-amber-300 shadow-sm":"bg-white border-[#e5c99b] shadow-sm hover:border-amber-400");
    const hdrFrame=dark
      ?(ct?"bg-indigo-950/70 border-indigo-500/40 text-indigo-200":"bg-slate-800 border-slate-700 text-slate-300")
      :(ct?"bg-indigo-50/80 border-indigo-200/80 text-indigo-950":kt&&o?"bg-amber-50 border-amber-200 text-amber-950":"bg-[#fdf6e9] border-[#ead5b2] text-amber-950");

    return e.jsxs("div",{className:\`rounded-2xl border-2 transition-all duration-200 overflow-hidden \${Ft?"ring-4 ring-amber-400 scale-[1.01] z-20":""} \${deskFrame}\`,children:[
      e.jsxs("div",{className:\`px-2.5 py-1.5 border-b flex items-center justify-between gap-1 \${hdrFrame}\`,children:[
        e.jsxs("div",{className:"flex items-center gap-1.5 min-w-0",children:[
          e.jsx("span",{className:\`text-[11px] font-extrabold truncate\`,children:Ze.deskLabel}),
          kt&&o&&e.jsx("span",{className:"text-[10px] font-bold text-amber-700 shrink-0",children:"· ជួរមុខ"}),
          ct&&!kt&&e.jsx("span",{className:"text-[10px] font-bold text-indigo-700 shrink-0",children:"· កណ្តាល"})
        ]}),
        e.jsx("button",{type:"button",onClick:jr=>{jr.stopPropagation(),Be(Ze.deskId)},title:"ប្តូរកៅអីឆ្វេង-ស្តាំ ក្នុងតុនេះ",className:\`p-1 rounded-lg transition cursor-pointer \${dark?"hover:bg-slate-700 text-slate-300":"hover:bg-amber-200/60 text-amber-900"}\`,children:e.jsx(io,{className:"w-3.5 h-3.5"})})
      ]}),`;
const orNew = `  const deskThemes=[
    {frame:"bg-white border-sky-300 shadow-sm hover:border-sky-400",hdr:"bg-gradient-to-r from-sky-500 to-blue-500 border-sky-500 text-white"},
    {frame:"bg-white border-emerald-300 shadow-sm hover:border-emerald-400",hdr:"bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-500 text-white"},
    {frame:"bg-white border-amber-300 shadow-sm hover:border-amber-400",hdr:"bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 text-white"},
    {frame:"bg-white border-rose-300 shadow-sm hover:border-rose-400",hdr:"bg-gradient-to-r from-rose-500 to-pink-500 border-rose-500 text-white"},
    {frame:"bg-white border-indigo-300 shadow-sm hover:border-indigo-400",hdr:"bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-500 text-white"},
    {frame:"bg-white border-cyan-300 shadow-sm hover:border-cyan-400",hdr:"bg-gradient-to-r from-cyan-500 to-teal-500 border-cyan-500 text-white"}
  ];
  const or=(Ze)=>{
    const kt=Ze.rowIndex===1,ct=Ze.deskType==="center_leader";
    const dt=deskThemes[((Ze.colIndex||1)-1)%deskThemes.length];
    const Ft=J.trim()!==""&&(Ze.seatLeft.name.toLowerCase().includes(J.toLowerCase())||Ze.seatRight.name.toLowerCase().includes(J.toLowerCase())||Ze.deskLabel.toLowerCase().includes(J.toLowerCase()));
    const deskFrame=dark
      ?(ct?"bg-slate-900 border-indigo-500/50":"bg-slate-900 border-slate-700")
      :dt.frame;
    const hdrFrame=dark
      ?(ct?"bg-indigo-950/70 border-indigo-500/40 text-indigo-200":"bg-slate-800 border-slate-700 text-slate-300")
      :dt.hdr;
    return e.jsxs("div",{className:\`rounded-2xl border-2 transition-all duration-200 overflow-hidden \${Ft?"ring-4 ring-amber-400 scale-[1.01] z-20":""} \${deskFrame}\`,children:[
      e.jsxs("div",{className:\`px-2.5 py-1.5 border-b flex items-center justify-between gap-1 \${hdrFrame}\`,children:[
        e.jsxs("div",{className:"flex items-center gap-1.5 min-w-0",children:[
          e.jsx("span",{className:\`text-[11px] font-extrabold truncate\`,children:Ze.deskLabel}),
          kt&&o&&e.jsx("span",{className:\`text-[10px] font-bold shrink-0 \${dark?"text-amber-300":"text-amber-100"}\`,children:"· ជួរមុខ"}),
          ct&&!kt&&e.jsx("span",{className:\`text-[10px] font-bold shrink-0 \${dark?"text-indigo-300":"text-white"}\`,children:"· កណ្តាល"})
        ]}),
        e.jsx("button",{type:"button",onClick:jr=>{jr.stopPropagation(),Be(Ze.deskId)},title:"ប្តូរកៅអីឆ្វេង-ស្តាំ ក្នុងតុនេះ",className:\`p-1 rounded-lg transition cursor-pointer \${dark?"hover:bg-slate-700 text-slate-300":"hover:bg-white/20 text-white"}\`,children:e.jsx(io,{className:"w-3.5 h-3.5"})})
      ]}),`;
if (!src.includes(orOld)) throw new Error("Missing orOld");
src = src.replace(orOld, orNew);

// 5. Vibrant Committee & Sanitation PDF HTML + Seating Header & Stage + Dedicated Sanitation UI
const committeeHtmlOld = `  const committeeHtml=sanPdf?\`<div style="font-family:'Kantumruy Pro','Siemreap',sans-serif;font-size:10pt;color:#0f172a;">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;">
      <div style="padding:10px;border:1.5px solid #f59e0b;border-radius:10px;background:#fffbeb;text-align:center;">
        <div style="font-size:8.5pt;font-weight:800;color:#92400e;">👑 ប្រធានថ្នាក់</div>
        <div style="font-size:10.5pt;font-weight:800;margin-top:3px;">\${escS(((de.find(u=>u.id===q.presidentId))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="padding:10px;border:1.5px solid #6366f1;border-radius:10px;background:#eef2ff;text-align:center;">
        <div style="font-size:8.5pt;font-weight:800;color:#3730a3;">🎖️ អនុប្រធានទី ១</div>
        <div style="font-size:10.5pt;font-weight:800;margin-top:3px;">\${escS(((de.find(u=>u.id===q.vicePresident1Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="padding:10px;border:1.5px solid #0891b2;border-radius:10px;background:#ecfeff;text-align:center;">
        <div style="font-size:8.5pt;font-weight:800;color:#155e75;">🎖️ អនុប្រធានទី ២</div>
        <div style="font-size:10.5pt;font-weight:800;margin-top:3px;">\${escS(((de.find(u=>u.id===q.vicePresident2Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;">
      \${[1,2,3,4,5,6].map(bn=>{
        const mems=(q.subBranches[bn]||[]).map(id=>de.find(u=>u.id===id)).filter(Boolean);
        return \`<div style="border:1px solid #cbd5e1;border-radius:8px;overflow:hidden;break-inside:avoid;">
          <div style="background:#f1f5f9;padding:5px 8px;font-weight:800;font-size:9pt;border-bottom:1px solid #cbd5e1;">អនុសាខាទី \${fr(bn)} (\${fr(mems.length)} នាក់)</div>
          <div style="padding:6px 8px;font-size:8.5pt;line-height:1.5;">\${mems.length?mems.map((st,ix)=>\`\${fr(ix+1)}. \${escS(st.name)}\`).join("<br/>"):"(មិនទាន់មានសមាជិក)"}</div>
        </div>\`;
      }).join("")}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:9pt;">
      <thead><tr style="background:#f1f5f9;"><th style="border:1px solid #475569;padding:6px;text-align:center;">ល.រ</th><th style="border:1px solid #475569;padding:6px;text-align:left;">សកម្មភាពប្រចាំថ្ងៃ</th><th style="border:1px solid #475569;padding:6px;">ចន្ទ</th><th style="border:1px solid #475569;padding:6px;">អង្គារ</th><th style="border:1px solid #475569;padding:6px;">ពុធ</th><th style="border:1px solid #475569;padding:6px;">ព្រហស្បតិ៍</th><th style="border:1px solid #475569;padding:6px;">សុក្រ</th><th style="border:1px solid #475569;padding:6px;">សៅរ៍</th></tr></thead>
      <tbody>\${dm.map((act,ix)=>{
        const rot=[0,1,2,3,4,5].map(k=>(ix-k+6)%6+1);
        return \`<tr><td style="border:1px solid #475569;padding:5px;text-align:center;">\${fr(ix+1)}</td><td style="border:1px solid #475569;padding:5px;font-weight:700;">\${escS(act.name)}</td>\${rot.map(b=>\`<td style="border:1px solid #475569;padding:5px;text-align:center;">អនុសាខាទី \${fr(b)}</td>\`).join("")}</tr>\`;
      }).join("")}</tbody>
    </table>
  </div>\`:"";`;

const committeeHtmlNew = `  const committeeHtml=sanPdf?\`<div style="font-family:'Kantumruy Pro','Siemreap',sans-serif;font-size:10pt;color:#0f172a;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
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
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
      \${[1,2,3,4,5,6].map(bn=>{
        const mems=(q.subBranches[bn]||[]).map(id=>de.find(u=>u.id===id)).filter(Boolean);
        const pal=wm[bn-1]||wm[0];
        return \`<div style="border:1.5px solid \${pal.hex};border-radius:9px;overflow:hidden;background:\${pal.hexBg};break-inside:avoid;">
          <div style="background:\${pal.hex};color:#ffffff;padding:5px 8px;font-weight:800;font-size:9pt;">អនុសាខាទី \${fr(bn)} (\${fr(mems.length)} នាក់)</div>
          <div style="padding:6px 8px;font-size:8.5pt;line-height:1.5;background:#ffffff;">\${mems.length?mems.map((st,ix)=>\`\${fr(ix+1)}. \${escS(st.name)}\`).join("<br/>"):"(មិនទាន់មានសមាជិក)"}</div>
        </div>\`;
      }).join("")}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:9pt;border-radius:8px;overflow:hidden;">
      <thead><tr>
        <th style="background:#059669;color:#fff;border:1px solid #047857;padding:6px;text-align:center;">ល.រ</th>
        <th style="background:#0d9488;color:#fff;border:1px solid #0f766e;padding:6px;text-align:left;">សកម្មភាពប្រចាំថ្ងៃ</th>
        <th style="background:#f59e0b;color:#fff;border:1px solid #d97706;padding:6px;">ចន្ទ</th>
        <th style="background:#9333ea;color:#fff;border:1px solid #7e22ce;padding:6px;">អង្គារ</th>
        <th style="background:#10b981;color:#fff;border:1px solid #059669;padding:6px;">ពុធ</th>
        <th style="background:#f97316;color:#fff;border:1px solid #ea580c;padding:6px;">ព្រហស្បតិ៍</th>
        <th style="background:#0284c7;color:#fff;border:1px solid #0369a1;padding:6px;">សុក្រ</th>
        <th style="background:#e11d48;color:#fff;border:1px solid #be123c;padding:6px;">សៅរ៍</th>
      </tr></thead>
      <tbody>\${dm.map((act,ix)=>{
        const rot=[0,1,2,3,4,5].map(k=>(ix-k+6)%6+1);
        return \`<tr style="background:\${ix%2===0?"#ffffff":"#f8fafc"};"><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;font-weight:700;">\${fr(ix+1)}</td><td style="border:1px solid #cbd5e1;padding:5px;font-weight:700;color:#0f172a;">\${escS(act.name)}</td>\${rot.map(b=>{const p=wm[b-1]||wm[0];return \`<td style="border:1px solid #cbd5e1;padding:5px;text-align:center;background:\${p.hexBg};color:\${p.hexTxt};font-weight:800;">អនុសាខាទី \${fr(b)}</td>\`;}).join("")}</tr>\`;
      }).join("")}</tbody>
    </table>
  </div>\`:"";`;

if (!src.includes(committeeHtmlOld)) throw new Error("Missing committeeHtmlOld");
src = src.replace(committeeHtmlOld, committeeHtmlNew);

// 6. Refresh seating header controls, chalkboard stage, & dedicated committee+sanitation screen colors
const seatingHdrOld = `    e.jsxs("div",{className:"bg-white p-5 sm:p-7 rounded-[28px] border border-slate-200 shadow-xs space-y-5",children:[
      e.jsxs("div",{className:"flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4 border-slate-100",children:[
        e.jsxs("div",{className:"space-y-1",children:[
          e.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold",children:[
            e.jsxs("span",{className:"text-emerald-800 font-extrabold",children:["ប្លង់ ",fr(Qe)," ជួរទទឹង × ",fr(Et)," ជួរបណ្តាយ"]}),
            e.jsx("span",{"aria-hidden":"true",children:"·"}),
            e.jsxs("span",{children:[fr(ie.length)," តុទ្វេ (",fr(me)," សិស្ស)"]}),
            e.jsx("span",{"aria-hidden":"true",children:"·"}),
            e.jsxs("span",{children:["ស្រី ",fr(ue)," · ប្រុស ",fr(fe)]}),
            e.jsx("span",{"aria-hidden":"true",children:"·"}),
            e.jsxs("span",{className:"text-amber-700 font-bold",children:["📷 រូបថត ",fr(photoCount),"/",fr(me)]})
          ]}),
          e.jsxs("h3",{className:"font-extrabold text-lg sm:text-xl text-slate-900 flex items-center gap-2",children:[
            e.jsx(py,{className:"w-6 h-6 text-emerald-700 shrink-0"}),
            e.jsxs("span",{children:["ប្លង់តុសិស្ស និងការរៀបចំថ្នាក់រៀន (",r.grade||"ថ្នាក់ទី ៦",")"]})
          ]})
        ]}),
        e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[
          e.jsxs("button",{type:"button",onClick:()=>setPModal(!0),className:"px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx("span",{children:"📷"}),
            e.jsx("span",{children:"ដាក់រូបថតសិស្ស"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>D(!0),className:"px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(x0,{className:"w-3.5 h-3.5 text-amber-600"}),
            e.jsx("span",{children:"រើសប្រធាន & វេនសម្អាត"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>H(!0),className:"px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0",title:"បើកផ្ទាំងកែសម្រួល និងទាញយក PDF ដូចទម្រង់បង្ហាញ",children:[
            e.jsx(Vs,{className:"w-3.5 h-3.5"}),
            e.jsx("span",{children:"ទាញយក PDF"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>E(!0),className:"px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(ts,{className:"w-3.5 h-3.5"}),
            e.jsx("span",{children:"បោះពុម្ព / រក្សាទុក PDF A4"})
          ]}),
          e.jsxs("button",{type:"button",onClick:exportStagePng,className:"px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",title:"ទាញយកប្លង់តុជារូបភាព PNG ច្បាស់",children:[
            e.jsx("span",{children:"🖼️"}),
            e.jsx("span",{children:"PNG"})
          ]})
        ]})
      ]}),



      e.jsxs("div",{className:"flex flex-col xl:flex-row xl:items-center justify-between gap-3",children:[
        e.jsx("div",{className:"flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar",children:
          [
            {id:"grid_4x6",label:\`\${fr(Qe)} ជួរទទឹង × \${fr(Et)} ជួរបណ្តាយ\`,icon:z1},
            {id:"group",label:"៤ ក្រុមធំ",icon:fC},
            {id:"u_shape",label:"រាងអក្សរ U",icon:py},
            {id:"rows",label:\`\${fr(Qe)} ជួរឈរ\`,icon:Za},
            {id:"pairs",label:"ដៃគូសិក្សា",icon:gy}
          ].map(Ze=>{
            const Ve=Ze.icon,kt=a===Ze.id;
            return e.jsxs("button",{type:"button",onClick:()=>{n(Ze.id),s(\`បានប្តូរទៅប្លង់តុ៖ \${Ze.label}\`)},className:\`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer \${kt?"bg-white text-slate-900 shadow-xs":"text-slate-600 hover:text-slate-900"}\`,children:[
              e.jsx(Ve,{className:\`w-3.5 h-3.5 \${kt?"text-emerald-700":"text-slate-400"}\`}),
              e.jsx("span",{children:Ze.label})
            ]},Ze.id);
          })
        }),
        e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[
          e.jsxs("div",{className:"flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs",children:[
            e.jsx("span",{className:"text-[11px] font-bold text-slate-500 px-1.5",children:"ជួរ៖"}),
            [2,3,4,5,6].map(Ze=>e.jsx("button",{type:"button",onClick:()=>{Y(Ze),s(\`បានប្តូរទៅជា \${fr(Ze)} ជួរទទឹង\`)},className:\`px-2 py-1 rounded-lg font-extrabold text-xs transition cursor-pointer \${Z===Ze?"bg-white text-slate-900 shadow-2xs":"text-slate-600 hover:text-slate-900"}\`,children:fr(Ze)},Ze))
          ]}),
          e.jsxs("div",{className:"relative flex-1 sm:w-44",children:[
            e.jsx(Ya,{className:"w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"}),
            e.jsx("input",{type:"text",placeholder:"ស្វែងរកសិស្ស...",value:J,onChange:Ze=>se(Ze.target.value),className:"w-full pl-8 pr-6 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"}),
            J&&e.jsx("button",{type:"button",onClick:()=>se(""),className:"absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",children:e.jsx(Mr,{className:"w-3 h-3"})})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>B(!0),className:"px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(w9,{className:"w-3.5 h-3.5 text-amber-300"}),
            e.jsx("span",{children:"ប្តូរកៅអីសិស្ស"})
          ]}),`;

const seatingHdrNew = `    e.jsxs("div",{className:"bg-white p-5 sm:p-7 rounded-[28px] border-2 border-emerald-200 shadow-sm space-y-5",children:[
      e.jsxs("div",{className:"flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4 border-emerald-100",children:[
        e.jsxs("div",{className:"space-y-1",children:[
          e.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs text-slate-600 font-semibold",children:[
            e.jsxs("span",{className:"text-emerald-700 font-extrabold",children:["ប្លង់ ",fr(Qe)," ជួរទទឹង × ",fr(Et)," ជួរបណ្តាយ"]}),
            e.jsx("span",{"aria-hidden":"true",children:"·"}),
            e.jsxs("span",{className:"text-sky-700 font-bold",children:[fr(ie.length)," តុទ្វេ (",fr(me)," សិស្ស)"]}),
            e.jsx("span",{"aria-hidden":"true",children:"·"}),
            e.jsxs("span",{className:"text-pink-700 font-bold",children:["ស្រី ",fr(ue)]}),
            e.jsx("span",{"aria-hidden":"true",children:"·"}),
            e.jsxs("span",{className:"text-blue-700 font-bold",children:["ប្រុស ",fr(fe)]}),
            e.jsx("span",{"aria-hidden":"true",children:"·"}),
            e.jsxs("span",{className:"text-amber-700 font-bold",children:["📷 រូបថត ",fr(photoCount),"/",fr(me)]})
          ]}),
          e.jsxs("h3",{className:"font-extrabold text-lg sm:text-xl text-slate-900 flex items-center gap-2.5",children:[
            e.jsx("div",{className:"w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs shrink-0",children:e.jsx(py,{className:"w-5 h-5"})}),
            e.jsxs("span",{children:["ប្លង់តុសិស្ស និងការរៀបចំថ្នាក់រៀន (",r.grade||"ថ្នាក់ទី ៦",")"]})
          ]})
        ]}),
        e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[
          e.jsxs("button",{type:"button",onClick:()=>setPModal(!0),className:"px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm shadow-amber-500/20 cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx("span",{children:"📷"}),
            e.jsx("span",{children:"ដាក់រូបថតសិស្ស"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>D(!0),className:"px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(x0,{className:"w-3.5 h-3.5 text-sky-600"}),
            e.jsx("span",{children:"រើសប្រធាន & វេនសម្អាត"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>H(!0),className:"px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0",title:"បើកផ្ទាំងកែសម្រួល និងទាញយក PDF ដូចទម្រង់បង្ហាញ",children:[
            e.jsx(Vs,{className:"w-3.5 h-3.5"}),
            e.jsx("span",{children:"ទាញយក PDF"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>E(!0),className:"px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(ts,{className:"w-3.5 h-3.5"}),
            e.jsx("span",{children:"បោះពុម្ព / រក្សាទុក PDF A4"})
          ]}),
          e.jsxs("button",{type:"button",onClick:exportStagePng,className:"px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",title:"ទាញយកប្លង់តុជារូបភាព PNG ច្បាស់",children:[
            e.jsx("span",{children:"🖼️"}),
            e.jsx("span",{children:"PNG"})
          ]})
        ]})
      ]}),
      e.jsxs("div",{className:"flex flex-col xl:flex-row xl:items-center justify-between gap-3",children:[
        e.jsx("div",{className:"flex items-center gap-1 bg-emerald-50 p-1 rounded-xl border border-emerald-200 overflow-x-auto no-scrollbar",children:
          [
            {id:"grid_4x6",label:\`\${fr(Qe)} ជួរទទឹង × \${fr(Et)} ជួរបណ្តាយ\`,icon:z1},
            {id:"group",label:"៤ ក្រុមធំ",icon:fC},
            {id:"u_shape",label:"រាងអក្សរ U",icon:py},
            {id:"rows",label:\`\${fr(Qe)} ជួរឈរ\`,icon:Za},
            {id:"pairs",label:"ដៃគូសិក្សា",icon:gy}
          ].map(Ze=>{
            const Ve=Ze.icon,kt=a===Ze.id;
            return e.jsxs("button",{type:"button",onClick:()=>{n(Ze.id),s(\`បានប្តូរទៅប្លង់តុ៖ \${Ze.label}\`)},className:\`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer \${kt?"bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs":"text-emerald-900 hover:bg-white"}\`,children:[
              e.jsx(Ve,{className:\`w-3.5 h-3.5 \${kt?"text-white":"text-emerald-600"}\`}),
              e.jsx("span",{children:Ze.label})
            ]},Ze.id);
          })
        }),
        e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[
          e.jsxs("div",{className:"flex items-center gap-1 bg-sky-50 p-1 rounded-xl border border-sky-200 text-xs",children:[
            e.jsx("span",{className:"text-[11px] font-bold text-sky-900 px-1.5",children:"ជួរ៖"}),
            [2,3,4,5,6].map(Ze=>e.jsx("button",{type:"button",onClick:()=>{Y(Ze),s(\`បានប្តូរទៅជា \${fr(Ze)} ជួរទទឹង\`)},className:\`px-2 py-1 rounded-lg font-extrabold text-xs transition cursor-pointer \${Z===Ze?"bg-sky-600 text-white shadow-2xs":"text-sky-800 hover:bg-white"}\`,children:fr(Ze)},Ze))
          ]}),
          e.jsxs("div",{className:"relative flex-1 sm:w-44",children:[
            e.jsx(Ya,{className:"w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"}),
            e.jsx("input",{type:"text",placeholder:"ស្វែងរកសិស្ស...",value:J,onChange:Ze=>se(Ze.target.value),className:"w-full pl-8 pr-6 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"}),
            J&&e.jsx("button",{type:"button",onClick:()=>se(""),className:"absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",children:e.jsx(Mr,{className:"w-3 h-3"})})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>B(!0),className:"px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(w9,{className:"w-3.5 h-3.5 text-amber-300"}),
            e.jsx("span",{children:"ប្តូរកៅអីសិស្ស"})
          ]}),`;

if (!src.includes(seatingHdrOld)) throw new Error("Missing seatingHdrOld");
src = src.replace(seatingHdrOld, seatingHdrNew);

// 7. Classroom stage & chalkboard colors
const stageOld = `    e.jsxs("div",{ref:stageRef,className:\`p-4 sm:p-7 rounded-[28px] border-2 shadow-sm relative overflow-hidden space-y-6 transition-colors \${dark?"bg-slate-950 text-white border-slate-800":"bg-gradient-to-b from-[#FAF8F5] via-white to-[#F4F7FA] text-slate-900 border-[#e7d4b3]"}\`,children:[
      e.jsxs("div",{className:"relative z-10 space-y-4",children:[
        e.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-5xl mx-auto",children:[
          e.jsxs("div",{className:"flex-1 bg-gradient-to-b from-emerald-900 to-emerald-950 rounded-2xl border-[5px] border-amber-800/90 px-4 py-3.5 shadow-md text-center text-white relative flex flex-col justify-center",children:[
            e.jsxs("h4",{className:"font-moul text-sm sm:text-base tracking-wide",children:["ក្តារខៀនថ្នាក់រៀន · ",r.grade||"ថ្នាក់ទី ៦"]}),
            e.jsxs("p",{className:"text-xs text-emerald-100/90 font-medium mt-1",children:[r.school||"សាលាបឋមសិក្សាគំរូ"," · សិស្សសរុប ",fr(me)," នាក់ (ស្រី ",fr(ue)," · ប្រុស ",fr(fe),") · ",fr(ie.length)," តុទ្វេ"]})
          ]}),
          e.jsxs("div",{className:\`sm:w-64 rounded-2xl border-2 p-3 shadow-sm flex items-center gap-3 shrink-0 \${dark?"bg-slate-900 border-amber-500/50 text-white":"bg-gradient-to-b from-amber-50 to-white border-amber-300 text-slate-900"}\`,children:[`;

const stageNew = `    e.jsxs("div",{ref:stageRef,className:\`p-4 sm:p-7 rounded-[28px] border-2 shadow-sm relative overflow-hidden space-y-6 transition-colors \${dark?"bg-slate-950 text-white border-slate-800":"bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-900 border-emerald-300"}\`,children:[
      e.jsxs("div",{className:"relative z-10 space-y-4",children:[
        e.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-5xl mx-auto",children:[
          e.jsxs("div",{className:"flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 rounded-2xl border-4 border-amber-400 px-4 py-3.5 shadow-md text-center text-white relative flex flex-col justify-center",children:[
            e.jsxs("h4",{className:"font-moul text-sm sm:text-base tracking-wide text-white",children:["ក្តារខៀនថ្នាក់រៀន · ",r.grade||"ថ្នាក់ទី ៦"]}),
            e.jsxs("p",{className:"text-xs text-emerald-50 font-semibold mt-1",children:[r.school||"សាលាបឋមសិក្សាគំរូ"," · សិស្សសរុប ",fr(me)," នាក់ (ស្រី ",fr(ue)," · ប្រុស ",fr(fe),") · ",fr(ie.length)," តុទ្វេ"]})
          ]}),
          e.jsxs("div",{className:\`sm:w-64 rounded-2xl border-2 p-3 shadow-sm flex items-center gap-3 shrink-0 \${dark?"bg-slate-900 border-amber-500/50 text-white":"bg-gradient-to-b from-yellow-50 to-amber-50 border-amber-400 text-amber-950"}\`,children:[`;

if (!src.includes(stageOld)) throw new Error("Missing stageOld");
src = src.replace(stageOld, stageNew);

// 8. Dedicated Committee & Sanitation Duty view vibrant colors
const comViewOld = `    vMode==="committee"&&e.jsxs("div",{className:"bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200 shadow-xs space-y-6",children:[
      e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4",children:[
        e.jsxs("div",{className:"space-y-1",children:[
          e.jsxs("h3",{className:"text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2",children:[
            e.jsx(Is,{className:"w-5 h-5 text-emerald-700 shrink-0"}),
            e.jsx("span",{children:"តារាងគណៈកម្មាធិការ និងវេនអនាម័យប្រចាំសប្តាហ៍"})
          ]}),
          e.jsxs("p",{className:"text-xs text-slate-500 font-medium",children:["រចនាសម្ព័ន្ធដឹកនាំ អនុសាខាទាំង ៦ និងវេនសម្អាតប្រចាំថ្ងៃ · ",r.grade||"ថ្នាក់ទី ៦"]})
        ]}),
        e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[
          e.jsxs("button",{type:"button",onClick:Ie,className:"px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5 cursor-pointer",children:[
            e.jsx(Jr,{className:"w-3.5 h-3.5 text-amber-600"}),
            e.jsx("span",{children:"ចែក ៦ សាខាស្វ័យប្រវត្តិ"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>D(!0),className:"px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 cursor-pointer",children:[
            e.jsx(x0,{className:"w-3.5 h-3.5 text-amber-300"}),
            e.jsx("span",{children:"កំណត់គណៈកម្មាធិការលម្អិត"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>setSanPdf(!0),className:"px-3.5 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer",children:[
            e.jsx(Vs,{className:"w-3.5 h-3.5"}),
            e.jsx("span",{children:"ទាញយក PDF"})
          ]})
        ]})
      ]}),

      e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80",children:[
        e.jsxs("div",{className:"bg-white p-3 rounded-xl border border-amber-200 space-y-1.5",children:[
          e.jsx("label",{className:"text-xs font-extrabold text-amber-900 block",children:"👑 ប្រធានថ្នាក់"}),
          e.jsxs("select",{value:q.presidentId||"",onChange:Ze=>ge(Number(Ze.target.value)),className:"w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-amber-400",children:[
            e.jsx("option",{value:"",children:"-- ជ្រើសរើសប្រធានថ្នាក់ --"}),
            de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`pres2-\${Ze.id}\`))
          ]})
        ]}),
        e.jsxs("div",{className:"bg-white p-3 rounded-xl border border-indigo-200 space-y-1.5",children:[
          e.jsx("label",{className:"text-xs font-extrabold text-indigo-900 block",children:"🎖️ អនុប្រធានទី ១"}),
          e.jsxs("select",{value:q.vicePresident1Id||"",onChange:Ze=>Xe(Number(Ze.target.value)),className:"w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-indigo-400",children:[
            e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ១ --"}),
            de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`vp12-\${Ze.id}\`))
          ]})
        ]}),
        e.jsxs("div",{className:"bg-white p-3 rounded-xl border border-cyan-200 space-y-1.5",children:[
          e.jsx("label",{className:"text-xs font-extrabold text-cyan-900 block",children:"🎖️ អនុប្រធានទី ២"}),
          e.jsxs("select",{value:q.vicePresident2Id||"",onChange:Ze=>Oe(Number(Ze.target.value)),className:"w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-cyan-400",children:[
            e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ២ --"}),
            de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`vp22-\${Ze.id}\`))
          ]})
        ]})
      ]}),

      e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5",children:
        dm.map((Ze,Ve)=>{
          const kt=Ve+1,ct=wm[Ve]||wm[0],jr=(q.subBranches[kt]||[]).map(he=>de.find(Re=>Re.id===he)).filter(Boolean);
          return e.jsxs("div",{className:\`p-4 rounded-2xl border \${ct.border} \${ct.lightBg} space-y-2.5\`,children:[
            e.jsxs("div",{className:"flex items-center justify-between",children:[
              e.jsxs("span",{className:"font-extrabold text-xs text-slate-900",children:["អនុសាខាទី ",fr(kt)," · ",Ze.name]}),
              e.jsxs("span",{className:"text-[11px] font-bold text-slate-500",children:[fr(jr.length)," នាក់"]})
            ]}),
            jr.length>0
              ?e.jsx("div",{className:"flex flex-wrap gap-1.5 max-h-28 overflow-y-auto no-scrollbar",children:
                jr.map(he=>e.jsxs("span",{className:"px-2 py-1 bg-white text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200",children:["#",fr(he.rollNo||he.id)," ",he.name]},\`sb-\${kt}-\${he.id}\`))
              })
              :e.jsx("div",{className:"text-xs text-slate-400 italic",children:"មិនទាន់មានសមាជិក"})
          ]},\`sb-card-\${kt}\`);
        })
      }),

      e.jsx("div",{className:"overflow-x-auto border border-slate-200 rounded-2xl",children:
        e.jsxs("table",{className:"w-full text-xs text-left border-collapse",children:[
          e.jsx("thead",{children:e.jsxs("tr",{className:"bg-slate-100 text-slate-800 border-b border-slate-200 font-extrabold",children:[
            e.jsx("th",{className:"p-2.5 text-center w-10 border-r border-slate-200",children:"ល.រ"}),
            e.jsx("th",{className:"p-2.5 min-w-[160px] border-r border-slate-200",children:"សកម្មភាពប្រចាំថ្ងៃ"}),
            e.jsx("th",{className:"p-2.5 text-center border-r border-slate-200",children:"ចន្ទ"}),
            e.jsx("th",{className:"p-2.5 text-center border-r border-slate-200",children:"អង្គារ"}),
            e.jsx("th",{className:"p-2.5 text-center border-r border-slate-200",children:"ពុធ"}),
            e.jsx("th",{className:"p-2.5 text-center border-r border-slate-200",children:"ព្រហស្បតិ៍"}),
            e.jsx("th",{className:"p-2.5 text-center border-r border-slate-200",children:"សុក្រ"}),
            e.jsx("th",{className:"p-2.5 text-center",children:"សៅរ៍"})
          ]})}),
          e.jsx("tbody",{className:"divide-y divide-slate-100 font-medium text-slate-700",children:
            dm.map((Ze,Ve)=>{
              const kt=[0,1,2,3,4,5].map(Ft=>(Ve-Ft+6)%6+1);
              return e.jsxs("tr",{className:"hover:bg-slate-50",children:[
                e.jsx("td",{className:"p-2.5 text-center font-bold text-slate-500 border-r border-slate-200",children:fr(Ve+1)}),
                e.jsx("td",{className:"p-2.5 font-bold text-slate-900 border-r border-slate-200",children:Ze.name}),
                kt.map((Ft,jr)=>e.jsx("td",{className:\`p-2 text-center font-bold text-[11px] \${jr<5?"border-r border-slate-200":""}\`,children:\`អនុសាខាទី \${fr(Ft)}\`},\`cell-\${Ve}-\${jr}\`))
              ]},\`task-row-\${Ve}\`);
            })
          })
        ]})
      })
    ]}),`;

const comViewNew = `    vMode==="committee"&&e.jsxs("div",{className:"bg-white p-5 sm:p-7 rounded-[28px] border-2 border-sky-200 shadow-sm space-y-6",children:[
      e.jsxs("div",{className:"bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4",children:[
        e.jsxs("div",{className:"space-y-1",children:[
          e.jsxs("h3",{className:"text-lg sm:text-xl font-extrabold text-white flex items-center gap-2.5",children:[
            e.jsx("div",{className:"w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0",children:e.jsx(Is,{className:"w-5 h-5 text-white"})}),
            e.jsx("span",{children:"តារាងគណៈកម្មាធិការ និងវេនអនាម័យប្រចាំសប្តាហ៍"})
          ]}),
          e.jsxs("p",{className:"text-xs text-sky-50 font-semibold",children:["រចនាសម្ព័ន្ធដឹកនាំ អនុសាខាទាំង ៦ និងវេនសម្អាតប្រចាំថ្ងៃ · ",r.grade||"ថ្នាក់ទី ៦"]})
        ]}),
        e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[
          e.jsxs("button",{type:"button",onClick:Ie,className:"px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(Jr,{className:"w-3.5 h-3.5 text-white"}),
            e.jsx("span",{children:"ចែក ៦ សាខាស្វ័យប្រវត្តិ"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>D(!0),className:"px-3.5 py-2 rounded-xl text-xs font-extrabold bg-white hover:bg-sky-50 text-sky-900 transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(x0,{className:"w-3.5 h-3.5 text-sky-600"}),
            e.jsx("span",{children:"កំណត់គណៈកម្មាធិការលម្អិត"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>setSanPdf(!0),className:"px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(Vs,{className:"w-3.5 h-3.5"}),
            e.jsx("span",{children:"ទាញយក PDF"})
          ]})
        ]})
      ]}),

      e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3.5",children:[
        e.jsxs("div",{className:"rounded-2xl border-2 border-amber-300 bg-amber-50 overflow-hidden shadow-xs",children:[
          e.jsx("div",{className:"bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-2 text-xs font-extrabold text-white",children:"👑 ប្រធានថ្នាក់"}),
          e.jsx("div",{className:"p-3",children:
            e.jsxs("select",{value:q.presidentId||"",onChange:Ze=>ge(Number(Ze.target.value)),className:"w-full p-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-amber-500",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសប្រធានថ្នាក់ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`pres2-\${Ze.id}\`))
            ]})
          })
        ]}),
        e.jsxs("div",{className:"rounded-2xl border-2 border-indigo-300 bg-indigo-50 overflow-hidden shadow-xs",children:[
          e.jsx("div",{className:"bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-extrabold text-white",children:"🎖️ អនុប្រធានទី ១"}),
          e.jsx("div",{className:"p-3",children:
            e.jsxs("select",{value:q.vicePresident1Id||"",onChange:Ze=>Xe(Number(Ze.target.value)),className:"w-full p-2 bg-white border border-indigo-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ១ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`vp12-\${Ze.id}\`))
            ]})
          })
        ]}),
        e.jsxs("div",{className:"rounded-2xl border-2 border-cyan-300 bg-cyan-50 overflow-hidden shadow-xs",children:[
          e.jsx("div",{className:"bg-gradient-to-r from-cyan-500 to-teal-500 px-3.5 py-2 text-xs font-extrabold text-white",children:"🎖️ អនុប្រធានទី ២"}),
          e.jsx("div",{className:"p-3",children:
            e.jsxs("select",{value:q.vicePresident2Id||"",onChange:Ze=>Oe(Number(Ze.target.value)),className:"w-full p-2 bg-white border border-cyan-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-cyan-500",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ២ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`vp22-\${Ze.id}\`))
            ]})
          })
        ]})
      ]}),

      e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:
        dm.map((Ze,Ve)=>{
          const kt=Ve+1,ct=wm[Ve]||wm[0],jr=(q.subBranches[kt]||[]).map(he=>de.find(Re=>Re.id===he)).filter(Boolean);
          return e.jsxs("div",{className:\`rounded-2xl border-2 \${ct.border} \${ct.lightBg} overflow-hidden shadow-xs\`,children:[
            e.jsxs("div",{className:\`\${ct.headerBg} \${ct.headerText} px-4 py-2.5 flex items-center justify-between gap-2\`,children:[
              e.jsxs("span",{className:"font-extrabold text-xs truncate",children:["អនុសាខាទី ",fr(kt)," · ",Ze.name]}),
              e.jsxs("span",{className:"text-[11px] font-extrabold text-white shrink-0",children:[fr(jr.length)," នាក់"]})
            ]}),
            e.jsx("div",{className:"p-3.5",children:
              jr.length>0
                ?e.jsx("div",{className:"flex flex-wrap gap-1.5 max-h-28 overflow-y-auto no-scrollbar",children:
                  jr.map(he=>e.jsxs("span",{className:"px-2.5 py-1 bg-white text-slate-900 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs",children:["#",fr(he.rollNo||he.id)," ",he.name]},\`sb-\${kt}-\${he.id}\`))
                })
                :e.jsx("div",{className:"text-xs text-slate-500 italic",children:"មិនទាន់មានសមាជិក"})
            })
          ]},\`sb-card-\${kt}\`);
        })
      }),

      e.jsx("div",{className:"overflow-x-auto border-2 border-emerald-300 rounded-2xl shadow-xs",children:
        e.jsxs("table",{className:"w-full text-xs text-left border-collapse",children:[
          e.jsx("thead",{children:e.jsxs("tr",{className:"text-white font-extrabold",children:[
            e.jsx("th",{className:"p-3 text-center w-12 bg-emerald-600 border-r border-emerald-500",children:"ល.រ"}),
            e.jsx("th",{className:"p-3 min-w-[165px] bg-teal-600 border-r border-teal-500",children:"សកម្មភាពប្រចាំថ្ងៃ"}),
            e.jsx("th",{className:"p-3 text-center bg-amber-500 border-r border-amber-400",children:"ចន្ទ"}),
            e.jsx("th",{className:"p-3 text-center bg-purple-600 border-r border-purple-500",children:"អង្គារ"}),
            e.jsx("th",{className:"p-3 text-center bg-emerald-500 border-r border-emerald-400",children:"ពុធ"}),
            e.jsx("th",{className:"p-3 text-center bg-orange-500 border-r border-orange-400",children:"ព្រហស្បតិ៍"}),
            e.jsx("th",{className:"p-3 text-center bg-sky-500 border-r border-sky-400",children:"សុក្រ"}),
            e.jsx("th",{className:"p-3 text-center bg-rose-500",children:"សៅរ៍"})
          ]})}),
          e.jsx("tbody",{className:"divide-y divide-slate-200 font-medium text-slate-800 bg-white",children:
            dm.map((Ze,Ve)=>{
              const kt=[0,1,2,3,4,5].map(Ft=>(Ve-Ft+6)%6+1);
              return e.jsxs("tr",{className:"hover:bg-sky-50 transition",children:[
                e.jsx("td",{className:"p-2.5 text-center font-extrabold text-emerald-700 border-r border-slate-200",children:fr(Ve+1)}),
                e.jsx("td",{className:"p-2.5 font-extrabold text-slate-900 border-r border-slate-200",children:Ze.name}),
                kt.map((Ft,jr)=>{
                  const cb=wm[Ft-1]||wm[0];
                  return e.jsx("td",{className:\`p-2 text-center \${jr<5?"border-r border-slate-200":""}\`,children:
                    e.jsx("span",{className:\`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-extrabold \${cb.badge}\`,children:\`អនុសាខាទី \${fr(Ft)}\`})
                  },\`cell-\${Ve}-\${jr}\`);
                })
              ]},\`task-row-\${Ve}\`);
            })
          })
        ]})
      })
    ]}),`;

if (!src.includes(comViewOld)) throw new Error("Missing comViewOld");
src = src.replace(comViewOld, comViewNew);

fs.writeFileSync(FILE, src, "utf8");

const sf = ts.createSourceFile(FILE, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("Parse diagnostics:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("SUCCESS: patched fresh colors v121, 0 parse diagnostics, length:", src.length);
