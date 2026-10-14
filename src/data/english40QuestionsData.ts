export interface English40Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface English40Question {
  id: number | string;
  question: string;
  options: English40Option[];
  explanation?: string;
  category?: string;
  audioText?: string;
  points?: number;
  typeLabelKhmer?: string;
  icon?: string;
  [key: string]: any;
}

export const ENGLISH_40_EXAM_QUESTIONS: English40Question[] = [
  {
    id: 1,
    question: 'Choose the correct greeting for the morning:',
    options: [
      { id: 'a', text: 'Good morning', isCorrect: true },
      { id: 'b', text: 'Good evening', isCorrect: false },
      { id: 'c', text: 'Good night', isCorrect: false },
      { id: 'd', text: 'Goodbye', isCorrect: false },
    ],
    explanation: 'We say "Good morning" before noon.',
    category: 'Greetings',
    audioText: 'Good morning',
  },
  {
    id: 2,
    question: 'Complete the sentence: "What _____ your name?"',
    options: [
      { id: 'a', text: 'is', isCorrect: true },
      { id: 'b', text: 'are', isCorrect: false },
      { id: 'c', text: 'am', isCorrect: false },
      { id: 'd', text: 'be', isCorrect: false },
    ],
    explanation: '"name" is singular, so we use "is".',
    category: 'Grammar',
    audioText: 'What is your name?',
  },
  {
    id: 3,
    question: 'How do you say "សៀវភៅ" in English?',
    options: [
      { id: 'a', text: 'Pen', isCorrect: false },
      { id: 'b', text: 'Book', isCorrect: true },
      { id: 'c', text: 'Ruler', isCorrect: false },
      { id: 'd', text: 'Eraser', isCorrect: false },
    ],
    explanation: 'A book is a set of written or printed pages.',
    category: 'Vocabulary',
    audioText: 'Book',
  },
  {
    id: 4,
    question: 'Select the plural form of "apple":',
    options: [
      { id: 'a', text: 'Apples', isCorrect: true },
      { id: 'b', text: 'Applies', isCorrect: false },
      { id: 'c', text: 'Applees', isCorrect: false },
      { id: 'd', text: 'Appleses', isCorrect: false },
    ],
    explanation: 'Regular nouns form their plural by adding "-s".',
    category: 'Grammar',
    audioText: 'Apples',
  },
  {
    id: 5,
    question: 'Choose the correct answer: "I _____ a primary student."',
    options: [
      { id: 'a', text: 'am', isCorrect: true },
      { id: 'b', text: 'is', isCorrect: false },
      { id: 'c', text: 'are', isCorrect: false },
      { id: 'd', text: 'has', isCorrect: false },
    ],
    explanation: 'The pronoun "I" pairs with the verb "am".',
    category: 'Grammar',
    audioText: 'I am a primary student.',
  },
];
