import React, { useState } from 'react';
import {
  Printer,
  X,
  FileText,
  UserCheck,
  CheckCircle2,
  Phone,
  Calendar,
  MapPin,
  Users,
  ShieldAlert,
  Sparkles,
  Download,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, TeacherProfile } from '../types';
import { getKhmerCombinedDate, toKhmerNum } from '../utils/khmerDate';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';

interface StudentRosterPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  teacher: TeacherProfile;
}

export const StudentRosterPrintModal: React.FC<StudentRosterPrintModalProps> = ({
  isOpen,
  onClose,
  students,
  teacher,
}) => {
  const [printLayout, setPrintLayout] = useState<'roster_table' | 'profiles_grid' | 'detailed_sheets'>('roster_table');
  const [paperOrientation, setPaperOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [filterCategory, setFilterCategory] = useState<'all' | 'female' | 'poor' | 'repeating'>('all');
  const [colorMode, setColorMode] = useState<'color' | 'bw'>('color');
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [customSubtitle, setCustomSubtitle] = useState('');

  if (!isOpen) return null;

  // Filter students based on selected filter
  const filteredStudents = students.filter((s) => {
    if (filterCategory === 'female') return s.gender === 'ស្រី';
    if (filterCategory === 'poor') return s.familyStatus === 'ក្រ១' || s.familyStatus === 'ក្រ២';
    if (filterCategory === 'repeating') return s.isRepeating || s.note?.includes('ត្រួតថ្នាក់') || s.familyStatus?.includes('ត្រួតថ្នាក់');
    return true;
  });

  const totalCount = students.length;
  const femaleCount = students.filter((s) => s.gender === 'ស្រី').length;
  const poorCount = students.filter((s) => s.familyStatus === 'ក្រ១' || s.familyStatus === 'ក្រ២').length;
  const repCount = students.filter((s) => s.isRepeating || s.note?.includes('ត្រួតថ្នាក់') || s.familyStatus?.includes('ត្រួតថ្នាក់')).length;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const activeFont = getActiveCustomFontFamily();
    const activeTheme = getActiveCustomBackgroundTheme();
    const isBW = colorMode === 'bw';
    const docBackgroundCss = isBW ? 'background: #ffffff !important;' : getThemeBackgroundCss(activeTheme);
    const isLandscape = paperOrientation === 'landscape';
    const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
    const schoolName = teacher.school || 'សាលាបឋមសិក្សាគំរូ';
    const gradeName = teacher.grade || 'ថ្នាក់ទី ៤';
    const teacherName = teacher.name || 'លោកគ្រូ/អ្នកគ្រូ';

    let contentHtml = '';

    if (printLayout === 'roster_table') {
      contentHtml = `
        <!-- Summary Stats Header -->
        <div class="stats-banner">
          <div class="stat-item"><strong>• សិស្សសរុប៖</strong> <span class="badge font-bold">${toKhmerNum(filteredStudents.length)}</span> នាក់ (ស្រី <span class="badge text-pink">${toKhmerNum(filteredStudents.filter(s => s.gender === 'ស្រី').length)}</span> នាក់)</div>
          <div class="stat-item"><strong>• ប័ណ្ណសមធម៌ (ក្រ១/ក្រ២)៖</strong> <span class="badge text-amber">${toKhmerNum(filteredStudents.filter(s => s.familyStatus === 'ក្រ១' || s.familyStatus === 'ក្រ២').length)}</span> នាក់</div>
          <div class="stat-item"><strong>• ត្រួតថ្នាក់៖</strong> <span class="badge text-blue">${toKhmerNum(filteredStudents.filter(s => s.isRepeating || s.note?.includes('ត្រួតថ្នាក់')).length)}</span> នាក់</div>
          <div class="stat-item"><strong>• ឡើងថ្នាក់/ថ្មី៖</strong> <span class="badge text-emerald">${toKhmerNum(filteredStudents.filter(s => !s.isRepeating && !s.note?.includes('ត្រួតថ្នាក់')).length)}</span> នាក់</div>
        </div>

        <!-- Official Table -->
        <table class="roster-table">
          <thead>
            <tr>
              <th style="width: 32px;">ល.រ</th>
              <th style="width: 68px;">អត្តលេខ</th>
              <th style="text-align: left; width: 145px;">គោត្តនាម និងនាម</th>
              <th style="width: 40px;">ភេទ</th>
              <th style="width: 80px;">ថ្ងៃខែឆ្នាំកំណើត</th>
              <th style="text-align: left;">ទីកន្លែងកំណើត</th>
              <th style="text-align: left; width: 125px;">ឈ្មោះឪពុក-ម្តាយ</th>
              <th style="width: 65px;">ស្ថានភាព</th>
              <th style="width: 80px;">ទូរស័ព្ទ</th>
              <th style="width: 60px;">សម្គាល់</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStudents.map((s, idx) => `
              <tr class="${idx % 2 === 1 ? 'zebra' : ''}">
                <td style="text-align: center; font-weight: bold;">${toKhmerNum(idx + 1)}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold;">${s.civilId || '-'}</td>
                <td style="font-weight: bold; ${isBW ? '' : s.gender === 'ស្រី' ? 'color: #831843;' : 'color: #0f172a;'}">
                  ${s.name}
                  ${s.latinName ? `<div style="font-size: 7.5pt; font-family: sans-serif; font-weight: normal; color: #64748b;">${s.latinName.toUpperCase()}</div>` : ''}
                </td>
                <td style="text-align: center; font-weight: bold; ${isBW ? '' : s.gender === 'ស្រី' ? 'color: #be185d;' : 'color: #2563eb;'}">${s.gender}</td>
                <td style="text-align: center;">${s.dob || '-'}</td>
                <td style="font-size: 8pt; line-height: 1.2;">${s.pob || s.address || '-'}</td>
                <td style="font-size: 8pt; line-height: 1.2;">
                  ${s.fatherName ? `ឳ៖ ${s.fatherName}` : ''}
                  ${s.fatherName && s.motherName ? '<br/>' : ''}
                  ${s.motherName ? `ម្តាយ៖ ${s.motherName}` : (!s.fatherName ? '-' : '')}
                </td>
                <td style="text-align: center; font-weight: bold; font-size: 8pt; ${isBW ? '' : s.familyStatus === 'ក្រ១' || s.familyStatus === 'ក្រ២' ? 'color: #b45309;' : 'color: #334155;'}">
                  ${s.familyStatus || 'ទូទៅ'}
                </td>
                <td style="text-align: center; font-family: monospace; font-size: 7.5pt;">${s.parentPhone || s.phone || '-'}</td>
                <td style="text-align: center; font-size: 7.5pt;">
                  ${s.isRepeating || s.note?.includes('ត្រួតថ្នាក់') ? '<span class="pill-rep">ត្រួតថ្នាក់</span>' : (s.note || 'នៅរស់')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (printLayout === 'profiles_grid') {
      contentHtml = `
        <div class="cards-grid">
          ${filteredStudents.map((s, idx) => `
            <div class="student-card">
              <div class="card-header">
                <span class="roll-badge">#${toKhmerNum(s.rollNo || idx + 1)}</span>
                <span class="card-gender ${s.gender === 'ស្រី' ? 'gender-female' : 'gender-male'}">${s.gender}</span>
              </div>
              <div class="card-body">
                <div class="card-avatar">
                  ${s.avatar && s.avatar.startsWith('http') || s.avatar?.startsWith('data:') ? `
                    <img src="${s.avatar}" alt="${s.name}" class="avatar-img" />
                  ` : `
                    <div class="avatar-placeholder">${s.gender === 'ស្រី' ? '👧' : '👦'}</div>
                  `}
                </div>
                <div class="card-info">
                  <div class="student-name font-moul">${s.name}</div>
                  <div class="student-latin">${s.latinName ? s.latinName.toUpperCase() : 'STUDENT PROFILE'}</div>
                  <div class="info-row"><strong>អត្តលេខ៖</strong> <span>${s.civilId || '-'}</span></div>
                  <div class="info-row"><strong>ថ្ងៃកំណើត៖</strong> <span>${s.dob || '-'}</span></div>
                  <div class="info-row"><strong>ទីកន្លែងកំណើត៖</strong> <span class="truncate">${s.pob || s.address || '-'}</span></div>
                  <div class="info-row"><strong>ឪពុក-ម្តាយ៖</strong> <span class="truncate">${s.fatherName || s.motherName ? `${s.fatherName || ''} / ${s.motherName || ''}` : '-'}</span></div>
                  <div class="info-row"><strong>ទូរស័ព្ទ៖</strong> <span>${s.parentPhone || s.phone || '-'}</span></div>
                  <div class="info-row"><strong>ស្ថានភាព៖</strong> <span class="status-tag">${s.familyStatus || 'ទូទៅ'} ${s.isRepeating || s.note?.includes('ត្រួតថ្នាក់') ? '(ត្រួតថ្នាក់)' : ''}</span></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // Detailed full sheets (1 student per concise profile block)
      contentHtml = `
        <div class="detailed-container">
          ${filteredStudents.map((s, idx) => `
            <div class="detailed-sheet">
              <div class="sheet-top-title font-moul">ជីវប្រវត្តិសង្ខេបសិស្សម្នាក់ៗ (ល.រ ${toKhmerNum(idx + 1)})</div>
              <div class="sheet-layout">
                <div class="photo-box">
                  ${s.avatar && (s.avatar.startsWith('http') || s.avatar.startsWith('data:')) ? `
                    <img src="${s.avatar}" class="photo-img" />
                  ` : `
                    <div class="photo-empty">
                      <div style="font-size: 24pt;">${s.gender === 'ស្រី' ? '👧' : '👦'}</div>
                      <span style="font-size: 8pt; color: #64748b; margin-top: 4px;">រូបថត ៤x៦</span>
                    </div>
                  `}
                  <div class="photo-id">ID: #${s.civilId || toKhmerNum(s.rollNo || idx + 1)}</div>
                </div>
                <table class="detailed-table">
                  <tr>
                    <td class="lbl">គោត្តនាម និងនាម ៖</td>
                    <td class="val font-moul" style="color: #1e1b4b; font-size: 10pt;">${s.name}</td>
                    <td class="lbl">អក្សរឡាតាំង ៖</td>
                    <td class="val font-bold">${s.latinName ? s.latinName.toUpperCase() : '-'}</td>
                  </tr>
                  <tr>
                    <td class="lbl">ភេទ ៖</td>
                    <td class="val font-bold">${s.gender}</td>
                    <td class="lbl">ថ្ងៃខែឆ្នាំកំណើត ៖</td>
                    <td class="val font-bold">${s.dob || '-'}</td>
                  </tr>
                  <tr>
                    <td class="lbl">ទីកន្លែងកំណើត ៖</td>
                    <td class="val" colspan="3">${s.pob || s.address || '-'}</td>
                  </tr>
                  <tr>
                    <td class="lbl">អាសយដ្ឋានបច្ចុប្បន្ន ៖</td>
                    <td class="val" colspan="3">${s.address || s.pob || '-'}</td>
                  </tr>
                  <tr>
                    <td class="lbl">ឈ្មោះឪពុក ៖</td>
                    <td class="val">${s.fatherName || '-'}</td>
                    <td class="lbl">មុខរបរឪពុក ៖</td>
                    <td class="val">${s.fatherJob || '-'}</td>
                  </tr>
                  <tr>
                    <td class="lbl">ឈ្មោះម្តាយ ៖</td>
                    <td class="val">${s.motherName || '-'}</td>
                    <td class="lbl">មុខរបរម្តាយ ៖</td>
                    <td class="val">${s.motherJob || '-'}</td>
                  </tr>
                  <tr>
                    <td class="lbl">លេខទូរស័ព្ទអាណាព្យាបាល ៖</td>
                    <td class="val font-mono font-bold">${s.parentPhone || s.phone || '-'}</td>
                    <td class="lbl">ស្ថានភាពគ្រួសារ/សមធម៌ ៖</td>
                    <td class="val font-bold">${s.familyStatus || 'ទូទៅ'}</td>
                  </tr>
                  <tr>
                    <td class="lbl">ស្ថានភាពសិក្សា ៖</td>
                    <td class="val">${s.isRepeating || s.note?.includes('ត្រួតថ្នាក់') ? 'សិស្សត្រួតថ្នាក់' : 'សិស្សឡើងថ្នាក់/ថ្មី'}</td>
                    <td class="lbl">សម្គាល់ផ្សេងៗ ៖</td>
                    <td class="val">${s.note || 'នៅរស់'} ${s.disabilityType && s.disabilityType !== 'គ្មាន' ? `(ពិការភាព៖ ${s.disabilityType})` : ''}</td>
                  </tr>
                </table>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    const signaturesHtml = includeSignatures ? `
      <div class="signatures-wrapper">
        <div class="sign-col">
          <p class="sign-role">បានឃើញ និងឯកភាព</p>
          <p class="sign-title font-moul">នាយកសាលា</p>
          <div class="sign-space"></div>
        </div>
        <div class="sign-col">
          <p class="sign-date">${getKhmerCombinedDate(new Date())}</p>
          <p class="sign-title font-moul">គ្រូបន្ទុកថ្នាក់</p>
          <div class="sign-space"></div>
          <p class="sign-name font-bold">${teacherName}</p>
        </div>
      </div>
    ` : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="utf-8" />
        <title>បញ្ជីរាយនាមសិស្ស_${gradeName}_${schoolName}</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page {
            size: A4 ${isLandscape ? 'landscape' : 'portrait'};
            margin: 8mm 10mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
            margin: 0;
            padding: 0;
            background: #ffffff !important;
            background-color: #ffffff !important;
            background-image: none !important;
            color: #0f172a;
            font-size: 8.5pt;
            line-height: 1.35;
          }
          .font-moul {
            font-family: 'Moul', cursive, serif !important;
          }
          .font-koulen {
            font-family: 'Koulen', sans-serif !important;
          }
          
          /* Header */
          .official-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
          }
          .header-left {
            text-align: left;
            font-size: 8.5pt;
          }
          .header-left .moeys-title {
            font-weight: bold;
            color: #1e1b4b;
          }
          .header-left .school-title {
            font-weight: bold;
          }
          .header-right {
            text-align: center;
          }
          .header-right .country {
            font-size: 9pt;
            color: #1e1b4b;
          }
          .header-right .motto {
            font-size: 8pt;
            color: #334155;
            margin-top: 1px;
          }

          /* Main Title */
          .title-section {
            text-align: center;
            margin: 4px 0 10px 0;
          }
          .main-title {
            font-size: 12pt;
            color: ${isBW ? '#000' : '#1e1b4b'};
            margin: 0;
            letter-spacing: 0.5px;
          }
          .sub-title {
            font-size: 9pt;
            color: #475569;
            margin-top: 3px;
          }

          /* Stats Banner */
          .stats-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 5px 12px;
            border-radius: 6px;
            margin-bottom: 8px;
            font-size: 8pt;
          }
          .badge {
            font-weight: bold;
          }
          .text-pink { color: ${isBW ? '#000' : '#be185d'}; }
          .text-amber { color: ${isBW ? '#000' : '#b45309'}; }
          .text-blue { color: ${isBW ? '#000' : '#1d4ed8'}; }
          .text-emerald { color: ${isBW ? '#000' : '#047857'}; }

          /* Roster Table */
          .roster-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
          }
          .roster-table th {
            background-color: #f1f5f9;
            border: 1px solid #94a3b8;
            padding: 5px 4px;
            text-align: center;
            font-weight: bold;
            color: #0f172a;
          }
          .roster-table td {
            border: 1px solid #cbd5e1;
            padding: 4px 5px;
            vertical-align: middle;
          }
          .roster-table tr.zebra {
            background-color: #f8fafc;
          }
          .pill-rep {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
            border-radius: 4px;
            padding: 1px 4px;
            font-size: 7pt;
            font-weight: bold;
          }

          /* Grid layout */
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .student-card {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 8px;
            background: #fff;
            break-inside: avoid;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 4px;
          }
          .roll-badge {
            background: #1e1b4b;
            color: #fff;
            font-size: 7.5pt;
            font-weight: bold;
            padding: 1px 6px;
            border-radius: 4px;
          }
          .card-gender {
            font-size: 7.5pt;
            font-weight: bold;
            padding: 1px 6px;
            border-radius: 4px;
          }
          .gender-female { background: #fce7f3; color: #9d174d; }
          .gender-male { background: #dbeafe; color: #1e40af; }
          .card-body {
            display: flex;
            gap: 8px;
            align-items: flex-start;
          }
          .card-avatar {
            width: 48px;
            height: 58px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            shrink: 0;
          }
          .avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .avatar-placeholder {
            font-size: 18pt;
          }
          .card-info {
            flex: 1;
            font-size: 7.5pt;
          }
          .student-name {
            font-size: 8.5pt;
            color: #1e1b4b;
          }
          .student-latin {
            font-size: 6.5pt;
            color: #64748b;
            margin-bottom: 3px;
          }
          .info-row {
            margin-bottom: 1px;
            display: flex;
            justify-content: space-between;
          }
          .truncate {
            max-width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .status-tag {
            font-weight: bold;
            color: #047857;
          }

          /* Detailed sheets */
          .detailed-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .detailed-sheet {
            border: 1px solid #94a3b8;
            border-radius: 8px;
            padding: 10px;
            break-inside: avoid;
            background: #fff;
          }
          .sheet-top-title {
            text-align: center;
            font-size: 9pt;
            color: #1e1b4b;
            margin-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
          }
          .sheet-layout {
            display: flex;
            gap: 12px;
          }
          .photo-box {
            width: 80px;
            height: 100px;
            border: 1px solid #94a3b8;
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            shrink: 0;
          }
          .photo-img {
            width: 100%;
            height: 80px;
            object-fit: cover;
          }
          .photo-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 80px;
          }
          .photo-id {
            background: #1e1b4b;
            color: #fff;
            width: 100%;
            text-align: center;
            font-size: 7pt;
            font-weight: bold;
            padding: 2px 0;
          }
          .detailed-table {
            flex: 1;
            border-collapse: collapse;
            font-size: 8pt;
          }
          .detailed-table td {
            border: 1px solid #cbd5e1;
            padding: 4px 6px;
          }
          .detailed-table .lbl {
            width: 125px;
            background: #f8fafc;
            font-weight: bold;
            color: #334155;
          }
          .detailed-table .val {
            color: #0f172a;
          }

          /* Signatures */
          .signatures-wrapper {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            page-break-inside: avoid;
          }
          .sign-col {
            text-align: center;
            width: 200px;
          }
          .sign-role {
            font-size: 8pt;
            margin: 0;
          }
          .sign-date {
            font-size: 8pt;
            margin: 0;
            color: #334155;
          }
          .sign-title {
            font-size: 8.5pt;
            margin: 2px 0 0 0;
          }
          .sign-space {
            height: 45px;
          }
          .sign-name {
            font-size: 8.5pt;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="official-header">
          <div class="header-left">
            <div class="moeys-title font-moul">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
            <div>មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/ក្រុង</div>
            <div class="school-title">${schoolName}</div>
          </div>
          <div class="header-right">
            <div class="country font-moul">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div class="motto font-moul">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          </div>
        </div>

        <div class="title-section">
          <h1 class="main-title font-moul">បញ្ជីរាយនាមសិស្ស និងប្រវត្តិរូបសង្ខេប</h1>
          <div class="sub-title">
            ${customSubtitle || `ស្ថិតិ និងព័ត៌មានលម្អិតសិស្ស ${gradeName} ឆ្នាំសិក្សា ${academicYear}`}
          </div>
        </div>

        ${contentHtml}
        ${signaturesHtml}

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
          function manualPrint() {
            window.print();
          }
        </script>
        <div style="text-align: center; margin-top: 20px; padding-bottom: 50px;">
          <button onclick="manualPrint()" style="padding: 10px 20px; font-size: 16px; background: #581c87; color: white; border: none; border-radius: 8px; cursor: pointer;">
            🖨️ បោះពុម្ពឯកសារនេះ (Print)
          </button>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto no-print">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[32px] max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base font-moul leading-tight">
                បោះពុម្ពបញ្ជីឈ្មោះ & ប្រវត្តិរូបសិស្ស
              </h3>
              <p className="text-xs text-indigo-200 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ទម្រង់ A4 ផ្លូវការ គាំទ្រទាំងតារាងសរុប ប័ណ្ណប្រវត្តិរូប និងសន្លឹកបុគ្គល
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Quick Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">សិស្សសរុប ៖</span>
              <span className="bg-purple-900 text-white px-2.5 py-0.5 rounded-full font-extrabold font-mono text-xs">
                {totalCount} នាក់
              </span>
              <span className="text-pink-700 font-bold ml-1">
                (ស្រី {femaleCount} នាក់)
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span>ប័ណ្ណសមធម៌៖ <strong className="text-amber-700">{poorCount}</strong></span>
              <span>•</span>
              <span>ត្រួតថ្នាក់៖ <strong className="text-blue-700">{repCount}</strong></span>
            </div>
          </div>

          {/* 1. Print Layout Style */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-700" />
              <span>១. ជ្រើសរើសទម្រង់បោះពុម្ព (Layout Style) ៖</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setPrintLayout('roster_table');
                  setPaperOrientation('landscape');
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                  printLayout === 'roster_table'
                    ? 'border-purple-600 bg-purple-50/80 text-purple-950 font-bold ring-2 ring-purple-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs">📋 តារាងបញ្ជីផ្លូវការ</span>
                  {printLayout === 'roster_table' && <CheckCircle2 className="w-4 h-4 text-purple-700" />}
                </div>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  ទម្រង់តារាង A4 ផ្ដេក សង្ខេបព័ត៌មានលម្អិតទាំងអស់សម្រាប់ថ្នាក់រៀន និងដាក់ជូននាយកសាលា។
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrintLayout('profiles_grid');
                  setPaperOrientation('portrait');
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                  printLayout === 'profiles_grid'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs">🪪 ប័ណ្ណប្រវត្តិរូបតូចៗ</span>
                  {printLayout === 'profiles_grid' && <CheckCircle2 className="w-4 h-4 text-indigo-700" />}
                </div>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  រៀបចំជាប្លុកកាតតូចៗ (Mini Cards) មានរូបថត អត្តលេខ និងលេខទូរស័ព្ទងាយស្រួលមើល។
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrintLayout('detailed_sheets');
                  setPaperOrientation('portrait');
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                  printLayout === 'detailed_sheets'
                    ? 'border-pink-600 bg-pink-50/80 text-pink-950 font-bold ring-2 ring-pink-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs">📑 សន្លឹកជីវប្រវត្តិតាមសិស្ស</span>
                  {printLayout === 'detailed_sheets' && <CheckCircle2 className="w-4 h-4 text-pink-700" />}
                </div>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  សន្លឹកប្រវត្តិរូបពេញលេញមួយសិស្សមួយប្រអប់ ច្បាស់លាស់ ងាយទុកដាក់ក្នុងថតឯកសារ។
                </p>
              </button>
            </div>
          </div>

          {/* 2. Filter Scope */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-purple-700" />
              <span>២. ជ្រើសរើសទិន្នន័យសិស្សត្រូវបោះពុម្ព ៖</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: `សិស្សទាំងអស់ (${students.length})` },
                { id: 'female', label: `សិស្សស្រី (${femaleCount})` },
                { id: 'poor', label: `សិស្សក្រ១/ក្រ២ (${poorCount})` },
                { id: 'repeating', label: `សិស្សត្រួតថ្នាក់ (${repCount})` },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilterCategory(item.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition text-xs cursor-pointer ${
                    filterCategory === item.id
                      ? 'bg-purple-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Page Setup Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">ទិសដៅក្រដាស (Orientation) ៖</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaperOrientation('landscape')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border transition ${
                    paperOrientation === 'landscape'
                      ? 'bg-purple-900 text-white border-purple-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  📄 ផ្ដេក (Landscape)
                </button>
                <button
                  type="button"
                  onClick={() => setPaperOrientation('portrait')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border transition ${
                    paperOrientation === 'portrait'
                      ? 'bg-purple-900 text-white border-purple-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  📃 បញ្ឈរ (Portrait)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">របៀបពណ៌ (Color Mode) ៖</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setColorMode('color')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border transition ${
                    colorMode === 'color'
                      ? 'bg-purple-900 text-white border-purple-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  🎨 ពណ៌ធម្មជាតិ
                </button>
                <button
                  type="button"
                  onClick={() => setColorMode('bw')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border transition ${
                    colorMode === 'bw'
                      ? 'bg-purple-900 text-white border-purple-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  🖨️ ស-ខ្មៅ (B&W)
                </button>
              </div>
            </div>
          </div>

          {/* 4. Subtitle & Signatures */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ចំណងជើងរងបន្ថែម (Subtitle) ៖</label>
              <input
                type="text"
                placeholder={`ស្ថិតិ និងព័ត៌មានលម្អិតសិស្ស ${teacher.grade || 'ថ្នាក់ទី ៤'} ឆ្នាំសិក្សា ${teacher.academicYear || '២០២៥ - ២០២៦'}`}
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
              />
              <span className="font-bold text-slate-700">រួមបញ្ចូលកន្លែងហត្ថលេខានាយកសាលា និងគ្រូបន្ទុកថ្នាក់</span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition"
          >
            បិទ
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>បើកផ្ទាំងបោះពុម្ព (Print Preview)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
