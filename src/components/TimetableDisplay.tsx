import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  Edit3,
  Check,
  RotateCcw,
  Info,
  FileText,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Sun,
  Moon,
  Clock,
  Save,
} from 'lucide-react';
import {
  primarySchoolTimetable,
  morningShiftRows,
  afternoonShiftRows,
  TimetableInfo,
  TimetableRow,
} from '../data/timetableData';
import { exportTimetableToWord, printStandardWordDocument } from '../utils/wordExport';
import { PdfCustomizerModal } from './PdfCustomizerModal';

const TIMETABLE_STORAGE_KEY = 'primary_school_timetable_custom_v2';

const QUICK_SUBJECTS = [
  { label: 'ភាសាខ្មែរ', icon: '📘' },
  { label: 'គណិតវិទ្យា', icon: '📐' },
  { label: 'វិទ្យាសាស្ត្រ', icon: '🔬' },
  { label: 'សិក្សាសង្គម', icon: '🌏' },
  { label: 'អប់រំកាយ', icon: '⚽' },
  { label: 'សិល្បៈ', icon: '🎨' },
  { label: 'ភាសាអង់គ្លេស', icon: '🇬🇧' },
  { label: 'ស្វ័យសិក្សា', icon: '💡' },
  { label: 'ចេញលេង', icon: '☕' },
  { label: 'គោរពទង់ជាតិ', icon: '🇰🇭' },
  { label: 'បំប៉នភាសាខ្មែរ', icon: '📖' },
  { label: 'បំប៉នគណិតវិទ្យា', icon: '🧮' },
  { label: 'បំណិនជីវិត', icon: '🌱' },
];

interface TimetableDisplayProps {
  grade?: string;
  onShowToast?: (msg: string) => void;
  isModalView?: boolean;
  onCloseModal?: () => void;
}

export const TimetableDisplay: React.FC<TimetableDisplayProps> = ({
  grade = 'ថ្នាក់ទី ៤-៦',
  onShowToast,
  isModalView = false,
  onCloseModal,
}) => {
  const [data, setData] = useState<TimetableInfo>(() => {
    const saved = localStorage.getItem(TIMETABLE_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved timetable:', e);
      }
    }
    return primarySchoolTimetable;
  });

  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [isBWMode, setIsBWMode] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPrintGuide, setShowPrintGuide] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Active focused cell for 1-click subject assignment
  const [activeCell, setActiveCell] = useState<{ rowIndex: number; field: keyof TimetableRow } | null>(null);

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handlePrintStandardWord = () => {
    printStandardWordDocument(data, isBWMode);
    if (onShowToast) {
      onShowToast('បានបើកផ្ទាំងបោះពុម្ពស្តង់ដារ Word (A4 ផ្តេក)...');
    }
  };

  const handleExportWord = () => {
    exportTimetableToWord(data);
    if (onShowToast) {
      onShowToast('បានទាញយកឯកសារកាលវិភាគជាទម្រង់ Microsoft Word (.doc) រួចរាល់!');
    }
  };

  const handleResetData = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់កាលវិភាគដើមឡើងវិញមែនទេ?')) {
      setData(primarySchoolTimetable);
      localStorage.removeItem(TIMETABLE_STORAGE_KEY);
      if (onShowToast) {
        onShowToast('បានកំណត់ទិន្នន័យដើមឡើងវិញ');
      }
    }
  };

  const handleCellChange = (rowIndex: number, field: keyof TimetableRow, value: string) => {
    const updatedRows = [...data.rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };
    setData({ ...data, rows: updatedRows });
  };

  // 1-Click quick insert subject into active cell
  const handleInsertQuickSubject = (subjectName: string) => {
    if (activeCell) {
      handleCellChange(activeCell.rowIndex, activeCell.field, subjectName);
      if (onShowToast) {
        onShowToast(`បានបញ្ចូល "${subjectName}" ជោគជ័យ!`);
      }
    } else {
      if (onShowToast) {
        onShowToast('សូមចុចលើប្រអប់ណាមួយក្នុងតារាងជាមុនសិន ដើម្បីបញ្ចូលមុខវិជ្ជា!');
      }
    }
  };

  // Switch shift preset
  const handleApplyShiftPreset = (shiftType: 'morning' | 'afternoon') => {
    if (shiftType === 'morning') {
      setData({
        ...data,
        shift: 'ព្រឹក',
        rows: morningShiftRows,
      });
      if (onShowToast) {
        onShowToast('បានប្តូរទៅកាលវិភាគ វេនព្រឹក (៧:០០ - ១១:០០) ជោគជ័យ!');
      }
    } else {
      setData({
        ...data,
        shift: 'រសៀល',
        rows: afternoonShiftRows,
      });
      if (onShowToast) {
        onShowToast('បានប្តូរទៅកាលវិភាគ វេនរសៀល (១៣:០០ - ១៧:០០) ជោគជ័យ!');
      }
    }
  };

  // Add new row
  const handleAddRow = () => {
    const newRow: TimetableRow = {
      time: '10:20-11:00',
      duration: '៤០នាទី',
      mon: 'មុខវិជ្ជា...',
      tue: 'មុខវិជ្ជា...',
      wed: 'មុខវិជ្ជា...',
      thu: 'មុខវិជ្ជា...',
      fri: 'មុខវិជ្ជា...',
      sat: 'មុខវិជ្ជា...',
      type: 'normal',
    };
    setData({
      ...data,
      rows: [...data.rows, newRow],
    });
    if (onShowToast) {
      onShowToast('បានបន្ថែមជួរម៉ោងសិក្សាថ្មី!');
    }
  };

  // Delete row
  const handleDeleteRow = (index: number) => {
    setData({
      ...data,
      rows: data.rows.filter((_, idx) => idx !== index),
    });
    if (onShowToast) {
      onShowToast('បានលុបជួរម៉ោងសិក្សា');
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setActiveCell(null);
    if (onShowToast) {
      onShowToast('បានរក្សាទុកកាលវិភាគដោយជោគជ័យ!');
    }
  };

  const daysList = [
    { key: 'all', label: 'សប្តាហ៍ទាំងមូល (ច័ន្ទ - សៅរ៍)' },
    { key: 'mon', label: 'ចន្ទ' },
    { key: 'tue', label: 'អង្គារ' },
    { key: 'wed', label: 'ពុធ' },
    { key: 'thu', label: 'ព្រហស្បតិ៍' },
    { key: 'fri', label: 'សុក្រ' },
    { key: 'sat', label: 'សៅរ៍' },
  ];

  return (
    <div className={`space-y-6 ${isModalView ? 'p-2 sm:p-4' : ''}`}>
      {/* Top Action Header */}
      <div className="no-print bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 flex items-center justify-center font-black text-xl shadow-xs">
              📄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  កាលវិភាគបង្រៀនផ្លូវការ (ស្តង់ដារ Microsoft Word & MoEYS)
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded-md">
                  A4 Landscape ផ្តេក
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-950 font-bold px-2 py-0.5 rounded-md">
                  វេន{data.shift}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {data.schoolName} • ឆ្នាំសិក្សា {data.academicYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Edit / View Mode Button */}
            <button
              onClick={() => {
                const nextState = !isEditing;
                setIsEditing(nextState);
                if (nextState && onShowToast) {
                  onShowToast('បានបើកមុខងារកែសម្រួល៖ ចុចលើប្រអប់ក្នុងតារាងដើម្បីកែប្រែ ឬជ្រើសមុខវិជ្ជា!');
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                isEditing
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-1'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditing ? 'រួចរាល់ (រក្សាទុក)' : '✏️ កែសម្រួលកាលវិភាគ'}</span>
            </button>

            {isEditing && (
              <button
                onClick={handleResetData}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1"
                title="កំណត់ទិន្នន័យដើមឡើងវិញ"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>កំណត់ឡើងវិញ</span>
              </button>
            )}

            {/* PDF Customizer Button */}
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition shadow-md flex items-center gap-1.5 active:scale-95"
              title="កំណត់ និងកែសម្រួលទម្រង់កាលវិភាគមុនទាញយកជា PDF"
            >
              <FileText className="w-4 h-4 text-red-200" />
              <span>ទាញយក / កែសម្រួល PDF</span>
            </button>

            {/* Export as Word Document (.doc) */}
            <button
              onClick={handleExportWord}
              className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 active:scale-95"
              title="ទាញយកឯកសារ Word ដើម្បីបើកកែប្រែ ឬព្រីនក្នុង Microsoft Word"
            >
              <Download className="w-4 h-4 text-blue-200" />
              <span>ទាញយក Word (.doc)</span>
            </button>

            {/* Word Standard Direct Print */}
            <button
              onClick={handlePrintStandardWord}
              className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>បោះពុម្ពស្តង់ដារ Word</span>
            </button>

            {isModalView && onCloseModal && (
              <button
                onClick={onCloseModal}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
              >
                បិទ
              </button>
            )}
          </div>
        </div>

        {/* Quick Inserter & Shift Switcher when isEditing is TRUE */}
        {isEditing && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-extrabold text-xs text-purple-950 dark:text-purple-200">
                  បន្ទះជំនួយកែសម្រួលរហ័ស (ចុចលើប្រអប់ក្នុងតារាង រួចចុចមុខវិជ្ជាដើម្បីបញ្ចូលភ្លាមៗ)៖
                </span>
                {activeCell && (
                  <span className="text-[11px] bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 px-2 py-0.5 rounded-md font-bold">
                    កំពុងជ្រើស៖ ជួរទី {activeCell.rowIndex + 1} ({activeCell.field.toUpperCase()})
                  </span>
                )}
              </div>

              {/* Shift Presets & Add Row Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyShiftPreset('morning')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                    data.shift === 'ព្រឹក'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
                  }`}
                  title="ប្តូរទៅកាលវិភាគវេនព្រឹក (៧:០០ - ១១:០០)"
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>វេនព្រឹក</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyShiftPreset('afternoon')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                    data.shift === 'រសៀល'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-50'
                  }`}
                  title="ប្តូរទៅកាលវិភាគវេនរសៀល (១៣:០០ - ១៧:០០)"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>វេនរសៀល</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddRow}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>បន្ថែមជួរម៉ោង</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md ring-2 ring-emerald-400 transition cursor-pointer"
                  title="ចុចទីនេះដើម្បីរក្សាទុកកាលវិភាគ"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>💾 រក្សាទុក (SAVE)</span>
                </button>
              </div>
            </div>

            {/* Subject Chips - Large, Spacious, Clear & Easy to Tap */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {QUICK_SUBJECTS.map((sub) => (
                <button
                  key={sub.label}
                  type="button"
                  onClick={() => handleInsertQuickSubject(sub.label)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 border-2 border-purple-200 dark:border-purple-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-black transition flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="text-base">{sub.icon}</span>
                  <span>{sub.label}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={handleSave}
                className="ml-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400 transition cursor-pointer active:scale-95"
                title="រក្សាទុកកាលវិភាគ"
              >
                <Save className="w-4 h-4 text-white" />
                <span>💾 រក្សាទុកកាលវិភាគ (SAVE)</span>
              </button>
            </div>
          </div>
        )}

        {/* Toolbar row: Color / B&W and Guide */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold">ទម្រង់ពណ៌៖</span>
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold">
              <button
                onClick={() => setIsBWMode(true)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  isBWMode
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                ⚪ ស/ខ្មៅ (B&W ស្តង់ដារ)
              </button>
              <button
                onClick={() => setIsBWMode(false)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  !isBWMode
                    ? 'bg-white dark:bg-slate-900 text-purple-900 dark:text-purple-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                🎨 មានពណ៌ (Color)
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowPrintGuide(!showPrintGuide)}
            className="text-purple-900 dark:text-purple-400 font-bold flex items-center gap-1 hover:underline"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showPrintGuide ? 'លាក់ការណែនាំបោះពុម្ព' : 'របៀបកំណត់ការបោះពុម្ពឲ្យស្អាតដូច Word'}</span>
          </button>
        </div>

        {/* Print Setup Guide Box */}
        {showPrintGuide && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-xs space-y-2 text-amber-950 dark:text-amber-200">
            <h4 className="font-extrabold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ការកំណត់លើផ្ទាំង Print របស់ Browser ដើម្បីឲ្យដូច Word ១០០%៖</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
              <li>
                <strong>Layout / ទម្រង់ក្រដាស៖</strong> ជ្រើសរើស <strong>Landscape (ផ្តេក)</strong>
              </li>
              <li>
                <strong>Paper size / ទំហំក្រដាស៖</strong> ជ្រើសរើស <strong>A4</strong>
              </li>
              <li>
                <strong>Margins / រឹមក្រដាស៖</strong> ជ្រើសរើស <strong>Default</strong> ឬ <strong>Custom (10mm)</strong>
              </li>
              <li>
                <strong>Headers and footers / ក្បាលទំព័រនិងជើងទំព័រ៖</strong>{' '}
                <span className="text-rose-600 font-bold">ដោះធីក (Uncheck)</span> ដើម្បីកុំឱ្យជាប់កាលបរិច្ឆេទ ឬតំណភ្ជាប់ URL របស់ Browser
              </li>
              <li>
                <strong>Background graphics / ផ្ទៃពណ៌៖</strong> ធីកបើក (Check) ប្រសិនបើចង់បានពណ៌ផ្ទៃតារាង
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Filter Options */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
        <span className="text-slate-500 shrink-0">ជ្រើសរើសថ្ងៃ៖</span>
        {daysList.map((day) => (
          <button
            key={day.key}
            onClick={() => setSelectedDay(day.key)}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition ${
              selectedDay === day.key
                ? 'bg-purple-900 text-white font-extrabold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Printable Sheet (Word Standard Visual Template) */}
      <div
        className={`printable-timetable ${
          isBWMode ? 'bw-print-mode' : ''
        } bg-white text-black p-6 sm:p-10 rounded-2xl border-2 border-slate-300 shadow-2xl space-y-5 max-w-5xl mx-auto font-sans leading-normal transition-all`}
        style={{ fontFamily: "'Kantumruy Pro', 'Siemreap', 'Battambang', Arial, sans-serif" }}
      >
        {/* Official Letterhead Header */}
        <div className="grid grid-cols-2 gap-4 pb-1 items-start">
          {/* Left: Office & School */}
          <div className="space-y-1 text-left">
            {isEditing ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={data.office}
                  onChange={(e) => setData({ ...data, office: e.target.value })}
                  className="w-full text-xs font-bold border border-slate-300 rounded p-1 bg-amber-50/50"
                  placeholder="ឈ្មោះការិយាល័យ..."
                />
                <input
                  type="text"
                  value={data.schoolName}
                  onChange={(e) => setData({ ...data, schoolName: e.target.value })}
                  className="w-full text-xs font-moul border border-slate-300 rounded p-1 bg-amber-50/50"
                  placeholder="ឈ្មោះសាលារៀន..."
                />
              </div>
            ) : (
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">{data.office}</p>
                <p className="font-moul text-xs sm:text-sm text-slate-900 mt-0.5 leading-tight">{data.schoolName}</p>
              </div>
            )}
          </div>

          {/* Right: Kingdom Header */}
          <div className="text-center space-y-0.5">
            <h4
              className={`font-moul text-xs sm:text-sm md:text-base leading-tight ${
                isBWMode ? 'text-black' : 'text-amber-950'
              }`}
            >
              {data.countryHeader}
            </h4>
            <h5 className="font-moul text-xs sm:text-sm text-black leading-tight">{data.motto}</h5>
            <div className="text-[10px] text-slate-500 font-mono leading-none">rr2ss</div>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center space-y-1 pt-1 pb-2">
          {isEditing ? (
            <div className="space-y-1 max-w-xl mx-auto">
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full text-center font-moul text-sm border border-slate-300 rounded p-1 bg-amber-50/50"
              />
              <div className="flex gap-2 justify-center text-xs">
                <input
                  type="text"
                  value={data.academicYear}
                  onChange={(e) => setData({ ...data, academicYear: e.target.value })}
                  className="text-center border border-slate-300 rounded p-1 w-28 bg-amber-50/50"
                  placeholder="ឆ្នាំសិក្សា"
                />
                <input
                  type="text"
                  value={data.system}
                  onChange={(e) => setData({ ...data, system: e.target.value })}
                  className="text-center border border-slate-300 rounded p-1 w-28 bg-amber-50/50"
                  placeholder="ប្រព័ន្ធ"
                />
                <input
                  type="text"
                  value={data.shift}
                  onChange={(e) => setData({ ...data, shift: e.target.value })}
                  className="text-center border border-slate-300 rounded p-1 w-20 bg-amber-50/50"
                  placeholder="វេន"
                />
              </div>
            </div>
          ) : (
            <div>
              <h2
                className={`font-moul text-sm sm:text-base md:text-lg ${
                  isBWMode ? 'text-black' : 'text-blue-900'
                }`}
              >
                {data.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                ឆ្នាំសិក្សា {data.academicYear} ({data.system}) ({data.shift})
              </p>
            </div>
          )}
        </div>

        {/* Word-Standard Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs border-[1.5px] border-black">
            <thead>
              <tr
                className={`${
                  isBWMode ? 'bg-slate-200' : 'bg-[#FCE4D6]'
                } text-black font-moul border-b border-black`}
              >
                <th className="p-2.5 border border-black min-w-[90px] font-normal text-[11px]">ម៉ោងសិក្សា</th>
                <th className="p-2.5 border border-black min-w-[70px] font-normal text-[11px]">រយៈពេល</th>
                {(selectedDay === 'all' || selectedDay === 'mon') && (
                  <th className="p-2.5 border border-black min-w-[110px] font-normal text-[11px]">ចន្ទ</th>
                )}
                {(selectedDay === 'all' || selectedDay === 'tue') && (
                  <th className="p-2.5 border border-black min-w-[110px] font-normal text-[11px]">អង្គារ</th>
                )}
                {(selectedDay === 'all' || selectedDay === 'wed') && (
                  <th className="p-2.5 border border-black min-w-[110px] font-normal text-[11px]">ពុធ</th>
                )}
                {(selectedDay === 'all' || selectedDay === 'thu') && (
                  <th className="p-2.5 border border-black min-w-[110px] font-normal text-[11px]">ព្រហស្បតិ៍</th>
                )}
                {(selectedDay === 'all' || selectedDay === 'fri') && (
                  <th className="p-2.5 border border-black min-w-[110px] font-normal text-[11px]">សុក្រ</th>
                )}
                {(selectedDay === 'all' || selectedDay === 'sat') && (
                  <th className="p-2.5 border border-black min-w-[110px] font-normal text-[11px]">សៅរ៍</th>
                )}
                {isEditing && (
                  <th className="p-2 border border-black w-10 text-center font-normal text-[11px]">លុប</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, idx) => {
                if (row.type === 'flag') {
                  return (
                    <tr
                      key={idx}
                      className={`${isBWMode ? 'bg-white' : 'bg-rose-50'} text-black font-bold border-b border-black`}
                    >
                      <td className="p-2 border border-black font-mono font-bold text-xs">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.time}
                            onChange={(e) => handleCellChange(idx, 'time', e.target.value)}
                            className="w-full text-center border rounded p-0.5 text-xs font-mono bg-white"
                          />
                        ) : (
                          row.time
                        )}
                      </td>
                      <td className="p-2 border border-black text-xs font-normal">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.duration}
                            onChange={(e) => handleCellChange(idx, 'duration', e.target.value)}
                            className="w-full text-center border rounded p-0.5 text-xs bg-white"
                          />
                        ) : (
                          row.duration
                        )}
                      </td>
                      <td
                        colSpan={selectedDay === 'all' ? 6 : 1}
                        className={`p-2 border border-black font-moul text-xs ${
                          isBWMode ? 'text-black' : 'text-rose-900'
                        } tracking-wider`}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.mon}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = [...data.rows];
                              updated[idx] = {
                                ...updated[idx],
                                mon: val,
                                tue: val,
                                wed: val,
                                thu: val,
                                fri: val,
                                sat: val,
                              };
                              setData({ ...data, rows: updated });
                            }}
                            className="w-full text-center border rounded p-1 bg-white font-bold"
                          />
                        ) : (
                          `🚩 ${row.mon}`
                        )}
                      </td>
                      {isEditing && (
                        <td className="p-1 border border-black text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(idx)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="លុបជួរ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                }

                if (row.type === 'break') {
                  return (
                    <tr
                      key={idx}
                      className={`${isBWMode ? 'bg-white' : 'bg-amber-50'} text-black font-bold border-b border-black`}
                    >
                      <td className="p-2 border border-black font-mono font-bold text-xs">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.time}
                            onChange={(e) => handleCellChange(idx, 'time', e.target.value)}
                            className="w-full text-center border rounded p-0.5 text-xs font-mono bg-white"
                          />
                        ) : (
                          row.time
                        )}
                      </td>
                      <td className="p-2 border border-black text-xs font-normal">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.duration}
                            onChange={(e) => handleCellChange(idx, 'duration', e.target.value)}
                            className="w-full text-center border rounded p-0.5 text-xs bg-white"
                          />
                        ) : (
                          row.duration
                        )}
                      </td>
                      <td
                        colSpan={selectedDay === 'all' ? 6 : 1}
                        className={`p-2 border border-black font-moul text-xs ${
                          isBWMode ? 'text-black' : 'text-amber-900'
                        } tracking-wider`}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.mon}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = [...data.rows];
                              updated[idx] = {
                                ...updated[idx],
                                mon: val,
                                tue: val,
                                wed: val,
                                thu: val,
                                fri: val,
                                sat: val,
                              };
                              setData({ ...data, rows: updated });
                            }}
                            className="w-full text-center border rounded p-1 bg-white font-bold"
                          />
                        ) : (
                          `🔔 ${row.mon}`
                        )}
                      </td>
                      {isEditing && (
                        <td className="p-1 border border-black text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(idx)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="លុបជួរ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                }

                return (
                  <tr key={idx} className="border-b border-black hover:bg-slate-50">
                    <td className="p-2 border border-black font-mono font-bold text-black text-xs">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.time}
                          onChange={(e) => handleCellChange(idx, 'time', e.target.value)}
                          className="w-full text-center border rounded p-0.5 text-xs font-mono bg-white"
                        />
                      ) : (
                        row.time
                      )}
                    </td>
                    <td className="p-2 border border-black text-black text-xs">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.duration}
                          onChange={(e) => handleCellChange(idx, 'duration', e.target.value)}
                          className="w-full text-center border rounded p-0.5 text-xs bg-white"
                        />
                      ) : (
                        row.duration
                      )}
                    </td>

                    {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const).map((dayKey) => {
                      if (selectedDay !== 'all' && selectedDay !== dayKey) return null;
                      const isFocused = activeCell?.rowIndex === idx && activeCell?.field === dayKey;
                      return (
                        <td
                          key={dayKey}
                          className={`p-1.5 border border-black text-xs font-bold transition ${
                            isFocused ? 'bg-purple-100 ring-2 ring-purple-500 ring-inset' : ''
                          }`}
                        >
                          {isEditing ? (
                            <input
                              type="text"
                              value={row[dayKey]}
                              onFocus={() => setActiveCell({ rowIndex: idx, field: dayKey })}
                              onChange={(e) => handleCellChange(idx, dayKey, e.target.value)}
                              className="w-full text-center border border-slate-300 rounded p-1 text-xs bg-white font-bold focus:border-purple-600 focus:outline-none"
                            />
                          ) : (
                            row[dayKey]
                          )}
                        </td>
                      );
                    })}

                    {isEditing && (
                      <td className="p-1 border border-black text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(idx)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="លុបជួរនេះ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Official Notes Section */}
        {showNotes && (
          <div className="pt-2 space-y-1.5 text-xs text-black">
            <h5 className="font-bold underline text-rose-950">
              <span>កំណត់សម្គាល់៖</span>
            </h5>
            <ul className="space-y-1 list-disc list-inside text-[11px] leading-relaxed text-black">
              {data.notes.map((note, idx) => (
                <li key={idx}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => {
                        const updated = [...data.notes];
                        updated[idx] = e.target.value;
                        setData({ ...data, notes: updated });
                      }}
                      className="w-[90%] border border-slate-300 rounded p-1 text-[11px] bg-amber-50/50"
                    />
                  ) : (
                    note
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Official Signatures Section */}
        <div className="pt-6 grid grid-cols-2 gap-6 text-center text-xs font-bold text-black">
          <div className="space-y-1 flex flex-col items-center justify-between min-h-[90px]">
            {isEditing ? (
              <textarea
                rows={2}
                value={data.directorTitle}
                onChange={(e) => setData({ ...data, directorTitle: e.target.value })}
                className="w-full text-center border border-slate-300 rounded p-1 text-xs bg-amber-50/50"
              />
            ) : (
              <>
                <p className="font-moul text-xs text-black">{data.directorTitle.split('\n')[0]}</p>
                <p className="font-bold">{data.directorTitle.split('\n')[1] || 'នាយកសាលា'}</p>
              </>
            )}
            <div className="h-10"></div>
            <p className="text-slate-500 font-normal border-t border-dotted border-black w-40 pt-1">
              (ហត្ថលេខា និងត្រា)
            </p>
          </div>

          <div className="space-y-1 flex flex-col items-center justify-between min-h-[90px]">
            {isEditing ? (
              <div className="w-full space-y-1">
                <input
                  type="text"
                  value={data.issuedDate}
                  onChange={(e) => setData({ ...data, issuedDate: e.target.value })}
                  className="w-full text-center border border-slate-300 rounded p-1 text-xs bg-amber-50/50"
                />
                <input
                  type="text"
                  value={data.teacherTitle}
                  onChange={(e) => setData({ ...data, teacherTitle: e.target.value })}
                  className="w-full text-center border border-slate-300 rounded p-1 text-xs bg-amber-50/50"
                />
              </div>
            ) : (
              <>
                <p className="text-slate-600 font-medium">{data.issuedDate}</p>
                <p className="font-moul text-xs text-black">{data.teacherTitle}</p>
              </>
            )}
            <div className="h-10"></div>
            <p className="text-slate-500 font-normal border-t border-dotted border-black w-40 pt-1">
              (ហត្ថលេខា)
            </p>
          </div>
        </div>
      </div>

      {/* PDF Customizer Modal */}
      <PdfCustomizerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        documentType="timetable"
        title="កំណត់ទម្រង់ & ទាញយក PDF កាលវិភាគបង្រៀន"
        initialHeader={{
          docTitle: data.title || 'កាលវិភាគប្រចាំសប្តាហ៍ សម្រាប់ថ្នាក់ទី ៤-៦',
          docSubtitle: `${data.schoolName} • ឆ្នាំសិក្សា ${data.academicYear} • កម្រិតថ្នាក់៖ ${grade} • វេន${data.shift || 'ព្រឹក'}`,
          schoolName: data.schoolName,
          officeInfo: data.office,
          academicYear: data.academicYear,
          teacherName: data.teacherName || 'រិទ្ធ សុធា',
          gradeLevel: grade,
          locationAndDate: data.issuedDate,
          leftSignatureTitle: data.directorTitle,
          rightSignatureTitle: data.teacherTitle,
        }}
        timetableData={data}
        onShowToast={onShowToast}
      />
    </div>
  );
};
