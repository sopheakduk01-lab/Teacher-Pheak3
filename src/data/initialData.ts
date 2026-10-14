import {
  TeacherProfile,
  Student,
  AttendanceDatabase,
  GradeDatabase,
  LogbookEntry,
  InventoryItem,
  PLCMeeting,
  Quiz,
  LibraryBook,
} from '../types';

export const initialTeacherProfile: TeacherProfile = {
  name: 'សុខ សុភា',
  school: 'សាលាបឋមសិក្សាព្រះនរោត្តម',
  grade: 'ថ្នាក់ទី ៦ ក',
  phone: '012 345 678',
  email: 'sok.sophea@gmail.com',
  degree: 'បរិញ្ញាបត្រគរុកោសល្យ',
  avatar: '👨‍🏫',
  academicYear: '២០២៥ - ២០២៦',
  adminPin: '1234',
};

export const initialStudents: Student[] = [
  { id: 1, rollNo: 1, name: 'ចាន់ សុខា', latinName: 'Chan Sokha', gender: 'male', dob: '2013-05-12', address: 'ភ្នំពេញ', parentPhone: '012 111 222', pin: '1111', avatar: '👦' },
  { id: 2, rollNo: 2, name: 'កែវ ធីតា', latinName: 'Keo Thida', gender: 'female', dob: '2013-08-20', address: 'ភ្នំពេញ', parentPhone: '012 333 444', pin: '2222', avatar: '👧' },
  { id: 3, rollNo: 3, name: 'ស៊ុន វិចិត្រ', latinName: 'Sun Vichet', gender: 'male', dob: '2013-03-15', address: 'ភ្នំពេញ', parentPhone: '012 555 666', pin: '3333', avatar: '👦' },
  { id: 4, rollNo: 4, name: 'ម៉ៅ បុប្ផា', latinName: 'Mao Bopha', gender: 'female', dob: '2013-11-02', address: 'ភ្នំពេញ', parentPhone: '012 777 888', pin: '4444', avatar: '👧' },
  { id: 5, rollNo: 5, name: 'ហេង រតនា', latinName: 'Heng Rathana', gender: 'male', dob: '2013-09-18', address: 'ភ្នំពេញ', parentPhone: '012 999 000', pin: '5555', avatar: '👦' },
];

export const initialAttendance: AttendanceDatabase = {
  '2025-10-10': {
    1: 'present',
    2: 'present',
    3: 'present',
    4: 'permission',
    5: 'present',
  },
};

export const initialGrades: GradeDatabase = {
  m10: {
    1: { khmer: 45, math: 48, science: 42, social: 40, writing: 44, reading: 46, total: 265, average: 44.17, rank: 1, mention: 'ល្អ' },
    2: { khmer: 48, math: 42, science: 44, social: 45, writing: 47, reading: 48, total: 274, average: 45.67, rank: 2, mention: 'ល្អណាស់' },
    3: { khmer: 38, math: 40, science: 35, social: 36, writing: 35, reading: 38, total: 222, average: 37.0, rank: 3, mention: 'ល្អបង្គួរ' },
    4: { khmer: 40, math: 35, science: 38, social: 39, writing: 40, reading: 41, total: 233, average: 38.83, rank: 4, mention: 'ល្អ' },
    5: { khmer: 35, math: 36, science: 32, social: 34, writing: 33, reading: 35, total: 205, average: 34.17, rank: 5, mention: 'ល្អបង្គួរ' },
  },
};

export const initialLogbook: LogbookEntry[] = [
  { id: 1, date: '2025-10-10', time: '07:30 - 08:30', subject: 'ភាសាខ្មែរ', topic: 'អំណាន៖ សារៈសំខាន់នៃការអានសៀវភៅ', presentCount: '34/35', note: 'សិស្សយកចិត្តទុកដាក់ស្ដាប់' },
  { id: 2, date: '2025-10-10', time: '08:30 - 09:30', subject: 'គណិតវិទ្យា', topic: 'ប្រភាគ និងចំនួនចម្រុះ', presentCount: '34/35', note: 'ធ្វើលំហាត់បានល្អ' },
];

export const initialInventory: InventoryItem[] = [
  { id: 1, name: 'ក្ដារខៀនសរសេរដីស', qty: 1, condition: 'ល្អ', category: 'សម្ភារៈបន្ទប់' },
  { id: 2, name: 'តុ និងកៅអីសិស្ស', qty: 20, condition: 'ល្អ', category: 'គ្រឿងសង្ហារឹម' },
  { id: 3, name: 'ផែនទីប្រទេសកម្ពុជា', qty: 1, condition: 'ល្អ', category: 'ឧបករណ៍បង្រៀន' },
];

export const initialPLC: PLCMeeting[] = [
  { id: 1, date: '2025-10-05', topic: 'វិធីសាស្ត្រជួយសិស្សរៀនយឺតលើមុខវិជ្ជាគណិតវិទ្យា', attendees: 'លោកគ្រូ សុភា, អ្នកគ្រូ ធីតា, លោកគ្រូ វ៉ាន់នី', issues: 'សិស្សពិបាកយល់អំពីប្រភាគ', decision: 'ប្រើប្រាស់សម្ភារឧបទេសបំណែកផ្លែឈើក្នុងការបង្រៀន' },
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-khmer-1',
    title: 'សំណួរត្រួតពិនិត្យភាសាខ្មែរ ថ្នាក់ទី ៦',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី ៦',
    questionCount: 5,
    isPublic: true,
    questions: [
      {
        id: 'q1',
        type: 'qcm',
        question: 'តើពាក្យ "ប្រពៃ" មានន័យដូចម្ដេច?',
        timeLimit: 30,
        points: 10,
        options: [
          { id: 'opt1', text: 'ល្អ, ថ្លៃថ្នូរ', isCorrect: true },
          { id: 'opt2', text: 'លឿន, រហ័ស', isCorrect: false },
          { id: 'opt3', text: 'ពិបាក, ស្មុគស្មាញ', isCorrect: false },
          { id: 'opt4', text: 'ចាស់, បុរាណ', isCorrect: false },
        ],
        explanation: 'ពាក្យ «ប្រពៃ» មានន័យថាល្អ គាប់ប្រសើរ ថ្លៃថ្នូរ។',
      },
    ],
  },
];

export const initialLibraryBooks: LibraryBook[] = [
  {
    id: 'book-math-6',
    title: 'គណិតវិទ្យា ថ្នាក់ទី ៦',
    author: 'ក្រសួងអប់រំ យុវជន និងកីឡា',
    category: 'សៀវភៅពុម្ព',
    description: 'សៀវភៅពុម្ពគណិតវិទ្យាថ្នាក់ទី៦ ផ្លូវការ',
    pagesCount: 160,
    fileType: 'pdf',
    uploadedDate: '2025-09-01',
  },
  {
    id: 'book-khmer-6',
    title: 'ភាសាខ្មែរ ថ្នាក់ទី ៦',
    author: 'ក្រសួងអប់រំ យុវជន និងកីឡា',
    category: 'សៀវភៅពុម្ព',
    description: 'សៀវភៅពុម្ពភាសាខ្មែរថ្នាក់ទី៦ ផ្លូវការ',
    pagesCount: 180,
    fileType: 'pdf',
    uploadedDate: '2025-09-01',
  },
];
