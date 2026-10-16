import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  X,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Volume2,
  VolumeX,
  Award,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  PenTool,
  Eraser,
  Eye,
  EyeOff,
  Flame,
  Star,
  Music,
  Heart,
  FileText,
  Search,
  Check,
  GraduationCap,
  MessageCircleQuestion,
  Layers,
  ArrowRight,
  RefreshCw,
  Zap,
  Users,
  Smartphone,
  QrCode,
  Copy,
  ExternalLink,
  Wifi,
  WifiOff,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonPlanDetail } from '../data/lessonPlans/types';
import {
  generateSessionId,
  subscribeToSlideSession,
  pushSlideHostState,
  SlideRemoteState
} from '../lib/slideRemoteSync';

interface KhmerLessonSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonPlanDetail;
  onShowToast?: (msg: string) => void;
}

// Web Audio API Sound Synthesizer for instant, lag-free sound effects
class SoundFx {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playPop() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // ignore
    }
  }

  playCorrect() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.25, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } catch {
      // ignore
    }
  }

  playBell() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(830.6, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // ignore
    }
  }

  playCheer() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.09);
        gain.gain.setValueAtTime(0.22, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.45);
      });
    } catch {
      // ignore
    }
  }
}

const sfx = new SoundFx();

export const KhmerLessonSlideModal: React.FC<KhmerLessonSlideModalProps> = ({
  isOpen,
  onClose,
  lesson,
  onShowToast
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1); // 1 = next, -1 = prev
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTeacherNotes, setShowTeacherNotes] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'extra'>('large');

  // Point-by-point animation step within the active slide
  const [activeStepPoint, setActiveStepPoint] = useState<number>(0);

  // Classroom Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerInitial, setTimerInitial] = useState<number>(0);

  // Drawing Canvas State
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#fbbf24');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // QR Remote Controller State
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [sessionId] = useState<string>(() => generateSessionId());
  const [isPhoneConnected, setIsPhoneConnected] = useState<boolean>(false);
  const lastProcessedCommandIdRef = useRef<string>('');

  const containerRef = useRef<HTMLDivElement | null>(null);

  // ================= SLIDES STRUCTURE WITH REAL PHOTOS, INQUIRY QUESTIONS & ILLUSTRATIONS =================
  const slides = useMemo(() => {
    if (lesson.id === 'khmer_gr6_lp01') {
      return [
    // SLIDE 0: TITLE & ADMINISTRATIVE COVER
    {
      id: 'slide_cover',
      type: 'cover',
      stepBadge: 'ក្រសួងអប់រំ យុវជន និងកីឡា • ថ្នាក់ទី ៦',
      title: 'អ្នកមានគុណ',
      subTitle: 'បំណិនៈ ការប្រើប្រាស់វចនានុក្រម និងការកត់ត្រាសំខាន់ៗក្នុងកំណាព្យ',
      grade: lesson.grade,
      subject: lesson.subject,
      duration: lesson.duration,
      teacher: lesson.teacherName,
      school: lesson.schoolName,
      sourceRef: lesson.sourceRef,
      promptQuestion: '«តើអ្នកណាខ្លះជាអ្នកមានគុណដ៏ធំធេងបំផុតក្នុងមួយជីវិតរបស់យើង?»',
      promptAnswer: '💡 មាតាបិតា (ឪពុកម្តាយ) និងលោកគ្រូអ្នកគ្រូ គឺជាអ្នកមានគុណដ៏ធំធេងដែលបានផ្តល់កំណើត បីបាច់ថែរក្សា និងអប់រំចំណេះវិជ្ជាដល់យើង!',
      photoUrl: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1000&auto=format&fit=crop&q=80',
      photoCaption: '👨‍👩‍👧‍👦 ក្តីស្រឡាញ់ និងការលះបង់ដ៏ធំធេងឥតលក្ខខណ្ឌរបស់មាតាបិតា',
      teacherNotes: 'ស្វាគមន៍សិស្សានុសិស្ស ណែនាំចំណងជើងមេរៀន និងពន្យល់ពីសារៈសំខាន់នៃការរៀនបំណិនវចនានុក្រម និងការកត់ត្រាកំណាព្យ។',
      themeBg: 'from-slate-950 via-indigo-950 to-purple-950',
      totalPoints: 3
    },

    // SLIDE 1: LEARNING OBJECTIVES (3 DOMAINS)
    {
      id: 'slide_objectives',
      type: 'objectives',
      stepBadge: 'វត្ថុបំណងនៃមេរៀន (Learning Objectives)',
      title: 'គោលបំណងចម្បង ៣ យ៉ាងដែលកូនត្រូវទទួលបាន',
      subTitle: 'បន្ទាប់ពីរៀនមេរៀននេះចប់ កូនៗទាំងអស់គ្នានឹងអាច៖',
      objectives: lesson.objectives,
      promptQuestion: '«ហេតុអ្វីបានជាយើងត្រូវកំណត់គោលដៅមុននឹងចាប់ផ្តើមរៀន?»',
      promptAnswer: '💡 ការកំណត់គោលដៅជួយឱ្យយើងដឹងទិសដៅរៀនច្បាស់លាស់ ផ្ចង់ស្មារតី និងទទួលបានចំណេះដឹងពេញលេញ!',
      photoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&auto=format&fit=crop&q=80',
      photoCaption: '📚 សិស្សានុសិស្សសិក្សាដោយភាពសកម្ម និងស្វាហាប់ក្នុងថ្នាក់រៀន',
      teacherNotes: 'សួរជំរុញសិស្សឱ្យអានវត្ថុបំណងទាំង ៣ ដើម្បីឱ្យសិស្សដឹងពីទិសដៅរៀនសូត្រក្នុងម៉ោងនេះច្បាស់លាស់។',
      themeBg: 'from-slate-950 via-blue-950 to-indigo-950',
      totalPoints: 3
    },

    // SLIDE 2: STEP 1 - WARM-UP & INQUIRY QUESTION
    {
      id: 'slide_step1',
      type: 'step1_warmup',
      stepBadge: 'ជំហានទី ១ : រដ្ឋបាលថ្នាក់ & កម្តៅសាច់ដុំ (៥-១០ នាទី)',
      title: 'ពិនិត្យសណ្តាប់ធ្នាប់ & សំណួរបំផុសស្មារតី',
      subTitle: 'បង្កើតបរិយាកាសរីករាយ និងភ្ញាក់រលឹកមុនចូលរៀន',
      promptQuestion: '❓ សំណួរបំផុស ៖ «តើនរណាជាអ្នកផ្តល់កំណើត និងចិញ្ចឹមបីបាច់កូនរហូតមកដល់ថ្ងៃនេះ? ហេតុអ្វីបានជាយើងហៅលោកទាំងពីរថា "អ្នកមានគុណ"?»',
      promptAnswer: '💡 ចម្លើយបំផុស ៖ ឪពុក និងម្តាយ គឺជាអ្នកមានគុណដ៏ធំធេងក្រៃលែង ព្រោះលោកបានផ្តល់កំណើត ចិញ្ចឹមបីបាច់ ថែរក្សា និងអប់រំទូន្មានកូនដោយក្តីមេត្តាធម៌ឥតលក្ខខណ្ឌ!',
      songTitle: 'ចម្រៀង «គុណម៉ែឪ» (ចង្វាក់សារ៉ាវ៉ាន់/កន្ត្រាក់អារម្មណ៍)',
      songLyrics: [
        '🎵 ឱគុណម៉ែឪ... ធំធេងក្រៃលែង រកអ្វីផ្ទឹមគ្មាន',
        'ចិញ្ចឹមបីបាច់... ថ្នាក់ថ្នមកូនមាន មិនគិតនឿយហត់',
        'ពេលកូនឃ្លានបាយ... ម៉ែបញ្ចុកឱ្យ មិនឱ្យខ្សត់',
        'កូនសូមសច្ចា... ប្រឹងរៀនប្រឹងសូត្រ តបស្នងគុណម៉ែ! 👏'
      ],
      points: [
        '✅ ពិនិត្យវត្តមាន សម្លៀកបំពាក់ និងអនាម័យ ៣ ស្អាត',
        '✅ ច្រៀងចម្រៀង «គុណម៉ែឪ» ធ្វើកាយវិការទះដៃ ៣ ចង្វាក់',
        '✅ ឆ្លើយសំណួរបំផុសចូលទៅកាន់មេរៀនថ្មី'
      ],
      photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=1000&auto=format&fit=crop&q=80',
      photoCaption: '🤱 មាតាបីបាច់ថ្នាក់ថ្នមកូនដោយក្តីមេត្តាករុណាឥតព្រំដែន',
      teacherNotes: 'ដឹកនាំសិស្សទះដៃ ៣ ចង្វាក់ រួចច្រៀងចម្រៀង «គុណម៉ែឪ» ធ្វើកាយវិការសប្បាយៗ លើកទឹកចិត្តសិស្សឱ្យភ្ញាក់រលឹក។',
      themeBg: 'from-slate-950 via-amber-950 to-orange-950',
      totalPoints: 3
    },

    // SLIDE 3: STEP 2 - HOMEWORK REVIEW & BRIDGE INQUIRY
    {
      id: 'slide_step2',
      type: 'step2_review',
      stepBadge: 'ជំហានទី ២ : កែកិច្ចការចាស់ & រំលឹកមេរៀន (១០-១៥ នាទី)',
      title: 'ពិនិត្យល្បះគំរូ & សំណួរភ្ជាប់ទៅមេរៀនថ្មី',
      subTitle: 'ពិនិត្យការតែងល្បះពីមេរៀនមុន & សំណួរស្ពានចម្លង (Bridge Question)',
      homeworkItems: [
        { word: 'សោមនស្ស', sentence: 'ឪពុកម្តាយមានចិត្តសោមនស្សរីករាយក្រៃលែង នៅពេលឃើញកូនប្រឡងជាប់។' },
        { word: 'មេត្តា', sentence: 'មាតាបិតាតែងតែមានក្តីមេត្តា និងស្រឡាញ់កូនៗស្មើៗគ្នា។' },
        { word: 'ឧបត្ថម្ភ', sentence: 'សប្បុរសជនបានឧបត្ថម្ភសម្ភារសិក្សាដល់សាលារៀនយើង។' }
      ],
      promptQuestion: '❓ សំណួរភ្ជាប់មេរៀន (Bridge Question) ៖ «តើអ្វីជាវចនានុក្រម? ហេតុអ្វីបានជាយើងត្រូវចេះប្រើប្រាស់វចនានុក្រមក្នុងការរៀនភាសាខ្មែរ?»',
      bridgeAnswer: '💡 ចម្លើយ ៖ វចនានុក្រម គឺជាកម្រងពាក្យដែលរៀបចំតាមលំដាប់ព្យញ្ជនៈ និងស្រៈ ដើម្បីពន្យល់ន័យ អក្ខរាវិរុទ្ធ ថ្នាក់ពាក្យ និងការបញ្ចេញសំឡេងបានត្រឹមត្រូវ!',
      photoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&auto=format&fit=crop&q=80',
      photoCaption: '✍️ សិស្សស្វ័យសិក្សា និងផ្ទៀងផ្ទាត់អក្ខរាវិរុទ្ធយ៉ាងផ្ចិតផ្ចង់',
      teacherNotes: 'ហៅសិស្ស ២-៣ នាក់ឡើងសរសេរល្បះ រួចចុចបង្ហាញល្បះគំរូ។ សួរសំណួរ Bridge Question ឱ្យសិស្សឆ្លើយមុននឹងបង្ហាញចម្លើយ។',
      themeBg: 'from-slate-950 via-purple-950 to-indigo-950',
      totalPoints: 3
    },

    // SLIDE 4: STEP 3 (PART 1) - 3-PHASE DICTIONARY LOOKUP RULES
    {
      id: 'slide_step3_dict_rules',
      type: 'step3_dict_rules',
      stepBadge: 'ជំហានទី ៣ : ខ្លឹមសារមេរៀនថ្មី (ដំណាក់កាលទី ១)',
      title: 'ក្បួន និងរបៀបប្រើប្រាស់វចនានុក្រមខ្មែរ ៣ ដំណាក់កាល',
      subTitle: 'ច្បាប់នៃការស្វែងរកពាក្យបានរហ័ស និងត្រឹមត្រូវបំផុតតាមក្បួនសម្តេច ជួន ណាត',
      promptQuestion: '❓ សំណួរបំផុស ៖ «ប្រសិនបើយើងចង់រកពាក្យ "កតញ្ញូ" និងពាក្យ "ឱវាទ" តើយើងត្រូវរកពាក្យណាមុន? ដោយសារអ្វី?»',
      promptAnswer: '💡 ត្រូវរកពាក្យ «កតញ្ញូ» មុន ព្រោះអក្សរ «ក» ស្ថិតនៅលំដាប់ទី១ នៃព្យញ្ជនៈ ឯអក្សរ «ឱ/អ» ស្ថិតនៅខាងចុង!',
      photoUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1000&auto=format&fit=crop&q=80',
      photoCaption: '📖 វចនានុក្រមខ្មែរ សម្តេចព្រះសង្ឃរាជ ជួន ណាត ជាឃ្លាំងចំណេះដឹងជាតិ',
      rules: [
        {
          step: 'ដំណាក់កាលទី ១',
          title: '១. ស្វែងរកតាមព្យញ្ជនៈ (៣៣ តួ)',
          desc: 'រៀបតាមលំដាប់ពី ក ដល់ អ ៖ ក ខ គ ឃ ង ... ហ ឡ អ (ព្យញ្ជនៈណាដែលមករកមុន ត្រូវបើកមុន)',
          icon: '🔤',
          color: 'from-blue-600 to-cyan-600',
          badge: 'ក - អ'
        },
        {
          step: 'ដំណាក់កាលទី ២',
          title: '២. ស្វែងរកតាមស្រៈនិស្ស័យ (២៣ តួ)',
          desc: 'រៀបតាមលំដាប់ស្រៈ ៖ ា ិ ី ឹ ឺ ុ ូ ួ ើ ឿ ៀ េ ែ ៃ ោ ៅ ុំ ំ ាំ ះ... (ពាក្យគ្មានស្រៈ ស្ថិតនៅមុនពាក្យមានស្រៈ)',
          icon: '✨',
          color: 'from-purple-600 to-pink-600',
          badge: 'ស្រៈនិស្ស័យ'
        },
        {
          step: 'ដំណាក់កាលទី ៣',
          title: '៣. ស្វែងរកតាមព្យញ្ជនៈប្រកប',
          desc: 'ពិនិត្យតួអក្សរប្រកបចុងពាក្យតាមលំដាប់ ក ង ច ញ ដ ត ណ ន ប ម យ រ ល វ ស ហ ឡ អ',
          icon: '🔍',
          color: 'from-emerald-600 to-teal-600',
          badge: 'អក្សរប្រកប'
        }
      ],
      teacherNotes: 'ពន្យល់ច្បាប់ទាំង ៣ ឱ្យច្បាស់។ ឱ្យសិស្សទន្ទេញលំដាប់ព្យញ្ជនៈ និងស្រៈនិស្ស័យខ្លីៗ។',
      themeBg: 'from-slate-950 via-slate-900 to-indigo-950',
      totalPoints: 3
    },

    // SLIDE 5: STEP 3 (PART 2) - INTERACTIVE DICTIONARY SPEED GAME
    {
      id: 'slide_dict_game',
      type: 'dict_race_game',
      stepBadge: 'ល្បែងសិក្សាឌីជីថល (Digital Learning Game)',
      title: '🏆 ល្បែងប្រណាំងរកពាក្យក្នុងវចនានុក្រម (Dictionary Speed Race)',
      subTitle: 'កំណត់ពេល ៦០ វិនាទី! ក្រុមណាស្វែងរកឃើញមុនគេ និងពន្យល់បានត្រឹមត្រូវ ទទួលបានពិន្ទុផ្កាយ ⭐',
      promptQuestion: '❓ សំណួរបំផុស ៖ «ចូររៀបលំដាប់ពាក្យទាំង ៤ ខាងក្រោម តាមលំដាប់ដែលមានក្នុងវចនានុក្រម៖ "សោភ័ណ, ឱវាទ, កតញ្ញូ, ឧបត្ថម្ភ"»',
      promptAnswer: '💡 លំដាប់ត្រឹមត្រូវ ៖ ១. កតញ្ញូ (ក) ➜ ២. ឧបត្ថម្ភ (ឧ) ➜ ៣. សោភ័ណ (ស) ➜ ៤. ឱវាទ (ឱ/អ)!',
      photoUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&auto=format&fit=crop&q=80',
      photoCaption: '⚡ បរិយាកាសប្រកួតប្រជែងជាក្រុមយ៉ាងរស់រវើកក្នុងថ្នាក់',
      words: [
        {
          word: 'កតញ្ញូ',
          type: '(គុ.) គុណនាម',
          meaning: 'ដែលដឹងគុណគេ ដែលដឹងគុណអ្នកមានគុណមកលើខ្លួន។',
          hint: 'ព្យញ្ជនៈ «ក» ➜ ត ➜ ញ្ញ ➜ ូ',
          order: 'លំដាប់ទី ១'
        },
        {
          word: 'ឧបត្ថម្ភ',
          type: '(កិ./ន.) កិរិយា/នាម',
          meaning: 'ទំនុកបម្រុង ផ្គត់ផ្គង់ ជួយទ្រទ្រង់ឱ្យរឹងមាំ។',
          hint: 'ស្រៈពេញតួ «ឧ» ➜ ប ➜ ត្ថ ➜ ម ➜ ្ភ',
          order: 'លំដាប់ទី ២'
        },
        {
          word: 'សោភ័ណ',
          type: '(គុ./ន.) គុណនាម/នាម',
          meaning: 'ភាពល្អ ភាពស្រស់ស្អាត សេចក្តីរុងរឿង។',
          hint: 'ព្យញ្ជនៈ «ស» ➜ ស្រៈ «ោ» ➜ ភ ➜ ័ ➜ ណ',
          order: 'លំដាប់ទី ៣'
        },
        {
          word: 'ឱវាទ',
          type: '(ន.) នាម',
          meaning: 'ពាក្យប្រៀនប្រដៅ ដំបូន្មាន សេចក្តីទូន្មានរបស់ចាស់ទុំ ឬមាតាបិតា។',
          hint: 'ស្រៈពេញតួ «ឱ» (ក្រុម អ) ➜ វ ➜ ា ➜ ទ',
          order: 'លំដាប់ទី ៤'
        }
      ],
      teacherNotes: 'ចុចចាប់ផ្តើមនាឡិកា ៦០ វិនាទី ឱ្យសិស្សប្រកួតគ្នាជាក្រុមលើកវចនានុក្រមស្វែងរកពាក្យ។ ពេលសិស្សឆ្លើយត្រូវ ចុចប៊ូតុងបង្ហាញន័យពាក្យដើម្បីអបអរសាទរ! 🎉',
      themeBg: 'from-slate-950 via-amber-950 to-rose-950',
      totalPoints: 4
    },

    // SLIDE 6: STEP 3 (PART 3) - STUDY POEM "អ្នកមានគុណ" (KAK-GATI METER)
    {
      id: 'slide_poem_study',
      type: 'poem_study',
      stepBadge: 'ជំហានទី ៣ : ខ្លឹមសារមេរៀនថ្មី (ដំណាក់កាលទី ២)',
      title: 'សិក្សាអត្ថបទកំណាព្យ «អ្នកមានគុណ» (បទកាកគតិ ៧ ព្យាង្គ)',
      subTitle: 'ក្បួនអានបទកាកគតិ ៖ ១ ឃ្លាមាន ៧ ព្យាង្គ (ចង្វាក់អាន ៤-៣ ឬ ៣-៤) ផ្អែមល្ហែម និងជ្រាលជ្រៅ',
      promptQuestion: '❓ សំណួរបំផុស ៖ «តាមរយៈកំណាព្យនេះ តើឪពុកម្តាយបានលះបង់អ្វីខ្លះដើម្បីកូនៗ? ហើយកូនៗត្រូវធ្វើដូចម្តេចចំពោះលោកវិញ?»',
      promptAnswer: '💡 លោកបានលះបង់កម្លាំងកាយ ចិត្ត អាហារ សម្លៀកបំពាក់ និងចំណេះដឹង។ ដូច្នេះកូនៗត្រូវចេះដឹងគុណ គោរពប្រតិបត្តិ និងតបស្នងគុណលោកពេលនៅរស់!',
      photoUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=1000&auto=format&fit=crop&q=80',
      photoCaption: '👨‍👧 ឪពុកថ្នាក់ថ្នមទូន្មានប្រៀនប្រដៅកូនដោយក្តីសប្បុរស',
      stanzas: [
        {
          no: 'វគ្គទី ១ (ព្រះគុណមាតាបិតា)',
          lines: [
            'ឪពុក និងម្ដាយ | មានគុណច្រើនក្រៃ',
            'ចិញ្ចឹមបីបាច់ | តាំងពីតូចតី',
            'ទោះលំបាកក្តី | មិនដែលរួញរា។'
          ],
          coreMeaning: '🌟 គំនិតសំខាន់ ៖ ព្រះគុណដ៏ធំធេងរបស់មាតាបិតាដែលបានចិញ្ចឹមបីបាច់កូនតាំងពីបាតជើងក្រហម។'
        },
        {
          no: 'វគ្គទី ២ (ការថែទាំនិងផ្គត់ផ្គង់)',
          lines: [
            'ផ្តល់បាយ ចំណី | ទឹកដោះទើបថ្មី',
            'ថែរក្សាជម្ងឺ | មិនឱ្យឈឺផ្សា',
            'យប់ថ្ងៃរក្សា | ថ្នាក់ថ្នមទារក។'
          ],
          coreMeaning: '🌟 គំនិតសំខាន់ ៖ គុណូបការៈក្នុងការផ្តល់ចំណីអាហារ សម្លៀកបំពាក់ និងការមើលថែរក្សាពេលកូនឈឺថ្កាត់។'
        },
        {
          no: 'វគ្គទី ៣ (ការអប់រំនិងចំណេះវិជ្ជា)',
          lines: [
            'ទូន្មាន ប្រៀនប្រដៅ | ឱ្យកូនដឹងត្រូវ',
            'បញ្ជូនទៅរៀន | យកចំណេះមក',
            'ឱ្យកូនមានយស | សក្តិក្នុងសង្គម។'
          ],
          coreMeaning: '🌟 គំនិតសំខាន់ ៖ ការអប់រំទូន្មានប្រៀនប្រដៅ និងការបញ្ជូនកូនឱ្យទៅសាលារៀនដើម្បីទទួលបានចំណេះដឹង។'
        },
        {
          no: 'វគ្គទី ៤ (ការតបស្នងសងគុណ)',
          lines: [
            'កូនត្រូវ ដឹងគុណ | តបស្នងគុណលោក',
            'ធ្វើបុណ្យទាន់ខែ | មេចិន្តារស់នៅ',
            'កុំឱ្យយឺតយូរ | សោកស្តាយក្រោយក្រោយ។'
          ],
          coreMeaning: '🌟 គំនិតសំខាន់ ៖ ការដាស់តឿនឱ្យកូនៗចេះតបស្នងសងគុណ ផ្គត់ផ្គង់អាហារ និងគោរពប្រតិបត្តិចំពោះលោកពេលនៅរស់។'
        }
      ],
      teacherNotes: 'គ្រូសូត្រជាគំរូដោយបញ្ចេញសូរសៀង និងចង្វាក់ ៤-៣ ពីរោះ។ ឱ្យសិស្សសូត្រព្រមគ្នា និងសង្កេតគំនិតសំខាន់វគ្គនីមួយៗ។',
      themeBg: 'from-slate-950 via-emerald-950 to-teal-950',
      totalPoints: 4
    },

    // SLIDE 7: STEP 3 (PART 4) - 4-STEP NOTE-TAKING METHOD & KEY CONCEPT
    {
      id: 'slide_notetaking_method',
      type: 'notetaking_method',
      stepBadge: 'ជំហានទី ៣ : ខ្លឹមសារមេរៀនថ្មី (ដំណាក់កាលទី ៣)',
      title: 'វិធីសាស្ត្រកត់ត្រាចំណុចសំខាន់ៗ ៤ ជំហាន (Note-Taking)',
      subTitle: 'បច្ចេកទេសស្រង់ខ្លឹមសារស្នូលពីអត្ថបទ ឬកំណាព្យ យកមកសរសេរឱ្យខ្លី ខ្លឹម និងចងចាំបានយូរ',
      promptQuestion: '❓ សំណួរបំផុស ៖ «ហេតុអ្វីបានជាយើងមិនត្រូវចម្លងអត្ថបទទាំងមូលមកកត់ត្រា? តើការកត់ត្រាខ្លឹមសារសំខាន់មានអត្ថប្រយោជន៍ដូចម្តេច?»',
      promptAnswer: '💡 ការមិនចម្លងវែងឆ្ងាយ ជួយសន្សំពេលវេលា ធ្វើឱ្យខួរក្បាលចាប់យកតែខ្លឹមសារស្នូល ងាយស្រួលរំលឹកឡើងវិញ និងចងចាំបានរហ័ស!',
      photoUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1000&auto=format&fit=crop&q=80',
      photoCaption: '✍️ ការកត់ត្រាចំណុចសំខាន់ៗជួយពង្រឹងការចងចាំ និងការត្រិះរិះ',
      steps: [
        {
          num: '១',
          title: 'អានទាំងមូល',
          desc: 'អានអត្ថបទ ឬកំណាព្យទាំងមូលឱ្យយល់អត្ថន័យរួមជាមុន។',
          icon: '📖',
          color: 'from-blue-500 to-indigo-500'
        },
        {
          num: '២',
          title: 'ស្វែងរកពាក្យគន្លឹះ',
          desc: 'កំណត់ពាក្យគន្លឹះ ឬកន្សោមពាក្យស្នូលក្នុងវគ្គនីមួយៗ។',
          icon: '🔑',
          color: 'from-amber-500 to-orange-500'
        },
        {
          num: '៣',
          title: 'ស្រង់គំនិតចម្បង',
          desc: 'ស្រង់យកតែខ្លឹមសារសំខាន់ មិនចម្លងរៀបរាប់វែងឆ្ងាយឡើយ។',
          icon: '🎯',
          color: 'from-emerald-500 to-teal-500'
        },
        {
          num: '៤',
          title: 'សរសេរពាក្យផ្ទាល់ខ្លួន',
          desc: 'សរសេរឡើងវិញជាឃ្លាខ្លី ខ្លឹម ងាយយល់ និងចងចាំបានយូរ។',
          icon: '✍️',
          color: 'from-purple-500 to-pink-500'
        }
      ],
      keyConcept: '«ការកត់ត្រាចំណុចសំខាន់ៗ គឺជាការស្រង់យកពាក្យ កន្សោមពាក្យ ឬឃ្លាដែលបង្ហាញពីគំនិតចម្បងនៃអត្ថបទ ឬកំណាព្យ មកសរសេរកត់ត្រាទុកយ៉ាងមានរបៀប ដើម្បីងាយស្រួលចងចាំ និងរំលឹកឡើងវិញ»។',
      teacherNotes: 'សង្កត់ធ្ងន់លើបញ្ញត្តិគន្លឹះ។ ឱ្យសិស្សអានបញ្ញត្តិ ២-៣ ដង រួចកត់ត្រាចូលក្នុងសៀវភៅ។',
      themeBg: 'from-slate-950 via-purple-950 to-slate-900',
      totalPoints: 4
    },

    // SLIDE 8: STEP 4 - GROUP WORK "បណ្តាំម្តាយ" (PRACTICE & HOTS)
    {
      id: 'slide_group_practice',
      type: 'group_practice',
      stepBadge: 'ជំហានទី ៤ : ពង្រឹងចំណេះដឹង & អនុវត្តការងារក្រុម (១៥-២០ នាទី)',
      title: 'បេសកកម្មក្រុម ៖ ស្រង់គំនិតសំខាន់ពីអត្ថបទ «បណ្តាំម្តាយ»',
      subTitle: 'អនុវត្តជាក់ស្តែងតាមសៀវភៅសិស្ស ទំព័រទី ៩ (ពិភាក្សាជាក្រុម ៤-៥ នាក់ រយៈពេល ៣ នាទី)',
      promptQuestion: '❓ សំណួរពិភាក្សាក្រុម ៖ «ចូរពិភាក្សាគ្នា រួចស្រង់គំនិតសំខាន់នៃអត្ថបទ "បណ្តាំម្តាយ" ឱ្យបាន ២ ចំណុចធំៗ?»',
      photoUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop&q=80',
      photoCaption: '🤝 សិស្សពិភាក្សា និងសហការគ្នាជាក្រុមយ៉ាងសកម្ម',
      answers: [
        {
          part: 'គំនិតសំខាន់ វគ្គទី ១',
          content: 'ម្តាយផ្តាំកូនឱ្យខិតខំប្រឹងប្រែងរៀនសូត្រពីក្មេង កុំឱ្យខាតបង់ពេលវេលាមានតម្លៃ។',
          icon: '📚'
        },
        {
          part: 'គំនិតសំខាន់ វគ្គទី ២',
          content: 'ការនិយាយស្តីពាក្យពិត មិនកុហកភូតភរ និងប្រព្រឹត្តអំពើល្អ សុចរិតក្នុងសង្គម។',
          icon: '💎'
        }
      ],
      hotsQuestion: '🔥 សំណួរត្រិះរិះកម្រិតខ្ពស់ (HOTS) ៖ «ប្រសិនបើគ្មានការកត់ត្រាចំណុចសំខាន់ៗទេ តើយើងអាចជួបផលវិបាកអ្វីខ្លះក្នុងការរៀនសូត្រ និងការត្រៀមប្រឡង?»',
      hotsAnswer: '💡 ផលវិបាក ៖ ធ្វើឱ្យយើងពិបាកចងចាំ ចំណាយពេលអានឡើងវិញច្រើន ភ្លេចគំនិតស្នូល មិនសូវយល់មេរៀនច្បាស់ និងពិបាកត្រៀមប្រឡង!',
      teacherNotes: 'កំណត់ម៉ោងក្រុម ៣-៥ នាទី។ ដើរសម្របសម្រួល រួចហៅតំណាងក្រុមឡើងរាយការណ៍ និងចុចបង្ហាញចម្លើយគំរូ។',
      themeBg: 'from-slate-950 via-teal-950 to-cyan-950',
      totalPoints: 3
    },

    // SLIDE 9: STEP 5 - MORAL VALUES & HOMEWORK
    {
      id: 'slide_step5_homework',
      type: 'step5_homework',
      stepBadge: 'ជំហានទី ៥ : បណ្តាំផ្ញើ ការអប់រំគុណធម៌ & កិច្ចការផ្ទះ (១០ នាទី)',
      title: 'បណ្តុះស្មារតីគុណធម៌ កតញ្ញូតាធម៌ & កិច្ចការផ្ទះ',
      subTitle: 'ការបណ្តុះគុណធម៌ដឹងគុណមាតាបិតា និងពង្រឹងការសិក្សាស្រាវជ្រាវនៅផ្ទះ',
      promptQuestion: '❓ សំណួរបំផុសដាស់តឿនចិត្ត ៖ «តើកូនៗអាចធ្វើសកម្មភាពអ្វីខ្លះនៅផ្ទះ ដើម្បីបង្ហាញពីការដឹងគុណចំពោះឪពុកម្តាយ?»',
      promptAnswer: '💡 កូនៗត្រូវចេះសំពះជំរាបសួរ ជួយការងារផ្ទះ យកចិត្តទុកដាក់រៀនសូត្រ និងមិនធ្វើឱ្យឪពុកម្តាយពិបាកចិត្ត!',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
      photoCaption: '👵👴 ស្នាមញញឹមដ៏កក់ក្តៅរបស់ចាស់ព្រឹទ្ធាចារ្យ និងអ្នកមានគុណ',
      characterValue: lesson.characterValues || 'បណ្តុះគុណធម៌កតញ្ញូ-កតវេទី (ដឹងគុណនិងតបគុណមាតាបិតា) ភាពឧស្សាហ៍ព្យាយាម និងការស្រឡាញ់អំណាន។',
      moralPoints: [
        '💖 ដឹងគុណ គោរព ស្តាប់ដំបូន្មាន និងជូនពរឪពុកម្តាយជារៀងរាល់ថ្ងៃ',
        '🧹 ជួយធ្វើការងារផ្ទះស្រាលៗ (បោសផ្ទះ លាងចាន ដាំបាយ រៀបចំសម្ភារ)',
        '📖 ខិតខំប្រឹងប្រែងរៀនសូត្រឱ្យក្លាយជាកូនល្អ សិស្សល្អ មិត្តល្អ និងពលរដ្ឋល្អ'
      ],
      homework: lesson.homework,
      nextLessonHint: '👉 ត្រៀមមេរៀនបន្ទាប់ ៖ បំណិនស្តាប់ ការគោរពលោកគ្រូ អ្នកគ្រូ (ទំព័រទី ៨)',
      teacherNotes: 'ទូន្មានសិស្សដោយក្តីមេត្តា ឱ្យសិស្សកត់ត្រាកិច្ចការផ្ទះឱ្យច្បាស់លាស់ និងជូនពរសិស្សមុនបញ្ចប់ថ្នាក់។',
      themeBg: 'from-slate-950 via-amber-950 to-emerald-950',
      totalPoints: 3
    },

    // SLIDE 10: EXIT TICKET & ASSESSMENT RUBRIC
    {
      id: 'slide_exit_ticket',
      type: 'exit_ticket',
      stepBadge: 'វាយតម្លៃរហ័សចុងម៉ោង (Exit Ticket & Rubric)',
      title: 'សន្លឹកឆ្លើយរហ័សលើក្តារឈ្នួន & បន្ទាត់កម្រិតសមត្ថភាព',
      subTitle: 'សិស្សទាំងអស់សរសេរចម្លើយលើក្តារឈ្នួនបង្ហាញគ្រូ (រាប់ ១, ២, ៣ លើកព្រមគ្នា)',
      promptQuestion: '❓ សំណួរ Exit Ticket ៖ ចូរសរសេរចម្លើយខ្លីៗលើក្តារឈ្នួន!',
      questions: [
        {
          q: '១. ចូរបញ្ជាក់ពីលំដាប់ ៣ ដំណាក់កាលនៃការរកពាក្យក្នុងវចនានុក្រម?',
          a: 'ចម្លើយ៖ ១. ព្យញ្ជនៈ (ក-អ) ➜ ២. ស្រៈនិស្ស័យ (ា-ៅ) ➜ ៣. ព្យញ្ជនៈប្រកប។'
        },
        {
          q: '២. តើការកត់ត្រាចំណុចសំខាន់ៗនៃអត្ថបទមានប្រយោជន៍ដូចម្តេចខ្លះ?',
          a: 'ចម្លើយ៖ ជួយឱ្យងាយស្រួលយល់ ចងចាំបានយូរ សន្សំពេល និងរំលឹកឡើងវិញបានរហ័ស។'
        }
      ],
      rubric: lesson.rubric,
      teacherNotes: 'រាប់ ១, ២, ៣ ឱ្យសិស្សលើកក្តារឈ្នួនព្រមគ្នា។ ផ្តល់ពិន្ទុលើកទឹកចិត្ត និងវាយតម្លៃតាម Rubric ។',
      themeBg: 'from-slate-950 via-blue-950 to-slate-950',
      totalPoints: 2
    }
  ];
}

    // Determine subject photo & colors
    let coverPhoto = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&auto=format&fit=crop&q=80';
    let themeBg = 'from-slate-950 via-indigo-950 to-purple-950';

    if (lesson.subject === 'គណិតវិទ្យា') {
      coverPhoto = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1000&auto=format&fit=crop&q=80';
      themeBg = 'from-slate-950 via-blue-950 to-cyan-950';
    } else if (lesson.subject === 'វិទ្យាសាស្ត្រ') {
      coverPhoto = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1000&auto=format&fit=crop&q=80';
      themeBg = 'from-slate-950 via-emerald-950 to-teal-950';
    } else if (lesson.subject === 'សិក្សាសង្គម') {
      coverPhoto = 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1000&auto=format&fit=crop&q=80';
      themeBg = 'from-slate-950 via-amber-950 to-orange-950';
    } else if (lesson.subject === 'អប់រំសុខភាព') {
      coverPhoto = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&auto=format&fit=crop&q=80';
      themeBg = 'from-slate-950 via-rose-950 to-pink-950';
    } else if (lesson.subject === 'ភាសាអង់គ្លេស និងបំណិនជីវិត') {
      coverPhoto = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1000&auto=format&fit=crop&q=80';
      themeBg = 'from-slate-950 via-purple-950 to-slate-950';
    }

    const step1 = lesson.steps?.[0];
    const step2 = lesson.steps?.[1];
    const step3 = lesson.steps?.[2];
    const step4 = lesson.steps?.[3];
    const step5 = lesson.steps?.[4];

    return [
      // SLIDE 0: TITLE & COVER
      {
        id: 'slide_cover',
        type: 'cover',
        stepBadge: `ក្រសួងអប់រំ យុវជន និងកីឡា • ${lesson.grade || 'ថ្នាក់ទី ៦'}`,
        title: `${lesson.subject} ${lesson.lessonNo || ''}៖ ${lesson.title}`,
        subTitle: lesson.subLessonTitle ? `ខ្លឹមសាររង៖ ${lesson.subLessonTitle}` : `មុខវិជ្ជា៖ ${lesson.subject}`,
        grade: lesson.grade,
        subject: lesson.subject,
        duration: lesson.duration,
        teacher: lesson.teacherName,
        school: lesson.schoolName,
        sourceRef: lesson.sourceRef,
        promptQuestion: `«តើកូនៗដឹងទេថា ការរៀន ${lesson.title} ផ្តល់សារៈប្រយោជន៍អ្វីខ្លះ?»`,
        promptAnswer: `💡 មេរៀននេះជួយពង្រឹងការយល់ដឹង បំណិនអនុវត្តជាក់ស្តែង និងការដោះស្រាយបញ្ហាក្នុងជីវិតប្រចាំថ្ងៃ!`,
        photoUrl: coverPhoto,
        photoCaption: `📖 ខ្លឹមសាររៀបចំតាមកម្មវិធីសិក្សា និងសៀវភៅគោលក្រសួងអប់រំ យុវជន និងកីឡា`,
        teacherNotes: `ស្វាគមន៍សិស្ស ណែនាំចំណងជើងមេរៀន ${lesson.title} និងកំណត់ការចូលរួមសកម្ម។`,
        themeBg,
        totalPoints: 3
      },
      // SLIDE 1: LEARNING OBJECTIVES
      {
        id: 'slide_objectives',
        type: 'objectives',
        stepBadge: 'វត្ថុបំណងនៃមេរៀន (Learning Objectives)',
        title: 'គោលបំណងចម្បង ៣ យ៉ាងដែលកូនត្រូវទទួលបាន',
        subTitle: 'បន្ទាប់ពីរៀនមេរៀននេះចប់ កូនៗទាំងអស់គ្នានឹងអាច៖',
        objectives: lesson.objectives,
        promptQuestion: '«ហេតុអ្វីបានជាយើងត្រូវដឹងគោលដៅ វិជ្ជាសម្បទា បំណិនសម្បទា និងចរិយាសម្បទាមុនរៀន?»',
        promptAnswer: '💡 ការដឹងគោលដៅច្បាស់លាស់ជួយឱ្យយើងផ្ចង់ស្មារតី យល់ដឹងជ្រៅជ្រះ និងទទួលបានលទ្ធផលខ្ពស់!',
        photoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&auto=format&fit=crop&q=80',
        photoCaption: '📚 សិស្សានុសិស្សផ្ចង់ស្មារតីដើម្បីសម្រេចវត្ថុបំណងមេរៀន',
        teacherNotes: 'សួរជំរុញសិស្សឱ្យអានវត្ថុបំណងទាំង ៣ ដើម្បីដឹងពីទិសដៅរៀនសូត្រក្នុងម៉ោងនេះ។',
        themeBg: 'from-slate-950 via-blue-950 to-indigo-950',
        totalPoints: 3
      },
      // SLIDE 2: STEP 1 - WARM-UP & INQUIRY
      {
        id: 'slide_step1',
        type: 'step1_warmup',
        stepBadge: `ជំហានទី ១ : ${step1?.stepTitle || 'រដ្ឋបាលថ្នាក់ & កម្តៅសាច់ដុំ'} (៥-១០ នាទី)`,
        title: 'ពិនិត្យសណ្តាប់ធ្នាប់ & សំណួរបំផុសស្មារតី',
        subTitle: 'បង្កើតបរិយាកាសរីករាយ និងភ្ញាក់រលឹកមុនចូលរៀន',
        promptQuestion: `❓ សំណួរបំផុស ៖ «${step1?.teacherActivity ? step1.teacherActivity.split('?')[0] + '?' : `តើកូនៗត្រៀមខ្លួនរួចរាល់ហើយឬនៅសម្រាប់ម៉ោងសិក្សា ${lesson.subject}?`}»`,
        promptAnswer: `💡 ចម្លើយបំផុស ៖ ${step1?.studentActivity || 'សិស្សឆ្លើយដោយភាពក្លាហាន និងចូលរួមសកម្មភាពដោយស្វាហាប់!'}`,
        songTitle: `សកម្មភាពភ្ញាក់រលឹកស្មារតី «ស្វាគមន៍មេរៀន ${lesson.subject}»`,
        songLyrics: [
          `🎵 ត្រៀមកាតាប សៀវភៅ និងប៊ិច... ផ្ចង់គំនិតរៀន ${lesson.subject}`,
          `សាមគ្គីជួយគ្នា ឆ្លើយសំណួរក្លាហាន មិនខ្លាចខុស`,
          `លោកគ្រូអ្នកគ្រូ ណែនាំច្បាស់លាស់ នាំឱ្យឆ្លាតវៃ! 👏`
        ],
        points: [
          `✅ ${step1?.content || 'ពិនិត្យវត្តមាន សណ្តាប់ធ្នាប់ និងអនាម័យ ៣ ស្អាត'}`,
          `✅ ឆ្លើយសំណួរបំផុសស្មារតី និងភ្ញាក់រលឹកមុនចូលរៀន`,
          `✅ សម្ភារឧបទេស ៖ ${lesson.materials?.teacher || 'សៀវភៅគោល, រូបភាព និងស្លាយ'}`
        ],
        photoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&auto=format&fit=crop&q=80',
        photoCaption: '🧘‍♂️ ត្រៀមខ្លួនរួចរាល់ទាំងកាយ ទាំងចិត្ត សម្រាប់ម៉ោងសិក្សា',
        teacherNotes: 'ពិនិត្យវត្តមាន អនាម័យ និងបង្កើតបរិយាកាសរីករាយក្នុងថ្នាក់។',
        themeBg: 'from-slate-950 via-indigo-950 to-blue-950',
        totalPoints: 3
      },
      // SLIDE 3: STEP 2 - REVIEW & BRIDGE QUESTION
      {
        id: 'slide_step2',
        type: 'step2_review',
        stepBadge: `ជំហានទី ២ : ${step2?.stepTitle || 'កែកិច្ចការចាស់ & រំលឹកមេរៀន'} (១០-១៥ នាទី)`,
        title: 'ពិនិត្យកិច្ចការចាស់ & សំណួរភ្ជាប់ស្ពានចម្លង',
        subTitle: 'ផ្ទៀងផ្ទាត់ចំណេះដឹងពីមេរៀនមុន និងបង្កើតស្ពានចម្លង (Bridge Question)',
        promptQuestion: `❓ សំណួរភ្ជាប់មេរៀន (Bridge Question) ៖ «${step2?.teacherActivity || `តើអ្វីជាគន្លឹះសំខាន់ដែលយើងបានរៀនពីមុន ហើយត្រូវយកមកប្រើក្នុង ${lesson.title}?`}»`,
        bridgeAnswer: `💡 ចម្លើយ ៖ ${step2?.studentActivity || 'ការរំលឹកមេរៀនចាស់ជួយឱ្យយើងយល់មេរៀនថ្មីបានកាន់តែលឿន និងច្បាស់លាស់!'}`,
        homeworkItems: [
          { word: 'ចំណុចរំលឹក ១', sentence: step2?.content || 'រំលឹកទ្រឹស្តី និងរូបមន្តគន្លឹះ' },
          { word: 'ចំណុចរំលឹក ២', sentence: 'អនុវត្តលំហាត់គំរូ និងផ្ទៀងផ្ទាត់ចម្លើយ' },
          { word: 'ចំណុចរំលឹក ៣', sentence: 'ត្រៀមសៀវភៅ និងក្តារឈ្នួនសម្រាប់មេរៀនថ្មី' }
        ],
        photoUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80',
        photoCaption: '📖 ផ្ទៀងផ្ទាត់កិច្ចការចាស់ និងស្វែងយល់ចំណុចខ្វះខាត',
        teacherNotes: 'ហៅសិស្ស ២-៣ នាក់ឡើងកែកិច្ចការចាស់ និងសួរសំណួរភ្ជាប់ស្ពានចម្លង។',
        themeBg: 'from-slate-950 via-purple-950 to-indigo-950',
        totalPoints: 3
      },
      // SLIDE 4: STEP 3 - CORE CONCEPTS
      {
        id: 'slide_step3_concept',
        type: 'notetaking_method',
        stepBadge: `ជំហានទី ៣ : ${step3?.stepTitle || 'ខ្លឹមសារមេរៀនថ្មី'} (ដំណាក់កាលទី ១)`,
        title: `ខ្លឹមសារស្នូល និងទ្រឹស្តីសំខាន់នៃ ${lesson.title}`,
        subTitle: `${lesson.subLessonTitle || lesson.pedagogy || 'ការរៀបចំសកម្មភាពបង្រៀន និងរៀនតាមបែបសកម្ម'}`,
        promptQuestion: `❓ សំណួរគន្លឹះ ៖ «តើខ្លឹមសារសំខាន់បំផុតក្នុងមេរៀននេះជាអ្វី?»`,
        promptAnswer: `💡 ចម្លើយ ៖ ${lesson.objectives?.knowledge || 'ស្វែងយល់ពីខ្លឹមសារ និងបំណិនស្នូលនៃមេរៀន!'}`,
        steps: [
          { num: '១', title: 'សកម្មភាពគ្រូ', desc: step3?.teacherActivity?.slice(0, 80) || 'ពន្យល់ ណែនាំ និងបង្ហាញគំរូ', icon: '👨‍🏫', color: 'from-blue-500 to-indigo-500' },
          { num: '២', title: 'ខ្លឹមសារមេរៀន', desc: step3?.content?.slice(0, 80) || 'ទ្រឹស្តី រូបមន្ត និងបញ្ញត្តិគន្លឹះ', icon: '📖', color: 'from-amber-500 to-orange-500' },
          { num: '៣', title: 'សកម្មភាពសិស្ស', desc: step3?.studentActivity?.slice(0, 80) || 'សង្កេត ពិភាក្សា និងអនុវត្តលើក្តារឈ្នួន', icon: '✍️', color: 'from-emerald-500 to-teal-500' },
          { num: '៤', title: 'ឧបករណ៍ឌីជីថល', desc: lesson.digitalTools?.join(', ') || 'ស្លាយបង្រៀន, QR Remote, Projector', icon: '💻', color: 'from-purple-500 to-pink-500' }
        ],
        keyConcept: `«${step3?.content || lesson.objectives?.knowledge}»`,
        teacherNotes: 'ពន្យល់ខ្លឹមសារមេរៀនយ៉ាងក្បោះក្បាយ លើកទឹកចិត្តឱ្យសិស្សសួរ និងកត់ត្រា។',
        themeBg: 'from-slate-950 via-indigo-950 to-blue-950',
        totalPoints: 4
      },
      // SLIDE 5: STEP 3 - INTERACTIVE LEARNING & SPEED CHALLENGE
      {
        id: 'slide_step3_game',
        type: 'dict_race_game',
        stepBadge: `ល្បែងសិក្សាឌីជីថល & សកម្មភាពសកម្ម (${lesson.learningGames?.[0] || 'Interactive Game'})`,
        title: `🏆 ល្បែងសិក្សា និងលំហាត់អនុវត្តរហ័ស (Speed Learning Challenge)`,
        subTitle: `កំណត់ពេល ៦០ វិនាទី! សិស្សសរសេរចម្លើយលើក្តារឈ្នួន ឬពិភាក្សាជាគូ`,
        words: [
          { word: 'ចំណុចទី ១', type: 'ខ្លឹមសារ', meaning: step3?.teacherActivity?.slice(0, 60) || 'ការយល់ដឹងលើមេរៀន', hint: 'សង្កេត និងគិត', order: 'លំដាប់ទី ១' },
          { word: 'ចំណុចទី ២', type: 'បំណិន', meaning: step3?.studentActivity?.slice(0, 60) || 'ការអនុវត្តជាក់ស្តែង', hint: 'សរសេរលើក្តារឈ្នួន', order: 'លំដាប់ទី ២' },
          { word: 'ចំណុចទី ៣', type: 'ការអនុវត្ត', meaning: lesson.homework?.slice(0, 60) || 'ការដោះស្រាយបញ្ហា', hint: 'ពិភាក្សាជាមួយដៃគូ', order: 'លំដាប់ទី ៣' },
          { word: 'ចំណុចទី ៤', type: 'គុណធម៌', meaning: lesson.characterValues?.slice(0, 60) || 'ការសហការ និងភាពស្មោះត្រង់', hint: 'លើកទឹកចិត្តគ្នា', order: 'លំដាប់ទី ៤' }
        ],
        teacherNotes: 'ចាប់ផ្តើមនាឡិកាកំណត់ពេល ៦០ វិនាទី ឱ្យសិស្សប្រកួតប្រជែងលើក្តារឈ្នួន។',
        themeBg: 'from-slate-950 via-slate-900 to-indigo-950',
        totalPoints: 4
      },
      // SLIDE 6: STEP 4 - GROUP PRACTICE & HOTS
      {
        id: 'slide_step4_group',
        type: 'group_practice',
        stepBadge: `ជំហានទី ៤ : ${step4?.stepTitle || 'ពង្រឹងចំណេះដឹង & អនុវត្តការងារក្រុម'} (១៥-២០ នាទី)`,
        title: `បេសកកម្មក្រុម ៖ អនុវត្ត និងដោះស្រាយបញ្ហាជាក់ស្តែង`,
        subTitle: `ពិភាក្សាជាក្រុម ៤-៥ នាក់ រយៈពេល ៣ នាទី រួចឡើងរាយការណ៍`,
        promptQuestion: `❓ សំណួរពិភាក្សាក្រុម ៖ «${step4?.teacherActivity || 'ចូរពិភាក្សាគ្នាដោះស្រាយលំហាត់ និងសង្ខេបចំណុចសំខាន់នៃមេរៀន?'}»`,
        answers: [
          { part: 'ដំណោះស្រាយ វគ្គទី ១', content: step4?.content?.slice(0, 80) || 'សង្ខេបគំនិតចម្បង និងទ្រឹស្តីគន្លឹះ', icon: '📚' },
          { part: 'ដំណោះស្រាយ វគ្គទី ២', content: step4?.studentActivity?.slice(0, 80) || 'សហការគ្នាបំពេញសន្លឹកកិច្ចការ និងឡើងធ្វើបទបង្ហាញ', icon: '💎' }
        ],
        hotsQuestion: `🔥 សំណួរត្រិះរិះកម្រិតខ្ពស់ (HOTS) ៖ «តើកូនអាចយកចំណេះដឹង និងបំណិនពី ${lesson.title} ទៅប្រើប្រាស់ក្នុងជីវិតជាក់ស្តែងដោយរបៀបណា?»`,
        hotsAnswer: `💡 ចម្លើយត្រិះរិះ ៖ ${lesson.differentiation?.fastLearners || 'ជួយឱ្យយើងចេះគិតស៊ីជម្រៅ ដោះស្រាយបញ្ហាស្មុគស្មាញ និងជួយបង្រៀនមិត្តភក្តិដែលរៀនយឺត!'}`,
        photoUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
        photoCaption: '🤝 ការសហការជាក្រុមប្រកបដោយភាពស្និទ្ធស្នាល និងប្រសិទ្ធភាព',
        teacherNotes: 'ដើរសង្កេតគ្រប់ក្រុម ជួយណែនាំក្រុមរៀនយឺត និងលើកទឹកចិត្តឱ្យឡើងរាយការណ៍។',
        themeBg: 'from-slate-950 via-teal-950 to-slate-950',
        totalPoints: 3
      },
      // SLIDE 7: STEP 5 - MORAL VALUES & HOMEWORK
      {
        id: 'slide_step5_homework',
        type: 'step5_homework',
        stepBadge: `ជំហានទី ៥ : ${step5?.stepTitle || 'បណ្តាំផ្ញើ ការអប់រំគុណធម៌ & កិច្ចការផ្ទះ'} (១០ នាទី)`,
        title: `បណ្តុះគុណធម៌ ចរិយាសម្បទា & កិច្ចការផ្ទះ`,
        subTitle: 'ការភ្ជាប់ខ្លឹមសារមេរៀនទៅនឹងការរស់នៅប្រចាំថ្ងៃ',
        characterValue: lesson.characterValues || 'បណ្តុះស្មារតីឧស្សាហ៍ព្យាយាម សាមគ្គីភាព និងការស្រឡាញ់ការសិក្សា។',
        moralPoints: [
          '💖 គោរពវិន័យ ស្តាប់ដំបូន្មានលោកគ្រូអ្នកគ្រូ និងមាតាបិតា',
          '🧹 ជួយធ្វើការងារផ្ទះ និងរៀបចំកាតាបសម្ភារសិក្សាឱ្យមានរបៀប',
          '📖 អានសៀវភៅ និងធ្វើកិច្ចការផ្ទះឱ្យបានទៀងទាត់'
        ],
        homework: lesson.homework || 'ធ្វើលំហាត់ក្នុងសៀវភៅពុម្ព និងអានមេរៀនបន្ទាប់',
        nextLessonHint: `👉 ត្រៀមមេរៀនបន្ទាប់ ៖ ${lesson.sourceRef || 'មេរៀនបន្តក្នុងសៀវភៅពុម្ព'}`,
        photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
        photoCaption: '❤️ ការអប់រំគុណធម៌ និងសីលធម៌ល្អប្រពៃក្នុងសង្គម',
        teacherNotes: 'អប់រំគុណធម៌ បង្ហាញកិច្ចការផ្ទះ និងផ្តាំផ្ញើឱ្យសិស្សខិតខំរៀនសូត្រ។',
        themeBg: 'from-slate-950 via-rose-950 to-purple-950',
        totalPoints: 2
      },
      // SLIDE 8: EXIT TICKET & RUBRIC
      {
        id: 'slide_exit_ticket',
        type: 'exit_ticket',
        stepBadge: 'វាយតម្លៃរហ័សចុងម៉ោង (Exit Ticket & Rubrics)',
        title: 'សន្លឹកឆ្លើយរហ័សលើក្តារឈ្នួន & បន្ទាត់កម្រិតសមត្ថភាព',
        subTitle: 'សិស្សទាំងអស់សរសេរចម្លើយលើក្តារឈ្នួនបង្ហាញគ្រូ (រាប់ ១, ២, ៣ លើកព្រមគ្នា)',
        promptQuestion: '❓ សំណួរ Exit Ticket ៖ ចូរសរសេរចម្លើយខ្លីៗលើក្តារឈ្នួន!',
        questions: [
          {
            q: `១. ចូរបញ្ជាក់ពីចំណុចសំខាន់បំផុតដែលកូនទទួលបានពី ${lesson.title}?`,
            a: `ចម្លើយ៖ ${lesson.objectives?.knowledge || 'យល់ដឹងពីទ្រឹស្តី និងបំណិនអនុវត្តជាក់ស្តែង'}`
          },
          {
            q: `២. ចូររៀបរាប់ពីបំណិន ឬវិធីសាស្ត្រដែលកូនបានអនុវត្តក្នុងម៉ោងនេះ?`,
            a: `ចម្លើយ៖ ${lesson.objectives?.skills || (lesson.objectives as any)?.skill || 'ចេះដោះស្រាយលំហាត់ និងធ្វើការងារជាក្រុម'}`
          }
        ],
        rubric: lesson.rubric,
        teacherNotes: 'រាប់ ១, ២, ៣ ឱ្យសិស្សលើកក្តារឈ្នួនព្រមគ្នា។ ផ្តល់ពិន្ទុលើកទឹកចិត្ត និងវាយតម្លៃតាម Rubric ។',
        themeBg: 'from-slate-950 via-blue-950 to-slate-950',
        totalPoints: 2
      }
    ];
  }, [lesson]);

  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex];

  // When changing slides, reset activeStepPoint to 1
  useEffect(() => {
    setActiveStepPoint(1);
  }, [currentSlideIndex]);

  // Navigation handlers
  const nextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      setSlideDirection(1);
      setCurrentSlideIndex((prev) => prev + 1);
      if (soundEnabled) sfx.playPop();
    }
  }, [currentSlideIndex, totalSlides, soundEnabled]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setSlideDirection(-1);
      setCurrentSlideIndex((prev) => prev - 1);
      if (soundEnabled) sfx.playPop();
    }
  }, [currentSlideIndex, soundEnabled]);

  const nextPoint = useCallback(() => {
    const maxPoints = currentSlide.totalPoints || 3;
    if (activeStepPoint < maxPoints) {
      setActiveStepPoint((prev) => prev + 1);
      if (soundEnabled) sfx.playCorrect();
    } else {
      nextSlide();
    }
  }, [activeStepPoint, currentSlide.totalPoints, nextSlide, soundEnabled]);

  const revealAllPoints = useCallback(() => {
    const maxPoints = currentSlide.totalPoints || 3;
    setActiveStepPoint(maxPoints);
    if (soundEnabled) sfx.playCheer();
  }, [currentSlide.totalPoints, soundEnabled]);

  const jumpToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setSlideDirection(index > currentSlideIndex ? 1 : -1);
      setCurrentSlideIndex(index);
      if (soundEnabled) sfx.playPop();
    }
  }, [currentSlideIndex, totalSlides, soundEnabled]);

  const toggleReveal = (key: string) => {
    setRevealedItems((prev) => {
      const nextState = !prev[key];
      if (nextState && soundEnabled) {
        sfx.playCorrect();
      }
      return { ...prev, [key]: nextState };
    });
  };

  // ================= PUSH HOST STATE TO CLOUD & LISTEN TO PHONE COMMANDS =================
  useEffect(() => {
    if (!isOpen) return;

    // Push state so phone remote has fresh info
    const hostState: SlideRemoteState = {
      sessionId,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      currentSlideIndex,
      totalSlides,
      activeStepPoint,
      totalPoints: currentSlide.totalPoints || 3,
      slideTitle: currentSlide.title,
      stepBadge: currentSlide.stepBadge,
      promptQuestion: currentSlide.promptQuestion,
      promptAnswer: (currentSlide as any).promptAnswer || (currentSlide as any).bridgeAnswer,
      teacherNotes: currentSlide.teacherNotes,
      fontSizeMode,
      showTeacherNotes,
      drawMode,
      timerSeconds,
      timerActive,
      soundEnabled,
      phoneConnected: isPhoneConnected,
      revealedKeys: revealedItems,
      slideType: currentSlide.type,
      slideContent: {
        objectives: (currentSlide as any).objectives,
        vocabList: (currentSlide as any).vocabList || (currentSlide as any).vocabulary,
        poemLines: (currentSlide as any).poemLines || (currentSlide as any).verses,
        readingText: (currentSlide as any).readingText || (currentSlide as any).text,
        quizData: (currentSlide as any).quizData || (currentSlide as any).questions,
        activitySteps: (currentSlide as any).activitySteps || (currentSlide as any).steps
      }
    };

    pushSlideHostState(hostState);

    // Periodic heartbeat every 2.5 seconds to keep active sessions alive on server
    const heartbeatInterval = setInterval(() => {
      pushSlideHostState(hostState);
    }, 2500);

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [
    isOpen,
    sessionId,
    lesson,
    currentSlideIndex,
    totalSlides,
    activeStepPoint,
    currentSlide,
    fontSizeMode,
    showTeacherNotes,
    drawMode,
    timerSeconds,
    timerActive,
    soundEnabled,
    isPhoneConnected,
    revealedItems
  ]);

  // Subscribe to phone commands
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const unsubscribe = subscribeToSlideSession(sessionId, (remoteState) => {
      if (remoteState.phoneConnected) {
        setIsPhoneConnected(true);
      }

      if (remoteState.lastCommand && remoteState.lastCommand.id !== lastProcessedCommandIdRef.current) {
        lastProcessedCommandIdRef.current = remoteState.lastCommand.id;
        const cmd = remoteState.lastCommand;

        switch (cmd.type) {
          case 'NEXT_SLIDE':
            nextSlide();
            break;
          case 'PREV_SLIDE':
            prevSlide();
            break;
          case 'NEXT_POINT':
            nextPoint();
            break;
          case 'REVEAL_ALL_POINTS':
            revealAllPoints();
            break;
          case 'JUMP_SLIDE':
            if (typeof cmd.payload?.index === 'number') {
              jumpToSlide(cmd.payload.index);
            }
            break;
          case 'TOGGLE_ANSWER':
            if (cmd.payload?.key) {
              toggleReveal(cmd.payload.key);
            }
            break;
          case 'START_TIMER':
            if (typeof cmd.payload?.seconds === 'number') {
              startTimer(cmd.payload.seconds);
            }
            break;
          case 'RESET_TIMER':
            resetTimer();
            break;
          case 'PLAY_SOUND':
            if (cmd.payload?.sound === 'bell') sfx.playBell();
            else if (cmd.payload?.sound === 'cheer') sfx.playCheer();
            else if (cmd.payload?.sound === 'correct') sfx.playCorrect();
            else sfx.playPop();
            break;
          case 'SET_FONT_SIZE':
            if (cmd.payload?.mode) setFontSizeMode(cmd.payload.mode);
            break;
          case 'TOGGLE_NOTES':
            setShowTeacherNotes((prev) => !prev);
            break;
          case 'TOGGLE_DRAW':
            setDrawMode((prev) => !prev);
            break;
          case 'CLEAR_DRAW':
            clearCanvas();
            break;
          case 'PHONE_JOINED':
            setIsPhoneConnected(true);
            if (soundEnabled) sfx.playCorrect();
            if (onShowToast) onShowToast('📱 ទូរស័ព្ទបានភ្ជាប់ជោគជ័យ!');
            break;
          default:
            break;
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen, sessionId, nextSlide, prevSlide, nextPoint, revealAllPoints, jumpToSlide, soundEnabled, onShowToast]);

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowTeacherNotes((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isQrModalOpen) {
          setIsQrModalOpen(false);
        } else if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextSlide, prevSlide, isFullscreen, isQrModalOpen, onClose]);

  // Fullscreen handlers
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreen(false);
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            if (soundEnabled) sfx.playBell();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds, soundEnabled]);

  const startTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setTimerActive(true);
    if (soundEnabled) sfx.playBell();
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
  };

  // Canvas drawing functions
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Resize canvas when slide changes or window resizes
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
    }
  }, [currentSlideIndex, isFullscreen]);

  if (!isOpen) return null;

  // Remote URL for QR
  const liveRemoteUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?remote=${sessionId}`
      : `https://app/?remote=${sessionId}`;

  const copyRemoteLink = () => {
    navigator.clipboard.writeText(liveRemoteUrl).then(() => {
      if (onShowToast) onShowToast('📋 បានចម្លងតំណភ្ជាប់តេឡេបញ្ជា!');
      if (soundEnabled) sfx.playCorrect();
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-khmer select-none overflow-hidden"
    >
      {/* ================= TOP PRESENTATION TOOLBAR ================= */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-30 shrink-0 shadow-lg">
        {/* Left: Lesson info & Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/20 shrink-0 flex items-center justify-center">
            <span className="text-slate-950 font-black text-xs sm:text-sm">ស្លាយ</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] sm:text-xs font-bold">
                {lesson.grade} • {lesson.subject}
              </span>
              <span className="text-xs font-bold text-slate-400 hidden md:inline">
                {lesson.duration}
              </span>
            </div>
            <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-amber-300 truncate max-w-xs sm:max-w-md lg:max-w-xl">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* Center: Slide Progress & Point Step Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/90 px-3 sm:px-4 py-1.5 rounded-full border border-slate-700">
            <span className="text-xs sm:text-sm font-black text-amber-400">
              ស្លាយ {currentSlideIndex + 1}
            </span>
            <span className="text-xs text-slate-500">/</span>
            <span className="text-xs font-bold text-slate-400">{totalSlides}</span>
            <span className="ml-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-black animate-pulse">
              ចំណុច {activeStepPoint}/{currentSlide.totalPoints || 3}
            </span>
          </div>

          {/* Point-by-point Animation Controls */}
          <div className="hidden md:flex items-center gap-1 bg-indigo-950/80 px-2 py-1 rounded-2xl border border-indigo-700/60">
            <button
              type="button"
              onClick={nextPoint}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition active:scale-95 flex items-center gap-1 shadow-xs"
              title="បង្ហាញចំណុចបន្ទាប់ (Animation Point)"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>ចំណុចបន្ទាប់</span>
            </button>
            <button
              type="button"
              onClick={revealAllPoints}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              title="បង្ហាញចំណុចទាំងអស់ក្នុងស្លាយនេះ"
            >
              បង្ហាញទាំងអស់
            </button>
          </div>
        </div>

        {/* Right: Presentation Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* ⭐ QR REMOTE CONTROL BUTTON */}
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition active:scale-95 flex items-center gap-1.5 border shadow-md ${
              isPhoneConnected
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 border-amber-300 shadow-amber-500/20'
            }`}
            title="ស្កែន QR បញ្ជាពីទូរស័ព្ទ (Phone Remote Controller)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isPhoneConnected ? '📱 ទូរស័ព្ទបានភ្ជាប់' : '📱 បញ្ជាពីទូរស័ព្ទ (QR)'}
            </span>
          </button>

          {/* Font Size Adjuster */}
          <button
            type="button"
            onClick={() => {
              if (fontSizeMode === 'normal') setFontSizeMode('large');
              else if (fontSizeMode === 'large') setFontSizeMode('extra');
              else setFontSizeMode('normal');
            }}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-black transition flex items-center gap-1"
            title="ផ្លាស់ប្តូរទំហំអក្សរស្លាយ (Text Size)"
          >
            <span>អក្សរ:</span>
            <span className="font-black">
              {fontSizeMode === 'normal' ? 'ធម្មតា' : fontSizeMode === 'large' ? 'ធំ' : 'ធំបំផុត'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition border text-xs ${
              soundEnabled
                ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-800/50 text-slate-500 border-slate-800 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'បិទសំឡេង' : 'បើកសំឡេង'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Teacher Speaker Notes Toggle */}
          <button
            type="button"
            onClick={() => setShowTeacherNotes(!showTeacherNotes)}
            className={`px-2.5 py-1.5 rounded-xl transition border text-xs font-bold flex items-center gap-1.5 ${
              showTeacherNotes
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-purple-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="កំណត់សម្គាល់គ្រូ (Speaker Notes)"
          >
            <Lightbulb className="w-4 h-4 text-purple-300" />
            <span className="hidden xl:inline">កំណត់សម្គាល់គ្រូ</span>
          </button>

          {/* Pen / Highlighter Tool */}
          <button
            type="button"
            onClick={() => setDrawMode(!drawMode)}
            className={`p-2 rounded-xl transition border text-xs ${
              drawMode
                ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="ប៊ិចគូសចំណាំលើអេក្រង់"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {drawMode && (
            <button
              type="button"
              onClick={clearCanvas}
              className="p-2 bg-slate-800 hover:bg-rose-900/50 text-rose-400 border border-slate-700 rounded-xl transition text-xs"
              title="លុបគំនូរទាំងអស់"
            >
              <Eraser className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl transition text-xs"
            title={isFullscreen ? 'បង្រួមអេក្រង់' : 'ពេញអេក្រង់ (Fullscreen)'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Close Modal */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl transition shadow-md shadow-rose-600/20 active:scale-95"
            title="បិទស្លាយ (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ================= MAIN PRESENTATION SLIDE STAGE ================= */}
      <main className="flex-1 relative flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-radial from-slate-900 to-slate-950">
        {/* Active Slide Canvas / Board with 16:9 Aspect Ratio */}
        <div className="w-full max-w-7xl h-full max-h-[86vh] relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col justify-between">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={currentSlide.id}
              custom={slideDirection}
              initial={{ opacity: 0, x: slideDirection > 0 ? 80 : -80, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: slideDirection > 0 ? -80 : 80, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`w-full h-full p-4 sm:p-7 md:p-9 bg-gradient-to-br ${currentSlide.themeBg} flex flex-col justify-between relative overflow-y-auto overflow-x-hidden`}
            >
              {/* Background ambient lighting blur */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* SLIDE HEADER SECTION */}
              <div className="relative z-10 space-y-2 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1 bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>{currentSlide.stepBadge}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                      ថ្នាក់ទី ៦ • ភាសាខ្មែរ
                    </span>
                  </div>

                  {/* Quick Timer Shortcut if applicable */}
                  {(currentSlide.type === 'dict_race_game' || currentSlide.type === 'group_practice') && (
                    <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-2xl border border-slate-700 shadow-md">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-xs sm:text-sm font-mono font-black text-amber-300">
                        {timerSeconds > 0
                          ? `${Math.floor(timerSeconds / 60)}:${(timerSeconds % 60)
                              .toString()
                              .padStart(2, '0')}`
                          : currentSlide.type === 'dict_race_game'
                          ? '៦០ វិនាទី'
                          : '៣ នាទី'}
                      </span>
                      {timerActive ? (
                        <button
                          type="button"
                          onClick={() => setTimerActive(false)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                          title="ផ្អាក"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            startTimer(currentSlide.type === 'dict_race_game' ? 60 : 180)
                          }
                          className="p-1 text-emerald-400 hover:text-emerald-300"
                          title="ចាប់ផ្តើម"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={resetTimer}
                        className="p-1 text-slate-400 hover:text-white"
                        title="កំណត់ឡើងវិញ"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <h2
                  className={`font-black text-white leading-tight drop-shadow-md ${
                    fontSizeMode === 'extra'
                      ? 'text-2xl sm:text-4xl md:text-5xl'
                      : fontSizeMode === 'large'
                      ? 'text-xl sm:text-3xl md:text-4xl'
                      : 'text-lg sm:text-2xl md:text-3xl'
                  }`}
                >
                  {currentSlide.title}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-300 font-bold">
                  {currentSlide.subTitle}
                </p>
              </div>

              {/* ================= DYNAMIC SLIDE CONTENT BODY ================= */}
              <div className="relative z-10 my-auto py-3 flex-1 flex flex-col justify-center">
                {/* 1. COVER SLIDE */}
                {currentSlide.type === 'cover' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="p-4 bg-slate-900/80 rounded-3xl border border-slate-700/80 space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 text-sm font-black">
                          <BookOpen className="w-5 h-5" />
                          <span>ប្រភព៖ {currentSlide.sourceRef}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
                          <div>👨‍🏫 គ្រូបង្រៀន ៖ <span className="font-bold text-white">{currentSlide.teacher}</span></div>
                          <div>🏫 សាលារៀន ៖ <span className="font-bold text-white">{currentSlide.school}</span></div>
                          <div>⏱️ រយៈពេល ៖ <span className="font-bold text-white">{currentSlide.duration}</span></div>
                          <div>📖 មុខវិជ្ជា ៖ <span className="font-bold text-amber-300">{currentSlide.subject}</span></div>
                        </div>
                      </div>

                      {/* Inquiry Question Card */}
                      <div className="p-4 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border-2 border-amber-400/40 rounded-3xl space-y-2 shadow-xl">
                        <div className="flex items-center gap-2">
                          <MessageCircleQuestion className="w-5 h-5 text-amber-300" />
                          <span className="font-black text-amber-300 text-sm">សំណួរបំផុសស្មារតីសិស្ស ៖</span>
                        </div>
                        <p className="text-base sm:text-xl font-black text-white leading-snug">
                          {currentSlide.promptQuestion}
                        </p>
                        {currentSlide.promptAnswer && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => toggleReveal('cover_ans')}
                              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md"
                            >
                              {revealedItems['cover_ans'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              <span>{revealedItems['cover_ans'] ? 'លាក់ចម្លើយបំផុស' : '👁️ ចុចបង្ហាញចម្លើយបំផុសគន្លឹះ'}</span>
                            </button>
                            {revealedItems['cover_ans'] && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 p-3 bg-slate-900/95 border border-emerald-400/40 rounded-2xl text-xs sm:text-sm text-emerald-300 font-bold"
                              >
                                {currentSlide.promptAnswer}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Real Photo Card */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center">
                      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl group">
                        <img
                          src={currentSlide.photoUrl}
                          alt="មេរៀនអ្នកមានគុណ"
                          referrerPolicy="no-referrer"
                          className="w-full h-56 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-4">
                          <p className="text-xs sm:text-sm font-bold text-amber-200">
                            {currentSlide.photoCaption}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. OBJECTIVES SLIDE */}
                {currentSlide.type === 'objectives' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Domain 1: Knowledge */}
                      {activeStepPoint >= 1 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.35 }}
                          className="p-5 bg-gradient-to-br from-blue-900/60 to-slate-900 border-2 border-blue-400/40 rounded-3xl space-y-3 shadow-xl"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-2xl shadow-inner">
                            🧠
                          </div>
                          <span className="px-3 py-1 bg-blue-500 text-white font-black text-xs rounded-full inline-block">
                            ១. វិជ្ជាសម្បទា (ចំណេះដឹង)
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-blue-100 leading-relaxed">
                            {currentSlide.objectives?.knowledge}
                          </p>
                        </motion.div>
                      ) : (
                        <div 
                          onClick={nextPoint}
                          className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400/50 transition group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                            🔒
                          </div>
                          <p className="text-xs text-slate-400 font-bold">ចុច [ចំណុចបន្ទាប់] ដើម្បីបង្ហាញវិជ្ជាសម្បទា</p>
                        </div>
                      )}

                      {/* Domain 2: Skill */}
                      {activeStepPoint >= 2 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.35 }}
                          className="p-5 bg-gradient-to-br from-purple-900/60 to-slate-900 border-2 border-purple-400/40 rounded-3xl space-y-3 shadow-xl"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl shadow-inner">
                            ✍️
                          </div>
                          <span className="px-3 py-1 bg-purple-500 text-white font-black text-xs rounded-full inline-block">
                            ២. បំណិនសម្បទា (ជំនាញ)
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-purple-100 leading-relaxed">
                            {currentSlide.objectives?.skills || (currentSlide.objectives as any)?.skill}
                          </p>
                        </motion.div>
                      ) : (
                        <div 
                          onClick={nextPoint}
                          className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400/50 transition group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                            🔒
                          </div>
                          <p className="text-xs text-slate-400 font-bold">ចុច [ចំណុចបន្ទាប់] ដើម្បីបង្ហាញបំណិនសម្បទា</p>
                        </div>
                      )}

                      {/* Domain 3: Attitude */}
                      {activeStepPoint >= 3 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.35 }}
                          className="p-5 bg-gradient-to-br from-pink-900/60 to-slate-900 border-2 border-pink-400/40 rounded-3xl space-y-3 shadow-xl"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-2xl shadow-inner">
                            💖
                          </div>
                          <span className="px-3 py-1 bg-pink-500 text-white font-black text-xs rounded-full inline-block">
                            ៣. ចរិយាសម្បទា (ឥរិយាបថ)
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-pink-100 leading-relaxed">
                            {currentSlide.objectives?.attitude}
                          </p>
                        </motion.div>
                      ) : (
                        <div 
                          onClick={nextPoint}
                          className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400/50 transition group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                            🔒
                          </div>
                          <p className="text-xs text-slate-400 font-bold">ចុច [ចំណុចបន្ទាប់] ដើម្បីបង្ហាញចរិយាសម្បទា</p>
                        </div>
                      )}
                    </div>

                    {/* Right Photo */}
                    <div className="lg:col-span-4 flex flex-col items-center">
                      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-blue-400/40 shadow-2xl">
                        <img
                          src={currentSlide.photoUrl}
                          alt="សិស្សរៀនសូត្រ"
                          referrerPolicy="no-referrer"
                          className="w-full h-48 sm:h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex items-end p-3">
                          <p className="text-xs font-bold text-blue-200">{currentSlide.photoCaption}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. STEP 1: WARM-UP & INQUIRY */}
                {currentSlide.type === 'step1_warmup' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      {/* Inquiry Question Box */}
                      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/40 rounded-3xl space-y-2 shadow-xl">
                        <p className="text-base sm:text-xl font-black text-amber-300 leading-snug">
                          {currentSlide.promptQuestion}
                        </p>
                        <button
                          type="button"
                          onClick={() => toggleReveal('s1_ans')}
                          className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md"
                        >
                          {revealedItems['s1_ans'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span>{revealedItems['s1_ans'] ? 'លាក់ចម្លើយ' : '👁️ បង្ហាញចម្លើយបំផុស'}</span>
                        </button>
                        {revealedItems['s1_ans'] && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-slate-900/90 border border-emerald-400/40 rounded-2xl text-xs sm:text-sm text-emerald-300 font-bold"
                          >
                            {currentSlide.promptAnswer}
                          </motion.div>
                        )}
                      </div>

                      {/* Song Box */}
                      <div className="p-4 bg-slate-900/80 border border-purple-400/30 rounded-3xl space-y-2">
                        <div className="flex items-center gap-2 text-purple-300 font-black text-xs sm:text-sm">
                          <Music className="w-4 h-4" />
                          <span>{currentSlide.songTitle}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-purple-100 font-bold bg-purple-950/40 p-3 rounded-2xl border border-purple-500/20">
                          {currentSlide.songLyrics?.map((lyric, idx) => (
                            <p key={idx}>{lyric}</p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Photo */}
                    <div className="lg:col-span-5 flex flex-col items-center">
                      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl">
                        <img
                          src={currentSlide.photoUrl}
                          alt="គុណម៉ែឪ"
                          referrerPolicy="no-referrer"
                          className="w-full h-52 sm:h-72 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-4">
                          <p className="text-xs sm:text-sm font-bold text-amber-200">
                            {currentSlide.photoCaption}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. STEP 2: HOMEWORK & BRIDGE */}
                {currentSlide.type === 'step2_review' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {currentSlide.homeworkItems?.map((item, idx) => {
                          const isRevealed = activeStepPoint > idx || revealedItems[`hw_${idx}`];
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 bg-slate-900/90 border border-indigo-400/30 rounded-3xl space-y-2 shadow-lg"
                            >
                              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full inline-block">
                                ពាក្យ ៖ {item.word}
                              </span>
                              <div className="text-xs sm:text-sm font-bold text-slate-200">
                                {isRevealed ? (
                                  <p className="text-emerald-300">« {item.sentence} »</p>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => toggleReveal(`hw_${idx}`)}
                                    className="text-xs text-amber-300 underline font-bold"
                                  >
                                    👁️ ចុចបង្ហាញល្បះគំរូ
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Bridge Question */}
                      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-400/40 rounded-3xl space-y-2 shadow-xl">
                        <p className="text-base sm:text-xl font-black text-purple-300 leading-snug">
                          {currentSlide.promptQuestion}
                        </p>
                        <button
                          type="button"
                          onClick={() => toggleReveal('bridge_ans')}
                          className="px-3.5 py-1.5 bg-purple-500 hover:bg-purple-400 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md"
                        >
                          {revealedItems['bridge_ans'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span>{revealedItems['bridge_ans'] ? 'លាក់ចម្លើយ' : '👁️ បង្ហាញចម្លើយភ្ជាប់មេរៀន'}</span>
                        </button>
                        {revealedItems['bridge_ans'] && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-slate-900/90 border border-emerald-400/40 rounded-2xl text-xs sm:text-sm text-emerald-300 font-bold"
                          >
                            {(currentSlide as any).bridgeAnswer}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Right Photo */}
                    <div className="lg:col-span-4 flex flex-col items-center">
                      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-purple-400/40 shadow-2xl">
                        <img
                          src={currentSlide.photoUrl}
                          alt="សិស្សស្វ័យសិក្សា"
                          referrerPolicy="no-referrer"
                          className="w-full h-48 sm:h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex items-end p-3">
                          <p className="text-xs font-bold text-purple-200">{currentSlide.photoCaption}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. STEP 3.1: 3-PHASE DICTIONARY RULES */}
                {currentSlide.type === 'step3_dict_rules' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(currentSlide as any).rules?.map((rule: any, idx: number) => {
                        const isRevealed = activeStepPoint > idx || revealedItems[`rule_${idx}`];
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-5 bg-gradient-to-br ${rule.color} bg-opacity-20 border-2 border-white/20 rounded-3xl space-y-3 shadow-xl`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-3xl">{rule.icon}</span>
                              <span className="px-3 py-1 bg-white/20 text-white font-black text-xs rounded-full">
                                {rule.badge}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-white">{rule.title}</h3>
                            <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed">
                              {rule.desc}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Inquiry Question & Photo Mini-Strip */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-slate-900/80 p-4 rounded-3xl border border-slate-700">
                      <div className="lg:col-span-8 space-y-2">
                        <p className="text-sm sm:text-base font-black text-amber-300">
                          {currentSlide.promptQuestion}
                        </p>
                        <button
                          type="button"
                          onClick={() => toggleReveal('dict_rule_ans')}
                          className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1 shadow-md"
                        >
                          {revealedItems['dict_rule_ans'] ? 'លាក់ចម្លើយ' : '👁️ បង្ហាញចម្លើយ'}
                        </button>
                        {revealedItems['dict_rule_ans'] && (
                          <p className="text-xs sm:text-sm text-emerald-300 font-bold">
                            {currentSlide.promptAnswer}
                          </p>
                        )}
                      </div>
                      <div className="lg:col-span-4 flex items-center gap-3">
                        <img
                          src={currentSlide.photoUrl}
                          alt="វចនានុក្រម"
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-2xl object-cover border border-amber-400/40 shrink-0"
                        />
                        <p className="text-[11px] text-slate-300 font-bold">{currentSlide.photoCaption}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. STEP 3.2: DICTIONARY SPEED RACE GAME */}
                {currentSlide.type === 'dict_race_game' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {currentSlide.words?.map((item, idx) => {
                        const isRevealed = activeStepPoint > idx || revealedItems[`word_${idx}`];
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-slate-900/90 border-2 border-amber-400/40 rounded-3xl space-y-2 shadow-xl"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-xs rounded-full">
                                {item.order}
                              </span>
                              <span className="text-xs font-bold text-purple-300">{item.type}</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-amber-300">{item.word}</h3>
                            <p className="text-[11px] text-slate-400 font-bold">តម្រុយ ៖ {item.hint}</p>
                            {isRevealed ? (
                              <p className="text-xs sm:text-sm text-emerald-300 font-bold pt-1 border-t border-slate-800">
                                📖 ន័យ ៖ {item.meaning}
                              </p>
                            ) : (
                              <button
                                type="button"
                                onClick={() => toggleReveal(`word_${idx}`)}
                                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>បង្ហាញន័យពាក្យ</span>
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Race Prompt Question */}
                    <div className="p-4 bg-gradient-to-r from-amber-500/20 to-rose-500/20 border-2 border-amber-400/40 rounded-3xl space-y-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm sm:text-base font-black text-white">
                          {currentSlide.promptQuestion}
                        </p>
                        {revealedItems['race_order'] && (
                          <p className="text-xs sm:text-sm font-bold text-emerald-300">
                            {currentSlide.promptAnswer}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleReveal('race_order')}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg shrink-0 transition"
                      >
                        {revealedItems['race_order'] ? 'លាក់ចម្លើយរៀបលំដាប់' : '🏆 ចុចបង្ហាញលំដាប់ត្រឹមត្រូវ'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. STEP 3.3: POEM STUDY */}
                {currentSlide.type === 'poem_study' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(currentSlide as any).stanzas?.map((stanza: any, idx: number) => {
                        const isRevealed = activeStepPoint > idx || revealedItems[`stanza_${idx}`];
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 bg-slate-900/90 border-2 border-emerald-400/30 rounded-3xl space-y-2 shadow-lg"
                          >
                            <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-black text-xs rounded-full inline-block">
                              {stanza.no}
                            </span>
                            <div className="space-y-1 text-xs sm:text-sm font-bold text-emerald-100 font-serif leading-relaxed">
                              {stanza.lines.map((line, lIdx) => (
                                <p key={lIdx} className="tracking-wide">
                                  {line}
                                </p>
                              ))}
                            </div>
                            {isRevealed ? (
                              <p className="text-[11px] text-amber-300 font-bold pt-1 border-t border-slate-800">
                                {stanza.coreMeaning}
                              </p>
                            ) : (
                              <button
                                type="button"
                                onClick={() => toggleReveal(`stanza_${idx}`)}
                                className="text-[11px] text-amber-300 underline font-bold"
                              >
                                👁️ បង្ហាញគំនិតសំខាន់
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Right Photo */}
                    <div className="lg:col-span-4 flex flex-col items-center">
                      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-emerald-400/50 shadow-2xl">
                        <img
                          src={currentSlide.photoUrl}
                          alt="ឪពុកម្តាយ"
                          referrerPolicy="no-referrer"
                          className="w-full h-56 sm:h-72 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-3">
                          <p className="text-xs font-bold text-emerald-200">{currentSlide.photoCaption}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. STEP 3.4: NOTE-TAKING METHOD */}
                {currentSlide.type === 'notetaking_method' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {currentSlide.steps?.map((step, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`p-4 bg-gradient-to-br ${step.color} bg-opacity-20 border border-white/20 rounded-3xl space-y-2 shadow-xl`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{step.icon}</span>
                            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-black text-xs text-white">
                              {step.num}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-black text-white">{step.title}</h4>
                          <p className="text-xs text-slate-200 font-bold">{step.desc}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Key Concept Box */}
                    <div className="p-4 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-2 border-amber-400/40 rounded-3xl space-y-2 shadow-2xl">
                      <div className="flex items-center gap-2 text-amber-300 font-black text-xs sm:text-sm">
                        <Award className="w-5 h-5" />
                        <span>បញ្ញត្តិគន្លឹះ (Core Concept)</span>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base font-bold text-white leading-relaxed">
                        {currentSlide.keyConcept}
                      </p>
                    </div>
                  </div>
                )}

                {/* 9. STEP 4: GROUP PRACTICE & HOTS */}
                {currentSlide.type === 'group_practice' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-4">
                      {/* Group prompt */}
                      <div className="p-4 bg-slate-900/90 border-2 border-teal-400/40 rounded-3xl space-y-2">
                        <p className="text-sm sm:text-base font-black text-teal-300">
                          {currentSlide.promptQuestion}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {currentSlide.answers?.map((ans, idx) => {
                            const isRevealed = activeStepPoint > idx || revealedItems[`grp_${idx}`];
                            return (
                              <div key={idx} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                                <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                                  <span>{ans.icon}</span>
                                  <span>{ans.part}</span>
                                </span>
                                {isRevealed ? (
                                  <p className="text-xs sm:text-sm text-slate-200 font-bold">{ans.content}</p>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => toggleReveal(`grp_${idx}`)}
                                    className="text-xs text-amber-300 underline font-bold"
                                  >
                                    👁️ ចុចបង្ហាញចម្លើយគំរូ
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* HOTS Question */}
                      <div className="p-4 bg-gradient-to-r from-rose-950/80 to-amber-950/80 border-2 border-rose-400/40 rounded-3xl space-y-2 shadow-xl">
                        <p className="text-xs sm:text-sm font-black text-rose-300">
                          {currentSlide.hotsQuestion}
                        </p>
                        <button
                          type="button"
                          onClick={() => toggleReveal('hots_ans')}
                          className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md"
                        >
                          {revealedItems['hots_ans'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span>{revealedItems['hots_ans'] ? 'លាក់ចម្លើយ HOTS' : '🔥 ចុចបង្ហាញចម្លើយត្រិះរិះ'}</span>
                        </button>
                        {revealedItems['hots_ans'] && (
                          <p className="text-xs sm:text-sm text-emerald-300 font-bold">
                            {currentSlide.hotsAnswer}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Photo */}
                    <div className="lg:col-span-4 flex flex-col items-center">
                      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-teal-400/40 shadow-2xl">
                        <img
                          src={currentSlide.photoUrl}
                          alt="ការងារក្រុម"
                          referrerPolicy="no-referrer"
                          className="w-full h-48 sm:h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex items-end p-3">
                          <p className="text-xs font-bold text-teal-200">{currentSlide.photoCaption}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. STEP 5: MORAL VALUES & HOMEWORK */}
                {currentSlide.type === 'step5_homework' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-3">
                      {/* Character Values */}
                      <div className="p-4 bg-gradient-to-r from-pink-900/60 to-purple-900/60 border-2 border-pink-400/40 rounded-3xl space-y-2 shadow-xl">
                        <div className="flex items-center gap-2 text-pink-300 font-black text-xs sm:text-sm">
                          <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
                          <span>ការអប់រំគុណធម៌ និងចរិយាសម្បទា (Character Building)</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                          {currentSlide.characterValue}
                        </p>
                        <div className="space-y-1 text-xs sm:text-sm text-pink-100 font-bold pt-1">
                          {currentSlide.moralPoints?.map((point, idx) => (
                            <p key={idx}>{point}</p>
                          ))}
                        </div>
                      </div>

                      {/* Homework */}
                      <div className="p-4 bg-slate-900/90 border-2 border-amber-400/40 rounded-3xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-300 font-black text-xs sm:text-sm">
                            <FileText className="w-5 h-5" />
                            <span>កិច្ចការផ្ទះ (Homework Assignment)</span>
                          </div>
                          <span className="text-xs text-slate-400 font-bold">{currentSlide.nextLessonHint}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-200">
                          {currentSlide.homework}
                        </p>
                      </div>
                    </div>

                    {/* Right Photo */}
                    <div className="lg:col-span-4 flex flex-col items-center">
                      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-pink-400/40 shadow-2xl">
                        <img
                          src={currentSlide.photoUrl}
                          alt="គុណធម៌"
                          referrerPolicy="no-referrer"
                          className="w-full h-48 sm:h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex items-end p-3">
                          <p className="text-xs font-bold text-pink-200">{currentSlide.photoCaption}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. EXIT TICKET & RUBRIC */}
                {currentSlide.type === 'exit_ticket' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentSlide.questions?.map((q, idx) => {
                        const isRevealed = activeStepPoint > idx || revealedItems[`exit_${idx}`];
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-5 bg-slate-900/90 border-2 border-cyan-400/40 rounded-3xl space-y-3 shadow-xl"
                          >
                            <span className="px-3 py-1 bg-cyan-400 text-slate-950 font-black text-xs rounded-full inline-block">
                              សំណួរទី {idx + 1}
                            </span>
                            <h4 className="text-sm sm:text-base font-black text-white leading-snug">{q.q}</h4>
                            {isRevealed ? (
                              <div className="p-3 bg-emerald-950/50 border border-emerald-400/40 rounded-2xl text-xs sm:text-sm text-emerald-300 font-bold">
                                {q.a}
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => toggleReveal(`exit_${idx}`)}
                                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5"
                              >
                                <Eye className="w-4 h-4" />
                                <span>បង្ហាញចម្លើយផ្ទៀងផ្ទាត់</span>
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Rubric Preview */}
                    <div className="p-4 bg-gradient-to-r from-blue-950/90 to-indigo-950/90 border border-blue-400/30 rounded-3xl space-y-2">
                      <div className="flex items-center gap-2 text-blue-300 font-black text-xs sm:text-sm">
                        <GraduationCap className="w-5 h-5" />
                        <span>បន្ទាត់កម្រិតសមត្ថភាព (Assessment Rubric)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                        <div className="p-2.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                          <span className="font-black text-emerald-400">ល្អប្រសើរ (Level 3) ៖</span> {currentSlide.rubric?.level3}
                        </div>
                        <div className="p-2.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                          <span className="font-black text-amber-400">ល្អបង្គួរ (Level 2) ៖</span> {currentSlide.rubric?.level2}
                        </div>
                        <div className="p-2.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                          <span className="font-black text-rose-400">មធ្យម/ត្រូវកែលម្អ (Level 1) ៖</span> {currentSlide.rubric?.level1}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SLIDE FOOTER BAR */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>បង្រៀនតាមវិធីសាស្ត្រសកម្ម (Student-Centered Learning)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline">ចុចគ្រាប់ចុច ⬅️ ➡️ ឬដកឃ្លា (Space) ដើម្បីប្តូរស្លាយ</span>
                  <span className="font-mono font-bold text-amber-400">
                    {currentSlideIndex + 1} / {totalSlides}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* OVERLAY DRAWING CANVAS */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className={`absolute inset-0 w-full h-full z-20 ${
              drawMode ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
            }`}
          />
        </div>
      </main>

      {/* ================= TEACHER SPEAKER NOTES DRAWER ================= */}
      <AnimatePresence>
        {showTeacherNotes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-900 border-t border-purple-500/40 p-4 px-6 z-30 shrink-0 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs sm:text-sm font-black text-purple-300">
                    កំណត់សម្គាល់សម្រាប់គ្រូ (Speaker Notes / Pedagogical Hints)
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {currentSlide.teacherNotes}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTeacherNotes(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= BOTTOM NAVIGATION BAR ================= */}
      <footer className="h-16 px-4 sm:px-6 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-between z-30 shrink-0 shadow-2xl">
        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          disabled={currentSlideIndex === 0}
          className="px-4 sm:px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-black transition active:scale-95 flex items-center gap-2 border border-slate-700"
        >
          <ChevronLeft className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">ស្លាយមុន</span>
        </button>

        {/* Slide Thumbnail dots / pill jumps */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl py-1 no-scrollbar">
          {slides.map((s, idx) => {
            const isCurrent = idx === currentSlideIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => jumpToSlide(idx)}
                className={`h-8 px-2.5 rounded-xl text-xs font-black transition active:scale-90 flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 scale-105'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
                title={`ស្លាយ ${idx + 1}`}
              >
                <span>{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlideIndex === totalSlides - 1}
          className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-30 text-slate-950 rounded-2xl text-xs sm:text-sm font-black transition active:scale-95 flex items-center gap-2 shadow-lg shadow-amber-500/20 border border-amber-300"
        >
          <span>ស្លាយបន្ទាប់</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>

      {/* ================= QR CODE REMOTE CONTROLLER MODAL ================= */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden text-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <Smartphone className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-white">បញ្ជាស្លាយពីទូរស័ព្ទដៃ (Phone Remote)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  បើកកាមេរ៉ាទូរស័ព្ទដៃស្កែន QR កូដខាងក្រោម ដើម្បីប្តូរស្លាយ កំណត់ម៉ោង និងមើលកំណត់សម្គាល់គ្រូពីចម្ងាយដោយសេរី!
                </p>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl inline-block shadow-2xl border-4 border-amber-400/30">
                <QRCodeSVG
                  value={liveRemoteUrl}
                  size={200}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: 'https://cdn-icons-png.flaticon.com/512/3233/3233515.png',
                    x: undefined,
                    y: undefined,
                    height: 38,
                    width: 38,
                    excavate: true
                  }}
                />
              </div>

              {/* Session PIN */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-bold">លេខកូដបន្ទប់ (Session PIN) ៖</div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-amber-300 tracking-wider bg-slate-950 py-2.5 px-4 rounded-2xl border border-slate-700">
                  {sessionId}
                </div>
              </div>

              {/* Connection Status Badge */}
              <div className="flex items-center justify-center gap-2">
                {isPhoneConnected ? (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-black flex items-center gap-1.5">
                    <Wifi className="w-4 h-4" />
                    <span>🟢 បានភ្ជាប់ទូរស័ព្ទជោគជ័យ (Phone Connected)</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <WifiOff className="w-4 h-4" />
                    <span>🟡 កំពុងរង់ចាំការស្កែនពីទូរស័ព្ទ...</span>
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={copyRemoteLink}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>ចម្លងតំណភ្ជាប់ (Copy Link)</span>
                </button>

                <a
                  href={liveRemoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>សាកល្បងលើផ្ទាំងថ្មី</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
