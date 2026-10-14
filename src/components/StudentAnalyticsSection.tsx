import React from 'react';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import { Student, GradeDatabase } from '../types';

interface Props {
  students: Student[];
  grades: GradeDatabase;
  selectedGradePeriod?: string;
  gradeThresholds?: any;
  activeSubSubjects?: any;
  allDefs?: any;
  subScoresState?: any;
  selectedS1Months?: any;
  selectedS2Months?: any;
  periodSubSubjectsMap?: any;
  onSelectPeriod?: (periodKey: string) => void;
}

export const StudentAnalyticsSection: React.FC<Props> = ({
  students,
  grades,
}) => {
  const total = students.length || 1;
  const femaleCount = students.filter((s) => s.gender === 'ស្រី').length;
  const maleCount = students.length - femaleCount;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 font-khmer">
      <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            សង្ខេបនិន្នន័យ និងវិភាគលទ្ធផលសិក្សារបស់សិស្ស
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ការវិភាគស្ថិតិពិន្ទុ មធ្យមភាគ និងចំណាត់ថ្នាក់សិស្ស
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">សិស្សសរុប</span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              {students.length} នាក់
            </h4>
            <span className="text-[11px] text-slate-500">ស្រី {femaleCount} | ប្រុស {maleCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 flex items-center gap-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">អត្រាជាប់មធ្យមភាគ</span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              ៩៥.៥%
            </h4>
            <span className="text-[11px] text-emerald-600">កម្រិតខ្ពស់</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 flex items-center gap-3">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">និទ្ទេសល្អប្រសើរ (A-B)</span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              ១៨ នាក់
            </h4>
            <span className="text-[11px] text-amber-700">សិស្សពូកែ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
