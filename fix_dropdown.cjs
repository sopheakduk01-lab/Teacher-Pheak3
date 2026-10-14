const fs = require('fs');
let content = fs.readFileSync('src/components/StudentAcademicResultsView.tsx', 'utf8');

content = content.replace(
  /className="absolute left-0 top-full mt-2 w-72 max-h-80 overflow-y-auto z-50 rounded-2xl bg-slate-950\/95 backdrop-blur-2xl border border-indigo-500\/40 shadow-2xl p-2 space-y-1 scrollbar-thin scrollbar-thumb-white\/20"/g,
  'className="absolute left-0 top-full mt-2 w-72 max-h-80 overflow-y-auto z-50 rounded-xl bg-[#0b121e]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_10px_30px_rgba(6,182,212,0.2)] p-2 space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/20"'
);

content = content.replace(
  /className="px-3 py-1\.5 text-\[10px\] font-bold text-indigo-300 uppercase tracking-wide border-b border-white\/10 flex items-center justify-between"/g,
  'className="px-3 py-1.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wide border-b border-cyan-500/20 flex items-center justify-between font-mono"'
);

fs.writeFileSync('src/components/StudentAcademicResultsView.tsx', content);
