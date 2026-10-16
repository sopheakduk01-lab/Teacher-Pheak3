/**
 * academicYearStorage.ts
 * Manages per-academic-year data isolation, persistence, cloning, and backup/restore
 * for Cambodian Primary School Teachers.
 */

import {
  TeacherProfile,
  Student,
  AttendanceDatabase,
  GradeDatabase,
  LogbookEntry,
  InventoryItem,
  PLCMeeting,
  Quiz,
  LibraryBook,
  BookBorrowingRecord,
} from '../types';
import {
  initialTeacherProfile,
  initialStudents,
  initialAttendance,
  initialGrades,
  initialLogbook,
  initialInventory,
  initialPLC,
  initialQuizzes,
  initialLibraryBooks,
} from '../data/initialData';
import { getAllMathLessonQuizItems } from '../data/mathLessonQcm';

export const DEFAULT_ACADEMIC_YEARS = [
  '២០២៣ - ២០២៤',
  '២០២៤ - ២០២៥',
  '២០២៥ - ២០២៦',
  '២០២៦ - ២០២៧',
  '២០២៧ - ២០២៨',
];

export const DEFAULT_ACTIVE_YEAR = '២០២៥ - ២០២៦';

const STORAGE_PREFIX = 'moeys_teacher_year_data_v1';
const YEARS_LIST_KEY = 'moeys_teacher_academic_years_list_v1';
const ACTIVE_YEAR_KEY = 'moeys_teacher_active_academic_year_v1';
const LEGACY_STORAGE_KEY = 'primary_teacher_admin_v2';

/**
 * Normalizes year string into safe localStorage key suffix
 */
export function normalizeYearKey(year: string): string {
  if (!year) return 'default_year';
  // replace non-alphanumeric/khmer characters safely or encode
  return encodeURIComponent(year.trim().replace(/\s+/g, '_'));
}

/**
 * Get the list of all configured academic years
 */
export function getAcademicYearsList(): string[] {
  try {
    const saved = localStorage.getItem(YEARS_LIST_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading academic years list:', err);
  }
  return DEFAULT_ACADEMIC_YEARS;
}

/**
 * Save academic years list
 */
export function saveAcademicYearsList(years: string[]): void {
  try {
    const unique = Array.from(new Set(years.map((y) => y.trim()))).filter(Boolean);
    localStorage.setItem(YEARS_LIST_KEY, JSON.stringify(unique));
  } catch (err) {
    console.error('Error saving academic years list:', err);
  }
}

/**
 * Get active academic year
 */
export function getActiveAcademicYear(): string {
  try {
    const active = localStorage.getItem(ACTIVE_YEAR_KEY);
    if (active && active.trim()) {
      return active.trim();
    }
  } catch (err) {
    console.error('Error getting active academic year:', err);
  }
  return DEFAULT_ACTIVE_YEAR;
}

/**
 * Set active academic year
 */
export function setActiveAcademicYear(year: string): void {
  try {
    const trimmed = year.trim();
    localStorage.setItem(ACTIVE_YEAR_KEY, trimmed);

    // Make sure year is in the list
    const currentList = getAcademicYearsList();
    if (!currentList.includes(trimmed)) {
      saveAcademicYearsList([...currentList, trimmed]);
    }
  } catch (err) {
    console.error('Error setting active academic year:', err);
  }
}

/**
 * Generate full localStorage key for a specific year and dataType
 */
export function getYearScopedStorageKey(year: string, dataType: string): string {
  const norm = normalizeYearKey(year);
  return `${STORAGE_PREFIX}_${norm}_${dataType}`;
}

/**
 * Automatically cleans up bloated legacy/redundant keys from localStorage
 * to free up space (specifically heavy duplicates of the 20 math lesson quizzes).
 */
export function cleanupBloatedStorage(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const keysToClean: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.endsWith('_quizzes') ||
          key.includes('primary_school_quizzes') ||
          key === 'primary_teacher_admin_v2_quizzes')
      ) {
        keysToClean.push(key);
      }
    }

    for (const key of keysToClean) {
      try {
        const raw = localStorage.getItem(key);
        if (raw && raw.includes('quiz-math-lesson')) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            // Strip out built-in math lesson quizzes to save ~400KB per key
            const slim = parsed.filter(
              (q: any) => !q.id || !String(q.id).startsWith('quiz-math-lesson')
            );
            localStorage.setItem(key, JSON.stringify(slim));
          }
        }
      } catch {
        // If cannot re-save, remove key so it safely falls back to code defaults
        try {
          localStorage.removeItem(key);
        } catch {}
      }
    }
  } catch (err) {
    console.warn('Storage cleanup notice:', err);
  }
}

/**
 * Prunes non-critical duplicate caches if quota is tight
 */
export function pruneNonEssentialStorage(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const redundantKeys = [
      'primary_school_quizzes',
      'primary_teacher_admin_v2_quizzes',
      'school_sub_scores_db',
      'school_custom_sub_subjects_v1',
    ];

    for (const k of redundantKeys) {
      try {
        localStorage.removeItem(k);
      } catch {}
    }
  } catch {}
}

// Run initial storage cleanup immediately
if (typeof window !== 'undefined') {
  try {
    cleanupBloatedStorage();
  } catch {}
}

/**
 * Load data for a specific year and dataType with fallback
 */
export function loadYearScopedData<T>(year: string, dataType: string, fallback: T): T {
  try {
    const key = getYearScopedStorageKey(year, dataType);
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      return JSON.parse(saved);
    }

    // Check if this is the default year and legacy data exists
    if (year === DEFAULT_ACTIVE_YEAR || year === '២០២៥ - ២០២៦' || year === '២០២៥-២០២៦') {
      const legacyKey = `${LEGACY_STORAGE_KEY}_${dataType}`;
      const legacySaved = localStorage.getItem(legacyKey);
      if (legacySaved !== null) {
        try {
          const parsedLegacy = JSON.parse(legacySaved);
          // save into new format for future
          try {
            localStorage.setItem(key, legacySaved);
          } catch {}
          return parsedLegacy;
        } catch {
          // ignore
        }
      }
    }
  } catch (err) {
    console.warn(`Notice loading year data for ${year}/${dataType}:`, err);
  }
  return fallback;
}

/**
 * Save data for a specific year and dataType safely with quota management
 */
export function saveYearScopedData<T>(year: string, dataType: string, data: T): void {
  try {
    const key = getYearScopedStorageKey(year, dataType);

    // If saving quizzes, filter out static built-in math lesson quizzes (~410KB) to preserve quota.
    // They are automatically re-hydrated on load from ALL_MATH_LESSONS_PACKAGES.
    let dataToStore = data;
    if (dataType === 'quizzes' && Array.isArray(data)) {
      dataToStore = data.filter(
        (q: any) => !q.id || !String(q.id).startsWith('quiz-math-lesson')
      ) as unknown as T;
    }

    const serialized = JSON.stringify(dataToStore);

    try {
      localStorage.setItem(key, serialized);
    } catch (writeErr: any) {
      const isQuotaError =
        writeErr?.name === 'QuotaExceededError' ||
        writeErr?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        writeErr?.code === 22 ||
        writeErr?.code === 1014 ||
        (writeErr?.message && writeErr.message.toLowerCase().includes('quota'));

      if (isQuotaError) {
        console.warn(`[Storage Quota] Storage quota reached while saving ${year}/${dataType}. Running automatic cleanup...`);
        cleanupBloatedStorage();
        pruneNonEssentialStorage();
        try {
          localStorage.setItem(key, serialized);
          return;
        } catch (retryErr) {
          console.warn(`[Storage Quota] Retrying after pruning failed for ${year}/${dataType}. Keeping data active in memory.`);
          return;
        }
      }
      throw writeErr;
    }
  } catch (err) {
    console.warn(`Notice saving year data for ${year}/${dataType}:`, err);
  }
}

/**
 * Load complete dataset bundle for a given academic year
 */
export interface AcademicYearDataBundle {
  year: string;
  teacher: TeacherProfile;
  students: Student[];
  attendance: AttendanceDatabase;
  grades: GradeDatabase;
  logbook: LogbookEntry[];
  inventory: InventoryItem[];
  plc: PLCMeeting[];
  quizzes: Quiz[];
  libraryBooks?: LibraryBook[];
  borrowingRecords?: BookBorrowingRecord[];
  // Section 1: Students, Grading & Monitoring Extensions
  subScores?: Record<string, Record<number, Record<string, number>>>;
  activeSubSubjects?: string[];
  customSubSubjects?: any[];
  gradeThresholds?: { A: number; B: number; C: number; D: number; E: number };
  selectedS1Months?: string[];
  selectedS2Months?: string[];
  showMainSubjects?: boolean;
  monitoringPeriodSubSubjects?: any;
  studentPins?: Record<string, string>;
  practicumTrainees?: any[];
  // Section 2: Teaching Preparations (Timetable, Syllabus, Lesson Plans, Slides)
  timetable?: any;
  syllabus?: any;
  lessonPlans?: any[];
  customSlideDecks?: any[];
  // Section 3: Classroom Management & Materials (Inventory, Seating, Rules, Decoration)
  seatingLayout?: any;
  classroomRules?: any[];
  classroomDecoration?: any;
  // Section 4: Professional Development & Community (PLC, Agreements, Committee, CPD, Letters)
  teacherParentAgreements?: any[];
  teacherPrincipalAgreement?: any;
  classroomCommittee?: any;
  cpdRecords?: any[];
  customLetters?: any[];
  // MoEYS PRI Statistics Extension
  priFormData?: any;
  priLiveSyncActive?: boolean;
  lastModified?: number;
  updatedAt?: string;
}

export function loadCompleteYearBundle(year: string, fallbackTeacherBase?: TeacherProfile): AcademicYearDataBundle {
  const defaultTeacher: TeacherProfile = fallbackTeacherBase
    ? { ...fallbackTeacherBase, academicYear: year }
    : { ...initialTeacherProfile, academicYear: year };

  const teacher = loadYearScopedData<TeacherProfile>(year, 'teacher', defaultTeacher);
  // Ensure academic year on teacher profile is synced
  teacher.academicYear = year;

  const students = loadYearScopedData<Student[]>(year, 'students', year === DEFAULT_ACTIVE_YEAR ? initialStudents : []);
  const attendance = loadYearScopedData<AttendanceDatabase>(year, 'attendance', year === DEFAULT_ACTIVE_YEAR ? initialAttendance : {});
  const grades = loadYearScopedData<GradeDatabase>(year, 'grades', year === DEFAULT_ACTIVE_YEAR ? initialGrades : {});
  const logbook = loadYearScopedData<LogbookEntry[]>(year, 'logbook', year === DEFAULT_ACTIVE_YEAR ? initialLogbook : []);
  const inventory = loadYearScopedData<InventoryItem[]>(year, 'inventory', initialInventory);
  const plc = loadYearScopedData<PLCMeeting[]>(year, 'plc', year === DEFAULT_ACTIVE_YEAR ? initialPLC : []);
  const rawQuizzes = loadYearScopedData<Quiz[]>(year, 'quizzes', initialQuizzes);
  const mathQuizzes = getAllMathLessonQuizItems();
  const nonMathQuizzes = (rawQuizzes || []).filter(
    (q) => !q.id || !String(q.id).startsWith('quiz-math-lesson')
  );
  // Guarantee essential default curriculum quizzes (Health, English, etc.) are always present even with old cached localStorage
  const existingIds = new Set(nonMathQuizzes.map((q) => q.id));
  const missingDefaults = (initialQuizzes || []).filter(
    (q) => !String(q.id).startsWith('quiz-math-lesson') && !existingIds.has(q.id)
  );
  const quizzes: Quiz[] = [...mathQuizzes, ...missingDefaults, ...nonMathQuizzes];
  const libraryBooks = loadYearScopedData<LibraryBook[]>(year, 'library_books', initialLibraryBooks);
  const borrowingRecords = loadYearScopedData<BookBorrowingRecord[]>(year, 'borrowing_records', []);

  // Section 1 Extensions
  const subScores = loadYearScopedData<Record<string, Record<number, Record<string, number>>> | undefined>(year, 'sub_scores', undefined) 
    || (() => {
      try {
        const saved = localStorage.getItem('school_sub_scores_db');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const activeSubSubjects = loadYearScopedData<string[] | undefined>(year, 'active_sub_subjects', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('school_active_sub_subjects');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const customSubSubjects = loadYearScopedData<any[] | undefined>(year, 'custom_sub_subjects', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('school_custom_sub_subjects_v1');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const gradeThresholds = loadYearScopedData<any>(year, 'grade_thresholds', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('school_grade_thresholds');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const selectedS1Months = loadYearScopedData<string[] | undefined>(year, 'selected_s1_months', undefined);
  const selectedS2Months = loadYearScopedData<string[] | undefined>(year, 'selected_s2_months', undefined);
  const showMainSubjects = loadYearScopedData<boolean | undefined>(year, 'show_main_subjects', undefined);
  const monitoringPeriodSubSubjects = loadYearScopedData<any>(year, 'monitoring_period_sub_subjects', undefined);
  
  const studentPins = loadYearScopedData<Record<string, string> | undefined>(year, 'student_pins', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('school_student_pins_v1');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const practicumTrainees = loadYearScopedData<any[] | undefined>(year, 'practicum_trainees', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('primary_practicum_trainees_v1');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  // Section 2 Extensions (Timetable & Syllabus)
  const timetable = loadYearScopedData<any>(year, 'timetable', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('primary_teacher_custom_timetable_v1');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const syllabus = loadYearScopedData<any>(year, 'syllabus', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('primary_teacher_custom_syllabuses_v2');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const lessonPlans = loadYearScopedData<any[] | undefined>(year, 'lesson_plans', undefined);
  const customSlideDecks = loadYearScopedData<any[] | undefined>(year, 'custom_slide_decks', undefined);

  // Section 3 Extensions (Seating Layout, Rules, Decor)
  const seatingLayout = loadYearScopedData<any>(year, 'classroom_seating_layout', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('primary_classroom_seating_layout_v1');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const classroomRules = loadYearScopedData<any[] | undefined>(year, 'classroom_rules', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('primary_classroom_rules_v1');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const classroomDecoration = loadYearScopedData<any>(year, 'classroom_decoration', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('primary_classroom_decor_v1');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  // Section 4 Extensions (Agreements, Committee, CPD, Letters)
  const teacherParentAgreements = loadYearScopedData<any[] | undefined>(year, 'teacher_parent_agreements', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('primary_teacher_parent_agreements_v1');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const teacherPrincipalAgreement = loadYearScopedData<any>(year, 'teacher_principal_agreement', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('primary_teacher_principal_agreement_v1');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const classroomCommittee = loadYearScopedData<any>(year, 'classroom_committee', undefined)
    || (() => {
      try {
        const saved = localStorage.getItem('primary_classroom_committee_v1');
        return saved ? JSON.parse(saved) : undefined;
      } catch { return undefined; }
    })();

  const cpdRecords = loadYearScopedData<any[] | undefined>(year, 'cpd_records', undefined);
  const customLetters = loadYearScopedData<any[] | undefined>(year, 'custom_letters', undefined);
  const priFormData = loadYearScopedData<any>(year, 'moeys_pri_form_data', undefined);
  const priLiveSyncActive = loadYearScopedData<boolean | undefined>(year, 'moeys_pri_live_sync_active', undefined);
  const lastModified = loadYearScopedData<number | undefined>(year, 'last_modified', undefined);

  return {
    year,
    teacher,
    students,
    attendance,
    grades,
    logbook,
    inventory,
    plc,
    quizzes,
    libraryBooks,
    borrowingRecords,
    subScores,
    activeSubSubjects,
    customSubSubjects,
    gradeThresholds,
    selectedS1Months,
    selectedS2Months,
    showMainSubjects,
    monitoringPeriodSubSubjects,
    studentPins,
    practicumTrainees,
    timetable,
    syllabus,
    lessonPlans,
    customSlideDecks,
    seatingLayout,
    classroomRules,
    classroomDecoration,
    teacherParentAgreements,
    teacherPrincipalAgreement,
    classroomCommittee,
    cpdRecords,
    customLetters,
    priFormData,
    priLiveSyncActive,
    lastModified,
  };
}

/**
 * Save complete dataset bundle for a given academic year
 */
export function saveCompleteYearBundle(bundle: AcademicYearDataBundle): void {
  const year = bundle.year;
  saveYearScopedData(year, 'teacher', bundle.teacher);
  saveYearScopedData(year, 'students', bundle.students);
  saveYearScopedData(year, 'attendance', bundle.attendance);
  saveYearScopedData(year, 'grades', bundle.grades);
  saveYearScopedData(year, 'logbook', bundle.logbook);
  saveYearScopedData(year, 'inventory', bundle.inventory);
  saveYearScopedData(year, 'plc', bundle.plc);
  saveYearScopedData(year, 'quizzes', bundle.quizzes);
  if (bundle.libraryBooks) {
    saveYearScopedData(year, 'library_books', bundle.libraryBooks);
  }
  if (bundle.borrowingRecords) {
    saveYearScopedData(year, 'borrowing_records', bundle.borrowingRecords);
  }

  // Section 1 Saves
  if (bundle.subScores) {
    saveYearScopedData(year, 'sub_scores', bundle.subScores);
    try { localStorage.setItem('school_sub_scores_db', JSON.stringify(bundle.subScores)); } catch {}
  }
  if (bundle.activeSubSubjects) {
    saveYearScopedData(year, 'active_sub_subjects', bundle.activeSubSubjects);
    try { localStorage.setItem('school_active_sub_subjects', JSON.stringify(bundle.activeSubSubjects)); } catch {}
  }
  if (bundle.customSubSubjects) {
    saveYearScopedData(year, 'custom_sub_subjects', bundle.customSubSubjects);
    try { localStorage.setItem('school_custom_sub_subjects_v1', JSON.stringify(bundle.customSubSubjects)); } catch {}
  }
  if (bundle.gradeThresholds) {
    saveYearScopedData(year, 'grade_thresholds', bundle.gradeThresholds);
    try { localStorage.setItem('school_grade_thresholds', JSON.stringify(bundle.gradeThresholds)); } catch {}
  }
  if (bundle.selectedS1Months) {
    saveYearScopedData(year, 'selected_s1_months', bundle.selectedS1Months);
    try { localStorage.setItem('school_selected_s1_months', JSON.stringify(bundle.selectedS1Months)); } catch {}
  }
  if (bundle.selectedS2Months) {
    saveYearScopedData(year, 'selected_s2_months', bundle.selectedS2Months);
    try { localStorage.setItem('school_selected_s2_months', JSON.stringify(bundle.selectedS2Months)); } catch {}
  }
  if (bundle.showMainSubjects !== undefined) {
    saveYearScopedData(year, 'show_main_subjects', bundle.showMainSubjects);
    try { localStorage.setItem('school_show_main_subjects', JSON.stringify(bundle.showMainSubjects)); } catch {}
  }
  if (bundle.monitoringPeriodSubSubjects) {
    saveYearScopedData(year, 'monitoring_period_sub_subjects', bundle.monitoringPeriodSubSubjects);
    try { localStorage.setItem('school_monitoring_period_sub_subjects', JSON.stringify(bundle.monitoringPeriodSubSubjects)); } catch {}
  }
  if (bundle.studentPins) {
    saveYearScopedData(year, 'student_pins', bundle.studentPins);
    try { localStorage.setItem('school_student_pins_v1', JSON.stringify(bundle.studentPins)); } catch {}
  }
  if (bundle.practicumTrainees) {
    saveYearScopedData(year, 'practicum_trainees', bundle.practicumTrainees);
    try { localStorage.setItem('primary_practicum_trainees_v1', JSON.stringify(bundle.practicumTrainees)); } catch {}
  }

  // Section 2 Saves
  if (bundle.timetable) {
    saveYearScopedData(year, 'timetable', bundle.timetable);
    try { localStorage.setItem('primary_teacher_custom_timetable_v1', JSON.stringify(bundle.timetable)); } catch {}
  }
  if (bundle.syllabus) {
    saveYearScopedData(year, 'syllabus', bundle.syllabus);
    try { localStorage.setItem('primary_teacher_custom_syllabuses_v2', JSON.stringify(bundle.syllabus)); } catch {}
  }
  if (bundle.lessonPlans) {
    saveYearScopedData(year, 'lesson_plans', bundle.lessonPlans);
  }
  if (bundle.customSlideDecks) {
    saveYearScopedData(year, 'custom_slide_decks', bundle.customSlideDecks);
  }

  // Section 3 Saves
  if (bundle.seatingLayout) {
    saveYearScopedData(year, 'classroom_seating_layout', bundle.seatingLayout);
    try { localStorage.setItem('primary_classroom_seating_layout_v1', JSON.stringify(bundle.seatingLayout)); } catch {}
  }
  if (bundle.classroomRules) {
    saveYearScopedData(year, 'classroom_rules', bundle.classroomRules);
    try { localStorage.setItem('primary_classroom_rules_v1', JSON.stringify(bundle.classroomRules)); } catch {}
  }
  if (bundle.classroomDecoration) {
    saveYearScopedData(year, 'classroom_decoration', bundle.classroomDecoration);
    try { localStorage.setItem('primary_classroom_decor_v1', JSON.stringify(bundle.classroomDecoration)); } catch {}
  }

  // Section 4 Saves
  if (bundle.teacherParentAgreements) {
    saveYearScopedData(year, 'teacher_parent_agreements', bundle.teacherParentAgreements);
    try { localStorage.setItem('primary_teacher_parent_agreements_v1', JSON.stringify(bundle.teacherParentAgreements)); } catch {}
  }
  if (bundle.teacherPrincipalAgreement) {
    saveYearScopedData(year, 'teacher_principal_agreement', bundle.teacherPrincipalAgreement);
    try { localStorage.setItem('primary_teacher_principal_agreement_v1', JSON.stringify(bundle.teacherPrincipalAgreement)); } catch {}
  }
  if (bundle.classroomCommittee) {
    saveYearScopedData(year, 'classroom_committee', bundle.classroomCommittee);
    try { localStorage.setItem('primary_classroom_committee_v1', JSON.stringify(bundle.classroomCommittee)); } catch {}
  }
  if (bundle.cpdRecords) {
    saveYearScopedData(year, 'cpd_records', bundle.cpdRecords);
  }
  if (bundle.customLetters) {
    saveYearScopedData(year, 'custom_letters', bundle.customLetters);
  }
  if (bundle.priFormData !== undefined) {
    saveYearScopedData(year, 'moeys_pri_form_data', bundle.priFormData);
  }
  if (bundle.priLiveSyncActive !== undefined) {
    saveYearScopedData(year, 'moeys_pri_live_sync_active', bundle.priLiveSyncActive);
  }
  saveYearScopedData(year, 'last_modified', bundle.lastModified || Date.now());
}

/**
 * Clone or copy data from one year to another
 */
export interface CloneYearOptions {
  cloneTeacher: boolean;
  cloneStudents: boolean;
  cloneInventory: boolean;
  clonePLC: boolean;
  cloneQuizzes: boolean;
  cloneTimetable: boolean;
  cloneSyllabus: boolean;
}

export function cloneYearData(sourceYear: string, targetYear: string, options: CloneYearOptions): void {
  const sourceBundle = loadCompleteYearBundle(sourceYear);
  const targetTeacher: TeacherProfile = options.cloneTeacher
    ? { ...sourceBundle.teacher, academicYear: targetYear }
    : { ...initialTeacherProfile, academicYear: targetYear };

  const targetStudents: Student[] = options.cloneStudents ? JSON.parse(JSON.stringify(sourceBundle.students)) : [];
  const targetInventory: InventoryItem[] = options.cloneInventory ? JSON.parse(JSON.stringify(sourceBundle.inventory)) : initialInventory;
  const targetPLC: PLCMeeting[] = options.clonePLC ? JSON.parse(JSON.stringify(sourceBundle.plc)) : [];
  const targetQuizzes: Quiz[] = options.cloneQuizzes ? JSON.parse(JSON.stringify(sourceBundle.quizzes)) : initialQuizzes;

  saveYearScopedData(targetYear, 'teacher', targetTeacher);
  saveYearScopedData(targetYear, 'students', targetStudents);
  saveYearScopedData(targetYear, 'attendance', {}); // Fresh attendance for new year
  saveYearScopedData(targetYear, 'grades', {}); // Fresh grades for new year
  saveYearScopedData(targetYear, 'logbook', []); // Fresh logbook for new year
  saveYearScopedData(targetYear, 'inventory', targetInventory);
  saveYearScopedData(targetYear, 'plc', targetPLC);
  saveYearScopedData(targetYear, 'quizzes', targetQuizzes);

  // Clone timetable if requested
  if (options.cloneTimetable) {
    const sourceTimetableKey = getYearScopedStorageKey(sourceYear, 'timetable');
    const sourceTimetable = localStorage.getItem(sourceTimetableKey) || localStorage.getItem('primary_teacher_custom_timetable_v1');
    if (sourceTimetable) {
      try {
        const parsed = JSON.parse(sourceTimetable);
        parsed.academicYear = targetYear;
        saveYearScopedData(targetYear, 'timetable', parsed);
      } catch {
        // ignore
      }
    }
  }

  // Clone syllabus if requested
  if (options.cloneSyllabus) {
    const sourceSyllabusKey = getYearScopedStorageKey(sourceYear, 'syllabus');
    const sourceSyllabus = localStorage.getItem(sourceSyllabusKey) || localStorage.getItem('primary_teacher_custom_syllabuses_v2');
    if (sourceSyllabus) {
      try {
        saveYearScopedData(targetYear, 'syllabus', JSON.parse(sourceSyllabus));
      } catch {
        // ignore
      }
    }
  }
}

/**
 * Delete all data for a specific year
 */
export function deleteYearData(year: string): void {
  const dataTypes = ['teacher', 'students', 'attendance', 'grades', 'logbook', 'inventory', 'plc', 'quizzes', 'library_books', 'timetable', 'syllabus'];
  dataTypes.forEach((dt) => {
    const key = getYearScopedStorageKey(year, dt);
    localStorage.removeItem(key);
  });

  // Remove from years list
  const list = getAcademicYearsList().filter((y) => y !== year);
  if (list.length > 0) {
    saveAcademicYearsList(list);
  }
}

/**
 * Export all academic years into a single JSON backup file
 */
export function exportAllAcademicYearsBackup(): string {
  const years = getAcademicYearsList();
  const activeYear = getActiveAcademicYear();
  const backupData: {
    version: string;
    exportDate: string;
    activeYear: string;
    yearsList: string[];
    bundles: Record<string, AcademicYearDataBundle>;
    extra: {
      theme?: string;
      font?: string;
      fontSize?: string;
    };
  } = {
    version: '2.0-moeys-multi-year',
    exportDate: new Date().toISOString(),
    activeYear,
    yearsList: years,
    bundles: {},
    extra: {
      theme: localStorage.getItem('primary_teacher_admin_v2_theme') || 'default',
      font: localStorage.getItem('primary_teacher_admin_v2_font') || 'Battambang',
      fontSize: localStorage.getItem('primary_teacher_admin_v2_fontsize') || 'base',
    },
  };

  years.forEach((yr) => {
    backupData.bundles[yr] = loadCompleteYearBundle(yr);
  });

  return JSON.stringify(backupData, null, 2);
}

/**
 * Import and restore backup JSON
 */
export function importAcademicYearsBackup(jsonString: string): { success: boolean; message: string; count?: number } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'ឯកសារទិន្នន័យមិនត្រឹមត្រូវ' };
    }

    if (parsed.yearsList && Array.isArray(parsed.yearsList)) {
      saveAcademicYearsList(parsed.yearsList);
    }

    let count = 0;
    if (parsed.bundles && typeof parsed.bundles === 'object') {
      Object.keys(parsed.bundles).forEach((yr) => {
        const bundle = parsed.bundles[yr];
        if (bundle && bundle.teacher) {
          saveCompleteYearBundle(bundle);
          count++;
        }
      });
    }

    if (parsed.activeYear) {
      setActiveAcademicYear(parsed.activeYear);
    }

    if (parsed.extra) {
      if (parsed.extra.theme) localStorage.setItem('primary_teacher_admin_v2_theme', parsed.extra.theme);
      if (parsed.extra.font) localStorage.setItem('primary_teacher_admin_v2_font', parsed.extra.font);
      if (parsed.extra.fontSize) localStorage.setItem('primary_teacher_admin_v2_fontsize', parsed.extra.fontSize);
    }

    return {
      success: true,
      message: `បានបញ្ចូលទិន្នន័យជោគជ័យចំនួន ${count} ឆ្នាំសិក្សា!`,
      count,
    };
  } catch (err: any) {
    return { success: false, message: `បរាជ័យក្នុងការបញ្ចូលទិន្នន័យ៖ ${err.message || 'ឯកសារមានកំហុស'}` };
  }
}

/**
 * Share or download backup JSON file.
 * Supports:
 * - shareOrDownloadBackupFile(teacherName?: string, onToast?: (msg: string) => void)
 * - shareOrDownloadBackupFile(jsonString: string, fileName: string)
 */
export async function shareOrDownloadBackupFile(
  arg1?: string,
  arg2?: string | ((msg: string) => void)
): Promise<boolean> {
  try {
    let jsonContent: string;
    let fileName: string;
    let onToast: ((msg: string) => void) | undefined;

    if (typeof arg2 === 'function') {
      onToast = arg2;
    }

    if (arg1 && (arg1.trim().startsWith('{') || arg1.trim().startsWith('['))) {
      jsonContent = arg1;
      fileName = typeof arg2 === 'string' ? arg2 : `backup_teacher_${getActiveAcademicYear()}.json`;
    } else {
      jsonContent = exportAllAcademicYearsBackup();
      const teacherName = arg1 || 'teacher';
      fileName = typeof arg2 === 'string' ? arg2 : `backup_${teacherName}_${getActiveAcademicYear().replace(/\s+/g, '_')}.json`;
    }

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const file = new File([blob], fileName, { type: 'application/json' });

    // Try Web Share API on supported devices
    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'ទិន្នន័យបម្រុងទុក (Teacher Backup)',
          text: `ឯកសារទិន្នន័យបម្រុងទុករដ្ឋបាលគ្រូបង្រៀន (${fileName})`,
        });
        if (onToast) onToast('បានចែករំលែកឯកសារទិន្នន័យជោគជ័យ!');
        return true;
      } catch (shareErr: any) {
        if (shareErr.name === 'AbortError') {
          return false;
        }
      }
    }

    // Fallback: browser file download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onToast) onToast('បានទាញយកឯកសារបម្រុងទុក (.json) ជោគជ័យ!');
    return true;
  } catch (err: any) {
    console.error('Error sharing or downloading backup:', err);
    if (typeof arg2 === 'function') {
      arg2(`បរាជ័យក្នុងការទាញយកឯកសារ៖ ${err.message || 'Error'}`);
    }
    return false;
  }
}

/**
 * Copy backup JSON to clipboard
 */
export async function copyBackupToClipboard(
  jsonStringOrTeacherName?: string,
  onToast?: (msg: string) => void
): Promise<boolean> {
  try {
    let content: string;
    if (jsonStringOrTeacherName && (jsonStringOrTeacherName.trim().startsWith('{') || jsonStringOrTeacherName.trim().startsWith('['))) {
      content = jsonStringOrTeacherName;
    } else {
      content = exportAllAcademicYearsBackup();
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(content);
      if (onToast) onToast('បានចម្លងទិន្នន័យបម្រុងទុកទៅកាន់ Clipboard រួចរាល់!');
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error copying to clipboard:', err);
    return false;
  }
}

