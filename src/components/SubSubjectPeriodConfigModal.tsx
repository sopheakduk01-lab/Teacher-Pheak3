import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  X,
  Calendar,
  Check,
  Plus,
  Copy,
  Info,
  Layers,
  RotateCcw,
  Search,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  getAllPrimarySubSubjects,
  PRIMARY_SUB_SUBJECTS,
  PrimarySubSubject,
  getCustomSubSubjects,
  saveCustomSubSubjects,
} from '../utils/gradeManager';

export interface EvaluationPeriodConfigItem {
  key: string;
  label: string;
  shortLabel: string;
  semesterNum: 1 | 2;
  isExam?: boolean;
}

export const CONFIGURABLE_PERIODS: EvaluationPeriodConfigItem[] = [
  // Semester 1
  { key: 'm10', label: 'ខែតុលា (Oct)', shortLabel: 'តុលា', semesterNum: 1 },
  { key: 'm11', label: 'ខែវិច្ឆិកា (Nov)', shortLabel: 'វិច្ឆិកា', semesterNum: 1 },
  { key: 'm12', label: 'ខែធ្នូ (Dec)', shortLabel: 'ធ្នូ', semesterNum: 1 },
  { key: 'm01', label: 'ខែមករា (Jan)', shortLabel: 'មករា', semesterNum: 1 },
  { key: 's1_exam', label: 'ប្រឡងឆមាសទី១ (S1 Exam)', shortLabel: 'ប្រឡង ឆ.១', semesterNum: 1, isExam: true },

  // Semester 2
  { key: 'm02', label: 'ខែកុម្ភៈ (Feb)', shortLabel: 'កុម្ភៈ', semesterNum: 2 },
  { key: 'm03', label: 'ខែមីនា (Mar)', shortLabel: 'មីនា', semesterNum: 2 },
  { key: 'm04', label: 'ខែមេសា (Apr)', shortLabel: 'មេសា', semesterNum: 2 },
  { key: 'm05', label: 'ខែឧសភា (May)', shortLabel: 'ឧសភា', semesterNum: 2 },
  { key: 'm06', label: 'ខែមិថុនា (Jun)', shortLabel: 'មិថុនា', semesterNum: 2 },
  { key: 'm07', label: 'ខែកក្កដា (Jul)', shortLabel: 'កក្កដា', semesterNum: 2 },
  { key: 's2_exam', label: 'ប្រឡងឆមាសទី២ (S2 Exam)', shortLabel: 'ប្រឡង ឆ.២', semesterNum: 2, isExam: true },
];

export interface SubSubjectPeriodConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPeriodKey?: string;
  periodSubSubjectsMap?: Record<string, string[]>;
  activeSubSubjects?: string[];
  defaultActiveSubSubjects?: string[];
  globalActiveSubSubjects?: string[];
  allDefs?: PrimarySubSubject[];
  onSavePeriodSubSubjects?: (periodKey: string, subIds: string[]) => void;
  onSavePeriodConfig?: (periodKey: string, subIds: string[]) => void;
  onApplyToAllPeriods: (subIds: string[]) => void;
  onAddCustomSubSubject?: (newSub: PrimarySubSubject) => void;
  onShowToast?: (msg: string) => void;
  activeAcademicYear?: string;
}

export const SubSubjectPeriodConfigModal: React.FC<SubSubjectPeriodConfigModalProps> = ({
  isOpen,
  onClose,
  initialPeriodKey = 'm10',
  periodSubSubjectsMap = {},
  activeSubSubjects,
  defaultActiveSubSubjects,
  globalActiveSubSubjects,
  allDefs,
  onSavePeriodSubSubjects,
  onSavePeriodConfig,
  onApplyToAllPeriods,
  onAddCustomSubSubject,
  onShowToast,
  activeAcademicYear,
}) => {
  // Determine safe starting period
  const safeInitialKey =
    initialPeriodKey === 's1_summary'
      ? 'm10'
      : initialPeriodKey === 's2_summary'
      ? 'm02'
      : initialPeriodKey === 'annual_summary'
      ? 'm10'
      : initialPeriodKey || 'm10';

  const getFallbackSubs = (): string[] => {
    const list = activeSubSubjects || globalActiveSubSubjects || defaultActiveSubSubjects;
    if (Array.isArray(list) && list.length > 0) return list;
    return getAllPrimarySubSubjects()
      .filter((s) => s.defaultSelected)
      .map((s) => s.id);
  };

  const [activeConfigPeriodKey, setActiveConfigPeriodKey] = useState<string>(safeInitialKey);
  const [activeSemesterTab, setActiveSemesterTab] = useState<1 | 2>(() => {
    return safeInitialKey.startsWith('m02') || safeInitialKey.startsWith('m03') || safeInitialKey.startsWith('m04') || safeInitialKey.startsWith('m05') || safeInitialKey.startsWith('m06') || safeInitialKey === 's2_exam' ? 2 : 1;
  });
  const [localPeriodMap, setLocalPeriodMap] = useState<Record<string, string[]>>(() => ({
    ...(periodSubSubjectsMap || {}),
  }));
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>(() => {
    const existingForStart = (periodSubSubjectsMap || {})[safeInitialKey];
    if (existingForStart && Array.isArray(existingForStart) && existingForStart.length > 0) {
      return existingForStart;
    }
    return getFallbackSubs();
  });
  const [customSubs, setCustomSubs] = useState<PrimarySubSubject[]>(() => getCustomSubSubjects());
  const [copySourcePeriod, setCopySourcePeriod] = useState<string>('m10');

  // Search and category filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'khmer' | 'math' | 'science' | 'social' | 'other'>('all');

  // New custom sub-subject form fields
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCategory, setNewSubCategory] = useState<'khmer' | 'math' | 'science' | 'social' | 'other'>('khmer');

  // Track when modal opens to initialize selection once without continuous re-triggering
  const prevIsOpenRef = React.useRef(isOpen);

  useEffect(() => {
    if (!prevIsOpenRef.current && isOpen) {
      const initialKey =
        initialPeriodKey === 's1_summary' || initialPeriodKey === 'annual_summary'
          ? 'm10'
          : initialPeriodKey === 's2_summary'
          ? 'm02'
          : initialPeriodKey || 'm10';

      setActiveConfigPeriodKey(initialKey);
      setLocalPeriodMap({ ...(periodSubSubjectsMap || {}) });

      const existingForStart = (periodSubSubjectsMap || {})[initialKey];
      const startSubs =
        existingForStart && Array.isArray(existingForStart) && existingForStart.length > 0
          ? existingForStart
          : getFallbackSubs();
      setSelectedSubIds(startSubs);
      setSearchQuery('');
      setActiveCategoryFilter('all');
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  const allAvailableSubSubjects = allDefs || getAllPrimarySubSubjects();
  const currentPeriodMeta =
    CONFIGURABLE_PERIODS.find((p) => p.key === activeConfigPeriodKey) || CONFIGURABLE_PERIODS[0];

  const handlePeriodSwitch = (newKey: string) => {
    // Stage current selection before switching
    const updatedMap = {
      ...localPeriodMap,
      [activeConfigPeriodKey]: selectedSubIds,
    };
    setLocalPeriodMap(updatedMap);
    setActiveConfigPeriodKey(newKey);

    // Load subIds for newKey
    const forNewPeriod = updatedMap[newKey] || (periodSubSubjectsMap || {})[newKey];
    const nextSubs =
      forNewPeriod && Array.isArray(forNewPeriod) && forNewPeriod.length > 0
        ? forNewPeriod
        : getFallbackSubs();
    setSelectedSubIds(nextSubs);
  };

  const handleToggleSub = (subId: string) => {
    setSelectedSubIds((prev) => {
      const updated = prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId];
      setLocalPeriodMap((map) => ({
        ...map,
        [activeConfigPeriodKey]: updated,
      }));
      return updated;
    });
  };

  const handleSelectCategory = (cat: 'khmer' | 'math' | 'science' | 'social' | 'other') => {
    const catSubIds = allAvailableSubSubjects.filter((s) => s.category === cat).map((s) => s.id);
    setSelectedSubIds((prev) => {
      const union = Array.from(new Set([...prev, ...catSubIds]));
      setLocalPeriodMap((map) => ({
        ...map,
        [activeConfigPeriodKey]: union,
      }));
      return union;
    });
    onShowToast?.(`បានជ្រើសរើសមុខវិជ្ជារងក្នុងក្រុមនេះទាំងអស់!`);
  };

  const handleDeselectCategory = (cat: 'khmer' | 'math' | 'science' | 'social' | 'other') => {
    const catSubIds = new Set(allAvailableSubSubjects.filter((s) => s.category === cat).map((s) => s.id));
    setSelectedSubIds((prev) => {
      const remaining = prev.filter((id) => !catSubIds.has(id));
      setLocalPeriodMap((map) => ({
        ...map,
        [activeConfigPeriodKey]: remaining,
      }));
      return remaining;
    });
    onShowToast?.(`បានដោះមុខវិជ្ជារងក្នុងក្រុមនេះទាំងអស់!`);
  };

  const handleResetDefaults = () => {
    const std = getAllPrimarySubSubjects()
      .filter((s) => s.defaultSelected)
      .map((s) => s.id);
    setSelectedSubIds(std);
    setLocalPeriodMap((map) => ({
      ...map,
      [activeConfigPeriodKey]: std,
    }));
    onShowToast?.('បានកំណត់មុខវិជ្ជារងស្ដង់ដារ (១២ មុខ) រួចរាល់!');
  };

  const handleSelectAll = () => {
    const all = allAvailableSubSubjects.map((s) => s.id);
    setSelectedSubIds(all);
    setLocalPeriodMap((map) => ({
      ...map,
      [activeConfigPeriodKey]: all,
    }));
    onShowToast?.('បានជ្រើសរើសមុខវិជ្ជារងទាំងអស់!');
  };

  const handleDeselectAll = () => {
    setSelectedSubIds([]);
    setLocalPeriodMap((map) => ({
      ...map,
      [activeConfigPeriodKey]: [],
    }));
    onShowToast?.('បានដោះការជ្រើសរើសទាំងអស់!');
  };

  const handleCopyFromPeriod = () => {
    const sourceIds = localPeriodMap[copySourcePeriod] || periodSubSubjectsMap[copySourcePeriod] || getFallbackSubs();
    if (sourceIds && sourceIds.length > 0) {
      setSelectedSubIds(sourceIds);
      setLocalPeriodMap((map) => ({
        ...map,
        [activeConfigPeriodKey]: sourceIds,
      }));
      const srcMeta = CONFIGURABLE_PERIODS.find((p) => p.key === copySourcePeriod);
      onShowToast?.(`បានចម្លងមុខវិជ្ជារងពី ${srcMeta?.label || copySourcePeriod} រួចរាល់!`);
    } else {
      onShowToast?.('មិនមានទិន្នន័យពីខែដែលបានជ្រើសនោះទេ!');
    }
  };

  const handleSaveCurrent = () => {
    // Stage and save current period
    const updatedMap = {
      ...localPeriodMap,
      [activeConfigPeriodKey]: selectedSubIds,
    };
    if (onSavePeriodSubSubjects) {
      onSavePeriodSubSubjects(activeConfigPeriodKey, selectedSubIds);
    }
    if (onSavePeriodConfig) {
      onSavePeriodConfig(activeConfigPeriodKey, selectedSubIds);
    }
    // Also save any other staged periods that were touched
    Object.entries(updatedMap).forEach(([k, ids]) => {
      if (k !== activeConfigPeriodKey) {
        if (onSavePeriodSubSubjects) onSavePeriodSubSubjects(k, ids);
        if (onSavePeriodConfig) onSavePeriodConfig(k, ids);
      }
    });

    onShowToast?.(`✅ បានរក្សាទុកមុខវិជ្ជារង «${currentPeriodMeta.label}» (${selectedSubIds.length} មុខ) ដោយជោគជ័យ!`);
    onClose();
  };

  const handleApplyAll = () => {
    onApplyToAllPeriods(selectedSubIds);
    onShowToast?.('✅ បានកំណត់ និងអនុវត្តមុខវិជ្ជារងចំពោះគ្រប់ខែ និងសម័យប្រឡងទាំងអស់ជោគជ័យ!');
    onClose();
  };

  const handleAddCustomSub = () => {
    if (!newSubName.trim()) {
      onShowToast?.('សូមបញ្ចូលឈ្មោះមុខវិជ្ជារង ឬសមត្ថភាពថ្មី!');
      return;
    }
    const newId = `custom_${Date.now()}`;
    const newSub: PrimarySubSubject = {
      id: newId,
      name: newSubName.trim(),
      category: newSubCategory,
      defaultSelected: true,
    };
    const updatedCustoms = [...customSubs, newSub];
    setCustomSubs(updatedCustoms);
    saveCustomSubSubjects(updatedCustoms);
    onAddCustomSubSubject?.(newSub);
    const updatedSelected = [...selectedSubIds, newId];
    setSelectedSubIds(updatedSelected);
    setLocalPeriodMap((map) => ({
      ...map,
      [activeConfigPeriodKey]: updatedSelected,
    }));
    setNewSubName('');
    setIsAddCustomOpen(false);
    onShowToast?.(`បានបន្ថែម «${newSub.name}» និងជ្រើសរើសរួចរាល់!`);
  };

  // Filter categories by search and category filter
  const categoryMetadata: Record<'khmer' | 'math' | 'science' | 'social' | 'other', {
    title: string;
    subTitle: string;
    icon: React.ReactNode;
    colorClasses: string;
    badgeBg: string;
  }> = {
    khmer: {
      title: 'ភាសាខ្មែរ',
      subTitle: 'Khmer Language Competencies',
      icon: <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      colorClasses: 'border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
    },
    math: {
      title: 'គណិតវិទ្យា',
      subTitle: 'Mathematics Competencies',
      icon: <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      colorClasses: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    },
    science: {
      title: 'វិទ្យាសាស្ត្រ',
      subTitle: 'Science Competencies',
      icon: <FlaskConical className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      colorClasses: 'border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
    },
    social: {
      title: 'សិក្សាសង្គម',
      subTitle: 'Social Studies & Moral',
      icon: <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      colorClasses: 'border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    },
    other: {
      title: 'សុខភាព អប់រំកាយ និងបំណិនផ្សេងៗ',
      subTitle: 'Physical Education, Arts & Skills',
      icon: <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      colorClasses: 'border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20',
      badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
    },
  };

  const categoriesOrder: Array<'khmer' | 'math' | 'science' | 'social' | 'other'> = [
    'khmer',
    'math',
    'science',
    'social',
    'other',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-1 sm:p-3 md:p-4 no-print animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-6xl w-full h-[98dvh] sm:h-[94vh] flex flex-col shadow-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden relative">
        {/* Top Header with HIGHLY PROMINENT Save Button */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white truncate">
                  ជ្រើសរើសមុខវិជ្ជារងបឋមសិក្សា
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white shadow-xs">
                  {currentPeriodMeta.label}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200">
                  បានរើស {selectedSubIds.length} មុខ
                </span>
              </div>
            </div>
          </div>

          {/* Top Header: BIG EMERALD SAVE BUTTON */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSaveCurrent}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition active:scale-95 cursor-pointer ring-2 ring-emerald-400"
              title="ចុចទីនេះដើម្បីរក្សាទុកមុខវិជ្ជាសម្រាប់ខែនេះ"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
              <span>💾 រក្សាទុក (SAVE)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 sm:p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              title="បិទផ្ទាំង"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Compact Period Switcher Bar (Semester Tabs + Month Chips in ONE Sleek Row) */}
        <div className="px-3 sm:px-6 py-2 bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
          {/* Semester Selector Toggle */}
          <div className="flex items-center p-0.5 bg-slate-200/80 dark:bg-slate-700 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveSemesterTab(1)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                activeSemesterTab === 1
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              📘 ឆមាសទី១
            </button>
            <button
              type="button"
              onClick={() => setActiveSemesterTab(2)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                activeSemesterTab === 2
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              📗 ឆមាសទី២
            </button>
          </div>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 shrink-0 mx-1" />

          {/* Month Pills for Active Semester */}
          <div className="flex items-center gap-1.5 shrink-0">
            {CONFIGURABLE_PERIODS.filter((p) => p.semesterNum === activeSemesterTab).map((p) => {
              const isCur = activeConfigPeriodKey === p.key;
              const count = (localPeriodMap[p.key] || periodSubSubjectsMap[p.key] || getFallbackSubs()).length;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handlePeriodSwitch(p.key)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    isCur
                      ? activeSemesterTab === 1
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                        : 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{p.shortLabel}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isCur
                        ? 'bg-black/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-1 shrink-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:inline font-bold">
              កំពុងកំណត់៖ <strong className="text-blue-600 dark:text-blue-400">{currentPeriodMeta.label}</strong>
            </span>
          </div>
        </div>

        {/* Search, Filter Tabs & Quick Action Toolbar (Ultra-Compact, Single Row) */}
        <div className="px-3 sm:px-6 py-2 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ស្វែងរកមុខវិជ្ជារង..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer whitespace-nowrap ${
                activeCategoryFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              ទាំងអស់ ({allAvailableSubSubjects.length})
            </button>
            {categoriesOrder.map((cat) => {
              const meta = categoryMetadata[cat];
              const catSubs = allAvailableSubSubjects.filter((s) => s.category === cat);
              const countSelected = catSubs.filter((s) => selectedSubIds.includes(s.id)).length;
              const isCatActive = activeCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2 py-1 rounded-lg text-xs font-black transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                    isCatActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{meta.title.split(' ')[0]}</span>
                  <span className={`text-[10px] px-1 py-0.1 rounded-full ${isCatActive ? 'bg-blue-800 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {countSelected}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-bold transition cursor-pointer"
              title="ជ្រើសរើសមុខវិជ្ជារងទាំងអស់"
            >
              + រើសទាំងអស់
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-lg text-xs font-bold transition cursor-pointer"
              title="ដោះការជ្រើសរើសទាំងអស់"
            >
              - ដោះចេញ
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 rounded-lg text-xs font-bold transition cursor-pointer"
              title="កំណត់តាមស្តង់ដារ ១២ មុខ"
            >
              ស្ដង់ដារ (១២)
            </button>
            <button
              type="button"
              onClick={() => setIsAddCustomOpen(!isAddCustomOpen)}
              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              <span>ថែមមុខវិជ្ជា</span>
            </button>
          </div>
        </div>

        {/* Collapsible Add Custom Sub-Subject Form */}
        {isAddCustomOpen && (
          <div className="px-5 sm:px-7 py-3 bg-indigo-50/90 dark:bg-indigo-950/40 border-b border-indigo-200 dark:border-indigo-800 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-indigo-950 dark:text-indigo-200 text-xs sm:text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>បង្កើតមុខវិជ្ជារង ឬសមត្ថភាពថ្មីសម្រាប់ដាក់លើតារាង</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAddCustomOpen(false)}
                className="text-indigo-600 hover:text-indigo-900 text-xs font-bold"
              >
                បិទផ្ទាំងនេះ ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="ឈ្មោះមុខវិជ្ជារង/សមត្ថភាពថ្មី..."
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value as any)}
                className="bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="khmer">ភាសាខ្មែរ (Khmer)</option>
                <option value="math">គណិតវិទ្យា (Math)</option>
                <option value="science">វិទ្យាសាស្ត្រ (Science)</option>
                <option value="social">សិក្សាសង្គម (Social)</option>
                <option value="other">ផ្សេងៗ / អប់រំកាយ (Other)</option>
              </select>
              <button
                type="button"
                onClick={handleAddCustomSub}
                className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>បញ្ចូលទៅក្នុងតារាងភ្លាមៗ</span>
              </button>
            </div>
          </div>
        )}

        {/* MAIN SCROLLABLE SUB-SUBJECTS SELECTION AREA - SPACIOUS & ACCESSIBLE */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-7 space-y-6 overscroll-contain bg-slate-50/40 dark:bg-slate-900/40">
          {categoriesOrder
            .filter((cat) => activeCategoryFilter === 'all' || activeCategoryFilter === cat)
            .map((category) => {
              const meta = categoryMetadata[category];
              let subs = allAvailableSubSubjects.filter((s) => s.category === category);
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                subs = subs.filter((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
              }

              if (subs.length === 0) return null;
              const selectedInCat = subs.filter((s) => selectedSubIds.includes(s.id)).length;
              const isAllInCatSelected = selectedInCat === subs.length;

              return (
                <div
                  key={category}
                  className={`border rounded-3xl p-4 sm:p-6 space-y-3.5 transition shadow-xs ${meta.colorClasses}`}
                >
                  {/* Category Header with Quick Select/Deselect */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs">
                        {meta.icon}
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{meta.title}</span>
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${meta.badgeBg}`}>
                            {selectedInCat} / {subs.length} មុខ
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {meta.subTitle}
                        </p>
                      </div>
                    </div>

                    {/* Category quick buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectCategory(category)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          isAllInCatSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        + រើសទាំងអស់ ({subs.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeselectCategory(category)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200 hover:bg-rose-50"
                      >
                        - ដោះចេញ
                      </button>
                    </div>
                  </div>

                  {/* Spacious Sub-Subject Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                    {subs.map((sub) => {
                      const isSelected = selectedSubIds.includes(sub.id);
                      return (
                        <div
                          key={sub.id}
                          onClick={() => handleToggleSub(sub.id)}
                          className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition select-none ${
                            isSelected
                              ? 'bg-emerald-50/95 dark:bg-emerald-950/50 border-emerald-500 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-100'
                              : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs'
                          }`}
                        >
                          {/* Large Checkbox Element */}
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-sm sm:text-[15px] font-black leading-snug">
                                {sub.name}
                              </span>
                              {sub.defaultSelected && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 shrink-0">
                                  ស្តង់ដារ
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                              {sub.id}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {/* Empty state if search yields no result */}
          {searchQuery && allAvailableSubSubjects.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-bold">រកមិនឃើញមុខវិជ្ជារង «{searchQuery}» ទេ</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline"
              >
                សម្អាតការស្វែងរក
              </button>
            </div>
          )}
        </div>

        {/* STICKY BOTTOM ACTION BAR: EXTREMELY PROMINENT SAVE & APPLY BUTTONS */}
        <div className="p-4 sm:p-5 border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 shadow-lg">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleApplyAll}
              className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-2xl text-xs sm:text-sm font-black border border-slate-300 dark:border-slate-600 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              title="កំណត់មុខវិជ្ជារងដែលបានរើសនេះចំពោះគ្រប់ខែ និងឆមាសទាំងអស់"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>អនុវត្តគ្រប់ខែ & ឆមាសទាំងអស់ (Apply All)</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-3 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
              title="ត្រឡប់ទៅមុខវិជ្ជារងស្ដង់ដារ ១២ មុខ"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ស្ដង់ដារ</span>
            </button>
          </div>

          {/* Right Action: Cancel & BIG EMERALD SAVE BUTTON */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              បោះបង់
            </button>

            <button
              type="button"
              onClick={handleSaveCurrent}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-6 sm:px-8 py-3.5 rounded-2xl text-sm sm:text-base font-black shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer ring-4 ring-emerald-400/30"
              title="រក្សាទុកមុខវិជ្ជារងសម្រាប់ខែនេះ"
            >
              <Save className="w-5 h-5 text-white stroke-[2.5]" />
              <span>💾 រក្សាទុកសម្រាប់ {currentPeriodMeta.label} ({selectedSubIds.length} មុខ)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

