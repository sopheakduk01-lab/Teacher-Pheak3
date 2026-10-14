import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Calendar,
  Search,
  Printer,
  Copy,
  Check,
  Award,
  Sparkles,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building2,
  Info,
  Maximize2,
  Minimize2,
  Bell,
  BellRing,
  Download,
  Share2,
  Bookmark,
  CalendarDays,
  SlidersHorizontal,
  GraduationCap,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Send,
} from 'lucide-react';
import {
  CIVIL_SERVANT_HOLIDAYS_2027,
  CIVIL_SERVANT_HOLIDAYS_2026,
  SUB_DECREE_HOLIDAYS_2027_META,
  CivilServantHoliday,
  getUpcomingHolidayStatus,
  generateCivilServantIcsCalendar,
  UpcomingHolidayStatus,
} from '../data/civilServantHolidays2027';

interface CivilServantHolidaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const CivilServantHolidaysModal: React.FC<CivilServantHolidaysModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'calendar' | 'monthGrid' | 'teacherImpact' | 'subdecree' | 'alerts'>('calendar');
  const [copied, setCopied] = useState(false);
  
  // Fullscreen state: default to true on small devices / mobile for maximum comfortable view
  const [isFullscreen, setIsFullscreen] = useState(true);
  // Font scale mode: 'sm' | 'md' | 'lg'
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg'>('md');
  // Selected month for interactive monthly grid view (1 to 12)
  const [activeMonth, setActiveMonth] = useState<number>(4); // Default to April (Khmer New Year)
  // Teacher reminder preference
  const [reminderDays, setReminderDays] = useState<number>(() => {
    const saved = localStorage.getItem('holiday_reminder_lead_days');
    return saved ? parseInt(saved, 10) : 3; // default 3 days in advance
  });

  const upcoming = useMemo(() => getUpcomingHolidayStatus(), []);

  // Save reminder preference
  const handleSetReminderDays = (days: number) => {
    setReminderDays(days);
    localStorage.setItem('holiday_reminder_lead_days', days.toString());
    if (onShowToast) onShowToast(`បានកំណត់រំលឹកទុកជាមុនចំនួន ${days} ថ្ងៃ!`);
  };

  const filteredHolidays = useMemo(() => {
    return CIVIL_SERVANT_HOLIDAYS_2027.filter((h) => {
      const name = (h.name || h.nameKh || '').toLowerCase();
      const dateKhmer = (h.dateKhmer || h.formattedDateKh || '').toLowerCase();
      const monthName = (h.monthName || '').toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        dateKhmer.includes(search) ||
        monthName.includes(search);

      const matchesCategory =
        selectedCategory === 'all' || h.category === selectedCategory;

      let matchesQuarter = true;
      const m = h.month || 1;
      if (selectedQuarter === 'q1') matchesQuarter = m >= 1 && m <= 3;
      if (selectedQuarter === 'q2') matchesQuarter = m >= 4 && m <= 6;
      if (selectedQuarter === 'q3') matchesQuarter = m >= 7 && m <= 9;
      if (selectedQuarter === 'q4') matchesQuarter = m >= 10 && m <= 12;

      return matchesSearch && matchesCategory && matchesQuarter;
    });
  }, [searchTerm, selectedCategory, selectedQuarter]);

  // Holidays in the currently selected month for monthly grid
  const currentMonthHolidays = useMemo(() => {
    return CIVIL_SERVANT_HOLIDAYS_2027.filter((h) => (h.month || 1) === activeMonth);
  }, [activeMonth]);

  if (!isOpen) return null;

  // Copy to clipboard
  const handleCopySummary = () => {
    const lines = [
      `🇰🇭 ${SUB_DECREE_HOLIDAYS_2027_META.title}`,
      `អនុក្រឹត្យលេខ៖ ${SUB_DECREE_HOLIDAYS_2027_META.number} (${SUB_DECREE_HOLIDAYS_2027_META.signedDateSolar})`,
      `ចុះហត្ថលេខាដោយ៖ ${SUB_DECREE_HOLIDAYS_2027_META.signatory}`,
      `សរុប៖ ${SUB_DECREE_HOLIDAYS_2027_META.totalHolidaysCount} កម្មវិធីបុណ្យ (សម្រាក ${SUB_DECREE_HOLIDAYS_2027_META.totalDaysCount} ថ្ងៃ)`,
      '',
      '--- បញ្ជីថ្ងៃឈប់សម្រាកផ្លូវការ ២០២៧ ---',
      ...CIVIL_SERVANT_HOLIDAYS_2027.map(
        (h) => `${h.order}. ${h.dateKhmer} ៖ ${h.name} (${h.durationLabel})`
      ),
    ].join('\n');

    navigator.clipboard.writeText(lines);
    setCopied(true);
    if (onShowToast) onShowToast('បានចម្លងប្រតិទិនឈប់សម្រាកឆ្នាំ២០២៧ រួចរាល់!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Download .ICS calendar for iPhone / Android
  const handleDownloadIcs = () => {
    const icsData = generateCivilServantIcsCalendar();
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ប្រតិទិនឈប់សម្រាកមន្ត្រីរាជការ២០២៧_អនុក្រឹត្យ១៩៨.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast('បានទាញយកឯកសារប្រតិទិន .ICS! សូមបើកដើម្បីបញ្ចូលក្នុងទូរស័ព្ទ');
    }
  };

  // Share to Telegram
  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `🇰🇭 ប្រតិទិនឈប់សម្រាកការងាររបស់មន្ត្រីរាជការ និយោជិត កម្មករ ប្រចាំឆ្នាំ២០២៧\n(អនុក្រឹត្យលេខ ១៩៨ អនក្រ.បក ចុះថ្ងៃទី១៦ កញ្ញា ២០២៦ របស់សម្តេចធិបតី ហ៊ុន ម៉ាណែត)\n\nសរុប ១៦ កម្មវិធីបុណ្យ (សម្រាក ២២ ថ្ងៃ)\n\nពិនិត្យមើលលម្អិត និងកាលវិភាគបង្រៀននៅក្នុងកម្មវិធីបឋមសិក្សា!`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank');
  };

  // Standard A4 Print
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
          <title>ប្រតិទិនឈប់សម្រាកការងារមន្ត្រីរាជការ និយោជិត កម្មករ ឆ្នាំ២០២៧</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Moul&family=Siemreap&display=swap" rel="stylesheet">
          <style>
            @page { size: A4 portrait; margin: 12mm 15mm; }
            body { font-family: 'Kantumruy Pro', 'Siemreap', sans-serif; color: #1e293b; margin: 0; padding: 0; font-size: 10.5pt; line-height: 1.5; }
            .font-moul { font-family: 'Moul', serif; }
            .header-block { text-align: center; margin-bottom: 16px; }
            .royal-header { font-size: 13pt; line-height: 1.7; }
            .sub-title { font-size: 11.5pt; color: #b91c1c; margin-top: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 9.5pt; }
            th, td { border: 1px solid #94a3b8; padding: 6px 8px; }
            th { background-color: #f1f5f9; text-align: center; }
            .footer-sig { margin-top: 22px; display: flex; justify-content: space-between; page-break-inside: avoid; }
            .sig-col { text-align: center; width: 45%; }
            @media print { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body>
          <div class="header-block">
            <div class="royal-header font-moul">
              ព្រះរាជាណាចក្រកម្ពុជា<br/>ជាតិ សាសនា ព្រះមហាក្សត្រ
            </div>
            <div style="font-size: 9pt; margin-top: 2px;">***</div>
            <div style="text-align: left; font-size: 10pt; margin-top: -12px;">
              <strong>រាជរដ្ឋាភិបាលកម្ពុជា</strong><br/>
              លេខ ៖ <strong>${SUB_DECREE_HOLIDAYS_2027_META.number}</strong>
            </div>
            <div class="sub-title font-moul">
              អនុក្រឹត្យ<br/>
              ស្តីពី ប្រតិទិនឈប់សម្រាកការងាររបស់មន្ត្រីរាជការ និយោជិត កម្មករ ប្រចាំឆ្នាំ២០២៧
            </div>
          </div>

          <p style="text-align: justify; text-indent: 20px; font-size: 10pt; margin: 6px 0;">
            រាជរដ្ឋាភិបាលកម្ពុជា បានសម្រេចអនុញ្ញាតឱ្យមន្ត្រីរាជការ និយោជិត កម្មករ នៃព្រះរាជាណាចក្រកម្ពុជា បានឈប់សម្រាកការងារឆ្នាំ២០២៧ សរុបចំនួន <strong>${SUB_DECREE_HOLIDAYS_2027_META.totalHolidaysCount} លើក</strong> ត្រូវជា <strong>${SUB_DECREE_HOLIDAYS_2027_META.totalDaysCount} ថ្ងៃ</strong> ដូចខាងក្រោម៖
          </p>

          <table>
            <thead>
              <tr>
                <th style="width: 35px;">ល.រ</th>
                <th style="width: 160px;">កាលបរិច្ឆេទ</th>
                <th>កម្មវិធីបុណ្យ និងទិវាជាតិ-អន្តរជាតិ</th>
                <th style="width: 85px;">ចំនួនថ្ងៃ</th>
              </tr>
            </thead>
            <tbody>
              ${CIVIL_SERVANT_HOLIDAYS_2027.map(
                (h, idx) => `
                <tr>
                  <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
                  <td style="font-weight: 600;">${h.dateKhmer}</td>
                  <td>
                    <strong>${h.name}</strong>
                    <div style="font-size: 8pt; color: #64748b;">${h.categoryLabel}</div>
                  </td>
                  <td style="text-align: center; font-weight: bold; color: #b91c1c;">${h.durationLabel}</td>
                </tr>
              `
              ).join('')}
            </tbody>
          </table>

          <div style="margin-top: 12px; font-size: 9.5pt;">
            <p style="margin: 3px 0;"><strong>មាត្រា ២ ៖</strong> ចំពោះក្រសួង ស្ថាប័ន មានភារកិច្ចទំនាក់ទំនងអន្តរជាតិ ត្រូវរក្សាមន្ត្រីប្រចាំការជាអចិន្ត្រៃយ៍ សម្រាប់ដោះស្រាយការងារ។</p>
            <p style="margin: 3px 0;"><strong>មាត្រា ៣ ៖</strong> បទប្បញ្ញត្តិទាំងឡាយណាដែលផ្ទុយនឹងអនុក្រឹត្យនេះ ត្រូវទុកជានិរាករណ៍។</p>
          </div>

          <div class="footer-sig">
            <div class="sig-col" style="text-align: left; font-size: 9pt;">
              <p><strong>កន្លែងទទួល ៖</strong><br/>
              - ក្រសួងព្រះបរមរាជវាំង<br/>
              - អគ្គលេខាធិការដ្ឋានក្រុមប្រឹក្សាធម្មនុញ្ញ<br/>
              - អគ្គលេខាធិការដ្ឋានរដ្ឋសភា / ព្រឹទ្ធសភា<br/>
              - ខុទ្ទកាល័យសម្តេចមហាបវរធិបតីនាយករដ្ឋមន្ត្រី<br/>
              - គ្រប់ក្រសួង ស្ថាប័ន និងរដ្ឋបាលរាជធានី-ខេត្ត<br/>
              - រាជកិច្ច និងឯកសារកាលប្បវត្តិ
              </p>
            </div>
            <div class="sig-col">
              <p style="font-size: 9pt;">${SUB_DECREE_HOLIDAYS_2027_META.signedDateKhmer}<br/>
              ${SUB_DECREE_HOLIDAYS_2027_META.signedDateSolar}</p>
              <p class="font-moul" style="font-size: 10.5pt; margin-top: 4px;">នាយករដ្ឋមន្ត្រី</p>
              <div style="height: 50px;"></div>
              <p class="font-moul" style="font-size: 10.5pt; color: #0f172a;">${SUB_DECREE_HOLIDAYS_2027_META.signatory}</p>
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
        {/* ================= ROYAL HEADER WITH CONTROLS ================= */}
        <div className="relative bg-gradient-to-r from-[#061436] via-[#0A2052] to-[#040C24] text-white p-3.5 sm:p-5 shrink-0 border-b border-amber-400/30">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

          {/* Top Control Bar: Logo, Titles, Buttons */}
          <div className="flex items-start justify-between relative z-10 gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-500 p-[2px] shadow-lg shadow-amber-500/30 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#061436] rounded-[14px] flex items-center justify-center text-amber-300 text-xl font-bold">
                  🇰🇭
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                    អនុក្រឹត្យលេខ {SUB_DECREE_HOLIDAYS_2027_META.number}
                  </span>
                  <span className="text-[9px] text-blue-200 hidden sm:inline-block">
                    រាជរដ្ឋាភិបាលកម្ពុជា
                  </span>
                </div>
                <h2 className="text-sm sm:text-lg font-extrabold font-moul text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 mt-0.5 truncate">
                  ប្រតិទិនឈប់សម្រាកការងារឆ្នាំ២០២៧
                </h2>
                <p className="text-[10px] sm:text-xs text-blue-100/80 font-medium truncate">
                  មន្ត្រីរាជការ និយោជិត កម្មករ • សរុប {SUB_DECREE_HOLIDAYS_2027_META.totalDaysCount} ថ្ងៃ ({SUB_DECREE_HOLIDAYS_2027_META.totalHolidaysCount} កម្មវិធីបុណ្យ)
                </p>
              </div>
            </div>

            {/* Top Right Action Tools */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Font Size Adjuster */}
              <div className="hidden sm:flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10 text-xs">
                <button
                  onClick={() => setFontScale('sm')}
                  className={`px-2 py-1 rounded-lg font-bold transition ${
                    fontScale === 'sm' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200'
                  }`}
                  title="អក្សរតូច"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontScale('md')}
                  className={`px-2 py-1 rounded-lg font-bold transition ${
                    fontScale === 'md' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200'
                  }`}
                  title="អក្សរធម្មតា"
                >
                  A
                </button>
                <button
                  onClick={() => setFontScale('lg')}
                  className={`px-2 py-1 rounded-lg font-bold transition ${
                    fontScale === 'lg' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200'
                  }`}
                  title="អក្សរធំ (ស្រួលមើលលើទូរស័ព្ទ)"
                >
                  A+
                </button>
              </div>

              {/* Fullscreen Toggle Button */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition active:scale-95 border border-white/10 shrink-0"
                title={isFullscreen ? 'បង្រួមទំហំធម្មតា' : 'ពង្រីកពេញអេក្រង់ (Full Screen)'}
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

          {/* 🔔 PROMINENT UPCOMING COUNTDOWN ALERT BANNER (មុខងាររំលឹកថ្ងៃឈប់សម្រាកជិតមកដល់) */}
          {upcoming && upcoming.holiday && (
            <div className="mt-3 relative z-10">
              <div
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all ${
                  upcoming.isToday
                    ? 'bg-gradient-to-r from-red-600/40 via-orange-600/30 to-red-600/40 border-red-400/80 shadow-md'
                    : upcoming.isWithinThreeDays
                    ? 'bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-500/30 border-amber-400/90 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl sm:text-2xl shrink-0">
                      {upcoming.holiday.icon || '🇰🇭'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                          <BellRing className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                          <span>{upcoming.statusLabel}</span>
                        </span>
                        {upcoming.isWithinThreeDays && !upcoming.isToday && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-black text-[9px] uppercase animate-pulse">
                            រំលឹកមុន {upcoming.daysRemaining} ថ្ងៃ!
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-white truncate mt-0.5">
                        {upcoming.holiday.name || upcoming.holiday.nameKh} ({upcoming.holiday.dateKhmer || upcoming.holiday.formattedDateKh})
                      </h4>
                      <p className="text-[10px] sm:text-xs text-blue-100/90 truncate">
                        {upcoming.teacherNote}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedQuarter('all');
                        setSearchTerm(upcoming.holiday?.name || upcoming.holiday?.nameKh || '');
                        setActiveTab('calendar');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] sm:text-xs transition active:scale-95 shadow-sm"
                    >
                      មើលព័ត៌មាន
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs (Mobile-Friendly Horizontal Scroll) */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/10 overflow-x-auto no-scrollbar text-xs font-bold">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/15 text-white/90'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>បញ្ជីថ្ងៃបុណ្យ ({CIVIL_SERVANT_HOLIDAYS_2027.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('monthGrid')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
                activeTab === 'monthGrid'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/15 text-white/90'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>ប្រតិទិនប្រចាំខែ (១២ ខែ)</span>
            </button>

            <button
              onClick={() => setActiveTab('teacherImpact')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
                activeTab === 'teacherImpact'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/15 text-white/90'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>ផលប៉ះពាល់ម៉ោងបង្រៀន & កិច្ចតែងការ</span>
            </button>

            <button
              onClick={() => setActiveTab('subdecree')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
                activeTab === 'subdecree'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/15 text-white/90'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ខ្លឹមសារអនុក្រឹត្យ & ហត្ថលេខា</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/15 text-white/90'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>ការកំណត់រំលឹក & ដាក់ចូលប្រតិទិន</span>
            </button>
          </div>
        </div>

        {/* ================= CONTENT BODY ================= */}
        <div className={`flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 ${getFontScaleClass()}`}>
          {/* TAB 1: LIST OF HOLIDAYS */}
          {activeTab === 'calendar' && (
            <>
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ស្វែងរកតាមឈ្មោះពិធីបុណ្យ ខែ ឬកាលបរិច្ឆេទ..."
                    className="w-full pl-9.5 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  {[
                    { id: 'all', label: 'ទាំងអស់' },
                    { id: 'traditional', label: 'ប្រពៃណី' },
                    { id: 'royal', label: 'ព្រះរាជពិធី' },
                    { id: 'national', label: 'បុណ្យជាតិ' },
                    { id: 'international', label: 'អន្តរជាតិ' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition text-xs ${
                        selectedCategory === cat.id
                          ? 'bg-blue-900 text-white shadow-xs dark:bg-blue-600'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quarter Filter Chips */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar pb-1">
                <span className="font-bold shrink-0">ត្រីមាស ៖</span>
                {[
                  { id: 'all', label: 'ពេញមួយឆ្នាំ' },
                  { id: 'q1', label: 'ត្រីមាសទី ១ (មករា-មីនា)' },
                  { id: 'q2', label: 'ត្រីមាសទី ២ (មេសា-មិថុនា)' },
                  { id: 'q3', label: 'ត្រីមាសទី ៣ (កក្កដា-កញ្ញា)' },
                  { id: 'q4', label: 'ត្រីមាសទី ៤ (តុលា-ធ្នូ)' },
                ].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuarter(q.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition shrink-0 text-xs ${
                      selectedQuarter === q.id
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Holiday Cards Grid (Responsive 1-col on mobile, 2-col on desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredHolidays.map((holiday) => (
                  <div
                    key={holiday.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      holiday.highlight
                        ? 'bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 dark:from-amber-950/25 dark:via-slate-900 dark:to-orange-950/15 border-amber-300 dark:border-amber-600/70 shadow-sm'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300/60 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                        {holiday.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="font-black font-moul text-blue-900 dark:text-blue-300 text-xs sm:text-sm">
                            {holiday.order}. {holiday.dateKhmer}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-black text-[10px] sm:text-xs shadow-2xs ${
                              holiday.daysCount > 1
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300'
                            }`}
                          >
                            {holiday.durationLabel}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                          {holiday.name}
                        </h4>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/80 px-2 py-0.5 rounded font-medium">
                            {holiday.categoryLabel}
                          </span>
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                            ខែ{holiday.monthName}
                          </span>
                          {holiday.daysCount >= 3 && (
                            <span className="text-[10px] text-red-600 dark:text-red-400 font-bold flex items-center gap-0.5">
                              <span>🔥 សម្រាក ៣ ថ្ងៃជាប់គ្នា</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredHolidays.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Calendar className="w-12 h-12 mx-auto opacity-30 mb-2" />
                  <p className="font-bold">មិនមានទិន្នន័យឈប់សម្រាកត្រូវនឹងការស្វែងរកនេះទេ</p>
                </div>
              )}
            </>
          )}

          {/* TAB 2: INTERACTIVE MONTHLY CALENDAR GRID */}
          {activeTab === 'monthGrid' && (
            <div className="space-y-4">
              {/* Month selector buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { m: 1, name: 'មករា', count: 2 },
                  { m: 2, name: 'កុម្ភៈ', count: 0 },
                  { m: 3, name: 'មីនា', count: 1 },
                  { m: 4, name: 'មេសា', count: 3 },
                  { m: 5, name: 'ឧសភា', count: 4 },
                  { m: 6, name: 'មិថុនា', count: 1 },
                  { m: 7, name: 'កក្កដា', count: 0 },
                  { m: 8, name: 'សីហា', count: 0 },
                  { m: 9, name: 'កញ្ញា', count: 3 },
                  { m: 10, name: 'តុលា', count: 3 },
                  { m: 11, name: 'វិច្ឆិកា', count: 4 },
                  { m: 12, name: 'ធ្នូ', count: 1 },
                ].map((item) => (
                  <button
                    key={item.m}
                    onClick={() => setActiveMonth(item.m)}
                    className={`px-3 py-2 rounded-xl shrink-0 transition text-center flex flex-col items-center ${
                      activeMonth === item.m
                        ? 'bg-blue-900 text-white font-black shadow-md dark:bg-blue-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <span className="font-moul text-xs">ខែ{item.name}</span>
                    <span
                      className={`text-[9px] mt-0.5 px-1.5 py-0.2 rounded-full ${
                        item.count > 0
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'opacity-50'
                      }`}
                    >
                      {item.count > 0 ? `${item.count} ថ្ងៃ` : '-'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Monthly Focus Display */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/30 dark:from-slate-800/60 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <h3 className="font-moul text-sm sm:text-base text-blue-900 dark:text-blue-300">
                      កម្មវិធីឈប់សម្រាកក្នុង ខែ{['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'][activeMonth - 1]} ឆ្នាំ២០២៧
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      សរុបមាន {currentMonthHolidays.length > 0 ? `${currentMonthHolidays.reduce((acc, h) => acc + h.daysCount, 0)} ថ្ងៃសម្រាកផ្លូវការ` : 'គ្មានថ្ងៃឈប់សម្រាកក្នុងខែនេះទេ'}
                    </p>
                  </div>
                </div>

                {currentMonthHolidays.length > 0 ? (
                  <div className="space-y-3 pt-3">
                    {currentMonthHolidays.map((holiday) => (
                      <div
                        key={holiday.id}
                        className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-300/80 dark:border-amber-700/60 shadow-xs flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{holiday.icon}</span>
                          <div>
                            <span className="text-xs font-bold text-blue-900 dark:text-blue-300 font-moul">
                              {holiday.dateKhmer}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                              {holiday.name}
                            </h4>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 inline-block bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              {holiday.categoryLabel}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 font-black text-xs shrink-0">
                          {holiday.durationLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400">
                    <p className="font-medium text-xs">
                      នៅក្នុងខែនេះ មិនមានថ្ងៃឈប់សម្រាកការងារផ្លូវការឡើយ។ ដំណើរការបង្រៀនប្រព្រឹត្តទៅធម្មតា។
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TEACHER IMPACT & LESSON PLAN GUIDE */}
          {activeTab === 'teacherImpact' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
                  <h3 className="font-moul text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                    ការណែនាំរៀបចំផែនការបង្រៀន & ម៉ោងសង សម្រាប់លោកគ្រូអ្នកគ្រូ
                  </h3>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-300 mt-1 leading-relaxed">
                  ដើម្បីធានាការបង្រៀនគ្រប់ ៣៨ សប្តាហ៍តាមកម្មវិធីសិក្សាជាតិរបស់ក្រសួងអប់រំ យុវជន និងកីឡា លោកគ្រូអ្នកគ្រូត្រូវកត់សម្គាល់ថ្ងៃឈប់សម្រាកសំខាន់ៗដែលប៉ះពាល់លើម៉ោងបង្រៀន ៖
                </p>
              </div>

              {/* Major 3-day holidays alert */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🇰🇭</span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                      សម្រាក ៣ ថ្ងៃ
                    </span>
                  </div>
                  <h4 className="font-moul text-xs text-slate-900 dark:text-white">
                    ចូលឆ្នាំថ្មីប្រពៃណីជាតិ
                  </h4>
                  <p className="text-[11px] text-slate-500">១៤-១៥-១៦ ខែមេសា ២០២៧</p>
                  <p className="text-[10px] text-blue-900 dark:text-blue-300 font-semibold pt-1 border-t border-slate-100 dark:border-slate-700">
                    📌 ត្រៀម៖ ត្រូវផ្ញើកិច្ចការផ្ទះ ឬលំហាត់សង្ខេបមុនថ្ងៃឈប់សម្រាក និងពិនិត្យការប្រឡងឆមាសទី ១។
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🌾</span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                      សម្រាក ៣ ថ្ងៃ
                    </span>
                  </div>
                  <h4 className="font-moul text-xs text-slate-900 dark:text-white">
                    ពិធីបុណ្យភ្ជុំបិណ្ឌ
                  </h4>
                  <p className="text-[11px] text-slate-500">២៩-៣០ កញ្ញា & ០១ តុលា ២០២៧</p>
                  <p className="text-[10px] text-blue-900 dark:text-blue-300 font-semibold pt-1 border-t border-slate-100 dark:border-slate-700">
                    📌 ត្រៀម៖ រៀបចំកាលវិភាគបង្រៀនសងចំពោះថ្នាក់ដែលមានម៉ោងក្នុងថ្ងៃពុធ ព្រហស្បតិ៍ និងសុក្រ។
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🚣</span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                      សម្រាក ៣ ថ្ងៃ
                    </span>
                  </div>
                  <h4 className="font-moul text-xs text-slate-900 dark:text-white">
                    ព្រះរាជពិធីបុណ្យអុំទូក
                  </h4>
                  <p className="text-[11px] text-slate-500">២២-២៣-២៤ ខែវិច្ឆិកា ២០២៧</p>
                  <p className="text-[10px] text-blue-900 dark:text-blue-300 font-semibold pt-1 border-t border-slate-100 dark:border-slate-700">
                    📌 ត្រៀម៖ សម្រាក ៣ ថ្ងៃ (ចន្ទ អង្គារ ពុធ) ត្រូវកំណត់ផែនការបង្រៀនបន្ថែមមុនចូលវិស្សមកាល។
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIAL SUB-DECREE & SIGNATURES */}
          {activeTab === 'subdecree' && (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 leading-relaxed">
              <div className="text-center space-y-1 pb-4 border-b border-slate-200 dark:border-slate-700">
                <p className="font-moul text-sm sm:text-base text-blue-950 dark:text-blue-200">
                  ព្រះរាជាណាចក្រកម្ពុជា<br/>ជាតិ សាសនា ព្រះមហាក្សត្រ
                </p>
                <div className="flex justify-between items-start text-xs pt-3 text-left">
                  <div>
                    <strong className="block text-slate-800 dark:text-slate-200 font-bold">រាជរដ្ឋាភិបាលកម្ពុជា</strong>
                    <span className="text-slate-600 dark:text-slate-400">លេខ ៖ {SUB_DECREE_HOLIDAYS_2027_META.number}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">{SUB_DECREE_HOLIDAYS_2027_META.signedDateKhmer}</span>
                    <span className="block font-medium text-slate-700 dark:text-slate-300">{SUB_DECREE_HOLIDAYS_2027_META.signedDateSolar}</span>
                  </div>
                </div>
              </div>

              <div className="text-center py-2">
                <h3 className="font-moul text-sm sm:text-base text-red-700 dark:text-red-400">
                  អនុក្រឹត្យ<br/>
                  ស្តីពី ប្រតិទិនឈប់សម្រាកការងាររបស់មន្ត្រីរាជការ និយោជិត កម្មករ ប្រចាំឆ្នាំ២០២៧
                </h3>
              </div>

              <div className="space-y-3 pt-2">
                {SUB_DECREE_HOLIDAYS_2027_META.articles.map((art, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <strong className="text-blue-900 dark:text-blue-300 font-bold block mb-1 font-moul text-xs">
                      {art.articleNumber}
                    </strong>
                    <p className="text-slate-700 dark:text-slate-300 text-justify text-xs sm:text-sm">
                      {art.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <strong className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 font-moul">
                    កន្លែងទទួល ៖
                  </strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
                    {SUB_DECREE_HOLIDAYS_2027_META.recipients.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-center flex flex-col justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-500">{SUB_DECREE_HOLIDAYS_2027_META.signedDateSolar}</p>
                    <p className="font-moul text-xs sm:text-sm text-blue-950 dark:text-blue-200">
                      {SUB_DECREE_HOLIDAYS_2027_META.signatoryTitle}
                    </p>
                  </div>
                  <div className="py-4">
                    <span className="inline-block px-3 py-1 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-300/60 rounded-full font-bold text-[10px]">
                      [ ព្រះរាជត្រា & ហត្ថលេខាផ្លូវការ ]
                    </span>
                  </div>
                  <p className="font-moul text-xs sm:text-sm text-slate-900 dark:text-white font-bold">
                    {SUB_DECREE_HOLIDAYS_2027_META.signatory}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SMART REMINDERS & PHONE SYNC */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {/* Reminder lead days config */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-moul text-xs sm:text-sm text-slate-900 dark:text-white">
                      កំណត់ការជូនដំណឹងរំលឹកទុកជាមុន (Smart Advance Reminder)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ប្រព័ន្ធនឹងបង្ហាញផ្ទាំងរំលឹកពណ៌មាស/ក្រហមនៅលើផ្ទាំងដើមមុនពេលដល់ថ្ងៃឈប់សម្រាក ៖
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {[
                    { days: 1, label: 'មុន ១ ថ្ងៃ (ថ្ងៃស្អែក)' },
                    { days: 2, label: 'មុន ២ ថ្ងៃ' },
                    { days: 3, label: 'មុន ៣ ថ្ងៃ (ស្តង់ដារ)', recommended: true },
                    { days: 7, label: 'មុន ១ សប្តាហ៍' },
                  ].map((opt) => (
                    <button
                      key={opt.days}
                      onClick={() => handleSetReminderDays(opt.days)}
                      className={`p-3 rounded-xl border text-center transition ${
                        reminderDays === opt.days
                          ? 'bg-amber-400 text-slate-950 border-amber-500 font-black shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <span className="block text-sm font-moul">{opt.days} ថ្ងៃ</span>
                      <span className="block text-[10px] opacity-80 mt-0.5">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to phone calendar (.ICS) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-blue-500/30 text-blue-200 rounded-full font-bold text-[10px] border border-blue-400/40">
                      iPhone & Android Google Calendar
                    </span>
                    <h4 className="font-moul text-sm sm:text-base text-amber-300">
                      ទាញយកប្រតិទិនឈប់សម្រាក ២០២៧ ដាក់ចូលទូរស័ព្ទដៃ
                    </h4>
                    <p className="text-xs text-blue-100/80 leading-relaxed max-w-xl">
                      ទាញយកឯកសារស្តង់ដារ iCalendar (.ICS) ដើម្បីធ្វើសមកាលកម្មជាមួយប្រតិទិនទូរស័ព្ទដៃរបស់អ្នក។ ទូរស័ព្ទនឹងរោទ៍រំលឹកដោយស្វ័យប្រវត្តិនូវរាល់ថ្ងៃឈប់សម្រាកទាំង ១៦ លើក!
                    </p>
                  </div>
                  <Calendar className="w-10 h-10 text-amber-300 opacity-60 shrink-0" />
                </div>

                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleDownloadIcs}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 rounded-xl font-black text-xs shadow-md transition active:scale-95 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>ទាញយកឯកសារប្រតិទិន (.ICS)</span>
                  </button>

                  <button
                    onClick={handleShareTelegram}
                    className="px-4 py-2.5 bg-white/15 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-2 border border-white/20"
                  >
                    <Send className="w-4 h-4 text-blue-300" />
                    <span>ផ្ញើចូល Telegram ក្រុមសាលា</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= MODAL FOOTER ACTIONS ================= */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopySummary}
              className="px-3 py-2 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 shadow-2xs active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'បានចម្លង!' : 'ចម្លងបញ្ជី'}</span>
            </button>

            <button
              onClick={handleDownloadIcs}
              className="px-3 py-2 bg-white dark:bg-slate-700 hover:bg-slate-100 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-blue-200 dark:border-slate-600 shadow-2xs active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>ដាក់ចូលប្រតិទិន (.ics)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 shadow-2xs active:scale-95"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>បោះពុម្ព A4 / PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-xs"
          >
            បិទផ្ទាំង
          </button>
        </div>
      </div>
    </div>
  );
};
