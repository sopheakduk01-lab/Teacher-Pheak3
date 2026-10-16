import React from 'react';
import { Award, Trophy, Star, Printer } from 'lucide-react';
import { TeacherProfile, Student, GradeDatabase } from '../types';

interface HonorRollManagerProps {
  teacher: TeacherProfile;
  students: Student[];
  grades: GradeDatabase;
  currentYear: string;
  onShowToast?: (msg: string) => void;
}

export const HonorRollManager: React.FC<HonorRollManagerProps> = ({
  teacher,
  students,
  grades,
  currentYear,
  onShowToast,
}) => {
  // Sort students by highest average or roll
  const periodData = (grades['m10'] || {}) as Record<number, any>;

  const rankedStudents = [...students].map((s) => {
    const g = periodData[s.id] || {};
    return {
      ...s,
      total: g.total || 0,
      average: g.average || 0,
      mention: g.mention || 'មធ្យម',
      rank: g.rank || 0,
    };
  }).sort((a, b) => b.average - a.average);

  const topStudents = rankedStudents.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 font-black text-xs uppercase shadow-xs">
              តារាងកិត្តិយសផ្លូវការ
            </span>
            <span className="text-xs font-bold text-amber-950">
              ឆ្នាំសិក្សា ៖ {currentYear}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-moul">
            តារាងកិត្តិយសសិស្សពូកែប្រចាំខែ (Honor Roll)
          </h1>
          <p className="text-xs font-bold text-amber-950/80">
            {teacher.school} &bull; {teacher.grade} &bull; គ្រូបន្ទុកថ្នាក់ ៖ {teacher.name}
          </p>
        </div>

        <button
          onClick={() => {
            window.print();
            onShowToast?.('បានបញ្ជូនទៅម៉ាស៊ីនបោះពុម្ព!');
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:bg-slate-900 transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>បោះពុម្ពតារាងកិត្តិយស</span>
        </button>
      </div>

      {/* Podium Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topStudents.slice(0, 3).map((st, idx) => {
          const medals = ['🥇 ចំណាត់ថ្នាក់លេខ ១', '🥈 ចំណាត់ថ្នាក់លេខ ២', '🥉 ចំណាត់ថ្នាក់លេខ ៣'];
          const colors = [
            'from-amber-100 to-yellow-50 border-amber-300',
            'from-slate-100 to-zinc-50 border-slate-300',
            'from-orange-100 to-amber-50 border-orange-300',
          ];

          return (
            <div
              key={st.id}
              className={`rounded-3xl p-6 bg-gradient-to-b ${colors[idx]} border-2 shadow-md text-center space-y-3`}
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-md mx-auto flex items-center justify-center text-3xl border">
                {st.avatar || '🎓'}
              </div>
              <div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-white shadow-xs border">
                  {medals[idx]}
                </span>
                <h3 className="font-black text-base text-slate-900 mt-2 font-moul">{st.name}</h3>
                <p className="text-xs text-slate-600 font-bold mt-1">
                  មធ្យមភាគ ៖ <span className="text-amber-800">{st.average}</span> &bull; និទ្ទេស ៖ {st.mention}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Ranking Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold">
              <th className="py-3 px-4">ចំណាត់ថ្នាក់</th>
              <th className="py-3 px-4">គោត្តនាម និងនាម</th>
              <th className="py-3 px-4">ភេទ</th>
              <th className="py-3 px-4">ពិន្ទុសរុប</th>
              <th className="py-3 px-4">មធ្យមភាគ</th>
              <th className="py-3 px-4">និទ្ទេស</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {rankedStudents.map((st, idx) => (
              <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="py-3 px-4 font-black text-amber-600">លេខ {idx + 1}</td>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{st.avatar || '👤'}</span>
                  <span>{st.name}</span>
                </td>
                <td className="py-3 px-4 text-slate-500">{st.gender === 'female' ? 'ស្រី' : 'ប្រុស'}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">{st.total}</td>
                <td className="py-3 px-4 font-mono font-bold text-purple-600">{st.average}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {st.mention}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
