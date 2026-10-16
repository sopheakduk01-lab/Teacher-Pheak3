export interface LessonPlanDetail {
  id: string;
  lessonNo: string;
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  objectives: {
    knowledge: string;
    skills: string;
    attitude: string;
  };
  materials: string[];
  steps: {
    step: number;
    title: string;
    teacherActivities: string;
    studentActivities: string;
    timing: string;
  }[];
  evaluation: string;
  homework: string;
  slides?: {
    title: string;
    content: string;
    bulletPoints: string[];
  }[];
}

export const subjectsList: string[] = [
  'ភាសាខ្មែរ',
  'គណិតវិទ្យា',
  'វិទ្យាសាស្ត្រ',
  'សិក្សាសង្គម',
  'ភាសាអង់គ្លេស',
];

export const khmerLessonPlansList: LessonPlanDetail[] = [
  {
    id: 'kh-l1',
    lessonNo: 'មេរៀនទី ១',
    title: 'ការគួរសម និងការគោរពវិន័យ',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី ៦',
    durationMinutes: 50,
    objectives: {
      knowledge: 'សិស្សយល់ច្បាស់ពីសារៈសំខាន់នៃការគួរសម និងវិន័យក្នុងថ្នាក់រៀន។',
      skills: 'សិស្សចេះអនុវត្តកាយវិការគួរសម និងការនិយាយស្តីសមរម្យ។',
      attitude: 'បណ្តុះស្មារតីគោរពគ្នាទៅវិញទៅមក និងគោរពច្បាប់សាលា។',
    },
    materials: ['សៀវភៅពុម្ពភាសាខ្មែរថ្នាក់ទី៦', 'ផ្ទាំងរូបភាពគំនូរគំរូ', 'ស្លាយបទបង្ហាញ'],
    steps: [
      {
        step: 1,
        title: 'រដ្ឋបាលថ្នាក់ និងពិនិត្យអនាម័យ',
        teacherActivities: 'ពិនិត្យវត្តមាន និងអនាម័យសិស្ស',
        studentActivities: 'រាយការណ៍វត្តមាន និងត្រៀមសម្ភារ',
        timing: '៥ នាទី',
      },
      {
        step: 2,
        title: 'រំលឹកមេរៀនចាស់',
        teacherActivities: 'សួរសំណួរខ្លីៗពីរឿងមុន',
        studentActivities: 'ឆ្លើយសំណួរតាមការយល់ឃើញ',
        timing: '៥ នាទី',
      },
      {
        step: 3,
        title: 'មេរៀនថ្មី',
        teacherActivities: 'ពន្យល់ខ្លឹមសារមេរៀន និងបង្ហាញស្លាយ',
        studentActivities: 'ស្តាប់ ពិភាក្សាជាក្រុម និងកត់ត្រា',
        timing: '២៥ នាទី',
      },
      {
        step: 4,
        title: 'ពង្រឹងចំណេះដឹង',
        teacherActivities: 'ដាក់សំណួរសួរដេញដោល និងល្បែងសិក្សា',
        studentActivities: 'ឆ្លើយជាបុគ្គល និងជាក្រុម',
        timing: '១០ នាទី',
      },
      {
        step: 5,
        title: 'កិច្ចការផ្ទះ និងបណ្តាំផ្ញើ',
        teacherActivities: 'ដាក់កិច្ចការផ្ទះ និងណែនាំឲ្យរៀបចំសម្ភារ',
        studentActivities: 'កត់ត្រាកិច្ចការផ្ទះ',
        timing: '៥ នាទី',
      },
    ],
    evaluation: 'សិស្ស ៨៥% អាចពន្យល់ និងសម្តែងកាយវិការគួរសមបានត្រឹមត្រូវ។',
    homework: 'សរសេររៀបរាប់ពីអំពើល្អមួយដែលអ្នកបានធ្វើកាលពីសប្តាហ៍មុន (៥-៧ បន្ទាត់)។',
    slides: [
      {
        title: 'ការគួរសម និងវិន័យ',
        content: 'មេរៀនទី ១ ភាសាខ្មែរ ថ្នាក់ទី៦',
        bulletPoints: ['សេចក្តីថ្លៃថ្នូរ', 'ការគោរពចាស់ទុំ', 'ការរស់នៅចុះសម្រុងគ្នា'],
      },
      {
        title: 'សកម្មភាពសិស្ស',
        content: 'ការពិភាក្សាជាក្រុមតូចៗ',
        bulletPoints: ['ពិភាក្សាលើករណីសិក្សា', 'សម្តែងតួអង្គ', 'ឆ្លើយសំនួរ'],
      },
    ],
  },
  {
    id: 'math-l1',
    lessonNo: 'មេរៀនទី ១',
    title: 'ចំនួនរាប់ និងលំដាប់លំដោយ',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី ៦',
    durationMinutes: 50,
    objectives: {
      knowledge: 'សិស្សចេះអាន សរសេរ និងប្រៀបធៀបចំនួនរាប់ធំជាង ១ ០០០ ០០០។',
      skills: 'សិស្សចេះរៀបលំដាប់ចំនួនពីតូចទៅធំ និងពីធំទៅតូច។',
      attitude: 'ស្រឡាញ់ការរៀនគណិតវិទ្យា និងមានភាពហ្មត់ចត់។',
    },
    materials: ['ក្តារខៀន', 'កាតលេខ', 'សៀវភៅគណិតវិទ្យាថ្នាក់ទី៦'],
    steps: [
      {
        step: 1,
        title: 'រដ្ឋបាល និងត្រួតពិនិត្យ',
        teacherActivities: 'ពិនិត្យវត្តមាន',
        studentActivities: 'អង្គុយតាមលំដាប់',
        timing: '៥ នាទី',
      },
      {
        step: 2,
        title: 'មេរៀនថ្មី',
        teacherActivities: 'ណែនាំតារាងខ្ទង់ និងថ្នាក់នៃចំនួន',
        studentActivities: 'ចូលរួមកត់ត្រា និងអនុវត្តលំហាត់',
        timing: '៣០ នាទី',
      },
      {
        step: 3,
        title: 'វាយតម្លៃ',
        teacherActivities: 'ឲ្យសិស្សឡើងធ្វើលំហាត់លើក្តារខៀន',
        studentActivities: 'ធ្វើលំហាត់',
        timing: '១៥ នាទី',
      },
    ],
    evaluation: 'សិស្សភាគច្រើនយល់ច្បាស់ពីថ្នាក់ និងខ្ទង់នៃចំនួន។',
    homework: 'ធ្វើលំហាត់ទំព័រទី ៨ ក្នុងសៀវភៅពុម្ព។',
  },
];
