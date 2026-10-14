import { Quiz } from '../types';
import { ALL_MATH_LESSONS_PACKAGES } from './mathLessonQcm';
import { HEALTH_EDUCATION_40_QUESTIONS, ALL_HEALTH_LESSONS_PACKAGES } from './healthEducationLessonsData';
import { ENGLISH_40_EXAM_QUESTIONS } from './english40QuestionsData';

export interface StudentSubjectExam {
  id: string;
  title: string;
  subject: 'math' | 'khmer' | 'science' | 'social' | 'english' | 'health';
  subjectName: string;
  subjectIcon: string;
  grade: string;
  category: 'semester1' | 'semester2' | 'monthly' | 'prep' | 'quick';
  categoryLabel: string;
  durationMinutes: number;
  totalPoints: number;
  badgeColor: string;
  questions: {
    id: number;
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation?: string;
    points: number;
  }[];
}

export interface FormulaItem {
  id: string;
  subject: string;
  topic: string;
  formula: string;
  explanation: string;
  example: string;
}

export interface HomeworkTask {
  id: string;
  title: string;
  subject: string;
  subjectIcon: string;
  dueDate: string;
  description: string;
  points: number;
  questions: {
    id: number;
    question: string;
    options: { text: string; isCorrect: boolean }[];
    points: number;
    explanation?: string;
  }[];
}

// Built-in Grade 6 Curriculum Exams
export const BUILTIN_STUDENT_EXAMS: StudentSubjectExam[] = [
  // Health Education - Lessons 1 to 4 QCM (40 Questions each)
  ...ALL_HEALTH_LESSONS_PACKAGES.map((pkg) => ({
    id: `exam-health-lesson${pkg.lessonNumber}-40q`,
    title: `វិញ្ញាសា QCM ៤០ សំណួរ ៖ អប់រំសុខភាព ${pkg.title}`,
    subject: 'health' as const,
    subjectName: 'អប់រំសុខភាព',
    subjectIcon: '🏥',
    grade: 'ថ្នាក់ទី៦',
    category: 'quick' as const,
    categoryLabel: `${pkg.shortTitle} (៤០ សំណួរ)`,
    durationMinutes: 60,
    totalPoints: 40,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    questions: pkg.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      explanation: q.explanation,
      points: q.points || 1,
    })),
  })),
  // Health Education - Comprehensive 40 Questions MoEYS Exam
  {
    id: 'exam-health-40q',
    title: 'វិញ្ញាសារួម QCM ៤០ សំណួរ ៖ អប់រំសុខភាព ថ្នាក់ទី៦ (គ្រប់មេរៀន)',
    subject: 'health' as const,
    subjectName: 'អប់រំសុខភាព',
    subjectIcon: '🏥',
    grade: 'ថ្នាក់ទី៦',
    category: 'quick' as const,
    categoryLabel: 'វិញ្ញាសារួម (៤០ សំណួរ)',
    durationMinutes: 60,
    totalPoints: 40,
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-300',
    questions: HEALTH_EDUCATION_40_QUESTIONS.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      explanation: q.explanation,
      points: q.points || 1,
    })),
  },
  // English Grade 6 - 40 Questions MoEYS Exam (QCM, True/False, Grammar, Fill in the blanks)
  {
    id: 'exam-english-40q',
    title: 'វិញ្ញាសាភាសាអង់គ្លេស ថ្នាក់ទី៦ (៤០ សំណួរពេញលេញ MoEYS)',
    subject: 'english' as const,
    subjectName: 'ភាសាអង់គ្លេស',
    subjectIcon: '🔤',
    grade: 'ថ្នាក់ទី៦',
    category: 'quick' as const,
    categoryLabel: '៤០ សំណួរ QCM & Grammar',
    durationMinutes: 60,
    totalPoints: 40,
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
    questions: ENGLISH_40_EXAM_QUESTIONS.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      explanation: q.explanation,
      points: q.points || 1,
    })),
  },
  // Math - Lessons 1 to 20 QCM (40 Questions each)
  ...ALL_MATH_LESSONS_PACKAGES.map((pkg) => ({
    id: `exam-math-lesson${pkg.lessonNumber}-40q`,
    title: `វិញ្ញាសា QCM ៤០ សំណួរ ៖ គណិតវិទ្យា ${pkg.title}`,
    subject: 'math' as const,
    subjectName: 'គណិតវិទ្យា',
    subjectIcon: '📐',
    grade: 'ថ្នាក់ទី៦',
    category: 'quick' as const,
    categoryLabel: `${pkg.shortTitle} (៤០ សំណួរ)`,
    durationMinutes: 60,
    totalPoints: 40,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    questions: pkg.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      explanation: q.explanation,
      points: q.points || 1,
    })),
  })),
  // 1. Math - Semester 1
  {
    id: 'exam-math-s1',
    title: 'វិញ្ញាសាគណិតវិទ្យា ឆមាសទី១ (ថ្នាក់ទី៦)',
    subject: 'math',
    subjectName: 'គណិតវិទ្យា',
    subjectIcon: '📐',
    grade: 'ថ្នាក់ទី៦',
    category: 'semester1',
    categoryLabel: 'ប្រឡងឆមាសទី១',
    durationMinutes: 45,
    totalPoints: 20,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    questions: [
      {
        id: 1,
        question: 'ចូររកផលបូក ៖ ៣៤,៥ + ១២,៧៥ = ?',
        options: [
          { text: '៤៧,២៥', isCorrect: true },
          { text: '៤៦,២៥', isCorrect: false },
          { text: '៤៧,៥', isCorrect: false },
          { text: '៤៦,៧៥', isCorrect: false },
        ],
        explanation: '៣៤,៥០ + ១២,៧៥ = ៤៧,២៥ (ដាក់ក្បៀសឱ្យត្រូវជួរគ្នា)',
        points: 4,
      },
      {
        id: 2,
        question: 'ចតុកោណកែងមួយមានបណ្តោយ ៨ម និងទទឹង ៥ម។ តើផ្ទៃក្រឡារបស់វាស្មើប៉ុន្មាន?',
        options: [
          { text: '២៦ ម²', isCorrect: false },
          { text: '៤០ ម²', isCorrect: true },
          { text: '១៣ ម²', isCorrect: false },
          { text: '៨០ ម²', isCorrect: false },
        ],
        explanation: 'ផ្ទៃក្រឡាចតុកោណកែង = បណ្តោយ × ទទឹង = ៨ × ៥ = ៤០ ម²',
        points: 4,
      },
      {
        id: 3,
        question: 'ចូរកំណត់ប្រភាគសមមូលនៃ ២/៥ ដែលមានភាគបែង ២០ ៖',
        options: [
          { text: '៤/២០', isCorrect: false },
          { text: '៦/២០', isCorrect: false },
          { text: '៨/២០', isCorrect: true },
          { text: '១០/២០', isCorrect: false },
        ],
        explanation: 'គុណភាគយក និងភាគបែងនឹង ៤ ៖ (២×៤)/(៥×៤) = ៨/២០',
        points: 4,
      },
      {
        id: 4,
        question: 'រថយន្តមួយបើកបរបានចម្ងាយ ១២០ គ.ម ក្នុងរយៈពេល ២ ម៉ោង។ តើល្បឿនមធ្យមនៃរថយន្តស្មើប៉ុន្មាន?',
        options: [
          { text: '៦០ គ.ម/ម៉', isCorrect: true },
          { text: '៥០ គ.ម/ម៉', isCorrect: false },
          { text: '២៤០ គ.ម/ម៉', isCorrect: false },
          { text: '៧០ គ.ម/ម៉', isCorrect: false },
        ],
        explanation: 'ល្បឿន (V) = ចម្ងាយ (S) ÷ ពេលវេលា (T) = ១២០ ÷ ២ = ៦០ គ.ម/ម៉ោង',
        points: 4,
      },
      {
        id: 5,
        question: 'តម្លៃនៃ ២៥% នៃ ៤០០ ស្មើនឹង ៖',
        options: [
          { text: '៥០', isCorrect: false },
          { text: '១០០', isCorrect: true },
          { text: '១៥០', isCorrect: false },
          { text: '២០០', isCorrect: false },
        ],
        explanation: '២៥% នៃ ៤០០ = (២៥ × ៤០០) ÷ ១០០ = ១០០',
        points: 4,
      },
    ],
  },

  // 2. Khmer - Grammar & Vocabulary
  {
    id: 'exam-khmer-s1',
    title: 'វិញ្ញាសាភាសាខ្មែរ (អក្សរសាស្ត្រ & វេយ្យាករណ៍)',
    subject: 'khmer',
    subjectName: 'ភាសាខ្មែរ',
    subjectIcon: '📖',
    grade: 'ថ្នាក់ទី៦',
    category: 'semester1',
    categoryLabel: 'ប្រឡងឆមាសទី១',
    durationMinutes: 45,
    totalPoints: 20,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    questions: [
      {
        id: 1,
        question: 'នៅក្នុងល្បះ «សិស្សខិតខំរៀនសូត្រដើម្បីអនាគតភ្លឺស្វាង» តើពាក្យ «ខិតខំ» ជាថ្នាក់ពាក្យអ្វី?',
        options: [
          { text: 'នាមសព្ទ', isCorrect: false },
          { text: 'កិរិយាសព្ទ', isCorrect: true },
          { text: 'គុណនាម', isCorrect: false },
          { text: 'គុណកិរិយា', isCorrect: false },
        ],
        explanation: '«ខិតខំ» បង្ហាញពីសកម្មភាពប្រឹងប្រែង ដូច្នេះវាជាកិរិយាសព្ទ។',
        points: 4,
      },
      {
        id: 2,
        question: 'តើពាក្យណាជា «នាមសាធារណ៍» (Common Noun)?',
        options: [
          { text: 'ភ្នំពេញ', isCorrect: false },
          { text: 'ទន្លេមេគង្គ', isCorrect: false },
          { text: 'សាលារៀន', isCorrect: true },
          { text: 'អង្គរវត្ត', isCorrect: false },
        ],
        explanation: '«សាលារៀន» ជានាមទូទៅ មិនសំដៅលើទីកន្លែងណាមួយជាក់លាក់ឡើយ។',
        points: 4,
      },
      {
        id: 3,
        question: 'តើពាក្យផ្ទុយនៃពាក្យ «ឧស្សាហ៍» គឺអ្វី?',
        options: [
          { text: 'ឆ្លាតវៃ', isCorrect: false },
          { text: 'ខ្ជិលច្រអូស', isCorrect: true },
          { text: 'រួសរាយ', isCorrect: false },
          { text: 'ស្មោះត្រង់', isCorrect: false },
        ],
        explanation: 'ឧស្សាហ៍ (ព្យាយាម) មានន័យផ្ទុយនឹង ខ្ជិលច្រអូស។',
        points: 4,
      },
      {
        id: 4,
        question: 'តើព្យញ្ជនៈខ្មែរទាំងអស់មានចំនួនប៉ុន្មានតួ?',
        options: [
          { text: '៣១ តួ', isCorrect: false },
          { text: '៣២ តួ', isCorrect: false },
          { text: '៣៣ តួ', isCorrect: true },
          { text: '៣៤ តួ', isCorrect: false },
        ],
        explanation: 'ព្យញ្ជនៈខ្មែរមាន ៣៣ តួ (ក ដល់ អ) ចែកជាពួក អ និងពួក អ៊។',
        points: 4,
      },
      {
        id: 5,
        question: 'តើសញ្ញាខណ្ឌ ( ៕ ) ប្រើប្រាស់សម្រាប់អ្វី?',
        options: [
          { text: 'សម្រាប់សួរដេញដោល', isCorrect: false },
          { text: 'សម្រាប់បញ្ចប់ល្បះ ឬកថាខណ្ឌទាំងស្រុង', isCorrect: true },
          { text: 'សម្រាប់កាត់ឃ្លាខ្លីៗ', isCorrect: false },
          { text: 'សម្រាប់ស្រង់សម្តីអ្នកដទៃ', isCorrect: false },
        ],
        explanation: 'សញ្ញាខណ្ឌ ( ៕ ) ប្រើនៅចុងបញ្ចប់នៃល្បះបរិបូណ៌ ឬកថាខណ្ឌ។',
        points: 4,
      },
    ],
  },

  // 3. Science - Comprehensive Grade 6
  {
    id: 'exam-science-s1',
    title: 'វិញ្ញាសាវិទ្យាសាស្ត្រ និងបរិស្ថាន (ថ្នាក់ទី៦)',
    subject: 'science',
    subjectName: 'វិទ្យាសាស្ត្រ',
    subjectIcon: '🔬',
    grade: 'ថ្នាក់ទី៦',
    category: 'semester1',
    categoryLabel: 'ប្រឡងឆមាសទី១',
    durationMinutes: 40,
    totalPoints: 20,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    questions: [
      {
        id: 1,
        question: 'តើរុក្ខជាតិបៃតងផលិតអាហារដោយខ្លួនឯងតាមរយៈដំណើរអ្វី?',
        options: [
          { text: 'រស្មីសំយោគ (Photosynthesis)', isCorrect: true },
          { text: 'ការដកដង្ហើម (Respiration)', isCorrect: false },
          { text: 'ការរលាយ (Dissolution)', isCorrect: false },
          { text: 'ការចំហាយទឹក (Transpiration)', isCorrect: false },
        ],
        explanation: 'រុក្ខជាតិបៃតងប្រើពន្លឺព្រះអាទិត្យ ទឹក និងឧស្ម័នកាបូនិច ដើម្បីធ្វើរស្មីសំយោគ។',
        points: 4,
      },
      {
        id: 2,
        question: 'តើសរីរាង្គណាខ្លះជាផ្នែកនៃប្រព័ន្ធដង្ហើមរបស់មនុស្ស?',
        options: [
          { text: 'បេះដូង និងសរសៃឈាម', isCorrect: false },
          { text: 'ច្រមុះ បំពង់ខ្យល់ និងសួត', isCorrect: true },
          { text: 'ក្រពះ និងពោះវៀន', isCorrect: false },
          { text: 'តម្រងនោម និងប្លោកនោម', isCorrect: false },
        ],
        explanation: 'ប្រព័ន្ធដង្ហើមរួមមាន ច្រមុះ បំពង់ក បំពង់ខ្យល់ និងសួតទាំងសងខាង។',
        points: 4,
      },
      {
        id: 3,
        question: 'តើប្រភពថាមពលណាជា «ថាមពលកកើតឡើងវិញ» (Renewable Energy)?',
        options: [
          { text: 'ប្រេងកាត', isCorrect: false },
          { text: 'ធ្យូងថ្ម', isCorrect: false },
          { text: 'ពន្លឺព្រះអាទិត្យ និងខ្យល់', isCorrect: true },
          { text: 'ឧស្ម័នធម្មជាតិ', isCorrect: false },
        ],
        explanation: 'ពន្លឺព្រះអាទិត្យ ខ្យល់ និងទឹក ជាថាមពលស្អាត និងកកើតឡើងវិញមិនចេះរីងស្ងួត។',
        points: 4,
      },
      {
        id: 4,
        question: 'តើទឹកប្រែប្រួលពីសភាពរាវទៅជាឧស្ម័ន (ចំហាយ) ហៅថាអ្វី?',
        options: [
          { text: 'ការកក', isCorrect: false },
          { text: 'ការរំពុះ / រំហួត', isCorrect: true },
          { text: 'ការរលាយ', isCorrect: false },
          { text: 'ការកករង', isCorrect: false },
        ],
        explanation: 'រំហួត ឬការរំពុះ ជាដំណើរដែលទឹករាវក្លាយជាចំហាយទឹក។',
        points: 4,
      },
      {
        id: 5,
        question: 'តើដែកឆក់ (Magnet) មានប៉ូលប៉ុន្មាន?',
        options: [
          { text: '១ ប៉ូល', isCorrect: false },
          { text: '២ ប៉ូល (ប៉ូលជើង និងប៉ូលត្បូង)', isCorrect: true },
          { text: '៣ ប៉ូល', isCorrect: false },
          { text: '៤ ប៉ូល', isCorrect: false },
        ],
        explanation: 'ដែកឆក់មាន ២ ប៉ូលជានិច្ច គឺប៉ូលជើង (N) និងប៉ូលត្បូង (S)។',
        points: 4,
      },
    ],
  },

  // 4. Social Studies - History & Geography
  {
    id: 'exam-social-s1',
    title: 'វិញ្ញាសាសិក្សាសង្គម (ប្រវត្តិវិទ្យា & ភូមិវិទ្យា)',
    subject: 'social',
    subjectName: 'សិក្សាសង្គម',
    subjectIcon: '🌏',
    grade: 'ថ្នាក់ទី៦',
    category: 'semester1',
    categoryLabel: 'ប្រឡងឆមាសទី១',
    durationMinutes: 40,
    totalPoints: 20,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    questions: [
      {
        id: 1,
        question: 'តើប្រាសាទអង្គរវត្តត្រូវបានកសាងឡើងក្នុងរជ្ជកាលព្រះមហាក្សត្រអង្គណា?',
        options: [
          { text: 'ព្រះបាទជ័យវរ្ម័នទី៧', isCorrect: false },
          { text: 'ព្រះបាទសូរ្យវរ្ម័នទី២', isCorrect: true },
          { text: 'ព្រះបាទជ័យវរ្ម័នទី២', isCorrect: false },
          { text: 'ព្រះបាទយសោវរ្ម័នទី១', isCorrect: false },
        ],
        explanation: 'ប្រាសាទអង្គរវត្តកសាងឡើងនៅដើមសតវត្សរ៍ទី១២ ដោយព្រះបាទសូរ្យវរ្ម័នទី២។',
        points: 4,
      },
      {
        id: 2,
        question: 'តើបឹងទន្លេសាបជាបឹងទឹកសាបធំបំផុតនៅក្នុងតំបន់ណា?',
        options: [
          { text: 'អាស៊ីអាគ្នេយ៍', isCorrect: true },
          { text: 'អាស៊ីបូព៌ា', isCorrect: false },
          { text: 'អាស៊ីខាងត្បូង', isCorrect: false },
          { text: 'អឺរ៉ុប', isCorrect: false },
        ],
        explanation: 'បឹងទន្លេសាបជាបឹងទឹកសាបធម្មជាតិធំជាងគេបង្អស់នៅអាស៊ីអាគ្នេយ៍។',
        points: 4,
      },
      {
        id: 3,
        question: 'តើទង់ជាតិកម្ពុជាមានពណ៌អ្វីខ្លះ?',
        options: [
          { text: 'ក្រហម និងស', isCorrect: false },
          { text: 'ខៀវ ក្រហម និងស (រូបប្រាសាទអង្គរវត្ត)', isCorrect: true },
          { text: 'លឿង ខៀវ និងក្រហម', isCorrect: false },
          { text: 'បៃតង និងក្រហម', isCorrect: false },
        ],
        explanation: 'ទង់ជាតិកម្ពុជាមានពណ៌ខៀវ (សេរីភាព/ក្សត្រ), ក្រហម (ជាតិ/ក្លាហាន), និងស (សាសនា)។',
        points: 4,
      },
      {
        id: 4,
        question: 'តើប្រទេសកម្ពុជាមានព្រំប្រទល់ជាប់ប្រទេសណាខ្លះ?',
        options: [
          { text: 'ថៃ ឡាវ និងវៀតណាម', isCorrect: true },
          { text: 'ថៃ មីយ៉ាន់ម៉ា និងម៉ាឡេស៊ី', isCorrect: false },
          { text: 'ឡាវ ចិន និងវៀតណាម', isCorrect: false },
          { text: 'ថៃ ឥណ្ឌូនេស៊ី និងហ្វីលីពីន', isCorrect: false },
        ],
        explanation: 'កម្ពុជាជាប់ប្រទេសថៃ (ខាងលិច/ពាយព្យ), ឡាវ (ខាងជើង), វៀតណាម (ខាងកើត/អាគ្នេយ៍)។',
        points: 4,
      },
      {
        id: 5,
        question: 'តើសិទ្ធិជាមូលដ្ឋានរបស់កុមារមានប៉ុន្មានប្រការ?',
        options: [
          { text: '២ ប្រការ', isCorrect: false },
          { text: '៣ ប្រការ', isCorrect: false },
          { text: '៤ ប្រការ (រស់រាន, ការពារ, អភិវឌ្ឍ, ចូលរួម)', isCorrect: true },
          { text: '៥ ប្រការ', isCorrect: false },
        ],
        explanation: 'សិទ្ធិកុមារមាន ៤ សំខាន់ ៖ សិទ្ធិរស់រានមានជីវិត, សិទ្ធិទទួលបានការការពារ, សិទ្ធិក្នុងការអភិវឌ្ឍ, និងសិទ្ធិចូលរួម។',
        points: 4,
      },
    ],
  },

  // 5. English - Grade 6 Basic
  {
    id: 'exam-english-s1',
    title: 'English Grade 6 Practice Test (Elementary)',
    subject: 'english',
    subjectName: 'ភាសាអង់គ្លេស',
    subjectIcon: '🔤',
    grade: 'ថ្នាក់ទី៦',
    category: 'monthly',
    categoryLabel: 'តេស្តប្រចាំខែ',
    durationMinutes: 30,
    totalPoints: 20,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    questions: [
      {
        id: 1,
        question: 'Choose the correct sentence:',
        options: [
          { text: 'She go to school every day.', isCorrect: false },
          { text: 'She goes to school every day.', isCorrect: true },
          { text: 'She going to school every day.', isCorrect: false },
          { text: 'She is go to school every day.', isCorrect: false },
        ],
        explanation: 'Subject "She" (singular 3rd person) takes verb + "es" (goes) in Present Simple.',
        points: 4,
      },
      {
        id: 2,
        question: 'What is the opposite of "Hot"?',
        options: [
          { text: 'Warm', isCorrect: false },
          { text: 'Cold', isCorrect: true },
          { text: 'Cool', isCorrect: false },
          { text: 'Sunny', isCorrect: false },
        ],
        explanation: 'The direct antonym of Hot is Cold.',
        points: 4,
      },
      {
        id: 3,
        question: 'Complete the sentence: "There _______ three books on the table."',
        options: [
          { text: 'is', isCorrect: false },
          { text: 'are', isCorrect: true },
          { text: 'am', isCorrect: false },
          { text: 'be', isCorrect: false },
        ],
        explanation: '"Three books" is plural, so we use "are".',
        points: 4,
      },
      {
        id: 4,
        question: 'Which word is a fruit?',
        options: [
          { text: 'Carrot', isCorrect: false },
          { text: 'Banana', isCorrect: true },
          { text: 'Cabbage', isCorrect: false },
          { text: 'Potato', isCorrect: false },
        ],
        explanation: 'Banana is a sweet fruit; the others are vegetables.',
        points: 4,
      },
      {
        id: 5,
        question: '"Thank you very much!" - What is the polite reply?',
        options: [
          { text: 'Goodbye!', isCorrect: false },
          { text: 'You are welcome!', isCorrect: true },
          { text: 'I am fine.', isCorrect: false },
          { text: 'No problem not.', isCorrect: false },
        ],
        explanation: 'The standard courteous reply to "Thank you" is "You are welcome!"',
        points: 4,
      },
    ],
  },
];

// Student Homework Tasks
export const BUILTIN_HOMEWORK_TASKS: HomeworkTask[] = [
  {
    id: 'hw-math-01',
    title: 'កិច្ចការផ្ទះគណិតវិទ្យា ៖ ប្រភាគ និងចំនួនទសភាគ',
    subject: 'គណិតវិទ្យា',
    subjectIcon: '📐',
    dueDate: 'ថ្ងៃស្អែក ម៉ោង ៧:០០ ព្រឹក',
    description: 'សូមគណនាលំហាត់ប្រភាគ និងចំនួនទសភាគខាងក្រោមឱ្យបានត្រឹមត្រូវ។',
    points: 10,
    questions: [
      {
        id: 1,
        question: 'គណនា ៖ ៣/៤ + ១/២ = ?',
        options: [
          { text: '៤/៦', isCorrect: false },
          { text: '៥/៤ ឬ ១ ១/៤', isCorrect: true },
          { text: '៣/៨', isCorrect: false },
          { text: '១/៤', isCorrect: false },
        ],
        points: 5,
        explanation: 'តម្រូវភាគបែងរួម ៤ ៖ ៣/៤ + ២/៤ = ៥/៤ = ១ ១/៤',
      },
      {
        id: 2,
        question: 'គណនា ៖ ០,៧៥ × ៤ = ?',
        options: [
          { text: '៣,០', isCorrect: true },
          { text: '២,៨', isCorrect: false },
          { text: '៣,២', isCorrect: false },
          { text: '០,៣', isCorrect: false },
        ],
        points: 5,
        explanation: '០,៧៥ × ៤ = ៣,០០ = ៣',
      },
    ],
  },
  {
    id: 'hw-khmer-01',
    title: 'កិច្ចការផ្ទះភាសាខ្មែរ ៖ វាក្យសព្ទ និងតែងល្បះ',
    subject: 'ភាសាខ្មែរ',
    subjectIcon: '📖',
    dueDate: 'ថ្ងៃសុក្រ ម៉ោង ៥:០០ ល្ងាច',
    description: 'ស្វែងយល់ពីអត្ថន័យពាក្យ និងការប្រើប្រាស់ល្បះក្នុងជីវភាពប្រចាំថ្ងៃ។',
    points: 10,
    questions: [
      {
        id: 1,
        question: 'តើពាក្យ «គារវភាព» មានន័យដូចម្តេច?',
        options: [
          { text: 'ភាពក្លាហាន', isCorrect: false },
          { text: 'ការគោរព និងដឹងគុណ', isCorrect: true },
          { text: 'ភាពខ្ជិលច្រអូស', isCorrect: false },
          { text: 'ការប្រញាប់ប្រញាល់', isCorrect: false },
        ],
        points: 5,
        explanation: 'គារវភាព មានន័យថា សេចក្តីគោរព ឬការសម្តែងការគោរព។',
      },
      {
        id: 2,
        question: 'តើពាក្យណាជា «គុណនាម» (Adjective)?',
        options: [
          { text: 'ដើរ', isCorrect: false },
          { text: 'ស្រស់ស្អាត', isCorrect: true },
          { text: 'សៀវភៅ', isCorrect: false },
          { text: 'សរសេរ', isCorrect: false },
        ],
        points: 5,
        explanation: '«ស្រស់ស្អាត» បង្ហាញពីលក្ខណៈសម្បត្តិ ដូច្នេះជាគុណនាម។',
      },
    ],
  },
  {
    id: 'hw-science-01',
    title: 'កិច្ចការផ្ទះវិទ្យាសាស្ត្រ ៖ បរិស្ថាន និងប្រព័ន្ធអេកូឡូស៊ី',
    subject: 'វិទ្យាសាស្ត្រ',
    subjectIcon: '🌱',
    dueDate: 'ថ្ងៃចន្ទ ម៉ោង ៧:០០ ព្រឹក',
    description: 'លំហាត់ស្រាវជ្រាវអំពីការការពារបរិស្ថាន និងការដាំដើមឈើ។',
    points: 10,
    questions: [
      {
        id: 1,
        question: 'តើដើមឈើស្រូបយកឧស្ម័នអ្វី និងបញ្ចេញឧស្ម័នអ្វីនៅពេលថ្ងៃ?',
        options: [
          { text: 'ស្រូបកាបូនិច (CO2) និងបញ្ចេញអុកស៊ីសែន (O2)', isCorrect: true },
          { text: 'ស្រូបអុកស៊ីសែន និងបញ្ចេញកាបូនិច', isCorrect: false },
          { text: 'ស្រូបអាសូត និងបញ្ចេញអ៊ីដ្រូសែន', isCorrect: false },
          { text: 'មិនស្រូបឧស្ម័នអ្វីទេ', isCorrect: false },
        ],
        points: 5,
        explanation: 'ពេលធ្វើរស្មីសំយោគ រុក្ខជាតិស្រូបយកកាបូនិច និងបញ្ចេញអុកស៊ីសែនផ្តល់ជីវិត។',
      },
      {
        id: 2,
        question: 'តើការបោះសំរាមប្លាស្ទិកពាសវាលពាសកាលបណ្តាលឱ្យមានផលប៉ះពាល់អ្វី?',
        options: [
          { text: 'ដីមានជីជាតិល្អជាងមុន', isCorrect: false },
          { text: 'បំពុលដី ទឹក និងសម្លាប់សត្វព្រៃ/មច្ឆាជាតិ', isCorrect: true },
          { text: 'ធ្វើឱ្យអាកាសធាតុត្រជាក់', isCorrect: false },
          { text: 'គ្មានផលប៉ះពាល់អ្វីទេ', isCorrect: false },
        ],
        points: 5,
        explanation: 'ប្លាស្ទិកត្រូវការពេលរាប់រយឆ្នាំដើម្បីរលាយ និងបំពុលបរិស្ថានយ៉ាងធ្ងន់ធ្ងរ។',
      },
    ],
  },
];

// Grade 6 Key Formulas Reference
export const GRADE_6_FORMULAS: FormulaItem[] = [
  {
    id: 'f-square',
    subject: 'គណិតវិទ្យា',
    topic: 'ការ៉េ (Square)',
    formula: 'ផ្ទៃក្រឡា S = ជ្រុង × ជ្រុង (a × a) | បរិមាត្រ P = ជ្រុង × ៤',
    explanation: 'ការ៉េមានជ្រុងទាំង ៤ ស្មើគ្នា និងមុំកែងទាំង ៤។',
    example: 'ការ៉េមានជ្រុង ៥ស.ម ៖ S = ៥ × ៥ = ២៥ ស.ម², P = ៥ × ៤ = ២០ ស.ម',
  },
  {
    id: 'f-rect',
    subject: 'គណិតវិទ្យា',
    topic: 'ចតុកោណកែង (Rectangle)',
    formula: 'ផ្ទៃក្រឡា S = បណ្តោយ (L) × ទទឹង (w) | បរិមាត្រ P = (L + w) × ២',
    explanation: 'ចតុកោណកែងមានជ្រុងឈមស្មើគ្នាពីរៗ និងមុំកែងទាំង ៤។',
    example: 'បណ្តោយ ៨ម, ទទឹង ៤ម ៖ S = ៨ × ៤ = ៣២ ម², P = (៨ + ៤) × ២ = ២៤ ម',
  },
  {
    id: 'f-triangle',
    subject: 'គណិតវិទ្យា',
    topic: 'ត្រីកោណ (Triangle)',
    formula: 'ផ្ទៃក្រឡា S = (បាត b × កម្ពស់ h) ÷ ២',
    explanation: 'ផ្ទៃក្រឡាត្រីកោណស្មើពាក់កណ្តាលនៃផលគុណបាតនិងកម្ពស់។',
    example: 'បាត ១០ស.ម, កម្ពស់ ៦ស.ម ៖ S = (១០ × ៦) ÷ ២ = ៣០ ស.ម²',
  },
  {
    id: 'f-circle',
    subject: 'គណិតវិទ្យា',
    topic: 'រង្វង់ (Circle)',
    formula: 'បរិមាត្រ C = អង្កត់ផ្ចិត d × ៣,១៤ (ឬ ២ × π × r) | ផ្ទៃក្រឡា S = r × r × ៣,១៤',
    explanation: 'π (ពី) មានតម្លៃប្រហែល ៣,១៤ ឬ ២២/៧។',
    example: 'កាំ r = ៧ស.ម ៖ S = ៧ × ៧ × ៣,១៤ = ១៥៣,៨៦ ស.ម²',
  },
  {
    id: 'f-speed',
    subject: 'គណិតវិទ្យា',
    topic: 'ចម្ងាយ ល្បឿន និងពេល (Speed, Distance, Time)',
    formula: 'ល្បឿន V = S ÷ T | ចម្ងាយ S = V × T | ពេលវេលា T = S ÷ V',
    explanation: 'S គិតជា (គ.ម), T គិតជា (ម៉ោង), V គិតជា (គ.ម/ម៉ោង)។',
    example: 'ចម្ងាយ ១៥០ គ.ម ក្នុងពេល ៣ ម៉ោង ៖ V = ១៥០ ÷ ៣ = ៥០ គ.ម/ម៉ោង',
  },
  {
    id: 'f-percentage',
    subject: 'គណិតវិទ្យា',
    topic: 'ភាគរយ (Percentage)',
    formula: 'តម្លៃភាគរយ = (ចំនួនសរុប × អត្រាភាគរយ) ÷ ១០០',
    explanation: 'ការគណនាបញ្ចុះតម្លៃ ការប្រាក់ ឬពិន្ទុភាគរយ។',
    example: '២០% នៃ ៥០០០ រៀល = (៥០០០ × ២០) ÷ ១០០ = ១០០០ រៀល',
  },
];

export interface SubjectLessonSummary {
  id: string;
  subjectKey: 'khmer' | 'math' | 'science' | 'social' | 'english' | 'health';
  title: string;
  badgeLabel: string;
  description: string;
  lessonsCount: number;
  qcmCount: number;
  icon: string;
  themeColor: {
    bgGradient: string;
    border: string;
    pillBg: string;
    accent: string;
    buttonGradient: string;
  };
  chapters: {
    title: string;
    keyPoints: string[];
    vocabulary?: { word: string; meaning: string }[];
    practiceQuestions: {
      question: string;
      options: string[];
      answerIndex: number;
      explanation: string;
    }[];
  }[];
}

export const GRADE_6_SUBJECT_SUMMARIES: SubjectLessonSummary[] = [
  {
    id: 'sum-khmer',
    subjectKey: 'khmer',
    title: 'មេរៀនសង្ខេប: ភាសាខ្មែរ',
    badgeLabel: 'មេរៀនសង្ខេប',
    description: 'អត្ថបទស្តាប់ (១០មេរៀន), វេយ្យាករណ៍, វិធីសាស្ត្រតែងសេចក្តី និងបទានុក្រម',
    lessonsCount: 35,
    qcmCount: 294,
    icon: '📘',
    themeColor: {
      bgGradient: 'from-[#162347] to-[#0f172a]',
      border: 'border-indigo-500/40',
      pillBg: 'bg-blue-600/40 text-blue-300 border-blue-400/40',
      accent: 'text-indigo-400',
      buttonGradient: 'from-amber-500 to-orange-500 text-slate-950',
    },
    chapters: [
      {
        title: 'ជំពូកទី១ ៖ អត្ថបទអំណាន និងការស្តាប់យល់',
        keyPoints: [
          'ការចាប់គំនិតសំខាន់ក្នុងអត្ថបទ និងប្រធានបទរឿង',
          'ការវិភាគតួអង្គ អាកប្បកិរិយា និងតម្លៃអប់រំនៃរឿងនិទានខ្មែរ',
          'ការសង្ខេបអត្ថបទដោយប្រើពាក្យសម្តីផ្ទាល់ខ្លួនឱ្យខ្លី ខ្លឹម និងត្រឹមត្រូវ',
        ],
        vocabulary: [
          { word: 'ឧត្តមគតិ', meaning: 'គំនិតដ៏ខ្ពង់ខ្ពស់ ឬគោលបំណងដ៏ថ្លៃថ្លាក្នុងជីវិត' },
          { word: 'អំណត់ព្យាយាម', meaning: 'ការអត់ធន់ មិនរាថយចំពោះឧបសគ្គ' },
          { word: 'សាមគ្គីភាព', meaning: 'ការរួបរួមចិត្តគំនិត និងកម្លាំងគ្នាជាធ្លុងមួយ' },
        ],
        practiceQuestions: [
          {
            question: 'តើគោលបំណងចម្បងនៃការអានអត្ថបទសង្ខេបគឺអ្វី?',
            options: ['ដើម្បីទន្ទេញចាំគ្រប់ពាក្យ', 'ដើម្បីក្តាប់បានគំនិតសំខាន់ និងខ្លឹមសារស្នូល', 'ដើម្បីអានឱ្យបានលឿនជាងគេ', 'ដើម្បីរាប់ចំនួនពាក្យ'],
            answerIndex: 1,
            explanation: 'ការអានសង្ខេបជួយឱ្យយើងក្តាប់បានគំនិតសំខាន់ៗយ៉ាងឆាប់រហ័ស។',
          },
        ],
      },
      {
        title: 'ជំពូកទី២ ៖ វេយ្យាករណ៍ និងការប្រើប្រាស់ពាក្យ',
        keyPoints: [
          'ថ្នាក់ពាក្យ ៖ នាម កិរិយាសព្ទ គុណនាម គុណកិរិយា និងធ្នាក់',
          'កន្សោមនាម និងកន្សោមកិរិយាក្នុងល្បះទោល និងល្បះផ្សំ',
          'សទិសន័យ (ពាក្យន័យដូច) និងបដិសព្ទ (ពាក្យន័យផ្ទុយ)',
        ],
        vocabulary: [
          { word: 'ល្បះទោល', meaning: 'ល្បះដែលមានប្រធានមួយ និងកិរិយាមួយគត់' },
          { word: 'គុណនាម', meaning: 'ពាក្យសម្រាប់បញ្ជាក់លក្ខណៈរបស់នាម' },
        ],
        practiceQuestions: [
          {
            question: 'ក្នុងល្បះ «កុមារាឧស្សាហ៍រៀនសូត្រ» តើពាក្យណាជាគុណនាម?',
            options: ['កុមារា', 'ឧស្សាហ៍', 'រៀន', 'សូត្រ'],
            answerIndex: 1,
            explanation: '«ឧស្សាហ៍» ជាគុណនាមបញ្ជាក់លក្ខណៈឱ្យកុមារា។',
          },
        ],
      },
      {
        title: 'ជំពូកទី៣ ៖ វិធីសាស្ត្រតែងសេចក្តី (ពណ៌នា និងពន្យល់)',
        keyPoints: [
          'រចនាសម្ព័ន្ធតែងសេចក្តី ៣ ផ្នែក ៖ ផ្តើមសេចក្តី តួសេចក្តី និងបញ្ចប់សេចក្តី',
          'ការប្រើពាក្យភ្ជាប់សេចក្តី ៖ ម៉្យាងទៀត លើសពីនេះទៅទៀត ជារួមមក...',
          'ការរក្សាអក្ខរាវិរុទ្ធ និងការប្រើសញ្ញាវណ្ណយុត្តិឱ្យបានត្រឹមត្រូវ',
        ],
        practiceQuestions: [
          {
            question: 'តើផ្នែកណាដែលធ្វើការពន្យល់លម្អិត និងលើកឧទាហរណ៍ក្នុងតែងសេចក្តី?',
            options: ['ផ្តើមសេចក្តី', 'តួសេចក្តី', 'បញ្ចប់សេចក្តី', 'ចំណងជើង'],
            answerIndex: 1,
            explanation: 'តួសេចក្តីជាកន្លែងលាតត្រដាងគំនិត និងឧទាហរណ៍ជាក់ស្តែង។',
          },
        ],
      },
    ],
  },
  {
    id: 'sum-math',
    subjectKey: 'math',
    title: 'មេរៀនសង្ខេប: គណិតវិទ្យា',
    badgeLabel: 'មេរៀនសង្ខេប',
    description: 'លេខគណនា, ប្រភាគ, ទសភាគ, ធរណីមាត្រ, រូបមន្តផ្ទៃក្រឡា និងមាឌ',
    lessonsCount: 20,
    qcmCount: 180,
    icon: '📐',
    themeColor: {
      bgGradient: 'from-[#0e3328] to-[#082019]',
      border: 'border-emerald-500/40',
      pillBg: 'bg-emerald-600/40 text-emerald-300 border-emerald-400/40',
      accent: 'text-emerald-400',
      buttonGradient: 'from-amber-500 to-orange-500 text-slate-950',
    },
    chapters: [
      {
        title: 'មេរៀនទី១ ៖ ចំនួន (អំណាន សំណេរ តម្លៃលេខ ប្រៀបធៀប & បង្គត់)',
        keyPoints: [
          'អំណាន និងសំណេរចំនួន ៖ ថ្នាក់លាន ថ្នាក់ពាន់ និងថ្នាក់ឯកតា (អានតាមខ្ទង់ និងអានតាមថ្នាក់)',
          'ខ្ទង់ និងតម្លៃលេខតាមខ្ទង់ ៖ ការរាប់គ្រាប់ក្បាច់ និងការសរសេរជាទម្រង់ពង្រាយ',
          'ការប្រៀបធៀប និងរៀបលំដាប់ ៖ ប្រៀបធៀបពីឆ្វេងទៅស្តាំ (ខ្ទង់ខ្ពស់មុន) និងរៀបពីតូចទៅធំ/ធំទៅតូច',
          'ការបង្គត់ចំនួន ៖ មើលខ្ទង់បន្ទាប់ (០-៤ បង្គត់ចុះ, ៥-៩ បង្គត់ឡើង ផ្ទៀងផ្ទាត់លើបន្ទាត់ចំនួន)',
        ],
        vocabulary: [
          { word: 'ថ្នាក់ (Class/Period)', meaning: 'បណ្តុំនៃ ៣ ខ្ទង់រួមគ្នា (ថ្នាក់ឯកតា, ថ្នាក់ពាន់, ថ្នាក់លាន)' },
          { word: 'ទម្រង់ពង្រាយ', meaning: 'ការសរសេរចំនួនជាផលបូកនៃតម្លៃលេខតាមខ្ទង់នីមួយៗ' },
          { word: 'ការបង្គត់ចំនួន', meaning: 'ការរកតម្លៃប្រហែលដែលនៅជិតបំផុត ដើម្បីងាយស្រួលប៉ាន់ស្មាន' },
        ],
        practiceQuestions: [
          {
            question: 'តើចំនួន 870 465 250 អានតាមថ្នាក់យ៉ាងដូចម្តេច?',
            options: [
              'ប្រាំបីរយចិតសិបលាន បួនសែនប្រាំមួយម៉ឺនប្រាំពាន់ ពីររយហាសិប',
              'ប្រាំបីរយចិតសិបលាន បួនរយហុកសិបប្រាំពាន់ ពីររយហាសិប',
              'ប្រាំបីពាន់លាន បួនរយហុកសិបប្រាំពាន់ ពីររយហាសិប',
              'ប៉ែតសិបប្រាំពីរលាន បួនរយហុកសិបប្រាំពាន់ ម្ភៃប្រាំ',
            ],
            answerIndex: 1,
            explanation: 'អានតាមថ្នាក់ គឺអានបណ្តុំថ្នាក់លាន (៨៧០លាន) ថ្នាក់ពាន់ (៤៦៥ពាន់) និងថ្នាក់ឯកតា (២៥០)។',
          },
          {
            question: 'ក្នុងចំនួន 80 250 346 តើលេខ 8 នៅខ្ទង់អ្វី ហើយមានតម្លៃស្មើប៉ុន្មាន?',
            options: [
              'នៅខ្ទង់លាន មានតម្លៃ 8 000 000',
              'នៅខ្ទង់ដប់លាន មានតម្លៃ 80 000 000',
              'នៅខ្ទង់រយលាន មានតម្លៃ 800 000 000',
              'នៅខ្ទង់សែន មានតម្លៃ 800 000',
            ],
            answerIndex: 1,
            explanation: 'លេខ 8 ស្ថិតនៅខ្ទង់ដប់លាន ដូច្នេះមានតម្លៃ 8 × 10 000 000 = 80 000 000។',
          },
          {
            question: 'ប្រទេសកម្ពុជាមានប្រជាជន 13 395 682 នាក់។ បើបង្គត់ត្រឹមខ្ទង់លាន តើបានចំនួនប៉ុន្មាន?',
            options: ['14 000 000 នាក់', '13 000 000 នាក់', '13 400 000 នាក់', '13 390 000 នាក់'],
            answerIndex: 1,
            explanation: 'ខ្ទង់លានជាលេខ 3 ហើយខ្ទង់បន្ទាប់ខាងស្តាំ (ខ្ទង់សែន) ជាលេខ 3 (< 5) ដូច្នេះត្រូវបង្គត់ចុះទៅ 13 000 000 នាក់។',
          },
          {
            question: 'ប្រទេសកម្ពុជាមានផ្ទៃក្រឡា 181 035 km²។ បើបង្គត់ត្រឹមខ្ទង់ម៉ឺន តើបានចំនួនប៉ុន្មាន?',
            options: ['190 000 km²', '180 000 km²', '181 000 km²', '200 000 km²'],
            answerIndex: 1,
            explanation: 'ខ្ទង់ម៉ឺនជាលេខ 8 ហើយខ្ទង់បន្ទាប់ខាងស្តាំ (ខ្ទង់ពាន់) ជាលេខ 1 (< 5) ដូច្នេះត្រូវបង្គត់ចុះទៅ 180 000 km²។',
          },
        ],
      },
      {
        title: 'ជំពូកទី២ ៖ ប្រភាគ និងចំនួនទសភាគ',
        keyPoints: [
          'ប្រមាណវិធីបូក ដក គុណ ចែកប្រភាគ និងការសម្រួលប្រភាគ',
          'ការបំប្លែងប្រភាគទៅជាចំនួនទសភាគ និងភាគរយ',
          'ការប្រៀបធៀប និងតម្រៀបលំដាប់ប្រភាគមិនស្មើភាគបែង',
        ],
        practiceQuestions: [
          {
            question: '៣/៤ បូក ១/២ ស្មើនឹងប៉ុន្មាន?',
            options: ['៤/៦', '៥/៤ ឬ ១ ១/៤', '៣/៨', '៤/៤'],
            answerIndex: 1,
            explanation: '៣/៤ + ២/៤ = ៥/៤ (តម្រូវភាគបែងរួម ៤)',
          },
        ],
      },
      {
        title: 'ជំពូកទី២ ៖ ធរណីមាត្រ រូបមន្តបរិមាត្រ និងផ្ទៃក្រឡា',
        keyPoints: [
          'ការ៉េ ៖ S = a × a, P = ៤ × a',
          'ចតុកោណកែង ៖ S = L × w, P = (L + w) × ២',
          'ត្រីកោណ ៖ S = (b × h) ÷ ២',
          'រង្វង់ ៖ C = d × ៣,១៤, S = r × r × ៣,១៤',
        ],
        practiceQuestions: [
          {
            question: 'ចតុកោណកែងមានបណ្តោយ ១០ម ទទឹង ៦ម។ តើផ្ទៃក្រឡាស្មើប៉ុន្មាន?',
            options: ['១៦ ម²', '៣២ ម²', '៦០ ម²', '១០០ ម²'],
            answerIndex: 2,
            explanation: 'S = L × w = ១០ × ៦ = ៦០ ម²',
          },
        ],
      },
      {
        title: 'ជំពូកទី៣ ៖ ចម្ងាយ ល្បឿន ពេលវេលា និងភាគរយ',
        keyPoints: [
          'រូបមន្តល្បឿន ៖ V = S ÷ T (ចម្ងាយ ÷ ពេលវេលា)',
          'រូបមន្តចម្ងាយ ៖ S = V × T',
          'ការគណនាភាគរយ ៖ (ចំនួនសរុប × អត្រា) ÷ ១០០',
        ],
        practiceQuestions: [
          {
            question: 'រថយន្តមួយធ្វើដំណើរបាន ១៨០ គ.ម ក្នុងពេល ៣ ម៉ោង។ រកល្បឿនមធ្យម ៖',
            options: ['៥០ គ.ម/ម៉ោង', '៦០ គ.ម/ម៉ោង', '៧០ គ.ម/ម៉ោង', '៩០ គ.ម/ម៉ោង'],
            answerIndex: 1,
            explanation: 'V = ១៨០ ÷ ៣ = ៦០ គ.ម/ម៉ោង',
          },
        ],
      },
    ],
  },
  {
    id: 'sum-science',
    subjectKey: 'science',
    title: 'មេរៀនសង្ខេប: វិទ្យាសាស្ត្រ',
    badgeLabel: 'មេរៀនសង្ខេប',
    description: 'ប្រព័ន្ធសរីរាង្គមនុស្ស, រុក្ខជាតិ, អគ្គិសនី, បរិស្ថាន និងចលនារូបវិទ្យា',
    lessonsCount: 24,
    qcmCount: 160,
    icon: '🔬',
    themeColor: {
      bgGradient: 'from-[#11313e] to-[#0a1e27]',
      border: 'border-cyan-500/40',
      pillBg: 'bg-cyan-600/40 text-cyan-300 border-cyan-400/40',
      accent: 'text-cyan-400',
      buttonGradient: 'from-amber-500 to-orange-500 text-slate-950',
    },
    chapters: [
      {
        title: 'មេរៀនទី១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ',
        keyPoints: [
          'ជម្រក ៖ កន្លែងដែលរុក្ខជាតិដុះលូតលាស់ (ក្នុងទឹក ព្រៃឈើ និងវាលខ្សាច់)',
          'ការពង្រាយគ្រាប់ ៤ យ៉ាង ៖ តាមខ្យល់ (គ្រាប់ស្រាលមានស្លាប), ចរន្តទឹក (អណ្តែតមិនជ្រាបទឹក), សត្វ (ស៊ីផ្លែ/ស្អិតរោម), និងមនុស្ស (សាបព្រោះ/ដាំដុះ)',
          'ការសម្របតាមជម្រក ៖ រុក្ខជាតិទឹក (ឫសខ្លី ដើមប្រហោង/ប៉ោង ស្លឹកធំ), វាលខ្សាច់ (ស្លឹកជាបន្លា ដើមស្តុកទឹក ឫសវែងចាក់ជ្រៅ)',
          'ការការពារខ្លួន ៖ ទប់ទល់សត្វ (បន្លា រោមរមាស់ ជាតិពុល), ទប់ទល់កម្ដៅ (ជម្រុះស្លឹក ខួរស្លឹក ក្រមួនលើស្លឹក)',
        ],
        vocabulary: [
          { word: 'ជម្រក', meaning: 'កន្លែងដែលរុក្ខជាតិដុះលូតលាស់' },
          { word: 'ការសម្របខ្លួន', meaning: 'ការប្រែប្រួលរាងកាយឬសរីរាង្គឱ្យស្របតាមបរិស្ថាន' },
          { word: 'ការពង្រាយគ្រាប់', meaning: 'ការនាំគ្រាប់ទៅកាន់ទីឆ្ងាយដើម្បីកុំឱ្យដុះប្រជ្រៀតគ្នា' },
          { word: 'រំហួតទឹក', meaning: 'ការភាយចំហាយទឹកចេញពីរុក្ខជាតិទៅក្នុងបរិយាកាស' },
        ],
        practiceQuestions: [
          {
            question: 'តើកន្លែងដែលរុក្ខជាតិដុះលូតលាស់ត្រូវបានហៅថាអ្វី?',
            options: ['ជម្រក', 'ជង្រុក', 'សម្បុក', 'កសិដ្ឋាន'],
            answerIndex: 0,
            explanation: 'ជម្រក ជាកន្លែងដែលរុក្ខជាតិដុះលូតលាស់។',
          },
          {
            question: 'តើភ្នាក់ងារទាំង ៤ ក្នុងការពង្រាយគ្រាប់រុក្ខជាតិរួមមានអ្វីខ្លះ?',
            options: ['ដី ភ្លើង ពន្លឺ និងជីធម្មជាតិ', 'មនុស្ស សត្វ ខ្យល់ និងចរន្តទឹក', 'សត្វល្អិត សំណើម ផ្សែង និងដី', 'ភ្លៀង ផ្គរ ម៉ាស៊ីន និងពន្លឺថ្ងៃ'],
            answerIndex: 1,
            explanation: 'មនុស្ស សត្វ ខ្យល់ និងចរន្តទឹក ជាភ្នាក់ងារពង្រាយគ្រាប់។',
          },
        ],
      },
      {
        title: 'ជំពូកទី១ ៖ ប្រព័ន្ធសរីរាង្គក្នុងរាងកាយមនុស្ស',
        keyPoints: [
          'ប្រព័ន្ធរំលាយអាហារ ៖ មាត់ បំពង់អាហារ ក្រពះ ពោះវៀនតូច និងពោះវៀនធំ',
          'ប្រព័ន្ធដង្ហើម ៖ ច្រមុះ បំពង់ខ្យល់ និងសួត (ការផ្លាស់ប្តូរឧស្ម័ន O2 និង CO2)',
          'ប្រព័ន្ធរបត់ឈាម ៖ បេះដូង សរសៃឈាម និងឈាម',
        ],
        practiceQuestions: [
          {
            question: 'តើសរីរាង្គណាទទួលខុសត្រូវស្រូបយកសារធាតុចិញ្ចឹមចូលទៅក្នុងចរន្តឈាមច្រើនជាងគេ?',
            options: ['ក្រពះ', 'ពោះវៀនតូច', 'ពោះវៀនធំ', 'ថ្លើម'],
            answerIndex: 1,
            explanation: 'ពោះវៀនតូចស្រូបយកសារធាតុចិញ្ចឹមស្ទើរតែទាំងអស់ចូលក្នុងឈាម។',
          },
        ],
      },
      {
        title: 'ជំពូកទី២ ៖ រុក្ខជាតិ និងការបន្តពូជ',
        keyPoints: [
          'ផ្នែករបស់ផ្កា ៖ ត្របកផ្កា ស្រទាប់ផ្កា កេសរឈ្មោល និងកេសរញី',
          'ដំណើរលម្អង ៖ ផ្ទេរលម្អងកេសរឈ្មោលទៅលើស្ទិចម៉ាតកេសរញី',
          'រស្មីសំយោគ ៖ ស្រូប CO2 និងទឹក ដោយមានពន្លឺព្រះអាទិត្យ បង្កើតគ្លុយកូស និង O2',
        ],
        practiceQuestions: [
          {
            question: 'តើដំណើរលម្អងផ្កាកើតឡើងដោយសារអ្វីខ្លះជួយចម្បង?',
            options: ['ខ្យល់ សត្វល្អិត (ឃ្មុំ មេអំបៅ) និងទឹក', 'តែពន្លឺព្រះអាទិត្យមួយមុខ', 'ដី និងជីជាតិ', 'សីតុណ្ហភាពត្រជាក់'],
            answerIndex: 0,
            explanation: 'ខ្យល់ និងសត្វល្អិតដូចជាឃ្មុំជាអ្នកនាំលម្អងផ្កាយ៉ាងសំខាន់។',
          },
        ],
      },
    ],
  },
  {
    id: 'sum-social',
    subjectKey: 'social',
    title: 'មេរៀនសង្ខេប: សិក្សាសង្គម',
    badgeLabel: 'មេរៀនសង្ខេប',
    description: 'ប្រវត្តិសាស្ត្រខ្មែរ, ភូមិវិទ្យា, សីលធម៌ពលរដ្ឋ និងវប្បធម៌ប្រពៃណី',
    lessonsCount: 28,
    qcmCount: 210,
    icon: '🏛️',
    themeColor: {
      bgGradient: 'from-[#331c29] to-[#1c0f17]',
      border: 'border-pink-500/40',
      pillBg: 'bg-pink-600/40 text-pink-300 border-pink-400/40',
      accent: 'text-pink-400',
      buttonGradient: 'from-amber-500 to-orange-500 text-slate-950',
    },
    chapters: [
      {
        title: 'ជំពូកទី១ ៖ ប្រវត្តិសាស្ត្រ និងសម័យអង្គរ',
        keyPoints: [
          'ព្រះបាទជ័យវរ្ម័នទី២ បានបង្រួបបង្រួមជាតិ និងស្ថាបនាអាណាចក្រអង្គរនៅឆ្នាំ ៨០២',
          'ព្រះបាទសូរ្យវរ្ម័នទី២ បានកសាងប្រាសាទអង្គរវត្តដ៏ល្បីល្បាញ',
          'ព្រះបាទជ័យវរ្ម័នទី៧ បានកសាងប្រាសាទបាយ័ន មន្ទីរពេទ្យ និងសាលាសំណាក់ទូទាំងប្រទេស',
        ],
        practiceQuestions: [
          {
            question: 'តើព្រះមហាក្សត្រអង្គណាបានកសាងប្រាសាទអង្គរវត្ត?',
            options: ['ព្រះបាទជ័យវរ្ម័នទី២', 'ព្រះបាទសូរ្យវរ្ម័នទី២', 'ព្រះបាទជ័យវរ្ម័នទី៧', 'ព្រះបាទយសោវរ្ម័នទី១'],
            answerIndex: 1,
            explanation: 'ព្រះបាទសូរ្យវរ្ម័នទី២ បានកសាងប្រាសាទអង្គរវត្តនៅដើមសតវត្សរ៍ទី១២។',
          },
        ],
      },
      {
        title: 'ជំពូកទី២ ៖ ភូមិវិទ្យា និងធនធានធម្មជាតិកម្ពុជា',
        keyPoints: [
          'ទន្លេមេគង្គ និងបឹងទន្លេសាបជាប្រភពទឹក និងមច្ឆាជាតិដ៏សំខាន់បំផុត',
          'អាកាសធាតុមូសុង ៖ រដូវប្រាំង (វិច្ឆិកា-មេសា) និងរដូវវស្សា (ឧសភា-តុលា)',
          'តំបន់ភូមិសាស្ត្រ ៤ ៖ តំបន់វាលរាប តំបន់បឹងទន្លេសាប តំបន់ឆ្នេរសមុទ្រ និងតំបន់ខ្ពង់រាប/ភ្នំ',
        ],
        practiceQuestions: [
          {
            question: 'តើបឹងទន្លេសាបស្ថិតក្នុងតំបន់ភូមិសាស្ត្រណា?',
            options: ['តំបន់ឆ្នេរសមុទ្រ', 'តំបន់បឹងទន្លេសាប', 'តំបន់ខ្ពង់រាប', 'តំបន់ភ្នំក្រវាញ'],
            answerIndex: 1,
            explanation: 'បឹងទន្លេសាបជាបឹងទឹកសាបធំជាងគេនៅអាស៊ីអាគ្នេយ៍។',
          },
        ],
      },
    ],
  },
  {
    id: 'sum-health',
    subjectKey: 'health',
    title: 'មេរៀនសង្ខេប: អប់រំសុខភាព',
    badgeLabel: 'មេរៀនសង្ខេប',
    description: 'អនាម័យខ្លួនប្រាណ, អាហារូបត្ថម្ភ៣ក្រុម, សុខភាពផ្លូវចិត្ត និងការសង្គ្រោះបឋម',
    lessonsCount: 16,
    qcmCount: 120,
    icon: '🏥',
    themeColor: {
      bgGradient: 'from-[#064e3b] to-[#022c22]',
      border: 'border-teal-500/40',
      pillBg: 'bg-teal-600/40 text-teal-300 border-teal-400/40',
      accent: 'text-teal-400',
      buttonGradient: 'from-amber-500 to-orange-500 text-slate-950',
    },
    chapters: [
      {
        title: 'ជំពូកទី១ ៖ អនាម័យបុគ្គល និងបរិស្ថានរស់នៅ',
        keyPoints: [
          'អនាម័យ ៣ ប្រការ ៖ ហូបស្អាត ផឹកស្អាត និងរស់នៅស្អាត',
          'ជំហានលាងសម្អាតដៃ ៧ ជំហានជាមួយសាប៊ូ និងទឹកស្អាត',
          'ការថែទាំធ្មេញ (ដុសធ្មេញយ៉ាងតិច ២ ដងក្នុងមួយថ្ងៃ) និងការថែទាំភ្នែក',
          'ការទុកដាក់សំរាមត្រឹមត្រូវ និងការការពារជំងឺឆ្លង (គ្រុនឈាម ផ្តាសាយ)',
        ],
        vocabulary: [
          { word: 'អនាម័យ', meaning: 'វិធានការថែរក្សាភាពស្អាតស្អំដើម្បីការពារជំងឺ' },
          { word: 'រោគឆ្លង', meaning: 'ជំងឺដែលអាចឆ្លងពីរោគមួយទៅមនុស្សម្នាក់ទៀត' },
        ],
        practiceQuestions: [
          {
            question: 'តើ «អនាម័យ ៣ ប្រការ» រួមមានអ្វីខ្លះ?',
            options: ['ហូបស្អាត ផឹកស្អាត រស់នៅស្អាត', 'ដេកស្អាត ដើរស្អាត ស្លៀកស្អាត', 'ផ្ទះស្អាត សាលាស្អាត ភូមិស្អាត', 'ហូបឆ្ងាញ់ ដេកស្រួល រៀនពូកែ'],
            answerIndex: 0,
            explanation: 'អនាម័យ ៣ ប្រការគឺ ហូបស្អាត ផឹកស្អាត និងរស់នៅស្អាត។',
          },
        ],
      },
      {
        title: 'ជំពូកទី២ ៖ អាហារូបត្ថម្ភ និងក្រុមអាហារទាំង ៣',
        keyPoints: [
          'ក្រុមទី១ ៖ អាហារស្ថាបនារាងកាយ (សាច់ ត្រី ស៊ុត ទឹកដោះគោ សណ្តែក - ប្រូតេអ៊ីន)',
          'ក្រុមទី២ ៖ អាហារផ្តល់ថាមពល (បាយ មើមដំឡូង ខ្លាញ់ ប្រេង ស្ករ - គ្លុយស៊ីត លីពីត)',
          'ក្រុមទី៣ ៖ អាហារការពាររាងកាយ (បន្លែ ផ្លែឈើ - វីតាមីន និងជាតិរ៉ែ)',
          'ការបរិភោគអាហារឱ្យមានតុល្យភាព និងផឹកទឹកស្អាតឱ្យបានគ្រប់គ្រាន់ (១,៥ ទៅ ២ លីត្រក្នុងមួយថ្ងៃ)',
        ],
        vocabulary: [
          { word: 'អាហារូបត្ថម្ភ', meaning: 'សារធាតុចិញ្ចឹមដែលរាងកាយត្រូវការដើម្បីលូតលាស់' },
          { word: 'តុល្យភាពអាហារ', meaning: 'ការទទួលទានអាហារចម្រុះគ្រប់ក្រុមតាមតម្រូវការរាងកាយ' },
        ],
        practiceQuestions: [
          {
            question: 'តើបន្លែបៃតង និងផ្លែឈើស្រស់ស្ថិតក្នុងក្រុមអាហារណា?',
            options: ['អាហារស្ថាបនារាងកាយ', 'អាហារផ្តល់ថាមពល', 'អាហារការពាររាងកាយ', 'អាហារមិនផ្តល់ផលប្រយោជន៍'],
            answerIndex: 2,
            explanation: 'បន្លែ និងផ្លែឈើសម្បូរវីតាមីន និងជាតិរ៉ែ ជាអាហារការពាររាងកាយពីជំងឺផ្សេងៗ។',
          },
        ],
      },
      {
        title: 'ជំពូកទី៣ ៖ សុវត្ថិភាព និងការសង្គ្រោះបឋម',
        keyPoints: [
          'ការជៀសវាងគ្រោះថ្នាក់ចរាចរណ៍ (ពាក់មួកសុវត្ថិភាព ដើរលើចិញ្ចើមផ្លូវ)',
          'ការប្រុងប្រយ័ត្នពីការលង់ទឹក និងគ្រោះថ្នាក់ភ្លើង/អគ្គិសនី',
          'វិធានការសង្គ្រោះបឋមចំពោះការមុត របួស រលាក ឬបាក់ឆ្អឹង',
        ],
        practiceQuestions: [
          {
            question: 'នៅពេលមានអ្នករលាកភ្លើងស្រាល តើវិធានការសង្គ្រោះបឋមដំបូងគួរធ្វើអ្វី?',
            options: ['យកប្រេងកូឡាលាប', 'បង្ហូរទឹកត្រជាក់ស្អាតលើកន្លែងរលាកពី ១០ ទៅ ១៥ នាទី', 'យកទឹកត្រីមកចាក់ពីលើ', 'យកម្សៅមកបៀក'],
            answerIndex: 1,
            explanation: 'បង្ហូរទឹកត្រជាក់ស្អាតលើមុខរបួសរលាកដើម្បីកាត់បន្ថយកម្តៅ និងការខូចខាតជាលិកាស្បែក។',
          },
        ],
      },
    ],
  },
  {
    id: 'sum-english',
    subjectKey: 'english',
    title: 'មេរៀនសង្ខេប: ភាសាអង់គ្លេស',
    badgeLabel: 'មេរៀនសង្ខេប',
    description: 'Grammar Tenses, Phonics, Daily Conversation & Reading',
    lessonsCount: 18,
    qcmCount: 140,
    icon: '🔤',
    themeColor: {
      bgGradient: 'from-[#221638] to-[#120b1f]',
      border: 'border-purple-500/40',
      pillBg: 'bg-purple-600/40 text-purple-300 border-purple-400/40',
      accent: 'text-purple-400',
      buttonGradient: 'from-amber-500 to-orange-500 text-slate-950',
    },
    chapters: [
      {
        title: 'Unit 1: Present Simple & Daily Routines',
        keyPoints: [
          'Subject + Verb(s/es) for he/she/it',
          'Frequency adverbs: always, usually, often, sometimes, never',
          'School subjects and classroom objects vocabulary',
        ],
        vocabulary: [
          { word: 'Timetable', meaning: 'កាលវិភាគសិក្សា' },
          { word: 'Experiment', meaning: 'ការពិសោធន៍វិទ្យាសាស្ត្រ' },
        ],
        practiceQuestions: [
          {
            question: 'She _____ to school by bicycle every morning.',
            options: ['go', 'goes', 'going', 'went'],
            answerIndex: 1,
            explanation: 'Subject "She" takes singular verb form "goes".',
          },
        ],
      },
    ],
  },
];

export interface StudentGameItem {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  category: string;
  icon: string;
  borderColor: string;
  bgColor: string;
  tagColor: string;
  type: 'vijjanava' | 'english' | 'fishing' | 'mathspeed' | 'khmerwords';
}

export const BUILTIN_STUDENT_GAMES: StudentGameItem[] = [
  {
    id: 'game-vijja',
    title: 'វិជ្ជាធានា: ល្បែងនាវាវិជ្ជា',
    shortTitle: 'វិជ្ជាធានា: ល្ប...',
    subtitle: 'ហ្គេមអប់រំថ្នាក់ទី៦',
    category: 'ដំណើរផ្សងព្រេងកោះ',
    icon: '👑',
    borderColor: 'border-amber-400',
    bgColor: 'bg-[#fffdf0]',
    tagColor: 'text-amber-700 bg-amber-100',
    type: 'vijjanava',
  },
  {
    id: 'game-english',
    title: 'ហ្គេមអង់គ្លេស English Challenge',
    shortTitle: 'ហ្គេមអង់គ្លេស',
    subtitle: 'រៀនពាក្យ & វេយ្យាករណ៍',
    category: 'ភាសាបរទេស',
    icon: '📖',
    borderColor: 'border-sky-400',
    bgColor: 'bg-[#f0f9ff]',
    tagColor: 'text-sky-700 bg-sky-100',
    type: 'english',
  },
  {
    id: 'game-fishing',
    title: 'ស្ទូចត្រីចំនេះដឹង (Fishing Quiz)',
    shortTitle: 'ស្ទូចត្រីចំនេះដឹង',
    subtitle: 'សន្សំពិន្ទុ & ត្រីឆ្លាត',
    category: 'សំណួរចម្លើយរហ័ស',
    icon: '🎣',
    borderColor: 'border-purple-400',
    bgColor: 'bg-[#faf5ff]',
    tagColor: 'text-purple-700 bg-purple-100',
    type: 'fishing',
  },
  {
    id: 'game-speedmath',
    title: 'ប្រណាំងគណិតល្បឿន (Speed Math)',
    shortTitle: 'ប្រណាំងគណិត',
    subtitle: 'គិតលេខលឿន & រង្វាន់',
    category: 'គណិតរហ័ស',
    icon: '⚡',
    borderColor: 'border-emerald-400',
    bgColor: 'bg-[#f0fdf4]',
    tagColor: 'text-emerald-700 bg-emerald-100',
    type: 'mathspeed',
  },
];

