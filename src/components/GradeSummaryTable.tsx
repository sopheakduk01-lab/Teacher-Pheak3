import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Award, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Calculator,
  ArrowRight
} from 'lucide-react';
import { exportGradesToCsv } from '../utils/gradeManager';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';

export interface SummaryStudentItem {
  no: number;
  studentId: string | number;
  name: string;
  gender: string;
  totalScore: number | string;
  averageScore: number;
  rank: number;
  letter: string;
  letterLabel?: string;
  passed: boolean;
  resultText?: string;
  honorTitle?: string;
}

interface GradeSummaryTableProps {
  periodLabel: string;
  periodType: 'monthly' | 'exam' | 's1_summary' | 's2_summary' | 'annual_summary';
  academicYear: string;
  gradeLevel: string;
  schoolName: string;
  teacherName: string;
  students: SummaryStudentItem[];
  totalStudents: number;
  femaleStudents: number;
  passedCount: number;
  failedCount: number;
  passRate: string;
  classAverage: number;
  onSwitchToFullView: () => void;
}

export const GradeSummaryTable: React.FC<GradeSummaryTableProps> = ({
  periodLabel,
  periodType,
  academicYear,
  gradeLevel,
  schoolName,
  teacherName,
  students,
  totalStudents,
  femaleStudents,
  passedCount,
  failedCount,
  passRate,
  classAverage,
  onSwitchToFullView,
}) => {
  const printableRef = useRef<HTMLDivElement>(null);

  const isAnnual = periodType === 'annual_summary';

  // Handler to print single-page summary cleanly
  const handlePrintSummary = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      window.print();
      return;
    }

    const titleText = isAnnual 
      ? `តារាងលទ្ធផលសង្ខេបប្រចាំឆ្នាំ - ថ្នាក់ទី ${gradeLevel}`
      : `តារាងលទ្ធផលសង្ខេប ${periodLabel} - ថ្នាក់ទី ${gradeLevel}`;

    const rowsHtml = students.map((s) => `
      <tr style="text-align: center; border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 6px 4px; font-weight: bold; border-right: 1px solid #cbd5e1;">${s.no}</td>
        <td style="padding: 6px 4px; font-family: monospace; border-right: 1px solid #cbd5e1;">${s.studentId}</td>
        <td style="padding: 6px 8px; text-align: left; font-weight: bold; border-right: 1px solid #cbd5e1; ${s.gender === 'ស្រី' ? 'color: #be185d;' : ''}">${s.name}</td>
        <td style="padding: 6px 4px; border-right: 1px solid #cbd5e1; ${s.gender === 'ស្រី' ? 'color: #db2777; font-weight: bold;' : 'color: #2563eb;'}">${s.gender}</td>
        <td style="padding: 6px 4px; font-weight: bold; border-right: 1px solid #cbd5e1;">${s.totalScore}</td>
        <td style="padding: 6px 4px; font-weight: 900; color: #431407; background-color: #faf5ff; border-right: 1px solid #cbd5e1;">${Number(s.averageScore).toFixed(2)}</td>
        <td style="padding: 6px 4px; font-weight: bold; border-right: 1px solid #cbd5e1;">${s.rank}</td>
        <td style="padding: 6px 4px; font-weight: bold; border-right: 1px solid #cbd5e1;">${s.letter} ${s.letterLabel ? '(' + s.letterLabel + ')' : ''}</td>
        <td style="padding: 6px 4px; font-weight: bold; color: ${s.passed ? '#047857' : '#be123c'};">${s.resultText || (s.passed ? (isAnnual ? 'ឡើងថ្នាក់' : 'ជាប់') : (isAnnual ? 'ត្រួតថ្នាក់' : 'ធ្លាក់'))}</td>
      </tr>
    `).join('');

    const activeFont = getActiveCustomFontFamily();
    const activeTheme = getActiveCustomBackgroundTheme();
    const docBackgroundCss = getThemeBackgroundCss(activeTheme);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="utf-8" />
        <title>${titleText}</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 10mm 12mm 10mm;
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
            ${docBackgroundCss}
            color: #0f172a;
            font-size: 11px;
            line-height: 1.4;
          }
          .moul-title {
            font-family: 'Moul', cursive !important;
            letter-spacing: 0.5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: 700;
            border: 1px solid #94a3b8;
            padding: 8px 4px;
            font-size: 10.5px;
          }
          td {
            border: 1px solid #cbd5e1;
            font-size: 10.5px;
          }
          .header-grid {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
          }
          .stats-row {
            display: flex;
            justify-content: space-around;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 8px;
            margin-top: 12px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 10px;
          }
          .sig-block-top {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 16px;
          }
          .sig-block-bottom {
            display: flex;
            justify-content: flex-start;
          }
        </style>
      </head>
      <body>
        <!-- ១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់ -->
        <div style="text-align: center; margin-bottom: 8px;">
          <div class="moul-title" style="font-size: 13px; color: #1e1b4b;">ព្រះរាជាណាចក្រកម្ពុជា</div>
          <div class="moul-title" style="font-size: 11px; color: #1e1b4b; margin-top: 2px;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          <div style="font-size: 9px; letter-spacing: 2px; margin-top: 1px;">— ༺ ៚ ༻ —</div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 10px; border-bottom: 1.5px solid #334155; padding-bottom: 6px;">
          <div style="text-align: left;">
            <div style="font-weight: bold; font-size: 11px;">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
            <div style="font-weight: bold; color: #4338ca; font-size: 11px;">${schoolName || 'សាលារៀន'}</div>
          </div>
          <div style="text-align: right; color: #475569; font-size: 10px;">
            <div style="font-weight: bold; color: #1e1b4b;">ថ្នាក់ទី ${gradeLevel || '...'}</div>
            <div>ឆ្នាំសិក្សា ${academicYear || '២០២៦-២០២៧'}</div>
          </div>
        </div>

        <div style="text-align: center; margin: 10px 0;">
          <div class="moul-title" style="font-size: 13px; color: #1e1b4b;">${titleText}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">លទ្ធផលសង្ខេបផ្លូវការតែមួយទំព័រ (Official 1-Page Summary)</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 32px;">ល.រ</th>
              <th style="width: 70px;">អត្តលេខ</th>
              <th style="min-width: 130px; text-align: left; padding-left: 8px;">គោត្តនាម-នាមសិស្ស</th>
              <th style="width: 45px;">ភេទ</th>
              <th style="width: 65px;">ពិន្ទុសរុប</th>
              <th style="width: 65px;">មធ្យមភាគ</th>
              <th style="width: 65px;">ចំណាត់ថ្នាក់</th>
              <th style="width: 70px;">និទ្ទេស</th>
              <th style="width: 65px;">ជាប់ឬធ្លាក់</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="stats-row">
          <span>សិស្សសរុប៖ <strong>${totalStudents} នាក់</strong></span>
          <span>ស្រី៖ <strong>${femaleStudents} នាក់</strong></span>
          <span>សិស្សជាប់៖ <strong style="color: #047857;">${passedCount} នាក់ (${passRate}%)</strong></span>
          <span>សិស្សធ្លាក់៖ <strong style="color: #b91c1c;">${failedCount} នាក់</strong></span>
          <span>មធ្យមភាគរួមថ្នាក់៖ <strong style="color: #4338ca;">${Number(classAverage).toFixed(2)}</strong></span>
        </div>

        <!-- ២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា -->
        <div style="margin-top: 24px; page-break-inside: avoid;">
          <!-- ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូ -->
          <div class="sig-block-top">
            <div class="sig-box">
              <div style="font-size: 10px; color: #475569;">ថ្ងៃ...................ខែ...............ឆ្នាំ២០២...</div>
              <div style="font-weight: bold; margin-top: 2px;">គ្រូបន្ទុកថ្នាក់</div>
              <div style="height: 50px;"></div>
              <div style="font-weight: bold; border-top: 1px dotted #94a3b8; padding-top: 4px; min-width: 140px;">${teacherName || 'ហត្ថលេខា និងឈ្មោះ'}</div>
            </div>
          </div>

          <!-- ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា -->
          <div class="sig-block-bottom">
            <div class="sig-box">
              <div style="font-size: 10px; color: #475569;">បានឃើញ និងឯកភាព</div>
              <div style="font-weight: bold; margin-top: 2px;">នាយកសាលា</div>
              <div style="height: 50px;"></div>
              <div style="font-weight: bold; border-top: 1px dotted #94a3b8; padding-top: 4px; min-width: 140px;">ហត្ថលេខា និងត្រា</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 450);
  };

  // Handler to export CSV
  const handleExportCsv = () => {
    const headers = ['ល.រ', 'អត្តលេខ', 'ឈ្មោះសិស្ស', 'ភេទ', 'ពិន្ទុសរុប', 'មធ្យមភាគ', 'ចំណាត់ថ្នាក់', 'និទ្ទេស', 'លទ្ធផល'];
    const rows = students.map((s) => [
      s.no,
      s.studentId,
      s.name,
      s.gender,
      s.totalScore,
      s.averageScore,
      s.rank,
      `${s.letter} ${s.letterLabel || ''}`.trim(),
      s.resultText || (s.passed ? (isAnnual ? 'ឡើងថ្នាក់' : 'ជាប់') : (isAnnual ? 'ត្រួតថ្នាក់' : 'ធ្លាក់'))
    ]);
    const csvContent = '\uFEFF' + [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `តារាងលទ្ធផលសង្ខេប_${periodLabel}_${academicYear || ''}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4" ref={printableRef}>
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-4 sm:p-5 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-purple-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              ទំព័រសង្ខេប (Summary Sheet)
            </span>
            <span className="text-xs text-purple-200 font-bold">
              ថ្នាក់ទី {gradeLevel} • {academicYear}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-300 shrink-0" />
            <span>តារាងលទ្ធផលសង្ខេប៖ {periodLabel}</span>
          </h3>
          <p className="text-xs text-purple-200">
            បង្ហាញតែមួយទំព័រសង្ខេប៖ លេខរៀងសិស្ស ឈ្មោះ ភេទ ពិន្ទុសរុប មធ្យមភាគ ចំណាត់ថ្នាក់ និទ្ទេស និងលទ្ធផល (ជាប់/ធ្លាក់)។
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handlePrintSummary}
            className="bg-amber-400 hover:bg-amber-300 text-purple-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            title="បោះពុម្ពតារាងសង្ខេបនេះមួយទំព័រ A4"
          >
            <Printer className="w-4 h-4" />
            <span>🖨️ បោះពុម្ពតារាងសង្ខេប</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="ទាញយកជា Excel/CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ទាញយក CSV</span>
          </button>

          <button
            type="button"
            onClick={onSwitchToFullView}
            className="bg-indigo-700/80 hover:bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="ប្ដូរទៅទិដ្ឋភាពបង្ហាញពេញលេញគ្រប់មុខវិជ្ជា"
          >
            <span>📊 មើលពិន្ទុពេញលេញ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
            <span>សិស្សសរុប</span>
            <Users className="w-3.5 h-3.5 text-purple-700" />
          </div>
          <div className="text-lg font-black text-slate-900 mt-0.5">
            {totalStudents} <span className="text-xs font-bold text-pink-600">(ស្រី {femaleStudents})</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
            <span>មធ្យមភាគរួម</span>
            <Calculator className="w-3.5 h-3.5 text-indigo-700" />
          </div>
          <div className="text-lg font-black text-purple-950 mt-0.5">
            {Number(classAverage).toFixed(2)}
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
          <div className="text-[11px] font-bold text-emerald-800 flex items-center justify-between">
            <span>សិស្សជាប់</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-emerald-800 mt-0.5">
            {passedCount} <span className="text-xs font-bold">({passRate}%)</span>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
          <div className="text-[11px] font-bold text-rose-800 flex items-center justify-between">
            <span>សិស្សធ្លាក់</span>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-lg font-black text-rose-800 mt-0.5">
            {failedCount}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-amber-900 flex items-center justify-between">
            <span>លទ្ធផលឆ្នើម</span>
            <Award className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xs font-black text-amber-900 mt-1 truncate">
            {students.length > 0 ? `🥇 ${students[0].name}` : 'គ្មានទិន្នន័យ'}
          </div>
        </div>
      </div>

      {/* Official Single-Page Style Clean Summary Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-200/80 font-black border-b-2 border-slate-300 text-slate-900 text-[11px]">
              <tr>
                <th className="p-3 text-center w-12 border-r border-slate-200">ល.រ</th>
                <th className="p-3 text-center w-24 border-r border-slate-200">អត្តលេខ</th>
                <th className="p-3 min-w-[150px] border-r border-slate-200">ឈ្មោះសិស្ស (គោត្តនាម-នាម)</th>
                <th className="p-3 text-center w-16 border-r border-slate-200">ភេទ</th>
                <th className="p-3 text-center w-24 border-r border-slate-200 bg-purple-50/50 text-purple-950 font-black">
                  <span>ពិន្ទុសរុប</span>
                </th>
                <th className="p-3 text-center w-24 border-r border-slate-200 bg-amber-50/80 text-amber-950 font-black">
                  <span>មធ្យមភាគ</span>
                </th>
                <th className="p-3 text-center w-28 border-r border-slate-200">ចំណាត់ថ្នាក់</th>
                <th className="p-3 text-center w-28 border-r border-slate-200">និទ្ទេស</th>
                <th className="p-3 text-center w-24">ជាប់ឬធ្លាក់</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-bold">
                    គ្មានទិន្នន័យសិស្សត្រូវបង្ហាញ
                  </td>
                </tr>
              ) : (
                students.map((item, idx) => {
                  const isFemale = item.gender === 'ស្រី';
                  const isTop3 = item.rank <= 3;

                  return (
                    <tr 
                      key={item.studentId || idx}
                      className={`hover:bg-purple-50/40 transition-colors ${
                        item.rank === 1 ? 'bg-amber-50/20' : (idx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white')
                      }`}
                    >
                      <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-100">
                        {item.no || idx + 1}
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-slate-600 border-r border-slate-100">
                        {item.studentId}
                      </td>

                      <td className="p-3 font-bold border-r border-slate-100">
                        <span className={`text-sm ${isFemale ? 'text-pink-900 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                          {item.name}
                        </span>
                      </td>

                      <td className="p-3 text-center border-r border-slate-100 font-bold">
                        <span className={isFemale ? 'text-pink-600' : 'text-blue-600'}>
                          {item.gender}
                        </span>
                      </td>

                      <td className="p-3 text-center font-black text-slate-900 border-r border-slate-100 bg-purple-50/20">
                        {item.totalScore}
                      </td>

                      <td className="p-3 text-center font-black text-purple-950 text-sm border-r border-slate-100 bg-amber-50/30">
                        {Number(item.averageScore).toFixed(2)}
                      </td>

                      <td className="p-3 text-center border-r border-slate-100">
                        <span
                          className={`inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-lg font-black text-xs ${
                            item.rank === 1
                              ? 'bg-amber-400 text-purple-950 shadow-xs'
                              : item.rank === 2
                              ? 'bg-slate-200 text-slate-800'
                              : item.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.rank === 1 ? '🥇 លេខ ១' : item.rank === 2 ? '🥈 លេខ ២' : item.rank === 3 ? '🥉 លេខ ៣' : `លេខ ${item.rank}`}
                        </span>
                      </td>

                      <td className="p-3 text-center border-r border-slate-100">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                            item.letter === 'A'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : item.letter === 'B'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : item.letter === 'C'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : item.letter === 'D'
                              ? 'bg-orange-100 text-orange-800 border border-orange-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {item.letter} {item.letterLabel ? `(${item.letterLabel})` : ''}
                        </span>
                      </td>

                      <td className="p-3 text-center font-black">
                        {item.passed ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{item.resultText || (isAnnual ? 'ឡើងថ្នាក់' : 'ជាប់')}</span>
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 text-[11px] inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>{item.resultText || (isAnnual ? 'ត្រួតថ្នាក់' : 'ធ្លាក់')}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Table Footer with Summary Averages */}
            {students.length > 0 && (
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-extrabold text-[11px] text-slate-800">
                <tr>
                  <td colSpan={4} className="p-3 text-right">
                    មធ្យមភាគរួមថ្នាក់ (Class GPA) ៖
                  </td>
                  <td className="p-3 text-center font-black text-purple-950">
                    {(students.reduce((acc, curr) => acc + (typeof curr.totalScore === 'number' ? curr.totalScore : Number(curr.totalScore) || 0), 0) / (students.length || 1)).toFixed(1)}
                  </td>
                  <td className="p-3 text-center font-black text-purple-950 text-sm">
                    {Number(classAverage).toFixed(2)}
                  </td>
                  <td colSpan={2} className="p-3 text-center text-slate-600">
                    ជាប់ {passedCount} / ធ្លាក់ {failedCount} ({passRate}%)
                  </td>
                  <td className="p-3 text-center font-black text-emerald-700">
                    {passedCount} នាក់ជាប់
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
