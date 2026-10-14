import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Sparkles,
  Globe,
  Clock,
  Printer,
  Table,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  MOEYS_STATS_GUIDELINE_2026_2027_META,
  MOEYS_STATS_GUIDELINE_SECTIONS,
} from '../data/moeysStatsGuidelineData';
import { MoeysStatsGuidelineModal } from './MoeysStatsGuidelineModal';

interface MoeysStatsGuidelineCardProps {
  variant?: 'carousel' | 'banner';
  onShowToast?: (msg: string) => void;
  onOpenOtherGuideline?: () => void;
}

export const MoeysStatsGuidelineCard: React.FC<MoeysStatsGuidelineCardProps> = ({
  variant = 'banner',
  onShowToast,
  onOpenOtherGuideline,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('intro');

  const openSection = (id: string) => {
    setSelectedSectionId(id);
    setIsModalOpen(true);
  };

  // 1. CAROUSEL VARIANT (Clean Minimalist Design)
  if (variant === 'carousel') {
    return (
      <>
        <div
          id="moeys-stats-guideline-card-carousel"
          className="min-w-[210px] sm:min-w-[230px] md:min-w-[240px] max-w-[250px] shrink-0 snap-start bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-3 sm:p-3.5 shadow-xs border border-cyan-200/90 dark:border-cyan-700/60 hover:border-cyan-400 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 min-h-[195px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
             <img src="https://img.freepik.com/free-vector/global-data-security-illustration-concept_114360-3162.jpg" alt="Decoration" className="w-full h-full object-cover" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                  <Table className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-cyan-600 uppercase tracking-wide block leading-none">
                    ស្ថិតិអប់រំ
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold block leading-tight">
                    ប្រព័ន្ធ EMIS
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-cyan-50 text-cyan-700 font-extrabold text-[9px] border border-cyan-100">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span>លេខ ៤២</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs sm:text-[13px] text-slate-800 dark:text-white font-moul leading-snug tracking-wide line-clamp-2">
                ការប្រមូលស្ថិតិ EMIS (ថ្មី)
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                entryemis.moeys.gov.kh
              </p>
            </div>

            {/* Illustration Image Area */}
            <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50">
               <img src="https://img.freepik.com/free-photo/analyst-pointing-chart-dashboard_23-2148403365.jpg" alt="Stats" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1.5 relative z-10">
            <button
              type="button"
              onClick={() => openSection('intro')}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-black text-[11px] shadow-sm transition active:scale-95 flex items-center justify-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-white" />
              <span>អានសេចក្តីណែនាំ</span>
              <ChevronRight className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* Modal */}
        <MoeysStatsGuidelineModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialSectionId={selectedSectionId}
          onShowToast={onShowToast}
          onSwitchToOtherGuideline={onOpenOtherGuideline}
        />
      </>
    );
  }

  // 2. BANNER VARIANT (Clean Minimalist Design)
  return (
    <>
      <div
        id="moeys-stats-guideline-card-banner"
        className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group transition-all duration-300 min-h-[148px]"
      >
        <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none">
           <img src="https://img.freepik.com/free-vector/modern-business-data-analysis-concept_114360-3161.jpg" alt="Decoration" className="w-full h-full object-cover" />
        </div>

        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center shrink-0">
            <Table className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-cyan-600 uppercase tracking-wide">
                ស្ថិតិអប់រំបឋមសិក្សា
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100 text-[9px] font-extrabold">
                សេចក្តីណែនាំលេខ {MOEYS_STATS_GUIDELINE_2026_2027_META.docNumber} (ថ្មី)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold border border-amber-100 hidden sm:inline-flex items-center gap-1">
                <span>⏰ ឱសានវាទ ២៥ កញ្ញា ២០២៦</span>
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-white font-moul leading-snug tracking-wide truncate">
              ការប្រមូលស្ថិតិ EMIS (ថ្មី)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed truncate">
              ស្រង់ទិន្នន័យ សិស្ស-ថ្នាក់រៀន-គ្រូ-បន្ទប់រៀន ចូលប្រព័ន្ធអនឡាញផ្លូវការ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => openSection('intro')}
            className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <BookOpen className="w-4 h-4 text-white" />
            <span>អានសេចក្តីណែនាំពេញលេញ</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Full Modal */}
      <MoeysStatsGuidelineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSectionId={selectedSectionId}
        onShowToast={onShowToast}
        onSwitchToOtherGuideline={onOpenOtherGuideline}
      />
    </>
  );
};

export default MoeysStatsGuidelineCard;
