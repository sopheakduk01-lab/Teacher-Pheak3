import { GradeDatabase, StudentGrade, Student } from '../types';

export type GradePeriodKey =
  | 'm10'
  | 'm11'
  | 'm12'
  | 'm01'
  | 's1'
  | 's1_summary'
  | 'm02'
  | 'm03'
  | 'm04'
  | 'm05'
  | 'm06'
  | 's2'
  | 's2_summary'
  | 'annual_summary';

export type GradeSubject = 'khmer' | 'math' | 'science' | 'social';

export interface GradePeriodInfo {
  key: GradePeriodKey;
  label: string;
  semester: 1 | 2;
  shortLabel?: string;
  isExam?: boolean;
}

export const GRADE_PERIODS: GradePeriodInfo[] = [
  { key: 'm10', label: 'ខែ តុលា', semester: 1, shortLabel: 'តុលា' },
  { key: 'm11', label: 'ខែ វិច្ឆិកា', semester: 1, shortLabel: 'វិច្ឆិកា' },
  { key: 'm12', label: 'ខែ ធ្នូ', semester: 1, shortLabel: 'ធ្នូ' },
  { key: 'm01', label: 'ខែ មករា', semester: 1, shortLabel: 'មករា' },
  { key: 's1', label: 'ប្រឡងឆមាសទី១', semester: 1, shortLabel: 'ឆមាស១', isExam: true },
  { key: 's1_summary', label: 'សង្ខេបឆមាសទី១', semester: 1, shortLabel: 'សង្ខេប ឆ១' },
  { key: 'm02', label: 'ខែ កុម្ភៈ', semester: 2, shortLabel: 'កុម្ភៈ' },
  { key: 'm03', label: 'ខែ មីនា', semester: 2, shortLabel: 'មីនា' },
  { key: 'm04', label: 'ខែ មេសា', semester: 2, shortLabel: 'មេសា' },
  { key: 'm05', label: 'ខែ ឧសភា', semester: 2, shortLabel: 'ឧសភា' },
  { key: 'm06', label: 'ខែ មិថុនា', semester: 2, shortLabel: 'មិថុនា' },
  { key: 's2', label: 'ប្រឡងឆមាសទី២', semester: 2, shortLabel: 'ឆមាស២', isExam: true },
  { key: 's2_summary', label: 'សង្ខេបឆមាសទី២', semester: 2, shortLabel: 'សង្ខេប ឆ២' },
  { key: 'annual_summary', label: 'សង្ខេបប្រចាំឆ្នាំ', semester: 2, shortLabel: 'ប្រចាំឆ្នាំ' },
];

export const SEMESTER_1_ENTRY_PERIODS: GradePeriodKey[] = ['m10', 'm11', 'm12', 'm01', 's1'];
export const SEMESTER_2_ENTRY_PERIODS: GradePeriodKey[] = ['m02', 'm03', 'm04', 'm05', 'm06', 's2'];
export const ALL_ENTRY_MONTHS: GradePeriodInfo[] = [
  { key: 'm10', label: 'ខែ តុលា', semester: 1, shortLabel: 'តុលា' },
  { key: 'm11', label: 'ខែ វិច្ឆិកា', semester: 1, shortLabel: 'វិច្ឆិកា' },
  { key: 'm12', label: 'ខែ ធ្នូ', semester: 1, shortLabel: 'ធ្នូ' },
  { key: 'm01', label: 'ខែ មករា', semester: 1, shortLabel: 'មករា' },
  { key: 'm02', label: 'ខែ កុម្ភៈ', semester: 2, shortLabel: 'កុម្ភៈ' },
  { key: 'm03', label: 'ខែ មីនា', semester: 2, shortLabel: 'មីនា' },
  { key: 'm04', label: 'ខែ មេសា', semester: 2, shortLabel: 'មេសា' },
  { key: 'm05', label: 'ខែ ឧសភា', semester: 2, shortLabel: 'ឧសភា' },
  { key: 'm06', label: 'ខែ មិថុនា', semester: 2, shortLabel: 'មិថុនា' },
];

export const defaultMultiPeriodGrades: GradeDatabase = {};

export interface PrimarySubSubject {
  id: string;
  name: string;
  maxScore: number;
  subject: string;
  category?: 'khmer' | 'math' | 'science' | 'social' | 'other';
}

export function getAllPrimarySubSubjects(): PrimarySubSubject[] {
  return [
    { id: 'kh_dictation', name: 'សរសេរតាមអាន', maxScore: 10, subject: 'ភាសាខ្មែរ', category: 'khmer' },
    { id: 'kh_reading', name: 'អំណានយល់ន័យ', maxScore: 10, subject: 'ភាសាខ្មែរ', category: 'khmer' },
    { id: 'kh_grammar', name: 'វេយ្យាករណ៍', maxScore: 10, subject: 'ភាសាខ្មែរ', category: 'khmer' },
    { id: 'math_arithmetic', name: 'ប្រមាណវិធីលេខ', maxScore: 10, subject: 'គណិតវិទ្យា', category: 'math' },
    { id: 'math_word_problem', name: 'ចំណោទ', maxScore: 10, subject: 'គណិតវិទ្យា', category: 'math' },
    { id: 'sci_experiment', name: 'វិទ្យាសាស្ត្រអនុវត្ត', maxScore: 10, subject: 'វិទ្យាសាស្ត្រ', category: 'science' },
    { id: 'soc_geography', name: 'ភូមិវិទ្យា និងប្រវត្តិវិទ្យា', maxScore: 10, subject: 'សិក្សាសង្គម', category: 'social' },
  ];
}

export const PRIMARY_SUB_SUBJECTS = getAllPrimarySubSubjects();

export function getCustomSubSubjects(): PrimarySubSubject[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem('custom_sub_subjects');
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

export function saveCustomSubSubjects(subs: PrimarySubSubject[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('custom_sub_subjects', JSON.stringify(subs));
}

export function getStudentGrade(
  grades: GradeDatabase,
  periodKey: string,
  studentId: number
): StudentGrade {
  const period = (grades && grades[periodKey]) || {};
  return (period[studentId] || { khmer: 0, math: 0, science: 0, social: 0 }) as StudentGrade;
}

export interface GradeClassificationResult {
  letter: string;
  label: string;
  mention: string;
  color: string;
  colorBg: string;
  colorText: string;
}

export function getGradeClassification(
  average: number,
  thresholds?: { A: number; B: number; C: number; D: number; E: number }
): GradeClassificationResult {
  const t = thresholds || { A: 8.5, B: 7.5, C: 6.5, D: 5.0, E: 4.0 };
  const normalized = (average > 10 && t.A <= 10) ? average / 10 : average;

  if (normalized >= t.A) {
    return {
      letter: 'A',
      label: 'ល្អណាស់',
      mention: 'ល្អណាស់',
      color: 'text-emerald-700',
      colorBg: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
      colorText: 'text-emerald-700',
    };
  }
  if (normalized >= t.B) {
    return {
      letter: 'B',
      label: 'ល្អ',
      mention: 'ល្អ',
      color: 'text-blue-700',
      colorBg: 'bg-blue-100 text-blue-900 border border-blue-200',
      colorText: 'text-blue-700',
    };
  }
  if (normalized >= t.C) {
    return {
      letter: 'C',
      label: 'មធ្យម',
      mention: 'មធ្យម',
      color: 'text-amber-700',
      colorBg: 'bg-amber-100 text-amber-900 border border-amber-200',
      colorText: 'text-amber-700',
    };
  }
  if (normalized >= t.D) {
    return {
      letter: 'D',
      label: 'គួរគប្បី',
      mention: 'គួរគប្បី',
      color: 'text-orange-700',
      colorBg: 'bg-orange-100 text-orange-900 border border-orange-200',
      colorText: 'text-orange-700',
    };
  }
  if (normalized >= t.E) {
    return {
      letter: 'E',
      label: 'ខ្សោយ',
      mention: 'ខ្សោយ',
      color: 'text-yellow-700',
      colorBg: 'bg-yellow-100 text-yellow-900 border border-yellow-200',
      colorText: 'text-yellow-700',
    };
  }
  return {
    letter: 'F',
    label: 'ធ្លាក់',
    mention: 'ធ្លាក់',
    color: 'text-rose-700',
    colorBg: 'bg-rose-100 text-rose-900 border border-rose-200',
    colorText: 'text-rose-700',
  };
}

export function calculateStudentGrade(grade: Partial<StudentGrade>): StudentGrade {
  const khmer = Number(grade.khmer || 0);
  const math = Number(grade.math || 0);
  const science = Number(grade.science || 0);
  const social = Number(grade.social || 0);

  const total = Number((khmer + math + science + social).toFixed(2));
  const average = Number((total / 4).toFixed(2));
  const classification = getGradeClassification(average);

  return {
    ...grade,
    khmer,
    math,
    science,
    social,
    total,
    average,
    mention: classification.mention,
  };
}

export interface SinglePeriodStudentSummaryItem {
  student: Student;
  grade: StudentGrade;
  total: number;
  average: number;
  rank: number;
  classification: GradeClassificationResult;
  passed: boolean;
}

export interface PeriodSummaryResult {
  average: number;
  studentsCount: number;
  totalStudents: number;
  femaleStudents: number;
  passedCount: number;
  failedCount: number;
  passRate: string;
  classAverage: number;
  gradeCounts: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
  };
  students: SinglePeriodStudentSummaryItem[];
}

export function calculateSinglePeriodSummary(
  students: Student[],
  grades: GradeDatabase,
  periodKey: string,
  thresholds?: { A: number; B: number; C: number; D: number; E: number },
  activeSubSubjects?: string[],
  subScoresState?: Record<string, Record<number | string, Record<string, number>>>,
  periodSubSubjectsMap?: Record<string, string[]>
): PeriodSummaryResult {
  const period = (grades && grades[periodKey]) || {};
  const studentList = Array.isArray(students) ? students : [];

  const currentSubs = (periodSubSubjectsMap?.[periodKey]?.length ? periodSubSubjectsMap[periodKey] : activeSubSubjects) || [];
  const allDefs = getAllPrimarySubSubjects();

  const studentItems: SinglePeriodStudentSummaryItem[] = studentList.map((s) => {
    const rawG = (period[s.id] || {}) as StudentGrade;
    const sSub = (subScoresState?.[periodKey]?.[s.id]) || rawG.subScores || {};

    let khmer = Number(rawG.khmer || 0);
    let math = Number(rawG.math || 0);
    let science = Number(rawG.science || 0);
    let social = Number(rawG.social || 0);

    // If sub-subjects are configured and have scores for this student, recalculate
    if (currentSubs.length > 0) {
      let khSubTotal = 0;
      let khSubCount = 0;
      let maSubTotal = 0;
      let maSubCount = 0;
      let scSubTotal = 0;
      let scSubCount = 0;
      let soSubTotal = 0;
      let soSubCount = 0;

      currentSubs.forEach((subId) => {
        const val = sSub[subId] !== undefined ? Number(sSub[subId]) : 0;
        const def = allDefs.find((d) => d.id === subId);
        const cat = def?.category || (subId.startsWith('kh_') ? 'khmer' : subId.startsWith('math_') ? 'math' : subId.startsWith('sci_') ? 'science' : subId.startsWith('soc_') ? 'social' : 'other');

        if (cat === 'khmer') { khSubTotal += val; khSubCount++; }
        else if (cat === 'math') { maSubTotal += val; maSubCount++; }
        else if (cat === 'science') { scSubTotal += val; scSubCount++; }
        else if (cat === 'social') { soSubTotal += val; soSubCount++; }
      });

      if (khSubCount > 0 && khSubTotal > 0) khmer = Number(khSubTotal.toFixed(2));
      if (maSubCount > 0 && maSubTotal > 0) math = Number(maSubTotal.toFixed(2));
      if (scSubCount > 0 && scSubTotal > 0) science = Number(scSubTotal.toFixed(2));
      if (soSubCount > 0 && soSubTotal > 0) social = Number(soSubTotal.toFixed(2));
    }

    const total = Number((khmer + math + science + social).toFixed(2));
    const average = Number((total / 4).toFixed(2));
    const classification = getGradeClassification(average, thresholds);
    const passed = classification.letter !== 'F';

    const grade: StudentGrade = {
      ...rawG,
      khmer,
      math,
      science,
      social,
      subScores: sSub,
      total,
      average,
      mention: classification.mention,
    };

    return {
      student: s,
      grade,
      total,
      average,
      rank: 1,
      classification,
      passed,
    };
  });

  // Assign ranks based on average score (highest score = rank 1)
  const sortedByAvg = [...studentItems].sort((a, b) => b.average - a.average || b.total - a.total);
  const rankMap = new Map<number | string, number>();
  let curRank = 1;
  sortedByAvg.forEach((item, idx) => {
    if (idx > 0 && item.average < sortedByAvg[idx - 1].average) {
      curRank = idx + 1;
    }
    rankMap.set(item.student.id, curRank);
  });

  studentItems.forEach((item) => {
    item.rank = rankMap.get(item.student.id) || 1;
    if (item.grade) {
      item.grade.rank = item.rank;
    }
  });

  const totalStudents = studentList.length;
  const femaleStudents = studentList.filter((s) => s.gender === 'ស្រី').length;
  const passedCount = studentItems.filter((i) => i.passed).length;
  const failedCount = totalStudents - passedCount;
  const passRate = totalStudents > 0 ? ((passedCount / totalStudents) * 100).toFixed(1) : '0.0';
  const totalAvgSum = studentItems.reduce((acc, i) => acc + i.average, 0);
  const classAverage = totalStudents > 0 ? Number((totalAvgSum / totalStudents).toFixed(2)) : 0;

  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  studentItems.forEach((i) => {
    const l = i.classification.letter as keyof typeof gradeCounts;
    if (gradeCounts[l] !== undefined) {
      gradeCounts[l]++;
    }
  });

  return {
    average: classAverage,
    studentsCount: totalStudents,
    totalStudents,
    femaleStudents,
    passedCount,
    failedCount,
    passRate,
    classAverage,
    gradeCounts,
    students: studentItems,
  };
}

export interface SemesterStudentSummaryItem {
  student: Student;
  monthlyAverages: Record<string, string>;
  monthlyOverallAverage: string;
  examAverage: string;
  semesterAverage: number;
  rank: number;
  classification: GradeClassificationResult;
  passed: boolean;
}

export interface SemesterSummaryResult {
  totalStudents: number;
  femaleStudents: number;
  passedCount: number;
  failedCount: number;
  passRate: string;
  classAverage: number;
  gradeCounts: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
  };
  students: SemesterStudentSummaryItem[];
}

export function calculateSemesterSummary(
  students: Student[],
  grades: GradeDatabase,
  semester: 1 | 2,
  selectedMonths?: string[],
  thresholds?: { A: number; B: number; C: number; D: number; E: number },
  activeSubSubjects?: string[],
  subScoresState?: Record<string, Record<number | string, Record<string, number>>>,
  periodSubSubjectsMap?: Record<string, string[]>
): SemesterSummaryResult {
  const studentList = Array.isArray(students) ? students : [];
  const defaultMonths = semester === 1 ? ['m10', 'm11', 'm12', 'm01'] : ['m02', 'm03', 'm04', 'm05', 'm06'];
  const months = (selectedMonths && selectedMonths.length > 0) ? selectedMonths : defaultMonths;
  const examPeriod = semester === 1 ? 's1' : 's2';

  // Calculate each month's summary and the exam period summary
  const monthSummaries: Record<string, PeriodSummaryResult> = {};
  months.forEach((mKey) => {
    monthSummaries[mKey] = calculateSinglePeriodSummary(
      studentList,
      grades,
      mKey,
      thresholds,
      activeSubSubjects,
      subScoresState,
      periodSubSubjectsMap
    );
  });

  const examSummary = calculateSinglePeriodSummary(
    studentList,
    grades,
    examPeriod,
    thresholds,
    activeSubSubjects,
    subScoresState,
    periodSubSubjectsMap
  );

  const studentItems: SemesterStudentSummaryItem[] = studentList.map((s) => {
    const monthlyAverages: Record<string, string> = {};
    let monthSum = 0;
    let validMonths = 0;

    months.forEach((mKey) => {
      const item = monthSummaries[mKey]?.students.find((st) => st.student.id === s.id);
      const avg = item ? item.average : 0;
      monthlyAverages[mKey] = avg.toFixed(2);
      monthSum += avg;
      validMonths++;
    });

    const monthlyOverallNum = validMonths > 0 ? monthSum / validMonths : 0;
    const monthlyOverallAverage = monthlyOverallNum.toFixed(2);

    const examItem = examSummary.students.find((st) => st.student.id === s.id);
    const examAvgNum = examItem ? examItem.average : 0;
    const examAverage = examAvgNum.toFixed(2);

    // MoEYS formula: (Monthly Overall Average + Exam Average) / 2
    const semesterAvgNum = (examAvgNum > 0 || monthlyOverallNum > 0)
      ? Number(((monthlyOverallNum + examAvgNum) / 2).toFixed(2))
      : 0;

    const classification = getGradeClassification(semesterAvgNum, thresholds);
    const passed = classification.letter !== 'F';

    return {
      student: s,
      monthlyAverages,
      monthlyOverallAverage,
      examAverage,
      semesterAverage: semesterAvgNum,
      rank: 1,
      classification,
      passed,
    };
  });

  // Assign ranks
  const sorted = [...studentItems].sort((a, b) => b.semesterAverage - a.semesterAverage);
  const rankMap = new Map<number | string, number>();
  let curRank = 1;
  sorted.forEach((item, idx) => {
    if (idx > 0 && item.semesterAverage < sorted[idx - 1].semesterAverage) {
      curRank = idx + 1;
    }
    rankMap.set(item.student.id, curRank);
  });

  studentItems.forEach((item) => {
    item.rank = rankMap.get(item.student.id) || 1;
  });

  const totalStudents = studentList.length;
  const femaleStudents = studentList.filter((s) => s.gender === 'ស្រី').length;
  const passedCount = studentItems.filter((i) => i.passed).length;
  const failedCount = totalStudents - passedCount;
  const passRate = totalStudents > 0 ? ((passedCount / totalStudents) * 100).toFixed(1) : '0.0';
  const totalAvgSum = studentItems.reduce((acc, i) => acc + i.semesterAverage, 0);
  const classAverage = totalStudents > 0 ? Number((totalAvgSum / totalStudents).toFixed(2)) : 0;

  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  studentItems.forEach((i) => {
    const l = i.classification.letter as keyof typeof gradeCounts;
    if (gradeCounts[l] !== undefined) {
      gradeCounts[l]++;
    }
  });

  return {
    totalStudents,
    femaleStudents,
    passedCount,
    failedCount,
    passRate,
    classAverage,
    gradeCounts,
    students: studentItems,
  };
}

export interface AnnualStudentSummaryItem {
  student: Student;
  semester1Average: number | string;
  semester2Average: number | string;
  annualAverage: number;
  rank: number;
  classification: GradeClassificationResult;
  passed: boolean;
  honorTitle?: string;
}

export interface AnnualSummaryResult {
  totalStudents: number;
  femaleStudents: number;
  passedCount: number;
  failedCount: number;
  passRate: string;
  classAverage: number;
  gradeCounts: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
  };
  students: AnnualStudentSummaryItem[];
}

export function calculateAnnualSummary(
  students: Student[],
  grades: GradeDatabase,
  thresholds?: { A: number; B: number; C: number; D: number; E: number },
  selectedS1Months?: string[],
  selectedS2Months?: string[],
  activeSubSubjects?: string[],
  subScoresState?: Record<string, Record<number | string, Record<string, number>>>,
  periodSubSubjectsMap?: Record<string, string[]>
): AnnualSummaryResult {
  const studentList = Array.isArray(students) ? students : [];

  const s1Result = calculateSemesterSummary(
    studentList,
    grades,
    1,
    selectedS1Months,
    thresholds,
    activeSubSubjects,
    subScoresState,
    periodSubSubjectsMap
  );

  const s2Result = calculateSemesterSummary(
    studentList,
    grades,
    2,
    selectedS2Months,
    thresholds,
    activeSubSubjects,
    subScoresState,
    periodSubSubjectsMap
  );

  const studentItems: AnnualStudentSummaryItem[] = studentList.map((s) => {
    const s1Item = s1Result.students.find((st) => st.student.id === s.id);
    const s2Item = s2Result.students.find((st) => st.student.id === s.id);

    const s1Avg = s1Item ? s1Item.semesterAverage : 0;
    const s2Avg = s2Item ? s2Item.semesterAverage : 0;

    const annualAvgNum = (s1Avg > 0 && s2Avg > 0)
      ? Number(((s1Avg + s2Avg) / 2).toFixed(2))
      : (s1Avg > 0 ? s1Avg : s2Avg > 0 ? s2Avg : 0);

    const classification = getGradeClassification(annualAvgNum, thresholds);
    const passed = classification.letter !== 'F';

    return {
      student: s,
      semester1Average: s1Avg > 0 ? s1Avg.toFixed(2) : '0.00',
      semester2Average: s2Avg > 0 ? s2Avg.toFixed(2) : '0.00',
      annualAverage: annualAvgNum,
      rank: 1,
      classification,
      passed,
    };
  });

  // Assign ranks
  const sorted = [...studentItems].sort((a, b) => b.annualAverage - a.annualAverage);
  const rankMap = new Map<number | string, number>();
  let curRank = 1;
  sorted.forEach((item, idx) => {
    if (idx > 0 && item.annualAverage < sorted[idx - 1].annualAverage) {
      curRank = idx + 1;
    }
    rankMap.set(item.student.id, curRank);
  });

  studentItems.forEach((item) => {
    item.rank = rankMap.get(item.student.id) || 1;
    item.honorTitle =
      item.rank === 1
        ? '🥇 សិស្សឆ្នើមលេខ១'
        : item.rank === 2
        ? '🥈 លេខ ២'
        : item.rank === 3
        ? '🥉 លេខ ៣'
        : item.classification.letter === 'A'
        ? '⭐ ល្អប្រសើរ'
        : undefined;
  });

  const totalStudents = studentList.length;
  const femaleStudents = studentList.filter((s) => s.gender === 'ស្រី').length;
  const passedCount = studentItems.filter((i) => i.passed).length;
  const failedCount = totalStudents - passedCount;
  const passRate = totalStudents > 0 ? ((passedCount / totalStudents) * 100).toFixed(1) : '0.0';
  const totalAvgSum = studentItems.reduce((acc, i) => acc + i.annualAverage, 0);
  const classAverage = totalStudents > 0 ? Number((totalAvgSum / totalStudents).toFixed(2)) : 0;

  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  studentItems.forEach((i) => {
    const l = i.classification.letter as keyof typeof gradeCounts;
    if (gradeCounts[l] !== undefined) {
      gradeCounts[l]++;
    }
  });

  return {
    totalStudents,
    femaleStudents,
    passedCount,
    failedCount,
    passRate,
    classAverage,
    gradeCounts,
    students: studentItems,
  };
}

export function updateStudentGradeRecord(
  prevGrades: GradeDatabase,
  periodKey: string,
  studentId: number,
  subject: string,
  value: number
): GradeDatabase {
  const currentPeriod = ((prevGrades && prevGrades[periodKey]) || {}) as Record<number, StudentGrade>;
  const currentStudentGrade = currentPeriod[studentId] || { khmer: 0, math: 0, science: 0, social: 0 };

  const updatedSubjectGrade = {
    ...currentStudentGrade,
    [subject]: value,
  };

  const recalculated = calculateStudentGrade(updatedSubjectGrade);

  return {
    ...prevGrades,
    [periodKey]: {
      ...currentPeriod,
      [studentId]: recalculated,
    },
  };
}

export function exportGradesToCsv(
  arg1: any,
  arg2?: any,
  arg3?: any,
  headers?: any[],
  rows?: any[][]
): void {
  let csvContent = '';
  let filename = 'grades_export.csv';

  if (Array.isArray(headers) && Array.isArray(rows)) {
    filename = `${arg1 || 'grades'}.csv`;
    const allRows = [headers, ...rows];
    csvContent = '\uFEFF' + allRows.map((e) => e.map((cell) => `"${cell ?? ''}"`).join(',')).join('\n');
  } else {
    const students = Array.isArray(arg1) ? arg1 : [];
    const grades = (arg2 || {}) as GradeDatabase;
    const periodKey = typeof arg3 === 'string' ? arg3 : 'm10';
    filename = `grades_${periodKey}_${new Date().toISOString().slice(0, 10)}.csv`;

    const period = ((grades && grades[periodKey]) || {}) as Record<number, StudentGrade>;
    const defaultRows = [
      ['ល.រ', 'អត្តលេខ', 'គោត្តនាម និងនាម', 'ភេទ', 'ភាសាខ្មែរ', 'គណិតវិទ្យា', 'វិទ្យាសាស្ត្រ', 'សិក្សាសង្គម', 'សរុប', 'មធ្យមភាគ', 'និទ្ទេស', 'ចំណាត់ថ្នាក់'],
    ];

    students.forEach((s, idx) => {
      const g = period[s.id] || { khmer: 0, math: 0, science: 0, social: 0 };
      const tot = Number(g.total ?? (Number(g.khmer || 0) + Number(g.math || 0) + Number(g.science || 0) + Number(g.social || 0)));
      const avg = Number(g.average ?? (tot / 4));
      defaultRows.push([
        String(idx + 1),
        String(s.rollNo || s.id),
        s.name || '',
        s.gender === 'female' || s.gender === 'ស្រី' ? 'ស្រី' : 'ប្រុស',
        String(g.khmer ?? ''),
        String(g.math ?? ''),
        String(g.science ?? ''),
        String(g.social ?? ''),
        String(tot.toFixed(2)),
        String(avg.toFixed(2)),
        g.mention || '',
        String(g.rank ?? ''),
      ]);
    });
    csvContent = '\uFEFF' + defaultRows.map((e) => e.map((cell) => `"${cell}"`).join(',')).join('\n');
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const exportPeriodGradesToCsv = exportGradesToCsv;
