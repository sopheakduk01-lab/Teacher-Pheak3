import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Zap,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Info,
  Check,
  ArrowRight,
  Flame,
  Search,
  Filter,
  Eye,
  Play,
  Trophy,
  ShieldCheck,
  Lightbulb,
  Radio,
  Share2,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SCIENCE_MICRO_CARDS,
  SCIENCE_TEST_MATERIALS,
  SCIENCE_QUIZ_QUESTIONS,
  SCIENCE_ACHIEVEMENT_BADGES,
  ScienceMicroCard,
  ScienceTestMaterial,
  ScienceQuizQuestion,
  ScienceBadge,
} from '../data/scienceGrade6LessonsData';
import { toKhmerNum } from '../utils/khmerDate';

interface ScienceGrade6InteractiveViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  initialTab?: 'cards' | 'circuit' | 'tester' | 'quiz' | 'badges';
}

type TabType = 'cards' | 'circuit' | 'tester' | 'quiz' | 'badges';

// Sound generator using Web Audio API
const playScienceSound = (
  type: 'click' | 'switch_on' | 'switch_off' | 'correct' | 'wrong' | 'spark' | 'badge_unlock',
  isMuted: boolean = false
) => {
  if (isMuted) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'switch_on') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'switch_off') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } else if (type === 'correct' || type === 'spark') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(170, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'badge_unlock') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.2);
      });
    }
  } catch {
    // Ignore audio context errors if browser audio policy blocks
  }
};

const STORAGE_KEY = 'science_grade6_progress_v1';

export const ScienceGrade6InteractiveViewer: React.FC<ScienceGrade6InteractiveViewerProps> = ({
  isOpen,
  onClose,
  onShowToast,
  initialTab = 'cards',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Cards State
  const [cardChapterFilter, setCardChapterFilter] = useState<number | 'all'>('all');
  const [cardSearch, setCardSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<ScienceMicroCard | null>(SCIENCE_MICRO_CARDS[0]);
  const [readCardIds, setReadCardIds] = useState<string[]>([]);
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);

  // 2. Interactive Circuit Lab State
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [batteryCount, setBatteryCount] = useState<1 | 2 | 3>(2); // 1 = 1.5V, 2 = 3.0V, 3 = 4.5V
  const [isBulb1Disconnected, setIsBulb1Disconnected] = useState(false);
  const [showElectronFlow, setShowElectronFlow] = useState(true);
  const [showCurrentDirection, setShowCurrentDirection] = useState(true);
  const [circuitExploredTypes, setCircuitExploredTypes] = useState<{ series: boolean; parallel: boolean }>({
    series: true,
    parallel: false,
  });

  // 3. Conductor & Insulator Tester State
  const [activeTestMaterial, setActiveTestMaterial] = useState<ScienceTestMaterial | null>(SCIENCE_TEST_MATERIALS[0]);
  const [isTesterSwitchOn, setIsTesterSwitchOn] = useState(true);
  const [testedMaterialIds, setTestedMaterialIds] = useState<string[]>([SCIENCE_TEST_MATERIALS[0].id]);

  // 4. Interactive Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showQuizReview, setShowQuizReview] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // 5. Badges State
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [recentUnlockedBadge, setRecentUnlockedBadge] = useState<ScienceBadge | null>(null);

  // Load progress on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.readCardIds) setReadCardIds(parsed.readCardIds);
        if (parsed.testedMaterialIds) setTestedMaterialIds(parsed.testedMaterialIds);
        if (parsed.unlockedBadges) setUnlockedBadges(parsed.unlockedBadges);
        if (parsed.userAnswers) setUserAnswers(parsed.userAnswers);
        if (parsed.circuitExploredTypes) setCircuitExploredTypes(parsed.circuitExploredTypes);
      }
    } catch {
      // ignore
    }
  }, []);

  // Synchronize activeTab whenever initialTab changes or modal opens
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Save progress helper
  const saveProgress = (newProgress: Record<string, unknown>) => {
    try {
      const current = {
        readCardIds,
        testedMaterialIds,
        unlockedBadges,
        userAnswers,
        circuitExploredTypes,
        ...newProgress,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // ignore
    }
  };

  // Check and unlock badges
  const checkBadgeUnlocks = (
    updated: {
      circuitSwitched?: boolean;
      circuitTypeUsed?: 'series' | 'parallel';
      testedMaterials?: string[];
      answeredCorrectCount?: number;
      cardsRead?: string[];
    }
  ) => {
    const newlyEarned: string[] = [];

    // Badge 1: First Circuit Spark
    if (updated.circuitSwitched && !unlockedBadges.includes('badge_first_circuit')) {
      newlyEarned.push('badge_first_circuit');
    }

    // Badge 2: Series & Parallel Master
    const hasBoth =
      (circuitExploredTypes.series || updated.circuitTypeUsed === 'series') &&
      (circuitExploredTypes.parallel || updated.circuitTypeUsed === 'parallel');
    if (hasBoth && !unlockedBadges.includes('badge_series_parallel_pro')) {
      newlyEarned.push('badge_series_parallel_pro');
    }

    // Badge 3: Materials Specialist
    const testedCount = updated.testedMaterials ? updated.testedMaterials.length : testedMaterialIds.length;
    if (testedCount >= 6 && !unlockedBadges.includes('badge_materials_explorer')) {
      newlyEarned.push('badge_materials_explorer');
    }

    // Badge 4: Quiz Champion
    const correctCount = updated.answeredCorrectCount ?? Object.entries(userAnswers).filter(([qid, ansIdx]) => {
      const q = SCIENCE_QUIZ_QUESTIONS.find(item => item.id === Number(qid));
      const chosenIdx = Number(ansIdx);
      return q && q.options[chosenIdx]?.isCorrect;
    }).length;

    const quizScorePct = (correctCount / SCIENCE_QUIZ_QUESTIONS.length) * 100;
    if (quizScorePct >= 80 && !unlockedBadges.includes('badge_quiz_champion')) {
      newlyEarned.push('badge_quiz_champion');
    }

    // Badge 5: Grand Scientist
    const cardsCount = updated.cardsRead ? updated.cardsRead.length : readCardIds.length;
    if (
      cardsCount >= SCIENCE_MICRO_CARDS.length &&
      testedCount >= 8 &&
      hasBoth &&
      quizScorePct >= 75 &&
      !unlockedBadges.includes('badge_grand_scientist')
    ) {
      newlyEarned.push('badge_grand_scientist');
    }

    if (newlyEarned.length > 0) {
      const nextBadges = [...unlockedBadges, ...newlyEarned];
      setUnlockedBadges(nextBadges);
      saveProgress({ unlockedBadges: nextBadges });

      const lastBadgeObj = SCIENCE_ACHIEVEMENT_BADGES.find(b => b.id === newlyEarned[newlyEarned.length - 1]);
      if (lastBadgeObj) {
        setRecentUnlockedBadge(lastBadgeObj);
        playScienceSound('badge_unlock', isSoundMuted);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
        if (onShowToast) {
          onShowToast(`🎉 អបអរសាទរ! ទទួលបានមេដាយ ៖ «${lastBadgeObj.khmerTitle}»`);
        }
      }
    }
  };

  // Mark card as read
  const handleReadCard = (id: string) => {
    if (!readCardIds.includes(id)) {
      const next = [...readCardIds, id];
      setReadCardIds(next);
      saveProgress({ readCardIds: next });
      checkBadgeUnlocks({ cardsRead: next });
    }
  };

  // Text-To-Speech for card
  const handleSpeakCard = (card: ScienceMicroCard) => {
    if ('speechSynthesis' in window) {
      if (speakingCardId === card.id) {
        window.speechSynthesis.cancel();
        setSpeakingCardId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const textToRead = `${card.lessonTitle}។ ${card.summary}។ ចំណុចសំខាន់ ៖ ${card.keyPoints.join('។ ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingCardId(null);
      utterance.onerror = () => setSpeakingCardId(null);
      setSpeakingCardId(card.id);
      window.speechSynthesis.speak(utterance);
    } else {
      if (onShowToast) onShowToast('កម្មវិធីរុករកមិនគាំទ្រការអានសម្លេងជាភាសាខ្មែរទេ');
    }
  };

  // Calculate Circuit Lab parameters
  const circuitVoltage = useMemo(() => {
    return batteryCount * 1.5; // Volts
  }, [batteryCount]);

  // In Series:
  // - If switch is open -> 0V, 0A, both bulbs off.
  // - If L1 disconnected -> breaks the loop -> 0V across bulbs, 0A, L2 turns off!
  // - If both connected and switch closed: Total R = 2 * R_bulb (e.g., 20 ohms). Current I = V / 20. Voltage per bulb = V / 2.
  // In Parallel:
  // - If switch is open -> 0V, 0A, both off.
  // - If L1 disconnected -> L2 remains connected! Voltage across L2 = V. Current in branch 2 = V / 10. L2 stays bright!
  const circuitState = useMemo(() => {
    if (!isSwitchClosed) {
      return {
        hasCurrent: false,
        currentAmpere: 0,
        voltageVolts: 0,
        bulb1Glowing: false,
        bulb1Brightness: 0,
        bulb2Glowing: false,
        bulb2Brightness: 0,
        statusKhmer: 'សៀគ្វីបើក (កុងតាក់ចំហ) គ្មានចរន្តរត់កាត់',
      };
    }

    if (circuitType === 'series') {
      if (isBulb1Disconnected) {
        return {
          hasCurrent: false,
          currentAmpere: 0,
          voltageVolts: 0,
          bulb1Glowing: false,
          bulb1Brightness: 0,
          bulb2Glowing: false,
          bulb2Brightness: 0,
          statusKhmer: 'អំពូលទី ១ ត្រូវបានដោះចេញ បណ្ដាលឱ្យដាច់សៀគ្វី អំពូលទី ២ ក៏រលត់ដែរ (លក្ខណៈសៀគ្វីស៊េរី)',
        };
      } else {
        // Both bulbs in series
        const rTotal = 20; // 10 ohms per bulb
        const i = circuitVoltage / rTotal; // e.g. 3.0V / 20 = 0.15A
        // Brightness scaled: in series voltage is divided (1.5V per bulb with 2 batteries)
        const brightness = Math.min(1, (circuitVoltage / 2) / 3.0);
        return {
          hasCurrent: true,
          currentAmpere: Number(i.toFixed(2)),
          voltageVolts: circuitVoltage,
          bulb1Glowing: true,
          bulb1Brightness: brightness,
          bulb2Glowing: true,
          bulb2Brightness: brightness,
          statusKhmer: `សៀគ្វីតជាស៊េរីដំណើរការ ៖ តង់ស្យុងចែកគ្នា ${circuitVoltage / 2}V ក្នុងមួយអំពូល, អាំងតង់ស៊ីតេ ${Number(i.toFixed(2))}A`,
        };
      }
    } else {
      // Parallel Circuit
      const rPerBulb = 10;
      let totalCurrent = 0;
      let b1Lit = false;
      let b2Lit = true; // Bulb 2 is always connected in our demo

      if (!isBulb1Disconnected) {
        b1Lit = true;
        totalCurrent += circuitVoltage / rPerBulb;
      }
      totalCurrent += circuitVoltage / rPerBulb; // bulb 2 branch

      const b1Brightness = b1Lit ? Math.min(1, circuitVoltage / 3.0) : 0;
      const b2Brightness = Math.min(1, circuitVoltage / 3.0);

      return {
        hasCurrent: true,
        currentAmpere: Number(totalCurrent.toFixed(2)),
        voltageVolts: circuitVoltage,
        bulb1Glowing: b1Lit,
        bulb1Brightness: b1Brightness,
        bulb2Glowing: b2Lit,
        bulb2Brightness: b2Brightness,
        statusKhmer: isBulb1Disconnected
          ? `អំពូលទី ១ ត្រូវបានដោះចេញ ប៉ុន្តែអំពូលទី ២ នៅតែភ្លឺដដែល ព្រោះចរន្តមានផ្លូវខ្នែងដាច់ដោយឡែក (ដូចភ្លើងក្នុងផ្ទះ)`
          : `សៀគ្វីតជាខ្នែងដំណើរការ ៖ អំពូលទាំងពីរទទួលបានតង់ស្យុងពេញ ${circuitVoltage}V ដូចៗគ្នា និងភ្លឺច្បាស់ខ្លាំង`,
      };
    }
  }, [isSwitchClosed, circuitType, batteryCount, isBulb1Disconnected, circuitVoltage]);

  // Overall Progress
  const progressPercent = useMemo(() => {
    const cardWeight = (readCardIds.length / SCIENCE_MICRO_CARDS.length) * 30; // 30%
    const testedWeight = (testedMaterialIds.length / SCIENCE_TEST_MATERIALS.length) * 30; // 30%
    const answeredCount = Object.keys(userAnswers).length;
    const quizWeight = (answeredCount / SCIENCE_QUIZ_QUESTIONS.length) * 30; // 30%
    const circuitWeight = (circuitExploredTypes.series ? 5 : 0) + (circuitExploredTypes.parallel ? 5 : 0); // 10%
    return Math.min(100, Math.round(cardWeight + testedWeight + quizWeight + circuitWeight));
  }, [readCardIds, testedMaterialIds, userAnswers, circuitExploredTypes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      {/* Badge Unlocked Celebration Modal */}
      <AnimatePresence>
        {recentUnlockedBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 animate-bounce">
                {recentUnlockedBadge.icon}
              </div>
              <span className="inline-block mt-4 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-400/40">
                🎉 មេដាយកិត្តិយសថ្មីត្រូវបានដោះសោ!
              </span>
              <h3 className="text-xl font-black text-white mt-2 font-moul">
                {recentUnlockedBadge.khmerTitle}
              </h3>
              <p className="text-xs text-amber-200/90 mt-1 font-semibold">
                {recentUnlockedBadge.title}
              </p>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {recentUnlockedBadge.description}
              </p>
              <button
                onClick={() => setRecentUnlockedBadge(null)}
                className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 rounded-2xl font-black text-xs hover:from-amber-400 hover:to-yellow-400 transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                ទទួលយកមេដាយ & បន្តការសិក្សា ✨
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`w-full bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-full max-h-[98vh]' : 'max-w-6xl max-h-[92vh] h-[92vh]'
        }`}
      >
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 flex items-center justify-center text-xl shadow-md shadow-amber-500/20 text-slate-950 font-black">
              🔬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 uppercase tracking-wider">
                  MoEYS ថ្នាក់ទី ៦
                </span>
                <span className="text-[11px] text-amber-300 font-bold hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  មេរៀន & ពិសោធន៍ឌីជីថលអន្តរកម្ម
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white font-moul leading-tight mt-0.5">
                វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ ៖ សៀគ្វីអគ្គិសនី & សារធាតុចម្លង
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Progress pill */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-700/80">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <div className="w-20 bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-amber-300">{toKhmerNum(progressPercent)}%</span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => {
                setIsSoundMuted(!isSoundMuted);
                playScienceSound('click', false);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title={isSoundMuted ? 'បើកសម្លេង' : 'បិទសម្លេង'}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition hidden sm:block"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition border border-rose-500/30"
              title="បិទ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (5 requested separate formats) */}
        <div className="px-3 sm:px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'cards' as TabType, label: '១. កាតស្វ័យសិក្សា', icon: BookOpen, count: `${readCardIds.length}/${SCIENCE_MICRO_CARDS.length}` },
            { id: 'circuit' as TabType, label: '២. បន្ទប់ពិសោធន៍សៀគ្វី', icon: Zap, badge: 'Simulator' },
            { id: 'tester' as TabType, label: '៣. មន្ទីរពិសោធន៍តេស្តសារធាតុ', icon: Cpu, count: `${testedMaterialIds.length}/${SCIENCE_TEST_MATERIALS.length}` },
            { id: 'quiz' as TabType, label: '៤. ល្បែងកម្រងសំណួរ QCM', icon: Award, count: `${Object.keys(userAnswers).length}/${SCIENCE_QUIZ_QUESTIONS.length}` },
            { id: 'badges' as TabType, label: '៥. វឌ្ឍនភាព & មេដាយ', icon: Trophy, count: `${unlockedBadges.length}/${SCIENCE_ACHIEVEMENT_BADGES.length}` },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playScienceSound('click', isSoundMuted);
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-700 text-amber-300'
                    }`}
                  >
                    {toKhmerNum(tab.count)}
                  </span>
                )}
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-900/60">
          {/* TAB 1: Micro-learning Cards */}
          {activeTab === 'cards' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                  <button
                    onClick={() => setCardChapterFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${
                      cardChapterFilter === 'all'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ទាំងអស់ ({toKhmerNum(SCIENCE_MICRO_CARDS.length)})
                  </button>
                  {[5, 4, 3, 2].map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setCardChapterFilter(ch)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                        cardChapterFilter === ch
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      ជំពូកទី {toKhmerNum(ch)}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={cardSearch}
                    onChange={(e) => setCardSearch(e.target.value)}
                    placeholder="ស្វែងរកមេរៀន ឬពាក្យគន្លឹះ..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {SCIENCE_MICRO_CARDS.filter((c) => {
                  const matchChapter = cardChapterFilter === 'all' || c.chapterNumber === cardChapterFilter;
                  const matchSearch =
                    !cardSearch ||
                    c.lessonTitle.toLowerCase().includes(cardSearch.toLowerCase()) ||
                    c.summary.toLowerCase().includes(cardSearch.toLowerCase()) ||
                    c.keyPoints.some((p) => p.toLowerCase().includes(cardSearch.toLowerCase()));
                  return matchChapter && matchSearch;
                }).map((card) => {
                  const isRead = readCardIds.includes(card.id);
                  const isSelected = selectedCard?.id === card.id;

                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        setSelectedCard(card);
                        handleReadCard(card.id);
                        playScienceSound('click', isSoundMuted);
                      }}
                      className={`bg-slate-950 rounded-2xl border transition p-4 flex flex-col justify-between cursor-pointer group hover:border-amber-400/60 shadow-lg ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-amber-400/30'
                          : isRead
                          ? 'border-slate-800'
                          : 'border-slate-800/80 hover:bg-slate-950/80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-lg">
                              {card.icon}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-slate-700">
                              {card.pages}
                            </span>
                          </div>
                          {isRead && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> បានរៀន
                            </span>
                          )}
                        </div>

                        <div className="mt-3">
                          <span className="text-[10px] font-bold text-slate-400">{card.chapterTitle}</span>
                          <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition line-clamp-1 mt-0.5">
                            {card.lessonTitle}
                          </h3>
                          <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                            {card.summary}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          {toKhmerNum(card.keyPoints.length)} ចំណុចគន្លឹះ
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 group-hover:text-amber-300 transition">
                          មើលលម្អិត <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Card Detailed Modal / Full Reader */}
              {selectedCard && (
                <div className="mt-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-amber-400/30 p-5 sm:p-7 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-500/20">
                        {selectedCard.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {selectedCard.chapterTitle}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {selectedCard.pages}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white font-moul mt-1">
                          {selectedCard.lessonTitle}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakCard(selectedCard)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          speakingCardId === selectedCard.id
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{speakingCardId === selectedCard.id ? 'កំពុងអាន...' : 'អានសម្លេង'}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleReadCard(selectedCard.id);
                          if (onShowToast) onShowToast('បានកត់ត្រាការរៀនចប់សព្វគ្រប់!');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>សម្គាល់ថាបានរៀន</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                    <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5 mb-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      ខ្លឹមសារសង្ខេបនៃមេរៀន (Core Summary)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {selectedCard.summary}
                    </p>
                  </div>

                  {/* Key Points */}
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      ចំណុចគន្លឹះត្រូវចងចាំ (Key Concepts)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {selectedCard.keyPoints.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-300"
                        >
                          <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {toKhmerNum(pIdx + 1)}
                          </span>
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vocabulary & Did you know */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        វាក្យសព្ទវិទ្យាសាស្ត្រ (Scientific Terms)
                      </h4>
                      <div className="space-y-2 pt-1">
                        {selectedCard.vocabulary.map((vocab, vIdx) => (
                          <div key={vIdx} className="text-xs border-b border-slate-800/60 pb-1.5 last:border-0">
                            <span className="font-bold text-amber-300">{vocab.word} ៖ </span>
                            <span className="text-slate-300">{vocab.definition}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedCard.didYouKnow && (
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">
                          <h4 className="text-xs font-black text-cyan-300 flex items-center gap-1.5 mb-1">
                            <span>💡 ដឹងទេថា? (Fun Fact)</span>
                          </h4>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {selectedCard.didYouKnow}
                          </p>
                        </div>
                      )}
                      {selectedCard.practicalApplication && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                          <h4 className="text-xs font-black text-emerald-300 flex items-center gap-1.5 mb-1">
                            <span>🌱 ការអនុវត្តជាក់ស្តែងក្នុងជីវិត</span>
                          </h4>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {selectedCard.practicalApplication}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick shortcuts to lab */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-slate-400">
                      ចង់អនុវត្តជាក់ស្តែងលើមេរៀននេះទេ?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveTab('circuit');
                          playScienceSound('click', isSoundMuted);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl font-black text-xs hover:from-amber-400 hover:to-orange-400 transition shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>បើកបន្ទប់ពិសោធន៍សៀគ្វី ⚡</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('tester');
                          playScienceSound('click', isSoundMuted);
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs border border-slate-700 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                        <span>តេស្តសារធាតុចម្លង 🔬</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Interactive Circuit Lab */}
          {activeTab === 'circuit' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              {/* Lab Control Bar */}
              <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                {/* Circuit Type Toggle */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    ប្រភេទសៀគ្វី (Circuit Scheme)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCircuitType('series');
                        setCircuitExploredTypes((prev) => ({ ...prev, series: true }));
                        checkBadgeUnlocks({ circuitTypeUsed: 'series' });
                        playScienceSound('click', isSoundMuted);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                        circuitType === 'series'
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      សៀគ្វីតជាស៊េរី (Series)
                    </button>
                    <button
                      onClick={() => {
                        setCircuitType('parallel');
                        setCircuitExploredTypes((prev) => ({ ...prev, parallel: true }));
                        checkBadgeUnlocks({ circuitTypeUsed: 'parallel' });
                        playScienceSound('click', isSoundMuted);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                        circuitType === 'parallel'
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      សៀគ្វីតជាខ្នែង (Parallel)
                    </button>
                  </div>
                </div>

                {/* Battery Selector */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    ប្រភពអគ្គិសនី (ថ្មពិល 1.5V)
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() => {
                          setBatteryCount(count as 1 | 2 | 3);
                          playScienceSound('spark', isSoundMuted);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          batteryCount === count
                            ? 'bg-orange-500 text-white font-black shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span>🔋 {toKhmerNum(count)} ថ្ម ({count * 1.5}V)</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bulb 1 Disconnect Tester */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    ពិសោធន៍ដោះអំពូល (Unscrew Bulb 1)
                  </span>
                  <button
                    onClick={() => {
                      setIsBulb1Disconnected(!isBulb1Disconnected);
                      playScienceSound('click', isSoundMuted);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isBulb1Disconnected
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{isBulb1Disconnected ? '⚠️ អំពូល L1 បានដោះចេញ' : 'ភ្ជាប់អំពូល L1 ធម្មតា'}</span>
                  </button>
                </div>

                {/* Animation toggles */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowElectronFlow(!showElectronFlow)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                      showElectronFlow
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    អេឡិចត្រុង e⁻ ({showElectronFlow ? 'បើក' : 'បិទ'})
                  </button>
                  <button
                    onClick={() => setShowCurrentDirection(!showCurrentDirection)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                      showCurrentDirection
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    ទិសដៅចរន្ត (+) ({showCurrentDirection ? 'បើក' : 'បិទ'})
                  </button>
                </div>
              </div>

              {/* Circuit Board Workbench (SVG Interactive Visualizer) */}
              <div className="bg-slate-950 rounded-3xl border-2 border-slate-800 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
                {/* Circuit Status Message Banner */}
                <div className="mb-4 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full animate-ping bg-amber-400" />
                    <span className="text-xs sm:text-sm font-bold text-amber-200">
                      {circuitState.statusKhmer}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">
                    ទំព័រ ១០៤-១០៦ MoEYS
                  </span>
                </div>

                {/* SVG Circuit Canvas */}
                <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 600 340">
                    <defs>
                      {/* Glow filters for Bulbs */}
                      <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="10" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D97706" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#D97706" />
                      </linearGradient>
                    </defs>

                    {/* Circuit Wire Background Paths */}
                    {circuitType === 'series' ? (
                      // Single Series Loop: (100,60) -> (500,60) -> (500,260) -> (100,260) -> (100,60)
                      <path
                        d="M 120 70 L 480 70 L 480 250 L 120 250 Z"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      // Parallel Loop: Outer loop + middle parallel bridge
                      <g>
                        {/* Outer Loop */}
                        <path
                          d="M 120 60 L 480 60 L 480 260 L 120 260 Z"
                          fill="none"
                          stroke="#475569"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Inner Branch (Bulb 2 Branch) */}
                        <path
                          d="M 320 60 L 320 260"
                          fill="none"
                          stroke="#475569"
                          strokeWidth="8"
                          strokeLinecap="round"
                        />
                      </g>
                    )}

                    {/* Active Wire Glowing Line when Current flows */}
                    {circuitState.hasCurrent && (
                      <path
                        d={
                          circuitType === 'series'
                            ? 'M 120 70 L 480 70 L 480 250 L 120 250 Z'
                            : 'M 120 60 L 480 60 L 480 260 L 120 260 Z'
                        }
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={showElectronFlow ? '6 6' : 'none'}
                        className={showElectronFlow ? 'animate-[dash_1s_linear_infinite]' : ''}
                      />
                    )}

                    {/* Animated Electron particles along wire (Negative (-) to Positive (+)) */}
                    {circuitState.hasCurrent && showElectronFlow && (
                      <g className="animate-pulse">
                        {/* Series dots */}
                        {circuitType === 'series' ? (
                          <>
                            <circle cx="200" cy="70" r="4" fill="#38BDF8" />
                            <circle cx="340" cy="70" r="4" fill="#38BDF8" />
                            <circle cx="480" cy="160" r="4" fill="#38BDF8" />
                            <circle cx="380" cy="250" r="4" fill="#38BDF8" />
                            <circle cx="240" cy="250" r="4" fill="#38BDF8" />
                            <circle cx="120" cy="160" r="4" fill="#38BDF8" />
                          </>
                        ) : (
                          <>
                            <circle cx="220" cy="60" r="4" fill="#38BDF8" />
                            <circle cx="400" cy="60" r="4" fill="#38BDF8" />
                            <circle cx="480" cy="160" r="4" fill="#38BDF8" />
                            <circle cx="320" cy="160" r="4" fill="#38BDF8" />
                            <circle cx="400" cy="260" r="4" fill="#38BDF8" />
                            <circle cx="220" cy="260" r="4" fill="#38BDF8" />
                            <circle cx="120" cy="160" r="4" fill="#38BDF8" />
                          </>
                        )}
                      </g>
                    )}

                    {/* Conventional Current Flow Arrows (Positive (+) to Negative (-)) */}
                    {circuitState.hasCurrent && showCurrentDirection && (
                      <g fill="#F59E0B">
                        <polygon points="280,66 270,61 270,71" />
                        <polygon points="484,170 479,160 489,160" />
                        <polygon points="260,254 270,249 270,259" />
                        <polygon points="116,150 111,160 121,160" />
                      </g>
                    )}

                    {/* 1. BATTERY COMPONENT (Left Side: cx=120, cy=160) */}
                    <g transform="translate(90, 120)">
                      {/* Battery Body */}
                      <rect x="10" y="10" width="40" height="60" rx="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                      {/* Terminal caps */}
                      <rect x="23" y="2" width="14" height="8" rx="2" fill="#E2E8F0" />
                      <text x="30" y="25" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="bold">+</text>
                      <text x="30" y="62" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="bold">-</text>
                      <text x="30" y="44" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="bold">
                        {circuitVoltage}V
                      </text>
                      <text x="30" y="85" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="bold">
                        ថ្មពិល ({batteryCount})
                      </text>
                    </g>

                    {/* 2. SWITCH COMPONENT (Bottom: cx=300, cy=250) */}
                    <g transform="translate(260, circuitType === 'series' ? 225 : 235)">
                      <rect x="0" y="0" width="80" height="30" rx="8" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
                      {/* Switch terminals */}
                      <circle cx="15" cy="15" r="4" fill="#94A3B8" />
                      <circle cx="65" cy="15" r="4" fill="#94A3B8" />
                      {/* Switch lever arm */}
                      <line
                        x1="15"
                        y1="15"
                        x2={isSwitchClosed ? "65" : "55"}
                        y2={isSwitchClosed ? "15" : "2"}
                        stroke={isSwitchClosed ? "#10B981" : "#EF4444"}
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                      <text x="40" y="42" textAnchor="middle" fill="#CBD5E1" fontSize="9" fontWeight="bold">
                        កុងតាក់ {isSwitchClosed ? '(បិទ)' : '(ចំហ)'}
                      </text>
                    </g>

                    {/* 3. LIGHT BULB 1 (L1) */}
                    {circuitType === 'series' ? (
                      // Series: Bulb 1 is at top left-middle (x=240, y=70)
                      <g transform="translate(210, 35)">
                        {/* Glow halo when lit */}
                        {circuitState.bulb1Glowing && (
                          <circle
                            cx="30"
                            cy="35"
                            r={26 * (0.8 + circuitState.bulb1Brightness * 0.6)}
                            fill="url(#bulbGlow)"
                            opacity={0.4 + circuitState.bulb1Brightness * 0.5}
                            className="text-amber-400 fill-amber-400/40"
                          />
                        )}
                        {/* Bulb Base */}
                        <rect x="22" y="55" width="16" height="12" rx="2" fill="#64748B" />
                        {/* Bulb Glass */}
                        <circle
                          cx="30"
                          cy="35"
                          r="18"
                          fill={circuitState.bulb1Glowing ? '#FEF08A' : isBulb1Disconnected ? '#334155' : '#1E293B'}
                          stroke={circuitState.bulb1Glowing ? '#FACC15' : '#475569'}
                          strokeWidth="2"
                        />
                        {/* Filament */}
                        <path
                          d="M 24 40 Q 30 25 36 40"
                          fill="none"
                          stroke={circuitState.bulb1Glowing ? '#EA580C' : '#64748B'}
                          strokeWidth="2"
                        />
                        <text x="30" y="80" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="bold">
                          អំពូល L1 {isBulb1Disconnected ? '(ដោះចេញ)' : ''}
                        </text>
                      </g>
                    ) : (
                      // Parallel: Bulb 1 is on Middle Branch (x=320, y=160)
                      <g transform="translate(290, 125)">
                        {circuitState.bulb1Glowing && (
                          <circle
                            cx="30"
                            cy="35"
                            r={28 * (0.8 + circuitState.bulb1Brightness * 0.6)}
                            fill="url(#bulbGlow)"
                            opacity={0.4 + circuitState.bulb1Brightness * 0.5}
                            className="text-amber-400 fill-amber-400/40"
                          />
                        )}
                        <rect x="22" y="55" width="16" height="12" rx="2" fill="#64748B" />
                        <circle
                          cx="30"
                          cy="35"
                          r="18"
                          fill={circuitState.bulb1Glowing ? '#FEF08A' : isBulb1Disconnected ? '#334155' : '#1E293B'}
                          stroke={circuitState.bulb1Glowing ? '#FACC15' : '#475569'}
                          strokeWidth="2"
                        />
                        <path
                          d="M 24 40 Q 30 25 36 40"
                          fill="none"
                          stroke={circuitState.bulb1Glowing ? '#EA580C' : '#64748B'}
                          strokeWidth="2"
                        />
                        <text x="30" y="80" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="bold">
                          អំពូល L1 {isBulb1Disconnected ? '(ដោះចេញ)' : ''}
                        </text>
                      </g>
                    )}

                    {/* 4. LIGHT BULB 2 (L2) */}
                    {circuitType === 'series' ? (
                      // Series: Bulb 2 is at top right-middle (x=370, y=70)
                      <g transform="translate(350, 35)">
                        {circuitState.bulb2Glowing && (
                          <circle
                            cx="30"
                            cy="35"
                            r={26 * (0.8 + circuitState.bulb2Brightness * 0.6)}
                            fill="url(#bulbGlow)"
                            opacity={0.4 + circuitState.bulb2Brightness * 0.5}
                            className="text-amber-400 fill-amber-400/40"
                          />
                        )}
                        <rect x="22" y="55" width="16" height="12" rx="2" fill="#64748B" />
                        <circle
                          cx="30"
                          cy="35"
                          r="18"
                          fill={circuitState.bulb2Glowing ? '#FEF08A' : '#1E293B'}
                          stroke={circuitState.bulb2Glowing ? '#FACC15' : '#475569'}
                          strokeWidth="2"
                        />
                        <path
                          d="M 24 40 Q 30 25 36 40"
                          fill="none"
                          stroke={circuitState.bulb2Glowing ? '#EA580C' : '#64748B'}
                          strokeWidth="2"
                        />
                        <text x="30" y="80" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="bold">
                          អំពូល L2
                        </text>
                      </g>
                    ) : (
                      // Parallel: Bulb 2 is on Outer Right Branch (x=480, y=160)
                      <g transform="translate(450, 125)">
                        {circuitState.bulb2Glowing && (
                          <circle
                            cx="30"
                            cy="35"
                            r={28 * (0.8 + circuitState.bulb2Brightness * 0.6)}
                            fill="url(#bulbGlow)"
                            opacity={0.4 + circuitState.bulb2Brightness * 0.5}
                            className="text-amber-400 fill-amber-400/40"
                          />
                        )}
                        <rect x="22" y="55" width="16" height="12" rx="2" fill="#64748B" />
                        <circle
                          cx="30"
                          cy="35"
                          r="18"
                          fill={circuitState.bulb2Glowing ? '#FEF08A' : '#1E293B'}
                          stroke={circuitState.bulb2Glowing ? '#FACC15' : '#475569'}
                          strokeWidth="2"
                        />
                        <path
                          d="M 24 40 Q 30 25 36 40"
                          fill="none"
                          stroke={circuitState.bulb2Glowing ? '#EA580C' : '#64748B'}
                          strokeWidth="2"
                        />
                        <text x="30" y="80" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="bold">
                          អំពូល L2 (ខ្នែង)
                        </text>
                      </g>
                    )}
                  </svg>

                  {/* Big interactive switch button overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                    <button
                      onClick={() => {
                        const next = !isSwitchClosed;
                        setIsSwitchClosed(next);
                        playScienceSound(next ? 'switch_on' : 'switch_off', isSoundMuted);
                        if (next) {
                          checkBadgeUnlocks({ circuitSwitched: true });
                        }
                      }}
                      className={`px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-2xl transition-all duration-200 active:scale-95 cursor-pointer border ${
                        isSwitchClosed
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-300 shadow-emerald-500/30'
                          : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-rose-600/30'
                      }`}
                    >
                      <Zap className={`w-4 h-4 ${isSwitchClosed ? 'fill-slate-950' : ''}`} />
                      <span>{isSwitchClosed ? '🔌 បិទកុងតាក់ (ភ្ជាប់ចរន្ត ON)' : '⚡ បើកកុងតាក់ (កាត់ផ្ដាច់ចរន្ត OFF)'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Meters Panel (Ammeter & Voltmeter) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {/* Voltmeter Card */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-lg border border-blue-500/30">
                        V
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">វ៉ុលម៉ែត្រ (Voltmeter)</span>
                        <span className="text-xs font-bold text-white">វាស់កម្លាំងអគ្គិសនីចលករ</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-cyan-400 font-mono">
                        {toKhmerNum(circuitState.voltageVolts)} V
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        តង់ស្យុងសរុប
                      </span>
                    </div>
                  </div>

                  {/* Ammeter Card */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg border border-amber-500/30">
                        A
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">អំពែម៉ែត្រ (Ammeter)</span>
                        <span className="text-xs font-bold text-white">វាស់អាំងតង់ស៊ីតេចរន្ត</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-amber-400 font-mono">
                        {toKhmerNum(circuitState.currentAmpere)} A
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {toKhmerNum(Math.round(circuitState.currentAmpere * 1000))} mA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Observations Note based on textbook */}
                <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-200 space-y-1">
                  <div className="font-black text-amber-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>សេចក្តីសន្និដ្ឋានសំខាន់តាមសៀវភៅពុម្ព MoEYS (ទំព័រ ១០៥) ៖</span>
                  </div>
                  <p className="leading-relaxed">
                    • <strong>សៀគ្វីតជាស៊េរី ៖</strong> ចរន្តមានផ្លូវរត់តែមួយគត់។ បើអំពូលមួយខូច ឬកាត់ផ្ដាច់ នោះគ្រឿងទទួលដទៃទៀតគ្មានចរន្តឆ្លងកាត់ទេ (អំពូលទាំងអស់រលត់)។
                  </p>
                  <p className="leading-relaxed">
                    • <strong>សៀគ្វីតជាខ្នែង ៖</strong> ចរន្តមានផ្លូវរត់ច្រើនបែកខ្នែង។ បើគ្រឿងទទួលណាមួយខូច គ្រឿងទទួលដទៃទៀតនៅតែមានចរន្តឆ្លងកាត់ និងដំណើរការបានធម្មតា (ដូចបណ្ដាញភ្លើងតាមគេហដ្ឋាន)។
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Conductor & Insulator Tester */}
          {activeTab === 'tester' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      ការពិសោធន៍ជាក់ស្តែង ទំព័រ ១០២ MoEYS
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white font-moul mt-1">
                      មន្ទីរពិសោធន៍តេស្តសារធាតុចម្លង & អ៊ីសូឡង់អគ្គិសនី
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      ចុចជ្រើសរើសសម្ភារខាងក្រោម ដើម្បីតភ្ជាប់រវាងដង្កៀបខ្សែចម្លង និងសង្កេតមើលថាតើអំពូលភ្លឺ ឬអត់!
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-2xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-300">
                      បានតេស្ត ៖{' '}
                      <strong className="text-amber-300">{toKhmerNum(testedMaterialIds.length)}</strong> /{' '}
                      {toKhmerNum(SCIENCE_TEST_MATERIALS.length)} មុខ
                    </span>
                  </div>
                </div>

                {/* Tester Visual Workbench */}
                <div className="bg-slate-900/90 rounded-2xl border-2 border-slate-800 p-4 sm:p-6 relative overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Left: Test Bench Diagram */}
                    <div className="md:col-span-2 relative h-56 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-4">
                      {/* Tester SVG */}
                      <svg className="w-full h-full" viewBox="0 0 460 200">
                        {/* Wires */}
                        {/* Left wire to left alligator clip */}
                        <path d="M 60 140 L 60 70 L 170 70" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                        {/* Right wire from right clip to bulb then to battery */}
                        <path d="M 290 70 L 380 70 L 380 140 L 160 140" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" />

                        {/* Active Wire Glow if Conductor */}
                        {activeTestMaterial?.type === 'conductor' && isTesterSwitchOn && (
                          <g>
                            <path d="M 60 140 L 60 70 L 170 70" fill="none" stroke="#F59E0B" strokeWidth="3" />
                            <path d="M 290 70 L 380 70 L 380 140 L 160 140" fill="none" stroke="#F59E0B" strokeWidth="3" />
                            {/* Animated current dots */}
                            <circle cx="110" cy="70" r="3" fill="#38BDF8" className="animate-ping" />
                            <circle cx="340" cy="70" r="3" fill="#38BDF8" className="animate-ping" />
                          </g>
                        )}

                        {/* Battery (Bottom) */}
                        <g transform="translate(70, 120)">
                          <rect x="0" y="0" width="70" height="35" rx="5" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
                          <text x="35" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">ថ្មពិល 3V</text>
                        </g>

                        {/* Alligator Clip Left (x=170, y=70) */}
                        <g transform="translate(155, 60)">
                          <polygon points="0,5 20,10 0,15" fill="#94A3B8" />
                          <circle cx="5" cy="10" r="3" fill="#CBD5E1" />
                        </g>

                        {/* Alligator Clip Right (x=290, y=70) */}
                        <g transform="translate(285, 60)">
                          <polygon points="20,5 0,10 20,15" fill="#94A3B8" />
                          <circle cx="15" cy="10" r="3" fill="#CBD5E1" />
                        </g>

                        {/* Test Material Slot (Center: 180 to 280) */}
                        <g transform="translate(180, 50)">
                          <rect
                            x="0"
                            y="0"
                            width="100"
                            height="40"
                            rx="10"
                            fill={
                              activeTestMaterial?.type === 'conductor'
                                ? '#065F46'
                                : activeTestMaterial?.type === 'insulator'
                                ? '#831843'
                                : '#1E293B'
                            }
                            stroke={
                              activeTestMaterial?.type === 'conductor'
                                ? '#10B981'
                                : activeTestMaterial?.type === 'insulator'
                                ? '#F43F5E'
                                : '#475569'
                            }
                            strokeWidth="2"
                            strokeDasharray={activeTestMaterial ? 'none' : '4 4'}
                          />
                          <text x="50" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                            {activeTestMaterial ? activeTestMaterial.icon : 'ដាក់សម្ភារតេស្ត'}
                          </text>
                        </g>

                        {/* Light Bulb (Top Right: x=380, y=70) */}
                        <g transform="translate(355, 30)">
                          {/* Bulb Glow */}
                          {activeTestMaterial?.type === 'conductor' && isTesterSwitchOn && (
                            <circle cx="25" cy="30" r="35" fill="#FACC15" opacity="0.3" className="animate-pulse" />
                          )}
                          <circle
                            cx="25"
                            cy="30"
                            r="18"
                            fill={activeTestMaterial?.type === 'conductor' && isTesterSwitchOn ? '#FEF08A' : '#1E293B'}
                            stroke={activeTestMaterial?.type === 'conductor' && isTesterSwitchOn ? '#EAB308' : '#475569'}
                            strokeWidth="2"
                          />
                          <path
                            d="M 19 35 Q 25 20 31 35"
                            fill="none"
                            stroke={activeTestMaterial?.type === 'conductor' && isTesterSwitchOn ? '#EA580C' : '#64748B'}
                            strokeWidth="2"
                          />
                          <text x="25" y="70" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontWeight="bold">
                            {activeTestMaterial?.type === 'conductor' ? 'អំពូលភ្លឺ ✨' : 'អំពូលរលត់ ❌'}
                          </text>
                        </g>
                      </svg>
                    </div>

                    {/* Right: Test Result Info Card */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{activeTestMaterial?.icon}</span>
                        <div>
                          <h4 className="text-sm font-black text-white">
                            {activeTestMaterial?.khmerName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {activeTestMaterial?.name}
                          </span>
                        </div>
                      </div>

                      {/* Result badge */}
                      <div>
                        {activeTestMaterial?.type === 'conductor' ? (
                          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>ជា «អង្គធាតុចម្លងអគ្គិសនី» (Conductor)</span>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>ជា «អង្គធាតុអ៊ីសូឡង់» (Insulator)</span>
                          </div>
                        )}
                      </div>

                      {/* Scientific explanation */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeTestMaterial?.scientificReason}
                      </p>

                      <div className="text-[10px] text-amber-300/90 font-bold bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        {activeTestMaterial?.textbookRef}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Materials Selection Grid (10 items) */}
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    ជ្រើសរើសសម្ភារដើម្បីដាក់តេស្តក្នុងមន្ទីរពិសោធន៍ ៖
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {SCIENCE_TEST_MATERIALS.map((mat) => {
                      const isTested = testedMaterialIds.includes(mat.id);
                      const isSelected = activeTestMaterial?.id === mat.id;

                      return (
                        <button
                          key={mat.id}
                          onClick={() => {
                            setActiveTestMaterial(mat);
                            if (!testedMaterialIds.includes(mat.id)) {
                              const next = [...testedMaterialIds, mat.id];
                              setTestedMaterialIds(next);
                              saveProgress({ testedMaterialIds: next });
                              checkBadgeUnlocks({ testedMaterials: next });
                            }
                            playScienceSound(mat.type === 'conductor' ? 'correct' : 'wrong', isSoundMuted);
                          }}
                          className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer group active:scale-95 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30'
                              : isTested
                              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                              : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl group-hover:scale-110 transition">{mat.icon}</span>
                            {isTested && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <div className="mt-2">
                            <span className="text-xs font-black text-white block line-clamp-1">
                              {mat.khmerName}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider block mt-0.5 ${
                                mat.type === 'conductor' ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {mat.type === 'conductor' ? 'ចម្លងអគ្គិសនី' : 'អ៊ីសូឡង់'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Interactive Quiz */}
          {activeTab === 'quiz' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                {/* Quiz Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      កម្រងសំណួរវាស់ស្ទង់ចំណេះដឹង MoEYS
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white font-moul mt-1">
                      ល្បែងកម្រងសំណួរវិទ្យាសាស្ត្រ (Interactive Science Quiz)
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">ពិន្ទុរបស់អ្នក</span>
                      <span className="text-base font-black text-amber-400 font-mono">
                        {toKhmerNum(
                          Object.entries(userAnswers).filter(([qid, ansIdx]) => {
                            const q = SCIENCE_QUIZ_QUESTIONS.find(item => item.id === Number(qid));
                            const chosenIdx = Number(ansIdx);
                            return q && q.options[chosenIdx]?.isCorrect;
                          }).length * 10
                        )}{' '}
                        ពិន្ទុ
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserAnswers({});
                        setCurrentQuizIdx(0);
                        setShowQuizReview(false);
                        saveProgress({ userAnswers: {} });
                        playScienceSound('click', isSoundMuted);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="ចាប់ផ្ដើមឡើងវិញ"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question progress pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {SCIENCE_QUIZ_QUESTIONS.map((q, idx) => {
                    const answered = userAnswers[q.id] !== undefined;
                    const isCorrect = answered && q.options[userAnswers[q.id]]?.isCorrect;
                    const isCurrent = currentQuizIdx === idx;

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentQuizIdx(idx);
                          playScienceSound('click', isSoundMuted);
                        }}
                        className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center transition shrink-0 cursor-pointer ${
                          isCurrent
                            ? 'ring-2 ring-amber-400 font-black'
                            : ''
                        } ${
                          answered
                            ? isCorrect
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-rose-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {toKhmerNum(idx + 1)}
                      </button>
                    );
                  })}
                </div>

                {/* Active Question Box */}
                {(() => {
                  const q = SCIENCE_QUIZ_QUESTIONS[currentQuizIdx];
                  const userAnswerIdx = userAnswers[q.id];
                  const isAnswered = userAnswerIdx !== undefined;

                  return (
                    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-400">
                          {q.chapter} &bull; {q.lessonRef}
                        </span>
                        <span className="text-xs font-black text-slate-400">
                          សំណួរ {toKhmerNum(currentQuizIdx + 1)} នៃ {toKhmerNum(SCIENCE_QUIZ_QUESTIONS.length)}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-black text-white leading-relaxed">
                        {q.question}
                      </h4>

                      {/* Options List */}
                      <div className="space-y-2.5">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAnswerIdx === oIdx;
                          let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';

                          if (isAnswered) {
                            if (opt.isCorrect) {
                              btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold';
                            } else if (isSelected && !opt.isCorrect) {
                              btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold';
                            } else {
                              btnStyle = 'bg-slate-950/50 border-slate-800/50 text-slate-500';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={isAnswered}
                              onClick={() => {
                                const nextAnswers = { ...userAnswers, [q.id]: oIdx };
                                setUserAnswers(nextAnswers);
                                saveProgress({ userAnswers: nextAnswers });

                                if (opt.isCorrect) {
                                  playScienceSound('correct', isSoundMuted);
                                  confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
                                } else {
                                  playScienceSound('wrong', isSoundMuted);
                                }

                                checkBadgeUnlocks({ answeredCorrectCount: undefined });
                              }}
                              className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-start gap-3 transition cursor-pointer active:scale-98 ${btnStyle}`}
                            >
                              <span
                                className={`w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                                  isAnswered
                                    ? opt.isCorrect
                                      ? 'bg-emerald-500 text-slate-950'
                                      : isSelected
                                      ? 'bg-rose-500 text-white'
                                      : 'bg-slate-800 text-slate-400'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {['ក', 'ខ', 'គ', 'ឃ'][oIdx]}
                              </span>
                              <span className="leading-relaxed flex-1">{opt.text}</span>
                              {isAnswered && opt.isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              )}
                              {isAnswered && isSelected && !opt.isCorrect && (
                                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box after answer */}
                      {isAnswered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                            q.options[userAnswerIdx]?.isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                          }`}
                        >
                          <div className="font-black flex items-center gap-1.5 mb-1">
                            <Info className="w-4 h-4" />
                            <span>
                              {q.options[userAnswerIdx]?.isCorrect ? '✅ ត្រឹមត្រូវល្អណាស់!' : '❌ ចម្លើយមិនទាន់ត្រឹមត្រូវទេ!'}
                            </span>
                          </div>
                          <p>{q.explanation}</p>
                        </motion.div>
                      )}

                      {/* Navigation buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          disabled={currentQuizIdx === 0}
                          onClick={() => {
                            setCurrentQuizIdx(currentQuizIdx - 1);
                            playScienceSound('click', isSoundMuted);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>សំណួរមុន</span>
                        </button>

                        <button
                          disabled={currentQuizIdx === SCIENCE_QUIZ_QUESTIONS.length - 1}
                          onClick={() => {
                            setCurrentQuizIdx(currentQuizIdx + 1);
                            playScienceSound('click', isSoundMuted);
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40"
                        >
                          <span>សំណួរបន្ទាប់</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 5: Achievement Badges */}
          {activeTab === 'badges' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                <div className="text-center max-w-md mx-auto space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center text-3xl font-black shadow-xl shadow-amber-500/20">
                    🏆
                  </div>
                  <h3 className="text-lg font-black text-white font-moul">
                    មេដាយកិត្តិយសវិទ្យាសាស្ត្រ (Science Badges)
                  </h3>
                  <p className="text-xs text-slate-400">
                    បំពេញភារកិច្ចស្វ័យសិក្សា និងការពិសោធន៍ជាក់ស្តែង ដើម្បីទទួលបានមេដាយកិត្តិយស!
                  </p>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SCIENCE_ACHIEVEMENT_BADGES.map((badge) => {
                    const isUnlocked = unlockedBadges.includes(badge.id);

                    return (
                      <div
                        key={badge.id}
                        className={`p-5 rounded-3xl border transition relative overflow-hidden flex items-start gap-4 ${
                          isUnlocked
                            ? 'bg-slate-900 border-amber-400/50 shadow-lg shadow-amber-500/10'
                            : 'bg-slate-950/70 border-slate-800/80 opacity-70'
                        }`}
                      >
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg ${
                            isUnlocked
                              ? `bg-gradient-to-tr ${badge.color} text-slate-950 font-black shadow-amber-500/20`
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {badge.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white font-moul">
                              {badge.khmerTitle}
                            </h4>
                            {isUnlocked ? (
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                ដោះសោររួច ✅
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                                នៅជាប់សោរ 🔒
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-amber-300 font-semibold block mt-0.5">
                            {badge.title}
                          </span>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            {badge.description}
                          </p>
                          <div className="mt-2 text-[10px] text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                            <strong>លក្ខខណ្ឌ ៖</strong> {badge.condition}
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
      </div>
    </div>
  );
};
