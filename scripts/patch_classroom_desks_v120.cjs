const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

const lcePos = src.indexOf("LCe=");
if (lcePos === -1) throw new Error("Missing LCe component");

let nextComponentPos = -1;
for (const cand of ["RCe=", "Oi=", "WCe=", "QC_"]) {
  const p = src.indexOf(cand, lcePos + 10);
  if (p !== -1 && (nextComponentPos === -1 || p < nextComponentPos)) {
    nextComponentPos = p;
  }
}
if (nextComponentPos === -1) nextComponentPos = lcePos + 35000;

console.log("LCe found at index:", lcePos, "Next component at:", nextComponentPos);

// We replace LCe with a robust minified/e.jsx version that includes student photos and gorgeous UI
const upgradedLCe = `LCe=({isOpen:r,onClose:t,teacher:s,gridDesks:a,sanitationDuty:n})=>{
  const [i,l]=y.useState("landscape");
  const [o,c]=y.useState("color");
  const [d,u]=y.useState(!0);
  const [h,m]=y.useState(!0);
  const [w,j]=y.useState(s.academicYear||"២០២៥ - ២០២៦");
  const [N,B]=y.useState("០៤");
  const [A,D]=y.useState(()=>kf(new Date,{location:s.school||"កំពង់ឆ្នាំង",format:"combined_multiline"}));
  const [photos, setPhotos] = y.useState(()=>{
    try {
      const saved = localStorage.getItem("student_custom_photos_v120");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [editingStudent, setEditingStudent] = y.useState(null);
  const [customPhotoInput, setCustomPhotoInput] = y.useState("");
  const T=y.useRef(null);

  if(!r)return null;

  const savePhoto = (studentId, url) => {
    const updated = { ...photos, [studentId]: url };
    setPhotos(updated);
    try {
      localStorage.setItem("student_custom_photos_v120", JSON.stringify(updated));
    } catch {}
    setEditingStudent(null);
    setCustomPhotoInput("");
  };

  const getStudentPhoto = (student) => {
    if (!student) return "";
    if (photos[student.id]) return photos[student.id];
    if (photos[student.name]) return photos[student.name];
    if (student.photoUrl) return student.photoUrl;
    if (student.avatar) return student.avatar;
    return "";
  };

  const E=Math.max(...a.map(U=>U.colIndex||1),1);
  const X=Math.max(...a.map(U=>U.rowIndex||1),1);
  let H=0,O_count=0,z=0,M=0,V=0;
  a.forEach(U=>{
    [U.seatLeft,U.seatRight].forEach(q=>{
      if(q.name!=="(ទំនេរ)"&&q.id>=0) {
        H++;
        q.gender==="ស្រី"?z++:O_count++;
        q.needsEyeCare&&M++;
        (q.isLeader||q.isTopStudent)&&V++;
      }
    });
  });

  const sampleAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300"
  ];

  const G=()=>{
    const U=o==="bw",q=i==="landscape",ae=ac();
    nc();
    return \`<!DOCTYPE html><html lang="km"><head><meta charset="utf-8"/><title>ប្លង់តុថ្នាក់រៀន_\${s.grade}_\${s.school}_A4</title>\${Oo()}<style>
      @page { size: A4 \${q?"landscape":"portrait"}; margin: 5mm 8mm 5mm 8mm; }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: '\${ae}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif; font-size: 8.5pt; line-height: 1.25; color: #000; background: #ffffff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page-container { width: 100%; max-width: 100%; margin: 0 auto; padding: 2px; }
      .font-moul { font-family: 'Moul', cursive, serif; }
      .title-banner { text-align: center; margin: 3px 0 6px 0; padding: 4px 0; border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; background: \${U?"#f3f4f6":"#f0fdf4"}; }
      .title-banner h2 { font-size: 11pt; font-weight: 700; color: \${U?"#000":"#14532d"}; letter-spacing: 0.5px; }
      .info-bar { display: flex; justify-content: space-between; align-items: center; font-size: 8pt; font-weight: 600; margin-bottom: 4px; padding: 0 4px; }
      .front-stage { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 6px; padding: 4px 10px; background: \${U?"#f3f4f6":"#e0e7ff"}; border: 1.5px solid \${U?"#000":"#4338ca"}; border-radius: 6px; }
      .board-box { flex: 1; text-align: center; font-weight: 700; font-size: 9pt; color: \${U?"#000":"#1e1b4b"}; }
      .teacher-desk-box { border: 1.5px dashed \${U?"#000":"#4338ca"}; background: #ffffff; padding: 3px 10px; border-radius: 4px; font-size: 8pt; font-weight: 700; text-align: center; }
      .desks-grid { display: grid; grid-template-columns: repeat(\${Math.min(E,6)}, 1fr); gap: 5px; margin-bottom: 6px; }
      .desk-card { border: 1.5px solid #000; border-radius: 5px; background: #fff; overflow: hidden; page-break-inside: avoid; }
      .desk-card-header { background: \${U?"#e5e7eb":"#f1f5f9"}; padding: 2px 4px; font-size: 7.5pt; font-weight: 700; display: flex; justify-content: space-between; border-bottom: 1px solid #000; color: #000; }
      .desk-card-body { display: grid; grid-template-columns: 1fr 1fr; }
      .seat-box { padding: 3px 4px; min-height: 42px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid #000; align-items: flex-start; }
      .seat-box:last-child { border-right: none; }
      .seat-content { display: flex; align-items: center; gap: 4px; width: 100%; }
      .seat-avatar { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1px solid #334155; flex-shrink: 0; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 8pt; font-weight: bold; }
      .seat-info { min-width: 0; flex: 1; }
      .seat-num { font-size: 6.5pt; font-weight: 700; color: #4b5563; }
      .seat-name { font-size: 7.5pt; font-weight: 700; color: #000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .seat-tag { font-size: 6pt; font-weight: 600; display: inline-block; color: #1f2937; }
      .seat-eyecare { background: \${U?"#e5e7eb":"#fef3c7"}; color: \${U?"#000":"#92400e"}; padding: 0 2px; border-radius: 2px; }
      .summary-table, .sanitation-table { width: 100%; border-collapse: collapse; margin-top: 4px; font-size: 7.5pt; }
      .summary-table th, .summary-table td, .sanitation-table th, .sanitation-table td { border: 1px solid #000; padding: 2.5px 4px; text-align: left; }
      .summary-table th, .sanitation-table th { background: \${U?"#e5e7eb":"#f8fafc"}; font-weight: 700; text-align: center; }
    </style></head><body><div class="page-container">
      <div style="text-align: center; margin-bottom: 6px;">
        <div class="font-moul" style="font-size: 10pt; font-weight: bold; color: #0f172a;">ព្រះរាជាណាចក្រកម្ពុជា</div>
        <div class="font-moul" style="font-size: 8.5pt; font-weight: bold; color: #1e293b; margin-top: 1px;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
        <div style="font-size: 8pt; letter-spacing: 2px; margin-top: 1px; font-weight: bold; color: #334155;">— ༺ ៚ ༻ —</div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px; border-bottom: 2px solid #0f172a; padding-bottom: 4px;">
        <div style="text-align: left;">
          <div style="font-size: 8.5pt; font-weight: 700; color: #0f172a;">ការិយាល័យអប់រំ យុវជន និងកីឡា</div>
          <div style="font-size: 9pt; font-weight: 700; color: #1e1b4b; margin-top: 1px;">សាលារៀន៖ <span>\${s.school||"សាលារៀនគំរូ"}</span></div>
        </div>
        <div style="text-align: right; font-size: 8pt; color: #334155;">
          <div>ថ្នាក់ទទួលបន្ទុក៖ <b>\${s.grade||"ថ្នាក់ទី ៤A"}</b> | បន្ទប់លេខ៖ <b>\${fr(N)}</b></div>
          <div>គ្រូបន្ទុកថ្នាក់៖ <b>\${s.name}</b> | ឆ្នាំសិក្សា៖ <b>\${s.academicYear||w}</b></div>
        </div>
      </div>
      <div class="title-banner"><h2 class="font-moul">ប្លង់តុ និងការរៀបចំថ្នាក់រៀន (\${fr(E)} ជួរទទឹង × \${fr(X)} ជូរបណ្តាយ • មានរូបថតសិស្ស)</h2></div>
      <div class="info-bar">
        <div>គ្រូបន្ទុកថ្នាក់៖ <b>\${s.name||"លោកគ្រូ / អ្នកគ្រូ"}</b></div>
        <div>ឆ្នាំសិក្សា៖ <b>\${s.academicYear||w}</b></div>
        <div>ចំនួនតុ៖ <b>\${fr(a.length)} តុ (សិស្ស \${fr(H)} នាក់: ស្រី \${fr(z)} នាក់)</b></div>
      </div>
      <div class="front-stage">
        <div class="board-box">▲ [ ក្តារខៀន / SMART BOARD INTERACTIVE DISPLAY 86" ] ▲</div>
        <div class="teacher-desk-box">[ តុគ្រូបង្រៀន: \${s.name} ]</div>
      </div>
      <div class="desks-grid">
        \${a.map(ie=>{
          const re=ie.seatLeft, Q=ie.seatRight;
          const R=re.name==="(ទំនេរ)"||re.id<0, J=Q.name==="(ទំនេរ)"||Q.id<0;
          const pLeft = getStudentPhoto(re);
          const pRight = getStudentPhoto(Q);
          return \`<div class="desk-card">
            <div class="desk-card-header">
              <span><b>\${ie.deskLabel}</b></span>
              <span>តុលេខ \${fr(ie.colIndex+(ie.rowIndex-1)*E)}</span>
            </div>
            <div class="desk-card-body">
              <div class="seat-box">
                \${R?\`<div class="seat-num"># -</div><div class="seat-name" style="color:#9ca3af;font-style:italic;">(ទំនេរ)</div>\`: \`<div class="seat-content">
                  \${pLeft?\`<img src="\${pLeft}" class="seat-avatar" />\`:\`<div class="seat-avatar">\${re.gender==="ស្រី"?"👧":"👦"}</div>\`}
                  <div class="seat-info">
                    <div class="seat-num">#\${fr(re.rollNo||re.id)} (\${re.gender==="ស្រី"?"ស":"ប"})</div>
                    <div class="seat-name" title="\${re.name}">\${re.name}</div>
                  </div>
                </div>
                <div>\${re.needsEyeCare?\`<span class="seat-tag seat-eyecare">👓 ភ្នែក</span>\`:re.isLeader?\`<span class="seat-tag">👑 \${re.role}</span>\`:\`<span class="seat-tag">\${re.role||"សមាជិក"}</span>\`}</div>
                \`}
              </div>
              <div class="seat-box">
                \${J?\`<div class="seat-num"># -</div><div class="seat-name" style="color:#9ca3af;font-style:italic;">(ទំនេរ)</div>\`: \`<div class="seat-content">
                  \${pRight?\`<img src="\${pRight}" class="seat-avatar" />\`:\`<div class="seat-avatar">\${Q.gender==="ស្រី"?"👧":"👦"}</div>\`}
                  <div class="seat-info">
                    <div class="seat-num">#\${fr(Q.rollNo||Q.id)} (\${Q.gender==="ស្រី"?"ស":"ប"})</div>
                    <div class="seat-name" title="\${Q.name}">\${Q.name}</div>
                  </div>
                </div>
                <div>\${Q.needsEyeCare?\`<span class="seat-tag seat-eyecare">👓 ភ្នែក</span>\`:Q.isLeader?\`<span class="seat-tag">👑 \${Q.role}</span>\`:\`<span class="seat-tag">\${Q.role||"សមាជិក"}</span>\`}</div>
                \`}
              </div>
            </div>
          </div>\`;
        }).join("")}
      </div>
      \${h?\`<table class="summary-table"><thead><tr><th>សរុបសិស្ស</th><th>សិស្សស្រី</th><th>សិស្សប្រុស</th><th>សរុបតុ</th><th>សិស្សខ្សោយភ្នែក (ជួរមុខ)</th><th>ប្រធាន/សិស្សពូកែ</th></tr></thead><tbody><tr style="text-align: center;"><td style="font-weight: 700;">\${fr(H)} នាក់</td><td>\${fr(z)} នាក់</td><td>\${fr(O_count)} នាក់</td><td style="font-weight: 700;">\${fr(a.length)} តុទ្វេ</td><td>\${fr(M)} នាក់</td><td>\${fr(V)} នាក់</td></tr></tbody></table>\`:""}
      \${d?\`<table class="sanitation-table"><thead><tr><th style="width: 12%;">ថ្ងៃ</th><th style="width: 25%;">ក្រុមទទួលខុសត្រូវ</th><th style="width: 23%;">ប្រធានវេន</th><th style="width: 40%;">ភារកិច្ចអនាម័យចម្បង</th></tr></thead><tbody>\${n.map(ie=>\`<tr><td style="font-weight: 700; text-align: center;">\${ie.day}</td><td><b>\${ie.teamName}</b></td><td>\${ie.leader}</td><td>\${ie.tasks}</td></tr>\`).join("")}</tbody></table>\`:""}
      <div style="margin-top: 14px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 12px; padding-right: 15px;">
          <div style="text-align: center; width: 200px;">
            <div style="font-size: 7.5pt; font-style: italic;">\${A}</div>
            <div style="font-size: 8pt; font-weight: 700; margin-top: 2px;">គ្រូបន្ទុកថ្នាក់</div>
            <div style="height: 36px;"></div>
            <div style="font-size: 8.5pt; font-weight: 700;">\${s.name||"លោកគ្រូ / អ្នកគ្រូ"}</div>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-start; padding-left: 15px;">
          <div style="text-align: center; width: 200px;">
            <div style="font-size: 8pt; font-weight: 700;">បានឃើញ និងឯកភាព</div>
            <div style="font-size: 8pt; font-weight: 700;">នាយកសាលា</div>
            <div style="height: 36px;"></div>
            <div style="font-size: 8.5pt; font-weight: 700;">...................................................</div>
          </div>
        </div>
      </div>
    </div><script>window.onload=function(){setTimeout(function(){window.print();},400);};<\/script></body></html>\`;
  };

  const F=()=>{
    const U=window.open("","_blank","width=1120,height=820");
    if(!U){window.print();return;}
    U.document.open();U.document.write(G());U.document.close();
  };

  const Z=()=>{
    const U=G(), q=new Blob([U],{type:"text/html;charset=utf-8"}), ae=URL.createObjectURL(q), ie=document.createElement("a");
    ie.href=ae; ie.download=\`ប្លង់តុសិស្ស_\${s.grade||"ថ្នាក់ទី៤"}_\${new Date().toISOString().split("T")[0]}.html\`;
    document.body.appendChild(ie); ie.click(); document.body.removeChild(ie); URL.revokeObjectURL(ae);
  };

  return e.jsxs("div",{className:"fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto",children:[
    e.jsxs("div",{className:"bg-white rounded-[32px] border border-slate-200 shadow-2xl w-full max-w-7xl max-h-[96vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150",children:[
      e.jsxs("div",{className:"p-4 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between border-b border-purple-800/40 shrink-0",children:[
        e.jsxs("div",{className:"flex items-center gap-3",children:[
          e.jsx("div",{className:"w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-xl shrink-0",children:e.jsx(ts,{className:"w-6 h-6"})}),
          e.jsxs("div",{children:[
            e.jsxs("div",{className:"flex items-center gap-2",children:[
              e.jsx("h3",{className:"text-base sm:text-lg font-black tracking-tight text-white",children:"ប្លង់តុ និងការរៀបចំថ្នាក់រៀន (មានរូបថតសិស្ស)"}),
              e.jsx("span",{className:"px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[10px]",children:"Interactive Desk Layout Pro"})
            ]}),
            e.jsx("p",{className:"text-xs text-purple-200/80 mt-0.5",children:"ចុចលើរូបថត ឬឈ្មោះសិស្សណាម្នាក់ដើម្បីដាក់ ឬប្តូររូបថតសិស្សតាមតម្រូវការ"})
          ]})
        ]}),
        e.jsx("button",{type:"button",onClick:t,className:"w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer",children:e.jsx(Mr,{className:"w-5 h-5"})})
      ]}),
      e.jsxs("div",{className:"p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs",children:[
        e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
          e.jsxs("div",{className:"flex items-center gap-1 bg-white border border-slate-300 rounded-xl p-1 shadow-2xs",children:[
            e.jsx("button",{type:"button",onClick:()=>l("landscape"),className:\`px-3 py-1.5 rounded-lg font-bold text-xs transition \${i==="landscape"?"bg-purple-900 text-white shadow-xs":"text-slate-700 hover:bg-slate-100"}\`,children:"ផ្ដេក (Landscape)"}),
            e.jsx("button",{type:"button",onClick:()=>l("portrait"),className:\`px-3 py-1.5 rounded-lg font-bold text-xs transition \${i==="portrait"?"bg-purple-900 text-white shadow-xs":"text-slate-700 hover:bg-slate-100"}\`,children:"ឈរ (Portrait)"})
          ]}),
          e.jsxs("div",{className:"flex items-center gap-1 bg-white border border-slate-300 rounded-xl p-1 shadow-2xs",children:[
            e.jsx("button",{type:"button",onClick:()=>c("color"),className:\`px-2.5 py-1.5 rounded-lg font-bold text-xs transition \${o==="color"?"bg-emerald-600 text-white shadow-xs":"text-slate-700 hover:bg-slate-100"}\`,children:"🎨 ពណ៌ស្រស់"}),
            e.jsx("button",{type:"button",onClick:()=>c("bw"),className:\`px-2.5 py-1.5 rounded-lg font-bold text-xs transition \${o==="bw"?"bg-slate-800 text-white shadow-xs":"text-slate-700 hover:bg-slate-100"}\`,children:"🖨️ ស-ខ្មៅ"})
          ]}),
          e.jsxs("label",{className:"flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xl",children:[
            e.jsx("input",{type:"checkbox",checked:h,onChange:e=>m(e.target.checked),className:"rounded text-purple-600 focus:ring-purple-500"}),
            e.jsx("span",{children:"បង្ហាញស្ថិតិ"})
          ]}),
          e.jsxs("label",{className:"flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xl",children:[
            e.jsx("input",{type:"checkbox",checked:d,onChange:e=>u(e.target.checked),className:"rounded text-purple-600 focus:ring-purple-500"}),
            e.jsx("span",{children:"បង្ហាញវេនអនាម័យ"})
          ]})
        ]}),
        e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
          e.jsxs("button",{type:"button",onClick:Z,className:"bg-white hover:bg-purple-50 text-purple-900 border border-purple-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer",children:[
            e.jsx("span",{children:"💾"}),e.jsx("span",{children:"រក្សាទុក HTML"})
          ]}),
          e.jsxs("button",{type:"button",onClick:F,className:"bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer",children:[
            e.jsx(ts,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{children:"បោះពុម្ព A4 / PDF"})
          ]})
        ]})
      ]}),
      e.jsxs("div",{className:"flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-100",children:[
        e.jsxs("div",{className:"bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white p-4 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-purple-800/50",children:[
          e.jsxs("div",{className:"flex items-center gap-3",children:[
            e.jsx("div",{className:"w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl shadow-inner",children:"🖥️"}),
            e.jsxs("div",{children:[
              e.jsx("h4",{className:"font-moul text-xs sm:text-sm text-amber-300",children:"ក្តារខៀន / SMART BOARD 86អ៊ីញ"}),
              e.jsx("p",{className:"text-[11px] text-purple-200",children:"ទិសដៅខាងមុខបន្ទប់រៀន (Front of Classroom)"})
            ]})
          ]}),
          e.jsxs("div",{className:"px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2",children:[
            e.jsx("span",{children:"👩‍🏫 តុគ្រូបង្រៀន៖"}),
            e.jsx("span",{className:"text-amber-300 font-moul",children:s.name||"លោកគ្រូ / អ្នកគ្រូ"})
          ]})
        ]}),
        e.jsxs("div",{className:"bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4",children:[
          e.jsxs("div",{className:"flex items-center justify-between border-b pb-3 border-slate-100",children:[
            e.jsxs("div",{className:"flex items-center gap-2",children:[
              e.jsx("span",{className:"text-lg",children:"🪑"}),
              e.jsxs("h4",{className:"font-moul text-sm sm:text-base text-slate-900",children:[
                "ប្លង់តុសិស្សក្នុងថ្នាក់ (",fr(E)," ជួរទទឹង × ",fr(X)," ជូរបណ្តាយ • ",fr(a.length)," តុទ្វេ)"
              ]})
            ]}),
            e.jsxs("div",{className:"text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full",children:[
              "សរុបសិស្ស៖ ",fr(H)," នាក់ (ស្រី ",fr(z),")"
            ]})
          ]}),
          e.jsx("div",{className:"grid gap-4",style:{gridTemplateColumns:\`repeat(\${Math.min(E,6)}, minmax(0, 1fr))\`},children:
            a.map(ie=>{
              const re=ie.seatLeft, Q=ie.seatRight;
              const R=re.name==="(ទំនេរ)"||re.id<0, J=Q.name==="(ទំនេរ)"||Q.id<0;
              const pLeft=getStudentPhoto(re);
              const pRight=getStudentPhoto(Q);
              return e.jsxs("div",{className:"rounded-2xl border-2 border-purple-200 bg-gradient-to-b from-slate-50 to-purple-50/30 p-3 shadow-xs hover:shadow-md transition space-y-2 relative group",children:[
                e.jsxs("div",{className:"flex items-center justify-between text-[11px] font-bold text-purple-950 border-b border-purple-100 pb-1.5",children:[
                  e.jsxs("span",{className:"font-moul text-xs text-purple-900",children:[ie.deskLabel]}),
                  e.jsxs("span",{className:"text-[10px] text-slate-500 font-mono",children:[
                    "តុ #",fr(ie.colIndex+(ie.rowIndex-1)*E)
                  ]})
                ]}),
                e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[
                  e.jsxs("div",{className:"p-2 rounded-xl bg-white border border-purple-100 flex flex-col justify-between space-y-1.5 shadow-2xs hover:border-purple-300 transition cursor-pointer relative",onClick:()=>!R&&setEditingStudent(re),title:R?"កៅអីទំនេរ":"ចុចដើម្បីប្តូរ/ដាក់រូបថតសិស្សនេះ",children:[
                    R?e.jsxs("div",{className:"text-center py-2 text-slate-400 text-xs italic",children:[
                      e.jsx("span",{className:"block text-lg",children:"🪑"}),
                      e.jsx("span",{children:"(ទំនេរ)"})
                    ]}):e.jsxs("div",{className:"space-y-1.5",children:[
                      e.jsxs("div",{className:"flex items-center gap-2",children:[
                        e.jsx("div",{className:"relative shrink-0",children:pLeft?e.jsx("img",{src:pLeft,className:"w-8 h-8 rounded-full object-cover border-2 border-purple-400 shadow-xs"}):e.jsx("div",{className:\`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold \${re.gender==="ស្រី"?"bg-pink-100 text-pink-700 border border-pink-300":"bg-blue-100 text-blue-700 border border-blue-300"}\`,children:re.gender==="ស្រី"?"👧":"👦"})}),
                        e.jsx("div",{className:"absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white text-white flex items-center justify-center text-[8px]",children:"📷"})
                      ]}),
                      e.jsxs("div",{className:"min-w-0",children:[
                        e.jsxs("div",{className:"text-[10px] font-bold text-slate-500 leading-none",children:[
                          "#",fr(re.rollNo||re.id)," (",re.gender==="ស្រី"?"ស":"ប",")"
                        ]}),
                        e.jsx("div",{className:"font-bold text-xs text-slate-900 truncate mt-0.5",title:re.name,children:re.name})
                      ]}),
                      e.jsx("div",{children:re.needsEyeCare?e.jsx("span",{className:"px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 inline-block",children:"👓 ខ្សោយភ្នែក"}):re.isLeader?e.jsx("span",{className:"px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-300 inline-block",children:\`👑 \${re.role}\`}):e.jsx("span",{className:"px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-600 inline-block truncate max-w-full",children:re.role||"សមាជិក"})})
                    ]})
                  ]}),
                  e.jsxs("div",{className:"p-2 rounded-xl bg-white border border-purple-100 flex flex-col justify-between space-y-1.5 shadow-2xs hover:border-purple-300 transition cursor-pointer relative",onClick:()=>!J&&setEditingStudent(Q),title:J?"កៅអីទំនេរ":"ចុចដើម្បីប្តូរ/ដាក់រូបថតសិស្សនេះ",children:[
                    J?e.jsxs("div",{className:"text-center py-2 text-slate-400 text-xs italic",children:[
                      e.jsx("span",{className:"block text-lg",children:"🪑"}),
                      e.jsx("span",{children:"(ទំនេរ)"})
                    ]}):e.jsxs("div",{className:"space-y-1.5",children:[
                      e.jsxs("div",{className:"flex items-center gap-2",children:[
                        e.jsx("div",{className:"relative shrink-0",children:pRight?e.jsx("img",{src:pRight,className:"w-8 h-8 rounded-full object-cover border-2 border-indigo-400 shadow-xs"}):e.jsx("div",{className:\`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold \${Q.gender==="ស្រី"?"bg-pink-100 text-pink-700 border border-pink-300":"bg-blue-100 text-blue-700 border border-blue-300"}\`,children:Q.gender==="ស្រី"?"👧":"👦"})}),
                        e.jsx("div",{className:"absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white text-white flex items-center justify-center text-[8px]",children:"📷"})
                      ]}),
                      e.jsxs("div",{className:"min-w-0",children:[
                        e.jsxs("div",{className:"text-[10px] font-bold text-slate-500 leading-none",children:[
                          "#",fr(Q.rollNo||Q.id)," (",Q.gender==="ស្រី"?"ស":"ប",")"
                        ]}),
                        e.jsx("div",{className:"font-bold text-xs text-slate-900 truncate mt-0.5",title:Q.name,children:Q.name})
                      ]}),
                      e.jsx("div",{children:Q.needsEyeCare?e.jsx("span",{className:"px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 inline-block",children:"👓 ខ្សោយភ្នែក"}):Q.isLeader?e.jsx("span",{className:"px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 inline-block",children:\`👑 \${Q.role}\`}):e.jsx("span",{className:"px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-600 inline-block truncate max-w-full",children:Q.role||"សមាជិក"})})
                    ]})
                  ]})
                ]})
              ]});
            })
          })
        ]})
      ]}),
      editingStudent && e.jsx("div",{className:"fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4",children:
        e.jsxs("div",{className:"bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-slate-800",children:[
          e.jsxs("div",{className:"flex items-center justify-between border-b pb-3 border-slate-100",children:[
            e.jsxs("div",{className:"flex items-center gap-2.5",children:[
              e.jsx("div",{className:"w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-lg",children:"📸"}),
              e.jsxs("div",{children:[
                e.jsx("h4",{className:"font-extrabold text-base text-slate-900",children:"ដាក់រូបថតសិស្ស (Student Photo)"}),
                e.jsxs("p",{className:"text-xs text-slate-500 font-bold",children:[editingStudent.name," (#",editingStudent.rollNo||editingStudent.id,")"]})
              ]})
            ]}),
            e.jsx("button",{type:"button",onClick:()=>setEditingStudent(null),className:"p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition",children:e.jsx(Mr,{className:"w-4 h-4"})})
          ]}),
          e.jsxs("div",{className:"space-y-3 text-xs",children:[
            e.jsx("p",{className:"text-slate-600 font-medium",children:"ជ្រើសរើសរូបថតគំរូខាងក្រោម ឬបញ្ចូល URL រូបថតផ្ទាល់ខ្លួន៖"}),
            e.jsx("div",{className:"grid grid-cols-3 gap-2",children:
              sampleAvatars.map((url, idx)=>e.jsx("div",{onClick:()=>savePhoto(editingStudent.id, url),className:"border-2 border-slate-200 hover:border-purple-600 rounded-2xl p-1.5 cursor-pointer flex flex-col items-center gap-1 transition bg-slate-50 hover:bg-purple-50",children:[
                e.jsx("img",{src:url,className:"w-14 h-14 rounded-full object-cover border"}),
                e.jsxs("span",{className:"text-[10px] font-bold text-slate-600",children:["គំរូ #",idx+1]})
              ]}, \`avatar-\${idx}\`))
            }),
            e.jsxs("div",{className:"space-y-1.5 pt-2 border-t border-slate-100",children:[
              e.jsx("label",{className:"font-bold text-slate-700",children:"ឬបញ្ចូល URL រូបថត (Image URL):"}),
              e.jsxs("div",{className:"flex gap-2",children:[
                e.jsx("input",{type:"text",value:customPhotoInput,onChange:e=>setCustomPhotoInput(e.target.value),placeholder:"https://example.com/student-photo.jpg",className:"flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"}),
                e.jsx("button",{type:"button",onClick:()=>customPhotoInput.trim()&&savePhoto(editingStudent.id, customPhotoInput.trim()),className:"px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold transition shadow-xs",children:"រក្សាទុក"})
              ]})
            ]}),
            getStudentPhoto(editingStudent) && e.jsx("div",{className:"pt-2",children:
              e.jsx("button",{type:"button",onClick:()=>savePhoto(editingStudent.id, ""),className:"w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold transition",children:"🗑️ លុបរូបថតចេញ (Reset Avatar)"})
            })
          ]})
        ]})
      ]}
    ])
  ]});
};`;

src = src.slice(0, lcePos) + upgradedLCe + src.slice(nextComponentPos);

fs.writeFileSync(FILE, src, "utf8");

const sf = ts.createSourceFile(FILE, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("Parse diagnostics found:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("SUCCESS: patched LCe v120 with valid factory calls, length:", src.length);
