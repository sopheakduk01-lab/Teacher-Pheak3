import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Check,
  Printer,
  Sparkles,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  AnnualPlanActivity,
  MONTH_COLUMNS,
  OfficialCommitteeData,
} from '../../types/committeeTypes';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (newData: OfficialCommitteeData) => void;
  onShowToast: (msg: string) => void;
}

export const CommitteeAnnualPlanManager: React.FC<Props> = ({
  data,
  onUpdateData,
  onShowToast,
}) => {
  const [editingActivity, setEditingActivity] = useState<AnnualPlanActivity | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleToggleMonth = (activityId: string, monthKey: string) => {
    const updated = data.annualActivities.map((act) => {
      if (act.id === activityId) {
        return {
          ...act,
          months: {
            ...act.months,
            [monthKey]: !act.months[monthKey],
          },
        };
      }
      return act;
    });
    onUpdateData({ ...data, annualActivities: updated });
  };

  const handleOpenAdd = () => {
    const defaultMonths: { [key: string]: boolean } = {};
    MONTH_COLUMNS.forEach((col) => {
      defaultMonths[col.key] = false;
    });
    setEditingActivity({
      id: `annual_${Date.now()}`,
      title: `${data.annualActivities.length + 1}. `,
      months: defaultMonths,
    });
    setIsAddingNew(true);
  };

  const handleSaveActivity = (act: AnnualPlanActivity) => {
    if (!act.title.trim()) {
      onShowToast('⚠️ សូមបញ្ចូលឈ្មោះសកម្មភាព!');
      return;
    }

    let updatedList = [...data.annualActivities];
    if (isAddingNew) {
      updatedList.push(act);
      onShowToast('✨ បានបន្ថែមសកម្មភាពប្រចាំឆ្នាំថ្មី!');
    } else {
      updatedList = updatedList.map((item) => (item.id === act.id ? act : item));
      onShowToast('💾 បានកែសម្រួលសកម្មភាពប្រចាំឆ្នាំរួចរាល់!');
    }

    onUpdateData({ ...data, annualActivities: updatedList });
    setEditingActivity(null);
    setIsAddingNew(false);
  };

  const handleDeleteActivity = (id: string, title: string) => {
    if (confirm(`តើអ្នកពិតជាចង់លុបសកម្មភាព «${title}» មែនទេ?`)) {
      const updatedList = data.annualActivities.filter((act) => act.id !== id);
      onUpdateData({ ...data, annualActivities: updatedList });
      onShowToast('🗑️ បានលុបសកម្មភាពរួចរាល់!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                ផ្នែកទី ៥ • តារាងកាលវិភាគការងារ
              </span>
              <h2 className="text-base sm:text-xl font-black font-moul text-slate-900 dark:text-white mt-0.5">
                ៥. ផែនការសកម្មភាពប្រចាំឆ្នាំ (Annual Action Plan)
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ចុចលើប្រអប់ខែនីមួយៗដើម្បីជ្រើសរើសខែអនុវត្ត ឬចុចបន្ថែម/កែសម្រួល/លុបសកម្មភាព
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែមសកម្មភាពថ្មី</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>សកម្មភាពសរុប៖ {data.annualActivities.length} សកម្មភាព</span>
          <span className="italic text-slate-500">💡 គូសសញ្ញា (✔) លើខែដែលត្រូវអនុវត្ត</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs text-left min-w-[780px]">
            <thead className="bg-[#071539] text-amber-300 font-bold">
              <tr>
                <th className="p-3.5 border-r border-amber-400/20 w-12 text-center">ល.រ</th>
                <th className="p-3.5 border-r border-amber-400/20 min-w-[240px]">សកម្មភាពការងារ</th>
                {MONTH_COLUMNS.map((col) => (
                  <th key={col.key} className="p-2 border-r border-amber-400/20 text-center font-bold text-[11px] w-14">
                    {col.label}
                  </th>
                ))}
                <th className="p-3.5 text-center w-20">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {data.annualActivities.map((act, idx) => (
                <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3 font-bold text-center border-r border-slate-100 dark:border-slate-800">
                    {idx + 1}
                  </td>
                  <td className="p-3 font-medium border-r border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                    {act.title}
                  </td>
                  {MONTH_COLUMNS.map((col) => {
                    const isChecked = !!act.months[col.key];
                    return (
                      <td
                        key={col.key}
                        onClick={() => handleToggleMonth(act.id, col.key)}
                        className="p-2 text-center border-r border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-amber-100/50 dark:hover:bg-slate-700 transition"
                        title={`ចុចបើក/បិទ ${col.label}`}
                      >
                        <div
                          className={`w-5 h-5 mx-auto rounded-md flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-amber-500 text-slate-950 font-black shadow-xs scale-105'
                              : 'border border-slate-300 dark:border-slate-600 hover:border-amber-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          setEditingActivity({ ...act });
                          setIsAddingNew(false);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        title="កែសម្រួល"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(act.id, act.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                        title="លុប"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Activity Modal */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-moul flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span>{isAddingNew ? 'បន្ថែមសកម្មភាពប្រចាំឆ្នាំ' : 'កែសម្រួលសកម្មភាព'}</span>
              </h3>
              <button
                onClick={() => setEditingActivity(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ចំណងជើងសកម្មភាព *
                </label>
                <input
                  type="text"
                  value={editingActivity.title}
                  onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  placeholder="ឧ. ចូលរួមក្នុងសកម្មភាពតេស្តដើមឆ្នាំ..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ជ្រើសរើសខែដែលត្រូវអនុវត្ត ៖
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {MONTH_COLUMNS.map((col) => {
                    const isChecked = !!editingActivity.months[col.key];
                    return (
                      <button
                        key={col.key}
                        type="button"
                        onClick={() =>
                          setEditingActivity({
                            ...editingActivity,
                            months: {
                              ...editingActivity.months,
                              [col.key]: !isChecked,
                            },
                          })
                        }
                        className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-between ${
                          isChecked
                            ? 'bg-amber-500 text-slate-950 border-amber-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span>{col.label}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={() => handleSaveActivity(editingActivity)}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>រក្សាទុក</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
