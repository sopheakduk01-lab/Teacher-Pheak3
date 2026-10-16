export interface EnglishVocabularyItem {
  word: string;
  phonetic: string;
  pos: string;
  khmerMeaning: string;
  example: string;
  icon: string;
  // Compatibility fields
  partOfSpeech?: string;
  meaningKh?: string;
  exampleSentence?: string;
  exampleTranslationKh?: string;
  audioPrompt?: string;
}

export interface EnglishConversationLine {
  avatar: string;
  speaker: string;
  text: string;
  translation: string;
}

export interface EnglishConversation {
  title?: string;
  lines: EnglishConversationLine[];
}

export interface EnglishLanguageFocusExample {
  question?: string;
  answer: string;
  note?: string;
}

export interface EnglishLanguageFocusExercise {
  question: string;
  options: string[];
  answer: string;
}

export interface EnglishLanguageFocus {
  grammarTopic: string;
  rule: string;
  formula?: string;
  examples: EnglishLanguageFocusExample[];
  practiceExercises: EnglishLanguageFocusExercise[];
}

export interface EnglishReadingQuestion {
  question: string;
  options?: string[];
  answer: string;
}

export interface EnglishReading {
  title: string;
  passage: string;
  questions: EnglishReadingQuestion[];
}

export interface EnglishSpeaking {
  instruction: string;
  modelDialogue: { speaker: string; text: string }[];
  prompts: string[];
}

export interface EnglishWritingTask {
  prompt: string;
  answer: string;
}

export interface EnglishWriting {
  instruction: string;
  wordBank?: string[];
  tasks: EnglishWritingTask[];
}

export interface EnglishRemember {
  vocabList: string[];
  grammarSummary: string;
}

export interface EnglishChapter {
  id: number;
  titleEn: string;
  titleKh: string;
  unitsCount: number;
  colorTheme: string;
}

export interface EnglishLessonUnit {
  id: number;
  unitNumber: number;
  chapterId: number;
  chapterTitle: string;
  unitTitle: string;
  pages: string;
  icon: string;
  vocabulary: EnglishVocabularyItem[];
  spellingWords: string[];
  conversations: EnglishConversation[];
  languageFocus: EnglishLanguageFocus;
  reading: EnglishReading;
  speaking: EnglishSpeaking;
  writing: EnglishWriting;
  remember: EnglishRemember;

  // Compatibility fields
  titleEn?: string;
  titleKh?: string;
  subtitleKh?: string;
  grammarFocusEn?: string;
  grammarFocusKh?: string;
  dialogueEn?: { speaker: string; text: string; translationKh: string }[];
  practiceQuestions?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanationKh: string;
  }[];
}

export const ENGLISH_GRADE_6_CHAPTERS: EnglishChapter[] = [
  { id: 1, titleEn: 'Chapter 1: Back to School & Friends', titleKh: 'ជំពូកទី១ ៖ ត្រឡប់មកសាលា និងមិត្តភក្តិ', unitsCount: 3, colorTheme: 'indigo' },
  { id: 2, titleEn: 'Chapter 2: Daily Routines & Hobbies', titleKh: 'ជំពូកទី២ ៖ ទម្លាប់ប្រចាំថ្ងៃ និងចំណង់ចំណូលចិត្ត', unitsCount: 2, colorTheme: 'emerald' },
  { id: 3, titleEn: 'Chapter 3: Food, Health & Body', titleKh: 'ជំពូកទី៣ ៖ រាងកាយ និងសុខភាព', unitsCount: 1, colorTheme: 'amber' },
  { id: 4, titleEn: 'Chapter 4: Nature & Folk Tales', titleKh: 'ជំពូកទី៤ ៖ ធម្មជាតិ និងរឿងព្រេង', unitsCount: 1, colorTheme: 'sky' },
];

export const ENGLISH_GRADE_6_UNITS: EnglishLessonUnit[] = [
  {
    id: 1,
    unitNumber: 1,
    chapterId: 1,
    chapterTitle: 'Chapter 1: Back to School & Friends',
    unitTitle: 'Meeting New Classmates',
    pages: 'MoEYS p. 2-5',
    icon: '🤝',
    titleEn: 'Unit 1: Meeting New Classmates',
    titleKh: 'មេរៀនទី១ ៖ ជួបមិត្តរួមថ្នាក់ថ្មី',
    subtitleKh: 'ការស្វាគមន៍ និងការណែនាំខ្លួនឯងជាភាសាអង់គ្លេស',
    grammarFocusEn: 'Present Simple tense (Verb to be: am, is, are)',
    grammarFocusKh: 'កិរិយាសព្ទ To Be ក្នុងបច្ចុប្បន្នកាលធម្មតា',
    vocabulary: [
      {
        word: 'Classmate',
        phonetic: '/ˈklɑːsmeɪt/',
        pos: 'noun',
        khmerMeaning: 'មិត្តរួមថ្នាក់',
        example: 'Thida is my friendly classmate.',
        icon: '🧑‍🤝‍🧑',
        partOfSpeech: 'noun',
        meaningKh: 'មិត្តរួមថ្នាក់',
        exampleSentence: 'Thida is my friendly classmate.',
        exampleTranslationKh: 'ធីតាគឺជាមិត្តរួមថ្នាក់រួសរាយរបស់ខ្ញុំ។'
      },
      {
        word: 'Welcome',
        phonetic: '/ˈwelkəm/',
        pos: 'verb',
        khmerMeaning: 'ស្វាគមន៍',
        example: 'Welcome to our Grade 6 class!',
        icon: '👋',
        partOfSpeech: 'verb',
        meaningKh: 'ស្វាគមន៍',
        exampleSentence: 'Welcome to our Grade 6 class!',
        exampleTranslationKh: 'សូមស្វាគមន៍មកកាន់ថ្នាក់ទី៦ របស់យើង!'
      },
      {
        word: 'Introduce',
        phonetic: '/ˌɪntrəˈdjuːs/',
        pos: 'verb',
        khmerMeaning: 'ណែនាំខ្លួន / ណែនាំ',
        example: 'Please introduce yourself to everyone.',
        icon: '🎤',
        partOfSpeech: 'verb',
        meaningKh: 'ណែនាំខ្លួន',
        exampleSentence: 'Please introduce yourself to everyone.',
        exampleTranslationKh: 'សូមណែនាំខ្លួនរបស់អ្នកដល់អ្នកទាំងអស់គ្នា។'
      },
      {
        word: 'Friendly',
        phonetic: '/ˈfrendli/',
        pos: 'adj',
        khmerMeaning: 'រួសរាយ រាក់ទាក់',
        example: 'Our teacher is very friendly.',
        icon: '😊',
        partOfSpeech: 'adjective',
        meaningKh: 'រួសរាយ',
        exampleSentence: 'Our teacher is very friendly.',
        exampleTranslationKh: 'លោកគ្រូអ្នកគ្រូរបស់យើងរួសរាយណាស់។'
      },
      {
        word: 'Together',
        phonetic: '/təˈɡeðər/',
        pos: 'adv',
        khmerMeaning: 'ជាមួយគ្នា',
        example: 'We study English together every morning.',
        icon: '📚',
        partOfSpeech: 'adverb',
        meaningKh: 'ជាមួយគ្នា',
        exampleSentence: 'We study English together every morning.',
        exampleTranslationKh: 'ពួកយើងរៀនភាសាអង់គ្លេសជាមួយគ្នាជារៀងរាល់ព្រឹក។'
      }
    ],
    spellingWords: ['Classmate', 'Welcome', 'Introduce', 'Friendly', 'Together'],
    conversations: [
      {
        title: 'Meeting in the Classroom',
        lines: [
          { avatar: '👦', speaker: 'Sokha', text: 'Good morning! My name is Sokha. What is your name?', translation: 'អរុណសួស្តី! ខ្ញុំឈ្មោះសុខា។ តើអ្នកឈ្មោះអ្វី?' },
          { avatar: '👧', speaker: 'Thida', text: 'Hi Sokha! I am Thida. Nice to meet you.', translation: 'សួស្តីសុខា! ខ្ញុំឈ្មោះធីតា។ រីករាយដែលបានស្គាល់អ្នក។' },
          { avatar: '👦', speaker: 'Sokha', text: 'Nice to meet you too! Are you in Grade 6A?', translation: 'រីករាយដែលបានស្គាល់អ្នកដូចគ្នា! តើអ្នករៀននៅថ្នាក់ទី ៦A មែនទេ?' },
          { avatar: '👧', speaker: 'Thida', text: 'Yes, I am. We are classmates this year!', translation: 'ចាស ពិតមែនហើយ។ ពួកយើងជាមិត្តរួមថ្នាក់គ្នានៅឆ្នាំនេះ!' }
        ]
      }
    ],
    languageFocus: {
      grammarTopic: 'Present Simple: Verb to be (am, is, are)',
      rule: 'ប្រើ am ជាមួយ I, ប្រើ is ជាមួយ He/She/It/ឯកវចនៈ, ប្រើ are ជាមួយ You/We/They/ពហុវចនៈ។',
      formula: 'Subject + am/is/are + (adjective / noun)',
      examples: [
        { question: 'What is your name?', answer: 'I am Dara. (My name is Dara.)', note: 'I -> am' },
        { question: 'Are you ready?', answer: 'Yes, we are ready.', note: 'We -> are' },
        { question: 'Where is Thida?', answer: 'She is in the classroom.', note: 'She -> is' }
      ],
      practiceExercises: [
        { question: 'Hello, I _____ a Grade 6 student.', options: ['am', 'is', 'are'], answer: 'am' },
        { question: 'Sokha and Thida _____ good classmates.', options: ['is', 'are', 'am'], answer: 'are' },
        { question: 'Mr. Vanna _____ our new English teacher.', options: ['is', 'are', 'am'], answer: 'is' }
      ]
    },
    reading: {
      title: 'Our New English Class',
      passage: 'Today is Monday. It is the first day of the school year. Many students are in the classroom. Sokha meets Thida, and they become new friends. The teacher, Mr. Vanna, welcomes everyone with a big smile. He writes on the blackboard: "Welcome to Grade 6 English!" All the students are very happy to study together.',
      questions: [
        { question: 'What day is it today?', options: ['Monday', 'Sunday', 'Friday'], answer: 'Monday' },
        { question: 'Who is the English teacher?', options: ['Mr. Vanna', 'Sokha', 'Thida'], answer: 'Mr. Vanna' },
        { question: 'How do the students feel?', options: ['Happy to study', 'Tired', 'Sad'], answer: 'Happy to study' }
      ]
    },
    speaking: {
      instruction: 'Introduce yourself to your partner using the template below:',
      modelDialogue: [
        { speaker: 'Student A', text: 'Hello! I am [Name]. I am 11 years old. I like reading books.' },
        { speaker: 'Student B', text: 'Hi [Name]! Nice to meet you. I am [Name], and I like sports.' }
      ],
      prompts: [
        'Say your name and your age.',
        'Tell your friend your favorite school subject.',
        'Ask your friend: "What is your favorite game?"'
      ]
    },
    writing: {
      instruction: 'Complete the sentences using words from the box:',
      wordBank: ['classmates', 'friendly', 'welcome', 'am', 'are'],
      tasks: [
        { prompt: 'I _____ very glad to meet you.', answer: 'am' },
        { prompt: 'Sokha and Thida are good _____.', answer: 'classmates' },
        { prompt: 'Our school extends a warm _____ to all students.', answer: 'welcome' }
      ]
    },
    remember: {
      vocabList: ['Classmate', 'Welcome', 'Introduce', 'Friendly', 'Together'],
      grammarSummary: 'I am / He is / She is / It is / We are / You are / They are'
    },
    dialogueEn: [
      { speaker: 'Sokha', text: 'Good morning! My name is Sokha.', translationKh: 'អរុណសួស្តី! ខ្ញុំឈ្មោះសុខា។' },
      { speaker: 'Thida', text: 'Hi Sokha! I am Thida. Nice to meet you.', translationKh: 'សួស្តីសុខា! ខ្ញុំឈ្មោះធីតា។ រីករាយដែលបានស្គាល់អ្នក។' }
    ],
    practiceQuestions: [
      {
        question: 'Complete: "Hello, I _____ a Grade 6 student."',
        options: ['am', 'is', 'are', 'be'],
        correctIndex: 0,
        explanationKh: 'ប្រធាន "I" ត្រូវប្រើជាមួយកិរិយាសព្ទ "am"។'
      },
      {
        question: 'Which word means "មិត្តរួមថ្នាក់"?',
        options: ['Teacher', 'Classmate', 'Principal', 'Doctor'],
        correctIndex: 1,
        explanationKh: '"Classmate" មានន័យថាមិត្តរួមថ្នាក់។'
      }
    ]
  },
  {
    id: 2,
    unitNumber: 2,
    chapterId: 1,
    chapterTitle: 'Chapter 1: Back to School & Friends',
    unitTitle: 'Telling Time & Classroom Rules',
    pages: 'MoEYS p. 6-9',
    icon: '⏰',
    titleEn: 'Unit 2: Telling Time & Classroom Rules',
    titleKh: 'មេរៀនទី២ ៖ ប្រាប់ពេលវេលា និងវិន័យក្នុងថ្នាក់',
    subtitleKh: 'ការសួរម៉ោង និងការប្រើប្រាស់ពាក្យបញ្ជាក្នុងថ្នាក់រៀន',
    grammarFocusEn: 'Telling the time (What time is it? It is...) & Imperatives',
    grammarFocusKh: 'ការប្រាប់ម៉ោង (It is...) និងល្បះបញ្ជា (Please / Don\'t)',
    vocabulary: [
      {
        word: 'O\'clock',
        phonetic: '/əˈklɒk/',
        pos: 'adv',
        khmerMeaning: 'ម៉ោងគត់',
        example: 'School starts at seven o\'clock.',
        icon: '🕒',
        partOfSpeech: 'adverb',
        meaningKh: 'ម៉ោងគត់',
        exampleSentence: 'School starts at seven o\'clock.',
        exampleTranslationKh: 'សាលារៀនចាប់ផ្តើមនៅម៉ោង ៧ គត់។'
      },
      {
        word: 'Quiet',
        phonetic: '/ˈkwaɪət/',
        pos: 'adj',
        khmerMeaning: 'ស្ងប់ស្ងាត់',
        example: 'Please be quiet in the classroom.',
        icon: '🤫',
        partOfSpeech: 'adjective',
        meaningKh: 'ស្ងប់ស្ងាត់',
        exampleSentence: 'Please be quiet in the classroom.',
        exampleTranslationKh: 'សូមរក្សាភាពស្ងប់ស្ងាត់ក្នុងថ្នាក់រៀន។'
      },
      {
        word: 'Listen',
        phonetic: '/ˈlɪsn/',
        pos: 'verb',
        khmerMeaning: 'ស្តាប់',
        example: 'Listen carefully to the teacher.',
        icon: '👂',
        partOfSpeech: 'verb',
        meaningKh: 'ស្តាប់',
        exampleSentence: 'Listen carefully to the teacher.',
        exampleTranslationKh: 'សូមស្តាប់លោកគ្រូអ្នកគ្រូដោយយកចិត្តទុកដាក់។'
      },
      {
        word: 'Ruler',
        phonetic: '/ˈruːlə(r)/',
        pos: 'noun',
        khmerMeaning: 'បន្ទាត់',
        example: 'I use a ruler to draw straight lines.',
        icon: '📏',
        partOfSpeech: 'noun',
        meaningKh: 'បន្ទាត់',
        exampleSentence: 'I use a ruler to draw straight lines.',
        exampleTranslationKh: 'ខ្ញុំប្រើបន្ទាត់ដើម្បីគូសបន្ទាត់ត្រង់។'
      },
      {
        word: 'Textbook',
        phonetic: '/ˈtekstbʊk/',
        pos: 'noun',
        khmerMeaning: 'សៀវភៅពុម្ព',
        example: 'Please open your textbook to page 6.',
        icon: '📖',
        partOfSpeech: 'noun',
        meaningKh: 'សៀវភៅពុម្ព',
        exampleSentence: 'Please open your textbook to page 6.',
        exampleTranslationKh: 'សូមបើកសៀវភៅពុម្ពរបស់អ្នកទៅទំព័រទី ៦។'
      }
    ],
    spellingWords: ['Oclock', 'Quiet', 'Listen', 'Ruler', 'Textbook'],
    conversations: [
      {
        title: 'Asking the Time',
        lines: [
          { avatar: '👩‍🏫', speaker: 'Teacher', text: 'Good morning class! What time is it now?', translation: 'អរុណសួស្តីកូនៗ! តើឥឡូវនេះម៉ោងប៉ុន្មានហើយ?' },
          { avatar: '👦', speaker: 'Dara', text: 'It is seven o\'clock, teacher.', translation: 'គឺម៉ោង ៧ គត់ហើយ លោកគ្រូ។' },
          { avatar: '👩‍🏫', speaker: 'Teacher', text: 'Thank you Dara. Please open your books and listen.', translation: 'អរគុណដារ៉ា។ សូមបើកសៀវភៅកូនៗ ហើយស្តាប់។' }
        ]
      }
    ],
    languageFocus: {
      grammarTopic: 'Telling Time & Imperatives (ល្បះបញ្ជា)',
      rule: 'សួរម៉ោង ៖ "What time is it?" ឆ្លើយ ៖ "It is [hour] o\'clock."។ ល្បះបញ្ជាប្រើ Verb ដើម ៖ "Please listen", "Don\'t shout"។',
      formula: 'What time is it? -> It is + [time]. / (Please) + Verb base form.',
      examples: [
        { question: 'What time is it?', answer: 'It is eight o\'clock.', note: '8:00' },
        { question: 'What is the rule?', answer: 'Please raise your hand.', note: 'Polite command' },
        { question: 'What should we not do?', answer: 'Don\'t run in class.', note: 'Negative command' }
      ],
      practiceExercises: [
        { question: 'What time is it? (7:00) -> It is _____ o\'clock.', options: ['seven', 'eight', 'nine'], answer: 'seven' },
        { question: 'Please _____ your hands before speaking.', options: ['raise', 'raising', 'raises'], answer: 'raise' },
        { question: '_____ make noise in the library.', options: ['Don\'t', 'Not', 'Doesn\'t'], answer: 'Don\'t' }
      ]
    },
    reading: {
      title: 'Our Classroom Rules',
      passage: 'In our Grade 6 classroom, we have golden rules. Rule number one: arrive at school at seven o\'clock. Rule number two: be polite and friendly to all classmates. Rule number three: keep the classroom clean and tidy. Our teacher says when everyone follows the rules, learning is wonderful and exciting.',
      questions: [
        { question: 'What time must students arrive?', options: ['7 o\'clock', '8 o\'clock', '9 o\'clock'], answer: '7 o\'clock' },
        { question: 'How should the classroom be kept?', options: ['Clean and tidy', 'Noisy', 'Dark'], answer: 'Clean and tidy' },
        { question: 'What makes learning wonderful?', options: ['Following rules', 'Sleeping', 'Shouting'], answer: 'Following rules' }
      ]
    },
    speaking: {
      instruction: 'Practice asking and answering about time with your partner:',
      modelDialogue: [
        { speaker: 'Student A', text: 'Excuse me, what time is it?' },
        { speaker: 'Student B', text: 'It is eight o\'clock. It is time for English!' }
      ],
      prompts: [
        'Ask your friend what time they wake up in the morning.',
        'Ask what time school finishes in the afternoon.',
        'Give a polite classroom command: "Please be quiet."'
      ]
    },
    writing: {
      instruction: 'Write classroom rules using the words given:',
      wordBank: ['Listen', 'Clean', 'Quiet', 'Raise'],
      tasks: [
        { prompt: '_____ carefully to the teacher.', answer: 'Listen' },
        { prompt: '_____ your hand to ask a question.', answer: 'Raise' },
        { prompt: 'Keep the room _____ and quiet.', answer: 'clean' }
      ]
    },
    remember: {
      vocabList: ['O\'clock', 'Quiet', 'Listen', 'Ruler', 'Textbook'],
      grammarSummary: 'What time is it? It is ... o\'clock. / Please + Verb'
    },
    dialogueEn: [
      { speaker: 'Teacher', text: 'Good morning students! Please open your books to page 10.', translationKh: 'អរុណសួស្តីកូនៗ! សូមបើកសៀវភៅទំព័រទី១០។' },
      { speaker: 'Students', text: 'Good morning teacher! Yes, we are ready.', translationKh: 'អរុណសួស្តីលោកគ្រូ! បាទ/ចាស ពួកយើងរួចរាល់ហើយ។' }
    ],
    practiceQuestions: [
      {
        question: 'What do you use to write in your notebook?',
        options: ['Pen', 'Eraser', 'Ruler', 'Backpack'],
        correctIndex: 0,
        explanationKh: '"Pen" គឺប៊ិចសម្រាប់សរសេរ។'
      }
    ]
  },
  {
    id: 3,
    unitNumber: 3,
    chapterId: 1,
    chapterTitle: 'Chapter 1: Back to School & Friends',
    unitTitle: 'My Daily Routines',
    pages: 'MoEYS p. 10-13',
    icon: '🏃',
    titleEn: 'Unit 3: My Daily Routines',
    titleKh: 'មេរៀនទី៣ ៖ ទម្លាប់ប្រចាំថ្ងៃរបស់ខ្ញុំ',
    subtitleKh: 'ការពិពណ៌នាអំពីសកម្មភាពប្រចាំថ្ងៃពីព្រឹកដល់យប់',
    grammarFocusEn: 'Present Simple for routines (I wake up, He wakes up)',
    grammarFocusKh: 'បច្ចុប្បន្នកាលធម្មតាសម្រាប់ទម្លាប់ប្រចាំថ្ងៃ',
    vocabulary: [
      {
        word: 'Wake up',
        phonetic: '/weɪk ʌp/',
        pos: 'verb',
        khmerMeaning: 'ភ្ញាក់ពីគេង',
        example: 'I wake up at six o\'clock every morning.',
        icon: '🌅',
        partOfSpeech: 'verb',
        meaningKh: 'ភ្ញាក់ពីគេង',
        exampleSentence: 'I wake up at six o\'clock every morning.',
        exampleTranslationKh: 'ខ្ញុំភ្ញាក់ពីគេងនៅម៉ោង ៦ ព្រឹកជារៀងរាល់ថ្ងៃ។'
      },
      {
        word: 'Breakfast',
        phonetic: '/ˈbrekfəst/',
        pos: 'noun',
        khmerMeaning: 'អាហារពេលព្រឹក',
        example: 'We eat healthy breakfast before school.',
        icon: '🍳',
        partOfSpeech: 'noun',
        meaningKh: 'អាហារពេលព្រឹក',
        exampleSentence: 'We eat healthy breakfast before school.',
        exampleTranslationKh: 'ពួកយើងញ៉ាំអាហារពេលព្រឹកល្អចំពោះសុខភាពមុនទៅសាលា។'
      },
      {
        word: 'Exercise',
        phonetic: '/ˈeksəsaɪz/',
        pos: 'verb/noun',
        khmerMeaning: 'ហាត់ប្រាណ',
        example: 'Physical exercise makes our body strong.',
        icon: '🤸',
        partOfSpeech: 'verb',
        meaningKh: 'ហាត់ប្រាណ',
        exampleSentence: 'Physical exercise makes our body strong.',
        exampleTranslationKh: 'ការហាត់ប្រាណធ្វើឱ្យរាងកាយយើងរឹងមាំ។'
      },
      {
        word: 'Homework',
        phonetic: '/ˈhəʊmwɜːk/',
        pos: 'noun',
        khmerMeaning: 'កិច្ចការផ្ទះ',
        example: 'I finish my English homework at night.',
        icon: '📝',
        partOfSpeech: 'noun',
        meaningKh: 'កិច្ចការផ្ទះ',
        exampleSentence: 'I finish my English homework at night.',
        exampleTranslationKh: 'ខ្ញុំធ្វើកិច្ចការផ្ទះភាសាអង់គ្លេសចប់នៅពេលយប់។'
      }
    ],
    spellingWords: ['Wakeup', 'Breakfast', 'Exercise', 'Homework'],
    conversations: [
      {
        title: 'Talking about Morning Routine',
        lines: [
          { avatar: '👧', speaker: 'Bopha', text: 'What time do you wake up every morning?', translation: 'តើអ្នកភ្ញាក់ពីគេងនៅម៉ោងប៉ុន្មានរាល់ព្រឹក?' },
          { avatar: '👦', speaker: 'Vannak', text: 'I wake up at six o\'clock. Then I brush my teeth and eat breakfast.', translation: 'ខ្ញុំភ្ញាក់ពីគេងនៅម៉ោង ៦។ បន្ទាប់មកខ្ញុំដុសធ្មេញ និងញ៉ាំអាហារពេលព្រឹក។' }
        ]
      }
    ],
    languageFocus: {
      grammarTopic: 'Present Simple: Daily Routines (s / es rules)',
      rule: 'ជាមួយ He / She / It កិរិយាសព្ទត្រូវបន្ថែម s ឬ es (e.g. He wakes up, She brushes)។',
      formula: 'Subject (He/She) + Verb(-s/-es) + time',
      examples: [
        { question: 'What does Dara do at 6?', answer: 'He wakes up at 6:00 AM.', note: 'wake -> wakes' },
        { question: 'When do you eat breakfast?', answer: 'I eat breakfast at 6:30 AM.', note: 'I eat' }
      ],
      practiceExercises: [
        { question: 'Sophea _____ her teeth every morning.', options: ['brushes', 'brush', 'brushing'], answer: 'brushes' },
        { question: 'They _____ to school by bicycle.', options: ['ride', 'rides', 'riding'], answer: 'ride' }
      ]
    },
    reading: {
      title: 'Vannak\'s Busy Day',
      passage: 'Vannak is an active Grade 6 student in Siem Reap. He wakes up at 6:00 AM. After washing his face, he helps his parents feed the chickens. At 6:45 AM, he rides his bicycle to school. After class, he plays football with his friends and reviews his lessons at home.',
      questions: [
        { question: 'Where does Vannak live?', options: ['Siem Reap', 'Phnom Penh', 'Battambang'], answer: 'Siem Reap' },
        { question: 'How does he go to school?', options: ['By bicycle', 'By bus', 'On foot'], answer: 'By bicycle' }
      ]
    },
    speaking: {
      instruction: 'Tell your partner 3 things you do every morning:',
      modelDialogue: [
        { speaker: 'You', text: 'First, I wake up. Next, I wash my face. Then, I eat breakfast.' }
      ],
      prompts: ['What do you do first in the morning?', 'What time do you sleep at night?']
    },
    writing: {
      instruction: 'Write the correct form of the verbs:',
      wordBank: ['wakes', 'goes', 'eats'],
      tasks: [
        { prompt: 'Sokha _____ up early.', answer: 'wakes' },
        { prompt: 'He _____ breakfast with his sister.', answer: 'eats' }
      ]
    },
    remember: {
      vocabList: ['Wake up', 'Breakfast', 'Exercise', 'Homework'],
      grammarSummary: 'I/You/We/They eat - He/She/It eats'
    }
  },
  {
    id: 4,
    unitNumber: 4,
    chapterId: 2,
    chapterTitle: 'Chapter 2: Daily Routines & Hobbies',
    unitTitle: 'Days of the Week & Timetable',
    pages: 'MoEYS p. 14-17',
    icon: '📅',
    titleEn: 'Unit 4: Days of the Week & Timetable',
    titleKh: 'មេរៀនទី៤ ៖ ថ្ងៃនៃសប្តាហ៍ និងកាលវិភាគ',
    subtitleKh: 'ការរៀបរាប់ថ្ងៃទាំង ៧ និងមុខវិជ្ជាសិក្សា',
    grammarFocusEn: 'Prepositions of time (on Monday, at 8:00)',
    grammarFocusKh: 'ធ្នាក់បញ្ជាក់កាលវេលា on + ថ្ងៃ, at + ម៉ោង',
    vocabulary: [
      {
        word: 'Monday',
        phonetic: '/ˈmʌndeɪ/',
        pos: 'noun',
        khmerMeaning: 'ថ្ងៃច័ន្ទ',
        example: 'We have English on Monday morning.',
        icon: '🗓️',
        partOfSpeech: 'noun',
        meaningKh: 'ថ្ងៃច័ន្ទ',
        exampleSentence: 'We have English on Monday morning.',
        exampleTranslationKh: 'ពួកយើងមានរៀនភាសាអង់គ្លេសនៅព្រឹកថ្ងៃច័ន្ទ។'
      },
      {
        word: 'Wednesday',
        phonetic: '/ˈwenzdeɪ/',
        pos: 'noun',
        khmerMeaning: 'ថ្ងៃពុធ',
        example: 'Wednesday is our science experiment day.',
        icon: '🧪',
        partOfSpeech: 'noun',
        meaningKh: 'ថ្ងៃពុធ',
        exampleSentence: 'Wednesday is our science experiment day.',
        exampleTranslationKh: 'ថ្ងៃពុធគឺជាថ្ងៃពិសោធន៍វិទ្យាសាស្ត្ររបស់យើង។'
      },
      {
        word: 'Timetable',
        phonetic: '/ˈtaɪmteɪbl/',
        pos: 'noun',
        khmerMeaning: 'កាលវិភាគសិក្សា',
        example: 'Check the class timetable on the wall.',
        icon: '📋',
        partOfSpeech: 'noun',
        meaningKh: 'កាលវិភាគសិក្សា',
        exampleSentence: 'Check the class timetable on the wall.',
        exampleTranslationKh: 'ពិនិត្យមើលកាលវិភាគថ្នាក់រៀននៅលើជញ្ជាំង។'
      }
    ],
    spellingWords: ['Monday', 'Wednesday', 'Timetable', 'Friday'],
    conversations: [
      {
        title: 'Asking about the Timetable',
        lines: [
          { avatar: '👦', speaker: 'Dara', text: 'When do we have English class?', translation: 'តើពួកយើងមានរៀនភាសាអង់គ្លេសនៅពេលណា?' },
          { avatar: '👧', speaker: 'Sreynet', text: 'We have English on Monday and Thursday at eight o\'clock.', translation: 'ពួកយើងមានរៀនភាសាអង់គ្លេសនៅថ្ងៃច័ន្ទ និងថ្ងៃព្រហស្បតិ៍ នៅម៉ោង ៨ គត់។' }
        ]
      }
    ],
    languageFocus: {
      grammarTopic: 'Prepositions of Time: ON and AT',
      rule: 'ប្រើ ON ជាមួយថ្ងៃនៃសប្តាហ៍ (on Monday, on Friday)។ ប្រើ AT ជាមួយម៉ោងជាក់លាក់ (at 7:00, at noon)។',
      formula: 'on + [Day of week] / at + [Clock time]',
      examples: [
        { question: 'When is English?', answer: 'On Tuesday.', note: 'on + Day' },
        { question: 'What time is math?', answer: 'At eight o\'clock.', note: 'at + Time' }
      ],
      practiceExercises: [
        { question: 'We play football _____ Saturday.', options: ['on', 'in', 'at'], answer: 'on' },
        { question: 'Class begins _____ seven o\'clock.', options: ['at', 'on', 'to'], answer: 'at' }
      ]
    },
    reading: {
      title: 'Grade 6 Weekly Timetable',
      passage: 'From Monday to Friday, Grade 6 students study Khmer literature, mathematics, science, and English. On Saturday morning, they participate in sports and art activities. Sunday is a restful day to spend with family.',
      questions: [
        { question: 'What do students do on Saturday morning?', options: ['Sports and art', 'Math exam', 'Sleep all day'], answer: 'Sports and art' },
        { question: 'Which day is for family rest?', options: ['Sunday', 'Monday', 'Tuesday'], answer: 'Sunday' }
      ]
    },
    speaking: {
      instruction: 'Ask your partner their favorite day of the week:',
      modelDialogue: [
        { speaker: 'Student A', text: 'What is your favorite day?' },
        { speaker: 'Student B', text: 'My favorite day is Friday because we have art and English!' }
      ],
      prompts: ['What day is today?', 'What subjects do we have tomorrow?']
    },
    writing: {
      instruction: 'Fill in with ON or AT:',
      wordBank: ['on', 'at'],
      tasks: [
        { prompt: 'We study science _____ Wednesday.', answer: 'on' },
        { prompt: 'The bell rings _____ seven o\'clock.', answer: 'at' }
      ]
    },
    remember: {
      vocabList: ['Monday', 'Wednesday', 'Friday', 'Timetable'],
      grammarSummary: 'ON Monday, ON Tuesday / AT 7 o\'clock, AT 8 o\'clock'
    }
  }
];
