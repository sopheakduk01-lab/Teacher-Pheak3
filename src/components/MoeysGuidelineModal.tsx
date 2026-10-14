import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  Printer,
  Search,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Users,
  Share2,
  FileText,
  Clock,
  GraduationCap,
  Layers,
} from 'lucide-react';
import {
  MOEYS_GUIDELINE_2026_2027_INFO,
  MOEYS_GUIDELINE_SECTIONS,
  GuidelineSection,
} from '../data/moeysGuidelineData';

interface MoeysGuidelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSectionId?: string;
  onShowToast?: (msg: string) => void;
  onSwitchToStatsGuideline?: () => void;
}

export const MoeysGuidelineModal: React.FC<MoeysGuidelineModalProps> = ({
  isOpen,
  onClose,
  initialSectionId = 'intro',
  onShowToast,
  onSwitchToStatsGuideline,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(initialSectionId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSectionId) {
      setActiveSectionId(initialSectionId);
    }
  }, [initialSectionId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSection =
    MOEYS_GUIDELINE_SECTIONS.find((s) => s.id === activeSectionId) || MOEYS_GUIDELINE_SECTIONS[0];

  const currentIndex = MOEYS_GUIDELINE_SECTIONS.findIndex((s) => s.id === currentSection.id);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    if (onShowToast) onShowToast('បានចម្លងតំណភ្ជាប់សេចក្តីណែនាំរួចរាល់!');
  };

  const handleSelectSection = (id: string) => {
    setActiveSectionId(id);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const handleNextSection = () => {
    if (currentIndex < MOEYS_GUIDELINE_SECTIONS.length - 1) {
      handleSelectSection(MOEYS_GUIDELINE_SECTIONS[currentIndex + 1].id);
    }
  };

  const handlePrevSection = () => {
    if (currentIndex > 0) {
      handleSelectSection(MOEYS_GUIDELINE_SECTIONS[currentIndex - 1].id);
    }
  };

  // Filter sections by search query
  const filteredSections = MOEYS_GUIDELINE_SECTIONS.filter((sec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = sec.title.toLowerCase().includes(q);
    const descMatch = sec.shortDesc.toLowerCase().includes(q);
    const contentMatch = sec.content.some((c) =>
      c.paragraphs?.some((p) => p.toLowerCase().includes(q)) ||
      c.bulletPoints?.some((b) => b.toLowerCase().includes(q)) ||
      c.subtitle?.toLowerCase().includes(q)
    );
    return titleMatch || descMatch || contentMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      
      {/* Modal Container: Full Screen on Mobile, Rounded Dialog on Desktop */}
      <div className="bg-white dark:bg-slate-900 w-full h-[100dvh] sm:h-[94vh] sm:max-w-5xl sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-slate-200 dark:border-slate-800">
        
        {/* ================= 1. STICKY TOP HEADER (MOBILE OPTIMIZED) ================= */}
        <div className="relative bg-gradient-to-r from-[#071539] via-[#0B2154] to-[#040C24] text-white p-3.5 sm:p-5 border-b border-amber-400/50 shrink-0 shadow-md">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-2.5">
            {/* Left Crest & Title */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shadow-md shrink-0">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-black font-moul text-amber-300 tracking-wide">
                    នាយកដ្ឋានបឋមសិក្សា (MoEYS)
                  </span>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold px-2 py-0.2 rounded-full">
                    លេខ {MOEYS_GUIDELINE_2026_2027_INFO.docNumber}
                  </span>
                </div>
                <h1 className="text-xs sm:text-sm md:text-base font-black font-moul text-white truncate mt-0.5 leading-snug">
                  សេចក្តីណែនាំ ឆ្នាំសិក្សា២០២៦-២០២៧
                </h1>
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-xl transition border shadow-2xs active:scale-95 ${
                  isSearchOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white/10 hover:bg-white/20 text-amber-300 border-white/15'
                }`}
                aria-label="Search"
                title="ស្វែងរក"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="p-2 sm:px-3 sm:py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-white/15 shadow-2xs active:scale-95"
                title="បោះពុម្ព"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span className="hidden md:inline">បោះពុម្ព</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-red-600 text-white rounded-xl transition shadow-2xs active:scale-95 border border-white/15 min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Collapsible Mobile Search Bar */}
          {isSearchOpen && (
            <div className="mt-2.5 pt-2 border-t border-amber-400/20 flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="វាយពាក្យស្វែងរក (ឧ. PLP, គ. គ. ថ., វត្តមាន, ពិន្ទុ...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-8 py-2 bg-slate-900/90 border border-amber-400/40 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= 2. HORIZONTAL CATEGORY SELECTOR BAR (MOBILE-FIRST) ================= */}
        <div
          ref={tabListRef}
          className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-2 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 shrink-0 shadow-inner"
        >
          {filteredSections.map((sec) => {
            const isActive = sec.id === currentSection.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleSelectSection(sec.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#071539] to-[#0B2154] text-amber-300 shadow-md border border-amber-400/60 font-black'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{sec.icon}</span>
                <span className="whitespace-nowrap">{sec.number}</span>
                <span className="hidden sm:inline whitespace-nowrap">{sec.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* ================= 3. MAIN CONTENT VIEWER (ELEGANT & HIGHLY READABLE ON MOBILE) ================= */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900 custom-scrollbar"
        >
          
          {/* Active Section Header Card */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
              <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-700">
                {currentSection.number}
              </span>
              <span>•</span>
              <span>{currentSection.badge || 'ខ្លឹមសារណែនាំ'}</span>
            </div>
            <h2 className="text-base sm:text-xl font-black font-moul text-slate-900 dark:text-white leading-snug">
              {currentSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              {currentSection.shortDesc}
            </p>
          </div>

          {/* Section Body Blocks */}
          <div className="space-y-5">
            {currentSection.content.map((block, idx) => (
              <div key={idx} className="space-y-3.5">
                
                {/* Subtitle */}
                {block.subtitle && (
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0B1E48] dark:text-amber-300 flex items-center gap-2 border-l-4 border-amber-500 pl-3 py-0.5">
                    <span>{block.subtitle}</span>
                  </h3>
                )}

                {/* Paragraphs */}
                {block.paragraphs && (
                  <div className="space-y-2.5 text-xs sm:text-sm md:text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                    {block.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="bg-white dark:bg-slate-800/60 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {/* Highlights Grid */}
                {block.highlights && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 my-2">
                    {block.highlights.map((hl, hIdx) => (
                      <div
                        key={hIdx}
                        className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-slate-800 dark:to-slate-800/80 border border-amber-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between"
                      >
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                          {hl.label}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-300 mt-1 block leading-snug">
                          {hl.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bullet Points */}
                {block.bulletPoints && (
                  <ul className="space-y-2">
                    {block.bulletPoints.map((bp, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="flex-1">{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tables */}
                {block.tables && block.tables.map((table, tIdx) => (
                  <div key={tIdx} className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs my-3 bg-white dark:bg-slate-800">
                    <table className="w-full text-xs text-left min-w-[340px]">
                      <thead className="bg-[#071539] text-amber-300 font-black text-[11px]">
                        <tr>
                          {table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-3 border-b border-amber-400/20">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-200">
                        {table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-amber-50/50 dark:hover:bg-slate-700/40 transition">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-2.5 sm:p-3 ${cIdx === 0 ? 'font-bold w-12 text-center' : ''} ${
                                  cIdx === row.length - 1 ? 'text-center font-black text-amber-700 dark:text-amber-400' : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {table.note && (
                      <div className="p-2.5 bg-amber-50 dark:bg-slate-800 border-t border-amber-200/60 dark:border-slate-700 text-amber-800 dark:text-amber-300 text-[11px] font-bold text-center">
                        {table.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Quick Bottom Navigation Arrows (Prev / Next Section) */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handlePrevSection}
              disabled={currentIndex === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ផ្នែកមុន</span>
            </button>

            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {currentIndex + 1} / {MOEYS_GUIDELINE_SECTIONS.length}
            </span>

            <button
              onClick={handleNextSection}
              disabled={currentIndex === MOEYS_GUIDELINE_SECTIONS.length - 1}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                currentIndex === MOEYS_GUIDELINE_SECTIONS.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-xs hover:from-amber-300 hover:to-yellow-400'
              }`}
            >
              <span>ផ្នែកបន្ទាប់</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Official Signatory Note */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071539] to-[#0B2154] text-white border border-amber-400/40 text-center space-y-1">
            <h4 className="text-xs font-black font-moul text-amber-300">
              {MOEYS_GUIDELINE_2026_2027_INFO.title}
            </h4>
            <p className="text-[11px] text-blue-100/85">
              លេខ {MOEYS_GUIDELINE_2026_2027_INFO.docNumber} • រាជធានីភ្នំពេញ ថ្ងៃទី១១ ខែកញ្ញា ឆ្នាំ២០២៦ • ឯកឧត្តមបណ្ឌិតសភាចារ្យ ហង់ជួន ណារ៉ុន
            </p>
          </div>

        </div>

        {/* ================= 4. BOTTOM BAR: COMPACT & EASY TAP ================= */}
        <div className="bg-white dark:bg-slate-950 p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-600" />
            <span>ចែករំលែក</span>
          </button>

          <div className="flex items-center gap-2">
            {onSwitchToStatsGuideline && (
              <button
                onClick={() => {
                  onClose();
                  onSwitchToStatsGuideline();
                }}
                className="px-3.5 py-2.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-600 dark:text-cyan-300 border border-cyan-400/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
              >
                <span>មើលសេចក្តីណែនាំលេខ ៤២ (ស្ថិតិ EMIS)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition active:scale-95"
            >
              បិទ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default MoeysGuidelineModal;
