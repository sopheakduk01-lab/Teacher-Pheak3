import React, { useState } from 'react';
import {
  Calendar,
  ChevronRight,
  Sparkles,
  Printer,
  FileText,
  Clock,
  ExternalLink,
  Bell,
  Maximize2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import {
  CIVIL_SERVANT_HOLIDAYS_2027,
  SUB_DECREE_HOLIDAYS_2027_META,
  getUpcomingHolidayStatus,
} from '../data/civilServantHolidays2027';
import { CivilServantHolidaysModal } from './CivilServantHolidaysModal';

interface CivilServantHolidaysCardProps {
  onShowToast?: (msg: string) => void;
  variant?: 'banner' | 'carousel';
}

export const CivilServantHolidaysCard: React.FC<CivilServantHolidaysCardProps> = ({
  onShowToast,
  variant = 'carousel',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const upcoming = getUpcomingHolidayStatus();

  // 1. CAROUSEL CARD VARIANT (Clean Minimalist Design)
  if (variant === 'carousel') {
    return (
      <>
        <div
          id="civil-servant-holidays-card-carousel"
          className="min-w-[210px] sm:min-w-[230px] md:min-w-[240px] max-w-[250px] shrink-0 snap-start bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-3 sm:p-3.5 shadow-xs border border-orange-200/90 dark:border-orange-700/60 hover:border-orange-400 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 min-h-[195px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
             <img src="https://img.freepik.com/free-vector/hand-drawn-festive-cambodian-background_23-2149113645.jpg" alt="Decoration" className="w-full h-full object-cover" />
          </div>

          <div className="relative z-10 space-y-2">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-orange-600 uppercase tracking-wide block leading-none">
                    ប្រតិទិន
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold block leading-tight">
                    ឈប់សម្រាក
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-700 font-black text-[9px] border border-orange-100">
                <span>ឈប់ ២២ ថ្ងៃ</span>
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="font-bold text-xs sm:text-[13px] text-slate-800 dark:text-white font-moul leading-snug tracking-wide line-clamp-2">
                ប្រតិទិនឈប់សម្រាកឆ្នាំ២០២៧
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                {upcoming?.holiday ? `${upcoming.statusLabel} ៖ ${upcoming.holiday.name || upcoming.holiday.nameKh}` : 'មន្ត្រីរាជការ និយោជិត កម្មករ'}
              </p>
            </div>

            {/* Illustration Image Area */}
            <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50">
               <img src="https://img.freepik.com/free-photo/beautiful-girl-with-lotus-flower-traditional-dress-angkor-wat_335224-1065.jpg" alt="Holiday" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1.5 relative z-10">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-black text-[11px] shadow-sm transition active:scale-95 flex items-center justify-center gap-1"
            >
              <Maximize2 className="w-3 h-3 text-white" />
              <span>ពិនិត្យប្រតិទិន</span>
              <ChevronRight className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* Fullscreen Modal */}
        <CivilServantHolidaysModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onShowToast={onShowToast}
        />
      </>
    );
  }

  // 2. BANNER VARIANT (Clean Minimalist Design)
  return (
    <>
      <div
        id="civil-servant-holidays-card-banner"
        className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none">
           <img src="https://img.freepik.com/free-vector/traditional-cambodian-ornament-background_23-2149113644.jpg" alt="Decoration" className="w-full h-full object-cover" />
        </div>

        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-wide">
                ប្រតិទិនឈប់សម្រាក ២០២៧
              </span>
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100 text-[9px] font-extrabold">
                ឈប់សម្រាក ២២ ថ្ងៃ
              </span>
              {upcoming && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 border ${
                  upcoming.isWithinThreeDays
                    ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <Bell className="w-2.5 h-2.5" />
                  <span>{upcoming.statusLabel} ៖ {upcoming.holiday.name}</span>
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-white font-moul leading-snug tracking-wide truncate">
              ប្រតិទិនឈប់សម្រាកការងារផ្លូវការ ប្រចាំឆ្នាំ២០២៧
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed truncate">
              អនុក្រឹត្យលេខ {SUB_DECREE_HOLIDAYS_2027_META.number} • ចុះហត្ថលេខាដោយ សម្តេចមហាបវរធិបតី
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <Maximize2 className="w-4 h-4 text-white" />
            <span>ពិនិត្យប្រតិទិនពេញលេញ</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <CivilServantHolidaysModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShowToast={onShowToast}
      />
    </>
  );
};
