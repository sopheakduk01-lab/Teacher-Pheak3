import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RotateCcw,
  BookOpen,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  PenTool,
  Eraser,
  Trash2,
  Download,
  Calendar,
  Grid,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
  FileText,
  Printer,
  ListFilter,
  Check,
  CheckCircle2
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

type StandThemeKey = 'pink' | 'ocean' | 'midnight' | 'mint';

interface ThemeDefinition {
  name: string;
  badge: string;
  ring: string;
  body: string;
  footing: string;
  accentBtn: string;
  textHighlight: string;
  coverBg: string;
  coverBadge: string;
}

const THEMES: Record<StandThemeKey, ThemeDefinition> = {
  pink: {
    name: 'Pastel Pink (ផ្កាឈូក)',
    badge: 'from-pink-500 to-rose-400',
    ring: 'ring-pink-400',
    body: 'bg-gradient-to-b from-pink-500 via-rose-500 to-pink-600',
    footing: 'bg-gradient-to-b from-pink-700 to-rose-950',
    accentBtn: 'from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-500/25',
    textHighlight: 'text-pink-600',
    coverBg: 'from-pink-50 via-white to-rose-50',
    coverBadge: 'border-pink-300 bg-pink-50 text-pink-700',
  },
  ocean: {
    name: 'Sky Cyan (ផ្ទៃមេឃ)',
    badge: 'from-sky-500 to-indigo-500',
    ring: 'ring-sky-400',
    body: 'bg-gradient-to-b from-sky-500 via-blue-600 to-indigo-600',
    footing: 'bg-gradient-to-b from-blue-800 to-slate-900',
    accentBtn: 'from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-sky-500/25',
    textHighlight: 'text-sky-600',
    coverBg: 'from-sky-50 via-white to-blue-50',
    coverBadge: 'border-sky-300 bg-sky-50 text-sky-700',
  },
  midnight: {
    name: 'Midnight Black & Gold (ខ្មៅមាស)',
    badge: 'from-zinc-800 to-stone-900',
    ring: 'ring-amber-400',
    body: 'bg-gradient-to-b from-zinc-800 via-neutral-900 to-black',
    footing: 'bg-gradient-to-b from-neutral-900 to-black',
    accentBtn: 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/25',
    textHighlight: 'text-amber-500',
    coverBg: 'from-zinc-900 via-neutral-900 to-black text-white',
    coverBadge: 'border-amber-400/50 bg-amber-400/10 text-amber-300',
  },
  mint: {
    name: 'Mint Emerald (បៃតងខ្ចី)',
    badge: 'from-emerald-500 to-teal-400',
    ring: 'ring-emerald-400',
    body: 'bg-gradient-to-b from-emerald-500 via-teal-600 to-emerald-700',
    footing: 'bg-gradient-to-b from-teal-800 to-slate-900',
    accentBtn: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25',
    textHighlight: 'text-emerald-600',
    coverBg: 'from-emerald-50 via-white to-teal-50',
    coverBadge: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  },
};

// Web Audio API synthesizer helper
let audioCtxInstance: AudioContext | null = null;
function playSynthesizedSound(type: 'flip' | 'correct' | 'wrong' | 'celebrate', enabled: boolean) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxInstance) {
      audioCtxInstance = new AudioContextClass();
    }
    if (audioCtxInstance.state === 'suspended') {
      audioCtxInstance.resume();
    }

    const ctx = audioCtxInstance;
    const now = ctx.currentTime;

    if (type === 'flip') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'correct') {
      [659.25, 830.61, 987.77].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'celebrate') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.15, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    }
  } catch (err) {
    console.warn('Audio notice:', err);
  }
}

export const MathLesson1ExamModal: React.FC<MathLesson1ExamModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  initialLessonNumber = 1,
}) => {
  // Current active lesson package from the app
  const [selectedLessonNumber, setSelectedLessonNumber] = useState<number>(initialLessonNumber || 1);
  const currentLessonPackage: MathLessonPackage = useMemo(
    () => getMathLessonPackage(selectedLessonNumber),
    [selectedLessonNumber]
  );

  // Questions state (initialized with 40 QCM from existing app package)
  const [questions, setQuestions] = useState<MathQCMQuestion[]>(() => currentLessonPackage.questions);

  // Sync initialLessonNumber
  useEffect(() => {
    if (initialLessonNumber) {
      setSelectedLessonNumber(initialLessonNumber);
    }
  }, [initialLessonNumber]);

  // When selected lesson changes, refresh questions
  useEffect(() => {
    const pkg = getMathLessonPackage(selectedLessonNumber);
    setQuestions(pkg.questions || []);
    setCurrentStep(0);
    setUserAnswers({});
    setCurrentStreak(0);
  }, [selectedLessonNumber]);

  // 3D Stand Flip State
  // 0 = Cover page, 1..N = Questions, N+1 = Results summary
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [currentThemeKey, setCurrentThemeKey] = useState<StandThemeKey>('pink');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [flipAnimation, setFlipAnimation] = useState<'forward' | 'backward' | null>(null);

  // Modals for Scratchpad, Key Formulas, Question List Navigator, and PDF Kit
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [isFormulasOpen, setIsFormulasOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState<boolean>(false);
  const [hidePdfAnswers, setHidePdfAnswers] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Custom question accordion form
  const [isCustomFormOpen, setIsCustomFormOpen] = useState<boolean>(false);
  const [newQText, setNewQText] = useState<string>('');
  const [newQCategory, setNewQCategory] = useState<string>('');
  const [newOpt0, setNewOpt0] = useState<string>('');
  const [newOpt1, setNewOpt1] = useState<string>('');
  const [newOpt2, setNewOpt2] = useState<string>('');
  const [newOpt3, setNewOpt3] = useState<string>('');
  const [newQExplanation, setNewQExplanation] = useState<string>('');
  const [newCorrectIndex, setNewCorrectIndex] = useState<number>(0);

  // Scratchpad drawing canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState<string>('#1e293b');
  const [brushSize, setBrushSize] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeTheme = THEMES[currentThemeKey];

  // Letters in Khmer
  const letters = ['ក', 'ខ', 'គ', 'ឃ'];

  // Calculate score
  const score = useMemo(() => {
    let sc = 0;
    questions.forEach((q, idx) => {
      const chosen = userAnswers[idx];
      const correctIdx = q.options.findIndex((o) => o.isCorrect);
      if (chosen !== undefined && chosen === correctIdx) sc++;
    });
    return sc;
  }, [questions, userAnswers]);

  const percentage = Math.round((score / Math.max(1, questions.length)) * 100);

  // Flip animation helper
  const animateFlip = (dir: 'forward' | 'backward', callback: () => void) => {
    playSynthesizedSound('flip', soundEnabled);
    setFlipAnimation(dir);
    setTimeout(() => {
      setFlipAnimation(null);
      callback();
    }, 280);
  };

  const handleNextSlide = () => {
    if (currentStep <= questions.length) {
      animateFlip('forward', () => {
        setCurrentStep((prev) => prev + 1);
      });
    }
  };

  const handlePrevSlide = () => {
    if (currentStep > 0) {
      animateFlip('backward', () => {
        setCurrentStep((prev) => prev - 1);
      });
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentStep(0);
    setCurrentStreak(0);
    playSynthesizedSound('flip', soundEnabled);
    onShowToast?.('🔄 បានកំណត់ឡើងវិញត្រឡប់ទៅទំព័រគម្របដើម!');
  };

  const handleSelectAnswer = (questionIndex: number, chosenOptionIndex: number) => {
    if (userAnswers[questionIndex] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: chosenOptionIndex,
    }));

    const q = questions[questionIndex];
    const correctIdx = q.options.findIndex((o) => o.isCorrect);
    const isCorrect = chosenOptionIndex === correctIdx;

    if (isCorrect) {
      setCurrentStreak((prev) => prev + 1);
      playSynthesizedSound('correct', soundEnabled);
      onShowToast?.('✅ ត្រឹមត្រូវហើយ! អស្ចារ្យណាស់');
    } else {
      setCurrentStreak(0);
      playSynthesizedSound('wrong', soundEnabled);
      onShowToast?.('❌ មិនត្រឹមត្រូវទេ! ព្យាយាមសំណួរបន្ទាប់');
    }
  };

  // Trigger celebration on results page
  useEffect(() => {
    if (currentStep > questions.length) {
      if (percentage >= 80) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
        playSynthesizedSound('celebrate', soundEnabled);
      }
    }
  }, [currentStep, questions.length, percentage, soundEnabled]);

  // Touch Swipe Handlers for 3D Stand
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;

    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) handleNextSlide();
      else handlePrevSlide();
    } else if (Math.abs(diffY) > 50) {
      if (diffY < 0) handleNextSlide();
      else handlePrevSlide();
    }
  };

  // Add Custom Question
  const handleAddCustomQuestion = () => {
    if (!newQText.trim() || !newOpt0.trim() || !newOpt1.trim()) {
      onShowToast?.('⚠️ សូមបំពេញសំណួរ និងជម្រើសយ៉ាងតិច ២!');
      return;
    }

    const opts = [
      { text: newOpt0.trim(), isCorrect: newCorrectIndex === 0 },
      { text: newOpt1.trim(), isCorrect: newCorrectIndex === 1 },
    ];
    if (newOpt2.trim()) opts.push({ text: newOpt2.trim(), isCorrect: newCorrectIndex === 2 });
    if (newOpt3.trim()) opts.push({ text: newOpt3.trim(), isCorrect: newCorrectIndex === 3 });

    const newQ: MathQCMQuestion = {
      id: questions.length + 1,
      part: newQCategory.trim() || 'សំណួរផ្ទាល់ខ្លួន',
      partSubtitle: 'សំណួរដែលបានបញ្ចូលបន្ថែម',
      question: newQText.trim(),
      options: opts,
      explanation: newQExplanation.trim() || 'សំណួរដែលបានបញ្ចូលផ្ទាល់ខ្លួន។',
      points: 1,
    };

    setQuestions((prev) => [...prev, newQ]);

    // Reset fields
    setNewQText('');
    setNewQCategory('');
    setNewOpt0('');
    setNewOpt1('');
    setNewOpt2('');
    setNewOpt3('');
    setNewQExplanation('');
    setNewCorrectIndex(0);
    setIsCustomFormOpen(false);

    onShowToast?.('🎉 បានបញ្ចូលសំណួរថ្មីជោគជ័យ!');
  };

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

  // Scratchpad drawing handlers
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

    ctx.strokeStyle = drawingTool === 'eraser' ? '#ffffff' : penColor;
    ctx.lineWidth = drawingTool === 'eraser' ? 24 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
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

  // Render Printable Kit dynamically for Print & PDF Modal
  const renderPrintableArea = () => {
    return (
      <div id="printableArea" className="w-full max-w-[760px] bg-white p-6 sm:p-8 rounded-2xl shadow-sm text-slate-800 space-y-10">
        {/* PAGE 1: FOLDABLE TRIANGLE STAND BLUEPRINT (A4) */}
        <div className="page-break space-y-4">
          <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">សន្លឹកទី ១ នៃសម្ភារឧបទ្ទេស</span>
              <h2 className="text-xl font-black text-slate-900">គំរូប្លង់ជើងទម្រត្រីកោណលើតុ (DIY Foldable Desk Stand)</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                បោះពុម្ពលើក្រដាសរឹង (Cardstock 200g+) ➡️ កាត់តាមបន្ទាត់ដាច់ៗ ➡️ បត់តាមបន្ទាត់ចុចៗ ➡️ បិទកាវផ្គុំជាត្រីកោណ
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">A4 STAND BLUEPRINT</span>
          </div>

          <div className="border-2 border-slate-400 rounded-3xl p-5 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
            {/* Top Attachment with Holes */}
            <div className="border-2 border-dashed border-slate-400 rounded-2xl p-4 bg-pink-50/50 mb-3 text-center">
              <span className="text-[10px] font-bold text-pink-700 uppercase tracking-widest block mb-1">
                កន្លែងចោះប្រហោងកងដែក ឬដោតខ្សែចង (Top Spiral Punch Area)
              </span>
              <div className="flex justify-around max-w-sm mx-auto py-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="w-4 h-4 rounded-full border-2 border-pink-500 bg-white inline-block"></span>
                ))}
              </div>
            </div>

            {/* Front Stand Face */}
            <div className="border-2 border-slate-300 rounded-2xl p-6 bg-white text-center shadow-inner my-3">
              <span className="text-xs font-bold text-slate-500">ផ្ទៃមុខខាងមុខ (Front Display Face)</span>
              <h3 className="text-base font-black text-slate-800 mt-2">
                កម្រងសំណួរ QCM ៤០ សំណួរ ៖ {currentLessonPackage.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">កាតសិក្សា និងជំនួយស្មារតីឆ្លាតវៃ</p>
              <div className="mt-4 inline-block px-4 py-1.5 rounded-full border border-pink-200 bg-pink-50 text-pink-700 font-bold text-xs">
                📚 ផលិតជាសម្ភារឧបទ្ទេសបង្រៀន និងរៀន ថ្នាក់ទី៦
              </div>
            </div>

            {/* Fold 1 Indicator */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="w-full border-t-2 border-dotted border-rose-400"></div>
              <span className="absolute bg-rose-100 text-rose-800 text-[10px] font-bold px-3 py-0.5 rounded-full">
                -- បត់ទៅខាងក្រោយតាមបន្ទាត់នេះ (Fold 1) --
              </span>
            </div>

            {/* Back Stand Face */}
            <div className="border-2 border-slate-300 rounded-2xl p-6 bg-slate-50/70 text-center my-3">
              <span className="text-xs font-bold text-slate-500">ផ្ទៃទ្រទ្រង់ខាងក្រោយ (Back Support Leg)</span>
              <div className="text-xs text-slate-400 mt-2">ទម្របញ្ឈរទប់លំនឹង 3D Desk Stand</div>
            </div>

            {/* Fold 2 Indicator */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="w-full border-t-2 border-dotted border-rose-400"></div>
              <span className="absolute bg-rose-100 text-rose-800 text-[10px] font-bold px-3 py-0.5 rounded-full">
                -- បត់បង្កើតជាបាតក្រោម (Fold 2) --
              </span>
            </div>

            {/* Base Bottom Flap */}
            <div className="border-2 border-dashed border-amber-400 rounded-2xl p-4 bg-amber-50/60 text-center">
              <span className="text-xs font-bold text-amber-800">បាតទ្រខាងក្រោម & ស្លាបបិទកាវ (Bottom Base & Glue Flap)</span>
              <p className="text-[10px] text-amber-700 mt-1">
                លាបកាវ ឬបិទស្កុតពីរមុខត្រង់នេះ ដើម្បីផ្គុំភ្ជាប់ជាជើងទម្រត្រីកោណយ៉ាងរឹងមាំ
              </p>
            </div>
          </div>
        </div>

        {/* PAGE 2+: FLASHCARD TILES */}
        <div className="space-y-4 pt-6">
          <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">សន្លឹកទី ២ នៃសម្ភារឧបទ្ទេស</span>
              <h2 className="text-xl font-black text-slate-900">សន្លឹកកាតសំណួរ QCM សម្រាប់កាត់ចោះកង (Mini QCM Flashcards)</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {hidePdfAnswers
                  ? '🔒 ទម្រង់លាក់ចម្លើយ៖ ស័ក្តិសមសម្រាប់ចែកសិស្សអនុវត្ត ឬប្រឡង (មានកន្លែងកត់ត្រាចម្លើយ)'
                  : 'កាត់តាមគំនូសដាច់ៗ រួចចោះប្រហោងខាងលើ ដើម្បីដោតកងដែក ឬចងខ្សែចូលជើងទម្រ'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">FLASHCARDS KIT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cover Tile */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col justify-between bg-white relative min-h-[290px] break-inside-avoid">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-[9px] text-slate-400 font-mono tracking-wider">✂️ កាត់តាមគំនូសដាច់ៗ</span>
                <span className="text-[9px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">គម្របមុខ</span>
              </div>
              <div className="flex justify-around py-1.5 bg-slate-50/80 rounded-lg my-1 border border-slate-200/60">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="w-3 h-3 rounded-full border border-slate-400 bg-white inline-block"></span>
                ))}
              </div>
              <div className="text-center py-4 my-auto">
                <div className="w-12 h-12 mx-auto rotate-45 border-2 border-pink-500 rounded-xl flex items-center justify-center mb-3">
                  <span className="-rotate-45 font-outfit font-black text-pink-600 text-sm">QCM</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-800">{currentLessonPackage.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1">កាតសិក្សា និងជំនួយស្មារតីឆ្លាតវៃ</p>
              </div>
              <div className="text-[9px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
                <span>ចំនួនសំណួរ៖ {questions.length}</span>
                <span className="font-outfit font-bold text-pink-600">SMART FLIP</span>
              </div>
            </div>

            {/* Questions Tiles */}
            {questions.map((q, qIdx) => {
              const correctIdx = q.options.findIndex((o) => o.isCorrect);
              return (
                <div
                  key={q.id || qIdx}
                  className="border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col justify-between bg-white relative min-h-[290px] break-inside-avoid shadow-none"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {q.part || 'សំណួរ QCM'}
                    </span>
                    <span className="text-[9px] font-bold text-pink-600">
                      សន្លឹកទី {qIdx + 1}/{questions.length}
                    </span>
                  </div>

                  <div className="flex justify-around py-1.5 bg-slate-50/80 rounded-lg my-1 border border-slate-200/60">
                    {[...Array(4)].map((_, i) => (
                      <span key={i} className="w-3 h-3 rounded-full border border-slate-400 bg-white inline-block"></span>
                    ))}
                  </div>

                  <div className="my-2">
                    <h5 className="text-xs font-bold text-slate-800 leading-snug mb-2">
                      {qIdx + 1}. {q.question}
                    </h5>
                    <div className="space-y-1.5">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="flex items-center gap-1.5 text-[10px] p-1.5 rounded-lg border border-slate-200 bg-slate-50/70"
                        >
                          <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[9px]">
                            {letters[oIdx]}
                          </span>
                          <span className="leading-tight text-slate-700">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {hidePdfAnswers ? (
                    <div className="mt-2 pt-2 border-t border-dashed border-slate-200 text-[10px] text-slate-600 bg-slate-50/80 p-2 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-1 font-semibold text-slate-500">
                        <span>✍️ ចម្លើយរបស់អ្នក៖</span>
                        <span className="inline-block w-8 border-b-2 border-slate-400 border-dotted ml-1 text-center font-bold text-pink-600">&nbsp;</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">QCM #{qIdx + 1}</span>
                    </div>
                  ) : (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[9px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                      <div className="font-bold text-emerald-700">
                        ✓ ចម្លើយត្រឹមត្រូវ៖ ជម្រើស ({letters[correctIdx >= 0 ? correctIdx : 0]})
                      </div>
                      <p className="line-clamp-2 text-slate-500 leading-tight mt-0.5">{q.explanation || ''}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        ref={containerRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto no-print"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl min-h-[92vh] flex flex-col justify-between items-center rounded-[32px] mesh-gradient-bg p-3 sm:p-6 shadow-2xl border border-white/60 overflow-hidden"
        >
          {/* Top Control Bar with Lesson Switcher, Theme Switcher, PDF Button & Close */}
          <header className="w-full max-w-2xl flex flex-col items-center text-center pt-1 pb-2">
            <div className="w-full flex items-center justify-between gap-2 mb-2">
              {/* Category & Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md border border-pink-200 shadow-xs rounded-full text-xs font-semibold text-pink-700">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                <span className="tracking-wide">កាតសំណួរ QCM បញ្ឈរលើតុ (3D Desk Flip)</span>
              </div>

              {/* Action Icons: Scratchpad, Formulas, Navigator, Fullscreen, Close */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsScratchpadOpen(true)}
                  title="បើកក្តារព្រាងគណនា (Scratchpad)"
                  className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <PenTool className="w-4 h-4 text-indigo-600" />
                </button>
                <button
                  onClick={() => setIsFormulasOpen(true)}
                  title="រូបមន្តសង្ខេប"
                  className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  onClick={() => setIsNavigatorOpen(true)}
                  title="បញ្ជីសំណួរទាំង ៤០"
                  className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <ListFilter className="w-4 h-4 text-purple-600" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  title="ពេញអេក្រង់"
                  className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={onClose}
                  title="បិទផ្ទាំង"
                  className="p-2 rounded-xl bg-white/90 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Lesson Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full">
              <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
                កម្រងកាតសំណួរឆ្លាតវៃ
              </h1>

              {/* Lesson Picker Dropdown */}
              <select
                value={selectedLessonNumber}
                onChange={(e) => setSelectedLessonNumber(Number(e.target.value))}
                className="px-3 py-1 bg-white/90 border border-purple-200 rounded-full text-xs font-bold text-purple-900 shadow-xs focus:ring-2 focus:ring-purple-400 outline-none cursor-pointer"
              >
                {ALL_MATH_LESSONS_PACKAGES.map((pkg) => (
                  <option key={pkg.lessonNumber} value={pkg.lessonNumber}>
                    {pkg.title} ({pkg.questions.length} សំណួរ)
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-600 mt-1 max-w-md">
              រចនាម៉ូដបែប 3D Desk Calendar មានកងដែក និងអាចប្ដូរពណ៌ស៊ុមតាមចំណង់ចំណូលចិត្ត!
            </p>

            {/* Color Theme Selector Switcher & PDF Action */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2.5">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500">ជ្រើសរើសពណ៌ស៊ុម៖</span>
                <div className="flex items-center gap-1.5" id="themeButtons">
                  {(Object.keys(THEMES) as StandThemeKey[]).map((tKey) => {
                    const t = THEMES[tKey];
                    const isActive = currentThemeKey === tKey;
                    return (
                      <button
                        key={tKey}
                        onClick={() => {
                          setCurrentThemeKey(tKey);
                          onShowToast?.(`🎨 បានប្តូរទៅរចនាបថពណ៌៖ ${t.name}`);
                        }}
                        title={t.name}
                        className={`w-5 h-5 rounded-full bg-gradient-to-tr ${t.badge} border-2 border-white transition-transform active:scale-90 hover:scale-110 shadow-xs cursor-pointer ${
                          isActive ? `ring-2 ${t.ring} scale-110` : ''
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Download PDF Material Kit Button */}
              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-full text-xs font-bold shadow-md shadow-purple-500/25 flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>📥 ទាញយកសម្ភារ PDF (Print & Assemble Kit)</span>
              </button>
            </div>
          </header>

          {/* 3D Stand Interactive Display Area */}
          <main className="w-full max-w-md flex flex-col items-center stand-scene my-auto py-2">
            {/* Stand Outer Box */}
            <div
              id="standContainer"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-[320px] sm:w-[380px] desk-stand calendar-shadow transition-all duration-500"
            >
              {/* Realistic Double Twin-Spiral Rings */}
              <div className="absolute -top-7 left-0 w-full flex justify-between px-6 sm:px-8 z-30 pointer-events-none">
                <div className="w-2.5 h-14 rounded-full twin-spiral"></div>
                <div className="w-2.5 h-14 rounded-full twin-spiral"></div>
                <div className="w-2.5 h-14 rounded-full twin-spiral"></div>
                <div className="w-2.5 h-14 rounded-full twin-spiral"></div>
                <div className="w-2.5 h-14 rounded-full twin-spiral"></div>
              </div>

              {/* Main Colored Stand Body Frame */}
              <div
                id="standBody"
                className={`relative ${activeTheme.body} rounded-t-3xl rounded-b-xl pt-8 pb-4 px-4 sm:px-5 shadow-2xl transition-all duration-500 border-t border-white/30`}
              >
                {/* Top Perforation Punch Holes */}
                <div className="w-full flex justify-between px-3 sm:px-5 pb-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-black/35 shadow-inner inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-black/35 shadow-inner inline-block"></span>
                    </div>
                  ))}
                </div>

                {/* Interactive Card Sheet (Flip Page) */}
                <div
                  id="cardSheet"
                  className={`relative min-h-[385px] rounded-2xl p-5 shadow-xl border flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                    flipAnimation === 'forward' ? 'page-flip-forward' : flipAnimation === 'backward' ? 'page-flip-backward' : ''
                  } ${
                    currentThemeKey === 'midnight' && currentStep === 0
                      ? 'bg-gradient-to-b from-stone-900 to-black text-white border-zinc-800'
                      : 'bg-white/95 backdrop-blur-xs text-slate-800 border-white/60'
                  }`}
                >
                  {/* CASE 0: COVER PAGE */}
                  {currentStep === 0 && (
                    <div className="flex flex-col justify-between items-center text-center h-full my-auto">
                      <div className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                        <span className={`px-2.5 py-1 rounded-full ${activeTheme.coverBadge} shadow-xs`}>
                          MINI FLIP EDN.
                        </span>
                        <span className="font-outfit text-slate-400">2026-2027</span>
                      </div>

                      <div className="my-auto flex flex-col items-center">
                        <div className="relative group my-3">
                          <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition duration-500"></div>
                          <div
                            className={`relative w-20 h-20 rotate-45 border-2 ${
                              currentThemeKey === 'midnight'
                                ? 'border-amber-400/80 bg-stone-900'
                                : 'border-pink-500 bg-white'
                            } rounded-2xl shadow-xl flex items-center justify-center transition-transform hover:scale-105`}
                          >
                            <div className="-rotate-45 flex flex-col items-center">
                              <span
                                className={`text-2xl font-black font-outfit ${
                                  currentThemeKey === 'midnight'
                                    ? 'text-amber-400'
                                    : 'text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600'
                                }`}
                              >
                                QCM
                              </span>
                              <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400">
                                STUDY
                              </span>
                            </div>
                          </div>
                        </div>

                        <h2 className={`text-lg sm:text-xl font-extrabold mt-3 text-slate-800 ${currentThemeKey === 'midnight' ? 'text-white' : ''}`}>
                          {currentLessonPackage.title}
                        </h2>
                        <p className={`text-xs ${currentThemeKey === 'midnight' ? 'text-zinc-400' : 'text-slate-500'} mt-1 max-w-[260px] line-clamp-2`}>
                          {currentLessonPackage.summary}
                        </p>

                        <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1 bg-white/70 backdrop-blur-xs rounded-full border border-slate-200 text-[11px] text-slate-600 shadow-xs">
                          <span>📚 សំណួរសរុប៖ <b>{questions.length}</b> សំណួរ</span>
                        </div>
                      </div>

                      <div
                        className={`w-full pt-3 border-t ${
                          currentThemeKey === 'midnight' ? 'border-zinc-800 text-zinc-400' : 'border-pink-100 text-slate-500'
                        } flex justify-between items-center text-xs`}
                      >
                        <span className="text-[11px]">ចុចត្រឡប់សន្លឹកដើម្បីចាប់ផ្តើម</span>
                        <button
                          onClick={handleNextSlide}
                          className={`font-bold flex items-center gap-1 ${activeTheme.textHighlight} hover:underline cursor-pointer`}
                        >
                          ចាប់ផ្តើម →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CASE 1..N: INDIVIDUAL QUESTION CARD */}
                  {currentStep >= 1 && currentStep <= questions.length && (() => {
                    const qIdx = currentStep - 1;
                    const q = questions[qIdx];
                    const chosen = userAnswers[qIdx];
                    const hasAnswered = chosen !== undefined;
                    const correctIdx = q.options.findIndex((o) => o.isCorrect);

                    return (
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          {/* Header Bar */}
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2.5">
                            <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border bg-pink-100 text-pink-700 border-pink-200 truncate max-w-[220px]">
                              {q.part || 'សំណួរ QCM'}
                            </span>
                            <span className="text-xs font-outfit font-bold text-slate-400 shrink-0">
                              #{currentStep} / {questions.length}
                            </span>
                          </div>

                          {/* Question text */}
                          <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug mb-2.5">
                            {q.question}
                          </h3>

                          {/* Visual Diagram if available */}
                          {q.diagramType && (
                            <div className="mb-2.5 bg-slate-50 p-2 rounded-xl border border-slate-200 overflow-x-auto flex justify-center">
                              <MathQuestionVisualDiagram diagramType={q.diagramType} diagramData={q.diagramData} />
                            </div>
                          )}

                          {/* Options */}
                          <div className="space-y-1.5">
                            {q.options.map((opt, oIdx) => {
                              let btnStyles = 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-pink-300 hover:bg-pink-50/40';
                              let badgeStyles = 'bg-slate-200 text-slate-700';

                              if (hasAnswered) {
                                if (oIdx === correctIdx) {
                                  btnStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-300 shadow-xs';
                                  badgeStyles = 'bg-emerald-600 text-white';
                                } else if (chosen === oIdx) {
                                  btnStyles = 'border-rose-400 bg-rose-50 text-rose-950 font-semibold ring-1 ring-rose-300';
                                  badgeStyles = 'bg-rose-500 text-white';
                                } else {
                                  btnStyles = 'border-slate-100 bg-slate-50/40 text-slate-400 opacity-60';
                                  badgeStyles = 'bg-slate-100 text-slate-400';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectAnswer(qIdx, oIdx)}
                                  disabled={hasAnswered}
                                  className={`group w-full text-left p-2 rounded-xl border text-xs flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${btnStyles}`}
                                >
                                  <span className={`w-5 h-5 rounded-lg ${badgeStyles} text-xs font-bold flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                                    {hasAnswered && oIdx === correctIdx ? '✓' : hasAnswered && chosen === oIdx ? '✕' : letters[oIdx]}
                                  </span>
                                  <span className="flex-1 leading-snug">{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Explanation Box */}
                        {hasAnswered ? (
                          <div className="mt-2.5 p-2 bg-gradient-to-r from-slate-50 to-pink-50/50 rounded-xl border border-slate-200 text-[11px] text-slate-600 animate-in fade-in duration-200">
                            <div className={`flex items-center gap-1 font-bold ${chosen === correctIdx ? 'text-emerald-600' : 'text-rose-600'} mb-0.5`}>
                              <span>
                                {chosen === correctIdx ? '💡 ចម្លើយត្រឹមត្រូវ!' : `💡 ចម្លើយពិត៖ ជម្រើស (${letters[correctIdx >= 0 ? correctIdx : 0]})`}
                              </span>
                            </div>
                            <p className="leading-relaxed line-clamp-3">{q.explanation || 'សូមបន្តទៅសំណួរបន្ទាប់ទៀត។'}</p>
                          </div>
                        ) : (
                          <div className="mt-2 text-center text-[10px] text-slate-400 font-medium">
                            👇 សូមចុចលើចម្លើយដែលអ្នកគិតថាត្រឹមត្រូវ
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* CASE N+1: FINAL RESULTS SUMMARY */}
                  {currentStep > questions.length && (
                    <div className="flex flex-col justify-between items-center text-center h-full my-auto">
                      <div className="w-full flex justify-between items-center text-xs text-slate-400 border-b border-slate-100 pb-2">
                        <span className="font-semibold text-pink-600">🎉 បញ្ចប់សំណួរទាំងអស់</span>
                        <span className="font-outfit font-bold">{score}/{questions.length} ត្រូវ</span>
                      </div>

                      <div className="my-auto flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                          <div
                            className={`w-20 h-20 rounded-full ${
                              percentage >= 80
                                ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-300'
                                : 'bg-pink-50 text-pink-600 border-2 border-pink-300'
                            } flex items-center justify-center text-2xl font-black font-outfit shadow-inner`}
                          >
                            {percentage}%
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-slate-800">
                          {percentage >= 80
                            ? 'អស្ចារ្យណាស់! អ្នកពិតជាពូកែ'
                            : percentage >= 50
                            ? 'ល្អណាស់! សមត្ថភាពល្អប្រសើរ'
                            : 'សាកល្បងម្ដងទៀតដើម្បីទទួលបានពិន្ទុពេញ!'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-[260px] leading-relaxed">
                          អ្នកឆ្លើយត្រូវចំនួន <strong className="text-pink-600 font-bold">{score}</strong> ក្នុងចំណោម{' '}
                          <strong className="text-slate-700">{questions.length}</strong> សំណួរ។
                        </p>
                      </div>

                      <button
                        onClick={handleRestart}
                        className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                      >
                        🔄 ត្រឡប់ទៅទំព័រមុខឡើងវិញ
                      </button>
                    </div>
                  )}
                </div>

                {/* Stand Bottom Branding & Info Bar */}
                <div
                  id="standFooter"
                  className="mt-3.5 pt-2 border-t border-white/20 flex justify-between items-center text-[11px] text-white/90 px-1 font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse"></span>
                    <span>
                      {currentStep === 0
                        ? 'ទំព័រគម្របមុខ'
                        : currentStep > questions.length
                        ? 'លទ្ធផលសរុប'
                        : `សំណួរទី ${currentStep} / ${questions.length}`}
                    </span>
                  </span>
                  <span className="font-outfit font-semibold tracking-wider text-[11px] text-white/80">
                    SMART FLIP • 2026/2027
                  </span>
                </div>
              </div>

              {/* Triangular Folding Bottom Stand Footing */}
              <div
                id="standFooting"
                className={`h-4.5 ${activeTheme.footing} mx-3 rounded-b-2xl shadow-xl flex items-center justify-center transition-all duration-500 border-x border-b border-black/10`}
              >
                <div className="w-28 h-1 bg-white/30 rounded-full"></div>
              </div>
            </div>

            {/* Control Navigation Buttons */}
            <div className="w-[320px] sm:w-[380px] mt-4 flex justify-between items-center gap-2.5">
              <button
                disabled={currentStep === 0}
                onClick={handlePrevSlide}
                className="flex-1 py-2.5 px-3 bg-white/90 backdrop-blur-xs hover:bg-white active:scale-95 text-slate-700 font-semibold rounded-2xl text-xs shadow-md border border-slate-200 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500" />
                <span>ថយក្រោយ</span>
              </button>

              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  onShowToast?.(!soundEnabled ? '🔔 បើកសំឡេង' : '🔕 បិទសំឡេង');
                }}
                className="p-2.5 bg-white/90 hover:bg-white text-slate-600 rounded-2xl shadow-md border border-slate-200 text-sm active:scale-95 transition-all cursor-pointer"
                title="បើក/បិទសំឡេង"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-2.5 bg-white/90 hover:bg-white text-slate-600 rounded-2xl shadow-md border border-slate-200 text-sm active:scale-95 transition-all cursor-pointer"
                title="ចាប់ផ្តើមឡើងវិញ"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
              </button>

              <button
                disabled={currentStep > questions.length}
                onClick={handleNextSlide}
                className={`flex-1 py-2.5 px-3 bg-gradient-to-r ${activeTheme.accentBtn} active:scale-95 text-white font-semibold rounded-2xl text-xs shadow-lg transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5 cursor-pointer`}
              >
                <span>បន្ទាប់</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Floating Stats Pill */}
            <div className="mt-2.5 flex items-center gap-3">
              <div className="px-3.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-xs font-medium text-slate-700 shadow-xs flex items-center gap-2">
                <span>
                  🏆 ពិន្ទុ៖ <b className="text-pink-600 font-bold">{score}</b>/{questions.length}
                </span>
              </div>
              {currentStreak >= 2 && (
                <div className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 animate-bounce">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>ត្រូវផ្ទួន៖ {currentStreak}</span>
                </div>
              )}
            </div>
          </main>

          {/* Accordion Footer: Add Custom Question Form */}
          <footer className="w-full max-w-xl pb-1">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-pink-100 shadow-lg">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsCustomFormOpen(!isCustomFormOpen)}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs shadow-xs">
                    ✨
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">បង្កើតសំណួរ QCM ផ្ទាល់ខ្លួនបន្ថែម</h4>
                    <p className="text-[11px] text-slate-500">បន្ថែមសំណួរថ្មីៗចូលក្នុងប្រតិទិនតុនេះភ្លាមៗ</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                  {isCustomFormOpen ? 'បិទវិញ ▲' : '+ បន្ថែមសំណួរ ▼'}
                </span>
              </div>

              {/* Collapsible Form */}
              {isCustomFormOpen && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs flex flex-col gap-2.5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-600 mb-1">សំណួរ៖</label>
                      <input
                        type="text"
                        value={newQText}
                        onChange={(e) => setNewQText(e.target.value)}
                        placeholder="វាយសំណួររបស់អ្នកនៅទីនេះ..."
                        className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-pink-400 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">ផ្នែក/ស្លាក៖</label>
                      <input
                        type="text"
                        value={newQCategory}
                        onChange={(e) => setNewQCategory(e.target.value)}
                        placeholder="ឧ. គណិតវិទ្យា, ប្រភាគ"
                        className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-pink-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                      <span className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        ក
                      </span>
                      <input
                        type="text"
                        value={newOpt0}
                        onChange={(e) => setNewOpt0(e.target.value)}
                        placeholder="ជម្រើសទី ១"
                        className="w-full p-1 bg-transparent text-xs outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                      <span className="w-5 h-5 rounded-lg bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-xs">
                        ខ
                      </span>
                      <input
                        type="text"
                        value={newOpt1}
                        onChange={(e) => setNewOpt1(e.target.value)}
                        placeholder="ជម្រើសទី ២"
                        className="w-full p-1 bg-transparent text-xs outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                      <span className="w-5 h-5 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
                        គ
                      </span>
                      <input
                        type="text"
                        value={newOpt2}
                        onChange={(e) => setNewOpt2(e.target.value)}
                        placeholder="ជម្រើសទី ៣"
                        className="w-full p-1 bg-transparent text-xs outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                      <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                        ឃ
                      </span>
                      <input
                        type="text"
                        value={newOpt3}
                        onChange={(e) => setNewOpt3(e.target.value)}
                        placeholder="ជម្រើសទី ៤"
                        className="w-full p-1 bg-transparent text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">ការពន្យល់បន្ថែម (បង្ហាញក្រោយឆ្លើយ)៖</label>
                    <input
                      type="text"
                      value={newQExplanation}
                      onChange={(e) => setNewQExplanation(e.target.value)}
                      placeholder="ឧ. ចម្លើយនេះត្រឹមត្រូវព្រោះ..."
                      className="w-full p-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 font-medium">ចម្លើយណាត្រូវ?</span>
                      <select
                        value={newCorrectIndex}
                        onChange={(e) => setNewCorrectIndex(Number(e.target.value))}
                        className="border border-slate-300 rounded-xl p-1 bg-white font-bold text-pink-600 outline-none cursor-pointer"
                      >
                        <option value={0}>ក (ជម្រើសទី ១)</option>
                        <option value={1}>ខ (ជម្រើសទី ២)</option>
                        <option value={2}>គ (ជម្រើសទី ៣)</option>
                        <option value={3}>ឃ (ជម្រើសទី ៤)</option>
                      </select>
                    </div>
                    <button
                      onClick={handleAddCustomQuestion}
                      className="py-1.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold text-xs shadow-md shadow-pink-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      + រក្សាទុកសំណួរ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </footer>

          {/* ================= MODAL: QUESTION LIST NAVIGATOR (Jump to any question) ================= */}
          {isNavigatorOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Grid className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-slate-800 text-sm">
                      បញ្ជីសំណួរទាំង {questions.length} ៖ {currentLessonPackage.shortTitle}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsNavigatorOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto max-h-[60vh]">
                  <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                    {questions.map((_, idx) => {
                      const answered = userAnswers[idx] !== undefined;
                      const isCurrent = currentStep === idx + 1;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentStep(idx + 1);
                            setIsNavigatorOpen(false);
                            playSynthesizedSound('flip', soundEnabled);
                          }}
                          className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-pink-600 text-white ring-2 ring-pink-400 scale-105 shadow-md'
                              : answered
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          #{idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
                  <span>បៃតង ៖ បានឆ្លើយរួច • ប្រផេះ ៖ មិនទាន់ឆ្លើយ</span>
                  <button
                    onClick={() => setIsNavigatorOpen(false)}
                    className="px-4 py-1.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 cursor-pointer"
                  >
                    បិទ
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* ================= MODAL: PRINT & PDF ASSEMBLE KIT ================= */}
          {isPdfModalOpen && (
            <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3">
              <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-pink-50/30 to-purple-50/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg shadow-xs">
                      🖨️
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                        ទាញយក និងបោះពុម្ពសម្ភារឧបទ្ទេស (A4 PDF Kit)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        រួមមានជើងទម្រត្រីកោណបត់ DIY និងសន្លឹកកាតសំណួរ QCM កាត់ចោះប្រហោង ({questions.length} សំណួរ)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPdfModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Actions bar */}
                <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-xs hover:border-pink-300 transition">
                    <input
                      type="checkbox"
                      checked={hidePdfAnswers}
                      onChange={(e) => setHidePdfAnswers(e.target.checked)}
                      className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4 cursor-pointer accent-pink-600"
                    />
                    <span className="text-rose-600 flex items-center gap-1">
                      🔒 លាក់ចម្លើយលើសន្លឹកកាត (សម្រាប់អនុវត្ត/សិស្ស)
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>បោះពុម្ព (Print / Save PDF)</span>
                    </button>
                  </div>
                </div>

                {/* Preview Printable Content */}
                <div className="p-6 overflow-y-auto max-h-[68vh] bg-slate-100 flex justify-center">
                  {renderPrintableArea()}
                </div>
              </div>
            </div>
          )}

          {/* ================= MODAL: SCRATCHPAD CANVAS ================= */}
          {isScratchpadOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[80vh]"
              >
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-800 text-sm">ក្តារព្រាងគណនា (Scratchpad)</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setDrawingTool('pen')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          drawingTool === 'pen' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <PenTool className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDrawingTool('eraser')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          drawingTool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Eraser className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={clearCanvas}
                      className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                      title="លុបទាំងអស់"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsScratchpadOpen(false)}
                      className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-white relative cursor-crosshair">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
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

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
                  💡 ប្រើម្រាមដៃ ឬកណ្ដុរដើម្បីសរសេរព្រាងលេខលើក្តារខៀននេះបានភ្លាមៗ
                </div>
              </motion.div>
            </div>
          )}

          {/* ================= MODAL: KEY FORMULAS ================= */}
          {isFormulasOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-indigo-950 text-white">
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

                <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
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
export default MathLesson1ExamModal;
