import React, { useRef, useState } from 'react';
import {
  Printer,
  X,
  FileText,
  Download,
  Settings2,
  CheckCircle2,
  Maximize2,
  Compass,
  Grid,
  Users2,
  Layers,
  Sparkles,
  Eye,
  Star
} from 'lucide-react';
import { TeacherProfile } from '../types';
import { GridDesk } from './DigitalClassroomLayout';
import { getKhmerCombinedDate, toKhmerNum } from '../utils/khmerDate';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';

interface ClassroomSeatingPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  gridDesks: GridDesk[];
  sanitationDuty: Array<{
    day: string;
    teamName: string;
    leader: string;
    members: string[];
    tasks: string;
  }>;
}

export const ClassroomSeatingPrintModal: React.FC<ClassroomSeatingPrintModalProps> = ({
  isOpen,
  onClose,
  teacher,
  gridDesks,
  sanitationDuty
}) => {
  const [printOrientation, setPrintOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [colorMode, setColorMode] = useState<'color' | 'bw'>('color');
  const [showSanitationTable, setShowSanitationTable] = useState<boolean>(true);
  const [showStatsSummary, setShowStatsSummary] = useState<boolean>(true);
  const [academicYear, setAcademicYear] = useState<string>(teacher.academicYear || '២០២៥ - ២០២៦');
  const [roomNumber, setRoomNumber] = useState<string>('០៤');
  const [khmerDateStr, setKhmerDateStr] = useState<string>(() =>
    getKhmerCombinedDate(new Date(), { location: teacher.school || 'កំពង់ឆ្នាំង', format: 'combined_multiline' })
  );

  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Calculate dynamic dimensions and statistics based on actual student count
  const maxCol = Math.max(...gridDesks.map((d) => d.colIndex || 1), 1);
  const maxRow = Math.max(...gridDesks.map((d) => d.rowIndex || 1), 1);

  let totalValidStudents = 0;
  let boyCount = 0;
  let girlCount = 0;
  let eyeCareCount = 0;
  let leaderCount = 0;

  gridDesks.forEach((desk) => {
    [desk.seatLeft, desk.seatRight].forEach((seat) => {
      const isEmpty = seat.name === '(ទំនេរ)' || seat.id < 0;
      if (!isEmpty) {
        totalValidStudents++;
        if (seat.gender === 'ស្រី') girlCount++;
        else boyCount++;
        if (seat.needsEyeCare) eyeCareCount++;
        if (seat.isLeader || seat.isTopStudent) leaderCount++;
      }
    });
  });

  // Generate isolated clean HTML string for window.print()
  const generatePrintHTML = () => {
    const isBW = colorMode === 'bw';
    const isLandscape = printOrientation === 'landscape';
    const activeFont = getActiveCustomFontFamily();
    const activeTheme = getActiveCustomBackgroundTheme();
    const docBackgroundCss = isBW ? 'background: #ffffff !important;' : getThemeBackgroundCss(activeTheme);

    return `
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="utf-8" />
  <title>ប្លង់តុថ្នាក់រៀន_${teacher.grade}_${teacher.school}_A4</title>
  ${getKhmerGoogleFontsLinkHtml()}
  <style>
    @page {
      size: A4 ${isLandscape ? 'landscape' : 'portrait'};
      margin: 5mm 8mm 5mm 8mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
      font-size: 8.5pt;
      line-height: 1.25;
      color: #000;
      background: #ffffff !important;
      background-color: #ffffff !important;
      background-image: none !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 2px;
    }
    .font-moul {
      font-family: 'Moul', cursive, serif;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 4px;
    }
    .header-table td {
      vertical-align: top;
      padding: 0 4px;
    }
    .title-banner {
      text-align: center;
      margin: 3px 0 6px 0;
      padding: 3px 0;
      border-top: 1.5px solid #000;
      border-bottom: 1.5px solid #000;
      background: ${isBW ? '#f3f4f6' : '#f0fdf4'};
    }
    .title-banner h2 {
      font-size: 11pt;
      font-weight: 700;
      color: ${isBW ? '#000' : '#14532d'};
      letter-spacing: 0.5px;
    }
    .info-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8pt;
      font-weight: 600;
      margin-bottom: 4px;
      padding: 0 4px;
    }
    
    /* Front Classroom Stage */
    .front-stage {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;
      padding: 4px 10px;
      background: ${isBW ? '#f3f4f6' : '#e0e7ff'};
      border: 1.5px solid ${isBW ? '#000' : '#4338ca'};
      border-radius: 6px;
    }
    .board-box {
      flex: 1;
      text-align: center;
      font-weight: 700;
      font-size: 9pt;
      color: ${isBW ? '#000' : '#1e1b4b'};
    }
    .teacher-desk-box {
      border: 1.5px dashed ${isBW ? '#000' : '#4338ca'};
      background: ${isBW ? '#fff' : '#ffffff'};
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 700;
      text-align: center;
    }

    /* Desk Grid Dynamic Columns */
    .desks-grid {
      display: grid;
      grid-template-columns: repeat(${Math.min(maxCol, 6)}, 1fr);
      gap: 5px;
      margin-bottom: 6px;
    }
    .desk-card {
      border: 1.5px solid #000;
      border-radius: 5px;
      background: #fff;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .desk-card-header {
      background: ${isBW ? '#e5e7eb' : '#f1f5f9'};
      padding: 2px 4px;
      font-size: 7.5pt;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #000;
      color: #000;
    }
    .desk-card-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      divide-x: 1px solid #000;
    }
    .seat-box {
      padding: 3px 4px;
      min-height: 38px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-right: 1px solid #000;
    }
    .seat-box:last-child {
      border-right: none;
    }
    .seat-num {
      font-size: 7pt;
      font-weight: 700;
      color: #4b5563;
    }
    .seat-name {
      font-size: 8pt;
      font-weight: 700;
      color: #000;
      margin: 1px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .seat-tag {
      font-size: 6.5pt;
      font-weight: 600;
      display: inline-block;
      color: #1f2937;
    }
    .seat-eyecare {
      background: ${isBW ? '#e5e7eb' : '#fef3c7'};
      color: ${isBW ? '#000' : '#92400e'};
      padding: 0 2px;
      border-radius: 2px;
    }

    /* Tables */
    .summary-table, .sanitation-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
      font-size: 7.5pt;
    }
    .summary-table th, .summary-table td,
    .sanitation-table th, .sanitation-table td {
      border: 1px solid #000;
      padding: 2.5px 4px;
      text-align: left;
    }
    .summary-table th, .sanitation-table th {
      background: ${isBW ? '#e5e7eb' : '#f8fafc'};
      font-weight: 700;
      text-align: center;
    }

    /* Signatures */
    .signature-container {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      padding: 0 15px;
      page-break-inside: avoid;
    }
    .sig-block {
      text-align: center;
      width: 200px;
    }
    .sig-title {
      font-size: 8pt;
      font-weight: 700;
    }
    .sig-name {
      margin-top: 36px;
      font-size: 8.5pt;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- 1. Header Official MoEYS (១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់) -->
    <div style="text-align: center; margin-bottom: 6px;">
      <div class="font-moul" style="font-size: 10pt; font-weight: bold; color: #0f172a;">ព្រះរាជាណាចក្រកម្ពុជា</div>
      <div class="font-moul" style="font-size: 8.5pt; font-weight: bold; color: #1e293b; margin-top: 1px;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
      <div style="font-size: 8pt; letter-spacing: 2px; margin-top: 1px; font-weight: bold; color: #334155;">— ༺ ៚ ༻ —</div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px; border-bottom: 2px solid #0f172a; padding-bottom: 4px;">
      <div style="text-align: left;">
        <div style="font-size: 8.5pt; font-weight: 700; color: #0f172a;">ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុកសៀមបូក</div>
        <div style="font-size: 9pt; font-weight: 700; color: #1e1b4b; margin-top: 1px;">សាលារៀន៖ <span>${teacher.school || 'សាលារៀនគំរូ'}</span></div>
      </div>
      <div style="text-align: right; font-size: 8pt; color: #334155;">
        <div>ថ្នាក់ទទួលបន្ទុក៖ <b>${teacher.grade || 'ថ្នាក់ទី ៤A'}</b> | បន្ទប់លេខ៖ <b>${toKhmerNum(roomNumber)}</b></div>
        <div>គ្រូបន្ទុកថ្នាក់៖ <b>${teacher.name}</b> | ឆ្នាំសិក្សា៖ <b>${teacher.academicYear || academicYear}</b></div>
      </div>
    </div>

    <!-- 2. Title Banner -->
    <div class="title-banner">
      <h2 class="font-moul">ប្លង់តុ និងការរៀបចំថ្នាក់រៀន (${toKhmerNum(maxCol)} ជួរទទឹង × ${toKhmerNum(maxRow)} ជូរបណ្តាយ)</h2>
    </div>

    <!-- 3. Sub Info Bar -->
    <div class="info-bar">
      <div>គ្រូបន្ទុកថ្នាក់៖ <b>${teacher.name || 'លោកគ្រូ / អ្នកគ្រូ'}</b></div>
      <div>ឆ្នាំសិក្សា៖ <b>${teacher.academicYear || academicYear}</b></div>
      <div>ចំនួនតុ៖ <b>${toKhmerNum(gridDesks.length)} តុ (សិស្ស ${toKhmerNum(totalValidStudents)} នាក់: ស្រី ${toKhmerNum(girlCount)} នាក់)</b></div>
    </div>

    <!-- 4. Front Stage: Board & Teacher Desk -->
    <div class="front-stage">
      <div class="board-box">
        ▲ [ ក្តារខៀន / SMART BOARD INTERACTIVE DISPLAY 86" ] ▲
      </div>
      <div class="teacher-desk-box">
        [ តុគ្រូបង្រៀន: ${teacher.name} ]
      </div>
    </div>

    <!-- 5. Dynamic Desks Grid -->
    <div class="desks-grid">
      ${gridDesks
        .map((desk) => {
          const l = desk.seatLeft;
          const r = desk.seatRight;
          const isLEmpty = l.name === '(ទំនេរ)' || l.id < 0;
          const isREmpty = r.name === '(ទំនេរ)' || r.id < 0;
          return `
        <div class="desk-card">
          <div class="desk-card-header">
            <span><b>${desk.deskLabel}</b></span>
            <span>តុលេខ ${toKhmerNum(desk.colIndex + (desk.rowIndex - 1) * maxCol)}</span>
          </div>
          <div class="desk-card-body">
            <div class="seat-box">
              ${
                isLEmpty
                  ? `<div class="seat-num"># -</div><div class="seat-name" style="color:#9ca3af;font-style:italic;">(កៅអីទំនេរ)</div><div><span class="seat-tag" style="color:#9ca3af;">ទំនេរ</span></div>`
                  : `
              <div class="seat-num">#${toKhmerNum(l.rollNo || l.id)} (${l.gender === 'ស្រី' ? 'ស' : 'ប'})</div>
              <div class="seat-name" title="${l.name}">${l.name}</div>
              <div>
                ${
                  l.needsEyeCare
                    ? `<span class="seat-tag seat-eyecare">👓 ខ្សោយភ្នែក</span>`
                    : l.isLeader
                    ? `<span class="seat-tag">👑 ${l.role}</span>`
                    : `<span class="seat-tag" style="color: #6b7280;">${l.role || 'សមាជិក'}</span>`
                }
              </div>
              `
              }
            </div>
            <div class="seat-box">
              ${
                isREmpty
                  ? `<div class="seat-num"># -</div><div class="seat-name" style="color:#9ca3af;font-style:italic;">(កៅអីទំនេរ)</div><div><span class="seat-tag" style="color:#9ca3af;">ទំនេរ</span></div>`
                  : `
              <div class="seat-num">#${toKhmerNum(r.rollNo || r.id)} (${r.gender === 'ស្រី' ? 'ស' : 'ប'})</div>
              <div class="seat-name" title="${r.name}">${r.name}</div>
              <div>
                ${
                  r.needsEyeCare
                    ? `<span class="seat-tag seat-eyecare">👓 ខ្សោយភ្នែក</span>`
                    : r.isLeader
                    ? `<span class="seat-tag">👑 ${r.role}</span>`
                    : `<span class="seat-tag" style="color: #6b7280;">${r.role || 'សមាជិក'}</span>`
                }
              </div>
              `
              }
            </div>
          </div>
        </div>
        `;
        })
        .join('')}
    </div>

    ${
      showStatsSummary
        ? `
    <!-- 6. Classroom Statistics -->
    <table class="summary-table">
      <thead>
        <tr>
          <th>សរុបសិស្ស</th>
          <th>សិស្សស្រី</th>
          <th>សិស្សប្រុស</th>
          <th>សរុបតុ</th>
          <th>សិស្សពាក់វ៉ែនតា/ជួរមុខ</th>
          <th>សិស្សពូកែ/ដឹកនាំ</th>
        </tr>
      </thead>
      <tbody>
        <tr style="text-align: center;">
          <td style="font-weight: 700; text-align: center;">${toKhmerNum(totalValidStudents)} នាក់</td>
          <td style="text-align: center;">${toKhmerNum(girlCount)} នាក់</td>
          <td style="text-align: center;">${toKhmerNum(boyCount)} នាក់</td>
          <td style="font-weight: 700; text-align: center;">${toKhmerNum(gridDesks.length)} តុទ្វេ</td>
          <td style="text-align: center;">${toKhmerNum(eyeCareCount)} នាក់ (ជួរទី ១ ខាងមុខ)</td>
          <td style="text-align: center;">${toKhmerNum(leaderCount)} នាក់ (ជួរកណ្តាល & ប្រចាំក្រុម)</td>
        </tr>
      </tbody>
    </table>
    `
        : ''
    }

    ${
      showSanitationTable
        ? `
    <!-- 7. Sanitation Duty Schedule -->
    <table class="sanitation-table">
      <thead>
        <tr>
          <th style="width: 12%;">ថ្ងៃ</th>
          <th style="width: 25%;">ក្រុមទទួលខុសត្រូវ</th>
          <th style="width: 23%;">ប្រធានវេន</th>
          <th style="width: 40%;">ភារកិច្ចអនាម័យចម្បង</th>
        </tr>
      </thead>
      <tbody>
        ${sanitationDuty
          .map(
            (duty) => `
          <tr>
            <td style="font-weight: 700; text-align: center;">${duty.day}</td>
            <td><b>${duty.teamName}</b></td>
            <td>${duty.leader}</td>
            <td>${duty.tasks}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
    `
        : ''
    }

    <!-- 8. Signatures Block (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) -->
    <div style="margin-top: 14px; page-break-inside: avoid;">
      <!-- ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 12px; padding-right: 15px;">
        <div style="text-align: center; width: 200px;">
          <div style="font-size: 7.5pt; font-style: italic; white-space: pre-line;">${khmerDateStr}</div>
          <div class="sig-title" style="margin-top: 2px;">គ្រូបន្ទុកថ្នាក់</div>
          <div style="height: 36px;"></div>
          <div class="sig-name" style="margin-top: 0;">${teacher.name || 'លោកគ្រូ / អ្នកគ្រូ'}</div>
        </div>
      </div>

      <!-- ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា -->
      <div style="display: flex; justify-content: flex-start; padding-left: 15px;">
        <div style="text-align: center; width: 200px;">
          <div class="sig-title">បានឃើញ និងឯកភាព</div>
          <div class="sig-title">នាយកសាលា</div>
          <div style="height: 36px;"></div>
          <div class="sig-name" style="margin-top: 0;">...................................................</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
`;
  };

  // Direct print action using isolated popup window
  const handleDirectPrint = () => {
    const printWindow = window.open('', '_blank', 'width=1120,height=820');
    if (!printWindow) {
      // If popup blocker blocked it, fallback to window.print()
      window.print();
      return;
    }
    printWindow.document.open();
    printWindow.document.write(generatePrintHTML());
    printWindow.document.close();
  };

  // Download printable HTML file
  const handleDownloadHTML = () => {
    const html = generatePrintHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ប្លង់តុ_A4_${teacher.grade || 'ថ្នាក់ទី៤'}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export to Word compatible HTML
  const handleExportWord = () => {
    const html = generatePrintHTML();
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ប្លង់តុសិស្ស_${teacher.grade || 'ថ្នាក់ទី៤'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between border-b border-purple-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-xl shrink-0">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  បោះពុម្ពប្លង់តុសិស្ស A4 ១០០% (MoEYS Standard Seating Chart)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[10px]">
                  A4 Landscape
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5">
                ទម្រង់ស្ដង់ដារក្រសួងអប់រំ ៤ ជួរទទឹង × ៦ ជូរបណ្តាយ (២៤ តុ = ៤៨ សិស្ស) រួមទាំងតារាងវេនអនាម័យ និងហត្ថលេខា
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Options */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Color Mode */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setColorMode('color')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  colorMode === 'color' ? 'bg-purple-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎨 ពណ៌ធម្មជាតិ (Full Color)
              </button>
              <button
                type="button"
                onClick={() => setColorMode('bw')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  colorMode === 'bw' ? 'bg-purple-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🖨️ ស-ខ្មៅ សន្សំថ្នាំ (Ink Saver)
              </button>
            </div>

            {/* Checkboxes */}
            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={showSanitationTable}
                onChange={(e) => setShowSanitationTable(e.target.checked)}
                className="rounded text-purple-900 focus:ring-purple-500 w-4 h-4"
              />
              <span>តារាងវេនអនាម័យ</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={showStatsSummary}
                onChange={(e) => setShowStatsSummary(e.target.checked)}
                className="rounded text-purple-900 focus:ring-purple-500 w-4 h-4"
              />
              <span>ស្ថិតិសិស្សក្នុងថ្នាក់</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportWord}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-slate-700 transition flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>ទាញយក Word (.doc)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHTML}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-slate-700 transition flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>ទាញយក HTML</span>
            </button>

            <button
              type="button"
              onClick={handleDirectPrint}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-800 hover:from-purple-800 hover:to-indigo-700 text-white font-black transition flex items-center gap-2 shadow-md shadow-purple-900/20 active:scale-95"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>បោះពុម្ព A4 ភ្លាមៗ (Print Now)</span>
            </button>
          </div>
        </div>

        {/* Live A4 Sheet Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/80 flex justify-center">
          <div
            ref={printableRef}
            className={`w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-300 p-5 sm:p-7 text-black transition-colors ${
              colorMode === 'bw' ? 'grayscale contrast-125' : ''
            }`}
          >
            {/* 1. Header Official MoEYS (១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់) */}
            <div className="text-center space-y-0.5 mb-2.5">
              <h2 className="font-moul text-xs sm:text-sm text-slate-950">ព្រះរាជាណាចក្រកម្ពុជា</h2>
              <h3 className="font-moul text-[11px] sm:text-xs text-slate-950">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
              <p className="text-xs text-amber-900 font-bold tracking-wider mt-0.5">— ༺ ៚ ༻ —</p>
            </div>

            <div className="flex justify-between items-end border-b border-slate-300 pb-2.5 mb-3 text-xs font-bold text-slate-900">
              <div className="space-y-0.5 text-left">
                <p className="font-extrabold text-slate-950">ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុកសៀមបូក</p>
                <p className="text-sm font-black text-purple-950">សាលារៀន៖ {teacher.school || 'សាលារៀនគំរូ'}</p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-slate-700 font-semibold">ថ្នាក់ទទួលបន្ទុក៖ <strong className="text-slate-900">{teacher.grade || 'ថ្នាក់ទី ៤A'}</strong> | បន្ទប់លេខ៖ <strong className="text-slate-900">{toKhmerNum(roomNumber)}</strong></p>
                <p className="text-slate-700 font-semibold">គ្រូបន្ទុកថ្នាក់៖ <strong className="text-slate-900">{teacher.name}</strong> | ឆ្នាំសិក្សា៖ <strong className="text-slate-900">{teacher.academicYear || academicYear}</strong></p>
              </div>
            </div>

            {/* 2. Banner */}
            <div className="text-center py-2 px-4 bg-purple-50 rounded-xl border border-purple-200 mb-3">
              <h2 className="font-moul text-sm sm:text-base text-purple-950">
                ប្លង់តុ និងការរៀបចំថ្នាក់រៀន ({toKhmerNum(maxCol)} ជួរទទឹង × {toKhmerNum(maxRow)} ជូរបណ្តាយ)
              </h2>
              <div className="flex items-center justify-between text-xs text-purple-900 font-bold mt-1 px-2">
                <span>គ្រូបន្ទុកថ្នាក់៖ <strong>{teacher.name}</strong></span>
                <span>ឆ្នាំសិក្សា៖ <strong>{teacher.academicYear || academicYear}</strong></span>
                <span>ទំហំ៖ <strong>{toKhmerNum(gridDesks.length)} តុទ្វេ ({toKhmerNum(totalValidStudents)} សិស្ស)</strong></span>
              </div>
            </div>

            {/* 3. Front of Classroom: Board & Teacher Desk */}
            <div className="flex items-center justify-between gap-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl mb-4 text-xs font-bold text-emerald-950">
              <div className="flex-1 text-center font-black">
                ▲ [ ក្តារខៀន / SMART BOARD INTERACTIVE DISPLAY 86" ] ▲
              </div>
              <div className="px-4 py-1.5 bg-white border border-emerald-400 rounded-lg shadow-2xs text-center shrink-0">
                [ តុគ្រូបង្រៀន: <strong>{teacher.name}</strong> ]
              </div>
            </div>

            {/* 4. Dynamic Desks Grid Preview */}
            <div 
              className="grid gap-2.5 mb-4"
              style={{
                gridTemplateColumns: `repeat(${Math.min(maxCol, 4)}, minmax(0, 1fr))`
              }}
            >
              {gridDesks.map((desk) => {
                const l = desk.seatLeft;
                const r = desk.seatRight;
                const isLEmpty = l.name === '(ទំនេរ)' || l.id < 0;
                const isREmpty = r.name === '(ទំនេរ)' || r.id < 0;
                return (
                  <div key={desk.deskId} className="border-2 border-slate-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                    <div className="bg-slate-100 px-2 py-1 border-b border-slate-300 flex items-center justify-between text-[11px] font-black text-slate-800">
                      <span>{desk.deskLabel}</span>
                      <span className="text-[10px] text-slate-500">តុ {toKhmerNum(desk.colIndex + (desk.rowIndex - 1) * maxCol)}</span>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-slate-300 text-xs p-1.5 gap-1">
                      {/* Left Seat */}
                      <div className="space-y-0.5 min-w-0 pr-1">
                        {isLEmpty ? (
                          <div className="text-center py-2 text-slate-400 text-[10px] italic">
                            (កៅអីទំនេរ)
                          </div>
                        ) : (
                          <>
                            <div className="text-[10px] font-mono text-slate-400 font-bold">
                              #{toKhmerNum(l.rollNo || l.id)} ({l.gender === 'ស្រី' ? 'ស' : 'ប'})
                            </div>
                            <div className="font-bold text-slate-900 truncate text-[11px]" title={l.name}>
                              {l.name}
                            </div>
                            <div className="text-[9px]">
                              {l.needsEyeCare ? (
                                <span className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">👓 ភ្នែក</span>
                              ) : l.isLeader ? (
                                <span className="px-1 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold">👑 ប្រធាន</span>
                              ) : (
                                <span className="text-slate-400">{l.role || 'សមាជិក'}</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Right Seat */}
                      <div className="space-y-0.5 min-w-0 pl-1">
                        {isREmpty ? (
                          <div className="text-center py-2 text-slate-400 text-[10px] italic">
                            (កៅអីទំនេរ)
                          </div>
                        ) : (
                          <>
                            <div className="text-[10px] font-mono text-slate-400 font-bold">
                              #{toKhmerNum(r.rollNo || r.id)} ({r.gender === 'ស្រី' ? 'ស' : 'ប'})
                            </div>
                            <div className="font-bold text-slate-900 truncate text-[11px]" title={r.name}>
                              {r.name}
                            </div>
                            <div className="text-[9px]">
                              {r.needsEyeCare ? (
                                <span className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">👓 ភ្នែក</span>
                              ) : r.isLeader ? (
                                <span className="px-1 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold">👑 ប្រធាន</span>
                              ) : (
                                <span className="text-slate-400">{r.role || 'សមាជិក'}</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 5. Statistics Table */}
            {showStatsSummary && (
              <div className="border border-slate-300 rounded-xl overflow-hidden mb-3 text-xs">
                <table className="w-full text-center border-collapse">
                  <thead className="bg-slate-100 font-black text-slate-800 border-b border-slate-300 text-[11px]">
                    <tr>
                      <th className="p-1.5 border-r border-slate-300">សរុបសិស្ស</th>
                      <th className="p-1.5 border-r border-slate-300">សិស្សស្រី</th>
                      <th className="p-1.5 border-r border-slate-300">សិស្សប្រុស</th>
                      <th className="p-1.5 border-r border-slate-300">សរុបតុ</th>
                      <th className="p-1.5 border-r border-slate-300">សិស្សពាក់វ៉ែនតា/ជួរមុខ</th>
                      <th className="p-1.5">សិស្សពូកែ/ដឹកនាំ</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold text-slate-700">
                    <tr>
                      <td className="p-1.5 border-r border-slate-300 text-purple-950 font-black">{toKhmerNum(totalValidStudents)} នាក់</td>
                      <td className="p-1.5 border-r border-slate-300">{toKhmerNum(girlCount)} នាក់</td>
                      <td className="p-1.5 border-r border-slate-300">{toKhmerNum(boyCount)} នាក់</td>
                      <td className="p-1.5 border-r border-slate-300">{toKhmerNum(gridDesks.length)} តុទ្វេ</td>
                      <td className="p-1.5 border-r border-slate-300">{toKhmerNum(eyeCareCount)} នាក់ (ជួរមុខ)</td>
                      <td className="p-1.5">{toKhmerNum(leaderCount)} នាក់</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* 6. Sanitation Table */}
            {showSanitationTable && (
              <div className="border border-slate-300 rounded-xl overflow-hidden mb-4 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 font-black text-slate-800 border-b border-slate-300 text-[11px]">
                    <tr>
                      <th className="p-1.5 border-r border-slate-300 text-center w-16">ថ្ងៃ</th>
                      <th className="p-1.5 border-r border-slate-300 w-44">ក្រុមទទួលខុសត្រូវ</th>
                      <th className="p-1.5 border-r border-slate-300 w-48">ប្រធានវេន</th>
                      <th className="p-1.5">ភារកិច្ចអនាម័យចម្បង</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                    {sanitationDuty.map((duty) => (
                      <tr key={duty.day}>
                        <td className="p-1.5 border-r border-slate-300 font-black text-center text-purple-950">{duty.day}</td>
                        <td className="p-1.5 border-r border-slate-300 font-bold">{duty.teamName}</td>
                        <td className="p-1.5 border-r border-slate-300">{duty.leader}</td>
                        <td className="p-1.5 text-slate-600">{duty.tasks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 7. Signatures (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) */}
            <div className="pt-3 px-6 text-xs space-y-4">
              {/* ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ */}
              <div className="flex justify-end">
                <div className="text-center space-y-0.5 min-w-[200px]">
                  <p className="text-[11px] text-slate-600 italic whitespace-pre-line">{khmerDateStr}</p>
                  <p className="font-bold text-slate-900">គ្រូបន្ទុកថ្នាក់</p>
                  <div className="h-10"></div>
                  <p className="font-black text-purple-950">{teacher.name}</p>
                </div>
              </div>

              {/* ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា */}
              <div className="flex justify-start">
                <div className="text-center space-y-1 min-w-[200px]">
                  <p className="font-bold text-slate-900">បានឃើញ និងឯកភាព</p>
                  <p className="font-bold text-slate-900">នាយកសាលា</p>
                  <div className="h-10"></div>
                  <p className="font-bold text-slate-400">...................................................</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
