import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Check,
  Trash2,
  Sparkles,
  BookOpen,
  CheckSquare,
  ArrowUpDown,
  Copy,
  Printer,
  FileText,
  X,
  Shuffle,
  Type,
  AlignLeft,
  Layers,
  HelpCircle,
  Eye,
  Download,
  Settings2,
  Palette,
  CheckCircle2,
  Sliders,
  FileDown,
  Search,
  Filter,
  Play,
  Edit3,
  FolderArchive,
  RotateCcw,
  Calendar,
  Award,
  GraduationCap,
  Clock,
  BookMarked,
  FileCheck2,
  Globe2,
  PenTool,
  CheckCheck,
  LayoutTemplate,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Quiz, QuizQuestion, QuestionType, MatchingPair, QuizOption, PisaQuestionPart, PassageQuestionItem } from '../types';
import {
  WorksheetPaperView,
  WorksheetOptions,
  WorksheetType,
  WorksheetBorderStyle,
  WorksheetFontSize,
  WorksheetDesignTheme,
  PageOrientation,
  PageLayoutMode,
  WORKSHEET_TYPE_TITLES,
  WORKSHEET_DESIGN_INFO,
} from './WorksheetPaperView';
import { printWorksheetDocument, exportWorksheetToWordDoc } from '../utils/worksheetExport';
import { getKhmerSouriyateiDate } from '../utils/khmerDate';
import { PdfCustomizerModal } from './PdfCustomizerModal';

interface CreateQuizTabProps {
  teacherName: string;
  quizzes?: Quiz[];
  onSaveQuiz: (quiz: Quiz) => void;
  onDeleteQuiz?: (id: string) => void;
  onPlayQuiz?: (quiz: Quiz) => void;
  onShowToast: (msg: string) => void;
  onNavigateHome: () => void;
}

const QUESTION_TYPE_INFO: Record<
  QuestionType,
  { label: string; shortLabel: string; icon: any; color: string; desc: string }
> = {
  qcm: {
    label: 'សំណួរពហុជ្រើសរើស (QCM)',
    shortLabel: 'QCM ៤ ជម្រើស',
    icon: CheckSquare,
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    desc: 'ជ្រើសរើសចម្លើយត្រឹមត្រូវ ១ ក្នុងចំណោមជម្រើសជាច្រើន',
  },
  multi_select: {
    label: 'ពហុជ្រើសរើសចម្លើយច្រើន (Multi-Select Checkboxes)',
    shortLabel: 'ជ្រើសរើសច្រើន',
    icon: CheckCheck,
    color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    desc: 'ជ្រើសរើសចម្លើយត្រឹមត្រូវទាំងអស់ដែលមានក្នុងជម្រើស (Checkboxes)',
  },
  pisa: {
    label: 'សំណួរបែប PISA (ស្ថានភាពជាក់ស្តែង & ត្រិះរិះវិភាគ)',
    shortLabel: 'សំណួរ PISA',
    icon: Globe2,
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    desc: 'ផ្អែកលើស្ថានភាពជីវិតពិត វិទ្យាសាស្ត្រ ឬគណិតវិទ្យាវាស់វែងសមត្ថភាពវិភាគ',
  },
  reading_comprehension: {
    label: 'អត្ថបទអំណាន និងសំណួរវិភាគ (Reading Passage)',
    shortLabel: 'អត្ថបទអំណាន',
    icon: BookOpen,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    desc: 'កថាខណ្ឌអត្ថបទសម្រាប់អាន និងកម្រងសំណួរយល់ន័យ',
  },
  true_false: {
    label: 'សំណួរ ខុស ឬ ត្រូវ (True / False)',
    shortLabel: 'ខុស ត្រូវ',
    icon: HelpCircle,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: 'កំណត់ថាការលើកឡើងត្រឹមត្រូវ (ត្រូវ) ឬមិនត្រឹមត្រូវ (ខុស)',
  },
  matching: {
    label: 'សំណួរផ្គូរផ្គង (Matching Pairs)',
    shortLabel: 'ផ្គូរផ្គង',
    icon: Layers,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    desc: 'ផ្គូផ្គងធាតុនៅជួរក ជាមួយធាតុនៅជួរខ ឱ្យត្រូវគ្នា',
  },
  fill_blank: {
    label: 'សំណួរបំពេញចន្លោះ (Fill in the Blanks)',
    shortLabel: 'បំពេញចន្លោះ',
    icon: AlignLeft,
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    desc: 'បំពេញពាក្យ ឬឃ្លាដែលបាត់ក្នុងចន្លោះនៃល្បះ',
  },
  reorder_words: {
    label: 'រៀបពាក្យឲ្យល្បះត្រឹមត្រូវ (Word Ordering)',
    shortLabel: 'រៀបពាក្យ',
    icon: Shuffle,
    color: 'bg-teal-100 text-teal-800 border-teal-300',
    desc: 'រៀបចំកម្រងពាក្យរាយប៉ាយឱ្យក្លាយជាប្រយោគ/ល្បះត្រឹមត្រូវ',
  },
  short_answer: {
    label: 'សំណួរចម្លើយខ្លី (Short Answer)',
    shortLabel: 'ចម្លើយខ្លី',
    icon: Type,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    desc: 'សរសេរចម្លើយខ្លីៗ ឬពាក្យគន្លឹះសម្រាប់ដោះស្រាយសំណួរ',
  },
  essay: {
    label: 'សំណួរសំណេរពិចារណា / តែងសេចក្តី (Essay)',
    shortLabel: 'សំណេរពិចារណា',
    icon: PenTool,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: 'ប្រធានសំណេរពិចារណា បញ្ចេញទស្សនៈ និងលក្ខណៈវិនិច្ឆ័យវាយតម្លៃ',
  },
};

const createSampleQuestion = (type: QuestionType, id: number): QuizQuestion => {
  switch (type) {
    case 'pisa':
      return {
        id,
        type: 'pisa',
        pisaDomain: 'science',
        pisaContext:
          'ក្នុងសហគមន៍ជនបទមួយ ប្រជាពលរដ្ឋបានដំឡើងបន្ទះស្រូបពន្លឺព្រះអាទិត្យ (Solar Panel) ទំហំ ១០ ម៉ែត្រការ៉េ។ រៀងរាល់ថ្ងៃ បន្ទះនេះអាចបង្កើតថាមពលអគ្គិសនីជាមធ្យម ៤ គីឡូវ៉ាត់ម៉ោងក្នុង ១ ម៉ែត្រការ៉េ។ ក្រុមគ្រួសារនីមួយៗក្នុងភូមិត្រូវការថាមពលអគ្គិសនីជាមធ្យម ៨ គីឡូវ៉ាត់ម៉ោងក្នុងមួយថ្ងៃ។',
        question:
          'ផ្អែកលើទិន្នន័យជាក់ស្តែង និងស្ថានភាពខាងលើ ចូរវិភាគ និងដោះស្រាយសំណួរខាងក្រោម៖',
        timeLimit: 60,
        points: 1500,
        pisaParts: [
          {
            id: `p-${id}-1`,
            prompt:
              'តើក្នុងមួយថ្ងៃ បន្ទះស្រូបពន្លឺព្រះអាទិត្យទាំងអស់នេះអាចបង្កើតថាមពលអគ្គិសនីសរុបបានប៉ុន្មានគីឡូវ៉ាត់ម៉ោង?',
            points: 1.5,
            sampleAnswer:
              'ថាមពលសរុប = ១០ ម៉ែត្រការ៉េ × ៤ គីឡូវ៉ាត់ម៉ោង = ៤០ គីឡូវ៉ាត់ម៉ោងក្នុងមួយថ្ងៃ។',
          },
          {
            id: `p-${id}-2`,
            prompt:
              'តើថាមពលអគ្គិសនីដែលផលិតបាននេះ អាចផ្គត់ផ្គង់ដល់ក្រុមគ្រួសារក្នុងភូមិបានចំនួនប៉ុន្មានគ្រួសារ?',
            points: 1.5,
            sampleAnswer:
              'ចំនួនគ្រួសារ = ៤០ គីឡូវ៉ាត់ម៉ោង ÷ ៨ គីឡូវ៉ាត់ម៉ោង = ៥ គ្រួសារ។',
          },
        ],
        pisaReasoning:
          'សំណួរនេះវាស់វែងសមត្ថភាពអនុវត្តគណិតវិទ្យា និងវិទ្យាសាស្ត្របរិស្ថានលើការដោះស្រាយបញ្ហាជីវភាពជាក់ស្តែង។',
        correctAnswer:
          'បន្ទះសូឡាបង្កើតបាន ៤០ kWh/ថ្ងៃ និងផ្គត់ផ្គង់បាន ៥ គ្រួសារ។',
        options: [
          { id: 'a', text: '៤០ kWh និងផ្គត់ផ្គង់បាន ៥ គ្រួសារ', isCorrect: true, color: 'green', shape: '✔' },
        ],
      };
    case 'reading_comprehension':
      return {
        id,
        type: 'reading_comprehension',
        passageTitle: 'រឿង កូនទន្សាយឈ្លាសវៃ និងសត្វតោ',
        passageText:
          'កាលពីព្រេងនាយ មានសត្វតោមួយកាចសាហាវតែងតែគំរាមកំហែង និងចាប់សត្វនានាក្នុងព្រៃធ្វើជាចំណីជារៀងរាល់ថ្ងៃ។ សត្វទាំងអស់បានប្រជុំគ្នាព្រមព្រៀងបញ្ជូនសត្វមួយៗទៅជួបតោតាមវេន។ នៅថ្ងៃមួយ ដល់វេនកូនទន្សាយតូចមួយ។ ដោយភាពឆ្លាតវៃ ទន្សាយបានដើរយឺតៗ ហើយទៅប្រាប់តោថា មានតោមួយទៀតធំជាង និងកាចជាងនៅក្បែរអណ្តូងទឹកចាស់។ តោខឹងខ្លាំងក៏រត់ទៅអណ្តូងទឹក ឃើញស្រមោលខ្លួនឯងក្នុងទឹកគិតថាជាសត្រូវ ក៏លោតចុះទៅលង់ទឹកស្លាប់បាត់ទៅ។ ព្រៃព្រឹក្សាក៏បានសុខសាន្តឡើងវិញ។',
        question: 'ចូរអានអត្ថបទខាងលើឱ្យបានម៉ត់ចត់ រួចឆ្លើយសំណួរស្វែងយល់ន័យខាងក្រោម៖',
        timeLimit: 60,
        points: 1500,
        passageQuestions: [
          {
            id: `pq-${id}-1`,
            question: 'តើសត្វអ្វីដែលបង្កការភ័យខ្លាចដល់សត្វនានាក្នុងព្រៃ?',
            answer: 'សត្វតោដែលកាចសាហាវ។',
          },
          {
            id: `pq-${id}-2`,
            question: 'តើកូនទន្សាយបានប្រើប្រាស់កលល្បិចអ្វីដើម្បីសង្គ្រោះសត្វទាំងអស់?',
            answer: 'កូនទន្សាយបាននាំតោទៅអណ្តូងទឹកឱ្យឃើញស្រមោលខ្លួនឯង រហូតតោលោតសម្លាប់ខ្លួន។',
          },
          {
            id: `pq-${id}-3`,
            question: 'តើរឿងនេះផ្តល់តម្លៃអប់រំអ្វីខ្លះដល់ការរស់នៅ?',
            answer: 'បញ្ញា និងភាពឈ្លាសវៃអាចយកឈ្នះកម្លាំងកាយ និងការគំរាមកំហែងបាន។',
          },
        ],
        options: [
          { id: 'a', text: 'អានយល់ន័យ និងឆ្លើយត្រឹមត្រូវ', isCorrect: true, color: 'blue', shape: '📖' },
        ],
      };
    case 'essay':
      return {
        id,
        type: 'essay',
        question:
          'ចូរពន្យល់ពីសារៈសំខាន់នៃការអានសៀវភៅ និងការស្រាវជ្រាវក្នុងយុគសម័យឌីជីថល ចំពោះការអភិវឌ្ឍសមត្ថភាពសិស្សានុសិស្ស។',
        timeLimit: 120,
        points: 2000,
        essayRubric:
          'លក្ខណៈវិនិច្ឆ័យវាយតម្លៃ៖ សេចក្តីផ្តើម (២ពិន្ទុ), តួសេចក្តី អំណះអំណាង និងឧទាហរណ៍ជាក់ស្តែង (៥ពិន្ទុ), សេចក្តីបញ្ចប់ និងទស្សនៈផ្ទាល់ខ្លួន (២ពិន្ទុ), ការប្រើប្រាស់ពាក្យ និងអក្ខរាវិរុទ្ធ (១ពិន្ទុ)។',
        correctAnswer:
          'ការអានជួយពង្រីកចំណេះដឹង បណ្តុះការគិតស៊ីជម្រៅ ចំណែកបច្ចេកវិទ្យាឌីជីថលជួយស្វែងរកប្រភពឯកសារបានរហ័ស និងទូលំទូលាយ។',
        options: [
          { id: 'a', text: 'សំណួរសំណេរពិចារណា', isCorrect: true, color: 'green', shape: '✍️' },
        ],
      };
    case 'multi_select':
      return {
        id,
        type: 'multi_select',
        question:
          'តើសត្វណាខ្លះជាសត្វចិញ្ចឹមដែលរស់នៅលើគោក? (ជ្រើសរើសចម្លើយត្រឹមត្រូវទាំងអស់)',
        timeLimit: 30,
        points: 1000,
        options: [
          { id: 'a', text: 'សត្វគោ', isCorrect: true, color: 'green', shape: '✔' },
          { id: 'b', text: 'សត្វឆ្កែ', isCorrect: true, color: 'blue', shape: '✔' },
          { id: 'c', text: 'សត្វត្រីបាឡែន', isCorrect: false, color: 'red', shape: '✖' },
          { id: 'd', text: 'សត្វសេះ', isCorrect: true, color: 'yellow', shape: '✔' },
        ],
      };
    case 'true_false':
      return {
        id,
        type: 'true_false',
        question: 'តើព័ត៌មានខាងក្រោមនេះ «ត្រូវ» ឬ «ខុស» ៖ ផែនដីវិលជុំវិញព្រះអាទិត្យ?',
        timeLimit: 15,
        points: 1000,
        isTrue: true,
        options: [
          { id: 'true', text: 'ត្រូវ (ពិត)', isCorrect: true, color: 'green', shape: '✔' },
          { id: 'false', text: 'ខុស (មិនពិត)', isCorrect: false, color: 'red', shape: '✖' },
        ],
      };
    case 'matching':
      return {
        id,
        type: 'matching',
        question: 'ចូរផ្គូផ្គងឈ្មោះរាជធានី និងខេត្ត ឬទីតាំងភូមិសាស្ត្រខាងក្រោមឱ្យបានត្រឹមត្រូវ៖',
        timeLimit: 30,
        points: 1000,
        matchingPairs: [
          { id: 'm1', left: 'រាជធានីនៃព្រះរាជាណាចក្រកម្ពុជា', right: 'រាជធានីភ្នំពេញ' },
          { id: 'm2', left: 'ប្រាសាទអង្គរវត្តស្ថិតនៅខេត្ត', right: 'ខេត្តសៀមរាប' },
          { id: 'm3', left: 'ភ្នំដែលខ្ពស់ជាងគេនៅកម្ពុជា', right: 'ភ្នំឱរ៉ាល់' },
          { id: 'm4', left: 'បឹងទឹកសាបធំជាងគេនៅអាស៊ីអាគ្នេយ៍', right: 'បឹងទន្លេសាប' },
        ],
        options: [
          { id: 'a', text: 'ផ្គូផ្គងត្រឹមត្រូវគ្រប់គូ', isCorrect: true, color: 'blue', shape: '🔗' },
        ],
      };
    case 'fill_blank':
      return {
        id,
        type: 'fill_blank',
        question: 'ប្រទេសកម្ពុជាស្ថិតនៅក្នុងតំបន់ [.....] នៃទ្វីបអាស៊ី។',
        timeLimit: 25,
        points: 1000,
        blankAnswer: 'អាស៊ីអាគ្នេយ៍',
        blankDistractors: ['អាស៊ីខាងកើត', 'អាស៊ីខាងត្បូង', 'អាស៊ីកណ្តាល'],
        options: [
          { id: 'a', text: 'អាស៊ីអាគ្នេយ៍', isCorrect: true, color: 'green', shape: '▲' },
          { id: 'b', text: 'អាស៊ីខាងកើត', isCorrect: false, color: 'red', shape: '◆' },
          { id: 'c', text: 'អាស៊ីខាងត្បូង', isCorrect: false, color: 'blue', shape: '●' },
          { id: 'd', text: 'អាស៊ីកណ្តាល', isCorrect: false, color: 'yellow', shape: '■' },
        ],
      };
    case 'reorder_words':
      return {
        id,
        type: 'reorder_words',
        question: 'ចូររៀបចំកម្រងពាក្យខាងក្រោមឱ្យក្លាយជាល្បះត្រឹមត្រូវ៖',
        timeLimit: 30,
        points: 1000,
        correctSentence: 'សិស្សានុសិស្ស ខិតខំ រៀនសូត្រ ដើម្បី អនាគត ភ្លឺស្វាង',
        words: ['ដើម្បី', 'សិស្សានុសិស្ស', 'ភ្លឺស្វាង', 'ខិតខំ', 'អនាគត', 'រៀនសូត្រ'],
        options: [
          { id: 'a', text: 'សិស្សានុសិស្ស ខិតខំ រៀនសូត្រ ដើម្បី អនាគត ភ្លឺស្វាង', isCorrect: true, color: 'green', shape: '★' },
        ],
      };
    case 'short_answer':
      return {
        id,
        type: 'short_answer',
        question: 'តើថ្ងៃទីប៉ុន្មាន និងខែណាជាទិវាបុណ្យឯករាជ្យជាតិកម្ពុជា?',
        timeLimit: 25,
        points: 1000,
        correctAnswer: '៩ វិច្ឆិកា',
        options: [
          { id: 'a', text: '៩ វិច្ឆិកា', isCorrect: true, color: 'green', shape: '✏️' },
        ],
      };
    case 'qcm':
    default:
      return {
        id,
        type: 'qcm',
        question: 'តើព្យញ្ជនៈក្នុងភាសាខ្មែរមានចំនួនប៉ុន្មានតួ?',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'a', text: '៣១ តួ', isCorrect: false, color: 'red', shape: '▲' },
          { id: 'b', text: '៣៣ តួ', isCorrect: true, color: 'blue', shape: '◆' },
          { id: 'c', text: '៣៥ តួ', isCorrect: false, color: 'yellow', shape: '●' },
          { id: 'd', text: '៣៧ តួ', isCorrect: false, color: 'green', shape: '■' },
        ],
      };
  }
};

export const CreateQuizTab: React.FC<CreateQuizTabProps> = ({
  teacherName,
  quizzes = [],
  onSaveQuiz,
  onDeleteQuiz,
  onPlayQuiz,
  onShowToast,
  onNavigateHome,
}) => {
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('ភាសាខ្មែរ');
  const [grade, setGrade] = useState('ថ្នាក់ទី ៤');
  const [examDuration, setExamDuration] = useState('៤៥ នាទី');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'worksheet' | 'archive'>('editor');
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // PDF Book Customizer state
  const [isPdfBookModalOpen, setIsPdfBookModalOpen] = useState(false);
  const [selectedQuizForPdf, setSelectedQuizForPdf] = useState<Quiz | null>(null);

  // Archive filters & Quick preview
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('ទាំងអស់');
  const [filterGrade, setFilterGrade] = useState('ទាំងអស់');
  const [filterType, setFilterType] = useState('ទាំងអស់');
  const [quickPreviewQuiz, setQuickPreviewQuiz] = useState<Quiz | null>(null);

  const [worksheetOptions, setWorksheetOptions] = useState<WorksheetOptions>({
    sheetType: 'worksheet',
    schoolName: 'សាលាបឋមសិក្សាគំរូ',
    districtOffice: 'ការិយាល័យអប់រំ យុវជន និងកីឡា',
    academicYear: '',
    customDate: '',
    examSession: '',
    totalScore: '១០ ពិន្ទុ',
    showAnswerKey: false,
    showStudentBox: true,
    showEvaluationBox: true,
    showSignatures: true,
    showPoints: true,
    borderStyle: 'double',
    fontSize: 'normal',
    instructionText: 'ចូរអានសំណួរនីមួយៗឱ្យបានហ្មត់ចត់ និងសរសេរចម្លើយឱ្យបានត្រឹមត្រូវ ស្អាតបាត។',
    designTheme: 'moeys_classic',
    pageOrientation: 'portrait',
    pageMode: 'two_pages',
    marginMode: 'zero',
    paperSize: 'A4',
  });

  const sheetTypeScrollRef = useRef<HTMLDivElement>(null);
  const modalSheetTypeScrollRef = useRef<HTMLDivElement>(null);

  const scrollSheetTypes = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePrintWorksheet = () => {
    printWorksheetDocument(
      title || 'សន្លឹកកិច្ចការស្វ័យសិក្សា',
      subject,
      grade,
      examDuration,
      teacherName,
      questions,
      worksheetOptions
    );
  };

  const handleExportWord = () => {
    exportWorksheetToWordDoc(
      title || 'សន្លឹកកិច្ចការស្វ័យសិក្សា',
      subject,
      grade,
      examDuration,
      teacherName,
      questions,
      worksheetOptions
    );
    onShowToast('បានទាញយកឯកសារ Word (.doc) ដោយជោគជ័យ!');
  };

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    createSampleQuestion('qcm', 1),
  ]);

  // Handler to load a quiz for editing
  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setTitle(quiz.title);
    setSubject(quiz.subject);
    setGrade(quiz.grade);
    setExamDuration(quiz.examDuration || '៤៥ នាទី');
    setQuestions(quiz.questions || []);
    if (quiz.worksheetOptions) {
      setWorksheetOptions({
        ...worksheetOptions,
        ...quiz.worksheetOptions,
      });
    }
    setActiveTab('editor');
    onShowToast(`បានបើកកែសម្រួល "${quiz.title}" ក្នុងផ្ទាំងសំណួរ`);
  };

  // Handler to preview worksheet directly
  const handlePreviewWorksheet = (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setTitle(quiz.title);
    setSubject(quiz.subject);
    setGrade(quiz.grade);
    setExamDuration(quiz.examDuration || '៤៥ នាទី');
    setQuestions(quiz.questions || []);
    if (quiz.worksheetOptions) {
      setWorksheetOptions({
        ...worksheetOptions,
        ...quiz.worksheetOptions,
      });
    }
    setActiveTab('worksheet');
  };

  // Start fresh new quiz
  const handleNewQuiz = () => {
    setEditingQuizId(null);
    setTitle('');
    setSubject('ភាសាខ្មែរ');
    setGrade('ថ្នាក់ទី ៤');
    setExamDuration('៤៥ នាទី');
    setQuestions([createSampleQuestion('qcm', 1)]);
    setActiveTab('editor');
    onShowToast('បានបើកទម្រង់បង្កើតកិច្ចការថ្មី!');
  };

  // Duplicate a quiz
  const handleDuplicateQuiz = (quiz: Quiz) => {
    const dup: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      title: `${quiz.title} (ចម្លង)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveQuiz(dup);
    onShowToast(`បានចម្លងកិច្ចការ "${quiz.title}" ដោយជោគជ័យ!`);
  };

  // Direct print from archive card or preview
  const handleDirectPrint = (quiz: Quiz, paperSizeOverride?: 'A4' | 'A5') => {
    const baseOpts = quiz.worksheetOptions || worksheetOptions;
    const opts: WorksheetOptions = {
      ...baseOpts,
      ...(paperSizeOverride ? { paperSize: paperSizeOverride } : {}),
    };
    printWorksheetDocument(
      quiz.title,
      quiz.subject,
      quiz.grade,
      quiz.examDuration || '៤៥ នាទី',
      teacherName,
      quiz.questions,
      opts
    );
  };

  // Direct export Word from archive card
  const handleDirectWord = (quiz: Quiz) => {
    exportWorksheetToWordDoc(
      quiz.title,
      quiz.subject,
      quiz.grade,
      quiz.examDuration || '៤៥ នាទី',
      teacherName,
      quiz.questions,
      quiz.worksheetOptions || worksheetOptions
    );
    onShowToast('បានទាញយកឯកសារ Word (.doc) ដោយជោគជ័យ!');
  };

  // Filtered quizzes list
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const matchSearch =
        !searchQuery.trim() ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.grade.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSubject = filterSubject === 'ទាំងអស់' || q.subject === filterSubject;
      const matchGrade = filterGrade === 'ទាំងអស់' || q.grade === filterGrade;
      const matchType =
        filterType === 'ទាំងអស់' ||
        (filterType === 'worksheet' && (!q.sheetType || q.sheetType === 'worksheet')) ||
        q.sheetType === filterType;

      return matchSearch && matchSubject && matchGrade && matchType;
    });
  }, [quizzes, searchQuery, filterSubject, filterGrade, filterType]);

  // Add question with specific type
  const handleAddQuestion = (type: QuestionType = 'qcm') => {
    const newId = questions.length + 1;
    const newQ = createSampleQuestion(type, newId);
    setQuestions([...questions, newQ]);
    onShowToast(`បានបន្ថែមសំណួរប្រភេទ "${QUESTION_TYPE_INFO[type].shortLabel}"`);
  };

  // Change question type
  const handleChangeQuestionType = (qIndex: number, newType: QuestionType) => {
    const targetQ = questions[qIndex];
    if (targetQ.type === newType) return;

    const sample = createSampleQuestion(newType, Number(targetQ.id) || Date.now());
    const updated = [...questions];
    updated[qIndex] = {
      ...sample,
      id: targetQ.id,
      question: targetQ.question || sample.question,
      timeLimit: targetQ.timeLimit,
      points: targetQ.points,
    };
    setQuestions(updated);
  };

  // Update question text
  const handleUpdateQuestionText = (qIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].question = text;
    setQuestions(updated);
  };

  // Duplicate question
  const handleDuplicateQuestion = (qIndex: number) => {
    const source = questions[qIndex];
    const newQ: QuizQuestion = JSON.parse(JSON.stringify(source));
    newQ.id = questions.length + 1;
    newQ.question = `${newQ.question} (ចម្លង)`;
    const updated = [...questions];
    updated.splice(qIndex + 1, 0, newQ);
    setQuestions(updated);
    onShowToast('បានចម្លងសំណួរជោគជ័យ!');
  };

  // Move question
  const handleMoveQuestion = (qIndex: number, direction: 'up' | 'down') => {
    if (direction === 'up' && qIndex === 0) return;
    if (direction === 'down' && qIndex === questions.length - 1) return;
    const updated = [...questions];
    const targetIdx = direction === 'up' ? qIndex - 1 : qIndex + 1;
    const temp = updated[qIndex];
    updated[qIndex] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuestions(updated);
  };

  // Delete question
  const handleDeleteQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      onShowToast('ត្រូវមានសំណួរយ៉ាងហោចណាស់មួយ');
      return;
    }
    setQuestions(questions.filter((_, idx) => idx !== qIndex));
  };

  // QCM Option update
  const handleUpdateOptionText = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = text;
    setQuestions(updated);
  };

  const handleSetCorrectOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.forEach((o, idx) => {
      o.isCorrect = idx === optIndex;
    });
    setQuestions(updated);
  };

  // True/False update
  const handleSetTrueFalse = (qIndex: number, isTrue: boolean) => {
    const updated = [...questions];
    updated[qIndex].isTrue = isTrue;
    updated[qIndex].options = [
      { id: 'true', text: 'ត្រូវ (ពិត)', isCorrect: isTrue, color: 'green', shape: '✔' },
      { id: 'false', text: 'ខុស (មិនពិត)', isCorrect: !isTrue, color: 'red', shape: '✖' },
    ];
    setQuestions(updated);
  };

  // Matching pairs update
  const handleUpdateMatchingPair = (
    qIndex: number,
    pairIndex: number,
    side: 'left' | 'right',
    val: string
  ) => {
    const updated = [...questions];
    const pairs = [...(updated[qIndex].matchingPairs || [])];
    if (pairs[pairIndex]) {
      pairs[pairIndex][side] = val;
      updated[qIndex].matchingPairs = pairs;
      setQuestions(updated);
    }
  };

  const handleAddMatchingPair = (qIndex: number) => {
    const updated = [...questions];
    const pairs = [...(updated[qIndex].matchingPairs || [])];
    pairs.push({
      id: `m-${Date.now()}-${pairs.length + 1}`,
      left: `ធាតុទី ${pairs.length + 1}`,
      right: `ចម្លើយផ្គូផ្គង ${pairs.length + 1}`,
    });
    updated[qIndex].matchingPairs = pairs;
    setQuestions(updated);
  };

  const handleDeleteMatchingPair = (qIndex: number, pairIndex: number) => {
    const updated = [...questions];
    const pairs = [...(updated[qIndex].matchingPairs || [])];
    if (pairs.length <= 2) {
      onShowToast('សំណួរផ្គូរផ្គងត្រូវមានយ៉ាងហោចណាស់ ២ គូ');
      return;
    }
    pairs.splice(pairIndex, 1);
    updated[qIndex].matchingPairs = pairs;
    setQuestions(updated);
  };

  // Fill in blank update
  const handleUpdateBlankAnswer = (qIndex: number, ans: string) => {
    const updated = [...questions];
    updated[qIndex].blankAnswer = ans;
    // Keep options updated as well for live play
    if (updated[qIndex].options && updated[qIndex].options[0]) {
      updated[qIndex].options[0].text = ans;
      updated[qIndex].options[0].isCorrect = true;
    }
    setQuestions(updated);
  };

  const handleUpdateDistractors = (qIndex: number, textComma: string) => {
    const updated = [...questions];
    const distractors = textComma.split(',').map((s) => s.trim()).filter(Boolean);
    updated[qIndex].blankDistractors = distractors;
    // Build options list for live game
    const correctAns = updated[qIndex].blankAnswer || 'ចម្លើយត្រឹមត្រូវ';
    const allOpts: QuizOption[] = [
      { id: 'a', text: correctAns, isCorrect: true, color: 'green', shape: '▲' },
    ];
    const colors: Array<'red' | 'blue' | 'yellow'> = ['red', 'blue', 'yellow'];
    const shapes = ['◆', '●', '■'];
    distractors.slice(0, 3).forEach((d, idx) => {
      allOpts.push({
        id: String.fromCharCode(98 + idx),
        text: d,
        isCorrect: false,
        color: colors[idx % 3],
        shape: shapes[idx % 3],
      });
    });
    updated[qIndex].options = allOpts;
    setQuestions(updated);
  };

  // Reorder words update
  const handleUpdateCorrectSentence = (qIndex: number, sentence: string) => {
    const updated = [...questions];
    updated[qIndex].correctSentence = sentence;
    // Auto-split into words if words array empty or user wants
    const words = sentence
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    updated[qIndex].words = [...words].sort(() => Math.random() - 0.5);
    if (updated[qIndex].options && updated[qIndex].options[0]) {
      updated[qIndex].options[0].text = sentence;
    }
    setQuestions(updated);
  };

  const handleUpdateWordsManually = (qIndex: number, wordsComma: string) => {
    const updated = [...questions];
    const words = wordsComma.split(',').map((w) => w.trim()).filter(Boolean);
    updated[qIndex].words = words;
    setQuestions(updated);
  };

  // Short answer update
  const handleUpdateShortAnswer = (qIndex: number, ans: string) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = ans;
    if (updated[qIndex].options && updated[qIndex].options[0]) {
      updated[qIndex].options[0].text = ans;
      updated[qIndex].options[0].isCorrect = true;
    }
    setQuestions(updated);
  };

  // PISA question updates
  const handleUpdatePisaDomain = (
    qIndex: number,
    domain: 'math' | 'science' | 'reading' | 'financial' | 'creative'
  ) => {
    const updated = [...questions];
    updated[qIndex].pisaDomain = domain;
    setQuestions(updated);
  };

  const handleUpdatePisaContext = (qIndex: number, context: string) => {
    const updated = [...questions];
    updated[qIndex].pisaContext = context;
    setQuestions(updated);
  };

  const handleAddPisaPart = (qIndex: number) => {
    const updated = [...questions];
    const parts = [...(updated[qIndex].pisaParts || [])];
    parts.push({
      id: `p-${Date.now()}-${parts.length + 1}`,
      prompt: `សំណួររង ${parts.length + 1}៖ ...`,
      points: 1.5,
      sampleAnswer: '',
    });
    updated[qIndex].pisaParts = parts;
    setQuestions(updated);
  };

  const handleUpdatePisaPart = (
    qIndex: number,
    partIndex: number,
    field: 'prompt' | 'points' | 'sampleAnswer',
    value: string | number
  ) => {
    const updated = [...questions];
    const parts = [...(updated[qIndex].pisaParts || [])];
    if (parts[partIndex]) {
      parts[partIndex] = {
        ...parts[partIndex],
        [field]: value,
      };
      updated[qIndex].pisaParts = parts;
      setQuestions(updated);
    }
  };

  const handleDeletePisaPart = (qIndex: number, partIndex: number) => {
    const updated = [...questions];
    const parts = [...(updated[qIndex].pisaParts || [])];
    if (parts.length <= 1) {
      onShowToast('សំណួរ PISA ត្រូវមានយ៉ាងហោចណាស់ ១ សំណួររង');
      return;
    }
    parts.splice(partIndex, 1);
    updated[qIndex].pisaParts = parts;
    setQuestions(updated);
  };

  const handleUpdatePisaReasoning = (qIndex: number, reasoning: string) => {
    const updated = [...questions];
    updated[qIndex].pisaReasoning = reasoning;
    setQuestions(updated);
  };

  // Reading Comprehension updates
  const handleUpdatePassageTitle = (qIndex: number, passageTitle: string) => {
    const updated = [...questions];
    updated[qIndex].passageTitle = passageTitle;
    setQuestions(updated);
  };

  const handleUpdatePassageText = (qIndex: number, passageText: string) => {
    const updated = [...questions];
    updated[qIndex].passageText = passageText;
    setQuestions(updated);
  };

  const handleAddPassageQuestion = (qIndex: number) => {
    const updated = [...questions];
    const pQs = [...(updated[qIndex].passageQuestions || [])];
    pQs.push({
      id: `pq-${Date.now()}-${pQs.length + 1}`,
      question: `សំណួរយល់ន័យទី ${pQs.length + 1}៖ ...`,
      answer: '',
    });
    updated[qIndex].passageQuestions = pQs;
    setQuestions(updated);
  };

  const handleUpdatePassageQuestion = (
    qIndex: number,
    itemIdx: number,
    field: 'question' | 'answer',
    value: string
  ) => {
    const updated = [...questions];
    const pQs = [...(updated[qIndex].passageQuestions || [])];
    if (pQs[itemIdx]) {
      pQs[itemIdx] = {
        ...pQs[itemIdx],
        [field]: value,
      };
      updated[qIndex].passageQuestions = pQs;
      setQuestions(updated);
    }
  };

  const handleDeletePassageQuestion = (qIndex: number, itemIdx: number) => {
    const updated = [...questions];
    const pQs = [...(updated[qIndex].passageQuestions || [])];
    if (pQs.length <= 1) {
      onShowToast('អត្ថបទអំណានត្រូវមានយ៉ាងហោចណាស់ ១ សំណួរ');
      return;
    }
    pQs.splice(itemIdx, 1);
    updated[qIndex].passageQuestions = pQs;
    setQuestions(updated);
  };

  // Essay updates
  const handleUpdateEssayRubric = (qIndex: number, rubric: string) => {
    const updated = [...questions];
    updated[qIndex].essayRubric = rubric;
    setQuestions(updated);
  };

  // Multi-Select updates
  const handleToggleMultiSelectOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    const opts = [...(updated[qIndex].options || [])];
    if (opts[optIndex]) {
      opts[optIndex].isCorrect = !opts[optIndex].isCorrect;
      updated[qIndex].options = opts;
      setQuestions(updated);
    }
  };

  const handleAddMultiSelectOption = (qIndex: number) => {
    const updated = [...questions];
    const opts = [...(updated[qIndex].options || [])];
    const colors: Array<'red' | 'blue' | 'yellow' | 'green'> = ['blue', 'green', 'yellow', 'red'];
    opts.push({
      id: `opt-${Date.now()}-${opts.length + 1}`,
      text: `ជម្រើសថ្មី ${opts.length + 1}`,
      isCorrect: false,
      color: colors[opts.length % 4],
      shape: '✔',
    });
    updated[qIndex].options = opts;
    setQuestions(updated);
  };

  const handleDeleteMultiSelectOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    const opts = [...(updated[qIndex].options || [])];
    if (opts.length <= 2) {
      onShowToast('សំណួរពហុជ្រើសរើសត្រូវមានយ៉ាងហោចណាស់ ២ ជម្រើស');
      return;
    }
    opts.splice(optIndex, 1);
    updated[qIndex].options = opts;
    setQuestions(updated);
  };

  // Load PISA Special Suite Sample
  const handleLoadPisaSample = () => {
    setTitle('វិញ្ញាសាវាយតម្លៃសមត្ថភាពស្តង់ដារ PISA និងវិភាគស៊ីជម្រៅ');
    setSubject('វិទ្យាសាស្ត្រ');
    setGrade('ថ្នាក់ទី ៦');
    setExamDuration('៦០ នាទី');
    setWorksheetOptions((prev) => ({
      ...prev,
      sheetType: 'exam',
      designTheme: 'pisa_academic',
      pageMode: 'two_pages',
      pageOrientation: 'portrait',
      instructionText: 'ចូរអានស្ថានភាពជាក់ស្តែង និងអត្ថបទនីមួយៗឱ្យបានហ្មត់ចត់ រួចអនុវត្តចំណេះដឹងដោះស្រាយបញ្ហា។',
    }));
    const pisaSuite: QuizQuestion[] = [
      createSampleQuestion('pisa', 1),
      createSampleQuestion('reading_comprehension', 2),
      createSampleQuestion('multi_select', 3),
      createSampleQuestion('essay', 4),
    ];
    setQuestions(pisaSuite);
    onShowToast('បានផ្ទុកកម្រងវិញ្ញាសាស្តង់ដារ PISA គំរូ ៤ សំណួរ រួមទាំងម៉ូតរចនា PISA!');
  };

  // Load all question types sample
  const handleLoadAllTypesSample = () => {
    setTitle('កិច្ចការ និងតេស្តវាយតម្លៃសមត្ថភាពចម្រុះ គ្រប់ទម្រង់');
    const sampleSuite: QuizQuestion[] = [
      createSampleQuestion('qcm', 1),
      createSampleQuestion('true_false', 2),
      createSampleQuestion('pisa', 3),
      createSampleQuestion('reading_comprehension', 4),
      createSampleQuestion('multi_select', 5),
      createSampleQuestion('matching', 6),
      createSampleQuestion('fill_blank', 7),
      createSampleQuestion('reorder_words', 8),
      createSampleQuestion('short_answer', 9),
      createSampleQuestion('essay', 10),
    ];
    setQuestions(sampleSuite);
    onShowToast('បានផ្ទុកកម្រងសំណួរគំរូគ្រប់ប្រភេទទាំង ១០ រួចរាល់!');
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('សូមបញ្ចូលចំណងជើងកិច្ចការ ឬវិញ្ញាសា');
      return;
    }

    const savedQuiz: Quiz = {
      id: editingQuizId || `quiz-${Date.now()}`,
      title: title.trim(),
      subject,
      grade,
      examDuration,
      questionCount: questions.length,
      isPublic: true,
      imageUrl:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
      questions,
      createdAt: editingQuizId
        ? quizzes.find((q) => q.id === editingQuizId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sheetType: worksheetOptions.sheetType,
      worksheetOptions: worksheetOptions,
    };

    onSaveQuiz(savedQuiz);
    onShowToast(`បានរក្សាទុក "${title}" (${questions.length} សំណួរ) ក្នុងឃ្លាំងកិច្ចការដោយជោគជ័យ!`);
    setActiveTab('archive');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg md:text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              {editingQuizId ? 'កែសម្រួលសន្លឹកកិច្ចការ / វិញ្ញាសា' : 'បង្កើតសំណួរប្រឡង ឬកិច្ចការថ្មី'}
            </h2>
            <p className="text-xs text-purple-200 mt-1">
              គាំទ្រសំណួរ ៦ ប្រភេទ ព្រមទាំងរចនាសន្លឹកកិច្ចការ និងវិញ្ញាសា A4 យ៉ាងស្រស់ស្អាត ({teacherName})
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleNewQuiz}
              className="px-3 py-2 bg-purple-800/90 hover:bg-purple-700 text-white border border-purple-500/60 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              បង្កើតថ្មី
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('archive')}
              className="px-3 py-2 bg-purple-800/90 hover:bg-purple-700 text-emerald-300 border border-purple-500/60 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FolderArchive className="w-3.5 h-3.5 text-emerald-400" />
              ឃ្លាំងកិច្ចការ ({quizzes.length})
            </button>
            <button
              type="button"
              onClick={handleLoadAllTypesSample}
              className="px-3 py-2 bg-purple-800/80 hover:bg-purple-700 text-amber-300 border border-purple-600/60 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              គំរូ ៦ ប្រភេទ
            </button>
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm backdrop-blur-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              មើលពេញអេក្រង់
            </button>
          </div>
        </div>
      </div>

      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 bg-slate-100 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'editor'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>កែសម្រួលសំណួរ ({questions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('worksheet')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'worksheet'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>មើលសន្លឹកកិច្ចការផ្ទាល់</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('archive')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'archive'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5 text-emerald-400" />
            <span>ឃ្លាំងសន្លឹកកិច្ចការ & វិញ្ញាសា ({quizzes.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {activeTab !== 'archive' && (
            <>
              <button
                type="button"
                onClick={handlePrintWorksheet}
                className="px-3.5 py-2 bg-purple-950 hover:bg-purple-900 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="បោះពុម្ពជាក្រដាស A4 តាមក្បួនខ្នាតផ្លូវការ"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>បោះពុម្ព A4 ផ្លូវការ</span>
              </button>
              <button
                type="button"
                onClick={handleExportWord}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="ទាញយកជាឯកសារ Microsoft Word អាចកែសម្រួលបាន"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ទាញយក Word (.doc)</span>
              </button>
            </>
          )}
          {activeTab === 'archive' && (
            <button
              type="button"
              onClick={handleNewQuiz}
              className="px-3.5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>+ បង្កើតកិច្ចការថ្មី</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'worksheet' && (
        /* ================= LIVE WORKSHEET PREVIEW TAB ================= */
        <div className="space-y-4">
          {/* Customizer Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            {/* Sheet Type & Design Themes Selection */}
            <div className="flex flex-col gap-3 pb-3 border-b border-slate-100">
              {/* Row 1: Sheet Type & Answer Key */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-800 shrink-0 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-purple-700" />
                    <span>ប្រភេទកិច្ចការ ៖</span>
                  </span>

                  {/* Horizontally scrollable strip with left/right buttons */}
                  <div className="relative flex items-center min-w-0 flex-1 bg-slate-50/90 p-1 rounded-2xl border border-slate-200/80 shadow-xs">
                    {/* Left Scroll Button */}
                    <button
                      type="button"
                      onClick={() => scrollSheetTypes(sheetTypeScrollRef, 'left')}
                      className="p-1.5 rounded-xl hover:bg-white text-slate-500 hover:text-purple-900 shrink-0 transition cursor-pointer shadow-xs border border-transparent hover:border-slate-200 active:scale-95"
                      title="អូសទៅឆ្វេង (Scroll Left)"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Scrollable Buttons Container */}
                    <div
                      ref={sheetTypeScrollRef}
                      className="flex items-center gap-2 overflow-x-auto py-1 px-1 scroll-smooth no-scrollbar select-none"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {(['worksheet', 'exam', 'homework', 'test', 'exit_ticket'] as WorksheetType[]).map((type) => {
                        const isSelected = worksheetOptions.sheetType === type;
                        const info = WORKSHEET_TYPE_TITLES[type];
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setWorksheetOptions({ ...worksheetOptions, sheetType: type })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border whitespace-nowrap ${
                              isSelected
                                ? 'bg-purple-900 text-white shadow-xs ring-2 ring-purple-300 border-purple-950 scale-[1.01]'
                                : 'bg-white hover:bg-purple-50/80 text-slate-700 hover:text-purple-950 border-slate-200 hover:border-purple-200'
                            }`}
                          >
                            <span className="text-sm">{info.icon}</span>
                            <span>{info.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                      type="button"
                      onClick={() => scrollSheetTypes(sheetTypeScrollRef, 'right')}
                      className="p-1.5 rounded-xl hover:bg-white text-slate-500 hover:text-purple-900 shrink-0 transition cursor-pointer shadow-xs border border-transparent hover:border-slate-200 active:scale-95"
                      title="អូសទៅស្តាំ (Scroll Right)"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Answer Key Toggle */}
                <button
                  type="button"
                  onClick={() =>
                    setWorksheetOptions({
                      ...worksheetOptions,
                      showAnswerKey: !worksheetOptions.showAnswerKey,
                    })
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 self-start lg:self-center ${
                    worksheetOptions.showAnswerKey
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {worksheetOptions.showAnswerKey ? '✓ កំពុងបង្ហាញចម្លើយគំរូ (Key)' : 'បង្ហាញសន្លឹកចម្លើយគំរូ'}
                  </span>
                </button>
              </div>

              {/* Row 2: ៤ ម៉ូតរចនាសន្លឹកកិច្ចការ (Design Themes) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-800 mr-1 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-purple-700" /> ម៉ូតរចនាសន្លឹក (៤ ម៉ូត) ៖
                  </span>
                  {(['moeys_classic', 'modern_indigo', 'primary_friendly', 'pisa_academic'] as WorksheetDesignTheme[]).map(
                    (themeKey) => {
                      const info = WORKSHEET_DESIGN_INFO[themeKey];
                      const isSelected = (worksheetOptions.designTheme || 'moeys_classic') === themeKey;
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => setWorksheetOptions({ ...worksheetOptions, designTheme: themeKey })}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                            isSelected
                              ? 'bg-purple-900 text-white border-purple-950 shadow-xs ring-2 ring-purple-300'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          <span>{info.icon}</span>
                          <span>{info.name.split(' ')[0]}</span>
                          <span
                            className={`text-[9.5px] px-1.5 py-0.5 rounded-md font-semibold ${
                              isSelected ? 'bg-white/20 text-amber-200' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {info.tag}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Row 3: ទម្រង់បោះពុម្ព A4 ផ្លូវការ (២ ទំព័រ & បញ្ឈរ/ផ្តេក & គែមសន្លឹក 0 0) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Printer className="w-3.5 h-3.5 text-purple-700" /> ទំព័រ A4 ៖
                    </span>

                    {/* 2-Pages vs Continuous */}
                    <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setWorksheetOptions({ ...worksheetOptions, pageMode: 'two_pages' })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          (worksheetOptions.pageMode || 'two_pages') === 'two_pages'
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="រៀបចំវិញ្ញាសាជា ២ ទំព័រស្តង់ដារ A4 បញ្ឈប់ការហៀរទំព័រ"
                      >
                        <span>📑 តែ ២ ទំព័រ A4</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorksheetOptions({ ...worksheetOptions, pageMode: 'continuous' })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          worksheetOptions.pageMode === 'continuous'
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="រៀបចំសំណួរបន្តបន្ទាប់តាមប្រវែងជាក់ស្តែង"
                      >
                        <span>📄 បន្តបន្ទាប់</span>
                      </button>
                    </div>

                    {/* Portrait vs Landscape */}
                    <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setWorksheetOptions({ ...worksheetOptions, pageOrientation: 'portrait' })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          (worksheetOptions.pageOrientation || 'portrait') === 'portrait'
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>📄 បញ្ឈរ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorksheetOptions({ ...worksheetOptions, pageOrientation: 'landscape' })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          worksheetOptions.pageOrientation === 'landscape'
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>📑 ផ្តេក</span>
                      </button>
                    </div>
                  </div>

                  {/* Margin Mode Selector: 0 0 vs Compact vs Normal */}
                  <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                    <span className="font-bold text-slate-800">គែមសន្លឹក ៖</span>
                    <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setWorksheetOptions({ ...worksheetOptions, marginMode: 'zero' })}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          (worksheetOptions.marginMode || 'zero') === 'zero'
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="គែមស្មើ 0 0 (Zero Margin) មិនខ្ជះខ្ជាយក្រដាស"
                      >
                        <span>⚡ 0 0 (Zero)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorksheetOptions({ ...worksheetOptions, marginMode: 'compact' })}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          worksheetOptions.marginMode === 'compact'
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="គែមតូចល្មម (Compact Margin)"
                      >
                        <span>📐 តូច</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorksheetOptions({ ...worksheetOptions, marginMode: 'normal' })}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          worksheetOptions.marginMode === 'normal'
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="គែមស្តង់ដារធម្មតា (Standard Margin)"
                      >
                        <span>ធម្មតា</span>
                      </button>
                    </div>
                  </div>

                  {/* Paper Size Selector: A4 vs A5 */}
                  <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                    <span className="font-bold text-slate-800">ទំហំ ៖</span>
                    <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setWorksheetOptions({ ...worksheetOptions, paperSize: 'A4' })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          (worksheetOptions.paperSize || 'A4') === 'A4'
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="ទំហំក្រដាស A4 ស្តង់ដារ (210 × 297 mm)"
                      >
                        <span>📄 A4</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorksheetOptions({ ...worksheetOptions, paperSize: 'A5' })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          worksheetOptions.paperSize === 'A5'
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="ទំហំក្រដាស A5 កូនសៀវភៅ (148 × 210 mm) សន្សំក្រដាស ងាយបត់"
                      >
                        <span>📖 A5 សៀវភៅ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-bar: Border style, Font size, Settings toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Border style */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">ក្បាច់ស៊ុម ៖</span>
                  <select
                    value={worksheetOptions.borderStyle}
                    onChange={(e) =>
                      setWorksheetOptions({
                        ...worksheetOptions,
                        borderStyle: e.target.value as WorksheetBorderStyle,
                      })
                    }
                    className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none"
                  >
                    <option value="double">បន្ទាត់ទ្វេផ្លូវការ MoEYS</option>
                    <option value="ornamental">ក្បាច់ផ្កាច័ន្ទខ្មែរ (Ornamental)</option>
                    <option value="modern">ទាន់សម័យ (Modern Crisp)</option>
                    <option value="minimal">សាមញ្ញ (Minimal)</option>
                  </select>
                </div>

                {/* Font size */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">ទំហំអក្សរ ៖</span>
                  <select
                    value={worksheetOptions.fontSize}
                    onChange={(e) =>
                      setWorksheetOptions({
                        ...worksheetOptions,
                        fontSize: e.target.value as WorksheetFontSize,
                      })
                    }
                    className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none"
                  >
                    <option value="compact">បង្រួម (Compact - សន្សំក្រដាស)</option>
                    <option value="normal">ស្តង់ដារ (Normal)</option>
                    <option value="large">ធំស្រួលមើល (Large - បឋមវ័យ)</option>
                  </select>
                </div>
              </div>

              {/* Advanced Settings Drawer Button */}
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-purple-950 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5 text-purple-700" />
                <span>{showSettingsDrawer ? 'លាក់ការកំណត់' : 'កំណត់លម្អិតសន្លឹកកិច្ចការ'}</span>
              </button>
            </div>

            {/* Collapsible Settings Drawer */}
            {showSettingsDrawer && (
              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50/60 p-3 rounded-xl">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ឈ្មោះសាលារៀន</label>
                  <input
                    type="text"
                    value={worksheetOptions.schoolName}
                    onChange={(e) =>
                      setWorksheetOptions({ ...worksheetOptions, schoolName: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                    placeholder="ឈ្មោះសាលា..."
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ការិយាល័យអប់រំ / ស្រុក-ខណ្ឌ</label>
                  <input
                    type="text"
                    value={worksheetOptions.districtOffice}
                    onChange={(e) =>
                      setWorksheetOptions({ ...worksheetOptions, districtOffice: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                    placeholder="ការិយាល័យអប់រំ..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">សេចក្តីណែនាំដល់សិស្ស (Instruction)</label>
                  <input
                    type="text"
                    value={worksheetOptions.instructionText}
                    onChange={(e) =>
                      setWorksheetOptions({ ...worksheetOptions, instructionText: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                    placeholder="ចូរអានសំណួរនីមួយៗឱ្យបានហ្មត់ចត់..."
                  />
                </div>
                <div className="md:col-span-2 flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={worksheetOptions.showStudentBox}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, showStudentBox: e.target.checked })
                      }
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>ប្រអប់ព័ត៌មានសិស្ស</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={worksheetOptions.showEvaluationBox}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, showEvaluationBox: e.target.checked })
                      }
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>ប្រអប់ដាក់ពិន្ទុ & និទ្ទេសគ្រូ</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={worksheetOptions.showSignatures}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, showSignatures: e.target.checked })
                      }
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>កន្លែងចុះហត្ថលេខា (គ្រូ & នាយក)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={worksheetOptions.showPoints}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, showPoints: e.target.checked })
                      }
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>ពិន្ទុលើសំណួរនីមួយៗ</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Worksheet Paper Render */}
          <div className="bg-slate-200/60 p-4 sm:p-8 rounded-3xl overflow-x-auto">
            <WorksheetPaperView
              title={title || 'វិញ្ញាសាប្រឡង ឬកិច្ចការស្វ័យសិក្សា'}
              subject={subject}
              grade={grade}
              examDuration={examDuration}
              teacherName={teacherName}
              questions={questions}
              options={worksheetOptions}
            />
          </div>
        </div>
      )}

      {/* ================= ARCHIVE & STORAGE DASHBOARD TAB ================= */}
      {activeTab === 'archive' && (
        <div className="space-y-4">
          {/* Storage Header & Filters */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-purple-700" />
                  <span>ឃ្លាំងសន្លឹកកិច្ចការ និងវិញ្ញាសាដែលបានរក្សាទុក</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  មានចំនួនសរុប {quizzes.length} កិច្ចការ/វិញ្ញាសា អាចកែសម្រួល បោះពុម្ព ឬដំណើរការលេងភ្លាមៗ
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNewQuiz}
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>+ បង្កើតកិច្ចការថ្មី</span>
                </button>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកតាមចំណងជើង..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none pl-8"
                />
                <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Subject Filter */}
              <div>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="ទាំងអស់">មុខវិជ្ជា ៖ ទាំងអស់</option>
                  <option value="ភាសាខ្មែរ">ភាសាខ្មែរ</option>
                  <option value="គណិតវិទ្យា">គណិតវិទ្យា</option>
                  <option value="វិទ្យាសាស្ត្រ">វិទ្យាសាស្ត្រ</option>
                  <option value="សិក្សាសង្គម">សិក្សាសង្គម</option>
                  <option value="ភាសាអង់គ្លេស">ភាសាអង់គ្លេស</option>
                  <option value="ព័ត៌មានវិទ្យា">ព័ត៌មានវិទ្យា</option>
                </select>
              </div>

              {/* Grade Filter */}
              <div>
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="ទាំងអស់">កម្រិតថ្នាក់ ៖ ទាំងអស់</option>
                  <option value="ថ្នាក់ទី ១">ថ្នាក់ទី ១</option>
                  <option value="ថ្នាក់ទី ២">ថ្នាក់ទី ២</option>
                  <option value="ថ្នាក់ទី ៣">ថ្នាក់ទី ៣</option>
                  <option value="ថ្នាក់ទី ៤">ថ្នាក់ទី ៤</option>
                  <option value="ថ្នាក់ទី ៥">ថ្នាក់ទី ៥</option>
                  <option value="ថ្នាក់ទី ៦">ថ្នាក់ទី ៦</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="ទាំងអស់">ប្រភេទឯកសារ ៖ ទាំងអស់</option>
                  <option value="worksheet">សន្លឹកកិច្ចការស្វ័យសិក្សា</option>
                  <option value="exam">វិញ្ញាសាប្រឡងបញ្ចប់វគ្គ</option>
                  <option value="homework">កិច្ចការស្វ័យសិក្សានៅផ្ទះ</option>
                  <option value="test">តេស្តវាស់ស្ទង់សមត្ថភាពប្រចាំខែ</option>
                  <option value="exit_ticket">សន្លឹកកិច្ចការវាយតម្លៃ (Exit Ticket)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quizzes List Cards */}
          {filteredQuizzes.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                📂
              </div>
              <h4 className="font-bold text-slate-800 text-sm">មិនមានសន្លឹកកិច្ចការ ឬវិញ្ញាសានៅក្នុងលក្ខខណ្ឌនេះទេ</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                លោកគ្រូ-អ្នកគ្រូអាចបង្កើតសន្លឹកកិច្ចការថ្មី ឬផ្លាស់ប្តូរការស្វែងរកដើម្បីមើលឯកសារផ្សេងទៀត។
              </p>
              <button
                type="button"
                onClick={handleNewQuiz}
                className="mt-2 px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>បង្កើតកិច្ចការដំបូងរបស់អ្នក</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuizzes.map((quiz) => {
                const isSelectedForEdit = editingQuizId === quiz.id;
                const questionsList = quiz.questions || [];
                const typeCounts: Record<string, number> = {};
                questionsList.forEach((q) => {
                  typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
                });

                return (
                  <div
                    key={quiz.id}
                    className={`bg-white rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                      isSelectedForEdit
                        ? 'border-purple-600 ring-2 ring-purple-400/40 bg-purple-50/20'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 font-bold rounded-lg text-[11px] border border-purple-200">
                            {quiz.subject}
                          </span>
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px]">
                            {quiz.grade}
                          </span>
                          {quiz.examDuration && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-medium rounded-lg text-[10px] border border-amber-200 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {quiz.examDuration}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 font-bold rounded-lg text-[10px] border flex items-center gap-1 ${
                              quiz.worksheetOptions?.paperSize === 'A5'
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                            title={`ទំហំក្រដាស ៖ ${
                              quiz.worksheetOptions?.paperSize === 'A5'
                                ? 'A5 (កូនសៀវភៅ)'
                                : 'A4 (ស្តង់ដារ)'
                            }`}
                          >
                            {quiz.worksheetOptions?.paperSize === 'A5' ? '📖 A5' : '📄 A4'}
                          </span>
                        </div>

                        <span className={`px-2.5 py-0.5 font-bold rounded-lg text-[10px] border ${
                          quiz.sheetType === 'exam'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : quiz.sheetType === 'homework'
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : quiz.sheetType === 'test'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : quiz.sheetType === 'exit_ticket'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-purple-50 text-purple-800 border-purple-200'
                        }`}>
                          {quiz.sheetType === 'exam'
                            ? 'វិញ្ញាសាប្រឡង'
                            : quiz.sheetType === 'homework'
                            ? 'កិច្ចការផ្ទះ'
                            : quiz.sheetType === 'test'
                            ? 'តេស្តប្រចាំខែ'
                            : quiz.sheetType === 'exit_ticket'
                            ? 'Exit Ticket'
                            : 'សន្លឹកកិច្ចការ'}
                        </span>
                      </div>

                      {/* Title */}
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-relaxed">
                          {quiz.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                          <span>📝 សរុប {questionsList.length} សំណួរ</span>
                          <span>•</span>
                          <span>
                            {quiz.updatedAt
                              ? `កាលបរិច្ឆេទ ៖ ${new Date(quiz.updatedAt).toLocaleDateString('km-KH')}`
                              : 'ទើបបង្កើត'}
                          </span>
                        </p>
                      </div>

                      {/* Question types chips */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {Object.entries(typeCounts).map(([tKey, count]) => {
                          const info = QUESTION_TYPE_INFO[tKey as QuestionType];
                          if (!info) return null;
                          return (
                            <span
                              key={tKey}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                            >
                              {info.shortLabel} ({count})
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card Actions Bar */}
                    <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                      {/* Primary Actions Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditQuiz(quiz)}
                          className="px-2.5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                          title="កែសម្រួលសំណួរ និងព័ត៌មានវិញ្ញាសា"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                          <span>កែសម្រួល</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setQuickPreviewQuiz(quiz)}
                          className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          title="មើលសន្លឹកកិច្ចការ និងសន្លឹកចម្លើយ"
                        >
                          <Eye className="w-3.5 h-3.5 text-purple-700" />
                          <span>មើលសន្លឹក</span>
                        </button>

                        <div className="flex rounded-xl overflow-hidden border border-amber-300 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleDirectPrint(quiz, 'A4')}
                            className="px-2 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition flex-1 flex items-center justify-center gap-1 cursor-pointer"
                            title="បោះពុម្ពជាក្រដាស A4 ស្តង់ដារ"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-800" />
                            <span>A4</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectPrint(quiz, 'A5')}
                            className="px-2 py-2 bg-amber-200/90 hover:bg-amber-300 text-amber-950 text-xs font-bold transition flex-1 flex items-center justify-center gap-1 cursor-pointer border-l border-amber-300"
                            title="បោះពុម្ពជាក្រដាស A5 កូនសៀវភៅ (Booklet)"
                          >
                            <span>A5</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDirectWord(quiz)}
                          className="px-2.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          title="ទាញយកជាឯកសារ Word (.doc)"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-700" />
                          <span>Word</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedQuizForPdf(quiz);
                            setIsPdfBookModalOpen(true);
                          }}
                          className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-emerald-200"
                          title="រចនា និងទាញយកជាសៀវភៅ PDF"
                        >
                          <BookMarked className="w-3.5 h-3.5 text-emerald-700" />
                          <span>សៀវភៅ</span>
                        </button>
                      </div>

                      {/* Secondary Actions Row */}
                      <div className="flex items-center justify-between gap-1 pt-1 text-xs">
                        {onPlayQuiz ? (
                          <button
                            type="button"
                            onClick={() => onPlayQuiz(quiz)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1 text-[11px] cursor-pointer shadow-2xs"
                            title="បើកលេងសាកល្បង ឬលេងជាក្រុមក្នុងថ្នាក់"
                          >
                            <Play className="w-3 h-3 text-emerald-200 fill-current" />
                            <span>បើកលេងក្នុងថ្នាក់</span>
                          </button>
                        ) : (
                          <div />
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateQuiz(quiz)}
                            className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition text-xs font-medium flex items-center gap-1 cursor-pointer"
                            title="ចម្លងបង្កើតវិញ្ញាសាថ្មីមួយទៀត"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">ចម្លង</span>
                          </button>

                          {onDeleteQuiz && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`តើលោកគ្រូ-អ្នកគ្រូពិតជាចង់លុប "${quiz.title}" មែនទេ?`)) {
                                  onDeleteQuiz(quiz.id);
                                  onShowToast(`បានលុប "${quiz.title}" រួចរាល់!`);
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition text-xs font-medium flex items-center gap-1 cursor-pointer"
                              title="លុបកិច្ចការនេះចោល"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">លុប</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= QUIZ EDITOR FORM ================= */}
      {activeTab === 'editor' && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Active Edit Notice Banner */}
          {editingQuizId && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold text-xs">
                    កំពុងកែសម្រួលកិច្ចការ ៖{' '}
                    <span className="text-purple-950 font-black">{title || '(គ្មានចំណងជើង)'}</span>
                  </p>
                  <p className="text-[11px] text-amber-700">
                    រាល់ការផ្លាស់ប្តូរនឹងត្រូវរក្សាទុកលើកិច្ចការនេះពេលចុចប៊ូតុងខាងក្រោម
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('worksheet')}
                  className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-700" />
                  មើលសន្លឹក
                </button>
                <button
                  type="button"
                  onClick={handleNewQuiz}
                  className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" />
                  + បង្កើតកិច្ចការថ្មី
                </button>
              </div>
            </div>
          )}

          {/* Metadata Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">
                ចំណងជើងវិញ្ញាសា / កិច្ចការ
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ឧ. វិញ្ញាសាប្រឡងឆមាសទី១ មុខវិជ្ជាភាសាខ្មែរ..."
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">មុខវិជ្ជា</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-slate-300 rounded-2xl px-3 py-3 text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
              >
                <option value="ភាសាខ្មែរ">ភាសាខ្មែរ</option>
                <option value="គណិតវិទ្យា">គណិតវិទ្យា</option>
                <option value="វិទ្យាសាស្ត្រ">វិទ្យាសាស្ត្រ</option>
                <option value="សិក្សាសង្គម">សិក្សាសង្គម</option>
                <option value="ភាសាអង់គ្លេស">ភាសាអង់គ្លេស</option>
                <option value="ព័ត៌មានវិទ្យា">ព័ត៌មានវិទ្យា</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">កម្រិតថ្នាក់</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border border-slate-300 rounded-2xl px-3 py-3 text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
              >
                <option value="ថ្នាក់ទី ១">ថ្នាក់ទី ១</option>
                <option value="ថ្នាក់ទី ២">ថ្នាក់ទី ២</option>
                <option value="ថ្នាក់ទី ៣">ថ្នាក់ទី ៣</option>
                <option value="ថ្នាក់ទី ៤">ថ្នាក់ទី ៤</option>
                <option value="ថ្នាក់ទី ៥">ថ្នាក់ទី ៥</option>
                <option value="ថ្នាក់ទី ៦">ថ្នាក់ទី ៦</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ថិរវេលាប្រឡង</label>
              <input
                type="text"
                value={examDuration}
                onChange={(e) => setExamDuration(e.target.value)}
                placeholder="ឧ. ៤៥ នាទី ឬ ៦០ នាទី..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
              <div className="text-[11px] text-slate-600">
                <span className="font-bold text-purple-900">ចំនួនសំណួរសរុប៖ </span>
                <span className="font-extrabold text-purple-700">{questions.length} សំណួរ</span>
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-bold text-purple-900">ពិន្ទុសរុប៖ </span>
                <span className="font-extrabold text-purple-700">
                  {questions.reduce((acc, q) => acc + (q.points || 1000), 0)} pt
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Bar by Type */}
        <div className="bg-slate-100/80 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5 text-purple-600" /> បន្ថែមសំណួរតាមប្រភេទ៖
          </span>
          {(Object.keys(QUESTION_TYPE_INFO) as QuestionType[]).map((qType) => {
            const info = QUESTION_TYPE_INFO[qType];
            const Icon = info.icon;
            return (
              <button
                key={qType}
                type="button"
                onClick={() => handleAddQuestion(qType)}
                className="px-2.5 py-1.5 bg-white hover:bg-purple-50 text-slate-800 hover:text-purple-900 border border-slate-300 hover:border-purple-300 rounded-xl text-xs font-semibold transition flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-purple-700" />
                <span>+ {info.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Questions list */}
        {questions.map((q, qIndex) => {
          const currentType: QuestionType = q.type || 'qcm';
          const typeInfo = QUESTION_TYPE_INFO[currentType];
          const TypeIcon = typeInfo.icon;

          return (
            <div
              key={q.id || qIndex}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 text-xs transition hover:border-purple-300"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="w-7 h-7 rounded-full bg-purple-900 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                    {qIndex + 1}
                  </span>
                  <span className="font-extrabold text-sm text-purple-950 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-700" /> សំណួរទី {qIndex + 1}
                  </span>
                  {/* Current Type Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${typeInfo.color}`}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {typeInfo.shortLabel}
                  </span>
                </div>

                {/* Question Actions */}
                <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto">
                  <button
                    type="button"
                    title="រំកិលឡើងលើ"
                    disabled={qIndex === 0}
                    onClick={() => handleMoveQuestion(qIndex, 'up')}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    title="រំកិលចុះក្រោម"
                    disabled={qIndex === questions.length - 1}
                    onClick={() => handleMoveQuestion(qIndex, 'down')}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="ចម្លងសំណួរនេះ"
                    onClick={() => handleDuplicateQuestion(qIndex)}
                    className="p-1.5 text-slate-600 hover:text-purple-700 rounded-lg hover:bg-purple-50 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 flex items-center gap-1 font-bold text-[11px] transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> លុប
                  </button>
                </div>
              </div>

              {/* Type Selector Tabs */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 text-[11px]">
                  ជ្រើសរើសប្រភេទសំណួរ (Question Type)៖
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
                  {(Object.keys(QUESTION_TYPE_INFO) as QuestionType[]).map((tKey) => {
                    const item = QUESTION_TYPE_INFO[tKey];
                    const isSelected = currentType === tKey;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={tKey}
                        type="button"
                        onClick={() => handleChangeQuestionType(qIndex, tKey)}
                        className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-purple-900 text-white border-purple-950 shadow-xs font-bold'
                            : 'bg-slate-50 hover:bg-purple-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <ItemIcon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-purple-700'}`} />
                        <span className="text-[10.5px] leading-tight">{item.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10.5px] text-slate-500 italic mt-0.5">
                  👉 {typeInfo.desc}
                </p>
              </div>

              {/* Question Text Field */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ខ្លឹមសារសំណួរ / ប្រធានលំហាត់
                </label>
                <input
                  type="text"
                  required
                  value={q.question}
                  onChange={(e) => handleUpdateQuestionText(qIndex, e.target.value)}
                  placeholder={
                    currentType === 'fill_blank'
                      ? 'ឧ. ព្រះរាជាណាចក្រកម្ពុជាមានរាជធានីឈ្មោះ [.....]។'
                      : 'វាយបញ្ចូលសំណួរនៅទីនេះ...'
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              {/* TYPE-SPECIFIC EDITOR SECTIONS */}

              {/* 1. QCM (Multiple Choice 4 Options) */}
              {currentType === 'qcm' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    ជម្រើសចម្លើយទាំង ៤ (ចុចលើប៊ូតុងដើម្បីជ្រើសរើសចម្លើយដែលត្រឹមត្រូវ)៖
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 0 (Red) */}
                    <div
                      className={`p-3.5 rounded-2xl border transition ${
                        q.options[0]?.isCorrect
                          ? 'bg-red-500 text-white border-red-600 shadow-md'
                          : 'bg-red-50 text-red-950 border-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[11px]">▲ ចម្លើយ A (ក្រហម)</span>
                        <button
                          type="button"
                          onClick={() => handleSetCorrectOption(qIndex, 0)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                            q.options[0]?.isCorrect
                              ? 'bg-white text-red-600'
                              : 'bg-red-200/80 text-red-900 hover:bg-red-300'
                          }`}
                        >
                          {q.options[0]?.isCorrect && <Check className="w-3 h-3" />} ត្រឹមត្រូវ
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={q.options[0]?.text || ''}
                        onChange={(e) => handleUpdateOptionText(qIndex, 0, e.target.value)}
                        className="w-full bg-white/90 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    {/* Option 1 (Blue) */}
                    <div
                      className={`p-3.5 rounded-2xl border transition ${
                        q.options[1]?.isCorrect
                          ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                          : 'bg-blue-50 text-blue-950 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[11px]">◆ ចម្លើយ B (ខៀវ)</span>
                        <button
                          type="button"
                          onClick={() => handleSetCorrectOption(qIndex, 1)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                            q.options[1]?.isCorrect
                              ? 'bg-white text-blue-700'
                              : 'bg-blue-200/80 text-blue-900 hover:bg-blue-300'
                          }`}
                        >
                          {q.options[1]?.isCorrect && <Check className="w-3 h-3" />} ត្រឹមត្រូវ
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={q.options[1]?.text || ''}
                        onChange={(e) => handleUpdateOptionText(qIndex, 1, e.target.value)}
                        className="w-full bg-white/90 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    {/* Option 2 (Yellow) */}
                    <div
                      className={`p-3.5 rounded-2xl border transition ${
                        q.options[2]?.isCorrect
                          ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                          : 'bg-amber-50 text-amber-950 border-amber-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[11px]">● ចម្លើយ C (លឿង)</span>
                        <button
                          type="button"
                          onClick={() => handleSetCorrectOption(qIndex, 2)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                            q.options[2]?.isCorrect
                              ? 'bg-white text-amber-700'
                              : 'bg-amber-200/80 text-amber-900 hover:bg-amber-300'
                          }`}
                        >
                          {q.options[2]?.isCorrect && <Check className="w-3 h-3" />} ត្រឹមត្រូវ
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={q.options[2]?.text || ''}
                        onChange={(e) => handleUpdateOptionText(qIndex, 2, e.target.value)}
                        className="w-full bg-white/90 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    {/* Option 3 (Green) */}
                    <div
                      className={`p-3.5 rounded-2xl border transition ${
                        q.options[3]?.isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                          : 'bg-emerald-50 text-emerald-950 border-emerald-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[11px]">■ ចម្លើយ D (បៃតង)</span>
                        <button
                          type="button"
                          onClick={() => handleSetCorrectOption(qIndex, 3)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                            q.options[3]?.isCorrect
                              ? 'bg-white text-emerald-700'
                              : 'bg-emerald-200/80 text-emerald-900 hover:bg-emerald-300'
                          }`}
                        >
                          {q.options[3]?.isCorrect && <Check className="w-3 h-3" />} ត្រឹមត្រូវ
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={q.options[3]?.text || ''}
                        onChange={(e) => handleUpdateOptionText(qIndex, 3, e.target.value)}
                        className="w-full bg-white/90 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. TRUE / FALSE (ខុស ឬ ត្រូវ) */}
              {currentType === 'true_false' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <label className="block font-bold text-slate-800 text-xs">
                    កំណត់ចម្លើយត្រឹមត្រូវ (តើការលើកឡើងខាងលើ «ត្រូវ» ឬ «ខុស»?)៖
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleSetTrueFalse(qIndex, true)}
                      className={`p-4 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                        q.isTrue !== false
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg scale-102'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-xl">
                        ✔
                      </div>
                      <div>
                        <div className="font-extrabold text-sm">ត្រូវ (True / ពិត)</div>
                        <div className="text-[10px] opacity-80">ព័ត៌មាន ឬលំហាត់នេះពិតជាត្រឹមត្រូវ</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetTrueFalse(qIndex, false)}
                      className={`p-4 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                        q.isTrue === false
                          ? 'bg-rose-600 text-white border-rose-700 shadow-lg scale-102'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-xl">
                        ✖
                      </div>
                      <div>
                        <div className="font-extrabold text-sm">ខុស (False / មិនពិត)</div>
                        <div className="text-[10px] opacity-80">ព័ត៌មាន ឬលំហាត់នេះមិនត្រឹមត្រូវទេ</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. MATCHING PAIRS (ផ្គូរផ្គង) */}
              {currentType === 'matching' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">
                        បញ្ជីគូផ្គូរផ្គង (ធាតុខាងឆ្វេង ↔ ធាតុខាងស្តាំដែលត្រូវគ្នា)៖
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        ពេលសិស្សឆ្លើយ ប្រព័ន្ធនឹងសាប់លំដាប់ធាតុខាងស្តាំដោយស្វ័យប្រវត្តិដើម្បីឱ្យសិស្សផ្គូផ្គង
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddMatchingPair(qIndex)}
                      className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> បន្ថែមគូ
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(q.matchingPairs || []).map((pair, pIdx) => (
                      <div
                        key={pair.id || pIdx}
                        className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs"
                      >
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {pIdx + 1}
                        </span>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={pair.left}
                            onChange={(e) =>
                              handleUpdateMatchingPair(qIndex, pIdx, 'left', e.target.value)
                            }
                            placeholder="ធាតុខាងឆ្វេង (ជួរ ក)..."
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <span className="font-bold text-slate-400 text-sm">↔</span>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={pair.right}
                            onChange={(e) =>
                              handleUpdateMatchingPair(qIndex, pIdx, 'right', e.target.value)
                            }
                            placeholder="ធាតុខាងស្តាំត្រូវគ្នា (ជួរ ខ)..."
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteMatchingPair(qIndex, pIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="លុបគូនេះ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. FILL IN THE BLANKS (បំពេញចន្លោះ) */}
              {currentType === 'fill_blank' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1">
                      ពាក្យ ឬឃ្លាចម្លើយត្រឹមត្រូវ (សម្រាប់បំពេញក្នុងចន្លោះ [.....])៖
                    </label>
                    <input
                      type="text"
                      required
                      value={q.blankAnswer || ''}
                      onChange={(e) => handleUpdateBlankAnswer(qIndex, e.target.value)}
                      placeholder="ឧ. អាស៊ីអាគ្នេយ៍"
                      className="w-full border border-emerald-300 bg-emerald-50/50 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-xs mb-1">
                      ពាក្យបំភ័ន្តបន្ថែម (ជម្រើសខុសសម្រាប់សិស្សរើស បំបែកដោយសញ្ញាក្បៀស ,)៖
                    </label>
                    <input
                      type="text"
                      value={(q.blankDistractors || []).join(', ')}
                      onChange={(e) => handleUpdateDistractors(qIndex, e.target.value)}
                      placeholder="ឧ. អាស៊ីខាងកើត, អាស៊ីខាងត្បូង, អាស៊ីកណ្តាល"
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      ពាក្យបំភ័ន្តទាំងនេះ នឹងបង្ហាញជាជម្រើសកាតពាក្យសម្រាប់សិស្សរើសបំពេញពេលលេងតេស្ត
                    </p>
                  </div>
                </div>
              )}

              {/* 5. REORDER WORDS (រៀបពាក្យឲ្យល្បះត្រឹមត្រូវ) */}
              {currentType === 'reorder_words' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1">
                      ល្បះត្រឹមត្រូវពេញលេញ (Full Correct Sentence)៖
                    </label>
                    <input
                      type="text"
                      required
                      value={q.correctSentence || ''}
                      onChange={(e) => handleUpdateCorrectSentence(qIndex, e.target.value)}
                      placeholder="ឧ. សិស្សានុសិស្ស ខិតខំ រៀនសូត្រ ដើម្បី អនាគត ភ្លឺស្វាង"
                      className="w-full border border-teal-300 bg-teal-50/40 rounded-xl px-3 py-2 text-xs font-bold text-teal-950 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-xs mb-1">
                      កម្រងពាក្យរាយប៉ាយ (Words to unscramble - បំបែកដោយសញ្ញាក្បៀស ,)៖
                    </label>
                    <input
                      type="text"
                      value={(q.words || []).join(', ')}
                      onChange={(e) => handleUpdateWordsManually(qIndex, e.target.value)}
                      placeholder="ឧ. ដើម្បី, សិស្សានុសិស្ស, ភ្លឺស្វាង, ខិតខំ, អនាគត, រៀនសូត្រ"
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  {/* Word Chips Live Preview */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10.5px] font-bold text-slate-600 block mb-1.5">
                      ទម្រង់កាតពាក្យដែលសិស្សនឹងឃើញដើម្បីចុចរៀបលំដាប់៖
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(q.words || []).map((w, wIdx) => (
                        <span
                          key={wIdx}
                          className="px-3 py-1 bg-teal-100 text-teal-900 border border-teal-300 rounded-lg font-bold text-xs shadow-2xs"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. SHORT ANSWER (សំណួរចម្លើយខ្លី) */}
              {currentType === 'short_answer' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1">
                      ចម្លើយត្រឹមត្រូវ ឬពាក្យគន្លឹះ (Correct Answer / Keyword)៖
                    </label>
                    <input
                      type="text"
                      required
                      value={q.correctAnswer || ''}
                      onChange={(e) => handleUpdateShortAnswer(qIndex, e.target.value)}
                      placeholder="ឧ. ៩ វិច្ឆិកា ឬ រាជធានីភ្នំពេញ..."
                      className="w-full border border-indigo-300 bg-indigo-50/40 rounded-xl px-3 py-2 text-xs font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      ពេលសិស្សវាយបញ្ចូលចម្លើយ ប្រព័ន្ធនឹងផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិជាមួយពាក្យគន្លឹះនេះ
                    </p>
                  </div>
                </div>
              )}

              {/* 7. MULTI-SELECT (សំណួរជ្រើសរើសចម្លើយត្រូវច្រើន) */}
              {currentType === 'multi_select' && (
                <div className="p-4 bg-cyan-50/50 rounded-2xl border border-cyan-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 text-xs">
                        ជម្រើសចម្លើយ (ចុចលើប្រអប់ ✔ មុខជម្រើសដើម្បីជ្រើសរើសចម្លើយត្រឹមត្រូវ - អាចរើសបានច្រើន)៖
                      </label>
                      <p className="text-[10px] text-slate-500">
                        សិស្សអាចធីកជ្រើសរើសចម្លើយត្រឹមត្រូវទាំងអស់
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddMultiSelectOption(qIndex)}
                      className="px-2.5 py-1 bg-cyan-100 hover:bg-cyan-200 text-cyan-900 border border-cyan-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> បន្ថែមជម្រើស
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(q.options || []).map((opt, oIdx) => (
                      <div
                        key={opt.id || oIdx}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition ${
                          opt.isCorrect
                            ? 'bg-cyan-100/70 border-cyan-400 text-cyan-950 font-semibold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleMultiSelectOption(qIndex, oIdx)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs cursor-pointer transition shrink-0 ${
                            opt.isCorrect
                              ? 'bg-cyan-700 text-white border-cyan-800'
                              : 'bg-white border-slate-300 text-slate-400 hover:border-cyan-500'
                          }`}
                        >
                          {opt.isCorrect ? '✓' : ''}
                        </button>
                        <span className="font-bold text-xs text-slate-500 w-5">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleUpdateOptionText(qIndex, oIdx, e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-600"
                          placeholder={`ខ្លឹមសារជម្រើស ${String.fromCharCode(65 + oIdx)}...`}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteMultiSelectOption(qIndex, oIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="លុបជម្រើសនេះ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. PISA COMPETENCY (សំណួរបែប PISA) */}
              {currentType === 'pisa' && (
                <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 pb-2">
                    <span className="font-bold text-rose-950 text-xs flex items-center gap-1.5">
                      <Globe2 className="w-4 h-4 text-rose-700" /> សំណួរបែប PISA (ស្ថានភាពជាក់ស្តែង និងត្រិះរិះពិចារណា)
                    </span>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-600 font-medium">ដែនវាយតម្លៃ៖</span>
                      <select
                        value={q.pisaDomain || 'science'}
                        onChange={(e) =>
                          handleUpdatePisaDomain(
                            qIndex,
                            e.target.value as 'math' | 'science' | 'reading' | 'financial' | 'creative'
                          )
                        }
                        className="bg-white border border-rose-300 text-rose-900 font-bold rounded-lg px-2 py-1 text-xs focus:outline-none"
                      >
                        <option value="math">គណិតវិទ្យា (Mathematical Literacy)</option>
                        <option value="science">វិទ្យាសាស្ត្រ (Scientific Literacy)</option>
                        <option value="reading">អំណាន (Reading Literacy)</option>
                        <option value="financial">ហិរញ្ញវត្ថុ (Financial Literacy)</option>
                        <option value="creative">ត្រិះរិះពិចារណា (Creative Thinking)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1">
                      ស្ថានភាពជាក់ស្តែង / ទិន្នន័យពិភពពិត (Real-world Scenario & Data)៖
                    </label>
                    <textarea
                      rows={3}
                      value={q.pisaContext || ''}
                      onChange={(e) => handleUpdatePisaContext(qIndex, e.target.value)}
                      placeholder="រៀបរាប់ពីស្ថានភាពក្នុងសហគមន៍ បរិស្ថាន វិទ្យាសាស្ត្រ ឬទិន្នន័យជាក់ស្តែងសម្រាប់សិស្សវិភាគ..."
                      className="w-full bg-white border border-rose-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 text-xs">
                        កម្រងសំណួររងវិភាគ (Analytical Sub-questions)៖
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddPisaPart(qIndex)}
                        className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> បន្ថែមសំណួររង
                      </button>
                    </div>

                    {(q.pisaParts || q.pisaQuestionParts || []).map((part, pIdx) => (
                      <div
                        key={part.id || pIdx}
                        className="bg-white p-3 rounded-xl border border-rose-100 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-rose-800 text-xs">
                            សំណួររង {pIdx + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500">ពិន្ទុ៖</span>
                            <input
                              type="number"
                              step="0.5"
                              min="0.5"
                              max="10"
                              value={part.points || 1.5}
                              onChange={(e) =>
                                handleUpdatePisaPart(
                                  qIndex,
                                  pIdx,
                                  'points',
                                  parseFloat(e.target.value) || 1
                                )
                              }
                              className="w-14 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 text-xs font-bold text-center"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeletePisaPart(qIndex, pIdx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition cursor-pointer"
                              title="លុបសំណួររងនេះ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={part.prompt}
                          onChange={(e) => handleUpdatePisaPart(qIndex, pIdx, 'prompt', e.target.value)}
                          placeholder="ខ្លឹមសារសំណួររង..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <input
                          type="text"
                          value={part.sampleAnswer || ''}
                          onChange={(e) =>
                            handleUpdatePisaPart(qIndex, pIdx, 'sampleAnswer', e.target.value)
                          }
                          placeholder="ចម្លើយគំរូ / ដំណោះស្រាយខ្លីៗ..."
                          className="w-full bg-emerald-50/50 border border-emerald-200 rounded-lg px-2.5 py-1.5 text-xs text-emerald-950 font-medium focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1">
                      គោលបំណងវិភាគ ឬគន្លឹះដោះស្រាយ (Competency Target & Solution)៖
                    </label>
                    <input
                      type="text"
                      value={q.pisaReasoning || ''}
                      onChange={(e) => handleUpdatePisaReasoning(qIndex, e.target.value)}
                      placeholder="ឧ. វាស់វែងសមត្ថភាពអនុវត្តរូបមន្តគណិតវិទ្យាទៅលើទិន្នន័យថាមពលក្នុងជីវភាពជាក់ស្តែង..."
                      className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 9. READING COMPREHENSION (អត្ថបទអំណាន និងសំណួរយល់ន័យ) */}
              {currentType === 'reading_comprehension' && (
                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-3.5">
                  <div className="border-b border-indigo-100 pb-2">
                    <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-700" /> អត្ថបទអំណាន និងកម្រងសំណួរយល់ន័យ (Reading Passage)
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1">
                      ចំណងជើងអត្ថបទ (Passage Title)៖
                    </label>
                    <input
                      type="text"
                      value={q.passageTitle || ''}
                      onChange={(e) => handleUpdatePassageTitle(qIndex, e.target.value)}
                      placeholder="ឧ. រឿង កូនទន្សាយឈ្លាសវៃ និងសត្វតោ..."
                      className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-bold text-indigo-950 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1">
                      ខ្លឹមសារកថាខណ្ឌអត្ថបទ (Reading Passage Text)៖
                    </label>
                    <textarea
                      rows={4}
                      value={q.passageText || ''}
                      onChange={(e) => handleUpdatePassageText(qIndex, e.target.value)}
                      placeholder="បញ្ចូលអត្ថបទអំណាន រឿងនិទាន ឬអត្ថបទវិទ្យាសាស្ត្រសម្រាប់សិស្សអាន..."
                      className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 text-xs">
                        កម្រងសំណួរស្វែងយល់ន័យ (Comprehension Questions)៖
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddPassageQuestion(qIndex)}
                        className="px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> បន្ថែមសំណួរ
                      </button>
                    </div>

                    {(q.passageQuestions || []).map((pq, pqIdx) => (
                      <div
                        key={pq.id || pqIdx}
                        className="bg-white p-3 rounded-xl border border-indigo-100 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-indigo-800 text-xs">
                            សំណួរទី {pqIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeletePassageQuestion(qIndex, pqIdx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition cursor-pointer"
                            title="លុបសំណួរនេះ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={pq.question}
                          onChange={(e) =>
                            handleUpdatePassageQuestion(qIndex, pqIdx, 'question', e.target.value)
                          }
                          placeholder="ខ្លឹមសារសំណួរ..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          value={pq.answer || ''}
                          onChange={(e) =>
                            handleUpdatePassageQuestion(qIndex, pqIdx, 'answer', e.target.value)
                          }
                          placeholder="ចម្លើយត្រឹមត្រូវគំរូ..."
                          className="w-full bg-emerald-50/50 border border-emerald-200 rounded-lg px-2.5 py-1.5 text-xs text-emerald-950 font-medium focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 10. ESSAY / STRUCTURED OPEN RESPONSE (សំណួរសំណេរពិចារណា) */}
              {currentType === 'essay' && (
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="border-b border-emerald-100 pb-2">
                    <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                      <PenTool className="w-4 h-4 text-emerald-700" /> សំណួរសំណេរពិចារណា / តែងសេចក្តី (Essay Writing)
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1">
                      លក្ខណៈវិនិច្ឆ័យ និងកម្រិតពិន្ទុ (Evaluation Rubric & Criteria)៖
                    </label>
                    <textarea
                      rows={2}
                      value={q.essayRubric || ''}
                      onChange={(e) => handleUpdateEssayRubric(qIndex, e.target.value)}
                      placeholder="ឧ. សេចក្តីផ្តើម (២ពិន្ទុ), តួសេចក្តី និងអំណះអំណាង (៥ពិន្ទុ), សេចក្តីបញ្ចប់ (២ពិន្ទុ), អក្ខរាវិរុទ្ធ (១ពិន្ទុ)..."
                      className="w-full bg-white border border-emerald-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1">
                      ចំណុចគន្លឹះត្រឹមត្រូវ ឬទស្សនៈគំរូ (Key Arguments / Sample Solution)៖
                    </label>
                    <input
                      type="text"
                      value={q.correctAnswer || ''}
                      onChange={(e) => handleUpdateShortAnswer(qIndex, e.target.value)}
                      placeholder="ចំណុចគន្លឹះសំខាន់ៗដែលត្រូវមានក្នុងអត្ថបទសំណេរ..."
                      className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Question Settings: Time Limit & Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-600 text-[11px] mb-1">
                    ថិរវេលាឆ្លើយ (Time Limit)
                  </label>
                  <select
                    value={q.timeLimit || 20}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIndex].timeLimit = Number(e.target.value);
                      setQuestions(updated);
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value={10}>១០ វិនាទី (10s - លឿនបំផុត)</option>
                    <option value={15}>១៥ វិនាទី (15s)</option>
                    <option value={20}>២០ វិនាទី (20s - ស្តង់ដារ)</option>
                    <option value={30}>៣០ វិនាទី (30s)</option>
                    <option value={60}>៦០ វិនាទី (1mn)</option>
                    <option value={90}>៩០ វិនាទី (1.5mn)</option>
                    <option value={120}>១២០ វិនាទី (2mn)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 text-[11px] mb-1">
                    ពិន្ទុសម្រាប់សំណួរនេះ (Points)
                  </label>
                  <select
                    value={q.points || 1000}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIndex].points = Number(e.target.value);
                      setQuestions(updated);
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value={500}>៥០០ ពិន្ទុ (500 pt)</option>
                    <option value={1000}>១,០០០ ពិន្ទុ (1000 pt - ស្តង់ដារ)</option>
                    <option value={1500}>១,៥០០ ពិន្ទុ (1500 pt)</option>
                    <option value={2000}>២,០០០ ពិន្ទុ (2000 pt - សំណួរពិន្ទុទ្វេដង)</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom Add Question Buttons */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <span className="font-bold text-slate-800 text-xs block">
            បន្ថែមសំណួរថ្មីទៅក្នុងវិញ្ញាសា (+ Add Question)៖
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {(Object.keys(QUESTION_TYPE_INFO) as QuestionType[]).map((tKey) => {
              const item = QUESTION_TYPE_INFO[tKey];
              const ItemIcon = item.icon;
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => handleAddQuestion(tKey)}
                  className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold rounded-2xl border border-purple-200 transition flex flex-col items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                >
                  <ItemIcon className="w-5 h-5 text-purple-700" />
                  <span className="text-xs">+ {item.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-purple-900 hover:bg-purple-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-900/20 transition active:scale-98 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-amber-300" />
            <span>
              {editingQuizId ? 'ធ្វើបច្ចុប្បន្នភាព និងរក្សាទុក' : 'រក្សាទុកសន្លឹកកិច្ចការ & វិញ្ញាសា'} ({questions.length} សំណួរ)
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('worksheet')}
            className="px-5 py-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition active:scale-98 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Eye className="w-4 h-4 text-purple-700" />
            <span>មើលសន្លឹកកិច្ចការ</span>
          </button>

          <button
            type="button"
            onClick={handlePrintWorksheet}
            className="px-5 py-4 bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold rounded-2xl transition active:scale-98 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-purple-950" />
            <span>បោះពុម្ព A4 ភ្លាមៗ</span>
          </button>
        </div>
      </form>
      )}

      {/* PRINT EXAM PAPER / WORKSHEET MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md no-print">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-5xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Top bar */}
            <div className="bg-purple-950 text-white px-4 sm:px-6 py-3.5 flex flex-wrap justify-between items-center gap-3 border-b border-purple-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-purple-100">
                    សន្លឹកកិច្ចការ និងវិញ្ញាសាប្រឡង (Worksheet & Exam Paper)
                  </h3>
                  <p className="text-[11px] text-purple-300">
                    រៀបចំតាមបទដ្ឋានផ្លូវការក្រសួងអប់រំ យុវជន និងកីឡា
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Answer Key Toggle in Modal */}
                <button
                  type="button"
                  onClick={() =>
                    setWorksheetOptions({
                      ...worksheetOptions,
                      showAnswerKey: !worksheetOptions.showAnswerKey,
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    worksheetOptions.showAnswerKey
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{worksheetOptions.showAnswerKey ? '✓ សន្លឹកចម្លើយគំរូ' : 'បង្ហាញចម្លើយគំរូ'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintWorksheet}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-purple-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> បោះពុម្ព A4
                </button>

                <button
                  type="button"
                  onClick={handleExportWord}
                  className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> ទាញយក Word (.doc)
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 text-purple-200 hover:text-white rounded-lg hover:bg-purple-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Sub Toolbar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 space-y-2 text-xs">
              {/* Row 1: Sheet Type & Border Style & Settings */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="font-bold text-slate-800 shrink-0 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-purple-700" />
                    <span>ប្រភេទ ៖</span>
                  </span>
                  <div className="relative flex items-center min-w-0 flex-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                    <button
                      type="button"
                      onClick={() => scrollSheetTypes(modalSheetTypeScrollRef, 'left')}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-purple-900 shrink-0 transition cursor-pointer"
                      title="អូសទៅឆ្វេង (Scroll Left)"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <div
                      ref={modalSheetTypeScrollRef}
                      className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-1 scroll-smooth no-scrollbar select-none"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {(['worksheet', 'exam', 'homework', 'test', 'exit_ticket'] as WorksheetType[]).map((type) => {
                        const isSelected = worksheetOptions.sheetType === type;
                        const info = WORKSHEET_TYPE_TITLES[type];
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setWorksheetOptions({ ...worksheetOptions, sheetType: type })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border whitespace-nowrap ${
                              isSelected
                                ? 'bg-purple-900 text-white shadow-xs ring-2 ring-purple-300 border-purple-950 scale-[1.01]'
                                : 'bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-950 border-slate-200'
                            }`}
                          >
                            <span>{info.icon}</span>
                            <span>{info.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => scrollSheetTypes(modalSheetTypeScrollRef, 'right')}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-purple-900 shrink-0 transition cursor-pointer"
                      title="អូសទៅស្តាំ (Scroll Right)"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">ក្បាច់ ៖</span>
                    <select
                      value={worksheetOptions.borderStyle}
                      onChange={(e) =>
                        setWorksheetOptions({
                          ...worksheetOptions,
                          borderStyle: e.target.value as WorksheetBorderStyle,
                        })
                      }
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none"
                    >
                      <option value="double">បន្ទាត់ទ្វេផ្លូវការ MoEYS</option>
                      <option value="ornamental">ក្បាច់ផ្កាច័ន្ទខ្មែរ (Ornamental)</option>
                      <option value="modern">ទាន់សម័យ (Modern Crisp)</option>
                      <option value="minimal">សាមញ្ញ (Minimal)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-bold text-purple-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>{showSettingsDrawer ? 'លាក់ការកំណត់' : 'កំណត់ព័ត៌មានក្បាលទំព័រ'}</span>
                  </button>
                </div>
              </div>

              {/* Row 2: ៤ ម៉ូតរចនា & A4 តែ ២ ទំព័រ / បញ្ឈរ & ផ្តេក */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/70">
                {/* 4 Themes */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-purple-700" /> ម៉ូត (៤ ម៉ូត) ៖
                  </span>
                  {(['moeys_classic', 'modern_indigo', 'primary_friendly', 'pisa_academic'] as WorksheetDesignTheme[]).map(
                    (themeKey) => {
                      const info = WORKSHEET_DESIGN_INFO[themeKey];
                      const isSelected = (worksheetOptions.designTheme || 'moeys_classic') === themeKey;
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => setWorksheetOptions({ ...worksheetOptions, designTheme: themeKey })}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                            isSelected
                              ? 'bg-purple-900 text-white border-purple-950 shadow-xs ring-1 ring-purple-300'
                              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <span>{info.icon}</span>
                          <span>{info.name.split(' ')[0]}</span>
                        </button>
                      );
                    }
                  )}
                </div>

                {/* A4 2-Page & Orientation */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* 2-Page Mode */}
                  <div className="inline-flex rounded-lg p-0.5 bg-white border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setWorksheetOptions({ ...worksheetOptions, pageMode: 'two_pages' })}
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                        (worksheetOptions.pageMode || 'two_pages') === 'two_pages'
                          ? 'bg-purple-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📑 តែ ២ ទំព័រ
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorksheetOptions({ ...worksheetOptions, pageMode: 'continuous' })}
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                        worksheetOptions.pageMode === 'continuous'
                          ? 'bg-purple-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📄 បន្តបន្ទាប់
                    </button>
                  </div>

                  {/* Orientation */}
                  <div className="inline-flex rounded-lg p-0.5 bg-white border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setWorksheetOptions({ ...worksheetOptions, pageOrientation: 'portrait' })}
                      className={`px-2 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                        (worksheetOptions.pageOrientation || 'portrait') === 'portrait'
                          ? 'bg-purple-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📄 បញ្ឈរ
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorksheetOptions({ ...worksheetOptions, pageOrientation: 'landscape' })}
                      className={`px-2 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                        worksheetOptions.pageOrientation === 'landscape'
                          ? 'bg-purple-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📑 ផ្តេក
                    </button>
                  </div>

                  {/* Margin 0 0 */}
                  <div className="inline-flex rounded-lg p-0.5 bg-white border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setWorksheetOptions({ ...worksheetOptions, marginMode: 'zero' })}
                      className={`px-2 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                        (worksheetOptions.marginMode || 'zero') === 'zero'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="គែម 0 0"
                    >
                      ⚡ 0 0
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorksheetOptions({ ...worksheetOptions, marginMode: 'compact' })}
                      className={`px-2 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                        worksheetOptions.marginMode === 'compact'
                          ? 'bg-purple-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="គែមតូច"
                    >
                      📐 តូច
                    </button>
                  </div>

                  {/* Paper Size A4 vs A5 */}
                  <div className="inline-flex rounded-lg p-0.5 bg-white border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setWorksheetOptions({ ...worksheetOptions, paperSize: 'A4' })}
                      className={`px-2 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                        (worksheetOptions.paperSize || 'A4') === 'A4'
                          ? 'bg-purple-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="ទំហំ A4 ស្តង់ដារ (210×297mm)"
                    >
                      📄 A4
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorksheetOptions({ ...worksheetOptions, paperSize: 'A5' })}
                      className={`px-2 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                        worksheetOptions.paperSize === 'A5'
                          ? 'bg-purple-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="ទំហំ A5 កូនសៀវភៅ (148×210mm)"
                    >
                      📖 A5
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Collapsible Settings */}
            {showSettingsDrawer && (
              <div className="bg-slate-50 p-4 border-b border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ឈ្មោះសាលារៀន</label>
                    <input
                      type="text"
                      value={worksheetOptions.schoolName}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, schoolName: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                      placeholder="ឈ្មោះសាលា..."
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ការិយាល័យអប់រំ / ស្រុក-ខណ្ឌ</label>
                    <input
                      type="text"
                      value={worksheetOptions.districtOffice}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, districtOffice: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                      placeholder="ការិយាល័យអប់រំ..."
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ឆ្នាំសិក្សា (ស្រេចចិត្ត)</label>
                    <input
                      type="text"
                      value={worksheetOptions.academicYear || ''}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, academicYear: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                      placeholder="ឧ. ២០២៥ - ២០២៦ (ទុកទទេបើមិនចង់បង្ហាញ)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">កាលបរិច្ឆេទលើសន្លឹក</label>
                      <button
                        type="button"
                        onClick={() => {
                          const todayKhmer = getKhmerSouriyateiDate(new Date());
                          setWorksheetOptions({ ...worksheetOptions, customDate: todayKhmer });
                        }}
                        className="text-[10px] text-purple-700 hover:text-purple-900 font-medium underline"
                      >
                        ដាក់ថ្ងៃនេះជាខ្មែរ
                      </button>
                    </div>
                    <input
                      type="text"
                      value={worksheetOptions.customDate || ''}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, customDate: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                      placeholder="ឧ. ថ្ងៃទី១០ ខែមីនា ឆ្នាំ២០២៦ (ទុកទទេដើម្បីបង្ហាញ ...)"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">សម័យប្រឡង (សម្រាប់វិញ្ញាសា)</label>
                    <input
                      type="text"
                      value={worksheetOptions.examSession || ''}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, examSession: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                      placeholder="ឧ. ១៥ មិនា ២០២៦ (ទុកទទេបង្ហាញ ...)"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ពិន្ទុសរុប (Total Score)</label>
                    <input
                      type="text"
                      value={worksheetOptions.totalScore || ''}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, totalScore: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                      placeholder="ឧ. ១០ ពិន្ទុ ឬ ២០ ពិន្ទុ ឬ ១០០"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ការណែនាំសិស្ស</label>
                  <input
                    type="text"
                    value={worksheetOptions.instructionText}
                    onChange={(e) =>
                      setWorksheetOptions({ ...worksheetOptions, instructionText: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div className="flex flex-wrap gap-4 pt-1 border-t border-slate-200 text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={worksheetOptions.showStudentBox}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, showStudentBox: e.target.checked })
                      }
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>ប្រអប់ព័ត៌មានសិស្ស</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={worksheetOptions.showEvaluationBox}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, showEvaluationBox: e.target.checked })
                      }
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>ប្រអប់ពិន្ទុ & ការវាយតម្លៃ</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={worksheetOptions.showSignatures}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, showSignatures: e.target.checked })
                      }
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>ហត្ថលេខា & ត្រា</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={worksheetOptions.showPoints}
                      onChange={(e) =>
                        setWorksheetOptions({ ...worksheetOptions, showPoints: e.target.checked })
                      }
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>បង្ហាញពិន្ទុលើសំណួរ</span>
                  </label>
                </div>
              </div>
            )}

            {/* Printable Exam Paper Content */}
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-200/50">
              <WorksheetPaperView
                title={title || 'វិញ្ញាសាប្រឡង ឬកិច្ចការស្វ័យសិក្សា'}
                subject={subject}
                grade={grade}
                examDuration={examDuration}
                teacherName={teacherName}
                questions={questions}
                options={worksheetOptions}
              />
            </div>
          </div>
        </div>
      )}

      {/* QUICK PREVIEW MODAL FOR ARCHIVED QUIZZES */}
      {quickPreviewQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md no-print">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-5xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Quick Preview Modal Header */}
            <div className="bg-purple-950 text-white px-4 sm:px-6 py-3.5 flex flex-wrap justify-between items-center gap-3 border-b border-purple-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-purple-100">
                    {quickPreviewQuiz.title}
                  </h3>
                  <p className="text-[11px] text-purple-300 flex items-center gap-2">
                    <span>{quickPreviewQuiz.subject}</span>
                    <span>•</span>
                    <span>{quickPreviewQuiz.grade}</span>
                    <span>•</span>
                    <span>{quickPreviewQuiz.questions?.length || 0} សំណួរ</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    handleEditQuiz(quickPreviewQuiz);
                    setQuickPreviewQuiz(null);
                  }}
                  className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> កែសម្រួល
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectPrint(quickPreviewQuiz, 'A4')}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-purple-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="បោះពុម្ពជាក្រដាស A4 ស្តង់ដារ"
                >
                  <Printer className="w-3.5 h-3.5" /> បោះពុម្ព A4
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectPrint(quickPreviewQuiz, 'A5')}
                  className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-amber-300 border border-purple-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="បោះពុម្ពជាក្រដាស A5 កូនសៀវភៅ (Booklet)"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" /> បោះពុម្ព A5 (សៀវភៅ)
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectWord(quickPreviewQuiz)}
                  className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> ទាញយក Word (.doc)
                </button>

                <button
                  type="button"
                  onClick={() => setQuickPreviewQuiz(null)}
                  className="p-1.5 text-purple-200 hover:text-white rounded-lg hover:bg-purple-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Preview Content */}
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-200/50">
              <div className="max-w-xl mx-auto mb-4 flex items-center justify-between gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-xs rounded-xl border border-slate-300 shadow-2xs text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5 text-purple-950 font-bold">
                  <span>ទំហំមើលសាកល្បង ៖</span>
                </span>
                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickPreviewQuiz({
                        ...quickPreviewQuiz,
                        worksheetOptions: {
                          ...(quickPreviewQuiz.worksheetOptions || worksheetOptions),
                          paperSize: 'A4',
                        },
                      });
                    }}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                      (quickPreviewQuiz.worksheetOptions?.paperSize || 'A4') === 'A4'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📄 A4 ស្តង់ដារ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickPreviewQuiz({
                        ...quickPreviewQuiz,
                        worksheetOptions: {
                          ...(quickPreviewQuiz.worksheetOptions || worksheetOptions),
                          paperSize: 'A5',
                        },
                      });
                    }}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition cursor-pointer ${
                      quickPreviewQuiz.worksheetOptions?.paperSize === 'A5'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📖 A5 កូនសៀវភៅ
                  </button>
                </div>
              </div>

              <WorksheetPaperView
                title={quickPreviewQuiz.title}
                subject={quickPreviewQuiz.subject}
                grade={quickPreviewQuiz.grade}
                examDuration={quickPreviewQuiz.examDuration || '៤៥ នាទី'}
                teacherName={teacherName}
                questions={quickPreviewQuiz.questions || []}
                options={quickPreviewQuiz.worksheetOptions || worksheetOptions}
              />
            </div>
          </div>
        </div>
      )}
      {/* PDF Book Customizer Modal */}
      <PdfCustomizerModal
        isOpen={isPdfBookModalOpen}
        onClose={() => setIsPdfBookModalOpen(false)}
        documentType="quiz"
        title={selectedQuizForPdf ? `រចនា និងទាញយកសៀវភៅ៖ ${selectedQuizForPdf.title}` : 'រចនាវិញ្ញាសាជាសៀវភៅ PDF'}
        quizData={selectedQuizForPdf || undefined}
        onShowToast={onShowToast}
        initialHeader={{
          docTitle: selectedQuizForPdf?.title || '',
          docSubtitle: `មុខវិជ្ជា៖ ${selectedQuizForPdf?.subject || ''} | ${selectedQuizForPdf?.grade || ''}`,
          teacherName: teacherName,
        }}
        initialStyles={{
          paperSize: (selectedQuizForPdf?.worksheetOptions?.paperSize as any) || worksheetOptions.paperSize || 'A4',
        }}
      />
    </div>
  );
};
