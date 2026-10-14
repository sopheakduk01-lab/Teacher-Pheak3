const fs = require('fs');

let content = fs.readFileSync('src/components/StudentAcademicResultsView.tsx', 'utf8');

// Replace the container wrapper and atmospheric glows
content = content.replace(
  '<div className="group/hero bg-gradient-to-br from-slate-950 via-indigo-950/95 to-purple-950 rounded-[32px] p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden space-y-6 border border-indigo-500/30 ring-1 ring-white/10 transition-all duration-300">',
  '<div className="group/hero bg-[#0a0f18] rounded-[32px] p-6 sm:p-7 text-sky-100 shadow-[0_0_50px_rgba(14,165,233,0.15)] relative overflow-hidden space-y-6 border border-sky-500/30 ring-1 ring-cyan-400/20 transition-all duration-300 font-sans">'
);

content = content.replace(
  '{/* Top Ambient Sheen & Atmospheric Glows */}\n                      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent pointer-events-none" />\n                      <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />\n                      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-tr from-blue-600/20 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />',
  `{/* Cyber / Hologram Ambient Background */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none mix-blend-screen" />
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                      <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
                      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
                      <div className="absolute top-4 left-4 text-[9px] font-mono text-cyan-500/30 uppercase tracking-widest pointer-events-none">SYS.VER_2.4 // DIGITAL_HUD_ACTIVE</div>`
);

// Update dropdown button
content = content.replace(
  'className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-xl text-white text-xs sm:text-sm font-bold border border-white/25 shadow-lg shadow-black/25 transition-all cursor-pointer select-none"',
  'className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 active:bg-cyan-900/60 backdrop-blur-md text-cyan-50 text-xs sm:text-sm font-bold border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer select-none relative group"'
);

// Update profile card background
content = content.replace(
  'className="relative flex items-center gap-4 p-4 rounded-[24px] bg-white/5 border border-white/10 shadow-inner backdrop-blur-md overflow-hidden relative z-10"',
  'className="relative flex items-center gap-4 p-4 rounded-2xl bg-[#0d1624] border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)_inset] backdrop-blur-md overflow-hidden relative z-10"'
);

content = content.replace(
  '<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 pointer-events-none" />',
  '<div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 pointer-events-none" />'
);

// Update GPA Pod
content = content.replace(
  'className="group/card relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-xl border border-white/20 hover:border-white/35 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/25"',
  'className="group/card relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-[#0b121e]/80 hover:bg-[#101b2d] backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 hover:-translate-y-0.5"'
);

// Update Grade Classification Pod base style
content = content.replace(
  'bg-gradient-to-b from-white/15 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-xl border border-white/20 hover:border-white/35 shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${gradeStyle.shadowHover}',
  'bg-[#0b121e]/80 hover:bg-[#101b2d] backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 hover:-translate-y-0.5 ${gradeStyle.shadowHover}'
);


fs.writeFileSync('src/components/StudentAcademicResultsView.tsx', content);
console.log('Updated to digital style.');
