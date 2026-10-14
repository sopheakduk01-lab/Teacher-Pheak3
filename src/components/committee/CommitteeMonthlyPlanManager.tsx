import React from 'react';
import { Calendar, Save } from 'lucide-react';
import { OfficialCommitteeData } from '../../types/committeeTypes';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (data: OfficialCommitteeData) => void;
  onShowToast?: (msg: string) => void;
}

export const CommitteeMonthlyPlanManager: React.FC<Props> = ({
  data,
  onShowToast,
}) => {
  const monthly = data.monthlyPlan || [];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-500" />
          ផែនការសកម្មភាពប្រចាំខែ
        </h3>
        <button
          onClick={() => onShowToast && onShowToast('បានរក្សាទុកផែនការប្រចាំខែ')}
          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>រក្សាទុក</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {monthly.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 space-y-2"
          >
            <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm">ខែ {m.month}</h4>
            <p className="font-semibold text-slate-700 dark:text-slate-200">គោលដៅ ៖ {m.goals}</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              {m.activities.map((act, aIdx) => (
                <li key={aIdx}>{act}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
