const fs = require('fs');
let content = fs.readFileSync('src/components/StudentAcademicResultsView.tsx', 'utf8');

content = content.replace(
  '<div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mt-2 p-0.5 border border-white/10">',
  '<div className="w-full bg-cyan-950/40 rounded h-1.5 mt-2 border border-cyan-500/20 overflow-hidden relative">'
);

content = content.replace(
  'className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400"',
  'className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] relative"\n                              style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)" }}'
);

content = content.replace(
  '<span className="text-[11px] font-bold text-indigo-100 uppercase tracking-normal font-moul">',
  '<span className="text-[11px] font-bold text-sky-100 uppercase tracking-normal font-moul">'
);

content = content.replace(
  '<span className="text-[11px] font-bold text-indigo-100 uppercase tracking-normal font-moul">',
  '<span className="text-[11px] font-bold text-sky-100 uppercase tracking-normal font-moul">'
);

fs.writeFileSync('src/components/StudentAcademicResultsView.tsx', content);
