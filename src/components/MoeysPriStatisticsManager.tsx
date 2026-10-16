import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Student, TeacherProfile } from '../types';
import { saveYearScopedData, loadYearScopedData } from '../utils/academicYearStorage';
import {
  Printer,
  Save,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  RefreshCw,
  Info,
  Users,
  Calendar,
} from 'lucide-react';

// =========================================================================
// TYPES & INTERFACES (Strict MoEYS PRI Model matching Official Template)
// =========================================================================

export interface EarlyChildhoodRow {
  newTotal: number;
  newFemale: number;
  repeatTotal: number;
  repeatFemale: number;
}

export interface AgeBreakdownRow {
  newTotal: number;
  newFemale: number;
  repeatTotal: number;
  repeatFemale: number;
}

export interface DifficultyRow {
  total: number;
  female: number;
}

export interface IndigenousRow {
  total: number;
  female: number;
}

export interface PriFormData {
  // Header metadata
  province: string;
  district: string;
  schoolName: string;
  grade: string;
  academicYear: string;
  asOfDateText: string;

  // 1. Teacher Information
  teacherNameKh: string;
  teacherGender: 'ប្រុស' | 'ស្រី';
  teacherAge: string;
  isIndigenous: 'ពិតមែន' | 'ទេ';
  educationLevel: string;
  yearsInService: string;
  teachingGrade: string;

  // 2.(ក) Grade 1 Early Childhood Transitions
  earlyChildhood: {
    statePreschool: EarlyChildhoodRow;
    privatePreschool: EarlyChildhoodRow;
    communityPreschool: EarlyChildhoodRow;
    homeBased: EarlyChildhoodRow;
    grade1Prep: EarlyChildhoodRow;
  };

  // 2.(ខ) Age Breakdown
  ageBreakdown: Record<string, AgeBreakdownRow>;

  // 3. Students Facing Difficulties & Disabilities (16 Rows matching template)
  difficulties: {
    vision: DifficultyRow; // ពិបាកក្នុងការមើល
    hearing: DifficultyRow; // ពិបាកក្នុងការស្តាប់
    speech: DifficultyRow; // ពិបាកក្នុងការនិយាយ
    writing: DifficultyRow; // ពិបាកក្នុងការសរសេរ
    movement: DifficultyRow; // ពិបាកក្នុងការធ្វើចលនា
    learning: DifficultyRow; // ពិបាកក្នុងការរៀនសូត្រ
    mental: DifficultyRow; // ពិបាកខាងផ្លូវចិត្ត
    severeMalnutrition: DifficultyRow; // ខ្វះអាហារូបត្ថម្ភធ្ងន់ធ្ងរ
    chronicHealth: DifficultyRow; // សុខភាព/ជំងឺប្រចាំកាយ
    migrantFamily: DifficultyRow; // មកពីគ្រួសារផ្លាស់ប្តូរទីលំនៅ
    orphan: DifficultyRow; // កុមារកំព្រា
    domesticViolence: DifficultyRow; // កុមាររងអំពើហិង្សាក្នុងគ្រួសារ
    childLabor: DifficultyRow; // កុមាររងការកេងប្រវ័ញ្ចពលកម្ម
    sensory: DifficultyRow; // បញ្ហាកាយវិញ្ញាណ
    epilepsy: DifficultyRow; // ជំងឺប្រកាច់
    totalDisabled: DifficultyRow; // ចំនួនសិស្សពិការ*
  };

  // 4. Indigenous Students
  indigenousBreakdown: {
    age6: IndigenousRow;
    age6To11: IndigenousRow;
    age12Plus: IndigenousRow;
  };

  // Date & Signature
  dateDay: string;
  dateMonth: string;
  dateYear: string;
  teacherSignatureName: string;
}

interface MoeysPriStatisticsManagerProps {
  teacher: TeacherProfile;
  currentYear?: string;
  students: Student[];
  onUpdateStudent?: (student: Student) => void;
  onUpdateStudents?: (students: Student[]) => void;
  onShowToast: (msg: string) => void;
}

// Ordered age rows matching the official MoEYS template image
const AGE_ROWS = [
  '70-71 ខែ',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15+',
];

// 16 Difficulty rows matching the official MoEYS template image
const DIFFICULTY_CONFIG: { key: keyof PriFormData['difficulties']; label: string; isBold?: boolean }[] = [
  { key: 'vision', label: 'ពិបាកក្នុងការមើល' },
  { key: 'hearing', label: 'ពិបាកក្នុងការស្តាប់' },
  { key: 'speech', label: 'ពិបាកក្នុងការនិយាយ' },
  { key: 'writing', label: 'ពិបាកក្នុងការសរសេរ' },
  { key: 'movement', label: 'ពិបាកក្នុងការធ្វើចលនា' },
  { key: 'learning', label: 'ពិបាកក្នុងការរៀនសូត្រ' },
  { key: 'mental', label: 'ពិបាកខាងផ្លូវចិត្ត' },
  { key: 'severeMalnutrition', label: 'ខ្វះអាហារូបត្ថម្ភធ្ងន់ធ្ងរ' },
  { key: 'chronicHealth', label: 'សុខភាព/ជំងឺប្រចាំកាយ' },
  { key: 'migrantFamily', label: 'មកពីគ្រួសារផ្លាស់ប្តូរទីលំនៅ' },
  { key: 'orphan', label: 'កុមារកំព្រា' },
  { key: 'domesticViolence', label: 'កុមាររងអំពើហិង្សាក្នុងគ្រួសារ' },
  { key: 'childLabor', label: 'កុមាររងការកេងប្រវ័ញ្ចពលកម្ម' },
  { key: 'sensory', label: 'បញ្ហាកាយវិញ្ញាណ' },
  { key: 'epilepsy', label: 'ជំងឺប្រកាច់' },
  { key: 'totalDisabled', label: 'ចំនួនសិស្សពិការ*', isBold: true },
];

// Helper: Convert Arabic digits to Khmer numerals
export function toKhmerNum(num: number | string): string {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return String(num).replace(/[0-9]/g, (d) => khmerDigits[parseInt(d, 10)]);
}

// Helper: Convert Khmer numerals to Arabic digits
export function khmerToArabicNumbers(str: string): string {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  let result = str;
  khmerDigits.forEach((kd, idx) => {
    result = result.split(kd).join(String(idx));
  });
  return result;
}

// Get current date components in Khmer numerals
export function getCurrentKhmerDate() {
  const now = new Date();
  const day = toKhmerNum(String(now.getDate()).padStart(2, '0'));
  const month = toKhmerNum(String(now.getMonth() + 1).padStart(2, '0'));
  const year = toKhmerNum(String(now.getFullYear()));
  return { day, month, year };
}

// Calculate age on November 1st of the academic school year
export function calculateStudentAgeAtCutoff(dobStr: string | undefined, academicYearStr: string): number {
  if (!dobStr) return 10;

  const cleanedDob = khmerToArabicNumbers(dobStr.trim());
  const cleanedYear = khmerToArabicNumbers(academicYearStr);

  const yearMatches = cleanedYear.match(/\d{4}/);
  const baseSchoolYear = yearMatches ? parseInt(yearMatches[0], 10) : new Date().getFullYear();

  // Target comparison date: November 1st of the base school year
  const targetDate = new Date(baseSchoolYear, 10, 1);

  let birthDate: Date | null = null;
  if (/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}/.test(cleanedDob)) {
    const parts = cleanedDob.split(/[-/.]/);
    birthDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  } else if (/^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}/.test(cleanedDob)) {
    const parts = cleanedDob.split(/[-/.]/);
    birthDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
  } else if (/^\d{4}/.test(cleanedDob)) {
    const y = parseInt(cleanedDob.slice(0, 4), 10);
    birthDate = new Date(y, 0, 1);
  }

  if (!birthDate || isNaN(birthDate.getTime())) {
    return 10;
  }

  let age = targetDate.getFullYear() - birthDate.getFullYear();
  const mDiff = targetDate.getMonth() - birthDate.getMonth();
  if (mDiff < 0 || (mDiff === 0 && targetDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(5, age);
}

// Compute statistics bundle from the live student roster
export function computeStatsFromStudentList(
  students: Student[],
  teacher: TeacherProfile,
  academicYear: string
): PriFormData {
  const ageMap: Record<string, AgeBreakdownRow> = {};
  AGE_ROWS.forEach((r) => {
    ageMap[r] = { newTotal: 0, newFemale: 0, repeatTotal: 0, repeatFemale: 0 };
  });

  const difficulties: PriFormData['difficulties'] = {
    vision: { total: 0, female: 0 },
    hearing: { total: 0, female: 0 },
    speech: { total: 0, female: 0 },
    writing: { total: 0, female: 0 },
    movement: { total: 0, female: 0 },
    learning: { total: 0, female: 0 },
    mental: { total: 0, female: 0 },
    severeMalnutrition: { total: 0, female: 0 },
    chronicHealth: { total: 0, female: 0 },
    migrantFamily: { total: 0, female: 0 },
    orphan: { total: 0, female: 0 },
    domesticViolence: { total: 0, female: 0 },
    childLabor: { total: 0, female: 0 },
    sensory: { total: 0, female: 0 },
    epilepsy: { total: 0, female: 0 },
    totalDisabled: { total: 0, female: 0 },
  };

  const indigenousBreakdown = {
    age6: { total: 0, female: 0 },
    age6To11: { total: 0, female: 0 },
    age12Plus: { total: 0, female: 0 },
  };

  let uniqueDisabledCount = 0;
  let uniqueDisabledFemaleCount = 0;

  students.forEach((stu) => {
    const isFemale = stu.gender === 'ស្រី';
    const age = calculateStudentAgeAtCutoff(stu.dob, academicYear);

    // Map age to row key
    let ageKey = '10';
    if (age < 6) ageKey = '70-71 ខែ';
    else if (age === 6) ageKey = '6';
    else if (age === 7) ageKey = '7';
    else if (age === 8) ageKey = '8';
    else if (age === 9) ageKey = '9';
    else if (age === 10) ageKey = '10';
    else if (age === 11) ageKey = '11';
    else if (age === 12) ageKey = '12';
    else if (age === 13) ageKey = '13';
    else if (age === 14) ageKey = '14';
    else ageKey = '15+';

    // Repeating status
    const combinedNotes = `${stu.note || ''} ${stu.familyStatus || ''} ${stu.pob || ''} ${stu.address || ''} ${stu.disabilityType || ''} ${stu.indigenousEthnicity || ''}`;
    const isRepeating =
      (ageKey !== '70-71 ខែ' && ageKey !== '6') &&
      (stu.isRepeating === true ||
        combinedNotes.includes('ត្រួតថ្នាក់') ||
        combinedNotes.includes('រៀនឡើងវិញ') ||
        combinedNotes.includes('repeating'));

    if (isRepeating) {
      ageMap[ageKey].repeatTotal += 1;
      if (isFemale) ageMap[ageKey].repeatFemale += 1;
    } else {
      ageMap[ageKey].newTotal += 1;
      if (isFemale) ageMap[ageKey].newFemale += 1;
    }

    // Difficulties & Disabilities
    let hasAnyDisability = false;
    const addDiff = (key: keyof PriFormData['difficulties']) => {
      difficulties[key].total += 1;
      if (isFemale) difficulties[key].female += 1;
      hasAnyDisability = true;
    };

    const combinedSearch = `${stu.disabilityType || ''} ${combinedNotes}`.toLowerCase();

    if (combinedSearch.includes('ភ្នែក') || combinedSearch.includes('មើល') || stu.disabilityType === 'ពិបាកមើល') {
      addDiff('vision');
    }
    if (combinedSearch.includes('ស្តាប់') || combinedSearch.includes('ថ្លង់') || stu.disabilityType === 'ពិបាកស្តាប់') {
      addDiff('hearing');
    }
    if (combinedSearch.includes('និយាយ') || combinedSearch.includes('គ') || stu.disabilityType === 'ពិបាកនិយាយ') {
      addDiff('speech');
    }
    if (combinedSearch.includes('សរសេរ') || stu.disabilityType === 'ពិបាកសរសេរ') {
      addDiff('writing');
    }
    if (combinedSearch.includes('ចលនា') || combinedSearch.includes('ពិការដៃ') || combinedSearch.includes('ពិការជើង') || combinedSearch.includes('ស្វិត')) {
      addDiff('movement');
    }
    if (combinedSearch.includes('រៀនសូត្រ') || combinedSearch.includes('យឺត') || combinedSearch.includes('learning')) {
      addDiff('learning');
    }
    if (combinedSearch.includes('ផ្លូវចិត្ត') || combinedSearch.includes('អូទីសឹម') || combinedSearch.includes('autism')) {
      addDiff('mental');
    }
    if (combinedSearch.includes('អាហារូបត្ថម្ភ') || stu.disabilityType === 'ខ្វះអាហារូបត្ថម្ភ') {
      addDiff('severeMalnutrition');
    }
    if (combinedSearch.includes('ជំងឺប្រចាំកាយ') || combinedSearch.includes('រ៉ាំរ៉ៃ')) {
      addDiff('chronicHealth');
    }
    if (combinedSearch.includes('ចំណាកស្រុក') || combinedSearch.includes('ផ្លាស់ប្តូរទីលំនៅ')) {
      addDiff('migrantFamily');
    }
    if (combinedSearch.includes('កំព្រា')) {
      addDiff('orphan');
    }
    if (combinedSearch.includes('ហិង្សា')) {
      addDiff('domesticViolence');
    }
    if (combinedSearch.includes('ពលកម្ម')) {
      addDiff('childLabor');
    }
    if (combinedSearch.includes('កាយវិញ្ញាណ')) {
      addDiff('sensory');
    }
    if (combinedSearch.includes('ប្រកាច់') || combinedSearch.includes('ជំងឺឆ្កួតជ្រូក')) {
      addDiff('epilepsy');
    }

    if (hasAnyDisability) {
      uniqueDisabledCount += 1;
      if (isFemale) uniqueDisabledFemaleCount += 1;
    }

    // Indigenous
    const isIndig =
      (!!stu.indigenousEthnicity && stu.indigenousEthnicity !== 'គ្មាន') ||
      combinedNotes.includes('ជនជាតិដើម') ||
      combinedNotes.includes('ព្នង') ||
      combinedNotes.includes('ទំពួន') ||
      combinedNotes.includes('គ្រឹង') ||
      combinedNotes.includes('ព្រៅ') ||
      combinedNotes.includes('កួយ') ||
      combinedNotes.includes('ចារាយ') ||
      combinedNotes.includes('កាចក់');

    if (isIndig) {
      if (age <= 6) {
        indigenousBreakdown.age6.total += 1;
        if (isFemale) indigenousBreakdown.age6.female += 1;
      } else if (age >= 7 && age <= 11) {
        indigenousBreakdown.age6To11.total += 1;
        if (isFemale) indigenousBreakdown.age6To11.female += 1;
      } else {
        indigenousBreakdown.age12Plus.total += 1;
        if (isFemale) indigenousBreakdown.age12Plus.female += 1;
      }
    }
  });

  difficulties.totalDisabled = {
    total: uniqueDisabledCount,
    female: uniqueDisabledFemaleCount,
  };

  const currentDate = getCurrentKhmerDate();

  return {
    province: (teacher as any).province || '',
    district: (teacher as any).district || '',
    schoolName: teacher.school || (teacher as any).schoolName || '',
    grade: teacher.grade || 'ទី៤',
    academicYear: academicYear || '២០២៦-២០២៧',
    asOfDateText: `( ចំនួនសិស្សរាប់គិតត្រឹមថ្ងៃទី១០/១១/${toKhmerNum(academicYear.match(/\d{4}/)?.[0] || '2026')} )`,

    teacherNameKh: teacher.name || '',
    teacherGender: ((teacher as any).gender as 'ប្រុស' | 'ស្រី') || 'ប្រុស',
    teacherAge: '៣៤',
    isIndigenous: 'ទេ',
    educationLevel: teacher.degree || 'បរិញ្ញាបត្រអប់រំ',
    yearsInService: '១០',
    teachingGrade: teacher.grade || 'ទី៤',

    earlyChildhood: {
      statePreschool: { newTotal: 0, newFemale: 0, repeatTotal: 0, repeatFemale: 0 },
      privatePreschool: { newTotal: 0, newFemale: 0, repeatTotal: 0, repeatFemale: 0 },
      communityPreschool: { newTotal: 0, newFemale: 0, repeatTotal: 0, repeatFemale: 0 },
      homeBased: { newTotal: 0, newFemale: 0, repeatTotal: 0, repeatFemale: 0 },
      grade1Prep: { newTotal: 0, newFemale: 0, repeatTotal: 0, repeatFemale: 0 },
    },

    ageBreakdown: ageMap,
    difficulties,
    indigenousBreakdown,

    dateDay: currentDate.day,
    dateMonth: currentDate.month,
    dateYear: currentDate.year,
    teacherSignatureName: teacher.name || '',
  };
}

// =========================================================================
// MAIN COMPONENT
// =========================================================================

export const MoeysPriStatisticsManager: React.FC<MoeysPriStatisticsManagerProps> = ({
  teacher,
  currentYear,
  students,
  onShowToast,
}) => {
  const activeYear = currentYear || teacher.academicYear || '២០២៦-២០២៧';

  // State
  const [formData, setFormData] = useState<PriFormData>(() => {
    const saved = loadYearScopedData<PriFormData | null>(activeYear, 'moeys_pri_form', null);
    if (saved && saved.ageBreakdown && saved.difficulties) {
      // Normalize backward-compatibility for difficulties if stored as number
      const normalizedDiffs: any = { ...saved.difficulties };
      DIFFICULTY_CONFIG.forEach(({ key }) => {
        if (typeof normalizedDiffs[key] === 'number') {
          normalizedDiffs[key] = { total: normalizedDiffs[key], female: 0 };
        } else if (!normalizedDiffs[key]) {
          normalizedDiffs[key] = { total: 0, female: 0 };
        }
      });
      // Normalize earlyChildhood.grade1Prep if missing
      const normalizedEc = { ...saved.earlyChildhood };
      if (!normalizedEc.grade1Prep) {
        normalizedEc.grade1Prep = { newTotal: 0, newFemale: 0, repeatTotal: 0, repeatFemale: 0 };
      }
      return {
        ...saved,
        difficulties: normalizedDiffs,
        earlyChildhood: normalizedEc,
      };
    }
    return computeStatsFromStudentList(students, teacher, activeYear);
  });

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const isInitialMount = useRef(true);

  // Sync to current date on request
  const handleSetCurrentDate = () => {
    const cur = getCurrentKhmerDate();
    setFormData((prev) => ({
      ...prev,
      dateDay: cur.day,
      dateMonth: cur.month,
      dateYear: cur.year,
    }));
    onShowToast(`បានកំណត់កាលបរិច្ឆេទទៅថ្ងៃបច្ចុប្បន្ន៖ ថ្ងៃទី ${cur.day} ខែ ${cur.month} ឆ្នាំ ${cur.year}`);
  };

  // Re-sync from Student Roster
  const handleSyncFromRoster = () => {
    const freshlyComputed = computeStatsFromStudentList(students, teacher, activeYear);
    setFormData((prev) => ({
      ...freshlyComputed,
      // preserve user custom header inputs
      province: prev.province || freshlyComputed.province,
      district: prev.district || freshlyComputed.district,
      schoolName: prev.schoolName || freshlyComputed.schoolName,
      teacherNameKh: prev.teacherNameKh || freshlyComputed.teacherNameKh,
      teacherAge: prev.teacherAge || freshlyComputed.teacherAge,
      educationLevel: prev.educationLevel || freshlyComputed.educationLevel,
      yearsInService: prev.yearsInService || freshlyComputed.yearsInService,
      dateDay: prev.dateDay,
      dateMonth: prev.dateMonth,
      dateYear: prev.dateYear,
    }));
    onShowToast('បានទាញទិន្នន័យស្រង់ពីបញ្ជីសិស្សមកក្នុងតារាង PRI ដោយជោគជ័យ!');
  };

  // Debounced auto-save
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus('dirty');
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      saveYearScopedData(activeYear, 'moeys_pri_form', formData);
      saveYearScopedData(activeYear, 'last_modified', Date.now());

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setLastSavedTime(timeStr);
      setSaveStatus('saved');
    }, 400);

    return () => clearTimeout(timer);
  }, [formData, activeYear]);

  // Compute Totals for 2.(ក) Early Childhood
  const ecTotals = useMemo(() => {
    const rows = Object.values(formData.earlyChildhood || {}) as EarlyChildhoodRow[];
    return rows.reduce(
      (acc, r) => ({
        newTotal: acc.newTotal + (Number(r?.newTotal) || 0),
        newFemale: acc.newFemale + (Number(r?.newFemale) || 0),
        repeatTotal: acc.repeatTotal + (Number(r?.repeatTotal) || 0),
        repeatFemale: acc.repeatFemale + (Number(r?.repeatFemale) || 0),
      }),
      { newTotal: 0, newFemale: 0, repeatTotal: 0, repeatFemale: 0 }
    );
  }, [formData.earlyChildhood]);

  // Compute Totals for 2.(ខ) Age Breakdown
  const ageTotals = useMemo(() => {
    let grandNewTotal = 0;
    let grandNewFemale = 0;
    let grandRepeatTotal = 0;
    let grandRepeatFemale = 0;

    AGE_ROWS.forEach((age) => {
      const row = formData.ageBreakdown[age] || { newTotal: 0, newFemale: 0, repeatTotal: 0, repeatFemale: 0 };
      grandNewTotal += Number(row.newTotal) || 0;
      grandNewFemale += Number(row.newFemale) || 0;
      // Repeating is 0 for 70-71 and 6
      if (age !== '70-71 ខែ' && age !== '6') {
        grandRepeatTotal += Number(row.repeatTotal) || 0;
        grandRepeatFemale += Number(row.repeatFemale) || 0;
      }
    });

    const sumTotal = grandNewTotal + grandRepeatTotal;
    const sumFemale = grandNewFemale + grandRepeatFemale;

    return {
      grandNewTotal,
      grandNewFemale,
      grandRepeatTotal,
      grandRepeatFemale,
      sumTotal,
      sumFemale,
    };
  }, [formData.ageBreakdown]);

  // Compute Totals for 4. Indigenous
  const indigenousTotals = useMemo(() => {
    const b = formData.indigenousBreakdown;
    const total = (Number(b?.age6?.total) || 0) + (Number(b?.age6To11?.total) || 0) + (Number(b?.age12Plus?.total) || 0);
    const female = (Number(b?.age6?.female) || 0) + (Number(b?.age6To11?.female) || 0) + (Number(b?.age12Plus?.female) || 0);
    return { total, female };
  }, [formData.indigenousBreakdown]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* ========================================================================= */}
      {/* TOP CONTROL BAR (Screen-only, strictly hidden during print) */}
      {/* ========================================================================= */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900 text-white flex items-center justify-center font-bold font-moul text-sm shadow-xs">
            PRI
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span>តារាងស្ថិតិសិស្សតាមថ្នាក់ (គំរូផ្លូវការ MoEYS)</span>
            </h2>
            <p className="text-xs text-slate-500">
              ទម្រង់ ១សន្លឹកពេញគែមក្រដាស A4 ស្វ័យប្រវត្តិ និងត្រឹមត្រូវតាមទម្រង់ក្រសួង
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Save Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-700" />
                <span>កំពុងរក្សាទុក...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>បានរក្សាទុក {lastSavedTime && `(${lastSavedTime})`}</span>
              </>
            ) : (
              <span>មានការផ្លាស់ប្តូរ...</span>
            )}
          </div>

          {/* Quick Action: Set Today Date */}
          <button
            type="button"
            onClick={handleSetCurrentDate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
            title="កំណត់កាលបរិច្ឆេទថ្ងៃបច្ចុប្បន្ន"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-900" />
            <span>ថ្ងៃបច្ចុប្បន្ន</span>
          </button>

          {/* Sync from Roster */}
          <button
            type="button"
            onClick={handleSyncFromRoster}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition active:scale-95 cursor-pointer"
            title="ទាញទិន្នន័យស្រង់ពីបញ្ជីឈ្មោះសិស្ស"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>ទាញពីបញ្ជីសិស្ស ({students.length})</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold transition shadow-md shadow-purple-950/20 active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ព ១សន្លឹក (Print A4)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OFFICIAL PRI SHEET: Strict 1-Page Layout matching IMG_4111.jpeg exactly */}
      {/* ========================================================================= */}
      <div
        id="pri-print-sheet"
        className="pri-official-page bg-white text-black w-full max-w-[210mm] mx-auto p-4 sm:p-6 border border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full text-[10px] leading-tight select-text box-border"
      >
        {/* ------------------------------------------------------------- */}
        {/* HEADER SECTION (Title, Subtitle, PRI Badge, Location Metadata) */}
        {/* ------------------------------------------------------------- */}
        <div className="relative mb-2 w-full">
          {/* Top-Right PRI Badge */}
          <div className="absolute top-0 right-0">
            <div className="w-14 h-9 rounded-[18px] border-2 border-black flex items-center justify-center font-serif font-black text-sm text-black tracking-wider">
              PRI
            </div>
          </div>

          {/* Centered Document Title */}
          <div className="text-center space-y-0.5 pr-14 pl-14">
            <h1 className="font-moul text-[13px] sm:text-[15px] text-black tracking-normal">
              តារាងចំនួនសិស្សតាមថ្នាក់ (សម្រាប់គ្រូ)
            </h1>
            <div className="font-moul text-[11px] sm:text-[12px] text-black">
              ឆ្នាំសិក្សា {formData.academicYear || '២០២៦-២០២៧'}
            </div>
          </div>

          {/* Location Dotted Input Lines */}
          <div className="mt-2 space-y-1 text-[10.5px] w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex-1 flex items-center mr-4">
                <span className="shrink-0 font-medium">រាជធានី/ខេត្ត ៖</span>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="......................................................"
                  className="flex-1 min-w-[80px] border-b border-dotted border-black px-1.5 text-center bg-transparent focus:outline-none focus:border-purple-600 print:placeholder-transparent"
                />
              </div>
              <div className="flex-1 flex items-center">
                <span className="shrink-0 font-medium">ក្រុង/ស្រុក/ខណ្ឌ ៖</span>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="......................................................"
                  className="flex-1 min-w-[80px] border-b border-dotted border-black px-1.5 text-center bg-transparent focus:outline-none focus:border-purple-600 print:placeholder-transparent"
                />
              </div>
            </div>

            <div className="flex items-center w-full">
              <span className="shrink-0 font-medium">សាលាបឋមសិក្សា ៖</span>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                placeholder="................................................................................................................................................"
                className="flex-1 min-w-[120px] border-b border-dotted border-black px-1.5 text-center bg-transparent focus:outline-none focus:border-purple-600 print:placeholder-transparent"
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ROW 1: Section 1 (Left) & Section 2.(ក) (Right) */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-2 gap-2.5 mb-2 items-start w-full">
          {/* Section 1: Teacher Info */}
          <div className="w-full">
            <div className="font-bold text-[10.5px] text-black mb-1 flex items-center">
              <span>១. ព័ត៌មានគ្រូទទួលបន្ទុកថ្នាក់ទី</span>
              <input
                type="text"
                value={formData.teachingGrade}
                onChange={(e) => setFormData({ ...formData, teachingGrade: e.target.value })}
                placeholder="..............."
                className="w-16 border-b border-dotted border-black text-center bg-transparent focus:outline-none font-bold ml-1 print:placeholder-transparent"
              />
            </div>

            <table className="w-full border-collapse border border-black text-[9.5px] table-fixed">
              <tbody>
                <tr>
                  <td className="border border-black p-1 w-[52%] font-medium">ឈ្មោះជាអក្សរខ្មែរ</td>
                  <td className="border border-black p-0.5 w-[48%]">
                    <input
                      type="text"
                      value={formData.teacherNameKh}
                      onChange={(e) => setFormData({ ...formData, teacherNameKh: e.target.value })}
                      className="w-full text-center bg-transparent focus:outline-none font-bold font-moul text-[9px]"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border border-black p-1 font-medium">ភេទ (សូមគូសរង្វង់)</td>
                  <td className="border border-black p-1 text-center font-bold">
                    <div className="inline-flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, teacherGender: 'ប្រុស' })}
                        className={`px-1.5 py-0.2 rounded-full cursor-pointer transition ${
                          formData.teacherGender === 'ប្រុស'
                            ? 'border border-black font-black'
                            : 'opacity-70'
                        }`}
                      >
                        ប្រុស
                      </button>
                      <span>/</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, teacherGender: 'ស្រី' })}
                        className={`px-1.5 py-0.2 rounded-full cursor-pointer transition ${
                          formData.teacherGender === 'ស្រី'
                            ? 'border border-black font-black'
                            : 'opacity-70'
                        }`}
                      >
                        ស្រី
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="border border-black p-1 font-medium">អាយុ</td>
                  <td className="border border-black p-0.5 text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="text"
                        value={formData.teacherAge}
                        onChange={(e) => setFormData({ ...formData, teacherAge: e.target.value })}
                        className="w-10 text-center bg-transparent focus:outline-none font-bold"
                      />
                      <span>ឆ្នាំ</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="border border-black p-1 font-medium">ជនជាតិដើមភាគតិច</td>
                  <td className="border border-black p-1 text-center font-bold">
                    <div className="inline-flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isIndigenous: 'ពិតមែន' })}
                        className={`px-1.5 py-0.2 rounded-full cursor-pointer transition ${
                          formData.isIndigenous === 'ពិតមែន'
                            ? 'border border-black font-black'
                            : 'opacity-70'
                        }`}
                      >
                        ពិតមែន
                      </button>
                      <span>/</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isIndigenous: 'ទេ' })}
                        className={`px-1.5 py-0.2 rounded-full cursor-pointer transition ${
                          formData.isIndigenous === 'ទេ'
                            ? 'border border-black font-black'
                            : 'opacity-70'
                        }`}
                      >
                        ទេ
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="border border-black p-1 font-medium">កម្រិតវប្បធម៌</td>
                  <td className="border border-black p-0.5">
                    <input
                      type="text"
                      value={formData.educationLevel}
                      onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                      className="w-full text-center bg-transparent focus:outline-none"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border border-black p-1 font-medium">ចំនួនឆ្នាំបម្រើការងារអប់រំ</td>
                  <td className="border border-black p-0.5">
                    <input
                      type="text"
                      value={formData.yearsInService}
                      onChange={(e) => setFormData({ ...formData, yearsInService: e.target.value })}
                      className="w-full text-center bg-transparent focus:outline-none"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border border-black p-1 font-medium">កម្រិតបង្រៀនជាក់</td>
                  <td className="border border-black p-0.5">
                    <input
                      type="text"
                      value={formData.teachingGrade}
                      onChange={(e) => setFormData({ ...formData, teachingGrade: e.target.value })}
                      className="w-full text-center bg-transparent focus:outline-none font-bold"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2.(ក): Grade 1 Early Childhood Transitions */}
          <div className="w-full">
            <div className="font-bold text-[10px] text-black mb-0.5">
              ២. (ក) ចំនួនសិស្សថ្នាក់ទី១បានឆ្លងកម្មវិធីកុមារតូច
              <span className="block font-normal text-[8.5px] italic text-slate-800">
                ( ក្រៅពីថ្នាក់ទី ១មិនចាំបាច់បំពេញតារាង ២ (ក) នេះទេ )
              </span>
            </div>

            <table className="w-full border-collapse border border-black text-[9px] text-center table-fixed">
              <thead>
                <tr>
                  <th rowSpan={2} className="border border-black p-1 text-left w-[44%] font-bold">
                    ប្រភេទ
                  </th>
                  <th colSpan={4} className="border border-black p-0.5 font-bold w-[56%]">
                    ថ្នាក់ទី ១ (សិស្សម្នាក់អាចរាប់បានតែមួយដង)
                  </th>
                </tr>
                <tr>
                  <th colSpan={2} className="border border-black p-0.5 font-bold">
                    សិស្សថ្មី
                  </th>
                  <th colSpan={2} className="border border-black p-0.5 font-bold">
                    សិស្សត្រួត
                  </th>
                </tr>
                <tr>
                  <th className="border border-black p-0.5 text-center text-[8.5px]"></th>
                  <th className="border border-black p-0.5 w-[14%] text-[8.5px]">សរុប</th>
                  <th className="border border-black p-0.5 w-[14%] text-[8.5px]">ស្រី</th>
                  <th className="border border-black p-0.5 w-[14%] text-[8.5px]">សរុប</th>
                  <th className="border border-black p-0.5 w-[14%] text-[8.5px]">ស្រី</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'statePreschool', label: 'មត្តេយ្យរដ្ឋ' },
                  { key: 'privatePreschool', label: 'មត្តេយ្យឯកជន' },
                  { key: 'communityPreschool', label: 'មត្តេយ្យសហគមន៍' },
                  { key: 'homeBased', label: 'ការអប់រំតាមផ្ទះ/តាមខ្នងផ្ទះ' },
                  { key: 'grade1Prep', label: 'កម្មវិធីត្រៀមថ្នាក់ទី១' },
                ].map(({ key, label }) => {
                  const row = formData.earlyChildhood[key as keyof typeof formData.earlyChildhood];
                  return (
                    <tr key={key}>
                      <td className="border border-black p-0.5 pl-1.5 text-left font-medium">{label}</td>
                      <td className="border border-black p-0">
                        <input
                          type="number"
                          min="0"
                          value={row?.newTotal || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setFormData({
                              ...formData,
                              earlyChildhood: {
                                ...formData.earlyChildhood,
                                [key]: { ...row, newTotal: val },
                              },
                            });
                          }}
                          className="w-full text-center bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="border border-black p-0">
                        <input
                          type="number"
                          min="0"
                          value={row?.newFemale || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setFormData({
                              ...formData,
                              earlyChildhood: {
                                ...formData.earlyChildhood,
                                [key]: { ...row, newFemale: val },
                              },
                            });
                          }}
                          className="w-full text-center bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="border border-black p-0">
                        <input
                          type="number"
                          min="0"
                          value={row?.repeatTotal || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setFormData({
                              ...formData,
                              earlyChildhood: {
                                ...formData.earlyChildhood,
                                [key]: { ...row, repeatTotal: val },
                              },
                            });
                          }}
                          className="w-full text-center bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="border border-black p-0">
                        <input
                          type="number"
                          min="0"
                          value={row?.repeatFemale || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setFormData({
                              ...formData,
                              earlyChildhood: {
                                ...formData.earlyChildhood,
                                [key]: { ...row, repeatFemale: val },
                              },
                            });
                          }}
                          className="w-full text-center bg-transparent focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}

                <tr className="font-bold">
                  <td className="border border-black p-1 text-center font-bold">សរុប</td>
                  <td className="border border-black p-1">{ecTotals.newTotal}</td>
                  <td className="border border-black p-1">{ecTotals.newFemale}</td>
                  <td className="border border-black p-1">{ecTotals.repeatTotal}</td>
                  <td className="border border-black p-1">{ecTotals.repeatFemale}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ROW 2: Left (2.ខ & 4) & Right (Section 3: 16 Rows) */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-2 gap-2.5 items-start w-full">
          {/* LEFT COLUMN: Section 2.(ខ) Age Breakdown & Section 4 Indigenous */}
          <div className="space-y-2 w-full">
            {/* Section 2.(ខ) */}
            <div className="w-full">
              <div className="font-bold text-[10px] text-black">
                ២. (ខ) សិស្សថ្មី សិស្សឡើងថ្នាក់ និង សិស្សត្រួតថ្នាក់
              </div>
              <div className="text-[9px] text-black mb-1">
                ក្នុងឆ្នាំសិក្សា {formData.academicYear || '២០២៦-២០២៧'}{' '}
                <span className="italic">{formData.asOfDateText}</span>
              </div>

              <table className="w-full border-collapse border border-black text-[9px] text-center table-fixed">
                <thead>
                  <tr>
                    <th rowSpan={2} className="border border-black p-0.5 w-[22%] font-bold">
                      <div>អាយុ</div>
                      <div className="text-[8px] font-normal">( ឆ្នាំ )</div>
                    </th>
                    <th colSpan={6} className="border border-black p-0.5 font-bold w-[78%]">
                      ចំនួនសិស្ស
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={2} className="border border-black p-0.5 font-bold text-[8.5px]">
                      សិស្សថ្មី / សិស្សឡើងថ្នាក់
                    </th>
                    <th colSpan={2} className="border border-black p-0.5 font-bold text-[8.5px]">
                      សិស្សត្រួតថ្នាក់
                    </th>
                    <th colSpan={2} className="border border-black p-0.5 font-bold text-[8.5px]">
                      សរុប
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-black p-0.5 text-[8px]"></th>
                    <th className="border border-black p-0.5 w-9 text-[8px]">សរុប</th>
                    <th className="border border-black p-0.5 w-9 text-[8px]">ស្រី</th>
                    <th className="border border-black p-0.5 w-9 text-[8px]">សរុប</th>
                    <th className="border border-black p-0.5 w-9 text-[8px]">ស្រី</th>
                    <th className="border border-black p-0.5 w-9 text-[8px]">សរុប</th>
                    <th className="border border-black p-0.5 w-9 text-[8px]">ស្រី</th>
                  </tr>
                </thead>
                <tbody>
                  {AGE_ROWS.map((age) => {
                    const row = formData.ageBreakdown[age] || {
                      newTotal: 0,
                      newFemale: 0,
                      repeatTotal: 0,
                      repeatFemale: 0,
                    };
                    const isBlackedOut = age === '70-71 ខែ' || age === '6';
                    const sumTotal = (Number(row.newTotal) || 0) + (isBlackedOut ? 0 : (Number(row.repeatTotal) || 0));
                    const sumFemale = (Number(row.newFemale) || 0) + (isBlackedOut ? 0 : (Number(row.repeatFemale) || 0));

                    return (
                      <tr key={age}>
                        <td className="border border-black p-0.5 font-medium">{age}</td>

                        {/* New / Promoted Students */}
                        <td className="border border-black p-0">
                          <input
                            type="number"
                            min="0"
                            value={row.newTotal || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setFormData({
                                ...formData,
                                ageBreakdown: {
                                  ...formData.ageBreakdown,
                                  [age]: { ...row, newTotal: val },
                                },
                              });
                            }}
                            className="w-full text-center bg-transparent focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-0">
                          <input
                            type="number"
                            min="0"
                            value={row.newFemale || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setFormData({
                                ...formData,
                                ageBreakdown: {
                                  ...formData.ageBreakdown,
                                  [age]: { ...row, newFemale: val },
                                },
                              });
                            }}
                            className="w-full text-center bg-transparent focus:outline-none"
                          />
                        </td>

                        {/* Repeating Students: SOLID BLACK for 70-71 and 6 */}
                        {isBlackedOut ? (
                          <>
                            <td className="pri-black-cell bg-black border border-black p-0" />
                            <td className="pri-black-cell bg-black border border-black p-0" />
                          </>
                        ) : (
                          <>
                            <td className="border border-black p-0">
                              <input
                                type="number"
                                min="0"
                                value={row.repeatTotal || ''}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10) || 0;
                                  setFormData({
                                    ...formData,
                                    ageBreakdown: {
                                      ...formData.ageBreakdown,
                                      [age]: { ...row, repeatTotal: val },
                                    },
                                  });
                                }}
                                className="w-full text-center bg-transparent focus:outline-none"
                              />
                            </td>
                            <td className="border border-black p-0">
                              <input
                                type="number"
                                min="0"
                                value={row.repeatFemale || ''}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10) || 0;
                                  setFormData({
                                    ...formData,
                                    ageBreakdown: {
                                      ...formData.ageBreakdown,
                                      [age]: { ...row, repeatFemale: val },
                                    },
                                  });
                                }}
                                className="w-full text-center bg-transparent focus:outline-none"
                              />
                            </td>
                          </>
                        )}

                        {/* Combined Total */}
                        <td className="border border-black p-0.5 font-bold">{sumTotal}</td>
                        <td className="border border-black p-0.5 font-bold">{sumFemale}</td>
                      </tr>
                    );
                  })}

                  <tr className="font-bold">
                    <td className="border border-black p-0.5">សរុប</td>
                    <td className="border border-black p-0.5">{ageTotals.grandNewTotal}</td>
                    <td className="border border-black p-0.5">{ageTotals.grandNewFemale}</td>
                    <td className="border border-black p-0.5">{ageTotals.grandRepeatTotal}</td>
                    <td className="border border-black p-0.5">{ageTotals.grandRepeatFemale}</td>
                    <td className="border border-black p-0.5 font-black">{ageTotals.sumTotal}</td>
                    <td className="border border-black p-0.5 font-black">{ageTotals.sumFemale}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 4: Indigenous */}
            <div className="w-full">
              <div className="font-bold text-[10px] text-black mb-1">
                ៤. សិស្សតាមជនជាតិដើមភាគតិច
              </div>

              <table className="w-full border-collapse border border-black text-[9px] text-center table-fixed">
                <thead>
                  <tr>
                    <th rowSpan={2} className="border border-black p-0.5 text-center w-[50%] font-bold">
                      ក្រុមអាយុ
                    </th>
                    <th colSpan={2} className="border border-black p-0.5 font-bold w-[50%]">
                      សិស្សជនជាតិដើមភាគតិច
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-black p-0.5 w-[25%] text-[8.5px]">សរុប</th>
                    <th className="border border-black p-0.5 w-[25%] text-[8.5px]">ស្រី</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'age6', label: '6' },
                    { key: 'age6To11', label: '6-11' },
                    { key: 'age12Plus', label: '12+' },
                  ].map(({ key, label }) => {
                    const iKey = key as keyof typeof formData.indigenousBreakdown;
                    const item = formData.indigenousBreakdown[iKey] || { total: 0, female: 0 };
                    return (
                      <tr key={key}>
                        <td className="border border-black p-0.5 font-medium">{label}</td>
                        <td className="border border-black p-0">
                          <input
                            type="number"
                            min="0"
                            value={item.total || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setFormData({
                                ...formData,
                                indigenousBreakdown: {
                                  ...formData.indigenousBreakdown,
                                  [iKey]: { ...item, total: val },
                                },
                              });
                            }}
                            className="w-full text-center bg-transparent focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-0">
                          <input
                            type="number"
                            min="0"
                            value={item.female || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setFormData({
                                ...formData,
                                indigenousBreakdown: {
                                  ...formData.indigenousBreakdown,
                                  [iKey]: { ...item, female: val },
                                },
                              });
                            }}
                            className="w-full text-center bg-transparent focus:outline-none"
                          />
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-bold">
                    <td className="border border-black p-0.5">សរុប</td>
                    <td className="border border-black p-0.5">{indigenousTotals.total}</td>
                    <td className="border border-black p-0.5">{indigenousTotals.female}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: Section 3: Difficulties & Disabilities (16 Rows) */}
          <div className="w-full">
            <div className="font-bold text-[10px] text-black mb-0.5">
              ៣. ចំនួនសិស្សជួបការលំបាកតាមកម្រិតថ្នាក់
              <span className="font-normal text-[8px] text-slate-800 ml-1">
                ( សិស្សម្នាក់អាចរាប់ច្រើនដងបាន
              </span>
            </div>
            <div className="text-[8px] text-slate-800 mb-1 leading-none">
              តាមភាពជាក់ស្តែងរបស់សិស្សនោះពិការ ឬមានប៉ះពាល់ពហុចេតិយបរិយាយ )
            </div>

            <table className="w-full border-collapse border border-black text-[9px] table-fixed">
              <thead>
                <tr>
                  <th rowSpan={2} className="border border-black p-0.5 pl-1.5 text-left font-bold w-[72%]">
                    បរិយាយ
                  </th>
                  <th colSpan={2} className="border border-black p-0.5 text-center font-bold w-[28%]">
                    ចំនួនសិស្សជួបការលំបាក
                  </th>
                </tr>
                <tr>
                  <th className="border border-black p-0.5 w-[14%] text-center text-[8.5px]">សរុប</th>
                  <th className="border border-black p-0.5 w-[14%] text-center text-[8.5px]">ស្រី</th>
                </tr>
              </thead>
              <tbody>
                {DIFFICULTY_CONFIG.map(({ key, label, isBold }) => {
                  const row = formData.difficulties[key] || { total: 0, female: 0 };
                  return (
                    <tr key={key} className={isBold ? 'font-bold' : ''}>
                      <td className={`border border-black p-0.5 pl-1.5 ${isBold ? 'font-bold' : ''}`}>
                        {label}
                      </td>
                      <td className="border border-black p-0 text-center">
                        <input
                          type="number"
                          min="0"
                          value={row.total || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setFormData({
                              ...formData,
                              difficulties: {
                                ...formData.difficulties,
                                [key]: { ...row, total: val },
                              },
                            });
                          }}
                          className={`w-full text-center bg-transparent focus:outline-none ${
                            isBold ? 'font-bold' : ''
                          }`}
                        />
                      </td>
                      <td className="border border-black p-0 text-center">
                        <input
                          type="number"
                          min="0"
                          value={row.female || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setFormData({
                              ...formData,
                              difficulties: {
                                ...formData.difficulties,
                                [key]: { ...row, female: val },
                              },
                            });
                          }}
                          className={`w-full text-center bg-transparent focus:outline-none ${
                            isBold ? 'font-bold' : ''
                          }`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Note under Table 3 */}
            <div className="mt-1 text-[8px] text-black font-medium leading-tight">
              <div>* ចំនួនសិស្សពិការ៖ សិស្សពិការម្នាក់រាប់បានតែ១ដងគត់</div>
              <div className="pl-2">(ទោះបីសិស្សនោះមានពិការភាពច្រើនប្រភេទក៏ដោយ)</div>
            </div>

            {/* Footer Date & Signature matching official template */}
            <div className="mt-2.5 text-right space-y-1 text-[10px] w-full">
              <div className="w-full flex items-center justify-end gap-1">
                <span>........................, ថ្ងៃទី</span>
                <input
                  type="text"
                  value={formData.dateDay}
                  onChange={(e) => setFormData({ ...formData, dateDay: e.target.value })}
                  placeholder="......."
                  className="w-7 text-center border-b border-dotted border-black bg-transparent focus:outline-none print:placeholder-transparent"
                />
                <span>ខែ</span>
                <input
                  type="text"
                  value={formData.dateMonth}
                  onChange={(e) => setFormData({ ...formData, dateMonth: e.target.value })}
                  placeholder="......."
                  className="w-7 text-center border-b border-dotted border-black bg-transparent focus:outline-none print:placeholder-transparent"
                />
                <span>ឆ្នាំ ២០២</span>
                <input
                  type="text"
                  value={formData.dateYear.slice(-1) || '៦'}
                  onChange={(e) => setFormData({ ...formData, dateYear: '២០២' + e.target.value })}
                  placeholder="..."
                  className="w-5 text-center border-b border-dotted border-black bg-transparent focus:outline-none print:placeholder-transparent"
                />
              </div>

              <div className="pt-1 w-full flex items-center justify-end">
                <span className="font-medium">ហត្ថលេខាគ្រូទទួលបន្ទុកថ្នាក់ ៖</span>
                <input
                  type="text"
                  value={formData.teacherSignatureName || formData.teacherNameKh}
                  onChange={(e) => setFormData({ ...formData, teacherSignatureName: e.target.value })}
                  placeholder="......................................................"
                  className="w-48 text-center border-b border-dotted border-black bg-transparent focus:outline-none font-moul text-[9.5px] print:placeholder-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoeysPriStatisticsManager;
