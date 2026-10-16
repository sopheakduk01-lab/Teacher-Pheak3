export interface SyllabusChapter {
  chapterNo: string;
  title: string;
  hours: string;
  month: string;
  weekNo: string;
  objective: string;
  topics: string[];
  studentBookPages?: string;
  teacherBookPages?: string;
  [key: string]: any;
}

export interface SyllabusTrimester {
  trimesterName: string;
  title?: string;
  period?: string;
  chapters: SyllabusChapter[];
  [key: string]: any;
}

export interface SubjectSyllabus {
  id: string;
  name: string;
  englishName: string;
  grade: string;
  totalHours: string;
  icon: string;
  color: string;
  colorTheme?: string;
  description?: string;
  officeInfo?: string;
  weeklyHours?: string;
  yearlyHours?: string;
  authorInfo?: string;
  gradeLevel?: string;
  coreCompetencies?: string[];
  teachingStrategies?: string[];
  assessmentTools?: string[];
  trimesters: SyllabusTrimester[];
  [key: string]: any;
}

export const moeysSubjectSyllabusList: SubjectSyllabus[] = [
  {
    id: 'khmer',
    name: 'ភាសាខ្មែរ',
    englishName: 'Khmer Literature',
    grade: 'ថ្នាក់ទី ៦',
    gradeLevel: 'ថ្នាក់ទី ៦',
    totalHours: '២៨០ ម៉ោង',
    weeklyHours: '៧ ម៉ោង/សប្តាហ៍',
    yearlyHours: '២៨០ ម៉ោង',
    icon: '📖',
    color: 'from-blue-600 to-indigo-700',
    colorTheme: 'blue',
    description: 'កម្មវិធីសិក្សាភាសាខ្មែរថ្នាក់ទី៦ ផ្ដោតលើអំណាន តែងសេចក្ដី វេយ្យាករណ៍ និងការយល់ដឹងពីវប្បធម៌។',
    officeInfo: 'នាយកដ្ឋានអភិវឌ្ឍកម្មវិធីសិក្សា ក្រសួងអប់រំ យុវជន និងកីឡា',
    authorInfo: 'គណៈកម្មការរៀបចំកម្មវិធីសិក្សាជាតិ',
    coreCompetencies: ['ការអានយល់ន័យកម្រិតស៊ីជម្រៅ', 'ការសរសេរបែបពិពណ៌នា និងពន្យល់', 'ការប្រើប្រាស់វេយ្យាករណ៍ត្រឹមត្រូវ'],
    teachingStrategies: ['វិធីសាស្ត្រសកម្ម (Active Learning)', 'ការពិភាក្សាជាក្រុម', 'ការស្រាវជ្រាវខ្នាតតូច'],
    assessmentTools: ['តេស្តប្រចាំខែ', 'កិច្ចការផ្ទះ', 'ការសង្កេតផ្ទាល់'],
    trimesters: [
      {
        trimesterName: 'ត្រីមាសទី ១',
        title: 'ត្រីមាសទី ១',
        period: 'វិច្ឆិកា - មករា',
        chapters: [
          {
            chapterNo: 'មេរៀនទី ១',
            title: 'ការរស់នៅប្រកបដោយសេចក្ដីសុខ',
            hours: '១២ ម៉ោង',
            month: 'វិច្ឆិកា',
            weekNo: 'សប្តាហ៍ទី ១-២',
            objective: 'ស្វែងយល់ពីតម្លៃនៃការរស់នៅជាមួយអ្នកដទៃដោយសន្តិភាព',
            topics: ['អំណាន៖ សេចក្ដីសុខពិតប្រាកដ', 'វេយ្យាករណ៍៖ នាម និងកិរិយាសព្ទ', 'តែងសេចក្ដី'],
            studentBookPages: 'ទំព័រ ៥ - ១២',
            teacherBookPages: 'ទំព័រ ១០ - ១៨',
          },
        ],
      },
      {
        trimesterName: 'ត្រីមាសទី ២',
        title: 'ត្រីមាសទី ២',
        period: 'កុម្ភៈ - មេសា',
        chapters: [
          {
            chapterNo: 'មេរៀនទី ៥',
            title: 'សិល្បៈ និងវប្បធម៌ខ្មែរ',
            hours: '១៤ ម៉ោង',
            month: 'កុម្ភៈ',
            weekNo: 'សប្តាហ៍ទី ១-២',
            objective: 'ស្គាល់ប្រាសាទបុរាណ និងឧបករណ៍ភ្លេងបុរាណ',
            topics: ['អំណាន៖ ប្រាសាទអង្គរវត្ត', 'សរសេរតាមអាន'],
            studentBookPages: 'ទំព័រ ៤៥ - ៥៤',
            teacherBookPages: 'ទំព័រ ៥០ - ៦០',
          },
        ],
      },
      {
        trimesterName: 'ត្រីមាសទី ៣',
        title: 'ត្រីមាសទី ៣',
        period: 'ឧសភា - កក្កដា',
        chapters: [
          {
            chapterNo: 'មេរៀនទី ១០',
            title: 'បរិស្ថាន និងការអភិរក្ស',
            hours: '១២ ម៉ោង',
            month: 'ឧសភា',
            weekNo: 'សប្តាហ៍ទី ១-២',
            objective: 'ចូលរួមថែរក្សាបរិស្ថានសាលារៀន និងសហគមន៍',
            topics: ['អំណាន៖ ព្រៃឈើជាជីវិត', 'តែងសេចក្ដីពិពណ៌នា'],
            studentBookPages: 'ទំព័រ ៩០ - ៩៨',
            teacherBookPages: 'ទំព័រ ៩៥ - ១០៥',
          },
        ],
      },
    ],
  },
  {
    id: 'math',
    name: 'គណិតវិទ្យា',
    englishName: 'Mathematics',
    grade: 'ថ្នាក់ទី ៦',
    gradeLevel: 'ថ្នាក់ទី ៦',
    totalHours: '២៤០ ម៉ោង',
    weeklyHours: '៦ ម៉ោង/សប្តាហ៍',
    yearlyHours: '២៤០ ម៉ោង',
    icon: '📐',
    color: 'from-emerald-600 to-teal-700',
    colorTheme: 'emerald',
    description: 'កម្មវិធីសិក្សាគណិតវិទ្យាថ្នាក់ទី៦ ផ្ដោតលើប្រភាគ ទសភាគ ភាគរយ ធរណីមាត្រ និងចំណោទ។',
    officeInfo: 'នាយកដ្ឋានអភិវឌ្ឍកម្មវិធីសិក្សា ក្រសួងអប់រំ យុវជន និងកីឡា',
    authorInfo: 'គណៈកម្មការរៀបចំកម្មវិធីសិក្សាជាតិ',
    coreCompetencies: ['ការគណនាប្រភាគ និងទសភាគ', 'ការដោះស្រាយចំណោទអនុវត្តជាក់ស្ដែង', 'ការគណនាផ្ទៃក្រឡា និងមាឌ'],
    teachingStrategies: ['ការដោះស្រាយបញ្ហា (Problem-Based)', 'ការប្រើសម្ភារឧបទេស', 'ការហ្វឹកហាត់លំហាត់គន្លឹះ'],
    assessmentTools: ['កិច្ចការលំហាត់', 'តេស្តប្រចាំខែ', 'ការប្រឡងឆមាស'],
    trimesters: [
      {
        trimesterName: 'ត្រីមាសទី ១',
        title: 'ត្រីមាសទី ១',
        period: 'វិច្ឆិកា - មករា',
        chapters: [
          {
            chapterNo: 'មេរៀនទី ១',
            title: 'ចំនួនដល់ ១ ០០០ ០០០',
            hours: '១០ ម៉ោង',
            month: 'វិច្ឆិកា',
            weekNo: 'សប្តាហ៍ទី ១-២',
            objective: 'អាន សរសេរ និងប្រៀបធៀបចំនួនដល់ ១ ០០០ ០០០',
            topics: ['ការអាន និងសរសេរចំនួន', 'តម្លៃតាមខ្ទង់', 'ការប្រៀបធៀប និងរៀបលំដាប់'],
            studentBookPages: 'ទំព័រ ២ - ១០',
            teacherBookPages: 'ទំព័រ ៥ - ១៥',
          },
        ],
      },
      {
        trimesterName: 'ត្រីមាសទី ២',
        title: 'ត្រីមាសទី ២',
        period: 'កុម្ភៈ - មេសា',
        chapters: [
          {
            chapterNo: 'មេរៀនទី ៦',
            title: 'ប្រភាគ និងចំនួនចម្រុះ',
            hours: '១២ ម៉ោង',
            month: 'កុម្ភៈ',
            weekNo: 'សប្តាហ៍ទី ១-២',
            objective: 'បូក ដក គុណ ចែកប្រភាគ និងដោះស្រាយចំណោទ',
            topics: ['ប្រភាគស្មើគ្នា', 'វិធីបូកប្រភាគ', 'ចំណោទ'],
            studentBookPages: 'ទំព័រ ៣៥ - ៤៦',
            teacherBookPages: 'ទំព័រ ៤០ - ៥២',
          },
        ],
      },
      {
        trimesterName: 'ត្រីមាសទី ៣',
        title: 'ត្រីមាសទី ៣',
        period: 'ឧសភា - កក្កដា',
        chapters: [
          {
            chapterNo: 'មេរៀនទី ១២',
            title: 'ធរណីមាត្រ និងរង្វាស់រង្វាល់',
            hours: '១៤ ម៉ោង',
            month: 'ឧសភា',
            weekNo: 'សប្តាហ៍ទី ១-២',
            objective: 'គណនាបរិមាត្រ និងផ្ទៃក្រឡារូបធរណីមាត្រ',
            topics: ['ផ្ទៃក្រឡាចតុកោណកែង', 'មាឌប្រលេឡូពីប៉ែតកែង'],
            studentBookPages: 'ទំព័រ ៨០ - ៩២',
            teacherBookPages: 'ទំព័រ ៨៨ - ១០០',
          },
        ],
      },
    ],
  },
];
