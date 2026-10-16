import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Flame, Play, ChevronLeft, ChevronRight, Globe, Lock, Shapes, Plus, UserCheck, ClipboardList, BookOpen, GraduationCap, Award, ExternalLink, Smartphone, Camera, Radio, QrCode, FileQuestion, BookMarked, Gamepad2, Layers, Calendar, Users } from 'lucide-react';
import { TeacherProfile, Quiz } from '../types';
import { GRADE_6_SUBJECT_SUMMARIES, SubjectLessonSummary } from '../data/studentPortalData';
import {
  getAllMathLessonQuizItems,
  ALL_MATH_LESSONS_PACKAGES,
  getMathLessonPackage,
} from '../data/mathLessonQcm';
import { toKhmerNum } from '../utils/khmerDate';
import { StudentLessonReaderModal } from './StudentLessonReaderModal';
import { MathLesson1InteractiveViewer } from './MathLesson1InteractiveViewer';
import { MathInteractiveLessonViewer } from './MathInteractiveLessonViewer';
import { MathLesson1ExamModal } from './MathLesson1ExamModal';
import { HealthEducationInteractiveViewer } from './HealthEducationInteractiveViewer';
import { HealthEducation40ExamModal } from './HealthEducation40ExamModal';
import { HEALTH_EDUCATION_SECTIONS, ALL_HEALTH_LESSONS_PACKAGES } from '../data/healthEducationLessonsData';
import { EnglishGrade6InteractiveViewer } from './EnglishGrade6InteractiveViewer';
import { English40ExamModal } from './English40ExamModal';
import { ENGLISH_GRADE_6_UNITS } from '../data/englishGrade6Data';
import { initialQuizzes } from '../data/initialData';
import { PLPTabletBanner } from './PLPTabletBanner';
import { PdfCustomizerModal } from './PdfCustomizerModal';
import { PLPEdTechCard } from './PLPEdTechCard';
import { DigitalSchoolCard } from './DigitalSchoolCard';
import { MoeysCpdCard } from './MoeysCpdCard';
import { MoeysGuidelineCard } from './MoeysGuidelineCard';
import { MoeysStatsGuidelineCard } from './MoeysStatsGuidelineCard';
import { CivilServantHolidaysCard } from './CivilServantHolidaysCard';
import { TeacherPalaceDashboardHero } from './TeacherPalaceDashboardHero';
import { ClassroomDecorationPrintModal } from './ClassroomDecorationPrintModal';
import { getActiveSlideSessions, ActiveSessionInfo } from '../lib/slideRemoteSync';
import { FishingGameModal } from './FishingGameModal';
import { VijjaNavaGameModal } from './VijjaNavaGameModal';
import { EnglishGameModal } from './EnglishGameModal';

import { CameraQuizModal } from './CameraQuizModal';
import { ScienceLessonIframe } from './ScienceLessonIframe';

export interface HomeStudyGame {
  id: string;
  title: string;
  subTitle: string;
  subject: string;
  subjectKey: string;
  grade: string;
  icon: string;
  badge: string;
  gradient: string;
  imageUrl: string;
  description: string;
  actionType: 'modal_fishing' | 'modal_vijjanava' | 'modal_english' | 'modal_camera' | 'tab_games';
  playText: string;
}

export const HOME_STUDY_GAMES: HomeStudyGame[] = [
  {
    id: 'camera_quiz',
    title: 'ល្បែងសំណួរ កាមេរ៉ាឆ្លាតវៃ',
    subTitle: 'AI Camera Motion Quiz',
    subject: 'គ្រប់មុខវិជ្ជា',
    subjectKey: 'all',
    grade: 'ថ្នាក់ទី ៤-៦',
    icon: '📸',
    badge: 'ប្រើចលនាខ្លួនប្រាណ',
    gradient: 'from-blue-600 via-indigo-700 to-purple-600',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    description: 'ឆ្លើយសំណួរដោយការឈរនៅខាងឆ្វេង ឬខាងស្ដាំនៃកាមេរ៉ា! បទពិសោធន៍រៀនបែបថ្មីដោយប្រើចលនាខ្លួនប្រាណ។',
    actionType: 'modal_camera',
    playText: 'បើកកាមេរ៉ាលេង',
  },
  {
    id: 'math_speed',
    title: 'ប្រណាំងគណិតវិទ្យារហ័ស',
    subTitle: 'Math Speed Sprint',
    subject: 'គណិតវិទ្យា',
    subjectKey: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី ១-៦',
    icon: '⚡',
    badge: 'គណនា ៣០វិនាទី',
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    description: 'គណនាលេខបូក ដក គុណ ចែក ប្រណាំងជាមួយពេលវេលា ៣០ វិនាទី ដណ្តើមពិន្ទុខ្ពស់ និង Streak!',
    actionType: 'tab_games',
    playText: 'ចាប់ផ្តើមលេង',
  },
  {
    id: 'khmer_pairs',
    title: 'ផ្គូផ្គងពាក្យផ្ទុយ & សូរដូច',
    subTitle: 'Word Pairs Match',
    subject: 'ភាសាខ្មែរ',
    subjectKey: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី ២-៦',
    icon: '🧩',
    badge: 'ពាក្យផ្ទុយ & វេយ្យាករណ៍',
    gradient: 'from-purple-600 via-pink-600 to-rose-500',
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    description: 'ស្វែងរកគូពាក្យផ្ទុយ ពាក្យសូរដូច និងវេយ្យាករណ៍ខ្មែរ ដោយការបើកកាតផ្គូផ្គង បង្កើនការចងចាំ!',
    actionType: 'tab_games',
    playText: 'ចាប់ផ្តើមលេង',
  },
  {
    id: 'khmer_sentence',
    title: 'ល្បែងផ្គុំល្បះខ្មែរ',
    subTitle: 'Sentence Scramble Relay',
    subject: 'ភាសាខ្មែរ',
    subjectKey: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី ៤-៦',
    icon: '📝',
    badge: 'តែងល្បះ & វេយ្យាករណ៍',
    gradient: 'from-emerald-600 via-teal-600 to-emerald-500',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
    description: 'តម្រៀបពាក្យដែលច្របល់គ្នាឱ្យក្លាយជាល្បះត្រឹមត្រូវតាមក្បួនវេយ្យាករណ៍ និងអត្ថន័យពេញលេញ!',
    actionType: 'tab_games',
    playText: 'ចាប់ផ្តើមលេង',
  },
  {
    id: 'khmer_spelling',
    title: 'ប្រកួតអក្ខរាវិរុទ្ធខ្មែរ',
    subTitle: 'Khmer Spelling Bee',
    subject: 'ភាសាខ្មែរ',
    subjectKey: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី ៣-៦',
    icon: '👑',
    badge: 'វចនានុក្រម ជួន ណាត',
    gradient: 'from-amber-500 via-orange-600 to-red-500',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
    description: 'ជ្រើសរើសពាក្យដែលសរសេរត្រូវអក្ខរាវិរុទ្ធតាមវចនានុក្រមសម្តេចព្រះសង្ឃរាជ ជួន ណាត!',
    actionType: 'tab_games',
    playText: 'ចាប់ផ្តើមលេង',
  },
  {
    id: 'fishing_game',
    title: 'ល្បែងស្ទូចត្រីចំនេះដឹង',
    subTitle: 'Fishing Knowledge Quiz',
    subject: 'វិទ្យាសាស្ត្រ',
    subjectKey: 'វិទ្យាសាស្ត្រ',
    grade: 'ថ្នាក់ទី ៤-៦',
    icon: '🎣',
    badge: 'ស្ទូចត្រីឆ្លើយសំណួរ',
    gradient: 'from-sky-500 via-blue-600 to-teal-600',
    imageUrl: 'https://images.unsplash.com/photo-1502945015378-0e28404a5adc?q=80&w=800&auto=format&fit=crop',
    description: 'បោះសន្ទូចស្ទូចត្រីឆ្លើយសំណួរវិទ្យាសាស្ត្រ និងទូទៅ ដណ្តើមពានរង្វាន់ និងមេដាយកិត្តិយស!',
    actionType: 'modal_fishing',
    playText: 'ចូលលេងភ្លាមៗ',
  },
  {
    id: 'vijjanava_game',
    title: 'វិជ្ជានាវា៖ ល្បងប្រាជ្ញាចិន្តា',
    subTitle: 'Vijja Nava Educational Arcade',
    subject: 'គ្រប់មុខវិជ្ជា',
    subjectKey: 'all',
    grade: 'ថ្នាក់ទី ៦ (២០ មេរៀន)',
    icon: '👑',
    badge: 'Arcade អប់រំ',
    gradient: 'from-amber-500 via-yellow-600 to-amber-700',
    imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop',
    description: 'ហ្គេម Arcade បែបថ្មី! រុករកខ្លឹមសារគណិតវិទ្យាទាំង ២០ មេរៀន និងមុខវិជ្ជាផ្សេងៗទៀត តាមរយៈការចាប់ចម្លើយត្រឹមត្រូវ!',
    actionType: 'modal_vijjanava',
    playText: 'ចាប់ផ្តើមប្រកួត',
  },
  {
    id: 'english_fun',
    title: 'ល្បែងភាសាអង់គ្លេសបឋម',
    subTitle: 'English Fun Words',
    subject: 'ភាសាអង់គ្លេស',
    subjectKey: 'ភាសាអង់គ្លេស',
    grade: 'ថ្នាក់ទី ៤-៦',
    icon: '🔤',
    badge: 'វាក្យសព្ទ & រូបភាព',
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop',
    description: 'រៀនពាក្យអង់គ្លេសបឋមប្រចាំថ្ងៃ តាមរយៈការផ្គូផ្គងរូបភាព និងអត្ថន័យខ្មែរសប្បាយៗ!',
    actionType: 'modal_english',
    playText: 'ចូលលេងភ្លាមៗ',
  },
];

interface HomeTabProps {
  teacher: TeacherProfile;
  currentYear?: string;
  onOpenYearManager?: () => void;
  quizzes: Quiz[];
  activeSession: { pin: string; active: boolean; quizTitle: string; studentCount: number };
  onStartLiveSession: (quizTitle?: string) => void;
  onEndLiveSession: () => void;
  onPlayQuiz: (quiz: Quiz) => void;
  onOpenProfile: () => void;
  onNavigateTab: (tab: string) => void;
  onShowToast: (msg: string) => void;
  onOpenTeacherNotices?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  teacher,
  currentYear,
  onOpenYearManager,
  quizzes,
  activeSession,
  onStartLiveSession,
  onEndLiveSession,
  onPlayQuiz,
  onOpenProfile,
  onNavigateTab,
  onShowToast,
  onOpenTeacherNotices,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const topCardsCarouselRef = useRef<HTMLDivElement>(null);
  const subjectFilterRef = useRef<HTMLDivElement>(null);
  const toggleButtonsRef = useRef<HTMLDivElement>(null);

  const [activeSlideSessions, setActiveSlideSessions] = useState<ActiveSessionInfo[]>([]);
  const [isDecorModalOpen, setIsDecorModalOpen] = useState(false);
  const [activeContentType, setActiveContentType] = useState<'interactive_lessons' | 'exams' | 'summaries' | 'games'>('interactive_lessons');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [readingSummary, setReadingSummary] = useState<SubjectLessonSummary | null>(null);
  const [selectedMathLessonNumber, setSelectedMathLessonNumber] = useState<number>(1);
  const [isMathInteractiveModalOpen, setIsMathInteractiveModalOpen] = useState<boolean>(false);
  const [isMathLesson1Open, setIsMathLesson1Open] = useState<boolean>(false);
  const [isMathLesson1ExamOpen, setIsMathLesson1ExamOpen] = useState<boolean>(false);
  const [isMathLessonExamOpen, setIsMathLessonExamOpen] = useState<boolean>(false);
  const [isHealthInteractiveOpen, setIsHealthInteractiveOpen] = useState<boolean>(false);
  const [isHealthExamOpen, setIsHealthExamOpen] = useState<boolean>(false);
  const [selectedHealthLessonNumber, setSelectedHealthLessonNumber] = useState<number>(1);
  const [selectedHealthSectionIndex, setSelectedHealthSectionIndex] = useState<number>(0);
  const [isEnglishInteractiveOpen, setIsEnglishInteractiveOpen] = useState<boolean>(false);
  const [isEnglishExamOpen, setIsEnglishExamOpen] = useState<boolean>(false);
  const [selectedEnglishUnitIndex, setSelectedEnglishUnitIndex] = useState<number>(0);
  const [showFishingGameModal, setShowFishingGameModal] = useState<boolean>(false);
  const [showVijjaNavaGameModal, setShowVijjaNavaGameModal] = useState<boolean>(false);
  const [showEnglishGameModal, setShowEnglishGameModal] = useState<boolean>(false);
  const [showCameraQuizModal, setShowCameraQuizModal] = useState<boolean>(false);
  const [showScienceLessonModal, setShowScienceLessonModal] = useState<boolean>(false);
  const [isCreatingLiveRoom, setIsCreatingLiveRoom] = useState<boolean>(false);
  const [selectedLiveSubject, setSelectedLiveSubject] = useState<'all' | 'math' | 'khmer' | 'science' | 'social' | 'english'>('all');

  // PDF Book Customization state
  const [isPdfBookModalOpen, setIsPdfBookModalOpen] = useState(false);
  const [selectedQuizForPdf, setSelectedQuizForPdf] = useState<Quiz | null>(null);

  // Ensure English Grade 6 40Q Exam, Health Education 40Q Exams, and Math Lessons 1 to 20 40Q Exams are always present in Subject Exams (វិញ្ញាសាតាមមុខវិជ្ជា)
  const effectiveQuizzes = React.useMemo(() => {
    const list = [...quizzes];

    // 1. Ensure English Grade 6 40-Question Exam is always present
    const english40 = initialQuizzes.find((q) => q.id === 'quiz-english-comprehensive-40q');
    if (english40 && !list.some((q) => q.id === english40.id || (q.subject === 'ភាសាអង់គ្លេស' && q.questionCount === 40))) {
      list.unshift(english40);
    }

    // 2. Ensure Health Education Comprehensive 40-Question Exam is always present
    const health40 = initialQuizzes.find((q) => q.id === 'quiz-health-comprehensive-40q');
    if (health40 && !list.some((q) => q.id === health40.id || (q.subject === 'អប់រំសុខភាព' && q.questionCount === 40))) {
      list.unshift(health40);
    }

    // 3. Ensure Health Lessons 1 to 4 40Q Exams are present
    const healthItems = ALL_HEALTH_LESSONS_PACKAGES.map((p) => p.quizItem);
    for (let i = healthItems.length - 1; i >= 0; i--) {
      const item = healthItems[i];
      if (!list.some((q) => q.id === item.id || q.title === item.title)) {
        list.unshift(item);
      }
    }

    // 4. Ensure Math Lessons 1 to 20 40Q Exams are present
    const mathItems = getAllMathLessonQuizItems();
    for (let i = mathItems.length - 1; i >= 0; i--) {
      const item = mathItems[i];
      if (!list.some((q) => q.id === item.id || q.title === item.title)) {
        list.unshift(item);
      }
    }

    return list;
  }, [quizzes]);

  const handleLaunchGame = (game: HomeStudyGame) => {
    if (game.actionType === 'modal_fishing') {
      setShowFishingGameModal(true);
    } else if (game.actionType === 'modal_vijjanava') {
      setShowVijjaNavaGameModal(true);
    } else if (game.actionType === 'modal_english') {
      setShowEnglishGameModal(true);
    } else if (game.actionType === 'modal_camera') {
      setShowCameraQuizModal(true);
    } else {
      onNavigateTab('games');
    }
  };

  // Drag & Swipe states for Content Toggle Buttons (Exams, Summaries, Games)
  const [isToggleDragging, setIsToggleDragging] = useState(false);
  const [toggleStartX, setToggleStartX] = useState(0);
  const [toggleScrollLeft, setToggleScrollLeft] = useState(0);
  const [hasToggleDragged, setHasToggleDragged] = useState(false);

  const handleToggleMouseDown = (e: React.MouseEvent) => {
    if (!toggleButtonsRef.current) return;
    setIsToggleDragging(true);
    setHasToggleDragged(false);
    setToggleStartX(e.pageX - toggleButtonsRef.current.offsetLeft);
    setToggleScrollLeft(toggleButtonsRef.current.scrollLeft);
  };

  const handleToggleMouseMove = (e: React.MouseEvent) => {
    if (!isToggleDragging || !toggleButtonsRef.current) return;
    e.preventDefault();
    const x = e.pageX - toggleButtonsRef.current.offsetLeft;
    const walk = (x - toggleStartX) * 1.5;
    if (Math.abs(walk) > 4) {
      setHasToggleDragged(true);
    }
    toggleButtonsRef.current.scrollLeft = toggleScrollLeft - walk;
  };

  const handleToggleMouseUp = () => {
    setIsToggleDragging(false);
  };

  // Drag & Swipe states for Cards Carousel (Quizzes, Summaries, Games)
  const [isCarouselDragging, setIsCarouselDragging] = useState(false);
  const [carouselStartX, setCarouselStartX] = useState(0);
  const [carouselScrollLeft, setCarouselScrollLeft] = useState(0);
  const [hasCarouselDragged, setHasCarouselDragged] = useState(false);

  const handleCarouselMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsCarouselDragging(true);
    setHasCarouselDragged(false);
    setCarouselStartX(e.pageX - carouselRef.current.offsetLeft);
    setCarouselScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleCarouselMouseMove = (e: React.MouseEvent) => {
    if (!isCarouselDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - carouselStartX) * 1.5;
    if (Math.abs(walk) > 4) {
      setHasCarouselDragged(true);
    }
    carouselRef.current.scrollLeft = carouselScrollLeft - walk;
  };

  const handleCarouselMouseUp = () => {
    setIsCarouselDragging(false);
  };

  // Drag & Swipe states for Top Cards Carousel
  const [isTopCardsDragging, setIsTopCardsDragging] = useState(false);
  const [topCardsStartX, setTopCardsStartX] = useState(0);
  const [topCardsScrollLeft, setTopCardsScrollLeft] = useState(0);
  const [hasTopCardsDragged, setHasTopCardsDragged] = useState(false);

  const handleTopCardsMouseDown = (e: React.MouseEvent) => {
    if (!topCardsCarouselRef.current) return;
    setIsTopCardsDragging(true);
    setHasTopCardsDragged(false);
    setTopCardsStartX(e.pageX - topCardsCarouselRef.current.offsetLeft);
    setTopCardsScrollLeft(topCardsCarouselRef.current.scrollLeft);
  };

  const handleTopCardsMouseMove = (e: React.MouseEvent) => {
    if (!isTopCardsDragging || !topCardsCarouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - topCardsCarouselRef.current.offsetLeft;
    const walk = (x - topCardsStartX) * 1.5;
    if (Math.abs(walk) > 4) {
      setHasTopCardsDragged(true);
    }
    topCardsCarouselRef.current.scrollLeft = topCardsScrollLeft - walk;
  };

  const handleTopCardsMouseUp = () => {
    setIsTopCardsDragging(false);
  };

  // Drag & Swipe states for Subject Filter
  const [isSubjectDragging, setIsSubjectDragging] = useState(false);
  const [subjectStartX, setSubjectStartX] = useState(0);
  const [subjectScrollLeft, setSubjectScrollLeft] = useState(0);
  const [hasSubjectDragged, setHasSubjectDragged] = useState(false);

  const scrollSubjectPills = (direction: 'left' | 'right') => {
    if (!subjectFilterRef.current) return;
    const amount = 220;
    subjectFilterRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const handleSubjectMouseDown = (e: React.MouseEvent) => {
    if (!subjectFilterRef.current) return;
    setIsSubjectDragging(true);
    setHasSubjectDragged(false);
    setSubjectStartX(e.pageX - subjectFilterRef.current.offsetLeft);
    setSubjectScrollLeft(subjectFilterRef.current.scrollLeft);
  };

  const handleSubjectMouseMove = (e: React.MouseEvent) => {
    if (!isSubjectDragging || !subjectFilterRef.current) return;
    e.preventDefault();
    const x = e.pageX - subjectFilterRef.current.offsetLeft;
    const walk = (x - subjectStartX) * 1.5;
    if (Math.abs(walk) > 4) {
      setHasSubjectDragged(true);
    }
    subjectFilterRef.current.scrollLeft = subjectScrollLeft - walk;
  };

  const handleSubjectMouseUp = () => {
    setIsSubjectDragging(false);
  };

  useEffect(() => {
    const fetchActive = async () => {
      const list = await getActiveSlideSessions();
      setActiveSlideSessions(list);
    };
    fetchActive();
    const interval = setInterval(fetchActive, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const amount = 320;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const scrollTopCards = (direction: 'left' | 'right') => {
    if (!topCardsCarouselRef.current) return;
    const amount = 380;
    topCardsCarouselRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-6">
      {/* ផ្ទាំងរចនាបទរស្មីថ្ងៃរះ & មាសរាជវាំង (Palace Sunrise Dashboard Hero - matching user design) */}
      <TeacherPalaceDashboardHero
        teacher={teacher}
        currentYear={currentYear}
        onOpenProfile={onOpenProfile}
        onNavigateTab={onNavigateTab}
        onShowToast={onShowToast}
        onOpenYearManager={onOpenYearManager}
        onOpenNotices={onOpenTeacherNotices}
      />

      {/* ផ្ទាំងសេចក្តីណែនាំផ្សេងៗ (Horizontal Swipeable Carousel with Subtle Surrounding Border) */}
      <section className="relative overflow-hidden rounded-[28px] border border-indigo-200/90 dark:border-indigo-800/60 bg-gradient-to-b from-indigo-50/25 via-white to-slate-50/30 dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex justify-between items-center bg-white/95 dark:bg-slate-800/90 px-3.5 py-2.5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-800/40 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-black text-slate-900 dark:text-white text-sm sm:text-base tracking-tight flex items-center gap-2">
                <span>សេចក្តីណែនាំផ្សេងៗ</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200/60">
                  ព័ត៌មាន & បទដ្ឋាន
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                សេចក្តីណែនាំផ្លូវការ • ប្រមូលស្ថិតិ EMIS • ឈប់សម្រាក ២០២៧
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollTopCards('left')}
              className="p-1.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700 rounded-xl transition shadow-2xs active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTopCards('right')}
              className="p-1.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700 rounded-xl transition shadow-2xs active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={topCardsCarouselRef}
          onMouseDown={handleTopCardsMouseDown}
          onMouseMove={handleTopCardsMouseMove}
          onMouseUp={handleTopCardsMouseUp}
          onMouseLeave={handleTopCardsMouseUp}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-0.5 select-none cursor-grab active:cursor-grabbing touch-pan-x"
        >
          {/* Card 1: ផ្ទាំង ១. ដំណើរការបឋមសិក្សា (🌐) */}
          <MoeysGuidelineCard
            variant="carousel"
            onShowToast={onShowToast}
          />

          {/* Card 2: ផ្ទាំង ២. ប្រមូលស្ថិតិ EMIS (ថ្មី) (🏛️) */}
          <MoeysStatsGuidelineCard
            variant="carousel"
            onShowToast={onShowToast}
          />

          {/* Card 3: ផ្ទាំង ៣. ឈប់សម្រាកមន្ត្រីរាជការ ២០២៧ */}
          <CivilServantHolidaysCard
            variant="carousel"
            onShowToast={onShowToast}
          />


          {/* Card 4: ផ្ទាំងស្រង់វត្តមានសិស្សតាម PLP (Clean Minimal Card with subtle border) */}
          <div className="min-w-[210px] sm:min-w-[230px] md:min-w-[240px] max-w-[250px] shrink-0 snap-start bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-3 sm:p-3.5 shadow-xs border border-emerald-200/90 dark:border-emerald-700/60 hover:border-emerald-400 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 min-h-[195px]">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
               <img src="https://img.freepik.com/free-vector/hand-drawn-back-school-background_23-2149028211.jpg" alt="Decoration" className="w-full h-full object-cover" />
            </div>
            
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wide block leading-none">
                      PLP SMS
                    </span>
                    <span className="text-[8px] text-slate-500 font-bold block leading-tight">
                      System Portal
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>វត្តមាន</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-[13px] text-slate-800 dark:text-white font-moul leading-snug tracking-wide line-clamp-2">
                  ចូលយកវត្តមានផ្ទាល់ខ្លួនតាម PLP
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                  plp-sms.moeys.gov.kh
                </p>
              </div>

              {/* Illustration Image Area */}
              <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50">
                 <img src="https://img.freepik.com/free-photo/young-man-working-office-with-laptop_23-2148759085.jpg" alt="Attendance" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 relative z-10">
              <a
                href="https://plp-sms.moeys.gov.kh/my-attendance"
                target="_blank"
                rel="noreferrer"
                className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-sm transition active:scale-95 flex items-center justify-center gap-1"
              >
                <Globe className="w-3.5 h-3.5 text-white" />
                <span>ចូលយកវត្តមានតាម PLP</span>
              </a>
            </div>
          </div>

          {/* Card 5: ផ្ទាំងកាលវិភាគបង្រៀនប្រចាំសប្តាហ៍ (Clean Minimal Card with subtle border) */}
          <div className="min-w-[210px] sm:min-w-[230px] md:min-w-[240px] max-w-[250px] shrink-0 snap-start bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-3 sm:p-3.5 shadow-xs border border-violet-200/90 dark:border-violet-700/60 hover:border-violet-400 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 min-h-[195px]">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
               <img src="https://img.freepik.com/free-vector/calendar-concept-illustration_114360-1122.jpg" alt="Decoration" className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wide block leading-none">
                      កាលវិភាគ
                    </span>
                    <span className="text-[8px] text-slate-500 font-bold block leading-tight">
                      បឋមសិក្សា
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-extrabold text-[9px] border border-amber-200">
                  <span>ថ្នាក់ទី ៤-៦</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-[13px] text-slate-800 dark:text-white font-moul leading-snug tracking-wide line-clamp-2">
                  កាលវិភាគប្រចាំសប្តាហ៍ ថ្នាក់ទី ៤-៦
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                  បឋមសិក្សាអូរស្វាយកណ្តាល
                </p>
              </div>

              {/* Illustration Image Area */}
              <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50">
                 <img src="https://img.freepik.com/free-photo/still-life-with-school-supplies_23-2148604085.jpg" alt="Timetable" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 relative z-10">
              <button
                onClick={() => {
                  try {
                    sessionStorage.setItem('target_admin_section', JSON.stringify({ main: 'sec2', sub: 'timetable' }));
                  } catch (e) {}
                  onNavigateTab('admin');
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-[11px] shadow-sm transition active:scale-95 flex items-center justify-center gap-1 border border-indigo-300/40"
              >
                <span>ពិនិត្យកាលវិភាគ</span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-200" />
              </button>
            </div>
          </div>

          {/* Card 6: ផ្ទាំងតេឡេបញ្ជាស្លាយពីទូរស័ព្ទ (Smart Slide Remote QR Card) */}
          <div className="min-w-[210px] sm:min-w-[230px] md:min-w-[240px] max-w-[250px] shrink-0 snap-start bg-gradient-to-br from-[#451A03] via-[#1C0A00] to-[#0A0400] text-white rounded-2xl p-3 sm:p-3.5 shadow-sm border border-amber-400/60 dark:border-amber-600/60 hover:border-amber-400 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 min-h-[195px]">
            {/* Tech Matrix Grid */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(rgba(251, 191, 36, 0.4) 1px, transparent 1px)`,
                backgroundSize: '12px 12px'
              }}
            />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/25 transition-all duration-500" />
            
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 p-[1.5px] shadow-sm flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center text-xs text-amber-400 shadow-inner">
                      <Smartphone className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-amber-300 uppercase tracking-wide block leading-none">
                      REMOTE
                    </span>
                    <span className="text-[8px] text-amber-200/80 font-bold block leading-tight">
                      តេឡេបញ្ជា
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-amber-400/50 bg-amber-950/80 text-amber-300 font-extrabold text-[9px] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>SMART</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-[13px] text-white font-moul leading-snug tracking-wide line-clamp-2">
                  តេឡេបញ្ជាស្លាយទូរស័ព្ទ
                </h3>
                <p className="text-[10px] text-amber-200/80 mt-0.5 leading-tight line-clamp-1">
                  ស្កែន QR កូដ ឬបញ្ចូលលេខ PIN
                </p>
              </div>

              {/* Quick Chip */}
              <div className="flex items-center gap-1 text-[9px] text-amber-200/90 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                <span>📱</span>
                <span className="truncate">បញ្ជាស្លាយពីទូរស័ព្ទដៃ</span>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-500/20 relative z-10">
              <button
                onClick={() => onNavigateTab('remote')}
                className="w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-[11px] shadow-sm transition active:scale-95 flex items-center justify-center gap-1 border border-amber-200"
              >
                <Camera className="w-3.5 h-3.5 text-slate-950" />
                <span>បើកតេឡេបញ្ជា</span>
              </button>
            </div>
          </div>

          {/* Card 7: ការរៀបចំថ្នាក់ (Classroom Organization with subtle border) */}
          <div className="min-w-[210px] sm:min-w-[230px] md:min-w-[240px] max-w-[250px] shrink-0 snap-start bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-3 sm:p-3.5 shadow-xs border border-sky-200/90 dark:border-sky-700/60 hover:border-sky-400 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 min-h-[195px]">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
               <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop" alt="Decoration" className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Shapes className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-wide block leading-none">
                      រៀបចំថ្នាក់
                    </span>
                    <span className="text-[8px] text-slate-500 font-bold block leading-tight">
                      Classroom Set
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-[9px] border border-blue-200">
                  <span>រៀបរយ</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-[13px] text-slate-800 dark:text-white font-moul leading-snug tracking-wide line-clamp-2">
                  ការរៀបចំថ្នាក់រៀនឱ្យមានសណ្តាប់ធ្នាប់
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                  ប្លង់តុ, បទបញ្ជា, សារពើភណ្ឌ
                </p>
              </div>

              <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50">
                 <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop" alt="Classroom" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 relative z-10">
              <button
                onClick={() => {
                  try {
                    sessionStorage.setItem('target_admin_section', JSON.stringify({ main: 'sec3', sub: 'committee' }));
                  } catch (e) {}
                  onNavigateTab('admin');
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] shadow-sm transition active:scale-95 flex items-center justify-center gap-1"
              >
                <span>ចូលទៅរៀបចំថ្នាក់</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 8: ស្វ័យសិក្សា (Self-Study with subtle teal border) */}
          <div className="min-w-[210px] sm:min-w-[230px] md:min-w-[240px] max-w-[250px] shrink-0 snap-start bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl p-3 sm:p-3.5 shadow-xs border border-teal-200/90 dark:border-teal-700/60 hover:border-teal-400 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 min-h-[195px]">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
               <img src="https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=800&auto=format&fit=crop" alt="Decoration" className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-purple-600 uppercase tracking-wide block leading-none">
                      ស្វ័យសិក្សា
                    </span>
                    <span className="text-[8px] text-slate-500 font-bold block leading-tight">
                      Independent
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-extrabold text-[9px] border border-purple-200">
                  <span>PLP EdTech</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-[13px] text-slate-800 dark:text-white font-moul leading-snug tracking-wide line-clamp-2">
                  ស្វ័យសិក្សា និងការអនុវត្តដោយឯករាជ្យ
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                  វគ្គសិក្សាស្វ័យសិក្សា MoEYS
                </p>
              </div>

              <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50">
                 <img src="https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=800&auto=format&fit=crop" alt="Self Study" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 relative z-10">
              <button
                onClick={() => {
                  try {
                    sessionStorage.setItem('target_admin_section', JSON.stringify({ main: 'sec4', sub: 'self_study' }));
                  } catch (e) {}
                  onNavigateTab('admin');
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-black text-[11px] shadow-sm transition active:scale-95 flex items-center justify-center gap-1"
              >
                <span>ចូលទៅស្វ័យសិក្សា</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ACTIVE SLIDE DISCOVERY BANNER ON HOME SCREEN ================= */}
      {activeSlideSessions.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-900/95 to-amber-950/90 border-2 border-amber-400/60 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black">
                  🟢 កំពុងចាក់ស្លាយលើ PC
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  {activeSlideSessions[0].sessionId}
                </span>
              </div>
              <h3 className="text-sm font-black text-white truncate max-w-xs sm:max-w-md">
                {activeSlideSessions[0].lessonTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('remote')}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-2xl transition shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 border border-amber-300 shrink-0"
          >
            <Smartphone className="w-4 h-4" />
            <span>ភ្ជាប់បញ្ជាស្លាយនេះភ្លាម</span>
          </button>
        </div>
      )}

      {/* ផ្នែកទី១៖ សកម្មភាពបច្ចុប្បន្ន (Active Live Session) */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">
              <Flame className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-slate-800 text-base">សកម្មភាពបច្ចុប្បន្ន (Live Session)</h2>
          </div>
          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs text-purple-800 font-bold hover:underline"
          >
            មើលទាំងអស់
          </button>
        </div>

        <div className="bg-white border-2 border-dashed border-purple-200 rounded-3xl p-6 text-center shadow-xs transition hover:border-purple-400">
          {!activeSession.active ? (
            isCreatingLiveRoom ? (
              <div className="text-left space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-purple-950 font-moul">បង្កើតបន្ទប់ប្រឡងផ្ទាល់ (Live PIN)</h3>
                      <p className="text-[11px] text-slate-500">សូមជ្រើសរើសវិញ្ញាសាដែលមានស្រាប់តាមមុខវិជ្ជាដើម្បីចាប់ផ្តើមលេង</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCreatingLiveRoom(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-600 transition"
                  >
                    ត្រឡប់ក្រោយ
                  </button>
                </div>

                {/* Horizontal Subject Tabs Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {[
                    { id: 'all', label: 'ទាំងអស់ 📚' },
                    { id: 'math', label: 'គណិតវិទ្យា 🔢' },
                    { id: 'khmer', label: 'ភាសាខ្មែរ 📕' },
                    { id: 'science', label: 'វិទ្យាសាស្ត្រ 🧪' },
                    { id: 'social', label: 'សិក្សាសង្គម 🌍' },
                    { id: 'english', label: 'ភាសាអង់គ្លេស 🇬🇧' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedLiveSubject(sub.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                        selectedLiveSubject === sub.id
                          ? 'bg-purple-950 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>

                {/* Quiz Grid matching selected filter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
                  {effectiveQuizzes.filter((q) => {
                    const sub = q.subject?.toLowerCase() || '';
                    if (selectedLiveSubject === 'all') return true;
                    if (selectedLiveSubject === 'math') return sub.includes('math') || sub.includes('គណិត');
                    if (selectedLiveSubject === 'khmer') return sub.includes('khmer') || sub.includes('ខ្មែរ');
                    if (selectedLiveSubject === 'science') return sub.includes('science') || sub.includes('វិទ្យា');
                    if (selectedLiveSubject === 'social') return sub.includes('social') || sub.includes('សង្គម');
                    if (selectedLiveSubject === 'english') return sub.includes('english') || sub.includes('អង់គ្លេស');
                    return false;
                  }).length === 0 ? (
                    <div className="col-span-full text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl">
                      មិនមានវិញ្ញាសាក្នុងប្រភេទមុខវិជ្ជានេះទេ
                    </div>
                  ) : (
                    effectiveQuizzes.filter((q) => {
                      const sub = q.subject?.toLowerCase() || '';
                      if (selectedLiveSubject === 'all') return true;
                      if (selectedLiveSubject === 'math') return sub.includes('math') || sub.includes('គណិត');
                      if (selectedLiveSubject === 'khmer') return sub.includes('khmer') || sub.includes('ខ្មែរ');
                      if (selectedLiveSubject === 'science') return sub.includes('science') || sub.includes('វិទ្យា');
                      if (selectedLiveSubject === 'social') return sub.includes('social') || sub.includes('សង្គម');
                      if (selectedLiveSubject === 'english') return sub.includes('english') || sub.includes('អង់គ្លេស');
                      return false;
                    }).map((q) => (
                      <div
                        key={q.id}
                        className="p-3 bg-purple-50/40 hover:bg-purple-50 rounded-2xl border border-purple-100/80 flex flex-col justify-between gap-2.5 transition text-left"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[9px] font-bold text-purple-700">
                            <span>{q.subject} &bull; {q.grade || 'ថ្នាក់ទី៦'}</span>
                            <span className="bg-purple-100 px-1.5 py-0.5 rounded-md font-mono">{q.questions?.length || 0} សំណួរ</span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-800 line-clamp-2 mt-1 leading-relaxed">
                            {q.title}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingLiveRoom(false);
                            onStartLiveSession(q.title);
                          }}
                          className="w-full py-1.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>បង្កើត Game PIN & លេង</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="py-2">
                <div className="w-16 h-16 mx-auto mb-3 bg-purple-50 text-purple-800 rounded-2xl flex items-center justify-center shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">មិនទាន់មានការប្រឡងផ្ទាល់កំពុងដំណើរការទេ</h3>
                <p className="text-xs text-slate-500 mt-1">
                  ចុចប៊ូតុងខាងក្រោមដើម្បីជ្រើសរើសវិញ្ញាសា និងបង្កើត Game PIN ឲ្យសិស្សចូលរួមលេង
                </p>
                <button
                  onClick={() => setIsCreatingLiveRoom(true)}
                  className="mt-4 px-5 py-2.5 bg-purple-900 text-white rounded-2xl text-xs font-bold hover:bg-purple-800 transition shadow-md shadow-purple-900/20 active:scale-95 inline-flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> បង្កើតបន្ទប់ប្រឡងផ្ទាល់ (Live PIN)
                </button>
              </div>
            )
          ) : (
            <div className="text-left bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping"></span> កំពុងប្រឡងផ្ទាល់
                </span>
                <span className="text-xs opacity-90">
                  GAME PIN:{' '}
                  <strong className="text-yellow-300 text-base font-black tracking-widest font-kahoot ml-1">
                    {activeSession.pin}
                  </strong>
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1 mt-2">{activeSession.quizTitle}</h3>
              <div className="flex justify-between items-center text-xs opacity-90 mt-4 pt-3 border-t border-purple-800/80">
                <span className="font-bold text-amber-300">
                  👨‍🎓 សិស្សចូលរួម: {activeSession.studentCount} នាក់
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const matched = quizzes.find((q) => q.title === activeSession.quizTitle) || quizzes[0];
                      onPlayQuiz(matched);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> បើកផ្ទាំងលេង
                  </button>
                  <button
                    onClick={onEndLiveSession}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    បញ្ចប់ការប្រឡង
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ផ្នែកទី២៖ ប៊ូតុង វិញ្ញាសាតាមមុខវិជ្ជា និង ប៊ូតុង មេរៀនសង្ខេប (Horizontal Swipeable Carousel) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main Toggle Buttons (Draggable and swipeable horizontally on all screens) */}
          <div className="flex items-center gap-2 max-w-full overflow-hidden">
            <div
              ref={toggleButtonsRef}
              onMouseDown={handleToggleMouseDown}
              onMouseMove={handleToggleMouseMove}
              onMouseUp={handleToggleMouseUp}
              onMouseLeave={handleToggleMouseUp}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 select-none cursor-grab active:cursor-grabbing touch-pan-x scroll-smooth max-w-full"
            >
              <button
                onClick={() => {
                  if (!hasToggleDragged) {
                    setActiveContentType('interactive_lessons');
                    setSelectedSubjectFilter('all');
                  }
                }}
                className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 ${
                  activeContentType === 'interactive_lessons'
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-emerald-600/20 ring-2 ring-emerald-400/40'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>មេរៀនអន្តរកម្ម (២០ មេរៀន)</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeContentType === 'interactive_lessons' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  20
                </span>
              </button>

              <button
                onClick={() => {
                  if (!hasToggleDragged) {
                    setActiveContentType('exams');
                    setSelectedSubjectFilter('all');
                  }
                }}
                className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 ${
                  activeContentType === 'exams'
                    ? 'bg-purple-900 text-white shadow-purple-900/20 ring-2 ring-purple-500/40'
                    : 'bg-white hover:bg-purple-50 text-slate-700 border border-slate-200'
                }`}
              >
                <FileQuestion className="w-4 h-4 text-amber-400" />
                <span>វិញ្ញាសាតាមមុខវិជ្ជា</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeContentType === 'exams' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-900'
                }`}>
                  {effectiveQuizzes.length}
                </span>
              </button>

              <button
                onClick={() => {
                  if (!hasToggleDragged) {
                    setActiveContentType('summaries');
                    setSelectedSubjectFilter('all');
                  }
                }}
                className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 ${
                  activeContentType === 'summaries'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/20 ring-2 ring-amber-500/40'
                    : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4 text-yellow-300" />
                <span>មេរៀនសង្ខេប</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeContentType === 'summaries' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                }`}>
                  {GRADE_6_SUBJECT_SUMMARIES.length}
                </span>
              </button>

              <button
                onClick={() => {
                  if (!hasToggleDragged) {
                    setActiveContentType('games');
                    setSelectedSubjectFilter('all');
                  }
                }}
                className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 ${
                  activeContentType === 'games'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-600/20 ring-2 ring-emerald-400/40'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <span>ល្បែងសិក្សា</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeContentType === 'games' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {HOME_STUDY_GAMES.length}
                </span>
              </button>
            </div>
          </div>

          {/* Carousel Arrows and View All */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2 bg-white hover:bg-purple-50 text-purple-900 border border-slate-200 rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2 bg-white hover:bg-purple-50 text-purple-900 border border-slate-200 rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (activeContentType === 'exams') {
                  onNavigateTab('library');
                } else if (activeContentType === 'summaries') {
                  onNavigateTab('student_portal');
                } else {
                  onNavigateTab('games');
                }
              }}
              className="text-xs text-purple-800 font-bold hover:underline ml-1 cursor-pointer"
            >
              មើលទាំងអស់
            </button>
          </div>
        </div>

        {/* Subject Filter Pills - Draggable / Swipeable Left & Right with Arrow Navigation */}
        <div className="relative group/subj flex items-center gap-1.5 w-full">
          {/* Left Arrow Button for Quick Scroll */}
          <button
            onClick={() => scrollSubjectPills('left')}
            className="flex items-center justify-center w-7 h-7 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 shadow-xs shrink-0 cursor-pointer transition active:scale-95 z-10"
            title="អូសទៅឆ្វេង"
            aria-label="Scroll subjects left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Swipeable & Draggable Container */}
          <div
            ref={subjectFilterRef}
            onMouseDown={handleSubjectMouseDown}
            onMouseMove={handleSubjectMouseMove}
            onMouseUp={handleSubjectMouseUp}
            onMouseLeave={handleSubjectMouseUp}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 w-full select-none cursor-grab active:cursor-grabbing touch-pan-x"
          >
            {[
              { id: 'all', label: 'ទាំងអស់', icon: '✨' },
              { id: 'ភាសាខ្មែរ', label: 'ភាសាខ្មែរ', icon: '🇰🇭' },
              { id: 'គណិតវិទ្យា', label: 'គណិតវិទ្យា', icon: '📐' },
              { id: 'វិទ្យាសាស្ត្រ', label: 'វិទ្យាសាស្ត្រ', icon: '🔬' },
              { id: 'សិក្សាសង្គម', label: 'សិក្សាសង្គម', icon: '🏛️' },
              { id: 'អប់រំសុខភាព', label: 'អប់រំសុខភាព', icon: '🏥' },
              { id: 'ភាសាអង់គ្លេស', label: 'ភាសាអង់គ្លេស', icon: '🔤' },
            ].map((sub) => {
              const isSelected = selectedSubjectFilter === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    if (!hasSubjectDragged) {
                      setSelectedSubjectFilter(sub.id);
                    }
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs active:scale-95 ${
                    isSelected
                      ? activeContentType === 'exams'
                        ? 'bg-purple-900 text-white shadow-purple-900/20 ring-2 ring-purple-400/40'
                        : activeContentType === 'summaries'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/20 ring-2 ring-amber-400/40'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm">{sub.icon}</span>
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button for Quick Scroll */}
          <button
            onClick={() => scrollSubjectPills('right')}
            className="flex items-center justify-center w-7 h-7 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 shadow-xs shrink-0 cursor-pointer transition active:scale-95 z-10"
            title="អូសទៅស្តាំ"
            aria-label="Scroll subjects right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Content */}
        {activeContentType === 'interactive_lessons' ? (
          <div
            ref={carouselRef}
            onMouseDown={handleCarouselMouseDown}
            onMouseMove={handleCarouselMouseMove}
            onMouseUp={handleCarouselMouseUp}
            onMouseLeave={handleCarouselMouseUp}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 select-none cursor-grab active:cursor-grabbing touch-pan-x"
          >
            {/* Health Education Interactive Cards */}
            {(selectedSubjectFilter === 'all' || selectedSubjectFilter === 'អប់រំសុខភាព') && (
              <>
                {/* Master Health Education Card */}
                <div
                  key="health-master"
                  className="min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-emerald-300 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 overflow-hidden bg-gradient-to-tr from-emerald-800 via-teal-700 to-cyan-800">
                      <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600"
                        alt="អប់រំសុខភាព ថ្នាក់ទី៦"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg">
                          🏥
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider">
                          MoEYS ថ្នាក់ទី ៦
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1">
                          អប់រំសុខភាព ឌីជីថលអន្តរកម្ម
                        </h3>
                        <p className="text-[10px] text-teal-200 mt-0.5 font-bold drop-shadow-sm">
                          ៤ សមាសភាគ &bull; ១៩ មេរៀន &bull; ៤០ សំណួរ QCM
                        </p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]">
                        ខ្លឹមសារមេរៀនអន្តរកម្មពេញលេញ សុខភាពបឋម សុខភាពផ្លូវចិត្ត សុខភាពបន្តពូជ និងការសង្គ្រោះបឋម ព្រមទាំងឧបករណ៍ពិសោធន៍ឌីជីថល។
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-emerald-900 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                        <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5 text-amber-500" /> រៀនអន្តរកម្ម</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1"><Layers className="w-2.5 h-2.5 text-teal-600" /> ពិសោធន៍ឌីជីថល</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-emerald-800"><Award className="w-2.5 h-2.5 text-emerald-600" /> ៤០ QCM ពេញលេញ</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        if (!hasCarouselDragged) {
                          setSelectedHealthSectionIndex(0);
                          setIsHealthInteractiveOpen(true);
                        }
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-xl font-bold text-[11px] hover:from-emerald-500 hover:to-teal-600 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>រៀនអន្តរកម្ម</span>
                    </button>
                    <button
                      onClick={() => {
                        if (!hasCarouselDragged) {
                          setSelectedHealthLessonNumber(0);
                          setIsHealthExamOpen(true);
                        }
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-xl font-bold text-[11px] hover:from-slate-800 hover:to-emerald-900 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-500/20"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>ប្រឡង ៤០ QCM</span>
                    </button>
                  </div>
                </div>

                {/* 4 Health Education Sections */}
                {HEALTH_EDUCATION_SECTIONS.map((sec, secIdx) => (
                  <div
                    key={sec.id}
                    className="min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between"
                  >
                    <div>
                      <div className={`relative h-40 overflow-hidden bg-gradient-to-tr ${sec.gradient}`}>
                        {sec.image && (
                          <img
                            src={sec.image}
                            alt={sec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent" />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg">
                            {sec.icon}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-white border border-white/20">
                            {sec.badge}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1">
                            {sec.title}
                          </h3>
                          <p className="text-[10px] text-teal-200 mt-0.5 font-semibold drop-shadow-sm line-clamp-1">
                            {sec.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]">
                          {sec.lessons.map((l) => l.title.replace(/^មេរៀនទី\d+\s*៖\s*/, '')).join(', ')}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-teal-900 bg-teal-50/70 p-2 rounded-xl border border-teal-100">
                          <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5 text-amber-500" /> {sec.lessons.length} មេរៀន</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1"><Layers className="w-2.5 h-2.5 text-teal-600" /> ចំណុចគន្លឹះ</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1 text-emerald-800"><Award className="w-2.5 h-2.5 text-emerald-600" /> ៤០ QCM</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          if (!hasCarouselDragged) {
                            setSelectedHealthSectionIndex(secIdx);
                            setIsHealthInteractiveOpen(true);
                          }
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white rounded-xl font-bold text-[11px] hover:from-teal-500 hover:to-emerald-600 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>រៀនអន្តរកម្ម</span>
                      </button>
                      <button
                        onClick={() => {
                          if (!hasCarouselDragged) {
                            setSelectedHealthLessonNumber(sec.componentNumber);
                            setIsHealthExamOpen(true);
                          }
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold text-[11px] hover:from-slate-700 hover:to-slate-800 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>ប្រឡង ៤០ QCM</span>
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Math Lessons Interactive Cards */}
            {(selectedSubjectFilter === 'all' || selectedSubjectFilter === 'គណិតវិទ្យា') &&
              ALL_MATH_LESSONS_PACKAGES.map((pkg) => (
              <div
                key={pkg.lessonNumber}
                className="min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between"
              >
                <div>
                  {/* Gradient Card Header with Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={pkg.imageUrl} 
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`} />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg">
                        {pkg.icon}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                        មេរៀនទី {toKhmerNum(pkg.lessonNumber)}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1">
                        {pkg.shortTitle}
                      </h3>
                      <p className="text-[10px] text-white/90 mt-0.5 font-medium drop-shadow-sm">
                        ទំព័រ {pkg.startPage} ដល់ {pkg.endPage} &bull; ថ្នាក់ទី ៦
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]">
                      {pkg.summary}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-indigo-900 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100/50">
                      <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5 text-amber-500" /> រៀនអន្តរកម្ម</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1"><Layers className="w-2.5 h-2.5 text-blue-500" /> រូបមន្តគន្លឹះ</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-rose-800"><Award className="w-2.5 h-2.5 text-rose-500" /> ៤០ សំណួរ</span>
                    </div>
                  </div>
                </div>

                {/* 2 Distinct Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (!hasCarouselDragged) {
                        setSelectedMathLessonNumber(pkg.lessonNumber);
                        setIsMathInteractiveModalOpen(true);
                      }
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white rounded-xl font-bold text-[11px] hover:from-indigo-500 hover:to-indigo-600 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>រៀនអន្តរកម្ម</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!hasCarouselDragged) {
                        setSelectedMathLessonNumber(pkg.lessonNumber);
                        setIsMathLessonExamOpen(true);
                      }
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold text-[11px] hover:from-slate-700 hover:to-slate-800 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>ប្រឡង QCM</span>
                  </button>
                </div>
              </div>
            ))}

            {/* English Grade 6 Interactive Lesson Cards (MoEYS) */}
            {(selectedSubjectFilter === 'all' || selectedSubjectFilter === 'ភាសាអង់គ្លេស') &&
              ENGLISH_GRADE_6_UNITS.map((unit, uIdx) => (
                <div
                  key={unit.id}
                  className="min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-blue-200/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Banner */}
                    <div className="relative h-40 overflow-hidden bg-gradient-to-tr from-blue-900 via-indigo-800 to-slate-900">
                      <div className="absolute inset-0 bg-blue-950/40" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg">
                          {unit.icon}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                          Unit {unit.unitNumber}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1">
                          {unit.unitTitle}
                        </h3>
                        <p className="text-[10px] text-blue-200 mt-0.5 font-medium drop-shadow-sm">
                          {unit.chapterTitle} &bull; {unit.pages}
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]">
                        {unit.languageFocus.grammarTopic} &bull; {unit.vocabulary.map((v) => v.word).slice(0, 4).join(', ')}...
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-blue-900 bg-blue-50/70 p-2 rounded-xl border border-blue-100">
                        <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5 text-amber-500" /> ៧ ផ្នែកពេញលេញ</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1"><Layers className="w-2.5 h-2.5 text-blue-600" /> សន្ទនា & អំណាន</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-emerald-800"><Award className="w-2.5 h-2.5 text-emerald-600" /> ៤០ QCM</span>
                      </div>
                    </div>
                  </div>

                  {/* 2 Action Buttons */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        if (!hasCarouselDragged) {
                          setSelectedEnglishUnitIndex(uIdx);
                          setIsEnglishInteractiveOpen(true);
                        }
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-xl font-bold text-[11px] hover:from-blue-500 hover:to-indigo-600 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>រៀនអន្តរកម្ម</span>
                    </button>
                    <button
                      onClick={() => {
                        if (!hasCarouselDragged) {
                          setIsEnglishExamOpen(true);
                        }
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold text-[11px] hover:from-slate-700 hover:to-slate-800 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>ប្រឡង ៤០ QCM</span>
                    </button>
                  </div>
                </div>
              ))}

            {/* Science Interactive Lesson Card */}
            {(selectedSubjectFilter === 'all' || selectedSubjectFilter === 'វិទ្យាសាស្ត្រ') && (
              <div
                key="science-lesson-1"
                className="min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-emerald-300 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between"
              >
                  <div>
                    <div className="relative h-40 overflow-hidden bg-gradient-to-tr from-emerald-800 via-teal-700 to-cyan-800">
                      <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600" alt="ការសម្របខ្លួនរបស់រុក្ខជាតិ" className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg">🌱</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider">MoEYS ថ្នាក់ទី ៦</span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-white text-sm leading-tight font-moul drop-shadow-md">ការសម្របខ្លួនរបស់រុក្ខជាតិ</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-[11px] text-slate-600">មេរៀនវិទ្យាសាស្ត្រអន្តរកម្មពេញលេញស្តីពីការសម្របខ្លួនរបស់រុក្ខជាតិទៅតាមជម្រក។</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button onClick={() => setShowScienceLessonModal(true)} className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold text-[11px] hover:from-emerald-500 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" /> បើកមេរៀនអន្តរកម្ម
                    </button>
                  </div>
              </div>
            )}
          </div>
        ) : activeContentType === 'exams' ? (
          <div
            ref={carouselRef}
            onMouseDown={handleCarouselMouseDown}
            onMouseMove={handleCarouselMouseMove}
            onMouseUp={handleCarouselMouseUp}
            onMouseLeave={handleCarouselMouseUp}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 select-none cursor-grab active:cursor-grabbing touch-pan-x"
          >
            {(() => {
              const filtered = effectiveQuizzes.filter((quiz) => {
                if (selectedSubjectFilter === 'all') return true;
                const qSub = (quiz.subject || '').toLowerCase();
                const qTitle = (quiz.title || '').toLowerCase();
                const target = selectedSubjectFilter.toLowerCase();
                if (target === 'អប់រំសុខភាព') {
                  return qSub.includes('សុខភាព') || qSub.includes('health') || qTitle.includes('សុខភាព') || qTitle.includes('អនាម័យ');
                }
                if (target === 'ភាសាអង់គ្លេស') {
                  return qSub.includes('អង់គ្លេស') || qSub.includes('english') || qTitle.includes('អង់គ្លេស') || qTitle.includes('english');
                }
                if (target === 'គណិតវិទ្យា') {
                  return qSub.includes('គណិត') || qSub.includes('math') || qTitle.includes('គណិត');
                }
                if (target === 'ភាសាខ្មែរ') {
                  return qSub.includes('ខ្មែរ') || qSub.includes('khmer') || qTitle.includes('ខ្មែរ');
                }
                if (target === 'វិទ្យាសាស្ត្រ') {
                  return qSub.includes('វិទ្យា') || qSub.includes('science') || qTitle.includes('វិទ្យា');
                }
                if (target === 'សិក្សាសង្គម') {
                  return qSub.includes('សង្គម') || qSub.includes('social') || qTitle.includes('សង្គម');
                }
                return (
                  qSub.includes(target) ||
                  qTitle.includes(target)
                );
              });

              if (filtered.length === 0) {
                return (
                  <div className="w-full py-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    មិនមានវិញ្ញាសាក្នុងមុខវិជ្ជានេះទេ
                  </div>
                );
              }

              return filtered.map((quiz) => {
                const isEnglish = (quiz.subject || '').includes('អង់គ្លេស') || (quiz.subject || '').toLowerCase().includes('english') || quiz.id.includes('english');
                const isHealth = (quiz.subject || '').includes('សុខភាព') || (quiz.subject || '').toLowerCase().includes('health') || quiz.id.includes('health');
                const isMathLesson = quiz.id.startsWith('quiz-math-lesson') || (quiz.id.startsWith('quiz-math') && quiz.title.includes('មេរៀន'));

                return (
                  <div
                    key={quiz.id}
                    className="min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-40 bg-slate-800 overflow-hidden">
                        <img
                          src={quiz.imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600'}
                          alt={quiz.title}
                          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                        
                        <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow-xs border border-white/20">
                          {quiz.questionCount || quiz.questions?.length || 40} សំណួរ
                        </span>

                        <div className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5 backdrop-blur-md border border-white/20 ${
                          isEnglish
                            ? 'bg-blue-600/95'
                            : isHealth
                            ? 'bg-emerald-600/95'
                            : isMathLesson
                            ? 'bg-indigo-600/95'
                            : 'bg-purple-900/95'
                        }`}>
                          <span>{isEnglish ? '🔤' : isHealth ? '🏥' : isMathLesson ? '📐' : '★'}</span>
                          <span>{quiz.subject || 'វិញ្ញាសា'}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[40px] leading-snug font-moul">
                          {quiz.title}
                        </h3>

                        {/* Distinct Badges */}
                        <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-bold">
                          {isEnglish && (
                            <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                              <Award className="w-3 h-3 text-blue-600" /> ៤០ QCM & Grammar
                            </span>
                          )}
                          {isHealth && (
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <Award className="w-3 h-3 text-emerald-600" /> ៤០ QCM គរុកោសល្យ
                            </span>
                          )}
                          {isMathLesson && (
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                              <Award className="w-3 h-3 text-indigo-600" /> ៤០ សំណួរគន្លឹះ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                        {quiz.isPublic ? (
                          <>
                            <Globe className="w-3.5 h-3.5 text-blue-600" /> សាធារណៈ
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-600" /> ឯកជន
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (!hasCarouselDragged) {
                              setSelectedQuizForPdf(quiz);
                              setIsPdfBookModalOpen(true);
                            }
                          }}
                          className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition shadow-xs active:scale-95 flex items-center gap-1 cursor-pointer"
                          title="ទាញយកជាសៀវភៅ (PDF)"
                        >
                          <BookMarked className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (!hasCarouselDragged) {
                              if (isEnglish) {
                                setIsEnglishExamOpen(true);
                              } else if (isHealth) {
                                const hMatch = quiz.id.match(/health-lesson-(\d+)/i);
                                if (hMatch) {
                                  setSelectedHealthLessonNumber(parseInt(hMatch[1]));
                                } else {
                                  setSelectedHealthLessonNumber(1);
                                }
                                setIsHealthExamOpen(true);
                              } else if (isMathLesson) {
                                const match = quiz.id.match(/lesson(\d+)/i);
                                const lNum = match ? parseInt(match[1]) : 1;
                                setSelectedMathLessonNumber(lNum);
                                setIsMathLessonExamOpen(true);
                              } else {
                                onPlayQuiz(quiz);
                              }
                            }
                          }}
                          className={`px-3.5 py-2 text-white rounded-xl font-bold text-xs transition shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                            isEnglish
                              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 shadow-blue-500/20'
                              : isHealth
                              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 shadow-emerald-500/20'
                              : isMathLesson
                              ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-600 shadow-indigo-500/20'
                              : 'bg-purple-900 hover:bg-purple-800'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5 text-amber-300" />
                          <span>ប្រឡង ៤០ QCM</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        ) : activeContentType === 'summaries' ? (
          <div
            ref={carouselRef}
            onMouseDown={handleCarouselMouseDown}
            onMouseMove={handleCarouselMouseMove}
            onMouseUp={handleCarouselMouseUp}
            onMouseLeave={handleCarouselMouseUp}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 select-none cursor-grab active:cursor-grabbing touch-pan-x"
          >
            {(() => {
              const filtered = GRADE_6_SUBJECT_SUMMARIES.filter((s) => {
                if (selectedSubjectFilter === 'all') return true;
                if (selectedSubjectFilter === 'ភាសាខ្មែរ') return s.subjectKey === 'khmer';
                if (selectedSubjectFilter === 'គណិតវិទ្យា') return s.subjectKey === 'math';
                if (selectedSubjectFilter === 'វិទ្យាសាស្ត្រ') return s.subjectKey === 'science';
                if (selectedSubjectFilter === 'សិក្សាសង្គម') return s.subjectKey === 'social';
                if (selectedSubjectFilter === 'អប់រំសុខភាព') return s.subjectKey === 'health';
                if (selectedSubjectFilter === 'ភាសាអង់គ្លេស') return s.subjectKey === 'english';
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <div className="w-full py-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    មិនមានមេរៀនសង្ខេបក្នុងមុខវិជ្ជានេះទេ
                  </div>
                );
              }

              return filtered.map((sum) => (
                <div
                  key={sum.id}
                  className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shadow-xs">
                        {sum.icon}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200/60">
                        📚 មេរៀនសង្ខេប
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1">{sum.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sum.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span>📖 {sum.lessonsCount} មេរៀន</span>
                      <span>•</span>
                      <span>📑 {sum.chapters?.length || 0} ជំពូក</span>
                      <span>•</span>
                      <span>🎯 {sum.qcmCount || 0} សំណួរ</span>
                    </div>
                  </div>
                  <div className="p-4 pt-0 space-y-2">
                    {sum.subjectKey === 'math' && (
                      <button
                        onClick={() => {
                          if (!hasCarouselDragged) {
                            setActiveContentType('interactive_lessons');
                          }
                        }}
                        className="w-full py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white rounded-xl font-bold text-xs hover:from-emerald-700 hover:to-indigo-700 transition shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>✨ មើលមេរៀនអន្តរកម្មទាំង២០ (ដាច់ដោយឡែក) →</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (!hasCarouselDragged) {
                          setReadingSummary(sum);
                        }
                      }}
                      className="w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold text-xs hover:from-amber-700 hover:to-orange-700 transition shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> អានមេរៀនសង្ខេប
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        ) : (
          <div
            ref={carouselRef}
            onMouseDown={handleCarouselMouseDown}
            onMouseMove={handleCarouselMouseMove}
            onMouseUp={handleCarouselMouseUp}
            onMouseLeave={handleCarouselMouseUp}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 select-none cursor-grab active:cursor-grabbing touch-pan-x"
          >
            {(() => {
              const filtered = HOME_STUDY_GAMES.filter((g) => {
                if (selectedSubjectFilter === 'all') return true;
                return g.subjectKey === selectedSubjectFilter || g.subject === selectedSubjectFilter;
              });

              if (filtered.length === 0) {
                return (
                  <div className="w-full py-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    មិនមានល្បែងសិក្សាក្នុងមុខវិជ្ជានេះទេ
                  </div>
                );
              }

              return filtered.map((game) => (
                <div
                  key={game.id}
                  className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden">
                    {/* Background Image with Overlay */}
                    <img 
                      src={game.imageUrl} 
                      alt={game.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80`} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-40 mix-blend-multiply`} />

                    {/* MoEYS Logo Watermark for Games */}
                    <div className="absolute -right-6 -bottom-8 w-32 h-32 opacity-20 pointer-events-none rotate-12 transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-6">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_of_MoEYS_Cambodia.png/800px-Logo_of_MoEYS_Cambodia.png" alt="MoEYS Watermark" className="w-full h-full object-contain" />
                    </div>

                    <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-xs">
                            {game.icon}
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-white p-[1.5px] shadow-sm flex items-center justify-center shrink-0 overflow-hidden border border-white/20">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_of_MoEYS_Cambodia.png/800px-Logo_of_MoEYS_Cambodia.png" alt="MoEYS" className="w-full h-full object-contain" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-white border border-white/20">
                          {game.grade}
                        </span>
                      </div>
                      <div className="relative z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md inline-block mb-1 border border-white/10">
                          {game.subject}
                        </span>
                        <h3 className="font-bold text-white text-base leading-snug drop-shadow-md">{game.title}</h3>
                        <p className="text-[11px] text-white/90 font-medium drop-shadow-sm">{game.subTitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {game.badge}
                      </span>
                      <span className="text-[10px] text-slate-400">អន្តរកម្ម</span>
                    </div>
                    <button
                      onClick={() => {
                        if (!hasCarouselDragged) {
                          handleLaunchGame(game);
                        }
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-xl font-bold text-xs hover:from-emerald-500 hover:to-teal-600 transition shadow-sm hover:shadow-emerald-600/30 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> {game.playText}
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {/* Modal to read summary lesson */}
        {readingSummary && (
          <StudentLessonReaderModal
            isOpen={!!readingSummary}
            summary={readingSummary}
            onClose={() => setReadingSummary(null)}
            onTakeQuiz={(title) => {
              setReadingSummary(null);
              const matched = quizzes.find((q) => q.title.toLowerCase().includes(title.toLowerCase()));
              if (matched) {
                onPlayQuiz(matched);
              } else {
                onNavigateTab('library');
              }
            }}
          />
        )}

        {/* Modal for Interactive Math Lessons Viewer (All 20 Lessons) */}
        <MathInteractiveLessonViewer
          isOpen={isMathInteractiveModalOpen || isMathLesson1Open}
          onClose={() => {
            setIsMathInteractiveModalOpen(false);
            setIsMathLesson1Open(false);
          }}
          onShowToast={onShowToast}
          initialLessonNumber={selectedMathLessonNumber}
          onOpenExam={(lNum) => {
            setSelectedMathLessonNumber(lNum);
            setIsMathInteractiveModalOpen(false);
            setIsMathLesson1Open(false);
            setIsMathLessonExamOpen(true);
          }}
        />

        {/* Modal for Math 40-Question QCM Exam (All 20 Lessons) */}
        <MathLesson1ExamModal
          isOpen={isMathLessonExamOpen || isMathLesson1ExamOpen}
          onClose={() => {
            setIsMathLessonExamOpen(false);
            setIsMathLesson1ExamOpen(false);
          }}
          onShowToast={onShowToast}
          initialLessonNumber={selectedMathLessonNumber}
        />

        {/* Modal for Interactive Health Education Lessons Viewer (4 Components, 19 Lessons, Digital Lab Tools) */}
        <HealthEducationInteractiveViewer
          isOpen={isHealthInteractiveOpen}
          onClose={() => setIsHealthInteractiveOpen(false)}
          onShowToast={onShowToast}
          initialSectionIndex={selectedHealthSectionIndex}
          onOpenExam={(lessonNum) => {
            setIsHealthInteractiveOpen(false);
            setSelectedHealthLessonNumber(lessonNum !== undefined ? lessonNum : selectedHealthSectionIndex + 1);
            setIsHealthExamOpen(true);
          }}
        />

        {/* Modal for Health Education 40-Question QCM Exam */}
        <HealthEducation40ExamModal
          isOpen={isHealthExamOpen}
          onClose={() => setIsHealthExamOpen(false)}
          onShowToast={onShowToast}
          initialLessonNumber={selectedHealthLessonNumber}
        />

        {/* Modal for Interactive English Grade 6 Lessons Viewer (MoEYS 7 Core Sections) */}
        <EnglishGrade6InteractiveViewer
          isOpen={isEnglishInteractiveOpen}
          onClose={() => setIsEnglishInteractiveOpen(false)}
          initialUnitIndex={selectedEnglishUnitIndex}
          onOpenExam={() => {
            setIsEnglishInteractiveOpen(false);
            setIsEnglishExamOpen(true);
          }}
        />

        {/* Modal for English Grade 6 40-Question Exam (QCM, True/False, Grammar, Fill in blanks) */}
        <English40ExamModal
          isOpen={isEnglishExamOpen}
          onClose={() => setIsEnglishExamOpen(false)}
          onShowToast={onShowToast}
        />

        {/* Modals for Games from HomeTab */}
        {showFishingGameModal && (
          <FishingGameModal
            isOpen={showFishingGameModal}
            onClose={() => setShowFishingGameModal(false)}
            studentName={teacher.name || 'សិស្សឆ្នើម'}
            initialQuizzes={effectiveQuizzes}
          />
        )}
        {showVijjaNavaGameModal && (
          <VijjaNavaGameModal
            isOpen={showVijjaNavaGameModal}
            onClose={() => setShowVijjaNavaGameModal(false)}
            studentName={teacher.name || 'សិស្សឆ្នើម'}
          />
        )}
        {showEnglishGameModal && (
          <EnglishGameModal
            isOpen={showEnglishGameModal}
            onClose={() => setShowEnglishGameModal(false)}
            studentName={teacher.name || 'សិស្សឆ្នើម'}
          />
        )}
        {showCameraQuizModal && (
          <CameraQuizModal
            isOpen={showCameraQuizModal}
            onClose={() => setShowCameraQuizModal(false)}
            studentName={teacher.name || 'សិស្សឆ្នើម'}
            initialQuizzes={effectiveQuizzes}
          />
        )}
      </section>

      {/* ផ្នែកទី៣៖ ការរៀបចំថ្នាក់ (Class Islands & Management with Subtle Surrounding Border) */}
      <section className="relative overflow-hidden rounded-[28px] border border-sky-200/90 dark:border-sky-800/60 bg-gradient-to-b from-sky-50/25 via-white to-slate-50/30 dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex justify-between items-center bg-white/95 dark:bg-slate-800/90 px-3.5 py-2.5 rounded-2xl border border-sky-100 dark:border-sky-800/50 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300 rounded-xl border border-sky-100 dark:border-sky-800/40 shadow-xs">
              <Shapes className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-black text-slate-900 dark:text-white text-sm sm:text-base tracking-tight flex items-center gap-2">
                <span>ការរៀបចំថ្នាក់</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border border-sky-200/60">
                  រៀបរយ & ស្តង់ដារ
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                គ្រប់គ្រង និងតុបតែងថ្នាក់រៀន • ប្លង់តុ • បទបញ្ជា • គណៈកម្មការ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const el = document.getElementById('class-islands-scroll');
                if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="p-1.5 bg-white dark:bg-slate-800 hover:bg-sky-50 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-700 rounded-xl transition shadow-2xs active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('class-islands-scroll');
                if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="p-1.5 bg-white dark:bg-slate-800 hover:bg-sky-50 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-700 rounded-xl transition shadow-2xs active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          id="class-islands-scroll"
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 snap-x"
        >
          {/* Main Class Card */}
          <div
            onClick={() => onNavigateTab('admin')}
            className="min-w-[270px] sm:min-w-[290px] bg-white dark:bg-slate-800 rounded-[28px] p-5 text-slate-900 dark:text-white flex flex-col justify-between h-40 shadow-xs border border-sky-200/90 dark:border-sky-700/60 hover:border-sky-400 shrink-0 snap-start relative group hover:scale-[1.01] transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
               <img src="https://img.freepik.com/free-vector/back-school-concept_23-2148604374.jpg" alt="Decoration" className="w-full h-full object-cover" />
            </div>

            <div className="flex justify-between items-start relative z-10">
              <div className="w-10 h-10 bg-sky-100 text-sky-600 font-black rounded-2xl flex items-center justify-center text-lg shadow-sm">
                 <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] bg-sky-50 dark:bg-slate-700 px-3 py-1 rounded-full font-bold text-sky-700 dark:text-sky-300 border border-sky-200">
                សិស្ស {teacher.grade}
              </span>
            </div>
            <div className="relative z-10 space-y-0.5">
              <h3 className="font-extrabold text-base leading-tight">ថ្នាក់រៀន {teacher.grade}</h3>
              <p className="text-xs text-slate-500">ចុចដើម្បីគ្រប់គ្រងទូទៅ</p>
            </div>
          </div>

          {/* Honor Roll & Certificates Card */}
          <div
            onClick={() => {
              sessionStorage.setItem('target_admin_section', JSON.stringify({ main: 'sec1', sub: 'honor_roll' }));
              onNavigateTab('admin');
            }}
            className="min-w-[270px] sm:min-w-[290px] bg-white dark:bg-slate-800 rounded-[28px] p-5 text-slate-900 dark:text-white flex flex-col justify-between h-40 shadow-xs border border-amber-200/90 dark:border-amber-700/60 hover:border-amber-400 shrink-0 snap-start relative group hover:scale-[1.01] transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
               <img src="https://img.freepik.com/free-vector/gradient-golden-luxury-certificate_23-2149113645.jpg" alt="Decoration" className="w-full h-full object-cover" />
            </div>

            <div className="flex justify-between items-start relative z-10">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 font-black rounded-2xl flex items-center justify-center text-lg shadow-sm">
                🏆
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-black border border-amber-200">
                សិស្សឆ្នើមទាំង ៥
              </span>
            </div>
            <div className="relative z-10 space-y-0.5">
              <h3 className="font-black text-base leading-tight">តារាងកិត្តិយស & ប័ណ្ណសរសើរ</h3>
              <p className="text-xs text-slate-500">ស៊ុមព័ទ្ធជុំក្បាច់ខ្មែរ • ទាញយក Word & PDF</p>
            </div>
          </div>

          {/* Seating Arrangement Button */}
          <div
            onClick={() => onNavigateTab('admin')}
            className="min-w-[250px] sm:min-w-[270px] bg-gradient-to-b from-white to-purple-50/40 hover:from-white hover:to-purple-100/60 border border-purple-200/90 dark:border-purple-700/60 hover:border-purple-400 rounded-[28px] p-5 flex flex-col justify-between h-40 cursor-pointer transition-all shadow-xs group shrink-0 snap-start relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-900 group-hover:bg-purple-900 group-hover:text-white flex items-center justify-center transition duration-300 shadow-inner text-xl">
              🪑
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-900 transition">ការរៀបចំតុសិស្ស</h4>
              <p className="text-[11px] text-slate-500 mt-1">ប្លង់តុរៀបចំក្នុងថ្នាក់រៀនតាមស្តង់ដារ</p>
            </div>
          </div>

          {/* Photo Gallery Button */}
          <div
            onClick={() => onNavigateTab('admin')}
            className="min-w-[250px] sm:min-w-[270px] bg-gradient-to-b from-white to-pink-50/40 hover:from-white hover:to-pink-100/60 border border-pink-200/90 dark:border-pink-700/60 hover:border-pink-400 rounded-[28px] p-5 flex flex-col justify-between h-40 cursor-pointer transition-all shadow-xs group shrink-0 snap-start relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-11 h-11 rounded-2xl bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white flex items-center justify-center transition duration-300 shadow-inner text-xl">
              📸
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-pink-700 transition">ផ្ទាំងរូបភាព</h4>
              <p className="text-[11px] text-slate-500 mt-1">សកម្មភាព និងអាល់ប៊ុមរូបភាពសិស្ស</p>
            </div>
          </div>

          {/* Study Materials Button */}
          <div
            onClick={() => setIsDecorModalOpen(true)}
            className="min-w-[250px] sm:min-w-[270px] bg-gradient-to-b from-white to-amber-50/40 hover:from-white hover:to-amber-100/60 border border-amber-200/90 dark:border-amber-700/60 hover:border-amber-400 rounded-[28px] p-5 flex flex-col justify-between h-40 cursor-pointer transition-all shadow-xs group shrink-0 snap-start relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition duration-300 shadow-inner text-xl">
              📚
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-amber-800 transition">ផ្ទាំងសម្ភារសិក្សា</h4>
              <p className="text-[11px] text-slate-500 mt-1">សន្លឹកតុបតែងថ្នាក់ & សុវត្ថិភាពចំណីអាហារ</p>
            </div>
          </div>

          {/* Internal Rules Button */}
          <div
            onClick={() => onNavigateTab('admin')}
            className="min-w-[250px] sm:min-w-[270px] bg-gradient-to-b from-white to-emerald-50/40 hover:from-white hover:to-emerald-100/60 border border-emerald-200/90 dark:border-emerald-700/60 hover:border-emerald-400 rounded-[28px] p-5 flex flex-col justify-between h-40 cursor-pointer transition-all shadow-xs group shrink-0 snap-start relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition duration-300 shadow-inner text-xl">
              📜
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-800 transition">បទបញ្ជាផ្ទៃក្នុង</h4>
              <p className="text-[11px] text-slate-500 mt-1">ច្បាប់ទូទាត់ និងសីលធម៌សិស្ស</p>
            </div>
          </div>

          {/* More Action Button */}
          <div
            onClick={() => onNavigateTab('admin')}
            className="min-w-[220px] sm:min-w-[240px] border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-[28px] p-5 flex flex-col items-center justify-center h-40 bg-gradient-to-b from-sky-50/30 to-sky-100/40 hover:bg-sky-100/60 transition-all group shadow-xs cursor-pointer shrink-0 snap-start text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center mb-2 transition duration-300 shadow-xs">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs text-slate-800 group-hover:text-sky-900">
              ផ្ទាំងផ្សេងៗទៀត (More...)
            </span>
          </div>
        </div>
      </section>

      {/* ផ្នែកទី៤៖ ស្វ័យសិក្សា (Self-Study & Independent Practice Swipable Section with Soft Subtle Teal Surrounding Border) */}
      <section className="relative overflow-hidden rounded-[28px] border border-teal-200/90 dark:border-teal-800/60 bg-gradient-to-b from-teal-50/25 via-white to-slate-50/30 dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex justify-between items-center bg-white/95 dark:bg-slate-800/90 px-3.5 py-2.5 rounded-2xl border border-teal-100 dark:border-teal-800/50 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-teal-50 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300 rounded-xl border border-teal-100 dark:border-teal-800/40 shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-black text-slate-900 dark:text-white text-sm sm:text-base tracking-tight flex items-center gap-2">
                <span>ស្វ័យសិក្សា</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border border-teal-200/60">
                  PLP & ឯករាជ្យ
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                សកម្មភាពហ្វឹកហាត់ & ពង្រឹងសមត្ថភាព • អំណាន • គណិត • កម្រងសំណួរ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const el = document.getElementById('self-study-scroll');
                if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="p-1.5 bg-white dark:bg-slate-800 hover:bg-teal-50 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-700 rounded-xl transition shadow-2xs active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('self-study-scroll');
                if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="p-1.5 bg-white dark:bg-slate-800 hover:bg-teal-50 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-700 rounded-xl transition shadow-2xs active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          id="self-study-scroll"
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 snap-x"
        >
          {/* Card 0: Kru PLP Self-Study */}
          <PLPEdTechCard />
          {/* Card 0.5: MOEYS CPD */}
          <MoeysCpdCard />
          {/* Card 0.75: Digital School */}
          <DigitalSchoolCard />
          {/* Card 1: Reading */}
          <div
            onClick={() => {
              if (quizzes.length > 0) onPlayQuiz(quizzes[0]);
              else onShowToast('មិនមានកម្រងអំណានទេ។');
            }}
            className="min-w-[250px] sm:min-w-[270px] bg-white dark:bg-slate-800 border border-teal-200/90 dark:border-teal-700/60 hover:border-teal-400 rounded-[28px] p-5 flex flex-col justify-between h-40 cursor-pointer transition-all shadow-xs hover:scale-[1.01] group shrink-0 snap-start relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition duration-300 shadow-inner text-xl">
              📖
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-teal-600 transition">អំណានបណ្តុះស្មារតី</h4>
              <p className="text-[11px] text-slate-500 mt-1">អានអត្ថបទ និងឆ្លើយសំណួរយល់ន័យ</p>
            </div>
          </div>

          {/* Card 2: Math Drills */}
          <div
            onClick={() => {
              const mathQuiz = quizzes.find(q => q.title.includes('គណិត')) || quizzes[0];
              if (mathQuiz) onPlayQuiz(mathQuiz);
            }}
            className="min-w-[250px] sm:min-w-[270px] bg-white dark:bg-slate-800 border border-blue-200/90 dark:border-blue-700/60 hover:border-blue-400 rounded-[28px] p-5 flex flex-col justify-between h-40 cursor-pointer transition-all shadow-xs hover:scale-[1.01] group shrink-0 snap-start relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition duration-300 shadow-inner text-xl">
              🧮
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 transition">គណិតវិទ្យាប្រចាំថ្ងៃ</h4>
              <p className="text-[11px] text-slate-500 mt-1">លំហាត់គណនា និងដោះស្រាយល្បែងប្រាជ្ញា</p>
            </div>
          </div>

          {/* Card 3: Library / Discover */}
          <div
            onClick={() => onNavigateTab('library')}
            className="min-w-[250px] sm:min-w-[270px] bg-gradient-to-b from-white to-purple-50/40 hover:from-white hover:to-purple-100/60 border border-purple-200/90 dark:border-purple-700/60 hover:border-purple-400 rounded-[28px] p-5 flex flex-col justify-between h-40 cursor-pointer transition-all shadow-xs group shrink-0 snap-start relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition duration-300 shadow-inner text-xl">
              🎯
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-800 transition">កម្រងសំណួរស្វ័យសិក្សា</h4>
              <p className="text-[11px] text-slate-500 mt-1">ហ្វឹកហាត់តាមកម្រិតថ្នាក់រៀន</p>
            </div>
          </div>

          {/* Card 4: Homework */}
          <div
            onClick={() => onShowToast('មុខងារកិច្ចការផ្ទះស្វ័យសិក្សាបានបើកដំណើរការ')}
            className="min-w-[250px] sm:min-w-[270px] bg-gradient-to-b from-white to-amber-50/40 hover:from-white hover:to-amber-100/60 border border-amber-200/90 dark:border-amber-700/60 hover:border-amber-400 rounded-[28px] p-5 flex flex-col justify-between h-40 cursor-pointer transition-all shadow-xs group shrink-0 snap-start relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition duration-300 shadow-inner text-xl">
              📝
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-amber-800 transition">កិច្ចការផ្ទះ & ស្រាវជ្រាវ</h4>
              <p className="text-[11px] text-slate-500 mt-1">កិច្ចការបន្ថែមសម្រាប់សិស្សធ្វើនៅផ្ទះ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Classroom Decoration & Food Safety Print Modal */}
      <ClassroomDecorationPrintModal
        isOpen={isDecorModalOpen}
        onClose={() => setIsDecorModalOpen(false)}
        teacher={teacher}
      />

      {/* PDF Book Customizer Modal for Quizzes */}
      {isPdfBookModalOpen && selectedQuizForPdf && (
        <PdfCustomizerModal
          isOpen={isPdfBookModalOpen}
          onClose={() => {
            setIsPdfBookModalOpen(false);
            setSelectedQuizForPdf(null);
          }}
          documentType="quiz"
          quizData={selectedQuizForPdf}
          title={selectedQuizForPdf.title}
          initialStyles={{
            paperSize: (selectedQuizForPdf.worksheetOptions?.paperSize as any) || 'A4',
          }}
        />
      )}

      <ScienceLessonIframe 
        isOpen={showScienceLessonModal} 
        onClose={() => setShowScienceLessonModal(false)} 
      />
    </div>
  );
};
