const fs = require('fs');

let content = fs.readFileSync('src/components/DigitalStudentIdCard.tsx', 'utf8');

// Update themes
content = content.replace(
  /const styleThemes = \[[\s\S]*?\];/,
  `const styleThemes = [
    { id: 'cyber', name: 'ឌីជីថលបែបបច្ចេកវិទ្យា (Cyber)', color: 'bg-cyan-500' },
    { id: 'classic', name: 'ផ្លូវការ (Classic)', color: 'bg-[#006050]' },
    { id: 'matrix', name: 'ឌីជីថលបែបម៉ាទ្រីស (Matrix)', color: 'bg-green-500' },
    { id: 'synthwave', name: 'ឌីជីថលយុគសម័យអវកាស (Synthwave)', color: 'bg-fuchsia-500' },
    { id: 'holo', name: 'ឌីជីថលបែបហូឡូក្រាម (Hologram)', color: 'bg-indigo-300' },
  ];`
);

// Replace styles 2, 3, 4
const style2Start = content.indexOf(') : styleIndex === 2 ? (');
const endOfComponent = content.lastIndexOf(')}');

const newStyles = `) : styleIndex === 2 ? (
          // Style 2: Matrix Digital
          <div className="relative w-full max-w-[420px] bg-[#0d1117] rounded-[32px] border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)] font-mono overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            <div className="absolute -right-20 -top-20 opacity-5 text-green-500 text-[10px] leading-none break-all select-none w-[400px]">
              01001011 01001000 01001101 01000101 01010010 01010011 01000011 01001000 01001111 01001111 01001100 01000100 01001001 01000111 01001001 01010100 01000001 01001100 01001001 01000100 00110010 00110000 00110010 00110110 01001011 01001000 01001101 01000101 01010010
            </div>
            
            <div className="p-7 space-y-6 relative z-10">
              <div className="flex justify-between items-start border-b border-green-500/20 pb-4">
                <div>
                  <h3 className="font-moul text-sm text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">ព្រះរាជាណាចក្រកម្ពុជា</h3>
                  <div className="text-green-500/70 text-[10px] uppercase tracking-widest mt-1">SYS.ID: {rollNoPad} // STATUS: ACTIVE</div>
                </div>
                <QrCode className="w-6 h-6 text-green-400" />
              </div>

              <div className="flex gap-5 items-center">
                {renderPhoto(
                  "w-[90px] h-[110px] rounded-md border border-green-500/50 p-1 bg-black shadow-[0_0_15px_rgba(34,197,94,0.2)]",
                  "w-full h-full bg-[#0d1117] rounded-sm filter contrast-125 sepia-[0.3] hue-rotate-50",
                  "bg-green-900/40 rounded-sm"
                )}
                <div className="space-y-2 flex-1">
                  <div>
                    <h2 className="font-moul text-lg text-green-300 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">{student.name}</h2>
                    <p className="text-green-500/80 text-xs">USER_ID: STD-{rollNoPad}</p>
                  </div>
                  <div className="h-[1px] w-full bg-gradient-to-r from-green-500/50 to-transparent"></div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-green-400">
                    <div>
                      <span className="opacity-50 block text-[9px]">GENDER</span>
                      {student.gender === 'F' ? 'F' : 'M'}
                    </div>
                    <div>
                      <span className="opacity-50 block text-[9px]">GRADE</span>
                      {teacher?.grade || '—'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-950/30 border border-green-500/20 p-3 rounded-lg text-xs space-y-2 font-battambang text-green-300">
                <div className="flex justify-between">
                  <span className="opacity-70">ថ្ងៃខែឆ្នាំកំណើត:</span> <span>{student.dob || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">ឆ្នាំសិក្សា:</span> <span>{teacher?.academicYear || '២០២៥-២០២៦'}</span>
                </div>
                <div className="flex justify-between border-t border-green-500/20 pt-2 mt-2">
                  <span className="opacity-70">នាយកសាលា:</span> <span className="font-moul">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        ) : styleIndex === 3 ? (
          // Style 3: Synthwave Digital
          <div className="relative w-full max-w-[420px] bg-[#1a0b2e] rounded-[32px] border border-fuchsia-500/50 shadow-[0_0_40px_rgba(217,70,239,0.2)] font-battambang overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-fuchsia-900/20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-[linear-gradient(transparent_0%,rgba(217,70,239,0.2)_100%)] opacity-50" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(217,70,239,0.3) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(217,70,239,0.3) 20px)' }}></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/30 rounded-full blur-[60px]"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-600/30 rounded-full blur-[60px]"></div>
            
            <div className="p-8 space-y-6 relative z-10">
              <div className="text-center border-b border-fuchsia-500/30 pb-4">
                <h3 className="font-moul text-sm text-pink-400 tracking-widest drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]">ប័ណ្ណសម្គាល់ខ្លួនសិស្ស</h3>
                <div className="inline-block mt-2 px-4 py-1 bg-fuchsia-950/50 border border-fuchsia-500/50 rounded-full text-fuchsia-300 font-mono text-[10px] tracking-widest shadow-[0_0_10px_rgba(217,70,239,0.3)_inset]">
                  ID: STD-{rollNoPad}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                {renderPhoto(
                  "w-[100px] h-[100px] rounded-full p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_20px_rgba(217,70,239,0.5)]",
                  "w-full h-full bg-[#1a0b2e] rounded-full",
                  "bg-pink-900/40 rounded-full"
                )}
                <div className="text-center">
                  <h2 className="font-moul text-xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{student.name}</h2>
                  <p className="text-pink-300 text-xs font-bold mt-1 tracking-wider">{teacher?.school || 'School Name'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-fuchsia-950/40 backdrop-blur-sm border border-fuchsia-500/30 p-3 rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.1)]">
                  <span className="text-fuchsia-400 text-[10px] block mb-1 uppercase tracking-widest">DOB</span>
                  <span className="text-white font-bold">{student.dob || '—'}</span>
                </div>
                <div className="bg-violet-950/40 backdrop-blur-sm border border-violet-500/30 p-3 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                  <span className="text-violet-400 text-[10px] block mb-1 uppercase tracking-widest">GRADE</span>
                  <span className="text-white font-bold">{teacher?.grade || '—'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-bold pt-2">
                <div className="text-fuchsia-400 uppercase tracking-widest text-[10px]">
                  AY {teacher?.academicYear || '2025-2026'}
                </div>
                <div className="font-moul text-pink-200 drop-shadow-[0_0_5px_rgba(244,114,182,0.5)]">
                  នាយកសាលា
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Style 4: Holographic Digital
          <div className="relative w-full max-w-[420px] bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(56,189,248,0.3)] font-sans overflow-hidden border border-sky-400/30">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10 mix-blend-overlay"></div>
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky-400/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px]"></div>
            
            <div className="relative p-7 space-y-6 z-20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-sky-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white tracking-wider">HOLO-IDENTITY</h3>
                    <p className="text-sky-300/80 font-mono text-[9px] uppercase tracking-widest">{teacher?.school || 'Education Network'}</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded text-sky-200 font-mono text-xs shadow-sm">
                  {rollNoPad}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.3)] flex gap-5 items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/5 to-indigo-400/5"></div>
                {renderPhoto(
                  "w-[85px] h-[85px] rounded-2xl p-[1px] bg-gradient-to-br from-sky-300 to-indigo-500 shadow-lg",
                  "w-full h-full bg-slate-900 rounded-[15px]",
                  "bg-sky-900/40 rounded-[15px]"
                )}
                <div className="relative z-10">
                  <h2 className="font-moul text-xl text-white mb-1 drop-shadow-sm">{student.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded text-[10px] font-bold uppercase tracking-wider border border-sky-400/20">
                      Grade {teacher?.grade?.replace(/[^0-9]/g, '') || '6'}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-400/20">
                      {student.gender === 'F' ? 'Female' : 'Male'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-white/10 pt-4 px-2">
                <div>
                  <span className="text-sky-200/50 text-[9px] block uppercase tracking-widest mb-0.5">Date of Birth</span>
                  <span className="text-white text-xs font-mono">{student.dob || '—'}</span>
                </div>
                <div className="text-right">
                  <span className="text-sky-200/50 text-[9px] block uppercase tracking-widest mb-0.5">Valid Thru</span>
                  <span className="text-white text-xs font-mono">{teacher?.academicYear || '2025'}</span>
                </div>
                <div className="text-center w-20">
                  <div className="border-b border-white/20 pb-1 mb-1 font-moul text-[11px] text-sky-200">នាយកសាលា</div>
                  <div className="text-[8px] text-sky-300/50 uppercase tracking-widest">Authorized</div>
                </div>
              </div>
            </div>
          </div>
        )}
`;

const updatedContent = content.substring(0, style2Start) + newStyles + content.substring(endOfComponent + 2);
fs.writeFileSync('src/components/DigitalStudentIdCard.tsx', updatedContent);
console.log('Styles updated.');
