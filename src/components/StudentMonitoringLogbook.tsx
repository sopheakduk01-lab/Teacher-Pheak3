import React from 'react';
import { BookOpen, Search, Printer } from 'lucide-react';
import { TeacherProfile, Student, AttendanceDatabase, GradeDatabase } from '../types';

interface Props {
  teacher: TeacherProfile;
  students: Student[];
  currentYear?: string;
  attendance?: AttendanceDatabase;
  grades?: GradeDatabase;
  activeSubSubjects?: any;
  subScoresState?: any;
  gradeThresholds?: any;
  selectedS1Months?: any;
  selectedS2Months?: any;
  periodSubSubjectsMap?: any;
  onUpdatePeriodSubSubjects?: any;
  onUpdateSubScores?: any;
}

export const StudentMonitoringLogbook: React.FC<Props> = ({
  teacher,
  students,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 font-khmer">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            សៀវភៅតាមដានការសិក្សា និងអត្តចរិតសិស្ស
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            កត់ត្រាការវិវត្តសមត្ថភាព ការចូលរៀន និងអាកប្បកិរិយាប្រចាំខែ
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>បោះពុម្ពសៀវភៅតាមដាន</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <th className="border border-slate-200 dark:border-slate-700 p-2 text-center w-12">ល.រ</th>
              <th className="border border-slate-200 dark:border-slate-700 p-2">ឈ្មោះសិស្ស</th>
              <th className="border border-slate-200 dark:border-slate-700 p-2 text-center w-14">ភេទ</th>
              <th className="border border-slate-200 dark:border-slate-700 p-2">ចំណុចខ្លាំង</th>
              <th className="border border-slate-200 dark:border-slate-700 p-2">ចំណុចត្រូវកែលម្អ</th>
              <th className="border border-slate-200 dark:border-slate-700 p-2">ការចូលរួមរបស់អាណាព្យាបាល</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="border border-slate-200 dark:border-slate-700 p-2 text-center">{idx + 1}</td>
                <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold">{s.name}</td>
                <td className="border border-slate-200 dark:border-slate-700 p-2 text-center">{s.gender}</td>
                <td className="border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300">
                  រហ័សរហួន ឧស្សាហ៍ព្យាយាម ចូលរួមឆ្លើយសំណួរ
                </td>
                <td className="border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300">
                  ពង្រឹងការសរសេរតាមអាន និងការគណនា
                </td>
                <td className="border border-slate-200 dark:border-slate-700 p-2 text-emerald-600 font-semibold">
                  ល្អប្រសើរ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
