import React from 'react';
import { Award, Save } from 'lucide-react';
import { OfficialCommitteeData } from '../../types/committeeTypes';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (data: OfficialCommitteeData) => void;
  onShowToast?: (msg: string) => void;
}

export const CommitteeMandateManager: React.FC<Props> = ({
  data,
  onUpdateData,
  onShowToast,
}) => {
  const handleChange = (key: string, val: string) => {
    onUpdateData({ ...data, [key]: val });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          លិខិតបង្គាប់ការបង្កើតគណៈកម្មការ
        </h3>
        <button
          onClick={() => onShowToast && onShowToast('បានរក្សាទុកព័ត៌មានលិខិតបង្គាប់ការ')}
          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>រក្សាទុក</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            លេខលិខិតបង្គាប់ការ
          </label>
          <input
            type="text"
            value={data.mandateNumber || ''}
            onChange={(e) => handleChange('mandateNumber', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-750"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            កាលបរិច្ឆេទចេញលិខិត
          </label>
          <input
            type="text"
            value={data.mandateDate || ''}
            onChange={(e) => handleChange('mandateDate', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-750"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            ឈ្មោះនាយកសាលា (អ្នកចុះហត្ថលេខា)
          </label>
          <input
            type="text"
            value={data.principalName || ''}
            onChange={(e) => handleChange('principalName', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-750"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            ឈ្មោះគ្រូបន្ទុកថ្នាក់
          </label>
          <input
            type="text"
            value={data.teacherName || ''}
            onChange={(e) => handleChange('teacherName', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-750"
          />
        </div>
      </div>
    </div>
  );
};
