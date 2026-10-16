import React from 'react';
import { Award, CheckCircle2, FileText, Printer } from 'lucide-react';
import { TeacherProfile, Student, GradeDatabase, AttendanceDatabase, BookBorrowingRecord, LibraryBook } from '../types';

interface Props {
  teacher: TeacherProfile;
  students: Student[];
  grades: GradeDatabase;
  attendance: AttendanceDatabase;
  borrowings?: BookBorrowingRecord[];
  onAddBorrowing?: any;
  onUpdateBorrowing?: any;
  onDeleteBorrowing?: any;
  libraryBooks?: LibraryBook[];
  currentYear?: string;
  onShowToast?: (msg: string) => void;
  fontFamily?: string;
  backgroundTheme?: string;
  activeBannerTheme?: any;
}

export const ModelSchoolStandardsManager: React.FC<Props> = ({
  teacher,
  students,
  onShowToast,
}) => {
  const standards = [
    { id: 1, title: 'ស្តង់ដាទី ១ ៖ លទ្ធផលសិក្សារបស់សិស្ស', score: 'ល្អប្រសើរ (Level 4)', desc: 'សិស្សទទួលបានលទ្ធផលសិក្សាខ្ពស់ និងឆ្លងកាត់ការវាយតម្លៃស្តង់ដា។' },
    { id: 2, title: 'ស្តង់ដាទី ២ ៖ ការបង្រៀន និងការរៀន', score: 'ល្អប្រសើរ (Level 4)', desc: 'គ្រូប្រើប្រាស់វិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល និងបច្ចេកវិទ្យាឌីជីថល។' },
    { id: 3, title: 'ស្តង់ដាទី ៣ ៖ ការចូលរួមរបស់សហគមន៍', score: 'ល្អ (Level 3)', desc: 'មានទំនាក់ទំនងជិតស្និទ្ធជាមួយមាតាបិតា និងគណៈកម្មការទ្រទ្រង់សាលា។' },
    { id: 4, title: 'ស្តង់ដាទី ៤ ៖ ដំណើរការប្រតិបត្តិការ និងការគ្រប់គ្រង', score: 'ល្អប្រសើរ (Level 4)', desc: 'រដ្ឋបាលថ្នាក់រៀនមានរបៀបរៀបរយ កាលវិភាគ និងបញ្ជីត្រួតពិនិត្យច្បាស់លាស់។' },
    { id: 5, title: 'ស្តង់ដាទី ៥ ៖ គណនេយ្យភាពរបស់សាលារៀន', score: 'ល្អប្រសើរ (Level 4)', desc: 'មានការវាយតម្លៃ និងរាយការណ៍លទ្ធផលសិក្សាជាប្រចាំជូនអាណាព្យាបាល។' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 font-khmer">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            ការវាយតម្លៃស្តង់ដាសាលារៀនគំរូ (ប្រកាស ១២៦៩)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ការតាមដានការអនុវត្តស្តង់ដាគុណភាពទាំង ៥ របស់ក្រសួង MoEYS
          </p>
        </div>
        <button
          onClick={() => {
            window.print();
            if (onShowToast) onShowToast('កំពុងបើកទម្រង់បោះពុម្ពស្តង់ដាសាលារៀនគំរូ...');
          }}
          className="px-3.5 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>បោះពុម្ពរបាយការណ៍</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {standards.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{s.title}</h4>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {s.score}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
