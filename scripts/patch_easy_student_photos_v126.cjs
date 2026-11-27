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

// 1. Add quick/batch student photo manager states & handlers in ytt
replaceExact(
  "ytt quick photo states & handlers",
  `mc=y.useRef(null),M0=y.useRef(null),xd=y.useRef(null),mu=y.useRef(null),[qi,If]=y.useState(!1),_l=async(oe,ft)=>{try{if(!oe.type.startsWith("image/")){alert("សូមជ្រើសរើសឯកសាររូបភាព (JPG, PNG, WEBP, etc.)");return}If(!0);const ir=await bv(oe,{maxWidth:360,maxHeight:360,quality:.85,mimeType:"image/jpeg"});ft==="new"?pc(ir):ft==="edit"&&rs&&sa(Or=>Or?{...Or,avatar:ir}:null)}catch(ir){console.error("Failed to compress/upload student photo:",ir),alert("មិនអាចដំណើរការរូបថតបានទេ សូមសាកល្បងម្ដងទៀត")}finally{If(!1)}}`,
  `mc=y.useRef(null),M0=y.useRef(null),xd=y.useRef(null),mu=y.useRef(null),qPhotoFileRef=y.useRef(null),qPhotoCamRef=y.useRef(null),qBatchFileRef=y.useRef(null),qPhotoTargetRef=y.useRef(null),[pMgrOpen,setPMgrOpen]=y.useState(!1),[pMgrSearch,setPMgrSearch]=y.useState(""),[pMgrFilter,setPMgrFilter]=y.useState("all"),[pMgrDragId,setPMgrDragId]=y.useState(null),[pBatchQueue,setPBatchQueue]=y.useState([]),[pBatchBusy,setPBatchBusy]=y.useState(!1),syncSeatPmap=(sid,sname,val)=>{try{const pk=\`moeys_seating_photos_\${(r&&r.grade)||"default"}\`,raw=localStorage.getItem(pk);if(!raw)return;const parsed=JSON.parse(raw);if(!parsed||!parsed.byId)return;if(val){if(parsed.byId[String(sid)]){parsed.byId[String(sid)]=val;localStorage.setItem(pk,JSON.stringify(parsed));}}else{let ch=!1;if(parsed.byId[String(sid)]){delete parsed.byId[String(sid)];ch=!0;}if(sname&&parsed.nameToId&&parsed.nameToId[sname]){delete parsed.byId[parsed.nameToId[sname]];delete parsed.nameToId[sname];ch=!0;}if(ch)localStorage.setItem(pk,JSON.stringify(parsed));}}catch{}},saveDirectPhoto=async(stObj,file)=>{if(!stObj||!file)return;if(!file.type.startsWith("image/")){F("⚠️ សូមជ្រើសរើសឯកសាររូបភាព (JPG, PNG, WEBP)");return}try{If(!0);const ir=await bv(file,{maxWidth:260,maxHeight:260,quality:.82,mimeType:"image/jpeg"});l({...stObj,avatar:ir});syncSeatPmap(stObj.id,stObj.name,ir);F(\`📷 បានដាក់រូបថត «\${stObj.name}» រួចរាល់!\`);}catch(err){console.error("Quick photo error:",err);F("⚠️ មិនអាចដំណើរការរូបថតបានទេ");}finally{If(!1);}},removeDirectPhoto=stObj=>{if(!stObj)return;l({...stObj,avatar:void 0});syncSeatPmap(stObj.id,stObj.name,null);F(\`🗑️ បានលុបរូបថត «\${stObj.name}»\`);},triggerQuickPhoto=(stObj,useCam=!1)=>{qPhotoTargetRef.current=stObj;const ref=useCam?qPhotoCamRef.current:qPhotoFileRef.current;if(ref){ref.value="";ref.click();}},handleBatchPhotos=async fileList=>{const files=Array.from(fileList||[]).filter(f=>f.type&&f.type.startsWith("image/"));if(!files.length){F("⚠️ សូមជ្រើសរើសឯកសាររូបភាព!");return}setPBatchBusy(!0);try{const norm=v=>String(v||"").toLowerCase().replace(/[\\s_\\-.]+/g,"");const updates=new Map();const unmatched=[];const usedIds=new Set();for(const file of files){const dataUrl=await bv(file,{maxWidth:260,maxHeight:260,quality:.82,mimeType:"image/jpeg"});const base=file.name.replace(/\\.[^/.]+$/,"");const bNorm=norm(base);let match=n.find(st=>!usedIds.has(st.id)&&(norm(st.name)===bNorm||(st.latinName&&norm(st.latinName)===bNorm)||(st.civilId&&norm(st.civilId)===bNorm)));if(!match&&bNorm.length>=3){match=n.find(st=>!usedIds.has(st.id)&&(bNorm.includes(norm(st.name))||(st.latinName&&norm(st.latinName).length>=3&&bNorm.includes(norm(st.latinName)))));}if(!match){const numM=base.match(/(?:^|\\D)(\\d{1,3})(?:\\D|$)/);if(numM){const rn=Number(numM[1]);match=n.find(st=>!usedIds.has(st.id)&&Number(st.rollNo)===rn);}}if(match){usedIds.add(match.id);updates.set(match.id,dataUrl);}else{unmatched.push({uid:Math.random().toString(36).slice(2,9),fileName:file.name,dataUrl,targetId:""});}}if(updates.size>0){const nextList=n.map(st=>updates.has(st.id)?{...st,avatar:updates.get(st.id)}:st);if(o)o(nextList,!0);else nextList.forEach(st=>{if(updates.has(st.id))l(st)});updates.forEach((url,id)=>{const st=n.find(x=>x.id===id);if(st)syncSeatPmap(id,st.name,url);});}if(unmatched.length>0){const missingSt=n.filter(st=>!st.avatar&&!updates.has(st.id));const prefilled=unmatched.map((item,idx)=>({...item,targetId:missingSt[idx]?String(missingSt[idx].id):""}));setPBatchQueue(prev=>[...prev,...prefilled]);}if(updates.size>0&&unmatched.length===0)F(\`📷 បានភ្ជាប់រូបថតសិស្ស \${updates.size} នាក់ដោយស្វ័យប្រវត្តិរួចរាល់!\`);else if(updates.size>0)F(\`📷 ភ្ជាប់បាន \${updates.size} នាក់ · នៅសល់ \${unmatched.length} រូបសម្រាប់ជ្រើសឈ្មោះសិស្ស!\`);else F(\`📂 បានផ្ទុករូប \${unmatched.length} សន្លឹក! សូមជ្រើសឈ្មោះសិស្សខាងក្រោម ហើយចុចភ្ជាប់\`);}catch(err){console.error("Batch photo error:",err);F("⚠️ មានបញ្ហាក្នុងការដំណើរការរូបថត!");}finally{setPBatchBusy(!1);}},applyBatchQueue=()=>{const chosen=pBatchQueue.filter(it=>it.targetId);if(!chosen.length){F("⚠️ សូមជ្រើសរើសឈ្មោះសិស្សយ៉ាងតិច ១ នាក់!");return}const mapById=new Map();chosen.forEach(it=>mapById.set(Number(it.targetId),it.dataUrl));const nextList=n.map(st=>mapById.has(st.id)?{...st,avatar:mapById.get(st.id)}:st);if(o)o(nextList,!0);else nextList.forEach(st=>{if(mapById.has(st.id))l(st)});mapById.forEach((url,id)=>{const st=n.find(x=>x.id===id);if(st)syncSeatPmap(id,st.name,url);});setPBatchQueue(prev=>prev.filter(it=>!it.targetId));F(\`📷 បានដាក់រូបថតសិស្ស \${mapById.size} នាក់ជោគជ័យ!\`);},[qi,If]=y.useState(!1),_l=async(oe,ft)=>{try{if(!oe.type.startsWith("image/")){alert("សូមជ្រើសរើសឯកសាររូបភាព (JPG, PNG, WEBP, etc.)");return}If(!0);const ir=await bv(oe,{maxWidth:260,maxHeight:260,quality:.82,mimeType:"image/jpeg"});ft==="new"?pc(ir):ft==="edit"&&rs&&sa(Or=>Or?{...Or,avatar:ir}:null)}catch(ir){console.error("Failed to compress/upload student photo:",ir),alert("មិនអាចដំណើរការរូបថតបានទេ សូមសាកល្បងម្ដងទៀត")}finally{If(!1)}}`
);

// 2. Add prominent "📷 ដាក់រូបថតសិស្សរហ័ស" button to Student List toolbar
replaceExact(
  "ytt Student List Quick Photo Manager button",
  `e.jsx("span",{children:"នាំចូល Excel/CSV"})]}),e.jsxs("button",{onClick:()=>xa(!0),`,
  `e.jsx("span",{children:"នាំចូល Excel/CSV"})]}),e.jsxs("button",{type:"button",onClick:()=>setPMgrOpen(!0),className:"no-print shrink-0 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 px-3.5 py-2 rounded-2xl text-xs font-black transition shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 whitespace-nowrap min-h-[40px] cursor-pointer",title:"ដាក់រូបថតសិស្សរហ័ស ឬបញ្ចូលច្រើននាក់ព្រមគ្នា",children:[e.jsx(Ri,{className:"w-4 h-4 shrink-0"}),e.jsxs("span",{children:["ដាក់រូបថតសិស្ស (",n.filter(st=>!!st.avatar).length,"/",n.length,")"]})]}),e.jsxs("button",{onClick:()=>xa(!0),`
);

// 3. Make avatar in each Student List row 1-click upload + drag-and-drop!
replaceExact(
  "ytt Student List row clickable avatar",
  `e.jsx("td",{className:"p-3.5 font-bold text-slate-900 text-sm",children:e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:\`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border \${oe.gender==="ស្រី"?"bg-pink-100 text-pink-800 border-pink-200":"bg-blue-100 text-blue-800 border-blue-200"}\`,children:oe.avatar?e.jsx("img",{src:oe.avatar,alt:oe.name,className:"w-full h-full object-cover",referrerPolicy:"no-referrer",onError:Or=>{Or.target.style.display="none"}}):e.jsx("span",{children:oe.name.charAt(0)})}),e.jsxs("div",{children:[e.jsxs("p",{className:"font-extrabold text-slate-900 flex items-center gap-1.5 flex-wrap",`,
  `e.jsx("td",{className:"p-3.5 font-bold text-slate-900 text-sm",children:e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsxs("button",{type:"button",onClick:()=>triggerQuickPhoto(oe,!1),onDragOver:ev=>ev.preventDefault(),onDrop:ev=>{ev.preventDefault();const f0=ev.dataTransfer&&ev.dataTransfer.files&&ev.dataTransfer.files[0];f0&&saveDirectPhoto(oe,f0)},title:oe.avatar?"ចុច ឬទម្លាក់រូបដើម្បីប្តូររូបថតភ្លាមៗ":"ចុច ឬទម្លាក់រូបដើម្បីដាក់រូបថតភ្លាមៗ",className:\`relative group/av w-10 h-10 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 border cursor-pointer transition hover:scale-105 hover:ring-2 hover:ring-amber-400 \${oe.gender==="ស្រី"?"bg-pink-100 text-pink-800 border-pink-200":"bg-blue-100 text-blue-800 border-blue-200"}\`,children:[e.jsx("div",{className:"w-full h-full rounded-xl overflow-hidden flex items-center justify-center",children:oe.avatar?e.jsx("img",{src:oe.avatar,alt:oe.name,className:"w-full h-full object-cover",referrerPolicy:"no-referrer",onError:Or=>{Or.target.style.display="none"}}):e.jsx("span",{children:oe.name.charAt(0)})}),e.jsx("span",{className:"absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-300 shadow-xs flex items-center justify-center text-[9px] text-slate-700 group-hover/av:bg-amber-400 group-hover/av:text-slate-950 transition",children:e.jsx(Ri,{className:"w-2.5 h-2.5"})})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"font-extrabold text-slate-900 flex items-center gap-1.5 flex-wrap",`
);

// 4. Add hidden inputs + Quick & Batch Student Photo Manager Modal right next to <HCe ... /> in ytt
replaceExact(
  "ytt Quick & Batch Photo Manager Modal",
  `e.jsx(HCe,{isOpen:Aa,onClose:()=>ki(!1),students:n,teacher:r,onUpdateStudents:o?oe=>o(oe,!0):()=>{},onShowToast:F}),`,
  `e.jsx("input",{ref:qPhotoFileRef,type:"file",accept:"image/*",className:"hidden",onChange:ev=>{const f0=ev.target.files&&ev.target.files[0];f0&&qPhotoTargetRef.current&&saveDirectPhoto(qPhotoTargetRef.current,f0);try{ev.target.value=""}catch{}}}),
  e.jsx("input",{ref:qPhotoCamRef,type:"file",accept:"image/*",capture:"environment",className:"hidden",onChange:ev=>{const f0=ev.target.files&&ev.target.files[0];f0&&qPhotoTargetRef.current&&saveDirectPhoto(qPhotoTargetRef.current,f0);try{ev.target.value=""}catch{}}}),
  e.jsx("input",{ref:qBatchFileRef,type:"file",accept:"image/*",multiple:!0,className:"hidden",onChange:ev=>{ev.target.files&&ev.target.files.length>0&&handleBatchPhotos(ev.target.files);try{ev.target.value=""}catch{}}}),
  pMgrOpen&&(()=>{
    const withPic=n.filter(st=>!!st.avatar).length;
    const noPic=n.length-withPic;
    const pct=n.length>0?Math.round(withPic/n.length*100):0;
    const list=n.filter(st=>{
      const q=pMgrSearch.trim().toLowerCase();
      const mQ=!q||st.name.toLowerCase().includes(q)||(st.latinName&&st.latinName.toLowerCase().includes(q))||String(st.rollNo||st.id).includes(q);
      const mF=pMgrFilter==="all"||(pMgrFilter==="missing"&&!st.avatar)||(pMgrFilter==="has"&&!!st.avatar);
      return mQ&&mF;
    });
    return e.jsx("div",{className:"fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5 overflow-y-auto no-print",children:
      e.jsxs("div",{className:"bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden",children:[
        e.jsxs("div",{className:"p-4 sm:p-5 bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0",children:[
          e.jsxs("div",{className:"flex items-center gap-3",children:[
            e.jsx("div",{className:"w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md",children:e.jsx(Ri,{className:"w-6 h-6"})}),
            e.jsxs("div",{children:[
              e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
                e.jsx("h3",{className:"font-extrabold text-base sm:text-lg text-white",children:"គ្រប់គ្រង និងដាក់រូបថតសិស្សរហ័ស"}),
                e.jsxs("span",{className:"px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px]",children:[withPic,"/",n.length," នាក់ (",pct,"%)"]})
              ]}),
              e.jsx("p",{className:"text-xs text-purple-200 mt-0.5",children:"ចុចដាក់រូបម្តង ១ នាក់ ថតតាមកាមេរ៉ា អូសរូបទម្លាក់លើកាត ឬជ្រើសរូបច្រើនសន្លឹកព្រមគ្នា (ស៊ីគ្នាទាំងបញ្ជី ប្លង់តុ និងកាតសិស្ស)"})
            ]})
          ]}),
          e.jsx("button",{type:"button",onClick:()=>setPMgrOpen(!1),className:"w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold flex items-center justify-center cursor-pointer",children:"✕"})
        ]}),
        e.jsxs("div",{className:"p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50/70",children:[
          e.jsxs("div",{
            onDragOver:ev=>ev.preventDefault(),
            onDrop:ev=>{ev.preventDefault();ev.dataTransfer&&ev.dataTransfer.files&&ev.dataTransfer.files.length>0&&handleBatchPhotos(ev.dataTransfer.files)},
            className:"p-4 rounded-2xl border-2 border-dashed border-amber-400 bg-gradient-to-r from-amber-50 via-orange-50/60 to-yellow-50 flex flex-col sm:flex-row items-center justify-between gap-3",
            children:[
              e.jsxs("div",{className:"space-y-1 text-center sm:text-left",children:[
                e.jsx("div",{className:"font-extrabold text-sm text-amber-950",children:"📂 ដាក់រូបថតច្រើនសិស្សព្រមគ្នា (Batch / Drag & Drop)"}),
                e.jsx("p",{className:"text-xs text-amber-900/80",children:"ជ្រើសរូបច្រើនសន្លឹកព្រមគ្នា ឬអូសទម្លាក់ចូលទីនេះ — ប្រព័ន្ធនឹងភ្ជាប់តាមឈ្មោះ ឬលេខរៀង (ឧ. 01.jpg) ដោយស្វ័យប្រវត្តិ ឬឱ្យជ្រើសឈ្មោះសិស្សភ្លាមៗ។"})
              ]}),
              e.jsxs("button",{type:"button",disabled:pBatchBusy||qi,onClick:()=>{if(qBatchFileRef.current){qBatchFileRef.current.value="";qBatchFileRef.current.click()}},className:"px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 text-white font-extrabold text-xs shadow-sm transition flex items-center gap-2 shrink-0 cursor-pointer",children:[
                e.jsx($n,{className:"w-4 h-4"}),
                e.jsx("span",{children:pBatchBusy?"កំពុងដំណើរការរូប...":"ជ្រើសរូបច្រើនសន្លឹកព្រមគ្នា"})
              ]})
            ]
          }),
          pBatchQueue.length>0&&e.jsxs("div",{className:"p-4 rounded-2xl bg-white border-2 border-indigo-200 space-y-3 shadow-xs",children:[
            e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-2",children:[
              e.jsxs("div",{className:"font-extrabold text-xs sm:text-sm text-indigo-950",children:["📋 រូបថតរង់ចាំភ្ជាប់ឈ្មោះសិស្ស (",pBatchQueue.length," សន្លឹក)"]}),
              e.jsxs("div",{className:"flex items-center gap-2",children:[
                e.jsx("button",{type:"button",onClick:()=>setPBatchQueue([]),className:"px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer",children:"លុបបញ្ជីរង់ចាំ"}),
                e.jsxs("button",{type:"button",onClick:applyBatchQueue,className:"px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center gap-1.5",children:[e.jsx(hs,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"ភ្ជាប់រូបទាំងអស់ឥឡូវនេះ"})]})
              ]})
            ]}),
            e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto",children:
              pBatchQueue.map(item=>e.jsxs("div",{className:"p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2.5",children:[
                e.jsx("img",{src:item.dataUrl,alt:item.fileName,className:"w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"}),
                e.jsxs("div",{className:"min-w-0 flex-1 space-y-1",children:[
                  e.jsx("div",{className:"text-[10px] font-mono text-slate-500 truncate",title:item.fileName,children:item.fileName}),
                  e.jsxs("select",{value:item.targetId,onChange:ev=>setPBatchQueue(prev=>prev.map(x=>x.uid===item.uid?{...x,targetId:ev.target.value}:x)),className:"w-full p-1.5 rounded-lg border border-indigo-200 bg-white text-xs font-bold text-slate-900",children:[
                    e.jsx("option",{value:"",children:"-- ជ្រើសឈ្មោះសិស្ស --"}),
                    n.map(st=>e.jsxs("option",{value:String(st.id),children:["#",st.rollNo||st.id," ",st.name,st.avatar?" (មានរូប)":""]},st.id))
                  ]})
                ]}),
                e.jsx("button",{type:"button",onClick:()=>setPBatchQueue(prev=>prev.filter(x=>x.uid!==item.uid)),className:"text-slate-400 hover:text-rose-600 p-1 text-xs font-bold cursor-pointer",children:"✕"})
              ]},item.uid))
            })
          ]}),
          e.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200",children:[
            e.jsxs("div",{className:"relative flex-1",children:[
              e.jsx(Ya,{className:"w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"}),
              e.jsx("input",{type:"text",placeholder:"ស្វែងរកឈ្មោះសិស្ស ឬលេខរៀង...",value:pMgrSearch,onChange:ev=>setPMgrSearch(ev.target.value),className:"w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-purple-500"})
            ]}),
            e.jsxs("div",{className:"flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold",children:[
              e.jsxs("button",{type:"button",onClick:()=>setPMgrFilter("all"),className:\`px-3 py-1.5 rounded-xl cursor-pointer shrink-0 \${pMgrFilter==="all"?"bg-slate-900 text-white":"bg-slate-100 text-slate-700 hover:bg-slate-200"}\`,children:["ទាំងអស់ (",n.length,")"]}),
              e.jsxs("button",{type:"button",onClick:()=>setPMgrFilter("missing"),className:\`px-3 py-1.5 rounded-xl cursor-pointer shrink-0 \${pMgrFilter==="missing"?"bg-amber-500 text-slate-950":"bg-amber-50 text-amber-900 hover:bg-amber-100"}\`,children:["មិនទាន់មានរូប (",noPic,")"]}),
              e.jsxs("button",{type:"button",onClick:()=>setPMgrFilter("has"),className:\`px-3 py-1.5 rounded-xl cursor-pointer shrink-0 \${pMgrFilter==="has"?"bg-emerald-600 text-white":"bg-emerald-50 text-emerald-800 hover:bg-emerald-100"}\`,children:["មានរូបរួច (",withPic,")"]})
            ]})
          ]}),
          e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",children:
            list.length===0?e.jsx("div",{className:"col-span-full p-8 text-center text-slate-400 text-xs font-bold bg-white rounded-2xl border border-dashed border-slate-200",children:"មិនមានសិស្សត្រូវនឹងការស្វែងរកឡើយ"}):
            list.map(st=>e.jsxs("div",{
              onDragOver:ev=>{ev.preventDefault();setPMgrDragId(st.id)},
              onDragLeave:()=>setPMgrDragId(null),
              onDrop:ev=>{ev.preventDefault();setPMgrDragId(null);const f0=ev.dataTransfer&&ev.dataTransfer.files&&ev.dataTransfer.files[0];f0&&saveDirectPhoto(st,f0)},
              className:\`p-3 rounded-2xl border-2 transition flex items-center gap-3 bg-white \${pMgrDragId===st.id?"border-amber-500 bg-amber-50 ring-2 ring-amber-300":st.avatar?"border-emerald-200":"border-slate-200 hover:border-amber-300"}\`,
              children:[
                e.jsx("button",{type:"button",onClick:()=>triggerQuickPhoto(st,!1),title:"ចុចដើម្បីជ្រើសរូប ឬទម្លាក់រូបលើទីនេះ",className:\`w-16 h-16 rounded-2xl border-2 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer transition hover:scale-105 \${st.avatar?"border-emerald-400 bg-slate-50":st.gender==="ស្រី"?"border-dashed border-pink-300 bg-pink-50 text-pink-700":"border-dashed border-blue-300 bg-blue-50 text-blue-700"}\`,children:
                  st.avatar?e.jsx("img",{src:st.avatar,alt:st.name,className:"w-full h-full object-cover",referrerPolicy:"no-referrer"}):e.jsxs("div",{className:"text-center",children:[e.jsx(Sc,{className:"w-5 h-5 mx-auto opacity-60"}),e.jsx("span",{className:"text-[9px] font-bold block mt-0.5",children:"ដាក់រូប"})]})
                }),
                e.jsxs("div",{className:"min-w-0 flex-1 space-y-1.5",children:[
                  e.jsxs("div",{children:[
                    e.jsx("div",{className:"font-extrabold text-xs text-slate-900 truncate",children:st.name}),
                    e.jsxs("div",{className:"text-[10px] font-bold text-slate-500",children:["#",st.rollNo||st.id," · ",st.gender]})
                  ]}),
                  e.jsxs("div",{className:"flex flex-wrap items-center gap-1",children:[
                    e.jsxs("button",{type:"button",disabled:qi,onClick:()=>triggerQuickPhoto(st,!1),className:"px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer",children:[e.jsx($n,{className:"w-3 h-3"}),e.jsx("span",{children:st.avatar?"ប្តូររូប":"ជ្រើសរូប"})]}),
                    e.jsxs("button",{type:"button",disabled:qi,onClick:()=>triggerQuickPhoto(st,!0),className:"px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer",children:[e.jsx(Ri,{className:"w-3 h-3"}),e.jsx("span",{children:"ថតរូប"})]}),
                    st.avatar&&e.jsx("button",{type:"button",onClick:()=>removeDirectPhoto(st),title:"លុបរូប",className:"px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] cursor-pointer",children:e.jsx(ta,{className:"w-3 h-3"})})
                  ]})
                ]})
              ]
            },st.id))
          })
        ]}),
        e.jsxs("div",{className:"p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0",children:[
          e.jsx("span",{className:"text-xs text-slate-500 font-semibold",children:"រូបថតទាំងអស់រក្សាទុកដោយស្វ័យប្រវត្តិ និងបង្ហាញលើបញ្ជីសិស្ស ប្លង់តុ និងប័ណ្ណសិស្ស"}),
          e.jsx("button",{type:"button",onClick:()=>setPMgrOpen(!1),className:"px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs cursor-pointer",children:"រួចរាល់"})
        ]})
      ]})
    });
  })(),
  e.jsx(HCe,{isOpen:Aa,onClose:()=>ki(!1),students:n,teacher:r,onUpdateStudents:o?oe=>o(oe,!0):()=>{},onShowToast:F}),`
);

const sf = ts.createSourceFile("index-BwPwHqBe.js", code, ts.ScriptTarget.Latest, true);
const diags = sf.parseDiagnostics || [];
if (diags.length > 0) {
  console.error("TS Parse diagnostics:", diags.map(d => d.messageText));
  process.exit(1);
}

fs.writeFileSync(targetPath, code, "utf8");
console.log("✅ Successfully patched easy student photo uploads (0 AST errors).");
