import { Student, TeacherProfile } from '../types';
import { RangeAttendanceAnalytics } from './attendanceAnalytics';
import { getKhmerDateDisplay, KHMER_MONTH_NAMES } from './khmerDate';

export interface AttendancePdfData {
  title: string;
  subtitle: string;
  tableHtml: string;
}

/**
 * Generates official MoEYS standard HTML report table for different attendance view modes
 */
export function generateAttendancePdfHtml(
  viewMode: 'daily' | 'weekly' | 'monthly' | 'annual' | 'custom' | 'alerts',
  teacher: TeacherProfile,
  students: Student[],
  analytics: RangeAttendanceAnalytics,
  options: {
    selectedDailyDate?: string;
    weeklyBaseDate?: string;
    selectedMonth?: number;
    selectedYear?: number;
    annualTerm?: 'full' | 'sem1' | 'sem2';
    customStartDate?: string;
    customEndDate?: string;
  } = {}
): AttendancePdfData {
  const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
  const totalCount = students.length;
  const femaleCount = students.filter((s) => s.gender === 'ស្រី').length;

  // 1. DAILY ATTENDANCE (ស្រង់វត្តមានប្រចាំថ្ងៃ)
  if (viewMode === 'daily') {
    const dailyDate = options.selectedDailyDate || new Date().toISOString().split('T')[0];
    const presentCount = analytics.actualPresents;
    const permissionCount = analytics.actualPermissions;
    const absentCount = analytics.actualAbsents;
    const rate = analytics.averageAttendanceRate;

    const title = 'តារាងស្រង់វត្តមានសិស្សប្រចាំថ្ងៃ និងតាមដានអវត្តមាន';
    const subtitle = `ការស្រង់វត្តមានសិស្ស ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ថ្ងៃទី ${dailyDate} (${getKhmerDateDisplay(dailyDate)}) ឆ្នាំសិក្សា ${academicYear}`;

    const tableHtml = `
      <div style="font-family: 'Siemreap', sans-serif; font-size: 8.5pt; color: #1e293b;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 7px 12px; border-radius: 6px; margin-bottom: 10px; font-weight: bold; font-size: 8.5pt;">
          <div>• សិស្សសរុប៖ <span style="color: #1e1b4b; font-weight: 800;">${totalCount}</span> នាក់ (ស្រី <span style="color: #be185d; font-weight: 800;">${femaleCount}</span> នាក់)</div>
          <div>• វត្តមានជាក់ស្តែង៖ <span style="color: #047857; font-weight: 800;">${presentCount}</span> នាក់</div>
          <div>• សុំច្បាប់ (P)៖ <span style="color: #d97706; font-weight: 800;">${permissionCount}</span> នាក់</div>
          <div>• អវត្តមានឥតច្បាប់ (A)៖ <span style="color: #b91c1c; font-weight: 800;">${absentCount}</span> នាក់</div>
          <div>• អត្រាវត្តមាន៖ <span style="color: #4338ca; font-weight: 800;">${rate}%</span></div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 35px;">ល.រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 75px;">អត្តលេខ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; width: 160px;">គោត្តនាម-នាម</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 45px;">ភេទ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 110px;">ស្ថានភាពវត្តមាន</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left;">មូលហេតុ / ការកត់សម្គាល់</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 95px;">លេខទូរស័ព្ទ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 90px;">ហត្ថលេខា</th>
            </tr>
          </thead>
          <tbody>
            ${analytics.studentSummaries.map((item, idx) => {
              const status = item.dailyStatus[dailyDate] || 'present';
              const statusLabel = status === 'present' ? 'វត្តមាន (✓)' : status === 'permission' ? 'ច្បាប់ (P)' : status === 'absent' ? 'អវត្តមាន (A)' : 'ពុំទាន់ស្រង់';
              const statusColor = status === 'present' ? '#047857' : status === 'permission' ? '#b45309' : '#b91c1c';
              const statusBg = status === 'present' ? '#ecfdf5' : status === 'permission' ? '#fffbeb' : '#fef2f2';

              return `
                <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${item.student.rollNo || idx + 1}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-weight: bold;">${item.student.civilId || '-'}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px 8px; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${item.student.name}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${item.student.gender}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; background-color: ${statusBg}; color: ${statusColor};">${statusLabel}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px 8px; font-size: 8pt; color: #475569;">${status === 'permission' ? 'មានការអនុញ្ញាតពីអាណាព្យាបាល' : status === 'absent' ? 'ខកខានមិនបានជូនដំណឹង' : 'មកទាន់ពេលវេលា'}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-size: 8pt;">${item.student.parentPhone || '-'}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;"></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    return { title, subtitle, tableHtml };
  }

  // 2. WEEKLY SUMMARY (បូកសរុបប្រចាំសប្តាហ៍ Matrix)
  if (viewMode === 'weekly') {
    const dates = analytics.dateList;
    const firstD = dates[0] || '';
    const lastD = dates[dates.length - 1] || '';

    const title = 'តារាងបូកសរុបវត្តមានសិស្សប្រចាំសប្តាហ៍ (Weekly Matrix)';
    const subtitle = `បូកសរុបវត្តមាន ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ចាប់ពីថ្ងៃ ${firstD} ដល់ ${lastD} (សរុប ${dates.length} ថ្ងៃសិក្សា) ឆ្នាំសិក្សា ${academicYear}`;

    const tableHtml = `
      <div style="font-family: 'Siemreap', sans-serif; font-size: 8pt; color: #1e293b;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; margin-bottom: 8px; font-weight: bold; font-size: 8.5pt;">
          <div>• សិស្សសរុប៖ <span style="color: #1e1b4b; font-weight: 800;">${totalCount}</span> នាក់ (ស្រី <span style="color: #be185d; font-weight: 800;">${femaleCount}</span> នាក់)</div>
          <div>• វត្តមានសរុប៖ <span style="color: #047857; font-weight: 800;">${analytics.actualPresents}</span> ដង</div>
          <div>• សុំច្បាប់៖ <span style="color: #d97706; font-weight: 800;">${analytics.actualPermissions}</span> ដង</div>
          <div>• អវត្តមាន៖ <span style="color: #b91c1c; font-weight: 800;">${analytics.actualAbsents}</span> ដង</div>
          <div>• អត្រាវត្តមានប្រចាំសប្តាហ៍៖ <span style="color: #4338ca; font-weight: 800;">${analytics.averageAttendanceRate}%</span></div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8pt;">
              <th style="border: 1px solid #cbd5e1; padding: 4px 2px; width: 30px;" rowspan="2">ល.រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 4px; width: 65px;" rowspan="2">អត្តលេខ</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 6px; text-align: left; width: 130px;" rowspan="2">គោត្តនាម-នាម</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 2px; width: 32px;" rowspan="2">ភេទ</th>
              <th style="border: 1px solid #cbd5e1; padding: 3px;" colspan="${dates.length}">ថ្ងៃសិក្សាក្នុងសប្តាហ៍</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 3px; width: 36px; background-color: #ecfdf5; color: #065f46;" rowspan="2">វត្តមាន (✓)</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 3px; width: 34px; background-color: #fffbeb; color: #92400e;" rowspan="2">ច្បាប់ (P)</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 3px; width: 34px; background-color: #fef2f2; color: #991b1b;" rowspan="2">អវត្ត (A)</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 4px; width: 50px; background-color: #f5f3ff; color: #4c1d95;" rowspan="2">អត្រា %</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 4px; width: 65px;" rowspan="2">វាយតម្លៃ</th>
            </tr>
            <tr style="background-color: #f8fafc; font-size: 7.5pt;">
              ${analytics.dailySummaries.map((ds) => `
                <th style="border: 1px solid #cbd5e1; padding: 3px 2px; width: 45px; text-align: center;">
                  <div>${ds.dayNameKhmer.replace('ថ្ងៃ', '')}</div>
                  <div style="font-size: 7pt; color: #64748b; font-family: monospace;">${ds.date.slice(5)}</div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${analytics.studentSummaries.map((item, idx) => {
              return `
                <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center;">${item.student.rollNo || idx + 1}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-family: monospace; font-weight: bold; font-size: 7.5pt;">${item.student.civilId || '-'}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px 6px; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${item.student.name}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${item.student.gender}</td>
                  ${dates.map((d) => {
                    const st = item.dailyStatus[d];
                    const symbol = st === 'present' ? '✓' : st === 'permission' ? 'P' : st === 'absent' ? 'A' : '-';
                    const color = st === 'present' ? '#047857' : st === 'permission' ? '#d97706' : st === 'absent' ? '#dc2626' : '#94a3b8';
                    const bg = st === 'absent' ? '#fee2e2' : st === 'permission' ? '#fef3c7' : 'transparent';
                    return `<td style="border: 1px solid #cbd5e1; padding: 3px 1px; text-align: center; font-weight: bold; font-size: 8pt; color: ${color}; background-color: ${bg};">${symbol}</td>`;
                  }).join('')}
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: bold; color: #047857; background-color: #f0fdf4;">${item.presentCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: bold; color: #d97706; background-color: #fffbeb;">${item.permissionCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: bold; color: #dc2626; background-color: #fef2f2;">${item.absentCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: 800; color: #4338ca; background-color: #f5f3ff;">${item.attendanceRate}%</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-size: 7.5pt; font-weight: bold; color: ${item.attendanceRate >= 90 ? '#047857' : item.attendanceRate >= 75 ? '#d97706' : '#dc2626'};">${item.attendanceRate >= 90 ? 'ទៀងទាត់ល្អ' : item.attendanceRate >= 75 ? 'មធ្យម' : 'អវត្តច្រើន'}</td>
                </tr>
              `;
            }).join('')}
            <!-- Summary Row -->
            <tr style="background-color: #f1f5f9; font-weight: bold; border-top: 2px solid #94a3b8;">
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;" colspan="4">សរុបវត្តមានប្រចាំថ្ងៃ (Daily Total)</td>
              ${analytics.dailySummaries.map((ds) => `
                <td style="border: 1px solid #cbd5e1; padding: 4px 1px; text-align: center; color: #047857;">${ds.presentCount}</td>
              `).join('')}
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; color: #047857;">${analytics.actualPresents}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; color: #d97706;">${analytics.actualPermissions}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; color: #dc2626;">${analytics.actualAbsents}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; color: #4338ca;" colspan="2">${analytics.averageAttendanceRate}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return { title, subtitle, tableHtml };
  }

  // 3. MONTHLY SUMMARY (បូកសរុបតាមខែ Monthly Matrix)
  if (viewMode === 'monthly') {
    const month = options.selectedMonth || (new Date().getMonth() + 1);
    const year = options.selectedYear || new Date().getFullYear();
    const monthKhmer = KHMER_MONTH_NAMES[month - 1] || `ខែទី${month}`;
    const dates = analytics.dateList;

    const title = `តារាងស្រង់វត្តមានសិស្សប្រចាំខែ ${monthKhmer} ឆ្នាំ ${year}`;
    const subtitle = `ស្ថិតិវត្តមានសិស្ស ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ខែ ${monthKhmer} (សរុប ${dates.length} ថ្ងៃសិក្សា) ឆ្នាំសិក្សា ${academicYear}`;

    const tableHtml = `
      <div style="font-family: 'Siemreap', sans-serif; font-size: 7.5pt; color: #1e293b;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; margin-bottom: 8px; font-weight: bold; font-size: 8.5pt;">
          <div>• សិស្សសរុប៖ <span style="color: #1e1b4b; font-weight: 800;">${totalCount}</span> នាក់ (ស្រី <span style="color: #be185d; font-weight: 800;">${femaleCount}</span> នាក់)</div>
          <div>• ថ្ងៃសិក្សាសរុប៖ <span style="color: #1e1b4b; font-weight: 800;">${dates.length}</span> ថ្ងៃ</div>
          <div>• វត្តមាន៖ <span style="color: #047857; font-weight: 800;">${analytics.actualPresents}</span> ដង</div>
          <div>• សុំច្បាប់៖ <span style="color: #d97706; font-weight: 800;">${analytics.actualPermissions}</span> ដង</div>
          <div>• អវត្តមាន៖ <span style="color: #b91c1c; font-weight: 800;">${analytics.actualAbsents}</span> ដង</div>
          <div>• អត្រាវត្តមានមធ្យម៖ <span style="color: #4338ca; font-weight: 800;">${analytics.averageAttendanceRate}%</span></div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 7.5pt;">
              <th style="border: 1px solid #cbd5e1; padding: 4px 2px; width: 26px;">ល.រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 4px; text-align: left; width: 115px;">គោត្តនាម-នាម</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 2px; width: 26px;">ភេទ</th>
              ${dates.map((d) => {
                const dayNum = parseInt(d.split('-')[2], 10);
                return `<th style="border: 1px solid #cbd5e1; padding: 3px 1px; width: 16px; font-size: 7pt; font-family: monospace;">${dayNum}</th>`;
              }).join('')}
              <th style="border: 1px solid #cbd5e1; padding: 4px 2px; width: 32px; background-color: #ecfdf5; color: #065f46;">វត្តមាន</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 2px; width: 30px; background-color: #fffbeb; color: #92400e;">ច្បាប់</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 2px; width: 30px; background-color: #fef2f2; color: #991b1b;">អវត្ត</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px 3px; width: 44px; background-color: #f5f3ff; color: #4c1d95;">%</th>
            </tr>
          </thead>
          <tbody>
            ${analytics.studentSummaries.map((item, idx) => {
              return `
                <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center;">${item.student.rollNo || idx + 1}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px 4px; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${item.student.name}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${item.student.gender}</td>
                  ${dates.map((d) => {
                    const st = item.dailyStatus[d];
                    const symbol = st === 'present' ? '•' : st === 'permission' ? 'P' : st === 'absent' ? 'A' : '';
                    const color = st === 'present' ? '#047857' : st === 'permission' ? '#d97706' : st === 'absent' ? '#dc2626' : '#cbd5e1';
                    const bg = st === 'absent' ? '#fee2e2' : st === 'permission' ? '#fef3c7' : 'transparent';
                    return `<td style="border: 1px solid #cbd5e1; padding: 2px 0; text-align: center; font-weight: bold; font-size: 7.5pt; color: ${color}; background-color: ${bg};">${symbol}</td>`;
                  }).join('')}
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: bold; color: #047857; background-color: #f0fdf4;">${item.presentCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: bold; color: #d97706; background-color: #fffbeb;">${item.permissionCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: bold; color: #dc2626; background-color: #fef2f2;">${item.absentCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: 800; color: #4338ca; background-color: #f5f3ff;">${item.attendanceRate}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <div style="margin-top: 6px; font-size: 7pt; color: #64748b; display: flex; gap: 14px;">
          <span>សម្គាល់៖</span>
          <span style="color: #047857; font-weight: bold;">• = វត្តមាន (Present)</span>
          <span style="color: #d97706; font-weight: bold;">P = សុំច្បាប់ (Permission)</span>
          <span style="color: #dc2626; font-weight: bold;">A = អវត្តមានឥតច្បាប់ (Absent)</span>
        </div>
      </div>
    `;

    return { title, subtitle, tableHtml };
  }

  // 4. ANNUAL / SEMESTER SUMMARY (បូកសរុបប្រចាំឆ្នាំ / ឆមាស)
  if (viewMode === 'annual') {
    const term = options.annualTerm || 'full';
    const termLabel = term === 'full' ? 'ពេញមួយឆ្នាំសិក្សា' : term === 'sem1' ? 'ឆមាសទី ១' : 'ឆមាសទី ២';

    const title = `តារាងបូកសរុបវត្តមានសិស្ស ${termLabel} ឆ្នាំសិក្សា ${academicYear}`;
    const subtitle = `ស្ថិតិបូកសរុបវត្តមានរួម ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} (កត់ត្រាសរុប ${analytics.dateList.length} ថ្ងៃសិក្សា)`;

    const tableHtml = `
      <div style="font-family: 'Siemreap', sans-serif; font-size: 8.5pt; color: #1e293b;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 7px 12px; border-radius: 6px; margin-bottom: 10px; font-weight: bold; font-size: 8.5pt;">
          <div>• សិស្សសរុប៖ <span style="color: #1e1b4b; font-weight: 800;">${totalCount}</span> នាក់ (ស្រី <span style="color: #be185d; font-weight: 800;">${femaleCount}</span> នាក់)</div>
          <div>• វត្តមានសរុប៖ <span style="color: #047857; font-weight: 800;">${analytics.actualPresents}</span></div>
          <div>• សុំច្បាប់សរុប៖ <span style="color: #d97706; font-weight: 800;">${analytics.actualPermissions}</span></div>
          <div>• អវត្តមានសរុប៖ <span style="color: #b91c1c; font-weight: 800;">${analytics.actualAbsents}</span></div>
          <div>• អត្រាវត្តមានរួម៖ <span style="color: #4338ca; font-weight: 800;">${analytics.averageAttendanceRate}%</span></div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 35px;">ល.រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 75px;">អត្តលេខ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; width: 140px;">គោត្តនាម-នាម</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 45px;">ភេទ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px;">ថ្ងៃកត់ត្រា</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px; background-color: #ecfdf5; color: #065f46;">វត្តមាន</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px; background-color: #fffbeb; color: #92400e;">ច្បាប់</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px; background-color: #fef2f2; color: #991b1b;">អវត្តមាន</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 75px; background-color: #f5f3ff; color: #4c1d95;">អត្រា %</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 85px;">កិត្តិយស</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left;">ការកត់សម្គាល់</th>
            </tr>
          </thead>
          <tbody>
            ${analytics.studentSummaries.map((item, idx) => {
              const tierLabel = item.honorTier === 'perfect' ? '🏆 ១០០%' : item.honorTier === 'excellent' ? '⭐ ល្អណាស់' : item.honorTier === 'good' ? 'ល្អ' : item.honorTier === 'warning' ? '⚠️ ត្រូវតាមដាន' : '🚨 ប្រកាសអាសន្ន';
              const tierColor = item.honorTier === 'perfect' || item.honorTier === 'excellent' ? '#047857' : item.honorTier === 'good' ? '#2563eb' : '#dc2626';

              return `
                <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${item.student.rollNo || idx + 1}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-weight: bold;">${item.student.civilId || '-'}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px 8px; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${item.student.name}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${item.student.gender}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">${item.totalRecordedDays} ថ្ងៃ</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: #047857; background-color: #f0fdf4;">${item.presentCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: #d97706; background-color: #fffbeb;">${item.permissionCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: #dc2626; background-color: #fef2f2;">${item.absentCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #4338ca; background-color: #f5f3ff;">${item.attendanceRate}%</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${tierColor};">${tierLabel}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px 8px; font-size: 8pt; color: #475569;">${item.absentCount >= 3 ? 'ត្រូវពិគ្រោះយោបល់ជាមួយមាតាបិតា' : 'ចូលរួមរៀនសូត្របានទៀងទាត់'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    return { title, subtitle, tableHtml };
  }

  // 5. CUSTOM RANGE SUMMARY (បូកសរុបចន្លោះថ្ងៃកំណត់)
  if (viewMode === 'custom') {
    const sDate = options.customStartDate || analytics.dateList[0] || '';
    const eDate = options.customEndDate || analytics.dateList[analytics.dateList.length - 1] || '';

    const title = `តារាងបូកសរុបវត្តមានសិស្ស ចន្លោះពី ${sDate} ដល់ ${eDate}`;
    const subtitle = `ស្ថិតិបូកសរុបវត្តមាន ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} សរុប ${analytics.dateList.length} ថ្ងៃសិក្សា ឆ្នាំសិក្សា ${academicYear}`;

    const tableHtml = `
      <div style="font-family: 'Siemreap', sans-serif; font-size: 8.5pt; color: #1e293b;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 7px 12px; border-radius: 6px; margin-bottom: 10px; font-weight: bold; font-size: 8.5pt;">
          <div>• សិស្សសរុប៖ <span style="color: #1e1b4b; font-weight: 800;">${totalCount}</span> នាក់ (ស្រី <span style="color: #be185d; font-weight: 800;">${femaleCount}</span> នាក់)</div>
          <div>• ថ្ងៃកត់ត្រាសរុប៖ <span style="color: #1e1b4b; font-weight: 800;">${analytics.dateList.length}</span> ថ្ងៃ</div>
          <div>• វត្តមាន៖ <span style="color: #047857; font-weight: 800;">${analytics.actualPresents}</span></div>
          <div>• សុំច្បាប់៖ <span style="color: #d97706; font-weight: 800;">${analytics.actualPermissions}</span></div>
          <div>• អវត្តមាន៖ <span style="color: #b91c1c; font-weight: 800;">${analytics.actualAbsents}</span></div>
          <div>• អត្រាវត្តមាន៖ <span style="color: #4338ca; font-weight: 800;">${analytics.averageAttendanceRate}%</span></div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
              <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 35px;">ល.រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 75px;">អត្តលេខ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; width: 140px;">គោត្តនាម-នាម</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 45px;">ភេទ</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 75px;">ថ្ងៃកត់ត្រា</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px; background-color: #ecfdf5; color: #065f46;">វត្តមាន</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px; background-color: #fffbeb; color: #92400e;">ច្បាប់</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px; background-color: #fef2f2; color: #991b1b;">អវត្តមាន</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 80px; background-color: #f5f3ff; color: #4c1d95;">អត្រា %</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left;">ការវាយតម្លៃ</th>
            </tr>
          </thead>
          <tbody>
            ${analytics.studentSummaries.map((item, idx) => {
              return `
                <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${item.student.rollNo || idx + 1}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-weight: bold;">${item.student.civilId || '-'}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px 8px; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${item.student.name}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${item.student.gender}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">${item.totalRecordedDays} ថ្ងៃ</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: #047857; background-color: #f0fdf4;">${item.presentCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: #d97706; background-color: #fffbeb;">${item.permissionCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: #dc2626; background-color: #fef2f2;">${item.absentCount}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #4338ca; background-color: #f5f3ff;">${item.attendanceRate}%</td>
                  <td style="border: 1px solid #cbd5e1; padding: 4px 8px; font-size: 8pt; font-weight: bold; color: ${item.attendanceRate >= 90 ? '#047857' : item.attendanceRate >= 75 ? '#d97706' : '#dc2626'};">${item.attendanceRate >= 90 ? 'ទៀងទាត់ល្អ' : item.attendanceRate >= 75 ? 'មធ្យម' : 'អវត្តមានច្រើន'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    return { title, subtitle, tableHtml };
  }

  // 6. AT-RISK STUDENTS SUMMARY (តាមដានសិស្សប្រឈម & អវត្តមានច្រើន)
  const atRiskList = analytics.studentSummaries.filter(
    (s) => s.attendanceRate < 80 || s.absentCount >= 3 || s.consecutiveAbsences >= 2
  );

  const title = 'របាយការណ៍តាមដានសិស្សប្រឈម និងអវត្តមានច្រើន (At-Risk Early Warning)';
  const subtitle = `បញ្ជីឈ្មោះសិស្សប្រឈមនឹងការបោះបង់ ឬខកខានការសិក្សា ថ្នាក់${teacher.grade || 'ថ្នាក់ទី ៤'} ឆ្នាំសិក្សា ${academicYear}`;

  const tableHtml = `
    <div style="font-family: 'Siemreap', sans-serif; font-size: 8.5pt; color: #1e293b;">
      <div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 8px 12px; border-radius: 6px; margin-bottom: 10px; font-weight: bold; font-size: 8.5pt; color: #991b1b;">
        ⚠️ សរុបសិស្សប្រឈម៖ <span style="font-weight: 800;">${atRiskList.length}</span> នាក់ (សិស្សដែលមានអត្រាវត្តមាន < 80%, អវត្តមាន ≥ 3 ដង ឬអវត្តមានជាប់ៗគ្នា ≥ 2 ថ្ងៃ)
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt;">
            <th style="border: 1px solid #cbd5e1; padding: 5px 3px; width: 35px;">ល.រ</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 75px;">អត្តលេខ</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; width: 140px;">គោត្តនាម-នាម</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 45px;">ភេទ</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 70px; color: #dc2626;">អវត្តមាន</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px 4px; width: 80px; color: #dc2626;">អវត្តមានជាប់គ្នា</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px 6px; width: 75px;">អត្រា %</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; width: 110px;">ទូរស័ព្ទអាណាព្យាបាល</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left;">វិធានការ & ផែនការអន្តរាគមន៍</th>
          </tr>
        </thead>
        <tbody>
          ${atRiskList.length === 0 ? `
            <tr>
              <td colspan="9" style="border: 1px solid #cbd5e1; padding: 20px; text-align: center; color: #047857; font-weight: bold;">
                ✓ ពុំមានសិស្សប្រឈមនឹងការបោះបង់ ឬអវត្តមានច្រើនទេ! សិស្សទាំងអស់មានវត្តមានល្អប្រសើរ។
              </td>
            </tr>
          ` : atRiskList.map((item, idx) => `
            <tr style="border-bottom: 1px solid #cbd5e1; ${idx % 2 === 1 ? 'background-color: #fafbfc;' : ''}">
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${item.student.rollNo || idx + 1}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-weight: bold;">${item.student.civilId || '-'}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px 8px; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#9d174d' : '#1e293b'};">${item.student.name}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; color: ${item.student.gender === 'ស្រី' ? '#be185d' : '#2563eb'};">${item.student.gender}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #dc2626; background-color: #fef2f2;">${item.absentCount} ដង</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #dc2626;">${item.consecutiveAbsences} ថ្ងៃ</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: 800; color: #dc2626;">${item.attendanceRate}%</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px 8px; font-family: monospace; font-size: 8pt;">${item.student.parentPhone || '-'}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px 8px; font-size: 8pt; color: #475569;">ផ្ញើសារ Telegram / ទូរស័ព្ទជួបផ្ទាល់ជាមួយអាណាព្យាបាល</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  return { title, subtitle, tableHtml };
}
