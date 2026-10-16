import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface SubjectSyllabusDisplayProps {
  onShowToast?: (msg: string) => void;
  [key: string]: any;
}

export const SubjectSyllabusDisplay: React.FC<SubjectSyllabusDisplayProps> = ({
  onShowToast,
}) => {
  const subjects = [
    { name: 'ភាសាខ្មែរ', periods: '១០ ម៉ោង/សប្តាហ៍', topics: 'អំណាន, សំណេរ, តែងសេចក្តី, វេយ្យាករណ៍' },
    { name: 'គណិតវិទ្យា', periods: '៧ ម៉ោង/សប្តាហ៍', topics: 'នព្វន្ត, ប្រភាគ, ទសភាគ, ធរណីមាត្រ' },
    { name: 'វិទ្យាសាស្ត្រ', periods: '៤ ម៉ោង/សប្តាហ៍', topics: 'រូបវិទ្យា, គីមីវិទ្យា, ជីវវិទ្យា, បរិស្ថាន' },
    { name: 'សិក្សាសង្គម', periods: '៤ ម៉ោង/សប្តាហ៍', topics: 'ប្រវត្តិវិទ្យា, ភូមិវិទ្យា, សីលធម៌ពលរដ្ឋ' },
    { name: 'អប់រំកាយ & កីឡា', periods: '២ ម៉ោង/សប្តាហ៍', topics: 'កាយសម្ព័ន្ធ, បាល់ទាត់, អត្តពលកម្ម' },
    { name: 'សិល្បៈ', periods: '២ ម៉ោង/សប្តាហ៍', topics: 'គំនូរ, ចម្រៀង, តន្ត្រីប្រពៃណី' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
      <div className="flex items-center gap-2.5">
        <BookOpen className="w-5 h-5 text-purple-600" />
        <h3 className="font-moul text-sm sm:text-base text-slate-900 dark:text-white">
          កម្មវិធីសិក្សា និងបន្ទុកម៉ោងតាមមុខវិជ្ជា
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {subjects.map((s, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {s.name}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {s.periods}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {s.topics}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
