import { HealthQCMQuestion } from '../healthEducationLessonsData';
import { HEALTH_LESSON_1_QUESTIONS } from './lesson1Questions';
import { HEALTH_LESSON_2_QUESTIONS } from './lesson2Questions';
import { HEALTH_LESSON_3_QUESTIONS } from './lesson3Questions';
import { HEALTH_LESSON_4_QUESTIONS } from './lesson4Questions';

export {
  HEALTH_LESSON_1_QUESTIONS,
  HEALTH_LESSON_2_QUESTIONS,
  HEALTH_LESSON_3_QUESTIONS,
  HEALTH_LESSON_4_QUESTIONS,
};

export interface HealthLessonPackage {
  id: string;
  lessonNumber: number;
  title: string;
  shortTitle: string;
  subtitle?: string;
  icon: string;
  description?: string;
  questions: HealthQCMQuestion[];
}

export const ALL_HEALTH_LESSONS_PACKAGES: HealthLessonPackage[] = [
  {
    id: 'health_l1',
    lessonNumber: 1,
    title: 'មេរៀនទី១ ៖ តុល្យភាពអាហារូបត្ថម្ភ (៤០ សំណួរ)',
    shortTitle: 'មេរៀនទី១ ៖ តុល្យភាពអាហារ',
    icon: '🥗',
    description: 'តុល្យភាពអាហារ និងសារធាតុចិញ្ចឹមចាំបាច់សម្រាប់រាងកាយ',
    questions: HEALTH_LESSON_1_QUESTIONS,
  },
  {
    id: 'health_l2',
    lessonNumber: 2,
    title: 'មេរៀនទី២ ៖ អនាម័យចំណីអាហារ និងទឹកស្អាត (៤០ សំណួរ)',
    shortTitle: 'មេរៀនទី២ ៖ អនាម័យអាហារ',
    icon: '🚰',
    description: 'សុវត្ថិភាពម្ហូបអាហារ ការរក្សាទុក និងការប្រើប្រាស់ទឹកស្អាត',
    questions: HEALTH_LESSON_2_QUESTIONS,
  },
  {
    id: 'health_l3',
    lessonNumber: 3,
    title: 'មេរៀនទី៣ ៖ ការថែរក្សាអនាម័យខ្លួនប្រាណ (៤០ សំណួរ)',
    shortTitle: 'មេរៀនទី៣ ៖ អនាម័យខ្លួនប្រាណ',
    icon: '🧼',
    description: 'អនាម័យមាត់ធ្មេញ ស្បែក សក់ និងការការពារមេរោគឆ្លង',
    questions: HEALTH_LESSON_3_QUESTIONS,
  },
  {
    id: 'health_l4',
    lessonNumber: 4,
    title: 'មេរៀនទី៤ ៖ ការការពារជំងឺឆ្លង និងសុខភាពផ្លូវចិត្ត (៤០ សំណួរ)',
    shortTitle: 'មេរៀនទី៤ ៖ ការពារជំងឺឆ្លង',
    icon: '🛡️',
    description: 'វិធានការបង្ការជំងឺឆ្លង និងការថែទាំសុខភាពផ្លូវចិត្ត',
    questions: HEALTH_LESSON_4_QUESTIONS,
  },
];

export const getHealthLessonPackage = (lessonNumber: number): HealthLessonPackage | undefined => {
  return ALL_HEALTH_LESSONS_PACKAGES.find((pkg) => pkg.lessonNumber === lessonNumber);
};
