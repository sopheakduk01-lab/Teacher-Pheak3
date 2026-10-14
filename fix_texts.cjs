const fs = require('fs');
let content = fs.readFileSync('src/components/StudentAcademicResultsView.tsx', 'utf8');

content = content.replace(
  'className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight drop-shadow-sm"',
  'className="text-3xl sm:text-4xl font-black text-cyan-50 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"'
);

// Honorary Congratulatory Pill Badge
content = content.replace(
  'className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${medalInfo.bannerBg}`}',
  'className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold border backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono uppercase tracking-wide ${medalInfo.bannerBg.replace("rounded-full", "").replace("bg-white/10", "bg-cyan-900/40 border-cyan-500/30 text-cyan-200")}`}'
);

fs.writeFileSync('src/components/StudentAcademicResultsView.tsx', content);
