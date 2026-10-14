const fs = require('fs');
let content = fs.readFileSync('src/components/StudentAcademicResultsView.tsx', 'utf8');

content = content.replace(
  'className="flex items-center justify-center gap-2 text-indigo-200/90 text-xs font-bold uppercase tracking-normal"',
  'className="flex items-center justify-center gap-2 text-cyan-300/90 text-xs font-bold uppercase tracking-normal font-mono"'
);

content = content.replace(
  'className="w-8 h-px bg-gradient-to-r from-transparent to-indigo-400/60"',
  'className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400/60"'
);

content = content.replace(
  'className="w-8 h-px bg-gradient-to-l from-transparent to-indigo-400/60"',
  'className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400/60"'
);

content = content.replace(
  'className="font-moul flex items-center gap-1.5 text-indigo-200"',
  'className="font-moul flex items-center gap-1.5 text-cyan-200 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]"'
);

content = content.replace(
  'className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-indigo-200 border border-white/15 shadow-inner"',
  'className="px-3 py-1 bg-cyan-950/40 backdrop-blur-md rounded-lg text-xs font-bold text-cyan-200 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)_inset] font-mono"'
);

fs.writeFileSync('src/components/StudentAcademicResultsView.tsx', content);
console.log("Updated rank section.");
