import { TeacherProfile, Student, AttendanceDatabase, GradeDatabase, LogbookEntry, InventoryItem, PLCMeeting, Quiz, LibraryBook } from '../types';
import { defaultMultiPeriodGrades } from '../utils/gradeManager';
import { mathGrade6Book } from './mathGrade6Book';
import { getAllMathLessonQuizItems } from './mathLessonQcm';
import { HEALTH_EDUCATION_40_QUESTIONS, ALL_HEALTH_LESSONS_PACKAGES } from './healthEducationLessonsData';
import { ENGLISH_40_EXAM_QUESTIONS } from './english40QuestionsData';

export const initialTeacherProfile: TeacherProfile = {
  name: 'លោកគ្រូ ឌុក សុភ័ក្រ',
  school: 'សាលាបឋមសិក្សា ហ៊ុន សែន',
  grade: 'ថ្នាក់ទី ៤A',
  phone: '012 345 678',
  email: 'duk.sopheak@moeys.gov.kh',
  degree: 'បរិញ្ញាបត្រអប់រំ (គរុកោសល្យបឋមសិក្សា)',
  avatar: '👨‍🏫',
  academicYear: '២០២៥ - ២០២៦',
  adminPin: '8888',
};

export const initialStudents: Student[] = [
  { id: 1, rollNo: 1, name: 'សុខ ចាន់ថន', latinName: 'Sok Chanthorn', civilId: 'SIS-1001', gender: 'ប្រុស', dob: '2016-05-12', address: 'ភូមិ១ សង្កាត់បឹងកក់', parentPhone: '012 345 678', plpAccount: 'sok.chanthorn@plp.edu.kh', pin: '1234' },
  { id: 2, rollNo: 2, name: 'កែវ វណ្ណា', latinName: 'Keo Vanna', civilId: 'SIS-1002', gender: 'ស្រី', dob: '2016-08-20', address: 'ភូមិ៣ សង្កាត់ទួលសង្កែ', parentPhone: '098 765 432', plpAccount: 'keo.vanna@plp.edu.kh', pin: '1234' },
  { id: 3, rollNo: 3, name: 'ជា សុផាត', latinName: 'Chea Sophat', civilId: 'SIS-1003', gender: 'ប្រុស', dob: '2016-02-15', address: 'ភូមិ២ សង្កាត់ចោមចៅ', parentPhone: '011 223 344', plpAccount: 'chea.sophat@plp.edu.kh', pin: '1234' },
  { id: 4, rollNo: 4, name: 'លីណា ស្រីម៉ៅ', latinName: 'Lina Sreymao', civilId: 'SIS-1004', gender: 'ស្រី', dob: '2016-11-04', address: 'ភូមិ៥ សង្កាត់ស្ទឹងមានជ័យ', parentPhone: '077 889 900', plpAccount: 'lina.sreymao@plp.edu.kh', pin: '1234' },
  { id: 5, rollNo: 5, name: 'ម៉ៅ ចិន្តា', latinName: 'Mao Chinda', civilId: 'SIS-1005', gender: 'ស្រី', dob: '2016-04-18', address: 'ភូមិព្រែកលៀប', parentPhone: '088 123 456', plpAccount: 'mao.chinda@plp.edu.kh', pin: '1234' },
  { id: 6, rollNo: 6, name: 'ហេង ពិសិដ្ឋ', latinName: 'Heng Piseth', civilId: 'SIS-1006', gender: 'ប្រុស', dob: '2016-09-30', address: 'ភូមិកោះដាច់', parentPhone: '010 445 566', plpAccount: 'heng.piseth@plp.edu.kh', pin: '1234' },
];

const todayStr = new Date().toISOString().split('T')[0];

export const initialAttendance: AttendanceDatabase = {
  [todayStr]: {
    1: 'present',
    2: 'present',
    3: 'permission',
    4: 'present',
    5: 'present',
    6: 'present',
  },
};

export const initialGrades: GradeDatabase = {
  ...defaultMultiPeriodGrades,
  1: { khmer: 92, math: 88, science: 90, social: 85 },
  2: { khmer: 85, math: 95, science: 91, social: 89 },
  3: { khmer: 78, math: 74, science: 80, social: 76 },
  4: { khmer: 95, math: 90, science: 94, social: 92 },
  5: { khmer: 80, math: 82, science: 84, social: 81 },
  6: { khmer: 88, math: 86, science: 87, social: 85 },
};

export const initialLogbook: LogbookEntry[] = [
  {
    id: 1,
    date: todayStr,
    time: '07:30 - 08:30',
    subject: 'ភាសាខ្មែរ',
    topic: 'ការអានអត្ថបទ "សត្វផ្សោតទន្លេមេគង្គ" និងការយល់ន័យ',
    presentCount: '៥/៦',
    note: 'សិស្សចូលរួមឆ្លើយសំណួរបានសកម្ម និងយល់ន័យពាក្យគន្លឹះច្បាស់',
  },
  {
    id: 2,
    date: todayStr,
    time: '08:45 - 09:45',
    subject: 'គណិតវិទ្យា',
    topic: 'ប្រមាណវិធីចែកលេខមានតួលេខ ២ ខ្ទង់',
    presentCount: '៥/៦',
    note: 'បានអនុវត្តលំហាត់ក្តារខៀន សិស្ស ៤នាក់ធ្វើត្រូវ ១០០%',
  },
  {
    id: 3,
    date: '2026-08-20',
    time: '14:00 - 15:00',
    subject: 'វិទ្យាសាស្ត្រ',
    topic: 'វដ្តជីវិតរបស់រុក្ខជាតិ និងការដុះពន្លក',
    presentCount: '៦/៦',
    note: 'សិស្សបានយកគ្រាប់សណ្តែកមកសង្កេតផ្ទាល់ក្នុងថ្នាក់',
  },
];

export const initialInventory: InventoryItem[] = [
  { id: 1, name: 'តុសិស្ស (ឈើ និងដែក)', qty: 18, condition: 'ល្អ', category: 'គ្រឿងសង្ហារិម' },
  { id: 2, name: 'កៅអីសិស្ស', qty: 36, condition: 'ល្អ', category: 'គ្រឿងសង្ហារិម' },
  { id: 3, name: 'ក្តារខៀនសរសើរប៊ិចធំ', qty: 1, condition: 'ល្អ', category: 'សម្ភារបង្រៀន' },
  { id: 4, name: 'ទូរតាំងសៀវភៅអានបឋម', qty: 2, condition: 'ល្អ', category: 'បណ្ណាល័យថ្នាក់' },
  { id: 5, name: 'នាឡិកាជញ្ជាំងថ្នាក់រៀន', qty: 1, condition: 'មធ្យម', category: 'ឧបករណ៍' },
  { id: 6, name: 'កាតាបជំនួយស្មារតីអំណាន PLP', qty: 4, condition: 'ល្អ', category: 'សម្ភារ MoEYS' },
];

export const initialPLC: PLCMeeting[] = [
  {
    id: 1,
    date: '2026-08-18',
    topic: 'វិធីសាស្ត្រពង្រឹងការអានដំបូង និងកាតព្វកិច្ចកត់ត្រា PLP MoEYS',
    attendees: 'លោកគ្រូ ឌុក សុភ័ក្រ, អ្នកគ្រូ ចាន់ថន, លោកនាយករង សុខ ហេង',
    issues: 'សិស្សមួយចំនួនតូចនៅពិបាកផ្សំខ្យល់ស្រៈនិស្ស័យ និងព្យញ្ជនៈផ្ញើជើង',
    decision: 'រៀបចំម៉ោងអំណានបន្ថែម ២០នាទីមុនចេញលេង និងប្រើ Flashcard',
  },
  {
    id: 2,
    date: '2026-08-10',
    topic: 'ការរៀបចំតេស្តប្រឡងពាក់កណ្តាលឆមាសទី២ មុខវិជ្ជាគណិតវិទ្យា',
    attendees: 'ក្រុមបច្ចេកទេសបឋមសិក្សាកម្រិតទី២ (ថ្នាក់ទី៤-៥-៦)',
    issues: 'ឯកភាពលើទម្រង់វិញ្ញាសា និងកម្រិតលំបាកតាមស្តង់ដារជាតិ',
    decision: 'រៀបចំសំណួរពហុជ្រើសរើស ៤០% និងលំហាត់ដោះស្រាយ ៦០%',
  },
];

export const initialQuizzes: Quiz[] = [
  ...getAllMathLessonQuizItems(),
  {
    id: 'quiz-1',
    title: 'តេស្តសមត្ថភាពការអាន និងយល់ន័យ ភាសាខ្មែរ ថ្នាក់ទី៤',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី ៤',
    questionCount: 4,
    isPublic: true,
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
    questions: [
      {
        id: 1,
        question: 'តើពាក្យ "គរុកោសល្យ" មានន័យថាយ៉ាងណា?',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'a', text: 'ក្បួន ឬវិជ្ជាខាងការបង្រៀន', isCorrect: true, color: 'red', shape: '▲' },
          { id: 'b', text: 'ការធ្វើកសិកម្ម', isCorrect: false, color: 'blue', shape: '◆' },
          { id: 'c', text: 'ការសាងសង់ផ្ទះ', isCorrect: false, color: 'yellow', shape: '●' },
          { id: 'd', text: 'ការបើកបរយានយន្ត', isCorrect: false, color: 'green', shape: '■' },
        ],
      },
      {
        id: 2,
        question: 'ព្យញ្ជនៈក្នុងភាសាខ្មែរមានចំនួនប៉ុន្មានតួ?',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'a', text: '៣១ តួ', isCorrect: false, color: 'red', shape: '▲' },
          { id: 'b', text: '៣៣ តួ', isCorrect: true, color: 'blue', shape: '◆' },
          { id: 'c', text: '៣៥ តួ', isCorrect: false, color: 'yellow', shape: '●' },
          { id: 'd', text: '៣៧ តួ', isCorrect: false, color: 'green', shape: '■' },
        ],
      },
      {
        id: 3,
        question: 'តើប្រយោគណាជា "ប្រយោគសួរ"?',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'a', text: 'ខ្ញុំស្រឡាញ់សាលារៀនណាស់។', isCorrect: false, color: 'red', shape: '▲' },
          { id: 'b', text: 'សូមកុំរត់លេងលើថ្នល់!', isCorrect: false, color: 'blue', shape: '◆' },
          { id: 'c', text: 'តើថ្ងៃនេះអ្នករៀនមុខវិជ្ជាអ្វីខ្លះ?', isCorrect: true, color: 'yellow', shape: '●' },
          { id: 'd', text: 'ថ្ងៃនេះមេឃស្រឡះល្អ។', isCorrect: false, color: 'green', shape: '■' },
        ],
      },
      {
        id: 4,
        question: 'ពាក្យផ្ទុយនៃពាក្យ "ឧស្សាហ៍" គឺ៖',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'a', text: 'ខ្ជិលច្រអូស', isCorrect: true, color: 'red', shape: '▲' },
          { id: 'b', text: 'ឆ្លាតវៃ', isCorrect: false, color: 'blue', shape: '◆' },
          { id: 'c', text: 'ស្មោះត្រង់', isCorrect: false, color: 'yellow', shape: '●' },
          { id: 'd', text: 'រហ័សរហួន', isCorrect: false, color: 'green', shape: '■' },
        ],
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'លំហាត់គណិតវិទ្យា៖ ប្រមាណវិធីបូក ដក គុណ ចែក',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី ៤',
    questionCount: 3,
    isPublic: false,
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=600&auto=format&fit=crop',
    questions: [
      {
        id: 1,
        question: 'គណនា៖ ៤៥ x ៦ = ?',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'a', text: '២៥០', isCorrect: false, color: 'red', shape: '▲' },
          { id: 'b', text: '២៧០', isCorrect: true, color: 'blue', shape: '◆' },
          { id: 'c', text: '២៦០', isCorrect: false, color: 'yellow', shape: '●' },
          { id: 'd', text: '២៨០', isCorrect: false, color: 'green', shape: '■' },
        ],
      },
      {
        id: 2,
        question: 'គណនា៖ ៧២០ ÷ ៨ = ?',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'a', text: '៨០', isCorrect: false, color: 'red', shape: '▲' },
          { id: 'b', text: '៩៥', isCorrect: false, color: 'blue', shape: '◆' },
          { id: 'c', text: '៩០', isCorrect: true, color: 'yellow', shape: '●' },
          { id: 'd', text: '៧០', isCorrect: false, color: 'green', shape: '■' },
        ],
      },
      {
        id: 3,
        question: 'តើចំនួនណាជាចំនួនគត់គូ?',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'a', text: '១៣', isCorrect: false, color: 'red', shape: '▲' },
          { id: 'b', text: '២៧', isCorrect: false, color: 'blue', shape: '◆' },
          { id: 'c', text: '៤៩', isCorrect: false, color: 'yellow', shape: '●' },
          { id: 'd', text: '៥៦', isCorrect: true, color: 'green', shape: '■' },
        ],
      },
    ],
  },
  {
    id: 'quiz-3',
    title: 'តេស្តវិទ្យាសាស្ត្រ និងសិក្សាសង្គម ថ្នាក់ទី៤',
    subject: 'វិទ្យាសាស្ត្រ',
    grade: 'ថ្នាក់ទី ៤',
    questionCount: 3,
    isPublic: true,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    questions: [
      {
        id: 1,
        question: 'តើប្រាសាទអង្គរវត្តស្ថិតនៅក្នុងខេត្តណា?',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'a', text: 'ខេត្តសៀមរាប', isCorrect: true, color: 'red', shape: '▲' },
          { id: 'b', text: 'ខេត្តបាត់ដំបង', isCorrect: false, color: 'blue', shape: '◆' },
          { id: 'c', text: 'ខេត្តកំពង់ធំ', isCorrect: false, color: 'yellow', shape: '●' },
          { id: 'd', text: 'ខេត្តកណ្តាល', isCorrect: false, color: 'green', shape: '■' },
        ],
      },
      {
        id: 2,
        question: 'រុក្ខជាតិប្រើប្រាស់អ្វីខ្លះសម្រាប់ធ្វើរស្មីសំយោគ?',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'a', text: 'ពន្លឺព្រះអាទិត្យ ទឹក និងឧស្ម័នកាបូនិច', isCorrect: true, color: 'red', shape: '▲' },
          { id: 'b', text: 'តែទឹកមួយមុខគត់', isCorrect: false, color: 'blue', shape: '◆' },
          { id: 'c', text: 'ខ្យល់ត្រជាក់', isCorrect: false, color: 'yellow', shape: '●' },
          { id: 'd', text: 'ពន្លឺព្រះច័ន្ទ', isCorrect: false, color: 'green', shape: '■' },
        ],
      },
      {
        id: 3,
        question: 'តើទន្លេណាដែលហូរកាត់ប្រទេសកម្ពុជាពីជើងទៅត្បូង?',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'a', text: 'ទន្លេមេគង្គ', isCorrect: true, color: 'red', shape: '▲' },
          { id: 'b', text: 'ទន្លេនីល', isCorrect: false, color: 'blue', shape: '◆' },
          { id: 'c', text: 'ទន្លេអាម៉ាហ្សូន', isCorrect: false, color: 'yellow', shape: '●' },
          { id: 'd', text: 'ទន្លេដានូប', isCorrect: false, color: 'green', shape: '■' },
        ],
      },
    ],
  },
  {
    id: 'quiz-4',
    title: 'វិញ្ញាសាគំរូចម្រុះគ្រប់ប្រភេទសំណួរ (QCM, ខុស/ត្រូវ, ផ្គូរផ្គង, បំពេញចន្លោះ, រៀបពាក្យ)',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី ៤',
    questionCount: 5,
    isPublic: true,
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
    questions: [
      {
        id: 1,
        type: 'qcm',
        question: 'តើព្យញ្ជនៈក្នុងភាសាខ្មែរមានចំនួនសរុបប៉ុន្មានតួ?',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'a', text: '៣១ តួ', isCorrect: false, color: 'red', shape: '▲' },
          { id: 'b', text: '៣៣ តួ', isCorrect: true, color: 'blue', shape: '◆' },
          { id: 'c', text: '៣៥ តួ', isCorrect: false, color: 'yellow', shape: '●' },
          { id: 'd', text: '៣៧ តួ', isCorrect: false, color: 'green', shape: '■' },
        ],
      },
      {
        id: 2,
        type: 'true_false',
        question: 'តើព័ត៌មាននេះ «ត្រូវ» ឬ «ខុស» ៖ ផែនដីវិលជុំវិញព្រះអាទិត្យ?',
        timeLimit: 15,
        points: 1000,
        isTrue: true,
        options: [
          { id: 'true', text: 'ត្រូវ (ពិត)', isCorrect: true, color: 'green', shape: '✔' },
          { id: 'false', text: 'ខុស (មិនពិត)', isCorrect: false, color: 'red', shape: '✖' },
        ],
      },
      {
        id: 3,
        type: 'matching',
        question: 'ចូរផ្គូផ្គងឈ្មោះរាជធានី និងខេត្ត ឬទីតាំងភូមិសាស្ត្រខាងក្រោមឱ្យបានត្រឹមត្រូវ៖',
        timeLimit: 30,
        points: 1000,
        matchingPairs: [
          { id: 'm1', left: 'រាជធានីនៃព្រះរាជាណាចក្រកម្ពុជា', right: 'រាជធានីភ្នំពេញ' },
          { id: 'm2', left: 'ប្រាសាទអង្គរវត្តស្ថិតនៅខេត្ត', right: 'ខេត្តសៀមរាប' },
          { id: 'm3', left: 'ភ្នំខ្ពស់ជាងគេនៅកម្ពុជា', right: 'ភ្នំឱរ៉ាល់' },
          { id: 'm4', left: 'បឹងទឹកសាបធំជាងគេនៅអាស៊ីអាគ្នេយ៍', right: 'បឹងទន្លេសាប' },
        ],
        options: [
          { id: 'a', text: 'ផ្គូផ្គងត្រឹមត្រូវគ្រប់គូ', isCorrect: true, color: 'blue', shape: '🔗' },
        ],
      },
      {
        id: 4,
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
      },
      {
        id: 5,
        type: 'reorder_words',
        question: 'ចូររៀបចំកម្រងពាក្យខាងក្រោមឱ្យក្លាយជាល្បះត្រឹមត្រូវ៖',
        timeLimit: 30,
        points: 1000,
        correctSentence: 'សិស្សានុសិស្ស ខិតខំ រៀនសូត្រ ដើម្បី អនាគត ភ្លឺស្វាង',
        words: ['ដើម្បី', 'សិស្សានុសិស្ស', 'ភ្លឺស្វាង', 'ខិតខំ', 'អនាគត', 'រៀនសូត្រ'],
        options: [
          { id: 'a', text: 'សិស្សានុសិស្ស ខិតខំ រៀនសូត្រ ដើម្បី អនាគត ភ្លឺស្វាង', isCorrect: true, color: 'green', shape: '★' },
        ],
      },
    ],
  },
  ...ALL_HEALTH_LESSONS_PACKAGES.map((pkg) => pkg.quizItem),
  {
    id: 'quiz-health-comprehensive-40q',
    title: 'វិញ្ញាសារួមអនុវត្ត៖ អប់រំសុខភាព ថ្នាក់ទី៦ (៤០ សំណួរ QCM គ្រប់មេរៀន)',
    subject: 'អប់រំសុខភាព',
    grade: 'ថ្នាក់ទី ៦',
    questionCount: 40,
    isPublic: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
    questions: HEALTH_EDUCATION_40_QUESTIONS.map((q) => {
      const colors: ('red' | 'blue' | 'yellow' | 'green')[] = ['red', 'blue', 'yellow', 'green'];
      const shapes = ['▲', '◆', '●', '■'];
      const optIds = ['a', 'b', 'c', 'd'];
      return {
        id: q.id,
        type: 'qcm' as const,
        question: q.question,
        timeLimit: 30,
        points: 1000,
        options: q.options.map((opt, idx) => ({
          id: optIds[idx] || `opt-${idx}`,
          text: opt.text,
          isCorrect: opt.isCorrect,
          color: colors[idx % 4],
          shape: shapes[idx % 4],
        })),
        explanation: q.explanation,
      };
    }),
  },
  {
    id: 'quiz-english-comprehensive-40q',
    title: 'វិញ្ញាសាអនុវត្ត៖ ភាសាអង់គ្លេស ថ្នាក់ទី៦ (៤០ សំណួរ QCM & Grammar)',
    subject: 'ភាសាអង់គ្លេស',
    grade: 'ថ្នាក់ទី ៦',
    questionCount: 40,
    isPublic: true,
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600',
    questions: ENGLISH_40_EXAM_QUESTIONS.map((q) => {
      const colors: ('red' | 'blue' | 'yellow' | 'green')[] = ['red', 'blue', 'yellow', 'green'];
      const shapes = ['▲', '◆', '●', '■'];
      const optIds = ['a', 'b', 'c', 'd'];
      return {
        id: q.id,
        type: 'qcm' as const,
        question: q.question,
        timeLimit: 30,
        points: 1000,
        options: q.options.map((opt, idx) => ({
          id: optIds[idx] || `opt-${idx}`,
          text: opt.text,
          isCorrect: opt.isCorrect,
          color: colors[idx % 4],
          shape: shapes[idx % 4],
        })),
        explanation: q.explanation,
      };
    }),
  },
];

export const initialLibraryBooks: LibraryBook[] = [
  {
    id: 'book-social-studies-6',
    title: 'សិក្សាសង្គម ថ្នាក់ទី៦ (សៀវភៅសិក្សាគោល)',
    author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)',
    category: 'សិក្សាសង្គម',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
    description: 'សៀវភៅសិក្សាគោលមុខវិជ្ជាសិក្សាសង្គម ថ្នាក់ទី៦ រួមមាន៖ ឥរិយាបថល្អ, ឥរិយាបថប្រកបដោយសុវត្ថិភាព, ជីវភាពសង្គមបច្ចុប្បន្ន, និងសង្គមអតីតកាល (សម័យចតុមុខ លង្វែក ឧដុង្គ)។',
    pagesCount: 129,
    fileType: 'text',
    fileData: `ក្រសួងអប់រំ យុវជន និងកីឡា
សៀវភៅសិក្សាគោល៖ សិក្សាសង្គម ថ្នាក់ទី៦
បោះពុម្ពផ្សាយដោយ៖ គ្រឹះស្ថានបោះពុម្ព និងចែកផ្សាយ

==================================================
បញ្ជីអត្ថបទ និងមាតិកាមេរៀន
==================================================

ជំពូកទី១៖ ឥរិយាបថល្អ
--------------------------------------------------
• មេរៀនទី១៖ ការកំណត់គោលដៅ (ទំព័រ ២)
  - ១. ការកំណត់គោលដៅសិក្សា៖ កុមារគ្រប់រូបត្រូវកំណត់គោលដៅសិក្សាឱ្យបានច្បាស់លាស់ដើម្បីទទួលបានជោគជ័យក្នុងការសិក្សា និងជីវិត។
  - ២. ការកសាងផែនការ៖ ការរៀបចំកាលវិភាគសិក្សាប្រចាំថ្ងៃ តាមសប្តាហ៍ និងតាមខែ។

• មេរៀនទី២៖ ឥរិយាបថ និងតម្លៃ (ទំព័រ ១០)
  - ១. ការរៀបចំឥរិយាបថដែលគួរសព្វព្រះរាជហឫទ័យ និងគោរព
  - ២. ទំនាក់ទំនងល្អក្នុងគ្រួសារ (ឪពុកម្តាយ កូន និងបងប្អូន)
  - ៣. ទំនាក់ទំនងល្អជាមួយមនុស្សនៅជុំវិញខ្លួន និងមិត្តភក្តិ
  - ៤. ទំនាក់ទំនងល្អជាមួយអ្នកជិតខាង

• មេរៀនទី៣៖ សិទ្ធិ និងការទទួលខុសត្រូវ (ទំព័រ ១៨)
  - ១. សិទ្ធិកុមារ៖ សិទ្ធិរស់រានមានជីវិត, សិទ្ធិទទួលបានការអភិវឌ្ឍ, សិទ្ធិទទួលបានការការពារ, និងសិទ្ធិមានការចូលរួម។
  - ពីរ. ការរំលោភបំពានលើសិទ្ធិកុមារ និងការការពារកុមារពីគ្រោះថ្នាក់។

• មេរៀនទី៤៖ សិល្បៈ និងការច្នៃប្រឌិត (ទំព័រ ២៦)
  - ១. ការស្ដាររូប និងការបង្កើតរូបចម្លាក់ពីដីឥដ្ឋ/ម្សៅ
  - ពីរ. ការគូររូបតាមរូបគំរូ និងការដាក់ពន្លឺ/ស្រមោល
  - ៣. ការបត់ក្រដាសធ្វើវត្ថុ ឬសត្វផ្សេងៗ

ជំពូកទី២៖ ឥរិយាបថប្រកបដោយសុវត្ថិភាព
--------------------------------------------------
• មេរៀនទី១៖ ការចៀសវាងទង្វើដែលនាំឱ្យមានគ្រោះថ្នាក់ (ទំព័រ ៣៤)
  - ១. ភាពងាយរងគ្រោះថ្នាក់ចរាចរណ៍
  - ពីរ. ការធ្វើដំណើរតាមដងផ្លូវ និងការគោរពច្បាប់ចរាចរណ៍
  - ៣. ការបដិសេធនឹងទង្វើប្រឈមមុខនឹងគ្រោះថ្នាក់

• មេរៀនទី២៖ ផលអាក្រក់នៃគ្រោះថ្នាក់ចរាចរណ៍ (ទំព័រ ៤២)
  - ១. ការខាតបង់ជីវិត សុខភាព និងទ្រព្យសម្បត្តិ
  - ពីរ. ផលប៉ះពាល់ដល់សេដ្ឋកិច្ចគ្រួសារ និងសង្គមជាតិ

ជំពូកទី៣៖ ជីវភាពសង្គមនាពេលបច្ចុប្បន្ន
--------------------------------------------------
• មេរៀនទី១៖ ចម្រៀង និងរបាំខ្មែរ (ទំព័រ ៥២)
  - របាំយីកេ, ល្ខោនបាសាក់, និងរបាំប្រជាប្រិយខ្មែរ (រំវង់, ឡាំលាវ, សារ៉ាវ៉ាន់)
• មេរៀនទី២៖ ពិធីបុណ្យប្រពៃណីជាតិ (ទំព័រ ៦០)
  - ពិធីបុណ្យតាមចន្ទគតិ និងសុរិយគតិ, ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល, ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ
• មេរៀនទី៣៖ ការងារនៅក្នុងសហគមន៍ (ទំព័រ ៦៨)
  - ការជ្រើសរើសមុខរបរ, មុខរបរសិប្បកម្ម, នេសាទ, និងការបណ្តុះផ្សិតចំបើង
• មេរៀនទី៤៖ តុលាការ (ទំព័រ ៧៦)
  - ប្រព័ន្ធតុលាការកម្ពុជា៖ សាលាដំបូង, សាលាឧទ្ធរណ៍, តុលាការកំពូល, និងតួនាទីមេធាវី
• មេរៀនទី៥៖ ទីតាំងរាជធានី និងប្រទេស (ទំព័រ ៨៤)
  - ផែនទីកម្ពុជា និងទីតាំងប្រទេសក្នុងតំបន់អាស៊ីអាគ្នេយ៍ (ASEAN)

ជំពូកទី៤៖ សង្គមអតីតកាល
--------------------------------------------------
• មេរៀនទី១៖ ឧបករណ៍ភ្លេងប្រពៃណី (ទំព័រ ៩៤)
  - វង់ភ្លេងយីកេ, វង់ភ្លេងបាសាក់, ទ្រ, ស្គរ, ឈិង, ផ្លុយ
• មេរៀនទី២៖ សម័យចតុមុខ (គ.ស ១៤៣១ - ១៥២៦) (ទំព័រ ១០២)
  - ព្រះបាទពញាយ៉ាត, ការកសាងភ្នំពេញ, ព្រះបាទចន្ទរាជា, និងស្តេចកន
• មេរៀនទី៣៖ សម័យលង្វែក (គ.ស ១៥២៦ - ១៥៩៤) (ទំព័រ ១១០)
  - បន្ទាយលង្វែក, ព្រះបាទចន្ទរាជា, ព្រះបរមរាជា, និងការបែកបាក់បន្ទាយលង្វែក
• មេរៀនទី៤៖ ការតាំងរាជធានីនៅឧដុង្គ (ទំព័រ ១២៣)
  - ការកសាងក្រុងឧដុង្គមានជ័យ និងប្រវត្តិសាស្ត្រខ្មែរ`,
    uploadedDate: '2026-08-23'
  },
  {
    id: 'book-science-6',
    title: 'វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ (សៀវភៅសិក្សាគោល)',
    author: 'ក្រសួងអប់រំ យុវជន និងកីឡា',
    category: 'វិទ្យាសាស្ត្រ',
    coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600',
    description: 'សៀវភៅសិក្សាគោលមុខវិជ្ជាវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ រួមមាន៖ រុក្ខជាតិ និងសត្វ, មនុស្ស និងសុខភាព, ថាមពល និងរូបធាតុ, ផែនដី និងអវកាស។',
    pagesCount: 156,
    fileType: 'text',
    fileData: `ក្រសួងអប់រំ យុវជន និងកីឡា
សៀវភៅសិក្សាគោល៖ វិទ្យាសាស្ត្រ ថ្នាក់ទី៦

មាតិកាសខាន់ៗ៖
• ជំពូកទី១៖ រុក្ខជាតិ និងសត្វ
  - មេរៀនទី១៖ ការបន្តពូជរបស់រុក្ខជាតិមានផ្កា
  - មេរៀនទី២៖ ការបន្សំខ្លួនរបស់សត្វទៅនឹងបរិស្ថាន
• ជំពូកទី២៖ មនុស្ស និងសុខភាព
  - មេរៀនទី១៖ ប្រព័ន្ធរំលាយអាហារ និងការថែទាំ
  - មេរៀនទី២៖ ជំងឺឆ្លង និងការការពារ
• ជំពូកទី៣៖ ថាមពល និងចលនា
  - មេរៀនទី១៖ អគ្គិសនី និងសៀគ្វីអគ្គិសនី
  - មេរៀនទី២៖ កម្លាំង និងម៉ាស៊ីនងាយ`,
    uploadedDate: '2026-08-23'
  },
  {
    id: 'book-khmer-6',
    title: 'ភាសាខ្មែរ ថ្នាក់ទី៦ (សៀវភៅសិក្សាគោល)',
    author: 'ក្រសួងអប់រំ យុវជន និងកីឡា',
    category: 'ភាសាខ្មែរ',
    coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
    description: 'សៀវភៅអំណាន តែងសេចក្តី វាក្យសព្ទ វេយ្យាករណ៍ និងអក្សរសិល្ប៍ សម្រាប់សិស្សថ្នាក់ទី៦។',
    pagesCount: 180,
    fileType: 'text',
    fileData: `ក្រសួងអប់រំ យុវជន និងកីឡា
សៀវភៅសិក្សាគោល៖ ភាសាខ្មែរ ថ្នាក់ទី៦

មាតិកាសខាន់ៗ៖
• ការអាន និងស្វែងយល់ន័យអត្ថបទ
• វាក្យសព្ទ និងវេយ្យាករណ៍ខ្មែរ
• ការតែងសេចក្តីពណ៌នា និងពន្យល់
• សុភាសិត និងកម្រងអក្សរសិល្ប៍អប់រំ`,
    uploadedDate: '2026-08-23'
  },
  mathGrade6Book,
  {
    id: 'book-1',
    title: 'សៀវភៅអំណានថ្នាក់ទី១ - ភាសាខ្មែរ',
    author: 'ក្រសួងអប់រំ យុវជន និងកីឡា',
    category: 'ភាសាខ្មែរ',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    description: 'សៀវភៅគោលសម្រាប់កុមាររៀនអាន និងសរសេរអក្សរក្រហម ព្យញ្ជនៈ ស្រៈ និងពាក្យពេចន៍ងាយៗ។',
    pagesCount: 48,
    fileType: 'text',
    fileData: 'មេរៀនទី១៖ ព្យញ្ជនៈ ក ខ គ ឃ ង\n\nក: កង្កែប កាល កាត\nខ: ខ្យល់ ខោ ខ្នើយ\nគ: គូទ គោម គំនិត\nឃ: ឃ្មុំ ឃ្លាំង ឃ្លោក\n\nសកម្មភាពហ្វឹកហាត់៖\n១. ហាត់អានពាក្យខាងលើឱ្យបានស្ទាត់ជំនាញ។\n២. កត់ត្រាព្យញ្ជនៈនីមួយៗចូលក្នុងសៀវភៅសរសេរដៃ។',
    uploadedDate: '2026-01-15'
  },
  {
    id: 'book-2',
    title: 'ល្បែងគណិតវិទ្យា និងតារាងគុណ',
    author: 'នាយកដ្ឋានបឋមសិក្សា',
    category: 'គណិតវិទ្យា',
    coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
    description: 'កម្រងលំហាត់បូក ដក គុណ ចែក និងតារាងគុណពី ១ ដល់ ១០ សម្រាប់សិស្សបឋមសិក្សា។',
    pagesCount: 32,
    fileType: 'text',
    fileData: 'តារាងគុណលេខ ២ ដល់ ៥\n\n២ x ១ = ២\n២ x ២ = ៤\n២ x ៣ = ៦\n២ x ៤ = ៨\n២ x ៥ = ១០\n\n៣ x ១ = ៣\n៣ x ២ = ៦\n៣ x ៣ = ៩\n៣ x ៤ = ១២\n៣ x ៥ = ១៥',
    uploadedDate: '2026-02-01'
  },
  {
    id: 'book-3',
    title: 'រឿងនិទានអប់រំ៖ ទន្សាយ និងអក',
    author: 'ប្រជុំរឿងព្រេងខ្មែរ',
    category: 'រឿងនិទាន',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
    description: 'រឿងនិទានប្រៀនប្រដៅកុមារឱ្យចេះសាមគ្គីគ្នា ឧស្សាហព្យាយាម និងមិនត្រូវមើលងាយអ្នកដទៃ។',
    pagesCount: 20,
    fileType: 'text',
    fileData: 'កាលពីបុរាណកាល មានសត្វទន្សាយ និងសត្វអកមួយរស់នៅក្បែរព្រៃស្រោង។ ទន្សាយមានមោទនភាពលើការរត់លឿនរបស់ខ្លួនឯងយ៉ាងខ្លាំង ប៉ុន្តែអកមានប្រាជ្ញាឈ្លាសវៃ...\n\nសីលធម៌អប់រំ៖ ភាពក្រអឺតក្រទមមិនអាចនាំមកនូវសេចក្តីសុខទេ មានតែភាពបន្ទាបខ្លួន និងស្មារតីខិតខំប្រឹងប្រែងប៉ុណ្ណោះដែលផ្តល់ជោគជ័យ។',
    uploadedDate: '2026-02-10'
  }
];
