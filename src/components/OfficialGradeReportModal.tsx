import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  FileDown,
  FileSpreadsheet,
  CheckCircle2,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  School,
  Award,
  Users,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { TeacherProfile, Student, AttendanceDatabase, GradeDatabase } from '../types';
import { getKhmerCombinedDate, getKhmerLunarDate, getKhmerSouriyateiDate } from '../utils/khmerDate';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';
import {
  GRADE_PERIODS,
  GradePeriodKey,
  getStudentGrade,
  calculateSinglePeriodSummary,
  calculateSemesterSummary,
  calculateAnnualSummary,
} from '../utils/gradeManager';

interface OfficialGradeReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  students: Student[];
  grades: GradeDatabase;
  attendance: AttendanceDatabase;
  onShowToast: (msg: string) => void;
}

export const OfficialGradeReportModal: React.FC<OfficialGradeReportModalProps> = ({
  isOpen,
  onClose,
  teacher,
  students,
  grades,
  attendance,
  onShowToast,
}) => {
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<GradePeriodKey>('m10');
  const [reportTitle, setReportTitle] = useState<string>('របាយការណ៍បូកសរុបលទ្ធផលសិក្សា និងស្ថិតិវត្តមានសិស្ស');
  const [academicYear, setAcademicYear] = useState<string>(teacher.academicYear || '២០២៥-២០២៦');
  const [reportDate, setReportDate] = useState<string>(
    getKhmerCombinedDate(new Date(), { location: teacher.school || 'កំពង់ឆ្នាំង', format: 'combined_multiline' })
  );
  const [principalName, setPrincipalName] = useState<string>('');
  const [includeAttendance, setIncludeAttendance] = useState<boolean>(true);
  const [includeGrades, setIncludeGrades] = useState<boolean>(true);
  const [includeRemarks, setIncludeRemarks] = useState<boolean>(true);

  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentPeriod = GRADE_PERIODS.find((p) => p.key === selectedPeriodKey) || GRADE_PERIODS[0];

  // Process all student data with grades, ranks, and attendance calculations
  const dates = Object.keys(attendance);
  const totalDaysRecorded = dates.length;

  const periodSummary = calculateSinglePeriodSummary(students, grades, selectedPeriodKey);

  // Calculate scores and ranks using gradeManager for the selected period
  const computedList = periodSummary.students.map((item) => {
    const student = item.student;
    const totalScore = item.total;
    const avgScore = item.avg;

    // Attendance stats
    let presentCount = 0;
    let permissionCount = 0;
    let absentCount = 0;

    dates.forEach((dateKey) => {
      const rec = attendance[dateKey]?.[student.id];
      if (rec === 'present') presentCount++;
      else if (rec === 'permission') permissionCount++;
      else if (rec === 'absent') absentCount++;
    });

    const attendedDays = presentCount + permissionCount;
    const attendanceRate =
      totalDaysRecorded > 0
        ? ((presentCount / totalDaysRecorded) * 100).toFixed(0) + '%'
        : '១០០%';

    const cls = item.classification;
    const gradeLabel = `${cls.letter} (${cls.label})`;
    const gradeColor = cls.letter === 'A' ? 'text-emerald-700 font-bold' : cls.letter === 'B' ? 'text-blue-700 font-bold' : cls.letter === 'C' ? 'text-amber-700 font-bold' : cls.letter === 'D' ? 'text-orange-700' : 'text-rose-700 font-bold';
    const remarks = cls.remarks || 'ឆ្លងថ្នាក់';

    return {
      student,
      khmer: item.khmer,
      math: item.math,
      science: item.science,
      social: item.social,
      totalScore,
      avgScore,
      gradeLabel,
      gradeColor,
      remarks,
      presentCount,
      permissionCount,
      absentCount,
      attendedDays,
      attendanceRate,
    };
  });

  // Sort descending by average score for ranking
  const sortedForRank = [...computedList].sort((a, b) => b.avgScore - a.avgScore);
  const rankMap = new Map<number, number>();
  sortedForRank.forEach((item, index) => {
    rankMap.set(item.student.id, index + 1);
  });

  // Final table list kept in rollNo order or ranked order
  const finalReportList = computedList.map((item) => ({
    ...item,
    rank: rankMap.get(item.student.id) || 1,
  }));

  // Overall Class Statistics
  const totalStudents = students.length;
  const femaleStudents = students.filter((s) => s.gender === 'ស្រី').length;
  const maleStudents = totalStudents - femaleStudents;

  const passedStudents = computedList.filter((item) => item.avgScore >= 50).length;
  const passRate = totalStudents > 0 ? ((passedStudents / totalStudents) * 100).toFixed(1) : '100';

  const countA = computedList.filter((item) => item.avgScore >= 85).length;
  const countB = computedList.filter((item) => item.avgScore >= 75 && item.avgScore < 85).length;
  const countC = computedList.filter((item) => item.avgScore >= 65 && item.avgScore < 75).length;
  const countD = computedList.filter((item) => item.avgScore >= 50 && item.avgScore < 65).length;
  const countF = computedList.filter((item) => item.avgScore < 50).length;

  const averageClassGpa =
    totalStudents > 0
      ? (computedList.reduce((acc, curr) => acc + curr.avgScore, 0) / totalStudents).toFixed(1)
      : '0.0';

  // Handler to print isolated formatted official PDF report
  const handlePrintReport = () => {
    const printContent = printableRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=1100,height=850');
    if (!printWindow) {
      // Fallback to standard window.print if popup blocked
      window.print();
      return;
    }

    const activeFont = getActiveCustomFontFamily();
    const activeTheme = getActiveCustomBackgroundTheme();
    const docBackgroundCss = getThemeBackgroundCss(activeTheme);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="utf-8" />
        <title>${reportTitle} - ${teacher.grade} (${teacher.school})</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm 10mm 12mm 10mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
            margin: 0;
            padding: 15px;
            color: #1e293b;
            background: #ffffff !important;
            background-color: #ffffff !important;
            background-image: none !important;
            font-size: 11px;
            line-height: 1.4;
          }
          .font-moul {
            font-family: 'Moul', cursive, serif !important;
          }
          .header-title {
            text-align: center;
            margin-bottom: 12px;
          }
          .header-title h1 {
            font-size: 15px;
            margin: 0 0 4px 0;
            color: #0f172a;
          }
          .header-title h2 {
            font-size: 13px;
            margin: 0 0 4px 0;
            font-weight: 500;
          }
          .decor-line {
            font-size: 10px;
            letter-spacing: 6px;
            margin-bottom: 10px;
          }
          .school-info-grid {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 14px;
            border-bottom: 1.5px solid #334155;
            padding-bottom: 8px;
          }
          .info-block p {
            margin: 2px 0;
            font-size: 11px;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
          }
          .report-main-title {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0 12px 0;
            text-transform: uppercase;
            color: #1e1b4b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
            font-size: 10px;
          }
          th, td {
            border: 1px solid #475569;
            padding: 4px 5px;
            text-align: center;
          }
          th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: bold;
          }
          td.text-left {
            text-align: left;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 16px;
            background-color: #f8fafc;
            padding: 8px 12px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
          }
          .stats-item {
            font-size: 10px;
          }
          .stats-item strong {
            color: #0f172a;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 25px;
            page-break-inside: avoid;
          }
          .signature-box {
            text-align: center;
            width: 250px;
          }
          .signature-space {
            height: 60px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    onShowToast('✅ កំពុងបើកផ្ទាំងបោះពុម្ព និងរក្សាទុកជា PDF...');
  };

  // Handler to export CSV
  const handleExportCSV = () => {
    const headers = [
      'ល.រ',
      'អត្តលេខ',
      'គោត្តនាម-នាម',
      'ភេទ',
      'ថ្ងៃខែឆ្នាំកំណើត',
      'ភាសាខ្មែរ',
      'គណិតវិទ្យា',
      'វិទ្យាសាស្ត្រ',
      'សិក្សាសង្គម',
      'សរុបពិន្ទុ',
      'មធ្យមភាគ',
      'និទ្ទេស',
      'ចំណាត់ថ្នាក់',
      'វត្តមាន (ថ្ងៃ)',
      'ច្បាប់ (ថ្ងៃ)',
      'អវត្តមាន (ថ្ងៃ)',
      'ភាគរយវត្តមាន',
      'ការវាយតម្លៃ',
    ];

    const rows = finalReportList.map((item, idx) => [
      idx + 1,
      item.student.rollNo,
      `"${item.student.name}"`,
      item.student.gender,
      item.student.dob,
      item.khmer,
      item.math,
      item.science,
      item.social,
      item.totalScore,
      item.avgScore,
      `"${item.gradeLabel}"`,
      item.rank,
      item.presentCount,
      item.permissionCount,
      item.absentCount,
      item.attendanceRate,
      `"${item.remarks}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Official_Grade_Attendance_Report_${teacher.grade}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('✅ បានទាញយកឯកសាររបាយការណ៍ CSV ជោគជ័យ!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto no-print">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col my-auto max-h-[94vh] border border-slate-200"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 font-bold shadow-inner">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black flex items-center gap-2">
                <span>នាំចេញរបាយការណ៍ពិន្ទុ & វត្តមានសិស្សផ្លូវការ (Official PDF Report)</span>
                <span className="bg-amber-400 text-purple-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  A4 FORMATTED
                </span>
              </h3>
              <p className="text-xs text-purple-200">
                ឯកសារស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា រួមបញ្ចូលពិន្ទុ និទ្ទេស ចំណាត់ថ្នាក់ និងស្ថិតិវត្តមាន
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReport}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព / Save as PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>CSV Excel</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Controls / Filters */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <SlidersHorizontal className="w-4 h-4 text-purple-800" />
              <span>ដំណាក់កាលពិន្ទុ៖</span>
            </div>
            <div>
              <select
                value={selectedPeriodKey}
                onChange={(e) => setSelectedPeriodKey(e.target.value as GradePeriodKey)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1 text-xs font-bold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer shadow-sm"
              >
                <optgroup label="--- ឆមាសទី១ ---">
                  {GRADE_PERIODS.filter(p => p.semester === 1).map(p => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </optgroup>
                <optgroup label="--- ឆមាសទី២ ---">
                  {GRADE_PERIODS.filter(p => p.semester === 2).map(p => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </optgroup>
                <optgroup label="--- ប្រចាំឆ្នាំ ---">
                  {GRADE_PERIODS.filter(p => p.semester === 'annual').map(p => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="ឆ្នាំសិក្សា"
                className="bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 w-28 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <div>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                placeholder="ឈ្មោះនាយកសាលា (បើមាន)"
                className="bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-medium text-slate-800 w-44 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAttendance}
                onChange={(e) => setIncludeAttendance(e.target.checked)}
                className="rounded text-purple-900 focus:ring-purple-600"
              />
              <span>ទិន្នន័យវត្តមាន</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeRemarks}
                onChange={(e) => setIncludeRemarks(e.target.checked)}
                className="rounded text-purple-900 focus:ring-purple-600"
              />
              <span>ការវាយតម្លៃ</span>
            </label>
          </div>
        </div>

        {/* Printable Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70">
          <div
            ref={printableRef}
            className="bg-white mx-auto shadow-md border border-slate-200/90 rounded-2xl p-6 sm:p-8 text-slate-900 max-w-5xl"
            style={{ minHeight: '600px' }}
          >
            {/* ១. ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់ (Kingdom of Cambodia on Top) */}
            <div className="text-center space-y-0.5 mb-3">
              <h2 className="font-moul text-sm sm:text-base font-bold text-slate-900">ព្រះរាជាណាចក្រកម្ពុជា</h2>
              <h3 className="font-moul text-xs sm:text-sm text-slate-800">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
              <div className="decor-line text-xs font-bold text-slate-700 tracking-wider">— ༺ ៚ ༻ —</div>
            </div>

            {/* School Info & Report Meta Grid */}
            <div className="school-info-grid flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-700 pb-3 mb-4 text-xs">
              <div className="info-block space-y-1">
                <p className="font-extrabold text-slate-900 text-xs">
                  ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុកសៀមបូក
                </p>
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <span className="font-bold">សាលារៀន៖</span>
                  <span className="font-extrabold text-purple-950">{teacher.school || 'សាលារៀន ហ៊ុន សែន អូរឫស្សី កណ្តាល'}</span>
                </p>
                <p>
                  <span className="font-bold">ថ្នាក់ទទួលបន្ទុក៖</span> <span className="font-bold">{teacher.grade}</span> |{' '}
                  <span className="font-bold">ឆ្នាំសិក្សា៖</span> {academicYear}
                </p>
                <p>
                  <span className="font-bold">គ្រូបន្ទុកថ្នាក់៖</span>{' '}
                  <span className="font-extrabold text-slate-900">{teacher.name}</span>
                </p>
              </div>

              <div className="text-left sm:text-right text-[11px] space-y-0.5 mt-2 sm:mt-0">
                <p>
                  <span className="font-bold">កាលបរិច្ឆេទរបាយការណ៍៖</span> {reportDate}
                </p>
                <p>
                  <span className="font-bold">សម័យប្រឡង/វាយតម្លៃ៖</span> <span className="font-bold text-purple-900">{currentPeriod.label}</span>
                </p>
                <p>
                  <span className="font-bold">ទូរសព្ទទំនាក់ទំនង៖</span> {teacher.phone || '012 345 678'}
                </p>
              </div>
            </div>

            {/* Report Main Title */}
            <div className="text-center my-4">
              <h1 className="report-main-title font-moul text-sm sm:text-base text-purple-950 tracking-wide mb-1">
                {reportTitle}
              </h1>
              <p className="text-xs font-bold text-slate-600">
                ({teacher.grade || 'ថ្នាក់រៀន'} • {currentPeriod.label} • ឆ្នាំសិក្សា៖ {academicYear})
              </p>
            </div>

            {/* Overall Statistics Bar */}
            <div className="stats-grid grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs">
              <div className="stats-item flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-800" />
                <div>
                  <span className="text-slate-500 text-[10px] block">សិស្សសរុប</span>
                  <strong className="text-slate-900 text-xs">
                    {totalStudents} នាក់ (ស្រី {femaleStudents})
                  </strong>
                </div>
              </div>
              <div className="stats-item flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="text-slate-500 text-[10px] block">មធ្យមភាគថ្នាក់ & ជាប់</span>
                  <strong className="text-slate-900 text-xs">
                    {averageClassGpa} ពិន្ទុ ({passRate}%)
                  </strong>
                </div>
              </div>
              <div className="stats-item flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-slate-500 text-[10px] block">និទ្ទេស A/B/C/D/F</span>
                  <strong className="text-slate-900 text-xs">
                    {countA} / {countB} / {countC} / {countD} / {countF}
                  </strong>
                </div>
              </div>
              <div className="stats-item flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-slate-500 text-[10px] block">កាលបរិច្ឆេទវត្តមានសរុប</span>
                  <strong className="text-slate-900 text-xs">{totalDaysRecorded} ថ្ងៃកត់ត្រា</strong>
                </div>
              </div>
            </div>

            {/* Unified Composite Table */}
            <div className="overflow-x-auto my-3">
              <table className="w-full text-center border-collapse border border-slate-400 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-extrabold text-[11px]">
                    <th className="border border-slate-400 p-2 w-8">ល.រ</th>
                    <th className="border border-slate-400 p-2 w-12">អត្តលេខ</th>
                    <th className="border border-slate-400 p-2 text-left min-w-[130px]">គោត្តនាម និងនាម</th>
                    <th className="border border-slate-400 p-2 w-10">ភេទ</th>
                    <th className="border border-slate-400 p-2 w-20">ថ្ងៃកំណើត</th>
                    {includeGrades && (
                      <>
                        <th className="border border-slate-400 p-2 w-14">ភាសាខ្មែរ</th>
                        <th className="border border-slate-400 p-2 w-14">គណិត</th>
                        <th className="border border-slate-400 p-2 w-14">វិទ្យា.</th>
                        <th className="border border-slate-400 p-2 w-14">សង្គម</th>
                        <th className="border border-slate-400 p-2 w-14 bg-purple-50">សរុប</th>
                        <th className="border border-slate-400 p-2 w-14 bg-purple-100 text-purple-950 font-black">
                          មធ្យម
                        </th>
                        <th className="border border-slate-400 p-2 w-16">និទ្ទេស</th>
                        <th className="border border-slate-400 p-2 w-12 bg-amber-50">ចំណាត់</th>
                      </>
                    )}
                    {includeAttendance && (
                      <>
                        <th className="border border-slate-400 p-2 w-12 text-emerald-800">វត្តមាន</th>
                        <th className="border border-slate-400 p-2 w-12 text-amber-800">ច្បាប់</th>
                        <th className="border border-slate-400 p-2 w-12 text-rose-800">អវត្តមាន</th>
                        <th className="border border-slate-400 p-2 w-14 font-bold">អត្រា %</th>
                      </>
                    )}
                    {includeRemarks && <th className="border border-slate-400 p-2 w-24">ការវាយតម្លៃ</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {finalReportList.map((item, idx) => (
                    <tr key={item.student.id} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                      <td className="border border-slate-400 p-1.5 font-bold text-slate-700">{idx + 1}</td>
                      <td className="border border-slate-400 p-1.5 font-mono text-[11px] text-slate-600">
                        {item.student.rollNo}
                      </td>
                      <td className="border border-slate-400 p-1.5 text-left font-bold text-slate-900">
                        {item.student.name}
                      </td>
                      <td className="border border-slate-400 p-1.5">{item.student.gender}</td>
                      <td className="border border-slate-400 p-1.5 text-[10px] text-slate-600">{item.student.dob}</td>

                      {includeGrades && (
                        <>
                          <td className="border border-slate-400 p-1.5 font-medium">{item.khmer}</td>
                          <td className="border border-slate-400 p-1.5 font-medium">{item.math}</td>
                          <td className="border border-slate-400 p-1.5 font-medium">{item.science}</td>
                          <td className="border border-slate-400 p-1.5 font-medium">{item.social}</td>
                          <td className="border border-slate-400 p-1.5 font-bold bg-purple-50/60 text-slate-900">
                            {item.totalScore}
                          </td>
                          <td className="border border-slate-400 p-1.5 font-black text-purple-950 bg-purple-100/50 text-[11px]">
                            {item.avgScore}
                          </td>
                          <td className={`border border-slate-400 p-1.5 text-[10px] ${item.gradeColor}`}>
                            {item.gradeLabel}
                          </td>
                          <td className="border border-slate-400 p-1.5 font-black text-slate-900 bg-amber-50/50">
                            {item.rank}
                          </td>
                        </>
                      )}

                      {includeAttendance && (
                        <>
                          <td className="border border-slate-400 p-1.5 text-emerald-700 font-bold">
                            {item.presentCount}
                          </td>
                          <td className="border border-slate-400 p-1.5 text-amber-700 font-bold">
                            {item.permissionCount}
                          </td>
                          <td className="border border-slate-400 p-1.5 text-rose-700 font-bold">
                            {item.absentCount}
                          </td>
                          <td className="border border-slate-400 p-1.5 font-bold text-slate-800 text-[10px]">
                            {item.attendanceRate}
                          </td>
                        </>
                      )}

                      {includeRemarks && (
                        <td className="border border-slate-400 p-1.5 text-[10px] font-bold text-slate-700">
                          {item.remarks}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ២. ហត្ថលេខាគ្រូនៅលើនាយកសាលា (Teacher Above Principal Signatures) */}
            <div className="signature-section mt-8 pt-4 text-xs font-bold text-slate-800 space-y-6">
              {/* ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ */}
              <div className="flex justify-end">
                <div className="signature-box text-center space-y-1 min-w-[220px]">
                  <div className="whitespace-pre-line leading-relaxed text-[11px] font-bold text-slate-800">
                    {reportDate}
                  </div>
                  <p className="font-moul text-xs text-purple-950 pt-1">គ្រូបន្ទុកថ្នាក់</p>
                  <p className="text-[10px] text-slate-500 font-normal">(ហត្ថលេខា និងឈ្មោះ)</p>
                  <div className="signature-space h-14" />
                  <p className="border-t border-dotted border-slate-400 pt-1 font-bold text-slate-900">
                    {teacher.name}
                  </p>
                </div>
              </div>

              {/* ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា */}
              <div className="flex justify-start">
                <div className="signature-box text-center space-y-1 min-w-[220px]">
                  <p>បានឃើញ និងឯកភាព</p>
                  <p className="font-moul text-xs text-purple-950">នាយកសាលា</p>
                  <p className="text-[10px] text-slate-500 font-normal">(ហត្ថលេខា និងត្រា)</p>
                  <div className="signature-space h-14" />
                  <p className="border-t border-dotted border-slate-400 pt-1 text-slate-700">
                    {principalName || '...........................................'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ទម្រង់របាយការណ៍ត្រូវបានរៀបចំត្រឹមត្រូវតាមស្ដង់ដារបោះពុម្ពក្រដាស A4 Landscape</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            >
              បិទ
            </button>
            <button
              onClick={handlePrintReport}
              className="bg-purple-900 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-900/20 transition flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>បោះពុម្ព និងទាញយក PDF ផ្លូវការ</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
