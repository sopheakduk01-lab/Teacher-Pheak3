import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BookOpenCheck,
  BookOpen,
  Search,
  Plus,
  Filter,
  Calendar,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  HeartHandshake,
  FileText,
  Printer,
  Sparkles,
  Edit3,
  Trash2,
  Phone,
  ArrowRight,
  TrendingUp,
  X,
  FileSpreadsheet,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ShieldCheck,
  Award,
  BookMarked,
  Layers,
  Star,
  Settings,
  Save,
  Download,
  School,
  Building,
  RefreshCw,
  Sliders,
  CalendarCheck,
  Activity,
  BarChart3,
  Copy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Student,
  TeacherProfile,
  StudentMonitoringEntry,
  SubjectScoreItem,
  StudentMonthlyResultRecord,
  AttendanceDatabase,
  GradeDatabase,
} from '../types';
import { saveYearScopedData, loadYearScopedData, getActiveAcademicYear } from '../utils/academicYearStorage';
import {
  getAllPrimarySubSubjects,
  PRIMARY_SUB_SUBJECTS,
  PrimarySubSubject,
  getCustomSubSubjects,
  calculateSinglePeriodSummary,
  calculateSemesterSummary,
  calculateAnnualSummary,
  getGradeClassification,
  GradeThresholds,
} from '../utils/gradeManager';
import { getKhmerLunarDate, getKhmerSouriyateiDate } from '../utils/khmerDate';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';
import { PdfCustomizerModal } from './PdfCustomizerModal';
import { SubSubjectPeriodConfigModal, CONFIGURABLE_PERIODS } from './SubSubjectPeriodConfigModal';
import { ThursdayWorkReportModal } from './ThursdayWorkReportModal';

interface StudentMonitoringLogbookProps {
  teacher: TeacherProfile;
  students: Student[];
  currentYear?: string;
  attendance?: AttendanceDatabase;
  grades?: GradeDatabase;
  activeSubSubjects?: string[];
  subScoresState?: Record<string, Record<number, Record<string, number>>>;
  gradeThresholds?: { A: number; B: number; C: number; D: number; E: number };
  selectedS1Months?: string[];
  selectedS2Months?: string[];
  periodSubSubjectsMap?: Record<string, string[]>;
  onUpdatePeriodSubSubjects?: (periodKey: string, subIds: string[]) => void;
  onUpdateSubScores?: (newSubScores: Record<string, Record<number, Record<string, number>>>) => void;
  onUpdateActiveSubSubjects?: (newActiveSubSubjects: string[]) => void;
  onShowToast: (msg: string) => void;
}

// 12 Standard Primary School Subjects as per MoEYS format (IMG_3874)
export const DEFAULT_PRIMARY_SUBJECTS: { id: string; name: string; maxScore: number }[] = [
  { id: 'writing', name: 'សមត្ថភាពសរសេរ', maxScore: 10 },
  { id: 'listening', name: 'សមត្ថភាពស្ដាប់', maxScore: 10 },
  { id: 'reading', name: 'សមត្ថភាពអាន', maxScore: 10 },
  { id: 'speaking', name: 'សមត្ថភាពនិយាយ', maxScore: 10 },
  { id: 'algebra', name: 'ពីជគណិត', maxScore: 10 },
  { id: 'number', name: 'ចំនួន', maxScore: 10 },
  { id: 'geometry', name: 'ធរណីមាត្រ', maxScore: 10 },
  { id: 'measurement', name: 'រង្វាស់រង្វាល់', maxScore: 10 },
  { id: 'morals_civics', name: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', maxScore: 10 },
  { id: 'home_arts', name: 'គេហវិទ្យា-អប់រំសិល្បៈ', maxScore: 10 },
  { id: 'history', name: 'ប្រវត្តិវិទ្យា', maxScore: 10 },
  { id: 'geography', name: 'ភូមិវិទ្យា', maxScore: 10 },
];

export interface PeriodOption {
  key: string;
  label: string;
  type: 'month' | 'semester' | 'annual';
  semesterNum?: 1 | 2;
  monthNum?: number; // 1-12
  gradeKey?: string; // mapping to grade database
}

export const EVALUATION_PERIODS: PeriodOption[] = [
  // Semester 1 Months
  { key: 'm10', label: 'ខែតុលា (Oct)', type: 'month', semesterNum: 1, monthNum: 10, gradeKey: 'm10' },
  { key: 'm11', label: 'ខែវិច្ឆិកា (Nov)', type: 'month', semesterNum: 1, monthNum: 11, gradeKey: 'm11' },
  { key: 'm12', label: 'ខែធ្នូ (Dec)', type: 'month', semesterNum: 1, monthNum: 12, gradeKey: 'm12' },
  { key: 'm01', label: 'ខែមករា (Jan)', type: 'month', semesterNum: 1, monthNum: 1, gradeKey: 'm01' },
  { key: 's1_exam', label: '📝 ប្រឡងឆមាសទី១ (S1 Exam)', type: 'month', semesterNum: 1, gradeKey: 's1_exam' },
  
  // Semester 1 Summary
  { key: 's1_summary', label: '📊 ប្រចាំឆមាសទី១ (Semester 1)', type: 'semester', semesterNum: 1, gradeKey: 's1_summary' },

  // Semester 2 Months
  { key: 'm02', label: 'ខែកុម្ភៈ (Feb)', type: 'month', semesterNum: 2, monthNum: 2, gradeKey: 'm02' },
  { key: 'm03', label: 'ខែមីនា (Mar)', type: 'month', semesterNum: 2, monthNum: 3, gradeKey: 'm03' },
  { key: 'm04', label: 'ខែមេសា (Apr)', type: 'month', semesterNum: 2, monthNum: 4, gradeKey: 'm04' },
  { key: 'm05', label: 'ខែឧសភា (May)', type: 'month', semesterNum: 2, monthNum: 5, gradeKey: 'm05' },
  { key: 'm06', label: 'ខែមិថុនា (Jun)', type: 'month', semesterNum: 2, monthNum: 6, gradeKey: 'm06' },
  { key: 'm07', label: 'ខែកក្កដា (Jul)', type: 'month', semesterNum: 2, monthNum: 7, gradeKey: 'm07' },
  { key: 's2_exam', label: '📝 ប្រឡងឆមាសទី២ (S2 Exam)', type: 'month', semesterNum: 2, gradeKey: 's2_exam' },

  // Semester 2 Summary
  { key: 's2_summary', label: '📊 ប្រចាំឆមាសទី២ (Semester 2)', type: 'semester', semesterNum: 2, gradeKey: 's2_summary' },

  // Annual Summary
  { key: 'annual_summary', label: '🏆 ប្រចាំឆ្នាំ (Annual Summary)', type: 'annual', gradeKey: 'annual_summary' },
];

const PRESET_TEACHER_REFLECTIONS = [
  'សិស្សមានការខិតខំប្រឹងប្រែងរៀនសូត្របានល្អប្រសើរ ឧស្សាហ៍ព្យាយាម និងមានវិន័យថ្លៃថ្នូរ។',
  'សិស្សរៀនពូកែ យល់ដឹងមេរៀនបានលឿន និងសកម្មក្នុងការជួយមិត្តភក្តិក្នុងក្រុម។',
  'សិស្សមានការរីកចម្រើនគួរឱ្យកត់សម្គាល់លើមុខវិជ្ជាភាសាខ្មែរ និងគណិតវិទ្យា។',
  'សិស្សគួរខិតខំពង្រឹងការអាន និងការសរសេរតាមអានបន្ថែមនៅផ្ទះ។',
  'សិស្សគួរយកចិត្តទុកដាក់បន្ថែមលើការគណនា និងការដោះស្រាយចំណោទគណិតវិទ្យា។',
  'សិស្សរៀនបានមធ្យម គួរបង្កើនការយកចិត្តទុកដាក់ស្តាប់គ្រូពន្យល់ និងបំពេញកិច្ចការផ្ទះឱ្យបានទៀងទាត់។',
];

const CATEGORY_META: Record<
  StudentMonitoringEntry['category'],
  { label: string; icon: string; color: string; bg: string; border: string }
> = {
  reading_writing: {
    label: 'អំណាន & សរសេរភាសាខ្មែរ',
    icon: '📖',
    color: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  math: {
    label: 'គណិតវិទ្យា & ការគណនា',
    icon: '🔢',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    border: 'border-blue-200 dark:border-blue-800',
  },
  homework: {
    label: 'ការបំពេញកិច្ចការផ្ទះ',
    icon: '📝',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    border: 'border-amber-200 dark:border-amber-800',
  },
  attendance: {
    label: 'វត្តមាន & ភាពទៀងទាត់',
    icon: '⏰',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    border: 'border-rose-200 dark:border-rose-800',
  },
  behavior: {
    label: 'អាកប្បកិរិយា & វិន័យ',
    icon: '🛡️',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    border: 'border-purple-200 dark:border-purple-800',
  },
  health: {
    label: 'សុខភាព & អនាម័យ',
    icon: '🧼',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  talented: {
    label: 'ទេពកោសល្យ & ភាពសកម្ម',
    icon: '⭐',
    color: 'text-violet-700 dark:text-violet-300',
    bg: 'bg-violet-50 dark:bg-violet-950/50',
    border: 'border-violet-200 dark:border-violet-800',
  },
  other: {
    label: 'កត់ត្រាផ្សេងៗ',
    icon: '📌',
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-50 dark:bg-slate-800/60',
    border: 'border-slate-200 dark:border-slate-700',
  },
};

const STATUS_META: Record<
  StudentMonitoringEntry['status'],
  { label: string; badgeClass: string; icon: any }
> = {
  in_progress: {
    label: 'កំពុងតាមដាន',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800',
    icon: Clock,
  },
  improving: {
    label: 'មានការវិវឌ្ឍន៍ល្អ',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800',
    icon: TrendingUp,
  },
  needs_parent_meeting: {
    label: 'ត្រូវជួបមាតាបិតា',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800',
    icon: AlertCircle,
  },
  resolved: {
    label: 'បានកែលម្អជោគជ័យ',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-800',
    icon: CheckCircle2,
  },
};

// Helper: Calculate Letter Grade
function calculateGradeLetter(avg?: number | null): string {
  const safeAvg = typeof avg === 'number' && !isNaN(avg) ? avg : 0;
  if (safeAvg >= 9.0) return 'A';
  if (safeAvg >= 8.0) return 'B';
  if (safeAvg >= 7.0) return 'C';
  if (safeAvg >= 6.0) return 'D';
  if (safeAvg >= 5.0) return 'E';
  return 'F';
}

/**
 * Calculates REAL actual attendance for a student based on attendance database
 * for a specific period (Month, Semester 1, Semester 2, or Annual).
 */
export function getActualStudentAttendance(
  studentId: number,
  period: PeriodOption,
  attendanceDb: AttendanceDatabase = {}
): { excused: number; unexcused: number; totalAbsences: number; totalDays: number } {
  const dates = Object.keys(attendanceDb);
  if (dates.length === 0) {
    return { excused: 0, unexcused: 0, totalAbsences: 0, totalDays: 0 };
  }

  let excused = 0;
  let unexcused = 0;
  let totalDays = 0;

  dates.forEach((dateStr) => {
    // Parse month number from date string YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length < 2) return;
    const mNum = parseInt(parts[1], 10);

    let isDateInPeriod = false;

    if (period.type === 'month') {
      if (period.monthNum !== undefined && mNum === period.monthNum) {
        isDateInPeriod = true;
      } else if (period.key === 's1_exam') {
        if (mNum === 1 || mNum === 10 || mNum === 11 || mNum === 12) isDateInPeriod = true;
      } else if (period.key === 's2_exam') {
        if (mNum >= 2 && mNum <= 7) isDateInPeriod = true;
      }
    } else if (period.type === 'semester') {
      if (period.semesterNum === 1) {
        // Semester 1: Oct (10), Nov (11), Dec (12), Jan (1)
        if (mNum === 10 || mNum === 11 || mNum === 12 || mNum === 1) {
          isDateInPeriod = true;
        }
      } else if (period.semesterNum === 2) {
        // Semester 2: Feb (2), Mar (3), Apr (4), May (5), Jun (6), Jul (7)
        if (mNum >= 2 && mNum <= 7) {
          isDateInPeriod = true;
        }
      }
    } else if (period.type === 'annual') {
      // All dates in the academic year
      isDateInPeriod = true;
    }

    if (isDateInPeriod) {
      const studentStatus = attendanceDb[dateStr]?.[studentId];
      if (studentStatus) {
        totalDays++;
        if (studentStatus === 'permission') {
          excused++;
        } else if (studentStatus === 'absent') {
          unexcused++;
        }
      }
    }
  });

  return {
    excused,
    unexcused,
    totalAbsences: excused + unexcused,
    totalDays,
  };
}

export const StudentMonitoringLogbook: React.FC<StudentMonitoringLogbookProps> = ({
  teacher,
  students,
  currentYear,
  attendance = {},
  grades = {},
  activeSubSubjects,
  subScoresState: propSubScoresState,
  gradeThresholds: propGradeThresholds,
  selectedS1Months: propSelectedS1Months,
  selectedS2Months: propSelectedS2Months,
  periodSubSubjectsMap: propPeriodSubSubjectsMap,
  onUpdatePeriodSubSubjects,
  onUpdateSubScores,
  onUpdateActiveSubSubjects,
  onShowToast,
}) => {
  const activeYear = currentYear || teacher.academicYear || getActiveAcademicYear();

  // Effective Grade Thresholds
  const effectiveThresholds = useMemo<GradeThresholds>(() => {
    if (propGradeThresholds) return propGradeThresholds;
    const yearSaved = loadYearScopedData<GradeThresholds | null>(activeYear, 'grade_thresholds', null);
    if (yearSaved) return yearSaved;
    try {
      const saved = localStorage.getItem('school_grade_thresholds');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { A: 8.5, B: 7.5, C: 6.5, D: 5.0, E: 4.0 };
  }, [propGradeThresholds, activeYear]);

  // Effective Selected Months for Semester 1 and Semester 2
  const effectiveS1Months = useMemo<string[]>(() => {
    if (propSelectedS1Months && Array.isArray(propSelectedS1Months) && propSelectedS1Months.length > 0) {
      return propSelectedS1Months;
    }
    const yearSaved = loadYearScopedData<string[] | null>(activeYear, 'selected_s1_months', null);
    if (yearSaved && Array.isArray(yearSaved) && yearSaved.length > 0) return yearSaved;
    try {
      const saved = localStorage.getItem('school_selected_s1_months');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['m10', 'm11', 'm12', 'm01'];
  }, [propSelectedS1Months, activeYear]);

  const effectiveS2Months = useMemo<string[]>(() => {
    if (propSelectedS2Months && Array.isArray(propSelectedS2Months) && propSelectedS2Months.length > 0) {
      return propSelectedS2Months;
    }
    const yearSaved = loadYearScopedData<string[] | null>(activeYear, 'selected_s2_months', null);
    if (yearSaved && Array.isArray(yearSaved) && yearSaved.length > 0) return yearSaved;
    try {
      const saved = localStorage.getItem('school_selected_s2_months');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['m02', 'm03', 'm04', 'm05', 'm06', 'm07'];
  }, [propSelectedS2Months, activeYear]);

  // Dynamic Letter Grade Calculator based on effective thresholds (Safe 0 fallback -> F)
  const calculateGradeLetter = useCallback(
    (score: number | undefined | null): string => {
      const num = typeof score === 'number' && !isNaN(score) ? score : 0;
      return getGradeClassification(num, effectiveThresholds).letter;
    },
    [effectiveThresholds]
  );

  // Navigation tab
  const [activeMainTab, setActiveMainTab] = useState<'monthly_card' | 'class_ledger' | 'case_logbook'>('monthly_card');

  // Selected Evaluation Period (Month, Semester 1, Semester 2, Annual)
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string>('m12');

  const selectedPeriod = useMemo(() => {
    return EVALUATION_PERIODS.find((p) => p.key === selectedPeriodKey) || EVALUATION_PERIODS[2]; // default Dec
  }, [selectedPeriodKey]);

  // District Office & Header settings
  const [districtOffice, setDistrictOffice] = useState<string>(() => {
    const saved = loadYearScopedData<string>(activeYear, 'monitoring_district_office', '');
    return saved || 'ការិយាល័យអប់រំ យុវជន និងកីឡាស្រុកសៀមបូក';
  });

  const [schoolName, setSchoolName] = useState<string>(() => {
    return teacher.school || 'បឋមសិក្សា អូរស្វាយកណ្តាល';
  });

  const [lunarDateText, setLunarDateText] = useState<string>(() => {
    const saved = loadYearScopedData<string>(activeYear, 'monitoring_lunar_date', '');
    return saved || getKhmerLunarDate(new Date()).fullChhankatei;
  });
  const [solarDateText, setSolarDateText] = useState<string>(() => {
    const saved = loadYearScopedData<string>(activeYear, 'monitoring_solar_date', '');
    if (saved) return saved;
    const loc = teacher.school ? teacher.school.replace(/^(សាលាបឋមសិក្សា|បឋមសិក្សា|សាលា)\s*/i, '').trim() : 'អូរស្វាយកណ្តាល';
    return `ធ្វើនៅ${loc}, ${getKhmerSouriyateiDate(new Date())}`;
  });

  // Period-based sub-subjects map (configurable per month and per semester exam)
  const [periodSubSubjectsMap, setPeriodSubSubjectsMap] = useState<Record<string, string[]>>(() => {
    if (propPeriodSubSubjectsMap && typeof propPeriodSubSubjectsMap === 'object' && Object.keys(propPeriodSubSubjectsMap).length > 0) {
      return propPeriodSubSubjectsMap;
    }
    const yearSaved = loadYearScopedData<Record<string, string[]> | null>(
      activeYear,
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

  // Sync when propPeriodSubSubjectsMap changes
  useEffect(() => {
    if (propPeriodSubSubjectsMap && typeof propPeriodSubSubjectsMap === 'object') {
      setPeriodSubSubjectsMap((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(propPeriodSubSubjectsMap)) {
          return prev;
        }
        return propPeriodSubSubjectsMap;
      });
    }
  }, [propPeriodSubSubjectsMap]);

  const [isSubSubjectModalOpen, setIsSubSubjectModalOpen] = useState(false);
  const [modalConfigPeriodKey, setModalConfigPeriodKey] = useState<string>('m10');
  const [isThursdayReportModalOpen, setIsThursdayReportModalOpen] = useState(false);

  // Helper to get active sub-subject IDs for a given period
  const getSubIdsForPeriod = useCallback(
    (pKey: string): string[] => {
      if (
        periodSubSubjectsMap[pKey] &&
        Array.isArray(periodSubSubjectsMap[pKey]) &&
        periodSubSubjectsMap[pKey].length > 0
      ) {
        return periodSubSubjectsMap[pKey];
      }
      if (activeSubSubjects && activeSubSubjects.length > 0) return activeSubSubjects;
      const yearSaved = loadYearScopedData<string[] | null>(activeYear, 'active_sub_subjects', null);
      if (yearSaved && Array.isArray(yearSaved) && yearSaved.length > 0) return yearSaved;
      try {
        const localSaved = localStorage.getItem('school_active_sub_subjects');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
      return PRIMARY_SUB_SUBJECTS.filter((s) => s.defaultSelected).map((s) => s.id);
    },
    [periodSubSubjectsMap, activeSubSubjects, activeYear]
  );

  // Active Sub-Subjects List for the currently selected period
  const activeSubSubjectsList: PrimarySubSubject[] = useMemo(() => {
    const allDefs = getAllPrimarySubSubjects();

    if (selectedPeriod.type === 'month' || selectedPeriod.key === 's1_exam' || selectedPeriod.key === 's2_exam') {
      const ids = getSubIdsForPeriod(selectedPeriod.key);
      const filtered = allDefs.filter((s) => ids.includes(s.id));
      return filtered.length > 0 ? filtered : allDefs.slice(0, 12);
    }

    if (selectedPeriod.key === 's1_summary') {
      // Semester 1 summary: union of sub-subjects evaluated in S1 months and S1 exam
      const s1Keys = [...effectiveS1Months, 's1_exam'];
      const s1SubIdsSet = new Set<string>();
      s1Keys.forEach((k) => {
        const ids = getSubIdsForPeriod(k);
        ids.forEach((id) => s1SubIdsSet.add(id));
      });
      const filtered = allDefs.filter((s) => s1SubIdsSet.has(s.id));
      return filtered.length > 0 ? filtered : allDefs.slice(0, 12);
    }

    if (selectedPeriod.key === 's2_summary') {
      // Semester 2 summary: union of sub-subjects evaluated in S2 months and S2 exam
      const s2Keys = [...effectiveS2Months, 's2_exam'];
      const s2SubIdsSet = new Set<string>();
      s2Keys.forEach((k) => {
        const ids = getSubIdsForPeriod(k);
        ids.forEach((id) => s2SubIdsSet.add(id));
      });
      const filtered = allDefs.filter((s) => s2SubIdsSet.has(s.id));
      return filtered.length > 0 ? filtered : allDefs.slice(0, 12);
    }

    // Annual summary: union of all sub-subjects across both semesters
    const allPeriodKeys = [...effectiveS1Months, 's1_exam', ...effectiveS2Months, 's2_exam'];
    const annualSubIdsSet = new Set<string>();
    allPeriodKeys.forEach((k) => {
      const ids = getSubIdsForPeriod(k);
      ids.forEach((id) => annualSubIdsSet.add(id));
    });
    const filtered = allDefs.filter((s) => annualSubIdsSet.has(s.id));
    return filtered.length > 0 ? filtered : allDefs.slice(0, 12);
  }, [selectedPeriod, getSubIdsForPeriod, effectiveS1Months, effectiveS2Months]);

  // Handlers for saving period sub-subjects
  const handleSavePeriodSubSubjects = (pKey: string, subIds: string[]) => {
    setPeriodSubSubjectsMap((prev) => {
      const next = { ...prev, [pKey]: subIds };
      saveYearScopedData(activeYear, 'monitoring_period_sub_subjects', next);
      try {
        localStorage.setItem('school_monitoring_period_sub_subjects', JSON.stringify(next));
      } catch {}
      return next;
    });
    onUpdatePeriodSubSubjects?.(pKey, subIds);
  };

  const handleApplyToAllPeriods = (subIds: string[]) => {
    const next: Record<string, string[]> = {};
    CONFIGURABLE_PERIODS.forEach((p) => {
      next[p.key] = subIds;
    });
    setPeriodSubSubjectsMap(next);
    saveYearScopedData(activeYear, 'monitoring_period_sub_subjects', next);
    saveYearScopedData(activeYear, 'active_sub_subjects', subIds);
    try {
      localStorage.setItem('school_monitoring_period_sub_subjects', JSON.stringify(next));
      localStorage.setItem('school_active_sub_subjects', JSON.stringify(subIds));
    } catch {}
    onUpdateActiveSubSubjects?.(subIds);
    CONFIGURABLE_PERIODS.forEach((p) => {
      onUpdatePeriodSubSubjects?.(p.key, subIds);
    });
  };

  // Live Sub-Scores State (Shared with Grade Manager)
  const [internalSubScores, setInternalSubScores] = useState<Record<string, Record<number, Record<string, number>>>>(() => {
    if (propSubScoresState && Object.keys(propSubScoresState).length > 0) return propSubScoresState;
    const yearSaved = loadYearScopedData<Record<string, Record<number, Record<string, number>>> | null>(
      activeYear,
      'sub_scores',
      null
    );
    if (yearSaved && typeof yearSaved === 'object') return yearSaved;
    try {
      const localSaved = localStorage.getItem('school_sub_scores_db');
      if (localSaved) return JSON.parse(localSaved);
    } catch {}
    return {};
  });

  // Keep internal state updated if prop changes
  useEffect(() => {
    if (propSubScoresState) {
      setInternalSubScores((prev) => {
        if (prev === propSubScoresState) return prev;
        return propSubScoresState;
      });
    }
  }, [propSubScoresState]);

  // Monthly/Period Results Database: Record<periodKey, Record<studentId, StudentMonthlyResultRecord>>
  const [periodResultsMap, setPeriodResultsMap] = useState<Record<string, Record<number, StudentMonthlyResultRecord>>>(() => {
    const saved = loadYearScopedData<Record<string, Record<number, StudentMonthlyResultRecord>> | null>(
      activeYear,
      'student_monthly_progress_records',
      null
    );
    if (saved && typeof saved === 'object') return saved;
    return {};
  });

  // Save period results
  useEffect(() => {
    saveYearScopedData(activeYear, 'student_monthly_progress_records', periodResultsMap);
  }, [periodResultsMap, activeYear]);

  useEffect(() => {
    saveYearScopedData(activeYear, 'monitoring_district_office', districtOffice);
  }, [districtOffice, activeYear]);

  // Selected Student ID for Card View
  const [selectedStudentId, setSelectedStudentId] = useState<number>(() => {
    return students[0]?.id || 1;
  });

  // Ensure selectedStudentId is valid if students change
  useEffect(() => {
    if (students.length > 0 && !students.some((s) => s.id === selectedStudentId)) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  // Qualitative Case Logbook Entries State
  const [caseEntries, setCaseEntries] = useState<StudentMonitoringEntry[]>(() => {
    const saved = loadYearScopedData<StudentMonitoringEntry[] | null>(activeYear, 'student_monitoring_logbook', null);
    if (saved && Array.isArray(saved)) return saved;

    if (students.length > 0) {
      const s1 = students[0];
      const s2 = students[1] || students[0];
      return [
        {
          id: 'mon_1',
          studentId: s1.id,
          studentName: s1.name,
          gender: s1.gender,
          date: new Date().toISOString().split('T')[0],
          category: 'reading_writing',
          severity: 'high',
          observedIssue: 'សិស្សអានមិនទាន់ស្ទាត់តួអក្សរផ្សំ និងព្យាង្គតម្រួត នៅតែប្រកបមួយៗយឺត',
          teacherIntervention: 'ផ្តល់កាតអានពាក្យបំប៉ន ១៥ នាទីរៀងរាល់ម៉ោងចេញលេង និងចាត់តាំងមិត្តជួយមិត្ត',
          progressNote: 'សិស្សចាប់ផ្តើមស្គាល់ស្រៈផ្សំបានច្រើនជាងមុន និងមានទំនុកចិត្តក្នុងការអាន',
          parentFeedback: 'មាតាបិតាបានសហការជួយបង្រៀនអានបន្ថែមនៅផ្ទះរាល់ល្ងាច',
          status: 'improving',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'mon_2',
          studentId: s2.id,
          studentName: s2.name,
          gender: s2.gender,
          date: new Date().toISOString().split('T')[0],
          category: 'math',
          severity: 'medium',
          observedIssue: 'ច្រឡំវិធីគុណ និងវិធីចែកដែលមានតួចែកពីរខ្ទង់',
          teacherIntervention: 'ពន្យល់ជំហានវិធីចែកឡើងវិញដោយប្រើតារាងគុណជំនួយ',
          progressNote: 'អាចគណនាលំហាត់គំរូបានត្រឹមត្រូវដោយខ្លួនឯង',
          parentFeedback: 'បានទាក់ទងតាមទូរស័ព្ទ',
          status: 'resolved',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
    return [];
  });

  useEffect(() => {
    saveYearScopedData(activeYear, 'student_monitoring_logbook', caseEntries);
  }, [caseEntries, activeYear]);

  // Dynamic Header Title based on Period (Month vs Semester 1 vs Semester 2 vs Annual)
  const getPeriodDisplayTitle = (p: PeriodOption) => {
    if (p.key === 's1_exam') {
      return {
        mainTitle: `លទ្ធផលសិក្សារបស់សិស្ស ${teacher.grade || 'ថ្នាក់ទី ៦-ក'}`,
        subTitle: `ប្រឡងឆមាសទី១ ឆ្នាំសិក្សា ${activeYear}`,
        periodName: `ប្រឡងឆមាសទី១`,
      };
    }
    if (p.key === 's2_exam') {
      return {
        mainTitle: `លទ្ធផលសិក្សារបស់សិស្ស ${teacher.grade || 'ថ្នាក់ទី ៦-ក'}`,
        subTitle: `ប្រឡងឆមាសទី២ ឆ្នាំសិក្សា ${activeYear}`,
        periodName: `ប្រឡងឆមាសទី២`,
      };
    }
    if (p.type === 'month') {
      const mLabel = p.label.split(' ')[0].replace('ខែ', '');
      return {
        mainTitle: `លទ្ធផលសិក្សារបស់សិស្ស ${teacher.grade || 'ថ្នាក់ទី ៦-ក'}`,
        subTitle: `ប្រចាំ ខែ${mLabel} ឆ្នាំសិក្សា ${activeYear}`,
        periodName: `ខែ${mLabel}`,
      };
    } else if (p.type === 'semester') {
      const sName = p.semesterNum === 1 ? 'ឆមាសទី១' : 'ឆមាសទី២';
      return {
        mainTitle: `លទ្ធផលសិក្សារបស់សិស្ស ${teacher.grade || 'ថ្នាក់ទី ៦-ក'}`,
        subTitle: `ប្រចាំ ${sName} ឆ្នាំសិក្សា ${activeYear}`,
        periodName: sName,
      };
    } else {
      return {
        mainTitle: `លទ្ធផលសិក្សារបស់សិស្ស ${teacher.grade || 'ថ្នាក់ទី ៦-ក'}`,
        subTitle: `ប្រចាំឆ្នាំ ឆ្នាំសិក្សា ${activeYear}`,
        periodName: 'ប្រចាំឆ្នាំ',
      };
    }
  };

  // Helper to extract a single sub-score for a single month/exam period (Strictly matches Grade Manager & AdminTab)
  const getRawMonthSubScore = (
    pKey: string,
    studId: number,
    sub: PrimarySubSubject,
    subDb: Record<string, Record<number | string, Record<string, number>>>,
    gradeDb: GradeDatabase
  ): number => {
    // 1. Direct from subScores state
    if (subDb[pKey]?.[studId]?.[sub.id] !== undefined) {
      const val = Number(subDb[pKey][studId][sub.id]);
      return isNaN(val) ? 0 : val;
    }
    // 2. From gradeDb subScores if embedded
    if (gradeDb[pKey]?.[studId]?.subScores?.[sub.id] !== undefined) {
      const val = Number(gradeDb[pKey][studId].subScores![sub.id]);
      return isNaN(val) ? 0 : val;
    }
    // 3. Fallback from main category if exists in gradeDb
    const g = gradeDb[pKey]?.[studId];
    if (g) {
      if (sub.category === 'khmer' && typeof g.khmer === 'number') return g.khmer;
      if (sub.category === 'math' && typeof g.math === 'number') return g.math;
      if (sub.category === 'science' && typeof g.science === 'number') return g.science;
      if (sub.category === 'social' && typeof g.social === 'number') return g.social;
    }
    return 0;
  };

  // Helper to compute sub-score for semester (averaging months + exam)
  const getSemesterSubScore = useCallback(
    (
      semNum: 1 | 2,
      studId: number,
      sub: PrimarySubSubject,
      subDb: Record<string, Record<number | string, Record<string, number>>>,
      gradeDb: GradeDatabase
    ): number => {
      const months = semNum === 1 ? effectiveS1Months : effectiveS2Months;
      const examKey = semNum === 1 ? 's1_exam' : 's2_exam';

      if (months.length === 0) return 0;

      // Filter months where this sub was active or has a recorded score
      const activeMonthsForSub = months.filter((mk) => {
        const pSubs = getSubIdsForPeriod(mk);
        const hasScore =
          subDb[mk]?.[studId]?.[sub.id] !== undefined ||
          gradeDb[mk]?.[studId]?.subScores?.[sub.id] !== undefined;
        return pSubs.includes(sub.id) || hasScore;
      });

      const evalMonths = activeMonthsForSub.length > 0 ? activeMonthsForSub : months;

      let mSum = 0;
      evalMonths.forEach((mk) => {
        mSum += getRawMonthSubScore(mk, studId, sub, subDb, gradeDb);
      });
      const mAvg = mSum / (evalMonths.length || 1);

      // Check if exam evaluated this sub
      const examSubs = getSubIdsForPeriod(examKey);
      const isExamActiveForSub = examSubs.includes(sub.id);
      const hasExam =
        subDb[examKey]?.[studId]?.[sub.id] !== undefined ||
        gradeDb[examKey]?.[studId]?.subScores?.[sub.id] !== undefined ||
        (gradeDb[examKey]?.[studId] && (gradeDb[examKey][studId].khmer !== undefined || gradeDb[examKey][studId].math !== undefined));

      if (hasExam && isExamActiveForSub) {
        const examVal = getRawMonthSubScore(examKey, studId, sub, subDb, gradeDb);
        return Number(((mAvg + examVal) / 2).toFixed(2));
      }

      return Number(mAvg.toFixed(2));
    },
    [effectiveS1Months, effectiveS2Months, getSubIdsForPeriod]
  );

  // Compute records for ALL students for the selected period with real subject ranks & class ranks
  const currentPeriodRecords = useMemo(() => {
    const activeSubIds = activeSubSubjectsList.map((s) => s.id);

    // Compute standard summary using the exact same gradeManager functions as AdminTab
    const periodSummariesMap = new Map<number, { avg: number; total: number; rank: number; letter: string; label: string }>();

    if (selectedPeriod.type === 'month' || selectedPeriod.key === 's1_exam' || selectedPeriod.key === 's2_exam') {
      const singleSummary = calculateSinglePeriodSummary(
        students,
        grades,
        selectedPeriod.key,
        effectiveThresholds,
        activeSubIds,
        internalSubScores
      );
      singleSummary.students.forEach((item) => {
        periodSummariesMap.set(item.student.id, {
          avg: item.avg,
          total: item.total,
          rank: item.rank,
          letter: item.classification.letter,
          label: item.classification.label,
        });
      });
    } else if (selectedPeriod.key === 's1_summary') {
      const s1Summary = calculateSemesterSummary(
        students,
        grades,
        1,
        effectiveS1Months,
        effectiveThresholds,
        activeSubIds,
        internalSubScores
      );
      s1Summary.students.forEach((item) => {
        periodSummariesMap.set(item.student.id, {
          avg: item.semesterAvg,
          total: Number((item.semesterAvg * activeSubIds.length).toFixed(2)),
          rank: item.rank,
          letter: item.classification.letter,
          label: item.classification.label,
        });
      });
    } else if (selectedPeriod.key === 's2_summary') {
      const s2Summary = calculateSemesterSummary(
        students,
        grades,
        2,
        effectiveS2Months,
        effectiveThresholds,
        activeSubIds,
        internalSubScores
      );
      s2Summary.students.forEach((item) => {
        periodSummariesMap.set(item.student.id, {
          avg: item.semesterAvg,
          total: Number((item.semesterAvg * activeSubIds.length).toFixed(2)),
          rank: item.rank,
          letter: item.classification.letter,
          label: item.classification.label,
        });
      });
    } else {
      // Annual summary
      const annualSummary = calculateAnnualSummary(
        students,
        grades,
        effectiveThresholds,
        effectiveS1Months,
        effectiveS2Months,
        activeSubIds,
        internalSubScores
      );
      annualSummary.students.forEach((item) => {
        periodSummariesMap.set(item.student.id, {
          avg: item.annualAvg,
          total: Number((item.annualAvg * activeSubIds.length).toFixed(2)),
          rank: item.rank,
          letter: item.classification.letter,
          label: item.classification.label,
        });
      });
    }

    const titleInfo = getPeriodDisplayTitle(selectedPeriod);

    const list: StudentMonthlyResultRecord[] = students.map((stud) => {
      const periodGroup = periodResultsMap[selectedPeriod.key] || {};
      const existing = periodGroup[stud.id];
      const actualAtt = getActualStudentAttendance(stud.id, selectedPeriod, attendance);

      // Compute dynamic scores for all active sub-subjects
      const dynamicScores: SubjectScoreItem[] = activeSubSubjectsList.map((sub) => {
        let scoreVal = 0;

        if (selectedPeriod.type === 'month') {
          scoreVal = getRawMonthSubScore(selectedPeriod.key, stud.id, sub, internalSubScores, grades);
        } else if (selectedPeriod.type === 'semester') {
          scoreVal = getSemesterSubScore(selectedPeriod.semesterNum || 1, stud.id, sub, internalSubScores, grades);
        } else {
          // Annual summary calculation (Average of Semester 1 and Semester 2)
          const s1 = getSemesterSubScore(1, stud.id, sub, internalSubScores, grades);
          const s2 = getSemesterSubScore(2, stud.id, sub, internalSubScores, grades);
          scoreVal = Number(((s1 + s2) / 2).toFixed(2));
        }

        return {
          id: sub.id,
          name: sub.name,
          maxScore: 10,
          score: scoreVal,
          rank: 1, // Will be computed dynamically per subject below
          grade: getGradeClassification(scoreVal, effectiveThresholds).letter,
        };
      });

      const summaryMeta = periodSummariesMap.get(stud.id);
      const computedTotal = Number(dynamicScores.reduce((a, b) => a + b.score, 0).toFixed(2));
      const computedAvg = Number((computedTotal / (dynamicScores.length || 1)).toFixed(2));

      // User instruction:
      // "ចំណែកប្រចាំឆមាសទី១ និងប្រឆមាសទី២ ប្រចាំឆ្នាំយើង យកតែមធ្យមភាគមកបូកសរុប"
      // For Semester 1 summary, Semester 2 summary, and Annual summary: total is the exact sum of sub-subject averages!
      const isSummaryPeriod = selectedPeriod.type === 'semester' || selectedPeriod.type === 'annual';
      const totalScore = isSummaryPeriod
        ? computedTotal
        : summaryMeta?.total !== undefined
        ? summaryMeta.total
        : computedTotal;
      const averageScore = isSummaryPeriod
        ? computedAvg
        : summaryMeta?.avg !== undefined
        ? summaryMeta.avg
        : computedAvg;
      const classRank = summaryMeta?.rank || 1;

      return {
        id: `rec_${stud.id}_${selectedPeriod.key}_${activeYear}`,
        studentId: stud.id,
        studentName: stud.name,
        gender: stud.gender,
        month: titleInfo.periodName,
        academicYear: activeYear,
        grade: teacher.grade || 'ថ្នាក់ទី ៦-ក',
        schoolName: schoolName,
        districtOffice: districtOffice,
        scores: dynamicScores,
        totalScore: totalScore,
        averageScore: averageScore,
        classRank: classRank,
        totalStudents: students.length || 1,
        excusedAbsences: existing?.excusedAbsences !== undefined ? existing.excusedAbsences : actualAtt.excused,
        unexcusedAbsences: existing?.unexcusedAbsences !== undefined ? existing.unexcusedAbsences : actualAtt.unexcused,
        lunarDate: existing?.lunarDate || lunarDateText,
        solarDate: existing?.solarDate || solarDateText,
        teacherReflection:
          existing?.teacherReflection ||
          (stud.gender === 'ស្រី'
            ? 'សិស្សមានការខិតខំប្រឹងប្រែងរៀនសូត្របានល្អប្រសើរ ឧស្សាហ៍ព្យាយាម និងមានវិន័យថ្លៃថ្នូរ។'
            : 'សិស្សរៀនពូកែ យល់ដឹងមេរៀនបានលឿន និងសកម្មក្នុងការជួយមិត្តភក្តិក្នុងក្រុម។'),
        parentFeedback: existing?.parentFeedback || '',
        teacherName: teacher.name || 'គ្រូបន្ទុកថ្នាក់',
      };
    });

    // Compute Subject Rank for each subject across all students
    activeSubSubjectsList.forEach((sub) => {
      const studentSubjectScores = list.map((rec) => {
        const item = rec.scores.find((s) => s.id === sub.id);
        return {
          studentId: rec.studentId,
          score: item ? item.score : 0,
        };
      });

      // Sort descending
      studentSubjectScores.sort((a, b) => b.score - a.score);

      const rankMap = new Map<number, number>();
      studentSubjectScores.forEach((entry, idx) => {
        if (!rankMap.has(entry.studentId)) {
          if (idx > 0 && entry.score === studentSubjectScores[idx - 1].score) {
            rankMap.set(entry.studentId, rankMap.get(studentSubjectScores[idx - 1].studentId)!);
          } else {
            rankMap.set(entry.studentId, idx + 1);
          }
        }
      });

      list.forEach((rec) => {
        const item = rec.scores.find((s) => s.id === sub.id);
        if (item) {
          item.rank = rankMap.get(rec.studentId) || 1;
        }
      });
    });

    // Re-rank students for semester and annual summaries based on averageScore
    if (selectedPeriod.type === 'semester' || selectedPeriod.type === 'annual') {
      const sortedForRank = [...list].sort((a, b) => {
        if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        if (a.gender === 'ស្រី' && b.gender !== 'ស្រី') return -1;
        if (b.gender === 'ស្រី' && a.gender !== 'ស្រី') return 1;
        return a.studentName.localeCompare(b.studentName);
      });

      const classRankMap = new Map<number, number>();
      sortedForRank.forEach((entry, idx) => {
        if (idx > 0 && entry.averageScore === sortedForRank[idx - 1].averageScore) {
          classRankMap.set(entry.studentId, classRankMap.get(sortedForRank[idx - 1].studentId)!);
        } else {
          classRankMap.set(entry.studentId, idx + 1);
        }
      });

      list.forEach((rec) => {
        rec.classRank = classRankMap.get(rec.studentId) || 1;
      });
    }

    return list;
  }, [
    students,
    selectedPeriod,
    periodResultsMap,
    internalSubScores,
    activeSubSubjectsList,
    effectiveThresholds,
    effectiveS1Months,
    effectiveS2Months,
    activeYear,
    schoolName,
    districtOffice,
    lunarDateText,
    solarDateText,
    attendance,
    grades,
    getSemesterSubScore,
  ]);

  // Current viewing student record
  const currentStudentRecord = useMemo(() => {
    const found = currentPeriodRecords.find((r) => r.studentId === selectedStudentId);
    if (found) return found;
    if (students.length > 0) return currentPeriodRecords[0];
    return null;
  }, [currentPeriodRecords, selectedStudentId, students]);

  // Editing state for current student
  const [editingScores, setEditingScores] = useState<SubjectScoreItem[]>([]);
  const [editingExcused, setEditingExcused] = useState<number>(0);
  const [editingUnexcused, setEditingUnexcused] = useState<number>(0);
  const [editingReflection, setEditingReflection] = useState<string>('');
  const [editingParentFeedback, setEditingParentFeedback] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync editing fields when currentStudentRecord changes
  useEffect(() => {
    if (currentStudentRecord) {
      setEditingScores(currentStudentRecord.scores);
      setEditingExcused(currentStudentRecord.excusedAbsences || 0);
      setEditingUnexcused(currentStudentRecord.unexcusedAbsences || 0);
      setEditingReflection(currentStudentRecord.teacherReflection || '');
      setEditingParentFeedback(currentStudentRecord.parentFeedback || '');
    }
  }, [currentStudentRecord?.studentId, selectedPeriodKey]);

  // Save changes to current student's record and sync with subScoresState
  const handleSaveStudentResult = () => {
    if (!currentStudentRecord) return;

    const total = editingScores.reduce((sum, s) => sum + (Number(s.score) || 0), 0);
    const avg = Number((total / (editingScores.length || 1)).toFixed(2));

    const updatedScores = editingScores.map((s) => ({
      ...s,
      grade: calculateGradeLetter(Number(s.score) || 0),
    }));

    const updatedRecord: StudentMonthlyResultRecord = {
      ...currentStudentRecord,
      scores: updatedScores,
      totalScore: Number(total.toFixed(2)),
      averageScore: avg,
      excusedAbsences: Number(editingExcused) || 0,
      unexcusedAbsences: Number(editingUnexcused) || 0,
      teacherReflection: editingReflection,
      parentFeedback: editingParentFeedback,
      lunarDate: lunarDateText,
      solarDate: solarDateText,
      districtOffice,
      schoolName,
      teacherName: teacher.name || 'គ្រូបន្ទុកថ្នាក់',
    };

    setPeriodResultsMap((prev) => {
      const pObj = prev[selectedPeriodKey] || {};
      return {
        ...prev,
        [selectedPeriodKey]: {
          ...pObj,
          [currentStudentRecord.studentId]: updatedRecord,
        },
      };
    });

    // Two-Way Sync into subScoresState database
    setInternalSubScores((prev) => {
      const pMap = prev[selectedPeriodKey] || {};
      const studMap = { ...(pMap[currentStudentRecord.studentId] || {}) };

      editingScores.forEach((s) => {
        studMap[s.id] = Number(s.score) || 0;
      });

      const nextSubScores = {
        ...prev,
        [selectedPeriodKey]: {
          ...pMap,
          [currentStudentRecord.studentId]: studMap,
        },
      };

      saveYearScopedData(activeYear, 'sub_scores', nextSubScores);
      try {
        localStorage.setItem('school_sub_scores_db', JSON.stringify(nextSubScores));
      } catch {}

      if (onUpdateSubScores) {
        onUpdateSubScores(nextSubScores);
      }

      return nextSubScores;
    });

    setIsEditModalOpen(false);
    onShowToast(`បានរក្សាទុកលទ្ធផលសិក្សារបស់ ${currentStudentRecord.studentName} សម្រាប់ ${selectedPeriod.label} និងភ្ជាប់ទិន្នន័យទៅផ្នែកពិន្ទុ & និទ្ទេសជោគជ័យ!`);
  };

  // Quick inline update for a single score with two-way sync
  const handleUpdateSingleScore = (subjectId: string, newScoreVal: number) => {
    if (!currentStudentRecord) return;
    const clamped = Math.max(0, Math.min(10, newScoreVal));

    const updatedScores = currentStudentRecord.scores.map((s) => {
      if (s.id === subjectId) {
        return { ...s, score: clamped, grade: calculateGradeLetter(clamped) };
      }
      return s;
    });

    const total = updatedScores.reduce((sum, s) => sum + (Number(s.score) || 0), 0);
    const avg = Number((total / (updatedScores.length || 1)).toFixed(2));

    const updatedRecord: StudentMonthlyResultRecord = {
      ...currentStudentRecord,
      scores: updatedScores,
      totalScore: Number(total.toFixed(2)),
      averageScore: avg,
    };

    setPeriodResultsMap((prev) => {
      const pObj = prev[selectedPeriodKey] || {};
      return {
        ...prev,
        [selectedPeriodKey]: {
          ...pObj,
          [currentStudentRecord.studentId]: updatedRecord,
        },
      };
    });

    // Two-Way Sync into subScores database
    setInternalSubScores((prev) => {
      const pMap = prev[selectedPeriodKey] || {};
      const studMap = { ...(pMap[currentStudentRecord.studentId] || {}) };
      studMap[subjectId] = clamped;

      const nextSubScores = {
        ...prev,
        [selectedPeriodKey]: {
          ...pMap,
          [currentStudentRecord.studentId]: studMap,
        },
      };

      saveYearScopedData(activeYear, 'sub_scores', nextSubScores);
      try {
        localStorage.setItem('school_sub_scores_db', JSON.stringify(nextSubScores));
      } catch {}

      if (onUpdateSubScores) {
        onUpdateSubScores(nextSubScores);
      }

      return nextSubScores;
    });
  };

  // Sync / Refresh Real Attendance from Attendance DB
  const handleSyncRealAttendance = () => {
    if (!currentStudentRecord) return;
    const actualAtt = getActualStudentAttendance(currentStudentRecord.studentId, selectedPeriod, attendance);
    setEditingExcused(actualAtt.excused);
    setEditingUnexcused(actualAtt.unexcused);

    const updatedRecord: StudentMonthlyResultRecord = {
      ...currentStudentRecord,
      excusedAbsences: actualAtt.excused,
      unexcusedAbsences: actualAtt.unexcused,
    };

    setPeriodResultsMap((prev) => {
      const pObj = prev[selectedPeriodKey] || {};
      return {
        ...prev,
        [selectedPeriodKey]: {
          ...pObj,
          [currentStudentRecord.studentId]: updatedRecord,
        },
      };
    });

    onShowToast(`បានស្រង់អវត្តមានជាក់ស្តែង៖ ច្បាប់ ${actualAtt.excused} ដង, ឥតច្បាប់ ${actualAtt.unexcused} ដង`);
  };

  // Navigate next / prev student
  const handlePrevStudent = () => {
    const idx = students.findIndex((s) => s.id === selectedStudentId);
    if (idx > 0) {
      setSelectedStudentId(students[idx - 1].id);
    } else if (students.length > 0) {
      setSelectedStudentId(students[students.length - 1].id);
    }
  };

  const handleNextStudent = () => {
    const idx = students.findIndex((s) => s.id === selectedStudentId);
    if (idx >= 0 && idx < students.length - 1) {
      setSelectedStudentId(students[idx + 1].id);
    } else if (students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
  };

  // Case Modal State
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<StudentMonitoringEntry | null>(null);
  const [formCaseStudentId, setFormCaseStudentId] = useState<number>(students[0]?.id || 1);
  const [formCaseDate, setFormCaseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formCaseCategory, setFormCaseCategory] = useState<StudentMonitoringEntry['category']>('reading_writing');
  const [formCaseSeverity, setFormCaseSeverity] = useState<StudentMonitoringEntry['severity']>('high');
  const [formCaseIssue, setFormCaseIssue] = useState('');
  const [formCaseIntervention, setFormCaseIntervention] = useState('');
  const [formCaseProgress, setFormCaseProgress] = useState('');
  const [formCaseParent, setFormCaseParent] = useState('');
  const [formCaseStatus, setFormCaseStatus] = useState<StudentMonitoringEntry['status']>('in_progress');

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [printOrientation, setPrintOrientation] = useState<'portrait' | 'landscape' | 'dual_landscape'>('portrait');

  // Helper to build Portrait Card HTML strictly fitting within 1 A4 page with authentic MoEYS border
  const buildPortraitCardInnerHtml = (
    rec: StudentMonthlyResultRecord,
    titleInfo: { mainTitle: string; subTitle: string; periodName: string }
  ): string => {
    const rowsHtml = rec.scores
      .map((item, idx) => {
        return `
        <tr style="line-height: 1.25;">
          <td style="border: 1px solid #1e293b; text-align: center; font-size: 8.8pt; padding: 2px 2px;">${idx + 1}</td>
          <td style="border: 1px solid #1e293b; padding: 2px 8px; font-size: 8.8pt; white-space: nowrap; font-weight: 500; text-align: left;">${item.name}</td>
          <td style="border: 1px solid #1e293b; text-align: center; font-size: 8.8pt; padding: 2px 2px;">${item.maxScore.toFixed(1)}</td>
          <td style="border: 1px solid #1e293b; text-align: center; font-size: 8.8pt; font-weight: bold; padding: 2px 2px;">${item.score.toFixed(2)}</td>
          <td style="border: 1px solid #1e293b; text-align: center; font-size: 8.8pt; font-weight: bold; color: #b91c1c; padding: 2px 2px;">${item.rank || '-'}</td>
          <td style="border: 1px solid #1e293b; text-align: center; font-size: 8.8pt; font-weight: bold; padding: 2px 2px;">${item.grade || calculateGradeLetter(item.score)}</td>
        </tr>
      `;
      })
      .join('');

    return `
      <div class="portrait-card-wrapper">
        <div class="portrait-card-inner">
          <!-- Top Header: ១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់ -->
          <div style="text-align: center; margin-bottom: 4px;">
            <div class="moul country">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div class="moul motto">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div class="ornament">— ༺ ៚ ༻ —</div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 6px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
            <div class="school-header-left">
              <div class="office">${rec.districtOffice}</div>
              <div class="school">${rec.schoolName}</div>
            </div>
            <div style="text-align: right;">
              <div class="grade-label">ថ្នាក់ទី៖ <strong>${rec.grade || teacher.grade || '៦'}</strong></div>
            </div>
          </div>

          <!-- Official Document Title -->
          <div class="center-title-badge">
            <div class="moul main-title">${titleInfo.mainTitle}</div>
            <div class="sub-title">${titleInfo.subTitle}</div>
          </div>

          <!-- Student Identity Row (Clean Official Grid) -->
          <div class="student-info-strip">
            <div class="info-cell"><span>ឈ្មោះសិស្ស៖ </span><strong class="student-name">${rec.studentName}</strong></div>
            <div class="info-cell"><span>ភេទ៖ </span><strong>${rec.gender}</strong></div>
            <div class="info-cell"><span>អត្តលេខ៖ </span><strong>${students.find((s) => s.id === rec.studentId)?.civilId || rec.studentId}</strong></div>
          </div>

          <!-- Scores Table (Strictly formatted, Edge-to-Edge Column Widths) -->
          <table class="scores-table">
            <thead>
              <tr>
                <th style="width: 36px;">ល.រ</th>
                <th style="text-align: left; padding-left: 8px;">មុខវិជ្ជា</th>
                <th style="width: 85px;">ពិន្ទុអតិបរមា</th>
                <th style="width: 80px;">ពិន្ទុ</th>
                <th style="width: 82px;">ចំណាត់ថ្នាក់</th>
                <th style="width: 70px;">និទ្ទេស</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <!-- Summary Metric Row -->
          <div class="summary-strip">
            <div>ពិន្ទុសរុប៖ <strong>${(rec.totalScore ?? 0).toFixed(2)}</strong></div>
            <div>មធ្យមភាគ៖ <strong>${(rec.averageScore ?? 0).toFixed(2)} / 10</strong></div>
            <div>ចំណាត់ថ្នាក់៖ <strong style="color: #b91c1c;">${rec.classRank} / ${rec.totalStudents} នាក់</strong></div>
            <div>និទ្ទេសរួម៖ <strong>${calculateGradeLetter(rec.averageScore)}</strong></div>
          </div>

          <!-- Attendance Info Row -->
          <div class="absence-strip">
            <span>វត្តមាន & វិន័យ៖ </span>
            <span>អវត្តមានមានច្បាប់៖ <strong>${rec.excusedAbsences} ដង</strong></span>
            <span class="sep">|</span>
            <span>ឥតច្បាប់៖ <strong style="color: #b91c1c;">${rec.unexcusedAbsences} ដង</strong></span>
            <span class="sep">|</span>
            <span>សរុប៖ <strong>${rec.excusedAbsences + rec.unexcusedAbsences} ដង</strong></span>
          </div>

          <!-- Signatures & Reflection Section (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) -->
          <div style="margin-top: 6px; page-break-inside: avoid;">
            <!-- ជួរទី១ ខាងលើ: ហត្ថលេខា & មូលវិចារណ៍គ្រូបន្ទុកថ្នាក់ -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 6px;">
              <div style="text-align: center; width: 65%;">
                <div class="date-line">${rec.lunarDate || lunarDateText}</div>
                <div class="date-line">${rec.solarDate || solarDateText}</div>
                <div class="moul teacher-role-title">មូលវិចារណ៍គ្រូទទួលបន្ទុកថ្នាក់</div>
                
                ${
                  rec.teacherReflection
                    ? `<div class="reflection-box">${rec.teacherReflection}</div>`
                    : `<div class="dotted-line" style="margin-top: 5px;"></div><div class="dotted-line" style="margin-top: 4px;"></div>`
                }

                <div style="height: 4px;"></div>
                <div class="moul teacher-name-sign">${rec.teacherName}</div>
              </div>
            </div>

            <!-- ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា -->
            <div style="display: flex; justify-content: flex-start;">
              <div style="text-align: center; width: 45%;">
                <div class="sign-head">បានឃើញ និងឯកភាព</div>
                <div class="moul sign-role">នាយកសាលា</div>
                <div class="sign-stamp-space"></div>
                <div class="sign-dots">................................................</div>
              </div>
            </div>
          </div>

          <!-- Parent Feedback Section -->
          <div class="parent-feedback-section">
            <div class="parent-title">មតិយោបល់របស់មាតាបិតា ឬអាណាព្យាបាលសិស្ស</div>
            ${
              rec.parentFeedback
                ? `<div class="parent-box">${rec.parentFeedback}</div>`
                : `<div class="dotted-line" style="width: 95%; margin: 2.5px auto 0;"></div>
                   <div class="dotted-line" style="width: 95%; margin: 2.5px auto 0;"></div>
                   <div class="dotted-line" style="width: 95%; margin: 2.5px auto 0;"></div>
                   <div class="dotted-line" style="width: 95%; margin: 2.5px auto 0;"></div>`
            }
          </div>
        </div>
      </div>
    `;
  };

  // Helper to build Landscape Card HTML strictly fitting within 1 A4 Landscape page (Side-by-Side Dual Column)
  const buildLandscapeCardInnerHtml = (
    rec: StudentMonthlyResultRecord,
    titleInfo: { mainTitle: string; subTitle: string; periodName: string }
  ): string => {
    const rowsHtml = rec.scores
      .map((item, idx) => {
        return `
        <tr style="line-height: 1.15;">
          <td style="border: 1px solid #1e293b; text-align: center; font-size: 8pt; padding: 1.5px 2px;">${idx + 1}</td>
          <td style="border: 1px solid #1e293b; padding: 1.5px 6px; font-size: 8pt; white-space: nowrap; font-weight: 500; text-align: left;">${item.name}</td>
          <td style="border: 1px solid #1e293b; text-align: center; font-size: 8pt; padding: 1.5px 2px;">${item.maxScore.toFixed(1)}</td>
          <td style="border: 1px solid #1e293b; text-align: center; font-size: 8pt; font-weight: bold; padding: 1.5px 2px;">${item.score.toFixed(2)}</td>
          <td style="border: 1px solid #1e293b; text-align: center; font-size: 8pt; font-weight: bold; color: #b91c1c; padding: 1.5px 2px;">${item.rank || '-'}</td>
          <td style="border: 1px solid #1e293b; text-align: center; font-size: 8pt; font-weight: bold; padding: 1.5px 2px;">${item.grade || calculateGradeLetter(item.score)}</td>
        </tr>
      `;
      })
      .join('');

    return `
      <div class="landscape-card-wrapper">
        <div class="landscape-card-inner">
          <!-- Landscape Top Header Bar (3 Elements: School Left, Kingdom Center, Title Right) -->
          <div class="ls-header-bar">
            <div class="ls-header-left">
              <div class="ls-office">${rec.districtOffice}</div>
              <div class="ls-school">${rec.schoolName}</div>
              <div class="ls-grade">ថ្នាក់ទី៖ <strong>${rec.grade || teacher.grade || '៦'}</strong></div>
            </div>

            <div class="ls-header-center">
              <div class="moul ls-country">ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div class="moul ls-motto">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <div class="ls-stars">— ༺ ៚ ༻ —</div>
            </div>

            <div class="ls-header-right">
              <div class="moul ls-main-title">${titleInfo.mainTitle}</div>
              <div class="ls-sub-title">${titleInfo.subTitle}</div>
            </div>
          </div>

          <!-- Landscape Dual Column Body Layout -->
          <div class="ls-columns-container">
            <!-- Left Column: Student Banner + 12 Subjects Table + Summary Bar -->
            <div class="ls-left-col">
              <div class="ls-student-banner">
                <div>ឈ្មោះសិស្ស៖ <strong>${rec.studentName}</strong></div>
                <div>ភេទ៖ <strong>${rec.gender}</strong></div>
                <div style="font-size: 8pt; color: #475569;">អត្តលេខ: <strong>${students.find((s) => s.id === rec.studentId)?.civilId || rec.studentId}</strong></div>
              </div>

              <table class="ls-scores-table">
                <thead>
                  <tr>
                    <th style="width: 26px;">ល.រ</th>
                    <th style="text-align: left; padding-left: 6px;">មុខវិជ្ជា</th>
                    <th style="width: 65px;">ពិន្ទុអតិបរមា</th>
                    <th style="width: 60px;">ពិន្ទុ</th>
                    <th style="width: 65px;">ចំណាត់ថ្នាក់</th>
                    <th style="width: 50px;">និទ្ទេស</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>

              <div class="ls-summary-bar">
                <div>ពិន្ទុសរុប: <strong>${(rec.totalScore ?? 0).toFixed(2)}</strong></div>
                <div>មធ្យមភាគ: <strong>${(rec.averageScore ?? 0).toFixed(2)}</strong></div>
                <div style="color: #b91c1c;">ចំណាត់ថ្នាក់: <strong>${rec.classRank}/${rec.totalStudents}</strong></div>
                <div>និទ្ទេស: <strong>${calculateGradeLetter(rec.averageScore)}</strong></div>
              </div>
            </div>

            <!-- Right Column: Attendance Badge + Reflection Box + Signatures + Parent Feedback -->
            <div class="ls-right-col">
              <!-- Attendance Info Pill -->
              <div class="ls-att-badge">
                <span>វត្តមានមានច្បាប់: <strong>${rec.excusedAbsences} ដង</strong></span>
                <span style="color: #94a3b8;">|</span>
                <span>ឥតច្បាប់: <strong style="color: #b91c1c;">${rec.unexcusedAbsences} ដង</strong></span>
              </div>

              <!-- Teacher Reflection Box -->
              <div class="ls-reflection-card">
                <div class="ls-date-line">${rec.lunarDate || lunarDateText}</div>
                <div class="ls-date-line">${rec.solarDate || solarDateText}</div>
                <div class="moul ls-role-title">មូលវិចារណ៍គ្រូទទួលបន្ទុកថ្នាក់</div>
                ${
                  rec.teacherReflection
                    ? `<div class="ls-reflection-text">${rec.teacherReflection}</div>`
                    : `<div class="dotted-line" style="margin-top: 4px;"></div><div class="dotted-line" style="margin-top: 3px;"></div>`
                }
              </div>

              <!-- Signatures in Right Column (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) -->
              <div style="margin-top: 4px; border-top: 1px dashed #cbd5e1; padding-top: 4px;">
                <!-- ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូទទួលបន្ទុកថ្នាក់ -->
                <div style="text-align: right; padding-right: 10px;">
                  <div class="ls-sign-h" style="font-weight: bold;">គ្រូទទួលបន្ទុកថ្នាក់</div>
                  <div style="height: 20px;"></div>
                  <div class="moul ls-teacher-name">${rec.teacherName}</div>
                </div>

                <!-- ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា -->
                <div style="text-align: left; padding-left: 10px; margin-top: 4px;">
                  <div class="ls-sign-h">បានឃើញ និងឯកភាព</div>
                  <div class="moul ls-sign-sub">នាយកសាលា</div>
                  <div style="height: 20px;"></div>
                  <div style="font-size: 7.5pt; color: #64748b;">................................</div>
                </div>
              </div>

              <!-- Parent Feedback Box -->
              <div class="ls-parent-wrap">
                <div class="ls-parent-h">មតិរបស់មាតាបិតា - អាណាព្យាបាលសិស្ស</div>
                ${
                  rec.parentFeedback
                    ? `<div class="ls-parent-text">${rec.parentFeedback}</div>`
                    : `<div class="dotted-line" style="margin-top: 2px;"></div>
                       <div class="dotted-line" style="margin-top: 2px;"></div>
                       <div class="dotted-line" style="margin-top: 2px;"></div>
                       <div class="dotted-line" style="margin-top: 2px;"></div>`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Helper to build 2-Cards-Per-Sheet (A5 x 2 on 1 A4 Landscape Sheet - Paper Saver 50%)
  const buildDualLandscapeSheetHtml = (
    rec1: StudentMonthlyResultRecord,
    rec2?: StudentMonthlyResultRecord,
    titleInfo?: { mainTitle: string; subTitle: string; periodName: string }
  ): string => {
    const tInfo = titleInfo || getPeriodDisplayTitle(selectedPeriod);
    const card1 = buildPortraitCardInnerHtml(rec1, tInfo);
    const card2 = rec2 ? buildPortraitCardInnerHtml(rec2, tInfo) : '<div class="portrait-card-wrapper" style="visibility:hidden;"></div>';

    return `
      <div class="dual-sheet-grid">
        <div class="dual-sheet-col">${card1}</div>
        <div class="dual-sheet-divider"></div>
        <div class="dual-sheet-col">${card2}</div>
      </div>
    `;
  };

  // Shared CSS for Strict Single Page Printing
  const getPrintStyles = (orientation: 'portrait' | 'landscape' | 'dual_landscape') => {
    const isLandscape = orientation === 'landscape' || orientation === 'dual_landscape';
    const activeFont = getActiveCustomFontFamily();
    const activeTheme = getActiveCustomBackgroundTheme();
    const docBackgroundCss = getThemeBackgroundCss(activeTheme);
    return `
      @page {
        size: A4 ${isLandscape ? 'landscape' : 'portrait'};
        margin: ${isLandscape ? '4mm 5mm' : '4mm 6mm'};
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      html, body {
        font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
        color: #0f172a;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        background-color: #ffffff !important;
        background-image: none !important;
        line-height: 1.25;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
      }
      .moul { font-family: 'Moul', cursive; }
      .page-break-container {
        page-break-after: always;
        break-after: page;
        page-break-inside: avoid;
        break-inside: avoid;
        margin: 0;
        padding: 0;
        width: 100%;
      }
      .page-break-container:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }

      /* === PORTRAIT SPECIFIC RULES (Guaranteed Edge-to-Edge 1 A4 Page) === */
      .portrait-card-wrapper {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        border: 2px solid #0f172a;
        padding: 7px 10px;
        background: #fff;
      }
      .portrait-card-inner {
        width: 100%;
      }
      .header-top-grid {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 4px;
      }
      .school-header-left {
        text-align: left;
        font-size: 8.8pt;
        padding-top: 10px;
      }
      .school-header-left .office { font-weight: bold; }
      .school-header-left .school { font-weight: bold; margin-top: 1px; }
      .school-header-left .grade-label { margin-top: 1px; color: #1e293b; }
      .national-header-right {
        text-align: center;
      }
      .national-header-right .country { font-size: 11pt; }
      .national-header-right .motto { font-size: 9.5pt; margin-top: 1px; }
      .national-header-right .ornament { font-size: 8pt; letter-spacing: 2px; }

      .center-title-badge {
        text-align: center;
        margin: 3px 0 5px 0;
        padding: 2px 4px;
        background: #f8fafc;
        border-top: 1px solid #cbd5e1;
        border-bottom: 1px solid #cbd5e1;
      }
      .center-title-badge .main-title { font-size: 11.5pt; color: #0f172a; }
      .center-title-badge .sub-title { font-size: 9pt; font-weight: bold; color: #334155; margin-top: 1px; }

      .student-info-strip {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 9.5pt;
        margin-bottom: 4px;
        padding: 2px 6px;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 3px;
        width: 100%;
      }
      .student-info-strip .student-name { font-size: 10.5pt; color: #0f172a; }

      table.scores-table {
        width: 100%;
        border-collapse: collapse;
        border: 1.5px solid #0f172a;
        margin: 3px 0;
      }
      table.scores-table th {
        border: 1px solid #0f172a;
        padding: 3px 2px;
        font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
        font-weight: bold;
        font-size: 8.8pt;
        text-align: center;
        background-color: #f1f5f9;
      }
      table.scores-table td {
        border: 1px solid #0f172a;
        padding: 2px 3px;
        font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
        font-size: 8.8pt;
      }

      .summary-strip {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 4px;
        font-size: 9pt;
        font-weight: bold;
        padding: 3px 6px;
        border: 1px solid #0f172a;
        background: #f8fafc;
        width: 100%;
      }

      .absence-strip {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 8.5pt;
        font-weight: bold;
        margin-top: 3px;
        padding: 2px 4px;
        border: 1px dashed #94a3b8;
        background: #fff;
        width: 100%;
      }
      .absence-strip .sep { color: #cbd5e1; }

      .sign-box {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-top: 5px;
        width: 100%;
      }
      .sign-col-left { text-align: center; width: 190px; }
      .sign-col-left .sign-head { font-weight: bold; font-size: 9pt; }
      .sign-col-left .sign-role { font-size: 9.5pt; margin-top: 1px; }
      .sign-stamp-space { height: 40px; }
      .sign-dots { font-size: 8.5pt; color: #64748b; font-weight: bold; }

      .sign-col-right { text-align: center; width: 300px; }
      .sign-col-right .date-line { font-size: 8.5pt; color: #1e293b; }
      .sign-col-right .teacher-role-title { font-size: 9pt; margin-top: 2px; }
      .reflection-box {
        font-size: 8.5pt;
        font-style: italic;
        margin-top: 2px;
        text-align: left;
        padding: 2px 6px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        min-height: 32px;
        line-height: 1.25;
      }
      .dotted-line { border-bottom: 1px dotted #000; height: 11px; }
      .teacher-name-sign { font-size: 9.5pt; margin-top: 2px; }

      .parent-feedback-section {
        margin-top: 4px;
        padding-top: 3px;
        border-top: 1px solid #cbd5e1;
        text-align: center;
        width: 100%;
      }
      .parent-title { font-weight: bold; font-size: 8.8pt; }
      .parent-box {
        font-size: 8.5pt;
        font-style: italic;
        margin-top: 2px;
        text-align: center;
        padding: 2px 6px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }

      /* === LANDSCAPE SPECIFIC RULES (Guaranteed 1 A4 Landscape Page) === */
      .landscape-card-wrapper {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        border: 2px solid #0f172a;
        padding: 5px 8px;
        background: #fff;
      }
      .landscape-card-inner { width: 100%; }
      .ls-header-bar {
        display: grid;
        grid-template-columns: 1fr 1.2fr 1fr;
        align-items: center;
        border-bottom: 1.5px solid #0f172a;
        padding-bottom: 2px;
        margin-bottom: 3px;
      }
      .ls-header-left { text-align: left; font-size: 8pt; padding-top: 8px; }
      .ls-office { font-weight: bold; }
      .ls-school { font-weight: bold; }
      .ls-grade { color: #1e293b; }
      .ls-header-center { text-align: center; }
      .ls-country { font-size: 10pt; }
      .ls-motto { font-size: 8.5pt; margin-top: 1px; }
      .ls-stars { font-size: 7.5pt; letter-spacing: 2px; }
      .ls-header-right { text-align: right; }
      .ls-main-title { font-size: 9.5pt; }
      .ls-sub-title { font-size: 8pt; color: #334155; font-weight: bold; margin-top: 1px; }

      .ls-columns-container {
        display: flex;
        gap: 8px;
        align-items: stretch;
      }
      .ls-left-col {
        flex: 1.15;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .ls-student-banner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f1f5f9;
        border: 1px solid #0f172a;
        padding: 2px 5px;
        font-size: 8.5pt;
        font-weight: bold;
        margin-bottom: 2px;
      }
      table.ls-scores-table { width: 100%; border-collapse: collapse; border: 1px solid #0f172a; }
      table.ls-scores-table th { border: 1px solid #0f172a; padding: 2px 2px; font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif; font-weight: bold; font-size: 8pt; text-align: center; background-color: #f1f5f9; }
      table.ls-scores-table td { border: 1px solid #0f172a; padding: 1.5px 2.5px; font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif; font-size: 8pt; }
      .ls-summary-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 8pt;
        font-weight: bold;
        margin-top: 2px;
        padding: 1.5px 4px;
        border: 1px solid #0f172a;
        background: #f8fafc;
      }

      .ls-right-col {
        flex: 0.95;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid #0f172a;
        padding: 4px 6px;
        background: #fff;
      }
      .ls-att-badge {
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 8pt;
        font-weight: bold;
        padding: 2px 4px;
        background: #f1f5f9;
        border-bottom: 1px dashed #cbd5e1;
      }
      .ls-reflection-card { text-align: center; font-size: 8pt; margin: 2px 0; }
      .ls-date-line { font-size: 7.5pt; color: #1e293b; }
      .ls-role-title { font-size: 8pt; margin-top: 1px; }
      .ls-reflection-text { font-size: 7.5pt; font-style: italic; text-align: left; padding: 2px 4px; background: #f8fafc; border: 1px solid #e2e8f0; min-height: 28px; line-height: 1.2; }
      .ls-sign-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
        text-align: center;
        font-size: 7.5pt;
        border-top: 1px dashed #cbd5e1;
        padding-top: 2px;
      }
      .ls-sign-h { font-weight: bold; }
      .ls-sign-sub { font-size: 7.5pt; }
      .ls-teacher-name { font-size: 8pt; }
      .ls-parent-wrap {
        border-top: 1px solid #e2e8f0;
        text-align: center;
        font-size: 7.5pt;
        padding-top: 2px;
      }
      .ls-parent-h { font-weight: bold; }
      .ls-parent-text { font-size: 7.5pt; font-style: italic; padding: 1.5px 3px; background: #f8fafc; border: 1px solid #e2e8f0; }

      /* === DUAL LANDSCAPE (2 Cards per A4 Sheet) === */
      .dual-sheet-grid {
        display: flex;
        gap: 4mm;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        page-break-inside: avoid;
      }
      .dual-sheet-col {
        flex: 1;
        box-sizing: border-box;
      }
      .dual-sheet-divider {
        width: 1px;
        border-left: 1px dashed #94a3b8;
      }
      .dual-sheet-col .portrait-card-wrapper {
        max-width: 100%;
        width: 100%;
        padding: 4px 6px;
      }
      .dual-sheet-col .scores-table th, 
      .dual-sheet-col .scores-table td { font-size: 7.5pt; padding: 1px 2px; }
      .dual-sheet-col .student-info-strip { font-size: 8pt; }
      .dual-sheet-col .summary-strip { font-size: 7.8pt; }
      .dual-sheet-col .sign-stamp-space { height: 25px; }
      .dual-sheet-col .national-header-right .country { font-size: 9.5pt; }
      .dual-sheet-col .center-title-badge .main-title { font-size: 9.5pt; }
    `;
  };

  // Helper function to trigger printing safely across all browsers
  const triggerPrintContent = (htmlContent: string, pageTitle: string, orientation: 'portrait' | 'landscape' | 'dual_landscape') => {
    // Create print iframe if not exists
    let iframe = document.getElementById('hidden-print-frame') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'hidden-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${pageTitle}</title>
        <meta charset="utf-8" />
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          ${getPrintStyles(orientation)}
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
    doc.close();

    // Wait for fonts to load and then print
    const printFrameWindow = iframe.contentWindow;
    if (printFrameWindow) {
      setTimeout(() => {
        try {
          if (doc.fonts && doc.fonts.ready) {
            doc.fonts.ready.then(() => {
              printFrameWindow.focus();
              printFrameWindow.print();
            });
          } else {
            printFrameWindow.focus();
            printFrameWindow.print();
          }
        } catch (err) {
          printFrameWindow.focus();
          printFrameWindow.print();
        }
      }, 350);
    }
  };

  // Print Single Student Result Card
  const handlePrintSingleCard = (
    recordToPrint?: StudentMonthlyResultRecord,
    orientationOverride?: 'portrait' | 'landscape' | 'dual_landscape'
  ) => {
    const rec = recordToPrint || currentStudentRecord;
    if (!rec) return;

    const orientation = orientationOverride || printOrientation;
    const titleInfo = getPeriodDisplayTitle(selectedPeriod);
    const cardHtml =
      orientation === 'landscape'
        ? buildLandscapeCardInnerHtml(rec, titleInfo)
        : orientation === 'dual_landscape'
        ? buildDualLandscapeSheetHtml(rec, undefined, titleInfo)
        : buildPortraitCardInnerHtml(rec, titleInfo);

    const docTitle = `ប័ណ្ណលទ្ធផល_${rec.studentName}_${titleInfo.periodName}`;
    triggerPrintContent(cardHtml, docTitle, orientation);
  };

  // Batch Print All Student Cards
  const handlePrintBatchCards = (orientationOverride?: 'portrait' | 'landscape' | 'dual_landscape') => {
    if (currentPeriodRecords.length === 0) {
      onShowToast('មិនមានទិន្នន័យសិស្សសម្រាប់បោះពុម្ពទេ!');
      return;
    }

    const orientation = orientationOverride || printOrientation;
    const titleInfo = getPeriodDisplayTitle(selectedPeriod);

    let allCardsHtml = '';
    if (orientation === 'dual_landscape') {
      // Group students 2 per sheet
      for (let i = 0; i < currentPeriodRecords.length; i += 2) {
        const rec1 = currentPeriodRecords[i];
        const rec2 = currentPeriodRecords[i + 1];
        const sheetHtml = buildDualLandscapeSheetHtml(rec1, rec2, titleInfo);
        allCardsHtml += `<div class="page-break-container">${sheetHtml}</div>`;
      }
    } else {
      allCardsHtml = currentPeriodRecords
        .map((rec) => {
          const innerHtml =
            orientation === 'landscape'
              ? buildLandscapeCardInnerHtml(rec, titleInfo)
              : buildPortraitCardInnerHtml(rec, titleInfo);
          return `<div class="page-break-container">${innerHtml}</div>`;
        })
        .join('');
    }

    const docTitle = `ប័ណ្ណតាមដានការសិក្សា_${currentPeriodRecords.length}នាក់_${titleInfo.periodName}`;
    triggerPrintContent(allCardsHtml, docTitle, orientation);
  };

  // Print Whole Class Ledger Matrix
  const handlePrintClassLedger = () => {
    const titleInfo = getPeriodDisplayTitle(selectedPeriod);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHtml = currentPeriodRecords
      .map((rec, idx) => {
        const scoreTds = rec.scores.map((s) => `<td style="border: 1px solid #334155; padding: 4px; text-align: center; font-size: 9pt;">${s.score.toFixed(1)}</td>`).join('');
        return `
        <tr style="page-break-inside: avoid;">
          <td style="border: 1px solid #334155; padding: 4px; text-align: center; font-size: 9pt;">${idx + 1}</td>
          <td style="border: 1px solid #334155; padding: 4px 6px; font-weight: bold; font-size: 9.5pt; white-space: nowrap;">${rec.studentName}</td>
          <td style="border: 1px solid #334155; padding: 4px; text-align: center; font-size: 9pt;">${rec.gender}</td>
          ${scoreTds}
          <td style="border: 1px solid #334155; padding: 4px; text-align: center; font-weight: bold; font-size: 9.5pt;">${(rec.totalScore ?? 0).toFixed(2)}</td>
          <td style="border: 1px solid #334155; padding: 4px; text-align: center; font-weight: bold; font-size: 9.5pt;">${(rec.averageScore ?? 0).toFixed(2)}</td>
          <td style="border: 1px solid #334155; padding: 4px; text-align: center; font-weight: bold; font-size: 9.5pt;">${calculateGradeLetter(rec.averageScore)}</td>
          <td style="border: 1px solid #334155; padding: 4px; text-align: center; font-weight: bold; color: #b91c1c; font-size: 9.5pt;">${rec.classRank}</td>
          <td style="border: 1px solid #334155; padding: 4px; text-align: center; font-size: 8.5pt;">${rec.excusedAbsences} / ${rec.unexcusedAbsences}</td>
        </tr>
      `;
      })
      .join('');

    const subjectThs = activeSubSubjectsList.map((sub) => `<th style="border: 1px solid #334155; padding: 4px; font-size: 8pt; width: 50px;">${sub.name}</th>`).join('');

    const activeFont = getActiveCustomFontFamily();
    const activeTheme = getActiveCustomBackgroundTheme();
    const docBackgroundCss = getThemeBackgroundCss(activeTheme);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>តារាងសរុបលទ្ធផលសិក្សា ${titleInfo.periodName} ថ្នាក់ទី ${teacher.grade || '៦'}</title>
        <meta charset="utf-8" />
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page { size: A4 landscape; margin: 10mm 12mm; }
          body { font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif; color: #0f172a; margin: 0; padding: 5px; background: #ffffff !important; background-color: #ffffff !important; background-image: none !important; }
          .moul { font-family: 'Moul', cursive; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9pt; }
          th { background-color: #f1f5f9; border: 1px solid #334155; padding: 6px 3px; font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif; font-weight: bold; }
          .header-grid { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
          .center-title { text-align: center; margin: 5px 0 10px 0; }
        </style>
      </head>
      <body>
        <!-- Top Centered National Header (ព្រះរាជាណាចក្រកម្ពុជា លើគេបង្អស់) -->
        <div style="text-align: center; margin-bottom: 8px;">
          <div class="moul" style="font-size: 12pt;">ព្រះរាជាណាចក្រកម្ពុជា</div>
          <div class="moul" style="font-size: 10.5pt; margin-top: 2px;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          <div style="font-size: 9.5pt; letter-spacing: 2px; margin-top: 1px;">— ༺ ៚ ༻ —</div>
        </div>

        <div style="text-align: left; margin-bottom: 8px;">
          <div style="font-size: 10.5pt; font-weight: bold;">${districtOffice}</div>
          <div style="font-size: 10.5pt; font-weight: bold; margin-top: 2px;">${schoolName}</div>
        </div>

        <div class="center-title">
          <div class="moul" style="font-size: 13pt;">តារាងតាមដាន & សរុបលទ្ធផលសិក្សា ${titleInfo.periodName}</div>
          <div style="font-size: 10pt; color: #475569;">${teacher.grade || 'ថ្នាក់ទី ៦'} • ឆ្នាំសិក្សា ${activeYear} • គ្រូបន្ទុកថ្នាក់៖ ${teacher.name}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">ល.រ</th>
              <th style="width: 120px;">គោត្តនាម-នាម</th>
              <th style="width: 35px;">ភេទ</th>
              ${subjectThs}
              <th style="width: 60px;">សរុប</th>
              <th style="width: 55px;">មធ្យម</th>
              <th style="width: 45px;">និទ្ទេស</th>
              <th style="width: 45px;">ចំណាត់ថ្នាក់</th>
              <th style="width: 50px;">វត្តមាន</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <!-- ២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា -->
        <div style="margin-top: 25px; page-break-inside: avoid;">
          <!-- ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 12px; padding-right: 20px;">
            <div style="text-align: center; width: 250px;">
              <div>${solarDateText}</div>
              <div class="moul" style="font-size: 10pt; margin-top: 4px;">គ្រូបន្ទុកថ្នាក់</div>
              <div style="height: 45px;"></div>
              <div class="moul" style="font-size: 10pt;">${teacher.name}</div>
            </div>
          </div>

          <!-- ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា -->
          <div style="display: flex; justify-content: flex-start; padding-left: 20px;">
            <div style="text-align: center; width: 220px;">
              <div style="font-weight: bold;">បានឃើញ និងឯកភាព</div>
              <div class="moul" style="font-size: 10pt; margin-top: 4px;">នាយកសាលា</div>
              <div style="height: 45px;"></div>
              <div style="font-size: 9pt; color: #64748b;">...................................................</div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const periodTitleInfo = getPeriodDisplayTitle(selectedPeriod);

  return (
    <div className="space-y-5">
      {/* Top Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 text-[11px] font-bold flex items-center gap-1">
              <BookOpenCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>សៀវភៅតាមដានការសិក្សាផ្លូវការ (MoEYS)</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              ឆ្នាំសិក្សា {activeYear}
            </span>
          </div>
          <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white mt-1.5 flex items-center gap-2 flex-wrap">
            <span>សៀវភៅតាមដានការសិក្សា & លទ្ធផលសិក្សា</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200 font-bold border border-blue-200">
              {students.length} សិស្ស
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 font-bold border border-emerald-200 flex items-center gap-1">
              <CalendarCheck className="w-3 h-3 text-emerald-600" />
              <span>ស្រង់វត្តមានស្វ័យប្រវត្តិនឹងកន្លែង</span>
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            ទម្រង់ស្តង់ដារ ១២ មុខវិជ្ជា/សមត្ថភាព គណនាពិន្ទុប្រចាំខែ ឆមាសទី១ ឆមាសទី២ និងប្រចាំឆ្នាំ ដោយស្រង់ទិន្នន័យអវត្តមាន និងច្បាប់ជាក់ស្តែងពីកន្លែងវត្តមាន
          </p>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Period Selector Dropdown (Month / Semester 1 / Semester 2 / Annual) */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold text-slate-500">ដំណាក់កាល៖</span>
            <select
              value={selectedPeriodKey}
              onChange={(e) => setSelectedPeriodKey(e.target.value)}
              className="bg-transparent text-xs font-black text-blue-900 dark:text-blue-200 outline-none cursor-pointer"
            >
              <optgroup label="── ប្រចាំខែ (ឆមាសទី១) ──">
                {EVALUATION_PERIODS.filter((p) => p.semesterNum === 1 && p.type === 'month').map((p) => (
                  <option key={p.key} value={p.key} className="text-slate-900 dark:text-slate-100">
                    {p.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="── សរុបឆមាសទី១ ──">
                <option value="s1_summary" className="text-blue-700 font-bold">
                  📊 ប្រចាំឆមាសទី១ (Semester 1)
                </option>
              </optgroup>
              <optgroup label="── ប្រចាំខែ (ឆមាសទី២) ──">
                {EVALUATION_PERIODS.filter((p) => p.semesterNum === 2 && p.type === 'month').map((p) => (
                  <option key={p.key} value={p.key} className="text-slate-900 dark:text-slate-100">
                    {p.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="── សរុបឆមាសទី២ ──">
                <option value="s2_summary" className="text-blue-700 font-bold">
                  📊 ប្រចាំឆមាសទី២ (Semester 2)
                </option>
              </optgroup>
              <optgroup label="── បូកសរុបប្រចាំឆ្នាំ ──">
                <option value="annual_summary" className="text-purple-700 font-bold">
                  🏆 បូកសរុបប្រចាំឆ្នាំ (Annual Summary)
                </option>
              </optgroup>
            </select>
          </div>

          {/* Sub-Subjects Configuration Modal Trigger Button */}
          <button
            type="button"
            onClick={() => {
              const defaultKey =
                selectedPeriod.type === 'month'
                  ? selectedPeriod.key
                  : selectedPeriod.key === 's2_summary'
                  ? 'm02'
                  : 'm10';
              setModalConfigPeriodKey(defaultKey);
              setIsSubSubjectModalOpen(true);
            }}
            className="no-print bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
            title="កំណត់មុខវិជ្ជារងបឋមតាមខែ និងឆមាសនីមួយៗ"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>កំណត់មុខវិជ្ជារង ({activeSubSubjectsList.length})</span>
          </button>

          {/* Orientation Selector Pills */}
          <div className="no-print flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setPrintOrientation('portrait')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                printOrientation === 'portrait'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="ទម្រង់ប័ណ្ណបញ្ឈរ A4 ពេញទំព័រ (១ ទំព័រគត់)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>បញ្ឈរ A4 (១ទំព័រ)</span>
            </button>
            <button
              type="button"
              onClick={() => setPrintOrientation('landscape')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                printOrientation === 'landscape'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="ទម្រង់ប័ណ្ណផ្តេក A4 ពេញទំព័រ (១ ទំព័រគត់)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>ផ្តេក A4 (១ទំព័រ)</span>
            </button>
            <button
              type="button"
              onClick={() => setPrintOrientation('dual_landscape')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                printOrientation === 'dual_landscape'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="បោះពុម្ព ២ សន្លឹកក្នុង ១ ទំព័រ A4 ផ្តេក (សន្សំក្រដាស 50%)"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-600" />
              <span>២សន្លឹកក្នុង១ទំព័រ</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            title="កំណត់ក្បាលលិខិតសាលា & កាលបរិច្ឆេទ"
          >
            <Sliders className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>

          <button
            type="button"
            onClick={() => handlePrintSingleCard()}
            className="no-print bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>
              បោះពុម្ពប័ណ្ណ ({printOrientation === 'portrait' ? 'បញ្ឈរ A4' : printOrientation === 'landscape' ? 'ផ្តេក A4' : '២សន្លឹក/ទំព័រ'})
            </span>
          </button>

          <button
            type="button"
            onClick={() => handlePrintBatchCards()}
            className="no-print bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>បោះពុម្ពទាំងអស់ ({students.length} នាក់)</span>
          </button>
        </div>
      </div>

      {/* Main Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveMainTab('monthly_card')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
            activeMainTab === 'monthly_card'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ប័ណ្ណតាមដានលទ្ធផលសិក្សា (MoEYS Standard Format)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('class_ledger')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
            activeMainTab === 'class_ledger'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>តារាងតាមដានរួមទាំងថ្នាក់ (Ledger)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('case_logbook')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
            activeMainTab === 'case_logbook'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>កំណត់ត្រាអន្តរាគមន៍ & ករណីសិស្ស ({caseEntries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setIsThursdayReportModalOpen(true)}
          className="no-print px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-sm border border-indigo-400/30 ml-auto"
          title="បើកទម្រង់របាយការណ៍បំពេញការងារថ្ងៃព្រហស្បតិ៍"
        >
          <Calendar className="w-4 h-4 text-amber-300" />
          <span>របាយការណ៍ថ្ងៃព្រហស្បតិ៍</span>
          <span className="text-[9px] bg-amber-400 text-blue-950 font-black px-1.5 py-0.5 rounded-full uppercase">
            MoEYS
          </span>
        </button>
      </div>

      {/* TAB 1: MONTHLY / SEMESTER / ANNUAL RESULT CARD */}
      {activeMainTab === 'monthly_card' && currentStudentRecord && (
        <div className="space-y-4">
          {/* Student Selector Bar & Quick Nav */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevStudent}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
                title="សិស្សមុន"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">ជ្រើសរើសសិស្ស៖</span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                >
                  {students.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      {idx + 1}. {s.name} ({s.gender}) - លេខកូដ: {s.rollNo || s.id}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextStudent}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
                title="សិស្សបន្ទាប់"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs">
                <span className="text-slate-500 font-bold">ពិន្ទុសរុប៖</span>
                <span className="font-extrabold text-blue-900 dark:text-blue-200">{(currentStudentRecord.totalScore ?? 0).toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs">
                <span className="text-slate-500 font-bold">មធ្យមភាគ៖</span>
                <span className="font-extrabold text-emerald-900 dark:text-emerald-200">{(currentStudentRecord.averageScore ?? 0).toFixed(2)} / 10</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs">
                <span className="text-slate-500 font-bold">ចំណាត់ថ្នាក់៖</span>
                <span className="font-extrabold text-rose-800 dark:text-rose-200">
                  លេខ {currentStudentRecord.classRank} / {currentStudentRecord.totalStudents} នាក់
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs">
                <span className="text-slate-500 font-bold">និទ្ទេស៖</span>
                <span className="font-extrabold text-purple-900 dark:text-purple-200">
                  {calculateGradeLetter(currentStudentRecord.averageScore)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs" title="ស្រង់ចេញពីកន្លែងវត្តមានជាក់ស្តែង">
                <span className="text-slate-500 font-bold">អវត្តមាន៖</span>
                <span className="font-extrabold text-amber-900 dark:text-amber-200">
                  ច្បាប់ {currentStudentRecord.excusedAbsences} | ឥតច្បាប់ {currentStudentRecord.unexcusedAbsences}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSyncRealAttendance}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 transition text-xs font-bold flex items-center gap-1"
                title="ទាញទិន្នន័យអវត្តមាន និងច្បាប់ជាក់ស្តែងឡើងវិញ"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">ស្រង់វត្តមានឡើងវិញ</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-white" />
                <span>កែប្រែពិន្ទុ & មូលវិចារណ៍</span>
              </button>
            </div>
          </div>

          {/* Real Preview Canvas Card (Supports Portrait, Landscape, and 2-in-1 Dual Modes) */}
          <div className="bg-slate-200/60 dark:bg-slate-950 p-3 sm:p-6 rounded-[32px] border border-slate-300 dark:border-slate-800 flex justify-center overflow-x-auto">
            {printOrientation === 'portrait' || printOrientation === 'dual_landscape' ? (
              /* === PORTRAIT PREVIEW CARD (Authentic Double Border) === */
              <div className="w-full max-w-[780px] bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-xl border-4 border-double border-slate-900 font-serif leading-relaxed">
                {/* Top Header: School Left (offset below Kingdom header), Kingdom Right */}
                <div className="flex justify-between items-start mb-3">
                  <div className="text-left font-sans text-xs pt-3">
                    <div className="font-extrabold text-slate-900 leading-tight">{districtOffice}</div>
                    <div className="font-extrabold text-slate-900 leading-tight mt-0.5">{schoolName}</div>
                    <div className="text-[11px] text-slate-700 font-bold mt-0.5">
                      ថ្នាក់ទី៖ <strong>{currentStudentRecord.grade || teacher.grade || '៦'}</strong>
                    </div>
                  </div>

                  <div className="text-center font-serif">
                    <div className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                      ព្រះរាជាណាចក្រកម្ពុជា
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight mt-0.5">
                      ជាតិ សាសនា ព្រះមហាក្សត្រ
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5 tracking-wider">
                      — ༺ ៚ ༻ —
                    </div>
                  </div>
                </div>

                {/* Document Title Badge */}
                <div className="text-center my-3 py-1.5 bg-slate-50 border-y border-slate-300">
                  <h2 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {periodTitleInfo.mainTitle}
                  </h2>
                  <h3 className="font-bold text-xs text-slate-700 mt-0.5">
                    {periodTitleInfo.subTitle}
                  </h3>
                </div>

                {/* Student Identification Row */}
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 mb-3 px-2 py-1.5 bg-slate-100 rounded border border-slate-300">
                  <div>
                    <span>ឈ្មោះសិស្ស៖ </span>
                    <span className="font-extrabold text-blue-950 text-sm sm:text-base ml-1">
                      {currentStudentRecord.studentName}
                    </span>
                  </div>
                  <div>
                    <span>ភេទ៖ </span>
                    <span className="font-extrabold text-slate-900 ml-1">
                      {currentStudentRecord.gender}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-sans">
                    អត្តលេខ៖ {students.find((s) => s.id === currentStudentRecord.studentId)?.civilId || currentStudentRecord.studentId}
                  </div>
                </div>

                {/* 12 Subjects Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-900 text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900">
                        <th className="border border-slate-900 py-1 px-1 text-center w-10">ល.រ</th>
                        <th className="border border-slate-900 py-1 px-2.5 text-left">មុខវិជ្ជា</th>
                        <th className="border border-slate-900 py-1 px-2 text-center w-24">ពិន្ទុអតិបរមា</th>
                        <th className="border border-slate-900 py-1 px-2 text-center w-20">ពិន្ទុ</th>
                        <th className="border border-slate-900 py-1 px-2 text-center w-20">ចំណាត់ថ្នាក់</th>
                        <th className="border border-slate-900 py-1 px-2 text-center w-16">និទ្ទេស</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStudentRecord.scores.map((sub, idx) => (
                        <tr key={sub.id} className="border-b border-slate-900 hover:bg-blue-50/40 transition">
                          <td className="border border-slate-900 py-1 px-1 text-center font-sans font-medium">{idx + 1}</td>
                          <td className="border border-slate-900 py-1 px-2.5 font-medium text-slate-900">{sub.name}</td>
                          <td className="border border-slate-900 py-1 px-2 text-center font-sans">{sub.maxScore.toFixed(1)}</td>
                          <td className="border border-slate-900 py-1 px-2 text-center font-sans font-bold text-slate-950">
                            {sub.score.toFixed(2)}
                          </td>
                          <td className="border border-slate-900 py-1 px-2 text-center font-sans font-bold text-rose-700">
                            {sub.rank || '-'}
                          </td>
                          <td className="border border-slate-900 py-1 px-2 text-center font-sans font-bold">
                            {sub.grade || calculateGradeLetter(sub.score)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Bottom Bar */}
                <div className="flex justify-between items-center text-xs font-bold mt-2.5 text-slate-900 px-3 py-1.5 bg-slate-50 border border-slate-900 rounded">
                  <div>
                    <span>ពិន្ទុសរុប៖ </span>
                    <span className="font-extrabold text-blue-950 font-sans ml-1">
                      {(currentStudentRecord.totalScore ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span>មធ្យមភាគ៖ </span>
                    <span className="font-extrabold text-emerald-950 font-sans ml-1">
                      {(currentStudentRecord.averageScore ?? 0).toFixed(2)} / 10
                    </span>
                  </div>
                  <div>
                    <span>ចំណាត់ថ្នាក់៖ </span>
                    <span className="font-extrabold text-rose-800 font-sans ml-1">
                      {currentStudentRecord.classRank} / {currentStudentRecord.totalStudents} នាក់
                    </span>
                  </div>
                  <div>
                    <span>និទ្ទេសរួម៖ </span>
                    <span className="font-extrabold text-blue-900 font-sans ml-1">
                      {calculateGradeLetter(currentStudentRecord.averageScore)}
                    </span>
                  </div>
                </div>

                {/* Attendance Real Sync Line */}
                <div className="text-center text-xs font-bold text-slate-900 mt-2 py-1 bg-white border border-dashed border-slate-300 flex items-center justify-center gap-6">
                  <div>
                    <span>អវត្តមានមានច្បាប់៖ </span>
                    <strong className="text-blue-900 font-sans ml-1">{currentStudentRecord.excusedAbsences} ដង</strong>
                  </div>
                  <div className="text-slate-300">|</div>
                  <div>
                    <span>ឥតច្បាប់៖ </span>
                    <strong className="text-rose-800 font-sans ml-1">{currentStudentRecord.unexcusedAbsences} ដង</strong>
                  </div>
                  <div className="text-slate-300">|</div>
                  <div>
                    <span>សរុប៖ </span>
                    <strong className="text-slate-900 font-sans ml-1">{currentStudentRecord.excusedAbsences + currentStudentRecord.unexcusedAbsences} ដង</strong>
                  </div>
                </div>

                {/* Signatures & Teacher Reflection Box (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) */}
                <div className="mt-4 text-xs text-slate-900 space-y-4">
                  {/* ជួរទី១ ខាងលើ: Teacher Reflection & Date Right */}
                  <div className="flex justify-end">
                    <div className="text-center w-72">
                      <div className="text-[10.5px] text-slate-700">{currentStudentRecord.lunarDate || lunarDateText}</div>
                      <div className="text-[10.5px] text-slate-700 mt-0.5">{currentStudentRecord.solarDate || solarDateText}</div>
                      <div className="font-extrabold text-xs mt-1">មូលវិចារណ៍គ្រូទទួលបន្ទុកថ្នាក់</div>

                      {currentStudentRecord.teacherReflection ? (
                        <div className="text-[10.5px] text-left italic text-slate-800 mt-1 p-2 bg-blue-50/40 rounded border border-blue-100 min-h-[36px]">
                          {currentStudentRecord.teacherReflection}
                        </div>
                      ) : (
                        <div className="space-y-1.5 mt-1.5">
                          <div className="border-b border-dotted border-black h-2.5"></div>
                          <div className="border-b border-dotted border-black h-2.5"></div>
                        </div>
                      )}

                      <div className="h-1"></div>
                      <div className="font-extrabold text-xs text-slate-900">
                        {currentStudentRecord.teacherName}
                      </div>
                    </div>
                  </div>

                  {/* ជួរទី២ ខាងក្រោម: Principal Signature Left */}
                  <div className="flex justify-start">
                    <div className="text-center w-48">
                      <div className="font-bold text-[11px]">បានឃើញ និងឯកភាព</div>
                      <div className="font-extrabold text-xs mt-0.5">នាយកសាលា</div>
                      <div className="h-10"></div>
                      <div className="font-bold text-slate-400">................................................</div>
                    </div>
                  </div>
                </div>

                {/* Parent Feedback Bottom Section */}
                <div className="mt-4 pt-2 border-t border-slate-300 text-center text-xs text-slate-900">
                  <div className="font-extrabold text-xs">មតិយោបល់របស់មាតាបិតា ឬអាណាព្យាបាលសិស្ស</div>
                  {currentStudentRecord.parentFeedback ? (
                    <div className="text-[10.5px] italic text-slate-800 mt-1 p-1.5 bg-slate-50 rounded border border-slate-200 max-w-lg mx-auto">
                      {currentStudentRecord.parentFeedback}
                    </div>
                  ) : (
                    <div className="space-y-1.5 mt-1.5 max-w-xl mx-auto">
                      <div className="border-b border-dotted border-black h-2.5"></div>
                      <div className="border-b border-dotted border-black h-2.5"></div>
                      <div className="border-b border-dotted border-black h-2.5"></div>
                      <div className="border-b border-dotted border-black h-2.5"></div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* === LANDSCAPE PREVIEW CARD === */
              <div className="w-full max-w-[980px] bg-white text-slate-900 p-5 sm:p-7 rounded-lg shadow-xl border-4 border-double border-slate-900 font-serif leading-relaxed">
                {/* Landscape Top Header Bar (3 Columns) */}
                <div className="grid grid-cols-3 items-center border-b border-slate-900 pb-2 mb-3">
                  <div className="text-left font-sans pt-2.5">
                    <div className="font-extrabold text-xs text-slate-900">{districtOffice}</div>
                    <div className="font-extrabold text-xs text-slate-900 mt-0.5">{schoolName}</div>
                    <div className="text-[11px] text-slate-700 mt-0.5 font-bold">ថ្នាក់ទី៖ {currentStudentRecord.grade || teacher.grade || '៦'}</div>
                  </div>

                  <div className="text-center">
                    <div className="font-extrabold text-sm text-slate-900">ព្រះរាជាណាចក្រកម្ពុជា</div>
                    <div className="font-bold text-xs text-slate-900 mt-0.5">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                    <div className="text-xs font-bold text-slate-700 mt-0.5 tracking-wider">— ༺ ៚ ༻ —</div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-sm text-slate-900">{periodTitleInfo.mainTitle}</div>
                    <div className="text-xs text-slate-700 font-bold mt-0.5">{periodTitleInfo.subTitle}</div>
                  </div>
                </div>

                {/* Landscape Dual Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                  {/* Left Column: Student Info + Table + Summary (7 cols) */}
                  <div className="md:col-span-7 flex flex-col justify-between space-y-2.5">
                    <div className="bg-slate-100 border border-slate-900 p-1.5 rounded flex justify-between items-center text-xs font-bold">
                      <div>ឈ្មោះសិស្ស៖ <span className="text-blue-900 font-extrabold ml-1">{currentStudentRecord.studentName}</span></div>
                      <div>ភេទ៖ <span className="ml-1">{currentStudentRecord.gender}</span></div>
                      <div className="text-[11px] text-slate-600 font-sans">អត្តលេខ: {students.find((s) => s.id === currentStudentRecord.studentId)?.civilId || currentStudentRecord.studentId}</div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-900 text-[11px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900">
                            <th className="border border-slate-900 py-1 px-1 text-center w-8">ល.រ</th>
                            <th className="border border-slate-900 py-1 px-2 text-left">មុខវិជ្ជា</th>
                            <th className="border border-slate-900 py-1 px-1 text-center w-16">ពិន្ទុអតិ.</th>
                            <th className="border border-slate-900 py-1 px-1 text-center w-14">ពិន្ទុ</th>
                            <th className="border border-slate-900 py-1 px-1 text-center w-16">ចំណាត់ថ្នាក់</th>
                            <th className="border border-slate-900 py-1 px-1 text-center w-12">និទ្ទេស</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentStudentRecord.scores.map((sub, idx) => (
                            <tr key={sub.id} className="border-b border-slate-900 hover:bg-blue-50/30 transition">
                              <td className="border border-slate-900 py-0.5 px-1 text-center font-sans">{idx + 1}</td>
                              <td className="border border-slate-900 py-0.5 px-2 font-medium text-slate-900 truncate max-w-[120px]">{sub.name}</td>
                              <td className="border border-slate-900 py-0.5 px-1 text-center font-sans">{sub.maxScore.toFixed(1)}</td>
                              <td className="border border-slate-900 py-0.5 px-1 text-center font-sans font-bold text-slate-950">{sub.score.toFixed(2)}</td>
                              <td className="border border-slate-900 py-0.5 px-1 text-center font-sans font-bold text-rose-700">{sub.rank || '-'}</td>
                              <td className="border border-slate-900 py-0.5 px-1 text-center font-sans font-bold">{sub.grade || calculateGradeLetter(sub.score)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-50 border border-slate-900 p-1.5 rounded flex justify-between items-center text-xs font-bold">
                      <div>ពិន្ទុសរុប: <strong className="text-blue-900 font-sans ml-1">{(currentStudentRecord.totalScore ?? 0).toFixed(2)}</strong></div>
                      <div>មធ្យមភាគ: <strong className="text-emerald-900 font-sans ml-1">{(currentStudentRecord.averageScore ?? 0).toFixed(2)}</strong></div>
                      <div className="text-rose-800">ចំណាត់ថ្នាក់: <strong className="font-sans ml-1">{currentStudentRecord.classRank}/{currentStudentRecord.totalStudents}</strong></div>
                      <div>និទ្ទេស: <strong className="text-purple-900 font-sans ml-1">{calculateGradeLetter(currentStudentRecord.averageScore)}</strong></div>
                    </div>
                  </div>

                  {/* Right Column: Attendance + Reflection + Signatures + Feedback (5 cols) */}
                  <div className="md:col-span-5 border border-slate-900 p-2.5 rounded flex flex-col justify-between space-y-2 bg-white">
                    {/* Attendance Box */}
                    <div className="bg-slate-50 border-b border-dashed border-slate-300 p-1 rounded text-xs font-bold flex justify-around items-center">
                      <span>ច្បាប់: <strong className="text-blue-900 ml-1">{currentStudentRecord.excusedAbsences} ដង</strong></span>
                      <span className="text-slate-300">|</span>
                      <span>ឥតច្បាប់: <strong className="text-rose-800 ml-1">{currentStudentRecord.unexcusedAbsences} ដង</strong></span>
                    </div>

                    {/* Teacher Reflection Box */}
                    <div className="text-center">
                      <div className="text-[10px] text-slate-700">{currentStudentRecord.lunarDate || lunarDateText}</div>
                      <div className="text-[10px] text-slate-700">{currentStudentRecord.solarDate || solarDateText}</div>
                      <div className="font-extrabold text-xs mt-0.5">មូលវិចារណ៍គ្រូទទួលបន្ទុកថ្នាក់</div>
                      {currentStudentRecord.teacherReflection ? (
                        <div className="text-[10px] italic text-slate-800 p-1.5 bg-blue-50/30 rounded border border-blue-100 min-h-[32px] text-left mt-1">
                          {currentStudentRecord.teacherReflection}
                        </div>
                      ) : (
                        <div className="space-y-1 mt-1">
                          <div className="border-b border-dotted border-black h-2"></div>
                          <div className="border-b border-dotted border-black h-2"></div>
                        </div>
                      )}
                    </div>

                    {/* Signatures (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) */}
                    <div className="pt-1.5 border-t border-dashed border-slate-300 space-y-2 text-xs">
                      {/* ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូទទួលបន្ទុកថ្នាក់ */}
                      <div className="flex justify-end pr-3">
                        <div className="text-center">
                          <div className="font-bold text-[10.5px]">គ្រូទទួលបន្ទុកថ្នាក់</div>
                          <div className="h-5"></div>
                          <div className="font-extrabold text-xs">{currentStudentRecord.teacherName}</div>
                        </div>
                      </div>

                      {/* ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា */}
                      <div className="flex justify-start pl-3">
                        <div className="text-center">
                          <div className="font-bold text-[10.5px]">បានឃើញ និងឯកភាព</div>
                          <div className="font-extrabold text-[10.5px] mt-0.5">នាយកសាលា</div>
                          <div className="h-5"></div>
                          <div className="text-[9px] text-slate-400">........................</div>
                        </div>
                      </div>
                    </div>

                    {/* Parent Feedback */}
                    <div className="text-center pt-1.5 border-t border-slate-200 text-xs">
                      <div className="font-bold text-[10.5px]">មតិរបស់មាតាបិតា - អាណាព្យាបាលសិស្ស</div>
                      {currentStudentRecord.parentFeedback ? (
                        <div className="text-[10px] italic text-slate-800 p-1 bg-slate-50 rounded border border-slate-200 mt-0.5">
                          {currentStudentRecord.parentFeedback}
                        </div>
                      ) : (
                        <div className="space-y-1 mt-1">
                          <div className="border-b border-dotted border-black h-2"></div>
                          <div className="border-b border-dotted border-black h-2"></div>
                          <div className="border-b border-dotted border-black h-2"></div>
                          <div className="border-b border-dotted border-black h-2"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CLASS LEDGER / SUMMARY MATRIX VIEW */}
      {activeMainTab === 'class_ledger' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>តារាងតាមដាន & សរុបលទ្ធផលសិក្សា {periodTitleInfo.periodName}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                បង្ហាញពិន្ទុទាំង ១២ មុខវិជ្ជា ពិន្ទុសរុប មធ្យមភាគ ចំណាត់ថ្នាក់ និងអវត្តមានជាក់ស្តែង
              </p>
            </div>

            <button
              type="button"
              onClick={handlePrintClassLedger}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>បោះពុម្ពតារាងរួម (A4 Landscape)</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-2 text-center w-10">ល.រ</th>
                    <th className="py-3 px-3 min-w-[140px]">គោត្តនាម-នាម</th>
                    <th className="py-3 px-2 text-center w-12">ភេទ</th>
                    {activeSubSubjectsList.map((s) => (
                      <th key={s.id} className="py-3 px-1.5 text-center min-w-[65px] text-[10px]" title={s.name}>
                        {s.name.replace('សមត្ថភាព', '')}
                      </th>
                    ))}
                    <th className="py-3 px-2 text-center bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-extrabold min-w-[65px]">
                      សរុប
                    </th>
                    <th className="py-3 px-2 text-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-extrabold min-w-[60px]">
                      មធ្យម
                    </th>
                    <th className="py-3 px-2 text-center bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-extrabold min-w-[55px]">
                      និទ្ទេស
                    </th>
                    <th className="py-3 px-2 text-center bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-extrabold min-w-[55px]">
                      ចំណាត់ថ្នាក់
                    </th>
                    <th className="py-3 px-2 text-center bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-extrabold min-w-[65px]">
                      ច្បាប់/ឥត
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {currentPeriodRecords.map((rec, idx) => (
                    <tr
                      key={rec.studentId}
                      onClick={() => {
                        setSelectedStudentId(rec.studentId);
                        setActiveMainTab('monthly_card');
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                    >
                      <td className="py-2.5 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-extrabold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                        <span>{rec.studentName}</span>
                        {rec.classRank <= 3 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-black">
                            #{rec.classRank}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          rec.gender === 'ស្រី'
                            ? 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                        }`}>
                          {rec.gender}
                        </span>
                      </td>
                      {rec.scores.map((s) => (
                        <td key={s.id} className="py-2.5 px-1.5 text-center font-sans font-medium text-slate-700 dark:text-slate-300">
                          {s.score.toFixed(1)}
                        </td>
                      ))}
                      <td className="py-2.5 px-2 text-center font-sans font-black bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200">
                        {(rec.totalScore ?? 0).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 text-center font-sans font-black bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200">
                        {(rec.averageScore ?? 0).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 text-center font-sans font-black bg-purple-50/50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-200">
                        {calculateGradeLetter(rec.averageScore)}
                      </td>
                      <td className="py-2.5 px-2 text-center font-sans font-black bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-200">
                        {rec.classRank}
                      </td>
                      <td className="py-2.5 px-2 text-center font-sans font-bold bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200">
                        {rec.excusedAbsences} / {rec.unexcusedAbsences}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUALITATIVE CASE LOGBOOK & INTERVENTIONS */}
      {activeMainTab === 'case_logbook' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-purple-600" />
                <span>កំណត់ត្រាអន្តរាគមន៍ & ករណីសិស្សត្រូវការជំនួយពិសេស</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                កត់ត្រាការជួយសិស្សរៀនយឺត សិស្សអវត្តមានញឹកញាប់ និងការសហការជាមួយមាតាបិតា
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingCase(null);
                setFormCaseStudentId(students[0]?.id || 1);
                setFormCaseDate(new Date().toISOString().split('T')[0]);
                setFormCaseCategory('reading_writing');
                setFormCaseSeverity('high');
                setFormCaseIssue('');
                setFormCaseIntervention('');
                setFormCaseProgress('');
                setFormCaseParent('');
                setFormCaseStatus('in_progress');
                setIsCaseModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>កត់ត្រាករណីសិស្សថ្មី</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseEntries.map((c) => {
              const cat = CATEGORY_META[c.category] || CATEGORY_META.other;
              const stat = STATUS_META[c.status] || STATUS_META.in_progress;
              const StatIcon = stat.icon;

              return (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${cat.bg} ${cat.color} ${cat.border}`}>
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border flex items-center gap-1 ${stat.badgeClass}`}>
                        <StatIcon className="w-3 h-3" />
                        <span>{stat.label}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {c.studentName} ({c.gender})
                      </div>
                      <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{c.date}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
                      <strong className="text-rose-700 dark:text-rose-300 block mb-1">🔍 បញ្ហាសង្កេតឃើញ៖</strong>
                      <p>{c.observedIssue}</p>
                    </div>

                    {c.teacherIntervention && (
                      <div className="text-xs text-slate-700 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50">
                        <strong className="text-blue-800 dark:text-blue-300 block mb-1">💡 វិធានការអន្តរាគមន៍របស់គ្រូ៖</strong>
                        <p>{c.teacherIntervention}</p>
                      </div>
                    )}

                    {c.parentFeedback && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 pt-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span><strong>មតិមាតាបិតា៖</strong> {c.parentFeedback}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCase(c);
                        setFormCaseStudentId(c.studentId);
                        setFormCaseDate(c.date);
                        setFormCaseCategory(c.category);
                        setFormCaseSeverity(c.severity);
                        setFormCaseIssue(c.observedIssue);
                        setFormCaseIntervention(c.teacherIntervention);
                        setFormCaseProgress(c.progressNote || '');
                        setFormCaseParent(c.parentFeedback || '');
                        setFormCaseStatus(c.status);
                        setIsCaseModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>កែប្រែ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`តើអ្នកពិតជាចង់លុបកំណត់ត្រារបស់ ${c.studentName} ឬ?`)) {
                          setCaseEntries((prev) => prev.filter((item) => item.id !== c.id));
                          onShowToast('បានលុបកំណត់ត្រាជោគជ័យ!');
                        }
                      }}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs transition"
                      title="លុបកំណត់ត្រា"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EDIT SINGLE STUDENT SCORES & REFLECTION MODAL */}
      {isEditModalOpen && currentStudentRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>កែប្រែពិន្ទុ & មូលវិចារណ៍ ({currentStudentRecord.studentName})</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedPeriod.label} • ថ្នាក់ទី {currentStudentRecord.grade}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scores Inputs Grid */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ពិន្ទុតាមមុខវិជ្ជាទាំង ១២ (ពិន្ទុពេញ ១០)៖
                </label>
                <span className="text-xs font-bold text-blue-600">
                  មធ្យមភាគស្ទង់៖{' '}
                  {(
                    editingScores.reduce((sum, s) => sum + (Number(s.score) || 0), 0) /
                    (editingScores.length || 1)
                  ).toFixed(2)}{' '}
                  / 10
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
                {editingScores.map((s, sIdx) => (
                  <div key={s.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate mb-1">
                      {sIdx + 1}. {s.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.25"
                        value={s.score}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setEditingScores((prev) =>
                            prev.map((item) => (item.id === s.id ? { ...item, score: val } : item))
                          );
                        }}
                        className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-black text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                      <span className="text-xs font-bold text-slate-400">/ 10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance & Leaves (Synced with Actual Attendance) */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900">
              <div>
                <label className="block text-xs font-bold text-amber-950 dark:text-amber-200 mb-1">
                  អវត្តមានមានច្បាប់ (ដង)៖
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingExcused}
                  onChange={(e) => setEditingExcused(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-950 dark:text-rose-200 mb-1">
                  អវត្តមានឥតច្បាប់ (ដង)៖
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingUnexcused}
                  onChange={(e) => setEditingUnexcused(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Teacher Reflection */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  មូលវិចារណ៍គ្រូទទួលបន្ទុកថ្នាក់៖
                </label>
                <div className="flex gap-1">
                  {PRESET_TEACHER_REFLECTIONS.slice(0, 2).map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setEditingReflection(preset)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 hover:bg-blue-100"
                    >
                      គំរូ {pIdx + 1}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                value={editingReflection}
                onChange={(e) => setEditingReflection(e.target.value)}
                placeholder="កត់ត្រាមូលវិចារណ៍ពីការរៀនសូត្រ អាកប្បកិរិយា និងវិន័យរបស់សិស្ស..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Parent Feedback */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                មតិរបស់មាតាបិតា - អាណាព្យាបាលសិស្ស (ប្រសិនបើមាន)៖
              </label>
              <textarea
                rows={3}
                value={editingParentFeedback}
                onChange={(e) => setEditingParentFeedback(e.target.value)}
                placeholder="មតិយោបល់ឆ្លើយតបពីអាណាព្យាបាល..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                បោះបង់
              </button>

              <button
                type="button"
                onClick={handleSaveStudentResult}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4 text-white" />
                <span>រក្សាទុកទិន្នន័យ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & SCHOOL SETTINGS MODAL */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>កំណត់ក្បាលលិខិតផ្លូវការ & កាលបរិច្ឆេទ</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ការិយាល័យអប់រំ យុវជន និងកីឡា៖
                </label>
                <input
                  type="text"
                  value={districtOffice}
                  onChange={(e) => setDistrictOffice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ឈ្មោះសាលាបឋមសិក្សា៖
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  កាលបរិច្ឆេទចន្ទគតិ (Lunar Date)៖
                </label>
                <input
                  type="text"
                  value={lunarDateText}
                  onChange={(e) => setLunarDateText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  កាលបរិច្ឆេទសុរិយគតិ (Solar Date)៖
                </label>
                <input
                  type="text"
                  value={solarDateText}
                  onChange={(e) => setSolarDateText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  onShowToast('បានរក្សាទុកការកំណត់ក្បាលលិខិតជោគជ័យ!');
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                រួចរាល់
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASE ENTRY MODAL */}
      {isCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-purple-600" />
                <span>{editingCase ? 'កែសម្រួលកំណត់ត្រា' : 'កត់ត្រាករណីសិស្សថ្មី'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCaseModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ជ្រើសរើសសិស្ស៖
                </label>
                <select
                  value={formCaseStudentId}
                  onChange={(e) => setFormCaseStudentId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.gender})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ប្រភេទបញ្ហា/សមត្ថភាព៖
                  </label>
                  <select
                    value={formCaseCategory}
                    onChange={(e) => setFormCaseCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {Object.entries(CATEGORY_META).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.icon} {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ស្ថានភាពវឌ្ឍនភាព៖
                  </label>
                  <select
                    value={formCaseStatus}
                    onChange={(e) => setFormCaseStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  >
                    {Object.entries(STATUS_META).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  បញ្ហាដែលបានសង្កេតឃើញ (Observed Issue)៖
                </label>
                <textarea
                  rows={2}
                  value={formCaseIssue}
                  onChange={(e) => setFormCaseIssue(e.target.value)}
                  placeholder="ពិពណ៌នាពីចំណុចខ្វះខាត ឬបញ្ហារបស់សិស្ស..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  វិធានការជួយ ឬបំប៉នរបស់គ្រូ (Teacher Intervention)៖
                </label>
                <textarea
                  rows={2}
                  value={formCaseIntervention}
                  onChange={(e) => setFormCaseIntervention(e.target.value)}
                  placeholder="វិធានការដោះស្រាយ វិធីសាស្ត្របំប៉ន ឬកិច្ចការប្រគល់ជូន..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ការទាក់ទង ឬមតិមាតាបិតា (Parent Collaboration)៖
                </label>
                <input
                  type="text"
                  value={formCaseParent}
                  onChange={(e) => setFormCaseParent(e.target.value)}
                  placeholder="លទ្ធផលជួបពិភាក្សា ឬទូរស័ព្ទទៅអាណាព្យាបាល..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsCaseModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                បោះបង់
              </button>

              <button
                type="button"
                onClick={() => {
                  const stud = students.find((s) => s.id === formCaseStudentId) || students[0];
                  if (editingCase) {
                    setCaseEntries((prev) =>
                      prev.map((item) =>
                        item.id === editingCase.id
                          ? {
                              ...item,
                              studentId: stud.id,
                              studentName: stud.name,
                              gender: stud.gender,
                              date: formCaseDate,
                              category: formCaseCategory,
                              severity: formCaseSeverity,
                              observedIssue: formCaseIssue,
                              teacherIntervention: formCaseIntervention,
                              progressNote: formCaseProgress,
                              parentFeedback: formCaseParent,
                              status: formCaseStatus,
                              updatedAt: new Date().toISOString(),
                            }
                          : item
                      )
                    );
                    onShowToast('បានកែប្រែកំណត់ត្រាជោគជ័យ!');
                  } else {
                    const newEntry: StudentMonitoringEntry = {
                      id: `case_${Date.now()}`,
                      studentId: stud.id,
                      studentName: stud.name,
                      gender: stud.gender,
                      date: formCaseDate,
                      category: formCaseCategory,
                      severity: formCaseSeverity,
                      observedIssue: formCaseIssue,
                      teacherIntervention: formCaseIntervention,
                      progressNote: formCaseProgress,
                      parentFeedback: formCaseParent,
                      status: formCaseStatus,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    };
                    setCaseEntries((prev) => [newEntry, ...prev]);
                    onShowToast('បានបន្ថែមករណីសិស្សថ្មីជោគជ័យ!');
                  }
                  setIsCaseModalOpen(false);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                រក្សាទុក
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF / Form Customizer Modal */}
      {pdfModalOpen && (
        <PdfCustomizerModal
          templateType="monitoring_book"
          teacher={teacher}
          students={students}
          isOpen={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
        />
      )}

      {/* Primary Sub-Subjects Period Configuration Modal */}
      {isSubSubjectModalOpen && (
        <SubSubjectPeriodConfigModal
          isOpen={isSubSubjectModalOpen}
          onClose={() => setIsSubSubjectModalOpen(false)}
          periodSubSubjectsMap={periodSubSubjectsMap}
          initialPeriodKey={modalConfigPeriodKey}
          activeSubSubjects={activeSubSubjectsList.map((s) => s.id)}
          onSavePeriodConfig={handleSavePeriodSubSubjects}
          onApplyToAllPeriods={handleApplyToAllPeriods}
        />
      )}

      {/* Thursday Work Report Modal (របាយការណ៍បំពេញការងារថ្ងៃព្រហស្បតិ៍ MoEYS) */}
      {isThursdayReportModalOpen && (
        <ThursdayWorkReportModal
          isOpen={isThursdayReportModalOpen}
          onClose={() => setIsThursdayReportModalOpen(false)}
          teacher={teacher}
          students={students}
          attendance={attendance}
          grades={grades}
          currentYear={activeYear}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
