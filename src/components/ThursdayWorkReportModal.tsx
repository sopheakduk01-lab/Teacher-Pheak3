import React, { useState, useEffect, useMemo } from 'react';
import {
  Printer,
  Download,
  Calendar,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  FileText,
  Users,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Clock,
  ArrowRight,
  Eye,
  Edit3,
  X,
  FileDown
} from 'lucide-react';
import { TeacherProfile, Student, AttendanceDatabase, GradeDatabase } from '../types';
import { toKhmerNum, getKhmerCombinedDate } from '../utils/khmerDate';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';
import { loadYearScopedData, saveYearScopedData } from '../utils/academicYearStorage';

export interface ThursdayAbsenceStats {
  w1Total: number;
  w1Female: number;
  w2Total: number;
  w2Female: number;
  w3Total: number;
  w3Female: number;
  monthTotal: number;
  monthFemale: number;
}

export interface ThursdayCurriculumContent {
  khmerW1: string;
  khmerW2: string;
  khmerW3: string;
  mathW1: string;
  mathW2: string;
  mathW3: string;
  lifeSkillsW1: string;
  lifeSkillsW2: string;
  lifeSkillsW3: string;
}

export interface ThursdaySubjectResults {
  khmerReading: [number, number, number]; // w1, w2, w3 %
  khmerWriting: [number, number, number];
  khmerListening: [number, number, number];
  khmerSpeaking: [number, number, number];

  mathNumbers: [number, number, number];
  mathMeasurement: [number, number, number];
  mathGeometry: [number, number, number];
  mathAlgebra: [number, number, number];
  mathStatistics: [number, number, number];

  studentsNeedingHelp: number;
  studentsNeedingHelpFemale: number;
  studentsNeedingHelpPercent: number;

  studentsRemediated: number;
  studentsRemediatedFemale: number;
  studentsRemediatedPercent: number;
}

export interface ThursdayNextDirection {
  focusKhmer: string;
  focusMath: string;
  slowLearnersTarget: string;
  additionalNotes: string;
}

export interface ThursdayReportData {
  month: string; // e.g., 'មករា', 'តុលា'
  year: string;  // e.g., '២០២៦'
  grade: string;
  shift: string;
  totalStudents: number;
  femaleStudents: number;
  absences: ThursdayAbsenceStats;
  curriculum: ThursdayCurriculumContent;
  results: ThursdaySubjectResults;
  direction: ThursdayNextDirection;
}

const MONTHS_LIST = [
  'តុលា', 'វិច្ឆិកា', 'ធ្នូ', 'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា'
];

interface ThursdayWorkReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  students: Student[];
  attendance: AttendanceDatabase;
  grades: GradeDatabase;
  currentYear?: string;
  onShowToast: (msg: string) => void;
}

export const ThursdayWorkReportModal: React.FC<ThursdayWorkReportModalProps> = ({
  isOpen,
  onClose,
  teacher,
  students,
  attendance,
  grades,
  currentYear = '២០២៥ - ២០២៦',
  onShowToast,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('តុលា');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [reportYear, setReportYear] = useState<string>('២០២៦');
  const [reportGrade, setReportGrade] = useState<string>(teacher.grade || 'ថ្នាក់ទី ៤');
  const [reportShift, setReportShift] = useState<string>('ព្រឹក/រសៀល');

  // Generate initial report state
  const getInitialReportData = (month: string): ThursdayReportData => {
    const totalCount = students.length || 35;
    const femaleCount = students.filter(s => s.gender === 'ស្រី').length || 18;

    return {
      month,
      year: reportYear,
      grade: reportGrade,
      shift: reportShift,
      totalStudents: totalCount,
      femaleStudents: femaleCount,
      absences: {
        w1Total: 2,
        w1Female: 1,
        w2Total: 1,
        w2Female: 1,
        w3Total: 3,
        w3Female: 2,
        monthTotal: 6,
        monthFemale: 4,
      },
      curriculum: {
        khmerW1: '• មេរៀនទី១៖ អំណានអត្ថបទ និងវេយ្យាករណ៍\n• សរសេរតាមអានពាក្យគន្លឹះ\n• បំពេញល្បះ និងតែងសេចក្តីខ្លី',
        khmerW2: '• មេរៀនទី២៖ កម្រងសំណួរស្វែងយល់\n• ក្បួនតែងអត្ថបទពិពណ៌នា\n• លំហាត់ពង្រឹងការសរសេរតាមអាន',
        khmerW3: '• មេរៀនទី៣៖ អំណានបន្ថែម និងសន្ទនា\n• សំណេររៀបរាប់ពីទិដ្ឋភាពភូមិឋាន\n• ការត្រួតពិនិត្យ និងវាយតម្លៃប្រចាំខែ',
        mathW1: '• ចំនួន និងតម្លៃលេខតាមខ្ទង់រហូតដល់ ១០០ ០០០\n• ប្រមាណវិធីបូក និងដកចំនួនធំ\n• លំហាត់ចំណោទអនុវត្តជាក់ស្តែង',
        mathW2: '• ប្រមាណវិធីគុណ និងចែកលេខច្រើនខ្ទង់\n• រង្វាស់ប្រវែង និងទម្ងន់ (គីឡូក្រាម, ក្រាម)\n• ដោះស្រាយចំណោទពីរដំណាក់កាល',
        mathW3: '• ធរណីមាត្រ៖ មុំ កែង និងរាងចតុកោណកែង\n• ស្ថិតិ និងការអានដ្យាក្រាមតារាង\n• សង្ខេបមេរៀន និងតេស្តប្រចាំខែ',
        lifeSkillsW1: '• ការថែរក្សាអនាម័យខ្លួនប្រាណ និងបរិស្ថានថ្នាក់រៀន\n• វិន័យ និងសុជីវធម៌សិស្ស',
        lifeSkillsW2: '• ការសន្សំសំចៃ និងការប្រើប្រាស់សម្ភារសិក្សា\n• ការងារសហការជាក្រុម',
        lifeSkillsW3: '• សុវត្ថិភាពចរាចរណ៍ និងការការពារសុខភាព\n• ការដាំកូនឈើ និងថែសួនផ្កា',
      },
      results: {
        khmerReading: [82, 85, 88],
        khmerWriting: [76, 80, 84],
        khmerListening: [90, 92, 95],
        khmerSpeaking: [85, 88, 90],

        mathNumbers: [80, 84, 86],
        mathMeasurement: [75, 78, 82],
        mathGeometry: [72, 76, 80],
        mathAlgebra: [70, 74, 78],
        mathStatistics: [85, 88, 92],

        studentsNeedingHelp: Math.max(1, Math.round(totalCount * 0.15)),
        studentsNeedingHelpFemale: Math.max(0, Math.round(femaleCount * 0.12)),
        studentsNeedingHelpPercent: 15,

        studentsRemediated: Math.max(1, Math.round(totalCount * 0.1)),
        studentsRemediatedFemale: Math.max(0, Math.round(femaleCount * 0.08)),
        studentsRemediatedPercent: 10,
      },
      direction: {
        focusKhmer: 'បន្តពង្រឹងការអានពាក្យពិបាក និងការសរសេរតាមអានរៀងរាល់ថ្ងៃសុក្រ ជាមួយការបង្រៀនបន្ថែមដល់សិស្សរៀនយឺត។',
        focusMath: 'ផ្តោតលើការអនុវត្តប្រមាណវិធីចែកលេខ និងការបកស្រាយចំណោទដែលមានពាក្យគន្លឹះគណិតវិទ្យា។',
        slowLearnersTarget: 'កាត់បន្ថយសិស្សរៀនយឺតឱ្យនៅសល់ត្រឹម ៣នាក់ (រម្លស់សិស្សបានយ៉ាងតិច ៣ ទៅ ៤ នាក់ក្នុងខែបន្ទាប់)។',
        additionalNotes: 'រៀបចំសម្ភារឧបទេសបង្រៀនឱ្យកាន់តែសម្បូរបែប និងទំនាក់ទំនងជាមួយមាតាបិតាសិស្សឱ្យជួយតាមដានការរៀននៅផ្ទះ។',
      }
    };
  };

  const storageKey = `thursday_report_${currentYear}_${selectedMonth}`;
  const [reportData, setReportData] = useState<ThursdayReportData>(() => {
    const saved = loadYearScopedData<ThursdayReportData | null>(currentYear, storageKey, null);
    if (saved) return saved;
    return getInitialReportData(selectedMonth);
  });

  // Reload when month or year changes
  useEffect(() => {
    const saved = loadYearScopedData<ThursdayReportData | null>(currentYear, storageKey, null);
    if (saved) {
      setReportData(saved);
    } else {
      setReportData(getInitialReportData(selectedMonth));
    }
  }, [selectedMonth, currentYear]);

  // Auto-sync with real attendance & students data
  const handleAutoCalculateFromSystem = () => {
    const totalCount = students.length;
    const femaleCount = students.filter(s => s.gender === 'ស្រី').length;

    // Calculate real absences from attendance database for the selected month
    let w1Tot = 0, w1Fem = 0, w2Tot = 0, w2Fem = 0, w3Tot = 0, w3Fem = 0;

    // Map selectedMonth to month number
    const monthIndex = MONTHS_LIST.indexOf(selectedMonth);
    // Rough calendar month estimation (Oct=10, Nov=11, Dec=12, Jan=1, Feb=2...)
    const calendarMonth = monthIndex >= 0 && monthIndex <= 2 ? monthIndex + 10 : monthIndex - 2;

    Object.entries(attendance).forEach(([dateStr, record]) => {
      try {
        const d = new Date(dateStr);
        if (d.getMonth() + 1 === calendarMonth) {
          const day = d.getDate();
          const targetWeek = day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : 0;
          if (targetWeek > 0) {
            Object.entries(record).forEach(([studIdStr, attRecord]) => {
              if (attRecord.status === 'absent' || attRecord.status === 'permission') {
                const isFem = students.find(s => s.id === Number(studIdStr))?.gender === 'ស្រី';
                if (targetWeek === 1) { w1Tot++; if (isFem) w1Fem++; }
                else if (targetWeek === 2) { w2Tot++; if (isFem) w2Fem++; }
                else if (targetWeek === 3) { w3Tot++; if (isFem) w3Fem++; }
              }
            });
          }
        }
      } catch (e) {}
    });

    const monthTot = w1Tot + w2Tot + w3Tot;
    const monthFem = w1Fem + w2Fem + w3Fem;

    // Estimate students needing help based on grades
    let needyCount = 0;
    let needyFemCount = 0;
    students.forEach(st => {
      const studentGrades = grades[st.id] || {};
      const avg = (studentGrades.khmer || 50) + (studentGrades.math || 50);
      if (avg / 2 < 50) {
        needyCount++;
        if (st.gender === 'ស្រី') needyFemCount++;
      }
    });

    const needingPct = totalCount > 0 ? Math.round((needyCount / totalCount) * 100) : 0;
    const remediatedCount = Math.max(1, Math.round(needyCount * 0.4));
    const remediatedFemCount = Math.max(0, Math.round(needyFemCount * 0.4));
    const remediatedPct = totalCount > 0 ? Math.round((remediatedCount / totalCount) * 100) : 0;

    setReportData(prev => ({
      ...prev,
      totalStudents: totalCount || prev.totalStudents,
      femaleStudents: femaleCount || prev.femaleStudents,
      absences: {
        w1Total: w1Tot || prev.absences.w1Total,
        w1Female: w1Fem || prev.absences.w1Female,
        w2Total: w2Tot || prev.absences.w2Total,
        w2Female: w2Fem || prev.absences.w2Female,
        w3Total: w3Tot || prev.absences.w3Total,
        w3Female: w3Fem || prev.absences.w3Female,
        monthTotal: monthTot || prev.absences.monthTotal,
        monthFemale: monthFem || prev.absences.monthFemale,
      },
      results: {
        ...prev.results,
        studentsNeedingHelp: needyCount || prev.results.studentsNeedingHelp,
        studentsNeedingHelpFemale: needyFemCount || prev.results.studentsNeedingHelpFemale,
        studentsNeedingHelpPercent: needingPct || prev.results.studentsNeedingHelpPercent,
        studentsRemediated: remediatedCount || prev.results.studentsRemediated,
        studentsRemediatedFemale: remediatedFemCount || prev.results.studentsRemediatedFemale,
        studentsRemediatedPercent: remediatedPct || prev.results.studentsRemediatedPercent,
      }
    }));

    onShowToast('បានគណនា និងទាញយកទិន្នន័យពីបញ្ជីវត្តមាន និងពិន្ទុក្នុងថ្នាក់រួចរាល់! 📊✨');
  };

  const handleSave = () => {
    saveYearScopedData(currentYear, storageKey, reportData);
    onShowToast(`បានរក្សាទុករបាយការណ៍ថ្ងៃព្រហស្បតិ៍ ខែ${selectedMonth} ជោគជ័យ! 💾✅`);
  };

  const handleResetToDefault = () => {
    const initial = getInitialReportData(selectedMonth);
    setReportData(initial);
    saveYearScopedData(currentYear, storageKey, initial);
    onShowToast('បានកំណត់របាយការណ៍ឡើងវិញដូចទម្រង់ដើម! 🔄');
  };

  // Printable HTML generator
  const generatePrintableHtml = (): string => {
    const activeFont = getActiveCustomFontFamily();
    const activeTheme = getActiveCustomBackgroundTheme();
    const docBackgroundCss = getThemeBackgroundCss(activeTheme);

    return `
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>របាយការណ៍បំពេញការងារថ្ងៃព្រហស្បតិ៍ - ខែ${reportData.month} ${reportData.year}</title>
  ${getKhmerGoogleFontsLinkHtml()}
  <style>
    @page {
      size: A4 portrait;
      margin: 5mm 7mm 5mm 7mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
    }
    body {
      font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
      ${docBackgroundCss}
      color: #0f172a;
      font-size: 8pt;
      line-height: 1.22;
    }
    .moul {
      font-family: 'Moul', cursive;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    
    .single-page-wrapper {
      width: 100%;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .top-badge {
      text-align: center;
      font-size: 7.5pt;
      font-weight: bold;
      color: #475569;
      margin-bottom: 1px;
    }

    .main-title {
      font-size: 11pt;
      margin: 1px 0 1px 0;
      color: #0f172a;
    }

    .sub-title {
      font-size: 8.5pt;
      margin-bottom: 3px;
    }

    .info-bar {
      display: flex;
      justify-content: space-around;
      font-size: 8pt;
      padding: 2.5px 6px;
      border: 1px solid #000;
      border-bottom: 1px solid #000;
      background-color: #f8fafc;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.8pt;
      margin: 0;
    }

    th, td {
      border: 1px solid #000;
      padding: 2px 3.5px;
      vertical-align: middle;
    }

    th {
      background-color: #f1f5f9;
      font-weight: bold;
      text-align: center;
    }

    .section-title {
      font-weight: bold;
      font-size: 8.2pt;
      background-color: #f1f5f9;
      padding: 2px 5px;
      border: 1px solid #000;
      border-top: none;
      border-bottom: none;
    }

    .bullet-content {
      white-space: pre-line;
      line-height: 1.2;
      font-size: 7.5pt;
      padding: 2px 3.5px;
    }

    .sub-table th {
      font-size: 7.5pt;
      padding: 1.5px 3px;
    }
    .sub-table td {
      font-size: 7.5pt;
      padding: 1.5px 3px;
    }

    .summary-box {
      border: 1px solid #000;
      border-top: none;
      padding: 2px 6px;
      font-size: 7.8pt;
      line-height: 1.25;
      background: #fafafa;
    }

    .direction-box {
      border: 1px solid #000;
      border-top: none;
      padding: 2.5px 6px;
      font-size: 7.8pt;
      line-height: 1.2;
    }

    .dotted-line {
      border-bottom: 1px dotted #475569;
      display: inline-block;
      min-width: 60px;
      text-align: center;
      padding: 0 3px;
      font-weight: 700;
    }

    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-top: 5px;
      text-align: center;
      font-size: 8pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .signature-space {
      height: 32px;
    }

    @media print {
      html, body, .single-page-wrapper {
        background: #ffffff !important;
        background-color: #ffffff !important;
        background-image: none !important;
      }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
<div class="single-page-wrapper">
  <div class="top-badge">សម្រាប់គ្រូបន្ទុកថ្នាក់</div>

  <div class="text-center">
    <div class="main-title moul">របាយការណ៍បំពេញការងារថ្ងៃព្រហស្បតិ៍</div>
    <div class="sub-title">សម្រាប់ខែ <span class="dotted-line">${reportData.month}</span> ឆ្នាំ <span class="dotted-line">${toKhmerNum(reportData.year)}</span></div>
  </div>

  <div class="info-bar font-bold">
    <div>ថ្នាក់ទី៖ <span class="dotted-line">${reportData.grade}</span></div>
    <div>វេន៖ <span class="dotted-line">${reportData.shift}</span></div>
    <div>សិស្សសរុប៖ <span class="dotted-line">${toKhmerNum(reportData.totalStudents)}</span> នាក់</div>
    <div>ស្រី៖ <span class="dotted-line">${toKhmerNum(reportData.femaleStudents)}</span> នាក់</div>
  </div>

  <!-- TABLE 1: ABSENCES -->
  <table>
    <thead>
      <tr>
        <th colspan="8" style="background: #e2e8f0; font-size: 8.2pt; border-top: none;">ចំនួនសិស្សអវត្តមានតាមសប្តាហ៍</th>
      </tr>
      <tr>
        <th colspan="2">សប្តាហ៍ទី១</th>
        <th colspan="2">សប្តាហ៍ទី២</th>
        <th colspan="2">សប្តាហ៍ទី៣</th>
        <th colspan="2">ប្រចាំខែ (ទាំង៣សប្តាហ៍)</th>
      </tr>
      <tr>
        <th style="width: 12.5%;">សរុប</th>
        <th style="width: 12.5%;">ស្រី</th>
        <th style="width: 12.5%;">សរុប</th>
        <th style="width: 12.5%;">ស្រី</th>
        <th style="width: 12.5%;">សរុប</th>
        <th style="width: 12.5%;">ស្រី</th>
        <th style="width: 12.5%;">សរុប</th>
        <th style="width: 12.5%;">ស្រី</th>
      </tr>
    </thead>
    <tbody>
      <tr class="text-center font-bold">
        <td>${toKhmerNum(reportData.absences.w1Total)}</td>
        <td>${toKhmerNum(reportData.absences.w1Female)}</td>
        <td>${toKhmerNum(reportData.absences.w2Total)}</td>
        <td>${toKhmerNum(reportData.absences.w2Female)}</td>
        <td>${toKhmerNum(reportData.absences.w3Total)}</td>
        <td>${toKhmerNum(reportData.absences.w3Female)}</td>
        <td style="color: #b91c1c;">${toKhmerNum(reportData.absences.monthTotal)}</td>
        <td style="color: #b91c1c;">${toKhmerNum(reportData.absences.monthFemale)}</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 1: CURRICULUM -->
  <div class="section-title">១/ ខ្លឹមសារបង្រៀន (តាមមុខវិជ្ជា)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 16%;">មុខវិជ្ជា</th>
        <th style="width: 28%;">សប្តាហ៍ទី១</th>
        <th style="width: 28%;">សប្តាហ៍ទី២</th>
        <th style="width: 28%;">សប្តាហ៍ទី៣</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-bold text-center" style="background-color: #f8fafc;">ភាសាខ្មែរ</td>
        <td class="bullet-content">${reportData.curriculum.khmerW1}</td>
        <td class="bullet-content">${reportData.curriculum.khmerW2}</td>
        <td class="bullet-content">${reportData.curriculum.khmerW3}</td>
      </tr>
      <tr>
        <td class="font-bold text-center" style="background-color: #f8fafc;">គណិតវិទ្យា</td>
        <td class="bullet-content">${reportData.curriculum.mathW1}</td>
        <td class="bullet-content">${reportData.curriculum.mathW2}</td>
        <td class="bullet-content">${reportData.curriculum.mathW3}</td>
      </tr>
      <tr>
        <td class="font-bold text-center" style="background-color: #f8fafc;">បំណិនជីវិត</td>
        <td class="bullet-content">${reportData.curriculum.lifeSkillsW1}</td>
        <td class="bullet-content">${reportData.curriculum.lifeSkillsW2}</td>
        <td class="bullet-content">${reportData.curriculum.lifeSkillsW3}</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 2: RESULTS -->
  <div class="section-title">២/ លទ្ធផលសម្រេចបាន (ភាសាខ្មែរ និងគណិតវិទ្យា)</div>
  <table class="sub-table">
    <thead>
      <tr>
        <th colspan="4" style="width: 50%; background-color: #e0f2fe;">លទ្ធផល ភាសាខ្មែរ (គិតជាភាគរយ)</th>
        <th colspan="4" style="width: 50%; background-color: #fef3c7;">លទ្ធផល គណិតវិទ្យា (គិតជាភាគរយ)</th>
      </tr>
      <tr>
        <th style="width: 20%;">សមត្ថភាព</th>
        <th style="width: 10%;">ស១</th>
        <th style="width: 10%;">ស២</th>
        <th style="width: 10%;">ស៣</th>
        <th style="width: 20%;">សមត្ថភាព</th>
        <th style="width: 10%;">ស១</th>
        <th style="width: 10%;">ស២</th>
        <th style="width: 10%;">ស៣</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>- អាន</td>
        <td class="text-center">${toKhmerNum(reportData.results.khmerReading[0])}%</td>
        <td class="text-center">${toKhmerNum(reportData.results.khmerReading[1])}%</td>
        <td class="text-center font-bold">${toKhmerNum(reportData.results.khmerReading[2])}%</td>
        <td>- ចំនួន</td>
        <td class="text-center">${toKhmerNum(reportData.results.mathNumbers[0])}%</td>
        <td class="text-center">${toKhmerNum(reportData.results.mathNumbers[1])}%</td>
        <td class="text-center font-bold">${toKhmerNum(reportData.results.mathNumbers[2])}%</td>
      </tr>
      <tr>
        <td>- សរសេរ</td>
        <td class="text-center">${toKhmerNum(reportData.results.khmerWriting[0])}%</td>
        <td class="text-center">${toKhmerNum(reportData.results.khmerWriting[1])}%</td>
        <td class="text-center font-bold">${toKhmerNum(reportData.results.khmerWriting[2])}%</td>
        <td>- រង្វាស់រង្វាល់</td>
        <td class="text-center">${toKhmerNum(reportData.results.mathMeasurement[0])}%</td>
        <td class="text-center">${toKhmerNum(reportData.results.mathMeasurement[1])}%</td>
        <td class="text-center font-bold">${toKhmerNum(reportData.results.mathMeasurement[2])}%</td>
      </tr>
      <tr>
        <td>- ស្តាប់</td>
        <td class="text-center">${toKhmerNum(reportData.results.khmerListening[0])}%</td>
        <td class="text-center">${toKhmerNum(reportData.results.khmerListening[1])}%</td>
        <td class="text-center font-bold">${toKhmerNum(reportData.results.khmerListening[2])}%</td>
        <td>- ធរណីមាត្រ</td>
        <td class="text-center">${toKhmerNum(reportData.results.mathGeometry[0])}%</td>
        <td class="text-center">${toKhmerNum(reportData.results.mathGeometry[1])}%</td>
        <td class="text-center font-bold">${toKhmerNum(reportData.results.mathGeometry[2])}%</td>
      </tr>
      <tr>
        <td>- និយាយ</td>
        <td class="text-center">${toKhmerNum(reportData.results.khmerSpeaking[0])}%</td>
        <td class="text-center">${toKhmerNum(reportData.results.khmerSpeaking[1])}%</td>
        <td class="text-center font-bold">${toKhmerNum(reportData.results.khmerSpeaking[2])}%</td>
        <td>- ពិជគណិត</td>
        <td class="text-center">${toKhmerNum(reportData.results.mathAlgebra[0])}%</td>
        <td class="text-center">${toKhmerNum(reportData.results.mathAlgebra[1])}%</td>
        <td class="text-center font-bold">${toKhmerNum(reportData.results.mathAlgebra[2])}%</td>
      </tr>
      <tr>
        <td colspan="4" style="background-color: #f8fafc;"></td>
        <td>- ស្ថិតិ</td>
        <td class="text-center">${toKhmerNum(reportData.results.mathStatistics[0])}%</td>
        <td class="text-center">${toKhmerNum(reportData.results.mathStatistics[1])}%</td>
        <td class="text-center font-bold">${toKhmerNum(reportData.results.mathStatistics[2])}%</td>
      </tr>
    </tbody>
  </table>

  <!-- RESULTS SUMMARY -->
  <div class="summary-box">
    <div>• ចំនួនសិស្សដែលត្រូវជួយក្នុងខែសរុប ៖ <span class="dotted-line">${toKhmerNum(reportData.results.studentsNeedingHelp)}</span> នាក់, ស្រី <span class="dotted-line">${toKhmerNum(reportData.results.studentsNeedingHelpFemale)}</span> នាក់, គិតជាភាគរយ <span class="dotted-line">${toKhmerNum(reportData.results.studentsNeedingHelpPercent)}%</span></div>
    <div style="margin-top: 1px;">• ចំនួនសិស្សដែលបានរម្លស់ក្នុងខែសរុប ៖ <span class="dotted-line">${toKhmerNum(reportData.results.studentsRemediated)}</span> នាក់, ស្រី <span class="dotted-line">${toKhmerNum(reportData.results.studentsRemediatedFemale)}</span> នាក់, គិតជាភាគរយ <span class="dotted-line">${toKhmerNum(reportData.results.studentsRemediatedPercent)}%</span></div>
  </div>

  <!-- SECTION 3: NEXT DIRECTION -->
  <div class="section-title">៣/ ទិសដៅបន្ត (សម្រាប់ខែក្រោយ)</div>
  <div class="direction-box">
    <div class="font-bold">• តើត្រូវផ្ដោតលើខ្លឹមសារអ្វីសម្រាប់មុខវិជ្ជានីមួយៗ ? (ក្នុងសប្តាហ៍នីមួយៗ)</div>
    <div style="margin-left: 8px;">
      - <strong>ភាសាខ្មែរ៖</strong> ${reportData.direction.focusKhmer}
    </div>
    <div style="margin-left: 8px;">
      - <strong>គណិតវិទ្យា៖</strong> ${reportData.direction.focusMath}
    </div>
    <div class="font-bold" style="margin-top: 2px;">• តើត្រូវកាត់បន្ថយសិស្សរៀនយឺតប៉ុន្មាននាក់ទៀត ? (ក្នុងខែបន្ទាប់)</div>
    <div style="margin-left: 8px;">
      ${reportData.direction.slowLearnersTarget}
    </div>
    ${reportData.direction.additionalNotes ? `
    <div style="margin-top: 2px; font-style: italic; color: #475569;">
      <strong>កំណត់ចំណាំ៖</strong> ${reportData.direction.additionalNotes}
    </div>` : ''}
  </div>

  <!-- SIGNATURES -->
  <div class="signature-grid">
    <div>
      <p style="margin: 0;">បានឃើញ និងឯកភាព</p>
      <p class="font-bold moul" style="font-size: 8pt; margin: 1px 0 0 0;">នាយកសាលា</p>
      <div class="signature-space"></div>
      <p style="margin: 0;">................................................</p>
    </div>
    <div>
      <p style="margin: 0;">ថ្ងៃព្រហស្បតិ៍ ទី........ ខែ${reportData.month} ឆ្នាំ២០២៦</p>
      <p class="font-bold moul" style="font-size: 8pt; margin: 1px 0 0 0;">គ្រូបន្ទុកថ្នាក់</p>
      <div class="signature-space"></div>
      <p class="font-bold" style="margin: 0;">${teacher.name || '................................................'}</p>
    </div>
  </div>
</div>
</body>
</html>
    `;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.open();
    printWindow.document.write(generatePrintableHtml());
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-5xl my-4 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-4 sm:p-5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Calendar className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-moul tracking-wide text-white">
                  របាយការណ៍បំពេញការងារថ្ងៃព្រហស្បតិ៍
                </h2>
                <span className="bg-amber-400/90 text-blue-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  ផ្លូវការ MoEYS
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium">
                សម្រាប់គ្រូបន្ទុកថ្នាក់បូកសរុបសកម្មភាពបង្រៀន វត្តមាន និងសិស្សរៀនយឺតរៀងរាល់ថ្ងៃព្រហស្បតិ៍
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
              title="បិទ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              ជ្រើសរើសខែ៖
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {MONTHS_LIST.map(m => (
                <option key={m} value={m}>ខែ {m}</option>
              ))}
            </select>

            <button
              onClick={handleAutoCalculateFromSystem}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              title="ទាញយកវត្តមាន និងពិន្ទុពីក្នុងថ្នាក់មកគណនាដោយស្វ័យប្រវត្តិ"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ទាញទិន្នន័យស្វ័យប្រវត្តិ</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Tab switch */}
            <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'edit'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>កែសម្រួលទិន្នន័យ</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>មើលទម្រង់បោះពុម្ព</span>
              </button>
            </div>

            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>រក្សាទុក</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>បោះពុម្ព / PDF</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60">
          {activeTab === 'edit' ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Basic Info Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">ថ្នាក់ទី</label>
                  <input
                    type="text"
                    value={reportData.grade}
                    onChange={(e) => setReportData({ ...reportData, grade: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">វេនសិក្សា</label>
                  <input
                    type="text"
                    value={reportData.shift}
                    onChange={(e) => setReportData({ ...reportData, shift: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">សិស្សសរុប (នាក់)</label>
                  <input
                    type="number"
                    value={reportData.totalStudents}
                    onChange={(e) => setReportData({ ...reportData, totalStudents: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">សិស្សស្រី (នាក់)</label>
                  <input
                    type="number"
                    value={reportData.femaleStudents}
                    onChange={(e) => setReportData({ ...reportData, femaleStudents: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Table 1: Absences */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    ចំនួនសិស្សអវត្តមានតាមសប្តាហ៍
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1.5">សប្តាហ៍ទី១</span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="សរុប"
                        value={reportData.absences.w1Total}
                        onChange={(e) => setReportData({
                          ...reportData,
                          absences: { ...reportData.absences, w1Total: Number(e.target.value) }
                        })}
                        className="w-1/2 p-1.5 text-center border rounded-lg bg-white"
                      />
                      <input
                        type="number"
                        placeholder="ស្រី"
                        value={reportData.absences.w1Female}
                        onChange={(e) => setReportData({
                          ...reportData,
                          absences: { ...reportData.absences, w1Female: Number(e.target.value) }
                        })}
                        className="w-1/2 p-1.5 text-center border rounded-lg bg-white text-rose-600"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1.5">សប្តាហ៍ទី២</span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="សរុប"
                        value={reportData.absences.w2Total}
                        onChange={(e) => setReportData({
                          ...reportData,
                          absences: { ...reportData.absences, w2Total: Number(e.target.value) }
                        })}
                        className="w-1/2 p-1.5 text-center border rounded-lg bg-white"
                      />
                      <input
                        type="number"
                        placeholder="ស្រី"
                        value={reportData.absences.w2Female}
                        onChange={(e) => setReportData({
                          ...reportData,
                          absences: { ...reportData.absences, w2Female: Number(e.target.value) }
                        })}
                        className="w-1/2 p-1.5 text-center border rounded-lg bg-white text-rose-600"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1.5">សប្តាហ៍ទី៣</span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="សរុប"
                        value={reportData.absences.w3Total}
                        onChange={(e) => setReportData({
                          ...reportData,
                          absences: { ...reportData.absences, w3Total: Number(e.target.value) }
                        })}
                        className="w-1/2 p-1.5 text-center border rounded-lg bg-white"
                      />
                      <input
                        type="number"
                        placeholder="ស្រី"
                        value={reportData.absences.w3Female}
                        onChange={(e) => setReportData({
                          ...reportData,
                          absences: { ...reportData.absences, w3Female: Number(e.target.value) }
                        })}
                        className="w-1/2 p-1.5 text-center border rounded-lg bg-white text-rose-600"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1.5">ប្រចាំខែ (ទាំង៣សប្តាហ៍)</span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="សរុប"
                        value={reportData.absences.monthTotal}
                        onChange={(e) => setReportData({
                          ...reportData,
                          absences: { ...reportData.absences, monthTotal: Number(e.target.value) }
                        })}
                        className="w-1/2 p-1.5 text-center border border-amber-300 rounded-lg bg-white font-bold text-amber-900"
                      />
                      <input
                        type="number"
                        placeholder="ស្រី"
                        value={reportData.absences.monthFemale}
                        onChange={(e) => setReportData({
                          ...reportData,
                          absences: { ...reportData.absences, monthFemale: Number(e.target.value) }
                        })}
                        className="w-1/2 p-1.5 text-center border border-amber-300 rounded-lg bg-white font-bold text-rose-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1: Curriculum Content */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  ១/ ខ្លឹមសារបង្រៀន (តាមមុខវិជ្ជា)
                </h3>

                {/* Khmer */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    📖 មុខវិជ្ជា ភាសាខ្មែរ
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">សប្តាហ៍ទី១</label>
                      <textarea
                        rows={3}
                        value={reportData.curriculum.khmerW1}
                        onChange={(e) => setReportData({
                          ...reportData,
                          curriculum: { ...reportData.curriculum, khmerW1: e.target.value }
                        })}
                        className="w-full text-xs p-2 border rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">សប្តាហ៍ទី២</label>
                      <textarea
                        rows={3}
                        value={reportData.curriculum.khmerW2}
                        onChange={(e) => setReportData({
                          ...reportData,
                          curriculum: { ...reportData.curriculum, khmerW2: e.target.value }
                        })}
                        className="w-full text-xs p-2 border rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">សប្តាហ៍ទី៣</label>
                      <textarea
                        rows={3}
                        value={reportData.curriculum.khmerW3}
                        onChange={(e) => setReportData({
                          ...reportData,
                          curriculum: { ...reportData.curriculum, khmerW3: e.target.value }
                        })}
                        className="w-full text-xs p-2 border rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Math */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    📐 មុខវិជ្ជា គណិតវិទ្យា
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">សប្តាហ៍ទី១</label>
                      <textarea
                        rows={3}
                        value={reportData.curriculum.mathW1}
                        onChange={(e) => setReportData({
                          ...reportData,
                          curriculum: { ...reportData.curriculum, mathW1: e.target.value }
                        })}
                        className="w-full text-xs p-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">សប្តាហ៍ទី២</label>
                      <textarea
                        rows={3}
                        value={reportData.curriculum.mathW2}
                        onChange={(e) => setReportData({
                          ...reportData,
                          curriculum: { ...reportData.curriculum, mathW2: e.target.value }
                        })}
                        className="w-full text-xs p-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">សប្តាហ៍ទី៣</label>
                      <textarea
                        rows={3}
                        value={reportData.curriculum.mathW3}
                        onChange={(e) => setReportData({
                          ...reportData,
                          curriculum: { ...reportData.curriculum, mathW3: e.target.value }
                        })}
                        className="w-full text-xs p-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Life Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    🌱 មុខវិជ្ជា បំណិនជីវិត
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">សប្តាហ៍ទី១</label>
                      <textarea
                        rows={2}
                        value={reportData.curriculum.lifeSkillsW1}
                        onChange={(e) => setReportData({
                          ...reportData,
                          curriculum: { ...reportData.curriculum, lifeSkillsW1: e.target.value }
                        })}
                        className="w-full text-xs p-2 border rounded-xl focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">សប្តាហ៍ទី២</label>
                      <textarea
                        rows={2}
                        value={reportData.curriculum.lifeSkillsW2}
                        onChange={(e) => setReportData({
                          ...reportData,
                          curriculum: { ...reportData.curriculum, lifeSkillsW2: e.target.value }
                        })}
                        className="w-full text-xs p-2 border rounded-xl focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">សប្តាហ៍ទី៣</label>
                      <textarea
                        rows={2}
                        value={reportData.curriculum.lifeSkillsW3}
                        onChange={(e) => setReportData({
                          ...reportData,
                          curriculum: { ...reportData.curriculum, lifeSkillsW3: e.target.value }
                        })}
                        className="w-full text-xs p-2 border rounded-xl focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Results (%) & Student Remediation */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  ២/ លទ្ធផលសម្រេចបាន (គិតជាភាគរយ %)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Khmer Results */}
                  <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-2">
                    <span className="font-bold text-blue-900 block border-b border-blue-200 pb-1">
                      លទ្ធផល ភាសាខ្មែរ (%)
                    </span>
                    <div className="space-y-2">
                      {[
                        { label: 'សមត្ថភាពអាន', key: 'khmerReading' },
                        { label: 'សមត្ថភាពសរសេរ', key: 'khmerWriting' },
                        { label: 'សមត្ថភាពស្តាប់', key: 'khmerListening' },
                        { label: 'សមត្ថភាពនិយាយ', key: 'khmerSpeaking' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between gap-2">
                          <span className="text-slate-700 font-medium w-28">{item.label}</span>
                          <div className="flex gap-1">
                            {[0, 1, 2].map((idx) => (
                              <input
                                key={idx}
                                type="number"
                                title={`សប្តាហ៍ទី${idx + 1}`}
                                value={(reportData.results as any)[item.key][idx]}
                                onChange={(e) => {
                                  const arr = [...(reportData.results as any)[item.key]];
                                  arr[idx] = Number(e.target.value);
                                  setReportData({
                                    ...reportData,
                                    results: { ...reportData.results, [item.key]: arr }
                                  });
                                }}
                                className="w-12 p-1 text-center border rounded-lg bg-white font-bold"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Math Results */}
                  <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
                    <span className="font-bold text-amber-900 block border-b border-amber-200 pb-1">
                      លទ្ធផល គណិតវិទ្យា (%)
                    </span>
                    <div className="space-y-2">
                      {[
                        { label: 'ចំនួន', key: 'mathNumbers' },
                        { label: 'រង្វាស់រង្វាល់', key: 'mathMeasurement' },
                        { label: 'ធរណីមាត្រ', key: 'mathGeometry' },
                        { label: 'ពិជគណិត', key: 'mathAlgebra' },
                        { label: 'ស្ថិតិ', key: 'mathStatistics' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between gap-2">
                          <span className="text-slate-700 font-medium w-28">{item.label}</span>
                          <div className="flex gap-1">
                            {[0, 1, 2].map((idx) => (
                              <input
                                key={idx}
                                type="number"
                                title={`សប្តាហ៍ទី${idx + 1}`}
                                value={(reportData.results as any)[item.key][idx]}
                                onChange={(e) => {
                                  const arr = [...(reportData.results as any)[item.key]];
                                  arr[idx] = Number(e.target.value);
                                  setReportData({
                                    ...reportData,
                                    results: { ...reportData.results, [item.key]: arr }
                                  });
                                }}
                                className="w-12 p-1 text-center border rounded-lg bg-white font-bold"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Remediation Stats */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">
                      ចំនួនសិស្សដែលត្រូវជួយក្នុងខែ (សិស្សរៀនយឺត)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="សរុប"
                        value={reportData.results.studentsNeedingHelp}
                        onChange={(e) => setReportData({
                          ...reportData,
                          results: { ...reportData.results, studentsNeedingHelp: Number(e.target.value) }
                        })}
                        className="w-16 p-1.5 text-center border rounded-lg bg-white font-bold"
                      />
                      <span className="text-slate-500">នាក់ (ស្រី:</span>
                      <input
                        type="number"
                        placeholder="ស្រី"
                        value={reportData.results.studentsNeedingHelpFemale}
                        onChange={(e) => setReportData({
                          ...reportData,
                          results: { ...reportData.results, studentsNeedingHelpFemale: Number(e.target.value) }
                        })}
                        className="w-16 p-1.5 text-center border rounded-lg bg-white font-bold text-rose-600"
                      />
                      <span className="text-slate-500">នាក់) ស្មើ</span>
                      <input
                        type="number"
                        placeholder="%"
                        value={reportData.results.studentsNeedingHelpPercent}
                        onChange={(e) => setReportData({
                          ...reportData,
                          results: { ...reportData.results, studentsNeedingHelpPercent: Number(e.target.value) }
                        })}
                        className="w-16 p-1.5 text-center border rounded-lg bg-white font-bold text-blue-700"
                      />
                      <span>%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">
                      ចំនួនសិស្សដែលបានរម្លស់ក្នុងខែ (សិស្សមានការរីកចម្រើន)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="សរុប"
                        value={reportData.results.studentsRemediated}
                        onChange={(e) => setReportData({
                          ...reportData,
                          results: { ...reportData.results, studentsRemediated: Number(e.target.value) }
                        })}
                        className="w-16 p-1.5 text-center border rounded-lg bg-white font-bold"
                      />
                      <span className="text-slate-500">នាក់ (ស្រី:</span>
                      <input
                        type="number"
                        placeholder="ស្រី"
                        value={reportData.results.studentsRemediatedFemale}
                        onChange={(e) => setReportData({
                          ...reportData,
                          results: { ...reportData.results, studentsRemediatedFemale: Number(e.target.value) }
                        })}
                        className="w-16 p-1.5 text-center border rounded-lg bg-white font-bold text-rose-600"
                      />
                      <span className="text-slate-500">នាក់) ស្មើ</span>
                      <input
                        type="number"
                        placeholder="%"
                        value={reportData.results.studentsRemediatedPercent}
                        onChange={(e) => setReportData({
                          ...reportData,
                          results: { ...reportData.results, studentsRemediatedPercent: Number(e.target.value) }
                        })}
                        className="w-16 p-1.5 text-center border rounded-lg bg-white font-bold text-emerald-700"
                      />
                      <span>%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Next Direction */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-amber-600" />
                  ៣/ ទិសដៅបន្ត (សម្រាប់ខែក្រោយ)
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      • ខ្លឹមសារត្រូវផ្ដោតលើ ភាសាខ្មែរ៖
                    </label>
                    <input
                      type="text"
                      value={reportData.direction.focusKhmer}
                      onChange={(e) => setReportData({
                        ...reportData,
                        direction: { ...reportData.direction, focusKhmer: e.target.value }
                      })}
                      className="w-full p-2 border rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      • ខ្លឹមសារត្រូវផ្ដោតលើ គណិតវិទ្យា៖
                    </label>
                    <input
                      type="text"
                      value={reportData.direction.focusMath}
                      onChange={(e) => setReportData({
                        ...reportData,
                        direction: { ...reportData.direction, focusMath: e.target.value }
                      })}
                      className="w-full p-2 border rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      • គោលដៅកាត់បន្ថយសិស្សរៀនយឺតក្នុងខែបន្ទាប់៖
                    </label>
                    <input
                      type="text"
                      value={reportData.direction.slowLearnersTarget}
                      onChange={(e) => setReportData({
                        ...reportData,
                        direction: { ...reportData.direction, slowLearnersTarget: e.target.value }
                      })}
                      className="w-full p-2 border rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      • កំណត់ចំណាំ ឬផែនការសកម្មភាពបន្ថែម៖
                    </label>
                    <textarea
                      rows={2}
                      value={reportData.direction.additionalNotes}
                      onChange={(e) => setReportData({
                        ...reportData,
                        direction: { ...reportData.direction, additionalNotes: e.target.value }
                      })}
                      className="w-full p-2 border rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PREVIEW TAB */
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-full shadow-xs">
                <span>📄 ទម្រង់ស្តង់ដារ ១ទំព័រពេញលេញ (Single-Page A4) — បោះពុម្ពមិនលើសទំព័រ</span>
              </div>
              <div className="w-full max-w-3xl bg-white p-6 sm:p-7 rounded-2xl shadow-lg border border-slate-300">
                <div
                  dangerouslySetInnerHTML={{ __html: generatePrintableHtml() }}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 sm:px-6 flex items-center justify-between shrink-0">
          <button
            onClick={handleResetToDefault}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>កំណត់ឡើងវិញ</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              បិទ
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>រក្សាទុករបាយការណ៍</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>បោះពុម្ពឯកសារ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
