export interface MathQCMOption {
  text: string;
  isCorrect: boolean;
  [key: string]: any;
}

export interface MathQCMQuestion {
  id: number;
  part: string;
  partSubtitle?: string;
  question: string;
  options: MathQCMOption[];
  explanation: string;
  points?: number;
  imageUrl?: string;
  diagram?: any;
  diagramType?: any;
  diagramData?: any;
  [key: string]: any;
}

export interface MathFormulaSection {
  title: string;
  description: string;
  details?: string[];
  items?: any[];
  [key: string]: any;
}

export interface MathLessonMeta {
  lessonNumber: number;
  title: string;
  shortTitle: string;
  summary: string;
  startPage: number;
  endPage: number;
  icon: string;
  color: string;
  imageUrl: string;
  [key: string]: any;
}
