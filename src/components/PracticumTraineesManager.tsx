import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BookOpenCheck,
  BookOpen,
  Users,
  Search,
  Printer,
  Sparkles,
  Edit3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  School,
  Building2,
  Check,
  ChevronRight,
  ShieldCheck,
  Star,
  FileSpreadsheet,
  FileText,
  UserCheck,
  Award,
  Layers,
  Save,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  Calendar,
  Eye,
  CheckSquare,
  HelpCircle,
  RefreshCw,
  Copy,
  Settings2,
  CheckCircle,
  Sliders,
  X,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TeacherProfile, Student, AttendanceDatabase, GradeDatabase } from '../types';
import { saveYearScopedData, loadYearScopedData, getActiveAcademicYear } from '../utils/academicYearStorage';
import {
  calculateSemesterSummary,
  calculateAnnualSummary,
  getStudentGrade,
  getGradeClassification,
  GradeThresholds,
  getAllPrimarySubSubjects,
  PRIMARY_SUB_SUBJECTS,
  PrimarySubSubject
} from '../utils/gradeManager';
import { getKhmerLunarDate, getKhmerSouriyateiDate } from '../utils/khmerDate';

export interface TraineeBookSubjectRecord {
  id: string;
  name: string;
  s1Avg: number;
  s1Rank: number;
  s2Avg: number;
  s2Rank: number;
  annualAvg: number;
  annualRank: number;
  teacherRemarks?: string;
}

export interface TraineeEvaluationRecord {
  studentId: number;
  studentName: string;
  gender: 'ប្រុស' | 'ស្រី';
  dob?: string;
  gradeLevel: string;
  academicYear: string;
  
  // Custom subject scores override (if customized)
  subjectOverrides?: Record<string, { s1?: number; s2?: number; annual?: number; s1Rank?: number; s2Rank?: number; annualRank?: number; teacherRemarks?: string }>;

  // Summary overrides
  examTotalS1?: number;
  examAvgS1?: number;
  monthlyAvgS1?: number;
  semesterAvgS1?: number;
  
  examTotalS2?: number;
  examAvgS2?: number;
  monthlyAvgS2?: number;
  semesterAvgS2?: number;

  annualAvgOverride?: number;
  annualRankOverride?: number;

  // Absences
  absentExcusedS1?: number;
  absentUnexcusedS1?: number;
  absentExcusedS2?: number;
  absentUnexcusedS2?: number;
  absentExcusedAnnual?: number;
  absentUnexcusedAnnual?: number;

  // Page 2: Evaluation in 4 domains
  evalStudyS1?: string;
  evalStudyS2?: string;
  evalStudyAnnual?: string;

  evalMoralS1?: string;
  evalMoralS2?: string;
  evalMoralAnnual?: string;

  evalLaborS1?: string;
  evalLaborS2?: string;
  evalLaborAnnual?: string;

  evalHealthS1?: string;
  evalHealthS2?: string;
  evalHealthAnnual?: string;

  // Exam result for graduation/level completion (former fields kept for backward compatibility)
  examCenter?: string;
  examProvince?: string;
  examRoom?: string;
  examDeskNo?: string;
  examResultStatus?: 'ជាប់' | 'ធ្លាក់' | 'មិនទាន់ប្រឡង';

  // Year-end exam / completion & retest results (លទ្ធផលនៃការប្រឡងបញ្ចប់ឆ្នាំសិក្សា)
  yearEndAcademicYear?: string;
  yearEndPromotionGrade?: string;
  yearEndRepeatGrade?: string;
  retestDate?: string;
  retestSubjects?: string[];
  retestAvgScore?: string;
  retestResult?: 'ជាប់' | 'ធ្លាក់' | 'មិនទាន់តេស្ត' | '';

  // Teacher Remarks
  teacherRemarks?: string;
  promotionDecision?: string; // ឧ. សិស្សបានឡើងទៅរៀនថ្នាក់ទី... ឬ បើធ្លាក់ត្រូវធ្វើតេស្តឡើងថ្នាក់ បើធ្លាក់ទៀតត្រូវរៀនត្រួតថ្នាក់
  praisePoints?: string; // ចំណុចសរសើរ
  improvementPoints?: string; // ការកែលម្អ
  teacherSignDate?: string;
  teacherName?: string;

  // Principal Remarks
  principalOpinion?: string; // យោបល់របស់នាយកសាលា
  principalSignDate?: string;
  principalName?: string;

  // Real-time Document Dates (Chhankatei Lunar & Souriyatei Solar)
  docDateLunar?: string;
  docDateSolar?: string;
  [key: string]: any;
}

export interface TraineeSubjectItem {
  id: string;
  name: string;
  coreCategory: 'khmer' | 'math' | 'science' | 'social' | 'other';
}

interface PracticumTraineesManagerProps {
  teacher: TeacherProfile;
  students: Student[];
  grades?: GradeDatabase;
  attendance?: AttendanceDatabase;
  currentYear?: string;
  gradeThresholds?: GradeThresholds;
  selectedS1Months?: string[];
  selectedS2Months?: string[];
  activeSubSubjects?: string[];
  periodSubSubjectsMap?: Record<string, string[]>;
  subScoresState?: Record<string, Record<number | string, Record<string, number>>>;
  onShowToast: (msg: string, type?: any) => void;
}

// 15 Standard Primary Subjects matching IMG_3875
export const TRAINEE_BOOK_SUBJECTS: TraineeSubjectItem[] = [
  { id: 'reading', name: 'សមត្ថភាពអាន', coreCategory: 'khmer' },
  { id: 'writing', name: 'សមត្ថភាពសរសេរ', coreCategory: 'khmer' },
  { id: 'speaking', name: 'សមត្ថភាពនិយាយ', coreCategory: 'khmer' },
  { id: 'listening', name: 'សមត្ថភាពស្តាប់', coreCategory: 'khmer' },
  { id: 'algebra', name: 'ពីជគណិត', coreCategory: 'math' },
  { id: 'geometry', name: 'ធរណីមាត្រ', coreCategory: 'math' },
  { id: 'biology', name: 'ជីវវិទ្យា', coreCategory: 'science' },
  { id: 'physics', name: 'រូបវិទ្យា', coreCategory: 'science' },
  { id: 'home_arts', name: 'គេហវិទ្យា-អប់រំសិល្បៈ', coreCategory: 'social' },
  { id: 'morals_civics', name: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', coreCategory: 'social' },
  { id: 'geography', name: 'ភូមិវិទ្យា', coreCategory: 'social' },
  { id: 'pe_sports', name: 'អប់រំកាយ-កីឡា', coreCategory: 'social' },
  { id: 'health_hygiene', name: 'សុខភាព-អនាម័យ', coreCategory: 'social' },
  { id: 'life_skills', name: 'អប់រំបំណិនជីវិត', coreCategory: 'social' },
  { id: 'foreign_lang', name: 'ភាសាបរទេស', coreCategory: 'social' },
];

// 10 Evaluation Options for each of the 4 domains according to student profile/types
export const EVAL_DOMAIN_OPTIONS = {
  study: [
    'រៀនពូកែ ឆ្លាតវៃ និងយល់ដឹងមេរៀនបានរហ័ស',
    'រៀនយល់ដឹងមេរៀនបានល្អ និងឧស្សាហ៍ព្យាយាម',
    'មានការរីកចម្រើនជាលំដាប់ក្នុងការសិក្សា',
    'យកចិត្តទុកដាក់ស្តាប់ និងចូលរួមឆ្លើយសំណួរ',
    'កម្រិតមធ្យម អាចតាមទាន់មេរៀនក្នុងថ្នាក់',
    'រៀនបានសមរម្យ តែត្រូវការបង្កើនការអានបន្ថែម',
    'យល់ដឹងមេរៀនបានខ្លះៗ តែឆាប់ភ្លេច',
    'រៀនយឺត ត្រូវការការណែនាំ និងពន្យល់ផ្ទាល់',
    'មិនសូវផ្តោតអារម្មណ៍រៀន តែមានភាពឆ្លាតវៃ',
    'ខ្សោយការសិក្សា ត្រូវខិតខំពង្រឹងបន្ថែមខ្លាំង',
  ],
  moral: [
    'ស្លូតបូត សុភាពរាបសារ និងគោរពវិន័យបានល្អឥតខ្ចោះ',
    'មានទំនាក់ទំនងល្អ រួសរាយ និងចេះជួយយកអាសាគ្នា',
    'គោរពវិន័យសាលា និងស្តាប់ដំបូន្មានលោកគ្រូអ្នកគ្រូ',
    'មានទំនួលខុសត្រូវខ្ពស់ ស្មោះត្រង់ និងម៉ឺងម៉ាត់',
    'ស្លូតបូត រួសរាយ មិនបង្កជម្លោះ និងចេះអត់ឱន',
    'ស្ងប់ស្ងាត់ ស្លូតបូត តែមិនសូវមានមាត់ក',
    'រហ័សរហួន រួសរាយ ពេលខ្លះរពឹសបន្តិចបន្តួច',
    'ចេះកែលម្អកំហុស និងទទួលយកការណែនាំបានល្អ',
    'មិនសូវសហការ ត្រូវការការលើកទឹកចិត្តបន្ថែម',
    'ពេលខ្លះធ្វេសប្រហែសវិន័យ ត្រូវតាមដានអប់រំ',
  ],
  labor: [
    'សកម្មក្នុងការងារពលកម្ម ឧស្សាហ៍ព្យាយាមណាស់',
    'ចូលរួមសម្អាតថ្នាក់ និងបរិស្ថានសាលាបានល្អ',
    'ស្រឡាញ់ពលកម្ម និងចេះថែរក្សាសម្ភារៈរួម',
    'រួសរាយរហ័សរហួន និងស្ម័គ្រចិត្តជួយការងារជានិច្ច',
    'ចេះសហការធ្វើការងារជាក្រុមបានយ៉ាងល្អ',
    'ចូលរួមពលកម្មតាមការចាត់តាំងរបស់គ្រូ',
    'ធ្វើការងារបានសមរម្យ តាមការណែនាំ',
    'មិនសូវចូលចិត្តពលកម្ម តែអាចធ្វើបាន',
    'យឺតយ៉ាវក្នុងការងារពលកម្ម ត្រូវជំរុញ',
    'ខ្វះការចូលរួម ត្រូវលើកទឹកចិត្តឱ្យស្រឡាញ់ពលកម្ម',
  ],
  health: [
    'សុខភាពល្អមាំមួន និងប្រកាន់ខ្ជាប់អនាម័យ ៣ប្រការ',
    'ស្លៀកពាក់ស្អាតបាត មានរបៀបរៀបរយល្អជានិច្ច',
    'មានអនាម័យផ្ទាល់ខ្លួនល្អ និងចូលចិត្តកីឡា',
    'ស្អាតបាត ក្រចកដៃសក់ក្បាលរៀបរយជានិច្ច',
    'សុខភាពល្អធម្មតា កម្រឈឺ ឬសុំច្បាប់',
    'ចេះការពារសុខភាព និងសម្អាតបរិស្ថានជុំវិញ',
    'សុខភាពសមរម្យ ពេលខ្លះឈឺផ្តាសាយបន្តិចបន្តួច',
    'ស្លៀកពាក់សមរម្យ តែត្រូវរំលឹកអនាម័យក្រចកដៃ',
    'សុខភាពខ្សោយ ឧស្សាហ៍ឈឺ ឬសុំច្បាប់ញឹកញាប់',
    'ខ្វះការថែទាំអនាម័យផ្ទាល់ខ្លួន ត្រូវណែនាំបន្ថែម',
  ],
};

function getNextGradeLabel(currentGrade: string): string {
  const match = currentGrade.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    return `ថ្នាក់ទី ${num + 1}`;
  }
  return 'ថ្នាក់បន្ទាប់';
}

export const PracticumTraineesManager: React.FC<PracticumTraineesManagerProps> = ({
  teacher,
  students,
  grades = {},
  attendance = {},
  currentYear,
  gradeThresholds,
  selectedS1Months,
  selectedS2Months,
  activeSubSubjects,
  periodSubSubjectsMap,
  subScoresState,
  onShowToast,
}) => {
  const activeYear = currentYear || teacher.academicYear || getActiveAcademicYear();

  // Load configured thresholds, months, and sub-scores with persistent year-scoped fallback
  const effectiveGradeThresholds = useMemo(() => {
    return gradeThresholds || loadYearScopedData(activeYear, 'grade_thresholds', null) || { A: 8.5, B: 7.5, C: 6.5, D: 5.0, E: 4.0 };
  }, [gradeThresholds, activeYear]);

  const effectiveS1Months = useMemo(() => {
    return selectedS1Months || loadYearScopedData(activeYear, 'selected_s1_months', null) || ['m10', 'm11', 'm12', 'm01'];
  }, [selectedS1Months, activeYear]);

  const effectiveS2Months = useMemo(() => {
    return selectedS2Months || loadYearScopedData(activeYear, 'selected_s2_months', null) || ['m02', 'm03', 'm04', 'm05', 'm06', 'm07'];
  }, [selectedS2Months, activeYear]);

  const effectiveActiveSubSubjects = useMemo(() => {
    return activeSubSubjects || loadYearScopedData(activeYear, 'active_sub_subjects', null) || undefined;
  }, [activeSubSubjects, activeYear]);

  const effectiveSubScores = useMemo(() => {
    return subScoresState || loadYearScopedData(activeYear, 'sub_scores', null) || undefined;
  }, [subScoresState, activeYear]);

  const effectivePeriodSubSubjectsMap = useMemo(() => {
    if (periodSubSubjectsMap && Object.keys(periodSubSubjectsMap).length > 0) return periodSubSubjectsMap;
    const yearSaved = loadYearScopedData<Record<string, string[]> | null>(activeYear, 'period_sub_subjects_map', null);
    if (yearSaved && typeof yearSaved === 'object') return yearSaved;
    try {
      const saved = localStorage.getItem('school_period_sub_subjects_map');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  }, [periodSubSubjectsMap, activeYear]);

  // Subject display mode: 'actual' (matches S1 & S2 grade entry) | 'template15' (classic 15) | 'custom'
  const [subjectMode, setSubjectMode] = useState<'actual' | 'template15' | 'custom'>(() => {
    const saved = loadYearScopedData<'actual' | 'template15' | 'custom' | null>(activeYear, 'trainee_subject_mode', null);
    return saved || 'actual';
  });

  const [customSelectedSubIds, setCustomSelectedSubIds] = useState<string[]>(() => {
    const saved = loadYearScopedData<string[] | null>(activeYear, 'trainee_custom_sub_ids', null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return [];
  });

  const [isSubjectConfigOpen, setIsSubjectConfigOpen] = useState<boolean>(false);
  const [newRetestSubjectInput, setNewRetestSubjectInput] = useState<string>('');

  // Derive dynamic list of sub-subjects evaluated specifically in Exam Periods (Semester 1 Exam & Semester 2 Exam)
  const actualSubjectsList: TraineeSubjectItem[] = useMemo(() => {
    const allDefs = getAllPrimarySubSubjects();
    const subIdsSet = new Set<string>();

    const examPeriodKeys = ['s1_exam', 's2_exam'];

    // 1. Check periodSubSubjectsMap specifically for S1 Exam ('s1_exam') and S2 Exam ('s2_exam') ONLY
    if (effectivePeriodSubSubjectsMap) {
      examPeriodKeys.forEach((pKey) => {
        const pSubs = effectivePeriodSubSubjectsMap[pKey];
        if (Array.isArray(pSubs) && pSubs.length > 0) {
          pSubs.forEach((id) => subIdsSet.add(id));
        }
      });
    }

    // 2. Check any scores recorded during semester exam periods ONLY (s1_exam and s2_exam)
    if (effectiveSubScores) {
      examPeriodKeys.forEach((pKey) => {
        const pData = effectiveSubScores[pKey];
        if (pData) {
          Object.values(pData).forEach((studentScores) => {
            if (studentScores && typeof studentScores === 'object') {
              Object.keys(studentScores).forEach((k) => {
                const val = Number(studentScores[k]);
                if (!isNaN(val) && val > 0) {
                  subIdsSet.add(k);
                }
              });
            }
          });
        }
      });
    }

    // Also check student grades recorded during s1_exam and s2_exam
    if (grades) {
      examPeriodKeys.forEach((pKey) => {
        const pData = grades[pKey];
        if (pData && typeof pData === 'object') {
          Object.values(pData).forEach((gradeObj: any) => {
            if (gradeObj && typeof gradeObj === 'object') {
              if (gradeObj.subScores && typeof gradeObj.subScores === 'object') {
                Object.keys(gradeObj.subScores).forEach((k) => {
                  const val = Number(gradeObj.subScores[k]);
                  if (!isNaN(val) && val > 0) {
                    subIdsSet.add(k);
                  }
                });
              }
            }
          });
        }
      });
    }

    // 3. Fallback: If no specific exam sub-subjects or exam scores were found in s1_exam/s2_exam,
    // fallback to effectiveActiveSubSubjects (the teacher's active sub-subjects list)
    if (subIdsSet.size === 0 && effectiveActiveSubSubjects && Array.isArray(effectiveActiveSubSubjects) && effectiveActiveSubSubjects.length > 0) {
      effectiveActiveSubSubjects.forEach((id) => subIdsSet.add(id));
    }

    // 4. Ultimate fallback if nothing configured: standard primary default sub-subjects
    if (subIdsSet.size === 0) {
      PRIMARY_SUB_SUBJECTS.filter((s) => s.defaultSelected).forEach((s) => subIdsSet.add(s.id));
    }

    // Convert to TraineeSubjectItem in primary curriculum order
    const list: TraineeSubjectItem[] = [];
    allDefs.forEach((def) => {
      if (subIdsSet.has(def.id) || subIdsSet.has(def.name)) {
        list.push({
          id: def.id,
          name: def.name,
          coreCategory: (def.category as any) || 'other',
        });
        subIdsSet.delete(def.id);
        subIdsSet.delete(def.name);
      }
    });

    // Any remaining custom IDs
    subIdsSet.forEach((remainingId) => {
      list.push({
        id: remainingId,
        name: remainingId,
        coreCategory: 'other',
      });
    });

    return list.length > 0 ? list : TRAINEE_BOOK_SUBJECTS;
  }, [effectivePeriodSubSubjectsMap, effectiveActiveSubSubjects, effectiveSubScores, grades]);

  // Active subjects list used everywhere in Trainee Book
  const activeSubjectsList: TraineeSubjectItem[] = useMemo(() => {
    if (subjectMode === 'template15') {
      return TRAINEE_BOOK_SUBJECTS;
    }
    if (subjectMode === 'custom' && customSelectedSubIds.length > 0) {
      const allDefs = getAllPrimarySubSubjects();
      return allDefs
        .filter((d) => customSelectedSubIds.includes(d.id))
        .map((d) => ({ id: d.id, name: d.name, coreCategory: (d.category as any) || 'other' }));
    }
    return actualSubjectsList;
  }, [subjectMode, customSelectedSubIds, actualSubjectsList]);

  const handleSetSubjectMode = (mode: 'actual' | 'template15' | 'custom') => {
    setSubjectMode(mode);
    saveYearScopedData(activeYear, 'trainee_subject_mode', mode);
    onShowToast?.(`បានកំណត់ទម្រង់មុខវិជ្ជាទៅជា៖ ${mode === 'actual' ? 'ជាក់ស្ដែងតាមការកំណត់ពេលប្រឡង (ឆមាសទី១ & ឆមាសទី២)' : mode === 'template15' ? 'គំរូដើម ១៥ មុខវិជ្ជា' : 'ជ្រើសរើសដោយខ្លួនឯង'}`);
  };

  const handleToggleCustomSub = (subId: string) => {
    const current = customSelectedSubIds.length > 0 ? customSelectedSubIds : actualSubjectsList.map((s) => s.id);
    const next = current.includes(subId) ? current.filter((id) => id !== subId) : [...current, subId];
    setCustomSelectedSubIds(next);
    saveYearScopedData(activeYear, 'trainee_custom_sub_ids', next);
  };

  // Active view: 'single_student' | 'batch_table'
  const [activeViewMode, setActiveViewMode] = useState<'single_student' | 'batch_table'>('single_student');
  // In single student mode: 'page1' | 'page2' | 'both'
  const [activePageTab, setActivePageTab] = useState<'both' | 'page1' | 'page2'>('both');

  // Selected student
  const [selectedStudentId, setSelectedStudentId] = useState<number>(() => {
    return students.length > 0 ? students[0].id : 1;
  });

  // Search/Filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persistent trainee book records stored per academic year
  const [traineeRecords, setTraineeRecords] = useState<Record<number, TraineeEvaluationRecord>>(() => {
    const saved = loadYearScopedData<Record<number, TraineeEvaluationRecord> | null>(activeYear, 'trainee_books_db', null);
    if (saved && typeof saved === 'object') return saved;
    return {};
  });

  // Print modal state & options
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printScope, setPrintScope] = useState<'single' | 'all'>('single');
  const [printPageOption, setPrintPageOption] = useState<'both' | 'page1' | 'page2'>('both');

  // Direct editing mode in Single Student view: view mode (default, clean typography & easy copy-paste) vs edit mode (interactive inputs)
  const [isDirectEditMode, setIsDirectEditMode] = useState<boolean>(false);

  // Save changes to year storage
  const saveRecords = (newRecords: Record<number, TraineeEvaluationRecord> | any) => {
    setTraineeRecords(newRecords);
    saveYearScopedData(activeYear, 'trainee_books_db', newRecords);
  };

  // Synchronize student records with class list and grade database
  useEffect(() => {
    if (students.length === 0) return;

    // Check if current selected student exists
    if (!students.some((s) => s.id === selectedStudentId)) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  // Derived absences from attendance database for each student
  const studentAbsences = useMemo(() => {
    const result: Record<number, { s1Excused: number; s1Unexcused: number; s2Excused: number; s2Unexcused: number; annualExcused: number; annualUnexcused: number }> = {};

    students.forEach((s) => {
      result[s.id] = { s1Excused: 0, s1Unexcused: 0, s2Excused: 0, s2Unexcused: 0, annualExcused: 0, annualUnexcused: 0 };
    });

    if (!attendance || typeof attendance !== 'object') return result;

    Object.entries(attendance).forEach(([dateStr, record]) => {
      if (!record || typeof record !== 'object') return;
      // Determine semester from month in date (YYYY-MM-DD)
      const parts = dateStr.split('-');
      const month = parts.length > 1 ? parseInt(parts[1], 10) : 10;
      // Semester 1: Oct (10), Nov (11), Dec (12), Jan (1)
      const isS1 = month === 10 || month === 11 || month === 12 || month === 1;

      Object.entries(record).forEach(([stIdStr, status]) => {
        const stId = parseInt(stIdStr, 10);
        if (!result[stId]) {
          result[stId] = { s1Excused: 0, s1Unexcused: 0, s2Excused: 0, s2Unexcused: 0, annualExcused: 0, annualUnexcused: 0 };
        }
        if (status === 'permission') {
          if (isS1) result[stId].s1Excused += 1;
          else result[stId].s2Excused += 1;
          result[stId].annualExcused += 1;
        } else if (status === 'absent') {
          if (isS1) result[stId].s1Unexcused += 1;
          else result[stId].s2Unexcused += 1;
          result[stId].annualUnexcused += 1;
        }
      });
    });

    return result;
  }, [attendance, students]);

  // Computed Grades Summary for Semester 1, Semester 2, and Annual for ALL students using exact Gradebook engine
  const computedClassScores = useMemo(() => {
    const s1Res = calculateSemesterSummary(students, grades, 1, effectiveS1Months, effectiveGradeThresholds, effectiveActiveSubSubjects, effectiveSubScores, effectivePeriodSubSubjectsMap);
    const s2Res = calculateSemesterSummary(students, grades, 2, effectiveS2Months, effectiveGradeThresholds, effectiveActiveSubSubjects, effectiveSubScores, effectivePeriodSubSubjectsMap);
    const annualRes = calculateAnnualSummary(students, grades, effectiveGradeThresholds, effectiveS1Months, effectiveS2Months, effectiveActiveSubSubjects, effectiveSubScores, effectivePeriodSubSubjectsMap);

    const s1List: any[] = (s1Res as any)?.list || (s1Res as any)?.students || [];
    const s2List: any[] = (s2Res as any)?.list || (s2Res as any)?.students || [];
    const annualList: any[] = (annualRes as any)?.list || (annualRes as any)?.students || [];

    const s1Map = new Map<number, any>(s1List.map((item: any) => [item.student?.id || item.studentId, item]));
    const s2Map = new Map<number, any>(s2List.map((item: any) => [item.student?.id || item.studentId, item]));
    const annualMap = new Map<number, any>(annualList.map((item: any) => [item.student?.id || item.studentId, item]));

    return { s1Map, s2Map, annualMap, s1Res, s2Res, annualRes };
  }, [students, grades, effectiveS1Months, effectiveS2Months, effectiveGradeThresholds, effectiveActiveSubSubjects, effectiveSubScores, effectivePeriodSubSubjectsMap]);

  // Helper to extract student subject score for any period
  const getSubjectPeriodScore = useCallback((
    periodKey: string,
    studentId: number,
    sub: TraineeSubjectItem
  ): number => {
    // 1. Check effectiveSubScores with numeric and string studentId
    if (effectiveSubScores && effectiveSubScores[periodKey]) {
      const studentSubMap = effectiveSubScores[periodKey][studentId] || effectiveSubScores[periodKey][String(studentId)];
      if (studentSubMap) {
        if (studentSubMap[sub.id] !== undefined && !isNaN(Number(studentSubMap[sub.id]))) {
          return Number(studentSubMap[sub.id]);
        }
        if (studentSubMap[sub.name] !== undefined && !isNaN(Number(studentSubMap[sub.name]))) {
          return Number(studentSubMap[sub.name]);
        }
        // Khmer phonetic / spell variants
        if (sub.id === 'listening' || sub.name.includes('ស្ដាប់') || sub.name.includes('ស្តាប់')) {
          if (studentSubMap['listening'] !== undefined) return Number(studentSubMap['listening']) || 0;
          if (studentSubMap['សមត្ថភាពស្ដាប់'] !== undefined) return Number(studentSubMap['សមត្ថភាពស្ដាប់']) || 0;
          if (studentSubMap['សមត្ថភាពស្តាប់'] !== undefined) return Number(studentSubMap['សមត្ថភាពស្តាប់']) || 0;
        }
        if (sub.id === 'reading' || sub.name.includes('អាន')) {
          if (studentSubMap['reading'] !== undefined) return Number(studentSubMap['reading']) || 0;
          if (studentSubMap['សមត្ថភាពអាន'] !== undefined) return Number(studentSubMap['សមត្ថភាពអាន']) || 0;
        }
        if (sub.id === 'writing' || sub.name.includes('សរសេរ')) {
          if (studentSubMap['writing'] !== undefined) return Number(studentSubMap['writing']) || 0;
          if (studentSubMap['សមត្ថភាពសរសេរ'] !== undefined) return Number(studentSubMap['សមត្ថភាពសរសេរ']) || 0;
        }
        if (sub.id === 'speaking' || sub.name.includes('និយាយ')) {
          if (studentSubMap['speaking'] !== undefined) return Number(studentSubMap['speaking']) || 0;
          if (studentSubMap['សមត្ថភាពនិយាយ'] !== undefined) return Number(studentSubMap['សមត្ថភាពនិយាយ']) || 0;
        }
      }
    }

    // 2. Check direct grades database
    if (grades && grades[periodKey]) {
      const studentGradeMap = grades[periodKey][studentId] || grades[periodKey][String(studentId)];
      if (studentGradeMap) {
        if (studentGradeMap.subScores) {
          if (studentGradeMap.subScores[sub.id] !== undefined && !isNaN(Number(studentGradeMap.subScores[sub.id]))) {
            return Number(studentGradeMap.subScores[sub.id]);
          }
          if (studentGradeMap.subScores[sub.name] !== undefined && !isNaN(Number(studentGradeMap.subScores[sub.name]))) {
            return Number(studentGradeMap.subScores[sub.name]);
          }
          if (sub.id === 'listening' || sub.name.includes('ស្ដាប់') || sub.name.includes('ស្តាប់')) {
            if (studentGradeMap.subScores['listening'] !== undefined) return Number(studentGradeMap.subScores['listening']) || 0;
            if (studentGradeMap.subScores['សមត្ថភាពស្ដាប់'] !== undefined) return Number(studentGradeMap.subScores['សមត្ថភាពស្ដាប់']) || 0;
            if (studentGradeMap.subScores['សមត្ថភាពស្តាប់'] !== undefined) return Number(studentGradeMap.subScores['សមត្ថភាពស្តាប់']) || 0;
          }
          if (sub.id === 'reading' || sub.name.includes('អាន')) {
            if (studentGradeMap.subScores['reading'] !== undefined) return Number(studentGradeMap.subScores['reading']) || 0;
            if (studentGradeMap.subScores['សមត្ថភាពអាន'] !== undefined) return Number(studentGradeMap.subScores['សមត្ថភាពអាន']) || 0;
          }
        }
        if (sub.coreCategory !== 'other' && studentGradeMap[sub.coreCategory] !== undefined && Number(studentGradeMap[sub.coreCategory]) > 0) {
          return Number(studentGradeMap[sub.coreCategory]);
        }
      }
    }

    // 3. Fallback to getStudentGrade
    const g = getStudentGrade(grades, periodKey, studentId);
    if (g.subScores) {
      if (g.subScores[sub.id] !== undefined && !isNaN(Number(g.subScores[sub.id]))) {
        return Number(g.subScores[sub.id]);
      }
      if (g.subScores[sub.name] !== undefined && !isNaN(Number(g.subScores[sub.name]))) {
        return Number(g.subScores[sub.name]);
      }
      if (sub.id === 'listening' || sub.name.includes('ស្ដាប់') || sub.name.includes('ស្តាប់')) {
        if (g.subScores['listening'] !== undefined) return Number(g.subScores['listening']) || 0;
        if (g.subScores['សមត្ថភាពស្ដាប់'] !== undefined) return Number(g.subScores['សមត្ថភាពស្ដាប់']) || 0;
        if (g.subScores['សមត្ថភាពស្តាប់'] !== undefined) return Number(g.subScores['សមត្ថភាពស្តាប់']) || 0;
      }
    }
    if (sub.coreCategory !== 'other' && g && g[sub.coreCategory] !== undefined && Number(g[sub.coreCategory]) > 0) {
      return Number(g[sub.coreCategory]);
    }

    return 0;
  }, [effectiveSubScores, grades]);

  // Helper to compute subject scores and ranks for all students matching dynamic active subjects
  const allStudentSubjectData = useMemo(() => {
    const dataByStudent: Record<number, Record<string, { s1: number; s2: number; annual: number; s1Rank: number; s2Rank: number; annualRank: number }>> = {};

    // First compute raw scores from actual monthly and exam grades
    students.forEach((s) => {
      dataByStudent[s.id] = {};
      const record = traineeRecords[s.id];

      activeSubjectsList.forEach((sub) => {
        const override = record?.subjectOverrides?.[sub.id];

        // Semester 1: Take directly from S1 Exam score (ពិន្ទុឆមាសទី១)
        const s1ExamScore = getSubjectPeriodScore('s1_exam', s.id, sub);
        let s1Calculated = 0;
        if (s1ExamScore > 0) {
          s1Calculated = Number(s1ExamScore.toFixed(2));
        } else {
          // Fallback only if no exam score was recorded
          const s1ActiveMonthScores = effectiveS1Months
            .map((m) => getSubjectPeriodScore(m, s.id, sub))
            .filter((v) => v > 0);
          if (s1ActiveMonthScores.length > 0) {
            s1Calculated = Number((s1ActiveMonthScores.reduce((a, b) => a + b, 0) / s1ActiveMonthScores.length).toFixed(2));
          }
        }

        // Semester 2: Take directly from S2 Exam score (ពិន្ទុឆមាសទី២)
        const s2ExamScore = getSubjectPeriodScore('s2_exam', s.id, sub);
        let s2Calculated = 0;
        if (s2ExamScore > 0) {
          s2Calculated = Number(s2ExamScore.toFixed(2));
        } else {
          // Fallback only if no exam score was recorded
          const s2ActiveMonthScores = effectiveS2Months
            .map((m) => getSubjectPeriodScore(m, s.id, sub))
            .filter((v) => v > 0);
          if (s2ActiveMonthScores.length > 0) {
            s2Calculated = Number((s2ActiveMonthScores.reduce((a, b) => a + b, 0) / s2ActiveMonthScores.length).toFixed(2));
          }
        }

        // Annual score: Average of Semester 1 and Semester 2 scores
        let annualCalculated = 0;
        if (s1Calculated > 0 && s2Calculated > 0) {
          annualCalculated = Number(((s1Calculated + s2Calculated) / 2).toFixed(2));
        } else if (s2Calculated > 0) {
          annualCalculated = s2Calculated;
        } else {
          annualCalculated = s1Calculated;
        }

        const s1Val = override?.s1 !== undefined ? override.s1 : s1Calculated;
        const s2Val = override?.s2 !== undefined ? override.s2 : s2Calculated;
        const annualVal = override?.annual !== undefined ? override.annual : annualCalculated;

        dataByStudent[s.id][sub.id] = {
          s1: s1Val,
          s2: s2Val,
          annual: annualVal,
          s1Rank: 1,
          s2Rank: 1,
          annualRank: 1,
        };
      });
    });

    // Compute rankings per subject dynamically with standard competition ranking
    activeSubjectsList.forEach((sub) => {
      // S1 Rank
      const s1Sorted = [...students].sort((a, b) => ((dataByStudent[b.id]?.[sub.id]?.s1) || 0) - ((dataByStudent[a.id]?.[sub.id]?.s1) || 0));
      let currentRankS1 = 1;
      s1Sorted.forEach((s, idx) => {
        const score = dataByStudent[s.id]?.[sub.id]?.s1 || 0;
        if (idx > 0) {
          const prevScore = dataByStudent[s1Sorted[idx - 1].id]?.[sub.id]?.s1 || 0;
          if (score < prevScore) {
            currentRankS1 = idx + 1;
          }
        }
        if (dataByStudent[s.id]?.[sub.id]) {
          dataByStudent[s.id][sub.id].s1Rank = score > 0 ? currentRankS1 : students.length;
        }
      });

      // S2 Rank
      const s2Sorted = [...students].sort((a, b) => ((dataByStudent[b.id]?.[sub.id]?.s2) || 0) - ((dataByStudent[a.id]?.[sub.id]?.s2) || 0));
      let currentRankS2 = 1;
      s2Sorted.forEach((s, idx) => {
        const score = dataByStudent[s.id]?.[sub.id]?.s2 || 0;
        if (idx > 0) {
          const prevScore = dataByStudent[s2Sorted[idx - 1].id]?.[sub.id]?.s2 || 0;
          if (score < prevScore) {
            currentRankS2 = idx + 1;
          }
        }
        if (dataByStudent[s.id]?.[sub.id]) {
          dataByStudent[s.id][sub.id].s2Rank = score > 0 ? currentRankS2 : students.length;
        }
      });

      // Annual Rank
      const annualSorted = [...students].sort((a, b) => ((dataByStudent[b.id]?.[sub.id]?.annual) || 0) - ((dataByStudent[a.id]?.[sub.id]?.annual) || 0));
      let currentRankAnnual = 1;
      annualSorted.forEach((s, idx) => {
        const score = dataByStudent[s.id]?.[sub.id]?.annual || 0;
        if (idx > 0) {
          const prevScore = dataByStudent[annualSorted[idx - 1].id]?.[sub.id]?.annual || 0;
          if (score < prevScore) {
            currentRankAnnual = idx + 1;
          }
        }
        if (dataByStudent[s.id]?.[sub.id]) {
          dataByStudent[s.id][sub.id].annualRank = score > 0 ? currentRankAnnual : students.length;
        }
      });
    });

    return dataByStudent;
  }, [students, traineeRecords, activeSubjectsList, effectiveS1Months, effectiveS2Months, getSubjectPeriodScore]);

  // Precompute comprehensive summary metrics and rankings for all students across the class
  const classSummaryRankings = useMemo(() => {
    const rawMetrics: Record<number, {
      examTotalS1: number;
      examTotalS2: number;
      examTotalAnnual: number;
      examAvgS1: number;
      examAvgS2: number;
      examAvgAnnual: number;
      monthlyAvgS1: number;
      monthlyAvgS2: number;
      monthlyAvgAnnual: number;
      semesterAvgS1: number;
      semesterAvgS2: number;
      annualAvg: number;
    }> = {};

    const subCount = activeSubjectsList.length || 1;

    students.forEach((s) => {
      const s1Item = computedClassScores.s1Map.get(s.id);
      const s2Item = computedClassScores.s2Map.get(s.id);
      const annualItem = computedClassScores.annualMap.get(s.id);
      const rec = traineeRecords[s.id];

      // Exam totals (sum of active subjects or calculated from scorebook)
      let s1ExamTotal = 0;
      let s2ExamTotal = 0;
      let s1ExamCount = 0;
      let s2ExamCount = 0;
      activeSubjectsList.forEach((sub) => {
        const studentSubData = allStudentSubjectData[s.id]?.[sub.id];
        const sc1 = studentSubData?.s1 !== undefined ? studentSubData.s1 : getSubjectPeriodScore('s1_exam', s.id, sub);
        const sc2 = studentSubData?.s2 !== undefined ? studentSubData.s2 : getSubjectPeriodScore('s2_exam', s.id, sub);
        if (sc1 > 0) {
          s1ExamTotal += sc1;
          s1ExamCount++;
        }
        if (sc2 > 0) {
          s2ExamTotal += sc2;
          s2ExamCount++;
        }
      });
      s1ExamTotal = Number(s1ExamTotal.toFixed(2));
      s2ExamTotal = Number(s2ExamTotal.toFixed(2));

      if (s1ExamTotal === 0 && s1Item?.examAvg && s1Item.examAvg > 0) {
        s1ExamTotal = Number((s1Item.examAvg * subCount).toFixed(2));
      }
      if (s2ExamTotal === 0 && s2Item?.examAvg && s2Item.examAvg > 0) {
        s2ExamTotal = Number((s2Item.examAvg * subCount).toFixed(2));
      }
      const examTotalAnnual = (s1ExamTotal > 0 && s2ExamTotal > 0)
        ? Number((((s1ExamTotal + s2ExamTotal)) / 2).toFixed(2))
        : (s2ExamTotal > 0 ? s2ExamTotal : s1ExamTotal);

      const examAvgS1 = s1ExamCount > 0 ? Number((s1ExamTotal / s1ExamCount).toFixed(2)) : (subCount > 0 ? Number((s1ExamTotal / subCount).toFixed(2)) : (s1Item?.examAvg || 0));
      const examAvgS2 = s2ExamCount > 0 ? Number((s2ExamTotal / s2ExamCount).toFixed(2)) : (subCount > 0 ? Number((s2ExamTotal / subCount).toFixed(2)) : (s2Item?.examAvg || 0));
      const examAvgAnnual = (examAvgS1 > 0 && examAvgS2 > 0)
        ? Number((((examAvgS1 + examAvgS2)) / 2).toFixed(2))
        : (examAvgS2 > 0 ? examAvgS2 : examAvgS1);

      const monthlyAvgS1 = s1Item?.monthlyMean || 0;
      const monthlyAvgS2 = s2Item?.monthlyMean || 0;
      const monthlyAvgAnnual = (monthlyAvgS1 > 0 && monthlyAvgS2 > 0)
        ? Number((((monthlyAvgS1 + monthlyAvgS2)) / 2).toFixed(2))
        : (monthlyAvgS2 > 0 ? monthlyAvgS2 : monthlyAvgS1);

      const semesterAvgS1 = (monthlyAvgS1 > 0 && examAvgS1 > 0)
        ? Number(((monthlyAvgS1 + examAvgS1) / 2).toFixed(2))
        : (s1Item?.semesterAvg && s1Item.semesterAvg > 0 ? s1Item.semesterAvg : (examAvgS1 > 0 ? examAvgS1 : monthlyAvgS1));

      const semesterAvgS2 = (monthlyAvgS2 > 0 && examAvgS2 > 0)
        ? Number(((monthlyAvgS2 + examAvgS2) / 2).toFixed(2))
        : (s2Item?.semesterAvg && s2Item.semesterAvg > 0 ? s2Item.semesterAvg : (examAvgS2 > 0 ? examAvgS2 : monthlyAvgS2));

      const annualFromSemesters = (semesterAvgS1 > 0 && semesterAvgS2 > 0)
        ? Number(((semesterAvgS1 + semesterAvgS2) / 2).toFixed(2))
        : (semesterAvgS2 > 0 ? semesterAvgS2 : semesterAvgS1);

      const annualAvg = annualFromSemesters > 0
        ? annualFromSemesters
        : (annualItem?.annualAvg || 0);

      rawMetrics[s.id] = {
        examTotalS1: s1ExamTotal,
        examTotalS2: s2ExamTotal,
        examTotalAnnual,
        examAvgS1,
        examAvgS2,
        examAvgAnnual,
        monthlyAvgS1,
        monthlyAvgS2,
        monthlyAvgAnnual,
        semesterAvgS1,
        semesterAvgS2,
        annualAvg,
      };
    });

    // Helper to rank students descending with competition ranking for ties
    const rankByField = (field: keyof typeof rawMetrics[number]) => {
      const sorted = [...students].sort((a, b) => (rawMetrics[b.id]?.[field] || 0) - (rawMetrics[a.id]?.[field] || 0));
      const rankMap: Record<number, number> = {};
      let currentRank = 1;
      sorted.forEach((s, idx) => {
        const currentVal = rawMetrics[s.id]?.[field] || 0;
        if (idx > 0) {
          const prevVal = rawMetrics[sorted[idx - 1].id]?.[field] || 0;
          if (currentVal < prevVal) {
            currentRank = idx + 1;
          }
        }
        rankMap[s.id] = currentVal > 0 ? currentRank : students.length;
      });
      return rankMap;
    };

    const s1ExamTotalRanks = rankByField('examTotalS1');
    const s2ExamTotalRanks = rankByField('examTotalS2');
    const annualExamTotalRanks = rankByField('examTotalAnnual');

    const s1ExamAvgRanks = rankByField('examAvgS1');
    const s2ExamAvgRanks = rankByField('examAvgS2');
    const annualExamAvgRanks = rankByField('examAvgAnnual');

    const s1MonthlyMeanRanks = rankByField('monthlyAvgS1');
    const s2MonthlyMeanRanks = rankByField('monthlyAvgS2');
    const annualMonthlyMeanRanks = rankByField('monthlyAvgAnnual');
    const s1SemesterRanks = rankByField('semesterAvgS1');
    const s2SemesterRanks = rankByField('semesterAvgS2');
    const annualRanks = rankByField('annualAvg');

    const finalResult: Record<number, {
      metrics: typeof rawMetrics[number];
      s1ExamTotalRank: number;
      s2ExamTotalRank: number;
      annualExamTotalRank: number;
      s1ExamAvgRank: number;
      s2ExamAvgRank: number;
      annualExamAvgRank: number;
      s1MonthlyMeanRank: number;
      s2MonthlyMeanRank: number;
      annualMonthlyMeanRank: number;
      s1SemesterRank: number;
      s2SemesterRank: number;
      annualRank: number;
    }> = {};

    students.forEach((s) => {
      const s1Item = computedClassScores.s1Map.get(s.id);
      const s2Item = computedClassScores.s2Map.get(s.id);
      const annualItem = computedClassScores.annualMap.get(s.id);

      finalResult[s.id] = {
        metrics: rawMetrics[s.id],
        s1ExamTotalRank: s1ExamTotalRanks[s.id] || 1,
        s2ExamTotalRank: s2ExamTotalRanks[s.id] || 1,
        annualExamTotalRank: annualExamTotalRanks[s.id] || 1,
        s1ExamAvgRank: s1ExamAvgRanks[s.id] || 1,
        s2ExamAvgRank: s2ExamAvgRanks[s.id] || 1,
        annualExamAvgRank: annualExamAvgRanks[s.id] || 1,
        s1MonthlyMeanRank: s1MonthlyMeanRanks[s.id] || 1,
        s2MonthlyMeanRank: s2MonthlyMeanRanks[s.id] || 1,
        annualMonthlyMeanRank: annualMonthlyMeanRanks[s.id] || 1,
        s1SemesterRank: s1SemesterRanks[s.id] || s1Item?.rank || 1,
        s2SemesterRank: s2SemesterRanks[s.id] || s2Item?.rank || 1,
        annualRank: (annualRanks[s.id] || annualItem?.rank || 1),
      };
    });

    return finalResult;
  }, [students, computedClassScores, traineeRecords, getSubjectPeriodScore, allStudentSubjectData, activeSubjectsList]);

  // Real-time Current Khmer Dates (Auto-computed from system clock)
  const defaultLunarDate = useMemo(() => {
    return getKhmerLunarDate(new Date()).fullChhankatei;
  }, []);

  const defaultSolarDate = useMemo(() => {
    const loc = teacher.school ? teacher.school.replace(/^(សាលាបឋមសិក្សា|បឋមសិក្សា|សាលា)\s*/i, '').trim() : '';
    return loc ? `ធ្វើនៅ${loc}, ${getKhmerSouriyateiDate(new Date())}` : getKhmerSouriyateiDate(new Date());
  }, [teacher.school]);

  // Current selected student object
  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0] || null;
  }, [students, selectedStudentId]);

  // Helper to construct complete trainee record with data fallback for any student
  const getStudentTraineeRecord = useCallback((st: Student): TraineeEvaluationRecord => {
    const saved = (traineeRecords[st.id] || {}) as any;
    const s1Summary = computedClassScores.s1Map.get(st.id);
    const s2Summary = computedClassScores.s2Map.get(st.id);
    const annualSummary = computedClassScores.annualMap.get(st.id);
    const abs = studentAbsences[st.id] || { s1Excused: 0, s1Unexcused: 0, s2Excused: 0, s2Unexcused: 0, annualExcused: 0, annualUnexcused: 0 };
    const summaryData = classSummaryRankings[st.id];
    const metrics = summaryData?.metrics;

    const examAvgS1Calc = Number((metrics?.examAvgS1 ?? s1Summary?.examAvg ?? 0).toFixed(2));
    const examAvgS2Calc = Number((metrics?.examAvgS2 ?? s2Summary?.examAvg ?? 0).toFixed(2));
    const monthlyAvgS1Calc = Number((metrics?.monthlyAvgS1 ?? s1Summary?.monthlyMean ?? 0).toFixed(2));
    const monthlyAvgS2Calc = Number((metrics?.monthlyAvgS2 ?? s2Summary?.monthlyMean ?? 0).toFixed(2));

    // Semester 1 Average: MoEYS formula standard: (Monthly Average + Semester Exam) / 2
    const semesterAvgS1Calc = (monthlyAvgS1Calc > 0 && examAvgS1Calc > 0)
      ? Number(((monthlyAvgS1Calc + examAvgS1Calc) / 2).toFixed(2))
      : (metrics?.semesterAvgS1 ?? s1Summary?.semesterAvg ?? (examAvgS1Calc > 0 ? examAvgS1Calc : monthlyAvgS1Calc));

    // Semester 2 Average: MoEYS formula standard: (Monthly Average + Semester Exam) / 2
    const semesterAvgS2Calc = (monthlyAvgS2Calc > 0 && examAvgS2Calc > 0)
      ? Number(((monthlyAvgS2Calc + examAvgS2Calc) / 2).toFixed(2))
      : (metrics?.semesterAvgS2 ?? s2Summary?.semesterAvg ?? (examAvgS2Calc > 0 ? examAvgS2Calc : monthlyAvgS2Calc));

    // Annual Average: MoEYS formula standard: (Semester 1 Average + Semester 2 Average) / 2
    const annualFromSemesters = (semesterAvgS1Calc > 0 && semesterAvgS2Calc > 0)
      ? Number(((semesterAvgS1Calc + semesterAvgS2Calc) / 2).toFixed(2))
      : (semesterAvgS2Calc > 0 ? semesterAvgS2Calc : semesterAvgS1Calc);

    const annualAvg = annualFromSemesters > 0
      ? annualFromSemesters
      : (metrics?.annualAvg ?? annualSummary?.annualAvg ?? 0);

    const isPass = annualAvg >= 5.0;
    const nextGrade = getNextGradeLabel(teacher.grade || 'ថ្នាក់ទី ៦');

    const defaultPromotion = isPass
      ? `សិស្សបានឡើងទៅរៀន${nextGrade} សម្រាប់ឆ្នាំសិក្សាបន្ទាប់។`
      : `សិស្សមិនទាន់គ្រប់លក្ខខណ្ឌឡើងថ្នាក់ទេ៖ បើធ្លាក់ត្រូវធ្វើតេស្តឡើងថ្នាក់ បើធ្លាក់ទៀតត្រូវរៀនត្រួតថ្នាក់។`;

    const defaultPraise = isPass
      ? 'សិស្សមានការខិតខំប្រឹងប្រែងរៀនសូត្រ ឧស្សាហ៍ព្យាយាម គោរពវិន័យបានល្អ និងមានទំនាក់ទំនងល្អជាមួយមិត្តរួមថ្នាក់។'
      : 'សិស្សមានអាកប្បកិរិយាស្លូតបូត ចូលរួមសកម្មភាពក្នុងថ្នាក់ និងគោរពវិន័យសាលាបានល្អ។';

    const defaultImprovement = isPass
      ? 'គួរបន្តរក្សាភាពឧស្សាហ៍ព្យាយាម និងពង្រឹងការអានសៀវភៅបន្ថែមនៅបណ្ណាល័យ ឬនៅផ្ទះ។'
      : 'ត្រូវខិតខំរៀនសូត្របន្ថែម បំពេញកិច្ចការផ្ទះឱ្យបានទៀងទាត់ និងពង្រឹងការអាន និងគណិតវិទ្យា។';

    const defaultPrincipal = 'បានឃើញ និងឯកភាពតាមការវាយតម្លៃ និងមូលវិចារណ៍របស់លោកគ្រូ/អ្នកគ្រូបន្ទុកថ្នាក់។ លើកទឹកចិត្តឱ្យសិស្សបន្តខិតខំប្រឹងប្រែងរៀនសូត្រ!';

    return {
      studentId: st.id,
      studentName: st.name,
      gender: st.gender,
      dob: st.dob,
      gradeLevel: teacher.grade || 'ថ្នាក់ទី ៦',
      academicYear: activeYear,

      // Summary
      examTotalS1: saved.examTotalS1 !== undefined ? saved.examTotalS1 : Number((metrics?.examTotalS1 || (s1Summary?.examAvg ? s1Summary.examAvg * activeSubjectsList.length : 0)).toFixed(2)),
      examAvgS1: examAvgS1Calc,
      monthlyAvgS1: monthlyAvgS1Calc,
      semesterAvgS1: semesterAvgS1Calc,

      examTotalS2: saved.examTotalS2 !== undefined ? saved.examTotalS2 : Number((metrics?.examTotalS2 || (s2Summary?.examAvg ? s2Summary.examAvg * activeSubjectsList.length : 0)).toFixed(2)),
      examAvgS2: examAvgS2Calc,
      monthlyAvgS2: monthlyAvgS2Calc,
      semesterAvgS2: semesterAvgS2Calc,

      annualAvgOverride: Number(annualAvg.toFixed(2)),
      annualRankOverride: summaryData?.annualRank ?? annualSummary?.rank ?? 1,

      // Absences
      absentExcusedS1: saved.absentExcusedS1 !== undefined ? saved.absentExcusedS1 : abs.s1Excused,
      absentUnexcusedS1: saved.absentUnexcusedS1 !== undefined ? saved.absentUnexcusedS1 : abs.s1Unexcused,
      absentExcusedS2: saved.absentExcusedS2 !== undefined ? saved.absentExcusedS2 : abs.s2Excused,
      absentUnexcusedS2: saved.absentUnexcusedS2 !== undefined ? saved.absentUnexcusedS2 : abs.s2Unexcused,
      absentExcusedAnnual: saved.absentExcusedAnnual !== undefined ? saved.absentExcusedAnnual : abs.annualExcused,
      absentUnexcusedAnnual: saved.absentUnexcusedAnnual !== undefined ? saved.absentUnexcusedAnnual : abs.annualUnexcused,

      // Evaluation in 4 domains
      evalStudyS1: saved.evalStudyS1 || 'រៀនយល់ដឹងមេរៀនបានល្អ',
      evalStudyS2: saved.evalStudyS2 || 'មានការរីកចម្រើនជាលំដាប់',
      evalStudyAnnual: saved.evalStudyAnnual || (isPass ? 'សម្រេចបានលទ្ធផលល្អប្រសើរ' : 'ត្រូវខិតខំពង្រឹងបន្ថែម'),

      evalMoralS1: saved.evalMoralS1 || 'ស្លូតបូត គោរពវិន័យ',
      evalMoralS2: saved.evalMoralS2 || 'មានទំនាក់ទំនងល្អ',
      evalMoralAnnual: saved.evalMoralAnnual || 'មានសីលធម៌ និងវិន័យថ្លៃថ្នូរ',

      evalLaborS1: saved.evalLaborS1 || 'ចូលរួមការងារថ្នាក់រៀន',
      evalLaborS2: saved.evalLaborS2 || 'សកម្មក្នុងការងារពលកម្ម',
      evalLaborAnnual: saved.evalLaborAnnual || 'ឧស្សាហ៍ព្យាយាម និងស្រឡាញ់ពលកម្ម',

      evalHealthS1: saved.evalHealthS1 || 'ស្អាតបាត មានអនាម័យ',
      evalHealthS2: saved.evalHealthS2 || 'សុខភាពល្អមាំមួន',
      evalHealthAnnual: saved.evalHealthAnnual || 'ប្រកាន់ខ្ជាប់អនាម័យ ៣ប្រការ',

      // Exam
      examCenter: saved.examCenter || teacher.school || 'សាលាបឋមសិក្សា',
      examProvince: saved.examProvince || 'រាជធានីភ្នំពេញ',
      examRoom: saved.examRoom || 'បន្ទប់ ០១',
      examDeskNo: saved.examDeskNo || String(st.rollNo).padStart(2, '0'),
      examResultStatus: saved.examResultStatus || (isPass ? 'ជាប់' : 'ធ្លាក់'),

      // Year-End Exam & Retest Results (លទ្ធផលនៃការប្រឡងបញ្ចប់ឆ្នាំសិក្សា)
      yearEndAcademicYear: saved.yearEndAcademicYear || activeYear,
      yearEndPromotionGrade: saved.yearEndPromotionGrade || nextGrade,
      yearEndRepeatGrade: saved.yearEndRepeatGrade || (teacher.grade || 'ថ្នាក់ទី ៦'),
      retestDate: saved.retestDate || '',
      retestSubjects: saved.retestSubjects && saved.retestSubjects.length > 0 ? saved.retestSubjects : ['ភាសាខ្មែរ', 'គណិតវិទ្យា'],
      retestAvgScore: saved.retestAvgScore || '',
      retestResult: saved.retestResult || '',

      // Remarks
      promotionDecision: saved.promotionDecision || defaultPromotion,
      praisePoints: saved.praisePoints || defaultPraise,
      improvementPoints: saved.improvementPoints || defaultImprovement,
      teacherSignDate: saved.teacherSignDate || '',
      teacherName: saved.teacherName || teacher.name || 'គ្រូបន្ទុកថ្នាក់',

      principalOpinion: saved.principalOpinion || defaultPrincipal,
      principalSignDate: saved.principalSignDate || '',
      principalName: saved.principalName || 'នាយកសាលា',

      // Real-time dynamic document dates
      docDateLunar: saved.docDateLunar || defaultLunarDate,
      docDateSolar: saved.docDateSolar || defaultSolarDate,

      subjectOverrides: saved.subjectOverrides || {},
    };
  }, [traineeRecords, computedClassScores, classSummaryRankings, studentAbsences, teacher, activeYear, defaultLunarDate, defaultSolarDate, activeSubjectsList]);

  // Current student trainee record
  const currentRecord = useMemo<TraineeEvaluationRecord>(() => {
    if (!currentStudent) {
      return {
        studentId: 0,
        studentName: '',
        gender: 'ប្រុស',
        gradeLevel: teacher.grade || 'ថ្នាក់ទី ៦',
        academicYear: activeYear,
      };
    }
    return getStudentTraineeRecord(currentStudent);
  }, [currentStudent, getStudentTraineeRecord, teacher.grade, activeYear]);

  // Update field of current record
  const updateCurrentField = <K extends keyof TraineeEvaluationRecord>(field: K, value: TraineeEvaluationRecord[K]) => {
    if (!currentStudent) return;
    const existing = traineeRecords[currentStudent.id] || {};
    const updated = {
      ...traineeRecords,
      [currentStudent.id]: {
        ...existing,
        [field]: value,
      },
    };
    saveRecords(updated);
  };

  // Quick preset application for all 4 evaluation domains
  const applyEvalPreset = (index: number) => {
    if (!currentStudent) return;
    const studyVal = EVAL_DOMAIN_OPTIONS.study[index] || EVAL_DOMAIN_OPTIONS.study[0];
    const moralVal = EVAL_DOMAIN_OPTIONS.moral[index] || EVAL_DOMAIN_OPTIONS.moral[0];
    const laborVal = EVAL_DOMAIN_OPTIONS.labor[index] || EVAL_DOMAIN_OPTIONS.labor[0];
    const healthVal = EVAL_DOMAIN_OPTIONS.health[index] || EVAL_DOMAIN_OPTIONS.health[0];

    const existing = traineeRecords[currentStudent.id] || {};
    const updated = {
      ...traineeRecords,
      [currentStudent.id]: {
        ...existing,
        evalStudyS1: studyVal,
        evalStudyS2: studyVal,
        evalStudyAnnual: studyVal,
        evalMoralS1: moralVal,
        evalMoralS2: moralVal,
        evalMoralAnnual: moralVal,
        evalLaborS1: laborVal,
        evalLaborS2: laborVal,
        evalLaborAnnual: laborVal,
        evalHealthS1: healthVal,
        evalHealthS2: healthVal,
        evalHealthAnnual: healthVal,
      },
    };
    saveRecords(updated);
    onShowToast('បានកំណត់ការវាយតម្លៃទាំង ៤ផ្នែកស្វ័យប្រវត្តិតាមប្រភេទសិស្សរួចរាល់!');
  };

  // Render evaluation input cell with 10 dropdown choices per student category
  const renderEvalCell = (
    fieldKey: keyof TraineeEvaluationRecord,
    value: string | undefined,
    options: string[],
    isAnnual = false
  ) => {
    const datalistId = `dl-${fieldKey}-${currentStudent?.id || 'curr'}`;
    return (
      <td className={`border border-slate-400 p-1.5 align-top ${isAnnual ? 'bg-amber-50/60' : 'bg-white'}`}>
        <div className="space-y-1">
          <input
            type="text"
            list={datalistId}
            value={value || ''}
            onChange={(e) => updateCurrentField(fieldKey, e.target.value)}
            placeholder="វាយបញ្ចូល ឬរើស..."
            className={`w-full text-center bg-transparent focus:outline-none focus:bg-purple-50 text-[11px] border-b border-slate-200 focus:border-purple-500 py-0.5 leading-relaxed ${
              isAnnual ? 'font-bold text-amber-950' : 'text-slate-800'
            }`}
          />
          <datalist id={datalistId}>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {idx + 1}. {opt}
              </option>
            ))}
          </datalist>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                updateCurrentField(fieldKey, e.target.value);
              }
            }}
            className="text-[10px] text-slate-700 bg-slate-50 hover:bg-slate-100 rounded border border-slate-300 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer w-full text-ellipsis overflow-hidden"
            title="ជ្រើសរើសជម្រើស (១០ ប្រភេទសិស្ស)"
          >
            <option value="" disabled>
              -- ជ្រើសរើស (១០ ប្រភេទសិស្ស) --
            </option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {idx + 1}. {opt}
              </option>
            ))}
          </select>
        </div>
      </td>
    );
  };

  // Update subject score
  const updateSubjectScore = (subjectId: string, period: 's1' | 's2' | 'annual', value: number) => {
    if (!currentStudent) return;
    const existing = (traineeRecords[currentStudent.id] || {}) as any;
    const currentOverrides = existing.subjectOverrides || (currentRecord as any).subjectOverrides || {};
    const subjectOverride = currentOverrides[subjectId] || {};

    const newSubOverride = {
      ...subjectOverride,
      [period]: Math.max(0, Math.min(10, value)),
    };

    if (period === 's1' || period === 's2') {
      const s1Val = period === 's1' ? newSubOverride.s1 : (newSubOverride.s1 ?? allStudentSubjectData[currentStudent.id]?.[subjectId]?.s1 ?? 8.5);
      const s2Val = period === 's2' ? newSubOverride.s2 : (newSubOverride.s2 ?? allStudentSubjectData[currentStudent.id]?.[subjectId]?.s2 ?? 8.5);
      newSubOverride.annual = Number(((s1Val! + s2Val!) / 2).toFixed(2));
    }

    const updated = {
      ...traineeRecords,
      [currentStudent.id]: {
        ...existing,
        subjectOverrides: {
          ...currentOverrides,
          [subjectId]: newSubOverride,
        },
      },
    };
    saveRecords(updated);
  };

  // Update teacher remarks for a subject
  const updateTeacherRemark = (subjectId: string, remark: string) => {
    if (!currentStudent) return;
    const existing = (traineeRecords[currentStudent.id] || {}) as any;
    const currentRemarks = existing.teacherRemarks || (currentRecord as any).teacherRemarks || {};
    const updated = {
      ...traineeRecords,
      [currentStudent.id]: {
        ...existing,
        teacherRemarks: {
          ...currentRemarks,
          [subjectId]: remark,
        },
      },
    };
    saveRecords(updated);
  };

  // Reset and synchronize scores directly with the Grade Summary tab
  const handleResetToGradebook = (studentId?: number) => {
    if (studentId) {
      const rec = traineeRecords[studentId] || currentRecord;
      const updated = {
        ...traineeRecords,
        [studentId]: {
          ...rec,
          subjectOverrides: {},
          examTotalS1: undefined,
          examTotalS2: undefined,
          examAvgS1: undefined,
          examAvgS2: undefined,
          monthlyAvgS1: undefined,
          monthlyAvgS2: undefined,
          semesterAvgS1: undefined,
          semesterAvgS2: undefined,
          annualAvgOverride: undefined,
          annualRankOverride: undefined,
        },
      };
      saveRecords(updated);
      onShowToast?.(`បានធ្វើសមកាលកម្មពិន្ទុពីកន្លែងស្រង់ពិន្ទុឡើងវិញដោយជោគជ័យ!`, 'success');
    } else {
      const updated: Record<number, TraineeEvaluationRecord> = {};
      Object.entries(traineeRecords).forEach(([stIdStr, rec]) => {
        const stId = Number(stIdStr);
        const item = rec as TraineeEvaluationRecord;
        if (item && typeof item === 'object') {
          updated[stId] = {
            ...item,
            subjectOverrides: {},
            examTotalS1: undefined,
            examTotalS2: undefined,
            examAvgS1: undefined,
            examAvgS2: undefined,
            monthlyAvgS1: undefined,
            monthlyAvgS2: undefined,
            semesterAvgS1: undefined,
            semesterAvgS2: undefined,
            annualAvgOverride: undefined,
            annualRankOverride: undefined,
          };
        }
      });
      saveRecords(updated);
      onShowToast?.(`បានធ្វើសមកាលកម្មពិន្ទុគ្រប់សិស្សពីកន្លែងស្រង់ពិន្ទុដោយជោគជ័យ!`, 'success');
    }
  };

  // Copy entire trainee score table cleanly as TSV to clipboard for Word/Excel/Sheets
  const handleCopyTable = () => {
    if (!currentStudent) return;
    const rows: string[] = [];
    rows.push(['មុខវិជ្ជា', 'ឆមាសទី ១ ពិន្ទុ', 'ឆមាសទី ១ ចំ.ថ្នាក់', 'ឆមាសទី ២ ពិន្ទុ', 'ឆមាសទី ២ ចំ.ថ្នាក់', 'ប្រចាំឆ្នាំ ម.ភាគ', 'ប្រចាំឆ្នាំ ចំ.ថ្នាក់', 'មូលវិចារហត្ថលេខា និងឈ្មោះគ្រូ'].join('\t'));

    activeSubjectsList.forEach((sub) => {
      const studentSubData = allStudentSubjectData[currentStudent.id]?.[sub.id] || { s1: 0, s2: 0, annual: 0, s1Rank: 1, s2Rank: 1, annualRank: 1 };
      const override = currentRecord.subjectOverrides?.[sub.id];
      const s1 = (override?.s1 !== undefined ? override.s1 : studentSubData.s1).toFixed(2);
      const s1R = override?.s1Rank !== undefined ? override.s1Rank : studentSubData.s1Rank;
      const s2 = (override?.s2 !== undefined ? override.s2 : studentSubData.s2).toFixed(2);
      const s2R = override?.s2Rank !== undefined ? override.s2Rank : studentSubData.s2Rank;
      const ann = (override?.annual !== undefined ? override.annual : studentSubData.annual).toFixed(2);
      const annR = override?.annualRank !== undefined ? override.annualRank : studentSubData.annualRank;
      const remark = currentRecord.teacherRemarks?.[sub.id] || '';
      rows.push([sub.name, s1, s1R, s2, s2R, ann, annR, remark].join('\t'));
    });

    const summaryData = classSummaryRankings[currentStudent.id];
    const s1Summary = computedClassScores.s1Map.get(currentStudent.id);
    const s2Summary = computedClassScores.s2Map.get(currentStudent.id);
    const annualSummary = computedClassScores.annualMap.get(currentStudent.id);
    const isPass = ((currentRecord.annualAvgOverride || annualSummary?.annualAvg || 0) >= 5.0);

    const s1Letter = s1Summary?.classification?.letter || ((currentRecord.semesterAvgS1 || 0) > 0 ? getGradeClassification(currentRecord.semesterAvgS1 || 0, effectiveGradeThresholds).letter : '-');
    const s2Letter = s2Summary?.classification?.letter || ((currentRecord.semesterAvgS2 || 0) > 0 ? getGradeClassification(currentRecord.semesterAvgS2 || 0, effectiveGradeThresholds).letter : '-');
    const annualLetter = (currentRecord.annualAvgOverride !== undefined && currentRecord.annualAvgOverride > 0)
      ? getGradeClassification(currentRecord.annualAvgOverride, effectiveGradeThresholds).letter
      : (annualSummary?.classification?.letter || ((currentRecord.annualAvgOverride || annualSummary?.annualAvg || 0) > 0 ? getGradeClassification(currentRecord.annualAvgOverride || annualSummary?.annualAvg || 0, effectiveGradeThresholds).letter : '-'));

    // Summary Rows
    rows.push(['សរុបពិន្ទុប្រឡងឆមាស', currentRecord.examTotalS1?.toFixed(2) || '0.00', summaryData?.s1ExamTotalRank || 1, currentRecord.examTotalS2?.toFixed(2) || '0.00', summaryData?.s2ExamTotalRank || 1, (((currentRecord.examTotalS1 || 0) + (currentRecord.examTotalS2 || 0)) / 2).toFixed(2), summaryData?.annualExamTotalRank || 1, ''].join('\t'));
    rows.push(['មធ្យមភាគពិន្ទុប្រឡងឆមាស', currentRecord.examAvgS1?.toFixed(2) || '0.00', summaryData?.s1ExamAvgRank || 1, currentRecord.examAvgS2?.toFixed(2) || '0.00', summaryData?.s2ExamAvgRank || 1, (((currentRecord.examAvgS1 || 0) + (currentRecord.examAvgS2 || 0)) / 2).toFixed(2), summaryData?.annualExamAvgRank || 1, ''].join('\t'));
    rows.push(['មធ្យមភាគពិន្ទុខែប្រចាំឆមាស', currentRecord.monthlyAvgS1?.toFixed(2) || '0.00', summaryData?.s1MonthlyMeanRank || 1, currentRecord.monthlyAvgS2?.toFixed(2) || '0.00', summaryData?.s2MonthlyMeanRank || 1, (((currentRecord.monthlyAvgS1 || 0) + (currentRecord.monthlyAvgS2 || 0)) / 2).toFixed(2), summaryData?.annualMonthlyMeanRank || 1, ''].join('\t'));
    rows.push(['មធ្យមភាគប្រចាំឆមាស & ប្រចាំឆ្នាំ', currentRecord.semesterAvgS1?.toFixed(2) || '0.00', summaryData?.s1SemesterRank || s1Summary?.rank || 1, currentRecord.semesterAvgS2?.toFixed(2) || '0.00', summaryData?.s2SemesterRank || s2Summary?.rank || 1, currentRecord.annualAvgOverride?.toFixed(2) || '0.00', currentRecord.annualRankOverride || summaryData?.annualRank || annualSummary?.rank || 1, isPass ? 'ជាប់' : 'ធ្លាក់'].join('\t'));
    rows.push(['និទ្ទេស', s1Letter, '', s2Letter, '', annualLetter, '', isPass ? 'ឡើងថ្នាក់' : 'ត្រួតថ្នាក់'].join('\t'));

    const fullTsv = rows.join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullTsv).then(() => {
        onShowToast?.('បានចម្លងតារាងពិន្ទុទាំងអស់ទៅក្ដារតម្បៀតខ្ទាស់ (Clipboard) ដោយជោគជ័យ! អ្នកអាចយកទៅ Paste ក្នុង Excel ឬ Word បានភ្លាមៗ។', 'success');
      }).catch(() => {
        // Fallback for iframe clipboard restrictions
        copyUsingTextarea(fullTsv);
      });
    } else {
      copyUsingTextarea(fullTsv);
    }
  };

  const copyUsingTextarea = (text: string) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onShowToast?.('បានចម្លងតារាងពិន្ទុទាំងអស់ទៅក្ដារតម្បៀតខ្ទាស់ (Clipboard) ដោយជោគជ័យ!', 'success');
    } catch {
      onShowToast?.('មិនអាចចម្លងបានទេ សូមសាកល្បងជ្រើសរើសតារាងដោយដៃ', 'error');
    }
  };

  // Filtered student list for quick selection
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase().trim();
    return students.filter((s) => s.name.toLowerCase().includes(q) || String(s.rollNo).includes(q));
  }, [students, searchQuery]);

  // Batch Auto-Generate / Full Sync with Gradebook for entire class
  const handleBatchAutoGenerate = () => {
    const newRecords: Record<number, TraineeEvaluationRecord> = { ...traineeRecords };
    students.forEach((st) => {
      const summaryData = classSummaryRankings[st.id];
      const metrics = summaryData?.metrics;
      const s1Summary = computedClassScores.s1Map.get(st.id);
      const s2Summary = computedClassScores.s2Map.get(st.id);
      const annualSummary = computedClassScores.annualMap.get(st.id);
      const abs = studentAbsences[st.id] || { s1Excused: 0, s1Unexcused: 0, s2Excused: 0, s2Unexcused: 0, annualExcused: 0, annualUnexcused: 0 };
      const monthlyAvgS1Val = Number((metrics?.monthlyAvgS1 ?? s1Summary?.monthlyMean ?? 0).toFixed(2));
      const monthlyAvgS2Val = Number((metrics?.monthlyAvgS2 ?? s2Summary?.monthlyMean ?? 0).toFixed(2));
      const examAvgS1Val = Number((metrics?.examAvgS1 ?? s1Summary?.examAvg ?? 0).toFixed(2));
      const examAvgS2Val = Number((metrics?.examAvgS2 ?? s2Summary?.examAvg ?? 0).toFixed(2));

      // Semester 1: (Monthly + Exam) / 2
      const semesterAvgS1Val = (monthlyAvgS1Val > 0 && examAvgS1Val > 0)
        ? Number(((monthlyAvgS1Val + examAvgS1Val) / 2).toFixed(2))
        : (metrics?.semesterAvgS1 ?? s1Summary?.semesterAvg ?? (examAvgS1Val > 0 ? examAvgS1Val : monthlyAvgS1Val));

      // Semester 2: (Monthly + Exam) / 2
      const semesterAvgS2Val = (monthlyAvgS2Val > 0 && examAvgS2Val > 0)
        ? Number(((monthlyAvgS2Val + examAvgS2Val) / 2).toFixed(2))
        : (metrics?.semesterAvgS2 ?? s2Summary?.semesterAvg ?? (examAvgS2Val > 0 ? examAvgS2Val : monthlyAvgS2Val));

      // Annual: (Semester 1 + Semester 2) / 2
      const annualFromSemesters = (semesterAvgS1Val > 0 && semesterAvgS2Val > 0)
        ? Number(((semesterAvgS1Val + semesterAvgS2Val) / 2).toFixed(2))
        : (semesterAvgS2Val > 0 ? semesterAvgS2Val : semesterAvgS1Val);

      const annualAvg = annualFromSemesters > 0 ? annualFromSemesters : (metrics?.annualAvg ?? annualSummary?.annualAvg ?? 0);
      const isPass = annualAvg >= 5.0;
      const nextGrade = getNextGradeLabel(teacher.grade || 'ថ្នាក់ទី ៦');

      newRecords[st.id] = {
        studentId: st.id,
        studentName: st.name,
        gender: st.gender,
        dob: st.dob,
        gradeLevel: teacher.grade || 'ថ្នាក់ទី ៦',
        academicYear: activeYear,

        examTotalS1: Number((metrics?.examTotalS1 ?? 0).toFixed(2)),
        examAvgS1: examAvgS1Val,
        monthlyAvgS1: Number((metrics?.monthlyAvgS1 ?? s1Summary?.monthlyMean ?? 0).toFixed(2)),
        semesterAvgS1: semesterAvgS1Val,

        examTotalS2: Number((metrics?.examTotalS2 ?? 0).toFixed(2)),
        examAvgS2: examAvgS2Val,
        monthlyAvgS2: Number((metrics?.monthlyAvgS2 ?? s2Summary?.monthlyMean ?? 0).toFixed(2)),
        semesterAvgS2: semesterAvgS2Val,

        annualAvgOverride: Number(annualAvg.toFixed(2)),
        annualRankOverride: summaryData?.annualRank ?? annualSummary?.rank ?? 1,

        absentExcusedS1: abs.s1Excused,
        absentUnexcusedS1: abs.s1Unexcused,
        absentExcusedS2: abs.s2Excused,
        absentUnexcusedS2: abs.s2Unexcused,
        absentExcusedAnnual: abs.annualExcused,
        absentUnexcusedAnnual: abs.annualUnexcused,

        evalStudyS1: 'រៀនយល់ដឹងមេរៀនបានល្អ',
        evalStudyS2: 'មានការរីកចម្រើនជាលំដាប់',
        evalStudyAnnual: isPass ? 'សម្រេចបានលទ្ធផលល្អប្រសើរ' : 'ត្រូវខិតខំពង្រឹងបន្ថែម',

        evalMoralS1: 'ស្លូតបូត គោរពវិន័យ',
        evalMoralS2: 'មានទំនាក់ទំនងល្អ',
        evalMoralAnnual: 'មានសីលធម៌ និងវិន័យថ្លៃថ្នូរ',

        evalLaborS1: 'ចូលរួមការងារថ្នាក់រៀន',
        evalLaborS2: 'សកម្មក្នុងការងារពលកម្ម',
        evalLaborAnnual: 'ឧស្សាហ៍ព្យាយាម និងស្រឡាញ់ពលកម្ម',

        evalHealthS1: 'ស្អាតបាត មានអនាម័យ',
        evalHealthS2: 'សុខភាពល្អមាំមួន',
        evalHealthAnnual: 'ប្រកាន់ខ្ជាប់អនាម័យ ៣ប្រការ',

        examCenter: teacher.school || 'សាលាបឋមសិក្សា',
        examProvince: 'រាជធានីភ្នំពេញ',
        examRoom: 'បន្ទប់ ០១',
        examDeskNo: String(st.rollNo).padStart(2, '0'),
        examResultStatus: isPass ? 'ជាប់' : 'ធ្លាក់',

        yearEndAcademicYear: activeYear,
        yearEndPromotionGrade: nextGrade,
        yearEndRepeatGrade: teacher.grade || 'ថ្នាក់ទី ៦',
        retestDate: '',
        retestSubjects: ['ភាសាខ្មែរ', 'គណិតវិទ្យា'],
        retestAvgScore: '',
        retestResult: '',

        promotionDecision: isPass
          ? `សិស្សបានឡើងទៅរៀន${nextGrade} សម្រាប់ឆ្នាំសិក្សាបន្ទាប់។`
          : `សិស្សមិនទាន់គ្រប់លក្ខខណ្ឌឡើងថ្នាក់ទេ៖ បើធ្លាក់ត្រូវធ្វើតេស្តឡើងថ្នាក់ បើធ្លាក់ទៀតត្រូវរៀនត្រួតថ្នាក់។`,
        praisePoints: isPass
          ? 'សិស្សមានការខិតខំប្រឹងប្រែងរៀនសូត្រ ឧស្សាហ៍ព្យាយាម គោរពវិន័យបានល្អ និងមានទំនាក់ទំនងល្អជាមួយមិត្តរួមថ្នាក់។'
          : 'សិស្សមានអាកប្បកិរិយាស្លូតបូត ចូលរួមសកម្មភាពក្នុងថ្នាក់ និងគោរពវិន័យសាលាបានល្អ។',
        improvementPoints: isPass
          ? 'គួរបន្តរក្សាភាពឧស្សាហ៍ព្យាយាម និងពង្រឹងការអានសៀវភៅបន្ថែមនៅបណ្ណាល័យ ឬនៅផ្ទះ។'
          : 'ត្រូវខិតខំរៀនសូត្របន្ថែម បំពេញកិច្ចការផ្ទះឱ្យបានទៀងទាត់ និងពង្រឹងការអាន និងគណិតវិទ្យា។',
        teacherSignDate: '',
        teacherName: teacher.name || 'គ្រូបន្ទុកថ្នាក់',

        principalOpinion: 'បានឃើញ និងឯកភាពតាមការវាយតម្លៃ និងមូលវិចារណ៍របស់លោកគ្រូ/អ្នកគ្រូបន្ទុកថ្នាក់។ លើកទឹកចិត្តឱ្យសិស្សបន្តខិតខំប្រឹងប្រែងរៀនសូត្រ!',
        principalSignDate: '',
        principalName: 'នាយកសាលា',
      };
    });

    saveRecords(newRecords);
    onShowToast(`បានធ្វើសមកាលកម្ម និងបង្កើតទិន្នន័យសៀវភៅសិក្ខាគារិកជូនសិស្សទាំង ${students.length} នាក់ជោគជ័យ!`);
  };

  // Export CSV of Trainee Evaluation Records
  const handleExportCSV = () => {
    const headers = [
      'ល.រ',
      'ឈ្មោះសិស្ស',
      'ភេទ',
      'ថ្នាក់',
      'ម.ភាគឆមាស១',
      'ម.ភាគឆមាស២',
      'ម.ភាគប្រចាំឆ្នាំ',
      'ចំណាត់ថ្នាក់',
      'អវត្តមានច្បាប់',
      'អវត្តមានឥតច្បាប់',
      'លទ្ធផលឡើងថ្នាក់/ធ្លាក់',
      'ចំណុចសរសើរ',
      'ការកែលម្អ',
      'យោបល់នាយក',
    ];

    const rows = students.map((st, idx) => {
      const rec = getStudentTraineeRecord(st);
      const annualSummary = computedClassScores.annualMap.get(st.id);
      const s1Summary = computedClassScores.s1Map.get(st.id);
      const s2Summary = computedClassScores.s2Map.get(st.id);
      const abs = studentAbsences[st.id] || { annualExcused: 0, annualUnexcused: 0 };

      return [
        idx + 1,
        `"${st.name}"`,
        `"${st.gender}"`,
        `"${teacher.grade || 'ថ្នាក់ទី ៦'}"`,
        rec.semesterAvgS1 ? rec.semesterAvgS1.toFixed(2) : (s1Summary?.semesterAverage?.toFixed(2) || '0.00'),
        rec.semesterAvgS2 ? rec.semesterAvgS2.toFixed(2) : (s2Summary?.semesterAverage?.toFixed(2) || '0.00'),
        rec.annualAvgOverride ? rec.annualAvgOverride.toFixed(2) : (annualSummary?.annualAverage?.toFixed(2) || '0.00'),
        rec.annualRankOverride || annualSummary?.rank || idx + 1,
        rec.absentExcusedAnnual ?? abs.annualExcused,
        rec.absentUnexcusedAnnual ?? abs.annualUnexcused,
        `"${rec.promotionDecision || ''}"`,
        `"${rec.praisePoints || ''}"`,
        `"${rec.improvementPoints || ''}"`,
        `"${rec.principalOpinion || ''}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `សៀវភៅសិក្ខាគារិក_${teacher.grade || 'ថ្នាក់'}_${activeYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('បានទាញយកទិន្នន័យសៀវភៅសិក្ខាគារិកជា Excel CSV ដោយជោគជ័យ!');
  };

  // Direct Print Helper using hidden iframe and font loading listener
  const triggerPrintContent = useCallback((htmlContent: string, docTitle: string) => {
    let iframe = document.getElementById('hidden-trainee-print-frame') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'hidden-trainee-print-frame';
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
        <title>${docTitle}</title>
        <meta charset="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Moul&family=Siemreap&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 portrait;
            margin: 5mm 7mm 5mm 7mm;
          }
          @media print {
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #fff !important;
              color: #0f172a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: 'Kantumruy Pro', 'Siemreap', sans-serif;
            color: #0f172a;
            background-color: #fff;
            margin: 0;
            padding: 0;
            font-size: 7.4pt;
            line-height: 1.18;
          }
          .moul {
            font-family: 'Moul', cursive;
          }
          .page-sheet {
            width: 100%;
            max-width: 196mm;
            margin: 0 auto;
            padding: 0;
            background: #fff;
            box-sizing: border-box;
            page-break-after: always;
            break-after: page;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .page-sheet.last-sheet {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .national-header {
            text-align: center;
            margin-bottom: 2px;
          }
          .national-title {
            font-size: 9.5pt;
            line-height: 1.15;
          }
          .national-motto {
            font-size: 8pt;
            margin-top: 1px;
            line-height: 1.15;
          }
          .national-ornament {
            font-size: 7pt;
            letter-spacing: 1.5px;
          }
          .school-info-bar {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-size: 7.5pt;
            margin-bottom: 2px;
            line-height: 1.15;
          }
          .student-banner {
            text-align: center;
            font-size: 8pt;
            font-weight: bold;
            border-bottom: 1.2px solid #0f172a;
            padding-bottom: 2px;
            margin-bottom: 3px;
            line-height: 1.15;
          }
          .book-title {
            font-size: 9pt;
            margin-top: 1px;
          }
          table.trainee-table {
            width: 100%;
            border-collapse: collapse;
            border: 1.2px solid #0f172a;
            font-size: 7pt;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          table.trainee-table th {
            border: 1px solid #0f172a;
            padding: 1.2px 1px;
            text-align: center;
            background-color: #f1f5f9;
            font-weight: bold;
            font-size: 7pt;
            line-height: 1.12;
          }
          table.trainee-table td {
            border: 1px solid #0f172a;
            padding: 0.8px 2px;
            line-height: 1.12;
          }
          table.trainee-table .summary-row {
            background-color: #f8fafc;
            font-weight: bold;
          }
          table.trainee-table .highlight-row {
            background-color: #f1f5f9;
            font-weight: bold;
          }
          .eval-table {
            width: 100%;
            border-collapse: collapse;
            border: 1.2px solid #0f172a;
            font-size: 7.4pt;
            margin-top: 2px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .eval-table th {
            border: 1px solid #0f172a;
            padding: 1.8px 2px;
            text-align: center;
            background-color: #f1f5f9;
            font-weight: bold;
            font-size: 7.2pt;
          }
          .eval-table td {
            border: 1px solid #0f172a;
            padding: 1.8px 4px;
            line-height: 1.15;
          }
          .exam-box {
            border: 1px solid #0f172a;
            background: #f8fafc;
            padding: 3px 6px;
            margin: 3px 0;
            font-size: 7.4pt;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .sign-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 10px;
            margin-top: 4px;
            font-size: 7.4pt;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .sign-box-half {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .sign-box-half.principal-box {
            margin-top: 12px;
          }
          .remark-container {
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            padding: 3px 5px;
            min-height: 38px;
            margin-top: 2px;
            font-size: 7.2pt;
            line-height: 1.2;
          }
          .sign-space {
            height: 24px;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
    doc.close();

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
  }, []);

  // Function to build HTML for single or multiple students
  const buildStudentBookHtml = useCallback((st: Student, pageOpt: 'both' | 'page1' | 'page2', isLastStudent: boolean) => {
    const rec = getStudentTraineeRecord(st);
    const s1Summary = computedClassScores.s1Map.get(st.id);
    const s2Summary = computedClassScores.s2Map.get(st.id);
    const annualSummary = computedClassScores.annualMap.get(st.id);
    const summaryData = classSummaryRankings[st.id];
    const sem1Val = rec.semesterAvgS1 || 0;
    const sem2Val = rec.semesterAvgS2 || 0;
    const computedAnnualFromSemesters = (sem1Val > 0 && sem2Val > 0)
      ? Number(((sem1Val + sem2Val) / 2).toFixed(2))
      : (sem2Val > 0 ? sem2Val : sem1Val);

    const annualAvgVal = (rec.annualAvgOverride !== undefined && rec.annualAvgOverride > 0)
      ? rec.annualAvgOverride
      : (computedAnnualFromSemesters > 0 ? computedAnnualFromSemesters : (summaryData?.metrics?.annualAvg ?? annualSummary?.annualAvg ?? 0));

    const isPass = annualAvgVal >= 5.0;

    const s1Letter = s1Summary?.classification?.letter || (sem1Val > 0 ? getGradeClassification(sem1Val, effectiveGradeThresholds).letter : '-');
    const s2Letter = s2Summary?.classification?.letter || (sem2Val > 0 ? getGradeClassification(sem2Val, effectiveGradeThresholds).letter : '-');
    const annualLetter = annualAvgVal > 0 ? getGradeClassification(annualAvgVal, effectiveGradeThresholds).letter : '-';

    const annualRankVal = rec.annualRankOverride || summaryData?.annualRank || annualSummary?.rank || 1;
    const currentGrade = rec.gradeLevel || teacher.grade || 'ថ្នាក់ទី ៦';
    const nextGrade = getNextGradeLabel(currentGrade);
    const promotionGrade = rec.yearEndPromotionGrade || nextGrade;
    const repeatGrade = rec.yearEndRepeatGrade || currentGrade;
    const retestDate = rec.retestDate || '';
    const retestSubjects = rec.retestSubjects && rec.retestSubjects.length > 0 ? rec.retestSubjects : ['ភាសាខ្មែរ', 'គណិតវិទ្យា'];
    const retestAvg = rec.retestAvgScore || '';
    const retestResult = rec.retestResult || '';

    let page1Html = '';
    let page2Html = '';

    if (pageOpt === 'both' || pageOpt === 'page1') {
      const isSheetLast = isLastStudent && pageOpt === 'page1';
      const subjectRows = activeSubjectsList.map((sub) => {
        const studentSubData = allStudentSubjectData[st.id]?.[sub.id] || { s1: 0, s2: 0, annual: 0, s1Rank: 1, s2Rank: 1, annualRank: 1 };
        const override = rec.subjectOverrides?.[sub.id];
        const s1Score = override?.s1 !== undefined ? override.s1 : studentSubData.s1;
        const s2Score = override?.s2 !== undefined ? override.s2 : studentSubData.s2;
        const annualScore = override?.annual !== undefined ? override.annual : studentSubData.annual;
        const s1Rank = override?.s1Rank !== undefined ? override.s1Rank : studentSubData.s1Rank;
        const s2Rank = override?.s2Rank !== undefined ? override.s2Rank : studentSubData.s2Rank;
        const annualRank = override?.annualRank !== undefined ? override.annualRank : studentSubData.annualRank;

        return `
          <tr>
            <td style="border: 1px solid #0f172a; padding: 2px 4px; font-weight: 500;">${sub.name}</td>
            <td style="border: 1px solid #0f172a; padding: 2px 2px; text-align: center; font-family: monospace;">${s1Score.toFixed(2)}</td>
            <td style="border: 1px solid #0f172a; padding: 2px 2px; text-align: center; font-family: monospace;">${s1Rank}</td>
            <td style="border: 1px solid #0f172a; padding: 2px 2px; text-align: center; font-family: monospace;">${s2Score.toFixed(2)}</td>
            <td style="border: 1px solid #0f172a; padding: 2px 2px; text-align: center; font-family: monospace;">${s2Rank}</td>
            <td style="border: 1px solid #0f172a; padding: 2px 2px; text-align: center; font-family: monospace; font-weight: bold;">${annualScore.toFixed(2)}</td>
            <td style="border: 1px solid #0f172a; padding: 2px 2px; text-align: center; font-family: monospace; font-weight: bold;">${annualRank}</td>
            <td style="border: 1px solid #0f172a; padding: 2px 4px;"></td>
          </tr>
        `;
      }).join('');

      page1Html = `
        <div class="page-sheet ${isSheetLast ? 'last-sheet' : ''}">
          <!-- Top Emblem & National Header -->
          <div class="national-header">
            <div class="moul national-title">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div class="moul national-motto">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div class="national-ornament">— ༺ ៚ ༻ —</div>
          </div>

          <!-- School Info Header -->
          <div class="school-info-bar">
            <div>
              <div style="font-weight: bold;">${teacher.district || 'ការិយាល័យអប់រំ យុវជន និងកីឡា'}</div>
              <div style="font-weight: bold;">${teacher.school || 'សាលាបឋមសិក្សា'}</div>
            </div>
            <div style="text-align: right; color: #475569;">
              <div>ថ្នាក់ទី៖ <strong>${teacher.grade || 'ថ្នាក់ទី ៦'}</strong></div>
              <div>ឆ្នាំសិក្សា៖ <strong>${activeYear}</strong></div>
            </div>
          </div>

          <!-- Student Banner -->
          <div class="student-banner">
            <div>
              គោត្តនាម និងនាមសិស្ស <span class="moul" style="font-size: 9.5pt; padding: 0 4px;">${st.name}</span>
              ភេទ <span>${st.gender}</span>
              ថ្នាក់ទី <span>${teacher.grade || 'ថ្នាក់ទី៦'}</span>
              ឆ្នាំសិក្សា <span>${activeYear}</span>
            </div>
            <div class="moul book-title">លទ្ធផលនៃការសិក្សា</div>
          </div>

          <!-- 15 Subject Scores Table -->
          <table class="trainee-table">
            <thead>
              <tr>
                <th rowspan="2" style="width: 25%; text-align: left; padding-left: 4px;">មុខវិជ្ជា</th>
                <th colspan="2">ឆមាសទី ១</th>
                <th colspan="2">ឆមាសទី ២</th>
                <th colspan="2">ប្រចាំឆ្នាំ</th>
                <th rowspan="2" style="width: 22%;">មូលវិចារហត្ថលេខា និងឈ្មោះគ្រូ</th>
              </tr>
              <tr style="font-size: 6.8pt;">
                <th style="width: 9%;">ពិន្ទុ</th>
                <th style="width: 8%;">ចំ.ថ្នាក់</th>
                <th style="width: 9%;">ពិន្ទុ</th>
                <th style="width: 8%;">ចំ.ថ្នាក់</th>
                <th style="width: 9%;">ម.ភាគ</th>
                <th style="width: 8%;">ចំ.ថ្នាក់</th>
              </tr>
            </thead>
            <tbody>
              ${subjectRows}
              <tr class="summary-row">
                <td style="font-weight: bold; padding-left: 4px;">សរុបពិន្ទុប្រឡងឆមាស</td>
                <td style="text-align: center; font-family: monospace;">${(rec.examTotalS1 || 0).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace;">${summaryData?.s1ExamTotalRank || 1}</td>
                <td style="text-align: center; font-family: monospace;">${(rec.examTotalS2 || 0).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace;">${summaryData?.s2ExamTotalRank || 1}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold;">${(((rec.examTotalS1 || 0) + (rec.examTotalS2 || 0)) / 2).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold;">${summaryData?.annualExamTotalRank || 1}</td>
                <td></td>
              </tr>
              <tr class="summary-row">
                <td style="font-weight: bold; padding-left: 4px;">មធ្យមភាគពិន្ទុប្រឡងឆមាស</td>
                <td style="text-align: center; font-family: monospace;">${(rec.examAvgS1 || 0).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace;">${summaryData?.s1ExamAvgRank || 1}</td>
                <td style="text-align: center; font-family: monospace;">${(rec.examAvgS2 || 0).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace;">${summaryData?.s2ExamAvgRank || 1}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold;">${(((rec.examAvgS1 || 0) + (rec.examAvgS2 || 0)) / 2).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold;">${summaryData?.annualExamAvgRank || 1}</td>
                <td></td>
              </tr>
              <tr class="summary-row">
                <td style="font-weight: bold; padding-left: 4px;">មធ្យមភាគពិន្ទុខែប្រចាំឆមាស</td>
                <td style="text-align: center; font-family: monospace;">${(rec.monthlyAvgS1 || 0).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace;">${summaryData?.s1MonthlyMeanRank || 1}</td>
                <td style="text-align: center; font-family: monospace;">${(rec.monthlyAvgS2 || 0).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace;">${summaryData?.s2MonthlyMeanRank || 1}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold;">${(((rec.monthlyAvgS1 || 0) + (rec.monthlyAvgS2 || 0)) / 2).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold;">${summaryData?.annualMonthlyMeanRank || 1}</td>
                <td></td>
              </tr>
              <tr class="highlight-row">
                <td style="font-weight: bold; padding-left: 4px;">មធ្យមភាគប្រចាំឆមាស & ប្រចាំឆ្នាំ</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold;">${(rec.semesterAvgS1 || 0).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace;">${summaryData?.s1SemesterRank || s1Summary?.rank || 1}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold;">${(rec.semesterAvgS2 || 0).toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace;">${summaryData?.s2SemesterRank || s2Summary?.rank || 1}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold; color: #991b1b; font-size: 8.5pt;">${annualAvgVal.toFixed(2)}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold; color: #991b1b;">${annualRankVal}</td>
                <td style="text-align: center; font-weight: bold; font-size: 7.2pt; color: ${isPass ? '#15803d' : '#b91c1c'};">${isPass ? 'ជាប់' : 'ធ្លាក់'}</td>
              </tr>
              <tr class="summary-row" style="background-color: #f8fafc;">
                <td style="font-weight: bold; padding-left: 4px;">និទ្ទេស</td>
                <td colspan="2" style="text-align: center; font-weight: bold; color: #1e1b4b; font-size: 8.5pt;">${s1Letter}</td>
                <td colspan="2" style="text-align: center; font-weight: bold; color: #1e1b4b; font-size: 8.5pt;">${s2Letter}</td>
                <td colspan="2" style="text-align: center; font-weight: bold; color: #991b1b; font-size: 8.5pt;">${annualLetter}</td>
                <td style="text-align: center; font-weight: bold; font-size: 7.2pt; color: ${isPass ? '#15803d' : '#b91c1c'};">${isPass ? 'ឡើងថ្នាក់' : 'ត្រួតថ្នាក់'}</td>
              </tr>
            </tbody>
          </table>

          <!-- Absence Table -->
          <div style="margin-top: 3px;">
            <div class="moul" style="text-align: center; font-size: 7.8pt; margin-bottom: 1.5px;">ចំនួនអវត្តមានក្នុងឆ្នាំសិក្សា</div>
            <table class="trainee-table">
              <thead>
                <tr>
                  <th style="text-align: left; padding-left: 4px; width: 40%;">អវត្តមាន</th>
                  <th style="width: 20%;">ឆមាសទី ១</th>
                  <th style="width: 20%;">ឆមាសទី ២</th>
                  <th style="width: 20%;">ប្រចាំឆ្នាំ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding-left: 4px;">- មានច្បាប់</td>
                  <td style="text-align: center; font-family: monospace;">${rec.absentExcusedS1 ?? 0}</td>
                  <td style="text-align: center; font-family: monospace;">${rec.absentExcusedS2 ?? 0}</td>
                  <td style="text-align: center; font-family: monospace; font-weight: bold;">${rec.absentExcusedAnnual ?? 0}</td>
                </tr>
                <tr>
                  <td style="padding-left: 4px;">- ឥតច្បាប់</td>
                  <td style="text-align: center; font-family: monospace;">${rec.absentUnexcusedS1 ?? 0}</td>
                  <td style="text-align: center; font-family: monospace;">${rec.absentUnexcusedS2 ?? 0}</td>
                  <td style="text-align: center; font-family: monospace; font-weight: bold;">${rec.absentUnexcusedAnnual ?? 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (pageOpt === 'both' || pageOpt === 'page2') {
      const isSheetLast = isLastStudent;
      page2Html = `
        <div class="page-sheet ${isSheetLast ? 'last-sheet' : ''}">
          <!-- Top Header -->
          <div style="text-align: center; font-size: 8pt; font-weight: bold; border-bottom: 1.2px solid #0f172a; padding-bottom: 2px; margin-bottom: 4px;">
            គ្រឹះស្ថានសិក្សា <span class="moul" style="font-size: 8.8pt;">${teacher.school || 'សាលាបឋមសិក្សា'}</span> ចំនួនសិស្សក្នុងថ្នាក់ <strong>${students.length} នាក់</strong>
          </div>

          <!-- 1. ការវាយតម្លៃ -->
          <div style="margin-bottom: 4px;">
            <div class="moul" style="text-align: center; font-size: 8.5pt; margin-bottom: 2px;">ការវាយតម្លៃ</div>
            <table class="eval-table">
              <thead>
                <tr>
                  <th style="text-align: left; padding-left: 4px; width: 34%;">ផ្នែកទាំង ៤</th>
                  <th style="width: 22%;">ឆមាសទី ១</th>
                  <th style="width: 22%;">ឆមាសទី ២</th>
                  <th style="width: 22%;">ប្រចាំឆ្នាំ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight: bold; padding-left: 4px;">១. ការសិក្សា</td>
                  <td style="text-align: center;">${rec.evalStudyS1 || 'ល្អ'}</td>
                  <td style="text-align: center;">${rec.evalStudyS2 || 'ល្អ'}</td>
                  <td style="text-align: center; font-weight: bold;">${rec.evalStudyAnnual || 'ល្អប្រសើរ'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; padding-left: 4px;">២. សីលធម៌រស់នៅ</td>
                  <td style="text-align: center;">${rec.evalMoralS1 || 'ស្លូតបូត'}</td>
                  <td style="text-align: center;">${rec.evalMoralS2 || 'ស្លូតបូត'}</td>
                  <td style="text-align: center; font-weight: bold;">${rec.evalMoralAnnual || 'សុភាពរាបសារ'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; padding-left: 4px;">៣. ពលកម្ម-បង្កបង្កើតផល</td>
                  <td style="text-align: center;">${rec.evalLaborS1 || 'សកម្ម'}</td>
                  <td style="text-align: center;">${rec.evalLaborS2 || 'សកម្ម'}</td>
                  <td style="text-align: center; font-weight: bold;">${rec.evalLaborAnnual || 'ស្រឡាញ់ពលកម្ម'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; padding-left: 4px;">៤. សុខភាព-អនាម័យ</td>
                  <td style="text-align: center;">${rec.evalHealthS1 || 'មាំមួន'}</td>
                  <td style="text-align: center;">${rec.evalHealthS2 || 'មាំមួន'}</td>
                  <td style="text-align: center; font-weight: bold;">${rec.evalHealthAnnual || 'ប្រកាន់ខ្ជាប់អនាម័យ ៣ប្រការ'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 2. លទ្ធផលនៃការប្រឡងបញ្ចប់ឆ្នាំសិក្សា -->
          <div class="exam-box" style="border: 1px solid #0f172a; background: #fff; padding: 3px 6px; margin: 3px 0; font-size: 7.4pt; line-height: 1.25;">
            <div class="moul" style="text-align: center; font-size: 8.2pt; margin-bottom: 2px; color: #0f172a;">
              លទ្ធផលនៃការប្រឡងបញ្ចប់ឆ្នាំសិក្សា ${rec.academicYear || activeYear}
            </div>
            ${isPass ? `
              <!-- ករណីសិស្សជាប់: បង្ហាញតែលទ្ធផល និងការឡើងថ្នាក់ -->
              <div style="display: flex; justify-content: space-around; align-items: center; padding: 4px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                <div>- <strong>មធ្យមភាគប្រចាំឆ្នាំ៖</strong> <span style="font-weight: bold; color: #0f172a;">${annualAvgVal > 0 ? annualAvgVal.toFixed(2) : '.........'}</span></div>
                <div>- <strong>ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ៖</strong> <span style="font-weight: bold; color: #0f172a;">${annualAvgVal > 0 ? `លេខ ${annualRankVal}` : '.........'}</span></div>
                <div>- <strong>និទ្ទេស៖</strong> <span style="font-weight: bold; color: #0f172a;">${annualLetter}</span></div>
                <div style="color: #15803d; font-weight: bold;">
                  - <strong>ត្រូវបានឡើង${promotionGrade} (ជាប់ ✓)</strong>
                </div>
              </div>
            ` : `
              <!-- ករណីសិស្សធ្លាក់: បង្ហាញព័ត៌មានលម្អិត និងការត្រូវធ្វើតេស្តឡើងថ្នាក់ -->
              <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 3px 10px;">
                <!-- ផ្នែកខាងឆ្វេង: មធ្យមភាគ ចំណាត់ថ្នាក់ និទ្ទេស -->
                <div style="border-right: 1px dashed #94a3b8; padding-right: 6px;">
                  <div style="margin-bottom: 1px;">- <strong>មធ្យមភាគប្រចាំឆ្នាំ៖</strong> <span style="font-weight: bold; color: #0f172a;">${annualAvgVal > 0 ? annualAvgVal.toFixed(2) : '.........'}</span></div>
                  <div style="margin-bottom: 1px;">- <strong>ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ៖</strong> <span style="font-weight: bold; color: #0f172a;">${annualAvgVal > 0 ? `លេខ ${annualRankVal}` : '.........'}</span></div>
                  <div style="margin-bottom: 1px;">- <strong>និទ្ទេស៖</strong> <span style="font-weight: bold; color: #0f172a;">${annualLetter}</span></div>
                  <div style="margin-top: 2px; padding-top: 1px; border-top: 1px dotted #cbd5e1;">
                    <div style="color: #b91c1c; font-weight: bold;">
                      - <strong>មិនទាន់បានឡើងថ្នាក់ (ធ្លាក់)</strong>
                    </div>
                  </div>
                </div>

                <!-- ផ្នែកខាងស្តាំ: ត្រូវធ្វើតេស្តឡើងថ្នាក់ និងមុខវិជ្ជាធ្វើតេស្តឡើងថ្នាក់ -->
                <div>
                  <div style="font-weight: bold; margin-bottom: 1px; color: #b91c1c;">
                    - <strong>ត្រូវធ្វើតេស្តឡើងថ្នាក់</strong>
                  </div>
                  <div style="font-weight: bold; margin-bottom: 1px; color: #0f172a;">
                    - <strong>មុខវិជ្ជាធ្វើតេស្តឡើងថ្នាក់៖</strong>
                  </div>
                  <div style="padding-left: 6px; display: flex; flex-direction: column; gap: 1px;">
                    <div>• <strong>កាលបរិច្ឆេទ៖</strong> <span>${retestDate || '................................'}</span></div>
                    <div>• <strong>មុខវិជ្ជាតេស្ត៖</strong> <span>${retestSubjects.join(', ')}</span></div>
                    <div>• <strong>មធ្យមភាគទទួលបាន៖</strong> <span>${retestAvg || '................'}</span></div>
                    <div style="font-size: 7.2pt; line-height: 1.2;">• <strong>លទ្ធផល៖</strong> ${
                      retestResult === 'ជាប់'
                        ? `<span style="color: #15803d; font-weight: bold;">ជាប់ (ត្រូវបានឡើង${promotionGrade})</span>`
                        : retestResult === 'ធ្លាក់'
                          ? `<span style="color: #b91c1c; font-weight: bold;">ធ្លាក់ (ត្រូវរៀនត្រួត${repeatGrade})</span>`
                          : `ជាប់ (ត្រូវបានឡើង${promotionGrade}) ឬ ធ្លាក់ (ត្រូវរៀនត្រួត${repeatGrade})`
                    }</div>
                  </div>
                </div>
              </div>
            `}
          </div>

          <!-- 3. មូលវិចារណ៍ និងហត្ថលេខា (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) -->
          <div class="sign-section" style="flex-direction: column; gap: 8px;">
            <!-- Teacher Side (លើ) -->
            <div class="sign-box-half" style="width: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1; margin-right: 12px;">
                  <div class="moul" style="font-size: 8.2pt; margin-bottom: 2px;">មូលវិចារណ៍ គ្រូបន្ទុកថ្នាក់</div>
                  <div class="remark-container" style="display: flex; flex-direction: column; gap: 2px;">
                    <div><strong>ចំណុចសរសើរ៖</strong> ${rec.praisePoints || 'យកចិត្តទុកដាក់ខ្ពស់ រួសរាយរាក់ទាក់ និងគោរពវិន័យបានល្អ'}</div>
                    <div><strong>ការកែលម្អ៖</strong> ${rec.improvementPoints || 'ត្រូវបង្កើនការអានសៀវភៅ និងហាត់រៀនបន្ថែមនៅផ្ទះ'}</div>
                  </div>
                </div>
                <div style="text-align: center; width: 170px;">
                  <div style="font-weight: 500;">${rec.docDateLunar || defaultLunarDate}</div>
                  <div style="font-weight: 500;">${rec.docDateSolar || defaultSolarDate}</div>
                  <div class="moul" style="font-size: 8pt; margin-top: 2px;">គ្រូបន្ទុកថ្នាក់</div>
                  <div class="sign-space"></div>
                  <div class="moul" style="font-size: 8.5pt;">${rec.teacherName || teacher.name || 'គ្រូបន្ទុកថ្នាក់'}</div>
                </div>
              </div>
            </div>

            <!-- Principal Side (ក្រោម) -->
            <div class="sign-box-half principal-box" style="width: 100%; margin-top: 4px; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1; margin-right: 12px;">
                  <div class="moul" style="font-size: 8.2pt; margin-bottom: 2px;">មូលវិចារណ៍ នាយកសាលា</div>
                  <div class="remark-container">
                    <div style="font-style: italic; color: #1e293b;">${rec.principalOpinion || 'បានឃើញ និងឯកភាពលើលទ្ធផលសិក្សា និងការវាយតម្លៃខាងលើ។'}</div>
                  </div>
                </div>
                <div style="text-align: center; width: 170px;">
                  <div class="moul" style="font-size: 8pt;">បានឃើញ និងឯកភាព</div>
                  <div class="moul" style="font-size: 8pt; margin-top: 2px;">នាយកសាលា</div>
                  <div class="sign-space"></div>
                  <div class="moul" style="font-size: 8.5pt;">${rec.principalName || 'នាយកសាលា'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return page1Html + page2Html;
  }, [allStudentSubjectData, computedClassScores, getStudentTraineeRecord, teacher, activeYear, students.length, activeSubjectsList]);

  // Direct Immediate Print Trigger (calls hidden iframe printing right away!)
  const handleDirectPrint = useCallback((scope: 'single' | 'all', pageOpt: 'both' | 'page1' | 'page2' = 'both') => {
    const targetStudents = (scope === 'single' ? [currentStudent] : students).filter(Boolean) as Student[];
    if (targetStudents.length === 0) {
      onShowToast('មិនមានទិន្នន័យសិស្សសម្រាប់បោះពុម្ពទេ!');
      return;
    }

    const allSheetsHtml = targetStudents.map((st, sIdx) => {
      const isLastStudent = sIdx === targetStudents.length - 1;
      return buildStudentBookHtml(st, pageOpt, isLastStudent);
    }).join('');

    const docTitle = scope === 'single' && currentStudent
      ? `សៀវភៅសិក្ខាគារិក_${currentStudent.name}_${activeYear}`
      : `សៀវភៅសិក្ខាគារិក_ទាំងថ្នាក់_${students.length}នាក់_${activeYear}`;

    triggerPrintContent(allSheetsHtml, docTitle);
    onShowToast(scope === 'single' && currentStudent ? `កំពុងបើកផ្ទាំងបោះពុម្ពសៀវភៅ៖ ${currentStudent.name}...` : `កំពុងបើកផ្ទាំងបោះពុម្ពទាំងថ្នាក់ (${students.length} នាក់)...`);
  }, [currentStudent, students, activeYear, buildStudentBookHtml, triggerPrintContent, onShowToast]);

  // Open Preview Modal if user wants to inspect on screen first
  const handleOpenPreviewModal = (scope: 'single' | 'all') => {
    setPrintScope(scope);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-5 sm:p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <BookOpenCheck className="w-3.5 h-3.5" />
                សៀវភៅសិក្ខាគារិក (Trainee Record Book)
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-purple-200">
                ឆ្នាំសិក្សា {activeYear}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-purple-200">
                {teacher.grade || 'ថ្នាក់ទី ៦'} ({students.length} នាក់)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-moul tracking-wide text-amber-300">
              សៀវភៅតាមដានលទ្ធផលសិក្សាសិក្ខាគារិក
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
              ទម្រង់ស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា ភ្ជាប់ទិន្នន័យស្វ័យប្រវត្តិជាមួយ «ពិន្ទុ & និទ្ទេស» និង «ស្រង់វត្តមាន» រួមមាន ១៥ មុខវិជ្ជា អវត្តមាន ការវាយតម្លៃ ៤ផ្នែក ការសរសើរ មូលវិចារណ៍ឡើងថ្នាក់/ធ្លាក់ និងហត្ថលេខាគ្រូ-នាយក។
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
            <button
              onClick={handleBatchAutoGenerate}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              title="បំពេញទិន្នន័យស្វ័យប្រវត្តិតាមពិន្ទុជាក់ស្តែងរបស់សិស្សទាំងអស់"
            >
              <Sparkles className="w-4 h-4 text-purple-950" />
              <span>បំពេញស្វ័យប្រវត្តិ</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="ទាញយកជា Excel CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Excel CSV</span>
            </button>
            <button
              onClick={() => handleDirectPrint('single', 'both')}
              className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              title="បោះពុម្ពសៀវភៅសិស្សបច្ចុប្បន្នភ្លាមៗ"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>បោះពុម្ពសិស្សនេះ</span>
            </button>
            <button
              onClick={() => handleDirectPrint('all', 'both')}
              className="bg-white hover:bg-slate-100 text-purple-950 px-3.5 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              title="បោះពុម្ពសៀវភៅសិក្ខាគារិកទាំងមូលសម្រាប់សិស្សទាំងអស់ក្នុងថ្នាក់ភ្លាមៗ"
            >
              <FileText className="w-4 h-4 text-purple-900" />
              <span>បោះពុម្ពទាំងថ្នាក់ ({students.length})</span>
            </button>
            <button
              onClick={() => handleOpenPreviewModal('single')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-2xl text-xs font-medium transition flex items-center gap-1 active:scale-95 cursor-pointer"
              title="មើលផ្ទាំងគំរូសៀវភៅសិក្ខាគារិក"
            >
              <Eye className="w-3.5 h-3.5 text-purple-200" />
              <span>មើលគំរូ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation & Student Selector Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveViewMode('single_student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeViewMode === 'single_student'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>មើលតាមសិស្សម្នាក់ៗ</span>
          </button>
          <button
            onClick={() => setActiveViewMode('batch_table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeViewMode === 'batch_table'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>តារាងសរុបទាំងថ្នាក់ ({students.length})</span>
          </button>
        </div>

        {/* Subject Mode Selector (Matches Semester 1 & Semester 2 score tables) */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-purple-700" />
            <span>មុខវិជ្ជា៖</span>
          </span>
          <select
            value={subjectMode}
            onChange={(e) => setSubjectMode(e.target.value as 'actual' | 'template15')}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-2xs"
            title="ជ្រើសរើសរបៀបកំណត់មុខវិជ្ជាសម្រាប់សៀវភៅសិក្ខាគារិក (ស្រង់ចេញពីការកំណត់ និងពិន្ទុពេលប្រឡងឆមាសទី១ និងឆមាសទី២)"
          >
            <option value="actual">
              ✨ ស្វ័យប្រវត្តិតាមការកំណត់ប្រឡងឆមាសទី១ & ទី២ ({activeSubjectsList.length} មុខ)
            </option>
            <option value="template15">
              📜 ទម្រង់គំរូដើម (១៥ មុខវិជ្ជា)
            </option>
          </select>
        </div>

        {/* If single student mode: search and fast student switcher */}
        {activeViewMode === 'single_student' && (
          <div className="flex items-center gap-2 flex-1 justify-end flex-wrap">
            <div className="relative min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកឈ្មោះសិស្ស ឬលេខរៀង..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              className="px-3 py-1.5 text-xs bg-purple-50 font-bold border border-purple-200 rounded-xl text-purple-950 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {filteredStudents.map((st) => (
                <option key={st.id} value={st.id}>
                  {String(st.rollNo).padStart(2, '0')}. {st.name} ({st.gender})
                </option>
              ))}
            </select>

            {/* Quick Prev / Next Student */}
            <div className="flex items-center gap-1">
              <button
                disabled={students.findIndex((s) => s.id === selectedStudentId) <= 0}
                onClick={() => {
                  const idx = students.findIndex((s) => s.id === selectedStudentId);
                  if (idx > 0) setSelectedStudentId(students[idx - 1].id);
                }}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg text-slate-700 transition"
                title="សិស្សមុន"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={students.findIndex((s) => s.id === selectedStudentId) >= students.length - 1}
                onClick={() => {
                  const idx = students.findIndex((s) => s.id === selectedStudentId);
                  if (idx < students.length - 1) setSelectedStudentId(students[idx + 1].id);
                }}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg text-slate-700 transition"
                title="សិស្សបន្ទាប់"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= VIEW 1: SINGLE STUDENT BOOK ================= */}
      {activeViewMode === 'single_student' && currentStudent && (
        <div className="space-y-4">
          {/* Student Profile Quick Banner */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                {currentStudent.rollNo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">{currentStudent.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentStudent.gender === 'ស្រី'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {currentStudent.gender}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    (ថ្ងៃខែឆ្នាំកំណើត៖ {currentStudent.dob || 'មិនមាន'})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5 flex-wrap">
                  <span>
                    មធ្យមភាគប្រចាំឆ្នាំ៖ <strong className="text-purple-900 font-black">{currentRecord.annualAvgOverride?.toFixed(2)}</strong>
                  </span>
                  <span>
                    ចំណាត់ថ្នាក់៖ <strong className="text-amber-700 font-black">លេខ {currentRecord.annualRankOverride || 1}</strong>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      (currentRecord.annualAvgOverride || 0) >= 5.0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {(currentRecord.annualAvgOverride || 0) >= 5.0 ? '✓ ឡើងថ្នាក់' : '⚠️ ត្រួតថ្នាក់/ធ្វើតេស្ត'}
                  </span>
                </div>
              </div>
            </div>

            {/* Page Tabs & Quick Print */}
            <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActivePageTab('both')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activePageTab === 'both' ? 'bg-purple-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ទាំងពីរទំព័រ
                </button>
                <button
                  onClick={() => setActivePageTab('page1')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activePageTab === 'page1' ? 'bg-purple-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ទំព័រ ១
                </button>
                <button
                  onClick={() => setActivePageTab('page2')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activePageTab === 'page2' ? 'bg-purple-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ទំព័រ ២
                </button>
              </div>

              <button
                onClick={() => handleDirectPrint('single', activePageTab)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                title={`បោះពុម្ព ${activePageTab === 'both' ? 'ទាំងពីរទំព័រ' : activePageTab === 'page1' ? 'ទំព័រទី១' : 'ទំព័រទី២'} សម្រាប់ ${currentStudent.name} ភ្លាមៗ`}
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>បោះពុម្ព ({activePageTab === 'both' ? '២ទំព័រ' : activePageTab === 'page1' ? 'ទំព័រ១' : 'ទំព័រ២'})</span>
              </button>
            </div>
          </div>

          {/* Book Canvas Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ================= PAGE 1 (IMG_3875) ================= */}
            {(activePageTab === 'both' || activePageTab === 'page1') && (
              <div className="bg-white p-6 sm:p-7 rounded-[28px] border-2 border-slate-300 shadow-sm space-y-4 text-slate-900">
                {/* Book Header */}
                <div className="text-center space-y-1 border-b pb-3 border-slate-200">
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    គោត្តនាម និងនាមសិស្ស <span className="font-moul text-purple-950 px-1">{currentStudent.name}</span> ថ្នាក់ទី <span className="font-bold">{teacher.grade || 'ថ្នាក់ទី៦ក'}</span> ឆ្នាំសិក្សា <span className="font-bold">{activeYear}</span>
                  </div>
                  <h3 className="font-moul text-base sm:text-lg text-slate-950 pt-1 tracking-wide">
                    លទ្ធផលនៃការសិក្សា
                  </h3>
                </div>

                {/* Control bar for viewing vs editing scores and syncing with Gradebook */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">របៀបបង្ហាញពិន្ទុ៖</span>
                    <button
                      onClick={() => setIsDirectEditMode(false)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                        !isDirectEditMode ? 'bg-purple-900 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>មើលតារាង (ងាយស្រួលចម្លង)</span>
                    </button>
                    <button
                      onClick={() => setIsDirectEditMode(true)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                        isDirectEditMode ? 'bg-purple-900 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>កែសម្រួលពិន្ទុដោយដៃ</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyTable}
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer transition shadow-xs"
                      title="ចម្លងតារាងពិន្ទុទាំងមូលជាទម្រង់ Tab-separated សម្រាប់ Paste ចូល Excel, Word ឬ Google Sheets"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>ចម្លងតារាងពិន្ទុ (Copy Table)</span>
                    </button>
                    <button
                      onClick={() => handleResetToGradebook(currentStudent.id)}
                      className="text-xs text-purple-700 hover:text-purple-950 font-bold flex items-center gap-1 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 cursor-pointer transition"
                      title="ធ្វើសមកាលកម្មទិន្នន័យពិន្ទុ និងចំណាត់ថ្នាក់ឱ្យត្រូវគ្នានឹងកន្លែងស្រង់ពិន្ទុ និងនិទ្ទេស"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>ធ្វើសមកាលកម្មពីកន្លែងស្រង់ពិន្ទុ</span>
                    </button>
                  </div>
                </div>

                {/* Main 15 Subject Scores Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse border border-slate-400">
                    <thead>
                      <tr className="bg-slate-100 text-center font-bold text-slate-900">
                        <th rowSpan={2} className="border border-slate-400 p-2 text-left min-w-[140px]">
                          មុខវិជ្ជា
                        </th>
                        <th colSpan={2} className="border border-slate-400 p-1.5 bg-blue-50/70">
                          ឆមាសទី ១
                        </th>
                        <th colSpan={2} className="border border-slate-400 p-1.5 bg-purple-50/70">
                          ឆមាសទី ២
                        </th>
                        <th colSpan={2} className="border border-slate-400 p-1.5 bg-amber-50/70">
                          ប្រចាំឆ្នាំ
                        </th>
                        <th rowSpan={2} className="border border-slate-400 p-1.5 text-center min-w-[110px]">
                          មូលវិចារហត្ថលេខា និងឈ្មោះគ្រូ
                        </th>
                      </tr>
                      <tr className="bg-slate-50 text-center font-bold text-[11px] text-slate-800">
                        <th className="border border-slate-400 p-1 bg-blue-50/50">ពិន្ទុ</th>
                        <th className="border border-slate-400 p-1 bg-blue-50/50">ចំ.ថ្នាក់</th>
                        <th className="border border-slate-400 p-1 bg-purple-50/50">ពិន្ទុ</th>
                        <th className="border border-slate-400 p-1 bg-purple-50/50">ចំ.ថ្នាក់</th>
                        <th className="border border-slate-400 p-1 bg-amber-50/50">ម.ភាគ</th>
                        <th className="border border-slate-400 p-1 bg-amber-50/50">ចំ.ថ្នាក់</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSubjectsList.map((sub) => {
                        const studentSubData = allStudentSubjectData[currentStudent.id]?.[sub.id] || { s1: 0, s2: 0, annual: 0, s1Rank: 1, s2Rank: 1, annualRank: 1 };
                        const override = currentRecord.subjectOverrides?.[sub.id];
                        const s1Score = override?.s1 !== undefined ? override.s1 : studentSubData.s1;
                        const s2Score = override?.s2 !== undefined ? override.s2 : studentSubData.s2;
                        const annualScore = override?.annual !== undefined ? override.annual : studentSubData.annual;
                        const s1Rank = override?.s1Rank !== undefined ? override.s1Rank : studentSubData.s1Rank;
                        const s2Rank = override?.s2Rank !== undefined ? override.s2Rank : studentSubData.s2Rank;
                        const annualRank = override?.annualRank !== undefined ? override.annualRank : studentSubData.annualRank;

                        return (
                          <tr key={sub.id} className="hover:bg-purple-50/30 transition">
                            <td className="border border-slate-400 p-1.5 font-medium text-slate-900">
                              {sub.name}
                            </td>
                            {/* Semester 1 */}
                            <td className="border border-slate-400 p-1 text-center font-mono font-bold text-slate-900 bg-blue-50/20">
                              {isDirectEditMode ? (
                                <input
                                  type="number"
                                  step="0.25"
                                  min="0"
                                  max="10"
                                  value={s1Score}
                                  onChange={(e) => updateSubjectScore(sub.id, 's1', parseFloat(e.target.value) || 0)}
                                  className="w-14 text-center bg-white border border-purple-300 rounded px-1 py-0.5 focus:border-purple-600 focus:outline-none font-bold"
                                />
                              ) : (
                                <span>{s1Score.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono text-slate-700 bg-blue-50/20">
                              {s1Rank}
                            </td>

                            {/* Semester 2 */}
                            <td className="border border-slate-400 p-1 text-center font-mono font-bold text-slate-900 bg-purple-50/20">
                              {isDirectEditMode ? (
                                <input
                                  type="number"
                                  step="0.25"
                                  min="0"
                                  max="10"
                                  value={s2Score}
                                  onChange={(e) => updateSubjectScore(sub.id, 's2', parseFloat(e.target.value) || 0)}
                                  className="w-14 text-center bg-white border border-purple-300 rounded px-1 py-0.5 focus:border-purple-600 focus:outline-none font-bold"
                                />
                              ) : (
                                <span>{s2Score.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono text-slate-700 bg-purple-50/20">
                              {s2Rank}
                            </td>

                            {/* Annual */}
                            <td className="border border-slate-400 p-1 text-center font-mono font-bold text-amber-950 bg-amber-50/30">
                              {isDirectEditMode ? (
                                <input
                                  type="number"
                                  step="0.25"
                                  min="0"
                                  max="10"
                                  value={annualScore}
                                  onChange={(e) => updateSubjectScore(sub.id, 'annual', parseFloat(e.target.value) || 0)}
                                  className="w-14 text-center bg-white border border-purple-300 rounded px-1 py-0.5 focus:border-purple-600 focus:outline-none font-black"
                                />
                              ) : (
                                <span>{annualScore.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono font-bold text-amber-950 bg-amber-50/30">
                              {annualRank}
                            </td>

                            {/* Teacher signature/remarks */}
                            <td className="border border-slate-400 p-1 text-left text-[11px] px-2">
                              {isDirectEditMode ? (
                                <input
                                  type="text"
                                  value={currentRecord.teacherRemarks?.[sub.id] || ''}
                                  onChange={(e) => updateTeacherRemark(sub.id, e.target.value)}
                                  placeholder="មូលវិចារ..."
                                  className="w-full bg-white border border-dashed border-purple-200 rounded px-1.5 py-0.5 focus:border-purple-600 focus:outline-none text-[11px]"
                                />
                              ) : (
                                <span>{currentRecord.teacherRemarks?.[sub.id] || ''}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {/* Summary Rows */}
                      {(() => {
                        const summaryData = currentStudent ? classSummaryRankings[currentStudent.id] : undefined;
                        const s1Summary = currentStudent ? computedClassScores.s1Map.get(currentStudent.id) : undefined;
                        const s2Summary = currentStudent ? computedClassScores.s2Map.get(currentStudent.id) : undefined;
                        const annualSummary = currentStudent ? computedClassScores.annualMap.get(currentStudent.id) : undefined;

                        const sem1Val = currentRecord.semesterAvgS1 || 0;
                        const sem2Val = currentRecord.semesterAvgS2 || 0;
                        const computedAnnualFromSemesters = (sem1Val > 0 && sem2Val > 0)
                          ? Number(((sem1Val + sem2Val) / 2).toFixed(2))
                          : (sem2Val > 0 ? sem2Val : sem1Val);

                        const currentAnnualAvg = (currentRecord.annualAvgOverride !== undefined && currentRecord.annualAvgOverride > 0)
                          ? currentRecord.annualAvgOverride
                          : (computedAnnualFromSemesters > 0 ? computedAnnualFromSemesters : (summaryData?.metrics?.annualAvg ?? annualSummary?.annualAvg ?? 0));

                        const isPass = currentAnnualAvg >= 5.0;

                        const s1Letter = s1Summary?.classification?.letter || (sem1Val > 0 ? getGradeClassification(sem1Val, effectiveGradeThresholds).letter : '-');
                        const s2Letter = s2Summary?.classification?.letter || (sem2Val > 0 ? getGradeClassification(sem2Val, effectiveGradeThresholds).letter : '-');
                        const annualLetter = currentAnnualAvg > 0 ? getGradeClassification(currentAnnualAvg, effectiveGradeThresholds).letter : '-';

                        return (
                          <>
                            <tr className="bg-slate-100/90 font-bold">
                              <td className="border border-slate-400 p-1.5 font-bold">សរុបពិន្ទុប្រឡងឆមាស</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-slate-900">{currentRecord.examTotalS1?.toFixed(2)}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono">{summaryData?.s1ExamTotalRank || 1}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-slate-900">{currentRecord.examTotalS2?.toFixed(2)}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono">{summaryData?.s2ExamTotalRank || 1}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-amber-950">
                                {(((currentRecord.examTotalS1 || 0) + (currentRecord.examTotalS2 || 0)) / 2).toFixed(2)}
                              </td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-amber-950">{summaryData?.annualExamTotalRank || 1}</td>
                              <td className="border border-slate-400 p-1"></td>
                            </tr>

                            <tr className="bg-slate-100/90 font-bold">
                              <td className="border border-slate-400 p-1.5 font-bold">មធ្យមភាគពិន្ទុប្រឡងឆមាស</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-slate-900">{currentRecord.examAvgS1?.toFixed(2)}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono">{summaryData?.s1ExamAvgRank || 1}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-slate-900">{currentRecord.examAvgS2?.toFixed(2)}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono">{summaryData?.s2ExamAvgRank || 1}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-amber-950">
                                {(((currentRecord.examAvgS1 || 0) + (currentRecord.examAvgS2 || 0)) / 2).toFixed(2)}
                              </td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-amber-950">{summaryData?.annualExamAvgRank || 1}</td>
                              <td className="border border-slate-400 p-1"></td>
                            </tr>

                            <tr className="bg-slate-100/90 font-bold">
                              <td className="border border-slate-400 p-1.5 font-bold">មធ្យមភាគពិន្ទុខែប្រចាំឆមាស</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-slate-900">{currentRecord.monthlyAvgS1?.toFixed(2)}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono">{summaryData?.s1MonthlyMeanRank || 1}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-slate-900">{currentRecord.monthlyAvgS2?.toFixed(2)}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono">{summaryData?.s2MonthlyMeanRank || 1}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-amber-950">
                                {(((currentRecord.monthlyAvgS1 || 0) + (currentRecord.monthlyAvgS2 || 0)) / 2).toFixed(2)}
                              </td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-bold text-amber-950">{summaryData?.annualMonthlyMeanRank || 1}</td>
                              <td className="border border-slate-400 p-1"></td>
                            </tr>

                            <tr className="bg-amber-100/80 font-black text-slate-950">
                              <td className="border border-slate-400 p-1.5 font-black">មធ្យមភាគប្រចាំឆមាស & ប្រចាំឆ្នាំ</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-black text-slate-950">{currentRecord.semesterAvgS1?.toFixed(2)}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-black text-slate-950">{summaryData?.s1SemesterRank || s1Summary?.rank || 1}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-black text-slate-950">{currentRecord.semesterAvgS2?.toFixed(2)}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-black text-slate-950">{summaryData?.s2SemesterRank || s2Summary?.rank || 1}</td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-black text-purple-950 text-sm">
                                {currentAnnualAvg.toFixed(2)}
                              </td>
                              <td className="border border-slate-400 p-1 text-center font-mono font-black text-purple-950 text-sm">
                                {currentRecord.annualRankOverride || summaryData?.annualRank || annualSummary?.rank || 1}
                              </td>
                              <td className="border border-slate-400 p-1 text-center text-[10px] font-bold">
                                <span className={`px-2 py-0.5 rounded ${isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                  {isPass ? 'ជាប់' : 'ធ្លាក់'}
                                </span>
                              </td>
                            </tr>

                            <tr className="bg-slate-50 font-bold text-slate-900">
                              <td className="border border-slate-400 p-1.5 font-bold">និទ្ទេស</td>
                              <td colSpan={2} className="border border-slate-400 p-1 text-center font-bold text-slate-800 text-sm">
                                {s1Letter}
                              </td>
                              <td colSpan={2} className="border border-slate-400 p-1 text-center font-bold text-slate-800 text-sm">
                                {s2Letter}
                              </td>
                              <td colSpan={2} className="border border-slate-400 p-1 text-center font-bold text-amber-950 text-sm">
                                {annualLetter}
                              </td>
                              <td className="border border-slate-400 p-1 text-center font-bold">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-black ${isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                  {isPass ? 'ឡើងថ្នាក់' : 'ត្រួតថ្នាក់'}
                                </span>
                              </td>
                            </tr>
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Absence Table (ចំនួនអវត្តមានក្នុងឆ្នាំសិក្សា) */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-moul text-xs text-center text-slate-900">
                    ចំនួនអវត្តមានក្នុងឆ្នាំសិក្សា
                  </h4>
                  <table className="w-full text-xs border-collapse border border-slate-400">
                    <thead>
                      <tr className="bg-slate-100 text-center font-bold">
                        <th className="border border-slate-400 p-2 text-left w-1/3">អវត្តមាន</th>
                        <th className="border border-slate-400 p-2">ឆមាសទី ១</th>
                        <th className="border border-slate-400 p-2">ឆមាសទី ២</th>
                        <th className="border border-slate-400 p-2 bg-amber-50">ប្រចាំឆ្នាំ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-400 p-2 font-medium">- មានច្បាប់</td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            min="0"
                            value={currentRecord.absentExcusedS1 ?? 0}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10) || 0;
                              updateCurrentField('absentExcusedS1', v);
                              updateCurrentField('absentExcusedAnnual', v + (currentRecord.absentExcusedS2 || 0));
                            }}
                            className="w-12 text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-600 focus:outline-none font-bold"
                          />
                        </td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            min="0"
                            value={currentRecord.absentExcusedS2 ?? 0}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10) || 0;
                              updateCurrentField('absentExcusedS2', v);
                              updateCurrentField('absentExcusedAnnual', (currentRecord.absentExcusedS1 || 0) + v);
                            }}
                            className="w-12 text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-600 focus:outline-none font-bold"
                          />
                        </td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono font-bold bg-amber-50">
                          {currentRecord.absentExcusedAnnual ?? ((currentRecord.absentExcusedS1 || 0) + (currentRecord.absentExcusedS2 || 0))}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-400 p-2 font-medium">- ឥតច្បាប់</td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            min="0"
                            value={currentRecord.absentUnexcusedS1 ?? 0}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10) || 0;
                              updateCurrentField('absentUnexcusedS1', v);
                              updateCurrentField('absentUnexcusedAnnual', v + (currentRecord.absentUnexcusedS2 || 0));
                            }}
                            className="w-12 text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-600 focus:outline-none font-bold"
                          />
                        </td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            min="0"
                            value={currentRecord.absentUnexcusedS2 ?? 0}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10) || 0;
                              updateCurrentField('absentUnexcusedS2', v);
                              updateCurrentField('absentUnexcusedAnnual', (currentRecord.absentUnexcusedS1 || 0) + v);
                            }}
                            className="w-12 text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-600 focus:outline-none font-bold"
                          />
                        </td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono font-bold bg-amber-50">
                          {currentRecord.absentUnexcusedAnnual ?? ((currentRecord.absentUnexcusedS1 || 0) + (currentRecord.absentUnexcusedS2 || 0))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= PAGE 2 (IMG_3877) ================= */}
            {(activePageTab === 'both' || activePageTab === 'page2') && (
              <div className="bg-white p-6 sm:p-7 rounded-[28px] border-2 border-slate-300 shadow-sm space-y-4 text-slate-900">
                {/* Header */}
                <div className="text-center space-y-0.5 border-b pb-3 border-slate-200">
                  <div className="text-xs font-bold text-slate-800">
                    គ្រឹះស្ថានសិក្សា <span className="font-moul text-purple-950 px-1">{teacher.school || 'សាលាបឋមសិក្សា'}</span> ចំនួនសិស្សក្នុងថ្នាក់ <span className="font-bold">{students.length} នាក់</span>
                  </div>
                </div>

                {/* 1. ការវាយតម្លៃ */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-purple-50/70 p-2.5 rounded-xl border border-purple-200">
                    <div>
                      <h4 className="font-moul text-xs text-purple-950">
                        ការវាយតម្លៃ (ផ្នែកទាំង ៤)
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        ក្នុងមួយប្រអប់មាន ១០ ជម្រើសសម្រាប់រើសតាមប្រភេទសិស្ស ឬអាចវាយបញ្ចូលកែសម្រួលដោយផ្ទាល់
                      </p>
                    </div>
                    {/* Presets by student category */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10.5px] font-medium text-slate-600 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        រើសស្វ័យប្រវត្តិតាមប្រភេទសិស្ស៖
                      </span>
                      <button
                        type="button"
                        onClick={() => applyEvalPreset(0)}
                        title="កំណត់ការវាយតម្លៃទាំង ៤ផ្នែក សម្រាប់សិស្សពូកែ"
                        className="px-2 py-0.5 text-[10.5px] font-medium bg-purple-100 hover:bg-purple-200 text-purple-900 rounded border border-purple-300 transition-colors shadow-xs"
                      >
                        សិស្សពូកែ
                      </button>
                      <button
                        type="button"
                        onClick={() => applyEvalPreset(1)}
                        title="កំណត់ការវាយតម្លៃទាំង ៤ផ្នែក សម្រាប់សិស្សល្អ"
                        className="px-2 py-0.5 text-[10.5px] font-medium bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded border border-emerald-300 transition-colors shadow-xs"
                      >
                        សិស្សល្អ
                      </button>
                      <button
                        type="button"
                        onClick={() => applyEvalPreset(4)}
                        title="កំណត់ការវាយតម្លៃទាំង ៤ផ្នែក សម្រាប់សិស្សមធ្យម"
                        className="px-2 py-0.5 text-[10.5px] font-medium bg-blue-100 hover:bg-blue-200 text-blue-900 rounded border border-blue-300 transition-colors shadow-xs"
                      >
                        សិស្សមធ្យម
                      </button>
                      <button
                        type="button"
                        onClick={() => applyEvalPreset(7)}
                        title="កំណត់ការវាយតម្លៃទាំង ៤ផ្នែក សម្រាប់សិស្សរៀនយឺត"
                        className="px-2 py-0.5 text-[10.5px] font-medium bg-amber-100 hover:bg-amber-200 text-amber-900 rounded border border-amber-300 transition-colors shadow-xs"
                      >
                        សិស្សរៀនយឺត
                      </button>
                      <button
                        type="button"
                        onClick={() => applyEvalPreset(9)}
                        title="កំណត់ការវាយតម្លៃទាំង ៤ផ្នែក សម្រាប់សិស្សខ្សោយ"
                        className="px-2 py-0.5 text-[10.5px] font-medium bg-rose-100 hover:bg-rose-200 text-rose-900 rounded border border-rose-300 transition-colors shadow-xs"
                      >
                        សិស្សខ្សោយ
                      </button>
                    </div>
                  </div>

                  <table className="w-full text-xs border-collapse border border-slate-400">
                    <thead>
                      <tr className="bg-slate-100 text-center font-bold">
                        <th className="border border-slate-400 p-2 text-left w-1/4">ផ្នែកទាំង ៤</th>
                        <th className="border border-slate-400 p-2 w-1/4">ឆមាសទី ១</th>
                        <th className="border border-slate-400 p-2 w-1/4">ឆមាសទី ២</th>
                        <th className="border border-slate-400 p-2 w-1/4 bg-amber-50">ប្រចាំឆ្នាំ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Row 1: ការសិក្សា */}
                      <tr>
                        <td className="border border-slate-400 p-2 font-medium bg-slate-50/70 align-top">
                          <div className="font-semibold text-slate-900">១. ការសិក្សា</div>
                          <div className="text-[10px] text-slate-500">ការយល់ដឹង និងលទ្ធផលសិក្សា</div>
                        </td>
                        {renderEvalCell('evalStudyS1', currentRecord.evalStudyS1, EVAL_DOMAIN_OPTIONS.study)}
                        {renderEvalCell('evalStudyS2', currentRecord.evalStudyS2, EVAL_DOMAIN_OPTIONS.study)}
                        {renderEvalCell('evalStudyAnnual', currentRecord.evalStudyAnnual, EVAL_DOMAIN_OPTIONS.study, true)}
                      </tr>

                      {/* Row 2: សីលធម៌រស់នៅ */}
                      <tr>
                        <td className="border border-slate-400 p-2 font-medium bg-slate-50/70 align-top">
                          <div className="font-semibold text-slate-900">២. សីលធម៌រស់នៅ</div>
                          <div className="text-[10px] text-slate-500">វិន័យ សីលធម៌ និងទំនាក់ទំនង</div>
                        </td>
                        {renderEvalCell('evalMoralS1', currentRecord.evalMoralS1, EVAL_DOMAIN_OPTIONS.moral)}
                        {renderEvalCell('evalMoralS2', currentRecord.evalMoralS2, EVAL_DOMAIN_OPTIONS.moral)}
                        {renderEvalCell('evalMoralAnnual', currentRecord.evalMoralAnnual, EVAL_DOMAIN_OPTIONS.moral, true)}
                      </tr>

                      {/* Row 3: ពលកម្ម-បង្កបង្កើតផល */}
                      <tr>
                        <td className="border border-slate-400 p-2 font-medium bg-slate-50/70 align-top">
                          <div className="font-semibold text-slate-900">៣. ពលកម្ម-បង្កបង្កើតផល</div>
                          <div className="text-[10px] text-slate-500">ការចូលរួមពលកម្ម និងថែទាំ</div>
                        </td>
                        {renderEvalCell('evalLaborS1', currentRecord.evalLaborS1, EVAL_DOMAIN_OPTIONS.labor)}
                        {renderEvalCell('evalLaborS2', currentRecord.evalLaborS2, EVAL_DOMAIN_OPTIONS.labor)}
                        {renderEvalCell('evalLaborAnnual', currentRecord.evalLaborAnnual, EVAL_DOMAIN_OPTIONS.labor, true)}
                      </tr>

                      {/* Row 4: សុខភាព-អនាម័យ */}
                      <tr>
                        <td className="border border-slate-400 p-2 font-medium bg-slate-50/70 align-top">
                          <div className="font-semibold text-slate-900">៤. សុខភាព-អនាម័យ</div>
                          <div className="text-[10px] text-slate-500">អនាម័យខ្លួនប្រាណ និងកាយសម្បទា</div>
                        </td>
                        {renderEvalCell('evalHealthS1', currentRecord.evalHealthS1, EVAL_DOMAIN_OPTIONS.health)}
                        {renderEvalCell('evalHealthS2', currentRecord.evalHealthS2, EVAL_DOMAIN_OPTIONS.health)}
                        {renderEvalCell('evalHealthAnnual', currentRecord.evalHealthAnnual, EVAL_DOMAIN_OPTIONS.health, true)}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 2. លទ្ធផលនៃការប្រឡងបញ្ចប់ឆ្នាំសិក្សា */}
                {(() => {
                  const summaryData = currentStudent ? classSummaryRankings[currentStudent.id] : undefined;
                  const annualSummary = currentStudent ? computedClassScores.annualMap.get(currentStudent.id) : undefined;
                  const sem1Val = currentRecord.semesterAvgS1 || 0;
                  const sem2Val = currentRecord.semesterAvgS2 || 0;
                  const computedAnnualFromSemesters = (sem1Val > 0 && sem2Val > 0)
                    ? Number(((sem1Val + sem2Val) / 2).toFixed(2))
                    : (sem2Val > 0 ? sem2Val : sem1Val);

                  const annualAvg = (currentRecord.annualAvgOverride !== undefined && currentRecord.annualAvgOverride > 0)
                    ? currentRecord.annualAvgOverride
                    : (computedAnnualFromSemesters > 0 ? computedAnnualFromSemesters : (summaryData?.metrics?.annualAvg ?? annualSummary?.annualAvg ?? 0));
                  const annualRank = currentRecord.annualRankOverride || summaryData?.annualRank || annualSummary?.rank || 1;
                  const isPass = annualAvg >= 5.0;
                  const annualLetter = annualAvg > 0 ? getGradeClassification(annualAvg, effectiveGradeThresholds).letter : '-';
                  const currentGrade = currentRecord.gradeLevel || teacher.grade || 'ថ្នាក់ទី ៦';
                  const nextGrade = getNextGradeLabel(currentGrade);
                  const activeRetestSubjects = currentRecord.retestSubjects && currentRecord.retestSubjects.length > 0 ? currentRecord.retestSubjects : ['ភាសាខ្មែរ', 'គណិតវិទ្យា'];

                  return (
                    <div className="space-y-3 border-t border-b py-3 border-slate-200 bg-slate-50/70 rounded-xl px-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-moul text-xs text-slate-950 flex items-center gap-1.5">
                          <span>លទ្ធផលនៃការប្រឡងបញ្ចប់ឆ្នាំសិក្សា</span>
                          <span className="text-purple-700 underline underline-offset-4">{currentRecord.academicYear || activeYear}</span>
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-slate-500 font-medium">ឡើងថ្នាក់ទី៖</span>
                          <input
                            type="text"
                            value={currentRecord.yearEndPromotionGrade ?? nextGrade}
                            onChange={(e) => updateCurrentField('yearEndPromotionGrade', e.target.value)}
                            className="w-24 bg-white border border-slate-300 rounded px-1.5 py-0.5 font-bold text-center text-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="ថ្នាក់ទី..."
                          />
                          <span className="text-slate-500 font-medium ml-1">ត្រួតថ្នាក់ទី៖</span>
                          <input
                            type="text"
                            value={currentRecord.yearEndRepeatGrade ?? currentGrade}
                            onChange={(e) => updateCurrentField('yearEndRepeatGrade', e.target.value)}
                            className="w-24 bg-white border border-slate-300 rounded px-1.5 py-0.5 font-bold text-center text-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            placeholder="ថ្នាក់ទី..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                        {/* Left Column: Annual Metrics & Promotion */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2.5">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-purple-50/70 p-2 rounded border border-purple-100">
                              <div className="text-[10px] text-slate-500 font-medium">មធ្យមភាគប្រចាំឆ្នាំ</div>
                              <div className="text-sm font-black text-purple-950">{annualAvg.toFixed(2)}</div>
                            </div>
                            <div className="bg-amber-50/70 p-2 rounded border border-amber-100">
                              <div className="text-[10px] text-slate-500 font-medium">ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ</div>
                              <div className="text-sm font-black text-amber-950">លេខ {annualRank}</div>
                            </div>
                            <div className="bg-blue-50/70 p-2 rounded border border-blue-100">
                              <div className="text-[10px] text-slate-500 font-medium">និទ្ទេស</div>
                              <div className="text-sm font-black text-blue-900">{annualLetter}</div>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                            {isPass ? (
                              <div className="flex items-center gap-2 p-2 rounded-md bg-emerald-50/80 border border-emerald-200 text-emerald-950 font-medium">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-emerald-600 text-white font-bold shrink-0">✓</span>
                                <span>- <strong>ត្រូវបានឡើង{currentRecord.yearEndPromotionGrade || nextGrade}</strong></span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-2 rounded-md bg-rose-50/80 border border-rose-200 text-rose-950 font-medium">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-rose-600 text-white font-bold shrink-0">!</span>
                                <span>- <strong>មិនទាន់បានឡើងថ្នាក់ (ធ្លាក់)</strong></span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Column: Retest Details Configuration */}
                        <div className={`p-3 rounded-lg border space-y-2.5 text-xs ${isPass ? 'bg-slate-50 border-slate-200 opacity-90' : 'bg-white border-rose-300'}`}>
                          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                            <div className={`font-bold flex items-center gap-1.5 ${!isPass ? 'text-rose-700' : 'text-slate-600'}`}>
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${!isPass ? 'bg-rose-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                                {isPass ? '✓' : '!'}
                              </span>
                              <span>- ត្រូវធ្វើតេស្តឡើងថ្នាក់</span>
                            </div>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              {isPass ? 'សិស្សជាប់ មិនបង្ហាញលើសន្លឹកបោះពុម្ព' : 'សិស្សធ្លាក់ បង្ហាញលើសន្លឹកបោះពុម្ព'}
                            </span>
                          </div>

                          <div className="font-bold text-slate-900">
                            - មុខវិជ្ជាធ្វើតេស្តឡើងថ្នាក់៖
                          </div>

                          {/* Retest Date */}
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 shrink-0 font-medium">• កាលបរិច្ឆេទ៖</span>
                            <input
                              type="text"
                              value={currentRecord.retestDate || ''}
                              onChange={(e) => updateCurrentField('retestDate', e.target.value)}
                              placeholder="ឧ. ថ្ងៃទី០១ ខែកញ្ញា ឆ្នាំ២០២៦ (អាចកែបាន)..."
                              className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                          </div>

                          {/* Retest Subjects (Add/Remove) */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 font-medium">• មុខវិជ្ជាតេស្ត (អាចបន្ថែមនិងបន្ថយបាន)៖</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 min-h-[30px] p-1.5 bg-slate-50 rounded border border-slate-200">
                              {activeRetestSubjects.map((subName) => (
                                <span
                                  key={subName}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-semibold"
                                >
                                  {subName}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateCurrentField('retestSubjects', activeRetestSubjects.filter((s) => s !== subName));
                                    }}
                                    className="hover:bg-purple-200 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center text-purple-700 font-bold"
                                    title={`លុបមុខវិជ្ជា ${subName}`}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>

                            {/* Quick Add presets and input */}
                            <div className="flex flex-wrap items-center gap-1 pt-0.5">
                              <span className="text-[10px] text-slate-400">បន្ថែមរហ័ស៖</span>
                              {['ភាសាខ្មែរ', 'គណិតវិទ្យា', 'វិទ្យាសាស្ត្រ', 'សិក្សាសង្គម', 'ភាសាអង់គ្លេស'].map((preset) => {
                                const exists = activeRetestSubjects.includes(preset);
                                if (exists) return null;
                                return (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => {
                                      updateCurrentField('retestSubjects', [...activeRetestSubjects, preset]);
                                    }}
                                    className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-800 rounded border border-slate-200"
                                  >
                                    + {preset}
                                  </button>
                                );
                              })}
                              <div className="flex items-center gap-1 ml-auto">
                                <input
                                  type="text"
                                  value={newRetestSubjectInput}
                                  onChange={(e) => setNewRetestSubjectInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      if (newRetestSubjectInput.trim()) {
                                        if (!activeRetestSubjects.includes(newRetestSubjectInput.trim())) {
                                          updateCurrentField('retestSubjects', [...activeRetestSubjects, newRetestSubjectInput.trim()]);
                                        }
                                        setNewRetestSubjectInput('');
                                      }
                                    }
                                  }}
                                  placeholder="ឈ្មោះមុខវិជ្ជា..."
                                  className="w-24 text-[11px] px-1.5 py-0.5 border border-slate-300 rounded bg-white focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (newRetestSubjectInput.trim()) {
                                      if (!activeRetestSubjects.includes(newRetestSubjectInput.trim())) {
                                        updateCurrentField('retestSubjects', [...activeRetestSubjects, newRetestSubjectInput.trim()]);
                                      }
                                      setNewRetestSubjectInput('');
                                    }
                                  }}
                                  className="text-[11px] px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium"
                                >
                                  + បន្ថែម
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Retest Average Score */}
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 shrink-0 font-medium">• មធ្យមភាគទទួលបាន៖</span>
                            <input
                              type="text"
                              value={currentRecord.retestAvgScore || ''}
                              onChange={(e) => updateCurrentField('retestAvgScore', e.target.value)}
                              placeholder="ឧ. ៥.០០ (បើមាន)"
                              className="w-28 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-center focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                          </div>

                          {/* Retest Result Selector */}
                          <div className="space-y-1">
                            <span className="text-slate-600 font-medium">• លទ្ធផល៖</span>
                            <div className="grid grid-cols-3 gap-1 text-[11px]">
                              <button
                                type="button"
                                onClick={() => updateCurrentField('retestResult', '')}
                                className={`p-1 rounded text-center font-medium border ${!currentRecord.retestResult ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                              >
                                ទូទៅ / មិនទាន់តេស្ត
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCurrentField('retestResult', 'ជាប់')}
                                className={`p-1 rounded text-center font-medium border ${currentRecord.retestResult === 'ជាប់' ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50'}`}
                              >
                                ✓ ជាប់ឡើងថ្នាក់
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCurrentField('retestResult', 'ធ្លាក់')}
                                className={`p-1 rounded text-center font-medium border ${currentRecord.retestResult === 'ធ្លាក់' ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50'}`}
                              >
                                ✕ ធ្លាក់ត្រួតថ្នាក់
                              </button>
                            </div>
                            <div className="text-[11px] p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700">
                              <span className="text-slate-500">ការបង្ហាញ៖ </span>
                              {currentRecord.retestResult === 'ជាប់' ? (
                                <span className="font-bold text-emerald-800">ជាប់ (ត្រូវបានឡើង{currentRecord.yearEndPromotionGrade || nextGrade})</span>
                              ) : currentRecord.retestResult === 'ធ្លាក់' ? (
                                <span className="font-bold text-rose-800">ធ្លាក់ (ត្រូវរៀនត្រួត{currentRecord.yearEndRepeatGrade || currentGrade})</span>
                              ) : (
                                <span>ជាប់ (ត្រូវបានឡើង{currentRecord.yearEndPromotionGrade || nextGrade}) ឬ ធ្លាក់ (ត្រូវរៀនត្រួត{currentRecord.yearEndRepeatGrade || currentGrade})</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 4. មូលវិចារណ៍ គ្រូបន្ទុកថ្នាក់ & នាយកសាលា */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 items-start">
                  {/* Teacher Remarks (Left/First) */}
                  <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-2">
                    <div className="text-center text-xs text-slate-800 bg-white/80 p-2 rounded-xl border border-purple-200 shadow-xs space-y-0.5">
                      <div className="font-semibold text-purple-950">{currentRecord.docDateLunar || defaultLunarDate}</div>
                      <div className="text-slate-600 font-medium text-[11px]">{currentRecord.docDateSolar || defaultSolarDate}</div>
                    </div>
                    <h5 className="font-moul text-xs text-center text-purple-950 font-bold">
                      មូលវិចារណ៍ គ្រូបន្ទុកថ្នាក់
                    </h5>

                    {/* Praise Points */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-emerald-800">
                        ចំណុចសរសើរ៖
                      </label>
                      <textarea
                        rows={2}
                        value={currentRecord.praisePoints || ''}
                        onChange={(e) => updateCurrentField('praisePoints', e.target.value)}
                        placeholder="ចំណុចសរសើរសិស្ស..."
                        className="w-full text-xs p-2 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                      />
                    </div>

                    {/* Improvement Points */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-amber-800">
                        ការកែលម្អ៖
                      </label>
                      <textarea
                        rows={2}
                        value={currentRecord.improvementPoints || ''}
                        onChange={(e) => updateCurrentField('improvementPoints', e.target.value)}
                        placeholder="ចំណុចដែលសិស្សត្រូវកែលម្អ..."
                        className="w-full text-xs p-2 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                      />
                    </div>

                    <div className="pt-4 text-center">
                      <input
                        type="text"
                        value={currentRecord.teacherName || ''}
                        onChange={(e) => updateCurrentField('teacherName', e.target.value)}
                        placeholder="ឈ្មោះគ្រូបន្ទុកថ្នាក់"
                        className="text-center font-bold text-xs bg-transparent border-b border-purple-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Principal Remarks (Right/Second - situated slightly below) */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 md:mt-6">
                    <div className="text-center text-xs text-slate-800 bg-white/80 p-2 rounded-xl border border-slate-200 shadow-xs space-y-0.5">
                      <div className="font-semibold text-purple-950">{currentRecord.docDateLunar || defaultLunarDate}</div>
                      <div className="text-slate-600 font-medium text-[11px]">{currentRecord.docDateSolar || defaultSolarDate}</div>
                    </div>
                    <h5 className="font-moul text-xs text-center text-purple-950 font-bold">
                      មូលវិចារណ៍ នាយក
                    </h5>
                    <textarea
                      rows={3}
                      value={currentRecord.principalOpinion || ''}
                      onChange={(e) => updateCurrentField('principalOpinion', e.target.value)}
                      placeholder="បញ្ចូលយោបល់ និងការឯកភាពរបស់នាយកសាលា..."
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed font-medium"
                    />
                    <div className="pt-6 text-center">
                      <input
                        type="text"
                        value={currentRecord.principalName || ''}
                        onChange={(e) => updateCurrentField('principalName', e.target.value)}
                        placeholder="ឈ្មោះនាយកសាលា"
                        className="text-center font-bold text-xs bg-transparent border-b border-slate-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: BATCH TABLE VIEW FOR ENTIRE CLASS ================= */}
      {activeViewMode === 'batch_table' && (
        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                តារាងតាមដាន និងវិចារសៀវភៅសិក្ខាគារិកសិស្សទាំងអស់ ({students.length} នាក់)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ពិនិត្យ កែប្រែ និងគ្រប់គ្រងចំណុចសរសើរ ការកែលម្អ និងយោបល់នាយកសម្រាប់គ្រប់សិស្សក្នុងថ្នាក់
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBatchAutoGenerate}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>បំពេញស្វ័យប្រវត្តិឡើងវិញ</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 text-center w-12">ល.រ</th>
                  <th className="p-2.5 min-w-[130px]">ឈ្មោះសិស្ស</th>
                  <th className="p-2.5 text-center">ភេទ</th>
                  <th className="p-2.5 text-center font-mono">ម.ភាគ ឆ.១</th>
                  <th className="p-2.5 text-center font-mono">ម.ភាគ ឆ.២</th>
                  <th className="p-2.5 text-center font-mono bg-amber-50">ម.ភាគ ប្រចាំឆ្នាំ</th>
                  <th className="p-2.5 text-center font-mono">ចំណាត់ថ្នាក់</th>
                  <th className="p-2.5 min-w-[200px]">ចំណុចសរសើរ</th>
                  <th className="p-2.5 min-w-[200px]">ការកែលម្អ</th>
                  <th className="p-2.5 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st, idx) => {
                  const rec = getStudentTraineeRecord(st);
                  const summaryData = classSummaryRankings[st.id];
                  const s1Summary = computedClassScores.s1Map.get(st.id);
                  const s2Summary = computedClassScores.s2Map.get(st.id);
                  const annualSummary = computedClassScores.annualMap.get(st.id);

                  const s1Avg = rec.semesterAvgS1 ?? s1Summary?.semesterAverage ?? 0;
                  const s2Avg = rec.semesterAvgS2 ?? s2Summary?.semesterAverage ?? 0;
                  const annualAvg = rec.annualAvgOverride ?? annualSummary?.annualAverage ?? 0;
                  const rank = rec.annualRankOverride ?? summaryData?.annualRank ?? annualSummary?.rank ?? (idx + 1);
                  const isPass = annualAvg >= 5.0;

                  return (
                    <tr key={st.id} className="hover:bg-purple-50/30 transition">
                      <td className="p-2.5 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-purple-950 flex items-center gap-1.5">
                        <span>{st.name}</span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            st.gender === 'ស្រី' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {st.gender}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-mono font-semibold">{s1Avg.toFixed(2)}</td>
                      <td className="p-2.5 text-center font-mono font-semibold">{s2Avg.toFixed(2)}</td>
                      <td className="p-2.5 text-center font-mono font-black text-amber-900 bg-amber-50/50">
                        {annualAvg.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-purple-900">លេខ {rank}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={rec.praisePoints || ''}
                          onChange={(e) => {
                            const updated = {
                              ...traineeRecords,
                              [st.id]: {
                                ...rec,
                                studentId: st.id,
                                studentName: st.name,
                                gender: st.gender,
                                gradeLevel: teacher.grade || 'ថ្នាក់ទី ៦',
                                academicYear: activeYear,
                                praisePoints: e.target.value,
                              },
                            };
                            saveRecords(updated);
                          }}
                          className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={rec.improvementPoints || ''}
                          onChange={(e) => {
                            const updated = {
                              ...traineeRecords,
                              [st.id]: {
                                ...rec,
                                studentId: st.id,
                                studentName: st.name,
                                gender: st.gender,
                                gradeLevel: teacher.grade || 'ថ្នាក់ទី ៦',
                                academicYear: activeYear,
                                improvementPoints: e.target.value,
                              },
                            };
                            saveRecords(updated);
                          }}
                          className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => {
                            setSelectedStudentId(st.id);
                            setActiveViewMode('single_student');
                          }}
                          className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg text-[11px] font-bold transition"
                        >
                          មើលសៀវភៅ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= PRINT PREVIEW & PDF MODAL ================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <Printer className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-base">
                    {printScope === 'single'
                      ? `ផ្ទាំងគំរូបោះពុម្ពសៀវភៅសិក្ខាគារិក៖ ${currentStudent?.name}`
                      : `ផ្ទាំងគំរូបោះពុម្ពសៀវភៅសិក្ខាគារិកទាំងមូល (${students.length} នាក់)`}
                  </h3>
                  <p className="text-xs text-purple-200">
                    ទម្រង់ A4 Portrait ស្តង់ដារ (ទំព័រទី១ លទ្ធផលសិក្សា & ទំព័រទី២ ការវាយតម្លៃ និងមូលវិចារណ៍)
                  </p>
                </div>
              </div>

              {/* Modal Action Controls */}
              <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
                {/* Scope Switch */}
                <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/20 text-xs">
                  <button
                    onClick={() => setPrintScope('single')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      printScope === 'single' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-purple-100 hover:text-white'
                    }`}
                  >
                    សិស្សនេះ
                  </button>
                  <button
                    onClick={() => setPrintScope('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      printScope === 'all' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-purple-100 hover:text-white'
                    }`}
                  >
                    ទាំងថ្នាក់ ({students.length})
                  </button>
                </div>

                {/* Page Selection */}
                <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/20 text-xs">
                  <button
                    onClick={() => setPrintPageOption('both')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      printPageOption === 'both' ? 'bg-white text-purple-950 shadow-xs' : 'text-purple-100 hover:text-white'
                    }`}
                  >
                    ២ទំព័រ
                  </button>
                  <button
                    onClick={() => setPrintPageOption('page1')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      printPageOption === 'page1' ? 'bg-white text-purple-950 shadow-xs' : 'text-purple-100 hover:text-white'
                    }`}
                  >
                    ទំព័រ ១
                  </button>
                  <button
                    onClick={() => setPrintPageOption('page2')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      printPageOption === 'page2' ? 'bg-white text-purple-950 shadow-xs' : 'text-purple-100 hover:text-white'
                    }`}
                  >
                    ទំព័រ ២
                  </button>
                </div>

                {/* Print Trigger */}
                <button
                  onClick={() => handleDirectPrint(printScope, printPageOption)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>បោះពុម្ពភ្លាម</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Content Container */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 bg-slate-100 flex-1">
              {(printScope === 'single' ? [currentStudent] : students).filter(Boolean).map((st, sIdx) => {
                const rec = getStudentTraineeRecord(st);
                const annualSummary = computedClassScores.annualMap.get(st.id);
                const annualAvg = rec.annualAvgOverride ?? annualSummary?.annualAverage ?? 0;
                const isPass = annualAvg >= 5.0;

                return (
                  <div key={st.id} className="space-y-6">
                    {/* Page 1 Printable Sheet */}
                    {(printPageOption === 'both' || printPageOption === 'page1') && (
                      <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm text-slate-900 max-w-3xl mx-auto page-break-after">
                        {/* Top Emblem & Header */}
                        <div className="text-center space-y-1 mb-4">
                          <div className="font-moul text-sm text-slate-950">ព្រះរាជាណាចក្រកម្ពុជា</div>
                          <div className="font-moul text-xs text-slate-950">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                          <div className="text-xs font-bold text-slate-700 tracking-wider">— ༺ ៚ ༻ —</div>
                        </div>

                        <div className="text-center text-xs font-bold text-slate-800 mb-3 border-b pb-2">
                          គោត្តនាម និងនាមសិស្ស <span className="font-moul px-1">{st.name}</span> ភេទ <span className="px-1">{st.gender}</span> ថ្នាក់ទី <span className="px-1">{teacher.grade || 'ថ្នាក់ទី៦ក'}</span> ឆ្នាំសិក្សា <span className="px-1">{activeYear}</span>
                          <div className="font-moul text-sm text-slate-950 mt-1">លទ្ធផលនៃការសិក្សា</div>
                        </div>

                        {/* Subject Table */}
                        <table className="w-full text-[11px] border-collapse border border-slate-600 mb-4">
                          <thead>
                            <tr className="bg-slate-100 text-center font-bold">
                              <th rowSpan={2} className="border border-slate-600 p-1.5 text-left">មុខវិជ្ជា</th>
                              <th colSpan={2} className="border border-slate-600 p-1">ឆមាសទី ១</th>
                              <th colSpan={2} className="border border-slate-600 p-1">ឆមាសទី ២</th>
                              <th colSpan={2} className="border border-slate-600 p-1">ប្រចាំឆ្នាំ</th>
                              <th rowSpan={2} className="border border-slate-600 p-1 min-w-[80px]">មូលវិចារហត្ថលេខា និងឈ្មោះគ្រូ</th>
                            </tr>
                            <tr className="bg-slate-50 text-center font-bold text-[10px]">
                              <th className="border border-slate-600 p-0.5">ពិន្ទុ</th>
                              <th className="border border-slate-600 p-0.5">ចំ.ថ្នាក់</th>
                              <th className="border border-slate-600 p-0.5">ពិន្ទុ</th>
                              <th className="border border-slate-600 p-0.5">ចំ.ថ្នាក់</th>
                              <th className="border border-slate-600 p-0.5">ម.ភាគ</th>
                              <th className="border border-slate-600 p-0.5">ចំ.ថ្នាក់</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeSubjectsList.map((sub) => {
                              const studentSubData = allStudentSubjectData[st.id]?.[sub.id] || { s1: 0, s2: 0, annual: 0, s1Rank: 1, s2Rank: 1, annualRank: 1 };
                              const override = rec?.subjectOverrides?.[sub.id];
                              const s1Score = override?.s1 !== undefined ? override.s1 : studentSubData.s1;
                              const s2Score = override?.s2 !== undefined ? override.s2 : studentSubData.s2;
                              const annualScore = override?.annual !== undefined ? override.annual : studentSubData.annual;
                              const s1Rank = override?.s1Rank !== undefined ? override.s1Rank : studentSubData.s1Rank;
                              const s2Rank = override?.s2Rank !== undefined ? override.s2Rank : studentSubData.s2Rank;
                              const annualRank = override?.annualRank !== undefined ? override.annualRank : studentSubData.annualRank;

                              return (
                                <tr key={sub.id}>
                                  <td className="border border-slate-600 p-1 font-medium">{sub.name}</td>
                                  <td className="border border-slate-600 p-1 text-center font-mono">{s1Score.toFixed(2)}</td>
                                  <td className="border border-slate-600 p-1 text-center font-mono">{s1Rank}</td>
                                  <td className="border border-slate-600 p-1 text-center font-mono">{s2Score.toFixed(2)}</td>
                                  <td className="border border-slate-600 p-1 text-center font-mono">{s2Rank}</td>
                                  <td className="border border-slate-600 p-1 text-center font-mono font-bold">{annualScore.toFixed(2)}</td>
                                  <td className="border border-slate-600 p-1 text-center font-mono font-bold">{annualRank}</td>
                                  <td className="border border-slate-600 p-1"></td>
                                </tr>
                              );
                            })}
                            {(() => {
                              const summaryData = classSummaryRankings[st.id];
                              const s1Summary = computedClassScores.s1Map.get(st.id);
                              const s2Summary = computedClassScores.s2Map.get(st.id);
                              const annualSummary = computedClassScores.annualMap.get(st.id);

                              const s1Letter = s1Summary?.classification?.letter || ((rec.semesterAvgS1 || 0) > 0 ? getGradeClassification(rec.semesterAvgS1 || 0, effectiveGradeThresholds).letter : '-');
                              const s2Letter = s2Summary?.classification?.letter || ((rec.semesterAvgS2 || 0) > 0 ? getGradeClassification(rec.semesterAvgS2 || 0, effectiveGradeThresholds).letter : '-');
                              const annualLetter = (rec.annualAvgOverride !== undefined && rec.annualAvgOverride > 0)
                                ? getGradeClassification(rec.annualAvgOverride, effectiveGradeThresholds).letter
                                : (annualSummary?.classification?.letter || ((rec.annualAvgOverride || annualSummary?.annualAvg || 0) > 0 ? getGradeClassification(rec.annualAvgOverride || annualSummary?.annualAvg || 0, effectiveGradeThresholds).letter : '-'));

                              return (
                                <>
                                  <tr className="bg-slate-100 font-bold">
                                    <td className="border border-slate-600 p-1">សរុបពិន្ទុប្រឡងឆមាស</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{rec.examTotalS1?.toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{summaryData?.s1ExamTotalRank || 1}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{rec.examTotalS2?.toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{summaryData?.s2ExamTotalRank || 1}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-bold">{(((rec.examTotalS1 || 0) + (rec.examTotalS2 || 0)) / 2).toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-bold">{summaryData?.annualExamTotalRank || 1}</td>
                                    <td className="border border-slate-600 p-1"></td>
                                  </tr>
                                  <tr className="bg-slate-100 font-bold">
                                    <td className="border border-slate-600 p-1">មធ្យមភាគពិន្ទុប្រឡងឆមាស</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{rec.examAvgS1?.toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{summaryData?.s1ExamAvgRank || 1}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{rec.examAvgS2?.toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{summaryData?.s2ExamAvgRank || 1}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-bold">{(((rec.examAvgS1 || 0) + (rec.examAvgS2 || 0)) / 2).toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-bold">{summaryData?.annualExamAvgRank || 1}</td>
                                    <td className="border border-slate-600 p-1"></td>
                                  </tr>
                                  <tr className="bg-slate-100 font-bold">
                                    <td className="border border-slate-600 p-1">មធ្យមភាគពិន្ទុខែប្រចាំឆមាស</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{rec.monthlyAvgS1?.toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{summaryData?.s1MonthlyMeanRank || 1}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{rec.monthlyAvgS2?.toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono">{summaryData?.s2MonthlyMeanRank || 1}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-bold">{(((rec.monthlyAvgS1 || 0) + (rec.monthlyAvgS2 || 0)) / 2).toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-bold">{summaryData?.annualMonthlyMeanRank || 1}</td>
                                    <td className="border border-slate-600 p-1"></td>
                                  </tr>
                                  <tr className="bg-amber-50 font-black">
                                    <td className="border border-slate-600 p-1 font-black">មធ្យមភាគប្រចាំឆមាស & ប្រចាំឆ្នាំ</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-black">{rec.semesterAvgS1?.toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-black">{summaryData?.s1SemesterRank || s1Summary?.rank || 1}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-black">{rec.semesterAvgS2?.toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-black">{summaryData?.s2SemesterRank || s2Summary?.rank || 1}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-black">{rec.annualAvgOverride?.toFixed(2)}</td>
                                    <td className="border border-slate-600 p-1 text-center font-mono font-black">{rec.annualRankOverride || summaryData?.annualRank || annualSummary?.rank || 1}</td>
                                    <td className="border border-slate-600 p-1 text-center text-[10px] text-emerald-800 font-bold">
                                      {((rec.annualAvgOverride || 0) >= 5.0 ? 'ជាប់' : 'ធ្លាក់')}
                                    </td>
                                  </tr>
                                  <tr className="bg-slate-50 font-bold">
                                    <td className="border border-slate-600 p-1">និទ្ទេស</td>
                                    <td colSpan={2} className="border border-slate-600 p-1 text-center font-bold text-slate-800 text-sm">
                                      {s1Letter}
                                    </td>
                                    <td colSpan={2} className="border border-slate-600 p-1 text-center font-bold text-slate-800 text-sm">
                                      {s2Letter}
                                    </td>
                                    <td colSpan={2} className="border border-slate-600 p-1 text-center font-bold text-amber-950 text-sm">
                                      {annualLetter}
                                    </td>
                                    <td className="border border-slate-600 p-1 text-center font-bold">
                                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${((rec.annualAvgOverride || 0) >= 5.0) ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                                        {((rec.annualAvgOverride || 0) >= 5.0) ? 'ឡើងថ្នាក់' : 'ត្រួតថ្នាក់'}
                                      </span>
                                    </td>
                                  </tr>
                                </>
                              );
                            })()}
                          </tbody>
                        </table>

                        {/* Absences */}
                        <div className="space-y-1">
                          <div className="text-center font-moul text-xs">ចំនួនអវត្តមានក្នុងឆ្នាំសិក្សា</div>
                          <table className="w-full text-[11px] border-collapse border border-slate-600">
                            <thead>
                              <tr className="bg-slate-100 text-center font-bold">
                                <th className="border border-slate-600 p-1 text-left">អវត្តមាន</th>
                                <th className="border border-slate-600 p-1">ឆមាសទី ១</th>
                                <th className="border border-slate-600 p-1">ឆមាសទី ២</th>
                                <th className="border border-slate-600 p-1">ប្រចាំឆ្នាំ</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-slate-600 p-1">- មានច្បាប់</td>
                                <td className="border border-slate-600 p-1 text-center font-mono">{rec.absentExcusedS1 ?? 0}</td>
                                <td className="border border-slate-600 p-1 text-center font-mono">{rec.absentExcusedS2 ?? 0}</td>
                                <td className="border border-slate-600 p-1 text-center font-mono font-bold">{rec.absentExcusedAnnual ?? 0}</td>
                              </tr>
                              <tr>
                                <td className="border border-slate-600 p-1">- ឥតច្បាប់</td>
                                <td className="border border-slate-600 p-1 text-center font-mono">{rec.absentUnexcusedS1 ?? 0}</td>
                                <td className="border border-slate-600 p-1 text-center font-mono">{rec.absentUnexcusedS2 ?? 0}</td>
                                <td className="border border-slate-600 p-1 text-center font-mono font-bold">{rec.absentUnexcusedAnnual ?? 0}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Page 2 Printable Sheet */}
                    {(printPageOption === 'both' || printPageOption === 'page2') && (
                      <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm text-slate-900 max-w-3xl mx-auto page-break-after">
                        <div className="text-center text-xs font-bold text-slate-800 mb-3 border-b pb-2">
                          គ្រឹះស្ថានសិក្សា <span className="font-moul px-1">{teacher.school || 'សាលាបឋមសិក្សា'}</span> ចំនួនសិស្សក្នុងថ្នាក់ <span className="font-bold">{students.length} នាក់</span>
                        </div>

                        {/* 1. Evaluation */}
                        <div className="space-y-1 mb-3">
                          <div className="text-center font-moul text-xs">ការវាយតម្លៃ</div>
                          <table className="w-full text-[11px] border-collapse border border-slate-600">
                            <thead>
                              <tr className="bg-slate-100 text-center font-bold">
                                <th className="border border-slate-600 p-1 text-left w-2/5">ផ្នែកទាំង ៤</th>
                                <th className="border border-slate-600 p-1">ឆមាសទី ១</th>
                                <th className="border border-slate-600 p-1">ឆមាសទី ២</th>
                                <th className="border border-slate-600 p-1">ប្រចាំឆ្នាំ</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-slate-600 p-1 font-medium">១. ការសិក្សា</td>
                                <td className="border border-slate-600 p-1 text-center">{rec.evalStudyS1}</td>
                                <td className="border border-slate-600 p-1 text-center">{rec.evalStudyS2}</td>
                                <td className="border border-slate-600 p-1 text-center font-bold">{rec.evalStudyAnnual}</td>
                              </tr>
                              <tr>
                                <td className="border border-slate-600 p-1 font-medium">២. សីលធម៌រស់នៅ</td>
                                <td className="border border-slate-600 p-1 text-center">{rec.evalMoralS1}</td>
                                <td className="border border-slate-600 p-1 text-center">{rec.evalMoralS2}</td>
                                <td className="border border-slate-600 p-1 text-center font-bold">{rec.evalMoralAnnual}</td>
                              </tr>
                              <tr>
                                <td className="border border-slate-600 p-1 font-medium">៣. ពលកម្ម-បង្កបង្កើតផល</td>
                                <td className="border border-slate-600 p-1 text-center">{rec.evalLaborS1}</td>
                                <td className="border border-slate-600 p-1 text-center">{rec.evalLaborS2}</td>
                                <td className="border border-slate-600 p-1 text-center font-bold">{rec.evalLaborAnnual}</td>
                              </tr>
                              <tr>
                                <td className="border border-slate-600 p-1 font-medium">៤. សុខភាព-អនាម័យ</td>
                                <td className="border border-slate-600 p-1 text-center">{rec.evalHealthS1}</td>
                                <td className="border border-slate-600 p-1 text-center">{rec.evalHealthS2}</td>
                                <td className="border border-slate-600 p-1 text-center font-bold">{rec.evalHealthAnnual}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* 2. លទ្ធផលនៃការប្រឡងបញ្ចប់ឆ្នាំសិក្សា */}
                        {(() => {
                          const summaryData = classSummaryRankings[st.id];
                          const annualSummary = computedClassScores.annualMap.get(st.id);
                          const sem1Val = rec.semesterAvgS1 || 0;
                          const sem2Val = rec.semesterAvgS2 || 0;
                          const computedAnnualFromSemesters = (sem1Val > 0 && sem2Val > 0)
                            ? Number(((sem1Val + sem2Val) / 2).toFixed(2))
                            : (sem2Val > 0 ? sem2Val : sem1Val);

                          const annualAvg = (rec.annualAvgOverride !== undefined && rec.annualAvgOverride > 0)
                            ? rec.annualAvgOverride
                            : (computedAnnualFromSemesters > 0 ? computedAnnualFromSemesters : (summaryData?.metrics?.annualAvg ?? annualSummary?.annualAvg ?? 0));
                          const annualRank = rec.annualRankOverride || summaryData?.annualRank || annualSummary?.rank || 1;
                          const isPass = annualAvg >= 5.0;
                          const annualLetter = annualAvg > 0 ? getGradeClassification(annualAvg, effectiveGradeThresholds).letter : '-';
                          const currentGrade = rec.gradeLevel || teacher.grade || 'ថ្នាក់ទី ៦';
                          const nextGrade = getNextGradeLabel(currentGrade);
                          const promotionGrade = rec.yearEndPromotionGrade || nextGrade;
                          const repeatGrade = rec.yearEndRepeatGrade || currentGrade;
                          const retestSubjects = rec.retestSubjects && rec.retestSubjects.length > 0 ? rec.retestSubjects : ['ភាសាខ្មែរ', 'គណិតវិទ្យា'];
                          const retestDate = rec.retestDate || '';
                          const retestAvg = rec.retestAvgScore || '';
                          const retestResult = rec.retestResult || '';

                          return (
                            <div className="border border-slate-600 p-2 mb-4 text-xs bg-slate-50/50 rounded">
                              <div className="text-center font-moul text-xs mb-1 text-slate-900">
                                លទ្ធផលនៃការប្រឡងបញ្ចប់ឆ្នាំសិក្សា {rec.academicYear || activeYear}
                              </div>
                              {isPass ? (
                                <div className="space-y-1.5 p-2 bg-white rounded border border-slate-200">
                                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                                    <div>- <strong>មធ្យមភាគប្រចាំឆ្នាំ៖</strong> <span className="font-bold text-slate-900">{annualAvg > 0 ? annualAvg.toFixed(2) : '.........'}</span></div>
                                    <div>- <strong>ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ៖</strong> <span className="font-bold text-slate-900">{annualAvg > 0 ? `លេខ ${annualRank}` : '.........'}</span></div>
                                    <div>- <strong>និទ្ទេស៖</strong> <span className="font-bold text-slate-900">{annualLetter}</span></div>
                                  </div>
                                  <div className="pt-1 border-t border-slate-200 text-[11px] font-bold text-slate-900">
                                    - <strong>ត្រូវបានឡើង{promotionGrade}</strong>
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                  <div className="border-r border-dashed border-slate-400 pr-2 space-y-1 text-[11px]">
                                    <div>- <strong>មធ្យមភាគប្រចាំឆ្នាំ៖</strong> <span className="font-bold text-slate-900">{annualAvg > 0 ? annualAvg.toFixed(2) : '.........'}</span></div>
                                    <div>- <strong>ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ៖</strong> <span className="font-bold text-slate-900">{annualAvg > 0 ? `លេខ ${annualRank}` : '.........'}</span></div>
                                    <div>- <strong>និទ្ទេស៖</strong> <span className="font-bold text-slate-900">{annualLetter}</span></div>
                                    <div className="pt-1 border-t border-slate-300">
                                      <div className="font-bold text-slate-900">
                                        - <strong>ត្រូវបានឡើង{promotionGrade}</strong>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="pl-1 space-y-1 text-[11px]">
                                    <div className="font-bold text-rose-800">
                                      - <strong>ត្រូវធ្វើតេស្តឡើងថ្នាក់</strong>
                                    </div>
                                    <div className="font-bold text-slate-900">- <strong>មុខវិជ្ជាធ្វើតេស្តឡើងថ្នាក់៖</strong></div>
                                    <div className="pl-2 space-y-0.5">
                                      <div>• <strong>កាលបរិច្ឆេទ៖</strong> <span>{retestDate || '................................'}</span></div>
                                      <div>• <strong>មុខវិជ្ជាតេស្ត៖</strong> <span>{retestSubjects.join(', ')}</span></div>
                                      <div>• <strong>មធ្យមភាគទទួលបាន៖</strong> <span>{retestAvg || '................'}</span></div>
                                      <div className="text-[10.5px]">• <strong>លទ្ធផល៖</strong> {
                                        retestResult === 'ជាប់'
                                          ? <span className="font-bold text-emerald-800">ជាប់ (ត្រូវបានឡើង{promotionGrade})</span>
                                          : retestResult === 'ធ្លាក់'
                                            ? <span className="font-bold text-rose-800">ធ្លាក់ (ត្រូវរៀនត្រួត{repeatGrade})</span>
                                            : `ជាប់ (ត្រូវបានឡើង${promotionGrade}) ឬ ធ្លាក់ (ត្រូវរៀនត្រួត${repeatGrade})`
                                      }</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* 4. Signatures & Remarks */}
                        <div className="grid grid-cols-2 gap-4 text-xs items-start">
                          {/* Teacher (Left/First) */}
                          <div className="space-y-1">
                            <div className="text-center">
                              <div className="font-semibold text-purple-950 text-[11px]">{rec.docDateLunar || defaultLunarDate}</div>
                              <div className="text-slate-600 text-[10.5px]">{rec.docDateSolar || defaultSolarDate}</div>
                              <div className="font-moul text-xs mt-1">មូលវិចារណ៍ គ្រូបន្ទុកថ្នាក់</div>
                            </div>
                            <div className="text-[11px] space-y-1 bg-purple-50/40 p-2 rounded border border-purple-200">
                              <div>
                                <strong>ចំណុចសរសើរ៖</strong> {rec.praisePoints}
                              </div>
                              <div>
                                <strong>ការកែលម្អ៖</strong> {rec.improvementPoints}
                              </div>
                            </div>
                            <div className="pt-4 text-center font-bold">
                              {rec.teacherName || teacher.name || 'គ្រូបន្ទុកថ្នាក់'}
                            </div>
                          </div>

                          {/* Principal (Right/Second - situated slightly below) */}
                          <div className="space-y-1 mt-6">
                            <div className="text-center">
                              <div className="font-semibold text-purple-950 text-[11px]">{rec.docDateLunar || defaultLunarDate}</div>
                              <div className="text-slate-600 text-[10.5px]">{rec.docDateSolar || defaultSolarDate}</div>
                              <div className="font-moul text-xs mt-1">មូលវិចារណ៍ នាយក</div>
                            </div>
                            <p className="text-[11px] leading-relaxed italic bg-slate-50 p-2 rounded border border-slate-200">
                              {rec.principalOpinion}
                            </p>
                            <div className="pt-8 text-center font-bold">
                              {rec.principalName || 'នាយកសាលា'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
