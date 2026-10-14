import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Award,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Bookmark,
  Maximize2,
  Minimize2,
  PenTool,
  Eraser,
  Trash2,
  ArrowLeft,
  Info,
  Layers,
  Calculator,
  Grid
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MathQCMQuestion } from '../data/mathQcmTypes';
import {
  ALL_MATH_LESSONS_PACKAGES,
  getMathLessonPackage,
  MathLessonPackage,
} from '../data/mathLessonQcm';
import { MathQuestionVisualDiagram } from './MathQuestionVisualDiagram';

interface MathLesson1ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  initialLessonNumber?: number;
}

export const MathLesson1ExamModal: React.FC<MathLesson1ExamModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  initialLessonNumber = 1,
}) => {
  const [selectedLessonNumber, setSelectedLessonNumber] = useState<number>(initialLessonNumber || 1);
  const currentLessonPackage: MathLessonPackage = useMemo(
    () => getMathLessonPackage(selectedLessonNumber),
    [selectedLessonNumber]
  );

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(60 * 60); // 60 minutes = 3600 seconds
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showQuestionList, setShowQuestionList] = useState<boolean>(false);
  const [questions, setQuestions] = useState<MathQCMQuestion[]>(() => currentLessonPackage.questions);

  // Sync initialLessonNumber prop
  useEffect(() => {
    if (initialLessonNumber) {
      setSelectedLessonNumber(initialLessonNumber);
    }
  }, [initialLessonNumber]);

  // Modals for Scratchpad and Formulas
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [isFormulasOpen, setIsFormulasOpen] = useState<boolean>(false);

  // Scratchpad drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState<string>('#1e293b'); // Navy dark
  const [brushSize, setBrushSize] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset or initialize on open or lesson switch
  useEffect(() => {
    if (isOpen) {
      setCurrentQIndex(0);
      setSelectedAnswers({});
      setBookmarkedQuestions({});
      setIsSubmitted(false);
      setTimeRemainingSeconds(60 * 60);
      setIsSpeaking(false);
      setShowQuestionList(false);

      const pkg = getMathLessonPackage(selectedLessonNumber);
      const shuffled = (pkg.questions || []).map((q) => {
        if (q.options && q.options.length > 0) {
          return {
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5),
          };
        }
        return q;
      });
      setQuestions(shuffled);
    }
  }, [isOpen, selectedLessonNumber]);

  // Handler for switching lessons
  const handleSwitchLesson = (newLessonNum: number) => {
    setSelectedLessonNumber(newLessonNum);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setBookmarkedQuestions({});
    setIsSubmitted(false);
    setTimeRemainingSeconds(60 * 60);
    setIsSpeaking(false);
    setShowQuestionList(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // Toggle answering-exam class on document.body to hide bottom bar
  useEffect(() => {
    if (isOpen && !isSubmitted) {
      document.body.classList.add('answering-exam');
    } else {
      document.body.classList.remove('answering-exam');
    }
    return () => {
      document.body.classList.remove('answering-exam');
    };
  }, [isOpen, isSubmitted]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isSubmitted || timeRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSubmitted, timeRemainingSeconds]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentQIndex < questions.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentQIndex > 0) {
        setCurrentQIndex((prev) => prev - 1);
      } else if (e.key === 'Escape' && isScratchpadOpen) {
        setIsScratchpadOpen(false);
      } else if (e.key === 'Escape' && isFormulasOpen) {
        setIsFormulasOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentQIndex, isScratchpadOpen, isFormulasOpen, questions.length]);

  if (!isOpen) return null;

  const currentQ: MathQCMQuestion = questions[currentQIndex] || MATH_LESSON_1_40_QUESTIONS[currentQIndex];
  const optionLabels = ['ក', 'ខ', 'គ', 'ឃ'];
  const answeredCount = Object.keys(selectedAnswers).length;

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSelectOption = (optIndex: number) => {
    // Allows selecting and changing, while instant explanation appears
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIndex,
    }));
  };

  const toggleBookmark = (qIdx: number) => {
    setBookmarkedQuestions((prev) => {
      const updated = { ...prev, [qIdx]: !prev[qIdx] };
      if (!updated[qIdx]) {
        delete updated[qIdx];
      }
      return updated;
    });
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'km-KH';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correctCountLocal = 0;
    questions.forEach((q, idx) => {
      const userChoice = selectedAnswers[idx];
      const correctIdx = q.options.findIndex((o) => o.isCorrect);
      if (userChoice !== undefined && userChoice === correctIdx) {
        correctCountLocal += 1;
      }
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    const pct = Math.round((correctCountLocal / questions.length) * 100);
    onShowToast?.(`បានបញ្ចប់ការប្រឡង! ទទួលបាន ${correctCountLocal}/${questions.length} ពិន្ទុ (${pct}%)`);
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setBookmarkedQuestions({});
    setIsSubmitted(false);
    setTimeRemainingSeconds(60 * 60);

    // Re-shuffle on restart
    const shuffled = MATH_LESSON_1_40_QUESTIONS.map((q) => {
      if (q.options && q.options.length > 0) {
        return {
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5),
        };
      }
      return q;
    });
    setQuestions(shuffled);
  };

  // Calculate score for results
  const correctCount = questions.reduce((acc, q, idx) => {
    const userChoice = selectedAnswers[idx];
    const correctIdx = q.options.findIndex((o) => o.isCorrect);
    return userChoice === correctIdx ? acc + 1 : acc;
  }, 0);
  const percentage = Math.round((correctCount / questions.length) * 100);

  // Scratchpad Canvas Helpers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = drawingTool === 'eraser' ? brushSize * 4 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (drawingTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 overflow-hidden">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full h-full flex flex-col bg-[#fcfcfd] text-slate-800 overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        >
          {/* ================= TOP NAVIGATION BAR (IMG_4032 STYLE) ================= */}
          <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-xs z-20">
            {/* Back Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ត្រឡប់</span>
              </button>

              {/* Lesson Switcher Dropdown (1 to 20) */}
              <div className="flex items-center gap-1">
                <select
                  value={selectedLessonNumber}
                  onChange={(e) => handleSwitchLesson(Number(e.target.value))}
                  className="bg-purple-50/95 border border-purple-300 text-purple-950 font-black text-xs px-2.5 py-1.5 rounded-xl cursor-pointer shadow-2xs hover:bg-purple-100 transition focus:outline-none focus:ring-2 focus:ring-purple-400 max-w-[170px] sm:max-w-[280px] truncate"
                  title="ជ្រើសរើសមេរៀនគណិតវិទ្យា (មេរៀនទី ១ ដល់ ២០)"
                >
                  {ALL_MATH_LESSONS_PACKAGES.map((pkg) => (
                    <option key={pkg.lessonNumber} value={pkg.lessonNumber}>
                      {pkg.icon} {pkg.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Middle Section: Fullscreen & Timer */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition active:scale-95 cursor-pointer hidden sm:flex items-center justify-center"
                title="ពង្រីកពេញអេក្រង់"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Timer Pill matching IMG_4032 (amber badge with clock icon) */}
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-900 font-mono text-xs sm:text-sm font-bold shadow-2xs">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>{timerDisplay}</span>
              </div>
            </div>

            {/* Question Counter Pill matching IMG_4032 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuestionList(!showQuestionList)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-900 font-bold text-xs sm:text-sm transition active:scale-95 cursor-pointer shadow-2xs"
                title="បង្ហាញបញ្ជីសំណួរទាំង ៤០"
              >
                <Grid className="w-3.5 h-3.5 text-purple-700" />
                <span>{currentQIndex + 1} / {questions.length}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 cursor-pointer"
                title="បិទ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Floating Question Grid Popover */}
          <AnimatePresence>
            {showQuestionList && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[60px] left-4 right-4 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-2xl p-4 sm:p-5 z-40 max-w-lg mx-auto"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Grid className="w-4 h-4 text-purple-600" />
                    <span>បញ្ជីសំណួរទាំង ៤០ (ប៉ះដើម្បីផ្លោះទៅសំណួរនីមួយៗ)</span>
                  </h4>
                  <button
                    onClick={() => setShowQuestionList(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    បិទ
                  </button>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-52 overflow-y-auto p-0.5">
                  {questions.map((_, qIdx) => {
                    const isAnswered = selectedAnswers[qIdx] !== undefined;
                    const isCurrent = qIdx === currentQIndex;
                    const isBookmarked = bookmarkedQuestions[qIdx];

                    let pillClass = 'bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-slate-200';
                    if (isCurrent) {
                      pillClass = 'bg-purple-600 text-white border-2 border-purple-400 ring-2 ring-purple-100 shadow-sm font-black';
                    } else if (isAnswered) {
                      pillClass = 'bg-emerald-500 text-white border-emerald-400 shadow-2xs font-bold';
                    } else if (isBookmarked) {
                      pillClass = 'bg-amber-500 text-white border-amber-400 shadow-2xs font-bold';
                    }

                    return (
                      <button
                        key={qIdx}
                        onClick={() => {
                          setCurrentQIndex(qIdx);
                          setShowQuestionList(false);
                        }}
                        className={`aspect-square rounded-xl text-xs font-bold transition flex flex-col items-center justify-center relative cursor-pointer active:scale-95 ${pillClass}`}
                      >
                        <span>{qIdx + 1}</span>
                        {isBookmarked && !isCurrent && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100 font-medium">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-purple-600 rounded-md" />
                    <span>កំពុងឆ្លើយ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-md" />
                    <span>បានឆ្លើយរួច</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-md" />
                    <span>កត់ចំណាំ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-slate-100 border border-slate-200/60 rounded-md" />
                    <span>មិនទាន់ឆ្លើយ</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= ACTION BUTTONS BAR (IMG_4032 STYLE) ================= */}
          <div className="px-4 py-2.5 sm:px-6 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap shrink-0">
            <div className="flex items-center gap-2">
              {/* Scratchpad Trigger Button */}
              <button
                onClick={() => setIsScratchpadOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>ក្តារខៀន/ក្រដាសព្រាង</span>
              </button>

              {/* Key Formulas Trigger Button */}
              <button
                onClick={() => setIsFormulasOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>រូបមន្តសំខាន់ៗ</span>
              </button>
            </div>

            <div className="text-[11px] font-semibold text-slate-500">
              សំណួរទី <strong>{currentQIndex + 1}</strong> នៃ <strong>{questions.length}</strong> • ឆ្លើយបាន <strong>{answeredCount}</strong> សំណួរ
            </div>
          </div>

          {/* Thin Progress bar at top of exam content (Question matrix hidden during answering as requested) */}
          <div className="w-full bg-slate-200/70 h-1.5 overflow-hidden shrink-0">
            <div
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 h-full transition-all duration-300"
              style={{
                width: `${((currentQIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* ================= MAIN CONTENT AREA ================= */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {!isSubmitted ? (
              <div className="space-y-4 max-w-3xl mx-auto">
                {/* Part Header Card matching IMG_4032 */}
                <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/60 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-purple-600 text-white rounded-lg shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-purple-950 leading-snug">
                        {currentLessonPackage.title} • {currentQ.part}
                      </h4>
                      <p className="text-[10px] text-purple-700/80 font-medium">
                        {currentQ.partSubtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-purple-900 bg-white/80 px-2.5 py-1 rounded-xl border border-purple-200 shrink-0">
                    សំណួរ {currentQIndex + 1}/{questions.length}
                  </span>
                </div>

                {/* Question Box Card matching IMG_4032 & IMG_4033 */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
                  {/* Question Header: Badge + TTS + Bookmark */}
                  <div className="flex items-center justify-between gap-2 pb-1">
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/60">
                      សំណួរទី {currentQIndex + 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Audio Button */}
                      <button
                        onClick={() => handleSpeak(`${currentQ.question}. ជម្រើស ក ${currentQ.options[0]?.text}. ជម្រើស ខ ${currentQ.options[1]?.text}. ជម្រើស គ ${currentQ.options[2]?.text}. ជម្រើស ឃ ${currentQ.options[3]?.text}`)}
                        className={`p-2 rounded-xl border transition active:scale-95 cursor-pointer ${
                          isSpeaking
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                        title="អានសំណួរជាសំឡេងខ្មែរ"
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(currentQIndex)}
                        className={`p-2 rounded-xl border transition active:scale-95 cursor-pointer ${
                          bookmarkedQuestions[currentQIndex]
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                        title="កត់ចំណាំសំណួរនេះ"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-moul sm:font-sans">
                    {currentQIndex + 1}. {currentQ.question}
                  </h3>

                  {/* Math Visual Diagram tailored for every question */}
                  <MathQuestionVisualDiagram
                    question={currentQ}
                    questionIndex={currentQIndex}
                    lessonNumber={selectedLessonNumber}
                  />

                  {/* Options List matching IMG_4033 & IMG_4034 */}
                  <div className="space-y-2.5 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const userChoice = selectedAnswers[currentQIndex];
                      const isSelected = userChoice === optIdx;
                      const hasAnswered = userChoice !== undefined;
                      const isCorrect = opt.isCorrect;

                      // Exact styles from IMG_4033 and IMG_4034
                      let cardStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';
                      let badgeStyle = 'bg-slate-100 text-slate-600 border border-slate-200/60';

                      if (hasAnswered) {
                        if (isCorrect) {
                          // Green outline and checkmark for correct answer (IMG_4034)
                          cardStyle = 'bg-emerald-50/50 border-2 border-emerald-500 text-emerald-950 shadow-xs';
                          badgeStyle = 'bg-emerald-600 text-white font-bold';
                        } else if (isSelected && !isCorrect) {
                          // Red outline for wrong selection
                          cardStyle = 'bg-rose-50/50 border-2 border-rose-500 text-rose-950';
                          badgeStyle = 'bg-rose-600 text-white font-bold';
                        } else {
                          cardStyle = 'bg-white border-slate-200 opacity-60 text-slate-400';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer active:scale-95 ${cardStyle}`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${badgeStyle}`}>
                              {optionLabels[optIdx]}
                            </span>
                            <span className="text-sm font-semibold leading-relaxed">
                              {opt.text}
                            </span>
                          </div>

                          {/* Checkmark icon on correct answer matching IMG_4034 */}
                          {hasAnswered && isCorrect && (
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Detailed Explanation Card matching IMG_4034 */}
                  {selectedAnswers[currentQIndex] !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs sm:text-sm space-y-1.5 shadow-2xs mt-3"
                    >
                      <div className="font-bold flex items-center gap-1.5 text-amber-800">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>ការបកស្រាយលម្អិត៖</span>
                      </div>
                      <p className="leading-relaxed font-medium text-slate-700 pl-5">
                        {currentQ.explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              /* ================= RESULTS REVIEW MODE ================= */
              <div className="space-y-6 max-w-2xl mx-auto py-4">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl ring-4 ring-amber-200 animate-bounce">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-moul text-purple-950">
                      លទ្ធផលនៃការប្រឡង QCM {currentLessonPackage.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      មុខវិជ្ជា ៖ គណិតវិទ្យា ថ្នាក់ទី៦ • {currentLessonPackage.title}
                    </p>
                  </div>

                  <div className="inline-flex flex-wrap items-center justify-center gap-6 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 font-bold">ពិន្ទុសរុប</div>
                      <div className="text-2xl font-black text-purple-900 mt-0.5">
                        {correctCount} / {questions.length}
                      </div>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="text-center">
                      <div className="text-xs text-slate-500 font-bold">ភាគរយជោគជ័យ</div>
                      <div className="text-2xl font-black text-emerald-600 mt-0.5">
                        {percentage}%
                      </div>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="text-center">
                      <div className="text-xs text-slate-500 font-bold">កម្រិតសមត្ថភាព</div>
                      <div className="text-xs font-black px-3 py-1 rounded-xl bg-amber-400 text-slate-950 mt-1">
                        {percentage >= 90
                          ? '🌟 ល្អឥតខ្ចោះ'
                          : percentage >= 75
                          ? '🥇 ល្អណាស់'
                          : percentage >= 50
                          ? '👍 ល្អបង្គួរ'
                          : '💪 ត្រូវខិតខំបន្ថែម'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review All 40 Questions */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>ត្រួតពិនិត្យចម្លើយទាំង ៤០ សំណួរ</span>
                    </h4>
                    <span className="text-xs text-slate-500 font-bold">
                      ត្រូវ {correctCount} / ខុស {questions.length - correctCount}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {questions.map((q, qIdx) => {
                      const userChoice = selectedAnswers[qIdx];
                      const correctIdx = q.options.findIndex((o) => o.isCorrect);
                      const isCorrect = userChoice === correctIdx;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-2xl border transition ${
                            isCorrect
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-rose-50/50 border-rose-200'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                              }`}
                            >
                              {qIdx + 1}
                            </span>
                            <div className="flex-1 space-y-1.5">
                              <p className="text-sm font-bold text-slate-900 leading-snug">
                                {q.question}
                              </p>
                              <div className="text-xs space-y-1 pt-1">
                                <div className="text-emerald-800 font-semibold flex items-center gap-1">
                                  <span>✓ ចម្លើយត្រូវ ៖ </span>
                                  <span>{optionLabels[correctIdx]}. {q.options[correctIdx]?.text}</span>
                                </div>
                                {!isCorrect && userChoice !== undefined && (
                                  <div className="text-rose-700 font-medium">
                                    ✗ អ្នកបានជ្រើសរើស ៖ {optionLabels[userChoice]}. {q.options[userChoice]?.text}
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs leading-relaxed">
                                <strong className="text-slate-800">ការពន្យល់ ៖ </strong> {q.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= BOTTOM BAR (IMG_4033 & IMG_4034 STYLE) ================= */}
          <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-xs z-20">
            {!isSubmitted ? (
              <>
                {/* Previous Question Button matching IMG_4033 */}
                <button
                  type="button"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition active:scale-95 cursor-pointer shadow-2xs"
                >
                  <span>សំណួរមុន</span>
                </button>

                {/* Next Question / Finish Button matching IMG_4033 & IMG_4034 (burnt orange #b44606) */}
                <div className="flex items-center gap-2">
                  {currentQIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#c2410c] hover:bg-[#9a3412] text-white shadow-sm hover:shadow-orange-600/30 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>សំណួរបន្ទាប់</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>បញ្ចប់ការប្រឡង & មើលលទ្ធផល ({answeredCount}/{questions.length})</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>ប្រឡងឡើងវិញ</span>
                </button>

                {selectedLessonNumber < 20 && (
                  <button
                    type="button"
                    onClick={() => handleSwitchLesson(selectedLessonNumber + 1)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span>ទៅមេរៀនទី {selectedLessonNumber + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition active:scale-95 cursor-pointer"
                >
                  <span>បិទផ្ទាំង</span>
                </button>
              </>
            )}
          </div>

          {/* ================= MODAL 1: SCRATCHPAD WHITEBOARD (IMG_4031 STYLE) ================= */}
          {isScratchpadOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
              >
                {/* Header matching IMG_4031 */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <PenTool className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 text-base leading-snug">
                        ក្តារខៀន/ក្រដាសព្រាងគណនា (Scratchpad)
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        គូសរូប គណនាប្រមាណវិធី ឬព្រាងលេខដោយសេរី
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsScratchpadOpen(false)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Toolbar matching IMG_4031 */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap text-xs font-bold">
                  {/* Tool selection: Pen / Eraser */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDrawingTool('pen')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition ${
                        drawingTool === 'pen'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>ប៊ិច</span>
                    </button>

                    <button
                      onClick={() => setDrawingTool('eraser')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition ${
                        drawingTool === 'eraser'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Eraser className="w-3.5 h-3.5" />
                      <span>ជ័រលុប</span>
                    </button>
                  </div>

                  {/* Color palette matching IMG_4031 */}
                  <div className="flex items-center gap-1.5">
                    {[
                      { color: '#1e293b', label: 'Dark Navy' },
                      { color: '#2563eb', label: 'Blue' },
                      { color: '#ef4444', label: 'Red' },
                      { color: '#10b981', label: 'Green' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        onClick={() => {
                          setPenColor(c.color);
                          setDrawingTool('pen');
                        }}
                        style={{ backgroundColor: c.color }}
                        className={`w-6 h-6 rounded-full transition active:scale-95 ${
                          penColor === c.color && drawingTool === 'pen'
                            ? 'ring-2 ring-emerald-500 ring-offset-2 scale-110'
                            : 'hover:opacity-80'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>

                  {/* Size slider & Clear all button */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span>ទំហំ ៖</span>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-16 accent-emerald-600 cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={clearCanvas}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>លុបទាំងអស់</span>
                    </button>
                  </div>
                </div>

                {/* Graph paper Canvas Area matching IMG_4031 */}
                <div
                  className="relative h-80 sm:h-96 w-full overflow-hidden cursor-crosshair"
                  style={{
                    backgroundColor: '#ffffff',
                    backgroundImage: `
                      linear-gradient(to right, rgba(203, 213, 225, 0.5) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(203, 213, 225, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full touch-none"
                  />
                </div>

                {/* Footer hint matching IMG_4031 */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
                  💡 ប្រើម្រាមដៃ ឬកណ្ដុរដើម្បីសរសេរព្រាងលេខនៅលើក្តារខៀននេះបានភ្លាមៗ
                </div>
              </motion.div>
            </div>
          )}

          {/* ================= MODAL 2: KEY FORMULAS MODAL ================= */}
          {isFormulasOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-indigo-950 text-white">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-white/10 text-amber-400">
                      <BookOpen className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-base leading-snug">
                        រូបមន្ត & ក្បួនសំខាន់ៗ ៖ {currentLessonPackage.title}
                      </h3>
                      <p className="text-xs text-indigo-200">
                        ថ្នាក់ទី៦ • ឯកសារយោង និងក្បួនចងចាំ (ទំព័រ {currentLessonPackage.startPage} - {currentLessonPackage.endPage})
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFormulasOpen(false)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
                  {currentLessonPackage.formulas.map((f, fIdx) => (
                    <div key={fIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <h4 className="font-bold text-indigo-900 text-sm">{f.title}</h4>
                      <p className="text-slate-600 font-medium">{f.description}</p>
                      <ul className="space-y-1 pl-4 list-disc text-slate-700">
                        {f.details.map((d, dIdx) => (
                          <li key={dIdx} className="leading-relaxed">{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                  <button
                    onClick={() => setIsFormulasOpen(false)}
                    className="px-5 py-2 rounded-xl bg-indigo-900 text-white font-bold text-xs hover:bg-indigo-800 transition cursor-pointer"
                  >
                    យល់ព្រម
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const MathLessonExamModal = MathLesson1ExamModal;

