import { Student, AttendanceDatabase, AttendanceStatus } from '../types';

export function formatDateYMD(d: Date | string = new Date()): string {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toISOString().split('T')[0];
}

const KHMER_DAYS = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
const KHMER_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

export function getKhmerDayName(d: Date | string = new Date()): string {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  return KHMER_DAYS[dateObj.getDay()] || '';
}

export function getKhmerMonthName(mIndex: number): string {
  return KHMER_MONTHS[mIndex] || '';
}

export interface RangeAttendanceAnalytics {
  totalDays: number;
  presentRate: number;
  absentPermissionRate: number;
  absentNoPermissionRate: number;
  studentStats: {
    studentId: number;
    present: number;
    absentWithPermission: number;
    absentWithoutPermission: number;
    attendanceRate: number;
  }[];
}

export function getWeekDates(baseDate: Date = new Date()): string[] {
  const dates: string[] = [];
  const current = new Date(baseDate);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Monday
  current.setDate(diff);

  for (let i = 0; i < 6; i++) {
    const d = new Date(current);
    d.setDate(current.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function getMonthDates(year: number, month: number): string[] {
  const dates: string[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    if (date.getDay() !== 0) { // Exclude Sunday
      dates.push(date.toISOString().split('T')[0]);
    }
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

export function getDateRangeDates(startDateStr: string, endDateStr: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const current = new Date(start);

  while (current <= end) {
    if (current.getDay() !== 0) {
      dates.push(current.toISOString().split('T')[0]);
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function calculateAttendanceAnalytics(
  students: Student[],
  attendance: AttendanceDatabase,
  dates: string[]
): RangeAttendanceAnalytics {
  let totalRecords = 0;
  let totalPresent = 0;
  let totalPerm = 0;
  let totalNoPerm = 0;

  const studentStats = students.map((s) => {
    let p = 0;
    let ap = 0;
    let anp = 0;

    dates.forEach((d) => {
      const status = attendance[d]?.[s.id];
      if (status === 'វត្តមាន' || !status) {
        p++;
      } else if (status === 'ច្បាប់') {
        ap++;
      } else if (status === 'អវត្តមាន') {
        anp++;
      }
    });

    const total = p + ap + anp;
    totalRecords += total;
    totalPresent += p;
    totalPerm += ap;
    totalNoPerm += anp;

    return {
      studentId: s.id,
      present: p,
      absentWithPermission: ap,
      absentWithoutPermission: anp,
      attendanceRate: total > 0 ? Math.round((p / total) * 100) : 100,
    };
  });

  return {
    totalDays: dates.length,
    presentRate: totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 100,
    absentPermissionRate: totalRecords > 0 ? Math.round((totalPerm / totalRecords) * 100) : 0,
    absentNoPermissionRate: totalRecords > 0 ? Math.round((totalNoPerm / totalRecords) * 100) : 0,
    studentStats,
  };
}

export function generateSampleAttendance(
  students: Student[],
  dates: string[]
): AttendanceDatabase {
  const db: AttendanceDatabase = {};
  dates.forEach((d) => {
    db[d] = {};
    students.forEach((s) => {
      const rand = Math.random();
      if (rand > 0.95) {
        db[d][s.id] = 'អវត្តមាន';
      } else if (rand > 0.9) {
        db[d][s.id] = 'ច្បាប់';
      } else {
        db[d][s.id] = 'វត្តមាន';
      }
    });
  });
  return db;
}

export function exportAttendanceAnalyticsToExcel(
  students: Student[],
  analytics: RangeAttendanceAnalytics,
  title = 'វត្តមានសិស្ស'
): void {
  const header = 'ល.រ,ឈ្មោះសិស្ស,វត្តមាន (ថ្ងៃ),ច្បាប់ (ថ្ងៃ),អវត្តមាន (ថ្ងៃ),ភាគរយវត្តមាន (%)\n';
  const rows = students
    .map((s, idx) => {
      const stat = analytics.studentStats.find((st) => st.studentId === s.id);
      return `${idx + 1},${s.name},${stat?.present || 0},${stat?.absentWithPermission || 0},${stat?.absentWithoutPermission || 0},${stat?.attendanceRate || 100}%`;
    })
    .join('\n');

  const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function buildParentAttendanceAlertMessage(
  studentName: string,
  date: string,
  status: AttendanceStatus
): string {
  return `ជម្រាបសួរអាណាព្យាបាលសិស្ស ${studentName}! នៅថ្ងៃទី ${date} សិស្សបានកត់ត្រាវត្តមាន៖ ${status}។ សូមអរគុណ!`;
}
