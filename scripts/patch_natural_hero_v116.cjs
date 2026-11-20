const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

// 1. Replace J3e with natural lively botanical/sunlight backdrop (zero cyber grid/radar/neon)
const jStart = src.indexOf("J3e=({themeKey:r})=>");
const jEnd = src.indexOf(";function K3e(", jStart);
if (jStart === -1 || jEnd === -1) throw new Error("Missing J3e boundaries");

const newJ3e = `J3e=({themeKey:r})=>e.jsxs("div",{className:"absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-[inherit]",children:[
  e.jsx("div",{className:"absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/15 blur-2xl"}),
  e.jsx("div",{className:"absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-yellow-200/15 blur-2xl"}),
  r==="sunrise"&&e.jsxs(e.Fragment,{children:[
    e.jsx("div",{className:"absolute right-4 -bottom-10 opacity-20 text-white w-52 h-52 sm:w-64 sm:h-64",children:e.jsxs("svg",{viewBox:"0 0 200 200",fill:"none",className:"w-full h-full stroke-current",strokeWidth:"1.5",children:[
      e.jsx("circle",{cx:"100",cy:"100",r:"36",fill:"rgba(255,255,255,0.22)"}),
      [0,30,60,90,120,150,180,210,240,270,300,330].map(t=>e.jsx("path",{d:"M100 18 C110 45, 110 62, 100 72 C90 62, 90 45, 100 18 Z",fill:"rgba(255,255,255,0.18)",transform:\`rotate(\${t} 100 100)\`},t))
    ]})}),
    e.jsx("div",{className:"absolute top-6 right-32 text-white/80 text-base animate-theme-float",children:"☀️"}),
    e.jsx("div",{className:"absolute bottom-6 right-72 text-white/70 text-sm animate-theme-drift-2",children:"🌼"}),
    e.jsx("div",{className:"absolute top-10 left-1/3 text-white/60 text-sm animate-theme-drift-1",children:"🕊️"})
  ]}),
  r==="forest"&&e.jsxs(e.Fragment,{children:[
    e.jsx("div",{className:"absolute right-4 -bottom-10 opacity-20 text-white w-48 h-48 sm:w-60 sm:h-60 animate-theme-float",children:e.jsxs("svg",{viewBox:"0 0 200 200",fill:"none",className:"w-full h-full stroke-current",strokeWidth:"1.6",children:[
      e.jsx("path",{d:"M100 185 C60 150, 42 110, 48 62 C54 22, 90 12, 100 12 C110 12, 146 22, 152 62 C158 110, 140 150, 100 185 Z",fill:"rgba(255,255,255,0.18)"}),
      e.jsx("line",{x1:"100",y1:"185",x2:"100",y2:"18",strokeWidth:"2"}),
      e.jsx("path",{d:"M100 65 Q128 54 142 40 M100 98 Q136 86 148 70 M100 65 Q72 54 58 40 M100 98 Q64 86 52 70"})
    ]})}),
    e.jsx("div",{className:"absolute top-5 right-32 text-white/80 text-sm animate-theme-drift-1",children:"🌿"}),
    e.jsx("div",{className:"absolute bottom-6 right-72 text-white/75 text-sm animate-theme-drift-2",children:"🍃"}),
    e.jsx("div",{className:"absolute top-10 left-1/3 text-white/70 text-sm animate-theme-float",children:"🌱"})
  ]}),
  r==="ocean"&&e.jsxs(e.Fragment,{children:[
    e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-24 opacity-20 text-white pointer-events-none overflow-hidden",children:e.jsxs("svg",{viewBox:"0 0 1200 120",preserveAspectRatio:"none",className:"w-[130%] h-full fill-current animate-ocean-wave -ml-[15%]",children:[
      e.jsx("path",{d:"M0,25 C200,90 420,-10 640,55 C860,115 1040,20 1200,50 L1200,120 L0,120 Z"})
    ]})}),
    e.jsx("div",{className:"absolute top-5 right-32 text-white/80 text-sm animate-bubble-1",children:"🫧"}),
    e.jsx("div",{className:"absolute bottom-8 right-72 text-white/70 text-sm animate-theme-float",children:"🌊"}),
    e.jsx("div",{className:"absolute top-10 left-1/3 text-white/75 text-sm animate-bubble-3",children:"🐚"})
  ]}),
  r==="galaxy"&&e.jsxs(e.Fragment,{children:[
    e.jsx("div",{className:"absolute right-6 -bottom-8 opacity-20 text-white w-48 h-48 sm:w-60 sm:h-60 animate-theme-float",children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"rgba(255,255,255,0.22)",className:"w-full h-full",children:[0,72,144,216,288].map(t=>e.jsx("ellipse",{cx:"100",cy:"52",rx:"22",ry:"38",transform:\`rotate(\${t} 100 100)\`},t))})}),
    e.jsx("div",{className:"absolute top-5 right-32 text-white/85 text-base animate-theme-drift-1",children:"🌸"}),
    e.jsx("div",{className:"absolute bottom-6 right-72 text-white/75 text-sm animate-theme-drift-2",children:"🌺"}),
    e.jsx("div",{className:"absolute top-10 left-1/3 text-white/80 text-sm animate-theme-float",children:"🦋"})
  ]}),
  r==="cyber"&&e.jsxs(e.Fragment,{children:[
    e.jsx("div",{className:"absolute right-4 -bottom-10 opacity-20 text-white w-52 h-52 sm:w-64 sm:h-64",children:e.jsx("svg",{viewBox:"0 0 100 100",fill:"currentColor",className:"w-full h-full",children:e.jsx("path",{d:"M50 8 L55 26 L65 31 L62 50 L74 56 L71 80 L84 85 L84 94 L16 94 L16 85 L29 80 L26 56 L38 50 L35 31 L45 26 Z"})})}),
    e.jsx("div",{className:"absolute top-5 right-32 text-white/85 text-base animate-theme-drift-1",children:"🪷"}),
    e.jsx("div",{className:"absolute bottom-6 right-72 text-white/80 text-sm animate-theme-drift-2",children:"🌻"}),
    e.jsx("div",{className:"absolute top-10 left-1/3 text-white/75 text-sm animate-theme-float",children:"✨"})
  ]})
]})`;

src = src.slice(0, jStart) + newJ3e + src.slice(jEnd);

// 2. Replace _z themes and Z3e hero greeting card with vibrant, lively, natural colors (NO dark neon/cyber)
const zStart = src.indexOf("const _z={sunrise:");
const zEnd = src.indexOf("\n,K9_THEMES={", zStart);
if (zStart === -1 || zEnd === -1) throw new Error("Missing _z / Z3e boundaries");

const newZAndHero = `const _z={
  sunrise:{
    id:"sunrise",
    name:"ថ្ងៃរះស្រស់ស្រាយ & មេឃខៀវ",
    icon:"🌞",
    iconType:"sunrise",
    bgGradient:"bg-gradient-to-br from-sky-500 via-blue-500 to-teal-500",
    outerBorder:"border-white/70",
    dotColor:"#ffffff",
    noticeBg:"bg-white/95",
    noticeBorder:"border-amber-300",
    cardBg:"bg-white/95",
    cardBorder:"border-white/90",
    itemBg:"bg-sky-50/85",
    itemBorder:"border-sky-200/90",
    btn1Bg:"bg-white/95",btn1Border:"border-sky-200 hover:border-sky-400",btn1Text:"text-blue-700",
    btn2Bg:"bg-white/95",btn2Border:"border-purple-200 hover:border-purple-400",btn2Text:"text-purple-700",
    btn3Bg:"bg-white/95",btn3Border:"border-emerald-200 hover:border-emerald-400",btn3Text:"text-emerald-700",
    btn4Bg:"bg-white/95",btn4Border:"border-rose-200 hover:border-rose-400",btn4Text:"text-rose-700"
  },
  forest:{
    id:"forest",
    name:"ធម្មជាតិ & បៃតងស្រស់បំព្រង",
    icon:"🌿",
    iconType:"forest",
    bgGradient:"bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500",
    outerBorder:"border-white/70",
    dotColor:"#ffffff",
    noticeBg:"bg-white/95",
    noticeBorder:"border-emerald-200",
    cardBg:"bg-white/95",
    cardBorder:"border-white/90",
    itemBg:"bg-emerald-50/85",
    itemBorder:"border-emerald-200/90",
    btn1Bg:"bg-white/95",btn1Border:"border-sky-200 hover:border-sky-400",btn1Text:"text-blue-700",
    btn2Bg:"bg-white/95",btn2Border:"border-purple-200 hover:border-purple-400",btn2Text:"text-purple-700",
    btn3Bg:"bg-white/95",btn3Border:"border-emerald-200 hover:border-emerald-400",btn3Text:"text-emerald-700",
    btn4Bg:"bg-white/95",btn4Border:"border-rose-200 hover:border-rose-400",btn4Text:"text-rose-700"
  },
  ocean:{
    id:"ocean",
    name:"មហាសមុទ្រ & រលកខៀវស្រស់",
    icon:"🌊",
    iconType:"ocean",
    bgGradient:"bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500",
    outerBorder:"border-white/70",
    dotColor:"#ffffff",
    noticeBg:"bg-white/95",
    noticeBorder:"border-sky-200",
    cardBg:"bg-white/95",
    cardBorder:"border-white/90",
    itemBg:"bg-cyan-50/85",
    itemBorder:"border-sky-200/90",
    btn1Bg:"bg-white/95",btn1Border:"border-sky-200 hover:border-sky-400",btn1Text:"text-blue-700",
    btn2Bg:"bg-white/95",btn2Border:"border-purple-200 hover:border-purple-400",btn2Text:"text-purple-700",
    btn3Bg:"bg-white/95",btn3Border:"border-emerald-200 hover:border-emerald-400",btn3Text:"text-emerald-700",
    btn4Bg:"bg-white/95",btn4Border:"border-rose-200 hover:border-rose-400",btn4Text:"text-rose-700"
  },
  galaxy:{
    id:"galaxy",
    name:"សួនបុប្ផា & ផ្ការីករស់រវើក",
    icon:"🌸",
    iconType:"galaxy",
    bgGradient:"bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400",
    outerBorder:"border-white/70",
    dotColor:"#ffffff",
    noticeBg:"bg-white/95",
    noticeBorder:"border-rose-200",
    cardBg:"bg-white/95",
    cardBorder:"border-white/90",
    itemBg:"bg-rose-50/80",
    itemBorder:"border-rose-200/90",
    btn1Bg:"bg-white/95",btn1Border:"border-sky-200 hover:border-sky-400",btn1Text:"text-blue-700",
    btn2Bg:"bg-white/95",btn2Border:"border-purple-200 hover:border-purple-400",btn2Text:"text-purple-700",
    btn3Bg:"bg-white/95",btn3Border:"border-emerald-200 hover:border-emerald-400",btn3Text:"text-emerald-700",
    btn4Bg:"bg-white/95",btn4Border:"border-rose-200 hover:border-rose-400",btn4Text:"text-rose-700"
  },
  cyber:{
    id:"cyber",
    name:"ពន្លឺមាសសុវណ្ណ & កក់ក្តៅ",
    icon:"🏵️",
    iconType:"cyber",
    bgGradient:"bg-gradient-to-br from-amber-500 via-orange-500 to-rose-400",
    outerBorder:"border-white/70",
    dotColor:"#ffffff",
    noticeBg:"bg-white/95",
    noticeBorder:"border-amber-200",
    cardBg:"bg-white/95",
    cardBorder:"border-white/90",
    itemBg:"bg-amber-50/85",
    itemBorder:"border-amber-200/90",
    btn1Bg:"bg-white/95",btn1Border:"border-sky-200 hover:border-sky-400",btn1Text:"text-blue-700",
    btn2Bg:"bg-white/95",btn2Border:"border-purple-200 hover:border-purple-400",btn2Text:"text-purple-700",
    btn3Bg:"bg-white/95",btn3Border:"border-emerald-200 hover:border-emerald-400",btn3Text:"text-emerald-700",
    btn4Bg:"bg-white/95",btn4Border:"border-rose-200 hover:border-rose-400",btn4Text:"text-rose-700"
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

  return e.jsxs("div",{className:\`relative overflow-hidden rounded-[32px] sm:rounded-[36px] \${D.bgGradient} p-4 sm:p-7 md:p-8 border-2 \${D.outerBorder} shadow-xl text-white transition-all duration-300\`,children:[
    e.jsx("style",{children:\`
      @keyframes palaceMarqueeRun { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee-flow { display: flex; width: max-content; animation: palaceMarqueeRun 30s linear infinite; }
      .animate-marquee-flow:hover { animation-play-state: paused; }
    \`}),
    e.jsx(J3e,{themeKey:d}),
    e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/15 pointer-events-none"}),
    e.jsx("div",{className:"absolute -right-20 -bottom-20 w-80 h-80 opacity-15 pointer-events-none rotate-12",children:e.jsx("img",{src:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_of_MoEYS_Cambodia.png/800px-Logo_of_MoEYS_Cambodia.png",alt:"MoEYS Watermark",className:"w-full h-full object-contain"})}),
    e.jsxs("div",{className:"relative z-10 space-y-4 sm:space-y-5",children:[
      e.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2.5 pt-0 pb-1",children:[
        e.jsxs("div",{className:"inline-flex items-center gap-2",children:[
          e.jsx("div",{className:"w-8 h-8 rounded-xl bg-white/90 border border-white p-0.5 flex items-center justify-center shadow-sm shrink-0",children:e.jsx("img",{src:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_of_MoEYS_Cambodia.png/800px-Logo_of_MoEYS_Cambodia.png",alt:"MoEYS",className:"w-full h-full object-contain"})}),
          e.jsx("div",{className:"w-8 h-8 rounded-xl bg-white/90 border border-white p-0.5 flex items-center justify-center shadow-sm shrink-0",children:e.jsx("span",{className:"text-base select-none leading-none",children:D.icon})}),
          e.jsx("h2",{className:"font-moul text-xs sm:text-sm md:text-base text-white tracking-wide drop-shadow-xs select-none",children:D.name}),
          e.jsx("span",{className:"text-[10px] bg-white/25 px-2.5 py-0.5 rounded-full text-white font-bold border border-white/40 hidden md:inline",children:h?"⏳ ប្តូរស្វ័យប្រវត្តក្នុង 30m":"🎨 ពណ៌ធម្មជាតិរស់រវើក"})
        ]}),
        e.jsxs("div",{className:"inline-flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-white/25 backdrop-blur-md border border-white/40 shadow-sm",children:[
          e.jsx("button",{type:"button",onClick:()=>N("sunrise"),className:\`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer \${d==="sunrise"?"bg-white text-slate-900 ring-2 ring-amber-300 shadow-sm scale-105":"hover:bg-white/25"}\`,title:"ថ្ងៃរះស្រស់ស្រាយ & មេឃខៀវ",children:e.jsx("span",{children:"🌞"})}),
          e.jsx("button",{type:"button",onClick:()=>N("forest"),className:\`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer \${d==="forest"?"bg-white text-slate-900 ring-2 ring-amber-300 shadow-sm scale-105":"hover:bg-white/25"}\`,title:"ធម្មជាតិ & បៃតងស្រស់បំព្រង",children:e.jsx("span",{children:"🌿"})}),
          e.jsx("button",{type:"button",onClick:()=>N("ocean"),className:\`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer \${d==="ocean"?"bg-white text-slate-900 ring-2 ring-amber-300 shadow-sm scale-105":"hover:bg-white/25"}\`,title:"មហាសមុទ្រ & រលកខៀវស្រស់",children:e.jsx("span",{children:"🌊"})}),
          e.jsx("button",{type:"button",onClick:()=>N("galaxy"),className:\`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer \${d==="galaxy"?"bg-white text-slate-900 ring-2 ring-amber-300 shadow-sm scale-105":"hover:bg-white/25"}\`,title:"សួនបុប្ផា & ផ្ការីករស់រវើក",children:e.jsx("span",{children:"🌸"})}),
          e.jsx("button",{type:"button",onClick:()=>N("cyber"),className:\`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer \${d==="cyber"?"bg-white text-slate-900 ring-2 ring-amber-300 shadow-sm scale-105":"hover:bg-white/25"}\`,title:"ពន្លឺមាសសុវណ្ណ & កក់ក្តៅ",children:e.jsx("span",{children:"🏵️"})}),
          e.jsxs("button",{type:"button",onClick:B,className:\`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer \${h?"bg-amber-300 text-amber-950":"bg-white/90 text-slate-800 hover:bg-white"}\`,title:"ប្តូរពណ៌ស្វ័យប្រវត្តរៀងរាល់ 30 នាទី",children:[e.jsx(Fi,{className:"w-3 h-3"}),e.jsx("span",{children:"Auto 30m"})]}),
          e.jsx("button",{type:"button",onClick:()=>N("sunrise"),className:"p-1 rounded-full hover:bg-white/25 text-white transition active:scale-95 cursor-pointer",title:"ត្រឡប់ទៅពណ៌ថ្ងៃរះស្រស់ស្រាយ",children:e.jsx(En,{className:"w-3.5 h-3.5"})})
        ]})
      ]}),
      e.jsxs("div",{onClick:l,className:\`w-full rounded-full \${D.noticeBg} border-2 \${D.noticeBorder} px-3.5 sm:px-4 py-2 flex items-center shadow-md overflow-hidden relative cursor-pointer hover:bg-white transition group\`,title:"ចុចដើម្បីបើកមើលការជូនដំណឹងផ្លូវការ និងប្រតិទិនឈប់សម្រាកលម្អិត",children:[
        e.jsxs("div",{className:"flex items-center gap-1.5 shrink-0 mr-3 pr-2.5 border-r border-slate-200 z-10",children:[
          e.jsx("span",{className:"font-moul text-rose-600 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1",children:e.jsx("span",{children:"🔔 ជូនដំណឹង ៖"})})
        ]}),
        e.jsx("div",{className:"w-full overflow-hidden relative",children:e.jsxs("div",{className:"animate-marquee-flow flex items-center gap-10 whitespace-nowrap text-xs sm:text-sm font-bold text-slate-800",children:[
          e.jsx("div",{className:"flex items-center gap-8 shrink-0",children:o.tickerItems.map((X,H)=>e.jsxs(yn.Fragment,{children:[e.jsxs("span",{className:"inline-flex items-center gap-2",children:[e.jsx("span",{className:\`text-[10px] px-2 py-0.5 rounded-md \${X.tagColor}\`,children:X.tag}),e.jsx("span",{children:X.text})]}),e.jsx("span",{className:"text-amber-500 select-none font-bold",children:"✦"})]},\`chunk1-\${X.id}-\${H}\`))}),
          e.jsx("div",{className:"flex items-center gap-8 shrink-0","aria-hidden":"true",children:o.tickerItems.map((X,H)=>e.jsxs(yn.Fragment,{children:[e.jsxs("span",{className:"inline-flex items-center gap-2",children:[e.jsx("span",{className:\`text-[10px] px-2 py-0.5 rounded-md \${X.tagColor}\`,children:X.tag}),e.jsx("span",{children:X.text})]}),e.jsx("span",{className:"text-amber-500 select-none font-bold",children:"✦"})]},\`chunk2-\${X.id}-\${H}\`))})
        ]})}),
        e.jsxs("div",{className:"hidden sm:flex items-center gap-1 text-[11px] font-extrabold text-amber-950 ml-2 shrink-0 bg-amber-300 hover:bg-amber-400 px-3 py-1 rounded-full z-10 transition shadow-xs",children:[e.jsx("span",{children:"លម្អិត"}),e.jsx(Ps,{className:"w-3 h-3 group-hover:translate-x-0.5 transition-transform"})]})
      ]}),
      e.jsxs("div",{className:"flex flex-col md:flex-row landscape:flex-row md:items-center landscape:items-center justify-between gap-5 sm:gap-6",children:[
        e.jsxs("div",{className:"space-y-3.5 max-w-xl w-full min-w-0",children:[
          e.jsxs("div",{className:"flex items-center gap-3.5 flex-wrap",children:[
            e.jsxs("h1",{className:"text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-moul tracking-wide leading-tight drop-shadow-sm",children:["សួស្តី ",E]}),
            e.jsxs("div",{onClick:s,className:"relative cursor-pointer group shrink-0 active:scale-95 transition-transform",title:"ចុចដើម្បីមើល ឬផ្លាស់ប្តូររូបភាព Profile គ្រូបង្រៀន",children:[
              e.jsx("div",{className:"w-11 h-11 sm:w-12 sm:h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-300 via-yellow-200 to-white shadow-md group-hover:scale-105 transition-all",children:e.jsx("div",{className:"w-full h-full rounded-[14px] bg-white overflow-hidden flex items-center justify-center text-slate-800 relative",children:e.jsx(_T,{avatar:r==null?void 0:r.avatar,name:T,fallbackIcon:"👨‍🏫"})})}),
              e.jsx("div",{className:"absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-sm border border-white group-hover:scale-110 transition-transform",children:e.jsx(Ri,{className:"w-2.5 h-2.5"})})
            ]})
          ]}),
          e.jsx("p",{className:"text-xs sm:text-sm text-white/95 leading-relaxed font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]",children:"សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងរដ្ឋបាលគ្រូបឋមសិក្សា! ស្រង់វត្តមានសិស្ស កត់ត្រាកិច្ចតែងការ បញ្ចូលពិន្ទុ និងរៀបចំស្ថិតិ EMIS ដើម្បីប្រមូល XP និងសម្រួលការងារបង្រៀន!"}),
          e.jsx("div",{className:"relative w-full",children:e.jsxs("div",{className:"flex flex-wrap gap-2 sm:gap-2.5 py-1 w-full",children:[
            e.jsxs("button",{type:"button",onClick:()=>a("admin"),className:\`shrink-0 px-3 py-2 rounded-2xl border-2 \${D.btn1Border} \${D.btn1Bg} hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-md hover:shadow-lg active:scale-95 text-left cursor-pointer group\`,children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-sky-100 text-sky-700 shrink-0 flex items-center justify-center",children:e.jsxs("svg",{viewBox:"0 0 36 36",fill:"none",className:"w-6 h-6",children:[e.jsx("path",{d:"M18 4 L30 9 V18 C30 25, 22 32, 18 34 C14 32, 6 25, 6 18 V9 Z",fill:"#2563eb"}),e.jsx("path",{d:"M12 18 L16 22 L24 14",stroke:"#ffffff",strokeWidth:"3",strokeLinecap:"round"})]})}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:\`block text-[10px] sm:text-xs font-bold \${D.btn1Text} font-moul tracking-wide truncate leading-tight\`,children:"រដ្ឋបាលទាំង៤"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-600 block truncate font-semibold leading-tight mt-0.5",children:"គ្រប់គ្រងការងាររដ្ឋបាល"})]})
            ]}),
            e.jsxs("button",{type:"button",onClick:()=>a("library"),className:\`shrink-0 px-3 py-2 rounded-2xl border-2 \${D.btn2Border} \${D.btn2Bg} hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-md hover:shadow-lg active:scale-95 text-left cursor-pointer group\`,children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-purple-100 text-purple-700 shrink-0 flex items-center justify-center",children:e.jsxs("svg",{viewBox:"0 0 36 36",fill:"none",className:"w-6 h-6",children:[e.jsx("path",{d:"M6 8 H16 V28 H6 Z",fill:"#9333ea"}),e.jsx("path",{d:"M20 8 H30 V28 H20 Z",fill:"#a855f7"}),e.jsx("path",{d:"M16 8 L20 8 L20 28 L16 28 Z",fill:"#6b21a8"}),e.jsx("path",{d:"M8 13 H14 M8 17 H14 M22 13 H28 M22 17 H28",stroke:"#ffffff",strokeWidth:"1.6",strokeLinecap:"round"})]})}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:\`block text-[10px] sm:text-xs font-bold \${D.btn2Text} font-moul tracking-wide truncate leading-tight\`,children:"ប័ណ្ណាល័យ"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-600 block truncate font-semibold leading-tight mt-0.5",children:"សៀវភៅ និងធនធាន"})]})
            ]}),
            e.jsxs("button",{type:"button",onClick:()=>{try{localStorage.setItem("student_portal_current_id","1")}catch{}a("student_portal")},className:\`shrink-0 px-3 py-2 rounded-2xl border-2 \${D.btn3Border} \${D.btn3Bg} hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-md hover:shadow-lg active:scale-95 text-left cursor-pointer group\`,children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 flex items-center justify-center",children:e.jsxs("svg",{viewBox:"0 0 36 36",fill:"none",className:"w-6 h-6",children:[e.jsx("circle",{cx:"12",cy:"12",r:"5.5",fill:"#10b981"}),e.jsx("circle",{cx:"24",cy:"12",r:"5.5",fill:"#059669"}),e.jsx("path",{d:"M6 31 C6 23, 18 23, 18 31 Z",fill:"#10b981"}),e.jsx("path",{d:"M18 31 C18 23, 30 23, 30 31 Z",fill:"#059669"})]})}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:\`block text-[10px] sm:text-xs font-bold \${D.btn3Text} font-moul tracking-wide truncate leading-tight\`,children:"សិស្ស"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-600 block truncate font-semibold leading-tight mt-0.5",children:"គ្រប់គ្រងព័ត៌មានសិស្ស"})]})
            ]}),
            e.jsxs("button",{type:"button",onClick:()=>a("games"),className:\`shrink-0 px-3 py-2 rounded-2xl border-2 \${D.btn4Border} \${D.btn4Bg} hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-md hover:shadow-lg active:scale-95 text-left cursor-pointer group\`,children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-rose-100 text-rose-600 shrink-0 flex items-center justify-center",children:e.jsxs("svg",{viewBox:"0 0 36 36",fill:"none",className:"w-6 h-6",children:[e.jsx("path",{d:"M4 18 C4 12, 10 8, 18 8 C26 8, 32 12, 32 18 C32 24, 26 28, 18 28 C10 28, 4 24, 4 18 Z",fill:"#f43f5e"}),e.jsx("circle",{cx:"24",cy:"18",r:"3",fill:"#ffffff"}),e.jsx("rect",{x:"8",y:"16",width:"6",height:"4",rx:"2",fill:"#ffffff"})]})}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:\`block text-[10px] sm:text-xs font-bold \${D.btn4Text} font-moul tracking-wide truncate leading-tight\`,children:"ល្បែងសិក្សា"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-600 block truncate font-semibold leading-tight mt-0.5",children:"រៀនតាមរយៈការលេង"})]})
            ]}),
            e.jsxs("button",{type:"button",onClick:()=>window.openEnglishSelfDevModal&&window.openEnglishSelfDevModal(),className:"shrink-0 px-3 py-2 rounded-2xl border-2 border-amber-200 hover:border-amber-400 bg-white/95 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-md hover:shadow-lg active:scale-95 text-left cursor-pointer group",title:"បើកមជ្ឈមណ្ឌលអភិវឌ្ឍន៍ខ្លួនឯងលើភាសាអង់គ្លេស (English Self-Development Pro)",children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-amber-400 shrink-0 flex items-center justify-center text-base shadow-xs",children:"🇬🇧"}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:"block text-[10px] sm:text-xs font-bold text-amber-700 font-moul tracking-wide truncate leading-tight",children:"អភិវឌ្ឍន៍អង់គ្លេស"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-600 block truncate font-semibold leading-tight mt-0.5",children:"រៀន & ហាត់និយាយដោយខ្លួនឯង"})]})
            ]}),
            e.jsxs("button",{type:"button",onClick:()=>window.openGrade5TutoringModal&&window.openGrade5TutoringModal(),className:"shrink-0 px-3 py-2 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 bg-white/95 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 shadow-md hover:shadow-lg active:scale-95 text-left cursor-pointer group",title:"គ្រប់គ្រងសិស្សរៀនគួរថ្នាក់ទី៥ និងមុខវិជ្ជាបំប៉នពិសេស",children:[
              e.jsx("div",{className:"w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 shrink-0 flex items-center justify-center text-base shadow-xs text-white font-black",children:"👑"}),
              e.jsxs("div",{className:"min-w-0 pr-0.5",children:[e.jsx("strong",{className:"block text-[10px] sm:text-xs font-bold text-indigo-700 font-moul tracking-wide truncate leading-tight",children:"រៀនគួរថ្នាក់ទី៥"}),e.jsx("span",{className:"text-[9px] sm:text-[10px] text-slate-600 block truncate font-semibold leading-tight mt-0.5",children:"សម្រាប់តែគ្រូ & សិស្សរៀនគួរ"})]})
            ]})
          ]})})
        ]}),
        e.jsxs("div",{className:\`rounded-[28px] \${D.cardBg} border-2 \${D.cardBorder} p-4 sm:p-5 shadow-xl space-y-3 max-w-sm w-full shrink-0 text-slate-800\`,children:[
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
              className:\`p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-2.5 \${D.itemBg} \${D.itemBorder} hover:brightness-95 cursor-pointer select-none\`,
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
            ...w.map(X=>e.jsxs("div",{className:\`p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-2.5 \${D.itemBg} \${D.itemBorder} hover:brightness-95\`,children:[
              e.jsxs("div",{onClick:()=>{if(X.id==="attendance"){window.open("https://plp-sms.moeys.gov.kh/teacher-dashboard","_blank","noopener,noreferrer");if(!X.isCompleted)A(X.id)}else{A(X.id)}},className:"flex items-center gap-2.5 flex-1 cursor-pointer select-none min-w-0",children:[
                e.jsx("div",{className:"shrink-0",children:X.isCompleted?e.jsx("div",{className:"w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center",children:e.jsx(hs,{className:"w-3 h-3"})}):e.jsx("div",{className:"w-4 h-4 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-600",children:e.jsx("span",{className:"text-[9px] leading-none font-bold",children:"✓"})})}),
                e.jsx("span",{className:\`text-xs font-semibold truncate \${X.isCompleted?"text-slate-500 line-through":"text-slate-800"}\`,children:X.title})
              ]}),
              e.jsxs("div",{className:"flex items-center gap-1.5 shrink-0",children:[
                X.isCompleted?e.jsx("span",{className:"px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold shadow-2xs",children:"រួចរាល់"}):e.jsx("span",{className:"text-xs font-extrabold text-amber-700 px-1.5 py-0.5",children:X.targetCount}),
                X.id==="attendance"?e.jsx("a",{href:"https://plp-sms.moeys.gov.kh/teacher-dashboard",target:"_blank",rel:"noreferrer",onClick:()=>{if(!X.isCompleted)A(X.id)},className:"p-1 rounded-lg hover:bg-white text-slate-500 hover:text-blue-700 transition cursor-pointer",title:"ចូលស្រង់វត្តមានតាមលីងក្រសួង plp-sms.moeys.gov.kh/teacher-dashboard",children:e.jsx(Ps,{className:"w-3.5 h-3.5"})}):X.targetTab&&e.jsx("button",{type:"button",onClick:()=>a(X.targetTab),className:"p-1 rounded-lg hover:bg-white text-slate-500 hover:text-blue-700 transition cursor-pointer",title:"ចូលទៅកាន់ផ្នែកនេះ",children:e.jsx(Ps,{className:"w-3.5 h-3.5"})})
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
console.log("SUCCESS: patched natural vibrant hero v116, 0 parse diagnostics, length:", src.length);
