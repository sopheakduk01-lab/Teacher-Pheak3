import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Printer,
  Sparkles,
  Save,
  RotateCcw,
  FileText,
  Download,
  Share2,
  ShieldCheck,
  Building,
  Layers,
  Edit3,
  Check,
  School,
  BookOpen,
  Image as ImageIcon,
  Eye,
  Info,
  ChevronRight,
  Upload,
} from 'lucide-react';
import { TeacherProfile } from '../types';
import {
  CommitteeMember,
  OfficialCommitteeData,
  DEFAULT_COMMITTEE_DATA,
} from '../types/committeeTypes';
import { loadYearScopedData, saveYearScopedData } from '../utils/academicYearStorage';

// Sub-components for each of the 7 sections + A4 Booklet
import { CommitteeOrgChart } from './committee/CommitteeOrgChart';
import { CommitteeMembersManager } from './committee/CommitteeMembersManager';
import { CommitteeMandateManager } from './committee/CommitteeMandateManager';
import { CommitteeMinutesManager } from './committee/CommitteeMinutesManager';
import { CommitteeAnnualPlanManager } from './committee/CommitteeAnnualPlanManager';
import { CommitteeQuarterlyPlanManager } from './committee/CommitteeQuarterlyPlanManager';
import { CommitteeMonthlyPlanManager } from './committee/CommitteeMonthlyPlanManager';
import {
  CommitteePrintBooklet,
  CommitteePrintPageScope,
} from './committee/CommitteePrintBooklet';
import { printIsolatedCommitteeBooklet } from '../utils/committeePrintService';

interface Props {
  teacherProfile?: TeacherProfile;
  teacher?: TeacherProfile;
  selectedYearId?: string;
  currentYear?: string;
  onShowToast?: (msg: string) => void;
}

type SectionTab = 'chart' | 'members' | 'mandate' | 'minutes' | 'annual' | 'quarterly' | 'monthly' | 'booklet';

export const ClassroomCommitteeOfficialManager: React.FC<Props> = ({
  teacherProfile,
  teacher,
  selectedYearId,
  currentYear,
  onShowToast: parentShowToast,
}) => {
  const effectiveTeacher = teacherProfile || teacher;
  const effectiveYearId = selectedYearId || currentYear || '2025-2026';

  const [activeTab, setActiveTab] = useState<SectionTab>('chart');
  const [selectedPrintScope, setSelectedPrintScope] = useState<CommitteePrintPageScope>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditingSchoolInfo, setIsEditingSchoolInfo] = useState(false);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);

  // Load committee data from scoped storage
  const [data, setData] = useState<OfficialCommitteeData>(() => {
    const saved = loadYearScopedData<OfficialCommitteeData>(
      'classroom_committee_official_data',
      effectiveYearId,
      DEFAULT_COMMITTEE_DATA
    );
    if (effectiveTeacher) {
      return {
        ...saved,
        schoolName: effectiveTeacher.schoolName || saved.schoolName,
        gradeName: effectiveTeacher.className || saved.gradeName,
        teacherName: effectiveTeacher.name || saved.teacherName,
        provinceName: effectiveTeacher.province || saved.provinceName,
        districtName: effectiveTeacher.district || saved.districtName,
      };
    }
    return saved;
  });

  // Keep data synced when academic year changes
  useEffect(() => {
    const saved = loadYearScopedData<OfficialCommitteeData>(
      'classroom_committee_official_data',
      effectiveYearId,
      DEFAULT_COMMITTEE_DATA
    );
    setData(saved);
  }, [effectiveYearId]);

  const showToast = (msg: string) => {
    if (parentShowToast) parentShowToast(msg);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateData = (newData: OfficialCommitteeData) => {
    setData(newData);
    saveYearScopedData('classroom_committee_official_data', effectiveYearId, newData);
  };

  const handleResetToDefaults = () => {
    if (confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យទាំងអស់មកតាមគំរូដើមរបស់ក្រសួង (MoEYS) វិញមែនទេ?')) {
      handleUpdateData(DEFAULT_COMMITTEE_DATA);
      showToast('🔄 បានកំណត់ទិន្នន័យគំរូដើមរួចរាល់!');
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន_${data.gradeName}_${data.academicYear}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('📥 បានទាញយកទិន្នន័យជាឯកសារ JSON រួចរាល់!');
  };

  const handlePrintAll = (scope: CommitteePrintPageScope = selectedPrintScope) => {
    setSelectedPrintScope(scope);
    const oldTitle = document.title;
    document.title = `សៀវភៅ_គ_គ_ថ_${data.gradeName}_${data.schoolName}_A4`;
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = oldTitle;
      }, 1000);
    }, 150);
  };

  const handleIsolatedDirectPrint = (scope: CommitteePrintPageScope = selectedPrintScope) => {
    setSelectedPrintScope(scope);
    showToast('🖨️ កំពុងរៀបចំផ្ទាំងបោះពុម្ព A4 ស្អាតឥតខ្ចោះ...');
    setTimeout(() => {
      printIsolatedCommitteeBooklet('official-committee-print-content');
    }, 250);
  };

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          handleUpdateData({
            ...data,
            coverPhotoUrl: compressedDataUrl,
          });
          showToast('📷 បានបញ្ចូលរូបថតគម្របដោយជោគជ័យ!');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const tabs: { id: SectionTab; label: string; num: string; icon: any }[] = [
    { id: 'chart', label: 'រចនាសម្ព័ន្ធ (គំនូសបំព្រួញ)', num: '១', icon: Layers },
    { id: 'members', label: 'បំណែងចែកភារកិច្ច & រូបថត', num: '២', icon: Users },
    { id: 'mandate', label: 'លិខិតបង្គាប់ការផ្លូវការ', num: '៣', icon: ShieldCheck },
    { id: 'minutes', label: 'កំណត់ហេតុប្រជុំបោះឆ្នោត', num: '៤', icon: FileText },
    { id: 'annual', label: 'ផែនការសកម្មភាពប្រចាំឆ្នាំ', num: '៥', icon: Calendar },
    { id: 'quarterly', label: 'ផែនការប្រចាំត្រីមាស', num: '៦', icon: Calendar },
    { id: 'monthly', label: 'ផែនការប្រចាំខែ', num: '៧', icon: Calendar },
    { id: 'booklet', label: 'មើលទម្រង់សៀវភៅ A4 & PDF', num: '🖨️', icon: Printer },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#071539] text-amber-300 px-4 py-3 rounded-2xl shadow-2xl border border-amber-400/40 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen view content (Hidden in print) */}
      <div className="space-y-6 print:hidden">
        
        {/* Main Banner Header */}
        <div className="bg-gradient-to-br from-[#0a1b4d] via-[#071539] to-[#040d24] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900/40 relative overflow-hidden">
          {/* Subtle gold decoration background */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-black tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>ស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)</span>
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded-full text-[11px] font-bold">
                  {data.academicYear}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-moul text-amber-300 leading-snug">
                គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន ( គ. គ. ថ. )
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <School className="w-4 h-4 text-amber-400" />
                  <strong>{data.schoolName}</strong>
                </span>
                <span className="text-slate-500">•</span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-lg text-white font-bold">
                  {data.gradeName}
                </span>
                <span className="text-slate-500">•</span>
                <span>នាយកសាលា៖ <strong>{data.principalName}</strong></span>
                <span className="text-slate-500">•</span>
                <span>គ្រូបន្ទុកថ្នាក់៖ <strong>{data.teacherName}</strong></span>

                <button
                  onClick={() => setIsEditingSchoolInfo(!isEditingSchoolInfo)}
                  className="ml-1 text-[11px] text-amber-300 hover:text-white underline font-bold transition flex items-center gap-0.5"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingSchoolInfo ? 'បិទការកែ' : 'កែព័ត៌មានសាលា'}</span>
                </button>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                onClick={() => handleIsolatedDirectPrint('all')}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
                title="បោះពុម្ពសៀវភៅ គ. គ. ថ. ពេញលេញ ១០០%"
              >
                <Printer className="w-4 h-4" />
                <span>បោះពុម្ពសៀវភៅ គ. គ. ថ. (A4)</span>
              </button>

              <button
                onClick={() => setActiveTab('booklet')}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xl text-xs font-bold transition border border-white/15 flex items-center gap-1"
                title="មើលទម្រង់សៀវភៅ A4 & PDF"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">មើលសៀវភៅ</span>
              </button>

              <button
                onClick={handleExportJson}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/15"
                title="ទាញយកជា JSON"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetToDefaults}
                className="p-2.5 bg-white/10 hover:bg-red-500/30 text-white rounded-xl text-xs font-bold transition border border-white/15"
                title="កំណត់ទិន្នន័យគំរូដើម"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Collapsible School / Grade Info Editor */}
          {isEditingSchoolInfo && (
            <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-in fade-in">
              <div>
                <label className="block text-[11px] font-bold text-amber-200 mb-1">ឈ្មោះសាលា</label>
                <input
                  type="text"
                  value={data.schoolName}
                  onChange={(e) => handleUpdateData({ ...data, schoolName: e.target.value })}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-200 mb-1">ឈ្មោះថ្នាក់រៀន</label>
                <input
                  type="text"
                  value={data.gradeName}
                  onChange={(e) => handleUpdateData({ ...data, gradeName: e.target.value })}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-200 mb-1">ឈ្មោះនាយកសាលា</label>
                <input
                  type="text"
                  value={data.principalName}
                  onChange={(e) => handleUpdateData({ ...data, principalName: e.target.value })}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-200 mb-1">ឈ្មោះគ្រូបន្ទុកថ្នាក់</label>
                <input
                  type="text"
                  value={data.teacherName}
                  onChange={(e) => handleUpdateData({ ...data, teacherName: e.target.value })}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-200 mb-1">ឈ្មោះស្រុក/ខណ្ឌ</label>
                <input
                  type="text"
                  value={data.districtName}
                  onChange={(e) => handleUpdateData({ ...data, districtName: e.target.value })}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-200 mb-1">ឈ្មោះខេត្ត/រាជធានី</label>
                <input
                  type="text"
                  value={data.provinceName}
                  onChange={(e) => handleUpdateData({ ...data, provinceName: e.target.value })}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-200 mb-1">ឆ្នាំសិក្សា</label>
                <input
                  type="text"
                  value={data.academicYear}
                  onChange={(e) => handleUpdateData({ ...data, academicYear: e.target.value })}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setIsEditingSchoolInfo(false)}
                  className="w-full p-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>រួចរាល់</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 7 Navigation Tabs + 1 Printable Booklet View Tab */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shrink-0 border ${
                  isActive
                    ? 'bg-[#071539] text-amber-300 border-amber-400/50 shadow-md shadow-blue-950/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-750'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tab.num}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span className={isActive ? 'font-moul text-[11px]' : ''}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Section View Rendered based on Active Tab */}
        <div>
          {activeTab === 'chart' && (
            <CommitteeOrgChart
              data={data}
              onUpdateData={handleUpdateData}
              onEditMember={(member) => {
                setActiveTab('members');
                showToast(`👉 បានប្តូរទៅកាន់ផ្នែកទី២ ដើម្បីកែសម្រួល «${member.name}»`);
              }}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'members' && (
            <CommitteeMembersManager
              data={data}
              onUpdateData={handleUpdateData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'mandate' && (
            <CommitteeMandateManager
              data={data}
              onUpdateData={handleUpdateData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'minutes' && (
            <CommitteeMinutesManager
              data={data}
              onUpdateData={handleUpdateData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'annual' && (
            <CommitteeAnnualPlanManager
              data={data}
              onUpdateData={handleUpdateData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'quarterly' && (
            <CommitteeQuarterlyPlanManager
              data={data}
              onUpdateData={handleUpdateData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'monthly' && (
            <CommitteeMonthlyPlanManager
              data={data}
              onUpdateData={handleUpdateData}
              onShowToast={showToast}
            />
          )}

          {/* Dedicated A4 Print Booklet Viewer & PDF Exporter */}
          {activeTab === 'booklet' && (
            <div className="space-y-6">
              {/* Top Action & Instructions Card */}
              <div className="bg-gradient-to-r from-amber-500/15 via-blue-500/10 to-indigo-500/15 border border-amber-400/40 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-400 text-slate-950">
                      <Printer className="w-5 h-5" />
                    </span>
                    <h3 className="font-moul text-base text-slate-900 dark:text-white">
                      ទម្រង់បោះពុម្ពសៀវភៅ គ. គ. ថ. (A4) & PDF ១០០%
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    ឯកសារត្រូវបានរៀបចំតាមក្បួនខ្នាតរដ្ឋបាលក្រសួងអប់រំ យុវជន និងកីឡា (ទំព័រគម្រប + ៧ ផ្នែកពេញលេញ)។
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <input
                    type="file"
                    ref={coverPhotoInputRef}
                    onChange={handleCoverPhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => coverPhotoInputRef.current?.click()}
                    className="px-3.5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>{data.coverPhotoUrl ? 'ប្តូររូបគម្រប' : 'បញ្ចូលរូបគម្រប'}</span>
                  </button>

                  <button
                    onClick={() => handleIsolatedDirectPrint(selectedPrintScope)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95"
                    title="បោះពុម្ពតាម Iframe ឯករាជ្យ ធានាពេញលេញ ១០០% មិនកាត់ទំព័រ"
                  >
                    <Printer className="w-4 h-4" />
                    <span>បោះពុម្ពផ្ទាល់ (A4 ស្អាតពេញលេញ)</span>
                  </button>

                  <button
                    onClick={() => handlePrintAll(selectedPrintScope)}
                    className="px-3.5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    title="បោះពុម្ពស្តង់ដារ Browser (Ctrl + P)"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>រក្សាទុក PDF (Ctrl+P)</span>
                  </button>
                </div>
              </div>

              {/* Page Selection Scope Filter Tabs */}
              <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2 px-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    📑 ជ្រើសរើសទំព័រសម្រាប់មើល ឬបោះពុម្ព ៖
                  </span>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    {selectedPrintScope === 'all'
                      ? 'កំពុងជ្រើសរើស៖ គ្រប់ទំព័រទាំងអស់ (៨ ទំព័រ)'
                      : `កំពុងជ្រើសរើស៖ ទំព័រឯកត្តកម្ម`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all' as const, label: 'ទាំងអស់ (៨ ទំព័រ)' },
                    { id: 'cover' as const, label: 'ទំព័រគម្រប (១/៨)' },
                    { id: 'chart' as const, label: '១. រចនាសម្ព័ន្ធ (២/៨)' },
                    { id: 'members' as const, label: '២. បំណែងចែកភារកិច្ច (៣/៨)' },
                    { id: 'mandate' as const, label: '៣. លិខិតបង្គាប់ការ (៤/៨)' },
                    { id: 'minutes' as const, label: '៤. កំណត់ហេតុប្រជុំ (៥/៨)' },
                    { id: 'annual' as const, label: '៥. ផែនការប្រចាំឆ្នាំ (៦/៨)' },
                    { id: 'quarterly' as const, label: '៦. ផែនការត្រីមាស (៧/៨)' },
                    { id: 'monthly' as const, label: '៧. ផែនការប្រចាំខែ (៨/៨)' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedPrintScope(tab.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-xs flex items-center gap-1 shrink-0 ${
                        selectedPrintScope === tab.id
                          ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                          : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PDF Tip Helper */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">💡 របៀបទាញយក ឬរក្សាទុកជា PDF ឲ្យស្អាត ១០០% ៖</p>
                  <p className="text-[11px] leading-relaxed">
                    ពេលចុចលើប៊ូតុង <strong>«បោះពុម្ពផ្ទាល់»</strong> ឬ <strong>«រក្សាទុក PDF»</strong> ៖
                    <br />
                    ១. នៅត្រង់កន្លែង <strong>Destination (ម៉ាស៊ីនបោះពុម្ព)</strong> ៖ ជ្រើសរើសយក <strong>Save as PDF (រក្សាទុកជា PDF)</strong>
                    <br />
                    ២. នៅត្រង់កន្លែង <strong>Paper size</strong> ៖ ជ្រើសរើសយក <strong>A4</strong>
                    <br />
                    ៣. នៅត្រង់ <strong>More settings ➔ Options</strong> ៖ គូសធីកលើ <strong>Background graphics</strong> ដើម្បីឲ្យចេញពណ៌ និងស៊ុមស្អាតឥតខ្ចោះ។
                  </p>
                </div>
              </div>

              {/* Render Full Visual Screen Simulation of All 8 A4 Pages */}
              <div className="bg-slate-200 dark:bg-slate-900 p-4 sm:p-8 rounded-3xl border border-slate-300 dark:border-slate-800">
                <div className="text-center pb-4 text-xs font-bold text-slate-500">
                  📄 ការបង្ហាញទម្រង់សៀវភៅជាក់ស្តែងលើក្រដាស A4 {selectedPrintScope !== 'all' ? '(ទំព័រដែលបានជ្រើស)' : '(គ្រប់ទំព័រទាំង ៨)'}
                </div>
                <CommitteePrintBooklet
                  data={data}
                  isScreenPreview={true}
                  printScope={selectedPrintScope}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official A4 Print Booklet (Rendered only during print preview / printing) */}
      <CommitteePrintBooklet data={data} printScope={selectedPrintScope} />
    </div>
  );
};
