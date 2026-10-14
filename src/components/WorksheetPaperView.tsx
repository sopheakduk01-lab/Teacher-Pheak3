import React from 'react';
import { QuizQuestion } from '../types';

export type WorksheetType =
  | 'worksheet'
  | 'exam'
  | 'homework'
  | 'test'
  | 'exit_ticket'
  | 'monthly_exam'
  | 'semester_exam'
  | 'quick_test'
  | 'revision';

export type WorksheetBorderStyle = 'none' | 'single' | 'double' | 'classic' | 'dashed';
export type WorksheetFontSize = 'small' | 'normal' | 'large';
export type WorksheetDesignTheme =
  | 'moeys_classic'
  | 'modern_indigo'
  | 'primary_friendly'
  | 'pisa_academic'
  | 'modern'
  | 'compact'
  | 'border_frame';
export type PageOrientation = 'portrait' | 'landscape';
export type PageLayoutMode = 'two_pages' | 'continuous' | 'single';

export interface WorksheetOptions {
  sheetType: WorksheetType;
  schoolName?: string;
  districtOffice?: string;
  academicYear?: string;
  customDate?: string;
  examSession?: string;
  totalScore?: string;
  showAnswerKey?: boolean;
  showStudentBox?: boolean;
  showEvaluationBox?: boolean;
  showSignatures?: boolean;
  showPoints?: boolean;
  borderStyle?: WorksheetBorderStyle;
  fontSize?: WorksheetFontSize;
  instructionText?: string;
  designTheme?: WorksheetDesignTheme;
  pageOrientation?: PageOrientation;
  pageMode?: PageLayoutMode;
  marginMode?: 'normal' | 'zero' | 'compact';
  paperSize?: 'A4' | 'Letter';
}

export const WORKSHEET_TYPE_TITLES: Record<string, { label: string; icon: string; desc?: string }> = {
  worksheet: { label: 'សន្លឹកកិច្ចការ', icon: '📝', desc: 'សន្លឹកកិច្ចការស្វ័យសិក្សាទូទៅ' },
  exam: { label: 'វិញ្ញាសាប្រឡង', icon: '📋', desc: 'វិញ្ញាសាប្រឡងប្រចាំខែ/ឆមាស' },
  homework: { label: 'កិច្ចការផ្ទះ', icon: '🏠', desc: 'កិច្ចការផ្ទះសម្រាប់សិស្ស' },
  test: { label: 'តេស្តខ្លី', icon: '⏱️', desc: 'តេស្តវាស់ស្ទង់ចំណេះដឹង' },
  exit_ticket: { label: 'សំបុត្រចេញថ្នាក់', icon: '🎟️', desc: 'Exit Ticket ចុងម៉ោង' },
  monthly_exam: { label: 'ប្រឡងប្រចាំខែ', icon: '📅', desc: 'វិញ្ញាសាប្រឡងប្រចាំខែ' },
  semester_exam: { label: 'ប្រឡងឆមាស', icon: '🎓', desc: 'វិញ្ញាសាប្រឡងឆមាស' },
  quick_test: { label: 'តេស្តរហ័ស', icon: '⚡', desc: 'តេស្តរហ័ស ៥-១០ នាទី' },
  revision: { label: 'រំលឹកមេរៀន', icon: '🔄', desc: 'សន្លឹករំលឹកមេរៀន' },
};

export const WORKSHEET_DESIGN_INFO: Record<
  string,
  { name: string; tag: string; icon: string; color: string }
> = {
  moeys_classic: {
    name: 'ក្រសួង MoEYS ស្តង់ដា',
    tag: 'ផ្លូវការ',
    icon: '🏛️',
    color: 'border-slate-800 text-slate-900',
  },
  modern_indigo: {
    name: 'ម៉ូដឺន Modern Indigo',
    tag: 'ស្អាតបាត',
    icon: '💎',
    color: 'border-indigo-700 text-indigo-900',
  },
  primary_friendly: {
    name: 'បឋមសិក្សា មិត្តភាព',
    tag: 'ងាយស្រួល',
    icon: '🎨',
    color: 'border-emerald-600 text-emerald-900',
  },
  pisa_academic: {
    name: 'PISA អន្តរជាតិ',
    tag: 'ស្តង់ដាខ្ពស់',
    icon: '🌍',
    color: 'border-blue-800 text-blue-900',
  },
};

interface WorksheetPaperViewProps {
  title: string;
  subject: string;
  grade?: string;
  examDuration?: string | number;
  teacherName?: string;
  questions: QuizQuestion[];
  options: WorksheetOptions;
}

export const WorksheetPaperView: React.FC<WorksheetPaperViewProps> = ({
  title,
  subject,
  grade = 'ថ្នាក់ទី ៦',
  examDuration = '៤៥',
  teacherName = 'លោកគ្រូ/អ្នកគ្រូ',
  questions = [],
  options,
}) => {
  const isLandscape = options.pageOrientation === 'landscape';

  return (
    <div
      className={`mx-auto bg-white text-slate-900 shadow-xl rounded-2xl p-6 sm:p-10 font-khmer transition-all ${
        isLandscape ? 'max-w-[1000px]' : 'max-w-[850px]'
      }`}
      style={{ minHeight: '1050px' }}
    >
      {/* Header section */}
      <div className="border-b-2 border-slate-800 pb-4 mb-6">
        <div className="flex justify-between items-start gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-xs text-slate-600 font-bold uppercase tracking-wider">
              {options.districtOffice || 'ការិយាល័យអប់រំ យុវជន និងកីឡា'}
            </h4>
            <h3 className="text-sm font-bold text-slate-800">
              {options.schoolName || 'សាលាបឋមសិក្សាគំរូ'}
            </h3>
          </div>
          <div className="text-center sm:text-right">
            <h4 className="text-xs text-slate-600 font-bold">ព្រះរាជាណាចក្រកម្ពុជា</h4>
            <h5 className="text-xs font-semibold text-slate-700">ជាតិ សាសនា ព្រះមហាក្សត្រ</h5>
          </div>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-wide">{title}</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1.5 text-xs text-slate-600 font-medium">
            <span>មុខវិជ្ជា ៖ <strong className="text-slate-800">{subject}</strong></span>
            <span>•</span>
            <span>កម្រិត ៖ <strong className="text-slate-800">{grade}</strong></span>
            <span>•</span>
            <span>រយៈពេល ៖ <strong className="text-slate-800">{examDuration} នាទី</strong></span>
            {options.totalScore && (
              <>
                <span>•</span>
                <span>ពិន្ទុសរុប ៖ <strong className="text-slate-800">{options.totalScore}</strong></span>
              </>
            )}
          </div>
        </div>

        {options.showStudentBox && (
          <div className="mt-4 p-3 border border-slate-300 rounded-xl bg-slate-50 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-slate-500">ឈ្មោះសិស្ស ៖</span> ........................
            </div>
            <div>
              <span className="text-slate-500">ភេទ ៖</span> ..........
            </div>
            <div>
              <span className="text-slate-500">លេខតុ ៖</span> ..........
            </div>
            <div>
              <span className="text-slate-500">បន្ទប់ ៖</span> ..........
            </div>
          </div>
        )}
      </div>

      {options.instructionText && (
        <div className="mb-6 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
          <strong>សេចក្តីណែនាំ ៖ </strong> {options.instructionText}
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            មិនទាន់មានសំណួរនៅឡើយទេ។ សូមបន្ថែមសំណួរដើម្បីមើលគំរូសន្លឹកកិច្ចការ។
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={q.id || idx} className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-2">
                <span className="font-bold text-sm bg-purple-100 text-purple-900 px-2 py-0.5 rounded-lg shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{q.question}</p>
                  {q.points && options.showPoints && (
                    <span className="text-[11px] text-purple-700 font-bold ml-1">
                      ({q.points} ពិន្ទុ)
                    </span>
                  )}
                </div>
              </div>

              {/* Options */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 mt-2">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={opt.id || optIdx}
                      className={`text-xs p-2 rounded-lg border ${
                        options.showAnswerKey && opt.isCorrect
                          ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="font-bold mr-1.5">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      {opt.text}
                      {options.showAnswerKey && opt.isCorrect && ' ✓'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {options.showSignatures && (
        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <div className="text-center">
            <p className="font-semibold">ហត្ថលេខាសិស្ស</p>
            <div className="h-14"></div>
            <p className="text-[11px] text-slate-400">..............................</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">គ្រូបង្រៀន / អ្នករៀបចំ</p>
            <div className="h-14"></div>
            <p className="font-bold text-slate-800">{teacherName}</p>
          </div>
        </div>
      )}
    </div>
  );
};
