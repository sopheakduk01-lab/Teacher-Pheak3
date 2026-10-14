export interface MathGrade6Lesson {
  id: number;
  lessonNo: number;
  title: string;
  startPage: number;
  endPage: number;
  summary: string;
  keyConcepts: string[];
}

export const mathGrade6AllLessons: MathGrade6Lesson[] = [
  {
    id: 1,
    lessonNo: 1,
    title: 'ចំនួនរាប់លើសពី ១ ០០០ ០០០',
    startPage: 1,
    endPage: 8,
    summary: 'ការអាន ការសរសេរ និងការប្រៀបធៀបចំនួនរាប់ធំៗ',
    keyConcepts: ['ថ្នាក់លាន', 'ថ្នាក់ពាន់', 'ថ្នាក់ឯកតា', 'ការប្រៀបធៀប'],
  },
  {
    id: 2,
    lessonNo: 2,
    title: 'ប្រមាណវិធីបូក និងដកចំនួនរាប់',
    startPage: 9,
    endPage: 16,
    summary: 'ការគណនាផលបូក និងផលដកចំនួនរាប់ធំៗ និងចំណោទ',
    keyConcepts: ['ផលបូក', 'ផលដក', 'ការត្រួតពិនិត្យលទ្ធផល', 'ដោះស្រាយចំណោទ'],
  },
  {
    id: 3,
    lessonNo: 3,
    title: 'ប្រមាណវិធីគុណចំនួនរាប់',
    startPage: 17,
    endPage: 24,
    summary: 'ការគុណនឹងចំនួនមានលេខ ២ ឬ ៣ ខ្ទង់',
    keyConcepts: ['ផលគុណ', 'គុណនឹងពហុគុណនៃ ១០'],
  },
  {
    id: 4,
    lessonNo: 4,
    title: 'ប្រមាណវិធីចែកចំនួនរាប់',
    startPage: 25,
    endPage: 32,
    summary: 'ការចែកនឹងចំនួនមានលេខ ២ ខ្ទង់ និងសំណល់',
    keyConcepts: ['តំណាងចែក', 'តួចែក', 'ផលចែក', 'សំណល់'],
  },
  {
    id: 5,
    lessonNo: 5,
    title: 'ប្រភាគ និងប្រមាណវិធីលើប្រភាគ',
    startPage: 33,
    endPage: 44,
    summary: 'ការបូក ដក គុណ ចែកប្រភាគ និងការសម្រួលប្រភាគ',
    keyConcepts: ['ភាគយក', 'ភាគបែង', 'ប្រភាគស្មើគ្នា', 'សម្រួលប្រភាគ'],
  },
  {
    id: 6,
    lessonNo: 6,
    title: 'ចំនួនទសភាគ',
    startPage: 45,
    endPage: 56,
    summary: 'ការអាន សរសេរ និងប្រមាណវិធីលើចំនួនទសភាគ',
    keyConcepts: ['ផ្នែកគត់', 'ផ្នែកទសភាគ', 'ក្បៀស'],
  },
  {
    id: 7,
    lessonNo: 7,
    title: 'ភាគរយ និងការប្រាក់',
    startPage: 57,
    endPage: 68,
    summary: 'ការគណនាភាគរយ ការបញ្ចុះតម្លៃ និងការប្រាក់',
    keyConcepts: ['សញ្ញា %', 'ការបញ្ចុះតម្លៃ', 'ការប្រាក់សាមញ្ញ'],
  },
];

export const mathGrade6BookChapters = mathGrade6AllLessons;
