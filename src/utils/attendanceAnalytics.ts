import * as XLSX from 'xlsx';
import { Student, AttendanceDatabase, AttendanceStatus, TeacherProfile } from '../types';

export interface AttendanceDaySummary {
  date: string;
  dayNameKhmer: string;
  dayNumber: number;
  isWeekend: boolean;
  presentCount: number;
  permissionCount: number;
  absentCount: number;
  totalRecorded: number;
  rate: number;
}

export interface StudentAttendanceSummary {
  student: Student;
  presentCount: number;
  permissionCount: number;
  absentCount: number;
  totalRecordedDays: number;
  attendanceRate: number;
  consecutiveAbsences: number;
  dailyStatus: { [dateStr: string]: AttendanceStatus | 'none' };
  honorTier: 'perfect' | 'excellent' | 'good' | 'warning' | 'critical';
}

export interface RangeAttendanceAnalytics {
  dateList: string[];
  schoolDaysCount: number;
  totalPossiblePresents: number;
  actualPresents: number;
  actualPermissions: number;
  actualAbsents: number;
  averageAttendanceRate: number;
  femaleAttendanceRate: number;
  maleAttendanceRate: number;
  dailySummaries: AttendanceDaySummary[];
  studentSummaries: StudentAttendanceSummary[];
  perfectAttendanceCount: number;
  atRiskCount: number;
}

const KHMER_DAY_NAMES = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
const KHMER_MONTH_NAMES = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

/**
 * Formats a Date object to YYYY-MM-DD string
 */
export function formatDateYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Gets Khmer day name for a YYYY-MM-DD date string
 */
export function getKhmerDayName(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return KHMER_DAY_NAMES[date.getDay()];
  } catch {
    return '';
  }
}

/**
 * Gets Khmer full month name
 */
export function getKhmerMonthName(monthIndex: number): string {
  return KHMER_MONTH_NAMES[monthIndex] || '';
}

/**
 * Gets dates for a whole week given a date in that week (Monday to Saturday or Friday)
 */
export function getWeekDates(baseDateStr: string, includeSaturday: boolean = true): string[] {
  try {
    const [y, m, d] = baseDateStr.split('-').map(Number);
    const curr = new Date(y, m - 1, d);
    const day = curr.getDay(); // 0 is Sunday, 1 is Monday...
    // Distance to Monday
    const diffToMonday = day === 0 ? -6 : 1 - day;
    
    const monday = new Date(curr);
    monday.setDate(curr.getDate() + diffToMonday);

    const dates: string[] = [];
    const totalDays = includeSaturday ? 6 : 5; // Monday to Saturday or Friday

    for (let i = 0; i < totalDays; i++) {
      const dIter = new Date(monday);
      dIter.setDate(monday.getDate() + i);
      dates.push(formatDateYMD(dIter));
    }
    return dates;
  } catch {
    return [baseDateStr];
  }
}

/**
 * Gets all dates in a month given year and month (1-12)
 */
export function getMonthDates(year: number, month: number, excludeSundays: boolean = true): string[] {
  const dates: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dIter = new Date(year, month - 1, d);
    if (excludeSundays && dIter.getDay() === 0) {
      continue; // Skip Sunday
    }
    dates.push(formatDateYMD(dIter));
  }
  return dates;
}

/**
 * Gets all dates between startDate and endDate (inclusive)
 */
export function getDateRangeDates(
  startDateStr: string,
  endDateStr: string,
  excludeSundays: boolean = true
): string[] {
  const dates: string[] = [];
  try {
    const [sy, sm, sd] = startDateStr.split('-').map(Number);
    const [ey, em, ed] = endDateStr.split('-').map(Number);

    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);

    if (start > end) return [startDateStr];

    const current = new Date(start);
    while (current <= end) {
      if (!excludeSundays || current.getDay() !== 0) {
        dates.push(formatDateYMD(current));
      }
      current.setDate(current.getDate() + 1);
    }
  } catch {
    return [startDateStr];
  }
  return dates;
}

/**
 * Calculates complete attendance analytics for given dates
 */
export function calculateAttendanceAnalytics(
  students: Student[],
  attendanceDb: AttendanceDatabase,
  dateList: string[]
): RangeAttendanceAnalytics {
  const schoolDaysCount = dateList.length;
  let totalPossiblePresents = 0;
  let actualPresents = 0;
  let actualPermissions = 0;
  let actualAbsents = 0;

  let femalePresents = 0;
  let femalePossible = 0;
  let malePresents = 0;
  let malePossible = 0;

  // Daily Summaries
  const dailySummaries: AttendanceDaySummary[] = dateList.map((dateStr) => {
    let p = 0;
    let l = 0;
    let a = 0;
    let total = 0;

    const dayRecord = attendanceDb[dateStr] || {};
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay();

    students.forEach((s) => {
      const status = dayRecord[s.id];
      if (status) {
        total++;
        if (status === 'present') p++;
        else if (status === 'permission') l++;
        else if (status === 'absent') a++;
      }
    });

    const rate = total > 0 ? Math.round((p / total) * 100) : 100;

    return {
      date: dateStr,
      dayNameKhmer: KHMER_DAY_NAMES[dayOfWeek] || '',
      dayNumber: d,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      presentCount: p,
      permissionCount: l,
      absentCount: a,
      totalRecorded: total,
      rate,
    };
  });

  // Student Summaries
  const studentSummaries: StudentAttendanceSummary[] = students.map((student) => {
    let presentCount = 0;
    let permissionCount = 0;
    let absentCount = 0;
    let recordedDays = 0;
    let maxConsecutiveAbsences = 0;
    let currentConsecutive = 0;
    const dailyStatus: { [dateStr: string]: AttendanceStatus | 'none' } = {};

    dateList.forEach((dateStr) => {
      const dayRecord = attendanceDb[dateStr] || {};
      const status = dayRecord[student.id];

      if (status) {
        recordedDays++;
        dailyStatus[dateStr] = status;
        if (status === 'present') {
          presentCount++;
          currentConsecutive = 0;
        } else if (status === 'permission') {
          permissionCount++;
          currentConsecutive = 0;
        } else if (status === 'absent') {
          absentCount++;
          currentConsecutive++;
          if (currentConsecutive > maxConsecutiveAbsences) {
            maxConsecutiveAbsences = currentConsecutive;
          }
        }
      } else {
        dailyStatus[dateStr] = 'none';
      }
    });

    // Global aggregations
    totalPossiblePresents += recordedDays;
    actualPresents += presentCount;
    actualPermissions += permissionCount;
    actualAbsents += absentCount;

    if (student.gender === 'ស្រី') {
      femalePossible += recordedDays;
      femalePresents += presentCount;
    } else {
      malePossible += recordedDays;
      malePresents += presentCount;
    }

    const rate = recordedDays > 0 ? Math.round((presentCount / recordedDays) * 100) : 100;

    let honorTier: 'perfect' | 'excellent' | 'good' | 'warning' | 'critical' = 'good';
    if (recordedDays > 0 && presentCount === recordedDays) {
      honorTier = 'perfect';
    } else if (rate >= 90) {
      honorTier = 'excellent';
    } else if (rate >= 75) {
      honorTier = 'good';
    } else if (rate >= 60) {
      honorTier = 'warning';
    } else {
      honorTier = 'critical';
    }

    return {
      student,
      presentCount,
      permissionCount,
      absentCount,
      totalRecordedDays: recordedDays,
      attendanceRate: rate,
      consecutiveAbsences: maxConsecutiveAbsences,
      dailyStatus,
      honorTier,
    };
  });

  const averageAttendanceRate =
    totalPossiblePresents > 0 ? Math.round((actualPresents / totalPossiblePresents) * 100) : 100;

  const femaleAttendanceRate =
    femalePossible > 0 ? Math.round((femalePresents / femalePossible) * 100) : 100;

  const maleAttendanceRate =
    malePossible > 0 ? Math.round((malePresents / malePossible) * 100) : 100;

  const perfectAttendanceCount = studentSummaries.filter((s) => s.honorTier === 'perfect').length;
  const atRiskCount = studentSummaries.filter((s) => s.honorTier === 'warning' || s.honorTier === 'critical' || s.absentCount >= 3).length;

  return {
    dateList,
    schoolDaysCount,
    totalPossiblePresents,
    actualPresents,
    actualPermissions,
    actualAbsents,
    averageAttendanceRate,
    femaleAttendanceRate,
    maleAttendanceRate,
    dailySummaries,
    studentSummaries,
    perfectAttendanceCount,
    atRiskCount,
  };
}

/**
 * Generates realistic sample attendance data for testing/demonstration
 */
export function generateSampleAttendance(
  students: Student[],
  dateList: string[],
  currentAttendance: AttendanceDatabase
): AttendanceDatabase {
  const updated: AttendanceDatabase = { ...currentAttendance };

  dateList.forEach((dateStr, dIdx) => {
    const existing = updated[dateStr] ? { ...updated[dateStr] } : {};

    students.forEach((s, sIdx) => {
      // Create natural variation: ~92% present, ~5% permission, ~3% absent
      const seed = (dIdx * 7 + sIdx * 13 + s.id) % 100;
      let status: AttendanceStatus = 'present';
      if (seed < 4) {
        status = 'absent';
      } else if (seed < 10) {
        status = 'permission';
      } else {
        status = 'present';
      }
      existing[s.id] = status;
    });

    updated[dateStr] = existing;
  });

  return updated;
}

/**
 * Exports Attendance Matrix & Summary to Excel Workbook (.xlsx)
 */
export function exportAttendanceAnalyticsToExcel(
  title: string,
  subtitle: string,
  teacher: TeacherProfile,
  students: Student[],
  analytics: RangeAttendanceAnalytics,
  fileName: string = 'attendance_report.xlsx'
) {
  const headers: any[][] = [
    ['ព្រះរាជាណាចក្រកម្ពុជា'],
    ['ជាតិ សាសនា ព្រះមហាក្សត្រ'],
    [''],
    [`សាលាបឋមសិក្សា: ${teacher.school || 'សាលាបឋមសិក្សា'}`],
    [`ថ្នាក់: ${teacher.grade || 'ថ្នាក់ទី ៤'} | គ្រូបន្ទុកថ្នាក់: ${teacher.name || 'លោកគ្រូ/អ្នកគ្រូ'} | ឆ្នាំសិក្សា: ${teacher.academicYear || '២០២៥-២០២៦'}`],
    [`របាយការណ៍វត្តមាន: ${title}`],
    [`${subtitle}`],
    [`ស្ថិតិសរុប: សិស្ស ${students.length} នាក់ | អត្រាវត្តមានមធ្យម ${analytics.averageAttendanceRate}% | វត្តមាន ${analytics.actualPresents} | ច្បាប់ ${analytics.actualPermissions} | អវត្តមាន ${analytics.actualAbsents}`],
    [''],
  ];

  // Build table columns: No, Civil ID, Name, Gender, [Date columns...], Present, Permission, Absent, Total, Rate %
  const dateHeaders = analytics.dateList.map((d) => {
    const parts = d.split('-');
    return `${parts[2]}/${parts[1]}`;
  });

  const tableHeaderRow = [
    'ល.រ',
    'អត្តលេខ',
    'គោត្តនាម-នាម',
    'ភេទ',
    ...dateHeaders,
    'វត្តមាន (✓)',
    'សុំច្បាប់ (P)',
    'អវត្តមាន (A)',
    'សរុបថ្ងៃ',
    'អត្រា %',
    'ការវាយតម្លៃ'
  ];

  const rows = analytics.studentSummaries.map((item, idx) => {
    const dateValues = analytics.dateList.map((d) => {
      const st = item.dailyStatus[d];
      if (st === 'present') return '✓';
      if (st === 'permission') return 'P';
      if (st === 'absent') return 'A';
      return '-';
    });

    const tierLabel =
      item.honorTier === 'perfect'
        ? 'ល្អឥតខ្ចោះ (100%)'
        : item.honorTier === 'excellent'
        ? 'ល្អណាស់'
        : item.honorTier === 'good'
        ? 'ល្អ'
        : item.honorTier === 'warning'
        ? 'ត្រូវតាមដាន'
        : 'ប្រកាសអាសន្ន';

    return [
      idx + 1,
      item.student.civilId || `SIS-${1000 + item.student.id}`,
      item.student.name,
      item.student.gender,
      ...dateValues,
      item.presentCount,
      item.permissionCount,
      item.absentCount,
      item.totalRecordedDays,
      `${item.attendanceRate}%`,
      tierLabel
    ];
  });

  // Daily totals row
  const dailyTotalsRow = [
    '',
    '',
    'សរុបវត្តមានប្រចាំថ្ងៃ',
    '',
    ...analytics.dailySummaries.map((ds) => ds.presentCount),
    analytics.actualPresents,
    analytics.actualPermissions,
    analytics.actualAbsents,
    analytics.totalPossiblePresents,
    `${analytics.averageAttendanceRate}%`,
    ''
  ];

  const worksheetData = [...headers, tableHeaderRow, ...rows, dailyTotalsRow];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto column widths
  const colWidths = [
    { wch: 6 },
    { wch: 12 },
    { wch: 22 },
    { wch: 8 },
    ...analytics.dateList.map(() => ({ wch: 7 })),
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 18 }
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'តារាងស្រង់វត្តមាន');
  XLSX.writeFile(workbook, fileName);
}

/**
 * Creates Telegram notification message template in Khmer for parent
 */
export function buildParentAttendanceAlertMessage(
  student: Student,
  teacher: TeacherProfile,
  absentDates: string[],
  consecutiveCount: number
): string {
  const datesText = absentDates
    .map((d) => {
      const [y, m, day] = d.split('-').map(Number);
      return `ថ្ងៃទី ${day} ខែ ${KHMER_MONTH_NAMES[m - 1]}`;
    })
    .join(', ');

  return `📢 【សេចក្តីជូនដំណឹងស្តីពីអវត្តមានសិស្ស】
សាលាបឋមសិក្សា៖ ${teacher.school || 'សាលាបឋមសិក្សា'}
ថ្នាក់៖ ${teacher.grade || 'ថ្នាក់ទី ៤'} | គ្រូបន្ទុកថ្នាក់៖ ${teacher.name || 'លោកគ្រូ/អ្នកគ្រូ'}

សូមជម្រាបសួរ អាណាព្យាបាលសិស្សឈ្មោះ៖ *${student.name}* (ភេទ: ${student.gender})
ខ្ញុំបាទ/នាងខ្ញុំ សូមគោរពជម្រាបជូនថា ប្អូនសិស្សបានខកខានមិនបានមកចូលរៀននៅ ${datesText} ${
    consecutiveCount > 1 ? `(អវត្តមាន ${consecutiveCount} ថ្ងៃជាប់គ្នា)` : ''
  } ដោយពុំទាន់បានទទួលលិខិតសុំច្បាប់ច្បាស់លាស់នៅឡើយ។

ដើម្បីធានាបាននូវការបន្តការសិក្សា និងសុវត្ថិភាពរបស់កូនៗ សូមលោក-លោកស្រី មេត្តាជួយទាក់ទងមកគ្រូបន្ទុកថ្នាក់តាមរយៈលេខទូរស័ព្ទ៖ ${teacher.phone || '012 345 678'}។

សូមអរគុណ និងសូមគោរពជូនពរសុខភាពល្អ! 🙏`;
}
