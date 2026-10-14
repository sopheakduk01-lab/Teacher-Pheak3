export interface LessonPlanObjective {
  knowledge?: string;
  skills?: string;
  skill?: string;
  attitude?: string;
  [key: string]: any;
}

export interface LessonPlanMaterials {
  teacher?: string;
  students?: string;
  [key: string]: any;
}

export interface LessonPlanStep {
  stepNo: string;
  stepTitle: string;
  teacherActivity: string;
  content: string;
  studentActivity: string;
  [key: string]: any;
}

export interface LessonPlanDetail {
  id: string;
  lessonNo: string;
  mainLessonTitle: string;
  subLessonTitle?: string;
  title: string;
  subject: string;
  grade: string;
  duration: string;
  sourceRef?: string;
  pedagogy?: string;
  digitalTools?: string[];
  learningGames?: string[];
  objectives: LessonPlanObjective;
  materials: LessonPlanMaterials;
  steps: LessonPlanStep[];
  homework?: string;
  pedagogicalTips?: string;
  differentiation?: any;
  characterValues?: any;
  rubric?: any;
  schoolName?: string;
  teacherName?: string;
  [key: string]: any;
}
