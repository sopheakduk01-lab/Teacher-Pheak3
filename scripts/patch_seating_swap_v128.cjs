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

// 1. Add persistent seatOrder + cols state, quick moveMode/pickedSeat/dragSeat states, buildOrderedDesks, and layout helpers in MCe
replaceExact(
  "MCe seating states & persistent swap logic",
`  const[O,z]=y.useState(null);
  const[M,V]=y.useState(null);
  const[G,F]=y.useState("warm_class");
  const[Z,Y]=y.useState(4);
  const U=\`moeys_classroom_committee_\${r.grade||"default"}\`;
  const pKey=\`moeys_seating_photos_\${r.grade||"default"}\`;`,
`  const[O,z]=y.useState(null);
  const[M,V]=y.useState(null);
  const[moveMode,setMoveMode]=y.useState(!1);
  const[pickedSeat,setPickedSeat]=y.useState(null);
  const[dragSeat,setDragSeat]=y.useState(null);
  const[dragOverKey,setDragOverKey]=y.useState(null);
  const[G,F]=y.useState("warm_class");
  const sKey=\`moeys_seating_order_\${(r&&r.academicYear)||"default"}_\${(r&&r.grade)||"default"}\`;
  const readSavedLayout=()=>{
    try{const raw=localStorage.getItem(sKey);if(raw){const p=JSON.parse(raw);if(p&&typeof p=="object")return p}}catch{}
    try{const yr=(r&&r.academicYear)||Qi(),fb=$r(yr,"classroom_seating_layout",null);if(fb&&typeof fb=="object")return fb}catch{}
    return null;
  };
  const[Z,Y]=y.useState(()=>{const sv=readSavedLayout();return sv&&Number(sv.cols)>=2&&Number(sv.cols)<=6?Number(sv.cols):4});
  const[seatOrder,setSeatOrder]=y.useState(()=>{const sv=readSavedLayout();return sv&&Array.isArray(sv.order)?sv.order:null});
  const saveSeatLayout=(nextOrder,nextCols)=>{
    const cVal=nextCols||Z;
    setSeatOrder(nextOrder);
    const payload={order:nextOrder,cols:cVal,updatedAt:Date.now()};
    try{localStorage.setItem(sKey,JSON.stringify(payload))}catch{}
    try{const yr=(r&&r.academicYear)||Qi();Gr(yr,"classroom_seating_layout",payload);Gr(yr,"last_modified",Date.now())}catch{}
  };
  const buildOrderedDesks=(stList,colsCount,gradeStr,commData,customOrder)=>{
    const base=A2(stList||[],colsCount,gradeStr,commData);
    if(!Array.isArray(customOrder)||customOrder.length===0)return base;
    const byId=new Map();
    base.forEach(dk=>{[dk.seatLeft,dk.seatRight].forEach(st=>{st&&st.id>0&&st.name!=="(ទំនេរ)"&&byId.set(st.id,st)})});
    const slots=[];
    customOrder.forEach(sid=>{
      if(sid&&Number(sid)>0&&byId.has(Number(sid))){
        const st=byId.get(Number(sid));
        slots.push(st);
        byId.delete(Number(sid));
      }else slots.push(null);
    });
    for(const rem of byId.values()){
      const eIdx=slots.findIndex(x=>x===null);
      eIdx!==-1?slots[eIdx]=rem:slots.push(rem);
    }
    while(slots.length<base.length*2)slots.push(null);
    while(slots.length>base.length*2&&slots.length>=2&&slots[slots.length-1]===null&&slots[slots.length-2]===null){slots.pop();slots.pop()}
    if(slots.length%2!==0)slots.push(null);
    const totalDesks=Math.max(1,Math.ceil(slots.length/2)),o=Math.max(1,colsCount),c=Math.max(1,Math.ceil(totalDesks/o)),out=[];
    for(let h=1;h<=c;h++)for(let m=1;m<=o;m++){
      const w=(h-1)*o+(m-1);
      if(w>=totalDesks)continue;
      let D="standard";
      h===1?D="front_eyecare":h===2||h===3?D="center_leader":h===c&&(D="back_support");
      const sL=slots[w*2]||{id:-100-w,rollNo:0,name:"(ទំនេរ)",gender:"ប្រុស",role:"កៅអីទំនេរ"};
      const sR=slots[w*2+1]||{id:-200-w,rollNo:0,name:"(ទំនេរ)",gender:"ស្រី",role:"កៅអីទំនេរ"};
      out.push({deskId:\`D-R\${h}C\${m}\`,colIndex:m,rowIndex:h,deskLabel:\`ជួរ \${fr(h)} · តុ \${fr(m)}\`,deskType:D,seatLeft:sL,seatRight:sR});
    }
    return out;
  };
  const U=\`moeys_classroom_committee_\${r.grade||"default"}\`;
  const pKey=\`moeys_seating_photos_\${r.grade||"default"}\`;`
);

// 2. Replace ie initialization & useEffect so custom seatOrder persists across reloads, tab changes, photo updates, and committee edits
replaceExact(
  "MCe ie state & effect with buildOrderedDesks",
`  const[ie,re]=y.useState(()=>A2(t||[],4,r.grade,q));
  y.useEffect(()=>{t&&t.length>0&&re(A2(t,Z,r.grade,q))},[t,Z,r.grade,q]);`,
`  y.useEffect(()=>{const sv=readSavedLayout();sv&&Number(sv.cols)>=2&&Number(sv.cols)<=6&&Y(Number(sv.cols));setSeatOrder(sv&&Array.isArray(sv.order)?sv.order:null);setPickedSeat(null);setMoveMode(!1)},[sKey]);
  const[ie,re]=y.useState(()=>buildOrderedDesks(t||[],Z,r.grade,q,seatOrder));
  y.useEffect(()=>{t&&t.length>0&&re(buildOrderedDesks(t,Z,r.grade,q,seatOrder))},[t,Z,r.grade,q,seatOrder]);`
);

// 3. Clear custom seatOrder on Optimize (R) and Reset (De), and fix Be() & be() + add swapSlotsByDesk()
replaceExact(
  "MCe R optimize resets custom order cleanly",
`  const R=Ze=>{ae(Ze);try{localStorage.setItem(U,JSON.stringify(Ze))}catch(kt){console.error(kt)}const Ve=A2(t||[],Z,r.grade,Ze);re(Ve),s(\`✨ បានរៀបប្លង់តុឆ្លាតវៃ៖ សិស្សពិបាកមើល \${Ze.eyeCareIds.length} នាក់នៅជួរមុខ!\`)};`,
`  const R=Ze=>{ae(Ze);try{localStorage.setItem(U,JSON.stringify(Ze))}catch(kt){console.error(kt)}saveSeatLayout(null,Z);const Ve=A2(t||[],Z,r.grade,Ze);re(Ve),s(\`✨ បានរៀបប្លង់តុឆ្លាតវៃ៖ សិស្សពិបាកមើល \${Ze.eyeCareIds.length} នាក់នៅជួរមុខ!\`)};`
);

replaceExact(
  "MCe De, Be, be swap fixes",
`  const De=()=>{
    t&&t.length>0?(re(A2(t,Z,r.grade,q)),s(\`✨ បានរៀបប្លង់តុស្វ័យប្រវត្តិតាមទិន្នន័យសិស្ស \${t.length} នាក់ (\${Z} ជួរទទឹង)\`)):(re(K$()),s("✨ បានរៀបប្លង់តុស្វ័យប្រវត្តិតាមគំរូ ៤ ជួរទទឹង × ៦ ជួរបណ្តាយ"));
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
  };`,
`  const De=()=>{
    saveSeatLayout(null,Z);setPickedSeat(null);setMoveMode(!1);
    t&&t.length>0?(re(A2(t,Z,r.grade,q)),s(\`✨ បានរៀបប្លង់តុដើមឡើងវិញតាមទិន្នន័យសិស្ស \${t.length} នាក់ (\${Z} ជួរទទឹង)\`)):(re(K$()),s("✨ បានរៀបប្លង់តុស្វ័យប្រវត្តិតាមគំរូ ៤ ជួរទទឹង × ៦ ជួរបណ្តាយ"));
  };
  const swapSlotsByDesk=(dA,sideA,dB,sideB)=>{
    const slots=ie.flatMap(dk=>[dk.seatLeft,dk.seatRight]);
    const iA=ie.findIndex(dk=>dk.deskId===dA)*2+(sideA==="right"?1:0);
    const iB=ie.findIndex(dk=>dk.deskId===dB)*2+(sideB==="right"?1:0);
    if(iA<0||iB<0||iA>=slots.length||iB>=slots.length||iA===iB)return;
    const stA=slots[iA],stB=slots[iB];
    const tmp=slots[iA];slots[iA]=slots[iB];slots[iB]=tmp;
    const nxtOrder=slots.map(st=>st&&st.id>0&&st.name!=="(ទំនេរ)"?st.id:null);
    saveSeatLayout(nxtOrder,Z);
    const aEmpty=!stA||stA.id<0||stA.name==="(ទំនេរ)",bEmpty=!stB||stB.id<0||stB.name==="(ទំនេរ)";
    if(aEmpty&&!bEmpty)s(\`🪑 បានផ្លាស់ទី «\${stB.name}» ទៅកៅអីទំនេរ!\`);
    else if(bEmpty&&!aEmpty)s(\`🪑 បានផ្លាស់ទី «\${stA.name}» ទៅកៅអីទំនេរ!\`);
    else s(\`🔄 បានប្តូរកន្លែងអង្គុយ «\${stA.name}» ↔ «\${stB.name}» រួចរាល់!\`);
  };
  const Be=Ze=>{
    swapSlotsByDesk(Ze,"left",Ze,"right");
  };
  const findSlotOf=(obj)=>{
    if(!obj)return null;
    for(const dk of ie){
      if(dk.seatLeft&&dk.seatLeft.id===obj.id)return{deskId:dk.deskId,side:"left"};
      if(dk.seatRight&&dk.seatRight.id===obj.id)return{deskId:dk.deskId,side:"right"};
    }
    return null;
  };
  const be=()=>{
    if(!O||!M){s("សូមជ្រើសរើសទីតាំង/សិស្ស ២ កន្លែងដើម្បីប្តូរគ្នា");return}
    if(O.id===M.id){s("សូមជ្រើសរើសកៅអីពីរផ្សេងគ្នា");return}
    const pA=findSlotOf(O),pB=findSlotOf(M);
    if(!pA||!pB){s("រកមិនឃើញទីតាំងកៅអីសិស្សទេ");return}
    swapSlotsByDesk(pA.deskId,pA.side,pB.deskId,pB.side);
    B(!1),z(null),V(null);
  };`
);

// 4. Make Cr (both student seats AND empty seats) support Drag & Drop + Quick Click-to-Swap mode + visual active ring!
replaceExact(
  "MCe Cr draggable & clickable seats including empty seats",
`  const Cr=(Ze,Ve)=>{
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
      :(Ze.isPresident?"bg-amber-50 border-amber-400 shadow-xs":Ze.isVicePresident1?"bg-indigo-50 border-indigo-300 shadow-xs":Ze.isVicePresident2?"bg-cyan-50 border-cyan-300 shadow-xs":Ze.isVicePresident3?"bg-purple-50 border-purple-300 shadow-xs":Ft?"bg-amber-50 border-amber-300 shadow-2xs":isGirl?"bg-pink-50 border-pink-200 hover:border-pink-400":"bg-sky-50 border-sky-200 hover:border-sky-400");
    const ringCls=Ze.isPresident?"border-amber-400":Ze.isVicePresident1?"border-indigo-500":Ze.isVicePresident2?"border-cyan-500":Ze.isVicePresident3?"border-purple-500":isGirl?"border-pink-400":"border-sky-400";

    return e.jsxs("div",{onClick:()=>m(Ze),className:\`cursor-pointer rounded-xl p-2 border transition-all duration-150 relative flex flex-col items-center text-center gap-1.5 min-h-[108px] group/seat \${cardCls}\`,children:[`,
`  const Cr=(Ze,Ve,deskId,sideKey)=>{
    const ct=Ze.name==="(ទំនេរ)"||Ze.id<0;
    const slotKey=\`\${deskId}-\${sideKey}\`;
    const isPicked=!!(pickedSeat&&pickedSeat.deskId===deskId&&pickedSeat.side===sideKey);
    const isDropTarget=dragOverKey===slotKey&&(!dragSeat||dragSeat.deskId!==deskId||dragSeat.side!==sideKey);
    const canQuickDrop=!!(moveMode&&pickedSeat&&!isPicked);
    const onSeatClick=()=>{
      if(moveMode){
        if(!pickedSeat){if(!ct)setPickedSeat({deskId,side:sideKey,seat:Ze});return}
        if(isPicked){setPickedSeat(null);return}
        swapSlotsByDesk(pickedSeat.deskId,pickedSeat.side,deskId,sideKey);
        setPickedSeat(null);
        return;
      }
      !ct&&m(Ze);
    };
    const dndHandlers={
      onDragOver:ev=>{ev.preventDefault();try{ev.dataTransfer.dropEffect="move"}catch{}dragOverKey!==slotKey&&setDragOverKey(slotKey)},
      onDragLeave:()=>{dragOverKey===slotKey&&setDragOverKey(null)},
      onDrop:ev=>{ev.preventDefault();setDragOverKey(null);if(dragSeat&&(dragSeat.deskId!==deskId||dragSeat.side!==sideKey)){swapSlotsByDesk(dragSeat.deskId,dragSeat.side,deskId,sideKey);setDragSeat(null);setPickedSeat(null)}}
    };
    const Ft=!ct&&Ze.needsEyeCare&&o;
    const jr=!ct&&Ze.isLeader;
    const pUrl=ct?"":getSeatPhotoUrl(Ze,pmap,t||[]);
    const isGirl=Ze.gender==="ស្រី";
    if(ct){
      return e.jsxs("div",{...dndHandlers,onClick:onSeatClick,className:\`rounded-xl p-2 border-2 border-dashed flex flex-col justify-center items-center text-center min-h-[104px] select-none transition-all \${isDropTarget||canQuickDrop?(dark?"border-emerald-400 bg-emerald-950/50 text-emerald-200 ring-2 ring-emerald-400/50 cursor-pointer":"border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400/40 cursor-pointer hover:bg-emerald-100"):(dark?"border-slate-700 bg-slate-900/40 text-slate-500":"border-slate-200 bg-slate-50/70 text-slate-400")}\`,children:[
        e.jsx("span",{className:"text-base opacity-60",children:isDropTarget||canQuickDrop?"⬇️":"🪑"}),
        e.jsx("span",{className:"text-[11px] font-bold mt-1",children:isDropTarget||canQuickDrop?"ដាក់អង្គុយទីនេះ":"កៅអីទំនេរ"}),
        e.jsxs("span",{className:"text-[9px] opacity-75",children:["(",Ve,")"]})
      ]});
    }
    const cardCls=dark
      ?(Ze.isPresident?"bg-amber-950/50 border-amber-400/70":jr?"bg-indigo-950/70 border-indigo-400/60":Ft?"bg-amber-950/40 border-amber-500/50":"bg-slate-900/90 border-slate-700 hover:border-slate-500")
      :(Ze.isPresident?"bg-amber-50 border-amber-400 shadow-xs":Ze.isVicePresident1?"bg-indigo-50 border-indigo-300 shadow-xs":Ze.isVicePresident2?"bg-cyan-50 border-cyan-300 shadow-xs":Ze.isVicePresident3?"bg-purple-50 border-purple-300 shadow-xs":Ft?"bg-amber-50 border-amber-300 shadow-2xs":isGirl?"bg-pink-50 border-pink-200 hover:border-pink-400":"bg-sky-50 border-sky-200 hover:border-sky-400");
    const ringCls=Ze.isPresident?"border-amber-400":Ze.isVicePresident1?"border-indigo-500":Ze.isVicePresident2?"border-cyan-500":Ze.isVicePresident3?"border-purple-500":isGirl?"border-pink-400":"border-sky-400";
    const moveCls=isPicked?"ring-4 ring-amber-400 border-amber-500 scale-[1.03] z-20 shadow-lg":isDropTarget?"ring-4 ring-emerald-500 border-emerald-500 scale-[1.03] z-20":canQuickDrop?"hover:ring-2 hover:ring-blue-500 cursor-pointer":"";
    return e.jsxs("div",{...dndHandlers,draggable:!0,onDragStart:ev=>{setDragSeat({deskId,side:sideKey,seat:Ze});try{ev.dataTransfer.effectAllowed="move";ev.dataTransfer.setData("text/plain",String(Ze.id))}catch{}},onDragEnd:()=>{setDragSeat(null);setDragOverKey(null)},onClick:onSeatClick,title:moveMode?(isPicked?"ចុចម្ដងទៀតដើម្បីបោះបង់":pickedSeat?\`ចុចដើម្បីប្តូរកន្លែងជាមួយ \${pickedSeat.seat.name}\`:"ចុចដើម្បីជ្រើសសិស្សនេះ"):"ចុចដើម្បីមើលព័ត៌មាន ឬអូស-ទម្លាក់លើកៅអីផ្សេងដើម្បីប្តូរកន្លែង",className:\`\${moveMode?"cursor-pointer":"cursor-grab active:cursor-grabbing"} rounded-xl p-2 border transition-all duration-150 relative flex flex-col items-center text-center gap-1.5 min-h-[108px] group/seat \${cardCls} \${moveCls}\`,children:[
      isPicked&&e.jsx("span",{className:"absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black shadow-xs whitespace-nowrap",children:"កំពុងជ្រើស"}),`
);

// 5. Pass deskId and sideKey into Cr(...) calls inside or(Ze)
replaceExact(
  "Pass deskId and sideKey into Cr calls",
`        Cr(Ze.seatLeft,"ឆ្វេង"),
        Cr(Ze.seatRight,"ស្តាំ")`,
`        Cr(Ze.seatLeft,"ឆ្វេង",Ze.deskId,"left"),
        Cr(Ze.seatRight,"ស្តាំ",Ze.deskId,"right")`
);

// 6. Save columns (Z) when clicking 2,3,4,5,6 + add Quick Click-Swap toggle button in toolbar
replaceExact(
  "Persist Z columns on button click",
`[2,3,4,5,6].map(Ze=>e.jsx("button",{type:"button",onClick:()=>{Y(Ze),s(\`បានប្តូរទៅជា \${fr(Ze)} ជួរទទឹង\`)},`,
`[2,3,4,5,6].map(Ze=>e.jsx("button",{type:"button",onClick:()=>{Y(Ze),saveSeatLayout(seatOrder,Ze),s(\`បានប្តូរទៅជា \${fr(Ze)} ជួរទទឹង\`)},`
);

replaceExact(
  "Add Quick Click-to-Swap toggle button in toolbar",
`          e.jsxs("button",{type:"button",onClick:()=>B(!0),className:"px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(w9,{className:"w-3.5 h-3.5 text-amber-300"}),
            e.jsx("span",{children:"ប្តូរកៅអីសិស្ស"})
          ]}),`,
`          e.jsxs("button",{type:"button",onClick:()=>{setMoveMode(v=>{const nxt=!v;nxt||setPickedSeat(null);return nxt})},className:\`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0 \${moveMode?"bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-2 ring-amber-300":"bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300"}\`,title:"ចុចលើសិស្ស ២ នាក់ (ឬកៅអីទំនេរ) ដើម្បីប្តូរកន្លែងផ្ទាល់លើតុ",children:[
            e.jsx("span",{children:moveMode?"✅":"✋"}),
            e.jsx("span",{children:moveMode?"រួចរាល់ (កំពុងប្តូរកន្លែង)":"ប្តូរកន្លែងលើតុ"})
          ]}),
          e.jsxs("button",{type:"button",onClick:()=>B(!0),className:"px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0",children:[
            e.jsx(w9,{className:"w-3.5 h-3.5 text-amber-300"}),
            e.jsx("span",{children:"ប្តូរតាមបញ្ជី"})
          ]}),`
);

// 7. Add helpful interactive banner inside stage
replaceExact(
  "Add live moveMode instruction banner above desks",
`        e.jsx("div",{className:\`text-center text-xs font-bold \${dark?"text-slate-400":"text-slate-500"}\`,children:"▲ ជួរមុខ (ជិតក្តារខៀន និងតុគ្រូ) ▲"})
      ]}),`,
`        moveMode&&e.jsxs("div",{className:"max-w-3xl mx-auto px-4 py-2.5 rounded-2xl border-2 border-amber-400 bg-amber-50 text-amber-950 flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold shadow-xs",children:[
          e.jsx("span",{children:pickedSeat?\`🎯 កំពុងជ្រើស «\${pickedSeat.seat.name}» — សូមចុចលើសិស្សផ្សេង ឬ កៅអីទំនេរ ដើម្បីប្តូរកន្លែង!\`:"✋ របៀបប្តូរកន្លែង៖ ចុចជ្រើសសិស្សទី ១ រួចចុចលើសិស្សទី ២ ឬកៅអីទំនេរ (អាចអូស-ទម្លាក់ផ្ទាល់បានផងដែរ!)"}),
          e.jsxs("div",{className:"flex items-center gap-1.5",children:[
            pickedSeat&&e.jsx("button",{type:"button",onClick:()=>setPickedSeat(null),className:"px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer",children:"បោះបង់សិស្សនេះ"}),
            e.jsx("button",{type:"button",onClick:()=>{setMoveMode(!1),setPickedSeat(null)},className:"px-2.5 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 cursor-pointer",children:"បិទរបៀបប្តូរ"})
          ]})
        ]}),
        e.jsx("div",{className:\`text-center text-xs font-bold \${dark?"text-slate-400":"text-slate-500"}\`,children:"▲ ជួរមុខ (ជិតក្តារខៀន និងតុគ្រូ) ▲"})
      ]}),`
);

// 8. Enhance Student Detail Modal swap button + allow Swap Modal dropdowns to show Desk labels & empty seats
replaceExact(
  "Enhance seat detail modal swap buttons",
`              e.jsx("button",{type:"button",onClick:()=>{z(h),m(null),B(!0)},className:"flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition cursor-pointer",children:"🔄 ប្តូរកៅអីជាមួយសិស្សផ្សេង"}),`,
`              e.jsx("button",{type:"button",onClick:()=>{const slot=findSlotOf(h);setMoveMode(!0),slot&&setPickedSeat({deskId:slot.deskId,side:slot.side,seat:h}),m(null)},className:"flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-extrabold text-xs transition cursor-pointer",children:"✋ ចុចរើសកៅអីប្តូរលើតុ"}),
              e.jsx("button",{type:"button",onClick:()=>{z(h),m(null),B(!0)},className:"px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition cursor-pointer",children:"🔄 តាមបញ្ជី"}),`
);

replaceExact(
  "Allow empty chairs & desk labels in Swap Modal dropdowns",
`        e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs",children:[
          e.jsxs("div",{className:"p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2",children:[
            e.jsx("span",{className:"font-extrabold text-slate-900 block",children:"សិស្សទី ១៖"}),
            e.jsxs("select",{value:(O==null?void 0:O.id)||"",onChange:Ze=>{const Ve=Number(Ze.target.value),kt=de.find(ct=>ct.id===Ve);z(kt||null)},className:"w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none text-xs",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសសិស្សទី ១ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},` + "`a-${Ze.id}`" + `))
            ]})
          ]}),
          e.jsxs("div",{className:"p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2",children:[
            e.jsx("span",{className:"font-extrabold text-slate-900 block",children:"សិស្សទី ២៖"}),
            e.jsxs("select",{value:(M==null?void 0:M.id)||"",onChange:Ze=>{const Ve=Number(Ze.target.value),kt=de.find(ct=>ct.id===Ve);V(kt||null)},className:"w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none text-xs",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសសិស្សទី ២ --"}),
              de.map(Ze=>e.jsxs("option",{value:Ze.id,children:["#",Ze.rollNo||Ze.id," - ",Ze.name," (",Ze.gender,")"]},` + "`b-${Ze.id}`" + `))
            ]})
          ]})
        ]}),`,
`        (()=>{const allSeatOpts=ie.flatMap(dk=>[{st:dk.seatLeft,lbl:\`\${dk.deskLabel} · ឆ្វេង\`},{st:dk.seatRight,lbl:\`\${dk.deskLabel} · ស្តាំ\`}]);return e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs",children:[
          e.jsxs("div",{className:"p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2",children:[
            e.jsx("span",{className:"font-extrabold text-slate-900 block",children:"ទីតាំង / សិស្សទី ១៖"}),
            e.jsxs("select",{value:(O==null?void 0:O.id)||"",onChange:Ze=>{const Ve=Number(Ze.target.value),kt=allSeatOpts.find(x=>x.st.id===Ve);z(kt?kt.st:null)},className:"w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none text-xs",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសកៅអីទី ១ --"}),
              allSeatOpts.map(opt=>e.jsxs("option",{value:opt.st.id,children:[opt.st.id>0?\`#\${opt.st.rollNo||opt.st.id} - \${opt.st.name}\`:"🪑 កៅអីទំនេរ"," (",opt.lbl,")"]},\`a-\${opt.st.id}\`))
            ]})
          ]}),
          e.jsxs("div",{className:"p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2",children:[
            e.jsx("span",{className:"font-extrabold text-slate-900 block",children:"ទីតាំង / សិស្សទី ២៖"}),
            e.jsxs("select",{value:(M==null?void 0:M.id)||"",onChange:Ze=>{const Ve=Number(Ze.target.value),kt=allSeatOpts.find(x=>x.st.id===Ve);V(kt?kt.st:null)},className:"w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none text-xs",children:[
              e.jsx("option",{value:"",children:"-- ជ្រើសរើសកៅអីទី ២ --"}),
              allSeatOpts.map(opt=>e.jsxs("option",{value:opt.st.id,children:[opt.st.id>0?\`#\${opt.st.rollNo||opt.st.id} - \${opt.st.name}\`:"🪑 កៅអីទំនេរ"," (",opt.lbl,")"]},\`b-\${opt.st.id}\`))
            ]})
          ]})
        ]})})(),`
);

// Parse JS AST to guarantee 0 syntax errors
const sf = ts.createSourceFile("index.js", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  const first = sf.parseDiagnostics[0];
  throw new Error(`TS parse error at pos ${first.start}: ${ts.flattenDiagnosticMessageText(first.messageText, "\n")}`);
}

fs.writeFileSync(targetPath, code, "utf8");
console.log("✓ Validated AST and wrote updated bundle:", targetPath);
