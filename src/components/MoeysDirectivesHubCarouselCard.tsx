import React from 'react';
import {
  BookOpen,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Globe,
  Clock,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { MOEYS_GUIDELINE_2026_2027_INFO } from '../data/moeysGuidelineData';
import { MOEYS_STATS_GUIDELINE_2026_2027_META } from '../data/moeysStatsGuidelineData';
import { SUB_DECREE_HOLIDAYS_2027_META } from '../data/civilServantHolidays2027';

interface MoeysDirectivesHubCarouselCardProps {
  onScrollToShowcase: () => void;
  onShowToast?: (msg: string) => void;
}

export const MoeysDirectivesHubCarouselCard: React.FC<MoeysDirectivesHubCarouselCardProps> = ({
  onScrollToShowcase,
  onShowToast,
}) => {
  // Days to Sept 25, 2026
  const emisDeadline = new Date(2026, 8, 25);
  const todaySimulated = new Date(2026, 8, 18);
  const diffTime = emisDeadline.getTime() - todaySimulated.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-w-[88vw] sm:min-w-[380px] md:min-w-[420px] max-w-full shrink-0 snap-start bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-[32px] p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden flex flex-col justify-between group transition-all duration-300">
      <div className="absolute top-0 right-0 w-48 h-full opacity-5 pointer-events-none">
         <img src="https://img.freepik.com/free-vector/hand-drawn-library-background_23-2149463512.jpg" alt="Decoration" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 p-2 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wide block">
                បណ្ណាល័យឌីជីថល
              </span>
              <span className="text-xs text-slate-500 font-bold block">
                លិខិតបទដ្ឋាន និងសេចក្តីណែនាំ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 font-black text-[10px] border border-cyan-100">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>EMIS ៖ {diffDays} ថ្ងៃទៀត</span>
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-white font-moul leading-snug tracking-wide">
            កម្រងសេចក្តីណែនាំ ២០២៦-២០២៧
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            ដំណើរការបឋមសិក្សា (៤២៧) • ស្ថិតិ EMIS (៤២) • ឈប់សម្រាក (១៩៨)
          </p>
        </div>

        {/* 3 Quick Directives Mini Badges */}
        <div className="space-y-1.5 pt-1">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
              <span>📘</span>
              <span>សេចក្តីណែនាំ ៤២៧</span>
            </span>
            <span className="text-[11px] text-slate-400">បវេសនកាល ០១ វិច្ឆិកា</span>
          </div>

          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800 flex items-center justify-between text-xs">
            <span className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
              <span>🌐</span>
              <span>សេចក្តីណែនាំ ៤២ (ថ្មី)</span>
            </span>
            <span className="text-[11px] text-orange-600 font-bold">ឱសានវាទ ២៥ កញ្ញា</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <span>🏛️</span>
              <span>អនុក្រឹត្យ ១៩៨</span>
            </span>
            <span className="text-[11px] text-slate-400">ឈប់សម្រាក ២២ ថ្ងៃ</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex gap-2">
          <button
            type="button"
            onClick={onScrollToShowcase}
            className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-sm transition shrink-0 active:scale-95 flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-white" />
            <span>អានកម្រងសេចក្តីណែនាំ</span>
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoeysDirectivesHubCarouselCard;
