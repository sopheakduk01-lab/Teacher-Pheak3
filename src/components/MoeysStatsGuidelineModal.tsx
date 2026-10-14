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
  Globe,
  Maximize2,
  Minimize2,
  Copy,
  Table,
  AlertCircle,
} from 'lucide-react';
import {
  MOEYS_STATS_GUIDELINE_2026_2027_META,
  MOEYS_STATS_GUIDELINE_SECTIONS,
  StatsGuidelineSection,
} from '../data/moeysStatsGuidelineData';

interface MoeysStatsGuidelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSectionId?: string;
  onShowToast?: (msg: string) => void;
  onSwitchToOtherGuideline?: () => void;
}

export const MoeysStatsGuidelineModal: React.FC<MoeysStatsGuidelineModalProps> = ({
  isOpen,
  onClose,
  initialSectionId = 'intro',
  onShowToast,
  onSwitchToOtherGuideline,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(initialSectionId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    MOEYS_STATS_GUIDELINE_SECTIONS.find((s) => s.id === activeSectionId) ||
    MOEYS_STATS_GUIDELINE_SECTIONS[0];

  const currentIndex = MOEYS_STATS_GUIDELINE_SECTIONS.findIndex(
    (s) => s.id === currentSection.id
  );

  const handleCopySummary = () => {
    const text = [
      `🇰🇭 ${MOEYS_STATS_GUIDELINE_2026_2027_META.title}`,
      `លេខ៖ ${MOEYS_STATS_GUIDELINE_2026_2027_META.docNumber}`,
      `កាលបរិច្ឆេទ៖ ${MOEYS_STATS_GUIDELINE_2026_2027_META.dateSolar}`,
      `ចុះហត្ថលេខាដោយ៖ ${MOEYS_STATS_GUIDELINE_2026_2027_META.role} ${MOEYS_STATS_GUIDELINE_2026_2027_META.signatory}`,
      `ប្រព័ន្ធបញ្ចូលទិន្នន័យ៖ ${MOEYS_STATS_GUIDELINE_2026_2027_META.systemUrl}`,
      `កាលបរិច្ឆេទកំណត់ (Deadline)៖ ${MOEYS_STATS_GUIDELINE_2026_2027_META.deadlineDays}`,
      '',
      '--- តារាងស្ថិតិបឋមសិក្សាត្រូវបំពេញ ---',
      '• តារាង២.(ក១) កុមារមត្តេយ្យសិក្សា តាមអាយុ និងតាមកម្រិតថ្នាក់ (សម្រាប់ថ្នាក់មត្តេយ្យនៅបឋមសិក្សា)',
      '• តារាង២.(ក២) សិស្សថ្មី សិស្សឡើងថ្នាក់ និងសិស្សត្រួតថ្នាក់',
      '• តារាង៣.(ក) បន្ទប់រៀន (សម្រាប់ដំណើរការរៀន និងបង្រៀន)',
      '• តារាង៣.(ខ១) ចំនួនថ្នាក់រៀនមត្តេយ្យសិក្សា',
      '• តារាង៣.(ខ២) ចំនួនថ្នាក់រៀនបឋមសិក្សា',
      '• តារាង៣.(គ) ចំនួនគ្រូបង្រៀន និងគ្រូកិច្ចព្រមព្រៀងការងារ តាមកម្រិតថ្នាក់',
      '• តារាង៤.(ក), ៤.(គ) ចំនួនបុគ្គលិកអប់រំតាមប្រភេទក្របខ័ណ្ឌ និងគ្រូជាប់កិច្ចសន្យា',
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onShowToast) onShowToast('បានចម្លងសេចក្តីណែនាំលេខ ៤២ រួចរាល់!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `🇰🇭 សេចក្តីណែនាំលេខ ៤២ អយក.សណន (ចុះថ្ងៃទី១០ កញ្ញា ២០២៦)\nស្តីពី ការប្រមូលស្ថិតិអប់រំបឋមត្រៀមបើកបវេសនកាលឆ្នាំសិក្សា២០២៦-២០២៧\n\n📌 ចូលបញ្ចូលទិន្នន័យតាម៖ https://entryemis.moeys.gov.kh\n⚠️ កាលបរិច្ឆេទកំណត់៖ មុនថ្ងៃទី២៥ ខែកញ្ញា ឆ្នាំ២០២៦\nចុះហត្ថលេខាដោយ៖ ឯកឧត្តមបណ្ឌិតសភាចារ្យ ហង់ជួន ណារ៉ុន`
    );
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent('https://entryemis.moeys.gov.kh')}&text=${text}`,
      '_blank'
    );
  };

  const handlePrint = () => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${MOEYS_STATS_GUIDELINE_2026_2027_META.title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Moul&family=Siemreap&display=swap" rel="stylesheet">
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: 'Kantumruy Pro', 'Siemreap', sans-serif; color: #0f172a; margin: 0; padding: 0; font-size: 10.5pt; line-height: 1.6; }
            .font-moul { font-family: 'Moul', serif; }
            .header-block { text-align: center; margin-bottom: 16px; }
            .royal-header { font-size: 13pt; line-height: 1.7; }
            .sub-title { font-size: 12pt; color: #1e3a8a; margin-top: 8px; }
            .info-row { display: flex; justify-content: space-between; font-size: 10pt; margin-top: 10px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; }
            .section-title { font-family: 'Moul', serif; font-size: 11pt; color: #0f172a; margin-top: 16px; margin-bottom: 6px; }
            ul { margin-top: 4px; padding-left: 20px; }
            li { margin-bottom: 4px; }
            .footer-sig { margin-top: 30px; display: flex; justify-content: space-between; page-break-inside: avoid; }
            .sig-col { text-align: center; width: 45%; }
            @media print { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body>
          <div class="header-block">
            <div class="royal-header font-moul">
              ព្រះរាជាណាចក្រកម្ពុជា<br/>ជាតិ សាសនា ព្រះមហាក្សត្រ
            </div>
            <div style="font-size: 10pt; margin-top: 4px;">***</div>
          </div>

          <div class="info-row">
            <div>
              <strong>ក្រសួងអប់រំ យុវជន និងកីឡា</strong><br/>
              លេខ ៖ <strong>${MOEYS_STATS_GUIDELINE_2026_2027_META.docNumber}</strong>
            </div>
            <div style="text-align: right;">
              ${MOEYS_STATS_GUIDELINE_2026_2027_META.dateKhmer}<br/>
              រាជធានីភ្នំពេញ ${MOEYS_STATS_GUIDELINE_2026_2027_META.dateSolar}
            </div>
          </div>

          <div style="text-align: center; margin: 16px 0;">
            <div class="sub-title font-moul">
              សេចក្តីណែនាំ<br/>
              ស្តីពី<br/>
              ការប្រមូលស្ថិតិអប់រំបឋមត្រៀមបើកបវេសនកាលឆ្នាំសិក្សា២០២៦-២០២៧
            </div>
          </div>

          <div class="section-title">១. សេចក្តីផ្តើម</div>
          <p style="text-indent: 20px; text-align: justify; margin: 6px 0;">
            ក្រសួងអប់រំ យុវជន និងកីឡា បានដាក់ចេញនូវគោលនយោបាយ និងកម្មវិធីកំណែទម្រង់ជាបន្តបន្ទាប់ ក្នុងគោលដៅធ្វើបរិវត្តកម្មប្រព័ន្ធអប់រំ និងធានាឱ្យសិស្សានុសិស្សទទួលបានការអប់រំប្រកបដោយគុណភាព សមធម៌ និងបរិយាបន្ន។ ក្នុងដំណើរការនេះ ការរៀបចំផែនការធនធានអប់រំ ជាពិសេស គ្រូបង្រៀន ថ្នាក់រៀន និងបន្ទប់រៀន ឱ្យសមស្របនឹងតម្រូវការជាក់ស្តែងរបស់គ្រឹះស្ថានសិក្សាអប់រំសាធារណៈ គឺជាកត្តាសំខាន់សម្រាប់ធានាប្រសិទ្ធភាពនៃការផ្តល់សេវាអប់រំ។
          </p>
          <p style="text-indent: 20px; text-align: justify; margin: 6px 0;">
            ការប្រមូល និងធ្វើបច្ចុប្បន្នភាពទិន្នន័យអប់រំមុនបើកបវេសនកាលឆ្នាំសិក្សាថ្មី តាមរយៈប្រព័ន្ធព័ត៌មានគ្រប់គ្រងអប់រំអនឡាញ (<strong>entryemis.moeys.gov.kh</strong>) នឹងផ្តល់មូលដ្ឋានសម្រាប់ការរៀបចំ និងបែងចែកគ្រូបង្រៀន ការរៀបចំថ្នាក់រៀន និងការប្រើប្រាស់បន្ទប់រៀនឱ្យមានប្រសិទ្ធភាព។
          </p>

          <div class="section-title">២. ការបំពេញ ប្រមូល និងបូកសរុបស្ថិតិអប់រំ</div>
          <p><strong>ខ. កម្រិតបឋមសិក្សា ៖</strong></p>
          <ul>
            <li>តារាង២.(ក១) កុមារមត្តេយ្យសិក្សា តាមអាយុ និងតាមកម្រិតថ្នាក់ (សម្រាប់ថ្នាក់មត្តេយ្យនៅក្នុងបឋមសិក្សា)</li>
            <li>តារាង២.(ក២) សិស្សថ្មី សិស្សឡើងថ្នាក់ និងសិស្សត្រួតថ្នាក់</li>
            <li>តារាង៣.(ក) បន្ទប់រៀន (សម្រាប់ដំណើរការរៀន និងបង្រៀន)</li>
            <li>តារាង៣.(ខ១) ចំនួនថ្នាក់រៀនមត្តេយ្យសិក្សា</li>
            <li>តារាង៣.(ខ២) ចំនួនថ្នាក់រៀនបឋមសិក្សា</li>
            <li>តារាង៣.(គ) ចំនួនគ្រូបង្រៀន និងគ្រូកិច្ចព្រមព្រៀងការងារ តាមកម្រិតថ្នាក់</li>
            <li>តារាង៤.(ក), ៤.(គ) ចំនួនបុគ្គលិកអប់រំតាមប្រភេទក្របខ័ណ្ឌ និងគ្រូជាប់កិច្ចសន្យា</li>
          </ul>

          <div class="section-title">៣. ក្របខ័ណ្ឌពេលវេលា</div>
          <p>
            ការប្រមូល និងបញ្ចូលទិន្នន័យអប់រំបឋមសម្រាប់ត្រៀមបើកបវេសនកាលឆ្នាំសិក្សា២០២៦-២០២៧ ចាប់ពីថ្ងៃទី១០ ខែកញ្ញា ដល់ <strong>ថ្ងៃទី២៥ ខែកញ្ញា ឆ្នាំ២០២៦</strong>។
          </p>

          <div class="section-title">៤. តួនាទី និងភារកិច្ច</div>
          <p>
            <strong>៤.១ នាយក នាយិកាសាលារៀន៖</strong> ត្រូវរៀបចំពិនិត្យផ្ទៀងផ្ទាត់ និងបូកសរុបស្ថិតិអប់រំខាងលើឱ្យបានច្បាស់លាស់ រួចបំពេញ និងបញ្ចូលទិន្នន័យទៅក្នុងប្រព័ន្ធអនឡាញ (entryemis.moeys.gov.kh) ឱ្យបានរួចរាល់មុនថ្ងៃទី២៥ ខែកញ្ញា ឆ្នាំ២០២៦។
          </p>

          <div class="footer-sig">
            <div class="sig-col" style="text-align: left; font-size: 9pt;">
              <strong>កន្លែងទទួល ៖</strong><br/>
              - រដ្ឋបាលរាជធានី ខេត្ត<br/>
              - អគ្គលេខាធិការដ្ឋាន អគ្គនាយកដ្ឋាន និងអគ្គាធិការដ្ឋាន<br/>
              - ខុទ្ទកាល័យឯកឧត្តមបណ្ឌិតសភាចារ្យ ឧបនាយករដ្ឋមន្ត្រី<br/>
              - មន្ទីរអប់រំ យុវជន និងកីឡា<br/>
              - កាលប្បវត្តិ និងឯកសារ
            </div>
            <div class="sig-col">
              <p style="font-size: 9.5pt;">
                ${MOEYS_STATS_GUIDELINE_2026_2027_META.dateSolar}<br/>
                <strong>${MOEYS_STATS_GUIDELINE_2026_2027_META.role}</strong>
              </p>
              <div style="height: 45px;"></div>
              <p class="font-moul" style="font-size: 11pt;">${MOEYS_STATS_GUIDELINE_2026_2027_META.signatory}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1500);
    }, 500);
  };

  const getFontScaleClass = () => {
    if (fontScale === 'sm') return 'text-[11px]';
    if (fontScale === 'lg') return 'text-[15px]';
    return 'text-xs sm:text-sm';
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFullscreen
          ? 'p-0 w-screen h-screen'
          : 'p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md'
      } animate-in fade-in duration-200`}
    >
      <div
        className={`bg-white dark:bg-slate-900 w-full ${
          isFullscreen
            ? 'h-full rounded-none'
            : 'max-w-5xl max-h-[94vh] rounded-[28px]'
        } shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-all duration-300`}
      >
        {/* ================= ROYAL HEADER ================= */}
        <div className="relative bg-gradient-to-r from-[#031536] via-[#052358] to-[#010C24] text-white p-3.5 sm:p-5 shrink-0 border-b border-cyan-400/30">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-cyan-500/15 to-transparent pointer-events-none" />

          {/* Top Bar */}
          <div className="flex items-start justify-between relative z-10 gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/30 flex items-center justify-center shrink-0">
                <Table className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-400/20 px-2 py-0.5 rounded-full border border-cyan-400/40">
                    សេចក្តីណែនាំលេខ {MOEYS_STATS_GUIDELINE_2026_2027_META.docNumber}
                  </span>
                  <span className="text-[9px] text-cyan-200 hidden sm:inline-block">
                    ក្រសួងអប់រំ យុវជន និងកីឡា
                  </span>
                  <span className="text-[9px] text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full font-bold border border-amber-400/40">
                    ចូលប្រព័ន្ធ EMIS
                  </span>
                </div>
                <h2 className="text-sm sm:text-base md:text-lg font-extrabold font-moul text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-200 to-cyan-300 mt-0.5 truncate">
                  ការប្រមូលស្ថិតិអប់រំបឋមត្រៀមបើកបវេសនកាល ២០២៦-២០២៧
                </h2>
                <p className="text-[10px] sm:text-xs text-cyan-100/80 font-medium truncate">
                  {MOEYS_STATS_GUIDELINE_2026_2027_META.role} {MOEYS_STATS_GUIDELINE_2026_2027_META.signatory} ({MOEYS_STATS_GUIDELINE_2026_2027_META.dateSolar})
                </p>
              </div>
            </div>

            {/* Action Tools */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Font Size Adjuster */}
              <div className="hidden sm:flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10 text-xs">
                <button
                  onClick={() => setFontScale('sm')}
                  className={`px-2 py-1 rounded-lg font-bold transition ${
                    fontScale === 'sm' ? 'bg-cyan-400 text-slate-950 font-black' : 'text-slate-200'
                  }`}
                  title="អក្សរតូច"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontScale('md')}
                  className={`px-2 py-1 rounded-lg font-bold transition ${
                    fontScale === 'md' ? 'bg-cyan-400 text-slate-950 font-black' : 'text-slate-200'
                  }`}
                  title="អក្សរធម្មតា"
                >
                  A
                </button>
                <button
                  onClick={() => setFontScale('lg')}
                  className={`px-2 py-1 rounded-lg font-bold transition ${
                    fontScale === 'lg' ? 'bg-cyan-400 text-slate-950 font-black' : 'text-slate-200'
                  }`}
                  title="អក្សរធំ"
                >
                  A+
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition active:scale-95 border border-white/10 shrink-0"
                title={isFullscreen ? 'បង្រួមទំហំធម្មតា' : 'ពង្រីកពេញអេក្រង់'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-slate-200 hover:text-white transition active:scale-95 border border-white/10 shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Direct EntryEMIS Portal Quick Action Banner */}
          <div className="mt-3 relative z-10">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-blue-900/60 via-cyan-900/50 to-blue-950/70 border border-cyan-400/50 shadow-md flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-cyan-300 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-cyan-300">
                      ប្រព័ន្ធបញ្ចូលទិន្នន័យអនឡាញផ្លូវការ
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/80 text-white font-black text-[9px] uppercase animate-pulse">
                      ផុតកំណត់ ២៥ កញ្ញា
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-white truncate">
                    entryemis.moeys.gov.kh
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <a
                  href={MOEYS_STATS_GUIDELINE_2026_2027_META.systemUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-black text-xs transition shadow-md active:scale-95 flex items-center gap-1.5 border border-cyan-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>បើកប្រព័ន្ធ EMIS</span>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Section Tabs */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/10 overflow-x-auto no-scrollbar text-xs font-bold">
            {MOEYS_STATS_GUIDELINE_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSectionId(sec.id);
                  if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                }}
                className={`px-3 py-1.5 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
                  activeSectionId === sec.id
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 shadow-md font-black'
                    : 'bg-white/10 hover:bg-white/15 text-white/90'
                }`}
              >
                <span>{sec.icon}</span>
                <span>
                  ជំពូក {sec.number} ៖ {sec.title.split('&')[0]}
                </span>
              </button>
            ))}

            {onSwitchToOtherGuideline && (
              <button
                onClick={onSwitchToOtherGuideline}
                className="px-3 py-1.5 rounded-xl transition shrink-0 flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 ml-auto font-bold"
              >
                <span>ប្តូរទៅសេចក្តីណែនាំលេខ ៤២៧</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ================= BODY CONTENT ================= */}
        <div
          ref={scrollContainerRef}
          className={`flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 ${getFontScaleClass()}`}
        >
          {/* Section Header */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50/50 dark:from-cyan-950/30 dark:to-blue-950/20 border border-cyan-200 dark:border-cyan-800/60">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{currentSection.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase text-cyan-700 dark:text-cyan-300">
                    ជំពូកទី {currentSection.number}
                  </span>
                  <h3 className="font-moul text-sm sm:text-base text-blue-950 dark:text-blue-200">
                    {currentSection.title}
                  </h3>
                </div>
              </div>

              {currentSection.badge && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 dark:bg-cyan-900/60 dark:text-cyan-200 font-bold text-xs border border-cyan-300 dark:border-cyan-700">
                  {currentSection.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              {currentSection.shortDesc}
            </p>
          </div>

          {/* Section Content Items */}
          {currentSection.content.map((item, idx) => (
            <div
              key={idx}
              className="space-y-3 bg-white dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              {item.subtitle && (
                <h4 className="font-moul text-xs sm:text-sm text-blue-900 dark:text-blue-300 border-b border-slate-100 dark:border-slate-700 pb-2">
                  {item.subtitle}
                </h4>
              )}

              {item.paragraphs && (
                <div className="space-y-2 text-justify leading-relaxed text-slate-700 dark:text-slate-200">
                  {item.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-indent-4">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {item.highlights && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {item.highlights.map((hl, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-2.5 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200/80 dark:border-cyan-800/50"
                    >
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                        {hl.label}
                      </span>
                      <strong className="text-xs sm:text-sm text-cyan-950 dark:text-cyan-200 font-black">
                        {hl.value}
                      </strong>
                    </div>
                  ))}
                </div>
              )}

              {item.bulletPoints && (
                <ul className="space-y-2 pt-1">
                  {item.bulletPoints.map((bp, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
                    >
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold shrink-0 mt-0.5">
                        ❖
                      </span>
                      <span className="font-medium leading-relaxed">{bp}</span>
                    </li>
                  ))}
                </ul>
              )}

              {item.tables && (
                <div className="space-y-2 overflow-x-auto pt-2">
                  {item.tables.map((tbl, tIdx) => (
                    <div key={tIdx} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 font-moul text-slate-900 dark:text-white">
                          <tr>
                            {tbl.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-2.5 border-b border-slate-200 dark:border-slate-700">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-medium">
                          {tbl.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className={rIdx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'}
                            >
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2.5">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {tbl.note && (
                        <p className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-[11px] font-semibold border-t border-amber-200 dark:border-amber-800/50">
                          📌 {tbl.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Section Navigation Buttons (Previous / Next Chapter) */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setActiveSectionId(MOEYS_STATS_GUIDELINE_SECTIONS[currentIndex - 1].id);
                  if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                }
              }}
              disabled={currentIndex === 0}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ជំពូកមុន</span>
            </button>

            <span className="text-xs font-bold text-slate-400">
              {currentIndex + 1} / {MOEYS_STATS_GUIDELINE_SECTIONS.length}
            </span>

            <button
              onClick={() => {
                if (currentIndex < MOEYS_STATS_GUIDELINE_SECTIONS.length - 1) {
                  setActiveSectionId(MOEYS_STATS_GUIDELINE_SECTIONS[currentIndex + 1].id);
                  if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                }
              }}
              disabled={currentIndex === MOEYS_STATS_GUIDELINE_SECTIONS.length - 1}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                currentIndex === MOEYS_STATS_GUIDELINE_SECTIONS.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white active:scale-95 shadow-sm'
              }`}
            >
              <span>ជំពូកបន្ទាប់</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= FOOTER ACTIONS ================= */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 active:scale-95 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ព A4</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 active:scale-95 shadow-2xs"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'បានចម្លង!' : 'ចម្លងសង្ខេប'}</span>
            </button>

            <button
              onClick={handleShareTelegram}
              className="px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs transition flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ផ្ញើចូល Telegram</span>
            </button>
          </div>

          <a
            href={MOEYS_STATS_GUIDELINE_2026_2027_META.systemUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-black text-xs transition shadow-md active:scale-95 flex items-center gap-1.5 border border-cyan-200"
          >
            <Globe className="w-4 h-4 text-slate-950" />
            <span>ចូលប្រព័ន្ធ EMIS Online</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
          </a>
        </div>
      </div>
    </div>
  );
};
