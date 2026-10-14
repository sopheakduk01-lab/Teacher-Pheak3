import React, { useState, useRef, useEffect, TouchEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles,
  FileText,
  Clock,
  ExternalLink,
  Award,
  Globe,
  SlidersHorizontal,
  Search,
  Printer,
  Copy,
  Check,
  X,
  Layers,
  ArrowRight,
  BellRing,
} from 'lucide-react';
import { MoeysGuidelineCard } from './MoeysGuidelineCard';
import { MoeysStatsGuidelineCard } from './MoeysStatsGuidelineCard';
import { CivilServantHolidaysCard } from './CivilServantHolidaysCard';
import { MoeysDirectivesPrintModal } from './MoeysDirectivesPrintModal';
import { MoeysGuidelineModal } from './MoeysGuidelineModal';
import { MoeysStatsGuidelineModal } from './MoeysStatsGuidelineModal';
import { CivilServantHolidaysModal } from './CivilServantHolidaysModal';
import {
  MOEYS_GUIDELINE_2026_2027_INFO,
  MOEYS_GUIDELINE_SECTIONS,
} from '../data/moeysGuidelineData';
import {
  MOEYS_STATS_GUIDELINE_2026_2027_META,
  MOEYS_STATS_GUIDELINE_SECTIONS,
} from '../data/moeysStatsGuidelineData';
import {
  SUB_DECREE_HOLIDAYS_2027_META,
  CIVIL_SERVANT_HOLIDAYS_2027,
} from '../data/civilServantHolidays2027';

interface MoeysGuidelinesShowcaseProps {
  onShowToast?: (msg: string) => void;
}

export const MoeysGuidelinesShowcase: React.FC<MoeysGuidelinesShowcaseProps> = ({
  onShowToast,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Direct modal controls for cross-linking and search jump
  const [modal427Open, setModal427Open] = useState(false);
  const [section427Id, setSection427Id] = useState('intro');

  const [modal42Open, setModal42Open] = useState(false);
  const [section42Id, setSection42Id] = useState('intro');

  const [modal198Open, setModal198Open] = useState(false);

  // Touch and drag swipe
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Calculate days remaining to EMIS deadline (Sept 25, 2026)
  const emisDeadline = new Date(2026, 8, 25);
  const todaySimulated = new Date(2026, 8, 18);
  const diffTime = emisDeadline.getTime() - todaySimulated.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const guidelinesList = [
    {
      id: 'guideline-427',
      tabLabel: '១. ដំណើរការបឋមសិក្សា',
      badge: 'លេខ ៤២៧',
      title: 'ដំណើរការគ្រឹះស្ថានបឋមសិក្សា ២០២៦-២០២៧',
      icon: '🌐',
      theme: 'amber',
    },
    {
      id: 'guideline-42',
      tabLabel: '២. ប្រមូលស្ថិតិ EMIS (ថ្មី)',
      badge: 'លេខ ៤២ (ថ្មី)',
      title: 'ការប្រមូលស្ថិតិអប់រំបឋមត្រៀមបើកបវេសនកាល (EMIS)',
      icon: '🏛️',
      theme: 'cyan',
    },
    {
      id: 'holidays-198',
      tabLabel: '៣. ឈប់សម្រាកមន្ត្រីរាជការ ២០២៧',
      badge: 'អនុក្រឹត្យ ១៩៨',
      title: 'ប្រតិទិនឈប់សម្រាកការងារមន្ត្រីរាជការ ២០២៧',
      icon: '🇰🇭',
      theme: 'rose',
    },
  ];

  const totalItems = guidelinesList.length;

  const goToSlide = (index: number) => {
    const validIndex = Math.max(0, Math.min(totalItems - 1, index));
    setCurrentIndex(validIndex);
  };

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(0); // loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else {
      goToSlide(totalItems - 1); // loop back
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modal427Open || modal42Open || modal198Open || isPrintModalOpen) return;
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, modal427Open, modal42Open, modal198Open, isPrintModalOpen]);

  // Touch handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Search matches across all 3 guidelines
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: {
      type: 'g427' | 'g42' | 'h198';
      docTitle: string;
      sectionId?: string;
      title: string;
      snippet: string;
    }[] = [];

    // Search Guideline 427
    MOEYS_GUIDELINE_SECTIONS.forEach((sec) => {
      const matchTitle = sec.title.toLowerCase().includes(q);
      const matchDesc = sec.shortDesc.toLowerCase().includes(q);
      const matchContent = sec.content.some(
        (c) =>
          c.paragraphs?.some((p) => p.toLowerCase().includes(q)) ||
          c.bulletPoints?.some((b) => b.toLowerCase().includes(q))
      );
      if (matchTitle || matchDesc || matchContent) {
        results.push({
          type: 'g427',
          docTitle: 'សេចក្តីណែនាំ ៤២៧ (ដំណើរការបឋម)',
          sectionId: sec.id,
          title: sec.title,
          snippet: sec.shortDesc,
        });
      }
    });

    // Search Guideline 42
    MOEYS_STATS_GUIDELINE_SECTIONS.forEach((sec) => {
      const matchTitle = sec.title.toLowerCase().includes(q);
      const matchDesc = sec.shortDesc.toLowerCase().includes(q);
      const matchContent = sec.content.some(
        (c) =>
          c.paragraphs?.some((p) => p.toLowerCase().includes(q)) ||
          c.bulletPoints?.some((b) => b.toLowerCase().includes(q))
      );
      if (matchTitle || matchDesc || matchContent) {
        results.push({
          type: 'g42',
          docTitle: 'សេចក្តីណែនាំ ៤២ (ស្ថិតិ EMIS)',
          sectionId: sec.id,
          title: sec.title,
          snippet: sec.shortDesc,
        });
      }
    });

    // Search Sub-decree 198
    CIVIL_SERVANT_HOLIDAYS_2027.forEach((h) => {
      if (
        h.name.toLowerCase().includes(q) ||
        h.dateKhmer.toLowerCase().includes(q) ||
        h.categoryLabel.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'h198',
          docTitle: 'អនុក្រឹត្យ ១៩៨ (ឈប់សម្រាក ២០២៧)',
          title: h.name,
          snippet: `${h.dateKhmer} (${h.durationLabel})`,
        });
      }
    });

    return results.slice(0, 8); // top 8 results
  }, [searchQuery]);

  const handleSelectSearchResult = (res: {
    type: 'g427' | 'g42' | 'h198';
    sectionId?: string;
  }) => {
    if (res.type === 'g427') {
      setSection427Id(res.sectionId || 'intro');
      setModal427Open(true);
      goToSlide(0);
    } else if (res.type === 'g42') {
      setSection42Id(res.sectionId || 'intro');
      setModal42Open(true);
      goToSlide(1);
    } else {
      setModal198Open(true);
      goToSlide(2);
    }
    setSearchQuery('');
  };

  return (
    <div id="moeys-guidelines-section" className="space-y-3.5 scroll-mt-20">
      {/* Header bar with controls and swipe helper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-moul">
                កម្រងសេចក្តីណែនាំ & លិខិតបទដ្ឋានគតិយុត្ត
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span>ឱសានវាទ EMIS ៖ នៅសល់ {diffDays} ថ្ងៃ</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ក្រសួងអប់រំ យុវជន និងកីឡា • ឯកសារច្បាប់ និងកាលវិភាគផ្លូវការសម្រាប់សាលាបឋមសិក្សា
            </p>
          </div>
        </div>

        {/* Action Buttons & Prev/Next */}
        <div className="flex items-center gap-1.5 self-end sm:self-center flex-wrap">
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
              isSearchOpen
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title="ស្វែងរកក្នុងសេចក្តីណែនាំ"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">ស្វែងរក</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition shadow-2xs active:scale-95 flex items-center gap-1 text-xs font-bold"
            title="បោះពុម្ពសង្ខេប A4"
          >
            <Printer className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">បោះពុម្ព A4</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Previous & Next Arrow Buttons */}
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition shadow-2xs active:scale-95 flex items-center gap-1 text-xs font-bold"
            title="សេចក្តីណែនាំមុន (←)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">មុន</span>
          </button>

          <span className="text-xs font-black px-1.5 text-slate-500 dark:text-slate-400 min-w-[36px] text-center">
            {currentIndex + 1} / {totalItems}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition shadow-2xs active:scale-95 flex items-center gap-1 text-xs font-bold"
            title="សេចក្តីណែនាំបន្ទាប់ (→)"
          >
            <span className="hidden sm:inline">បន្ទាប់</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Global Interactive Search Input */}
      {isSearchOpen && (
        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-amber-400/50 shadow-lg space-y-2 animate-in fade-in duration-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកក្នុងសេចក្តីណែនាំទាំង ៣ (ឧទាហរណ៍៖ ស្ថិតិ, បវេសនកាល, បន្ទប់រៀន, វិស្សមកាល, ឈប់សម្រាក, EMIS...)"
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  លទ្ធផលស្វែងរក ៖ <strong>{searchResults.length}</strong> កន្លែង
                </span>
                <span className="text-[10px]">ចុចលើលទ្ធផលដើម្បីបើកមើលភ្លាមៗ</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearchResult(res)}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-700 hover:border-amber-300 text-left transition flex items-start gap-2 text-xs group"
                    >
                      <span className="text-sm shrink-0">
                        {res.type === 'g427' ? '📘' : res.type === 'g42' ? '🌐' : '🏛️'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block truncate">
                          {res.docTitle}
                        </span>
                        <strong className="text-slate-900 dark:text-white truncate block text-[11px] group-hover:text-amber-600 dark:group-hover:text-amber-300">
                          {res.title}
                        </strong>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {res.snippet}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-transform shrink-0 self-center" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-2 text-center">
                  មិនមានទិន្នន័យត្រូវគ្នានឹង "{searchQuery}" ឡើយ។
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Segmented Tab Bar for quick direct jumping */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {guidelinesList.map((item, idx) => {
          const isActive = currentIndex === idx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shrink-0 active:scale-95 border ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white shadow-sm font-black'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.tabLabel}</span>
              {item.badge.includes('ថ្មី') && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Touch-enabled Swipeable Slider Container with Floating Edge Arrows */}
      <div
        className="relative overflow-hidden rounded-[28px] focus:outline-none group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Floating Left Arrow (desktop/tablet) */}
        <button
          type="button"
          onClick={handlePrev}
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white backdrop-blur-md border border-white/20 items-center justify-center shadow-xl transition-all duration-200 opacity-70 hover:opacity-100 hover:scale-110 active:scale-95"
          title="សេចក្តីណែនាំមុន (ArrowLeft)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Floating Right Arrow (desktop/tablet) */}
        <button
          type="button"
          onClick={handleNext}
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white backdrop-blur-md border border-white/20 items-center justify-center shadow-xl transition-all duration-200 opacity-70 hover:opacity-100 hover:scale-110 active:scale-95"
          title="សេចក្តីណែនាំបន្ទាប់ (ArrowRight)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* The Carousel Track */}
        <div
          ref={carouselContainerRef}
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* Slide 0: សេចក្តីណែនាំ ៤២៧ ដំណើរការគ្រឹះស្ថានបឋមសិក្សា ២០២៦-២០២៧ */}
          <div className="w-full shrink-0 px-0.5">
            <MoeysGuidelineCard
              variant="banner"
              onShowToast={onShowToast}
              onOpenOtherGuideline={() => goToSlide(1)}
            />
          </div>

          {/* Slide 1: សេចក្តីណែនាំ ៤២ ការប្រមូលស្ថិតិអប់រំបឋមត្រៀមបើកបវេសនកាល ២០២៦-២០២៧ (EMIS) */}
          <div className="w-full shrink-0 px-0.5">
            <MoeysStatsGuidelineCard
              variant="banner"
              onShowToast={onShowToast}
              onOpenOtherGuideline={() => goToSlide(0)}
            />
          </div>

          {/* Slide 2: ប្រតិទិនឈប់សម្រាកការងាររបស់មន្ត្រីរាជការ ២០២៧ (អនុក្រឹត្យលេខ ១៩៨) */}
          <div className="w-full shrink-0 px-0.5">
            <CivilServantHolidaysCard
              variant="banner"
              onShowToast={onShowToast}
            />
          </div>
        </div>

        {/* Bottom Swipe Cue & Dot Indicators */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="text-sm select-none">👈</span>
            <span className="font-semibold text-[11px]">
              អូសឆ្វេងស្តាំ ឬចុចព្រួញសងខាង ដើម្បីប្តូរសេចក្តីណែនាំ
            </span>
            <span className="text-sm select-none">👉</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {guidelinesList.map((item, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => goToSlide(dotIdx)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === dotIdx
                    ? 'w-7 h-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm'
                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                }`}
                title={item.tabLabel}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* A4 Print Modal for Consolidated Directives */}
      <MoeysDirectivesPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onShowToast={onShowToast}
      />

      {/* Global Direct Modals for Search/Jump Actions */}
      <MoeysGuidelineModal
        isOpen={modal427Open}
        onClose={() => setModal427Open(false)}
        initialSectionId={section427Id}
        onShowToast={onShowToast}
        onSwitchToStatsGuideline={() => {
          setModal427Open(false);
          setModal42Open(true);
        }}
      />

      <MoeysStatsGuidelineModal
        isOpen={modal42Open}
        onClose={() => setModal42Open(false)}
        initialSectionId={section42Id}
        onShowToast={onShowToast}
        onSwitchToOtherGuideline={() => {
          setModal42Open(false);
          setModal427Open(true);
        }}
      />

      <CivilServantHolidaysModal
        isOpen={modal198Open}
        onClose={() => setModal198Open(false)}
        onShowToast={onShowToast}
      />
    </div>
  );
};

export default MoeysGuidelinesShowcase;
