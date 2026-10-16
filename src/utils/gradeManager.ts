import { Student, StudentGrade, GradeDatabase } from '../types';

export type GradeSubject = 'khmer' | 'math' | 'science' | 'social';

export interface GradeThresholds {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
}

export type GradePeriodKey =
  // Semester 1
  | 'm10' // តុលា (Oct)
  | 'm11' // វិច្ឆិកា (Nov)
  | 'm12' // ធ្នូ (Dec)
  | 'm01' // មករា (Jan)
  | 's1_exam' // ប្រឡងឆមាសទី១ (Semester 1 Exam)
  | 's1_summary' // សរុបឆមាសទី១ (Semester 1 Summary)
  // Semester 2
  | 'm02' // កុម្ភៈ (Feb)
  | 'm03' // មីនា (Mar)
  | 'm04' // មេសា (Apr)
  | 'm05' // ឧសភា (May)
  | 'm06' // មិថុនា (Jun)
  | 'm07' // កក្កដា (Jul)
  | 'm08' // សីហា (Aug)
  | 'm09' // កញ្ញា (Sep)
  | 's2_exam' // ប្រឡងឆមាសទី២ (Semester 2 Exam)
  | 's2_summary' // សរុបឆមាសទី២ (Semester 2 Summary)
  // Annual
  | 'annual_summary'; // សរុបប្រចាំឆ្នាំ (Annual Summary)

export interface GradePeriodInfo {
  key: GradePeriodKey;
  label: string;
  shortLabel: string;
  subLabel?: string;
  semester: 1 | 2 | 'annual';
  isExam?: boolean;
  isSummary?: boolean;
  order: number;
}

export const GRADE_PERIODS: GradePeriodInfo[] = [
  // Semester 1
  { key: 'm10', label: 'ខែតុលា (October)', shortLabel: 'ខែតុលា', semester: 1, order: 1 },
  { key: 'm11', label: 'ខែវិច្ឆិកា (November)', shortLabel: 'ខែវិច្ឆិកា', semester: 1, order: 2 },
  { key: 'm12', label: 'ខែធ្នូ (December)', shortLabel: 'ខែធ្នូ', semester: 1, order: 3 },
  { key: 'm01', label: 'ខែមករា (January)', shortLabel: 'ខែមករា', semester: 1, order: 4 },
  { key: 's1_exam', label: 'ប្រឡងឆមាសទី១ (Semester 1 Exam)', shortLabel: 'ប្រឡងឆមាសទី១', subLabel: 'ប្រឡងផ្លូវការ', semester: 1, isExam: true, order: 5 },
  { key: 's1_summary', label: '📊 បូកសរុបប្រចាំឆមាសទី១ (Semester 1 Summary)', shortLabel: 'សរុបប្រចាំឆមាសទី១', subLabel: 'គណនាស្វ័យប្រវត្តិ', semester: 1, isSummary: true, order: 6 },

  // Semester 2
  { key: 'm02', label: 'ខែកុម្ភៈ (February)', shortLabel: 'ខែកុម្ភៈ', semester: 2, order: 7 },
  { key: 'm03', label: 'ខែមីនា (March)', shortLabel: 'ខែមីនា', semester: 2, order: 8 },
  { key: 'm04', label: 'ខែមេសា (April)', shortLabel: 'ខែមេសា', semester: 2, order: 9 },
  { key: 'm05', label: 'ខែឧសភា (May)', shortLabel: 'ខែឧសភា', semester: 2, order: 10 },
  { key: 'm06', label: 'ខែមិថុនា (June)', shortLabel: 'ខែមិថុនា', semester: 2, order: 11 },
  { key: 'm07', label: 'ខែកក្កដា (July)', shortLabel: 'ខែកក្កដា', semester: 2, order: 12 },
  { key: 'm08', label: 'ខែសីហា (August)', shortLabel: 'ខែសីហា', semester: 2, order: 13 },
  { key: 'm09', label: 'ខែកញ្ញា (September)', shortLabel: 'ខែកញ្ញា', semester: 2, order: 14 },
  { key: 's2_exam', label: 'ប្រឡងឆមាសទី២ (Semester 2 Exam)', shortLabel: 'ប្រឡងឆមាសទី២', subLabel: 'ប្រឡងផ្លូវការ', semester: 2, isExam: true, order: 15 },
  { key: 's2_summary', label: '📊 បូកសរុបប្រចាំឆមាសទី២ (Semester 2 Summary)', shortLabel: 'សរុបប្រចាំឆមាសទី២', subLabel: 'គណនាស្វ័យប្រវត្តិ', semester: 2, isSummary: true, order: 16 },

  // Annual
  { key: 'annual_summary', label: '🏆 បូកសរុបប្រចាំឆ្នាំ (Annual Summary & Ranking)', shortLabel: 'ប្រចាំឆ្នាំ', subLabel: 'ឆមាសទី១ + ឆមាសទី២', semester: 'annual', isSummary: true, order: 17 },
];

export const SEMESTER_1_ENTRY_PERIODS = GRADE_PERIODS.filter((p) => p.semester === 1 && !p.isSummary);
export const SEMESTER_2_ENTRY_PERIODS = GRADE_PERIODS.filter((p) => p.semester === 2 && !p.isSummary);
export const ALL_ENTRY_MONTHS = GRADE_PERIODS.filter((p) => !p.isSummary && !p.isExam);

// Standard Sample Default Grades on 10-point scale
export const defaultMultiPeriodGrades: GradeDatabase = {
  // Semester 1
  m10: {
    1: { khmer: 9.0, math: 8.5, science: 8.8, social: 8.4 },
    2: { khmer: 8.4, math: 9.2, science: 8.9, social: 8.6 },
    3: { khmer: 7.6, math: 7.2, science: 7.8, social: 7.4 },
    4: { khmer: 9.4, math: 8.8, science: 9.2, social: 9.0 },
    5: { khmer: 7.8, math: 8.0, science: 8.2, social: 7.9 },
    6: { khmer: 8.6, math: 8.4, science: 8.5, social: 8.3 },
  },
  m11: {
    1: { khmer: 9.1, math: 8.7, science: 8.9, social: 8.5 },
    2: { khmer: 8.6, math: 9.4, science: 9.0, social: 8.8 },
    3: { khmer: 7.8, math: 7.4, science: 8.0, social: 7.6 },
    4: { khmer: 9.5, math: 9.0, science: 9.3, social: 9.1 },
    5: { khmer: 8.0, math: 8.2, science: 8.3, social: 8.0 },
    6: { khmer: 8.7, math: 8.5, science: 8.6, social: 8.4 },
  },
  m12: {
    1: { khmer: 9.2, math: 8.8, science: 9.0, social: 8.5 },
    2: { khmer: 8.5, math: 9.5, science: 9.1, social: 8.9 },
    3: { khmer: 7.8, math: 7.4, science: 8.0, social: 7.6 },
    4: { khmer: 9.5, math: 9.0, science: 9.4, social: 9.2 },
    5: { khmer: 8.0, math: 8.2, science: 8.4, social: 8.1 },
    6: { khmer: 8.8, math: 8.6, science: 8.7, social: 8.5 },
  },
  m01: {
    1: { khmer: 9.3, math: 8.9, science: 9.1, social: 8.6 },
    2: { khmer: 8.7, math: 9.6, science: 9.2, social: 9.0 },
    3: { khmer: 8.0, math: 7.5, science: 8.1, social: 7.7 },
    4: { khmer: 9.6, math: 9.1, science: 9.5, social: 9.3 },
    5: { khmer: 8.1, math: 8.3, science: 8.5, social: 8.2 },
    6: { khmer: 8.9, math: 8.7, science: 8.8, social: 8.6 },
  },
  s1_exam: {
    1: { khmer: 9.4, math: 9.0, science: 9.2, social: 8.8 },
    2: { khmer: 8.8, math: 9.7, science: 9.3, social: 9.1 },
    3: { khmer: 8.2, math: 7.8, science: 8.3, social: 8.0 },
    4: { khmer: 9.7, math: 9.3, science: 9.6, social: 9.4 },
    5: { khmer: 8.3, math: 8.5, science: 8.6, social: 8.3 },
    6: { khmer: 9.0, math: 8.8, science: 8.9, social: 8.7 },
  },

  // Semester 2
  m02: {
    1: { khmer: 9.3, math: 8.9, science: 9.1, social: 8.7 },
    2: { khmer: 8.8, math: 9.6, science: 9.2, social: 9.0 },
    3: { khmer: 8.1, math: 7.6, science: 8.2, social: 7.8 },
    4: { khmer: 9.6, math: 9.2, science: 9.5, social: 9.3 },
    5: { khmer: 8.2, math: 8.4, science: 8.5, social: 8.2 },
    6: { khmer: 8.9, math: 8.7, science: 8.8, social: 8.6 },
  },
  m03: {
    1: { khmer: 9.4, math: 9.0, science: 9.2, social: 8.8 },
    2: { khmer: 8.9, math: 9.7, science: 9.3, social: 9.1 },
    3: { khmer: 8.2, math: 7.7, science: 8.3, social: 7.9 },
    4: { khmer: 9.7, math: 9.3, science: 9.6, social: 9.4 },
    5: { khmer: 8.3, math: 8.5, science: 8.6, social: 8.3 },
    6: { khmer: 9.0, math: 8.8, science: 8.9, social: 8.7 },
  },
  m04: {
    1: { khmer: 9.3, math: 8.9, science: 9.1, social: 8.7 },
    2: { khmer: 8.8, math: 9.6, science: 9.2, social: 9.0 },
    3: { khmer: 8.0, math: 7.6, science: 8.2, social: 7.8 },
    4: { khmer: 9.6, math: 9.2, science: 9.5, social: 9.3 },
    5: { khmer: 8.2, math: 8.4, science: 8.5, social: 8.2 },
    6: { khmer: 8.9, math: 8.7, science: 8.8, social: 8.6 },
  },
  m05: {
    1: { khmer: 9.5, math: 9.1, science: 9.3, social: 8.9 },
    2: { khmer: 9.0, math: 9.8, science: 9.4, social: 9.2 },
    3: { khmer: 8.3, math: 7.9, science: 8.4, social: 8.0 },
    4: { khmer: 9.8, math: 9.4, science: 9.7, social: 9.5 },
    5: { khmer: 8.4, math: 8.6, science: 8.7, social: 8.4 },
    6: { khmer: 9.1, math: 8.9, science: 9.0, social: 8.8 },
  },
  m06: {
    1: { khmer: 9.5, math: 9.2, science: 9.3, social: 9.0 },
    2: { khmer: 9.0, math: 9.8, science: 9.5, social: 9.3 },
    3: { khmer: 8.4, math: 8.0, science: 8.5, social: 8.1 },
    4: { khmer: 9.8, math: 9.5, science: 9.7, social: 9.6 },
    5: { khmer: 8.5, math: 8.7, science: 8.8, social: 8.5 },
    6: { khmer: 9.2, math: 9.0, science: 9.1, social: 8.9 },
  },
  m07: {
    1: { khmer: 9.6, math: 9.2, science: 9.4, social: 9.0 },
    2: { khmer: 9.1, math: 9.9, science: 9.5, social: 9.3 },
    3: { khmer: 8.5, math: 8.1, science: 8.6, social: 8.2 },
    4: { khmer: 9.9, math: 9.6, science: 9.8, social: 9.7 },
    5: { khmer: 8.6, math: 8.8, science: 8.9, social: 8.6 },
    6: { khmer: 9.3, math: 9.1, science: 9.2, social: 9.0 },
  },
  m08: {
    1: { khmer: 9.6, math: 9.3, science: 9.4, social: 9.1 },
    2: { khmer: 9.1, math: 9.8, science: 9.5, social: 9.3 },
    3: { khmer: 8.5, math: 8.2, science: 8.6, social: 8.3 },
    4: { khmer: 9.8, math: 9.5, science: 9.7, social: 9.6 },
    5: { khmer: 8.6, math: 8.8, science: 8.9, social: 8.6 },
    6: { khmer: 9.3, math: 9.1, science: 9.2, social: 9.0 },
  },
  m09: {
    1: { khmer: 9.7, math: 9.4, science: 9.5, social: 9.2 },
    2: { khmer: 9.2, math: 9.9, science: 9.6, social: 9.4 },
    3: { khmer: 8.6, math: 8.3, science: 8.7, social: 8.4 },
    4: { khmer: 9.9, math: 9.6, science: 9.8, social: 9.7 },
    5: { khmer: 8.7, math: 8.9, science: 9.0, social: 8.7 },
    6: { khmer: 9.4, math: 9.2, science: 9.3, social: 9.1 },
  },
  s2_exam: {
    1: { khmer: 9.6, math: 9.3, science: 9.5, social: 9.1 },
    2: { khmer: 9.2, math: 9.9, science: 9.6, social: 9.4 },
    3: { khmer: 8.6, math: 8.2, science: 8.7, social: 8.3 },
    4: { khmer: 9.9, math: 9.6, science: 9.8, social: 9.7 },
    5: { khmer: 8.7, math: 8.9, science: 9.0, social: 8.7 },
    6: { khmer: 9.4, math: 9.2, science: 9.3, social: 9.1 },
  },
};

/**
 * Retrieve student grade for a given period safely with backwards compatibility.
 */
export function getStudentGrade(
  grades: GradeDatabase | undefined,
  periodKey: string,
  studentId: number
): StudentGrade {
  if (!grades) {
    return { khmer: 0, math: 0, science: 0, social: 0 };
  }

  // 1. Direct period object access: grades[periodKey][studentId]
  if (grades[periodKey] && typeof grades[periodKey] === 'object' && (grades[periodKey][studentId] || grades[periodKey][String(studentId)])) {
    const g = grades[periodKey][studentId] || grades[periodKey][String(studentId)];
    return {
      khmer: Number(g.khmer) || 0,
      math: Number(g.math) || 0,
      science: Number(g.science) || 0,
      social: Number(g.social) || 0,
      subScores: g.subScores ? { ...g.subScores } : undefined,
    };
  }

  // 2. Fallback for legacy single-period structure: grades[studentId]
  if ((grades[studentId] || grades[String(studentId)]) && typeof (grades[studentId] || grades[String(studentId)]) === 'object' && ((grades[studentId] || grades[String(studentId)]).khmer !== undefined || (grades[studentId] || grades[String(studentId)]).math !== undefined)) {
    const g = grades[studentId] || grades[String(studentId)];
    return {
      khmer: Number(g.khmer) || 0,
      math: Number(g.math) || 0,
      science: Number(g.science) || 0,
      social: Number(g.social) || 0,
      subScores: g.subScores ? { ...g.subScores } : undefined,
    };
  }

  // 3. Fallback to default 0
  return { khmer: 0, math: 0, science: 0, social: 0 };
}

/**
 * Update student grade in GradeDatabase immutably (max 10 points).
 */
export function updateStudentGradeRecord(
  prevGrades: GradeDatabase,
  periodKey: string,
  studentId: number,
  subject: GradeSubject,
  value: number
): GradeDatabase {
  const currentPeriod = (prevGrades[periodKey] as Record<number, StudentGrade>) || {};
  const currentStudentGrade = getStudentGrade(prevGrades, periodKey, studentId);

  const updatedStudentGrade: StudentGrade = {
    ...currentStudentGrade,
    [subject]: Math.max(0, Math.min(10, value)),
  };

  return {
    ...prevGrades,
    [periodKey]: {
      ...currentPeriod,
      [studentId]: updatedStudentGrade,
    },
    [studentId]: updatedStudentGrade,
  };
}

/**
 * Grade Classification / Letter Grade (MoEYS Standard for 10-point scale):
 * A (≥8.5) : ល្អណាស់ (Excellent)
 * B (7.5 - 8.49) : ល្អ (Good)
 * C (6.5 - 7.49) : ល្អបង្គួរ / មធ្យម (Average)
 * D (5.0 - 6.49) : មធ្យម / ខ្សោយ (Passable)
 * F (<5.0) : ខ្សោយ (Fail / Needs Support)
 */
export function getGradeClassification(averageScore?: number | null, thresholds?: GradeThresholds) {
  const safeScore = (typeof averageScore === 'number' && !isNaN(averageScore)) ? averageScore : 0;
  const t = thresholds || { A: 8.5, B: 7.5, C: 6.5, D: 5.0, E: 4.0 };
  const avg = Number(safeScore.toFixed(2));
  if (avg >= t.A) {
    return {
      letter: 'A',
      label: 'A (ល្អណាស់)',
      colorText: 'text-emerald-700',
      colorBg: 'bg-emerald-100 border-emerald-200 text-emerald-800',
      badgeHex: '#047857',
      bgHex: '#dcfce7',
      remarks: 'សិស្សឆ្នើម',
      passed: true,
    };
  }
  if (avg >= t.B) {
    return {
      letter: 'B',
      label: 'B (ល្អ)',
      colorText: 'text-blue-700',
      colorBg: 'bg-blue-100 border-blue-200 text-blue-800',
      badgeHex: '#2563eb',
      bgHex: '#dbeafe',
      remarks: 'ល្អប្រសើរ',
      passed: true,
    };
  }
  if (avg >= t.C) {
    return {
      letter: 'C',
      label: 'C (មធ្យម)',
      colorText: 'text-amber-700',
      colorBg: 'bg-amber-100 border-amber-200 text-amber-800',
      badgeHex: '#d97706',
      bgHex: '#fef3c7',
      remarks: 'មធ្យម',
      passed: true,
    };
  }
  if (avg >= t.D) {
    return {
      letter: 'D',
      label: 'D (គួរគប្បី)',
      colorText: 'text-orange-700',
      colorBg: 'bg-orange-100 border-orange-200 text-orange-800',
      badgeHex: '#ea580c',
      bgHex: '#ffedd5',
      remarks: 'ជាប់',
      passed: true,
    };
  }
  if (avg >= t.E) {
    return {
      letter: 'E',
      label: 'E (ខ្សោយ)',
      colorText: 'text-yellow-700 font-bold',
      colorBg: 'bg-yellow-100 border-yellow-200 text-yellow-800',
      badgeHex: '#ca8a04',
      bgHex: '#fef9c3',
      remarks: 'ខ្សោយបន្តិច',
      passed: true,
    };
  }
  return {
    letter: 'F',
    label: 'F (ខ្សោយណាស់)',
    colorText: 'text-rose-700 font-bold',
    colorBg: 'bg-rose-100 border-rose-200 text-rose-800',
    badgeHex: '#be123c',
    bgHex: '#ffe4e6',
    remarks: 'ត្រូវបំប៉ន',
    passed: false,
  };
}

/**
 * Computed single period student grade summary item
 */
export interface SinglePeriodStudentResult {
  student: Student;
  khmer: number;
  math: number;
  science: number;
  social: number;
  grade: StudentGrade;
  total: number;
  avg: number;
  average: number;
  rank: number;
  letter: string;
  label: string;
  classification: {
    letter: string;
    label: string;
    remarks: string;
    passed: boolean;
  };
  colorBg: string;
  colorText: string;
  badgeHex: string;
  bgHex: string;
  remarks: string;
  passed: boolean;
}

/**
 * Calculate rankings and statistics for a single month/exam period
 */
export function calculateSinglePeriodSummary(
  arg1: GradeDatabase | Student[],
  arg2: string | GradeDatabase,
  arg3?: Student[] | string,
  arg4?: GradeThresholds,
  arg5?: string[],
  arg6?: Record<string, Record<number | string, Record<string, number>>>,
  arg7?: Record<string, string[]>
): {
  list: SinglePeriodStudentResult[];
  students: SinglePeriodStudentResult[];
  totalStudents: number;
  femaleStudents: number;
  passedCount: number;
  failedCount: number;
  passRate: string;
  classAverage: number;
  gradeCounts: { A: number; B: number; C: number; D: number; E: number; F: number };
  countA: number;
  countB: number;
  countC: number;
  countD: number;
  countE: number;
  countF: number;
} {
  let grades: GradeDatabase;
  let periodKey: string;
  let students: Student[];
  let thresholds: GradeThresholds | undefined;
  let activeSubSubjects: string[] | undefined;
  let subScoresDb: Record<string, Record<number | string, Record<string, number>>> | undefined;
  let periodSubSubjectsMap: Record<string, string[]> | undefined = arg7;

  if (Array.isArray(arg1)) {
    students = arg1;
    grades = arg2 as GradeDatabase;
    periodKey = arg3 as string;
    thresholds = arg4;
    activeSubSubjects = arg5;
    subScoresDb = arg6;
  } else {
    grades = arg1 as GradeDatabase;
    periodKey = arg2 as string;
    students = (arg3 as Student[]) || [];
    thresholds = arg4;
    activeSubSubjects = arg5;
    subScoresDb = arg6;
  }

  // If periodSubSubjectsMap has specific config for this period, prioritize it
  if (periodSubSubjectsMap && periodSubSubjectsMap[periodKey] && Array.isArray(periodSubSubjectsMap[periodKey]) && periodSubSubjectsMap[periodKey].length > 0) {
    activeSubSubjects = periodSubSubjectsMap[periodKey];
  } else if (!activeSubSubjects && typeof window !== 'undefined') {
    try {
      const mapSaved = localStorage.getItem('school_monitoring_period_sub_subjects');
      if (mapSaved) {
        const parsed = JSON.parse(mapSaved);
        if (parsed[periodKey] && Array.isArray(parsed[periodKey]) && parsed[periodKey].length > 0) {
          activeSubSubjects = parsed[periodKey];
        }
      }
    } catch {}
  }

  // Load stored active sub subjects and sub scores if not passed
  if (!activeSubSubjects && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('school_active_sub_subjects');
      if (saved) {
        activeSubSubjects = JSON.parse(saved);
      }
    } catch {}
  }

  if (!subScoresDb && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('school_sub_scores_db');
      if (saved) {
        subScoresDb = JSON.parse(saved);
      }
    } catch {}
  }

  const unranked = (students || []).map((student) => {
    const g = getStudentGrade(grades, periodKey, student.id);
    const khmer = g.khmer || 0;
    const math = g.math || 0;
    const science = g.science || 0;
    const social = g.social || 0;

    let subScores = { ...(g.subScores || {}) };
    if (subScoresDb && subScoresDb[periodKey]?.[student.id]) {
      subScores = { ...subScores, ...subScoresDb[periodKey][student.id] };
    }

    let total = 0;
    let avg = 0;

    if (activeSubSubjects && activeSubSubjects.length > 0) {
      let sum = 0;
      activeSubSubjects.forEach((subId) => {
        const val = subScores[subId] !== undefined ? Number(subScores[subId]) : 0;
        sum += val;
      });
      total = Number(sum.toFixed(2));
      avg = Number((sum / activeSubSubjects.length).toFixed(2));
    } else {
      const subKeys = Object.keys(subScores);
      if (subKeys.length > 0) {
        let sum = 0;
        subKeys.forEach((k) => {
          sum += Number(subScores[k] || 0);
        });
        total = Number(sum.toFixed(2));
        avg = Number((sum / subKeys.length).toFixed(2));
      } else {
        total = khmer + math + science + social;
        avg = Number((total / 4).toFixed(2));
      }
    }

    const gradeInfo = getGradeClassification(avg, thresholds);

    return {
      student,
      khmer,
      math,
      science,
      social,
      grade: { khmer, math, science, social, subScores },
      total,
      avg,
      average: avg,
      rank: 1,
      classification: {
        letter: gradeInfo.letter,
        label: gradeInfo.label,
        remarks: gradeInfo.remarks,
        passed: gradeInfo.passed,
      },
      ...gradeInfo,
    };
  });

  // Sort descending by average for ranking
  const sorted = [...unranked].sort((a, b) => b.avg - a.avg || b.total - a.total);
  const rankMap = new Map<number, number>();
  sorted.forEach((item, idx) => {
    rankMap.set(item.student.id, idx + 1);
  });

  // Assign ranks
  const list: SinglePeriodStudentResult[] = unranked.map((item) => ({
    ...item,
    rank: rankMap.get(item.student.id) || 1,
  }));

  const totalStudents = students.length;
  const femaleStudents = students.filter((s) => s.gender === 'ស្រី').length;
  const passedCount = list.filter((item) => item.passed).length;
  const failedCount = totalStudents - passedCount;
  const passRate = totalStudents > 0 ? ((passedCount / totalStudents) * 100).toFixed(1) : '100';
  const totalAvgSum = list.reduce((acc, curr) => acc + curr.avg, 0);
  const classAverage = totalStudents > 0 ? Number((totalAvgSum / totalStudents).toFixed(2)) : 0;

  const countA = list.filter((i) => i.letter === 'A').length;
  const countB = list.filter((i) => i.letter === 'B').length;
  const countC = list.filter((i) => i.letter === 'C').length;
  const countD = list.filter((i) => i.letter === 'D').length;
  const countE = list.filter((i) => i.letter === 'E').length;
  const countF = list.filter((i) => i.letter === 'F').length;

  return {
    list,
    students: list,
    totalStudents,
    femaleStudents,
    passedCount,
    failedCount,
    passRate,
    classAverage,
    gradeCounts: { A: countA, B: countB, C: countC, D: countD, E: countE, F: countF },
    countA,
    countB,
    countC,
    countD,
    countE,
    countF,
  };
}

/**
 * Semester Summary Data for each student
 */
export interface SemesterStudentSummaryItem {
  student: Student;
  monthAverages: { periodKey: string; shortLabel: string; avg: number }[];
  monthlyAverages: Record<string, number>;
  monthlyMean: number; // មធ្យមភាគប្រចាំខែ
  monthlyOverallAverage: number;
  examAvg: number; // ពិន្ទុប្រឡងឆមាស
  examAverage: number;
  semesterAvg: number; // មធ្យមភាគឆមាស = (មធ្យមភាគខែ + ប្រឡងឆមាស) / 2
  semesterAverage: number;
  rank: number;
  letter: string;
  label: string;
  classification: {
    letter: string;
    label: string;
    remarks: string;
    passed: boolean;
  };
  colorBg: string;
  colorText: string;
  badgeHex: string;
  bgHex: string;
  remarks: string;
  passed: boolean;
}

/**
 * Calculate Semester 1 or Semester 2 Summary
 */
export function calculateSemesterSummary(
  arg1: GradeDatabase | Student[],
  arg2: 1 | 2 | GradeDatabase,
  arg3?: Student[] | 1 | 2,
  arg4?: string[] | GradeThresholds,
  arg5?: GradeThresholds,
  arg6?: string[],
  arg7?: Record<string, Record<number | string, Record<string, number>>>,
  arg8?: Record<string, string[]>
): {
  list: SemesterStudentSummaryItem[];
  students: SemesterStudentSummaryItem[];
  periods: GradePeriodInfo[];
  totalStudents: number;
  femaleStudents: number;
  passedCount: number;
  failedCount: number;
  passRate: string;
  classAverage: number;
  gradeCounts: { A: number; B: number; C: number; D: number; E: number; F: number };
  countA: number;
  countB: number;
  countC: number;
  countD: number;
  countE: number;
  countF: number;
} {
  let grades: GradeDatabase;
  let semester: 1 | 2;
  let students: Student[];
  let selectedMonthKeys: string[] | undefined;
  let thresholds: GradeThresholds | undefined;
  let activeSubSubjects: string[] | undefined;
  let subScoresDb: Record<string, Record<number | string, Record<string, number>>> | undefined;
  let periodSubSubjectsMap: Record<string, string[]> | undefined = arg8;

  if (Array.isArray(arg1)) {
    students = arg1;
    grades = arg2 as GradeDatabase;
    semester = arg3 as 1 | 2;
    selectedMonthKeys = arg4 as string[];
    thresholds = arg5;
    activeSubSubjects = arg6;
    subScoresDb = arg7;
  } else {
    grades = arg1 as GradeDatabase;
    semester = arg2 as 1 | 2;
    students = (arg3 as Student[]) || [];
    if (Array.isArray(arg4)) {
      selectedMonthKeys = arg4;
      thresholds = arg5;
    } else {
      thresholds = arg4 as GradeThresholds;
    }
    activeSubSubjects = arg6;
    subScoresDb = arg7;
  }

  // Load stored active sub subjects and sub scores if not passed
  if (!activeSubSubjects && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('school_active_sub_subjects');
      if (saved) {
        activeSubSubjects = JSON.parse(saved);
      }
    } catch {}
  }

  if (!periodSubSubjectsMap && typeof window !== 'undefined') {
    try {
      const mapSaved = localStorage.getItem('school_monitoring_period_sub_subjects');
      if (mapSaved) {
        periodSubSubjectsMap = JSON.parse(mapSaved);
      }
    } catch {}
  }

  if (!subScoresDb && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('school_sub_scores_db');
      if (saved) {
        subScoresDb = JSON.parse(saved);
      }
    } catch {}
  }

  const periods = semester === 1 ? SEMESTER_1_ENTRY_PERIODS : SEMESTER_2_ENTRY_PERIODS;
  const allMonthPeriods = selectedMonthKeys && selectedMonthKeys.length > 0
    ? ALL_ENTRY_MONTHS.filter((p) => selectedMonthKeys.includes(p.key))
    : periods.filter((p) => !p.isExam);
  const examPeriod = periods.find((p) => p.isExam);

  // Helper to compute period average for a student
  const getPeriodAvg = (periodKey: string, studentId: number | string, g: StudentGrade): number => {
    let subScores = { ...(g.subScores || {}) };
    if (subScoresDb && subScoresDb[periodKey]?.[studentId]) {
      subScores = { ...subScores, ...subScoresDb[periodKey][studentId] };
    }

    // Determine sub-subjects for this specific period
    let periodSpecificSubs: string[] | undefined;
    if (periodSubSubjectsMap && periodSubSubjectsMap[periodKey] && Array.isArray(periodSubSubjectsMap[periodKey]) && periodSubSubjectsMap[periodKey].length > 0) {
      periodSpecificSubs = periodSubSubjectsMap[periodKey];
    }
    const currentSubs = (periodSpecificSubs && periodSpecificSubs.length > 0) ? periodSpecificSubs : activeSubSubjects;

    if (currentSubs && currentSubs.length > 0) {
      let sum = 0;
      currentSubs.forEach((subId) => {
        const val = subScores[subId] !== undefined ? Number(subScores[subId]) : 0;
        sum += val;
      });
      return Number((sum / currentSubs.length).toFixed(2));
    } else {
      const subKeys = Object.keys(subScores);
      if (subKeys.length > 0) {
        let sum = 0;
        subKeys.forEach((k) => {
          sum += Number(subScores[k] || 0);
        });
        return Number((sum / subKeys.length).toFixed(2));
      } else {
        return Number(((g.khmer + g.math + g.science + (g.social || 0)) / 4).toFixed(2));
      }
    }
  };

  const unranked = (students || []).map((student) => {
    // Monthly averages
    const monthlyMap: Record<string, number> = {};
    const monthAverages = allMonthPeriods.map((p) => {
      const g = getStudentGrade(grades, p.key, student.id);
      const avg = getPeriodAvg(p.key, student.id, g);
      monthlyMap[p.key] = avg;
      return {
        periodKey: p.key,
        shortLabel: p.shortLabel,
        avg,
      };
    });

    const activeMonthAverages = monthAverages.filter((ma) => !selectedMonthKeys || selectedMonthKeys.includes(ma.periodKey));
    const monthlySum = activeMonthAverages.reduce((acc, curr) => acc + curr.avg, 0);
    const monthlyMean = activeMonthAverages.length > 0 ? Number((monthlySum / activeMonthAverages.length).toFixed(2)) : 0;

    // Exam score
    let examAvg = 0;
    if (examPeriod) {
      const examGrade = getStudentGrade(grades, examPeriod.key, student.id);
      examAvg = getPeriodAvg(examPeriod.key, student.id, examGrade);
    }

    // Semester GPA: MoEYS formula standard: (Monthly Average + Semester Exam) / 2
    const semesterAvg = examAvg > 0
      ? Number(((monthlyMean + examAvg) / 2).toFixed(2))
      : monthlyMean;

    const gradeInfo = getGradeClassification(semesterAvg, thresholds);

    return {
      student,
      monthAverages,
      monthlyAverages: monthlyMap,
      monthlyMean,
      monthlyOverallAverage: monthlyMean,
      examAvg,
      examAverage: examAvg,
      semesterAvg,
      semesterAverage: semesterAvg,
      rank: 1,
      classification: {
        letter: gradeInfo.letter,
        label: gradeInfo.label,
        remarks: gradeInfo.remarks,
        passed: gradeInfo.passed,
      },
      ...gradeInfo,
    };
  });

  // Sort descending by semesterAvg
  const sorted = [...unranked].sort((a, b) => b.semesterAvg - a.semesterAvg);
  const rankMap = new Map<number, number>();
  sorted.forEach((item, idx) => {
    rankMap.set(item.student.id, idx + 1);
  });

  const list: SemesterStudentSummaryItem[] = unranked.map((item) => ({
    ...item,
    rank: rankMap.get(item.student.id) || 1,
  }));

  const totalStudents = students.length;
  const femaleStudents = students.filter((s) => s.gender === 'ស្រី').length;
  const passedCount = list.filter((item) => item.passed).length;
  const failedCount = totalStudents - passedCount;
  const passRate = totalStudents > 0 ? ((passedCount / totalStudents) * 100).toFixed(1) : '100';
  const totalSemesterAvg = list.reduce((acc, curr) => acc + curr.semesterAvg, 0);
  const classAverage = totalStudents > 0 ? Number((totalSemesterAvg / totalStudents).toFixed(2)) : 0;

  const countA = list.filter((i) => i.letter === 'A').length;
  const countB = list.filter((i) => i.letter === 'B').length;
  const countC = list.filter((i) => i.letter === 'C').length;
  const countD = list.filter((i) => i.letter === 'D').length;
  const countE = list.filter((i) => i.letter === 'E').length;
  const countF = list.filter((i) => i.letter === 'F').length;

  return {
    list,
    students: list,
    periods,
    totalStudents,
    femaleStudents,
    passedCount,
    failedCount,
    passRate,
    classAverage,
    gradeCounts: { A: countA, B: countB, C: countC, D: countD, E: countE, F: countF },
    countA,
    countB,
    countC,
    countD,
    countE,
    countF,
  };
}

/**
 * Annual / Yearly Summary Data for each student
 */
export interface AnnualStudentSummaryItem {
  student: Student;
  sem1Avg: number; // មធ្យមភាគឆមាសទី១
  sem2Avg: number; // មធ្យមភាគឆមាសទី២
  semester1Average: number;
  semester2Average: number;
  annualAvg: number; // មធ្យមភាគប្រចាំឆ្នាំ = (ឆមាសទី១ + ឆមាសទី២) / 2
  annualAverage: number;
  rank: number;
  letter: string;
  label: string;
  classification: {
    letter: string;
    label: string;
    remarks: string;
    passed: boolean;
  };
  colorBg: string;
  colorText: string;
  badgeHex: string;
  bgHex: string;
  remarks: string;
  passed: boolean;
  annualResult: 'ឡើងថ្នាក់' | 'ត្រួតថ្នាក់';
  honorTitle: string;
}

/**
 * Calculate Annual (ប្រចាំឆ្នាំ) Summary & Rankings
 */
export function calculateAnnualSummary(
  arg1: GradeDatabase | Student[],
  arg2?: Student[] | GradeDatabase,
  arg3?: GradeThresholds,
  arg4?: string[],
  arg5?: string[],
  arg6?: string[],
  arg7?: Record<string, Record<number | string, Record<string, number>>>,
  arg8?: Record<string, string[]>
): {
  list: AnnualStudentSummaryItem[];
  students: AnnualStudentSummaryItem[];
  totalStudents: number;
  femaleStudents: number;
  passedCount: number;
  failedCount: number;
  passRate: string;
  classAverage: number;
  gradeCounts: { A: number; B: number; C: number; D: number; E: number; F: number };
  countA: number;
  countB: number;
  countC: number;
  countD: number;
  countE: number;
  countF: number;
} {
  let grades: GradeDatabase;
  let students: Student[];
  let thresholds: GradeThresholds | undefined;
  let s1Months: string[] | undefined;
  let s2Months: string[] | undefined;
  let activeSubSubjects: string[] | undefined;
  let subScoresDb: Record<string, Record<number | string, Record<string, number>>> | undefined;
  let periodSubSubjectsMap: Record<string, string[]> | undefined = arg8;

  if (Array.isArray(arg1)) {
    students = arg1;
    grades = arg2 as GradeDatabase;
    thresholds = arg3;
    s1Months = arg4;
    s2Months = arg5;
    activeSubSubjects = arg6;
    subScoresDb = arg7;
  } else {
    grades = arg1 as GradeDatabase;
    students = (arg2 as Student[]) || [];
    thresholds = arg3;
    s1Months = arg4;
    s2Months = arg5;
    activeSubSubjects = arg6;
    subScoresDb = arg7;
  }

  if (!periodSubSubjectsMap && typeof window !== 'undefined') {
    try {
      const mapSaved = localStorage.getItem('school_monitoring_period_sub_subjects');
      if (mapSaved) {
        periodSubSubjectsMap = JSON.parse(mapSaved);
      }
    } catch {}
  }

  const sem1 = calculateSemesterSummary(students, grades, 1, s1Months, thresholds, activeSubSubjects, subScoresDb, periodSubSubjectsMap);
  const sem2 = calculateSemesterSummary(students, grades, 2, s2Months, thresholds, activeSubSubjects, subScoresDb, periodSubSubjectsMap);

  const sem1Map = new Map<number, number>();
  sem1.list.forEach((item) => sem1Map.set(item.student.id, item.semesterAvg));

  const sem2Map = new Map<number, number>();
  sem2.list.forEach((item) => sem2Map.set(item.student.id, item.semesterAvg));

  const unranked = (students || []).map((student) => {
    const sem1Avg = sem1Map.get(student.id) || 0;
    const sem2Avg = sem2Map.get(student.id) || 0;
    const annualAvg = Number(((sem1Avg + sem2Avg) / 2).toFixed(2));
    const gradeInfo = getGradeClassification(annualAvg, thresholds);
    const passed = annualAvg >= (thresholds?.D || 5.0);
    const annualResult: 'ឡើងថ្នាក់' | 'ត្រួតថ្នាក់' = passed ? 'ឡើងថ្នាក់' : 'ត្រួតថ្នាក់';

    return {
      student,
      sem1Avg,
      sem2Avg,
      semester1Average: sem1Avg,
      semester2Average: sem2Avg,
      annualAvg,
      annualAverage: annualAvg,
      rank: 1,
      annualResult,
      honorTitle: '',
      classification: {
        letter: gradeInfo.letter,
        label: gradeInfo.label,
        remarks: gradeInfo.remarks,
        passed: gradeInfo.passed,
      },
      ...gradeInfo,
      passed,
    };
  });

  // Sort descending by annualAvg
  const sorted = [...unranked].sort((a, b) => b.annualAvg - a.annualAvg);
  const rankMap = new Map<number, number>();
  sorted.forEach((item, idx) => {
    rankMap.set(item.student.id, idx + 1);
  });

  const list: AnnualStudentSummaryItem[] = unranked.map((item) => {
    const rank = rankMap.get(item.student.id) || 1;
    let honorTitle = '-';
    if (rank === 1 && item.annualAvg >= 8.5) honorTitle = '🥇 សិស្សឆ្នើមលេខ ១';
    else if (rank === 2 && item.annualAvg >= 8.0) honorTitle = '🥈 សិស្សពូកែលំដាប់ទី ២';
    else if (rank === 3 && item.annualAvg >= 7.5) honorTitle = '🥉 សិស្សពូកែលំដាប់ទី ៣';
    else if (item.letter === 'A' || item.letter === 'B') honorTitle = '🎖️ ល្អប្រសើរ';

    return {
      ...item,
      rank,
      honorTitle,
    };
  });

  const totalStudents = students.length;
  const femaleStudents = students.filter((s) => s.gender === 'ស្រី').length;
  const passedCount = list.filter((item) => item.passed).length;
  const failedCount = totalStudents - passedCount;
  const passRate = totalStudents > 0 ? ((passedCount / totalStudents) * 100).toFixed(1) : '100';
  const totalAnnualAvg = list.reduce((acc, curr) => acc + curr.annualAvg, 0);
  const classAverage = totalStudents > 0 ? Number((totalAnnualAvg / totalStudents).toFixed(2)) : 0;

  const countA = list.filter((i) => i.letter === 'A').length;
  const countB = list.filter((i) => i.letter === 'B').length;
  const countC = list.filter((i) => i.letter === 'C').length;
  const countD = list.filter((i) => i.letter === 'D').length;
  const countE = list.filter((i) => i.letter === 'E').length;
  const countF = list.filter((i) => i.letter === 'F').length;

  return {
    list,
    students: list,
    totalStudents,
    femaleStudents,
    passedCount,
    failedCount,
    passRate,
    classAverage,
    gradeCounts: { A: countA, B: countB, C: countC, D: countD, E: countE, F: countF },
    countA,
    countB,
    countC,
    countD,
    countE,
    countF,
  };
}

/**
 * Export table data to CSV format
 */
export function exportGradesToCsv(
  periodTitle: string,
  academicYear: string,
  gradeLevel: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const csvContent = [
    `\uFEFF${periodTitle} - ថ្នាក់ ${gradeLevel} - ឆ្នាំសិក្សា ${academicYear}`,
    headers.join(','),
    ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Gradebook_${periodTitle.replace(/\s+/g, '_')}_${gradeLevel}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convenient period-aware CSV exporter
 */
export function exportPeriodGradesToCsv(
  students: Student[],
  grades: GradeDatabase,
  periodKey: string,
  gradeLevel: string = 'ថ្នាក់ទី ៤',
  academicYear: string = '២០២៥-២០២៦',
  periodSubSubjects?: string[],
  subScoresDb?: Record<string, Record<number | string, Record<string, number>>>
) {
  if (periodKey === 'annual_summary') {
    const data = calculateAnnualSummary(grades, students);
    const headers = ['ល.រ', 'អត្តលេខ', 'គោត្តនាម-នាម', 'ភេទ', 'ម.ភាគ ឆមាស១', 'ម.ភាគ ឆមាស២', 'ម.ភាគ ប្រចាំឆ្នាំ', 'ចំណាត់ថ្នាក់', 'និទ្ទេស', 'លទ្ធផល', 'កិត្តិយស'];
    const rows = data.list.map((item, idx) => [
      idx + 1,
      item.student.civilId || item.student.rollNo,
      item.student.name,
      item.student.gender,
      item.sem1Avg,
      item.sem2Avg,
      item.annualAvg,
      item.rank,
      item.letter,
      item.annualResult,
      item.honorTitle,
    ]);
    exportGradesToCsv('តារាងបូកសរុបលទ្ធផលប្រចាំឆ្នាំ', academicYear, gradeLevel, headers, rows);
  } else if (periodKey === 's1_summary') {
    const data = calculateSemesterSummary(grades, 1, students);
    const headers = ['ល.រ', 'អត្តលេខ', 'គោត្តនាម-នាម', 'ភេទ', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ', 'មករា', 'ម.ភាគខែ', 'ប្រឡងឆមាស១', 'ម.ភាគ ឆមាស១', 'ចំណាត់ថ្នាក់', 'និទ្ទេស', 'លទ្ធផល'];
    const rows = data.list.map((item, idx) => [
      idx + 1,
      item.student.civilId || item.student.rollNo,
      item.student.name,
      item.student.gender,
      item.monthlyAverages['m10'] || 0,
      item.monthlyAverages['m11'] || 0,
      item.monthlyAverages['m12'] || 0,
      item.monthlyAverages['m01'] || item.monthlyAverages['m1'] || 0,
      item.monthlyMean,
      item.examAvg,
      item.semesterAvg,
      item.rank,
      item.letter,
      item.passed ? 'ជាប់' : 'ធ្លាក់',
    ]);
    exportGradesToCsv('តារាងបូកសរុបប្រចាំឆមាសទី១', academicYear, gradeLevel, headers, rows);
  } else if (periodKey === 's2_summary') {
    const data = calculateSemesterSummary(grades, 2, students);
    const headers = ['ល.រ', 'អត្តលេខ', 'គោត្តនាម-នាម', 'ភេទ', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'ម.ភាគខែ', 'ប្រឡងឆមាស២', 'ម.ភាគ ឆមាស២', 'ចំណាត់ថ្នាក់', 'និទ្ទេស', 'លទ្ធផល'];
    const rows = data.list.map((item, idx) => [
      idx + 1,
      item.student.civilId || item.student.rollNo,
      item.student.name,
      item.student.gender,
      item.monthlyAverages['m02'] || item.monthlyAverages['m2'] || 0,
      item.monthlyAverages['m03'] || item.monthlyAverages['m3'] || 0,
      item.monthlyAverages['m04'] || item.monthlyAverages['m4'] || 0,
      item.monthlyAverages['m05'] || item.monthlyAverages['m5'] || 0,
      item.monthlyAverages['m06'] || item.monthlyAverages['m6'] || 0,
      item.monthlyAverages['m07'] || item.monthlyAverages['m7'] || 0,
      item.monthlyMean,
      item.examAvg,
      item.semesterAvg,
      item.rank,
      item.letter,
      item.passed ? 'ជាប់' : 'ធ្លាក់',
    ]);
    exportGradesToCsv('តារាងបូកសរុបប្រចាំឆមាសទី២', academicYear, gradeLevel, headers, rows);
  } else {
    const periodInfo = GRADE_PERIODS.find((p) => p.key === periodKey) || GRADE_PERIODS[0];
    const data = calculateSinglePeriodSummary(
      students,
      grades,
      periodKey,
      undefined,
      periodSubSubjects,
      subScoresDb
    );

    const allSubs = getAllPrimarySubSubjects();
    const activeSubDefs = (periodSubSubjects && periodSubSubjects.length > 0)
      ? periodSubSubjects.map(id => allSubs.find(s => s.id === id) || { id, name: id, category: 'other' as const, defaultSelected: true })
      : null;

    if (activeSubDefs && activeSubDefs.length > 0) {
      const headers = [
        'ល.រ',
        'អត្តលេខ',
        'គោត្តនាម-នាម',
        'ភេទ',
        ...activeSubDefs.map(s => s.name),
        'ពិន្ទុសរុប',
        'មធ្យមភាគ',
        'ចំណាត់ថ្នាក់',
        'និទ្ទេស',
        'លទ្ធផល',
      ];
      const rows = data.list.map((item, idx) => {
        const sId = item.student.id;
        const subScores = {
          ...(grades[periodKey]?.[sId]?.subScores || {}),
          ...(subScoresDb?.[periodKey]?.[sId] || {})
        };
        const subCells = activeSubDefs.map(s => subScores[s.id] !== undefined ? subScores[s.id] : 0);
        return [
          idx + 1,
          item.student.civilId || item.student.rollNo,
          item.student.name,
          item.student.gender,
          ...subCells,
          item.total,
          item.avg,
          item.rank,
          item.letter,
          item.passed ? 'ជាប់' : 'ធ្លាក់',
        ];
      });
      exportGradesToCsv(periodInfo.label, academicYear, gradeLevel, headers, rows);
    } else {
      const headers = ['ល.រ', 'អត្តលេខ', 'គោត្តនាម-នាម', 'ភេទ', 'ភាសាខ្មែរ', 'គណិតវិទ្យា', 'វិទ្យាសាស្ត្រ', 'សិក្សាសង្គម', 'ពិន្ទុសរុប', 'មធ្យមភាគ', 'ចំណាត់ថ្នាក់', 'និទ្ទេស', 'លទ្ធផល'];
      const rows = data.list.map((item, idx) => [
        idx + 1,
        item.student.civilId || item.student.rollNo,
        item.student.name,
        item.student.gender,
        item.khmer,
        item.math,
        item.science,
        item.social,
        item.total,
        item.avg,
        item.rank,
        item.letter,
        item.passed ? 'ជាប់' : 'ធ្លាក់',
      ]);
      exportGradesToCsv(periodInfo.label, academicYear, gradeLevel, headers, rows);
    }
  }
}

export interface PrimarySubSubject {
  id: string;
  name: string;
  category: 'khmer' | 'math' | 'science' | 'social' | 'other';
  defaultSelected: boolean;
}

export const PRIMARY_SUB_SUBJECTS: PrimarySubSubject[] = [
  { id: 'writing', name: 'សមត្ថភាពសរសេរ', category: 'khmer', defaultSelected: true },
  { id: 'listening', name: 'សមត្ថភាពស្ដាប់', category: 'khmer', defaultSelected: true },
  { id: 'reading', name: 'សមត្ថភាពអាន', category: 'khmer', defaultSelected: true },
  { id: 'speaking', name: 'សមត្ថភាពនិយាយ', category: 'khmer', defaultSelected: true },
  { id: 'algebra', name: 'ពីជគណិត', category: 'math', defaultSelected: true },
  { id: 'number', name: 'ចំនួន', category: 'math', defaultSelected: true },
  { id: 'geometry', name: 'ធរណីមាត្រ', category: 'math', defaultSelected: true },
  { id: 'measurement', name: 'រង្វាស់រង្វាល់', category: 'math', defaultSelected: true },
  { id: 'statistics', name: 'ស្ថិតិ', category: 'math', defaultSelected: false },
  { id: 'chemistry', name: 'គីមីវិទ្យា', category: 'science', defaultSelected: false },
  { id: 'biology', name: 'ជីវវិទ្យា', category: 'science', defaultSelected: true },
  { id: 'earth_env', name: 'ផែនដី-បរិស្ថានវិទ្យា', category: 'science', defaultSelected: true },
  { id: 'physics', name: 'រូបវិទ្យា', category: 'science', defaultSelected: false },
  { id: 'morals_civics', name: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', category: 'social', defaultSelected: true },
  { id: 'home_arts', name: 'គេហវិទ្យា-អប់រំសិល្បៈ', category: 'social', defaultSelected: true },
  { id: 'history', name: 'ប្រវត្តិវិទ្យា', category: 'social', defaultSelected: true },
  { id: 'geography', name: 'ភូមិវិទ្យា', category: 'social', defaultSelected: true },
  { id: 'health_hygiene', name: 'សុខភាព-អនាម័យ', category: 'other', defaultSelected: true },
  { id: 'pe_sports', name: 'អប់រំកាយ-កីឡា', category: 'other', defaultSelected: true },
  { id: 'life_skills', name: 'អប់រំបំណិនជីវិត', category: 'other', defaultSelected: true },
  { id: 'foreign_lang', name: 'ភាសាបរទេស', category: 'other', defaultSelected: false },
  { id: 'others', name: 'ផ្សេងៗ', category: 'other', defaultSelected: false },
];

export function getCustomSubSubjects(): PrimarySubSubject[] {
  try {
    const saved = localStorage.getItem('school_custom_sub_subjects');
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export function saveCustomSubSubjects(customs: PrimarySubSubject[]) {
  try {
    localStorage.setItem('school_custom_sub_subjects', JSON.stringify(customs));
  } catch {}
}

export function getAllPrimarySubSubjects(): PrimarySubSubject[] {
  const customs = getCustomSubSubjects();
  return [...PRIMARY_SUB_SUBJECTS, ...customs];
}


