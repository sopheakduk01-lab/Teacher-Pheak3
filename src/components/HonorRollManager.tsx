import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Calendar,
  Sparkles,
  Printer,
  Download,
  Upload,
  RefreshCw,
  Move,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Type,
  Palette,
  Save,
  RotateCcw,
  Sliders,
  Check,
  UserCheck,
  X,
  FileText,
  FileImage,
  Layers,
  Star,
  Users,
  Eye,
  SlidersHorizontal,
  Table as TableIcon,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  ChevronDown as DropdownIcon,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { TeacherProfile, Student, GradeDatabase } from '../types';
import {
  GRADE_PERIODS,
  GradePeriodKey,
  calculateSinglePeriodSummary,
  calculateSemesterSummary,
  calculateAnnualSummary,
  getGradeClassification,
} from '../utils/gradeManager';
import { toKhmerNum } from '../utils/khmerDate';
import {
  getActiveCustomFontFamily,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';
import {
  getSafeStudentAvatar,
  generateDefaultStudentAvatarSvg,
} from '../utils/studentAvatarHelper';
import {
  HONOR_ROLL_THEMES,
  HonorRollThemeId,
  resolveThemeForPeriod,
  getConsistentGradeDisplay,
  KhmerCornerOrnament,
  TopCenterCrownOrnament,
  BottomCenterOrnament,
  ThemeWatermarkSvg,
} from '../utils/honorRollThemePresets';
import {
  exportHonorRollPosterToWord,
  exportCertificateToWord,
  printHonorRollSinglePagePdf,
  printCertificateSinglePagePdf,
} from '../utils/honorRollWordExport';

export interface HonorStudent {
  rank: number; // 1, 2, 3, 4, 5
  studentId: number;
  studentCode?: string;
  name: string;
  gender: 'ប្រុស' | 'ស្រី';
  photo: string;
  score: number; // Average score
  totalScore?: number;
  khmer?: number;
  math?: number;
  science?: number;
  social?: number;
  gradeLetter?: string; // 'A', 'B', 'C', 'D', 'E'
  gradeLabel?: string;  // 'A (ល្អណាស់)', etc.
  mention?: string;     // 'ជ័យលាភីលេខ ១', etc.
  remarks?: string;     // 'សិស្សឆ្នើម', etc.
}

export interface LayoutOffsets {
  schoolInfo: { x: number; y: number; scale: number };
  kingdomHeader: { x: number; y: number; scale: number };
  mainTitle: { x: number; y: number; scale: number };
  studentsPodium: { x: number; y: number; scale: number };
  studentNames: { x: number; y: number; scale: number };
  signatures: { x: number; y: number; scale: number };
  overall: { x: number; y: number; scale: number };
}

export type BorderTheme =
  | 'royal_blue_gold'
  | 'khmer_gold_ornament'
  | 'moeys_classic'
  | 'modern_gold'
  | 'vintage_parchment'
  | 'minimal_clean';

interface HonorRollManagerProps {
  teacher: TeacherProfile;
  students: Student[];
  grades: GradeDatabase;
  currentYear?: string;
  onShowToast: (msg: string) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const HonorRollManager: React.FC<HonorRollManagerProps> = ({
  teacher,
  students,
  grades,
  currentYear,
  onShowToast,
  isModal = false,
  onClose,
}) => {
  const activeYear = currentYear || teacher.academicYear || '២០២៥-២០២៦';

  // Active View Tab: 'board' (Official Top 5 Honor Roll Poster), 'certificates' (Individual Certificates for all 5), 'table' (Summary Table)
  const [activeView, setActiveView] = useState<'board' | 'certificates' | 'table'>('board');
  const [selectedCertRank, setSelectedCertRank] = useState<number>(1);
  const [certViewMode, setCertViewMode] = useState<'all' | 'single'>('all');
  const [posterLayout, setPosterLayout] = useState<'pyramid' | 'row4'>('pyramid');
  
  // Period Selection: Month, Semester 1, Semester 2, Annual
  const [periodType, setPeriodType] = useState<'month' | 'semester1' | 'semester2' | 'annual'>('month');
  const [selectedMonthKey, setSelectedMonthKey] = useState<GradePeriodKey>('m02'); // Default February
  const [topCount, setTopCount] = useState<3 | 5 | 10>(5); // Default Top 5
  
  // Custom headers & school text
  const [departmentName, setDepartmentName] = useState<string>('មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកំពង់ឆ្នាំង');
  const [officeName, setOfficeName] = useState<string>('ការិយាល័យ អ.យ.ក ស្រុកកំពង់ត្រឡាច');
  const [schoolName, setSchoolName] = useState<string>(teacher.school || 'សាលាបឋមសិក្សា គំរូ');
  const [gradeClass, setGradeClass] = useState<string>(teacher.grade || 'ថ្នាក់ទី ៤');
  const [principalName, setPrincipalName] = useState<string>('ឈ្មោះនាយកសាលា');
  const [signDate, setSignDate] = useState<string>(() => {
    return `ថ្ងៃព្រហស្បតិ៍ ទី១២ ខែកុម្ភៈ ឆ្នាំ២០២៦`;
  });

  // Dynamic Theme & Frame Styling (Auto switches per Month, Semester, Annual, or manual override)
  const [themeMode, setThemeMode] = useState<HonorRollThemeId | 'auto'>('auto');
  const activeThemeId: HonorRollThemeId = themeMode === 'auto' ? resolveThemeForPeriod(periodType) : themeMode;
  const activeTheme = HONOR_ROLL_THEMES[activeThemeId] || HONOR_ROLL_THEMES.month_emerald;

  // Border & Appearance Theme
  const [borderStyle, setBorderStyle] = useState<'royal_double' | 'triple_gold' | 'heritage_phni' | 'refined_line'>('royal_double');
  const [borderWidth, setBorderWidth] = useState<number>(6); // 4, 6, 8, 10
  const [borderTheme, setBorderTheme] = useState<BorderTheme>('royal_blue_gold');
  const [bgOpacity, setBgOpacity] = useState<number>(100);
  const [selectedFont, setSelectedFont] = useState<string>(getActiveCustomFontFamily() || 'Kantumruy Pro');
  const [textColor, setTextColor] = useState<string>('#1e3a8a');

  // Pixel-Perfect Layout Controls
  const [selectedElement, setSelectedElement] = useState<keyof LayoutOffsets>('studentsPodium');
  const [stepSize, setStepSize] = useState<1 | 5 | 15>(5);
  const [offsets, setOffsets] = useState<LayoutOffsets>(() => {
    try {
      const saved = localStorage.getItem(`honor_roll_offsets_${activeYear}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      schoolInfo: { x: 0, y: 0, scale: 100 },
      kingdomHeader: { x: 0, y: 0, scale: 100 },
      mainTitle: { x: 0, y: 0, scale: 100 },
      studentsPodium: { x: 0, y: 0, scale: 100 },
      studentNames: { x: 0, y: 0, scale: 100 },
      signatures: { x: 0, y: 0, scale: 100 },
      overall: { x: 0, y: 0, scale: 100 },
    };
  });

  // Honor List State
  const [honorList, setHonorList] = useState<HonorStudent[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [targetStudentUploadIndex, setTargetStudentUploadIndex] = useState<number | null>(null);

  const printableRef = useRef<HTMLDivElement>(null);
  const certPrintableRef = useRef<HTMLDivElement>(null);
  const tablePrintableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Period label for titles
  const periodTitle = useMemo(() => {
    if (periodType === 'month') {
      const p = GRADE_PERIODS.find((item) => item.key === selectedMonthKey);
      return `តារាងកិត្តិយសប្រចាំ${p?.shortLabel || 'ខែកុម្ភៈ'}`;
    }
    if (periodType === 'semester1') {
      return `តារាងកិត្តិយសប្រចាំ ឆមាសទី១`;
    }
    if (periodType === 'semester2') {
      return `តារាងកិត្តិយសប្រចាំ ឆមាសទី២`;
    }
    return `តារាងកិត្តិយសប្រចាំឆ្នាំ`;
  }, [periodType, selectedMonthKey]);

  // Compute and auto-populate Top Students from Grade Database
  const autoRankStudents = () => {
    type CalculatedItem = {
      student: Student;
      avg: number;
      total: number;
      khmer?: number;
      math?: number;
      science?: number;
      social?: number;
      rank?: number;
    };

    let summaryList: CalculatedItem[] = [];

    if (periodType === 'month') {
      const res = calculateSinglePeriodSummary(students, grades, selectedMonthKey);
      summaryList = res.students.map((s) => ({
        student: s.student,
        avg: s.avg,
        total: s.total,
        khmer: s.khmer,
        math: s.math,
        science: s.science,
        social: s.social,
        rank: s.rank,
      }));
    } else if (periodType === 'semester1') {
      const res = calculateSemesterSummary(students, grades, 1);
      summaryList = res.students.map((s) => ({
        student: s.student,
        avg: s.semesterAvg,
        total: s.semesterAvg * 4,
        rank: s.rank,
      }));
    } else if (periodType === 'semester2') {
      const res = calculateSemesterSummary(students, grades, 2);
      summaryList = res.students.map((s) => ({
        student: s.student,
        avg: s.semesterAvg,
        total: s.semesterAvg * 4,
        rank: s.rank,
      }));
    } else {
      const res = calculateAnnualSummary(students, grades);
      summaryList = res.students.map((s) => ({
        student: s.student,
        avg: s.annualAvg,
        total: s.annualAvg * 4,
        rank: s.rank,
      }));
    }

    // Sort by average descending
    const sorted = [...summaryList].sort((a, b) => b.avg - a.avg);

    // Build honor students - always ensure exactly 5 students (Ranks 1 to 5)
    const initialList: HonorStudent[] = [];
    const count = Math.max(5, topCount);

    const fallbackPresets = [
      { name: 'ចាន់ ដាវី', gender: 'ស្រី' as const, score: 9.85 },
      { name: 'កែវ មករា', gender: 'ប្រុស' as const, score: 9.40 },
      { name: 'ចាន់ ផល្លា', gender: 'ស្រី' as const, score: 9.15 },
      { name: 'សេង កញ្ញាណា', gender: 'ស្រី' as const, score: 8.85 },
      { name: 'ស៊ន វិបុល', gender: 'ប្រុស' as const, score: 8.50 },
    ];

    for (let i = 0; i < count; i++) {
      const item = sorted[i];
      const rankNumber = i + 1;
      const mentionText =
        rankNumber === 1
          ? 'ជ័យលាភីលេខ ១'
          : rankNumber === 2
          ? 'ជ័យលាភីលេខ ២'
          : rankNumber === 3
          ? 'ជ័យលាភីលេខ ៣'
          : `ជ័យលាភីលេខ ${toKhmerNum(rankNumber)}`;

      if (item) {
        const gradeInfo = getGradeClassification(item.avg);
        const gender = item.student.gender || (i % 2 === 0 ? 'ស្រី' : 'ប្រុស');
        const safePhoto = getSafeStudentAvatar(item.student.avatar, gender, i);

        initialList.push({
          rank: rankNumber,
          studentId: item.student.id,
          studentCode: item.student.civilId || `ST-${String(item.student.id).padStart(3, '0')}`,
          name: item.student.name,
          gender: gender,
          photo: safePhoto,
          score: Number(item.avg.toFixed(2)),
          totalScore: Number(item.total.toFixed(2)),
          khmer: item.khmer,
          math: item.math,
          science: item.science,
          social: item.social,
          gradeLetter: gradeInfo.letter,
          gradeLabel: gradeInfo.label,
          mention: mentionText,
          remarks: gradeInfo.remarks || (item.avg >= 8.5 ? 'សិស្សឆ្នើម' : item.avg >= 7.5 ? 'ល្អប្រសើរ' : 'ល្អ'),
        });
      } else {
        // Fallback placeholder student for slots when classroom has fewer students
        const fallback = fallbackPresets[i % fallbackPresets.length];
        const mockScore = Number((fallback.score - (i >= 5 ? (i - 4) * 0.3 : 0)).toFixed(2));
        const gradeInfo = getGradeClassification(mockScore);
        const safePhoto = getSafeStudentAvatar(undefined, fallback.gender, i);

        initialList.push({
          rank: rankNumber,
          studentId: 9900 + i,
          studentCode: `ST-${String(9900 + i).padStart(3, '0')}`,
          name: fallback.name,
          gender: fallback.gender,
          photo: safePhoto,
          score: mockScore,
          totalScore: Number((mockScore * 4).toFixed(2)),
          khmer: Number((mockScore + 0.1).toFixed(1)),
          math: Number((mockScore - 0.1).toFixed(1)),
          science: mockScore,
          social: mockScore,
          gradeLetter: gradeInfo.letter,
          gradeLabel: gradeInfo.label,
          mention: mentionText,
          remarks: gradeInfo.remarks || 'សិស្សឆ្នើម',
        });
      }
    }

    setHonorList(initialList);
  };

  // Trigger auto rank when period or topCount changes
  useEffect(() => {
    autoRankStudents();
  }, [periodType, selectedMonthKey, topCount, students, grades]);

  // Pixel-Perfect Navigation handlers
  const moveElement = (dx: number, dy: number) => {
    setOffsets((prev) => ({
      ...prev,
      [selectedElement]: {
        ...prev[selectedElement],
        x: prev[selectedElement].x + dx * stepSize,
        y: prev[selectedElement].y + dy * stepSize,
      },
    }));
  };

  const setScale = (scaleVal: number) => {
    setOffsets((prev) => ({
      ...prev,
      [selectedElement]: {
        ...prev[selectedElement],
        scale: Math.max(50, Math.min(200, scaleVal)),
      },
    }));
  };

  const handleSaveLayout = () => {
    try {
      localStorage.setItem(`honor_roll_offsets_${activeYear}`, JSON.stringify(offsets));
      onShowToast('បានរក្សាទុកប្លង់តម្រឹម (Pixel-Perfect Layout) ដោយជោគជ័យ!');
    } catch {
      onShowToast('មិនអាចរក្សាទុកប្លង់បានទេ');
    }
  };

  const handleResetLayout = () => {
    const defaultOffsets: LayoutOffsets = {
      schoolInfo: { x: 0, y: 0, scale: 100 },
      kingdomHeader: { x: 0, y: 0, scale: 100 },
      mainTitle: { x: 0, y: 0, scale: 100 },
      studentsPodium: { x: 0, y: 0, scale: 100 },
      studentNames: { x: 0, y: 0, scale: 100 },
      signatures: { x: 0, y: 0, scale: 100 },
      overall: { x: 0, y: 0, scale: 100 },
    };
    setOffsets(defaultOffsets);
    localStorage.removeItem(`honor_roll_offsets_${activeYear}`);
    onShowToast('បានកំណត់ប្លង់ឡើងវិញ (Reset to Default)');
  };

  // Handle Photo Upload for a specific rank
  const handleTriggerUpload = (index: number) => {
    setTargetStudentUploadIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetStudentUploadIndex !== null) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setHonorList((prev) => {
          const next = [...prev];
          if (next[targetStudentUploadIndex]) {
            next[targetStudentUploadIndex] = {
              ...next[targetStudentUploadIndex],
              photo: base64,
            };
          }
          return next;
        });
        onShowToast(`បានប្តូររូបថតសិស្សជោគជ័យ!`);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Change Student for a rank position
  const handleChangeStudent = (index: number, studentId: number) => {
    const s = students.find((item) => item.id === studentId);
    if (!s) return;
    setHonorList((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          studentId: s.id,
          name: s.name,
          gender: s.gender,
          photo: getSafeStudentAvatar(s.avatar, s.gender, index),
        };
      }
      return next;
    });
  };

  // Quick preset avatar switcher
  const handleToggleGenderAvatar = (index: number) => {
    setHonorList((prev) => {
      const next = [...prev];
      const current = next[index];
      if (current) {
        const newGender = current.gender === 'ស្រី' ? 'ប្រុស' : 'ស្រី';
        next[index] = {
          ...current,
          gender: newGender,
          photo: generateDefaultStudentAvatarSvg(newGender, index),
        };
      }
      return next;
    });
    onShowToast('បានប្តូរទម្រង់រូបតំណាងសិស្ស!');
  };

  // Update Name manually
  const handleUpdateStudentName = (index: number, newName: string) => {
    setHonorList((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          name: newName,
        };
      }
      return next;
    });
  };

  // Update Score manually
  const handleUpdateStudentScore = (index: number, newScore: number) => {
    const validScore = Number(newScore) || 0;
    const gradeInfo = getGradeClassification(validScore);
    setHonorList((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          score: validScore,
          gradeLetter: gradeInfo.letter,
          gradeLabel: gradeInfo.label,
          remarks: gradeInfo.remarks,
        };
      }
      return next;
    });
  };

  // Export to Image (PNG)
  const handleExportImage = async () => {
    const targetElement = activeView === 'certificates' ? certPrintableRef.current : printableRef.current;
    if (!targetElement) return;
    setIsExporting(true);
    onShowToast('កំពុងបង្កើតរូបភាព (High Resolution PNG)...');

    try {
      const dataUrl = await toPng(targetElement, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });
      const link = document.createElement('a');
      const filename =
        activeView === 'certificates'
          ? `ប័ណ្ណសរសើរ_${honorList.find((s) => s.rank === selectedCertRank)?.name || 'សិស្ស'}_${periodTitle}.png`
          : `តារាងកិត្តិយស_${periodTitle}_${activeYear}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
      onShowToast('បានទាញយករូបភាពដោយជោគជ័យ!');
    } catch (err) {
      console.error('Export error:', err);
      onShowToast('មានបញ្ហាក្នុងការទាញយករូបភាព');
    } finally {
      setIsExporting(false);
    }
  };

  // Export to Microsoft Word (.doc) with strict 1-page formatting & ornate borders
  const handleExportWord = () => {
    try {
      const exportOptions = {
        periodTitle,
        activeYear,
        departmentName,
        officeName,
        schoolName,
        gradeClass,
        teacher,
        principalName,
        signDate,
        theme: activeTheme,
        selectedFont,
      };

      if (activeView === 'certificates') {
        const student = honorList.find((s) => s.rank === selectedCertRank) || honorList[0];
        exportCertificateToWord(student, exportOptions);
        onShowToast(`បានទាញយកប័ណ្ណសរសើរ ${student.name} ជាឯកសារ Word (.doc) ជោគជ័យ!`);
      } else {
        exportHonorRollPosterToWord(honorList, exportOptions);
        onShowToast(`បានទាញយកតារាងកិត្តិយស ${periodTitle} ជាឯកសារ Word (.doc) ជោគជ័យ!`);
      }
    } catch (err) {
      console.error('Word export error:', err);
      onShowToast('មានបញ្ហាក្នុងការទាញយកឯកសារ Word');
    }
  };

  // Print A4 (Board, Certificate, or Table) with guaranteed strictly 1-page PDF
  const handlePrint = () => {
    let targetElement: HTMLElement | null = null;
    let title = '';

    if (activeView === 'certificates') {
      targetElement = certPrintableRef.current;
      title = `ប័ណ្ណសរសើរ_${honorList.find((s) => s.rank === selectedCertRank)?.name || 'សិស្ស'}_${periodTitle}`;
    } else if (activeView === 'table') {
      targetElement = tablePrintableRef.current || printableRef.current;
      title = `តារាងសង្ខេបកិត្តិយស_${periodTitle}_${activeYear}`;
    } else {
      targetElement = printableRef.current;
      title = `តារាងកិត្តិយស_${periodTitle}_${activeYear}`;
    }

    if (!targetElement) {
      window.print();
      return;
    }

    if (activeView === 'certificates') {
      printCertificateSinglePagePdf(targetElement.innerHTML, title, selectedFont);
    } else {
      printHonorRollSinglePagePdf(targetElement.innerHTML, title, selectedFont);
    }
  };

  // Batch Print All 5 Certificates at Once
  const handleBatchPrintAllCertificates = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const certPagesHtml = honorList
      .map((student) => {
        const gradeInfo = getConsistentGradeDisplay(student.score, student.gradeLetter);
        return `
        <div class="cert-page">
          <div class="cert-border" style="border: 8px solid ${activeTheme.frameOuterBorder}; outline: 3px solid ${activeTheme.accentGoldHex}; outline-offset: -12px;">
            <!-- Corner Ornaments -->
            <div style="position: absolute; top: 4px; left: 4px; width: 60px; height: 60px; pointer-events: none;">
              <svg viewBox="0 0 120 120" fill="none" style="width:100%;height:100%;">
                <path d="M0 0 L60 0 C45 15 35 25 25 45 C15 35 15 45 0 60 Z" fill="${activeTheme.frameOuterBorder}" />
                <path d="M5 5 L45 5 C35 12 25 20 18 35 C12 25 12 35 5 45 Z" fill="${activeTheme.accentGoldHex}" />
                <circle cx="18" cy="18" r="5" fill="${activeTheme.accentGoldHex}" stroke="#ffffff" stroke-width="1"/>
              </svg>
            </div>
            <div style="position: absolute; top: 4px; right: 4px; width: 60px; height: 60px; transform: rotate(90deg); pointer-events: none;">
              <svg viewBox="0 0 120 120" fill="none" style="width:100%;height:100%;">
                <path d="M0 0 L60 0 C45 15 35 25 25 45 C15 35 15 45 0 60 Z" fill="${activeTheme.frameOuterBorder}" />
                <path d="M5 5 L45 5 C35 12 25 20 18 35 C12 25 12 35 5 45 Z" fill="${activeTheme.accentGoldHex}" />
                <circle cx="18" cy="18" r="5" fill="${activeTheme.accentGoldHex}" stroke="#ffffff" stroke-width="1"/>
              </svg>
            </div>
            <div style="position: absolute; bottom: 4px; left: 4px; width: 60px; height: 60px; transform: rotate(-90deg); pointer-events: none;">
              <svg viewBox="0 0 120 120" fill="none" style="width:100%;height:100%;">
                <path d="M0 0 L60 0 C45 15 35 25 25 45 C15 35 15 45 0 60 Z" fill="${activeTheme.frameOuterBorder}" />
                <path d="M5 5 L45 5 C35 12 25 20 18 35 C12 25 12 35 5 45 Z" fill="${activeTheme.accentGoldHex}" />
                <circle cx="18" cy="18" r="5" fill="${activeTheme.accentGoldHex}" stroke="#ffffff" stroke-width="1"/>
              </svg>
            </div>
            <div style="position: absolute; bottom: 4px; right: 4px; width: 60px; height: 60px; transform: rotate(180deg); pointer-events: none;">
              <svg viewBox="0 0 120 120" fill="none" style="width:100%;height:100%;">
                <path d="M0 0 L60 0 C45 15 35 25 25 45 C15 35 15 45 0 60 Z" fill="${activeTheme.frameOuterBorder}" />
                <path d="M5 5 L45 5 C35 12 25 20 18 35 C12 25 12 35 5 45 Z" fill="${activeTheme.accentGoldHex}" />
                <circle cx="18" cy="18" r="5" fill="${activeTheme.accentGoldHex}" stroke="#ffffff" stroke-width="1"/>
              </svg>
            </div>

            <!-- Header -->
            <div class="cert-header">
              <div class="school-side">
                <p style="font-size: 11pt; font-weight: bold; color: ${activeTheme.headerTitleColor}; margin: 0;">${schoolName}</p>
                <p style="font-size: 10pt; color: #334155; margin: 2px 0 0 0;">${gradeClass} • ឆ្នាំសិក្សា ${toKhmerNum(activeYear)}</p>
              </div>
              <div class="kingdom-side">
                <p class="moul" style="font-size: 12pt; color: ${activeTheme.headerTitleColor}; margin: 0;">ព្រះរាជាណាចក្រកម្ពុជា</p>
                <p class="moul" style="font-size: 11pt; color: ${activeTheme.headerTitleColor}; margin: 2px 0;">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                <p style="color: ${activeTheme.accentGoldHex}; font-size: 10pt; margin: 0;">❖ ━━━━━━ ❖</p>
              </div>
            </div>

            <!-- Title -->
            <div class="cert-title-box">
              <h1 class="moul cert-main-title" style="color: ${activeTheme.headerTitleColor};">ប័ណ្ណសរសើរ</h1>
              <p style="font-size: 10pt; font-weight: bold; color: ${activeTheme.accentGoldHex}; margin-top: 2px; letter-spacing: 2px;">CERTIFICATE OF HONOR & MERIT</p>
            </div>

            <!-- Body -->
            <div class="cert-body">
              <p style="font-size: 11pt; color: #334155; margin-bottom: 8px;">នាយកសាលា និងលោកគ្រូ/អ្នកគ្រូបន្ទុកថ្នាក់ សូមសម្តែងនូវការកោតសរសើរ និងផ្តល់កិត្តិយសជូនដល់៖</p>
              
              <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin: 8px 0;">
                <img src="${student.photo}" style="width: 90px; height: 115px; object-fit: cover; border-radius: 12px; border: 3px solid ${activeTheme.accentGoldHex}; box-shadow: 0 4px 10px rgba(0,0,0,0.15);" />
                <div style="text-align: left;">
                  <h2 class="moul" style="font-size: 16pt; color: ${activeTheme.headerTitleColor}; margin: 0 0 4px 0;">${student.name}</h2>
                  <p style="font-size: 10.5pt; font-weight: bold; color: #475569; margin: 2px 0;">ភេទ៖ ${student.gender} • អត្តលេខ៖ ${student.studentCode || '-'}</p>
                  <p style="font-size: 10.5pt; font-weight: bold; color: #475569; margin: 2px 0;">សិស្ស${gradeClass} នៃ${schoolName}</p>
                </div>
              </div>

              <p style="font-size: 11pt; color: #334155; line-height: 1.5; margin: 8px 0 6px 0;">
                ដែលបានខិតខំប្រឹងប្រែងរៀនសូត្រ ប្រកបដោយវិន័យ សីលធម៌ល្អ និងទទួលបានលទ្ធផលឆ្នើម៖
              </p>

              <!-- Highlighted Badge -->
              <div class="cert-award-card" style="border: 2px dashed ${activeTheme.accentGoldHex}; background: #fffbeb;">
                <div style="font-size: 14pt; font-weight: 900; color: ${activeTheme.headerTitleColor}; margin-bottom: 4px;">
                  🏆 ចំណាត់ថ្នាក់៖ ${student.mention || `ជ័យលាភីលេខ ${toKhmerNum(student.rank)}`}
                </div>
                <div style="font-size: 12pt; font-weight: bold; color: #0f172a;">
                  ${gradeInfo.scoreText} • ${gradeInfo.label}
                </div>
                <div style="font-size: 10pt; font-weight: 600; color: #475569; margin-top: 3px;">
                  ${periodTitle} ឆ្នាំសិក្សា ${toKhmerNum(activeYear)}
                </div>
              </div>
            </div>

            <!-- Signatures -->
            <div class="cert-footer">
              <div style="text-align: center;">
                <p style="font-size: 9.5pt; color: #64748b; margin: 0;">បានឃើញ និងឯកភាព</p>
                <p class="moul" style="font-size: 10pt; color: ${activeTheme.headerTitleColor}; margin: 3px 0 40px 0;">នាយកសាលា</p>
                <p style="font-size: 10.5pt; font-weight: bold; color: #0f172a; margin: 0;">${principalName}</p>
              </div>
              <div style="text-align: center;">
                <p style="font-size: 9.5pt; color: #64748b; margin: 0;">${signDate}</p>
                <p class="moul" style="font-size: 10pt; color: ${activeTheme.headerTitleColor}; margin: 3px 0 40px 0;">គ្រូបន្ទុកថ្នាក់</p>
                <p style="font-size: 10.5pt; font-weight: bold; color: #0f172a; margin: 0;">${teacher.name}</p>
              </div>
            </div>
          </div>
        </div>
        `;
      })
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ប័ណ្ណសរសើរសិស្សទាំង៥ - ${teacher.school}</title>
          ${getKhmerGoogleFontsLinkHtml()}
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            *, *::before, *::after {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              margin: 0;
              padding: 0;
              background: #ffffff;
              font-family: '${selectedFont}', 'Kantumruy Pro', sans-serif;
            }
            .cert-page {
              width: 297mm;
              height: 210mm;
              page-break-after: always;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 8mm;
              box-sizing: border-box;
            }
            .cert-border {
              width: 100%;
              height: 100%;
              border: 8px solid #1e3a8a;
              outline: 3px solid #d97706;
              outline-offset: -12px;
              padding: 16mm 20mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: center;
              background: #ffffff;
              position: relative;
            }
            .cert-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .school-side { text-align: left; }
            .kingdom-side { text-align: center; }
            .cert-title-box { margin: 10px 0; }
            .cert-main-title {
              font-size: 28pt;
              color: #1e3a8a;
              letter-spacing: 2px;
              margin: 0;
            }
            .cert-body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
            .cert-award-card {
              background: #f8fafc;
              border: 2px dashed #d97706;
              border-radius: 16px;
              padding: 12px 24px;
              margin: 10px auto;
              display: inline-block;
            }
            .cert-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding-top: 10px;
            }
            .moul { font-family: 'Moul', cursive; }
          </style>
        </head>
        <body>
          ${certPagesHtml}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Extract Rank 1 to 5
  const rank1 = honorList.find((s) => s.rank === 1) || honorList[0];
  const rank2 = honorList.find((s) => s.rank === 2) || honorList[1];
  const rank3 = honorList.find((s) => s.rank === 3) || honorList[2];
  const rank4 = honorList.find((s) => s.rank === 4) || honorList[3];
  const rank5 = honorList.find((s) => s.rank === 5) || honorList[4];

  // Currently inspected single certificate student
  const activeCertStudent = honorList.find((s) => s.rank === selectedCertRank) || rank1;

  return (
    <div className="space-y-4">
      {/* Hidden File Input for Student Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-950 text-white p-5 rounded-[28px] shadow-xl border border-amber-300/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-xs font-black text-amber-200">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>តារាងកិត្តិយស & ប័ណ្ណសរសើរសិស្សឆ្នើមទាំង ៥ (MoEYS Official Honor Roll)</span>
          </div>
          <h2 className="font-black text-xl text-white flex items-center gap-2">
            <span>🏆 {periodTitle}</span>
            <span className="text-xs bg-amber-400 text-slate-900 font-black px-2.5 py-0.5 rounded-full shadow-xs">
              {activeYear}
            </span>
          </h2>
          <p className="text-xs text-amber-100/90 leading-relaxed max-w-2xl">
            បង្ហាញសិស្សឆ្នើមទាំង ៥ យ៉ាងច្បាស់លាស់ ជាមួយចំណាត់ថ្នាក់ និទ្ទេស និងពិន្ទុស៊ីគ្នាត្រឹមត្រូវតាមស្ដង់ដារ MoEYS
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={autoRankStudents}
            className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 border border-white/20 active:scale-95 cursor-pointer"
            title="ស្រង់សិស្សឡើងវិញពីពិន្ទុ"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
            <span>ស្រង់ស្វ័យប្រវត្តិ</span>
          </button>

          <button
            type="button"
            onClick={handleExportWord}
            className="px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs shadow-md transition flex items-center gap-2 border border-blue-400/40 active:scale-95 cursor-pointer"
            title="ទាញយកឯកសារ Microsoft Word (.doc) មានស៊ុមព័ទ្ធជុំ និងកម្រិត ១ ទំព័រ ១០០%"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>ទាញយក Word (.doc)</span>
          </button>

          <button
            type="button"
            onClick={handleExportImage}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs shadow-md transition flex items-center gap-2 border border-indigo-400/30 active:scale-95 cursor-pointer"
          >
            <FileImage className="w-4 h-4 text-sky-300" />
            <span>ទាញយករូបភាព (PNG)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2 active:scale-95 cursor-pointer"
            title="បោះពុម្ព ឬរក្សាទុកជា PDF A4 ទំហំស្តង់ដារ ១ ទំព័រដាច់ខាត"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>ទាញយក PDF / បោះពុម្ព (១ ទំព័រ)</span>
          </button>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main View Mode Selector (Honor Board vs Top 5 Certificates vs Detailed Table) */}
      <div className="bg-white p-2 rounded-[22px] border border-slate-200 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1">
          <button
            type="button"
            onClick={() => setActiveView('board')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
              activeView === 'board'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>តារាងកិត្តិយសរួម (A4 Board - ៥ នាក់)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('certificates')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
              activeView === 'certificates'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-amber-200" />
            <span>ប័ណ្ណសរសើរបុគ្គលទាំង ៥ (Certificates)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('table')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
              activeView === 'table'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <TableIcon className="w-4 h-4 text-emerald-200" />
            <span>តារាងសង្ខេបលទ្ធផល និងនិទ្ទេស (Summary Table)</span>
          </button>
        </div>

        {activeView === 'certificates' && (
          <button
            type="button"
            onClick={handleBatchPrintAllCertificates}
            className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs transition flex items-center gap-1.5 border border-amber-300 shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-800" />
            <span>បោះពុម្ពប័ណ្ណទាំង ៥ ក្នុងពេលតែមួយ</span>
          </button>
        )}
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT CONTROLS (Settings & Tweaks) ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Period Selector (Month / Semester / Annual) */}
          <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>កាលបរិច្ឆេទ & ប្រភេទតារាងកិត្តិយស</span>
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                MoEYS Standard
              </span>
            </div>

            {/* Period Type Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setPeriodType('month')}
                className={`py-1.5 rounded-lg transition ${
                  periodType === 'month' ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                ប្រចាំខែ
              </button>
              <button
                type="button"
                onClick={() => setPeriodType('semester1')}
                className={`py-1.5 rounded-lg transition ${
                  periodType === 'semester1' ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                ឆមាសទី១
              </button>
              <button
                type="button"
                onClick={() => setPeriodType('semester2')}
                className={`py-1.5 rounded-lg transition ${
                  periodType === 'semester2' ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                ឆមាសទី២
              </button>
              <button
                type="button"
                onClick={() => setPeriodType('annual')}
                className={`py-1.5 rounded-lg transition ${
                  periodType === 'annual' ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                ប្រចាំឆ្នាំ
              </button>
            </div>

            {/* Month Selection if periodType === 'month' */}
            {periodType === 'month' && (
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-slate-600">ជ្រើសរើសខែ៖</label>
                <select
                  value={selectedMonthKey}
                  onChange={(e) => setSelectedMonthKey(e.target.value as GradePeriodKey)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {GRADE_PERIODS.filter((p) => !p.isSummary && !p.isExam).map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dynamic Visual Theme & Border Selector */}
            <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-amber-500" />
                  <span>រចនាបថស៊ុម & ពណ៌ (Visual Theme)៖</span>
                </label>
                <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full text-white shadow-2xs" style={{ background: activeTheme.headerTitleColor }}>
                  {activeTheme.badgeLabel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setThemeMode('auto')}
                  className={`px-2.5 py-1.5 rounded-xl text-left border transition text-[11px] font-bold flex items-center gap-1.5 ${
                    themeMode === 'auto'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>🔄</span>
                  <span className="truncate">ស្វ័យប្រវត្តិ (Auto)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('month_emerald')}
                  className={`px-2.5 py-1.5 rounded-xl text-left border transition text-[11px] font-bold flex items-center gap-1.5 ${
                    themeMode === 'month_emerald'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>🌿</span>
                  <span className="truncate">ប្រចាំខែ (មរកត)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('semester_ruby')}
                  className={`px-2.5 py-1.5 rounded-xl text-left border transition text-[11px] font-bold flex items-center gap-1.5 ${
                    themeMode === 'semester_ruby'
                      ? 'bg-rose-700 text-white border-rose-800 shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>💎</span>
                  <span className="truncate">ឆមាស (ទទឹមរាជ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('annual_gold')}
                  className={`px-2.5 py-1.5 rounded-xl text-left border transition text-[11px] font-bold flex items-center gap-1.5 ${
                    themeMode === 'annual_gold'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>👑</span>
                  <span className="truncate">ប្រចាំឆ្នាំ (មាសអធិរាជ)</span>
                </button>
              </div>
            </div>

            {/* 1.1 Border Frame Style & Width */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>🎨 រចនាបថស៊ុមព័ទ្ធជុំវិញ (Border Frame):</span>
                <span className="text-[10px] text-amber-700 font-black">
                  កម្រាស់ {borderWidth}px
                </span>
              </label>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setBorderStyle('royal_double')}
                  className={`p-2 rounded-xl text-left border transition text-[10.5px] font-bold flex flex-col gap-0.5 ${
                    borderStyle === 'royal_double'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate">⚜️ ស៊ុមទ្វេមាសរាជវង្ស</span>
                  <span className="text-[9px] opacity-75">Double Royal Gold</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBorderStyle('triple_gold')}
                  className={`p-2 rounded-xl text-left border transition text-[10.5px] font-bold flex flex-col gap-0.5 ${
                    borderStyle === 'triple_gold'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate">👑 ស៊ុមមាស ៣ ជាន់</span>
                  <span className="text-[9px] opacity-75">Triple-Tier Gold</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBorderStyle('heritage_phni')}
                  className={`p-2 rounded-xl text-left border transition text-[10.5px] font-bold flex flex-col gap-0.5 ${
                    borderStyle === 'heritage_phni'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate">🪷 ក្បាច់ភ្ញីទេសបុរាណ</span>
                  <span className="text-[9px] opacity-75">Khmer Phni Tes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBorderStyle('refined_line')}
                  className={`p-2 rounded-xl text-left border transition text-[10.5px] font-bold flex flex-col gap-0.5 ${
                    borderStyle === 'refined_line'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate">✨ បន្ទាត់ក្បាច់ប្រណីត</span>
                  <span className="text-[9px] opacity-75">Refined Heritage</span>
                </button>
              </div>

              {/* Thickness Selector */}
              <div className="flex items-center justify-between gap-1 pt-1">
                <span className="text-[10px] font-bold text-slate-600">កម្រាស់បន្ទាត់ស៊ុម៖</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                  {[4, 6, 8, 10].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setBorderWidth(w)}
                      className={`px-2 py-0.5 rounded-md font-black transition ${
                        borderWidth === w
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-700 hover:text-slate-950'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. School Info & Custom Titles */}
          <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-indigo-600" />
              <span>ព័ត៌មានគ្រឹះស្ថាន & ហត្ថលេខា</span>
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-600">ឈ្មោះសាលារៀន៖</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600">កម្រិតថ្នាក់៖</label>
                <input
                  type="text"
                  value={gradeClass}
                  onChange={(e) => setGradeClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-600">ឈ្មោះនាយកសាលា៖</label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600">កាលបរិច្ឆេទចុះហត្ថលេខា៖</label>
                <input
                  type="text"
                  value={signDate}
                  onChange={(e) => setSignDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* 3. Theme & Layout Tuning (For Board View) */}
          {activeView === 'board' && (
            <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Move className="w-4 h-4 text-rose-500" />
                  <span>កែសម្រួលទីតាំង & ទំហំ (Pixel-Perfect)</span>
                </span>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                  Tool
                </span>
              </div>

              {/* Target Element Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">ជ្រើសរើសផ្នែកដែលត្រូវរំកិល៖</label>
                <select
                  value={selectedElement}
                  onChange={(e) => setSelectedElement(e.target.value as keyof LayoutOffsets)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="studentsPodium">🏆 ប្លង់រូបថតសិស្ស (Student Podium / Photos)</option>
                  <option value="mainTitle">📜 ចំណងជើង & ឆ្នាំសិក្សា (Main Title)</option>
                  <option value="schoolInfo">🏛️ ព័ត៌មានសាលាខាងឆ្វេង (School Info)</option>
                  <option value="kingdomHeader">🇰🇭 ក្បាលលិខិតជាតិខាងស្តាំ (Kingdom Header)</option>
                  <option value="studentNames">🏷️ ស្លាកឈ្មោះ & និទ្ទេស (Names & Badges)</option>
                  <option value="signatures">✍️ ហត្ថលេខានាយក & គ្រូ (Signatures)</option>
                  <option value="overall">📐 ផ្ទៃទាំងមូល (Entire Document)</option>
                </select>
              </div>

              {/* D-Pad Controller & Sliders */}
              <div className="grid grid-cols-12 gap-3 items-center pt-2">
                {/* D-Pad Buttons */}
                <div className="col-span-5 flex flex-col items-center gap-1 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => moveElement(0, -1)}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 shadow-xs border border-slate-300 flex items-center justify-center text-slate-700 active:scale-90"
                    title="ឡើងលើ"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveElement(-1, 0)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 shadow-xs border border-slate-300 flex items-center justify-center text-slate-700 active:scale-90"
                      title="ឆ្វេង"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOffsets((prev) => ({
                          ...prev,
                          [selectedElement]: { ...prev[selectedElement], x: 0, y: 0 },
                        }));
                      }}
                      className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-black text-[10px] flex items-center justify-center active:scale-90"
                      title="កំណត់ ០,០"
                    >
                      0,0
                    </button>
                    <button
                      type="button"
                      onClick={() => moveElement(1, 0)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 shadow-xs border border-slate-300 flex items-center justify-center text-slate-700 active:scale-90"
                      title="ស្តាំ"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => moveElement(0, 1)}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 shadow-xs border border-slate-300 flex items-center justify-center text-slate-700 active:scale-90"
                    title="ចុះក្រោម"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Scale & Offsets Info */}
                <div className="col-span-7 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600">ទំហំពង្រីក (Scale):</span>
                    <span className="font-black text-indigo-600">{offsets[selectedElement].scale}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={150}
                    value={offsets[selectedElement].scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>X: {offsets[selectedElement].x}px</span>
                    <span>Y: {offsets[selectedElement].y}px</span>
                  </div>
                </div>
              </div>

              {/* Save & Reset */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveLayout}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>រក្សាទុកប្លង់ (Save)</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetLayout}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>កំណត់ឡើងវិញ</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. Student List Data & Score Editors */}
          <div className="bg-white p-4 rounded-[24px] border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>រូបថត & ព័ត៌មានសិស្សជ័យលាភីទាំង ៥</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                (ចុចលើរូបដើម្បីប្តូរ)
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {honorList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black flex items-center justify-center text-[10px] shrink-0 shadow-xs">
                        {toKhmerNum(item.rank)}
                      </span>
                      {/* Photo with Click-to-upload */}
                      <div
                        onClick={() => handleTriggerUpload(idx)}
                        className="relative group/avatar w-10 h-10 rounded-lg overflow-hidden border border-slate-300 shrink-0 cursor-pointer shadow-xs bg-slate-100"
                        title="ចុចដើម្បីប្តូររូបថតសិស្ស"
                      >
                        <img
                          src={item.photo}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.src = generateDefaultStudentAvatarSvg(item.gender, idx);
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition flex items-center justify-center text-white text-[9px] font-bold">
                          <Upload className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateStudentName(idx, e.target.value)}
                          className="font-black text-slate-900 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs w-32 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <button
                            type="button"
                            onClick={() => handleToggleGenderAvatar(idx)}
                            className="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 cursor-pointer"
                            title="ចុចដើម្បីប្តូរភេទ និងរូបតំណាង"
                          >
                            {item.gender === 'ស្រី' ? '👧 ស្រី' : '👦 ប្រុស'}
                          </button>
                          <span className="text-[10px] text-slate-500">
                            {item.mention}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(idx)}
                        className="px-2 py-1 bg-white hover:bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-slate-300 text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-2.5 h-2.5" />
                        <span>ប្តូររូប</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500">ពិន្ទុមធ្យមភាគ៖</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.score}
                        onChange={(e) => handleUpdateStudentScore(idx, parseFloat(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-black text-amber-700"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500">និទ្ទេស & ការវាយតម្លៃ៖</label>
                      <div className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-emerald-700">
                        {item.gradeLabel || `និទ្ទេស ${item.gradeLetter}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT PREVIEW ================= */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* ================= VIEW 1: HONOR ROLL BOARD (A4 Poster with Top 5) ================= */}
          {activeView === 'board' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex flex-wrap items-center justify-between pb-2 gap-2 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>ទិដ្ឋភាពតារាងកិត្តិយស A4 (Top 5 Board Preview)</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-[10px]">
                    <button
                      type="button"
                      onClick={() => setPosterLayout('pyramid')}
                      className={`px-2.5 py-1 rounded-lg transition font-black flex items-center gap-1 ${
                        posterLayout === 'pyramid'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <span>🔺 ប្លង់ពីរ៉ាមីត (1-2-2)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPosterLayout('row4')}
                      className={`px-2.5 py-1 rounded-lg transition font-black flex items-center gap-1 ${
                        posterLayout === 'row4'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <span>⬛ ប្លង់ជួរដេក (1-4)</span>
                    </button>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-200">
                    A4 300DPI
                  </span>
                </div>
              </div>

              {/* Outer preview wrap */}
              <div className="w-full max-w-[620px] bg-slate-200 p-2 sm:p-4 rounded-[28px] shadow-2xl overflow-hidden flex justify-center border border-slate-300">
                <div
                  ref={printableRef}
                  style={{
                    fontFamily: selectedFont,
                    color: textColor,
                    transform: `translate(${offsets.overall.x}px, ${offsets.overall.y}px) scale(${offsets.overall.scale / 100})`,
                    transformOrigin: 'top center',
                  }}
                  className="relative w-full aspect-[1/1.414] bg-white shadow-xl rounded-sm p-6 sm:p-8 flex flex-col justify-between overflow-hidden select-none"
                >
                  {/* Background Ornate Border & Theme Styling */}
                  <div
                    style={{ opacity: bgOpacity / 100 }}
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                  >
                    {/* Watermark Emblem */}
                    <ThemeWatermarkSvg themeId={activeThemeId} />

                    {/* Multi-tier Ornate Borders */}
                    <div className="w-full h-full p-2 sm:p-2.5">
                      <div
                        className="w-full h-full rounded-sm relative p-1.5 shadow-2xs"
                        style={{
                          border: borderStyle === 'heritage_phni'
                            ? `${borderWidth + 2}px double ${activeTheme.frameOuterBorder}`
                            : `${borderWidth}px solid ${activeTheme.frameOuterBorder}`,
                          boxShadow: borderStyle === 'triple_gold' || borderStyle === 'royal_double'
                            ? `0 0 0 2px ${activeTheme.accentGoldHex}, inset 0 0 0 1px ${activeTheme.accentGoldHex}`
                            : undefined,
                        }}
                      >
                        <div
                          className="w-full h-full relative"
                          style={{
                            border: borderStyle === 'triple_gold'
                              ? `2px dashed ${activeTheme.accentGoldHex}`
                              : `2px solid ${activeTheme.frameInnerBorder}`,
                          }}
                        >
                          {/* Corner Ornaments */}
                          <div className="absolute -top-1 -left-1 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none">
                            <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                          </div>
                          <div className="absolute -top-1 -right-1 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none rotate-90">
                            <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                          </div>
                          <div className="absolute -bottom-1 -left-1 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none -rotate-90">
                            <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none rotate-180">
                            <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                          </div>

                          {/* Top Center Crown Ornament */}
                          <TopCenterCrownOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />

                          {/* Bottom Center Ornament */}
                          <BottomCenterOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Area */}
                  <div className="relative z-10 flex justify-between items-start pt-2 px-1">
                    {/* School Info (Left) */}
                    <div
                      style={{
                        transform: `translate(${offsets.schoolInfo.x}px, ${offsets.schoolInfo.y}px) scale(${offsets.schoolInfo.scale / 100})`,
                        transformOrigin: 'top left',
                      }}
                      className="text-left space-y-0.5 text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight"
                    >
                      <p className="text-[10px] font-semibold text-slate-700">{departmentName}</p>
                      <p className="text-[10px] font-semibold text-slate-700">{officeName}</p>
                      <p className="font-extrabold" style={{ color: activeTheme.headerTitleColor }}>{schoolName}</p>
                      <p className="font-black text-slate-900">{gradeClass}</p>
                    </div>

                    {/* Kingdom Header (Right) */}
                    <div
                      style={{
                        transform: `translate(${offsets.kingdomHeader.x}px, ${offsets.kingdomHeader.y}px) scale(${offsets.kingdomHeader.scale / 100})`,
                        transformOrigin: 'top right',
                      }}
                      className="text-center space-y-0.5 leading-tight"
                    >
                      <p className="font-bold moul text-[11px] sm:text-[12px]" style={{ color: activeTheme.headerTitleColor }}>ព្រះរាជាណាចក្រកម្ពុជា</p>
                      <p className="font-bold moul text-[10px] sm:text-[11px]" style={{ color: activeTheme.headerTitleColor }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                      <div className="flex justify-center items-center gap-1 text-amber-600 text-[9px] pt-0.5">
                        <span>❖</span>
                        <span className="tracking-widest">━━━━━━</span>
                        <span>❖</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Title */}
                  <div
                    style={{
                      transform: `translate(${offsets.mainTitle.x}px, ${offsets.mainTitle.y}px) scale(${offsets.mainTitle.scale / 100})`,
                      transformOrigin: 'center center',
                    }}
                    className="relative z-10 text-center space-y-1 my-1"
                  >
                    <h1
                      className="font-bold moul text-sm sm:text-base tracking-wide"
                      style={{ color: activeTheme.headerTitleColor }}
                    >
                      {periodTitle}
                    </h1>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-700">
                      ឆ្នាំសិក្សា {toKhmerNum(activeYear)}
                    </p>
                  </div>

                  {/* Top 5 Students Display with Full Details (Rank, Grade, Score Under Name) */}
                  <div
                    style={{
                      transform: `translate(${offsets.studentsPodium.x}px, ${offsets.studentsPodium.y}px) scale(${offsets.studentsPodium.scale / 100})`,
                      transformOrigin: 'center center',
                    }}
                    className="relative z-10 flex-1 flex flex-col justify-center py-0.5"
                  >
                    {posterLayout === 'pyramid' ? (
                      /* ============ 1-2-2 MOEYS PYRAMID LAYOUT (Standard & Large) ============ */
                      <div className="space-y-1.5 w-full">
                        {/* TIER 1: RANK 1 (Prominent Center) */}
                        {(() => {
                          const r1Info = getConsistentGradeDisplay(rank1?.score, rank1?.gradeLetter);
                          return (
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-center space-y-0.5">
                                {/* Rank Badge */}
                                <div className="inline-flex items-center justify-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-[10px] sm:text-[11px] shadow-sm border border-amber-200">
                                  <Crown className="w-3 h-3 text-amber-950" />
                                  <span>ចំណាត់ថ្នាក់លេខ ១ (ឆ្នើម)</span>
                                </div>

                                {/* Photo with Gold Frame and Click-to-upload */}
                                <div
                                  onClick={() => handleTriggerUpload(0)}
                                  className="group/photo relative p-0.5 bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 rounded-xl shadow-md border-2 border-amber-400 mx-auto w-fit cursor-pointer transition hover:scale-105"
                                  title="ចុចដើម្បីប្តូររូបថតសិស្សលេខ ១"
                                >
                                  <img
                                    src={rank1?.photo}
                                    alt={rank1?.name || 'Rank 1'}
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultStudentAvatarSvg(rank1?.gender || 'ស្រី', 0);
                                    }}
                                    className="w-14 sm:w-16 h-18 sm:h-20 object-cover rounded-lg bg-slate-100 block"
                                  />
                                  <div className="absolute inset-0.5 rounded-lg bg-black/40 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center text-white text-[8.5px] font-bold gap-1">
                                    <Upload className="w-3 h-3" />
                                    <span>ប្តូររូប</span>
                                  </div>
                                </div>

                                {/* Info Under Name: AVERAGE SCORE FIRST, THEN GRADE */}
                                <div
                                  style={{
                                    transform: `translate(${offsets.studentNames.x}px, ${offsets.studentNames.y}px) scale(${offsets.studentNames.scale / 100})`,
                                  }}
                                  className="space-y-0.5"
                                >
                                  <div
                                    className="bg-white px-2.5 py-0.5 rounded-full shadow-2xs inline-block"
                                    style={{ border: `1.5px solid ${activeTheme.frameOuterBorder}` }}
                                  >
                                    <p
                                      className="font-black text-[11px] sm:text-xs truncate max-w-[130px]"
                                      style={{ color: activeTheme.headerTitleColor }}
                                    >
                                      {rank1?.name || 'ចាន់ ដាវី'}
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-center gap-1 text-[8px] sm:text-[8.5px] font-bold">
                                    {/* 1. Score / Average FIRST */}
                                    <span className="text-slate-950 bg-amber-300/90 px-1.5 py-0.5 rounded-md border border-amber-500 font-black shadow-2xs">
                                      {r1Info.scoreText}
                                    </span>
                                    {/* 2. Grade SECOND (Consistent with List & Profile) */}
                                    <span className={`px-1.5 py-0.5 rounded-md border font-black shadow-2xs ${r1Info.badgeClass}`}>
                                      {r1Info.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* TIER 2: RANK 2 & RANK 3 (Middle Row - 2 Students) */}
                        <div className="grid grid-cols-2 gap-4 px-2">
                          {/* Rank 2 */}
                          {(() => {
                            const r2Info = getConsistentGradeDisplay(rank2?.score, rank2?.gradeLetter);
                            return (
                              <div className="flex items-center justify-center gap-2 bg-slate-50/70 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                                <div
                                  onClick={() => handleTriggerUpload(1)}
                                  className="group/photo relative p-0.5 bg-gradient-to-tr from-slate-400 to-slate-200 rounded-lg shadow-xs border border-slate-400 shrink-0 cursor-pointer transition hover:scale-105"
                                  title="ចុចដើម្បីប្តូររូបថតសិស្សលេខ ២"
                                >
                                  <img
                                    src={rank2?.photo}
                                    alt={rank2?.name || 'Rank 2'}
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultStudentAvatarSvg(rank2?.gender || 'ប្រុស', 1);
                                    }}
                                    className="w-11 sm:w-13 h-14 sm:h-16 object-cover rounded-md bg-slate-100 block"
                                  />
                                  <div className="absolute inset-0.5 rounded-md bg-black/40 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center text-white text-[7.5px] font-bold">
                                    <Upload className="w-2.5 h-2.5" />
                                  </div>
                                </div>
                                <div className="space-y-0.5 text-left min-w-0 flex-1">
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-900 font-black text-[7.5px] border border-slate-300">
                                    <Medal className="w-2 h-2 text-slate-700" />
                                    <span>លេខ ២</span>
                                  </span>
                                  <p className="font-black text-[9.5px] sm:text-[10px] text-slate-900 truncate">
                                    {rank2?.name || 'កែវ មករា'}
                                  </p>
                                  <div className="flex flex-col gap-0.5 text-[7.5px] font-bold">
                                    {/* Score first */}
                                    <span className="text-slate-900 bg-amber-50 px-1 py-0.2 rounded border border-amber-300 w-fit font-black">
                                      {r2Info.scoreText}
                                    </span>
                                    {/* Grade second */}
                                    <span className={`px-1 py-0.2 rounded border w-fit font-black ${r2Info.badgeClass}`}>
                                      {r2Info.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Rank 3 */}
                          {(() => {
                            const r3Info = getConsistentGradeDisplay(rank3?.score, rank3?.gradeLetter);
                            return (
                              <div className="flex items-center justify-center gap-2 bg-amber-50/50 p-1 rounded-xl border border-amber-200/80 shadow-2xs">
                                <div
                                  onClick={() => handleTriggerUpload(2)}
                                  className="group/photo relative p-0.5 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-lg shadow-xs border border-amber-400 shrink-0 cursor-pointer transition hover:scale-105"
                                  title="ចុចដើម្បីប្តូររូបថតសិស្សលេខ ៣"
                                >
                                  <img
                                    src={rank3?.photo}
                                    alt={rank3?.name || 'Rank 3'}
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultStudentAvatarSvg(rank3?.gender || 'ស្រី', 2);
                                    }}
                                    className="w-11 sm:w-13 h-14 sm:h-16 object-cover rounded-md bg-slate-100 block"
                                  />
                                  <div className="absolute inset-0.5 rounded-md bg-black/40 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center text-white text-[7.5px] font-bold">
                                    <Upload className="w-2.5 h-2.5" />
                                  </div>
                                </div>
                                <div className="space-y-0.5 text-left min-w-0 flex-1">
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-black text-[7.5px] border border-amber-300">
                                    <Medal className="w-2 h-2 text-amber-700" />
                                    <span>លេខ ៣</span>
                                  </span>
                                  <p className="font-black text-[9.5px] sm:text-[10px] text-slate-900 truncate">
                                    {rank3?.name || 'ចាន់ ផល្លា'}
                                  </p>
                                  <div className="flex flex-col gap-0.5 text-[7.5px] font-bold">
                                    {/* Score first */}
                                    <span className="text-slate-900 bg-amber-50 px-1 py-0.2 rounded border border-amber-300 w-fit font-black">
                                      {r3Info.scoreText}
                                    </span>
                                    {/* Grade second */}
                                    <span className={`px-1 py-0.2 rounded border w-fit font-black ${r3Info.badgeClass}`}>
                                      {r3Info.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* TIER 3: RANK 4 & RANK 5 (Bottom Row - 2 Students) */}
                        <div className="grid grid-cols-2 gap-4 px-2">
                          {/* Rank 4 */}
                          {(() => {
                            const r4Info = getConsistentGradeDisplay(rank4?.score, rank4?.gradeLetter);
                            return (
                              <div className="flex items-center justify-center gap-2 bg-slate-50/60 p-1 rounded-xl border border-slate-200 shadow-2xs">
                                <div
                                  onClick={() => handleTriggerUpload(3)}
                                  className="group/photo relative p-0.5 bg-slate-200 rounded-lg shadow-xs border border-slate-300 shrink-0 cursor-pointer transition hover:scale-105"
                                  title="ចុចដើម្បីប្តូររូបថតសិស្សលេខ ៤"
                                >
                                  <img
                                    src={rank4?.photo}
                                    alt={rank4?.name || 'Rank 4'}
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultStudentAvatarSvg(rank4?.gender || 'ស្រី', 3);
                                    }}
                                    className="w-11 sm:w-13 h-14 sm:h-16 object-cover rounded-md bg-slate-100 block"
                                  />
                                  <div className="absolute inset-0.5 rounded-md bg-black/40 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center text-white text-[7.5px] font-bold">
                                    <Upload className="w-2.5 h-2.5" />
                                  </div>
                                </div>
                                <div className="space-y-0.5 text-left min-w-0 flex-1">
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 font-black text-[7.5px] border border-slate-300">
                                    <Star className="w-2 h-2 text-amber-500" />
                                    <span>លេខ ៤</span>
                                  </span>
                                  <p className="font-black text-[9.5px] sm:text-[10px] text-slate-900 truncate">
                                    {rank4?.name || 'សេង កញ្ញាណា'}
                                  </p>
                                  <div className="flex flex-col gap-0.5 text-[7.5px] font-bold">
                                    {/* Score first */}
                                    <span className="text-slate-900 bg-amber-50 px-1 py-0.2 rounded border border-amber-300 w-fit font-black">
                                      {r4Info.scoreText}
                                    </span>
                                    {/* Grade second */}
                                    <span className={`px-1 py-0.2 rounded border w-fit font-black ${r4Info.badgeClass}`}>
                                      {r4Info.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Rank 5 */}
                          {(() => {
                            const r5Info = getConsistentGradeDisplay(rank5?.score, rank5?.gradeLetter);
                            return (
                              <div className="flex items-center justify-center gap-2 bg-slate-50/60 p-1 rounded-xl border border-slate-200 shadow-2xs">
                                <div
                                  onClick={() => handleTriggerUpload(4)}
                                  className="group/photo relative p-0.5 bg-slate-200 rounded-lg shadow-xs border border-slate-300 shrink-0 cursor-pointer transition hover:scale-105"
                                  title="ចុចដើម្បីប្តូររូបថតសិស្សលេខ ៥"
                                >
                                  <img
                                    src={rank5?.photo}
                                    alt={rank5?.name || 'Rank 5'}
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultStudentAvatarSvg(rank5?.gender || 'ប្រុស', 4);
                                    }}
                                    className="w-11 sm:w-13 h-14 sm:h-16 object-cover rounded-md bg-slate-100 block"
                                  />
                                  <div className="absolute inset-0.5 rounded-md bg-black/40 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center text-white text-[7.5px] font-bold">
                                    <Upload className="w-2.5 h-2.5" />
                                  </div>
                                </div>
                                <div className="space-y-0.5 text-left min-w-0 flex-1">
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 font-black text-[7.5px] border border-slate-300">
                                    <Star className="w-2 h-2 text-amber-500" />
                                    <span>លេខ ៥</span>
                                  </span>
                                  <p className="font-black text-[9.5px] sm:text-[10px] text-slate-900 truncate">
                                    {rank5?.name || 'ស៊ន វិបុល'}
                                  </p>
                                  <div className="flex flex-col gap-0.5 text-[7.5px] font-bold">
                                    {/* Score first */}
                                    <span className="text-slate-900 bg-amber-50 px-1 py-0.2 rounded border border-amber-300 w-fit font-black">
                                      {r5Info.scoreText}
                                    </span>
                                    {/* Grade second */}
                                    <span className={`px-1 py-0.2 rounded border w-fit font-black ${r5Info.badgeClass}`}>
                                      {r5Info.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      /* ============ 1-4 ROW LAYOUT ============ */
                      <div className="w-full">
                        {/* RANK 1 (Top Center Prominent) */}
                        {(() => {
                          const r1Info = getConsistentGradeDisplay(rank1?.score, rank1?.gradeLetter);
                          return (
                            <div className="flex flex-col items-center justify-center mb-1.5">
                              <div className="text-center space-y-0.5">
                                {/* Rank Badge */}
                                <div className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-[11px] shadow-sm border border-amber-200">
                                  <Crown className="w-3 h-3 text-amber-950" />
                                  <span>ចំណាត់ថ្នាក់លេខ ១ (ឆ្នើម)</span>
                                </div>

                                {/* Photo with Gold Frame and Click-to-upload */}
                                <div
                                  onClick={() => handleTriggerUpload(0)}
                                  className="group/photo relative p-0.5 bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 rounded-xl shadow-md border-2 border-amber-400 mx-auto w-fit cursor-pointer transition hover:scale-105"
                                  title="ចុចដើម្បីប្តូររូបថតសិស្សលេខ ១"
                                >
                                  <img
                                    src={rank1?.photo}
                                    alt={rank1?.name || 'Rank 1'}
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultStudentAvatarSvg(rank1?.gender || 'ស្រី', 0);
                                    }}
                                    className="w-16 sm:w-18 h-20 sm:h-22 object-cover rounded-lg bg-slate-100 block"
                                  />
                                  <div className="absolute inset-0.5 rounded-lg bg-black/40 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center text-white text-[9px] font-bold gap-1">
                                    <Upload className="w-3 h-3" />
                                    <span>ប្តូររូប</span>
                                  </div>
                                </div>

                                {/* Info Under Name */}
                                <div
                                  style={{
                                    transform: `translate(${offsets.studentNames.x}px, ${offsets.studentNames.y}px) scale(${offsets.studentNames.scale / 100})`,
                                  }}
                                  className="space-y-0.5"
                                >
                                  <div
                                    className="bg-white px-3 py-0.5 rounded-full shadow-2xs inline-block"
                                    style={{ border: `1.5px solid ${activeTheme.frameOuterBorder}` }}
                                  >
                                    <p
                                      className="font-black text-xs truncate max-w-[140px]"
                                      style={{ color: activeTheme.headerTitleColor }}
                                    >
                                      {rank1?.name || 'ចាន់ ដាវី'}
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-center gap-1 text-[8.5px] font-bold">
                                    {/* Score first */}
                                    <span className="text-slate-950 bg-amber-300/90 px-1.5 py-0.5 rounded-md border border-amber-500 font-black shadow-2xs">
                                      {r1Info.scoreText}
                                    </span>
                                    {/* Grade second */}
                                    <span className={`px-1.5 py-0.5 rounded-md border font-black shadow-2xs ${r1Info.badgeClass}`}>
                                      {r1Info.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* RANKS 2, 3, 4, 5 */}
                        <div className="grid grid-cols-4 gap-2 pt-0.5">
                          {/* RANK 2 */}
                          {(() => {
                            const r2Info = getConsistentGradeDisplay(rank2?.score, rank2?.gradeLetter);
                            return (
                              <div className="flex flex-col items-center text-center space-y-0.5">
                                <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-900 font-black text-[8px] shadow-2xs border border-slate-300 whitespace-nowrap">
                                  <Medal className="w-2 h-2 text-slate-700" />
                                  <span>លេខ ២</span>
                                </div>
                                <div
                                  onClick={() => handleTriggerUpload(1)}
                                  className="group/photo relative p-0.5 bg-gradient-to-tr from-blue-400 to-indigo-300 rounded-lg shadow-xs border border-blue-400 cursor-pointer transition hover:scale-105"
                                  title="ចុចដើម្បីប្តូររូបថតសិស្សលេខ ២"
                                >
                                  <img
                                    src={rank2?.photo}
                                    alt={rank2?.name || 'Rank 2'}
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultStudentAvatarSvg(rank2?.gender || 'ប្រុស', 1);
                                    }}
                                    className="w-12 sm:w-14 h-15 sm:h-17 object-cover rounded-md bg-slate-100 block"
                                  />
                                  <div className="absolute inset-0.5 rounded-md bg-black/40 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center text-white text-[8px] font-bold">
                                    <Upload className="w-2.5 h-2.5" />
                                  </div>
                                </div>
                                <div className="space-y-0.5 w-full">
                                  <div className="bg-white px-1 py-0.5 rounded-full border border-slate-300 shadow-2xs inline-block max-w-full">
                                    <p className="font-black text-[9.5px] sm:text-[10px] text-slate-900 truncate max-w-[80px]">
                                      {rank2?.name || 'កែវ មករា'}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center gap-0.5 text-[7.5px] font-bold">
                                    {/* Score first */}
                                    <span className="text-slate-900 bg-amber-50 px-1 py-0.2 rounded border border-amber-300 font-black">
                                      {r2Info.scoreText}
                                    </span>
                                    {/* Grade second */}
                                    <span className={`px-1 py-0.2 rounded border font-black ${r2Info.badgeClass}`}>
                                      {r2Info.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* RANK 3 */}
                          {(() => {
                            const r3Info = getConsistentGradeDisplay(rank3?.score, rank3?.gradeLetter);
                            return (
                              <div className="flex flex-col items-center text-center space-y-0.5">
                                <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[8px] shadow-2xs border border-amber-300 whitespace-nowrap">
                                  <Medal className="w-2 h-2 text-amber-700" />
                                  <span>លេខ ៣</span>
                                </div>
                                <div
                                  onClick={() => handleTriggerUpload(2)}
                                  className="group/photo relative p-0.5 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-lg shadow-xs border border-amber-400 cursor-pointer transition hover:scale-105"
                                  title="ចុចដើម្បីប្តូររូបថតសិស្សលេខ ៣"
                                >
                                  <img
                                    src={rank3?.photo}
                                    alt={rank3?.name || 'Rank 3'}
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultStudentAvatarSvg(rank3?.gender || 'ស្រី', 2);
                                    }}
                                    className="w-12 sm:w-14 h-15 sm:h-17 object-cover rounded-md bg-slate-100 block"
                                  />
                                  <div className="absolute inset-0.5 rounded-md bg-black/40 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center text-white text-[8px] font-bold">
                                    <Upload className="w-2.5 h-2.5" />
                                  </div>
                                </div>
                                <div className="space-y-0.5 w-full">
                                  <div className="bg-white px-1 py-0.5 rounded-full border border-slate-300 shadow-2xs inline-block max-w-full">
                                    <p className="font-black text-[9.5px] sm:text-[10px] text-slate-900 truncate max-w-[80px]">
                                      {rank3?.name || 'ចាន់ ផល្លា'}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center gap-0.5 text-[7.5px] font-bold">
                                    {/* Score first */}
                                    <span className="text-slate-900 bg-amber-50 px-1 py-0.2 rounded border border-amber-300 font-black">
                                      {r3Info.scoreText}
                                    </span>
                                    {/* Grade second */}
                                    <span className={`px-1 py-0.2 rounded border font-black ${r3Info.badgeClass}`}>
                                      {r3Info.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* RANK 4 */}
                          {(() => {
                            const r4Info = getConsistentGradeDisplay(rank4?.score, rank4?.gradeLetter);
                            return (
                              <div className="flex flex-col items-center text-center space-y-0.5">
                                <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-black text-[8px] shadow-2xs border border-slate-300 whitespace-nowrap">
                                  <Star className="w-2 h-2 text-amber-500" />
                                  <span>លេខ ៤</span>
                                </div>
                                <div
                                  onClick={() => handleTriggerUpload(3)}
                                  className="group/photo relative p-0.5 bg-slate-200 rounded-lg shadow-xs border border-slate-300 cursor-pointer transition hover:scale-105"
                                  title="ចុចដើម្បីប្តូររូបថតសិស្សលេខ ៤"
                                >
                                  <img
                                    src={rank4?.photo}
                                    alt={rank4?.name || 'Rank 4'}
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultStudentAvatarSvg(rank4?.gender || 'ស្រី', 3);
                                    }}
                                    className="w-12 sm:w-14 h-15 sm:h-17 object-cover rounded-md bg-slate-100 block"
                                  />
                                  <div className="absolute inset-0.5 rounded-md bg-black/40 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center text-white text-[8px] font-bold">
                                    <Upload className="w-2.5 h-2.5" />
                                  </div>
                                </div>
                                <div className="space-y-0.5 w-full">
                                  <div className="bg-white px-1 py-0.5 rounded-full border border-slate-300 shadow-2xs inline-block max-w-full">
                                    <p className="font-black text-[9.5px] sm:text-[10px] text-slate-900 truncate max-w-[80px]">
                                      {rank4?.name || 'សេង កញ្ញាណា'}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center gap-0.5 text-[7.5px] font-bold">
                                    {/* Score first */}
                                    <span className="text-slate-900 bg-amber-50 px-1 py-0.2 rounded border border-amber-300 font-black">
                                      {r4Info.scoreText}
                                    </span>
                                    {/* Grade second */}
                                    <span className={`px-1 py-0.2 rounded border font-black ${r4Info.badgeClass}`}>
                                      {r4Info.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* RANK 5 */}
                          {(() => {
                            const r5Info = getConsistentGradeDisplay(rank5?.score, rank5?.gradeLetter);
                            return (
                              <div className="flex flex-col items-center text-center space-y-0.5">
                                <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-black text-[8px] shadow-2xs border border-slate-300 whitespace-nowrap">
                                  <Star className="w-2 h-2 text-amber-500" />
                                  <span>លេខ ៥</span>
                                </div>
                                <div
                                  onClick={() => handleTriggerUpload(4)}
                                  className="group/photo relative p-0.5 bg-slate-200 rounded-lg shadow-xs border border-slate-300 cursor-pointer transition hover:scale-105"
                                  title="ចុចដើម្បីប្តូររូបថតសិស្សលេខ ៥"
                                >
                                  <img
                                    src={rank5?.photo}
                                    alt={rank5?.name || 'Rank 5'}
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultStudentAvatarSvg(rank5?.gender || 'ប្រុស', 4);
                                    }}
                                    className="w-12 sm:w-14 h-15 sm:h-17 object-cover rounded-md bg-slate-100 block"
                                  />
                                  <div className="absolute inset-0.5 rounded-md bg-black/40 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center text-white text-[8px] font-bold">
                                    <Upload className="w-2.5 h-2.5" />
                                  </div>
                                </div>
                                <div className="space-y-0.5 w-full">
                                  <div className="bg-white px-1 py-0.5 rounded-full border border-slate-300 shadow-2xs inline-block max-w-full">
                                    <p className="font-black text-[9.5px] sm:text-[10px] text-slate-900 truncate max-w-[80px]">
                                      {rank5?.name || 'ស៊ន វិបុល'}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center gap-0.5 text-[7.5px] font-bold">
                                    {/* Score first */}
                                    <span className="text-slate-900 bg-amber-50 px-1 py-0.2 rounded border border-amber-300 font-black">
                                      {r5Info.scoreText}
                                    </span>
                                    {/* Grade second */}
                                    <span className={`px-1 py-0.2 rounded border font-black ${r5Info.badgeClass}`}>
                                      {r5Info.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Signatures Area */}
                  <div
                    style={{
                      transform: `translate(${offsets.signatures.x}px, ${offsets.signatures.y}px) scale(${offsets.signatures.scale / 100})`,
                      transformOrigin: 'bottom center',
                    }}
                    className="relative z-10 grid grid-cols-2 text-center text-[9.5px] sm:text-[10px] pt-1.5 pb-0.5 border-t border-slate-200/50"
                  >
                    <div>
                      <p className="font-semibold text-slate-600">បានឃើញ និងឯកភាព</p>
                      <p className="font-bold moul text-[9.5px] mt-0.5" style={{ color: activeTheme.headerTitleColor }}>នាយកសាលា</p>
                      <div className="h-6"></div>
                      <p className="font-bold text-slate-800">{principalName}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-600">{signDate}</p>
                      <p className="font-bold moul text-[9.5px] mt-0.5" style={{ color: activeTheme.headerTitleColor }}>គ្រូបន្ទុកថ្នាក់</p>
                      <div className="h-6"></div>
                      <p className="font-bold text-slate-800">{teacher.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 2: TOP 5 INDIVIDUAL CERTIFICATES (ប័ណ្ណសរសើរ) ================= */}
          {activeView === 'certificates' && (
            <div className="w-full flex flex-col items-center space-y-4">
              {/* View Mode Toggle: All 5 vs Single Focus */}
              <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCertViewMode('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                      certViewMode === 'all'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>បង្ហាញទាំង ៥ ប័ណ្ណ (All 5 Cards)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCertViewMode('single')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                      certViewMode === 'single'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>ពិនិត្យប័ណ្ណទោល (Single View)</span>
                  </button>
                </div>

                {/* Batch print button */}
                <button
                  type="button"
                  onClick={handleBatchPrintAllCertificates}
                  className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>បោះពុម្ពប័ណ្ណទាំង ៥ ក្នុងពេលតែមួយ</span>
                </button>
              </div>

              {/* MODE 1: ALL 5 CERTIFICATES DISPLAY (GRID / LIST) */}
              {certViewMode === 'all' && (
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {honorList.slice(0, 5).map((st) => (
                      <div
                        key={st.rank}
                        className="bg-white rounded-2xl p-4 border-4 border-[#1e3a8a] outline outline-2 outline-[#d97706] shadow-md flex flex-col justify-between space-y-3 relative overflow-hidden"
                      >
                        {/* Cert Mini Header */}
                        <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                          <div>
                            <p className="font-black text-xs text-[#1e3a8a]">{schoolName}</p>
                            <p className="text-[10px] text-slate-600 font-bold">{gradeClass} • ឆ្នាំសិក្សា {activeYear}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                              {st.rank === 1 ? '👑 ' : '🏅 '}
                              ជ័យលាភីលេខ {toKhmerNum(st.rank)}
                            </span>
                          </div>
                        </div>

                        {/* Cert Mini Body */}
                        <div className="flex items-center gap-3 py-1">
                          <img
                            src={st.photo}
                            alt={st.name}
                            onError={(e) => {
                              e.currentTarget.src = generateDefaultStudentAvatarSvg(st.gender, st.rank - 1);
                            }}
                            className="w-14 h-18 object-cover rounded-xl border-2 border-amber-500 shadow-xs bg-slate-100 shrink-0"
                          />
                          <div className="space-y-1 text-left flex-1 min-w-0">
                            <h4 className="font-bold moul text-sm text-[#1e3a8a] truncate">
                              {st.name}
                            </h4>
                            <p className="text-[11px] font-bold text-slate-700">
                              ភេទ៖ {st.gender} • {st.mention}
                            </p>
                            {(() => {
                              const certGrade = getConsistentGradeDisplay(st.score, st.gradeLetter);
                              return (
                                <div className="flex items-center gap-1.5 text-[9.5px]">
                                  {/* Average Score FIRST */}
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 font-black border border-amber-300">
                                    {certGrade.scoreText}
                                  </span>
                                  {/* Grade SECOND */}
                                  <span className={`px-1.5 py-0.5 rounded font-black border ${certGrade.badgeClass}`}>
                                    {certGrade.label}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Cert Mini Footer */}
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px]">
                          <span className="text-slate-500 font-semibold">{periodTitle}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCertRank(st.rank);
                              setCertViewMode('single');
                            }}
                            className="text-indigo-700 hover:text-indigo-900 font-black flex items-center gap-1"
                          >
                            <span>មើលប័ណ្ណធំ</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODE 2: SINGLE CERTIFICATE FOCUS PREVIEW */}
              {certViewMode === 'single' && (
                <div className="w-full flex flex-col items-center space-y-3">
                  {/* Student Rank Switcher Pills & Quick Cert Actions */}
                  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 p-1.5 bg-slate-100 rounded-2xl">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                      <span className="text-xs font-black text-slate-700 pl-2 shrink-0">ជ្រើសរើសប័ណ្ណសិស្ស៖</span>
                      <div className="flex gap-1.5">
                        {honorList.map((st) => (
                          <button
                            key={st.rank}
                            type="button"
                            onClick={() => setSelectedCertRank(st.rank)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                              selectedCertRank === st.rank
                                ? 'bg-amber-500 text-slate-950 shadow-xs'
                                : 'bg-white text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center text-[9px]">
                              {toKhmerNum(st.rank)}
                            </span>
                            <span>{st.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleExportWord}
                        className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="ទាញយកប័ណ្ណសរសើរនេះជាឯកសារ Word (.doc) ១ ទំព័រ"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-300" />
                        <span>Word (.doc)</span>
                      </button>
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="បោះពុម្ព ឬរក្សាទុកប័ណ្ណសរសើរនេះជា PDF A4 ១ ទំព័រ"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-950" />
                        <span>PDF / បោះពុម្ព (១ ទំព័រ)</span>
                      </button>
                    </div>
                  </div>

                  {/* Certificate Sheet Preview (A4 Landscape Formatted) */}
                  <div className="w-full max-w-[660px] bg-slate-200 p-2 sm:p-4 rounded-[28px] shadow-2xl overflow-hidden flex justify-center border border-slate-300">
                    <div
                      ref={certPrintableRef}
                      style={{
                        fontFamily: selectedFont,
                        color: activeTheme.headerTitleColor,
                      }}
                      className="relative w-full aspect-[1.414/1] bg-white shadow-xl rounded-sm p-6 sm:p-8 flex flex-col justify-between overflow-hidden select-none"
                    >
                      {/* Ornate Frame & Corners */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden p-2 sm:p-2.5">
                        <ThemeWatermarkSvg themeId={activeThemeId} />
                        <div
                          className="w-full h-full rounded-sm relative p-1.5 shadow-2xs"
                          style={{ border: `6px solid ${activeTheme.frameOuterBorder}` }}
                        >
                          <div
                            className="w-full h-full relative"
                            style={{ border: `2px solid ${activeTheme.frameInnerBorder}` }}
                          >
                            {/* Corner Ornaments */}
                            <div className="absolute -top-1 -left-1 w-16 sm:w-20 h-16 sm:h-20 pointer-events-none">
                              <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-16 sm:w-20 h-16 sm:h-20 pointer-events-none rotate-90">
                              <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                            </div>
                            <div className="absolute -bottom-1 -left-1 w-16 sm:w-20 h-16 sm:h-20 pointer-events-none -rotate-90">
                              <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-16 sm:w-20 h-16 sm:h-20 pointer-events-none rotate-180">
                              <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                            </div>

                            {/* Top Center Crown Ornament */}
                            <TopCenterCrownOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />

                            {/* Bottom Center Ornament */}
                            <BottomCenterOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} />
                          </div>
                        </div>
                      </div>

                      {/* Top Certificate Header */}
                      <div className="relative z-10 flex justify-between items-start pt-1 px-1">
                        <div className="text-left space-y-0.5">
                          <p className="font-extrabold text-xs" style={{ color: activeTheme.headerTitleColor }}>{schoolName}</p>
                          <p className="text-[10px] font-bold text-slate-600">{gradeClass} • ឆ្នាំសិក្សា {toKhmerNum(activeYear)}</p>
                        </div>
                        <div className="text-center space-y-0.5">
                          <p className="font-bold moul text-xs" style={{ color: activeTheme.headerTitleColor }}>ព្រះរាជាណាចក្រកម្ពុជា</p>
                          <p className="font-bold moul text-[11px]" style={{ color: activeTheme.headerTitleColor }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                          <p className="text-[9px]" style={{ color: activeTheme.accentGoldHex }}>❖ ━━━━━━ ❖</p>
                        </div>
                      </div>

                      {/* Main Certificate Title */}
                      <div className="relative z-10 text-center my-0.5">
                        <h1 className="font-bold moul text-xl tracking-wider" style={{ color: activeTheme.headerTitleColor }}>
                          ប័ណ្ណសរសើរ
                        </h1>
                        <p className="text-[9.5px] font-black tracking-widest uppercase" style={{ color: activeTheme.accentGoldHex }}>
                          Certificate of Honor & Merit
                        </p>
                      </div>

                      {/* Body Content */}
                      <div className="relative z-10 text-center space-y-1.5 flex-1 flex flex-col justify-center">
                        <p className="text-[11px] text-slate-700">
                          នាយកសាលា និងលោកគ្រូ/អ្នកគ្រូបន្ទុកថ្នាក់ សូមសម្តែងនូវការកោតសរសើរ និងផ្តល់កិត្តិយសជូនដល់៖
                        </p>

                        <div className="flex items-center justify-center gap-4 py-0.5">
                          <img
                            src={activeCertStudent?.photo}
                            alt={activeCertStudent?.name}
                            onError={(e) => {
                              e.currentTarget.src = generateDefaultStudentAvatarSvg(
                                activeCertStudent?.gender || 'ស្រី',
                                (activeCertStudent?.rank || 1) - 1
                              );
                            }}
                            className="w-16 sm:w-18 h-20 sm:h-22 object-cover rounded-xl shadow-md bg-slate-100"
                            style={{ border: `2.5px solid ${activeTheme.accentGoldHex}` }}
                          />
                          <div className="text-left space-y-0.5">
                            <h2 className="font-bold moul text-base" style={{ color: activeTheme.headerTitleColor }}>
                              {activeCertStudent?.name}
                            </h2>
                            <p className="text-[11px] font-bold text-slate-700">
                              ភេទ៖ {activeCertStudent?.gender} • សិស្ស{gradeClass} នៃ{schoolName}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              អត្តលេខ៖ {activeCertStudent?.studentCode || `ST-${String(activeCertStudent?.studentId || 1).padStart(3, '0')}`}
                            </p>
                          </div>
                        </div>

                        <p className="text-[10.5px] text-slate-700 leading-tight">
                          ដែលបានខិតខំប្រឹងប្រែងរៀនសូត្រ ប្រកបដោយវិន័យ សីលធម៌ល្អ និងទទួលបានលទ្ធផលឆ្នើម៖
                        </p>

                        {/* Prominent Award Badge Card */}
                        {(() => {
                          const singleGrade = getConsistentGradeDisplay(activeCertStudent?.score, activeCertStudent?.gradeLetter);
                          return (
                            <div
                              className="bg-amber-50/90 rounded-2xl p-2 max-w-sm mx-auto shadow-2xs space-y-0.5"
                              style={{ border: `2px dashed ${activeTheme.accentGoldHex}` }}
                            >
                              <p className="font-black text-xs" style={{ color: activeTheme.headerTitleColor }}>
                                🏆 ចំណាត់ថ្នាក់៖ {activeCertStudent?.mention || `ជ័យលាភីលេខ ${toKhmerNum(activeCertStudent?.rank || 1)}`}
                              </p>
                              <div className="flex items-center justify-center gap-2 text-[10.5px] font-black">
                                {/* 1. Average Score FIRST */}
                                <span className="bg-amber-200/90 text-slate-950 px-2 py-0.5 rounded-lg border border-amber-400">
                                  {singleGrade.scoreText}
                                </span>
                                {/* 2. Grade SECOND */}
                                <span className={`px-2 py-0.5 rounded-lg border ${singleGrade.badgeClass}`}>
                                  {singleGrade.label}
                                </span>
                              </div>
                              <p className="text-[9px] font-bold text-slate-600">
                                {periodTitle} • ឆ្នាំសិក្សា {toKhmerNum(activeYear)}
                              </p>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Signatures */}
                      <div className="relative z-10 grid grid-cols-2 text-center text-[10px] pt-1.5 border-t border-slate-200">
                        <div>
                          <p className="font-semibold text-slate-600">បានឃើញ និងឯកភាព</p>
                          <p className="font-bold moul text-[9.5px]" style={{ color: activeTheme.headerTitleColor }}>នាយកសាលា</p>
                          <div className="h-7"></div>
                          <p className="font-bold text-slate-800">{principalName}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-600">{signDate}</p>
                          <p className="font-bold moul text-[9.5px]" style={{ color: activeTheme.headerTitleColor }}>គ្រូបន្ទុកថ្នាក់</p>
                          <div className="h-7"></div>
                          <p className="font-bold text-slate-800">{teacher.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW 3: DETAILED SUMMARY TABLE ================= */}
          {activeView === 'table' && (
            <div className="w-full flex flex-col items-center space-y-4">
              {/* Header & Print Action */}
              <div className="w-full max-w-[620px] flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="space-y-0.5">
                  <h3 className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                    <TableIcon className="w-4 h-4 text-emerald-600" />
                    <span>តារាងសង្ខេបលទ្ធផលសិស្សឆ្នើមទាំង ៥ (Framed Score Table)</span>
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    ស៊ុមព័ទ្ធជុំវិញក្បាច់ខ្មែរ ធានា ១ ទំព័រ A4 ស្អាតឥតខ្ចោះ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>បោះពុម្ពតារាង A4 (Print Table)</span>
                </button>
              </div>

              {/* Framed Printable Table Poster */}
              <div className="w-full max-w-[620px] bg-slate-200 p-2 sm:p-4 rounded-[28px] shadow-2xl overflow-hidden flex justify-center border border-slate-300">
                <div
                  ref={tablePrintableRef}
                  style={{
                    fontFamily: selectedFont,
                    color: textColor,
                  }}
                  className="relative w-full aspect-[1/1.414] bg-white shadow-xl rounded-sm p-6 sm:p-8 flex flex-col justify-between overflow-hidden select-none"
                >
                  {/* Surrounding Ornate Border Frame */}
                  <div
                    style={{ opacity: bgOpacity / 100 }}
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                  >
                    <ThemeWatermarkSvg themeId={activeThemeId} />
                    <div className="w-full h-full p-2 sm:p-2.5">
                      <div
                        className="w-full h-full rounded-sm relative p-1.5 shadow-2xs"
                        style={{
                          border: borderStyle === 'heritage_phni'
                            ? `${borderWidth + 2}px double ${activeTheme.frameOuterBorder}`
                            : `${borderWidth}px solid ${activeTheme.frameOuterBorder}`,
                          boxShadow: borderStyle === 'triple_gold' || borderStyle === 'royal_double'
                            ? `0 0 0 2px ${activeTheme.accentGoldHex}, inset 0 0 0 1px ${activeTheme.accentGoldHex}`
                            : undefined,
                        }}
                      >
                        <div
                          className="w-full h-full relative"
                          style={{
                            border: borderStyle === 'triple_gold'
                              ? `2px dashed ${activeTheme.accentGoldHex}`
                              : `2px solid ${activeTheme.frameInnerBorder}`,
                          }}
                        >
                          {/* Corner Ornaments */}
                          <div className="absolute -top-1 -left-1 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none">
                            <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                          </div>
                          <div className="absolute -top-1 -right-1 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none rotate-90">
                            <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                          </div>
                          <div className="absolute -bottom-1 -left-1 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none -rotate-90">
                            <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none rotate-180">
                            <KhmerCornerOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />
                          </div>

                          {/* Top Center Crown Ornament */}
                          <TopCenterCrownOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} themeId={activeThemeId} />

                          {/* Bottom Center Ornament */}
                          <BottomCenterOrnament color={activeTheme.frameOuterBorder} accentColor={activeTheme.accentGoldHex} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Area */}
                  <div className="relative z-10 flex justify-between items-start pt-2 px-1">
                    {/* School Info (Left) */}
                    <div className="text-left space-y-0.5 text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">
                      <p className="text-slate-600">{departmentName}</p>
                      <p className="text-slate-600">{officeName}</p>
                      <p className="font-extrabold text-slate-900">{schoolName}</p>
                      <p className="font-extrabold text-indigo-700">{gradeClass}</p>
                    </div>

                    {/* Kingdom Header (Right) */}
                    <div className="text-center space-y-0.5 text-slate-800">
                      <p className="font-bold moul text-[11px] sm:text-xs" style={{ color: activeTheme.headerTitleColor }}>
                        ព្រះរាជាណាចក្រកម្ពុជា
                      </p>
                      <p className="font-bold moul text-[10px] sm:text-[11px]" style={{ color: activeTheme.headerTitleColor }}>
                        ជាតិ សាសនា ព្រះមហាក្សត្រ
                      </p>
                      <div className="flex justify-center">
                        <svg className="w-16 h-2 text-amber-500" viewBox="0 0 100 10" fill="currentColor">
                          <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="relative z-10 text-center my-2 space-y-0.5">
                    <h1
                      className="font-bold moul text-base sm:text-lg tracking-wide uppercase drop-shadow-2xs"
                      style={{ color: activeTheme.headerTitleColor }}
                    >
                      {periodTitle}
                    </h1>
                    <p className="text-[11px] font-bold text-slate-700">
                      ឆ្នាំសិក្សា {toKhmerNum(activeYear)} • សិស្សឆ្នើមប្រចាំថ្នាក់
                    </p>
                  </div>

                  {/* Framed Data Table */}
                  <div className="relative z-10 my-auto overflow-hidden rounded-xl border border-slate-300 shadow-2xs bg-white">
                    <table className="w-full text-[10px] sm:text-[11px] text-center border-collapse">
                      <thead>
                        <tr
                          className="text-white font-bold"
                          style={{ backgroundColor: activeTheme.frameOuterBorder }}
                        >
                          <th className="p-1.5 w-10">ល.រ</th>
                          <th className="p-1.5 w-12">រូបថត</th>
                          <th className="p-1.5 text-left">គោត្តនាម-នាម</th>
                          <th className="p-1.5 w-10">ភេទ</th>
                          <th className="p-1.5 w-14">ភាសាខ្មែរ</th>
                          <th className="p-1.5 w-14">គណិត</th>
                          <th className="p-1.5 w-16">មធ្យមភាគ</th>
                          <th className="p-1.5 w-16">និទ្ទេស</th>
                          <th className="p-1.5 w-20">កិត្តិយស</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {honorList.map((st, i) => {
                          const tGrade = getConsistentGradeDisplay(st.score, st.gradeLetter);
                          return (
                            <tr key={i} className="hover:bg-amber-50/50 transition">
                              <td className="p-1.5 font-black text-slate-800">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                                  {toKhmerNum(st.rank)}
                                </span>
                              </td>
                              <td className="p-1">
                                <img
                                  src={st.photo}
                                  alt={st.name}
                                  onError={(e) => {
                                    e.currentTarget.src = generateDefaultStudentAvatarSvg(st.gender, i);
                                  }}
                                  className="w-7 h-9 rounded object-cover mx-auto border border-slate-300 bg-slate-100"
                                />
                              </td>
                              <td className="p-1.5 text-left font-black" style={{ color: activeTheme.headerTitleColor }}>
                                {st.name}
                              </td>
                              <td className="p-1.5 text-slate-700 font-medium">{st.gender}</td>
                              <td className="p-1.5 font-bold text-slate-800">{toKhmerNum(st.khmer || st.score)}</td>
                              <td className="p-1.5 font-bold text-slate-800">{toKhmerNum(st.math || st.score)}</td>
                              <td className="p-1.5 font-black text-amber-800 bg-amber-50">
                                {toKhmerNum(st.score)}
                              </td>
                              <td className="p-1.5">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${tGrade.badgeClass}`}>
                                  {tGrade.label}
                                </span>
                              </td>
                              <td className="p-1.5">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-50 text-indigo-800 border border-indigo-200">
                                  {st.mention}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Signatures */}
                  <div className="relative z-10 grid grid-cols-2 text-center text-[9.5px] sm:text-[10px] pt-2 border-t border-slate-200/50">
                    <div>
                      <p className="font-semibold text-slate-600">បានឃើញ និងឯកភាព</p>
                      <p className="font-bold moul text-[9.5px] mt-0.5" style={{ color: activeTheme.headerTitleColor }}>នាយកសាលា</p>
                      <div className="h-6"></div>
                      <p className="font-bold text-slate-800">{principalName}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-600">{signDate}</p>
                      <p className="font-bold moul text-[9.5px] mt-0.5" style={{ color: activeTheme.headerTitleColor }}>គ្រូបន្ទុកថ្នាក់</p>
                      <div className="h-6"></div>
                      <p className="font-bold text-slate-800">{teacher.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
