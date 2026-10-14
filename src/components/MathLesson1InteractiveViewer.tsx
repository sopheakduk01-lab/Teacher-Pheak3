import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Sparkles,
  HelpCircle,
  Trophy,
  Volume2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Printer,
  ChevronRight,
  ChevronLeft,
  Layers,
  Sliders,
  Scale,
  Target,
  FileText,
  Lightbulb,
  Award,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Play,
  Check,
  Compass,
  GraduationCap,
  Eye,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toKhmerNum } from '../utils/khmerDate';
import { MathLesson1ExamModal } from './MathLesson1ExamModal';
import { MathInteractiveLessonViewer } from './MathInteractiveLessonViewer';

interface MathLesson1InteractiveViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  initialLessonNumber?: number;
}

type TabType = 'reading' | 'place_value' | 'comparison' | 'rounding' | 'exercises';

export const MathLesson1InteractiveViewer: React.FC<MathLesson1InteractiveViewerProps> = ({
  isOpen,
  onClose,
  onShowToast,
  initialLessonNumber = 1,
}) => {
  if (initialLessonNumber && initialLessonNumber > 1) {
    return (
      <MathInteractiveLessonViewer
        isOpen={isOpen}
        onClose={onClose}
        onShowToast={onShowToast}
        initialLessonNumber={initialLessonNumber}
      />
    );
  }
  const [activeTab, setActiveTab] = useState<TabType>('reading');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'huge'>('normal');
  const [isExamModalOpen, setIsExamModalOpen] = useState<boolean>(false);

  // --- SECTION 1: READING & WRITING NUMBERS STATE ---
  const [customNumberInput, setCustomNumberInput] = useState<string>('870465250');
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // --- SECTION 2: SPIKE ABACUS STATE ---
  // [លាន, សែន, ម៉ឺន, ពាន់, រយ, ដប់, រាយ]
  const [abacusDigits, setAbacusDigits] = useState<number[]>([3, 0, 2, 4, 1, 0, 3]);

  // --- SECTION 3: COMPARISON & ORDERING STATE ---
  const [orderMode, setOrderMode] = useState<'asc' | 'desc'>('asc');
  const [compareNum1, setCompareNum1] = useState<string>('3256401');
  const [compareNum2, setCompareNum2] = useState<string>('3257250');

  // --- SECTION 4: ROUNDING STATE ---
  const [roundingTarget, setRoundingTarget] = useState<'2782150' | '5623501' | 'slider'>('2782150');
  const [interactiveSliderVal, setInteractiveSliderVal] = useState<number>(2782150);

  // --- SECTION 5: EXERCISE CHECKER STATE ---
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});

  // Keyboard navigation for page flip
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextTab();
      } else if (e.key === 'ArrowLeft') {
        goToPrevTab();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, isFullscreen]);

  if (!isOpen) return null;

  const TABS_CONFIG: { id: TabType; page: string; title: string; subtitle: string; icon: any; color: string }[] = [
    {
      id: 'reading',
      page: 'ទំព័រ ៦',
      title: '១. អំណាន & សំណេរ',
      subtitle: 'ថ្នាក់ និងខ្ទង់',
      icon: BookOpen,
      color: 'from-purple-600 to-indigo-600',
    },
    {
      id: 'place_value',
      page: 'ទំព័រ ៧',
      title: '២. ខ្ទង់ & ក្បាច់រាប់',
      subtitle: 'តម្លៃលេខ & ពង្រាយ',
      icon: Layers,
      color: 'from-blue-600 to-teal-600',
    },
    {
      id: 'comparison',
      page: 'ទំព័រ ៨',
      title: '៣. ប្រៀបធៀប & លំដាប់',
      subtitle: 'ធំជាង តូចជាង លំដាប់',
      icon: Scale,
      color: 'from-teal-600 to-emerald-600',
    },
    {
      id: 'rounding',
      page: 'ទំព័រ ៩',
      title: '៤. ការបង្គត់ចំនួន',
      subtitle: 'បន្ទាត់ចំនួន & ក្បួនមាស',
      icon: Target,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'exercises',
      page: 'ទំព័រ ៦-៩',
      title: '៥. លំហាត់ & កំណែ',
      subtitle: 'អនុវត្ត និងដំណោះស្រាយ',
      icon: Award,
      color: 'from-rose-500 to-purple-600',
    },
  ];

  const currentTabIndex = TABS_CONFIG.findIndex((t) => t.id === activeTab);

  const goToNextTab = () => {
    if (currentTabIndex < TABS_CONFIG.length - 1) {
      setActiveTab(TABS_CONFIG[currentTabIndex + 1].id);
    }
  };

  const goToPrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS_CONFIG[currentTabIndex - 1].id);
    }
  };

  // Sound TTS helper with audio waveform feedback
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingText) {
        window.speechSynthesis.cancel();
        setSpeakingText(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'km-KH';
      utterance.rate = 0.85;
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      setSpeakingText(text);
      window.speechSynthesis.speak(utterance);
    } else {
      onShowToast?.('ឧបករណ៍របស់អ្នកមិនគាំទ្រសំឡេងអានទេ');
    }
  };

  // Helper to format number with spaces: 870465250 -> "870 465 250"
  const formatNumberWithSpaces = (numStr: string | number): string => {
    const clean = numStr.toString().replace(/\D/g, '');
    if (!clean) return '0';
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Split number into place values for place-value table
  const parsePlaceValues = (numStr: string) => {
    const clean = numStr.replace(/\D/g, '');
    const padded = clean.padStart(9, ' ');
    const chars = padded.slice(-9).split('');
    return {
      billions: clean.length > 9 ? clean.slice(0, clean.length - 9) : '',
      millionsPeriod: {
        hundredMillions: chars[0] === ' ' ? '' : chars[0],
        tenMillions: chars[1] === ' ' ? '' : chars[1],
        millions: chars[2] === ' ' ? '' : chars[2],
      },
      thousandsPeriod: {
        hundredThousands: chars[3] === ' ' ? '' : chars[3], // សែន
        tenThousands: chars[4] === ' ' ? '' : chars[4],     // ម៉ឺន
        thousands: chars[5] === ' ' ? '' : chars[5],        // ពាន់
      },
      unitsPeriod: {
        hundreds: chars[6] === ' ' ? '' : chars[6],         // រយ
        tens: chars[7] === ' ' ? '' : chars[7],             // ដប់
        ones: chars[8] === ' ' ? '' : chars[8],             // រាយ
      },
    };
  };

  // Calculate current abacus total number
  const abacusNumber = abacusDigits.reduce((acc, digit, idx) => {
    const multipliers = [1000000, 100000, 10000, 1000, 100, 10, 1];
    return acc + digit * multipliers[idx];
  }, 0);

  const updateAbacusDigit = (index: number, delta: number) => {
    setAbacusDigits((prev) => {
      const next = [...prev];
      const newVal = Math.max(0, Math.min(9, next[index] + delta));
      next[index] = newVal;
      return next;
    });
  };

  const toggleSolution = (key: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCheckAnswer = (key: string, expected: string) => {
    const userVal = (exerciseAnswers[key] || '').trim().replace(/\s+/g, '');
    const cleanExpected = expected.trim().replace(/\s+/g, '');
    const isCorrect = userVal === cleanExpected || userVal.includes(cleanExpected);

    setCheckedAnswers((prev) => ({
      ...prev,
      [key]: isCorrect,
    }));

    if (isCorrect) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
      onShowToast?.('ចម្លើយត្រឹមត្រូវ! ពូកែណាស់ 👏');
    } else {
      onShowToast?.('សូមពិនិត្យមើលចម្លើយឡើងវិញ ឬចុចមើលកំណែ');
    }
  };

  // Printable A4 worksheet with strictly pure white background
  const handlePrintWorksheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="utf-8" />
        <title>សន្លឹកមេរៀន និងលំហាត់_គណិតវិទ្យា_ថ្នាក់ទី៦_មេរៀនទី១_ចំនួន</title>
        <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Moul&family=Koulen&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 portrait; margin: 8mm 10mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { font-family: 'Battambang', sans-serif; background: #ffffff !important; background-color: #ffffff !important; background-image: none !important; color: #0f172a; margin: 0; padding: 0; font-size: 9.5pt; line-height: 1.35; }
          .font-moul { font-family: 'Moul', cursive; }
          .font-koulen { font-family: 'Koulen', sans-serif; }
          .center { text-align: center; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-bottom: 10px; }
          .title { font-size: 13pt; color: #1e1b4b; margin: 4px 0; }
          .subtitle { font-size: 9pt; color: #475569; }
          table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 9pt; }
          th, td { border: 1px solid #334155; padding: 4px 6px; text-align: center; }
          th { background: #f8fafc !important; font-weight: bold; }
          .section-title { font-weight: bold; color: #1e1b4b; margin-top: 12px; margin-bottom: 4px; font-size: 10.5pt; border-left: 3px solid #4338ca; padding-left: 6px; }
          .box { border: 1px solid #cbd5e1; padding: 8px; border-radius: 6px; margin-bottom: 8px; background: #ffffff; }
          .line { height: 16px; border-bottom: 1px dotted #94a3b8; margin: 6px 0; }
          .no-print { display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 10px; }
          @media print { .no-print { display: none !important; } }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()" style="padding: 8px 16px; background: #4338ca; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">🖨️ បោះពុម្ព (Print)</button>
          <button onclick="window.close()" style="padding: 8px 16px; background: #64748b; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">បិទ</button>
        </div>

        <div class="header center">
          <div class="font-moul" style="font-size: 11pt;">ព្រះរាជាណាចក្រកម្ពុជា</div>
          <div class="font-moul" style="font-size: 9.5pt;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          <div style="font-size: 8pt; margin: 2px 0;">— ༺ ៚ ༻ —</div>
          <div class="title font-moul">សន្លឹកកិច្ចការសិស្ស ៖ មេរៀនទី១ «ចំនួន»</div>
          <div class="subtitle">គណិតវិទ្យា ថ្នាក់ទី៦ &bull; កម្មវិធីសិក្សាគោលក្រសួងអប់រំ យុវជន និងកីឡា (ទំព័រ ៦-៩)</div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 9pt; margin-bottom: 8px; font-weight: bold;">
          <div>ឈ្មោះសិស្ស ៖ ................................................................</div>
          <div>ភេទ ៖ ..........</div>
          <div>លេខតុ ៖ ..........</div>
          <div>ពិន្ទុ ៖ ......... / ១០</div>
        </div>

        <div class="section-title">១. អំណាន និងសំណេរចំនួន (Reading & Writing Numbers)</div>
        <div class="box">
          <p><strong>ឧទាហរណ៍ ៖</strong> ចំនួន <strong>870 465 250</strong> (អានតាមថ្នាក់ ៖ ប្រាំបីរយចិតសិបលាន បួនរយហុកសិបប្រាំពាន់ ពីររយហាសិប)</p>
          <table>
            <tr>
              <th colspan="3" style="background:#f1f5f9;">ថ្នាក់លាន</th>
              <th colspan="3" style="background:#f1f5f9;">ថ្នាក់ពាន់</th>
              <th colspan="3" style="background:#f1f5f9;">ថ្នាក់ឯកតា</th>
            </tr>
            <tr>
              <td>រយលាន</td><td>ដប់លាន</td><td>លាន</td>
              <td>សែន</td><td>ម៉ឺន</td><td>ពាន់</td>
              <td>រយ</td><td>ដប់</td><td>រាយ</td>
            </tr>
            <tr style="font-weight: bold; font-size: 10.5pt;">
              <td>8</td><td>7</td><td>0</td>
              <td>4</td><td>6</td><td>5</td>
              <td>2</td><td>5</td><td>0</td>
            </tr>
          </table>
          <p><strong>លំហាត់អនុវត្ត ៖</strong> ចូរអាន និងសរសេរជាពាក្យតាមថ្នាក់នូវចំនួនខាងក្រោម ៖</p>
          <p>ក. 125 243 102 ៖ <span class="line"></span></p>
          <p>ខ. 248 180 035 ៖ <span class="line"></span></p>
          <p>គ. 405 276 930 ៖ <span class="line"></span></p>
        </div>

        <div class="section-title">២. ខ្ទង់ និងតម្លៃលេខតាមខ្ទង់ (Place Values & Digit Values)</div>
        <div class="box">
          <p><strong>លំហាត់ ៖</strong> ចំនួន <strong>80 250 346</strong> ៖</p>
          <p>&bull; លេខ 8 នៅខ្ទង់ដប់លាន មានតម្លៃ ៖ .............................................................</p>
          <p>&bull; លេខ 0 នៅខ្ទង់លាន មានតម្លៃ ៖ .............................................................</p>
          <p>&bull; លេខ 5 នៅខ្ទង់ម៉ឺន មានតម្លៃ ៖ .............................................................</p>
          <p><strong>សរសេរជាទម្រង់ពង្រាយ ៖</strong> 15 721 540 = .....................................................................................................</p>
        </div>

        <div class="section-title">៣. ការប្រៀបធៀប និងរៀបលំដាប់ចំនួន (Comparing & Ordering)</div>
        <div class="box">
          <p><strong>ក. ចូរប្រៀបធៀបដោយប្រើសញ្ញា &gt; , &lt; ឬ = ៖</strong></p>
          <div style="display:flex; justify-content: space-around; margin: 4px 0;">
            <span>5 420 350 [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] 4 520 265</span>
            <span>7 963 250 [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] 7 959 870</span>
          </div>
          <p><strong>ខ. រៀបលំដាប់ពីតូចទៅធំ ៖</strong> [ 3 303 003 ] ; [ 3 300 033 ] ; [ 3 033 003 ] ; [ 3 300 303 ]</p>
          <div class="line"></div>
        </div>

        <div class="section-title">៤. ការបង្គត់ចំនួន (Rounding Numbers)</div>
        <div class="box">
          <p><strong>ក្បួនបង្គត់ ៖</strong> មើលខ្ទង់បន្ទាប់ខាងស្តាំ &bull; បើជា 0, 1, 2, 3, 4 <strong>បង្គត់ចុះ</strong> &bull; បើជា 5, 6, 7, 8, 9 <strong>បង្គត់ឡើង</strong></p>
          <p>១. បង្គត់ត្រឹម <strong>ខ្ទង់លាន</strong> ៖ 2 368 210 ➜ .............................. ; 6 871 955 ➜ ..............................</p>
          <p>២. ប្រទេសកម្ពុជាមានប្រជាជន <strong>13 395 682</strong> នាក់ ។ បង្គត់ត្រឹមខ្ទង់លាន ៖ ........................................ នាក់</p>
          <p>៣. ប្រទេសកម្ពុជាមានផ្ទៃដី <strong>181 035</strong> km² ។ បង្គត់ត្រឹមខ្ទង់ម៉ឺន ៖ .................................................... km²</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 350);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const parsed = parsePlaceValues(customNumberInput);

  // Dynamic Scale Typography classes
  const fontScaleClass = fontScale === 'huge' ? 'text-lg' : fontScale === 'large' ? 'text-base' : 'text-sm';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 no-print ${
        isFullscreen
          ? 'p-0 bg-slate-950'
          : 'p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className={`bg-slate-50 flex flex-col shadow-2xl border border-slate-300 overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-screen h-screen rounded-none'
            : 'max-w-6xl w-full max-h-[94vh] rounded-[32px]'
        }`}
      >
        {/* ======================================================== */}
        {/* 1. CINEMA-GRADE DIGITAL CLASSROOM HEADER                  */}
        {/* ======================================================== */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-emerald-950 text-white flex items-center justify-between border-b border-indigo-500/30 shrink-0 shadow-lg">
          {/* Background Decorative Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-24 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-16 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left Brand / Topic Info */}
          <div className="flex items-center gap-3.5 sm:gap-4 relative z-10">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-2xl shrink-0 border border-amber-200">
                📐
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-900 shadow-xs">
                ៦
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-amber-400 text-slate-950 tracking-wide uppercase shadow-xs">
                  គណិតវិទ្យា ថ្នាក់ទី៦
                </span>
                <span className="text-xs text-emerald-300 font-bold hidden md:flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  កម្មវិធីសិក្សាគោលក្រសួងអប់រំ យុវជន និងកីឡា
                </span>
                <span className="text-xs text-indigo-300 font-bold hidden sm:inline">
                  &bull; ទំព័រ ៦ - ៩
                </span>
              </div>

              <h2 className="text-base sm:text-2xl font-bold font-moul mt-1 text-white leading-tight flex items-center gap-2">
                <span>មេរៀនទី១ ៖ ចំនួន (Numbers)</span>
                <span className="text-amber-400 text-xs sm:text-sm font-sans font-extrabold hidden lg:inline">
                  — ༺ ៚ ༻ —
                </span>
              </h2>
            </div>
          </div>

          {/* Right Controls: Font Scale, Sound, Fullscreen, Print, Close */}
          <div className="flex items-center gap-2 relative z-10">
            {/* Font Scale Selector */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15">
              <button
                onClick={() => setFontScale('normal')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                  fontScale === 'normal' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="ទំហំអក្សរធម្មតា"
              >
                A
              </button>
              <button
                onClick={() => setFontScale('large')}
                className={`px-2 py-1 rounded-lg text-xs font-black transition ${
                  fontScale === 'large' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="ទំហំអក្សរធំ"
              >
                A+
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrintWorksheet}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/15 shadow-xs cursor-pointer active:scale-95"
              title="បោះពុម្ពសន្លឹកមេរៀន & លំហាត់ A4"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span className="hidden xl:inline">បោះពុម្ព A4</span>
            </button>

            {/* Fullscreen Mode Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition border border-white/15 cursor-pointer active:scale-95"
              title={isFullscreen ? 'ចាកចេញពីអេក្រង់ពេញ' : 'ពង្រីកពេញអេក្រង់ (Theater Mode)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-300" /> : <Maximize2 className="w-4 h-4 text-amber-300" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white flex items-center justify-center transition cursor-pointer active:scale-95 border border-white/15"
              title="បិទផ្ទាំងមេរៀន"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. REFINED SUB-TOPIC NAVIGATOR & PAGE RIBBON              */}
        {/* ======================================================== */}
        <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0 shadow-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {TABS_CONFIG.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-400/50'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-slate-700'}`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  
                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="font-moul text-xs">{tab.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-sans font-bold ${
                        isActive ? 'bg-emerald-950/60 text-emerald-200' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {tab.page}
                      </span>
                    </div>
                    <span className="text-[10px] font-normal text-slate-300 block truncate max-w-[120px]">
                      {tab.subtitle}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-400 rounded-full"
                    />
                  )}
                </button>
              );
            })}
            {/* 40-Question QCM Exam Trigger Button */}
            <button
              onClick={() => setIsExamModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-md transition-all cursor-pointer active:scale-95 border border-amber-300/40 shrink-0 ml-1"
              title="បើកវិញ្ញាសា QCM ៤០ សំណួរ"
            >
              <Award className="w-4 h-4 text-amber-200" />
              <span>📝 វិញ្ញាសា QCM ៤០ សំណួរ</span>
            </button>
          </div>

          {/* Quick Page Prev/Next Steppers */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-800">
            <button
              onClick={goToPrevTab}
              disabled={currentTabIndex === 0}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition text-xs flex items-center gap-1 font-bold"
              title="ទំព័រមុន (Arrow Left)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-bold px-1 font-mono">
              {currentTabIndex + 1} / {TABS_CONFIG.length}
            </span>
            <button
              onClick={goToNextTab}
              disabled={currentTabIndex === TABS_CONFIG.length - 1}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition text-xs flex items-center gap-1 font-bold"
              title="ទំព័របន្ទាប់ (Arrow Right)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. MAIN INTERACTIVE CONTENT AREA                          */}
        {/* ======================================================== */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 ${fontScaleClass}`}>

          {/* ======================================================== */}
          {/* TAB 1: អំណាន និងសំណេរចំនួន (Reading & Writing Numbers)    */}
          {/* ======================================================== */}
          {activeTab === 'reading' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Pedagogical Header Card */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-purple-500/30 shadow-md relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-400 text-slate-950 font-black text-xs">
                        ទំព័រ ៦
                      </span>
                      <span className="text-xs text-purple-200 font-bold">
                        ខ្លឹមសារគោល ៖ ថ្នាក់លាន &bull; ថ្នាក់ពាន់ &bull; ថ្នាក់ឯកតា
                      </span>
                    </div>
                    <h3 className="font-moul text-lg sm:text-2xl text-white">
                      ១. អំណាន និងសំណេរចំនួន (Reading & Writing Numbers)
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
                      នៅក្នុងគណិតវិទ្យា ខ្ទង់នីមួយៗត្រូវបានចាត់ចូលជា <strong>«ថ្នាក់» (Periods)</strong> ដោយក្នុងមួយថ្នាក់ៗមាន <strong>៣ ខ្ទង់</strong> ជានិច្ច ៖ <strong>រយ</strong>, <strong>ដប់</strong>, និង <strong>រាយ</strong>។
                    </p>
                  </div>

                  {/* Sample presets chips from textbook */}
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 shrink-0">
                    <span className="text-[11px] font-bold text-amber-300 block mb-1.5 uppercase tracking-wider">
                      ចុចជ្រើសរើសចំនួនគំរូសៀវភៅពុម្ព ៖
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-w-sm">
                      {['870465250', '125243102', '248180035', '405276930', '2871135463'].map((sample) => (
                        <button
                          key={sample}
                          onClick={() => setCustomNumberInput(sample)}
                          className={`text-xs px-2.5 py-1 rounded-xl font-bold transition cursor-pointer active:scale-95 ${
                            customNumberInput === sample
                              ? 'bg-amber-400 text-slate-950 shadow-md'
                              : 'bg-white/15 hover:bg-white/25 text-white'
                          }`}
                        >
                          {formatNumberWithSpaces(sample)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Number Matrix & Input Bar */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl font-bold">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                    </span>
                    <div>
                      <strong className="text-sm font-bold text-slate-900 block">
                        តារាងថ្នាក់ និងខ្ទង់ឌីជីថល (Interactive Place Value Matrix)
                      </strong>
                      <span className="text-xs text-slate-500">
                        វាយលេខ ឬចុចលើខ្ទង់នីមួយៗដើម្បីមើលការបំបែកថ្នាក់ និងការអាន
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customNumberInput}
                      onChange={(e) => setCustomNumberInput(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      placeholder="បញ្ចូលចំនួន..."
                      className="px-4 py-2 rounded-xl border-2 border-indigo-300 font-black text-slate-900 font-mono text-base w-48 sm:w-52 focus:border-indigo-600 outline-none text-center shadow-xs"
                    />
                    <button
                      onClick={() => setCustomNumberInput('870465250')}
                      className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition"
                      title="កំណត់ទៅចំនួនគំរូទំព័រ៦ (870 465 250)"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* GORGEOUS 3-PERIOD PLACE VALUE MATRIX */}
                <div className="overflow-x-auto rounded-3xl border-2 border-slate-800 shadow-lg">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      {/* PERIOD/CLASS ROW */}
                      <tr className="text-xs sm:text-base font-moul text-white">
                        <th colSpan={3} className="bg-gradient-to-b from-purple-800 to-purple-950 py-3 border-r-2 border-slate-900">
                          👑 ថ្នាក់លាន (Millions Period)
                        </th>
                        <th colSpan={3} className="bg-gradient-to-b from-blue-800 to-blue-950 py-3 border-r-2 border-slate-900">
                          💎 ថ្នាក់ពាន់ (Thousands Period)
                        </th>
                        <th colSpan={3} className="bg-gradient-to-b from-emerald-800 to-emerald-950 py-3">
                          🌿 ថ្នាក់ឯកតា (Units Period)
                        </th>
                      </tr>

                      {/* PLACE VALUE ROW */}
                      <tr className="bg-slate-100 text-xs sm:text-sm font-bold text-slate-800 border-b-2 border-slate-800">
                        <th className="py-2.5 border-r border-slate-300 w-[11.1%] bg-purple-50 text-purple-900">រយលាន</th>
                        <th className="py-2.5 border-r border-slate-300 w-[11.1%] bg-purple-50 text-purple-900">ដប់លាន</th>
                        <th className="py-2.5 border-r-2 border-slate-800 w-[11.1%] bg-purple-100 text-purple-950 font-black">លាន</th>
                        <th className="py-2.5 border-r border-slate-300 w-[11.1%] bg-blue-50 text-blue-900">សែន</th>
                        <th className="py-2.5 border-r border-slate-300 w-[11.1%] bg-blue-50 text-blue-900">ម៉ឺន</th>
                        <th className="py-2.5 border-r-2 border-slate-800 w-[11.1%] bg-blue-100 text-blue-950 font-black">ពាន់</th>
                        <th className="py-2.5 border-r border-slate-300 w-[11.1%] bg-emerald-50 text-emerald-900">រយ</th>
                        <th className="py-2.5 border-r border-slate-300 w-[11.1%] bg-emerald-50 text-emerald-900">ដប់</th>
                        <th className="py-2.5 w-[11.1%] bg-emerald-100 text-emerald-950 font-black">រាយ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-xl sm:text-3xl font-black bg-white">
                        <td className="py-4 border-r border-slate-200 font-mono text-purple-900 hover:bg-purple-50 transition cursor-default">
                          {parsed.millionsPeriod.hundredMillions || '-'}
                        </td>
                        <td className="py-4 border-r border-slate-200 font-mono text-purple-900 hover:bg-purple-50 transition cursor-default">
                          {parsed.millionsPeriod.tenMillions || '-'}
                        </td>
                        <td className="py-4 border-r-2 border-slate-800 font-mono bg-purple-50/60 text-purple-950 font-black">
                          {parsed.millionsPeriod.millions || '-'}
                        </td>
                        <td className="py-4 border-r border-slate-200 font-mono text-blue-900 hover:bg-blue-50 transition cursor-default">
                          {parsed.thousandsPeriod.hundredThousands || '-'}
                        </td>
                        <td className="py-4 border-r border-slate-200 font-mono text-blue-900 hover:bg-blue-50 transition cursor-default">
                          {parsed.thousandsPeriod.tenThousands || '-'}
                        </td>
                        <td className="py-4 border-r-2 border-slate-800 font-mono bg-blue-50/60 text-blue-950 font-black">
                          {parsed.thousandsPeriod.thousands || '-'}
                        </td>
                        <td className="py-4 border-r border-slate-200 font-mono text-emerald-900 hover:bg-emerald-50 transition cursor-default">
                          {parsed.unitsPeriod.hundreds || '-'}
                        </td>
                        <td className="py-4 border-r border-slate-200 font-mono text-emerald-900 hover:bg-emerald-50 transition cursor-default">
                          {parsed.unitsPeriod.tens || '-'}
                        </td>
                        <td className="py-4 font-mono bg-emerald-50/60 text-emerald-950 font-black">
                          {parsed.unitsPeriod.ones || '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* THE 2 READING METHODS IN COLOR-CODED INTERACTIVE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                  {/* Method 1: Read by Place Values */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/90 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          ១
                        </span>
                        <h4 className="font-moul text-sm text-amber-950">
                          របៀបអានតាមខ្ទង់ (By Place Values)
                        </h4>
                      </div>
                      <button
                        onClick={() => handleSpeak('ប្រាំបីរយចិតសិបលាន បួនសែនប្រាំមួយម៉ឺនប្រាំពាន់ ពីររយហាសិប')}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          speakingText?.includes('បួនសែន')
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                        title="ស្តាប់សំឡេងអាន"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>ស្តាប់</span>
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-amber-200 text-slate-800 text-sm sm:text-base font-bold leading-relaxed shadow-2xs">
                      « ប្រាំបីរយចិតសិបលាន <span className="text-blue-700">បួនសែន</span> <span className="text-indigo-700">ប្រាំមួយម៉ឺន</span> <span className="text-teal-700">ប្រាំពាន់</span> ពីររយហាសិប »
                    </div>

                    <p className="text-xs text-amber-900 leading-relaxed">
                      💡 <strong>ចំណាំ ៖</strong> អានបញ្ជាក់ឈ្មោះខ្ទង់នីមួយៗត្រង់ថ្នាក់ពាន់ គឺអាន <strong>សែន</strong>, <strong>ម៉ឺន</strong>, និង <strong>ពាន់</strong>។
                    </p>
                  </div>

                  {/* Method 2: Read by Periods / Classes */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200/90 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          ២
                        </span>
                        <h4 className="font-moul text-sm text-indigo-950">
                          របៀបអានតាមថ្នាក់ (By Periods / Classes)
                        </h4>
                      </div>
                      <button
                        onClick={() => handleSpeak('ប្រាំបីរយចិតសិបលាន បួនរយហុកសិបប្រាំពាន់ ពីររយហាសិប')}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          speakingText?.includes('បួនរយហុកសិបប្រាំពាន់')
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-300'
                        }`}
                        title="ស្តាប់សំឡេងអាន"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>ស្តាប់</span>
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-indigo-200 text-slate-800 text-sm sm:text-base font-bold leading-relaxed shadow-2xs">
                      « <span className="text-purple-700">ប្រាំបីរយចិតសិបលាន</span> <span className="text-blue-700">បួនរយហុកសិបប្រាំពាន់</span> <span className="text-emerald-700">ពីររយហាសិប</span> »
                    </div>

                    <p className="text-xs text-indigo-900 leading-relaxed">
                      💡 <strong>ចំណាំ ៖</strong> អានជាបណ្តុំក្នុងមួយថ្នាក់ៗ ដោយគ្រាន់តែភ្ជាប់ឈ្មោះថ្នាក់នៅចុងបញ្ចប់ ៖ ថ្នាក់លាន (៨៧០), ថ្នាក់ពាន់ (៤៦៥), ថ្នាក់ឯកតា (២៥០)។
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ខ្ទង់ និងតម្លៃលេខតាមខ្ទង់ & ក្បាច់រាប់ (Abacus)     */}
          {/* ======================================================== */}
          {activeTab === 'place_value' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              <div className="bg-gradient-to-r from-blue-900 via-teal-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-blue-500/30 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-400 text-slate-950 font-black text-xs">
                      ទំព័រ ៧
                    </span>
                    <span className="text-xs text-blue-200 font-bold">
                      ក្បាច់រាប់គំរូ &bull; ចំនួន ៣ ០២៤ ១០៣
                    </span>
                  </div>
                  <h3 className="font-moul text-lg sm:text-2xl text-white">
                    ២. ខ្ទង់ និងតម្លៃលេខតាមខ្ទង់ (Place Values & Digit Values)
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                    ឧបករណ៍ក្បាច់រាប់ (Spike Abacus) ជួយបង្ហាញឱ្យឃើញជាក់ស្តែងនូវតម្លៃលេខនីមួយៗតាមខ្ទង់ និងការបំបែកជាទម្រង់ពង្រាយ។
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center shadow-inner shrink-0">
                  <span className="text-[10px] text-blue-200 font-bold block uppercase tracking-wider">
                    តម្លៃសរុបនៅលើក្បាច់រាប់
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                    {formatNumberWithSpaces(abacusNumber)}
                  </span>
                </div>
              </div>

              {/* MASTERPIECE SPIKE ABACUS (ក្បាច់រាប់មាស & ប្រណីត) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-100 text-amber-800 rounded-xl font-bold">
                      🧮
                    </span>
                    <div>
                      <strong className="text-sm font-bold text-slate-900 block">
                        ឧបករណ៍ក្បាច់រាប់អន្តរកម្ម (Interactive Spike Abacus Simulator)
                      </strong>
                      <span className="text-xs text-slate-500">
                        ចុចលើប៊ូតុង + ឬ - ដើម្បីបន្ថែម/បន្ថយគ្រាប់ក្បាច់រាប់តាមខ្ទង់នីមួយៗ
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAbacusDigits([3, 0, 2, 4, 1, 0, 3])}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                      <span>គំរូសៀវភៅពុម្ព (3 024 103)</span>
                    </button>
                    <button
                      onClick={() => setAbacusDigits([0, 0, 0, 0, 0, 0, 0])}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold transition cursor-pointer"
                    >
                      លុបទាំងអស់
                    </button>
                  </div>
                </div>

                {/* VISUAL WOODEN & METALLIC ABACUS STAND */}
                <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl overflow-x-auto relative">
                  <div className="min-w-[650px] flex justify-between items-end gap-3 h-72 border-b-[10px] border-amber-700 pb-3 relative">
                    {[
                      { name: 'លាន', mult: 1000000, gradient: 'from-purple-400 to-purple-600 border-purple-200' },
                      { name: 'សែន', mult: 100000, gradient: 'from-indigo-400 to-indigo-600 border-indigo-200' },
                      { name: 'ម៉ឺន', mult: 10000, gradient: 'from-blue-400 to-blue-600 border-blue-200' },
                      { name: 'ពាន់', mult: 1000, gradient: 'from-teal-400 to-teal-600 border-teal-200' },
                      { name: 'រយ', mult: 100, gradient: 'from-emerald-400 to-emerald-600 border-emerald-200' },
                      { name: 'ដប់', mult: 10, gradient: 'from-amber-400 to-amber-600 border-amber-200' },
                      { name: 'រាយ', mult: 1, gradient: 'from-rose-400 to-rose-600 border-rose-200' },
                    ].map((col, idx) => {
                      const count = abacusDigits[idx];
                      return (
                        <div key={col.name} className="flex-1 flex flex-col items-center h-full justify-end relative group">
                          {/* Polished Metallic Spike Rod */}
                          <div className="w-2.5 h-48 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 rounded-t-full absolute bottom-12 z-0 shadow-sm" />
                          
                          {/* Stacked Glossy Beads */}
                          <div className="flex flex-col-reverse items-center gap-1.5 w-full mb-12 z-10">
                            {Array.from({ length: count }).map((_, bIdx) => (
                              <motion.div
                                key={bIdx}
                                initial={{ scale: 0, y: -20 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                className={`w-12 sm:w-14 h-5 rounded-full border shadow-md bg-gradient-to-r ${col.gradient} shadow-black/40`}
                              />
                            ))}
                          </div>

                          {/* Interactive Stepper Button Controls */}
                          <div className="flex items-center gap-1 my-1.5 z-20 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
                            <button
                              onClick={() => updateAbacusDigit(idx, -1)}
                              disabled={count <= 0}
                              className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-20 text-xs flex items-center justify-center font-bold text-white transition active:scale-95"
                            >
                              -
                            </button>
                            <span className="font-mono font-black text-amber-300 text-sm w-5 text-center">
                              {count}
                            </span>
                            <button
                              onClick={() => updateAbacusDigit(idx, 1)}
                              disabled={count >= 9}
                              className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-20 text-xs flex items-center justify-center font-bold text-white transition active:scale-95"
                            >
                              +
                            </button>
                          </div>

                          {/* Column Khmer Label */}
                          <span className="font-moul text-xs text-amber-300 mt-1">
                            {col.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DIGIT BREAKDOWN TILES (សមីការតម្លៃលេខតាមខ្ទង់) */}
                <div className="space-y-3">
                  <h4 className="font-moul text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-600" />
                    <span>ការគណនាតម្លៃលេខតាមខ្ទង់នីមួយៗនៃចំនួន ៖</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { place: 'រាយ', val: abacusDigits[6], mult: 1, res: abacusDigits[6] * 1 },
                      { place: 'ដប់', val: abacusDigits[5], mult: 10, res: abacusDigits[5] * 10 },
                      { place: 'រយ', val: abacusDigits[4], mult: 100, res: abacusDigits[4] * 100 },
                      { place: 'ពាន់', val: abacusDigits[3], mult: 1000, res: abacusDigits[3] * 1000 },
                      { place: 'ម៉ឺន', val: abacusDigits[2], mult: 10000, res: abacusDigits[2] * 10000 },
                      { place: 'សែន', val: abacusDigits[1], mult: 100000, res: abacusDigits[1] * 100000 },
                      { place: 'លាន', val: abacusDigits[0], mult: 1000000, res: abacusDigits[0] * 1000000 },
                    ].map((item) => (
                      <div
                        key={item.place}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex justify-between items-center hover:bg-indigo-50/40 transition"
                      >
                        <div className="text-xs">
                          <span className="text-slate-500 block">ខ្ទង់<strong>{item.place}</strong></span>
                          <span className="font-bold text-slate-800">លេខ {item.val}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs text-slate-500 block">
                            {item.val} &times; {formatNumberWithSpaces(item.mult)} =
                          </span>
                          <span className="font-mono font-black text-indigo-900 text-sm">
                            {formatNumberWithSpaces(item.res)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* EXPANDED FORM EQUATION CONTAINER */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 space-y-2">
                    <span className="font-moul text-xs sm:text-sm text-amber-950 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>សរសេរជាទម្រង់ពង្រាយ (Expanded Form) ៖</span>
                    </span>
                    <p className="font-mono font-black text-sm sm:text-lg text-slate-900 leading-relaxed bg-white p-3.5 rounded-2xl border border-amber-200 break-words shadow-2xs">
                      {formatNumberWithSpaces(abacusNumber)} ={' '}
                      {abacusDigits
                        .map((d, i) => {
                          const mult = [1000000, 100000, 10000, 1000, 100, 10, 1][i];
                          return formatNumberWithSpaces(d * mult);
                        })
                        .filter((v) => v !== '0')
                        .join(' + ') || '0'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ការប្រៀបធៀប និងរៀបលំដាប់ (Comparing & Ordering)    */}
          {/* ======================================================== */}
          {activeTab === 'comparison' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-emerald-500/30 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-xs">
                      ទំព័រ ៨
                    </span>
                    <span className="text-xs text-emerald-200 font-bold">
                      ក្បួនប្រៀបធៀបពីឆ្វេងទៅស្តាំ &bull; ពីតូចទៅធំ / ពីធំទៅតូច
                    </span>
                  </div>
                  <h3 className="font-moul text-lg sm:text-2xl text-white">
                    ៣. ការប្រៀបធៀប និងរៀបលំដាប់ចំនួន (Comparing & Ordering)
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                    ដើម្បីប្រៀបធៀបចំនួនពីរ ត្រូវពិនិត្យខ្ទង់ដែលមានតម្លៃខ្ពស់ជាងគេមុនបង្អស់ (ពីឆ្វេងទៅស្តាំ) រហូតដល់ឃើញខ្ទង់ដែលខុសគ្នា។
                  </p>
                </div>
              </div>

              {/* PART A: DIGIT COMPARISON MACHINE (3 256 401 vs 3 257 250) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-moul text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <span>ក. តារាងប្រៀបធៀបចំនួនគំរូ ៖ 3 256 401 និង 3 257 250</span>
                  </h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ខ្ទង់ពាន់ខុសគ្នា ៖ 6 &lt; 7
                  </span>
                </div>

                <div className="overflow-x-auto rounded-3xl border-2 border-slate-800 shadow-md">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-white font-moul text-xs sm:text-sm">
                        <th className="py-3 border-r border-slate-700">លាន</th>
                        <th className="py-3 border-r border-slate-700">សែន</th>
                        <th className="py-3 border-r border-slate-700">ម៉ឺន</th>
                        <th className="py-3 border-r border-slate-700 bg-amber-500 text-slate-950 font-black">
                          ពាន់ (ចំណុចសម្រេច)
                        </th>
                        <th className="py-3 border-r border-slate-700">រយ</th>
                        <th className="py-3 border-r border-slate-700">ដប់</th>
                        <th className="py-3">រាយ</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-base sm:text-xl font-black text-slate-900">
                      <tr className="border-b border-slate-200 bg-white">
                        <td className="py-3.5 border-r border-slate-200">3</td>
                        <td className="py-3.5 border-r border-slate-200">2</td>
                        <td className="py-3.5 border-r border-slate-200">5</td>
                        <td className="py-3.5 border-r border-slate-200 bg-rose-50 text-rose-700 font-black text-2xl">
                          6
                        </td>
                        <td className="py-3.5 border-r border-slate-200 text-slate-400">4</td>
                        <td className="py-3.5 border-r border-slate-200 text-slate-400">0</td>
                        <td className="py-3.5 text-slate-400">1</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-white">
                        <td className="py-3.5 border-r border-slate-200">3</td>
                        <td className="py-3.5 border-r border-slate-200">2</td>
                        <td className="py-3.5 border-r border-slate-200">5</td>
                        <td className="py-3.5 border-r border-slate-200 bg-emerald-50 text-emerald-700 font-black text-2xl">
                          7
                        </td>
                        <td className="py-3.5 border-r border-slate-200 text-slate-400">2</td>
                        <td className="py-3.5 border-r border-slate-200 text-slate-400">5</td>
                        <td className="py-3.5 text-slate-400">0</td>
                      </tr>
                      <tr className="bg-slate-100 font-sans text-xs font-bold text-slate-700">
                        <td className="py-2.5 border-r border-slate-200 text-emerald-600 font-mono">3 = 3</td>
                        <td className="py-2.5 border-r border-slate-200 text-emerald-600 font-mono">2 = 2</td>
                        <td className="py-2.5 border-r border-slate-200 text-emerald-600 font-mono">5 = 5</td>
                        <td className="py-2.5 border-r border-slate-200 bg-amber-100 text-amber-950 font-black font-mono">
                          6 &lt; 7 ⚠️
                        </td>
                        <td colSpan={3} className="py-2.5 text-slate-400 font-medium">
                          ឈប់បាច់ប្រៀបធៀបខ្ទង់បន្ទាប់ទៀត
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <span className="font-moul text-xs sm:text-sm text-emerald-950">
                    សេចក្តីសន្និដ្ឋានផ្លូវការ ៖
                  </span>
                  <div className="flex flex-wrap items-center gap-3 text-base sm:text-xl font-black font-mono text-emerald-900">
                    <span className="bg-white px-3 py-1 rounded-xl border border-emerald-300 shadow-2xs">3 256 401 &lt; 3 257 250</span>
                    <span className="text-slate-400 font-normal">ឬ</span>
                    <span className="bg-white px-3 py-1 rounded-xl border border-emerald-300 shadow-2xs">3 257 250 &gt; 3 256 401</span>
                  </div>
                </div>
              </div>

              {/* PART B: ORDERING SHELF (2 510 571 ; 2 538 505 ; 2 530 295 ; 263 895) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-moul text-xs sm:text-sm text-slate-900">
                      ខ. ការរៀបលំដាប់ចំនួន ៤ គំរូក្នុងសៀវភៅពុម្ព
                    </h4>
                    <span className="text-xs text-slate-500">
                      ចំនួន ៖ 2 510 571 ; 2 538 505 ; 2 530 295 ; 263 895
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => setOrderMode('asc')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        orderMode === 'asc' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ពីតូចទៅធំ (Ascending)
                    </button>
                    <button
                      onClick={() => setOrderMode('desc')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        orderMode === 'desc' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ពីធំទៅតូច (Descending)
                    </button>
                  </div>
                </div>

                {/* ANIMATED SORTED TILES */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  {(orderMode === 'asc'
                    ? ['263 895', '2 510 571', '2 530 295', '2 538 505']
                    : ['2 538 505', '2 530 295', '2 510 571', '263 895']
                  ).map((val, idx) => (
                    <React.Fragment key={val}>
                      <motion.div
                        layout
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="px-5 py-3.5 rounded-2xl bg-white border-2 border-indigo-200 shadow-md font-mono font-black text-slate-900 text-base sm:text-lg flex items-center gap-2.5"
                      >
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                          {toKhmerNum(idx + 1)}
                        </span>
                        <span>{val}</span>
                      </motion.div>
                      {idx < 3 && (
                        <span className="text-indigo-600 font-black text-lg">
                          {orderMode === 'asc' ? '<' : '>'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: ការបង្គត់ចំនួន (Rounding Numbers & Number Line)    */}
          {/* ======================================================== */}
          {activeTab === 'rounding' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-amber-500/30 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                      ទំព័រ ៩
                    </span>
                    <span className="text-xs text-amber-200 font-bold">
                      ក្បួនបង្គត់មាស &bull; បន្ទាត់ចំនួនអន្តរកម្ម
                    </span>
                  </div>
                  <h3 className="font-moul text-lg sm:text-2xl text-white">
                    ៤. ការបង្គត់ចំនួន (Rounding Numbers)
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
                    ការបង្គត់ធ្វើឡើងដើម្បីងាយស្រួលប៉ាន់ស្មាន និងចងចាំ ដោយពឹងផ្អែកលើចម្ងាយនៅលើបន្ទាត់ចំនួន (ជិតខាងណា បង្គត់ទៅខាងនោះ)។
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setRoundingTarget('2782150')}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95 ${
                      roundingTarget === '2782150'
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    ក. បង្គត់ 2 782 150
                  </button>
                  <button
                    onClick={() => setRoundingTarget('5623501')}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95 ${
                      roundingTarget === '5623501'
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    ខ. បង្គត់ 5 623 501
                  </button>
                </div>
              </div>

              {/* PRECISION NUMBER LINE SIMULATOR */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <h4 className="font-moul text-xs sm:text-sm text-slate-900">
                    {roundingTarget === '2782150'
                      ? 'ក. បង្គត់ចំនួន 2 782 150 ត្រឹមខ្ទង់លាន'
                      : 'ខ. បង្គត់ចំនួន 5 623 501 ត្រឹមខ្ទង់សែន'}
                  </h4>
                  <span className="text-xs font-black text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
                    {roundingTarget === '2782150' ? 'បង្គត់ឡើង ➜ 3 000 000' : 'បង្គត់ចុះ ➜ 5 600 000'}
                  </span>
                </div>

                {/* VISUAL DARK-MODE NEON NUMBER LINE */}
                <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                  <div className="text-center mb-6">
                    <span className="text-xs text-amber-400 font-bold uppercase tracking-widest block mb-1">
                      ទីតាំងជាក់ស្តែងលើបន្ទាត់ចំនួន
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {roundingTarget === '2782150' ? '2 782 150' : '5 623 501'}
                    </span>
                  </div>

                  {/* Horizontal Axis */}
                  <div className="relative py-12 px-6">
                    <div className="h-2 bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 w-full relative rounded-full shadow-lg">
                      {/* Left Boundary */}
                      <div className="absolute left-0 -top-3 w-1.5 h-8 bg-amber-400 rounded-full" />
                      <div className="absolute left-0 top-7 text-xs sm:text-sm font-mono font-black text-amber-400 -translate-x-1/2">
                        {roundingTarget === '2782150' ? '2 000 000' : '5 600 000'}
                      </div>

                      {/* Right Boundary */}
                      <div className="absolute right-0 -top-3 w-1.5 h-8 bg-amber-400 rounded-full" />
                      <div className="absolute right-0 top-7 text-xs sm:text-sm font-mono font-black text-amber-400 translate-x-1/2">
                        {roundingTarget === '2782150' ? '3 000 000' : '5 700 000'}
                      </div>

                      {/* Intermediate 10 Ticks */}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          style={{ left: `${(i + 1) * 10}%` }}
                          className="absolute -top-2 w-0.5 h-6 bg-slate-600 rounded-full"
                        />
                      ))}

                      {/* Middle 50% Marker */}
                      <div className="absolute left-1/2 -top-3.5 w-1 h-9 bg-slate-400 rounded-full" />
                      <div className="absolute left-1/2 top-7 text-[10px] sm:text-xs text-slate-400 font-mono -translate-x-1/2">
                        {roundingTarget === '2782150' ? '2 500 000' : '5 650 000'}
                      </div>

                      {/* Animated Needle Marker */}
                      <motion.div
                        style={{ left: roundingTarget === '2782150' ? '78.2%' : '23.5%' }}
                        className="absolute -top-10 -translate-x-1/2 flex flex-col items-center z-10"
                      >
                        <span className="px-2.5 py-1 rounded-xl bg-rose-500 text-white font-mono text-xs font-black shadow-lg shadow-rose-500/40">
                          {roundingTarget === '2782150' ? '2 782 150' : '5 623 501'}
                        </span>
                        <div className="w-1 h-8 bg-rose-500" />
                        <div className="w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e] border-2 border-white" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Distance Comparison Card */}
                  <div className="mt-8 pt-4 border-t border-slate-800 text-xs sm:text-sm text-center text-slate-300 space-y-1">
                    {roundingTarget === '2782150' ? (
                      <p className="leading-relaxed">
                        💡 ចំនួន <strong>2 782 150</strong> នៅជិត <strong>3 000 000</strong> (ចម្ងាយត្រឹមតែ ២១៧ ៨៥០) ជាង ២ ០០០ ០០០ (ចម្ងាយដល់ ៧៨២ ១៥០)។ ដូចនេះ <strong>ត្រូវបង្គត់ឡើងទៅ 3 000 000</strong>។
                      </p>
                    ) : (
                      <p className="leading-relaxed">
                        💡 ចំនួន <strong>5 623 501</strong> នៅជិត <strong>5 600 000</strong> (ចម្ងាយត្រឹមតែ ២៣ ៥០១) ជាង ៥ ៧០០ ០០០ (ចម្ងាយដល់ ៧៦ ៤៩៩)។ ដូចនេះ <strong>ត្រូវបង្គត់ចុះទៅ 5 600 000</strong>។
                      </p>
                    )}
                  </div>
                </div>

                {/* THE GOLDEN ROUNDING RULE CARD */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-500 text-white rounded-xl font-bold shadow-xs">
                      <Lightbulb className="w-4 h-4" />
                    </span>
                    <h5 className="font-moul text-sm text-amber-950">
                      ក្បួនបង្គត់មាស (The Golden Rounding Rule)
                    </h5>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800">
                    ដើម្បីបង្គត់ចំនួន ត្រូវសង្កេតមើល <strong>ខ្ទង់បន្ទាប់ខាងស្តាំ</strong> នៃខ្ទង់ដែលត្រូវបង្គត់ ៖
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-rose-200 shadow-2xs space-y-1">
                      <strong className="text-rose-700 block text-sm sm:text-base font-bold">
                        ១. បើខ្ទង់នោះជាលេខ 0, 1, 2, 3, 4
                      </strong>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        ➜ <strong>ត្រូវបង្គត់ចុះ</strong> (រក្សាតម្លៃខ្ទង់ដដែល ហើយប្តូរខ្ទង់ខាងស្តាំទាំងអស់ទៅជាលេខ 0)។
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
                      <strong className="text-emerald-700 block text-sm sm:text-base font-bold">
                        ២. បើខ្ទង់នោះជាលេខ 5, 6, 7, 8, 9
                      </strong>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        ➜ <strong>ត្រូវបង្គត់ឡើង</strong> (បូកបន្ថែម ១ លើខ្ទង់បង្គត់ ហើយប្តូរខ្ទង់ខាងស្តាំទាំងអស់ទៅជាលេខ 0)។
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: លំហាត់អនុវត្តសៀវភៅពុម្ព & កំណែ (Exercises & Solutions) */}
          {/* ======================================================== */}
          {activeTab === 'exercises' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              <div className="bg-gradient-to-r from-rose-900 via-purple-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-purple-500/30 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-400 text-slate-950 font-black text-xs">
                      ទំព័រ ៦ - ៩
                    </span>
                    <span className="text-xs text-rose-200 font-bold">
                      លំហាត់អនុវត្តគ្រប់ផ្នែក &bull; កំណែគន្លឹះលម្អិត
                    </span>
                  </div>
                  <h3 className="font-moul text-lg sm:text-2xl text-white">
                    ៥. លំហាត់អនុវត្តសៀវភៅពុម្ព & កំណែ
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
                    ធ្វើលំហាត់អនុវត្តផ្ទាល់ និងចុចផ្ទៀងផ្ទាត់ចម្លើយ ឬបើកមើលដំណោះស្រាយគន្លឹះ។
                  </p>
                </div>
              </div>

              {/* Highlight Banner: 40-Question QCM Exam matching user model */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white p-5 rounded-3xl shadow-lg border border-amber-300/40 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-orange-950 font-black text-[11px] shadow-xs">
                      🏆 វិញ្ញាសាស្តង់ដារជាតិ
                    </span>
                    <span className="text-xs text-amber-100 font-bold">
                      ៤០ សំណួរ &bull; ៦០ នាទី &bull; មានក្តារខៀន Scratchpad & រូបមន្ត
                    </span>
                  </div>
                  <h4 className="font-moul text-base sm:text-lg text-white">
                    វិញ្ញាសា QCM ៤០ សំណួរ ៖ មេរៀនទី១ ចំនួន
                  </h4>
                  <p className="text-xs text-amber-100 max-w-xl">
                    សាកល្បងសមត្ថភាពពហុជ្រើសរើស (QCM) ៤០ សំណួរ គ្របដណ្តប់គ្រប់ចំណុចនៃមេរៀនទី១ ជាមួយផ្ទាំងកូនគិត តារាងខ្ទង់ និងក្រដាសព្រាង Scratchpad។
                  </p>
                </div>
                <button
                  onClick={() => setIsExamModalOpen(true)}
                  className="px-6 py-3 bg-white hover:bg-amber-50 text-orange-950 rounded-2xl font-black text-sm shadow-md hover:shadow-xl transition active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>ចាប់ផ្តើមប្រឡង (៤០ សំណួរ)</span>
                </button>
              </div>

              {/* EXERCISE 1: READING & WRITING (PAGE 6) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs">
                      ទំព័រ ៦
                    </span>
                    <h4 className="font-moul text-xs sm:text-sm text-slate-900">
                      លំហាត់ទី១ ៖ អាន និងសរសេរជាពាក្យ
                    </h4>
                  </div>
                  <button
                    onClick={() => toggleSolution('ex1')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    {revealedSolutions['ex1'] ? 'លាក់កំណែ' : '🔍 បង្ហាញកំណែ'}
                  </button>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-800">
                  <p className="font-bold">១. ចូរអានចំនួនរួចសរសេរជាពាក្យនៃចំនួនខាងក្រោមតាមថ្នាក់ ៖</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { num: '125 243 102', ans: 'មួយរយម្ភៃប្រាំលាន ពីររយសែសិបបីពាន់ មួយរយពីរ' },
                      { num: '248 180 035', ans: 'ពីររយសែសិបប្រាំបីលាន មួយរយប៉ែតសិបពាន់ សាមសិបប្រាំ' },
                      { num: '405 276 930', ans: 'បួនរយប្រាំលាន ពីររយចិតសិបប្រាំមួយពាន់ ប្រាំបួនរយសាមសិប' },
                      { num: '2 871 135 463', ans: 'ពីរពាន់ប្រាំបីរយចិតសិបមួយលាន មួយរយសាមសិបប្រាំពាន់ បួនរយហុកសិបបី' },
                    ].map((item, idx) => (
                      <div key={item.num} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <strong className="text-slate-900 block font-mono text-sm">{item.num}</strong>
                        {revealedSolutions['ex1'] ? (
                          <p className="text-emerald-700 font-bold text-xs">➜ {item.ans}</p>
                        ) : (
                          <span className="text-slate-400 text-xs italic block">ចុចបង្ហាញកំណែដើម្បីផ្ទៀងផ្ទាត់</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="font-bold pt-2">២. ចូរសរសេរជាចំនួនលេខ ៖</p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <p>&bull; បីរយប៉ែតសិបប្រាំលាន ពីរសែនប្រាំម៉ឺនសាមសិបប្រាំ ៖ <strong className="font-mono font-bold text-indigo-900">385 250 035</strong></p>
                    <p>&bull; ប្រាំរយហាសិបលាន បីរយប៉ែតសិបប្រាំពីរពាន់ ប្រាំមួយរយប្រាំពីរ ៖ <strong className="font-mono font-bold text-indigo-900">550 387 607</strong></p>
                  </div>
                </div>
              </div>

              {/* EXERCISE 2: REAL DATA FROM CAMBODIA (PAGE 9) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs">
                      ទំព័រ ៩
                    </span>
                    <h4 className="font-moul text-xs sm:text-sm text-slate-900">
                      លំហាត់ទី៤ ៖ ការបង្គត់ទិន្នន័យជាក់ស្តែងប្រទេសកម្ពុជា
                    </h4>
                  </div>
                  <button
                    onClick={() => toggleSolution('ex4')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    {revealedSolutions['ex4'] ? 'លាក់កំណែ' : '🔍 បង្ហាញកំណែ'}
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-800">
                  {/* Population of Cambodia */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                    <p>
                      <strong>សំណួរទី២ ៖</strong> ប្រទេសកម្ពុជាមានប្រជាជន <strong>13 395 682</strong> នាក់ ។ ចូរបង្គត់ចំនួនត្រឹម <strong>ខ្ទង់លាន</strong> ។
                    </p>

                    {revealedSolutions['ex4'] ? (
                      <div className="p-3 bg-white rounded-xl border border-blue-300 font-bold text-emerald-800">
                        ➜ ចម្លើយ ៖ <strong>13 000 000 នាក់</strong>
                        <p className="text-xs text-slate-600 font-normal mt-0.5">
                          (ខ្ទង់លានគឺលេខ 3 &bull; ខ្ទង់បន្ទាប់ខាងស្តាំគឺលេខ 3 នៃខ្ទង់សែន &bull; 3 &lt; 5 ដូចនេះត្រូវបង្គត់ចុះទៅ 13 000 000)
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="បញ្ចូលចម្លើយរបស់អ្នក..."
                          value={exerciseAnswers['cambodia_pop'] || ''}
                          onChange={(e) => setExerciseAnswers({ ...exerciseAnswers, cambodia_pop: e.target.value })}
                          className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs w-48 font-bold font-mono"
                        />
                        <button
                          onClick={() => handleCheckAnswer('cambodia_pop', '13000000')}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition active:scale-95"
                        >
                          ផ្ទៀងផ្ទាត់
                        </button>
                        {checkedAnswers['cambodia_pop'] && (
                          <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> ត្រឹមត្រូវ!
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Area of Cambodia */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <p>
                      <strong>សំណួរទី៣ ៖</strong> ប្រទេសកម្ពុជាមានផ្ទៃក្រឡា <strong>181 035</strong> km² ។ ចូរបង្គត់ចំនួនត្រឹម <strong>ខ្ទង់ម៉ឺន</strong> ។
                    </p>

                    {revealedSolutions['ex4'] ? (
                      <div className="p-3 bg-white rounded-xl border border-amber-300 font-bold text-emerald-800">
                        ➜ ចម្លើយ ៖ <strong>180 000 km²</strong>
                        <p className="text-xs text-slate-600 font-normal mt-0.5">
                          (ខ្ទង់ម៉ឺនគឺលេខ 8 &bull; ខ្ទង់បន្ទាប់ខាងស្តាំគឺលេខ 1 នៃខ្ទង់ពាន់ &bull; 1 &lt; 5 ដូចនេះត្រូវបង្គត់ចុះទៅ 180 000)
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="បញ្ចូលចម្លើយរបស់អ្នក..."
                          value={exerciseAnswers['cambodia_area'] || ''}
                          onChange={(e) => setExerciseAnswers({ ...exerciseAnswers, cambodia_area: e.target.value })}
                          className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs w-48 font-bold font-mono"
                        />
                        <button
                          onClick={() => handleCheckAnswer('cambodia_area', '180000')}
                          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition active:scale-95"
                        >
                          ផ្ទៀងផ្ទាត់
                        </button>
                        {checkedAnswers['cambodia_area'] && (
                          <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> ត្រឹមត្រូវ!
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* ======================================================== */}
        {/* 4. BOTTOM STEPPER & FOOTER CONTROLS                       */}
        {/* ======================================================== */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 shadow-lg">
          {/* Previous Page Button */}
          <button
            onClick={goToPrevTab}
            disabled={currentTabIndex === 0}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ទំព័រមុន</span>
          </button>

          {/* Page Dots Indicator */}
          <div className="flex items-center gap-2">
            {TABS_CONFIG.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`transition-all duration-200 cursor-pointer ${
                  activeTab === t.id
                    ? 'w-7 h-2.5 bg-emerald-600 rounded-full'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400 rounded-full'
                }`}
                title={t.title}
              />
            ))}
          </div>

          {/* Right Action: Next Page or Done */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsExamModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <Award className="w-4 h-4 text-amber-200" />
              <span>វិញ្ញាសា QCM ៤០ សំណួរ</span>
            </button>
            {currentTabIndex < TABS_CONFIG.length - 1 ? (
              <button
                onClick={goToNextTab}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>ទំព័របន្ទាប់ ({TABS_CONFIG[currentTabIndex + 1].page})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black transition shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                បញ្ចប់មេរៀន / រួចរាល់
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* 40-Question QCM Exam Modal */}
      <MathLesson1ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
