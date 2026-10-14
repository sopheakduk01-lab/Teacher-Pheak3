import React from 'react';
import { Calendar, Save, Plus, Trash2 } from 'lucide-react';
import { OfficialCommitteeData } from '../../types/committeeTypes';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (data: OfficialCommitteeData) => void;
  onShowToast?: (msg: string) => void;
}

export const CommitteeAnnualPlanManager: React.FC<Props> = ({
  data,
  onUpdateData,
  onShowToast,
}) => {
  const annual = data.annualPlan || {
    objectives: '',
    activities: [],
  };

  const handleObjectiveChange = (val: string) => {
    onUpdateData({
      ...data,
      annualPlan: {
        ...annual,
        objectives: val,
      },
    });
  };

  const handleAddActivity = () => {
    const newAct = { title: 'សកម្មភាពថ្មី', month: 'មករា', responsible: 'គណៈកម្មការ' };
    onUpdateData({
      ...data,
      annualPlan: {
        ...annual,
        activities: [...annual.activities, newAct],
      },
    });
  };

  const handleDeleteActivity = (idx: number) => {
    const updated = annual.activities.filter((_, i) => i !== idx);
    onUpdateData({
      ...data,
      annualPlan: {
        ...annual,
        activities: updated,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-500" />
          ផែនការសកម្មភាពប្រចាំឆ្នាំ
        </h3>
        <button
          onClick={() => onShowToast && onShowToast('បានរក្សាទុកផែនការប្រចាំឆ្នាំ')}
          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>រក្សាទុក</span>
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            គោលបំណងរួមប្រចាំឆ្នាំ
          </label>
          <textarea
            rows={3}
            value={annual.objectives || ''}
            onChange={(e) => handleObjectiveChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-750"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              តារាងសកម្មភាពប្រចាំឆ្នាំ
            </label>
            <button
              onClick={handleAddActivity}
              className="px-2.5 py-1 bg-amber-100 dark:bg-slate-700 text-amber-900 dark:text-amber-300 rounded-lg font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> បន្ថែមសកម្មភាព
            </button>
          </div>

          <div className="space-y-2">
            {annual.activities.map((act, idx) => (
              <div
                key={idx}
                className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-750"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-semibold">{act.title}</span>
                  <span className="text-slate-500">ខែ៖ {act.month}</span>
                  <span className="text-slate-500">អ្នកទទួលខុសត្រូវ៖ {act.responsible}</span>
                </div>
                <button
                  onClick={() => handleDeleteActivity(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
