import React from 'react';
import { QuizQuestion, QuestionType } from '../types';
import {
  CheckCircle2,
  Bookmark,
  Award,
  Globe2,
  BookOpen,
  PenTool,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  User,
  Calendar,
  CheckSquare,
  Home,
  AlertTriangle,
  FileText,
  Star,
  MessageSquare,
} from 'lucide-react';

export type WorksheetType = 'worksheet' | 'exam' | 'homework' | 'test' | 'exit_ticket';
export type WorksheetBorderStyle = 'double' | 'ornamental' | 'modern' | 'minimal';
export type WorksheetFontSize = 'compact' | 'normal' | 'large';
export type WorksheetDesignTheme =
  | 'moeys_classic'   // ម៉ូតទី ១ ៖ ផ្លូវការក្រសួង MoEYS Classic
  | 'modern_indigo'   // ម៉ូតទី ២ ៖ ទំនើបប្រណិត Modern Clean
  | 'primary_friendly'// ម៉ូតទី ៣ ៖ កុមារមេត្រីបឋម Primary Child-Friendly
  | 'pisa_academic';  // ម៉ូតទី ៤ ៖ វិញ្ញាសាស្តង់ដារ PISA / ប្រឡងប្រជែង Academic Excellence
export type PageOrientation = 'portrait' | 'landscape';
export type PageLayoutMode = 'two_pages' | 'continuous';
export type WorksheetMarginMode = 'zero' | 'compact' | 'normal';
export type WorksheetPaperSize = 'A4' | 'A5';

export interface WorksheetOptions {
  sheetType: WorksheetType;
  schoolName: string;
  districtOffice: string;
  academicYear: string;
  showAnswerKey: boolean;
  showStudentBox: boolean;
  showEvaluationBox: boolean;
  showSignatures: boolean;
  showPoints: boolean;
  borderStyle: WorksheetBorderStyle;
  fontSize: WorksheetFontSize;
  instructionText: string;
  studentClassName?: string;
  designTheme?: WorksheetDesignTheme;
  pageOrientation?: PageOrientation;
  pageMode?: PageLayoutMode;
  marginMode?: WorksheetMarginMode;
  paperSize?: WorksheetPaperSize;
  customDate?: string;
  examSession?: string;
  totalScore?: string;
}

export const WORKSHEET_DESIGN_INFO: Record<
  WorksheetDesignTheme,
  { name: string; tag: string; description: string; previewBadge: string; icon: string }
> = {
  moeys_classic: {
    name: 'ផ្លូវការក្រសួង (MoEYS Classic)',
    tag: 'ស្តង់ដាររដ្ឋ',
    description: 'ក្បាលព្រះរាជាណាចក្រកម្ពុជា ស៊ុមទ្វេបុរាណ ហត្ថលេខា និងត្រាផ្លូវការ',
    previewBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: '🏛️',
  },
  modern_indigo: {
    name: 'ទំនើបប្រណិត (Modern Clean)',
    tag: 'សហសម័យ',
    description: 'រចនាបថស្អាតបាត កាតសំណួររៀបរយ អក្សរច្បាស់ៗ គម្លាតស្តង់ដារ',
    previewBadge: 'bg-purple-100 text-purple-900 border-purple-300',
    icon: '✨',
  },
  primary_friendly: {
    name: 'កុមារមេត្រីបឋម (Primary Playful)',
    tag: 'ថ្នាក់ទី១-៣',
    description: 'ស៊ុមចំនុចៗរួសរាយ រូបតំណាងផ្កាយ/សៀវភៅ បន្ទាត់សរសេរធំៗសមរម្យ',
    previewBadge: 'bg-teal-100 text-teal-900 border-teal-300',
    icon: '🌟',
  },
  pisa_academic: {
    name: 'វិញ្ញាសា PISA / ប្រឡងប្រជែង (PISA Exam)',
    tag: 'សមត្ថភាពវិភាគ',
    description: 'ប្រអប់ស្ថានភាពជាក់ស្តែង ស្លាកសមត្ថភាពវិភាគ តារាងពិន្ទុសង្ខេប',
    previewBadge: 'bg-rose-100 text-rose-900 border-rose-300',
    icon: '📊',
  },
};

export const WORKSHEET_TYPE_TITLES: Record<
  WorksheetType,
  { label: string; subLabel: string; badgeColor: string; icon: string; shortTag: string }
> = {
  worksheet: {
    label: 'សន្លឹកកិច្ចការស្វ័យសិក្សា',
    subLabel: 'កិច្ចការអនុវត្តចំណេះដឹងក្នុងថ្នាក់រៀន',
    badgeColor: 'bg-purple-100 text-purple-950 border-purple-300',
    icon: '📝',
    shortTag: 'ស្វ័យសិក្សា',
  },
  exam: {
    label: 'វិញ្ញាសាប្រឡងបញ្ចប់វគ្គ',
    subLabel: 'ការប្រឡងវាស់វែងសមត្ថភាពសិស្ស',
    badgeColor: 'bg-rose-100 text-rose-950 border-rose-300',
    icon: '📋',
    shortTag: 'ប្រឡងបញ្ចប់វគ្គ',
  },
  homework: {
    label: 'កិច្ចការស្វ័យសិក្សានៅផ្ទះ',
    subLabel: 'កិច្ចការស្រាវជ្រាវ និងពង្រឹងសមត្ថភាពបន្ថែម',
    badgeColor: 'bg-teal-100 text-teal-950 border-teal-300',
    icon: '🏠',
    shortTag: 'កិច្ចការផ្ទះ',
  },
  test: {
    label: 'តេស្តវាស់ស្ទង់សមត្ថភាពប្រចាំខែ',
    subLabel: 'ការវាយតម្លៃដំណើរការរៀនសូត្រ',
    badgeColor: 'bg-blue-100 text-blue-950 border-blue-300',
    icon: '📊',
    shortTag: 'តេស្តប្រចាំខែ',
  },
  exit_ticket: {
    label: 'សន្លឹកកិច្ចការវាយតម្លៃ (Exit Ticket)',
    subLabel: 'ការវាយតម្លៃការយល់ដឹងចុងម៉ោងសិក្សា',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    icon: '🎟️',
    shortTag: 'Exit Ticket',
  },
};

export const toKhmerNum = (num: number): string => {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return num
    .toString()
    .split('')
    .map((d) => khmerDigits[parseInt(d, 10)] ?? d)
    .join('');
};

export const KHMER_OPTION_LETTERS = ['ក', 'ខ', 'គ', 'ឃ', 'ង', 'ច'];

export function computeTwoPageSplitIndex(questions: QuizQuestion[]): number {
  if (questions.length <= 1) return questions.length;
  if (questions.length === 2) return 1;
  if (questions.length === 3) return 1;
  if (questions.length === 4) return 2;
  if (questions.length === 5) return 2;
  if (questions.length === 6) return 2;
  if (questions.length === 7) return 3;
  if (questions.length === 8) return 3;
  if (questions.length === 9) return 3;
  if (questions.length === 10) return 4;

  const getQuestionWeight = (q: QuizQuestion): number => {
    switch (q.type) {
      case 'pisa':
      case 'reading_comprehension':
        return 3.5;
      case 'essay':
        return 3.0;
      case 'matching':
        return 2.0;
      case 'fill_blank':
      case 'reorder_words':
      case 'short_answer':
      case 'multi_select':
        return 1.6;
      case 'qcm':
      case 'true_false':
      default:
        return 1.2;
    }
  };

  const weights = questions.map(getQuestionWeight);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  // Page 1 has Royal header + School info + Student box + Instruction box: ~6.5 units of fixed space
  // Page 2 has Mini header + Signatures: ~3.0 units of fixed space
  // Target: (6.5 + Page 1 Question Weight) ≈ (3.0 + Page 2 Question Weight)
  const targetPage1Weight = Math.max(weights[0], (totalWeight - 3.5) / 2);

  let currentWeight = 0;
  let splitIndex = 1;

  for (let i = 0; i < questions.length - 1; i++) {
    currentWeight += weights[i];
    if (currentWeight >= targetPage1Weight) {
      splitIndex = i + 1;
      break;
    }
  }

  return Math.max(1, Math.min(questions.length - 1, splitIndex));
}

interface WorksheetPaperViewProps {
  title: string;
  subject: string;
  grade: string;
  examDuration: string;
  teacherName: string;
  questions: QuizQuestion[];
  options: WorksheetOptions;
}

export const WorksheetPaperView: React.FC<WorksheetPaperViewProps> = ({
  title,
  subject,
  grade,
  examDuration,
  teacherName,
  questions,
  options,
}) => {
  const typeInfo = WORKSHEET_TYPE_TITLES[options.sheetType] || WORKSHEET_TYPE_TITLES.worksheet;
  const theme = options.designTheme || 'moeys_classic';
  const orientation = options.pageOrientation || 'portrait';
  const pageMode = options.pageMode || 'two_pages';
  const paperSize = options.paperSize || 'A4';
  const isA5 = paperSize === 'A5';

  const margin = options.marginMode || 'zero';

  // Font size classes (compact slightly for A5 booklet format)
  const fontClass = isA5
    ? options.fontSize === 'compact'
      ? 'text-[10px]'
      : options.fontSize === 'large'
      ? 'text-[12.5px]'
      : 'text-[11px]'
    : options.fontSize === 'compact'
    ? 'text-[11px]'
    : options.fontSize === 'large'
    ? 'text-[13.5px]'
    : 'text-[12px]';

  // Margin padding class
  const getPaddingClass = () => {
    switch (margin) {
      case 'normal':
        return 'p-5 sm:p-6 print:p-2';
      case 'compact':
        return 'p-3.5 sm:p-4 print:p-1';
      case 'zero':
      default:
        return 'p-2 sm:p-3 print:p-0';
    }
  };

  // Theme-specific styles
  const getThemeWrapperClass = () => {
    const pad = getPaddingClass();
    switch (theme) {
      case 'modern_indigo':
        return `border-2 border-indigo-300 rounded-xl bg-white shadow-xs ${pad}`;
      case 'primary_friendly':
        return `border-2 border-dashed border-teal-500 rounded-xl bg-[#fcfffd] shadow-xs ${pad}`;
      case 'pisa_academic':
        return `border-2 border-slate-800 rounded-lg bg-[#fdfdfb] shadow-xs ${pad}`;
      case 'moeys_classic':
      default:
        return `border-2 border-slate-900 bg-white shadow-xs ${pad}`;
    }
  };

  // Split questions for Two-Page Mode
  const isTwoPage = pageMode === 'two_pages' && questions.length > 1;
  const splitIndex = isTwoPage ? computeTwoPageSplitIndex(questions) : questions.length;
  const page1Questions = questions.slice(0, splitIndex);
  const page2Questions = isTwoPage ? questions.slice(splitIndex) : [];

  // Question renderer component helper
  const renderQuestionBlock = (q: QuizQuestion, qIndex: number) => {
    const qType: QuestionType = q.type || 'qcm';
    const khmerNum = toKhmerNum(qIndex + 1);

    return (
      <div
        key={q.id || qIndex}
        className={`space-y-2.5 pb-3.5 border-b border-dashed border-slate-200 last:border-b-0 print:border-slate-300 break-inside-avoid ${
          theme === 'modern_indigo' ? 'bg-slate-50/40 p-3 rounded-2xl border border-slate-200/80' : ''
        }`}
      >
        {/* Question Header & Title */}
        <div className="flex items-start gap-2">
          <div
            className={`inline-flex items-center justify-center font-moul text-xs px-2.5 py-0.5 rounded-lg shrink-0 print:bg-slate-900 print:text-white ${
              theme === 'primary_friendly'
                ? 'bg-teal-700 text-white rounded-full px-3'
                : theme === 'pisa_academic'
                ? 'bg-rose-900 text-white rounded-md'
                : theme === 'modern_indigo'
                ? 'bg-indigo-900 text-white rounded-lg'
                : 'bg-purple-950 text-white rounded-lg'
            }`}
          >
            {theme === 'primary_friendly' ? `⭐ សំណួរទី ${khmerNum}` : `សំណួរទី ${khmerNum}`}
          </div>
          <div className="flex-1 font-semibold text-slate-900 pt-0.5">
            <span>{q.question}</span>
            {options.showPoints && (
              <span className="ml-2 text-[10.5px] font-normal text-slate-500 print:text-slate-600">
                [ {(q.points ? q.points / 1000 : 1).toFixed(1)} ពិន្ទុ ]
              </span>
            )}
          </div>
        </div>

        {/* ---------------- 1. QCM Format ---------------- */}
        {qType === 'qcm' && (
          <div
            className={`grid ${
              isA5 && orientation === 'portrait' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
            } gap-2.5 pl-6 pt-1`}
          >
            {(q.options || []).map((opt, oIdx) => {
              const letter = KHMER_OPTION_LETTERS[oIdx] || String.fromCharCode(65 + oIdx);
              const isAnswer = options.showAnswerKey && opt.isCorrect;

              return (
                <div
                  key={oIdx}
                  className={`flex items-center gap-2.5 p-1.5 rounded-lg border transition ${
                    isAnswer
                      ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950 print:bg-emerald-50'
                      : 'border-transparent hover:border-slate-200'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isAnswer
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-400 text-slate-700'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="flex-1">
                    {letter}. {opt.text}
                  </span>
                  {isAnswer && (
                    <span className="text-[10px] text-emerald-700 font-bold">✔ ចម្លើយត្រឹមត្រូវ</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------- 2. True / False Format ---------------- */}
        {qType === 'true_false' && (
          <div className="flex items-center gap-8 pl-6 pt-1.5">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                options.showAnswerKey && q.isTrue
                  ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950'
                  : 'border-slate-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                  options.showAnswerKey && q.isTrue
                    ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                    : 'border-slate-400'
                }`}
              >
                {options.showAnswerKey && q.isTrue ? '✔' : ''}
              </span>
              <span>ត្រូវ (ពិត)</span>
            </div>

            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                options.showAnswerKey && !q.isTrue
                  ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950'
                  : 'border-slate-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                  options.showAnswerKey && !q.isTrue
                    ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                    : 'border-slate-400'
                }`}
              >
                {options.showAnswerKey && !q.isTrue ? '✔' : ''}
              </span>
              <span>ខុស (មិនពិត)</span>
            </div>
          </div>
        )}

        {/* ---------------- 3. Matching Pairs Format ---------------- */}
        {qType === 'matching' && (
          <div className="pl-6 pt-1">
            <table className="w-full border-collapse border border-slate-400 text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-bold">
                  <th className="border-r border-slate-400 p-2 text-left w-[42%]">
                    ជួរ ក (សំណួរ / ខ្លឹមសារ)
                  </th>
                  <th className="border-r border-slate-400 p-2 text-center w-[16%]">
                    ចម្លើយ
                  </th>
                  <th className="p-2 text-left w-[42%]">
                    ជួរ ខ (ធាតុផ្គូផ្គង)
                  </th>
                </tr>
              </thead>
              <tbody>
                {(q.matchingPairs || []).map((pair, pIdx) => {
                  const letterKhmer = KHMER_OPTION_LETTERS[pIdx] || String.fromCharCode(65 + pIdx);
                  return (
                    <tr key={pIdx} className="border-b border-slate-300 last:border-b-0 hover:bg-slate-50/50">
                      <td className="border-r border-slate-400 p-2 font-medium">
                        {toKhmerNum(pIdx + 1)}. {pair.left}
                      </td>
                      <td className="border-r border-slate-400 p-2 text-center font-bold">
                        {options.showAnswerKey ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-bold border border-emerald-300">
                            {toKhmerNum(pIdx + 1)} ➜ {letterKhmer}
                          </span>
                        ) : (
                          <span className="text-slate-400">[  .....  ]</span>
                        )}
                      </td>
                      <td className="p-2 font-medium">
                        {letterKhmer}. {pair.right}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="text-[10.5px] text-slate-500 italic mt-1 pl-1">
              * សិស្សអាចសរសេរអក្សរចម្លើយ (ក, ខ, គ, ឃ...) ក្នុងប្រអប់ចម្លើយ ឬគូសខ្សែភ្ជាប់រវាងជួរ ក និងជួរ ខ។
            </div>
          </div>
        )}

        {/* ---------------- 4. Fill in the Blanks Format ---------------- */}
        {qType === 'fill_blank' && (
          <div className="pl-6 pt-1 space-y-2">
            <div className="p-2.5 bg-amber-50/80 border border-dashed border-amber-300 rounded-xl">
              <span className="text-[10.5px] font-bold text-amber-900 block mb-1.5">
                ប្រអប់ពាក្យគន្លឹះសម្រាប់ជ្រើសរើសយកមកបំពេញ ៖
              </span>
              <div className="flex flex-wrap gap-2">
                {[q.blankAnswer, ...(q.blankDistractors || [])]
                  .filter(Boolean)
                  .map((w, wIdx) => (
                    <span
                      key={wIdx}
                      className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      [ {w} ]
                    </span>
                  ))}
              </div>
            </div>

            <div className="pt-1">
              {options.showAnswerKey ? (
                <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-xs">
                  <strong className="text-emerald-950 font-bold">ចម្លើយបំពេញត្រឹមត្រូវ ៖ </strong>
                  <span className="text-emerald-800 font-bold underline decoration-emerald-500">
                    {q.blankAnswer}
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-600">ចម្លើយសិស្ស ៖</div>
                  <div className="border-b-2 border-dotted border-slate-400 h-6"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- 5. Reorder Words Format ---------------- */}
        {qType === 'reorder_words' && (
          <div className="pl-6 pt-1 space-y-2">
            <div className="p-2.5 bg-teal-50/60 border border-teal-200 rounded-xl">
              <span className="text-[10.5px] font-bold text-teal-950 block mb-1.5">
                កម្រងពាក្យរាយប៉ាយ (ចូររៀបចំឱ្យក្លាយជាល្បះត្រឹមត្រូវ) ៖
              </span>
              <div className="flex flex-wrap gap-2">
                {(q.words || []).map((w, wIdx) => (
                  <span
                    key={wIdx}
                    className="px-3 py-1 bg-white border border-teal-300 text-teal-950 font-bold rounded-lg text-xs shadow-2xs"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {options.showAnswerKey ? (
              <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-xs">
                <strong className="text-emerald-950 font-bold">ល្បះត្រឹមត្រូវពេញលេញ ៖ </strong>
                <span className="text-emerald-800 font-bold">{q.correctSentence}</span>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] text-slate-600">ចម្លើយសិស្ស ៖</div>
                <div className="border-b border-dotted border-slate-400 h-5"></div>
                <div className="border-b border-dotted border-slate-400 h-5"></div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- 6. Short Answer Format ---------------- */}
        {qType === 'short_answer' && (
          <div className="pl-6 pt-1 space-y-2">
            {options.showAnswerKey ? (
              <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-xs">
                <strong className="text-emerald-950 font-bold">ចម្លើយត្រឹមត្រូវ ឬពាក្យគន្លឹះ ៖ </strong>
                <span className="text-emerald-800 font-bold">{q.correctAnswer || '(ចម្លើយខ្លី)'}</span>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] text-slate-600">ចម្លើយសិស្ស ៖</div>
                <div className="border-b border-dotted border-slate-400 h-6"></div>
                <div className="border-b border-dotted border-slate-400 h-6"></div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- 7. PISA Competency Format (NEW) ---------------- */}
        {qType === 'pisa' && (
          <div className="pl-6 pt-1 space-y-3">
            {/* PISA Context & Scenario Callout */}
            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-rose-200/80">
                <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
                  <Globe2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>បរិបទស្ថានភាពជាក់ស្តែង (PISA Real-World Scenario)</span>
                </div>
                <span className="px-2 py-0.5 bg-white border border-rose-300 text-rose-800 rounded-md text-[10px] font-bold">
                  ដែនសមត្ថភាព ៖{' '}
                  {q.pisaDomain === 'math'
                    ? 'គណិតវិទ្យា'
                    : q.pisaDomain === 'science'
                    ? 'វិទ្យាសាស្ត្រ'
                    : q.pisaDomain === 'reading'
                    ? 'អំណានយល់ន័យ'
                    : q.pisaDomain === 'financial'
                    ? 'ហិរញ្ញវត្ថុ'
                    : 'ការត្រិះរិះពិចារណា'}
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed italic bg-white/70 p-2.5 rounded-lg border border-rose-100">
                {q.pisaContext ||
                  'ស្ថានភាព៖ ក្នុងសហគមន៍មួយមានការប្រែប្រួលអាកាសធាតុ និងការប្រើប្រាស់ទឹកស្អាត... ចូរពិនិត្យទិន្នន័យខាងក្រោមដើម្បីដោះស្រាយបញ្ហា។'}
              </p>
            </div>

            {/* PISA Sub-Questions or Reasoning Answer Box */}
            {(q.pisaParts || q.pisaQuestionParts) && (q.pisaParts || q.pisaQuestionParts)!.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                {(q.pisaParts || q.pisaQuestionParts)!.map((part, pIdx) => {
                  const partLetter = KHMER_OPTION_LETTERS[pIdx] || String.fromCharCode(65 + pIdx);
                  return (
                    <div key={part.id || pIdx} className="space-y-1 bg-white/60 p-2 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>
                          {partLetter}. {part.prompt}
                        </span>
                        {part.points && (
                          <span className="text-[10px] text-slate-500 font-normal">
                            [ {part.points} ពិន្ទុ ]
                          </span>
                        )}
                      </div>
                      {options.showAnswerKey && part.sampleAnswer ? (
                        <div className="p-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded text-[11px]">
                          <strong>ចម្លើយ & ហេតុផល ៖</strong> {part.sampleAnswer}
                        </div>
                      ) : (
                        <div className="space-y-1.5 pt-1">
                          <div className="border-b border-dotted border-slate-400 h-5"></div>
                          <div className="border-b border-dotted border-slate-400 h-5"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                {options.showAnswerKey ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs">
                    <strong className="text-emerald-950 font-bold">ដំណោះស្រាយ និងការបកស្រាយបែបវិទ្យាសាស្ត្រ/គណិត ៖ </strong>
                    <p className="text-emerald-900 mt-1 font-medium">{q.correctAnswer || '(ចម្លើយវិភាគ PISA)'}</p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] text-slate-600 font-medium">ចម្លើយ និងការបកស្រាយហេតុផលរបស់សិស្ស ៖</div>
                    <div className="border-b border-dotted border-slate-400 h-6"></div>
                    <div className="border-b border-dotted border-slate-400 h-6"></div>
                    <div className="border-b border-dotted border-slate-400 h-6"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---------------- 8. Reading Comprehension Format (NEW) ---------------- */}
        {qType === 'reading_comprehension' && (
          <div className="pl-6 pt-1 space-y-3">
            {/* Passage Text Box */}
            <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-950 font-bold text-xs pb-1 border-b border-indigo-200/60">
                <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
                <span>អត្ថបទអំណាន ៖ {q.passageTitle || '« អត្ថបទខ្លីសម្រាប់អានយល់ន័យ »'}</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed indent-6 pt-1">
                {q.passageText ||
                  'កាលពីព្រេងនាយ មានកូនទន្សាយមួយមានប្រាជ្ញាឈ្លាសវៃ តែងតែជួយដោះស្រាយទុក្ខធុរៈសត្វនានាក្នុងព្រៃ...'}
              </p>
            </div>

            {/* Comprehension Sub-questions */}
            {q.passageQuestions && q.passageQuestions.length > 0 ? (
              <div className="space-y-2.5">
                {q.passageQuestions.map((pq, pqIdx) => {
                  const letter = KHMER_OPTION_LETTERS[pqIdx] || String.fromCharCode(65 + pqIdx);
                  return (
                    <div key={pq.id || pqIdx} className="space-y-1">
                      <div className="text-xs font-semibold text-slate-900">
                        {letter}. {pq.question}
                      </div>
                      {options.showAnswerKey && pq.answer ? (
                        <div className="p-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded text-[11px]">
                          <strong>ចម្លើយ ៖</strong> {pq.answer}
                        </div>
                      ) : (
                        <div className="space-y-1 pt-0.5">
                          <div className="border-b border-dotted border-slate-400 h-5"></div>
                          <div className="border-b border-dotted border-slate-400 h-5"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] text-slate-600">ចម្លើយសិស្ស ៖</div>
                <div className="border-b border-dotted border-slate-400 h-6"></div>
                <div className="border-b border-dotted border-slate-400 h-6"></div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- 9. Essay / Structured Open Response (NEW) ---------------- */}
        {qType === 'essay' && (
          <div className="pl-6 pt-1 space-y-2.5">
            {q.essayRubric && (
              <div className="p-2.5 bg-slate-100 border-l-4 border-slate-600 text-[11px] text-slate-700 rounded-r-lg">
                <strong>លក្ខណៈវិនិច្ឆ័យវាយតម្លៃ ៖</strong> {q.essayRubric}
              </div>
            )}

            {options.showAnswerKey ? (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs">
                <strong className="text-emerald-950 font-bold">គំនិតសំខាន់ៗ និងគន្លឹះតែងសេចក្តី ៖ </strong>
                <p className="text-emerald-900 mt-1">{q.correctAnswer || '(គំនិតពិចារណាគំរូ)'}</p>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] text-slate-600 font-medium">សំណេរឆ្លើយរបស់សិស្ស ៖</div>
                <div className="border-b border-dotted border-slate-400 h-6"></div>
                <div className="border-b border-dotted border-slate-400 h-6"></div>
                <div className="border-b border-dotted border-slate-400 h-6"></div>
                <div className="border-b border-dotted border-slate-400 h-6"></div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- 10. Multi-Select Checkbox Format (NEW) ---------------- */}
        {qType === 'multi_select' && (
          <div className="pl-6 pt-1 space-y-2">
            <div className="text-[10.5px] text-slate-500 italic">
              * សិស្សអាចគូសសញ្ញា [✔] ក្នុងប្រអប់ចម្លើយត្រឹមត្រូវទាំងអស់ (អាចមានលើសពីមួយ)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              {(q.options || []).map((opt, oIdx) => {
                const letter = KHMER_OPTION_LETTERS[oIdx] || String.fromCharCode(65 + oIdx);
                const isAnswer = options.showAnswerKey && opt.isCorrect;

                return (
                  <div
                    key={oIdx}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border ${
                      isAnswer
                        ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950'
                        : 'border-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                        isAnswer
                          ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                          : 'border-slate-400'
                      }`}
                    >
                      {isAnswer ? '✔' : ''}
                    </span>
                    <span className="flex-1 text-xs">
                      {letter}. {opt.text}
                    </span>
                    {isAnswer && (
                      <span className="text-[10px] text-emerald-700 font-bold">✔ ត្រូវ</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Explanation & Answer Key Rationale (When Show Answer Key is active) */}
        {options.showAnswerKey && q.explanation && (
          <div className="pl-6 pt-1">
            <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2 print:bg-amber-50">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 font-bold">💡 ការពន្យល់ & គន្លឹះដោះស្រាយ ៖ </strong>
                <span className="text-slate-800">{q.explanation}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Official Signatures Block Component customized by worksheet type
  const renderSignaturesBlock = () => {
    if (!options.showSignatures) return null;

    const formattedDate = options.customDate || 'ថ្ងៃទី ...... ខែ ...... ឆ្នាំ ២០២...';
    const shortDate = options.customDate || '...... / ...... / ២០២...';

    if (options.sheetType === 'exam') {
      return (
        <div className="pt-5 mt-5 border-t-2 border-slate-900 space-y-4 text-xs break-inside-avoid">
          <div className="text-center font-bold text-slate-800 text-[11px]">
            គណៈកម្មការរៀបចំ និងត្រួតពិនិត្យការប្រឡងបញ្ចប់វគ្គ
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Left: នាយកសាលា / ប្រធានមណ្ឌល */}
            <div className="text-center space-y-1">
              <div className="text-slate-700">បានឃើញ និងឯកភាព</div>
              <div className="font-moul text-[11px] text-slate-950">នាយកសាលា / ប្រធានមណ្ឌល</div>
              <div className="h-16 flex items-center justify-center">
                <div className="w-24 h-12 border border-dashed border-slate-400 rounded-lg flex items-center justify-center text-[9.5px] text-slate-400 italic">
                  ទីតាំងបោះត្រា
                </div>
              </div>
              <div className="text-slate-400 text-[10px]">................................................</div>
            </div>

            {/* Right: គណៈកម្មការរៀបចំវិញ្ញាសា / គ្រូបង្រៀន */}
            <div className="text-center space-y-1">
              <div className="text-slate-700">{formattedDate}</div>
              <div className="font-moul text-[11px] text-rose-950">គណៈកម្មការរៀបចំវិញ្ញាសា</div>
              <div className="h-14 flex items-end justify-center text-[10px] text-slate-400 italic">
                (ហត្ថលេខា និងឈ្មោះ)
              </div>
              <div className="font-bold text-slate-950 text-xs pt-1">{teacherName}</div>
            </div>
          </div>
        </div>
      );
    }

    if (options.sheetType === 'homework') {
      return (
        <div className="pt-5 mt-5 border-t-2 border-teal-700 space-y-3 text-xs break-inside-avoid">
          <div className="text-center font-bold text-teal-950 text-[11px]">
            ការបញ្ជាក់ និងការវាយតម្លៃកិច្ចការស្វ័យសិក្សានៅផ្ទះ
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Left: មាតាបិតា ឬអាណាព្យាបាលសិស្ស */}
            <div className="text-center space-y-1 p-2.5 bg-teal-50/40 rounded-xl border border-teal-200">
              <div className="font-bold text-teal-950 text-[11px]">ហត្ថលេខាមាតាបិតា / អាណាព្យាបាល</div>
              <div className="text-[10px] text-teal-800 italic">« ខ្ញុំបានពិនិត្យ និងតាមដានការធ្វើកិច្ចការរបស់កូនរួចរាល់ »</div>
              <div className="h-12 flex items-end justify-center text-[10px] text-slate-400 italic">
                (ហត្ថលេខា ឬស្នាមមេដៃ)
              </div>
              <div className="text-slate-400 text-[10px]">កាលបរិច្ឆេទ ៖ {shortDate}</div>
            </div>

            {/* Right: គ្រូបង្រៀនប្រចាំថ្នាក់ */}
            <div className="text-center space-y-1 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-moul text-[11px] text-purple-950">គ្រូបង្រៀនប្រចាំថ្នាក់</div>
              <div className="text-[10px] text-slate-600">{formattedDate}</div>
              <div className="h-12 flex items-end justify-center text-[10px] text-slate-400 italic">
                (ហត្ថលេខា និងពិន្ទុកែ)
              </div>
              <div className="font-bold text-slate-950 text-xs">{teacherName}</div>
            </div>
          </div>
        </div>
      );
    }

    if (options.sheetType === 'test') {
      return (
        <div className="pt-5 mt-5 border-t-2 border-blue-900 space-y-3 text-xs break-inside-avoid">
          <div className="grid grid-cols-2 gap-4">
            {/* Left: នាយកសាលា */}
            <div className="text-center space-y-1">
              <div className="text-slate-700">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</div>
              <div className="font-moul text-[11px] text-slate-950">នាយកសាលា</div>
              <div className="h-14 flex items-center justify-center">
                <div className="w-24 h-10 border border-dashed border-slate-400 rounded-lg flex items-center justify-center text-[9px] text-slate-400 italic">
                  ទីតាំងបោះត្រា
                </div>
              </div>
              <div className="text-slate-400 text-[10px]">................................................</div>
            </div>

            {/* Right: គ្រូបង្រៀនទទួលបន្ទុកវាយតម្លៃ */}
            <div className="text-center space-y-1">
              <div className="text-slate-700">{formattedDate}</div>
              <div className="font-moul text-[11px] text-blue-950">គ្រូទទួលបន្ទុកវាយតម្លៃសមត្ថភាព</div>
              <div className="h-14 flex items-end justify-center text-[10px] text-slate-400 italic">
                (ហត្ថលេខា)
              </div>
              <div className="font-bold text-slate-950 text-xs pt-1">{teacherName}</div>
            </div>
          </div>
        </div>
      );
    }

    if (options.sheetType === 'exit_ticket') {
      return (
        <div className="pt-4 mt-4 border-t-2 border-dashed border-amber-300 flex items-center justify-between text-xs break-inside-avoid bg-amber-50/50 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-base">🎟️</span>
            <div>
              <div className="font-bold text-amber-950 text-[11px]">ការទទួលស្គាល់សន្លឹក Exit Ticket</div>
              <div className="text-[10px] text-amber-800">សិស្សបានឆ្លើយ និងប្រគល់ជូនគ្រូមុនពេលចេញពីថ្នាក់រៀន</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-slate-800 text-[11px]">គ្រូបង្រៀន ៖ {teacherName}</div>
            <div className="text-[10px] text-slate-500">កាលបរិច្ឆេទ ៖ {shortDate}</div>
          </div>
        </div>
      );
    }

    // Default: worksheet
    return (
      <div className="pt-5 mt-5 border-t-2 border-slate-900 space-y-5 text-xs break-inside-avoid">
        <div className="flex justify-between items-start">
          {/* Left: នាយកសាលា */}
          <div className="text-center w-56 space-y-1">
            <div className="text-slate-700">បានឃើញ និងឯកភាព</div>
            <div className="font-moul text-[11px] text-slate-950">នាយកសាលា</div>
            <div className="h-14 flex items-center justify-center">
              <div className="w-22 h-10 border border-dashed border-slate-400 rounded-lg flex items-center justify-center text-[9px] text-slate-400 italic">
                ទីតាំងបោះត្រា
              </div>
            </div>
            <div className="text-slate-400 text-[10px]">................................................</div>
          </div>

          {/* Right: គ្រូបង្រៀនប្រចាំថ្នាក់ */}
          <div className="text-center w-56 space-y-1">
            <div className="text-slate-700">{formattedDate}</div>
            <div className="font-moul text-[11px] text-purple-950">គ្រូបង្រៀនប្រចាំថ្នាក់</div>
            <div className="h-14 flex items-end justify-center text-[10px] text-slate-400 italic">
              (ហត្ថលេខា)
            </div>
            <div className="font-bold text-slate-950 text-xs pt-1">{teacherName}</div>
          </div>
        </div>
      </div>
    );
  };

  // Header Component customized by worksheet type
  const renderHeaderByType = () => {
    if (options.sheetType === 'exam') {
      return (
        <div className="pb-3 mb-3 border-b-2 border-slate-900 space-y-2">
          {/* Royal Motto Header */}
          <div className="text-center space-y-1">
            <h1 className="font-moul text-sm sm:text-base text-slate-950 tracking-wide">
              ព្រះរាជាណាចក្រកម្ពុជា
            </h1>
            <h2 className="font-moul text-xs sm:text-sm text-slate-900">
              ជាតិ សាសនា ព្រះមហាក្សត្រ
            </h2>
            <div className="text-[11px] font-bold text-slate-700 tracking-widest pt-0.5">
              — ༺ ៚ ༻ —
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200">
            <div>
              <div className="font-semibold text-slate-800">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
              <div className="text-[11px] text-slate-600">{options.districtOffice || 'ការិយាល័យអប់រំ យុវជន និងកីឡា'}</div>
              <div className="font-moul text-xs text-rose-950 pt-0.5">
                {options.schoolName || 'វិទ្យាល័យ / សាលាបឋមសិក្សាគំរូ'}
              </div>
            </div>
            <div className="sm:text-right space-y-1 text-[11px]">
              <div className="font-bold text-rose-950 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded inline-block">
                សម័យប្រឡង ៖ {options.examSession || options.customDate || 'ថ្ងៃទី ...... ខែ ...... ឆ្នាំ ២០២...'}
              </div>
              <div className="text-slate-600">
                មណ្ឌលប្រឡង ៖ <strong className="text-slate-900">{options.schoolName || 'សាលារៀន'}</strong>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (options.sheetType === 'homework') {
      return (
        <div className="pb-3 mb-3 border-b-2 border-teal-700 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-[11px] text-teal-800 font-semibold flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-teal-600" />
                <span>កម្មវិធីពង្រឹងការសិក្សាស្វ័យសិក្សានៅផ្ទះ • {options.districtOffice || 'ការិយាល័យអប់រំ'}</span>
              </div>
              <div className="font-moul text-xs sm:text-sm text-teal-950 pt-0.5">
                {options.schoolName || 'សាលារៀនគំរូ'}
              </div>
            </div>
            <div className="sm:text-right bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl text-[11px] space-y-0.5">
              <div className="font-bold text-teal-950">កាលបរិច្ឆេទប្រគល់កិច្ចការ (Due Date)</div>
              <div className="text-teal-800">{options.customDate || 'ថ្ងៃទី ...... ខែ ...... ឆ្នាំ ២០២...'}</div>
            </div>
          </div>
        </div>
      );
    }

    if (options.sheetType === 'test') {
      return (
        <div className="pb-3 mb-3 border-b-2 border-blue-900 space-y-2">
          <div className="text-center space-y-0.5 pb-1">
            <h1 className="font-moul text-xs sm:text-sm text-slate-950">ព្រះរាជាណាចក្រកម្ពុជា</h1>
            <h2 className="font-moul text-[11px] text-slate-800">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1 border-t border-slate-200">
            <div>
              <div className="font-semibold text-slate-800">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
              <div className="font-moul text-xs text-blue-950">{options.schoolName || 'សាលារៀន'}</div>
            </div>
            <div className="sm:text-right bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg text-[11px] text-blue-950 font-bold">
              តេស្តប្រចាំខែ ៖ .................... • ឆ្នាំសិក្សា ៖ ២០២...-២០២...
            </div>
          </div>
        </div>
      );
    }

    if (options.sheetType === 'exit_ticket') {
      return (
        <div className="pb-2.5 mb-3 border-b-2 border-dashed border-amber-400 space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-xs">
                🎟️
              </div>
              <div>
                <div className="font-moul text-xs sm:text-sm text-amber-950">
                  សន្លឹកកិច្ចការវាយតម្លៃចុងម៉ោង (Exit Ticket)
                </div>
                <div className="text-[10.5px] text-amber-800 font-medium">
                  {options.schoolName || 'សាលារៀន'} • គ្រូបង្រៀន ៖ {teacherName}
                </div>
              </div>
            </div>
            <div className="text-[11px] bg-amber-100/70 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-lg font-bold">
              ⏱️ ថិរវេលាឆ្លើយ ៖ ៥ ទៅ ១០ នាទី
            </div>
          </div>
        </div>
      );
    }

    // Default: worksheet
    return (
      <div className="text-center space-y-1 pb-3 mb-3 border-b-2 border-slate-900">
        <h1 className="font-moul text-sm sm:text-base text-slate-950 tracking-wide">
          ព្រះរាជាណាចក្រកម្ពុជា
        </h1>
        <h2 className="font-moul text-xs sm:text-sm text-slate-900">
          ជាតិ សាសនា ព្រះមហាក្សត្រ
        </h2>
        <div className="text-[11px] font-bold text-slate-700 tracking-widest pt-0.5">
          — ༺ ៚ ༻ —
        </div>

        <div className="text-left pt-2 text-xs space-y-0.5">
          <div className="font-semibold text-slate-800">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
          <div className="text-[11px] text-slate-600">{options.districtOffice || 'ការិយាល័យអប់រំ យុវជន និងកីឡា'}</div>
          <div className="font-moul text-xs text-purple-950 pt-0.5">
            {options.schoolName || 'សាលាបឋមសិក្សាគំរូ'}
          </div>
        </div>
      </div>
    );
  };

  // Title Banner Component customized by worksheet type
  const renderTitleBannerByType = () => {
    return (
      <div className="text-center space-y-1.5 my-3">
        <div
          className={`inline-block px-4 py-1 rounded-full text-[11px] font-bold tracking-wide border ${
            options.sheetType === 'exit_ticket'
              ? 'bg-amber-50 text-amber-950 border-amber-300'
              : options.sheetType === 'exam'
              ? 'bg-rose-50 text-rose-950 border-rose-300'
              : options.sheetType === 'homework'
              ? 'bg-teal-50 text-teal-950 border-teal-300'
              : options.sheetType === 'test'
              ? 'bg-blue-50 text-blue-950 border-blue-300'
              : 'bg-purple-50 text-purple-900 border-purple-200'
          }`}
        >
          {typeInfo.label}
        </div>
        <h2 className="font-moul text-sm sm:text-base text-slate-950 px-4">
          {title || 'វិញ្ញាសាប្រឡង ឬកិច្ចការស្វ័យសិក្សា'}
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-[11px] font-semibold text-slate-700 pt-1">
          <span className="px-2.5 py-0.5 bg-slate-100 rounded-md border border-slate-200">
            មុខវិជ្ជា ៖ <strong className="text-purple-950">{subject}</strong>
          </span>
          <span>•</span>
          <span className="px-2.5 py-0.5 bg-slate-100 rounded-md border border-slate-200">
            កម្រិត ៖ <strong className="text-slate-950">{grade}</strong>
          </span>
          <span>•</span>
          <span className="px-2.5 py-0.5 bg-slate-100 rounded-md border border-slate-200">
            ថិរវេលា ៖ <strong className="text-slate-950">{examDuration}</strong>
          </span>
          {options.showPoints && (
            <>
              <span>•</span>
              <span className="px-2.5 py-0.5 bg-amber-50 rounded-md border border-amber-200 text-amber-900">
                ពិន្ទុសរុប ៖ <strong>{options.totalScore || '១០ ពិន្ទុ'}</strong>
              </span>
            </>
          )}
        </div>

        {/* Sub-Banner / Motto by Sheet Type */}
        {options.sheetType === 'worksheet' && (
          <div className="text-[11px] text-purple-900 italic pt-0.5">
            🎯 <strong>វត្ថុបំណង ៖</strong> អនុវត្តចំណេះដឹង បណ្តុះការត្រិះរិះ និងពង្រឹងសមត្ថភាពស្វ័យសិក្សាលើមេរៀននេះ
          </div>
        )}
        {options.sheetType === 'exam' && (
          <div className="text-[10.5px] text-rose-900 bg-rose-50/70 border border-rose-200 py-0.5 px-3 rounded-lg mx-auto inline-block font-semibold">
            ⚠️ វិញ្ញាសាប្រឡងផ្លូវការ ៖ សូមគោរពបទបញ្ជាប្រឡង និងបំពេញចម្លើយឱ្យបានត្រឹមត្រូវ
          </div>
        )}
        {options.sheetType === 'homework' && (
          <div className="text-[11px] text-teal-800 italic pt-0.5">
            🏡 <strong>ការណែនាំ ៖</strong> សិស្សត្រូវបំពេញកិច្ចការនេះនៅផ្ទះ និងប្រគល់ជូនគ្រូវិញឱ្យបានទាន់ពេលវេលា
          </div>
        )}
        {options.sheetType === 'test' && (
          <div className="text-[11px] text-blue-900 italic pt-0.5">
            📈 <strong>គោលបំណងតេស្ត ៖</strong> វាស់ស្ទង់កម្រិតការយល់ដឹង និងសមត្ថភាពដោះស្រាយបញ្ហារបស់សិស្សប្រចាំខែ
          </div>
        )}
        {options.sheetType === 'exit_ticket' && (
          <div className="text-[11px] text-amber-900 italic pt-0.5">
            ⏱️ <strong>Exit Ticket ៖</strong> សូមឆ្លើយសំណួរខាងក្រោមឱ្យបានរហ័ស និងច្បាស់លាស់ មុនពេលបញ្ចប់ម៉ោង
          </div>
        )}
      </div>
    );
  };

  // Student Box Component customized by worksheet type
  const renderStudentBoxByType = () => {
    if (!options.showStudentBox) return null;

    if (options.sheetType === 'exam') {
      return (
        <div className="my-3 border-2 border-slate-900 rounded-xl overflow-hidden text-xs bg-slate-50/40 break-inside-avoid">
          <div className="bg-slate-900 text-white px-3 py-1 text-[10.5px] font-bold flex justify-between items-center">
            <span>សន្លឹកកិច្ចការប្រឡងផ្លូវការ (Official Candidate Examination Slip)</span>
            <span className="text-rose-300 font-normal">ហាមហែក ឬគូសវាសក្រៅពីចម្លើយ</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Left: Candidate Info */}
            <div className="md:col-span-7 p-2.5 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="whitespace-nowrap">ឈ្មោះបេក្ខជន ៖ ............................................................</span>
                <span className="whitespace-nowrap font-medium">ភេទ ៖ [  ] ប្រុស [  ] ស្រី</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="whitespace-nowrap">ថ្ងៃខែឆ្នាំកំណើត ៖ ...... / ...... / ..........</span>
                <span className="whitespace-nowrap">អត្តលេខ ៖ ....................</span>
                <span className="whitespace-nowrap">ថ្នាក់ ៖ <strong>{grade}</strong></span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="whitespace-nowrap">បន្ទប់ប្រឡងលេខ ៖ ............</span>
                <span className="whitespace-nowrap">តុលេខ ៖ ............</span>
                <span className="whitespace-nowrap">ហត្ថលេខាបេក្ខជន ៖ ....................</span>
              </div>
            </div>

            {/* Right: Supervisor & Grading Panel */}
            <div className="md:col-span-5 p-2 bg-white flex flex-col justify-between space-y-1 text-[10.5px]">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1 text-slate-700">
                <span>អនុរក្សទី១ ៖ ....................</span>
                <span>អនុរក្សទី២ ៖ ....................</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-center py-0.5">
                <div className="border-r border-slate-200 pr-1">
                  <div className="text-[9.5px] text-slate-500 font-bold uppercase">ពិន្ទុជាលេខ</div>
                  <div className="text-base font-bold text-rose-950 mt-0.5">........ / ១០</div>
                </div>
                <div>
                  <div className="text-[9.5px] text-slate-500 font-bold uppercase">និទ្ទេស</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">A • B • C • D • E • F</div>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-1 flex justify-between items-center text-[10px] text-slate-600">
                <span>ពិន្ទុជាអក្សរ ៖ .................................</span>
                <span>ហត្ថលេខាអ្នកកែ ៖ .........</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (options.sheetType === 'homework') {
      return (
        <div className="my-3 border-2 border-teal-700 rounded-xl overflow-hidden text-xs bg-teal-50/20 break-inside-avoid">
          <div className="bg-teal-700 text-white px-3 py-1 text-[10.5px] font-bold flex justify-between items-center">
            <span>🏠 ព័ត៌មានកិច្ចការផ្ទះ & ការតាមដានរបស់អាណាព្យាបាល</span>
            <span className="text-teal-200 font-normal">សហការរវាងគ្រូ និងមាតាបិតា</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-teal-700">
            {/* Left: Student & Timeline */}
            <div className="md:col-span-7 p-2.5 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="whitespace-nowrap">ឈ្មោះសិស្ស ៖ ............................................................</span>
                <span className="whitespace-nowrap">ថ្នាក់ ៖ <strong>{grade}</strong></span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
                <span>ថ្ងៃដាក់កិច្ចការ ៖ ...... / ...... / ២០២...</span>
                <span className="font-bold text-teal-900">ថ្ងៃកំណត់ប្រគល់ (Due) ៖ ...... / ...... / ២០២...</span>
              </div>
              <div className="text-[10.5px] text-slate-600 flex items-center gap-2 pt-0.5">
                <span>ពេលវេលាសិស្សចំណាយ ៖</span>
                <span className="font-medium">[  ] &lt; ៣០នាទី</span>
                <span className="font-medium">[  ] ៣០-៦០នាទី</span>
                <span className="font-medium">[  ] &gt; ១ម៉ោង</span>
              </div>
            </div>

            {/* Right: Parent Review & Teacher Score */}
            <div className="md:col-span-5 p-2 bg-white flex flex-col justify-between space-y-1 text-[10.5px]">
              <div className="font-bold text-teal-950 flex items-center justify-between">
                <span>👨‍👩‍👧‍👦 ការចូលរួមរបស់អាណាព្យាបាល ៖</span>
                <span className="text-[10px] text-slate-500 font-normal">ពិន្ទុ ៖ ..... / ១០</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-700">
                <span>[  ] ធ្វើដោយខ្លួនឯង</span>
                <span>[  ] មានជំនួយខ្លះៗ</span>
                <span>[  ] ពិបាកយល់</span>
              </div>
              <div className="border-t border-slate-200 pt-1 text-[10px] text-slate-600">
                <div>មតិមាតាបិតា ៖ ................................................................</div>
                <div className="flex justify-between items-center pt-0.5">
                  <span>ហត្ថលេខាមាតាបិតា ៖ ..................</span>
                  <span>ហត្ថលេខាគ្រូ ៖ ..................</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (options.sheetType === 'test') {
      return (
        <div className="my-3 border-2 border-blue-900 rounded-xl overflow-hidden text-xs bg-blue-50/20 break-inside-avoid">
          <div className="bg-blue-900 text-white px-3 py-1 text-[10.5px] font-bold flex justify-between items-center">
            <span>📊 ការវាស់ស្ទង់សមត្ថភាពប្រចាំខែ និងក្រឹត្យវាយតម្លៃ ៤ កម្រិត</span>
            <span className="text-blue-200 font-normal">MoEYS Competency Framework</span>
          </div>
          <div className="p-2.5 space-y-2">
            {/* Row 1: Student info & Quick score */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-1.5">
              <div className="flex items-center gap-4">
                <span>ឈ្មោះសិស្ស ៖ ............................................................</span>
                <span>អត្តលេខ ៖ ....................</span>
                <span>ថ្នាក់ ៖ <strong>{grade}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-950 bg-blue-100 px-2 py-0.5 rounded">
                  ពិន្ទុទទួលបាន ៖ ........ / ១០
                </span>
                <span className="font-bold text-slate-700">
                  និទ្ទេស ៖ A • B • C • D • E
                </span>
              </div>
            </div>

            {/* Row 2: 4-Level Competency Rubric */}
            <div className="text-[10px] space-y-1">
              <div className="font-bold text-slate-700">តារាងកម្រិតសមត្ថភាពសម្រេចបាន (សូមគ្រូ ឬសិស្សគូសធីក [ ✔ ]) ៖</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px]">
                <div className="p-1 rounded bg-white border border-emerald-200 text-emerald-950">
                  <div className="font-bold">[  ] 🌟 កម្រិត ៤ (ល្អប្រសើរ)</div>
                  <div className="text-[9px] text-slate-500">ពិន្ទុ ៩-១០ • យល់ស៊ីជម្រៅ</div>
                </div>
                <div className="p-1 rounded bg-white border border-blue-200 text-blue-950">
                  <div className="font-bold">[  ] 🟢 កម្រិត ៣ (ល្អ)</div>
                  <div className="text-[9px] text-slate-500">ពិន្ទុ ៧-៨ • មូលដ្ឋានរឹងមាំ</div>
                </div>
                <div className="p-1 rounded bg-white border border-amber-200 text-amber-950">
                  <div className="font-bold">[  ] 🟡 កម្រិត ២ (មធ្យម)</div>
                  <div className="text-[9px] text-slate-500">ពិន្ទុ ៥-៦ • ត្រូវការជួយខ្លះៗ</div>
                </div>
                <div className="p-1 rounded bg-white border border-rose-200 text-rose-950">
                  <div className="font-bold">[  ] 🔴 កម្រិត ១ (ត្រូវកែលម្អ)</div>
                  <div className="text-[9px] text-slate-500">ពិន្ទុ &lt; ៥ • ត្រូវការបំប៉ន</div>
                </div>
              </div>
            </div>

            {/* Row 3: Teacher recommendation */}
            <div className="text-[10.5px] text-slate-600 border-t border-slate-200 pt-1 flex justify-between items-center">
              <span>អនុសាសន៍គរុកោសល្យរបស់គ្រូ ៖ ....................................................................................................</span>
              <span className="font-semibold text-slate-800 shrink-0">គ្រូបង្រៀន ៖ {teacherName}</span>
            </div>
          </div>
        </div>
      );
    }

    if (options.sheetType === 'exit_ticket') {
      return (
        <div className="my-2.5 border-2 border-dashed border-amber-400 rounded-xl p-2.5 bg-amber-50/30 text-xs break-inside-avoid">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left: Compact Student Info */}
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span>ឈ្មោះសិស្ស ៖ ............................................................</span>
                <span>ថ្នាក់ ៖ <strong>{grade}</strong></span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-600">
                <span>កាលបរិច្ឆេទ ៖ ...... / ...... / ២០២...</span>
                <span>គ្រូបង្រៀន ៖ <strong className="text-amber-950">{teacherName}</strong></span>
                <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                  ពិន្ទុរហ័ស ៖ ....... / ១០
                </span>
              </div>
            </div>

            {/* Right: Understanding Self-Gauge */}
            <div className="md:border-l-2 md:border-dashed md:border-amber-300 md:pl-3 space-y-1 shrink-0">
              <div className="text-[10.5px] font-bold text-amber-950">
                💭 កម្រិតនៃការយល់ដឹងថ្ងៃនេះ ៖
              </div>
              <div className="flex items-center gap-2 text-[10.5px]">
                <span className="px-2 py-0.5 bg-white border border-emerald-300 rounded font-medium text-emerald-900 cursor-default">
                  [  ] 😊 យល់ច្បាស់
                </span>
                <span className="px-2 py-0.5 bg-white border border-amber-300 rounded font-medium text-amber-950 cursor-default">
                  [  ] 🤔 យល់ខ្លះៗ
                </span>
                <span className="px-2 py-0.5 bg-white border border-rose-300 rounded font-medium text-rose-950 cursor-default">
                  [  ] ❓ នៅតែឆ្ងល់
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default: worksheet
    return (
      <div className="my-3.5 border-2 border-slate-800 rounded-xl overflow-hidden text-xs bg-slate-50/40 break-inside-avoid">
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="md:col-span-7 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="whitespace-nowrap">ឈ្មោះសិស្ស ៖ ............................................................</span>
              <span className="whitespace-nowrap">ភេទ ៖ [  ] ប្រុស [  ] ស្រី</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="whitespace-nowrap">លេខរៀង/តុ ៖ ....................</span>
              <span className="whitespace-nowrap">ក្រុមលេខ ៖ ....................</span>
              <span className="whitespace-nowrap">ថ្នាក់ ៖ <strong>{grade}</strong></span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
              <span>វិធីសាស្ត្រវាយតម្លៃ ៖ [  ] ស្វ័យវាយតម្លៃ  [  ] មិត្តរួមថ្នាក់  [  ] គ្រូ</span>
              <span>កាលបរិច្ឆេទ ៖ ...... / ...... / ២០២...</span>
            </div>
          </div>

          {options.showEvaluationBox ? (
            <div className="md:col-span-5 p-2 bg-white flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-1 text-center border-b border-slate-300 pb-1.5">
                <div className="border-r border-slate-300 pr-1">
                  <div className="text-[10px] text-slate-500 font-bold">ពិន្ទុទទួលបាន</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    ........ / ១០
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">និទ្ទេស</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    A • B • C • D • E • F
                  </div>
                </div>
              </div>
              <div className="pt-1.5 text-[10.5px]">
                <div className="text-slate-600">មូលវិចារណ៍គ្រូ ៖ .............................................</div>
                <div className="text-right text-[10px] text-slate-400 mt-0.5">ចំណាត់ថ្នាក់ ៖ លេខ ......</div>
              </div>
            </div>
          ) : (
            <div className="md:col-span-5 p-3 flex items-center justify-center font-bold text-sm text-purple-950">
              ពិន្ទុសរុប ៖ .............. / ១០
            </div>
          )}
        </div>
      </div>
    );
  };

  // Special section customized by worksheet type (e.g., Reflection box for Exit Ticket)
  const renderSpecialSectionByType = () => {
    if (options.sheetType === 'exit_ticket') {
      return (
        <div className="my-3 p-3 bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-xl text-xs space-y-2 break-inside-avoid">
          <div className="font-bold text-amber-950 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>ការឆ្លុះបញ្ចាំង និងវាយតម្លៃការយល់ដឹងផ្ទាល់ខ្លួន (Student Reflection)</span>
            </span>
            <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-950">
              Exit Ticket Check
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-800 font-semibold">💡 អ្វីដែលខ្ញុំយល់ច្បាស់ ឬចូលចិត្តជាងគេក្នុងម៉ោងនេះ ៖</span>
              <div className="border-b border-dotted border-slate-400 mt-1 h-4"></div>
            </div>
            <div>
              <span className="text-slate-800 font-semibold">❓ ចំណុច ឬសំណួរដែលខ្ញុំនៅតែឆ្ងល់ និងចង់ឱ្យគ្រូពន្យល់បន្ថែម ៖</span>
              <div className="border-b border-dotted border-slate-400 mt-1 h-4"></div>
            </div>
          </div>
          <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[10.5px]">
            <span className="text-slate-700 font-semibold">ត្រាវាយតម្លៃឆ្លងកាត់របស់គ្រូ ៖</span>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-800 rounded font-bold">
                [ ✔ ] ឆ្លងកាត់ / យល់ច្បាស់
              </span>
              <span className="px-2 py-0.5 bg-white border border-amber-300 text-amber-900 rounded font-bold">
                [   ] ត្រូវពន្យល់ឡើងវិញ
              </span>
              <span className="text-slate-500">ហត្ថលេខាគ្រូ ៖ ............</span>
            </div>
          </div>
        </div>
      );
    }

    if (options.sheetType === 'exam') {
      return (
        <div className="my-2.5 px-3 py-1.5 bg-rose-50/80 border-l-4 border-rose-600 rounded-r-lg text-[10.5px] text-rose-950 flex items-center gap-2 break-inside-avoid">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            <strong>បម្រាមប្រឡងផ្លូវការ ៖</strong> បេក្ខជនមិនត្រូវលួចចម្លង ប្រើប្រាស់ឯកសារជំនួយ ឬឧបករណ៍អេឡិចត្រូនិចក្នុងបន្ទប់ប្រឡងជាដាច់ខាត។ ការបំពាននឹងទទួលវិន័យតាមបទបញ្ជាផ្ទៃក្នុង។
          </span>
        </div>
      );
    }

    if (options.sheetType === 'homework') {
      return (
        <div className="my-2 px-3 py-1.5 bg-teal-50 border-l-4 border-teal-600 rounded-r-lg text-[10.5px] text-teal-950 flex items-center justify-between gap-2 break-inside-avoid">
          <div className="flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span>« ការស្វ័យសិក្សាជាប់លាប់នៅផ្ទះ ជួយកសាងទម្លាប់រៀនសូត្រពេញមួយជីវិត »</span>
          </div>
          <span className="font-bold text-[10px] text-teal-800">សូមប្រគល់កិច្ចការឱ្យទាន់ថ្ងៃកំណត់!</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      id="worksheet-paper-container"
      className={`mx-auto ${getThemeWrapperClass()} ${
        isA5
          ? orientation === 'landscape'
            ? 'max-w-3xl'
            : 'max-w-xl'
          : orientation === 'landscape'
          ? 'max-w-5xl'
          : 'max-w-3xl'
      } text-slate-900 transition-all font-sans leading-relaxed relative print:shadow-none print:border-slate-800 print:m-0 print:max-w-none print:w-full`}
      style={{
        fontFamily: "'Kantumruy Pro', 'Siemreap', 'Battambang', sans-serif",
      }}
    >
      {/* Answer Key Watermark Badge */}
      {options.showAnswerKey && (
        <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-2 rounded-xl flex items-center justify-between text-xs font-bold print:border-emerald-600 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>សន្លឹកកិច្ចការនេះជា «សន្លឹកចម្លើយគំរូ & កំណែ» សម្រាប់គ្រូបង្រៀន (Teacher Edition / Answer Key)</span>
          </div>
          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
            Answer Key
          </span>
        </div>
      )}

      {/* =========================================================================
          PAGE 1 (ទំព័រទី ១)
          ========================================================================= */}
      <div className="worksheet-page worksheet-page-1">
        {/* Customized Header by Sheet Type */}
        {renderHeaderByType()}

        {/* Customized Title Banner by Sheet Type */}
        {renderTitleBannerByType()}

        {/* Customized Student Information & Score Evaluation Box */}
        {renderStudentBoxByType()}

        {/* Instructions */}
        {options.instructionText && (
          <div className="my-2.5 px-3.5 py-1.5 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-lg text-[11px] text-amber-950 italic flex items-center gap-2">
            <Bookmark className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>ការណែនាំ ៖</strong> {options.instructionText}
            </span>
          </div>
        )}

        {/* Page 1 Questions */}
        <div
          className={`space-y-4 pt-2 ${fontClass} ${
            orientation === 'landscape' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''
          }`}
        >
          {page1Questions.map((q, idx) => renderQuestionBlock(q, idx))}
        </div>

        {/* Special Section if single page or exit ticket */}
        {!isTwoPage && renderSpecialSectionByType()}

        {/* Page 1 Footer */}
        {isTwoPage && (
          <div className="mt-6 pt-3 border-t border-slate-300 text-center text-[10.5px] text-slate-600 font-medium flex justify-between items-center print:border-slate-400">
            <span>ទំព័រទី ១ នៃ ២</span>
            <span className="italic text-purple-950 font-bold">➔ សូមបន្តទៅទំព័រទី ២ ខាងក្រោយ</span>
            <span>{subject} {grade}</span>
          </div>
        )}
      </div>

      {/* =========================================================================
          PAGE BREAK (FOR STRICT 2-PAGE PRINTING)
          ========================================================================= */}
      {isTwoPage && (
        <>
          {/* Interactive Visual Break in Web Preview */}
          <div className="no-print my-8 py-2.5 px-4 bg-purple-50 border-2 border-dashed border-purple-300 rounded-2xl flex items-center justify-between text-xs text-purple-950 font-bold select-none">
            <div className="flex items-center gap-2">
              <span className="text-base">✂️</span>
              <span>បន្ទាត់កាត់ទំព័រ {paperSize} (Print Page Break) ៖ បញ្ចប់ទំព័រទី ១ • ចូលទំព័រទី ២</span>
            </div>
            <span className="px-2.5 py-1 bg-white border border-purple-300 rounded-lg text-[11px]">
              {orientation === 'landscape' ? `📑 ទិសដៅផ្តេក ${paperSize}` : `📄 ទិសដៅបញ្ឈរ ${paperSize}`}
            </span>
          </div>

          {/* Actual CSS Page Break for Printer */}
          <div
            className="print-page-break"
            style={{ pageBreakBefore: 'always', breakBefore: 'page' }}
          />

          {/* =========================================================================
              PAGE 2 (ទំព័រទី ២)
              ========================================================================= */}
          <div className="worksheet-page worksheet-page-2 pt-2 print:pt-4">
            {/* Page 2 Running Header */}
            <div className="pb-2.5 mb-4 border-b-2 border-slate-900 flex flex-wrap justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="font-moul text-xs text-purple-950">
                  {title || 'វិញ្ញាសាប្រឡង'} (តចប់)
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-700 font-semibold">{subject} ({grade})</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-600">
                <span>ឈ្មោះសិស្ស ៖ .................................................</span>
                <span>លេខតុ ៖ ............</span>
                <span className="font-bold text-purple-900">ទំព័រទី ២ នៃ ២</span>
              </div>
            </div>

            {/* Page 2 Questions */}
            <div
              className={`space-y-4 pt-1 ${fontClass} ${
                orientation === 'landscape' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''
              }`}
            >
              {page2Questions.map((q, idx) => renderQuestionBlock(q, splitIndex + idx))}
            </div>

            {/* Special Section on Page 2 (e.g. Exit ticket reflection, exam notes) */}
            {renderSpecialSectionByType()}

            {/* Signatures on Page 2 */}
            {renderSignaturesBlock()}

            {/* Page 2 Motto Footer */}
            <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 italic flex justify-between items-center print:border-slate-300">
              <span>{typeInfo.label} • {subject} {grade}</span>
              <span>« ការខិតខំរៀនសូត្រនៅថ្ងៃនេះ គឺជាអនាគតដ៏ភ្លឺស្វាងនៅថ្ងៃស្អែក »</span>
              <span>ទំព័រទី ២ នៃ ២ (ចប់)</span>
            </div>
          </div>
        </>
      )}

      {/* Continuous Mode Footer & Signatures (When not two-page mode) */}
      {!isTwoPage && (
        <>
          {renderSignaturesBlock()}
          <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 italic flex justify-between items-center print:border-slate-300">
            <span>{typeInfo.label} • {subject} {grade}</span>
            <span>« ការខិតខំរៀនសូត្រនៅថ្ងៃនេះ គឺជាអនាគតដ៏ភ្លឺស្វាងនៅថ្ងៃស្អែក »</span>
            <span>ទំព័រទី ១</span>
          </div>
        </>
      )}
    </div>
  );
};
