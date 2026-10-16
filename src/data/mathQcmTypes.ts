export interface MathQCMQuestion {
  id: number;
  part: string;
  partSubtitle: string;
  question: string;
  diagramType?: string;
  diagramData?: any;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
  points: number;
}

export interface MathFormulaSection {
  title: string;
  description: string;
  details?: string[];
  items?: {
    name: string;
    formula: string;
    description: string;
    example?: string;
  }[];
}

export interface MathLessonMeta {
  lessonNumber: number;
  title: string;
  shortTitle: string;
  startPage: number;
  endPage: number;
  summary: string;
  icon: string;
  color: string;
  topics: string[];
}
