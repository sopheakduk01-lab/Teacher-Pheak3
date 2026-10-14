import React, { useState } from 'react';
import {
  X,
  Crown,
  Award,
  Eye,
  BookOpen,
  Users,
  Printer,
  Sparkles,
  CheckCircle2,
  Calendar,
  Check,
  Search,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  Trash2,
  Plus,
  Building2,
  Star
} from 'lucide-react';
import { Student, TeacherProfile } from '../types';
import { getKhmerCombinedDate, toKhmerNum } from '../utils/khmerDate';

export interface ClassroomCommitteeData {
  presidentId: number | null;
  vicePresident1Id: number | null;
  vicePresident2Id: number | null;
  slowLearnerIds: number[];
  eyeCareIds: number[];
  subBranches: {
    [branchIndex: number]: number[]; // 1 to 6
  };
  dailyTasks: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
}

export const DEFAULT_DAILY_TASKS = [
  { id: 1, name: 'សម្អាតថ្នាក់រៀន', description: 'បោសជូតបន្ទប់រៀន រៀបចំតុ និងក្តារខៀន' },
  { id: 2, name: 'សម្អាតបន្ទប់ទឹក', description: 'លាងសម្អាតបន្ទប់ទឹកសិស្ស និងបំពេញទឹក' },
  { id: 3, name: 'ស្រោចផ្កានិងកូនឈើ', description: 'ថែទាំសួនជីវចម្រុះ និងស្រោចផ្កាជុំវិញថ្នាក់' },
  { id: 4, name: 'ស្រោចបន្លែ', description: 'ស្រោចស្រព និងដកស្មៅសួនបន្លែបង្ការបស់សាលា' },
  { id: 5, name: 'រើសសំរាម', description: 'រើសសំរាមជុំវិញបរិវេណអគារសិក្សា និងដុត/ចោលក្នុងធុង' },
  { id: 6, name: 'បោសសម្អាតទីធ្លាសាលារៀន', description: 'បោសស្លឹកឈើ និងសំអាតទីធ្លាមុខថ្នាក់' }
];

export const SUB_BRANCH_COLORS = [
  {
    headerBg: 'bg-blue-600',
    headerText: 'text-white',
    border: 'border-blue-300',
    lightBg: 'bg-blue-50/50',
    badge: 'bg-blue-100 text-blue-900 border-blue-200',
    dot: 'bg-blue-500'
  },
  {
    headerBg: 'bg-rose-600',
    headerText: 'text-white',
    border: 'border-rose-300',
    lightBg: 'bg-rose-50/50',
    badge: 'bg-rose-100 text-rose-900 border-rose-200',
    dot: 'bg-rose-500'
  },
  {
    headerBg: 'bg-amber-600',
    headerText: 'text-white',
    border: 'border-amber-300',
    lightBg: 'bg-amber-50/50',
    badge: 'bg-amber-100 text-amber-900 border-amber-200',
    dot: 'bg-amber-500'
  },
  {
    headerBg: 'bg-emerald-600',
    headerText: 'text-white',
    border: 'border-emerald-300',
    lightBg: 'bg-emerald-50/50',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    dot: 'bg-emerald-500'
  },
  {
    headerBg: 'bg-purple-600',
    headerText: 'text-white',
    border: 'border-purple-300',
    lightBg: 'bg-purple-50/50',
    badge: 'bg-purple-100 text-purple-900 border-purple-200',
    dot: 'bg-purple-500'
  },
  {
    headerBg: 'bg-orange-600',
    headerText: 'text-white',
    border: 'border-orange-300',
    lightBg: 'bg-orange-50/50',
    badge: 'bg-orange-100 text-orange-900 border-orange-200',
    dot: 'bg-orange-500'
  }
];

interface ClassroomCommitteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  students: Student[];
  committeeData: ClassroomCommitteeData;
  onSaveCommitteeData: (data: ClassroomCommitteeData) => void;
  onShowToast: (msg: string) => void;
  onOptimizeSeatingWithNeeds: (data?: any) => void;
}

export const ClassroomCommitteeModal: React.FC<ClassroomCommitteeModalProps> = ({
  isOpen,
  onClose,
  teacher,
  students,
  committeeData,
  onSaveCommitteeData,
  onShowToast,
  onOptimizeSeatingWithNeeds
}) => {
  const [activeTab, setActiveTab] = useState<'leadership' | 'special_needs' | 'sub_branches' | 'weekly_duty' | 'print_preview'>('leadership');
  const [data, setData] = useState<ClassroomCommitteeData>(committeeData);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranchToManage, setSelectedBranchToManage] = useState<number>(1);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  if (!isOpen) return null;

  const validStudents = students || [];

  // Helper getters
  const president = validStudents.find(s => s.id === data.presidentId);
  const vp1 = validStudents.find(s => s.id === data.vicePresident1Id);
  const vp2 = validStudents.find(s => s.id === data.vicePresident2Id);

  // Auto-distribute students into 6 sub-branches
  const handleAutoDistributeBranches = () => {
    const branches: { [key: number]: number[] } = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    
    // Sort or filter students (excluding empty or invalid)
    validStudents.forEach((student, idx) => {
      const branchIndex = (idx % 6) + 1;
      branches[branchIndex].push(student.id);
    });

    const updated = { ...data, subBranches: branches };
    setData(updated);
    onSaveCommitteeData(updated);
    onShowToast('✨ បានបែងចែកសិស្សទៅអនុសាខាទាំង ៦ ដោយស្មើភាពស្វ័យប្រវត្តិ!');
  };

  // Toggle slow learner status
  const handleToggleSlowLearner = (studentId: number) => {
    const exists = data.slowLearnerIds.includes(studentId);
    const updatedIds = exists
      ? data.slowLearnerIds.filter(id => id !== studentId)
      : [...data.slowLearnerIds, studentId];
    
    const updated = { ...data, slowLearnerIds: updatedIds };
    setData(updated);
    onSaveCommitteeData(updated);
    onShowToast(exists ? 'បានលុបសិស្សចេញពីបញ្ជីរៀនយឺត' : 'បានបន្ថែមសិស្សក្នុងបញ្ជីរៀនយឺត (ត្រូវការជំនួយ)');
  };

  // Toggle eye care status
  const handleToggleEyeCare = (studentId: number) => {
    const exists = data.eyeCareIds.includes(studentId);
    const updatedIds = exists
      ? data.eyeCareIds.filter(id => id !== studentId)
      : [...data.eyeCareIds, studentId];
    
    const updated = { ...data, eyeCareIds: updatedIds };
    setData(updated);
    onSaveCommitteeData(updated);
    onShowToast(exists ? 'បានលុបសិស្សចេញពីបញ្ជីពិបាកមើល' : 'បានបន្ថែមសិស្សក្នុងបញ្ជីពិបាកមើល (ខ្សោយភ្នែក-អង្គុយជួរមុខ)');
  };

  // Move student to branch
  const handleSetStudentBranch = (studentId: number, targetBranch: number) => {
    const newBranches = { ...data.subBranches };
    // Remove from all branches first
    for (let b = 1; b <= 6; b++) {
      newBranches[b] = (newBranches[b] || []).filter(id => id !== studentId);
    }
    // Add to target branch
    if (targetBranch >= 1 && targetBranch <= 6) {
      newBranches[targetBranch] = [...(newBranches[targetBranch] || []), studentId];
    }
    const updated = { ...data, subBranches: newBranches };
    setData(updated);
    onSaveCommitteeData(updated);
  };

  // Trigger print of the official MoEYS Classroom Committee and Duty chart
  const handlePrintCommitteeChart = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  // Filtered students for search lists
  const filteredStudents = validStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(s.rollNo || s.id).includes(searchTerm)
  );

  const getStudentBranch = (studentId: number): number | null => {
    for (let b = 1; b <= 6; b++) {
      if ((data.subBranches[b] || []).includes(studentId)) return b;
    }
    return null;
  };

  // Generate the 6-day x 6-task rotation schedule matrix
  // Task i (0 to 5) on Day d (0 to 5 for Mon-Sat): Branch = ((i + d) % 6) + 1
  const daysOfWeek = [
    { key: 'mon', label: 'ចន្ទ' },
    { key: 'tue', label: 'អង្គារ' },
    { key: 'wed', label: 'ពុធ' },
    { key: 'thu', label: 'ព្រហស្បតិ៍' },
    { key: 'fri', label: 'សុក្រ' },
    { key: 'sat', label: 'សៅរ៍' }
  ];

  const getBranchForDuty = (taskIndex: number, dayIndex: number): number => {
    return ((taskIndex + dayIndex) % 6) + 1;
  };

  const khmerDateStr = getKhmerCombinedDate(new Date(), {
    location: teacher.school || 'អូរឫស្សីកណ្តាល',
    format: 'combined_multiline'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] uppercase tracking-wider">
                  MoEYS Standard • គំរូស្ដង់ដារ
                </span>
                <span className="text-xs text-purple-200 font-bold">
                  ថ្នាក់ {teacher.grade || 'ទី ៦ (ក)'} • សិស្ស {validStudents.length} នាក់
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-moul mt-1">
                គណៈកម្មាធិការសាខាថ្នាក់ & វែនសម្អាតអនុសាខាទាំង៦
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintCommitteeChart}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-black flex items-center gap-1.5 transition border border-white/20 shadow-sm"
              title="បោះពុម្ពទម្រង់ស្ដង់ដារ A4"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">បោះពុម្ព A4</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'leadership', label: '១. រើសប្រធាន & អនុប្រធាន', icon: Crown, count: (president ? 1 : 0) + (vp1 ? 1 : 0) + (vp2 ? 1 : 0) },
            { id: 'special_needs', label: '២. សិស្សរៀនយឺត & ពិបាកមើល', icon: Eye, count: data.slowLearnerIds.length + data.eyeCareIds.length },
            { id: 'sub_branches', label: '៣. អនុសាខាទាំង ៦', icon: Building2, count: 6 },
            { id: 'weekly_duty', label: '៤. វែនសម្អាត & សកម្មភាពប្រចាំសប្តាហ៍', icon: Calendar },
            { id: 'print_preview', label: '៥. គំរូឯកសារ A4 (Official)', icon: Printer }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap shadow-2xs ${
                  isActive
                    ? 'bg-purple-900 text-white shadow-sm ring-2 ring-purple-400/40'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-6">

          {/* TAB 1: LEADERSHIP SELECTION (ប្រធានថ្នាក់, អនុប្រធានទី១, អនុប្រធានទី២) */}
          {activeTab === 'leadership' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 p-4 sm:p-5 rounded-2xl border border-purple-200 space-y-2">
                <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <span>រចនាសម្ព័ន្ធថ្នាក់ដឹកនាំសិស្ស (Student Leadership Council)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  ជ្រើសរើស <strong>ប្រធានថ្នាក់</strong>, <strong>អនុប្រធានទី១</strong>, និង <strong>អនុប្រធានទី២</strong> ដើម្បីដឹកនាំគ្រប់គ្រងវិន័យ អនាម័យ និងជួយណែនាំមិត្តរួមថ្នាក់។
                </p>
              </div>

              {/* 3 Leadership Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. PRESIDENT */}
                <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 text-amber-950 font-black text-xs border border-amber-300">
                      <Crown className="w-3.5 h-3.5 text-amber-600" />
                      ប្រធានថ្នាក់
                    </span>
                    <span className="text-xs font-bold text-amber-600">👑 Monitor</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">
                      ជ្រើសរើសសិស្សជាប្រធានថ្នាក់៖
                    </label>
                    <select
                      value={data.presidentId || ''}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : null;
                        const updated = { ...data, presidentId: val };
                        setData(updated);
                        onSaveCommitteeData(updated);
                        onShowToast(`👑 បានជ្រើសរើសប្រធានថ្នាក់៖ ${validStudents.find(s => s.id === val)?.name || 'គ្មាន'}`);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="">-- សូមជ្រើសរើសប្រធានថ្នាក់ --</option>
                      {validStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          #{s.rollNo || s.id} - {s.name} ({s.gender})
                        </option>
                      ))}
                    </select>
                  </div>

                  {president ? (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1 text-slate-800">
                      <div className="font-bold text-amber-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{president.name} ({president.gender})</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        លេខរៀង #{president.rollNo || president.id} • ដឹកនាំទូទៅ & សម្របសម្រួលអនុសាខាទាំង៦
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 italic text-center">
                      មិនទាន់បានជ្រើសរើស
                    </div>
                  )}
                </div>

                {/* 2. VICE PRESIDENT 1 */}
                <div className="bg-white p-5 rounded-2xl border-2 border-indigo-200 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-100 text-indigo-950 font-black text-xs border border-indigo-200">
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      អនុប្រធានទី១
                    </span>
                    <span className="text-xs font-bold text-indigo-600">🎖️ 1st VP</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">
                      ជ្រើសរើសអនុប្រធានទី១៖
                    </label>
                    <select
                      value={data.vicePresident1Id || ''}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : null;
                        const updated = { ...data, vicePresident1Id: val };
                        setData(updated);
                        onSaveCommitteeData(updated);
                        onShowToast(`🎖️ បានជ្រើសរើសអនុប្រធានទី១៖ ${validStudents.find(s => s.id === val)?.name || 'គ្មាន'}`);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">-- សូមជ្រើសរើសអនុប្រធានទី១ --</option>
                      {validStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          #{s.rollNo || s.id} - {s.name} ({s.gender})
                        </option>
                      ))}
                    </select>
                  </div>

                  {vp1 ? (
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs space-y-1 text-slate-800">
                      <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{vp1.name} ({vp1.gender})</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        លេខរៀង #{vp1.rollNo || vp1.id} • ទទួលបន្ទុកការសិក្សា អនាម័យ & វិន័យ
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 italic text-center">
                      មិនទាន់បានជ្រើសរើស
                    </div>
                  )}
                </div>

                {/* 3. VICE PRESIDENT 2 */}
                <div className="bg-white p-5 rounded-2xl border-2 border-purple-200 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 text-purple-950 font-black text-xs border border-purple-200">
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                      អនុប្រធានទី២
                    </span>
                    <span className="text-xs font-bold text-purple-600">🎖️ 2nd VP</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">
                      ជ្រើសរើសអនុប្រធានទី២៖
                    </label>
                    <select
                      value={data.vicePresident2Id || ''}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : null;
                        const updated = { ...data, vicePresident2Id: val };
                        setData(updated);
                        onSaveCommitteeData(updated);
                        onShowToast(`🎖️ បានជ្រើសរើសអនុប្រធានទី២៖ ${validStudents.find(s => s.id === val)?.name || 'គ្មាន'}`);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="">-- សូមជ្រើសរើសអនុប្រធានទី២ --</option>
                      {validStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          #{s.rollNo || s.id} - {s.name} ({s.gender})
                        </option>
                      ))}
                    </select>
                  </div>

                  {vp2 ? (
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs space-y-1 text-slate-800">
                      <div className="font-bold text-purple-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{vp2.name} ({vp2.gender})</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        លេខរៀង #{vp2.rollNo || vp2.id} • ទទួលបន្ទុកសកម្មភាព ស្រោចផ្កា & កីឡា
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 italic text-center">
                      មិនទាន់បានជ្រើសរើស
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Summary of Role Functions */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>តួនាទី និងភារកិច្ចរបស់ថ្នាក់ដឹកនាំសិស្ស</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-amber-900">👑 ប្រធានថ្នាក់៖</div>
                    <div>• ជួយគ្រូគ្រប់គ្រងវិន័យទូទៅក្នុងថ្នាក់</div>
                    <div>• ត្រួតពិនិត្យវត្តមាន និងរបាយការណ៍</div>
                    <div>• ដឹកនាំប្រជុំ និងសម្របសម្រួលអនុសាខាទាំង៦</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-indigo-900">🎖️ អនុប្រធានទី១៖</div>
                    <div>• ទទួលបន្ទុកផ្នែកសិក្សា និងមិត្តជួយមិត្ត</div>
                    <div>• ជួយមើលការខុសត្រូវសិស្សរៀនយឺត</div>
                    <div>• ពិនិត្យសៀវភៅស្វ័យសិក្សា និងកិច្ចការផ្ទះ</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-purple-900">🎖️ អនុប្រធានទី២៖</div>
                    <div>• ទទួលបន្ទុកអនាម័យ បរិស្ថាន និងកីឡា</div>
                    <div>• ត្រួតពិនិត្យវែនសម្អាតរបស់អនុសាខាទាំង៦</div>
                    <div>• ពិនិត្យការថែទាំសួនបន្លែ និងផ្កាក្នុងសាលា</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPECIAL NEEDS (សិស្សរៀនយឺត & សិស្សពិបាកមើល) */}
          {activeTab === 'special_needs' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-br from-amber-50 via-rose-50/40 to-blue-50/40 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span>ការកំណត់សិស្សរៀនយឺត និងសិស្សពិបាកមើល (ខ្សោយភ្នែក)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onOptimizeSeatingWithNeeds();
                      onShowToast('✨ បានរៀបប្លង់តុឆ្លាតវៃ៖ ពិបាកមើលនៅជួរមុខ & រៀនយឺតក្បែរប្រធាន/សិស្សពូកែ!');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>រៀបតុឆ្លាតវៃភ្លាមៗ</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  ចុចលើឈ្មោះសិស្សដើម្បីកំណត់ជា <strong>សិស្សពិបាកមើល (គប្បីអង្គុយជួរមុខជិតក្តារខៀន)</strong> ឬ <strong>សិស្សរៀនយឺត (គប្បីអង្គុយក្បែរសិស្សពូកែដើម្បីជួយបង្រៀន)</strong>។
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
                <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="ស្វែងរកឈ្មោះសិស្ស ឬលេខរៀង..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Student Checklist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredStudents.map((student) => {
                  const isEyeCare = data.eyeCareIds.includes(student.id);
                  const isSlow = data.slowLearnerIds.includes(student.id);
                  const isPres = data.presidentId === student.id;
                  const isVp1 = data.vicePresident1Id === student.id;
                  const isVp2 = data.vicePresident2Id === student.id;
                  const branchNum = getStudentBranch(student.id);

                  return (
                    <div
                      key={student.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 bg-white ${
                        isEyeCare || isSlow
                          ? 'border-amber-300 shadow-xs bg-amber-50/20'
                          : 'border-slate-200 hover:border-slate-300'
                      } flex items-center justify-between gap-3`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            #{student.rollNo || student.id} {student.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${student.gender === 'ស្រី' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                            {student.gender}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 text-[10px]">
                          {isPres && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-black">
                              👑 ប្រធានថ្នាក់
                            </span>
                          )}
                          {isVp1 && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900 font-black">
                              🎖️ អនុប្រធាន១
                            </span>
                          )}
                          {isVp2 && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 font-black">
                              🎖️ អនុប្រធាន២
                            </span>
                          )}
                          {branchNum && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold">
                              អនុសាខា {branchNum}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons for this student */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Toggle Vision / Eye Care */}
                        <button
                          type="button"
                          onClick={() => handleToggleEyeCare(student.id)}
                          className={`px-2.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1 ${
                            isEyeCare
                              ? 'bg-amber-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-900'
                          }`}
                          title="កំណត់ជាសិស្សពិបាកមើល (អង្គុយជួរមុខ)"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">ពិបាកមើល</span>
                        </button>

                        {/* Toggle Slow Learner */}
                        <button
                          type="button"
                          onClick={() => handleToggleSlowLearner(student.id)}
                          className={`px-2.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1 ${
                            isSlow
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-900'
                          }`}
                          title="កំណត់ជាសិស្សរៀនយឺត (ត្រូវការជំនួយ)"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">រៀនយឺត</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-amber-800">
                    <Eye className="w-4 h-4 text-amber-600" />
                    សិស្សពិបាកមើល៖ <strong>{data.eyeCareIds.length} នាក់</strong>
                  </span>
                  <span className="flex items-center gap-1 text-rose-800">
                    <BookOpen className="w-4 h-4 text-rose-600" />
                    សិស្សរៀនយឺត៖ <strong>{data.slowLearnerIds.length} នាក់</strong>
                  </span>
                </div>
                <div className="text-slate-500 font-medium">
                  * សិស្សពិបាកមើលនឹងត្រូវរៀបចំនៅជួរមុខបង្អស់ (ជួរទី១) ជិតក្តារខៀន
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 6 SUB-BRANCHES (អនុសាខាទាំង ៦) */}
          {activeTab === 'sub_branches' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-950 font-black text-sm">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>ការបែងចែកសិស្សជា ៦ អនុសាខា (Sub-branches 1 to 6)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    ថ្នាក់រៀនត្រូវបែងចែកជា <strong>៦ អនុសាខា</strong> ទទួលបន្ទុកសកម្មភាព និងវែនសម្អាតប្រចាំសប្តាហ៍។
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoDistributeBranches}
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-300" />
                  <span>បែងចែកស្មើគ្នាស្វ័យប្រវត្តិ</span>
                </button>
              </div>

              {/* 6 Sub-branches Cards matching official format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((branchNum) => {
                  const color = SUB_BRANCH_COLORS[branchNum - 1];
                  const memberIds = data.subBranches[branchNum] || [];
                  const members = memberIds
                    .map(id => validStudents.find(s => s.id === id))
                    .filter(Boolean) as Student[];

                  return (
                    <div
                      key={branchNum}
                      className={`rounded-2xl border ${color.border} bg-white shadow-xs overflow-hidden flex flex-col`}
                    >
                      {/* Header */}
                      <div className={`${color.headerBg} ${color.headerText} p-3 flex items-center justify-between font-black text-xs sm:text-sm font-moul`}>
                        <span>អនុសាខាទី{toKhmerNum(branchNum)}</span>
                        <span className="text-[11px] font-sans font-extrabold px-2 py-0.5 bg-white/20 rounded-lg">
                          {members.length} នាក់
                        </span>
                      </div>

                      {/* Members List */}
                      <div className="p-3 space-y-1.5 flex-1 text-xs">
                        {members.length === 0 ? (
                          <div className="text-center py-4 text-slate-400 italic text-[11px]">
                            មិនទាន់មានសមាជិក
                          </div>
                        ) : (
                          members.map((m, idx) => (
                            <div
                              key={m.id}
                              className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition text-slate-800"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-slate-400 font-mono text-[10px] w-4">
                                  {idx + 1}.
                                </span>
                                <span className="font-bold text-xs truncate">
                                  {m.name}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({m.gender === 'ស្រី' ? 'ស' : 'ប'})
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {data.presidentId === m.id && (
                                  <span className="text-[9px] px-1 bg-amber-100 text-amber-900 rounded font-bold">
                                    👑
                                  </span>
                                )}
                                {data.vicePresident1Id === m.id && (
                                  <span className="text-[9px] px-1 bg-indigo-100 text-indigo-900 rounded font-bold">
                                    🎖️១
                                  </span>
                                )}
                                {data.vicePresident2Id === m.id && (
                                  <span className="text-[9px] px-1 bg-purple-100 text-purple-900 rounded font-bold">
                                    🎖️២
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleSetStudentBranch(m.id, 0)}
                                  className="text-slate-300 hover:text-rose-500 p-0.5"
                                  title="ដកចេញពីអនុសាខានេះ"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer: Quick Add Student to this branch */}
                      <div className="p-2 bg-slate-50 border-t border-slate-100">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleSetStudentBranch(Number(e.target.value), branchNum);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 bg-white"
                        >
                          <option value="">+ បន្ថែមសិស្សចូលអនុសាខាទី{branchNum}...</option>
                          {validStudents
                            .filter(s => !memberIds.includes(s.id))
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                #{s.rollNo || s.id} {s.name} ({s.gender})
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: WEEKLY DUTY ROTATION (វែនសម្អាតតាមគណៈកម្មាធិការសាលាថ្នាក់រៀន) */}
          {activeTab === 'weekly_duty' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-5 rounded-2xl border border-purple-200 space-y-2">
                <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>តារាងផែនការសកម្មភាពប្រចាំសប្តាហ៍របស់អនុសាខាទាំង៦ (Weekly Duty Schedule)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  អនុវត្តតាម <strong>គំរូស្ដង់ដារក្រសួងអប់រំ យុវជន និងកីឡា</strong>៖ អនុសាខាទាំង ៦ ឆ្លាស់វេនគ្នារៀងរាល់ថ្ងៃពីថ្ងៃចន្ទ ដល់ថ្ងៃសៅរ៍ លើសកម្មភាពទាំង ៦ ចម្បង។
                </p>
              </div>

              {/* Official Weekly Schedule Matrix */}
              <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
                <div className="p-3 bg-purple-900 text-white font-moul text-xs sm:text-sm text-center">
                  តារាងផែនការសកម្មភាពប្រចាំសប្តាហ៍របស់អនុសាខាទាំង ៦
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-slate-800 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 text-center font-bold font-moul text-[11px]">
                        <th className="p-2.5 border-r border-slate-300 w-10">ល.រ</th>
                        <th className="p-2.5 border-r border-slate-300 text-left min-w-[160px]">សកម្មភាពប្រចាំថ្ងៃ</th>
                        <th className="p-2.5 border-r border-slate-300 bg-blue-50 text-blue-950 min-w-[100px]">ចន្ទ</th>
                        <th className="p-2.5 border-r border-slate-300 bg-rose-50 text-rose-950 min-w-[100px]">អង្គារ</th>
                        <th className="p-2.5 border-r border-slate-300 bg-amber-50 text-amber-950 min-w-[100px]">ពុធ</th>
                        <th className="p-2.5 border-r border-slate-300 bg-emerald-50 text-emerald-950 min-w-[100px]">ព្រហស្បតិ៍</th>
                        <th className="p-2.5 border-r border-slate-300 bg-purple-50 text-purple-950 min-w-[100px]">សុក្រ</th>
                        <th className="p-2.5 bg-orange-50 text-orange-950 min-w-[100px]">សៅរ៍</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {DEFAULT_DAILY_TASKS.map((task, tIdx) => (
                        <tr key={task.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-2.5 text-center font-mono font-bold text-slate-500 border-r border-slate-300">
                            {tIdx + 1}
                          </td>
                          <td className="p-2.5 font-bold text-slate-900 border-r border-slate-300">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                              <span>{task.name}</span>
                            </div>
                            {task.description && (
                              <div className="text-[10px] text-slate-500 font-normal pl-3.5">
                                {task.description}
                              </div>
                            )}
                          </td>

                          {/* Mon to Sat Cells with sub-branch rotation */}
                          {daysOfWeek.map((day, dIdx) => {
                            const branchNum = getBranchForDuty(tIdx, dIdx);
                            const memberCount = (data.subBranches[branchNum] || []).length;
                            const color = SUB_BRANCH_COLORS[branchNum - 1];

                            return (
                              <td
                                key={day.key}
                                className="p-2 text-center border-r border-slate-300 last:border-r-0"
                              >
                                <div className={`inline-flex flex-col items-center justify-center px-2 py-1 rounded-lg ${color.badge} font-bold text-[11px] w-full shadow-2xs`}>
                                  <span>អនុសាខាទី{toKhmerNum(branchNum)}</span>
                                  <span className="text-[9px] opacity-75 font-normal">
                                    ({memberCount} នាក់)
                                  </span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Task Details Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>គោលការណ៍អនុវត្តវែនសម្អាត</span>
                  </h5>
                  <ul className="space-y-1 text-slate-600 list-disc pl-4">
                    <li>អនុសាខាត្រូវបំពេញភារកិច្ចមុនពេលចូលរៀន ១៥ នាទី និងក្រោយចេញលេង</li>
                    <li>ប្រធាន និងអនុប្រធានថ្នាក់ជាអ្នកត្រួតពិនិត្យ និងដាក់ពិន្ទុអនាម័យ</li>
                    <li>រៀងរាល់រសៀលថ្ងៃសុក្រ ឬសៅរ៍ ធ្វើអនាម័យទូទៅទាំងថ្នាក់រួមគ្នា</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span>ថ្នាក់ដឹកនាំទទួលបន្ទុកត្រួតពិនិត្យ</span>
                  </h5>
                  <div className="space-y-1.5 text-slate-700">
                    <div>• <strong>គ្រូទទួលបន្ទុក៖</strong> {teacher.name || 'លោកគ្រូ / អ្នកគ្រូ'}</div>
                    <div>• <strong>ប្រធានថ្នាក់៖</strong> {president?.name || '(មិនទាន់កំណត់)'}</div>
                    <div>• <strong>អនុប្រធានទី១ & ទី២៖</strong> {vp1?.name || '(គ្មាន)'} & {vp2?.name || '(គ្មាន)'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OFFICIAL PRINT PREVIEW (A4 MOEYS FORMAT) */}
          {activeTab === 'print_preview' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h4 className="font-black text-sm text-slate-900">
                    ទម្រង់ឯកសារគណៈកម្មាធិការសាខាថ្នាក់ (MoEYS Official A4)
                  </h4>
                  <p className="text-xs text-slate-500">
                    ទម្រង់នេះរៀបចំឡើងដូចគ្នាបេះបិទនឹងគំរូស្ដង់ដារដែលលោកគ្រូអ្នកគ្រូបានភ្ជាប់មក
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePrintCommitteeChart}
                  className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>បោះពុម្ពទម្រង់ A4 ឥឡូវនេះ</span>
                </button>
              </div>

              {/* A4 Paper Mock Preview */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-300 shadow-lg max-w-4xl mx-auto space-y-6 text-slate-900 font-sans">
                
                {/* Official Header (១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់) */}
                <div className="text-center space-y-0.5 mb-3">
                  <div className="font-moul text-sm text-amber-950">ព្រះរាជាណាចក្រកម្ពុជា</div>
                  <div className="font-moul text-xs text-amber-950">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                  <div className="text-xs font-bold text-amber-900 tracking-wider">— ༺ ៚ ༻ —</div>
                </div>

                <div className="flex justify-between items-end text-xs border-b border-slate-200 pb-3">
                  <div className="space-y-0.5 text-left">
                    <div className="font-bold">ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុកសៀមបូក</div>
                    <div className="font-bold">កម្រង{teacher.school || 'អូរឫស្សីកណ្តាល'}</div>
                    <div className="font-bold">សាលារៀន៖ {teacher.school || 'អូរឫស្សីកណ្តាល'}</div>
                  </div>
                  <div className="text-right text-xs text-slate-700">
                    <div>ថ្នាក់ទី៖ <strong>{teacher.grade || '៦'}</strong></div>
                    <div>ឆ្នាំសិក្សា៖ <strong>{teacher.academicYear || '២០២៥-២០២៦'}</strong></div>
                  </div>
                </div>

                {/* Main Title */}
                <div className="text-center space-y-1 py-1">
                  <h2 className="font-moul text-base sm:text-lg text-red-600">
                    គណៈកម្មាធិការសាខាថ្នាក់ទី{teacher.grade ? teacher.grade.replace(/[^0-9A-Za-zក-អ]/g, '') : '៦ (ក)'}
                  </h2>
                </div>

                {/* Org Chart Top (Teacher & President) */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center justify-center gap-6 sm:gap-12">
                    {/* Teacher Card */}
                    <div className="p-2.5 rounded-xl border-2 border-red-500 bg-red-50/50 text-center min-w-[130px] shadow-xs">
                      <div className="text-[11px] font-moul text-red-700">គ្រូទទួលបន្ទុក</div>
                      <div className="text-xs font-bold text-red-900 mt-0.5">{teacher.name || 'ឌុក សុភ័ក្ត្រ'}</div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400" />

                    {/* President Card */}
                    <div className="p-2.5 rounded-xl border-2 border-amber-500 bg-amber-50/50 text-center min-w-[130px] shadow-xs">
                      <div className="text-[11px] font-moul text-amber-700">ប្រធាន</div>
                      <div className="text-xs font-bold text-amber-900 mt-0.5">{president?.name || 'ជឺ ស្រីរ័ត្ន'}</div>
                    </div>
                  </div>

                  {/* Vice Presidents */}
                  <div className="grid grid-cols-2 gap-6 sm:gap-16 pt-1">
                    <div className="p-2 rounded-xl border-2 border-rose-400 bg-rose-50/50 text-center min-w-[120px]">
                      <div className="text-[10px] font-moul text-rose-700">អនុប្រធានទី១</div>
                      <div className="text-xs font-bold text-rose-900 mt-0.5">{vp1?.name || 'យិន ធារ័ត្ន'}</div>
                    </div>

                    <div className="p-2 rounded-xl border-2 border-purple-400 bg-purple-50/50 text-center min-w-[120px]">
                      <div className="text-[10px] font-moul text-purple-700">អនុប្រធានទី២</div>
                      <div className="text-xs font-bold text-purple-900 mt-0.5">{vp2?.name || 'រមឹ ស្រីកា'}</div>
                    </div>
                  </div>
                </div>

                {/* 6 Sub-branches Columns in a row */}
                <div className="grid grid-cols-6 gap-2 pt-2 border-t border-slate-200">
                  {[1, 2, 3, 4, 5, 6].map((bNum) => {
                    const color = SUB_BRANCH_COLORS[bNum - 1];
                    const memberIds = data.subBranches[bNum] || [];
                    const members = memberIds
                      .map(id => validStudents.find(s => s.id === id))
                      .filter(Boolean) as Student[];

                    return (
                      <div key={bNum} className={`border ${color.border} rounded-xl overflow-hidden text-[10px] bg-white`}>
                        <div className={`${color.headerBg} text-white font-moul text-[9px] p-1 text-center truncate`}>
                          អនុសាខាទី{toKhmerNum(bNum)}
                        </div>
                        <div className="p-1.5 space-y-1">
                          {members.slice(0, 7).map((m, idx) => (
                            <div key={m.id} className="truncate text-slate-800 leading-tight">
                              <span className="font-mono text-slate-400">{idx + 1}.</span> {m.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Weekly Duty Matrix */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-center font-moul text-xs text-red-600">
                    តារាងផែនការសកម្មភាពប្រចាំសប្តាហ៍របស់អនុសាខាទាំង៦
                  </div>
                  <table className="w-full text-[10px] border-collapse border border-slate-400">
                    <thead>
                      <tr className="bg-slate-100 text-center font-bold">
                        <th className="border border-slate-400 p-1 w-6">ល.រ</th>
                        <th className="border border-slate-400 p-1 text-left">សកម្មភាពប្រចាំថ្ងៃ</th>
                        <th className="border border-slate-400 p-1">ចន្ទ</th>
                        <th className="border border-slate-400 p-1">អង្គារ</th>
                        <th className="border border-slate-400 p-1">ពុធ</th>
                        <th className="border border-slate-400 p-1">ព្រហស្បតិ៍</th>
                        <th className="border border-slate-400 p-1">សុក្រ</th>
                        <th className="border border-slate-400 p-1">សៅរ៍</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEFAULT_DAILY_TASKS.map((task, tIdx) => (
                        <tr key={task.id} className="text-center">
                          <td className="border border-slate-400 p-1">{tIdx + 1}</td>
                          <td className="border border-slate-400 p-1 text-left font-bold">{task.name}</td>
                          {daysOfWeek.map((day, dIdx) => {
                            const bNum = getBranchForDuty(tIdx, dIdx);
                            return (
                              <td key={day.key} className="border border-slate-400 p-1">
                                អនុសាខាទី{toKhmerNum(bNum)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Signatures (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) */}
                <div className="pt-6 text-xs text-slate-800 space-y-4">
                  {/* ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ */}
                  <div className="flex justify-end">
                    <div className="text-center space-y-1 min-w-[180px]">
                      <div className="text-[10px] text-slate-600">
                        {khmerDateStr.split('\n')[0] || 'ថ្ងៃអង្គារ ៥កើត ខែមិគសិរ ឆ្នាំម្សាញ់'}
                      </div>
                      <div className="font-moul text-[11px]">គ្រូបន្ទុកថ្នាក់</div>
                      <div className="h-10"></div>
                      <div className="font-bold font-moul text-[11px] text-slate-900">
                        {teacher.name || 'ឌុក សុភ័ក្ត្រ'}
                      </div>
                    </div>
                  </div>

                  {/* ជួរទី២ ខាងក្រោម: នាយកសាលា */}
                  <div className="flex justify-start">
                    <div className="text-center space-y-1 min-w-[180px]">
                      <div className="font-moul text-[11px]">បានឃើញ និង ឯកភាព</div>
                      <div className="font-moul text-[11px]">នាយកសាលា</div>
                      <div className="h-10"></div>
                      <div className="text-[10px] text-slate-400">...................................................</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-white border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              ថ្នាក់ដឹកនាំ៖ <strong>{president?.name || 'មិនទាន់រើស'}</strong> (ប្រធាន) | <strong>{vp1?.name || 'គ្មាន'}</strong> & <strong>{vp2?.name || 'គ្មាន'}</strong> (អនុប្រធាន)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs sm:text-sm shadow-md transition"
            >
              យល់ព្រម & រក្សាទុក
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
