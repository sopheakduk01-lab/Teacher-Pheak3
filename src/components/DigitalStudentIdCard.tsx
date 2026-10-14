import React, { useState, useRef } from 'react';
import { Camera, Award, QrCode, Download, Copy, Check, ExternalLink, KeyRound } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Student, TeacherProfile } from '../types';
import { isImageAvatar } from '../utils/imageCompressor';

interface Props {
  student: Student;
  teacher?: TeacherProfile;
  selectedAvatar?: string;
  onAvatarClick?: () => void;
  hideControls?: boolean;
}

export const DigitalStudentIdCard: React.FC<Props> = ({ 
  student, 
  teacher, 
  selectedAvatar, 
  onAvatarClick,
  hideControls = false
}) => {
  const [styleIndex, setStyleIndex] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const styleThemes = [
    { id: 'cyber', name: 'ឌីជីថលបែបបច្ចេកវិទ្យា (Cyber)', color: 'bg-cyan-500' },
    { id: 'classic', name: 'ផ្លូវការ (Classic)', color: 'bg-[#006050]' },
    { id: 'matrix', name: 'ឌីជីថលបែបម៉ាទ្រីស (Matrix)', color: 'bg-green-500' },
    { id: 'synthwave', name: 'ឌីជីថលយុគសម័យអវកាស (Synthwave)', color: 'bg-fuchsia-500' },
    { id: 'holo', name: 'ឌីជីថលបែបហូឡូក្រាម (Hologram)', color: 'bg-indigo-300' },
  ];

  const rollNoPad = student.rollNo.toString().padStart(4, '0');
  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const studentPin = student.pin || '1234';
  const qrValue = `${baseUrl}?tab=student_portal&studentId=${student.id}&pin=${encodeURIComponent(studentPin)}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(qrValue);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const renderPhoto = (wrapperClass: string, innerClass: string, overlayClass: string) => (
    <div 
      onClick={onAvatarClick}
      className={`${wrapperClass} relative cursor-pointer hover:scale-105 transition-transform shrink-0 overflow-hidden group z-20`}
      title={onAvatarClick ? "ចុចដើម្បីប្តូររូបថត" : undefined}
    >
      <div className={`${innerClass} flex items-center justify-center overflow-hidden`}>
        {selectedAvatar && isImageAvatar(selectedAvatar) ? (
          <img src={selectedAvatar} alt={student.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            {selectedAvatar || (student.gender === 'ស្រី' || (student.gender as string) === 'F' ? '👧' : '👦')}
          </span>
        )}
      </div>
      {onAvatarClick && (
        <div className={`${overlayClass} absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
          <Camera className="text-white w-6 h-6" />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      {!hideControls && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-bold text-slate-600">រចនាបទកាត ៖</span>
            <div className="flex gap-2">
              {styleThemes.map((theme, idx) => (
                <button
                  key={theme.id}
                  onClick={() => { setStyleIndex(idx); setShowQR(false); }}
                  className={`w-7 h-7 rounded-full shadow-sm flex items-center justify-center transition-transform hover:scale-110 ${theme.color} ${styleIndex === idx && !showQR ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-60 hover:opacity-100'}`}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowQR(!showQR)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${showQR ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'}`}
          >
            <QrCode className="w-4 h-4" />
            {showQR ? 'ត្រឡប់ទៅកាតខាងមុខ' : 'បង្ហាញសន្លឹក QR Code'}
          </button>
        </div>
      )}

      <div className="flex justify-center py-2" id="student-id-card-render">
        {showQR ? (
          // QR Code Separate Sheet Back
          <div className="relative w-full max-w-[420px] aspect-[3/4.2] bg-white rounded-[32px] border-2 border-slate-200 shadow-xl overflow-hidden flex flex-col items-center justify-between p-7 text-center">
            <div className="absolute inset-0 bg-slate-50/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-30 -z-10"></div>
            
            <div className="space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-xs">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-moul text-base text-slate-800 pt-1">ស្កេនចូលគណនីសិស្ស</h3>
              <p className="font-battambang text-[11px] text-slate-500 max-w-[260px] mx-auto">
                ប្រើកាមេរ៉ាទូរសព្ទដើម្បីស្កេនចូលរៀន ឬមើលពិន្ទុ និងលទ្ធផលសិក្សាផ្ទាល់ខ្លួន
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center">
              <QRCodeSVG value={qrValue} size={160} level="H" includeMargin />
              <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-bold">លេខកូដ PIN ៖</span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {studentPin}
                </span>
              </div>
            </div>

            <div className="w-full space-y-2.5">
              <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="font-moul text-[11px] text-indigo-950">{student.name}</span>
                <span>&bull;</span>
                <span>ID: STD-{rollNoPad}</span>
                <span>&bull;</span>
                <span>តុ #{student.rollNo}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition active:scale-95"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">បានចម្លង!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>ចម្លង Link</span>
                    </>
                  )}
                </button>
                <a
                  href={qrValue}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>បើកតេស្តមើល</span>
                </a>
              </div>
            </div>
          </div>
        ) : styleIndex === 0 ? (
          // Style 0: Cyber Digital (from earlier)
          <div className="relative w-full max-w-[420px] aspect-[3/4.2] flex flex-col p-[2px] bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 rounded-[32px] shadow-[0_0_40px_rgba(59,130,246,0.25)] overflow-hidden font-moul group">
            <div className="relative w-full h-full bg-[#0a0f1c] rounded-[30px] overflow-hidden">
              {/* Glowing Orbs */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-600/30 rounded-full blur-[70px] pointer-events-none"></div>
              <div className="absolute top-1/2 -right-32 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-12 w-80 h-80 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none"></div>
              {/* Tech Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" style={{ WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)' }}></div>
              
              <div className="relative pt-8 px-6 pb-6 z-10 flex flex-col flex-1 justify-between h-full">
                <div className="text-center space-y-1.5 relative">
                  <h3 className="font-moul text-sm text-cyan-400 tracking-wider">ព្រះរាជាណាចក្រកម្ពុជា</h3>
                  <h3 className="font-moul text-[13px] text-cyan-400/90 tracking-wider">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
                  <div className="flex items-center justify-center gap-2 text-cyan-500/50 mt-2 mb-3">
                    <span className="w-12 h-[1px] bg-gradient-to-r from-cyan-500/0 via-cyan-400/50 to-cyan-500/0"></span>
                  </div>
                </div>

                <div className="text-center space-y-1.5 pt-1">
                  <h2 className="font-moul text-xl sm:text-2xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] leading-normal">ប័ណ្ណសម្គាល់ខ្លួនសិស្ស</h2>
                  <h3 className="font-moul text-sm sm:text-base text-blue-200 leading-normal">{teacher?.school || 'សាលារៀនចំណេះទូទៅ'}</h3>
                  <div className="inline-block mt-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded text-cyan-300 font-mono text-xs tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.1)_inset]">
                    ID: STD-{rollNoPad}
                  </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 text-[13px] font-battambang space-y-3.5 relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>
                  <div className="flex justify-between items-baseline border-b border-slate-700/50 pb-2 relative z-10">
                    <span className="text-slate-400">គោត្តនាម នាម : <span className="font-moul text-[15px] text-white ml-1">{student.name}</span></span>
                    <span className="text-slate-400">ភេទ: <span className="text-white font-bold">{student.gender === 'ស្រី' || (student.gender as string) === 'F' ? 'ស' : 'ប'}</span></span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 relative z-10">
                    <div><span className="text-slate-400 block text-[11px] mb-0.5">ថ្ងៃខែឆ្នាំកំណើត</span><span className="text-slate-100 font-bold">{student.dob || '—'}</span></div>
                    <div><span className="text-slate-400 block text-[11px] mb-0.5">ថ្នាក់ទី</span><span className="text-slate-100 font-bold">{teacher?.grade || '—'}</span></div>
                    <div className="truncate"><span className="text-slate-400 block text-[11px] mb-0.5">ឪពុកឈ្មោះ</span><span className="text-slate-100 font-bold">{student.fatherName || '—'}</span></div>
                    <div className="truncate"><span className="text-slate-400 block text-[11px] mb-0.5">ម្តាយឈ្មោះ</span><span className="text-slate-100 font-bold">{student.motherName || '—'}</span></div>
                  </div>
                  <div className="truncate relative z-10 pt-1">
                    <span className="text-slate-400 text-[11px] mr-2">អាសយដ្ឋាន:</span><span className="text-slate-200">{student.address || '—'}</span>
                  </div>
                  <div className="text-center pt-3 relative z-10">
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full font-black text-xs shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                      ឆ្នាំសិក្សា: {teacher?.academicYear || '២០២៥-២០២៦'}
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between pt-2 pb-1 gap-4">
                  {renderPhoto(
                    "w-[90px] h-[120px] rounded-xl p-[2px] bg-gradient-to-b from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(34,211,238,0.3)]",
                    "w-full h-full bg-[#0a0f1c] rounded-[10px]",
                    "bg-cyan-500/20 backdrop-blur-[2px] rounded-[10px]"
                  )}
                  <div className="text-[10px] font-battambang text-cyan-200/70 text-center space-y-1 pb-1 relative z-20">
                    <p className="font-mono text-cyan-500/50 text-[9px] uppercase tracking-widest mb-2 border-b border-cyan-500/20 pb-1">Verified Digital</p>
                    <p>ថ្ងៃ អង្គារ ទី ០៨ ខែ កញ្ញា ព.ស ២៥៧០</p>
                    <p>ថ្ងៃទី ០៨ ខែ កញ្ញា ឆ្នាំ ២០២៦</p>
                    <p className="font-moul pt-4 text-[13px] text-cyan-100 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">នាយកសាលា</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : styleIndex === 1 ? (
          // Style 1: Classic Official
          <div className="relative w-full max-w-[420px] aspect-[3/4.2] flex flex-col p-[10px] bg-[#006050] rounded-[32px] shadow-2xl font-moul">
            <div className="relative w-full h-full bg-[#f4f9f9] rounded-[22px] border-[1.5px] border-[#006050] overflow-hidden z-0">
              <div className="absolute top-0 left-0 w-full h-32 bg-[#e3f1f6] rounded-br-[120px] -z-10"></div>
              <div className="absolute top-0 left-0 w-48 h-24 bg-[#c5e6ef] rounded-br-[100px] -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#004f98] rounded-tl-[100px] -z-10"></div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#013565] rounded-tl-[120px] -z-10"></div>
              <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] -z-10 pointer-events-none">
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-64 h-64 text-[#006050]"><path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" /></svg>
              </div>

              <div className="relative pt-6 px-5 pb-5 z-10 flex flex-col flex-1 justify-between h-full">
                <div className="text-center space-y-1">
                  <h3 className="font-moul text-sm text-[#003d73] tracking-wider">ព្រះរាជាណាចក្រកម្ពុជា</h3>
                  <h3 className="font-moul text-[13px] text-[#003d73] tracking-wider">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
                  <div className="flex items-center justify-center gap-1.5 text-[#003d73]/50 my-1">
                    <span className="w-8 h-[1px] bg-[#003d73]/40"></span>
                  </div>
                </div>

                <div className="text-center space-y-1 pt-2">
                  <h2 className="font-moul text-xl sm:text-2xl text-[#006050] leading-normal">ប័ណ្ណសម្គាល់ខ្លួនសិស្ស</h2>
                  <h3 className="font-moul text-sm sm:text-base text-[#006050] leading-normal">{teacher?.school || 'សាលារៀនចំណេះទូទៅ'}</h3>
                  <p className="font-bold font-sans text-[#006050] tracking-wider pt-1 text-[13px]">ID: STD-{rollNoPad}</p>
                </div>

                <div className="text-[13px] font-bold font-battambang text-slate-800 space-y-3.5 pt-2">
                  <div className="flex justify-between items-baseline">
                    <span>គោត្តនាម នាម : <span className="font-moul text-[15px] text-slate-900">{student.name}</span></span>
                    <span>ភេទ: {student.gender === 'ស្រី' || (student.gender as string) === 'F' ? 'ស' : 'ប'}</span>
                  </div>
                  <div>ថ្ងៃខែឆ្នាំកំណើត : <span className="font-black">{student.dob || '—'}</span></div>
                  <div>ថ្នាក់ទី : <span className="font-black">{teacher?.grade || '—'}</span></div>
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="truncate">ឪពុក: {student.fatherName || '—'}</span>
                    <span className="truncate">ម្តាយ: {student.motherName || '—'}</span>
                  </div>
                  <div className="truncate">អាសយដ្ឋាន : {student.address || '—'}</div>
                  <div className="text-center pt-2">
                    <span className="text-red-600 font-black text-sm">ឆ្នាំសិក្សា: {teacher?.academicYear || '២០២៥-២០២៦'}</span>
                  </div>
                </div>

                <div className="flex items-end justify-between pt-3 pb-1 gap-4">
                  {renderPhoto(
                    "w-[90px] h-[120px] rounded-lg border-[3px] border-[#006050] p-0.5 bg-white shadow-md",
                    "w-full h-full bg-slate-100 rounded-sm",
                    "bg-black/30 rounded-sm"
                  )}
                  <div className="text-[10px] font-battambang text-slate-800 text-center space-y-1 pb-1 bg-white/40 p-2 rounded-xl backdrop-blur-sm border border-white/50">
                    <p>ថ្ងៃ អង្គារ ទី ០៨ ខែ កញ្ញា ព.ស ២៥៧០</p>
                    <p>ថ្ងៃទី ០៨ ខែ កញ្ញា ឆ្នាំ ២០២៦</p>
                    <p className="font-moul pt-4 text-[13px] text-slate-900">នាយកសាលា</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : styleIndex === 2 ? (
          // Style 2: Matrix Digital
          <div className="relative w-full max-w-[420px] aspect-[3/4.2] flex flex-col bg-[#0d1117] rounded-[32px] border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)] font-mono overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            <div className="absolute -right-20 -top-20 opacity-5 text-green-500 text-[10px] leading-none break-all select-none w-[400px]">
              01001011 01001000 01001101 01000101 01010010 01010011 01000011 01001000 01001111 01001111 01001100 01000100 01001001 01000111 01001001 01010100 01000001 01001100 01001001 01000100 00110010 00110000 00110010 00110110 01001011 01001000 01001101 01000101 01010010
            </div>
            
            <div className="p-7 relative z-10 flex flex-col flex-1 justify-between h-full">
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
                      {student.gender === 'ស្រី' || (student.gender as string) === 'F' ? 'F' : 'M'}
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
          <div className="relative w-full max-w-[420px] aspect-[3/4.2] flex flex-col bg-[#1a0b2e] rounded-[32px] border border-fuchsia-500/50 shadow-[0_0_40px_rgba(217,70,239,0.2)] font-battambang overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-fuchsia-900/20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-[linear-gradient(transparent_0%,rgba(217,70,239,0.2)_100%)] opacity-50" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(217,70,239,0.3) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(217,70,239,0.3) 20px)' }}></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/30 rounded-full blur-[60px]"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-600/30 rounded-full blur-[60px]"></div>
            
            <div className="p-8 relative z-10 flex flex-col flex-1 justify-between h-full">
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
          <div className="relative w-full max-w-[420px] aspect-[3/4.2] flex flex-col bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(56,189,248,0.3)] font-sans overflow-hidden border border-sky-400/30">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10 mix-blend-overlay"></div>
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky-400/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px]"></div>
            
            <div className="relative p-7 z-20 flex flex-col flex-1 justify-between h-full">
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
                      {student.gender === 'ស្រី' || (student.gender as string) === 'F' ? 'Female' : 'Male'}
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

      </div>
    </div>
  );
};
