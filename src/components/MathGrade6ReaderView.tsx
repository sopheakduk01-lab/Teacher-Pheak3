import React from 'react';
import { mathGrade6AllLessons } from '../data/mathGrade6Book';

interface MathGrade6ReaderViewProps {
  currentPage: number;
  totalPages?: number;
  onNavigatePage?: (page: number) => void;
  onShowToast?: (msg: string) => void;
}

export const MathGrade6ReaderView: React.FC<MathGrade6ReaderViewProps> = ({
  currentPage,
}) => {
  const currentLesson = mathGrade6AllLessons.find(
    (l) => currentPage >= l.startPage && currentPage <= l.endPage
  ) || mathGrade6AllLessons[0];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
      <div className="border-b pb-4 border-slate-100 dark:border-slate-700">
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
          មេរៀនទី {currentLesson.lessonNo}
        </span>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-2">
          {currentLesson.title}
        </h2>
        <p className="text-xs text-slate-400 mt-1">ទំព័រទី {currentPage}</p>
      </div>

      <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
        <p className="font-semibold text-base text-slate-900 dark:text-white">
          ខ្លឹមសារសង្ខេប ៖
        </p>
        <p className="leading-relaxed">{currentLesson.summary}</p>

        <div className="bg-slate-50 dark:bg-slate-750 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">
            ចំណុចគន្លឹះសំខាន់ៗ ៖
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            {currentLesson.keyConcepts.map((concept, idx) => (
              <li key={idx}>{concept}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
