import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Student,
  GradeDatabase,
  TeacherProfile,
  AttendanceDatabase,
} from '../types';
import {
  GRADE_PERIODS,
  GradePeriodKey,
  calculateSinglePeriodSummary,
  calculateSemesterSummary,
  calculateAnnualSummary,
  getGradeClassification,
  getAllPrimarySubSubjects,
  PrimarySubSubject,
  GradeThresholds,
} from '../utils/gradeManager';
import {
  getActiveAcademicYear,
  loadYearScopedData,
} from '../utils/academicYearStorage';
import { isImageAvatar } from '../utils/imageCompressor';
import { initialTeacherProfile } from '../data/initialData';
import {
  Trophy,
  Award,
  Calendar,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Printer,
  BookOpen,
  GraduationCap,
  Star,
  Medal,
  AlertCircle,
  Calculator,
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentAcademicResultsViewProps {
  currentStudent: Student;
  students: Student[];
  grades: GradeDatabase;
  attendance?: AttendanceDatabase;
  onPrintReport?: () => void;
  onShowToast: (msg: string) => void;
}

export const StudentAcademicResultsView: React.FC<StudentAcademicResultsViewProps> = ({
  currentStudent,
  students,
  grades,
  attendance,
  onShowToast,
}) => {
  // Main View Mode: 'monthly' | 'semester' | 'annual'
  const [resultMode, setResultMode] = useState<'monthly' | 'semester' | 'annual'>('monthly');

  // Selected period for monthly view (default to October 'm10' or latest active)
  const [selectedMonthKey, setSelectedMonthKey] = useState<GradePeriodKey>('m10');

  // Selected semester for semester view: 1 or 2
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);

  // State to toggle printable report modal
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printReportType, setPrintReportType] = useState<'monthly' | 's1' | 's2' | 'annual'>('monthly');

  // Current active academic year
  const activeYear = useMemo(() => getActiveAcademicYear(), []);

  // Ref for horizontal scrolling of Academic Trend
  const trendScrollRef = useRef<HTMLDivElement>(null);

  // Ref for horizontal scrolling of Detailed Subjects & Sub-Subjects
  const subjectsScrollRef = useRef<HTMLDivElement>(null);

  // Month Selector interactive dropdown state
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(e.target as Node)) {
        setIsMonthDropdownOpen(false);
      }
    };
    if (isMonthDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMonthDropdownOpen]);

  // Helper for Grade Letter Visual Styling & Glows
  const getGradeStyle = (letter: string) => {
    switch (letter?.toUpperCase()) {
      case 'A':
        return {
          badge: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 text-white shadow-emerald-500/40 ring-2 ring-emerald-300/60',
          glow: 'from-emerald-400 to-teal-300',
          borderGlow: 'border-emerald-400/40 hover:border-emerald-300/60',
          shadowHover: 'hover:shadow-emerald-500/25',
          iconColor: 'text-emerald-300',
          iconBg: 'bg-emerald-400/20',
        };
      case 'B':
        return {
          badge: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-600 text-white shadow-blue-500/40 ring-2 ring-blue-300/60',
          glow: 'from-blue-400 to-indigo-300',
          borderGlow: 'border-blue-400/40 hover:border-blue-300/60',
          shadowHover: 'hover:shadow-blue-500/25',
          iconColor: 'text-blue-300',
          iconBg: 'bg-blue-400/20',
        };
      case 'C':
        return {
          badge: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-white shadow-amber-500/40 ring-2 ring-amber-300/60',
          glow: 'from-amber-400 to-yellow-300',
          borderGlow: 'border-amber-400/40 hover:border-amber-300/60',
          shadowHover: 'hover:shadow-amber-500/25',
          iconColor: 'text-amber-300',
          iconBg: 'bg-amber-400/20',
        };
      case 'D':
        return {
          badge: 'bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 text-white shadow-orange-500/40 ring-2 ring-orange-300/60',
          glow: 'from-orange-400 to-amber-300',
          borderGlow: 'border-orange-400/40 hover:border-orange-300/60',
          shadowHover: 'hover:shadow-orange-500/25',
          iconColor: 'text-orange-300',
          iconBg: 'bg-orange-400/20',
        };
      case 'E':
        return {
          badge: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 text-white shadow-yellow-500/40 ring-2 ring-yellow-300/60',
          glow: 'from-yellow-400 to-orange-300',
          borderGlow: 'border-yellow-400/40 hover:border-yellow-300/60',
          shadowHover: 'hover:shadow-yellow-500/25',
          iconColor: 'text-yellow-300',
          iconBg: 'bg-yellow-400/20',
        };
      case 'F':
      default:
        return {
          badge: 'bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 text-white shadow-rose-500/40 ring-2 ring-rose-300/60',
          glow: 'from-rose-400 to-red-300',
          borderGlow: 'border-rose-400/40 hover:border-rose-300/60',
          shadowHover: 'hover:shadow-rose-500/25',
          iconColor: 'text-rose-300',
          iconBg: 'bg-rose-400/20',
        };
    }
  };

  // Helper for Rank Medal and Podium Styling
  const getRankMedalInfo = (rank: number) => {
    if (rank === 1) {
      return {
        icon: '🥇',
        podBg: 'bg-gradient-to-br from-amber-400/35 via-yellow-400/20 to-amber-600/35 border-amber-300/60 shadow-amber-500/40 ring-2 ring-amber-400/40',
        avatarRing: 'from-amber-300 via-yellow-400 to-amber-500 ring-2 ring-amber-400/60 shadow-amber-500/50',
        numGradient: 'from-yellow-200 via-amber-300 to-yellow-500 drop-shadow-[0_4px_18px_rgba(245,158,11,0.55)]',
        bannerBg: 'bg-gradient-to-r from-amber-500/25 via-emerald-500/20 to-teal-500/25 border-amber-400/40 text-amber-200',
        bannerText: '🎉 ពូកែណាស់! សិស្សទទួលបានចំណាត់ថ្នាក់កិត្តិយស (លេខ ១)',
      };
    }
    if (rank === 2) {
      return {
        icon: '🥈',
        podBg: 'bg-gradient-to-br from-slate-200/35 via-blue-200/20 to-slate-400/35 border-slate-200/60 shadow-blue-400/30 ring-2 ring-slate-300/40',
        avatarRing: 'from-slate-200 via-blue-300 to-slate-400 ring-2 ring-slate-300/60 shadow-blue-400/40',
        numGradient: 'from-slate-100 via-slate-200 to-blue-200 drop-shadow-[0_4px_18px_rgba(148,163,184,0.5)]',
        bannerBg: 'bg-gradient-to-r from-blue-500/25 via-indigo-500/20 to-teal-500/25 border-blue-400/40 text-blue-200',
        bannerText: '🎉 ពូកែណាស់! សិស្សទទួលបានចំណាត់ថ្នាក់កិត្តិយស (លេខ ២)',
      };
    }
    if (rank === 3) {
      return {
        icon: '🥉',
        podBg: 'bg-gradient-to-br from-amber-700/35 via-orange-500/20 to-amber-800/35 border-amber-500/50 shadow-orange-500/30 ring-2 ring-amber-600/40',
        avatarRing: 'from-amber-600 via-orange-400 to-amber-700 ring-2 ring-amber-500/60 shadow-orange-500/40',
        numGradient: 'from-amber-200 via-orange-300 to-amber-500 drop-shadow-[0_4px_18px_rgba(249,115,22,0.5)]',
        bannerBg: 'bg-gradient-to-r from-orange-500/25 via-amber-500/20 to-yellow-500/25 border-orange-400/40 text-orange-200',
        bannerText: '🎉 ពូកែណាស់! សិស្សទទួលបានចំណាត់ថ្នាក់កិត្តិយស (លេខ ៣)',
      };
    }
    return {
      icon: '🎖️',
      podBg: 'bg-gradient-to-br from-indigo-500/25 to-purple-500/25 border-indigo-400/40 shadow-indigo-500/25 ring-1 ring-indigo-400/30',
      avatarRing: 'from-indigo-400 via-purple-500 to-pink-500 ring-2 ring-indigo-400/50 shadow-indigo-500/40',
      numGradient: 'from-white via-indigo-100 to-indigo-300 drop-shadow-[0_4px_14px_rgba(129,140,248,0.4)]',
      bannerBg: 'bg-white/10 border-white/15 text-indigo-200',
      bannerText: '👏 ខិតខំប្រឹងប្រែងបន្ថែមទៀតដើម្បីដណ្តើមចំណាត់ថ្នាក់ខ្ពស់!',
    };
  };

  // Synchronized state loaded directly from the active academic year data & localStorage
  const [subScoresState, setSubScoresState] = useState<Record<string, Record<number, Record<string, number>>>>(() => {
    const yearData = loadYearScopedData<Record<string, Record<number, Record<string, number>>> | null>(activeYear, 'sub_scores', null);
    if (yearData) return yearData;
    try {
      const saved = localStorage.getItem('school_sub_scores_db');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [activeSubSubjects, setActiveSubSubjects] = useState<string[]>(() => {
    const yearData = loadYearScopedData<string[] | null>(activeYear, 'active_sub_subjects', null);
    if (yearData) return yearData;
    try {
      const saved = localStorage.getItem('school_active_sub_subjects');
      if (saved) return JSON.parse(saved);
    } catch {}
    const defaults = getAllPrimarySubSubjects().filter(s => s.defaultSelected).map(s => s.id);
    return defaults;
  });

  const [periodSubSubjectsMap, setPeriodSubSubjectsMap] = useState<Record<string, string[]>>(() => {
    const yearSaved = loadYearScopedData<Record<string, string[]> | null>(activeYear, 'monitoring_period_sub_subjects', null);
    if (yearSaved) return yearSaved;
    try {
      const saved = localStorage.getItem('school_monitoring_period_sub_subjects');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [gradeThresholds, setGradeThresholds] = useState<GradeThresholds>(() => {
    const yearData = loadYearScopedData<GradeThresholds | null>(activeYear, 'grade_thresholds', null);
    if (yearData) return yearData;
    try {
      const saved = localStorage.getItem('school_grade_thresholds');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { A: 8.5, B: 7.5, C: 6.5, D: 5.0, E: 4.0 };
  });

  const [selectedS1Months, setSelectedS1Months] = useState<string[]>(() => {
    const yearData = loadYearScopedData<string[] | null>(activeYear, 'selected_s1_months', null);
    if (yearData) return yearData;
    try {
      const saved = localStorage.getItem('school_selected_s1_months');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['m10', 'm11', 'm12', 'm01'];
  });

  const [selectedS2Months, setSelectedS2Months] = useState<string[]>(() => {
    const yearData = loadYearScopedData<string[] | null>(activeYear, 'selected_s2_months', null);
    if (yearData) return yearData;
    try {
      const saved = localStorage.getItem('school_selected_s2_months');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['m02', 'm03', 'm04', 'm05', 'm06', 'm07'];
  });

  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    const yearData = loadYearScopedData<TeacherProfile | null>(activeYear, 'teacher', null);
    if (yearData) return yearData;
    try {
      const legacy = localStorage.getItem('primary_teacher_admin_v2');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (parsed.teacher) return parsed.teacher;
      }
    } catch {}
    return initialTeacherProfile;
  });

  // Listen to storage events to ensure instant synchronization if edited in Admin tab
  useEffect(() => {
    const handleStorageChange = () => {
      const currentYear = getActiveAcademicYear();
      const updatedSub = loadYearScopedData<Record<string, Record<number, Record<string, number>>> | null>(currentYear, 'sub_scores', null);
      if (updatedSub) setSubScoresState(updatedSub);
      else {
        try {
          const s = localStorage.getItem('school_sub_scores_db');
          if (s) setSubScoresState(JSON.parse(s));
        } catch {}
      }

      const updatedActive = loadYearScopedData<string[] | null>(currentYear, 'active_sub_subjects', null);
      if (updatedActive) setActiveSubSubjects(updatedActive);

      const updatedMap = loadYearScopedData<Record<string, string[]> | null>(currentYear, 'monitoring_period_sub_subjects', null);
      if (updatedMap) setPeriodSubSubjectsMap(updatedMap);

      const updatedThresh = loadYearScopedData<GradeThresholds | null>(currentYear, 'grade_thresholds', null);
      if (updatedThresh) setGradeThresholds(updatedThresh);

      const updatedTeacher = loadYearScopedData<TeacherProfile | null>(currentYear, 'teacher', null);
      if (updatedTeacher) setTeacherProfile(updatedTeacher);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Available monthly periods list (filtering out summary period rows)
  const monthlyPeriods = useMemo(() => {
    return GRADE_PERIODS.filter((p) => !p.isSummary);
  }, []);

  // All sub-subject metadata definitions
  const allSubDefs: PrimarySubSubject[] = useMemo(() => {
    return getAllPrimarySubSubjects();
  }, []);

  // Current active sub-subjects for the selected month
  const currentPeriodSubSubjects = useMemo(() => {
    if (
      periodSubSubjectsMap[selectedMonthKey] &&
      Array.isArray(periodSubSubjectsMap[selectedMonthKey]) &&
      periodSubSubjectsMap[selectedMonthKey].length > 0
    ) {
      return periodSubSubjectsMap[selectedMonthKey];
    }
    return activeSubSubjects;
  }, [periodSubSubjectsMap, selectedMonthKey, activeSubSubjects]);

  // 1. Calculations for Monthly Results (Fully synchronized with AdminTab/WikiSchool)
  const monthlySummary = useMemo(() => {
    return calculateSinglePeriodSummary(
      students,
      grades,
      selectedMonthKey,
      gradeThresholds,
      currentPeriodSubSubjects,
      subScoresState,
      periodSubSubjectsMap
    );
  }, [students, grades, selectedMonthKey, gradeThresholds, currentPeriodSubSubjects, subScoresState, periodSubSubjectsMap]);

  const currentStudentMonthlyResult = useMemo(() => {
    return monthlySummary.list.find((item) => item.student.id === currentStudent.id) || null;
  }, [monthlySummary, currentStudent.id]);

  // 2. Calculations for Semester Results (Fully synchronized with AdminTab/WikiSchool)
  const semesterSummary = useMemo(() => {
    const selectedMonths = selectedSemester === 1 ? selectedS1Months : selectedS2Months;
    return calculateSemesterSummary(
      students,
      grades,
      selectedSemester,
      selectedMonths,
      gradeThresholds,
      activeSubSubjects,
      subScoresState,
      periodSubSubjectsMap
    );
  }, [students, grades, selectedSemester, selectedS1Months, selectedS2Months, gradeThresholds, activeSubSubjects, subScoresState, periodSubSubjectsMap]);

  const currentStudentSemesterResult = useMemo(() => {
    return semesterSummary.list.find((item) => item.student.id === currentStudent.id) || null;
  }, [semesterSummary, currentStudent.id]);

  // 3. Calculations for Annual Results (Fully synchronized with AdminTab/WikiSchool)
  const annualSummary = useMemo(() => {
    return calculateAnnualSummary(
      students,
      grades,
      gradeThresholds,
      selectedS1Months,
      selectedS2Months,
      activeSubSubjects,
      subScoresState,
      periodSubSubjectsMap
    );
  }, [students, grades, gradeThresholds, selectedS1Months, selectedS2Months, activeSubSubjects, subScoresState, periodSubSubjectsMap]);

  const currentStudentAnnualResult = useMemo(() => {
    return annualSummary.list.find((item) => item.student.id === currentStudent.id) || null;
  }, [annualSummary, currentStudent.id]);

  // Monthly trend data across all evaluation periods for this student
  const studentYearlyTrend = useMemo(() => {
    return monthlyPeriods.map((p) => {
      const pSubs = (
        periodSubSubjectsMap[p.key] &&
        Array.isArray(periodSubSubjectsMap[p.key]) &&
        periodSubSubjectsMap[p.key].length > 0
      ) ? periodSubSubjectsMap[p.key] : activeSubSubjects;

      const summary = calculateSinglePeriodSummary(
        students,
        grades,
        p.key,
        gradeThresholds,
        pSubs,
        subScoresState,
        periodSubSubjectsMap
      );
      const studentData = summary.list.find((item) => item.student.id === currentStudent.id);
      return {
        key: p.key,
        shortLabel: p.shortLabel,
        isExam: p.isExam,
        avg: studentData ? studentData.avg : 0,
        rank: studentData ? studentData.rank : 0,
        classAvg: summary.classAverage,
      };
    });
  }, [grades, monthlyPeriods, students, currentStudent.id, gradeThresholds, activeSubSubjects, subScoresState, periodSubSubjectsMap]);

  const activePeriodInfo = useMemo(() => {
    return GRADE_PERIODS.find((p) => p.key === selectedMonthKey) || monthlyPeriods[0];
  }, [selectedMonthKey, monthlyPeriods]);

  // Sub-subject categories configuration with rich, vibrant styling
  const categoriesConfig = [
    {
      key: 'khmer',
      label: 'ភាសាខ្មែរ',
      icon: '🇰🇭',
      cardGradient: 'from-rose-500/10 via-pink-500/5 to-amber-500/5 dark:from-rose-950/40 dark:via-pink-950/20 dark:to-slate-900',
      borderColor: 'border-rose-300 dark:border-rose-700/70',
      headerBg: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/25',
      badgeBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-800',
      iconBg: 'bg-rose-100 dark:bg-rose-900/80 text-rose-600 dark:text-rose-200 ring-2 ring-rose-300 dark:ring-rose-800/60',
      titleColor: 'text-rose-900 dark:text-rose-100',
      accentColor: 'text-rose-600 dark:text-rose-400',
      progressGrad: 'from-rose-500 via-pink-500 to-rose-400',
    },
    {
      key: 'math',
      label: 'គណិតវិទ្យា',
      icon: '📐',
      cardGradient: 'from-blue-500/10 via-indigo-500/5 to-cyan-500/5 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-slate-900',
      borderColor: 'border-blue-300 dark:border-blue-700/70',
      headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-900/80 text-blue-600 dark:text-blue-200 ring-2 ring-blue-300 dark:ring-blue-800/60',
      titleColor: 'text-blue-900 dark:text-blue-100',
      accentColor: 'text-blue-600 dark:text-blue-400',
      progressGrad: 'from-blue-500 via-indigo-500 to-cyan-400',
    },
    {
      key: 'science',
      label: 'វិទ្យាសាស្ត្រ',
      icon: '🔬',
      cardGradient: 'from-emerald-500/10 via-teal-500/5 to-green-500/5 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900',
      borderColor: 'border-emerald-300 dark:border-emerald-700/70',
      headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-600 dark:text-emerald-200 ring-2 ring-emerald-300 dark:ring-emerald-800/60',
      titleColor: 'text-emerald-900 dark:text-emerald-100',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      progressGrad: 'from-emerald-500 via-teal-500 to-green-400',
    },
    {
      key: 'social',
      label: 'សិក្សាសង្គម',
      icon: '🌍',
      cardGradient: 'from-amber-500/10 via-orange-500/5 to-yellow-500/5 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-slate-900',
      borderColor: 'border-amber-300 dark:border-amber-700/70',
      headerBg: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/25',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800',
      iconBg: 'bg-amber-100 dark:bg-amber-900/80 text-amber-600 dark:text-amber-200 ring-2 ring-amber-300 dark:ring-amber-800/60',
      titleColor: 'text-amber-900 dark:text-amber-100',
      accentColor: 'text-amber-600 dark:text-amber-400',
      progressGrad: 'from-amber-500 via-orange-500 to-yellow-400',
    },
    {
      key: 'other',
      label: 'បំណិនផ្សេងៗ',
      icon: '🎨',
      cardGradient: 'from-purple-500/10 via-fuchsia-500/5 to-violet-500/5 dark:from-purple-950/40 dark:via-fuchsia-950/20 dark:to-slate-900',
      borderColor: 'border-purple-300 dark:border-purple-700/70',
      headerBg: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-purple-500/25',
      badgeBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-100 dark:bg-purple-900/80 text-purple-600 dark:text-purple-200 ring-2 ring-purple-300 dark:ring-purple-800/60',
      titleColor: 'text-purple-900 dark:text-purple-100',
      accentColor: 'text-purple-600 dark:text-purple-400',
      progressGrad: 'from-purple-500 via-fuchsia-500 to-violet-400',
    },
  ];

  // Helper to extract student sub-score for a specific sub-subject
  const getSubSubjectScore = (subId: string): number => {
    if (subScoresState[selectedMonthKey]?.[currentStudent.id]?.[subId] !== undefined) {
      return Number(subScoresState[selectedMonthKey][currentStudent.id][subId]);
    }
    if (currentStudentMonthlyResult?.grade?.subScores?.[subId] !== undefined) {
      return Number(currentStudentMonthlyResult.grade.subScores[subId]);
    }
    if (grades[selectedMonthKey]?.[currentStudent.id]?.subScores?.[subId] !== undefined) {
      return Number(grades[selectedMonthKey][currentStudent.id].subScores![subId]);
    }
    return 0;
  };

  // Group active sub-subjects by category for the monthly detail view
  const categorizedSubSubjects = useMemo(() => {
    const list = currentPeriodSubSubjects.map((subId) => {
      const def = allSubDefs.find((s) => s.id === subId) || {
        id: subId,
        name: subId,
        category: 'other' as const,
        defaultSelected: true,
      };
      const score = getSubSubjectScore(subId);
      const gradeClass = getGradeClassification(score, gradeThresholds);
      return {
        ...def,
        score,
        gradeClass,
      };
    });

    return categoriesConfig
      .map((cat) => {
        const items = list.filter((item) => item.category === cat.key);
        const total = items.reduce((sum, item) => sum + item.score, 0);
        const avg = items.length > 0 ? Number((total / items.length).toFixed(2)) : 0;
        return {
          ...cat,
          items,
          total,
          avg,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [currentPeriodSubSubjects, allSubDefs, subScoresState, selectedMonthKey, currentStudent.id, currentStudentMonthlyResult, grades, gradeThresholds]);

  const isGirl = currentStudent.gender === 'ស្រី' || (currentStudent.gender as string) === 'F';

  // Calculate attendance stats (absent/permission) for the selected month
  const monthAttendanceStats = useMemo(() => {
    if (!attendance || !selectedMonthKey.startsWith('m')) return { absent: 0, permission: 0 };
    
    const monthNumStr = selectedMonthKey.replace('m', '');
    const monthNum = parseInt(monthNumStr, 10);
    if (isNaN(monthNum)) return { absent: 0, permission: 0 };

    let aCount = 0;
    let pCount = 0;

    Object.keys(attendance).forEach(dateStr => {
      const d = new Date(dateStr);
      if (d.getMonth() + 1 === monthNum) {
        const status = attendance[dateStr][currentStudent.id];
        if (status === 'absent') aCount++;
        if (status === 'permission') pCount++;
      }
    });

    return { absent: aCount, permission: pCount };
  }, [attendance, selectedMonthKey, currentStudent.id]);

  return (
    <div className="space-y-6">
      {/* ================= HERO SECTION / RESULT NAV BAR ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Title & Student Greeting with Student Photo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-400 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 shrink-0 relative overflow-hidden group">
                <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center text-white relative">
                  {currentStudent.avatar && isImageAvatar(currentStudent.avatar) ? (
                    <img
                      src={currentStudent.avatar}
                      alt={currentStudent.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl select-none">
                      {currentStudent.avatar || (isGirl ? '👧' : '👦')}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-moul">
                    លទ្ធផលសិក្សាផ្លូវការ (WikiSchool Sync)
                  </h2>
                  <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    ទិន្នន័យផ្ទាល់ {activeYear}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  របាយការណ៍ពិន្ទុ និងចំណាត់ថ្នាក់សិក្សារបស់សិស្ស ៖ <strong className="text-indigo-600 dark:text-indigo-400 font-moul text-xs">{currentStudent.name}</strong> (លេខកូដ #{currentStudent.rollNo})
                </p>
              </div>
            </div>

            {/* Print Official Report Card Button */}
            <button
              onClick={() => {
                setPrintReportType(resultMode === 'annual' ? 'annual' : resultMode === 'semester' ? (selectedSemester === 1 ? 's1' : 's2') : 'monthly');
                setShowPrintModal(true);
              }}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>មើលព្រឹត្តិបត្រពិន្ទុ / បោះពុម្ព</span>
            </button>
          </div>

          {/* 3 Main Result View Mode Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => setResultMode('monthly')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                resultMode === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="font-moul text-[11px]">១. លទ្ធផលប្រចាំខែ</span>
            </button>

            <button
              onClick={() => setResultMode('semester')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                resultMode === 'semester'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-moul text-[11px]">២. លទ្ធផលប្រចាំឆមាស</span>
            </button>

            <button
              onClick={() => setResultMode('annual')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                resultMode === 'annual'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-md ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span className="font-moul text-[11px]">៣. លទ្ធផលបូកសរុបប្រចាំឆ្នាំ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 1. MONTHLY RESULTS VIEW ================= */}
      {resultMode === 'monthly' && (
        <div className="space-y-6">
          {/* Monthly Sub-Period Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 pl-2 pr-1 shrink-0 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>រដូវកាល ៖</span>
              </span>
              {monthlyPeriods.map((p) => {
                const isSelected = selectedMonthKey === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setSelectedMonthKey(p.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/40'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p.isExam ? <span>⭐</span> : <span>📅</span>}
                    <span>{p.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {currentStudentMonthlyResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (5 Cols): Hero Stats & Ranking Badge */}
              <div className="lg:col-span-5 space-y-6">
                {/* Main Student Rank Card */}
                {(() => {
                  const medalInfo = getRankMedalInfo(currentStudentMonthlyResult.rank);
                  const gradeLetter = currentStudentMonthlyResult.classification?.letter || currentStudentMonthlyResult.letter || 'F';
                  const gradeStyle = getGradeStyle(gradeLetter);
                  const gradeRemarks = currentStudentMonthlyResult.classification?.remarks || currentStudentMonthlyResult.remarks || '';
                  const avgScore = currentStudentMonthlyResult.avg;
                  const avgPercent = Math.min(100, Math.max(0, (avgScore / 10) * 100));

                  return (
                    <div className="group/hero bg-[#0a0f18] rounded-[32px] p-6 sm:p-7 text-sky-100 shadow-[0_0_50px_rgba(14,165,233,0.15)] relative overflow-hidden space-y-6 border border-sky-500/30 ring-1 ring-cyan-400/20 transition-all duration-300 font-sans">
                      {/* Cyber / Hologram Ambient Background */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none mix-blend-screen" />
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                      <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
                      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
                      <div className="absolute top-4 left-4 text-[9px] font-mono text-cyan-500/30 uppercase tracking-widest pointer-events-none">SYS.VER_2.4 // DIGITAL_HUD_ACTIVE</div>

                      {/* Header Row: Month Selector Interactive Button & 3D Jewel Medal */}
                      <div className="flex items-center justify-between relative z-20 gap-3">
                        {/* Interactive Month Selector Button */}
                        <div className="relative" ref={monthDropdownRef}>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setIsMonthDropdownOpen((prev) => !prev)}
                            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 active:bg-cyan-900/60 backdrop-blur-md text-cyan-50 text-xs sm:text-sm font-bold border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer select-none relative group"
                            aria-expanded={isMonthDropdownOpen}
                            aria-label="ជ្រើសរើសខែ"
                          >
                            <span className="w-5 h-5 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shadow-xs">
                              <Calendar className="w-3.5 h-3.5" />
                            </span>
                            <span className="font-moul text-xs text-white drop-shadow-xs">
                              {activePeriodInfo.label}
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-indigo-200 transition-transform duration-300 ${
                                isMonthDropdownOpen ? 'rotate-180 text-amber-300' : ''
                              }`}
                            />
                          </motion.button>

                          {/* Floating Animated Month Selector Popover Menu */}
                          <AnimatePresence>
                            {isMonthDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="absolute left-0 top-full mt-2 w-72 max-h-80 overflow-y-auto z-50 rounded-xl bg-[#0b121e]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_10px_30px_rgba(6,182,212,0.2)] p-2 space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/20"
                              >
                                <div className="px-3 py-1.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wide border-b border-cyan-500/20 flex items-center justify-between font-mono">
                                  <span>ជ្រើសរើសខែដើម្បីមើលលទ្ធផល</span>
                                  <span className="text-[9px] text-slate-400 font-mono">10 ខែ</span>
                                </div>
                                <div className="space-y-1 pt-1">
                                  {monthlyPeriods.map((period) => {
                                    const isSelected = period.key === selectedMonthKey;
                                    return (
                                      <button
                                        key={period.key}
                                        type="button"
                                        onClick={() => {
                                          setSelectedMonthKey(period.key);
                                          setIsMonthDropdownOpen(false);
                                          onShowToast(`បានជ្រើសរើស ${period.label}`);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                          isSelected
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-mono text-indigo-200">
                                            {period.shortLabel}
                                          </span>
                                          <span className="font-moul text-[11px]">{period.label}</span>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-amber-300" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Top-Right 3D Jewel Medal Podium */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-xl shadow-lg transition-transform ${medalInfo.podBg}`}
                          title={`មេដាយចំណាត់ថ្នាក់លេខ ${currentStudentMonthlyResult.rank}`}
                        >
                          <span className="text-2xl drop-shadow-md select-none">{medalInfo.icon}</span>
                        </motion.div>
                      </div>

                      {/* Student Photo & Identity Showcase Pod */}
                      <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/10 hover:bg-white/[0.14] backdrop-blur-xl border border-white/15 shadow-inner relative z-10 transition-all">
                        {/* Student Photo Avatar with Glow Halo & Medal Tag */}
                        <div className="relative shrink-0">
                          <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-0.5 bg-gradient-to-tr ${medalInfo.avatarRing} shadow-lg relative overflow-hidden`}
                          >
                            <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center text-white relative">
                              {currentStudent.avatar && isImageAvatar(currentStudent.avatar) ? (
                                <img
                                  src={currentStudent.avatar}
                                  alt={currentStudent.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span className="text-2xl sm:text-3xl select-none">
                                  {currentStudent.avatar || (isGirl ? '👧' : '👦')}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Corner Mini Medal Icon */}
                          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950/90 border border-white/30 flex items-center justify-center text-xs shadow-md">
                            {medalInfo.icon}
                          </span>
                        </div>

                        {/* Student Name & Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold font-moul text-sky-100 truncate drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]">
                              {currentStudent.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-900/40 text-sky-300 border border-sky-500/30 shrink-0 font-mono">
                              #{currentStudent.rollNo}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-sky-200/70 mt-1 font-mono">
                            {currentStudent.latinName && (
                              <span className="uppercase text-[10px] tracking-widest text-sky-300 font-semibold truncate">
                                {currentStudent.latinName}
                              </span>
                            )}
                            {currentStudent.latinName && <span className="text-[10px] text-slate-400">&bull;</span>}
                            <span className="text-[10px] text-sky-200/80 uppercase tracking-wide">
                              ភេទ ៖ <strong className="text-sky-100">{currentStudent.gender}</strong>
                            </span>
                            {currentStudent.dob && (
                              <>
                                <span className="text-[10px] text-slate-400">&bull;</span>
                                <span className="text-[10px] text-sky-200/80 uppercase tracking-wide">
                                  កំណើត ៖ <span className="font-mono text-sky-100">{currentStudent.dob}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Big Rank Number Display with Fixed Khmer Typography */}
                      <div className="text-center py-2 space-y-2 relative z-10">
                        <div className="flex items-center justify-center gap-2 text-cyan-300/90 text-xs font-bold uppercase tracking-normal font-mono">
                          <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400/60" />
                          <span className="font-moul flex items-center gap-1.5 text-cyan-200 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            ចំណាត់ថ្នាក់ក្នុងថ្នាក់
                          </span>
                          <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400/60" />
                        </div>

                        <div className="flex items-baseline justify-center gap-2">
                          <span
                            className={`text-6xl sm:text-7xl font-black font-moul tracking-normal bg-gradient-to-b ${medalInfo.numGradient} bg-clip-text text-transparent`}
                          >
                            {currentStudentMonthlyResult.rank}
                          </span>
                          <span className="px-3 py-1 bg-cyan-950/40 backdrop-blur-md rounded-lg text-xs font-bold text-cyan-200 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)_inset] font-mono">
                            / {monthlySummary.totalStudents} នាក់
                          </span>
                        </div>

                        {/* Honorary Congratulatory Pill Badge */}
                        <div className="pt-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold border backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono uppercase tracking-wide ${medalInfo.bannerBg.replace("rounded-full", "").replace("bg-white/10", "bg-cyan-900/40 border-cyan-500/30 text-cyan-200")}`}
                          >
                            {medalInfo.bannerText}
                          </span>
                        </div>
                      </div>

                      {/* The Two Result Metric Cards / Buttons */}
                      <div className="grid grid-cols-2 gap-3.5 pt-1 relative z-10">
                        {/* Left Metric Card: មធ្យមភាគពិន្ទុ (GPA Pod) */}
                        <div className="group/card relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-[#0b121e]/80 hover:bg-[#101b2d] backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 hover:-translate-y-0.5">
                          {/* Ambient shimmer line across top edge */}
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none" />

                          <div className="flex items-center justify-between gap-1 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-6 h-6 rounded-lg bg-sky-400/20 text-sky-300 flex items-center justify-center">
                                <TrendingUp className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-[11px] font-bold text-sky-100 uppercase tracking-normal font-moul">
                                មធ្យមភាគពិន្ទុ
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-sky-300/90 font-mono">/10</span>
                          </div>

                          <div className="flex items-baseline justify-center gap-1 my-1">
                            <span className="text-3xl sm:text-4xl font-black text-cyan-50 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                              {avgScore.toFixed(2)}
                            </span>
                          </div>

                          {/* Dynamic GPA Visual Progress Bar */}
                          <div className="w-full bg-cyan-950/40 rounded h-1.5 mt-2 border border-cyan-500/20 overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${avgPercent}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] relative"
                              style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)" }}
                            />
                          </div>
                        </div>

                        {/* Right Metric Card: និទ្ទេស & ការវាយតម្លៃ (Grade Classification Pod) */}
                        <div
                          className={`group/card relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-[#0b121e]/80 hover:bg-[#101b2d] backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 hover:-translate-y-0.5 ${gradeStyle.shadowHover}`}
                        >
                          {/* Ambient shimmer line across top edge */}
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none" />

                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-6 h-6 rounded-lg ${gradeStyle.iconBg} ${gradeStyle.iconColor} flex items-center justify-center`}>
                                <Award className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-[11px] font-bold text-sky-100 uppercase tracking-normal font-moul">
                                និទ្ទេស & ការវាយតម្លៃ
                              </span>
                            </div>
                          </div>

                          {/* Letter Badge */}
                          <div className="flex flex-col items-center justify-center my-1">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black font-moul shadow-lg ${gradeStyle.badge}`}
                            >
                              {gradeLetter}
                            </div>
                            {gradeRemarks && (
                              <span className="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white/95 border border-white/20 backdrop-blur-sm shadow-xs text-center">
                                ({gradeRemarks})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sleek Frosted Summary Footer Capsule */}
                      <div className="pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] sm:text-xs text-slate-300">
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="w-6 h-6 rounded-lg bg-indigo-500/25 text-indigo-200 flex items-center justify-center">
                            <Calculator className="w-3.5 h-3.5" />
                          </span>
                          <span>ពិន្ទុសរុប ៖</span>
                          <strong className="text-white font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                            {currentStudentMonthlyResult.total.toFixed(2)}
                          </strong>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-amber-500/25 text-amber-200 flex items-center justify-center">
                              <Users className="w-3 h-3" />
                            </span>
                            <span>មធ្យមភាគថ្នាក់ ៖</span>
                            <strong className="text-amber-300 font-mono font-bold bg-amber-400/20 px-1.5 py-0.5 rounded text-[11px] border border-amber-400/30">
                              {(() => {
                                const activeStudents = monthlySummary.list.filter(s => s.total > 0);
                                const realClassAvg = activeStudents.length > 0 
                                  ? activeStudents.reduce((sum, s) => sum + s.avg, 0) / activeStudents.length 
                                  : 0;
                                return realClassAvg.toFixed(2);
                              })()}
                            </strong>
                          </div>
                          
                          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                            <span className="w-5 h-5 rounded-md bg-rose-500/25 text-rose-300 flex items-center justify-center">
                              <AlertCircle className="w-3 h-3" />
                            </span>
                            <span className="text-rose-200">អវត្តមាន ៖</span>
                            <strong className="text-rose-300 font-mono font-bold bg-rose-500/20 px-1.5 py-0.5 rounded text-[11px] border border-rose-500/30">
                              {monthAttendanceStats.absent}
                            </strong>
                            <span className="text-orange-200 ml-1">ច្បាប់ ៖</span>
                            <strong className="text-orange-300 font-mono font-bold bg-orange-500/20 px-1.5 py-0.5 rounded text-[11px] border border-orange-500/30">
                              {monthAttendanceStats.permission}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Class Grade Distribution Breakdown Mini Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-moul flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>ស្ថិតិនិទ្ទេសក្នុងថ្នាក់ ({activePeriodInfo.shortLabel})</span>
                  </h4>
                  <div className="grid grid-cols-6 gap-1.5 text-center">
                    {[
                      { l: 'A', count: monthlySummary.countA, bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
                      { l: 'B', count: monthlySummary.countB, bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
                      { l: 'C', count: monthlySummary.countC, bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
                      { l: 'D', count: monthlySummary.countD, bg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
                      { l: 'E', count: monthlySummary.countE, bg: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' },
                      { l: 'F', count: monthlySummary.countF, bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
                    ].map((g) => (
                      <div key={g.l} className={`p-2 rounded-xl border ${g.bg}`}>
                        <div className="text-[11px] font-black">{g.l}</div>
                        <div className="text-xs font-bold mt-0.5">{g.count} នាក់</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (7 Cols): Subject & Sub-subject Breakdown (WikiSchool Sync) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-5 bg-indigo-600 rounded-full" />
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul">
                          ពិន្ទុលម្អិតតាមមុខវិជ្ជា & មេលេខ ({activePeriodInfo.shortLabel})
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          (អាចចុចប៊ូតុង ឬអូសឆ្វេង-ស្តាំដើម្បីមើលគ្រប់មុខវិជ្ជា)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800 whitespace-nowrap">
                        វាយតម្លៃ {currentPeriodSubSubjects.length} មេលេខ
                      </span>
                      {/* Navigation Arrows for Horizontal Scrolling */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (subjectsScrollRef.current) {
                              subjectsScrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
                          title="អូសទៅឆ្វេង"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (subjectsScrollRef.current) {
                              subjectsScrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
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

                  {/* Render Categories & Sub-Subjects (Horizontal Scrollable with Rich Vibrant Colors) */}
                  {categorizedSubSubjects.length > 0 ? (
                    <div
                      ref={subjectsScrollRef}
                      className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
                    >
                      {categorizedSubSubjects.map((cat) => (
                        <div
                          key={cat.key}
                          className={`shrink-0 w-80 sm:w-96 bg-gradient-to-br ${cat.cardGradient} rounded-3xl p-4 sm:p-5 border-2 ${cat.borderColor} flex flex-col justify-between space-y-3.5 shadow-sm hover:shadow-md transition`}
                        >
                          {/* Category Header */}
                          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xl shadow-xs ${cat.iconBg}`}>
                                {cat.icon}
                              </span>
                              <div>
                                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-moul">
                                  {cat.label}
                                </h4>
                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${cat.badgeBg}`}>
                                  {cat.items.length} មេលេខ
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                                មធ្យមភាគ
                              </span>
                              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                <span className={cat.accentColor}>{cat.avg.toFixed(2)}</span>
                                <span className="text-[10px] text-slate-400 font-normal"> /10</span>
                              </div>
                            </div>
                          </div>

                          {/* Sub-Subject Items List */}
                          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                            {cat.items.map((sub) => {
                              const pct = Math.min(100, (sub.score / 10) * 100);
                              const scoreColor =
                                sub.score >= 8.5
                                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800'
                                  : sub.score >= 7.0
                                  ? 'text-blue-700 dark:text-blue-300 bg-blue-100/90 dark:bg-blue-950/70 border-blue-300 dark:border-blue-800'
                                  : sub.score >= 5.0
                                  ? 'text-amber-700 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800'
                                  : 'text-rose-700 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800';

                              const barGrad =
                                sub.score >= 8.5
                                  ? 'from-emerald-500 to-teal-400'
                                  : sub.score >= 7.0
                                  ? 'from-blue-500 to-cyan-400'
                                  : sub.score >= 5.0
                                  ? 'from-amber-500 to-orange-400'
                                  : 'from-rose-500 to-red-400';

                              return (
                                <div
                                  key={sub.id}
                                  className="bg-white/95 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pr-1">
                                      {sub.name}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-lg border text-xs font-black shrink-0 ${scoreColor}`}>
                                      {sub.score > 0 ? sub.score.toFixed(1) : '០.០'}
                                    </span>
                                  </div>

                                  {/* Progress bar */}
                                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                                    <div
                                      className={`h-full rounded-full bg-gradient-to-r ${barGrad} transition-all duration-300`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>

                                  <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-500 dark:text-slate-400">
                                      និទ្ទេស <strong className="text-indigo-600 dark:text-indigo-400 font-black">{sub.gradeClass.letter}</strong>
                                    </span>
                                    <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                                      {sub.gradeClass.remarks}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Fallback to main 4 subjects if no sub-subjects are configured (Horizontal Scrollable with Colors) */
                    <div
                      ref={subjectsScrollRef}
                      className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
                    >
                      {[
                        {
                          key: 'khmer',
                          label: 'ភាសាខ្មែរ',
                          icon: '🇰🇭',
                          score: currentStudentMonthlyResult.khmer,
                          cardGrad: 'from-rose-500/10 via-pink-500/5 to-transparent',
                          border: 'border-rose-300 dark:border-rose-700/70',
                          badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200',
                          bar: 'from-rose-500 to-pink-500',
                        },
                        {
                          key: 'math',
                          label: 'គណិតវិទ្យា',
                          icon: '📐',
                          score: currentStudentMonthlyResult.math,
                          cardGrad: 'from-blue-500/10 via-indigo-500/5 to-transparent',
                          border: 'border-blue-300 dark:border-blue-700/70',
                          badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200',
                          bar: 'from-blue-500 to-indigo-500',
                        },
                        {
                          key: 'science',
                          label: 'វិទ្យាសាស្ត្រ',
                          icon: '🔬',
                          score: currentStudentMonthlyResult.science,
                          cardGrad: 'from-emerald-500/10 via-teal-500/5 to-transparent',
                          border: 'border-emerald-300 dark:border-emerald-700/70',
                          badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200',
                          bar: 'from-emerald-500 to-teal-500',
                        },
                        {
                          key: 'social',
                          label: 'សិក្សាសង្គម',
                          icon: '🌍',
                          score: currentStudentMonthlyResult.social,
                          cardGrad: 'from-amber-500/10 via-orange-500/5 to-transparent',
                          border: 'border-amber-300 dark:border-amber-700/70',
                          badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200',
                          bar: 'from-amber-500 to-orange-500',
                        },
                      ].map((sub) => {
                        const pct = Math.min(100, (sub.score / 10) * 100);
                        const subClass = getGradeClassification(sub.score, gradeThresholds);
                        return (
                          <div
                            key={sub.key}
                            className={`shrink-0 w-64 sm:w-72 p-4 rounded-3xl border-2 bg-gradient-to-br ${sub.cardGrad} ${sub.border} flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl">{sub.icon}</span>
                                <div>
                                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-moul">
                                    {sub.label}
                                  </h4>
                                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${sub.badge}`}>
                                    និទ្ទេស {subClass.letter} ({subClass.remarks})
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                                  {sub.score.toFixed(1)}
                                  <span className="text-xs text-slate-400 font-normal"> /10</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="w-full h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700">
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${sub.bar}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                <span>កម្រិតពិន្ទុ</span>
                                <span>{pct.toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Performance Sparkline / Trend Card with Horizontal Scroll */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-5 bg-purple-600 rounded-full" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white font-moul">
                        ដំណើរវិវត្តពិន្ទុមធ្យមភាគប្រចាំខែ (Academic Trend - អូសឆ្វេងស្តាំ)
                      </h3>
                    </div>
                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (trendScrollRef.current) {
                            trendScrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
                          }
                        }}
                        className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
                        title="ថយក្រោយ"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (trendScrollRef.current) {
                            trendScrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
                          }
                        }}
                        className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
                        title="ទៅមុខ"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scrollable Trend Container with Rich Vibrant Colors */}
                  <div
                    ref={trendScrollRef}
                    className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
                  >
                    {studentYearlyTrend.map((t, idx) => {
                      const isSelected = selectedMonthKey === t.key;
                      
                      // Vibrant card themes by cycle
                      const trendCardColors = [
                        { grad: 'from-blue-500/15 via-indigo-500/5 to-white dark:to-slate-900', border: 'border-blue-200 dark:border-blue-800/80', tag: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200', score: 'text-blue-600 dark:text-blue-400' },
                        { grad: 'from-indigo-500/15 via-violet-500/5 to-white dark:to-slate-900', border: 'border-indigo-200 dark:border-indigo-800/80', tag: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200', score: 'text-indigo-600 dark:text-indigo-400' },
                        { grad: 'from-purple-500/15 via-pink-500/5 to-white dark:to-slate-900', border: 'border-purple-200 dark:border-purple-800/80', tag: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200', score: 'text-purple-600 dark:text-purple-400' },
                        { grad: 'from-rose-500/15 via-pink-500/5 to-white dark:to-slate-900', border: 'border-rose-200 dark:border-rose-800/80', tag: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200', score: 'text-rose-600 dark:text-rose-400' },
                        { grad: 'from-amber-500/15 via-orange-500/5 to-white dark:to-slate-900', border: 'border-amber-200 dark:border-amber-800/80', tag: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200', score: 'text-amber-600 dark:text-amber-400' },
                        { grad: 'from-emerald-500/15 via-teal-500/5 to-white dark:to-slate-900', border: 'border-emerald-200 dark:border-emerald-800/80', tag: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200', score: 'text-emerald-600 dark:text-emerald-400' },
                        { grad: 'from-teal-500/15 via-cyan-500/5 to-white dark:to-slate-900', border: 'border-teal-200 dark:border-teal-800/80', tag: 'bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200', score: 'text-teal-600 dark:text-teal-400' },
                      ];
                      const theme = trendCardColors[idx % trendCardColors.length];

                      const rankBadge =
                        t.rank === 1
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-sm shadow-amber-400/30 font-black'
                          : t.rank === 2
                          ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900 font-bold'
                          : t.rank === 3
                          ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold'
                          : t.rank > 0
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400';

                      return (
                        <div
                          key={t.key}
                          onClick={() => setSelectedMonthKey(t.key as any)}
                          className={`shrink-0 w-36 sm:w-44 p-4 rounded-3xl border-2 transition cursor-pointer text-center flex flex-col justify-between shadow-xs hover:shadow-md ${
                            isSelected
                              ? 'bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-indigo-50/50 dark:to-slate-900 border-indigo-500 ring-3 ring-indigo-400/40 shadow-indigo-500/15'
                              : t.isExam
                              ? 'bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-white dark:to-slate-900 border-amber-400 dark:border-amber-600 shadow-amber-500/10'
                              : `bg-gradient-to-br ${theme.grad} ${theme.border} hover:border-indigo-300 dark:hover:border-indigo-700`
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                t.isExam
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300'
                                  : theme.tag
                              }`}>
                                {t.isExam ? '⭐ ប្រឡង' : '📅 ប្រចាំខែ'}
                              </span>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                              )}
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate font-moul mt-1">
                              {t.shortLabel}
                            </span>
                          </div>

                          <div className="my-2.5">
                            <div className={`text-2xl sm:text-3xl font-black ${
                              t.avg >= 8.5
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : t.avg >= 7.0
                                ? 'text-blue-600 dark:text-blue-400'
                                : t.avg >= 5.0
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {t.avg > 0 ? t.avg.toFixed(2) : '-'}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400">មធ្យមភាគ /10</span>
                          </div>

                          <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">ចំណាត់ថ្នាក់</span>
                            <span className={`px-2 py-0.5 rounded-lg text-xs ${rankBadge}`}>
                              {t.rank === 1 ? '🥇 លេខ ១' : t.rank === 2 ? '🥈 លេខ ២' : t.rank === 3 ? '🥉 លេខ ៣' : t.rank > 0 ? `លេខ ${t.rank}` : '-'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center space-y-3 border border-slate-200 dark:border-slate-800">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-moul">
                មិនទាន់មានទិន្នន័យពិន្ទុសម្រាប់ខែនេះនៅឡើយទេ
              </h3>
              <p className="text-xs text-slate-500">
                សូមជ្រើសរើសខែផ្សេងទៀត ដើម្បីពិនិត្យមើលលទ្ធផលសិក្សា។
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= 2. SEMESTER RESULTS VIEW ================= */}
      {resultMode === 'semester' && (
        <div className="space-y-6">
          {/* Semester Selector Tab */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setSelectedSemester(1)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                selectedSemester === 1
                  ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/40'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>📊 ឆមាសទី១ (តុលា - មករា + ប្រឡងឆមាស)</span>
            </button>
            <button
              onClick={() => setSelectedSemester(2)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                selectedSemester === 2
                  ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/40'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>📊 ឆមាសទី២ (កុម្ភៈ - កញ្ញា + ប្រឡងឆមាស)</span>
            </button>
          </div>

          {currentStudentSemesterResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Hero Rank & Formula Card */}
              <div className="lg:col-span-5 space-y-6">
                {(() => {
                  const medalInfo = getRankMedalInfo(currentStudentSemesterResult.rank);
                  const gradeLetter = currentStudentSemesterResult.classification?.letter || currentStudentSemesterResult.letter || 'F';
                  const gradeStyle = getGradeStyle(gradeLetter);
                  const gradeRemarks = currentStudentSemesterResult.classification?.remarks || currentStudentSemesterResult.remarks || '';
                  const semAvg = currentStudentSemesterResult.semesterAvg;
                  const semPercent = Math.min(100, Math.max(0, (semAvg / 10) * 100));

                  return (
                    <div className="group/hero bg-gradient-to-br from-slate-950 via-purple-950/95 to-indigo-950 rounded-[32px] p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden space-y-6 border border-purple-500/30 ring-1 ring-white/10 transition-all duration-300">
                      {/* Top Ambient Sheen & Atmospheric Glows */}
                      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-300/40 to-transparent pointer-events-none" />
                      <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-tr from-indigo-600/20 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                      {/* Header Row: Semester Badge & 3D Jewel Medal */}
                      <div className="flex items-center justify-between relative z-20 gap-3">
                        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-xl text-white text-xs sm:text-sm font-bold border border-white/25 shadow-lg shadow-black/25">
                          <span className="w-5 h-5 rounded-lg bg-purple-400/20 text-purple-300 flex items-center justify-center shadow-xs">
                            <Layers className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-moul text-xs text-purple-200">
                            សរុបលទ្ធផល ឆមាសទី{selectedSemester}
                          </span>
                        </div>

                        {/* Top-Right 3D Jewel Medal Podium */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-xl shadow-lg transition-transform ${medalInfo.podBg}`}
                          title={`មេដាយចំណាត់ថ្នាក់ឆមាសលេខ ${currentStudentSemesterResult.rank}`}
                        >
                          <span className="text-2xl drop-shadow-md select-none">{medalInfo.icon}</span>
                        </motion.div>
                      </div>

                      {/* Student Photo & Identity Showcase Pod */}
                      <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/10 hover:bg-white/[0.14] backdrop-blur-xl border border-white/15 shadow-inner relative z-10 transition-all">
                        {/* Student Photo Avatar with Glow Halo & Medal Tag */}
                        <div className="relative shrink-0">
                          <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-0.5 bg-gradient-to-tr ${medalInfo.avatarRing} shadow-lg relative overflow-hidden`}
                          >
                            <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center text-white relative">
                              {currentStudent.avatar && isImageAvatar(currentStudent.avatar) ? (
                                <img
                                  src={currentStudent.avatar}
                                  alt={currentStudent.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span className="text-2xl sm:text-3xl select-none">
                                  {currentStudent.avatar || (isGirl ? '👧' : '👦')}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Corner Mini Medal Icon */}
                          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950/90 border border-white/30 flex items-center justify-center text-xs shadow-md">
                            {medalInfo.icon}
                          </span>
                        </div>

                        {/* Student Name & Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold font-moul text-sky-100 truncate drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]">
                              {currentStudent.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-purple-200 border border-white/20 shrink-0 font-mono">
                              #{currentStudent.rollNo}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-purple-200/90 mt-1">
                            {currentStudent.latinName && (
                              <span className="uppercase text-[10px] tracking-widest text-sky-300 font-semibold truncate">
                                {currentStudent.latinName}
                              </span>
                            )}
                            {currentStudent.latinName && <span className="text-[10px] text-slate-400">&bull;</span>}
                            <span className="text-[10px] text-sky-200/80 uppercase tracking-wide">
                              ភេទ ៖ <strong className="text-sky-100">{currentStudent.gender}</strong>
                            </span>
                            {currentStudent.dob && (
                              <>
                                <span className="text-[10px] text-slate-400">&bull;</span>
                                <span className="text-[10px] text-sky-200/80 uppercase tracking-wide">
                                  កំណើត ៖ <span className="font-mono text-sky-100">{currentStudent.dob}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Big Semester Rank Display with Fixed Khmer Typography */}
                      <div className="text-center py-2 space-y-2 relative z-10">
                        <div className="flex items-center justify-center gap-2 text-purple-200/90 text-xs font-bold uppercase tracking-normal">
                          <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-400/60" />
                          <span className="font-moul flex items-center gap-1.5 text-purple-200">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            ចំណាត់ថ្នាក់ប្រចាំឆមាសទី{selectedSemester}
                          </span>
                          <div className="w-8 h-px bg-gradient-to-l from-transparent to-purple-400/60" />
                        </div>

                        <div className="flex items-baseline justify-center gap-2">
                          <span
                            className={`text-6xl sm:text-7xl font-black font-moul tracking-normal bg-gradient-to-b ${medalInfo.numGradient} bg-clip-text text-transparent`}
                          >
                            {currentStudentSemesterResult.rank}
                          </span>
                          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-purple-200 border border-white/15 shadow-inner">
                            / {semesterSummary.totalStudents} នាក់
                          </span>
                        </div>

                        {/* Evaluation Status Pill */}
                        <div className="pt-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${
                              currentStudentSemesterResult.passed
                                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                                : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                            }`}
                          >
                            {currentStudentSemesterResult.passed ? '✅ ជាប់ការវាយតម្លៃប្រចាំឆមាស' : '⚠️ ត្រូវខិតខំបន្ថែម'}
                          </span>
                        </div>
                      </div>

                      {/* The Two Result Metric Cards / Buttons */}
                      <div className="grid grid-cols-2 gap-3.5 pt-1 relative z-10">
                        {/* Left Metric Card: មធ្យមភាគឆមាស */}
                        <div className="group/card relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-xl border border-white/20 hover:border-white/35 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-purple-500/25">
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-300/70 to-transparent pointer-events-none" />

                          <div className="flex items-center justify-between gap-1 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-6 h-6 rounded-lg bg-purple-400/20 text-purple-300 flex items-center justify-center">
                                <TrendingUp className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-[11px] font-bold text-purple-100 uppercase tracking-normal font-moul">
                                មធ្យមភាគឆមាស
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-purple-300/90 font-mono">/10</span>
                          </div>

                          <div className="flex items-baseline justify-center gap-1 my-1">
                            <span className="text-3xl sm:text-4xl font-black text-cyan-50 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                              {semAvg.toFixed(2)}
                            </span>
                          </div>

                          <div className="w-full bg-cyan-950/40 rounded h-1.5 mt-2 border border-cyan-500/20 overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${semPercent}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full rounded-full bg-gradient-to-r from-purple-400 via-indigo-400 to-emerald-400"
                            />
                          </div>
                        </div>

                        {/* Right Metric Card: និទ្ទេសរួម */}
                        <div
                          className={`group/card relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-[#0b121e]/80 hover:bg-[#101b2d] backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 hover:-translate-y-0.5 ${gradeStyle.shadowHover}`}
                        >
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none" />

                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-6 h-6 rounded-lg ${gradeStyle.iconBg} ${gradeStyle.iconColor} flex items-center justify-center`}>
                                <Award className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-[11px] font-bold text-purple-100 uppercase tracking-normal font-moul">
                                និទ្ទេសរួម
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-center my-1">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black font-moul shadow-lg ${gradeStyle.badge}`}
                            >
                              {gradeLetter}
                            </div>
                            {gradeRemarks && (
                              <span className="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white/95 border border-white/20 backdrop-blur-sm shadow-xs text-center">
                                ({gradeRemarks})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* MoEYS Official Calculation Breakdown Box */}
                      <div className="p-4 bg-purple-950/70 rounded-2xl border border-purple-500/30 text-xs space-y-2 relative z-10 backdrop-blur-md">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5 font-moul text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>រូបមន្តគណនាផ្លូវការក្រសួង (MoEYS) ៖</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                          (មធ្យមភាគប្រចាំខែ {currentStudentSemesterResult.monthlyMean.toFixed(2)} + ប្រឡងឆមាស {currentStudentSemesterResult.examAvg.toFixed(2)}) ÷ 2 = <strong className="text-white font-bold">{currentStudentSemesterResult.semesterAvg.toFixed(2)}</strong>
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: Month-by-Month Breakdown Table */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-5 bg-purple-600 rounded-full" />
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul">
                        តារាងពិន្ទុខែនីមួយៗ ក្នុងឆមាសទី{selectedSemester}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentStudentSemesterResult.monthAverages.map((ma) => (
                      <div
                        key={ma.periodKey}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
                            📅
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                            {ma.shortLabel}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-black text-slate-900 dark:text-white">
                            {ma.avg.toFixed(2)}
                            <span className="text-xs text-slate-400 font-normal"> /10</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Official Exam Row */}
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold text-base shadow-inner">
                          ⭐
                        </span>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-moul block">
                            ពិន្ទុប្រឡងឆមាសទី{selectedSemester}
                          </span>
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                            ការប្រឡងផ្លូវការចុងឆមាស
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-amber-900 dark:text-amber-200">
                          {currentStudentSemesterResult.examAvg.toFixed(2)}
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-normal"> /10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center space-y-3 border border-slate-200 dark:border-slate-800">
              <AlertCircle className="w-10 h-10 text-purple-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-moul">
                មិនទាន់មានទិន្នន័យសម្រាប់ឆមាសទី{selectedSemester}នៅឡើយទេ
              </h3>
            </div>
          )}
        </div>
      )}

      {/* ================= 3. ANNUAL / YEARLY SUMMARY VIEW ================= */}
      {resultMode === 'annual' && (
        <div className="space-y-6">
          {currentStudentAnnualResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Trophy & Final Annual Ranking */}
              <div className="lg:col-span-5 space-y-6">
                {(() => {
                  const medalInfo = getRankMedalInfo(currentStudentAnnualResult.rank);
                  const gradeLetter = currentStudentAnnualResult.classification?.letter || currentStudentAnnualResult.letter || 'F';
                  const gradeStyle = getGradeStyle(gradeLetter);
                  const gradeRemarks = currentStudentAnnualResult.classification?.remarks || currentStudentAnnualResult.remarks || '';
                  const annualAvg = currentStudentAnnualResult.annualAvg;
                  const annualPercent = Math.min(100, Math.max(0, (annualAvg / 10) * 100));

                  return (
                    <div className="group/hero bg-gradient-to-br from-slate-950 via-amber-950/95 to-stone-950 rounded-[32px] p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden space-y-6 border border-amber-500/30 ring-1 ring-white/10 transition-all duration-300">
                      {/* Top Ambient Sheen & Atmospheric Glows */}
                      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent pointer-events-none" />
                      <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-tr from-yellow-600/20 to-amber-600/10 rounded-full blur-3xl pointer-events-none" />

                      {/* Header Row: Annual Trophy Badge & Crown Podium */}
                      <div className="flex items-center justify-between relative z-20 gap-3">
                        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-amber-500/20 backdrop-blur-xl text-amber-300 text-xs sm:text-sm font-bold border border-amber-400/30 shadow-lg shadow-black/25">
                          <span className="w-5 h-5 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shadow-xs">
                            <Trophy className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-moul text-xs">
                            🏆 បូកសរុបលទ្ធផលប្រចាំឆ្នាំ
                          </span>
                        </div>

                        {/* Top-Right Crown Jewel Podium */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-xl shadow-lg transition-transform ${medalInfo.podBg}`}
                          title={`ចំណាត់ថ្នាក់ប្រចាំឆ្នាំលេខ ${currentStudentAnnualResult.rank}`}
                        >
                          <span className="text-2xl drop-shadow-md select-none">👑</span>
                        </motion.div>
                      </div>

                      {/* Student Photo & Identity Showcase Pod */}
                      <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/10 hover:bg-white/[0.14] backdrop-blur-xl border border-amber-400/20 shadow-inner relative z-10 transition-all">
                        {/* Student Photo Avatar with Glow Halo & Medal Tag */}
                        <div className="relative shrink-0">
                          <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-0.5 bg-gradient-to-tr ${medalInfo.avatarRing} shadow-lg relative overflow-hidden`}
                          >
                            <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center text-white relative">
                              {currentStudent.avatar && isImageAvatar(currentStudent.avatar) ? (
                                <img
                                  src={currentStudent.avatar}
                                  alt={currentStudent.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span className="text-2xl sm:text-3xl select-none">
                                  {currentStudent.avatar || (isGirl ? '👧' : '👦')}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Corner Crown Pin */}
                          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950/90 border border-amber-400/40 flex items-center justify-center text-xs shadow-md">
                            👑
                          </span>
                        </div>

                        {/* Student Name & Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold font-moul text-amber-200 truncate drop-shadow-xs">
                              {currentStudent.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30 shrink-0 font-mono">
                              #{currentStudent.rollNo}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-amber-100/90 mt-1">
                            {currentStudent.latinName && (
                              <span className="font-mono uppercase text-[11px] tracking-wide text-amber-300/80 font-semibold truncate">
                                {currentStudent.latinName}
                              </span>
                            )}
                            {currentStudent.latinName && <span className="text-[10px] text-amber-400/50">&bull;</span>}
                            <span className="text-[11px] text-slate-200">
                              ភេទ ៖ <strong className="text-sky-100">{currentStudent.gender}</strong>
                            </span>
                            {currentStudent.dob && (
                              <>
                                <span className="text-[10px] text-amber-400/50">&bull;</span>
                                <span className="text-[11px] text-slate-200">
                                  កំណើត ៖ <span className="font-mono text-amber-100">{currentStudent.dob}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Big Annual Rank Display with Fixed Khmer Typography */}
                      <div className="text-center py-2 space-y-2 relative z-10">
                        <div className="flex items-center justify-center gap-2 text-amber-200/90 text-xs font-bold uppercase tracking-normal">
                          <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-400/60" />
                          <span className="font-moul flex items-center gap-1.5 text-amber-200">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                            ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ (Annual Rank)
                          </span>
                          <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-400/60" />
                        </div>

                        <div className="flex items-baseline justify-center gap-2">
                          <span
                            className={`text-6xl sm:text-7xl font-black font-moul tracking-normal bg-gradient-to-b ${medalInfo.numGradient} bg-clip-text text-transparent`}
                          >
                            {currentStudentAnnualResult.rank}
                          </span>
                          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-200 border border-white/15 shadow-inner">
                            / {annualSummary.totalStudents} នាក់
                          </span>
                        </div>

                        {/* Promotion Status Pill */}
                        <div className="pt-1">
                          <span className="inline-flex items-center gap-1.5 bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full shadow-md backdrop-blur-md">
                            🎉 {currentStudentAnnualResult.annualResult || (currentStudentAnnualResult.passed ? 'ជាប់ឡើងថ្នាក់ (Promoted)' : 'ត្រូវរៀនសង')}
                          </span>
                        </div>
                      </div>

                      {/* The Two Result Metric Cards / Buttons */}
                      <div className="grid grid-cols-2 gap-3.5 pt-1 relative z-10">
                        {/* Left Metric Card: មធ្យមភាគប្រចាំឆ្នាំ */}
                        <div className="group/card relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-xl border border-white/20 hover:border-white/35 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-amber-500/25">
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none" />

                          <div className="flex items-center justify-between gap-1 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                                <TrendingUp className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-[11px] font-bold text-amber-100 uppercase tracking-normal font-moul">
                                មធ្យមភាគប្រចាំឆ្នាំ
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-amber-300/90 font-mono">/10</span>
                          </div>

                          <div className="flex items-baseline justify-center gap-1 my-1">
                            <span className="text-3xl sm:text-4xl font-black text-cyan-50 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                              {annualAvg.toFixed(2)}
                            </span>
                          </div>

                          <div className="w-full bg-cyan-950/40 rounded h-1.5 mt-2 border border-cyan-500/20 overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${annualPercent}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400"
                            />
                          </div>
                        </div>

                        {/* Right Metric Card: និទ្ទេសប្រចាំឆ្នាំ */}
                        <div
                          className={`group/card relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-[#0b121e]/80 hover:bg-[#101b2d] backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 hover:-translate-y-0.5 ${gradeStyle.shadowHover}`}
                        >
                          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none" />

                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-6 h-6 rounded-lg ${gradeStyle.iconBg} ${gradeStyle.iconColor} flex items-center justify-center`}>
                                <Award className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-[11px] font-bold text-amber-100 uppercase tracking-normal font-moul">
                                និទ្ទេសប្រចាំឆ្នាំ
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-center my-1">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black font-moul shadow-lg ${gradeStyle.badge}`}
                            >
                              {gradeLetter}
                            </div>
                            {gradeRemarks && (
                              <span className="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white/95 border border-white/20 backdrop-blur-sm shadow-xs text-center">
                                ({gradeRemarks})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Annual Calculation Formula Info */}
                      <div className="p-4 bg-amber-950/70 rounded-2xl border border-amber-500/30 text-xs space-y-2 relative z-10 backdrop-blur-md">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5 font-moul text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>រូបមន្តគណនាប្រចាំឆ្នាំ (MoEYS) ៖</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                          (ឆមាសទី១ {currentStudentAnnualResult.sem1Avg.toFixed(2)} + ឆមាសទី២ {currentStudentAnnualResult.sem2Avg.toFixed(2)}) ÷ 2 = <strong className="text-white font-bold">{currentStudentAnnualResult.annualAvg.toFixed(2)}</strong>
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: Comparison Card between Semester 1 and Semester 2 */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-5 bg-amber-500 rounded-full" />
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul">
                        ការប្រៀបធៀបឆមាសទី១ និងឆមាសទី២
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Semester 1 Card */}
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-indigo-700 dark:text-indigo-300 font-moul">
                          ឆមាសទី១ (Semester 1)
                        </span>
                        <span className="text-xl">📊</span>
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {currentStudentAnnualResult.sem1Avg.toFixed(2)}
                        <span className="text-xs text-slate-400 font-normal"> /10</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        ពិន្ទុមធ្យមភាគរួមឆមាសទី១
                      </p>
                    </div>

                    {/* Semester 2 Card */}
                    <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-purple-700 dark:text-purple-300 font-moul">
                          ឆមាសទី២ (Semester 2)
                        </span>
                        <span className="text-xl">📈</span>
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {currentStudentAnnualResult.sem2Avg.toFixed(2)}
                        <span className="text-xs text-slate-400 font-normal"> /10</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        ពិន្ទុមធ្យមភាគរួមឆមាសទី២
                      </p>
                    </div>
                  </div>

                  {/* Growth / Improvement Indicator */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                          ការរីកចម្រើន (Semester 2 vs Semester 1)
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {currentStudentAnnualResult.sem2Avg >= currentStudentAnnualResult.sem1Avg
                            ? 'កើនឡើង +' + (currentStudentAnnualResult.sem2Avg - currentStudentAnnualResult.sem1Avg).toFixed(2) + ' ពិន្ទុ'
                            : 'ថយចុះ -' + (currentStudentAnnualResult.sem1Avg - currentStudentAnnualResult.sem2Avg).toFixed(2) + ' ពិន្ទុ'}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      currentStudentAnnualResult.sem2Avg >= currentStudentAnnualResult.sem1Avg
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {currentStudentAnnualResult.sem2Avg >= currentStudentAnnualResult.sem1Avg ? '📈 កើនឡើង' : '⚠️ ថយចុះ'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center space-y-3 border border-slate-200 dark:border-slate-800">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-moul">
                មិនទាន់មានទិន្នន័យប្រចាំឆ្នាំនៅឡើយទេ
              </h3>
            </div>
          )}
        </div>
      )}

      {/* ================= PRINTABLE STUDENT REPORT CARD MODAL ================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white text-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative border border-slate-200"
          >
            {/* Header Controls (No Print) */}
            <div className="no-print flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-moul">
                  ព្រឹត្តិបត្រពិន្ទុ និងលទ្ធផលសិក្សាសិស្ស (MoEYS Standard)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Switch report type pill */}
                <select
                  value={printReportType}
                  onChange={(e) => setPrintReportType(e.target.value as any)}
                  className="bg-slate-100 border border-slate-300 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="monthly">ព្រឹត្តិបត្រប្រចាំខែ ({activePeriodInfo.shortLabel})</option>
                  <option value="s1">ព្រឹត្តិបត្រឆមាសទី១</option>
                  <option value="s2">ព្រឹត្តិបត្រឆមាសទី២</option>
                  <option value="annual">ព្រឹត្តិបត្របូកសរុបប្រចាំឆ្នាំ</option>
                </select>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>បោះពុម្ព</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Report Card Printable Body */}
            <div className="space-y-6 text-slate-900 font-serif">
              {/* National Header */}
              <div className="text-center space-y-1">
                <h4 className="font-moul text-sm sm:text-base text-slate-900">
                  ព្រះរាជាណាចក្រកម្ពុជា
                </h4>
                <p className="font-moul text-xs text-slate-800">
                  ជាតិ សាសនា ព្រះមហាក្សត្រ
                </p>
                <div className="w-24 h-0.5 bg-slate-800 mx-auto mt-1" />
              </div>

              {/* School & Document Title */}
              <div className="text-center pt-1 space-y-0.5">
                <h3 className="font-moul text-base sm:text-lg text-indigo-950">
                  {printReportType === 'annual'
                    ? 'ព្រឹត្តិបត្រលទ្ធផលសិក្សាបូកសរុបប្រចាំឆ្នាំ'
                    : printReportType === 's1'
                    ? 'ព្រឹត្តិបត្រលទ្ធផលសិក្សាប្រចាំឆមាសទី១'
                    : printReportType === 's2'
                    ? 'ព្រឹត្តិបត្រលទ្ធផលសិក្សាប្រចាំឆមាសទី២'
                    : `ព្រឹត្តិបត្រលទ្ធផលសិក្សាប្រចាំ${activePeriodInfo.shortLabel}`}
                </h3>
                <p className="text-xs text-slate-600 font-sans">
                  {teacherProfile.school || 'សាលាបឋមសិក្សា'} &bull; {teacherProfile.grade || 'ថ្នាក់ទី ៤'} &bull; ឆ្នាំសិក្សា {activeYear}
                </p>
              </div>

              {/* Student Details Grid with Passport Photo Box */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-sans">
                {/* Photo Passport Box (standard MoEYS format) */}
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                  {currentStudent.avatar && isImageAvatar(currentStudent.avatar) ? (
                    <img
                      src={currentStudent.avatar}
                      alt={currentStudent.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center p-1">
                      <span className="text-2xl block">{currentStudent.avatar || (isGirl ? '👧' : '👦')}</span>
                      <span className="text-[8px] text-slate-400 block mt-0.5">រូបថត 4x6</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs flex-1">
                  <div>
                    <span className="text-slate-500">គោត្តនាម និងនាម ៖ </span>
                    <strong className="text-slate-900 font-moul">{currentStudent.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">ភេទ ៖ </span>
                    <strong className="text-slate-900">{currentStudent.gender}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">លេខកូដសិស្ស / អត្តលេខ ៖ </span>
                    <strong className="text-slate-900 font-mono">#{currentStudent.civilId || currentStudent.rollNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">ថ្ងៃខែឆ្នាំកំណើត ៖ </span>
                    <strong className="text-slate-900 font-mono">{currentStudent.dob || '០១/០១/២០១៤'}</strong>
                  </div>
                  {currentStudent.latinName && (
                    <div className="col-span-2">
                      <span className="text-slate-500">អក្សរឡាតាំង ៖ </span>
                      <strong className="text-slate-900 font-mono uppercase tracking-wider">{currentStudent.latinName}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Content depending on printReportType */}
              {printReportType === 'monthly' && (
                <div className="space-y-3 font-sans">
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-300 p-2 text-left w-1/2">មុខវិជ្ជា / មេលេខវាយតម្លៃ</th>
                        <th className="border border-slate-300 p-2 w-20">ពិន្ទុពេញ</th>
                        <th className="border border-slate-300 p-2 w-24">ពិន្ទុទទួលបាន</th>
                        <th className="border border-slate-300 p-2 w-24">និទ្ទេស</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorizedSubSubjects.flatMap((cat) =>
                        cat.items.map((sub, idx) => (
                          <tr key={sub.id} className="hover:bg-slate-50">
                            <td className="border border-slate-300 p-2 font-medium">
                              {sub.name} <span className="text-[10px] text-slate-400">({cat.label})</span>
                            </td>
                            <td className="border border-slate-300 p-2 text-center">១០</td>
                            <td className="border border-slate-300 p-2 text-center font-bold">{sub.score.toFixed(1)}</td>
                            <td className="border border-slate-300 p-2 text-center">{sub.gradeClass.letter}</td>
                          </tr>
                        ))
                      )}
                      <tr className="bg-indigo-50 font-bold font-moul">
                        <td className="border border-slate-300 p-2">មធ្យមភាគរួម & ចំណាត់ថ្នាក់</td>
                        <td className="border border-slate-300 p-2 text-center">១០</td>
                        <td className="border border-slate-300 p-2 text-center text-indigo-700">
                          {currentStudentMonthlyResult?.avg.toFixed(2)}
                        </td>
                        <td className="border border-slate-300 p-2 text-center text-indigo-700">
                          លេខ {currentStudentMonthlyResult?.rank} ({currentStudentMonthlyResult?.classification?.letter || currentStudentMonthlyResult?.letter})
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {(printReportType === 's1' || printReportType === 's2') && currentStudentSemesterResult && (
                <div className="space-y-3 font-sans">
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-300 p-2 text-left">រដូវកាលវាយតម្លៃ</th>
                        <th className="border border-slate-300 p-2">មធ្យមភាគពិន្ទុ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStudentSemesterResult.monthAverages.map((ma) => (
                        <tr key={ma.periodKey}>
                          <td className="border border-slate-300 p-2 font-medium">{ma.shortLabel}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{ma.avg.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-purple-50 font-medium">
                        <td className="border border-slate-300 p-2">មធ្យមភាគប្រចាំខែ (Monthly Mean)</td>
                        <td className="border border-slate-300 p-2 text-center font-bold">{currentStudentSemesterResult.monthlyMean.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-amber-50 font-medium">
                        <td className="border border-slate-300 p-2 font-bold text-amber-900">ពិន្ទុប្រឡងឆមាស</td>
                        <td className="border border-slate-300 p-2 text-center font-black text-amber-900">{currentStudentSemesterResult.examAvg.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-indigo-100 font-bold font-moul">
                        <td className="border border-slate-300 p-2">មធ្យមភាគឆមាសទី{printReportType === 's1' ? '១' : '២'} & ចំណាត់ថ្នាក់</td>
                        <td className="border border-slate-300 p-2 text-center text-indigo-800">
                          {currentStudentSemesterResult.semesterAvg.toFixed(2)} &bull; លេខ {currentStudentSemesterResult.rank} ({currentStudentSemesterResult.classification?.letter || currentStudentSemesterResult.letter})
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {printReportType === 'annual' && currentStudentAnnualResult && (
                <div className="space-y-3 font-sans">
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-300 p-2 text-left">ការវាយតម្លៃ</th>
                        <th className="border border-slate-300 p-2">មធ្យមភាគពិន្ទុ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2 font-medium">មធ្យមភាគឆមាសទី១ (Semester 1)</td>
                        <td className="border border-slate-300 p-2 text-center font-bold">{currentStudentAnnualResult.sem1Avg.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-medium">មធ្យមភាគឆមាសទី២ (Semester 2)</td>
                        <td className="border border-slate-300 p-2 text-center font-bold">{currentStudentAnnualResult.sem2Avg.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-amber-100 font-bold font-moul">
                        <td className="border border-slate-300 p-2">មធ្យមភាគប្រចាំឆ្នាំ & ចំណាត់ថ្នាក់</td>
                        <td className="border border-slate-300 p-2 text-center text-amber-950">
                          {currentStudentAnnualResult.annualAvg.toFixed(2)} &bull; លេខ {currentStudentAnnualResult.rank} ({currentStudentAnnualResult.classification?.letter || currentStudentAnnualResult.letter})
                        </td>
                      </tr>
                      <tr className="bg-emerald-50">
                        <td className="border border-slate-300 p-2 font-bold text-emerald-900">លទ្ធផលបូកសរុបការសិក្សា</td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-emerald-900">
                          {currentStudentAnnualResult.annualResult || (currentStudentAnnualResult.passed ? 'ជាប់ឡើងថ្នាក់' : 'ត្រូវរៀនសង')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Signatures Area */}
              <div className="grid grid-cols-2 gap-6 pt-6 text-center text-xs font-sans">
                <div className="space-y-12">
                  <p className="font-bold text-slate-700">ហត្ថលេខាមាតាបិតា / អាណាព្យាបាល</p>
                  <p className="text-slate-400">............................................</p>
                </div>
                <div className="space-y-12">
                  <p className="font-bold text-slate-700">គ្រូបន្ទុកថ្នាក់ ({teacherProfile.name || 'គ្រូបង្រៀន'})</p>
                  <p className="text-slate-400">............................................</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
