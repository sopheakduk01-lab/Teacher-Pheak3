import { TeacherProfile, Student, AttendanceDatabase } from '../types';
import { RangeAttendanceAnalytics } from './attendanceAnalytics';

export function generateAttendancePdfHtml(
  teacher: TeacherProfile,
  students: Student[],
  attendance: AttendanceDatabase,
  dates: string[],
  analytics: RangeAttendanceAnalytics,
  title = 'បញ្ជីវត្តមានសិស្ស'
): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&display=swap');
    body { font-family: 'Kantumruy Pro', sans-serif; padding: 20px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: center; }
    th { background: #f1f5f9; }
    .header { text-align: center; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>${teacher.schoolName || 'សាលាបឋមសិក្សាគំរូ'}</h2>
    <h3>${title} - ${teacher.className || 'ថ្នាក់ទី ៦'}</h3>
    <p>គ្រូបន្ទុកថ្នាក់ ៖ ${teacher.name}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>ល.រ</th>
        <th>ឈ្មោះសិស្ស</th>
        <th>ភេទ</th>
        <th>វត្តមាន (ថ្ងៃ)</th>
        <th>ច្បាប់ (ថ្ងៃ)</th>
        <th>អវត្តមាន (ថ្ងៃ)</th>
        <th>ភាគរយ</th>
      </tr>
    </thead>
    <tbody>
      ${students
        .map((s, idx) => {
          const stat = analytics.studentStats.find((st) => st.studentId === s.id);
          return `<tr>
            <td>${idx + 1}</td>
            <td style="text-align: left; font-weight: bold;">${s.name}</td>
            <td>${s.gender}</td>
            <td>${stat?.present || 0}</td>
            <td>${stat?.absentWithPermission || 0}</td>
            <td>${stat?.absentWithoutPermission || 0}</td>
            <td>${stat?.attendanceRate || 100}%</td>
          </tr>`;
        })
        .join('')}
    </tbody>
  </table>
</body>
</html>`;
}
