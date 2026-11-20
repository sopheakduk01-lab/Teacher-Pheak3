const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

const z3ePos = src.indexOf("Z3e=({teacher:r");
if (z3ePos === -1) throw new Error("Missing Z3e");

// 1. Add qRef and dragRef hooks inside Z3e right after `const[o,c]=y.useState(()=>Bw(new Date));`
const hookAnchor = `const[o,c]=y.useState(()=>Bw(new Date));`;
const hIdx = src.indexOf(hookAnchor, z3ePos);
if (hIdx === -1 || hIdx > z3ePos + 400) throw new Error("Missing hookAnchor in Z3e");

const swipeHooks = `${hookAnchor}const qRef=y.useRef(null),dragRef=y.useRef({down:!1,x:0,sl:0,moved:!1});`;
src = src.slice(0, hIdx) + swipeHooks + src.slice(hIdx + hookAnchor.length);

// 2. Add no-scrollbar track style into Z3e <style>
const styleAnchor = `.animate-marquee-flow:hover { animation-play-state: paused; }`;
const sIdx = src.indexOf(styleAnchor, z3ePos);
if (sIdx === -1 || sIdx > z3ePos + 3500) throw new Error("Missing styleAnchor in Z3e");
const newStyle = `${styleAnchor}
      .hero-btns-track { scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; }
      .hero-btns-track::-webkit-scrollbar { display: none; }`;
src = src.slice(0, sIdx) + newStyle + src.slice(sIdx + styleAnchor.length);

// 3. Replace wrapping buttons container with horizontal swipeable carousel + mouse-drag + left/right scroll buttons
const oldBtnsWrap = `e.jsx("div",{className:"relative w-full",children:e.jsxs("div",{className:"flex flex-wrap gap-2 sm:gap-2.5 py-1 w-full",children:[`;
const bIdx = src.indexOf(oldBtnsWrap, z3ePos);
if (bIdx === -1 || bIdx > z3ePos + 12000) throw new Error("Missing oldBtnsWrap");

const exactOldTail = `children:"សម្រាប់តែគ្រូ & សិស្សរៀនគួរ"})]})
            ]})
          ]})})`;
const eIdx = src.indexOf(exactOldTail, bIdx);
if (eIdx === -1 || eIdx > bIdx + 12000) throw new Error("Missing exactOldTail");

const newBtnsWrap = `e.jsxs("div",{className:"relative w-full min-w-0 group/swipe",children:[
  e.jsx("button",{type:"button",onClick:()=>{const el=qRef.current;el&&el.scrollBy({left:-220,behavior:"smooth"})},className:"hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-700 hover:bg-sky-50 hover:text-blue-700 hover:border-sky-300 transition absolute -left-2.5 top-1/2 -translate-y-1/2 z-20 cursor-pointer active:scale-90","aria-label":"អូសទៅឆ្វេង",title:"អូសទៅឆ្វេង",children:e.jsx("span",{className:"text-base font-black leading-none",children:"‹"})}),
  e.jsx("button",{type:"button",onClick:()=>{const el=qRef.current;el&&el.scrollBy({left:220,behavior:"smooth"})},className:"hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-700 hover:bg-sky-50 hover:text-blue-700 hover:border-sky-300 transition absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 cursor-pointer active:scale-90","aria-label":"អូសទៅស្តាំ",title:"អូសទៅស្តាំ",children:e.jsx("span",{className:"text-base font-black leading-none",children:"›"})}),
  e.jsxs("div",{ref:qRef,onDragStart:ev=>ev.preventDefault(),onMouseDown:ev=>{if(ev.button!==0)return;const el=qRef.current;if(!el)return;dragRef.current={down:!0,x:ev.pageX,sl:el.scrollLeft,moved:!1}},onMouseMove:ev=>{const d=dragRef.current,el=qRef.current;if(!d.down||!el)return;const dx=ev.pageX-d.x;if(Math.abs(dx)>6)d.moved=!0;el.scrollLeft=d.sl-dx},onMouseUp:()=>{dragRef.current.down=!1},onMouseLeave:()=>{dragRef.current.down=!1},onClickCapture:ev=>{if(dragRef.current.moved){ev.stopPropagation();ev.preventDefault();dragRef.current.moved=!1}},className:"hero-btns-track flex flex-nowrap items-stretch gap-2.5 py-1.5 px-1 sm:px-5 w-full overflow-x-auto overflow-y-hidden touch-pan-x cursor-grab active:cursor-grabbing select-none",children:[`;

const newTail = `children:"សម្រាប់តែគ្រូ & សិស្សរៀនគួរ"})]})
            ]})
          ]}),
  e.jsx("p",{className:"sm:hidden text-[10px] text-slate-400 font-medium mt-0.5 pl-1 select-none",children:"↔ អូសឆ្វេង-ស្តាំ ដើម្បីមើលប៊ូតុងទាំងអស់"})
]})`;

const updated = src.slice(0, bIdx) + newBtnsWrap + src.slice(bIdx + oldBtnsWrap.length, eIdx) + newTail + src.slice(eIdx + exactOldTail.length);

fs.writeFileSync(FILE, updated, "utf8");

const sf = ts.createSourceFile(FILE, updated, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("Parse diagnostics found:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("SUCCESS: patched horizontal swipe quick buttons v118, 0 parse diagnostics, length:", updated.length);
