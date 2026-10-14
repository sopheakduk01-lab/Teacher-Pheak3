const fs = require('fs');
let content = fs.readFileSync('src/components/StudentAcademicResultsView.tsx', 'utf8');

// Container
content = content.replace(
  /className="group\/hero bg-gradient-to-br from-slate-950 via-indigo-950\/95 to-purple-950 rounded-\[32px\] p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden space-y-6 border border-indigo-500\/30 ring-1 ring-white\/10 transition-all duration-300"/g,
  'className="group/hero bg-[#0a0f18] rounded-[32px] p-6 sm:p-7 text-sky-100 shadow-[0_0_50px_rgba(14,165,233,0.15)] relative overflow-hidden space-y-6 border border-sky-500/30 ring-1 ring-cyan-400/20 transition-all duration-300 font-sans"'
);

// Ambient Glows
content = content.replace(
  /\{\/\* Top Ambient Sheen & Atmospheric Glows \*\/\}\s*<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-300\/40 to-transparent pointer-events-none" \/>\s*<div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-indigo-500\/20 via-purple-500\/20 to-pink-500\/10 rounded-full blur-3xl pointer-events-none" \/>\s*<div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-tr from-blue-600\/20 to-indigo-600\/10 rounded-full blur-3xl pointer-events-none" \/>/g,
  `{/* Cyber / Hologram Ambient Background */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none mix-blend-screen" />
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                      <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
                      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
                      <div className="absolute top-4 left-4 text-[9px] font-mono text-cyan-500/30 uppercase tracking-widest pointer-events-none">SYS.VER_2.4 // DIGITAL_HUD_ACTIVE</div>`
);

// Dropdown button
content = content.replace(
  /className="inline-flex items-center gap-2 px-3\.5 sm:px-4 py-2 rounded-2xl bg-white\/15 hover:bg-white\/25 active:bg-white\/30 backdrop-blur-xl text-white text-xs sm:text-sm font-bold border border-white\/25 shadow-lg shadow-black\/25 transition-all cursor-pointer select-none"/g,
  'className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 active:bg-cyan-900/60 backdrop-blur-md text-cyan-50 text-xs sm:text-sm font-bold border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer select-none relative group"'
);

// Profile card
content = content.replace(
  /className="relative flex items-center gap-4 p-4 rounded-\[24px\] bg-white\/5 border border-white\/10 shadow-inner backdrop-blur-md overflow-hidden relative z-10"/g,
  'className="relative flex items-center gap-4 p-4 rounded-2xl bg-[#0d1624] border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)_inset] backdrop-blur-md overflow-hidden relative z-10"'
);

// Profile hover sweep
content = content.replace(
  /<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white\/5 to-transparent -translate-x-full group-hover\/card:translate-x-full transition-transform duration-1000 pointer-events-none" \/>/g,
  '<div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 pointer-events-none" />'
);

// Profile Name
content = content.replace(
  /className="text-sm sm:text-base font-bold font-moul text-white truncate drop-shadow-xs"/g,
  'className="text-sm sm:text-base font-bold font-moul text-sky-100 truncate drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]"'
);
content = content.replace(
  /className="px-2 py-0\.5 rounded-full text-\[10px\] font-bold bg-white\/15 text-indigo-200 border border-white\/20 shrink-0 font-mono"/g,
  'className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-900/40 text-sky-300 border border-sky-500/30 shrink-0 font-mono"'
);
content = content.replace(
  /className="flex flex-wrap items-center gap-x-2 gap-y-0\.5 text-xs text-indigo-200\/90 mt-1"/g,
  'className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-sky-200/70 mt-1 font-mono"'
);
content = content.replace(
  /className="font-mono uppercase text-\[11px\] tracking-wide text-slate-300 font-semibold truncate"/g,
  'className="uppercase text-[10px] tracking-widest text-sky-300 font-semibold truncate"'
);
content = content.replace(
  /className="text-\[11px\] text-slate-300"/g,
  'className="text-[10px] text-sky-200/80 uppercase tracking-wide"'
);
content = content.replace(
  /<strong className="text-white">/g,
  '<strong className="text-sky-100">'
);
content = content.replace(
  /<span className="font-mono text-slate-200">/g,
  '<span className="font-mono text-sky-100">'
);

// Rank block
content = content.replace(
  /className="flex items-center justify-center gap-2 text-indigo-200\/90 text-xs font-bold uppercase tracking-normal"/g,
  'className="flex items-center justify-center gap-2 text-cyan-300/90 text-xs font-bold uppercase tracking-normal font-mono"'
);
content = content.replace(
  /className="w-8 h-px bg-gradient-to-r from-transparent to-indigo-400\/60"/g,
  'className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400/60"'
);
content = content.replace(
  /className="w-8 h-px bg-gradient-to-l from-transparent to-indigo-400\/60"/g,
  'className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400/60"'
);
content = content.replace(
  /className="font-moul flex items-center gap-1\.5 text-indigo-200"/g,
  'className="font-moul flex items-center gap-1.5 text-cyan-200 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]"'
);
content = content.replace(
  /className="px-3 py-1 bg-white\/10 backdrop-blur-md rounded-full text-xs font-bold text-indigo-200 border border-white\/15 shadow-inner"/g,
  'className="px-3 py-1 bg-cyan-950/40 backdrop-blur-md rounded-lg text-xs font-bold text-cyan-200 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)_inset] font-mono"'
);

// Honorary Congratulatory Pill Badge
content = content.replace(
  /className=\{`inline-flex items-center gap-1\.5 px-4 py-1\.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm \$\{medalInfo\.bannerBg\}`\}/g,
  'className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-[10px] font-bold border backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono uppercase tracking-wide ${medalInfo.bannerBg.replace("rounded-full", "").replace("bg-white/10", "bg-cyan-900/40 border-cyan-500/30 text-cyan-200")}`}'
);

// Pods wrapper
content = content.replace(
  /className="grid grid-cols-2 gap-3\.5 pt-1 relative z-10"/g,
  'className="grid grid-cols-2 gap-3.5 pt-1 relative z-10"'
);

// Left Metric Card (GPA Pod)
content = content.replace(
  /className="group\/card relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white\/15 to-white\/5 hover:from-white\/20 hover:to-white\/10 backdrop-blur-xl border border-white\/20 hover:border-white\/35 shadow-xl transition-all duration-300 hover:-translate-y-0\.5 hover:shadow-indigo-500\/25"/g,
  'className="group/card relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-[#0b121e]/80 hover:bg-[#101b2d] backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 hover:-translate-y-0.5"'
);

// Right Metric Card (Grade Pod base style)
content = content.replace(
  /bg-gradient-to-b from-white\/15 to-white\/5 hover:from-white\/20 hover:to-white\/10 backdrop-blur-xl border border-white\/20 hover:border-white\/35 shadow-xl transition-all duration-300 hover:-translate-y-0\.5 \$\{gradeStyle\.shadowHover\}/g,
  'bg-[#0b121e]/80 hover:bg-[#101b2d] backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 hover:-translate-y-0.5 ${gradeStyle.shadowHover}'
);

// Shimmer lines
content = content.replace(
  /<div className="absolute top-0 inset-x-0 h-\[2px\] bg-gradient-to-r from-transparent via-sky-300\/70 to-transparent pointer-events-none" \/>/g,
  '<div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none" />'
);
content = content.replace(
  /<div className="absolute top-0 inset-x-0 h-\[2px\] bg-gradient-to-r from-transparent via-amber-300\/70 to-transparent pointer-events-none" \/>/g,
  '<div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none" />'
);

// GPA visual progress bar
content = content.replace(
  /<div className="w-full bg-white\/10 rounded-full h-1\.5 overflow-hidden mt-2 p-0\.5 border border-white\/10">/g,
  '<div className="w-full bg-cyan-950/40 rounded h-1.5 mt-2 border border-cyan-500/20 overflow-hidden relative">'
);
content = content.replace(
  /className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400"/g,
  'className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] relative"\n                              style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)" }}'
);

// Pod Headers text colors
content = content.replace(
  /<span className="text-\[11px\] font-bold text-indigo-100 uppercase tracking-normal font-moul">/g,
  '<span className="text-[11px] font-bold text-sky-100 uppercase tracking-normal font-moul">'
);

// The big score value
content = content.replace(
  /className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight drop-shadow-sm"/g,
  'className="text-3xl sm:text-4xl font-black text-cyan-50 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"'
);

fs.writeFileSync('src/components/StudentAcademicResultsView.tsx', content);
console.log('Replaced in all heroes.');
