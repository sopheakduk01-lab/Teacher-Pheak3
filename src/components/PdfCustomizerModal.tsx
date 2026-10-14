import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getKhmerCombinedDate, getKhmerLunarDate, getKhmerSouriyateiDate } from '../utils/khmerDate';
import {
  FileText,
  Printer,
  Download,
  X,
  Settings,
  Eye,
  Sliders,
  Sparkles,
  Check,
  Palette,
  Maximize2,
  Minimize2,
  RotateCcw,
  BookOpen,
  Building2,
  User,
  Calendar,
  Layout,
  Type,
  FileCheck2,
  PenTool,
  Grid,
  ShieldCheck,
  HelpCircle,
  Copy,
  Edit3,
  Search,
  Plus,
  Trash2,
  Filter,
  Clock,
  Replace,
  Undo2,
  MapPin,
  Layers,
  Columns,
  Maximize,
  Minimize,
  Smartphone,
  Monitor,
  CheckCircle2,
  Info,
  Sun,
  Moon,
  MousePointerClick,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Move,
  PlusCircle,
  Stamp,
  Tag,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  GripVertical,
} from 'lucide-react';
import {
  TimetableInfo,
  TimetableRow,
  morningShiftRows,
  afternoonShiftRows,
} from '../data/timetableData';
import { Quiz } from '../types';
import { QUIZ_BOOK_COVER_BASE64, QUIZ_BOOK_COVER_URL } from '../data/quizCoverData';
import {
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getThemeBackgroundClass,
} from '../utils/customPrintFont';

export type PaperSectionKey =
  | 'kingdom_header'
  | 'school_info'
  | 'teacher_info'
  | 'doc_title'
  | 'doc_subtitle'
  | 'main_content'
  | 'notes_section'
  | 'location_date'
  | 'left_signature'
  | 'right_signature';

export interface SectionFormatting {
  offsetX?: number;
  offsetY?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontSizeDelta?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  color?: string;
  bgColor?: string;
  letterSpacing?: number;
  lineHeight?: number;
}

export interface MovableSticker {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  bgColor: string;
  borderColor?: string;
  fontFamily?: KhmerFontKey;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStampStyle?: boolean;
  rotation?: number;
}

export interface PdfHeaderData {
  kingdomTitle: string;
  kingdomMotto: string;
  officeInfo: string;
  departmentInfo: string;
  schoolName: string;
  teacherName: string;
  academicYear: string;
  gradeLevel: string;
  docTitle: string;
  docSubtitle: string;
  locationAndDate: string;
  leftSignatureTitle: string;
  leftSignatureName: string;
  rightSignatureTitle: string;
  rightSignatureName: string;
  footerNote: string;
  headerEmblemText?: string;
  [key: string]: any;
}

export type KhmerFontKey =
  | 'moul'
  | 'moul_pali'
  | 'kantumruy'
  | 'battambang'
  | 'siemreap'
  | 'khmer_os'
  | 'content'
  | 'hanuman'
  | 'preahvihear'
  | 'suwannaphum'
  | 'dangrek'
  | 'koulen'
  | 'bayon'
  | 'bokor'
  | 'noto'
  | 'angkor'
  | 'chenla';

export type TableHeaderStyle = 'filled' | 'gradient' | 'outlined' | 'dark' | 'minimal';
export type TablePaddingSize = 'compact' | 'normal' | 'spacious';
export type TableBorderStyle = 'full' | 'horizontal' | 'minimal' | 'rounded';
export type TableStripingStyle = 'subtle' | 'tinted' | 'white';

export interface PdfStyleConfig {
  paperSize: 'A4' | 'A5' | 'Letter' | 'A3';
  orientation: 'portrait' | 'landscape';
  marginSize: 'tight' | 'normal' | 'wide';
  fontFamily: KhmerFontKey;
  headingFontFamily: KhmerFontKey;
  bodyFontFamily: KhmerFontKey;
  fontSize: 'small' | 'normal' | 'medium' | 'large';
  colorTheme: 'bw' | 'moeys_blue' | 'emerald' | 'burgundy' | 'charcoal' | 'custom';
  customPrimaryColor?: string;
  borderStyle: 'solid' | 'double' | 'minimal' | 'grid';
  showSignatures: boolean;
  showKingdomHeader: boolean;
  showFooterPageNum: boolean;
  showStampBox: boolean;
  watermarkText?: string;

  // Table Design Properties
  tableHeaderStyle?: TableHeaderStyle;
  tablePaddingSize?: TablePaddingSize;
  tableBorderStyle?: TableBorderStyle;
  tableStripingStyle?: TableStripingStyle;
  showHeaderTopBar?: boolean;
  headerLayout?: 'centered_top' | 'side_by_side';
  signaturesLayout?: 'teacher_above_principal' | 'side_by_side';
}

export interface PdfContentToggles {
  showMonthColumn: boolean;
  showWeekColumn: boolean;
  showHoursColumn: boolean;
  showObjectiveColumn: boolean;
  showTopicsList: boolean;
  showBookPages: boolean;
  showCompetencies: boolean;
  showNotesSection?: boolean;
  showAnswerKey?: boolean;
  showCoverPage?: boolean;
}

interface PdfCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'syllabus' | 'timetable' | 'report' | 'general' | 'quiz' | any;
  title?: string;
  initialHeader?: Partial<PdfHeaderData>;
  initialStyles?: Partial<PdfStyleConfig>;
  syllabusData?: any[]; // Selected or all syllabus items
  timetableData?: TimetableInfo | any;
  quizData?: Quiz;
  customTableHtml?: string;
  onShowToast?: (msg: string) => void;
  [key: string]: any;
}

const DEFAULT_HEADER: PdfHeaderData = {
  kingdomTitle: 'ព្រះរាជាណាចក្រកម្ពុជា',
  kingdomMotto: 'ជាតិ សាសនា ព្រះមហាក្សត្រ',
  officeInfo: 'ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុកសៀមបូក',
  departmentInfo: 'សាលាបឋមសិក្សាអូរឫស្សីកណ្តាល',
  schoolName: 'សាលាបឋមសិក្សាអូរឫស្សីកណ្តាល',
  teacherName: 'ឌុក សុភ័ក្ត្រ',
  academicYear: '២០២៥ - ២០២៦',
  gradeLevel: 'ថ្នាក់ទី ៦',
  docTitle: 'បំណែងចែកកម្មវិធីសិក្សាលម្អិត',
  docSubtitle: 'អនុវត្តតាមស្តង់ដារកម្មវិធីសិក្សាក្រសួងអប់រំ យុវជន និងកីឡា',
  locationAndDate: getKhmerCombinedDate(new Date(), { location: 'សៀមបូក', format: 'combined_multiline' }),
  leftSignatureTitle: 'បានឃើញ និងឯកភាព\nនាយកសាលា',
  leftSignatureName: '',
  rightSignatureTitle: 'គ្រូបន្ទុកថ្នាក់',
  rightSignatureName: 'ឌុក សុភ័ក្ត្រ',
  footerNote: 'ឯកសាររៀបចំ និងត្រួតពិនិត្យផ្លូវការតាមប្រព័ន្ធគ្រប់គ្រងសាលារៀន',
};

const getSavedCustomFont = (): KhmerFontKey => {
  if (typeof window !== 'undefined') {
    const saved = (localStorage.getItem('primary_teacher_admin_v2_font') || localStorage.getItem('student_portal_font') || '').toLowerCase();
    if (saved.includes('kantumruy')) return 'kantumruy';
    if (saved.includes('battambang')) return 'battambang';
    if (saved.includes('siemreap')) return 'siemreap';
    if (saved.includes('moul')) return 'moul';
    if (saved.includes('koulen')) return 'koulen';
    if (saved.includes('content')) return 'content';
    if (saved.includes('hanuman')) return 'hanuman';
    if (saved.includes('preahvihear')) return 'preahvihear';
    if (saved.includes('suwannaphum')) return 'suwannaphum';
    if (saved.includes('dangrek')) return 'dangrek';
    if (saved.includes('bayon')) return 'bayon';
    if (saved.includes('bokor')) return 'bokor';
    if (saved.includes('noto')) return 'noto';
    if (saved.includes('angkor')) return 'angkor';
    if (saved.includes('chenla')) return 'chenla';
  }
  return 'battambang';
};

const DEFAULT_STYLES: PdfStyleConfig = {
  paperSize: 'A4',
  orientation: 'portrait',
  marginSize: 'normal',
  fontFamily: getSavedCustomFont(),
  headingFontFamily: 'moul',
  bodyFontFamily: getSavedCustomFont(),
  fontSize: 'normal',
  colorTheme: 'moeys_blue',
  customPrimaryColor: '#1e3a8a',
  borderStyle: 'solid',
  showSignatures: true,
  showKingdomHeader: true,
  showFooterPageNum: true,
  showStampBox: true,
  watermarkText: '',
  tableHeaderStyle: 'filled',
  tablePaddingSize: 'normal',
  tableBorderStyle: 'full',
  tableStripingStyle: 'subtle',
  showHeaderTopBar: true,
  headerLayout: 'centered_top',
  signaturesLayout: 'teacher_above_principal',
};

const DEFAULT_TOGGLES: PdfContentToggles = {
  showMonthColumn: true,
  showWeekColumn: true,
  showHoursColumn: true,
  showObjectiveColumn: true,
  showTopicsList: true,
  showBookPages: true,
  showCompetencies: true,
  showNotesSection: true,
  showAnswerKey: true,
  showCoverPage: true,
};

// Common subjects quick-insert tags for Timetable
const COMMON_PRIMARY_SUBJECTS = [
  { label: 'ភាសាខ្មែរ', icon: '📘' },
  { label: 'គណិតវិទ្យា', icon: '📐' },
  { label: 'វិទ្យាសាស្ត្រ', icon: '🔬' },
  { label: 'សិក្សាសង្គម', icon: '🌏' },
  { label: 'អប់រំកាយ', icon: '⚽' },
  { label: 'សិល្បៈ', icon: '🎨' },
  { label: 'ភាសាអង់គ្លេស', icon: '🇬🇧' },
  { label: 'ស្វ័យសិក្សា', icon: '💡' },
  { label: 'ចេញលេង', icon: '☕' },
  { label: 'គោរពទង់ជាតិ', icon: '🇰🇭' },
  { label: 'បំប៉នភាសាខ្មែរ', icon: '📖' },
  { label: 'បំប៉នគណិតវិទ្យា', icon: '🧮' },
];

export const SECTION_METADATA: Record<PaperSectionKey, { label: string; icon: string }> = {
  kingdom_header: { label: 'ក្បាលសំបុត្រជាតិ (ព្រះរាជាណាចក្រកម្ពុជា)', icon: '👑' },
  school_info: { label: 'ព័ត៌មានមន្ទីរ/ការិយាល័យ/សាលារៀន', icon: '🏢' },
  teacher_info: { label: 'ព័ត៌មានគ្រូបង្រៀន/កម្រិតថ្នាក់/ឆ្នាំសិក្សា', icon: '👨‍🏫' },
  doc_title: { label: 'ចំណងជើងធំនៃឯកសារ (Title)', icon: '📑' },
  doc_subtitle: { label: 'ចំណងជើងរង (Subtitle)', icon: '📝' },
  main_content: { label: 'តារាង / ខ្លឹមសារមាតិកាឯកសារ', icon: '📊' },
  notes_section: { label: 'សម្គាល់ និងការណែនាំ (Notes)', icon: '📌' },
  location_date: { label: 'ទីកន្លែង និងកាលបរិច្ឆេទ (Location & Date)', icon: '📅' },
  left_signature: { label: 'ហត្ថលេខាខាងឆ្វេង (នាយកសាលា/ត្រា)', icon: '✍️' },
  right_signature: { label: 'ហត្ថលេខាខាងស្តាំ (គ្រូបន្ទុកថ្នាក់)', icon: '✍️' },
};

export const PdfCustomizerModal: React.FC<PdfCustomizerModalProps> = ({
  isOpen,
  onClose,
  documentType,
  title = 'កំណត់ទម្រង់ និងកែសម្រួល PDF មុនពេលទាញយក',
  initialHeader,
  initialStyles,
  syllabusData = [],
  timetableData,
  quizData,
  customTableHtml,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'header' | 'style' | 'table_design' | 'content' | 'signatures'>('header');
  
  // Layout view modes: 'split' (Side by Side), 'editor' (Full form), 'preview' (Full live PDF preview)
  const [viewLayout, setViewLayout] = useState<'split' | 'editor' | 'preview'>('split');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(85);
  const [autoFitZoom, setAutoFitZoom] = useState<boolean>(true);

  // Interactive Document Canvas Mode: 'visual_edit' (WYSIWYG on page) vs 'print_preview' (Exact Iframe)
  const [previewMode, setPreviewMode] = useState<'visual_edit' | 'print_preview'>(() => {
    return documentType === 'quiz' ? 'print_preview' : 'visual_edit';
  });

  // Load saved preferences if any, but prioritize initialHeader for document-specific content
  const [header, setHeader] = useState<PdfHeaderData>(() => {
    const saved = localStorage.getItem(`pdf_custom_header_${documentType}`);
    let savedObj = {};
    if (saved) {
      try {
        savedObj = JSON.parse(saved);
      } catch (e) {}
    }
    return { ...DEFAULT_HEADER, ...savedObj, ...initialHeader };
  });

  const isLandscapePreferred =
    documentType === 'timetable' ||
    (title && (title.toLowerCase().includes('landscape') || title.includes('ផ្តេក')));

  const [styles, setStyles] = useState<PdfStyleConfig>(() => {
    const saved = localStorage.getItem(`pdf_custom_styles_${documentType}`);
    let savedObj: Partial<PdfStyleConfig> = {};
    if (saved) {
      try {
        savedObj = JSON.parse(saved);
        if (isLandscapePreferred && !savedObj.orientation) {
          savedObj.orientation = 'landscape';
        }
      } catch (e) {}
    }
    const base = isLandscapePreferred
      ? { ...DEFAULT_STYLES, orientation: 'landscape' as const, borderStyle: 'solid' as const }
      : DEFAULT_STYLES;
    return { ...base, ...savedObj, ...initialStyles };
  });

  // New state to force orientation in UI
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(styles.orientation);

  useEffect(() => {
    setOrientation(styles.orientation);
  }, [styles.orientation]);

  // Direct On-Paper Selected Section & Nudge / Formatting States
  const [selectedSection, setSelectedSection] = useState<string>('doc_title');
  const [nudgeStep, setNudgeStep] = useState<number>(4);
  const [isStickerMenuOpen, setIsStickerMenuOpen] = useState<boolean>(false);
  const [activeNudgeCategory, setActiveNudgeCategory] = useState<'position' | 'align' | 'typography' | 'color' | 'stickers'>('position');

  // Per-section offset & formatting configuration
  const [sectionFormatting, setSectionFormatting] = useState<Record<string, SectionFormatting>>(() => {
    const saved = localStorage.getItem(`pdf_custom_offsets_${documentType}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // Movable Floating Stickers / Official Stamps / Floating Notes
  const [floatingStickers, setFloatingStickers] = useState<MovableSticker[]>(() => {
    const saved = localStorage.getItem(`pdf_custom_stickers_${documentType}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Search & Find-Replace & Undo State
  const [searchLessonQuery, setSearchLessonQuery] = useState<string>('');
  const [showFindReplace, setShowFindReplace] = useState<boolean>(false);
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [historyStack, setHistoryStack] = useState<{
    header: PdfHeaderData;
    styles: PdfStyleConfig;
    editableSyllabus: any[];
    editableTimetable: any;
    sectionFormatting: Record<string, SectionFormatting>;
    floatingStickers: MovableSticker[];
  }[]>([]);

  // Selected cell helper for Timetable quick-insert
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number; day: keyof TimetableRow } | null>(null);
  
  const [toggles, setToggles] = useState<PdfContentToggles>(DEFAULT_TOGGLES);

  // Keep local edits to syllabus / timetable for live PDF fine-tuning
  const [editableSyllabus, setEditableSyllabus] = useState<any[]>(syllabusData);
  const [editableTimetable, setEditableTimetable] = useState<TimetableInfo | any>(() => {
    if (timetableData) {
      return JSON.parse(JSON.stringify(timetableData));
    }
    return null;
  });

  // Helper to push state snapshot for Undo capability
  const pushToHistory = () => {
    setHistoryStack((prev) => [
      ...prev.slice(-10), // keep last 10 actions
      {
        header: { ...header },
        styles: { ...styles },
        editableSyllabus: JSON.parse(JSON.stringify(editableSyllabus)),
        editableTimetable: editableTimetable ? JSON.parse(JSON.stringify(editableTimetable)) : null,
        sectionFormatting: JSON.parse(JSON.stringify(sectionFormatting)),
        floatingStickers: JSON.parse(JSON.stringify(floatingStickers)),
      },
    ]);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const lastSnapshot = historyStack[historyStack.length - 1];
    setHeader(lastSnapshot.header);
    setStyles(lastSnapshot.styles);
    setEditableSyllabus(lastSnapshot.editableSyllabus);
    if (lastSnapshot.editableTimetable) {
      setEditableTimetable(lastSnapshot.editableTimetable);
    }
    if (lastSnapshot.sectionFormatting) {
      setSectionFormatting(lastSnapshot.sectionFormatting);
    }
    if (lastSnapshot.floatingStickers) {
      setFloatingStickers(lastSnapshot.floatingStickers);
    }
    setHistoryStack((prev) => prev.slice(0, -1));
    if (onShowToast) {
      onShowToast('បានត្រឡប់ក្រោយការកែប្រែមុននេះ (Undo) ជោគជ័យ!');
    }
  };

  // Nudge & Section formatting helper methods
  const updateSectionFmt = (secKey: string, updates: Partial<SectionFormatting>) => {
    pushToHistory();
    setSectionFormatting((prev) => {
      const current = prev[secKey] || { offsetX: 0, offsetY: 0 };
      const next = {
        ...prev,
        [secKey]: { ...current, ...updates },
      };
      localStorage.setItem(`pdf_custom_offsets_${documentType}`, JSON.stringify(next));
      return next;
    });
  };

  const nudgeSection = (secKey: string, dir: 'left' | 'right' | 'up' | 'down', step = nudgeStep) => {
    pushToHistory();
    setSectionFormatting((prev) => {
      const current = prev[secKey] || { offsetX: 0, offsetY: 0 };
      let deltaX = 0;
      let deltaY = 0;
      if (dir === 'left') deltaX = -step;
      if (dir === 'right') deltaX = step;
      if (dir === 'up') deltaY = -step;
      if (dir === 'down') deltaY = step;

      const next = {
        ...prev,
        [secKey]: {
          ...current,
          offsetX: (current.offsetX || 0) + deltaX,
          offsetY: (current.offsetY || 0) + deltaY,
        },
      };
      localStorage.setItem(`pdf_custom_offsets_${documentType}`, JSON.stringify(next));
      return next;
    });
  };

  const resetSectionFmt = (secKey: string) => {
    pushToHistory();
    setSectionFormatting((prev) => {
      const next = { ...prev };
      delete next[secKey];
      localStorage.setItem(`pdf_custom_offsets_${documentType}`, JSON.stringify(next));
      return next;
    });
    if (onShowToast) onShowToast('បានកំណត់ទីតាំង និងរចនាប័ទ្មផ្នែកនេះទៅលំនាំដើមវិញ!');
  };

  const resetAllSectionFmts = () => {
    pushToHistory();
    setSectionFormatting({});
    localStorage.removeItem(`pdf_custom_offsets_${documentType}`);
    if (onShowToast) onShowToast('បានកំណត់រាល់ការរំកិលទាំងអស់ទៅលំនាំដើមវិញ!');
  };

  // Sticker helpers
  const addFloatingSticker = (preset?: Partial<MovableSticker>) => {
    pushToHistory();
    const newSticker: MovableSticker = {
      id: 'stk_' + Date.now(),
      text: preset?.text || '【 បានពិនិត្យ និងឯកភាព 】',
      x: preset?.x ?? 80,
      y: preset?.y ?? 120,
      fontSize: preset?.fontSize ?? 14,
      color: preset?.color || '#b91c1c',
      bgColor: preset?.bgColor || '#fef2f2',
      borderColor: preset?.borderColor || '#ef4444',
      isBold: preset?.isBold ?? true,
      isItalic: preset?.isItalic ?? false,
      isUnderline: preset?.isUnderline ?? false,
      isStampStyle: preset?.isStampStyle ?? true,
      rotation: preset?.rotation ?? 0,
      fontFamily: preset?.fontFamily || 'moul',
    };
    setFloatingStickers((prev) => {
      const next = [...prev, newSticker];
      localStorage.setItem(`pdf_custom_stickers_${documentType}`, JSON.stringify(next));
      return next;
    });
    setSelectedSection(newSticker.id);
    setIsStickerMenuOpen(false);
    if (onShowToast) onShowToast('បានបន្ថែមត្រា/អត្ថបទសេរីជោគជ័យ! អ្នកអាចចុចអូស ឬរំកិលទីតាំងបាន។');
  };

  const updateFloatingSticker = (id: string, updates: Partial<MovableSticker>) => {
    pushToHistory();
    setFloatingStickers((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      localStorage.setItem(`pdf_custom_stickers_${documentType}`, JSON.stringify(next));
      return next;
    });
  };

  const deleteFloatingSticker = (id: string) => {
    pushToHistory();
    setFloatingStickers((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem(`pdf_custom_stickers_${documentType}`, JSON.stringify(next));
      return next;
    });
    if (selectedSection === id) setSelectedSection('doc_title');
    if (onShowToast) onShowToast('បានលុបត្រា/អត្ថបទសេរីរួចរាល់');
  };

  const nudgeFloatingSticker = (id: string, dir: 'left' | 'right' | 'up' | 'down', step = nudgeStep) => {
    pushToHistory();
    setFloatingStickers((prev) => {
      const next = prev.map((s) => {
        if (s.id !== id) return s;
        let deltaX = 0;
        let deltaY = 0;
        if (dir === 'left') deltaX = -step;
        if (dir === 'right') deltaX = step;
        if (dir === 'up') deltaY = -step;
        if (dir === 'down') deltaY = step;
        return {
          ...s,
          x: Math.max(0, s.x + deltaX),
          y: Math.max(0, s.y + deltaY),
        };
      });
      localStorage.setItem(`pdf_custom_stickers_${documentType}`, JSON.stringify(next));
      return next;
    });
  };

  // Computes CSS styles for on-paper and HTML export
  const getSectionStyle = (secKey: string): React.CSSProperties => {
    const fmt = sectionFormatting[secKey] || {};
    return {
      transform: (fmt.offsetX || fmt.offsetY) ? `translate(${fmt.offsetX || 0}px, ${fmt.offsetY || 0}px)` : undefined,
      textAlign: fmt.textAlign,
      fontSize: fmt.fontSizeDelta ? `calc(100% + ${fmt.fontSizeDelta}px)` : undefined,
      fontWeight: fmt.isBold !== undefined ? (fmt.isBold ? 'bold' : 'normal') : undefined,
      fontStyle: fmt.isItalic ? 'italic' : undefined,
      textDecoration: fmt.isUnderline ? 'underline' : undefined,
      color: fmt.color,
      backgroundColor: fmt.bgColor,
      letterSpacing: fmt.letterSpacing ? `${fmt.letterSpacing}px` : undefined,
      lineHeight: fmt.lineHeight,
      transition: 'transform 0.05s ease-out',
    };
  };

  const getSectionCssString = (secKey: string): string => {
    const fmt = sectionFormatting[secKey] || {};
    let css = '';
    if (fmt.offsetX || fmt.offsetY) {
      css += `transform: translate(${fmt.offsetX || 0}px, ${fmt.offsetY || 0}px); `;
    }
    if (fmt.textAlign) {
      css += `text-align: ${fmt.textAlign} !important; `;
    }
    if (fmt.fontSizeDelta) {
      css += `font-size: calc(100% + ${fmt.fontSizeDelta}px) !important; `;
    }
    if (fmt.isBold !== undefined) {
      css += `font-weight: ${fmt.isBold ? 'bold' : 'normal'} !important; `;
    }
    if (fmt.isItalic) {
      css += `font-style: italic !important; `;
    }
    if (fmt.isUnderline) {
      css += `text-decoration: underline !important; `;
    }
    if (fmt.color) {
      css += `color: ${fmt.color} !important; `;
    }
    if (fmt.bgColor) {
      css += `background-color: ${fmt.bgColor} !important; `;
    }
    if (fmt.letterSpacing) {
      css += `letter-spacing: ${fmt.letterSpacing}px !important; `;
    }
    if (fmt.lineHeight) {
      css += `line-height: ${fmt.lineHeight} !important; `;
    }
    return css;
  };

  // Safely sync header, syllabusData & timetableData when modal transitions to open
  const prevIsOpenRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setEditableSyllabus(syllabusData);
      if (timetableData) {
        setEditableTimetable(JSON.parse(JSON.stringify(timetableData)));
        // Auto default to landscape for timetable
        if (documentType === 'timetable') {
          setStyles((prev) => ({ ...prev, orientation: 'landscape' }));
        }
      }
      if (initialHeader) {
        setHeader((prev) => ({
          ...prev,
          ...initialHeader,
        }));
      }
      if (documentType === 'quiz') {
        setPreviewMode('print_preview');
      }
      // On small screens / mobile portrait, default to 'editor', on PC/landscape default to 'split'
      if (window.innerWidth < 1024 && window.innerHeight > window.innerWidth) {
        setViewLayout('editor');
      } else {
        setViewLayout('split');
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  // Adjust zoom for preview container automatically
  const previewContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!autoFitZoom || !previewContainerRef.current) return;

    const updateAutoFit = () => {
      if (!previewContainerRef.current) return;
      const containerWidth = previewContainerRef.current.clientWidth - 32;
      let docWidth = styles.orientation === 'landscape' ? 1040 : 820;
      if (styles.paperSize === 'A5') {
        docWidth = styles.orientation === 'landscape' ? 820 : 580;
      } else if (styles.paperSize === 'A3') {
        docWidth = styles.orientation === 'landscape' ? 1440 : 1040;
      }
      if (containerWidth > 100) {
        const calculatedScale = Math.min(110, Math.max(45, Math.floor((containerWidth / docWidth) * 100)));
        setZoomLevel(calculatedScale);
      }
    };

    updateAutoFit();
    const observer = new ResizeObserver(updateAutoFit);
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, [autoFitZoom, styles.orientation, styles.paperSize, viewLayout]);

  if (!isOpen) return null;

  const handleHeaderChange = (field: keyof PdfHeaderData, value: string) => {
    pushToHistory();
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  const handleStyleChange = <K extends keyof PdfStyleConfig>(field: K, value: PdfStyleConfig[K]) => {
    pushToHistory();
    setStyles((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field: keyof PdfContentToggles, value: boolean) => {
    pushToHistory();
    setToggles((prev) => ({ ...prev, [field]: value }));
  };

  // Timetable cell change handler
  const handleTimetableCellChange = (rowIndex: number, field: keyof TimetableRow, value: string) => {
    if (!editableTimetable || !editableTimetable.rows) return;
    pushToHistory();
    const updatedRows = [...editableTimetable.rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };
    setEditableTimetable({ ...editableTimetable, rows: updatedRows });
  };

  // Insert quick subject into selected or first cell
  const handleInsertQuickSubject = (subjectName: string) => {
    if (!editableTimetable || !editableTimetable.rows) return;
    if (selectedCell) {
      handleTimetableCellChange(selectedCell.rowIndex, selectedCell.day, subjectName);
      if (onShowToast) {
        onShowToast(`បានបញ្ចូល "${subjectName}" ក្នុងតារាងជោគជ័យ!`);
      }
    } else {
      if (onShowToast) {
        onShowToast('សូមចុចលើប្រអប់ក្នុងតារាងជាមុនសិន ដើម្បីជ្រើសមុខវិជ្ជាបញ្ចូល!');
      }
    }
  };

  // Add new timetable row
  const handleAddTimetableRow = () => {
    if (!editableTimetable) return;
    pushToHistory();
    const newRow: TimetableRow = {
      time: '10:00-10:40',
      duration: '៤០នាទី',
      mon: 'មុខវិជ្ជា...',
      tue: 'មុខវិជ្ជា...',
      wed: 'មុខវិជ្ជា...',
      thu: 'មុខវិជ្ជា...',
      fri: 'មុខវិជ្ជា...',
      sat: 'មុខវិជ្ជា...',
      type: 'normal',
    };
    setEditableTimetable({
      ...editableTimetable,
      rows: [...(editableTimetable.rows || []), newRow],
    });
    if (onShowToast) {
      onShowToast('បានបន្ថែមជួរម៉ោងសិក្សាថ្មីក្នុងកាលវិភាគ!');
    }
  };

  // Delete timetable row
  const handleDeleteTimetableRow = (index: number) => {
    if (!editableTimetable || !editableTimetable.rows) return;
    pushToHistory();
    setEditableTimetable({
      ...editableTimetable,
      rows: editableTimetable.rows.filter((_: any, idx: number) => idx !== index),
    });
    if (onShowToast) {
      onShowToast('បានលុបជួរម៉ោងសិក្សា');
    }
  };

  // Switch Shift Preset (Morning / Afternoon)
  const handleApplyShiftPreset = (shiftType: 'morning' | 'afternoon') => {
    pushToHistory();
    if (shiftType === 'morning') {
      setEditableTimetable((prev: any) => ({
        ...prev,
        shift: 'ព្រឹក',
        rows: morningShiftRows,
      }));
      if (onShowToast) {
        onShowToast('បានប្តូរទៅកាលវិភាគវេនព្រឹក (៧:០០ - ១១:០០) ជោគជ័យ!');
      }
    } else {
      setEditableTimetable((prev: any) => ({
        ...prev,
        shift: 'រសៀល',
        rows: afternoonShiftRows,
      }));
      if (onShowToast) {
        onShowToast('បានប្តូរទៅកាលវិភាគវេនរសៀល (១៣:០០ - ១៧:០០) ជោគជ័យ!');
      }
    }
  };

  // Preset 1-Click Themes Helper
  const applyThemePreset = (presetKey: 'moeys_blue' | 'printer_bw' | 'emerald_modern' | 'burgundy_grid' | 'charcoal') => {
    pushToHistory();
    if (presetKey === 'moeys_blue') {
      setStyles((prev) => ({
        ...prev,
        colorTheme: 'moeys_blue',
        borderStyle: 'solid',
        marginSize: 'normal',
        headingFontFamily: 'moul',
        bodyFontFamily: 'siemreap',
        fontFamily: 'siemreap',
      }));
    } else if (presetKey === 'printer_bw') {
      setStyles((prev) => ({
        ...prev,
        colorTheme: 'bw',
        borderStyle: 'minimal',
        marginSize: 'tight',
        headingFontFamily: 'kantumruy',
        bodyFontFamily: 'kantumruy',
        fontFamily: 'kantumruy',
      }));
    } else if (presetKey === 'emerald_modern') {
      setStyles((prev) => ({
        ...prev,
        colorTheme: 'emerald',
        borderStyle: 'double',
        marginSize: 'normal',
        headingFontFamily: 'kantumruy',
        bodyFontFamily: 'kantumruy',
        fontFamily: 'kantumruy',
      }));
    } else if (presetKey === 'burgundy_grid') {
      setStyles((prev) => ({
        ...prev,
        colorTheme: 'burgundy',
        borderStyle: 'grid',
        marginSize: 'normal',
        headingFontFamily: 'moul',
        bodyFontFamily: 'battambang',
        fontFamily: 'battambang',
      }));
    } else if (presetKey === 'charcoal') {
      setStyles((prev) => ({
        ...prev,
        colorTheme: 'charcoal',
        borderStyle: 'solid',
        marginSize: 'normal',
        headingFontFamily: 'kantumruy',
        bodyFontFamily: 'siemreap',
        fontFamily: 'siemreap',
      }));
    }
    if (onShowToast) {
      onShowToast('បានអនុវត្តគំរូទម្រង់ស្វ័យប្រវត្តជោគជ័យ! ⚡');
    }
  };

  // Quick Font Pairing Presets
  const applyFontComboPreset = (combo: 'moeys_standard' | 'kantumruy_modern' | 'moul_pali_classic' | 'battambang_hand') => {
    pushToHistory();
    if (combo === 'moeys_standard') {
      setStyles((prev) => ({ ...prev, headingFontFamily: 'moul', bodyFontFamily: 'siemreap', fontFamily: 'siemreap' }));
    } else if (combo === 'kantumruy_modern') {
      setStyles((prev) => ({ ...prev, headingFontFamily: 'kantumruy', bodyFontFamily: 'kantumruy', fontFamily: 'kantumruy' }));
    } else if (combo === 'moul_pali_classic') {
      setStyles((prev) => ({ ...prev, headingFontFamily: 'moul_pali', bodyFontFamily: 'khmer_os', fontFamily: 'khmer_os' }));
    } else if (combo === 'battambang_hand') {
      setStyles((prev) => ({ ...prev, headingFontFamily: 'battambang', bodyFontFamily: 'battambang', fontFamily: 'battambang' }));
    }
    if (onShowToast) {
      onShowToast('បានផ្លាស់ប្តូរបន្សំអក្សរជោគជ័យ!');
    }
  };

  // Quick Date & Location Generator ( Lunar / Solar / Combined )
  const insertLocationDate = (type: 'combined' | 'souriyatei' | 'chhankatei' = 'combined', loc: string = 'កំពង់ឆ្នាំង') => {
    pushToHistory();
    const now = new Date();
    let formatted = '';

    if (type === 'combined') {
      formatted = getKhmerCombinedDate(now, { location: loc, format: 'combined_multiline' });
    } else if (type === 'souriyatei') {
      formatted = getKhmerSouriyateiDate(now, loc);
    } else if (type === 'chhankatei') {
      formatted = getKhmerLunarDate(now).fullChhankatei;
    }

    setHeader((prev) => ({ ...prev, locationAndDate: formatted }));
    if (onShowToast) {
      onShowToast('បានប្តូរកាលបរិច្ឆេទចន្ទគតិ និងសូរិយគតិជោគជ័យ!');
    }
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(`pdf_custom_header_${documentType}`, JSON.stringify(header));
      localStorage.setItem(`pdf_custom_styles_${documentType}`, JSON.stringify(styles));
      if (onShowToast) {
        onShowToast('បានរក្សាទុកការកំណត់ទម្រង់ PDF ជាលំនាំដើមជោគជ័យ!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDefaults = () => {
    pushToHistory();
    setHeader({ ...DEFAULT_HEADER, ...initialHeader });
    const resetStyle = documentType === 'timetable'
      ? { ...DEFAULT_STYLES, orientation: 'landscape' as const }
      : DEFAULT_STYLES;
    setStyles(resetStyle);
    setToggles(DEFAULT_TOGGLES);
    if (timetableData) {
      setEditableTimetable(JSON.parse(JSON.stringify(timetableData)));
    }
    if (onShowToast) {
      onShowToast('បានកំណត់ទម្រង់ដើមឡើងវិញ!');
    }
  };

  // Theme color hex map
  const getThemeColors = () => {
    let primary = '#1e3a8a';
    let accent = '#1d4ed8';
    let border = '#2563eb';
    let headerBg = '#eff6ff';
    let tableBg = '#ffffff';
    let altRowBg = '#f8fafc';
    let breakBg = '#fef3c7';

    switch (styles.colorTheme) {
      case 'bw':
        primary = '#000000';
        accent = '#333333';
        border = '#000000';
        headerBg = '#f8fafc';
        tableBg = '#ffffff';
        altRowBg = '#f8fafc';
        breakBg = '#f1f5f9';
        break;
      case 'emerald':
        primary = '#065f46';
        accent = '#047857';
        border = '#059669';
        headerBg = '#ecfdf5';
        tableBg = '#ffffff';
        altRowBg = '#f0fdf4';
        breakBg = '#fef3c7';
        break;
      case 'burgundy':
        primary = '#831843';
        accent = '#9d174d';
        border = '#be185d';
        headerBg = '#fdf2f8';
        tableBg = '#ffffff';
        altRowBg = '#fff1f2';
        breakBg = '#fef3c7';
        break;
      case 'charcoal':
        primary = '#1e293b';
        accent = '#334155';
        border = '#475569';
        headerBg = '#f1f5f9';
        tableBg = '#ffffff';
        altRowBg = '#f8fafc';
        breakBg = '#fef3c7';
        break;
      case 'custom':
        if (styles.customPrimaryColor) {
          primary = styles.customPrimaryColor;
          accent = styles.customPrimaryColor;
          border = styles.customPrimaryColor;
          headerBg = styles.customPrimaryColor + '18';
          tableBg = '#ffffff';
          altRowBg = styles.customPrimaryColor + '0d';
          breakBg = '#fef3c7';
        }
        break;
      case 'moeys_blue':
      default:
        primary = '#1e3a8a';
        accent = '#1d4ed8';
        border = '#2563eb';
        headerBg = '#eff6ff';
        tableBg = '#ffffff';
        altRowBg = '#f8fafc';
        breakBg = '#fef3c7';
        break;
    }

    if (styles.tableStripingStyle === 'white') {
      altRowBg = '#ffffff';
    } else if (styles.tableStripingStyle === 'tinted') {
      altRowBg = headerBg;
    }

    return { primary, accent, border, headerBg, tableBg, altRowBg, breakBg };
  };

  const getFontFamilyCss = (fontKey: KhmerFontKey) => {
    switch (fontKey) {
      case 'moul':
        return '"Moul", "Khmer OS Muol", "Khmer OS Muol Light", serif';
      case 'moul_pali':
        return '"Moul Pali", "Khmer OS Muol Pali", "Moul", serif';
      case 'kantumruy':
        return '"Kantumruy Pro", "Khmer OS", sans-serif';
      case 'battambang':
        return '"Battambang", "Khmer OS Battambang", sans-serif';
      case 'khmer_os':
        return '"Khmer OS", "Khmer OS System", sans-serif';
      case 'content':
        return '"Content", "Khmer OS Content", sans-serif';
      case 'hanuman':
        return '"Hanuman", "Khmer OS", serif';
      case 'preahvihear':
        return '"Preahvihear", cursive, sans-serif';
      case 'suwannaphum':
        return '"Suwannaphum", serif';
      case 'dangrek':
        return '"Dangrek", cursive, sans-serif';
      case 'koulen':
        return '"Koulen", sans-serif';
      case 'bayon':
        return '"Bayon", cursive, sans-serif';
      case 'bokor':
        return '"Bokor", cursive, sans-serif';
      case 'noto':
        return '"Noto Sans Khmer", sans-serif';
      case 'angkor':
        return '"Angkor", cursive, serif';
      case 'chenla':
        return '"Chenla", cursive, sans-serif';
      case 'siemreap':
      default:
        return '"Siemreap", "Khmer OS Siemreap", "Kantumruy Pro", sans-serif';
    }
  };

  // Generate complete HTML Document for PDF rendering and printing
  const generatePdfHtml = () => {
    const theme = getThemeColors();
    const primaryColor = theme.primary;
    const accentColor = theme.accent;
    const borderColor = theme.border;
    const headerBgColor = theme.headerBg;
    const breakBgColor = theme.breakBg;

    const baseFontCss = getFontFamilyCss(styles.bodyFontFamily);
    const headingFontCss = getFontFamilyCss(styles.headingFontFamily);

    let fontSizeVal = '13.5px';
    if (styles.paperSize === 'A5') {
      fontSizeVal = '11.5px';
      if (styles.fontSize === 'small') fontSizeVal = '10px';
      if (styles.fontSize === 'medium') fontSizeVal = '12.5px';
      if (styles.fontSize === 'large') fontSizeVal = '14px';
    } else {
      if (styles.fontSize === 'small') fontSizeVal = '12px';
      if (styles.fontSize === 'medium') fontSizeVal = '15px';
      if (styles.fontSize === 'large') fontSizeVal = '16.5px';
    }

    let pageMargin = '15mm';
    if (styles.paperSize === 'A5') {
      pageMargin = styles.marginSize === 'tight' ? '6mm' : styles.marginSize === 'wide' ? '12mm' : '8mm';
    } else {
      if (styles.marginSize === 'tight') pageMargin = '10mm';
      if (styles.marginSize === 'wide') pageMargin = '20mm';
    }

    // Dynamic Table Design CSS
    let cellPaddingCss = 'padding: 6px 6px;';
    if (styles.tablePaddingSize === 'compact') {
      cellPaddingCss = 'padding: 3.5px 4.5px; font-size: 0.86em;';
    } else if (styles.tablePaddingSize === 'spacious') {
      cellPaddingCss = 'padding: 10px 10px; font-size: 0.9em;';
    }

    let headerRowCss = `background-color: ${headerBgColor}; color: ${primaryColor}; border: 1.5px solid ${borderColor};`;
    let headerThColor = `color: ${primaryColor};`;

    if (styles.tableHeaderStyle === 'filled') {
      headerRowCss = `background-color: ${primaryColor}; color: #ffffff; border: 1.5px solid ${primaryColor};`;
      headerThColor = `color: #ffffff;`;
    } else if (styles.tableHeaderStyle === 'gradient') {
      headerRowCss = `background: linear-gradient(135deg, ${primaryColor}, ${accentColor}); color: #ffffff; border: 1.5px solid ${primaryColor};`;
      headerThColor = `color: #ffffff;`;
    } else if (styles.tableHeaderStyle === 'outlined') {
      headerRowCss = `background-color: #ffffff; color: ${primaryColor}; border: 2px solid ${primaryColor};`;
      headerThColor = `color: ${primaryColor};`;
    } else if (styles.tableHeaderStyle === 'dark') {
      headerRowCss = `background-color: #0f172a; color: #ffffff; border: 1.5px solid #0f172a;`;
      headerThColor = `color: #ffffff;`;
    } else if (styles.tableHeaderStyle === 'minimal') {
      headerRowCss = `background-color: transparent; color: ${primaryColor}; border-bottom: 2px solid ${primaryColor};`;
      headerThColor = `color: ${primaryColor};`;
    }

    let cellBorderCss = 'border: 1px solid #cbd5e1;';
    if (styles.tableBorderStyle === 'horizontal') {
      cellBorderCss = 'border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-left: none; border-right: none;';
    } else if (styles.tableBorderStyle === 'minimal') {
      cellBorderCss = 'border-bottom: 1px solid #f1f5f9; border-top: none; border-left: none; border-right: none;';
    } else if (styles.tableBorderStyle === 'rounded') {
      cellBorderCss = 'border: 1px solid #e2e8f0;';
    }

    let contentHtml = '';

    if (documentType === 'quiz' && quizData) {
      const qz = quizData;
      
      // 1. Cover Page HTML (Exact illustrated textbook cover matching user reference image IMG_4225.jpeg with corrected spelling)
      let coverPageHtml = '';
      if (toggles.showCoverPage) {
        const coverImgSrc = (quizData.imageUrl && quizData.imageUrl.startsWith('data:'))
          ? quizData.imageUrl 
          : QUIZ_BOOK_COVER_BASE64;

        coverPageHtml = `
          <div style="page-break-after: always; width: 100%; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0; padding: 0; background: #ffffff; text-align: center;">
            <div style="width: 100%; max-width: ${styles.paperSize === 'A5' ? '100%' : '760px'}; position: relative; border-radius: 18px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.12); border: 1px solid #e2e8f0;">
              <img src="${coverImgSrc}" alt="ក្របសៀវភៅលំហាត់" style="width: 100%; height: auto; display: block; object-fit: contain;" />
              
              <!-- Student / Teacher Information printed inside the bottom-right form card -->
              <div style="position: absolute; bottom: 3.8%; right: 4.8%; width: 44.5%; text-align: left; font-size: ${styles.paperSize === 'A5' ? '10.5px' : '13.5px'}; font-weight: bold; color: #064e3b; line-height: 2.15; font-family: ${baseFontCss}; padding-left: 6px; letter-spacing: 0.2px;">
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${header.teacherName ? header.teacherName : '................................................'}</div>
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${header.gradeLevel ? header.gradeLevel : (qz.grade || 'ថ្នាក់ទី ៦')}</div>
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${qz.title ? qz.title.slice(0, 32) : 'មេរៀនទី១ (ចំនួន)'}</div>
              </div>
            </div>
          </div>
        `;
      }

      // 2. Main Questions Body
      const questionsHtml = `
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid ${primaryColor}; padding-bottom: 10px; margin-bottom: 25px;">
            <div>
              <h2 style="font-family: ${headingFontCss}; color: ${primaryColor}; margin: 0; font-size: 1.6em;">${qz.title}</h2>
              <div style="font-size: 1em; color: #475569; margin-top: 5px;">
                <strong>មុខវិជ្ជា៖</strong> ${qz.subject} | <strong>កម្រិតថ្នាក់៖</strong> ${qz.grade}
              </div>
            </div>
            <div style="text-align: right; font-size: 0.9em; color: #64748b;">
              <div style="font-weight: bold; color: ${accentColor};">ថិរវេលា៖ ${qz.examDuration || '៤៥ នាទី'}</div>
              <div>ចំនួនសំណួរ៖ ${qz.questions?.length || 0}</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 30px;">
            ${qz.questions?.map((q, idx) => {
              let qContent = '';
              if (q.type === 'qcm' || q.type === 'multi_select') {
                qContent = `
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px; margin-left: 25px;">
                    ${q.options?.map((opt, oIdx) => `
                      <div style="display: flex; align-items: center; gap: 8px; padding: 6px 10px; border: 1px solid #f1f5f9; border-radius: 8px; background-color: #f8fafc;">
                        <span style="width: 20px; height: 20px; border: 2px solid ${primaryColor}40; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.7em; font-weight: bold; color: ${primaryColor};">${String.fromCharCode(65 + oIdx)}</span>
                        <span style="font-size: 0.95em;">${opt.text}</span>
                      </div>
                    `).join('')}
                  </div>
                `;
              } else if (q.type === 'true_false') {
                qContent = `
                  <div style="display: flex; gap: 50px; margin-top: 12px; margin-left: 25px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="width: 20px; height: 20px; border: 2px solid ${primaryColor}40; border-radius: 50%; display: inline-block;"></span>
                      <span style="font-weight: bold; color: #10b981;">ត្រូវ (True)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="width: 20px; height: 20px; border: 2px solid ${primaryColor}40; border-radius: 50%; display: inline-block;"></span>
                      <span style="font-weight: bold; color: #ef4444;">ខុស (False)</span>
                    </div>
                  </div>
                `;
              } else if (q.type === 'matching') {
                qContent = `
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 15px; margin-left: 25px;">
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                      ${q.matchingPairs?.map((p, pIdx) => `<div style="padding: 6px 10px; background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">${pIdx + 1}. ${p.left}</div>`).join('')}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                      ${q.matchingPairs?.map((p, pIdx) => `<div style="padding: 6px 10px; background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">${String.fromCharCode(65 + pIdx)}. ${p.right}</div>`).join('')}
                    </div>
                  </div>
                `;
              } else if (q.type === 'fill_blank') {
                qContent = `
                  <div style="margin-top: 12px; margin-left: 25px; color: #64748b; font-style: italic; font-size: 1em;">
                    (ចម្លើយ៖ ............................................................................................................)
                  </div>
                `;
              } else if (q.type === 'short_answer' || q.type === 'essay') {
                qContent = `
                  <div style="margin-top: 15px; border-bottom: 1.5px dotted #cbd5e1; height: 35px; margin-left: 25px;"></div>
                  <div style="margin-top: 10px; border-bottom: 1.5px dotted #cbd5e1; height: 35px; margin-left: 25px;"></div>
                  ${q.type === 'essay' ? `
                    <div style="margin-top: 10px; border-bottom: 1.5px dotted #cbd5e1; height: 35px; margin-left: 25px;"></div>
                    <div style="margin-top: 10px; border-bottom: 1.5px dotted #cbd5e1; height: 35px; margin-left: 25px;"></div>
                  ` : ''}
                `;
              } else if (q.type === 'pisa') {
                qContent = `
                  <div style="margin-top: 12px; padding: 15px; background-color: #f1f5f9; border-left: 4px solid ${primaryColor}; border-radius: 0 10px 10px 0; font-size: 0.95em; line-height: 1.7; margin-left: 25px;">
                    ${q.pisaContext}
                  </div>
                  <div style="margin-top: 15px; margin-left: 25px; display: flex; flex-direction: column; gap: 15px;">
                    ${q.pisaParts?.map((part, pIdx) => `
                      <div style="padding: 10px; background-color: white; border: 1px dashed #e2e8f0; border-radius: 8px;">
                        <strong style="color: ${primaryColor};">សំណួរទី ${idx + 1}.${pIdx + 1}៖</strong> ${part.prompt}
                        <div style="margin-top: 10px; border-bottom: 1px dotted #cbd5e1; height: 30px;"></div>
                      </div>
                    `).join('')}
                  </div>
                `;
              } else if (q.type === 'reading_comprehension') {
                qContent = `
                  <div style="margin-top: 12px; padding: 15px; border: 1.5px solid ${primaryColor}30; border-radius: 12px; background-color: #fff; margin-left: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-family: ${headingFontCss}; font-weight: bold; text-align: center; margin-bottom: 12px; color: ${primaryColor}; text-decoration: underline;">${q.passageTitle}</div>
                    <div style="font-size: 0.95em; line-height: 1.8; white-space: pre-line; color: #334155;">${q.passageText}</div>
                  </div>
                  <div style="margin-top: 20px; margin-left: 25px; display: flex; flex-direction: column; gap: 15px;">
                    ${q.passageQuestions?.map((pq, pqIdx) => `
                      <div style="padding: 10px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9;">
                        <strong style="color: ${primaryColor};">សំណួរទី ${idx + 1}.${pqIdx + 1}៖</strong> ${pq.question}
                        <div style="margin-top: 10px; border-bottom: 1px dotted #cbd5e1; height: 30px;"></div>
                      </div>
                    `).join('')}
                  </div>
                `;
              }

              return `
                <div style="margin-bottom: 5px; page-break-inside: avoid;">
                  <div style="display: flex; gap: 10px;">
                    <div style="width: 28px; height: 28px; background-color: ${primaryColor}; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${idx + 1}</div>
                    <div style="flex: 1;">
                      <div style="font-weight: bold; font-size: 1.05em; line-height: 1.5; color: #1e293b;">${q.question}</div>
                      ${qContent}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      // 3. Answer Key HTML
      let answerKeyHtml = '';
      if (toggles.showAnswerKey) {
        answerKeyHtml = `
          <div style="page-break-before: always; border-top: 8px double ${primaryColor}; padding-top: 40px; margin-top: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-family: ${headingFontCss}; font-size: ${styles.paperSize === 'A5' ? '1.5em' : '2em'}; color: ${primaryColor}; text-decoration: underline; text-underline-offset: 8px;">គន្លឹះចម្លើយ (Answer Key)</div>
              <div style="margin-top: 10px; color: #64748b; font-weight: bold;">វិញ្ញាសា៖ ${qz.title}</div>
            </div>
            <div style="display: grid; grid-template-columns: ${styles.paperSize === 'A5' && styles.orientation === 'portrait' ? '1fr' : 'repeat(2, 1fr)'}; gap: ${styles.paperSize === 'A5' ? '12px' : '25px'};">
              ${qz.questions?.map((q, idx) => {
                let answerText = q.correctAnswer || '';
                if (!answerText && q.options) {
                  const correctOpt = q.options.find(o => o.isCorrect);
                  if (correctOpt) {
                    answerText = `${String.fromCharCode(65 + q.options.indexOf(correctOpt))}. ${correctOpt.text}`;
                  }
                }
                if (!answerText && q.trueFalseAnswer !== undefined) {
                  answerText = q.trueFalseAnswer ? 'ត្រូវ (True)' : 'ខុស (False)';
                }
                return `
                  <div style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; gap: 12px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div style="width: 32px; height: 32px; background-color: ${primaryColor}15; color: ${primaryColor}; border: 1.5px solid ${primaryColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9em; flex-shrink: 0;">${idx + 1}</div>
                    <div style="flex: 1;">
                      <div style="font-weight: bold; font-size: 0.9em; color: #475569; margin-bottom: 4px; line-height: 1.4;">${q.question}</div>
                      <div style="color: ${accentColor}; font-weight: 900; font-size: 1.05em; background-color: ${accentColor}08; padding: 4px 8px; border-radius: 6px; display: inline-block;">
                        ចម្លើយ៖ ${answerText || '................'}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <div style="margin-top: 50px; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 20px; color: #94a3b8; font-size: 0.8em;">
              អរគុណសម្រាប់ការខិតខំប្រឹងប្រែង! សំណាងល្អក្នុងការសិក្សា។
            </div>
          </div>
        `;
      }

      contentHtml = coverPageHtml + questionsHtml + answerKeyHtml;
    } else if (documentType === 'timetable') {
      const activeTimetable = editableTimetable || timetableData;
      const rows = activeTimetable?.rows || [];
      const notes = activeTimetable?.notes || [];

      contentHtml = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.88em; text-align: center; margin-bottom: 14px;">
          <thead>
            <tr style="${headerRowCss} font-family: ${headingFontCss};">
              <th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} width: 11%;">ម៉ោង / វេន</th>
              <th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} width: 9%;">រយៈពេល</th>
              <th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} width: 13.3%;">ថ្ងៃចន្ទ</th>
              <th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} width: 13.3%;">ថ្ងៃអង្គារ</th>
              <th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} width: 13.3%;">ថ្ងៃពុធ</th>
              <th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} width: 13.3%;">ថ្ងៃព្រហស្បតិ៍</th>
              <th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} width: 13.3%;">ថ្ងៃសុក្រ</th>
              <th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} width: 13.3%;">ថ្ងៃសៅរ៍</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map((r: TimetableRow, idx: number) => {
                const isBreak = r.type === 'break' || r.mon === 'ចេញលេង' || r.tue === 'ចេញលេង';
                const isFlag = r.type === 'flag' || r.mon === 'គោរពទង់ជាតិ';
                let rowBg = idx % 2 === 1 ? theme.altRowBg : '#ffffff';
                if (isBreak) rowBg = breakBgColor;
                if (isFlag) rowBg = headerBgColor;

                return `
                  <tr style="background-color: ${rowBg};">
                    <td style="${cellPaddingCss} ${cellBorderCss} font-weight: bold; color: ${primaryColor}; font-size: 0.9em;">
                      ${r.time || '-'}
                    </td>
                    <td style="${cellPaddingCss} ${cellBorderCss} font-size: 0.82em; color: #475569;">
                      ${r.duration || '-'}
                    </td>
                    <td style="${cellPaddingCss} ${cellBorderCss} ${isBreak || isFlag ? 'font-weight: bold;' : ''}">
                      ${r.mon || '-'}
                    </td>
                    <td style="${cellPaddingCss} ${cellBorderCss} ${isBreak || isFlag ? 'font-weight: bold;' : ''}">
                      ${r.tue || '-'}
                    </td>
                    <td style="${cellPaddingCss} ${cellBorderCss} ${isBreak || isFlag ? 'font-weight: bold;' : ''}">
                      ${r.wed || '-'}
                    </td>
                    <td style="${cellPaddingCss} ${cellBorderCss} ${isBreak || isFlag ? 'font-weight: bold;' : ''}">
                      ${r.thu || '-'}
                    </td>
                    <td style="${cellPaddingCss} ${cellBorderCss} ${isBreak || isFlag ? 'font-weight: bold;' : ''}">
                      ${r.fri || '-'}
                    </td>
                    <td style="${cellPaddingCss} ${cellBorderCss} ${isBreak || isFlag ? 'font-weight: bold;' : ''}">
                      ${r.sat || '-'}
                    </td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>

        ${
          toggles.showNotesSection && notes && notes.length > 0
            ? `
          <div style="margin-top: 10px; margin-bottom: 14px; background-color: #f8fafc; padding: 8px 14px; border-left: 3.5px solid ${primaryColor}; border-radius: 4px; font-size: 0.82em; color: #334155;">
            <strong style="color: ${primaryColor}; font-family: ${headingFontCss};">📌 សម្គាល់ និងការណែនាំ៖</strong>
            <ul style="margin: 4px 0 0 16px; padding: 0; line-height: 1.5;">
              ${notes.map((n: string) => `<li>${n}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }
      `;
    } else if (documentType === 'syllabus' && editableSyllabus && editableSyllabus.length > 0) {
      contentHtml = editableSyllabus
        .map(
          (s) => `
        <div style="margin-bottom: 24px; page-break-inside: avoid;">
          <div style="background-color: ${headerBgColor}; padding: 8px 12px; border-radius: 6px; margin-bottom: 8px; border: 1px solid ${borderColor};">
            <h2 style="font-family: ${headingFontCss}; font-size: 1.15em; color: ${primaryColor}; margin: 0;">
              មុខវិជ្ជា៖ ${s.name} ${s.grade ? `(${s.grade})` : ''}
            </h2>
            ${s.description ? `<p style="font-size: 0.85em; color: #475569; margin: 2px 0 0 0;">${s.description}</p>` : ''}
          </div>

          ${
            toggles.showCompetencies && s.coreCompetencies && s.coreCompetencies.length > 0
              ? `
            <div style="margin-bottom: 12px; background-color: #f8fafc; padding: 8px 12px; border-left: 3px solid ${primaryColor}; font-size: 0.88em;">
              <strong style="color: ${primaryColor}; font-family: ${headingFontCss};">សមត្ថភាពគន្លឹះត្រូវសម្រេច៖</strong>
              <ul style="margin: 4px 0 0 16px; padding: 0;">
                ${s.coreCompetencies.map((c: string) => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          `
              : ''
          }

          ${s.trimesters
            ?.map(
              (tri: any) => `
            <div style="margin-top: 14px;">
              <div style="font-weight: bold; font-size: 0.95em; color: ${accentColor}; margin-bottom: 6px; font-family: ${headingFontCss};">
                📌 ${tri.title} ${tri.period ? `(${tri.period})` : ''}
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 0.88em;">
                <thead>
                  <tr style="${headerRowCss}">
                    ${toggles.showMonthColumn ? `<th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} text-align: left; width: 10%;">ខែ</th>` : ''}
                    ${toggles.showWeekColumn !== false ? `<th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} text-align: center; width: 12%;">សប្តាហ៍ទី</th>` : ''}
                    ${!toggles.showMonthColumn && toggles.showWeekColumn === false ? `<th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} text-align: left; width: 14%;">មេរៀន/ជំពូក</th>` : ''}
                    <th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} text-align: left; width: 28%;">ខ្លឹមសារមេរៀន (សៀវភៅសិក្សាគោល)</th>
                    ${toggles.showHoursColumn ? `<th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} text-align: center; width: 8%;">ម៉ោង</th>` : ''}
                    ${toggles.showObjectiveColumn ? `<th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} text-align: left; width: 30%;">លទ្ធផលសិក្សា (កម្មវិធីសិក្សាមេតូឌិក)</th>` : ''}
                    ${toggles.showBookPages ? `<th style="${cellPaddingCss} ${cellBorderCss} ${headerThColor} text-align: center; width: 12%;">ទំព័រ (ស.ស/ស.គ)</th>` : ''}
                  </tr>
                </thead>
                <tbody>
                  ${tri.chapters
                    ?.map(
                      (ch: any, rIdx: number) => {
                        const rowBg = rIdx % 2 === 1 ? theme.altRowBg : '#ffffff';
                        return `
                        <tr style="background-color: ${rowBg};">
                          ${
                            toggles.showMonthColumn
                              ? `<td style="${cellPaddingCss} ${cellBorderCss} font-weight: bold; color: ${primaryColor};">
                                  ${ch.month || '-'}
                                  <div style="font-size: 0.8em; color: #64748b; font-weight: normal;">${ch.chapterNo}</div>
                                </td>`
                              : ''
                          }
                          ${
                            toggles.showWeekColumn !== false
                              ? `<td style="${cellPaddingCss} ${cellBorderCss} text-align: center; font-weight: bold; color: ${accentColor};">
                                  ${ch.weekNo || '-'}
                                </td>`
                              : ''
                          }
                          ${
                            !toggles.showMonthColumn && toggles.showWeekColumn === false
                              ? `<td style="${cellPaddingCss} ${cellBorderCss} font-weight: bold;">
                                  ${ch.chapterNo}
                                </td>`
                              : ''
                          }
                          <td style="${cellPaddingCss} ${cellBorderCss}">
                            <strong>${ch.title}</strong>
                            ${
                              toggles.showTopicsList && ch.topics && ch.topics.length > 0
                                ? `<ul style="margin: 4px 0 0 14px; padding: 0; font-size: 0.85em; color: #444;">
                                    ${ch.topics.map((t: string) => `<li>${t}</li>`).join('')}
                                  </ul>`
                                : ''
                            }
                          </td>
                          ${toggles.showHoursColumn ? `<td style="${cellPaddingCss} ${cellBorderCss} text-align: center; font-weight: bold;">${ch.hours || '-'}</td>` : ''}
                          ${toggles.showObjectiveColumn ? `<td style="${cellPaddingCss} ${cellBorderCss} color: #222;">${ch.objective || '-'}</td>` : ''}
                          ${
                            toggles.showBookPages
                              ? `<td style="${cellPaddingCss} ${cellBorderCss} text-align: center; font-size: 0.82em;">
                                  ${ch.studentBookPages ? `ស.ស: ${ch.studentBookPages}<br/>` : ''}
                                  ${ch.teacherBookPages ? `ស.គ: ${ch.teacherBookPages}` : ''}
                                  ${!ch.studentBookPages && !ch.teacherBookPages ? '-' : ''}
                                </td>`
                              : ''
                          }
                        </tr>
                      `;
                      }
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          `
            )
            .join('')}
        </div>
      `
        )
        .join('');
    } else if (customTableHtml) {
      contentHtml = customTableHtml;
    } else {
      contentHtml = `
        <div style="padding: 30px; text-align: center; color: #64748b;">
          <p style="font-size: 1.1em; font-weight: bold;">មិនមានទិន្នន័យសម្រាប់បង្ហាញក្នុងទម្រង់ PDF ទេ។</p>
        </div>
      `;
    }

    const activeThemeKey = getActiveCustomBackgroundTheme();
    const docBackgroundCss = styles.colorTheme === 'bw' ? 'background-color: #ffffff !important;' : getThemeBackgroundCss(activeThemeKey);

    return `
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>${header.docTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Angkor&family=Battambang:wght@400;700&family=Bayon&family=Bokor&family=Chenla&family=Content:wght@400;700&family=Dangrek&family=Hanuman:wght@400;700&family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Koulen&family=Moul&family=Noto+Sans+Khmer:wght@400;600;700&family=Preahvihear&family=Siemreap&family=Suwannaphum:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: ${styles.paperSize} ${styles.orientation};
            margin: ${pageMargin};
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: ${baseFontCss};
            font-size: ${fontSizeVal};
            line-height: 1.5;
            color: #1e293b;
            margin: 0;
            padding: 0;
            ${docBackgroundCss}
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .moul-title {
            font-family: ${getFontFamilyCss('moul')};
          }
          .pdf-header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
          }
          .pdf-header-table td {
            vertical-align: top;
            padding: 0;
          }
          .signatures-table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
            page-break-inside: avoid;
          }
          .signatures-table td {
            vertical-align: top;
            width: 50%;
            text-align: center;
          }
          .stamp-box {
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            padding: 12px;
            width: 130px;
            margin: 10px auto;
            color: #94a3b8;
            font-size: 0.8em;
          }
          .pdf-main-content table {
            width: 100%;
            border-collapse: collapse;
            font-size: ${fontSizeVal};
            margin-bottom: 12px;
          }
          .pdf-main-content table thead tr,
          .pdf-main-content table tr:first-child:has(th) {
            ${headerRowCss}
            font-family: ${headingFontCss};
          }
          .pdf-main-content table th {
            ${cellPaddingCss}
            ${cellBorderCss}
            ${headerThColor}
          }
          .pdf-main-content table td {
            ${cellPaddingCss}
            ${cellBorderCss}
          }
          .pdf-main-content table tbody tr:nth-child(even) {
            background-color: ${theme.altRowBg};
          }
          .pdf-stat-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: ${styles.colorTheme === 'bw' ? '#f8fafc' : `${primaryColor}0d`};
            border: 1px solid ${styles.colorTheme === 'bw' ? '#cbd5e1' : `${primaryColor}35`};
            padding: 6px 12px;
            border-radius: 6px;
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 0.9em;
          }
          @media print {
            .no-print { display: none !important; }
            ${styles.colorTheme === 'bw' ? 'body { background-color: #fff !important; }' : ''}
          }
        </style>
      </head>
      <body>
        ${styles.showHeaderTopBar !== false ? `<div style="height: 4px; background: linear-gradient(90deg, ${primaryColor}, ${accentColor}, ${primaryColor}); border-radius: 2px; margin-bottom: 10px;"></div>` : ''}
        ${styles.watermarkText ? `<div style="position: fixed; top: 40%; left: 10%; transform: rotate(-35deg); font-size: 60px; color: rgba(200,200,200,0.18); font-weight: bold; pointer-events: none; z-index: 9999;">${styles.watermarkText}</div>` : ''}
        
        <!-- MOVABLE FLOATING STICKERS & STAMPS (ABS POSITIONED) -->
        ${floatingStickers.map((stk) => `
          <div style="position: absolute; left: ${stk.x}px; top: ${stk.y}px; font-size: ${stk.fontSize}px; color: ${stk.color}; background-color: ${stk.bgColor}; ${stk.borderColor ? `border: 1.5px ${stk.isStampStyle ? 'dashed' : 'solid'} ${stk.borderColor};` : ''} padding: ${stk.isStampStyle ? '6px 14px' : '4px 10px'}; border-radius: ${stk.isStampStyle ? '8px' : '4px'}; transform: rotate(${stk.rotation || 0}deg); font-family: ${getFontFamilyCss(stk.fontFamily || 'moul')}; font-weight: ${stk.isBold ? 'bold' : 'normal'}; font-style: ${stk.isItalic ? 'italic' : 'normal'}; text-decoration: ${stk.isUnderline ? 'underline' : 'none'}; z-index: 999; box-shadow: ${stk.isStampStyle ? '0 2px 5px rgba(0,0,0,0.1)' : 'none'};">
            ${stk.text}
          </div>
        `).join('')}

        ${
          styles.showKingdomHeader
            ? (styles.headerLayout === 'side_by_side'
                ? `
          <table class="pdf-header-table" style="width: 100%; border-collapse: collapse; margin-bottom: 12px; ${getSectionCssString('kingdom_header')}">
            <tr>
              <td style="width: 55%; text-align: left; vertical-align: top; padding-top: 10px; ${getSectionCssString('school_info')}">
                <div style="font-size: 0.92em; font-weight: bold; color: #334155;">${header.officeInfo}</div>
                <div class="moul-title" style="font-size: 0.98em; margin-top: 2px; color: ${primaryColor};">${header.departmentInfo}</div>
                <div style="font-size: 0.9em; color: #475569; margin-top: 2px; font-weight: bold;">${header.schoolName}</div>
              </td>
              <td style="width: 45%; text-align: center; vertical-align: top; ${getSectionCssString('kingdom_header')}">
                <div class="moul-title" style="font-size: 1.05em; color: ${primaryColor};">${header.kingdomTitle || 'ព្រះរាជាណាចក្រកម្ពុជា'}</div>
                <div class="moul-title" style="font-size: 0.95em; color: ${primaryColor}; margin-top: 2px;">${header.kingdomMotto || 'ជាតិ សាសនា ព្រះមហាក្សត្រ'}</div>
                <div style="font-size: 0.85em; letter-spacing: 2px; margin-top: 2px; font-weight: bold; color: ${primaryColor};">${header.headerEmblemText || '— ༺ ៚ ༻ —'}</div>
              </td>
            </tr>
          </table>
        `
                : `
          <!-- Top Centered Kingdom Header (ព្រះរាជាណាចក្រកម្ពុជា លើគេបង្អស់) -->
          <div style="text-align: center; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; ${getSectionCssString('kingdom_header')}">
            <div class="moul-title" style="font-size: 1.1em; color: ${primaryColor}; letter-spacing: 1px;">${header.kingdomTitle || 'ព្រះរាជាណាចក្រកម្ពុជា'}</div>
            <div class="moul-title" style="font-size: 0.95em; color: ${primaryColor}; margin-top: 3px;">${header.kingdomMotto || 'ជាតិ សាសនា ព្រះមហាក្សត្រ'}</div>
            <div style="font-size: 0.85em; letter-spacing: 2px; margin-top: 2px; font-weight: bold; color: ${primaryColor};">${header.headerEmblemText || '— ༺ ៚ ༻ —'}</div>
          </div>

          <!-- Ministry, Department, School & Teacher Info -->
          <table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
            <tr>
              <td style="width: 60%; text-align: left; vertical-align: top; ${getSectionCssString('school_info')}">
                <div style="font-size: 0.92em; font-weight: bold; color: #334155;">${header.officeInfo}</div>
                <div class="moul-title" style="font-size: 0.95em; margin-top: 2px; color: ${primaryColor};">${header.departmentInfo}</div>
                <div style="font-size: 0.9em; color: #475569; margin-top: 2px; font-weight: bold;">${header.schoolName}</div>
              </td>
              <td style="width: 40%; text-align: right; vertical-align: top; font-size: 0.85em; color: #475569; ${getSectionCssString('teacher_info')}">
                <div style="font-weight: bold; color: #1e293b; font-size: 0.95em;">${header.teacherName ? `គ្រូបង្រៀន៖ ${header.teacherName}` : ''}</div>
                <div style="margin-top: 2px;">កម្រិតថ្នាក់៖ <strong>${header.gradeLevel}</strong></div>
                <div style="margin-top: 2px;">ឆ្នាំសិក្សា៖ <strong>${header.academicYear}</strong></div>
              </td>
            </tr>
          </table>
        `)
            : `
          <table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
            <tr>
              <td style="width: 60%; text-align: left; vertical-align: top; ${getSectionCssString('school_info')}">
                <div style="font-size: 0.92em; font-weight: bold; color: #334155;">${header.officeInfo}</div>
                <div class="moul-title" style="font-size: 0.95em; margin-top: 2px; color: ${primaryColor};">${header.departmentInfo}</div>
                <div style="font-size: 0.9em; color: #475569; margin-top: 2px; font-weight: bold;">${header.schoolName}</div>
              </td>
              <td style="width: 40%; text-align: right; vertical-align: top; font-size: 0.85em; color: #475569; ${getSectionCssString('teacher_info')}">
                <div style="font-weight: bold; color: #1e293b; font-size: 0.95em;">${header.teacherName ? `គ្រូបង្រៀន៖ ${header.teacherName}` : ''}</div>
                <div style="margin-top: 2px;">កម្រិតថ្នាក់៖ <strong>${header.gradeLevel}</strong></div>
                <div style="margin-top: 2px;">ឆ្នាំសិក្សា៖ <strong>${header.academicYear}</strong></div>
              </td>
            </tr>
          </table>
        `
        }

        <!-- DOCUMENT TITLE & SUBTITLE SECTION -->
        ${(header.docTitle || header.docSubtitle) ? `
        <div style="text-align: center; margin: 10px 0 14px 0; border-bottom: 1.5px solid ${primaryColor}; padding-bottom: 6px; ${getSectionCssString('doc_title')}">
          ${header.docTitle ? `<h1 class="moul-title" style="font-size: 1.25em; margin: 0 0 4px 0; color: ${primaryColor};">${header.docTitle}</h1>` : ''}
          ${header.docSubtitle ? `<div style="font-size: 0.9em; font-weight: bold; color: #475569; margin-top: 2px; ${getSectionCssString('doc_subtitle')}">${header.docSubtitle}</div>` : ''}
          ${!header.docSubtitle && !customTableHtml && (header.teacherName || header.gradeLevel || header.academicYear) ? `
          <div style="font-size: 0.85em; color: #64748b; margin-top: 4px;">
            ${header.teacherName ? `គ្រូបង្រៀន៖ <strong>${header.teacherName}</strong> | ` : ''}កម្រិត៖ <strong>${header.gradeLevel}</strong> | ឆ្នាំសិក្សា៖ <strong>${header.academicYear}</strong>
          </div>
          ` : ''}
        </div>
        ` : ''}

        <!-- MAIN BODY CONTENT -->
        <div class="pdf-main-content" style="${getSectionCssString('main_content')}">
          ${contentHtml}
        </div>

        <!-- SIGNATURES SECTION (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) -->
        ${
          styles.showSignatures
            ? (styles.signaturesLayout === 'side_by_side'
                ? `
          <table class="signatures-table">
            <tr>
              <td style="${getSectionCssString('left_signature')}">
                <div style="font-weight: bold; font-size: 0.92em; white-space: pre-line;">${header.leftSignatureTitle}</div>
                ${styles.showStampBox ? `<div class="stamp-box">ទីតាំងប្រោះត្រា</div>` : '<div style="height: 55px;"></div>'}
                <div style="font-weight: bold; font-size: 0.95em;">${header.leftSignatureName || '...........................................'}</div>
              </td>
              <td style="${getSectionCssString('right_signature')}">
                <div style="font-size: 0.88em; color: #475569; margin-bottom: 4px; white-space: pre-line; ${getSectionCssString('location_date')}">${header.locationAndDate}</div>
                <div style="font-weight: bold; font-size: 0.92em;">${header.rightSignatureTitle}</div>
                <div style="height: 55px;"></div>
                <div style="font-weight: bold; font-size: 0.95em;">${header.rightSignatureName}</div>
              </td>
            </tr>
          </table>
          `
                : `
          <div style="margin-top: 22px; page-break-inside: avoid;">
            <!-- ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 14px;">
              <div style="text-align: center; min-width: 250px; ${getSectionCssString('right_signature')}">
                <div style="font-size: 0.88em; color: #475569; margin-bottom: 4px; white-space: pre-line; ${getSectionCssString('location_date')}">${header.locationAndDate}</div>
                <div style="font-weight: bold; font-size: 0.92em;">${header.rightSignatureTitle}</div>
                <div style="height: 48px;"></div>
                <div style="font-weight: bold; font-size: 0.95em;">${header.rightSignatureName}</div>
              </div>
            </div>
            <!-- ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា -->
            <div style="display: flex; justify-content: flex-start;">
              <div style="text-align: center; min-width: 230px; ${getSectionCssString('left_signature')}">
                <div style="font-weight: bold; font-size: 0.92em; white-space: pre-line;">${header.leftSignatureTitle}</div>
                ${styles.showStampBox ? `<div class="stamp-box" style="margin: 8px auto;">ទីតាំងប្រោះត្រា</div>` : '<div style="height: 48px;"></div>'}
                <div style="font-weight: bold; font-size: 0.95em;">${header.leftSignatureName || '...........................................'}</div>
              </div>
            </div>
          </div>
          `
              )
            : ''
        }

        ${
          header.footerNote
            ? `
          <div style="margin-top: 20px; padding-top: 8px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.78em; color: #94a3b8; ${getSectionCssString('notes_section')}">
            ${header.footerNote}
          </div>
        `
            : ''
        }
      </body>
      </html>
    `;
  };

  // Trigger Print / Download to PDF
  const handlePrintPdf = () => {
    const htmlString = generatePdfHtml();
    const printWindow = window.open('', '_blank', 'width=1000,height=1100');
    if (!printWindow) {
      alert('សូមអនុញ្ញាត Popup នៅក្នុងកម្មវិធីជ្រាវជ្រោល (Browser) ដើម្បីបើកផ្ទាំង PDF!');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(htmlString);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);

    if (onShowToast) {
      onShowToast('បានបើកផ្ទាំងបោះពុម្ព និងទាញយកជា PDF រួចរាល់!');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-1 sm:p-3 md:p-4'} bg-slate-950/80 backdrop-blur-md overflow-hidden transition-all duration-200`}>
      <div className={`bg-white dark:bg-slate-900 ${isFullscreen ? 'rounded-none w-screen h-screen' : 'rounded-2xl sm:rounded-3xl w-full max-w-7xl h-[98vh] sm:h-[95vh]'} flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden`}>
        
        {/* TOP HEADER BAR (Ultra responsive & clean for PC / Mobile Landscape) */}
        <div className="px-3 sm:px-5 py-2 sm:py-3 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800 gap-2">
          
          {/* Left Title & Status */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="font-extrabold text-xs sm:text-base text-white truncate max-w-[200px] sm:max-w-md">{title}</h2>
                <span className="hidden md:inline-block text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 font-bold px-2 py-0.5 rounded-md shrink-0">
                  {documentType === 'timetable' ? 'A4 Landscape PDF Editor' : 'PDF Editor & Live Preview'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                កែសម្រួលព័ត៌មានក្បាលសំបុត្រ ស្ទីល ទំហំក្រដាស ហត្ថលេខា និងជម្រើសបង្ហាញ
              </p>
            </div>
          </div>

          {/* Center / Right Mode Switcher & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* View Layout Switcher (Split / Editor / Preview) */}
            <div className="bg-slate-800/90 p-1 rounded-xl flex items-center border border-slate-700">
              <button
                type="button"
                onClick={() => setViewLayout('split')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewLayout === 'split'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ពុះផ្ទាំងទន្ទឹមគ្នា (Split Side-by-Side)"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ទន្ទឹមគ្នា</span>
              </button>

              <button
                type="button"
                onClick={() => setViewLayout('editor')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewLayout === 'editor'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ផ្ទាំងកែសម្រួលទិន្នន័យ (Full Editor)"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">កែសម្រួល</span>
              </button>

              <button
                type="button"
                onClick={() => setViewLayout('preview')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewLayout === 'preview'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="មើលគំរូ PDF ពេញអេក្រង់ (Full Preview)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">មើលគំរូ</span>
              </button>
            </div>

            {/* Undo button */}
            {historyStack.length > 0 && (
              <button
                onClick={handleUndo}
                className="hidden lg:flex px-2.5 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-bold transition items-center gap-1 border border-purple-800/60"
                title="ត្រឡប់ក្រោយការកែប្រែមុននេះ (Undo)"
              >
                <Undo2 className="w-3.5 h-3.5 text-purple-300" />
                <span>Undo ({historyStack.length})</span>
              </button>
            )}

            {/* Save Defaults */}
            <button
              onClick={handleSavePreferences}
              className="hidden lg:flex px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition items-center gap-1 border border-slate-700"
              title="រក្សាទុកការកំណត់នេះជាលំនាំដើម"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>រក្សាទុក</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleResetDefaults}
              className="hidden xl:flex px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition items-center gap-1 border border-slate-700"
              title="កំណត់ទម្រង់ដើមឡើងវិញ"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>កំណត់ដើម</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden md:flex p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title={isFullscreen ? 'បង្រួមធម្មតា' : 'ពង្រីកពេញអេក្រង់ PC'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Main Action: Print / Download PDF */}
            <button
              onClick={handlePrintPdf}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-1.5 active:scale-95 border border-red-400/40"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">ទាញយក / បោះពុម្ព PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY WORKSPACE (Responsive Split / Full Editor / Full Preview) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100 dark:bg-slate-950">
          
          {/* LEFT SIDE / FORM EDITOR PANEL */}
          <div className={`border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full overflow-hidden transition-all duration-200 ${
            viewLayout === 'editor'
              ? 'col-span-12'
              : viewLayout === 'preview'
              ? 'hidden'
              : 'col-span-12 lg:col-span-6 xl:col-span-5'
          }`}>
            
            {/* Tabs Selector Bar */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 p-2 gap-1 bg-slate-50 dark:bg-slate-950 shrink-0 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('header')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'header'
                    ? 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-300 shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-purple-600" />
                <span>១. ក្បាលលិខិត</span>
              </button>

              <button
                onClick={() => setActiveTab('style')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'style'
                    ? 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-300 shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-indigo-600" />
                <span>២. ស្ទីល & ក្រដាស</span>
              </button>

              <button
                onClick={() => setActiveTab('table_design')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'table_design'
                    ? 'bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-blue-600" />
                <span>៣. រចនាតារាង ✨</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-300 shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>{documentType === 'timetable' ? '៤. មាតិកាកាលវិភាគ' : '៤. ជម្រើសបង្ហាញ'}</span>
              </button>

              <button
                onClick={() => setActiveTab('signatures')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'signatures'
                    ? 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-300 shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-amber-600" />
                <span>៥. ហត្ថលេខា</span>
              </button>
            </div>

            {/* TAB CONTENT PANELS CONTAINER */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 text-xs">
              
              {/* TAB 1: HEADER & SCHOOL INFO */}
              {activeTab === 'header' && (
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border border-purple-200 dark:border-purple-900 text-purple-950 dark:text-purple-200 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                      <span>កែសម្រួលព័ត៌មានក្បាលសំបុត្រ និងចំណងជើងឯកសារ</span>
                    </p>
                    <div className="flex items-center gap-1">
                      {documentType === 'timetable' && (
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-purple-200 dark:border-purple-800">
                          <button
                            type="button"
                            onClick={() => handleApplyShiftPreset('morning')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-0.5 ${
                              editableTimetable?.shift === 'ព្រឹក'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <Sun className="w-3 h-3" />
                            <span>វេនព្រឹក</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyShiftPreset('afternoon')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-0.5 ${
                              editableTimetable?.shift === 'រសៀល'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <Moon className="w-3 h-3" />
                            <span>វេនរសៀល</span>
                          </button>
                        </div>
                      )}
                      <span className="text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 font-bold px-2 py-0.5 rounded-full">
                        ឆ្លុះបញ្ចាំងភ្លាមៗ
                      </span>
                    </div>
                  </div>

                  {/* Quick Preset Grade & Year Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>ជ្រើសកម្រិតថ្នាក់រហ័ស៖</span>
                    </span>
                    {['ថ្នាក់ទី១', 'ថ្នាក់ទី២', 'ថ្នាក់ទី៣', 'ថ្នាក់ទី៤', 'ថ្នាក់ទី៥', 'ថ្នាក់ទី៦'].map((gr) => (
                      <button
                        key={gr}
                        type="button"
                        onClick={() => handleHeaderChange('gradeLevel', gr)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
                          header.gradeLevel === gr
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-100 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {gr}
                      </button>
                    ))}
                    <span className="text-slate-300 dark:text-slate-600 mx-1">|</span>
                    {['២០២៤-២០២៥', '២០២៥-២០២៦'].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => handleHeaderChange('academicYear', yr)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
                          header.academicYear === yr
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-100 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        handleHeaderChange('officeInfo', 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកំពង់ឆ្នាំង');
                        handleHeaderChange('departmentInfo', 'ការិយាល័យសុខភាពសិក្សា / ការិយាល័យអប់រំ');
                        handleHeaderChange('schoolName', 'សាលាបឋមសិក្សាអូរស្វាយកណ្តាល');
                        if (onShowToast) onShowToast('បានកំណត់ក្បាលទំព័រស្តង់ដារ (កំពង់ឆ្នាំង / សាលាបឋមសិក្សាអូរស្វាយកណ្តាល)');
                      }}
                      className="ml-auto px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white transition flex items-center gap-1 shadow-2xs"
                    >
                      <span>🏛️ ប្រើក្បាលសំបុត្រស្តង់ដារ</span>
                    </button>
                  </div>

                  {/* Header Layout Alignment Selection */}
                  <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>ទម្រង់រៀបចំក្បាលទំព័រ (Header Layout Style)៖</span>
                      </label>
                      <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                        {styles.headerLayout === 'side_by_side' ? 'ទម្រង់អមសងខាង (2 Columns)' : 'ព្រះរាជាណាចក្រកម្ពុជានៅលើគេបង្អស់ (Centered Top)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          pushToHistory();
                          setStyles((prev) => ({ ...prev, headerLayout: 'centered_top' }));
                        }}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                          (styles.headerLayout || 'centered_top') === 'centered_top'
                            ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                        }`}
                      >
                        <span className="font-bold text-xs flex items-center gap-1">
                          👑 ១. ព្រះរាជាណាចក្រកម្ពុជានៅលើគេបង្អស់ (Centered Top)
                        </span>
                        <span className="text-[10px] opacity-80 leading-relaxed">
                          ចំណងជើងរដ្ឋកណ្តាលលើគេ + មន្ទីរ/ការិយាល័យ/សាលានៅខាងក្រោម
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          pushToHistory();
                          setStyles((prev) => ({ ...prev, headerLayout: 'side_by_side' }));
                        }}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                          styles.headerLayout === 'side_by_side'
                            ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                        }`}
                      >
                        <span className="font-bold text-xs flex items-center gap-1">
                          🏛️ ២. ទម្រង់អមសងខាង (Side-by-Side)
                        </span>
                        <span className="text-[10px] opacity-80 leading-relaxed">
                          មន្ទីរ/សាលានៅខាងឆ្វេង + ព្រះរាជាណាចក្រនៅខាងស្តាំ
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className={`grid gap-3 ${viewLayout === 'editor' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ចំណងជើងរដ្ឋ
                      </label>
                      <input
                        type="text"
                        value={header.kingdomTitle}
                        onChange={(e) => handleHeaderChange('kingdomTitle', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        បាវចនាជាតិ
                      </label>
                      <input
                        type="text"
                        value={header.kingdomMotto}
                        onChange={(e) => handleHeaderChange('kingdomMotto', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        មន្ទីរអប់រំ / រាជធានី-ខេត្ត
                      </label>
                      <input
                        type="text"
                        value={header.officeInfo}
                        onChange={(e) => handleHeaderChange('officeInfo', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ការិយាល័យអប់រំ ក្រុង/ស្រុក/ខណ្ឌ
                      </label>
                      <input
                        type="text"
                        value={header.departmentInfo}
                        onChange={(e) => handleHeaderChange('departmentInfo', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ឈ្មោះសាលាបឋមសិក្សា
                      </label>
                      <input
                        type="text"
                        value={header.schoolName}
                        onChange={(e) => handleHeaderChange('schoolName', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-purple-950 dark:text-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ឈ្មោះគ្រូបង្រៀន
                      </label>
                      <input
                        type="text"
                        value={header.teacherName}
                        onChange={(e) => handleHeaderChange('teacherName', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        កម្រិតថ្នាក់
                      </label>
                      <input
                        type="text"
                        value={header.gradeLevel}
                        onChange={(e) => handleHeaderChange('gradeLevel', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ឆ្នាំសិក្សា
                      </label>
                      <input
                        type="text"
                        value={header.academicYear}
                        onChange={(e) => handleHeaderChange('academicYear', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ចំណងជើងឯកសារ (Title)
                      </label>
                      <input
                        type="text"
                        value={header.docTitle}
                        onChange={(e) => handleHeaderChange('docTitle', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-red-600 dark:text-red-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ចំណងជើងរង ឬការបញ្ជាក់បន្ថែម
                    </label>
                    <input
                      type="text"
                      value={header.docSubtitle}
                      onChange={(e) => handleHeaderChange('docSubtitle', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: STYLES, PAPER & FONTS */}
              {activeTab === 'style' && (
                <div className="space-y-4">
                  
                  {/* Paper Orientation & Size */}
                  <div className={`grid gap-3 ${viewLayout === 'editor' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    
                    {/* Paper Orientation Selector */}
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>ទិសដៅក្រដាស (Orientation)</span>
                        {documentType === 'timetable' && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-300/40">
                            ★ ណែនាំ៖ ផ្តេក (Landscape)
                          </span>
                        )}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleStyleChange('orientation', 'landscape')}
                          className={`p-3 rounded-2xl border flex items-center gap-2.5 transition text-left ${
                            styles.orientation === 'landscape'
                              ? 'bg-purple-900 text-white border-purple-900 shadow-md'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-xl">📜</div>
                          <div>
                            <div className="font-extrabold text-xs">ក្រដាសផ្តេក (Landscape)</div>
                            <div className="text-[10px] opacity-80">សមស្របសម្រាប់កាលវិភាគ</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStyleChange('orientation', 'portrait')}
                          className={`p-3 rounded-2xl border flex items-center gap-2.5 transition text-left ${
                            styles.orientation === 'portrait'
                              ? 'bg-purple-900 text-white border-purple-900 shadow-md'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-xl">📄</div>
                          <div>
                            <div className="font-extrabold text-xs">ក្រដាសបញ្ឈរ (Portrait)</div>
                            <div className="text-[10px] opacity-80">សមស្របសម្រាប់កម្មវិធីសិក្សា</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Paper Size */}
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>ទំហំក្រដាស (Paper Size)</span>
                        {documentType === 'quiz' && (
                          <span className="text-[10px] text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full font-bold">
                            💡 គាំទ្រ A4 & A5 សៀវភៅ
                          </span>
                        )}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['A4', 'A5', 'Letter', 'A3'] as const).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleStyleChange('paperSize', size)}
                            className={`p-2.5 rounded-xl border text-xs font-extrabold transition text-center flex flex-col items-center justify-center gap-0.5 ${
                              styles.paperSize === size
                                ? 'bg-purple-900 text-white border-purple-900 shadow-sm ring-2 ring-purple-400/40'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <span className="text-sm font-black">{size}</span>
                            <span className="text-[10px] font-normal opacity-85">
                              {size === 'A4'
                                ? 'ស្តង់ដារ'
                                : size === 'A5'
                                ? 'សៀវភៅតូច'
                                : size === 'Letter'
                                ? 'Letter'
                                : 'ផ្ទាំងធំ'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Theme Presets */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>ជ្រើសរើសទម្រង់គំរូរហ័ស (1-Click Theme Presets)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => applyThemePreset('moeys_blue')}
                        className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-left transition"
                      >
                        <div className="font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                          <span>📘 ក្រសួងអប់រំ ស្តង់ដារ</span>
                        </div>
                        <p className="text-[10px] text-blue-700/80 dark:text-blue-400 mt-0.5">
                          ពណ៌ខៀវផ្លូវការ, អក្សរមូល
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyThemePreset('printer_bw')}
                        className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-left transition"
                      >
                        <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                          <span>🖨️ សន្សំទឹកថ្នាំ ស-ខ្មៅ</span>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                          ព្រីនច្បាស់ល្អ សន្សំទឹកថ្នាំ
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyThemePreset('emerald_modern')}
                        className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-left transition"
                      >
                        <div className="font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                          <span>🌿 បៃតង រស្មី</span>
                        </div>
                        <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400 mt-0.5">
                          ស្ទីលទំនើប, ស្រស់ស្អាត
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyThemePreset('burgundy_grid')}
                        className="p-2.5 rounded-xl border border-pink-200 dark:border-pink-900 bg-pink-50/50 dark:bg-pink-950/30 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-left transition"
                      >
                        <div className="font-extrabold text-pink-900 dark:text-pink-300 flex items-center gap-1">
                          <span>🍷 ក្រហមទុំ ឆើតឆាយ</span>
                        </div>
                        <p className="text-[10px] text-pink-700/80 dark:text-pink-400 mt-0.5">
                          ពណ៌ក្រហមទុំ, តារាង Grid
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyThemePreset('charcoal')}
                        className="p-2.5 rounded-xl border border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-left transition"
                      >
                        <div className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <span>🖤 ខ្មៅធ្យូង ប្រណិត</span>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                          Charcoal Minimal
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Font Pairs & Sizing */}
                  <div className={`grid gap-3 ${viewLayout === 'editor' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        បន្សំអក្សរខ្មែរ (Khmer Font Pairing)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => applyFontComboPreset('moeys_standard')}
                          className="p-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/30 text-left transition hover:bg-purple-100"
                        >
                          <div className="font-bold text-purple-950 dark:text-purple-200">👑 ស្តង់ដារក្រសួង</div>
                          <div className="text-[10px] text-slate-500">ចំណងជើង [មូល] + ខ្លឹមសារ [សៀមរាប]</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => applyFontComboPreset('kantumruy_modern')}
                          className="p-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/30 text-left transition hover:bg-purple-100"
                        >
                          <div className="font-bold text-purple-950 dark:text-purple-200">📱 ទំនើប កន្តុំរុយ</div>
                          <div className="text-[10px] text-slate-500">កន្តុំរុយ Pro ទាំងមូល</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => applyFontComboPreset('moul_pali_classic')}
                          className="p-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/30 text-left transition hover:bg-purple-100"
                        >
                          <div className="font-bold text-purple-950 dark:text-purple-200">📜 មូលបាលី បុរាណ</div>
                          <div className="text-[10px] text-slate-500">មូលបាលី + Khmer OS</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => applyFontComboPreset('battambang_hand')}
                          className="p-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/30 text-left transition hover:bg-purple-100"
                        >
                          <div className="font-bold text-purple-950 dark:text-purple-200">✍️ បាត់ដំបង ងាយស្រួល</div>
                          <div className="text-[10px] text-slate-500">អក្សរបាត់ដំបង</div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        ទំហំអក្សរទូទៅ (Font Size)
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(
                          [
                            { key: 'small', label: 'តូច (12px)' },
                            { key: 'normal', label: 'ធម្មតា (13.5px)' },
                            { key: 'medium', label: 'មធ្យម (15px)' },
                            { key: 'large', label: 'ធំ (16.5px)' },
                          ] as const
                        ).map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => handleStyleChange('fontSize', item.key as any)}
                            className={`p-2 rounded-xl border text-[11px] font-bold transition text-center ${
                              styles.fontSize === item.key
                                ? 'bg-purple-900 text-white border-purple-900'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {/* Margin Size */}
                      <div className="mt-3">
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          គែមក្រដាស (Margins)
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(
                            [
                              { key: 'tight', label: 'ចង្អៀត (10mm)' },
                              { key: 'normal', label: 'ធម្មតា (15mm)' },
                              { key: 'wide', label: 'ទូលាយ (20mm)' },
                            ] as const
                          ).map((m) => (
                            <button
                              key={m.key}
                              type="button"
                              onClick={() => handleStyleChange('marginSize', m.key as any)}
                              className={`p-1.5 rounded-lg border text-[11px] font-bold transition text-center ${
                                styles.marginSize === m.key
                                  ? 'bg-purple-900 text-white border-purple-900'
                                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Watermark Input */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      អក្សរផ្ទៃព្រាលចំណាំ (Watermark Text) - មិនទាមទារ
                    </label>
                    <input
                      type="text"
                      placeholder="ឧ. ព្រាង, DRAFT, ផ្លូវការ..."
                      value={styles.watermarkText || ''}
                      onChange={(e) => handleStyleChange('watermarkText', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>

                </div>
              )}

              {/* TAB 3: TABLE DESIGN & CUSTOM STYLING */}
              {activeTab === 'table_design' && (
                <div className="space-y-4">
                  {/* Tab Banner */}
                  <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-200 flex items-center justify-between gap-2">
                    <p className="font-bold flex items-center gap-1.5">
                      <Grid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>កំណត់រចនាប័ទ្ម និងស្ទីលតារាង PDF (Table Design & Formatting)</span>
                    </p>
                    <span className="text-[10px] bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200 font-bold px-2 py-0.5 rounded-full">
                      មើលលទ្ធផលភ្លាមៗ
                    </span>
                  </div>

                  {/* 1-Click Quick Presets for Table Styling */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="block font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>ជ្រើសរើសស្ទីលតារាងរហ័ស 1-Click (Table Style Presets)៖</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          pushToHistory();
                          setStyles((prev) => ({
                            ...prev,
                            colorTheme: 'moeys_blue',
                            tableHeaderStyle: 'filled',
                            tablePaddingSize: 'normal',
                            tableBorderStyle: 'full',
                            tableStripingStyle: 'subtle',
                            showHeaderTopBar: true,
                          }));
                          if (onShowToast) onShowToast('បានប្តូរទៅស្ទីល៖ ស្តង់ដារក្រសួងអប់រំ');
                        }}
                        className={`p-2 rounded-xl border text-left transition flex flex-col gap-1 ${
                          styles.colorTheme === 'moeys_blue' && styles.tableHeaderStyle === 'filled'
                            ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        }`}
                      >
                        <span className="font-extrabold text-[11px] flex items-center gap-1">
                          👑 ស្តង់ដារក្រសួង
                        </span>
                        <span className="text-[10px] opacity-80">ខៀវក្រសួង + ផ្ទៃដិតពេញ + ស៊ុមច្បាស់</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          pushToHistory();
                          setStyles((prev) => ({
                            ...prev,
                            colorTheme: 'emerald',
                            tableHeaderStyle: 'gradient',
                            tablePaddingSize: 'compact',
                            tableBorderStyle: 'horizontal',
                            tableStripingStyle: 'tinted',
                            showHeaderTopBar: true,
                          }));
                          if (onShowToast) onShowToast('បានប្តូរទៅស្ទីល៖ ទម្រង់ទំនើប ទន់ភ្លឺ');
                        }}
                        className={`p-2 rounded-xl border text-left transition flex flex-col gap-1 ${
                          styles.colorTheme === 'emerald' && styles.tableHeaderStyle === 'gradient'
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        <span className="font-extrabold text-[11px] flex items-center gap-1">
                          🌿 ទំនើប Gradient
                        </span>
                        <span className="text-[10px] opacity-80">បៃតង Gradient + បន្ទាត់ផ្ដេក + បង្រួម</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          pushToHistory();
                          setStyles((prev) => ({
                            ...prev,
                            colorTheme: 'bw',
                            tableHeaderStyle: 'outlined',
                            tablePaddingSize: 'compact',
                            tableBorderStyle: 'minimal',
                            tableStripingStyle: 'white',
                            showHeaderTopBar: false,
                          }));
                          if (onShowToast) onShowToast('បានប្តូរទៅស្ទីល៖ សន្សំទឹកថ្នាំ ស-ខ្មៅ');
                        }}
                        className={`p-2 rounded-xl border text-left transition flex flex-col gap-1 ${
                          styles.colorTheme === 'bw' && styles.tableHeaderStyle === 'outlined'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span className="font-extrabold text-[11px] flex items-center gap-1">
                          🖨️ សន្សំទឹកថ្នាំ
                        </span>
                        <span className="text-[10px] opacity-80">ស-ខ្មៅ + ស៊ុមស្ដើង + គ្មានពណ៌ផ្ទៃ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          pushToHistory();
                          setStyles((prev) => ({
                            ...prev,
                            colorTheme: 'burgundy',
                            tableHeaderStyle: 'dark',
                            tablePaddingSize: 'spacious',
                            tableBorderStyle: 'full',
                            tableStripingStyle: 'subtle',
                            showHeaderTopBar: true,
                          }));
                          if (onShowToast) onShowToast('បានប្តូរទៅស្ទីល៖ ទម្រង់ប្រណិត Dark Accent');
                        }}
                        className={`p-2 rounded-xl border text-left transition flex flex-col gap-1 ${
                          styles.colorTheme === 'burgundy' && styles.tableHeaderStyle === 'dark'
                            ? 'bg-rose-900 text-white border-rose-900 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-400'
                        }`}
                      >
                        <span className="font-extrabold text-[11px] flex items-center gap-1">
                          🍷 Dark Elegant
                        </span>
                        <span className="text-[10px] opacity-80">ក្បាលតារាងខ្មៅ + ក្រហមទុំ + ទូលាយ</span>
                      </button>
                    </div>
                  </div>

                  {/* Header Style */}
                  <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="block font-bold text-slate-800 dark:text-slate-200">
                      ១. ស្ទីលក្បាលតារាង (Table Header Style)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'filled', label: '🎨 ផ្ទៃពណ៌ដិតពេញ', desc: 'ពណ៌ចម្បងដិត + អក្សរស' },
                        { key: 'gradient', label: '🌈 ផ្ទៃ Gradient', desc: 'ពណ៌ផ្លាស់ប្តូរស្រទន់' },
                        { key: 'outlined', label: '🔳 ស៊ុមពណ៌ ផ្ទៃស', desc: 'ផ្ទៃស + ស៊ុមពណ៌ចម្បង' },
                        { key: 'dark', label: '⬛ ផ្ទៃខ្មៅប្រណិត', desc: 'ផ្ទៃ Slate Dark + អក្សរស' },
                        { key: 'minimal', label: '📄 ស្ទីលសាមញ្ញ', desc: 'គ្មានពណ៌ផ្ទៃ + បន្ទាត់ក្រោម' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            pushToHistory();
                            setStyles((prev) => ({ ...prev, tableHeaderStyle: item.key as TableHeaderStyle }));
                          }}
                          className={`p-2 rounded-xl border text-left transition flex flex-col gap-0.5 ${
                            (styles.tableHeaderStyle || 'filled') === item.key
                              ? 'bg-blue-50 dark:bg-blue-950 border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/30'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{item.label}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cell Density / Padding */}
                  <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="block font-bold text-slate-800 dark:text-slate-200">
                      ២. ទំហំ និងចន្លោះក្នុងតារាង (Table Density & Row Padding)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'compact', label: '📐 បង្រួម (Compact)', desc: 'Padding 3.5px (ដាក់បានច្រើនទំព័រ)' },
                        { key: 'normal', label: '📏 ធម្មតា (Standard)', desc: 'Padding 6px (ស្តង់ដារអានស្រួល)' },
                        { key: 'spacious', label: '📐 ទូលាយ (Spacious)', desc: 'Padding 10px (ស្រឡះភ្នែកប្រណិត)' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            pushToHistory();
                            setStyles((prev) => ({ ...prev, tablePaddingSize: item.key as TablePaddingSize }));
                          }}
                          className={`p-2 rounded-xl border text-left transition flex flex-col gap-0.5 ${
                            (styles.tablePaddingSize || 'normal') === item.key
                              ? 'bg-blue-50 dark:bg-blue-950 border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/30'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{item.label}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grid & Border Style */}
                  <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="block font-bold text-slate-800 dark:text-slate-200">
                      ៣. រូបរាងស៊ុម និងបន្ទាត់តារាង (Grid & Border Layout)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'full', label: '🏁 ស៊ុមពេញលេញ', desc: 'មានបន្ទាត់ព័ទ្ធជុំវិញគ្រប់ក្រឡា' },
                        { key: 'horizontal', label: '➖ បន្ទាត់ផ្ដេកប៉ុណ្ណោះ', desc: 'គ្មានបន្ទាត់ឈររំខានភ្នែក' },
                        { key: 'minimal', label: '📄 បន្ទាត់ក្រោមស្រាលៗ', desc: 'ទម្រង់បែប Minimalist' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            pushToHistory();
                            setStyles((prev) => ({ ...prev, tableBorderStyle: item.key as TableBorderStyle }));
                          }}
                          className={`p-2 rounded-xl border text-left transition flex flex-col gap-0.5 ${
                            (styles.tableBorderStyle || 'full') === item.key
                              ? 'bg-blue-50 dark:bg-blue-950 border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/30'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{item.label}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Striping Style */}
                  <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="block font-bold text-slate-800 dark:text-slate-200">
                      ៤. ពណ៌ឆ្នូតតារាងឆ្លាស់គ្នា (Alternating Row Colors)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'subtle', label: '⚪ ឆ្នូតប្រផេះស្រាល', desc: 'ពណ៌ឆ្នូតស្រាលងាយស្រួលផ្ទៀងផ្ទាត់' },
                        { key: 'tinted', label: '🎨 ឆ្នូតតាមពណ៌ធឹម', desc: 'ពណ៌ឆ្នូតតម្រូវតាម Theme' },
                        { key: 'white', label: '⬜ ផ្ទៃសសុទ្ធ', desc: 'សន្សំទឹកថ្នាំបោះពុម្ព' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            pushToHistory();
                            setStyles((prev) => ({ ...prev, tableStripingStyle: item.key as TableStripingStyle }));
                          }}
                          className={`p-2 rounded-xl border text-left transition flex flex-col gap-0.5 ${
                            (styles.tableStripingStyle || 'subtle') === item.key
                              ? 'bg-blue-50 dark:bg-blue-950 border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/30'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{item.label}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Color Palette */}
                  <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="block font-bold text-slate-800 dark:text-slate-200">
                      ៥. ជ្រើសរើសពណ៌ចម្បងតារាង (Primary Color & Palette)
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { hex: '#1e3a8a', label: 'ខៀវក្រសួង' },
                        { hex: '#065f46', label: 'បៃតងមរកត' },
                        { hex: '#831843', label: 'ក្រហមទុំ' },
                        { hex: '#6b21a8', label: 'ស្វាយឈូក' },
                        { hex: '#b45309', label: 'ទឹកក្រូចអង់គរ' },
                        { hex: '#1e293b', label: 'ខ្មៅធ្យូង' },
                        { hex: '#0f766e', label: 'ខៀវបៃតង Teal' },
                        { hex: '#be185d', label: 'ផ្កាឈូកទុំ' },
                      ].map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => {
                            pushToHistory();
                            setStyles((prev) => ({ ...prev, colorTheme: 'custom', customPrimaryColor: c.hex }));
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                            styles.colorTheme === 'custom' && styles.customPrimaryColor === c.hex
                              ? 'ring-2 ring-blue-500 border-white text-white shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          style={{ backgroundColor: c.hex, color: '#ffffff' }}
                        >
                          <span>{c.label}</span>
                        </button>
                      ))}
                      
                      <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 p-1 rounded-xl bg-slate-50 dark:bg-slate-900">
                        <span className="text-[10px] font-bold text-slate-500">ពណ៌ផ្សេងទៀត៖</span>
                        <input
                          type="color"
                          value={styles.customPrimaryColor || '#1e3a8a'}
                          onChange={(e) => {
                            pushToHistory();
                            setStyles((prev) => ({ ...prev, colorTheme: 'custom', customPrimaryColor: e.target.value }));
                          }}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Decor Toggles */}
                  <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        បង្ហាញបន្ទាត់តុបតែងក្បាលទំព័រខាងលើ (Top Header Accent Line)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        បន្ថែមបន្ទាត់ពណ៌ Gradient យ៉ាងប្រណិតនៅផ្នែកខាងលើបង្អស់នៃទំព័រ PDF
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={styles.showHeaderTopBar !== false}
                        onChange={(e) => {
                          pushToHistory();
                          setStyles((prev) => ({ ...prev, showHeaderTopBar: e.target.checked }));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 4: TIMETABLE CONTENT OR SYLLABUS TOGGLES */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  
                  {/* IF DOCUMENT TYPE IS TIMETABLE */}
                  {documentType === 'timetable' && editableTimetable && (
                    <div className="space-y-4">
                      
                      {/* Top Timetable Info banner */}
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          <span className="font-extrabold text-xs">កែសម្រួលតារាងកាលវិភាគបង្រៀនផ្ទាល់ (Live Timetable Editor)</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                            <button
                              type="button"
                              onClick={() => handleApplyShiftPreset('morning')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                editableTimetable?.shift === 'ព្រឹក'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              <Sun className="w-3.5 h-3.5" />
                              <span>វេនព្រឹក (៧:០០-១១:០០)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyShiftPreset('afternoon')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                editableTimetable?.shift === 'រសៀល'
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              <Moon className="w-3.5 h-3.5" />
                              <span>វេនរសៀល (១៣:០០-១៧:០០)</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleAddTimetableRow}
                            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>បន្ថែមម៉ោង</span>
                          </button>
                        </div>
                      </div>

                      {/* Quick Subject Inserter Tags */}
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-950 dark:text-purple-200 text-xs flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            <span>បន្ទះមុខវិជ្ជាជ្រើសរើសរហ័ស (ចុចលើប្រអប់ក្នុងតារាង រួចចុចមុខវិជ្ជា)៖</span>
                          </span>
                          {selectedCell && (
                            <span className="text-[10px] bg-purple-200 dark:bg-purple-800 text-purple-950 dark:text-purple-100 px-2 py-0.5 rounded-md font-bold">
                              កំពុងជ្រើស៖ ជួរទី {selectedCell.rowIndex + 1} ({String(selectedCell.day).toUpperCase()})
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {COMMON_PRIMARY_SUBJECTS.map((sub) => (
                            <button
                              key={sub.label}
                              type="button"
                              onClick={() => handleInsertQuickSubject(sub.label)}
                              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 border-2 border-purple-200 dark:border-purple-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-black transition flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                            >
                              <span className="text-base">{sub.icon}</span>
                              <span>{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Editable Timetable Grid */}
                      <div className="space-y-3">
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs">
                          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                                <th className="p-2 text-center w-8">#</th>
                                <th className="p-2 w-28">ម៉ោងសិក្សា</th>
                                <th className="p-2 w-20">រយៈពេល</th>
                                <th className="p-2">ចន្ទ</th>
                                <th className="p-2">អង្គារ</th>
                                <th className="p-2">ពុធ</th>
                                <th className="p-2">ព្រហស្បតិ៍</th>
                                <th className="p-2">សុក្រ</th>
                                <th className="p-2">សៅរ៍</th>
                                <th className="p-2 text-center w-10">លុប</th>
                              </tr>
                            </thead>
                            <tbody>
                              {editableTimetable.rows?.map((row: TimetableRow, rIdx: number) => {
                                const isBreak = row.type === 'break' || row.mon === 'ចេញលេង';
                                return (
                                  <tr
                                    key={rIdx}
                                    className={`border-b border-slate-200 dark:border-slate-800 ${
                                      isBreak ? 'bg-amber-50/60 dark:bg-amber-950/30' : 'bg-white dark:bg-slate-900'
                                    }`}
                                  >
                                    <td className="p-2 text-center font-bold text-slate-400">
                                      {rIdx + 1}
                                    </td>
                                    
                                    <td className="p-1">
                                      <input
                                        type="text"
                                        value={row.time}
                                        onChange={(e) => handleTimetableCellChange(rIdx, 'time', e.target.value)}
                                        className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-xs bg-slate-50 dark:bg-slate-800"
                                      />
                                    </td>

                                    <td className="p-1">
                                      <input
                                        type="text"
                                        value={row.duration}
                                        onChange={(e) => handleTimetableCellChange(rIdx, 'duration', e.target.value)}
                                        className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                                      />
                                    </td>

                                    {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const).map((dayKey) => {
                                      const isSelected = selectedCell?.rowIndex === rIdx && selectedCell?.day === dayKey;
                                      return (
                                        <td key={dayKey} className="p-1">
                                          <input
                                            type="text"
                                            value={row[dayKey] || ''}
                                            onFocus={() => setSelectedCell({ rowIndex: rIdx, day: dayKey })}
                                            onChange={(e) => handleTimetableCellChange(rIdx, dayKey, e.target.value)}
                                            className={`w-full p-1.5 rounded-lg border text-xs transition ${
                                              isSelected
                                                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950 ring-2 ring-purple-400 font-bold'
                                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                                            }`}
                                          />
                                        </td>
                                      );
                                    })}

                                    <td className="p-1 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteTimetableRow(rIdx)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                                        title="លុបជួរនេះ"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Notes / Remarks under Timetable */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-purple-600" />
                            <span>សម្គាល់ និងការណែនាំខាងក្រោមតារាងកាលវិភាគ</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={toggles.showNotesSection}
                              onChange={(e) => handleToggleChange('showNotesSection', e.target.checked)}
                              className="w-4 h-4 accent-purple-700 rounded"
                            />
                            <span className="font-bold text-slate-700 dark:text-slate-300">បង្ហាញក្នុង PDF</span>
                          </label>
                        </div>

                        {toggles.showNotesSection && (
                          <textarea
                            rows={3}
                            value={editableTimetable.notes?.join('\n') || ''}
                            onChange={(e) => {
                              pushToHistory();
                              setEditableTimetable({
                                ...editableTimetable,
                                notes: e.target.value.split('\n'),
                              });
                            }}
                            placeholder="បញ្ចូលចំណាំ ឬការណែនាំ (មួយបន្ទាត់សម្រាប់មួយចំណុច)..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                          />
                        )}
                      </div>

                    </div>
                  )}

                  {/* IF DOCUMENT TYPE IS SYLLABUS */}
                  {documentType === 'syllabus' && (
                    <div className="space-y-3">
                      <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                        ជម្រើសបង្ហាញជួរឈរក្នុងតារាង PDF
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                          <span className="font-medium text-slate-800 dark:text-slate-200">ក្បាលសំបុត្ររដ្ឋ</span>
                          <input
                            type="checkbox"
                            checked={styles.showKingdomHeader}
                            onChange={(e) => handleStyleChange('showKingdomHeader', e.target.checked)}
                            className="w-4 h-4 accent-purple-700 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                          <span className="font-medium text-slate-800 dark:text-slate-200">ជួរឈរខែ</span>
                          <input
                            type="checkbox"
                            checked={toggles.showMonthColumn}
                            onChange={(e) => handleToggleChange('showMonthColumn', e.target.checked)}
                            className="w-4 h-4 accent-purple-700 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                          <span className="font-medium text-slate-800 dark:text-slate-200">ជួរឈរសប្តាហ៍ទី</span>
                          <input
                            type="checkbox"
                            checked={toggles.showWeekColumn}
                            onChange={(e) => handleToggleChange('showWeekColumn', e.target.checked)}
                            className="w-4 h-4 accent-purple-700 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                          <span className="font-medium text-slate-800 dark:text-slate-200">ជួរឈរម៉ោងសិក្សា</span>
                          <input
                            type="checkbox"
                            checked={toggles.showHoursColumn}
                            onChange={(e) => handleToggleChange('showHoursColumn', e.target.checked)}
                            className="w-4 h-4 accent-purple-700 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                          <span className="font-medium text-slate-800 dark:text-slate-200">ជួរឈរគោលបំណង</span>
                          <input
                            type="checkbox"
                            checked={toggles.showObjectiveColumn}
                            onChange={(e) => handleToggleChange('showObjectiveColumn', e.target.checked)}
                            className="w-4 h-4 accent-purple-700 rounded"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* IF DOCUMENT TYPE IS GENERAL / STUDENT ROSTER / ATTENDANCE / REPORT */}
                  {documentType !== 'timetable' && documentType !== 'syllabus' && (
                    <div className="space-y-4">
                      <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border border-purple-200 dark:border-purple-900 text-purple-950 dark:text-purple-200">
                        <p className="font-bold flex items-center gap-1.5 text-xs">
                          <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span>ជម្រើសនៃការបង្ហាញព័ត៌មាន និងតារាង (Display & Content Toggles)</span>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                          ១. ផ្នែកក្បាល និងព័ត៌មានរួម
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                            <span className="font-medium text-slate-800 dark:text-slate-200">ក្បាលសំបុត្ររដ្ឋ (ព្រះរាជាណាចក្រកម្ពុជា)</span>
                            <input
                              type="checkbox"
                              checked={styles.showKingdomHeader}
                              onChange={(e) => handleStyleChange('showKingdomHeader', e.target.checked)}
                              className="w-4 h-4 accent-purple-700 rounded"
                            />
                          </label>

                          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                            <span className="font-medium text-slate-800 dark:text-slate-200">បន្ទាត់តុបតែងក្បាលទំព័រខាងលើ</span>
                            <input
                              type="checkbox"
                              checked={styles.showHeaderTopBar !== false}
                              onChange={(e) => handleStyleChange('showHeaderTopBar', e.target.checked)}
                              className="w-4 h-4 accent-purple-700 rounded"
                            />
                          </label>

                          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                            <span className="font-medium text-slate-800 dark:text-slate-200">ផ្នែកហត្ថលេខា និងកាលបរិច្ឆេទ</span>
                            <input
                              type="checkbox"
                              checked={styles.showSignatures}
                              onChange={(e) => handleStyleChange('showSignatures', e.target.checked)}
                              className="w-4 h-4 accent-purple-700 rounded"
                            />
                          </label>

                          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                            <span className="font-medium text-slate-800 dark:text-slate-200">ប្រអប់ទីតាំងបោះត្រាសាលា</span>
                            <input
                              type="checkbox"
                              checked={styles.showStampBox}
                              onChange={(e) => handleStyleChange('showStampBox', e.target.checked)}
                              className="w-4 h-4 accent-purple-700 rounded"
                            />
                          </label>
                        </div>
                      </div>

                      {/* IF DOCUMENT TYPE IS QUIZ SPECIAL OPTIONS */}
                      {documentType === 'quiz' && (
                        <div className="space-y-3">
                          <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                            ២. ជម្រើសពិសេសសម្រាប់វិញ្ញាសា (Quiz Special Options)
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                              <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                បង្ហាញក្របសៀវភៅ (Show Cover Page)
                              </span>
                              <input
                                type="checkbox"
                                checked={toggles.showCoverPage}
                                onChange={(e) => handleToggleChange('showCoverPage', e.target.checked)}
                                className="w-4 h-4 accent-purple-700 rounded"
                              />
                            </label>

                            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                              <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                បង្ហាញចម្លើយ (Show Answer Key)
                              </span>
                              <input
                                type="checkbox"
                                checked={toggles.showAnswerKey}
                                onChange={(e) => handleToggleChange('showAnswerKey', e.target.checked)}
                                className="w-4 h-4 accent-purple-700 rounded"
                              />
                            </label>
                          </div>

                          {/* Quick Paper Size Selector for Quiz: A4 vs A5 */}
                          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-850 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                <span>ជម្រើសទំហំសៀវភៅវិញ្ញាសា (Book Paper Size)៖</span>
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200">
                                {styles.paperSize === 'A5' ? '📖 A5 សៀវភៅតូច' : '📄 A4 ស្តង់ដារ'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => handleStyleChange('paperSize', 'A4')}
                                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                                  styles.paperSize === 'A4'
                                    ? 'bg-purple-900 text-white border-purple-900 shadow-sm ring-2 ring-purple-400/40'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <span className="text-lg">📄</span>
                                <div className="text-left">
                                  <div className="font-extrabold">ទំហំ A4 ស្តង់ដារ</div>
                                  <div className="text-[10px] opacity-80">210 × 297 mm (សន្លឹកធំ)</div>
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStyleChange('paperSize', 'A5')}
                                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                                  styles.paperSize === 'A5'
                                    ? 'bg-purple-900 text-white border-purple-900 shadow-sm ring-2 ring-purple-400/40'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <span className="text-lg">📖</span>
                                <div className="text-left">
                                  <div className="font-extrabold">ទំហំ A5 (សៀវភៅដៃ)</div>
                                  <div className="text-[10px] opacity-80">148 × 210 mm (សៀវភៅតូច)</div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Cover Thumbnail Preview Card */}
                          {toggles.showCoverPage && (
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                                  <span>🎨</span>
                                  <span>រូបភាពក្របសៀវភៅជាក់ស្តែង (Cover Artwork Preview)៖</span>
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                                  កែអក្ខរាវិរុទ្ធរួចរាល់
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <img
                                  src="/math_quiz_book_cover.jpg"
                                  alt="Cover Preview"
                                  className="w-20 h-28 object-cover rounded-xl border-2 border-emerald-500 shadow-md shrink-0"
                                />
                                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                                  <div className="font-bold text-emerald-900 dark:text-emerald-300">
                                    សន្លឹកកិច្ចការគណិតវិទ្យា • លំហាត់ QCM • ថ្នាក់ទី ៦
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    រូបភាពក្របសៀវភៅត្រូវបានកែសម្រួលពាក្យ <strong>"លំហាត់ QCM"</strong> (កែពី QQCM) និងពាក្យ <strong>"ចម្លើយ"</strong> (កែពី តម្លើយ) តាមការស្នើសុំ ព្រមទាំងបោះពុម្ពឈ្មោះគ្រូ និងកាលបរិច្ឆេទដោយស្វ័យប្រវត្តិ។
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notes / Footer Notes */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-purple-600" />
                            <span>សម្គាល់ និងការណែនាំបន្ថែមខាងក្រោមតារាង</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={toggles.showNotesSection !== false}
                              onChange={(e) => handleToggleChange('showNotesSection', e.target.checked)}
                              className="w-4 h-4 accent-purple-700 rounded"
                            />
                            <span className="font-bold text-slate-700 dark:text-slate-300">បង្ហាញក្នុង PDF</span>
                          </label>
                        </div>

                        {toggles.showNotesSection !== false && (
                          <textarea
                            rows={2}
                            value={header.footerNote || ''}
                            onChange={(e) => handleHeaderChange('footerNote', e.target.value)}
                            placeholder="បញ្ចូលចំណាំ ឬការណែនាំបន្ថែមសម្រាប់ឯកសារនេះ..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                          />
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 4: SIGNATURES & DATES */}
              {activeTab === 'signatures' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200">
                    <p className="font-bold flex items-center gap-1.5">
                      <PenTool className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                      <span>កែសម្រួលផ្នែកហត្ថលេខា ត្រាសាលា និងកាលបរិច្ឆេទ</span>
                    </p>
                  </div>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      បង្ហាញផ្នែកហត្ថលេខាខាងក្រោម (Signatures Block)
                    </span>
                    <input
                      type="checkbox"
                      checked={styles.showSignatures}
                      onChange={(e) => handleStyleChange('showSignatures', e.target.checked)}
                      className="w-4 h-4 accent-purple-700 rounded"
                    />
                  </label>

                  {styles.showSignatures && (
                    <div className="space-y-3 pt-1">
                      {/* Signatures Layout Option */}
                      <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            <span>ទម្រង់រៀបចំជួរហត្ថលេខា (Signatures Order)៖</span>
                          </label>
                          <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                            {styles.signaturesLayout === 'side_by_side' ? 'ទម្រង់អមសងខាង (2 Columns)' : 'ហត្ថលេខាគ្រូនៅលើនាយកសាលា (MoEYS Standard)'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              pushToHistory();
                              setStyles((prev) => ({ ...prev, signaturesLayout: 'teacher_above_principal' }));
                            }}
                            className={`p-2 rounded-xl border text-left transition flex flex-col gap-0.5 ${
                              (styles.signaturesLayout || 'teacher_above_principal') === 'teacher_above_principal'
                                ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                            }`}
                          >
                            <span className="font-bold text-xs">
                              👑 ២. ហត្ថលេខាគ្រូនៅលើនាយកសាលា
                            </span>
                            <span className="text-[10px] opacity-80">
                              គ្រូបន្ទុកថ្នាក់នៅខាងលើស្តាំ + នាយកសាលានៅក្រោមឆ្វេង
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              pushToHistory();
                              setStyles((prev) => ({ ...prev, signaturesLayout: 'side_by_side' }));
                            }}
                            className={`p-2 rounded-xl border text-left transition flex flex-col gap-0.5 ${
                              styles.signaturesLayout === 'side_by_side'
                                ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                            }`}
                          >
                            <span className="font-bold text-xs">
                              ⚖️ ទម្រង់អមសងខាង (Side by Side)
                            </span>
                            <span className="text-[10px] opacity-80">
                              នាយកសាលាខាងឆ្វេង និងគ្រូបន្ទុកថ្នាក់ខាងស្តាំ
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Date & Location Generator */}
                      <div>
                        <div className="flex flex-col gap-1.5 mb-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
                              កាលបរិច្ឆេទ & ទីកន្លែងធ្វើ (ខាងស្តាំ)
                            </label>
                            <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                              ចន្ទគតិ + សូរិយគតិ ស្វ័យប្រវត្ត
                            </span>
                          </div>

                          <div className="flex items-center gap-1 flex-wrap">
                            <button
                              type="button"
                              onClick={() => insertLocationDate('combined', 'កំពង់ឆ្នាំង')}
                              className="text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 hover:bg-purple-200 px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 border border-purple-300 dark:border-purple-700"
                              title="ដាក់ចន្ទគតិ + សូរិយគតិ (កំពង់ឆ្នាំង)"
                            >
                              <Clock className="w-3 h-3 text-purple-600" />
                              <span>🌙☀️ ចន្ទគតិ+សូរិយគតិ (កំពង់ឆ្នាំង)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => insertLocationDate('combined', 'រាជធានីភ្នំពេញ')}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 border border-slate-300 dark:border-slate-700"
                            >
                              <MapPin className="w-3 h-3 text-red-500" />
                              <span>ភ្នំពេញ</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => insertLocationDate('souriyatei', 'កំពង់ឆ្នាំង')}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 px-2 py-1 rounded-lg font-bold transition flex items-center gap-1 border border-slate-300 dark:border-slate-700"
                            >
                              <span>☀️ សូរិយគតិ</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => insertLocationDate('chhankatei')}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 px-2 py-1 rounded-lg font-bold transition flex items-center gap-1 border border-slate-300 dark:border-slate-700"
                            >
                              <span>🌙 ចន្ទគតិ</span>
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={header.locationAndDate}
                          onChange={(e) => handleHeaderChange('locationAndDate', e.target.value)}
                          placeholder="បន្ទាត់១៖ ចន្ទគតិ\nបន្ទាត់២៖ សូរិយគតិ"
                          className="w-full p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/30 font-medium text-xs text-purple-950 dark:text-purple-200 leading-relaxed"
                        />
                      </div>

                      <div className={`grid gap-3 ${viewLayout === 'editor' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            ចំណងជើងហត្ថលេខាខាងឆ្វេង
                          </label>
                          <textarea
                            rows={2}
                            value={header.leftSignatureTitle}
                            onChange={(e) => handleHeaderChange('leftSignatureTitle', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            ចំណងជើងហត្ថលេខាខាងស្តាំ
                          </label>
                          <textarea
                            rows={2}
                            value={header.rightSignatureTitle}
                            onChange={(e) => handleHeaderChange('rightSignatureTitle', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs"
                          />
                        </div>
                      </div>

                      <div className={`grid gap-3 ${viewLayout === 'editor' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            ឈ្មោះអ្នកចុះហត្ថលេខាឆ្វេង (នាយក)
                          </label>
                          <input
                            type="text"
                            value={header.leftSignatureName}
                            onChange={(e) => handleHeaderChange('leftSignatureName', e.target.value)}
                            placeholder="ទុកទទេសម្រាប់ការចុះហត្ថលេខាដៃ"
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            ឈ្មោះអ្នកចុះហត្ថលេខាស្តាំ (គ្រូ)
                          </label>
                          <input
                            type="text"
                            value={header.rightSignatureName}
                            onChange={(e) => handleHeaderChange('rightSignatureName', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs"
                          />
                        </div>
                      </div>

                      <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          បង្ហាញប្រអប់ទីតាំងបោះត្រា (Stamp Box)
                        </span>
                        <input
                          type="checkbox"
                          checked={styles.showStampBox}
                          onChange={(e) => handleStyleChange('showStampBox', e.target.checked)}
                          className="w-4 h-4 accent-purple-700 rounded"
                        />
                      </label>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ចំណាំខាងក្រោមទំព័រ PDF (Footer Note)
                    </label>
                    <input
                      type="text"
                      value={header.footerNote}
                      onChange={(e) => handleHeaderChange('footerNote', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-[11px]"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Form Action Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setViewLayout(viewLayout === 'editor' ? 'preview' : 'editor')}
                className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1"
              >
                {viewLayout === 'editor' ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>ពិនិត្យផ្ទាំងមើលគំរូ PDF</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5" />
                    <span>ពង្រីកផ្ទាំងកែប្រែពេញ</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrintPdf}
                className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>បង្កើត PDF</span>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE / LIVE INTERACTIVE PDF CANVAS PREVIEW PANEL */}
          <div
            ref={previewContainerRef}
            className={`bg-slate-900/95 dark:bg-slate-950 p-2 sm:p-4 flex flex-col items-center overflow-hidden h-full transition-all duration-200 ${
              viewLayout === 'preview'
                ? 'col-span-12'
                : viewLayout === 'editor'
                ? 'hidden'
                : 'col-span-12 lg:col-span-6 xl:col-span-7'
            }`}
          >
            
            {/* Canvas Zoom & Tools Bar */}
            <div className="w-full mb-2.5 flex flex-wrap items-center justify-between bg-white dark:bg-slate-900 px-3 sm:px-4 py-2 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('visual_edit')}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
                      previewMode === 'visual_edit'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>📝 កែផ្ទាល់លើក្រដាស</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('print_preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
                      previewMode === 'print_preview'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>📄 មើលគំរូ PDF ពិត</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
                {documentType === 'timetable' && (
                  <div className="hidden sm:flex items-center gap-1 mr-2">
                    <button
                      type="button"
                      onClick={() => handleApplyShiftPreset('morning')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                        editableTimetable?.shift === 'ព្រឹក'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                      title="ប្តូរទៅវេនព្រឹក"
                    >
                      <Sun className="w-3 h-3 text-amber-600" />
                      <span>ព្រឹក</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyShiftPreset('afternoon')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                        editableTimetable?.shift === 'រសៀល'
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                      title="ប្តូរទៅវេនរសៀល"
                    >
                      <Moon className="w-3 h-3 text-indigo-600" />
                      <span>រសៀល</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setAutoFitZoom(false);
                    setZoomLevel((z) => Math.max(40, z - 10));
                  }}
                  className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center"
                  title="បង្រួម (Zoom Out)"
                >
                  -
                </button>
                <span className="font-mono font-bold w-10 text-center text-slate-800 dark:text-slate-200 text-xs">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAutoFitZoom(false);
                    setZoomLevel((z) => Math.min(150, z + 10));
                  }}
                  className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center"
                  title="ពង្រីក (Zoom In)"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAutoFitZoom(true);
                    if (onShowToast) onShowToast('បានកំណត់ Zoom សមស្របអេក្រង់!');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    autoFitZoom
                      ? 'bg-purple-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="កែតម្រូវទំហំឲ្យសមស្របអេក្រង់ស្វ័យប្រវត្ត"
                >
                  សមស្រប
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAutoFitZoom(false);
                    setZoomLevel(100);
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold hover:bg-slate-200"
                >
                  100%
                </button>
              </div>
            </div>

            {/* DIRECT EDIT ON PAPER: FLOATING NUDGE & FORMATTING STUDIO */}
            {previewMode === 'visual_edit' && (
              <div className="w-full mb-2.5 bg-white dark:bg-slate-900 px-3 sm:px-4 py-2.5 rounded-2xl shadow-md border border-purple-200 dark:border-purple-900/50 space-y-2 shrink-0">
                {/* Header Row: Element Selector & Tool Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Move className="w-3.5 h-3.5 text-purple-600" />
                      <span>ជ្រើសធាតុដើម្បីរំកិល/កែ៖</span>
                    </span>

                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 text-xs font-bold text-purple-950 dark:text-purple-200 outline-none cursor-pointer"
                    >
                      <optgroup label="ផ្នែកនៃឯកសារ (Document Sections)">
                        {Object.entries(SECTION_METADATA).map(([key, meta]) => (
                          <option key={key} value={key}>
                            {meta.icon} {meta.label}
                          </option>
                        ))}
                      </optgroup>
                      {floatingStickers.length > 0 && (
                        <optgroup label="ត្រា និងអត្ថបទសេរី (Floating Stickers & Stamps)">
                          {floatingStickers.map((stk, idx) => (
                            <option key={stk.id} value={stk.id}>
                              🏷️ ត្រា #{idx + 1}: {stk.text.slice(0, 20)}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>

                    {/* Active Offset Badge */}
                    {selectedSection && !selectedSection.startsWith('stk_') && (
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-slate-700">
                        X: {sectionFormatting[selectedSection]?.offsetX || 0}px | Y: {sectionFormatting[selectedSection]?.offsetY || 0}px
                      </span>
                    )}

                    {selectedSection && selectedSection.startsWith('stk_') && (
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-slate-700">
                        X: {floatingStickers.find((s) => s.id === selectedSection)?.x || 0}px | Y: {floatingStickers.find((s) => s.id === selectedSection)?.y || 0}px
                      </span>
                    )}
                  </div>

                  {/* Tool Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setActiveNudgeCategory('position')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        activeNudgeCategory === 'position'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Move className="w-3 h-3" />
                      <span>រំកិលទីតាំង</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveNudgeCategory('align')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        activeNudgeCategory === 'align'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <AlignCenter className="w-3 h-3" />
                      <span>តម្រឹម & គម្លាត</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveNudgeCategory('typography')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        activeNudgeCategory === 'typography'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Type className="w-3 h-3" />
                      <span>អក្សរ & ពណ៌</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveNudgeCategory('stickers')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        activeNudgeCategory === 'stickers'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>ត្រា & អត្ថបទសេរី</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Panel 1: Position / Move Nudge Controls */}
                {activeNudgeCategory === 'position' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {/* 4-Way Arrow Nudge Pad */}
                    <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/40 p-1 rounded-xl border border-purple-200 dark:border-purple-900">
                      <span className="text-[11px] font-bold text-purple-950 dark:text-purple-200 px-1">
                        រំកិល៖
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedSection?.startsWith('stk_')) {
                            nudgeFloatingSticker(selectedSection, 'left');
                          } else {
                            nudgeSection(selectedSection, 'left');
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-purple-200 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                        title="រំកិលទៅឆ្វេង (Shift Left)"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                        <span>ឆ្វេង</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedSection?.startsWith('stk_')) {
                            nudgeFloatingSticker(selectedSection, 'right');
                          } else {
                            nudgeSection(selectedSection, 'right');
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-purple-200 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                        title="រំកិលទៅស្តាំ (Shift Right)"
                      >
                        <span>ស្តាំ</span>
                        <ArrowRight className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedSection?.startsWith('stk_')) {
                            nudgeFloatingSticker(selectedSection, 'up');
                          } else {
                            nudgeSection(selectedSection, 'up');
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-purple-200 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                        title="រំកិលឡើងលើ (Shift Up)"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                        <span>លើ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedSection?.startsWith('stk_')) {
                            nudgeFloatingSticker(selectedSection, 'down');
                          } else {
                            nudgeSection(selectedSection, 'down');
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-purple-200 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                        title="រំកិលចុះក្រោម (Shift Down)"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                        <span>ក្រោម</span>
                      </button>
                    </div>

                    {/* Step Speed Toggle */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-500 px-1">ល្បឿនរំកិល៖</span>
                      {[1, 4, 10, 25].map((stepVal) => (
                        <button
                          key={stepVal}
                          type="button"
                          onClick={() => setNudgeStep(stepVal)}
                          className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold transition ${
                            nudgeStep === stepVal
                              ? 'bg-purple-900 text-white shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {stepVal}px
                        </button>
                      ))}
                    </div>

                    {/* Quick Reset & Alignment Helper Buttons */}
                    <div className="flex items-center gap-1.5">
                      {!selectedSection?.startsWith('stk_') && (
                        <button
                          type="button"
                          onClick={() => updateSectionFmt(selectedSection, { offsetX: 0 })}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
                          title="តម្រឹមកណ្តាលអ័ក្សដេក"
                        >
                          <span>🎯 តម្រឹមកណ្តាល X=0</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (selectedSection?.startsWith('stk_')) {
                            deleteFloatingSticker(selectedSection);
                          } else {
                            resetSectionFmt(selectedSection);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1"
                        title="កំណត់ផ្នែកនេះដើមវិញ"
                      >
                        <RotateCcw className="w-3 h-3 text-amber-600" />
                        <span>{selectedSection?.startsWith('stk_') ? 'លុបត្រានេះ' : 'កំណត់ដើមវិញ'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={resetAllSectionFmts}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950 hover:text-rose-700 text-slate-600 dark:text-slate-400 text-xs font-bold"
                        title="កំណត់ការរំកិលទាំងអស់ដើមវិញ"
                      >
                        <span>កំណត់ដើមទាំងអស់</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-Panel 2: Alignment & Spacing Controls */}
                {activeNudgeCategory === 'align' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {/* Text Alignment */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 px-1">តម្រឹមអត្ថបទ៖</span>
                      {(
                        [
                          { key: 'left', label: 'ឆ្វេង', icon: AlignLeft },
                          { key: 'center', label: 'កណ្តាល', icon: AlignCenter },
                          { key: 'right', label: 'ស្តាំ', icon: AlignRight },
                          { key: 'justify', label: 'ស្មើ', icon: AlignJustify },
                        ] as const
                      ).map((alignItem) => {
                        const IconComp = alignItem.icon;
                        const currentAlign = sectionFormatting[selectedSection]?.textAlign || 'inherit';
                        const isCur = currentAlign === alignItem.key;
                        return (
                          <button
                            key={alignItem.key}
                            type="button"
                            onClick={() => updateSectionFmt(selectedSection, { textAlign: alignItem.key })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              isCur
                                ? 'bg-purple-900 text-white shadow-xs'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                            <span>{alignItem.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Line Height Multiplier */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 px-1">គម្លាតបន្ទាត់ ↕៖</span>
                      {[1.0, 1.2, 1.4, 1.6, 1.8, 2.0].map((lh) => {
                        const isCur = sectionFormatting[selectedSection]?.lineHeight === lh;
                        return (
                          <button
                            key={lh}
                            type="button"
                            onClick={() => updateSectionFmt(selectedSection, { lineHeight: lh })}
                            className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold transition ${
                              isCur
                                ? 'bg-purple-900 text-white shadow-xs'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {lh}
                          </button>
                        );
                      })}
                    </div>

                    {/* Letter Spacing */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 px-1">គម្លាតតួអក្សរ ↔៖</span>
                      {[0, 1, 2, 3, 4].map((ls) => {
                        const isCur = (sectionFormatting[selectedSection]?.letterSpacing || 0) === ls;
                        return (
                          <button
                            key={ls}
                            type="button"
                            onClick={() => updateSectionFmt(selectedSection, { letterSpacing: ls })}
                            className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold transition ${
                              isCur
                                ? 'bg-purple-900 text-white shadow-xs'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {ls}px
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-Panel 3: Typography & Colors Controls */}
                {activeNudgeCategory === 'typography' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {/* Font Size Delta & Styles */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 px-1">ទំហំអក្សរ៖</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = sectionFormatting[selectedSection]?.fontSizeDelta || 0;
                            updateSectionFmt(selectedSection, { fontSizeDelta: Math.max(-6, cur - 1) });
                          }}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 text-xs font-extrabold flex items-center justify-center"
                          title="បង្រួមអក្សរ 1px"
                        >
                          A-
                        </button>
                        <span className="font-mono font-bold text-xs w-9 text-center text-purple-700 dark:text-purple-300">
                          {(sectionFormatting[selectedSection]?.fontSizeDelta || 0) >= 0 ? '+' : ''}
                          {sectionFormatting[selectedSection]?.fontSizeDelta || 0}px
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = sectionFormatting[selectedSection]?.fontSizeDelta || 0;
                            updateSectionFmt(selectedSection, { fontSizeDelta: Math.min(10, cur + 1) });
                          }}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 text-xs font-extrabold flex items-center justify-center"
                          title="ពង្រីកអក្សរ 1px"
                        >
                          A+
                        </button>
                      </div>

                      {/* Bold, Italic, Underline */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = sectionFormatting[selectedSection]?.isBold;
                            updateSectionFmt(selectedSection, { isBold: !cur });
                          }}
                          className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                            sectionFormatting[selectedSection]?.isBold
                              ? 'bg-purple-900 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                          }`}
                          title="អក្សរដិត (Bold)"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = sectionFormatting[selectedSection]?.isItalic;
                            updateSectionFmt(selectedSection, { isItalic: !cur });
                          }}
                          className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                            sectionFormatting[selectedSection]?.isItalic
                              ? 'bg-purple-900 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                          }`}
                          title="អក្សរទ្រេត (Italic)"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = sectionFormatting[selectedSection]?.isUnderline;
                            updateSectionFmt(selectedSection, { isUnderline: !cur });
                          }}
                          className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                            sectionFormatting[selectedSection]?.isUnderline
                              ? 'bg-purple-900 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                          }`}
                          title="បន្ទាត់ពីក្រោម (Underline)"
                        >
                          <Underline className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Text Colors Swatches */}
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 px-1">ពណ៌អក្សរ៖</span>
                      {[
                        { color: '#0f172a', label: 'ខ្មៅ' },
                        { color: '#1e3a8a', label: 'ខៀវចាស់' },
                        { color: '#2563eb', label: 'ខៀវ' },
                        { color: '#059669', label: 'បៃតង' },
                        { color: '#dc2626', label: 'ក្រហម' },
                        { color: '#d97706', label: 'លឿងទុំ' },
                        { color: '#7c3aed', label: 'ស្វាយ' },
                        { color: '#475569', label: 'ប្រផេះ' },
                      ].map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => updateSectionFmt(selectedSection, { color: item.color })}
                          className="w-5 h-5 rounded-full border border-white dark:border-slate-700 shadow-2xs transition hover:scale-125 focus:ring-2 focus:ring-purple-500"
                          style={{ backgroundColor: item.color }}
                          title={item.label}
                        />
                      ))}
                    </div>

                    {/* Background Highlight Swatches */}
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 px-1">ពណ៌ផ្ទៃក្រោយ៖</span>
                      <button
                        type="button"
                        onClick={() => updateSectionFmt(selectedSection, { bgColor: undefined })}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-700 text-slate-600 hover:bg-slate-200"
                        title="គ្មានពណ៌"
                      >
                        គ្មាន
                      </button>
                      {[
                        { color: '#fef3c7', label: 'លឿងខ្ចី' },
                        { color: '#e0f2fe', label: 'ខៀវខ្ចី' },
                        { color: '#dcfce7', label: 'បៃតងខ្ចី' },
                        { color: '#fce7f3', label: 'ផ្កាឈូក' },
                        { color: '#f3e8ff', label: 'ស្វាយខ្ចី' },
                      ].map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => updateSectionFmt(selectedSection, { bgColor: item.color })}
                          className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs transition hover:scale-125 focus:ring-2 focus:ring-purple-500"
                          style={{ backgroundColor: item.color }}
                          title={item.label}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-Panel 4: Movable Floating Stickers & Official Stamps Studio */}
                {activeNudgeCategory === 'stickers' && (
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1">
                          <Stamp className="w-3.5 h-3.5 text-purple-600" />
                          <span>ចុចបន្ថែមត្រា ឬស្លាកសេរីលើក្រដាស (Stickers & Official Stamps)៖</span>
                        </span>

                        {[
                          { text: '【 បានពិនិត្យ និងឯកភាព 】', color: '#b91c1c', bgColor: '#fef2f2', borderColor: '#ef4444' },
                          { text: '【 ឯកសារផ្លូវការ 】', color: '#1e3a8a', bgColor: '#eff6ff', borderColor: '#3b82f6' },
                          { text: '【 អនុវត្តជាបន្ទាន់ 】', color: '#047857', bgColor: '#f0fdf4', borderColor: '#10b981' },
                          { text: '【 កាលវិភាគបង្រៀនផ្លូវការ 】', color: '#6b21a8', bgColor: '#faf5ff', borderColor: '#a855f7' },
                          { text: '【 ទីតាំងបោះត្រា និងហត្ថលេខា 】', color: '#c2410c', bgColor: '#fff7ed', borderColor: '#f97316' },
                        ].map((presetStk) => (
                          <button
                            key={presetStk.text}
                            type="button"
                            onClick={() => addFloatingSticker(presetStk)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 active:scale-95 shadow-2xs"
                            style={{
                              color: presetStk.color,
                              backgroundColor: presetStk.bgColor,
                              borderColor: presetStk.borderColor,
                            }}
                          >
                            <span>➕</span>
                            <span>{presetStk.text}</span>
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => addFloatingSticker({ text: '【 អត្ថបទសេរីថ្មី... 】', isStampStyle: false, color: '#1e293b', bgColor: '#f8fafc', borderColor: '#cbd5e1' })}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 text-purple-700" />
                          <span>អត្ថបទសេរី</span>
                        </button>
                      </div>
                    </div>

                    {/* If selected element is a floating sticker, show its fine-tuning tools */}
                    {selectedSection?.startsWith('stk_') && (() => {
                      const curStk = floatingStickers.find((s) => s.id === selectedSection);
                      if (!curStk) return null;
                      return (
                        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                            <span className="font-bold text-purple-950 dark:text-purple-200 shrink-0">កែអត្ថបទត្រា៖</span>
                            <input
                              type="text"
                              value={curStk.text}
                              onChange={(e) => updateFloatingSticker(curStk.id, { text: e.target.value })}
                              className="flex-1 px-2.5 py-1 rounded-lg border border-purple-300 bg-white font-bold text-xs text-purple-950 outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-600">បង្វិល (Rotate)៖</span>
                            {[-45, -15, 0, 15, 45].map((rot) => (
                              <button
                                key={rot}
                                type="button"
                                onClick={() => updateFloatingSticker(curStk.id, { rotation: rot })}
                                className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                                  (curStk.rotation || 0) === rot
                                    ? 'bg-purple-900 text-white'
                                    : 'bg-white text-slate-700 hover:bg-purple-100'
                                }`}
                              >
                                {rot}°
                              </button>
                            ))}

                            <button
                              type="button"
                              onClick={() => deleteFloatingSticker(curStk.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1 ml-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>លុប</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Live Document Scaled Frame */}
            <div className="w-full flex-1 overflow-auto flex items-start justify-center p-2 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div
                className={`transition-all duration-150 origin-top shadow-2xl rounded-sm my-2 select-text ${
                  styles.colorTheme === 'bw' ? 'bg-white text-slate-900' : getThemeBackgroundClass(getActiveCustomBackgroundTheme())
                }`}
                style={{
                  width:
                    styles.paperSize === 'A5'
                      ? styles.orientation === 'landscape'
                        ? '820px'
                        : '580px'
                      : styles.paperSize === 'A3'
                      ? styles.orientation === 'landscape'
                        ? '1440px'
                        : '1040px'
                      : styles.orientation === 'landscape'
                      ? '1040px'
                      : '820px',
                  minHeight:
                    styles.paperSize === 'A5'
                      ? styles.orientation === 'landscape'
                        ? '580px'
                        : '820px'
                      : styles.paperSize === 'A3'
                      ? styles.orientation === 'landscape'
                        ? '1040px'
                        : '1440px'
                      : styles.orientation === 'landscape'
                      ? '740px'
                      : '1120px',
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                }}
              >
                {previewMode === 'print_preview' ? (
                  <iframe
                    title="PDF Live Document Preview"
                    srcDoc={generatePdfHtml()}
                    className="w-full h-[760px] border-0 bg-white"
                  />
                ) : (
                  /* DIRECT INTERACTIVE WYSIWYG DOCUMENT SHEET WITH MOVABLE SECTIONS & FLOATING STICKERS */
                  <div
                    className="p-8 sm:p-10 relative"
                    style={{
                      fontFamily: getFontFamilyCss(styles.bodyFontFamily),
                      fontSize: styles.fontSize === 'small' ? '12px' : styles.fontSize === 'large' ? '16px' : '14px',
                    }}
                  >
                    {/* Render Floating Movable Stickers / Stamps on the paper */}
                    {floatingStickers.map((stk) => {
                      const isSelected = selectedSection === stk.id;
                      return (
                        <div
                          key={stk.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSection(stk.id);
                            setActiveNudgeCategory('stickers');
                          }}
                          style={{
                            position: 'absolute',
                            left: `${stk.x}px`,
                            top: `${stk.y}px`,
                            fontSize: `${stk.fontSize}px`,
                            color: stk.color,
                            backgroundColor: stk.bgColor,
                            border: stk.borderColor ? `1.5px ${stk.isStampStyle ? 'dashed' : 'solid'} ${stk.borderColor}` : undefined,
                            padding: stk.isStampStyle ? '6px 14px' : '4px 10px',
                            borderRadius: stk.isStampStyle ? '8px' : '4px',
                            transform: `rotate(${stk.rotation || 0}deg)`,
                            fontFamily: getFontFamilyCss(stk.fontFamily || 'moul'),
                            fontWeight: stk.isBold ? 'bold' : 'normal',
                            fontStyle: stk.isItalic ? 'italic' : 'normal',
                            textDecoration: stk.isUnderline ? 'underline' : 'none',
                            zIndex: isSelected ? 100 : 50,
                            boxShadow: stk.isStampStyle ? '0 2px 6px rgba(0,0,0,0.12)' : undefined,
                          }}
                          className={`cursor-move select-none transition-shadow ${
                            isSelected ? 'ring-2 ring-purple-600 ring-offset-2 shadow-lg' : 'hover:ring-1 hover:ring-purple-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{stk.text}</span>
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFloatingSticker(stk.id);
                                }}
                                className="text-rose-500 hover:text-rose-700 font-bold text-xs ml-1 bg-white rounded-full px-1"
                                title="លុបត្រានេះ"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Header Layout Rendering */}
                    {styles.showKingdomHeader && styles.headerLayout === 'side_by_side' ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSection('kingdom_header');
                        }}
                        style={getSectionStyle('kingdom_header')}
                        className={`relative group rounded-xl p-1.5 mb-4 border transition cursor-pointer ${
                          selectedSection === 'kingdom_header'
                            ? 'border-purple-500 bg-purple-50/30 ring-2 ring-purple-400/50'
                            : 'border-transparent hover:border-purple-200 hover:bg-purple-50/10'
                        }`}
                      >
                        {/* Mini Quick Nudge Badge on Hover */}
                        <div
                          className={`absolute -top-3 left-3 z-30 flex items-center gap-1 bg-purple-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md transition ${
                            selectedSection === 'kingdom_header' ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                          }`}
                        >
                          <span>👑 ក្បាលសំបុត្រជាតិ</span>
                          <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-purple-400">
                            <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('kingdom_header', 'left'); }} className="hover:text-amber-300">◀</button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('kingdom_header', 'right'); }} className="hover:text-amber-300">▶</button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('kingdom_header', 'up'); }} className="hover:text-amber-300">▲</button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('kingdom_header', 'down'); }} className="hover:text-amber-300">▼</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-start pb-3 border-b border-slate-200">
                          {/* Left Side: Office, Department, School */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSection('school_info');
                            }}
                            style={getSectionStyle('school_info')}
                            className={`space-y-1 p-1 rounded-lg transition ${
                              selectedSection === 'school_info' ? 'ring-1 ring-purple-400 bg-purple-50/40' : ''
                            }`}
                          >
                            <input
                              type="text"
                              value={header.officeInfo}
                              onChange={(e) => handleHeaderChange('officeInfo', e.target.value)}
                              className="w-full font-bold text-xs text-slate-700 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none px-1.5 py-0.5 border border-transparent hover:border-purple-200"
                            />
                            <input
                              type="text"
                              value={header.departmentInfo}
                              onChange={(e) => handleHeaderChange('departmentInfo', e.target.value)}
                              className="w-full font-bold text-xs text-slate-700 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none px-1.5 py-0.5 border border-transparent hover:border-purple-200"
                            />
                            <input
                              type="text"
                              value={header.schoolName}
                              onChange={(e) => handleHeaderChange('schoolName', e.target.value)}
                              className="w-full font-extrabold text-sm text-blue-900 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none px-1.5 py-0.5 border border-transparent hover:border-purple-200"
                            />
                          </div>

                          {/* Right Side: Kingdom Header */}
                          <div className="text-center space-y-0.5">
                            <input
                              type="text"
                              value={header.kingdomTitle}
                              onChange={(e) => handleHeaderChange('kingdomTitle', e.target.value)}
                              className="text-center font-bold text-sm text-blue-900 tracking-wider w-full bg-transparent hover:bg-purple-50 focus:bg-purple-50 focus:ring-1 focus:ring-purple-400 rounded transition outline-none p-0.5"
                              style={{ fontFamily: getFontFamilyCss(styles.headingFontFamily) }}
                            />
                            <input
                              type="text"
                              value={header.kingdomMotto}
                              onChange={(e) => handleHeaderChange('kingdomMotto', e.target.value)}
                              className="text-center font-bold text-xs text-blue-900 tracking-wide w-full bg-transparent hover:bg-purple-50 focus:bg-purple-50 focus:ring-1 focus:ring-purple-400 rounded transition outline-none p-0.5"
                              style={{ fontFamily: getFontFamilyCss(styles.headingFontFamily) }}
                            />
                            <div className="text-blue-900 text-xs font-bold my-1 tracking-wider">
                              {header.headerEmblemText || '— ༺ ៚ ༻ —'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Top Kingdom Header */}
                        {styles.showKingdomHeader && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSection('kingdom_header');
                            }}
                            style={getSectionStyle('kingdom_header')}
                            className={`relative group rounded-xl p-2 mb-4 pb-2 border transition cursor-pointer ${
                              selectedSection === 'kingdom_header'
                                ? 'border-purple-500 bg-purple-50/30 ring-2 ring-purple-400/50'
                                : 'border-b-slate-200 hover:border-purple-200 hover:bg-purple-50/10'
                            }`}
                          >
                            <div
                              className={`absolute -top-3 left-3 z-30 flex items-center gap-1 bg-purple-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md transition ${
                                selectedSection === 'kingdom_header' ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                              }`}
                            >
                              <span>👑 ក្បាលសំបុត្រជាតិ</span>
                              <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-purple-400">
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('kingdom_header', 'left'); }} className="hover:text-amber-300">◀</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('kingdom_header', 'right'); }} className="hover:text-amber-300">▶</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('kingdom_header', 'up'); }} className="hover:text-amber-300">▲</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('kingdom_header', 'down'); }} className="hover:text-amber-300">▼</button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={header.kingdomTitle}
                              onChange={(e) => handleHeaderChange('kingdomTitle', e.target.value)}
                              className="text-center font-bold text-base text-blue-900 tracking-wider w-full bg-transparent hover:bg-purple-50 focus:bg-purple-50 focus:ring-1 focus:ring-purple-400 rounded transition outline-none p-1"
                              style={{ fontFamily: getFontFamilyCss(styles.headingFontFamily) }}
                            />
                            <input
                              type="text"
                              value={header.kingdomMotto}
                              onChange={(e) => handleHeaderChange('kingdomMotto', e.target.value)}
                              className="text-center font-bold text-xs text-blue-900 tracking-wide w-full bg-transparent hover:bg-purple-50 focus:bg-purple-50 focus:ring-1 focus:ring-purple-400 rounded transition outline-none p-0.5 mt-0.5"
                              style={{ fontFamily: getFontFamilyCss(styles.headingFontFamily) }}
                            />
                            <div className="text-center text-blue-900 text-xs font-bold my-1 tracking-wider">
                              {header.headerEmblemText || '— ༺ ៚ ༻ —'}
                            </div>
                          </div>
                        )}

                        {/* Ministry, School Info & Teacher Metadata Block */}
                        <div className="grid grid-cols-2 gap-4 mb-4 items-start">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSection('school_info');
                            }}
                            style={getSectionStyle('school_info')}
                            className={`relative group rounded-xl p-1.5 border transition cursor-pointer ${
                              selectedSection === 'school_info'
                                ? 'border-purple-500 bg-purple-50/30 ring-2 ring-purple-400/50'
                                : 'border-transparent hover:border-purple-200'
                            }`}
                          >
                            <div
                              className={`absolute -top-3 left-2 z-30 flex items-center gap-1 bg-purple-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md transition ${
                                selectedSection === 'school_info' ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                              }`}
                            >
                              <span>🏢 សាលារៀន</span>
                              <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-purple-400">
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('school_info', 'left'); }} className="hover:text-amber-300">◀</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('school_info', 'right'); }} className="hover:text-amber-300">▶</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('school_info', 'up'); }} className="hover:text-amber-300">▲</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('school_info', 'down'); }} className="hover:text-amber-300">▼</button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={header.officeInfo}
                              onChange={(e) => handleHeaderChange('officeInfo', e.target.value)}
                              className="w-full font-bold text-xs text-slate-700 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none px-1.5 py-0.5 border border-transparent hover:border-purple-200"
                            />
                            <input
                              type="text"
                              value={header.departmentInfo}
                              onChange={(e) => handleHeaderChange('departmentInfo', e.target.value)}
                              className="w-full font-bold text-xs text-slate-700 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none px-1.5 py-0.5 border border-transparent hover:border-purple-200"
                            />
                            <input
                              type="text"
                              value={header.schoolName}
                              onChange={(e) => handleHeaderChange('schoolName', e.target.value)}
                              className="w-full font-extrabold text-sm text-blue-900 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none px-1.5 py-0.5 border border-transparent hover:border-purple-200"
                            />
                          </div>

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSection('teacher_info');
                            }}
                            style={getSectionStyle('teacher_info')}
                            className={`relative group rounded-xl p-1.5 border transition cursor-pointer ${
                              selectedSection === 'teacher_info'
                                ? 'border-purple-500 bg-purple-50/30 ring-2 ring-purple-400/50'
                                : 'border-transparent hover:border-purple-200'
                            }`}
                          >
                            <div
                              className={`absolute -top-3 right-2 z-30 flex items-center gap-1 bg-purple-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md transition ${
                                selectedSection === 'teacher_info' ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                              }`}
                            >
                              <span>👨‍🏫 ព័ត៌មានគ្រូ</span>
                              <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-purple-400">
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('teacher_info', 'left'); }} className="hover:text-amber-300">◀</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('teacher_info', 'right'); }} className="hover:text-amber-300">▶</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('teacher_info', 'up'); }} className="hover:text-amber-300">▲</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('teacher_info', 'down'); }} className="hover:text-amber-300">▼</button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={header.teacherName}
                              onChange={(e) => handleHeaderChange('teacherName', e.target.value)}
                              placeholder="ឈ្មោះគ្រូបង្រៀន..."
                              className="w-full text-right font-bold text-xs text-slate-800 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none px-1.5 py-0.5 border border-transparent hover:border-purple-200"
                            />
                            <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-600">
                              <span>កម្រិតថ្នាក់៖</span>
                              <input
                                type="text"
                                value={header.gradeLevel}
                                onChange={(e) => handleHeaderChange('gradeLevel', e.target.value)}
                                className="w-24 text-right font-bold text-xs text-slate-800 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none px-1 py-0.5 border border-transparent hover:border-purple-200"
                              />
                            </div>
                            <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-600">
                              <span>ឆ្នាំសិក្សា៖</span>
                              <input
                                type="text"
                                value={header.academicYear}
                                onChange={(e) => handleHeaderChange('academicYear', e.target.value)}
                                className="w-28 text-right font-bold text-xs text-slate-800 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none px-1 py-0.5 border border-transparent hover:border-purple-200"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Main Document Title */}
                    {(header.docTitle || header.docSubtitle) && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSection('doc_title');
                        }}
                        style={getSectionStyle('doc_title')}
                        className={`relative group rounded-xl p-2 my-4 border transition cursor-pointer ${
                          selectedSection === 'doc_title'
                            ? 'border-purple-500 bg-purple-50/30 ring-2 ring-purple-400/50'
                            : 'border-y-slate-200 hover:border-purple-200 hover:bg-purple-50/10'
                        }`}
                      >
                        <div
                          className={`absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-purple-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md transition ${
                            selectedSection === 'doc_title' ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                          }`}
                        >
                          <span>📑 ចំណងជើងធំ (Title)</span>
                          <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-purple-400">
                            <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('doc_title', 'left'); }} className="hover:text-amber-300">◀</button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('doc_title', 'right'); }} className="hover:text-amber-300">▶</button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('doc_title', 'up'); }} className="hover:text-amber-300">▲</button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('doc_title', 'down'); }} className="hover:text-amber-300">▼</button>
                          </div>
                        </div>

                        {header.docTitle && (
                          <input
                            type="text"
                            value={header.docTitle}
                            onChange={(e) => handleHeaderChange('docTitle', e.target.value)}
                            className="text-center font-extrabold text-lg sm:text-xl text-blue-900 w-full bg-transparent hover:bg-purple-50 focus:bg-purple-50 focus:ring-1 focus:ring-purple-400 rounded outline-none p-1"
                            style={{ fontFamily: getFontFamilyCss(styles.headingFontFamily) }}
                          />
                        )}
                        {header.docSubtitle && (
                          <input
                            type="text"
                            value={header.docSubtitle}
                            onChange={(e) => handleHeaderChange('docSubtitle', e.target.value)}
                            className="text-center font-bold text-xs text-slate-600 w-full bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none p-0.5 mt-1"
                          />
                        )}
                      </div>
                    )}

                    {/* Main Content Area Wrapper with Style and Nudge */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSection('main_content');
                      }}
                      style={getSectionStyle('main_content')}
                      className={`relative group rounded-xl p-1 my-3 transition ${
                        selectedSection === 'main_content' ? 'ring-2 ring-purple-500/80 bg-purple-50/10' : ''
                      }`}
                    >
                      <div
                        className={`absolute -top-3 left-3 z-30 flex items-center gap-1 bg-purple-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md transition ${
                          selectedSection === 'main_content' ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                        }`}
                      >
                        <span>📊 តារាង/មាតិកាឯកសារ</span>
                        <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-purple-400">
                          <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('main_content', 'left'); }} className="hover:text-amber-300">◀</button>
                          <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('main_content', 'right'); }} className="hover:text-amber-300">▶</button>
                          <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('main_content', 'up'); }} className="hover:text-amber-300">▲</button>
                          <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('main_content', 'down'); }} className="hover:text-amber-300">▼</button>
                        </div>
                      </div>

                    {/* Interactive Timetable Content Section */}
                    {documentType === 'timetable' && editableTimetable && (
                      <div className="my-4 space-y-3">
                        {/* Quick Subject Inserter Floating Ribbon */}
                        <div className="p-2 bg-purple-50 rounded-xl border border-purple-200 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-purple-950 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              <span>បញ្ចូលមុខវិជ្ជា (ចុចលើប្រអប់តារាង រួចចុចមុខវិជ្ជា)៖</span>
                            </span>
                            {COMMON_PRIMARY_SUBJECTS.map((sub) => (
                              <button
                                key={sub.label}
                                type="button"
                                onClick={() => handleInsertQuickSubject(sub.label)}
                                className="px-2 py-0.5 rounded-md bg-white hover:bg-purple-200 border border-purple-200 text-[11px] font-bold text-slate-800 transition flex items-center gap-0.5 active:scale-95 shadow-2xs"
                              >
                                <span>{sub.icon}</span>
                                <span>{sub.label}</span>
                              </button>
                            ))}
                          </div>
                          {selectedCell && (
                            <span className="text-[10px] bg-purple-200 text-purple-950 px-2 py-0.5 rounded font-bold">
                              ជួរទី {selectedCell.rowIndex + 1} ({String(selectedCell.day).toUpperCase()})
                            </span>
                          )}
                        </div>

                        {/* Interactive Table on Sheet */}
                        <div className="overflow-x-auto border-2 border-slate-800 rounded-lg">
                          <table className="w-full border-collapse text-center text-xs">
                            <thead>
                              <tr className="bg-blue-50 text-blue-950 font-bold border-b-2 border-slate-800">
                                <th className="p-2 border border-slate-300 w-24">ម៉ោង / វេន</th>
                                <th className="p-2 border border-slate-300 w-20">រយៈពេល</th>
                                <th className="p-2 border border-slate-300">ថ្ងៃចន្ទ</th>
                                <th className="p-2 border border-slate-300">ថ្ងៃអង្គារ</th>
                                <th className="p-2 border border-slate-300">ថ្ងៃពុធ</th>
                                <th className="p-2 border border-slate-300">ថ្ងៃព្រហស្បតិ៍</th>
                                <th className="p-2 border border-slate-300">ថ្ងៃសុក្រ</th>
                                <th className="p-2 border border-slate-300">ថ្ងៃសៅរ៍</th>
                              </tr>
                            </thead>
                            <tbody>
                              {editableTimetable.rows?.map((row: TimetableRow, rIdx: number) => {
                                const isBreak = row.type === 'break' || row.mon === 'ចេញលេង' || row.tue === 'ចេញលេង';
                                const isFlag = row.type === 'flag' || row.mon === 'គោរពទង់ជាតិ';
                                return (
                                  <tr
                                    key={rIdx}
                                    className={`border-b border-slate-300 ${
                                      isBreak ? 'bg-amber-50 font-bold' : isFlag ? 'bg-blue-50 font-bold' : rIdx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'
                                    }`}
                                  >
                                    <td className="p-1 border border-slate-300 font-bold text-blue-900">
                                      <input
                                        type="text"
                                        value={row.time}
                                        onChange={(e) => handleTimetableCellChange(rIdx, 'time', e.target.value)}
                                        className="w-full text-center bg-transparent outline-none font-bold text-xs p-0.5 hover:bg-purple-50 rounded"
                                      />
                                    </td>
                                    <td className="p-1 border border-slate-300 text-slate-600">
                                      <input
                                        type="text"
                                        value={row.duration}
                                        onChange={(e) => handleTimetableCellChange(rIdx, 'duration', e.target.value)}
                                        className="w-full text-center bg-transparent outline-none text-xs p-0.5 hover:bg-purple-50 rounded"
                                      />
                                    </td>
                                    {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const).map((dayKey) => {
                                      const isSelected = selectedCell?.rowIndex === rIdx && selectedCell?.day === dayKey;
                                      return (
                                        <td
                                          key={dayKey}
                                          className={`p-1 border border-slate-300 transition ${
                                            isSelected ? 'bg-purple-100 ring-2 ring-purple-600 font-bold' : ''
                                          }`}
                                        >
                                          <input
                                            type="text"
                                            value={row[dayKey] || ''}
                                            onFocus={() => setSelectedCell({ rowIndex: rIdx, day: dayKey })}
                                            onChange={(e) => handleTimetableCellChange(rIdx, dayKey, e.target.value)}
                                            className="w-full text-center bg-transparent outline-none text-xs p-0.5 hover:bg-purple-50 rounded font-medium"
                                          />
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Direct Notes under Timetable */}
                        {toggles.showNotesSection && (
                          <div className="mt-3 p-3 bg-slate-50 border-l-4 border-blue-900 rounded text-xs text-slate-800 space-y-1">
                            <div className="font-bold text-blue-900">📌 សម្គាល់ និងការណែនាំ៖</div>
                            <textarea
                              rows={2}
                              value={editableTimetable.notes?.join('\n') || ''}
                              onChange={(e) => {
                                pushToHistory();
                                setEditableTimetable({
                                  ...editableTimetable,
                                  notes: e.target.value.split('\n'),
                                });
                              }}
                              className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-purple-400"
                              placeholder="បញ្ចូលចំណាំ ឬការណែនាំ..."
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive Syllabus Content Section */}
                    {documentType === 'syllabus' && editableSyllabus && editableSyllabus.length > 0 && (
                      <div className="my-4 space-y-5">
                        {editableSyllabus.map((subjectItem, sIdx) => (
                          <div key={sIdx} className="space-y-3">
                            <div className="p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 flex items-center justify-between">
                              <div>
                                <h4
                                  className="font-bold text-sm text-blue-900"
                                  style={{ fontFamily: getFontFamilyCss(styles.headingFontFamily) }}
                                >
                                  មុខវិជ្ជា៖ {subjectItem.name} {subjectItem.grade ? `(${subjectItem.grade})` : ''}
                                </h4>
                                {subjectItem.description && (
                                  <p className="text-xs text-slate-600 mt-0.5">{subjectItem.description}</p>
                                )}
                              </div>
                            </div>

                            {toggles.showCompetencies && subjectItem.coreCompetencies && subjectItem.coreCompetencies.length > 0 && (
                              <div className="p-2.5 bg-slate-50 border-l-4 border-blue-800 rounded text-xs text-slate-800 space-y-1">
                                <strong className="text-blue-950 font-bold" style={{ fontFamily: getFontFamilyCss(styles.headingFontFamily) }}>
                                  សមត្ថភាពគន្លឹះត្រូវសម្រេច៖
                                </strong>
                                <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-700">
                                  {subjectItem.coreCompetencies.map((comp: string, cIdx: number) => (
                                    <li key={cIdx}>{comp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {subjectItem.trimesters?.map((tri: any, tIdx: number) => (
                              <div key={tIdx} className="space-y-2">
                                <div
                                  className="font-bold text-xs text-blue-900 flex items-center gap-1"
                                  style={{ fontFamily: getFontFamilyCss(styles.headingFontFamily) }}
                                >
                                  <span>📌 {tri.title} {tri.period ? `(${tri.period})` : ''}</span>
                                </div>

                                <div className="overflow-x-auto border border-slate-300 rounded-lg">
                                  <table className="w-full border-collapse text-xs">
                                    <thead>
                                      <tr className="bg-blue-50 text-blue-950 font-bold border-b border-slate-300">
                                        {toggles.showMonthColumn && <th className="p-2 border border-slate-300 text-left w-16">ខែ</th>}
                                        {toggles.showWeekColumn !== false && <th className="p-2 border border-slate-300 text-center w-16">សប្តាហ៍</th>}
                                        <th className="p-2 border border-slate-300 text-left">ខ្លឹមសារមេរៀន (សៀវភៅសិក្សាគោល)</th>
                                        {toggles.showHoursColumn && <th className="p-2 border border-slate-300 text-center w-12">ម៉ោង</th>}
                                        {toggles.showObjectiveColumn && <th className="p-2 border border-slate-300 text-left">លទ្ធផលសិក្សា</th>}
                                        {toggles.showBookPages && <th className="p-2 border border-slate-300 text-center w-20">ទំព័រ</th>}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {tri.chapters?.map((ch: any, cIdx: number) => (
                                        <tr key={cIdx} className={cIdx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
                                          {toggles.showMonthColumn && (
                                            <td className="p-1.5 border border-slate-300 font-bold text-blue-900 text-center">
                                              <div>{ch.month || '-'}</div>
                                              <div className="text-[10px] text-slate-500 font-normal">{ch.chapterNo}</div>
                                            </td>
                                          )}
                                          {toggles.showWeekColumn !== false && (
                                            <td className="p-1.5 border border-slate-300 text-center font-bold text-blue-900">
                                              {ch.weekNo || '-'}
                                            </td>
                                          )}
                                          <td className="p-1.5 border border-slate-300">
                                            <div className="font-bold text-slate-900">{ch.title}</div>
                                            {toggles.showTopicsList && ch.topics && ch.topics.length > 0 && (
                                              <ul className="mt-1 space-y-0.5 list-disc list-inside text-[11px] text-slate-600 font-normal">
                                                {ch.topics.map((t: string, topIdx: number) => (
                                                  <li key={topIdx}>{t}</li>
                                                ))}
                                              </ul>
                                            )}
                                          </td>
                                          {toggles.showHoursColumn && (
                                            <td className="p-1.5 border border-slate-300 text-center font-bold">
                                              {ch.hours || '-'}
                                            </td>
                                          )}
                                          {toggles.showObjectiveColumn && (
                                            <td className="p-1.5 border border-slate-300 text-slate-700">
                                              {ch.objective || '-'}
                                            </td>
                                          )}
                                          {toggles.showBookPages && (
                                            <td className="p-1.5 border border-slate-300 text-center text-[10px]">
                                              {ch.studentBookPages && <div>ស.ស: {ch.studentBookPages}</div>}
                                              {ch.teacherBookPages && <div>ស.គ: {ch.teacherBookPages}</div>}
                                              {!ch.studentBookPages && !ch.teacherBookPages && '-'}
                                            </td>
                                          )}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Custom Table Content (Student Roster, Attendance, Reports) in WYSIWYG Sheet */}
                    {customTableHtml && documentType !== 'timetable' && documentType !== 'syllabus' && (
                      <div className="my-4 pdf-custom-table-container select-text space-y-3">
                        <div
                          className="w-full overflow-x-auto text-xs"
                          dangerouslySetInnerHTML={{ __html: customTableHtml }}
                        />
                        {toggles.showNotesSection !== false && header.footerNote && (
                          <div className="mt-3 p-2.5 bg-slate-50 border-l-4 border-blue-900 rounded text-xs text-slate-800 space-y-1">
                            <div className="font-bold text-blue-900">📌 សម្គាល់ និងការណែនាំបន្ថែម៖</div>
                            <p className="text-slate-700 whitespace-pre-line">{header.footerNote}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive Quiz & Illustrated Cover Content in WYSIWYG Sheet */}
                    {documentType === 'quiz' && quizData && (
                      <div className="my-4 space-y-6">
                        {/* Cover Page Preview in WYSIWYG */}
                        {toggles.showCoverPage && (
                          <div className="p-4 bg-emerald-50/60 rounded-2xl border-2 border-emerald-400 text-center space-y-3 shadow-md">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-white font-bold text-xs shadow-xs">
                              <span>🎨 ទំព័រទី ១ ៖ ក្របសៀវភៅគរុកោសល្យ (Illustrated Book Cover)</span>
                            </div>
                            <div className="max-w-[460px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500 bg-white relative">
                              <img
                                src={quizData.imageUrl && quizData.imageUrl.startsWith('data:') ? quizData.imageUrl : QUIZ_BOOK_COVER_BASE64}
                                alt="Quiz Book Cover"
                                className="w-full h-auto block object-contain"
                              />
                            </div>
                            <p className="text-xs text-emerald-800 font-medium">
                              ក្របសៀវភៅនេះនឹងត្រូវបានបោះពុម្ពជាទំព័រមុខបង្អស់នៃសៀវភៅវិញ្ញាសា
                            </p>
                          </div>
                        )}

                        {/* Quiz Questions List in WYSIWYG */}
                        <div className="space-y-4">
                          <div className="p-3 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-xl shadow-sm flex items-center justify-between">
                            <div>
                              <h3 className="font-extrabold text-base font-moul">{quizData.title}</h3>
                              <p className="text-xs text-emerald-200 mt-0.5">
                                មុខវិជ្ជា៖ {quizData.subject} • {quizData.grade} • ចំនួនសំណួរ៖ {quizData.questions?.length || 0}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-lg bg-white/20 text-xs font-bold font-mono">
                              {quizData.examDuration || '៤៥ នាទី'}
                            </span>
                          </div>

                          {quizData.questions?.map((q, idx) => (
                            <div
                              key={q.id || idx}
                              className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 text-left"
                            >
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="font-bold text-sm text-slate-800 flex-1 leading-snug">
                                  {q.question}
                                </div>
                              </div>

                              {q.options && q.options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8 pt-1">
                                  {q.options.map((opt, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                                        opt.isCorrect
                                          ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                                          : 'bg-slate-50 border-slate-200 text-slate-700'
                                      }`}
                                    >
                                      <span className="w-5 h-5 rounded-md border border-slate-300 bg-white flex items-center justify-center font-bold text-[10px]">
                                        {String.fromCharCode(65 + oIdx)}
                                      </span>
                                      <span>{opt.text}</span>
                                      {opt.isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Answer Key in WYSIWYG */}
                        {toggles.showAnswerKey && (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 mt-6">
                            <h4 className="font-bold text-sm text-center text-purple-900 font-moul">
                              🔑 គន្លឹះចម្លើយ (Answer Key)
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              {quizData.questions?.map((q, idx) => {
                                const correctOpt = q.options?.find(o => o.isCorrect);
                                const ans = q.correctAnswer || (correctOpt ? `${String.fromCharCode(65 + q.options.indexOf(correctOpt))}. ${correctOpt.text}` : (q.trueFalseAnswer !== undefined ? (q.trueFalseAnswer ? 'ត្រូវ' : 'ខុស') : '-'));
                                return (
                                  <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                                    <span className="font-bold text-slate-600">សំណួរ {idx + 1}៖</span>
                                    <span className="font-extrabold text-emerald-700">{ans}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    </div>

                    {/* Signatures & Dates Block */}
                    {styles.showSignatures && (
                      <div className="mt-8 pt-4 border-t border-slate-200">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSection('location_date');
                          }}
                          style={getSectionStyle('location_date')}
                          className={`relative group rounded-xl p-1 mb-4 flex justify-end transition cursor-pointer ${
                            selectedSection === 'location_date' ? 'ring-2 ring-purple-500 bg-purple-50/40' : 'hover:ring-1 hover:ring-purple-200'
                          }`}
                        >
                          <div
                            className={`absolute -top-3 right-3 z-30 flex items-center gap-1 bg-purple-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md transition ${
                              selectedSection === 'location_date' ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                            }`}
                          >
                            <span>📅 ទីកន្លែង & កាលបរិច្ឆេទ</span>
                            <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-purple-400">
                              <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('location_date', 'left'); }} className="hover:text-amber-300">◀</button>
                              <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('location_date', 'right'); }} className="hover:text-amber-300">▶</button>
                              <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('location_date', 'up'); }} className="hover:text-amber-300">▲</button>
                              <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('location_date', 'down'); }} className="hover:text-amber-300">▼</button>
                            </div>
                          </div>

                          <textarea
                            rows={2}
                            value={header.locationAndDate}
                            onChange={(e) => handleHeaderChange('locationAndDate', e.target.value)}
                            className="w-72 text-right bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none p-1 font-bold text-xs text-slate-700 leading-relaxed border border-transparent hover:border-purple-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-8 text-center items-start">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSection('left_signature');
                            }}
                            style={getSectionStyle('left_signature')}
                            className={`relative group rounded-xl p-2 border transition cursor-pointer ${
                              selectedSection === 'left_signature' ? 'border-purple-500 bg-purple-50/40 ring-2 ring-purple-400/50' : 'border-transparent hover:border-purple-200'
                            }`}
                          >
                            <div
                              className={`absolute -top-3 left-3 z-30 flex items-center gap-1 bg-purple-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md transition ${
                                selectedSection === 'left_signature' ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                              }`}
                            >
                              <span>✍️ ហត្ថលេខាឆ្វេង/ត្រា</span>
                              <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-purple-400">
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('left_signature', 'left'); }} className="hover:text-amber-300">◀</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('left_signature', 'right'); }} className="hover:text-amber-300">▶</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('left_signature', 'up'); }} className="hover:text-amber-300">▲</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('left_signature', 'down'); }} className="hover:text-amber-300">▼</button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={header.leftSignatureTitle}
                              onChange={(e) => handleHeaderChange('leftSignatureTitle', e.target.value)}
                              className="w-full text-center font-bold text-xs text-slate-800 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none p-1"
                            />
                            <div className="h-16 flex items-center justify-center">
                              {styles.showStampBox && (
                                <div className="border border-dashed border-red-300 bg-red-50/40 text-[10px] text-red-500 p-2 rounded w-28 text-center font-bold">
                                  ទីតាំងបោះត្រា
                                </div>
                              )}
                            </div>
                            <input
                              type="text"
                              value={header.leftSignatureName}
                              onChange={(e) => handleHeaderChange('leftSignatureName', e.target.value)}
                              placeholder="(ហត្ថលេខា និងឈ្មោះ)"
                              className="w-full text-center font-bold text-xs text-slate-800 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none p-1"
                            />
                          </div>

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSection('right_signature');
                            }}
                            style={getSectionStyle('right_signature')}
                            className={`relative group rounded-xl p-2 border transition cursor-pointer ${
                              selectedSection === 'right_signature' ? 'border-purple-500 bg-purple-50/40 ring-2 ring-purple-400/50' : 'border-transparent hover:border-purple-200'
                            }`}
                          >
                            <div
                              className={`absolute -top-3 right-3 z-30 flex items-center gap-1 bg-purple-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md transition ${
                                selectedSection === 'right_signature' ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                              }`}
                            >
                              <span>✍️ ហត្ថលេខាស្តាំ</span>
                              <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-purple-400">
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('right_signature', 'left'); }} className="hover:text-amber-300">◀</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('right_signature', 'right'); }} className="hover:text-amber-300">▶</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('right_signature', 'up'); }} className="hover:text-amber-300">▲</button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); nudgeSection('right_signature', 'down'); }} className="hover:text-amber-300">▼</button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={header.rightSignatureTitle}
                              onChange={(e) => handleHeaderChange('rightSignatureTitle', e.target.value)}
                              className="w-full text-center font-bold text-xs text-slate-800 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none p-1"
                            />
                            <div className="h-16 flex items-center justify-center">
                              <span className="text-[10px] text-slate-300">ហត្ថលេខាគ្រូ</span>
                            </div>
                            <input
                              type="text"
                              value={header.rightSignatureName}
                              onChange={(e) => handleHeaderChange('rightSignatureName', e.target.value)}
                              placeholder="(ហត្ថលេខា និងឈ្មោះ)"
                              className="w-full text-center font-bold text-xs text-slate-800 bg-transparent hover:bg-purple-50 focus:bg-purple-50 rounded outline-none p-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer Note */}
                    {header.footerNote && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSection('notes_section');
                        }}
                        style={getSectionStyle('notes_section')}
                        className={`relative group rounded-lg p-2 mt-8 pt-2 border-t border-slate-200 text-center text-[10px] text-slate-400 cursor-pointer transition ${
                          selectedSection === 'notes_section' ? 'ring-2 ring-purple-500 bg-purple-50/40 text-slate-700' : 'hover:bg-purple-50/10'
                        }`}
                      >
                        {header.footerNote}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
