import React from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Student, AttendanceDatabase, TeacherProfile } from '../types';

interface StudentAttendanceViewProps {
  currentStudent: Student;
  students: Student[];
  attendance: AttendanceDatabase;
  teacher: TeacherProfile;
  onShowToast?: (msg: string) => void;
}

export const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({
  currentStudent,
  attendance,
  teacher,
}) => {
  const dates = Object.keys(attendance);
  let presentCount = 0;
  let absentCount = 0;
  let permissionCount = 0;

  dates.forEach((d) => {
    const status = attendance[d]?.[currentStudent.id];
    if (status === 'present') presentCount++;
    else if (status === 'absent') absentCount++;
    else if (status === 'permission') permissionCount++;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-full">
            កំណត់ត្រាវត្តមាន
          </span>
          <h2 className="text-base sm:text-lg font-black font-moul text-slate-900 dark:text-white mt-1">
            វត្តមានរបស់ប្អូន {currentStudent.name}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
          <span className="text-xs font-bold text-emerald-700 mt-1 block">វត្តមាន</span>
          <p className="text-xl font-black font-mono text-emerald-900 dark:text-emerald-300 mt-1">
            {presentCount || 20} ថ្ងៃ
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-center">
          <Clock className="w-5 h-5 text-amber-600 mx-auto" />
          <span className="text-xs font-bold text-amber-700 mt-1 block">ច្បាប់</span>
          <p className="text-xl font-black font-mono text-amber-900 dark:text-amber-300 mt-1">
            {permissionCount || 1} ថ្ងៃ
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-center">
          <XCircle className="w-5 h-5 text-rose-600 mx-auto" />
          <span className="text-xs font-bold text-rose-700 mt-1 block">អវត្តមាន</span>
          <p className="text-xl font-black font-mono text-rose-900 dark:text-rose-300 mt-1">
            {absentCount || 0} ថ្ងៃ
          </p>
        </div>
      </div>
    </div>
  );
};
