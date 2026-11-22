const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

// 1. Default showSanitation=false in LCe so Seating Chart A4 PDF matches pure seating screen display
const lceSanOld = `  const[o,c]=y.useState("color");\n  const[d,u]=y.useState(!0);`;
const lceSanNew = `  const[o,c]=y.useState("color");\n  const[d,u]=y.useState(!1);`;
if (!src.includes(lceSanOld)) throw new Error("Missing LCe showSanitation state");
src = src.replace(lceSanOld, lceSanNew);

// 2. Update MCe signature and add sanPdf state
const mceSigOld = `MCe=({teacher:r,students:t,onShowToast:s})=>{
  const[a,n]=y.useState("grid_4x6");`;
const mceSigNew = `MCe=({teacher:r,students:t,onShowToast:s,viewMode:vMode="seating"})=>{
  const[a,n]=y.useState("grid_4x6");
  const[sanPdf,setSanPdf]=y.useState(!1);`;
if (!src.includes(mceSigOld)) throw new Error("Missing MCe signature");
src = src.replace(mceSigOld, mceSigNew);

// 3. Wrap seating header + leadership selectors + classroom stage + committee table conditionally by vMode
const mceReturnOld = `  return e.jsxs("div",{className:"space-y-6",children:[
    e.jsx("input",{ref:fileRef,type:"file",accept:"image/*",className:"hidden",onChange:ev=>{var fs=ev.target.files;if(fs&&fs[0]&&targetSeatRef.current){compressAndSave(fs[0],targetSeatRef.current)}}}),
    e.jsxs("div",{className:"bg-white p-5 sm:p-7 rounded-[28px] border border-slate-200 shadow-xs space-y-5",children:[`;

const mceReturnNew = `  const committeeHtml=sanPdf?\`<div style="font-family:'Kantumruy Pro','Siemreap',sans-serif;font-size:10pt;color:#0f172a;">
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
  </div>\`:"";

  return e.jsxs("div",{className:"space-y-6",children:[
    e.jsx("input",{ref:fileRef,type:"file",accept:"image/*",className:"hidden",onChange:ev=>{var fs=ev.target.files;if(fs&&fs[0]&&targetSeatRef.current){compressAndSave(fs[0],targetSeatRef.current)}}}),
    vMode==="seating"&&e.jsxs(e.Fragment,{children:[
    e.jsxs("div",{className:"bg-white p-5 sm:p-7 rounded-[28px] border border-slate-200 shadow-xs space-y-5",children:[`;

if (!src.includes(mceReturnOld)) throw new Error("Missing mceReturnOld");
src = src.replace(mceReturnOld, mceReturnNew);

// 4. Remove the 3 leadership select boxes from vMode==="seating" card
const leadershipBlockOld = `      e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80",children:[
        e.jsxs("div",{className:"bg-white p-2.5 rounded-xl border border-amber-200 space-y-1",children:[
          e.jsx("label",{className:"text-[11px] font-extrabold text-amber-900 block",children:"👑 ប្រធានថ្នាក់"}),
          e.jsxs("select",{value:q.presidentId||"",onChange:Ze=>ge(Number(Ze.target.value)),className:"w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-amber-400",children:[
            e.jsx("option",{value:"",children:"-- ជ្រើសរើសប្រធានថ្នាក់ --"}),
            de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`pres-\${Ze.id}\`))
          ]})
        ]}),
        e.jsxs("div",{className:"bg-white p-2.5 rounded-xl border border-indigo-200 space-y-1",children:[
          e.jsx("label",{className:"text-[11px] font-extrabold text-indigo-900 block",children:"🎖️ អនុប្រធានទី ១"}),
          e.jsxs("select",{value:q.vicePresident1Id||"",onChange:Ze=>Xe(Number(Ze.target.value)),className:"w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-indigo-400",children:[
            e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ១ --"}),
            de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`vp1-\${Ze.id}\`))
          ]})
        ]}),
        e.jsxs("div",{className:"bg-white p-2.5 rounded-xl border border-cyan-200 space-y-1",children:[
          e.jsx("label",{className:"text-[11px] font-extrabold text-cyan-900 block",children:"🎖️ អនុប្រធានទី ២"}),
          e.jsxs("select",{value:q.vicePresident2Id||"",onChange:Ze=>Oe(Number(Ze.target.value)),className:"w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-cyan-400",children:[
            e.jsx("option",{value:"",children:"-- ជ្រើសរើសអនុប្រធានទី ២ --"}),
            de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`vp2-\${Ze.id}\`))
          ]})
        ]})
      ]}),`;

if (!src.includes(leadershipBlockOld)) throw new Error("Missing leadershipBlockOld");
src = src.replace(leadershipBlockOld, "");

// 5. Replace the inline sanitation/committee card after stageRef with closing Fragment for seating + full dedicated vMode==="committee" view + its Oi PDF modal
const sanBlockOld = `    e.jsxs("div",{className:"bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200 shadow-xs space-y-5",children:[
      e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4",children:[
        e.jsxs("div",{className:"space-y-1",children:[
          e.jsxs("h3",{className:"text-lg font-extrabold text-slate-900 flex items-center gap-2",children:[
            e.jsx(qa,{className:"w-5 h-5 text-emerald-700"}),
            e.jsx("span",{children:"តារាងគណៈកម្មាធិការ និងវេនអនាម័យប្រចាំសប្តាហ៍"})
          ]}),
          e.jsxs("p",{className:"text-xs text-slate-500 font-medium",children:["រចនាសម្ព័ន្ធដឹកនាំ និងអនុសាខាទាំង ៦ · ",r.grade||"ថ្នាក់ទី ៦"]})
        ]}),
        e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[
          e.jsxs("button",{type:"button",onClick:Ie,className:"px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5 cursor-pointer",children:[
            e.jsx(Jr,{className:"w-3.5 h-3.5 text-amber-600"}),
            e.jsx("span",{children:"ចែក ៦ សាខាស្វ័យប្រវត្តិ"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>D(!0),className:"px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 cursor-pointer",children:[
            e.jsx(x0,{className:"w-3.5 h-3.5 text-amber-300"}),
            e.jsx("span",{children:"កំណត់គណៈកម្មាធិការលម្អិត"})
          ]})
        ]})
      ]}),
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

const sanBlockNew = `    ]}),
    vMode==="committee"&&e.jsxs("div",{className:"bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200 shadow-xs space-y-6",children:[
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
    ]}),
    sanPdf&&(()=>{
      const Ze=r.academicYear||"២០២៥ - ២០២៦";
      return e.jsx(Oi,{
        isOpen:sanPdf,
        onClose:()=>setSanPdf(!1),
        documentType:"sanitation_committee",
        title:"ទាញយក PDF តារាងគណៈកម្មាធិការ និងវេនអនាម័យប្រចាំសប្តាហ៍",
        initialStyles:{orientation:"landscape",marginSize:"tight",fontSize:"small"},
        initialHeader:{
          docTitle:"តារាងគណៈកម្មាធិការ និងវេនអនាម័យប្រចាំសប្តាហ៍",
          docSubtitle:\`ថ្នាក់ទី \${r.grade||"៦"} · ឆ្នាំសិក្សា \${Ze}\`,
          schoolName:r.school||"សាលាបឋមសិក្សាគំរូ",
          teacherName:r.name||"",
          gradeLevel:r.grade||"ថ្នាក់ទី ៦",
          academicYear:Ze,
          officeInfo:"ការិយាល័យអប់រំ យុវជន និងកីឡា"
        },
        customTableHtml:committeeHtml,
        onShowToast:s
      });
    })(),`;

if (!src.includes(sanBlockOld)) throw new Error("Missing sanBlockOld");
src = src.replace(sanBlockOld, sanBlockNew);

// 6. Add dedicated separate tab button in sec3 & render MCe with viewMode="committee"
const parentTabOld = `[{id:"committee",label:"គណៈកម្មការគ្រប់គ្រងថ្នាក់ (គ. គ. ថ.)",icon:Sn},{id:"seating",label:"ប្លង់តុ & ការរៀបចំកន្លែងអង្គុយ",icon:gy},{id:"rules",label:"បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន",icon:qa},{id:"inventory",label:\`សារពើភណ្ឌថ្នាក់រៀន (\${T.length})\`,icon:Lg},{id:"materials",label:"ផ្ទាំងសម្ភារ & សន្លឹកតុបតែងថ្នាក់",icon:Jr}]`;
const parentTabNew = `[{id:"committee",label:"គណៈកម្មការគ្រប់គ្រងថ្នាក់ (គ. គ. ថ.)",icon:Sn},{id:"seating",label:"ប្លង់តុសិស្ស & កន្លែងអង្គុយ",icon:gy},{id:"sanitation_committee",label:"តារាងគណៈកម្មាធិការ និងវេនអនាម័យប្រចាំសប្តាហ៍",icon:Is},{id:"rules",label:"បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន",icon:qa},{id:"inventory",label:\`សារពើភណ្ឌថ្នាក់រៀន (\${T.length})\`,icon:Lg},{id:"materials",label:"ផ្ទាំងសម្ភារ & សន្លឹកតុបតែងថ្នាក់",icon:Jr}]`;

if (!src.includes(parentTabOld)) throw new Error("Missing parentTabOld");
src = src.replace(parentTabOld, parentTabNew);

const parentRenderOld = `ue==="seating"&&e.jsx("div",{className:"space-y-6",children:e.jsx(MCe,{teacher:r,students:n,onShowToast:F})})`;
const parentRenderNew = `ue==="seating"&&e.jsx("div",{className:"space-y-6",children:e.jsx(MCe,{teacher:r,students:n,onShowToast:F,viewMode:"seating"})}),ue==="sanitation_committee"&&e.jsx("div",{className:"space-y-6",children:e.jsx(MCe,{teacher:r,students:n,onShowToast:F,viewMode:"committee"})})`;

if (!src.includes(parentRenderOld)) throw new Error("Missing parentRenderOld");
src = src.replace(parentRenderOld, parentRenderNew);

fs.writeFileSync(FILE, src, "utf8");

const sf = ts.createSourceFile(FILE, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("Parse diagnostics:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("SUCCESS: patched split sanitation committee tab v120, 0 parse diagnostics, length:", src.length);
