const fs = require('fs');
let content = fs.readFileSync('src/components/StudentAcademicResultsView.tsx', 'utf8');

content = content.replace(
  'className="text-sm sm:text-base font-bold font-moul text-white truncate drop-shadow-xs"',
  'className="text-sm sm:text-base font-bold font-moul text-sky-100 truncate drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]"'
);

content = content.replace(
  'className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-indigo-200 border border-white/20 shrink-0 font-mono"',
  'className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-900/40 text-sky-300 border border-sky-500/30 shrink-0 font-mono"'
);

content = content.replace(
  'className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-indigo-200/90 mt-1"',
  'className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-sky-200/70 mt-1 font-mono"'
);

content = content.replace(
  'className="font-mono uppercase text-[11px] tracking-wide text-slate-300 font-semibold truncate"',
  'className="uppercase text-[10px] tracking-widest text-sky-300 font-semibold truncate"'
);

content = content.replace(
  'className="text-[11px] text-slate-300"',
  'className="text-[10px] text-sky-200/80 uppercase tracking-wide"'
);
content = content.replace(
  'className="text-[11px] text-slate-300"',
  'className="text-[10px] text-sky-200/80 uppercase tracking-wide"'
);

content = content.replace(
  'className="text-white"',
  'className="text-sky-100"'
);

content = content.replace(
  'className="font-mono text-slate-200"',
  'className="font-mono text-sky-100"'
);

fs.writeFileSync('src/components/StudentAcademicResultsView.tsx', content);
