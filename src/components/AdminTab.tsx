import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TimetableDisplay } from './TimetableDisplay';
import { SubjectSyllabusDisplay } from './SubjectSyllabusDisplay';
import { PLPTabletBanner } from './PLPTabletBanner';
import {
  Users,
  BookOpen,
  Box,
  FileBadge,
  UserPlus,
  UserCog,
  Printer,
  Globe,
  ExternalLink,
  Save,
  CheckCircle2,
  PlusCircle,
  Plus,
  FilePlus,
  Trash2,
  Calendar,
  Sparkles,
  Award,
  Trophy,
  BookMarked,
  CheckSquare,
  BarChart3,
  Layers,
  GraduationCap,
  ShieldCheck,
  FileText,
  Users2,
  HeartHandshake,
  BookOpenCheck,
  Compass,
  Clock,
  Smile,
  Building2,
  PhoneCall,
  MessageSquare,
  FileSpreadsheet,
  FileDown,
  Calculator,
  FlaskConical,
  Landmark,
  Activity,
  Languages,
  Gamepad2,
  Laptop,
  Target,
  Wrench,
  Table,
  ChevronRight,
  ArrowRight,
  Eye,
  Copy,
  Check,
  Search,
  Edit3,
  Presentation,
  Smartphone,
  QrCode,
  AlertCircle,
  FileEdit,
  UserCheck,
  UserX,
  CalendarDays,
  CheckCheck,
  RefreshCw,
  ChevronLeft,
  Settings,
  Loader2,
  Cloud,
  Upload,
  Camera,
  Image as ImageIcon,
  KeyRound,
  Palette,
} from 'lucide-react';
import {
  saveYearScopedData,
  loadYearScopedData,
  getActiveAcademicYear,
  saveCompleteYearBundle,
  loadCompleteYearBundle,
} from '../utils/academicYearStorage';
import { shareOrDownloadBackupFile } from '../utils/pwaStorageSync';
import { compressImageFile, isImageAvatar } from '../utils/imageCompressor';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';
import { getKhmerCombinedDate, toKhmerNum } from '../utils/khmerDate';
import { BANNER_THEMES, BannerThemeId, getSavedBannerTheme, saveBannerTheme } from '../utils/bannerThemes';
import { ThemeAnimatedDecorations } from './ThemeAnimatedDecorations';
import { motion, AnimatePresence } from 'motion/react';
import { OfficialGradeReportModal } from './OfficialGradeReportModal';
import { StudentPinManagerModal } from './StudentPinManagerModal';
import { BannerThemePickerModal } from './BannerThemePickerModal';
import { DigitalStudentIdCard } from './DigitalStudentIdCard';
import { KhmerLessonPlanModal } from './KhmerLessonPlanModal';
import { KhmerLessonSlideModal } from './KhmerLessonSlideModal';
import { DigitalClassroomLayout } from './DigitalClassroomLayout';
import { ClassroomRulesPrintModal, DEFAULT_RULES, ClassroomRuleItem } from './ClassroomRulesPrintModal';
import { ClassroomDecorationPrintModal } from './ClassroomDecorationPrintModal';
import { PdfCustomizerModal } from './PdfCustomizerModal';
import { AttendanceManager } from './AttendanceManager';
import { PLCMeetingModal } from './PLCMeetingModal';
import { TeacherParentAgreementsManager } from './TeacherParentAgreementsManager';
import { TeacherPrincipalAgreementEditor } from './TeacherPrincipalAgreementEditor';
import { ModelSchoolStandardsManager } from './ModelSchoolStandardsManager';
import { StudentAnalyticsSection } from './StudentAnalyticsSection';
import { StudentMonitoringLogbook } from './StudentMonitoringLogbook';
import { SubSubjectPeriodConfigModal, CONFIGURABLE_PERIODS } from './SubSubjectPeriodConfigModal';
import { GradeSummaryTable } from './GradeSummaryTable';
import { PracticumTraineesManager } from './PracticumTraineesManager';
import { ClassroomCommitteeOfficialManager } from './ClassroomCommitteeOfficialManager';
import { MoeysPriStatisticsManager } from './MoeysPriStatisticsManager';
import { StudentRosterPrintModal } from './StudentRosterPrintModal';
import { ThursdayWorkReportModal } from './ThursdayWorkReportModal';
import { HonorRollManager } from './HonorRollManager';
import { StudentBookBorrowingManager } from './StudentBookBorrowingManager';
import { khmerLessonPlansList, subjectsList, LessonPlanDetail } from '../data/khmerLessonPlansData';
import {
  parseStudentsCSV,
  SAMPLE_MOEYS_39_STUDENTS_CSV,
  parseExcelWorkbookFile,
  exportStudentsToExcelWorkbook,
  exportSampleMoEYSExcelWorkbook,
} from '../utils/studentImportParser';
import {
  TeacherProfile,
  Student,
  AttendanceDatabase,
  GradeDatabase,
  StudentGrade,
  LogbookEntry,
  InventoryItem,
  PLCMeeting,
  AttendanceStatus,
  BookBorrowingRecord,
  LibraryBook,
} from '../types';
import {
  GradePeriodKey,
  GradeSubject,
  GradePeriodInfo,
  GRADE_PERIODS,
  SEMESTER_1_ENTRY_PERIODS,
  SEMESTER_2_ENTRY_PERIODS,
  ALL_ENTRY_MONTHS,
  getStudentGrade,
  getGradeClassification,
  calculateSinglePeriodSummary,
  calculateSemesterSummary,
  calculateAnnualSummary,
  exportGradesToCsv,
  exportPeriodGradesToCsv,
  defaultMultiPeriodGrades,
  getAllPrimarySubSubjects,
  getCustomSubSubjects,
  saveCustomSubSubjects,
  PrimarySubSubject,
} from '../utils/gradeManager';

interface AdminTabProps {
  teacher: TeacherProfile;
  currentYear?: string;
  onOpenYearManager?: () => void;
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'rollNo'>) => void;
  onUpdateStudent: (student: Student) => void;
  onImportStudents: (students: Student[], replaceAll?: boolean) => void;
  onDeleteStudent: (id: number) => void;
  attendance: AttendanceDatabase;
  onUpdateAttendance: (date: string, studentId: number, status: AttendanceStatus) => void;
  onSaveAttendance: () => void;
  onBatchUpdateAttendance?: (newDb: AttendanceDatabase) => void;
  grades: GradeDatabase;
  onUpdateGrade: (studentId: number, subject: 'khmer' | 'math' | 'science' | 'social', value: number, periodKey?: string) => void;
  onBatchUpdateGrades?: (newGrades: GradeDatabase) => void;
  onSaveGrades: () => void;
  logbook: LogbookEntry[];
  onAddLogbook: (entry: Omit<LogbookEntry, 'id'>) => void;
  inventory: InventoryItem[];
  onAddInventory: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateInventory: (item: InventoryItem) => void;
  onDeleteInventory: (id: number) => void;
  plc: PLCMeeting[];
  onSavePLC: (meeting: PLCMeeting) => void;
  libraryBooks: LibraryBook[];
  onOpenProfile: () => void;
  onOpenAccountSync?: () => void;
  onPrint: () => void;
  onShowToast: (msg: string) => void;
  fontFamily?: string;
  backgroundTheme?: string;
  fontSizeScale?: string;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  teacher,
  currentYear,
  onOpenYearManager,
  onOpenAccountSync,
  students,
  onAddStudent,
  onUpdateStudent,
  onImportStudents,
  onDeleteStudent,
  attendance,
  onUpdateAttendance,
  onSaveAttendance,
  onBatchUpdateAttendance,
  grades,
  onUpdateGrade,
  onBatchUpdateGrades,
  onSaveGrades,
  logbook,
  onAddLogbook,
  inventory,
  onAddInventory,
  onUpdateInventory,
  onDeleteInventory,
  plc,
  onSavePLC,
  libraryBooks,
  onOpenProfile,
  onPrint,
  onShowToast,
  fontFamily = 'Kantumruy Pro',
  backgroundTheme = 'notebook-grid',
  fontSizeScale = 'md',
}) => {
  const [activeMainSec, setActiveMainSec] = useState<'sec1' | 'sec2' | 'sec3' | 'sec4'>(() => {
    try {
      const stored = sessionStorage.getItem('target_admin_section');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.main && ['sec1', 'sec2', 'sec3', 'sec4'].includes(parsed.main)) {
          return parsed.main;
        }
      }
    } catch (e) {}
    return 'sec1';
  });
  const [subSec1, setSubSec1] = useState<'students' | 'id_cards' | 'attendance' | 'grades' | 'honor_roll' | 'monitoring' | 'pri' | 'trainees' | 'stats' | 'behavior' | 'thursday_report' | 'plp' | 'book_borrowing'>(() => {
    try {
      const stored = sessionStorage.getItem('target_admin_section');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.sub && ['students', 'id_cards', 'attendance', 'grades', 'honor_roll', 'monitoring', 'pri', 'trainees', 'stats', 'behavior', 'thursday_report', 'plp', 'book_borrowing'].includes(parsed.sub)) {
          return parsed.sub;
        }
      }
    } catch (e) {}
    return 'students';
  });

  const [bookBorrowings, setBookBorrowings] = useState<BookBorrowingRecord[]>(() => {
    return loadYearScopedData(currentYear || teacher.academicYear, 'book_borrowings', []);
  });

  useEffect(() => {
    saveYearScopedData(currentYear || teacher.academicYear, 'book_borrowings', bookBorrowings);
  }, [bookBorrowings, currentYear, teacher.academicYear]);
  const [isThursdayReportModalOpen, setIsThursdayReportModalOpen] = useState<boolean>(false);
  const [subSec2, setSubSec2] = useState<'timetable' | 'syllabus' | 'lessonplan' | 'slides' | 'assessment'>(() => {
    try {
      const stored = sessionStorage.getItem('target_admin_section');
      if (stored) {
        const parsed = JSON.parse(stored);
        sessionStorage.removeItem('target_admin_section');
        if (parsed.sub && ['timetable', 'syllabus', 'lessonplan', 'slides', 'assessment'].includes(parsed.sub)) {
          return parsed.sub;
        }
      }
    } catch (e) {}
    return 'timetable';
  });
  const [subSec3, setSubSec3] = useState<'inventory' | 'seating' | 'rules' | 'materials' | 'committee'>('committee');
  const [subSec4, setSubSec4] = useState<'plc' | 'model_school' | 'parents' | 'agreements' | 'cpd' | 'self_study' | 'letters'>('plc');
  const [agreementsSubTab, setAgreementsSubTab] = useState<'parents' | 'principal'>('parents');
  const [selectedPortal, setSelectedPortal] = useState<'direct' | 'wikischool' | 'plp'>('direct');
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState<string>('');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState<'all' | 'present' | 'permission' | 'absent'>('all');

  // Grade Management State (Monthly, Semester 1, Semester 2, Annual)
  const [gradeSemesterTab, setGradeSemesterTab] = useState<1 | 2 | 'annual'>(1);
  const [selectedGradePeriod, setSelectedGradePeriod] = useState<GradePeriodKey>('m10');
  const [gradeSearchQuery, setGradeSearchQuery] = useState<string>('');
  const [gradeGenderFilter, setGradeGenderFilter] = useState<'all' | 'ប្រុស' | 'ស្រី'>('all');
  const [gradeRankFilter, setGradeRankFilter] = useState<'all' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'>('all');

  const activeAcademicYearValue = currentYear || teacher.academicYear || getActiveAcademicYear();

  // Banner Theme System (5 Theme Presets: Royal Purple, Digital Tech, Khmer Traditional, Emerald Nature, National Ruby)
  const [bannerThemeId, setBannerThemeId] = useState<BannerThemeId>(() => getSavedBannerTheme());
  const [isBannerThemeModalOpen, setIsBannerThemeModalOpen] = useState<boolean>(false);
  const activeBannerTheme = BANNER_THEMES[bannerThemeId] || BANNER_THEMES.royal_purple;

  const handleSelectBannerTheme = (themeId: BannerThemeId) => {
    setBannerThemeId(themeId);
    saveBannerTheme(themeId);
    onShowToast(`បានប្តូរម៉ូដផ្ទាំងទៅជា៖ ${BANNER_THEMES[themeId].nameKh}`);
  };

  const [gradeThresholds, setGradeThresholds] = useState<{ A: number; B: number; C: number; D: number; E: number }>(() => {
    const yearData = loadYearScopedData<{ A: number; B: number; C: number; D: number; E: number } | null>(activeAcademicYearValue, 'grade_thresholds', null);
    if (yearData) return yearData;
    try {
      const saved = localStorage.getItem('school_grade_thresholds');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { A: 8.5, B: 7.5, C: 6.5, D: 5.0, E: 4.0 };
  });
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [selectedS1Months, setSelectedS1Months] = useState<string[]>(() => {
    const yearData = loadYearScopedData<string[] | null>(activeAcademicYearValue, 'selected_s1_months', null);
    if (yearData && Array.isArray(yearData)) return yearData;
    try {
      const saved = localStorage.getItem('school_selected_s1_months');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['m10', 'm11', 'm12', 'm01'];
  });
  const [selectedS2Months, setSelectedS2Months] = useState<string[]>(() => {
    const yearData = loadYearScopedData<string[] | null>(activeAcademicYearValue, 'selected_s2_months', null);
    if (yearData && Array.isArray(yearData)) return yearData;
    try {
      const saved = localStorage.getItem('school_selected_s2_months');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['m02', 'm03', 'm04', 'm05', 'm06', 'm07'];
  });
  const [isSemesterMonthModalOpen, setIsSemesterMonthModalOpen] = useState(false);
  const [customSubSubjectsState, setCustomSubSubjectsState] = useState<PrimarySubSubject[]>(() => {
    const yearData = loadYearScopedData<PrimarySubSubject[] | null>(activeAcademicYearValue, 'custom_sub_subjects', null);
    if (yearData && Array.isArray(yearData)) return yearData;
    return getCustomSubSubjects();
  });
  const [newSubName, setNewSubName] = useState('');
  const [newSubCategory, setNewSubCategory] = useState<'khmer' | 'math' | 'science' | 'social' | 'other'>('khmer');
  const [activeSubSubjects, setActiveSubSubjects] = useState<string[]>(() => {
    const yearData = loadYearScopedData<string[] | null>(activeAcademicYearValue, 'active_sub_subjects', null);
    if (yearData && Array.isArray(yearData)) return yearData;
    try {
      const saved = localStorage.getItem('school_active_sub_subjects');
      if (saved) return JSON.parse(saved);
    } catch {}
    return getAllPrimarySubSubjects().filter(s => s.defaultSelected).map(s => s.id);
  });
  const [showMainSubjects, setShowMainSubjects] = useState<boolean>(() => {
    const yearData = loadYearScopedData<boolean | null>(activeAcademicYearValue, 'show_main_subjects', null);
    if (yearData !== null) return yearData;
    try {
      const saved = localStorage.getItem('school_show_main_subjects');
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return false; // Default to hiding the 4 main subjects so sub-subjects take primary focus
  });
  const [isSubSubjectModalOpen, setIsSubSubjectModalOpen] = useState(false);
  const [isClearGradesModalOpen, setIsClearGradesModalOpen] = useState(false);
  const [gradeViewMode, setGradeViewMode] = useState<'summary' | 'full'>(() => {
    try {
      const saved = localStorage.getItem('school_grade_view_mode');
      if (saved === 'summary' || saved === 'full') return saved;
    } catch {}
    return 'full';
  });

  // Period-specific sub-subjects mapping (e.g. m10 -> [id1, id2], m11 -> [...])
  const [periodSubSubjectsMap, setPeriodSubSubjectsMap] = useState<Record<string, string[]>>(() => {
    const yearSaved = loadYearScopedData<Record<string, string[]> | null>(
      activeAcademicYearValue,
      'monitoring_period_sub_subjects',
      null
    );
    if (yearSaved && typeof yearSaved === 'object') return yearSaved;
    try {
      const localSaved = localStorage.getItem('school_monitoring_period_sub_subjects');
      if (localSaved) return JSON.parse(localSaved);
    } catch {}
    return {};
  });

  // Keep periodSubSubjectsMap updated when academic year actually changes
  const prevAcademicYearRef = useRef(activeAcademicYearValue);
  useEffect(() => {
    if (prevAcademicYearRef.current !== activeAcademicYearValue) {
      prevAcademicYearRef.current = activeAcademicYearValue;
      const yearSaved = loadYearScopedData<Record<string, string[]> | null>(
        activeAcademicYearValue,
        'monitoring_period_sub_subjects',
        null
      );
      if (yearSaved && typeof yearSaved === 'object') {
        setPeriodSubSubjectsMap(yearSaved);
      } else {
        try {
          const localSaved = localStorage.getItem('school_monitoring_period_sub_subjects');
          if (localSaved) setPeriodSubSubjectsMap(JSON.parse(localSaved));
          else setPeriodSubSubjectsMap({});
        } catch {
          setPeriodSubSubjectsMap({});
        }
      }
    }
  }, [activeAcademicYearValue]);

  const handleSavePeriodSubSubjects = (periodKey: string, subIds: string[]) => {
    setPeriodSubSubjectsMap((prev) => {
      const updated = { ...prev, [periodKey]: subIds };
      saveYearScopedData(activeAcademicYearValue, 'monitoring_period_sub_subjects', updated);
      try {
        localStorage.setItem('school_monitoring_period_sub_subjects', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    triggerConfigSavedToast(`បានរក្សាទុកមុខវិជ្ជារងសម្រាប់ដំណាក់កាលជ្រើសរើសជោគជ័យ!`);
    onShowToast(`បានរក្សាទុកមុខវិជ្ជារងសម្រាប់ដំណាក់កាលជ្រើសរើសជោគជ័យ!`);
  };

  const handleApplySubSubjectsToAllPeriods = (subIds: string[]) => {
    setActiveSubSubjects(subIds);
    saveYearScopedData(activeAcademicYearValue, 'active_sub_subjects', subIds);
    try {
      localStorage.setItem('school_active_sub_subjects', JSON.stringify(subIds));
    } catch {}

    const updated: Record<string, string[]> = {};
    CONFIGURABLE_PERIODS.forEach((p) => {
      updated[p.key] = subIds;
    });
    setPeriodSubSubjectsMap(updated);
    saveYearScopedData(activeAcademicYearValue, 'monitoring_period_sub_subjects', updated);
    try {
      localStorage.setItem('school_monitoring_period_sub_subjects', JSON.stringify(updated));
    } catch {}
    triggerConfigSavedToast(`បានអនុវត្តមុខវិជ្ជារងចំពោះគ្រប់ខែ និងឆមាសទាំងអស់ជោគជ័យ!`);
    onShowToast(`បានអនុវត្តមុខវិជ្ជារងចំពោះគ្រប់ខែ និងឆមាសទាំងអស់ជោគជ័យ!`);
  };

  const [subScoresState, setSubScoresState] = useState<Record<string, Record<number, Record<string, number>>>>(() => {
    const yearData = loadYearScopedData<Record<string, Record<number, Record<string, number>>> | null>(activeAcademicYearValue, 'sub_scores', null);
    if (yearData && typeof yearData === 'object') return yearData;
    try {
      const saved = localStorage.getItem('school_sub_scores_db');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Auto-Save Status State for Grading Table & Configurations
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [autoSaveNotice, setAutoSaveNotice] = useState<string | null>(null);
  const isInitialAutoSaveMount = React.useRef(true);

  // Auto-save effect to active academic year storage whenever grading state or configs change
  useEffect(() => {
    if (isInitialAutoSaveMount.current) {
      isInitialAutoSaveMount.current = false;
      return;
    }

    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      const year = activeAcademicYearValue;
      saveYearScopedData(year, 'sub_scores', subScoresState);
      saveYearScopedData(year, 'active_sub_subjects', activeSubSubjects);
      saveYearScopedData(year, 'custom_sub_subjects', customSubSubjectsState);
      saveYearScopedData(year, 'show_main_subjects', showMainSubjects);
      saveYearScopedData(year, 'selected_s1_months', selectedS1Months);
      saveYearScopedData(year, 'selected_s2_months', selectedS2Months);
      saveYearScopedData(year, 'grade_thresholds', gradeThresholds);

      try {
        localStorage.setItem('school_sub_scores_db', JSON.stringify(subScoresState));
        localStorage.setItem('school_active_sub_subjects', JSON.stringify(activeSubSubjects));
        localStorage.setItem('school_show_main_subjects', JSON.stringify(showMainSubjects));
        localStorage.setItem('school_selected_s1_months', JSON.stringify(selectedS1Months));
        localStorage.setItem('school_selected_s2_months', JSON.stringify(selectedS2Months));
        localStorage.setItem('school_grade_thresholds', JSON.stringify(gradeThresholds));
      } catch {}

      setAutoSaveStatus('saved');
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLastSavedTime(timeStr);
    }, 350);

    return () => clearTimeout(timer);
  }, [
    subScoresState,
    activeSubSubjects,
    customSubSubjectsState,
    showMainSubjects,
    selectedS1Months,
    selectedS2Months,
    gradeThresholds,
    activeAcademicYearValue,
  ]);

  const triggerConfigSavedToast = (message: string) => {
    setAutoSaveNotice(message);
    setAutoSaveStatus('saving');
    const year = activeAcademicYearValue;
    saveYearScopedData(year, 'sub_scores', subScoresState);
    saveYearScopedData(year, 'active_sub_subjects', activeSubSubjects);
    saveYearScopedData(year, 'custom_sub_subjects', customSubSubjectsState);
    saveYearScopedData(year, 'show_main_subjects', showMainSubjects);
    saveYearScopedData(year, 'selected_s1_months', selectedS1Months);
    saveYearScopedData(year, 'selected_s2_months', selectedS2Months);
    saveYearScopedData(year, 'grade_thresholds', gradeThresholds);

    setTimeout(() => {
      setAutoSaveStatus('saved');
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLastSavedTime(timeStr);
      setTimeout(() => {
        setAutoSaveNotice(null);
      }, 2500);
    }, 350);
  };

  const scoreOptions = Array.from({ length: 41 }, (_, i) => Number((i * 0.25).toFixed(2)));

  // Clear Grades for Current Selected Period (Component-level handler)
  const handleClearCurrentPeriodGrades = () => {
    // 1. Build cleared subScores (all 0) for every student in current period
    const clearedPeriodSubScores: Record<number | string, Record<string, number>> = {};
    const allSubIds = getAllPrimarySubSubjects().map(s => s.id);
    students.forEach(st => {
      clearedPeriodSubScores[st.id] = {};
      allSubIds.forEach(subId => {
        clearedPeriodSubScores[st.id][subId] = 0;
      });
    });

    const updatedSub = {
      ...subScoresState,
      [selectedGradePeriod]: clearedPeriodSubScores,
    };
    setSubScoresState(updatedSub);
    saveYearScopedData(activeAcademicYearValue, 'sub_scores', updatedSub);
    try {
      localStorage.setItem('school_sub_scores_db', JSON.stringify(updatedSub));
    } catch {}

    // 2. Set all core subjects and subScores to 0 in grades database
    const newPeriodGrades: Record<number, StudentGrade> = {};
    students.forEach(st => {
      newPeriodGrades[st.id] = {
        khmer: 0,
        math: 0,
        science: 0,
        social: 0,
        subScores: { ...clearedPeriodSubScores[st.id] },
      };
    });

    const newGradesDatabase: GradeDatabase = {
      ...grades,
      [selectedGradePeriod]: newPeriodGrades,
    };

    if (onBatchUpdateGrades) {
      onBatchUpdateGrades(newGradesDatabase);
    } else {
      students.forEach((st) => {
        onUpdateGrade(st.id, 'khmer', 0, selectedGradePeriod);
        onUpdateGrade(st.id, 'math', 0, selectedGradePeriod);
        onUpdateGrade(st.id, 'science', 0, selectedGradePeriod);
        onUpdateGrade(st.id, 'social', 0, selectedGradePeriod);
      });
    }

    setIsClearGradesModalOpen(false);
    const periodName = GRADE_PERIODS.find(p => p.key === selectedGradePeriod)?.label || selectedGradePeriod;
    triggerConfigSavedToast(`🧹 បានសម្អាតទិន្នន័យពិន្ទុសម្រាប់ «${periodName}» ទៅជា 0.00 រួចរាល់!`);
    onShowToast(`🧹 បានសម្អាតពិន្ទុសម្រាប់ «${periodName}» ទៅជា 0.00 ដោយជោគជ័យ!`);
  };

  const [isKhmerModalOpen, setIsKhmerModalOpen] = useState(false);
  const [isKhmerSlideModalOpen, setIsKhmerSlideModalOpen] = useState(false);
  const [selectedSlideLesson, setSelectedSlideLesson] = useState<LessonPlanDetail>(khmerLessonPlansList[0]);
  const [activeLessonSubject, setActiveLessonSubject] = useState<string>('ភាសាខ្មែរ');
  const [modalTargetSubject, setModalTargetSubject] = useState<string>('ទាំងអស់');
  const [modalTargetLessonId, setModalTargetLessonId] = useState<string | undefined>(undefined);
  const [lessonPlanSearch, setLessonPlanSearch] = useState<string>('');

  const [lessonDecks, setLessonDecks] = useState<Array<{
    id: number;
    title: string;
    subject: string;
    grade: string;
    slidesCount: number;
    description: string;
    presenter: string;
    updatedAt: string;
    slides: Array<{ title: string; content: string; bulletPoints: string[] }>;
  }>>([
    {
      id: 1,
      title: 'ភាសាខ្មែរ៖ អានអត្ថបទ "សួនច្បារសាលារៀនខ្ញុំ"',
      subject: 'ភាសាខ្មែរ',
      grade: teacher.grade || 'ថ្នាក់ទី ៤',
      slidesCount: 3,
      description: 'ស្លាយបង្រៀនអន្តរកម្មសម្រាប់ណែនាំវាក្យសព្ទ ការអានយល់ន័យ និងសំណួរពិភាក្សាក្រុម។',
      presenter: teacher.name || 'លោកគ្រូ / អ្នកគ្រូ',
      updatedAt: '២០២៦-០៨-២០',
      slides: [
        { title: 'ស្វាគមន៍មកកាន់ម៉ោងសិក្សា ភាសាខ្មែរ', content: 'មេរៀនទី ១២៖ សួនច្បារសាលារៀនខ្ញុំ', bulletPoints: ['គោលបំណង៖ អាននិងយល់ន័យអត្ថបទ', 'ស្គាល់ពាក្យថ្មីៗក្នុងមេរៀន', 'ការអនុវត្តអានជាគូ និងជាក្រុម'] },
        { title: 'វាក្យសព្ទ និងអត្ថន័យ', content: 'ពាក្យគន្លឹះប្រចាំមេរៀន', bulletPoints: ['- បណ្ដុះបណ្ដាល៖ ដាំដុះ រៀបចំឱ្យលូតលាស់', '- សោភ័ណភាព៖ ភាពស្រស់ស្អាត គួរឱ្យទាក់ទាញ', '- សហការ៖ ធ្វើការងាររួមគ្នាដើម្បីសម្រេចជោគជ័យ'] },
        { title: 'សំណួរស្វែងយល់អត្ថបទ', content: 'ពិភាក្សាជាមួយមិត្តរួមតុ', bulletPoints: ['១. តើសួនច្បារក្នុងសាលារៀនមានលក្ខណៈដូចម្តេច?', '២. តើសិស្សបានធ្វើអ្វីខ្លះដើម្បីថែទាំសួនច្បារ?', '៣. តើកូនទទួលបានប្រយោជន៍អ្វីខ្លះពីសួនច្បារសាលា?'] }
      ]
    },
    {
      id: 2,
      title: 'គណិតវិទ្យា៖ ប្រភាគ និងការប្រៀបធៀបប្រភាគ',
      subject: 'គណិតវិទ្យា',
      grade: teacher.grade || 'ថ្នាក់ទី ៤',
      slidesCount: 2,
      description: 'ស្លាយពន្យល់ពីគំនិតប្រភាគ ការបែងចែកចំណែក និងលំហាត់អនុវត្តលើក្ដារខៀន។',
      presenter: teacher.name || 'លោកគ្រូ / អ្នកគ្រូ',
      updatedAt: '២០២៦-០៨-២១',
      slides: [
        { title: 'គំនិតមូលដ្ឋាននៃប្រភាគ', content: 'តើប្រភាគជាអ្វី?', bulletPoints: ['ប្រភាគតំណាងឱ្យផ្នែកខ្លះនៃចំនួនពេញមួយ', 'ភាគយក (Numerator) នៅផ្នែកខាងលើ', 'ភាគបែង (Denominator) នៅផ្នែកខាងក្រោម'] },
        { title: 'ឧទាហរណ៍ជាក់ស្តែង', content: 'ការបែងចែកនំភីហ្សាជា ៤ ចំណែក', bulletPoints: ['ញ៉ាំ ១ ចំណែក គឺ 1/4', 'នៅសល់ ៣ ចំណែក គឺ 3/4', 'សរុបទាំងអស់គឺ 4/4 = 1'] }
      ]
    },
    {
      id: 3,
      title: 'វិទ្យាសាស្ត្រ៖ ដំណើរការរស្មីសំយោគរបស់រុក្ខជាតិ',
      subject: 'វិទ្យាសាស្ត្រ',
      grade: teacher.grade || 'ថ្នាក់ទី ៤',
      slidesCount: 2,
      description: 'ស្លាយរូបភាព និងដ្យាក្រាមពន្យល់ពីរបៀបដែលរុក្ខជាតិផលិតអាហារដោយខ្លួនឯង។',
      presenter: teacher.name || 'លោកគ្រូ / អ្នកគ្រូ',
      updatedAt: '២០២៦-០៨-២២',
      slides: [
        { title: 'តើរុក្ខជាតិត្រូវការអ្វីខ្លះ?', content: 'ធាតុផ្សំសំខាន់ៗសម្រាប់រស្មីសំយោគ', bulletPoints: ['១. ពន្លឺព្រះអាទិត្យ (ថាមពល)', '២. ទឹក ពីឬស', '៣. ឧស្ម័នកាបូនឌីអុកស៊ីត ពីខ្យល់'] },
        { title: 'ផលិតផលដែលទទួលបាន', content: 'អ្វីដែលរុក្ខជាតិផលិតចេញមក', bulletPoints: ['- ជាតិស្ករ (គ្លុយកូស) សម្រាប់ចិញ្ចឹមដើម', '- ឧស្ម័នអុកស៊ីសែន សម្រាប់មនុស្សនិងសត្វដកដង្ហើម'] }
      ]
    }
  ]);

  const [isSlideViewerOpen, setIsSlideViewerOpen] = useState(false);
  const [activeSlideDeck, setActiveSlideDeck] = useState<any>(null);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubject, setNewSlideSubject] = useState('ភាសាខ្មែរ');
  const [newSlideDesc, setNewSlideDesc] = useState('');
  const [newSlidePoints, setNewSlidePoints] = useState('');

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentLatinName, setNewStudentLatinName] = useState('');
  const [newStudentCivilId, setNewStudentCivilId] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'ប្រុស' | 'ស្រី'>('ប្រុស');
  const [newStudentDob, setNewStudentDob] = useState('2016-01-01');
  const [newStudentPob, setNewStudentPob] = useState('');
  const [newStudentFatherName, setNewStudentFatherName] = useState('');
  const [newStudentFatherJob, setNewStudentFatherJob] = useState('');
  const [newStudentMotherName, setNewStudentMotherName] = useState('');
  const [newStudentMotherJob, setNewStudentMotherJob] = useState('');
  const [newStudentAddress, setNewStudentAddress] = useState('');
  const [newStudentFamilyStatus, setNewStudentFamilyStatus] = useState('ទូទៅ');
  const [newStudentNote, setNewStudentNote] = useState('នៅរស់');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentPlp, setNewStudentPlp] = useState('');
  const [newStudentPin, setNewStudentPin] = useState('1234');
  const [isStudentPinManagerOpen, setIsStudentPinManagerOpen] = useState(false);

  const [newStudentAvatar, setNewStudentAvatar] = useState('');
  const [newStudentIsRepeating, setNewStudentIsRepeating] = useState(false);
  const [newStudentDisability, setNewStudentDisability] = useState('គ្មាន');
  const [newStudentIndigenous, setNewStudentIndigenous] = useState('គ្មាន');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'ទាំងអស់' | 'ក្រ១' | 'ក្រ២' | 'ទូទៅ'>('ទាំងអស់');
  const [studentAcademicFilter, setStudentAcademicFilter] = useState<'ទាំងអស់' | 'ឡើងថ្នាក់' | 'ត្រួតថ្នាក់'>('ទាំងអស់');

  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Quick 1-click print for an individual student profile sheet in A4 portrait
  const handlePrintSingleStudent = (s: Student) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const activeFont = getActiveCustomFontFamily();
    const activeTheme = getActiveCustomBackgroundTheme();
    const docBackgroundCss = getThemeBackgroundCss(activeTheme);
    const schoolName = teacher?.school || 'សាលាបឋមសិក្សាគំរូ';
    const gradeName = teacher?.grade || 'ថ្នាក់ទី ៤';
    const academicYear = teacher?.academicYear || '២០២៥ - ២០២៦';
    const teacherName = teacher?.name || 'លោកគ្រូ/អ្នកគ្រូ';

    const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
    const studentQrUrl = `${baseUrl}?tab=student_portal&studentId=${s.id}${s.pin ? `&pin=${encodeURIComponent(s.pin)}` : ''}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="utf-8" />
        <title>ជីវប្រវត្តិរូបសិស្ស_${s.name}_${gradeName}</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
            margin: 0;
            padding: 0;
            ${docBackgroundCss}
            color: #0f172a;
            font-size: 10pt;
            line-height: 1.5;
          }
          .font-moul {
            font-family: 'Moul', cursive, serif !important;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }
          .header-left {
            text-align: left;
            font-size: 9pt;
          }
          .header-left .moeys {
            font-weight: bold;
            color: #1e1b4b;
          }
          .header-right {
            text-align: center;
          }
          .header-right .country {
            font-size: 10pt;
            color: #1e1b4b;
          }
          .header-right .motto {
            font-size: 8.5pt;
            color: #334155;
            margin-top: 2px;
          }
          .title-block {
            text-align: center;
            margin: 8px 0 16px 0;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 8px;
          }
          .doc-title {
            font-size: 14pt;
            color: #1e1b4b;
            margin: 0;
          }
          .doc-sub {
            font-size: 10pt;
            color: #475569;
            margin-top: 4px;
          }
          .profile-grid {
            display: flex;
            gap: 16px;
            margin-bottom: 14px;
          }
          .photo-column {
            width: 130px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          .photo-frame {
            width: 120px;
            height: 150px;
            border: 1.5px solid #94a3b8;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
          }
          .photo-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .photo-placeholder {
            font-size: 32pt;
          }
          .photo-tag {
            font-size: 8.5pt;
            color: #64748b;
            margin-top: 4px;
          }
          .qr-box {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 6px;
            text-align: center;
            background: #f8fafc;
            width: 120px;
          }
          .qr-box span {
            display: block;
            font-size: 7.5pt;
            font-family: monospace;
            font-weight: bold;
            color: #1e1b4b;
            margin-top: 4px;
          }
          .info-table {
            flex: 1;
            border-collapse: collapse;
            font-size: 9.5pt;
          }
          .info-table td {
            border: 1px solid #cbd5e1;
            padding: 6px 10px;
            vertical-align: middle;
          }
          .info-table .lbl {
            width: 140px;
            background: #f8fafc;
            font-weight: bold;
            color: #334155;
          }
          .info-table .val {
            color: #0f172a;
          }
          .section-heading {
            font-size: 10.5pt;
            color: #1e1b4b;
            font-weight: bold;
            background: #f1f5f9;
            padding: 5px 10px;
            border-left: 4px solid #4338ca;
            margin: 14px 0 8px 0;
          }
          .full-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
          }
          .full-table td {
            border: 1px solid #cbd5e1;
            padding: 6px 10px;
          }
          .full-table .lbl {
            width: 180px;
            background: #f8fafc;
            font-weight: bold;
            color: #334155;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 25px;
            page-break-inside: avoid;
          }
          .sign-col {
            text-align: center;
            width: 220px;
          }
          .sign-date {
            font-size: 9pt;
            color: #475569;
          }
          .sign-title {
            font-size: 9.5pt;
            margin-top: 4px;
          }
          .sign-space {
            height: 55px;
          }
          .sign-name {
            font-size: 9.5pt;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <div class="moeys font-moul">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
            <div>មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/ក្រុង</div>
            <div style="font-weight: bold;">${schoolName}</div>
          </div>
          <div class="header-right">
            <div class="country font-moul">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div class="motto font-moul">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          </div>
        </div>

        <div class="title-block">
          <h1 class="doc-title font-moul">ជីវប្រវត្តិរូបសង្ខេបសិស្ស</h1>
          <div class="doc-sub">${gradeName} &bull; ឆ្នាំសិក្សា ${academicYear}</div>
        </div>

        <div class="profile-grid">
          <div class="photo-column">
            <div class="photo-frame">
              ${s.avatar && (s.avatar.startsWith('http') || s.avatar.startsWith('data:')) ? `
                <img src="${s.avatar}" alt="${s.name}" />
              ` : `
                <div class="photo-placeholder">${s.gender === 'ស្រី' ? '👧' : '👦'}</div>
                <div class="photo-tag">រូបថត ៤x៦</div>
              `}
            </div>
            <div class="qr-box">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(studentQrUrl)}" alt="QR Code" style="width: 80px; height: 80px;" />
              <span>PIN: ${s.pin || '1234'}</span>
            </div>
          </div>

          <table class="info-table">
            <tr>
              <td class="lbl">អត្តលេខសិស្ស ៖</td>
              <td class="val font-mono" style="font-weight: bold; color: #1e1b4b;">${s.civilId || `#${s.rollNo || s.id}`}</td>
              <td class="lbl">លេខរៀងក្នុងបញ្ជី ៖</td>
              <td class="val font-bold">លេខ ${toKhmerNum(s.rollNo || 1)}</td>
            </tr>
            <tr>
              <td class="lbl">គោត្តនាម-នាម ៖</td>
              <td class="val font-moul" style="font-size: 11pt; color: #1e1b4b;">${s.name}</td>
              <td class="lbl">អក្សរឡាតាំង ៖</td>
              <td class="val font-bold" style="font-family: sans-serif;">${s.latinName ? s.latinName.toUpperCase() : '-'}</td>
            </tr>
            <tr>
              <td class="lbl">ភេទ ៖</td>
              <td class="val font-bold" style="color: ${s.gender === 'ស្រី' ? '#be185d' : '#1d4ed8'};">${s.gender}</td>
              <td class="lbl">ថ្ងៃខែឆ្នាំកំណើត ៖</td>
              <td class="val font-bold">${s.dob || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">ទីកន្លែងកំណើត ៖</td>
              <td class="val" colspan="3">${s.pob || s.address || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">អាសយដ្ឋានបច្ចុប្បន្ន ៖</td>
              <td class="val" colspan="3">${s.address || s.pob || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">លេខទូរស័ព្ទទំនាក់ទំនង ៖</td>
              <td class="val font-mono font-bold" colspan="3">${s.parentPhone || '-'}</td>
            </tr>
          </table>
        </div>

        <div class="section-heading">ព័ត៌មានមាតាបិតា និងអាណាព្យាបាល</div>
        <table class="full-table">
          <tr>
            <td class="lbl">ឈ្មោះឪពុក ៖</td>
            <td class="val font-bold">${s.fatherName || '-'}</td>
            <td class="lbl">មុខរបរឪពុក ៖</td>
            <td class="val">${s.fatherJob || '-'}</td>
          </tr>
          <tr>
            <td class="lbl">ឈ្មោះម្តាយ ៖</td>
            <td class="val font-bold">${s.motherName || '-'}</td>
            <td class="lbl">មុខរបរម្តាយ ៖</td>
            <td class="val">${s.motherJob || '-'}</td>
          </tr>
          <tr>
            <td class="lbl">ស្ថានភាពជីវភាពគ្រួសារ ៖</td>
            <td class="val font-bold" style="color: ${s.familyStatus === 'ក្រ១' || s.familyStatus === 'ក្រ២' ? '#b45309' : '#047857'};" colspan="3">
              ${s.familyStatus || 'ទូទៅ'}
            </td>
          </tr>
        </table>

        <div class="section-heading">ស្ថានភាពសិក្សា & ស្ថិតិ MoEYS PRI</div>
        <table class="full-table">
          <tr>
            <td class="lbl">ស្ថានភាពឡើងថ្នាក់/ត្រួតថ្នាក់ ៖</td>
            <td class="val font-bold">
              ${s.isRepeating || s.note?.includes('ត្រួតថ្នាក់') ? '🔁 សិស្សត្រួតថ្នាក់' : '🌟 សិស្សឡើងថ្នាក់ / សិស្សថ្មី'}
            </td>
            <td class="lbl">គណនី PLP MoEYS ៖</td>
            <td class="val font-mono">${s.plpAccount || 'PLP-ACTIVE'}</td>
          </tr>
          <tr>
            <td class="lbl">ប្រភេទពិការភាព (Disability) ៖</td>
            <td class="val">${s.disabilityType || 'គ្មាន'}</td>
            <td class="lbl">ជនជាតិដើមភាគតិច ៖</td>
            <td class="val">${s.indigenousEthnicity || 'គ្មាន'}</td>
          </tr>
          <tr>
            <td class="lbl">កំណត់សម្គាល់ផ្សេងៗ ៖</td>
            <td class="val" colspan="3">${s.note || 'នៅរស់ / សិក្សាទៀងទាត់'}</td>
          </tr>
        </table>

        <div class="signatures">
          <div class="sign-col">
            <div class="sign-title font-moul">បានឃើញ និងឯកភាព<br/>នាយកសាលា</div>
            <div class="sign-space"></div>
          </div>
          <div class="sign-col">
            <div class="sign-date">${getKhmerCombinedDate(new Date())}</div>
            <div class="sign-title font-moul">គ្រូបន្ទុកថ្នាក់</div>
            <div class="sign-space"></div>
            <div class="sign-name">${teacherName}</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  // Quick 1-click toggle for repeating student status directly synced with MoEYS PRI
  const handleToggleStudentRepeating = (student: Student) => {
    const combinedNotes = `${student.note || ''} ${student.familyStatus || ''}`;
    const currentlyRepeating = student.isRepeating === true ||
      combinedNotes.includes('ត្រួតថ្នាក់') ||
      combinedNotes.includes('រៀនឡើងវិញ') ||
      combinedNotes.includes('repeating');
    
    const nextRepeating = !currentlyRepeating;
    
    let updatedNote = student.note || '';
    if (nextRepeating) {
      if (!updatedNote.includes('ត្រួតថ្នាក់')) {
        updatedNote = updatedNote && updatedNote !== 'នៅរស់' ? `${updatedNote} ត្រួតថ្នាក់` : 'ត្រួតថ្នាក់';
      }
    } else {
      updatedNote = updatedNote.replace(/ត្រួតថ្នាក់|រៀនឡើងវិញ|repeating/g, '').trim();
      if (!updatedNote) updatedNote = 'នៅរស់';
    }

    const updatedStudent: Student = {
      ...student,
      isRepeating: nextRepeating,
      note: updatedNote,
    };

    onUpdateStudent(updatedStudent);
    onShowToast(`បានប្តូរស្ថានភាពសិស្ស "${student.name}" ទៅជា: ${nextRepeating ? '🔁 ត្រួតថ្នាក់ (Repeating)' : '🌟 ឡើងថ្នាក់/សិស្សថ្មី'}`);
  };

  const addStudentFileInputRef = useRef<HTMLInputElement>(null);
  const addStudentCameraInputRef = useRef<HTMLInputElement>(null);
  const editStudentFileInputRef = useRef<HTMLInputElement>(null);
  const editStudentCameraInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingStudentPhoto, setIsUploadingStudentPhoto] = useState(false);

  const handleUploadStudentAvatar = async (
    file: File,
    target: 'new' | 'edit'
  ) => {
    try {
      if (!file.type.startsWith('image/')) {
        alert('សូមជ្រើសរើសឯកសាររូបភាព (JPG, PNG, WEBP, etc.)');
        return;
      }
      setIsUploadingStudentPhoto(true);
      const compressed = await compressImageFile(file, {
        maxWidth: 360,
        maxHeight: 360,
        quality: 0.85,
        mimeType: 'image/jpeg',
      });
      if (target === 'new') {
        setNewStudentAvatar(compressed);
      } else if (target === 'edit' && editingStudent) {
        setEditingStudent((prev) => (prev ? { ...prev, avatar: compressed } : null));
      }
    } catch (err) {
      console.error('Failed to compress/upload student photo:', err);
      alert('មិនអាចដំណើរការរូបថតបានទេ សូមសាកល្បងម្ដងទៀត');
    } finally {
      setIsUploadingStudentPhoto(false);
    }
  };

  const [isExcelImportOpen, setIsExcelImportOpen] = useState(false);
  const [excelText, setExcelText] = useState('');
  const [importReplaceAll, setImportReplaceAll] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [excelPreviewStudents, setExcelPreviewStudents] = useState<Student[]>([]);
  const [excelMetaInfo, setExcelMetaInfo] = useState<{
    schoolName?: string;
    grade?: string;
    totalCount?: string;
    femaleCount?: string;
  }>({});

  const [isAddLogbookOpen, setIsAddLogbookOpen] = useState(false);
  const [newLogSubject, setNewLogSubject] = useState('ភាសាខ្មែរ');
  const [newLogTopic, setNewLogTopic] = useState('');
  const [newLogNote, setNewLogNote] = useState('');

  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [newInvName, setNewInvName] = useState('');
  const [newInvQty, setNewInvQty] = useState(1);
  const [newInvCondition, setNewInvCondition] = useState<'ល្អ' | 'មធ្យម' | 'ខូច/ត្រូវជួសជុល'>('ល្អ');

  const [isEditInventoryOpen, setIsEditInventoryOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<InventoryItem | null>(null);
  const [editInvName, setEditInvName] = useState('');
  const [editInvQty, setEditInvQty] = useState(1);
  const [editInvCondition, setEditInvCondition] = useState<'ល្អ' | 'មធ្យម' | 'ខូច/ត្រូវជួសជុល'>('ល្អ');
  const [editInvCategory, setEditInvCategory] = useState('សម្ភារថ្នាក់រៀន');

  const [isPLCModalOpen, setIsPLCModalOpen] = useState(false);
  const [selectedPLCMeeting, setSelectedPLCMeeting] = useState<PLCMeeting | null>(null);
  const [isPlcPdfModalOpen, setIsPlcPdfModalOpen] = useState(false);
  const [selectedPlcPdfMeeting, setSelectedPlcPdfMeeting] = useState<PLCMeeting | null>(null);
  const [isParentAgreementPdfModalOpen, setIsParentAgreementPdfModalOpen] = useState(false);
  const [isPrincipalAgreementPdfModalOpen, setIsPrincipalAgreementPdfModalOpen] = useState(false);

  // Section 1 PDF Customizer Modals with Signatures & A4 Landscape
  const [isStudentsPdfModalOpen, setIsStudentsPdfModalOpen] = useState(false);
  const [isStudentRosterPrintModalOpen, setIsStudentRosterPrintModalOpen] = useState(false);
  const [isAttendancePdfModalOpen, setIsAttendancePdfModalOpen] = useState(false);
  const [isGradesPdfModalOpen, setIsGradesPdfModalOpen] = useState(false);
  const [isStatsPdfModalOpen, setIsStatsPdfModalOpen] = useState(false);
  const [isBehaviorPdfModalOpen, setIsBehaviorPdfModalOpen] = useState(false);
  const [isPlpPdfModalOpen, setIsPlpPdfModalOpen] = useState(false);

  const [isOfficialReportOpen, setIsOfficialReportOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isRulesPdfModalOpen, setIsRulesPdfModalOpen] = useState(false);
  const [isInventoryPdfModalOpen, setIsInventoryPdfModalOpen] = useState(false);
  const [isDecorationModalOpen, setIsDecorationModalOpen] = useState(false);
  const [classroomRules, setClassroomRules] = useState<ClassroomRuleItem[]>(DEFAULT_RULES);
  const [isAddingRuleAdmin, setIsAddingRuleAdmin] = useState(false);
  const [newRuleTitleAdmin, setNewRuleTitleAdmin] = useState('');
  const [newRuleDescAdmin, setNewRuleDescAdmin] = useState('');
  const [editingRuleAdminId, setEditingRuleAdminId] = useState<number | null>(null);
  const [editRuleAdminTitle, setEditRuleAdminTitle] = useState('');
  const [editRuleAdminDesc, setEditRuleAdminDesc] = useState('');

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    let finalNote = newStudentNote.trim() || 'នៅរស់';
    if (newStudentIsRepeating && !finalNote.includes('ត្រួតថ្នាក់')) {
      finalNote = finalNote === 'នៅរស់' ? 'ត្រួតថ្នាក់' : `${finalNote} ត្រួតថ្នាក់`;
    }

    onAddStudent({
      name: newStudentName.trim(),
      latinName: newStudentLatinName.trim() || undefined,
      civilId: newStudentCivilId.trim() || `SIS-${1000 + students.length + 1}`,
      gender: newStudentGender,
      dob: newStudentDob,
      pob: newStudentPob.trim() || undefined,
      fatherName: newStudentFatherName.trim() || undefined,
      fatherJob: newStudentFatherJob.trim() || undefined,
      motherName: newStudentMotherName.trim() || undefined,
      motherJob: newStudentMotherJob.trim() || undefined,
      address: newStudentAddress.trim() || newStudentPob.trim() || undefined,
      familyStatus: newStudentFamilyStatus || undefined,
      note: finalNote,
      isRepeating: newStudentIsRepeating,
      disabilityType: newStudentDisability !== 'គ្មាន' ? newStudentDisability : undefined,
      indigenousEthnicity: newStudentIndigenous !== 'គ្មាន' ? newStudentIndigenous : undefined,
      parentPhone: newStudentPhone.trim() || '012 345 678',
      plpAccount: newStudentPlp.trim() || `${newStudentName.replace(/\s+/g, '').toLowerCase()}@plp.edu.kh`,
      avatar: newStudentAvatar.trim() || undefined,
      pin: newStudentPin.trim() || '1234',
    });
    setNewStudentName('');
    setNewStudentLatinName('');
    setNewStudentCivilId('');
    setNewStudentPob('');
    setNewStudentFatherName('');
    setNewStudentFatherJob('');
    setNewStudentMotherName('');
    setNewStudentMotherJob('');
    setNewStudentAddress('');
    setNewStudentFamilyStatus('ទូទៅ');
    setNewStudentNote('នៅរស់');
    setNewStudentIsRepeating(false);
    setNewStudentDisability('គ្មាន');
    setNewStudentIndigenous('គ្មាន');
    setNewStudentPhone('');
    setNewStudentPlp('');
    setNewStudentPin('1234');
    setNewStudentAvatar('');
    setIsAddStudentOpen(false);
    onShowToast('បានបញ្ចូលឈ្មោះសិស្សថ្មីទៅកាន់ប្រព័ន្ធ WikiSchool / SIS និងធ្វើសមកាលកម្មជាមួយ MoEYS PRI ដោយជោគជ័យ!');
  };

  const handleUpdateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    let finalNote = editingStudent.note?.trim() || 'នៅរស់';
    const isRep = editingStudent.isRepeating ?? (finalNote.includes('ត្រួតថ្នាក់') || (editingStudent.familyStatus?.includes('ត្រួតថ្នាក់') ?? false));

    if (isRep && !finalNote.includes('ត្រួតថ្នាក់')) {
      finalNote = finalNote === 'នៅរស់' ? 'ត្រួតថ្នាក់' : `${finalNote} ត្រួតថ្នាក់`;
    } else if (!isRep && finalNote.includes('ត្រួតថ្នាក់')) {
      finalNote = finalNote.replace(/ត្រួតថ្នាក់|រៀនឡើងវិញ/g, '').trim() || 'នៅរស់';
    }

    onUpdateStudent({
      ...editingStudent,
      note: finalNote,
      isRepeating: isRep,
      disabilityType: editingStudent.disabilityType && editingStudent.disabilityType !== 'គ្មាន' ? editingStudent.disabilityType : undefined,
      indigenousEthnicity: editingStudent.indigenousEthnicity && editingStudent.indigenousEthnicity !== 'គ្មាន' ? editingStudent.indigenousEthnicity : undefined,
    });
    setIsEditStudentOpen(false);
    setEditingStudent(null);
    onShowToast('បានកែប្រែប្រវត្តិរូបសិស្ស និងធ្វើសមកាលកម្មជាមួយ MoEYS PRI ដោយជោគជ័យ!');
  };

  const handleFileUpload = async (file: File) => {
    setExcelLoading(true);
    setUploadedFileName(file.name);
    try {
      const isXlsx = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      if (isXlsx) {
        const { students: parsed, meta } = await parseExcelWorkbookFile(file, importReplaceAll ? 0 : students.length);
        if (parsed.length > 0) {
          setExcelPreviewStudents(parsed);
          setExcelMetaInfo(meta);
          onShowToast(`បានអានឯកសារ Excel: រកឃើញសិស្សចំនួន ${parsed.length} នាក់!`);
        } else {
          onShowToast('មិនអាចរកឃើញទិន្នន័យសិស្សក្នុងឯកសារ Excel នេះទេ។');
        }
      } else {
        const text = await file.text();
        setExcelText(text);
        const { students: parsed, meta } = parseStudentsCSV(text, importReplaceAll ? 0 : students.length);
        if (parsed.length > 0) {
          setExcelPreviewStudents(parsed);
          setExcelMetaInfo(meta);
          onShowToast(`បានអានឯកសារ CSV: រកឃើញសិស្សចំនួន ${parsed.length} នាក់!`);
        }
      }
    } catch (err) {
      console.error('Error reading file:', err);
      onShowToast('មានបញ្ហាក្នុងការអានឯកសារ សូមពិនិត្យមើលឯកសារឡើងវិញ។');
    } finally {
      setExcelLoading(false);
    }
  };

  const handleExcelImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let importedToApply: Student[] = [];
    let metaToApply: typeof excelMetaInfo = {};

    if (excelPreviewStudents.length > 0) {
      importedToApply = excelPreviewStudents;
      metaToApply = excelMetaInfo;
    } else if (excelText.trim()) {
      const { students: imported, meta } = parseStudentsCSV(
        excelText,
        importReplaceAll ? 0 : students.length
      );
      importedToApply = imported;
      metaToApply = meta;
    } else {
      onShowToast('សូមបញ្ចូល ឬផ្ទុកឡើងឯកសារ Excel / CSV ជាមុនសិន!');
      return;
    }

    if (importedToApply.length > 0) {
      onImportStudents(importedToApply, importReplaceAll);
      setExcelText('');
      setExcelPreviewStudents([]);
      setUploadedFileName('');
      setExcelMetaInfo({});
      setIsExcelImportOpen(false);
      let message = `បាននាំចូលសិស្សចំនួន ${importedToApply.length} នាក់ពី Excel Workbook ដោយជោគជ័យ!`;
      if (metaToApply.grade) message += ` (${metaToApply.grade})`;
      onShowToast(message);
    } else {
      onShowToast('មិនអាចអានទិន្នន័យបានទេ សូមពិនិត្យទម្រង់ Excel / CSV ឡើងវិញ។');
    }
  };

  const downloadSampleExcelWorkbook = () => {
    try {
      exportSampleMoEYSExcelWorkbook('moeys_students_grade6A_template.xlsx');
      onShowToast('បានទាញយកគំរូ Excel Workbook (.xlsx) ក្រសួងអប់រំជោគជ័យ!');
    } catch (err) {
      console.error('Failed to export sample xlsx:', err);
      downloadSampleCSV();
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = '\uFEFF' + SAMPLE_MOEYS_39_STUDENTS_CSV;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'moeys_students_list_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('បានទាញយកគំរូ CSV ស្តង់ដាក្រសួងអប់រំជោគជ័យ!');
  };

  const handleExportStudentsToExcel = () => {
    if (students.length === 0) {
      onShowToast('មិនមានទិន្នន័យសិស្សសម្រាប់នាំចេញទេ!');
      return;
    }
    exportStudentsToExcelWorkbook(
      students,
      `បញ្ជីរាយនាមសិស្ស_${teacher.grade || 'ថ្នាក់ទី៦'}.xlsx`,
      teacher.school || 'សាលាបឋមសិក្សា',
      teacher.grade || 'ថ្នាក់ទី: 6-A'
    );
    onShowToast(`បាននាំចេញបញ្ជីសិស្ស ${students.length} នាក់ជាឯកសារ Excel Workbook (.xlsx) ជោគជ័យ!`);
  };

  const handleCreateLogbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogTopic.trim()) return;
    onAddLogbook({
      date: selectedDate,
      time: '08:00 - 09:00',
      subject: newLogSubject,
      topic: newLogTopic.trim(),
      presentCount: `${students.length}/${students.length}`,
      note: newLogNote.trim() || 'សិស្សយល់បានល្អ សកម្មល្អ',
    });
    setNewLogTopic('');
    setNewLogNote('');
    setIsAddLogbookOpen(false);
    onShowToast('បានកត់ត្រាសៀវភៅ Logbook ជោគជ័យ!');
  };

  const handleCreateInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvName.trim()) return;
    onAddInventory({
      name: newInvName.trim(),
      qty: Number(newInvQty) || 1,
      condition: newInvCondition,
      category: 'សម្ភារថ្នាក់រៀន',
    });
    setNewInvName('');
    setIsAddInventoryOpen(false);
    onShowToast('បានបន្ថែមសម្ភារថ្មីក្នុងសារពើភណ្ឌ!');
  };

  const handleAddBorrowing = (record: Omit<BookBorrowingRecord, 'id'>) => {
    const newRecord: BookBorrowingRecord = {
      ...record,
      id: Math.random().toString(36).substring(2, 9),
    };
    setBookBorrowings(prev => [newRecord, ...prev]);
    onShowToast('បានកត់ត្រាការខ្ចីសៀវភៅថ្មី!');
  };

  const handleUpdateBorrowing = (record: BookBorrowingRecord) => {
    setBookBorrowings(prev => prev.map(b => b.id === record.id ? record : b));
    onShowToast('បានធ្វើបច្ចុប្បន្នភាពការខ្ចីសៀវភៅ!');
  };

  const handleDeleteBorrowing = (id: string) => {
    setBookBorrowings(prev => prev.filter(b => b.id !== id));
    onShowToast('បានលុបការកត់ត្រា!');
  };

  const mainTabs = [
    { id: 'sec1', label: '១. ទិន្នន័យសិស្ស & ឌីជីថល', icon: Users, desc: 'WikiSchool, វត្តមាន, ពិន្ទុ, តាមដាន, សិក្ខាគារិក, PLP' },
    { id: 'sec2', label: '២. ការបង្រៀន & គរុកោសល្យ', icon: BookOpen, desc: 'កាលវិភាគ, កិច្ចតែងការ, Logbook' },
    { id: 'sec3', label: '៣. ការរៀបចំថ្នាក់ & សម្ភារៈ', icon: Box, desc: 'សារពើភណ្ឌ, គណៈកម្មការថ្នាក់, ប្លង់តុ, បទបញ្ជា' },
    { id: 'sec4', label: '៤. PLC & ស្វ័យសិក្សា', icon: GraduationCap, desc: 'PLC, ស្វ័យសិក្សា, ស្តង់ដាសាលាគំរូ, CPD' },
  ];

  return (
    <div className="space-y-6 pb-12 print:space-y-0 print:pb-0 print:p-0 print:m-0 print:w-full">
      {/* Academic Year Active Context Banner */}
      <div className={`no-print ${activeBannerTheme.headerGradient} text-white p-4 sm:p-5 rounded-[28px] shadow-lg ${activeBannerTheme.headerShadow} border ${activeBannerTheme.headerBorder} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden`}>
        {/* Animated Thematic Background & Particle System */}
        <ThemeAnimatedDecorations themeId={bannerThemeId} variant="banner" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/15 shrink-0 shadow-inner">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${activeBannerTheme.headerSubtext}`}>
                ទិន្នន័យរដ្ឋបាលប្រចាំឆ្នាំសិក្សា
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                រក្សាទុកដោយស្វ័យប្រវត្តិ
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-2">
              <span>ឆ្នាំសិក្សា៖ {currentYear || teacher.academicYear || '២០២៥ - ២០២៦'}</span>
              <span className={`text-xs font-normal ${activeBannerTheme.headerSubtext} hidden md:inline`}>({teacher.school} • {teacher.grade})</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto relative z-10">
          {/* 5 Theme Switcher Button */}
          <button
            type="button"
            onClick={() => setIsBannerThemeModalOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-bold text-xs border border-white/25 shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ring-1 ring-white/30"
            title="ប្តូរម៉ូដពណ៌ផ្ទាំងរដ្ឋបាល (៥ គំរូ)"
          >
            <Palette className="w-4 h-4 text-amber-300" />
            <span>ម៉ូដផ្ទាំង ({activeBannerTheme.icon})</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              const liveBundle = loadCompleteYearBundle(currentYear || teacher.academicYear || '២០២៥ - ២០២៦');
              saveCompleteYearBundle(liveBundle);
              await shareOrDownloadBackupFile(teacher.name, onShowToast);
            }}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs border border-white/20 shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
            title="ទាញយក ឬចែករំលែក Backup JSON គ្រប់រដ្ឋបាលទាំង ៤"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Backup / Share (.json)</span>
          </button>

          {onOpenAccountSync && (
            <button
              type="button"
              onClick={onOpenAccountSync}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-2xl font-bold text-xs border border-indigo-400/40 shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              title="Cloud Sync & Backup"
            >
              <Cloud className="w-4 h-4 text-indigo-200" />
              <span>Cloud Sync</span>
            </button>
          )}

          {onOpenYearManager && (
            <button
              type="button"
              onClick={onOpenYearManager}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 text-slate-950 rounded-2xl font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2 border border-amber-200 shrink-0"
            >
              <Calendar className="w-4 h-4 text-purple-950" />
              <span>ប្តូរ/បង្កើតឆ្នាំសិក្សា</span>
            </button>
          )}
        </div>
      </div>

      {/* Modern Bento Main Section Navigation Cards - Horizontally Swipable */}
      <div className="no-print flex items-stretch gap-3.5 overflow-x-auto pb-2 no-scrollbar snap-x">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainSec === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainSec(tab.id as any)}
              className={`text-left p-4.5 rounded-[24px] transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shrink-0 w-72 sm:w-80 snap-start ${
                isActive
                  ? `${activeBannerTheme.bentoActiveGradient} text-white shadow-xl ${activeBannerTheme.bentoActiveShadow} ring-2 ${activeBannerTheme.bentoActiveRing} scale-[1.02]`
                  : 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 hover:to-purple-50/50 text-slate-800 border border-slate-200/90 shadow-sm hover:border-purple-300 hover:shadow-md'
              }`}
            >
              {/* Dynamic Theme Animated Decor on Active Bento Card */}
              {isActive && (
                <ThemeAnimatedDecorations themeId={bannerThemeId} variant="card" />
              )}

              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive
                    ? activeBannerTheme.bentoActiveIconBg
                    : `${activeBannerTheme.bentoInactiveIconBg} ${activeBannerTheme.bentoInactiveIconText}`
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </div>
              <div className="relative z-10">
                <h3 className={`font-black text-xs md:text-sm ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {tab.label}
                </h3>
                <p className={`text-[11px] mt-0.5 leading-relaxed ${isActive ? activeBannerTheme.bentoSubtext : 'text-slate-500'}`}>
                  {tab.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= SECTION 1: STUDENT DATA & DIGITAL SYSTEMS ================= */}
      {activeMainSec === 'sec1' && (
        <div className="space-y-4">
          {/* Sub Navigation pills */}
          <div className="no-print flex gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
            {[
              { id: 'students', label: `បញ្ជី & ប្រវត្តិរូប (${students.length})`, icon: Users },
              { id: 'id_cards', label: 'ប័ណ្ណសម្គាល់ខ្លួនសិស្ស (ID Cards)', icon: QrCode },
              { id: 'attendance', label: 'ស្រង់វត្តមានសិស្ស (ផ្ទាល់ / WikiSchool)', icon: CheckSquare },
              { id: 'grades', label: 'ពិន្ទុ & និទ្ទេស (WikiSchool)', icon: BarChart3 },
              { id: 'honor_roll', label: 'តារាងកិត្តិយស (ឆ្នើម MoEYS)', icon: Trophy, badge: '🏆 ឆ្នើម' },
              { id: 'monitoring', label: 'សៀវភៅតាមដានការសិក្សា', icon: BookOpenCheck, badge: '⭐ សំខាន់' },
              { id: 'thursday_report', label: 'របាយការណ៍ថ្ងៃព្រហស្បតិ៍', icon: Calendar, badge: '📅 MoEYS' },
              { id: 'pri', label: 'ស្ថិតិ PRI (តារាងសិស្សតាមថ្នាក់ MoEYS)', icon: FileSpreadsheet, badge: '🏛️ PRI' },
              { id: 'trainees', label: 'សៀវភៅសិក្ខាគារិក', icon: BookOpenCheck, badge: '📘 ផ្លូវការ' },
              { id: 'stats', label: 'ស្ថិតិ & ចាត់ថ្នាក់សិស្ស (PLP/PTOM)', icon: BarChart3 },
              { id: 'behavior', label: 'អាកប្បកិរិយា & វិន័យ', icon: ShieldCheck },
              { id: 'book_borrowing', label: `បញ្ជីខ្ចីសៀវភៅ (${bookBorrowings.length})`, icon: BookMarked, badge: 'រដ្ឋបាលទី១' },
              { id: 'plp', label: 'PLP MoEYS Portal', icon: Globe },
            ].map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = subSec1 === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSubSec1(sub.id as any)}
                  className={`px-3.5 py-2.5 rounded-2xl shrink-0 transition flex items-center gap-2 ${
                    isSubActive
                      ? `${activeBannerTheme.subPillActiveBg} shadow-md ${activeBannerTheme.subPillActiveShadow} font-bold`
                      : 'bg-gradient-to-r from-white to-purple-50/50 hover:bg-purple-50 text-slate-800 border border-purple-200/60 shadow-2xs font-semibold'
                  }`}
                >
                  <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{sub.label}</span>
                  {sub.badge && !isSubActive && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeBannerTheme.subPillInactiveBadgeBg} ${activeBannerTheme.subPillInactiveBadgeText} font-bold border ${activeBannerTheme.subPillInactiveBadgeBorder}`}>
                      {sub.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 1.1 Student Roster & Profile */}
          {subSec1 === 'students' && (
            <div className="space-y-4">
              {/* Highlighted Banner for 1-Click Print & Export */}
              <div className={`${activeBannerTheme.bannerGradient} rounded-2xl p-4 text-white shadow-md border ${activeBannerTheme.bannerBorder} relative overflow-hidden`}>
                <ThemeAnimatedDecorations themeId={bannerThemeId} variant="compact" />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative z-10">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md ${activeBannerTheme.accentBadgeBg} ${activeBannerTheme.accentBadgeText} text-[10px] font-black uppercase tracking-wider`}>
                        🖨️ បោះពុម្ព
                      </span>
                      <h3 className="text-sm font-black text-white">
                        បញ្ជីរាយនាមសិស្ស ({students.length} នាក់)
                      </h3>
                    </div>
                    <p className={`text-[11px] ${activeBannerTheme.tagColor}`}>
                      {teacher?.grade || 'ថ្នាក់ទី ៤'} &bull; {teacher?.academicYear || '២០២៥-២០២៦'}
                    </p>
                  </div>

                  {/* Compact Print & Export Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsBannerThemeModalOpen(true)}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[36px]"
                      title="ប្តូរម៉ូដពណ៌ផ្ទាំងរដ្ឋបាល (៥ គំរូ)"
                    >
                      <Palette className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{activeBannerTheme.icon} ម៉ូដផ្ទាំង</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsStudentRosterPrintModalOpen(true)}
                      className={`${activeBannerTheme.primaryButtonBg} px-3 py-1.5 rounded-lg text-[11px] font-black transition shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer min-h-[36px]`}
                      title="បោះពុម្ពបញ្ជីសិស្ស"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                      <span>ព្រីនបញ្ជី</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsStudentsPdfModalOpen(true)}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[36px]"
                      title="ទាញយកជា PDF"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsStudentPinManagerOpen(true)}
                      className="bg-purple-800/80 hover:bg-purple-700 text-amber-200 border border-purple-600/60 px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[36px]"
                      title="គ្រប់គ្រង PIN & Link"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>PIN/Link</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-[28px] border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-900 rounded-xl">សរុប {students.length} នាក់</span>
                  <span className="px-2.5 py-1 bg-pink-100 text-pink-900 rounded-xl">ស្រី {students.filter(s => s.gender === 'ស្រី').length} នាក់</span>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-xl">ក្រ១/២ {students.filter(s => s.familyStatus === 'ក្រ១' || s.familyStatus === 'ក្រ២').length} នាក់</span>
                </div>

                <div className="w-full sm:w-auto overflow-x-auto pb-1 touch-pan-x no-scrollbar flex items-center gap-2.5 flex-nowrap sm:flex-wrap">
                  <button
                    onClick={handleExportStudentsToExcel}
                    className="no-print shrink-0 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-xs flex items-center gap-2 active:scale-95 whitespace-nowrap min-h-[40px]"
                    title="ទាញយកបញ្ជីឈ្មោះសិស្សទាំងអស់ជា Microsoft Excel Workbook (.xlsx)"
                  >
                    <FileDown className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>នាំចេញ Excel</span>
                  </button>
                  <button
                    onClick={() => {
                      setExcelPreviewStudents([]);
                      setUploadedFileName('');
                      setIsExcelImportOpen(true);
                    }}
                    className="no-print shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-2 active:scale-95 whitespace-nowrap min-h-[40px]"
                  >
                    <FileSpreadsheet className="w-4 h-4 shrink-0" />
                    <span>នាំចូល Excel/CSV</span>
                  </button>
                  <button
                    onClick={() => setIsAddStudentOpen(true)}
                    className="no-print shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-2xl text-xs font-bold transition shadow-md shadow-blue-500/25 active:scale-95 flex items-center gap-2 whitespace-nowrap min-h-[40px]"
                  >
                    <UserPlus className="w-4 h-4 shrink-0" />
                    <span>+ បន្ថែមសិស្សថ្មី</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70 text-xs">
                <div className="relative w-full md:w-72 shrink-0">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ស្វែងរកឈ្មោះសិស្ស, អត្តលេខ, ឪពុក, ម្តាយ..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl font-medium text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-400"
                  />
                  {studentSearchQuery && (
                    <button
                      onClick={() => setStudentSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end overflow-x-auto pb-1 touch-pan-x">
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200 shrink-0">
                    <span className="text-slate-500 font-bold text-[11px] mr-1">ស្ថានភាពសិក្សា/PRI:</span>
                    {(['ទាំងអស់', 'ឡើងថ្នាក់', 'ត្រួតថ្នាក់'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setStudentAcademicFilter(status)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                          studentAcademicFilter === status
                            ? status === 'ត្រួតថ្នាក់'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : status === 'ឡើងថ្នាក់'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-indigo-900 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {status === 'ឡើងថ្នាក់' ? '🌟 ឡើងថ្នាក់/ថ្មី' : status === 'ត្រួតថ្នាក់' ? '🔁 ត្រួតថ្នាក់' : 'ទាំងអស់'}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200 shrink-0">
                    <span className="text-slate-500 font-bold text-[11px] mr-1">គ្រួសារ:</span>
                    {(['ទាំងអស់', 'ក្រ១', 'ក្រ២', 'ទូទៅ'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setStudentStatusFilter(status)}
                        className={`px-2 py-1 rounded-lg font-bold transition text-[11px] ${
                          studentStatusFilter === status
                            ? status === 'ក្រ១'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : status === 'ក្រ២'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-purple-900 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsStudentRosterPrintModalOpen(true)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
                    title="បោះពុម្ពបញ្ជីឈ្មោះដែលបានច្រោះខាងលើ"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-950" />
                    <span>ព្រីនបញ្ជីនេះ</span>
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-[28px] overflow-hidden shadow-xs">
                <div className="overflow-x-auto overscroll-x-contain touch-pan-x -webkit-overflow-scrolling-touch">
                  <table className="w-full min-w-[1020px] text-left text-xs text-slate-700">
                    <thead className="bg-slate-50/80 font-bold border-b border-slate-200 text-slate-800 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3.5 text-center w-14">ល.រ</th>
                        <th className="p-3.5">ឈ្មោះសិស្ស (Khmer / Latin)</th>
                        <th className="p-3.5 text-center w-16">ភេទ</th>
                        <th className="p-3.5">ថ្ងៃកំណើត / ទីកន្លែងកំណើត</th>
                        <th className="p-3.5">ឪពុក-ម្តាយ & មុខរបរ</th>
                        <th className="p-3.5 text-center">ស្ថានភាពគ្រួសារ</th>
                        <th className="p-3.5 text-center">ស្ថានភាពសិក្សា (PRI)</th>
                        <th className="p-3.5">ទូរសព្ទ / PLP</th>
                        <th className="p-3.5 no-print text-center w-24">សកម្មភាព</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students
                        .filter((s) => {
                          const matchesSearch =
                            !studentSearchQuery.trim() ||
                            s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                            (s.latinName && s.latinName.toLowerCase().includes(studentSearchQuery.toLowerCase())) ||
                            (s.civilId && s.civilId.toLowerCase().includes(studentSearchQuery.toLowerCase())) ||
                            (s.address && s.address.toLowerCase().includes(studentSearchQuery.toLowerCase())) ||
                            (s.fatherName && s.fatherName.toLowerCase().includes(studentSearchQuery.toLowerCase())) ||
                            (s.motherName && s.motherName.toLowerCase().includes(studentSearchQuery.toLowerCase()));

                          const matchesStatus =
                            studentStatusFilter === 'ទាំងអស់' ||
                            (studentStatusFilter === 'ក្រ១' && s.familyStatus?.includes('ក្រ១')) ||
                            (studentStatusFilter === 'ក្រ២' && s.familyStatus?.includes('ក្រ២')) ||
                            (studentStatusFilter === 'ទូទៅ' && (!s.familyStatus || s.familyStatus.includes('ទូទៅ')));

                          const isRep = s.isRepeating === true ||
                            (s.note && (s.note.includes('ត្រួតថ្នាក់') || s.note.includes('រៀនឡើងវិញ'))) ||
                            (s.familyStatus && s.familyStatus.includes('ត្រួតថ្នាក់'));

                          const matchesAcademic =
                            studentAcademicFilter === 'ទាំងអស់' ||
                            (studentAcademicFilter === 'ត្រួតថ្នាក់' && isRep) ||
                            (studentAcademicFilter === 'ឡើងថ្នាក់' && !isRep);

                          return matchesSearch && matchesStatus && matchesAcademic;
                        })
                        .map((s, index) => {
                          const isRep = s.isRepeating === true ||
                            (s.note && (s.note.includes('ត្រួតថ្នាក់') || s.note.includes('រៀនឡើងវិញ'))) ||
                            (s.familyStatus && s.familyStatus.includes('ត្រួតថ្នាក់'));

                          return (
                          <tr key={s.id} className="hover:bg-purple-50/40 transition">
                            <td className="p-3.5 font-bold text-center text-slate-500 font-mono">
                              {s.rollNo || index + 1}
                            </td>
                            <td className="p-3.5 font-bold text-slate-900 text-sm">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border ${
                                    s.gender === 'ស្រី'
                                      ? 'bg-pink-100 text-pink-800 border-pink-200'
                                      : 'bg-blue-100 text-blue-800 border-blue-200'
                                  }`}
                                >
                                  {s.avatar ? (
                                    <img
                                      src={s.avatar}
                                      alt={s.name}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        // Fallback if image fails to load
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <span>{s.name.charAt(0)}</span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5 flex-wrap">
                                    <span>{s.name}</span>
                                    {s.disabilityType && s.disabilityType !== 'គ្មាន' && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                                        ♿ {s.disabilityType}
                                      </span>
                                    )}
                                    {s.indigenousEthnicity && s.indigenousEthnicity !== 'គ្មាន' && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                                        🏕️ {s.indigenousEthnicity}
                                      </span>
                                    )}
                                    {s.note && s.note !== 'នៅរស់' && !s.note.includes('ត្រួតថ្នាក់') && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-normal">
                                        {s.note}
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[10px] text-indigo-600 uppercase font-mono font-bold">
                                    {s.latinName || s.civilId || `SIS-${1000 + s.id}`}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                                  s.gender === 'ស្រី'
                                    ? 'bg-pink-100 text-pink-700 border border-pink-200'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {s.gender}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-600 font-medium">
                              <p className="font-semibold text-slate-800">{s.dob || '2016-01-01'}</p>
                              <p className="text-[10px] text-slate-500 truncate max-w-[170px]" title={s.pob || s.address}>
                                📍 {s.pob || s.address || 'ភូមិ/ឃុំ ស្រុក/ខេត្ត'}
                              </p>
                            </td>
                            <td className="p-3.5 text-slate-600 text-xs">
                              {s.fatherName ? (
                                <p className="font-medium text-slate-800 truncate max-w-[160px]">
                                  <span className="text-slate-400 font-normal">ឪ:</span> {s.fatherName}{' '}
                                  {s.fatherJob && <span className="text-[10px] text-slate-500">({s.fatherJob})</span>}
                                </p>
                              ) : null}
                              {s.motherName ? (
                                <p className="font-medium text-slate-800 truncate max-w-[160px]">
                                  <span className="text-slate-400 font-normal">ម្តាយ:</span> {s.motherName}{' '}
                                  {s.motherJob && <span className="text-[10px] text-slate-500">({s.motherJob})</span>}
                                </p>
                              ) : null}
                              {!s.fatherName && !s.motherName && (
                                <span className="text-slate-400 italic text-[11px]">- គ្មានទិន្នន័យ -</span>
                              )}
                            </td>
                            <td className="p-3.5 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-xl font-bold text-[10px] inline-block ${
                                  s.familyStatus === 'ក្រ១'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : s.familyStatus === 'ក្រ២'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {s.familyStatus || 'ទូទៅ'}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleStudentRepeating(s)}
                                className={`px-2.5 py-1 rounded-xl font-bold text-[10px] inline-flex items-center gap-1 transition shadow-xs cursor-pointer ${
                                  isRep
                                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                                title="ចុចទីនេះដើម្បីប្តូររវាង ត្រួតថ្នាក់ និង ឡើងថ្នាក់ (ស៊ីគ្នានឹងស្ថិតិ PRI)"
                              >
                                {isRep ? '🔁 ត្រួតថ្នាក់' : '🌟 ឡើងថ្នាក់'}
                              </button>
                            </td>
                            <td className="p-3.5 text-slate-600 font-medium font-mono text-[11px]">
                              <p className="flex items-center gap-1 text-slate-700">
                                <PhoneCall className="w-3 h-3 text-slate-400" />
                                {s.parentPhone || '012 345 678'}
                              </p>
                              <p className="text-[10px] text-emerald-700 truncate max-w-[130px]" title={s.plpAccount}>
                                {s.plpAccount || 'PLP Active'}
                              </p>
                            </td>
                            <td className="p-3.5 no-print text-center flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handlePrintSingleStudent(s)}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-950 p-2 rounded-xl transition duration-200 border border-amber-300 shadow-xs"
                                title="🖨️ បោះពុម្ពជីវប្រវត្តិរូបសង្ខេបសិស្សម្នាក់នេះ (A4 Portrait)"
                              >
                                <Printer className="w-4 h-4 text-amber-900" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingStudent(s);
                                  setIsEditStudentOpen(true);
                                }}
                                className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition duration-200"
                                title="កែប្រែប្រវត្តិរូប"
                              >
                                <UserCog className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteStudent(s.id)}
                                className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition duration-200"
                                title="លុបសិស្ស"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 1.1b Student ID Cards */}
          {subSec1 === 'id_cards' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-[28px] border border-slate-200/80 shadow-xs">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-indigo-600" />
                    <span>ប័ណ្ណសម្គាល់ខ្លួនសិស្ស (ID Cards)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    មើល ទាញយក ឬបោះពុម្ពប័ណ្ណសម្គាល់ខ្លួនសិស្សទាំងអស់ដែលមាន៥រចនាបទ និងសន្លឹក QR Code។
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => window.print()}
                    className="no-print bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white px-4 py-2.5 rounded-2xl text-xs font-black transition shadow-md shadow-indigo-500/20 flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-white" />
                    <span>បោះពុម្ពប័ណ្ណទាំងអស់</span>
                  </button>
                </div>
              </div>

              {/* ID Cards Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 print:block print:space-y-8">
                {students.map((student) => {
                  const avatarPath = `/avatars/student-${student.rollNo % 5 + 1}.png`;
                  return (
                    <div key={student.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm print:break-inside-avoid print:border-none print:shadow-none print:p-0">
                      <DigitalStudentIdCard
                        student={student}
                        teacher={teacher}
                        selectedAvatar={undefined}
                        hideControls={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* 1.2 Attendance Marker (Direct App Attendance & WikiSchool & PLP Portal) */}
          {subSec1 === 'attendance' && (() => {
            const currentDayAttendance = attendance[selectedAttendanceDate] || {};

            const getKhmerDateDisplay = (dateStr: string) => {
              try {
                const [y, m, d] = dateStr.split('-').map(Number);
                const dateObj = new Date(y, m - 1, d);
                const khmerDays = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
                const khmerMonths = [
                  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
                  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
                ];
                const toKhmerNum = (n: number) => {
                  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
                  return String(n).split('').map(c => khmerDigits[Number(c)] || c).join('');
                };
                const dayName = khmerDays[dateObj.getDay()];
                const monthName = khmerMonths[m - 1];
                return `ថ្ងៃ${dayName} ទី${toKhmerNum(d)} ខែ${monthName} ឆ្នាំ${toKhmerNum(y)}`;
              } catch {
                return dateStr;
              }
            };

            const handleShiftAttendanceDate = (days: number) => {
              try {
                const [y, m, d] = selectedAttendanceDate.split('-').map(Number);
                const curr = new Date(y, m - 1, d);
                curr.setDate(curr.getDate() + days);
                const nextY = curr.getFullYear();
                const nextM = String(curr.getMonth() + 1).padStart(2, '0');
                const nextD = String(curr.getDate()).padStart(2, '0');
                setSelectedAttendanceDate(`${nextY}-${nextM}-${nextD}`);
              } catch {
                // fallback
              }
            };

            let presentCount = 0;
            let permissionCount = 0;
            let absentCount = 0;

            students.forEach((s) => {
              const status = currentDayAttendance[s.id] || 'present';
              if (status === 'present') presentCount++;
              else if (status === 'permission') permissionCount++;
              else if (status === 'absent') absentCount++;
            });

            const totalStudents = students.length;
            const femaleStudentsCount = students.filter(s => s.gender === 'ស្រី').length;
            const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 100;

            const filteredAttendanceStudents = students.filter((s) => {
              const matchesSearch =
                s.name.toLowerCase().includes(attendanceSearchQuery.toLowerCase()) ||
                (s.latinName && s.latinName.toLowerCase().includes(attendanceSearchQuery.toLowerCase())) ||
                String(s.rollNo).includes(attendanceSearchQuery) ||
                String(s.id).includes(attendanceSearchQuery);

              if (!matchesSearch) return false;

              const status = currentDayAttendance[s.id] || 'present';
              if (attendanceStatusFilter === 'all') return true;
              return status === attendanceStatusFilter;
            });

            const handleMarkAllPresent = () => {
              students.forEach((s) => {
                onUpdateAttendance(selectedAttendanceDate, s.id, 'present');
              });
              onShowToast(`បានកត់ត្រាវត្តមានសិស្សទាំង ${students.length} នាក់ជា (វត្តមាន) សម្រាប់ថ្ងៃនេះដោយជោគជ័យ!`);
            };

            return (
              <div className="space-y-4">
                {/* Portal Source Selector / Top Navigation Banner */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white p-6 rounded-[28px] shadow-lg border border-purple-900/40">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-purple-200 backdrop-blur-md">
                      <Globe className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>ប្រព័ន្ធស្រង់វត្តមានសិស្ស (Attendance Portals)</span>
                    </div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      <span>ជ្រើសរើសប្រព័ន្ធស្រង់វត្តមានសិស្ស</span>
                    </h3>
                    <p className="text-xs text-purple-200/90 leading-relaxed max-w-xl">
                      លោកគ្រូ អ្នកគ្រូ អាចជ្រើសរើសស្រង់វត្តមានផ្ទាល់លើកម្មវិធី ឬស្រង់តាម WikiSchool និង PLP SMS របស់ក្រសួងអប់រំ
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                    {/* Direct In-App Attendance Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedPortal('direct')}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all duration-200 flex items-center gap-2 active:scale-95 border ${
                        selectedPortal === 'direct'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-300 ring-2 ring-emerald-400/40 shadow-emerald-900/30'
                          : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-emerald-300" />
                      <span>ស្រង់វត្តមានផ្ទាល់លើកម្មវិធី</span>
                    </button>

                    {/* WikiSchool Portal Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedPortal('wikischool')}
                      className={`px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center gap-1.5 active:scale-95 border ${
                        selectedPortal === 'wikischool'
                          ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/40 shadow-md font-extrabold'
                          : 'bg-white/10 hover:bg-white/20 text-amber-200 border-amber-400/30'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>WikiSchool</span>
                    </button>

                    {/* PLP SMS Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedPortal('plp')}
                      className={`px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center gap-1.5 active:scale-95 border ${
                        selectedPortal === 'plp'
                          ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 border-teal-300 ring-2 ring-teal-400/40 shadow-md font-extrabold'
                          : 'bg-white/10 hover:bg-white/20 text-teal-200 border-teal-400/30'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>PLP SMS</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Switch Bar */}
                <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setSelectedPortal('direct')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                        selectedPortal === 'direct'
                          ? 'bg-purple-900 text-white shadow-sm shadow-purple-950/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>ស្រង់វត្តមានផ្ទាល់លើកម្មវិធី (In-App)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPortal('wikischool')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                        selectedPortal === 'wikischool'
                          ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Globe className="w-4 h-4 text-amber-600" />
                      <span>WikiSchool Attendance Portal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPortal('plp')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                        selectedPortal === 'plp'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>PLP SMS Portal (MoEYS)</span>
                    </button>
                  </div>

                  {selectedPortal !== 'direct' && (
                    <a
                      href={selectedPortal === 'plp' ? 'https://plp-sms.moeys.gov.kh/my-students' : 'https://portal.wikischool.asia/attendance/confirm'}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden sm:inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>បើកផ្ទាំងថ្មី (New Tab)</span>
                    </a>
                  )}
                </div>

                {/* VIEW 1: DIRECT IN-APP ATTENDANCE WITH ADVANCED ANALYTICS */}
                {selectedPortal === 'direct' && (
                  <AttendanceManager
                    teacher={teacher}
                    students={students}
                    attendance={attendance}
                    onUpdateAttendance={onUpdateAttendance}
                    onSaveAttendance={onSaveAttendance}
                    onBatchUpdateAttendance={onBatchUpdateAttendance}
                    onOpenPdfCustomizer={() => setIsAttendancePdfModalOpen(true)}
                    onShowToast={onShowToast}
                  />
                )}

                {/* VIEW 2 & 3: WIKISCHOOL & PLP SMS IFRAME PORTAL */}
                {selectedPortal !== 'direct' && (
                  <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-mono font-bold text-slate-500 ml-2">
                          {selectedPortal === 'plp' ? 'https://plp-sms.moeys.gov.kh/my-students' : 'https://portal.wikischool.asia/attendance/confirm'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setSelectedPortal('wikischool')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            selectedPortal === 'wikischool'
                              ? 'bg-white text-purple-950 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          WikiSchool Portal
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPortal('plp')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            selectedPortal === 'plp'
                              ? 'bg-white text-emerald-950 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          PLP SMS Portal
                        </button>
                      </div>
                    </div>

                    <div className="w-full h-[650px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                      <iframe
                        src={selectedPortal === 'plp' ? 'https://plp-sms.moeys.gov.kh/my-students' : 'https://portal.wikischool.asia/attendance/confirm'}
                        className="w-full h-full border-none"
                        title="Attendance Portal"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 1.3 Grades & Rank (MoEYS Standard Multi-Period System: Monthly, Semester 1 & 2, Annual) */}
          {subSec1 === 'grades' && (() => {
            // Determine active period info and period summaries
            const activePeriodInfo = GRADE_PERIODS.find(p => p.key === selectedGradePeriod) || GRADE_PERIODS[0];
            const isSemester1Summary = gradeSemesterTab === 1 && selectedGradePeriod === 's1_summary';
            const isSemester2Summary = gradeSemesterTab === 2 && selectedGradePeriod === 's2_summary';
            const isAnnualSummary = gradeSemesterTab === 'annual' || selectedGradePeriod === 'annual_summary';

            // Current Period Sub-Subjects (derived per month/period, fallback to activeSubSubjects)
            const currentPeriodSubSubjects = (
              periodSubSubjectsMap[selectedGradePeriod] &&
              Array.isArray(periodSubSubjectsMap[selectedGradePeriod]) &&
              periodSubSubjectsMap[selectedGradePeriod].length > 0
            ) ? periodSubSubjectsMap[selectedGradePeriod] : activeSubSubjects;

            // Calculations based on active view mode
            const singlePeriodSummary = (!isSemester1Summary && !isSemester2Summary && !isAnnualSummary)
              ? calculateSinglePeriodSummary(
                  students,
                  grades,
                  selectedGradePeriod,
                  gradeThresholds,
                  currentPeriodSubSubjects,
                  subScoresState,
                  periodSubSubjectsMap
                )
              : null;
            const s1SummaryData = (isSemester1Summary || (gradeSemesterTab === 1 && !isSemester1Summary))
              ? calculateSemesterSummary(
                  students,
                  grades,
                  1,
                  selectedS1Months,
                  gradeThresholds,
                  activeSubSubjects,
                  subScoresState,
                  periodSubSubjectsMap
                )
              : null;
            const s2SummaryData = (isSemester2Summary || (gradeSemesterTab === 2 && !isSemester2Summary))
              ? calculateSemesterSummary(
                  students,
                  grades,
                  2,
                  selectedS2Months,
                  gradeThresholds,
                  activeSubSubjects,
                  subScoresState,
                  periodSubSubjectsMap
                )
              : null;
            const annualSummaryData = calculateAnnualSummary(
              students,
              grades,
              gradeThresholds,
              selectedS1Months,
              selectedS2Months,
              activeSubSubjects,
              subScoresState,
              periodSubSubjectsMap
            );

            // Filter logic
            const filterStudent = (s: Student, rankLetter?: string) => {
              if (gradeSearchQuery.trim()) {
                const q = gradeSearchQuery.toLowerCase();
                const matchesName = s.name.toLowerCase().includes(q);
                const matchesId = s.civilId?.toLowerCase().includes(q) || String(s.rollNo).includes(q);
                if (!matchesName && !matchesId) return false;
              }
              if (gradeGenderFilter !== 'all' && s.gender !== gradeGenderFilter) {
                return false;
              }
              if (gradeRankFilter !== 'all' && rankLetter && rankLetter !== gradeRankFilter) {
                return false;
              }
              return true;
            };

            // Clear Grades for Current Period Handler
            const handleClearCurrentPeriodGrades = () => {
              // 1. Build cleared subScores (all 0) for every student in current period
              const clearedPeriodSubScores: Record<number | string, Record<string, number>> = {};
              const allSubIds = getAllPrimarySubSubjects().map(s => s.id);
              students.forEach(st => {
                clearedPeriodSubScores[st.id] = {};
                allSubIds.forEach(subId => {
                  clearedPeriodSubScores[st.id][subId] = 0;
                });
              });

              const updatedSub = {
                ...subScoresState,
                [selectedGradePeriod]: clearedPeriodSubScores,
              };
              setSubScoresState(updatedSub);
              saveYearScopedData(activeAcademicYearValue, 'sub_scores', updatedSub);
              try {
                localStorage.setItem('school_sub_scores_db', JSON.stringify(updatedSub));
              } catch {}

              // 2. Set all core subjects and subScores to 0 in grades database
              const newPeriodGrades: Record<number, StudentGrade> = {};
              students.forEach(st => {
                newPeriodGrades[st.id] = {
                  khmer: 0,
                  math: 0,
                  science: 0,
                  social: 0,
                  subScores: { ...clearedPeriodSubScores[st.id] },
                };
              });

              const newGradesDatabase: GradeDatabase = {
                ...grades,
                [selectedGradePeriod]: newPeriodGrades,
              };

              if (onBatchUpdateGrades) {
                onBatchUpdateGrades(newGradesDatabase);
              } else {
                students.forEach((st) => {
                  onUpdateGrade(st.id, 'khmer', 0, selectedGradePeriod);
                  onUpdateGrade(st.id, 'math', 0, selectedGradePeriod);
                  onUpdateGrade(st.id, 'science', 0, selectedGradePeriod);
                  onUpdateGrade(st.id, 'social', 0, selectedGradePeriod);
                });
              }

              setIsClearGradesModalOpen(false);
              triggerConfigSavedToast(`🧹 បានសម្អាតទិន្នន័យពិន្ទុសម្រាប់ «${activePeriodInfo.label}» ទៅជា 0.00 រួចរាល់!`);
              onShowToast(`🧹 បានសម្អាតពិន្ទុសម្រាប់ «${activePeriodInfo.label}» ទៅជា 0.00 ដោយជោគជ័យ!`);
            };

            // Handle CSV Export
            const handleExportCurrentPeriodCSV = () => {
              exportPeriodGradesToCsv(
                students,
                grades,
                selectedGradePeriod,
                teacher.grade || 'ថ្នាក់ទី ៤',
                teacher.academicYear || '២០២៥-២០២៦',
                currentPeriodSubSubjects,
                subScoresState
              );
              onShowToast('✅ បានទាញយកតារាងពិន្ទុជាឯកសារ Excel CSV ជោគជ័យ!');
            };

            return (
              <div className="space-y-5">
                {/* Auto-Save Temporary Toast Notification */}
                <AnimatePresence>
                  {autoSaveNotice && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      className="no-print bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-purple-500/40 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="font-extrabold text-white">{autoSaveNotice}</span>
                      </div>
                      <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-purple-200 font-medium shrink-0 border border-white/10">
                        ឆ្នាំសិក្សា៖ {activeAcademicYearValue}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Header Card with Actions */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-900 text-amber-300 flex items-center justify-center font-bold shadow-md shadow-purple-900/20 shrink-0">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                            តារាងពិន្ទុ & ចំណាត់ថ្នាក់សិស្ស (MoEYS Gradebook & Ranking)
                          </h3>
                          <span className="bg-purple-100 text-purple-900 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                            {activePeriodInfo.label}
                          </span>

                          {/* Auto-Save status indicator */}
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border transition-all duration-300 ${
                              autoSaveStatus === 'saving'
                                ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/20 shadow-xs'
                                : autoSaveStatus === 'saved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                            title={`ស្ថានភាពរក្សាទុកទិន្នន័យក្នុងឆ្នាំសិក្សា ${activeAcademicYearValue}`}
                          >
                            {autoSaveStatus === 'saving' ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                                <span>កំពុងរក្សាទុក... (Saving...)</span>
                              </>
                            ) : autoSaveStatus === 'saved' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>បានរក្សាទុកស្វ័យប្រវត្តិ {lastSavedTime ? `(${lastSavedTime})` : ''}</span>
                              </>
                            ) : (
                              <>
                                <Cloud className="w-3.5 h-3.5 text-slate-500" />
                                <span>រក្សាទុកដោយស្វ័យប្រវត្តិ</span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          បញ្ចូលពិន្ទុតេស្តប្រចាំខែ (តុលា ដល់ កក្កដា), ប្រឡងឆមាសទី១, ឆមាសទី២ និងបូកសរុបលទ្ធផលប្រចាំឆ្នាំ ({activeAcademicYearValue})
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setIsClearGradesModalOpen(true)}
                      className="no-print bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-2xs"
                      title={`សម្អាតទិន្នន័យពិន្ទុទាំងអស់សម្រាប់ «${activePeriodInfo.label}»`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>សម្អាតពិន្ទុ</span>
                    </button>
                    <button
                      onClick={handleExportCurrentPeriodCSV}
                      className="no-print bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
                      title="ទាញយកជា Excel CSV UTF-8"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Excel CSV</span>
                    </button>
                    <button
                      onClick={() => setIsGradesPdfModalOpen(true)}
                      className="no-print bg-purple-900 hover:bg-purple-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-purple-900/20 transition flex items-center gap-2 active:scale-95 cursor-pointer"
                      title="កំណត់ទម្រង់ ស្ទីល ហត្ថលេខា និងទាញយកជា PDF តារាងពិន្ទុ & និទ្ទេស A4 Landscape"
                    >
                      <FileText className="w-4 h-4 text-amber-300" />
                      <span>📄 ទាញយក PDF</span>
                    </button>
                    <button
                      onClick={() => setIsOfficialReportOpen(true)}
                      className="no-print bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-black shadow-md shadow-amber-400/20 transition flex items-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 text-purple-950" />
                      <span>របាយការណ៍ផ្លូវការ</span>
                    </button>
                    <button
                      onClick={() => setSubSec1('honor_roll')}
                      className="no-print bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 border border-amber-300 ring-2 ring-amber-400/40"
                      title="បើកមើលតារាងកិត្តិយស សិស្សឆ្នើមទាំង ៥ និងបោះពុម្ពប័ណ្ណសរសើរ"
                    >
                      <Trophy className="w-4 h-4 text-purple-950" />
                      <span>🏆 តារាងកិត្តិយស & ប័ណ្ណសរសើរ</span>
                    </button>
                    <button
                      onClick={() => {
                        triggerConfigSavedToast(`បានរក្សាទុកពិន្ទុ និងការកំណត់ទាំងអស់ទៅក្នុងឆ្នាំសិក្សា ${activeAcademicYearValue} ដោយជោគជ័យ!`);
                        onSaveGrades();
                      }}
                      className="no-print bg-purple-950 hover:bg-purple-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-purple-950/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      title={`រក្សាទុកពិន្ទុ និងការកំណត់ក្នុងឆ្នាំសិក្សា ${activeAcademicYearValue}`}
                    >
                      <Save className="w-4 h-4 text-emerald-400" />
                      <span>រក្សាទុក</span>
                    </button>
                    <button
                      onClick={() => setIsThresholdModalOpen(true)}
                      className="no-print bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer"
                      title="កំណត់ពិន្ទុនិទ្ទេស (Grade Thresholds)"
                    >
                      <Settings className="w-4 h-4 text-purple-800" />
                      <span>កំណត់និទ្ទេស</span>
                    </button>
                    <button
                      onClick={() => setIsSemesterMonthModalOpen(true)}
                      className="no-print bg-indigo-50 hover:bg-indigo-100 text-indigo-900 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer border border-indigo-200"
                      title="កំណត់ខែសម្រាប់ឆមាសទី១ និងឆមាសទី២"
                    >
                      <Calendar className="w-4 h-4 text-indigo-700" />
                      <span>កំណត់ខែឆមាស</span>
                    </button>
                    <button
                      onClick={() => setIsSubSubjectModalOpen(true)}
                      className="no-print bg-amber-50 hover:bg-amber-100 text-amber-950 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer border border-amber-200 shadow-2xs active:scale-95"
                      title={`រើសមុខវិជ្ជារង និងសមត្ថភាពតាមខែនីមួយៗសម្រាប់ស្រង់ពិន្ទុបឋមសិក្សា (បច្ចុប្បន្ន៖ ${activePeriodInfo.label})`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>កំណត់មុខវិជ្ជារងតាមខែ ({currentPeriodSubSubjects.length})</span>
                    </button>
                  </div>
                </div>

                {/* Master Semester Tabs (Semester 1 | Semester 2 | Annual) */}
                <div className="bg-white p-4 sm:p-5 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                        ដំណាក់កាលវាយតម្លៃ៖
                      </span>
                      <div className="inline-flex p-1 bg-slate-100 rounded-2xl">
                        <button
                          onClick={() => {
                            setGradeSemesterTab(1);
                            const validS1 = [...selectedS1Months, 's1_exam', 's1_summary'];
                            if (!validS1.includes(selectedGradePeriod)) {
                              setSelectedGradePeriod((selectedS1Months[0] as GradePeriodKey) || 'm10');
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            gradeSemesterTab === 1
                              ? 'bg-purple-900 text-white shadow-md shadow-purple-900/20'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          📘 ឆមាសទី១ (Semester 1)
                        </button>
                        <button
                          onClick={() => {
                            setGradeSemesterTab(2);
                            const validS2 = [...selectedS2Months, 's2_exam', 's2_summary'];
                            if (!validS2.includes(selectedGradePeriod)) {
                              setSelectedGradePeriod((selectedS2Months[0] as GradePeriodKey) || 'm02');
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            gradeSemesterTab === 2
                              ? 'bg-purple-900 text-white shadow-md shadow-purple-900/20'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          📗 ឆមាសទី២ (Semester 2)
                        </button>
                        <button
                          onClick={() => {
                            setGradeSemesterTab('annual');
                            setSelectedGradePeriod('annual_summary');
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            gradeSemesterTab === 'annual'
                              ? 'bg-amber-400 text-purple-950 shadow-md shadow-amber-400/20 font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          🏆 បូកសរុបប្រចាំឆ្នាំ (Annual)
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5 self-end sm:self-auto">
                      <Calendar className="w-3.5 h-3.5 text-purple-700" />
                      <span>ឆ្នាំសិក្សា {activeAcademicYearValue || teacher.academicYear || '២០២៦-២០២៧'}</span>
                    </div>
                  </div>

                  {/* Sub-period Selector Pills */}
                  {gradeSemesterTab === 1 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-600 mr-1">ជ្រើសរើសខែ / ការវាយតម្លៃ៖</span>
                      {ALL_ENTRY_MONTHS.filter(m => selectedS1Months.includes(m.key)).map((pInfo) => {
                        const pk = pInfo.key;
                        const isSelected = selectedGradePeriod === pk;
                        const pSubs = (periodSubSubjectsMap[pk] && periodSubSubjectsMap[pk].length > 0)
                          ? periodSubSubjectsMap[pk]
                          : activeSubSubjects;
                        return (
                          <button
                            key={pk}
                            onClick={() => setSelectedGradePeriod(pk)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-purple-900 text-white shadow-sm ring-2 ring-purple-900 ring-offset-1'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span>{pInfo.shortLabel || pInfo.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                              isSelected ? 'bg-purple-800 text-amber-300' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {pSubs.length}
                            </span>
                          </button>
                        );
                      })}
                      {(() => {
                        const isSelected = selectedGradePeriod === 's1_exam';
                        const s1ExamSubs = (periodSubSubjectsMap['s1_exam'] && periodSubSubjectsMap['s1_exam'].length > 0)
                          ? periodSubSubjectsMap['s1_exam']
                          : activeSubSubjects;
                        return (
                          <button
                            onClick={() => setSelectedGradePeriod('s1_exam')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-amber-700 text-white shadow-sm ring-2 ring-amber-700 ring-offset-1'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                            }`}
                          >
                            <span>ប្រឡងឆមាសទី១</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                              isSelected ? 'bg-amber-800 text-amber-200' : 'bg-amber-200/80 text-amber-900'
                            }`}>
                              {s1ExamSubs.length}
                            </span>
                          </button>
                        );
                      })()}
                      <button
                        onClick={() => setSelectedGradePeriod('s1_summary')}
                        className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedGradePeriod === 's1_summary'
                            ? 'bg-indigo-900 text-white shadow-sm ring-2 ring-indigo-900 ring-offset-1'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>📊 បូកសរុបប្រចាំឆមាសទី១</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const hasExtra = selectedS1Months.includes('m02') && selectedS1Months.includes('m03');
                          if (hasExtra) {
                            setSelectedS1Months(['m10', 'm11', 'm12', 'm01']);
                            onShowToast("បានកំណត់ឆមាសទី១ ស្ដង់ដារ (៤ ខែ)!");
                          } else {
                            setSelectedS1Months(['m10', 'm11', 'm12', 'm01', 'm02', 'm03']);
                            onShowToast("បានបន្ថែម ២ ខែទៀតក្នុងឆមាសទី១ (សរុប ៦ ខែ)!");
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-100/70 hover:bg-purple-200 border border-purple-200 transition cursor-pointer flex items-center gap-1"
                        title="បន្ថែម ឬដោះ ២ ខែទៀតក្នុងឆមាសទី១"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{selectedS1Months.length > 4 ? 'ស្ដង់ដារ (៤ខែ)' : '+២ ខែទៀត (៦ខែ)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsSemesterMonthModalOpen(true)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer flex items-center gap-1"
                        title="កំណត់ខែសម្រាប់ឆមាសទី១"
                      >
                        <Calendar className="w-3.5 h-3.5 text-purple-700" />
                        <span>⚙️ កំណត់ខែ ({selectedS1Months.length})</span>
                      </button>
                    </div>
                  )}

                  {gradeSemesterTab === 2 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-600 mr-1">ជ្រើសរើសខែ / ការវាយតម្លៃ៖</span>
                      {ALL_ENTRY_MONTHS.filter(m => selectedS2Months.includes(m.key)).map((pInfo) => {
                        const pk = pInfo.key;
                        const isSelected = selectedGradePeriod === pk;
                        const pSubs = (periodSubSubjectsMap[pk] && periodSubSubjectsMap[pk].length > 0)
                          ? periodSubSubjectsMap[pk]
                          : activeSubSubjects;
                        return (
                          <button
                            key={pk}
                            onClick={() => setSelectedGradePeriod(pk)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-purple-900 text-white shadow-sm ring-2 ring-purple-900 ring-offset-1'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span>{pInfo.shortLabel || pInfo.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                              isSelected ? 'bg-purple-800 text-amber-300' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {pSubs.length}
                            </span>
                          </button>
                        );
                      })}
                      {(() => {
                        const isSelected = selectedGradePeriod === 's2_exam';
                        const s2ExamSubs = (periodSubSubjectsMap['s2_exam'] && periodSubSubjectsMap['s2_exam'].length > 0)
                          ? periodSubSubjectsMap['s2_exam']
                          : activeSubSubjects;
                        return (
                          <button
                            onClick={() => setSelectedGradePeriod('s2_exam')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-amber-700 text-white shadow-sm ring-2 ring-amber-700 ring-offset-1'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                            }`}
                          >
                            <span>ប្រឡងឆមាសទី២</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                              isSelected ? 'bg-amber-800 text-amber-200' : 'bg-amber-200/80 text-amber-900'
                            }`}>
                              {s2ExamSubs.length}
                            </span>
                          </button>
                        );
                      })()}
                      <button
                        onClick={() => setSelectedGradePeriod('s2_summary')}
                        className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedGradePeriod === 's2_summary'
                            ? 'bg-indigo-900 text-white shadow-sm ring-2 ring-indigo-900 ring-offset-1'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>📊 បូកសរុបប្រចាំឆមាសទី២</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const hasAugustSeptember = selectedS2Months.includes('m08') && selectedS2Months.includes('m09');
                          if (hasAugustSeptember) {
                            setSelectedS2Months(['m02', 'm03', 'm04', 'm05', 'm06', 'm07']);
                            onShowToast("បានកំណត់ឆមាសទី២ ស្ដង់ដារ (៦ ខែ)!");
                          } else {
                            setSelectedS2Months(['m02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09']);
                            onShowToast("បានបន្ថែម ២ ខែទៀតក្នុងឆមាសទី២ (រួមទាំង សីហា & កញ្ញា សរុប ៨ ខែ)!");
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-100/70 hover:bg-indigo-200 border border-indigo-200 transition cursor-pointer flex items-center gap-1"
                        title="បន្ថែម ឬដោះ ២ ខែទៀតក្នុងឆមាសទី២ (សីហា, កញ្ញា)"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{selectedS2Months.includes('m08') ? 'ស្ដង់ដារ (៦ខែ)' : '+២ ខែទៀត (សីហា, កញ្ញា)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsSemesterMonthModalOpen(true)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer flex items-center gap-1"
                        title="កំណត់ខែសម្រាប់ឆមាសទី២"
                      >
                        <Calendar className="w-3.5 h-3.5 text-indigo-700" />
                        <span>⚙️ កំណត់ខែ ({selectedS2Months.length})</span>
                      </button>
                    </div>
                  )}

                  {gradeSemesterTab === 'annual' && (
                    <div className="flex items-center gap-2 flex-wrap bg-amber-50/80 border border-amber-200/80 p-3 rounded-2xl text-xs text-amber-950">
                      <Award className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-extrabold">
                        តារាងលទ្ធផលបូកសរុបប្រចាំឆ្នាំ៖ គណនាមធ្យមភាគស្វ័យប្រវត្តិនៃ (ឆមាសទី១ + ឆមាសទី២) ÷ ២, ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ, និទ្ទេសរួម, លទ្ធផលឡើងថ្នាក់/ត្រួតថ្នាក់ និងការសរសើរ។
                      </span>
                    </div>
                  )}
                </div>

                {/* KPI Summary Cards */}
                {(() => {
                  let totalCount = students.length;
                  let femaleCount = students.filter((s) => s.gender === 'ស្រី').length;
                  let classAvg = 0;
                  let passCount = 0;
                  let aCount = 0;
                  let bCount = 0;
                  let cCount = 0;
                  let dCount = 0;
                  let fCount = 0;

                  if (isAnnualSummary) {
                    classAvg = annualSummaryData.classAverage;
                    passCount = annualSummaryData.passedCount;
                    aCount = annualSummaryData.gradeCounts.A;
                    bCount = annualSummaryData.gradeCounts.B;
                    cCount = annualSummaryData.gradeCounts.C;
                    dCount = annualSummaryData.gradeCounts.D;
                    fCount = annualSummaryData.gradeCounts.F;
                  } else if (isSemester1Summary && s1SummaryData) {
                    classAvg = s1SummaryData.classAverage;
                    passCount = s1SummaryData.passedCount;
                    aCount = s1SummaryData.gradeCounts.A;
                    bCount = s1SummaryData.gradeCounts.B;
                    cCount = s1SummaryData.gradeCounts.C;
                    dCount = s1SummaryData.gradeCounts.D;
                    fCount = s1SummaryData.gradeCounts.F;
                  } else if (isSemester2Summary && s2SummaryData) {
                    classAvg = s2SummaryData.classAverage;
                    passCount = s2SummaryData.passedCount;
                    aCount = s2SummaryData.gradeCounts.A;
                    bCount = s2SummaryData.gradeCounts.B;
                    cCount = s2SummaryData.gradeCounts.C;
                    dCount = s2SummaryData.gradeCounts.D;
                    fCount = s2SummaryData.gradeCounts.F;
                  } else if (singlePeriodSummary) {
                    classAvg = singlePeriodSummary.classAverage;
                    passCount = singlePeriodSummary.passedCount;
                    aCount = singlePeriodSummary.gradeCounts.A;
                    bCount = singlePeriodSummary.gradeCounts.B;
                    cCount = singlePeriodSummary.gradeCounts.C;
                    dCount = singlePeriodSummary.gradeCounts.D;
                    fCount = singlePeriodSummary.gradeCounts.F;
                  }

                  const passRate = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(1) : '0.0';

                  return (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                          <span>សិស្សសរុប</span>
                          <Users className="w-4 h-4 text-purple-700" />
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl font-black text-slate-900">{totalCount}</span>
                          <span className="text-xs font-bold text-rose-700">ស្រី {femaleCount}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">ក្នុងបញ្ជីវត្តមានថ្នាក់</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                          <span>មធ្យមភាគរួមថ្នាក់</span>
                          <Calculator className="w-4 h-4 text-indigo-700" />
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl font-black text-purple-950">{classAvg}</span>
                          <span className="text-xs font-bold text-slate-500">/ ១០០</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{activePeriodInfo.label}</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                          <span>សិស្សជាប់ (≥ ៥០)</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl font-black text-emerald-700">{passCount}</span>
                          <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                            {passRate}%
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">ធ្លាក់: {totalCount - passCount} នាក់</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                          <span>ការបែងចែកនិទ្ទេស</span>
                          <Award className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap text-xs font-bold">
                          <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded text-[11px]">A:{aCount}</span>
                          <span className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded text-[11px]">B:{bCount}</span>
                          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[11px]">C:{cCount}</span>
                          <span className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded text-[11px]">D/F:{dCount + fCount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Filters & Search Toolbar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={gradeSearchQuery}
                      onChange={(e) => setGradeSearchQuery(e.target.value)}
                      placeholder="ស្វែងរកតាមឈ្មោះសិស្ស ឬអត្តលេខ..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-500">ភេទ៖</span>
                      <select
                        value={gradeGenderFilter}
                        onChange={(e) => setGradeGenderFilter(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs"
                      >
                        <option value="all">ទាំងអស់</option>
                        <option value="ប្រុស">ប្រុស</option>
                        <option value="ស្រី">ស្រី</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-500">និទ្ទេស៖</span>
                      <select
                        value={gradeRankFilter}
                        onChange={(e) => setGradeRankFilter(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs"
                      >
                        <option value="all">ទាំងអស់</option>
                        <option value="A">A (ល្អប្រសើរ ≥ ៨៥)</option>
                        <option value="B">B (ល្អ ៧៥ - ៨៤)</option>
                        <option value="C">C (មធ្យម ៦៥ - ៧៤)</option>
                        <option value="D">D (គួរគប្បី)</option>
                        <option value="E">E (ខ្សោយ)</option>
                        <option value="F">F (ធ្លាក់)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl">
                      <input
                        type="checkbox"
                        id="showMainSubjectsToggle"
                        checked={showMainSubjects}
                        onChange={(e) => setShowMainSubjects(e.target.checked)}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <label htmlFor="showMainSubjectsToggle" className="text-xs font-extrabold text-amber-950 cursor-pointer">
                        បង្ហាញមុខវិជ្ជាគោលទាំង៤
                      </label>
                    </div>

                    {(gradeSearchQuery || gradeGenderFilter !== 'all' || gradeRankFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setGradeSearchQuery('');
                          setGradeGenderFilter('all');
                          setGradeRankFilter('all');
                        }}
                        className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        សម្អាតតម្រង
                      </button>
                    )}
                  </div>
                </div>

                {/* View Mode Switcher: 📄 លទ្ធផលសង្ខេប (តែមួយទំព័រ) vs 📊 លទ្ធផលបង្ហាញពេញលេញគ្រប់ពិន្ទុតាមមុខវិជ្ជា */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setGradeViewMode('summary');
                        try { localStorage.setItem('school_grade_view_mode', 'summary'); } catch {}
                      }}
                      className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                        gradeViewMode === 'summary'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-amber-300" />
                      <span>📄 លទ្ធផលសង្ខេប (តែមួយទំព័រ)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGradeViewMode('full');
                        try { localStorage.setItem('school_grade_view_mode', 'full'); } catch {}
                      }}
                      className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                        gradeViewMode === 'full'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <Table className="w-4 h-4 text-amber-300" />
                      <span>📊 លទ្ធផលបង្ហាញពេញលេញគ្រប់ពិន្ទុតាមមុខវិជ្ជា</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="hidden sm:inline">ទម្រង់បច្ចុប្បន្ន៖</span>
                    <span className="bg-purple-50 text-purple-950 font-black px-2.5 py-1 rounded-xl border border-purple-200">
                      {gradeViewMode === 'summary' ? '✅ តារាងសង្ខេប (១ ទំព័រ)' : '✅ តារាងពេញលេញ (គ្រប់មុខវិជ្ជា)'}
                    </span>
                  </div>
                </div>

                {/* Main Table Views */}
                <div className="bg-white border border-slate-200/80 rounded-[28px] overflow-hidden shadow-xs">
                  {gradeViewMode === 'summary' ? (
                    <div className="p-4 sm:p-5">
                      {isAnnualSummary && (
                        <GradeSummaryTable
                          periodLabel="បូកសរុបប្រចាំឆ្នាំ"
                          periodType="annual_summary"
                          academicYear={activeAcademicYearValue || teacher.academicYear || '២០២៦-២០២៧'}
                          gradeLevel={teacher.grade || '...'}
                          schoolName={teacher.school || ''}
                          teacherName={teacher.name || ''}
                          students={annualSummaryData.students
                            .filter((item) => filterStudent(item.student, item.classification.letter))
                            .map((item, idx) => ({
                              no: idx + 1,
                              studentId: item.student.civilId || item.student.rollNo || item.student.id,
                              name: item.student.name,
                              gender: item.student.gender,
                              totalScore: Number((item.annualAverage * 10).toFixed(1)),
                              averageScore: item.annualAverage,
                              rank: item.rank,
                              letter: item.classification.letter,
                              letterLabel: item.classification.label,
                              passed: item.passed,
                              resultText: item.passed ? 'ឡើងថ្នាក់' : 'ត្រួតថ្នាក់',
                              honorTitle: item.honorTitle,
                            }))}
                          totalStudents={annualSummaryData.totalStudents}
                          femaleStudents={annualSummaryData.femaleStudents}
                          passedCount={annualSummaryData.passedCount}
                          failedCount={annualSummaryData.failedCount}
                          passRate={annualSummaryData.passRate}
                          classAverage={annualSummaryData.classAverage}
                          onSwitchToFullView={() => {
                            setGradeViewMode('full');
                            try { localStorage.setItem('school_grade_view_mode', 'full'); } catch {}
                          }}
                        />
                      )}

                      {isSemester1Summary && s1SummaryData && (
                        <GradeSummaryTable
                          periodLabel="បូកសរុបប្រចាំឆមាសទី១"
                          periodType="s1_summary"
                          academicYear={activeAcademicYearValue || teacher.academicYear || '២០២៦-២០២៧'}
                          gradeLevel={teacher.grade || '...'}
                          schoolName={teacher.school || ''}
                          teacherName={teacher.name || ''}
                          students={s1SummaryData.students
                            .filter((item) => filterStudent(item.student, item.classification.letter))
                            .map((item, idx) => ({
                              no: idx + 1,
                              studentId: item.student.civilId || item.student.rollNo || item.student.id,
                              name: item.student.name,
                              gender: item.student.gender,
                              totalScore: Number((item.semesterAverage * 10).toFixed(1)),
                              averageScore: item.semesterAverage,
                              rank: item.rank,
                              letter: item.classification.letter,
                              letterLabel: item.classification.label,
                              passed: item.passed,
                              resultText: item.passed ? 'ជាប់' : 'ធ្លាក់',
                              honorTitle: item.rank === 1 ? '🥇 សិស្សឆ្នើម' : item.rank === 2 ? '🥈 លេខ ២' : item.rank === 3 ? '🥉 លេខ ៣' : undefined,
                            }))}
                          totalStudents={s1SummaryData.totalStudents}
                          femaleStudents={s1SummaryData.femaleStudents}
                          passedCount={s1SummaryData.passedCount}
                          failedCount={s1SummaryData.failedCount}
                          passRate={s1SummaryData.passRate}
                          classAverage={s1SummaryData.classAverage}
                          onSwitchToFullView={() => {
                            setGradeViewMode('full');
                            try { localStorage.setItem('school_grade_view_mode', 'full'); } catch {}
                          }}
                        />
                      )}

                      {isSemester2Summary && s2SummaryData && (
                        <GradeSummaryTable
                          periodLabel="បូកសរុបប្រចាំឆមាសទី២"
                          periodType="s2_summary"
                          academicYear={activeAcademicYearValue || teacher.academicYear || '២០២៦-២០២៧'}
                          gradeLevel={teacher.grade || '...'}
                          schoolName={teacher.school || ''}
                          teacherName={teacher.name || ''}
                          students={s2SummaryData.students
                            .filter((item) => filterStudent(item.student, item.classification.letter))
                            .map((item, idx) => ({
                              no: idx + 1,
                              studentId: item.student.civilId || item.student.rollNo || item.student.id,
                              name: item.student.name,
                              gender: item.student.gender,
                              totalScore: Number((item.semesterAverage * 10).toFixed(1)),
                              averageScore: item.semesterAverage,
                              rank: item.rank,
                              letter: item.classification.letter,
                              letterLabel: item.classification.label,
                              passed: item.passed,
                              resultText: item.passed ? 'ជាប់' : 'ធ្លាក់',
                              honorTitle: item.rank === 1 ? '🥇 សិស្សឆ្នើម' : item.rank === 2 ? '🥈 លេខ ២' : item.rank === 3 ? '🥉 លេខ ៣' : undefined,
                            }))}
                          totalStudents={s2SummaryData.totalStudents}
                          femaleStudents={s2SummaryData.femaleStudents}
                          passedCount={s2SummaryData.passedCount}
                          failedCount={s2SummaryData.failedCount}
                          passRate={s2SummaryData.passRate}
                          classAverage={s2SummaryData.classAverage}
                          onSwitchToFullView={() => {
                            setGradeViewMode('full');
                            try { localStorage.setItem('school_grade_view_mode', 'full'); } catch {}
                          }}
                        />
                      )}

                      {!isSemester1Summary && !isSemester2Summary && !isAnnualSummary && singlePeriodSummary && (
                        <GradeSummaryTable
                          periodLabel={activePeriodInfo.label}
                          periodType={activePeriodInfo.isExam ? 'exam' : 'monthly'}
                          academicYear={activeAcademicYearValue || teacher.academicYear || '២០២៦-២០២៧'}
                          gradeLevel={teacher.grade || '...'}
                          schoolName={teacher.school || ''}
                          teacherName={teacher.name || ''}
                          students={singlePeriodSummary.students
                            .filter((item) => filterStudent(item.student, item.classification.letter))
                            .map((item, idx) => ({
                              no: idx + 1,
                              studentId: item.student.civilId || item.student.rollNo || item.student.id,
                              name: item.student.name,
                              gender: item.student.gender,
                              totalScore: item.total,
                              averageScore: item.average,
                              rank: item.rank,
                              letter: item.classification.letter,
                              letterLabel: item.classification.label,
                              passed: item.passed,
                              resultText: item.passed ? 'ជាប់' : 'ធ្លាក់',
                              honorTitle: item.rank === 1 ? '🥇 សិស្សឆ្នើម' : item.rank === 2 ? '🥈 លេខ ២' : item.rank === 3 ? '🥉 លេខ ៣' : undefined,
                            }))}
                          totalStudents={singlePeriodSummary.totalStudents}
                          femaleStudents={singlePeriodSummary.femaleStudents}
                          passedCount={singlePeriodSummary.passedCount}
                          failedCount={singlePeriodSummary.failedCount}
                          passRate={singlePeriodSummary.passRate}
                          classAverage={singlePeriodSummary.classAverage}
                          onSwitchToFullView={() => {
                            setGradeViewMode('full');
                            try { localStorage.setItem('school_grade_view_mode', 'full'); } catch {}
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Sub-subjects Grading Scale Reference Table */}
                      <div className="p-4 bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-blue-50/80 border-b border-indigo-100 flex flex-col gap-2">
                    <div className="font-extrabold text-indigo-950 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>📊 តារាងនិទ្ទេសសម្រាប់មុខវិជ្ជារង និងសមត្ថភាព (Sub-subject Grade Classification Scale)</span>
                      </span>
                      <button
                        onClick={() => setIsThresholdModalOpen(true)}
                        className="text-[11px] text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
                      >
                        ⚙️ កែប្រែក្នុង «កំណត់និទ្ទេស»
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
                      <div className="bg-emerald-100 text-emerald-900 border border-emerald-200 p-1.5 rounded-xl font-bold">
                        A: ល្អណាស់ (≥ {gradeThresholds.A.toFixed(2)})
                      </div>
                      <div className="bg-blue-100 text-blue-900 border border-blue-200 p-1.5 rounded-xl font-bold">
                        B: ល្អ ({gradeThresholds.B.toFixed(2)} - {(gradeThresholds.A - 0.01).toFixed(2)})
                      </div>
                      <div className="bg-amber-100 text-amber-900 border border-amber-200 p-1.5 rounded-xl font-bold">
                        C: មធ្យម ({gradeThresholds.C.toFixed(2)} - {(gradeThresholds.B - 0.01).toFixed(2)})
                      </div>
                      <div className="bg-orange-100 text-orange-900 border border-orange-200 p-1.5 rounded-xl font-bold">
                        D: គួរគប្បី ({gradeThresholds.D.toFixed(2)} - {(gradeThresholds.C - 0.01).toFixed(2)})
                      </div>
                      <div className="bg-yellow-100 text-yellow-900 border border-yellow-200 p-1.5 rounded-xl font-bold">
                        E: ខ្សោយ ({gradeThresholds.E.toFixed(2)} - {(gradeThresholds.D - 0.01).toFixed(2)})
                      </div>
                      <div className="bg-rose-100 text-rose-900 border border-rose-200 p-1.5 rounded-xl font-bold">
                        F: ធ្លាក់ (&lt; {gradeThresholds.E.toFixed(2)})
                      </div>
                    </div>
                  </div>

                  {/* VIEW 1: Single Month or Exam Period Detailed Entry Table (Unified Core + Sub-Subjects Categorized) */}
                  {!isSemester1Summary && !isSemester2Summary && !isAnnualSummary && singlePeriodSummary && (() => {
                    const allDefs = getAllPrimarySubSubjects();
                    const khmerSubs = currentPeriodSubSubjects.filter(id => allDefs.find(s => s.id === id)?.category === 'khmer');
                    const mathSubs = currentPeriodSubSubjects.filter(id => allDefs.find(s => s.id === id)?.category === 'math');
                    const scienceSubs = currentPeriodSubSubjects.filter(id => allDefs.find(s => s.id === id)?.category === 'science');
                    const socialSubs = currentPeriodSubSubjects.filter(id => allDefs.find(s => s.id === id)?.category === 'social');
                    const otherSubs = currentPeriodSubSubjects.filter(id => {
                      const def = allDefs.find(s => s.id === id);
                      return !def || def.category === 'other';
                    });

                    const renderSubCell = (studentId: number | string, subId: string) => {
                      const periodGrades = grades[selectedGradePeriod] || {};
                      const studentGrades = periodGrades[studentId] || {};
                      const subScores = studentGrades.subScores || {};
                      const val = subScoresState[selectedGradePeriod]?.[studentId]?.[subId] !== undefined 
                        ? subScoresState[selectedGradePeriod][studentId][subId] 
                        : (subScores[subId] !== undefined ? subScores[subId] : 0);

                      const subClass = getGradeClassification(val, gradeThresholds);

                      return (
                        <td key={subId} className="p-2 text-center bg-slate-50/50 border-l border-slate-200">
                          <div className="flex flex-col items-center gap-1">
                            <select
                              value={val}
                              onChange={(e) => {
                                const num = Number(e.target.value);
                                setSubScoresState(prev => {
                                  const pData = prev[selectedGradePeriod] || {};
                                  const sData = pData[studentId] || {};
                                  return {
                                    ...prev,
                                    [selectedGradePeriod]: {
                                      ...pData,
                                      [studentId]: {
                                        ...sData,
                                        [subId]: num
                                      }
                                    }
                                  };
                                });
                              }}
                              className="w-18 text-center border border-slate-200 rounded-xl px-1.5 py-1 font-bold text-slate-800 bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none cursor-pointer text-xs"
                            >
                              {scoreOptions.map(v => (
                                <option key={v} value={v}>{v.toFixed(2)}</option>
                              ))}
                            </select>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${subClass.colorBg}`}>
                              {subClass.letter}
                            </span>
                          </div>
                        </td>
                      );
                    };

                    return (
                      <>
                        <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700">
                          <thead className="bg-slate-100 font-bold border-b-2 border-slate-200 text-slate-800 text-[11px]">
                            <tr>
                              <th rowSpan={2} className="p-3 text-center w-12 border-r border-slate-200">ល.រ</th>
                              <th rowSpan={2} className="p-3 text-center w-24 border-r border-slate-200">អត្តលេខ</th>
                              <th rowSpan={2} className="p-3 min-w-[140px] border-r border-slate-200">គោត្តនាម-នាម</th>
                              <th rowSpan={2} className="p-3 text-center w-16 border-r border-slate-200">ភេទ</th>

                              {/* Khmer Group */}
                              {khmerSubs.length > 0 && (
                                <th colSpan={khmerSubs.length} className="bg-indigo-50/90 text-indigo-950 text-center font-extrabold border-r border-indigo-200 p-2">
                                  ភាសាខ្មែរ
                                </th>
                              )}
                              {/* Math Group */}
                              {mathSubs.length > 0 && (
                                <th colSpan={mathSubs.length} className="bg-blue-50/90 text-blue-950 text-center font-extrabold border-r border-blue-200 p-2">
                                  គណិតវិទ្យា
                                </th>
                              )}
                              {/* Science Group */}
                              {scienceSubs.length > 0 && (
                                <th colSpan={scienceSubs.length} className="bg-emerald-50/90 text-emerald-950 text-center font-extrabold border-r border-emerald-200 p-2">
                                  វិទ្យាសាស្ត្រ
                                </th>
                              )}
                              {/* Social Group */}
                              {socialSubs.length > 0 && (
                                <th colSpan={socialSubs.length} className="bg-amber-50/90 text-amber-950 text-center font-extrabold border-r border-amber-200 p-2">
                                  សិក្សាសង្គម
                                </th>
                              )}
                              {/* Other Group */}
                              {otherSubs.length > 0 && (
                                <th colSpan={otherSubs.length} className="bg-purple-50/90 text-purple-950 text-center font-extrabold border-r border-purple-200 p-2">
                                  បំណិនផ្សេងៗ
                                </th>
                              )}

                              <th rowSpan={2} className="p-3 text-center w-20 border-r border-slate-200">
                                <span className="block font-bold">ពិន្ទុសរុប</span>
                                <span className="text-[10px] text-slate-400 font-normal">(៤០០)</span>
                              </th>
                              <th rowSpan={2} className="p-3 text-center w-20 font-extrabold text-purple-950 border-r border-slate-200 bg-purple-50/30">
                                <span className="block font-bold">មធ្យមភាគ</span>
                                <span className="text-[10px] text-purple-600 font-normal">(១០០)</span>
                              </th>
                              <th rowSpan={2} className="p-3 text-center w-24 border-r border-slate-200">ចំណាត់ថ្នាក់</th>
                              <th rowSpan={2} className="p-3 text-center w-24 border-r border-slate-200">និទ្ទេស</th>
                              <th rowSpan={2} className="p-3 text-center w-20">លទ្ធផល</th>
                            </tr>
                            <tr className="bg-slate-50 text-[10px] border-b border-slate-200">
                              {/* Khmer Sub-headers */}
                              {khmerSubs.map(subId => {
                                const def = allDefs.find(s => s.id === subId);
                                return (
                                  <th key={subId} className="p-2 text-center w-24 bg-indigo-50/30 border-r border-indigo-100 font-semibold text-indigo-900">
                                    {def?.name || subId}
                                  </th>
                                );
                              })}

                              {/* Math Sub-headers */}
                              {mathSubs.map(subId => {
                                const def = allDefs.find(s => s.id === subId);
                                return (
                                  <th key={subId} className="p-2 text-center w-24 bg-blue-50/30 border-r border-blue-100 font-semibold text-blue-900">
                                    {def?.name || subId}
                                  </th>
                                );
                              })}

                              {/* Science Sub-headers */}
                              {scienceSubs.map(subId => {
                                const def = allDefs.find(s => s.id === subId);
                                return (
                                  <th key={subId} className="p-2 text-center w-24 bg-emerald-50/30 border-r border-emerald-100 font-semibold text-emerald-900">
                                    {def?.name || subId}
                                  </th>
                                );
                              })}

                              {/* Social Sub-headers */}
                              {socialSubs.map(subId => {
                                const def = allDefs.find(s => s.id === subId);
                                return (
                                  <th key={subId} className="p-2 text-center w-24 bg-amber-50/30 border-r border-amber-100 font-semibold text-amber-900">
                                    {def?.name || subId}
                                  </th>
                                );
                              })}

                              {/* Other Sub-headers */}
                              {otherSubs.map(subId => {
                                const def = allDefs.find(s => s.id === subId);
                                return (
                                  <th key={subId} className="p-2 text-center w-24 bg-purple-50/30 border-r border-purple-100 font-semibold text-purple-900">
                                    {def?.name || subId}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {singlePeriodSummary.students
                              .filter((item) => filterStudent(item.student, item.classification.letter))
                              .map((item, idx) => {
                                const s = item.student;
                                const g = item.grade;
                                const isFemale = s.gender === 'ស្រី';

                                const filledSubs = currentPeriodSubSubjects.filter(subId => {
                                  const v = subScoresState[selectedGradePeriod]?.[s.id]?.[subId] !== undefined 
                                    ? subScoresState[selectedGradePeriod][s.id][subId] 
                                    : (g.subScores?.[subId] !== undefined ? g.subScores[subId] : 0);
                                  return Number(v) > 0;
                                });
                                const isAllSubsFilled = currentPeriodSubSubjects.length > 0 && filledSubs.length === currentPeriodSubSubjects.length;
                                const isPartiallyFilled = filledSubs.length > 0 && filledSubs.length < currentPeriodSubSubjects.length;

                                return (
                                  <tr key={s.id} className="hover:bg-purple-50/40 transition">
                                    <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-100">{idx + 1}</td>
                                    <td className="p-3 text-center font-mono font-bold text-slate-600 border-r border-slate-100">{s.civilId || s.rollNo}</td>
                                    <td className="p-3 font-bold text-slate-900 text-sm border-r border-slate-100">
                                      <div className="flex items-center justify-between gap-1.5">
                                        <span className={isFemale ? 'text-pink-900 font-extrabold' : 'text-slate-900 font-extrabold'}>
                                          {s.name}
                                        </span>
                                        {isAllSubsFilled ? (
                                          <span
                                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs shrink-0"
                                            title={`បានបំពេញពិន្ទុគ្រប់ ${currentPeriodSubSubjects.length} មុខវិជ្ជារងរួចរាល់ (Complete)`}
                                          >
                                            <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                            <span>ពេញ</span>
                                          </span>
                                        ) : isPartiallyFilled ? (
                                          <span
                                            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0"
                                            title={`បានបំពេញ ${filledSubs.length}/${currentPeriodSubSubjects.length} មុខវិជ្ជារង`}
                                          >
                                            {filledSubs.length}/{currentPeriodSubSubjects.length}
                                          </span>
                                        ) : null}
                                      </div>
                                    </td>
                                    <td className="p-3 text-center font-bold border-r border-slate-100">
                                      <span className={isFemale ? 'text-pink-600' : 'text-blue-600'}>{s.gender}</span>
                                    </td>

                                    {/* Khmer Subs */}
                                    {khmerSubs.map(subId => renderSubCell(s.id, subId))}

                                    {/* Math Subs */}
                                    {mathSubs.map(subId => renderSubCell(s.id, subId))}

                                    {/* Science Subs */}
                                    {scienceSubs.map(subId => renderSubCell(s.id, subId))}

                                    {/* Social Subs */}
                                    {socialSubs.map(subId => renderSubCell(s.id, subId))}

                                    {/* Other Subs */}
                                    {otherSubs.map(subId => renderSubCell(s.id, subId))}

                                    <td className="p-3 text-center font-extrabold text-slate-800 border-l border-slate-200">{item.total}</td>
                                    <td className="p-3 text-center font-black text-purple-950 text-sm bg-purple-50/50 border-l border-slate-200">
                                      {item.average}
                                    </td>
                                    <td className="p-3 text-center border-l border-slate-200">
                                      <span
                                        className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg font-black text-xs ${
                                          item.rank === 1
                                            ? 'bg-amber-400 text-purple-950 shadow-xs'
                                            : item.rank === 2
                                            ? 'bg-slate-200 text-slate-800'
                                            : item.rank === 3
                                            ? 'bg-amber-700 text-white'
                                            : 'bg-slate-100 text-slate-700'
                                        }`}
                                      >
                                        {item.rank === 1 ? '🥇 លេខ ១' : item.rank === 2 ? '🥈 លេខ ២' : item.rank === 3 ? '🥉 លេខ ៣' : `លេខ ${item.rank}`}
                                      </span>
                                    </td>
                                    <td className="p-3 text-center border-l border-slate-200">
                                      <span
                                        className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                                          item.classification.letter === 'A'
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            : item.classification.letter === 'B'
                                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                            : item.classification.letter === 'C'
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                            : item.classification.letter === 'D'
                                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                                        }`}
                                      >
                                        និទ្ទេស {item.classification.letter}
                                      </span>
                                    </td>
                                    <td className="p-3 text-center border-l border-slate-200 font-bold">
                                      <span className={item.passed ? 'text-emerald-700' : 'text-rose-600'}>
                                        {item.passed ? 'ជាប់' : 'ធ្លាក់'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>

                       {/* Student Analytics & Performance Summary Section (សង្ខេបនិន្នន័យ និងវិភាគលើការសិក្សារបស់សិស្ស) */}
                       <StudentAnalyticsSection
                         students={students}
                         grades={grades}
                         selectedGradePeriod={selectedGradePeriod}
                         gradeThresholds={gradeThresholds}
                         activeSubSubjects={currentPeriodSubSubjects}
                         allDefs={allDefs}
                         subScoresState={subScoresState}
                         selectedS1Months={selectedS1Months}
                         selectedS2Months={selectedS2Months}
                         periodSubSubjectsMap={periodSubSubjectsMap}
                         onSelectPeriod={(periodKey) => setSelectedGradePeriod(periodKey)}
                       />
                      </>
                    );
                  })()}

                  {isSemester1Summary && (
                    <div className="mb-4 bg-indigo-50/80 border border-indigo-200 p-3 rounded-2xl text-xs text-indigo-950 flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-extrabold">
                        តារាងបូកសរុបប្រចាំឆមាសទី១៖ បូកបញ្ចូលពិន្ទុមធ្យមភាគប្រចាំខែ និងពិន្ទុប្រឡងឆមាសទី១ សម្រាប់គណនាមធ្យមភាគឆមាសទី១។
                      </span>
                    </div>
                  )}

                  {/* VIEW 2: Semester 1 Summary Comparison Table */}
                  {/* Semester 1 Month Selector */}
                  {isSemester1Summary && s1SummaryData && (
                    <div className="mb-4 bg-purple-50/80 border border-purple-200 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-purple-950">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span>ខែសម្រាប់បូកសរុបប្រចាំឆមាសទី១ ({selectedS1Months.length} ខែ)៖</span>
                        {ALL_ENTRY_MONTHS.filter(m => selectedS1Months.includes(m.key)).map(mp => {
                          const isSelected = selectedS1Months.includes(mp.key);
                          return (
                            <label key={mp.key} className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-purple-200 cursor-pointer shadow-2xs hover:bg-purple-100">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedS1Months([...selectedS1Months, mp.key]);
                                  else setSelectedS1Months(selectedS1Months.filter(k => k !== mp.key));
                                }}
                                className="rounded border-purple-300 text-purple-900 focus:ring-purple-600"
                              />
                              <span>{mp.shortLabel}</span>
                            </label>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setIsSemesterMonthModalOpen(true)}
                        className="text-xs text-purple-700 hover:text-purple-900 font-bold underline flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>កំណត់ខែឆមាសទី១</span>
                      </button>
                    </div>
                  )}

                  {isSemester1Summary && s1SummaryData && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50/80 font-bold border-b border-slate-200 text-slate-800 text-[11px]">
                          <tr>
                            <th className="p-3.5 text-center w-12">ល.រ</th>
                            <th className="p-3.5 min-w-[130px]">គោត្តនាម-នាម</th>
                            <th className="p-3.5 text-center w-14">ភេទ</th>
                            {ALL_ENTRY_MONTHS.filter(m => selectedS1Months.includes(m.key)).map(mp => {
                              const isIncluded = selectedS1Months.includes(mp.key);
                              return (
                                <th
                                  key={mp.key}
                                  onClick={() => setSelectedGradePeriod(mp.key)}
                                  className={`p-3.5 text-center w-20 cursor-pointer transition ${isIncluded ? 'hover:bg-purple-100 bg-purple-50/30' : 'opacity-60 hover:bg-slate-100'}`}
                                  title={`ចុចដើម្បីកែប្រែពិន្ទុ ${mp.label}`}
                                >
                                  <span className="block font-bold text-purple-900">{mp.shortLabel} ↗</span>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    {isIncluded ? 'មធ្យមភាគ' : 'មិនគិត'}
                                  </span>
                                </th>
                              );
                            })}
                            <th className="p-3.5 text-center w-24 bg-slate-100/70 font-black text-slate-800">
                              <span className="block">ម.ភាគប្រចាំខែ</span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                (បូក {selectedS1Months.length} ខែ ÷ {selectedS1Months.length || 1})
                              </span>
                            </th>
                            <th
                              onClick={() => setSelectedGradePeriod('s1_exam')}
                              className="p-3.5 text-center w-24 bg-amber-50 cursor-pointer hover:bg-amber-100 transition"
                              title="ចុចដើម្បីកែប្រែពិន្ទុប្រឡងឆមាសទី១"
                            >
                              <span className="block font-bold text-amber-900">ប្រឡងឆមាសទី១ ↗</span>
                              <span className="text-[10px] text-amber-700 font-normal">មធ្យមភាគ</span>
                            </th>
                            <th className="p-3.5 text-center w-28 bg-purple-100 font-black text-purple-950 text-xs">
                              <span className="block">មធ្យមភាគ ឆមាសទី១</span>
                              <span className="text-[10px] text-purple-700 font-normal">(ខែ + ប្រឡង) ÷ ២</span>
                            </th>
                            <th className="p-3.5 text-center w-24">ចំណាត់ថ្នាក់</th>
                            <th className="p-3.5 text-center w-24">និទ្ទេស</th>
                            <th className="p-3.5 text-center w-20">លទ្ធផល</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {s1SummaryData.students
                            .filter((item) => filterStudent(item.student, item.classification.letter))
                            .map((item, idx) => {
                              const s = item.student;
                              const isFemale = s.gender === 'ស្រី';

                              return (
                                <tr key={s.id} className="hover:bg-purple-50/40 transition">
                                  <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                                  <td className="p-3 font-bold text-slate-900 text-sm">
                                    <span className={isFemale ? 'text-pink-900 font-extrabold' : 'text-slate-900 font-extrabold'}>
                                      {s.name}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center font-bold">
                                    <span className={isFemale ? 'text-pink-600' : 'text-blue-600'}>{s.gender}</span>
                                  </td>
                                  {ALL_ENTRY_MONTHS.filter(m => selectedS1Months.includes(m.key)).map(mp => (
                                    <td key={mp.key} className="p-3 text-center font-bold text-slate-700">
                                      {item.monthlyAverages[mp.key] !== undefined ? item.monthlyAverages[mp.key] : '0.00'}
                                    </td>
                                  ))}
                                  <td className="p-3 text-center font-black text-slate-800 bg-slate-50">
                                    {item.monthlyOverallAverage}
                                  </td>
                                  <td className="p-3 text-center font-black text-amber-900 bg-amber-50/60">
                                    {item.examAverage}
                                  </td>
                                  <td className="p-3 text-center font-black text-purple-950 text-sm bg-purple-50">
                                    {item.semesterAverage}
                                  </td>
                                  <td className="p-3 text-center">
                                    <span
                                      className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg font-black text-xs ${
                                        item.rank === 1
                                          ? 'bg-amber-400 text-purple-950 shadow-xs'
                                          : item.rank === 2
                                          ? 'bg-slate-200 text-slate-800'
                                          : item.rank === 3
                                          ? 'bg-amber-700 text-white'
                                          : 'bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {item.rank === 1 ? '🥇 លេខ ១' : item.rank === 2 ? '🥈 លេខ ២' : item.rank === 3 ? '🥉 លេខ ៣' : `លេខ ${item.rank}`}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <span
                                      className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                                        item.classification.letter === 'A'
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                          : item.classification.letter === 'B'
                                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                          : item.classification.letter === 'C'
                                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                          : item.classification.letter === 'D'
                                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                                      }`}
                                    >
                                      {item.classification.letter} ({item.classification.label})
                                    </span>
                                  </td>
                                  <td className="p-3 text-center font-extrabold">
                                    {item.passed ? (
                                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                                        ជាប់
                                      </span>
                                    ) : (
                                      <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                                        ធ្លាក់
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* VIEW 3: Semester 2 Summary Comparison Table */}
                  {/* Semester 2 Month Selector */}
                  {isSemester2Summary && s2SummaryData && (
                    <div className="mb-4 bg-purple-50/80 border border-purple-200 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-purple-950">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span>ខែសម្រាប់បូកសរុបប្រចាំឆមាសទី២ ({selectedS2Months.length} ខែ)៖</span>
                        {ALL_ENTRY_MONTHS.filter(m => selectedS2Months.includes(m.key)).map(mp => {
                          const isSelected = selectedS2Months.includes(mp.key);
                          return (
                            <label key={mp.key} className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-purple-200 cursor-pointer shadow-2xs hover:bg-purple-100">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedS2Months([...selectedS2Months, mp.key]);
                                  else setSelectedS2Months(selectedS2Months.filter(k => k !== mp.key));
                                }}
                                className="rounded border-purple-300 text-purple-900 focus:ring-purple-600"
                              />
                              <span>{mp.shortLabel}</span>
                            </label>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setIsSemesterMonthModalOpen(true)}
                        className="text-xs text-purple-700 hover:text-purple-900 font-bold underline flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>កំណត់ខែឆមាសទី២</span>
                      </button>
                    </div>
                  )}

                  {isSemester2Summary && s2SummaryData && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50/80 font-bold border-b border-slate-200 text-slate-800 text-[11px]">
                          <tr>
                            <th className="p-3.5 text-center w-12">ល.រ</th>
                            <th className="p-3.5 min-w-[130px]">គោត្តនាម-នាម</th>
                            <th className="p-3.5 text-center w-14">ភេទ</th>
                            {ALL_ENTRY_MONTHS.filter(m => selectedS2Months.includes(m.key)).map(mp => {
                              const isIncluded = selectedS2Months.includes(mp.key);
                              return (
                                <th
                                  key={mp.key}
                                  onClick={() => setSelectedGradePeriod(mp.key)}
                                  className={`p-3.5 text-center w-16 cursor-pointer transition ${isIncluded ? 'hover:bg-purple-100 bg-purple-50/30' : 'opacity-60 hover:bg-slate-100'}`}
                                  title={`ចុចដើម្បីកែប្រែពិន្ទុ ${mp.label}`}
                                >
                                  <span className="block font-bold text-purple-900">{mp.shortLabel} ↗</span>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    {isIncluded ? 'មធ្យមភាគ' : 'មិនគិត'}
                                  </span>
                                </th>
                              );
                            })}
                            <th className="p-3.5 text-center w-24 bg-slate-100/70 font-black text-slate-800">
                              <span className="block">ម.ភាគប្រចាំខែ</span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                (បូក {selectedS2Months.length} ខែ ÷ {selectedS2Months.length || 1})
                              </span>
                            </th>
                            <th
                              onClick={() => setSelectedGradePeriod('s2_exam')}
                              className="p-3.5 text-center w-24 bg-amber-50 cursor-pointer hover:bg-amber-100 transition"
                              title="ចុចដើម្បីកែប្រែពិន្ទុប្រឡងឆមាសទី២"
                            >
                              <span className="block font-bold text-amber-900">ប្រឡងឆមាសទី២ ↗</span>
                              <span className="text-[10px] text-amber-700 font-normal">មធ្យមភាគ</span>
                            </th>
                            <th className="p-3.5 text-center w-28 bg-purple-100 font-black text-purple-950 text-xs">
                              <span className="block">មធ្យមភាគ ឆមាសទី២</span>
                              <span className="text-[10px] text-purple-700 font-normal">(ខែ + ប្រឡង) ÷ ២</span>
                            </th>
                            <th className="p-3.5 text-center w-24">ចំណាត់ថ្នាក់</th>
                            <th className="p-3.5 text-center w-24">និទ្ទេស</th>
                            <th className="p-3.5 text-center w-20">លទ្ធផល</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {s2SummaryData.students
                            .filter((item) => filterStudent(item.student, item.classification.letter))
                            .map((item, idx) => {
                              const s = item.student;
                              const isFemale = s.gender === 'ស្រី';

                              return (
                                <tr key={s.id} className="hover:bg-purple-50/40 transition">
                                  <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                                  <td className="p-3 font-bold text-slate-900 text-sm">
                                    <span className={isFemale ? 'text-pink-900 font-extrabold' : 'text-slate-900 font-extrabold'}>
                                      {s.name}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center font-bold">
                                    <span className={isFemale ? 'text-pink-600' : 'text-blue-600'}>{s.gender}</span>
                                  </td>
                                  {ALL_ENTRY_MONTHS.filter(m => selectedS2Months.includes(m.key)).map(mp => (
                                    <td key={mp.key} className="p-3 text-center font-bold text-slate-700">
                                      {item.monthlyAverages[mp.key] !== undefined ? item.monthlyAverages[mp.key] : '0.00'}
                                    </td>
                                  ))}
                                  <td className="p-3 text-center font-black text-slate-800 bg-slate-50">
                                    {item.monthlyOverallAverage}
                                  </td>
                                  <td className="p-3 text-center font-black text-amber-900 bg-amber-50/60">
                                    {item.examAverage}
                                  </td>
                                  <td className="p-3 text-center font-black text-purple-950 text-sm bg-purple-50">
                                    {item.semesterAverage}
                                  </td>
                                  <td className="p-3 text-center">
                                    <span
                                      className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg font-black text-xs ${
                                        item.rank === 1
                                          ? 'bg-amber-400 text-purple-950 shadow-xs'
                                          : item.rank === 2
                                          ? 'bg-slate-200 text-slate-800'
                                          : item.rank === 3
                                          ? 'bg-amber-700 text-white'
                                          : 'bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {item.rank === 1 ? '🥇 លេខ ១' : item.rank === 2 ? '🥈 លេខ ២' : item.rank === 3 ? '🥉 លេខ ៣' : `លេខ ${item.rank}`}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <span
                                      className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                                        item.classification.letter === 'A'
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                          : item.classification.letter === 'B'
                                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                          : item.classification.letter === 'C'
                                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                          : item.classification.letter === 'D'
                                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                                      }`}
                                    >
                                      {item.classification.letter} ({item.classification.label})
                                    </span>
                                  </td>
                                  <td className="p-3 text-center font-extrabold">
                                    {item.passed ? (
                                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                                        ជាប់
                                      </span>
                                    ) : (
                                      <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                                        ធ្លាក់
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* VIEW 4: Annual Master Summary Table (បូកសរុបប្រចាំឆ្នាំ) */}
                  {/* Annual Summary Month Selection & Info */}
                  {isAnnualSummary && (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* S1 Months for Annual */}
                      <div className="bg-purple-50/80 border border-purple-200 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-purple-950 text-xs block">ខែសម្រាប់បូកសរុបប្រចាំឆមាសទី១ ({selectedS1Months.length} ខែ)៖</span>
                          <button
                            onClick={() => setIsSemesterMonthModalOpen(true)}
                            className="text-[11px] text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
                          >
                            ⚙️ កំណត់ខែ
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ALL_ENTRY_MONTHS.filter(m => selectedS1Months.includes(m.key)).map(mp => {
                            const isSelected = selectedS1Months.includes(mp.key);
                            return (
                              <label key={mp.key} className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-purple-200 cursor-pointer shadow-2xs text-xs font-bold text-purple-900 hover:bg-purple-100">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedS1Months([...selectedS1Months, mp.key]);
                                    else setSelectedS1Months(selectedS1Months.filter(k => k !== mp.key));
                                  }}
                                  className="rounded border-purple-300 text-purple-900 focus:ring-purple-600"
                                />
                                <span>{mp.shortLabel}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* S2 Months for Annual */}
                      <div className="bg-indigo-50/80 border border-indigo-200 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-indigo-950 text-xs block">ខែសម្រាប់បូកសរុបប្រចាំឆមាសទី២ ({selectedS2Months.length} ខែ)៖</span>
                          <button
                            onClick={() => setIsSemesterMonthModalOpen(true)}
                            className="text-[11px] text-indigo-700 hover:text-indigo-900 font-bold underline cursor-pointer"
                          >
                            ⚙️ កំណត់ខែ
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ALL_ENTRY_MONTHS.filter(m => selectedS2Months.includes(m.key)).map(mp => {
                            const isSelected = selectedS2Months.includes(mp.key);
                            return (
                              <label key={mp.key} className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-indigo-200 cursor-pointer shadow-2xs text-xs font-bold text-indigo-900 hover:bg-indigo-100">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedS2Months([...selectedS2Months, mp.key]);
                                    else setSelectedS2Months(selectedS2Months.filter(k => k !== mp.key));
                                  }}
                                  className="rounded border-indigo-300 text-indigo-900 focus:ring-indigo-600"
                                />
                                <span>{mp.shortLabel}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {isAnnualSummary && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-gradient-to-r from-purple-900 to-indigo-950 font-bold text-white text-[11px]">
                          <tr>
                            <th className="p-3.5 text-center w-12">ល.រ</th>
                            <th className="p-3.5 text-center w-24">អត្តលេខ</th>
                            <th className="p-3.5 min-w-[140px]">គោត្តនាម-នាម</th>
                            <th className="p-3.5 text-center w-14">ភេទ</th>
                            <th className="p-3.5 text-center w-28 bg-purple-800/60">
                              <span className="block font-extrabold">ម.ភាគ ឆមាសទី១</span>
                              <span className="text-[10px] text-purple-200 font-normal">(១០០)</span>
                            </th>
                            <th className="p-3.5 text-center w-28 bg-indigo-800/60">
                              <span className="block font-extrabold">ម.ភាគ ឆមាសទី២</span>
                              <span className="text-[10px] text-indigo-200 font-normal">(១០០)</span>
                            </th>
                            <th className="p-3.5 text-center w-32 bg-amber-400 text-purple-950 font-black text-xs">
                              <span className="block">មធ្យមភាគប្រចាំឆ្នាំ</span>
                              <span className="text-[10px] text-purple-900 font-bold">(ឆមាស១+ឆមាស២)÷២</span>
                            </th>
                            <th className="p-3.5 text-center w-28">ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ</th>
                            <th className="p-3.5 text-center w-24">និទ្ទេស</th>
                            <th className="p-3.5 text-center w-28">លទ្ធផលប្រចាំឆ្នាំ</th>
                            <th className="p-3.5 min-w-[150px] text-center">កិត្តិយស / ការសរសើរ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {annualSummaryData.students
                            .filter((item) => filterStudent(item.student, item.classification.letter))
                            .map((item, idx) => {
                              const s = item.student;
                              const isFemale = s.gender === 'ស្រី';

                              return (
                                <tr key={s.id} className="hover:bg-amber-50/40 transition">
                                  <td className="p-3.5 text-center font-bold text-slate-500">{idx + 1}</td>
                                  <td className="p-3.5 text-center font-mono font-bold text-slate-600">{s.civilId || s.rollNo}</td>
                                  <td className="p-3.5 font-bold text-slate-900 text-sm">
                                    <span className={isFemale ? 'text-pink-900 font-extrabold' : 'text-slate-900 font-extrabold'}>
                                      {s.name}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-center font-bold">
                                    <span className={isFemale ? 'text-pink-600' : 'text-blue-600'}>{s.gender}</span>
                                  </td>
                                  <td className="p-3.5 text-center font-extrabold text-slate-800 bg-purple-50/30">
                                    {item.semester1Average}
                                  </td>
                                  <td className="p-3.5 text-center font-extrabold text-slate-800 bg-indigo-50/30">
                                    {item.semester2Average}
                                  </td>
                                  <td className="p-3.5 text-center font-black text-purple-950 text-sm bg-amber-100/50">
                                    {item.annualAverage}
                                  </td>
                                  <td className="p-3.5 text-center">
                                    <span
                                      className={`inline-flex items-center justify-center min-w-[32px] h-7 px-2.5 rounded-xl font-black text-xs ${
                                        item.rank === 1
                                          ? 'bg-amber-400 text-purple-950 shadow-sm'
                                          : item.rank === 2
                                          ? 'bg-slate-300 text-slate-900'
                                          : item.rank === 3
                                          ? 'bg-amber-700 text-white'
                                          : 'bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {item.rank === 1 ? '🥇 លេខ ១' : item.rank === 2 ? '🥈 លេខ ២' : item.rank === 3 ? '🥉 លេខ ៣' : `លេខ ${item.rank}`}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-center">
                                    <span
                                      className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                                        item.classification.letter === 'A'
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                          : item.classification.letter === 'B'
                                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                          : item.classification.letter === 'C'
                                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                          : item.classification.letter === 'D'
                                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                                      }`}
                                    >
                                      {item.classification.letter} ({item.classification.label})
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-center font-extrabold">
                                    {item.passed ? (
                                      <span className="text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 text-xs font-black">
                                        ✨ ឡើងថ្នាក់
                                      </span>
                                    ) : (
                                      <span className="text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 text-xs font-black">
                                        ⚠️ ត្រួតថ្នាក់
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3.5 text-center">
                                    {item.rank === 1 ? (
                                      <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg font-black text-xs flex items-center justify-center gap-1">
                                        🏆 សិស្សឆ្នើមប្រចាំឆ្នាំ
                                      </span>
                                    ) : item.rank <= 3 ? (
                                      <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-lg font-bold text-xs">
                                        🎖️ សិស្សពូកែ
                                      </span>
                                    ) : item.classification.letter === 'A' ? (
                                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold text-xs">
                                        ⭐ ល្អប្រសើរ
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 text-xs">-</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 1.3.1 MoEYS Honor Roll (តារាងកិត្តិយសប្រចាំខែ ឆមាស និងប្រចាំឆ្នាំ) */}
          {subSec1 === 'honor_roll' && (
            <HonorRollManager
              teacher={teacher}
              students={students}
              grades={grades}
              currentYear={activeAcademicYearValue}
              onShowToast={onShowToast}
            />
          )}

          {/* 1.4 Student Monitoring Logbook (សៀវភៅតាមដានការសិក្សា និងអត្តចរិតសិស្ស) */}
          {subSec1 === 'monitoring' && (
            <StudentMonitoringLogbook
              teacher={teacher}
              students={students}
              currentYear={activeAcademicYearValue}
              attendance={attendance}
              grades={grades}
              activeSubSubjects={activeSubSubjects}
              subScoresState={subScoresState}
              gradeThresholds={gradeThresholds}
              selectedS1Months={selectedS1Months}
              selectedS2Months={selectedS2Months}
              periodSubSubjectsMap={periodSubSubjectsMap}
              onUpdatePeriodSubSubjects={handleSavePeriodSubSubjects}
              onUpdateSubScores={(newScores) => {
                setSubScoresState(newScores);
                saveYearScopedData(activeAcademicYearValue, 'sub_scores', newScores);
                try {
                  localStorage.setItem('school_sub_scores_db', JSON.stringify(newScores));
                } catch {}
              }}
              onUpdateActiveSubSubjects={(newActive) => {
                setActiveSubSubjects(newActive);
                saveYearScopedData(activeAcademicYearValue, 'active_sub_subjects', newActive);
                try {
                  localStorage.setItem('school_active_sub_subjects', JSON.stringify(newActive));
                } catch {}
              }}
              onShowToast={onShowToast}
            />
          )}

          {/* 1.4.1 Thursday Work Report (របាយការណ៍បំពេញការងារថ្ងៃព្រហស្បតិ៍ MoEYS) */}
          {subSec1 === 'thursday_report' && (
            <div className="space-y-4">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 text-white p-6 rounded-[28px] shadow-lg border border-indigo-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-xs font-black text-amber-300">
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span>ទម្រង់ស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS Standard)</span>
                  </div>
                  <h3 className="font-black text-xl text-white">របាយការណ៍បំពេញការងារថ្ងៃព្រហស្បតិ៍</h3>
                  <p className="text-xs text-indigo-100/90 leading-relaxed max-w-2xl">
                    របាយការណ៍ការងារប្រចាំសប្តាហ៍ (ថ្ងៃព្រហស្បតិ៍) សម្រាប់កត់ត្រាសភាពការណ៍ទូទៅ អវត្តមានសិស្ស ខ្លឹមសារមេរៀនដែលបានបង្រៀន លទ្ធផលប្រចាំមុខវិជ្ជា និងសិស្សរៀនយឺត
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setIsThursdayReportModalOpen(true)}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-purple-950 font-black text-xs shadow-md transition flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <FileEdit className="w-4 h-4 text-purple-950" />
                    <span>បើកទម្រង់កែសម្រួល & បោះពុម្ព PDF</span>
                  </button>
                </div>
              </div>

              {/* 3 Summary Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1 */}
                <div className="bg-white p-5 rounded-[24px] border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
                      I
                    </div>
                    <h4>សភាពការណ៍ទូទៅ & វត្តមាន</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ស្រង់វត្តមានសិស្សសរុប ស្រី អវត្តមានមានច្បាប់ និងឥតច្បាប់ ព្រមទាំងការងារផ្សេងៗដែលបានបំពេញក្នុងសប្តាហ៍។
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 flex justify-between">
                    <span>សិស្សក្នុងបញ្ជី៖</span>
                    <strong className="text-blue-900">{students.length} នាក់ (ស្រី {students.filter(s => s.gender === 'ស្រី').length} នាក់)</strong>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-5 rounded-[24px] border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
                      II
                    </div>
                    <h4>ខ្លឹមសារមេរៀន & លទ្ធផល</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    កត់ត្រាមេរៀនដែលបានបង្រៀនលើមុខវិជ្ជាគោល (ភាសាខ្មែរ គណិតវិទ្យា...) និងកម្រិតយល់ដឹងរបស់សិស្សតាមកម្រិត។
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 flex justify-between">
                    <span>ទម្រង់គំរូ៖</span>
                    <strong className="text-indigo-900">មានគំរូមេរៀនស្រាប់</strong>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-5 rounded-[24px] border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xs">
                      III
                    </div>
                    <h4>សិស្សរៀនយឺត & ទិសដៅបន្ត</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    កំណត់អត្តសញ្ញាណសិស្សរៀនយឺត វិធានការជួយបន្ថែម និងទិសដៅការងារដែលត្រូវអនុវត្តនៅសប្តាហ៍បន្ទាប់។
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 flex justify-between">
                    <span>ការរក្សាទុក៖</span>
                    <strong className="text-amber-900">ស្វ័យប្រវត្តិតាមឆ្នាំសិក្សា</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Quick Launch Box */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 p-6 rounded-[28px] border border-slate-200/80 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center mx-auto shadow-xs">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">រួចរាល់ក្នុងការបំពេញរបាយការណ៍ថ្ងៃព្រហស្បតិ៍</h4>
                <p className="text-xs text-slate-600 max-w-xl mx-auto">
                  ចុចប៊ូតុងខាងក្រោមដើម្បីបើកផ្ទាំងទម្រង់ពេញលេញ ដែលអនុញ្ញាតឱ្យបញ្ចូលកាលបរិច្ឆេទ ស្រង់ស្ថិតិស្វ័យប្រវត្តិ កែសម្រួលខ្លឹមសារ និងបោះពុម្ពជាឯកសារ A4 ឬទាញយកជា PDF ផ្លូវការ។
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsThursdayReportModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs shadow-md transition inline-flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <BookOpenCheck className="w-4 h-4 text-amber-300" />
                    <span>បើកផ្ទាំងបំពេញរបាយការណ៍ (Open Full Form)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1.5 Student Trainee Record Book (សៀវភៅសិក្ខាគារិក) */}
          {subSec1 === 'trainees' && (
            <PracticumTraineesManager
              teacher={teacher}
              students={students}
              grades={grades}
              attendance={attendance}
              currentYear={activeAcademicYearValue}
              gradeThresholds={gradeThresholds}
              selectedS1Months={selectedS1Months}
              selectedS2Months={selectedS2Months}
              activeSubSubjects={activeSubSubjects}
              periodSubSubjectsMap={periodSubSubjectsMap}
              subScoresState={subScoresState}
              onShowToast={onShowToast}
            />
          )}

          {/* 1.6 Statistics & Student Categorization (Scholarship, Disability, Equity, PLP grouping) */}
          {subSec1 === 'stats' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">ស្ថិតិទូទៅ និងការចាត់ថ្នាក់កម្រិតសមត្ថភាពសិស្ស (PLP / PTOM)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">ទិន្នន័យស្រង់ពី WikiSchool និងលទ្ធផលតេស្តរោគវិនិច្ឆ័យ PLP</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-900 font-extrabold text-xs">
                      ថ្នាក់ {teacher.grade}
                    </span>
                    <button
                      onClick={() => setIsStatsPdfModalOpen(true)}
                      className="no-print bg-purple-900 hover:bg-purple-800 text-white px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-md shadow-purple-900/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      title="កំណត់ទម្រង់ ស្ទីល ហត្ថលេខា និងទាញយកជា PDF ស្ថិតិ & ចាត់ថ្នាក់សិស្ស A4 Landscape"
                    >
                      <FileText className="w-4 h-4 text-amber-300" />
                      <span>📄 កំណត់ទម្រង់ & ទាញយក PDF</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-[22px] border border-indigo-200/60 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-900 uppercase">ស្ថិតិរដ្ឋបាលសិស្ស</span>
                      <Users2 className="w-5 h-5 text-indigo-700" />
                    </div>
                    <div className="space-y-1.5 text-xs font-medium text-slate-700">
                      <div className="flex justify-between bg-white/80 p-2 rounded-xl">
                        <span>សិស្សអាហារូបករណ៍៖</span>
                        <strong className="text-indigo-900">៦ នាក់</strong>
                      </div>
                      <div className="flex justify-between bg-white/80 p-2 rounded-xl">
                        <span>សិស្សមានប័ណ្ណសមធម៌៖</span>
                        <strong className="text-indigo-900">៤ នាក់</strong>
                      </div>
                      <div className="flex justify-between bg-white/80 p-2 rounded-xl">
                        <span>សិស្សពិការភាពស្រាល៖</span>
                        <strong className="text-indigo-900">០ នាក់</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-[22px] border border-emerald-200/60 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-900 uppercase">កម្រិតសមត្ថភាព PLP</span>
                      <GraduationCap className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div className="space-y-1.5 text-xs font-medium text-slate-700">
                      <div className="flex justify-between bg-white/80 p-2 rounded-xl">
                        <span>សិស្សពូកែ (Advanced):</span>
                        <strong className="text-emerald-800">៨ នាក់</strong>
                      </div>
                      <div className="flex justify-between bg-white/80 p-2 rounded-xl">
                        <span>សិស្សមធ្យម (Medium):</span>
                        <strong className="text-emerald-800">១២ នាក់</strong>
                      </div>
                      <div className="flex justify-between bg-white/80 p-2 rounded-xl">
                        <span>សិស្សរៀនយឺត (Need Support):</span>
                        <strong className="text-rose-700">៤ នាក់</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-[22px] border border-amber-200/60 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-900 uppercase">ផែនការកែលម្អ (បបម / PTOM)</span>
                      <Award className="w-5 h-5 text-amber-700" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      រៀបចំកម្មវិធីបង្រៀនបន្ថែមម៉ោង (Remedial Teaching) សម្រាប់សិស្សរៀនយឺតចំនួន ៤នាក់ លើការផ្សំខ្យល់ និងដោះស្រាយលេខ។
                    </p>
                    <div className="pt-2 border-t border-amber-200/60 text-[11px] font-bold text-amber-900">
                      ស្ថានភាព៖ កំពុងអនុវត្តប្រចាំសប្តាហ៍
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1.7 MoEYS PRI Class Student Statistics Document */}
          {subSec1 === 'pri' && (
            <MoeysPriStatisticsManager
              teacher={teacher}
              currentYear={currentYear || activeAcademicYearValue}
              students={students}
              onUpdateStudent={onUpdateStudent}
              onShowToast={onShowToast}
            />
          )}

          {/* 1.5 Behavior & Discipline (WikiSchool Behavior Score) */}
          {subSec1 === 'behavior' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-[28px] border border-slate-200/80 shadow-xs">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-900" />
                    <span>ការតាមដានអាកប្បកិរិយា និងវិន័យ (WikiSchool Behavior Tracker)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    កត់ត្រាពិន្ទុវិន័យ ការចូលរួមសកម្មភាព និងការសរសើរឥរិយាបថវិជ្ជមានក្នុងថ្នាក់រៀន
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    វិន័យថ្នាក់៖ ល្អប្រសើរ (98%)
                  </span>
                  <button
                    onClick={() => setIsBehaviorPdfModalOpen(true)}
                    className="no-print bg-purple-900 hover:bg-purple-800 text-white px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-md shadow-purple-900/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    title="កំណត់ទម្រង់ ស្ទីល ហត្ថលេខា និងទាញយកជា PDF ការតាមដានវិន័យសិស្ស A4 Landscape"
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>📄 កំណត់ទម្រង់ & ទាញយក PDF</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {students.slice(0, 6).map((s) => (
                  <div key={s.id} className="bg-white p-4 rounded-[22px] border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{s.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">ID: ST-{100 + s.id}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                        ⭐ ពិន្ទុវិន័យ៖ 100/100
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                      <p>✨ <strong>ការសរសើរ៖</strong> ឧស្សាហ៍ព្យាយាមធ្វើកិច្ចការផ្ទះ និងគោរពពេលវេលាបានល្អ។</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1.6 PLP Portal & Self-Study */}
          {subSec1 === 'plp' && (
            <div className="space-y-4">
              {/* Dual Portals Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. PLP EdTech Self-Study Portal (kru.plpedtech.com) */}
                <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-purple-950 text-white p-6 rounded-[28px] shadow-lg flex flex-col justify-between gap-4 border border-indigo-400/30">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-xs font-extrabold text-amber-300">
                      <GraduationCap className="w-4 h-4 text-amber-300" />
                      <span>PLP EdTech Self-Study Portal</span>
                    </div>
                    <h3 className="font-extrabold text-lg text-white">ប្រព័ន្ធស្វ័យសិក្សា គ្រូបឋម (Student Dashboard)</h3>
                    <p className="text-xs text-indigo-100/90 leading-relaxed">
                      ចូលរៀនវគ្គសិក្សាស្វ័យសិក្សាតាមអ៊ីនធឺណិត ពិនិត្យវគ្គសិក្សាទាំងអស់ និងទាញយកវិញ្ញាបនបត្រ
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <a
                      href="https://kru.plpedtech.com/login?from=%2Fdashboard%2Fstudent"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-purple-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>ចូលវគ្គស្វ័យសិក្សា (គ្រូបឋម)</span>
                      <ExternalLink className="w-4 h-4 text-purple-950 shrink-0" />
                    </a>
                    <a
                      href="https://sala.moeys.gov.kh/kh"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>MOEYS CPD (sala.moeys.gov.kh)</span>
                      <ExternalLink className="w-4 h-4 text-slate-950 shrink-0" />
                    </a>
                    <a
                      href="https://sala.moeys.gov.kh/kh"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>សាលាឌីជីថល</span>
                      <ExternalLink className="w-4 h-4 text-slate-950 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* 2. PLP MoEYS Portal */}
                <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-[28px] shadow-lg flex flex-col justify-between gap-4 border border-emerald-500/30">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/30 text-xs font-extrabold text-emerald-300">
                      <Globe className="w-4 h-4 text-emerald-300" />
                      <span>MoEYS Primary Learning Program</span>
                    </div>
                    <h3 className="font-extrabold text-lg text-white">ប្រព័ន្ធ PLP ក្រសួងអប់រំ យុវជន និងកីឡា</h3>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      តំណភ្ជាប់ផ្លូវការទៅកាន់ប្រព័ន្ធគ្រប់គ្រង និងវាយតម្លៃអំណានថ្នាក់ដំបូង
                    </p>
                  </div>
                  <a
                    href="https://plp.moeys.gov.kh/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>បើកប្រព័ន្ធ PLP MoEYS</span>
                    <ExternalLink className="w-4 h-4 text-slate-950" />
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-[28px] border border-slate-200/80 p-4 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-3 border-slate-100 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-mono font-bold text-slate-500 ml-2">https://plp.moeys.gov.kh/</span>
                  </div>
                  <button
                    onClick={() => setIsPlpPdfModalOpen(true)}
                    className="no-print bg-purple-900 hover:bg-purple-800 text-white px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-md shadow-purple-900/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    title="កំណត់ទម្រង់ ស្ទីល ហត្ថលេខា និងទាញយកជា PDF របាយការណ៍ PLP MoEYS A4 Landscape"
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>📄 កំណត់ទម្រង់ & ទាញយក PDF</span>
                  </button>
                </div>
                <div className="w-full h-[540px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                  <iframe
                    src="https://plp.moeys.gov.kh/"
                    className="w-full h-full border-none"
                    title="PLP Portal"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 1.7 Student Book Borrowing Manager (រដ្ឋបាលផ្នែកទី១) */}
          {subSec1 === 'book_borrowing' && (
            <StudentBookBorrowingManager
              students={students}
              borrowings={bookBorrowings}
              libraryBooks={libraryBooks}
              onAddBorrowing={handleAddBorrowing}
              onUpdateBorrowing={handleUpdateBorrowing}
              onDeleteBorrowing={handleDeleteBorrowing}
              activeBannerTheme={activeBannerTheme}
            />
          )}
        </div>
      )}

      {/* ================= SECTION 2: PEDAGOGY & LESSON MANAGEMENT ================= */}
      {activeMainSec === 'sec2' && (
        <div className="space-y-4">
          <div className="no-print flex gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
            {[
              { id: 'timetable', label: 'កាលវិភាគបង្រៀន', icon: Calendar },
              { id: 'syllabus', label: 'កម្មវិធីប្រចាំឆ្នាំ/ត្រីមាស', icon: Layers },
              { id: 'lessonplan', label: 'កិច្ចតែងការបង្រៀន (Lesson Plan)', icon: BookOpenCheck },
              { id: 'slides', label: 'ស្លាយបង្រៀន', icon: Presentation },
              { id: 'assessment', label: 'កញ្ចប់ឯកសារវាយតម្លៃ (Rubrics)', icon: FileText },
            ].map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = subSec2 === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSubSec2(sub.id as any)}
                  className={`px-3.5 py-2.5 rounded-2xl shrink-0 transition flex items-center gap-2 ${
                    isSubActive
                      ? 'bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold'
                      : 'bg-gradient-to-r from-white to-purple-50/50 hover:bg-purple-50 text-slate-800 border border-purple-200/60 shadow-2xs font-semibold'
                  }`}
                >
                  <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* 2.1 Timetable */}
          {subSec2 === 'timetable' && (
            <TimetableDisplay grade={teacher.grade} onShowToast={onShowToast} />
          )}

          {/* 2.2 Annual & Term Syllabus Plan */}
          {subSec2 === 'syllabus' && (
            <SubjectSyllabusDisplay onShowToast={onShowToast} />
          )}

          {/* 2.3 Lesson Plan (Student-Centered, digital tools, games) */}
          {subSec2 === 'lessonplan' && (() => {
            const subjectDefinitions = [
              {
                id: 'ភាសាខ្មែរ',
                name: 'ភាសាខ្មែរ',
                shortName: 'ភាសាខ្មែរ',
                code: 'KHM',
                lessonCountText: '១០ មេរៀន + ខ្លឹមសាររង',
                totalLessons: 10,
                duration: '៤៥ នាទី',
                icon: BookOpen,
                gradient: 'from-purple-900 to-indigo-800',
                borderAccent: 'border-purple-300',
                lightBg: 'bg-purple-50/70',
                lightBorder: 'border-purple-200/80',
                textColor: 'text-purple-950',
                badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
                desc: 'អំណាន វេយ្យាករណ៍ សរសេរតាមអាន តែងសេចក្តី និងបំណិន',
                sampleTitle: 'គំរូកិច្ចតែងការបង្រៀនប្រចាំថ្ងៃ៖ មុខវិជ្ជាភាសាខ្មែរ',
                objective: 'សិស្សអាចអាន និងសរសេរពាក្យផ្សំខ្យល់ស្រៈ «ា» បានត្រឹមត្រូវ ៩០%។',
                materials: 'ប័ណ្ណអក្សរ, វីដេអូ PLP, កាតហ្គេមល្បែងស្វែងរកពាក្យ។',
                activities: 'កំដៅសរសៃប្រសាទ (៥នាទី) ➔ ណែនាំមេរៀនថ្មី (១០នាទី) ➔ សកម្មភាពក្រុមល្បែងសិក្សា (១៥នាទី) ➔ វាយតម្លៃ និងកិច្ចការផ្ទះ (១៥នាទី)។',
                features: ['Student-Centered', 'ប័ណ្ណ PLP', 'ល្បែងភាសា'],
              },
              {
                id: 'គណិតវិទ្យា',
                name: 'គណិតវិទ្យា',
                shortName: 'គណិតវិទ្យា',
                code: 'MATH',
                lessonCountText: '២០ មេរៀនពេញលេញ',
                totalLessons: 20,
                duration: '២ ម៉ោង (៩០ នាទី)',
                icon: Calculator,
                gradient: 'from-blue-900 to-indigo-800',
                borderAccent: 'border-blue-300',
                lightBg: 'bg-blue-50/70',
                lightBorder: 'border-blue-200/80',
                textColor: 'text-blue-950',
                badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
                desc: 'ចំនួនគត់ ប្រភាគ ទសភាគ ភាគរយ ធរណីមាត្រ ផ្ទៃក្រឡា និងមាឌ',
                sampleTitle: 'គំរូកិច្ចតែងការបង្រៀនប្រចាំថ្ងៃ៖ មុខវិជ្ជាគណិតវិទ្យា',
                objective: 'សិស្សអាចអាន សរសេរ និងបំបែកខ្ទង់ចំនួនគត់ធំជាង ១ ០០០ ០០០ បានត្រឹមត្រូវ ៩០%។',
                materials: 'បន្ទះប័ណ្ណលេខតាងខ្ទង់, ក្តារឈ្នួន, Projector បង្ហាញល្បែងប្រកួតប្រជែង។',
                activities: 'កម្តៅសាច់គណិតវិទ្យា (៥នាទី) ➔ ការពន្យល់តាងខ្ទង់ (១៥នាទី) ➔ ល្បែងផ្គុំលេខប្រកួតប្រជែងជាក្រុម (២០នាទី) ➔ សង្ខេប និងលំហាត់ផ្ទះ (១០នាទី)។',
                features: ['ដោះស្រាយបញ្ហា', 'គំរូជាក់ស្តែង', 'ល្បែងប្រកួត'],
              },
              {
                id: 'វិទ្យាសាស្ត្រ',
                name: 'វិទ្យាសាស្ត្រ',
                shortName: 'វិទ្យាសាស្ត្រ',
                code: 'SCI',
                lessonCountText: '១៧ មេរៀនពេញលេញ',
                totalLessons: 17,
                duration: '២ ម៉ោង (៩០ នាទី)',
                icon: FlaskConical,
                gradient: 'from-emerald-900 to-teal-800',
                borderAccent: 'border-emerald-300',
                lightBg: 'bg-emerald-50/70',
                lightBorder: 'border-emerald-200/80',
                textColor: 'text-emerald-950',
                badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                desc: 'ប្រព័ន្ធរាងកាយមនុស្ស រុក្ខជាតិ អគ្គិសនី មេដែក បរិស្ថាន និងលំហ',
                sampleTitle: 'គំរូកិច្ចតែងការបង្រៀនប្រចាំថ្ងៃ៖ មុខវិជ្ជាវិទ្យាសាស្ត្រ',
                objective: 'សិស្សអាចកំណត់អត្តសញ្ញាណ និងរៀបរាប់ពីប្រព័ន្ធដង្ហើម និងការថែរក្សាសួតបានច្បាស់លាស់។',
                materials: 'គំរូរូបភាពសួតសិប្បនិម្មិត, វីដេអូពិសោធន៍ឌីជីថល, សន្លឹកកិច្ចការក្រុម។',
                activities: 'សំណួរបំផុសគំនិត (៥នាទី) ➔ សង្កេតគំរូបំប្លែងដង្ហើម (១៥នាទី) ➔ ពិសោធន៍ជាក្រុម (២០នាទី) ➔ សន្និដ្ឋានមេរៀន (១០នាទី)។',
                features: ['ពិសោធន៍ផ្ទាល់', 'ការសង្កេត', 'ឌីជីថល STEM'],
              },
              {
                id: 'សិក្សាសង្គម',
                name: 'សិក្សាសង្គម',
                shortName: 'សិក្សាសង្គម',
                code: 'SOC',
                lessonCountText: '១៥ មេរៀនពេញលេញ',
                totalLessons: 15,
                duration: '២ ម៉ោង (៩០ នាទី)',
                icon: Landmark,
                gradient: 'from-amber-900 to-orange-800',
                borderAccent: 'border-amber-300',
                lightBg: 'bg-amber-50/70',
                lightBorder: 'border-amber-200/80',
                textColor: 'text-amber-950',
                badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
                desc: 'ប្រវត្តិសាស្ត្រខ្មែរ ភូមិសាស្ត្រ សីលធម៌-ពលរដ្ឋវិជ្ជា និងសិល្បៈវប្បធម៌',
                sampleTitle: 'គំរូកិច្ចតែងការបង្រៀនប្រចាំថ្ងៃ៖ មុខវិជ្ជាសិក្សាសង្គម',
                objective: 'សិស្សយល់ដឹងពីប្រវត្តិសាស្ត្រ និងសម្បត្តិវប្បធម៌ប្រាសាទអង្គរវត្ត និងចេះថែរក្សាការពារ។',
                materials: 'ផែនទីភូមិសាស្ត្រ, រូបភាពប្រាសាទ 3D Virtual Tour, ប័ណ្ណសំណួរ Quiz។',
                activities: 'បង្ហាញរូបភាពនិងសំណួរទាក់ទាញ (៥នាទី) ➔ ការរុករកទិន្នន័យ (១៥នាទី) ➔ ធ្វើបទបង្ហាញក្រុម (១៥នាទី) ➔ សន្និដ្ឋាន (១០នាទី)។',
                features: ['ផែនទី 3D', 'រុករកប្រវត្តិសាស្ត្រ', 'ការជជែកដេញដោល'],
              },
              {
                id: 'អប់រំសុខភាព',
                name: 'អប់រំសុខភាព',
                shortName: 'អប់រំសុខភាព',
                code: 'HLT',
                lessonCountText: '១៨ មេរៀនពេញលេញ',
                totalLessons: 18,
                duration: '២ ម៉ោង (៩០ នាទី)',
                icon: Activity,
                gradient: 'from-rose-900 to-pink-800',
                borderAccent: 'border-rose-300',
                lightBg: 'bg-rose-50/70',
                lightBorder: 'border-rose-200/80',
                textColor: 'text-rose-950',
                badgeBg: 'bg-rose-100 text-rose-900 border-rose-200',
                desc: 'អនាម័យ ៣ ស្អាត សុខភាពផ្លូវចិត្ត អាហារូបត្ថម្ភ បឋមព្យាបាល និងសុវត្ថិភាព',
                sampleTitle: 'គំរូកិច្ចតែងការបង្រៀនប្រចាំថ្ងៃ៖ មុខវិជ្ជាអប់រំសុខភាព',
                objective: 'សិស្សអាចអនុវត្តក្បួនអនាម័យ ៣ ស្អាត និងការថែរក្សាធ្មេញ និងរាងកាយបានត្រឹមត្រូវ។',
                materials: 'គំរូធ្មេញនិងច្រាសដុសធ្មេញ, ផ្ទាំងរូបភាពសុខភាព, បទចម្រៀងអនាម័យ។',
                activities: 'ច្រៀងចម្រៀងអនាម័យ (៥នាទី) ➔ សម្តែងការដុសធ្មេញ (១៥នាទី) ➔ អនុវត្តជាក់ស្តែងជាដៃគូ (១៥នាទី) ➔ វាយតម្លៃទម្លាប់ (១០នាទី)។',
                features: ['អនុវត្តជាក់ស្តែង', 'ទម្លាប់ល្អ', 'ចម្រៀងអនាម័យ'],
              },
              {
                id: 'ភាសាអង់គ្លេស និងបំណិនជីវិត',
                name: 'ភាសាអង់គ្លេស និងបំណិនជីវិត',
                shortName: 'អង់គ្លេស & បំណិន',
                code: 'ENG',
                lessonCountText: '៣៦ មេរៀនពេញលេញ',
                totalLessons: 36,
                duration: '៤៥ នាទី',
                icon: Languages,
                gradient: 'from-indigo-900 to-sky-800',
                borderAccent: 'border-indigo-300',
                lightBg: 'bg-indigo-50/70',
                lightBorder: 'border-indigo-200/80',
                textColor: 'text-indigo-950',
                badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200',
                desc: 'English for Primary + បំណិនជីវិតឌីជីថល ការទំនាក់ទំនង និងសហគ្រិនភាព',
                sampleTitle: 'គំរូកិច្ចតែងការបង្រៀនប្រចាំថ្ងៃ៖ មុខវិជ្ជាភាសាអង់គ្លេស',
                objective: 'សិស្សអាចសន្ទនាស្វាគមន៍ Greetings & Self-introduction និងដោះស្រាយបញ្ហាសាមញ្ញក្នុងថ្នាក់។',
                materials: 'Flashcards, Audio Dialogue, Roleplay props & worksheets។',
                activities: 'Warm-up Song (៥នាទី) ➔ Presentation & Vocabulary (១៥នាទី) ➔ Pair Roleplay Games (១៥នាទី) ➔ Wrap-up (១០នាទី)។',
                features: ['Interactive Audio', 'Roleplay Games', 'Digital Skills'],
              }
            ];

            const currentSubjectDef = subjectDefinitions.find(s => s.id === activeLessonSubject) || subjectDefinitions[0];
            const subjectLessons = khmerLessonPlansList.filter(l => l.subject === activeLessonSubject);
            const filteredSubjectLessons = lessonPlanSearch.trim()
              ? subjectLessons.filter(l => l.title.toLowerCase().includes(lessonPlanSearch.toLowerCase()) || l.lessonNo.toLowerCase().includes(lessonPlanSearch.toLowerCase()))
              : subjectLessons;

            const handleOpenModalForSubject = (subjId: string, lessonId?: string) => {
              setModalTargetSubject(subjId);
              setModalTargetLessonId(lessonId);
              setIsKhmerModalOpen(true);
            };

            return (
              <div className="space-y-6">
                {/* 1. Header & Quick Action Button */}
                <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/80 shadow-xs">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-5 border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 font-extrabold text-[11px] uppercase tracking-wider">
                          ស្តង់ដារក្រសួង MoEYS
                        </span>
                        <span className="text-xs text-slate-400 font-bold">•</span>
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> សកម្មភាពសិស្សមជ្ឈមណ្ឌល
                        </span>
                      </div>
                      <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mt-1.5 flex items-center gap-2">
                        <BookOpenCheck className="w-6 h-6 text-purple-900 shrink-0" />
                        <span>កិច្ចតែងការបង្រៀន (Lesson Plan - Student-Centered)</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                        វិធីសាស្ត្របង្រៀនសកម្ម រួមបញ្ចូលឧបករណ៍ឌីជីថល ល្បែងសិក្សា និងសកម្មភាពពង្រឹងសមត្ថភាព
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenModalForSubject('ទាំងអស់')}
                      className="px-5 py-3 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 hover:from-purple-800 hover:to-indigo-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-purple-900/30 transition flex items-center gap-2.5 active:scale-95 shrink-0"
                    >
                      <BookOpenCheck className="w-4 h-4 text-amber-300" />
                      <span>បើកមើលកិច្ចតែងការពេញលេញ (គ្រប់មេរៀន)</span>
                    </button>
                  </div>

                  {/* 2. Management and Export Toolbar */}
                  <div className="mt-5 bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 shrink-0">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="font-extrabold text-xs sm:text-sm text-amber-300">
                          ឧបករណ៍គ្រប់គ្រង និងនាំចេញកិច្ចតែងការបង្រៀន៖
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1. Edit Timetable Button */}
                        <button
                          type="button"
                          onClick={() => setSubSec2('timetable')}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 border border-indigo-400/30"
                          title="ទៅកាន់តារាងកាលវិភាគបង្រៀន"
                        >
                          <span>✏️ កែសម្រួលកាលវិភាគ</span>
                        </button>

                        {/* 2. Download / Edit PDF Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenModalForSubject(activeLessonSubject)}
                          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 border border-rose-400/30"
                          title="ទាញយក ឬកែសម្រួលទម្រង់ PDF កិច្ចតែងការ"
                        >
                          <span>ទាញយក / កែសម្រួល PDF</span>
                        </button>

                        {/* 3. Download Word (.doc) Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenModalForSubject(activeLessonSubject)}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 border border-blue-400/30"
                          title="ទាញយកឯកសារ Word (.doc) តាមស្តង់ដារ"
                        >
                          <span>ទាញយក Word (.doc)</span>
                        </button>

                        {/* 4. Print Word Standard Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenModalForSubject(activeLessonSubject)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 border border-emerald-400/30"
                          title="បោះពុម្ពទម្រង់កិច្ចតែងការបង្រៀន"
                        >
                          <span>បោះពុម្ពស្តង់ដារ Word</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Subject Categorization Grid (ផ្ទាំងបែងចែកកិច្ចតែងការបង្រៀនតាមមុខវិជ្ជា) */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-900" />
                        <span>ផ្ទាំងបែងចែកកិច្ចតែងការបង្រៀនតាមមុខវិជ្ជា (Subject Modules)</span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        ជ្រើសរើសមុខវិជ្ជាដើម្បីពិនិត្យគំរូកិច្ចតែងការ និងមេរៀននីមួយៗ
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs self-start sm:self-auto">
                      សរុប៖ ៦ មុខវិជ្ជា • ១១៦+ កិច្ចតែងការ
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {subjectDefinitions.map((s) => {
                      const Icon = s.icon;
                      const isSelected = activeLessonSubject === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setActiveLessonSubject(s.id)}
                          className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-400/30'
                              : 'bg-white border-slate-200/80 hover:border-purple-300 hover:shadow-xs'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                              <div className="absolute transform rotate-45 bg-purple-900 text-white text-[9px] font-black py-0.5 right-[-35px] top-[14px] w-[120px] text-center shadow-xs">
                                កំពុងជ្រើស
                              </div>
                            </div>
                          )}

                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-purple-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700'}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${s.badgeBg}`}>
                                {s.lessonCountText}
                              </span>
                            </div>

                            <h5 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-900">
                              មុខវិជ្ជា {s.name}
                            </h5>
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                              {s.desc}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {s.duration}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModalForSubject(s.id);
                              }}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-purple-900 text-white hover:bg-purple-800'
                                  : 'bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-900'
                              }`}
                            >
                              <span>បើកកិច្ចតែងការ</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Active Subject Daily Lesson Plan Card («គំរូកិច្ចតែងការបង្រៀនប្រចាំថ្ងៃ») */}
                <div className={`p-6 sm:p-7 rounded-[26px] border ${currentSubjectDef.lightBorder} ${currentSubjectDef.lightBg} space-y-4 shadow-xs relative overflow-hidden transition-all duration-300`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-200/60">
                        {React.createElement(currentSubjectDef.icon, { className: "w-5 h-5 text-purple-900" })}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm sm:text-base">
                          {currentSubjectDef.sampleTitle}
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          ស្តង់ដារវិធីសាស្ត្របង្រៀនសកម្មបែបសិស្សមជ្ឈមណ្ឌល (Student-Centered Approach)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-bold text-purple-950 bg-white px-3 py-1.5 rounded-full shadow-2xs border border-purple-200/60">
                        រយៈពេល៖ {currentSubjectDef.duration}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenModalForSubject(activeLessonSubject)}
                        className="px-3 py-1.5 bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-full font-extrabold text-xs transition shadow-2xs flex items-center gap-1 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>មើលលម្អិត</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-800 font-medium">
                    <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/60 flex items-start gap-2.5">
                      <span className="text-base shrink-0">🎯</span>
                      <div>
                        <strong className="text-slate-900 font-extrabold">គោលបំណង៖</strong>{' '}
                        <span className="text-slate-700 font-medium">{currentSubjectDef.objective}</span>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/60 flex items-start gap-2.5">
                      <span className="text-base shrink-0">🛠️</span>
                      <div>
                        <strong className="text-slate-900 font-extrabold">សម្ភារឧបទ្ទេស៖</strong>{' '}
                        <span className="text-slate-700 font-medium">{currentSubjectDef.materials}</span>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/60 flex items-start gap-2.5">
                      <span className="text-base shrink-0">👩‍🏫</span>
                      <div>
                        <strong className="text-slate-900 font-extrabold">សកម្មភាពរៀន និងបង្រៀន៖</strong>{' '}
                        <span className="text-slate-700 font-medium">{currentSubjectDef.activities}</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Tags & Direct Launch */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {currentSubjectDef.features.map((f, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200/80 rounded-lg text-[11px] font-bold shadow-2xs"
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${currentSubjectDef.sampleTitle}\nគោលបំណង៖ ${currentSubjectDef.objective}\nសម្ភារ៖ ${currentSubjectDef.materials}\nសកម្មភាព៖ ${currentSubjectDef.activities}`);
                          onShowToast('បានចម្លងគំរូកិច្ចតែងការទៅ Clipboard');
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5 active:scale-95"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>ចម្លងគំរូ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenModalForSubject(activeLessonSubject)}
                        className="px-4 py-1.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1.5 active:scale-95"
                      >
                        <BookOpenCheck className="w-3.5 h-3.5 text-amber-300" />
                        <span>បើកកិច្ចតែងការពេញលេញ</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Subject Lessons Preview List */}
                <div className="bg-white p-5 sm:p-6 rounded-[26px] border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-900" />
                        <span>បញ្ជីមេរៀនកិច្ចតែងការ៖ មុខវិជ្ជា {activeLessonSubject}</span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        បង្ហាញ {filteredSubjectLessons.length} នៃ {subjectLessons.length} កិច្ចតែងការ
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={lessonPlanSearch}
                          onChange={(e) => setLessonPlanSearch(e.target.value)}
                          placeholder="ស្វែងរកមេរៀន..."
                          className="w-44 sm:w-56 pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-purple-400 transition"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                    {filteredSubjectLessons.slice(0, 12).map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => handleOpenModalForSubject(lesson.subject, lesson.id)}
                        className="group p-3.5 rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/30 transition cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-extrabold text-[10px]">
                              {lesson.lessonNo}
                            </span>
                            <span className="text-[11px] text-slate-400 font-bold">•</span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {lesson.duration || '៤៥ នាទី'}
                            </span>
                          </div>
                          <h6 className="font-extrabold text-xs text-slate-900 group-hover:text-purple-950 truncate">
                            {lesson.title}
                          </h6>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {lesson.objectives?.knowledge || 'អនុវត្តវិធីសាស្ត្របង្រៀនសកម្មតាមកម្មវិធីសិក្សា'}
                          </p>
                        </div>

                        <div className="shrink-0 p-2 rounded-xl bg-slate-100 group-hover:bg-purple-900 group-hover:text-white text-slate-600 transition">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredSubjectLessons.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs font-medium">
                      មិនមានមេរៀនដែលត្រូវនឹងពាក្យស្វែងរកឡើយ
                    </div>
                  )}

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenModalForSubject(activeLessonSubject)}
                      className="text-xs font-bold text-purple-900 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5"
                    >
                      <span>បើកមើលមេរៀនទាំងអស់នៃមុខវិជ្ជា {activeLessonSubject} ក្នុងទម្រង់ពេញលេញ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 6. The Modal */}
                <KhmerLessonPlanModal
                  isOpen={isKhmerModalOpen}
                  onClose={() => setIsKhmerModalOpen(false)}
                  onShowToast={onShowToast}
                  onEditTimetable={() => setSubSec2('timetable')}
                  initialSubject={modalTargetSubject}
                  initialLessonId={modalTargetLessonId}
                />
              </div>
            );
          })()}

          {/* 2.4 Lesson Slides / ស្លាយបង្រៀន */}
          {subSec2 === 'slides' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-[28px] border border-slate-200/80 shadow-xs">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Presentation className="w-5 h-5 text-purple-900" />
                    <span>ស្លាយបង្រៀនអន្តរកម្មប្រចាំថ្នាក់ (Lesson Slides Deck)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    បណ្តុំស្លាយបង្រៀនតាមមុខវិជ្ជា និងមេរៀន សម្រាប់បង្ហាញលើអេក្រង់ ឬፕሮចិចទ័រក្នុងថ្នាក់រៀន
                  </p>
                </div>
                <button
                  onClick={() => setIsAddSlideModalOpen(true)}
                  className="no-print bg-purple-900 hover:bg-purple-800 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-md shadow-purple-900/20 active:scale-95 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> បន្ថែមស្លាយបង្រៀនថ្មី
                </button>
              </div>

              {/* ⭐ FEATURED INTERACTIVE SLIDE DECK: KHMER LESSON 1 */}
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white p-6 sm:p-7 rounded-[32px] border-2 border-amber-400/40 shadow-2xl shadow-purple-950/40">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-md flex items-center gap-1.5 animate-pulse">
                        <span>✨ ស្លាយបង្រៀនអាជីពកម្រិតស្តង់ដារ MoEYS</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[11px] font-bold">
                        ១០ ស្លាយពេញលេញ
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>📱 បញ្ជាពីទូរស័ព្ទ (QR Remote)</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 text-[11px] font-bold flex items-center gap-1">
                        <span>🖼️ រូបភាពពិត + សំឡេងអន្តរកម្ម</span>
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      ភាសាខ្មែរ មេរៀនទី១៖ <span className="text-amber-300">អ្នកមានគុណ</span>
                    </h2>
                    <p className="text-sm text-purple-200 font-bold">
                      ចំណុចរង៖ បំណិនការប្រើប្រាស់វចនានុក្រម និងការកត់ត្រាសំខាន់ៗក្នុងកំណាព្យ (៥ ជំហានបង្រៀនសកម្ម)
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      ស្លាយរចនាយ៉ាងផ្ចិតផ្ចង់សម្រាប់បង្ហាញលើកុំព្យូទ័រ PC / Smart TV / Projector ជាមួយរូបភាពពិតទាក់ទាញ អក្សរធំច្បាស់ៗ ចលនាបង្ហាញចំណុចម្តងមួយៗ (Step Animation) សំណួរបំផុសគំនិត និងមុខងារបញ្ជាស្លាយពីទូរស័ព្ទដៃដោយគ្រាន់តែស្កែន QR កូដ!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlideLesson(khmerLessonPlansList[0]);
                        setIsKhmerSlideModalOpen(true);
                      }}
                      className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 transition active:scale-95 flex items-center justify-center gap-2.5 border border-amber-200 group"
                    >
                      <Presentation className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                      <span>🖥️ បើកស្លាយបង្រៀនពេញអេក្រង់</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlideLesson(khmerLessonPlansList[0]);
                        setIsKhmerSlideModalOpen(true);
                      }}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs transition active:scale-95 flex items-center justify-center gap-2 border border-indigo-400/40 shadow-md"
                    >
                      <Smartphone className="w-4 h-4 text-amber-300" />
                      <span>📱 បញ្ជាស្លាយពីទូរស័ព្ទ (QR)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModalTargetSubject('ភាសាខ្មែរ');
                        setModalTargetLessonId(khmerLessonPlansList[0].id);
                        setIsKhmerModalOpen(true);
                      }}
                      className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold text-xs transition active:scale-95 flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <BookOpenCheck className="w-4 h-4 text-amber-300" />
                      <span>មើលកិច្ចតែងការយោង</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessonDecks.map((deck) => (
                  <div
                    key={deck.id}
                    className="bg-white p-5 rounded-[24px] border border-slate-200/80 text-xs space-y-3 shadow-xs hover:border-purple-300 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 font-extrabold border border-purple-200/60">
                          {deck.subject}
                        </span>
                        <span className="text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-xl">
                          {deck.slidesCount} ស្លាយ
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm line-clamp-2">{deck.title}</h4>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">{deck.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">កែប្រែ៖ {deck.updatedAt}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActiveSlideDeck(deck);
                            setCurrentSlideIdx(0);
                            setIsSlideViewerOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Presentation className="w-3.5 h-3.5 text-amber-300" /> បង្ហាញស្លាយ
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`តើអ្នកពិតជាចង់លុបស្លាយ "${deck.title}" នេះមែនទេ?`)) {
                              setLessonDecks(lessonDecks.filter(d => d.id !== deck.id));
                              onShowToast('បានលុបស្លាយបង្រៀនជោគជ័យ!');
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 transition"
                          title="លុបស្លាយ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2.5 Assessment Package & Rubrics */}
          {subSec2 === 'assessment' && (
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-4 border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">កញ្ចប់ឯកសារវាយតម្លៃការសិក្សា (Assessment & Rubrics)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">កម្រងសំណួរធ្វើតេស្ត, លំហាត់ស្រាវជ្រាវ, សន្លឹកកិច្ចការ និងតារាងរង្វាយតម្លៃតាមលក្ខណៈវិនិច្ឆ័យ</p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-900 font-bold text-xs">
                  ស្តង់ដារ QA
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-4.5 rounded-[20px] border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">តេស្តរោគវិនិច្ឆ័យ</span>
                  <h4 className="font-bold text-slate-900 text-sm">សំណួរតេស្តអំណានដើមឆ្នាំ</h4>
                  <p className="text-xs text-slate-600">កម្រងសន្លឹកកិច្ចការអានពាក្យ និងប្រយោគខ្លីៗសម្រាប់វាស់ស្ទង់កម្រិតសិស្ស។</p>
                </div>
                <div className="bg-slate-50 p-4.5 rounded-[20px] border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">លំហាត់ស្រាវជ្រាវ</span>
                  <h4 className="font-bold text-slate-900 text-sm">កិច្ចការគម្រោងតូចៗ</h4>
                  <p className="text-xs text-slate-600">ការកត់ត្រាការលូតលាស់ដើមឈើ ឬការរាប់ចំនួនវត្ថុជុំវិញផ្ទះ។</p>
                </div>
                <div className="bg-slate-50 p-4.5 rounded-[20px] border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">តារាង Rubrics</span>
                  <h4 className="font-bold text-slate-900 text-sm">លក្ខណៈវិនិច្ឆ័យវាយតម្លៃ</h4>
                  <p className="text-xs text-slate-600">លក្ខណៈវិនិច្ឆ័យ ៤ កម្រិត ពីខ្សោយដល់ល្អប្រសើរក្នុងការអនុវត្តលំហាត់។</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 3: CLASSROOM ENVIRONMENT & INVENTORY ================= */}
      {activeMainSec === 'sec3' && (
        <div className="space-y-4">
          <div className="no-print flex gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
            {[
              { id: 'committee', label: 'គណៈកម្មការគ្រប់គ្រងថ្នាក់ (គ. គ. ថ.)', icon: Users },
              { id: 'seating', label: 'ប្លង់តុ & ការរៀបចំកន្លែងអង្គុយ', icon: Users2 },
              { id: 'rules', label: 'បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន', icon: ShieldCheck },
              { id: 'inventory', label: `សារពើភណ្ឌថ្នាក់រៀន (${inventory.length})`, icon: Box },
              { id: 'materials', label: 'ផ្ទាំងសម្ភារ & សន្លឹកតុបតែងថ្នាក់', icon: Sparkles },
            ].map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = subSec3 === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSubSec3(sub.id as any)}
                  className={`px-3.5 py-2.5 rounded-2xl shrink-0 transition flex items-center gap-2 ${
                    isSubActive
                      ? 'bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold'
                      : 'bg-gradient-to-r from-white to-purple-50/50 hover:bg-purple-50 text-slate-800 border border-purple-200/60 shadow-2xs font-semibold'
                  }`}
                >
                  <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3.0 Classroom Committee (គ. គ. ថ. ឧបសម្ព័ន្ធ ១ MoEYS) */}
          {subSec3 === 'committee' && (
            <ClassroomCommitteeOfficialManager
              teacher={teacher}
              currentYear={activeAcademicYearValue}
              onShowToast={onShowToast}
            />
          )}

          {/* 3.1 Inventory */}
          {subSec3 === 'inventory' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-[28px] border border-slate-200/80 shadow-xs">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Box className="w-5 h-5 text-amber-600" />
                    <span>បញ្ជីសារពើភណ្ឌថ្នាក់រៀន (Inventory)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    គ្រប់គ្រងចំនួន និងស្ថានភាពសម្ភារ (តុ, កៅអី, ក្តារខៀន, កង្ហារ, អំពូលភ្លើង, ធ្នើសៀវភៅ) និងស្នើសុំជួសជុល
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setIsInventoryPdfModalOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-red-600/20 active:scale-95"
                    title="កំណត់ និងកែសម្រួលទម្រង់ឯកសារមុនទាញយកជា PDF"
                  >
                    <FileText className="w-4 h-4 text-red-200" />
                    <span>ទាញយក / កែសម្រួល PDF</span>
                  </button>
                  <button
                    onClick={() => setIsAddInventoryOpen(true)}
                    className="no-print bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-md shadow-amber-600/20 active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> បន្ថែមសម្ភារថ្មី
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {inventory.map((i) => (
                  <div key={i.id} className="bg-white p-4 rounded-[22px] border border-slate-200/80 shadow-xs hover:border-amber-300 transition space-y-3 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 inline-block mb-1">
                          {i.category}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm">{i.name}</h4>
                      </div>
                      <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center font-black text-amber-700 text-xs shadow-inner shrink-0">
                        {i.qty}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-medium">ស្ថានភាព៖</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold border ${i.condition === 'ល្អ' ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60' : i.condition === 'មធ្យម' ? 'bg-amber-50 text-amber-800 border-amber-200/60' : 'bg-red-50 text-red-800 border-red-200/60'}`}>
                          {i.condition}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 no-print">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingInventory(i);
                            setEditInvName(i.name);
                            setEditInvQty(i.qty);
                            setEditInvCondition(i.condition);
                            setEditInvCategory(i.category || 'សម្ភារថ្នាក់រៀន');
                            setIsEditInventoryOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition"
                          title="កែសម្រួលសម្ភារ"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`តើអ្នកពិតជាចង់លុបសម្ភារ "${i.name}" នេះមែនទេ?`)) {
                              onDeleteInventory(i.id);
                              onShowToast('បានលុបសម្ភារចេញពីសារពើភណ្ឌ!');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 transition"
                          title="លុបសម្ភារ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3.2 Seating chart & Self-management groups */}
          {subSec3 === 'seating' && (
            <div className="space-y-6">
              <DigitalClassroomLayout
                teacher={teacher}
                students={students}
                onShowToast={onShowToast}
              />
            </div>
          )}

          {/* 3.3 Classroom Rules */}
          {subSec3 === 'rules' && (
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-700" />
                    <span>បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន (Classroom Rules - {classroomRules.length} ប្រការ)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">បទដ្ឋានរួមដែលគ្រូ និងសិស្សព្រមព្រៀងគ្នា (ការស្លៀកពាក់, វិន័យម៉ោងពេល, អនាម័យ, ការគោរពគ្នា)</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setIsAddingRuleAdmin(true)}
                    className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs transition flex items-center gap-1.5 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>បន្ថែមប្រការថ្មី</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRulesPdfModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-red-600/20 active:scale-95"
                    title="កំណត់ និងកែសម្រួលទម្រង់ឯកសារមុនទាញយកជា PDF"
                  >
                    <FileText className="w-4 h-4 text-red-200" />
                    <span>ទាញយក / កែសម្រួល PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRulesModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-800 hover:from-purple-800 hover:to-indigo-700 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-purple-900/20 active:scale-95"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>រៀបចំ និងបោះពុម្ព A4 ១០០%</span>
                  </button>
                </div>
              </div>

              {/* Add Rule Form */}
              {isAddingRuleAdmin && (
                <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-2xl space-y-3">
                  <h4 className="font-bold text-xs text-purple-950 uppercase tracking-wide">បន្ថែមប្រការថ្មី</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="ចំណងជើង (ឧ. ប្រការ១៣)"
                      value={newRuleTitleAdmin}
                      onChange={(e) => setNewRuleTitleAdmin(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="ខ្លឹមសារប្រការ..."
                      value={newRuleDescAdmin}
                      onChange={(e) => setNewRuleDescAdmin(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white sm:col-span-2"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingRuleAdmin(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold"
                    >
                      បោះបង់
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newRuleTitleAdmin.trim() || !newRuleDescAdmin.trim()) return;
                        const newId = Math.max(0, ...classroomRules.map(r => r.id)) + 1;
                        setClassroomRules([...classroomRules, { id: newId, title: newRuleTitleAdmin.trim(), description: newRuleDescAdmin.trim() }]);
                        setNewRuleTitleAdmin('');
                        setNewRuleDescAdmin('');
                        setIsAddingRuleAdmin(false);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-purple-900 text-white text-xs font-bold hover:bg-purple-800"
                    >
                      រក្សាទុក
                    </button>
                  </div>
                </div>
              )}

              {/* Rules List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {classroomRules.map((rule, idx) => (
                  <div key={rule.id} className="bg-gradient-to-br from-slate-50 to-purple-50/40 p-4 rounded-2xl border border-slate-200/80 space-y-2 relative group hover:shadow-sm transition">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 font-extrabold text-xs">
                        {rule.title}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRuleAdminId(rule.id);
                            setEditRuleAdminTitle(rule.title);
                            setEditRuleAdminDesc(rule.description);
                          }}
                          className="p-1.5 rounded-lg hover:bg-purple-200 text-purple-800"
                          title="កែសម្រួល"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('តើអ្នកពិតជាចង់លុបប្រការនេះមែនទេ?')) {
                              setClassroomRules(classroomRules.filter(r => r.id !== rule.id));
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-700"
                          title="លុប"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {editingRuleAdminId === rule.id ? (
                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          value={editRuleAdminTitle}
                          onChange={(e) => setEditRuleAdminTitle(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs rounded border border-purple-300 font-bold"
                        />
                        <textarea
                          value={editRuleAdminDesc}
                          onChange={(e) => setEditRuleAdminDesc(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs rounded border border-purple-300 h-16 resize-none"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingRuleAdminId(null)}
                            className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-[10px] font-bold"
                          >
                            បោះបង់
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setClassroomRules(classroomRules.map(r => r.id === rule.id ? { ...r, title: editRuleAdminTitle, description: editRuleAdminDesc } : r));
                              setEditingRuleAdminId(null);
                            }}
                            className="px-2.5 py-1 rounded bg-purple-900 text-white text-[10px] font-bold"
                          >
                            រក្សាទុក
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{rule.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3.4 Classroom Posters & Decoration (Food Safety 5 Keys & Hygiene) */}
          {subSec3 === 'materials' && (
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-md">
                    🦋
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <span>សន្លឹកតុបតែងថ្នាក់ & សុវត្ថិភាពចំណីអាហារ (Classroom Decoration Posters)</span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                        Print-Ready A4
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      រចនាបថគែមរលកផ្កា មេអំបៅ 3D និងពណ៌អក្សរចម្រុះសម្រាប់បោះពុម្ពបិទតុបតែងជញ្ជាំងថ្នាក់រៀន
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setIsDecorationModalOpen(true)}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-blue-600/20 active:scale-95"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>បើកផ្ទាំងរៀបចំ & បោះពុម្ព (Print / PDF)</span>
                  </button>
                </div>
              </div>

              {/* Highlight Banner */}
              <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">គន្លឹះ ៥ យ៉ាងដើម្បីសុវត្ថិភាពចំណីអាហារ</h4>
                    <p className="text-slate-600 mt-0.5">
                      គាំទ្រជម្រើសប្លង់បោះពុម្ព <strong>១ សន្លឹកធំ</strong>, <strong>២ ក្នុង ១ទំព័រ</strong>, <strong>៤ តូចៗ</strong> និងបន្ទាត់កាត់ ✂️
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDecorationModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white text-blue-700 font-extrabold shadow-sm border border-blue-200 hover:bg-blue-50 transition shrink-0"
                >
                  ចូលកែសម្រួល & ព្រីន A4 ➜
                </button>
              </div>

              {/* Quick Preview Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: 'គន្លឹះ ៥ យ៉ាង',
                    sub: 'ដើម្បី សុវត្ថិភាពចំណីអាហារ',
                    color: 'from-blue-500 to-sky-400',
                    border: 'border-blue-300',
                    badge: '🌟 អនាម័យ & សុខភាព',
                    tag: 'ខៀវ'
                  },
                  {
                    title: 'រក្សាភាពស្អាតជានិច្ច',
                    sub: 'លាងដៃជាមួយសាប៊ូឱ្យបានញឹកញាប់ និងសម្អាតឧបករណ៍ផ្ទះបាយជានិច្ច',
                    color: 'from-rose-500 to-pink-400',
                    border: 'border-rose-300',
                    badge: 'គន្លឹះទី ១',
                    tag: 'ផ្កាឈូក'
                  },
                  {
                    title: 'ញែកអាហារឆៅ និងឆ្អិន',
                    sub: 'កុំទុកសាច់ឆៅប៉ះពាល់ជាមួយអាហារឆ្អិនឱ្យសោះ',
                    color: 'from-purple-600 to-purple-400',
                    border: 'border-purple-300',
                    badge: 'គន្លឹះទី ២',
                    tag: 'ស្វាយ'
                  },
                  {
                    title: 'ចម្អិនអាហារឱ្យបានឆ្អិនល្អ',
                    sub: 'ចម្អិនឱ្យឆ្អិនសព្វ ជាពិសេសសាច់ ស៊ុត និងគ្រឿងសមុទ្រ',
                    color: 'from-teal-600 to-teal-400',
                    border: 'border-teal-300',
                    badge: 'គន្លឹះទី ៣',
                    tag: 'ត្បូងមរកត'
                  },
                  {
                    title: 'សីតុណ្ហភាពសុវត្ថិភាព',
                    sub: 'កុំទុកអាហារនៅក្រៅលើសពី ២ម៉ោង និងក្លាសេឱ្យបានត្រឹមត្រូវ',
                    color: 'from-orange-500 to-amber-400',
                    border: 'border-orange-300',
                    badge: 'គន្លឹះទី ៤',
                    tag: 'ទឹកក្រូច'
                  },
                  {
                    title: 'ប្រើទឹក & វត្ថុធាតុដើមសុវត្ថិភាព',
                    sub: 'ប្រើទឹកស្អាតលាងបន្លែផ្លែឈើ និងជ្រើសរើសអាហារស្រស់មានប្រភពច្បាស់លាស់',
                    color: 'from-indigo-600 to-indigo-400',
                    border: 'border-indigo-300',
                    badge: 'គន្លឹះទី ៥',
                    tag: 'ឥណ្ឌីហ្គោ'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setIsDecorationModalOpen(true)}
                    className={`bg-white rounded-2xl p-4 border ${item.border} shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group hover:scale-[1.02] duration-200`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white bg-gradient-to-r ${item.color} shadow-xs`}>
                        {item.badge}
                      </span>
                      <span className="text-slate-400 text-xs group-hover:text-blue-600 transition">🦋</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-koulen text-lg text-slate-800 tracking-wide">{item.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.sub}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-blue-600">
                      <span>ចុចកែសម្រួល & ព្រីន</span>
                      <span>➜</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 4: PLC, COMMUNITY & PROFESSIONAL DEV ================= */}
      {activeMainSec === 'sec4' && (
        <div className="space-y-4">
          <div className="no-print flex gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
            {[
              { id: 'plc', label: `កំណត់ហេតុ PLC (${plc.length})`, icon: FileBadge },
              { id: 'self_study', label: 'ស្វ័យសិក្សា (គ្រូបឋម MoEYS)', icon: GraduationCap },
              { id: 'model_school', label: 'ស្តង់ដាសាលាគំរូ ៥ (ប្រកាស ១២៦៩)', icon: Award },
              { id: 'cpd', label: 'ការអភិវឌ្ឍវិជ្ជាជីវៈ (CPD Credits)', icon: Award },
              { id: 'agreements', label: 'កិច្ចព្រមព្រៀង & កិច្ចសន្យា', icon: HeartHandshake },
              { id: 'parents', label: 'ទំនាក់ទំនងមាតាបិតា & Telegram', icon: MessageSquare },
              { id: 'letters', label: 'លិខិតរដ្ឋបាលទូទៅ', icon: FileText },
            ].map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = subSec4 === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSubSec4(sub.id as any)}
                  className={`px-3.5 py-2.5 rounded-2xl shrink-0 transition flex items-center gap-2 ${
                    isSubActive
                      ? 'bg-purple-900 text-white shadow-md shadow-purple-900/20 font-bold'
                      : 'bg-gradient-to-r from-white to-purple-50/50 hover:bg-purple-50 text-slate-800 border border-purple-200/60 shadow-2xs font-semibold'
                  }`}
                >
                  <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* 4.0 PLC Meetings */}
          {subSec4 === 'plc' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-[28px] border border-slate-200/80 shadow-xs">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <FileBadge className="w-5 h-5 text-emerald-600" />
                    <span>កំណត់ហេតុកិច្ចប្រជុំបច្ចេកទេស (PLC)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ការកត់ត្រាការប្រជុំកែលម្អគុណភាពបង្រៀន ការដោះស្រាយបញ្ហាសិស្សរៀនយឺត និងការបង្កើតវិធីសាស្ត្របង្រៀនថ្មីៗ
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlcPdfMeeting(plc[0] || null);
                      setIsPlcPdfModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-red-600/20 active:scale-95"
                    title="កំណត់ និងកែសម្រួលទម្រង់ឯកសារមុនទាញយកជា PDF"
                  >
                    <FileText className="w-4 h-4 text-red-200" />
                    <span>កំណត់ទម្រង់ & ទាញយក PDF</span>
                  </button>
                  <button
                    onClick={() => { setSelectedPLCMeeting(null); setIsPLCModalOpen(true); }}
                    className="no-print bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
                  >
                    <FilePlus className="w-4 h-4" /> កត់ត្រាការប្រជុំ PLC (ទម្រង់ផ្លូវការ)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {plc.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-5 rounded-[22px] border border-slate-200/80 text-xs space-y-3 shadow-xs hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          <span>កាលបរិច្ឆេទ៖ {p.date}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          PLC #{p.id}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-purple-950 pt-0.5 leading-snug">{p.topic}</h4>
                    </div>

                    <div className="space-y-1.5 text-slate-600 font-medium bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <p className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>សមាសភាព៖ <strong className="text-slate-800">{p.attendees}</strong></span>
                      </p>
                      <p className="flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>បញ្ហាពិភាក្សា៖ <span className="text-slate-800">{p.issues}</span></span>
                      </p>
                    </div>

                    <div className="text-emerald-900 font-bold bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/60 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                      <span className="line-clamp-2">លទ្ធផលសម្រេច៖ {p.decision}</span>
                    </div>

                    {/* Action buttons: Edit, Customize PDF & Download */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => { setSelectedPLCMeeting(p); setIsPLCModalOpen(true); }}
                        className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-[11px] border border-purple-200/80 flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                      >
                        <FileEdit className="w-3.5 h-3.5 text-purple-700" />
                        <span>កែសម្រួលព័ត៌មាន</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPlcPdfMeeting(p);
                          setIsPlcPdfModalOpen(true);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm shadow-red-600/20"
                        title="កំណត់ និងកែសម្រួលទម្រង់ឯកសារមុនទាញយកជា PDF"
                      >
                        <FileText className="w-3.5 h-3.5 text-red-200" />
                        <span>កំណត់ទម្រង់ & ទាញយក PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4.2 Model School Standards Assessment (Prakas 1269) */}
          {subSec4 === 'model_school' && (
            <ModelSchoolStandardsManager
              teacher={teacher}
              students={students}
              grades={grades}
              attendance={attendance}
              borrowings={bookBorrowings}
              onAddBorrowing={handleAddBorrowing}
              onUpdateBorrowing={handleUpdateBorrowing}
              onDeleteBorrowing={handleDeleteBorrowing}
              libraryBooks={libraryBooks}
              currentYear={currentYear}
              onShowToast={onShowToast}
              fontFamily={fontFamily}
              backgroundTheme={backgroundTheme}
              activeBannerTheme={activeBannerTheme}
            />
          )}

          {/* 4.3 Teacher Agreements */}
          {subSec4 === 'agreements' && (
            <div className="space-y-5">
              {/* Agreements Sub-navigation Tabs */}
              <div className="bg-white p-2 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setAgreementsSubTab('parents')}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2.5 ${
                    agreementsSubTab === 'parents'
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <HeartHandshake className={`w-4 h-4 ${agreementsSubTab === 'parents' ? 'text-white' : 'text-rose-600'}`} />
                  <span>១. កិច្ចព្រមព្រៀងមាតាបិតាសិស្ស</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    agreementsSubTab === 'parents' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
                  }`}>
                    មានគ្រប់សិស្សទាំង {students.length} នាក់
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAgreementsSubTab('principal')}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2.5 ${
                    agreementsSubTab === 'principal'
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <FileBadge className={`w-4 h-4 ${agreementsSubTab === 'principal' ? 'text-white' : 'text-purple-600'}`} />
                  <span>២. កិច្ចព្រមព្រៀងជាមួយនាយកសាលា</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    agreementsSubTab === 'principal' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
                  }`}>
                    ១ ច្បាប់ផ្លូវការ
                  </span>
                </button>
              </div>

              {/* Render Selected Agreement View */}
              {agreementsSubTab === 'parents' ? (
                <TeacherParentAgreementsManager
                  teacher={teacher}
                  students={students}
                  onShowToast={onShowToast}
                />
              ) : (
                <TeacherPrincipalAgreementEditor
                  teacher={teacher}
                  students={students}
                  onShowToast={onShowToast}
                />
              )}
            </div>
          )}

          {/* 4.2 Parent Communication & Telegram */}
          {subSec4 === 'parents' && (
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-4 border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">ទំនាក់ទំនងមាតាបិតា និងអាណាព្យាបាល (Telegram & Meetings)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">ការជួបពិភាក្សាផ្ទាល់ ការទំនាក់ទំនងតាមគ្រុបតេឡេក្រាម និងប្រជុំអាណាព្យាបាលប្រចាំត្រីមាស</p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 font-bold text-xs">
                  Telegram Group Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-[22px] border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>គ្រុប Telegram អាណាព្យាបាលថ្នាក់ {teacher.grade}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ប្រើប្រាស់សម្រាប់ផ្ញើដំណឹងវត្តមានប្រចាំថ្ងៃ កិច្ចការផ្ទះ និងការជូនដំណឹងពីកិច្ចប្រជុំមាតាបិតាសាលាបឋមសិក្សា។
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">សមាជិកក្នុងគ្រុប៖ ៣២ នាក់</span>
                    <span className="text-blue-600 font-bold">ចូលរួម ១០០%</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-[22px] border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-emerald-600" />
                    <span>ការប្រជុំមាតាបិតាប្រចាំត្រីមាស</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    កិច្ចប្រជុំផ្សព្វផ្សាយលទ្ធផលសិក្សារបស់សិស្ស និងការសំណូមពរជួយទ្រទ្រង់ការរៀនសូត្ររបស់កូននៅផ្ទះ។
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-bold text-emerald-800">
                    📅 កាលបរិច្ឆេទប្រជុំបន្ទាប់៖ ចុងខែនេះ
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4.3 CPD Professional Development */}
          {subSec4 === 'cpd' && (
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-4 border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">ការអភិវឌ្ឍវិជ្ជាជីវៈជាប្រចាំ (CPD Credits - MoEYS)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">តាមដានការប្រមូលក្រេឌីតលើប្រព័ន្ធ CPD របស់ក្រសួង, វិញ្ញាបនបត្រវគ្គបណ្តុះបណ្តាល និងរបាយការណ៍ស្វ័យុស្សាហ៍</p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                  CPD Score: 45 / 50 Credits
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-4.5 rounded-[20px] border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">វគ្គបណ្តុះបណ្តាលអំណាន</span>
                  <h4 className="font-bold text-slate-900 text-sm">វិធីសាស្ត្របង្រៀនអំណានថ្នាក់ដំបូង</h4>
                  <p className="text-xs text-slate-600">ទទួលបាន ១៥ ក្រេឌីតពីក្រសួងអប់រំ។</p>
                </div>
                <div className="bg-slate-50 p-4.5 rounded-[20px] border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">គណិតវិទ្យាថ្នាក់ដំបូង</span>
                  <h4 className="font-bold text-slate-900 text-sm">បច្ចេកទេសគណិតវិទ្យាទំនើប</h4>
                  <p className="text-xs text-slate-600">ទទួលបាន ២០ ក្រេឌីតពីវគ្គបណ្តុះបណ្តាលខេត្ត។</p>
                </div>
                <div className="bg-slate-50 p-4.5 rounded-[20px] border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">ស្វ័យសិក្សាឌីជីថល</span>
                  <h4 className="font-bold text-slate-900 text-sm">WikiSchool & PLP Operations</h4>
                  <p className="text-xs text-slate-600">ទទួលបាន ១០ ក្រេឌីតពីស្វ័យសិក្សាអនឡាញ។</p>
                </div>
              </div>
            </div>
          )}

          {/* 4.5 Self-Study Section under PLC & Professional Development */}
          {subSec4 === 'self_study' && (
            <div className="space-y-4">
              <PLPTabletBanner />

              {/* Portal Embedded Frame */}
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-mono font-bold text-slate-500 ml-2">https://kru.plpedtech.com/login?from=%2Fdashboard%2Fstudent</span>
                  </div>
                  <a
                    href="https://kru.plpedtech.com/login?from=%2Fdashboard%2Fstudent"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 flex items-center gap-1.5 transition active:scale-95"
                  >
                    <span>បើកផ្ទាំងថ្មី (New Tab)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="w-full h-[600px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                  <iframe
                    src="https://kru.plpedtech.com/login?from=%2Fdashboard%2Fstudent"
                    className="w-full h-full border-none"
                    title="PLP EdTech Self Study"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4.4 General Administrative Letters */}
          {subSec4 === 'letters' && (
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-4 border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">លិខិតរដ្ឋបាលទូទៅ (Administrative Letters & Reports)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">លិខិតសុំច្បាប់, លិខិតផ្ទេរសិស្សចេញ-ចូល, លិខិតបញ្ជូនសិស្សពិនិត្យសុខភាព និងរបាយការណ៍ជូនគណៈគ្រប់គ្រងសាលា</p>
                </div>
                <button
                  onClick={onPrint}
                  className="no-print bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" /> បោះពុម្ពលិខិតរដ្ឋបាល
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4.5 rounded-[20px] border border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">សំណុំលិខិតសុំច្បាប់អវត្តមានគ្រូ / សិស្ស</h4>
                    <p className="text-xs text-slate-500 mt-0.5">ទម្រង់ផ្លូវការជូននាយកសាលាបឋមសិក្សា</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">ទាញយក</span>
                </div>
                <div className="bg-slate-50 p-4.5 rounded-[20px] border border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">របាយការណ៍បូកសរុបវត្តមាន និងលទ្ធផលប្រចាំខែ</h4>
                    <p className="text-xs text-slate-500 mt-0.5">ទម្រង់ស្តង់ដា WikiSchool / SIS</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">ទាញយក</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* Add Student Modal */}
      <AnimatePresence>
        {isAddStudentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-2xl shadow-2xl space-y-5 border border-slate-100 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span>បន្ថែមសិស្សថ្មី</span>
                </h3>
                <button
                  onClick={() => setIsAddStudentOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">គោត្តនាម និងនាម (Khmer Name) *</label>
                    <input
                      type="text"
                      required
                      placeholder="ឧ. នួន ស្រីរ័ត្ន"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ឈ្មោះឡាតាំង (Latin Name)</label>
                    <input
                      type="text"
                      placeholder="ឧ. Nuon Sreyroth"
                      value={newStudentLatinName}
                      onChange={(e) => setNewStudentLatinName(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">អត្តលេខ SIS</label>
                    <input
                      type="text"
                      placeholder="SIS-1007"
                      value={newStudentCivilId}
                      onChange={(e) => setNewStudentCivilId(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ភេទ</label>
                    <select
                      value={newStudentGender}
                      onChange={(e) => setNewStudentGender(e.target.value as 'ប្រុស' | 'ស្រី')}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    >
                      <option value="ប្រុស">ប្រុស</option>
                      <option value="ស្រី">ស្រី</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ថ្ងៃខែឆ្នាំកំណើត</label>
                    <input
                      type="date"
                      value={newStudentDob}
                      onChange={(e) => setNewStudentDob(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ទីកន្លែងកំណើត</label>
                    <input
                      type="text"
                      placeholder="ឧ. ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង"
                      value={newStudentPob}
                      onChange={(e) => setNewStudentPob(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ទីលំនៅបច្ចុប្បន្ន (Address)</label>
                    <input
                      type="text"
                      placeholder="ឧ. ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក..."
                      value={newStudentAddress}
                      onChange={(e) => setNewStudentAddress(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Parent Information */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">ព័ត៌មានឪពុកម្តាយ និងអាណាព្យាបាល</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">ឪពុកឈ្មោះ</label>
                      <input
                        type="text"
                        placeholder="ឧ. ខុយ វ៉ាន់នី"
                        value={newStudentFatherName}
                        onChange={(e) => setNewStudentFatherName(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">មុខរបរឪពុក / លេខទូរសព្ទ</label>
                      <input
                        type="text"
                        placeholder="ឧ. កសិករ ឬ 0976431123"
                        value={newStudentFatherJob}
                        onChange={(e) => setNewStudentFatherJob(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">ម្តាយឈ្មោះ</label>
                      <input
                        type="text"
                        placeholder="ឧ. វ៉ា ស្រីមុំ"
                        value={newStudentMotherName}
                        onChange={(e) => setNewStudentMotherName(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">មុខរបរម្តាយ</label>
                      <input
                        type="text"
                        placeholder="ឧ. កសិករ / មេផ្ទះ"
                        value={newStudentMotherJob}
                        onChange={(e) => setNewStudentMotherJob(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ស្ថានភាពគ្រួសារ</label>
                    <select
                      value={newStudentFamilyStatus}
                      onChange={(e) => setNewStudentFamilyStatus(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    >
                      <option value="ទូទៅ">ទូទៅ (គ្រួសារធម្មតា)</option>
                      <option value="ក្រ១">ក្រ១ (ក្រីក្រកម្រិត១ - ប័ណ្ណសមធម៌)</option>
                      <option value="ក្រ២">ក្រ២ (ក្រីក្រកម្រិត២ - ប័ណ្ណសមធម៌)</option>
                      <option value="ងាយរងគ្រោះ">ងាយរងគ្រោះ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">សម្គាល់ (Note)</label>
                    <input
                      type="text"
                      placeholder="ឧ. នៅរស់, បាត់បង់ឳពុក, បាត់បង់ម្តាយ..."
                      value={newStudentNote}
                      onChange={(e) => setNewStudentNote(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* MoEYS PRI & Repeating Status Section */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-700" />
                      <h5 className="font-black text-indigo-950 text-xs">
                        ស្ថានភាពសិក្សា & ស្ថិតិ MoEYS PRI
                      </h5>
                    </div>
                    <span className="text-[10px] text-indigo-800 font-bold bg-indigo-200/70 px-2 py-0.5 rounded-full">
                      📊 ស៊ីគ្នានឹងទម្រង់ស្ថិតិ PRI
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      ស្ថានភាពឡើងថ្នាក់ / ត្រួតថ្នាក់ (MoEYS PRI):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewStudentIsRepeating(false)}
                        className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition cursor-pointer ${
                          !newStudentIsRepeating
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span>🌟 សិស្សថ្មី / ឡើងថ្នាក់</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewStudentIsRepeating(true)}
                        className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition cursor-pointer ${
                          newStudentIsRepeating
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span>🔁 សិស្សត្រួតថ្នាក់</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        ពិការភាព / ការលំបាកពិសេស (PRI តារាងទី៣)
                      </label>
                      <select
                        value={newStudentDisability}
                        onChange={(e) => setNewStudentDisability(e.target.value)}
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="គ្មាន">គ្មាន (សិស្សទូទៅ)</option>
                        <option value="ពិបាកមើល">ពិបាកមើល (គំហើញ/ភ្នែក)</option>
                        <option value="ពិបាកស្តាប់">ពិបាកស្តាប់ (សោតវិញ្ញាណ/ត្រចៀក)</option>
                        <option value="ពិបាកនិយាយ">ពិបាកនិយាយ (ការបញ្ចេញសំឡេង)</option>
                        <option value="ពិបាកធ្វើចលនា">ពិបាកធ្វើចលនា (ដៃ/ជើង/កាយសម្បទា)</option>
                        <option value="ពិការសតិបញ្ញា">ពិការសតិបញ្ញា / រៀនយឺត</option>
                        <option value="ពិការផ្លូវចិត្ត">ពិការផ្លូវចិត្ត / អូទីសឹម</option>
                        <option value="ពិការសរីរាង្គខាងក្នុង">ពិការសរីរាង្គខាងក្នុង</option>
                        <option value="ពិការផ្សេងៗ">ពិការភាពផ្សេងៗ</option>
                        <option value="កុមារកំព្រា">កុមារកំព្រា</option>
                        <option value="កុមារងាយរងគ្រោះ">កុមារងាយរងគ្រោះ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        ជនជាតិដើមភាគតិច (PRI តារាងទី៤)
                      </label>
                      <select
                        value={newStudentIndigenous}
                        onChange={(e) => setNewStudentIndigenous(e.target.value)}
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="គ្មាន">គ្មាន (ជនជាតិខ្មែរទូទៅ)</option>
                        <option value="ព្នង">ជនជាតិដើម ព្នង</option>
                        <option value="ទំពួន">ជនជាតិដើម ទំពួន</option>
                        <option value="គ្រឹង">ជនជាតិដើម គ្រឹង</option>
                        <option value="ព្រៅ">ជនជាតិដើម ព្រៅ</option>
                        <option value="កួយ">ជនជាតិដើម កួយ</option>
                        <option value="ចារាយ">ជនជាតិដើម ចារាយ</option>
                        <option value="កាចក់">ជនជាតិដើម កាចក់</option>
                        <option value="ផ្សេងៗ">ជនជាតិដើមភាគតិចផ្សេងៗ</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">លេខទូរសព្ទអាណាព្យាបាល</label>
                    <input
                      type="text"
                      placeholder="012 345 678"
                      value={newStudentPhone}
                      onChange={(e) => setNewStudentPhone(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">គណនីសិក្សា PLP</label>
                    <input
                      type="text"
                      placeholder="visal.sok@plp.edu.kh"
                      value={newStudentPlp}
                      onChange={(e) => setNewStudentPlp(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-bold text-slate-700">លេខកូដសម្ងាត់ (PIN)</label>
                      <button
                        type="button"
                        onClick={() => setNewStudentPin(Math.floor(1000 + Math.random() * 9000).toString())}
                        className="text-[10px] text-indigo-600 font-bold hover:underline"
                      >
                        🎲 ចៃដន្យ
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="1234"
                      value={newStudentPin}
                      onChange={(e) => setNewStudentPin(e.target.value.replace(/\s+/g, '').slice(0, 8))}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-indigo-50/30 font-mono tracking-wider text-indigo-900 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold text-slate-700">រូបថតសិស្ស (Student Photo / Avatar)</label>
                    {newStudentAvatar && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> បានភ្ជាប់រូបភាព
                      </span>
                    )}
                  </div>
                  
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center gap-3">
                      {/* Photo Preview */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-white shrink-0 flex items-center justify-center relative shadow-xs">
                        {newStudentAvatar ? (
                          <>
                            <img
                              src={newStudentAvatar}
                              alt="Student"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setNewStudentAvatar('')}
                              title="លុបរូបថតចេញ"
                              className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition active:scale-95"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-1 text-slate-400">
                            <Smartphone className="w-5 h-5 mx-auto mb-0.5 text-slate-400" />
                            <span className="text-[9px] font-bold block leading-none">គ្មានរូប</span>
                          </div>
                        )}
                      </div>

                      {/* Upload from Mobile / PC / Camera buttons */}
                      <div className="flex-1 space-y-1.5">
                        <p className="text-[11px] text-slate-500 font-medium leading-tight">
                          ជ្រើសរើសរូបថតផ្ទាល់ពីទូរស័ព្ទដៃ ថតរូបតាមកាមេរ៉ា ឬបញ្ចូលតំណភ្ជាប់ URL
                        </p>

                        <input
                          ref={addStudentFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadStudentAvatar(file, 'new');
                            if (e.target) e.target.value = '';
                          }}
                        />
                        <input
                          ref={addStudentCameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadStudentAvatar(file, 'new');
                            if (e.target) e.target.value = '';
                          }}
                        />

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isUploadingStudentPhoto}
                            onClick={() => addStudentFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploadingStudentPhoto ? 'កំពុងដំណើរការ...' : 'ជ្រើសរូបពីទូរស័ព្ទ/PC'}</span>
                          </button>

                          <button
                            type="button"
                            disabled={isUploadingStudentPhoto}
                            onClick={() => addStudentCameraInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>ថតរូបភ្លាមៗ</span>
                          </button>

                          {newStudentAvatar && (
                            <button
                              type="button"
                              onClick={() => setNewStudentAvatar('')}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition flex items-center gap-1 active:scale-95"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>លុបរូប</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* URL Input option */}
                    <div className="pt-1">
                      <input
                        type="url"
                        placeholder="ឬ បិទភ្ជាប់តំណភ្ជាប់ URL រូបភាព (https://...)"
                        value={newStudentAvatar}
                        onChange={(e) => setNewStudentAvatar(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-[11px] font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentOpen(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-md shadow-blue-500/20 transition"
                  >
                    រក្សាទុក
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {isEditStudentOpen && editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-2xl shadow-2xl space-y-5 border border-slate-100 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-blue-600" />
                  <span>កែប្រែប្រវត្តិរូបសិស្ស</span>
                </h3>
                <button
                  onClick={() => setIsEditStudentOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateStudentSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">គោត្តនាម និងនាម (Khmer Name) *</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ឈ្មោះឡាតាំង (Latin Name)</label>
                    <input
                      type="text"
                      value={editingStudent.latinName || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, latinName: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">អត្តលេខ SIS</label>
                    <input
                      type="text"
                      value={editingStudent.civilId || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, civilId: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ភេទ</label>
                    <select
                      value={editingStudent.gender}
                      onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value as 'ប្រុស' | 'ស្រី' })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    >
                      <option value="ប្រុស">ប្រុស</option>
                      <option value="ស្រី">ស្រី</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ថ្ងៃខែឆ្នាំកំណើត</label>
                    <input
                      type="date"
                      value={editingStudent.dob || '2016-01-01'}
                      onChange={(e) => setEditingStudent({ ...editingStudent, dob: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ទីកន្លែងកំណើត</label>
                    <input
                      type="text"
                      value={editingStudent.pob || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, pob: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ទីលំនៅបច្ចុប្បន្ន (Address)</label>
                    <input
                      type="text"
                      value={editingStudent.address || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Parent info */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">ព័ត៌មានឪពុកម្តាយ និងអាណាព្យាបាល</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">ឪពុកឈ្មោះ</label>
                      <input
                        type="text"
                        value={editingStudent.fatherName || ''}
                        onChange={(e) => setEditingStudent({ ...editingStudent, fatherName: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">មុខរបរឪពុក</label>
                      <input
                        type="text"
                        value={editingStudent.fatherJob || ''}
                        onChange={(e) => setEditingStudent({ ...editingStudent, fatherJob: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">ម្តាយឈ្មោះ</label>
                      <input
                        type="text"
                        value={editingStudent.motherName || ''}
                        onChange={(e) => setEditingStudent({ ...editingStudent, motherName: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">មុខរបរម្តាយ</label>
                      <input
                        type="text"
                        value={editingStudent.motherJob || ''}
                        onChange={(e) => setEditingStudent({ ...editingStudent, motherJob: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ស្ថានភាពគ្រួសារ</label>
                    <select
                      value={editingStudent.familyStatus || 'ទូទៅ'}
                      onChange={(e) => setEditingStudent({ ...editingStudent, familyStatus: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    >
                      <option value="ទូទៅ">ទូទៅ (គ្រួសារធម្មតា)</option>
                      <option value="ក្រ១">ក្រ១ (ក្រីក្រកម្រិត១ - ប័ណ្ណសមធម៌)</option>
                      <option value="ក្រ២">ក្រ២ (ក្រីក្រកម្រិត២ - ប័ណ្ណសមធម៌)</option>
                      <option value="ងាយរងគ្រោះ">ងាយរងគ្រោះ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">សម្គាល់ (Note)</label>
                    <input
                      type="text"
                      value={editingStudent.note || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, note: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* MoEYS PRI & Repeating Status Section */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-700" />
                      <h5 className="font-black text-indigo-950 text-xs">
                        ស្ថានភាពសិក្សា & ស្ថិតិ MoEYS PRI
                      </h5>
                    </div>
                    <span className="text-[10px] text-indigo-800 font-bold bg-indigo-200/70 px-2 py-0.5 rounded-full">
                      📊 ស៊ីគ្នានឹងទម្រង់ស្ថិតិ PRI
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      ស្ថានភាពឡើងថ្នាក់ / ត្រួតថ្នាក់ (MoEYS PRI):
                    </label>
                    {(() => {
                      const isRep = editingStudent.isRepeating ?? ((editingStudent.note || '').includes('ត្រួតថ្នាក់') || (editingStudent.familyStatus || '').includes('ត្រួតថ្នាក់'));
                      return (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const noteClean = (editingStudent.note || '').replace(/ត្រួតថ្នាក់|រៀនឡើងវិញ/g, '').trim() || 'នៅរស់';
                              setEditingStudent({
                                ...editingStudent,
                                isRepeating: false,
                                note: noteClean,
                              });
                            }}
                            className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition cursor-pointer ${
                              !isRep
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span>🌟 សិស្សថ្មី / ឡើងថ្នាក់</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = editingStudent.note || '';
                              const updatedNote = cur && cur !== 'នៅរស់'
                                ? (cur.includes('ត្រួតថ្នាក់') ? cur : `${cur} ត្រួតថ្នាក់`)
                                : 'ត្រួតថ្នាក់';
                              setEditingStudent({
                                ...editingStudent,
                                isRepeating: true,
                                note: updatedNote,
                              });
                            }}
                            className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition cursor-pointer ${
                              isRep
                                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span>🔁 សិស្សត្រួតថ្នាក់</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        ពិការភាព / ការលំបាកពិសេស (PRI តារាងទី៣)
                      </label>
                      <select
                        value={editingStudent.disabilityType || 'គ្មាន'}
                        onChange={(e) => setEditingStudent({ ...editingStudent, disabilityType: e.target.value === 'គ្មាន' ? undefined : e.target.value })}
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="គ្មាន">គ្មាន (សិស្សទូទៅ)</option>
                        <option value="ពិបាកមើល">ពិបាកមើល (គំហើញ/ភ្នែក)</option>
                        <option value="ពិបាកស្តាប់">ពិបាកស្តាប់ (សោតវិញ្ញាណ/ត្រចៀក)</option>
                        <option value="ពិបាកនិយាយ">ពិបាកនិយាយ (ការបញ្ចេញសំឡេង)</option>
                        <option value="ពិបាកធ្វើចលនា">ពិបាកធ្វើចលនា (ដៃ/ជើង/កាយសម្បទា)</option>
                        <option value="ពិការសតិបញ្ញា">ពិការសតិបញ្ញា / រៀនយឺត</option>
                        <option value="ពិការផ្លូវចិត្ត">ពិការផ្លូវចិត្ត / អូទីសឹម</option>
                        <option value="ពិការសរីរាង្គខាងក្នុង">ពិការសរីរាង្គខាងក្នុង</option>
                        <option value="ពិការផ្សេងៗ">ពិការភាពផ្សេងៗ</option>
                        <option value="កុមារកំព្រា">កុមារកំព្រា</option>
                        <option value="កុមារងាយរងគ្រោះ">កុមារងាយរងគ្រោះ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        ជនជាតិដើមភាគតិច (PRI តារាងទី៤)
                      </label>
                      <select
                        value={editingStudent.indigenousEthnicity || 'គ្មាន'}
                        onChange={(e) => setEditingStudent({ ...editingStudent, indigenousEthnicity: e.target.value === 'គ្មាន' ? undefined : e.target.value })}
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="គ្មាន">គ្មាន (ជនជាតិខ្មែរទូទៅ)</option>
                        <option value="ព្នង">ជនជាតិដើម ព្នង</option>
                        <option value="ទំពួន">ជនជាតិដើម ទំពួន</option>
                        <option value="គ្រឹង">ជនជាតិដើម គ្រឹង</option>
                        <option value="ព្រៅ">ជនជាតិដើម ព្រៅ</option>
                        <option value="កួយ">ជនជាតិដើម កួយ</option>
                        <option value="ចារាយ">ជនជាតិដើម ចារាយ</option>
                        <option value="កាចក់">ជនជាតិដើម កាចក់</option>
                        <option value="ផ្សេងៗ">ជនជាតិដើមភាគតិចផ្សេងៗ</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">លេខទូរសព្ទអាណាព្យាបាល</label>
                    <input
                      type="text"
                      value={editingStudent.parentPhone || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">គណនីសិក្សា PLP</label>
                    <input
                      type="text"
                      value={editingStudent.plpAccount || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, plpAccount: e.target.value })}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-bold text-slate-700">លេខកូដសម្ងាត់ (PIN)</label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingStudent({
                            ...editingStudent,
                            pin: Math.floor(1000 + Math.random() * 9000).toString(),
                          })
                        }
                        className="text-[10px] text-indigo-600 font-bold hover:underline"
                      >
                        🎲 ចៃដន្យ
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="1234"
                      value={editingStudent.pin || '1234'}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          pin: e.target.value.replace(/\s+/g, '').slice(0, 8),
                        })
                      }
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-indigo-50/30 font-mono tracking-wider text-indigo-900 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold text-slate-700">រូបថតសិស្ស (Student Photo / Avatar)</label>
                    {editingStudent.avatar && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> មានរូបថត
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center gap-3">
                      {/* Photo Preview */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-white shrink-0 flex items-center justify-center relative shadow-xs">
                        {editingStudent.avatar ? (
                          <>
                            <img
                              src={editingStudent.avatar}
                              alt={editingStudent.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setEditingStudent({ ...editingStudent, avatar: undefined })}
                              title="លុបរូបថតចេញ"
                              className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition active:scale-95"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-1 text-slate-400">
                            <Smartphone className="w-5 h-5 mx-auto mb-0.5 text-slate-400" />
                            <span className="text-[9px] font-bold block leading-none">គ្មានរូប</span>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex-1 space-y-1.5">
                        <p className="text-[11px] text-slate-500 font-medium leading-tight">
                          ជ្រើសរើសរូបថតផ្ទាល់ពីទូរស័ព្ទដៃ ថតរូបតាមកាមេរ៉ា ឬបញ្ចូលតំណភ្ជាប់ URL
                        </p>

                        <input
                          ref={editStudentFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadStudentAvatar(file, 'edit');
                            if (e.target) e.target.value = '';
                          }}
                        />
                        <input
                          ref={editStudentCameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadStudentAvatar(file, 'edit');
                            if (e.target) e.target.value = '';
                          }}
                        />

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isUploadingStudentPhoto}
                            onClick={() => editStudentFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploadingStudentPhoto ? 'កំពុងដំណើរការ...' : 'ជ្រើសរូបពីទូរស័ព្ទ/PC'}</span>
                          </button>

                          <button
                            type="button"
                            disabled={isUploadingStudentPhoto}
                            onClick={() => editStudentCameraInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>ថតរូបភ្លាមៗ</span>
                          </button>

                          {editingStudent.avatar && (
                            <button
                              type="button"
                              onClick={() => setEditingStudent({ ...editingStudent, avatar: undefined })}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition flex items-center gap-1 active:scale-95"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>លុបរូប</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* URL Input option */}
                    <div className="pt-1">
                      <input
                        type="url"
                        placeholder="ឬ បិទភ្ជាប់តំណភ្ជាប់ URL រូបភាព (https://...)"
                        value={editingStudent.avatar || ''}
                        onChange={(e) => setEditingStudent({ ...editingStudent, avatar: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-[11px] font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => handlePrintSingleStudent(editingStudent)}
                    className="w-full sm:w-auto px-4 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-95 cursor-pointer shrink-0"
                    title="បោះពុម្ពជីវប្រវត្តិរូបសង្ខេបសិស្សម្នាក់នេះជាក្រដាស A4 ផ្លូវការ"
                  >
                    <Printer className="w-4 h-4 text-slate-950" />
                    <span>បោះពុម្ពប្រវត្តិរូប</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditStudentOpen(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-md shadow-blue-500/20 transition"
                  >
                    កែប្រែរួចរាល់
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Excel Import Modal */}
      <AnimatePresence>
        {isExcelImportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-3xl shadow-2xl space-y-5 border border-slate-100 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b pb-3.5 border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                      <span>នាំចូលសិស្សតាម Microsoft Excel Workbook (.xlsx / .xls)</span>
                    </h3>
                    <p className="text-xs text-slate-500">គាំទ្រទម្រង់ស្តង់ដាក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS 12 ជួរឈរ) និង WikiSchool</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExcelImportOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                {/* Information and Template Download Bar */}
                <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                      💡 ឯកសារគំរូទម្រង់ស្តង់ដាក្រសួងអប់រំ (MoEYS Format):
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={downloadSampleExcelWorkbook}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-xs flex items-center gap-1.5 transition active:scale-95"
                      >
                        <FileDown className="w-3.5 h-3.5" /> ទាញយកគំរូ Excel (.xlsx)
                      </button>
                      <button
                        type="button"
                        onClick={downloadSampleCSV}
                        className="bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1 transition"
                      >
                        ⬇️ CSV Template
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const { students: parsed, meta } = parseStudentsCSV(SAMPLE_MOEYS_39_STUDENTS_CSV, 0);
                          setExcelPreviewStudents(parsed);
                          setExcelMetaInfo(meta);
                          setUploadedFileName('គំរូសិស្ស_៣៩នាក់_ថ្នាក់៦A.xlsx');
                          setExcelText('');
                          onShowToast('បានផ្ទុកទិន្នន័យគំរូ ៣៩ នាក់រួចរាល់!');
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-xs flex items-center gap-1 transition active:scale-95"
                      >
                        ⚡ ផ្ទុកគំរូ ៣៩ នាក់ (ថ្នាក់ ៦A)
                      </button>
                    </div>
                  </div>
                  <code className="block bg-white p-2.5 rounded-xl text-[10.5px] font-mono text-slate-700 border border-emerald-200 overflow-x-auto leading-relaxed">
                    ល.រ, គោត្តនាម នាម, ភេទ, ថ្ងៃខែឆ្នាំកំណើត, ទីកន្លែងកំណើត, ឪពុកឈ្មោះ, មុខរបរ, ម្តាយឈ្មោះ, មុខរបរ, ទីលំនៅបច្ចុប្បន្ន, ស្ថានភាពគ្រួសារ, សម្គាល់
                  </code>
                </div>

                {/* Upload File Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70 transition p-5 rounded-2xl text-center space-y-2 cursor-pointer relative"
                >
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv,.txt,.tsv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 bg-white rounded-2xl text-emerald-600 flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
                    {excelLoading ? (
                      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FileSpreadsheet className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      {uploadedFileName ? (
                        <span className="text-emerald-700">📄 ឯកសារដែលបានជ្រើស៖ {uploadedFileName}</span>
                      ) : (
                        'ចុចទីនេះដើម្បីជ្រើសរើស ឬទម្លាក់ឯកសារ Excel Workbook (.xlsx / .xls) ឬ CSV'
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      គាំទ្រឯកសារ Microsoft Excel (.xlsx, .xls) និង CSV ទាំងអស់
                    </p>
                  </div>
                </div>

                {/* Preview Section if students extracted */}
                {excelPreviewStudents.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          អានបានជោគជ័យ
                        </span>
                        <span className="font-extrabold text-slate-800 text-xs">
                          រកឃើញសិស្សចំនួន {excelPreviewStudents.length} នាក់
                          (ស្រី: {excelPreviewStudents.filter(s => s.gender === 'ស្រី').length} នាក់)
                        </span>
                      </div>
                      {excelMetaInfo.grade && (
                        <span className="text-purple-700 font-bold text-xs bg-purple-100 px-2 py-0.5 rounded-lg">
                          {excelMetaInfo.grade}
                        </span>
                      )}
                    </div>

                    <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold">
                          <tr>
                            <th className="p-2 text-center w-10">ល.រ</th>
                            <th className="p-2">គោត្តនាម នាម</th>
                            <th className="p-2 text-center">ភេទ</th>
                            <th className="p-2">ថ្ងៃកំណើត</th>
                            <th className="p-2">ឪពុក/ម្តាយ</th>
                            <th className="p-2">ទីលំនៅ</th>
                            <th className="p-2 text-center">ស្ថានភាព</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {excelPreviewStudents.slice(0, 10).map((s, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 text-center font-mono text-slate-500">{s.rollNo || idx + 1}</td>
                              <td className="p-2 font-bold text-slate-900">{s.name}</td>
                              <td className="p-2 text-center">
                                <span className={s.gender === 'ស្រី' ? 'text-pink-600 font-bold' : 'text-blue-600 font-bold'}>
                                  {s.gender}
                                </span>
                              </td>
                              <td className="p-2 font-mono text-slate-600">{s.dob}</td>
                              <td className="p-2 text-slate-600">{s.fatherName || s.motherName || '-'}</td>
                              <td className="p-2 text-slate-500 truncate max-w-[150px]">{s.address || '-'}</td>
                              <td className="p-2 text-center">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  s.familyStatus?.includes('ក្រ១')
                                    ? 'bg-rose-100 text-rose-700'
                                    : s.familyStatus?.includes('ក្រ២')
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {s.familyStatus || 'ទូទៅ'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {excelPreviewStudents.length > 10 && (
                        <div className="p-2 text-center text-slate-500 text-[11px] bg-slate-50 border-t border-slate-100">
                          ... និងសិស្សចំនួន {excelPreviewStudents.length - 10} នាក់ផ្សេងទៀត
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Or Direct Paste Area */}
                {excelPreviewStudents.length === 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800">ឬចម្លងបិទភ្ជាប់អត្ថបទ (Paste Text directly):</span>
                    <textarea
                      rows={4}
                      placeholder={`ល.រ,គោត្តនាម នាម,ភេទ,ថ្ងៃខែឆ្នាំកំណើត,ទីកន្លែងកំណើត,ឪពុកឈ្មោះ,មុខរបរ,ម្តាយឈ្មោះ,មុខរបរ,ទីលំនៅបច្ចុប្បន្ន,ស្ថានភាពគ្រួសារ,សម្គាល់
1,នួន ស្រីរ័ត្ន,ស្រី,13/07/2013,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ខុយ វ៉ាន់នី,កសិករ,វ៉ា ស្រីមុំ,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ១,នៅរស់`}
                      value={excelText}
                      onChange={(e) => setExcelText(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl p-3.5 text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                )}

                {/* Import Mode: Append vs Replace */}
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-700">ជម្រើសនាំចូល:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={!importReplaceAll}
                      onChange={() => setImportReplaceAll(false)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-700 font-semibold">បន្ថែមបន្តពីលើ (Append)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importReplaceAll}
                      onChange={() => setImportReplaceAll(true)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-rose-700">ជំនួសបញ្ជីសិស្សចាស់ទាំងអស់ (Replace All)</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setExcelPreviewStudents([]);
                      setUploadedFileName('');
                      setExcelText('');
                      setIsExcelImportOpen(false);
                    }}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="button"
                    onClick={handleExcelImportSubmit}
                    disabled={excelLoading || (excelPreviewStudents.length === 0 && !excelText.trim())}
                    className={`flex-1 py-3 text-white rounded-2xl font-bold shadow-md transition flex items-center justify-center gap-2 ${
                      excelLoading || (excelPreviewStudents.length === 0 && !excelText.trim())
                        ? 'bg-slate-400 cursor-not-allowed opacity-60'
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 active:scale-95'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    {excelPreviewStudents.length > 0
                      ? `បញ្ជាក់នាំចូលសិស្ស (${excelPreviewStudents.length} នាក់)`
                      : 'ផ្ទៀងផ្ទាត់ និងនាំចូលសិស្ស'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Logbook Modal */}
      <AnimatePresence>
        {isAddLogbookOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-md shadow-2xl space-y-5 border border-slate-100"
            >
              <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-purple-900" />
                  <span>កត់ត្រាសៀវភៅ Logbook គ្រូបង្រៀន</span>
                </h3>
                <button
                  onClick={() => setIsAddLogbookOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateLogbook} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">មុខវិជ្ជា</label>
                  <select
                    value={newLogSubject}
                    onChange={(e) => setNewLogSubject(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none bg-slate-50/50"
                  >
                    <option value="ភាសាខ្មែរ">ភាសាខ្មែរ</option>
                    <option value="គណិតវិទ្យា">គណិតវិទ្យា</option>
                    <option value="វិទ្យាសាស្ត្រ">វិទ្យាសាស្ត្រ</option>
                    <option value="សិក្សាសង្គម">សិក្សាសង្គម</option>
                    <option value="កាយអប់រំ">កាយអប់រំ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">ចំណងជើងមេរៀន / សកម្មភាពជាក់ស្តែង</label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. ការអានអត្ថបទ និងការផ្សំខ្យល់..."
                    value={newLogTopic}
                    onChange={(e) => setNewLogTopic(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">កត់សម្គាល់ (លទ្ធផលបង្រៀន & មូលហេតុយឺតយ៉ាវប្រសិនបើមាន)</label>
                  <textarea
                    rows={3}
                    placeholder="សិស្សភាគច្រើនយល់បានល្អ..."
                    value={newLogNote}
                    onChange={(e) => setNewLogNote(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddLogbookOpen(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl font-bold shadow-md shadow-purple-900/20 transition"
                  >
                    រក្សាទុក
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Inventory Modal */}
      <AnimatePresence>
        {isAddInventoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-md shadow-2xl space-y-5 border border-slate-100"
            >
              <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Box className="w-5 h-5 text-amber-600" />
                  <span>បន្ថែមសម្ភារថ្នាក់រៀន</span>
                </h3>
                <button
                  onClick={() => setIsAddInventoryOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateInventory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">ឈ្មោះសម្ភារ (តុ, កៅអី, ក្តារខៀន, កង្ហារ...)</label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. កង្ហារដំបូលថ្នាក់..."
                    value={newInvName}
                    onChange={(e) => setNewInvName(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ចំនួន (Qty)</label>
                    <input
                      type="number"
                      min={1}
                      value={newInvQty}
                      onChange={(e) => setNewInvQty(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ស្ថានភាព</label>
                    <select
                      value={newInvCondition}
                      onChange={(e) =>
                        setNewInvCondition(e.target.value as 'ល្អ' | 'មធ្យម' | 'ខូច/ត្រូវជួសជុល')
                      }
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                    >
                      <option value="ល្អ">ល្អ</option>
                      <option value="មធ្យម">មធ្យម</option>
                      <option value="ខូច/ត្រូវជួសជុល">ខូច/ត្រូវជួសជុល</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddInventoryOpen(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold shadow-md shadow-amber-600/20 transition"
                  >
                    រក្សាទុក
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Inventory Modal */}
      <AnimatePresence>
        {isEditInventoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-md shadow-2xl space-y-5 border border-slate-100"
            >
              <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Box className="w-5 h-5 text-amber-600" />
                  <span>កែសម្រួលសម្ភារថ្នាក់រៀន</span>
                </h3>
                <button
                  onClick={() => setIsEditInventoryOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editingInventory || !editInvName.trim()) return;
                  onUpdateInventory({
                    ...editingInventory,
                    name: editInvName.trim(),
                    qty: Number(editInvQty) || 1,
                    condition: editInvCondition,
                    category: editInvCategory.trim() || 'សម្ភារថ្នាក់រៀន',
                  });
                  setIsEditInventoryOpen(false);
                  onShowToast('បានកែប្រែព័ត៌មានសារពើភណ្ឌជោគជ័យ!');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">ប្រភេទ/ក្រុមសម្ភារ</label>
                  <input
                    type="text"
                    required
                    value={editInvCategory}
                    onChange={(e) => setEditInvCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">ឈ្មោះសម្ភារ</label>
                  <input
                    type="text"
                    required
                    value={editInvName}
                    onChange={(e) => setEditInvName(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ចំនួន (Qty)</label>
                    <input
                      type="number"
                      min={1}
                      value={editInvQty}
                      onChange={(e) => setEditInvQty(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ស្ថានភាព</label>
                    <select
                      value={editInvCondition}
                      onChange={(e) =>
                        setEditInvCondition(e.target.value as 'ល្អ' | 'មធ្យម' | 'ខូច/ត្រូវជួសជុល')
                      }
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                    >
                      <option value="ល្អ">ល្អ</option>
                      <option value="មធ្យម">មធ្យម</option>
                      <option value="ខូច/ត្រូវជួសជុល">ខូច/ត្រូវជួសជុល</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditInventoryOpen(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold shadow-md shadow-amber-600/20 transition"
                  >
                    រក្សាទុកការកែប្រែ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PLC Meeting Edit & Full Detail Modal */}
      <PLCMeetingModal
        isOpen={isPLCModalOpen}
        onClose={() => {
          setIsPLCModalOpen(false);
          setSelectedPLCMeeting(null);
        }}
        meeting={selectedPLCMeeting}
        teacher={teacher}
        onSaveMeeting={(meeting) => {
          onSavePLC(meeting);
          setIsPLCModalOpen(false);
          setSelectedPLCMeeting(null);
        }}
        onShowToast={onShowToast}
        initialFontFamily={fontFamily}
        initialTheme={backgroundTheme}
        initialFontSizeScale={fontSizeScale}
      />

      {/* Official Grade & Attendance PDF Report Modal */}
      <OfficialGradeReportModal
        isOpen={isOfficialReportOpen}
        onClose={() => setIsOfficialReportOpen(false)}
        teacher={teacher}
        students={students}
        grades={grades}
        attendance={attendance}
        onShowToast={onShowToast}
      />

      {/* Classroom Rules A4 Print & Edit Modal */}
      <ClassroomRulesPrintModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        teacher={teacher}
        rules={classroomRules}
        onUpdateRules={setClassroomRules}
      />

      {/* Classroom Decoration & Food Safety 5 Keys Print Modal */}
      <ClassroomDecorationPrintModal
        isOpen={isDecorationModalOpen}
        onClose={() => setIsDecorationModalOpen(false)}
        teacher={teacher}
      />

      {/* Classroom Rules PDF Customizer Modal */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        return (
          <PdfCustomizerModal
            isOpen={isRulesPdfModalOpen}
            onClose={() => setIsRulesPdfModalOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន"
            initialHeader={{
              docTitle: 'បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន',
              docSubtitle: `បទដ្ឋានរួមដែលគ្រូ និងសិស្សព្រមព្រៀងគ្នា ឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី'
            }}
            customTableHtml={`
              <div style="font-family: inherit; font-size: 11pt; color: #1e293b; line-height: 1.6;">
                <div style="margin-bottom: 14px; font-weight: 600; text-indent: 20px;">
                  យោងតាមសំណូមពរ និងការសម្រេចឯកភាពគ្នារវាងលោកគ្រូ អ្នកគ្រូ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ថ្នាក់ទី <b>${teacher.grade || 'ថ្នាក់ទី ៤A'}</b> នៃ <b>${teacher.school || 'សាលាបឋមសិក្សាគំរូ'}</b> បានដាក់ចេញនូវ <b>«បទបញ្ជាផ្ទៃក្នុង»</b> សម្រាប់អនុវត្តដូចតទៅ៖
                </div>
                <div style="margin-bottom: 15px;">
                  ${classroomRules.map((rule) => `
                    <div style="display: flex; align-items: flex-start; margin-bottom: 10px; page-break-inside: avoid;">
                      <div style="font-weight: 700; min-width: 85px; color: #1e1b4b;">${rule.title} ៖</div>
                      <div style="flex: 1; text-align: justify;">${rule.description}</div>
                    </div>
                  `).join('')}
                </div>
                <div style="margin-top: 15px; font-style: italic; font-size: 10pt; text-align: center; page-break-inside: avoid;">
                  សិស្សទាំងអស់ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ត្រូវអាន យល់ដឹង និងអនុវត្តតាមបទបញ្ជាផ្ទៃក្នុងនេះឱ្យបានខ្ជាប់ខ្ជួន។
                </div>
              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* Classroom Inventory PDF Customizer Modal */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        return (
          <PdfCustomizerModal
            isOpen={isInventoryPdfModalOpen}
            onClose={() => setIsInventoryPdfModalOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF បញ្ជីសារពើភណ្ឌថ្នាក់រៀន"
            initialHeader={{
              docTitle: 'បញ្ជីសារពើភណ្ឌសម្ភារឧបទេស និងទ្រព្យសម្បត្តិថ្នាក់រៀន',
              docSubtitle: `ស្ថិតិ និងស្ថានភាពសម្ភារប្រើប្រាស់ក្នុងថ្នាក់ ឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី'
            }}
            customTableHtml={`
              <div style="font-family: inherit; font-size: 10pt; color: #1e293b;">
                <div style="margin-bottom: 12px; font-weight: bold;">
                  បញ្ជីរាយនាមសម្ភារ តុ កៅអី ក្តារខៀន កង្ហារ អំពូលភ្លើង និងសម្ភារឧបទេសប្រចាំថ្នាក់ទី <b>${teacher.grade || 'ថ្នាក់ទី ៤A'}</b>៖
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                  <thead>
                    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 45px;">ល.រ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">ឈ្មោះសម្ភារ / ប្រភេទ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 100px;">ប្រភេទ / ក្រុម</th>
                      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 70px;">បរិមាណ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 110px;">ស្ថានភាព</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${inventory.map((item, idx) => `
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${idx + 1}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold;">${item.name}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${item.category}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold;">${item.qty}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold; color: ${item.condition === 'ល្អ' ? '#047857' : item.condition === 'មធ្យម' ? '#b45309' : '#b91c1c'};">${item.condition}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>

              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* PLC Meeting Minutes PDF Customizer Modal */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        const targetMeeting = selectedPlcPdfMeeting || plc[0] || {
          id: 1,
          date: '២០២៦-០៨-២៥',
          topic: 'កែលម្អវិធីសាស្ត្របង្រៀនគណិតវិទ្យា (ការបូកដកលេខធំ)',
          attendees: 'លោកគ្រូ អ្នកគ្រូបឋមសិក្សា (៨នាក់)',
          issues: 'សិស្សជួបការលំបាកក្នុងការគណនាបូកដកមានត្រាទុក និងការដោះស្រាយចំណោទ',
          decision: 'ប្រើប្រាស់សម្ភារឧបទេសរូបភាព និងបច្ចេកទេសល្បែងសិក្សាពង្រឹងការចងចាំ'
        };

        return (
          <PdfCustomizerModal
            isOpen={isPlcPdfModalOpen}
            onClose={() => setIsPlcPdfModalOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF កំណត់ហេតុកិច្ចប្រជុំបច្ចេកទេស (PLC)"
            initialHeader={{
              docTitle: 'កំណត់ហេតុកិច្ចប្រជុំបច្ចេកទេស (PLC)',
              docSubtitle: `ការប្រជុំអភិវឌ្ឍវិជ្ជាជីវៈគ្រូបង្រៀនប្រចាំកម្រិតថ្នាក់ ឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី'
            }}
            customTableHtml={`
              <div style="font-family: inherit; font-size: 10pt; color: #1e293b; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 16px;">
                  <h3 style="font-family: 'Moul', cursive; font-size: 12pt; color: #1e1b4b; margin: 0 0 6px 0;">កំណត់ហេតុកិច្ចប្រជុំបច្ចេកទេស (PLC)</h3>
                  <div style="font-size: 10.5pt; font-weight: bold; color: #334155;">ប្រធានបទ៖ ${targetMeeting.topic}</div>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9.5pt;">
                    <div><b>កាលបរិច្ឆេទប្រជុំ ៖</b> ${targetMeeting.date}</div>
                    <div><b>កម្រិតថ្នាក់ / ក្រុម ៖</b> ${teacher.grade || 'កម្រិតបឋមសិក្សា'}</div>
                    <div><b>ទីកន្លែងប្រជុំ ៖</b> បន្ទប់ប្រជុំបច្ចេកទេស ${teacher.school || 'សាលាបឋមសិក្សា'}</div>
                    <div><b>អ្នកសម្របសម្រួល ៖</b> ${teacher.name || 'ប្រធានក្រុមបច្ចេកទេស'}</div>
                  </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                  <tbody>
                    <tr>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; width: 140px; background-color: #f1f5f9; font-weight: bold;">
                        ១. សមាសភាពចូលរួម
                      </td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px;">
                        ${targetMeeting.attendees}
                      </td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; background-color: #f1f5f9; font-weight: bold;">
                        ២. បញ្ហាប្រឈមពិភាក្សា
                      </td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; line-height: 1.6;">
                        ${targetMeeting.issues}
                      </td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; background-color: #f1f5f9; font-weight: bold;">
                        ៣. ដំណោះស្រាយ និងវិធីសាស្ត្រ
                      </td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; line-height: 1.6;">
                        • ពិភាក្សាផ្លាស់ប្តូរបទពិសោធន៍បង្រៀនជាក់ស្តែងក្នុងថ្នាក់រៀន<br/>
                        • ផលិត និងច្នៃប្រឌិតសម្ភារឧបទេសបង្រៀនបន្ថែម<br/>
                        • រៀបចំសកម្មភាពបង្រៀនជាក្រុម និងបំប៉នសិស្សរៀនយឺត
                      </td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; background-color: #f1f5f9; font-weight: bold;">
                        ៤. លទ្ធផលសម្រេច & ទិសដៅ
                      </td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; font-weight: bold; color: #047857; line-height: 1.6;">
                        ${targetMeeting.decision}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style="margin-top: 14px; font-size: 9.5pt; color: #334155;">
                  <b>ទិសដៅអនុវត្តបន្ត៖</b> លោកគ្រូ-អ្នកគ្រូទាំងអស់បានឯកភាពយកវិធីសាស្ត្រដែលបានសម្រេចខាងលើទៅអនុវត្តជាក់ស្តែងក្នុងថ្នាក់រៀន និងតាមដានលទ្ធផលដើម្បីរាយការណ៍ក្នុងកិច្ចប្រជុំលើកក្រោយ។
                </div>
              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* Teacher-Parent Agreement PDF Customizer Modal */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥-២០២៦';
        return (
          <PdfCustomizerModal
            isOpen={isParentAgreementPdfModalOpen}
            onClose={() => setIsParentAgreementPdfModalOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF កិច្ចព្រមព្រៀងរវាងគ្រូ និងមាតាបិតាសិស្ស"
            initialHeader={{
              docTitle: 'កិច្ចព្រមព្រៀងរវាងគ្រូបង្រៀន និងមាតាបិតា អាណាព្យាបាលសិស្ស',
              docSubtitle: `ស្តីពីលទ្ធផលសិក្សារបស់សិស្សឈ្មោះ កៀត រ៉ាមី ភេទ ប ថ្នាក់ទី ៦(ក) ឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាអូរឫស្សីកណ្តាល',
              teacherName: teacher.name || 'ឌុក សុភ័ក្ត្រ',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៦(ក)',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តស្ទឹងត្រែង'
            }}
            customTableHtml={`
              <div style="font-family: 'Siemreap', sans-serif; font-size: 10pt; color: #1e293b; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h3 style="font-family: 'Moul', cursive; font-size: 13pt; color: #1e1b4b; margin: 0 0 8px 0;">កិច្ចព្រមព្រៀង</h3>
                  <div style="font-size: 10.5pt; font-weight: bold; color: #334155; margin-bottom: 6px;">រវាង</div>
                  <div style="font-size: 11pt; font-weight: bold; color: #047857; margin-bottom: 6px;">គ្រូបង្រៀន</div>
                  <div style="font-size: 10.5pt; font-weight: bold; color: #334155; margin-bottom: 6px;">និង</div>
                  <div style="font-size: 11pt; font-weight: bold; color: #1e1b4b; margin-bottom: 10px;">មាតាបិតា អ្នកអាណាព្យាបាលសិស្ស</div>
                  <div style="font-size: 10.5pt; font-weight: bold; color: #334155;">ស្តីពី</div>
                  <h4 style="font-size: 11pt; font-weight: bold; color: #b91c1c; margin: 6px 0 10px 0;">លទ្ធផលសិក្សារបស់សិស្សឈ្មោះ៖ កៀត រ៉ាមី ភេទ ប ថ្នាក់ទី ៦(ក)</h4>
                  <div style="font-size: 10pt; font-weight: bold; color: #334155;">ឆ្នាំសិក្សា ${academicYear}</div>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 18px; font-size: 9.5pt; line-height: 1.8;">
                  <div><b>សាលារៀន៖</b> ${teacher.school || 'សាលាបឋមសិក្សាអូរឫស្សីកណ្តាល'} &nbsp;&nbsp;&nbsp;&nbsp; <b>ខេត្ត៖</b> ស្ទឹងត្រែង</div>
                  <div><b>ឈ្មោះមាតាបិតា៖</b> ឪពុក <b>សី កៀត</b> &nbsp;&nbsp;|&nbsp;&nbsp; ម្តាយ <b>យាយ សានីហាស់</b> &nbsp;&nbsp;&nbsp;&nbsp; <b>លេខទូរស័ព្ទ៖</b> 0883592346</div>
                  <div><b>ឈ្មោះគ្រូបន្ទុកថ្នាក់៖</b> <b>${teacher.name || 'ឌុក សុភ័ក្ត្រ'}</b> &nbsp;&nbsp;&nbsp;&nbsp; <b>លេខទូរស័ព្ទ៖</b> 0718036272</div>
                </div>

                <div style="margin-bottom: 16px; font-size: 9pt; background-color: #f1f5f9; padding: 8px 12px; border-radius: 6px;">
                  <b>កម្រិតចំណាត់ថ្នាក់និទ្ទេស៖</b> F (ក្រោម 5 ពិន្ទុ) | E (5-5.99) | D (6-6.99) | C (7-7.99) | B (8-8.99) | A (9-10)
                </div>

                <h4 style="font-family: 'Moul', cursive; font-size: 10.5pt; color: #1e1b4b; margin: 16px 0 8px 0;">លទ្ធផលរំពឹងទុកលើលទ្ធផលសិក្សារបស់សិស្សតាមមុខវិជ្ជា</h4>
                
                <div style="margin-bottom: 14px;">
                  <div style="font-weight: bold; font-size: 9.5pt; color: #047857; margin-bottom: 4px;">១) សិស្សទទួលបាននិទ្ទេសមុខវិជ្ជា៖ ភាសាខ្មែរ</div>
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 9pt; text-align: center;">
                    <thead>
                      <tr style="background-color: #f1f5f9;">
                        <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left;">និទ្ទេស</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">A</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">B</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">C</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">D</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">E</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">F</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">ដើមឆ្នាំ</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #e2e8f0;">✓</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">ត្រាំុចុងឆ្នាំ</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #e2e8f0;">✓</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">សម្រេចចុងឆ្នាំ</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #e2e8f0;">✓</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style="margin-bottom: 14px;">
                  <div style="font-weight: bold; font-size: 9.5pt; color: #047857; margin-bottom: 4px;">២) សិស្សទទួលបាននិទ្ទេសមុខវិជ្ជា៖ គណិតវិទ្យា</div>
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 9pt; text-align: center;">
                    <thead>
                      <tr style="background-color: #f1f5f9;">
                        <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left;">និទ្ទេស</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">A</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">B</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">C</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">D</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">E</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">F</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">ដើមឆ្នាំ</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #e2e8f0;">✓</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">ត្រាំុចុងឆ្នាំ</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #e2e8f0;">✓</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">សម្រេចចុងឆ្នាំ</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #e2e8f0;">✓</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style="margin-top: 14px;">
                  <h4 style="font-family: 'Moul', cursive; font-size: 10pt; color: #1e1b4b; margin: 0 0 6px 0;">ភារកិច្ចរបស់មាតាបិតា អាណាព្យាបាលសិស្ស៖</h4>
                  <div style="padding-left: 10px; line-height: 1.6; font-size: 9.5pt;">
                    ១. ត្រូវជួយបង្រៀន និងរឹកនំកូនធ្វើកិច្ចការផ្ទះ ដែលលោកគ្រូ អ្នកគ្រូបានដាក់ពីសាលារៀន។<br/>
                    ២. ត្រូវជួយឧបត្ថម្ភគាំទ្រកូនៗ ទាំងសម្ភារៈ និងស្មារតី ព្រមទាំងលើកទឹកចិត្តពួកគាត់បានរៀនទៀងទាត់ និងទាន់ពេលវេលាជារៀងរាល់ថ្ងៃ។<br/>
                    ៣. ទំនាក់ទំនងជាប្រចាំ និងចូលរួមប្រជុំប្រចាំខែជាមួយគ្រូបង្រៀន ដើម្បីផ្លាស់ប្តូរតាមដានការសិក្សារបស់កូន និងដោះស្រាយបញ្ហាខ្សោយថ្នាក់រៀនជួបប្រទះ។
                  </div>
                </div>

                <div style="margin-top: 14px;">
                  <h4 style="font-family: 'Moul', cursive; font-size: 10pt; color: #1e1b4b; margin: 0 0 6px 0;">ភារកិច្ចរបស់គ្រូបង្រៀន៖</h4>
                  <div style="padding-left: 10px; line-height: 1.6; font-size: 9.5pt;">
                    ១. រៀបចំកមមវិធីបង្រៀនបន្ថែម និងបង្រៀនសិស្សឱ្យសម្រេចតាមផែនការ និងទាន់កម្រិតសិក្សាថ្នាក់កំពុងរៀន។<br/>
                    ២. យកចិត្តទុកដាក់បង្រៀន និងតាមដានលទ្ធផលសិក្សារបស់សិស្សជារៀងរាល់ថ្ងៃសប្តាហ៍ខែ និងត្រីមាស។<br/>
                    ៣. ទំនាក់ទំនងជាមួយមាតាបិតា អាណាព្យាបាលសិស្សជាប្រចាំដើម្បីរៀបចំការដោះស្រាយបញ្ហារបស់សិស្ស និងត្រូវចាំបាច់សម្រាប់ដំណើរការថ្នាក់រៀនបានទាន់ពេលវេលា។
                  </div>
                </div>

                <div style="margin-top: 16px; background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 9.5pt; color: #047857;">
                  ភាគីទាំងពីរមានការឯកភាពក្នុងការជួយជំរុញ និងបំពេញភារកិច្ចរៀងៗខ្លួនៗ ដើម្បីសម្រេចឱ្យបាននូវលទ្ធផលសិក្សារបស់សិស្សតាមផែនការដែលបានរៀបចំទុកខាងលើ។
                </div>
              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* Teacher-Principal Agreement PDF Customizer Modal */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        return (
          <PdfCustomizerModal
            isOpen={isPrincipalAgreementPdfModalOpen}
            onClose={() => setIsPrincipalAgreementPdfModalOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF កិច្ចព្រមព្រៀងរវាងគ្រូ និងនាយកសាលា"
            initialHeader={{
              docTitle: 'កិច្ចព្រមព្រៀងការងារ និងការប្តេជ្ញាចិត្តវិជ្ជាជីវៈ (Teacher-Principal Agreement)',
              docSubtitle: `ការអនុវត្តការងារ និងការអភិវឌ្ឍវិជ្ជាជីវៈប្រចាំឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី',
              leftSignatureTitle: 'បានឃើញ និងឯកភាព\nនាយកសាលា',
              rightSignatureTitle: 'គ្រូបង្រៀនសាមីខ្លួន',
              rightSignatureName: teacher.name || '',
            }}
            customTableHtml={`
              <div style="font-family: inherit; font-size: 10pt; color: #1e293b; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 16px;">
                  <h3 style="font-family: 'Moul', cursive; font-size: 12pt; color: #1e1b4b; margin: 0 0 6px 0;">ព្រះរាជាណាចក្រកម្ពុជា</h3>
                  <div style="font-size: 10.5pt; font-weight: bold; color: #334155;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                  <div style="border-bottom: 2px solid #1e293b; width: 150px; margin: 8px auto 16px auto;"></div>
                  <h4 style="font-family: 'Moul', cursive; font-size: 11pt; color: #4c1d95; margin: 0 0 8px 0;">កិច្ចព្រមព្រៀងការងារ និងការប្តេជ្ញាចិត្តវិជ្ជាជីវៈ</h4>
                  <div style="font-size: 9.5pt; color: #64748b;">រវាងគណៈនាយកសាលា និងលោកគ្រូ/អ្នកគ្រូ ${teacher.name || '........................'}</div>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 9.5pt;">
                  កិច្ចព្រមព្រៀងនេះធ្វើឡើងរវាងគណៈនាយកសាលាបឋមសិក្សា <b>${teacher.school || 'គំរូ'}</b> និងលោកគ្រូ/អ្នកគ្រូ <b>${teacher.name || '..................'}</b> ក្នុងគោលបំណងធានានូវការអនុវត្តបទបញ្ជាផ្ទៃក្នុង ក្រមសីលធម៌វិជ្ជាជីវៈ និងការលើកកម្ពស់លទ្ធផលសិក្សារបស់សិស្ស។
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                  <tbody>
                    <tr>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; width: 180px; background-color: #f1f5f9; font-weight: bold;">
                        ១. ការប្តេជ្ញាចិត្តលើការបង្រៀន
                      </td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; line-height: 1.6;">
                        • គោរពពេលវេលាចេញ-ចូលបង្រៀន និងកាលវិភាគផ្លូវការឱ្យបានខ្ជាប់ខ្ជួន ១០០%。<br/>
                        • រៀបចំកិច្ចតែងការបង្រៀន (Lesson Plan) និងសម្ភារឧបទេសមុនពេលចូលថ្នាក់។<br/>
                        • យកចិត្តទុកដាក់បំប៉នសិស្សរៀនយឺត និងវាស់វែងលទ្ធផលសិក្សាទៀងទាត់។
                      </td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; background-color: #f1f5f9; font-weight: bold;">
                        ២. ការចូលរួមសកម្មភាព PLC & CPD
                      </td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; line-height: 1.6;">
                        • ចូលរួមកិច្ចប្រជុំគណៈកម្មការបច្ចេកទេស (PLC) ប្រចាំសប្តាហ៍ដោយសកម្ម។<br/>
                        • បំពេញក្រេឌីតអភិវឌ្ឍន៍វិជ្ជាជីវៈប្រចាំឆ្នាំ (CPD Credits) តាមការណែនាំរបស់ក្រសួង។<br/>
                        • ផ្លាស់ប្តូរបទពិសោធន៍បង្រៀនល្អៗជាមួយមិត្តរួមការងារ។
                      </td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; background-color: #f1f5f9; font-weight: bold;">
                        ៣. ការគ្រប់គ្រងរដ្ឋបាល & សីលធម៌
                      </td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; line-height: 1.6;">
                        • រក្សាសីលធម៌វិជ្ជាជីវៈខ្ពស់ ភាពស្មោះត្រង់ និងទំនាក់ទំនងល្អជាមួយសហគមន៍។<br/>
                        • ថែរក្សាសម្ភារឧបទេស និងទ្រព្យសម្បត្តិសាលារៀនក្នុងបន្ទប់រៀនឱ្យបានគត់មត់។<br/>
                        • អនុវត្តយ៉ាងខ្ជាប់ខ្ជួននូវបទបញ្ជាផ្ទៃក្នុងសាលារៀន។
                      </td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; background-color: #f1f5f9; font-weight: bold;">
                        ៤. ការគាំទ្រពីគណៈនាយក
                      </td>
                      <td style="border: 1px solid #cbd5e1; padding: 10px; font-weight: bold; color: #4c1d95; line-height: 1.6;">
                        • គណៈនាយកសាលានឹងផ្តល់កិច្ចសហការ សម្របសម្រួលបច្ចេកទេស និងលើកទឹកចិត្តដល់ការអនុវត្តការងាររបស់លោកគ្រូ-អ្នកគ្រូប្រកបដោយប្រសិទ្ធភាពខ្ពស់។
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* 1.1 Student Roster PDF Customizer Modal (A4 Landscape) */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        const femaleCount = students.filter(s => s.gender === 'ស្រី').length;
        const totalCount = students.length;
        const poorCount = students.filter(s => s.familyStatus === 'ក្រ១' || s.familyStatus === 'ក្រ២').length;

        return (
          <PdfCustomizerModal
            isOpen={isStudentsPdfModalOpen}
            onClose={() => setIsStudentsPdfModalOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF បញ្ជីរាយនាមសិស្ស (A4 Landscape)"
            initialHeader={{
              docTitle: 'បញ្ជីរាយនាមសិស្ស និងប្រវត្តិរូបសង្ខេប',
              docSubtitle: `ស្ថិតិ និងព័ត៌មានលម្អិតសិស្ស ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី',
              leftSignTitle: 'បានឃើញ និងឯកភាព\nនាយកសាលា',
              rightSignTitle: 'គ្រូបន្ទុកថ្នាក់'
            }}
            customTableHtml={`
              <div style="font-family: 'Siemreap', sans-serif; font-size: 8.5pt; color: #1e293b;">
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; margin-bottom: 10px; font-weight: bold; font-size: 8.5pt;">
                  <div>• សិស្សសរុប៖ <span style="color: #1e1b4b; font-weight: 800;">${totalCount}</span> នាក់ (ស្រី <span style="color: #be185d; font-weight: 800;">${femaleCount}</span> នាក់)</div>
                  <div>• ប័ណ្ណសមធម៌ (ក្រ១/ក្រ២)៖ <span style="color: #047857; font-weight: 800;">${poorCount}</span> នាក់</div>
                  <div>• អាហារូបករណ៍៖ <span style="color: #d97706; font-weight: 800;">៦</span> នាក់</div>
                  <div>• ពិការភាព៖ <span style="color: #64748b; font-weight: 800;">០</span> នាក់</div>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
                      <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 30px;">ល.រ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 65px;">អត្តលេខ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left; width: 130px;">គោត្តនាម-នាម</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 36px;">ភេទ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 75px;">ថ្ងៃខែឆ្នាំកំណើត</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left;">ទីកន្លែងកំណើត</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left; width: 110px;">ឪពុក-ម្តាយ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 60px;">ស្ថានភាព</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 75px;">ទូរស័ព្ទ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 50px;">សម្គាល់</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${students.map((s, idx) => `
                      <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                        <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${idx + 1}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-weight: bold;">${s.civilId || '-'}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${s.name}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${s.gender}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${s.dob || '-'}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 4px 6px;">${s.pob || s.address || '-'}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-size: 8pt;">${s.fatherName || s.motherName ? `${s.fatherName || ''} / ${s.motherName || ''}` : '-'}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${s.familyStatus === 'ក្រ១' || s.familyStatus === 'ក្រ២' ? '#b45309' : '#475569'};">${s.familyStatus || 'ទូទៅ'}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-size: 7.5pt;">${s.phone || '-'}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-size: 7.5pt;">${s.note || 'នៅរស់'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* 1.2 Student Attendance PDF Customizer Modal (A4 Landscape) */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        const totalCount = students.length;
        const femaleCount = students.filter(s => s.gender === 'ស្រី').length;
        const presentCount = students.filter(s => {
          const status = s.attendance?.[selectedAttendanceDate] || 'present';
          return status === 'present';
        }).length;
        const permissionCount = students.filter(s => s.attendance?.[selectedAttendanceDate] === 'permission').length;
        const absentCount = students.filter(s => s.attendance?.[selectedAttendanceDate] === 'absent').length;
        const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

        return (
          <PdfCustomizerModal
            isOpen={isAttendancePdfModalOpen}
            onClose={() => setIsAttendancePdfModalOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF តារាងស្រង់វត្តមានសិស្ស (A4 Landscape)"
            initialHeader={{
              docTitle: 'តារាងស្រង់វត្តមានសិស្សប្រចាំថ្ងៃ និងតាមដានអវត្តមាន',
              docSubtitle: `ការស្រង់វត្តមានសិស្ស ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ថ្ងៃទី ${selectedAttendanceDate} ឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី',
              leftSignTitle: 'បានឃើញ និងឯកភាព\nនាយកសាលា',
              rightSignTitle: 'គ្រូបន្ទុកថ្នាក់'
            }}
            customTableHtml={`
              <div style="font-family: 'Siemreap', sans-serif; font-size: 9pt; color: #1e293b;">
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-weight: bold; font-size: 9pt;">
                  <div>• សិស្សសរុប៖ <span style="color: #1e1b4b; font-weight: 800;">${totalCount}</span> នាក់ (ស្រី <span style="color: #be185d; font-weight: 800;">${femaleCount}</span> នាក់)</div>
                  <div>• វត្តមានជាក់ស្តែង៖ <span style="color: #047857; font-weight: 800;">${presentCount}</span> នាក់</div>
                  <div>• សុំច្បាប់ (P)៖ <span style="color: #d97706; font-weight: 800;">${permissionCount}</span> នាក់</div>
                  <div>• អវត្តមានឥតច្បាប់ (A)៖ <span style="color: #b91c1c; font-weight: 800;">${absentCount}</span> នាក់</div>
                  <div>• អត្រាវត្តមាន៖ <span style="color: #4338ca; font-weight: 800;">${rate}%</span></div>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 9pt;">
                      <th style="border: 1px solid #cbd5e1; padding: 6px 4px; width: 35px;">ល.រ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px 6px; width: 75px;">អត្តលេខ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; width: 160px;">គោត្តនាម-នាម</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px 4px; width: 45px;">ភេទ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px 6px; width: 110px;">ស្ថានភាពវត្តមាន</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left;">មូលហេតុ / ការកត់សម្គាល់</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px 6px; width: 90px;">លេខទូរស័ព្ទ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px 6px; width: 95px;">ហត្ថលេខា</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${students.map((s, idx) => {
                      const status = s.attendance?.[selectedAttendanceDate] || 'present';
                      const statusLabel = status === 'present' ? 'វត្តមាន (✓)' : status === 'permission' ? 'ច្បាប់ (P)' : 'អវត្តមាន (A)';
                      const statusColor = status === 'present' ? '#047857' : status === 'permission' ? '#b45309' : '#b91c1c';
                      const statusBg = status === 'present' ? '#ecfdf5' : status === 'permission' ? '#fffbeb' : '#fef2f2';

                      return `
                        <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center;">${idx + 1}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-family: monospace; font-weight: bold;">${s.civilId || '-'}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 5px 8px; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${s.name}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${s.gender}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-weight: bold; background-color: ${statusBg}; color: ${statusColor};">${statusLabel}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 8.5pt; color: #475569;">${status === 'permission' ? 'មានការអនុញ្ញាតពីអាណាព្យាបាល' : status === 'absent' ? 'ខកខានមិនបានជូនដំណឹង' : 'មកទាន់ពេលវេលា'}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-family: monospace; font-size: 8pt;">${s.phone || '-'}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center;"></td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* 1.3 Student Grades & Ranking PDF Customizer Modal (A4 Landscape) */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        const totalCount = students.length;
        const femaleCount = students.filter(s => s.gender === 'ស្រី').length;
        const activePeriodInfo = GRADE_PERIODS.find(p => p.key === selectedGradePeriod) || GRADE_PERIODS[0];
        const isSemester1Summary = gradeSemesterTab === 1 && selectedGradePeriod === 's1_summary';
        const isSemester2Summary = gradeSemesterTab === 2 && selectedGradePeriod === 's2_summary';
        const isAnnualSummary = gradeSemesterTab === 'annual' || selectedGradePeriod === 'annual_summary';

        let docTitle = `តារាងលទ្ធផលពិន្ទុ មធ្យមភាគ និងចំណាត់ថ្នាក់ (${activePeriodInfo.label})`;
        let docSubtitle = `លទ្ធផលសិក្សាសិស្ស ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ${activePeriodInfo.label} ឆ្នាំសិក្សា ${academicYear}`;

        let tableHeaderHtml = '';
        let tableRowsHtml = '';

        if (isAnnualSummary) {
          docTitle = 'តារាងបូកសរុបលទ្ធផលពិន្ទុ មធ្យមភាគ និងចំណាត់ថ្នាក់ប្រចាំឆ្នាំ (Annual Master Results)';
          docSubtitle = `លទ្ធផលបូកសរុបការសិក្សាប្រចាំឆ្នាំ ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ឆ្នាំសិក្សា ${academicYear}`;
          const annData = calculateAnnualSummary(students, grades, gradeThresholds, selectedS1Months, selectedS2Months, activeSubSubjects, subScoresState);

          tableHeaderHtml = `
            <tr style="background-color: #1e1b4b; color: white; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 30px;">ល.រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 65px;">អត្តលេខ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left; width: 130px;">គោត្តនាម-នាម</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 36px;">ភេទ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 75px;">ម.ភាគ ឆមាសទី១</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 75px;">ម.ភាគ ឆមាសទី២</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 85px; background-color: #fbbf24; color: #1e1b4b;">មធ្យមភាគប្រចាំឆ្នាំ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 65px;">ចំណាត់ថ្នាក់</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 50px;">និទ្ទេស</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 75px;">លទ្ធផល</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 100px;">កិត្តិយស/ការសរសើរ</th>
            </tr>
          `;

          tableRowsHtml = annData.students.map((item, idx) => {
            const s = item.student;
            return `
              <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${idx + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-weight: bold;">${s.civilId || s.rollNo}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${s.name}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${s.gender}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">${item.semester1Average}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">${item.semester2Average}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #1e1b4b; background-color: #fef3c7;">${item.annualAverage}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #4338ca;">លេខ ${item.rank}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: ${item.classification.letter === 'A' ? '#047857' : item.classification.letter === 'B' ? '#2563eb' : item.classification.letter === 'C' ? '#d97706' : '#b91c1c'};">${item.classification.letter}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: ${item.passed ? '#047857' : '#b91c1c'};">${item.passed ? '✨ ឡើងថ្នាក់' : '⚠️ ត្រួតថ្នាក់'}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-size: 8pt; font-weight: bold;">${item.rank === 1 ? '🏆 សិស្សឆ្នើមលេខ១' : item.rank <= 3 ? '🎖️ សិស្សពូកែ' : item.classification.letter === 'A' ? '⭐ ល្អប្រសើរ' : '-'}</td>
              </tr>
            `;
          }).join('');
        } else if (isSemester1Summary) {
          docTitle = 'តារាងបូកសរុបលទ្ធផលពិន្ទុ និងចំណាត់ថ្នាក់ ឆមាសទី១';
          docSubtitle = `លទ្ធផលបូកសរុបឆមាសទី១ ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ឆ្នាំសិក្សា ${academicYear}`;
          const s1Data = calculateSemesterSummary(students, grades, 1, selectedS1Months, gradeThresholds, activeSubSubjects, subScoresState);

          const s1Months = ALL_ENTRY_MONTHS.filter(m => selectedS1Months.includes(m.key));
          tableHeaderHtml = `
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 30px;">ល.រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left; width: 130px;">គោត្តនាម-នាម</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 36px;">ភេទ</th>
              ${s1Months.map(m => `<th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 55px;">${m.shortLabel}</th>`).join('')}
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px;">ម.ភាគខែ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 75px;">ប្រឡងឆមាស១</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 80px; background-color: #ede9fe; color: #4338ca;">ម.ភាគ ឆមាស១</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 55px;">ចំណាត់ថ្នាក់</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 50px;">និទ្ទេស</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 65px;">លទ្ធផល</th>
            </tr>
          `;

          tableRowsHtml = s1Data.students.map((item, idx) => {
            const s = item.student;
            return `
              <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${idx + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${s.name}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${s.gender}</td>
                ${s1Months.map(m => `<td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${item.monthlyAverages[m.key] !== undefined ? item.monthlyAverages[m.key] : '0.00'}</td>`).join('')}
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">${item.monthlyOverallAverage}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: #92400e;">${item.examAverage}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #4338ca; background-color: #f5f3ff;">${item.semesterAverage}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800;">លេខ ${item.rank}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: ${item.classification.letter === 'A' ? '#047857' : item.classification.letter === 'B' ? '#2563eb' : item.classification.letter === 'C' ? '#d97706' : '#b91c1c'};">${item.classification.letter}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: ${item.passed ? '#047857' : '#b91c1c'};">${item.passed ? 'ជាប់' : 'ធ្លាក់'}</td>
              </tr>
            `;
          }).join('');
        } else if (isSemester2Summary) {
          docTitle = 'តារាងបូកសរុបលទ្ធផលពិន្ទុ និងចំណាត់ថ្នាក់ ឆមាសទី២';
          docSubtitle = `លទ្ធផលបូកសរុបឆមាសទី២ ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ឆ្នាំសិក្សា ${academicYear}`;
          const s2Data = calculateSemesterSummary(students, grades, 2, selectedS2Months, gradeThresholds, activeSubSubjects, subScoresState);

          const s2Months = ALL_ENTRY_MONTHS.filter(m => selectedS2Months.includes(m.key));
          tableHeaderHtml = `
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 30px;">ល.រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left; width: 130px;">គោត្តនាម-នាម</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 36px;">ភេទ</th>
              ${s2Months.map(m => `<th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 50px;">${m.shortLabel}</th>`).join('')}
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px;">ម.ភាគខែ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 75px;">ប្រឡងឆមាស២</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 80px; background-color: #ede9fe; color: #4338ca;">ម.ភាគ ឆមាស២</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 55px;">ចំណាត់ថ្នាក់</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 50px;">និទ្ទេស</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 65px;">លទ្ធផល</th>
            </tr>
          `;

          tableRowsHtml = s2Data.students.map((item, idx) => {
            const s = item.student;
            return `
              <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${idx + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${s.name}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${s.gender}</td>
                ${s2Months.map(m => `<td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${item.monthlyAverages[m.key] !== undefined ? item.monthlyAverages[m.key] : '0.00'}</td>`).join('')}
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">${item.monthlyOverallAverage}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: #92400e;">${item.examAverage}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #4338ca; background-color: #f5f3ff;">${item.semesterAverage}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800;">លេខ ${item.rank}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: ${item.classification.letter === 'A' ? '#047857' : item.classification.letter === 'B' ? '#2563eb' : item.classification.letter === 'C' ? '#d97706' : '#b91c1c'};">${item.classification.letter}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: ${item.passed ? '#047857' : '#b91c1c'};">${item.passed ? 'ជាប់' : 'ធ្លាក់'}</td>
              </tr>
            `;
          }).join('');
        } else {
          // Single Month or Exam Period
          const singleData = calculateSinglePeriodSummary(students, grades, selectedGradePeriod, gradeThresholds, activeSubSubjects, subScoresState);

          tableHeaderHtml = `
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 30px;">ល.រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 65px;">អត្តលេខ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left; width: 120px;">គោត្តនាម-នាម</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 36px;">ភេទ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 60px;">ភាសាខ្មែរ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 60px;">គណិតវិទ្យា</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 60px;">វិទ្យាសាស្ត្រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 60px;">សិក្សាសង្គម</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 65px;">ពិន្ទុសរុប</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 60px;">មធ្យមភាគ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 50px;">ចំណាត់ថ្នាក់</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 45px;">និទ្ទេស</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 65px;">លទ្ធផល</th>
            </tr>
          `;

          tableRowsHtml = singleData.students.map((item, idx) => {
            const s = item.student;
            const g = item.grade;
            return `
              <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${idx + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-weight: bold;">${s.civilId || s.rollNo}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${s.name}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${s.gender}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${g.khmer}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${g.math}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${g.science}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${g.social || 0}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #1e1b4b;">${item.total}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: ${item.average >= 50 ? '#047857' : '#b91c1c'};">${item.average}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #4338ca;">លេខ ${item.rank}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: ${item.classification.letter === 'A' ? '#047857' : item.classification.letter === 'B' ? '#2563eb' : item.classification.letter === 'C' ? '#d97706' : '#b91c1c'};">${item.classification.letter}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${item.passed ? '#047857' : '#b91c1c'};">${item.passed ? 'ជាប់' : 'ធ្លាក់'}</td>
              </tr>
            `;
          }).join('');
        }

        return (
          <PdfCustomizerModal
            isOpen={isGradesPdfModalOpen}
            onClose={() => setIsGradesPdfModalOpen(false)}
            documentType="general"
            title={`កំណត់ទម្រង់ & ទាញយក PDF ${docTitle} (A4 Landscape)`}
            initialHeader={{
              docTitle: docTitle,
              docSubtitle: docSubtitle,
              schoolName: teacher.school || 'សាលាបឋមសិក្សា ហ៊ុន សែន អូរឫស្សី កណ្តាល',
              teacherName: teacher.name || 'លោកគ្រូ ឌ៊ុក ស៊ុភ័ក្ត',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី',
              leftSignTitle: 'បានឃើញ និងឯកភាព\nនាយក / នាយិកាសាលា\n(ហត្ថលេខា និងត្រា)',
              rightSignTitle: 'គ្រូបន្ទុកថ្នាក់\n(ហត្ថលេខា)'
            }}
            customTableHtml={`
              <div style="font-family: 'Siemreap', sans-serif; font-size: 8.5pt; color: #1e293b;">
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; margin-bottom: 10px; font-weight: bold; font-size: 8.5pt;">
                  <div>• សិស្សសរុប៖ <span style="color: #1e1b4b; font-weight: 800;">${totalCount}</span> នាក់ (ស្រី <span style="color: #be185d; font-weight: 800;">${femaleCount}</span> នាក់)</div>
                  <div>• ដំណាក់កាល៖ <span style="color: #4338ca; font-weight: 800;">${activePeriodInfo.label}</span></div>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    ${tableHeaderHtml}
                  </thead>
                  <tbody>
                    ${tableRowsHtml}
                  </tbody>
                </table>
              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* 1.4 Student Statistics & PLP Categorization PDF Customizer Modal (A4 Landscape) */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        const totalCount = students.length;
        const femaleCount = students.filter(s => s.gender === 'ស្រី').length;

        return (
          <PdfCustomizerModal
            isOpen={isStatsPdfModalOpen}
            onClose={() => setIsStatsPdfModalOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF ស្ថិតិ & ចាត់ថ្នាក់សិស្ស (A4 Landscape)"
            initialHeader={{
              docTitle: 'របាយការណ៍ស្ថិតិសិស្ស និងការចាត់ថ្នាក់កម្រិតសមត្ថភាព (PLP / PTOM)',
              docSubtitle: `ស្ថិតិទូទៅ និងការចាត់ថ្នាក់សមត្ថភាពសិស្ស ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី',
              leftSignTitle: 'បានឃើញ និងឯកភាព\nនាយកសាលា',
              rightSignTitle: 'គ្រូបន្ទុកថ្នាក់'
            }}
            customTableHtml={`
              <div style="font-family: 'Siemreap', sans-serif; font-size: 9pt; color: #1e293b; line-height: 1.6;">
                <div style="margin-bottom: 12px;">
                  <h4 style="font-family: 'Moul', cursive; font-size: 10pt; color: #1e1b4b; margin: 0 0 6px 0;">១. ស្ថិតិរដ្ឋបាល និងស្ថានភាពសង្គមសិស្ស៖</h4>
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
                    <thead>
                      <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold;">
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">សិស្សសរុប</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">សិស្សស្រី</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">អាហារូបករណ៍</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">ប័ណ្ណសមធម៌ (ក្រ១/ក្រ២)</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">ពិការភាពស្រាល</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px;">កុមារងាយរងគ្រោះ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="text-align: center; font-weight: bold;">
                        <td style="border: 1px solid #cbd5e1; padding: 8px; font-size: 11pt; color: #1e1b4b;">${totalCount} នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; font-size: 11pt; color: #be185d;">${femaleCount} នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; font-size: 11pt; color: #d97706;">៦ នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; font-size: 11pt; color: #047857;">៤ នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; font-size: 11pt; color: #64748b;">០ នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 8px; font-size: 11pt; color: #7c3aed;">២ នាក់</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style="margin-bottom: 12px;">
                  <h4 style="font-family: 'Moul', cursive; font-size: 10pt; color: #1e1b4b; margin: 0 0 6px 0;">២. ការចាត់ថ្នាក់កម្រិតសមត្ថភាព PLP MoEYS (អំណាន និងគណិតវិទ្យា)៖</h4>
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
                    <thead>
                      <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold;">
                        <th style="border: 1px solid #cbd5e1; padding: 6px; width: 140px;">កម្រិតសមត្ថភាព</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px; width: 80px;">ចំនួនសិស្ស</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px; width: 70px;">ស្រី</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px; width: 70px;">ភាគរយ</th>
                        <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left;">ការពិពណ៌នាសមត្ថភាព</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold; color: #047857;">កម្រិត ៤ (ពូកែ/Advanced)</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold;">៨ នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">៥ នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold;">33.3%</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;">អានអត្ថបទស្ទាត់ យល់ន័យរឿង និងដោះស្រាយចំណោទស្មុគស្មាញបានល្អ</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold; color: #2563eb;">កម្រិត ៣ (មធ្យម/Proficient)</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold;">១២ នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">៦ នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold;">50.0%</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;">អាន និងសរសេរពាក្យបានត្រឹមត្រូវ គណនាផលបូកដកគុណចែកមូលដ្ឋានបានត្រឹមត្រូវ</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold; color: #b91c1c;">កម្រិត ១-២ (រៀនយឺត/Support)</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold; color: #b91c1c;">៤ នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">២ នាក់</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold; color: #b91c1c;">16.7%</td>
                        <td style="border: 1px solid #cbd5e1; padding: 6px;">ត្រូវការការបំប៉នបន្ថែមលើការផ្សំខ្យល់ ព្យញ្ជនៈ ស្រៈ និងការបូកដកលេខមានត្រាទុក</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 style="font-family: 'Moul', cursive; font-size: 10pt; color: #1e1b4b; margin: 0 0 6px 0;">៣. ផែនការសកម្មភាព និងការបំប៉នសិស្សរៀនយឺត (Remedial Action Plan)៖</h4>
                  <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; font-size: 8.5pt;">
                    • រៀបចំកម្មវិធីបង្រៀនបន្ថែមម៉ោង (Remedial Teaching) រៀងរាល់ថ្ងៃព្រហស្បតិ៍ និងសុក្រ ចំនួន ១ម៉ោងក្នុងមួយថ្ងៃ។<br/>
                    • ប្រើប្រាស់សម្ភារឧបទេសរូបភាព បណ្ណពាក្យ និងល្បែងសិក្សា PLP ដើម្បីជំរុញការចងចាំ និងការយល់ដឹង។<br/>
                    • សហការជិតស្និទ្ធជាមួយមាតាបិតាសិស្សដើម្បីតាមដានការអានសៀវភៅនៅផ្ទះយ៉ាងតិច ៣០នាទីក្នុងមួយថ្ងៃ។
                  </div>
                </div>
              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* 1.5 Student Behavior & Discipline PDF Customizer Modal (A4 Landscape) */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';

        return (
          <PdfCustomizerModal
            isOpen={isBehaviorPdfModalOpen}
            onClose={() => setIsBehaviorPdfModalOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF ការតាមដានអាកប្បកិរិយា & វិន័យ (A4 Landscape)"
            initialHeader={{
              docTitle: 'តារាងតាមដានពិន្ទុវិន័យ សីលធម៌ និងអាកប្បកិរិយាសិស្ស',
              docSubtitle: `ការកត់ត្រាវិន័យ និងឥរិយាបថវិជ្ជមាន ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី',
              leftSignTitle: 'បានឃើញ និងឯកភាព\nនាយកសាលា',
              rightSignTitle: 'គ្រូបន្ទុកថ្នាក់'
            }}
            customTableHtml={`
              <div style="font-family: 'Siemreap', sans-serif; font-size: 8.5pt; color: #1e293b;">
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; margin-bottom: 10px; font-weight: bold; font-size: 8.5pt; color: #047857;">
                  • ការតាមដាន និងវាយតម្លៃវិន័យ សីលធម៌ ការគោរពពេលវេលា អនាម័យ និងឥរិយាបថវិជ្ជមានរបស់សិស្សក្នុងថ្នាក់រៀន
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
                      <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 30px;">ល.រ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 65px;">អត្តលេខ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left; width: 120px;">គោត្តនាម-នាម</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 36px;">ភេទ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px;">ពិន្ទុវិន័យ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 85px;">ការគោរពពេល</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 85px;">អនាម័យ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left;">ការសរសើរឥរិយាបថវិជ្ជមាន</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left; width: 140px;">ការកែលម្អ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 55px;">សម្គាល់</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${students.map((s, idx) => {
                      const score = 95 - (idx % 4) * 3;
                      const timeStatus = idx % 5 === 0 ? 'ទៀងទាត់' : 'ល្អណាស់';
                      const cleanStatus = idx % 3 === 0 ? 'ស្អាតបាត' : 'ល្អប្រសើរ';
                      const praise = idx % 2 === 0 ? 'ជួយមិត្តភក្តិ ចូលរួមឆ្លើយសំណួរក្លាហាន' : 'គោរពវិន័យថ្នាក់ យកចិត្តទុកដាក់ស្តាប់គ្រូ';
                      const improve = idx % 4 === 0 ? 'ពង្រឹងការសរសេរអក្សរឱ្យស្អាត' : 'បន្តរក្សាភាពសកម្មក្នុងការរៀនសូត្រ';

                      return `
                        <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${idx + 1}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-weight: bold;">${s.civilId || '-'}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${s.name}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${s.gender}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #047857;">${score}/100</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-size: 8pt; color: #1e1b4b;">${timeStatus}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-size: 8pt; color: #1e1b4b;">${cleanStatus}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-size: 8pt; color: #047857;">${praise}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-size: 8pt; color: #475569;">${improve}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: #047857;">ល្អ</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* 1.6 PLP Assessment Report PDF Customizer Modal (A4 Landscape) */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        const totalCount = students.length;
        const femaleCount = students.filter(s => s.gender === 'ស្រី').length;

        return (
          <PdfCustomizerModal
            isOpen={isPlpPdfModalOpen}
            onClose={() => setIsPlpPdfModalOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF របាយការណ៍សមត្ថភាព PLP MoEYS (A4 Landscape)"
            initialHeader={{
              docTitle: 'របាយការណ៍លទ្ធផលតេស្ត និងការវាយតម្លៃសមត្ថភាពសិស្ស PLP MoEYS',
              docSubtitle: `ការវាយតម្លៃកម្រិតអំណានដំបូង និងគណិតវិទ្យាដំបូង ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី',
              leftSignTitle: 'បានឃើញ និងឯកភាព\nនាយកសាលា',
              rightSignTitle: 'គ្រូបន្ទុកថ្នាក់'
            }}
            customTableHtml={`
              <div style="font-family: 'Siemreap', sans-serif; font-size: 8.5pt; color: #1e293b;">
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; margin-bottom: 10px; font-weight: bold; font-size: 8.5pt;">
                  • កម្មវិធីអំណាន និងគណិតវិទ្យាថ្នាក់ដំបូង (Primary Learning Program - MoEYS) | ស្ថិតិសរុប៖ ${totalCount} នាក់ (ស្រី ${femaleCount} នាក់)
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
                      <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 30px;">ល.រ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 65px;">អត្តលេខ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left; width: 120px;">គោត្តនាម-នាម</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 36px;">ភេទ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 85px;">សម្គាល់តួអក្សរ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 85px;">ការផ្សំខ្យល់ពាក្យ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 85px;">ការអានអត្ថបទ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 85px;">ការយល់ន័យ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 80px;">គណិតវិទ្យា</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 60px;">កម្រិត PLP</th>
                      <th style="border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left;">ផែនការគាំទ្រ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${students.map((s, idx) => {
                      const level = idx % 4 === 0 ? 'កម្រិត ២' : idx % 3 === 0 ? 'កម្រិត ៤' : 'កម្រិត ៣';
                      const levelColor = level === 'កម្រិត ៤' ? '#047857' : level === 'កម្រិត ៣' ? '#2563eb' : '#b91c1c';
                      const letterScore = idx % 4 === 0 ? 'មធ្យម' : 'ស្ទាត់';
                      const blendScore = idx % 4 === 0 ? 'ត្រូវការជំនួយ' : 'ល្អ';
                      const readScore = idx % 4 === 0 ? 'យឺត' : 'ស្ទាត់';
                      const compScore = idx % 4 === 0 ? 'មធ្យម' : 'ល្អប្រសើរ';
                      const mathScore = idx % 4 === 0 ? '៧០%' : '៩០%';
                      const plan = idx % 4 === 0 ? 'បំប៉នផ្សំខ្យល់ ២ដង/សប្តាហ៍' : 'លើកទឹកចិត្តអានសៀវភៅបន្ថែម';

                      return `
                        <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${idx + 1}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-weight: bold;">${s.civilId || '-'}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${s.name}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${s.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${s.gender}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-size: 8pt;">${letterScore}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-size: 8pt;">${blendScore}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-size: 8pt;">${readScore}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-size: 8pt;">${compScore}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">${mathScore}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: ${levelColor};">${level}</td>
                          <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-size: 8pt; color: #475569;">${plan}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}

      {/* Slide Presentation Viewer Modal */}
      <AnimatePresence>
        {isSlideViewerOpen && activeSlideDeck && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            >
              {/* Header */}
              <div className="bg-purple-950 text-white px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center font-black">
                    <Presentation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base">{activeSlideDeck.title}</h3>
                    <p className="text-[11px] text-purple-200">{activeSlideDeck.subject} • {activeSlideDeck.grade} ({currentSlideIdx + 1} / {activeSlideDeck.slides.length})</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSlideViewerOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition"
                >
                  ✕
                </button>
              </div>

              {/* Slide Content Area */}
              <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/30 overflow-y-auto">
                {activeSlideDeck.slides[currentSlideIdx] && (
                  <div className="w-full max-w-2xl bg-white rounded-[32px] p-8 sm:p-10 shadow-xl border border-slate-200/80 space-y-6">
                    <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-extrabold text-xs">
                      ស្លាយទី {currentSlideIdx + 1} នៃ {activeSlideDeck.slides.length}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {activeSlideDeck.slides[currentSlideIdx].title}
                    </h2>
                    <p className="text-sm font-bold text-purple-900">
                      {activeSlideDeck.slides[currentSlideIdx].content}
                    </p>
                    <ul className="space-y-3 pt-2">
                      {activeSlideDeck.slides[currentSlideIdx].bulletPoints.map((pt: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                          <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer Navigation */}
              <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                <button
                  disabled={currentSlideIdx === 0}
                  onClick={() => setCurrentSlideIdx(prev => Math.max(0, prev - 1))}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-40 transition flex items-center gap-2"
                >
                  ❮ មុន
                </button>
                <div className="text-xs font-bold text-slate-600">
                  {currentSlideIdx + 1} / {activeSlideDeck.slides.length}
                </div>
                <button
                  disabled={currentSlideIdx === activeSlideDeck.slides.length - 1}
                  onClick={() => setCurrentSlideIdx(prev => Math.min(activeSlideDeck.slides.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs disabled:opacity-40 transition flex items-center gap-2 shadow-md shadow-purple-900/20"
                >
                  បន្ទាប់ ❯
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Slide Deck Modal */}
      <AnimatePresence>
        {isAddSlideModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-md shadow-2xl space-y-5 border border-slate-100"
            >
              <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Presentation className="w-5 h-5 text-purple-900" />
                  <span>បន្ថែមស្លាយបង្រៀនថ្មី</span>
                </h3>
                <button
                  onClick={() => setIsAddSlideModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newSlideTitle.trim()) return;
                  const newDeck = {
                    id: Date.now(),
                    title: newSlideTitle.trim(),
                    subject: newSlideSubject,
                    grade: teacher.grade || 'ថ្នាក់ទី ៤',
                    slidesCount: 2,
                    description: newSlideDesc.trim() || 'ស្លាយបង្រៀនអន្តរកម្មប្រចាំមេរៀន',
                    presenter: teacher.name || 'លោកគ្រូ / អ្នកគ្រូ',
                    updatedAt: new Date().toISOString().split('T')[0],
                    slides: [
                      { title: newSlideTitle.trim(), content: 'សេចក្តីផ្តើមមេរៀន', bulletPoints: newSlidePoints ? newSlidePoints.split('\n').filter(Boolean) : ['គោលបំណងមេរៀន', 'ការណែនាំសកម្មភាពសិស្ស'] },
                      { title: 'លំហាត់ និងសំណួរពិភាក្សា', content: 'សកម្មភាពអនុវត្ត', bulletPoints: ['សំណួរទី១៖ ពន្យល់និងពិភាក្សា', 'សំណួរទី២៖ លំហាត់អនុវត្តជាក់ស្តែង'] }
                    ]
                  };
                  setLessonDecks([newDeck, ...lessonDecks]);
                  setIsAddSlideModalOpen(false);
                  setNewSlideTitle('');
                  setNewSlideDesc('');
                  setNewSlidePoints('');
                  onShowToast('បានបង្កើតស្លាយបង្រៀនថ្មីជោគជ័យ!');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">មុខវិជ្ជា</label>
                  <select
                    value={newSlideSubject}
                    onChange={(e) => setNewSlideSubject(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none bg-slate-50/50"
                  >
                    <option value="ភាសាខ្មែរ">ភាសាខ្មែរ</option>
                    <option value="គណិតវិទ្យា">គណិតវិទ្យា</option>
                    <option value="វិទ្យាសាស្ត្រ">វិទ្យាសាស្ត្រ</option>
                    <option value="សិក្សាសង្គម">សិក្សាសង្គម</option>
                    <option value="សីលធម៌-ពលរដ្ឋ">សីលធម៌-ពលរដ្ឋ</option>
                    <option value="ភាសាអង់គ្លេស">ភាសាអង់គ្លេស</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">ចំណងជើងស្លាយបង្រៀន</label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. ភាសាខ្មែរ៖ វាក្យសព្ទ និងវេយ្យាករណ៍..."
                    value={newSlideTitle}
                    onChange={(e) => setNewSlideTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">បរិយាយសង្ខេប</label>
                  <textarea
                    rows={2}
                    placeholder="បរិយាយពីខ្លឹមសារស្លាយ..."
                    value={newSlideDesc}
                    onChange={(e) => setNewSlideDesc(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none bg-slate-50/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">ចំណុចសំខាន់ៗ (ដាក់មួយបន្ទាត់មួយ)</label>
                  <textarea
                    rows={3}
                    placeholder="គោលបំណងមេរៀន&#10;វាក្យសព្ទថ្មី&#10;លំហាត់អនុវត្ត"
                    value={newSlidePoints}
                    onChange={(e) => setNewSlidePoints(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none bg-slate-50/50 resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddSlideModalOpen(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl font-bold shadow-md shadow-purple-900/20 transition"
                  >
                    រក្សាទុកស្លាយ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INTERACTIVE FULL-SCREEN TEACHING SLIDES MODAL */}
      <KhmerLessonSlideModal
        isOpen={isKhmerSlideModalOpen}
        onClose={() => setIsKhmerSlideModalOpen(false)}
        lesson={selectedSlideLesson}
        onShowToast={onShowToast}
      />

      
      {/* Grade Threshold Settings Modal */}
      {isThresholdModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print animate-in fade-in duration-150">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-md w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col p-5 sm:p-7 shadow-2xl border border-slate-100">
            {/* Header with quick mobile save */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 shrink-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-800 shrink-0" />
                <span>កំណត់ពិន្ទុនិទ្ទេស (Grade Cutoffs)</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsThresholdModalOpen(false);
                    triggerConfigSavedToast("បានរក្សាទុកកម្រិតពិន្ទុនិទ្ទេស និងគណនាលទ្ធផលឡើងវិញដោយជោគជ័យ!");
                    onShowToast("បានរក្សាទុកកម្រិតពិន្ទុនិទ្ទេសដោយជោគជ័យ!");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1 transition cursor-pointer"
                  title="រក្សាទុក"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>រក្សាទុក</span>
                </button>
                <button
                  onClick={() => setIsThresholdModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed py-2 shrink-0">
              ជ្រើសរើសពិន្ទុមធ្យមភាគអប្បបរមាសម្រាប់និទ្ទេសនីមួយៗ (មាត្រដ្ឋាន ១០ពិន្ទុ)៖
            </p>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-3.5 py-1 pr-1 overscroll-contain">
              <div className="flex items-center justify-between bg-emerald-50/70 p-3 sm:p-3.5 rounded-2xl border border-emerald-200">
                <span className="font-extrabold text-emerald-900 text-xs sm:text-sm">និទ្ទេស A (ល្អណាស់) ≥</span>
                <select
                  value={gradeThresholds.A}
                  onChange={(e) => setGradeThresholds({ ...gradeThresholds, A: Number(e.target.value) })}
                  className="w-24 sm:w-28 text-center font-black bg-white border border-emerald-300 rounded-xl px-2.5 py-2 text-emerald-900 shadow-2xs cursor-pointer text-xs sm:text-sm"
                >
                  {scoreOptions.map(val => (
                    <option key={val} value={val}>{val.toFixed(2)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between bg-blue-50/70 p-3 sm:p-3.5 rounded-2xl border border-blue-200">
                <span className="font-extrabold text-blue-900 text-xs sm:text-sm">និទ្ទេស B (ល្អ) ≥</span>
                <select
                  value={gradeThresholds.B}
                  onChange={(e) => setGradeThresholds({ ...gradeThresholds, B: Number(e.target.value) })}
                  className="w-24 sm:w-28 text-center font-black bg-white border border-blue-300 rounded-xl px-2.5 py-2 text-blue-900 shadow-2xs cursor-pointer text-xs sm:text-sm"
                >
                  {scoreOptions.map(val => (
                    <option key={val} value={val}>{val.toFixed(2)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between bg-amber-50/70 p-3 sm:p-3.5 rounded-2xl border border-amber-200">
                <span className="font-extrabold text-amber-900 text-xs sm:text-sm">និទ្ទេស C (មធ្យម) ≥</span>
                <select
                  value={gradeThresholds.C}
                  onChange={(e) => setGradeThresholds({ ...gradeThresholds, C: Number(e.target.value) })}
                  className="w-24 sm:w-28 text-center font-black bg-white border border-amber-300 rounded-xl px-2.5 py-2 text-amber-900 shadow-2xs cursor-pointer text-xs sm:text-sm"
                >
                  {scoreOptions.map(val => (
                    <option key={val} value={val}>{val.toFixed(2)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between bg-orange-50/70 p-3 sm:p-3.5 rounded-2xl border border-orange-200">
                <span className="font-extrabold text-orange-900 text-xs sm:text-sm">និទ្ទេស D (គួរគប្បី) ≥</span>
                <select
                  value={gradeThresholds.D}
                  onChange={(e) => setGradeThresholds({ ...gradeThresholds, D: Number(e.target.value) })}
                  className="w-24 sm:w-28 text-center font-black bg-white border border-orange-300 rounded-xl px-2.5 py-2 text-orange-900 shadow-2xs cursor-pointer text-xs sm:text-sm"
                >
                  {scoreOptions.map(val => (
                    <option key={val} value={val}>{val.toFixed(2)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between bg-yellow-50/70 p-3 sm:p-3.5 rounded-2xl border border-yellow-200">
                <span className="font-extrabold text-yellow-900 text-xs sm:text-sm">និទ្ទេស E (ខ្សោយ) ≥</span>
                <select
                  value={gradeThresholds.E}
                  onChange={(e) => setGradeThresholds({ ...gradeThresholds, E: Number(e.target.value) })}
                  className="w-24 sm:w-28 text-center font-black bg-white border border-yellow-300 rounded-xl px-2.5 py-2 text-yellow-900 shadow-2xs cursor-pointer text-xs sm:text-sm"
                >
                  {scoreOptions.map(val => (
                    <option key={val} value={val}>{val.toFixed(2)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sticky Bottom Footer */}
            <div className="flex items-center justify-between gap-3 pt-3.5 mt-2 border-t border-slate-100 shrink-0">
              <button
                onClick={() => {
                  const defaults = { A: 8.5, B: 7.5, C: 6.5, D: 5.0, E: 4.0 };
                  setGradeThresholds(defaults);
                  triggerConfigSavedToast("បានកំណត់ឡើងវិញជាស្ដង់ដារក្រសួង និងរក្សាទុកស្វ័យប្រវត្តិ!");
                  onShowToast("បានកំណត់ឡើងវិញជាស្ដង់ដារក្រសួង!");
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                កំណត់ដើម (Reset)
              </button>
              <button
                onClick={() => {
                  setIsThresholdModalOpen(false);
                  triggerConfigSavedToast("បានរក្សាទុកកម្រិតពិន្ទុនិទ្ទេស និងគណនាលទ្ធផលឡើងវិញដោយជោគជ័យ!");
                  onShowToast("បានរក្សាទុកកម្រិតពិន្ទុនិទ្ទេសដោយជោគជ័យ!");
                }}
                className="bg-purple-950 hover:bg-purple-900 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md shadow-purple-950/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>រក្សាទុក (Save)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Semester Month Configuration Modal */}
      {isSemesterMonthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print animate-in fade-in duration-150">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col p-5 sm:p-7 shadow-2xl border border-slate-100">
            {/* Header with quick mobile save */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 shrink-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-700 shrink-0" />
                <span>កំណត់ខែសម្រាប់ឆមាសនីមួយៗ</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsSemesterMonthModalOpen(false);
                    triggerConfigSavedToast("បានរក្សាទុកការកំណត់ខែឆមាសដោយជោគជ័យ!");
                    onShowToast("បានរក្សាទុកការកំណត់ខែឆមាសដោយជោគជ័យ!");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1 transition cursor-pointer"
                  title="រក្សាទុក"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>រក្សាទុក</span>
                </button>
                <button
                  onClick={() => setIsSemesterMonthModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed py-2 shrink-0">
              ជ្រើសរើសខែណាខ្លះដែលត្រូវបញ្ចូលក្នុងការគណនាមធ្យមភាគប្រចាំខែសម្រាប់ឆមាសទី១ និងឆមាសទី២៖
            </p>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-5 py-1 pr-1 overscroll-contain">
              {/* Semester 1 Months */}
              <div className="bg-purple-50/80 border border-purple-200 p-3.5 sm:p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-extrabold text-purple-950 text-xs sm:text-sm block">ឆមាសទី១ (Semester 1 Months)</span>
                    <span className="text-[11px] text-purple-700 font-bold">បានជ្រើសរើស {selectedS1Months.length} ខែ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedS1Months(['m10', 'm11', 'm12', 'm01', 'm02', 'm03']);
                        onShowToast("បានបន្ថែម ២ ខែទៀតក្នុងឆមាសទី១ (សរុប ៦ ខែ)!");
                      }}
                      className="text-[11px] font-black bg-purple-200/90 text-purple-950 hover:bg-purple-300 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      + បន្ថែម ២ ខែទៀត (សរុប ៦ ខែ)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedS1Months(['m10', 'm11', 'm12', 'm01']);
                        onShowToast("បានកំណត់ខែឆមាសទី១ ស្ដង់ដារ (៤ ខែ)!");
                      }}
                      className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                    >
                      ស្ដង់ដារ (៤ ខែ)
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_ENTRY_MONTHS.map(mp => {
                    const isSelected = selectedS1Months.includes(mp.key);
                    return (
                      <label key={mp.key} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition min-h-[44px] ${isSelected ? 'bg-white border-purple-300 shadow-2xs font-bold text-purple-950' : 'bg-purple-100/50 border-purple-200 text-slate-600'}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedS1Months([...selectedS1Months, mp.key]);
                            else setSelectedS1Months(selectedS1Months.filter(k => k !== mp.key));
                          }}
                          className="rounded border-purple-300 text-purple-900 focus:ring-purple-600 w-4 h-4"
                        />
                        <span className="text-xs">{mp.label}</span>
                        {(mp.key === 'm08' || mp.key === 'm09') && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md ml-auto">
                            +ខែថ្មី
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Semester 2 Months */}
              <div className="bg-indigo-50/80 border border-indigo-200 p-3.5 sm:p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-extrabold text-indigo-950 text-xs sm:text-sm block">ឆមាសទី២ (Semester 2 Months)</span>
                    <span className="text-[11px] text-indigo-700 font-bold">បានជ្រើសរើស {selectedS2Months.length} ខែ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedS2Months(['m02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09']);
                        onShowToast("បានបន្ថែម ២ ខែទៀតក្នុងឆមាសទី២ (សីហា & កញ្ញា សរុប ៨ ខែ)!");
                      }}
                      className="text-[11px] font-black bg-indigo-200/90 text-indigo-950 hover:bg-indigo-300 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      + បន្ថែម ២ ខែទៀត (៨ ខែ រួមទាំង សីហា & កញ្ញា)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedS2Months(['m02', 'm03', 'm04', 'm05', 'm06', 'm07']);
                        onShowToast("បានកំណត់ខែឆមាសទី២ ស្ដង់ដារ (៦ ខែ)!");
                      }}
                      className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer"
                    >
                      ស្ដង់ដារ (៦ ខែ)
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_ENTRY_MONTHS.map(mp => {
                    const isSelected = selectedS2Months.includes(mp.key);
                    return (
                      <label key={mp.key} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition min-h-[44px] ${isSelected ? 'bg-white border-indigo-300 shadow-2xs font-bold text-indigo-950' : 'bg-indigo-100/50 border-indigo-200 text-slate-600'}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedS2Months([...selectedS2Months, mp.key]);
                            else setSelectedS2Months(selectedS2Months.filter(k => k !== mp.key));
                          }}
                          className="rounded border-indigo-300 text-indigo-900 focus:ring-indigo-600 w-4 h-4"
                        />
                        <span className="text-xs">{mp.label}</span>
                        {(mp.key === 'm08' || mp.key === 'm09') && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md ml-auto">
                            +ខែថ្មី
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky Bottom Footer */}
            <div className="flex items-center justify-end gap-3 pt-3.5 mt-2 border-t border-slate-100 shrink-0">
              <button
                onClick={() => {
                  setIsSemesterMonthModalOpen(false);
                  triggerConfigSavedToast("បានរក្សាទុកការកំណត់ខែឆមាសដោយជោគជ័យ!");
                  onShowToast("បានរក្សាទុកការកំណត់ខែឆមាសដោយជោគជ័យ!");
                }}
                className="w-full sm:w-auto bg-purple-950 hover:bg-purple-900 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-md shadow-purple-950/20 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>រក្សាទុក និងបិទ (Save & Close)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Sub-Subjects / Competencies Selection Modal (Configured per month/period) */}
      {isSubSubjectModalOpen && (
        <SubSubjectPeriodConfigModal
          isOpen={isSubSubjectModalOpen}
          onClose={() => setIsSubSubjectModalOpen(false)}
          initialPeriodKey={
            (selectedGradePeriod === 's1_summary' || selectedGradePeriod === 'annual_summary')
              ? 'm10'
              : (selectedGradePeriod === 's2_summary' ? 'm02' : selectedGradePeriod)
          }
          periodSubSubjectsMap={periodSubSubjectsMap}
          activeSubSubjects={activeSubSubjects}
          allDefs={getAllPrimarySubSubjects()}
          onSavePeriodSubSubjects={(pKey, subIds) => {
            handleSavePeriodSubSubjects(pKey, subIds);
            triggerConfigSavedToast(`បានរក្សាទុកមុខវិជ្ជារងសម្រាប់ខែ ${pKey} រួចរាល់!`);
          }}
          onApplyToAllPeriods={(subIds) => {
            handleApplySubSubjectsToAllPeriods(subIds);
            triggerConfigSavedToast("បានអនុវត្តមុខវិជ្ជារងចំពោះគ្រប់ខែទាំងអស់!");
          }}
          onAddCustomSubSubject={(newSub) => {
            const updated = [...customSubSubjectsState, newSub];
            setCustomSubSubjectsState(updated);
            saveCustomSubSubjects(updated);
            setActiveSubSubjects([...activeSubSubjects, newSub.id]);
          }}
          onShowToast={onShowToast}
        />
      )}


      {/* Clear Grades Confirmation Modal */}
      {isClearGradesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print animate-in fade-in duration-150">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  បញ្ជាក់ការសម្អាតពិន្ទុ (Confirm Clear Scores)
                </h3>
                <p className="text-xs text-slate-500">
                  សម័យកាល / ខែ៖ <span className="font-extrabold text-purple-900">{GRADE_PERIODS.find(p => p.key === selectedGradePeriod)?.label || selectedGradePeriod}</span>
                </p>
              </div>
            </div>

            <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-4 space-y-2 text-xs text-rose-950 leading-relaxed">
              <p className="font-bold">
                ⚠️ តើលោកគ្រូ-អ្នកគ្រូពិតជាចង់សម្អាតពិន្ទុសិស្សទាំងអស់សម្រាប់ «{GRADE_PERIODS.find(p => p.key === selectedGradePeriod)?.label || selectedGradePeriod}» មែនទេ?
              </p>
              <p className="text-slate-600">
                រាល់ទិន្នន័យពិន្ទុមុខវិជ្ជាគោល (ភាសាខ្មែរ គណិត វិទ្យាសាស្ត្រ សិក្សាសង្គម) និងមុខវិជ្ជារងទាំងអស់ក្នុងសម័យនេះ នឹងត្រូវកំណត់ទៅជា <strong>0.00</strong> ទាំងអស់ឡើងវិញ។
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsClearGradesModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>
              <button
                type="button"
                onClick={handleClearCurrentPeriodGrades}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md shadow-rose-600/20 transition cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>យល់ព្រមសម្អាត (Clear)</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* OFFICIAL MOEYS PLC MEETING MINUTES MODAL */}
      <PLCMeetingModal
        isOpen={isPLCModalOpen}
        onClose={() => setIsPLCModalOpen(false)}
        meeting={selectedPLCMeeting}
        teacher={teacher}
        onSaveMeeting={onSavePLC}
        onShowToast={onShowToast}
      />

      {/* STUDENT PIN CODES & LINK MANAGER MODAL */}
      <StudentPinManagerModal
        isOpen={isStudentPinManagerOpen}
        onClose={() => setIsStudentPinManagerOpen(false)}
        students={students}
        teacher={teacher}
        onUpdateStudents={onImportStudents ? (updated) => onImportStudents(updated, true) : () => {}}
        onShowToast={onShowToast}
      />

      {/* STUDENT ROSTER & PROFILES PRINT MODAL */}
      <StudentRosterPrintModal
        isOpen={isStudentRosterPrintModalOpen}
        onClose={() => setIsStudentRosterPrintModalOpen(false)}
        students={students}
        teacher={teacher}
      />

      {/* BANNER THEME PICKER MODAL (5 THEME PRESETS) */}
      <BannerThemePickerModal
        isOpen={isBannerThemeModalOpen}
        onClose={() => setIsBannerThemeModalOpen(false)}
        currentTheme={bannerThemeId}
        onSelectTheme={handleSelectBannerTheme}
      />

      {/* THURSDAY WORK REPORT MODAL (របាយការណ៍បំពេញការងារថ្ងៃព្រហស្បតិ៍ MoEYS) */}
      {isThursdayReportModalOpen && (
        <ThursdayWorkReportModal
          isOpen={isThursdayReportModalOpen}
          onClose={() => setIsThursdayReportModalOpen(false)}
          teacher={teacher}
          students={students}
          attendance={attendance}
          grades={grades}
          currentYear={activeAcademicYearValue}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};