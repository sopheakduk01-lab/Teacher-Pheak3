import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Sparkles,
  HelpCircle,
  Trophy,
  Volume2,
  VolumeX,
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
  Info,
  Calculator,
  Grid,
  Clock,
  Percent,
  DollarSign,
  BarChart3,
  Box
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toKhmerNum } from '../utils/khmerDate';
import {
  ALL_MATH_LESSONS_PACKAGES,
  getMathLessonPackage,
  MathLessonPackage,
} from '../data/mathLessonQcm';
import { mathGrade6AllLessons, MathLessonData } from '../data/mathGrade6Book';
import { MathLessonCover } from './MathLessonCover';

interface MathInteractiveLessonViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  initialLessonNumber?: number;
  onOpenExam?: (lessonNumber: number) => void;
}

type TabType = 'theory' | 'formulas' | 'interactive_tool' | 'exercises' | 'exam';

export const MathInteractiveLessonViewer: React.FC<MathInteractiveLessonViewerProps> = ({
  isOpen,
  onClose,
  onShowToast,
  initialLessonNumber = 1,
  onOpenExam,
}) => {
  const [currentLessonNumber, setCurrentLessonNumber] = useState<number>(initialLessonNumber || 1);
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'huge'>('normal');
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Lesson 1 Custom Interactive States
  const [customNumberInput, setCustomNumberInput] = useState<string>('870465250');
  const [abacusDigits, setAbacusDigits] = useState<number[]>([3, 0, 2, 4, 1, 0, 3]);
  const [roundingTarget, setRoundingTarget] = useState<'2782150' | '5623501' | 'slider'>('2782150');
  const [interactiveSliderVal, setInteractiveSliderVal] = useState<number>(2782150);

  // Generic Interactive Tools States for Lessons 2 to 20
  // Decimals (Lessons 2-5)
  const [decNumA, setDecNumA] = useState<number>(12.45);
  const [decNumB, setDecNumB] = useState<number>(3.6);
  // Fraction (Lessons 7-11)
  const [fracNum1, setFracNum1] = useState<number>(3);
  const [fracDen1, setFracDen1] = useState<number>(4);
  const [fracNum2, setFracNum2] = useState<number>(2);
  const [fracDen2, setFracDen2] = useState<number>(5);
  // Ratio & Proportion (Lessons 12-13)
  const [ratioA, setRatioA] = useState<number>(6);
  const [ratioB, setRatioB] = useState<number>(18);
  const [propA, setPropA] = useState<number>(3);
  const [propB, setPropB] = useState<number>(5);
  const [propC, setPropC] = useState<number>(15);
  // Speed (Lesson 14)
  const [speedVal, setSpeedVal] = useState<number>(60);
  const [timeVal, setTimeVal] = useState<number>(2.5);
  // Percentage (Lesson 16)
  const [baseVal, setBaseVal] = useState<number>(50000);
  const [percentRate, setPercentRate] = useState<number>(15);
  // Interest (Lesson 17)
  const [principalVal, setPrincipalVal] = useState<number>(1000);
  const [interestRate, setInterestRate] = useState<number>(8);
  const [interestTimeYears, setInterestTimeYears] = useState<number>(2);
  // Volume (Lesson 20)
  const [boxLength, setBoxLength] = useState<number>(8);
  const [boxWidth, setBoxWidth] = useState<number>(5);
  const [boxHeight, setBoxHeight] = useState<number>(4);

  // Revealable Solutions
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // Sync initialLessonNumber
  useEffect(() => {
    if (initialLessonNumber) {
      setCurrentLessonNumber(initialLessonNumber);
    }
  }, [initialLessonNumber, isOpen]);

  // Stop speech when modal closes or lesson switches
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, currentLessonNumber]);

  if (!isOpen) return null;

  const currentPackage: MathLessonPackage = getMathLessonPackage(currentLessonNumber);
  const curriculumData: MathLessonData = mathGrade6AllLessons[currentLessonNumber - 1] || mathGrade6AllLessons[0];

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingText) {
        window.speechSynthesis.cancel();
        setSpeakingText(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'km-KH';
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      setSpeakingText(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLessonSwitch = (newLesson: number) => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingText(null);
    setCurrentLessonNumber(newLesson);
    setActiveTab('theory');
    setRevealedSolutions({});
  };

  const toggleSolution = (idx: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Helper gcd
  const getGcd = (a: number, b: number): number => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 transition-all duration-300 w-full ${
          isFullscreen ? 'h-full max-h-none rounded-none' : 'max-w-5xl max-h-[92vh] h-[92vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-3 shrink-0 shadow-md">
          {/* Left: Lesson Selector & Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl shrink-0 shadow-inner">
              {currentPackage.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <select
                  value={currentLessonNumber}
                  onChange={(e) => handleLessonSwitch(Number(e.target.value))}
                  className="bg-white/15 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl px-2.5 py-1 border border-white/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {ALL_MATH_LESSONS_PACKAGES.map((pkg) => (
                    <option key={pkg.lessonNumber} value={pkg.lessonNumber} className="text-slate-900 font-semibold">
                      មេរៀនទី {toKhmerNum(pkg.lessonNumber)} ៖ {pkg.shortTitle}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 hidden sm:inline-block">
                  ទំព័រ {currentPackage.startPage}-{currentPackage.endPage}
                </span>
              </div>
              <p className="text-[11px] text-purple-200 mt-0.5 line-clamp-1">
                {currentPackage.title}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Take 40Q Exam Direct Button */}
            <button
              onClick={() => {
                if (onOpenExam) {
                  onOpenExam(currentLessonNumber);
                } else {
                  onShowToast?.(`បើកវិញ្ញាសា QCM ៤០ សំណួរនៃមេរៀនទី ${currentLessonNumber}`);
                }
              }}
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>📝 ចូលប្រឡង QCM ៤០</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer hidden sm:flex"
              title={isFullscreen ? 'បង្រួម' : 'ពង្រីកពេញអេក្រង់'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-red-500 text-white transition cursor-pointer"
              title="បិទ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'theory', label: '១. ខ្លឹមសារ & មេរៀនគោល', icon: BookOpen },
            { id: 'formulas', label: '២. រូបមន្ត & គន្លឹះដោះស្រាយ', icon: Sparkles },
            { id: 'interactive_tool', label: '៣. ឧបករណ៍អន្តរកម្ម & សាកល្បង', icon: Calculator },
            { id: 'exercises', label: '៤. លំហាត់អនុវត្ត & ចម្លើយ', icon: HelpCircle },
            { id: 'exam', label: '៥. វិញ្ញាសា QCM ៤០ សំណួរ', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3.5 py-2 rounded-2xl font-bold text-xs whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-purple-900 text-white shadow-md shadow-purple-900/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: THEORY / TEXTBOOK CONTENT */}
          {activeTab === 'theory' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Header Card with SVG Cover Background */}
              <div className="relative overflow-hidden rounded-3xl border border-indigo-100 shadow-sm min-h-[160px]">
                <div className="absolute inset-0">
                  <MathLessonCover 
                    lessonNumber={currentPackage.lessonNumber}
                    title={currentPackage.title}
                    shortTitle={currentPackage.shortTitle}
                    color={currentPackage.color}
                    className="opacity-30 scale-110 blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/70 via-purple-50/70 to-blue-50/70" />
                </div>
                
                <div className="relative p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
                  <div className="flex-1">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-600 text-white shadow-sm">
                      សៀវភៅគោល ក្រសួងអប់រំ យុវជន និងកីឡា
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-3 font-moul drop-shadow-sm">
                      {curriculumData.title}
                    </h2>
                    <p className="text-xs text-slate-700 mt-1 font-medium max-w-2xl leading-relaxed">
                      {curriculumData.summary}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSpeak(`${curriculumData.title}។ ${curriculumData.summary}`)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 shadow-sm ${
                      speakingText ? 'bg-red-500 text-white animate-pulse' : 'bg-white hover:bg-purple-50 text-purple-900 border border-purple-200'
                    }`}
                  >
                    {speakingText ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{speakingText ? 'បញ្ឈប់ការអាន' : 'ស្តាប់អំណានសំឡេង'}</span>
                  </button>
                </div>
              </div>

              {/* Sections from MoEYS Curriculum */}
              <div className="space-y-4">
                {curriculumData.sections.map((sec, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-black">
                          {idx + 1}
                        </span>
                        <span>{sec.title}</span>
                      </h3>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                        ទំព័រ {sec.page}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {sec.theory}
                    </p>

                    {sec.formula && (
                      <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-bold">
                        <span className="text-amber-600">📐 រូបមន្ត៖</span>
                        <code className="bg-white px-2 py-1 rounded-md text-purple-900 border border-amber-200">
                          {sec.formula}
                        </code>
                      </div>
                    )}

                    {sec.examples && sec.examples.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-600">💡 ឧទាហរណ៍ជាក់ស្តែង ៖</span>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-1">
                          {sec.examples.map((ex, eIdx) => (
                            <li key={eIdx} className="leading-relaxed">
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FORMULAS & PROBLEM-SOLVING STRATEGIES */}
          {activeTab === 'formulas' && (
            <div className="space-y-5 max-w-4xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-amber-950 text-base">កម្រងរូបមន្ត និងគន្លឹះដោះស្រាយ ({currentPackage.shortTitle})</h3>
                  <p className="text-xs text-amber-800 mt-1">ក្បួនគណិតវិទ្យា និងលក្ខណៈសំខាន់ៗដែលត្រូវចងចាំ</p>
                </div>
                <Sparkles className="w-8 h-8 text-amber-500 shrink-0" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPackage.formulas.map((fSec, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                    <h4 className="font-bold text-purple-950 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{fSec.title}</span>
                    </h4>
                    <div className="space-y-2">
                      {fSec.items && fSec.items.map((item, iIdx) => (
                        <div key={iIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-indigo-950">
                            <span>{item.name}</span>
                            <span className="text-purple-600 font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                              {item.formula}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{item.description}</p>
                          {item.example && (
                            <p className="text-emerald-700 font-medium text-[11px] pt-1 border-t border-slate-200/60">
                              <strong>ឧ.</strong> {item.example}
                            </p>
                          )}
                        </div>
                      ))}
                      {fSec.details && (
                        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {fSec.details.map((detail, dIdx) => (
                            <li key={dIdx} className="leading-relaxed">
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE TOOL SANDBOX */}
          {activeTab === 'interactive_tool' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-3xl p-5 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">ឧបករណ៍អនុវត្តជាក់ស្តែង</span>
                  <h3 className="text-lg font-bold mt-1 font-moul">ម៉ាស៊ីនពិសោធន៍ និងគណនាអន្តរកម្ម ({currentPackage.shortTitle})</h3>
                  <p className="text-xs text-teal-100 mt-1">កែប្រែទិន្នន័យដើម្បីមើលជំហានដោះស្រាយ និងចម្លើយដោយស្វ័យប្រវត្តិ</p>
                </div>
                <Calculator className="w-8 h-8 text-teal-200 shrink-0" />
              </div>

              {/* RENDER DEDICATED TOOL PER LESSON */}
              {currentLessonNumber === 1 ? (
                /* Lesson 1 Spike Abacus & Number Place Value Tool */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm">ក្បាច់រាប់ (Spike Abacus) & តម្លៃលេខតាមខ្ទង់</h4>
                  <div className="grid grid-cols-7 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    {['លាន', 'សែន', 'ម៉ឺន', 'ពាន់', 'រយ', 'ដប់', 'រាយ'].map((unit, i) => (
                      <div key={unit} className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-purple-900 mb-2">{unit}</span>
                        <div className="h-28 w-4 bg-slate-300 rounded-full flex flex-col justify-end p-0.5 gap-0.5">
                          {Array.from({ length: abacusDigits[i] || 0 }).map((_, dotIdx) => (
                            <div key={dotIdx} className="w-3 h-3 rounded-full bg-purple-600 shrink-0 shadow-xs" />
                          ))}
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="9"
                          value={abacusDigits[i]}
                          onChange={(e) => {
                            const val = Math.max(0, Math.min(9, Number(e.target.value) || 0));
                            const next = [...abacusDigits];
                            next[i] = val;
                            setAbacusDigits(next);
                          }}
                          className="w-10 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg mt-2 p-1 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <span className="text-xs text-purple-900">ចំនួនសរុប ៖ <strong className="text-base text-purple-950 font-mono">{abacusDigits.join('')}</strong></span>
                    <span className="text-xs text-slate-600 font-mono">
                      = {abacusDigits.map((d, idx) => `${d} × 10^${6 - idx}`).join(' + ')}
                    </span>
                  </div>
                </div>
              ) : currentLessonNumber >= 2 && currentLessonNumber <= 5 ? (
                /* Decimals Simulator (Lessons 2, 3, 4, 5) */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm">ប្រមាណវិធីលើចំនួនទសភាគ (វិធីបូក ដក គុណ និងចែក)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ចំនួនទសភាគទី ១ ៖</label>
                      <input
                        type="number"
                        step="0.01"
                        value={decNumA}
                        onChange={(e) => setDecNumA(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ចំនួនទសភាគទី ២ ៖</label>
                      <input
                        type="number"
                        step="0.01"
                        value={decNumB}
                        onChange={(e) => setDecNumB(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Calculations grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-center">
                      <span className="text-[11px] text-blue-700 font-bold block">វិធីបូក (+)</span>
                      <span className="text-base font-black text-blue-950 font-mono mt-1 block">
                        {(decNumA + decNumB).toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-center">
                      <span className="text-[11px] text-emerald-700 font-bold block">វិធីដក (-)</span>
                      <span className="text-base font-black text-emerald-950 font-mono mt-1 block">
                        {(decNumA - decNumB).toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-center">
                      <span className="text-[11px] text-amber-700 font-bold block">វិធីគុណ (×)</span>
                      <span className="text-base font-black text-amber-950 font-mono mt-1 block">
                        {(decNumA * decNumB).toFixed(3)}
                      </span>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl text-center">
                      <span className="text-[11px] text-purple-700 font-bold block">វិធីចែក (÷)</span>
                      <span className="text-base font-black text-purple-950 font-mono mt-1 block">
                        {decNumB !== 0 ? (decNumA / decNumB).toFixed(3) : 'គ្មានន័យ'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : currentLessonNumber >= 7 && currentLessonNumber <= 11 ? (
                /* Fraction Calculator (Lessons 7-11) */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm">ប្រមាណវិធីលើប្រភាគ (បូក ដក គុណ ចែក និងសម្រួល)</h4>
                  <div className="flex items-center justify-center gap-6 py-4 bg-slate-50 rounded-2xl border border-slate-200">
                    {/* Frac 1 */}
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        value={fracNum1}
                        onChange={(e) => setFracNum1(Number(e.target.value) || 1)}
                        className="w-14 text-center font-bold border border-slate-300 rounded-lg p-1"
                      />
                      <div className="w-16 h-0.5 bg-slate-700 my-1"></div>
                      <input
                        type="number"
                        min="1"
                        value={fracDen1}
                        onChange={(e) => setFracDen1(Number(e.target.value) || 1)}
                        className="w-14 text-center font-bold border border-slate-300 rounded-lg p-1"
                      />
                    </div>

                    <span className="text-lg font-black text-slate-400">និង</span>

                    {/* Frac 2 */}
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        value={fracNum2}
                        onChange={(e) => setFracNum2(Number(e.target.value) || 1)}
                        className="w-14 text-center font-bold border border-slate-300 rounded-lg p-1"
                      />
                      <div className="w-16 h-0.5 bg-slate-700 my-1"></div>
                      <input
                        type="number"
                        min="1"
                        value={fracDen2}
                        onChange={(e) => setFracDen2(Number(e.target.value) || 1)}
                        className="w-14 text-center font-bold border border-slate-300 rounded-lg p-1"
                      />
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <span className="font-bold text-blue-900">វិធីគុណ (កា × ខ) ៖</span>
                      <p className="font-mono text-base font-black text-blue-950 mt-1">
                        {fracNum1 * fracNum2} / {fracDen1 * fracDen2}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <span className="font-bold text-purple-900">វិធីចែក (កា ÷ ខ) ៖</span>
                      <p className="font-mono text-base font-black text-purple-950 mt-1">
                        {fracNum1 * fracDen2} / {fracDen1 * fracNum2}
                      </p>
                    </div>
                  </div>
                </div>
              ) : currentLessonNumber === 12 || currentLessonNumber === 13 ? (
                /* Ratios & Proportions */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm">គណនាសមាមាត្រ (a/b = c/x នាំឱ្យ x = b × c / a)</h4>
                  <div className="flex items-center justify-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-base">
                    <input
                      type="number"
                      value={propA}
                      onChange={(e) => setPropA(Number(e.target.value) || 1)}
                      className="w-12 text-center font-bold border border-slate-300 rounded-lg p-1"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      value={propB}
                      onChange={(e) => setPropB(Number(e.target.value) || 1)}
                      className="w-12 text-center font-bold border border-slate-300 rounded-lg p-1"
                    />
                    <span className="font-black text-purple-700 mx-2">=</span>
                    <input
                      type="number"
                      value={propC}
                      onChange={(e) => setPropC(Number(e.target.value) || 1)}
                      className="w-12 text-center font-bold border border-slate-300 rounded-lg p-1"
                    />
                    <span>/</span>
                    <span className="px-3 py-1 bg-amber-200 border border-amber-400 font-black rounded-lg text-amber-950">
                      x = {propA !== 0 ? ((propB * propC) / propA).toFixed(1) : 0}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    ផលគុណតួចុង = ផលគុណក្រៅ ({propA} × x = {propB} × {propC})
                  </p>
                </div>
              ) : currentLessonNumber === 14 ? (
                /* Speed = Distance / Time */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm">រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល (v = s/t, s = v × t, t = s/v)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ល្បឿន (km/h) ៖</label>
                      <input
                        type="number"
                        value={speedVal}
                        onChange={(e) => setSpeedVal(Number(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">រយៈពេល (ម៉ោង) ៖</label>
                      <input
                        type="number"
                        step="0.5"
                        value={timeVal}
                        onChange={(e) => setTimeVal(Number(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">ចម្ងាយសរុប (s = v × t) ៖</span>
                    <span className="text-lg font-black text-emerald-950 font-mono">
                      {(speedVal * timeVal).toFixed(1)} គីឡូម៉ែត្រ (km)
                    </span>
                  </div>
                </div>
              ) : currentLessonNumber === 16 ? (
                /* Percentages */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm">គណនាភាគរយ (%) នៃចំនួនមួយ</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ចំនួនដើម (រៀល ឬឯកតា) ៖</label>
                      <input
                        type="number"
                        value={baseVal}
                        onChange={(e) => setBaseVal(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">អត្រាភាគរយ (%) ៖</label>
                      <input
                        type="number"
                        value={percentRate}
                        onChange={(e) => setPercentRate(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900">តម្លៃ {percentRate}% នៃ {baseVal.toLocaleString()} ៖</span>
                    <span className="text-lg font-black text-indigo-950 font-mono">
                      {((baseVal * percentRate) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : currentLessonNumber === 17 ? (
                /* Interest */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm">គណនាការប្រាក់ទោល (I = P × r × t)</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">ប្រាក់ដើម (P) $ ៖</label>
                      <input
                        type="number"
                        value={principalVal}
                        onChange={(e) => setPrincipalVal(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">អត្រាការប្រាក់ (r%) ៖</label>
                      <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">រយៈពេល (t ឆ្នាំ) ៖</label>
                      <input
                        type="number"
                        value={interestTimeYears}
                        onChange={(e) => setInterestTimeYears(Number(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">ការប្រាក់សរុប (I) ៖ ${(principalVal * (interestRate / 100) * interestTimeYears).toFixed(2)}</span>
                      <span className="text-[11px] text-amber-700">ប្រាក់សរុប (A = P + I) ៖ ${(principalVal + (principalVal * (interestRate / 100) * interestTimeYears)).toFixed(2)}</span>
                    </div>
                    <DollarSign className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              ) : currentLessonNumber === 20 ? (
                /* Volume and Surface Area */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm">គណនាមាឌប្រលេពីប៉ែតកែង (V = b × l × h)</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">បណ្តោយ (l) cm ៖</label>
                      <input
                        type="number"
                        value={boxLength}
                        onChange={(e) => setBoxLength(Number(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">ទទឹង (w) cm ៖</label>
                      <input
                        type="number"
                        value={boxWidth}
                        onChange={(e) => setBoxWidth(Number(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">កម្ពស់ (h) cm ៖</label>
                      <input
                        type="number"
                        value={boxHeight}
                        onChange={(e) => setBoxHeight(Number(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-900 block">មាឌ (V) = {boxLength * boxWidth * boxHeight} cm³</span>
                      <span className="text-[11px] text-indigo-700">ផ្ទៃក្រឡាខាង = {2 * (boxLength + boxWidth) * boxHeight} cm²</span>
                    </div>
                    <Box className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              ) : (
                /* Fallback general interactive calculation sandbox */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs text-center">
                  <p className="text-xs text-slate-600">
                    ម៉ាស៊ីនគណនាគំរូនៃមេរៀនទី {currentLessonNumber} ({currentPackage.shortTitle}) ត្រូវបានភ្ជាប់ដោយស្វ័យប្រវត្តិក្បែរកម្រងសំណួរ QCM ៤០ សំណួរ។
                  </p>
                  <button
                    onClick={() => {
                      if (onOpenExam) onOpenExam(currentLessonNumber);
                    }}
                    className="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl text-xs font-bold transition shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>ចូលធ្វើតេស្ត QCM ៤០ សំណួរ</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EXERCISES & PRACTICE */}
          {activeTab === 'exercises' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-blue-950 text-base">លំហាត់អនុវត្តសៀវភៅសិក្សាគោល ({currentPackage.shortTitle})</h3>
                  <p className="text-xs text-blue-800 mt-1">លំហាត់ហ្វឹកហាត់សមត្ថភាព និងគន្លឹះចម្លើយពន្យល់</p>
                </div>
                <HelpCircle className="w-8 h-8 text-blue-500 shrink-0" />
              </div>

              <div className="space-y-4">
                {curriculumData.sections.flatMap((s) => s.exercises || []).length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                    មិនមានលំហាត់បន្ថែមក្នុងផ្នែកនេះទេ។ សូមចូលធ្វើវិញ្ញាសា QCM ៤០ សំណួរ!
                  </div>
                ) : (
                  curriculumData.sections.flatMap((s, sIdx) =>
                    (s.exercises || []).map((ex, exIdx) => {
                      const key = `${sIdx}-${exIdx}`;
                      const isRevealed = revealedSolutions[key];
                      return (
                        <div key={key} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                              {ex}
                            </span>
                            <button
                              onClick={() => toggleSolution(key)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isRevealed ? 'លាក់ចម្លើយ' : 'បង្ហាញចម្លើយ'}</span>
                            </button>
                          </div>
                          {isRevealed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1"
                            >
                              <span className="font-bold flex items-center gap-1 text-emerald-800">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> គន្លឹះដោះស្រាយ ៖
                              </span>
                              <p className="leading-relaxed">
                                សូមអនុវត្តតាមក្បួនរូបមន្តនៃ{s.title} និងពិនិត្យលក្ខខណ្ឌខ្នាតរង្វាស់ឱ្យបានច្បាស់លាស់។
                              </p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })
                  )
                )}
              </div>
            </div>
          )}

          {/* TAB 5: 40-QUESTION QCM OVERVIEW & LAUNCH */}
          {activeTab === 'exam' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                    វិញ្ញាសាផ្លូវការ ៤០ សំណួរ
                  </span>
                  <h3 className="text-xl font-bold font-moul mt-2">
                    {currentPackage.title}
                  </h3>
                  <p className="text-xs text-purple-200 mt-1 max-w-xl">
                    វិញ្ញាសាពហុជ្រើសរើស (QCM) ចំនួន ៤០ សំណួរ ពេញលេញគ្រប់ជ្រុងជ្រោយ អមដោយរូបភាពដ្យាក្រាមពន្យល់ ក្ដារព្រាងគណនា នាឡិការាប់ថយក្រោយ ៦០ នាទី និងតារាងរូបមន្តជំនួយ។
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (onOpenExam) {
                      onOpenExam(currentLessonNumber);
                    } else {
                      onShowToast?.(`បើកវិញ្ញាសា QCM ៤០ សំណួរនៃមេរៀនទី ${currentLessonNumber}`);
                    }
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 rounded-2xl font-black text-sm shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>ចាប់ផ្តើមប្រឡងឥឡូវនេះ</span>
                </button>
              </div>

              {/* Questions Structure Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentPackage.questions.slice(0, 4).map((q, idx) => (
                  <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                      <span>សំណួរទី {idx + 1}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{q.partSubtitle}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-2">{q.question}</p>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="text-[11px] p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 line-clamp-1">
                          {['ក', 'ខ', 'គ', 'ឃ'][oIdx]}. {opt.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-slate-500">
                និងសំណួរជាច្រើនទៀតសរុប ៤០ សំណួរពេញលេញ...
              </p>
            </div>
          )}
        </div>

        {/* Bottom Bar with Next / Prev Lesson Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => handleLessonSwitch(Math.max(1, currentLessonNumber - 1))}
            disabled={currentLessonNumber <= 1}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentLessonNumber <= 1
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>← មេរៀនមុន</span>
          </button>

          <span className="text-xs font-bold text-slate-600 hidden sm:inline">
            មេរៀនទី {toKhmerNum(currentLessonNumber)} នៃ ២០
          </span>

          <button
            onClick={() => handleLessonSwitch(Math.min(20, currentLessonNumber + 1))}
            disabled={currentLessonNumber >= 20}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentLessonNumber >= 20
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs active:scale-95'
            }`}
          >
            <span>មេរៀនបន្ទាប់ →</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
