const fs = require('fs');

let content = fs.readFileSync('src/components/DigitalStudentIdCard.tsx', 'utf8');

// The class patterns we want to update for each style.
// Style 0 (Cyber)
content = content.replace(
  'className="relative w-full max-w-[420px] p-[2px] bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 rounded-[32px] shadow-[0_0_40px_rgba(59,130,246,0.25)] overflow-hidden font-moul group"',
  'className="relative w-full max-w-[420px] aspect-[3/4.2] flex flex-col p-[2px] bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 rounded-[32px] shadow-[0_0_40px_rgba(59,130,246,0.25)] overflow-hidden font-moul group"'
);
content = content.replace(
  '<div className="relative pt-8 px-6 pb-6 z-10 space-y-5">',
  '<div className="relative pt-8 px-6 pb-6 z-10 flex flex-col flex-1 justify-between h-full">'
);

// Style 1 (Classic)
content = content.replace(
  'className="relative w-full max-w-[420px] p-[10px] bg-[#006050] rounded-[32px] shadow-2xl font-moul"',
  'className="relative w-full max-w-[420px] aspect-[3/4.2] flex flex-col p-[10px] bg-[#006050] rounded-[32px] shadow-2xl font-moul"'
);
content = content.replace(
  '<div className="relative pt-6 px-5 pb-5 z-10 space-y-4">',
  '<div className="relative pt-6 px-5 pb-5 z-10 flex flex-col flex-1 justify-between h-full">'
);

// Style 2 (Matrix)
content = content.replace(
  'className="relative w-full max-w-[420px] bg-[#0d1117] rounded-[32px] border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)] font-mono overflow-hidden"',
  'className="relative w-full max-w-[420px] aspect-[3/4.2] flex flex-col bg-[#0d1117] rounded-[32px] border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)] font-mono overflow-hidden"'
);
content = content.replace(
  '<div className="p-7 space-y-6 relative z-10">',
  '<div className="p-7 relative z-10 flex flex-col flex-1 justify-between h-full">'
);

// Style 3 (Synthwave)
content = content.replace(
  'className="relative w-full max-w-[420px] bg-[#1a0b2e] rounded-[32px] border border-fuchsia-500/50 shadow-[0_0_40px_rgba(217,70,239,0.2)] font-battambang overflow-hidden"',
  'className="relative w-full max-w-[420px] aspect-[3/4.2] flex flex-col bg-[#1a0b2e] rounded-[32px] border border-fuchsia-500/50 shadow-[0_0_40px_rgba(217,70,239,0.2)] font-battambang overflow-hidden"'
);
content = content.replace(
  '<div className="p-8 space-y-6 relative z-10">',
  '<div className="p-8 relative z-10 flex flex-col flex-1 justify-between h-full">'
);

// Style 4 (Holographic)
content = content.replace(
  'className="relative w-full max-w-[420px] bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(56,189,248,0.3)] font-sans overflow-hidden border border-sky-400/30"',
  'className="relative w-full max-w-[420px] aspect-[3/4.2] flex flex-col bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(56,189,248,0.3)] font-sans overflow-hidden border border-sky-400/30"'
);
content = content.replace(
  '<div className="relative p-7 space-y-6 z-20">',
  '<div className="relative p-7 z-20 flex flex-col flex-1 justify-between h-full">'
);

// Back of card (QR Code sheet) - make sure it matches aspect-[3/4.2] instead of aspect-[3/4]
content = content.replace(
  'className="relative w-full max-w-[420px] aspect-[3/4] bg-white rounded-[32px] border-2 border-slate-200 shadow-xl overflow-hidden flex flex-col items-center justify-center p-8 space-y-6"',
  'className="relative w-full max-w-[420px] aspect-[3/4.2] bg-white rounded-[32px] border-2 border-slate-200 shadow-xl overflow-hidden flex flex-col items-center justify-center p-8 space-y-6"'
);

fs.writeFileSync('src/components/DigitalStudentIdCard.tsx', content);
console.log('Fixed card sizes to aspect-[3/4.2].');
