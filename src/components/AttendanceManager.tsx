import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  UserX,
  CheckCheck,
  Save,
  FileText,
  Printer,
  FileSpreadsheet,
  Search,
  Users,
  TrendingUp,
  AlertTriangle,
  Send,
  PhoneCall,
  Sparkles,
  RefreshCw,
  Award,
  Filter,
  BarChart3,
  CalendarRange,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Student, AttendanceDatabase, AttendanceStatus, TeacherProfile } from '../types';
import {
  formatDateYMD,
  getKhmerDayName,
  getKhmerMonthName,
  getWeekDates,
  getMonthDates,
  getDateRangeDates,
  calculateAttendanceAnalytics,
  generateSampleAttendance,
  exportAttendanceAnalyticsToExcel,
  buildParentAttendanceAlertMessage,
  RangeAttendanceAnalytics
} from '../utils/attendanceAnalytics';
import { getKhmerDateDisplay, KHMER_MONTH_NAMES } from '../utils/khmerDate';
import { generateAttendancePdfHtml } from '../utils/attendancePdfGenerator';
import { PdfCustomizerModal } from './PdfCustomizerModal';

interface AttendanceManagerProps {
  teacher: TeacherProfile;
  students: Student[];
  attendance: AttendanceDatabase;
  onUpdateAttendance: (date: string, studentId: number, status: AttendanceStatus) => void;
  onSaveAttendance: () => void;
  onBatchUpdateAttendance?: (newDb: AttendanceDatabase) => void;
  onOpenPdfCustomizer?: () => void;
  onShowToast: (msg: string) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  teacher,
  students,
  attendance,
  onUpdateAttendance,
  onSaveAttendance,
  onBatchUpdateAttendance,
  onOpenPdfCustomizer,
  onShowToast,
}) => {
  // Main view mode
  const [activeViewMode, setActiveViewMode] = useState<
    'daily' | 'weekly' | 'monthly' | 'annual' | 'custom' | 'alerts'
  >('daily');

  // Attendance PDF Customizer Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Daily Mode State
  const [selectedDailyDate, setSelectedDailyDate] = useState<string>(() =>
    formatDateYMD(new Date())
  );
  const [dailySearchQuery, setDailySearchQuery] = useState('');
  const [dailyStatusFilter, setDailyStatusFilter] = useState<
    'all' | 'present' | 'permission' | 'absent'
  >('all');
  const [dailyGenderFilter, setDailyGenderFilter] = useState<'all' | 'ស្រី' | 'ប្រុស'>('all');

  // Weekly Mode State
  const [weeklyBaseDate, setWeeklyBaseDate] = useState<string>(() =>
    formatDateYMD(new Date())
  );
  const [includeSaturdayWeekly, setIncludeSaturdayWeekly] = useState(true);

  // Monthly Mode State
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());

  // Annual Mode State
  const [annualTerm, setAnnualTerm] = useState<'full' | 'sem1' | 'sem2'>('full');

  // Custom Range State
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return formatDateYMD(d);
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() =>
    formatDateYMD(new Date())
  );

  // General Filter & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'ស្រី' | 'ប្រុស'>('all');
  const [sortBy, setSortBy] = useState<'rollNo' | 'name' | 'rateDesc' | 'rateAsc' | 'absentDesc'>('rollNo');

  // Telegram alert modal state
  const [selectedAlertStudent, setSelectedAlertStudent] = useState<Student | null>(null);
  const [alertCopied, setAlertCopied] = useState(false);

  // Shift Daily Date
  const handleShiftDailyDate = (days: number) => {
    try {
      const [y, m, d] = selectedDailyDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + days);
      setSelectedDailyDate(formatDateYMD(date));
    } catch {
      // fallback
    }
  };

  // Shift Weekly Base Date
  const handleShiftWeekly = (weeks: number) => {
    try {
      const [y, m, d] = weeklyBaseDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + weeks * 7);
      setWeeklyBaseDate(formatDateYMD(date));
    } catch {
      // fallback
    }
  };

  // Mark all present on selected daily date
  const handleMarkAllPresentDaily = () => {
    students.forEach((s) => {
      onUpdateAttendance(selectedDailyDate, s.id, 'present');
    });
    onShowToast(`បានកត់ត្រាវត្តមានសិស្សទាំង ${students.length} នាក់ជា (វត្តមាន) សម្រាប់ថ្ងៃនេះ!`);
  };

  // --- ANALYTICS CALCULATIONS ---

  // 1. Weekly Dates & Analytics
  const weeklyDates = useMemo(() => {
    return getWeekDates(weeklyBaseDate, includeSaturdayWeekly);
  }, [weeklyBaseDate, includeSaturdayWeekly]);

  const weeklyAnalytics: RangeAttendanceAnalytics = useMemo(() => {
    return calculateAttendanceAnalytics(students, attendance, weeklyDates);
  }, [students, attendance, weeklyDates]);

  // 2. Monthly Dates & Analytics
  const monthlyDates = useMemo(() => {
    return getMonthDates(selectedYear, selectedMonth, true);
  }, [selectedYear, selectedMonth]);

  const monthlyAnalytics: RangeAttendanceAnalytics = useMemo(() => {
    return calculateAttendanceAnalytics(students, attendance, monthlyDates);
  }, [students, attendance, monthlyDates]);

  // 3. Annual Dates & Analytics
  const annualDates = useMemo(() => {
    // School year typically October to July (or Jan-Dec)
    if (annualTerm === 'sem1') {
      // Semester 1: October to February
      const d1 = getMonthDates(selectedYear - 1, 10, true);
      const d2 = getMonthDates(selectedYear - 1, 11, true);
      const d3 = getMonthDates(selectedYear - 1, 12, true);
      const d4 = getMonthDates(selectedYear, 1, true);
      const d5 = getMonthDates(selectedYear, 2, true);
      return [...d1, ...d2, ...d3, ...d4, ...d5];
    } else if (annualTerm === 'sem2') {
      // Semester 2: March to July
      const d3 = getMonthDates(selectedYear, 3, true);
      const d4 = getMonthDates(selectedYear, 4, true);
      const d5 = getMonthDates(selectedYear, 5, true);
      const d6 = getMonthDates(selectedYear, 6, true);
      const d7 = getMonthDates(selectedYear, 7, true);
      return [...d3, ...d4, ...d5, ...d6, ...d7];
    } else {
      // Full Year (all dates in current attendance DB or months 1..12)
      const allDbDates = Object.keys(attendance).sort();
      if (allDbDates.length > 0) {
        return allDbDates;
      }
      return getMonthDates(selectedYear, selectedMonth, true);
    }
  }, [annualTerm, selectedYear, selectedMonth, attendance]);

  const annualAnalytics: RangeAttendanceAnalytics = useMemo(() => {
    return calculateAttendanceAnalytics(students, attendance, annualDates);
  }, [students, attendance, annualDates]);

  // 4. Custom Range Dates & Analytics
  const customDates = useMemo(() => {
    return getDateRangeDates(customStartDate, customEndDate, true);
  }, [customStartDate, customEndDate]);

  const customAnalytics: RangeAttendanceAnalytics = useMemo(() => {
    return calculateAttendanceAnalytics(students, attendance, customDates);
  }, [students, attendance, customDates]);

  // Active analytics based on selected tab
  const currentAnalytics = useMemo(() => {
    if (activeViewMode === 'weekly') return weeklyAnalytics;
    if (activeViewMode === 'monthly') return monthlyAnalytics;
    if (activeViewMode === 'annual') return annualAnalytics;
    if (activeViewMode === 'custom') return customAnalytics;
    return monthlyAnalytics;
  }, [activeViewMode, weeklyAnalytics, monthlyAnalytics, annualAnalytics, customAnalytics]);

  // Filtered & Sorted Student Summaries
  const filteredSummaries = useMemo(() => {
    let list = [...currentAnalytics.studentSummaries];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.student.name.toLowerCase().includes(q) ||
          (item.student.latinName && item.student.latinName.toLowerCase().includes(q)) ||
          String(item.student.rollNo).includes(q) ||
          String(item.student.id).includes(q)
      );
    }

    if (genderFilter !== 'all') {
      list = list.filter((item) => item.student.gender === genderFilter);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'rollNo') return a.student.rollNo - b.student.rollNo;
      if (sortBy === 'name') return a.student.name.localeCompare(b.student.name, 'km');
      if (sortBy === 'rateDesc') return b.attendanceRate - a.attendanceRate;
      if (sortBy === 'rateAsc') return a.attendanceRate - b.attendanceRate;
      if (sortBy === 'absentDesc') return b.absentCount - a.absentCount;
      return 0;
    });

    return list;
  }, [currentAnalytics, searchQuery, genderFilter, sortBy]);

  // Daily Mode: Filtered Student List
  const currentDayAttendance = attendance[selectedDailyDate] || {};
  let dailyPresentCount = 0;
  let dailyPermissionCount = 0;
  let dailyAbsentCount = 0;

  students.forEach((s) => {
    const status = currentDayAttendance[s.id] || 'present';
    if (status === 'present') dailyPresentCount++;
    else if (status === 'permission') dailyPermissionCount++;
    else if (status === 'absent') dailyAbsentCount++;
  });

  const dailyTotalStudents = students.length;
  const dailyAttendanceRate =
    dailyTotalStudents > 0 ? Math.round((dailyPresentCount / dailyTotalStudents) * 100) : 100;

  const filteredDailyStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(dailySearchQuery.toLowerCase()) ||
      (s.latinName && s.latinName.toLowerCase().includes(dailySearchQuery.toLowerCase())) ||
      String(s.rollNo).includes(dailySearchQuery) ||
      String(s.id).includes(dailySearchQuery);

    if (!matchesSearch) return false;

    if (dailyGenderFilter !== 'all' && s.gender !== dailyGenderFilter) return false;

    const status = currentDayAttendance[s.id] || 'present';
    if (dailyStatusFilter === 'all') return true;
    return status === dailyStatusFilter;
  });

  // At-Risk Students list (Absences >= 3 or Rate < 80%)
  const atRiskStudentsList = useMemo(() => {
    return currentAnalytics.studentSummaries.filter(
      (s) => s.absentCount >= 3 || s.attendanceRate < 80 || s.consecutiveAbsences >= 2
    );
  }, [currentAnalytics]);

  // Auto-Fill Realistic Sample Attendance Generator
  const handleGenerateSampleData = (mode: 'week' | 'month' | 'custom') => {
    let targetDates: string[] = [];
    if (mode === 'week') targetDates = weeklyDates;
    else if (mode === 'month') targetDates = monthlyDates;
    else targetDates = customDates;

    const newDb = generateSampleAttendance(students, targetDates, attendance);
    if (onBatchUpdateAttendance) {
      onBatchUpdateAttendance(newDb);
    } else {
      // update one by one
      targetDates.forEach((d) => {
        const dayRecord = newDb[d] || {};
        students.forEach((s) => {
          if (dayRecord[s.id]) {
            onUpdateAttendance(d, s.id, dayRecord[s.id]);
          }
        });
      });
    }
    onShowToast(`🤖 បានបង្កើតទិន្នន័យគំរូវត្តមានដោយស្វ័យប្រវត្តិចំនួន ${targetDates.length} ថ្ងៃជោគជ័យ!`);
  };

  // Export Active View to Excel
  const handleExportExcel = () => {
    let title = '';
    let subtitle = '';
    let targetAnalytics = currentAnalytics;
    let fileName = 'attendance_report.xlsx';

    if (activeViewMode === 'weekly') {
      title = `បូកសរុបវត្តមានប្រចាំសប្តាហ៍ (${weeklyDates[0]} ដល់ ${weeklyDates[weeklyDates.length - 1]})`;
      subtitle = `សប្តាហ៍មានចំនួន ${weeklyDates.length} ថ្ងៃសិក្សា`;
      targetAnalytics = weeklyAnalytics;
      fileName = `វត្តមានប្រចាំសប្តាហ៍_${weeklyBaseDate}.xlsx`;
    } else if (activeViewMode === 'monthly') {
      title = `តារាងស្រង់វត្តមានសិស្សប្រចាំខែ ${KHMER_MONTH_NAMES[selectedMonth - 1]} ឆ្នាំ ${selectedYear}`;
      subtitle = `សរុបថ្ងៃសិក្សា៖ ${monthlyDates.length} ថ្ងៃ`;
      targetAnalytics = monthlyAnalytics;
      fileName = `វត្តមានប្រចាំខែ_${KHMER_MONTH_NAMES[selectedMonth - 1]}_${selectedYear}.xlsx`;
    } else if (activeViewMode === 'annual') {
      title = `បូកសរុបវត្តមានប្រចាំឆ្នាំសិក្សា ${teacher.academicYear || `${selectedYear - 1}-${selectedYear}`}`;
      subtitle = `ទម្រង់៖ ${annualTerm === 'full' ? 'ពេញមួយឆ្នាំសិក្សា' : annualTerm === 'sem1' ? 'ឆមាសទី ១' : 'ឆមាសទី ២'}`;
      targetAnalytics = annualAnalytics;
      fileName = `វត្តមានប្រចាំឆ្នាំ_${annualTerm}.xlsx`;
    } else if (activeViewMode === 'custom') {
      title = `បូកសរុបវត្តមានសិស្ស ចន្លោះពី ${customStartDate} ដល់ ${customEndDate}`;
      subtitle = `សរុបថ្ងៃសិក្សា៖ ${customDates.length} ថ្ងៃ`;
      targetAnalytics = customAnalytics;
      fileName = `វត្តមានចន្លោះថ្ងៃ_${customStartDate}_${customEndDate}.xlsx`;
    } else {
      title = `តារាងស្រង់វត្តមានប្រចាំថ្ងៃ ${selectedDailyDate}`;
      subtitle = getKhmerDateDisplay(selectedDailyDate);
      targetAnalytics = calculateAttendanceAnalytics(students, attendance, [selectedDailyDate]);
      fileName = `វត្តមានប្រចាំថ្ងៃ_${selectedDailyDate}.xlsx`;
    }

    exportAttendanceAnalyticsToExcel(title, subtitle, teacher, students, targetAnalytics, fileName);
    onShowToast(`បាននាំចេញរបាយការណ៍ជាឯកសារ Excel (.xlsx) ជោគជ័យ!`);
  };

  // Preset Date Ranges for Custom View
  const applyDatePreset = (preset: 'last7' | 'last14' | 'last30' | 'thisMonth' | 'lastMonth' | 'sem1' | 'sem2') => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    if (preset === 'last7') {
      start.setDate(today.getDate() - 7);
    } else if (preset === 'last14') {
      start.setDate(today.getDate() - 14);
    } else if (preset === 'last30') {
      start.setDate(today.getDate() - 30);
    } else if (preset === 'thisMonth') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (preset === 'lastMonth') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (preset === 'sem1') {
      start = new Date(today.getFullYear() - 1, 9, 1); // Oct 1
      end = new Date(today.getFullYear(), 1, 28); // Feb 28
    } else if (preset === 'sem2') {
      start = new Date(today.getFullYear(), 2, 1); // March 1
      end = new Date(today.getFullYear(), 6, 31); // July 31
    }

    setCustomStartDate(formatDateYMD(start));
    setCustomEndDate(formatDateYMD(end));
    onShowToast(`បានជ្រើសរើសចន្លោះកាលបរិច្ឆេទដោយជោគជ័យ!`);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Main Mode Switcher */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white p-5 sm:p-6 rounded-[28px] shadow-xl border border-purple-900/40">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-purple-200 backdrop-blur-md">
              <CalendarRange className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>ប្រព័ន្ធគ្រប់គ្រង & បូកសរុបវត្តមានសិស្សឆ្លាតវៃ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>បូកសរុបវត្តមាន៖ សប្តាហ៍ • ខែ • ឆ្នាំ & ចន្លោះថ្ងៃ</span>
            </h2>
            <p className="text-xs text-purple-200/90 leading-relaxed max-w-2xl">
              គណនាអត្រាវត្តមានដោយស្វ័យប្រវត្តិតាមស្តង់ដាក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) បង្ហាញជាតារាង Matrix ពេញលេញ នាំចេញ Excel និង PDF A4 Landscape គ្រប់ទម្រង់។
            </p>
          </div>

          {/* Quick Action Group */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/30 active:scale-95 border border-emerald-400/40"
              title="ទាញយកជាឯកសារ Excel Workbook (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
              <span>នាំចេញ Excel</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-amber-950/20 active:scale-95 border border-amber-300"
              title="កំណត់ទម្រង់ ស្ទីល ហត្ថលេខា និងទាញយកជា PDF A4 Landscape សម្រាប់របាយការណ៍បច្ចុប្បន្ន"
            >
              <FileText className="w-4 h-4 text-purple-950" />
              <span>📄 កំណត់ទម្រង់ & ទាញយក PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/20 active:scale-95"
              title="បោះពុម្ពឯកសាររបាយការណ៍ស្អាតផ្លូវការ"
            >
              <Printer className="w-4 h-4 text-slate-200" />
              <span className="hidden sm:inline">ព្រីន</span>
            </button>
          </div>
        </div>

        {/* View Mode Nav Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-5 no-scrollbar border-t border-purple-800/40 pt-4">
          {[
            { id: 'daily', label: '១. ស្រង់វត្តមានប្រចាំថ្ងៃ (Daily)', icon: CalendarDays },
            { id: 'weekly', label: '២. បូកសរុបប្រចាំសប្តាហ៍ (Weekly)', icon: Layers },
            { id: 'monthly', label: '៣. បូកសរុបតាមខែ (Monthly Matrix)', icon: Calendar },
            { id: 'annual', label: '៤. បូកសរុបប្រចាំឆ្នាំ / ឆមាស (Annual)', icon: TrendingUp },
            { id: 'custom', label: '៥. បូកសរុបចន្លោះថ្ងៃកំណត់ (Custom Range)', icon: CalendarRange },
            {
              id: 'alerts',
              label: `៦. តាមដានសិស្សប្រឈម & ផ្ញើសារ (${atRiskStudentsList.length})`,
              icon: AlertTriangle,
              badge: atRiskStudentsList.length > 0 ? atRiskStudentsList.length : undefined,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeViewMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveViewMode(tab.id as any)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
                  isActive
                    ? 'bg-white text-purple-950 border-white shadow-lg shadow-purple-950/30 font-black scale-[1.02]'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20 border-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-amber-300'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= VIEW 1: DAILY ROLL CALL (ស្រង់វត្តមានប្រចាំថ្ងៃ) ================= */}
      {activeViewMode === 'daily' && (
        <div className="space-y-4">
          {/* Daily Toolbar & Date Selector */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleShiftDailyDate(-1)}
                    className="px-2.5 py-1.5 hover:bg-white rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1"
                    title="ថ្ងៃម្សិលមិញ"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">ម្សិលមិញ</span>
                  </button>

                  <input
                    type="date"
                    value={selectedDailyDate}
                    onChange={(e) => setSelectedDailyDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono shadow-xs mx-1"
                  />

                  <button
                    type="button"
                    onClick={() => handleShiftDailyDate(1)}
                    className="px-2.5 py-1.5 hover:bg-white rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1"
                    title="ថ្ងៃស្អែក"
                  >
                    <span className="hidden sm:inline">ស្អែក</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDailyDate(formatDateYMD(new Date()))}
                  className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-purple-700" />
                  <span>ថ្ងៃនេះ (Today)</span>
                </button>

                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 shadow-xs">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{getKhmerDateDisplay(selectedDailyDate)}</span>
                </div>
              </div>

              {/* Batch Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleMarkAllPresentDaily}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-95"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>វត្តមានទាំងអស់ (Mark All)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSaveAttendance();
                    onShowToast('បានរក្សាទុកទិន្នន័យវត្តមានសិស្សដោយជោគជ័យ!');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-purple-900/20 active:scale-95"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>រក្សាទុកវត្តមាន</span>
                </button>
              </div>
            </div>

            {/* Daily KPI Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500">សិស្សសរុប</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {dailyTotalStudents} <span className="text-xs font-bold text-slate-500">នាក់</span>
                </p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                  ស្រី {students.filter((s) => s.gender === 'ស្រី').length} នាក់
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>វត្តមាន (Present)</span>
                </p>
                <p className="text-xl font-extrabold text-emerald-700 mt-1">
                  {dailyPresentCount} <span className="text-xs font-bold text-emerald-600">នាក់</span>
                </p>
                <p className="text-[10px] font-bold text-emerald-600 mt-0.5">{dailyAttendanceRate}% នៃសរុប</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                <p className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>សុំច្បាប់ (Permission)</span>
                </p>
                <p className="text-xl font-extrabold text-amber-700 mt-1">
                  {dailyPermissionCount} <span className="text-xs font-bold text-amber-600">នាក់</span>
                </p>
                <p className="text-[10px] font-semibold text-amber-600 mt-0.5">មានការអនុញ្ញាត</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200">
                <p className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>អវត្តមាន (Absent)</span>
                </p>
                <p className="text-xl font-extrabold text-rose-700 mt-1">
                  {dailyAbsentCount} <span className="text-xs font-bold text-rose-600">នាក់</span>
                </p>
                <p className="text-[10px] font-semibold text-rose-600 mt-0.5">អត់ច្បាប់</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 col-span-2 sm:col-span-1">
                <p className="text-[11px] font-bold text-purple-900">អត្រាវត្តមានថ្ងៃនេះ</p>
                <p className="text-xl font-extrabold text-purple-950 mt-1">{dailyAttendanceRate}%</p>
                <div className="w-full bg-purple-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-purple-700 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${dailyAttendanceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Table with Quick Status Switches */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ស្វែងរកឈ្មោះសិស្ស ឬលេខរៀង..."
                  value={dailySearchQuery}
                  onChange={(e) => setDailySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: `ទាំងអស់ (${students.length})` },
                  { id: 'present', label: `🟢 វត្តមាន (${dailyPresentCount})` },
                  { id: 'permission', label: `🟡 ច្បាប់ (${dailyPermissionCount})` },
                  { id: 'absent', label: `🔴 អវត្តមាន (${dailyAbsentCount})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDailyStatusFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      dailyStatusFilter === tab.id
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-extrabold text-slate-600 border-b border-slate-200 uppercase tracking-wider">
                    <th className="p-3.5 text-center w-12">ល.រ</th>
                    <th className="p-3.5">រូបថត & ឈ្មោះសិស្ស</th>
                    <th className="p-3.5 text-center w-16">ភេទ</th>
                    <th className="p-3.5 text-center w-72">ការស្រង់វត្តមាន (ជ្រើសរើសស្ថានភាព)</th>
                    <th className="p-3.5 text-center w-32">ស្ថានភាពបច្ចុប្បន្ន</th>
                    <th className="p-3.5 text-right w-36">ទូរស័ព្ទអាណាព្យាបាល</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredDailyStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                        មិនមានទិន្នន័យសិស្សត្រូវនឹងការស្វែងរកឡើយ
                      </td>
                    </tr>
                  ) : (
                    filteredDailyStudents.map((s, idx) => {
                      const status: AttendanceStatus = currentDayAttendance[s.id] || 'present';
                      return (
                        <tr
                          key={s.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            status === 'absent'
                              ? 'bg-rose-50/30'
                              : status === 'permission'
                              ? 'bg-amber-50/30'
                              : ''
                          }`}
                        >
                          <td className="p-3.5 text-center font-bold text-slate-400">{s.rollNo || idx + 1}</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border ${
                                  s.gender === 'ស្រី'
                                    ? 'bg-pink-100 text-pink-800 border-pink-200'
                                    : 'bg-blue-100 text-blue-800 border-blue-200'
                                }`}
                              >
                                {s.avatar ? (
                                  <img
                                    src={s.avatar}
                                    alt={s.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span>{s.name.charAt(0)}</span>
                                )}
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-900">{s.name}</p>
                                <p className="text-[11px] text-slate-400 font-medium">{s.latinName || `ID: ${s.id}`}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                s.gender === 'ស្រី'
                                  ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {s.gender}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="inline-flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 gap-1">
                              <button
                                type="button"
                                onClick={() => onUpdateAttendance(selectedDailyDate, s.id, 'present')}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 active:scale-95 ${
                                  status === 'present'
                                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40'
                                    : 'text-slate-600 hover:text-emerald-700 hover:bg-white/80'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>វត្តមាន</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onUpdateAttendance(selectedDailyDate, s.id, 'permission')}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 active:scale-95 ${
                                  status === 'permission'
                                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300/40'
                                    : 'text-slate-600 hover:text-amber-700 hover:bg-white/80'
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>សុំច្បាប់</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onUpdateAttendance(selectedDailyDate, s.id, 'absent')}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 active:scale-95 ${
                                  status === 'absent'
                                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/40'
                                    : 'text-slate-600 hover:text-rose-700 hover:bg-white/80'
                                }`}
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>អវត្តមាន</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            {status === 'present' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>មានវត្តមាន</span>
                              </span>
                            )}
                            {status === 'permission' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                <span>សុំច្បាប់</span>
                              </span>
                            )}
                            {status === 'absent' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                <span>អវត្តមាន</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right font-mono text-slate-600 font-semibold">
                            {s.parentPhone || '—'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: WEEKLY SUMMARY & GRID (បូកសរុបប្រចាំសប្តាហ៍) ================= */}
      {activeViewMode === 'weekly' && (
        <div className="space-y-4">
          {/* Weekly Toolbar */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleShiftWeekly(-1)}
                    className="px-2.5 py-1.5 hover:bg-white rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1"
                    title="សប្តាហ៍មុន"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>សប្តាហ៍មុន</span>
                  </button>

                  <input
                    type="date"
                    value={weeklyBaseDate}
                    onChange={(e) => setWeeklyBaseDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono shadow-xs mx-1"
                  />

                  <button
                    type="button"
                    onClick={() => handleShiftWeekly(1)}
                    className="px-2.5 py-1.5 hover:bg-white rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1"
                    title="សប្តាហ៍បន្ទាប់"
                  >
                    <span>សប្តាហ៍បន្ទាប់</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setWeeklyBaseDate(formatDateYMD(new Date()))}
                  className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-purple-700" />
                  <span>សប្តាហ៍បច្ចុប្បន្ន</span>
                </button>

                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSaturdayWeekly}
                    onChange={(e) => setIncludeSaturdayWeekly(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>រាប់បញ្ចូលថ្ងៃសៅរ៍ (៦ថ្ងៃ/សប្តាហ៍)</span>
                </label>
              </div>

              {/* Sample Data Auto Generator */}
              <button
                type="button"
                onClick={() => handleGenerateSampleData('week')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition flex items-center gap-1.5"
                title="បង្កើតទិន្នន័យគំរូវត្តមានសាកល្បងសម្រាប់សប្តាហ៍នេះ"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>បំពេញទិន្នន័យគំរូសប្តាហ៍នេះ (Auto-Fill)</span>
              </button>
            </div>

            {/* Weekly KPI Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500">ថ្ងៃសិក្សាសប្តាហ៍នេះ</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {weeklyAnalytics.schoolDaysCount} <span className="text-xs font-bold text-slate-500">ថ្ងៃ</span>
                </p>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                  {weeklyDates[0]} ដល់ {weeklyDates[weeklyDates.length - 1]}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-800">អត្រាវត្តមានសរុប</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-1">
                  {weeklyAnalytics.averageAttendanceRate}%
                </p>
                <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                  វត្តមានសរុប {weeklyAnalytics.actualPresents} ដង
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                <p className="text-[11px] font-bold text-amber-800">សុំច្បាប់ក្នុងសប្តាហ៍</p>
                <p className="text-xl font-extrabold text-amber-700 mt-1">
                  {weeklyAnalytics.actualPermissions} <span className="text-xs font-bold text-amber-600">ដង</span>
                </p>
                <p className="text-[10px] font-medium text-amber-600 mt-0.5">មានការជូនដំណឹង</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200">
                <p className="text-[11px] font-bold text-rose-800">អវត្តមានឥតច្បាប់</p>
                <p className="text-xl font-extrabold text-rose-700 mt-1">
                  {weeklyAnalytics.actualAbsents} <span className="text-xs font-bold text-rose-600">ដង</span>
                </p>
                <p className="text-[10px] font-medium text-rose-600 mt-0.5">ខកខានការសិក្សា</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 col-span-2 sm:col-span-1">
                <p className="text-[11px] font-bold text-indigo-900">សិស្សវត្តមាន ១០០%</p>
                <p className="text-xl font-extrabold text-indigo-950 mt-1">
                  {weeklyAnalytics.perfectAttendanceCount} <span className="text-xs font-bold text-indigo-600">នាក់</span>
                </p>
                <p className="text-[10px] font-bold text-indigo-600 mt-0.5">
                  នៃសិស្សសរុប {students.length} នាក់
                </p>
              </div>
            </div>

            {/* Daily Attendance Rate Bar of the Week */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-extrabold text-slate-800 mb-3 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-purple-700" />
                <span>អត្រាវត្តមានតាមថ្ងៃក្នុងសប្តាហ៍ (Daily Progress Rate)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {weeklyAnalytics.dailySummaries.map((ds) => (
                  <div
                    key={ds.date}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-center"
                  >
                    <p className="text-[11px] font-bold text-slate-500">
                      {ds.dayNameKhmer} ({ds.date.split('-')[2]})
                    </p>
                    <p className="text-base font-black text-slate-900 mt-0.5">{ds.rate}%</p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          ds.rate >= 90
                            ? 'bg-emerald-500'
                            : ds.rate >= 75
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${ds.rate}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {ds.presentCount}/{students.length} នាក់
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Interactive Matrix Table */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ស្វែងរកឈ្មោះសិស្ស..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
                >
                  <option value="all">ភេទទាំងអស់</option>
                  <option value="ស្រី">សិស្សស្រី</option>
                  <option value="ប្រុស">សិស្សប្រុស</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
                >
                  <option value="rollNo">តម្រៀបតាមលេខរៀង</option>
                  <option value="name">តម្រៀបតាមឈ្មោះ</option>
                  <option value="rateDesc">អត្រាវត្តមានខ្ពស់ទៅទាប</option>
                  <option value="rateAsc">អត្រាវត្តមានទាបទៅខ្ពស់</option>
                  <option value="absentDesc">អវត្តមានច្រើនជាងគេ</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-extrabold text-slate-700 border-b border-slate-200">
                    <th className="p-3 text-center w-12">ល.រ</th>
                    <th className="p-3 w-48">ឈ្មោះសិស្ស</th>
                    <th className="p-3 text-center w-14">ភេទ</th>
                    {weeklyDates.map((dateStr) => {
                      const [y, m, d] = dateStr.split('-').map(Number);
                      const dayName = getKhmerDayName(dateStr);
                      return (
                        <th key={dateStr} className="p-2.5 text-center min-w-[70px]">
                          <div className="font-extrabold text-slate-800">{dayName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {d}/{m}
                          </div>
                        </th>
                      );
                    })}
                    <th className="p-2.5 text-center w-16 bg-emerald-50/50 text-emerald-800">វត្តមាន</th>
                    <th className="p-2.5 text-center w-16 bg-amber-50/50 text-amber-800">ច្បាប់</th>
                    <th className="p-2.5 text-center w-16 bg-rose-50/50 text-rose-800">អវត្តមាន</th>
                    <th className="p-2.5 text-center w-20 bg-purple-50/50 text-purple-900 font-black">
                      អត្រា %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredSummaries.map((item, idx) => (
                    <tr key={item.student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-400">
                        {item.student.rollNo || idx + 1}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{item.student.name}</span>
                          {item.honorTier === 'perfect' && (
                            <span title="វត្តមានឥតខ្ចោះ ១០០%">🌟</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.student.gender === 'ស្រី'
                              ? 'bg-pink-50 text-pink-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {item.student.gender}
                        </span>
                      </td>
                      {weeklyDates.map((dateStr) => {
                        const status = item.dailyStatus[dateStr] || 'present';
                        return (
                          <td key={dateStr} className="p-1.5 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                // Cycle status: present -> permission -> absent -> present
                                const nextStatus: AttendanceStatus =
                                  status === 'present'
                                    ? 'permission'
                                    : status === 'permission'
                                    ? 'absent'
                                    : 'present';
                                onUpdateAttendance(dateStr, item.student.id, nextStatus);
                              }}
                              className={`w-8 h-8 rounded-lg text-xs font-bold inline-flex items-center justify-center transition active:scale-90 ${
                                status === 'present'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : status === 'permission'
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                  : status === 'absent'
                                  ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                              title="ចុចដើម្បីប្តូរស្ថានភាពវត្តមាន (Toggle)"
                            >
                              {status === 'present' ? '✓' : status === 'permission' ? 'P' : 'A'}
                            </button>
                          </td>
                        );
                      })}
                      <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/30">
                        {item.presentCount}
                      </td>
                      <td className="p-2.5 text-center font-bold text-amber-700 bg-amber-50/30">
                        {item.permissionCount}
                      </td>
                      <td className="p-2.5 text-center font-bold text-rose-700 bg-rose-50/30">
                        {item.absentCount}
                      </td>
                      <td className="p-2.5 text-center font-extrabold text-purple-950 bg-purple-50/30">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] ${
                            item.attendanceRate >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.attendanceRate >= 75
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.attendanceRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100/90 font-extrabold text-slate-800 text-xs border-t-2 border-slate-200">
                    <td colSpan={3} className="p-3 text-right">
                      សរុបវត្តមានប្រចាំថ្ងៃ៖
                    </td>
                    {weeklyAnalytics.dailySummaries.map((ds) => (
                      <td key={ds.date} className="p-2.5 text-center text-emerald-800 font-bold">
                        {ds.presentCount}
                      </td>
                    ))}
                    <td className="p-2.5 text-center text-emerald-800">{weeklyAnalytics.actualPresents}</td>
                    <td className="p-2.5 text-center text-amber-800">{weeklyAnalytics.actualPermissions}</td>
                    <td className="p-2.5 text-center text-rose-800">{weeklyAnalytics.actualAbsents}</td>
                    <td className="p-2.5 text-center text-purple-950 font-black">
                      {weeklyAnalytics.averageAttendanceRate}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: MONTHLY MATRIX (បូកសរុបតាមខែ MoEYS) ================= */}
      {activeViewMode === 'monthly' && (
        <div className="space-y-4">
          {/* Monthly Toolbar */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Month Picker */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-xs"
                  >
                    {KHMER_MONTH_NAMES.map((mName, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        ខែ {mName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-xs"
                  >
                    {[2024, 2025, 2026, 2027, 2028].map((y) => (
                      <option key={y} value={y}>
                        ឆ្នាំ {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900">
                  <span>📅 ខែ {KHMER_MONTH_NAMES[selectedMonth - 1]} ឆ្នាំ {selectedYear}</span>
                </div>
              </div>

              {/* Auto Sample Button */}
              <button
                type="button"
                onClick={() => handleGenerateSampleData('month')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition flex items-center gap-1.5"
                title="បង្កើតទិន្នន័យគំរូវត្តមានសាកល្បងសម្រាប់ខែនេះ"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>បំពេញទិន្នន័យគំរូខែនេះ (Auto-Fill Month)</span>
              </button>
            </div>

            {/* Monthly KPI Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500">ថ្ងៃសិក្សាក្នុងខែ</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {monthlyAnalytics.schoolDaysCount} <span className="text-xs font-bold text-slate-500">ថ្ងៃ</span>
                </p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">មិនរាប់បញ្ចូលថ្ងៃអាទិត្យ</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-800">អត្រាវត្តមានប្រចាំខែ</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-1">
                  {monthlyAnalytics.averageAttendanceRate}%
                </p>
                <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                  វត្តមាន {monthlyAnalytics.actualPresents} នាក់/ដង
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-pink-50/80 border border-pink-200">
                <p className="text-[11px] font-bold text-pink-800">អត្រាវត្តមានសិស្សស្រី</p>
                <p className="text-xl font-extrabold text-pink-700 mt-1">
                  {monthlyAnalytics.femaleAttendanceRate}%
                </p>
                <p className="text-[10px] font-semibold text-pink-600 mt-0.5">
                  សិស្សស្រី {students.filter((s) => s.gender === 'ស្រី').length} នាក់
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                <p className="text-[11px] font-bold text-amber-800">សុំច្បាប់សរុប</p>
                <p className="text-xl font-extrabold text-amber-700 mt-1">
                  {monthlyAnalytics.actualPermissions} <span className="text-xs font-bold text-amber-600">ដង</span>
                </p>
                <p className="text-[10px] font-medium text-amber-600 mt-0.5">មានការអនុញ្ញាត</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200">
                <p className="text-[11px] font-bold text-rose-800">អវត្តមានឥតច្បាប់</p>
                <p className="text-xl font-extrabold text-rose-700 mt-1">
                  {monthlyAnalytics.actualAbsents} <span className="text-xs font-bold text-rose-600">ដង</span>
                </p>
                <p className="text-[10px] font-medium text-rose-600 mt-0.5">
                  សិស្សប្រឈម {monthlyAnalytics.atRiskCount} នាក់
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Matrix Grid Table (Standard 1..31 Days) */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ស្វែងរកឈ្មោះសិស្ស..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold hidden md:inline">
                  សញ្ញាសម្គាល់៖ <span className="text-emerald-700 font-black">✓ = វត្តមាន</span>,{' '}
                  <span className="text-amber-700 font-black">P = សុំច្បាប់</span>,{' '}
                  <span className="text-rose-700 font-black">A = អវត្តមាន</span>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[600px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
                  <tr className="text-[10px] font-extrabold text-slate-700 border-b border-slate-300">
                    <th className="p-2 text-center w-8 bg-slate-100 sticky left-0 z-20">ល.រ</th>
                    <th className="p-2 min-w-[140px] bg-slate-100 sticky left-8 z-20">គោត្តនាម-នាម</th>
                    <th className="p-2 text-center w-10">ភេទ</th>
                    {monthlyDates.map((dateStr) => {
                      const dayNum = dateStr.split('-')[2];
                      return (
                        <th key={dateStr} className="p-1 text-center w-6 border-l border-slate-200 font-mono">
                          {Number(dayNum)}
                        </th>
                      );
                    })}
                    <th className="p-2 text-center w-12 bg-emerald-100/60 text-emerald-900 font-black border-l">
                      ✓
                    </th>
                    <th className="p-2 text-center w-12 bg-amber-100/60 text-amber-900 font-black border-l">
                      P
                    </th>
                    <th className="p-2 text-center w-12 bg-rose-100/60 text-rose-900 font-black border-l">
                      A
                    </th>
                    <th className="p-2 text-center w-14 bg-purple-100/60 text-purple-950 font-black border-l">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredSummaries.map((item, idx) => (
                    <tr key={item.student.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-2 text-center font-bold text-slate-400 bg-white sticky left-0 z-10">
                        {item.student.rollNo || idx + 1}
                      </td>
                      <td className="p-2 font-bold text-slate-900 bg-white sticky left-8 z-10 truncate max-w-[140px]">
                        {item.student.name}
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                            item.student.gender === 'ស្រី'
                              ? 'bg-pink-50 text-pink-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {item.student.gender}
                        </span>
                      </td>
                      {monthlyDates.map((dateStr) => {
                        const status = item.dailyStatus[dateStr] || 'none';
                        return (
                          <td
                            key={dateStr}
                            className={`p-1 text-center font-mono border-l border-slate-100 text-[10px] ${
                              status === 'present'
                                ? 'text-emerald-700 font-bold bg-emerald-50/20'
                                : status === 'permission'
                                ? 'text-amber-700 font-bold bg-amber-50/50'
                                : status === 'absent'
                                ? 'text-rose-700 font-bold bg-rose-50/60'
                                : 'text-slate-300'
                            }`}
                          >
                            {status === 'present' ? '✓' : status === 'permission' ? 'P' : status === 'absent' ? 'A' : '-'}
                          </td>
                        );
                      })}
                      <td className="p-2 text-center font-bold text-emerald-800 bg-emerald-50/40 border-l">
                        {item.presentCount}
                      </td>
                      <td className="p-2 text-center font-bold text-amber-800 bg-amber-50/40 border-l">
                        {item.permissionCount}
                      </td>
                      <td className="p-2 text-center font-bold text-rose-800 bg-rose-50/40 border-l">
                        {item.absentCount}
                      </td>
                      <td className="p-2 text-center font-black text-purple-950 bg-purple-50/40 border-l">
                        {item.attendanceRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="sticky bottom-0 bg-slate-100 border-t-2 border-slate-300 font-bold text-[10px]">
                  <tr>
                    <td colSpan={3} className="p-2 text-right bg-slate-100 sticky left-0 z-20">
                      សរុបវត្តមានប្រចាំថ្ងៃ៖
                    </td>
                    {monthlyAnalytics.dailySummaries.map((ds) => (
                      <td key={ds.date} className="p-1 text-center font-mono text-emerald-800 border-l">
                        {ds.presentCount}
                      </td>
                    ))}
                    <td className="p-2 text-center text-emerald-800 border-l">{monthlyAnalytics.actualPresents}</td>
                    <td className="p-2 text-center text-amber-800 border-l">{monthlyAnalytics.actualPermissions}</td>
                    <td className="p-2 text-center text-rose-800 border-l">{monthlyAnalytics.actualAbsents}</td>
                    <td className="p-2 text-center text-purple-950 font-black border-l">
                      {monthlyAnalytics.averageAttendanceRate}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 4: ANNUAL & SEMESTER SUMMARY (បូកសរុបប្រចាំឆ្នាំ / ឆមាស) ================= */}
      {activeViewMode === 'annual' && (
        <div className="space-y-4">
          {/* Annual Toolbar */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setAnnualTerm('full')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      annualTerm === 'full'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ពេញមួយឆ្នាំសិក្សា
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnualTerm('sem1')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      annualTerm === 'sem1'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ឆមាសទី ១ (តុលា - កុម្ភៈ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnualTerm('sem2')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      annualTerm === 'sem2'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ឆមាសទី ២ (មីនា - កក្កដា)
                  </button>
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900">
                  <span>🏆 ឆ្នាំសិក្សា៖ {teacher.academicYear || '២០២៥-២០២៦'}</span>
                </div>
              </div>

              {/* Honor Badges Summary */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>ឆ្នើមឥតខ្ចោះ: {annualAnalytics.perfectAttendanceCount} នាក់</span>
                </span>
              </div>
            </div>

            {/* Annual KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500">សរុបថ្ងៃកត់ត្រាក្នុងឆ្នាំ</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {annualAnalytics.schoolDaysCount} <span className="text-xs font-bold text-slate-500">ថ្ងៃ</span>
                </p>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                  សរុបវត្តមាន {annualAnalytics.actualPresents} លើក
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-800">អត្រាវត្តមានរួមប្រចាំឆ្នាំ</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-1">
                  {annualAnalytics.averageAttendanceRate}%
                </p>
                <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                  សិស្សស្រី {annualAnalytics.femaleAttendanceRate}% • សិស្សប្រុស {annualAnalytics.maleAttendanceRate}%
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                <p className="text-[11px] font-bold text-amber-800">សុំច្បាប់ប្រចាំឆ្នាំ</p>
                <p className="text-xl font-extrabold text-amber-700 mt-1">
                  {annualAnalytics.actualPermissions} <span className="text-xs font-bold text-amber-600">ដង</span>
                </p>
                <p className="text-[10px] font-medium text-amber-600 mt-0.5">មានមូលហេតុច្បាស់លាស់</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200">
                <p className="text-[11px] font-bold text-rose-800">អវត្តមានឥតច្បាប់ប្រចាំឆ្នាំ</p>
                <p className="text-xl font-extrabold text-rose-700 mt-1">
                  {annualAnalytics.actualAbsents} <span className="text-xs font-bold text-rose-600">ដង</span>
                </p>
                <p className="text-[10px] font-medium text-rose-600 mt-0.5">
                  សិស្សប្រឈម {annualAnalytics.atRiskCount} នាក់
                </p>
              </div>
            </div>
          </div>

          {/* Annual Student Cumulative Ranking Table */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ស្វែងរកឈ្មោះសិស្ស..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
                >
                  <option value="rateDesc">អត្រាវត្តមានខ្ពស់ទៅទាប</option>
                  <option value="rollNo">តម្រៀបតាមលេខរៀង</option>
                  <option value="name">តម្រៀបតាមឈ្មោះ</option>
                  <option value="absentDesc">អវត្តមានច្រើនជាងគេ</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-extrabold text-slate-700 border-b border-slate-200 uppercase tracking-wider">
                    <th className="p-3.5 text-center w-12">ល.រ</th>
                    <th className="p-3.5">ឈ្មោះសិស្ស</th>
                    <th className="p-3.5 text-center w-16">ភេទ</th>
                    <th className="p-3.5 text-center w-24">ថ្ងៃសិក្សាសរុប</th>
                    <th className="p-3.5 text-center w-24 bg-emerald-50/60 text-emerald-900">វត្តមាន</th>
                    <th className="p-3.5 text-center w-24 bg-amber-50/60 text-amber-900">ច្បាប់</th>
                    <th className="p-3.5 text-center w-24 bg-rose-50/60 text-rose-900">អវត្តមាន</th>
                    <th className="p-3.5 text-center w-28 bg-purple-50/60 text-purple-950 font-black">
                      អត្រា %
                    </th>
                    <th className="p-3.5 text-center w-36">ចំណាត់ថ្នាក់កិត្តិយស</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredSummaries.map((item, idx) => (
                    <tr key={item.student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 text-center font-bold text-slate-400">
                        {item.student.rollNo || idx + 1}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{item.student.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ({item.student.civilId || `ID:${item.student.id}`})
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.student.gender === 'ស្រី'
                              ? 'bg-pink-50 text-pink-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {item.student.gender}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-700">
                        {item.totalRecordedDays} ថ្ងៃ
                      </td>
                      <td className="p-3.5 text-center font-extrabold text-emerald-700 bg-emerald-50/20">
                        {item.presentCount}
                      </td>
                      <td className="p-3.5 text-center font-bold text-amber-700 bg-amber-50/20">
                        {item.permissionCount}
                      </td>
                      <td className="p-3.5 text-center font-bold text-rose-700 bg-rose-50/20">
                        {item.absentCount}
                      </td>
                      <td className="p-3.5 text-center bg-purple-50/20">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-black ${
                            item.attendanceRate >= 95
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.attendanceRate >= 85
                              ? 'bg-blue-100 text-blue-800'
                              : item.attendanceRate >= 75
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.attendanceRate}%
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {item.honorTier === 'perfect' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] border border-amber-300">
                            <span>🌟 ឥតខ្ចោះ (100%)</span>
                          </span>
                        )}
                        {item.honorTier === 'excellent' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                            <span>🟢 ល្អណាស់</span>
                          </span>
                        )}
                        {item.honorTier === 'good' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-[11px]">
                            <span>🔵 ល្អ</span>
                          </span>
                        )}
                        {item.honorTier === 'warning' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                            <span>🟡 ត្រូវតាមដាន</span>
                          </span>
                        )}
                        {item.honorTier === 'critical' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                            <span>🔴 ប្រកាសអាសន្ន</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 5: CUSTOM DATE RANGE AGGREGATOR (បូកសរុបចន្លោះថ្ងៃ) ================= */}
      {activeViewMode === 'custom' && (
        <div className="space-y-4">
          {/* Custom Date Range Toolbar */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Start Date & End Date Pickers */}
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex-wrap">
                  <div className="flex items-center gap-1 px-2">
                    <span className="text-xs font-bold text-slate-500">ពីថ្ងៃទី៖</span>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono shadow-xs"
                    />
                  </div>

                  <span className="text-slate-400 font-bold">→</span>

                  <div className="flex items-center gap-1 px-2">
                    <span className="text-xs font-bold text-slate-500">ដល់ថ្ងៃទី៖</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono shadow-xs"
                    />
                  </div>
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900">
                  <span>
                    សរុបចំនួន៖ <strong className="text-purple-950 font-black">{customDates.length}</strong> ថ្ងៃសិក្សា
                  </span>
                </div>
              </div>

              {/* Sample Data Button */}
              <button
                type="button"
                onClick={() => handleGenerateSampleData('custom')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition flex items-center gap-1.5"
                title="បង្កើតទិន្នន័យគំរូវត្តមានសាកល្បងសម្រាប់ចន្លោះថ្ងៃនេះ"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>បំពេញទិន្នន័យគំរូចន្លោះថ្ងៃនេះ</span>
              </button>
            </div>

            {/* Quick Range Preset Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>ជ្រើសរើសរហ័ស៖</span>
              </span>
              {[
                { id: 'last7', label: '៧ ថ្ងៃចុងក្រោយ' },
                { id: 'last14', label: '១៤ ថ្ងៃចុងក្រោយ' },
                { id: 'last30', label: '៣០ ថ្ងៃចុងក្រោយ' },
                { id: 'thisMonth', label: 'ខែនេះ' },
                { id: 'lastMonth', label: 'ខែមុន' },
                { id: 'sem1', label: 'ឆមាសទី ១' },
                { id: 'sem2', label: 'ឆមាសទី ២' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyDatePreset(p.id as any)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500">ថ្ងៃសិក្សាក្នុងចន្លោះ</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {customAnalytics.schoolDaysCount} <span className="text-xs font-bold text-slate-500">ថ្ងៃ</span>
                </p>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                  ពី {customStartDate} ដល់ {customEndDate}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-800">អត្រាវត្តមានមធ្យម</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-1">
                  {customAnalytics.averageAttendanceRate}%
                </p>
                <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                  វត្តមាន {customAnalytics.actualPresents} នាក់/ដង
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                <p className="text-[11px] font-bold text-amber-800">សុំច្បាប់ក្នុងចន្លោះ</p>
                <p className="text-xl font-extrabold text-amber-700 mt-1">
                  {customAnalytics.actualPermissions} <span className="text-xs font-bold text-amber-600">ដង</span>
                </p>
                <p className="text-[10px] font-medium text-amber-600 mt-0.5">មានការអនុញ្ញាត</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200">
                <p className="text-[11px] font-bold text-rose-800">អវត្តមានឥតច្បាប់</p>
                <p className="text-xl font-extrabold text-rose-700 mt-1">
                  {customAnalytics.actualAbsents} <span className="text-xs font-bold text-rose-600">ដង</span>
                </p>
                <p className="text-[10px] font-medium text-rose-600 mt-0.5">
                  សិស្សប្រឈម {customAnalytics.atRiskCount} នាក់
                </p>
              </div>
            </div>
          </div>

          {/* Custom Matrix & Breakdown Table */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ស្វែងរកឈ្មោះសិស្ស..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
                >
                  <option value="all">ភេទទាំងអស់</option>
                  <option value="ស្រី">សិស្សស្រី</option>
                  <option value="ប្រុស">សិស្សប្រុស</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
                >
                  <option value="rollNo">តម្រៀបតាមលេខរៀង</option>
                  <option value="name">តម្រៀបតាមឈ្មោះ</option>
                  <option value="rateDesc">អត្រាវត្តមានខ្ពស់ទៅទាប</option>
                  <option value="rateAsc">អត្រាវត្តមានទាបទៅខ្ពស់</option>
                  <option value="absentDesc">អវត្តមានច្រើនជាងគេ</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-extrabold text-slate-700 border-b border-slate-200 uppercase tracking-wider">
                    <th className="p-3 text-center w-12">ល.រ</th>
                    <th className="p-3">ឈ្មោះសិស្ស</th>
                    <th className="p-3 text-center w-16">ភេទ</th>
                    <th className="p-3 text-center w-24">ថ្ងៃកត់ត្រា</th>
                    <th className="p-3 text-center w-24 bg-emerald-50/60 text-emerald-900">វត្តមាន</th>
                    <th className="p-3 text-center w-24 bg-amber-50/60 text-amber-900">ច្បាប់</th>
                    <th className="p-3 text-center w-24 bg-rose-50/60 text-rose-900">អវត្តមាន</th>
                    <th className="p-3 text-center w-28 bg-purple-50/60 text-purple-950 font-black">
                      អត្រា %
                    </th>
                    <th className="p-3 text-center w-36">ស្ថានភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredSummaries.map((item, idx) => (
                    <tr key={item.student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-400">
                        {item.student.rollNo || idx + 1}
                      </td>
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900">{item.student.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.student.civilId || `ID:${item.student.id}`}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.student.gender === 'ស្រី'
                              ? 'bg-pink-50 text-pink-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {item.student.gender}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-700">
                        {item.totalRecordedDays} ថ្ងៃ
                      </td>
                      <td className="p-3 text-center font-bold text-emerald-700 bg-emerald-50/20">
                        {item.presentCount}
                      </td>
                      <td className="p-3 text-center font-bold text-amber-700 bg-amber-50/20">
                        {item.permissionCount}
                      </td>
                      <td className="p-3 text-center font-bold text-rose-700 bg-rose-50/20">
                        {item.absentCount}
                      </td>
                      <td className="p-3 text-center bg-purple-50/20">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-black ${
                            item.attendanceRate >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.attendanceRate >= 75
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.attendanceRate}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {item.attendanceRate >= 90 ? (
                          <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                            ទៀងទាត់ល្អ
                          </span>
                        ) : item.attendanceRate >= 75 ? (
                          <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold">
                            មធ្យម
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-800 text-[11px] font-bold">
                            អវត្តមានច្រើន
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 6: RISK ALERTS & TELEGRAM NOTIFICATION ================= */}
      {activeViewMode === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>ប្រព័ន្ធតាមដានសិស្សប្រឈម & ផ្ញើសារជូនដំណឹងអាណាព្យាបាល</span>
                </h3>
                <p className="text-xs text-slate-500">
                  រាយនាមសិស្សដែលមានអវត្តមានច្រើន (≥៣ ថ្ងៃ) ឬមានអវត្តមានជាប់ៗគ្នា សម្រាប់គ្រូធ្វើការទាក់ទងអាណាព្យាបាល
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-black border border-rose-200">
                រកឃើញសិស្សប្រឈម៖ {atRiskStudentsList.length} នាក់
              </span>
            </div>

            {atRiskStudentsList.length === 0 ? (
              <div className="p-12 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-extrabold text-emerald-900 text-sm">ពុំមានសិស្សប្រឈមនឹងការបោះបង់ ឬអវត្តមានច្រើនទេ</h4>
                <p className="text-xs text-emerald-700">សិស្សទាំងអស់មានអត្រាវត្តមានល្អ និងគោរពវិន័យបានយ៉ាងខ្ជាប់ខ្ជួន!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {atRiskStudentsList.map((item) => {
                  const absentDates = Object.entries(item.dailyStatus)
                    .filter(([_, st]) => st === 'absent')
                    .map(([d]) => d);

                  return (
                    <div
                      key={item.student.id}
                      className="p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-sm border border-rose-200 shrink-0">
                            {item.student.avatar ? (
                              <img
                                src={item.student.avatar}
                                alt={item.student.name}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              item.student.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{item.student.name}</h4>
                            <p className="text-[11px] text-slate-500 font-mono">
                              លេខរៀង: {item.student.rollNo} • ភេទ: {item.student.gender}
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black border border-rose-300">
                          អវត្តមាន {item.absentCount} ដង ({item.attendanceRate}%)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
                        <p className="text-slate-600 flex items-center justify-between">
                          <span>ទូរស័ព្ទអាណាព្យាបាល៖</span>
                          <strong className="font-mono text-slate-900">{item.student.parentPhone || '—'}</strong>
                        </p>
                        <p className="text-slate-600 flex items-center justify-between">
                          <span>ឪពុក/ម្តាយ៖</span>
                          <span className="text-slate-800">{item.student.fatherName || item.student.motherName || 'អាណាព្យាបាល'}</span>
                        </p>
                        {item.consecutiveAbsences > 1 && (
                          <p className="text-rose-700 font-bold text-[11px] bg-rose-50 px-2 py-1 rounded border border-rose-100">
                            ⚠️ អវត្តមាន {item.consecutiveAbsences} ថ្ងៃជាប់ៗគ្នា!
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAlertStudent(item.student);
                            setAlertCopied(false);
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-300" />
                          <span>ចម្លងសារ Telegram</span>
                        </button>

                        {item.student.parentPhone && (
                          <a
                            href={`tel:${item.student.parentPhone.replace(/\s+/g, '')}`}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0"
                            title="ហៅទូរស័ព្ទទៅអាណាព្យាបាល"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>ទូរស័ព្ទ</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TELEGRAM MESSAGE MODAL ================= */}
      {selectedAlertStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4 text-purple-700" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">
                  សារជូនដំណឹងអាណាព្យាបាលសិស្ស ({selectedAlertStudent.name})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlertStudent(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              លោកគ្រូ អ្នកគ្រូ អាចចម្លងអត្ថបទគំរូផ្លូវការនេះដើម្បីផ្ញើតាមរយៈ Telegram, Messenger ឬ SMS ទៅកាន់អាណាព្យាបាលសិស្ស៖
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-sans whitespace-pre-line leading-relaxed text-slate-800 max-h-60 overflow-y-auto">
              {buildParentAttendanceAlertMessage(
                selectedAlertStudent,
                teacher,
                Object.entries(
                  currentAnalytics.studentSummaries.find((s) => s.student.id === selectedAlertStudent.id)
                    ?.dailyStatus || {}
                )
                  .filter(([_, st]) => st === 'absent')
                  .map(([d]) => d),
                currentAnalytics.studentSummaries.find((s) => s.student.id === selectedAlertStudent.id)
                  ?.consecutiveAbsences || 1
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAlertStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                បិទ
              </button>
              <button
                type="button"
                onClick={() => {
                  const msg = buildParentAttendanceAlertMessage(
                    selectedAlertStudent,
                    teacher,
                    Object.entries(
                      currentAnalytics.studentSummaries.find((s) => s.student.id === selectedAlertStudent.id)
                        ?.dailyStatus || {}
                    )
                      .filter(([_, st]) => st === 'absent')
                      .map(([d]) => d),
                    currentAnalytics.studentSummaries.find((s) => s.student.id === selectedAlertStudent.id)
                      ?.consecutiveAbsences || 1
                  );
                  navigator.clipboard.writeText(msg);
                  setAlertCopied(true);
                  onShowToast('បានចម្លងអត្ថបទសារ Telegram ទៅកាន់ Clipboard ដោយជោគជ័យ!');
                  setTimeout(() => setAlertCopied(false), 2500);
                }}
                className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{alertCopied ? '✓ បានចម្លងរួចរាល់' : 'ចម្លងសារទាំងអស់ (Copy)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= PDF CUSTOMIZER MODAL FOR ALL ATTENDANCE REPORTS ================= */}
      {isPdfModalOpen && (() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        
        // Calculate appropriate analytics for current view mode
        let reportAnalytics: RangeAttendanceAnalytics;
        if (activeViewMode === 'daily') {
          reportAnalytics = calculateAttendanceAnalytics(students, attendance, [selectedDailyDate]);
        } else if (activeViewMode === 'weekly') {
          reportAnalytics = weeklyAnalytics;
        } else if (activeViewMode === 'monthly') {
          reportAnalytics = monthlyAnalytics;
        } else if (activeViewMode === 'annual') {
          reportAnalytics = annualAnalytics;
        } else if (activeViewMode === 'custom') {
          reportAnalytics = customAnalytics;
        } else {
          // alerts tab uses currentAnalytics
          reportAnalytics = currentAnalytics;
        }

        const pdfData = generateAttendancePdfHtml(
          activeViewMode,
          teacher,
          students,
          reportAnalytics,
          {
            selectedDailyDate,
            weeklyBaseDate,
            selectedMonth,
            selectedYear,
            annualTerm,
            customStartDate,
            customEndDate,
          }
        );

        return (
          <PdfCustomizerModal
            isOpen={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
            documentType="general"
            title={`កំណត់ទម្រង់ & ទាញយក PDF (${pdfData.title})`}
            initialHeader={{
              docTitle: pdfData.title,
              docSubtitle: pdfData.subtitle,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី',
              departmentInfo: 'ការិយាល័យអប់រំ យុវជន និងកីឡា នៃរដ្ឋបាលក្រុង/ស្រុក/ខណ្ឌ',
              leftSignatureTitle: 'បានឃើញ និងឯកភាព\nនាយកសាលា',
              rightSignatureTitle: 'គ្រូបន្ទុកថ្នាក់',
            }}
            customTableHtml={pdfData.tableHtml}
            onShowToast={onShowToast}
          />
        );
      })()}
    </div>
  );
};
