import React, { useState, useEffect } from 'react';
import { PLCMeeting, TeacherProfile } from '../types';
import { getThemeBackgroundCss } from '../utils/customPrintFont';
import {
  FileText,
  Printer,
  FileDown,
  X,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Award,
  Sparkles,
  Settings,
  Sliders,
  Palette,
  Layout,
  Type,
  ShieldCheck,
  Edit3,
  Download,
  RotateCcw,
  Check,
  BookOpen,
  Layers,
  Wand2,
  ZoomIn,
  RefreshCw
} from 'lucide-react';

interface PLCMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting?: PLCMeeting | null;
  teacher: TeacherProfile;
  onSaveMeeting: (meeting: PLCMeeting) => void;
  onShowToast: (msg: string) => void;
  initialFontFamily?: string;
  initialTheme?: string;
  initialFontSizeScale?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PLCMeetingModal: React.FC<PLCMeetingModalProps> = ({
  isOpen,
  onClose,
  meeting,
  teacher,
  onSaveMeeting,
  onShowToast,
  initialFontFamily = 'Kantumruy Pro',
  initialTheme = 'default',
  initialFontSizeScale = 'md',
}) => {
  // Form state initialized with meeting or default MoEYS template
  const [province, setProvince] = useState(meeting?.province || 'ខេត្ត/រាជធានី ភ្នំពេញ');
  const [district, setDistrict] = useState(meeting?.district || 'ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុក/ខណ្ឌ ...)....................');
  const [school, setSchool] = useState(meeting?.school || teacher.school || 'សាលាបឋមសិក្សា ហ៊ុន សែន');
  const [gradeLevel, setGradeLevel] = useState(meeting?.gradeLevel || teacher.grade || 'ថ្នាក់ទី ៤');
  const [meetingNo, setMeetingNo] = useState(meeting?.meetingNo || '០១');
  const [month, setMonth] = useState(meeting?.month || 'សីហា ២០២៦');
  const [academicYear, setAcademicYear] = useState(meeting?.academicYear || teacher.academicYear || '២០២៥ - ២០២៦');
  const [date, setDate] = useState(meeting?.date || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(meeting?.startTime || '08:00');
  const [endTime, setEndTime] = useState(meeting?.endTime || '11:00');
  const [location, setLocation] = useState(meeting?.location || 'បន្ទប់ប្រជុំគ្រូបង្រៀនថ្នាក់បឋម');
  const [chairperson, setChairperson] = useState(meeting?.chairperson || teacher.name || 'លោកគ្រូ ឌុក សុភ័ក្រ');
  const [chairpersonRole, setChairpersonRole] = useState(meeting?.chairpersonRole || 'ប្រធានក្រុមបច្ចេកទេស');
  const [secretary, setSecretary] = useState(meeting?.secretary || 'អ្នកគ្រូ ចាន់ ថាច');
  const [secretaryRole, setSecretaryRole] = useState(meeting?.secretaryRole || 'លេខាធិការក្រុមបច្ចេកទេស');
  const [principalTitle, setPrincipalTitle] = useState('បានឃើញ និងឯកភាព នាយកសាលា');

  const [presentCount, setPresentCount] = useState(meeting?.presentCount ?? 12);
  const [absentCount, setAbsentCount] = useState(meeting?.absentCount ?? 0);
  const [excusedCount, setExcusedCount] = useState(meeting?.excusedCount ?? 0);
  const [unexcusedCount, setUnexcusedCount] = useState(meeting?.unexcusedCount ?? 0);

  // Map fontSizeScale to PDF font size
  const mappedPdfSize = initialFontSizeScale === 'sm' ? 'sm' : initialFontSizeScale === 'lg' ? 'lg' : initialFontSizeScale === 'xl' ? 'xl' : 'base';

  // PDF Customizer Settings state (Matching CustomizeModal capabilities)
  const [showPdfCustomizer, setShowPdfCustomizer] = useState(false);
  const [customizerActiveTab, setCustomizerActiveTab] = useState<'all' | 'fonts' | 'notebook' | 'presets' | 'sizes' | 'page'>('all');
  const [pdfFontSize, setPdfFontSize] = useState<'sm' | 'base' | 'lg' | 'xl' | '2xl'>(mappedPdfSize);
  const [pdfFontFamily, setPdfFontFamily] = useState<string>(initialFontFamily || 'Kantumruy Pro');
  const [pdfHeadingFont, setPdfHeadingFont] = useState<'Moul' | 'SameAsBody' | 'Kantumruy Pro' | 'Koulen' | 'Bayon' | 'Preahvihear'>('Moul');
  const [pdfColorTheme, setPdfColorTheme] = useState<string>(initialTheme || 'default');
  const [pdfPaperSize, setPdfPaperSize] = useState<'A4' | 'Letter'>('A4');
  const [pdfOrientation, setPdfOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showKingdomHeader, setShowKingdomHeader] = useState(true);
  const [showSignatures, setShowSignatures] = useState(true);
  const [showStampBox, setShowStampBox] = useState(true);
  const [watermarkText, setWatermarkText] = useState('');

  // Sync with prop changes when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialFontFamily) setPdfFontFamily(initialFontFamily);
      if (initialTheme) setPdfColorTheme(initialTheme);
      if (initialFontSizeScale) {
        const mapped = initialFontSizeScale === 'sm' ? 'sm' : initialFontSizeScale === 'lg' ? 'lg' : initialFontSizeScale === 'xl' ? 'xl' : 'base';
        setPdfFontSize(mapped);
      }
    }
  }, [isOpen, initialFontFamily, initialTheme, initialFontSizeScale]);

  // 13 Full Authentic Khmer Typography options (matching CustomizeModal)
  const fontOptions = [
    { id: 'Battambang', name: 'អក្សរ បាត់ដំបង (Battambang)', desc: 'ស្ដង់ដារសៀវភៅសិក្សា ស្រទន់ ច្បាស់ ស្រួលអានបំផុត' },
    { id: 'Kantumruy Pro', name: 'អក្សរ កន្ទុំរុយ ប្រូ (Kantumruy Pro)', desc: 'រចនាបទទំនើប ស្រស់ស្អាត ស្ដង់ដារក្រសួង' },
    { id: 'Noto Sans Khmer', name: 'អក្សរ ញូសាន់ស (Noto Sans Khmer)', desc: 'ច្បាស់ដាច់ៗ ស្តង់ដារអន្តរជាតិ Google' },
    { id: 'Siemreap', name: 'អក្សរ សៀមរាប (Siemreap)', desc: 'រចនាបទខ្មែរបុរាណ ស្រទន់ សោមនស្ស' },
    { id: 'Content', name: 'អក្សរ ខនថិន (Content / កូនខ្មែរ)', desc: 'ពុម្ពអក្សរសៀវភៅពុម្ព និងឯកសាររដ្ឋបាលក្រសួង' },
    { id: 'Hanuman', name: 'អក្សរ ហនុមាន (Hanuman Serif)', desc: 'ពុម្ពអក្សរមានក្បាល បែបកាសែត និងសៀវភៅប្រវត្តិសាស្ត្រ' },
    { id: 'Preahvihear', name: 'អក្សរ ព្រះវិហារ (Preahvihear)', desc: 'រចនាបទក្បាច់រចនាប្រណិត ស្រស់ឆើតឆាយ' },
    { id: 'Suwannaphum', name: 'អក្សរ សុវណ្ណភូមិ (Suwannaphum)', desc: 'អក្សរក្បាលមូលស្រស់ស្អាត ស័ក្តិសមសម្រាប់បឋមសិក្សា' },
    { id: 'Dangrek', name: 'អក្សរ ដងរែក (Dangrek Round)', desc: 'អក្សររាងមូលរួញ គួរឱ្យស្រឡាញ់ និងស្រួលទស្សនា' },
    { id: 'Koulen', name: 'អក្សរ កូលេន (Koulen Display)', desc: 'អក្សរធំក្រាស់ច្បាស់ សម្រាប់ចំណងជើង និងប៉ាណូ' },
    { id: 'Bayon', name: 'អក្សរ បាយ័ន (Bayon Stone)', desc: 'រចនាបទប្រាសាទបុរាណសិលាចារឹកខ្មែរ' },
    { id: 'Bokor', name: 'អក្សរ បូកគោ (Bokor Vintage)', desc: 'រចនាបទបុរាណបែបសម័យសង្គមរាស្ត្រនិយម' },
    { id: 'Moul', name: 'អក្សរ មូល (Moul Official)', desc: 'អក្សរមូលផ្លូវការសម្រាប់ក្បាលលិខិត និងចំណងជើងធំ' },
  ];

  // Notebook Grids & Theme Backgrounds (matching CustomizeModal)
  const notebookThemes = [
    {
      id: 'notebook-grid',
      name: 'ក្រឡាក្រដាសសៀវភៅគណិត (Math Grid)',
      desc: 'ក្រឡាការ៉ូ ៥មម បន្ទាត់ខៀវស្រាល + បន្ទាត់គែមក្រហមសរសេរ',
      badge: 'ពេញនិយម',
      icon: '📐',
    },
    {
      id: 'notebook-lines',
      name: 'ក្រដាសសរសេរបន្ទាត់កត់ត្រា (Ruled Lined)',
      desc: 'បន្ទាត់ផ្តេកខៀវស្តង់ដារ + បន្ទាត់គែមក្រហមសៀវភៅកត់',
      badge: 'សៀវភៅសិស្ស',
      icon: '📝',
    },
    {
      id: 'notebook-seyes',
      name: 'ក្រដាសសរសេរអក្សរផ្ចង់កុមារ (Seyès Grid)',
      desc: 'ក្រឡាសៀវភៅអក្សរផ្ចង់បឋមសិក្សា មានបន្ទាត់ធំនិងបន្ទាត់រង',
      badge: 'អក្សរផ្ចង់',
      icon: '✍️',
    },
    {
      id: 'notebook-dots',
      name: 'ក្រដាសសៀវភៅក្រឡាចុច (Dot Grid)',
      desc: 'ក្រឡាចុច Bullet Journal ស្អាតបរិសុទ្ធ ទំនើប និងស្រួលរៀបចំ',
      badge: 'ទំនើប',
      icon: '🎯',
    },
    {
      id: 'parchment',
      name: 'ក្រដាសស្លឹករឹតពណ៌មាសបុរាណ (Golden Parchment)',
      desc: 'ក្រដាសបុរាណពណ៌មាសស្រទន់ បែបសាស្ត្រាស្លឹករឹតខ្មែរ',
      badge: 'បុរាណ',
      icon: '📜',
    },
  ];

  const colorThemes = [
    { id: 'default', name: 'ផ្ទៃស្រទន់រដ្ឋបាល (MoEYS Official)', desc: 'ពណ៌ស្រទន់ផ្លូវការ ស ស្អាត និងច្បាស់លាស់', icon: '🏛️' },
    { id: 'purple', name: 'ស្វាយរាជវង្ស (Royal Purple)', desc: 'ពណ៌ស្វាយប្រណិត ស្រស់ឆើតឆាយ', icon: '👑' },
    { id: 'blue', name: 'ខៀវអប់រំ (MoEYS Blue)', desc: 'ពណ៌ខៀវអប់រំ ទំនើប និងស្ងប់ស្ងាត់', icon: '🌊' },
    { id: 'emerald', name: 'បៃតងធម្មជាតិ (Emerald Forest)', desc: 'ពណ៌បៃតងស្រងាត់ ស្រស់ស្រាយ មិនចាំងភ្នែក', icon: '🌱' },
    { id: 'blackboard', name: 'ក្តារខៀនបុរាណ (Classic Blackboard)', desc: 'ពណ៌បៃតងដុះស្លែក្តារខៀនបន្ទប់រៀនខ្មែរ', icon: '📋' },
    { id: 'mint', name: 'ជីរអង្កាមស្រស់ (Fresh Mint Pastel)', desc: 'ពណ៌បៃតងខ្ចីស្រទន់ ជំនួយសុខភាពភ្នែក', icon: '🌿' },
    { id: 'lavender', name: 'ស្វាយផ្កាត្រកួន (Pastel Lavender)', desc: 'ស្វាយផ្កាត្រកួនស្រាល ផ្ដល់សោភ័ណភាព', icon: '🪻' },
    { id: 'sunset', name: 'ថ្ងៃលិចមាស (Golden Sunset)', desc: 'ពណ៌មាសលាយទឹកក្រូចទន់ៗ', icon: '🌅' },
  ];

  const sizeOptions = [
    { id: 'sm', label: 'តូច', px: '12px', desc: 'បង្រួមតូច ផ្ទុកព័ត៌មានច្រើន' },
    { id: 'base', label: 'ធម្មតា', px: '14px', desc: 'ស្តង់ដារសមស្របគ្រប់ឯកសារ' },
    { id: 'lg', label: 'មធ្យម', px: '16px', desc: 'ធំល្មម ច្បាស់ងាយស្រួលមើល' },
    { id: 'xl', label: 'ធំច្បាស់', px: '18px', desc: 'អក្សរធំ ស្រួលអានមិនឈឺភ្នែក' },
    { id: '2xl', label: 'ធំបំផុត', px: '20px', desc: 'ធំបំផុត សម្រាប់បង្ហាញច្បាស់' },
  ];

  // 1-Click Complete Style Combos
  const presetCombos = [
    {
      name: 'រដ្ឋបាលក្រសួងផ្លូវការ',
      theme: 'default',
      font: 'Kantumruy Pro',
      headingFont: 'Moul',
      size: 'base',
      desc: 'ក្បាលលិខិតអក្សរមូល + តួអក្សរកន្ទុំរុយប្រូ + ផ្ទៃសផ្លូវការ',
      icon: '🏛️',
    },
    {
      name: 'សៀវភៅគណិតវិទ្យា',
      theme: 'notebook-grid',
      font: 'Battambang',
      headingFont: 'Moul',
      size: 'base',
      desc: 'ក្រឡាក្រដាសសៀវភៅ ៥មម + អក្សរបាត់ដំបង',
      icon: '📐',
    },
    {
      name: 'អក្សរផ្ចង់កុមារ',
      theme: 'notebook-seyes',
      font: 'Kantumruy Pro',
      headingFont: 'Moul',
      size: 'lg',
      desc: 'ក្រដាស Seyès បឋមសិក្សា + អក្សរកន្ទុំរុយ ប្រូ',
      icon: '✍️',
    },
    {
      name: 'សាស្ត្រាស្លឹករឹតបុរាណ',
      theme: 'parchment',
      font: 'Hanuman',
      headingFont: 'Bayon',
      size: 'base',
      desc: 'ក្រដាសមាសបុរាណ + អក្សរហនុមានមានក្បាល',
      icon: '📜',
    },
    {
      name: 'ក្តារខៀនបន្ទប់រៀន',
      theme: 'blackboard',
      font: 'Preahvihear',
      headingFont: 'Koulen',
      size: 'lg',
      desc: 'ក្តារខៀនបៃតងដុះស្លែ + អក្សរព្រះវិហារច្បាស់',
      icon: '📋',
    },
    {
      name: 'ស្វាយរាជវង្សប្រណិត',
      theme: 'purple',
      font: 'Siemreap',
      headingFont: 'Moul',
      size: 'base',
      desc: 'ពណ៌ស្វាយរាជវង្ស + អក្សរសៀមរាបស្រទន់',
      icon: '👑',
    },
  ];

  // Font family resolution
  const getFontFamilyCss = (font: string) => {
    switch (font) {
      case 'Moul':
        return "'Moul', cursive, serif";
      case 'Siemreap':
        return "'Siemreap', cursive, sans-serif";
      case 'Battambang':
        return "'Battambang', cursive, sans-serif";
      case 'Noto Sans Khmer':
        return "'Noto Sans Khmer', sans-serif";
      case 'Hanuman':
        return "'Hanuman', serif";
      case 'Preahvihear':
        return "'Preahvihear', cursive, sans-serif";
      case 'Content':
        return "'Content', sans-serif";
      case 'Suwannaphum':
        return "'Suwannaphum', serif";
      case 'Dangrek':
        return "'Dangrek', cursive, sans-serif";
      case 'Koulen':
        return "'Koulen', sans-serif";
      case 'Bayon':
        return "'Bayon', cursive, sans-serif";
      case 'Bokor':
        return "'Bokor', cursive, sans-serif";
      case 'Kantumruy Pro':
      default:
        return "'Kantumruy Pro', sans-serif";
    }
  };

  const getHeadingFontFamilyCss = () => {
    if (pdfHeadingFont === 'SameAsBody') {
      return getFontFamilyCss(pdfFontFamily);
    }
    return getFontFamilyCss(pdfHeadingFont);
  };

  // Background Theme Class Resolution
  const getThemeContainerClass = (themeId: string) => {
    switch (themeId) {
      case 'notebook-grid':
        return 'theme-notebook-grid text-slate-900 border-blue-200';
      case 'notebook-lines':
        return 'theme-notebook-lines text-slate-900 border-blue-200';
      case 'notebook-seyes':
        return 'theme-notebook-seyes text-slate-900 border-indigo-200';
      case 'notebook-dots':
        return 'theme-notebook-dots text-slate-900 border-slate-300';
      case 'parchment':
        return 'theme-parchment text-amber-950 border-amber-300';
      case 'blackboard':
        return 'theme-chalkboard text-emerald-100 border-emerald-600/50';
      case 'mint':
        return 'bg-gradient-to-br from-teal-50/80 via-emerald-50/70 to-cyan-50/80 text-teal-950 border-teal-200';
      case 'lavender':
        return 'bg-gradient-to-br from-purple-50/80 via-indigo-50/60 to-pink-50/70 text-purple-950 border-purple-200';
      case 'purple':
        return 'bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-slate-50/60 text-purple-950 border-purple-200';
      case 'blue':
        return 'bg-gradient-to-br from-blue-50/80 via-cyan-50/40 to-slate-50/60 text-blue-950 border-blue-200';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-slate-50/60 text-emerald-950 border-emerald-200';
      case 'sunset':
        return 'bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-yellow-50/60 text-amber-950 border-amber-200';
      case 'default':
      default:
        return 'bg-white text-slate-900 border-slate-200';
    }
  };

  const applyPreset = (preset: typeof presetCombos[0]) => {
    setPdfColorTheme(preset.theme);
    setPdfFontFamily(preset.font);
    setPdfHeadingFont(preset.headingFont as any);
    setPdfFontSize(preset.size as any);
    onShowToast(`បានអនុវត្តម៉ូដ៖ ${preset.name}!`);
  };

  // Editable Agendas
  const [agendas, setAgendas] = useState<string[]>(meeting?.agendas || [
    'ពិនិត្យ និងតាមដានលទ្ធផលនៃការអនុវត្តសេចក្ដីសម្រេចកិច្ចប្រជុំលើកមុន',
    'លើកឡើងពីបញ្ហាប្រឈម និងការលំបាកក្នុងការបង្រៀននិងរៀនជាក់ស្ដែងក្នុងថ្នាក់ (មុខវិជ្ជា៖ ភាសាខ្មែរ និងគណិតវិទ្យា)',
    'ពិភាក្សា រិះរកវិធីសាស្ត្របង្រៀនថ្មី ការផលិតសម្ភារឧបទេស និងការរៀបចំកិច្ចតែងការរួម',
    'ការរៀបចំកាលវិភាគបង្រៀនបង្ហាញ និងការសង្កេតការបង្រៀន (Peer Observation)',
    'បញ្ហាផ្សេងៗ និងការបែងចែកភារកិច្ចបន្ត'
  ]);

  const [newAgendaText, setNewAgendaText] = useState('');

  // MoEYS Professional PLC Agenda Presets
  const agendaPresets = [
    'អភិវឌ្ឍន៍ជំនាញអំណាន និងសរសេរថ្នាក់ដំបូង (Early Grade Reading & Writing)',
    'ការបង្រៀនគណិតវិទ្យាដោយប្រើប្រាស់សម្ភារឧបទេសរូបវន្ត និងឧបករណ៍វាស់វែង',
    'ការរៀបចំកិច្ចតែងការបង្រៀនរួម (Collaborative Lesson Planning) តាមគំរូថ្មី',
    'ការបង្រៀនបង្ហាញ និងការសង្កេតការបង្រៀនក្នុងថ្នាក់ (Peer Observation & Feedback)',
    'ការវិភាគលទ្ធផលសិក្សាសិស្សប្រចាំខែ និងយុទ្ធសាស្ត្របង្រៀនជំនួយសិស្សខ្សោយ',
    'ការគ្រប់គ្រងថ្នាក់រៀនបែបវិជ្ជមាន (Positive Classroom Management) និងបរិស្ថានស្អាត',
    'ការត្រៀមរៀបចំកិច្ចសហការជាមួយសហគមន៍ និងមាតាបិតាសិស្ស',
    'ការបណ្តុះបណ្តាលស្ដីពីការប្រើប្រាស់បច្ចេកវិទ្យាឌីជីថលក្នុងសាលារៀន'
  ];

  const handleAddPresetAgenda = (presetText: string) => {
    if (agendas.includes(presetText)) {
      onShowToast('របៀបវារៈនេះមានរួចហើយ!');
      return;
    }
    setAgendas([...agendas, presetText]);
    onShowToast('បានបញ្ចូលរបៀបវារៈគំរូ MoEYS ដោយជោគជ័យ!');
  };

  // Agenda 1 Details
  const [agenda1Reporter, setAgenda1Reporter] = useState(meeting?.agenda1Details?.reporter || 'លោកគ្រូ ឌុក សុភ័ក្រ');
  const [agenda1Achievements, setAgenda1Achievements] = useState(meeting?.agenda1Details?.achievements || 'បានអនុវត្តការបង្រៀនតាមកិច្ចតែងការរួម និងស្រង់វត្តមានសិស្សប្រចាំថ្ងៃបានទៀងទាត់ ១០០%។');
  const [agenda1Remaining, setAgenda1Remaining] = useState(meeting?.agenda1Details?.remainingIssues || 'សិស្សមួយចំនួននៅខ្វះសៀវភៅអានបន្ថែម និងត្រូវការពេលជំនួយបន្ថែមក្រៅម៉ោង។');

  // Agenda 2 Details
  const [agenda2Subject, setAgenda2Subject] = useState(meeting?.agenda2Details?.subject || 'ភាសាខ្មែរ និងគណិតវិទ្យា');
  const [agenda2Problem, setAgenda2Problem] = useState(meeting?.agenda2Details?.studentProblem || 'សិស្សថ្នាក់ទី៤ មួយចំនួននៅមានការលំបាកក្នុងការអានអត្ថបទវែងៗ និងការចែកលេខមានលេខ ២ ខ្ទង់។');
  const [agenda2RootCause, setAgenda2RootCause] = useState(meeting?.agenda2Details?.rootCause || 'ខ្វះការអនុវត្តអាននៅផ្ទះ និងខ្វះសម្ភារឧបទេសរូបវន្តជួយពន្យល់។');

  // Agenda 3 Details
  const [agenda3Method, setAgenda3Method] = useState(meeting?.agenda3Details?.teachingMethod || 'ប្រើប្រាស់វិធីសាស្ត្រអានបែបអន្តរកម្ម (Interactive Reading) និងការបែងចែកក្រុមតូចៗ (Small Group Work)');
  const [agenda3Materials, setAgenda3Materials] = useState(meeting?.agenda3Details?.materials || 'ប័ណ្ណពាក្យ (Flashcards), គំរូប្រភាគกระดาษ និងដ្យាក្រាមរស្មីសំយោគ');
  const [agenda3LessonPlanAdj, setAgenda3LessonPlanAdj] = useState(meeting?.agenda3Details?.lessonPlanAdjustment || 'បន្ថែមពេល ១០នាទីដំបូងសម្រាប់លំហាត់កម្តៅខួរក្បាល និងការទន្ទេញពាក្យគន្លឹះ។');

  // Agenda 4 Details
  const [agenda4Teacher, setAgenda4Teacher] = useState(meeting?.agenda4Details?.demoTeacher || 'លោកគ្រូ ឌុក សុភ័ក្រ');
  const [agenda4Grade, setAgenda4Grade] = useState(meeting?.agenda4Details?.demoGrade || 'ថ្នាក់ទី ៤');
  const [agenda4Subject, setAgenda4Subject] = useState(meeting?.agenda4Details?.demoSubject || 'ភាសាខ្មែរ');
  const [agenda4Chapter, setAgenda4Chapter] = useState(meeting?.agenda4Details?.demoChapter || 'មេរៀនទី ១២៖ សួនច្បារសាលារៀនខ្ញុំ');
  const [agenda4Date, setAgenda4Date] = useState(meeting?.agenda4Details?.demoDate || '2026-09-02');
  const [agenda4Observers, setAgenda4Observers] = useState(meeting?.agenda4Details?.observers || 'សមាជិកក្រុមបច្ចេកទេសទាំងអស់ និងគណៈនាយកសាលា');

  // Agenda 5 Details
  const [agenda5Details, setAgenda5Details] = useState(meeting?.agenda5Details || 'ការត្រៀមរៀបចំទិវាគ្រូបង្រៀនពិភពលោក និងការថែទាំអនាម័យបរិស្ថានថ្នាក់រៀន។');

  // Action Plan
  const [actionPlan, setActionPlan] = useState(meeting?.actionPlan || 'គ្រូបង្រៀនគ្រប់រូបត្រូវយកកិច្ចតែងការរួមទៅអនុវត្តក្នុងថ្នាក់រៀនផ្ទាល់ខ្លួន និងត្រៀមរាយការណ៍លទ្ធផលក្នុងកិច្ចប្រជុំ PLC លើកក្រោយ។');

  if (!isOpen) return null;

  const handleAddAgenda = () => {
    if (!newAgendaText.trim()) return;
    setAgendas([...agendas, newAgendaText.trim()]);
    setNewAgendaText('');
    onShowToast('បានបន្ថែមរបៀបវារៈថ្មី!');
  };

  const handleRemoveAgenda = (idx: number) => {
    setAgendas(agendas.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const updatedMeeting: PLCMeeting = {
      id: meeting?.id || Date.now(),
      date,
      topic: agendas[1] || 'កិច្ចប្រជុំបច្ចេកទេស PLC ប្រចាំខែ',
      attendees: `${presentCount} នាក់ (ប្រធាន: ${chairperson}, លេខា: ${secretary})`,
      issues: agenda2Problem,
      decision: actionPlan,
      province,
      district,
      school,
      gradeLevel,
      meetingNo,
      month,
      academicYear,
      startTime,
      endTime,
      location,
      chairperson,
      chairpersonRole,
      secretary,
      secretaryRole,
      presentCount,
      absentCount,
      excusedCount,
      unexcusedCount,
      agendas,
      agenda1Details: {
        reporter: agenda1Reporter,
        achievements: agenda1Achievements,
        remainingIssues: agenda1Remaining,
      },
      agenda2Details: {
        subject: agenda2Subject,
        studentProblem: agenda2Problem,
        rootCause: agenda2RootCause,
      },
      agenda3Details: {
        teachingMethod: agenda3Method,
        materials: agenda3Materials,
        lessonPlanAdjustment: agenda3LessonPlanAdj,
      },
      agenda4Details: {
        demoTeacher: agenda4Teacher,
        demoGrade: agenda4Grade,
        demoSubject: agenda4Subject,
        demoChapter: agenda4Chapter,
        demoDate: agenda4Date,
        observers: agenda4Observers,
      },
      agenda5Details,
      actionPlan,
    };

    onSaveMeeting(updatedMeeting);
    onShowToast('បានរក្សាទុកកំណត់ហេតុប្រជុំ PLC ផ្លូវការដោយជោគជ័យ!');
    onClose();
  };

  const handlePrint = () => {
    handleDownloadPdfDocument();
  };

  const handleDownloadPdfDocument = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>កំណត់ហេតុកិច្ចប្រជុំបច្ចេកទេស PLC - ${school}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Moul&family=Moulpali&family=Siemreap&family=Battambang:wght@400;700;900&family=Noto+Sans+Khmer:wght@300..900&family=Hanuman:wght@400;700;900&family=Koulen&family=Bokor&family=Suwannaphum:wght@400;700&family=Odor+Mean+Chey&family=Chenla&family=Fasel&family=Dangrek&family=Preahvihear&family=Bayon&family=Taprom&family=Angkor&family=Freehand&family=Metal&family=Koh+Santepheap:wght@400;700&family=Nokora:wght@400;700&family=Khmer&display=swap');
    @page {
      size: ${pdfPaperSize} ${pdfOrientation};
      margin: 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: ${getFontFamilyCss(pdfFontFamily)};
      margin: 15mm;
      color: #0f172a;
      line-height: 1.6;
      font-size: ${pdfFontSize === 'sm' ? '12px' : pdfFontSize === 'lg' ? '16px' : pdfFontSize === 'xl' ? '18px' : pdfFontSize === '2xl' ? '20px' : '14px'};
      ${getThemeBackgroundCss(pdfColorTheme)}
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .text-center { text-align: center; }
    .plc-title-moul { font-family: ${getHeadingFontFamilyCss()} !important; }
    .font-bold { font-weight: bold; }
    .header-rule { border-top: 2px solid #0f172a; width: 120px; margin: 8px auto; }
    .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
    .agenda-box { background: #f1f5f9; padding: 10px; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid ${pdfColorTheme === 'purple' || pdfColorTheme === 'sunset' ? '#581c87' : pdfColorTheme === 'blue' || pdfColorTheme === 'ocean' ? '#1e3a8a' : pdfColorTheme === 'emerald' || pdfColorTheme === 'forest' ? '#065f46' : '#334155'}; }
    .section-title { font-weight: bold; font-size: 1.05em; margin-top: 18px; margin-bottom: 8px; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; color: ${pdfColorTheme === 'purple' || pdfColorTheme === 'sunset' ? '#3b0764' : pdfColorTheme === 'blue' || pdfColorTheme === 'ocean' ? '#1e3a8a' : pdfColorTheme === 'emerald' || pdfColorTheme === 'forest' ? '#065f46' : '#0f172a'}; }
    .signatures { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; }
    .watermark { position: fixed; top: 40%; left: 20%; transform: rotate(-30deg); font-size: 60px; color: rgba(203, 213, 225, 0.3); font-weight: bold; pointer-events: none; }
  </style>
</head>
<body>
  ${watermarkText ? `<div class="watermark">${watermarkText}</div>` : ''}
  ${showKingdomHeader ? `
  <!-- ១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់ -->
  <div style="text-align: center; margin-bottom: 8px;">
    <p class="plc-title-moul" style="font-size: 1.15em; margin: 0; color: #0f172a;">ព្រះរាជាណាចក្រកម្ពុជា</p>
    <p class="plc-title-moul" style="font-size: 0.98em; margin: 4px 0; color: #1e293b;">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
    <div style="font-size: 8.5pt; letter-spacing: 2px; margin-top: 2px; font-weight: bold; color: #334155;">— ༺ ៚ ༻ —</div>
  </div>
  ` : ''}

  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 15px; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 8px;">
    <div style="text-align: left;">
      <div class="font-bold" style="font-size: 10pt; color: #0f172a;">មន្ទីរអប់រំ យុវជន និងកីឡា ${province}</div>
      <div class="font-bold" style="font-size: 10pt; color: #1e1b4b; margin-top: 2px;">${district}</div>
      <div class="font-bold" style="font-size: 9.5pt; color: #334155; margin-top: 2px;">${school}</div>
    </div>
    <div style="text-align: right;">
      <div class="font-bold" style="font-size: 9pt; color: #475569;">ក្រុមបច្ចេកទេស${gradeLevel}</div>
    </div>
  </div>

  <div class="text-center" style="margin: 20px 0;">
    <h2 class="plc-title-moul" style="font-size: 1.25em; margin: 0; color: ${pdfColorTheme === 'purple' ? '#581c87' : pdfColorTheme === 'blue' ? '#1e3a8a' : pdfColorTheme === 'emerald' ? '#065f46' : '#0f172a'};">
      កំណត់ហេតុកិច្ចប្រជុំបច្ចេកទេស (PLC)
    </h2>
    <p class="font-bold" style="font-size: 0.9em; margin-top: 6px;">
      លើកទី៖ ${meetingNo} • ប្រចាំខែ៖ ${month} • ឆ្នាំសិក្សា៖ ${academicYear}
    </p>
  </div>

  <div class="meta-box">
    <p><strong>📅 កាលបរិច្ឆេទ៖</strong> ${date} | <strong>⏰ វេលាម៉ោង៖</strong> ${startTime} - ${endTime}</p>
    <p><strong>📍 ទីកន្លែង៖</strong> ${location} | <strong>👥 វត្តមាន៖</strong> ${presentCount} នាក់ (អវត្តមាន: ${absentCount} នាក់)</p>
    <p><strong>👨‍💼 ប្រធានអង្គប្រជុំ៖</strong> ${chairperson} (${chairpersonRole})</p>
    <p><strong>✍️ លេខាកត់ត្រា៖</strong> ${secretary} (${secretaryRole})</p>
  </div>

  <div class="section-title">ក. របៀបវារៈនៃកិច្ចប្រជុំ (Meeting Agendas)</div>
  ${agendas.map((ag, index) => `<div class="agenda-box"><strong>វារៈទី ${index + 1}៖</strong> ${ag}</div>`).join('')}

  <div class="section-title">ខ. ដំណើរការ និងខ្លឹមសារពិភាក្សាតាមរបៀបវារៈ</div>
  <p><strong>១. ពិនិត្យការងារចាស់ (អ្នករាយការណ៍៖ ${agenda1Reporter})៖</strong> ${agenda1Achievements} (បញ្ហាប្រឈម៖ ${agenda1Remaining})</p>
  <p><strong>២. បញ្ហាប្រឈមថ្មីរបស់សិស្ស (${agenda2Subject})៖</strong> ${agenda2Problem}</p>
  <p><strong>៣. ដំណោះស្រាយ និងកិច្ចតែងការរួម៖</strong> វិធីសាស្ត្របង្រៀនថ្មី «${agenda3Method}» ប្រើប្រាស់ «${agenda3Materials}»</p>
  <p><strong>៤. ការបង្រៀនបង្ហាញ និងសង្កេតការណ៍ (Peer Observation)៖</strong> បង្រៀនដោយលោក/អ្នកគ្រូ ${agenda4Teacher} មុខវិជ្ជា ${agenda4Subject} (${agenda4Chapter}) នៅថ្ងៃទី ${agenda4Date}</p>
  <p><strong>៥. បញ្ហាផ្សេងៗ៖</strong> ${agenda5Details}</p>

  <div class="section-title">គ. សេចក្ដីសម្រេចចិត្ត និងផែនការសកម្មភាពបន្ត (Action Plan)</div>
  <p style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">${actionPlan}</p>

  ${showSignatures ? `
  <!-- ២ ហត្ថលេខាគ្រូ/គណៈកម្មការនៅលើនាយកសាលា -->
  <div style="margin-top: 30px; page-break-inside: avoid;">
    <!-- ជួរទី១ ខាងលើ: អ្នកកត់ត្រា និង ប្រធានអង្គប្រជុំ -->
    <div style="display: flex; justify-content: space-between; text-align: center; margin-bottom: 24px;">
      <div style="width: 200px;">
        <p><strong>អ្នកកត់ត្រា</strong></p>
        <p style="font-size: 0.8em; color: #64748b;">(ហត្ថលេខា និងឈ្មោះ)</p>
        <p style="margin-top: 45px;"><strong>${secretary}</strong></p>
      </div>
      <div style="width: 200px;">
        <p><strong>ប្រធានអង្គប្រជុំ</strong></p>
        <p style="font-size: 0.8em; color: #64748b;">(ហត្ថលេខា និងឈ្មោះ)</p>
        <p style="margin-top: 45px;"><strong>${chairperson}</strong></p>
      </div>
    </div>

    <!-- ជួរទី២ ខាងក្រោម: នាយកសាលា -->
    ${showStampBox ? `
    <div style="display: flex; justify-content: flex-start; text-align: center;">
      <div style="width: 200px;">
        <p><strong>បានឃើញ និងឯកភាព</strong></p>
        <p><strong>${principalTitle}</strong></p>
        <p style="font-size: 0.8em; color: #64748b;">(ហត្ថលេខា និងត្រា)</p>
        <p style="margin-top: 45px;">........................................</p>
      </div>
    </div>
    ` : ''}
  </div>
  ` : ''}

  <script>
    window.onload = function() {
      // Auto print trigger for seamless PDF generation
      setTimeout(function() { window.print(); }, 500);
    };
  </script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      onShowToast('បានបើកផ្ទាំងទាញយក PDF ផ្លូវការដោយជោគជ័យ!');
    } else {
      // Download fallback
      const link = document.createElement('a');
      link.href = url;
      link.download = `PLC_Meeting_${school.replace(/\s+/g, '_')}_${date}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onShowToast('បានទាញយកឯកសារកំណត់ហេតុ PLC ដោយជោគជ័យ!');
    }
  };

  // Color theme classes
  const themeHeaderClass =
    pdfColorTheme === 'purple'
      ? 'from-purple-900 via-indigo-900 to-slate-900'
      : pdfColorTheme === 'blue'
      ? 'from-blue-900 via-indigo-900 to-slate-900'
      : pdfColorTheme === 'emerald'
      ? 'from-emerald-900 via-teal-900 to-slate-900'
      : 'from-slate-900 via-slate-800 to-slate-900';

  const themeTextAccentClass =
    pdfColorTheme === 'purple'
      ? 'text-purple-950 border-purple-200'
      : pdfColorTheme === 'blue'
      ? 'text-blue-950 border-blue-200'
      : pdfColorTheme === 'emerald'
      ? 'text-emerald-950 border-emerald-200'
      : 'text-slate-950 border-slate-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200">
        
        {/* Modal Header */}
        <div className={`no-print bg-gradient-to-r ${themeHeaderClass} text-white px-6 py-4 flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base flex items-center gap-2">
                <span>កំណត់ហេតុកិច្ចប្រជុំបច្ចេកទេស (PLC)</span>
              </h2>
              <p className="text-xs text-purple-200">ទម្រង់ផ្លូវការក្រសួងអប់រំ យុវជន និងកីឡា • អាចកែសម្រួល កំណត់ទម្រង់ PDF និងទាញយក</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowPdfCustomizer(!showPdfCustomizer)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 border ${
                showPdfCustomizer
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              }`}
              title="កំណត់រចនាទម្រង់ PDF តាមចិត្ត"
            >
              <Settings className="w-4 h-4 text-amber-300" />
              <span>កែប្រែទម្រង់ PDF</span>
            </button>
            <button
              onClick={handleDownloadPdfDocument}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md"
              title="ទាញយកជាឯកសារ PDF ផ្លូវការ"
            >
              <Download className="w-4 h-4" />
              <span>ទាញយក PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md"
            >
              <Printer className="w-4 h-4" /> ព្រីន PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Customization Settings Panel Drawer */}
        {showPdfCustomizer && (
          <div className="no-print bg-slate-900 text-white border-b border-slate-700 space-y-4 animate-in fade-in duration-200 shadow-2xl">
            {/* Top drawer navigation and action bar */}
            <div className="px-5 sm:px-6 pt-4 pb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-amber-300">
                    បន្ទះកែសម្រួលទម្រង់អក្សរ & ផ្ទៃខាងក្រោយ (Customize Style & Font)
                  </h3>
                  <p className="text-[10px] text-slate-400">ជ្រើសរើសពុម្ពអក្សរខ្មែរ ក្រឡាក្រដាសសៀវភៅ និងម៉ូដរចនារហ័ស</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setCustomizerActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    customizerActiveTab === 'all'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>ទាំងអស់</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomizerActiveTab('presets')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    customizerActiveTab === 'presets'
                      ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>⚡ ម៉ូដរចនារហ័ស</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomizerActiveTab('notebook')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    customizerActiveTab === 'notebook'
                      ? 'bg-amber-600 text-white shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>📖 ផ្ទៃក្រឡាសៀវភៅ & ពណ៌</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomizerActiveTab('fonts')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    customizerActiveTab === 'fonts'
                      ? 'bg-indigo-600 text-white shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <Type className="w-3.5 h-3.5 text-indigo-300" />
                  <span>✍️ ពុម្ពអក្សរ ({fontOptions.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomizerActiveTab('sizes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    customizerActiveTab === 'sizes'
                      ? 'bg-purple-600 text-white shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <ZoomIn className="w-3.5 h-3.5 text-purple-300" />
                  <span>🔍 ទំហំអក្សរ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomizerActiveTab('page')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    customizerActiveTab === 'page'
                      ? 'bg-blue-600 text-white shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5 text-blue-300" />
                  <span>📄 ទំព័រ & ត្រា</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowPdfCustomizer(false)}
                className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>បិទបន្ទះកំណត់</span>
              </button>
            </div>

            {/* Customizer Body with scrollable content */}
            <div className="px-5 sm:px-6 pb-5 max-h-[380px] overflow-y-auto space-y-5">
              
              {/* 1. Quick Presets Section */}
              {(customizerActiveTab === 'all' || customizerActiveTab === 'presets') && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-emerald-400" />
                      <span>⚡ ម៉ូដរចនារហ័សពេញនិយម (1-Click Style Presets)</span>
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-bold">ចុច ១ ទទួលបានស្ទីលទាំងមូលភ្លាមៗ</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {presetCombos.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="p-3 rounded-2xl border border-slate-800 hover:border-emerald-500 bg-slate-800/80 hover:bg-slate-800 text-left transition flex items-start gap-3 group active:scale-95 shadow-xs"
                      >
                        <span className="text-2xl p-2 rounded-xl bg-slate-900 group-hover:bg-slate-950 transition shrink-0">
                          {p.icon}
                        </span>
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-xs font-black text-white group-hover:text-emerald-300 transition truncate">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                            {p.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Notebook Paper Grids */}
              {(customizerActiveTab === 'all' || customizerActiveTab === 'notebook') && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>១. ផ្ទៃក្រោយក្រឡាក្រដាសសៀវភៅសិស្ស (Notebook Paper Grids)</span>
                    </h4>
                    <span className="text-[11px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/60">
                      ពិសេសសម្រាប់គ្រូបឋម
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {notebookThemes.map((t) => {
                      const isSelected = pdfColorTheme === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setPdfColorTheme(t.id)}
                          className={`p-3 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-2.5 ${
                            isSelected
                              ? 'border-amber-400 bg-amber-950/40 shadow-md ring-2 ring-amber-400/40'
                              : 'border-slate-800 hover:border-amber-400/50 hover:bg-slate-800 bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="text-xl p-1.5 rounded-xl bg-slate-900 shrink-0">
                              {t.icon}
                            </span>
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-xs font-black text-white truncate">{t.name}</p>
                                {t.badge && (
                                  <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-md">
                                    {t.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">{t.desc}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Color & Classroom Themes */}
              {(customizerActiveTab === 'all' || customizerActiveTab === 'notebook') && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-400" />
                    <span>២. ពណ៌ និងផ្ទៃទូទៅ (Classroom Colors & Ambient Themes)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {colorThemes.map((t) => {
                      const isSelected = pdfColorTheme === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setPdfColorTheme(t.id)}
                          className={`p-2.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'border-purple-400 bg-purple-950/40 shadow-md ring-2 ring-purple-400/40'
                              : 'border-slate-800 hover:border-purple-400/50 hover:bg-slate-800 bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg p-1.5 rounded-xl bg-slate-900 shrink-0">
                              {t.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{t.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{t.desc}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-purple-400 text-slate-950 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Khmer Typography */}
              {(customizerActiveTab === 'all' || customizerActiveTab === 'fonts') && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                      <Type className="w-4 h-4 text-indigo-400" />
                      <span>៣. ជ្រើសរើសប្រភេទពុម្ពអក្សរខ្មែរ (Khmer Typography)</span>
                    </h4>
                    <span className="text-[11px] text-indigo-300 font-bold bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-800/60">
                      {fontOptions.length} ពុម្ពអក្សរ
                    </span>
                  </div>

                  {/* Heading vs Body Font Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
                    <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
                      <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>ពុម្ពអក្សរចំណងជើងធំ (Heading Font)</span>
                      </label>
                      <select
                        value={pdfHeadingFont}
                        onChange={(e) => setPdfHeadingFont(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:ring-2 focus:ring-amber-400"
                      >
                        <option value="Moul">អក្សរ មូល (Moul Official) - ស្តង់ដារ</option>
                        <option value="Koulen">អក្សរ កូលេន (Koulen Display) - ធំក្រាស់</option>
                        <option value="Bayon">អក្សរ បាយ័ន (Bayon Stone) - បុរាណ</option>
                        <option value="Preahvihear">អក្សរ ព្រះវិហារ (Preahvihear)</option>
                        <option value="Kantumruy Pro">អក្សរ កន្ទុំរុយ ប្រូ (Kantumruy Pro Bold)</option>
                        <option value="SameAsBody">ដូចតួអក្សរខាងក្រោម (Same as Body)</option>
                      </select>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
                      <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-indigo-400" />
                        <span>ពុម្ពអក្សរតួអត្ថបទបច្ចុប្បន្ន (Body Font Active)</span>
                      </label>
                      <p className="text-xs font-black text-amber-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 truncate" style={{ fontFamily: getFontFamilyCss(pdfFontFamily) }}>
                        {pdfFontFamily} (ចុចជ្រើសរើសក្នុងប្រអប់ខាងក្រោម)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {fontOptions.map((f) => {
                      const isSelected = pdfFontFamily === f.id;
                      return (
                        <div
                          key={f.id}
                          onClick={() => setPdfFontFamily(f.id)}
                          className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? 'border-indigo-400 bg-indigo-950/50 shadow-md ring-2 ring-indigo-400/40'
                              : 'border-slate-800 hover:border-indigo-400/50 hover:bg-slate-800 bg-slate-800/60'
                          }`}
                          style={{ fontFamily: getFontFamilyCss(f.id) }}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{f.name}</p>
                            <p className="text-[10px] text-slate-400 truncate" style={{ fontFamily: 'Kantumruy Pro, sans-serif' }}>
                              {f.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. Font Size Scale */}
              {(customizerActiveTab === 'all' || customizerActiveTab === 'sizes') && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                      <ZoomIn className="w-4 h-4 text-purple-400" />
                      <span>៤. ទំហំពុម្ពអក្សរ & កម្រិតពង្រីក (Font Size Scale)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-bold">បច្ចុប្បន្ន: {pdfFontSize}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {sizeOptions.map((s) => {
                      const isSelected = pdfFontSize === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setPdfFontSize(s.id as any)}
                          className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 border-amber-300 font-black shadow-md ring-2 ring-amber-400/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-bold'
                          }`}
                        >
                          <span className="text-xs font-bold">{s.label}</span>
                          <span className="text-[10px] opacity-75 font-mono">{s.px}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. Page Layout, Signatures, and Stamp */}
              {(customizerActiveTab === 'all' || customizerActiveTab === 'page') && (
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Layout className="w-4 h-4 text-blue-400" />
                    <span>៥. ការកំណត់ទំព័រ ហត្ថលេខា & ត្រា (Page & Layout Settings)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                      <label className="block font-semibold text-slate-300 text-xs">ទំហំក្រដាស និងទិសដៅ:</label>
                      <div className="flex gap-1.5">
                        <select
                          value={pdfPaperSize}
                          onChange={(e) => setPdfPaperSize(e.target.value as any)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="A4">A4 Standard</option>
                          <option value="Letter">Letter</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setPdfOrientation(pdfOrientation === 'portrait' ? 'landscape' : 'portrait')}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-bold hover:bg-slate-700 text-xs"
                        >
                          {pdfOrientation === 'portrait' ? '📄 ឈរ' : '📜 ដេក'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 col-span-1 md:col-span-2">
                      <label className="block font-semibold text-slate-300 text-xs">ធាតុផ្សំផ្លូវការ:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showKingdomHeader}
                            onChange={(e) => setShowKingdomHeader(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-400"
                          />
                          <span className="text-slate-200 text-[11px]">ក្បាលលិខិតជាតិ</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showSignatures}
                            onChange={(e) => setShowSignatures(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-400"
                          />
                          <span className="text-slate-200 text-[11px]">ហត្ថលេខាគ្រូ/ប្រធាន</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showStampBox}
                            onChange={(e) => setShowStampBox(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-400"
                          />
                          <span className="text-slate-200 text-[11px]">ប្រអប់ត្រានាយក</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Watermark input */}
                  <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                    <span className="text-slate-300 text-xs font-semibold shrink-0">💧 អត្ថបទសម្គាល់ (Watermark):</span>
                    <input
                      type="text"
                      placeholder="ឧ. ឯកសារផ្លូវការ MoEYS / ចម្លងពិតប្រាកដ..."
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* Reset to defaults button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setPdfFontFamily('Kantumruy Pro');
                    setPdfHeadingFont('Moul');
                    setPdfColorTheme('default');
                    setPdfFontSize('base');
                    onShowToast('បានកំណត់ទម្រង់ដើមវិញ!');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>កំណត់ទម្រង់ដើមវិញ (Reset)</span>
                </button>
                <span className="text-[11px] text-slate-400 font-medium">
                  ការកំណត់ទាំងអស់នឹងត្រូវបានអនុវត្តលើឯកសារផ្ទាល់ និងពេលព្រីន/ទាញយក PDF
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Modal Scrollable Body (Official Document Layout) */}
        <div
          id="plc-document-preview-container"
          style={{
            fontFamily: getFontFamilyCss(pdfFontFamily),
            fontSize: pdfFontSize === 'sm' ? '12px' : pdfFontSize === 'lg' ? '16px' : pdfFontSize === 'xl' ? '18px' : pdfFontSize === '2xl' ? '20px' : '14px',
            lineHeight: 1.6,
          }}
          className={`flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 print:p-0 print:m-0 relative transition-all duration-300 ${getThemeContainerClass(
            pdfColorTheme
          )}`}
        >
          <style>{`
            #plc-document-preview-container input,
            #plc-document-preview-container textarea,
            #plc-document-preview-container select,
            #plc-document-preview-container button {
              font-family: inherit;
            }
            #plc-document-preview-container .plc-title-moul {
              font-family: ${getHeadingFontFamilyCss()} !important;
            }
          `}</style>

          {/* Watermark overlay */}
          {watermarkText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-15 rotate-[-30deg] text-slate-500 font-black text-4xl sm:text-6xl text-center select-none">
              {watermarkText}
            </div>
          )}

          {/* Royal Header */}
          {showKingdomHeader && (
            <div className="text-center space-y-1">
              <p className="plc-title-moul font-bold text-sm sm:text-base text-slate-900">ព្រះរាជាណាចក្រកម្ពុជា</p>
              <p className="plc-title-moul font-bold text-xs sm:text-sm text-slate-800">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
              <div className="w-24 h-0.5 bg-slate-900 mx-auto my-1.5"></div>
            </div>
          )}

          {/* Administrative Metadata Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 no-print">
            <div>
              <label className="block font-bold text-[11px] text-slate-600 mb-1">មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី៖</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[11px] text-slate-600 mb-1">ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុក/ខណ្ឌ៖</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[11px] text-slate-600 mb-1">សាលាបឋមសិក្សា៖</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[11px] text-slate-600 mb-1">ក្រុមបច្ចេកទេសកម្រិតទី/ថ្នាក់ទី៖</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Print View Header (១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់) */}
          <div className="hidden print:block border-b border-slate-300 pb-3 mb-6 text-slate-900">
            {showKingdomHeader && (
              <div className="text-center space-y-1 mb-3">
                <p className="plc-title-moul font-bold text-sm sm:text-base text-slate-900">ព្រះរាជាណាចក្រកម្ពុជា</p>
                <p className="plc-title-moul font-bold text-xs sm:text-sm text-slate-800">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                <div className="text-xs font-bold text-slate-700 tracking-wider">— ༺ ៚ ༻ —</div>
              </div>
            )}
            <div className="flex justify-between items-end">
              <div className="text-left space-y-0.5">
                <p className="font-bold text-sm">មន្ទីរអប់រំ យុវជន និងកីឡា {province}</p>
                <p className="font-bold text-sm">{district}</p>
                <p className="font-bold text-sm">{school}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">ក្រុមបច្ចេកទេស{gradeLevel}</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1.5 my-4">
            <h1 className={`plc-title-moul text-base sm:text-xl font-bold underline underline-offset-4 ${themeTextAccentClass}`}>
              កំណត់ហេតុកិច្ចប្រជុំបច្ចេកទេស (PLC)
            </h1>
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-700 flex-wrap">
              <div className="flex items-center gap-1">
                <span>លើកទី៖</span>
                <input type="text" value={meetingNo} onChange={(e) => setMeetingNo(e.target.value)} className="w-12 border-b border-slate-400 text-center font-bold no-print" />
                <span className="print:inline hidden font-bold">{meetingNo}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>ប្រចាំខែ៖</span>
                <input type="text" value={month} onChange={(e) => setMonth(e.target.value)} className="w-28 border-b border-slate-400 text-center font-bold no-print" />
                <span className="print:inline hidden font-bold">{month}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>ឆ្នាំសិក្សា៖</span>
                <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="w-28 border-b border-slate-400 text-center font-bold no-print" />
                <span className="print:inline hidden font-bold">{academicYear}</span>
              </div>
            </div>
          </div>

          {/* General Info Box */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">📅 កាលបរិច្ឆេទ៖</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1 font-semibold no-print" />
                <span className="print:inline hidden font-semibold">{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">⏰ វេលាម៉ោង៖</span>
                <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-16 border border-slate-300 rounded-lg px-2 py-1 text-center font-semibold no-print" />
                <span>ដល់</span>
                <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-16 border border-slate-300 rounded-lg px-2 py-1 text-center font-semibold no-print" />
                <span className="print:inline hidden">{startTime} - {endTime}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">📍 ទីកន្លែងប្រជុំ៖</span>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-2 py-1 font-semibold no-print" />
                <span className="print:inline hidden font-semibold">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">👥 សមាសភាព (វត្តមាន)៖</span>
                <input type="number" value={presentCount} onChange={(e) => setPresentCount(Number(e.target.value))} className="w-14 border border-slate-300 rounded-lg px-2 py-1 text-center font-semibold no-print" />
                <span>នាក់ (អវត្តមាន: <input type="number" value={absentCount} onChange={(e) => setAbsentCount(Number(e.target.value))} className="w-10 border border-slate-300 rounded px-1 text-center no-print" />)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">👨‍💼 ប្រធានអង្គប្រជុំ៖</span>
                <input type="text" value={chairperson} onChange={(e) => setChairperson(e.target.value)} className="w-36 border border-slate-300 rounded-lg px-2 py-1 font-semibold no-print" />
                <input type="text" value={chairpersonRole} onChange={(e) => setChairpersonRole(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-2 py-1 font-semibold text-slate-500 no-print" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">✍️ លេខាកត់ត្រា៖</span>
                <input type="text" value={secretary} onChange={(e) => setSecretary(e.target.value)} className="w-36 border border-slate-300 rounded-lg px-2 py-1 font-semibold no-print" />
                <input type="text" value={secretaryRole} onChange={(e) => setSecretaryRole(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-2 py-1 font-semibold text-slate-500 no-print" />
              </div>
            </div>
          </div>

          {/* Section A: Agendas */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-1.5 border-slate-300">
              <h3 className={`font-black text-sm flex items-center gap-1.5 ${themeTextAccentClass}`}>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>ក. របៀបវារៈនៃកិច្ចប្រជុំ (Meeting Agendas)</span>
              </h3>
              <span className="text-[10px] text-slate-500 no-print">អាចជ្រើសរើសខ្លឹមសារគំរូ ឬវាយបញ្ចូលផ្ទាល់</span>
            </div>

            {/* Quick MoEYS Presets Selector */}
            <div className="no-print bg-purple-50/70 p-3 rounded-2xl border border-purple-100 space-y-2">
              <p className="font-bold text-[11px] text-purple-900 flex items-center gap-1">
                <span>✨ ជ្រើសរើសរបៀបវារៈគំរូស្តង់ដារក្រសួងអប់រំ (ចុចដើម្បីបន្ថែមភ្លាមៗ)៖</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {agendaPresets.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleAddPresetAgenda(preset)}
                    className="bg-white hover:bg-purple-900 hover:text-white text-purple-950 font-semibold px-2.5 py-1.5 rounded-xl text-[11px] border border-purple-200 transition shadow-xs flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3 h-3 text-purple-600 group-hover:text-white" />
                    <span>{preset}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {agendas.map((agenda, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-xs text-purple-950 shrink-0">វារៈទី {idx + 1}៖</span>
                  <input
                    type="text"
                    value={agenda}
                    onChange={(e) => {
                      const updated = [...agendas];
                      updated[idx] = e.target.value;
                      setAgendas(updated);
                    }}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold"
                  />
                  {agendas.length > 1 && (
                    <button
                      onClick={() => handleRemoveAgenda(idx)}
                      className="no-print text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                      title="លុបរបៀបវារៈ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add Agenda Input */}
              <div className="no-print flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="បន្ថែមរបៀបវារៈថ្មីដោយផ្ទាល់..."
                  value={newAgendaText}
                  onChange={(e) => setNewAgendaText(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
                <button
                  onClick={handleAddAgenda}
                  className="px-4 py-2 bg-purple-900 text-white font-bold rounded-xl text-xs hover:bg-purple-800 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> បន្ថែមរបៀបវារៈ
                </button>
              </div>
            </div>
          </div>

          {/* Section B: Discussion Details */}
          <div className="space-y-4 pt-2">
            <h3 className={`font-black text-sm border-b pb-1.5 ${themeTextAccentClass}`}>
              ខ. ដំណើរការ និងខ្លឹមសារពិភាក្សាតាមរបៀបវារៈនីមួយៗ
            </h3>

            {/* Agenda 1 */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">១. ដំណើរការរបៀបវារៈទី ១ (ពិនិត្យការងារចាស់)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">អ្នករាយការណ៍៖</label>
                  <input
                    type="text"
                    value={agenda1Reporter}
                    onChange={(e) => setAgenda1Reporter(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ចំណុចសម្រេចបាន៖</label>
                  <textarea
                    rows={2}
                    value={agenda1Achievements}
                    onChange={(e) => setAgenda1Achievements(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">ចំណុចខ្វះខាតដែលនៅសេសសល់៖</label>
                <input
                  type="text"
                  value={agenda1Remaining}
                  onChange={(e) => setAgenda1Remaining(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Agenda 2 */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">២. ដំណើរការរបៀបវារៈទី ២ (បញ្ហាប្រឈមថ្មីរបស់សិស្ស)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">មុខវិជ្ជា៖</label>
                  <input
                    type="text"
                    value={agenda2Subject}
                    onChange={(e) => setAgenda2Subject(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">បញ្ហាសិស្សជួបប្រទះ៖</label>
                  <input
                    type="text"
                    value={agenda2Problem}
                    onChange={(e) => setAgenda2Problem(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Agenda 3 */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">៣. ដំណើរការរបៀបវារៈទី ៣ (ដំណោះស្រាយ និងកិច្ចតែងការរួម)</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">វិធីសាស្ត្របង្រៀនថ្មីដែលបានឯកភាព៖</label>
                  <input
                    type="text"
                    value={agenda3Method}
                    onChange={(e) => setAgenda3Method(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">សម្ភារឧបទេស / បច្ចេកវិទ្យាជំនួយ៖</label>
                    <input
                      type="text"
                      value={agenda3Materials}
                      onChange={(e) => setAgenda3Materials(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">ការកែសម្រួលជំហានសកម្មភាពក្នុងកិច្ចតែងការ៖</label>
                    <input
                      type="text"
                      value={agenda3LessonPlanAdj}
                      onChange={(e) => setAgenda3LessonPlanAdj(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Agenda 4 */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">៤. ដំណើរការរបៀបវារៈទី ៤ (ការបង្រៀនបង្ហាញ និងសង្កេតការណ៍ - Peer Observation)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">គ្រូបង្រៀនបង្ហាញ៖</label>
                  <input
                    type="text"
                    value={agenda4Teacher}
                    onChange={(e) => setAgenda4Teacher(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ថ្នាក់ទី / មុខវិជ្ជា៖</label>
                  <input
                    type="text"
                    value={`${agenda4Grade} - ${agenda4Subject}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('-');
                      if (parts[0]) setAgenda4Grade(parts[0].trim());
                      if (parts[1]) setAgenda4Subject(parts[1].trim());
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ជំពូក / មេរៀន៖</label>
                  <input
                    type="text"
                    value={agenda4Chapter}
                    onChange={(e) => setAgenda4Chapter(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Agenda 5 */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">៥. ដំណើរការរបៀបវារៈទី ៥ (បញ្ហាផ្សេងៗ)</h4>
              <input
                type="text"
                value={agenda5Details}
                onChange={(e) => setAgenda5Details(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Section C: Action Plan */}
          <div className="space-y-2 pt-2">
            <h3 className={`font-black text-sm border-b pb-1.5 ${themeTextAccentClass}`}>
              គ. សេចក្ដីសម្រេចចិត្ត និងផែនការសកម្មភាពបន្ត (Action Plan)
            </h3>
            <textarea
              rows={3}
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs font-semibold"
            />
            <p className="text-xs text-slate-500 italic">
              កិច្ចប្រជុំត្រូវបានបិទបញ្ចប់នៅវេលាម៉ោង ១១:០០ នាថ្ងៃខែឆ្នាំដដែល។
            </p>
          </div>

          {/* Signatures (២ ហត្ថលេខាគ្រូ/គណៈកម្មការនៅលើនាយកសាលា) */}
          {showSignatures && (
            <div className="pt-8 text-center text-xs space-y-6">
              {/* ជួរទី១ ខាងលើ: អ្នកកត់ត្រា និង ប្រធានអង្គប្រជុំ */}
              <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto">
                <div className="space-y-12">
                  <div>
                    <p className="font-bold">អ្នកកត់ត្រា</p>
                    <p className="text-[10px] text-slate-500">(ហត្ថលេខា និងឈ្មោះ)</p>
                  </div>
                  <p className="font-bold underline underline-offset-4">{secretary}</p>
                </div>

                <div className="space-y-12">
                  <div>
                    <p className="font-bold">ប្រធានអង្គប្រជុំ</p>
                    <p className="text-[10px] text-slate-500">(ហត្ថលេខា និងឈ្មោះ)</p>
                  </div>
                  <p className="font-bold underline underline-offset-4">{chairperson}</p>
                </div>
              </div>

              {/* ជួរទី២ ខាងក្រោម: នាយកសាលា */}
              {showStampBox && (
                <div className="flex justify-start pt-2">
                  <div className="space-y-12 min-w-[200px]">
                    <div>
                      <p className="font-bold">បានឃើញ និងឯកភាព</p>
                      <p className="font-bold">{principalTitle}</p>
                      <p className="text-[10px] text-slate-500">(ហត្ថលេខា និងត្រា)</p>
                    </div>
                    <p className="font-bold underline underline-offset-4">........................................</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="no-print bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ទម្រង់ផ្លូវការក្រសួងអប់រំ • អាចទាញយក ឬព្រីនបានគ្រប់ពេល</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 text-xs transition"
            >
              បោះបង់
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>រក្សាទុកកំណត់ហេតុ PLC</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

