import { Quiz } from '../../types';
import { MathQCMQuestion, MathFormulaSection, MathLessonMeta } from '../mathQcmTypes';
import {
  LESSON_1_QUESTIONS,
  MATH_LESSON_1_FORMULAS,
  mathLesson1QuizItem,
} from '../mathLesson1Exam40Q';

import { LESSON_2_QUESTIONS, LESSON_2_FORMULAS } from './lesson2';
import { LESSON_3_QUESTIONS, LESSON_3_FORMULAS } from './lesson3';
import { LESSON_4_QUESTIONS, LESSON_4_FORMULAS } from './lesson4';
import { LESSON_5_QUESTIONS, LESSON_5_FORMULAS } from './lesson5';
import { LESSON_6_QUESTIONS, LESSON_6_FORMULAS } from './lesson6';
import { LESSON_7_QUESTIONS, LESSON_7_FORMULAS } from './lesson7';
import { LESSON_8_QUESTIONS, LESSON_8_FORMULAS } from './lesson8';
import { LESSON_9_QUESTIONS, LESSON_9_FORMULAS } from './lesson9';
import { LESSON_10_QUESTIONS, LESSON_10_FORMULAS } from './lesson10';
import { LESSON_11_QUESTIONS, LESSON_11_FORMULAS } from './lesson11';
import { LESSON_12_QUESTIONS, LESSON_12_FORMULAS } from './lesson12';
import { LESSON_13_QUESTIONS, LESSON_13_FORMULAS } from './lesson13';
import { LESSON_14_QUESTIONS, LESSON_14_FORMULAS } from './lesson14';
import { LESSON_15_QUESTIONS, LESSON_15_FORMULAS } from './lesson15';
import { LESSON_16_QUESTIONS, LESSON_16_FORMULAS } from './lesson16';
import { LESSON_17_QUESTIONS, LESSON_17_FORMULAS } from './lesson17';
import { LESSON_18_QUESTIONS, LESSON_18_FORMULAS } from './lesson18';
import { LESSON_19_QUESTIONS, LESSON_19_FORMULAS } from './lesson19';
import { LESSON_20_QUESTIONS, LESSON_20_FORMULAS } from './lesson20';

// Metadata and Package interface
export interface MathLessonPackage {
  lessonNumber: number;
  title: string;
  shortTitle: string;
  summary: string;
  startPage: number;
  endPage: number;
  icon: string;
  color: string;
  imageUrl: string;
  questions: MathQCMQuestion[];
  formulas: MathFormulaSection[];
  quizItem: Quiz;
}

// Helper to convert questions into standard Quiz item
function createMathLessonQuizItem(
  lessonNumber: number,
  title: string,
  questions: MathQCMQuestion[],
  imageUrl: string
): Quiz {
  return {
    id: `quiz-math-lesson${lessonNumber}-40q`,
    title: `វិញ្ញាសា QCM ៤០ សំណួរ ៖ គណិតវិទ្យា ${title}`,
    subject: 'គណិតវិទ្យា',
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
      timeLimit: 45,
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

// 20 Math Lesson Packages Definition
export const ALL_MATH_LESSONS_PACKAGES: MathLessonPackage[] = [
  {
    lessonNumber: 1,
    title: 'មេរៀនទី ១ ៖ ចំនួន',
    shortTitle: 'ចំនួន',
    summary: 'ការអាន និងសរសេរចំនួនធំដល់លាន ថ្នាក់ និងខ្ទង់ ការប្រៀបធៀប និងការបង្គត់ចំនួន',
    startPage: 1,
    endPage: 10,
    icon: '🔢',
    color: 'from-blue-600 to-indigo-700',
    imageUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_1_QUESTIONS,
    formulas: MATH_LESSON_1_FORMULAS,
    quizItem: mathLesson1QuizItem as unknown as Quiz,
  },
  {
    lessonNumber: 2,
    title: 'មេរៀនទី ២ ៖ ចំនួនទសភាគ',
    shortTitle: 'ចំនួនទសភាគ',
    summary: 'អំណាន សំណេរចំនួនទសភាគ ខ្ទង់ទសភាគ ចំនួនស្មើគ្នា ការបង្គត់ និងការប្រៀបធៀប',
    startPage: 11,
    endPage: 18,
    icon: '🔟',
    color: 'from-cyan-600 to-teal-700',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_2_QUESTIONS,
    formulas: LESSON_2_FORMULAS,
    quizItem: createMathLessonQuizItem(
      2,
      'មេរៀនទី២ (ចំនួនទសភាគ)',
      LESSON_2_QUESTIONS,
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 3,
    title: 'មេរៀនទី ៣ ៖ វិធីបូក និងវិធីដកចំនួនទសភាគ',
    shortTitle: 'បូកដកទសភាគ',
    summary: 'វិធីបូក និងដកចំនួនទសភាគគ្រប់ករណី ការប៉ាន់ស្មានផលបូក និងចំណោទជីវភាព',
    startPage: 19,
    endPage: 26,
    icon: '➕',
    color: 'from-emerald-600 to-green-700',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_3_QUESTIONS,
    formulas: LESSON_3_FORMULAS,
    quizItem: createMathLessonQuizItem(
      3,
      'មេរៀនទី៣ (វិធីបូក និងវិធីដកចំនួនទសភាគ)',
      LESSON_3_QUESTIONS,
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 4,
    title: 'មេរៀនទី ៤ ៖ កន្លះបន្ទាត់ពុះមុំ និងសំណង់មុំ',
    shortTitle: 'កន្លះបន្ទាត់ពុះមុំ',
    summary: 'និយមន័យកន្លះបន្ទាត់ពុះមុំ សំណង់ដោយដែកឈាន និងបន្ទាត់ សំណង់មុំ 60° និង 90°',
    startPage: 27,
    endPage: 32,
    icon: '📐',
    color: 'from-amber-600 to-orange-700',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_4_QUESTIONS,
    formulas: LESSON_4_FORMULAS,
    quizItem: createMathLessonQuizItem(
      4,
      'មេរៀនទី៤ (កន្លះបន្ទាត់ពុះមុំ និងសំណង់មុំ)',
      LESSON_4_QUESTIONS,
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 5,
    title: 'មេរៀនទី ៥ ៖ ការជំនួសលេខដោយអក្សរ',
    shortTitle: 'ជំនួសលេខដោយអក្សរ',
    summary: 'កន្សោមពីជគណិត ផលបូកតួដូចគ្នា ការរកតម្លៃអក្សរមិនស្គាល់ និងចំណោទ',
    startPage: 33,
    endPage: 38,
    icon: '🔤',
    color: 'from-purple-600 to-violet-700',
    imageUrl: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_5_QUESTIONS,
    formulas: LESSON_5_FORMULAS,
    quizItem: createMathLessonQuizItem(
      5,
      'មេរៀនទី៥ (ការជំនួសលេខដោយអក្សរ)',
      LESSON_5_QUESTIONS,
      'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 6,
    title: 'មេរៀនទី ៦ ៖ បរិមាត្រ',
    shortTitle: 'បរិមាត្រ',
    summary: 'រូបមន្តបរិមាត្រចតុកោណកែង ការេ ត្រីកោណ និងបរិមាត្ររង្វង់ (ចាន) P = 2πr',
    startPage: 39,
    endPage: 46,
    icon: '⭕',
    color: 'from-rose-600 to-pink-700',
    imageUrl: 'https://images.unsplash.com/photo-1638443134305-64e590938f32?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_6_QUESTIONS,
    formulas: LESSON_6_FORMULAS,
    quizItem: createMathLessonQuizItem(
      6,
      'មេរៀនទី៦ (បរិមាត្រ)',
      LESSON_6_QUESTIONS,
      'https://images.unsplash.com/photo-1638443134305-64e590938f32?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 7,
    title: 'មេរៀនទី ៧ ៖ ផ្ទៃក្រឡា',
    shortTitle: 'ផ្ទៃក្រឡា',
    summary: 'ផ្ទៃក្រឡាចតុកោណកែង ការេ ត្រីកោណ ប្រលេឡូក្រាម ចតុកោណព្នាយ និងរង្វង់ S = πr²',
    startPage: 47,
    endPage: 56,
    icon: '🟩',
    color: 'from-sky-600 to-blue-700',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_7_QUESTIONS,
    formulas: LESSON_7_FORMULAS,
    quizItem: createMathLessonQuizItem(
      7,
      'មេរៀនទី៧ (ផ្ទៃក្រឡា)',
      LESSON_7_QUESTIONS,
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 8,
    title: 'មេរៀនទី ៨ ៖ វិធីគុណ និងវិធីចែកចំនួនទសភាគ',
    shortTitle: 'គុណចែកទសភាគ',
    summary: 'វិធីគុណទសភាគនឹងទសភាគ ចែកទសភាគនឹងចំនួនគត់ និងចែកទសភាគនឹងទសភាគ',
    startPage: 57,
    endPage: 68,
    icon: '✖️',
    color: 'from-amber-600 to-yellow-700',
    imageUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f677?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_8_QUESTIONS,
    formulas: LESSON_8_FORMULAS,
    quizItem: createMathLessonQuizItem(
      8,
      'មេរៀនទី៨ (វិធីគុណ និងវិធីចែកចំនួនទសភាគ)',
      LESSON_8_QUESTIONS,
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f677?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 9,
    title: 'មេរៀនទី ៩ ៖ តួចែករួមធំបំផុត-ពហុគុណរួមតូចបំផុត',
    shortTitle: 'PGCD & PPCM',
    summary: 'ចំនួនបឋម ការបំបែកជាកត្តាបឋម តួចែករួមធំបំផុត (គ.ត.ប) និងពហុគុណរួមតូចបំផុត (គ.ព.ត)',
    startPage: 69,
    endPage: 74,
    icon: '🧩',
    color: 'from-indigo-600 to-purple-700',
    imageUrl: 'https://images.unsplash.com/photo-1616400619175-5e3a17f477a1?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_9_QUESTIONS,
    formulas: LESSON_9_FORMULAS,
    quizItem: createMathLessonQuizItem(
      9,
      'មេរៀនទី៩ (តួចែករួមធំបំផុត-ពហុគុណរួមតូចបំផុត)',
      LESSON_9_QUESTIONS,
      'https://images.unsplash.com/photo-1616400619175-5e3a17f477a1?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 10,
    title: 'មេរៀនទី ១០ ៖ វិធីបូក និងវិធីដកប្រភាគ',
    shortTitle: 'បូកដកប្រភាគ',
    summary: 'ភាគបែងរួម ការតម្រូវភាគបែង វិធីបូក និងវិធីដកប្រភាគដែលមានភាគបែងខុសគ្នា',
    startPage: 75,
    endPage: 78,
    icon: '➗',
    color: 'from-teal-600 to-cyan-700',
    imageUrl: 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_10_QUESTIONS,
    formulas: LESSON_10_FORMULAS,
    quizItem: createMathLessonQuizItem(
      10,
      'មេរៀនទី១០ (វិធីបូក និងវិធីដកប្រភាគ)',
      LESSON_10_QUESTIONS,
      'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 11,
    title: 'មេរៀនទី ១១ ៖ វិធីគុណ និងវិធីចែកប្រភាគ',
    shortTitle: 'គុណចែកប្រភាគ',
    summary: 'វិធីគុណប្រភាគនឹងប្រភាគ និងចំនួនគត់ ចម្រាសនៃប្រភាគ និងវិធីចែកប្រភាគ',
    startPage: 79,
    endPage: 86,
    icon: '✖️',
    color: 'from-blue-600 to-teal-700',
    imageUrl: 'https://images.unsplash.com/photo-1515155075601-23009d0cb6d4?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_11_QUESTIONS,
    formulas: LESSON_11_FORMULAS,
    quizItem: createMathLessonQuizItem(
      11,
      'មេរៀនទី១១ (វិធីគុណ និងវិធីចែកប្រភាគ)',
      LESSON_11_QUESTIONS,
      'https://images.unsplash.com/photo-1515155075601-23009d0cb6d4?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 12,
    title: 'មេរៀនទី ១២ ៖ ផលធៀប',
    shortTitle: 'ផលធៀប',
    summary: 'និយមន័យផលធៀប ផលធៀបឯកតាដូចគ្នា និងខុសគ្នា (ឯកតាផ្សំ) និងការចែកតាមផលធៀប',
    startPage: 87,
    endPage: 90,
    icon: '⚖️',
    color: 'from-amber-600 to-red-700',
    imageUrl: 'https://images.unsplash.com/photo-1574633062361-0b36b8c4c794?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_12_QUESTIONS,
    formulas: LESSON_12_FORMULAS,
    quizItem: createMathLessonQuizItem(
      12,
      'មេរៀនទី១២ (ផលធៀប)',
      LESSON_12_QUESTIONS,
      'https://images.unsplash.com/photo-1574633062361-0b36b8c4c794?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 13,
    title: 'មេរៀនទី ១៣ ៖ សមាមាត្រ',
    shortTitle: 'សមាមាត្រ',
    summary: 'និយមន័យសមាមាត្រ ផលគុណខ្វែង រកតួមិនស្គាល់ មាត្រដ្ឋាន សមាមាត្រស្រប និងច្រាស',
    startPage: 91,
    endPage: 94,
    icon: '📊',
    color: 'from-violet-600 to-purple-700',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_13_QUESTIONS,
    formulas: LESSON_13_FORMULAS,
    quizItem: createMathLessonQuizItem(
      13,
      'មេរៀនទី១៣ (សមាមាត្រ)',
      LESSON_13_QUESTIONS,
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 14,
    title: 'មេរៀនទី ១៤ ៖ ល្បឿន',
    shortTitle: 'ល្បឿន',
    summary: 'រូបមន្តល្បឿន v = d / t ចម្ងាយ និងរយៈពេល ចលនាច្រាសទិស (ជួបគ្នា) និងស្របទិស (ដេញទាន់)',
    startPage: 95,
    endPage: 98,
    icon: '🚗',
    color: 'from-red-600 to-rose-700',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_14_QUESTIONS,
    formulas: LESSON_14_FORMULAS,
    quizItem: createMathLessonQuizItem(
      14,
      'មេរៀនទី១៤ (ល្បឿន)',
      LESSON_14_QUESTIONS,
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 15,
    title: 'មេរៀនទី ១៥ ៖ ប្រមាណវិធីលើចំនួនចម្រុះ',
    shortTitle: 'ចំនួនចម្រុះ',
    summary: 'ចំនួនចម្រុះ ប្រភាគមិនសុទ្ធ និងវិធីបូក ដក គុណ ចែកចំនួនចម្រុះ ព្រមទាំងចំណោទ',
    startPage: 99,
    endPage: 110,
    icon: '🧮',
    color: 'from-emerald-600 to-teal-700',
    imageUrl: 'https://images.unsplash.com/photo-1454165833968-0e71e2bb5aa3?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_15_QUESTIONS,
    formulas: LESSON_15_FORMULAS,
    quizItem: createMathLessonQuizItem(
      15,
      'មេរៀនទី១៥ (ប្រមាណវិធីលើចំនួនចម្រុះ)',
      LESSON_15_QUESTIONS,
      'https://images.unsplash.com/photo-1454165833968-0e71e2bb5aa3?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 16,
    title: 'មេរៀនទី ១៦ ៖ ភាគរយ',
    shortTitle: 'ភាគរយ',
    summary: 'និយមន័យភាគរយ ការបំប្លែង ការគណនាតម្លៃនៃភាគរយ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ',
    startPage: 111,
    endPage: 114,
    icon: '🏷️',
    color: 'from-pink-600 to-rose-700',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_16_QUESTIONS,
    formulas: LESSON_16_FORMULAS,
    quizItem: createMathLessonQuizItem(
      16,
      'មេរៀនទី១៦ (ភាគរយ)',
      LESSON_16_QUESTIONS,
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 17,
    title: 'មេរៀនទី ១៧ ៖ ការប្រាក់',
    shortTitle: 'ការប្រាក់',
    summary: 'រូបមន្តការប្រាក់សាមញ្ញ I = P x r x t, ប្រាក់សរុប ប្រាក់កម្ចី និងការទិញទំនិញបង់រំលស់',
    startPage: 115,
    endPage: 118,
    icon: '💰',
    color: 'from-yellow-600 to-amber-700',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_17_QUESTIONS,
    formulas: LESSON_17_FORMULAS,
    quizItem: createMathLessonQuizItem(
      17,
      'មេរៀនទី១៧ (ការប្រាក់)',
      LESSON_17_QUESTIONS,
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 18,
    title: 'មេរៀនទី ១៨ ៖ ស្ថិតិ',
    shortTitle: 'ស្ថិតិ',
    summary: 'តារាងប្រេកង់ទិន្នន័យ មធ្យមភាគ ក្រាបសរសរ ក្រាបសរសរភ្លោះ និងក្រាបផ្លិត (360°)',
    startPage: 119,
    endPage: 126,
    icon: '📈',
    color: 'from-blue-600 to-cyan-700',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_18_QUESTIONS,
    formulas: LESSON_18_FORMULAS,
    quizItem: createMathLessonQuizItem(
      18,
      'មេរៀនទី១៨ (ស្ថិតិ)',
      LESSON_18_QUESTIONS,
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 19,
    title: 'មេរៀនទី ១៩ ៖ ប្រមាណវិធីលើរង្វាស់ពេល',
    shortTitle: 'រង្វាស់ពេល',
    summary: 'ទំនាក់ទំនងខ្នាតពេល វិធីបូក ដក គុណ និងចែករង្វាស់ពេល (ម៉ោង នាទី វិនាទី) និងចំណោទ',
    startPage: 127,
    endPage: 130,
    icon: '⏱️',
    color: 'from-orange-600 to-amber-700',
    imageUrl: 'https://images.unsplash.com/photo-1508921334172-b1fad9973849?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_19_QUESTIONS,
    formulas: LESSON_19_FORMULAS,
    quizItem: createMathLessonQuizItem(
      19,
      'មេរៀនទី១៩ (ប្រមាណវិធីលើរង្វាស់ពេល)',
      LESSON_19_QUESTIONS,
      'https://images.unsplash.com/photo-1508921334172-b1fad9973849?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    lessonNumber: 20,
    title: 'មេរៀនទី ២០ ៖ មាឌ និងផ្ទៃក្រឡាសូលីត',
    shortTitle: 'មាឌសូលីត',
    summary: 'ឯកតាមាឌ (m³, dm³, l) មាឌ និងផ្ទៃក្រឡាប្រលេពីប៉ែតកែង គូប ស៊ីឡាំង កោន និងស្វ៊ែរ',
    startPage: 131,
    endPage: 140,
    icon: '🧊',
    color: 'from-indigo-600 to-blue-800',
    imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800&auto=format&fit=crop',
    questions: LESSON_20_QUESTIONS,
    formulas: LESSON_20_FORMULAS,
    quizItem: createMathLessonQuizItem(
      20,
      'មេរៀនទី២០ (មាឌ និងផ្ទៃក្រឡាសូលីត)',
      LESSON_20_QUESTIONS,
      'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800&auto=format&fit=crop'
    ),
  },
];

// Helper functions
export function getMathLessonPackage(lessonNumber: number): MathLessonPackage {
  return (
    ALL_MATH_LESSONS_PACKAGES.find((l) => l.lessonNumber === lessonNumber) ||
    ALL_MATH_LESSONS_PACKAGES[0]
  );
}

export function getAllMathLessonPackages(): MathLessonPackage[] {
  return ALL_MATH_LESSONS_PACKAGES;
}

export function getAllMathLessonQuizItems(): Quiz[] {
  return ALL_MATH_LESSONS_PACKAGES.map((p) => p.quizItem);
}
