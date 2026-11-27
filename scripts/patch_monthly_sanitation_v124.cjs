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

// 1. Update RCe: sync state with prop n, compute mShift from monthlyRotation, stop daily rotation in Y(q)
replaceExact(
  "RCe_sync_state",
  `const[c,d]=y.useState("leadership"),[u,h]=y.useState(n),[m,w]=y.useState(""),[j,N]=y.useState(1),[B,A]=y.useState(!1);if(!r)return null;`,
  `const[c,d]=y.useState("leadership"),[u,h]=y.useState(n),[m,w]=y.useState(""),[j,N]=y.useState(1),[B,A]=y.useState(!1);y.useEffect(()=>{n&&h(n)},[n]);if(!r)return null;`
);

replaceExact(
  "RCe_monthly_rotation_Y",
  `Z=[{key:"mon",label:"ចន្ទ"},{key:"tue",label:"អង្គារ"},{key:"wed",label:"ពុធ"},{key:"thu",label:"ព្រហស្បតិ៍"},{key:"fri",label:"សុក្រ"},{key:"sat",label:"សៅរ៍"}],Y=(q,ae)=>(q+ae)%6+1,U=`,
  `Z=[{key:"mon",label:"ចន្ទ"},{key:"tue",label:"អង្គារ"},{key:"wed",label:"ពុធ"},{key:"thu",label:"ព្រហស្បតិ៍"},{key:"fri",label:"សុក្រ"},{key:"sat",label:"សៅរ៍"}],mShift=((Number(u.monthlyRotation)||0)%6+6)%6,Y=q=>(q+mShift)%6+1,setMonthRot=mIdx=>{const nxt=((Number(mIdx)||0)%6+6)%6,ae={...u,monthlyRotation:nxt};h(ae),i&&i(ae),l&&l(\`🔄 បានប្តូរទៅវេនប្រចាំខែទី \${fr(nxt+1)} (មួយខែដូរសកម្មភាពម្តង)!\`)},U=`
);

replaceExact(
  "RCe_weekly_duty_banner",
  `e.jsxs("p",{className:"text-xs sm:text-sm text-slate-600 leading-relaxed",children:["អនុវត្តតាម ",e.jsx("strong",{children:"គំរូស្ដង់ដារក្រសួងអប់រំ យុវជន និងកីឡា"}),"៖ អនុសាខាទាំង ៦ ឆ្លាស់វេនគ្នារៀងរាល់ថ្ងៃពីថ្ងៃចន្ទ ដល់ថ្ងៃសៅរ៍ លើសកម្មភាពទាំង ៦ ចម្បង។"]})]}),`,
  `e.jsxs("p",{className:"text-xs sm:text-sm text-slate-600 leading-relaxed",children:["អនុវត្តតាម ",e.jsx("strong",{children:"វេនប្រចាំខែ (មួយខែដូរសកម្មភាពម្តង)"}),"៖ អនុវត្តមិនប្តូររាល់ថ្ងៃទេ អនុសាខាមួយដឹកនាំសកម្មភាពប្រចាំថ្ងៃមួយថេរពេញ ១ ខែ (ចន្ទ ដល់ សៅរ៍)។"]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-1.5 pt-1",children:[e.jsxs("span",{className:"text-xs font-extrabold text-purple-900 mr-1",children:["📅 វេនប្រចាំខែទី ",fr(mShift+1),"៖"]}),[0,1,2,3,4,5].map(mIdx=>e.jsxs("button",{type:"button",onClick:()=>setMonthRot(mIdx),className:\`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer \${mShift===mIdx?"bg-purple-900 text-white shadow-xs":"bg-white text-slate-700 border border-purple-200 hover:bg-purple-100"}\`,children:["ខែទី ",fr(mIdx+1)]},mIdx)),e.jsx("button",{type:"button",onClick:()=>setMonthRot((mShift+1)%6),className:"ml-auto px-3 py-1 rounded-lg text-[11px] font-extrabold bg-amber-500 hover:bg-amber-600 text-white transition cursor-pointer shadow-2xs",children:"🔄 ដូរវេនខែបន្ទាប់"})]})]}),`
);

replaceExact(
  "RCe_print_preview_title",
  `e.jsx("div",{className:"text-center font-moul text-xs text-red-600",children:"តារាងផែនការសកម្មភាពប្រចាំសប្តាហ៍របស់អនុសាខាទាំង៦"}),`,
  `e.jsxs("div",{className:"text-center font-moul text-xs text-red-600",children:["តារាងផែនការសកម្មភាពប្រចាំសប្តាហ៍របស់អនុសាខាទាំង៦ · វេនខែទី ",fr(mShift+1)," (មួយខែដូរម្តង)"]}),`
);

// 2. Update MCe: mShift, Ce (sanitationDuty), committeeHtml, vMode==="committee", and RCe prop names
replaceExact(
  "MCe_mShift_and_Ce",
  `  const Ce=y.useMemo(()=>["ច័ន្ទ","អង្គារ","ពុធ","ព្រហស្បតិ៍","សុក្រ","សៅរ៍"].map((Ve,kt)=>{
    const ct=kt%6+1,jr=(q.subBranches[ct]||[]).map(Re=>{var Ge;return(Ge=de.find(xt=>xt.id===Re))==null?void 0:Ge.name}).filter(Boolean),vr=dm[kt%dm.length],he=jr[0]||"ប្រធានអនុសាខា";
    return{day:Ve,teamName:\`អនុសាខាទី \${ct} (\${vr.name})\`,leader:he,members:jr.length>0?jr:["សមាជិកទាំងអស់ក្នុងអនុសាខា"],tasks:vr.description||vr.name};
  }),[q.subBranches,de]);`,
  `  const mShift=((Number(q.monthlyRotation)||0)%6+6)%6;
  const setMonthRot=mIdx=>{const nxt=((Number(mIdx)||0)%6+6)%6;Q({...q,monthlyRotation:nxt});s(\`🔄 បានប្តូរវេនសកម្មភាពប្រចាំខែទៅវេនទី \${fr(nxt+1)} (មួយខែដូរម្តង)!\`)};
  const Ce=y.useMemo(()=>dm.map((vr,kt)=>{
    const ct=(kt+mShift)%6+1,jr=(q.subBranches[ct]||[]).map(Re=>{var Ge;return(Ge=de.find(xt=>xt.id===Re))==null?void 0:Ge.name}).filter(Boolean),he=jr[0]||"ប្រធានអនុសាខា";
    return{day:"ចន្ទ - សៅរ៍",teamName:\`អនុសាខាទី \${fr(ct)} (\${vr.name})\`,leader:he,members:jr.length>0?jr:["សមាជិកទាំងអស់ក្នុងអនុសាខា"],tasks:vr.description||vr.name};
  }),[q.subBranches,de,mShift]);`
);

replaceExact(
  "MCe_committeeHtml_monthly",
  `    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
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
    </table>`,
  `    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;">
      \${[1,2,3,4,5,6].map(bn=>{
        const mems=(q.subBranches[bn]||[]).map(id=>de.find(u=>u.id===id)).filter(Boolean);
        const pal=wm[bn-1]||wm[0];
        const act=dm[(bn-1-mShift+60)%6]||dm[0];
        return \`<div style="border:1.5px solid \${pal.hex};border-radius:9px;overflow:hidden;background:\${pal.hexBg};break-inside:avoid;">
          <div style="background:\${pal.hex};color:#ffffff;padding:5px 8px;font-weight:800;font-size:8.5pt;">អនុសាខាទី \${fr(bn)} · \${escS(act.name)} (\${fr(mems.length)} នាក់)</div>
          <div style="padding:6px 8px;font-size:8.5pt;line-height:1.5;background:#ffffff;">\${mems.length?mems.map((st,ix)=>\`\${fr(ix+1)}. \${escS(st.name)}\`).join("<br/>"):"(មិនទាន់មានសមាជិក)"}</div>
        </div>\`;
      }).join("")}
    </div>
    <div style="margin-bottom:6px;padding:5px 10px;border-radius:7px;background:#ecfdf5;border:1px solid #6ee7b7;font-size:8.5pt;font-weight:700;color:#065f46;text-align:center;">
      📅 វេនប្រចាំខែទី \${fr(mShift+1)} · អនុសាខានីមួយៗដឹកនាំតាមសកម្មភាពប្រចាំថ្ងៃថេរពេញ ១ ខែ (ចន្ទ–សៅរ៍) ដោយមួយខែទើបដូរសកម្មភាពគ្នាម្តង
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
        const b=(ix+mShift)%6+1,p=wm[b-1]||wm[0];
        return \`<tr style="background:\${ix%2===0?"#ffffff":"#f8fafc"};"><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;font-weight:700;">\${fr(ix+1)}</td><td style="border:1px solid #cbd5e1;padding:5px;font-weight:700;color:#0f172a;">\${escS(act.name)}</td>\${[0,1,2,3,4,5].map(()=>\`<td style="border:1px solid #cbd5e1;padding:5px;text-align:center;background:\${p.hexBg};color:\${p.hexTxt};font-weight:800;">អនុសាខាទី \${fr(b)}</td>\`).join("")}</tr>\`;
      }).join("")}</tbody>
    </table>`
);

replaceExact(
  "MCe_committee_subtitle_and_controls",
  `          e.jsxs("p",{className:"text-xs text-sky-50 font-semibold",children:["រចនាសម្ព័ន្ធដឹកនាំ អនុសាខាទាំង ៦ និងវេនសម្អាតប្រចាំថ្ងៃ · ",r.grade||"ថ្នាក់ទី ៦"]})`,
  `          e.jsxs("p",{className:"text-xs text-sky-50 font-semibold",children:["រចនាសម្ព័ន្ធដឹកនាំ អនុសាខាទាំង ៦ · ដឹកនាំសកម្មភាពថេរពេញ ១ ខែ (មួយខែទើបដូរសកម្មភាពគ្នាម្តង) · ",r.grade||"ថ្នាក់ទី ៦"]})`
);

replaceExact(
  "MCe_committee_cards_and_table",
  `      e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:
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
      })`,
  `      e.jsxs("div",{className:"p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3",children:[
        e.jsxs("div",{className:"space-y-0.5",children:[
          e.jsxs("div",{className:"text-xs font-extrabold text-emerald-950 flex items-center gap-1.5",children:[
            e.jsx("span",{children:"📅 វេនអនាម័យប្រចាំខែទី "}),
            e.jsx("span",{className:"px-2 py-0.5 rounded-lg bg-emerald-600 text-white",children:fr(mShift+1)}),
            e.jsx("span",{className:"text-emerald-800",children:"(មួយខែទើបដូរសកម្មភាពគ្នាម្តង)"})
          ]}),
          e.jsx("p",{className:"text-[11px] text-slate-600 font-medium",children:"អនុសាខានីមួយៗដឹកនាំតាមសកម្មភាពប្រចាំថ្ងៃថេរពេញ ១ ខែ (ចន្ទ ដល់ សៅរ៍) មិនប្តូរវេនរាល់ថ្ងៃឡើយ"})
        ]}),
        e.jsxs("div",{className:"flex flex-wrap items-center gap-1.5",children:[
          [0,1,2,3,4,5].map(mIdx=>e.jsxs("button",{type:"button",onClick:()=>setMonthRot(mIdx),className:\`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer \${mShift===mIdx?"bg-emerald-700 text-white shadow-xs":"bg-white text-slate-700 border border-emerald-200 hover:bg-emerald-100"}\`,children:["ខែទី ",fr(mIdx+1)]},mIdx)),
          e.jsx("button",{type:"button",onClick:()=>setMonthRot((mShift+1)%6),className:"px-3 py-1.5 rounded-xl text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition cursor-pointer shadow-xs",children:"🔄 ដូរសកម្មភាពខែបន្ទាប់"})
        ]})
      ]}),

      e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:
        dm.map((Ze,Ve)=>{
          const kt=Ve+1,ct=wm[Ve]||wm[0],act=dm[(kt-1-mShift+60)%6]||Ze,jr=(q.subBranches[kt]||[]).map(he=>de.find(Re=>Re.id===he)).filter(Boolean);
          return e.jsxs("div",{className:\`rounded-2xl border-2 \${ct.border} \${ct.lightBg} overflow-hidden shadow-xs\`,children:[
            e.jsxs("div",{className:\`\${ct.headerBg} \${ct.headerText} px-4 py-2.5 flex items-center justify-between gap-2\`,children:[
              e.jsxs("span",{className:"font-extrabold text-xs truncate",children:["អនុសាខាទី ",fr(kt)," · ",act.name]}),
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
              const bNum=(Ve+mShift)%6+1,cb=wm[bNum-1]||wm[0];
              return e.jsxs("tr",{className:"hover:bg-sky-50 transition",children:[
                e.jsx("td",{className:"p-2.5 text-center font-extrabold text-emerald-700 border-r border-slate-200",children:fr(Ve+1)}),
                e.jsx("td",{className:"p-2.5 font-extrabold text-slate-900 border-r border-slate-200",children:Ze.name}),
                [0,1,2,3,4,5].map(jr=>e.jsx("td",{className:\`p-2 text-center \${jr<5?"border-r border-slate-200":""}\`,children:
                  e.jsx("span",{className:\`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-extrabold \${cb.badge}\`,children:\`អនុសាខាទី \${fr(bNum)}\`})
                },\`cell-\${Ve}-\${jr}\`))
              ]},\`task-row-\${Ve}\`);
            })
          })
        ]})
      })`
);

replaceExact(
  "MCe_sanPdf_subtitle",
  `docSubtitle:\`ថ្នាក់ទី \${r.grade||"៦"} · ឆ្នាំសិក្សា \${Ze}\`,`,
  `docSubtitle:\`ថ្នាក់ទី \${r.grade||"៦"} · វេនប្រចាំខែទី \${fr(mShift+1)} (មួយខែដូរសកម្មភាពម្តង) · ឆ្នាំសិក្សា \${Ze}\`,`
);

replaceExact(
  "MCe_RCe_props",
  `e.jsx(RCe,{isOpen:A,onClose:()=>D(!1),teacher:r,students:t||[],committeeData:q,onSaveCommittee:Q,onAutoOptimizeSeating:R,onShowToast:s}),`,
  `e.jsx(RCe,{isOpen:A,onClose:()=>D(!1),teacher:r,students:t||[],committeeData:q,onSaveCommitteeData:Q,onOptimizeSeatingWithNeeds:R,onShowToast:s}),`
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
