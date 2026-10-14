import { Quiz } from '../../types';
import { HealthQCMQuestion } from '../healthEducationLessonsData';

export interface HealthLessonPackage {
  lessonNumber: number;
  title: string;
  shortTitle: string;
  sectionId: string;
  sectionNumber: number;
  sectionTitle: string;
  summary: string;
  icon: string;
  color: string;
  gradient: string;
  imageUrl: string;
  questions: HealthQCMQuestion[];
  quizItem: Quiz;
}
