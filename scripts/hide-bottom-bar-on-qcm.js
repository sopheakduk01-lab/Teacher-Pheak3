import fs from 'node:fs';

console.log("=== Hiding bottom bar when opening QCM ===");

let js = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

// 1. Update Rz10
const rz10New = fs.readFileSync('scripts/rz10_component_code.js', 'utf8').trim();
const rz10Start = js.indexOf('Rz10=');
const rz11Start = js.indexOf('Rz11=', rz10Start);
if (rz10Start !== -1 && rz11Start !== -1) {
  console.log("Replacing Rz10 implementation...");
  let cleanRz10 = rz10New.replace(/^var\s+Rz10\s*=\s*/, 'Rz10=');
  cleanRz10 = cleanRz10.replace(/;$/, '') + ',';
  js = js.substring(0, rz10Start) + cleanRz10 + js.substring(rz11Start);
  console.log("Rz10 replaced successfully!");
}

// 2. Update Rz11
const rz11New = fs.readFileSync('scripts/rz11_component_code.js', 'utf8').trim();
const newRz11Start = js.indexOf('Rz11=');
const rzAfter11 = js.indexOf('Rz=', newRz11Start);
if (newRz11Start !== -1 && rzAfter11 !== -1) {
  console.log("Replacing Rz11 implementation...");
  let cleanRz11 = rz11New.replace(/^var\s+Rz11\s*=\s*/, 'Rz11=');
  cleanRz11 = cleanRz11.replace(/;$/, '') + ',';
  js = js.substring(0, newRz11Start) + cleanRz11 + js.substring(rzAfter11);
  console.log("Rz11 replaced successfully!");
}

// 3. Update Rz9 to also have body class hook and z-[100]
const rz9Start = js.indexOf('Rz9=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"})');
if (rz9Start !== -1) {
  const target9 = 'if(!r)return null;const[n,i]=y.useState(a);';
  const target9WithSpaces = 'if(!r)return null;  const[n,i]=y.useState(a);';
  const hookCode = 'y.useEffect(()=>(r?document.body.classList.add("qcm-open","answering-exam"):document.body.classList.remove("qcm-open","answering-exam"),()=>{document.body.classList.remove("qcm-open","answering-exam")}),[r,n]);';
  
  if (js.includes(target9WithSpaces)) {
    js = js.replace(target9WithSpaces, target9WithSpaces + hookCode);
    console.log("Added hook to Rz9!");
  } else if (js.includes(target9)) {
    js = js.replace(target9, target9 + hookCode);
    console.log("Added hook to Rz9!");
  }
  
  // Also update Rz9 outer div z-50 to z-[100] data-modal-open="true"
  const rz9End = js.indexOf(',Rz10=', rz9Start);
  if (rz9End !== -1) {
    let rz9Slice = js.substring(rz9Start, rz9End);
    let rz9Div = 'return e.jsx("div",{className:"fixed inset-0 z-50 overflow-y-auto';
    let rz9DivNew = 'return e.jsx("div",{"data-modal-open":"true",className:"fixed inset-0 z-[100] overflow-y-auto';
    if (rz9Slice.includes(rz9Div)) {
      rz9Slice = rz9Slice.replace(rz9Div, rz9DivNew);
      js = js.substring(0, rz9Start) + rz9Slice + js.substring(rz9End);
      console.log("Updated Rz9 outer div z-[100]!");
    }
  }
}

// 4. Update student portal answering-exam effect:
const oldAnsweringExam = 'y.useEffect(()=>(Ge&&!Nt?document.body.classList.add("answering-exam"):document.body.classList.remove("answering-exam"),()=>{document.body.classList.remove("answering-exam")}),[Ge,Nt])';
const newAnsweringExam = 'y.useEffect(()=>((Ge&&!Nt)||activeLessonModal!==null?document.body.classList.add("answering-exam","qcm-open"):document.body.classList.remove("answering-exam","qcm-open"),()=>{document.body.classList.remove("answering-exam","qcm-open")}),[Ge,Nt,activeLessonModal])';

if (js.includes(oldAnsweringExam)) {
  js = js.replace(oldAnsweringExam, newAnsweringExam);
  console.log("Updated answering-exam effect in student portal!");
} else {
  console.warn("oldAnsweringExam not found, searching with regex...");
  const re = /y\.useEffect\(\(\)=>\(Ge&&!Nt\?document\.body\.classList\.add\("answering-exam"\):document\.body\.classList\.remove\("answering-exam"\),[^)]+\),\[Ge,Nt\]\)/;
  if (re.test(js)) {
    js = js.replace(re, newAnsweringExam);
    console.log("Updated answering-exam effect via regex!");
  }
}

// 5. Update student portal floating dock animate and className:
const oldDockAnimate = 'animate:{y:_r?0:88,opacity:_r?1:0,scale:_r?1:.88,filter:_r?"blur(0px)":"blur(12px)"},transition:{type:"spring",stiffness:280,damping:22,mass:.75},className:"fixed bottom-3 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl z-40 flex items-center justify-center gap-2 sm:gap-2.5 pointer-events-none"';
const newDockAnimate = 'animate:{y:(_r&&!activeLessonModal&&!Ge)?0:88,opacity:(_r&&!activeLessonModal&&!Ge)?1:0,scale:(_r&&!activeLessonModal&&!Ge)?1:.88,filter:(_r&&!activeLessonModal&&!Ge)?"blur(0px)":"blur(12px)"},transition:{type:"spring",stiffness:280,damping:22,mass:.75},className:(activeLessonModal||Ge?"hidden ":"")+"fixed bottom-3 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl z-40 flex items-center justify-center gap-2 sm:gap-2.5 pointer-events-none"';

if (js.includes(oldDockAnimate)) {
  js = js.replace(oldDockAnimate, newDockAnimate);
  console.log("Updated floating dock in student portal!");
} else {
  console.warn("Could not find exact oldDockAnimate");
}

fs.writeFileSync('public/assets/index-BwPwHqBe.js', js, 'utf8');
console.log("Saved public/assets/index-BwPwHqBe.js!");
