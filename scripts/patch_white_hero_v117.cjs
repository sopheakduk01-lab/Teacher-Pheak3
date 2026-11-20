const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

// 1. Update J3e for subtle lively pastel accents on plain white/light surface
const jStart = src.indexOf("J3e=({themeKey:r})=>");
const jEnd = src.indexOf(";function K3e(", jStart);
if (jStart === -1 || jEnd === -1) throw new Error("Missing J3e boundaries");

const newJ3e = `J3e=({themeKey:r})=>e.jsxs("div",{className:"absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-[inherit]",children:[
  e.jsx("div",{className:"absolute -right-14 -top-14 w-72 h-72 rounded-full bg-sky-200/25 blur-2xl"}),
  e.jsx("div",{className:"absolute -left-14 -bottom-14 w-64 h-64 rounded-full bg-amber-200/25 blur-2xl"}),
  r==="sunrise"&&e.jsxs(e.Fragment,{children:[
    e.jsx("div",{className:"absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400"}),
    e.jsx("div",{className:"absolute right-5 -bottom-8 opacity-20 text-sky-400 w-44 h-44 sm:w-56 sm:h-56",children:e.jsxs("svg",{viewBox:"0 0 200 200",fill:"none",className:"w-full h-full stroke-current",strokeWidth:"1.5",children:[
      e.jsx("circle",{cx:"100",cy:"100",r:"36",fill:"rgba(56,189,248,0.16)"}),
      [0,30,60,90,120,150,180,210,240,270,300,330].map(t=>e.jsx("path",{d:"M100 18 C110 45, 110 62, 100 72 C90 62, 90 45, 100 18 Z",fill:"rgba(56,189,248,0.14)",transform:\`rotate(\${t} 100 100)\`},t))
    ]})}),
    e.jsx("div",{className:"absolute top-7 right-36 text-amber-400/70 text-sm animate-theme-float",children:"☀️"}),
    e.jsx("div",{className:"absolute bottom-6 right-72 text-emerald-500/60 text-sm animate-theme-drift-2",children:"🌼"})
  ]}),
  r==="forest"&&e.jsxs(e.Fragment,{children:[
    e.jsx("div",{className:"absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"}),
    e.jsx("div",{className:"absolute right-4 -bottom-10 opacity-20 text-emerald-400 w-44 h-44 sm:w-56 sm:h-56 animate-theme-float",children:e.jsxs("svg",{viewBox:"0 0 200 200",fill:"none",className:"w-full h-full stroke-current",strokeWidth:"1.6",children:[
      e.jsx("path",{d:"M100 185 C60 150, 42 110, 48 62 C54 22, 90 12, 100 12 C110 12, 146 22, 152 62 C158 110, 140 150, 100 185 Z",fill:"rgba(16,185,129,0.16)"}),
      e.jsx("line",{x1:"100",y1:"185",x2:"100",y2:"18",strokeWidth:"2"}),
      e.jsx("path",{d:"M100 65 Q128 54 142 40 M100 98 Q136 86 148 70 M100 65 Q72 54 58 40 M100 98 Q64 86 52 70"})
    ]})}),
    e.jsx("div",{className:"absolute top-7 right-36 text-emerald-500/70 text-sm animate-theme-drift-1",children:"🌿"}),
    e.jsx("div",{className:"absolute bottom-6 right-72 text-teal-500/60 text-sm animate-theme-drift-2",children:"🍃"})
  ]}),
  r==="ocean"&&e.jsxs(e.Fragment,{children:[
    e.jsx("div",{className:"absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400"}),
    e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-20 opacity-20 text-sky-400 pointer-events-none overflow-hidden",children:e.jsx("svg",{viewBox:"0 0 1200 120",preserveAspectRatio:"none",className:"w-[130%] h-full fill-current animate-ocean-wave -ml-[15%]",children:e.jsx("path",{d:"M0,25 C200,90 420,-10 640,55 C860,115 1040,20 1200,50 L1200,120 L0,120 Z"})})}),
    e.jsx("div",{className:"absolute top-7 right-36 text-sky-400/75 text-sm animate-bubble-1",children:"🫧"}),
    e.jsx("div",{className:"absolute bottom-6 right-72 text-blue-400/65 text-sm animate-theme-float",children:"🌊"})
  ]}),
  r==="galaxy"&&e.jsxs(e.Fragment,{children:[
    e.jsx("div",{className:"absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300"}),
    e.jsx("div",{className:"absolute right-6 -bottom-8 opacity-20 text-rose-400 w-44 h-44 sm:w-56 sm:h-56 animate-theme-float",children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"rgba(244,63,94,0.16)",className:"w-full h-full",children:[0,72,144,216,288].map(t=>e.jsx("ellipse",{cx:"100",cy:"52",rx:"22",ry:"38",transform:\`rotate(\${t} 100 100)\`},t))})}),
    e.jsx("div",{className:"absolute top-7 right-36 text-rose-400/75 text-base animate-theme-drift-1",children:"🌸"}),
    e.jsx("div",{className:"absolute bottom-6 right-72 text-pink-400/65 text-sm animate-theme-drift-2",children:"🦋"})
  ]}),
  r==="cyber"&&e.jsxs(e.Fragment,{children:[
    e.jsx("div",{className:"absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400"}),
    e.jsx("div",{className:"absolute right-4 -bottom-10 opacity-15 text-amber-500 w-44 h-44 sm:w-56 sm:h-56",children:e.jsx("svg",{viewBox:"0 0 100 100",fill:"currentColor",className:"w-full h-full",children:e.jsx("path",{d:"M50 8 L55 26 L65 31 L62 50 L74 56 L71 80 L84 85 L84 94 L16 94 L16 85 L29 80 L26 56 L38 50 L35 31 L45 26 Z"})})}),
    e.jsx("div",{className:"absolute top-7 right-36 text-amber-500/70 text-base animate-theme-drift-1",children:"🪷"}),
    e.jsx("div",{className:"absolute bottom-6 right-72 text-orange-400/65 text-sm animate-theme-drift-2",children:"🌻"})
  ]})
]})`;

src = src.slice(0, jStart) + newJ3e + src.slice(jEnd);

// 2. Replace _z themes and Z3e so default ("sunrise") is crisp plain white (bg-white) with lively accents!
const zStart = src.indexOf("const _z={");
const zEnd = src.indexOf("\n,K9_THEMES={", zStart);
if (zStart === -1 || zEnd === -1) throw new Error("Missing _z / Z3e boundaries");

const newZAndHero = `const _z={
  sunrise:{
    id:"sunrise",
    name:"ផ្ទៃពណ៌សធម្មតា & រស់រវើក",
    icon:"⚪",
    iconType:"sunrise",
    bgGradient:"bg-white",
    outerBorder:"border-slate-200",
    dotColor:"#cbd5e1",
    noticeBg:"bg-amber-50/85",
    noticeBorder:"border-amber-200",
    cardBg:"bg-slate-50/90",
    cardBorder:"border-slate-200",
    itemBg:"bg-white",
    itemBorder:"border-slate-200",
    btn1Bg:"bg-white",btn1Border:"border-sky-200 hover:border-sky-400",btn1Text:"text-blue-700",
    btn2Bg:"bg-white",btn2Border:"border-purple-200 hover:border-purple-400",btn2Text:"text-purple-700",
    btn3Bg:"bg-white",btn3Border:"border-emerald-200 hover:border-emerald-400",btn3Text:"text-emerald-700",
    btn4Bg:"bg-white",btn4Border:"border-rose-200 hover:border-rose-400",btn4Text:"text-rose-700"
  },
  forest:{
    id:"forest",
    name:"បៃតងខ្ចីធម្មជាតិ",
    icon:"🌿",
    iconType:"forest",
    bgGradient:"bg-emerald-50/60",
    outerBorder:"border-emerald-200",
    dotColor:"#a7f3d0",
    noticeBg:"bg-white",
    noticeBorder:"border-emerald-200",
    cardBg:"bg-white/95",
    cardBorder:"border-emerald-200",
    itemBg:"bg-emerald-50/50",
    itemBorder:"border-emerald-200",
    btn1Bg:"bg-white",btn1Border:"border-sky-200 hover:border-sky-400",btn1Text:"text-blue-700",
    btn2Bg:"bg-white",btn2Border:"border-purple-200 hover:border-purple-400",btn2Text:"text-purple-700",
    btn3Bg:"bg-white",btn3Border:"border-emerald-200 hover:border-emerald-400",btn3Text:"text-emerald-700",
    btn4Bg:"bg-white",btn4Border:"border-rose-200 hover:border-rose-400",btn4Text:"text-rose-700"
  },
  ocean:{
    id:"ocean",
    name:"ខៀវផ្ទៃមេឃស្រទន់",
    icon:"🩵",
    iconType:"ocean",
    bgGradient:"bg-sky-50/65",
    outerBorder:"border-sky-200",
    dotColor:"#bae6fd",
    noticeBg:"bg-white",
    noticeBorder:"border-sky-200",
    cardBg:"bg-white/95",
    cardBorder:"border-sky-200",
    itemBg:"bg-sky-50/50",
    itemBorder:"border-sky-200",
    btn1Bg:"bg-white",btn1Border:"border-sky-200 hover:border-sky-400",btn1Text:"text-blue-700",
    btn2Bg:"bg-white",btn2Border:"border-purple-200 hover:border-purple-400",btn2Text:"text-purple-700",
    btn3Bg:"bg-white",btn3Border:"border-emerald-200 hover:border-emerald-400",btn3Text:"text-emerald-700",
    btn4Bg:"bg-white",btn4Border:"border-rose-200 hover:border-rose-400",btn4Text:"text-rose-700"
  },
  galaxy:{
    id:"galaxy",
    name:"ផ្កាឈូកស្រាល & សួនច្បារ",
    icon:"🌸",
    iconType:"galaxy",
    bgGradient:"bg-rose-50/60",
    outerBorder:"border-rose-200",
    dotColor:"#fecdd3",
    noticeBg:"bg-white",
    noticeBorder:"border-rose-200",
    cardBg:"bg-white/95",
    cardBorder:"border-rose-200",
    itemBg:"bg-rose-50/45",
    itemBorder:"border-rose-200",
    btn1Bg:"bg-white",btn1Border:"border-sky-200 hover:border-sky-400",btn1Text:"text-blue-700",
    btn2Bg:"bg-white",btn2Border:"border-purple-200 hover:border-purple-400",btn2Text:"text-purple-700",
    btn3Bg:"bg-white",btn3Border:"border-emerald-200 hover:border-emerald-400",btn3Text:"text-emerald-700",
    btn4Bg:"bg-white",btn4Border:"border-rose-200 hover:border-rose-400",btn4Text:"text-rose-700"
  },
  cyber:{
    id:"cyber",
    name:"លឿងមាសស្រាល & កក់ក្តៅ",
    icon:"🏵️",
    iconType:"cyber",
    bgGradient:"bg-amber-50/60",
    outerBorder:"border-amber-200",
    dotColor:"#fde68a",
    noticeBg:"bg-white",
    noticeBorder:"border-amber-200",
    cardBg:"bg-white/95",
    cardBorder:"border-amber-200",
    itemBg:"bg-amber-50/45",
    itemBorder:"border-amber-200",
    btn1Bg:"bg-white",btn1Border:"border-sky-200 hover:border-sky-400",btn1Text:"text-blue-700",
    btn2Bg:"bg-white",btn2Border:"border-purple-200 hover:border-purple-400",btn2Text:"text-purple-700",
    btn3Bg:"bg-white",btn3Border:"border-emerald-200 hover:border-emerald-400",btn3Text:"text-emerald-700",
    btn4Bg:"bg-white",btn4Border:"border-rose-200 hover:border-rose-400",btn4Text:"text-rose-700"
  }
},Z3e=({teacher:r,currentYear:t,onOpenProfile:s,onNavigateTab:a,onShowToast:n,onOpenYearManager:i,onOpenNotices:l})=>{
  const[o,c]=y.useState(()=>Bw(new Date));
  y.useEffect(()=>{const X=()=>{c(Bw(new Date))};X();const H=setInterval(X,3e4);return()=>clearInterval(H)},[]);
  const[d,u]=y.useState(()=>localStorage.getItem("teacher_palace_theme")||"sunrise"),
  [h,m]=y.useState(()=>localStorage.getItem("teacher_palace_auto_rotate")==="true"),
  [w,j]=y.useState(()=>{
    const X=localStorage.getItem("teacher_daily_missions_v2");
    if(X)try{return JSON.parse(X)}catch{}
    return[
      {id:"attendance",title:"ស្រង់វត្តមាន Online យ៉ាងតិច ១ លើក (ព្រឹក/រសៀល)",targetCount:"0/1",isCompleted:!1,xp:300,targetTab:"attendance"},
      {id:"lesson_plan",title:"ពិនិត្យកូនសៀវភៅកិច្ចតែងការបង្រៀនប្រចាំសប្តាហ៍",targetCount:"0/1",isCompleted:!0,xp:300,statusLabel:"រួចរាល់",targetTab:"admin"},
      {id:"emis_stats",title:"ស្រង់ និងផ្ទៀងផ្ទាត់ស្ថិតិអប់រំបឋម (EMIS សេចក្តីណែនាំ ៤២)",targetCount:"0/1",isCompleted:!1,xp:300,targetTab:"admin"}
    ]
  }),
  N=X=>{u(X),localStorage.setItem("teacher_palace_theme",X),n==null||n(\`បានប្តូរពណ៌ផ្ទាំងទៅជា ៖ \${_z[X].name}\`)},
  B=()=>{const X=!h;m(X),localStorage.setItem("teacher_palace_auto_rotate",String(X)),n==null||n(X?"បានបើក Auto 30m ប្តូរពណ៌ស្វ័យប្រវត្តិ":"បានបិទ Auto 30m")};
  y.useEffect(()=>{
    if(!h)return;
    const X=["sunrise","forest","ocean","galaxy","cyber"],
    H=setInterval(()=>{u(O=>{const M=(X.indexOf(O)+1)%X.length,V=X[M];return localStorage.setItem("teacher_palace_theme",V),V})},1800*1e3);
    return()=>clearInterval(H)
  },[h]);
  const A=X=>{
    j(H=>{
      const O=H.map(z=>z.id===X?{...z,isCompleted:!z.isCompleted}:z);
      return localStorage.setItem("teacher_daily_missions_v2",JSON.stringify(O)),O
    }),
    n==null||n("បានធ្វើបច្ចុប្បន្នភាពបេសកកម្មប្រចាំថ្ងៃ!")
  },
  D=_z[d]||_z.sunrise,
  T=r!=null&&r.name&&r.name.trim()!==""?r.name:"លោកគ្រូ ឌុក សុភ័ក្រ",
  E=T.startsWith("លោកគ្រូ")||T.startsWith("អ្នកគ្រូ")?T:\`លោកគ្រូ \${T}\`;

  return e.jsxs("div",{className:\`relative overflow-hidden rounded-[32px] sm:rounded-[36px] \${D.bgGradient} p-4 sm:p-7 md:p-8 border-2 \${D.outerBorder} shadow-lg text-slate-900 transition-all duration-300\`,children:[
    e.jsx("style",{children:\`
      @keyframes palaceMarqueeRun { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee-flow { display: flex; width: max-content; animation: palaceMarqueeRun 30s linear infinite; }
      .animate-marquee-flow:hover { animation-play-state: paused; }
    \`}),
    e.jsx(J3e,{themeKey:d}),
    e.jsx("div",{className:"absolute -right-20 -bottom-20 w-80 h-80 opacity-10 pointer-events-none rotate-12",children:e.jsx("img",{src:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_of_MoEYS_Cambodia.png/800px-Logo_of_MoEYS_Cambodia.png",alt:"MoEYS Watermark",className:"w-full h-full object-contain"})}),
    e.jsxs("div",{className:"relative z-10 space-y-4 sm:space-y-5",children:[
      e.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2.5 pt-0.5 pb-1",children:[
        e.jsxs("div",{className:"inline-flex items-center gap-2",children:[
          e.jsx("div",{className:"w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-0.5 flex items-center justify-center shadow-2xs shrink-0",children:e.jsx("img",{src:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_of_MoEYS_Cambodia.png/800px-Logo_of_MoEYS_Cambodia.png",alt:"MoEYS",className:"w-full h-full object-contain"})}),
          e.jsx("div",{className:"w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-0.5 flex items-center justify-center shadow-2xs shrink-0",children:e.jsx("span",{className:"text-base select-none leading-none",children:D.icon})}),
          e.jsx("h2",{className:"font-moul text-xs sm:text-sm md:text-base text-slate-800 tracking-wide select-none",children:D.name}),
          e.jsx("span",{className:"text-[10px] bg-sky-50 px-2.5 py-0.5 rounded-full text-sky-700 font-bold border border-sky-200 hidden md:inline",children:h?"⏳ ប្តូរស្វ័យប្រវត្តក្នុង 30m":"✨ ផ្ទៃពណ៌សរស់រវើក"})
        ]}),
        e.jsxs("div",{className:"inline-flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-slate-100/90 border border-slate-200 shadow-2xs",children:[
          e.jsx("button",{type:"button",onClick:()=>N("sunrise"),className:\`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer \${d==="sunrise"?"bg-white text-slate-900 ring-2 ring-blue-500 shadow-sm scale-105":"hover:bg-white/80"}\`,title:"ផ្ទៃពណ៌សធម្មតា & រស់រវើក",children:e.jsx("span",{children:"⚪"})}),
          e.jsx("button",{type:"button",onClick:()=>N("forest"),className:\`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer \${d==="forest"?"bg-white text-slate-900 ring-2 ring-emerald-500 shadow-sm scale-105":"hover:bg-white/80"}\`,title:"បៃតងខ្ចីធម្មជាតិ",children:e.jsx("span",{children:"🌿"})}),
          e.jsx("button",{type:"button",onClick:()=>N("ocean"),className:\`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer \${d==="ocean"?"bg-white text-slate-900 ring-2 ring-sky-500 shadow-sm scale-105":"hover:bg-white/80"}\`,title:"ខៀវផ្ទៃមេឃស្រទន់",children:e.jsx("span",{children:"🩵"})}),
          e.jsx("button",{type:"button",onClick:()=>N("galaxy"),className:\`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer \${d==="galaxy"?"bg-white text-slate-900 ring-2 ring-rose-500 shadow-sm scale-105":"hover:bg-white/80"}\`,title:"ផ្កាឈូកស្រាល & សួនច្បារ",children:e.jsx("span",{children:"🌸"})}),
          e.jsx("button",{type:"button",onClick:()=>N("cyber"),className:\`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer \${d==="cyber"?"bg-white text-slate-900 ring-2 ring-amber-500 shadow-sm scale-105":"hover:bg-white/80"}\`,title:"លឿងមាសស្រាល & កក់ក្តៅ",children:e.jsx("span",{children:"🏵️"})}),
          e.jsxs("button",{type:"button",onClick:B,className:\`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1 transition-all active:scale-95 shadow-2xs cursor-pointer \${h?"bg-amber-300 text-amber-950":"bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"}\`,title:"ប្តូរពណ៌ស្វ័យប្រវត្តរៀងរាល់ 30 នាទី",children:[e.jsx(Fi,{className:"w-3 h-3"}),e.jsx("span",{children:"Auto 30m"})]}),
          e.jsx("button",{type:"button",onClick:()=>N("sunrise"),className:"p-1 rounded-full hover:bg-white text-slate-600 transition active:scale-95 cursor-pointer",title:"ត្រឡប់ទៅផ្ទៃពណ៌សធម្មតា",children:e.jsx(En,{className:"w-3.5 h-3.5"})})
        ]})
      ]}),
      e.jsxs("div",{onClick:l,className:\`w-full rounded-full \${D.noticeBg} border \${D.noticeBorder} px-3.5 sm:px-4 py-2 flex items-center shadow-xs overflow-hidden relative cursor-pointer hover:brightness-95 transition group\`,title:"ចុចដើម្បីបើកមើលការជូនដំណឹងផ្លូវការ និងប្រតិទិនឈប់សម្រាកលម្អិត",children:[
        e.jsxs("div",{className:"flex items-center gap-1.5 shrink-0 mr-3 pr-2.5 border-r border-amber-200 z-10",children:[
          e.jsx("span",{className:"font-moul text-rose-600 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1",children:e.jsx("span",{children:"🔔 ជូនដំណឹង ៖"})})
        ]}),
        e.jsx("div",{className:"w-full overflow-hidden relative",children:e.jsxs("div",{className:"animate-marquee-flow flex items-center gap-10 whitespace-nowrap text-xs sm:text-sm font-bold text-slate-800",children:[
          e.jsx("div",{className:"flex items-center gap-8 shrink-0",children:o.tickerItems.map((X,H)=>e.jsxs(yn.Fragment,{children:[e.jsxs("span",{className:"inline-flex items-center gap-2",children:[e.jsx("span",{className:\`text-[10px] px-2 py-0.5 rounded-md \${X.tagColor}\`,children:X.tag}),e.jsx("span",{children:X.text})]}),e.jsx("span",{className:"text-amber-500 select-none font-bold",children:"✦"})]},\`chunk1-\${X.id}-\${H}\`))}),
          e.jsx("div",{className:"flex items-center gap-8 shrink-0","aria-hidden":"true",children:o.tickerItems.map((X,H)=>e.jsxs(yn.Fragment,{children:[e.jsxs("span",{className:"inline-flex items-center gap-2",children:[e.jsx("span",{className:\`text-[10px] px-2 py-0.5 rounded-md \${X.tagColor}\`,children:X.tag}),e.jsx("span",{children:X.text})]}),e.jsx("span",{className:"text-amber-500 select-none font-bold",children:"✦"})]},\`chunk2-\${X.id}-\${H}\`))})
        ]})}),
        e.jsxs("div",{className:"hidden sm:flex items-center gap-1 text-[11px] font-extrabold text-amber-950 ml-2 shrink-0 bg-amber-300 hover:bg-amber-400 px-3 py-1 rounded-full z-10 transition shadow-2xs",children:[e.jsx("span",{children:"លម្អិត"}),e.jsx(Ps,{className:"w-3 h-3 group-hover:translate-x-0.5 transition-transform"})]})
      ]}),
      e.jsxs("div",{className:"flex flex-col md:flex-row landscape:flex-row md:items-center landscape:items-center justify-between gap-5 sm:gap-6",children:[
        e.jsxs("div",{className:"space-y-3.5 max-w-xl w-full min-w-0",children:[
          e.jsxs("div",{className:"flex items-center gap-3.5 flex-wrap",children:[
            e.jsxs("h1",{className:"text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-moul tracking-wide leading-tight",children:["សួស្តី ",e.jsx("span",{className:"text-blue-700",children:E})]}),
            e.jsxs("div",{onClick:s,className:"relative cursor-pointer group shrink-0 active:scale-95 transition-transform",title:"ចុចដើម្បីមើល ឬផ្លាស់ប្តូររូបភាព Profile គ្រូបង្រៀន",children:[
              e.jsx("div",{className:"w-11 h-11 sm:w-12 sm:h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-sky-500 via-emerald-400 to-amber-400 shadow-sm group-hover:scale-105 transition-all",children:e.jsx("div",{className:"w-full h-full rounded-[14px] bg-white overflow-hidden flex items-center justify-center text-slate-800 relative",children:e.jsx(_T,{avatar:r==null?void 0:r.avatar,name:T,fallbackIcon:"👨‍🏫"})})}),
              e.jsx("div",{className:"absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-sm border border-white group-hover:scale-110 transition-transform",children:e.jsx(Ri,{className:"w-2.5 h-2.5"})})
            ]})
          ]}),
          e.jsx("p",{className:"text-xs sm:text-sm text-slate-600 leading-relaxed font-medium",children:"សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងរដ្ឋបាលគ្រូបឋមសិក្សា! ស្រង់វត្តមានសិស្ស កត់ត្រាកិច្ចតែងការ បញ្ចូលពិន្ទុ និងរៀបចំស្ថិតិ EMIS ដើម្បីប្រមូល XP និងសម្រួលការងារបង្រៀន!"}),
          e.jsx("div",{className:"relative w-full",children:e.jsxs("div",{className:"flex flex-wrap gap-2 sm:gap-2.5 py-1 w-full",children:[
            e.jsxs("button",{type:"button",onClick:()=>a("admin"),className:\`shrink-0 px-3 py-2 rounded-2xl border-2 \${D.btn1Border} \${D.btn1Bg} hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-sm hover:shadow-md active:scale-95 text-left cursor-pointer group\`,children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-sky-100 text-sky-700 shrink-0 flex items-center justify-center",children:e.jsxs("svg",{viewBox:"0 0 36 36",fill:"none",className:"w-6 h-6",children:[e.jsx("path",{d:"M18 4 L30 9 V18 C30 25, 22 32, 18 34 C14 32, 6 25, 6 18 V9 Z",fill:"#2563eb"}),e.jsx("path",{d:"M12 18 L16 22 L24 14",stroke:"#ffffff",strokeWidth:"3",strokeLinecap:"round"})]})}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:\`block text-[10px] sm:text-xs font-bold \${D.btn1Text} font-moul tracking-wide truncate leading-tight\`,children:"រដ្ឋបាលទាំង៤"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-500 block truncate font-semibold leading-tight mt-0.5",children:"គ្រប់គ្រងការងាររដ្ឋបាល"})]})
            ]}),
            e.jsxs("button",{type:"button",onClick:()=>a("library"),className:\`shrink-0 px-3 py-2 rounded-2xl border-2 \${D.btn2Border} \${D.btn2Bg} hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-sm hover:shadow-md active:scale-95 text-left cursor-pointer group\`,children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-purple-100 text-purple-700 shrink-0 flex items-center justify-center",children:e.jsxs("svg",{viewBox:"0 0 36 36",fill:"none",className:"w-6 h-6",children:[e.jsx("path",{d:"M6 8 H16 V28 H6 Z",fill:"#9333ea"}),e.jsx("path",{d:"M20 8 H30 V28 H20 Z",fill:"#a855f7"}),e.jsx("path",{d:"M16 8 L20 8 L20 28 L16 28 Z",fill:"#6b21a8"}),e.jsx("path",{d:"M8 13 H14 M8 17 H14 M22 13 H28 M22 17 H28",stroke:"#ffffff",strokeWidth:"1.6",strokeLinecap:"round"})]})}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:\`block text-[10px] sm:text-xs font-bold \${D.btn2Text} font-moul tracking-wide truncate leading-tight\`,children:"ប័ណ្ណាល័យ"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-500 block truncate font-semibold leading-tight mt-0.5",children:"សៀវភៅ និងធនធាន"})]})
            ]}),
            e.jsxs("button",{type:"button",onClick:()=>{try{localStorage.setItem("student_portal_current_id","1")}catch{}a("student_portal")},className:\`shrink-0 px-3 py-2 rounded-2xl border-2 \${D.btn3Border} \${D.btn3Bg} hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-sm hover:shadow-md active:scale-95 text-left cursor-pointer group\`,children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 flex items-center justify-center",children:e.jsxs("svg",{viewBox:"0 0 36 36",fill:"none",className:"w-6 h-6",children:[e.jsx("circle",{cx:"12",cy:"12",r:"5.5",fill:"#10b981"}),e.jsx("circle",{cx:"24",cy:"12",r:"5.5",fill:"#059669"}),e.jsx("path",{d:"M6 31 C6 23, 18 23, 18 31 Z",fill:"#10b981"}),e.jsx("path",{d:"M18 31 C18 23, 30 23, 30 31 Z",fill:"#059669"})]})}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:\`block text-[10px] sm:text-xs font-bold \${D.btn3Text} font-moul tracking-wide truncate leading-tight\`,children:"សិស្ស"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-500 block truncate font-semibold leading-tight mt-0.5",children:"គ្រប់គ្រងព័ត៌មានសិស្ស"})]})
            ]}),
            e.jsxs("button",{type:"button",onClick:()=>a("games"),className:\`shrink-0 px-3 py-2 rounded-2xl border-2 \${D.btn4Border} \${D.btn4Bg} hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-sm hover:shadow-md active:scale-95 text-left cursor-pointer group\`,children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-rose-100 text-rose-600 shrink-0 flex items-center justify-center",children:e.jsxs("svg",{viewBox:"0 0 36 36",fill:"none",className:"w-6 h-6",children:[e.jsx("path",{d:"M4 18 C4 12, 10 8, 18 8 C26 8, 32 12, 32 18 C32 24, 26 28, 18 28 C10 28, 4 24, 4 18 Z",fill:"#f43f5e"}),e.jsx("circle",{cx:"24",cy:"18",r:"3",fill:"#ffffff"}),e.jsx("rect",{x:"8",y:"16",width:"6",height:"4",rx:"2",fill:"#ffffff"})]})}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:\`block text-[10px] sm:text-xs font-bold \${D.btn4Text} font-moul tracking-wide truncate leading-tight\`,children:"ល្បែងសិក្សា"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-500 block truncate font-semibold leading-tight mt-0.5",children:"រៀនតាមរយៈការលេង"})]})
            ]}),
            e.jsxs("button",{type:"button",onClick:()=>window.openEnglishSelfDevModal&&window.openEnglishSelfDevModal(),className:"shrink-0 px-3 py-2 rounded-2xl border-2 border-amber-200 hover:border-amber-400 bg-white hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-sm hover:shadow-md active:scale-95 text-left cursor-pointer group",title:"បើកមជ្ឈមណ្ឌលអភិវឌ្ឍន៍ខ្លួនឯងលើភាសាអង់គ្លេស (English Self-Development Pro)",children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-amber-400 shrink-0 flex items-center justify-center text-base shadow-xs",children:"🇬🇧"}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:"block text-[10px] sm:text-xs font-bold text-amber-700 font-moul tracking-wide truncate leading-tight",children:"អភិវឌ្ឍន៍អង់គ្លេស"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-500 block truncate font-semibold leading-tight mt-0.5",children:"រៀន & ហាត់និយាយដោយខ្លួនឯង"})]})
            ]}),
            e.jsxs("button",{type:"button",onClick:()=>window.openGrade5TutoringModal&&window.openGrade5TutoringModal(),className:"shrink-0 px-3 py-2 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 bg-white hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-sm hover:shadow-md active:scale-95 text-left cursor-pointer group",title:"គ្រប់គ្រងសិស្សរៀនគួរថ្នាក់ទី៥ និងមុខវិជ្ជាបំប៉នពិសេស",children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 shrink-0 flex items-center justify-center text-base shadow-xs text-white font-black",children:"👑"}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:"block text-[10px] sm:text-xs font-bold text-indigo-700 font-moul tracking-wide truncate leading-tight",children:"រៀនគួរថ្នាក់ទី៥"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-500 block truncate font-semibold leading-tight mt-0.5",children:"សម្រាប់តែគ្រូ & សិស្សរៀនគួរ"})]})
            ]})
          ]})})
        ]}),
        e.jsxs("div",{className:\`rounded-[28px] \${D.cardBg} border \${D.cardBorder} p-4 sm:p-5 shadow-sm space-y-3 max-w-sm w-full shrink-0 text-slate-800\`,children:[
          e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[
            e.jsxs("div",{className:"flex items-center gap-2",children:[
              e.jsx("span",{className:"text-xl text-amber-500 select-none leading-none",children:"🎯"}),
              e.jsx("h3",{className:"font-moul text-xs sm:text-sm text-slate-900 tracking-wide select-none",children:"បេសកកម្មថ្ងៃនេះ ៖"})
            ]}),
            e.jsx("div",{children:e.jsxs("span",{className:"px-3 py-1 rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 text-amber-950 font-black text-xs tracking-wider shadow-xs inline-flex items-center gap-1 select-none",children:[e.jsx("span",{children:"✨"})," +900 XP"]})})
          ]}),
          e.jsxs("div",{className:"space-y-2",children:[
            e.jsxs("a",{
              href:"https://plp-sms.moeys.gov.kh/teacher-dashboard",
              target:"_blank",
              rel:"noreferrer",
              onClick:()=>{const att=w.find(m=>m.id==="attendance");if(att&&!att.isCompleted)A("attendance")},
              className:\`p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-2.5 \${D.itemBg} \${D.itemBorder} hover:border-sky-300 shadow-2xs cursor-pointer select-none\`,
              title:"ចុចដើម្បីចូលស្រង់អវត្តមានគ្រូ និងសិស្សតាមប្រព័ន្ធក្រសួងអប់រំ (PLP SMS Teacher Dashboard)",
              children:[
                e.jsxs("div",{className:"flex items-center gap-2.5 flex-1 min-w-0",children:[
                  e.jsx("div",{className:"w-4 h-4 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-600 shrink-0",children:e.jsx("span",{className:"text-[9px] leading-none font-bold",children:"✓"})}),
                  e.jsx("span",{className:"text-xs font-bold truncate text-slate-800",children:"ស្រង់អវត្តមានគ្រូ និងសិស្ស (កម្មវិធីក្រសួង PLP)"})
                ]}),
                e.jsxs("div",{className:"flex items-center gap-1.5 shrink-0",children:[
                  e.jsx("span",{className:"text-[11px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full",children:"PLP"}),
                  e.jsx("span",{className:"p-1 rounded-lg text-slate-500",children:e.jsx(Ps,{className:"w-3.5 h-3.5"})})
                ]})
              ]
            }),
            ...w.map(X=>e.jsxs("div",{className:\`p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-2.5 \${D.itemBg} \${D.itemBorder} hover:border-sky-300 shadow-2xs\`,children:[
              e.jsxs("div",{onClick:()=>{if(X.id==="attendance"){window.open("https://plp-sms.moeys.gov.kh/teacher-dashboard","_blank","noopener,noreferrer");if(!X.isCompleted)A(X.id)}else{A(X.id)}},className:"flex items-center gap-2.5 flex-1 cursor-pointer select-none min-w-0",children:[
                e.jsx("div",{className:"shrink-0",children:X.isCompleted?e.jsx("div",{className:"w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center",children:e.jsx(hs,{className:"w-3 h-3"})}):e.jsx("div",{className:"w-4 h-4 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-600",children:e.jsx("span",{className:"text-[9px] leading-none font-bold",children:"✓"})})}),
                e.jsx("span",{className:\`text-xs font-semibold truncate \${X.isCompleted?"text-slate-500 line-through":"text-slate-800"}\`,children:X.title})
              ]}),
              e.jsxs("div",{className:"flex items-center gap-1.5 shrink-0",children:[
                X.isCompleted?e.jsx("span",{className:"px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold shadow-2xs",children:"រួចរាល់"}):e.jsx("span",{className:"text-xs font-extrabold text-amber-700 px-1.5 py-0.5",children:X.targetCount}),
                X.id==="attendance"?e.jsx("a",{href:"https://plp-sms.moeys.gov.kh/teacher-dashboard",target:"_blank",rel:"noreferrer",onClick:()=>{if(!X.isCompleted)A(X.id)},className:"p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-700 transition cursor-pointer",title:"ចូលស្រង់វត្តមានតាមលីងក្រសួង plp-sms.moeys.gov.kh/teacher-dashboard",children:e.jsx(Ps,{className:"w-3.5 h-3.5"})}):X.targetTab&&e.jsx("button",{type:"button",onClick:()=>a(X.targetTab),className:"p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-700 transition cursor-pointer",title:"ចូលទៅកាន់ផ្នែកនេះ",children:e.jsx(Ps,{className:"w-3.5 h-3.5"})})
              ]})
            ]},X.id))
          ]})
        ]})
      ]})
    ]})
  ]})
}`;

src = src.slice(0, zStart) + newZAndHero + src.slice(zEnd);

fs.writeFileSync(FILE, src, "utf8");

const sf = ts.createSourceFile(FILE, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("Parse diagnostics found:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("SUCCESS: patched plain white vibrant hero v117, 0 parse diagnostics, length:", src.length);
