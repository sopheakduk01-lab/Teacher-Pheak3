import React from 'react';
import { Tablet, Sparkles, ExternalLink, BookOpen } from 'lucide-react';

export const PLPTabletBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
          <Tablet className="w-7 h-7 text-amber-300" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase shadow-2xs">
              PLP MoEYS
            </span>
            <span className="text-xs text-indigo-200 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> ការរៀនស្វ័យសិក្សាលើកុំព្យូទ័របន្ទះ
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black font-moul">
            កម្មវិធីសិក្សាឌីជីថល PLP សម្រាប់សិស្សបឋមសិក្សា
          </h3>
          <p className="text-xs text-blue-100/90 leading-relaxed max-w-xl">
            គាំទ្រលំហាត់អន្តរកម្ម សៀវភៅអេឡិចត្រូនិក និងការតាមដានការសិក្សាឆ្លើយតបស្តង់ដារក្រសួងអប់រំ។
          </p>
        </div>
      </div>

      <div className="relative z-10 shrink-0">
        <button
          type="button"
          onClick={() => {
            const url = 'https://plp.moeys.gov.kh';
            window.open(url, '_blank');
          }}
          className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 transition active:scale-95 border border-white/30 backdrop-blur-md cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>ស្វែងយល់បន្ថែម</span>
          <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
        </button>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};
