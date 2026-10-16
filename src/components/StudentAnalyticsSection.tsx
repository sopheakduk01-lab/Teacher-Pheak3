import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Student,
  GradeDatabase,
} from '../types';
import {
  calculateSinglePeriodSummary,
  getGradeClassification,
  ALL_ENTRY_MONTHS,
  GRADE_PERIODS,
  GradePeriodKey,
  GradeThresholds,
  PrimarySubSubject,
} from '../utils/gradeManager';
import {
  Users,
  Award,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  BookOpen,
  HeartHandshake,
  Sparkles,
  BarChart3,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Check,
  ChevronRight,
  GraduationCap,
  Calendar,
} from 'lucide-react';

interface StudentAnalyticsSectionProps {
  students: Student[];
  grades: GradeDatabase;
  selectedGradePeriod: GradePeriodKey;
  gradeThresholds: GradeThresholds;
  activeSubSubjects: string[];
  allDefs: PrimarySubSubject[];
  subScoresState: Record<string, Record<string, Record<string, number>>>;
  selectedS1Months?: string[];
  selectedS2Months?: string[];
  periodSubSubjectsMap?: Record<string, string[]>;
  onSelectPeriod?: (periodKey: GradePeriodKey) => void;
}

const CHRONOLOGICAL_PERIOD_KEYS: GradePeriodKey[] = [
  'm10', 'm11', 'm12', 'm01', 's1_exam',
  'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 's2_exam'
];

export const StudentAnalyticsSection: React.FC<StudentAnalyticsSectionProps> = ({
  students,
  grades,
  selectedGradePeriod,
  gradeThresholds,
  activeSubSubjects,
  allDefs,
  subScoresState,
  selectedS1Months = ['m10', 'm11', 'm12', 'm01'],
  selectedS2Months = ['m02', 'm03', 'm04', 'm05', 'm06', 'm07'],
  periodSubSubjectsMap,
  onSelectPeriod,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'slow_learners' | 'monthly_comparison' | 'learning_analysis'>('summary');

  // Period info for selectedGradePeriod
  const currentPeriodInfo = useMemo(() => {
    return GRADE_PERIODS.find(p => p.key === selectedGradePeriod) || {
      key: selectedGradePeriod,
      label: selectedGradePeriod,
      shortLabel: selectedGradePeriod,
    };
  }, [selectedGradePeriod]);

  // Single Period Summary for the selected period
  const currentSummary = useMemo(() => {
    return calculateSinglePeriodSummary(
      students,
      grades,
      selectedGradePeriod,
      gradeThresholds,
      activeSubSubjects,
      subScoresState,
      periodSubSubjectsMap
    );
  }, [students, grades, selectedGradePeriod, gradeThresholds, activeSubSubjects, subScoresState, periodSubSubjectsMap]);

  // Find previous period
  const previousPeriodKey = useMemo(() => {
    const idx = CHRONOLOGICAL_PERIOD_KEYS.indexOf(selectedGradePeriod);
    if (idx > 0) {
      return CHRONOLOGICAL_PERIOD_KEYS[idx - 1];
    }
    return null;
  }, [selectedGradePeriod]);

  // Previous Period Summary
  const prevSummary = useMemo(() => {
    if (!previousPeriodKey) return null;
    return calculateSinglePeriodSummary(
      students,
      grades,
      previousPeriodKey,
      gradeThresholds,
      activeSubSubjects,
      subScoresState,
      periodSubSubjectsMap
    );
  }, [students, grades, previousPeriodKey, gradeThresholds, activeSubSubjects, subScoresState, periodSubSubjectsMap]);

  // 1. Data Summary Statistics
  const summaryStats = useMemo(() => {
    const total = currentSummary.totalStudents || 0;
    const femaleTotal = currentSummary.femaleStudents || 0;
    const passed = currentSummary.passedCount || 0;
    const failed = currentSummary.failedCount || 0;

    let passedFemale = 0;
    let failedFemale = 0;

    // Count female pass/fail and grade distributions with gender
    const gradeDetails: Record<'A' | 'B' | 'C' | 'D' | 'E' | 'F', { total: number; female: number; percent: string }> = {
      A: { total: 0, female: 0, percent: '0%' },
      B: { total: 0, female: 0, percent: '0%' },
      C: { total: 0, female: 0, percent: '0%' },
      D: { total: 0, female: 0, percent: '0%' },
      E: { total: 0, female: 0, percent: '0%' },
      F: { total: 0, female: 0, percent: '0%' },
    };

    currentSummary.students.forEach(item => {
      const isFemale = item.student.gender === 'ស្រី';
      if (item.passed) {
        if (isFemale) passedFemale++;
      } else {
        if (isFemale) failedFemale++;
      }

      const letter = item.classification.letter as 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
      if (gradeDetails[letter]) {
        gradeDetails[letter].total++;
        if (isFemale) gradeDetails[letter].female++;
      }
    });

    Object.keys(gradeDetails).forEach(k => {
      const key = k as 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
      const pct = total > 0 ? ((gradeDetails[key].total / total) * 100).toFixed(1) : '0';
      gradeDetails[key].percent = `${pct}%`;
    });

    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';
    const failRate = total > 0 ? ((failed / total) * 100).toFixed(1) : '0';

    return {
      total,
      femaleTotal,
      passed,
      passedFemale,
      passRate: `${passRate}%`,
      failed,
      failedFemale,
      failRate: `${failRate}%`,
      classAverage: currentSummary.classAverage || 0,
      gradeDetails,
    };
  }, [currentSummary]);

  // 2. Slow Learners (សិស្សរៀនយឺត) & Remediation Tracker
  const slowLearnersData = useMemo(() => {
    // Current period slow learners: failed or average < 5.0 or grade E/F
    const currentSlowList: {
      student: Student;
      average: number;
      classification: { letter: string; label: string };
      weakSubjects: string[];
      rank: number;
    }[] = [];

    currentSummary.students.forEach(item => {
      const isSlow = !item.passed || item.average < 5.0 || item.classification.letter === 'E' || item.classification.letter === 'F';
      if (isSlow) {
        // Find weak subjects (< 5.0)
        const weak: string[] = [];
        const g = item.grade;
        if (g) {
          if (Number(g.khmer || 0) < 5.0) weak.push('ភាសាខ្មែរ');
          if (Number(g.math || 0) < 5.0) weak.push('គណិតវិទ្យា');
          if (Number(g.science || 0) < 5.0) weak.push('វិទ្យាសាស្ត្រ');
          if (Number(g.social || 0) < 5.0) weak.push('សិក្សាសង្គម');
        }

        // Check active sub subjects
        activeSubSubjects.forEach(subId => {
          const val = subScoresState[selectedGradePeriod]?.[item.student.id]?.[subId] !== undefined
            ? subScoresState[selectedGradePeriod][item.student.id][subId]
            : (g?.subScores?.[subId] !== undefined ? g.subScores[subId] : 0);
          if (val > 0 && val < 5.0) {
            const def = allDefs.find(s => s.id === subId);
            if (def && !weak.includes(def.name)) {
              weak.push(def.name);
            }
          }
        });

        currentSlowList.push({
          student: item.student,
          average: item.average,
          classification: item.classification,
          weakSubjects: weak.length > 0 ? weak : ['គ្រប់មុខវិជ្ជាគោល'],
          rank: item.rank,
        });
      }
    });

    // Recovered Students: were slow in previous period, but passed in this period!
    const recoveredList: {
      student: Student;
      prevAverage: number;
      currAverage: number;
      improvement: number;
      currGrade: string;
    }[] = [];

    if (prevSummary) {
      prevSummary.students.forEach(prevItem => {
        const wasSlowInPrev = !prevItem.passed || prevItem.average < 5.0 || prevItem.classification.letter === 'E' || prevItem.classification.letter === 'F';
        if (wasSlowInPrev) {
          // Check performance in current period
          const currItem = currentSummary.students.find(c => c.student.id === prevItem.student.id);
          if (currItem && currItem.passed && currItem.average >= 5.0 && (currItem.classification.letter === 'A' || currItem.classification.letter === 'B' || currItem.classification.letter === 'C' || currItem.classification.letter === 'D')) {
            recoveredList.push({
              student: currItem.student,
              prevAverage: prevItem.average,
              currAverage: currItem.average,
              improvement: Number((currItem.average - prevItem.average).toFixed(2)),
              currGrade: currItem.classification.letter,
            });
          }
        }
      });
    }

    const femaleSlow = currentSlowList.filter(s => s.student.gender === 'ស្រី').length;

    return {
      slowList: currentSlowList,
      totalSlow: currentSlowList.length,
      femaleSlow,
      slowPercentage: currentSummary.totalStudents > 0 ? ((currentSlowList.length / currentSummary.totalStudents) * 100).toFixed(1) : '0',
      recoveredList,
    };
  }, [currentSummary, prevSummary, activeSubSubjects, allDefs, subScoresState, selectedGradePeriod]);

  // 3. Monthly Comparison Data across all periods
  const monthlyComparisonData = useMemo(() => {
    return CHRONOLOGICAL_PERIOD_KEYS.map((pKey, pIdx) => {
      const pInfo = GRADE_PERIODS.find(p => p.key === pKey) || { key: pKey, label: pKey, shortLabel: pKey };
      const periodSumm = calculateSinglePeriodSummary(
        students,
        grades,
        pKey,
        gradeThresholds,
        activeSubSubjects,
        subScoresState,
        periodSubSubjectsMap
      );

      // Check if period has scores filled
      const hasScores = periodSumm.students.some(s => s.average > 0 || (s.total && s.total > 0));

      // Count slow learners
      const slowCount = periodSumm.students.filter(s => !s.passed || s.average < 5.0 || s.classification.letter === 'E' || s.classification.letter === 'F').length;
      const slowFemale = periodSumm.students.filter(s => (!s.passed || s.average < 5.0 || s.classification.letter === 'E' || s.classification.letter === 'F') && s.student.gender === 'ស្រី').length;

      let passedFemale = 0;
      let failedFemale = 0;
      periodSumm.students.forEach(s => {
        if (s.student.gender === 'ស្រី') {
          if (s.passed) passedFemale++;
          else failedFemale++;
        }
      });

      // Grade counts
      const counts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      periodSumm.students.forEach(s => {
        const l = s.classification.letter as 'A'|'B'|'C'|'D'|'E'|'F';
        if (counts[l] !== undefined) counts[l]++;
      });

      // Trend compared to previous period
      let trend: 'up' | 'down' | 'same' | 'none' = 'none';
      if (pIdx > 0 && hasScores) {
        const prevKey = CHRONOLOGICAL_PERIOD_KEYS[pIdx - 1];
        const prevPeriodSumm = calculateSinglePeriodSummary(students, grades, prevKey, gradeThresholds, activeSubSubjects, subScoresState, periodSubSubjectsMap);
        if (prevPeriodSumm.students.some(s => s.average > 0)) {
          if (periodSumm.classAverage > prevPeriodSumm.classAverage + 0.05) trend = 'up';
          else if (periodSumm.classAverage < prevPeriodSumm.classAverage - 0.05) trend = 'down';
          else trend = 'same';
        }
      }

      return {
        key: pKey,
        label: pInfo.label,
        shortLabel: pInfo.shortLabel || pInfo.label,
        isExam: (pInfo as any).isExam || pKey.includes('exam'),
        total: periodSumm.totalStudents,
        femaleTotal: periodSumm.femaleStudents,
        hasScores,
        classAverage: periodSumm.classAverage,
        passed: periodSumm.passedCount,
        passedFemale,
        passRate: periodSumm.totalStudents > 0 ? ((periodSumm.passedCount / periodSumm.totalStudents) * 100).toFixed(1) : '0',
        failed: periodSumm.failedCount,
        failedFemale,
        failRate: periodSumm.totalStudents > 0 ? ((periodSumm.failedCount / periodSumm.totalStudents) * 100).toFixed(1) : '0',
        slowCount,
        slowFemale,
        counts,
        trend,
        isCurrent: pKey === selectedGradePeriod,
      };
    });
  }, [students, grades, gradeThresholds, activeSubSubjects, subScoresState, selectedGradePeriod]);

  // 4. In-depth Learning Analysis
  const learningAnalysisData = useMemo(() => {
    // Calculate sub-subjects ranking and stats
    const subSubjectStats = activeSubSubjects.map(subId => {
      const def = allDefs.find(s => s.id === subId);
      let totalScore = 0;
      let count = 0;
      let countBelow5 = 0;
      const counts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

      currentSummary.students.forEach(item => {
        const studentId = item.student.id;
        const periodGrades = grades[selectedGradePeriod] || {};
        const studentGrades = periodGrades[studentId] || {};
        const subScores = studentGrades.subScores || {};
        const val = subScoresState[selectedGradePeriod]?.[studentId]?.[subId] !== undefined
          ? subScoresState[selectedGradePeriod][studentId][subId]
          : (subScores[subId] !== undefined ? subScores[subId] : 0);

        totalScore += val;
        count++;
        if (val < 5.0) countBelow5++;
        const cls = getGradeClassification(val, gradeThresholds).letter as 'A'|'B'|'C'|'D'|'E'|'F';
        if (counts[cls] !== undefined) counts[cls]++;
      });

      const avg = count > 0 ? Number((totalScore / count).toFixed(2)) : 0;
      const cls = getGradeClassification(avg, gradeThresholds);

      return {
        id: subId,
        name: def?.name || subId,
        category: def?.category || 'other',
        average: avg,
        classification: cls,
        countBelow5,
        failRate: count > 0 ? ((countBelow5 / count) * 100).toFixed(1) : '0',
        counts,
      };
    }).sort((a, b) => b.average - a.average);

    // Top 3 strongest sub-subjects
    const topSubjects = subSubjectStats.slice(0, 3);
    // Weakest sub-subjects (< 6.0 or lowest)
    const weakSubjects = [...subSubjectStats].reverse().slice(0, 3);

    // Gender Performance comparison
    let femaleTotalScore = 0;
    let femaleCount = 0;
    let maleTotalScore = 0;
    let maleCount = 0;

    currentSummary.students.forEach(item => {
      if (item.student.gender === 'ស្រី') {
        femaleTotalScore += item.average;
        femaleCount++;
      } else {
        maleTotalScore += item.average;
        maleCount++;
      }
    });

    const femaleAvg = femaleCount > 0 ? (femaleTotalScore / femaleCount).toFixed(2) : '0.00';
    const maleAvg = maleCount > 0 ? (maleTotalScore / maleCount).toFixed(2) : '0.00';

    return {
      subSubjectStats,
      topSubjects,
      weakSubjects,
      genderStats: {
        femaleCount,
        femaleAvg,
        femalePassed: summaryStats.passedFemale,
        femalePassRate: femaleCount > 0 ? ((summaryStats.passedFemale / femaleCount) * 100).toFixed(1) : '0',
        maleCount,
        maleAvg,
        malePassed: summaryStats.passed - summaryStats.passedFemale,
        malePassRate: maleCount > 0 ? (((summaryStats.passed - summaryStats.passedFemale) / maleCount) * 100).toFixed(1) : '0',
      }
    };
  }, [activeSubSubjects, allDefs, currentSummary, grades, selectedGradePeriod, subScoresState, gradeThresholds, summaryStats]);

  return (
    <div className="mt-8 border-t-2 border-slate-200 pt-6 px-4 pb-6 bg-slate-50/80 rounded-b-[32px] space-y-6">
      {/* Header with Period Indicator & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-900 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <span>សង្ខេបនិន្នន័យ និងវិភាគលើការសិក្សារបស់សិស្ស</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-200">
                  {currentPeriodInfo.label}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                ស្ថិតិលទ្ធផលសិស្ស សិស្សរៀនយឺត ការតាមដានការរីកចម្រើន និងការវិភាគគរុកោសល្យ
              </p>
            </div>
          </div>
        </div>

        {/* 4 Main Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-purple-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>១. សង្ខេបនិន្នន័យ</span>
          </button>

          <button
            onClick={() => setActiveTab('slow_learners')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer relative ${
              activeTab === 'slow_learners'
                ? 'bg-purple-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>២. សិស្សរៀនយឺត (ត្រូវជួយ)</span>
            {slowLearnersData.totalSlow > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'slow_learners' ? 'bg-amber-400 text-slate-950' : 'bg-rose-500 text-white'
              }`}>
                {slowLearnersData.totalSlow}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('monthly_comparison')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'monthly_comparison'
                ? 'bg-purple-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>៣. ប្រៀបធៀបតាមខែ</span>
          </button>

          <button
            onClick={() => setActiveTab('learning_analysis')}
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'learning_analysis'
                ? 'bg-purple-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>៤. វិភាគលើការសិក្សា</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: សង្ខេបនិន្នន័យ សិស្សជាប់/ធ្លាក់ និង និទ្ទេស A B C D E F */}
      {/* ========================================================================= */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Students Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">សិស្សសរុបប្រឡង/វាយតម្លៃ</span>
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{summaryStats.total}</span>
                <span className="text-xs font-bold text-slate-600">នាក់ (ស្រី: <span className="text-pink-600 font-extrabold">{summaryStats.femaleTotal}</span> នាក់)</span>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-700" />
                <span>ដំណាក់កាល៖ {currentPeriodInfo.label}</span>
              </div>
            </div>

            {/* Passed Card */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">សិស្សជាប់ (Passed)</span>
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-emerald-700">{summaryStats.passed}</span>
                  <span className="text-xs font-bold text-slate-600">នាក់ (ស្រី: <span className="text-pink-600 font-extrabold">{summaryStats.passedFemale}</span>)</span>
                </div>
                <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  {summaryStats.passRate}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: summaryStats.passRate }}></div>
              </div>
            </div>

            {/* Failed Card */}
            <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800">សិស្សធ្លាក់ (Failed)</span>
                <div className="p-2 bg-rose-100 text-rose-800 rounded-xl">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-rose-600">{summaryStats.failed}</span>
                  <span className="text-xs font-bold text-slate-600">នាក់ (ស្រី: <span className="text-pink-600 font-extrabold">{summaryStats.failedFemale}</span>)</span>
                </div>
                <span className="text-xs font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                  {summaryStats.failRate}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: summaryStats.failRate }}></div>
              </div>
            </div>

            {/* Class Average Card */}
            <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900">មធ្យមភាគរួមថ្នាក់</span>
                <div className="p-2 bg-purple-100 text-purple-800 rounded-xl">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-purple-950">{summaryStats.classAverage.toFixed(2)}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  summaryStats.classAverage >= gradeThresholds.A ? 'bg-emerald-100 text-emerald-800' :
                  summaryStats.classAverage >= gradeThresholds.B ? 'bg-blue-100 text-blue-800' :
                  summaryStats.classAverage >= gradeThresholds.C ? 'bg-amber-100 text-amber-800' :
                  summaryStats.classAverage >= gradeThresholds.D ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  និទ្ទេស {getGradeClassification(summaryStats.classAverage, gradeThresholds).letter}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">
                កម្រិតជាប់មធ្យម៖ ≥ {gradeThresholds.D.toFixed(2)} ពិន្ទុ
              </div>
            </div>
          </div>

          {/* Grade Distribution Chart & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-purple-700" />
                <span>ដ្យាក្រាមនិទ្ទេសរួម</span>
              </h4>
              <div className="h-[240px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'A', count: summaryStats.gradeDetails.A.total, color: '#059669' },
                      { name: 'B', count: summaryStats.gradeDetails.B.total, color: '#2563eb' },
                      { name: 'C', count: summaryStats.gradeDetails.C.total, color: '#d97706' },
                      { name: 'D', count: summaryStats.gradeDetails.D.total, color: '#ea580c' },
                      { name: 'E', count: summaryStats.gradeDetails.E.total, color: '#ca8a04' },
                      { name: 'F', count: summaryStats.gradeDetails.F.total, color: '#e11d48' },
                    ]}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 11, fontWeight: 800, fill: '#334155' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border border-slate-200 shadow-lg rounded-lg text-[11px]">
                              <span className="font-black text-slate-900">និទ្ទេស {payload[0].payload.name}៖ </span>
                              <span className="font-black" style={{ color: payload[0].payload.color }}>{payload[0].value} នាក់</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={24}>
                      {[
                        { name: 'A', count: summaryStats.gradeDetails.A.total, color: '#059669' },
                        { name: 'B', count: summaryStats.gradeDetails.B.total, color: '#2563eb' },
                        { name: 'C', count: summaryStats.gradeDetails.C.total, color: '#d97706' },
                        { name: 'D', count: summaryStats.gradeDetails.D.total, color: '#ea580c' },
                        { name: 'E', count: summaryStats.gradeDetails.E.total, color: '#ca8a04' },
                        { name: 'F', count: summaryStats.gradeDetails.F.total, color: '#e11d48' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-700" />
                  <span>ការបែងចែកនិទ្ទេសរួម A, B, C, D, E, F (Grade Distribution Breakdown)</span>
                </h4>
                <span className="text-xs text-slate-500 font-bold">
                  សរុប {summaryStats.total} នាក់
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Grade A */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                    និទ្ទេស A
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800">
                    ≥ {gradeThresholds.A.toFixed(2)}
                  </span>
                </div>
                <div className="text-center my-1">
                  <span className="text-2xl font-black text-emerald-900">
                    {summaryStats.gradeDetails.A.total}
                  </span>
                  <span className="text-xs font-bold text-slate-600"> នាក់</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-950 flex items-center justify-between border-t border-emerald-200/60 pt-1.5">
                  <span>ស្រី៖ <span className="text-pink-600 font-extrabold">{summaryStats.gradeDetails.A.female}</span> នាក់</span>
                  <span className="font-black">{summaryStats.gradeDetails.A.percent}</span>
                </div>
              </div>

              {/* Grade B */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-blue-600 text-white font-black text-xs">
                    និទ្ទេស B
                  </span>
                  <span className="text-[10px] font-bold text-blue-800">
                    {gradeThresholds.B.toFixed(2)} - {(gradeThresholds.A - 0.01).toFixed(2)}
                  </span>
                </div>
                <div className="text-center my-1">
                  <span className="text-2xl font-black text-blue-900">
                    {summaryStats.gradeDetails.B.total}
                  </span>
                  <span className="text-xs font-bold text-slate-600"> នាក់</span>
                </div>
                <div className="text-[11px] font-bold text-blue-950 flex items-center justify-between border-t border-blue-200/60 pt-1.5">
                  <span>ស្រី៖ <span className="text-pink-600 font-extrabold">{summaryStats.gradeDetails.B.female}</span> នាក់</span>
                  <span className="font-black">{summaryStats.gradeDetails.B.percent}</span>
                </div>
              </div>

              {/* Grade C */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-amber-600 text-white font-black text-xs">
                    និទ្ទេស C
                  </span>
                  <span className="text-[10px] font-bold text-amber-800">
                    {gradeThresholds.C.toFixed(2)} - {(gradeThresholds.B - 0.01).toFixed(2)}
                  </span>
                </div>
                <div className="text-center my-1">
                  <span className="text-2xl font-black text-amber-900">
                    {summaryStats.gradeDetails.C.total}
                  </span>
                  <span className="text-xs font-bold text-slate-600"> នាក់</span>
                </div>
                <div className="text-[11px] font-bold text-amber-950 flex items-center justify-between border-t border-amber-200/60 pt-1.5">
                  <span>ស្រី៖ <span className="text-pink-600 font-extrabold">{summaryStats.gradeDetails.C.female}</span> នាក់</span>
                  <span className="font-black">{summaryStats.gradeDetails.C.percent}</span>
                </div>
              </div>

              {/* Grade D */}
              <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-orange-600 text-white font-black text-xs">
                    និទ្ទេស D
                  </span>
                  <span className="text-[10px] font-bold text-orange-800">
                    {gradeThresholds.D.toFixed(2)} - {(gradeThresholds.C - 0.01).toFixed(2)}
                  </span>
                </div>
                <div className="text-center my-1">
                  <span className="text-2xl font-black text-orange-900">
                    {summaryStats.gradeDetails.D.total}
                  </span>
                  <span className="text-xs font-bold text-slate-600"> នាក់</span>
                </div>
                <div className="text-[11px] font-bold text-orange-950 flex items-center justify-between border-t border-orange-200/60 pt-1.5">
                  <span>ស្រី៖ <span className="text-pink-600 font-extrabold">{summaryStats.gradeDetails.D.female}</span> នាក់</span>
                  <span className="font-black">{summaryStats.gradeDetails.D.percent}</span>
                </div>
              </div>

              {/* Grade E */}
              <div className="p-3.5 rounded-2xl bg-yellow-50/80 border border-yellow-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-yellow-600 text-white font-black text-xs">
                    និទ្ទេស E
                  </span>
                  <span className="text-[10px] font-bold text-yellow-800">
                    {gradeThresholds.E.toFixed(2)} - {(gradeThresholds.D - 0.01).toFixed(2)}
                  </span>
                </div>
                <div className="text-center my-1">
                  <span className="text-2xl font-black text-yellow-900">
                    {summaryStats.gradeDetails.E.total}
                  </span>
                  <span className="text-xs font-bold text-slate-600"> នាក់</span>
                </div>
                <div className="text-[11px] font-bold text-yellow-950 flex items-center justify-between border-t border-yellow-200/60 pt-1.5">
                  <span>ស្រី៖ <span className="text-pink-600 font-extrabold">{summaryStats.gradeDetails.E.female}</span> នាក់</span>
                  <span className="font-black">{summaryStats.gradeDetails.E.percent}</span>
                </div>
              </div>

              {/* Grade F */}
              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-rose-600 text-white font-black text-xs">
                    និទ្ទេស F
                  </span>
                  <span className="text-[10px] font-bold text-rose-800">
                    &lt; {gradeThresholds.E.toFixed(2)}
                  </span>
                </div>
                <div className="text-center my-1">
                  <span className="text-2xl font-black text-rose-900">
                    {summaryStats.gradeDetails.F.total}
                  </span>
                  <span className="text-xs font-bold text-slate-600"> នាក់</span>
                </div>
                <div className="text-[11px] font-bold text-rose-950 flex items-center justify-between border-t border-rose-200/60 pt-1.5">
                  <span>ស្រី៖ <span className="text-pink-600 font-extrabold">{summaryStats.gradeDetails.F.female}</span> នាក់</span>
                  <span className="font-black">{summaryStats.gradeDetails.F.percent}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* ========================================================================= */}
      {/* TAB 2: ចំនួនត្រូវជួយ (សិស្សរៀនយឺតក្នុងខែ) & ការតាមដានការរីកចម្រើន */}
      {/* ========================================================================= */}
      {activeTab === 'slow_learners' && (
        <div className="space-y-6">
          {/* Slow Learners Summary Header */}
          <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-2xl">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-amber-950 text-sm">
                  បញ្ជីសិស្សរៀនយឺតត្រូវជួយបំប៉នប្រចាំខែ (Students Needing Remediation)
                </h4>
                <p className="text-xs text-amber-800 font-medium">
                  សិស្សដែលមានមធ្យមភាគក្រោម ៥.០០ ឬនិទ្ទេស E, F ដែលត្រូវទទួលបានការបង្រៀនបន្ថែម
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="bg-white px-3.5 py-1.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-950 shadow-2xs">
                សរុបត្រូវជួយ៖ <span className="font-black text-rose-600 text-sm">{slowLearnersData.totalSlow}</span> នាក់ (ស្រី: <span className="text-pink-600 font-black">{slowLearnersData.femaleSlow}</span> នាក់)
              </div>
            </div>
          </div>

          {/* Current Month Slow Learners List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>រាយនាមសិស្សរៀនយឺតក្នុងខែ {currentPeriodInfo.label} ({slowLearnersData.totalSlow} នាក់)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-bold">
                ស្មើនឹង {slowLearnersData.slowPercentage}% នៃសិស្សទាំងអស់
              </span>
            </div>

            {slowLearnersData.slowList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 font-bold text-slate-800 text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3 text-center w-12">ល.រ</th>
                      <th className="p-3 min-w-[140px]">គោត្តនាម-នាម</th>
                      <th className="p-3 text-center w-14">ភេទ</th>
                      <th className="p-3 text-center w-20">មធ្យមភាគ</th>
                      <th className="p-3 text-center w-20">និទ្ទេស</th>
                      <th className="p-3 min-w-[200px]">មុខវិជ្ជា/សមត្ថភាពដែលខ្សោយ (ត្រូវជួយ)</th>
                      <th className="p-3 text-center w-28">ស្ថានភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {slowLearnersData.slowList.map((item, idx) => {
                      const isFemale = item.student.gender === 'ស្រី';
                      return (
                        <tr key={item.student.id} className="hover:bg-amber-50/40 transition">
                          <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-extrabold text-slate-900">
                            <span className={isFemale ? 'text-pink-900' : 'text-slate-900'}>
                              {item.student.name}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold">
                            <span className={isFemale ? 'text-pink-600' : 'text-blue-600'}>
                              {item.student.gender}
                            </span>
                          </td>
                          <td className="p-3 text-center font-black text-rose-600 bg-rose-50/50">
                            {item.average.toFixed(2)}
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded font-black text-[11px] bg-rose-100 text-rose-800 border border-rose-200">
                              និទ្ទេស {item.classification.letter}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {item.weakSubjects.map((subj, sIdx) => (
                                <span key={sIdx} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                  {subj}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
                              <span>ត្រូវការជួយបំប៉ន</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center bg-white space-y-2">
                <div className="inline-flex p-3 bg-emerald-100 text-emerald-800 rounded-full">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="font-extrabold text-slate-900 text-sm">អបអរសាទរ! គ្មានសិស្សរៀនយឺតក្នុងខែនេះទេ</h5>
                <p className="text-xs text-slate-500">សិស្សទាំងអស់ទទួលបានមធ្យមភាគជាប់ (≥ ៥.០០) រួចរាល់</p>
              </div>
            )}
          </div>

          {/* Recovered / Improved Students (បើជួយបានលែងធ្លាក់ខែបន្ទាប់ នឹងមិនបង្ហាញឈ្មោះក្នុងបញ្ជីរៀនយឺតទេ) */}
          <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/90 to-blue-50/90 p-5 rounded-2xl border border-emerald-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500 text-white rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-emerald-950 text-sm">
                    🎉 សិស្សមានការវិវត្តរីកចម្រើនល្អ (បានជួយរួច លែងធ្លាក់ / Recovered After Remediation)
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    សិស្សដែលធ្លាប់រៀនយឺតក្នុងខែមុន ហើយខែនេះបានពិន្ទុជាប់ ឈ្មោះរបស់គាត់លែងបង្ហាញក្នុងបញ្ជីរៀនយឺតទៀតហើយ
                  </p>
                </div>
              </div>
              <span className="bg-white px-3 py-1 rounded-xl text-xs font-black text-emerald-800 border border-emerald-200 shadow-2xs">
                ចំនួន៖ {slowLearnersData.recoveredList.length} នាក់
              </span>
            </div>

            {slowLearnersData.recoveredList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {slowLearnersData.recoveredList.map((rec, rIdx) => {
                  const isFemale = rec.student.gender === 'ស្រី';
                  return (
                    <div key={rIdx} className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`font-extrabold text-xs ${isFemale ? 'text-pink-900' : 'text-slate-900'}`}>
                          {rec.student.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                          និទ្ទេស {rec.currGrade} (ជាប់)
                        </span>
                      </div>
                      <div className="grid grid-cols-3 text-center text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-500 block font-bold">ខែមុន</span>
                          <span className="font-extrabold text-rose-600">{rec.prevAverage.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-bold">ខែនេះ</span>
                          <span className="font-extrabold text-emerald-600">{rec.currAverage.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-bold">កើនឡើង</span>
                          <span className="font-black text-emerald-700 flex items-center justify-center gap-0.5">
                            <ArrowUpRight className="w-3 h-3 text-emerald-600 stroke-[3]" />
                            <span>+{rec.improvement.toFixed(2)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-white/80 rounded-xl border border-emerald-200 text-center text-xs text-slate-600 font-medium">
                {previousPeriodKey
                  ? `មិនទាន់មានទិន្នន័យសិស្សវិវត្តពីខែមុន (${GRADE_PERIODS.find(p => p.key === previousPeriodKey)?.label || previousPeriodKey}) មកខែនេះទេ`
                  : 'នេះជាខែដំបូងក្នុងឆ្នាំសិក្សា មិនទាន់មានទិន្នន័យប្រៀបធៀបពីខែមុន'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ការប្រៀបធៀបតាមខែ និងការវិវត្ត (Monthly Trends & Growth) */}
      {/* ========================================================================= */}
      {activeTab === 'monthly_comparison' && (
        <div className="space-y-6">
          {/* Performance Trend Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>ដ្យាក្រាមបង្ហាញពីនិន្នន័យមធ្យមភាគរួមថ្នាក់ (Class Performance Trend Chart)</span>
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  តាមដានការឡើងចុះនៃលទ្ធផលមធ្យមភាគសិស្សសរុបក្នុងថ្នាក់តាមបណ្តាខែនីមួយៗ
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-600">មធ្យមភាគថ្នាក់</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-600">អត្រាធ្លាក់ (%)</span>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyComparisonData.filter(d => d.hasScores)}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="shortLabel" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                    domain={[0, 10]}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/95 backdrop-blur-sm p-3 border border-slate-200 shadow-xl rounded-xl">
                            <p className="font-black text-slate-900 text-xs mb-2 border-b border-slate-100 pb-1">{label}</p>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[10px] font-bold text-slate-500">មធ្យមភាគថ្នាក់៖</span>
                                <span className="text-[11px] font-black text-indigo-600">{Number(payload[0].value).toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[10px] font-bold text-slate-500">អត្រាធ្លាក់៖</span>
                                <span className="text-[11px] font-black text-rose-600">{payload[1].value}%</span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[10px] font-bold text-slate-500">សិស្សជាប់៖</span>
                                <span className="text-[11px] font-black text-emerald-600">{payload[0].payload.passed} នាក់</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="classAverage" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAvg)" 
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="failRate" 
                    stroke="#f43f5e" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorFail)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-indigo-50/90 border border-indigo-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-2xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-indigo-950 text-sm">
                  តារាងប្រៀបធៀបលទ្ធផលសិក្សាតាមខែនីមួយៗ (Monthly Performance Comparison)
                </h4>
                <p className="text-xs text-indigo-800 font-medium">
                  តាមដានការប្រែប្រួលនិទ្ទេស A, B, C, D, E, F អត្រាជាប់/ធ្លាក់ និងចំនួនសិស្សរៀនយឺតតាមបណ្តាខែ
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 font-bold text-slate-800 text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3 text-center w-12">ល.រ</th>
                  <th className="p-3 min-w-[120px]">ខែ / ដំណាក់កាល</th>
                  <th className="p-3 text-center w-18">មធ្យមភាគថ្នាក់</th>
                  <th className="p-3 text-center w-20 bg-emerald-50 text-emerald-900 border-l border-slate-200">ជាប់ (សរុប/ស្រី)</th>
                  <th className="p-3 text-center w-20 bg-rose-50 text-rose-900 border-l border-slate-200">ធ្លាក់ (សរុប/ស្រី)</th>
                  <th className="p-3 text-center w-22 bg-amber-50 text-amber-900 border-l border-slate-200">សិស្សរៀនយឺត</th>
                  <th className="p-3 text-center w-14 border-l border-slate-200 bg-emerald-50 text-emerald-900">A</th>
                  <th className="p-3 text-center w-14 bg-blue-50 text-blue-900 border-l border-slate-200">B</th>
                  <th className="p-3 text-center w-14 bg-amber-50 text-amber-900 border-l border-slate-200">C</th>
                  <th className="p-3 text-center w-14 bg-orange-50 text-orange-900 border-l border-slate-200">D</th>
                  <th className="p-3 text-center w-14 bg-yellow-50 text-yellow-900 border-l border-slate-200">E</th>
                  <th className="p-3 text-center w-14 bg-rose-50 text-rose-900 border-l border-slate-200">F</th>
                  <th className="p-3 text-center w-20 border-l border-slate-200">និន្នាការ</th>
                  <th className="p-3 text-center w-18 border-l border-slate-200">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyComparisonData.map((m, idx) => {
                  return (
                    <tr
                      key={m.key}
                      className={`transition hover:bg-purple-50/40 ${
                        m.isCurrent ? 'bg-purple-50/70 font-extrabold ring-1 ring-purple-300 inset-0' : ''
                      }`}
                    >
                      <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{m.shortLabel}</span>
                          {m.isCurrent && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-purple-900 text-white">
                              មើលបច្ចុប្បន្ន
                            </span>
                          )}
                          {m.isExam && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-200 text-amber-950">
                              ប្រឡង
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center font-black text-purple-950 bg-purple-50/30">
                        {m.hasScores ? m.classAverage.toFixed(2) : '-'}
                      </td>
                      <td className="p-3 text-center font-bold text-emerald-800 bg-emerald-50/30 border-l border-slate-100">
                        {m.hasScores ? (
                          <span>
                            {m.passed} / <span className="text-pink-600">{m.passedFemale}</span> ({m.passRate}%)
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-3 text-center font-bold text-rose-700 bg-rose-50/30 border-l border-slate-100">
                        {m.hasScores ? (
                          <span>
                            {m.failed} / <span className="text-pink-600">{m.failedFemale}</span> ({m.failRate}%)
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-3 text-center font-black text-amber-900 bg-amber-50/30 border-l border-slate-100">
                        {m.hasScores ? (
                          <span>
                            {m.slowCount} <span className="text-slate-500 text-[10px] font-normal">(ស្រី {m.slowFemale})</span>
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-3 text-center font-bold text-emerald-700 bg-emerald-50/20 border-l border-slate-100">{m.hasScores ? m.counts.A : '-'}</td>
                      <td className="p-3 text-center font-bold text-blue-700 bg-blue-50/20 border-l border-slate-100">{m.hasScores ? m.counts.B : '-'}</td>
                      <td className="p-3 text-center font-bold text-amber-700 bg-amber-50/20 border-l border-slate-100">{m.hasScores ? m.counts.C : '-'}</td>
                      <td className="p-3 text-center font-bold text-orange-700 bg-orange-50/20 border-l border-slate-100">{m.hasScores ? m.counts.D : '-'}</td>
                      <td className="p-3 text-center font-bold text-yellow-700 bg-yellow-50/20 border-l border-slate-100">{m.hasScores ? m.counts.E : '-'}</td>
                      <td className="p-3 text-center font-bold text-rose-700 bg-rose-50/20 border-l border-slate-100">{m.hasScores ? m.counts.F : '-'}</td>
                      <td className="p-3 text-center border-l border-slate-100">
                        {m.trend === 'up' && (
                          <span className="inline-flex items-center gap-0.5 text-emerald-700 font-black text-[11px]">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>កើន</span>
                          </span>
                        )}
                        {m.trend === 'down' && (
                          <span className="inline-flex items-center gap-0.5 text-rose-600 font-black text-[11px]">
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span>ថយ</span>
                          </span>
                        )}
                        {m.trend === 'same' && (
                          <span className="inline-flex items-center gap-0.5 text-slate-500 font-bold text-[11px]">
                            <Minus className="w-3.5 h-3.5" />
                            <span>ថេរ</span>
                          </span>
                        )}
                        {m.trend === 'none' && <span className="text-slate-400">-</span>}
                      </td>
                      <td className="p-3 text-center border-l border-slate-100">
                        <button
                          onClick={() => onSelectPeriod?.(m.key)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-purple-100 text-purple-900 transition cursor-pointer"
                        >
                          ជ្រើសរើស
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: វិភាគលើការសិក្សារបស់សិស្ស (In-Depth Learning Analysis) */}
      {/* ========================================================================= */}
      {activeTab === 'learning_analysis' && (
        <div className="space-y-6">
          {/* Top & Weak Subjects Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Performing Subjects */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-sm">មុខវិជ្ជា/សមត្ថភាពធ្វើបានល្អបំផុត</h4>
                  <p className="text-[11px] text-slate-500">មុខវិជ្ជាដែលមានមធ្យមភាគខ្ពស់ និងសិស្សយល់ដឹងច្បាស់</p>
                </div>
              </div>

              <div className="space-y-2">
                {learningAnalysisData.topSubjects.map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-800 text-sm">{s.average.toFixed(2)}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-200 text-emerald-900">
                        និទ្ទេស {s.classification.letter}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weakest Subjects Needing Support */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-amber-950 text-sm">មុខវិជ្ជា/សមត្ថភាពដែលជួបការលំបាក</h4>
                  <p className="text-[11px] text-slate-500">មុខវិជ្ជាដែលមានសិស្សពិន្ទុខ្សោយ ឬទាបជាងគេ</p>
                </div>
              </div>

              <div className="space-y-2">
                {learningAnalysisData.weakSubjects.map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-900 text-sm">{s.average.toFixed(2)}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        ខ្សោយ {s.countBelow5} នាក់ ({s.failRate}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gender Performance Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-700" />
              <span>ការវិភាគលទ្ធផលសិក្សាតាមយេនឌ័រ (Gender Performance Analysis)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-pink-50/70 border border-pink-200 space-y-2">
                <span className="font-black text-pink-900 text-xs block">👩 សិស្សស្រី ({learningAnalysisData.genderStats.femaleCount} នាក់)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 font-bold">មធ្យមភាគពិន្ទុ៖</span>
                  <span className="text-xl font-black text-pink-800">{learningAnalysisData.genderStats.femaleAvg}</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-600 font-bold">អត្រាជាប់៖</span>
                  <span className="font-black text-emerald-700">{learningAnalysisData.genderStats.femalePassed} នាក់ ({learningAnalysisData.genderStats.femalePassRate}%)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <span className="font-black text-blue-900 text-xs block">👦 សិស្សប្រុស ({learningAnalysisData.genderStats.maleCount} នាក់)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 font-bold">មធ្យមភាគពិន្ទុ៖</span>
                  <span className="text-xl font-black text-blue-800">{learningAnalysisData.genderStats.maleAvg}</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-600 font-bold">អត្រាជាប់៖</span>
                  <span className="font-black text-emerald-700">{learningAnalysisData.genderStats.malePassed} នាក់ ({learningAnalysisData.genderStats.malePassRate}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Subjects Detail Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200">
              <h5 className="font-black text-slate-900 text-xs">
                តារាងបូកសរុបលម្អិតតាមមុខវិជ្ជារង និងសមត្ថភាពទាំងអស់ ({activeSubSubjects.length} មុខ)
              </h5>
            </div>
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 font-bold text-slate-800 text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3 text-center w-12">ល.រ</th>
                  <th className="p-3">មុខវិជ្ជារង / សមត្ថភាព</th>
                  <th className="p-3 text-center w-24">ក្រុម</th>
                  <th className="p-3 text-center w-20">មធ្យមភាគ</th>
                  <th className="p-3 text-center w-14 bg-emerald-50 text-emerald-900 border-l border-slate-200">A</th>
                  <th className="p-3 text-center w-14 bg-blue-50 text-blue-900 border-l border-slate-200">B</th>
                  <th className="p-3 text-center w-14 bg-amber-50 text-amber-900 border-l border-slate-200">C</th>
                  <th className="p-3 text-center w-14 bg-orange-50 text-orange-900 border-l border-slate-200">D</th>
                  <th className="p-3 text-center w-14 bg-yellow-50 text-yellow-900 border-l border-slate-200">E</th>
                  <th className="p-3 text-center w-14 bg-rose-50 text-rose-900 border-l border-slate-200">F</th>
                  <th className="p-3 text-center w-24 border-l border-slate-200">និទ្ទេសរួម</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {learningAnalysisData.subSubjectStats.map((sub, sIdx) => {
                  const categoryLabel = sub.category === 'khmer' ? 'ភាសាខ្មែរ' : sub.category === 'math' ? 'គណិតវិទ្យា' : sub.category === 'science' ? 'វិទ្យាសាស្ត្រ' : sub.category === 'social' ? 'សិក្សាសង្គម' : 'ផ្សេងៗ';
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-2.5 text-center font-bold text-slate-500">{sIdx + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">{sub.name}</td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.category === 'khmer' ? 'bg-indigo-100 text-indigo-800' :
                          sub.category === 'math' ? 'bg-blue-100 text-blue-800' :
                          sub.category === 'science' ? 'bg-emerald-100 text-emerald-800' :
                          sub.category === 'social' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {categoryLabel}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-black text-slate-900 bg-slate-50/50">{sub.average.toFixed(2)}</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/30 border-l border-slate-100">{sub.counts.A}</td>
                      <td className="p-2.5 text-center font-bold text-blue-700 bg-blue-50/30 border-l border-slate-100">{sub.counts.B}</td>
                      <td className="p-2.5 text-center font-bold text-amber-700 bg-amber-50/30 border-l border-slate-100">{sub.counts.C}</td>
                      <td className="p-2.5 text-center font-bold text-orange-700 bg-orange-50/30 border-l border-slate-100">{sub.counts.D}</td>
                      <td className="p-2.5 text-center font-bold text-yellow-700 bg-yellow-50/30 border-l border-slate-100">{sub.counts.E}</td>
                      <td className="p-2.5 text-center font-bold text-rose-700 bg-rose-50/30 border-l border-slate-100">{sub.counts.F}</td>
                      <td className="p-2.5 text-center border-l border-slate-100">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold ${
                          sub.classification.letter === 'A' ? 'bg-emerald-100 text-emerald-800' :
                          sub.classification.letter === 'B' ? 'bg-blue-100 text-blue-800' :
                          sub.classification.letter === 'C' ? 'bg-amber-100 text-amber-800' :
                          sub.classification.letter === 'D' ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          និទ្ទេស {sub.classification.letter}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pedagogical Action Plan & Remediation Strategy */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-5 rounded-2xl border border-purple-200 shadow-2xs space-y-3">
            <h4 className="font-black text-purple-950 text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-purple-700" />
              <span>អនុសាសន៍គរុកោសល្យ និងផែនការសកម្មភាពជួយសិស្ស (Pedagogical Action Plan)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-purple-100 space-y-1.5">
                <span className="font-extrabold text-purple-900 block">១. វិធីសាស្ត្រជួយសិស្សរៀនយឺត</span>
                <p className="text-slate-600 leading-relaxed">
                  រៀបចំការបង្រៀនជាដៃគូ (Peer Tutoring) ដោយចាត់តាំងសិស្សពូកែជួយសិស្សរៀនយឺត និងផ្តល់លំហាត់ពង្រឹងសមត្ថភាពសាមញ្ញៗប្រចាំថ្ងៃ។
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-1.5">
                <span className="font-extrabold text-indigo-900 block">២. ពង្រឹងមុខវិជ្ជាខ្សោយរួម</span>
                <p className="text-slate-600 leading-relaxed">
                  បង្កើនម៉ោងអនុវត្តជាក់ស្តែង និងរៀបចំការតេស្តសាកល្បងខ្លីៗប្រចាំសប្តាហ៍លើមុខវិជ្ជាដែលមានអត្រាធ្លាក់ច្រើន។
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-blue-100 space-y-1.5">
                <span className="font-extrabold text-blue-900 block">៣. ទំនាក់ទំនងអាណាព្យាបាល</span>
                <p className="text-slate-600 leading-relaxed">
                  ផ្តល់សៀវភៅតាមដាន និងជូនដំណឹងដល់មាតាបិតាពីមុខវិជ្ជាខ្សោយរបស់សិស្ស ដើម្បីរួមគ្នាជួយជំរុញការរៀនបន្ថែមនៅផ្ទះ។
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
