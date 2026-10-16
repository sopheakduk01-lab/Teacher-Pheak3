import React, { useState } from 'react';
import { Award, Calculator, TrendingUp, Star, CheckCircle2, Trophy, Printer } from 'lucide-react';
import { Student, GradeDatabase, AttendanceDatabase } from '../types';

interface StudentAcademicResultsViewProps {
  currentStudent: Student;
  students: Student[];
  grades: GradeDatabase;
  attendance: AttendanceDatabase;
  onShowToast?: (msg: string) => void;
}

export const StudentAcademicResultsView: React.FC<StudentAcademicResultsViewProps> = ({
  currentStudent,
  grades,
  onShowToast,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('m10');

  const periodData = (grades[selectedPeriod] || {}) as Record<number, any>;
  const myGrade = periodData[currentStudent.id] || {
    khmer: 45,
    math: 48,
    science: 42,
    social: 40,
    total: 175,
    average: 43.75,
    rank: 1,
    mention: 'ល្អ',
  };

  const subjectRows = [
    { name: 'ភាសាខ្មែរ', score: myGrade.khmer || 0, max: 50 },
    { name: 'គណិតវិទ្យា', score: myGrade.math || 0, max: 50 },
    { name: 'វិទ្យាសាស្ត្រ', score: myGrade.science || 0, max: 50 },
    { name: 'សិក្សាសង្គម', score: myGrade.social || 0, max: 50 },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 dark:bg-purple-900/40 px-2.5 py-0.5 rounded-full">
            របាយការណ៍សិក្សា
          </span>
          <h2 className="text-base sm:text-lg font-black font-moul text-slate-900 dark:text-white mt-1">
            លទ្ធផលពិន្ទុ និងចំណាត់ថ្នាក់សិក្សា
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="m10">ខែ តុលា</option>
            <option value="m11">ខែ វិច្ឆិកា</option>
            <option value="m12">ខែ ធ្នូ</option>
            <option value="s1">ឆមាសទី ១</option>
            <option value="s2">ឆមាសទី ២</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-center">
          <span className="text-xs text-purple-600 font-bold">ពិន្ទុសរុប</span>
          <p className="text-2xl font-black text-purple-900 dark:text-purple-300 font-mono mt-1">
            {myGrade.total || 0}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-center">
          <span className="text-xs text-blue-600 font-bold">មធ្យមភាគ</span>
          <p className="text-2xl font-black text-blue-900 dark:text-blue-300 font-mono mt-1">
            {myGrade.average || 0}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-center">
          <span className="text-xs text-amber-600 font-bold">ចំណាត់ថ្នាក់</span>
          <p className="text-2xl font-black text-amber-900 dark:text-amber-300 font-mono mt-1">
            លេខ {myGrade.rank || 1}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center">
          <span className="text-xs text-emerald-600 font-bold">និទ្ទេស</span>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300 font-moul mt-1">
            {myGrade.mention || 'ល្អ'}
          </p>
        </div>
      </div>

      {/* Breakdown per subject */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
          ពិន្ទុលម្អិតតាមមុខវិជ្ជានីមួយៗ
        </h4>
        <div className="space-y-2">
          {subjectRows.map((sub, idx) => {
            const pct = Math.min(100, Math.round((sub.score / sub.max) * 100));
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4"
              >
                <div className="w-28 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  {sub.name}
                </div>
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-16 text-right font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  {sub.score} / {sub.max}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
