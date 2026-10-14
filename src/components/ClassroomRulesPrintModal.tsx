import React, { useRef, useState } from 'react';
import {
  Printer,
  X,
  FileText,
  Download,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { TeacherProfile } from '../types';
import { getKhmerCombinedDate, toKhmerNum } from '../utils/khmerDate';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';

export interface ClassroomRuleItem {
  id: number;
  title: string;
  description: string;
}

interface ClassroomRulesPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  rules?: ClassroomRuleItem[];
  onUpdateRules?: (rules: ClassroomRuleItem[]) => void;
}

export const DEFAULT_RULES: ClassroomRuleItem[] = [
  { id: 1, title: 'ប្រការ១', description: 'សិស្សទាំងអស់ត្រូវស្លៀកពាក់ឯកសណ្ឋានស្អាតបាត ក្រចកដៃកាត់ខ្លី និងមានអនាម័យខ្លួនប្រាណល្អ។' },
  { id: 2, title: 'ប្រការ២', description: 'សិស្សប្រុសត្រូវកាត់សក់ខ្លីសមរម្យ សិស្សស្រីដែលមានសក់វែងត្រូវចង ឬបិតសក់ឱ្យបានស្អាតបាត។' },
  { id: 3, title: 'ប្រការ៣', description: 'មិនត្រូវពាក់គ្រឿងអលង្ការមានតម្លៃ ឬតុបតែងខ្លួនហួសហេតុមកសាលារៀនឡើយ។' },
  { id: 4, title: 'ប្រការ៤', description: 'សិស្សទាំងអស់ត្រូវចូលរួមគោរពទង់ជាតិ ថ្វាយបង្គំព្រះរតនត្រ័យ និងស្តាប់ឱវាទអប់រំនៅព្រឹកថ្ងៃចន្ទ ឬរៀងរាល់ថ្ងៃ។' },
  { id: 5, title: 'ប្រការ៥', description: 'ពេលម៉ោងសិក្សាត្រូវរក្សាភាពស្ងៀមស្ងាត់ យកចិត្តទុកដាក់ស្តាប់លោកគ្រូ អ្នកគ្រូពន្យល់ និងមិនត្រូវរំខានមិត្តរួមថ្នាក់។' },
  { id: 6, title: 'ប្រការ៦', description: 'ពេលលោកគ្រូ អ្នកគ្រូ ឬនាយកសាលាចូលក្នុងថ្នាក់ ឬចាកចេញ សិស្សទាំងអស់ត្រូវក្រោកឈរស្វាគមន៍ដោយគួរសម។' },
  { id: 7, title: 'ប្រការ៧', description: 'ពេលចេញលេង សិស្សត្រូវលេងល្បែងកម្សាន្តសុខដុមរមនា មិនត្រូវប្រកែក ឈ្លោះប្រកាំង ឬប្រើអំពើហិង្សាឡើយ។' },
  { id: 8, title: 'ប្រការ៨', description: 'ហាមដាច់ខាតការគូរគូសជញ្ជាំង បំផ្លាញតុ កៅអី សម្ភារៈ ឬទ្រព្យសម្បត្តិសាលារៀន។' },
  { id: 9, title: 'ប្រការ៩', description: 'មិនត្រូវបោះសំរាមផ្តេសផ្តាសក្នុងថ្នាក់រៀន ឬបរិវេណសាលា ត្រូវចោលក្នុងធុងសំរាមដែលបានកំណត់។' },
  { id: 10, title: 'ប្រការ១០', description: 'សិស្សទាំងអស់ត្រូវមករៀនឱ្យបានទៀងទាត់ពេលវេលា (មកដល់មុនម៉ោង ០៧:១៥ នាទីព្រឹក)។' },
  { id: 11, title: 'ប្រការ១១', description: 'រាល់ពេលអវត្តមានឈប់សម្រាក ត្រូវមានច្បាប់ទម្លាប់ច្បាស់លាស់ ដោយមានលិខិតសុំច្បាប់ពីមាតាបិតា ឬអាណាព្យាបាលផ្ទាល់។' },
  { id: 12, title: 'ប្រការ១២', description: 'សិស្សទាំងអស់ត្រូវគោរពវិន័យសាលា និងអនុវត្តបទបញ្ជាផ្ទៃក្នុងនេះឱ្យបានខ្ជាប់ខ្ជួន ដើម្បីឧត្តមភាពការសិក្សា។' },
];

export const ClassroomRulesPrintModal: React.FC<ClassroomRulesPrintModalProps> = ({
  isOpen,
  onClose,
  teacher,
  rules: externalRules,
  onUpdateRules,
}) => {
  const [internalRules, setInternalRules] = useState<ClassroomRuleItem[]>(DEFAULT_RULES);
  const rules = externalRules || internalRules;
  const setRules = (newRules: ClassroomRuleItem[] | ((prev: ClassroomRuleItem[]) => ClassroomRuleItem[])) => {
    const updated = typeof newRules === 'function' ? newRules(rules) : newRules;
    if (onUpdateRules) {
      onUpdateRules(updated);
    } else {
      setInternalRules(updated);
    }
  };
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [printOrientation, setPrintOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [colorMode, setColorMode] = useState<'color' | 'bw'>('color');
  const [academicYear, setAcademicYear] = useState<string>(teacher.academicYear || '២០២៥ - ២០២៦');
  const [khmerDateStr, setKhmerDateStr] = useState<string>(() =>
    getKhmerCombinedDate(new Date(), { location: teacher.school || 'កំពង់ឆ្នាំង', format: 'combined_multiline' })
  );

  if (!isOpen) return null;

  const handleStartEdit = (rule: ClassroomRuleItem) => {
    setEditingId(rule.id);
    setEditTitle(rule.title);
    setEditDesc(rule.description);
  };

  const handleSaveEdit = (id: number) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, title: editTitle, description: editDesc } : r)));
    setEditingId(null);
  };

  const handleDeleteRule = (id: number) => {
    if (confirm('តើអ្នកពិតជាចង់លុបប្រការនេះមែនទេ?')) {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;
    const nextId = rules.length > 0 ? Math.max(...rules.map((r) => r.id)) + 1 : 1;
    const title = newTitle.trim() || `ប្រការ${toKhmerNum(nextId)}`;
    setRules([...rules, { id: nextId, title, description: newDesc.trim() }]);
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

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
  <title>បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន_${teacher.grade}_${teacher.school}</title>
  ${getKhmerGoogleFontsLinkHtml()}
  <style>
    @page {
      size: A4 ${isLandscape ? 'landscape' : 'portrait'};
      margin: 10mm 15mm 10mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
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
      padding: 5px;
    }
    .font-moul {
      font-family: 'Moul', cursive, serif;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }
    .header-table td {
      vertical-align: top;
      padding: 0 4px;
    }
    .title-banner {
      text-align: center;
      margin: 10px 0 14px 0;
      padding: 6px 0;
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      background: ${isBW ? '#f3f4f6' : '#f0fdf4'};
    }
    .title-banner h2 {
      font-size: 14pt;
      font-weight: 700;
      color: ${isBW ? '#000' : '#14532d'};
      letter-spacing: 0.5px;
    }
    .rules-list {
      margin-bottom: 15px;
    }
    .rule-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .rule-title {
      font-weight: 700;
      min-width: 75px;
      color: ${isBW ? '#000' : '#1e1b4b'};
    }
    .rule-desc {
      flex: 1;
      text-align: justify;
    }
    .signature-container {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding: 0 20px;
      page-break-inside: avoid;
    }
    .sig-block {
      text-align: center;
      width: 220px;
    }
    .sig-title {
      font-size: 10pt;
      font-weight: 700;
    }
    .sig-name {
      margin-top: 50px;
      font-size: 10.5pt;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- ១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់ -->
    <div style="text-align: center; margin-bottom: 8px;">
      <div class="font-moul" style="font-size: 11pt; font-weight: bold; color: #0f172a;">ព្រះរាជាណាចក្រកម្ពុជា</div>
      <div class="font-moul" style="font-size: 9.5pt; font-weight: bold; color: #1e293b; margin-top: 2px;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
      <div style="font-size: 8.5pt; letter-spacing: 2px; margin-top: 2px; font-weight: bold; color: #334155;">— ༺ ៚ ༻ —</div>
    </div>

    <!-- School Info Row -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; border-bottom: 2px solid #0f172a; padding-bottom: 6px;">
      <div style="text-align: left;">
        <div style="font-size: 9pt; font-weight: 700; color: #0f172a;">ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុកសៀមបូក</div>
        <div style="font-size: 9.5pt; font-weight: 700; color: #1e1b4b; margin-top: 2px;">សាលារៀន៖ <span>${teacher.school || 'សាលារៀនគំរូ'}</span></div>
      </div>
      <div style="text-align: right; font-size: 8.5pt; color: #334155;">
        <div>ថ្នាក់ទទួលបន្ទុក៖ <b>${teacher.grade || 'ថ្នាក់ទី ៤A'}</b> | គ្រូបន្ទុកថ្នាក់៖ <b>${teacher.name}</b></div>
        <div>ឆ្នាំសិក្សា៖ <b>${academicYear}</b></div>
      </div>
    </div>

    <!-- Title Banner -->
    <div class="title-banner">
      <h2 class="font-moul">បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន</h2>
      <div style="font-size: 10pt; font-weight: 700; margin-top: 3px;">ឆ្នាំសិក្សា ${academicYear}</div>
    </div>

    <div style="margin-bottom: 12px; font-weight: 600; text-indent: 20px;">
      យោងតាមសំណូមពរ និងការសម្រេចឯកភាពគ្នារវាងលោកគ្រូ អ្នកគ្រូ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ថ្នាក់ទី <b>${teacher.grade}</b> នៃ <b>${teacher.school}</b> បានដាក់ចេញនូវ <b>«បទបញ្ជាផ្ទៃក្នុង»</b> សម្រាប់អនុវត្តដូចតទៅ៖
    </div>

    <!-- Rules List -->
    <div class="rules-list">
      ${rules
        .map(
          (rule) => `
        <div class="rule-item">
          <div class="rule-title">${rule.title} ៖</div>
          <div class="rule-desc">${rule.description}</div>
        </div>
      `
        )
        .join('')}
    </div>

    <div style="margin-top: 10px; font-style: italic; font-size: 9.5pt; text-align: center;">
      សិស្សទាំងអស់ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ត្រូវអាន យល់ដឹង និងអនុវត្តតាមបទបញ្ជាផ្ទៃក្នុងនេះឱ្យបានខ្ជាប់ខ្ជួន។
    </div>

    <!-- Signatures (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) -->
    <div style="margin-top: 24px; page-break-inside: avoid;">
      <!-- ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
        <div style="text-align: center; min-width: 220px;">
          <div style="font-size: 9.5pt; font-style: italic; white-space: pre-line;">${khmerDateStr}</div>
          <div class="sig-title" style="margin-top: 4px;">គ្រូបន្ទុកថ្នាក់</div>
          <div style="height: 50px;"></div>
          <div class="sig-name" style="margin-top: 0;">${teacher.name || 'លោកគ្រូ / អ្នកគ្រូ'}</div>
        </div>
      </div>

      <!-- ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា -->
      <div style="display: flex; justify-content: flex-start;">
        <div style="text-align: center; min-width: 220px;">
          <div class="sig-title">បានឃើញ និងឯកភាព</div>
          <div class="sig-title">នាយកសាលា</div>
          <div style="height: 50px;"></div>
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

  const handleDirectPrint = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.open();
    printWindow.document.write(generatePrintHTML());
    printWindow.document.close();
  };

  const handleDownloadHTML = () => {
    const html = generatePrintHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `បទបញ្ជាផ្ទៃក្នុង_${teacher.grade || 'ថ្នាក់ទី៤'}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportWord = () => {
    const html = generatePrintHTML();
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `បទបញ្ជាផ្ទៃក្នុង_${teacher.grade || 'ថ្នាក់ទី៤'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between border-b border-purple-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  រៀបចំ និងបោះពុម្ពបទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន (Classroom Rules A4)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[10px]">
                  Editable & Print A4
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5">
                កែសម្រួលប្រការ បន្ថែម ឬលុប និងបោះពុម្ពទម្រង់ស្ដង់ដារក្រសួងអប់រំសម្រាប់បិទក្នុងថ្នាក់រៀន
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
                🎨 ពណ៌ធម្មជាតិ
              </button>
              <button
                type="button"
                onClick={() => setColorMode('bw')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  colorMode === 'bw' ? 'bg-purple-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🖨️ ស-ខ្មៅ (Ink Saver)
              </button>
            </div>

            {/* Orientation */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setPrintOrientation('portrait')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  printOrientation === 'portrait' ? 'bg-purple-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📄 បញ្ឈរ (Portrait)
              </button>
              <button
                type="button"
                onClick={() => setPrintOrientation('landscape')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  printOrientation === 'landscape' ? 'bg-purple-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🖻 ផ្ដេក (Landscape)
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>បន្ថែមប្រការថ្មី</span>
            </button>
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
              <span>បោះពុម្ព A4 ភ្លាមៗ (Print A4)</span>
            </button>
          </div>
        </div>

        {/* Add New Rule Modal/Form Section */}
        {isAdding && (
          <form onSubmit={handleAddRule} className="p-4 bg-purple-50 border-b border-purple-200 space-y-3 text-xs animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-purple-950 text-sm">➕ បន្ថែមប្រការថ្មីក្នុងបទបញ្ជាផ្ទៃក្នុង</h4>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="block font-bold text-slate-700 mb-1">ចំណងជើងប្រការ</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ឧ. ប្រការ១៣"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">ខ្លឹមសារបទបញ្ជា</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="បញ្ចូលខ្លឹមសារច្បាប់ទម្លាប់នៅទីនេះ..."
                    required
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-900 text-white font-bold rounded-xl hover:bg-purple-800 shadow"
                  >
                    រក្សាទុក
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Live A4 Sheet Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/80 flex justify-center">
          <div
            className={`w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-300 p-6 sm:p-8 text-black transition-colors ${
              colorMode === 'bw' ? 'grayscale contrast-125' : ''
            }`}
          >
            {/* 1. Header Official MoEYS (១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់) */}
            <div className="text-center space-y-0.5 mb-3">
              <h2 className="font-moul text-xs sm:text-sm text-slate-950">ព្រះរាជាណាចក្រកម្ពុជា</h2>
              <h3 className="font-moul text-[11px] sm:text-xs text-slate-950">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
              <p className="text-xs text-amber-900 font-bold tracking-wider mt-0.5">— ༺ ៚ ༻ —</p>
            </div>

            <div className="flex justify-between items-end border-b border-slate-300 pb-3 mb-4 text-xs font-bold text-slate-900">
              <div className="space-y-0.5 text-left">
                <p className="font-extrabold text-slate-950">ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុកសៀមបូក</p>
                <p className="text-sm font-black text-purple-950">សាលារៀន៖ {teacher.school || 'សាលារៀនគំរូ'}</p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-slate-700 font-semibold">ថ្នាក់ទទួលបន្ទុក៖ <strong className="text-slate-900">{teacher.grade || 'ថ្នាក់ទី ៤A'}</strong> | គ្រូបន្ទុកថ្នាក់៖ <strong className="text-slate-900">{teacher.name}</strong></p>
                <p className="text-slate-700 font-semibold">ឆ្នាំសិក្សា៖ <strong className="text-slate-900">{academicYear}</strong></p>
              </div>
            </div>

            {/* 2. Banner */}
            <div className="text-center py-2.5 px-4 bg-purple-50 rounded-xl border border-purple-200 mb-4">
              <h2 className="font-moul text-base sm:text-lg text-purple-950">បទបញ្ជាផ្ទៃក្នុងថ្នាក់រៀន</h2>
              <p className="text-xs text-purple-900 font-bold mt-0.5">ឆ្នាំសិក្សា {academicYear}</p>
            </div>

            <p className="text-xs sm:text-sm font-medium mb-4 leading-relaxed text-slate-900">
              យោងតាមសំណូមពរ និងការសម្រេចឯកភាពគ្នារវាងលោកគ្រូ អ្នកគ្រូ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ថ្នាក់ទី{' '}
              <strong className="text-purple-950 font-black">{teacher.grade}</strong> នៃ{' '}
              <strong className="text-purple-950 font-black">{teacher.school}</strong> បានដាក់ចេញនូវ{' '}
              <strong className="text-purple-950 font-black">«បទបញ្ជាផ្ទៃក្នុង»</strong> សម្រាប់អនុវត្តដូចតទៅ៖
            </p>

            {/* 3. Rules Interactive List for Preview & Quick Edit */}
            <div className="space-y-3 mb-6 text-xs sm:text-sm">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="group relative flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50/60 border border-transparent hover:border-purple-200 transition"
                >
                  {editingId === rule.id ? (
                    <div className="flex-1 space-y-2 bg-white p-3 rounded-xl border border-purple-300 shadow-sm">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-28 px-2.5 py-1.5 border rounded-lg font-bold text-xs"
                        />
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded bg-slate-200 text-slate-700 font-bold text-xs"
                        >
                          បោះបង់
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(rule.id)}
                          className="px-3 py-1 rounded bg-purple-900 text-white font-bold text-xs"
                        >
                          រក្សាទុក
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-bold text-purple-950 shrink-0 min-w-[75px]">{rule.title} ៖</div>
                      <div className="flex-1 text-slate-800 leading-relaxed text-justify">{rule.description}</div>

                      {/* Edit / Delete hover actions */}
                      <div className="no-print opacity-0 group-hover:opacity-100 transition flex items-center gap-1 shrink-0 bg-white shadow-sm border border-slate-200 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(rule)}
                          title="កែសម្រួល"
                          className="p-1 hover:bg-purple-100 text-purple-700 rounded"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRule(rule.id)}
                          title="លុប"
                          className="p-1 hover:bg-rose-100 text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center text-xs text-slate-600 italic mb-6">
              សិស្សទាំងអស់ និងមាតាបិតា/អាណាព្យាបាលសិស្ស ត្រូវអាន យល់ដឹង និងអនុវត្តតាមបទបញ្ជាផ្ទៃក្នុងនេះឱ្យបានខ្ជាប់ខ្ជួន។
            </div>

            {/* 4. Signatures (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) */}
            <div className="pt-4 px-6 text-xs space-y-6">
              {/* ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ */}
              <div className="flex justify-end">
                <div className="text-center space-y-0.5 min-w-[200px]">
                  <p className="text-xs text-slate-600 italic whitespace-pre-line">{khmerDateStr}</p>
                  <p className="font-bold text-slate-900">គ្រូបន្ទុកថ្នាក់</p>
                  <div className="h-14"></div>
                  <p className="font-black text-purple-950">{teacher.name}</p>
                </div>
              </div>

              {/* ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា */}
              <div className="flex justify-start">
                <div className="text-center space-y-1 min-w-[200px]">
                  <p className="font-bold text-slate-900">បានឃើញ និងឯកភាព</p>
                  <p className="font-bold text-slate-900">នាយកសាលា</p>
                  <div className="h-14"></div>
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
