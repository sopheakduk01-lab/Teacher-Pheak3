import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  QrCode,
  Sparkles,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { MOEYS_GUIDELINE_2026_2027_INFO } from '../data/moeysGuidelineData';
import { MoeysGuidelineModal } from './MoeysGuidelineModal';

interface MoeysGuidelineCardProps {
  onShowToast?: (msg: string) => void;
  variant?: 'banner' | 'carousel';
  onOpenOtherGuideline?: () => void;
}

export const MoeysGuidelineCard: React.FC<MoeysGuidelineCardProps> = ({
  onShowToast,
  variant = 'banner',
  onOpenOtherGuideline,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialSectionId, setInitialSectionId] = useState<string>('intro');
  const [showQrModal, setShowQrModal] = useState(false);

  const openWithSection = (sectionId: string) => {
    setInitialSectionId(sectionId);
    setIsModalOpen(true);
  };

  // QR Modal
  const renderQrModal = () => {
    if (!showQrModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 text-center shadow-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#071539] to-[#0B2256] text-amber-300 p-1 mx-auto flex items-center justify-center shadow-md text-xl">
            🇰🇭
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-moul">
              បណ្តាញសង្គមនាយកដ្ឋានបឋមសិក្សា
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              ស្កែន QR Code ផ្លូវការរបស់នាយកដ្ឋានបឋមសិក្សា ក្រសួងអប់រំ យុវជន និងកីឡា
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-400/60 inline-block shadow-inner">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fwww.facebook.com%2Fped.moeys.gov.kh"
              alt="QR Code នាយកដ្ឋានបឋមសិក្សា"
              className="w-44 h-44 mx-auto rounded-lg"
            />
          </div>

          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Facebook: <a href="https://www.facebook.com/ped.moeys.gov.kh" target="_blank" rel="noreferrer" className="text-blue-600 underline">ped.moeys.gov.kh</a>
          </p>

          <button
            onClick={() => setShowQrModal(false)}
            className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition active:scale-95 shadow-xs"
          >
            បិទផ្ទាំង
          </button>
        </div>
      </div>
    );
  };

  // 1. CAROUSEL CARD VARIANT (Clean Minimalist Design)
  if (variant === 'carousel') {
    return (
      <>
        <div
          id="moeys-guideline-card-carousel"
          className="min-w-[210px] sm:min-w-[230px] md:min-w-[240px] max-w-[250px] shrink-0 snap-start bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-3 sm:p-3.5 shadow-xs border border-blue-200/90 dark:border-blue-700/60 hover:border-blue-400 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 min-h-[195px]"
        >
          {/* Decorative Illustration Background */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
             <img src="https://img.freepik.com/free-vector/hand-drawn-back-school-background_23-2149028211.jpg" alt="Decoration" className="w-full h-full object-cover" />
          </div>

          <div className="relative z-10 space-y-2">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-wide block leading-none">
                    សេចក្តីណែនាំ
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold block leading-tight">
                    បឋមសិក្សា
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-black text-[9px] border border-blue-100">
                <span>លេខ ៤២៧</span>
              </span>
            </div>

            {/* Title & Short Description */}
            <div>
              <h3 className="font-bold text-xs sm:text-[13px] text-slate-800 dark:text-white font-moul leading-snug tracking-wide line-clamp-2">
                ដំណើរការគ្រឹះស្ថានបឋមសិក្សា
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                បវេសនកាល ០១ វិច្ឆិកា ២០២៦
              </p>
            </div>

            {/* Feature Image Area */}
            <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50">
               <img src="https://img.freepik.com/free-photo/diverse-school-children-studying-classroom_53876-133857.jpg" alt="School" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1.5 relative z-10">
            <button
              type="button"
              onClick={() => openWithSection('intro')}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] shadow-sm transition active:scale-95 flex items-center justify-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-white" />
              <span>អានសេចក្តីណែនាំ</span>
              <ChevronRight className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        <MoeysGuidelineModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialSectionId={initialSectionId}
          onShowToast={onShowToast}
          onSwitchToStatsGuideline={onOpenOtherGuideline}
        />
        {renderQrModal()}
      </>
    );
  }

  // 2. BANNER VARIANT (Clean Minimalist Design)
  return (
    <>
      <div
        id="moeys-guideline-427-card-banner"
        className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group transition-all duration-300 min-h-[148px]"
      >
        <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none">
           <img src="https://img.freepik.com/free-vector/watercolor-back-school-background_23-2149463510.jpg" alt="Decoration" className="w-full h-full object-cover" />
        </div>

        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-wide">
                កម្រងសេចក្តីណែនាំបឋមសិក្សា
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-extrabold">
                សេចក្តីណែនាំលេខ {MOEYS_GUIDELINE_2026_2027_INFO.docNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-100 hidden sm:inline-flex items-center gap-1">
                <span>🗓️ បវេសនកាល ០១ វិច្ឆិកា ២០២៦</span>
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-white font-moul leading-snug tracking-wide truncate">
              {MOEYS_GUIDELINE_2026_2027_INFO.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed truncate">
              ដំណើរការគ្រឹះស្ថានបឋមសិក្សាសាធារណៈ ២០២៦-២០២៧ • សេចក្តីណែនាំផ្លូវការ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => openWithSection('intro')}
            className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <BookOpen className="w-4 h-4 text-white" />
            <span>អានសេចក្តីណែនាំពេញលេញ</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Main Full Guideline Modal */}
      <MoeysGuidelineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSectionId={initialSectionId}
        onShowToast={onShowToast}
        onSwitchToStatsGuideline={onOpenOtherGuideline}
      />

      {renderQrModal()}
    </>
  );
};
export default MoeysGuidelineCard;
