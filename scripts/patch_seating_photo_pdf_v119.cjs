const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

// Guard anchors
const lceStart = src.indexOf("LCe=({isOpen:r,onClose:t,teacher:s,gridDesks:a");
const dmStart = src.indexOf(",dm=[{id:1,name:\"សម្អាតថ្នាក់រៀន\"", lceStart);
const a2Start = src.indexOf("A2=(r,t=4,s=\"4A\",a)=>{", dmStart);
const mceEnd = src.indexOf(",Z$=[{id:1,title:\"ប្រការ១\"", a2Start);

if (lceStart === -1 || dmStart === -1 || a2Start === -1 || mceEnd === -1) {
  throw new Error(`Missing anchors: ${JSON.stringify({ lceStart, dmStart, a2Start, mceEnd })}`);
}

const newLceAndHelpers = `
escS=v=>String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),
resImg=v=>{if(!v||typeof v!=="string")return"";if(v.startsWith("data:")||v.startsWith("http:")||v.startsWith("https:")||v.startsWith("blob:"))return v;try{return window.location.origin+(v.startsWith("/")?v:"/"+v)}catch{return v}},
getSeatPhotoUrl=(seat,pmap,stList)=>{
  if(!seat||seat.name==="(ទំនេរ)"||seat.id<0)return"";
  const byId=pmap&&pmap.byId?pmap.byId:{};
  const nameToId=pmap&&pmap.nameToId?pmap.nameToId:{};
  if(byId[String(seat.id)])return byId[String(seat.id)];
  if(seat.name&&nameToId[seat.name]&&byId[nameToId[seat.name]])return byId[nameToId[seat.name]];
  if(seat.photo)return seat.photo;
  if(seat.avatar)return seat.avatar;
  if(stList&&stList.length){
    const m=stList.find(x=>x.id===seat.id||(seat.name&&x.name===seat.name));
    if(m)return m.photo||m.avatar||m.photoUrl||"";
  }
  return"";
},
buildVisualSeatingHtml=({
  teacher:s,
  gridDesks:a,
  layoutMode:mode="grid_4x6",
  themeStyle:theme="warm_class",
  showHighlights:hi=!0,
  photosMap:pmap={},
  students:stList=[],
  sanitationDuty:duties=[],
  bwMode:bw=!1,
  showStats:withStats=!0,
  showSanitation:withSan=!0,
  roomNumber:room="០៤",
  academicYear:yearOverride="",
  dateLine:dateStr="",
  forOiBody:oiBody=!1
})=>{
  const cols=Math.max(...a.map(u=>u.colIndex||1),1);
  const rows=Math.max(...a.map(u=>u.rowIndex||1),1);
  const yr=yearOverride||(s&&s.academicYear)||"២០២៥ - ២០២៦";
  const dark=theme==="slate_night"&&!bw;
  let total=0,boys=0,girls=0,eyeCount=0,leadCount=0;
  a.forEach(d=>{
    [d.seatLeft,d.seatRight].forEach(st=>{
      if(!st||st.name==="(ទំនេរ)"||st.id<0)return;
      total++;
      if(st.gender==="ស្រី")girls++;else boys++;
      if(st.needsEyeCare)eyeCount++;
      if(st.isLeader||st.isTopStudent)leadCount++;
    });
  });
  const dense=cols>=5;
  const imgSz=dense?28:36;
  const tAvatar=resImg(s&&(s.avatar||s.photo)||"");

  const renderSeat=(st,sideLabel)=>{
    const empty=!st||st.name==="(ទំនេរ)"||st.id<0;
    if(empty){
      return \`<div class="sp-seat sp-seat-empty">
        <div class="sp-empty-ico">🪑</div>
        <div class="sp-empty-lbl">កៅអីទំនេរ (\${sideLabel})</div>
      </div>\`;
    }
    const pUrl=resImg(getSeatPhotoUrl(st,pmap,stList));
    const isGirl=st.gender==="ស្រី";
    const isPres=!!st.isPresident;
    const isVP1=!!st.isVicePresident1;
    const isVP2=!!st.isVicePresident2;
    const isEye=!!(st.needsEyeCare&&hi);
    const isSlow=!!st.isSlowLearner;
    const ringCol=isPres?"#f59e0b":isVP1?"#6366f1":isVP2?"#0891b2":isGirl?"#f472b6":"#60a5fa";
    const seatBg=dark?(isPres?"#312008":st.isLeader?"#1e1b4b":isEye?"#2b2108":"#0f172a"):(isPres?"#fffbeb":isVP1?"#eef2ff":isVP2?"#ecfeff":isEye?"#fffbeb":"#ffffff");
    const seatBdr=dark?"#334155":(isPres?"#fcd34d":isVP1?"#a5b4fc":isVP2?"#67e8f9":isEye?"#fbbf24":"#e2e8f0");
    let tagHtml="";
    if(isPres)tagHtml=\`<div class="sp-badge sp-b-pres">👑 ប្រធានថ្នាក់</div>\`;
    else if(isVP1)tagHtml=\`<div class="sp-badge sp-b-vp1">🎖️ អនុប្រធាន១</div>\`;
    else if(isVP2)tagHtml=\`<div class="sp-badge sp-b-vp2">🎖️ អនុប្រធាន២</div>\`;
    else if(isEye)tagHtml=\`<div class="sp-badge sp-b-eye">👁️ ជួរមុខ</div>\`;
    else if(isSlow)tagHtml=\`<div class="sp-badge sp-b-slow">📘 ជំនួយ</div>\`;
    else if(st.subBranch)tagHtml=\`<div class="sp-sub-txt">សាខា \${fr(st.subBranch)}</div>\`;

    const avatarHtml=pUrl
      ?\`<img src="\${escS(pUrl)}" alt="\${escS(st.name)}" style="width:\${imgSz}px;height:\${imgSz}px;border-radius:10px;object-fit:cover;border:2px solid \${ringCol};background:#f8fafc;display:block;flex-shrink:0;" onerror="this.style.display='none'" />\`
      :\`<div style="width:\${imgSz}px;height:\${imgSz}px;border-radius:10px;border:1.5px solid \${ringCol};background:\${isGirl?"#fdf2f8":"#eff6ff"};color:\${isGirl?"#be185d":"#1d4ed8"};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:\${dense?12:14}px;flex-shrink:0;">\${isGirl?"👧":"👦"}</div>\`;

    return \`<div class="sp-seat" style="background:\${seatBg};border:1px solid \${seatBdr};color:\${dark?"#f8fafc":"#0f172a"};">
      <div class="sp-seat-top">\${avatarHtml}</div>
      <div class="sp-seat-name" style="font-size:\${dense?"9.5px":"11px"};color:\${dark?"#ffffff":"#0f172a"};" title="\${escS(st.name)}">\${escS(st.name)}</div>
      <div class="sp-seat-meta" style="color:\${dark?"#94a3b8":"#64748b"};">#\${fr(st.rollNo||st.id)} · \${isGirl?"ស្រី":"ប្រុស"}</div>
      \${tagHtml}
    </div>\`;
  };

  const renderDesk=(d,extraLabel="")=>{
    const isFront=d.rowIndex===1&&hi;
    const isCenter=d.deskType==="center_leader";
    const deskBg=dark?"#1e293b":"#ffffff";
    const deskBdr=bw?"#1e293b":dark?(isCenter?"#6366f1":isFront?"#d97706":"#334155"):(isCenter?"#a5b4fc":isFront?"#f59e0b":"#e2c799");
    const hdrBg=bw?"#f1f5f9":dark?(isCenter?"#312e81":isFront?"#78350f":"#0f172a"):(isCenter?"#eef2ff":isFront?"#fef3c7":"#fdf6e9");
    const hdrCol=dark?"#e2e8f0":"#78350f";
    const numTag=extraLabel||\`តុ \${fr(d.colIndex+(d.rowIndex-1)*cols)}\`;
    return \`<div class="sp-desk" style="background:\${deskBg};border:1.5px solid \${deskBdr};">
      <div class="sp-desk-hdr" style="background:\${hdrBg};border-bottom:1px solid \${deskBdr};color:\${hdrCol};">
        <span class="sp-desk-lbl">\${escS(d.deskLabel)}</span>
        <span class="sp-desk-num">\${numTag}</span>
      </div>
      <div class="sp-desk-body">
        \${renderSeat(d.seatLeft,"ឆ្វេង")}
        \${renderSeat(d.seatRight,"ស្តាំ")}
      </div>
    </div>\`;
  };

  let layoutHtml="";
  if(mode==="group"){
    const sz=Math.max(1,Math.ceil(a.length/4));
    const groups=[
      {n:1,title:\`ក្រុមទី ១ (\${a.slice(0,sz).length} តុ)\`,col:"#7c3aed",bg:"#f5f3ff",desks:a.slice(0,sz)},
      {n:2,title:\`ក្រុមទី ២ (\${a.slice(sz,sz*2).length} តុ)\`,col:"#2563eb",bg:"#eff6ff",desks:a.slice(sz,sz*2)},
      {n:3,title:\`ក្រុមទី ៣ (\${a.slice(sz*2,sz*3).length} តុ)\`,col:"#059669",bg:"#ecfdf5",desks:a.slice(sz*2,sz*3)},
      {n:4,title:\`ក្រុមទី ៤ (\${a.slice(sz*3).length} តុ)\`,col:"#d97706",bg:"#fffbeb",desks:a.slice(sz*3)}
    ];
    layoutHtml=\`<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;">
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
  }

  const stageHtml=\`
    <div class="sp-stage" style="background:\${dark?"#0b1120":"#faf8f5"};border:1.5px solid \${bw?"#334155":dark?"#334155":"#e5d5b5"};border-radius:16px;padding:12px;">
      <div class="sp-top-stage">
        <div class="sp-chalkboard" style="\${bw?"background:#f1f5f9;color:#000;border:2px solid #000;":"background:linear-gradient(180deg,#14532d 0%,#064e3b 100%);color:#ffffff;border:4px solid #92400e;"}">
          <div style="font-family:'Moul',serif;font-size:12px;letter-spacing:0.3px;">ក្តារខៀនថ្នាក់រៀន · \${escS((s&&s.grade)||"ថ្នាក់ទី ៦")}</div>
          <div style="font-size:9.5px;opacity:0.9;margin-top:2px;">\${escS((s&&s.school)||"សាលាបឋមសិក្សាគំរូ")} · សិស្សសរុប \${fr(total)} នាក់ (ស្រី \${fr(girls)} · ប្រុស \${fr(boys)}) · \${fr(a.length)} តុទ្វេ</div>
        </div>
        <div class="sp-teacher-desk" style="\${bw?"background:#fff;border:1.5px solid #000;color:#000;":"background:linear-gradient(180deg,#fffbeb 0%,#ffffff 100%);border:1.5px solid #d97706;color:#451a03;"}">
          \${tAvatar?\`<img src="\${escS(tAvatar)}" alt="\${escS((s&&s.name)||"គ្រូ")}" style="width:30px;height:30px;border-radius:8px;object-fit:cover;border:1.5px solid #d97706;flex-shrink:0;" onerror="this.style.display='none'" />\`:\`<div style="width:30px;height:30px;border-radius:8px;background:#fef3c7;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;">👨‍🏫</div>\`}
          <div style="text-align:left;min-width:0;">
            <div style="font-size:9.5px;font-weight:800;">តុគ្រូបង្រៀន</div>
            <div style="font-size:10px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">\${escS((s&&s.name)||"លោកគ្រូ / អ្នកគ្រូ")}</div>
          </div>
        </div>
      </div>
      <div class="sp-front-arrow" style="color:\${dark?"#94a3b8":"#64748b"};">▲ ជួរមុខ (ជិតក្តារខៀន និងតុគ្រូ) ▲</div>
      \${layoutHtml}
      <div class="sp-legend" style="border-top:1px solid \${dark?"#334155":"#e2e8f0"};color:\${dark?"#cbd5e1":"#475569"};">
        <span>👑 ប្រធានថ្នាក់</span>
        <span>·</span>
        <span>🎖️ អនុប្រធាន</span>
        <span>·</span>
        <span>👁️ ជួរមុខ (ខ្សោយភ្នែក)</span>
        <span>·</span>
        <span>📘 ជំនួយការសិក្សា</span>
        <span>·</span>
        <span>ប្លង់៖ \${fr(cols)} ជួរទទឹង × \${fr(rows)} ជួរបណ្តាយ</span>
      </div>
    </div>
  \`;

  const scCss=\`<style>
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
  </style>\`;

  const statsHtml=withStats?\`<table class="sp-sum-tbl">
    <thead><tr><th>សរុបសិស្ស</th><th>សិស្សស្រី</th><th>សិស្សប្រុស</th><th>ចំនួនតុ</th><th>សិស្សជួរមុខ (ភ្នែក)</th><th>ប្រធាន / សិស្សពូកែ</th></tr></thead>
    <tbody><tr><td><b>\${fr(total)} នាក់</b></td><td>\${fr(girls)} នាក់</td><td>\${fr(boys)} នាក់</td><td><b>\${fr(a.length)} តុទ្វេ</b></td><td>\${fr(eyeCount)} នាក់</td><td>\${fr(leadCount)} នាក់</td></tr></tbody>
  </table>\`:"";

  const sanHtml=withSan&&duties&&duties.length?\`<table class="sp-sum-tbl" style="margin-top:6px;">
    <thead><tr><th style="width:12%;">ថ្ងៃ</th><th style="width:26%;">ក្រុមទទួលខុសត្រូវ</th><th style="width:22%;">ប្រធានវេន</th><th style="width:40%;">ភារកិច្ចអនាម័យចម្បង</th></tr></thead>
    <tbody>\${duties.map(u=>\`<tr><td style="font-weight:700;">\${escS(u.day)}</td><td style="text-align:left;"><b>\${escS(u.teamName)}</b></td><td>\${escS(u.leader)}</td><td style="text-align:left;">\${escS(u.tasks)}</td></tr>\`).join("")}</tbody>
  </table>\`:"";

  if(oiBody){
    return \`\${scCss}<div class="sp-wrap">\${stageHtml}\${statsHtml}</div>\`;
  }

  return \`\${scCss}<div class="sp-wrap">
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
  </div>\`;
},
LCe=({isOpen:r,onClose:t,teacher:s,gridDesks:a,sanitationDuty:n,layoutMode:mode="grid_4x6",themeStyle:theme="warm_class",showHighlights:hi=!0,photosMap:pmap={},students:stList=[]})=>{
  const[o,c]=y.useState("color");
  const[d,u]=y.useState(!0);
  const[h,m]=y.useState(!0);
  const[w]=y.useState(s.academicYear||"២០២៥ - ២០២៦");
  const[N]=y.useState("០៤");
  const[A]=y.useState(()=>kf(new Date,{location:s.school||"កំពង់ឆ្នាំង",format:"combined_multiline"}));
  const T=y.useRef(null);
  if(!r)return null;
  const bw=o==="bw";
  const bodyHtml=buildVisualSeatingHtml({
    teacher:s,gridDesks:a,layoutMode:mode,themeStyle:theme,showHighlights:hi,
    photosMap:pmap,students:stList,sanitationDuty:n,bwMode:bw,showStats:h,showSanitation:d,
    roomNumber:N,academicYear:w,dateLine:A,forOiBody:!1
  });
  const G=()=>{
    const ae=ac();
    nc();
    return \`<!DOCTYPE html><html lang="km"><head><meta charset="utf-8" /><base href="\${window.location.origin}/" /><title>ប្លង់តុថ្នាក់រៀន_\${escS(s.grade)}_\${escS(s.school)}_A4</title>\${Oo()}<style>@page{size:A4 landscape;margin:6mm 8mm;}*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'\${ae}','Kantumruy Pro','Battambang','Siemreap',sans-serif;background:#fff !important;color:#0f172a;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}@media print{.no-print{display:none !important;}}</style></head><body>\${bodyHtml}<script>window.onload=function(){setTimeout(function(){window.print();},450);};<\/script></body></html>\`;
  };
  const F=()=>{
    const U=window.open("","_blank","width=1180,height=840");
    if(!U){window.print();return}
    U.document.open(),U.document.write(G()),U.document.close();
  };
  const Z=()=>{
    const U=G(),q=new Blob([U],{type:"text/html;charset=utf-8"}),ae=URL.createObjectURL(q),ie=document.createElement("a");
    ie.href=ae,ie.download=\`ប្លង់តុ_A4_\${s.grade||"ថ្នាក់"}.html\`,document.body.appendChild(ie),ie.click(),document.body.removeChild(ie),URL.revokeObjectURL(ae);
  };
  const PngExp=async()=>{
    if(!T.current)return;
    try{
      const url=await ftt(T.current,{quality:0.96,pixelRatio:2,backgroundColor:"#ffffff",cacheBust:!0});
      const link=document.createElement("a");
      link.download=\`ប្លង់តុសិស្ស_\${s.grade||"ថ្នាក់"}.png\`;
      link.href=url;link.click();
    }catch(err){console.error(err)}
  };
  return e.jsx("div",{className:"fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 overflow-y-auto",children:e.jsxs("div",{className:"bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden",children:[
    e.jsxs("div",{className:"p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0",children:[
      e.jsxs("div",{className:"flex items-center gap-3",children:[
        e.jsx("div",{className:"w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0",children:e.jsx(ts,{className:"w-5 h-5"})}),
        e.jsxs("div",{children:[
          e.jsx("h3",{className:"text-sm sm:text-base font-extrabold text-white",children:"បោះពុម្ព & ទាញយក PDF ប្លង់តុ A4 (ដូចទម្រង់បង្ហាញលើអេក្រង់)"}),
          e.jsx("p",{className:"text-xs text-slate-300 mt-0.5",children:"បង្ហាញប្លង់តុ និងរូបថតសិស្សទាំងអស់ដូចអេក្រង់ · A4 Landscape"})
        ]})
      ]}),
      e.jsx("button",{type:"button",onClick:t,className:"w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer",children:e.jsx(Mr,{className:"w-5 h-5"})})
    ]}),
    e.jsxs("div",{className:"p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs",children:[
      e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[
        e.jsxs("div",{className:"flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1",children:[
          e.jsx("button",{type:"button",onClick:()=>c("color"),className:\`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer \${o==="color"?"bg-emerald-700 text-white shadow-2xs":"text-slate-600 hover:text-slate-900"}\`,children:"🎨 ពណ៌ដូចដើម"}),
          e.jsx("button",{type:"button",onClick:()=>c("bw"),className:\`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer \${o==="bw"?"bg-slate-900 text-white shadow-2xs":"text-slate-600 hover:text-slate-900"}\`,children:"🖨️ ស-ខ្មៅ"})
        ]}),
        e.jsxs("label",{className:"flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 select-none",children:[
          e.jsx("input",{type:"checkbox",checked:d,onChange:U=>u(U.target.checked),className:"rounded text-emerald-700 w-4 h-4"}),
          e.jsx("span",{children:"តារាងវេនអនាម័យ"})
        ]}),
        e.jsxs("label",{className:"flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 select-none",children:[
          e.jsx("input",{type:"checkbox",checked:h,onChange:U=>m(U.target.checked),className:"rounded text-emerald-700 w-4 h-4"}),
          e.jsx("span",{children:"ស្ថិតិសិស្ស"})
        ]})
      ]}),
      e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[
        e.jsxs("button",{type:"button",onClick:PngExp,className:"px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer",children:[e.jsx(Vs,{className:"w-3.5 h-3.5 text-indigo-600"}),e.jsx("span",{children:"ទាញយករូបភាព PNG"})]}),
        e.jsxs("button",{type:"button",onClick:Z,className:"px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer",children:[e.jsx(wi,{className:"w-3.5 h-3.5 text-emerald-600"}),e.jsx("span",{children:"ទាញយក HTML"})]}),
        e.jsxs("button",{type:"button",onClick:F,className:"px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold transition flex items-center gap-2 shadow-sm cursor-pointer",children:[e.jsx(ts,{className:"w-4 h-4"}),e.jsx("span",{children:"បោះពុម្ព / រក្សាទុក PDF ដូចទម្រង់ដើម"})]})
      ]})
    ]}),
    e.jsx("div",{className:"flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/70 flex justify-center",children:
      e.jsx("div",{ref:T,className:"w-full max-w-[1060px] bg-white rounded-2xl shadow-lg border border-slate-300 p-4 sm:p-6 text-slate-900 h-fit",dangerouslySetInnerHTML:{__html:bodyHtml}})
    })
  ]})})
}`;

const newA2KAndMce = `A2=(r,t=4,s="4A",a)=>{
  if(!r||r.length===0)return K$();
  let n=[...r];
  if(a){
    const h=n.filter(X=>a.eyeCareIds.includes(X.id)),
      m=n.filter(X=>a.slowLearnerIds.includes(X.id)),
      w=n.filter(X=>X.id===a.presidentId||X.id===a.vicePresident1Id||X.id===a.vicePresident2Id),
      j=n.filter(X=>!a.eyeCareIds.includes(X.id)&&!a.slowLearnerIds.includes(X.id)&&X.id!==a.presidentId&&X.id!==a.vicePresident1Id&&X.id!==a.vicePresident2Id),
      N=Math.min(t*2,h.length),B=h.slice(0,N),A=h.slice(N),D=[],T=[...w,...j];
    D.push(...B);
    let E=0;
    for(const X of m)D.push(X),E<T.length&&(D.push(T[E]),E++);
    D.push(...A),D.push(...T.slice(E)),n=D;
  }
  const i=n.length,l=Math.max(1,Math.ceil(i/2)),o=Math.max(1,t),c=Math.max(1,Math.ceil(l/o)),
  d=h=>{var m;if(!(!a||!a.subBranches)){for(let w=1;w<=6;w++)if((m=a.subBranches[w])!=null&&m.includes(h))return w}},
  u=[];
  for(let h=1;h<=c;h++)for(let m=1;m<=o;m++){
    const w=(h-1)*o+(m-1);
    if(w>=l)continue;
    const j=w*2,N=w*2+1,B=n[j],A=n[N];
    let D="standard";
    h===1?D="front_eyecare":h===2||h===3?D="center_leader":h===c&&(D="back_support");
    let T;
    if(B){
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
    }else E={id:-200-w,rollNo:0,name:"(ទំនេរ)",gender:"ស្រី",role:"កៅអីទំនេរ"};
    u.push({deskId:\`D-R\${h}C\${m}\`,colIndex:m,rowIndex:h,deskLabel:\`ជួរ \${fr(h)} · តុ \${fr(m)}\`,deskType:D,seatLeft:T,seatRight:E});
  }
  return u;
},
K$=()=>{
  const r=[
    {name:"សុខ ចាន់ថន",gender:"ប្រុស",role:"ប្រធានថ្នាក់",leader:!0,top:!0},
    {name:"កែវ វណ្ណា",gender:"ស្រី",role:"អនុប្រធានទី១",eye:!0},
    {name:"ជា សុផាត",gender:"ប្រុស",role:"សិស្សខ្សោយភ្នែក",eye:!0},
    {name:"លីណា ស្រីម៉ៅ",gender:"ស្រី",role:"សិស្សខ្សោយភ្នែក",eye:!0},
    {name:"ម៉ៅ ចិន្តា",gender:"ស្រី",role:"សមាជិកសកម្ម",eye:!0},
    {name:"ហេង ពិសិដ្ឋ",gender:"ប្រុស",role:"សមាជិក",eye:!0},
    {name:"សុខ វិសាល",gender:"ប្រុស",role:"ប្រធានក្រុម ១",leader:!0,top:!0},
    {name:"កែវ ចន្ថា",gender:"ស្រី",role:"សិស្សពូកែ",eye:!0},
    {name:"ចាន់ ពិសិដ្ឋ",gender:"ប្រុស",role:"សមាជិក"},
    {name:"ឡុង រតនា",gender:"ប្រុស",role:"សមាជិក"},
    {name:"ហេង សុផល",gender:"ប្រុស",role:"សមាជិក"},
    {name:"ជា សុជាតា",gender:"ស្រី",role:"ប្រធានក្រុម ២",leader:!0,top:!0},
    {name:"តាំង គឹមឡេង",gender:"ប្រុស",role:"សមាជិក"},
    {name:"នួន វ៉ាន់នី",gender:"ស្រី",role:"សមាជិក"},
    {name:"សេង វិបុល",gender:"ប្រុស",role:"សមាជិក"},
    {name:"ផាត ដាវី",gender:"ស្រី",role:"សមាជិក"},
    {name:"ឌី វណ្ណៈ",gender:"ប្រុស",role:"សមាជិក"},
    {name:"អ៊ុំ ពិសី",gender:"ស្រី",role:"ប្រធានក្រុម ៣",leader:!0,top:!0},
    {name:"គង់ រិទ្ធី",gender:"ប្រុស",role:"សិស្សពូកែគណិត",top:!0},
    {name:"យីង វណ្ណា",gender:"ស្រី",role:"សមាជិក"},
    {name:"ហួត សុខា",gender:"ប្រុស",role:"សមាជិក"},
    {name:"ព្រំ ធីតា",gender:"ស្រី",role:"សិស្សពូកែអក្សរសាស្ត្រ",top:!0},
    {name:"ស៊ឹម វឌ្ឍនៈ",gender:"ប្រុស",role:"សមាជិក"},
    {name:"លឹម គឹមសួរ",gender:"ប្រុស",role:"ប្រធានក្រុម ៤",leader:!0,top:!0},
    {name:"ថៃ ចាន់ណា",gender:"ស្រី",role:"សមាជិក"},
    {name:"កែវ មុនី",gender:"ប្រុស",role:"សមាជិក"},
    {name:"សែម វណ្ណារ៉ូ",gender:"ប្រុស",role:"សមាជិក"},
    {name:"ខៀវ ស្រីណែត",gender:"ស្រី",role:"សមាជិក"},
    {name:"អ៊ុច សុធា",gender:"ប្រុស",role:"សមាជិក"},
    {name:"វ៉ាន់ សុភ័ក្ត្រ",gender:"ប្រុស",role:"សមាជិក"},
    {name:"ស៊្រុន ចរិយា",gender:"ស្រី",role:"សមាជិក"},
    {name:"តុប វិចិត្រ",gender:"ប្រុស",role:"សមាជិក"},
    {name:"ប៉ែន គឹមហេង",gender:"ប្រុស",role:"សមាជិក"},
    {name:"យិន សោភ័ណ",gender:"ស្រី",role:"សមាជិក"},
    {name:"ឈួន ម៉េងឡុង",gender:"ប្រុស",role:"សមាជិក"},
    {name:"អ៊ឹង សុវណ្ណារ៉ា",gender:"ប្រុស",role:"សមាជិក"},
    {name:"មាស ស្រីលក្ខណ៍",gender:"ស្រី",role:"សមាជិក"},
    {name:"ចេង ពិសី",gender:"ស្រី",role:"សមាជិក"},
    {name:"ទាវ សុវណ្ណ",gender:"ប្រុស",role:"សមាជិក"},
    {name:"ឃុន រតនៈ",gender:"ប្រុស",role:"សមាជិក"},
    {name:"រស់ ចាន់នី",gender:"ស្រី",role:"សមាជិក"},
    {name:"ឃឹម បញ្ញា",gender:"ប្រុស",role:"សិស្សពូកែកីឡា"},
    {name:"អ៊ុក វណ្ណឌី",gender:"ប្រុស",role:"សមាជិក"},
    {name:"ស៊ុន ម៉ាលី",gender:"ស្រី",role:"សមាជិក"},
    {name:"ណុប ករុណា",gender:"ប្រុស",role:"សមាជិក"},
    {name:"អ៊ន់ ស្រីនិច",gender:"ស្រី",role:"សមាជិក"},
    {name:"លី រស្មី",gender:"ស្រី",role:"សមាជិក"},
    {name:"តុង វិសិដ្ឋ",gender:"ប្រុស",role:"សមាជិក"}
  ],t=[];
  let s=0;
  for(let a=1;a<=6;a++)for(let n=1;n<=4;n++){
    const i=r[s]||{name:\`សិស្ស #\${s+1}\`,gender:"ប្រុស",role:"សមាជិក"};s++;
    const l=r[s]||{name:\`សិស្ស #\${s+1}\`,gender:"ស្រី",role:"សមាជិក"};s++;
    let o="standard";
    a===1?o="front_eyecare":a===2||a===3?o="center_leader":a===6&&(o="back_support");
    t.push({
      deskId:\`D-R\${a}C\${n}\`,colIndex:n,rowIndex:a,deskLabel:\`ជួរ \${fr(a)} · តុ \${fr(n)}\`,deskType:o,
      seatLeft:{id:s-1,rollNo:s-1,name:i.name,gender:i.gender,role:i.role,isLeader:i.leader||!1,isPresident:s-1===1,isTopStudent:i.top||!1,needsEyeCare:i.eye||!1,notes:a===1?"ជួរមុខជិតក្តារខៀន មើលអក្សរច្បាស់":void 0},
      seatRight:{id:s,rollNo:s,name:l.name,gender:l.gender,role:l.role,isLeader:l.leader||!1,isVicePresident1:s===2,isTopStudent:i.top||!1,needsEyeCare:l.eye||!1,notes:a===1?"ជួរមុខ ត្រូវការពន្លឺគ្រប់គ្រាន់":void 0}
    });
  }
  return t;
},
MCe=({teacher:r,students:t,onShowToast:s})=>{
  const[a,n]=y.useState("grid_4x6");
  const[o,c]=y.useState(!0);
  const[h,m]=y.useState(null);
  const[N,B]=y.useState(!1);
  const[A,D]=y.useState(!1);
  const[T,E]=y.useState(!1);
  const[X,H]=y.useState(!1);
  const[PModal,setPModal]=y.useState(!1);
  const[pSearch,setPSearch]=y.useState("");
  const[O,z]=y.useState(null);
  const[M,V]=y.useState(null);
  const[G,F]=y.useState("warm_class");
  const[Z,Y]=y.useState(4);
  const U=\`moeys_classroom_committee_\${r.grade||"default"}\`;
  const pKey=\`moeys_seating_photos_\${r.grade||"default"}\`;
  const[q,ae]=y.useState(()=>{
    try{const ct=localStorage.getItem(U);if(ct)return JSON.parse(ct)}catch(ct){console.error(ct)}
    const Ve=(t&&t.length>0?t:[]).map(ct=>ct.id),kt={1:[],2:[],3:[],4:[],5:[],6:[]};
    return Ve.forEach((ct,Ft)=>{kt[Ft%6+1].push(ct)}),{presidentId:Ve[0]||1,vicePresident1Id:Ve[1]||2,vicePresident2Id:Ve[2]||3,slowLearnerIds:[],eyeCareIds:[Ve[3],Ve[4]].filter(Boolean),subBranches:kt,dailyTasks:dm};
  });
  const[pmap,setPmap]=y.useState(()=>{
    try{const raw=localStorage.getItem(pKey);if(raw){const parsed=JSON.parse(raw);if(parsed&&parsed.byId)return parsed}}catch{}
    return{byId:{},nameToId:{}};
  });
  const fileRef=y.useRef(null);
  const targetSeatRef=y.useRef(null);
  const[ie,re]=y.useState(()=>A2(t||[],4,r.grade,q));
  y.useEffect(()=>{t&&t.length>0&&re(A2(t,Z,r.grade,q))},[t,Z,r.grade,q]);

  const savePhotos=(next)=>{
    setPmap(next);
    try{localStorage.setItem(pKey,JSON.stringify(next))}catch(err){s&&s("⚠️ ទំហំផ្ទុករូបថតពេញ! សូមលុបរូបចាស់ខ្លះ")}
  };
  const compressAndSave=(file,seat)=>{
    if(!file||!seat)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=new Image();
      img.onload=()=>{
        const size=180;
        const cv=document.createElement("canvas");
        cv.width=size;cv.height=size;
        const ctx=cv.getContext("2d");
        const minSide=Math.min(img.width,img.height);
        const sx=(img.width-minSide)/2;
        const sy=(img.height-minSide)/2;
        ctx.drawImage(img,sx,sy,minSide,minSide,0,0,size,size);
        const dataUrl=cv.toDataURL("image/jpeg",0.84);
        const nextById={...(pmap.byId||{}),[String(seat.id)]:dataUrl};
        const nextMap={...(pmap.nameToId||{})};
        if(seat.name)nextMap[seat.name]=String(seat.id);
        savePhotos({byId:nextById,nameToId:nextMap});
        s&&s(\`📷 បានដាក់រូបថត «\${seat.name}» រួចរាល់!\`);
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  const triggerPhoto=(seat)=>{
    targetSeatRef.current=seat;
    if(fileRef.current){fileRef.current.value="";fileRef.current.click();}
  };
  const removePhoto=(seat)=>{
    if(!seat)return;
    const nextById={...(pmap.byId||{})};
    const nextMap={...(pmap.nameToId||{})};
    delete nextById[String(seat.id)];
    if(seat.name&&nextMap[seat.name]){delete nextById[nextMap[seat.name]];delete nextMap[seat.name];}
    savePhotos({byId:nextById,nameToId:nextMap});
    s&&s(\`🗑️ បានលុបរូបថត «\${seat.name}»\`);
  };

  const Q=Ze=>{ae(Ze);try{localStorage.setItem(U,JSON.stringify(Ze))}catch(Ve){console.error(Ve)}re(A2(t||[],Z,r.grade,Ze)),s("💾 បានរក្សាទុកការរៀបចំគណៈកម្មាធិការ និងវ៉ែនសម្អាតថ្នាក់រៀនជោគជ័យ!")};
  const R=Ze=>{ae(Ze);try{localStorage.setItem(U,JSON.stringify(Ze))}catch(kt){console.error(kt)}const Ve=A2(t||[],Z,r.grade,Ze);re(Ve),s(\`✨ បានរៀបប្លង់តុឆ្លាតវៃ៖ សិស្សពិបាកមើល \${Ze.eyeCareIds.length} នាក់នៅជួរមុខ!\`)};
  const[J,se]=y.useState("");
  const le=y.useMemo(()=>ie.flatMap(Ze=>[Ze.seatLeft,Ze.seatRight]).filter(Ze=>Ze.name&&Ze.name!=="(ទំនេរ)"&&Ze.id>0),[ie]);
  const me=le.length;
  const ue=y.useMemo(()=>le.filter(Ze=>Ze.gender==="ស្រី").length,[le]);
  const fe=y.useMemo(()=>le.filter(Ze=>Ze.gender==="ប្រុស").length,[le]);
  const photoCount=y.useMemo(()=>le.filter(Ze=>!!getSeatPhotoUrl(Ze,pmap,t||[])).length,[le,pmap,t]);
  const de=y.useMemo(()=>t&&t.length>0?t:le.map(Ze=>({id:Ze.id,name:Ze.name,gender:Ze.gender,rollNo:Ze.rollNo,grade:r.grade,dob:"",parentPhone:""})),[t,le,r.grade]);
  const Ce=y.useMemo(()=>["ច័ន្ទ","អង្គារ","ពុធ","ព្រហស្បតិ៍","សុក្រ","សៅរ៍"].map((Ve,kt)=>{
    const ct=kt%6+1,jr=(q.subBranches[ct]||[]).map(Re=>{var Ge;return(Ge=de.find(xt=>xt.id===Re))==null?void 0:Ge.name}).filter(Boolean),vr=dm[kt%dm.length],he=jr[0]||"ប្រធានអនុសាខា";
    return{day:Ve,teamName:\`អនុសាខាទី \${ct} (\${vr.name})\`,leader:he,members:jr.length>0?jr:["សមាជិកទាំងអស់ក្នុងអនុសាខា"],tasks:vr.description||vr.name};
  }),[q.subBranches,de]);
  const ge=Ze=>{var ct;const Ve={...q,presidentId:Ze};Q(Ve);const kt=((ct=de.find(Ft=>Ft.id===Ze))==null?void 0:ct.name)||"សិស្ស";s(\`👑 បានតែងតាំង «\${kt}» ជាប្រធានថ្នាក់!\`)};
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
  };
  const Be=Ze=>{
    re(Ve=>Ve.map(kt=>kt.deskId===Ze?{...kt,seatLeft:{...kt.seatRight},seatRight:{...kt.seatLeft}}:kt));
    s(\`🔄 បានប្តូរកៅអីឆ្វេង-ស្តាំ ក្នុងតុ \${Ze} រួចរាល់!\`);
  };
  const be=()=>{
    if(!O||!M){s("សូមជ្រើសរើសសិស្ស ២ នាក់ដើម្បីប្តូរកៅអីគ្នា");return}
    if(O.id===M.id){s("សូមជ្រើសរើសសិស្សពីរនាក់ផ្សេងគ្នា");return}
    const sO=le.find(x=>x.id===O.id)||O,sM=le.find(x=>x.id===M.id)||M;
    re(Ze=>{
      const Ve=JSON.parse(JSON.stringify(Ze));let kt=!1;
      for(const ct of Ve){
        if(ct.seatLeft.id===sO.id)ct.seatLeft={...sM};
        else if(ct.seatRight.id===sO.id)ct.seatRight={...sM};
        if(ct.seatLeft.id===sM.id&&!kt){ct.seatLeft={...sO};kt=!0;}
        else if(ct.seatRight.id===sM.id&&!kt){ct.seatRight={...sO};kt=!0;}
      }
      return Ve;
    });
    s(\`🔄 បានប្តូរកៅអីរវាង «\${sO.name}» និង «\${sM.name}» រួចរាល់\`);
    B(!1),z(null),V(null);
  };
  const Qe=y.useMemo(()=>Math.max(...ie.map(Ze=>Ze.colIndex),1),[ie]);
  const Et=y.useMemo(()=>Math.max(...ie.map(Ze=>Ze.rowIndex),1),[ie]);
  const vt=y.useMemo(()=>{
    const Ze=ie.length,Ve=Math.max(1,Math.ceil(Ze/4)),kt=ie.slice(0,Ve),ct=ie.slice(Ve,Ve*2),Ft=ie.slice(Ve*2,Ve*3),jr=ie.slice(Ve*3);
    const vr=he=>{const Re=he.flatMap(Ge=>[Ge.seatLeft,Ge.seatRight]).filter(Ge=>Ge.name&&Ge.name!=="(ទំនេរ)"&&Ge.id>0);return Re.length===0?"ប្រធានក្រុម":Re.length===1?Re[0].name:\`\${Re[0].name} & \${Re[1].name}\`};
    return[
      {groupId:"g1",groupNumber:1,groupName:\`ក្រុមទី ១ (\${kt.length} តុ)\`,groupMotto:"សាមគ្គីភាព និងការច្នៃប្រឌិតខ្ពស់",leaderName:vr(kt),colorTheme:{hdrBg:"bg-purple-50 border-purple-200",titleCol:"text-purple-900",box:"border-purple-200 bg-purple-50/30"},desks:kt},
      {groupId:"g2",groupNumber:2,groupName:\`ក្រុមទី ២ (\${ct.length} តុ)\`,groupMotto:"ស្រាវជ្រាវ ស្វែងយល់ និងបង្កើតថ្មី",leaderName:vr(ct),colorTheme:{hdrBg:"bg-blue-50 border-blue-200",titleCol:"text-blue-900",box:"border-blue-200 bg-blue-50/30"},desks:ct},
      {groupId:"g3",groupNumber:3,groupName:\`ក្រុមទី ៣ (\${Ft.length} តុ)\`,groupMotto:"រួមគិត រួមធ្វើ រួមទទួលបានជោគជ័យ",leaderName:vr(Ft),colorTheme:{hdrBg:"bg-emerald-50 border-emerald-200",titleCol:"text-emerald-900",box:"border-emerald-200 bg-emerald-50/30"},desks:Ft},
      {groupId:"g4",groupNumber:4,groupName:\`ក្រុមទី ៤ (\${jr.length} តុ)\`,groupMotto:"អំណានទូលំទូលាយ បញ្ញាភ្លឺថ្លា",leaderName:vr(jr),colorTheme:{hdrBg:"bg-amber-50 border-amber-200",titleCol:"text-amber-900",box:"border-amber-200 bg-amber-50/30"},desks:jr}
    ];
  },[ie]);
  const dark=G==="slate_night";
  const stageRef=y.useRef(null);
  const exportStagePng=async()=>{
    if(!stageRef.current)return;
    try{
      const url=await ftt(stageRef.current,{quality:0.96,pixelRatio:2,backgroundColor:dark?"#0f172a":"#ffffff",cacheBust:!0});
      const lk=document.createElement("a");lk.download=\`ប្លង់តុសិស្ស_\${r.grade||"ថ្នាក់"}.png\`;lk.href=url;lk.click();
      s&&s("🖼️ បានទាញយករូបភាពប្លង់តុ (PNG) រួចរាល់!");
    }catch(err){console.error(err)}
  };

  const Cr=(Ze,Ve)=>{
    const ct=Ze.name==="(ទំនេរ)"||Ze.id<0;
    const Ft=!ct&&Ze.needsEyeCare&&o;
    const jr=!ct&&Ze.isLeader;
    const pUrl=ct?"":getSeatPhotoUrl(Ze,pmap,t||[]);
    const isGirl=Ze.gender==="ស្រី";
    if(ct){
      return e.jsxs("div",{className:\`rounded-xl p-2 border border-dashed flex flex-col justify-center items-center text-center min-h-[104px] select-none \${dark?"border-slate-700 bg-slate-900/40 text-slate-500":"border-slate-200 bg-slate-50/70 text-slate-400"}\`,children:[
        e.jsx("span",{className:"text-base opacity-50",children:"🪑"}),
        e.jsx("span",{className:"text-[11px] font-bold mt-1",children:"កៅអីទំនេរ"}),
        e.jsxs("span",{className:"text-[9px] opacity-75",children:["(",Ve,")"]})
      ]});
    }
    const cardCls=dark
      ?(Ze.isPresident?"bg-amber-950/50 border-amber-400/70":jr?"bg-indigo-950/70 border-indigo-400/60":Ft?"bg-amber-950/40 border-amber-500/50":"bg-slate-900/90 border-slate-700 hover:border-slate-500")
      :(Ze.isPresident?"bg-amber-50/80 border-amber-300 shadow-2xs":Ze.isVicePresident1?"bg-indigo-50/60 border-indigo-200 shadow-2xs":Ze.isVicePresident2?"bg-cyan-50/60 border-cyan-200 shadow-2xs":Ft?"bg-amber-50/60 border-amber-300 shadow-2xs":"bg-white border-slate-200/90 hover:border-amber-300");
    const ringCls=Ze.isPresident?"border-amber-400":Ze.isVicePresident1?"border-indigo-400":Ze.isVicePresident2?"border-cyan-500":isGirl?"border-pink-300":"border-sky-300";

    return e.jsxs("div",{onClick:()=>m(Ze),className:\`cursor-pointer rounded-xl p-2 border transition-all duration-150 relative flex flex-col items-center text-center gap-1.5 min-h-[108px] group/seat \${cardCls}\`,children:[
      e.jsxs("div",{className:"relative shrink-0 mt-0.5",children:[
        e.jsx("div",{className:\`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 \${ringCls} shadow-xs flex items-center justify-center \${isGirl?"bg-pink-50 text-pink-700":"bg-sky-50 text-sky-700"}\`,children:
          pUrl
            ?e.jsx("img",{src:pUrl,alt:Ze.name,referrerPolicy:"no-referrer",className:"w-full h-full object-cover",onError:ev=>{ev.target.style.display="none"}})
            :e.jsx("span",{className:"text-lg select-none",children:isGirl?"👧":"👦"})
        }),
        e.jsx("button",{type:"button",onClick:ev=>{ev.stopPropagation(),triggerPhoto(Ze)},title:"បញ្ចូល ឬប្តូររូបថតសិស្ស",className:"absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-300 shadow-sm flex items-center justify-center text-slate-600 hover:bg-amber-100 hover:text-amber-900 hover:border-amber-400 transition cursor-pointer",children:
          e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",className:"w-2.5 h-2.5",children:[
            e.jsx("path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"}),
            e.jsx("circle",{cx:"12",cy:"13",r:"3"})
          ]})
        })
      ]}),
      e.jsxs("div",{className:"w-full min-w-0 space-y-0.5",children:[
        e.jsx("h6",{className:\`font-extrabold text-[11px] sm:text-xs leading-tight line-clamp-2 \${dark?"text-white":"text-slate-900"}\`,title:Ze.name,children:Ze.name}),
        e.jsxs("div",{className:\`text-[10px] font-semibold \${dark?"text-slate-400":"text-slate-500"}\`,children:["#",fr(Ze.rollNo||Ze.id)," · ",isGirl?"ស្រី":"ប្រុស"]})
      ]}),
      e.jsxs("div",{className:"text-[9.5px] font-extrabold leading-tight",children:[
        Ze.isPresident?e.jsx("span",{className:dark?"text-amber-300":"text-amber-700",children:"👑 ប្រធានថ្នាក់"})
        :Ze.isVicePresident1?e.jsx("span",{className:dark?"text-indigo-300":"text-indigo-700",children:"🎖️ អនុទី១"})
        :Ze.isVicePresident2?e.jsx("span",{className:dark?"text-cyan-300":"text-cyan-700",children:"🎖️ អនុទី២"})
        :Ft?e.jsx("span",{className:dark?"text-amber-300":"text-amber-700",children:"👁️ ជួរមុខ"})
        :Ze.isSlowLearner?e.jsx("span",{className:dark?"text-rose-300":"text-rose-700",children:"📘 ជំនួយ"})
        :Ze.subBranch?e.jsxs("span",{className:dark?"text-slate-400":"text-slate-500 font-semibold",children:["សាខា ",fr(Ze.subBranch)]}):null
      ]})
    ]});
  };

  const or=(Ze)=>{
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
      ]}),
      e.jsxs("div",{className:"p-2 grid grid-cols-2 gap-2 relative",children:[
        e.jsx("div",{className:\`absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-px border-r border-dashed pointer-events-none \${dark?"border-slate-700":"border-amber-200"}\`}),
        Cr(Ze.seatLeft,"ឆ្វេង"),
        Cr(Ze.seatRight,"ស្តាំ")
      ]})
    ]},Ze.deskId);
  };

  const tAvatarUrl=r&&(r.avatar||r.photo)||"";

  return e.jsxs("div",{className:"space-y-6",children:[
    e.jsx("input",{ref:fileRef,type:"file",accept:"image/*",className:"hidden",onChange:ev=>{var fs=ev.target.files;if(fs&&fs[0]&&targetSeatRef.current){compressAndSave(fs[0],targetSeatRef.current)}}}),
    e.jsxs("div",{className:"bg-white p-5 sm:p-7 rounded-[28px] border border-slate-200 shadow-xs space-y-5",children:[
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

      e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80",children:[
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
          ]}),
          e.jsx("button",{type:"button",onClick:()=>c(!o),className:\`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer whitespace-nowrap shrink-0 \${o?"bg-amber-50 text-amber-900 border-amber-300":"bg-white text-slate-600 border-slate-200"}\`,children:o?"👁️ សម្គាល់: បើក":"👁️ សម្គាល់: បិទ"}),
          e.jsx("button",{type:"button",onClick:()=>F(dark?"warm_class":"slate_night"),className:"px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition cursor-pointer whitespace-nowrap shrink-0",children:dark?"☀️ ផ្ទៃភ្លឺ":"🌙 ផ្ទៃងងឹត"}),
          e.jsx("button",{type:"button",onClick:De,title:"រៀបប្លង់ដើមវិញ",className:"p-1.5 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition cursor-pointer",children:e.jsx(En,{className:"w-3.5 h-3.5"})})
        ]})
      ]})
    ]}),

    e.jsxs("div",{ref:stageRef,className:\`p-4 sm:p-7 rounded-[28px] border-2 shadow-sm relative overflow-hidden space-y-6 transition-colors \${dark?"bg-slate-950 text-white border-slate-800":"bg-gradient-to-b from-[#FAF8F5] via-white to-[#F4F7FA] text-slate-900 border-[#e7d4b3]"}\`,children:[
      e.jsxs("div",{className:"relative z-10 space-y-4",children:[
        e.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-5xl mx-auto",children:[
          e.jsxs("div",{className:"flex-1 bg-gradient-to-b from-emerald-900 to-emerald-950 rounded-2xl border-[5px] border-amber-800/90 px-4 py-3.5 shadow-md text-center text-white relative flex flex-col justify-center",children:[
            e.jsxs("h4",{className:"font-moul text-sm sm:text-base tracking-wide",children:["ក្តារខៀនថ្នាក់រៀន · ",r.grade||"ថ្នាក់ទី ៦"]}),
            e.jsxs("p",{className:"text-xs text-emerald-100/90 font-medium mt-1",children:[r.school||"សាលាបឋមសិក្សាគំរូ"," · សិស្សសរុប ",fr(me)," នាក់ (ស្រី ",fr(ue)," · ប្រុស ",fr(fe),") · ",fr(ie.length)," តុទ្វេ"]})
          ]}),
          e.jsxs("div",{className:\`sm:w-64 rounded-2xl border-2 p-3 shadow-sm flex items-center gap-3 shrink-0 \${dark?"bg-slate-900 border-amber-500/50 text-white":"bg-gradient-to-b from-amber-50 to-white border-amber-300 text-slate-900"}\`,children:[
            e.jsx("div",{className:"w-11 h-11 rounded-xl border-2 border-amber-400 bg-amber-100 overflow-hidden flex items-center justify-center shrink-0 text-xl",children:
              tAvatarUrl
                ?e.jsx("img",{src:tAvatarUrl,alt:r.name,referrerPolicy:"no-referrer",className:"w-full h-full object-cover",onError:ev=>{ev.target.style.display="none"}})
                :"👨‍🏫"
            }),
            e.jsxs("div",{className:"min-w-0",children:[
              e.jsx("div",{className:\`text-[11px] font-extrabold \${dark?"text-amber-300":"text-amber-800"}\`,children:"តុគ្រូបង្រៀន"}),
              e.jsx("div",{className:"text-xs font-extrabold truncate",children:r.name||"លោកគ្រូ / អ្នកគ្រូ"})
            ]})
          ]})
        ]}),
        e.jsx("div",{className:\`text-center text-xs font-bold \${dark?"text-slate-400":"text-slate-500"}\`,children:"▲ ជួរមុខ (ជិតក្តារខៀន និងតុគ្រូ) ▲"})
      ]}),

      a==="grid_4x6"&&e.jsxs("div",{className:"relative z-10 space-y-5",children:[
        Array.from({length:Et},(Ze,Ve)=>Ve+1).map(Ze=>{
          const Ve=ie.filter(kt=>kt.rowIndex===Ze);
          return e.jsxs("div",{className:"space-y-2",children:[
            e.jsxs("div",{className:\`flex items-center justify-between text-xs font-extrabold px-1 \${dark?"text-slate-300":"text-slate-600"}\`,children:[
              e.jsxs("span",{children:["ជួរបណ្តាយទី ",fr(Ze)," ",Ze===1?"(ជួរមុខបង្អស់)":Ze===Et?"(ជួរក្រោយបង្អស់)":""]}),
              e.jsxs("span",{className:"text-[11px] font-semibold text-slate-400",children:[fr(Ve.length)," តុ"]})
            ]}),
            e.jsx("div",{className:"grid gap-3 sm:gap-4",style:{gridTemplateColumns:\`repeat(\${Math.min(Qe,Z)}, minmax(0, 1fr))\`},children:Ve.map(kt=>or(kt))})
          ]},Ze);
        })
      ]}),

      a==="group"&&e.jsx("div",{className:"relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-5",children:
        vt.map(Ze=>e.jsxs("div",{className:\`p-4 rounded-2xl border-2 space-y-3.5 \${dark?"bg-slate-900 border-slate-700":Ze.colorTheme.box}\`,children:[
          e.jsxs("div",{className:\`p-3 rounded-xl border flex items-center justify-between \${dark?"bg-slate-800 border-slate-700":Ze.colorTheme.hdrBg}\`,children:[
            e.jsxs("div",{children:[
              e.jsx("h4",{className:\`font-extrabold text-sm \${dark?"text-white":Ze.colorTheme.titleCol}\`,children:Ze.groupName}),
              e.jsxs("p",{className:\`text-[11px] font-semibold \${dark?"text-slate-300":"text-slate-600"}\`,children:["ប្រធានក្រុម៖ ",Ze.leaderName]})
            ]}),
            e.jsxs("span",{className:"text-xs font-bold text-slate-500",children:[fr(Ze.desks.length)," តុទ្វេ"]})
          ]}),
          e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:Ze.desks.map(Ve=>or(Ve))})
        ]},Ze.groupId))
      }),

      a==="u_shape"&&e.jsx("div",{className:\`relative z-10 border-2 border-t-0 rounded-b-3xl p-4 sm:p-5 \${dark?"border-slate-700":"border-slate-300"}\`,children:
        e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[
          e.jsxs("div",{className:"space-y-3",children:[
            e.jsx("div",{className:\`text-xs font-extrabold border-b pb-1.5 text-center \${dark?"text-slate-200 border-slate-700":"text-slate-700 border-slate-200"}\`,children:"ស្លាបឆ្វេង"}),
            ie.slice(0,Math.ceil(ie.length/3)).map(Ze=>or(Ze))
          ]}),
          e.jsxs("div",{className:"space-y-3",children:[
            e.jsx("div",{className:\`text-xs font-extrabold border-b pb-1.5 text-center \${dark?"text-slate-200 border-slate-700":"text-slate-700 border-slate-200"}\`,children:"ជួរកណ្តាល & បាត"}),
            ie.slice(Math.ceil(ie.length/3),Math.ceil(ie.length*2/3)).map(Ze=>or(Ze))
          ]}),
          e.jsxs("div",{className:"space-y-3",children:[
            e.jsx("div",{className:\`text-xs font-extrabold border-b pb-1.5 text-center \${dark?"text-slate-200 border-slate-700":"text-slate-700 border-slate-200"}\`,children:"ស្លាបស្តាំ"}),
            ie.slice(Math.ceil(ie.length*2/3)).map(Ze=>or(Ze))
          ]})
        ]})
      }),

      a==="rows"&&e.jsx("div",{className:"relative z-10 grid gap-3.5",style:{gridTemplateColumns:\`repeat(\${Math.min(Qe,6)}, minmax(0, 1fr))\`},children:
        Array.from({length:Qe},(Ze,Ve)=>Ve+1).map(Ze=>{
          const Ve=ie.filter(kt=>kt.colIndex===Ze);
          return e.jsxs("div",{className:\`p-3 rounded-2xl border space-y-3 \${dark?"bg-slate-900 border-slate-800":"bg-white/80 border-slate-200"}\`,children:[
            e.jsxs("div",{className:\`text-xs font-extrabold text-center border-b pb-1.5 \${dark?"border-slate-700":"border-slate-200"}\`,children:["ជួរឈរទី ",fr(Ze)]}),
            e.jsx("div",{className:"space-y-3",children:Ve.map(kt=>or(kt))})
          ]},Ze);
        })
      }),

      a==="pairs"&&e.jsx("div",{className:"relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5",children:
        ie.map((Ze,Ve)=>e.jsxs("div",{className:"space-y-1",children:[
          e.jsxs("div",{className:"text-[11px] font-bold text-slate-500 px-1",children:["ក្រុមដៃគូ #",fr(Ve+1)]}),
          or(Ze)
        ]},Ze.deskId))
      }),

      e.jsxs("div",{className:\`relative z-10 pt-4 border-t flex flex-wrap items-center justify-center gap-4 text-xs font-semibold \${dark?"border-slate-800 text-slate-300":"border-slate-200 text-slate-600"}\`,children:[
        e.jsx("span",{children:"👑 ប្រធានថ្នាក់"}),
        e.jsx("span",{"aria-hidden":"true",children:"·"}),
        e.jsx("span",{children:"🎖️ អនុប្រធាន"}),
        e.jsx("span",{"aria-hidden":"true",children:"·"}),
        e.jsx("span",{children:"👁️ ជួរមុខ (ខ្សោយភ្នែក)"}),
        e.jsx("span",{"aria-hidden":"true",children:"·"}),
        e.jsx("span",{children:"📘 ជំនួយការសិក្សា"}),
        e.jsx("span",{"aria-hidden":"true",children:"·"}),
        e.jsx("span",{children:"📷 ចុចរូបកាមេរ៉ាដើម្បីដាក់រូបថតសិស្ស"})
      ]})
    ]}),

    e.jsxs("div",{className:"bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200 shadow-xs space-y-5",children:[
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
    ]}),

    h&&e.jsx("div",{className:"fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4",children:
      e.jsxs("div",{className:"bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4",children:[
        (()=>{
          const curPhoto=getSeatPhotoUrl(h,pmap,t||[]);
          return e.jsxs(e.Fragment,{children:[
            e.jsxs("div",{className:"flex items-center justify-between border-b pb-3.5 border-slate-100",children:[
              e.jsxs("div",{className:"flex items-center gap-3",children:[
                e.jsx("div",{className:"w-16 h-16 rounded-2xl border-2 border-amber-300 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 text-3xl",children:
                  curPhoto
                    ?e.jsx("img",{src:curPhoto,alt:h.name,referrerPolicy:"no-referrer",className:"w-full h-full object-cover"})
                    :e.jsx("span",{children:h.gender==="ស្រី"?"👧":"👦"})
                }),
                e.jsxs("div",{children:[
                  e.jsx("h4",{className:"font-extrabold text-base text-slate-900",children:h.name}),
                  e.jsxs("p",{className:"text-xs text-slate-500 font-semibold",children:["លេខរៀង #",fr(h.rollNo||h.id)," · ",h.gender," · ",r.grade||"ថ្នាក់ទី ៦"]})
                ]})
              ]}),
              e.jsx("button",{type:"button",onClick:()=>m(null),className:"p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer",children:e.jsx(Mr,{className:"w-4 h-4"})})
            ]}),
            e.jsxs("div",{className:"flex items-center gap-2",children:[
              e.jsxs("button",{type:"button",onClick:()=>triggerPhoto(h),className:"flex-1 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer",children:[
                e.jsx("span",{children:"📷"}),
                e.jsx("span",{children:curPhoto?"ប្តូររូបថតសិស្ស":"បញ្ចូលរូបថតសិស្ស"})
              ]}),
              curPhoto&&e.jsx("button",{type:"button",onClick:()=>removePhoto(h),className:"py-2.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl font-bold text-xs transition cursor-pointer",children:"🗑️ លុបរូប"})
            ]}),
            e.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs",children:[
              e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-500",children:"តួនាទីក្នុងថ្នាក់៖"}),e.jsx("span",{className:"font-bold text-slate-900",children:h.role})]}),
              e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-500",children:"ស្ថានភាពភ្នែក៖"}),e.jsx("span",{className:\`font-bold \${h.needsEyeCare?"text-amber-700":"text-emerald-700"}\`,children:h.needsEyeCare?"👁️ ខ្សោយភ្នែក (អង្គុយជួរមុខ)":"✅ ភ្នែកធម្មតា"})]}),
              e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-500",children:"កម្រិតសិក្សា៖"}),e.jsx("span",{className:\`font-bold \${h.isSlowLearner?"text-rose-700":"text-slate-700"}\`,children:h.isSlowLearner?"📘 ត្រូវការជំនួយបន្ថែម":"✅ រៀនធម្មតា"})]})
            ]}),
            e.jsxs("div",{className:"flex gap-2",children:[
              e.jsx("button",{type:"button",onClick:()=>{z(h),m(null),B(!0)},className:"flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition cursor-pointer",children:"🔄 ប្តូរកៅអីជាមួយសិស្សផ្សេង"}),
              e.jsx("button",{type:"button",onClick:()=>m(null),className:"px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer",children:"បិទ"})
            ]})
          ]});
        })()
      ]})
    }),

    PModal&&e.jsx("div",{className:"fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5",children:
      e.jsxs("div",{className:"bg-white rounded-[28px] border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden",children:[
        e.jsxs("div",{className:"p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between",children:[
          e.jsxs("div",{children:[
            e.jsx("h4",{className:"font-extrabold text-base text-slate-900",children:"📷 គ្រប់គ្រងរូបថតសិស្សលើប្លង់តុ"}),
            e.jsxs("p",{className:"text-xs text-slate-500 mt-0.5",children:["បានដាក់រូបថត ",fr(photoCount)," / ",fr(me)," នាក់ · រូបថតនឹងបង្ហាញលើប្លង់តុ និងពេលទាញយក PDF"]})
          ]}),
          e.jsx("button",{type:"button",onClick:()=>setPModal(!1),className:"p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer",children:e.jsx(Mr,{className:"w-4 h-4"})})
        ]}),
        e.jsx("div",{className:"p-3 sm:px-5 bg-slate-50 border-b border-slate-100",children:
          e.jsx("input",{type:"text",placeholder:"ស្វែងរកឈ្មោះសិស្ស...",value:pSearch,onChange:ev=>setPSearch(ev.target.value),className:"w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-amber-400"})
        }),
        e.jsx("div",{className:"flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3",children:
          le.filter(Ze=>!pSearch.trim()||Ze.name.toLowerCase().includes(pSearch.toLowerCase())).map(Ze=>{
            const pu=getSeatPhotoUrl(Ze,pmap,t||[]);
            return e.jsxs("div",{className:"p-3 rounded-2xl border border-slate-200 bg-white flex items-center gap-3",children:[
              e.jsx("div",{className:"w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 text-xl",children:
                pu?e.jsx("img",{src:pu,alt:Ze.name,referrerPolicy:"no-referrer",className:"w-full h-full object-cover"}):e.jsx("span",{children:Ze.gender==="ស្រី"?"👧":"👦"})
              }),
              e.jsxs("div",{className:"min-w-0 flex-1 space-y-1",children:[
                e.jsx("div",{className:"font-extrabold text-xs text-slate-900 truncate",children:Ze.name}),
                e.jsxs("div",{className:"text-[10px] text-slate-500 font-semibold",children:["#",fr(Ze.rollNo||Ze.id)," · ",Ze.gender]}),
                e.jsxs("div",{className:"flex items-center gap-1.5 pt-0.5",children:[
                  e.jsx("button",{type:"button",onClick:()=>triggerPhoto(Ze),className:"px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-[10px] cursor-pointer",children:pu?"ប្តូររូប":"បញ្ចូលរូប"}),
                  pu&&e.jsx("button",{type:"button",onClick:()=>removePhoto(Ze),className:"px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] cursor-pointer",children:"លុប"})
                ]})
              ]})
            ]},Ze.id);
          })
        }),
        e.jsx("div",{className:"p-4 border-t border-slate-100 flex justify-end",children:
          e.jsx("button",{type:"button",onClick:()=>setPModal(!1),className:"px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer",children:"រួចរាល់"})
        })
      ]})
    }),

    N&&e.jsx("div",{className:"fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4",children:
      e.jsxs("div",{className:"bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4",children:[
        e.jsxs("div",{className:"flex items-center justify-between border-b pb-3 border-slate-100",children:[
          e.jsxs("div",{className:"flex items-center gap-2.5",children:[
            e.jsx(w9,{className:"w-5 h-5 text-slate-800"}),
            e.jsx("h4",{className:"font-extrabold text-base text-slate-900",children:"ប្តូរកៅអីសិស្សឆ្លាស់គ្នា (Swap Seats)"})
          ]}),
          e.jsx("button",{type:"button",onClick:()=>B(!1),className:"p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer",children:e.jsx(Mr,{className:"w-4 h-4"})})
        ]}),
        e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs",children:[
          e.jsxs("div",{className:"p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2",children:[
            e.jsx("span",{className:"font-extrabold text-slate-900 block",children:"សិស្សទី ១៖"}),
            e.jsxs("select",{value:(O==null?void 0:O.id)||"",onChange:Ze=>{const Ve=Number(Ze.target.value),kt=de.find(ct=>ct.id===Ve);z(kt||null)},className:"w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none text-xs",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសសិស្សទី ១ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`a-\${Ze.id}\`))
            ]})
          ]}),
          e.jsxs("div",{className:"p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2",children:[
            e.jsx("span",{className:"font-extrabold text-slate-900 block",children:"សិស្សទី ២៖"}),
            e.jsxs("select",{value:(M==null?void 0:M.id)||"",onChange:Ze=>{const Ve=Number(Ze.target.value),kt=de.find(ct=>ct.id===Ve);V(kt||null)},className:"w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none text-xs",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសសិស្សទី ២ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},\`b-\${Ze.id}\`))
            ]})
          ]})
        ]}),
        e.jsx("div",{className:"p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 font-medium",children:"ប្រព័ន្ធនឹងប្តូរទីតាំងអង្គុយ រូបថត និងធ្វើបច្ចុប្បន្នភាពឈ្មោះសិស្សលើប្លង់តុភ្លាមៗ។"}),
        e.jsxs("div",{className:"flex items-center justify-end gap-2 pt-2 border-t border-slate-100",children:[
          e.jsx("button",{type:"button",onClick:()=>B(!1),className:"px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer",children:"បោះបង់"}),
          e.jsxs("button",{type:"button",onClick:be,disabled:!O||!M,className:"px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer",children:[
            e.jsx(ea,{className:"w-4 h-4 text-emerald-300"}),
            e.jsx("span",{children:"យល់ព្រមប្តូរកៅអី"})
          ]})
        ]})
      ]})
    }),

    e.jsx(RCe,{isOpen:A,onClose:()=>D(!1),teacher:r,students:t||[],committeeData:q,onSaveCommittee:Q,onAutoOptimizeSeating:R,onShowToast:s}),
    e.jsx(LCe,{isOpen:T,onClose:()=>E(!1),teacher:r,gridDesks:ie,sanitationDuty:Ce,layoutMode:a,themeStyle:G,showHighlights:o,photosMap:pmap,students:t||[]}),
    (()=>{
      const Ze=r.academicYear||"២០២៥ - ២០២៦";
      const pdfVisualHtml=X?buildVisualSeatingHtml({
        teacher:r,gridDesks:ie,layoutMode:a,themeStyle:G,showHighlights:o,
        photosMap:pmap,students:t||[],sanitationDuty:Ce,bwMode:!1,showStats:!0,showSanitation:!1,
        academicYear:Ze,forOiBody:!0
      }):"";
      return e.jsx(Oi,{
        isOpen:X,
        onClose:()=>H(!1),
        documentType:"seating_chart",
        title:"ទាញយក PDF ប្លង់តុសិស្ស (ផ្តេក Landscape · ដូចការបង្ហាញ)",
        initialStyles:{orientation:"landscape",marginSize:"tight",fontSize:"small"},
        initialHeader:{
          docTitle:"ប្លង់តុ និងការរៀបចំសណ្តាប់ធ្នាប់ថ្នាក់រៀន",
          docSubtitle:\`ប្លង់ \${fr(Qe)} ជួរទទឹង × \${fr(Et)} ជួរបណ្តាយ (\${fr(ie.length)} តុទ្វេ · \${fr(me)} សិស្ស) ឆ្នាំសិក្សា \${Ze}\`,
          schoolName:r.school||"សាលាបឋមសិក្សាគំរូ",
          teacherName:r.name||"",
          gradeLevel:r.grade||"ថ្នាក់ទី ៦",
          academicYear:Ze,
          officeInfo:"ការិយាល័យអប់រំ យុវជន និងកីឡា"
        },
        customTableHtml:pdfVisualHtml,
        onShowToast:s
      });
    })()
  ]});
}`;

// Assemble safely without shifting offsets before splicing
const updated =
  src.slice(0, lceStart) +
  newLceAndHelpers +
  src.slice(dmStart, a2Start) +
  newA2KAndMce +
  src.slice(mceEnd);

fs.writeFileSync(FILE, updated, "utf8");

const sf = ts.createSourceFile(FILE, updated, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("Parse diagnostics:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("SUCCESS: patched seating chart v119, 0 parse diagnostics, length:", updated.length);
