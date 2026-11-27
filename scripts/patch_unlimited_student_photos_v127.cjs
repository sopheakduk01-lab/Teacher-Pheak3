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

function replaceAllExact(label, oldStr, newStr) {
  const parts = code.split(oldStr);
  if (parts.length < 2) {
    throw new Error(`Pattern not found for [${label}]`);
  }
  code = parts.join(newStr);
  console.log(`✓ Applied (${parts.length - 1}x): ${label}`);
}

// 1. Update Hde() to also prune stale localStorage teacher_cloud_backup_* keys when quota hits
replaceExact(
  "Hde quota cleanup",
  `function Hde(){try{if(typeof window>"u"||!window.localStorage)return;const r=["primary_school_quizzes","primary_teacher_admin_v2_quizzes","school_sub_scores_db","school_custom_sub_subjects_v1"];for(const t of r)try{localStorage.removeItem(t)}catch{}}catch{}}`,
  `function Hde(){try{if(typeof window>"u"||!window.localStorage)return;const r=["primary_school_quizzes","primary_teacher_admin_v2_quizzes","school_sub_scores_db","school_custom_sub_subjects_v1"];for(let t=0;t<localStorage.length;t++){const s=localStorage.key(t);s&&s.startsWith("teacher_cloud_backup_")&&r.push(s)}for(const t of r)try{localStorage.removeItem(t)}catch{}}catch{}}`
);

// 2. Update Gr() so student lists stay light in localStorage (<=600KB) and never silently drop on QuotaExceededError
replaceExact(
  "Gr safe student photo fallback",
  `function Gr(r,t,s){try{const a=qw(r,t);let n=s;t==="quizzes"&&Array.isArray(s)&&(n=s.filter(l=>!l.id||!String(l.id).startsWith("quiz-math-lesson")));const i=JSON.stringify(n);try{localStorage.setItem(a,i)}catch(l){if((l==null?void 0:l.name)==="QuotaExceededError"||(l==null?void 0:l.name)==="NS_ERROR_DOM_QUOTA_REACHED"||(l==null?void 0:l.code)===22||(l==null?void 0:l.code)===1014||(l==null?void 0:l.message)&&l.message.toLowerCase().includes("quota")){console.warn(\`[Storage Quota] Storage quota reached while saving \${r}/\${t}. Running automatic cleanup...\`),dU(),Hde();try{localStorage.setItem(a,i);return}catch{console.warn(\`[Storage Quota] Retrying after pruning failed for \${r}/\${t}. Keeping data active in memory.\`);return}}throw l}}catch(a){console.warn(\`Notice saving year data for \${r}/\${t}:\`,a)}}`,
  `function Gr(r,t,s){try{const a=qw(r,t);let n=s;t==="quizzes"&&Array.isArray(s)&&(n=s.filter(l=>!l.id||!String(l.id).startsWith("quiz-math-lesson"))),t==="students"&&Array.isArray(s)&&cacheYearPhotosMem(r,s);const i=JSON.stringify(n),c=t==="students"&&Array.isArray(s)&&i.length>6e5?JSON.stringify(stripAvatarsForLS(s)):i;try{localStorage.setItem(a,c)}catch(l){if((l==null?void 0:l.name)==="QuotaExceededError"||(l==null?void 0:l.name)==="NS_ERROR_DOM_QUOTA_REACHED"||(l==null?void 0:l.code)===22||(l==null?void 0:l.code)===1014||(l==null?void 0:l.message)&&l.message.toLowerCase().includes("quota")){console.warn(\`[Storage Quota] Storage quota reached while saving \${r}/\${t}. Running automatic cleanup...\`),dU(),Hde();try{localStorage.setItem(a,c);return}catch{if(t==="students"&&Array.isArray(s))try{localStorage.setItem(a,JSON.stringify(stripAvatarsForLS(s)));return}catch{}console.warn(\`[Storage Quota] Retrying after pruning failed for \${r}/\${t}. Keeping data active in memory.\`);return}}throw l}}catch(a){console.warn(\`Notice saving year data for \${r}/\${t}:\`,a)}}`
);

// 3. In Zl(), merge cached photos / normalize "__idb__" & "__chunk__" markers back cleanly
replaceExact(
  "Zl normalize student avatars from mem cache",
  `try{localStorage.setItem("primary_teacher_admin_v2_teacher",JSON.stringify(a));}catch{}}}}catch{}return st})(),i=$r(r,"attendance"`,
  `try{localStorage.setItem("primary_teacher_admin_v2_teacher",JSON.stringify(a));}catch{}}}}catch{}return Array.isArray(st)?mergePhotosIntoStudents(st,getCachedYearPhotosMem(r)):st})(),i=$r(r,"attendance"`
);

// 4. In um(), also persist full students' avatars into IndexedDB
replaceExact(
  "um save student photos to IDB",
  `function um(r){const t=r.year;if(Gr(t,"teacher",r.teacher),Gr(t,"students",r.students),`,
  `function um(r){const t=r.year;if(Array.isArray(r.students)&&saveYearPhotosIDB(t,r.students,!0),Gr(t,"teacher",r.teacher),Gr(t,"students",r.students),`
);

// 5. Add IndexedDB photo store & avatar compactor helpers right after uU()
replaceExact(
  "Add IDB photo store and compactor helpers",
  `async function uU(){try{const r=await xU();return new Promise(t=>{const n=r.transaction(p1,"readonly").objectStore(p1).get("latest_full_backup");n.onsuccess=()=>t(n.result||null),n.onerror=()=>t(null)})}catch{return null}}`,
  `async function uU(){try{const r=await xU();return new Promise(t=>{const n=r.transaction(p1,"readonly").objectStore(p1).get("latest_full_backup");n.onsuccess=()=>t(n.result||null),n.onerror=()=>t(null)})}catch{return null}}function isValidStudentPhoto(r){return typeof r=="string"&&r.length>500&&r!=="__idb__"&&r!=="__chunk__"}function stripAvatarsForLS(r){return Array.isArray(r)?r.map(t=>t&&typeof t.avatar=="string"&&t.avatar.length>800?{...t,avatar:"__idb__"}:t):r}function getCachedYearPhotosMem(r){try{const t=typeof window<"u"&&window.__MOEYS_YEAR_PHOTOS__;return t&&t[Ode(r)]||{}}catch{return{}}}function cacheYearPhotosMem(r,t){try{if(typeof window>"u"||!r||!Array.isArray(t))return;window.__MOEYS_YEAR_PHOTOS__=window.__MOEYS_YEAR_PHOTOS__||{};const s={...(window.__MOEYS_YEAR_PHOTOS__[Ode(r)]||{})};for(const a of t)a&&a.id!=null&&(isValidStudentPhoto(a.avatar)?s[String(a.id)]=a.avatar:a.avatar==null&&delete s[String(a.id)]);window.__MOEYS_YEAR_PHOTOS__[Ode(r)]=s}catch{}}function mergePhotosIntoStudents(r,t){if(!Array.isArray(r))return r;const s=t&&typeof t=="object"?t:{};return r.map(a=>{if(!a)return a;const n=s[String(a.id)];return isValidStudentPhoto(n)?{...a,avatar:n}:a.avatar==="__idb__"||a.avatar==="__chunk__"?{...a,avatar:void 0}:a})}async function saveYearPhotosIDB(r,t,s=!1){try{if(!r||!Array.isArray(t))return!1;const a=await xU(),n=\`student_photos_\${Ode(r)}\`;let i={};s||(i=await new Promise(o=>{try{const c=a.transaction(p1,"readonly").objectStore(p1).get(n);c.onsuccess=()=>o(c.result&&typeof c.result=="object"?c.result:{}),c.onerror=()=>o({})}catch{o({})}}));const l={...i};for(const o of t){if(!o||o.id==null)continue;const c=String(o.id);isValidStudentPhoto(o.avatar)?l[c]=o.avatar:s&&delete l[c]}return typeof window<"u"&&(window.__MOEYS_YEAR_PHOTOS__=window.__MOEYS_YEAR_PHOTOS__||{},window.__MOEYS_YEAR_PHOTOS__[Ode(r)]=l),await new Promise(o=>{const c=a.transaction(p1,"readwrite");c.objectStore(p1).put(l,n),c.oncomplete=()=>o(!0),c.onerror=()=>o(!1)})}catch(a){return console.warn("IDB photo save notice:",a),!1}}async function loadYearPhotosIDB(r){try{if(!r)return{};const t=await xU(),s=\`student_photos_\${Ode(r)}\`,a=await new Promise(n=>{try{const i=t.transaction(p1,"readonly").objectStore(p1).get(s);i.onsuccess=()=>n(i.result&&typeof i.result=="object"?i.result:{}),i.onerror=()=>n({})}catch{n({})}});return typeof window<"u"&&(window.__MOEYS_YEAR_PHOTOS__=window.__MOEYS_YEAR_PHOTOS__||{},window.__MOEYS_YEAR_PHOTOS__[Ode(r)]={...a,...(window.__MOEYS_YEAR_PHOTOS__[Ode(r)]||{})}),a}catch{return{}}}function shrinkAvatarDataUrl(r,t=192,s=.72){return new Promise(a=>{if(typeof r!="string"||!r.startsWith("data:image/")||r.length<=18e3){a(r);return}try{const n=new Image;n.onload=()=>{try{let i=n.width,l=n.height;if(i>t||l>t){const c=Math.min(t/i,t/l);i=Math.max(1,Math.round(i*c)),l=Math.max(1,Math.round(l*c))}const o=document.createElement("canvas");o.width=i,o.height=l;const c=o.getContext("2d");if(!c){a(r);return}c.drawImage(n,0,0,i,l);const d=o.toDataURL("image/jpeg",s);a(d&&d.length<r.length?d:r)}catch{a(r)}},n.onerror=()=>a(r),n.src=r}catch{a(r)}})}`
);

// 6. Chunk student photos in Firestore cm() & reconstruct them in XP() to bypass 1 MiB doc limit
replaceExact(
  "Firestore cm & XP student photo chunking",
  `async function cm(r,t){if(!r||!t)return!1;try{const s=KZ(t.year),a=nj(aT,"teachers",r,"years",s),n={userId:r,year:t.year,teacher:t.teacher||{},students:t.students||[],attendance:t.attendance||{},grades:t.grades||{},logbook:t.logbook||[],inventory:t.inventory||[],plc:t.plc||[],quizzes:t.quizzes||[],libraryBooks:t.libraryBooks||[],subScores:t.subScores||{},priFormData:t.priFormData||null,priLiveSyncActive:t.priLiveSyncActive??null,updatedAt:t.updatedAt||new Date().toISOString(),lastModified:t.lastModified||Date.now()},i=zP(n);return await q7(a,i,{merge:!0}),!0}catch(s){return console.error("Save to Firestore error:",s),!1}}async function XP(r,t){if(!r)return null;try{const s=KZ(t),a=nj(aT,"teachers",r,"years",s),n=await xbe(a);if(n.exists()){const i=n.data();return{year:i.year||t,teacher:i.teacher,students:i.students||[],attendance:i.attendance||{},grades:i.grades||{},logbook:i.logbook||[],inventory:i.inventory||[],plc:i.plc||[],quizzes:i.quizzes||[],libraryBooks:i.libraryBooks||[],subScores:i.subScores||void 0,priFormData:i.priFormData||void 0,priLiveSyncActive:i.priLiveSyncActive!==null?i.priLiveSyncActive:void 0,updatedAt:i.updatedAt,lastModified:i.lastModified}}return null}catch(s){return console.error("Load from Firestore error:",s),null}}`,
  `async function cm(r,t){if(!r||!t)return!1;try{const s=KZ(t.year),a=nj(aT,"teachers",r,"years",s),mem=getCachedYearPhotosMem(t.year),rawSt=Array.isArray(t.students)?t.students:[],chunks=[];let curChunk={},curBytes=2;const docSt=rawSt.map(st=>{if(!st)return st;let av=st.avatar;if((av==="__idb__"||av==="__chunk__")&&isValidStudentPhoto(mem[String(st.id)]))av=mem[String(st.id)];if(isValidStudentPhoto(av)){const k=String(st.id),eb=k.length+av.length+10;return curBytes+eb>24e4&&Object.keys(curChunk).length>0&&(chunks.push(curChunk),curChunk={},curBytes=2),curChunk[k]=av,curBytes+=eb,{...st,avatar:"__chunk__"}}if(av==="__idb__"||av==="__chunk__"){const cp={...st};return delete cp.avatar,cp}return st});Object.keys(curChunk).length>0&&chunks.push(curChunk);const upAt=t.updatedAt||new Date().toISOString();chunks.length>0&&await Promise.all(chunks.map((photosObj,idx)=>q7(nj(aT,"teachers",r,"years",\`\${s}_photos_\${idx}\`),zP({userId:r,year:t.year,chunkIndex:idx,photos:photosObj,updatedAt:upAt}))));const n={userId:r,year:t.year,teacher:t.teacher||{},students:docSt,photoChunkCount:chunks.length,attendance:t.attendance||{},grades:t.grades||{},logbook:t.logbook||[],inventory:t.inventory||[],plc:t.plc||[],quizzes:t.quizzes||[],libraryBooks:t.libraryBooks||[],subScores:t.subScores||{},priFormData:t.priFormData||null,priLiveSyncActive:t.priLiveSyncActive??null,updatedAt:upAt,lastModified:t.lastModified||Date.now()},i=zP(n);return await q7(a,i,{merge:!0}),!0}catch(s){return console.error("Save to Firestore error:",s),!1}}async function XP(r,t){if(!r)return null;try{const s=KZ(t),a=nj(aT,"teachers",r,"years",s),n=await xbe(a);if(n.exists()){const i=n.data(),cnt=Number(i.photoChunkCount)||0;let pMap={};if(cnt>0){const docs=await Promise.all(Array.from({length:cnt},(_,idx)=>xbe(nj(aT,"teachers",r,"years",\`\${s}_photos_\${idx}\`)).catch(()=>null)));for(const d of docs)if(d&&d.exists()){const dt=d.data();dt&&dt.photos&&typeof dt.photos=="object"&&Object.assign(pMap,dt.photos)}}const mergedSt=mergePhotosIntoStudents(i.students||[],pMap);return cacheYearPhotosMem(i.year||t,mergedSt),{year:i.year||t,teacher:i.teacher,students:mergedSt,attendance:i.attendance||{},grades:i.grades||{},logbook:i.logbook||[],inventory:i.inventory||[],plc:i.plc||[],quizzes:i.quizzes||[],libraryBooks:i.libraryBooks||[],subScores:i.subScores||void 0,priFormData:i.priFormData||void 0,priLiveSyncActive:i.priLiveSyncActive!==null?i.priLiveSyncActive:void 0,updatedAt:i.updatedAt,lastModified:i.lastModified}}return null}catch(s){return console.error("Load from Firestore error:",s),null}}`
);

// 7. Prevent localStorage.setItem("teacher_cloud_backup_...") quota throws from aborting Ah() & cm() in AccountSync
replaceExact(
  "AccountSync safe backup writes Ce",
  `const or=h1();localStorage.setItem(\`teacher_cloud_backup_\${Qe}\`,or),await Ah(or),N!=null&&N.uid&&await cm(N.uid,vt)`,
  `const or=h1();try{localStorage.setItem(\`teacher_cloud_backup_\${Qe}\`,or)}catch{}await Ah(or),N!=null&&N.uid&&await cm(N.uid,vt)`
);
replaceExact(
  "AccountSync safe backup writes et",
  `Et=h1();localStorage.setItem(\`teacher_cloud_backup_\${Qe}\`,Et),await Ah(Et),N!=null&&N.uid&&await cm(N.uid,be)`,
  `Et=h1();try{localStorage.setItem(\`teacher_cloud_backup_\${Qe}\`,Et)}catch{}await Ah(Et),N!=null&&N.uid&&await cm(N.uid,be)`
);

// 8. In krt: reset idbHydratedRef on year switch, ensure Z() persists IDB photos, hydrate IDB & auto-compact oversized legacy photos, protect auto-backup + saveStuFallback
replaceExact(
  "krt V year switch & Z restore IDB hydration",
  `V=ke=>{Ww(ke),i(ke);const st=Zl(ke,c);d(st.teacher),h(st.students),w(st.attendance),N(st.grades),A(st.logbook),T(st.inventory),X(st.plc),O(st.quizzes)};`,
  `V=ke=>{idbHydratedRef.current=null,Ww(ke),i(ke);const st=Zl(ke,c);d(st.teacher),h(st.students),w(st.attendance),N(st.grades),A(st.logbook),T(st.inventory),X(st.plc),O(st.quizzes)};`
);

replaceExact(
  "krt Z saveYearPhotosIDB",
  `ke.students&&h(ke.students),`,
  `ke.students&&(h(ke.students),saveYearPhotosIDB(ke.year||n,ke.students,!0)),`
);

replaceExact(
  "krt students effect + idbHydratedRef + mount hydration + cloud sync + auto-backup + student handlers",
  `y.useEffect(()=>{if(n){Gr(n,"students",u);try{localStorage.setItem(\`\${Si}_students\`,JSON.stringify(u))}catch{}}},[u,n]),`,
  `y.useEffect(()=>{if(n){Gr(n,"students",u),saveStuFallback(u),saveYearPhotosIDB(n,u,idbHydratedRef.current===n)}},[u,n]),`
);

replaceExact(
  "krt auth/IDB mount, auto-backup, and student photo handlers",
  `const[Ge,xt]=y.useState(Th.currentUser);y.useEffect(()=>{fU(),(async()=>{try{const bt=await uU();if(bt&&!localStorage.getItem("moeys_teacher_academic_years_list_v1")&&sw(bt).success){const Tt=Zl(n);Z(Tt,bt),Re("បានស្តារទិន្នន័យពី IndexedDB ស្វ័យប្រវត្តិ! 📲✨")}}catch(bt){console.warn("IDB init error:",bt)}})();const st=eT(Th,async bt=>{var pt,Ht,Tt;if(xt(bt),bt)try{const Jt=await XP(bt.uid,n);if(Jt&&(((pt=Jt.students)==null?void 0:pt.length)>0||Object.keys(Jt.grades||{}).length>0)){const Qt=Zl(n),lr=Qt.lastModified||0,cr=Jt.lastModified||(Jt.updatedAt?new Date(Jt.updatedAt).getTime():0);cr>lr||!((Ht=Qt.students)!=null&&Ht.length)&&((Tt=Jt.students)==null?void 0:Tt.length)>0?(Z(Jt),Re(\`បានទាញយកទិន្នន័យពី Cloud Firestore (\${bt.email}) រួចរាល់! ☁️✅\`)):lr>cr&&await cm(bt.uid,Qt)}}catch(Jt){console.warn("Firestore auto-fetch on mount:",Jt)}});return()=>st()},[n]),y.useEffect(()=>{const ke=setTimeout(async()=>{var st;try{const bt=h1();if(await Ah(bt),(st=Th.currentUser)!=null&&st.uid){const pt=$r(n,"moeys_pri_form_data",void 0),Ht=$r(n,"moeys_pri_live_sync_active",void 0),Tt={year:n,teacher:c,students:u,attendance:m,grades:j,logbook:B,inventory:D,plc:E,quizzes:H,libraryBooks:z,priFormData:pt,priLiveSyncActive:Ht,lastModified:Date.now()};await cm(Th.currentUser.uid,Tt)}}catch(bt){console.warn("Auto backup write error:",bt)}},1500);return()=>clearTimeout(ke)},[u,m,j,B,D,E,H,c,n,z]);const saveStuFallback=arr=>{try{localStorage.setItem(\`\${Si}_students\`,JSON.stringify(arr))}catch(e){console.warn("Fallback students localStorage notice:",e)}},pe=ke=>{const bt={id:Date.now(),rollNo:u.length+1,...ke},pt=[...u,bt];h(pt),Gr(n,"students",pt),Gr(n,"last_modified",Date.now()),saveStuFallback(pt),Re(\`បានបញ្ចូលសិស្ស \${bt.name} និងរក្សាទុកជោគជ័យ!\`)},Ae=ke=>{const st=u.map(bt=>bt.id===ke.id?ke:bt);h(st),Gr(n,"students",st),Gr(n,"last_modified",Date.now()),saveStuFallback(st),Re("បានកែប្រែ និងរក្សាទុកទិន្នន័យសិស្សជោគជ័យ")},Fe=(ke,st=!1)=>{const bt=st?ke:[...u,...ke];h(bt),Gr(n,"students",bt),Gr(n,"last_modified",Date.now()),saveStuFallback(bt),Re(\`បាននាំចូលសិស្សចំនួន \${ke.length} នាក់ និងរក្សាទុកដោយជោគជ័យ!\`)},Je=ke=>{if(window.confirm("តើអ្នកពិតជាចង់លុបឈ្មោះសិស្សនេះមែនទេ?")){const st=u.filter(bt=>bt.id!==ke);h(st),Gr(n,"students",st),Gr(n,"last_modified",Date.now()),saveStuFallback(st),Re("បានលុបឈ្មោះសិស្សដោយជោគជ័យ")}}`,
  `const idbHydratedRef=y.useRef(null),[Ge,xt]=y.useState(Th.currentUser);y.useEffect(()=>{let mounted=!0;fU(),(async()=>{try{const bt=await uU();if(bt&&!localStorage.getItem("moeys_teacher_academic_years_list_v1")&&sw(bt).success){const Tt=Zl(n);Z(Tt,bt),Re("បានស្តារទិន្នន័យពី IndexedDB ស្វ័យប្រវត្តិ! 📲✨")}const idbP=await loadYearPhotosIDB(n);if(!mounted)return;const pKeys=Object.keys(idbP);pKeys.length>0&&h(prev=>{let ch=!1;const nxt=prev.map(x=>{const av=idbP[String(x.id)];return isValidStudentPhoto(av)&&av!==x.avatar?(ch=!0,{...x,avatar:av}):x.avatar==="__idb__"||x.avatar==="__chunk__"?(ch=!0,{...x,avatar:void 0}):x});return ch?nxt:prev});idbHydratedRef.current=n;const baseSt=mergePhotosIntoStudents(Zl(n).students,idbP);if(Array.isArray(baseSt)&&baseSt.some(x=>typeof x.avatar=="string"&&x.avatar.startsWith("data:image/")&&x.avatar.length>18e3)){const shrunk=await Promise.all(baseSt.map(async x=>typeof x.avatar=="string"&&x.avatar.startsWith("data:image/")&&x.avatar.length>18e3?{...x,avatar:await shrinkAvatarDataUrl(x.avatar,192,.72)}:x));if(mounted){h(prev=>prev.map(x=>{const m2=shrunk.find(y2=>y2.id===x.id);return m2&&isValidStudentPhoto(m2.avatar)&&typeof x.avatar=="string"&&x.avatar.length>18e3?{...x,avatar:m2.avatar}:x}));await saveYearPhotosIDB(n,shrunk,!0);Gr(n,"students",shrunk);saveStuFallback(shrunk)}}}catch(bt){idbHydratedRef.current=n,console.warn("IDB init error:",bt)}})();const st=eT(Th,async bt=>{var pt,Ht,Tt;if(xt(bt),bt)try{const Jt=await XP(bt.uid,n);if(Jt&&(((pt=Jt.students)==null?void 0:pt.length)>0||Object.keys(Jt.grades||{}).length>0)){const idbP=await loadYearPhotosIDB(n),Qt=Zl(n);Qt.students=mergePhotosIntoStudents(Qt.students,idbP);const lr=Qt.lastModified||0,cr=Jt.lastModified||(Jt.updatedAt?new Date(Jt.updatedAt).getTime():0);cr>lr||!((Ht=Qt.students)!=null&&Ht.length)&&((Tt=Jt.students)==null?void 0:Tt.length)>0?(Z(Jt),Re(\`បានទាញយកទិន្នន័យពី Cloud Firestore (\${bt.email}) រួចរាល់! ☁️✅\`)):lr>cr&&await cm(bt.uid,Qt)}}catch(Jt){console.warn("Firestore auto-fetch on mount:",Jt)}});return()=>{mounted=!1,st()}},[n]),y.useEffect(()=>{const ke=setTimeout(async()=>{var st;try{await saveYearPhotosIDB(n,u,idbHydratedRef.current===n);let bt=h1();try{const p=JSON.parse(bt);p&&p.bundles&&p.bundles[n]&&(p.bundles[n].students=u,bt=JSON.stringify(p,null,2))}catch{}if(await Ah(bt),(st=Th.currentUser)!=null&&st.uid){const lm=Date.now(),pt=$r(n,"moeys_pri_form_data",void 0),Ht=$r(n,"moeys_pri_live_sync_active",void 0),Tt={year:n,teacher:c,students:u,attendance:m,grades:j,logbook:B,inventory:D,plc:E,quizzes:H,libraryBooks:z,priFormData:pt,priLiveSyncActive:Ht,lastModified:lm};await cm(Th.currentUser.uid,Tt)&&Gr(n,"last_modified",lm)}}catch(bt){console.warn("Auto backup write error:",bt)}},900);return()=>clearTimeout(ke)},[u,m,j,B,D,E,H,c,n,z]);const saveStuFallback=arr=>{try{const str=JSON.stringify(arr);localStorage.setItem(\`\${Si}_students\`,str.length>6e5?JSON.stringify(stripAvatarsForLS(arr)):str)}catch(e){try{localStorage.setItem(\`\${Si}_students\`,JSON.stringify(stripAvatarsForLS(arr)))}catch{console.warn("Fallback students localStorage notice:",e)}}},pe=ke=>{const bt={id:Date.now(),rollNo:u.length+1,...ke},pt=[...u,bt];h(pt),saveYearPhotosIDB(n,pt,idbHydratedRef.current===n),Gr(n,"students",pt),Gr(n,"last_modified",Date.now()),saveStuFallback(pt),Re(\`បានបញ្ចូលសិស្ស \${bt.name} និងរក្សាទុកជោគជ័យ!\`)},Ae=ke=>{const st=u.map(bt=>bt.id===ke.id?ke:bt);h(st),saveYearPhotosIDB(n,st,!0),Gr(n,"students",st),Gr(n,"last_modified",Date.now()),saveStuFallback(st),Re("បានកែប្រែ និងរក្សាទុកទិន្នន័យសិស្សជោគជ័យ")},Fe=(ke,st=!1)=>{const bt=st?ke:[...u,...ke];h(bt),saveYearPhotosIDB(n,bt,idbHydratedRef.current===n),Gr(n,"students",bt),Gr(n,"last_modified",Date.now()),saveStuFallback(bt),Re(\`បាននាំចូលសិស្សចំនួន \${ke.length} នាក់ និងរក្សាទុកដោយជោគជ័យ!\`)},Je=ke=>{if(window.confirm("តើអ្នកពិតជាចង់លុបឈ្មោះសិស្សនេះមែនទេ?")){const st=u.filter(bt=>bt.id!==ke);h(st),saveYearPhotosIDB(n,st,!0),Gr(n,"students",st),Gr(n,"last_modified",Date.now()),saveStuFallback(st),Re("បានលុបឈ្មោះសិស្សដោយជោគជ័យ")}}`
);

// 9. Tighten student avatar compression across ytt (saveDirectPhoto, handleBatchPhotos, _l) & student photo modal
replaceAllExact(
  "Tighten student avatar compression (260 -> 192 @ 0.72)",
  `{maxWidth:260,maxHeight:260,quality:.82,mimeType:"image/jpeg"}`,
  `{maxWidth:192,maxHeight:192,quality:.72,mimeType:"image/jpeg"}`
);

replaceExact(
  "Tighten student profile modal photo compression (360 -> 192 @ 0.72)",
  `{maxWidth:360,maxHeight:360,quality:.82,mimeType:"image/jpeg"}`,
  `{maxWidth:192,maxHeight:192,quality:.72,mimeType:"image/jpeg"}`
);

replaceExact(
  "Tighten MCe seating photo compression (180@0.84 -> 160@0.72)",
  `const size=180;
        const cv=document.createElement("canvas");
        cv.width=size;cv.height=size;
        const ctx=cv.getContext("2d");
        const minSide=Math.min(img.width,img.height);
        const sx=(img.width-minSide)/2;
        const sy=(img.height-minSide)/2;
        ctx.drawImage(img,sx,sy,minSide,minSide,0,0,size,size);
        const dataUrl=cv.toDataURL("image/jpeg",0.84);`,
  `const size=160;
        const cv=document.createElement("canvas");
        cv.width=size;cv.height=size;
        const ctx=cv.getContext("2d");
        const minSide=Math.min(img.width,img.height);
        const sx=(img.width-minSide)/2;
        const sy=(img.height-minSide)/2;
        ctx.drawImage(img,sx,sy,minSide,minSide,0,0,size,size);
        const dataUrl=cv.toDataURL("image/jpeg",0.72);`
);

// Parse JS AST to guarantee 0 syntax errors
const sf = ts.createSourceFile("index.js", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  const first = sf.parseDiagnostics[0];
  throw new Error(`TS parse error at pos ${first.start}: ${ts.flattenDiagnosticMessageText(first.messageText, "\n")}`);
}

fs.writeFileSync(targetPath, code, "utf8");
console.log("✓ Validated AST and wrote updated bundle:", targetPath);
