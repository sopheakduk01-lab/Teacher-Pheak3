/**
 * khmerLessonPlansData.ts
 * Comprehensive Grade 6 Lesson Plans across 6 official subjects:
 * 1. ភាសាខ្មែរ (Khmer Language - Grade 6) - 10 Full Lessons with Sub-lessons
 * 2. គណិតវិទ្យា (Mathematics - Grade 6) - 20 Lessons
 * 3. វិទ្យាសាស្ត្រ (Science - Grade 6) - 17 Lessons
 * 4. សិក្សាសង្គម (Social Studies - Grade 6) - 15 Lessons
 * 5. អប់រំសុខភាព (Health Education - Grade 6) - 18 Lessons
 * 6. ភាសាអង់គ្លេស និងបំណិនជីវិត (English & Life Skills - Grade 6) - 36 Lessons
 */

import { LessonPlanDetail } from './lessonPlans/types';
import { khmerPlans } from './lessonPlans/khmerPlans';
import { khmerPlansPart2 } from './lessonPlans/khmerPlansPart2';
import { mathPlans } from './lessonPlans/mathPlans';
import { sciencePlans } from './lessonPlans/sciencePlans';
import { socialPlans } from './lessonPlans/socialPlans';
import { healthPlans } from './lessonPlans/healthPlans';
import { englishPlans } from './lessonPlans/englishPlans';

export type { LessonPlanDetail };

export const khmerLessonPlansList: LessonPlanDetail[] = [
  ...khmerPlans,
  ...khmerPlansPart2,
  ...mathPlans,
  ...sciencePlans,
  ...socialPlans,
  ...healthPlans,
  ...englishPlans
];

export const subjectsList = [
  { id: 'all', name: 'ទាំងអស់', count: khmerLessonPlansList.length },
  { id: 'ភាសាខ្មែរ', name: 'ភាសាខ្មែរ (១០ មេរៀន + ខ្លឹមសាររង)', count: khmerPlans.length + khmerPlansPart2.length },
  { id: 'គណិតវិទ្យា', name: 'គណិតវិទ្យា (២០ មេរៀន)', count: mathPlans.length },
  { id: 'វិទ្យាសាស្ត្រ', name: 'វិទ្យាសាស្ត្រ (១៧ មេរៀន)', count: sciencePlans.length },
  { id: 'សិក្សាសង្គម', name: 'សិក្សាសង្គម (១៥ មេរៀន)', count: socialPlans.length },
  { id: 'អប់រំសុខភាព', name: 'អប់រំសុខភាព (១៨ មេរៀន)', count: healthPlans.length },
  { id: 'ភាសាអង់គ្លេស និងបំណិនជីវិត', name: 'ភាសាអង់គ្លេស និងបំណិនជីវិត (៣៦ មេរៀន)', count: englishPlans.length }
];
