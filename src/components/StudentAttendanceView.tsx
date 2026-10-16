import React, { useState, useMemo, useEffect } from 'react';
import {
  Student,
  AttendanceDatabase,
  AttendanceStatus,
  TeacherProfile,
} from '../types';
import {
  formatDateYMD,
  getKhmerDayName,
  getKhmerMonthName,
  getWeekDates,
  getMonthDates,
  calculateAttendanceAnalytics,
  RangeAttendanceAnalytics,
  StudentAttendanceSummary,
} from '../utils/attendanceAnalytics';
import { getKhmerDateDisplay, toKhmerNum, KHMER_MONTH_NAMES } from '../utils/khmerDate';
import { getActiveAcademicYear, loadYearScopedData } from '../utils/academicYearStorage';
import { initialTeacherProfile } from '../data/initialData';
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  UserX,
  FileText,
  Printer,
  Search,
  Users,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Layers,
  Award,
  Filter,
  CheckCheck,
  Building2,
  Info,
  X,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentAttendanceViewProps {
  currentStudent: Student;
  students: Student[];
  attendance: AttendanceDatabase;
  teacher?: TeacherProfile;
  onShowToast: (msg: string) => void;
}

export const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({
  currentStudent,
  students,
  attendance,
  teacher: propTeacher,
  onShowToast,
}) => {
  // Main view mode: daily, weekly, monthly, annual
  const [activeViewMode, setActiveViewMode] = useState<
    'daily' | 'weekly' | 'monthly' | 'annual'
  >('daily');

  // Print Report Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printPeriodType, setPrintPeriodType] = useState<'monthly' | 'sem1' | 'sem2' | 'annual'>('monthly');

  // Active Academic Year
  const activeYear = useMemo(() => getActiveAcademicYear(), []);

  // Teacher Profile state
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    if (propTeacher) return propTeacher;
    const yearData = loadYearScopedData<TeacherProfile | null>(activeYear, 'teacher', null);
    if (yearData) return yearData;
    try {
      const legacy = localStorage.getItem('primary_teacher_admin_v2');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (parsed.teacher) return parsed.teacher;
      }
    } catch {}
    return initialTeacherProfile;
  });

  // Daily Mode State
  const [selectedDailyDate, setSelectedDailyDate] = useState<string>(() =>
    formatDateYMD(new Date())
  );
  const [dailySearchQuery, setDailySearchQuery] = useState('');
  const [dailyStatusFilter, setDailyStatusFilter] = useState<
    'all' | 'present' | 'permission' | 'absent'
  >('all');

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

  // Shift Daily Date
  const handleShiftDailyDate = (days: number) => {
    try {
      const [y, m, d] = selectedDailyDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + days);
      setSelectedDailyDate(formatDateYMD(date));
    } catch {}
  };

  // Shift Weekly Base Date
  const handleShiftWeekly = (weeks: number) => {
    try {
      const [y, m, d] = weeklyBaseDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + weeks * 7);
      setWeeklyBaseDate(formatDateYMD(date));
    } catch {}
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
    if (annualTerm === 'sem1') {
      const d1 = getMonthDates(selectedYear - 1, 10, true);
      const d2 = getMonthDates(selectedYear - 1, 11, true);
      const d3 = getMonthDates(selectedYear - 1, 12, true);
      const d4 = getMonthDates(selectedYear, 1, true);
      return [...d1, ...d2, ...d3, ...d4];
    } else if (annualTerm === 'sem2') {
      const d1 = getMonthDates(selectedYear, 2, true);
      const d2 = getMonthDates(selectedYear, 3, true);
      const d3 = getMonthDates(selectedYear, 4, true);
      const d4 = getMonthDates(selectedYear, 5, true);
      const d5 = getMonthDates(selectedYear, 6, true);
      const d6 = getMonthDates(selectedYear, 7, true);
      return [...d1, ...d2, ...d3, ...d4, ...d5, ...d6];
    } else {
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

  // Current active analytics based on selected tab
  const currentAnalytics = useMemo(() => {
    if (activeViewMode === 'weekly') return weeklyAnalytics;
    if (activeViewMode === 'monthly') return monthlyAnalytics;
    if (activeViewMode === 'annual') return annualAnalytics;
    return monthlyAnalytics;
  }, [activeViewMode, weeklyAnalytics, monthlyAnalytics, annualAnalytics]);

  // Current student summary for active analytics
  const currentStudentSummary: StudentAttendanceSummary | null = useMemo(() => {
    return (
      currentAnalytics.studentSummaries.find((s) => s.student.id === currentStudent.id) || null
    );
  }, [currentAnalytics, currentStudent.id]);

  // Overall student attendance status for selected day
  const currentDayStatus: AttendanceStatus = useMemo(() => {
    return attendance[selectedDailyDate]?.[currentStudent.id] || 'present';
  }, [attendance, selectedDailyDate, currentStudent.id]);

  // Daily filtered list of students
  const dailyStudentsList = useMemo(() => {
    const dayAttendance = attendance[selectedDailyDate] || {};
    return students.filter((s) => {
      const status = dayAttendance[s.id] || 'present';
      const matchesSearch =
        s.name.toLowerCase().includes(dailySearchQuery.toLowerCase()) ||
        (s.latinName && s.latinName.toLowerCase().includes(dailySearchQuery.toLowerCase())) ||
        String(s.rollNo).includes(dailySearchQuery) ||
        String(s.id).includes(dailySearchQuery);

      if (!matchesSearch) return false;
      if (dailyStatusFilter === 'all') return true;
      return status === dailyStatusFilter;
    });
  }, [students, attendance, selectedDailyDate, dailySearchQuery, dailyStatusFilter]);

  // Daily statistics
  const dailyStats = useMemo(() => {
    const dayAttendance = attendance[selectedDailyDate] || {};
    let present = 0;
    let permission = 0;
    let absent = 0;

    students.forEach((s) => {
      const status = dayAttendance[s.id] || 'present';
      if (status === 'present') present++;
      else if (status === 'permission') permission++;
      else if (status === 'absent') absent++;
    });

    const total = students.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 100;
    return { present, permission, absent, total, rate };
  }, [students, attendance, selectedDailyDate]);

  // Months list for Khmer selector (MoEYS Academic Year: Oct to Jul)
  const schoolMonthsList = [
    { num: 10, name: 'តុលា (ខែទី១)' },
    { num: 11, name: 'វិច្ឆិកា (ខែទី២)' },
    { num: 12, name: 'ធ្នូ (ខែទី៣)' },
    { num: 1, name: 'មករា (ខែទី៤)' },
    { num: 2, name: 'កុម្ភៈ (ខែទី៥)' },
    { num: 3, name: 'មីនា (ខែទី៦)' },
    { num: 4, name: 'មេសា (ខែទី៧)' },
    { num: 5, name: 'ឧសភា (ខែទី៨)' },
    { num: 6, name: 'មិថុនា (ខែទី៩)' },
    { num: 7, name: 'កក្កដា (ខែទី១០)' },
  ];

  // Month-by-month analysis for this student across the school year
  const studentYearlyMonthBreakdown = useMemo(() => {
    return schoolMonthsList.map((m) => {
      const yr = m.num >= 10 ? selectedYear - 1 : selectedYear;
      const mDates = getMonthDates(yr, m.num, true);
      const mAnalytics = calculateAttendanceAnalytics(students, attendance, mDates);
      const stSummary = mAnalytics.studentSummaries.find((s) => s.student.id === currentStudent.id);
      return {
        monthNum: m.num,
        monthName: m.name,
        schoolDays: mAnalytics.schoolDaysCount,
        present: stSummary ? stSummary.presentCount : 0,
        permission: stSummary ? stSummary.permissionCount : 0,
        absent: stSummary ? stSummary.absentCount : 0,
        rate: stSummary ? stSummary.attendanceRate : 100,
      };
    });
  }, [schoolMonthsList, selectedYear, students, attendance, currentStudent.id]);

  // Overall attendance tier badge
  const getHonorTierBadge = (rate: number, absentCount: number) => {
    if (rate >= 100 && absentCount === 0) {
      return {
        label: 'សិស្សគំរូវត្តមាន ១០០%',
        icon: '🥇',
        badgeClass: 'bg-emerald-500 text-white border-emerald-400',
        cardBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
      };
    }
    if (rate >= 95) {
      return {
        label: 'វត្តមានល្អប្រសើរ',
        icon: '🎖️',
        badgeClass: 'bg-blue-600 text-white border-blue-400',
        cardBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
      };
    }
    if (rate >= 85) {
      return {
        label: 'វត្តមានល្អ',
        icon: '🌟',
        badgeClass: 'bg-teal-600 text-white border-teal-400',
        cardBg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200',
      };
    }
    if (rate >= 70) {
      return {
        label: 'គួរកែលម្អវត្តមាន',
        icon: '⚠️',
        badgeClass: 'bg-amber-500 text-white border-amber-400',
        cardBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
      };
    }
    return {
      label: 'ប្រឈមនឹងការបាត់បង់ការសិក្សា',
      icon: '🚨',
      badgeClass: 'bg-rose-600 text-white border-rose-400',
      cardBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
    };
  };

  const honorInfo = getHonorTierBadge(
    currentStudentSummary?.attendanceRate ?? 100,
    currentStudentSummary?.absentCount ?? 0
  );

  return (
    <div className="space-y-6">
      {/* ================= HERO SECTION / ATTENDANCE NAV BAR ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Title & Student Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-teal-500/20 shrink-0">
                📅
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-moul">
                    វត្តមាន & អវត្តមានសិស្ស (Attendance System)
                  </h2>
                  <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    ដូចរដ្ឋបាលគ្រូ {activeYear}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ព័ត៌មានវត្តមានរបស់សិស្ស ៖ <strong className="text-emerald-600 dark:text-emerald-400">{currentStudent.name}</strong> (លេខកូដ #{currentStudent.rollNo}) | ថ្នាក់{teacherProfile.grade || 'ទី ៤'}
                </p>
              </div>
            </div>

            {/* Print Official Attendance Sheet Button */}
            <button
              onClick={() => {
                setPrintPeriodType(
                  activeViewMode === 'annual'
                    ? annualTerm === 'sem1'
                      ? 'sem1'
                      : annualTerm === 'sem2'
                      ? 'sem2'
                      : 'annual'
                    : 'monthly'
                );
                setShowPrintModal(true);
              }}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>មើល / បោះពុម្ពសន្លឹកវត្តមានផ្លូវការ</span>
            </button>
          </div>

          {/* 4 Main Attendance View Mode Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => setActiveViewMode('daily')}
              className={`py-3 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeViewMode === 'daily'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="font-moul text-[11px]">១. ប្រចាំថ្ងៃ</span>
            </button>

            <button
              onClick={() => setActiveViewMode('weekly')}
              className={`py-3 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeViewMode === 'weekly'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-md ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="font-moul text-[11px]">២. ប្រចាំសប្តាហ៍</span>
            </button>

            <button
              onClick={() => setActiveViewMode('monthly')}
              className={`py-3 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeViewMode === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="font-moul text-[11px]">៣. ប្រចាំខែ</span>
            </button>

            <button
              onClick={() => setActiveViewMode('annual')}
              className={`py-3 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeViewMode === 'annual'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-md ring-1 ring-slate-900/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span className="font-moul text-[11px]">៤. ប្រចាំឆ្នាំ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= TOP SUMMARY METRIC CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total School Days */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg shrink-0">
            🗓️
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              ថ្ងៃរៀនសរុប
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {currentAnalytics.schoolDaysCount}{' '}
              <span className="text-xs font-normal text-slate-400">ថ្ងៃ</span>
            </div>
          </div>
        </div>

        {/* Present Days */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
              វត្តមាន (មក)
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {currentStudentSummary?.presentCount ?? 0}{' '}
              <span className="text-xs font-normal text-slate-400">ថ្ងៃ</span>
            </div>
          </div>
        </div>

        {/* Permission Days */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block">
              មានច្បាប់ (ច)
            </span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {currentStudentSummary?.permissionCount ?? 0}{' '}
              <span className="text-xs font-normal text-slate-400">ថ្ងៃ</span>
            </div>
          </div>
        </div>

        {/* Absent Days */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg shrink-0">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase block">
              អវត្តមាន (ឥតច្បាប់)
            </span>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400">
              {currentStudentSummary?.absentCount ?? 0}{' '}
              <span className="text-xs font-normal text-slate-400">ថ្ងៃ</span>
            </div>
          </div>
        </div>

        {/* Attendance Percentage & Tier */}
        <div className="col-span-2 lg:col-span-1 p-4 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-100 uppercase block">
              អត្រាវត្តមានសរុប
            </span>
            <div className="text-2xl font-black">
              {currentStudentSummary?.attendanceRate ?? 100}%
            </div>
            <span className="text-[9px] font-extrabold text-emerald-200 truncate block mt-0.5">
              {honorInfo.icon} {honorInfo.label}
            </span>
          </div>
          <div className="text-3xl">
            {honorInfo.icon}
          </div>
        </div>
      </div>

      {/* ================= 1. DAILY ATTENDANCE VIEW ================= */}
      {activeViewMode === 'daily' && (
        <div className="space-y-6">
          {/* Daily Date Controller Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShiftDailyDate(-1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                title="ថ្ងៃមុន"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedDailyDate(formatDateYMD(new Date()))}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                ថ្ងៃនេះ (Today)
              </button>
              <button
                onClick={() => handleShiftDailyDate(1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                title="ថ្ងៃបន្ទាប់"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Date Display */}
            <div className="text-center">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                កាលបរិច្ឆេទវត្តមាន
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-moul">
                {getKhmerDateDisplay(selectedDailyDate)}
              </h3>
            </div>

            {/* Native Date Picker */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDailyDate}
                onChange={(e) => e.target.value && setSelectedDailyDate(e.target.value)}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 Cols): Current Student Daily Status Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden space-y-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-slate-200">
                    ស្ថានភាពផ្ទាល់ខ្លួនប្រចាំថ្ងៃ
                  </span>
                  <span className="text-2xl">
                    {currentDayStatus === 'present' ? '🟢' : currentDayStatus === 'permission' ? '🟡' : '🔴'}
                  </span>
                </div>

                <div className="text-center py-2 space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-white/10 flex items-center justify-center text-4xl shadow-inner border border-white/15">
                    {currentDayStatus === 'present' ? '✅' : currentDayStatus === 'permission' ? '📝' : '❌'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-moul text-white">
                      {currentDayStatus === 'present'
                        ? 'វត្តមាន (បានមកចូលរៀន)'
                        : currentDayStatus === 'permission'
                        ? 'សុំច្បាប់ (មានច្បាប់)'
                        : 'អវត្តមាន (ឥតច្បាប់)'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      សម្រាប់កាលបរិច្ឆេទ ៖ {selectedDailyDate}
                    </p>
                  </div>
                </div>

                {/* Class Daily Stats */}
                <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
                  <div className="p-3 bg-white/10 rounded-2xl text-center">
                    <span className="text-[10px] text-emerald-300 font-bold block">វត្តមាន</span>
                    <div className="text-lg font-black text-white">{dailyStats.present} នាក់</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl text-center">
                    <span className="text-[10px] text-amber-300 font-bold block">មានច្បាប់</span>
                    <div className="text-lg font-black text-white">{dailyStats.permission} នាក់</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl text-center">
                    <span className="text-[10px] text-rose-300 font-bold block">អវត្តមាន</span>
                    <div className="text-lg font-black text-white">{dailyStats.absent} នាក់</div>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-300">
                  អត្រាវត្តមានសរុបក្នុងថ្នាក់ថ្ងៃនេះ ៖ <strong className="text-emerald-400 font-bold">{dailyStats.rate}%</strong>
                </div>
              </div>

              {/* Status Meaning Guide Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-moul flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>និមិត្តសញ្ញាវត្តមានស្តង់ដារ MoEYS</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white font-black flex items-center justify-center text-[10px]">
                      វ
                    </span>
                    <span className="font-bold">វត្តមាន (បានមកចូលរៀនទាន់ពេលវេលា)</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-black flex items-center justify-center text-[10px]">
                      ច
                    </span>
                    <span className="font-bold">ច្បាប់ (អវត្តមានមានការអនុញ្ញាត/សុំច្បាប់)</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    <span className="w-6 h-6 rounded-lg bg-rose-500 text-white font-black flex items-center justify-center text-[10px]">
                      អ
                    </span>
                    <span className="font-bold">អវត្តមាន (ខកខានឥតច្បាប់ ឬបាត់មុខ)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): Full Class Daily Roll Table (ដូចកន្លែងរដ្ឋបាលគ្រូ) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-emerald-600 rounded-full" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul">
                      បញ្ជីស្រង់វត្តមានសិស្សក្នុងថ្នាក់ប្រចាំថ្ងៃ ({dailyStudentsList.length} នាក់)
                    </h3>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="ស្វែងរកឈ្មោះ ឬលេខរៀង..."
                      value={dailySearchQuery}
                      onChange={(e) => setDailySearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    {[
                      { id: 'all', label: 'ទាំងអស់' },
                      { id: 'present', label: 'វត្តមាន' },
                      { id: 'permission', label: 'ច្បាប់' },
                      { id: 'absent', label: 'អវត្តមាន' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setDailyStatusFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-1 sm:flex-none cursor-pointer ${
                          dailyStatusFilter === f.id
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table of students */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-12">ល.រ</th>
                        <th className="py-2.5 px-3">ឈ្មោះសិស្ស</th>
                        <th className="py-2.5 px-3 text-center w-16">ភេទ</th>
                        <th className="py-2.5 px-3 text-center w-28">ស្ថានភាព</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {dailyStudentsList.map((st) => {
                        const stStatus = attendance[selectedDailyDate]?.[st.id] || 'present';
                        const isSelf = st.id === currentStudent.id;

                        return (
                          <tr
                            key={st.id}
                            className={`transition ${
                              isSelf
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 font-bold ring-2 ring-emerald-500/50'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                              {toKhmerNum(st.rollNo)}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {st.name}
                                </span>
                                {isSelf && (
                                  <span className="bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full">
                                    ខ្លួនឯង
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-600 dark:text-slate-400">
                              {st.gender}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {stStatus === 'present' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>វត្តមាន</span>
                                </span>
                              ) : stStatus === 'permission' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>មានច្បាប់</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold text-[10px] border border-rose-200 dark:border-rose-800">
                                  <X className="w-3 h-3 text-rose-600" />
                                  <span>អវត្តមាន</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. WEEKLY ATTENDANCE VIEW ================= */}
      {activeViewMode === 'weekly' && (
        <div className="space-y-6">
          {/* Weekly Controller Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShiftWeekly(-1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                title="សប្តាហ៍មុន"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setWeeklyBaseDate(formatDateYMD(new Date()))}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                សប្តាហ៍នេះ (This Week)
              </button>
              <button
                onClick={() => handleShiftWeekly(1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                title="សប្តាហ៍បន្ទាប់"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Range Title */}
            <div className="text-center">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                វត្តមានប្រចាំសប្តាហ៍ ({weeklyDates.length} ថ្ងៃ)
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul">
                ពី {weeklyDates[0]} ដល់ {weeklyDates[weeklyDates.length - 1]}
              </h3>
            </div>

            {/* Saturday Toggle */}
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSaturdayWeekly}
                onChange={(e) => setIncludeSaturdayWeekly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
              />
              <span>រាប់បញ្ចូលថ្ងៃសៅរ៍ (Mon-Sat)</span>
            </label>
          </div>

          {/* Weekly Matrix Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-teal-600 rounded-full" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul">
                  តារាងម៉ាទ្រីសវត្តមានប្រចាំសប្តាហ៍ (Weekly Class Roll Matrix)
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-12">ល.រ</th>
                    <th className="py-2.5 px-3 min-w-[140px]">ឈ្មោះសិស្ស</th>
                    <th className="py-2.5 px-2 text-center w-14">ភេទ</th>
                    {weeklyDates.map((dateStr) => {
                      const dayName = getKhmerDayName(dateStr);
                      const [, , d] = dateStr.split('-');
                      return (
                        <th key={dateStr} className="py-2.5 px-2 text-center min-w-[50px]">
                          <div className="text-[10px] text-slate-400 font-normal">{dayName}</div>
                          <div className="font-bold">{d}</div>
                        </th>
                      );
                    })}
                    <th className="py-2.5 px-2 text-center w-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                      វ
                    </th>
                    <th className="py-2.5 px-2 text-center w-14 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                      ច
                    </th>
                    <th className="py-2.5 px-2 text-center w-14 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300">
                      អ
                    </th>
                    <th className="py-2.5 px-2 text-center w-16 bg-slate-100 dark:bg-slate-800 font-black">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {weeklyAnalytics.studentSummaries.map((stSummary) => {
                    const isSelf = stSummary.student.id === currentStudent.id;
                    return (
                      <tr
                        key={stSummary.student.id}
                        className={`transition ${
                          isSelf
                            ? 'bg-teal-50/80 dark:bg-teal-950/40 font-bold ring-2 ring-teal-500/50'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                          {toKhmerNum(stSummary.student.rollNo)}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {stSummary.student.name}
                            </span>
                            {isSelf && (
                              <span className="bg-teal-600 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                                ខ្ញុំ
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-500">
                          {stSummary.student.gender}
                        </td>
                        {weeklyDates.map((dateStr) => {
                          const status = stSummary.dailyStatus[dateStr] || 'present';
                          return (
                            <td key={dateStr} className="py-2.5 px-2 text-center">
                              {status === 'present' ? (
                                <span className="inline-block w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black leading-6 text-[11px]">
                                  វ
                                </span>
                              ) : status === 'permission' ? (
                                <span className="inline-block w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black leading-6 text-[11px]">
                                  ច
                                </span>
                              ) : (
                                <span className="inline-block w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black leading-6 text-[11px]">
                                  អ
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-2 text-center font-bold text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20">
                          {stSummary.presentCount}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-amber-600 bg-amber-50/50 dark:bg-amber-950/20">
                          {stSummary.permissionCount}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-rose-600 bg-rose-50/50 dark:bg-rose-950/20">
                          {stSummary.absentCount}
                        </td>
                        <td className="py-2.5 px-2 text-center font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800">
                          {stSummary.attendanceRate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. MONTHLY ATTENDANCE VIEW ================= */}
      {activeViewMode === 'monthly' && (
        <div className="space-y-6">
          {/* Month Selector Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 pl-2 pr-1 shrink-0 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>ជ្រើសរើសខែ ៖</span>
              </span>
              {schoolMonthsList.map((m) => {
                const isSelected = selectedMonth === m.num;
                return (
                  <button
                    key={m.num}
                    onClick={() => setSelectedMonth(m.num)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>📅 {m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 Cols): Interactive Calendar Grid for Current Student */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-moul">
                      ប្រតិទិនវត្តមានផ្ទាល់ខ្លួន ({KHMER_MONTH_NAMES[selectedMonth - 1]})
                    </h3>
                  </div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-6 gap-1.5 text-center">
                  {['ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហ', 'សុក្រ', 'សៅរ៍'].map((d) => (
                    <div key={d} className="text-[10px] font-bold text-slate-400 py-1">
                      {d}
                    </div>
                  ))}

                  {monthlyDates.map((dStr) => {
                    const status = currentStudentSummary?.dailyStatus[dStr] || 'present';
                    const [, , dNum] = dStr.split('-');
                    return (
                      <div
                        key={dStr}
                        onClick={() => {
                          setSelectedDailyDate(dStr);
                          setActiveViewMode('daily');
                        }}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                          status === 'present'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                            : status === 'permission'
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 hover:bg-rose-100'
                        }`}
                        title={`${dStr}: ${status === 'present' ? 'វត្តមាន' : status === 'permission' ? 'ច្បាប់' : 'អវត្តមាន'}`}
                      >
                        <div className="text-[11px] font-bold">{dNum}</div>
                        <div className="text-[9px] font-black mt-0.5">
                          {status === 'present' ? 'វ' : status === 'permission' ? 'ច' : 'អ'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-[11px] text-slate-500 space-y-1">
                  <div>• ចុចលើថ្ងៃណាមួយក្នុងប្រតិទិន ដើម្បីចូលមើលព័ត៌មានលម្អិតប្រចាំថ្ងៃនោះ។</div>
                  <div>• វត្តមានក្នុងខែនេះ ៖ <strong className="text-emerald-600">{currentStudentSummary?.presentCount} ថ្ងៃ</strong> | អវត្តមាន ៖ <strong className="text-rose-600">{currentStudentSummary?.absentCount} ថ្ងៃ</strong></div>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): Monthly Class Roll Table (ដូចកន្លែងរដ្ឋបាលគ្រូ MoEYS) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul">
                      តារាងស្រង់វត្តមានសិស្សប្រចាំខែ{KHMER_MONTH_NAMES[selectedMonth - 1]}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-blue-800">
                    សរុប {monthlyAnalytics.schoolDaysCount} ថ្ងៃរៀន
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 max-h-[500px]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-12">ល.រ</th>
                        <th className="py-2.5 px-3">ឈ្មោះសិស្ស</th>
                        <th className="py-2.5 px-2 text-center w-14">ភេទ</th>
                        <th className="py-2.5 px-2 text-center w-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700">
                          វត្តមាន
                        </th>
                        <th className="py-2.5 px-2 text-center w-14 bg-amber-50 dark:bg-amber-950/40 text-amber-700">
                          ច្បាប់
                        </th>
                        <th className="py-2.5 px-2 text-center w-14 bg-rose-50 dark:bg-rose-950/40 text-rose-700">
                          អវត្តមាន
                        </th>
                        <th className="py-2.5 px-2 text-center w-16 bg-slate-100 dark:bg-slate-800 font-black">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {monthlyAnalytics.studentSummaries.map((stSummary) => {
                        const isSelf = stSummary.student.id === currentStudent.id;
                        return (
                          <tr
                            key={stSummary.student.id}
                            className={`transition ${
                              isSelf
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 font-bold ring-2 ring-blue-500/50'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                              {toKhmerNum(stSummary.student.rollNo)}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {stSummary.student.name}
                                </span>
                                {isSelf && (
                                  <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                                    ខ្ញុំ
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-2 text-center text-slate-500">
                              {stSummary.student.gender}
                            </td>
                            <td className="py-2.5 px-2 text-center font-bold text-emerald-600">
                              {stSummary.presentCount}
                            </td>
                            <td className="py-2.5 px-2 text-center font-bold text-amber-600">
                              {stSummary.permissionCount}
                            </td>
                            <td className="py-2.5 px-2 text-center font-bold text-rose-600">
                              {stSummary.absentCount}
                            </td>
                            <td className="py-2.5 px-2 text-center font-black text-slate-900 dark:text-white">
                              {stSummary.attendanceRate}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. ANNUAL & SEMESTER ATTENDANCE VIEW ================= */}
      {activeViewMode === 'annual' && (
        <div className="space-y-6">
          {/* Term Selector Pills */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setAnnualTerm('sem1')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                annualTerm === 'sem1'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>📊 ឆមាសទី១ (តុលា - មករា)</span>
            </button>
            <button
              onClick={() => setAnnualTerm('sem2')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                annualTerm === 'sem2'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>📊 ឆមាសទី២ (កុម្ភៈ - កញ្ញា)</span>
            </button>
            <button
              onClick={() => setAnnualTerm('full')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                annualTerm === 'full'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>🏆 ពេញមួយឆ្នាំសិក្សា (Full Year)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 Cols): Annual Honor Evaluation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden space-y-6 border border-amber-800/40">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-200">
                    ការវាយតម្លៃវត្តមានប្រចាំឆ្នាំ
                  </span>
                  <span className="text-3xl">{honorInfo.icon}</span>
                </div>

                <div className="text-center py-2 space-y-2">
                  <div className="text-4xl sm:text-5xl font-black font-moul text-amber-300">
                    {currentStudentSummary?.attendanceRate ?? 100}%
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {honorInfo.label}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {currentStudentSummary?.attendanceRate && currentStudentSummary.attendanceRate >= 95
                      ? '👏 សិស្សមានការចូលរៀនបានទៀងទាត់ និងជាគំរូល្អក្នុងថ្នាក់!'
                      : '⚠️ សូមបន្តការយកចិត្តទុកដាក់ និងកាត់បន្ថយការអវត្តមានឥតច្បាប់!'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-center">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <span className="text-[10px] text-slate-300 font-bold block">វត្តមានសរុប</span>
                    <div className="text-xl font-black text-white">{currentStudentSummary?.presentCount ?? 0} ថ្ងៃ</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <span className="text-[10px] text-slate-300 font-bold block">អវត្តមានសរុប</span>
                    <div className="text-xl font-black text-rose-300">{currentStudentSummary?.absentCount ?? 0} ថ្ងៃ</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): Month-by-Month Annual Breakdown Table */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-amber-600 rounded-full" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-moul">
                      របាយការណ៍វត្តមានតាមខែនីមួយៗ (Monthly Breakdown)
                    </h3>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">ខែសិក្សា</th>
                        <th className="py-2.5 px-2 text-center">ថ្ងៃរៀន</th>
                        <th className="py-2.5 px-2 text-center text-emerald-600">វត្តមាន (វ)</th>
                        <th className="py-2.5 px-2 text-center text-amber-600">ច្បាប់ (ច)</th>
                        <th className="py-2.5 px-2 text-center text-rose-600">អវត្តមាន (អ)</th>
                        <th className="py-2.5 px-2 text-center font-black">អត្រា %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {studentYearlyMonthBreakdown.map((mRow) => (
                        <tr key={mRow.monthNum} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                            {mRow.monthName}
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-500 font-mono">
                            {mRow.schoolDays}
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-emerald-600">
                            {mRow.present}
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-amber-600">
                            {mRow.permission}
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-rose-600">
                            {mRow.absent}
                          </td>
                          <td className="py-2.5 px-2 text-center font-black text-slate-900 dark:text-white">
                            {mRow.rate}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRINT OFFICIAL ATTENDANCE MODAL ================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl">
                  🖨️
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white font-moul">
                    សន្លឹកវត្តមាន និងអវត្តមានផ្លូវការ (Official Attendance Sheet)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ទម្រង់ស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPrintModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Print Preview Container */}
            <div
              id="printable-student-attendance-sheet"
              className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 space-y-6 text-xs font-sans shadow-sm"
            >
              {/* MoEYS Official Kingdom Header */}
              <div className="text-center space-y-1 border-b pb-4 border-slate-200">
                <div className="font-moul text-sm text-slate-900">ព្រះរាជាណាចក្រកម្ពុជា</div>
                <div className="font-moul text-xs text-slate-800">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                <div className="text-[11px] font-bold text-slate-600 mt-2">
                  ក្រសួងអប់រំ យុវជន និងកីឡា | មន្ទីរអប់រំ យុវជន និងកីឡា
                </div>
                <div className="text-[11px] font-bold text-indigo-700">
                  សាលាបឋមសិក្សា ៖ {teacherProfile.schoolName || 'អនុវត្តរាជធានី'} | ថ្នាក់{teacherProfile.grade || 'ទី ៤'}
                </div>
                <h2 className="text-base font-black font-moul text-slate-900 mt-3">
                  សន្លឹករបាយការណ៍វត្តមាន និងអវត្តមានសិស្ស
                </h2>
                <p className="text-xs text-slate-500">
                  ឆ្នាំសិក្សា {activeYear}
                </p>
              </div>

              {/* Student Bio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">ឈ្មោះសិស្ស ៖</span>
                  <strong className="text-slate-900 font-moul text-sm">{currentStudent.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">អក្សរឡាតាំង ៖</span>
                  <strong className="text-slate-900">{currentStudent.latinName || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">ភេទ ៖</span>
                  <strong className="text-slate-900">{currentStudent.gender}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">លេខរៀងក្នុងបញ្ជី ៖</span>
                  <strong className="text-slate-900">#{currentStudent.rollNo}</strong>
                </div>
              </div>

              {/* Attendance Breakdown Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 font-moul text-xs">
                  សង្ខេបស្ថិតិវត្តមានតាមខែនីមួយៗ ៖
                </h4>
                <table className="w-full border-collapse border border-slate-300 text-center text-xs">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th className="border border-slate-300 p-2">ខែសិក្សា</th>
                      <th className="border border-slate-300 p-2">ថ្ងៃរៀនសរុប</th>
                      <th className="border border-slate-300 p-2 text-emerald-700">វត្តមាន (ថ្ងៃ)</th>
                      <th className="border border-slate-300 p-2 text-amber-700">មានច្បាប់ (ថ្ងៃ)</th>
                      <th className="border border-slate-300 p-2 text-rose-700">អវត្តមានឥតច្បាប់ (ថ្ងៃ)</th>
                      <th className="border border-slate-300 p-2 font-black">អត្រាវត្តមាន (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentYearlyMonthBreakdown.map((m) => (
                      <tr key={m.monthNum}>
                        <td className="border border-slate-300 p-2 font-bold text-left pl-3">{m.monthName}</td>
                        <td className="border border-slate-300 p-2 font-mono">{m.schoolDays}</td>
                        <td className="border border-slate-300 p-2 font-bold text-emerald-700">{m.present}</td>
                        <td className="border border-slate-300 p-2 font-bold text-amber-700">{m.permission}</td>
                        <td className="border border-slate-300 p-2 font-bold text-rose-700">{m.absent}</td>
                        <td className="border border-slate-300 p-2 font-black">{m.rate}%</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-black">
                      <td className="border border-slate-300 p-2 text-left pl-3">សរុបរួមប្រចាំឆ្នាំ</td>
                      <td className="border border-slate-300 p-2 font-mono">{annualAnalytics.schoolDaysCount}</td>
                      <td className="border border-slate-300 p-2 text-emerald-700">{currentStudentSummary?.presentCount ?? 0}</td>
                      <td className="border border-slate-300 p-2 text-amber-700">{currentStudentSummary?.permissionCount ?? 0}</td>
                      <td className="border border-slate-300 p-2 text-rose-700">{currentStudentSummary?.absentCount ?? 0}</td>
                      <td className="border border-slate-300 p-2 text-indigo-700">{currentStudentSummary?.attendanceRate ?? 100}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Official Signatures */}
              <div className="grid grid-cols-2 pt-8 text-center text-xs">
                <div>
                  <p className="text-slate-500">បានឃើញ និងឯកភាព</p>
                  <p className="font-bold text-slate-800 font-moul mt-1">ហត្ថលេខាមាតាបិតា / អាណាព្យាបាល</p>
                  <div className="h-16" />
                </div>
                <div>
                  <p className="text-slate-500">ថ្ងៃទី........ ខែ........ ឆ្នាំ២០២...</p>
                  <p className="font-bold text-slate-800 font-moul mt-1">ហត្ថលេខាគ្រូបន្ទុកថ្នាក់</p>
                  <div className="h-16" />
                  <p className="font-bold text-indigo-900">{teacherProfile.name || 'លោកគ្រូ អ្នកគ្រូ'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                បិទ
              </button>
              <button
                onClick={() => {
                  window.print();
                  onShowToast('បានបើកផ្ទាំងបោះពុម្ពសន្លឹកវត្តមានសិស្សដោយជោគជ័យ!');
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>បោះពុម្ព (Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
