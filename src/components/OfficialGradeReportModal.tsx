import React from 'react';
import { X, Printer, Download, Award, FileSpreadsheet } from 'lucide-react';
import { TeacherProfile, Student, GradeDatabase, AttendanceDatabase } from '../types';

interface OfficialGradeReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  students: Student[];
  grades: GradeDatabase;
  attendance?: AttendanceDatabase;
  onShowToast?: (msg: string) => void;
}

export const OfficialGradeReportModal: React.FC<OfficialGradeReportModalProps> = ({
  isOpen,
  onClose,
  teacher,
  students,
  grades,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
    if (onShowToast) onShowToast('កំពុងបើកទម្រង់បោះពុម្ពរបាយការណ៍...');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-khmer">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-moul">
                តារាងលទ្ធផលសិក្សាផ្លូវការ (Official Grade Report)
              </h2>
              <p className="text-xs text-purple-200">
                {teacher.schoolName || 'សាលាបឋមសិក្សា'} — {teacher.className || 'ថ្នាក់ទី ៦'} | គ្រូ៖ {teacher.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
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

        {/* Content Table */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <table className="w-full text-xs text-center border-collapse border border-slate-200 dark:border-slate-700">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <th className="border border-slate-200 dark:border-slate-700 p-2 w-12">ល.រ</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2 text-left">ឈ្មោះសិស្ស</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2 w-16">ភេទ</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">ភាសាខ្មែរ</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">គណិតវិទ្យា</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">វិទ្យាសាស្ត្រ</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">សិក្សាសង្គម</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">សរុប</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">មធ្យមភាគ</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2">ចំណាត់ថ្នាក់</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const g = grades[s.id] || {};
                const kh = Number(g.khmer || 0);
                const ma = Number(g.math || 0);
                const sc = Number(g.science || 0);
                const so = Number(g.social || 0);
                const tot = kh + ma + sc + so;
                const avg = (tot / 4).toFixed(2);
                return (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{idx + 1}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 text-left font-bold">{s.name}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{s.gender}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{kh || '-'}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{ma || '-'}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{sc || '-'}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{so || '-'}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold text-indigo-700">{tot || '-'}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold text-purple-700">{tot ? avg : '-'}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold text-amber-700">{tot ? idx + 1 : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
