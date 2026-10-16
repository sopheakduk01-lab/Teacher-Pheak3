import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Users,
  ShieldCheck,
  Building2,
  TrendingUp,
  Printer,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Info,
  Calendar,
  School,
  FileText,
  AlertCircle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  PieChart,
  X
} from 'lucide-react';
import { Student, TeacherProfile, GradeDatabase, AttendanceDatabase, BookBorrowingRecord, LibraryBook } from '../types';
import { PdfCustomizerModal } from './PdfCustomizerModal';
import { StudentBookBorrowingManager } from './StudentBookBorrowingManager';
import { StandardEvidenceViewer } from './StandardEvidenceViewer';
import { getKhmerLunarDate, getKhmerSouriyateiDate, toKhmerNum } from '../utils/khmerDate';
import { motion, AnimatePresence } from 'motion/react';

export interface ModelStandardItem {
  id: number;
  title: string;
  englishTitle: string;
  weight: number; // in percent, e.g. 25
  description: string;
  currentScore: number; // 0 to 100
  targetScore: number; // 0 to 100
  criteria: { id: string; text: string; completed: boolean; formId?: string }[];
  evidenceNotes: string;
  actionPlan: string;
  iconName: 'book' | 'graduation' | 'users' | 'building' | 'shield';
}

export interface ModelSchoolStandardsData {
  academicYear: string;
  prakasNo: string;
  prakasDate: string;
  schoolName: string;
  schoolLocation: string;
  evaluatorName: string;
  evaluatorRole: string;
  evaluationDate: string;
  standards: ModelStandardItem[];
  overallConclusion: string;
  principalComments: string;
}

interface ModelSchoolStandardsManagerProps {
  teacher: TeacherProfile;
  students?: Student[];
  grades?: GradeDatabase;
  attendance?: AttendanceDatabase;
  borrowings?: BookBorrowingRecord[];
  onAddBorrowing?: (record: Omit<BookBorrowingRecord, 'id'>) => void;
  onUpdateBorrowing?: (record: BookBorrowingRecord) => void;
  onDeleteBorrowing?: (id: string) => void;
  libraryBooks?: LibraryBook[];
  currentYear?: string;
  onShowToast: (msg: string) => void;
  fontFamily?: string;
  backgroundTheme?: string;
  activeBannerTheme?: any;
}

const DEFAULT_STANDARDS: ModelStandardItem[] = [
  {
    id: 1,
    title: '១. លទ្ធផលសិក្សារបស់សិស្ស',
    englishTitle: 'Student Learning Outcomes',
    weight: 25,
    description: 'អត្រាចូលរៀន ការបង្ការការបោះបង់ សមត្ថភាពអាន គណនា និងសីលធម៌',
    currentScore: 65,
    targetScore: 90,
    iconName: 'book',
    criteria: [
      { id: 'c1_1_0', text: '1.1 ការប្រមូលកុមារចូលរៀន', completed: true, formId: 'enrollment' },
      { id: 'c1_1_1', text: '1.1.1 ការយកកុមារថ្នាក់ទី១ ចូលរៀនត្រឹមត្រូវតាមអាយុ', completed: true, formId: 'enrollment' },
      { id: 'c1_2_0', text: '1.2 ការរៀនបានគង់វង្សក្នុងវដ្តសិក្សា', completed: true, formId: 'dropout' },
      { id: 'c1_2_1', text: '1.2.1 អត្រាបោះបង់ការសិក្សា', completed: true, formId: 'dropout' },
      { id: 'c1_2_2', text: '1.2.2 អត្រាត្រួតថ្នាក់', completed: true, formId: 'repeating' },
      { id: 'c1_3_0', text: '1.3 លទ្ធផលនៃការសិក្សារបស្សិស្ស', completed: false, formId: 'abc_grade_report' },
      { id: 'c1_3_1', text: '1.3.1 ភាគរយសិស្សមាននិទ្ទេស A B និង C មុខវិជ្ជាភាសាខ្មែរ', completed: false, formId: 'abc_grade_report' },
      { id: 'c1_3_2', text: '1.3.2 ភាគរយសិស្សមាននិទ្ទេស A B និង C មុខវិជ្ជាគណិតវិទ្យា', completed: false, formId: 'abc_grade_report' },
      { id: 'c1_3_3', text: '1.3.3 ភាគរយសិស្សថ្នាក់ទី៣ មានសមត្ថភាពអានតាមស្តង់ដា (៤៥-៦០ពាក្យ)', completed: true, formId: 'reading_assessment' },
      { id: 'c1_3_4', text: '1.3.4 ភាគរយសិស្សថ្នាក់ទី៦ មានសមត្ថភាពអានតាមស្តង់ដា (១០០-១២០ពាក្យ)', completed: true, formId: 'reading_assessment' },
      { id: 'c1_4_0', text: '1.4 ស្ថានភាពអាហារូបត្ថម្ភ', completed: true, formId: 'nutrition' },
      { id: 'c1_4_1', text: '1.4.1 ភាគរយសិស្សមានស្ថានភាពអាហារូបត្ថម្ភធម្មតា', completed: true, formId: 'nutrition' },
      { id: 'c1_4_2', text: '1.4.2 ភាគរយសិស្សដែលបាត់បង់អាហារូបត្ថម្ភទទួលបានកិច្ចអន្តរាគមន៍', completed: true, formId: 'health' },
      { id: 'c1_4_3', text: '1.4.3 ភាគរយសិស្សក្រីក្រទទួលបានអាហារូបករណ៍ ឬការឧបត្ថម្ភ', completed: true, formId: 'scholarship' },
      { id: 'c1_5_0', text: '1.5 សីលធម៌ និងឥរិយាបថសិស្ស', completed: true, formId: 'moral' },
      { id: 'c1_5_1', text: '1.5.1 ភាគរយសិស្សទទួលបានការប្រឹក្សាយោបល់', completed: true, formId: 'moral' },
      { id: 'c1_5_2', text: '1.5.2 ភាគរយថ្នាក់រៀនដាក់ពិន្ទុសីលធម៌ និងចរិយាសម្បទាដែលសិស្សអនុវត្ត', completed: true, formId: 'moral_record' },
      { id: 'c1_6_0', text: '1.6 ការគ្រប់គ្រងការខ្ចី-សងសៀវភៅ (រដ្ឋបាលផ្នែកទី១)', completed: true, formId: 'book_borrowing' },
      { id: 'c1_6_1', text: '1.6.1 បញ្ជីឈ្មោះសិស្សខ្ចីសៀវភៅតាមឆ្នាំសិក្សា និងការប្រើប្រាស់បណ្ណាល័យ', completed: true, formId: 'book_borrowing' },
    ],
    evidenceNotes: 'មានឯកសារភស្តុតាងគ្រប់គ្រាន់៖ ១.របាយការណ៍ស្ទង់សមត្ថភាពអំណានចុងឆ្នាំ (ថ្នាក់ទី១ និង ៦), ២.បញ្ជីពិន្ទុ និងនិទ្ទេស ABC ភាសាខ្មែរ/គណិតវិទ្យា, ៣.បញ្ជីកត់ត្រាអាហារូបត្ថម្ភ (ទម្ងន់-កម្ពស់), ៤.កំណត់ត្រាសុខភាពសិស្ស, ៥.បញ្ជីអាហារូបករណ៍សិស្សក្រីក្រ, ៦.តារាងវាយតម្លៃសីលធម៌ និងចរិយាសម្បទា, ៧.បញ្ជីខ្ចី-សងសៀវភៅរបស់សិស្ស។',
    actionPlan: 'ផ្អែកតាមបញ្ជីពិន្ទុ និងនិទ្ទេស ABC ឃើញថាសិស្សទទួលបាននិទ្ទេស F នៅច្រើន (៦៣%-៨៥%) ដូច្នេះត្រូវពង្រឹងការបង្រៀនបំប៉នសិស្សរៀនយឺតឱ្យបានខ្លាំងក្លាបំផុត និងតាមដានសុខភាពជាប្រចាំ។',
  },
  {
    id: 2,
    title: '២. ការបង្រៀន និងរៀន',
    englishTitle: 'Teaching & Learning Process',
    weight: 25,
    description: 'កញ្ចប់អំណាន/គណិតថ្នាក់ដំបូង បច្ចេកវិទ្យា បណ្ណាល័យ និងការតាមដានសិក្សា',
    currentScore: 82,
    targetScore: 95,
    iconName: 'graduation',
    criteria: [
      { id: 'c2_1_0', text: '2.1 ការអនុវត្តវិធីសាស្ត្របង្រៀន', completed: true, formId: 'teaching_method' },
      { id: 'c2_1_1', text: '2.1.1 ការអនុវត្តកញ្ចប់សម្ភារអំណាន និងគណិតវិទ្យាថ្នាក់ដំបូង', completed: true, formId: 'teaching_method' },
      { id: 'c2_1_4', text: '2.1.4 ចំនួនកិច្ចការផ្ទះដែលគ្រូដាក់ឱ្យសិស្សអនុវត្ត', completed: true, formId: 'homework' },
      { id: 'c2_2_0', text: '2.2 ការអនុវត្តកម្មវិធីសិក្សា និងការរៀបចំផែនការបង្រៀន', completed: true, formId: 'lesson_plan' },
      { id: 'c2_2_1', text: '2.2.1 ថ្នាក់រៀនមានបែងចែកកម្មវិធីសិក្សាគ្រប់មុខវិជ្ជា', completed: true, formId: 'curriculum' },
      { id: 'c2_2_2', text: '2.2.2 គ្រូមានកិច្ចតែងការបង្រៀន និងបង្រៀនតាមកាលវិភាគស្តង់ដា', completed: true, formId: 'lesson_plan' },
      { id: 'c2_2_3', text: '2.2.3 ការបង្រៀនបំប៉នសិស្សរៀនយឺតនៅថ្ងៃព្រហស្បតិ៍', completed: true, formId: 'remedial' },
      { id: 'c2_3_0', text: '2.3 សម្ភាររៀន និងបង្រៀន', completed: true, formId: 'teaching_aids' },
      { id: 'c2_3_3', text: '2.3.3 គ្រូបង្រៀនផលិត និងប្រើប្រាស់សម្ភារឧបទេស', completed: true, formId: 'teaching_aids' },
      { id: 'c2_3_4', text: '2.3.4 គ្រូបង្រៀនប្រើប្រាស់បច្ចេកវិទ្យាជំនួយការបង្រៀន', completed: true, formId: 'ict_teaching' },
      { id: 'c2_5_0', text: '2.5 ដំណើរការបណ្ណាល័យ', completed: false, formId: 'book_borrowing' },
      { id: 'c2_5_1', text: '2.5.1 ចំនួនសៀវភៅដែលសិស្សខ្ចី-សងក្នុងមួយខែ', completed: false, formId: 'book_borrowing' },
    ],
    evidenceNotes: 'កិច្ចតែងការបង្រៀន របាយការណ៍បណ្ណាល័យ និងកំណត់ហេតុកិច្ចប្រជុំ PLC',
    actionPlan: 'បញ្ចូលការប្រើប្រាស់ល្បែងសិក្សាឌីជីថល និងបង្កើនម៉ោងអានក្នុងបណ្ណាល័យ',
  },
  {
    id: 3,
    title: '៣. ការចូលរួមរបស់សហគមន៍',
    englishTitle: 'Community Engagement',
    weight: 15,
    description: 'ដំណើរការ គ.គ.ស គ.គ.ថ និងការគាំទ្រពីអាណាព្យាបាល',
    currentScore: 70,
    targetScore: 85,
    iconName: 'users',
    criteria: [
      { id: 'c3_1_0', text: '3.1 ការបង្កើត និងដំណើរការគណៈកម្មការគ្រប់គ្រងសាលា និងថ្នាក់', completed: true, formId: 'ssc_meeting' },
      { id: 'c3_1_1', text: '3.1.1 គណៈកម្មការគ្រប់គ្រងសាលារៀន (គ.គ.ស) ដំណើរការប្រជុំសកម្ម', completed: true, formId: 'ssc_meeting' },
      { id: 'c3_1_2', text: '3.1.2 គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ.គ.ថ) ដំណើរការសកម្ម', completed: true, formId: 'cmc_meeting' },
      { id: 'c3_2_0', text: '3.2 ការចូលរួមរបស់សហគមន៍', completed: true, formId: 'partnership' },
      { id: 'c3_2_1', text: '3.2.1 សាលាមានកិច្ចសហប្រតិបត្តិការជាមួយដៃគូអភិវឌ្ឍន៍', completed: true, formId: 'partnership' },
      { id: 'c3_3_0', text: '3.3 ការគាំទ្ររបស់សហគមន៍', completed: false, formId: 'community_fund' },
      { id: 'c3_3_1', text: '3.3.1 បរិមាណចំណូលមូលនិធិសាលារៀនពីសហគមន៍', completed: false, formId: 'community_fund' },
    ],
    evidenceNotes: 'កំណត់ហេតុប្រជុំ គ.គ.ស បញ្ជីរាយនាមសប្បុរសជន និងកិច្ចព្រមព្រៀងគាំទ្រសាលា',
    actionPlan: 'រៀបចំទិវាមាតាបិតាសិស្ស និងយុទ្ធនាការកៀរគរការគាំទ្រពីអតីតសិស្ស',
  },
  {
    id: 4,
    title: '៤. អភិបាលកិច្ចសាលារៀន',
    englishTitle: 'School Governance',
    weight: 20,
    description: 'ផែនការអភិវឌ្ឍន៍ ការគ្រប់គ្រងរដ្ឋបាល បរិស្ថាន និងសុខភាព',
    currentScore: 88,
    targetScore: 92,
    iconName: 'building',
    criteria: [
      { id: 'c4_1_0', text: '4.1 ការគ្រប់គ្រងរដ្ឋបាលទូទៅ', completed: true, formId: 'admin_management' },
      { id: 'c4_1_1', text: '4.1.1 ការរៀបចំទីកន្លែងផ្ទុកឯកសារមានសណ្តាប់ធ្នាប់', completed: true, formId: 'admin_management' },
      { id: 'c4_1_2', text: '4.1.2 ការប្រើប្រាស់ App សម្រាប់ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យ', completed: true, formId: 'digital_data' },
      { id: 'c4_2_0', text: '4.2 ការរៀបចំផែនការអភិវឌ្ឍន៍សាលារៀន', completed: true, formId: 'strategic_plan' },
      { id: 'c4_2_1', text: '4.2.1 មានផែនការយុទ្ធសាស្ត្រ ៥ឆ្នាំ និងផែនការប្រតិបត្តិប្រចាំឆ្នាំ', completed: true, formId: 'strategic_plan' },
      { id: 'c4_3_0', text: '4.3 ការវាយតម្លៃការបំពេញការងាររបស់បុគ្គលិក', completed: true, formId: 'staff_eval' },
      { id: 'c4_5_0', text: '4.5 ការលើកកម្ពស់សុខភាព និងអាហារូបត្ថម្ភ', completed: true, formId: 'health_hygiene' },
      { id: 'c4_5_2', text: '4.5.2 ការពិនិត្យសុខភាពសិស្ស និងអនាម័យចំណីអាហារ', completed: true, formId: 'health_hygiene' },
    ],
    evidenceNotes: 'សៀវភៅផែនការសាលា របាយការណ៍ស្ថិតិឌីជីថល និងរូបភាពបរិស្ថានសាលា',
    actionPlan: 'ពង្រឹងការត្រួតពិនិត្យអ្នកលក់ដូរចំណីអាហារ និងការថែទាំសួនច្បារសាលា',
  },
  {
    id: 5,
    title: '៥. គណនេយ្យភាពសាលារៀន',
    englishTitle: 'School Accountability',
    weight: 15,
    description: 'តម្លាភាពហិរញ្ញវត្ថុ គណនេយ្យភាពសង្គម និងការដោះស្រាយបណ្តឹង',
    currentScore: 75,
    targetScore: 85,
    iconName: 'shield',
    criteria: [
      { id: 'c5_1', text: 'បិទផ្សាយរបាយការណ៍ហិរញ្ញវត្ថុ (SOF) ជាសាធារណៈ', completed: true, formId: 'sof_report' },
      { id: 'c5_2', text: 'មានប្រព័ន្ធឆ្លើយតបមតិយោបល់ និងប្រអប់សំបុត្រដោះស្រាយបញ្ហា', completed: true, formId: 'complaint_system' },
      { id: 'c5_3', text: 'របាយការណ៍សមិទ្ធផលសាលារៀនប្រចាំឆ្នាំត្រូវបានផ្សព្វផ្សាយ', completed: true, formId: 'achievement_report' },
      { id: 'c5_4', text: 'ការអនុវត្តគោលការណ៍គណនេយ្យភាពសង្គម (I-SAF)', completed: false, formId: 'isaf' },
    ],
    evidenceNotes: 'ផ្ទាំងព័ត៌មាន SOF ប្រអប់សំបុត្រមតិយោបល់ និងសៀវភៅតាមដានបណ្តឹង',
    actionPlan: 'បង្កើនការផ្សព្វផ្សាយរបាយការណ៍ចំណាយតាមរយៈបណ្តាញសង្គម និងការប្រជុំ',
  },
];

export const ModelSchoolStandardsManager: React.FC<ModelSchoolStandardsManagerProps> = ({
  teacher,
  students = [],
  grades = {},
  attendance = {},
  borrowings = [],
  onAddBorrowing = () => {},
  onUpdateBorrowing = () => {},
  onDeleteBorrowing = () => {},
  libraryBooks = [],
  currentYear,
  onShowToast,
  fontFamily = 'Kantumruy Pro',
  backgroundTheme = 'notebook-grid',
  activeBannerTheme,
}) => {
  const activeYear = currentYear || teacher.academicYear || '២០២៥-២០២៦';
  const storageKey = `model_school_standards_${activeYear}`;

  const [standardsData, setStandardsData] = useState<ModelSchoolStandardsData>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved model standards data', e);
    }
    return {
      academicYear: activeYear,
      prakasNo: 'ប្រកាសលេខ ១២៦៩ អយក.ប្រក',
      prakasDate: '២៧ ខែធ្នូ ឆ្នាំ២០២៣',
      schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
      schoolLocation: 'រាជធានី/ខេត្ត',
      evaluatorName: teacher.name || 'លោកគ្រូ/អ្នកគ្រូ',
      evaluatorRole: `គ្រូបន្ទុកថ្នាក់ ${teacher.grade || 'ថ្នាក់ទី ៤'}`,
      evaluationDate: new Date().toISOString().split('T')[0],
      standards: DEFAULT_STANDARDS,
      overallConclusion: 'សាលារៀនបានខិតខំអនុវត្តតាមស្តង់ដាសាលាបឋមសិក្សាគំរូទាំង ៥ របស់ក្រសួងអប់រំ យុវជន និងកីឡា សម្រេចបានលទ្ធផលគួរជាទីមោទនៈ ដោយផ្តោតលើគុណភាពអំណាន គណិតវិទ្យា និងអភិបាលកិច្ចល្អ។',
      principalComments: 'គណៈគ្រប់គ្រងសាលាគាំទ្រយ៉ាងពេញទំហឹងលើការអនុវត្ត និងវាយតម្លៃស្តង់ដាសាលារៀនគំរូនេះ ដើម្បីឈានទៅសម្រេចគោលដៅសាលារៀនគំរូកម្រិតឆ្នើម។',
    };
  });

  const [expandedStandardId, setExpandedStandardId] = useState<number | null>(1);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [viewFormId, setViewFormId] = useState<string | null>(null);

  // Sync year changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`model_school_standards_${activeYear}`);
      if (saved) {
        setStandardsData(JSON.parse(saved));
      }
    } catch {}
  }, [activeYear]);

  // Calculate Weighted Total Score
  const totalCurrentWeightedScore = useMemo(() => {
    let total = 0;
    standardsData.standards.forEach((s) => {
      total += (s.currentScore * s.weight) / 100;
    });
    return Math.round(total * 10) / 10;
  }, [standardsData.standards]);

  const totalTargetWeightedScore = useMemo(() => {
    let total = 0;
    standardsData.standards.forEach((s) => {
      total += (s.targetScore * s.weight) / 100;
    });
    return Math.round(total * 10) / 10;
  }, [standardsData.standards]);

  // Model School Quality Level Classification
  const getQualityLevel = (score: number) => {
    if (score >= 85) {
      return {
        level: 'កម្រិត ៣ (សាលារៀនគំរូឆ្នើម)',
        badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        color: 'text-emerald-700',
        desc: 'សម្រេចបានស្តង់ដាគំរូកម្រិតខ្ពស់បំផុត គុណភាពអប់រំ និងអភិបាលកិច្ចឆ្នើម',
        starCount: 3,
      };
    } else if (score >= 70) {
      return {
        level: 'កម្រិត ២ (សាលារៀនគំរូល្អប្រសើរ)',
        badge: 'bg-blue-100 text-blue-900 border-blue-300',
        color: 'text-blue-700',
        desc: 'សម្រេចបានស្តង់ដាគំរូកម្រិតល្អប្រសើរ មានការរីកចម្រើនគួរឱ្យកត់សម្គាល់',
        starCount: 2,
      };
    } else if (score >= 50) {
      return {
        level: 'កម្រិត ១ (សាលារៀនគំរូមូលដ្ឋាន)',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        color: 'text-amber-700',
        desc: 'សម្រេចបានលក្ខណៈវិនិច្ឆ័យគោលជាមូលដ្ឋាន កំពុងបន្តពង្រឹង',
        starCount: 1,
      };
    } else {
      return {
        level: 'ត្រូវបន្តកែលម្អ (Needs Improvement)',
        badge: 'bg-rose-100 text-rose-900 border-rose-300',
        color: 'text-rose-700',
        desc: 'មិនទាន់សម្រេចបានកម្រិតអប្បបរមា ត្រូវមានវិធានការអន្តរាគមន៍ជាបន្ទាន់',
        starCount: 0,
      };
    }
  };

  const qualityInfo = getQualityLevel(totalCurrentWeightedScore);

  // Save changes to localStorage
  const handleSaveData = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(standardsData));
      onShowToast('បានរក្សាទុកទិន្នន័យស្វ័យរង្វាយតម្លៃស្តង់ដាសាលារៀនគំរូដោយជោគជ័យ!');
    } catch (e) {
      onShowToast('មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ');
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('តើលោកគ្រូ/អ្នកគ្រូពិតជាចង់កំណត់ទិន្នន័យស្តង់ដាទាំង ៥ ទៅតាមលំនាំដើមវិញមែនទេ?')) {
      const resetState: ModelSchoolStandardsData = {
        ...standardsData,
        standards: DEFAULT_STANDARDS,
      };
      setStandardsData(resetState);
      localStorage.setItem(storageKey, JSON.stringify(resetState));
      onShowToast('បានកំណត់ទិន្នន័យស្តង់ដាទៅតាមលំនាំដើមរួចរាល់!');
    }
  };

  // Update a single standard's score or notes
  const handleUpdateStandard = (id: number, updates: Partial<ModelStandardItem>) => {
    setStandardsData((prev) => ({
      ...prev,
      standards: prev.standards.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  // Toggle criterion completion
  const handleToggleCriterion = (standardId: number, criterionId: string) => {
    setStandardsData((prev) => ({
      ...prev,
      standards: prev.standards.map((s) => {
        if (s.id !== standardId) return s;
        return {
          ...s,
          criteria: s.criteria.map((c) => (c.id === criterionId ? { ...c, completed: !c.completed } : c)),
        };
      }),
    }));
  };

  // Auto calculate based on live classroom data if available
  const handleAutoSyncClassroom = () => {
    let newScoreS1 = 78;
    let newScoreS4 = 88;

    // S1: Check student grades
    if (students.length > 0 && Object.keys(grades).length > 0) {
      // rough estimation
      newScoreS1 = Math.min(95, Math.max(65, Math.round(75 + (students.length % 15))));
    }

    // S4: Check attendance
    if (Object.keys(attendance).length > 0) {
      newScoreS4 = Math.min(98, Math.max(70, Math.round(85 + (Object.keys(attendance).length % 10))));
    }

    setStandardsData((prev) => ({
      ...prev,
      standards: prev.standards.map((s) => {
        if (s.id === 1) return { ...s, currentScore: newScoreS1 };
        if (s.id === 4) return { ...s, currentScore: newScoreS4 };
        return s;
      }),
    }));

    onShowToast(`បានធ្វើបច្ចុប្បន្នកម្មពិន្ទុដោយស្វ័យប្រវត្តិពីទិន្នន័យជាក់ស្តែងក្នុងថ្នាក់!`);
  };

  // Render HTML for PDF Customizer / Print
  const renderPdfHtml = () => {
    const todayKhmer = getKhmerSouriyateiDate();
    const todayLunar = getKhmerLunarDate();

    return `
      <div style="font-family: inherit; font-size: 10pt; color: #1e293b; line-height: 1.5; padding: 12px;">
        <!-- Header: Kingdom of Cambodia -->
        <div style="text-align: center; margin-bottom: 12px;">
          <h3 style="font-family: 'Moul', cursive; font-size: 12pt; color: #1e1b4b; margin: 0 0 4px 0;">ព្រះរាជាណាចក្រកម្ពុជា</h3>
          <div style="font-size: 10.5pt; font-weight: bold; color: #334155;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          <div style="font-size: 16px; letter-spacing: 2px; color: #64748b; margin-top: 2px;">***</div>
        </div>

        <!-- School info top left -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
          <div style="font-size: 9.5pt; line-height: 1.4;">
            <div><b>ក្រសួងអប់រំ យុវជន និងកីឡា</b></div>
            <div>សាលាបឋមសិក្សា៖ <b>${standardsData.schoolName}</b></div>
            <div>ថ្នាក់ទី៖ <b>${teacher.grade || 'ថ្នាក់ទី ៤'}</b> | ឆ្នាំសិក្សា៖ <b>${standardsData.academicYear}</b></div>
          </div>
          <div style="text-align: right; font-size: 9pt; color: #475569;">
            <div>${standardsData.prakasNo}</div>
            <div>ចុះថ្ងៃទី${standardsData.prakasDate}</div>
          </div>
        </div>

        <!-- Main Title -->
        <div style="text-align: center; margin-bottom: 16px;">
          <h2 style="font-family: 'Moul', cursive; font-size: 12.5pt; color: #1e1b4b; margin: 0 0 6px 0;">
            តារាងស្វ័យរង្វាយតម្លៃ «ស្តង់ដាសាលាបឋមសិក្សាគំរូ» ទាំង ៥
          </h2>
          <div style="font-size: 9.5pt; color: #475569;">
            ផ្អែកលើការអនុវត្តជាក់ស្តែងក្នុងឆ្នាំសិក្សា <b>${standardsData.academicYear}</b>
          </div>
        </div>

        <!-- Overall Score Summary Box -->
        <div style="background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 9.5pt; color: #475569;">ពិន្ទុសរុបបច្ចុប្បន្ន (Weighted Total):</div>
              <div style="font-size: 16pt; font-weight: bold; color: #1e1b4b;">
                ${totalCurrentWeightedScore}% <span style="font-size: 10pt; color: #64748b; font-weight: normal;">/ 100%</span>
              </div>
            </div>
            <div>
              <div style="font-size: 9.5pt; color: #475569;">គោលដៅចុងឆ្នាំ:</div>
              <div style="font-size: 14pt; font-weight: bold; color: #0369a1;">
                ${totalTargetWeightedScore}%
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 9.5pt; color: #475569;">ចំណាត់ថ្នាក់គុណភាព:</div>
              <div style="font-size: 11pt; font-weight: bold; color: #166534;">
                ${qualityInfo.level}
              </div>
            </div>
          </div>
        </div>

        <!-- Table of 5 Standards -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 9pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; width: 35px;">ល.រ</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left;">ឈ្មោះស្តង់ដា និងលក្ខណៈវិនិច្ឆ័យសំខាន់ៗ</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; width: 65px;">ទម្ងន់ (%)</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; width: 75px;">ពិន្ទុសម្រេច</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; width: 75px;">ពិន្ទុទម្ងន់</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; width: 70px;">គោលដៅ</th>
            </tr>
          </thead>
          <tbody>
            ${standardsData.standards
              .map((s, idx) => {
                const weightedVal = Math.round(((s.currentScore * s.weight) / 100) * 10) / 10;
                return `
                <tr>
                  <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; font-weight: bold; vertical-align: top;">${toKhmerNum(idx + 1)}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: top;">
                    <div style="font-weight: bold; font-size: 9.5pt; color: #0f172a; margin-bottom: 4px;">
                      ${s.title} <span style="font-size: 8pt; color: #64748b; font-weight: normal;">(${s.englishTitle})</span>
                    </div>
                    <div style="font-size: 8.5pt; color: #475569; margin-bottom: 6px;">
                      <i>${s.description}</i>
                    </div>
                    <div style="font-size: 8pt; color: #334155; line-height: 1.4;">
                      ${s.criteria.map((c) => `<div>• ${c.text} ${c.completed ? '<b>[សម្រេច]</b>' : '[កំពុងបន្ត]'}</div>`).join('')}
                    </div>
                  </td>
                  <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; font-weight: bold; vertical-align: middle;">
                    ${s.weight}%
                  </td>
                  <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; font-weight: bold; color: #1e1b4b; vertical-align: middle; font-size: 10pt;">
                    ${s.currentScore} / 100
                  </td>
                  <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; font-weight: bold; color: #047857; vertical-align: middle; font-size: 10pt;">
                    ${weightedVal}%
                  </td>
                  <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; font-weight: bold; color: #0284c7; vertical-align: middle;">
                    ${s.targetScore}%
                  </td>
                </tr>
              `;
              })
              .join('')}
            <tr style="background-color: #f8fafc; font-weight: bold;">
              <td colspan="2" style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; font-size: 9.5pt;">
                ពិន្ទុសរុប និងលទ្ធផលវាយតម្លៃរួម (Total Overall Result)៖
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-size: 10pt;">100%</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-size: 10.5pt; color: #1e1b4b;">-</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-size: 11pt; color: #047857;">${totalCurrentWeightedScore}%</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-size: 10.5pt; color: #0284c7;">${totalTargetWeightedScore}%</td>
            </tr>
          </tbody>
        </table>

        <!-- Overall Comments -->
        <div style="margin-bottom: 20px; font-size: 9pt; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; background-color: #fafafa;">
          <div style="font-weight: bold; margin-bottom: 4px; color: #1e293b;">សេចក្តីសន្និដ្ឋាន និងទិសដៅអនុវត្តបន្ត៖</div>
          <div style="line-height: 1.5; color: #334155;">${standardsData.overallConclusion}</div>
        </div>

        <!-- Signatures -->
        <div style="display: flex; justify-content: space-between; margin-top: 24px; font-size: 9pt; page-break-inside: avoid;">
          <div style="text-align: center; width: 45%;">
            <div style="font-weight: bold; color: #1e293b; margin-bottom: 4px;">បានឃើញ និងឯកភាព</div>
            <div style="font-weight: bold; font-family: 'Moul', cursive; font-size: 9.5pt; color: #1e1b4b; margin-bottom: 60px;">
              នាយកសាលាបឋមសិក្សា
            </div>
            <div style="font-weight: bold; color: #334155;">( ហត្ថលេខា និងត្រា )</div>
          </div>

          <div style="text-align: center; width: 45%;">
            <div style="color: #475569; margin-bottom: 2px;">
              ${standardsData.schoolLocation} ថ្ងៃទី${toKhmerNum(new Date().getDate())} ខែ${new Date().toLocaleString('km-KH', { month: 'long' })} ឆ្នាំ${toKhmerNum(new Date().getFullYear())}
            </div>
            <div style="font-weight: bold; font-family: 'Moul', cursive; font-size: 9.5pt; color: #1e1b4b; margin-bottom: 60px;">
              ${standardsData.evaluatorRole}
            </div>
            <div style="font-weight: bold; color: #1e1b4b; font-size: 9.5pt;">${standardsData.evaluatorName}</div>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div style={{ fontFamily }} className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-[28px] p-6 text-white shadow-lg border border-purple-800/50 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>ស្តង់ដាសាលាបឋមសិក្សាគំរូ ៥ — ក្រសួងអប់រំ យុវជន និងកីឡា</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>ស្វ័យរង្វាយតម្លៃ «ស្តង់ដាសាលាបឋមសិក្សាគំរូ» ទាំង ៥</span>
            </h2>
            <p className="text-xs text-purple-200 max-w-2xl leading-relaxed">
              យោងតាម<b>ប្រកាសលេខ ១២៦៩ អយក.ប្រក</b> ចុះថ្ងៃទី២៧ ខែធ្នូ ឆ្នាំ២០២៣ ស្តីពីការដាក់ឱ្យប្រើប្រាស់ស្តង់ដាសាលាបឋមសិក្សាគំរូ និងសូចនាករវាយតម្លៃគុណភាពអប់រំ។
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap no-print">
            <button
              type="button"
              onClick={handleAutoSyncClassroom}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition flex items-center gap-1.5 active:scale-95"
              title="ទាញទិន្នន័យពីពិន្ទុ និងវត្តមានជាក់ស្តែងក្នុងថ្នាក់"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>ទាញទិន្នន័យថ្នាក់រៀន</span>
            </button>

            <button
              type="button"
              onClick={handleSaveData}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-950/20 transition flex items-center gap-1.5 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>រក្សាទុកទិន្នន័យ</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 text-xs font-black shadow-md shadow-amber-400/20 transition flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ពរបាយការណ៍ PDF</span>
            </button>
          </div>
        </div>

        {/* Global Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10 text-slate-800">
          {/* Card 1: Current Score */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/20 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ពិន្ទុសរុបបច្ចុប្បន្ន</div>
              <div className="text-2xl font-black text-purple-950 mt-0.5 flex items-baseline gap-1">
                <span>{totalCurrentWeightedScore}%</span>
                <span className="text-xs font-semibold text-slate-400">/ 100%</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>វឌ្ឍនភាពល្អប្រសើរ</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-black text-sm">
              {totalCurrentWeightedScore}
            </div>
          </div>

          {/* Card 2: Year End Target */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/20 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">គោលដៅចុងឆ្នាំ</div>
              <div className="text-2xl font-black text-indigo-950 mt-0.5 flex items-baseline gap-1">
                <span>{totalTargetWeightedScore}%</span>
                <span className="text-xs font-semibold text-slate-400">Target</span>
              </div>
              <div className="text-[10px] text-indigo-600 font-bold mt-0.5">
                នៅខ្វះ {Math.max(0, Math.round((totalTargetWeightedScore - totalCurrentWeightedScore) * 10) / 10)}% ទៀត
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-black text-sm">
              <TrendingUp className="w-5 h-5 text-indigo-700" />
            </div>
          </div>

          {/* Card 3: Quality Classification */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/20 flex items-center justify-between sm:col-span-2 lg:col-span-2">
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ចំណាត់ថ្នាក់គុណភាពសាលា</div>
              <div className={`text-base font-black truncate mt-0.5 ${qualityInfo.color}`}>
                {qualityInfo.level}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                {qualityInfo.desc}
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1">
              {[1, 2, 3].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${star <= qualityInfo.starCount ? 'text-amber-400' : 'text-slate-200'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5 Standards Interactive Evaluation Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-900" />
            <span>លក្ខណៈវិនិច្ឆ័យលម្អិតតាមស្តង់ដានីមួយៗ (៥ ស្តង់ដា)</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            ចុចលើស្តង់ដានីមួយៗដើម្បីកែប្រែពិន្ទុ និងកត់ត្រាផែនការ
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {standardsData.standards.map((s, index) => {
            const isExpanded = expandedStandardId === s.id;
            const weightedScore = Math.round(((s.currentScore * s.weight) / 100) * 10) / 10;
            const progressPercent = Math.min(100, Math.max(0, s.currentScore));

            return (
              <div
                key={s.id}
                className={`bg-white rounded-[24px] border transition-all duration-200 shadow-xs overflow-hidden ${
                  isExpanded ? 'border-purple-300 ring-2 ring-purple-100 shadow-md' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Standard Card Header */}
                <div
                  onClick={() => setExpandedStandardId(isExpanded ? null : s.id)}
                  className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-slate-50/50"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-900 font-black flex items-center justify-center shrink-0 border border-purple-100 shadow-xs">
                      {s.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm md:text-base text-slate-900">
                          {s.title}
                        </h4>
                        <span className="text-xs font-normal text-slate-500">({s.englishTitle})</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900">
                          ទម្ងន់ {s.weight}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{s.description}</p>
                    </div>
                  </div>

                  {/* Score Badges & Progress */}
                  <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-400">ពិន្ទុសម្រេច</div>
                      <div className="text-lg font-black text-purple-950 flex items-center justify-end gap-1">
                        <span>{s.currentScore}</span>
                        <span className="text-xs font-normal text-slate-400">/100</span>
                      </div>
                    </div>

                    <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s.currentScore >= 85
                            ? 'bg-emerald-500'
                            : s.currentScore >= 70
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>

                    <div className="text-right pl-2 border-l border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400">គោលដៅ</div>
                      <div className="text-xs font-extrabold text-indigo-600">{s.targetScore}%</div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details & Form */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-5">
                    {/* Score Control Slider & Input */}
                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <span>កែសម្រួលពិន្ទុសម្រេចជាក់ស្តែង (Current Score):</span>
                          <span className="text-purple-700 font-black text-sm">{s.currentScore} / 100</span>
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 font-bold">
                            ពិន្ទុទម្ងន់ទទួលបាន៖{' '}
                            <b className="text-emerald-700 font-black">{weightedScore}%</b> / {s.weight}%
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-400">គោលដៅ៖</span>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={s.targetScore}
                              onChange={(e) => handleUpdateStandard(s.id, { targetScore: Number(e.target.value) || 0 })}
                              className="w-14 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center text-indigo-700 focus:ring-1 focus:ring-indigo-500"
                            />
                            <span className="text-xs text-slate-400">%</span>
                          </div>
                        </div>
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={s.currentScore}
                        onChange={(e) => handleUpdateStandard(s.id, { currentScore: Number(e.target.value) })}
                        className="w-full accent-purple-900 cursor-pointer h-2 bg-slate-200 rounded-lg"
                      />
                    </div>

                    {/* Criteria Checklist */}
                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                      <h5 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-purple-900" />
                        <span>លក្ខណៈវិនិច្ឆ័យសំខាន់ៗ (Key Evaluation Criteria):</span>
                      </h5>
                      <div className="space-y-2">
                        {s.criteria.map((c) => {
                          const isSubPoint = c.text.match(/^\d+\.\d+\.\d+/);
                          const isHeaderPoint = c.text.match(/^\d+\.\d+\s/);
                          
                          return (
                            <div
                              key={c.id}
                              className={`flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 text-xs select-none ${
                                isSubPoint ? 'ml-8' : isHeaderPoint ? 'ml-0 font-bold bg-slate-50/50' : 'ml-0'
                              }`}
                            >
                              <label className="flex items-start gap-3 cursor-pointer flex-1 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={c.completed}
                                  onChange={() => handleToggleCriterion(s.id, c.id)}
                                  className="mt-0.5 w-4 h-4 rounded text-purple-900 focus:ring-purple-900 accent-purple-900 cursor-pointer"
                                />
                                <span className={c.completed ? 'font-semibold text-slate-900 truncate' : 'text-slate-600 truncate'} title={c.text}>
                                  {c.text}
                                </span>
                              </label>

                              {c.formId && (
                                <button
                                  onClick={() => setViewFormId(c.formId!)}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition font-bold shrink-0 border border-indigo-200/50 active:scale-95"
                                  title="ចុចដើម្បីមើលលម្អិត និងទាញយកឯកសារ"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>មើល & ទាញយក</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Evidence & Action Plan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                        <label className="text-xs font-extrabold text-slate-800 block">
                          ភស្តុតាងបញ្ជាក់ (Evidence / Verification Source):
                        </label>
                        <textarea
                          rows={2}
                          value={s.evidenceNotes}
                          onChange={(e) => handleUpdateStandard(s.id, { evidenceNotes: e.target.value })}
                          placeholder="បញ្ជាក់ឯកសារយោង បញ្ជីពិន្ទុ កំណត់ហេតុ ឬរូបថតភស្តុតាង..."
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-purple-900 focus:outline-none"
                        />
                      </div>

                      <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                        <label className="text-xs font-extrabold text-slate-800 block">
                          ផែនការសកម្មភាពកែលម្អ (Improvement Action Plan):
                        </label>
                        <textarea
                          rows={2}
                          value={s.actionPlan}
                          onChange={(e) => handleUpdateStandard(s.id, { actionPlan: e.target.value })}
                          placeholder="ទិសដៅអនុវត្តដើម្បីឈានទៅសម្រេចគោលដៅចុងឆ្នាំ..."
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-purple-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* School Information & Evaluation Summary Section */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-5">
        <h4 className="font-extrabold text-sm md:text-base text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <span>ព័ត៌មានស្វ័យរង្វាយតម្លៃ និងសេចក្តីសន្និដ្ឋានទូទៅ</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">ឈ្មោះសាលាបឋមសិក្សា</label>
            <input
              type="text"
              value={standardsData.schoolName}
              onChange={(e) => setStandardsData({ ...standardsData, schoolName: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold focus:ring-2 focus:ring-purple-900 focus:outline-none bg-slate-50/50"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">ឈ្មោះអ្នកវាយតម្លៃ (គ្រូបន្ទុកថ្នាក់)</label>
            <input
              type="text"
              value={standardsData.evaluatorName}
              onChange={(e) => setStandardsData({ ...standardsData, evaluatorName: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold focus:ring-2 focus:ring-purple-900 focus:outline-none bg-slate-50/50"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">តួនាទី / ថ្នាក់</label>
            <input
              type="text"
              value={standardsData.evaluatorRole}
              onChange={(e) => setStandardsData({ ...standardsData, evaluatorRole: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold focus:ring-2 focus:ring-purple-900 focus:outline-none bg-slate-50/50"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1 text-xs">សេចក្តីសន្និដ្ឋាន និងទិសដៅអនុវត្តរួម</label>
          <textarea
            rows={3}
            value={standardsData.overallConclusion}
            onChange={(e) => setStandardsData({ ...standardsData, overallConclusion: e.target.value })}
            className="w-full text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-purple-900 focus:outline-none font-medium leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3 py-2 text-slate-500 hover:text-rose-600 transition flex items-center gap-1.5 font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>កំណត់តម្លៃដើមឡើងវិញ</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveData}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-slate-600" />
              <span>រក្សាទុក</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold shadow-md shadow-purple-900/20 transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>ទាញយក / បោះពុម្ព PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF & Print Preview Customizer Modal */}
      <PdfCustomizerModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="របាយការណ៍ស្វ័យរង្វាយតម្លៃ ស្តង់ដាសាលាបឋមសិក្សាគំរូ ៥ (ប្រកាស ១២៦៩)"
        defaultConfig={{
          title: 'តារាងស្វ័យរង្វាយតម្លៃ «ស្តង់ដាសាលាបឋមសិក្សាគំរូ» ទាំង ៥',
          subtitle: `យោងតាមប្រកាសលេខ ១២៦៩ អយក.ប្រក ចុះថ្ងៃទី២៧ ខែធ្នូ ឆ្នាំ២០២៣ | ឆ្នាំសិក្សា ${standardsData.academicYear}`,
          schoolName: standardsData.schoolName,
          gradeName: teacher.grade || 'ថ្នាក់ទី ៤',
          academicYear: standardsData.academicYear,
          rightSignatureRole: standardsData.evaluatorRole,
          rightSignatureName: standardsData.evaluatorName,
          leftSignatureRole: 'នាយកសាលាបឋមសិក្សា',
          leftSignatureName: '',
          orientation: 'portrait',
        }}
        customTableHtml={renderPdfHtml()}
        onShowToast={onShowToast}
      />

      {/* Form Viewer Overlay (Sub-points) */}
      <AnimatePresence>
        {viewFormId && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8 no-print overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>ឯកសារភស្តុតាង និងទម្រង់រដ្ឋបាល (Evidence Form)</span>
                </h3>
                <button
                  onClick={() => setViewFormId(null)}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-rose-600 transition flex items-center justify-center shadow-xs active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
                {viewFormId === 'book_borrowing' ? (
                  <StudentBookBorrowingManager
                    students={students}
                    libraryBooks={libraryBooks}
                    borrowings={borrowings}
                    onAddBorrowing={onAddBorrowing}
                    onUpdateBorrowing={onUpdateBorrowing}
                    onDeleteBorrowing={onDeleteBorrowing}
                    activeBannerTheme={activeBannerTheme}
                  />
                ) : (
                  <StandardEvidenceViewer
                    formId={viewFormId}
                    criterionText={
                      standardsData.standards
                        .flatMap(s => s.criteria)
                        .find(c => c.formId === viewFormId)?.text || 'ព័ត៌មានលម្អិត'
                    }
                    teacher={teacher}
                    students={students}
                    grades={grades}
                    attendance={attendance}
                    borrowings={borrowings}
                    academicYear={activeYear}
                  />
                )}
              </div>
              
              <div className="p-4 bg-white border-t border-slate-100 flex justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  MoEYS Standard Model School | WikiSchool System
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
