import React, { useState } from 'react';
import { Clock, Calendar, Printer, Sun, Moon } from 'lucide-react';
import { morningShiftRows, afternoonShiftRows, TimetableRow } from '../data/timetableData';

interface TimetableDisplayProps {
  grade?: string;
  onShowToast?: (msg: string) => void;
}

export const TimetableDisplay: React.FC<TimetableDisplayProps> = ({
  grade = 'ថ្នាក់ទី ៦',
  onShowToast,
}) => {
  const [shift, setShift] = useState<'morning' | 'afternoon'>('morning');

  const rows: TimetableRow[] = shift === 'morning' ? morningShiftRows : afternoonShiftRows;

  const handlePrint = () => {
    window.print();
    if (onShowToast) onShowToast('កំពុងបើកទម្រង់បោះពុម្ពកាលវិភាគ...');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 font-khmer">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-900 dark:bg-purple-900/40 dark:text-purple-300">
              <Calendar className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              កាលវិភាគបង្រៀនប្រចាំសប្តាហ៍ ({grade})
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ស្តង់ដារកម្មវិធីសិក្សាបឋមសិក្សា ក្រសួងអប់រំ យុវជន និងកីឡា
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Shift Toggle */}
          <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setShift('morning')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                shift === 'morning'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> ពេលព្រឹក
            </button>
            <button
              onClick={() => setShift('afternoon')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                shift === 'afternoon'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> ពេលរសៀល
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ព</span>
          </button>
        </div>
      </div>

      {/* Timetable Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="bg-purple-900 text-white">
              <th className="border border-purple-800 p-2.5 w-28">ម៉ោងសិក្សា</th>
              <th className="border border-purple-800 p-2.5">ចន្ទ</th>
              <th className="border border-purple-800 p-2.5">អង្គារ</th>
              <th className="border border-purple-800 p-2.5">ពុធ</th>
              <th className="border border-purple-800 p-2.5">ព្រហស្បតិ៍</th>
              <th className="border border-purple-800 p-2.5">សុក្រ</th>
              <th className="border border-purple-800 p-2.5">សៅរ៍</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isBreak = row.type === 'break';
              return (
                <tr
                  key={idx}
                  className={
                    isBreak
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-750'
                  }
                >
                  <td className="border border-slate-200 dark:border-slate-700 p-2.5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{row.time}</span>
                    </div>
                  </td>
                  {isBreak ? (
                    <td
                      colSpan={6}
                      className="border border-slate-200 dark:border-slate-700 p-2.5 tracking-widest text-center"
                    >
                      ☕ ចេញលេង (សម្រាក {row.duration || '៣០ នាទី'})
                    </td>
                  ) : (
                    <>
                      <td className="border border-slate-200 dark:border-slate-700 p-2.5 font-medium">{row.mon || row.monday}</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-2.5 font-medium">{row.tue || row.tuesday}</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-2.5 font-medium">{row.wed || row.wednesday}</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-2.5 font-medium">{row.thu || row.thursday}</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-2.5 font-medium">{row.fri || row.friday}</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-2.5 font-medium">{row.sat || row.saturday}</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
