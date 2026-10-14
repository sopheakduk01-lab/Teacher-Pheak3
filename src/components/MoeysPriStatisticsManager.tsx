import React from 'react';
import { FileText, Printer, Users } from 'lucide-react';
import { TeacherProfile, Student } from '../types';

interface Props {
  teacher: TeacherProfile;
  currentYear?: string;
  students: Student[];
  onUpdateStudent?: (student: Student) => void;
  onShowToast?: (msg: string) => void;
}

export const MoeysPriStatisticsManager: React.FC<Props> = ({
  teacher,
  currentYear = '២០២៥-២០២៦',
  students,
}) => {
  const femaleCount = students.filter((s) => s.gender === 'ស្រី').length;
  const maleCount = students.length - femaleCount;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 font-khmer">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            ទម្រង់ស្ថិតិសិស្ស MoEYS PRI (ឯកសារផ្លូវការក្រសួង)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {teacher.schoolName} — {teacher.className || 'ថ្នាក់ទី ៦'} (ឆ្នាំសិក្សា {currentYear})
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>បោះពុម្ពទម្រង់ PRI</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500">ចំនួនសិស្សដើមឆ្នាំ ៖</span>
          <h4 className="text-lg font-bold mt-1 text-slate-900 dark:text-white">
            {students.length} នាក់ (ស្រី {femaleCount})
          </h4>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500">សិស្សអាហារូបករណ៍ ៖</span>
          <h4 className="text-lg font-bold mt-1 text-amber-600">
            ៥ នាក់ (ស្រី ៣)
          </h4>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500">សិស្សប័ណ្ណសមធម៌ (ក្រីក្រ) ៖</span>
          <h4 className="text-lg font-bold mt-1 text-purple-600">
            ៨ នាក់ (ស្រី ៤)
          </h4>
        </div>
      </div>
    </div>
  );
};
