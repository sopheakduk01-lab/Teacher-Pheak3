import { Quiz } from '../../types';
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
  subtitle: string;
  summary: string;
  icon: string;
  color: string;
  gradient: string;
  badge: string;
  imageUrl: string;
  questions: HealthQCMQuestion[];
  quizItem: Quiz;
}

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

export const ALL_HEALTH_LESSONS_PACKAGES: HealthLessonPackage[] = [
  {
    id: 'health-lesson-1',
    lessonNumber: 1,
    title: 'មេរៀនទី ១ ៖ សុខភាពបឋម',
    shortTitle: 'សុខភាពបឋម',
    subtitle: 'អាហារូបត្ថម្ភ, អនាម័យ, មាត់ធ្មេញ, ភ្នែក និងជំងឺឆ្លង',
    summary: 'តុល្យភាពអាហារ ពីរ៉ាមីតអាហារ ការតាមដានទម្ងន់និងកម្ពស់ សុវត្ថិភាពចំណីអាហារ ៥ ចំណុច WHO ទឹកសុវត្ថិភាព F-Diagram និងជំងឺដង្កូវព្រូន/ឆ្កែឆ្កួត',
    icon: '🍎',
    color: 'emerald',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    badge: 'សមាសភាគទី១ ៖ ៤០ QCM',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop',
    questions: HEALTH_LESSON_1_QUESTIONS,
    quizItem: createHealthQuizItem(
      1,
      'មេរៀនទី១ ៖ សុខភាពបឋម (៤០ សំណួរ)',
      HEALTH_LESSON_1_QUESTIONS,
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    id: 'health-lesson-2',
    lessonNumber: 2,
    title: 'មេរៀនទី ២ ៖ សុខភាពផ្លូវចិត្ត',
    shortTitle: 'សុខភាពផ្លូវចិត្ត',
    subtitle: 'សម្ពាធមិត្តភក្តិ, ការគ្រប់គ្រងអារម្មណ៍ និងទំនាក់ទំនងពេញវ័យ',
    summary: 'សម្ពាធមិត្តភក្តិវិជ្ជមាន/អវិជ្ជមាន ជំនាញបដិសេធ «ទេ» ភាពអង់អាច ការគ្រប់គ្រងអារម្មណ៍/កំហឹង ការសម្រាលភាពតានតឹង និងការកសាងទំនាក់ទំនងល្អ',
    icon: '🧠',
    color: 'indigo',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    badge: 'សមាសភាគទី២ ៖ ៤០ QCM',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    questions: HEALTH_LESSON_2_QUESTIONS,
    quizItem: createHealthQuizItem(
      2,
      'មេរៀនទី២ ៖ សុខភាពផ្លូវចិត្ត (៤០ សំណួរ)',
      HEALTH_LESSON_2_QUESTIONS,
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    id: 'health-lesson-3',
    lessonNumber: 3,
    title: 'មេរៀនទី ៣ ៖ សុខភាពបន្តពូជ និងផ្លូវភេទ',
    shortTitle: 'សុខភាពបន្តពូជ',
    subtitle: 'បច្ចេកវិទ្យា, ការបៀតបៀន, សិទ្ធិទាំង១០ និងជំងឺអេដស៍',
    summary: 'សុវត្ថិភាពអ៊ីនធឺណិត ទម្រង់បៀតបៀនផ្លូវភេទ ៣ យ៉ាង អំពើហិង្សា ៤ ប្រភេទ ការពន្យារពេលរួមភេទ សិទ្ធិទាំង១០ អនាម័យប្រដាប់បន្តពូជ និង HIV/AIDS',
    icon: '🌱',
    color: 'rose',
    gradient: 'from-rose-600 via-pink-600 to-purple-700',
    badge: 'សមាសភាគទី៣ ៖ ៤០ QCM',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    questions: HEALTH_LESSON_3_QUESTIONS,
    quizItem: createHealthQuizItem(
      3,
      'មេរៀនទី៣ ៖ សុខភាពបន្តពូជ និងផ្លូវភេទ (៤០ សំណួរ)',
      HEALTH_LESSON_3_QUESTIONS,
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop'
    ),
  },
  {
    id: 'health-lesson-4',
    lessonNumber: 4,
    title: 'មេរៀនទី ៤ ៖ សុខភាព និងបរិស្ថាន',
    shortTitle: 'សុខភាព និងបរិស្ថាន',
    subtitle: 'វិធានការសង្គ្រោះបឋម, ការបំពុលខ្យល់ និងការរំខានដោយសំឡេង',
    summary: 'វិធានការសង្គ្រោះបឋម (របួសមុត រលាក ឈាមច្រមុះ ស្លាក់ Heimlich សត្វទិច/ខាំ) ការបំពុលខ្យល់ ធូលី PM2.5 និងការបំពុលដោយសំឡេងលើស ៦៥ dB',
    icon: '🩹',
    color: 'sky',
    gradient: 'from-sky-600 via-blue-600 to-indigo-800',
    badge: 'សមាសភាគទី៤ ៖ ៤០ QCM',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop',
    questions: HEALTH_LESSON_4_QUESTIONS,
    quizItem: createHealthQuizItem(
      4,
      'មេរៀនទី៤ ៖ សុខភាព និងបរិស្ថាន (៤០ សំណួរ)',
      HEALTH_LESSON_4_QUESTIONS,
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop'
    ),
  },
];

export function getHealthLessonPackage(lessonNumber: number): HealthLessonPackage {
  return (
    ALL_HEALTH_LESSONS_PACKAGES.find((p) => p.lessonNumber === lessonNumber) ||
    ALL_HEALTH_LESSONS_PACKAGES[0]
  );
}
