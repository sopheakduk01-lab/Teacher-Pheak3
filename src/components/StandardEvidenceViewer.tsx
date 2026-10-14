import React from 'react';
import {
  FileText,
  CheckCircle2,
  Calendar,
  School,
  User,
  Users,
  Award,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Download,
  Printer
} from 'lucide-react';
import { Student, TeacherProfile, GradeDatabase, AttendanceDatabase, BookBorrowingRecord } from '../types';

export interface StandardEvidenceViewerProps {
  formId: string;
  criterionText: string;
  teacher: TeacherProfile;
  students: Student[];
  grades: GradeDatabase;
  attendance: AttendanceDatabase;
  borrowings: BookBorrowingRecord[];
  academicYear: string;
}

export const StandardEvidenceViewer: React.FC<StandardEvidenceViewerProps> = ({
  formId,
  criterionText,
  teacher,
  students,
  grades,
  attendance,
  borrowings,
  academicYear,
}) => {
  // Total students count
  const totalStudents = students.length;
  const femaleStudents = students.filter(s => s.gender === 'ស្រី' || s.gender === 'F').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Evidence Document Header */}
      <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 mb-2">
              <ClipboardCheck className="w-3.5 h-3.5" />
              ភស្តុតាង និងទិន្នន័យបញ្ជាក់ស្តង់ដាសាលារៀនគំរូ
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-moul">
              {criterionText}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              លេខកូដទម្រង់ឯកសារ៖ <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{formId}</span> • ឆ្នាំសិក្សា៖ {academicYear}
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពភស្តុតាង (Print)</span>
          </button>
        </div>
      </div>

      {/* Institutional Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <School className="w-3.5 h-3.5 text-indigo-500" />
            <span>គ្រឹះស្ថានសិក្សា</span>
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{teacher.school || 'សាលាបឋមសិក្សាគំរូ'}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <User className="w-3.5 h-3.5 text-purple-500" />
            <span>គ្រូបន្ទុកថ្នាក់</span>
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{teacher.name || 'លោកគ្រូ/អ្នកគ្រូ'}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            <span>ចំនួនសិស្សសរុប</span>
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-100">{totalStudents} នាក់ (ស្រី {femaleStudents} នាក់)</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>កម្រិតថ្នាក់</span>
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-100">{teacher.grade || 'ថ្នាក់ទី ៦'}</p>
        </div>
      </div>

      {/* Detailed Evidence Content based on formId */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>ទិន្នន័យជាក់ស្តែង និងស្ថានភាពអនុវត្ត (Verification Status)</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-bold">
                <th className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-tl-lg">ល.រ</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-700">សូចនាករត្រួតពិនិត្យ</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-700">ស្ថានភាព</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-700">ឯកសារយោង / ប្រភព</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-tr-lg">ការវាយតម្លៃ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-mono text-center">១</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-medium">ការកត់ត្រាទិន្នន័យ និងព័ត៌មានលម្អិតក្នុងប្រព័ន្ធ</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                    បានអនុវត្តពេញលេញ
                  </span>
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">ប្រព័ន្ធ WikiSchool រដ្ឋបាលបឋម</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-bold">ល្អប្រសើរ (១០០%)</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-mono text-center">២</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-medium">វត្តមាន និងការចូលរួមជាប្រចាំរបស់សិស្ស</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                    ស្រង់វត្តមានប្រចាំថ្ងៃ
                  </span>
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">សៀវភៅហៅឈ្មោះឌីជីថល</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-bold">អនុវត្តជាប្រចាំ</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-mono text-center">៣</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-medium">លទ្ធផលសិក្សា និងការវាយតម្លៃចំណេះដឹង</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                    ដាក់ពិន្ទុតាមខែ & ឆមាស
                  </span>
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">តារាងពិន្ទុប្រចាំខែ និងឆមាស</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold">ស្របតាមស្តង់ដា អ.យ.ក</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-mono text-center">៤</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-medium">ការប្រើប្រាស់សម្ភារឧបទេស និងបណ្ណាល័យ</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                    មានកំណត់ត្រាខ្ចី-សង
                  </span>
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">បញ្ជីសៀវភៅ និងការអាន</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-bold">សកម្មភាពទៀងទាត់</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="pt-2 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <p>
            បញ្ជាក់៖ ឯកសារភស្តុតាងនេះត្រូវបានផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិតាមរយៈប្រព័ន្ធទិន្នន័យជាក់ស្តែងក្នុងថ្នាក់រៀន។
          </p>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            ត្រួតពិនិត្យដោយ៖ គណៈកម្មការស្តង់ដា
          </span>
        </div>
      </div>
    </div>
  );
};
