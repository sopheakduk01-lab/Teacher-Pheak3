const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const targetPath = path.join(__dirname, "..", "public", "assets", "index-BwPwHqBe.js");
let code = fs.readFileSync(targetPath, "utf8");

function replaceExact(label, findStr, replaceStr) {
  const idx = code.indexOf(findStr);
  if (idx === -1) {
    throw new Error(`[FAIL] Could not find target for: ${label}`);
  }
  const second = code.indexOf(findStr, idx + 1);
  if (second !== -1) {
    throw new Error(`[FAIL] Found multiple matches for: ${label}`);
  }
  code = code.slice(0, idx) + replaceStr + code.slice(idx + findStr.length);
  console.log(`[OK] ${label}`);
}

// 1. Compact buildVisualSeatingHtml sizing, spacing, and signature block so 4x5/4x6 grids fit cleanly on 1 A4 Landscape page
replaceExact(
  "buildVisualSeatingHtml_sizing",
  `  const dense=cols>=5;
  const imgSz=dense?28:36;`,
  `  const dense=cols>=5||rows>=5;
  const compact=rows>=4||cols>=5||mode==="group"||mode==="u_shape";
  const imgSz=cols>=5?24:rows>=4?26:32;`
);

replaceExact(
  "buildVisualSeatingHtml_seat_font",
  `      <div class="sp-seat-name" style="font-size:\${dense?"9.5px":"11px"};color:\${dark?"#ffffff":"#0f172a"};" title="\${escS(st.name)}">\${escS(st.name)}</div>`,
  `      <div class="sp-seat-name" style="font-size:\${dense?"9px":compact?"10px":"11px"};color:\${dark?"#ffffff":"#0f172a"};" title="\${escS(st.name)}">\${escS(st.name)}</div>`
);

replaceExact(
  "buildVisualSeatingHtml_layouts_gaps",
  `    layoutHtml=\`<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;">
      \${groups.map(g=>\`<div style="border:1.5px solid \${bw?"#334155":g.col};border-radius:12px;padding:8px;background:\${bw?"#fff":dark?"#0f172a":g.bg};break-inside:avoid;">
        <div style="font-weight:800;font-size:11px;color:\${bw?"#000":g.col};margin-bottom:6px;padding-bottom:4px;border-bottom:1px dashed \${bw?"#cbd5e1":g.col};">\${g.title}</div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;">
          \${g.desks.map(d=>renderDesk(d)).join("")}
        </div>
      </div>\`).join("")}
    </div>\`;
  }else if(mode==="u_shape"){
    const c1=Math.ceil(a.length/3),c2=Math.ceil(a.length*2/3);
    const wings=[
      {title:"ស្លាបឆ្វេង",desks:a.slice(0,c1)},
      {title:"ជួរកណ្តាល & បាត",desks:a.slice(c1,c2)},
      {title:"ស្លាបស្តាំ",desks:a.slice(c2)}
    ];
    layoutHtml=\`<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;border:2px solid #cbd5e1;border-top:none;border-radius:0 0 14px 14px;padding:10px;">
      \${wings.map(w=>\`<div style="display:flex;flex-direction:column;gap:7px;">
        <div style="text-align:center;font-weight:800;font-size:10.5px;color:#334155;border-bottom:1px solid #cbd5e1;padding-bottom:3px;">\${w.title}</div>
        \${w.desks.map(d=>renderDesk(d)).join("")}
      </div>\`).join("")}
    </div>\`;
  }else if(mode==="rows"){
    layoutHtml=\`<div style="display:grid;grid-template-columns:repeat(\${Math.min(cols,6)},minmax(0,1fr));gap:8px;">
      \${Array.from({length:cols},(_,i)=>i+1).map(cIdx=>{
        const colDesks=a.filter(d=>d.colIndex===cIdx);
        return \`<div style="border:1px solid #cbd5e1;border-radius:12px;padding:7px;background:\${dark?"#0f172a":"#f8fafc"};display:flex;flex-direction:column;gap:6px;">
          <div style="text-align:center;font-weight:800;font-size:10px;color:\${dark?"#e2e8f0":"#334155"};border-bottom:1px solid #cbd5e1;padding-bottom:3px;">ជួរឈរទី \${fr(cIdx)}</div>
          \${colDesks.map(d=>renderDesk(d)).join("")}
        </div>\`;
      }).join("")}
    </div>\`;
  }else if(mode==="pairs"){
    layoutHtml=\`<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;">
      \${a.map((d,idx)=>renderDesk(d,\`ក្រុមគូ #\${fr(idx+1)}\`)).join("")}
    </div>\`;
  }else{
    layoutHtml=\`<div style="display:flex;flex-direction:column;gap:8px;">
      \${Array.from({length:rows},(_,rIdx)=>rIdx+1).map(rNum=>{
        const rDesks=a.filter(d=>d.rowIndex===rNum);
        return \`<div class="sp-row-wrap">
          <div class="sp-row-hdr" style="color:\${dark?"#cbd5e1":"#475569"};">
            <span>ជួរបណ្តាយទី \${fr(rNum)} \${rNum===1?"(ជួរមុខជិតក្តារខៀន)":rNum===rows?"(ជួរក្រោយ)":""}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(\${Math.min(cols,6)},minmax(0,1fr));gap:\${dense?5:8}px;">
            \${rDesks.map(d=>renderDesk(d)).join("")}
          </div>
        </div>\`;
      }).join("")}
    </div>\`;
  }`,
  `    layoutHtml=\`<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;">
      \${groups.map(g=>\`<div style="border:1.5px solid \${bw?"#334155":g.col};border-radius:10px;padding:6px;background:\${bw?"#fff":dark?"#0f172a":g.bg};break-inside:avoid;">
        <div style="font-weight:800;font-size:10px;color:\${bw?"#000":g.col};margin-bottom:4px;padding-bottom:3px;border-bottom:1px dashed \${bw?"#cbd5e1":g.col};">\${g.title}</div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;">
          \${g.desks.map(d=>renderDesk(d)).join("")}
        </div>
      </div>\`).join("")}
    </div>\`;
  }else if(mode==="u_shape"){
    const c1=Math.ceil(a.length/3),c2=Math.ceil(a.length*2/3);
    const wings=[
      {title:"ស្លាបឆ្វេង",desks:a.slice(0,c1)},
      {title:"ជួរកណ្តាល & បាត",desks:a.slice(c1,c2)},
      {title:"ស្លាបស្តាំ",desks:a.slice(c2)}
    ];
    layoutHtml=\`<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;border:2px solid #cbd5e1;border-top:none;border-radius:0 0 12px 12px;padding:7px;">
      \${wings.map(w=>\`<div style="display:flex;flex-direction:column;gap:5px;">
        <div style="text-align:center;font-weight:800;font-size:10px;color:#334155;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">\${w.title}</div>
        \${w.desks.map(d=>renderDesk(d)).join("")}
      </div>\`).join("")}
    </div>\`;
  }else if(mode==="rows"){
    layoutHtml=\`<div style="display:grid;grid-template-columns:repeat(\${Math.min(cols,6)},minmax(0,1fr));gap:6px;">
      \${Array.from({length:cols},(_,i)=>i+1).map(cIdx=>{
        const colDesks=a.filter(d=>d.colIndex===cIdx);
        return \`<div style="border:1px solid #cbd5e1;border-radius:10px;padding:5px;background:\${dark?"#0f172a":"#f8fafc"};display:flex;flex-direction:column;gap:5px;">
          <div style="text-align:center;font-weight:800;font-size:9.5px;color:\${dark?"#e2e8f0":"#334155"};border-bottom:1px solid #cbd5e1;padding-bottom:2px;">ជួរឈរទី \${fr(cIdx)}</div>
          \${colDesks.map(d=>renderDesk(d)).join("")}
        </div>\`;
      }).join("")}
    </div>\`;
  }else if(mode==="pairs"){
    layoutHtml=\`<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;">
      \${a.map((d,idx)=>renderDesk(d,\`ក្រុមគូ #\${fr(idx+1)}\`)).join("")}
    </div>\`;
  }else{
    layoutHtml=\`<div style="display:flex;flex-direction:column;gap:\${compact?5:7}px;">
      \${Array.from({length:rows},(_,rIdx)=>rIdx+1).map(rNum=>{
        const rDesks=a.filter(d=>d.rowIndex===rNum);
        return \`<div class="sp-row-wrap">
          <div class="sp-row-hdr" style="color:\${dark?"#cbd5e1":"#475569"};">
            <span>ជួរបណ្តាយទី \${fr(rNum)} \${rNum===1?"(ជួរមុខជិតក្តារខៀន)":rNum===rows?"(ជួរក្រោយ)":""}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(\${Math.min(cols,6)},minmax(0,1fr));gap:\${dense?4:6}px;">
            \${rDesks.map(d=>renderDesk(d)).join("")}
          </div>
        </div>\`;
      }).join("")}
    </div>\`;
  }`
);

replaceExact(
  "buildVisualSeatingHtml_stage_and_css",
  `    <div class="sp-stage" style="background:\${dark?"#0b1120":"linear-gradient(180deg,#f0f9ff 0%,#ffffff 50%,#ecfdf5 100%)"};border:2px solid \${bw?"#334155":dark?"#334155":"#6ee7b7"};border-radius:16px;padding:12px;">
      <div class="sp-top-stage">
        <div class="sp-chalkboard" style="\${bw?"background:#f1f5f9;color:#000;border:2px solid #000;":"background:linear-gradient(90deg,#059669 0%,#0d9488 50%,#059669 100%);color:#ffffff;border:4px solid #f59e0b;"}">`,
  `    <div class="sp-stage" style="background:\${dark?"#0b1120":"linear-gradient(180deg,#f0f9ff 0%,#ffffff 50%,#ecfdf5 100%)"};border:2px solid \${bw?"#334155":dark?"#334155":"#6ee7b7"};border-radius:12px;padding:\${compact?"7px 9px":"10px"};">
      <div class="sp-top-stage">
        <div class="sp-chalkboard" style="\${bw?"background:#f1f5f9;color:#000;border:2px solid #000;":"background:linear-gradient(90deg,#059669 0%,#0d9488 50%,#059669 100%);color:#ffffff;border:3px solid #f59e0b;"}">`
);

replaceExact(
  "buildVisualSeatingHtml_scCss",
  `  const scCss=\`<style>
    .sp-wrap{font-family:'Kantumruy Pro','Siemreap','Battambang',sans-serif;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important;}
    .sp-stage{box-sizing:border-box;width:100%;}
    .sp-top-stage{display:flex;align-items:stretch;gap:10px;margin-bottom:6px;break-inside:avoid;}
    .sp-chalkboard{flex:1;border-radius:10px;padding:8px 12px;text-align:center;box-shadow:inset 0 1px 0 rgba(255,255,255,0.15);}
    .sp-teacher-desk{width:195px;border-radius:10px;padding:6px 10px;display:flex;align-items:center;gap:8px;flex-shrink:0;}
    .sp-front-arrow{text-align:center;font-size:9px;font-weight:700;margin:4px 0 8px 0;}
    .sp-row-wrap{break-inside:avoid;page-break-inside:avoid;}
    .sp-row-hdr{font-size:9.5px;font-weight:800;margin-bottom:4px;}
    .sp-desk{border-radius:10px;overflow:hidden;break-inside:avoid;page-break-inside:avoid;}
    .sp-desk-hdr{padding:3px 7px;display:flex;align-items:center;justify-content:space-between;font-size:9px;font-weight:800;}
    .sp-desk-num{font-size:8.5px;opacity:0.85;}
    .sp-desk-body{display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:5px;}
    .sp-seat{border-radius:8px;padding:5px 4px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:2px;min-width:0;}
    .sp-seat-empty{border:1px dashed #cbd5e1;background:#f8fafc;color:#94a3b8;justify-content:center;min-height:66px;}
    .sp-empty-ico{font-size:13px;opacity:0.55;}
    .sp-empty-lbl{font-size:8.5px;font-weight:700;}
    .sp-seat-top{display:flex;justify-content:center;}
    .sp-seat-name{font-weight:800;line-height:1.22;width:100%;word-break:break-word;}
    .sp-seat-meta{font-size:8.5px;font-weight:600;}
    .sp-badge{font-size:8px;font-weight:800;padding:1px 5px;border-radius:5px;margin-top:1px;}
    .sp-b-pres{background:#fef3c7;color:#92400e;}
    .sp-b-vp1{background:#e0e7ff;color:#3730a3;}
    .sp-b-vp2{background:#cffafe;color:#155e75;}
    .sp-b-eye{background:#fef3c7;color:#b45309;}
    .sp-b-slow{background:#ffe4e6;color:#be123c;}
    .sp-sub-txt{font-size:8px;color:#64748b;font-weight:600;}
    .sp-legend{margin-top:10px;padding-top:6px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;font-size:9px;font-weight:700;}
    .sp-sum-tbl{width:100%;border-collapse:collapse;margin-top:8px;font-size:8.5px;}
    .sp-sum-tbl th,.sp-sum-tbl td{border:1px solid #94a3b8;padding:3px 6px;text-align:center;}
    .sp-sum-tbl th{background:#f1f5f9;font-weight:800;}
    .sp-sigs{display:flex;justify-content:space-between;align-items:flex-start;margin-top:12px;padding:0 18px;break-inside:avoid;page-break-inside:avoid;}
    .sp-sig{text-align:center;width:210px;font-size:9px;}
  </style>\`;`,
  `  const scCss=\`<style>
    .sp-wrap{font-family:'Kantumruy Pro','Siemreap','Battambang',sans-serif;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important;}
    .sp-stage{box-sizing:border-box;width:100%;}
    .sp-top-stage{display:flex;align-items:stretch;gap:8px;margin-bottom:4px;break-inside:avoid;}
    .sp-chalkboard{flex:1;border-radius:9px;padding:5px 10px;text-align:center;box-shadow:inset 0 1px 0 rgba(255,255,255,0.15);}
    .sp-teacher-desk{width:188px;border-radius:9px;padding:4px 8px;display:flex;align-items:center;gap:6px;flex-shrink:0;}
    .sp-front-arrow{text-align:center;font-size:8.5px;font-weight:700;margin:2px 0 4px 0;}
    .sp-row-wrap{break-inside:avoid;page-break-inside:avoid;}
    .sp-row-hdr{font-size:8.5px;font-weight:800;margin-bottom:2px;}
    .sp-desk{border-radius:8px;overflow:hidden;break-inside:avoid;page-break-inside:avoid;}
    .sp-desk-hdr{padding:2px 6px;display:flex;align-items:center;justify-content:space-between;font-size:8.5px;font-weight:800;}
    .sp-desk-num{font-size:8px;opacity:0.85;}
    .sp-desk-body{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:4px;}
    .sp-seat{border-radius:7px;padding:3px 3px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:1px;min-width:0;}
    .sp-seat-empty{border:1px dashed #cbd5e1;background:#f8fafc;color:#94a3b8;justify-content:center;min-height:46px;}
    .sp-empty-ico{font-size:12px;opacity:0.55;}
    .sp-empty-lbl{font-size:8px;font-weight:700;}
    .sp-seat-top{display:flex;justify-content:center;}
    .sp-seat-name{font-weight:800;line-height:1.18;width:100%;word-break:break-word;}
    .sp-seat-meta{font-size:8px;font-weight:600;}
    .sp-badge{font-size:7.5px;font-weight:800;padding:1px 4px;border-radius:4px;margin-top:1px;}
    .sp-b-pres{background:#fef3c7;color:#92400e;}
    .sp-b-vp1{background:#e0e7ff;color:#3730a3;}
    .sp-b-vp2{background:#cffafe;color:#155e75;}
    .sp-b-eye{background:#fef3c7;color:#b45309;}
    .sp-b-slow{background:#ffe4e6;color:#be123c;}
    .sp-sub-txt{font-size:7.5px;color:#64748b;font-weight:600;}
    .sp-legend{margin-top:5px;padding-top:4px;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;font-size:8.5px;font-weight:700;}
    .sp-sum-tbl{width:100%;border-collapse:collapse;margin-top:5px;font-size:8px;}
    .sp-sum-tbl th,.sp-sum-tbl td{border:1px solid #94a3b8;padding:2px 5px;text-align:center;}
    .sp-sum-tbl th{background:#f1f5f9;font-weight:800;}
    .sp-sigs{display:flex;justify-content:space-between;align-items:flex-start;margin-top:6px;padding:0 24px;break-inside:avoid;page-break-inside:avoid;}
    .sp-sig{text-align:center;width:210px;font-size:8.5px;}
  </style>\`;`
);

replaceExact(
  "buildVisualSeatingHtml_header_sigs_compact",
  `  return \`\${scCss}<div class="sp-wrap">
    <div style="text-align:center;margin-bottom:5px;">
      <div style="font-family:'Moul',serif;font-size:10.5pt;font-weight:bold;color:#0f172a;">ព្រះរាជាណាចក្រកម្ពុជា</div>
      <div style="font-family:'Moul',serif;font-size:9pt;font-weight:bold;color:#1e293b;margin-top:1px;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
      <div style="font-size:8.5pt;letter-spacing:2px;font-weight:bold;color:#475569;">— ༺ ៚ ༻ —</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:7px;border-bottom:2px solid #0f172a;padding-bottom:4px;font-size:8.5pt;">
      <div style="text-align:left;">
        <div style="font-weight:700;color:#0f172a;">ការិយាល័យអប់រំ យុវជន និងកីឡា</div>
        <div style="font-weight:800;color:#1e1b4b;margin-top:1px;">សាលារៀន៖ \${escS((s&&s.school)||"សាលារៀនគំរូ")}</div>
      </div>
      <div style="text-align:right;color:#334155;">
        <div>ថ្នាក់ទី៖ <b>\${escS((s&&s.grade)||"ថ្នាក់ទី ៦")}</b> · បន្ទប់លេខ៖ <b>\${fr(room)}</b></div>
        <div>គ្រូបន្ទុកថ្នាក់៖ <b>\${escS((s&&s.name)||"លោកគ្រូ / អ្នកគ្រូ")}</b> · ឆ្នាំសិក្សា៖ <b>\${escS(yr)}</b></div>
      </div>
    </div>
    <div style="text-align:center;margin:4px 0 8px 0;padding:4px 0;border-top:1.5px solid #0f172a;border-bottom:1.5px solid #0f172a;background:\${bw?"#f3f4f6":"#f0fdf4"};">
      <h2 style="font-family:'Moul',serif;font-size:11pt;color:\${bw?"#000":"#14532d"};margin:0;">ប្លង់តុ និងការរៀបចំថ្នាក់រៀន (\${fr(cols)} ជួរទទឹង × \${fr(rows)} ជួរបណ្តាយ)</h2>
    </div>
    \${stageHtml}
    \${statsHtml}
    \${sanHtml}
    <div class="sp-sigs">
      <div class="sp-sig">
        <div style="font-weight:800;">បានឃើញ និងឯកភាព</div>
        <div style="font-family:'Moul',serif;font-size:8.5pt;margin-top:2px;">នាយកសាលា</div>
        <div style="height:36px;"></div>
        <div style="color:#64748b;">...........................................</div>
      </div>
      <div class="sp-sig">
        <div style="font-size:8pt;font-style:italic;white-space:pre-line;">\${escS(dateStr||"ថ្ងៃ.........ខែ.........ឆ្នាំ ២០២...")}</div>
        <div style="font-family:'Moul',serif;font-size:8.5pt;margin-top:2px;">គ្រូបន្ទុកថ្នាក់</div>
        <div style="height:36px;"></div>
        <div style="font-weight:800;">\${escS((s&&s.name)||"លោកគ្រូ / អ្នកគ្រូ")}</div>
      </div>
    </div>
  </div>\`;`,
  `  return \`\${scCss}<div class="sp-wrap">
    <div style="text-align:center;margin-bottom:2px;">
      <div style="font-family:'Moul',serif;font-size:10pt;font-weight:bold;color:#0f172a;">ព្រះរាជាណាចក្រកម្ពុជា</div>
      <div style="font-family:'Moul',serif;font-size:8.5pt;font-weight:bold;color:#1e293b;">ជាតិ សាសនា ព្រះមហាក្សត្រ · — ༺ ៚ ༻ —</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:4px;border-bottom:1.5px solid #0f172a;padding-bottom:3px;font-size:8pt;">
      <div style="text-align:left;">
        <div style="font-weight:700;color:#0f172a;">ការិយាល័យអប់រំ យុវជន និងកីឡា</div>
        <div style="font-weight:800;color:#1e1b4b;">សាលារៀន៖ \${escS((s&&s.school)||"សាលារៀនគំរូ")}</div>
      </div>
      <div style="text-align:right;color:#334155;">
        <div>ថ្នាក់ទី៖ <b>\${escS((s&&s.grade)||"ថ្នាក់ទី ៦")}</b> · បន្ទប់លេខ៖ <b>\${fr(room)}</b></div>
        <div>គ្រូបន្ទុកថ្នាក់៖ <b>\${escS((s&&s.name)||"លោកគ្រូ / អ្នកគ្រូ")}</b> · ឆ្នាំសិក្សា៖ <b>\${escS(yr)}</b></div>
      </div>
    </div>
    <div style="text-align:center;margin:2px 0 4px 0;padding:3px 0;border-top:1.5px solid #0f172a;border-bottom:1.5px solid #0f172a;background:\${bw?"#f3f4f6":"#f0fdf4"};">
      <h2 style="font-family:'Moul',serif;font-size:10.5pt;color:\${bw?"#000":"#14532d"};margin:0;">ប្លង់តុ និងការរៀបចំថ្នាក់រៀន (\${fr(cols)} ជួរទទឹង × \${fr(rows)} ជួរបណ្តាយ)</h2>
    </div>
    \${stageHtml}
    \${statsHtml}
    \${sanHtml}
    <div class="sp-sigs">
      <div class="sp-sig">
        <div style="font-weight:800;">បានឃើញ និងឯកភាព</div>
        <div style="font-family:'Moul',serif;font-size:8pt;margin-top:1px;">នាយកសាលា</div>
        <div style="height:22px;"></div>
        <div style="color:#64748b;">...........................................</div>
      </div>
      <div class="sp-sig">
        <div style="font-size:7.5pt;font-style:italic;white-space:pre-line;">\${escS(dateStr||"ថ្ងៃ.........ខែ.........ឆ្នាំ ២០២...")}</div>
        <div style="font-family:'Moul',serif;font-size:8pt;margin-top:1px;">គ្រូបន្ទុកថ្នាក់</div>
        <div style="height:22px;"></div>
        <div style="font-weight:800;">\${escS((s&&s.name)||"លោកគ្រូ / អ្នកគ្រូ")}</div>
      </div>
    </div>
  </div>\`;`
);

// 2. Update LCe G() to strictly auto-fit on 1 single A4 Landscape page
const lceFitScript = `(function(){
  function fitOnePage(){
    var root=document.getElementById('sp-onepage-root');
    var clip=document.getElementById('sp-onepage-clip');
    var probe=document.getElementById('sp-page-probe');
    if(!root||!clip||!probe)return;
    root.style.transform='';
    root.style.width='100%';
    clip.style.height='auto';
    var maxH=probe.getBoundingClientRect().height||735;
    var curH=root.scrollHeight;
    if(curH>maxH){
      var s=Math.max(0.42,(maxH-4)/curH);
      root.style.transformOrigin='top left';
      root.style.transform='scale('+s.toFixed(4)+')';
      root.style.width=(100/s).toFixed(3)+'%';
      clip.style.height=Math.floor(Math.min(maxH,curH*s))+'px';
    }
  }
  window.__fitOnePage=fitOnePage;
  window.addEventListener('beforeprint',fitOnePage);
  function start(){
    fitOnePage();
    var p=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
    p.then(function(){
      fitOnePage();
      setTimeout(function(){fitOnePage();window.print();},350);
    });
  }
  if(document.readyState==='complete'){start();}else{window.addEventListener('load',start);}
})();`;

replaceExact(
  "LCe_G_onepage_print",
  `    return \`<!DOCTYPE html><html lang="km"><head><meta charset="utf-8" /><base href="\${window.location.origin}/" /><title>ប្លង់តុថ្នាក់រៀន_\${escS(s.grade)}_\${escS(s.school)}_A4</title>\${Oo()}<style>@page{size:A4 landscape;margin:6mm 8mm;}*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'\${ae}','Kantumruy Pro','Battambang','Siemreap',sans-serif;background:#fff !important;color:#0f172a;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}@media print{.no-print{display:none !important;}}</style></head><body>\${bodyHtml}<script>window.onload=function(){setTimeout(function(){window.print();},450);};</script></body></html>\`;`,
  `    return \`<!DOCTYPE html><html lang="km"><head><meta charset="utf-8" /><base href="\${window.location.origin}/" /><title>ប្លង់តុថ្នាក់រៀន_\${escS(s.grade)}_\${escS(s.school)}_A4</title>\${Oo()}<style>@page{size:A4 landscape;margin:5mm 6mm;}*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'\${ae}','Kantumruy Pro','Battambang','Siemreap',sans-serif;background:#fff !important;color:#0f172a;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}#sp-onepage-clip{width:100%;overflow:hidden;break-inside:avoid;page-break-inside:avoid;page-break-after:avoid;}#sp-onepage-root{width:100%;transform-origin:top left;}@media print{html,body{width:100%;height:197mm;max-height:197mm;overflow:hidden !important;margin:0 !important;padding:0 !important;}.no-print,#sp-page-probe{display:none !important;}#sp-onepage-clip{max-height:197mm !important;overflow:hidden !important;break-inside:avoid;page-break-inside:avoid;page-break-after:avoid;}}</style></head><body><div id="sp-onepage-clip"><div id="sp-onepage-root">\${bodyHtml}</div></div><div id="sp-page-probe" style="position:fixed;left:-9999px;top:0;width:1px;height:196mm;pointer-events:none;"></div><script>${lceFitScript.replace(/\n/g, " ")}</script></body></html>\`;`
);

replaceExact(
  "LCe_modal_subtitle",
  `e.jsx("p",{className:"text-xs text-slate-300 mt-0.5",children:"បង្ហាញប្លង់តុ និងរូបថតសិស្សទាំងអស់ដូចអេក្រង់ · A4 Landscape"})`,
  `e.jsx("p",{className:"text-xs text-slate-300 mt-0.5",children:"បង្ហាញប្លង់តុ និងរូបថតសិស្សទាំងអស់ដូចអេក្រង់ · ១ ទំព័រ A4 Landscape ស្វ័យប្រវត្តិ"})`
);

// 3. Update Oi Ut() & Pe() for documentType === "seating_chart" to strictly fit on 1 page
replaceExact(
  "Oi_Ut_seating_margins",
  `let tr="15mm";V.paperSize==="A5"?tr=V.marginSize==="tight"?"6mm":V.marginSize==="wide"?"12mm":"8mm":(V.marginSize==="tight"&&(tr="10mm"),V.marginSize==="wide"&&(tr="20mm"));`,
  `let tr="15mm";V.paperSize==="A5"?tr=V.marginSize==="tight"?"6mm":V.marginSize==="wide"?"12mm":"8mm":(V.marginSize==="tight"&&(tr="10mm"),V.marginSize==="wide"&&(tr="20mm"));let seatingMaxMm="195mm";if(s==="seating_chart"){const isLand=V.orientation==="landscape";const paperH=V.paperSize==="A5"?(isLand?148:210):(isLand?210:297);const vMargin=V.marginSize==="tight"?5:V.marginSize==="wide"?11:7;const hMargin=V.marginSize==="tight"?7:V.marginSize==="wide"?12:9;tr=\`\${vMargin}mm \${hMargin}mm\`;seatingMaxMm=\`\${paperH-vMargin*2-4}mm\`}`
);

replaceExact(
  "Oi_Ut_seating_styles",
  `          @media print {
            .no-print { display: none !important; }
            \${V.colorTheme==="bw"?"body { background-color: #fff !important; }":""}
          }
        </style>
      </head>
      <body>`,
  `          \${s==="seating_chart"?\`
            .pdf-main-content table.sp-sum-tbl { margin-top: 4px !important; margin-bottom: 4px !important; font-size: 8.5px !important; }
            .pdf-main-content table.sp-sum-tbl th, .pdf-main-content table.sp-sum-tbl td { padding: 2px 6px !important; }
            #oi-onepage-clip { width: 100%; overflow: hidden; break-inside: avoid; page-break-inside: avoid; page-break-after: avoid; }
            #oi-onepage-root { width: 100%; transform-origin: top left; }
          \`:""}
          @media print {
            .no-print { display: none !important; }
            \${V.colorTheme==="bw"?"body { background-color: #fff !important; }":""}
            \${s==="seating_chart"?\`
              html, body { width: 100%; height: \${seatingMaxMm}; max-height: \${seatingMaxMm}; overflow: hidden !important; margin: 0 !important; padding: 0 !important; }
              #oi-page-probe { display: none !important; }
              #oi-onepage-clip { max-height: \${seatingMaxMm} !important; overflow: hidden !important; break-inside: avoid; page-break-inside: avoid; page-break-after: avoid; }
            \`:""}
          }
        </style>
      </head>
      <body>\${s==="seating_chart"?'<div id="oi-onepage-clip"><div id="oi-onepage-root">':""}`
);

replaceExact(
  "Oi_Ut_seating_compact_chrome",
  `        \${V.showHeaderTopBar!==!1?\`<div style="height: 4px; background: linear-gradient(90deg, \${_e}, \${ut}, \${_e}); border-radius: 2px; margin-bottom: 10px;"></div>\`:""}`,
  `        \${V.showHeaderTopBar!==!1?\`<div style="height: 4px; background: linear-gradient(90deg, \${_e}, \${ut}, \${_e}); border-radius: 2px; margin-bottom: \${s==="seating_chart"?"4px":"10px"};"></div>\`:""}`
);

replaceExact(
  "Oi_Ut_seating_compact_headers",
  `        \${V.showKingdomHeader?V.headerLayout==="side_by_side"?\`
          <table class="pdf-header-table" style="width: 100%; border-collapse: collapse; margin-bottom: 12px; \${Re("kingdom_header")}">
            <tr>
              <td style="width: 55%; text-align: left; vertical-align: top; padding-top: 10px; \${Re("school_info")}">`,
  `        \${V.showKingdomHeader?V.headerLayout==="side_by_side"?\`
          <table class="pdf-header-table" style="width: 100%; border-collapse: collapse; margin-bottom: \${s==="seating_chart"?"4px":"12px"}; \${Re("kingdom_header")}">
            <tr>
              <td style="width: 55%; text-align: left; vertical-align: top; padding-top: \${s==="seating_chart"?"2px":"10px"}; \${Re("school_info")}">`
);

replaceExact(
  "Oi_Ut_seating_compact_centered_hdr",
  `          <div style="text-align: center; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; \${Re("kingdom_header")}">
            <div class="moul-title" style="font-size: 1.1em; color: \${_e}; letter-spacing: 1px;">\${O.kingdomTitle||"ព្រះរាជាណាចក្រកម្ពុជា"}</div>
            <div class="moul-title" style="font-size: 0.95em; color: \${_e}; margin-top: 3px;">\${O.kingdomMotto||"ជាតិ សាសនា ព្រះមហាក្សត្រ"}</div>
            <div style="font-size: 0.85em; letter-spacing: 2px; margin-top: 2px; font-weight: bold; color: \${_e};">\${O.headerEmblemText||"— ༺ ៚ ༻ —"}</div>
          </div>

          <!-- Ministry, Department, School & Teacher Info -->
          <table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">`,
  `          <div style="text-align: center; margin-bottom: \${s==="seating_chart"?"4px":"10px"}; padding-bottom: \${s==="seating_chart"?"3px":"6px"}; border-bottom: 1px solid #e2e8f0; \${Re("kingdom_header")}">
            <div class="moul-title" style="font-size: 1.1em; color: \${_e}; letter-spacing: 1px;">\${O.kingdomTitle||"ព្រះរាជាណាចក្រកម្ពុជា"}</div>
            <div class="moul-title" style="font-size: 0.95em; color: \${_e}; margin-top: 3px;">\${O.kingdomMotto||"ជាតិ សាសនា ព្រះមហាក្សត្រ"}</div>
            <div style="font-size: 0.85em; letter-spacing: 2px; margin-top: 2px; font-weight: bold; color: \${_e};">\${O.headerEmblemText||"— ༺ ៚ ༻ —"}</div>
          </div>

          <!-- Ministry, Department, School & Teacher Info -->
          <table style="width: 100%; margin-bottom: \${s==="seating_chart"?"4px":"12px"}; border-collapse: collapse;">`
);

replaceExact(
  "Oi_Ut_seating_compact_title",
  `        \${O.docTitle||O.docSubtitle?\`
        <div style="text-align: center; margin: 10px 0 14px 0; border-bottom: 1.5px solid \${_e}; padding-bottom: 6px; \${Re("doc_title")}">`,
  `        \${O.docTitle||O.docSubtitle?\`
        <div style="text-align: center; margin: \${s==="seating_chart"?"3px 0 5px 0":"10px 0 14px 0"}; border-bottom: 1.5px solid \${_e}; padding-bottom: \${s==="seating_chart"?"3px":"6px"}; \${Re("doc_title")}">`
);

const oiFitScript = `(function(){
  function fitOi(){
    var root=document.getElementById('oi-onepage-root');
    var clip=document.getElementById('oi-onepage-clip');
    var probe=document.getElementById('oi-page-probe');
    if(!root||!clip||!probe)return;
    root.style.transform='';
    root.style.width='100%';
    clip.style.height='auto';
    var maxH=probe.getBoundingClientRect().height||730;
    var curH=root.scrollHeight;
    if(curH>maxH){
      var sc=Math.max(0.42,(maxH-4)/curH);
      root.style.transformOrigin='top left';
      root.style.transform='scale('+sc.toFixed(4)+')';
      root.style.width=(100/sc).toFixed(3)+'%';
      clip.style.height=Math.floor(Math.min(maxH,curH*sc))+'px';
    }
  }
  window.__fitOiOnePage=fitOi;
  window.addEventListener('beforeprint',fitOi);
  window.addEventListener('load',function(){
    fitOi();
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(fitOi);}
    setTimeout(fitOi,180);
  });
  fitOi();
})();`;

replaceExact(
  "Oi_Ut_seating_compact_sigs_and_script",
  `        <!-- SIGNATURES SECTION (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) -->
        \${V.showSignatures?V.signaturesLayout==="side_by_side"?\`
          <table class="signatures-table">
            <tr>
              <td style="\${Re("left_signature")}">
                <div style="font-weight: bold; font-size: 0.92em; white-space: pre-line;">\${O.leftSignatureTitle}</div>
                \${V.showStampBox?'<div class="stamp-box">ទីតាំងប្រោះត្រា</div>':'<div style="height: 55px;"></div>'}
                <div style="font-weight: bold; font-size: 0.95em;">\${O.leftSignatureName||"..........................................."}</div>
              </td>
              <td style="\${Re("right_signature")}">
                <div style="font-size: 0.88em; color: #475569; margin-bottom: 4px; white-space: pre-line; \${Re("location_date")}">\${O.locationAndDate}</div>
                <div style="font-weight: bold; font-size: 0.92em;">\${O.rightSignatureTitle}</div>
                <div style="height: 55px;"></div>
                <div style="font-weight: bold; font-size: 0.95em;">\${O.rightSignatureName}</div>
              </td>
            </tr>
          </table>
          \`:\`
          <div style="margin-top: 22px; page-break-inside: avoid;">
            <!-- ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 14px;">
              <div style="text-align: center; min-width: 250px; \${Re("right_signature")}">
                <div style="font-size: 0.88em; color: #475569; margin-bottom: 4px; white-space: pre-line; \${Re("location_date")}">\${O.locationAndDate}</div>
                <div style="font-weight: bold; font-size: 0.92em;">\${O.rightSignatureTitle}</div>
                <div style="height: 48px;"></div>
                <div style="font-weight: bold; font-size: 0.95em;">\${O.rightSignatureName}</div>
              </div>
            </div>
            <!-- ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា -->
            <div style="display: flex; justify-content: flex-start;">
              <div style="text-align: center; min-width: 230px; \${Re("left_signature")}">
                <div style="font-weight: bold; font-size: 0.92em; white-space: pre-line;">\${O.leftSignatureTitle}</div>
                \${V.showStampBox?'<div class="stamp-box" style="margin: 8px auto;">ទីតាំងប្រោះត្រា</div>':'<div style="height: 48px;"></div>'}
                <div style="font-weight: bold; font-size: 0.95em;">\${O.leftSignatureName||"..........................................."}</div>
              </div>
            </div>
          </div>
          \`:""}

        \${O.footerNote?\`
          <div style="margin-top: 20px; padding-top: 8px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.78em; color: #94a3b8; \${Re("notes_section")}">
            \${O.footerNote}
          </div>
        \`:""}
      </body>
      </html>
    \`},Pe=()=>{const ne=Ut(),_e=window.open("","_blank","width=1000,height=1100");if(!_e){alert("សូមអនុញ្ញាត Popup នៅក្នុងកម្មវិធីជ្រាវជ្រោល (Browser) ដើម្បីបើកផ្ទាំង PDF!");return}_e.document.open(),_e.document.write(ne),_e.document.close(),setTimeout(()=>{_e.focus(),_e.print()},400),u&&u("បានបើកផ្ទាំងបោះពុម្ព និងទាញយកជា PDF រួចរាល់!")};`,
  `        <!-- SIGNATURES SECTION (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) -->
        \${V.showSignatures?V.signaturesLayout==="side_by_side"?\`
          <table class="signatures-table" style="\${s==="seating_chart"?"margin-top: 6px;":""}">
            <tr>
              <td style="\${Re("left_signature")}">
                <div style="font-weight: bold; font-size: 0.92em; white-space: pre-line;">\${O.leftSignatureTitle}</div>
                \${V.showStampBox?(s==="seating_chart"?'<div class="stamp-box" style="padding: 5px; margin: 3px auto;">ទីតាំងប្រោះត្រា</div>':'<div class="stamp-box">ទីតាំងប្រោះត្រា</div>'):\`<div style="height: \${s==="seating_chart"?"24px":"55px"};"></div>\`}
                <div style="font-weight: bold; font-size: 0.95em;">\${O.leftSignatureName||"..........................................."}</div>
              </td>
              <td style="\${Re("right_signature")}">
                <div style="font-size: 0.88em; color: #475569; margin-bottom: \${s==="seating_chart"?"2px":"4px"}; white-space: pre-line; \${Re("location_date")}">\${O.locationAndDate}</div>
                <div style="font-weight: bold; font-size: 0.92em;">\${O.rightSignatureTitle}</div>
                <div style="height: \${s==="seating_chart"?"24px":"55px"};"></div>
                <div style="font-weight: bold; font-size: 0.95em;">\${O.rightSignatureName}</div>
              </td>
            </tr>
          </table>
          \`:\`
          <div style="margin-top: \${s==="seating_chart"?"8px":"22px"}; page-break-inside: avoid;">
            <!-- ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: \${s==="seating_chart"?"6px":"14px"};">
              <div style="text-align: center; min-width: 250px; \${Re("right_signature")}">
                <div style="font-size: 0.88em; color: #475569; margin-bottom: \${s==="seating_chart"?"2px":"4px"}; white-space: pre-line; \${Re("location_date")}">\${O.locationAndDate}</div>
                <div style="font-weight: bold; font-size: 0.92em;">\${O.rightSignatureTitle}</div>
                <div style="height: \${s==="seating_chart"?"24px":"48px"};"></div>
                <div style="font-weight: bold; font-size: 0.95em;">\${O.rightSignatureName}</div>
              </div>
            </div>
            <!-- ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា -->
            <div style="display: flex; justify-content: flex-start;">
              <div style="text-align: center; min-width: 230px; \${Re("left_signature")}">
                <div style="font-weight: bold; font-size: 0.92em; white-space: pre-line;">\${O.leftSignatureTitle}</div>
                \${V.showStampBox?(s==="seating_chart"?'<div class="stamp-box" style="padding: 5px; margin: 3px auto;">ទីតាំងប្រោះត្រា</div>':'<div class="stamp-box" style="margin: 8px auto;">ទីតាំងប្រោះត្រា</div>'):\`<div style="height: \${s==="seating_chart"?"24px":"48px"};"></div>\`}
                <div style="font-weight: bold; font-size: 0.95em;">\${O.leftSignatureName||"..........................................."}</div>
              </div>
            </div>
          </div>
          \`:""}

        \${O.footerNote?\`
          <div style="margin-top: \${s==="seating_chart"?"6px":"20px"}; padding-top: \${s==="seating_chart"?"4px":"8px"}; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.78em; color: #94a3b8; \${Re("notes_section")}">
            \${O.footerNote}
          </div>
        \`:""}
        \${s==="seating_chart"?\`</div></div><div id="oi-page-probe" style="position:fixed;left:-9999px;top:0;width:1px;height:\${seatingMaxMm};pointer-events:none;"></div><script>${oiFitScript.replace(/\n/g, " ")}</script>\`:""}
      </body>
      </html>
    \`},Pe=()=>{const ne=Ut(),_e=window.open("","_blank","width=1000,height=1100");if(!_e){alert("សូមអនុញ្ញាត Popup នៅក្នុងកម្មវិធីជ្រាវជ្រោល (Browser) ដើម្បីបើកផ្ទាំង PDF!");return}_e.document.open(),_e.document.write(ne),_e.document.close(),setTimeout(()=>{try{_e.__fitOiOnePage&&_e.__fitOiOnePage()}catch{}_e.focus(),_e.print()},550),u&&u("បានបើកផ្ទាំងបោះពុម្ព និងទាញយកជា PDF រួចរាល់!")};`
);

// 4. Update MCe's Oi invocation defaults to side_by_side header + signatures & 1-page title
replaceExact(
  "MCe_Oi_defaults",
  `        title:"ទាញយក PDF ប្លង់តុសិស្ស (ផ្តេក Landscape · ដូចការបង្ហាញ)",
        initialStyles:{orientation:"landscape",marginSize:"tight",fontSize:"small"},`,
  `        title:"ទាញយក PDF ប្លង់តុសិស្ស (១ ទំព័រ A4 Landscape)",
        initialStyles:{orientation:"landscape",marginSize:"tight",fontSize:"small",headerLayout:"side_by_side",signaturesLayout:"side_by_side"},`
);

// Validate syntax via TypeScript compiler AST parser before writing
const sf = ts.createSourceFile("index-BwPwHqBe.js", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("TS Parse Diagnostics:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("[OK] TypeScript parser verified 0 syntax diagnostics!");

fs.writeFileSync(targetPath, code, "utf8");
console.log("[DONE] Saved patched bundle:", targetPath);
