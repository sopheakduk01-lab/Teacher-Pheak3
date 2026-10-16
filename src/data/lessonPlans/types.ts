export interface LessonPlanRubricItem {
  criteria: string;
  level4: string; // ល្អប្រសើរ (Advanced)
  level3: string; // ល្អ (Proficient)
  level2: string; // មធ្យម (Basic)
  level1: string; // ត្រូវកែលម្អ (Needs Improvement)
}

export interface LessonPlanDetail {
  id: string;
  lessonNo: string;
  mainLessonTitle?: string;
  subLessonTitle?: string;
  title: string;
  subject: string;
  grade: string;
  duration: string;
  sourceRef: string;
  pedagogy: string;
  digitalTools: string[];
  learningGames: string[];
  objectives: {
    knowledge: string;
    skills: string;
    attitude: string;
  };
  materials: {
    teacher: string;
    students: string;
  };
  steps: {
    stepNo: string;
    stepTitle: string;
    teacherActivity: string;
    content: string;
    studentActivity: string;
  }[];
  homework: string;
  teacherName: string;
  schoolName: string;
  differentiation?: {
    slowLearners: string;
    fastLearners: string;
  };
  characterValues?: string;
  pedagogicalTips?: string;
  rubric?: LessonPlanRubricItem[];
}
