const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

if (src.includes("M_RING_PRESETS_V114")) {
  console.error("Already patched v114! Restore backup or verify.");
  process.exit(1);
}

// Inject helper module + M_RING_PRESETS_V114 right before `,G9=[`
const helperCode = `
,K9_THEMES={
  mint:{bg:"#bbf7d0",ring:"#14532d",soft:"#ecfdf5",badge:"#15803d",label:"បៃតងខ្ចី (Mint)"},
  sky:{bg:"#bae6fd",ring:"#0c4a6e",soft:"#f0f9ff",badge:"#0369a1",label:"ខៀវផ្ទៃមេឃ (Sky)"},
  amber:{bg:"#fde68a",ring:"#78350f",soft:"#fffbeb",badge:"#b45309",label:"លឿងទុំ (Amber)"},
  teal:{bg:"#99f6e4",ring:"#134e4a",soft:"#f0fdfa",badge:"#0f766e",label:"ត្បូងមរកត (Teal)"},
  lavender:{bg:"#ddd6fe",ring:"#4c1d95",soft:"#f5f3ff",badge:"#6d28d9",label:"ស្វាយខ្ចី (Lavender)"},
  peach:{bg:"#fed7aa",ring:"#7c2d12",soft:"#fff7ed",badge:"#c2410c",label:"ទឹកក្រូចខ្ចី (Peach)"},
  rose:{bg:"#fbcfe8",ring:"#831843",soft:"#fdf2f8",badge:"#be185d",label:"ផ្កាឈូក (Rose)"},
  lime:{bg:"#d9f99d",ring:"#365314",soft:"#f7fee7",badge:"#4d7c0f",label:"បៃតងស្លឹក (Lime)"}
}
,K9_CONV_CATS={
  length:{label:"ប្រវែង (Length)",units:[
    {id:"km",name:"km (គីឡូម៉ែត្រ)",f:1000},
    {id:"hm",name:"hm (ហិចតូម៉ែត្រ)",f:100},
    {id:"dam",name:"dam (ដេកាម៉ែត្រ)",f:10},
    {id:"m",name:"m (ម៉ែត្រ)",f:1},
    {id:"dm",name:"dm (ដេស៊ីម៉ែត្រ)",f:0.1},
    {id:"cm",name:"cm (សង់ទីម៉ែត្រ)",f:0.01},
    {id:"mm",name:"mm (មិល្លីម៉ែត្រ)",f:0.001}
  ]},
  mass:{label:"ទម្ងន់ (Mass)",units:[
    {id:"t",name:"t (តោន)",f:1000000},
    {id:"q",name:"q (គីនតាល់)",f:100000},
    {id:"kg",name:"kg (គីឡូក្រាម)",f:1000},
    {id:"hg",name:"hg (ហិចតូក្រាម)",f:100},
    {id:"dag",name:"dag (ដេកាក្រាម)",f:10},
    {id:"g",name:"g (ក្រាម)",f:1},
    {id:"mg",name:"mg (មិល្លីក្រាម)",f:0.001}
  ]},
  capacity:{label:"ចំណុះ (Capacity)",units:[
    {id:"kl",name:"kl (គីឡូលីត្រ / m³)",f:1000},
    {id:"hl",name:"hl (ហិចតូលីត្រ)",f:100},
    {id:"dal",name:"dal (ដេកាលីត្រ)",f:10},
    {id:"L",name:"L (លីត្រ / dm³)",f:1},
    {id:"dl",name:"dl (ដេស៊ីលីត្រ)",f:0.1},
    {id:"cl",name:"cl (សង់ទីលីត្រ)",f:0.01},
    {id:"ml",name:"ml (មិល្លីលីត្រ / cm³)",f:0.001}
  ]},
  area:{label:"ផ្ទៃក្រឡា (Area)",units:[
    {id:"km2",name:"km² (គីឡូម៉ែត្រការ៉េ)",f:1000000},
    {id:"ha",name:"ha / hm² (ហិកតា)",f:10000},
    {id:"a",name:"a / dam² (អារ)",f:100},
    {id:"m2",name:"m² (ម៉ែត្រការ៉េ)",f:1},
    {id:"dm2",name:"dm² (ដេស៊ីម៉ែត្រការ៉េ)",f:0.01},
    {id:"cm2",name:"cm² (សង់ទីម៉ែត្រការ៉េ)",f:0.0001}
  ]},
  volume:{label:"មាឌ (Volume)",units:[
    {id:"m3",name:"m³ (ម៉ែត្រគូប)",f:1000},
    {id:"dm3",name:"dm³ / L (ដេស៊ីម៉ែត្រគូប)",f:1},
    {id:"cm3",name:"cm³ / ml (សង់ទីម៉ែត្រគូប)",f:0.001},
    {id:"mm3",name:"mm³ (មិល្លីម៉ែត្រគូប)",f:0.000001}
  ]},
  time:{label:"ពេលវេលា (Time)",units:[
    {id:"day",name:"ថ្ងៃ (Day)",f:86400},
    {id:"h",name:"ម៉ោង (Hour)",f:3600},
    {id:"min",name:"នាទី (Minute)",f:60},
    {id:"s",name:"វិនាទី (Second)",f:1}
  ]}
}
,K9_SVG=(kind)=>{
  switch(kind){
    case"prism":return \`<svg viewBox="0 0 150 102" class="w-full h-full">
      <polygon points="36,16 124,28 124,78 36,66" fill="none" stroke="#0f172a" stroke-width="1.7" stroke-dasharray="4,3"/>
      <line x1="18" y1="36" x2="36" y2="16" stroke="#0f172a" stroke-width="2.1"/>
      <line x1="106" y1="48" x2="124" y2="28" stroke="#0f172a" stroke-width="2.1"/>
      <line x1="18" y1="86" x2="36" y2="66" stroke="#0f172a" stroke-width="1.7" stroke-dasharray="4,3"/>
      <line x1="106" y1="96" x2="124" y2="78" stroke="#0f172a" stroke-width="2.1"/>
      <polygon points="18,36 106,48 124,28 36,16" fill="#ffffff" fill-opacity="0.28" stroke="#0f172a" stroke-width="2.1" stroke-linejoin="round"/>
      <polygon points="18,36 106,48 106,96 18,86" fill="#ffffff" fill-opacity="0.16" stroke="#0f172a" stroke-width="2.1" stroke-linejoin="round"/>
      <polygon points="106,48 124,28 124,78 106,96" fill="#0f172a" fill-opacity="0.06" stroke="#0f172a" stroke-width="2.1" stroke-linejoin="round"/>
      <text x="10" y="81" font-size="12" font-weight="800" font-style="italic" fill="#0f172a">w</text>
      <text x="58" y="99" font-size="12" font-weight="800" font-style="italic" fill="#0f172a">l</text>
      <text x="129" y="59" font-size="12" font-weight="800" font-style="italic" fill="#0f172a">h</text>
    </svg>\`;
    case"prism_ex":return \`<svg viewBox="0 0 132 76" class="w-full h-full">
      <polygon points="36,14 114,24 114,46 36,36" fill="none" stroke="#0f172a" stroke-width="1.4" stroke-dasharray="3,2"/>
      <line x1="22" y1="30" x2="36" y2="14" stroke="#0f172a" stroke-width="1.9"/>
      <line x1="100" y1="40" x2="114" y2="24" stroke="#0f172a" stroke-width="1.9"/>
      <line x1="22" y1="52" x2="36" y2="36" stroke="#0f172a" stroke-width="1.4" stroke-dasharray="3,2"/>
      <line x1="100" y1="62" x2="114" y2="46" stroke="#0f172a" stroke-width="1.9"/>
      <polygon points="22,30 100,40 114,24 36,14" fill="#ffffff" fill-opacity="0.3" stroke="#0f172a" stroke-width="1.9" stroke-linejoin="round"/>
      <polygon points="22,30 100,40 100,62 22,52" fill="#ffffff" fill-opacity="0.16" stroke="#0f172a" stroke-width="1.9" stroke-linejoin="round"/>
      <polygon points="100,40 114,24 114,46 100,62" fill="#0f172a" fill-opacity="0.07" stroke="#0f172a" stroke-width="1.9" stroke-linejoin="round"/>
      <text x="2" y="34" font-size="9.5" font-weight="800" fill="#0f172a">2 m</text>
      <text x="10" y="55" font-size="9.5" font-weight="800" fill="#0f172a">5 m</text>
      <text x="56" y="71" font-size="9.5" font-weight="800" fill="#0f172a">6 m</text>
    </svg>\`;
    case"length":return \`<svg viewBox="0 0 150 102" class="w-full h-full">
      <polyline points="12,86 30,86 30,74 48,74 48,62 66,62 66,50 84,50 84,38 102,38 102,26 122,26 122,14 142,14" fill="none" stroke="#0f172a" stroke-width="2.1" stroke-linejoin="round"/>
      <text x="14" y="82" font-size="8.5" font-weight="800" fill="#0f172a">mm</text>
      <text x="33" y="70" font-size="8.5" font-weight="800" fill="#0f172a">cm</text>
      <text x="51" y="58" font-size="8.5" font-weight="800" fill="#0f172a">dm</text>
      <text x="71" y="46" font-size="9.5" font-weight="900" fill="#0369a1">m</text>
      <text x="84" y="34" font-size="8" font-weight="800" fill="#0f172a">dam</text>
      <text x="104" y="22" font-size="8.5" font-weight="800" fill="#0f172a">hm</text>
      <text x="125" y="11" font-size="9" font-weight="900" fill="#0f172a">km</text>
      <path d="M98,52 L124,78" stroke="#0f172a" stroke-width="1.8"/>
      <text x="114" y="64" font-size="9.5" font-weight="900" fill="#0369a1">×10</text>
      <path d="M52,24 L26,50" stroke="#0f172a" stroke-width="1.8"/>
      <polygon points="52,24 44,26 50,32" fill="#0f172a"/>
      <polygon points="124,78 116,76 122,70" fill="#0f172a"/>
      <text x="16" y="32" font-size="9.5" font-weight="900" fill="#b91c1c">÷10</text>
      <rect x="14" y="89" width="124" height="10" rx="2" fill="#ffffff" fill-opacity="0.7" stroke="#0f172a" stroke-width="1.5"/>
      <path d="M26,89 v5 M38,89 v3 M50,89 v5 M62,89 v3 M74,89 v5 M86,89 v3 M98,89 v5 M110,89 v3 M122,89 v5" stroke="#0f172a" stroke-width="1.2"/>
    </svg>\`;
    case"length_ex":return \`<svg viewBox="0 0 132 76" class="w-full h-full">
      <rect x="10" y="16" width="112" height="22" rx="3" fill="#ffffff" fill-opacity="0.7" stroke="#0f172a" stroke-width="1.8"/>
      <path d="M22,16 v9 M34,16 v5 M46,16 v9 M58,16 v5 M70,16 v9 M82,16 v5 M94,16 v9 M106,16 v5 M118,16 v9" stroke="#0f172a" stroke-width="1.4"/>
      <text x="18" y="34" font-size="8" font-weight="800" fill="#0f172a">0</text>
      <text x="64" y="34" font-size="8" font-weight="800" fill="#0f172a">50</text>
      <text x="100" y="34" font-size="8" font-weight="800" fill="#0f172a">100cm</text>
      <path d="M16,52 L116,52" stroke="#0f172a" stroke-width="1.8" stroke-dasharray="3,2"/>
      <circle cx="16" cy="52" r="3" fill="#0f172a"/><circle cx="116" cy="52" r="3" fill="#0f172a"/>
      <text x="38" y="68" font-size="9.5" font-weight="900" fill="#0f172a">3.5 km</text>
    </svg>\`;
    case"mass":return \`<svg viewBox="0 0 150 102" class="w-full h-full">
      <line x1="75" y1="16" x2="75" y2="86" stroke="#0f172a" stroke-width="2.5"/>
      <polygon points="50,90 100,90 90,82 60,82" fill="#ffffff" fill-opacity="0.5" stroke="#0f172a" stroke-width="2"/>
      <line x1="22" y1="28" x2="128" y2="28" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="75" cy="28" r="4" fill="#0f172a"/>
      <path d="M26,28 L14,56 L38,56 Z" fill="none" stroke="#0f172a" stroke-width="1.6"/>
      <path d="M12,56 Q26,65 40,56 Z" fill="#ffffff" fill-opacity="0.6" stroke="#0f172a" stroke-width="1.8"/>
      <rect x="19" y="43" width="14" height="13" rx="2" fill="#0f172a"/>
      <text x="20" y="53" font-size="7.5" font-weight="900" fill="#ffffff">1kg</text>
      <path d="M124,28 L112,56 L136,56 Z" fill="none" stroke="#0f172a" stroke-width="1.6"/>
      <path d="M110,56 Q124,65 138,56 Z" fill="#ffffff" fill-opacity="0.6" stroke="#0f172a" stroke-width="1.8"/>
      <text x="111" y="52" font-size="7.5" font-weight="900" fill="#0f172a">1000g</text>
      <text x="48" y="16" font-size="9" font-weight="900" fill="#0f172a">t • q • kg • g</text>
      <text x="42" y="75" font-size="8.5" font-weight="800" fill="#78350f">×10 / ÷10</text>
    </svg>\`;
    case"mass_ex":return \`<svg viewBox="0 0 132 76" class="w-full h-full">
      <polygon points="36,24 96,24 106,62 26,62" fill="#ffffff" fill-opacity="0.55" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
      <path d="M50,24 C50,12 82,12 82,24" fill="none" stroke="#0f172a" stroke-width="2.2"/>
      <text x="47" y="48" font-size="11" font-weight="900" fill="#0f172a">2.4 t</text>
    </svg>\`;
    case"capacity":return \`<svg viewBox="0 0 150 102" class="w-full h-full">
      <rect x="24" y="14" width="44" height="74" rx="4" fill="#ffffff" fill-opacity="0.5" stroke="#0f172a" stroke-width="2.1"/>
      <rect x="26" y="42" width="40" height="44" rx="2" fill="#0d9488" fill-opacity="0.28"/>
      <path d="M24,28 h10 M24,42 h14 M24,56 h10 M24,70 h14" stroke="#0f172a" stroke-width="1.7"/>
      <text x="41" y="45" font-size="8" font-weight="900" fill="#0f172a">1 L</text>
      <text x="41" y="73" font-size="7.5" font-weight="800" fill="#0f172a">500ml</text>
      <text x="74" y="54" font-size="13" font-weight="900" fill="#0f172a">=</text>
      <polygon points="94,38 126,38 126,74 94,74" fill="#ffffff" fill-opacity="0.35" stroke="#0f172a" stroke-width="2"/>
      <polygon points="94,38 106,26 138,26 126,38" fill="#ffffff" fill-opacity="0.55" stroke="#0f172a" stroke-width="2"/>
      <polygon points="126,38 138,26 138,62 126,74" fill="#0f172a" fill-opacity="0.08" stroke="#0f172a" stroke-width="2"/>
      <text x="97" y="60" font-size="9.5" font-weight="900" fill="#0f172a">1 dm³</text>
      <text x="94" y="88" font-size="8.5" font-weight="800" fill="#115e59">kl → L → ml</text>
    </svg>\`;
    case"capacity_ex":return \`<svg viewBox="0 0 132 76" class="w-full h-full">
      <path d="M48,14 h36 v12 l8,10 v28 a4,4 0 0 1 -4,4 h-44 a4,4 0 0 1 -4,-4 v-28 l8,-10 z" fill="#ffffff" fill-opacity="0.55" stroke="#0f172a" stroke-width="1.9"/>
      <rect x="42" y="40" width="48" height="26" fill="#0d9488" fill-opacity="0.25"/>
      <text x="49" y="56" font-size="10.5" font-weight="900" fill="#0f172a">4.5 L</text>
    </svg>\`;
    case"area":return \`<svg viewBox="0 0 150 102" class="w-full h-full">
      <rect x="18" y="18" width="96" height="60" fill="#ffffff" fill-opacity="0.45" stroke="#0f172a" stroke-width="2.2"/>
      <path d="M42,18 v60 M66,18 v60 M90,18 v60 M18,38 h96 M18,58 h96" stroke="#0f172a" stroke-width="1" stroke-dasharray="2,2"/>
      <text x="56" y="92" font-size="10.5" font-weight="900" fill="#0f172a">b = បណ្តោយ</text>
      <text x="118" y="52" font-size="10.5" font-weight="900" fill="#0f172a">h</text>
      <text x="36" y="13" font-size="9" font-weight="900" fill="#5b21b6">១ ថ្នាក់ = ×100 / ÷100</text>
    </svg>\`;
    case"area_ex":return \`<svg viewBox="0 0 132 76" class="w-full h-full">
      <rect x="20" y="16" width="84" height="44" fill="#ffffff" fill-opacity="0.5" stroke="#0f172a" stroke-width="2"/>
      <line x1="20" y1="38" x2="104" y2="38" stroke="#0f172a" stroke-width="1" stroke-dasharray="3,2"/>
      <text x="48" y="72" font-size="9.5" font-weight="800" fill="#0f172a">8 m</text>
      <text x="108" y="42" font-size="9.5" font-weight="800" fill="#0f172a">5 m</text>
    </svg>\`;
    case"volume":return \`<svg viewBox="0 0 150 102" class="w-full h-full">
      <polyline points="14,82 44,82 44,60 76,60 76,38 108,38 108,16 140,16" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linejoin="round"/>
      <text x="16" y="76" font-size="9" font-weight="800" fill="#0f172a">mm³</text>
      <text x="48" y="54" font-size="9.5" font-weight="900" fill="#0f172a">cm³</text>
      <text x="79" y="32" font-size="9.5" font-weight="900" fill="#9a3412">dm³</text>
      <text x="114" y="13" font-size="10" font-weight="900" fill="#0f172a">m³</text>
      <text x="86" y="72" font-size="9.5" font-weight="900" fill="#c2410c">× 1,000</text>
      <text x="18" y="34" font-size="9.5" font-weight="900" fill="#0f172a">÷ 1,000</text>
      <text x="20" y="96" font-size="8.5" font-weight="800" fill="#7c2d12">1 dm³ = 1 L  |  1 cm³ = 1 ml</text>
    </svg>\`;
    case"volume_ex":return \`<svg viewBox="0 0 132 76" class="w-full h-full">
      <rect x="28" y="24" width="44" height="40" fill="#ffffff" fill-opacity="0.45" stroke="#0f172a" stroke-width="1.9"/>
      <polygon points="28,24 44,12 88,12 72,24" fill="#ffffff" fill-opacity="0.6" stroke="#0f172a" stroke-width="1.9"/>
      <polygon points="72,24 88,12 88,52 72,64" fill="#0f172a" fill-opacity="0.08" stroke="#0f172a" stroke-width="1.9"/>
      <text x="36" y="48" font-size="9.5" font-weight="900" fill="#0f172a">0.8 m³</text>
    </svg>\`;
    case"time":return \`<svg viewBox="0 0 150 102" class="w-full h-full">
      <circle cx="75" cy="51" r="40" fill="#ffffff" fill-opacity="0.65" stroke="#0f172a" stroke-width="2.5"/>
      <circle cx="75" cy="51" r="3" fill="#0f172a"/>
      <text x="70" y="22" font-size="9" font-weight="900" fill="#0f172a">12</text>
      <text x="104" y="54" font-size="9" font-weight="900" fill="#0f172a">3</text>
      <text x="72" y="86" font-size="9" font-weight="900" fill="#0f172a">6</text>
      <text x="41" y="54" font-size="9" font-weight="900" fill="#0f172a">9</text>
      <line x1="75" y1="51" x2="75" y2="27" stroke="#0f172a" stroke-width="2.6" stroke-linecap="round"/>
      <line x1="75" y1="51" x2="96" y2="51" stroke="#be185d" stroke-width="2" stroke-linecap="round"/>
      <text x="6" y="96" font-size="8" font-weight="900" fill="#831843">1ម៉ោង = 60នាទី = 3,600វិ.</text>
    </svg>\`;
    case"time_ex":return \`<svg viewBox="0 0 132 76" class="w-full h-full">
      <rect x="20" y="18" width="92" height="38" rx="8" fill="#ffffff" fill-opacity="0.65" stroke="#0f172a" stroke-width="2"/>
      <text x="34" y="42" font-size="13" font-weight="900" fill="#0f172a">02 : 30</text>
      <text x="34" y="69" font-size="8.5" font-weight="800" fill="#831843">2ម៉ោង 30នាទី</text>
    </svg>\`;
    case"cylinder":return \`<svg viewBox="0 0 150 102" class="w-full h-full">
      <ellipse cx="52" cy="24" rx="28" ry="9" fill="#ffffff" fill-opacity="0.45" stroke="#0f172a" stroke-width="2"/>
      <line x1="24" y1="24" x2="24" y2="78" stroke="#0f172a" stroke-width="2"/>
      <line x1="80" y1="24" x2="80" y2="78" stroke="#0f172a" stroke-width="2"/>
      <path d="M24,78 A28,9 0 0 0 80,78" fill="none" stroke="#0f172a" stroke-width="2"/>
      <path d="M24,78 A28,9 0 0 1 80,78" fill="none" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="3,2"/>
      <line x1="52" y1="24" x2="80" y2="24" stroke="#0f172a" stroke-width="1.6"/>
      <text x="62" y="21" font-size="9" font-weight="900" font-style="italic" fill="#0f172a">r</text>
      <text x="85" y="54" font-size="10" font-weight="900" font-style="italic" fill="#0f172a">h</text>
      <rect x="102" y="44" width="32" height="32" fill="#ffffff" fill-opacity="0.35" stroke="#0f172a" stroke-width="1.8"/>
      <polygon points="102,44 112,35 144,35 134,44" fill="#ffffff" fill-opacity="0.55" stroke="#0f172a" stroke-width="1.8"/>
      <polygon points="134,44 144,35 144,67 134,76" fill="#0f172a" fill-opacity="0.08" stroke="#0f172a" stroke-width="1.8"/>
      <text x="115" y="88" font-size="9" font-weight="900" font-style="italic" fill="#0f172a">a</text>
    </svg>\`;
    case"cylinder_ex":return \`<svg viewBox="0 0 132 76" class="w-full h-full">
      <ellipse cx="66" cy="20" rx="24" ry="7" fill="#ffffff" fill-opacity="0.45" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="42" y1="20" x2="42" y2="56" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="90" y1="20" x2="90" y2="56" stroke="#0f172a" stroke-width="1.8"/>
      <path d="M42,56 A24,7 0 0 0 90,56" fill="none" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="66" y1="20" x2="90" y2="20" stroke="#0f172a" stroke-width="1.4"/>
      <text x="68" y="17" font-size="8" font-weight="900" fill="#0f172a">2dm</text>
      <text x="94" y="42" font-size="8.5" font-weight="900" fill="#0f172a">5dm</text>
    </svg>\`;
    default:return \`<svg viewBox="0 0 150 102" class="w-full h-full">
      <rect x="20" y="20" width="110" height="62" rx="10" fill="#ffffff" fill-opacity="0.5" stroke="#0f172a" stroke-width="2" stroke-dasharray="4,3"/>
      <text x="45" y="56" font-size="13" font-weight="900" fill="#0f172a">រូបភាព / ខ្នាត</text>
    </svg>\`;
  }
}
,K9_RING_OVERLAY_SVG=(bgColor,ringColor,uid)=>{
  const gid="k9B_"+(uid||"0").replace(/[^a-zA-Z0-9_-]/g,"");
  const coils=[98,115,132,149,166,183,217,234,251,268,285,302].map(x=>\`
    <rect x="\${x-4.5}" y="46" width="9" height="7" rx="2" fill="#0f172a"/>
    <rect x="\${x-3.2}" y="22" width="6.4" height="29" rx="3.2" fill="#ffffff" stroke="#0f172a" stroke-width="2.1"/>
  \`).join("");
  return \`<svg viewBox="0 0 400 400" class="w-full h-full pointer-events-none">
    <defs>
      <linearGradient id="\${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
    </defs>
    <circle cx="200" cy="200" r="195" fill="\${bgColor}" stroke="#0f172a" stroke-width="5"/>
    <circle cx="200" cy="200" r="185" fill="none" stroke="#0f172a" stroke-width="2.2"/>
    <circle cx="200" cy="28" r="9" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
    <path d="M 196,24 C 192,10 208,10 204,24" fill="none" stroke="url(#\${gid})" stroke-width="4.5" stroke-linecap="round"/>
    \${coils}
  </svg>\`;
}
,M_RING_PRESETS_V114=[
  {
    id:"meas-prism",cardType:"measurement-ring",themeColor:"mint",
    badgeText:"មាឌប្រលេពីប៉ែតកែង",badgeEmoji:"📦",
    title:"ប្រលេពីប៉ែតកែង (មាឌ)",
    description:"• បាតជារាងចតុកោណកែង\\n• បណ្តោយចតុកោណកែងគឺ l\\n• ទទឹងចតុកោណកែងគឺ w\\n• កម្ពស់ប្រលេពីប៉ែតគឺ h",
    formula:"មាឌ V = B × h = (l · w)h = l · w · h",
    unitBridge:"1 m³ = 1,000 dm³ = 1,000 L",
    exampleTitle:"ឧទាហរណ៍៖",
    exampleSteps:"V = (6 m × 5 m) × 2 m\\nV = 30 m² × 2 m\\nV = 60 m³ = 60,000 L",
    diagramId:"prism",exampleDiagramId:"prism_ex"
  },
  {
    id:"meas-length",cardType:"measurement-ring",themeColor:"sky",
    badgeText:"រង្វាស់ប្រវែង",badgeEmoji:"📏",
    title:"រង្វាស់ប្រវែង & ប្តូរខ្នាត",
    description:"• ខ្នាតគោលគឺ ម៉ែត្រ (m)\\n• km → hm → dam → m → dm → cm → mm\\n• ចុះ ១ ថ្នាក់ គុណ ×១០\\n• ឡើង ១ ថ្នាក់ ចែក ÷១០",
    formula:"1 km = 1,000 m  |  1 m = 10 dm = 100 cm",
    unitBridge:"1 m = 1,000 mm  |  1 cm = 10 mm",
    exampleTitle:"ឧទាហរណ៍៖",
    exampleSteps:"3.5 km = 3.5 × 1,000 = 3,500 m\\n250 cm = 250 ÷ 100 = 2.5 m\\n4.2 m = 420 cm = 4,200 mm",
    diagramId:"length",exampleDiagramId:"length_ex"
  },
  {
    id:"meas-mass",cardType:"measurement-ring",themeColor:"amber",
    badgeText:"រង្វាស់ទម្ងន់",badgeEmoji:"⚖️",
    title:"រង្វាស់ទម្ងន់ & ប្តូរខ្នាត",
    description:"• ខ្នាតគោលគឺ ក្រាម (g) និង គីឡូក្រាម (kg)\\n• t → q → kg → hg → dag → g → mg\\n• ១ តោន (t) = ១០ គីនតាល់ (q)\\n• ចុះ ១ ថ្នាក់ ×១០ | ឡើង ១ ថ្នាក់ ÷១០",
    formula:"1 t = 1,000 kg  |  1 q = 100 kg",
    unitBridge:"1 kg = 1,000 g  |  1 g = 1,000 mg",
    exampleTitle:"ឧទាហរណ៍៖",
    exampleSteps:"2.4 t = 2.4 × 1,000 = 2,400 kg\\n750 g = 750 ÷ 1,000 = 0.75 kg\\n3 kg 500 g = 3,500 g",
    diagramId:"mass",exampleDiagramId:"mass_ex"
  },
  {
    id:"meas-capacity",cardType:"measurement-ring",themeColor:"teal",
    badgeText:"រង្វាស់ចំណុះ",badgeEmoji:"🧪",
    title:"រង្វាស់ចំណុះ & ប្តូរខ្នាត",
    description:"• ខ្នាតគោលវត្ថុរាវគឺ លីត្រ (L)\\n• kl → hl → dal → L → dl → cl → ml\\n• ចុះ ១ ថ្នាក់ ×១០ | ឡើង ១ ថ្នាក់ ÷១០\\n• ទំនាក់ទំនងពិសេស៖ 1 L = 1 dm³",
    formula:"1 kl = 1,000 L  |  1 L = 1,000 ml",
    unitBridge:"1 m³ = 1,000 L  |  1 cm³ = 1 ml",
    exampleTitle:"ឧទាហរណ៍៖",
    exampleSteps:"4.5 L = 4.5 × 1,000 = 4,500 ml\\n1,200 ml = 1,200 ÷ 1,000 = 1.2 L\\n250 L = 0.25 m³",
    diagramId:"capacity",exampleDiagramId:"capacity_ex"
  },
  {
    id:"meas-area",cardType:"measurement-ring",themeColor:"lavender",
    badgeText:"រង្វាស់ផ្ទៃក្រឡា",badgeEmoji:"🟩",
    title:"រង្វាស់ផ្ទៃក្រឡា & ដីធ្លី",
    description:"• ប្តូរ ១ ថ្នាក់ គុណ ×១០០ ឬ ចែក ÷១០០\\n• km² → hm²(ha) → dam²(a) → m² → dm² → cm²\\n• ផ្ទៃចតុកោណកែង S = b × h\\n• ផ្ទៃការ៉េ S = a × a",
    formula:"1 ha = 100 a = 10,000 m²",
    unitBridge:"1 m² = 100 dm² = 10,000 cm²",
    exampleTitle:"ឧទាហរណ៍៖",
    exampleSteps:"S = 8 m × 5 m = 40 m²\\n40 m² = 40 × 100 = 4,000 dm²\\n2.5 ha = 25,000 m²",
    diagramId:"area",exampleDiagramId:"area_ex"
  },
  {
    id:"meas-volume",cardType:"measurement-ring",themeColor:"peach",
    badgeText:"ខ្នាតមាឌ & ចំណុះ",badgeEmoji:"🧊",
    title:"ការប្តូរខ្នាតមាឌ & ចំណុះ",
    description:"• ខ្នាតគូបប្តូរ ១ ថ្នាក់ = ×១,០០០ ឬ ÷១,០០០\\n• លំដាប់ខ្នាត៖ m³ → dm³ → cm³ → mm³\\n• រំកិលក្បៀស ៣ ខ្ទង់ក្នុង ១ ថ្នាក់\\n• ភ្ជាប់ខ្នាតចំណុះ៖ 1 dm³ = 1 L",
    formula:"1 m³ = 1,000 dm³ = 1,000,000 cm³",
    unitBridge:"1 m³ = 1,000 L  |  1 L = 1,000 cm³",
    exampleTitle:"ឧទាហរណ៍៖",
    exampleSteps:"0.8 m³ = 0.8 × 1,000 = 800 dm³\\n800 dm³ = 800 លីត្រ (L)\\n2,500 cm³ = 2.5 dm³ = 2.5 L",
    diagramId:"volume",exampleDiagramId:"volume_ex"
  },
  {
    id:"meas-time",cardType:"measurement-ring",themeColor:"rose",
    badgeText:"រង្វាស់ពេលវេលា",badgeEmoji:"⏰",
    title:"រង្វាស់ពេលវេលា & ប្តូរខ្នាត",
    description:"• ១ ឆ្នាំ = ១២ ខែ = ៣៦៥ ថ្ងៃ\\n• ១ សប្តាហ៍ = ៧ ថ្ងៃ | ១ ថ្ងៃ = ២៤ ម៉ោង\\n• ១ ម៉ោង (h) = ៦០ នាទី (min)\\n• ១ នាទី (min) = ៦០ វិនាទី (s)",
    formula:"ធំ → តូច ×៦០  |  តូច → ធំ ÷៦០",
    unitBridge:"1 ម៉ោង = 60 នាទី = 3,600 វិនាទី",
    exampleTitle:"ឧទាហរណ៍៖",
    exampleSteps:"2 ម៉ោង 30 នាទី = (2×60)+30 = 150 min\\n150 min = 150 × 60 = 9,000 វិនាទី\\n180 min = 180 ÷ 60 = 3 ម៉ោង",
    diagramId:"time",exampleDiagramId:"time_ex"
  },
  {
    id:"meas-cylinder",cardType:"measurement-ring",themeColor:"lime",
    badgeText:"ស៊ីឡាំង & គូប",badgeEmoji:"🛢️",
    title:"គូប & ស៊ីឡាំង (រង្វាស់មាឌ)",
    description:"• គូបមានជ្រុង ៦ ស្មើគ្នា (ជ្រុង a)\\n• ស៊ីឡាំងមានបាតរង្វង់កាំ r និងកម្ពស់ h\\n• ចំនួនថេរ π ≈ 3.14\\n• ផ្ទៃបាតរង្វង់ B = π × r × r",
    formula:"គូប V = a³  |  ស៊ីឡាំង V = π × r² × h",
    unitBridge:"1 dm³ = 1 លីត្រ (L)",
    exampleTitle:"ឧទាហរណ៍៖",
    exampleSteps:"ស៊ីឡាំង r = 2 dm, h = 5 dm\\nV = 3.14 × (2 × 2) × 5\\nV = 62.8 dm³ = 62.8 L",
    diagramId:"cylinder",exampleDiagramId:"cylinder_ex"
  }
]
`;

const anchorG9 = ",G9=[";
if (!src.includes(anchorG9)) throw new Error("Missing anchorG9");
src = src.replace(anchorG9, helperCode + anchorG9);

// Update m$ component cleanly:
const mStart = src.indexOf("m$=({isOpen:r,onClose:t,teacher:s})=>");
const mEnd = src.indexOf(";let nb=null;", mStart);
if (mStart === -1 || mEnd === -1) throw new Error("Missing m$ boundaries");

const newM = `m$=({isOpen:r,onClose:t,teacher:s,initialPreset:ip})=>{
  const[a,n]=y.useState(()=>{
    if(ip==="measurements")return M_RING_PRESETS_V114;
    const E=localStorage.getItem("custom_classroom_decor_cards");
    if(E)try{return JSON.parse(E)}catch{return G9}
    return G9
  }),
  [i,l]=y.useState("2-per-page"),
  [o,c]=y.useState("gradient"),
  [d,u]=y.useState(!1),
  [h,m]=y.useState(null),
  [w,j]=y.useState(()=>ip||(a[0]?.cardType==="measurement-ring"?"measurements":a[0]?.id?.startsWith("hyg")?"hygiene":"food_safety")),
  [cvOpen,setCvOpen]=y.useState(!1),
  [cvCat,setCvCat]=y.useState("length"),
  [cvVal,setCvVal]=y.useState("3.5"),
  [cvFrom,setCvFrom]=y.useState("km"),
  [cvTo,setCvTo]=y.useState("m");

  y.useEffect(()=>{
    const onSwitch=ev=>{
      const p=ev?.detail;
      if(p==="measurements"){j("measurements");n(M_RING_PRESETS_V114)}
      else if(p==="hygiene"){j("hygiene");n(Y3e)}
      else if(p==="food_safety"){j("food_safety");n(G9)}
    };
    window.addEventListener("open_decor_preset",onSwitch);
    return ()=>window.removeEventListener("open_decor_preset",onSwitch);
  },[]);

  y.useEffect(()=>{
    if(r&&typeof window<"u"&&window.__decorPendingPreset){
      const p=window.__decorPendingPreset;
      window.__decorPendingPreset=null;
      if(p==="measurements"){j("measurements");n(M_RING_PRESETS_V114)}
      else if(p==="hygiene"){j("hygiene");n(Y3e)}
      else if(p==="food_safety"){j("food_safety");n(G9)}
    }
  },[r]);

  y.useEffect(()=>{localStorage.setItem("custom_classroom_decor_cards",JSON.stringify(a))},[a]);

  if(!r)return null;

  const N=(E,X,H)=>{n(O=>O.map(z=>z.id===E?{...z,[X]:H}:z))},
  B=()=>{
    if(w==="measurements"){
      const cols=["mint","sky","amber","teal","lavender","peach","rose","lime"];
      const tc=cols[a.length%cols.length];
      n([...a,{
        id:\`meas-\${Date.now()}\`,cardType:"measurement-ring",themeColor:tc,
        badgeText:\`រង្វាស់ទី \${a.length+1}\`,badgeEmoji:"📐",
        title:"ចំណងជើងរង្វាស់ថ្មី",
        description:"ចំណុចពន្យល់ទី ១\\nចំណុចពន្យល់ទី ២\\nចំណុចពន្យល់ទី ៣",
        formula:"រូបមន្ត ឬ ក្បួនប្តូរខ្នាត",
        unitBridge:"ទំនាក់ទំនងខ្នាត",
        exampleTitle:"ឧទាហរណ៍៖",
        exampleSteps:"ជំហានទី ១\\nជំហានទី ២\\nលទ្ធផល",
        diagramId:"prism",exampleDiagramId:"prism_ex"
      }]);
      return;
    }
    const E=["blue","pink","purple","teal","orange","indigo"],X=E[a.length%E.length],H={id:\`card-\${Date.now()}\`,themeColor:X,badgeText:\`ចំណុចទី \${a.length}\`,title:"ចំណងជើងថ្មី",description:"សូមបញ្ចូលការពិពណ៌នា ឬខ្លឹមសារអប់រំនៅត្រង់នេះ...",highlightWords:""};n([...a,H])
  },
  A=E=>{confirm("តើអ្នកពិតជាចង់លុបផ្ទាំងនេះមែនទេ?")&&n(X=>X.filter(H=>H.id!==E))},
  D=E=>{j(E),n(E==="measurements"?M_RING_PRESETS_V114:E==="food_safety"?G9:Y3e)},
  T=()=>{
    const E=window.open("","_blank");
    if(!E){window.print();return}
    const X=a.map((z,M)=>{
      if(z.cardType==="measurement-ring"){
        const th=K9_THEMES[z.themeColor]||K9_THEMES.mint;
        const bullets=(z.description||"").split("\\n").filter(Boolean).map(b=>\`<div class="mr-bullet">\${b.trim().startsWith("•")?b:"• "+b}</div>\`).join("");
        const exLines=(z.exampleSteps||"").split("\\n").filter(Boolean).map(b=>\`<div class="mr-ex-line">\${b}</div>\`).join("");
        return \`
          <div class="ring-card \${d?"cut-guide":""}" style="background:\${th.bg};">
            <div class="ring-bg-svg">\${K9_RING_OVERLAY_SVG(th.bg,th.ring,"p"+M)}</div>
            <div class="ring-inner">
              <div class="mr-title">\${z.title||""}</div>
              <div class="mr-top-split">
                <div class="mr-diag">\${K9_SVG(z.diagramId||"prism")}</div>
                <div class="mr-bullets">\${bullets}</div>
              </div>
              <div class="mr-divider"></div>
              <div class="mr-formula-wrap">
                <div class="mr-formula">\${z.formula||""}</div>
                \${z.unitBridge?\`<div class="mr-bridge">\${z.unitBridge}</div>\`:""}
              </div>
              <div class="mr-divider"></div>
              <div class="mr-bottom-split">
                <div class="mr-ex-left">
                  <div class="mr-ex-label">\${z.exampleTitle||"ឧទាហរណ៍៖"}</div>
                  <div class="mr-ex-diag">\${K9_SVG(z.exampleDiagramId||(z.diagramId?z.diagramId+"_ex":"prism_ex"))}</div>
                </div>
                <div class="mr-ex-steps">\${exLines}</div>
              </div>
            </div>
          </div>
        \`;
      }
      const V=z.themeColor==="blue"?{primary:"#0284c7",light:"#38bdf8",dark:"#0369a1",deep:"#0c4a6e",innerBg:"#e0f2fe",stroke:"#0099ff",innerStroke:"#0077cc"}:z.themeColor==="pink"?{primary:"#db2777",light:"#f472b6",dark:"#9d174d",deep:"#881337",innerBg:"#fce7f3",stroke:"#f43f5e",innerStroke:"#e11d48"}:z.themeColor==="purple"?{primary:"#9333ea",light:"#c084fc",dark:"#6b21a8",deep:"#581c87",innerBg:"#f3e8ff",stroke:"#a855f7",innerStroke:"#7e22ce"}:z.themeColor==="teal"?{primary:"#0d9488",light:"#2dd4bf",dark:"#115e59",deep:"#134e4a",innerBg:"#ccfbf1",stroke:"#06b6d4",innerStroke:"#0891b2"}:z.themeColor==="orange"?{primary:"#ea580c",light:"#fb923c",dark:"#9a3412",deep:"#7c2d12",innerBg:"#ffedd5",stroke:"#f97316",innerStroke:"#c2410c"}:{primary:"#4f46e5",light:"#818cf8",dark:"#3730a3",deep:"#1e1b4b",innerBg:"#e0e7ff",stroke:"#6366f1",innerStroke:"#4338ca"},G=z.themeColor==="blue"?"background: linear-gradient(135deg, #0284c7, #38bdf8); color: white;":z.themeColor==="pink"?"background: #f43f5e; color: white;":z.themeColor==="purple"?"background: #9333ea; color: white;":z.themeColor==="teal"?"background: #0d9488; color: white;":z.themeColor==="orange"?"background: #ea580c; color: white;":"background: #4f46e5; color: white;",F=M===0&&z.subtitleMiddle;return\`        <div class="classroom-card card-\${z.themeColor} \${d?"cut-guide":""}">          <svg viewBox="0 0 400 500" class="card-svg" preserveAspectRatio="none">            <defs>              <linearGradient id="bfGradPrint_\${M}" x1="0%" y1="0%" x2="100%" y2="100%">                <stop offset="0%" stop-color="\${V.light}" />                <stop offset="50%" stop-color="\${V.primary}" />                <stop offset="100%" stop-color="\${V.dark}" />              </linearGradient>              <filter id="shadowPrint_\${M}" x="-10%" y="-10%" width="120%" height="120%">                <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.25"/>              </filter>            </defs>            <path d="M 45,25                      Q 80,10 115,25 Q 150,40 185,25 Q 220,10 255,25 Q 290,40 325,25 Q 360,10 375,45                     Q 390,80 375,115 Q 360,150 375,185 Q 390,220 375,255 Q 360,290 375,325 Q 390,360 375,395 Q 360,430 375,455                     Q 360,490 325,475 Q 290,460 255,475 Q 220,490 185,475 Q 150,460 115,475 Q 80,490 45,475 Q 10,460 25,425                     Q 40,390 25,355 Q 10,320 25,285 Q 40,250 25,215 Q 10,180 25,145 Q 40,110 25,75 Q 10,40 45,25 Z"                  fill="none" stroke="\${V.stroke}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round" />            <path d="M 45,25                      Q 80,10 115,25 Q 150,40 185,25 Q 220,10 255,25 Q 290,40 325,25 Q 360,10 375,45                     Q 390,80 375,115 Q 360,150 375,185 Q 390,220 375,255 Q 360,290 375,325 Q 390,360 375,395 Q 360,430 375,455                     Q 360,490 325,475 Q 290,460 255,475 Q 220,490 185,475 Q 150,460 115,475 Q 80,490 45,475 Q 10,460 25,425                     Q 40,390 25,355 Q 10,320 25,285 Q 40,250 25,215 Q 10,180 25,145 Q 40,110 25,75 Q 10,40 45,25 Z"                  fill="none" stroke="\${V.innerStroke}" stroke-width="3" stroke-linejoin="round" />            <path d="M 60,48                      Q 90,36 120,48 Q 150,60 180,48 Q 210,36 240,48 Q 270,60 300,48 Q 330,36 350,65                     Q 365,95 350,125 Q 335,155 350,185 Q 365,215 350,245 Q 335,275 350,305 Q 365,335 350,365 Q 335,395 350,430                     Q 330,458 300,446 Q 270,434 240,446 Q 210,458 180,446 Q 150,434 120,446 Q 90,458 60,446 Q 38,432 50,400                     Q 62,370 50,340 Q 38,310 50,280 Q 62,250 50,220 Q 38,190 50,160 Q 62,130 50,100 Q 38,70 60,48 Z"                  fill="none" stroke="\${V.stroke}" stroke-width="2.8" stroke-dasharray="6,6" stroke-linecap="round" />            <g transform="translate(295, 30) rotate(15) scale(0.72)" filter="url(#shadowPrint_\${M})">              <path d="M50,50 C20,10 -10,-10 10,-35 C35,-50 90,-10 65,35 Z" fill="url(#bfGradPrint_\${M})" stroke="\${V.deep}" stroke-width="3"/>              <path d="M55,50 C85,10 115,-10 95,-35 C70,-50 15,-10 40,35 Z" fill="url(#bfGradPrint_\${M})" stroke="\${V.deep}" stroke-width="3"/>              <path d="M30,-15 Q50,-30 65,-10 Q45,15 30,-15 Z" fill="\${V.innerBg}" opacity="0.85"/>              <path d="M75,-15 Q55,-30 40,-10 Q60,15 75,-15 Z" fill="\${V.innerBg}" opacity="0.85"/>              <path d="M48,50 C20,60 0,90 20,110 C45,120 70,85 55,55 Z" fill="url(#bfGradPrint_\${M})" stroke="\${V.deep}" stroke-width="3"/>              <path d="M56,50 C84,60 104,90 84,110 C59,120 34,85 49,55 Z" fill="url(#bfGradPrint_\${M})" stroke="\${V.deep}" stroke-width="3"/>              <circle cx="22" cy="100" r="3.5" fill="#ffffff"/>              <circle cx="82" cy="100" r="3.5" fill="#ffffff"/>              <circle cx="20" cy="-25" r="4.5" fill="#ffffff"/>              <circle cx="84" cy="-25" r="4.5" fill="#ffffff"/>              <ellipse cx="52" cy="50" rx="6" ry="32" fill="#0f172a"/>              <path d="M50,22 Q40,5 30,0" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>              <circle cx="30" cy="0" r="2" fill="#0f172a"/>              <path d="M54,22 Q64,5 74,0" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>              <circle cx="74" cy="0" r="2" fill="#0f172a"/>            </g>          </svg>          <div class="card-inner">            <div class="card-top">              <span class="card-badge" style="\${G}">                \${z.badgeEmoji?\`\${z.badgeEmoji} \`:""}\${z.badgeText}              </span>            </div>            <div class="card-body-content">              <h2 class="card-title">\${z.title}</h2>              \${F?\`                <div class="title-sub-row">                  <span class="line"></span>                  <span class="sub-txt">\${z.subtitleMiddle}</span>                  <span class="line"></span>                </div>                <p class="card-desc title-highlight">\${z.description}</p>              \`:\`                <p class="card-desc">\${z.description}</p>              \`}            </div>            <div class="card-bottom">              <div class="dot-line"></div>              <svg class="heart-icon" viewBox="0 0 24 24" fill="currentColor">                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>              </svg>              <div class="dot-line"></div>            </div>          </div>        </div>      \`}).join(""),H=ac();nc();
    const O=\`<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>សន្លឹកតុបតែងថ្នាក់ - បោះពុម្ព (Print Ready)</title>\${Oo()}
      <style>
        *{ -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; box-sizing:border-box; }
        body{ font-family:'\${H}','Kantumruy Pro','Battambang','Siemreap',sans-serif; margin:0; padding:8mm; background:#fff !important; color:#0f172a; }
        @page{ size:A4 portrait; margin:7mm; }
        .grid-container{ display:grid; width:100%; gap:10mm; justify-content:center; align-items:center; }
        .classroom-card{ position:relative; background:#fff; border-radius:28px; aspect-ratio:1/1.28; box-shadow:0 4px 12px rgba(0,0,0,0.06); overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; page-break-inside:avoid; break-inside:avoid; }
        .ring-card{ position:relative; border-radius:50%; aspect-ratio:1/1; overflow:hidden; page-break-inside:avoid; break-inside:avoid; display:flex; align-items:center; justify-content:center; }
        .ring-bg-svg{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
        .ring-inner{ position:relative; z-index:10; width:100%; height:100%; display:flex; flex-direction:column; justify-content:space-between; text-align:left; color:#0f172a; }
        .mr-title{ text-align:center; font-weight:900; text-decoration:underline; text-underline-offset:3px; line-height:1.25; }
        .mr-top-split{ display:flex; align-items:center; gap:6px; }
        .mr-diag{ width:38%; aspect-ratio:1.45/1; flex-shrink:0; }
        .mr-bullets{ width:62%; font-weight:700; line-height:1.42; }
        .mr-divider{ height:1.8px; background:#0f172a; width:92%; margin:0 auto; opacity:0.85; }
        .mr-formula-wrap{ text-align:center; padding:2px 8px; }
        .mr-formula{ font-weight:900; line-height:1.3; }
        .mr-bridge{ font-weight:800; opacity:0.85; margin-top:1px; }
        .mr-bottom-split{ display:flex; align-items:center; gap:8px; width:80%; margin:0 auto; }
        .mr-ex-left{ width:42%; flex-shrink:0; }
        .mr-ex-label{ font-weight:900; text-decoration:underline; margin-bottom:2px; }
        .mr-ex-diag{ width:100%; aspect-ratio:1.7/1; }
        .mr-ex-steps{ width:58%; font-weight:800; line-height:1.4; font-variant-numeric:tabular-nums; }
        .cut-guide{ outline:1.5px dashed #94a3b8 !important; outline-offset:4px !important; }
        .card-svg{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
        .card-inner{ position:relative; z-index:10; text-align:center; padding:24px 28px; width:100%; height:100%; display:flex; flex-direction:column; justify-content:space-between; }
        .card-badge{ display:inline-block; padding:4px 14px; border-radius:9999px; font-size:11pt; font-weight:800; box-shadow:0 2px 4px rgba(0,0,0,0.1); }
        .card-title{ font-family:'Koulen',sans-serif; margin:8px 0; line-height:1.2; }
        .card-desc{ font-weight:700; line-height:1.5; margin:6px 0; }
        .card-bottom{ display:flex; align-items:center; justify-content:center; gap:10px; }
        .dot-line{ width:32px; height:4px; border-radius:9999px; background:currentColor; opacity:0.5; }
        .heart-icon{ width:22px; height:22px; fill:currentColor; opacity:0.8; }
        \${o==="gradient"?" .card-blue .card-title{color:#0284c7;} .card-pink .card-title{color:#e11d48;} .card-purple .card-title{color:#7e22ce;} .card-teal .card-title{color:#0f766e;} .card-orange .card-title{color:#ea580c;} .card-indigo .card-title{color:#4338ca;} ":o==="3d"?" .card-title{text-shadow:2px 2px 0 rgba(0,0,0,0.15),3px 3px 6px rgba(0,0,0,0.08);} .card-blue .card-title{color:#0284c7;} .card-pink .card-title{color:#e11d48;} .card-purple .card-title{color:#7e22ce;} .card-teal .card-title{color:#0f766e;} .card-orange .card-title{color:#ea580c;} .card-indigo .card-title{color:#4338ca;} ":" .card-title{color:#0f172a !important;text-shadow:none !important;} .card-desc{color:#1e293b !important;} "}
        \${i==="1-per-page"?\`
          .grid-container{ display:block; }
          .classroom-card{ width:175mm; height:245mm; margin:0 auto 20mm auto; page-break-after:always; break-after:page; }
          .card-title{ font-size:46pt; } .card-desc{ font-size:19pt; } .card-badge{ font-size:15pt; padding:6px 20px; }
          .ring-card{ width:176mm; height:176mm; margin:25mm auto; page-break-after:always; break-after:page; }
          .ring-inner{ padding:27mm 16mm 14mm 16mm; }
          .mr-title{ font-size:21pt; } .mr-bullets{ font-size:11.5pt; } .mr-formula{ font-size:12.5pt; } .mr-bridge{ font-size:10.5pt; } .mr-ex-label{ font-size:11.5pt; } .mr-ex-steps{ font-size:11pt; }
        \`:i==="2-per-page"?\`
          .grid-container{ grid-template-columns:1fr; gap:8mm; }
          .classroom-card{ width:150mm; max-height:125mm; margin:0 auto; }
          .classroom-card:nth-child(2n),.ring-card:nth-child(2n){ page-break-after:always; break-after:page; }
          .card-title{ font-size:26pt; } .card-desc{ font-size:13pt; }
          .ring-card{ width:126mm; height:126mm; margin:0 auto; }
          .ring-inner{ padding:19mm 11mm 10mm 11mm; }
          .mr-title{ font-size:15pt; } .mr-bullets{ font-size:8.4pt; } .mr-formula{ font-size:9.2pt; } .mr-bridge{ font-size:8pt; } .mr-ex-label{ font-size:8.5pt; } .mr-ex-steps{ font-size:8pt; }
        \`:\`
          .grid-container{ grid-template-columns:repeat(2,1fr); gap:6mm; }
          .classroom-card{ width:90mm; }
          .classroom-card:nth-child(4n),.ring-card:nth-child(4n){ page-break-after:always; break-after:page; }
          .card-title{ font-size:17pt; } .card-desc{ font-size:9.5pt; }
          .ring-card{ width:90mm; height:90mm; margin:0 auto; }
          .ring-inner{ padding:13.5mm 7.5mm 7mm 7.5mm; }
          .mr-title{ font-size:10.5pt; } .mr-bullets{ font-size:6.2pt; } .mr-formula{ font-size:6.8pt; } .mr-bridge{ font-size:5.8pt; } .mr-ex-label{ font-size:6.3pt; } .mr-ex-steps{ font-size:6pt; }
        \`}
      </style>
    </head><body><div class="grid-container">\${X}</div><script>window.onload=function(){setTimeout(function(){window.print();},400);};<\\/script></body></html>\`;
    E.document.open(),E.document.write(O),E.document.close()
  };

  const convCat=K9_CONV_CATS[cvCat]||K9_CONV_CATS.length;
  const fromU=convCat.units.find(u=>u.id===cvFrom)||convCat.units[0];
  const toU=convCat.units.find(u=>u.id===cvTo)||convCat.units[Math.min(3,convCat.units.length-1)];
  const parsedVal=parseFloat(cvVal);
  const ratio=fromU.f/toU.f;
  const convertedVal=Number.isFinite(parsedVal)?Number((parsedVal*ratio).toPrecision(10)):0;

  return e.jsx("div",{className:"fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5",children:e.jsxs("div",{className:"bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl w-full max-w-full px-2 sm:px-6 lg:px-8 max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",children:[
    e.jsxs("div",{className:"bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0",children:[
      e.jsxs("div",{className:"flex items-center gap-3",children:[
        e.jsx("div",{className:\`w-10 h-10 rounded-2xl \${w==="measurements"?"bg-gradient-to-tr from-emerald-500 via-teal-600 to-sky-600":"bg-gradient-to-tr from-sky-400 via-blue-600 to-indigo-600"} flex items-center justify-center text-white text-xl shadow-md\`,children:w==="measurements"?"📐":"🦋"}),
        e.jsxs("div",{children:[
          e.jsxs("h3",{className:"font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2",children:[
            e.jsx("span",{children:"សន្លឹកតុបតែងថ្នាក់រៀន (Classroom Decoration Posters)"}),
            e.jsx("span",{className:"bg-blue-100 text-blue-800 text-[11px] font-black px-2 py-0.5 rounded-full",children:"A4 Print Ready"})
          ]}),
          e.jsx("p",{className:"text-xs text-slate-500",children:w==="measurements"?"កាតរង្វង់មានកងរូបភាពរង្វាស់រង្វាល់ រូបមន្ត ការប្តូរខ្នាត និងឧទាហរណ៍សម្រាប់ថ្នាក់រៀន":"រចនាបថគែមរលកផ្កា មេអំបៅ 3D និងពណ៌អក្សរចម្រុះសម្រាប់បិទតុបតែងជញ្ជាំងថ្នាក់"})
        ]})
      ]}),
      e.jsx("button",{onClick:t,className:"p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition",children:e.jsx(Mr,{className:"w-5 h-5"})})
    ]}),
    e.jsxs("div",{className:"bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs",children:[
      e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
        e.jsxs("div",{className:"flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex-wrap gap-1",children:[
          e.jsx("span",{className:"font-bold text-slate-500 px-2",children:"📋 កម្រងគំរូ:"}),
          e.jsx("button",{onClick:()=>D("measurements"),className:\`px-2.5 py-1 rounded-lg font-bold transition \${w==="measurements"?"bg-emerald-600 text-white shadow-xs":"text-slate-700 dark:text-slate-300 hover:bg-slate-100"}\`,children:"📐 រង្វាស់រង្វាល់ & ប្តូរខ្នាត"}),
          e.jsx("button",{onClick:()=>D("food_safety"),className:\`px-2.5 py-1 rounded-lg font-bold transition \${w==="food_safety"?"bg-blue-600 text-white shadow-xs":"text-slate-700 dark:text-slate-300 hover:bg-slate-100"}\`,children:"🥗 ៥ នៃសុវត្ថិភាពចំណីអាហារ"}),
          e.jsx("button",{onClick:()=>D("hygiene"),className:\`px-2.5 py-1 rounded-lg font-bold transition \${w==="hygiene"?"bg-blue-600 text-white shadow-xs":"text-slate-700 dark:text-slate-300 hover:bg-slate-100"}\`,children:"🧼 ទម្លាប់អនាម័យ ៥ យ៉ាង"})
        ]}),
        w==="measurements"&&e.jsxs("button",{onClick:()=>setCvOpen(v=>!v),className:\`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs \${cvOpen?"bg-emerald-600 text-white":"bg-emerald-100 hover:bg-emerald-200 text-emerald-950"}\`,children:[e.jsx("span",{children:"🧮"}),e.jsx("span",{children:"សាកល្បងប្តូរខ្នាត"})]}),
        e.jsxs("button",{onClick:B,className:"px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs",children:[e.jsx(ca,{className:"w-4 h-4"}),e.jsx("span",{children:"បន្ថែមផ្ទាំងថ្មី"})]})
      ]}),
      e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
        e.jsxs("div",{className:"flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs",children:[
          e.jsx("span",{className:"font-bold text-slate-500 px-2",children:"📄 ប្លង់:"}),
          e.jsx("button",{onClick:()=>l("1-per-page"),className:\`px-2 py-1 rounded-lg font-bold transition \${i==="1-per-page"?"bg-blue-600 text-white shadow-xs":"text-slate-700 dark:text-slate-300 hover:bg-slate-100"}\`,children:"១ សន្លឹកធំ"}),
          e.jsx("button",{onClick:()=>l("2-per-page"),className:\`px-2 py-1 rounded-lg font-bold transition \${i==="2-per-page"?"bg-blue-600 text-white shadow-xs":"text-slate-700 dark:text-slate-300 hover:bg-slate-100"}\`,children:"២ ក្នុង ១ទំព័រ"}),
          e.jsx("button",{onClick:()=>l("4-per-page"),className:\`px-2 py-1 rounded-lg font-bold transition \${i==="4-per-page"?"bg-blue-600 text-white shadow-xs":"text-slate-700 dark:text-slate-300 hover:bg-slate-100"}\`,children:"៤ តូចៗ"})
        ]}),
        w!=="measurements"&&e.jsxs("div",{className:"flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs",children:[
          e.jsx("span",{className:"font-bold text-slate-500 px-2",children:"🎨 ពណ៌:"}),
          e.jsx("button",{onClick:()=>c("gradient"),className:\`px-2 py-1 rounded-lg font-bold transition \${o==="gradient"?"bg-blue-600 text-white shadow-xs":"text-slate-700 dark:text-slate-300 hover:bg-slate-100"}\`,children:"Gradient"}),
          e.jsx("button",{onClick:()=>c("3d"),className:\`px-2 py-1 rounded-lg font-bold transition \${o==="3d"?"bg-purple-600 text-white shadow-xs":"text-slate-700 dark:text-slate-300 hover:bg-slate-100"}\`,children:"3D ផុស"}),
          e.jsx("button",{onClick:()=>c("classic"),className:\`px-2 py-1 rounded-lg font-bold transition \${o==="classic"?"bg-slate-700 text-white shadow-xs":"text-slate-700 dark:text-slate-300 hover:bg-slate-100"}\`,children:"ស្តង់ដារខ្មៅ"})
        ]}),
        e.jsxs("button",{onClick:()=>u(!d),className:\`px-3 py-1.5 rounded-xl font-bold border transition flex items-center gap-1.5 \${d?"bg-amber-100 border-amber-400 text-amber-900":"bg-white border-slate-200 text-slate-600"}\`,children:[e.jsx("span",{children:"✂️"}),e.jsxs("span",{children:["បន្ទាត់កាត់: ",d?"បើក":"បិទ"]})]}),
        e.jsxs("button",{onClick:T,className:"px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition active:scale-95",children:[e.jsx(ts,{className:"w-4 h-4"}),e.jsx("span",{children:"បោះពុម្ព (Print / PDF)"})]})
      ]})
    ]}),
    w==="measurements"&&cvOpen&&e.jsxs("div",{className:"bg-emerald-50/90 dark:bg-slate-800 border-b border-emerald-200 dark:border-slate-700 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs",children:[
      e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
        e.jsx("span",{className:"font-black text-emerald-900 dark:text-emerald-300",children:"🧮 គណនាប្តូរខ្នាត៖"}),
        Object.entries(K9_CONV_CATS).map(([k,v])=>e.jsx("button",{onClick:()=>{setCvCat(k);setCvFrom(v.units[0].id);setCvTo(v.units[Math.min(3,v.units.length-1)].id)},className:\`px-2.5 py-1 rounded-lg font-bold transition \${cvCat===k?"bg-emerald-600 text-white shadow-xs":"bg-white text-slate-700 border border-emerald-200 hover:bg-emerald-100"}\`,children:v.label},k))
      ]}),
      e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
        e.jsx("input",{type:"number",step:"any",value:cvVal,onChange:ev=>setCvVal(ev.target.value),className:"w-24 px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white font-black text-slate-900 text-right tabular-nums outline-none focus:ring-2 focus:ring-emerald-500"}),
        e.jsx("select",{value:cvFrom,onChange:ev=>setCvFrom(ev.target.value),className:"px-2 py-1.5 rounded-lg border border-emerald-300 bg-white font-bold text-slate-800",children:convCat.units.map(u=>e.jsx("option",{value:u.id,children:u.name},u.id))}),
        e.jsx("span",{className:"font-black text-emerald-800",children:"="}),
        e.jsx("div",{className:"px-3 py-1.5 rounded-lg bg-slate-900 text-emerald-300 font-black tabular-nums",children:\`\${Number.isFinite(parsedVal)?convertedVal.toLocaleString("en-US",{maximumFractionDigits:6}):"—"} \${toU.id}\`}),
        e.jsx("select",{value:cvTo,onChange:ev=>setCvTo(ev.target.value),className:"px-2 py-1.5 rounded-lg border border-emerald-300 bg-white font-bold text-slate-800",children:convCat.units.map(u=>e.jsx("option",{value:u.id,children:u.name},u.id))}),
        e.jsx("span",{className:"text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 tabular-nums",children:ratio>=1?\`ក្បួន៖ × \${Number(ratio.toPrecision(8)).toLocaleString("en-US")}\`:\`ក្បួន៖ ÷ \${Number((1/ratio).toPrecision(8)).toLocaleString("en-US")}\`})
      ]})
    ]}),
    e.jsxs("div",{className:"bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-slate-700 flex items-center justify-between gap-3",children:[
      e.jsxs("div",{className:"flex items-center gap-2",children:[
        e.jsx("span",{className:"text-lg",children:"🖨️"}),
        e.jsxs("span",{children:[e.jsx("strong",{children:"គន្លឹះបោះពុម្ព៖"})," ពេលផ្ទាំង Print បង្ហាញឡើង សូមបើក ",e.jsx("strong",{children:"«Background graphics»"})," (ក្រាហ្វិកផ្ទៃខាងក្រោយ) ដើម្បីឱ្យពណ៌ផ្ទាំងកាតរង្វង់ និងស៊ុមចេញមកពេញលេញ ១០០%!" ]})
      ]}),
      e.jsx("span",{className:"px-2.5 py-0.5 bg-white text-emerald-800 font-bold rounded-lg border border-emerald-200 shrink-0",children:"✍️ ចុចកែអក្សរផ្ទាល់លើផ្ទាំងនីមួយៗបាន"})
    ]}),
    e.jsx("div",{className:"p-6 overflow-y-auto max-h-[calc(94vh-190px)] bg-slate-100 dark:bg-slate-950",children:e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center w-full max-w-full px-2 sm:px-6 lg:px-8 mx-auto",children:a.map((E,X)=>{
      if(E.cardType==="measurement-ring"){
        const th=K9_THEMES[E.themeColor]||K9_THEMES.mint;
        return e.jsxs("div",{className:\`relative w-full max-w-[380px] aspect-square rounded-full flex items-center justify-center transition hover:shadow-2xl group \${d?"outline-2 outline-dashed outline-slate-400 outline-offset-4":""}\`,children:[
          e.jsx("div",{className:"absolute inset-0 w-full h-full pointer-events-none",dangerouslySetInnerHTML:{__html:K9_RING_OVERLAY_SVG(th.bg,th.ring,"c"+E.id)}}),
          e.jsxs("div",{className:"absolute top-12 right-8 z-20 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full shadow border border-slate-300",children:[
            e.jsx("select",{value:E.themeColor,onChange:z=>N(E.id,"themeColor",z.target.value),className:"text-[10px] bg-transparent font-bold outline-none",children:Object.entries(K9_THEMES).map(([k,v])=>e.jsx("option",{value:k,children:v.label},k))}),
            e.jsx("button",{onClick:()=>A(E.id),className:"p-0.5 text-red-600 hover:bg-red-50 rounded-full",title:"លុប",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})
          ]}),
          e.jsxs("div",{className:"relative z-10 w-full h-full flex flex-col justify-between px-7 pt-[58px] pb-6 text-slate-900",children:[
            e.jsx("input",{type:"text",value:E.title,onChange:z=>N(E.id,"title",z.target.value),className:"w-[88%] mx-auto text-center font-black text-base sm:text-[17px] bg-transparent border-none outline-none underline underline-offset-4 decoration-2 text-slate-900 leading-tight"}),
            e.jsxs("div",{className:"flex items-center gap-2 px-1 my-0.5",children:[
              e.jsx("div",{className:"w-[38%] aspect-[1.42/1] shrink-0",dangerouslySetInnerHTML:{__html:K9_SVG(E.diagramId||"prism")}}),
              e.jsx("textarea",{rows:4,value:E.description,onChange:z=>N(E.id,"description",z.target.value),className:"w-[62%] bg-transparent border-none outline-none text-[10.5px] sm:text-[11px] font-bold text-slate-900 leading-snug resize-none"})
            ]}),
            e.jsx("div",{className:"h-[1.8px] bg-slate-900 w-[92%] mx-auto opacity-85"}),
            e.jsxs("div",{className:"text-center px-2 space-y-0.5",children:[
              e.jsx("input",{type:"text",value:E.formula||"",onChange:z=>N(E.id,"formula",z.target.value),className:"w-full text-center font-black text-[11px] sm:text-xs bg-transparent border-none outline-none text-slate-900 tabular-nums"}),
              e.jsx("input",{type:"text",value:E.unitBridge||"",onChange:z=>N(E.id,"unitBridge",z.target.value),className:"w-full text-center font-extrabold text-[10px] bg-transparent border-none outline-none text-slate-800 tabular-nums"})
            ]}),
            e.jsx("div",{className:"h-[1.8px] bg-slate-900 w-[92%] mx-auto opacity-85"}),
            e.jsxs("div",{className:"flex items-center gap-2 w-[82%] mx-auto pt-0.5",children:[
              e.jsxs("div",{className:"w-[42%] shrink-0",children:[
                e.jsx("div",{className:"text-[10.5px] font-black underline text-slate-900 mb-0.5",children:E.exampleTitle||"ឧទាហរណ៍៖"}),
                e.jsx("div",{className:"w-full aspect-[1.65/1]",dangerouslySetInnerHTML:{__html:K9_SVG(E.exampleDiagramId||(E.diagramId?E.diagramId+"_ex":"prism_ex"))}})
              ]}),
              e.jsx("textarea",{rows:3,value:E.exampleSteps||"",onChange:z=>N(E.id,"exampleSteps",z.target.value),className:"w-[58%] bg-transparent border-none outline-none text-[10px] sm:text-[10.5px] font-extrabold text-slate-900 leading-snug resize-none tabular-nums"})
            ]})
          ]})
        ]},E.id);
      }
      const H=X===0&&E.subtitleMiddle,O=E.themeColor==="blue"?{badge:"bg-gradient-to-r from-blue-500 to-sky-400 text-white",title:"text-sky-600",desc:"text-sky-900",strokeOuter:"#0099ff",strokeInner:"#0077cc",gradStart:"#38bdf8",gradMid:"#0284c7",gradEnd:"#0369a1",borderDeep:"#0c4a6e",innerBg:"#e0f2fe"}:E.themeColor==="pink"?{badge:"bg-rose-500 text-white",title:"text-rose-600",desc:"text-rose-950",strokeOuter:"#f43f5e",strokeInner:"#e11d48",gradStart:"#f472b6",gradMid:"#db2777",gradEnd:"#9d174d",borderDeep:"#881337",innerBg:"#fce7f3"}:E.themeColor==="purple"?{badge:"bg-purple-600 text-white",title:"text-purple-600",desc:"text-purple-950",strokeOuter:"#a855f7",strokeInner:"#7e22ce",gradStart:"#c084fc",gradMid:"#9333ea",gradEnd:"#6b21a8",borderDeep:"#581c87",innerBg:"#f3e8ff"}:E.themeColor==="teal"?{badge:"bg-teal-600 text-white",title:"text-teal-700",desc:"text-teal-950",strokeOuter:"#06b6d4",strokeInner:"#0891b2",gradStart:"#2dd4bf",gradMid:"#0d9488",gradEnd:"#115e59",borderDeep:"#134e4a",innerBg:"#ccfbf1"}:E.themeColor==="orange"?{badge:"bg-orange-600 text-white",title:"text-orange-600",desc:"text-amber-950",strokeOuter:"#f97316",strokeInner:"#c2410c",gradStart:"#fb923c",gradMid:"#ea580c",gradEnd:"#9a3412",borderDeep:"#7c2d12",innerBg:"#ffedd5"}:{badge:"bg-indigo-600 text-white",title:"text-indigo-600",desc:"text-indigo-950",strokeOuter:"#6366f1",strokeInner:"#4338ca",gradStart:"#818cf8",gradMid:"#4f46e5",gradEnd:"#3730a3",borderDeep:"#1e1b4b",innerBg:"#e0e7ff"};
      return e.jsxs("div",{className:\`relative w-full max-w-[340px] bg-white rounded-3xl p-2 shadow-lg border border-slate-100 flex flex-col items-center justify-between aspect-[1/1.28] transition hover:shadow-xl group overflow-hidden \${d?"outline-2 outline-dashed outline-slate-400 outline-offset-4":""}\`,children:[
        e.jsxs("svg",{viewBox:"0 0 400 500",className:"w-full h-full absolute inset-0 pointer-events-none",preserveAspectRatio:"none",children:[
          e.jsxs("defs",{children:[
            e.jsxs("linearGradient",{id:\`bfGrad_\${E.id}\`,x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:O.gradStart}),e.jsx("stop",{offset:"50%",stopColor:O.gradMid}),e.jsx("stop",{offset:"100%",stopColor:O.gradEnd})]}),
            e.jsx("filter",{id:\`shadow_\${E.id}\`,x:"-10%",y:"-10%",width:"120%",height:"120%",children:e.jsx("feDropShadow",{dx:"2",dy:"4",stdDeviation:"3",floodOpacity:"0.25"})})
          ]}),
          e.jsx("path",{d:"M 45,25 Q 80,10 115,25 Q 150,40 185,25 Q 220,10 255,25 Q 290,40 325,25 Q 360,10 375,45 Q 390,80 375,115 Q 360,150 375,185 Q 390,220 375,255 Q 360,290 375,325 Q 390,360 375,395 Q 360,430 375,455 Q 360,490 325,475 Q 290,460 255,475 Q 220,490 185,475 Q 150,460 115,475 Q 80,490 45,475 Q 10,460 25,425 Q 40,390 25,355 Q 10,320 25,285 Q 40,250 25,215 Q 10,180 25,145 Q 40,110 25,75 Q 10,40 45,25 Z",fill:"none",stroke:O.strokeOuter,strokeWidth:"22",strokeLinejoin:"round",strokeLinecap:"round"}),
          e.jsx("path",{d:"M 45,25 Q 80,10 115,25 Q 150,40 185,25 Q 220,10 255,25 Q 290,40 325,25 Q 360,10 375,45 Q 390,80 375,115 Q 360,150 375,185 Q 390,220 375,255 Q 360,290 375,325 Q 390,360 375,395 Q 360,430 375,455 Q 360,490 325,475 Q 290,460 255,475 Q 220,490 185,475 Q 150,460 115,475 Q 80,490 45,475 Q 10,460 25,425 Q 40,390 25,355 Q 10,320 25,285 Q 40,250 25,215 Q 10,180 25,145 Q 40,110 25,75 Q 10,40 45,25 Z",fill:"none",stroke:O.strokeInner,strokeWidth:"3",strokeLinejoin:"round"}),
          e.jsx("path",{d:"M 60,48 Q 90,36 120,48 Q 150,60 180,48 Q 210,36 240,48 Q 270,60 300,48 Q 330,36 350,65 Q 365,95 350,125 Q 335,155 350,185 Q 365,215 350,245 Q 335,275 350,305 Q 365,335 350,365 Q 335,395 350,430 Q 330,458 300,446 Q 270,434 240,446 Q 210,458 180,446 Q 150,434 120,446 Q 90,458 60,446 Q 38,432 50,400 Q 62,370 50,340 Q 38,310 50,280 Q 62,250 50,220 Q 38,190 50,160 Q 62,130 50,100 Q 38,70 60,48 Z",fill:"none",stroke:O.strokeOuter,strokeWidth:"2.8",strokeDasharray:"6,6",strokeLinecap:"round"}),
          e.jsxs("g",{transform:"translate(295, 30) rotate(15) scale(0.72)",filter:\`url(#shadow_\${E.id})\`,children:[
            e.jsx("path",{d:"M50,50 C20,10 -10,-10 10,-35 C35,-50 90,-10 65,35 Z",fill:\`url(#bfGrad_\${E.id})\`,stroke:O.borderDeep,strokeWidth:"3"}),
            e.jsx("path",{d:"M55,50 C85,10 115,-10 95,-35 C70,-50 15,-10 40,35 Z",fill:\`url(#bfGrad_\${E.id})\`,stroke:O.borderDeep,strokeWidth:"3"}),
            e.jsx("path",{d:"M30,-15 Q50,-30 65,-10 Q45,15 30,-15 Z",fill:O.innerBg,opacity:"0.85"}),
            e.jsx("path",{d:"M75,-15 Q55,-30 40,-10 Q60,15 75,-15 Z",fill:O.innerBg,opacity:"0.85"}),
            e.jsx("path",{d:"M48,50 C20,60 0,90 20,110 C45,120 70,85 55,55 Z",fill:\`url(#bfGrad_\${E.id})\`,stroke:O.borderDeep,strokeWidth:"3"}),
            e.jsx("path",{d:"M56,50 C84,60 104,90 84,110 C59,120 34,85 49,55 Z",fill:\`url(#bfGrad_\${E.id})\`,stroke:O.borderDeep,strokeWidth:"3"}),
            e.jsx("circle",{cx:"22",cy:"100",r:"3.5",fill:"#ffffff"}),e.jsx("circle",{cx:"82",cy:"100",r:"3.5",fill:"#ffffff"}),
            e.jsx("circle",{cx:"20",cy:"-25",r:"4.5",fill:"#ffffff"}),e.jsx("circle",{cx:"84",cy:"-25",r:"4.5",fill:"#ffffff"}),
            e.jsx("ellipse",{cx:"52",cy:"50",rx:"6",ry:"32",fill:"#0f172a"}),
            e.jsx("path",{d:"M50,22 Q40,5 30,0",fill:"none",stroke:"#0f172a",strokeWidth:"2.5",strokeLinecap:"round"}),e.jsx("circle",{cx:"30",cy:"0",r:"2",fill:"#0f172a"}),
            e.jsx("path",{d:"M54,22 Q64,5 74,0",fill:"none",stroke:"#0f172a",strokeWidth:"2.5",strokeLinecap:"round"}),e.jsx("circle",{cx:"74",cy:"0",r:"2",fill:"#0f172a"})
          ]})
        ]}),
        e.jsxs("div",{className:"relative z-10 text-center px-6 py-5 w-full flex flex-col justify-between h-full",children:[
          e.jsxs("div",{className:"pt-4 flex justify-between items-center",children:[
            e.jsxs("span",{className:\`card-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide shadow-xs \${O.badge}\`,children:[
              E.badgeEmoji&&e.jsx("span",{children:E.badgeEmoji}),
              e.jsx("input",{type:"text",value:E.badgeText,onChange:z=>N(E.id,"badgeText",z.target.value),className:"bg-transparent border-none text-center outline-none w-24 font-bold text-white placeholder-white/70"})
            ]}),
            e.jsxs("div",{className:"opacity-0 group-hover:opacity-100 transition flex items-center gap-1",children:[
              e.jsxs("select",{value:E.themeColor,onChange:z=>N(E.id,"themeColor",z.target.value),className:"text-[10px] p-1 bg-white/90 border border-slate-300 rounded shadow-xs",children:[
                e.jsx("option",{value:"blue",children:"ខៀវ (Blue)"}),
                e.jsx("option",{value:"pink",children:"ផ្កាឈូក (Pink)"}),
                e.jsx("option",{value:"purple",children:"ស្វាយ (Purple)"}),
                e.jsx("option",{value:"teal",children:"ត្បូងមរកត (Teal)"}),
                e.jsx("option",{value:"orange",children:"ទឹកក្រូច (Orange)"}),
                e.jsx("option",{value:"indigo",children:"ឥណ្ឌីហ្គោ (Indigo)"})
              ]}),
              e.jsx("button",{onClick:()=>A(E.id),className:"p-1 text-red-500 hover:bg-red-50 rounded",title:"លុប",children:e.jsx(ta,{className:"w-3.5 h-3.5"})})
            ]})
          ]}),
          e.jsxs("div",{className:"my-auto space-y-2",children:[
            e.jsx("input",{type:"text",value:E.title,onChange:z=>N(E.id,"title",z.target.value),className:\`w-full font-koulen text-3xl sm:text-4xl text-center bg-transparent border-none outline-none leading-tight \${o==="3d"?\`drop-shadow-[2px_2px_0px_rgba(0,0,0,0.12)] \${O.title}\`:o==="classic"?"text-slate-900":O.title}\`}),
            H&&e.jsxs("div",{className:"flex items-center justify-center gap-2",children:[e.jsx("span",{className:"h-0.5 w-6 bg-sky-300"}),e.jsx("span",{className:"text-sky-600 text-xs font-bold",children:E.subtitleMiddle}),e.jsx("span",{className:"h-0.5 w-6 bg-sky-300"})]}),
            e.jsx("textarea",{rows:2,value:E.description,onChange:z=>N(E.id,"description",z.target.value),className:\`w-full text-center bg-transparent border-none outline-none text-sm font-bold resize-none leading-relaxed \${o==="classic"?"text-slate-800":O.desc}\`})
          ]}),
          e.jsxs("div",{className:"pb-3 flex items-center justify-center gap-2",children:[
            e.jsx("div",{className:"w-8 h-1 bg-current opacity-40 rounded-full"}),
            e.jsx("svg",{className:"w-5 h-5 fill-current opacity-70 drop-shadow-xs",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"})}),
            e.jsx("div",{className:"w-8 h-1 bg-current opacity-40 rounded-full"})
          ]})
        ]})
      ]},E.id)
    })})}),
    e.jsxs("div",{className:"bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 px-6 flex flex-wrap items-center justify-between gap-3 text-xs",children:[
      e.jsxs("div",{className:"text-slate-500 flex items-center gap-2",children:[
        e.jsxs("span",{children:["ចំនួនផ្ទាំងសរុប៖ ",e.jsx("strong",{children:a.length})," ផ្ទាំង"]}),
        e.jsx("span",{children:"•"}),
        e.jsx("span",{children:w==="measurements"?"កាតរង្វង់មានកងសម្រាប់ព្រីនកាត់ ឬចងក្រងជាកម្រងរង្វាស់រង្វាល់ថ្នាក់រៀន":"អាចព្រីនជា A4 Poster ឬកាត់ជាបណ្ណតូចៗបាន"})
      ]}),
      e.jsxs("div",{className:"flex items-center gap-2",children:[
        e.jsx("button",{onClick:t,className:"px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold transition",children:"បិទ"}),
        e.jsxs("button",{onClick:T,className:"px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 active:scale-95",children:[e.jsx(ts,{className:"w-4 h-4"}),e.jsx("span",{children:"បោះពុម្ពឥឡូវនេះ (A4 Print / PDF)"})]})
      ]})
    ]})
  ]})})
}`;

src = src.slice(0, mStart) + newM + src.slice(mEnd);

// Also add a prominent Measurements card inside the Classroom Admin "materials" tab (around Hp(!0))
const adminBannerOld = `e.jsx("button",{type:"button",onClick:()=>Hp(!0),className:"px-4 py-2 rounded-xl bg-white text-blue-700 font-extrabold shadow-sm border border-blue-200 hover:bg-blue-50 transition shrink-0",children:"ចូលកែសម្រួល & ព្រីន A4 ➜"})`;
const adminBannerNew = `e.jsxs("div",{className:"flex items-center gap-2 flex-wrap shrink-0",children:[e.jsx("button",{type:"button",onClick:()=>{window.__decorPendingPreset="measurements";Hp(!0);window.dispatchEvent(new CustomEvent("open_decor_preset",{detail:"measurements"}))},className:"px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold shadow-sm hover:bg-emerald-700 transition",children:"📐 កាតរង្វាស់រង្វាល់ & ប្តូរខ្នាត ➜"}),e.jsx("button",{type:"button",onClick:()=>Hp(!0),className:"px-4 py-2 rounded-xl bg-white text-blue-700 font-extrabold shadow-sm border border-blue-200 hover:bg-blue-50 transition",children:"ចូលកែសម្រួល & ព្រីន A4 ➜"})]})`;
if (!src.includes(adminBannerOld)) throw new Error("Missing adminBannerOld");
src = src.replace(adminBannerOld, adminBannerNew);

// Also update the card description on homepage / dashboard quick shortcut if present
const homeDescOld = `"សន្លឹកតុបតែងថ្នាក់ & សុវត្ថិភាពចំណីអាហារ"`;
if (src.includes(homeDescOld)) {
  src = src.replace(homeDescOld, `"សន្លឹកតុបតែងថ្នាក់ & កាតរង្វាស់រង្វាល់"`);
}

fs.writeFileSync(FILE, src, "utf8");

// Validate TypeScript / JS parse cleanly
const sf = ts.createSourceFile(FILE, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("Parse diagnostics found:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("SUCCESS: patched v114, 0 parse diagnostics, length:", src.length);
