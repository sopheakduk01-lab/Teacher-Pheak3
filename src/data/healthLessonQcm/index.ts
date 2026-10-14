import { Quiz } from '../../types';
import { HealthQCMQuestion } from '../healthEducationLessonsData';
import { HealthLessonPackage } from './types';
import {
  HEALTH_LESSON_1_QUESTIONS,
  HEALTH_LESSON_2_QUESTIONS,
  HEALTH_LESSON_3_QUESTIONS,
  HEALTH_LESSON_4_QUESTIONS,
} from './lessons1to4';
import {
  HEALTH_LESSON_5_QUESTIONS,
  HEALTH_LESSON_6_QUESTIONS,
  HEALTH_LESSON_7_QUESTIONS,
  HEALTH_LESSON_8_QUESTIONS,
} from './lessons5to8';
import {
  HEALTH_LESSON_9_QUESTIONS,
  HEALTH_LESSON_10_QUESTIONS,
} from './lessons9to10';
import {
  HEALTH_LESSON_11_QUESTIONS,
  HEALTH_LESSON_12_QUESTIONS,
  HEALTH_LESSON_13_QUESTIONS,
  HEALTH_LESSON_14_QUESTIONS,
} from './lessons11to14';
import {
  HEALTH_LESSON_15_QUESTIONS,
  HEALTH_LESSON_16_QUESTIONS,
  HEALTH_LESSON_17_QUESTIONS,
  HEALTH_LESSON_18_QUESTIONS,
} from './lessons15to18';

export * from './types';
export * from './lessons1to4';
export * from './lessons5to8';
export * from './lessons9to10';
export * from './lessons11to14';
export * from './lessons15to18';

// Helper to convert HealthQCMQuestion[] into a playable Quiz
function createHealthQuizItem(
  lessonNumber: number,
  title: string,
  questions: HealthQCMQuestion[],
  imageUrl: string
): Quiz {
  return {
    id: `quiz-health-lesson${lessonNumber}-40q`,
    title: `វិញ្ញាសា QCM ៤០ សំណួរ ៖ អប់រំសុខភាព ${title}`,
    subject: 'អប់រំសុខភាព',
    grade: 'ថ្នាក់ទី ៦',
    questionCount: 40,
    isPublic: true,
    imageUrl,
    examDuration: '៦០ នាទី',
    sheetType: 'exam',
    questions: questions.map((q) => ({
      id: q.id,
      type: 'qcm' as const,
      question: q.question,
      timeLimit: 40,
      points: 1000,
      explanation: q.explanation,
      options: q.options.map((opt, oIdx) => ({
        id: String.fromCharCode(97 + oIdx),
        text: opt.text,
        isCorrect: opt.isCorrect,
        color: (['red', 'blue', 'yellow', 'green'] as const)[oIdx % 4],
        shape: ['▲', '◆', '●', '■'][oIdx % 4],
      })),
    })),
  };
}

// 18 Comprehensive Health Education Lesson Packages (40 Questions each)
export const ALL_HEALTH_LESSONS_PACKAGES: HealthLessonPackage[] = [
  // ---------- សមាសភាគទី១ ៖ សុខភាពបឋម (មេរៀនទី ១ ដល់ ៨) ----------
  {
    lessonNumber: 1,
    title: 'មេរៀនទី ១ ៖ តុល្យភាពអាហារ',
    shortTitle: 'តុល្យភាពអាហារ',
    sectionId: 'comp1_nutrition_hygiene',
    sectionNumber: 1,
    sectionTitle: 'សមាសភាគទី១ ៖ សុខភាពបឋម',
    summary: 'ការបរិភោគអាហារចម្រុះមុខតាមពីរ៉ាមីតអាហារ ក្រុមសារធាតុចិញ្ចឹមទាំង៥ និងការរក្សាទម្ងន់សុខភាព',
    icon: '🥗',
    color: 'from-emerald-600 to-teal-700',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    questions: HEALTH_LESSON_1_QUESTIONS,
    quizItem: createHealthQuizItem(1, 'មេរៀនទី ១ ៖ តុល្យភាពអាហារ', HEALTH_LESSON_1_QUESTIONS, 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800'),
  },
  {
    lessonNumber: 2,
    title: 'មេរៀនទី ២ ៖ ការតាមដានទម្ងន់និងកម្ពស់',
    shortTitle: 'ទម្ងន់និងកម្ពស់',
    sectionId: 'comp1_nutrition_hygiene',
    sectionNumber: 1,
    sectionTitle: 'សមាសភាគទី១ ៖ សុខភាពបឋម',
    summary: 'បច្ចេកទេសថ្លឹងទម្ងន់និងវាស់កម្ពស់ត្រឹមត្រូវ ការគណនា BMI និងការតាមដានការលូតលាស់តាមស្តង់ដារ MoEYS',
    icon: '📏',
    color: 'from-teal-600 to-cyan-700',
    gradient: 'from-teal-600 via-cyan-600 to-blue-700',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    questions: HEALTH_LESSON_2_QUESTIONS,
    quizItem: createHealthQuizItem(2, 'មេរៀនទី ២ ៖ ការតាមដានទម្ងន់និងកម្ពស់', HEALTH_LESSON_2_QUESTIONS, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'),
  },
  {
    lessonNumber: 3,
    title: 'មេរៀនទី ៣ ៖ ទំនាក់ទំនងរវាងរបបអាហារនិងជំងឺ',
    shortTitle: 'របបអាហារនិងជំងឺ',
    sectionId: 'comp1_nutrition_hygiene',
    sectionNumber: 1,
    sectionTitle: 'សមាសភាគទី១ ៖ សុខភាពបឋម',
    summary: 'ហានិភ័យនៃចំណីអាហារប្រៃ ផ្អែម ខ្លាញ់ ជំងឺមិនឆ្លង (លើសឈាម ទឹកនោមផ្អែម បេះដូង) និងវិធានការបង្ការ',
    icon: '🩺',
    color: 'from-cyan-600 to-blue-700',
    gradient: 'from-cyan-600 via-blue-600 to-indigo-700',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    questions: HEALTH_LESSON_3_QUESTIONS,
    quizItem: createHealthQuizItem(3, 'មេរៀនទី ៣ ៖ ទំនាក់ទំនងរវាងរបបអាហារនិងជំងឺ', HEALTH_LESSON_3_QUESTIONS, 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800'),
  },
  {
    lessonNumber: 4,
    title: 'មេរៀនទី ៤ ៖ សុវត្ថិភាពចំណីអាហារ (កូនសោគន្លឹះ ៥)',
    shortTitle: 'សុវត្ថិភាពចំណីអាហារ',
    sectionId: 'comp1_nutrition_hygiene',
    sectionNumber: 1,
    sectionTitle: 'សមាសភាគទី១ ៖ សុខភាពបឋម',
    summary: 'វិធានការ ៥ យ៉ាងរបស់ WHO ក្នុងការរៀបចំ ទុកដាក់ ចម្អិនម្ហូប និងការការពារការពុលចំណីអាហារ',
    icon: '🛡️',
    color: 'from-emerald-600 to-teal-800',
    gradient: 'from-emerald-600 via-teal-700 to-green-800',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    questions: HEALTH_LESSON_4_QUESTIONS,
    quizItem: createHealthQuizItem(4, 'មេរៀនទី ៤ ៖ សុវត្ថិភាពចំណីអាហារ', HEALTH_LESSON_4_QUESTIONS, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'),
  },
  {
    lessonNumber: 5,
    title: 'មេរៀនទី ៥ ៖ ទឹកសុវត្ថិភាព និង F-Diagram',
    shortTitle: 'ទឹកសុវត្ថិភាព & F-Diagram',
    sectionId: 'comp1_nutrition_hygiene',
    sectionNumber: 1,
    sectionTitle: 'សមាសភាគទី១ ៖ សុខភាពបឋម',
    summary: 'ផ្លូវចម្លងមេរោគពីលាមកតាមទឹក ម្រាមដៃ រុយ ដី និងវិធីសម្លាប់មេរោគក្នុងទឹក (ដាំពុះ SODIS ក្លរីន)',
    icon: '🚰',
    color: 'from-blue-600 to-cyan-700',
    gradient: 'from-blue-600 via-cyan-600 to-teal-700',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800',
    questions: HEALTH_LESSON_5_QUESTIONS,
    quizItem: createHealthQuizItem(5, 'មេរៀនទី ៥ ៖ ទឹកសុវត្ថិភាព និង F-Diagram', HEALTH_LESSON_5_QUESTIONS, 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800'),
  },
  {
    lessonNumber: 6,
    title: 'មេរៀនទី ៦ ៖ អនាម័យនៅផ្ទះ (ចង្ក្រាន បង្គន់ បន្ទប់គេង)',
    shortTitle: 'អនាម័យនៅផ្ទះ',
    sectionId: 'comp1_nutrition_hygiene',
    sectionNumber: 1,
    sectionTitle: 'សមាសភាគទី១ ៖ សុខភាពបឋម',
    summary: 'ការថែរក្សាអនាម័យចង្ក្រានបាយ បង្គន់អនាម័យ បន្ទប់គេង និងការការពារសត្វល្អិតចម្លងរោគ',
    icon: '🏠',
    color: 'from-amber-600 to-orange-700',
    gradient: 'from-amber-600 via-orange-600 to-rose-700',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
    questions: HEALTH_LESSON_6_QUESTIONS,
    quizItem: createHealthQuizItem(6, 'មេរៀនទី ៦ ៖ អនាម័យនៅផ្ទះ', HEALTH_LESSON_6_QUESTIONS, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'),
  },
  {
    lessonNumber: 7,
    title: 'មេរៀនទី ៧ ៖ សុខភាពមាត់ធ្មេញ និងភ្នែក',
    shortTitle: 'មាត់ធ្មេញ & ភ្នែក',
    sectionId: 'comp1_nutrition_hygiene',
    sectionNumber: 1,
    sectionTitle: 'សមាសភាគទី១ ៖ សុខភាពបឋម',
    summary: 'ទំនាក់ទំនងរវាងមាត់ធ្មេញនិងជំងឺរ៉ាំរ៉ៃ កំហុសកំណុំរូបភាពភ្នែកទាំង៤ និងច្បាប់ថែទាំភ្នែក ២០-២០-២០',
    icon: '🦷',
    color: 'from-sky-600 to-blue-800',
    gradient: 'from-sky-600 via-blue-700 to-indigo-800',
    imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
    questions: HEALTH_LESSON_7_QUESTIONS,
    quizItem: createHealthQuizItem(7, 'មេរៀនទី ៧ ៖ សុខភាពមាត់ធ្មេញ និងភ្នែក', HEALTH_LESSON_7_QUESTIONS, 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800'),
  },
  {
    lessonNumber: 8,
    title: 'មេរៀនទី ៨ ៖ ជំងឺដង្កូវព្រូន និងជំងឺឆ្កែឆ្កួត',
    shortTitle: 'ព្រូន & ឆ្កែឆ្កួត',
    sectionId: 'comp1_nutrition_hygiene',
    sectionNumber: 1,
    sectionTitle: 'សមាសភាគទី១ ៖ សុខភាពបឋម',
    summary: 'ប្រភេទព្រូនទំពក់ អៀន តេញ៉ា ការទម្លាក់ព្រូន ៦ខែម្តង និងវិធានការសង្គ្រោះបន្ទាន់ពេលឆ្កែខាំ (លាងសាប៊ូ ១៥នាទី)',
    icon: '🐕',
    color: 'from-rose-600 to-red-800',
    gradient: 'from-rose-600 via-red-600 to-rose-900',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
    questions: HEALTH_LESSON_8_QUESTIONS,
    quizItem: createHealthQuizItem(8, 'មេរៀនទី ៨ ៖ ជំងឺដង្កូវព្រូន និងជំងឺឆ្កែឆ្កួត', HEALTH_LESSON_8_QUESTIONS, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800'),
  },

  // ---------- សមាសភាគទី២ ៖ សុខភាពផ្លូវចិត្ត (មេរៀនទី ៩ ដល់ ១០) ----------
  {
    lessonNumber: 9,
    title: 'មេរៀនទី ៩ ៖ សម្ពាធអវិជ្ជមាន និងការគ្រប់គ្រងអារម្មណ៍',
    shortTitle: 'សម្ពាធមិត្ត & គ្រប់គ្រងអារម្មណ៍',
    sectionId: 'comp2_mental_health',
    sectionNumber: 2,
    sectionTitle: 'សមាសភាគទី២ ៖ សុខភាពផ្លូវចិត្ត',
    summary: 'វិធីទប់ទល់សម្ពាធអវិជ្ជមាន ភាពក្លាហានក្នុងការនិយាយថា «ទេ» និងបច្ចេកទេសដកដង្ហើមបន្ថយភាពតានតឹង',
    icon: '🧠',
    color: 'from-indigo-600 to-purple-800',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800',
    questions: HEALTH_LESSON_9_QUESTIONS,
    quizItem: createHealthQuizItem(9, 'មេរៀនទី ៩ ៖ សម្ពាធអវិជ្ជមាន និងការគ្រប់គ្រងអារម្មណ៍', HEALTH_LESSON_9_QUESTIONS, 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800'),
  },
  {
    lessonNumber: 10,
    title: 'មេរៀនទី ១០ ៖ ទំនាក់ទំនងនៅពេលពេញវ័យ',
    shortTitle: 'ទំនាក់ទំនងពេញវ័យ',
    sectionId: 'comp2_mental_health',
    sectionNumber: 2,
    sectionTitle: 'សមាសភាគទី២ ៖ សុខភាពផ្លូវចិត្ត',
    summary: 'ការកសាងមិត្តភាពល្អ ទំនាក់ទំនងក្នុងគ្រួសារ សីលធម៌នៃការប្រាស្រ័យទាក់ទង និងការដោះស្រាយទំនាស់ដោយសន្តិវិធី',
    icon: '🤝',
    color: 'from-purple-600 to-indigo-800',
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
    questions: HEALTH_LESSON_10_QUESTIONS,
    quizItem: createHealthQuizItem(10, 'មេរៀនទី ១០ ៖ ទំនាក់ទំនងនៅពេលពេញវ័យ', HEALTH_LESSON_10_QUESTIONS, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800'),
  },

  // ---------- សមាសភាគទី៣ ៖ សុខភាពបន្តពូជ និងផ្លូវភេទ (មេរៀនទី ១១ ដល់ ១៦) ----------
  {
    lessonNumber: 11,
    title: 'មេរៀនទី ១១ ៖ ការប្រើប្រាស់អ៊ីនធឺណិត និងបណ្តាញសង្គម',
    shortTitle: 'សុវត្ថិភាពអ៊ីនធឺណិត',
    sectionId: 'comp3_reproductive_health',
    sectionNumber: 3,
    sectionTitle: 'សមាសភាគទី៣ ៖ សុខភាពបន្តពូជ និងផ្លូវភេទ',
    summary: 'អត្ថប្រយោជន៍និងគ្រោះថ្នាក់តាមអនឡាញ ការការពារពីការកេងប្រវ័ញ្ចផ្លូវភេទ និងការរក្សាការសម្ងាត់ផ្ទាល់ខ្លួន',
    icon: '🌐',
    color: 'from-blue-600 to-cyan-800',
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    questions: HEALTH_LESSON_11_QUESTIONS,
    quizItem: createHealthQuizItem(11, 'មេរៀនទី ១១ ៖ ការប្រើប្រាស់អ៊ីនធឺណិត និងបណ្តាញសង្គម', HEALTH_LESSON_11_QUESTIONS, 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800'),
  },
  {
    lessonNumber: 12,
    title: 'មេរៀនទី ១២ ៖ ការបៀតបៀនផ្លូវភេទ និងអំពើហិង្សា',
    shortTitle: 'ការបៀតបៀន & អំពើហិង្សា',
    sectionId: 'comp3_reproductive_health',
    sectionNumber: 3,
    sectionTitle: 'សមាសភាគទី៣ ៖ សុខភាពបន្តពូជ និងផ្លូវភេទ',
    summary: 'ទម្រង់បៀតបៀនផ្លូវភេទ ៣យ៉ាង ប្រភេទអំពើហិង្សា ៤យ៉ាង ព្រំដែនរាងកាយ និងវិធានការស្វែងរកជំនួយ',
    icon: '🛡️',
    color: 'from-rose-600 to-pink-800',
    gradient: 'from-rose-600 via-pink-700 to-purple-800',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    questions: HEALTH_LESSON_12_QUESTIONS,
    quizItem: createHealthQuizItem(12, 'មេរៀនទី ១២ ៖ ការបៀតបៀនផ្លូវភេទ និងអំពើហិង្សា', HEALTH_LESSON_12_QUESTIONS, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'),
  },
  {
    lessonNumber: 13,
    title: 'មេរៀនទី ១៣ ៖ ចំណង់ផ្លូវភេទ និងការពន្យារពេលរួមភេទ',
    shortTitle: 'ចំណង់ផ្លូវភេទ & ពន្យារពេលរួមភេទ',
    sectionId: 'comp3_reproductive_health',
    sectionNumber: 3,
    sectionTitle: 'សមាសភាគទី៣ ៖ សុខភាពបន្តពូជ និងផ្លូវភេទ',
    summary: 'ការយល់ដឹងពីចំណង់ផ្លូវភេទជាធម្មជាតិ គុណសម្បត្តិនៃការពន្យារពេលរួមភេទ និងការផ្តោតលើការសិក្សា',
    icon: '🌱',
    color: 'from-emerald-600 to-teal-800',
    gradient: 'from-emerald-600 via-green-600 to-teal-800',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    questions: HEALTH_LESSON_13_QUESTIONS,
    quizItem: createHealthQuizItem(13, 'មេរៀនទី ១៣ ៖ ចំណង់ផ្លូវភេទ និងការពន្យារពេលរួមភេទ', HEALTH_LESSON_13_QUESTIONS, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'),
  },
  {
    lessonNumber: 14,
    title: 'មេរៀនទី ១៤ ៖ សិទ្ធិសុខភាពផ្លូវភេទ និងអនាម័យបន្តពូជ',
    shortTitle: 'សិទ្ធិទាំង១០ & អនាម័យបន្តពូជ',
    sectionId: 'comp3_reproductive_health',
    sectionNumber: 3,
    sectionTitle: 'សមាសភាគទី៣ ៖ សុខភាពបន្តពូជ និងផ្លូវភេទ',
    summary: 'សិទ្ធិសុខភាពផ្លូវភេទទាំង ១០ អនាម័យប្រដាប់បន្តពូជស្រី (ជូតពីមុខទៅក្រោយ) និងប្រុស ព្រមទាំងការប្រែប្រួលរាងកាយ',
    icon: '🌸',
    color: 'from-pink-600 to-rose-700',
    gradient: 'from-pink-600 via-rose-600 to-purple-700',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800',
    questions: HEALTH_LESSON_14_QUESTIONS,
    quizItem: createHealthQuizItem(14, 'មេរៀនទី ១៤ ៖ សិទ្ធិសុខភាពផ្លូវភេទ និងអនាម័យបន្តពូជ', HEALTH_LESSON_14_QUESTIONS, 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800'),
  },
  {
    lessonNumber: 15,
    title: 'មេរៀនទី ១៥ ៖ ជំងឺកាមរោគ (STIs) និងមេរោគអេដស៍ (HIV/AIDS)',
    shortTitle: 'ជំងឺ STIs & HIV/AIDS',
    sectionId: 'comp3_reproductive_health',
    sectionNumber: 3,
    sectionTitle: 'សមាសភាគទី៣ ៖ សុខភាពបន្តពូជ និងផ្លូវភេទ',
    summary: 'រោគសញ្ញាកាមរោគ ៣ ផ្លូវចម្លង HIV ការមិនចម្លង ការធ្វើតេស្តឈាម ថ្នាំ ARV និងការមិនរើសអើង',
    icon: '🎗️',
    color: 'from-red-600 to-rose-800',
    gradient: 'from-red-600 via-rose-700 to-pink-800',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800',
    questions: HEALTH_LESSON_15_QUESTIONS,
    quizItem: createHealthQuizItem(15, 'មេរៀនទី ១៥ ៖ ជំងឺកាមរោគ និងមេរោគអេដស៍', HEALTH_LESSON_15_QUESTIONS, 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800'),
  },
  {
    lessonNumber: 16,
    title: 'មេរៀនទី ១៦ ៖ គោលដៅអនាគត និង ៦ ជំហានរៀបចំផែនការ',
    shortTitle: 'គោលដៅអនាគត & ផែនការ',
    sectionId: 'comp3_reproductive_health',
    sectionNumber: 3,
    sectionTitle: 'សមាសភាគទី៣ ៖ សុខភាពបន្តពូជ និងផ្លូវភេទ',
    summary: 'ការកំណត់គោលដៅជីវិតរយៈពេលខ្លីនិងវែង ៦ ជំហានរៀបចំផែនការ គោលការណ៍ SMART និងការជំនះឧបសគ្គ',
    icon: '🎯',
    color: 'from-amber-600 to-yellow-700',
    gradient: 'from-amber-600 via-yellow-600 to-orange-700',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    questions: HEALTH_LESSON_16_QUESTIONS,
    quizItem: createHealthQuizItem(16, 'មេរៀនទី ១៦ ៖ គោលដៅអនាគត និងការរៀបចំផែនការ', HEALTH_LESSON_16_QUESTIONS, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800'),
  },

  // ---------- សមាសភាគទី៤ ៖ សុខភាព និងបរិស្ថាន (មេរៀនទី ១៧ ដល់ ១៨) ----------
  {
    lessonNumber: 17,
    title: 'មេរៀនទី ១៧ ៖ វិធានការសង្គ្រោះបឋម (First Aid)',
    shortTitle: 'វិធានការសង្គ្រោះបឋម',
    sectionId: 'comp4_environment_first_aid',
    sectionNumber: 4,
    sectionTitle: 'សមាសភាគទី៤ ៖ សុខភាព និងបរិស្ថាន',
    summary: 'សង្គ្រោះបឋមរលាកភ្លើង ហូរឈាមច្រមុះ ឈ្លក់/ស្លាក់ (Heimlich) គ្រេចថ្លោះ (RICE) និងលេខសង្គ្រោះបន្ទាន់ ១១៩',
    icon: '🩹',
    color: 'from-red-600 to-orange-700',
    gradient: 'from-red-600 via-orange-600 to-amber-700',
    imageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800',
    questions: HEALTH_LESSON_17_QUESTIONS,
    quizItem: createHealthQuizItem(17, 'មេរៀនទី ១៧ ៖ វិធានការសង្គ្រោះបឋម', HEALTH_LESSON_17_QUESTIONS, 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800'),
  },
  {
    lessonNumber: 18,
    title: 'មេរៀនទី ១៨ ៖ ការបំពុលខ្យល់ និងការរំខានដោយសំឡេង',
    shortTitle: 'ការបំពុលខ្យល់ & សំឡេង',
    sectionId: 'comp4_environment_first_aid',
    sectionNumber: 4,
    sectionTitle: 'សមាសភាគទី៤ ៖ សុខភាព និងបរិស្ថាន',
    summary: 'ផលប៉ះពាល់នៃការដុតសំរាម ធូលី PM2.5 កម្រិតសំឡេងលើសពី ៦៥ dB ការពារសោតវិញ្ញាណ និងការដាំដើមឈើ',
    icon: '🌳',
    color: 'from-emerald-600 to-teal-800',
    gradient: 'from-emerald-600 via-teal-700 to-green-800',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    questions: HEALTH_LESSON_18_QUESTIONS,
    quizItem: createHealthQuizItem(18, 'មេរៀនទី ១៨ ៖ ការបំពុលខ្យល់ និងការរំខានដោយសំឡេង', HEALTH_LESSON_18_QUESTIONS, 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'),
  },
];

// Get package by lesson number
export function getHealthLessonPackage(lessonNumber: number): HealthLessonPackage {
  return (
    ALL_HEALTH_LESSONS_PACKAGES.find((l) => l.lessonNumber === lessonNumber) ||
    ALL_HEALTH_LESSONS_PACKAGES[0]
  );
}

// Get all packages
export function getAllHealthLessonsPackages(): HealthLessonPackage[] {
  return ALL_HEALTH_LESSONS_PACKAGES;
}

// Get all as playable quizzes
export function getAllHealthLessonQuizItems(): Quiz[] {
  return ALL_HEALTH_LESSONS_PACKAGES.map((p) => p.quizItem);
}
