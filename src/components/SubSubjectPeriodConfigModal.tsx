import React, { useState } from 'react';
import { X, Check, Save, Settings2 } from 'lucide-react';

export const CONFIGURABLE_PERIODS = [
  { key: 'm10', label: 'ខែ តុលា' },
  { key: 'm11', label: 'ខែ វិច្ឆិកា' },
  { key: 'm12', label: 'ខែ ធ្នូ' },
  { key: 'm01', label: 'ខែ មករា' },
  { key: 's1', label: 'ប្រឡងឆមាសទី១' },
  { key: 'm02', label: 'ខែ កុម្ភៈ' },
  { key: 'm03', label: 'ខែ មីនា' },
  { key: 'm04', label: 'ខែ មេសា' },
  { key: 'm05', label: 'ខែ ឧសភា' },
  { key: 'm06', label: 'ខែ មិថុនា' },
  { key: 's2', label: 'ប្រឡងឆមាសទី២' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialPeriodKey?: string;
  periodSubSubjectsMap?: Record<string, string[]>;
  activeSubSubjects?: string[];
  allDefs?: any[];
  onSavePeriodSubSubjects?: (periodKey: string, subIds: string[]) => void;
}

export const SubSubjectPeriodConfigModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialPeriodKey = 'm10',
  periodSubSubjectsMap = {},
  allDefs = [],
  onSavePeriodSubSubjects,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriodKey);
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>(
    periodSubSubjectsMap[initialPeriodKey] || []
  );

  if (!isOpen) return null;

  const handlePeriodChange = (key: string) => {
    setSelectedPeriod(key);
    setSelectedSubIds(periodSubSubjectsMap[key] || []);
  };

  const toggleSub = (id: string) => {
    if (selectedSubIds.includes(id)) {
      setSelectedSubIds(selectedSubIds.filter((s) => s !== id));
    } else {
      setSelectedSubIds([...selectedSubIds, id]);
    }
  };

  const handleSave = () => {
    if (onSavePeriodSubSubjects) {
      onSavePeriodSubSubjects(selectedPeriod, selectedSubIds);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-khmer">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">កំណត់មុខវិជ្ជារង និងសមត្ថភាពតាមខែ</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Period selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CONFIGURABLE_PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => handlePeriodChange(p.key)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  selectedPeriod === p.key
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-700 dark:text-slate-300">
              ជ្រើសរើសមុខវិជ្ជារង/សមត្ថភាព ៖
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allDefs.map((def: any) => {
                const isChecked = selectedSubIds.includes(def.id);
                return (
                  <div
                    key={def.id}
                    onClick={() => toggleSub(def.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isChecked
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{def.name || def.label || def.id}</span>
                    {isChecked && <Check className="w-4 h-4 text-purple-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
          >
            បោះបង់
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> រក្សាទុក
          </button>
        </div>
      </div>
    </div>
  );
};
