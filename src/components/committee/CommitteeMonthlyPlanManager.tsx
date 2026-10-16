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
  FileCheck,
} from 'lucide-react';
import {
  MonthlyPlanActivity,
  OfficialCommitteeData,
} from '../../types/committeeTypes';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (newData: OfficialCommitteeData) => void;
  onShowToast: (msg: string) => void;
}

export const CommitteeMonthlyPlanManager: React.FC<Props> = ({
  data,
  onUpdateData,
  onShowToast,
}) => {
  const [editingActivity, setEditingActivity] = useState<MonthlyPlanActivity | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleOpenAdd = () => {
    setEditingActivity({
      id: `monthly_${Date.now()}`,
      num: `${data.monthlyActivities.length + 1}`,
      title: '',
      dateStr: 'រៀងរាល់ខែ',
      participants: 'សមាជិក គ. គ. ថ.',
      organizer: 'ប្រធាន គ. គ. ថ.',
      note: '',
    });
    setIsAddingNew(true);
  };

  const handleSaveActivity = (act: MonthlyPlanActivity) => {
    if (!act.title.trim()) {
      onShowToast('⚠️ សូមបញ្ចូលឈ្មោះសកម្មភាពប្រចាំខែ!');
      return;
    }

    let updatedList = [...data.monthlyActivities];
    if (isAddingNew) {
      updatedList.push(act);
      onShowToast('✨ បានបន្ថែមសកម្មភាពប្រចាំខែថ្មី!');
    } else {
      updatedList = updatedList.map((item) => (item.id === act.id ? act : item));
      onShowToast('💾 បានកែសម្រួលសកម្មភាពប្រចាំខែរួចរាល់!');
    }

    onUpdateData({ ...data, monthlyActivities: updatedList });
    setEditingActivity(null);
    setIsAddingNew(false);
  };

  const handleDeleteActivity = (id: string, title: string) => {
    if (confirm(`តើអ្នកពិតជាចង់លុបសកម្មភាព «${title}» មែនទេ?`)) {
      const updatedList = data.monthlyActivities.filter((act) => act.id !== id);
      onUpdateData({ ...data, monthlyActivities: updatedList });
      onShowToast('🗑️ បានលុបសកម្មភាពប្រចាំខែរួចរាល់!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
                ផ្នែកទី ៧ • សកម្មភាពប្រចាំខែ និងការសង្កេតការរៀន
              </span>
              <h2 className="text-base sm:text-xl font-black font-moul text-slate-900 dark:text-white mt-0.5">
                ៧. ផែនការសកម្មភាពប្រចាំខែ (Monthly Action Plan)
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ការសង្កេតការរៀនរបស់កូនៗ ការបង្រៀនរបស់គ្រូ និងកិច្ចប្រជុំពិនិត្យលទ្ធផលសិក្សាប្រចាំខែ
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែមសកម្មភាពប្រចាំខែ</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>សកម្មភាពប្រចាំខែសរុប៖ {data.monthlyActivities.length} សកម្មភាព</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="bg-[#071539] text-amber-300 font-bold">
              <tr>
                <th className="p-3.5 border-r border-amber-400/20 w-12 text-center">ល.រ</th>
                <th className="p-3.5 border-r border-amber-400/20 min-w-[220px]">សកម្មភាព</th>
                <th className="p-3.5 border-r border-amber-400/20 w-36">កាលបរិច្ឆេទ</th>
                <th className="p-3.5 border-r border-amber-400/20 w-36">អ្នកចូលរួម</th>
                <th className="p-3.5 border-r border-amber-400/20 w-32">អ្នករៀបចំ</th>
                <th className="p-3.5 border-r border-amber-400/20">ផ្សេងៗ</th>
                <th className="p-3.5 text-center w-20">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {data.monthlyActivities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3 font-bold text-center border-r border-slate-100 dark:border-slate-800">
                    {act.num}
                  </td>
                  <td className="p-3 font-medium border-r border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                    {act.title}
                  </td>
                  <td className="p-3 border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {act.dateStr}
                  </td>
                  <td className="p-3 border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    {act.participants}
                  </td>
                  <td className="p-3 border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-blue-600 dark:text-blue-400">
                    {act.organizer}
                  </td>
                  <td className="p-3 border-r border-slate-100 dark:border-slate-800 text-slate-500 italic">
                    {act.note || '-'}
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          setEditingActivity({ ...act });
                          setIsAddingNew(false);
                        }}
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
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

      {/* Edit / Add Modal */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-moul flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-500" />
                <span>{isAddingNew ? 'បន្ថែមសកម្មភាពប្រចាំខែ' : 'កែសម្រួលសកម្មភាពប្រចាំខែ'}</span>
              </h3>
              <button
                onClick={() => setEditingActivity(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ល.រ
                  </label>
                  <input
                    type="text"
                    value={editingActivity.num}
                    onChange={(e) => setEditingActivity({ ...editingActivity, num: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    សកម្មភាព *
                  </label>
                  <input
                    type="text"
                    value={editingActivity.title}
                    onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                    placeholder="ឧ. សង្កេតការរៀន-បង្រៀន..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    កាលបរិច្ឆេទ
                  </label>
                  <input
                    type="text"
                    value={editingActivity.dateStr}
                    onChange={(e) => setEditingActivity({ ...editingActivity, dateStr: e.target.value })}
                    placeholder="ឧ. រៀងរាល់សប្តាហ៍ទី២..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    អ្នករៀបចំ
                  </label>
                  <input
                    type="text"
                    value={editingActivity.organizer}
                    onChange={(e) => setEditingActivity({ ...editingActivity, organizer: e.target.value })}
                    placeholder="ឧ. ប្រធាន គ. គ. ថ., គ្រូបន្ទុកថ្នាក់..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  អ្នកចូលរួម
                </label>
                <input
                  type="text"
                  value={editingActivity.participants}
                  onChange={(e) => setEditingActivity({ ...editingActivity, participants: e.target.value })}
                  placeholder="ឧ. សមាជិក គ. គ. ថ. ទាំងអស់, តំណាងមាតាបិតា..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ផ្សេងៗ (សម្គាល់)
                </label>
                <input
                  type="text"
                  value={editingActivity.note}
                  onChange={(e) => setEditingActivity({ ...editingActivity, note: e.target.value })}
                  placeholder="ឧ. កត់ត្រាក្នុងសៀវភៅតាមដាន..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
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
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1.5"
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
