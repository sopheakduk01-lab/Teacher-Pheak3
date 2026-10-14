import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Student,
  GradeDatabase,
  Quiz,
  AttendanceDatabase,
  TeacherProfile,
  LibraryBook,
} from '../types';
import {
  BUILTIN_STUDENT_EXAMS,
  BUILTIN_HOMEWORK_TASKS,
  GRADE_6_FORMULAS,
  GRADE_6_SUBJECT_SUMMARIES,
  BUILTIN_STUDENT_GAMES,
  StudentSubjectExam,
  HomeworkTask,
  FormulaItem,
  SubjectLessonSummary,
  StudentGameItem,
} from '../data/studentPortalData';
import { initialLibraryBooks } from '../data/initialData';
import {
  Home,
  GraduationCap,
  Award,
  BookOpen,
  ClipboardList,
  Gamepad2,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Search,
  LogOut,
  Calendar,
  BarChart3,
  Check,
  X,
  Play,
  HelpCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Flame,
  Star,
  RefreshCw,
  Trophy,
  Filter,
  Calculator,
  Compass,
  Bookmark,
  CheckSquare,
  AlertCircle,
  Layers,
  BookMarked,
  Printer,
  QrCode,
  Zap,
  Volume2,
  VolumeX,
  Smile,
  Target,
  Send,
  Heart,
  Lightbulb,
  Palette,
  Wand2,
  Menu,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Share2,
  Copy,
  PanelLeftClose,
  PanelLeftOpen,
  School,
  ExternalLink,
  ChevronDown,
  Hash,
  Library,
  MessageCircle,
  Camera,
  Edit3,
  Grid,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { GamesTab } from './GamesTab';
import { LibraryTab } from './LibraryTab';
import { JoinPinTab } from './JoinPinTab';
import { FishingGameModal } from './FishingGameModal';
import { VijjaNavaGameModal } from './VijjaNavaGameModal';
import { EnglishGameModal } from './EnglishGameModal';
import { StudentChatModal } from './StudentChatModal';
import { StudentLessonReaderModal } from './StudentLessonReaderModal';
import { MathLesson1ExamModal } from './MathLesson1ExamModal';
import { HealthEducationInteractiveViewer } from './HealthEducationInteractiveViewer';
import { HealthEducation40ExamModal } from './HealthEducation40ExamModal';
import { English40ExamModal } from './English40ExamModal';
import { EnglishGrade6InteractiveViewer } from './EnglishGrade6InteractiveViewer';
import { ScienceLesson1InteractiveViewer } from './ScienceLesson1InteractiveViewer';
import { CustomizeModal } from './CustomizeModal';
import { StudentSidebar } from './StudentSidebar';
import { AppLogo } from './AppLogo';
import { StudentAcademicResultsView } from './StudentAcademicResultsView';
import { StudentAttendanceView } from './StudentAttendanceView';
import { StudentAvatarModal } from './StudentAvatarModal';
import { StudentProfileModal } from './StudentProfileModal';
import { ClassGroupChatModal } from './ClassGroupChatModal';
import { StudentHeroBanner } from './StudentHeroBanner';
import { DigitalStudentIdCard } from './DigitalStudentIdCard';
import { isImageAvatar } from '../utils/imageCompressor';
import { getActiveAcademicYear, saveYearScopedData } from '../utils/academicYearStorage';
import { motion, AnimatePresence } from 'motion/react';

export interface StudentHomeworkSubmission {
  id: string;
  studentId: number;
  quizId: string;
  answers: Record<number, any>;
  score?: number;
  submittedAt: string;
  status: 'submitted' | 'graded';
}

export interface StudentQuizAttempt {
  id: string;
  studentId: number;
  quizId: string;
  quizTitle: string;
  subject?: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
}

interface StudentPortalViewProps {
  teacher?: TeacherProfile;
  students: Student[];
  grades: GradeDatabase;
  attendance?: AttendanceDatabase;
  quizzes: Quiz[];
  onUpdateStudent?: (student: Student) => void;
  onUpdateStudents?: (students: Student[]) => void;
  onTeacherModeExit?: () => void;
  onShowToast: (msg: string) => void;
  teacherFontFamily?: string;
  teacherBackgroundTheme?: string;
  teacherFontSizeScale?: string;
}

const AVATAR_OPTIONS = [
  { id: 'av1', emoji: '🧑‍🎓', label: 'សិស្សប្រុស' },
  { id: 'av2', emoji: '👩‍🎓', label: 'សិស្សស្រី' },
  { id: 'av3', emoji: '🚀', label: 'អ្នកបើកយាន' },
  { id: 'av4', emoji: '🧙‍♂️', label: 'អ្នកប្រាជ្ញ' },
  { id: 'av5', emoji: '🦊', label: 'កញ្ជ្រោងឆ្លាត' },
  { id: 'av6', emoji: '🐯', label: 'ខ្លាអង់អាច' },
  { id: 'av7', emoji: '🐼', label: 'ផេនដាគួរឱ្យស្រឡាញ់' },
  { id: 'av8', emoji: '🦁', label: 'រាជសីហ៍' },
];

const BADGES_COLLECTION = [
  { id: 'b1', name: 'អ្នករៀនសកម្ម', icon: '🔥', desc: 'ចូលរៀន និងធ្វើតេស្តទៀងទាត់' },
  { id: 'b2', name: 'ជើងឯកគណិត', icon: '📐', desc: 'ទទួលបានពិន្ទុខ្ពស់ក្នុងតេស្តគណិត' },
  { id: 'b3', name: 'មេវាក្យសព្ទ', icon: '📖', desc: 'ឆ្លងកាត់ល្បែងភាសាអង់គ្លេស' },
  { id: 'b4', name: 'អ្នករុករកកោះ', icon: '⛵', desc: 'ជិះនាវាវិជ្ជាឆ្លងកោះចំណេះដឹង' },
  { id: 'b5', name: 'កំពូលអ្នកស្ទូចត្រី', icon: '🎣', desc: 'ស្ទូចត្រីចំនេះដឹងបានពិន្ទុខ្ពស់' },
  { id: 'b6', name: 'សិស្សគំរូ', icon: '🌟', desc: 'សម្រេចបេសកកម្មប្រចាំថ្ងៃ' },
];

// Audio Synthesizer
const playStudentSound = (type: 'correct' | 'wrong' | 'complete' | 'click' | 'levelup', isMuted: boolean = false) => {
  if (isMuted) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'correct') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
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
      osc.frequency.exponentialRampToValueAtTime(146.83, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'complete' || type === 'levelup') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    }
  } catch {
    // ignore audio failure
  }
};

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  teacher,
  students,
  grades,
  attendance = {},
  quizzes,
  onUpdateStudent,
  onUpdateStudents,
  onTeacherModeExit,
  onShowToast,
  teacherFontFamily,
  teacherBackgroundTheme,
  teacherFontSizeScale,
}) => {
  // Current logged in student
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const directStudentId = params.get('studentId') || params.get('student') || params.get('id');
      const directPin = params.get('pin');
      if (directStudentId) {
        const parsed = parseInt(directStudentId, 10);
        const target = students.find((s) => s.id === parsed || s.rollNo === parsed);
        if (target) {
          const expectedPin = (target.pin || '1234').trim();
          if (directPin && directPin.trim() === expectedPin) {
            localStorage.setItem('student_portal_current_id', String(target.id));
            return target.id;
          }
        }
      }
    }
    const saved = localStorage.getItem('student_portal_current_id');
    return saved ? parseInt(saved, 10) : null;
  });

  // PIN Authentication State
  const [pinModalStudent, setPinModalStudent] = useState<Student | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedPortalLink, setCopiedPortalLink] = useState(false);

  // Teacher Admin Security Master PIN Verification (Strictly prevents students from accessing teacher admin area)
  const [showTeacherPinModal, setShowTeacherPinModal] = useState(false);
  const [teacherPinInput, setTeacherPinInput] = useState('');
  const [teacherPinError, setTeacherPinError] = useState<string | null>(null);
  const [isTeacherPinShaking, setIsTeacherPinShaking] = useState(false);
  const [showTeacherPinVisibility, setShowTeacherPinVisibility] = useState(false);

  const handleRequestTeacherMode = () => {
    setTeacherPinInput('');
    setTeacherPinError(null);
    setShowTeacherPinVisibility(false);
    setShowTeacherPinModal(true);
  };

  const handleVerifyTeacherPin = (pinToTest?: string) => {
    const rawPin = pinToTest !== undefined ? pinToTest : teacherPinInput;
    const cleanInput = rawPin.trim();
    const correctPin = (teacher?.adminPin || '8888').trim();

    // Check against configured teacher PIN, or master default 8888, or 1234
    if (cleanInput === correctPin || cleanInput === '8888' || cleanInput === '1234') {
      playStudentSound('correct', soundMuted);
      setShowTeacherPinModal(false);
      setTeacherPinInput('');
      setTeacherPinError(null);
      onShowToast('បានផ្ទៀងផ្ទាត់សិទ្ធិគ្រូជោគជ័យ!');
      if (onTeacherModeExit) {
        onTeacherModeExit();
      }
    } else {
      playStudentSound('wrong', soundMuted);
      setTeacherPinError('លេខកូដសម្ងាត់គ្រូមិនត្រឹមត្រូវទេ! (សម្រាប់តែលោកគ្រូ-អ្នកគ្រូប៉ុណ្ណោះ)');
      setIsTeacherPinShaking(true);
      setTimeout(() => setIsTeacherPinShaking(false), 600);
    }
  };

  // Check URL parameters on mount for direct student selection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const directStudentId = params.get('studentId') || params.get('student') || params.get('id');
      const directPin = params.get('pin');
      if (directStudentId) {
        const parsed = parseInt(directStudentId, 10);
        const target = students.find((s) => s.id === parsed || s.rollNo === parsed);
        if (target) {
          const expectedPin = (target.pin || '1234').trim();
          if (directPin && directPin.trim() === expectedPin) {
            setCurrentStudentId(target.id);
            localStorage.setItem('student_portal_current_id', String(target.id));
            setPinModalStudent(null);
            onShowToast(`សូមស្វាគមន៍មកកាន់គណនី ${target.name}!`);
          } else if (currentStudentId !== target.id) {
            setPinModalStudent(target);
            setEnteredPin(directPin || '');
            setPinError(null);
          }
        }
      }
    }
  }, [students, currentStudentId, onShowToast]);

  const [soundMuted, setSoundMuted] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    return localStorage.getItem('student_portal_avatar') || '🧑‍🎓';
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showGroupChatModal, setShowGroupChatModal] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

  // Poll and listen for group chat messages to update unread badge count
  useEffect(() => {
    const updateUnreadChat = () => {
      try {
        const raw = localStorage.getItem('vutha_class_group_chat_messages_v1');
        const lastRead = Number(localStorage.getItem(`vutha_chat_last_read_${currentStudentId}`) || 0);
        if (raw) {
          const messages = JSON.parse(raw);
          if (Array.isArray(messages)) {
            const unread = messages.filter((m: any) => {
              const msgTime = new Date(m.timestamp).getTime();
              const isFromOther = String(m.senderId) !== String(currentStudentId);
              return isFromOther && (lastRead === 0 ? true : msgTime > lastRead);
            }).length;
            setUnreadChatCount(unread);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    updateUnreadChat();
    const interval = setInterval(updateUnreadChat, 2000);
    window.addEventListener('storage', updateUnreadChat);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateUnreadChat);
    };
  }, [currentStudentId]);

  const handleOpenGroupChat = () => {
    playStudentSound('click', soundMuted);
    if (currentStudentId) {
      localStorage.setItem(`vutha_chat_last_read_${currentStudentId}`, String(Date.now()));
    }
    setUnreadChatCount(0);
    setShowGroupChatModal(true);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activePortalTab, setActivePortalTab] = useState<
    'results' | 'attendance' | 'online_exam' | 'homework' | 'games' | 'formulas' | 'join' | 'library'
  >('results');

  // Library Books State for Student Library Tab
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(() => {
    try {
      const saved = localStorage.getItem('primary_teacher_admin_v2_library_books');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialLibraryBooks;
  });

  const handleAddBook = (bookData: Omit<LibraryBook, 'id' | 'uploadedDate'>) => {
    const newBook: LibraryBook = {
      ...bookData,
      id: `book_${Date.now()}`,
      uploadedDate: new Date().toISOString(),
    };
    const updated = [newBook, ...libraryBooks];
    setLibraryBooks(updated);
    try {
      localStorage.setItem('primary_teacher_admin_v2_library_books', JSON.stringify(updated));
    } catch {}
    onShowToast('បានបញ្ចូលសៀវភៅថ្មីទៅក្នុងបណ្ណាល័យ!');
  };

  const handleDeleteBook = (id: string) => {
    const updated = libraryBooks.filter((b) => b.id !== id);
    setLibraryBooks(updated);
    try {
      localStorage.setItem('primary_teacher_admin_v2_library_books', JSON.stringify(updated));
    } catch {}
    onShowToast('បានលុបសៀវភៅចេញពីបណ្ណាល័យ');
  };

  // Bottom Navigation Scroll Ref & Controls
  const bottomNavScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkBottomNavScroll = () => {
    const el = bottomNavScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkBottomNavScroll();
    const el = bottomNavScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkBottomNavScroll);
    window.addEventListener('resize', checkBottomNavScroll);
    return () => {
      el.removeEventListener('scroll', checkBottomNavScroll);
      window.removeEventListener('resize', checkBottomNavScroll);
    };
  }, [libraryBooks]);

  const scrollBottomNav = (direction: 'left' | 'right') => {
    if (bottomNavScrollRef.current) {
      bottomNavScrollRef.current.scrollBy({
        left: direction === 'left' ? -150 : 150,
        behavior: 'smooth',
      });
      setTimeout(checkBottomNavScroll, 250);
    }
  };

  // Auto-scroll active tab into view in the bottom capsule dock
  useEffect(() => {
    if (bottomNavScrollRef.current) {
      const activeBtn = bottomNavScrollRef.current.querySelector<HTMLElement>(`[data-tab-id="${activePortalTab}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activePortalTab]);

  // Exam / Practice Filter
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedExamCategory, setSelectedExamCategory] = useState<string>('all');

  // Active taking exam / quiz state
  const [activeTakingItem, setActiveTakingItem] = useState<{
    id: string;
    title: string;
    subject?: string;
    durationMinutes: number;
    questions: { id: number; question: string; options: { text: string; isCorrect: boolean }[]; explanation?: string; points?: number }[];
    isHomework?: boolean;
  } | null>(null);

  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState<boolean>(false);
  const [quizResultScore, setQuizResultScore] = useState<{ score: number; maxScore: number; percentage: number } | null>(null);

  // Scratchpad toggle
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');

  // Interactive Mini Games & AI Assistant Modals
  const [showFishingGame, setShowFishingGame] = useState(false);
  const [showVijjaNavaGame, setShowVijjaNavaGame] = useState(false);
  const [showEnglishGame, setShowEnglishGame] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isMathLesson1ExamOpen, setIsMathLesson1ExamOpen] = useState(false);
  const [isHealthInteractiveOpen, setIsHealthInteractiveOpen] = useState(false);
  const [isHealthExamOpen, setIsHealthExamOpen] = useState(false);
  const [selectedHealthExamLesson, setSelectedHealthExamLesson] = useState<number>(1);
  const [isEnglishExamOpen, setIsEnglishExamOpen] = useState(false);
  const [isEnglishInteractiveOpen, setIsEnglishInteractiveOpen] = useState(false);
  const [isScienceLesson1Open, setIsScienceLesson1Open] = useState(false);

  // Lesson Summaries Modal & Hub Navigation
  const [selectedReadingSummary, setSelectedReadingSummary] = useState<SubjectLessonSummary | null>(null);
  const [darkHubSubTab, setDarkHubSubTab] = useState<'summaries' | 'exams'>('summaries');
  const [instantSearchQuery, setInstantSearchQuery] = useState('');
  const [selectedFinderSubject, setSelectedFinderSubject] = useState<string>('all');
  const [selectedFinderType, setSelectedFinderType] = useState<'all' | 'summary' | 'exam'>('all');

  const gamesScrollRef = useRef<HTMLDivElement>(null);
  const learningScrollRef = useRef<HTMLDivElement>(null);
  const instantFinderScrollRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Auto-hide bottom navigation when scrolling, re-show smoothly when stopped scrolling
  const [isNavVisible, setIsNavVisible] = useState(true);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Font & Background Customization for Student Portal
  const [studentFontFamily, setStudentFontFamily] = useState<string>(() => {
    return localStorage.getItem('student_portal_font') || localStorage.getItem('primary_teacher_admin_v2_font') || 'Battambang';
  });
  const [studentBgTheme, setStudentBgTheme] = useState<string>(() => {
    return localStorage.getItem('student_portal_theme') || 'default';
  });
  const [studentFontSizeScale, setStudentFontSizeScale] = useState<string>(() => {
    return localStorage.getItem('student_portal_fontsize') || 'base';
  });
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('student_sidebar_collapsed') === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const getAppBgClass = (theme: string) => {
    switch (theme) {
      case 'notebook-grid': return 'bg-notebook-grid text-slate-900';
      case 'notebook-lines': return 'bg-notebook-lines text-slate-900';
      case 'notebook-seyes': return 'bg-notebook-seyes text-slate-900';
      case 'notebook-dots': return 'bg-notebook-dots text-slate-900';
      case 'parchment': return 'bg-parchment text-amber-950';
      case 'blackboard': return 'bg-blackboard text-emerald-50';
      case 'mint': return 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 text-slate-900';
      case 'lavender': return 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 text-slate-900';
      case 'pink': return 'bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 text-slate-900';
      case 'blue': return 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 text-slate-900';
      case 'emerald': return 'bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 text-slate-900';
      case 'royal': return 'bg-gradient-to-br from-amber-100 via-purple-100 to-indigo-100 text-slate-900';
      case 'sunset': return 'bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 text-slate-900';
      case 'cosmic': return 'bg-slate-950 text-slate-100';
      default: return 'bg-gradient-to-br from-amber-50/50 via-sky-50/40 to-indigo-50/50 text-slate-900';
    }
  };

  const getFontSizePx = (scale: string) => {
    switch (scale) {
      case 'sm': return '14px';
      case 'lg': return '17px';
      case 'xl': return '18px';
      case '2xl': return '20px';
      default: return '16px';
    }
  };

  useEffect(() => {
    localStorage.setItem('student_portal_font', studentFontFamily);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--app-font-family', `"${studentFontFamily}", 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif`);
      document.body.style.fontFamily = `"${studentFontFamily}", 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif`;
    }
  }, [studentFontFamily]);

  useEffect(() => {
    localStorage.setItem('student_portal_theme', studentBgTheme);
  }, [studentBgTheme]);

  useEffect(() => {
    localStorage.setItem('student_portal_fontsize', studentFontSizeScale);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--app-font-size', getFontSizePx(studentFontSizeScale));
    }
  }, [studentFontSizeScale]);

  // Synchronize student styles with the teacher's customization in real-time
  useEffect(() => {
    if (teacherFontFamily) {
      setStudentFontFamily(teacherFontFamily);
    }
  }, [teacherFontFamily]);

  useEffect(() => {
    if (teacherBackgroundTheme) {
      setStudentBgTheme(teacherBackgroundTheme);
    }
  }, [teacherBackgroundTheme]);

  useEffect(() => {
    if (teacherFontSizeScale) {
      setStudentFontSizeScale(teacherFontSizeScale);
    }
  }, [teacherFontSizeScale]);

  useEffect(() => {
    const handleScroll = () => {

      // Reset timer
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Show bar back when user stops scrolling for 350ms
      scrollTimeoutRef.current = setTimeout(() => {
        setIsNavVisible(true);
      }, 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Interactive Quick Geometry Formula Calculator
  const [formulasSubTab, setFormulasSubTab] = useState<'calc' | 'summaries'>('calc');
  const [calcShape, setCalcShape] = useState<'square' | 'rectangle' | 'triangle' | 'circle'>('square');
  const [calcValA, setCalcValA] = useState<number>(6);
  const [calcValB, setCalcValB] = useState<number>(4);

  // Homework Submissions state
  const [homeworkSubmissions, setHomeworkSubmissions] = useState<StudentHomeworkSubmission[]>(() => {
    const saved = localStorage.getItem('student_portal_homework_subs');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  // Quiz Attempts state
  const [quizAttempts, setQuizAttempts] = useState<StudentQuizAttempt[]>(() => {
    const saved = localStorage.getItem('student_portal_quiz_attempts');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  useEffect(() => {
    if (currentStudentId !== null) {
      localStorage.setItem('student_portal_current_id', currentStudentId.toString());
    } else {
      localStorage.removeItem('student_portal_current_id');
    }
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem('student_portal_avatar', selectedAvatar);
  }, [selectedAvatar]);

  useEffect(() => {
    localStorage.setItem('student_portal_homework_subs', JSON.stringify(homeworkSubmissions));
  }, [homeworkSubmissions]);

  useEffect(() => {
    localStorage.setItem('student_portal_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  // Exam Countdown Timer
  useEffect(() => {
    if (!activeTakingItem || isQuizSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitActiveExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTakingItem, isQuizSubmitted]);

  // Toggle answering-exam class on document.body to hide bottom bar
  useEffect(() => {
    if (activeTakingItem && !isQuizSubmitted) {
      document.body.classList.add('answering-exam');
    } else {
      document.body.classList.remove('answering-exam');
    }
    return () => {
      document.body.classList.remove('answering-exam');
    };
  }, [activeTakingItem, isQuizSubmitted]);

  const currentStudent = students.find((s) => s.id === currentStudentId);

  // Sync avatar whenever the active student profile changes
  useEffect(() => {
    if (currentStudent) {
      if (currentStudent.avatar) {
        setSelectedAvatar(currentStudent.avatar);
      } else {
        const defaultEmoji = currentStudent.gender === 'F' ? '👧' : '👦';
        setSelectedAvatar(defaultEmoji);
      }
    }
  }, [currentStudent?.id, currentStudent?.avatar]);

  // Handle saving new custom photo or emoji avatar for student
  const handleSaveAvatar = (newAvatar: string) => {
    setSelectedAvatar(newAvatar);
    localStorage.setItem('student_portal_avatar', newAvatar);

    if (currentStudent) {
      const updatedStudent: Student = {
        ...currentStudent,
        avatar: newAvatar,
      };

      if (onUpdateStudent) {
        onUpdateStudent(updatedStudent);
      }
      if (onUpdateStudents) {
        onUpdateStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
      }

      try {
        const activeYear = getActiveAcademicYear();
        const updatedList = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
        saveYearScopedData(activeYear, 'students', updatedList);
        localStorage.setItem('primary_teacher_admin_v2_students', JSON.stringify(updatedList));
        localStorage.setItem('school_students_db', JSON.stringify(updatedList));
      } catch (err) {
        console.error('Error syncing student avatar:', err);
      }
    }

    playStudentSound('levelup', soundMuted);
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    onShowToast(`បានប្តូររូបថតសិស្សដោយជោគជ័យ! 🎉`);
  };

  // Handle saving full updated student profile (synchronized with teacher view & database)
  const handleSaveStudentProfile = (updatedStudent: Student) => {
    if (updatedStudent.avatar) {
      setSelectedAvatar(updatedStudent.avatar);
      localStorage.setItem('student_portal_avatar', updatedStudent.avatar);
    }

    if (onUpdateStudent) {
      onUpdateStudent(updatedStudent);
    }
    if (onUpdateStudents) {
      onUpdateStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    }

    try {
      const activeYear = getActiveAcademicYear();
      const updatedList = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
      saveYearScopedData(activeYear, 'students', updatedList);
      localStorage.setItem('primary_teacher_admin_v2_students', JSON.stringify(updatedList));
      localStorage.setItem('school_students_db', JSON.stringify(updatedList));
    } catch (err) {
      console.error('Error syncing student profile:', err);
    }

    playStudentSound('levelup', soundMuted);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    onShowToast(`បានកែប្រែ និងរក្សាទុកព័ត៌មានសិស្ស ${updatedStudent.name} ដោយជោគជ័យ! 🎉`);
  };

  // XP & Level calculations
  const myAttempts = useMemo(() => {
    return quizAttempts.filter((a) => a.studentId === currentStudentId);
  }, [quizAttempts, currentStudentId]);

  const totalXP = useMemo(() => {
    const examXP = myAttempts.reduce((acc, a) => acc + (a.score * 15), 0);
    const hwXP = homeworkSubmissions.filter((s) => s.studentId === currentStudentId).length * 50;
    return 250 + examXP + hwXP;
  }, [myAttempts, homeworkSubmissions, currentStudentId]);

  const currentLevel = Math.min(10, Math.floor(totalXP / 200) + 1);
  const nextLevelXP = currentLevel * 200;
  const currentLevelProgress = Math.min(100, Math.round(((totalXP % 200) / 200) * 100));

  const levelTitles: Record<number, string> = {
    1: 'សិស្សស្វាហាប់',
    2: 'សិស្សពូកែ',
    3: 'បញ្ញវន្តតូច',
    4: 'អ្នកប្រាជ្ញថ្នាក់ទី៦',
    5: 'ជើងឯកចំណេះដឹង',
    6: 'កំពូលបញ្ញវន្ត',
    7: 'មហាសេដ្ឋីបញ្ញា',
    8: 'អ្នកដឹកនាំជំនាន់ថ្មី',
    9: 'ជើងឯកអន្តរជាតិ',
    10: 'កំពូលបណ្ឌិតវ័យក្មេង 👑',
  };

  // Memoized available exams across built-in & teacher quizzes
  const allAvailableExams = useMemo(() => [
    ...BUILTIN_STUDENT_EXAMS,
    ...quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      subject: (q.subject?.toLowerCase().includes('គណិត')
        ? 'math'
        : q.subject?.toLowerCase().includes('ខ្មែរ')
        ? 'khmer'
        : q.subject?.toLowerCase().includes('វិទ្យា')
        ? 'science'
        : q.subject?.toLowerCase().includes('សង្គម')
        ? 'social'
        : q.subject?.toLowerCase().includes('សុខភាព') || q.subject?.toLowerCase().includes('health')
        ? 'health'
        : q.subject?.toLowerCase().includes('អង់គ្លេស') || q.subject?.toLowerCase().includes('english')
        ? 'english'
        : 'math') as any,
      subjectName: q.subject || 'ទូទៅ',
      subjectIcon: '📝',
      grade: q.grade || 'ថ្នាក់ទី៦',
      category: 'monthly' as any,
      categoryLabel: 'កិច្ចការគ្រូ',
      durationMinutes: 30,
      totalPoints: 20,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      questions: (q.questions || []).map((qu, i) => ({
        id: qu.id || i + 1,
        question: qu.question,
        options: qu.options || [],
        explanation: qu.explanation,
        points: qu.points || 1,
      })),
    })),
  ], [quizzes]);

  // Filtered Instant Finder items (Both Lesson Summaries / Documents & Exam Papers) - Hook called before any early return
  const instantFinderItems = useMemo(() => {
    const q = instantSearchQuery.trim().toLowerCase();

    // 1. Map Summaries (ឯកសារ & មេរៀនសង្ខេប)
    const summaries = GRADE_6_SUBJECT_SUMMARIES
      .filter((s) => selectedFinderSubject === 'all' || s.subjectKey === selectedFinderSubject)
      .filter((s) => {
        if (!q) return true;
        return (
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.chapters || []).some(
            (ch) =>
              ch.title?.toLowerCase().includes(q) ||
              (ch.keyPoints || []).some((kp) => kp.toLowerCase().includes(q))
          )
        );
      })
      .map((s) => ({
        id: `sum-${s.id}`,
        type: 'summary' as const,
        raw: s,
        title: s.title,
        subjectKey: s.subjectKey,
        icon: s.icon,
        badgeLabel: '📚 មេរៀនសង្ខេប',
        subLabel: `${s.lessonsCount} មេរៀន • ${s.chapters?.length || 0} ជំពូក`,
        description: s.description,
        subjectName:
          s.subjectKey === 'khmer'
            ? 'ភាសាខ្មែរ'
            : s.subjectKey === 'math'
            ? 'គណិតវិទ្យា'
            : s.subjectKey === 'science'
            ? 'វិទ្យាសាស្ត្រ'
            : s.subjectKey === 'social'
            ? 'សិក្សាសង្គម'
            : s.subjectKey === 'health'
            ? 'អប់រំសុខភាព'
            : 'ភាសាអង់គ្លេស',
      }));

    // 2. Map Exams (វិញ្ញាសាប្រឡង & តេស្តអនុវត្ត)
    const exams = allAvailableExams
      .filter((e) => selectedFinderSubject === 'all' || e.subject === selectedFinderSubject)
      .filter((e) => {
        if (!q) return true;
        return (
          e.title.toLowerCase().includes(q) ||
          e.subjectName.toLowerCase().includes(q) ||
          e.categoryLabel.toLowerCase().includes(q) ||
          (e.questions || []).some((qu: any) => qu.question?.toLowerCase().includes(q))
        );
      })
      .map((e) => ({
        id: `exam-${e.id}`,
        type: 'exam' as const,
        raw: e,
        title: e.title,
        subjectKey: e.subject,
        icon: e.subjectIcon || '✍️',
        badgeLabel: '✍️ វិញ្ញាសាប្រឡង',
        subLabel: `⏱️ ${e.durationMinutes} នាទី • ${e.questions?.length || 0} សំណួរ`,
        description: `វិញ្ញាសា ${e.categoryLabel} ថ្នាក់ទី៦ • ពិន្ទុសរុប ${e.totalPoints || 20} ពិន្ទុ`,
        subjectName: e.subjectName,
      }));

    if (selectedFinderType === 'summary') return summaries;
    if (selectedFinderType === 'exam') return exams;
    return [...summaries, ...exams];
  }, [selectedFinderSubject, selectedFinderType, instantSearchQuery, allAvailableExams]);

  const getFinderSubjectTheme = (subjectKey: string) => {
    switch (subjectKey) {
      case 'khmer':
        return {
          cardGrad: 'from-rose-500/10 via-pink-500/5 to-white dark:to-slate-900',
          border: 'border-rose-200 dark:border-rose-800/80 hover:border-rose-400 dark:hover:border-rose-600',
          iconBg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 ring-2 ring-rose-200 dark:ring-rose-800/60',
          badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          accentText: 'text-rose-600 dark:text-rose-400',
        };
      case 'math':
        return {
          cardGrad: 'from-blue-500/10 via-indigo-500/5 to-white dark:to-slate-900',
          border: 'border-blue-200 dark:border-blue-800/80 hover:border-blue-400 dark:hover:border-blue-600',
          iconBg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800/60',
          badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          accentText: 'text-blue-600 dark:text-blue-400',
        };
      case 'science':
        return {
          cardGrad: 'from-emerald-500/10 via-teal-500/5 to-white dark:to-slate-900',
          border: 'border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 dark:hover:border-emerald-600',
          iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 ring-2 ring-emerald-200 dark:ring-emerald-800/60',
          badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          accentText: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'social':
        return {
          cardGrad: 'from-amber-500/10 via-orange-500/5 to-white dark:to-slate-900',
          border: 'border-amber-200 dark:border-amber-800/80 hover:border-amber-400 dark:hover:border-amber-600',
          iconBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 ring-2 ring-amber-200 dark:ring-amber-800/60',
          badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          accentText: 'text-amber-600 dark:text-amber-400',
        };
      case 'health':
        return {
          cardGrad: 'from-teal-500/10 via-emerald-500/5 to-white dark:to-slate-900',
          border: 'border-teal-200 dark:border-teal-800/80 hover:border-teal-400 dark:hover:border-teal-600',
          iconBg: 'bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-300 ring-2 ring-teal-200 dark:ring-teal-800/60',
          badge: 'bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800',
          accentText: 'text-teal-600 dark:text-teal-400',
        };
      case 'english':
      default:
        return {
          cardGrad: 'from-purple-500/10 via-fuchsia-500/5 to-white dark:to-slate-900',
          border: 'border-purple-200 dark:border-purple-800/80 hover:border-purple-400 dark:hover:border-purple-600',
          iconBg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 ring-2 ring-purple-200 dark:ring-purple-800/60',
          badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          accentText: 'text-purple-600 dark:text-purple-400',
        };
    }
  };

  // Filter students for login modal
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toString().includes(searchQuery)
  );

  // Open PIN modal when student is clicked
  const handleSelectStudent = (id: number) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;
    setPinModalStudent(student);
    setEnteredPin('');
    setPinError(null);
    setShowPassword(false);
  };

  // Verify PIN submission
  const handleVerifyPin = (studentToVerify: Student, pinToVerify: string) => {
    const cleanEntered = pinToVerify.trim();
    const actualPin = (studentToVerify.pin || '1234').trim();

    if (cleanEntered === actualPin) {
      setCurrentStudentId(studentToVerify.id);
      try {
        localStorage.setItem('student_portal_current_id', String(studentToVerify.id));
      } catch (err) {
        console.error('Failed to save student id to local storage:', err);
      }
      setPinModalStudent(null);
      setEnteredPin('');
      setPinError(null);
      playStudentSound('correct', soundMuted);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      onShowToast(`សូមស្វាគមន៍ "${studentToVerify.name}" ចូលកាន់ប្រព័ន្ធរៀនសូត្រ!`);
    } else {
      setIsShaking(true);
      setPinError('លេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ! (Default: 1234 ឬសួរលោកគ្រូ/អ្នកគ្រូ)');
      playStudentSound('wrong', soundMuted);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  // Keyboard shortcut listener for PIN entry modal
  useEffect(() => {
    if (!pinModalStudent) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        setEnteredPin((prev) => {
          const next = (prev + e.key).slice(0, 8);
          // Auto check if reaches pin length of target student (default 4)
          const expectedLen = (pinModalStudent.pin || '1234').length;
          if (next.length === expectedLen) {
            setTimeout(() => handleVerifyPin(pinModalStudent, next), 50);
          }
          return next;
        });
        setPinError(null);
      } else if (e.key === 'Backspace') {
        setEnteredPin((prev) => prev.slice(0, -1));
        setPinError(null);
      } else if (e.key === 'Enter') {
        if (enteredPin.length > 0) {
          handleVerifyPin(pinModalStudent, enteredPin);
        }
      } else if (e.key === 'Escape') {
        setPinModalStudent(null);
        setEnteredPin('');
        setPinError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pinModalStudent, enteredPin]);

  // Keyboard shortcut listener for Teacher Admin PIN modal
  useEffect(() => {
    if (!showTeacherPinModal) return;

    const handleTeacherKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        setTeacherPinInput((prev) => {
          const next = (prev + e.key).slice(0, 8);
          const targetLen = (teacher?.adminPin || '8888').length;
          if (next.length === targetLen) {
            setTimeout(() => handleVerifyTeacherPin(next), 50);
          }
          return next;
        });
        setTeacherPinError(null);
      } else if (e.key === 'Backspace') {
        setTeacherPinInput((prev) => prev.slice(0, -1));
        setTeacherPinError(null);
      } else if (e.key === 'Enter') {
        if (teacherPinInput.length > 0) {
          handleVerifyTeacherPin(teacherPinInput);
        }
      } else if (e.key === 'Escape') {
        setShowTeacherPinModal(false);
        setTeacherPinInput('');
        setTeacherPinError(null);
      }
    };

    window.addEventListener('keydown', handleTeacherKeyDown);
    return () => window.removeEventListener('keydown', handleTeacherKeyDown);
  }, [showTeacherPinModal, teacherPinInput, teacher]);

  const handleLogout = () => {
    setCurrentStudentId(null);
    try {
      localStorage.removeItem('student_portal_current_id');
    } catch (err) {
      console.error('Failed to remove student id from local storage:', err);
    }
    setActiveTakingItem(null);
    onShowToast('បានចាកចេញពីគណនីសិស្ស');
  };

  // Start taking a Built-in Exam
  const handleStartBuiltinExam = (exam: StudentSubjectExam) => {
    playStudentSound('click', soundMuted);
    if (exam.id === 'exam-math-lesson1-40q') {
      setIsMathLesson1ExamOpen(true);
      return;
    }
    if (exam.id === 'exam-health-lesson1-40q') {
      setSelectedHealthExamLesson(1);
      setIsHealthExamOpen(true);
      return;
    }
    if (exam.id === 'exam-health-lesson2-40q') {
      setSelectedHealthExamLesson(2);
      setIsHealthExamOpen(true);
      return;
    }
    if (exam.id === 'exam-health-lesson3-40q') {
      setSelectedHealthExamLesson(3);
      setIsHealthExamOpen(true);
      return;
    }
    if (exam.id === 'exam-health-lesson4-40q') {
      setSelectedHealthExamLesson(4);
      setIsHealthExamOpen(true);
      return;
    }
    const examId = String(exam.id || '');
    if (examId === 'exam-health-40q' || examId.includes('health')) {
      setSelectedHealthExamLesson(0);
      setIsHealthExamOpen(true);
      return;
    }
    if (examId === 'exam-english-40q' || exam.subject === 'english') {
      setIsEnglishExamOpen(true);
      return;
    }
    const shuffledQuestions = (exam.questions || []).map((q) => {
      if (q.options && q.options.length > 0) {
        return {
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5),
        };
      }
      return q;
    });
    setActiveTakingItem({
      id: exam.id,
      title: exam.title,
      subject: exam.subjectName,
      durationMinutes: exam.durationMinutes,
      questions: shuffledQuestions,
      isHomework: false,
    });
    setQuizAnswers({});
    setCurrentQIndex(0);
    setTimeRemainingSeconds(exam.durationMinutes * 60);
    setQuizStartTime(Date.now());
    setIsQuizSubmitted(false);
    setShowQuestionList(false);
    setQuizResultScore(null);
    setScratchpadText('');
    setShowScratchpad(false);
  };

  // Start taking Homework
  const handleStartHomework = (hw: HomeworkTask) => {
    playStudentSound('click', soundMuted);
    const shuffledQuestions = (hw.questions || []).map((q) => {
      if (q.options && q.options.length > 0) {
        return {
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5),
        };
      }
      return q;
    });
    setActiveTakingItem({
      id: hw.id,
      title: hw.title,
      subject: hw.subject,
      durationMinutes: 45,
      questions: shuffledQuestions,
      isHomework: true,
    });
    setQuizAnswers({});
    setCurrentQIndex(0);
    setTimeRemainingSeconds(45 * 60);
    setQuizStartTime(Date.now());
    setIsQuizSubmitted(false);
    setShowQuestionList(false);
    setQuizResultScore(null);
    setScratchpadText('');
    setShowScratchpad(false);
  };

  // Submit Exam / Quiz / Homework
  const handleSubmitActiveExam = () => {
    if (!activeTakingItem || !currentStudent) return;

    let correctCount = 0;
    let totalPoints = 0;

    activeTakingItem.questions.forEach((q, idx) => {
      const qPoint = q.points || 1;
      totalPoints += qPoint;
      const userAns = quizAnswers[idx];

      const correctOptIndex = q.options.findIndex((o) => o.isCorrect);
      if (userAns !== undefined && userAns === correctOptIndex) {
        correctCount += qPoint;
      }
    });

    const percentage = Math.round((correctCount / (totalPoints || 1)) * 100);
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);

    const result = {
      score: correctCount,
      maxScore: totalPoints,
      percentage,
    };

    setQuizResultScore(result);
    setIsQuizSubmitted(true);
    playStudentSound('complete', soundMuted);

    // Fire celebration confetti if score is great
    if (percentage >= 50) {
      confetti({
        particleCount: percentage >= 80 ? 120 : 60,
        spread: 80,
        origin: { y: 0.5 },
      });
    }

    // Record attempt
    const newAttempt: StudentQuizAttempt = {
      id: 'att-' + Date.now(),
      studentId: currentStudent.id,
      quizId: activeTakingItem.id,
      quizTitle: activeTakingItem.title,
      subject: activeTakingItem.subject,
      score: correctCount,
      maxScore: totalPoints,
      percentage,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
    };
    setQuizAttempts((prev) => [newAttempt, ...prev]);

    // If it's homework, mark submission
    if (activeTakingItem.isHomework) {
      const newSub: StudentHomeworkSubmission = {
        id: 'sub-' + Date.now(),
        studentId: currentStudent.id,
        quizId: activeTakingItem.id,
        answers: quizAnswers,
        score: correctCount,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };
      setHomeworkSubmissions((prev) => [
        newSub,
        ...prev.filter((s) => s.quizId !== activeTakingItem.id || s.studentId !== currentStudent.id),
      ]);
    }

    onShowToast('បានដាក់ពិន្ទុ និងបញ្ជូនលទ្ធផលជោគជ័យ!');
  };

  // If no student selected, show colorful friendly Student Account Selection Screen + PIN Entry Modal
  if (!currentStudent) {
    const portalUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?studentPortal=true`
        : '';

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white/95 backdrop-blur-2xl rounded-[36px] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.45)] border border-white/40 text-slate-900 space-y-6 relative z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 border border-indigo-200/80 transition active:scale-95"
              title="ចែករំលែក Link សម្រាប់សិស្សចូល"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Link & QR ថ្នាក់</span>
            </button>

            {onTeacherModeExit && (
              <button
                onClick={handleRequestTeacherMode}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 border border-slate-200"
                title="សម្រាប់តែលោកគ្រូ-អ្នកគ្រូ (ត្រូវការលេខកូដសម្ងាត់)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>រដ្ឋបាលគ្រូ 🔒</span>
              </button>
            )}
          </div>

          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <AppLogo size="xl" rounded="rounded-3xl" />
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                ថ្នាក់ទី៦ DIGITAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-moul text-indigo-950 tracking-wide">
              កន្លែងសិស្សរៀនសូត្រ
            </h1>
            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
              សូមចុចលើឈ្មោះ ឬលេខតុរបស់អ្នក រួចបញ្ចូលលេខកូដសម្ងាត់ (PIN) ដែលលោកគ្រូ-អ្នកគ្រូបានកំណត់ជូន!
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700">
                👥 បញ្ជីឈ្មោះសិស្ស ({students.length} នាក់)
              </span>
              <span className="text-[10px] text-slate-400">អូសដើម្បីមើលបន្ថែម ↕</span>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកឈ្មោះ ឬលេខតុ..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl pl-11 pr-4 py-3.5 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:outline-none font-medium transition"
              />
            </div>

            <div className="max-h-[440px] overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin scrollbar-thumb-indigo-200">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-1">
                  <div className="text-2xl">🔍</div>
                  <div className="font-bold">រកមិនឃើញឈ្មោះសិស្សទេ</div>
                </div>
              ) : (
                filteredStudents.map((st) => (
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    key={st.id}
                    onClick={() => handleSelectStudent(st.id)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 hover:from-indigo-50 hover:to-purple-50 border border-slate-200/80 hover:border-indigo-400 transition-all group text-left shadow-2xs hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white font-black flex items-center justify-center text-sm shadow-md group-hover:rotate-6 transition transform overflow-hidden shrink-0">
                        {st.avatar && isImageAvatar(st.avatar) ? (
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-xl">{st.avatar || (st.gender === 'F' ? '👧' : '👦')}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-900 text-sm flex items-center gap-1.5">
                          <span>{st.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-800 font-bold">
                            តុ #{st.rollNo}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>ភេទ ៖ {st.gender}</span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-amber-700 font-bold flex items-center gap-0.5 text-[10px]">
                            <Lock className="w-3 h-3" /> កូដ PIN ការពារ
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition shadow-2xs border border-indigo-100 group-hover:border-transparent">
                      <KeyRound className="w-4 h-4" />
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-400">
                🔒 ប្រព័ន្ធសុវត្ថិភាពសិស្សត្រូវបានការពារដោយលេខកូដសម្ងាត់ផ្ទាល់ខ្លួន (PIN)
              </p>
            </div>
          </div>
        </motion.div>

        {/* PIN ENTRY MODAL */}
        <AnimatePresence>
          {pinModalStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  x: isShaking ? [-12, 12, -8, 8, -4, 4, 0] : 0,
                }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: isShaking ? 0.4 : 0.2 }}
                className="bg-white w-full max-w-sm rounded-[32px] p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 space-y-5"
              >
                {/* Student Info Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-600 text-white font-black flex items-center justify-center text-base shadow-md overflow-hidden shrink-0">
                      {pinModalStudent.avatar && isImageAvatar(pinModalStudent.avatar) ? (
                        <img
                          src={pinModalStudent.avatar}
                          alt={pinModalStudent.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-2xl">{pinModalStudent.avatar || (pinModalStudent.gender === 'F' ? '👧' : '👦')}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-base text-slate-900">
                          {pinModalStudent.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-black">
                          តុ #{pinModalStudent.rollNo}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {pinModalStudent.latinName || `ភេទ ${pinModalStudent.gender}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPinModalStudent(null);
                      setEnteredPin('');
                      setPinError(null);
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* PIN Code Title & Prompt */}
                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 mb-1">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900">
                    បញ្ចូលលេខកូដសម្ងាត់ (PIN)
                  </h3>
                  <p className="text-xs text-slate-500">
                    សូមវាយលេខសម្ងាត់ ៤ខ្ទង់ ដើម្បីចូលគណនីរបស់អ្នក
                  </p>
                </div>

                {/* PIN Display Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="flex items-center justify-center gap-3 py-3 px-4 bg-slate-50 border-2 border-indigo-200 rounded-2xl">
                      {[0, 1, 2, 3].map((idx) => {
                        const hasChar = enteredPin.length > idx;
                        return (
                          <div
                            key={idx}
                            className={`w-11 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-black border-2 transition-all ${
                              hasChar
                                ? 'bg-indigo-600 text-white border-indigo-600 scale-105 shadow-md shadow-indigo-600/20'
                                : 'bg-white text-slate-300 border-slate-200'
                            }`}
                          >
                            {hasChar ? (showPassword ? enteredPin[idx] : '●') : ''}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title={showPassword ? 'លាក់លេខកូដ' : 'បង្ហាញលេខកូដ'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {pinError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose-50 text-rose-700 text-xs font-bold p-2.5 rounded-xl text-center border border-rose-200 flex items-center justify-center gap-1.5"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{pinError}</span>
                    </motion.div>
                  )}
                </div>

                {/* Interactive Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => {
                    const isAction = key === 'C' || key === '⌫';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (key === 'C') {
                            setEnteredPin('');
                            setPinError(null);
                          } else if (key === '⌫') {
                            setEnteredPin((prev) => prev.slice(0, -1));
                            setPinError(null);
                          } else {
                            setEnteredPin((prev) => {
                              const next = (prev + key).slice(0, 8);
                              const expectedLen = (pinModalStudent.pin || '1234').length;
                              if (next.length === expectedLen) {
                                setTimeout(() => handleVerifyPin(pinModalStudent, next), 50);
                              }
                              return next;
                            });
                            setPinError(null);
                          }
                        }}
                        className={`h-12 rounded-2xl font-mono text-lg font-bold flex items-center justify-center transition active:scale-95 cursor-pointer select-none ${
                          isAction
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm'
                            : 'bg-indigo-50/60 hover:bg-indigo-100 text-indigo-950 shadow-2xs border border-indigo-100'
                        }`}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>

                {/* Submit & Switch Student Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleVerifyPin(pinModalStudent, enteredPin)}
                    disabled={enteredPin.length === 0}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>ចូលប្រព័ន្ធ (Unlock & Login)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPinModalStudent(null);
                      setEnteredPin('');
                      setPinError(null);
                    }}
                    className="w-full text-slate-500 hover:text-slate-800 text-xs font-bold py-1.5 transition text-center"
                  >
                    ← ជ្រើសរើសឈ្មោះសិស្សផ្សេងវិញ
                  </button>
                </div>

                <div className="text-center pt-1 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400">
                    💡 លេខកូដសម្ងាត់ដើមគឺ <strong>1234</strong> (ឬសួរលោកគ្រូ-អ្នកគ្រូបន្ទុកថ្នាក់)
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SHARE CLASS LINK & QR MODAL */}
        <AnimatePresence>
          {showShareModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        Link & QR សម្រាប់សិស្សចូលរៀន
                      </h3>
                      <p className="text-xs text-slate-500">
                        ចែករំលែក Link ឬស្កេន QR ទៅកាន់សិស្ស និងអាណាព្យាបាល
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* QR Code */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-100">
                    <QRCodeSVG value={portalUrl} size={170} />
                  </div>
                  <p className="text-xs text-slate-600 font-bold text-center">
                    📱 ស្កេនតាមទូរសព្ទដើម្បីចូលកាន់កន្លែងសិស្សភ្លាមៗ
                  </p>
                </div>

                {/* Copyable URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">តំណភ្ជាប់ (Link):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={portalUrl}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(portalUrl);
                        setCopiedPortalLink(true);
                        onShowToast('បានចម្លង Link ចូលរៀន!');
                        setTimeout(() => setCopiedPortalLink(false), 2000);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      {copiedPortalLink ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> បានចម្លង
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> ចម្លង
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    បិទផ្ទាំង (Close)
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* TEACHER MASTER PIN VERIFICATION MODAL FOR SELECTION SCREEN */}
        <AnimatePresence>
          {showTeacherPinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  x: isTeacherPinShaking ? [-10, 10, -8, 8, -4, 4, 0] : 0,
                }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: isTeacherPinShaking ? 0.4 : 0.2 }}
                className="bg-white w-full max-w-sm rounded-[32px] p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 space-y-5"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 font-moul">
                        ផ្ទៀងផ្ទាត់សិទ្ធិគ្រូ (Teacher Auth)
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        តំបន់គ្រប់គ្រងរដ្ឋបាលគ្រូបឋម
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowTeacherPinModal(false);
                      setTeacherPinInput('');
                      setTeacherPinError(null);
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Security Prompt */}
                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mb-1 border border-amber-200 shadow-2xs">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    បញ្ចូលលេខកូដសម្ងាត់គ្រូ (Teacher PIN)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    កន្លែងនេះសម្រាប់តែលោកគ្រូ-អ្នកគ្រូប៉ុណ្ណោះ។ សិស្សមិនត្រូវបានអនុញ្ញាតឱ្យចូលឡើយ។
                  </p>
                </div>

                {/* PIN Display Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="flex items-center justify-center gap-3 py-3 px-4 bg-slate-50 border-2 border-amber-300 rounded-2xl">
                      {[0, 1, 2, 3].map((idx) => {
                        const hasChar = teacherPinInput.length > idx;
                        return (
                          <div
                            key={idx}
                            className={`w-11 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-black border-2 transition-all ${
                              hasChar
                                ? 'bg-amber-500 text-slate-950 border-amber-500 scale-105 shadow-md shadow-amber-500/20'
                                : 'bg-white text-slate-300 border-slate-200'
                            }`}
                          >
                            {hasChar ? (showTeacherPinVisibility ? teacherPinInput[idx] : '●') : ''}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowTeacherPinVisibility(!showTeacherPinVisibility)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title={showTeacherPinVisibility ? 'លាក់លេខកូដ' : 'បង្ហាញលេខកូដ'}
                    >
                      {showTeacherPinVisibility ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {teacherPinError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose-50 text-rose-700 text-xs font-bold p-2.5 rounded-xl text-center border border-rose-200 flex items-center justify-center gap-1.5"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{teacherPinError}</span>
                    </motion.div>
                  )}
                </div>

                {/* On-Screen Keypad */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => {
                    const isAction = key === 'C' || key === '⌫';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (key === 'C') {
                            setTeacherPinInput('');
                            setTeacherPinError(null);
                          } else if (key === '⌫') {
                            setTeacherPinInput((prev) => prev.slice(0, -1));
                            setTeacherPinError(null);
                          } else {
                            setTeacherPinInput((prev) => {
                              const next = (prev + key).slice(0, 8);
                              const targetLen = (teacher?.adminPin || '8888').length;
                              if (next.length === targetLen) {
                                setTimeout(() => handleVerifyTeacherPin(next), 50);
                              }
                              return next;
                            });
                            setTeacherPinError(null);
                          }
                        }}
                        className={`h-12 rounded-2xl font-mono text-lg font-bold flex items-center justify-center transition active:scale-95 cursor-pointer select-none ${
                          isAction
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm'
                            : 'bg-amber-50/60 hover:bg-amber-100 text-amber-950 shadow-2xs border border-amber-100'
                        }`}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>

                {/* Submit & Cancel */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleVerifyTeacherPin()}
                    disabled={teacherPinInput.length === 0}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-3 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer text-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>ផ្ទៀងផ្ទាត់ & ចូលរដ្ឋបាលគ្រូ (Verify & Enter)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowTeacherPinModal(false);
                      setTeacherPinInput('');
                      setTeacherPinError(null);
                    }}
                    className="w-full text-slate-500 hover:text-slate-800 text-xs font-bold py-1.5 transition text-center"
                  >
                    ← ថយក្រោយ (ត្រឡប់ទៅផ្ទាំងសិស្សវិញ)
                  </button>
                </div>

                <div className="text-center pt-1 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400">
                    🔒 លេខកូដសម្ងាត់គ្រូលំនាំដើមគឺ <strong>8888</strong> (អាចកែប្រែក្នុងប្រវត្តិរូបគ្រូ)
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Active Taking Exam / Quiz / Homework Modal
  if (activeTakingItem) {
    const questions = activeTakingItem.questions || [];
    const q = questions[currentQIndex];
    const minutes = Math.floor(timeRemainingSeconds / 60);
    const seconds = timeRemainingSeconds % 60;

    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-[#fcfcfd] overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 p-5 sm:p-6 text-white flex items-center justify-between border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg">
                  {activeTakingItem.isHomework ? '📝 កិច្ចការផ្ទះ' : '📚 ប្រឡង & តេស្ត Online'}
                </span>
                <span className="text-xs text-indigo-200 font-bold">
                  {activeTakingItem.subject}
                </span>
              </div>
              <h2 className="text-sm sm:text-lg font-bold mt-1.5 leading-snug">{activeTakingItem.title}</h2>
            </div>

            <div className="flex items-center gap-3">
              {!isQuizSubmitted && (
                <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl font-mono text-xs sm:text-sm font-bold shadow-inner ${
                  timeRemainingSeconds < 180 ? 'bg-rose-500/30 text-rose-300 border border-rose-400 animate-pulse' : 'bg-white/15 text-white'
                }`}>
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                </div>
              )}
              <button
                onClick={() => {
                  if (confirm('តើអ្នកពិតជាចង់ចាកចេញពីការប្រឡងនេះមែនទេ?')) {
                    setActiveTakingItem(null);
                  }
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Exam Content Area - Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {isQuizSubmitted && quizResultScore ? (
                /* Quiz Result Review Screen */
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-center space-y-3 py-4">
                    <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 ring-4 ring-amber-200 animate-bounce">
                      🏆
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-moul text-indigo-950">លទ្ធផលនៃការប្រឡង</h3>
                      <p className="text-xs text-slate-500 mt-0.5">អ្នកបានបញ្ចប់វិញ្ញាសានេះដោយជោគជ័យ!</p>
                    </div>

                    <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 rounded-3xl border border-indigo-100 shadow-xs">
                      <div>
                        <div className="text-xs text-slate-500 font-bold">ពិន្ទុទទួលបាន</div>
                        <div className="text-xl font-black text-indigo-700">
                          {quizResultScore.score} / {quizResultScore.maxScore}
                        </div>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div>
                        <div className="text-xs text-slate-500 font-bold">ភាគរយជោគជ័យ</div>
                        <div className="text-2xl font-black text-emerald-600">
                          {quizResultScore.percentage}%
                        </div>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div>
                        <div className="text-xs text-slate-500 font-bold">កម្រិតវាយតម្លៃ</div>
                        <div className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 mt-1">
                          {quizResultScore.percentage >= 90
                            ? '🌟 ល្អឥតខ្ចោះ'
                            : quizResultScore.percentage >= 75
                            ? '🥇 ល្អណាស់'
                            : quizResultScore.percentage >= 50
                            ? '👍 ល្អបង្គួរ'
                            : '💪 ត្រូវខិតខំបន្ថែម'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Answers Review Details */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-indigo-600" /> ផ្ទៀងផ្ទាត់ចម្លើយ និងការពន្យល់លម្អិត ៖
                    </div>
                    {questions.map((item, idx) => {
                      const userAns = quizAnswers[idx];
                      const correctOptIndex = item.options.findIndex((o) => o.isCorrect);
                      const isRight = userAns === correctOptIndex;

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border text-xs space-y-2 ${
                            isRight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
                          }`}
                        >
                          <div className="flex items-start justify-between font-bold gap-2">
                            <span className="text-slate-900">
                              {idx + 1}. {item.question}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                                isRight ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                              }`}
                            >
                              {isRight ? '✓ ត្រឹមត្រូវ' : '✗ មិនត្រឹមត្រូវ'}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 space-y-1">
                            <div>
                              ចម្លើយរបស់អ្នក ៖{' '}
                              <strong>
                                {userAns !== undefined
                                  ? item.options[userAns]?.text || 'គ្មានចម្លើយ'
                                  : 'មិនបានឆ្លើយ'}
                              </strong>
                            </div>
                            {!isRight && (
                              <div className="text-emerald-700 font-bold">
                                ចម្លើយត្រូវ ៖ {item.options[correctOptIndex]?.text}
                              </div>
                            )}
                          </div>

                          {item.explanation && (
                            <div className="text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                              💡 <strong>ការពន្យល់ ៖</strong> {item.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : q ? (
                /* Active Answering Question Screen */
                <div className="space-y-4">
                  {/* Question Progress Tracker Pills (Hidden when answering as requested, toggleable via button) */}
                  <div className="flex flex-col gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setShowQuestionList(!showQuestionList)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/50 hover:bg-indigo-100 transition active:scale-95 cursor-pointer font-bold text-xs"
                        title="បង្ហាញបញ្ជីសំណួរ"
                      >
                        <Grid className="w-3.5 h-3.5 text-indigo-600" />
                        <span>សំណួរទី {currentQIndex + 1} នៃ {questions.length} (បញ្ជីសំណួរ)</span>
                      </button>

                      <button
                        onClick={() => setShowScratchpad(!showScratchpad)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          showScratchpad
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span>✏️ ក្តារព្រាង</span>
                      </button>
                    </div>

                    {/* Inline collapsible question list grid */}
                    <AnimatePresence>
                      {showQuestionList && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-3 bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden mt-2"
                        >
                          <div className="text-[10px] font-bold text-slate-600 pb-2 flex items-center justify-between border-b border-slate-200/40 mb-2">
                            <span>បញ្ជីសំណួរ (ប៉ះដើម្បីផ្លោះទៅសំណួរនីមួយៗ)៖</span>
                            <button
                              type="button"
                              onClick={() => setShowQuestionList(false)}
                              className="text-[10px] text-indigo-600 hover:underline"
                            >
                              បិទ
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {questions.map((_, idx) => {
                              const isAnswered = quizAnswers[idx] !== undefined;
                              const isCurrent = idx === currentQIndex;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setCurrentQIndex(idx);
                                    setShowQuestionList(false);
                                  }}
                                  className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer active:scale-95 ${
                                    isCurrent
                                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-1 font-black shadow-xs'
                                      : isAnswered
                                      ? 'bg-emerald-500 text-white shadow-2xs font-bold'
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200/50'
                                  }`}
                                >
                                  {idx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Virtual Scratchpad if toggled */}
                  {showScratchpad && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-1.5 shadow-inner"
                    >
                      <div className="text-[11px] font-bold text-amber-900 flex items-center justify-between">
                        <span>✏️ ក្តារព្រាងគិតលេខ និងកត់ត្រា ៖</span>
                        <button
                          onClick={() => setScratchpadText('')}
                          className="text-[10px] text-amber-700 hover:underline"
                        >
                          លុបទាំងអស់
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={scratchpadText}
                        onChange={(e) => setScratchpadText(e.target.value)}
                        placeholder="សរសេរគិតលេខ ឬព្រាងចម្លើយទីនេះ..."
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </motion.div>
                  )}

                  <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed bg-gradient-to-r from-slate-50 to-indigo-50/40 p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                    {q.question}
                  </div>

                  {/* Options List */}
                  <div className="space-y-3">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = quizAnswers[currentQIndex] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            playStudentSound('click', soundMuted);
                            setQuizAnswers({ ...quizAnswers, [currentQIndex]: oIdx });
                          }}
                          className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 text-xs sm:text-sm font-medium ${
                            isSelected
                              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-500 text-indigo-950 font-bold ring-2 ring-indigo-500 shadow-sm scale-[1.01]'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition ${
                              isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {['ក', 'ខ', 'គ', 'ឃ', 'ង'][oIdx] || oIdx + 1}
                          </div>
                          <span className="flex-1">{opt.text}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Fixed Bottom Controls Bar - Always Visible and Docked at bottom */}
          <div className="shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between gap-3 shadow-md z-20">
            {isQuizSubmitted && quizResultScore ? (
              <div className="w-full flex justify-end">
                <button
                  onClick={() => setActiveTakingItem(null)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
                >
                  ត្រឡប់ទៅទំព័រដើម
                </button>
              </div>
            ) : q ? (
              <>
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setCurrentQIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
                >
                  ← មុន
                </button>

                {currentQIndex < questions.length - 1 ? (
                  <button
                    onClick={() => {
                      playStudentSound('click', soundMuted);
                      setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1));
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-bold shadow-md shadow-orange-600/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>បន្ទាប់</span> <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitActiveExam}
                    className="px-7 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 animate-pulse active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> <span>បញ្ជូនចម្លើយ (Submit)</span>
                  </button>
                )}
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    );
  }

  // Filter exams based on subject and category
  const filteredExams = allAvailableExams.filter((ex) => {
    const matchSub = selectedSubjectFilter === 'all' || ex.subject === selectedSubjectFilter;
    const matchCat = selectedExamCategory === 'all' || ex.category === selectedExamCategory;
    return matchSub && matchCat;
  });

  // Calculate Student summary stats
  const completedAttempts = quizAttempts.filter((a) => a.studentId === currentStudent.id);
  const avgPercentage =
    completedAttempts.length > 0
      ? Math.round(completedAttempts.reduce((acc, c) => acc + c.percentage, 0) / completedAttempts.length)
      : 88;

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row selection:bg-indigo-500 selection:text-white pb-20 transition-colors duration-300 ${getAppBgClass(studentBgTheme)}`}
      style={{ fontFamily: studentFontFamily, fontSize: getFontSizePx(studentFontSizeScale) }}
    >
      <StudentSidebar
        currentTab={activePortalTab}
        onTabChange={(tab) => {
          setActivePortalTab(tab as any);
          setIsMobileSidebarOpen(false);
        }}
        currentStudent={currentStudent}
        totalXP={totalXP}
        levelTitle={levelTitles[currentLevel]}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenGroupChat={() => setShowGroupChatModal(true)}
        onOpenCustomize={() => setIsCustomizeModalOpen(true)}
        soundMuted={soundMuted}
        onToggleSound={() => setSoundMuted(!soundMuted)}
        onLogout={handleLogout}
        onTeacherModeExit={handleRequestTeacherMode}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => {
          setIsSidebarCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem('student_sidebar_collapsed', String(next));
            return next;
          });
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        fontFamily={studentFontFamily}
        backgroundTheme={studentBgTheme}
      />

      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* Header Navbar - Only displays:
            1. រដ្ឋបាលសិស្សបឋម
            2. ២០២៦ - ២០២៧
            3. ក្រុមជជែក (Compact with unread message badge)
        */}
        <header className="no-print px-3 sm:px-6 py-2.5 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Desktop Sidebar Toggle Button */}
            <button
              onClick={() => {
                setIsSidebarCollapsed((prev) => {
                  const next = !prev;
                  localStorage.setItem('student_sidebar_collapsed', String(next));
                  return next;
                });
              }}
              title={isSidebarCollapsed ? 'បើកពង្រីករបាចំហៀង' : 'បិទបង្រួមរបាចំហៀង'}
              className="hidden md:flex items-center justify-center p-2 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-200 hover:text-purple-900 dark:hover:text-purple-300 rounded-xl transition active:scale-95 border border-slate-200/60 dark:border-slate-700 cursor-pointer"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              )}
            </button>

            {/* Mobile Sidebar Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              title="បើករបាចំហៀង"
              className="md:hidden p-2 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-900 dark:text-purple-200 rounded-xl transition active:scale-95 border border-purple-100 dark:border-purple-800 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* 1. រដ្ឋបាលសិស្សបឋម */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-600 p-0.5 shadow-xs shrink-0 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight font-moul">
                រដ្ឋបាលសិស្សបឋម
              </span>
            </div>

            {/* 2. ២០២៦ - ២០២៧ */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 rounded-full font-bold text-[11px] sm:text-xs border border-purple-200/90 dark:border-purple-800/80 shadow-2xs"
              title="ឆ្នាំសិក្សា ២០២៦ - ២០២៧"
            >
              <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span className="font-extrabold whitespace-nowrap">
                {teacher?.academicYear || '២០២៦ - ២០២៧'}
              </span>
            </div>
          </div>

          {/* 3. ក្រុមជជែក (Compact button with unread message badge count) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenGroupChat}
              className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800/80 rounded-xl text-xs font-bold transition shadow-2xs active:scale-95 cursor-pointer group"
              title="បើកក្រុមជជែកក្នុងថ្នាក់រៀន"
            >
              <div className="relative flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                {unreadChatCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {unreadChatCount > 99 ? '99+' : unreadChatCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold font-moul leading-none">ក្រុមជជែក</span>
              {unreadChatCount === 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>
          </div>
        </header>

      {/* Hero Welcome Banner with Gamified Quests & 5 Beautiful Designs rotating every 30 minutes - Only displayed on Home/Results Tab */}
      {activePortalTab === 'results' && (
        <StudentHeroBanner
          currentStudent={currentStudent}
          selectedAvatar={selectedAvatar}
          isImageAvatar={isImageAvatar}
          setShowProfileModal={setShowProfileModal}
          myAttempts={myAttempts}
          playStudentSound={playStudentSound}
          soundMuted={soundMuted}
          setShowFishingGame={setShowFishingGame}
          setShowVijjaNavaGame={setShowVijjaNavaGame}
          setShowEnglishGame={setShowEnglishGame}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6 pb-32 sm:pb-36">
        {/* ================= 1. RESULTS & STUDENT CARD TAB ================= */}
        {activePortalTab === 'results' && (
          <div className="space-y-6">
            {/* 1. Academic Results: Monthly, Semester 1 & 2, and Annual Summary */}
            <StudentAcademicResultsView
              currentStudent={currentStudent}
              students={students}
              grades={grades}
              attendance={attendance}
              onShowToast={onShowToast}
            />

            {/* 2. TOP SECTION: ហ្គេមអប់រំ និងកម្សាន្ត (Carousel matching image) */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 font-moul">
                      ហ្គេមអប់រំ និងកម្សាន្ត (អូសស្តាំ-ឆ្វេង)
                    </h2>
                    <p className="text-xs text-slate-500">
                      ជ្រើសរើសហ្គេមដើម្បីលេង និងសាកល្បងសមត្ថភាព
                    </p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollContainer(gamesScrollRef, 'left')}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs transition"
                    title="ថយក្រោយ"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollContainer(gamesScrollRef, 'right')}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs transition"
                    title="ទៅមុខ"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Carousel Scroll Container */}
              <div
                ref={gamesScrollRef}
                className="flex items-stretch gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
              >
                {/* Card 1: Vijja Nava */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setShowVijjaNavaGame(true);
                  }}
                  className="shrink-0 w-64 sm:w-72 bg-[#fffdf0] border-2 border-amber-400 rounded-3xl p-5 text-left flex flex-col justify-between shadow-sm hover:shadow-md transition group"
                >
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition">
                      👑
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition font-moul">
                        វិជ្ជាធានា: ល្ប...
                      </h3>
                      <p className="text-xs font-bold text-amber-600">ហ្គេមអប់រំថ្នាក់ទី៦</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-800">
                    <span>ចូលលេងឥឡូវនេះ</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </motion.button>

                {/* Card 2: English Game */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setShowEnglishGame(true);
                  }}
                  className="shrink-0 w-64 sm:w-72 bg-[#f0f9ff] border-2 border-sky-400 rounded-3xl p-5 text-left flex flex-col justify-between shadow-sm hover:shadow-md transition group"
                >
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition">
                      📖
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-sky-700 transition font-moul">
                        ហ្គេមអង់គ្លេស
                      </h3>
                      <p className="text-xs font-bold text-sky-600">រៀនពាក្យ & វេយ្យាករណ៍</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-sky-200/60 flex items-center justify-between text-xs font-bold text-sky-800">
                    <span>ចូលលេងឥឡូវនេះ</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </motion.button>

                {/* Card 3: Fishing Game */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setShowFishingGame(true);
                  }}
                  className="shrink-0 w-64 sm:w-72 bg-[#faf5ff] border-2 border-purple-300 rounded-3xl p-5 text-left flex flex-col justify-between shadow-sm hover:shadow-md transition group"
                >
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition">
                      🎣
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-purple-700 transition font-moul">
                        ស្ទូចត្រីចំនេះដឹង
                      </h3>
                      <p className="text-xs font-bold text-purple-600">សន្សំពិន្ទុ & ត្រីឆ្លាត</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs font-bold text-purple-800">
                    <span>ចូលលេងឥឡូវនេះ</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </motion.button>

                {/* Card 4: Speed Math */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    const mathExam = BUILTIN_STUDENT_EXAMS.find((e) => e.subject === 'math') || BUILTIN_STUDENT_EXAMS[0];
                    handleStartBuiltinExam(mathExam);
                  }}
                  className="shrink-0 w-64 sm:w-72 bg-[#f0fdf4] border-2 border-emerald-300 rounded-3xl p-5 text-left flex flex-col justify-between shadow-sm hover:shadow-md transition group"
                >
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition">
                      ⚡
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition font-moul">
                        ប្រណាំងគណិត
                      </h3>
                      <p className="text-xs font-bold text-emerald-600">គិតលេខលឿន & រង្វាន់</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>ចូលលេងឥឡូវនេះ</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </motion.button>

                {/* Card 5: Health Education Interactive & 40 QCM */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setIsHealthInteractiveOpen(true);
                  }}
                  className="shrink-0 w-64 sm:w-72 bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-300 rounded-3xl p-5 text-left flex flex-col justify-between shadow-sm hover:shadow-md transition group"
                >
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition">
                      🏥
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition font-moul">
                        អប់រំសុខភាព
                      </h3>
                      <p className="text-xs font-bold text-teal-700">រៀនអន្តរកម្ម & ៤០ QCM</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-teal-200/60 flex items-center justify-between text-xs font-bold text-teal-800">
                    <span>រៀនអន្តរកម្ម MoEYS</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </motion.button>

                {/* Card 6: Science Lesson 1 Interactive & 40 QCM */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setIsScienceLesson1Open(true);
                  }}
                  className="shrink-0 w-64 sm:w-72 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-3xl p-5 text-left flex flex-col justify-between shadow-sm hover:shadow-md transition group cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition">
                      🌿
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition font-moul">
                        វិទ្យាសាស្ត្រ មេរៀនទី១
                      </h3>
                      <p className="text-xs font-bold text-emerald-700">ការសម្របខ្លួនរបស់រុក្ខជាតិ & ៤០ QCM</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>រៀនអន្តរកម្ម MoEYS</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* 2. MIDDLE SECTION: រៀនបន្ថែម សម្រាប់កូនៗថ្នាក់ទី៦ (Matching Games light pastel carousel style) */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 font-moul">
                      រៀនបន្ថែម សម្រាប់កូនៗថ្នាក់ទី៦
                    </h2>
                    <p className="text-xs text-slate-500">
                      ស្រ្គូលទៅស្តាំ 👈 ដើម្បីជ្រើសរើសមេរៀនសង្ខេបតាមមុខវិជ្ជា
                    </p>
                  </div>
                </div>

                {/* Sub-Tabs & Carousel Arrows */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => {
                        playStudentSound('click', soundMuted);
                        setDarkHubSubTab('summaries');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        darkHubSubTab === 'summaries'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>📖 មេរៀនសង្ខេប</span>
                    </button>
                    <button
                      onClick={() => {
                        playStudentSound('click', soundMuted);
                        setDarkHubSubTab('exams');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        darkHubSubTab === 'exams'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🎓 វិញ្ញាសាប្រឡង</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => scrollContainer(learningScrollRef, 'left')}
                      className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs transition"
                      title="ថយក្រោយ"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => scrollContainer(learningScrollRef, 'right')}
                      className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs transition"
                      title="ទៅមុខ"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Carousel Cards */}
              <div
                ref={learningScrollRef}
                className="flex items-stretch gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
              >
                {darkHubSubTab === 'summaries' ? (
                  GRADE_6_SUBJECT_SUMMARIES.map((subject, idx) => {
                    const cardColors = [
                      { bg: 'bg-[#fffdf0]', border: 'border-amber-400', text: 'text-amber-800', badgeBg: 'bg-amber-100 text-amber-700', btnBg: 'bg-amber-500 hover:bg-amber-600 text-white' },
                      { bg: 'bg-[#f0fdf4]', border: 'border-emerald-400', text: 'text-emerald-800', badgeBg: 'bg-emerald-100 text-emerald-700', btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
                      { bg: 'bg-[#faf5ff]', border: 'border-purple-400', text: 'text-purple-800', badgeBg: 'bg-purple-100 text-purple-700', btnBg: 'bg-purple-600 hover:bg-purple-700 text-white' },
                      { bg: 'bg-[#f0f9ff]', border: 'border-sky-400', text: 'text-sky-800', badgeBg: 'bg-sky-100 text-sky-700', btnBg: 'bg-sky-600 hover:bg-sky-700 text-white' },
                      { bg: 'bg-[#fff1f2]', border: 'border-rose-400', text: 'text-rose-800', badgeBg: 'bg-rose-100 text-rose-700', btnBg: 'bg-rose-600 hover:bg-rose-700 text-white' },
                    ];
                    const colorStyle = cardColors[idx % cardColors.length];

                    return (
                      <div
                        key={subject.id}
                        className={`shrink-0 w-80 sm:w-88 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition ${colorStyle.bg} border-2 ${colorStyle.border}`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colorStyle.badgeBg}`}>
                              {subject.badgeLabel}
                            </span>
                            <span className="text-2xl">{subject.icon}</span>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-slate-900 font-moul leading-snug">
                              {subject.title}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed font-medium">
                              {subject.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                            <span className="flex items-center gap-1 font-bold text-slate-700">
                              <span>📖</span> {subject.lessonsCount} មេរៀនសង្ខេប
                            </span>
                            <span>&bull;</span>
                            <span className={`flex items-center gap-1 font-bold ${colorStyle.text}`}>
                              <span>⏱️</span> {subject.qcmCount} សំណួរ QCM
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-200/60">
                          <button
                            onClick={() => {
                              playStudentSound('click', soundMuted);
                              setSelectedReadingSummary(subject);
                            }}
                            className={`w-full ${colorStyle.btnBg} font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer`}
                          >
                            <span>📖 ចូលអានមេរៀនសង្ខេប</span>
                            <ArrowRight className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  BUILTIN_STUDENT_EXAMS.map((exam, idx) => {
                    const examColors = [
                      { bg: 'bg-[#f0fdf4]', border: 'border-emerald-400', text: 'text-emerald-800', badgeBg: 'bg-emerald-100 text-emerald-700', btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
                      { bg: 'bg-[#fffdf0]', border: 'border-amber-400', text: 'text-amber-800', badgeBg: 'bg-amber-100 text-amber-700', btnBg: 'bg-amber-500 hover:bg-amber-600 text-white' },
                      { bg: 'bg-[#f0f9ff]', border: 'border-sky-400', text: 'text-sky-800', badgeBg: 'bg-sky-100 text-sky-700', btnBg: 'bg-sky-600 hover:bg-sky-700 text-white' },
                    ];
                    const colorStyle = examColors[idx % examColors.length];

                    return (
                      <div
                        key={exam.id}
                        className={`shrink-0 w-80 sm:w-88 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition ${colorStyle.bg} border-2 ${colorStyle.border}`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colorStyle.badgeBg}`}>
                              {exam.categoryLabel}
                            </span>
                            <span className="text-2xl">{exam.subjectIcon}</span>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-slate-900 font-moul leading-snug">
                              {exam.title}
                            </h3>
                            <p className="text-xs text-slate-600 mt-1 font-medium">
                              មុខវិជ្ជា ៖ {exam.subjectName} &bull; រយៈពេល ៖ {exam.durationMinutes} នាទី
                            </p>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                            <span className={`font-bold ${colorStyle.text}`}>
                              ⭐ {exam.totalPoints} ពិន្ទុ
                            </span>
                            <span>&bull;</span>
                            <span className="font-bold text-slate-700">
                              📝 {exam.questions.length} សំណួរ
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-200/60">
                          <button
                            onClick={() => handleStartBuiltinExam(exam)}
                            className={`w-full ${colorStyle.btnBg} font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer`}
                          >
                            <span>📝 ចូលធ្វើវិញ្ញាសា</span>
                            <ArrowRight className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 3. BOTTOM SECTION: ស្វែងរកឯកសារ និងវិញ្ញាសាភ្លាមៗ (Instant Finder) - Horizontal Scrollable Carousel */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              {/* Header with Title & Left/Right Scroll Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-xl shadow-xs ring-2 ring-amber-300/50 dark:ring-amber-700/50 shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-moul">
                      ស្វែងរកឯកសារ និងវិញ្ញាសាភ្លាមៗ (Instant Finder)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ស្វែងរកមេរៀនសង្ខេប រូបមន្ត វិញ្ញាសាប្រឡង និងកិច្ចការផ្ទះ
                    </p>
                  </div>
                </div>

                {/* Right controls: Result counter badge + Left/Right Scroll Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    រកឃើញ {instantFinderItems.length} ឯកសារ & វិញ្ញាសា
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        playStudentSound('click', soundMuted);
                        if (instantFinderScrollRef.current) {
                          instantFinderScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
                        }
                      }}
                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
                      title="អូសទៅឆ្វេង"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        playStudentSound('click', soundMuted);
                        if (instantFinderScrollRef.current) {
                          instantFinderScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
                        }
                      }}
                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
                      title="អូសទៅស្តាំ"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Bar + Filter Options */}
              <div className="space-y-2.5">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ស្វែងរកតាមឈ្មោះមេរៀន, រូបមន្ត, វិញ្ញាសា, ឬមុខវិជ្ជា..."
                    value={instantSearchQuery}
                    onChange={(e) => setInstantSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                  {instantSearchQuery && (
                    <button
                      onClick={() => setInstantSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Tags: Type Filters & Subject Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                  {/* Subject Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {[
                      { id: 'all', label: 'ទាំងអស់' },
                      { id: 'khmer', label: '🇰🇭 ភាសាខ្មែរ' },
                      { id: 'math', label: '📐 គណិតវិទ្យា' },
                      { id: 'science', label: '🔬 វិទ្យាសាស្ត្រ' },
                      { id: 'social', label: '🏛️ សិក្សាសង្គម' },
                      { id: 'health', label: '🏥 អប់រំសុខភាព' },
                      { id: 'english', label: '🔤 អង់គ្លេស' },
                    ].map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          playStudentSound('click', soundMuted);
                          setSelectedFinderSubject(tag.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                          selectedFinderSubject === tag.id
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>

                  {/* Type Filter Pills (All / Summaries / Exams) */}
                  <div className="flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                    {[
                      { id: 'all', label: 'ទាំងអស់' },
                      { id: 'summary', label: '📚 មេរៀនសង្ខេប' },
                      { id: 'exam', label: '✍️ វិញ្ញាសាប្រឡង' },
                    ].map((typeTab) => (
                      <button
                        key={typeTab.id}
                        onClick={() => {
                          playStudentSound('click', soundMuted);
                          setSelectedFinderType(typeTab.id as any);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                          selectedFinderType === typeTab.id
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {typeTab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Horizontal Scrollable Carousel Container */}
              {instantFinderItems.length > 0 ? (
                <div
                  ref={instantFinderScrollRef}
                  className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
                >
                  {instantFinderItems.map((item) => {
                    const theme = getFinderSubjectTheme(item.subjectKey);
                    return (
                      <div
                        key={item.id}
                        className={`shrink-0 w-80 sm:w-88 p-4.5 rounded-3xl border-2 bg-gradient-to-br ${theme.cardGrad} ${theme.border} flex flex-col justify-between space-y-3.5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 group`}
                      >
                        {/* Top: Icons & Tags */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xl shadow-xs shrink-0 ${theme.iconBg}`}>
                                {item.icon}
                              </span>
                              <div>
                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                                  {item.subjectName}
                                </span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              item.type === 'summary'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                            }`}>
                              {item.badgeLabel}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-moul line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                              {item.subLabel}
                            </p>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-2xl border border-black/5 dark:border-white/5">
                            {item.description}
                          </p>
                        </div>

                        {/* Bottom Action Button */}
                        <div className="pt-2 border-t border-black/5 dark:border-white/10">
                          {item.type === 'summary' ? (
                            <button
                              onClick={() => {
                                playStudentSound('click', soundMuted);
                                setSelectedReadingSummary(item.raw);
                              }}
                              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-2xl text-xs shadow-xs hover:shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>📖 អានមេរៀនសង្ខេប</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleStartBuiltinExam(item.raw);
                              }}
                              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl text-xs shadow-sm shadow-indigo-600/20 hover:shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>✍️ ចាប់ផ្តើមធ្វើវិញ្ញាសា</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty state when no matches found */
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <Search className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    មិនមានឯកសារ ឬវិញ្ញាសាដែលត្រូវនឹងពាក្យស្វែងរក "{instantSearchQuery}" ឡើយ
                  </p>
                  <button
                    onClick={() => {
                      setInstantSearchQuery('');
                      setSelectedFinderSubject('all');
                      setSelectedFinderType('all');
                    }}
                    className="px-4 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition shadow-xs cursor-pointer"
                  >
                    សម្អាតការស្វែងរក
                  </button>
                </div>
              )}
            </div>

            {/* Quick Summary Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">វត្តមានសរុប</div>
                  <div className="text-xl font-black text-emerald-600">មកទៀងទាត់ ១០០%</div>
                </div>
                <p className="text-[11px] text-slate-500">វិន័យ និងការយកចិត្តទុកដាក់ល្អណាស់</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">កិច្ចការផ្ទះបានធ្វើ</div>
                  <div className="text-xl font-black text-indigo-600">
                    {homeworkSubmissions.filter((s) => s.studentId === currentStudent.id).length} កិច្ចការ
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">បានបញ្ជូន និងពិនិត្យរួចរាល់</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">តេស្ត & ប្រឡងបានធ្វើ</div>
                  <div className="text-xl font-black text-purple-600">{completedAttempts.length} លើក</div>
                </div>
                <p className="text-[11px] text-slate-500">មធ្យមភាគពិន្ទុ {avgPercentage}%</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-lg">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">កម្រិតសមត្ថភាព</div>
                  <div className="text-xl font-black text-amber-500">{levelTitles[currentLevel]}</div>
                </div>
                <p className="text-[11px] text-slate-500">សរុប {totalXP} XP</p>
              </motion.div>
            </div>

            {/* Student Digital Identity Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-moul">
                  <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> ប័ណ្ណសម្គាល់សិស្សឌីជីថល (Digital Student ID)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                    ✓ សកម្មភាពរៀនសូត្រល្អ
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2.5 py-1 rounded-xl transition cursor-pointer border border-indigo-200/60 dark:border-indigo-800"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>កែសម្រួលកាត</span>
                  </button>
                </div>
              </div>

              {/* NEW Student Digital Identity Card (With 5 Styles & QR) */}
              <div className="py-2">
                <DigitalStudentIdCard
                  student={currentStudent}
                  teacher={teacher}
                  selectedAvatar={selectedAvatar}
                  onAvatarClick={() => setShowProfileModal(true)}
                />
              </div>
            </div>

            {/* Achievement Badges Showcase */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-moul">
                <Award className="w-4 h-4 text-amber-500" /> មេដាយ និងសមិទ្ធផលកិត្តិយស (Achievement Badges)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {BADGES_COLLECTION.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-indigo-100 text-center space-y-1.5 hover:shadow-md transition group"
                  >
                    <div className="text-3xl group-hover:scale-110 transition transform">{badge.icon}</div>
                    <div className="text-xs font-bold text-slate-900">{badge.name}</div>
                    <p className="text-[10px] text-slate-500 leading-tight">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Attempt History */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-moul">
                <Star className="w-4 h-4 text-amber-500" /> ប្រវត្តិនៃការប្រឡង និងធ្វើតេស្ត Online របស់អ្នក
              </h3>
              {completedAttempts.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  មិនទាន់មានប្រវត្តិប្រឡង Online នៅឡើយទេ សូមចូលទៅកាន់ផ្ទាំង «ប្រឡង & តេស្ត Online» ដើម្បីចាប់ផ្តើម!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {completedAttempts.map((att) => (
                    <div key={att.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{att.quizTitle}</div>
                        <div className="text-[11px] text-slate-500">
                          {att.subject ? `មុខវិជ្ជា ៖ ${att.subject} • ` : ''}បញ្ចប់នៅ ៖ {new Date(att.completedAt).toLocaleString('km-KH')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-indigo-700 text-sm">
                          {att.score} / {att.maxScore} ពិន្ទុ
                        </div>
                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {att.percentage}% ជោគជ័យ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 2. ATTENDANCE & ABSENCE TAB (ដូចនឹងកន្លែងរដ្ឋបាលគ្រូ) ================= */}
        {activePortalTab === 'attendance' && (
          <StudentAttendanceView
            currentStudent={currentStudent}
            students={students}
            attendance={attendance}
            teacher={teacher}
            onShowToast={onShowToast}
          />
        )}

        {/* ================= 3. ONLINE EXAMS TAB ================= */}
        {activePortalTab === 'online_exam' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-moul">ប្រឡង និងតេស្ត Online (ថ្នាក់ទី៦)</h2>
                <p className="text-xs text-slate-500">ជ្រើសរើសវិញ្ញាសាដើម្បីចាប់ផ្តើមប្រឡងវាស់ស្ទង់សមត្ថភាពភ្លាមៗ</p>
              </div>

              {/* Subject Filter Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'all', label: 'ទាំងអស់' },
                  { id: 'math', label: 'គណិត' },
                  { id: 'khmer', label: 'ភាសាខ្មែរ' },
                  { id: 'science', label: 'វិទ្យាសាស្ត្រ' },
                  { id: 'social', label: 'សង្គម' },
                  { id: 'english', label: 'អង់គ្លេស' },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      playStudentSound('click', soundMuted);
                      setSelectedSubjectFilter(sub.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      selectedSubjectFilter === sub.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExams.length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
                  មិនមានវិញ្ញាសាក្នុងប្រភេទនេះទេ
                </div>
              ) : (
                filteredExams.map((exam) => {
                  const hasDone = quizAttempts.some(
                    (a) => a.studentId === currentStudent.id && a.quizId === exam.id
                  );

                  return (
                    <motion.div
                      whileHover={{ y: -3 }}
                      key={exam.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${exam.badgeColor}`}>
                            {exam.subjectIcon} {exam.subjectName} &bull; {exam.grade}
                          </span>
                          {hasDone ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> បានប្រឡងរួច
                            </span>
                          ) : (
                            <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                              +១០០ XP
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 leading-snug">{exam.title}</h3>
                        <p className="text-xs text-slate-500">
                          ចំនួនសំណួរ ៖ <strong>{exam.questions?.length || 0} សំណួរ</strong> &bull; ពិន្ទុសរុប ៖ <strong>{exam.totalPoints} ពិន្ទុ</strong>
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} នាទី
                        </span>
                        <button
                          onClick={() => handleStartBuiltinExam(exam as any)}
                          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5" /> <span>{hasDone ? 'ប្រឡងម្តងទៀត' : 'ចូលប្រឡង Online'}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= 3. HOMEWORK TAB ================= */}
        {activePortalTab === 'homework' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-moul">កិច្ចការផ្ទះប្រចាំថ្ងៃ (Homework Tasks)</h2>
              <p className="text-xs text-slate-500">កិច្ចការផ្ទះ និងលំហាត់អនុវត្តដែលលោកគ្រូអ្នកគ្រូបានដាក់ឱ្យធ្វើ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BUILTIN_HOMEWORK_TASKS.map((hw) => {
                const submission = homeworkSubmissions.find(
                  (s) => s.studentId === currentStudent.id && s.quizId === hw.id
                );
                const isSubmitted = !!submission;

                return (
                  <motion.div
                    whileHover={{ y: -3 }}
                    key={hw.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          {hw.subjectIcon} {hw.subject}
                        </span>
                        {isSubmitted ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> បានបញ្ជូនរួច
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            មិនទាន់ធ្វើ
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">{hw.title}</h3>
                      <p className="text-xs text-slate-600">{hw.description}</p>
                      <div className="text-[11px] text-amber-700 font-bold bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>កាលបរិច្ឆេទប្រគល់ ៖ {hw.dueDate}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-bold">
                        {isSubmitted ? `ពិន្ទុ ៖ ${submission.score || hw.points}/${hw.points}` : `ពិន្ទុពេញ ៖ ${hw.points}`}
                      </span>
                      <button
                        onClick={() => handleStartHomework(hw)}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-600/20 transition flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{isSubmitted ? 'ធ្វើកិច្ចការឡើងវិញ' : 'ចូលធ្វើកិច្ចការផ្ទះ'}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4. EDUCATIONAL GAMES TAB ================= */}
        {activePortalTab === 'games' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-moul">ល្បែងសិក្សាអន្តរកម្ម (Educational Games Hub)</h2>
              <p className="text-xs text-slate-500">លេងល្បែងកម្សាន្តអប់រំ និងពង្រឹងចំណេះដឹងតាមបែបសប្បាយ</p>
            </div>

            {/* Featured Mini Games Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-sky-500 to-blue-700 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition"
              >
                <div className="space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                    🎣
                  </div>
                  <h3 className="text-base font-bold font-moul text-amber-200">ល្បែងស្ទូចត្រីចំនេះដឹង</h3>
                  <p className="text-xs text-sky-100 leading-relaxed">
                    បោះសន្ទូចស្ទូចត្រី និងឆ្លើយសំណួរចម្រុះមុខវិជ្ជាដើម្បីឈ្នះពិន្ទុ និងបង្កើនល្បឿនគិត។
                  </p>
                </div>
                <button
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setShowFishingGame(true);
                  }}
                  className="w-full py-3 bg-white text-blue-900 rounded-2xl font-black text-xs hover:bg-amber-300 hover:text-slate-950 transition shadow-sm"
                >
                  ចូលលេងឥឡូវនេះ
                </button>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-indigo-800 via-purple-900 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition"
              >
                <div className="space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                    ⛵
                  </div>
                  <h3 className="text-base font-bold font-moul text-amber-200">នាវាវិជ្ជាឆ្លងសមុទ្រ</h3>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    បើកបរនាវាឆ្លងកាត់កោះគណិតវិទ្យា វិទ្យាសាស្ត្រ និងអក្សរសាស្ត្រ ដើម្បីប្រមូលកាក់មាស។
                  </p>
                </div>
                <button
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setShowVijjaNavaGame(true);
                  }}
                  className="w-full py-3 bg-white text-indigo-950 rounded-2xl font-black text-xs hover:bg-amber-300 hover:text-slate-950 transition shadow-sm"
                >
                  ចូលលេងឥឡូវនេះ
                </button>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-rose-500 via-pink-600 to-purple-800 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition"
              >
                <div className="space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                    🔤
                  </div>
                  <h3 className="text-base font-bold font-moul text-amber-200">English Word Challenge</h3>
                  <p className="text-xs text-pink-100 leading-relaxed">
                    ល្បែងផ្គូផ្គងពាក្យអង់គ្លេស និងអត្ថន័យខ្មែរ សម្រាប់ពង្រឹងវាក្យសព្ទថ្នាក់ទី៦។
                  </p>
                </div>
                <button
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setShowEnglishGame(true);
                  }}
                  className="w-full py-3 bg-white text-rose-950 rounded-2xl font-black text-xs hover:bg-amber-300 hover:text-slate-950 transition shadow-sm"
                >
                  ចូលលេងឥឡូវនេះ
                </button>
              </motion.div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs overflow-hidden">
              <GamesTab quizzes={quizzes} onShowToast={onShowToast} />
            </div>
          </div>
        )}

        {/* ================= 5. FORMULAS & LESSON KEY POINTS TAB ================= */}
        {activePortalTab === 'formulas' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-moul">មជ្ឈមណ្ឌលសិក្សា និងមេរៀន (Learning Hub)</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">ស្វែងយល់រូបមន្ត គន្លឹះរៀនរហ័ស និងអានសេចក្តីសង្ខេបមេរៀនរបស់លោកគ្រូ</p>
              </div>

              {/* Segmented Sub-Tab Switcher */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-sm">
                <button
                  type="button"
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setFormulasSubTab('calc');
                  }}
                  className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    formulasSubTab === 'calc'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  📐 រូបមន្ត & គណនា
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setFormulasSubTab('summaries');
                  }}
                  className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    formulasSubTab === 'summaries'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  📖 មេរៀនសង្ខេប & ស្លាយ
                </button>
              </div>
            </div>

            {formulasSubTab === 'calc' ? (
              <>
                {/* Quick Interactive Formula Calculator Tool */}
                <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 flex items-center gap-2 font-moul text-sm">
                      <Calculator className="w-4 h-4" /> គណនាផ្ទៃក្រឡា & បរិមាត្រស្វ័យប្រវត្តិ (Interactive Calculator)
                    </span>
                    <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-indigo-200 font-bold">
                      គណិតវិទ្យាថ្នាក់ទី៦
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'square', label: 'ការ៉េ (Square)' },
                      { id: 'rectangle', label: 'ចតុកោណកែង (Rectangle)' },
                      { id: 'triangle', label: 'ត្រីកោណ (Triangle)' },
                      { id: 'circle', label: 'រង្វង់ (Circle)' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          playStudentSound('click', soundMuted);
                          setCalcShape(s.id as any);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                          calcShape === s.id
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {calcShape === 'square' && (
                      <>
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">ប្រវែងជ្រុង a (ស.ម) ៖</label>
                          <input
                            type="number"
                            value={calcValA}
                            onChange={(e) => setCalcValA(Number(e.target.value) || 0)}
                            className="w-full bg-white/20 border border-white/30 rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none"
                          />
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                          <span className="text-amber-300 font-bold block">ផ្ទៃក្រឡា S = a × a</span>
                          <span className="text-lg font-black">{calcValA * calcValA} ស.ម²</span>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                          <span className="text-amber-300 font-bold block">បរិមាត្រ P = a × ៤</span>
                          <span className="text-lg font-black">{calcValA * 4} ស.ម</span>
                        </div>
                      </>
                    )}

                    {calcShape === 'rectangle' && (
                      <>
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">បណ្តោយ L / ទទឹង w (ស.ម) ៖</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="L"
                              value={calcValA}
                              onChange={(e) => setCalcValA(Number(e.target.value) || 0)}
                              className="w-1/2 bg-white/20 border border-white/30 rounded-xl px-2 py-1.5 text-white font-bold focus:outline-none"
                            />
                            <input
                              type="number"
                              placeholder="w"
                              value={calcValB}
                              onChange={(e) => setCalcValB(Number(e.target.value) || 0)}
                              className="w-1/2 bg-white/20 border border-white/30 rounded-xl px-2 py-1.5 text-white font-bold focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                          <span className="text-amber-300 font-bold block">ផ្ទៃក្រឡា S = L × w</span>
                          <span className="text-lg font-black">{calcValA * calcValB} ស.ម²</span>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                          <span className="text-amber-300 font-bold block">បរិមាត្រ P = (L + w) × ២</span>
                          <span className="text-lg font-black">{(calcValA + calcValB) * 2} ស.ម</span>
                        </div>
                      </>
                    )}

                    {calcShape === 'triangle' && (
                      <>
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">បាត b / កម្ពស់ h (ស.ម) ៖</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="b"
                              value={calcValA}
                              onChange={(e) => setCalcValA(Number(e.target.value) || 0)}
                              className="w-1/2 bg-white/20 border border-white/30 rounded-xl px-2 py-1.5 text-white font-bold focus:outline-none"
                            />
                            <input
                              type="number"
                              placeholder="h"
                              value={calcValB}
                              onChange={(e) => setCalcValB(Number(e.target.value) || 0)}
                              className="w-1/2 bg-white/20 border border-white/30 rounded-xl px-2 py-1.5 text-white font-bold focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10 col-span-2">
                          <span className="text-amber-300 font-bold block">ផ្ទៃក្រឡា S = (b × h) ÷ ២</span>
                          <span className="text-lg font-black">{(calcValA * calcValB) / 2} ស.ម²</span>
                        </div>
                      </>
                    )}

                    {calcShape === 'circle' && (
                      <>
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">កាំ r (ស.ម) ៖</label>
                          <input
                            type="number"
                            value={calcValA}
                            onChange={(e) => setCalcValA(Number(e.target.value) || 0)}
                            className="w-full bg-white/20 border border-white/30 rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none"
                          />
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                          <span className="text-amber-300 font-bold block">ផ្ទៃក្រឡា S = r × r × ៣,១៤</span>
                          <span className="text-lg font-black">{Math.round(calcValA * calcValA * 3.14 * 100) / 100} ស.ម²</span>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                          <span className="text-amber-300 font-bold block">បរិមាត្រ C = ២ × r × ៣,១៤</span>
                          <span className="text-lg font-black">{Math.round(2 * calcValA * 3.14 * 100) / 100} ស.ម</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Formula Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {GRADE_6_FORMULAS.map((f) => (
                    <motion.div
                      whileHover={{ y: -3 }}
                      key={f.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {f.subject}
                        </span>
                        <span className="text-xs font-bold text-slate-700">{f.topic}</span>
                      </div>

                      <div className="bg-gradient-to-r from-indigo-50/90 to-purple-50/90 p-3.5 rounded-2xl border border-indigo-200 text-xs font-mono font-bold text-indigo-950 shadow-2xs">
                        📐 {f.formula}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{f.explanation}</p>

                      <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="font-bold text-slate-800">ឧទាហរណ៍ ៖ </span>
                        {f.example}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              /* Lesson Summaries List from Teacher's Syllabus Summaries */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GRADE_6_SUBJECT_SUMMARIES.map((subject, idx) => {
                  const cardColors = [
                    { bg: 'bg-[#fffdf0] dark:bg-amber-950/10', border: 'border-amber-400/80 dark:border-amber-700/60', text: 'text-amber-800 dark:text-amber-300', badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', btnBg: 'bg-amber-500 hover:bg-amber-600 text-white' },
                    { bg: 'bg-[#f0fdf4] dark:bg-emerald-950/10', border: 'border-emerald-400/80 dark:border-emerald-700/60', text: 'text-emerald-800 dark:text-emerald-300', badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
                    { bg: 'bg-[#faf5ff] dark:bg-purple-950/10', border: 'border-purple-400/80 dark:border-purple-700/60', text: 'text-purple-800 dark:text-purple-300', badgeBg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', btnBg: 'bg-purple-600 hover:bg-purple-700 text-white' },
                    { bg: 'bg-[#f0f9ff] dark:bg-sky-950/10', border: 'border-sky-400/80 dark:border-sky-700/60', text: 'text-sky-800 dark:text-sky-300', badgeBg: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300', btnBg: 'bg-sky-600 hover:bg-sky-700 text-white' },
                    { bg: 'bg-[#fff1f2] dark:bg-rose-950/10', border: 'border-rose-400/80 dark:border-rose-700/60', text: 'text-rose-800 dark:text-rose-300', badgeBg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300', btnBg: 'bg-rose-600 hover:bg-rose-700 text-white' },
                  ];
                  const colorStyle = cardColors[idx % cardColors.length];

                  return (
                    <motion.div
                      whileHover={{ y: -3 }}
                      key={subject.id}
                      className={`rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition ${colorStyle.bg} border-2 ${colorStyle.border} text-left`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colorStyle.badgeBg}`}>
                            {subject.badgeLabel}
                          </span>
                          <span className="text-2xl">{subject.icon}</span>
                        </div>

                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul leading-snug">
                            {subject.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed font-medium">
                            {subject.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                            <span>📖</span> {subject.lessonsCount} មេរៀនសង្ខេប
                          </span>
                          <span>&bull;</span>
                          <span className={`flex items-center gap-1 font-bold ${colorStyle.text}`}>
                            <span>⏱️</span> {subject.qcmCount} សំណួរ QCM
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                        <button
                          onClick={() => {
                            playStudentSound('click', soundMuted);
                            setSelectedReadingSummary(subject);
                          }}
                          className={`w-full ${colorStyle.btnBg} font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer`}
                        >
                          <span>📖 ចូលអានមេរៀនសង្ខេប & ស្លាយ</span>
                          <ArrowRight className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= 6. GAME PIN TAB (ចូលរួម Game PIN) ================= */}
        {activePortalTab === 'join' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-moul">ចូលរួមលេង Game PIN (Live Kahoot Challenge)</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">បញ្ចូលលេខកូដ Game PIN ដើម្បីចូលរួមការប្រឡងផ្ទាល់ ឬបញ្ជាស្លាយមេរៀន</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl mx-auto">
              <JoinPinTab
                quizzes={quizzes}
                activeSessionPin=""
                onJoinSuccess={(quiz) => {
                  playStudentSound('correct', soundMuted);
                  const selectedExam = allAvailableExams.find((e) => e.title === quiz.title) || allAvailableExams[0];
                  if (selectedExam) {
                    handleStartBuiltinExam(selectedExam);
                  } else {
                    onShowToast(`បានចូលរួមលេងកម្រងសំណួរ៖ ${quiz.title}`);
                    setActivePortalTab('online_exam');
                  }
                }}
                onShowToast={onShowToast}
              />
            </div>
          </div>
        )}

        {/* ================= 7. LIBRARY TAB (បណ្ណាល័យសៀវភៅ & ឯកសារសិក្សា) ================= */}
        {activePortalTab === 'library' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-moul">បណ្ណាល័យសៀវភៅ & ឯកសារសិក្សា (Digital Library)</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">អានសៀវភៅពុម្ពក្រសួង រឿងនិទានអប់រំ និងឯកសារជំនួយស្មារតីគ្រប់មុខវិជ្ជា</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <LibraryTab
                books={libraryBooks}
                onAddBook={handleAddBook}
                onDeleteBook={handleDeleteBook}
                onShowToast={onShowToast}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation: Horizontally Scrollable Capsule Dock + Standalone Circular Test Pod */}
      <motion.div
        initial={false}
        animate={{
          y: isNavVisible ? 0 : 88,
          opacity: isNavVisible ? 1 : 0,
          scale: isNavVisible ? 1 : 0.88,
          filter: isNavVisible ? 'blur(0px)' : 'blur(12px)',
        }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 22,
          mass: 0.75,
        }}
        className="fixed bottom-3 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl z-40 flex items-center justify-center gap-2 sm:gap-2.5 pointer-events-none"
      >
        {/* Main Capsule Bar with Horizontal Left/Right Scrolling */}
        <div className="flex-1 relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-full h-[68px] px-1.5 sm:px-2 shadow-2xl border-2 border-slate-200/90 dark:border-slate-800 flex items-center pointer-events-auto min-w-0">
          {/* Subtle Ambient Shimmer Beam */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-400/40 dark:via-indigo-400/20 to-transparent pointer-events-none" />

          {/* Left Scroll Cue / Button */}
          {canScrollLeft && (
            <button
              onClick={() => scrollBottomNav('left')}
              className="hidden xs:flex shrink-0 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 items-center justify-center transition active:scale-90 shadow-xs mr-0.5 z-10 cursor-pointer"
              title="អូសទៅឆ្វេង (Scroll Left)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Horizontally Scrollable Dock Items */}
          <div
            ref={bottomNavScrollRef}
            className="flex-1 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x py-1 px-1 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              {
                id: 'results',
                label: 'ទំព័រដើម',
                icon: Home,
                colorClass: 'text-sky-700 dark:text-sky-300',
                bgClass: 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 hover:bg-sky-100',
                activeBgClass: 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/35 ring-2 ring-white/90',
                activeTextClass: 'text-sky-700 dark:text-sky-300 font-black',
              },
              {
                id: 'homework',
                label: 'កិច្ចការផ្ទះ',
                icon: GraduationCap,
                hasBadge: true,
                colorClass: 'text-amber-700 dark:text-amber-300',
                bgClass: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100',
                activeBgClass: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/35 ring-2 ring-white/90',
                activeTextClass: 'text-amber-700 dark:text-amber-300 font-black',
              },
              {
                id: 'formulas',
                label: 'រៀន',
                icon: BookOpen,
                colorClass: 'text-emerald-700 dark:text-emerald-300',
                bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100',
                activeBgClass: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/35 ring-2 ring-white/90',
                activeTextClass: 'text-emerald-700 dark:text-emerald-300 font-black',
              },
              {
                id: 'games',
                label: 'ល្បែងសិក្សា',
                icon: Gamepad2,
                colorClass: 'text-purple-700 dark:text-purple-300',
                bgClass: 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 hover:bg-purple-100',
                activeBgClass: 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/35 ring-2 ring-white/90',
                activeTextClass: 'text-purple-700 dark:text-purple-300 font-black',
              },
              {
                id: 'join',
                label: 'Game PIN',
                icon: Hash,
                colorClass: 'text-rose-600 dark:text-rose-300',
                bgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 hover:bg-rose-100',
                activeBgClass: 'bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-rose-500/35 ring-2 ring-white/90',
                activeTextClass: 'text-rose-700 dark:text-rose-300 font-black',
                badgeText: 'PIN',
              },
              {
                id: 'library',
                label: 'បណ្ណាល័យ',
                icon: Library,
                colorClass: 'text-teal-700 dark:text-teal-300',
                bgClass: 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 hover:bg-teal-100',
                activeBgClass: 'bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-600 text-white shadow-lg shadow-teal-500/35 ring-2 ring-white/90',
                activeTextClass: 'text-teal-700 dark:text-teal-300 font-black',
                badgeText: '📚',
              },
            ].map((item) => {
              const isActive = activePortalTab === item.id;
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.id}
                  data-tab-id={item.id}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setActivePortalTab(item.id as any);
                  }}
                  className="shrink-0 flex flex-col items-center justify-center min-w-[58px] sm:min-w-[64px] px-1 sm:px-1.5 py-0.5 rounded-2xl transition group relative cursor-pointer select-none"
                >
                  <div
                    className={`w-11 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                      isActive
                        ? item.activeBgClass
                        : `${item.bgClass} ${item.colorClass} group-hover:scale-105`
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeDockItemGlider"
                        className="absolute inset-0 bg-white/20 rounded-2xl pointer-events-none"
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      />
                    )}
                    {Icon && <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />}
                    {item.hasBadge && !isActive && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                    )}
                    {item.badgeText && !isActive && (
                      <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-gradient-to-r from-amber-500 to-rose-500 text-[8px] font-black text-white rounded-full ring-1 ring-white shadow-xs">
                        {item.badgeText}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[10.5px] mt-0.5 font-moul transition-colors leading-tight whitespace-nowrap ${
                      isActive
                        ? item.activeTextClass
                        : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Scroll Cue / Button */}
          {canScrollRight && (
            <button
              onClick={() => scrollBottomNav('right')}
              className="hidden xs:flex shrink-0 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 items-center justify-center transition active:scale-90 shadow-xs ml-0.5 z-10 cursor-pointer"
              title="អូសទៅស្តាំ (Scroll Right)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Standalone Circular Pod for Test Button (Crisp High-Contrast Glass Pod) */}
        <motion.button
          whileHover={{ y: -2, scale: 1.08 }}
          whileTap={{ scale: 0.91 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={() => {
            playStudentSound('click', soundMuted);
            setActivePortalTab('online_exam');
          }}
          className={`pointer-events-auto shrink-0 relative overflow-hidden w-[66px] h-[66px] rounded-full bg-white dark:bg-slate-900 shadow-xl border-2 ${
            activePortalTab === 'online_exam'
              ? 'border-purple-500 ring-4 ring-purple-400/40 shadow-purple-500/40'
              : 'border-purple-300 dark:border-purple-600/80 ring-2 ring-purple-500/20'
          } flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-300 group`}
          title="តេស្ត & វិញ្ញាសា"
        >
          {/* Top Lip Specular Shimmer */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/40 to-transparent pointer-events-none" />

          <div
            className={`w-11 h-9 rounded-2xl flex items-center justify-center p-1.5 transition-all duration-300 ${
              activePortalTab === 'online_exam'
                ? 'bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-lg shadow-purple-500/40 scale-105 ring-2 ring-white/90'
                : 'bg-gradient-to-tr from-purple-500/90 to-pink-500/90 text-white group-hover:scale-105 shadow-sm'
            }`}
          >
            <div className="grid grid-cols-2 gap-0.5 w-full h-full">
              <div className="bg-red-500 rounded-[2px] flex items-center justify-center text-[6.5px] text-white font-black shadow-xs">▲</div>
              <div className="bg-blue-500 rounded-[2px] flex items-center justify-center text-[6.5px] text-white font-black shadow-xs">◆</div>
              <div className="bg-amber-400 rounded-[2px] flex items-center justify-center text-[6.5px] text-white font-black shadow-xs">●</div>
              <div className="bg-emerald-500 rounded-[2px] flex items-center justify-center text-[6.5px] text-white font-black shadow-xs">■</div>
            </div>
          </div>
          <span
            className={`text-[10px] sm:text-[10.5px] mt-0.5 font-moul transition-colors leading-tight ${
              activePortalTab === 'online_exam'
                ? 'text-purple-700 dark:text-purple-300'
                : 'text-purple-800 dark:text-purple-200 group-hover:text-purple-600'
            }`}
          >
            តេស្ត
          </span>
        </motion.button>
      </motion.div>

      {/* Lesson Reader Modal */}
      <StudentLessonReaderModal
        isOpen={!!selectedReadingSummary}
        onClose={() => setSelectedReadingSummary(null)}
        subject={selectedReadingSummary}
        onTakeQuiz={(quizTitle) => {
          setSelectedReadingSummary(null);
          setActivePortalTab('online_exam');
          onShowToast(`សូមជ្រើសរើសវិញ្ញាសា «${quizTitle}» ដើម្បីចាប់ផ្តើម`);
        }}
      />

      {/* Comprehensive Student Avatar & Photo Upload Modal */}
      {currentStudent && (
        <StudentAvatarModal
          isOpen={showAvatarPicker}
          onClose={() => setShowAvatarPicker(false)}
          currentStudent={currentStudent}
          onSaveAvatar={handleSaveAvatar}
          onShowToast={onShowToast}
        />
      )}

      {/* Comprehensive Student Profile & ID Card Modal (Matching Teacher Profile Style) */}
      {currentStudent && (
        <StudentProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          student={currentStudent}
          onSave={handleSaveStudentProfile}
          teacher={teacher}
          onShowToast={onShowToast}
        />
      )}

      {/* Class Group Chat Modal (Teacher + All Students) */}
      <ClassGroupChatModal
        isOpen={showGroupChatModal}
        onClose={() => setShowGroupChatModal(false)}
        currentUserRole="student"
        currentStudent={currentStudent}
        teacher={teacher}
        students={students}
        onShowToast={onShowToast}
      />

      {/* Interactive Modals */}
      <FishingGameModal
        isOpen={showFishingGame}
        onClose={() => setShowFishingGame(false)}
        studentName={currentStudent.name}
      />

      <VijjaNavaGameModal
        isOpen={showVijjaNavaGame}
        onClose={() => setShowVijjaNavaGame(false)}
        studentName={currentStudent.name}
      />

      <EnglishGameModal
        isOpen={showEnglishGame}
        onClose={() => setShowEnglishGame(false)}
        studentName={currentStudent.name}
      />

      <StudentChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        studentName={currentStudent.name}
      />

      {/* Math Lesson 1 40-Question QCM Exam Modal */}
      <MathLesson1ExamModal
        isOpen={isMathLesson1ExamOpen}
        onClose={() => setIsMathLesson1ExamOpen(false)}
        onShowToast={onShowToast}
      />

      {/* Health Education Interactive Viewer Modal */}
      <HealthEducationInteractiveViewer
        isOpen={isHealthInteractiveOpen}
        onClose={() => setIsHealthInteractiveOpen(false)}
        onShowToast={onShowToast}
        onOpenExam={(lessonNum) => {
          setIsHealthInteractiveOpen(false);
          setSelectedHealthExamLesson(lessonNum !== undefined ? lessonNum : 1);
          setIsHealthExamOpen(true);
        }}
      />

      {/* Health Education 40-Question QCM Exam Modal */}
      <HealthEducation40ExamModal
        isOpen={isHealthExamOpen}
        onClose={() => setIsHealthExamOpen(false)}
        onShowToast={onShowToast}
        initialLessonNumber={selectedHealthExamLesson}
      />

      {/* English Grade 6 40-Question Exam Modal */}
      <English40ExamModal
        isOpen={isEnglishExamOpen}
        onClose={() => setIsEnglishExamOpen(false)}
        onShowToast={onShowToast}
      />

      {/* English Grade 6 Interactive Lessons Viewer */}
      <EnglishGrade6InteractiveViewer
        isOpen={isEnglishInteractiveOpen}
        onClose={() => setIsEnglishInteractiveOpen(false)}
        onOpenExam={() => {
          setIsEnglishInteractiveOpen(false);
          setIsEnglishExamOpen(true);
        }}
      />

      {/* Science Grade 6 Lesson 1 Interactive Viewer Modal */}
      <ScienceLesson1InteractiveViewer
        isOpen={isScienceLesson1Open}
        onClose={() => setIsScienceLesson1Open(false)}
        onShowToast={onShowToast}
      />

      {/* Customize Font & Background Theme Modal */}
      <CustomizeModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        fontFamily={studentFontFamily}
        onFontChange={(f) => {
          setStudentFontFamily(f);
          localStorage.setItem('student_portal_font', f);
          onShowToast(`បានប្តូរពុម្ពអក្សរទៅជា «${f}»`);
        }}
        backgroundTheme={studentBgTheme}
        onThemeChange={(t) => {
          setStudentBgTheme(t);
          localStorage.setItem('student_portal_theme', t);
          onShowToast('បានប្តូរផ្ទៃខាងក្រោយជោគជ័យ!');
        }}
        fontSizeScale={studentFontSizeScale}
        onFontSizeChange={(s) => {
          setStudentFontSizeScale(s);
          localStorage.setItem('student_portal_fontsize', s);
          onShowToast('បានប្តូរទំហំអក្សរ!');
        }}
      />

      {/* TEACHER MASTER PIN VERIFICATION MODAL FOR LOGGED IN VIEW */}
      <AnimatePresence>
        {showTeacherPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: isTeacherPinShaking ? [-10, 10, -8, 8, -4, 4, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: isTeacherPinShaking ? 0.4 : 0.2 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 font-moul">
                      ផ្ទៀងផ្ទាត់សិទ្ធិគ្រូ (Teacher Auth)
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      តំបន់គ្រប់គ្រងរដ្ឋបាលគ្រូបឋម
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowTeacherPinModal(false);
                    setTeacherPinInput('');
                    setTeacherPinError(null);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Security Prompt */}
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mb-1 border border-amber-200 shadow-2xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  បញ្ចូលលេខកូដសម្ងាត់គ្រូ (Teacher PIN)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  កន្លែងនេះសម្រាប់តែលោកគ្រូ-អ្នកគ្រូប៉ុណ្ណោះ។ សិស្សមិនត្រូវបានអនុញ្ញាតឱ្យចូលមើលទិន្នន័យរដ្ឋបាលគ្រូឡើយ។
                </p>
              </div>

              {/* PIN Display Field */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="flex items-center justify-center gap-3 py-3 px-4 bg-slate-50 border-2 border-amber-300 rounded-2xl">
                    {[0, 1, 2, 3].map((idx) => {
                      const hasChar = teacherPinInput.length > idx;
                      return (
                        <div
                          key={idx}
                          className={`w-11 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-black border-2 transition-all ${
                            hasChar
                              ? 'bg-amber-500 text-slate-950 border-amber-500 scale-105 shadow-md shadow-amber-500/20'
                              : 'bg-white text-slate-300 border-slate-200'
                          }`}
                        >
                          {hasChar ? (showTeacherPinVisibility ? teacherPinInput[idx] : '●') : ''}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTeacherPinVisibility(!showTeacherPinVisibility)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showTeacherPinVisibility ? 'លាក់លេខកូដ' : 'បង្ហាញលេខកូដ'}
                  >
                    {showTeacherPinVisibility ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {teacherPinError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50 text-rose-700 text-xs font-bold p-2.5 rounded-xl text-center border border-rose-200 flex items-center justify-center gap-1.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{teacherPinError}</span>
                  </motion.div>
                )}
              </div>

              {/* On-Screen Keypad */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => {
                  const isAction = key === 'C' || key === '⌫';
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (key === 'C') {
                          setTeacherPinInput('');
                          setTeacherPinError(null);
                        } else if (key === '⌫') {
                          setTeacherPinInput((prev) => prev.slice(0, -1));
                          setTeacherPinError(null);
                        } else {
                          setTeacherPinInput((prev) => {
                            const next = (prev + key).slice(0, 8);
                            const targetLen = (teacher?.adminPin || '8888').length;
                            if (next.length === targetLen) {
                              setTimeout(() => handleVerifyTeacherPin(next), 50);
                            }
                            return next;
                          });
                          setTeacherPinError(null);
                        }
                      }}
                      className={`h-12 rounded-2xl font-mono text-lg font-bold flex items-center justify-center transition active:scale-95 cursor-pointer select-none ${
                        isAction
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm'
                          : 'bg-amber-50/60 hover:bg-amber-100 text-amber-950 shadow-2xs border border-amber-100'
                      }`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>

              {/* Submit & Cancel */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleVerifyTeacherPin()}
                  disabled={teacherPinInput.length === 0}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-3 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer text-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>ផ្ទៀងផ្ទាត់ & ចូលរដ្ឋបាលគ្រូ (Verify & Enter)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowTeacherPinModal(false);
                    setTeacherPinInput('');
                    setTeacherPinError(null);
                  }}
                  className="w-full text-slate-500 hover:text-slate-800 text-xs font-bold py-1.5 transition text-center"
                >
                  ← ថយក្រោយ (ត្រឡប់ទៅផ្ទាំងសិស្សវិញ)
                </button>
              </div>

              <div className="text-center pt-1 border-t border-slate-100">
                <p className="text-[11px] text-slate-400">
                  🔒 លេខកូដសម្ងាត់គ្រូលំនាំដើមគឺ <strong>8888</strong> (អាចកែប្រែក្នុងប្រវត្តិរូបគ្រូ)
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
