import React from 'react';
import { FileText, Save } from 'lucide-react';
import { OfficialCommitteeData } from '../../types/committeeTypes';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (data: OfficialCommitteeData) => void;
  onShowToast?: (msg: string) => void;
}

export const CommitteeMinutesManager: React.FC<Props> = ({
  data,
  onUpdateData,
  onShowToast,
}) => {
  const minutes = data.meetingMinutes || {
    meetingDate: '',
    location: '',
    attendeesCount: 0,
    agenda: '',
    decisions: '',
  };

  const handleChange = (key: string, val: any) => {
    onUpdateData({
      ...data,
      meetingMinutes: {
        ...minutes,
        [key]: val,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          កំណត់ហេតុប្រជុំបង្កើតគណៈកម្មការ
        </h3>
        <button
          onClick={() => onShowToast && onShowToast('បានរក្សាទុកកំណត់ហេតុប្រជុំ')}
          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>រក្សាទុក</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            កាលបរិច្ឆេទប្រជុំ
          </label>
          <input
            type="text"
            value={minutes.meetingDate || ''}
            onChange={(e) => handleChange('meetingDate', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-750"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            ទីកន្លែងប្រជុំ
          </label>
          <input
            type="text"
            value={minutes.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-750"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            ចំនួនអ្នកចូលរួម
          </label>
          <input
            type="number"
            value={minutes.attendeesCount || 0}
            onChange={(e) => handleChange('attendeesCount', Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-750"
          />
        </div>
        <div className="col-span-full">
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            របៀបវារៈប្រជុំ
          </label>
          <textarea
            rows={3}
            value={minutes.agenda || ''}
            onChange={(e) => handleChange('agenda', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-750"
          />
        </div>
        <div className="col-span-full">
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            សេចក្តីសម្រេច
          </label>
          <textarea
            rows={3}
            value={minutes.decisions || ''}
            onChange={(e) => handleChange('decisions', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-750"
          />
        </div>
      </div>
    </div>
  );
};
