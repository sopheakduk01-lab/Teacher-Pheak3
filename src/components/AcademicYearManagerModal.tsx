import React, { useState, useRef } from 'react';
import {
  Calendar,
  Plus,
  Copy,
  Trash2,
  CheckCircle2,
  X,
  Download,
  Upload,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  BookOpen,
  Users,
  Award,
} from 'lucide-react';
import {
  getAcademicYearsList,
  saveAcademicYearsList,
  getActiveAcademicYear,
  setActiveAcademicYear,
  loadCompleteYearBundle,
  cloneYearData,
  deleteYearData,
  exportAllAcademicYearsBackup,
  importAcademicYearsBackup,
  CloneYearOptions,
} from '../utils/academicYearStorage';
import { TeacherProfile } from '../types';

interface AcademicYearManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: string;
  onYearChanged: (newYear: string) => void;
  onShowToast: (msg: string) => void;
  teacherProfile?: TeacherProfile;
}

export const AcademicYearManagerModal: React.FC<AcademicYearManagerModalProps> = ({
  isOpen,
  onClose,
  currentYear,
  onYearChanged,
  onShowToast,
  teacherProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'backup'>('list');
  const [yearsList, setYearsList] = useState<string[]>(() => getAcademicYearsList());
  const [selectedActiveYear, setSelectedActiveYear] = useState<string>(currentYear || getActiveAcademicYear());

  // Create form state
  const [newYearInput, setNewYearInput] = useState<string>('២០២៦ - ២០២៧');
  const [sourceYearForClone, setSourceYearForClone] = useState<string>(currentYear || '២០២៥ - ២០២៦');
  const [cloneOptions, setCloneOptions] = useState<CloneYearOptions>({
    cloneTeacher: true,
    cloneStudents: false,
    cloneInventory: true,
    clonePLC: false,
    cloneQuizzes: true,
    cloneTimetable: true,
    cloneSyllabus: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const refreshList = () => {
    setYearsList(getAcademicYearsList());
    setSelectedActiveYear(getActiveAcademicYear());
  };

  const handleSelectYear = (year: string) => {
    setActiveAcademicYear(year);
    setSelectedActiveYear(year);
    onYearChanged(year);
    onShowToast(`បានប្តូរទៅកាន់ឆ្នាំសិក្សា «${year}» ដោយជោគជ័យ!`);
    onClose();
  };

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newYearInput.trim();
    if (!trimmed) {
      alert('សូមបញ្ចូលឈ្មោះឆ្នាំសិក្សា!');
      return;
    }

    if (yearsList.includes(trimmed)) {
      alert('ឆ្នាំសិក្សានេះមានរួចហើយនៅក្នុងប្រព័ន្ធ!');
      return;
    }

    // Save into list
    const updated = [...yearsList, trimmed];
    saveAcademicYearsList(updated);

    // Clone data if selected
    if (sourceYearForClone) {
      cloneYearData(sourceYearForClone, trimmed, cloneOptions);
    }

    // Switch to new year
    setActiveAcademicYear(trimmed);
    setYearsList(updated);
    setSelectedActiveYear(trimmed);
    onYearChanged(trimmed);
    onShowToast(`បានបង្កើត និងប្តូរទៅកាន់ឆ្នាំសិក្សាថ្មី «${trimmed}» រួចរាល់!`);
    onClose();
  };

  const handleDeleteYear = (yearToDelete: string) => {
    if (yearsList.length <= 1) {
      alert('មិនអាចលុបឆ្នាំសិក្សាចុងក្រោយបានទេ!');
      return;
    }
    if (yearToDelete === selectedActiveYear) {
      alert('មិនអាចលុបឆ្នាំសិក្សាដែលកំពុងប្រើប្រាស់បានទេ។ សូមប្តូរទៅឆ្នាំផ្សេងជាមុនសិន!');
      return;
    }
    if (window.confirm(`តើអ្នកពិតជាចង់លុបទិន្នន័យឆ្នាំសិក្សា «${yearToDelete}» ទាំងអស់មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`)) {
      deleteYearData(yearToDelete);
      const updated = yearsList.filter((y) => y !== yearToDelete);
      setYearsList(updated);
      onShowToast(`បានលុបឆ្នាំសិក្សា «${yearToDelete}» រួចរាល់!`);
    }
  };

  const handleExportBackup = () => {
    const jsonStr = exportAllAcademicYearsBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `ទិន្នន័យរដ្ឋបាលគ្រូបឋម_បម្រុងគ្រប់ឆ្នាំ_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('បានទាញយកឯកសារបម្រុងទុក (JSON Backup) គ្រប់ឆ្នាំសិក្សាជោគជ័យ!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const result = importAcademicYearsBackup(content);
      if (result.success) {
        refreshList();
        const active = getActiveAcademicYear();
        onYearChanged(active);
        onShowToast(result.message);
        onClose();
      } else {
        alert(result.message);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs no-print animate-fadeIn">
      <div className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-2xl shadow-2xl border border-slate-100 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-purple-900/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base md:text-lg flex items-center gap-2">
                គ្រប់គ្រងទិន្នន័យតាមឆ្នាំសិក្សា
                <span className="text-[11px] font-bold bg-amber-100 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300">
                  MoEYS Academic Years
                </span>
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                រក្សាទុកទិន្នន័យដាច់ដោយឡែកតាមឆ្នាំសិក្សានីមួយៗ មិនបាត់បង់ពេល update កម្មវិធី
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-white text-purple-950 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-700" />
            <span>បញ្ជីឆ្នាំសិក្សា ({yearsList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-white text-purple-950 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>បង្កើតឆ្នាំសិក្សាថ្មី</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
              activeTab === 'backup'
                ? 'bg-white text-purple-950 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-indigo-700" />
            <span>បម្រុងទុក & ស្តារ (Backup)</span>
          </button>
        </div>

        {/* TAB 1: LIST OF ACADEMIC YEARS */}
        {activeTab === 'list' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-purple-900 block">ឆ្នាំសិក្សាកំពុងដំណើរការសព្វថ្ងៃ៖</span>
                <span className="text-lg font-black text-purple-950">{selectedActiveYear}</span>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                កំពុងសកម្ម
              </span>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 block">
                ជ្រើសរើសឆ្នាំសិក្សាដើម្បីប្តូរទិន្នន័យ (ចុចលើឆ្នាំសិក្សាដើម្បីមើលទិន្នន័យឆ្នាំនោះ)៖
              </label>

              {yearsList.map((year) => {
                const isActive = year === selectedActiveYear;
                const bundle = loadCompleteYearBundle(year);
                const studentCount = bundle.students?.length || 0;
                const logbookCount = bundle.logbook?.length || 0;

                return (
                  <div
                    key={year}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-purple-900/5 border-purple-400 ring-2 ring-purple-600/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-900">{year}</span>
                        {isActive && (
                          <span className="bg-purple-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            កំពុងប្រើប្រាស់
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Users className="w-3 h-3 text-purple-700" />
                          សិស្ស៖ <strong>{studentCount} នាក់</strong>
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                          <BookOpen className="w-3 h-3 text-blue-700" />
                          កត់ត្រា៖ <strong>{logbookCount} កិច្ច</strong>
                        </span>
                        <span className="text-slate-400">•</span>
                        <span>ថ្នាក់៖ {bundle.teacher.grade || 'មិនទាន់កំណត់'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => handleSelectYear(year)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5"
                        >
                          <span>ប្តូរមកឆ្នាំនេះ</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          កំពុងបើក
                        </span>
                      )}

                      {yearsList.length > 1 && !isActive && (
                        <button
                          type="button"
                          title="លុបឆ្នាំសិក្សានេះ"
                          onClick={() => handleDeleteYear(year)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CREATE NEW ACADEMIC YEAR */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateYear} className="space-y-4">
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">បង្កើតឆ្នាំសិក្សាថ្មី (ឧ. ២០២៦-២០២៧)</strong>
                <span>
                  លោកគ្រូអ្នកគ្រូអាចចម្លងព័ត៌មានមូលដ្ឋាន (ដូចជាប្រវត្តិរូបគ្រូ កាលវិភាគ កម្មវិធីសិក្សា) ពីឆ្នាំចាស់ចូលទៅឆ្នាំថ្មីបានភ្លាមៗ!
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ឈ្មោះឆ្នាំសិក្សាថ្មី (New Academic Year Name) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newYearInput}
                    onChange={(e) => setNewYearInput(e.target.value)}
                    placeholder="ឧ. ២០២៦ - ២០២៧"
                    className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                  />
                  <div className="flex gap-1">
                    {['២០២៦ - ២០២៧', '២០២៧ - ២០២៨', '២០២៨ - ២០២៩'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNewYearInput(preset)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 rounded-lg text-[10px] font-bold transition"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ចម្លងទិន្នន័យដំបូងពីឆ្នាំសិក្សា (Clone Baseline Data From):
                </label>
                <select
                  value={sourceYearForClone}
                  onChange={(e) => setSourceYearForClone(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                >
                  {yearsList.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} {yr === selectedActiveYear ? '(ឆ្នាំកំពុងប្រើ)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clone checkboxes */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block">ជម្រើសទិន្នន័យដែលត្រូវចម្លងចូលឆ្នាំថ្មី៖</span>

                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cloneOptions.cloneTeacher}
                    onChange={(e) => setCloneOptions({ ...cloneOptions, cloneTeacher: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-700 focus:ring-purple-600"
                  />
                  <span>ចម្លងប្រវត្តិរូបគ្រូ & សាលារៀន (Teacher Profile & School)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cloneOptions.cloneTimetable}
                    onChange={(e) => setCloneOptions({ ...cloneOptions, cloneTimetable: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-700 focus:ring-purple-600"
                  />
                  <span>ចម្លងកាលវិភាគបង្រៀន (Timetable / Schedule)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cloneOptions.cloneSyllabus}
                    onChange={(e) => setCloneOptions({ ...cloneOptions, cloneSyllabus: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-700 focus:ring-purple-600"
                  />
                  <span>ចម្លងកម្មវិធីសិក្សា & កិច្ចតែងការដែលបានកែប្រែ (Custom Syllabus)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cloneOptions.cloneQuizzes}
                    onChange={(e) => setCloneOptions({ ...cloneOptions, cloneQuizzes: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-700 focus:ring-purple-600"
                  />
                  <span>ចម្លងកញ្ចប់មេរៀន និងតេស្ត Kahoot (Quizzes & Lessons)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cloneOptions.cloneInventory}
                    onChange={(e) => setCloneOptions({ ...cloneOptions, cloneInventory: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-700 focus:ring-purple-600"
                  />
                  <span>ចម្លងបញ្ជីសម្ភារៈបន្ទប់រៀន (Classroom Inventory)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cloneOptions.cloneStudents}
                    onChange={(e) => setCloneOptions({ ...cloneOptions, cloneStudents: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-700 focus:ring-purple-600"
                  />
                  <span>
                    ចម្លងបញ្ជីឈ្មោះសិស្សដដែល (ទុកចោលបើឡើងថ្នាក់ថ្មី ឬមានសិស្សថ្មី)
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition text-xs"
              >
                បោះបង់
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 transition active:scale-95 text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>បង្កើត និងប្តូរទៅឆ្នាំថ្មី</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: BACKUP & RESTORE */}
        {activeTab === 'backup' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-sm">សុវត្ថិភាពទិន្នន័យ ១០០% មិនបាត់បង់</strong>
                <p className="mt-1 leading-relaxed text-slate-600">
                  លោកគ្រូអ្នកគ្រូអាចទាញយកទិន្នន័យគ្រប់ឆ្នាំសិក្សា (សិស្ស, វត្តមាន, ពិន្ទុ, កត់ត្រា, កាលវិភាគ) ទុកជាឯកសារ
                  <strong className="text-indigo-900 font-bold"> .JSON</strong> លើកុំព្យូទ័រ ឬទូរស័ព្ទ។ នៅពេលប្តូរឧបករណ៍ ឬ update កម្មវិធី គ្រាន់តែ upload ឯកសារនេះចូលវិញ នោះទិន្នន័យទាំងអស់នឹងវិលមកដូចដើម!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">ទាញយកឯកសារបម្រុងទុក (Export Backup)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    រក្សាទុកទិន្នន័យរដ្ឋបាលគ្រប់ឆ្នាំសិក្សា ({yearsList.length} ឆ្នាំ) ទៅក្នុងកុំព្យូទ័រ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>ទាញយក JSON Backup</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">បញ្ចូលឯកសារបម្រុងឡើងវិញ (Restore Backup)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    បញ្ចូលទិន្នន័យពីឯកសារ .json ដែលបានរក្សាទុកពីមុនមក
                  </p>
                </div>
                <label className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer text-center">
                  <Upload className="w-4 h-4" />
                  <span>ជ្រើសរើសឯកសារ JSON</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
