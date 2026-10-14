import React from 'react';
import { X, Printer } from 'lucide-react';
import { Student, TeacherProfile } from '../types';

interface StudentRosterPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  teacher: TeacherProfile;
}

export const StudentRosterPrintModal: React.FC<StudentRosterPrintModalProps> = ({
  isOpen,
  onClose,
  students,
  teacher,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-khmer">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black font-moul">
              បញ្ជីរាយនាមសិស្សផ្លូវការ (Student Roster)
            </h2>
            <p className="text-xs text-slate-300">
              {teacher.schoolName} — {teacher.className} (សរុប {students.length} នាក់)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-700">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <th className="border border-slate-200 dark:border-slate-700 p-2 text-center w-12">ល.រ</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">អត្តលេខ</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">គោត្តនាម និងនាម</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2 text-center w-16">ភេទ</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">ថ្ងៃខែឆ្នាំកំណើត</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">អាសយដ្ឋានបច្ចុប្បន្ន</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="border border-slate-200 dark:border-slate-700 p-2 text-center">{idx + 1}</td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2 font-mono">{s.rollNo || '-'}</td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold">{s.name}</td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2 text-center">{s.gender}</td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2">{s.dob || '-'}</td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2">{s.address || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
