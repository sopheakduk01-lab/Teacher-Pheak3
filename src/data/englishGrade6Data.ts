export interface EnglishVocabItem {
  word: string;
  phonetic: string;
  pos: string; // part of speech
  khmerMeaning: string;
  icon: string;
  example: string;
}

export interface EnglishDialogueLine {
  speaker: string;
  avatar: string;
  text: string;
  translation: string;
}

export interface EnglishLessonUnit {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  unitNumber: number;
  unitTitle: string;
  pages: string;
  badge: string;
  themeColor: string;
  icon: string;
  vocabulary: EnglishVocabItem[];
  spellingWords: string[];
  conversations: {
    title: string;
    lines: EnglishDialogueLine[];
  }[];
  languageFocus: {
    grammarTopic: string;
    rule: string;
    formula?: string;
    examples: { question?: string; answer: string; note?: string }[];
    practiceExercises: {
      instruction: string;
      prompt: string;
      answer: string;
      options?: string[];
    }[];
  };
  reading: {
    title: string;
    passage: string;
    questions: {
      question: string;
      answer: string;
      options?: string[];
    }[];
  };
  speaking: {
    instruction: string;
    modelDialogue: { speaker: string; text: string }[];
    prompts: string[];
  };
  writing: {
    instruction: string;
    exerciseType: 'fill_gaps' | 'sentence_construction';
    wordBank?: string[];
    tasks: { prompt: string; answer: string }[];
  };
  remember: {
    vocabList: string[];
    grammarSummary: string;
  };
}

export const ENGLISH_GRADE_6_CHAPTERS = [
  { id: 'ch1', number: 1, title: 'TIME AND ACTIVITIES', titleKhmer: 'ពេលវេលា និងសកម្មភាព', color: 'from-blue-600 to-indigo-700' },
  { id: 'ch2', number: 2, title: 'THE DATE', titleKhmer: 'កាលបរិច្ឆេទ', color: 'from-emerald-600 to-teal-700' },
  { id: 'ch3', number: 3, title: 'MY BODY', titleKhmer: 'រាងកាយរបស់ខ្ញុំ', color: 'from-amber-600 to-orange-700' },
  { id: 'ch4', number: 4, title: 'MY HOME TOWN', titleKhmer: 'ស្រុកកំណើតរបស់ខ្ញុំ', color: 'from-cyan-600 to-blue-700' },
  { id: 'ch5', number: 5, title: 'ANIMALS', titleKhmer: 'សត្វនានា', color: 'from-purple-600 to-pink-700' },
  { id: 'ch6', number: 6, title: 'KHMER FOLK TALES', titleKhmer: 'រឿងព្រេងខ្មែរ', color: 'from-rose-600 to-red-700' },
];

export const ENGLISH_GRADE_6_UNITS: EnglishLessonUnit[] = [
  // ================= CHAPTER 1: TIME AND ACTIVITIES =================
  {
    id: 'ch1_u1',
    chapterNumber: 1,
    chapterTitle: 'TIME AND ACTIVITIES',
    unitNumber: 1,
    unitTitle: 'Greetings And Introductions',
    pages: 'Pages 8 - 11',
    badge: 'Unit 1 • Chapter 1',
    themeColor: 'blue',
    icon: '👋',
    vocabulary: [
      { word: 'morning', phonetic: "/'mɔː.nɪŋ/", pos: 'n', khmerMeaning: 'ពេលព្រឹក', icon: '🌅', example: 'Good morning, teacher!' },
      { word: 'afternoon', phonetic: "/ˌɑːf.tə'nuːn/", pos: 'n', khmerMeaning: 'ពេលរសៀល', icon: '☀️', example: 'Good afternoon, Bol!' },
      { word: 'evening', phonetic: "/'iːv.nɪŋ/", pos: 'n', khmerMeaning: 'ពេលល្ងាច', icon: '🌆', example: 'Good evening, everybody!' },
      { word: 'fine', phonetic: '/faɪn/', pos: 'adj', khmerMeaning: 'សុខសប្បាយ / ល្អ', icon: '😊', example: 'I am fine, thank you.' },
      { word: 'bad', phonetic: '/bæd/', pos: 'adj', khmerMeaning: 'មិនល្អ / អាក្រក់', icon: '🙁', example: 'It is not bad today.' },
    ],
    spellingWords: ['morning', 'afternoon', 'evening', 'fine', 'bad'],
    conversations: [
      {
        title: 'Meeting and Greeting Classmates',
        lines: [
          { speaker: 'Bol', avatar: '👦', text: "Good morning! My name's Bol.", translation: 'អរុណសួស្តី! ខ្ញុំឈ្មោះ បុល។' },
          { speaker: 'Nita', avatar: '👧', text: "Good morning! I'm Nita.", translation: 'អរុណសួស្តី! ខ្ញុំឈ្មោះ នីតា។' },
          { speaker: 'Bol', avatar: '👦', text: 'How are you?', translation: 'តើអ្នកសុខសប្បាយជាទេ?' },
          { speaker: 'Nita', avatar: '👧', text: 'I’m fine, thank you. And you?', translation: 'ខ្ញុំសុខសប្បាយទេ អរគុណ។ ចុះអ្នកវិញ?' },
          { speaker: 'Bol', avatar: '👦', text: 'I’m good. How old are you?', translation: 'ខ្ញុំសុខសប្បាយទេ។ តើអ្នកអាយុប៉ុន្មានឆ្នាំ?' },
          { speaker: 'Nita', avatar: '👧', text: 'I’m 12 years old.', translation: 'ខ្ញុំអាយុ ១២ ឆ្នាំ។' },
          { speaker: 'Bol', avatar: '👦', text: 'What grade are you in?', translation: 'តើអ្នករៀននៅថ្នាក់ទីប៉ុន្មាន?' },
          { speaker: 'Nita', avatar: '👧', text: 'I’m in Grade 6.', translation: 'ខ្ញុំរៀននៅថ្នាក់ទី ៦។' },
        ],
      },
    ],
    languageFocus: {
      grammarTopic: 'To be (am / is / are) in Present Simple',
      rule: 'Use "am" with I; "is" with He, She, It, singular nouns; "are" with You, We, They, plural nouns.',
      formula: 'Subject + am/is/are + Complement',
      examples: [
        { question: 'What is your name?', answer: "I'm Raksa. / My name's Darith.", note: 'Singular identity' },
        { question: 'How are you?', answer: "I am fine. / We're good.", note: 'State of being' },
        { question: 'Who is this?', answer: 'This is Nary.', note: 'Introducing a person' },
      ],
      practiceExercises: [
        { instruction: 'Choose the correct form of "to be"', prompt: 'I ___ in Grade 6.', answer: 'am', options: ['am', 'is', 'are'] },
        { instruction: 'Choose the correct form of "to be"', prompt: 'How ___ you today?', answer: 'are', options: ['am', 'is', 'are'] },
        { instruction: 'Choose the correct form of "to be"', prompt: 'This ___ my friend Vichet.', answer: 'is', options: ['am', 'is', 'are'] },
      ],
    },
    reading: {
      title: 'Ratha and His Family',
      passage:
        "Hello! My name is Ratha. I am 12 years old. I'm in Grade 6. I have a brother and a sister. My brother is Vichet. He is 15 years old. He studies in Grade 9. He is very good at Mathematics. My sister is Ratana. She is 10 years old. She studies in Grade 5. She is good at English. We study in the same school. We go to school by bicycle every morning. The school is about 1 kilometre from our house. It takes 15 minutes to get there. Our school is a nice place to study. It has a library, a garden, a playground and a football field. We like our school.",
      questions: [
        { question: 'Who is in Grade 6?', answer: 'Ratha is in Grade 6.', options: ['Ratha', 'Vichet', 'Ratana', 'His father'] },
        { question: "What is her/his brother's name?", answer: 'His brother is Vichet.', options: ['Vichet', 'Dara', 'Sophea', 'Bol'] },
        { question: 'What subject is her/his brother good at?', answer: 'He is good at Mathematics.', options: ['Mathematics', 'English', 'Science', 'Khmer'] },
        { question: 'How do they go to school?', answer: 'They go to school by bicycle.', options: ['By bicycle', 'By bus', 'On foot', 'By car'] },
      ],
    },
    speaking: {
      instruction: 'Practice self-introduction and asking questions with your partner.',
      modelDialogue: [
        { speaker: 'A', text: "Good morning! My name is Bol. What's your name?" },
        { speaker: 'B', text: "Good morning! I'm Nita. How are you?" },
        { speaker: 'A', text: "I'm fine, thank you. How old are you?" },
        { speaker: 'B', text: "I'm 12 years old. I'm in Grade 6." },
      ],
      prompts: [
        'Ask your friend their name: "What is your name?"',
        'Ask their age: "How old are you?"',
        'Ask their grade: "What grade are you in?"',
      ],
    },
    writing: {
      instruction: 'Write sentences about yourself using the target structures.',
      exerciseType: 'sentence_construction',
      tasks: [
        { prompt: 'My name is ___ (name).', answer: 'My name is Ratha.' },
        { prompt: 'I am ___ years old (age).', answer: 'I am 12 years old.' },
        { prompt: 'I am in Grade ___ (grade).', answer: 'I am in Grade 6.' },
        { prompt: 'I go to school by ___ (bicycle / foot).', answer: 'I go to school by bicycle.' },
        { prompt: 'I like ___ (Mathematics / English).', answer: 'I like English.' },
      ],
    },
    remember: {
      vocabList: ['morning', 'afternoon', 'evening', 'hello', 'bad', 'fine', 'good'],
      grammarSummary: "Positive: I'm Raksa. My name's Darith. This is Nary. | Questions: How are you? What's your name?",
    },
  },

  {
    id: 'ch1_u2',
    chapterNumber: 1,
    chapterTitle: 'TIME AND ACTIVITIES',
    unitNumber: 2,
    unitTitle: 'Telling The Time',
    pages: 'Pages 12 - 15',
    badge: 'Unit 2 • Chapter 1',
    themeColor: 'indigo',
    icon: '⏰',
    vocabulary: [
      { word: 'clock', phonetic: '/klɒk/', pos: 'n', khmerMeaning: 'នាឡិកាជញ្ជាំង', icon: '🕰️', example: 'There is a big clock on the wall.' },
      { word: "o'clock", phonetic: "/ə'klɒk/", pos: 'adv', khmerMeaning: 'ម៉ោងគត់', icon: '⏱️', example: "It's seven o'clock." },
      { word: 'half past', phonetic: '/hɑːf pɑːst/', pos: 'prep/phrase', khmerMeaning: 'កន្លះ (៣០នាទី)', icon: '🕧', example: "It's half past eleven." },
      { word: 'quarter past', phonetic: "/'kwɔː.tə pɑːst/", pos: 'phrase', khmerMeaning: 'លើស១៥នាទី', icon: '🕒', example: "It's quarter past seven." },
      { word: 'quarter to', phonetic: "/'kwɔː.tə tuː/", pos: 'phrase', khmerMeaning: 'ខ្វះ១៥នាទី', icon: '🕤', example: "It's quarter to nine." },
    ],
    spellingWords: ['clock', 'half', "o'clock", 'quarter', 'past'],
    conversations: [
      {
        title: 'Asking and Telling The Time at School',
        lines: [
          { speaker: 'Student A', avatar: '👦', text: 'What time is it now?', translation: 'តើឥឡូវនេះម៉ោងប៉ុន្មានហើយ?' },
          { speaker: 'Student B', avatar: '👧', text: "It's 7 o'clock.", translation: 'គឺម៉ោង ៧ គត់។' },
          { speaker: 'Student A', avatar: '👦', text: 'What time does your maths class start?', translation: 'តើម៉ោងគណិតវិទ្យារបស់អ្នកចាប់ផ្តើមម៉ោងប៉ុន្មាន?' },
          { speaker: 'Student B', avatar: '👧', text: "It starts at 8 o'clock.", translation: 'វាចាប់ផ្តើមនៅម៉ោង ៨ គត់។' },
          { speaker: 'Student A', avatar: '👦', text: 'What time do you have a break?', translation: 'តើអ្នកសម្រាកនៅម៉ោងប៉ុន្មាន?' },
          { speaker: 'Student B', avatar: '👧', text: 'At quarter to 9.', translation: 'នៅម៉ោង ៩ ខ្វះ ១៥ នាទី (៨:៤៥)។' },
          { speaker: 'Student A', avatar: '👦', text: 'What time do you have lunch?', translation: 'តើអ្នកញ៉ាំបាយថ្ងៃត្រង់នៅម៉ោងប៉ុន្មាន?' },
          { speaker: 'Student B', avatar: '👧', text: 'At half past 11.', translation: 'នៅម៉ោង ១១ កន្លះ (១១:៣០)។' },
        ],
      },
    ],
    languageFocus: {
      grammarTopic: 'What time is it? & Telling Time in English',
      rule: 'Use "It is + [time]". Use "o\'clock" for exact hours, "half past" for 30 minutes, "quarter past" for 15 minutes after, "quarter to" for 15 minutes before.',
      formula: 'Question: What time is it? / Answer: It is [time].',
      examples: [
        { question: 'What time is it?', answer: "It is quarter to ten. (9:45)", note: '15 mins before 10' },
        { question: 'What time is it?', answer: "It is quarter past ten. (10:15)", note: '15 mins after 10' },
        { question: 'What time is it?', answer: "It is half past six. (6:30)", note: '30 mins after 6' },
      ],
      practiceExercises: [
        { instruction: 'Complete the time', prompt: '7:00 ➔ It is seven ___', answer: "o'clock", options: ["o'clock", 'half', 'quarter'] },
        { instruction: 'Complete the time', prompt: '7:30 ➔ It is ___ past seven.', answer: 'half', options: ['quarter', 'half', "o'clock"] },
        { instruction: 'Complete the time', prompt: '7:45 ➔ It is quarter ___ eight.', answer: 'to', options: ['to', 'past', 'at'] },
      ],
    },
    reading: {
      title: "Nita's Daily Schedule",
      passage:
        "My name's Nita. Every Monday I get up at six o'clock. I have a bath at quarter to six. I usually arrive at school and clean the classroom at quarter to seven. I raise the flag at five to seven. I study science from seven to eight o'clock. I have a break at quarter to eight. I study maths from eight o'clock to ten o'clock. I study English from ten o'clock to eleven o'clock and go back home at ten past eleven. I have lunch at half past eleven. After school, I normally help my mother with lunch and dinner. I do my homework at night before going to bed.",
      questions: [
        { question: 'What time does Nita get up?', answer: "She gets up at six o'clock.", options: ["Six o'clock", "Seven o'clock", 'Five to seven', 'Half past six'] },
        { question: 'What time does she clean the classroom?', answer: 'At quarter to seven.', options: ['Quarter to seven', "Eight o'clock", 'Quarter past seven', 'Ten past eleven'] },
        { question: 'What time does she study maths?', answer: "From eight o'clock to ten o'clock.", options: ['8:00 to 10:00', '7:00 to 8:00', '10:00 to 11:00', '11:00 to 12:00'] },
        { question: 'What time does she have lunch?', answer: 'At half past eleven (11:30).', options: ['Half past eleven', 'Quarter to eight', "Twelve o'clock", "One o'clock"] },
      ],
    },
    speaking: {
      instruction: 'Say the time in words with your partner.',
      modelDialogue: [
        { speaker: 'A', text: 'What is the time?' },
        { speaker: 'B', text: "It's seven o'clock (7:00)." },
        { speaker: 'A', text: 'What time is it now?' },
        { speaker: 'B', text: "It's quarter past seven (7:15)." },
      ],
      prompts: [
        '7:00 ➔ It is seven o’clock.',
        '7:15 ➔ It is quarter past seven.',
        '7:30 ➔ It is half past seven.',
        '7:45 ➔ It is quarter to eight.',
      ],
    },
    writing: {
      instruction: 'Write the time below in words.',
      exerciseType: 'sentence_construction',
      tasks: [
        { prompt: '6:30 ➔ It’s ___', answer: 'It’s half past six.' },
        { prompt: '7:00 ➔ It’s ___', answer: 'It’s seven o’clock.' },
        { prompt: '8:30 ➔ It’s ___', answer: 'It’s half past eight.' },
        { prompt: '9:45 ➔ It’s ___', answer: 'It’s quarter to ten.' },
        { prompt: '11:00 ➔ It’s ___', answer: 'It’s eleven o’clock.' },
      ],
    },
    remember: {
      vocabList: ['clock', 'half', 'past', "o'clock", 'time', 'quarter to', 'quarter past'],
      grammarSummary: 'Question: What time is it? | Answers: It is quarter to ten. / It is quarter past ten. / It is half past six.',
    },
  },

  {
    id: 'ch1_u3',
    chapterNumber: 1,
    chapterTitle: 'TIME AND ACTIVITIES',
    unitNumber: 3,
    unitTitle: 'Feeling Happy',
    pages: 'Pages 16 - 19',
    badge: 'Unit 3 • Chapter 1',
    themeColor: 'teal',
    icon: '😄',
    vocabulary: [
      { word: 'watch', phonetic: '/wɒtʃ/', pos: 'v', khmerMeaning: 'មើល / ទស្សនា', icon: '👀', example: 'I watch television after dinner.' },
      { word: 'television', phonetic: "/'tel.ɪ.vɪʒ.ən/", pos: 'n', khmerMeaning: 'ទូរទស្សន៍ (TV)', icon: '📺', example: 'They have a big television.' },
      { word: 'school', phonetic: '/skuːl/', pos: 'n', khmerMeaning: 'សាលារៀន', icon: '🏫', example: 'We go to school on foot.' },
      { word: 'bath', phonetic: '/bɑːθ/', pos: 'n/v', khmerMeaning: 'ងូតទឹក', icon: '🛁', example: 'I take a bath every morning.' },
      { word: 'happy', phonetic: "/'hæp.i/", pos: 'adj', khmerMeaning: 'សប្បាយរីករាយ', icon: '😊', example: 'Dara feels very happy today.' },
    ],
    spellingWords: ['bath', 'happy', 'school', 'television', 'watch'],
    conversations: [
      {
        title: 'Daily Activities & Badminton',
        lines: [
          { speaker: 'Boy', avatar: '👦', text: 'What time do you get up?', translation: 'តើអ្នកក្រោកពីដំណេកម៉ោងប៉ុន្មាន?' },
          { speaker: 'Girl', avatar: '👧', text: "I get up at five o'clock.", translation: 'ខ្ញុំក្រោកនៅម៉ោង ៥ គត់។' },
          { speaker: 'Boy', avatar: '👦', text: 'How do you go to school?', translation: 'តើអ្នកទៅសាលារៀនដោយរបៀបណា?' },
          { speaker: 'Girl', avatar: '👧', text: 'I go to school on foot.', translation: 'ខ្ញុំទៅសាលារៀនដោយដើរថ្មើរជើង។' },
          { speaker: 'Boy', avatar: '👦', text: 'When do you play badminton?', translation: 'តើអ្នកលេងវាយសីនៅពេលណា?' },
          { speaker: 'Girl', avatar: '👧', text: 'I play badminton at half past four.', translation: 'ខ្ញុំលេងវាយសីនៅម៉ោង ៤ កន្លះ (៤:៣០)។' },
          { speaker: 'Boy', avatar: '👦', text: 'Who do you play with?', translation: 'តើអ្នកលេងជាមួយនរណា?' },
          { speaker: 'Girl', avatar: '👧', text: 'I play with my mother.', translation: 'ខ្ញុំលេងជាមួយម្តាយរបស់ខ្ញុំ។' },
        ],
      },
    ],
    languageFocus: {
      grammarTopic: 'Present Simple with Wh_ Questions',
      rule: 'Use Wh- word + do/does + Subject + base verb? (What time, How, When, Who)',
      formula: 'Wh_ word + do/does + S + V + ...?',
      examples: [
        { question: 'What time do you get up?', answer: "I get up at five o'clock." },
        { question: 'How do you go to school?', answer: 'I go to school on foot.' },
        { question: 'When do you play sports?', answer: 'I play at 4:30 PM.' },
      ],
      practiceExercises: [
        { instruction: 'Form question', prompt: '___ do you go to school? - On foot.', answer: 'How', options: ['How', 'What', 'Who'] },
        { instruction: 'Form question', prompt: '___ time do you get up? - At 6:00.', answer: 'What', options: ['What', 'When', 'Where'] },
      ],
    },
    reading: {
      title: 'Dara, My Best Friend',
      passage:
        'Dara is my best friend. He studies in Grade 6 with me. He has a new bicycle. He goes to school with his sister. Every day he goes to school on time. He is a punctual student and helpful friend. He spends his free time on his studies and family. After dinner, he reads books and does homework. He sometimes watches television and does housework. He is a smart student in the class. All classmates love him very much. His parents are really happy with his activities and study record.',
      questions: [
        { question: 'What grade does Dara study in?', answer: 'He studies in Grade 6.', options: ['Grade 6', 'Grade 5', 'Grade 7', 'Grade 4'] },
        { question: 'How do Dara and his sister go to school?', answer: 'By bicycle.', options: ['By bicycle', 'On foot', 'By bus', 'By motorbike'] },
        { question: 'What does he do after dinner?', answer: 'He reads books and does homework.', options: ['Reads books and does homework', 'Plays football', 'Sleeps early', 'Goes outside'] },
        { question: 'Why are his parents happy?', answer: 'Because of his good activities and study record.', options: ['His activities and study record', 'He has money', 'He buys a car', 'He sleeps late'] },
      ],
    },
    speaking: {
      instruction: 'Ask and answer about happy activities with your partner.',
      modelDialogue: [
        { speaker: 'A', text: 'What time do they play basketball?' },
        { speaker: 'B', text: "They play basketball at 5 o'clock." },
        { speaker: 'A', text: 'When do you take a bath?' },
        { speaker: 'B', text: 'I take a bath in the morning.' },
      ],
      prompts: ['play basketball', 'take a bath', 'watch television'],
    },
    writing: {
      instruction: 'Write five sentences about happy activities and times.',
      exerciseType: 'sentence_construction',
      tasks: [
        { prompt: 'I play football with my friends at ___', answer: 'I play football with my friends at three o’clock.' },
        { prompt: 'I watch television at ___', answer: 'I watch television at seven o’clock.' },
        { prompt: 'I do my homework at ___', answer: 'I do my homework at eight o’clock.' },
      ],
    },
    remember: {
      vocabList: ['bath', 'happy', 'television', 'school', 'watch'],
      grammarSummary: 'Present Simple with Wh_ questions: What time do you get up? -> I get up at five o’clock. How do you go to school? -> I go to school on foot.',
    },
  },

  // Chapter 2 Unit 1: The Days
  {
    id: 'ch2_u1',
    chapterNumber: 2,
    chapterTitle: 'THE DATE',
    unitNumber: 1,
    unitTitle: 'The Days',
    pages: 'Pages 30 - 33',
    badge: 'Unit 1 • Chapter 2',
    themeColor: 'emerald',
    icon: '📅',
    vocabulary: [
      { word: 'Monday', phonetic: "/'mʌn.deɪ/", pos: 'n', khmerMeaning: 'ថ្ងៃចន្ទ', icon: '1️⃣', example: 'We study English on Monday.' },
      { word: 'Tuesday', phonetic: "/'tjuːz.deɪ/", pos: 'n', khmerMeaning: 'ថ្ងៃអង្គារ', icon: '2️⃣', example: 'She washes her clothes on Tuesday.' },
      { word: 'Wednesday', phonetic: "/'wenz.deɪ/", pos: 'n', khmerMeaning: 'ថ្ងៃពុធ', icon: '3️⃣', example: 'We have Khmer on Wednesday.' },
      { word: 'Thursday', phonetic: "/'θɜːz.deɪ/", pos: 'n', khmerMeaning: 'ថ្ងៃព្រហស្បតិ៍', icon: '4️⃣', example: 'I play sports on Thursday.' },
      { word: 'Friday', phonetic: "/'fraɪ.deɪ/", pos: 'n', khmerMeaning: 'ថ្ងៃសុក្រ', icon: '5️⃣', example: 'We have English on Friday at eight o’clock.' },
      { word: 'Saturday', phonetic: "/'sæt.ə.deɪ/", pos: 'n', khmerMeaning: 'ថ្ងៃសៅរ៍', icon: '6️⃣', example: 'We stay home on Saturday evening.' },
      { word: 'Sunday', phonetic: "/'sʌn.deɪ/", pos: 'n', khmerMeaning: 'ថ្ងៃអាទិត្យ', icon: '7️⃣', example: 'Sunday is a holiday.' },
    ],
    spellingWords: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    conversations: [
      {
        title: 'Days of the Week in Class',
        lines: [
          { speaker: 'Teacher', avatar: '👩‍🏫', text: 'Good morning everybody! How are you today?', translation: 'អរុណសួស្តីអ្នកទាំងអស់គ្នា! តើថ្ងៃនេះអ្នកសុខសប្បាយជាទេ?' },
          { speaker: 'Class', avatar: '👥', text: "We're fine, thanks. And you?", translation: 'ពួកយើងសុខសប្បាយទេ អរគុណ។ ចុះអ្នកគ្រូវិញ?' },
          { speaker: 'Teacher', avatar: '👩‍🏫', text: 'I’m fine too, thanks. What day is today, Raksa?', translation: 'អ្នកគ្រូក៏សុខសប្បាយដែរ អរគុណ។ រក្សា តើថ្ងៃនេះជាថ្ងៃអ្វី?' },
          { speaker: 'Raksa', avatar: '👧', text: 'Today is Monday.', translation: 'ថ្ងៃនេះគឺថ្ងៃចន្ទ។' },
          { speaker: 'Teacher', avatar: '👩‍🏫', text: 'Good. What days do we study English in a week?', translation: 'ល្អណាស់។ តើយើងរៀនភាសាអង់គ្លេសថ្ងៃណាខ្លះក្នុងមួយសប្តាហ៍?' },
          { speaker: 'Bol', avatar: '👦', text: 'We study English on Monday and Friday at eight o’clock.', translation: 'ពួកយើងរៀនអង់គ្លេសនៅថ្ងៃចន្ទ និងថ្ងៃសុក្រ វេលាម៉ោង ៨ គត់។' },
        ],
      },
    ],
    languageFocus: {
      grammarTopic: 'Preposition "on" with Days of the Week',
      rule: 'Always use the preposition "on" before days of the week (on Monday, on Tuesday, etc.). Use "at" for specific clock times (at 8 o\'clock).',
      formula: 'on + Day of the week | at + Clock time',
      examples: [
        { question: 'What day is today?', answer: 'Today is Monday.' },
        { question: 'When do you study English?', answer: "We study English on Monday and Friday at 8 o'clock." },
      ],
      practiceExercises: [
        { instruction: 'Choose on or at', prompt: 'We study English ___ Thursday.', answer: 'on', options: ['on', 'at', 'in'] },
        { instruction: 'Choose on or at', prompt: 'She teaches Maths ___ 9 o’clock.', answer: 'at', options: ['on', 'at', 'in'] },
      ],
    },
    reading: {
      title: "Raksa's Weekly Schedule",
      passage:
        'Raksa studies in Grade 6. She goes to school from Monday to Saturday. She likes studying English every Monday and Friday. She is good at English in her class. She and her family do the housework on Sunday morning. She waters the flowers every evening. She washes her clothes on Tuesday, Thursday and Sunday evenings. On Saturday night her parents stay at home but she goes out with her brother. Her parents are happy with her studies.',
      questions: [
        { question: 'What days does she study English?', answer: 'Every Monday and Friday.', options: ['Monday and Friday', 'Tuesday and Thursday', 'Saturday', 'Sunday'] },
        { question: 'How is her English in her class?', answer: 'She is good at English.', options: ['Good at English', 'Bad at English', 'Weak', 'So so'] },
        { question: 'When do she and her family do housework?', answer: 'On Sunday morning.', options: ['On Sunday morning', 'On Monday', 'On Friday', 'Every night'] },
      ],
    },
    speaking: {
      instruction: 'Ask and answer about the timetable with your partner.',
      modelDialogue: [
        { speaker: 'A', text: 'What days does your teacher teach English?' },
        { speaker: 'B', text: 'She teaches on Monday and Friday.' },
        { speaker: 'A', text: 'What time do we study Maths on Monday?' },
        { speaker: 'B', text: "We study Maths at 8 o'clock." },
      ],
      prompts: ['English on Monday and Friday', 'Maths on Tuesday', 'Khmer on Wednesday'],
    },
    writing: {
      instruction: 'Write sentences using "on" and "at".',
      exerciseType: 'fill_gaps',
      wordBank: ['on', 'at'],
      tasks: [
        { prompt: 'We study English ___ Thursday.', answer: 'on' },
        { prompt: 'She teaches Maths ___ 9 o’clock.', answer: 'at' },
        { prompt: 'Raksa goes to Siem Reap ___ Sunday.', answer: 'on' },
        { prompt: 'School starts ___ 7:00 AM.', answer: 'at' },
      ],
    },
    remember: {
      vocabList: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      grammarSummary: 'We study English on Thursday. She teaches Maths at 9 o’clock.',
    },
  },

  // Chapter 3 Unit 1: My Head
  {
    id: 'ch3_u1',
    chapterNumber: 3,
    chapterTitle: 'MY BODY',
    unitNumber: 1,
    unitTitle: 'My Head',
    pages: 'Pages 52 - 55',
    badge: 'Unit 1 • Chapter 3',
    themeColor: 'amber',
    icon: '🗣️',
    vocabulary: [
      { word: 'eye', phonetic: '/aɪ/', pos: 'n', khmerMeaning: 'ភ្នែក', icon: '👁️', example: 'I have two eyes.' },
      { word: 'nose', phonetic: '/nəʊz/', pos: 'n', khmerMeaning: 'ច្រមុះ', icon: '👃', example: 'My nose can smell.' },
      { word: 'cheek', phonetic: '/tʃiːk/', pos: 'n', khmerMeaning: 'ថ្ពាល់', icon: '😊', example: 'She has two rosy cheeks.' },
      { word: 'forehead', phonetic: "/'fɔː.hed/", pos: 'n', khmerMeaning: 'ថ្ងាស', icon: '💆', example: 'He touches his forehead.' },
      { word: 'ear', phonetic: '/ɪər/', pos: 'n', khmerMeaning: 'ត្រចៀក', icon: '👂', example: 'My ears can hear.' },
      { word: 'mouth', phonetic: '/maʊθ/', pos: 'n', khmerMeaning: 'មាត់', icon: '👄', example: 'My mouth can speak and eat.' },
    ],
    spellingWords: ['ear', 'eye', 'mouth', 'nose', 'cheek', 'forehead'],
    conversations: [
      {
        title: 'Asking About Head Features',
        lines: [
          { speaker: 'Boy', avatar: '👦', text: 'How many eyes do you have?', translation: 'តើអ្នកមានភ្នែកប៉ុន្មាន?' },
          { speaker: 'Girl', avatar: '👧', text: 'I have two eyes.', translation: 'ខ្ញុំមានភ្នែកពីរ។' },
          { speaker: 'Boy', avatar: '👦', text: 'How many ears do you have?', translation: 'តើអ្នកមានត្រចៀកប៉ុន្មាន?' },
          { speaker: 'Girl', avatar: '👧', text: 'I have two ears.', translation: 'ខ្ញុំមានត្រចៀកពីរ។' },
          { speaker: 'Boy', avatar: '👦', text: 'How many mouths does Sophal have?', translation: 'តើសុផលមានមាត់ប៉ុន្មាន?' },
          { speaker: 'Girl', avatar: '👧', text: 'He has one mouth.', translation: 'គាត់មានមាត់មួយ។' },
        ],
      },
    ],
    languageFocus: {
      grammarTopic: 'How many + Noun + do/does + S + have?',
      rule: 'Use "have" with I/You/We/They; use "has" with He/She/It. In questions with do/does, always use the base form "have".',
      formula: 'Question: How many + Plural Noun + do/does + S + have? | Answer: S + have/has + number + Noun.',
      examples: [
        { question: 'How many eyes do you have?', answer: 'I have two eyes.' },
        { question: 'How many noses does she have?', answer: 'She has one nose.' },
      ],
      practiceExercises: [
        { instruction: 'Fill have or has', prompt: 'I ___ two ears.', answer: 'have', options: ['have', 'has'] },
        { instruction: 'Fill have or has', prompt: 'She ___ one mouth.', answer: 'has', options: ['have', 'has'] },
      ],
    },
    reading: {
      title: "Nita's Head",
      passage:
        'I’m Nita. I have one head and everyone has one head too. On my head, I have one nose, one mouth and one forehead. I have two lips, two cheeks, two ears and two eyes. My mouth can speak and my nose can smell. My ears can hear and listen. My eyes can see. I comb my hair, brush my teeth and wash my face everyday. I love my head.',
      questions: [
        { question: 'How many heads does Nita have?', answer: 'She has one head.', options: ['One head', 'Two heads', 'Three heads'] },
        { question: 'How many eyes does she have?', answer: 'She has two eyes.', options: ['Two eyes', 'One eye', 'Four eyes'] },
        { question: 'What can her ears do?', answer: 'Her ears can hear and listen.', options: ['Hear and listen', 'Smell', 'See', 'Speak'] },
      ],
    },
    speaking: {
      instruction: 'Practice counting facial features with your partner.',
      modelDialogue: [
        { speaker: 'A', text: 'How many mouths do you have?' },
        { speaker: 'B', text: 'I have one mouth.' },
        { speaker: 'A', text: 'How many ears do you have?' },
        { speaker: 'B', text: 'I have two ears.' },
      ],
      prompts: ['eyes (2)', 'ears (2)', 'mouth (1)', 'nose (1)', 'forehead (1)'],
    },
    writing: {
      instruction: 'Write five sentences about your head in your notebook.',
      exerciseType: 'sentence_construction',
      tasks: [
        { prompt: 'I have two ___ (eyes / ears).', answer: 'I have two eyes.' },
        { prompt: 'I have one ___ (nose / mouth).', answer: 'I have one nose.' },
        { prompt: 'My mouth can ___ (speak / eat).', answer: 'My mouth can speak.' },
      ],
    },
    remember: {
      vocabList: ['nose', 'eye', 'ear', 'mouth', 'cheek', 'forehead'],
      grammarSummary: 'How many ears do you have? -> I have two ears. | How many noses does she have? -> She has one nose.',
    },
  },

  // Chapter 5 Unit 1: Pets
  {
    id: 'ch5_u1',
    chapterNumber: 5,
    chapterTitle: 'ANIMALS',
    unitNumber: 1,
    unitTitle: 'Pets',
    pages: 'Pages 96 - 99',
    badge: 'Unit 1 • Chapter 5',
    themeColor: 'purple',
    icon: '🐾',
    vocabulary: [
      { word: 'cat', phonetic: '/kæt/', pos: 'n', khmerMeaning: 'ឆ្មា', icon: '🐱', example: 'She likes cats.' },
      { word: 'dog', phonetic: '/dɒɡ/', pos: 'n', khmerMeaning: 'ឆ្កែ', icon: '🐶', example: 'I have two dogs.' },
      { word: 'rabbit', phonetic: "/'ræb.ɪt/", pos: 'n', khmerMeaning: 'ទន្សាយ', icon: '🐰', example: 'I do not like rabbits.' },
      { word: 'parrot', phonetic: "/'pær.ət/", pos: 'n', khmerMeaning: 'សេក', icon: '🦜', example: 'Parrots can talk.' },
      { word: 'dove', phonetic: '/dʌv/', pos: 'n', khmerMeaning: 'ព្រាប', icon: '🕊️', example: 'White doves fly in the sky.' },
      { word: 'fish', phonetic: '/fɪʃ/', pos: 'n', khmerMeaning: 'ត្រី', icon: '🐟', example: 'They raise gold fish.' },
    ],
    spellingWords: ['cat', 'fish', 'dove', 'dog', 'rabbit', 'parrot'],
    conversations: [
      {
        title: 'Talking About Pets at Home',
        lines: [
          { speaker: 'Girl', avatar: '👧', text: 'What pets do Cambodian people raise at home, Bol?', translation: 'តើប្រជាជនកម្ពុជាចិញ្ចឹមសត្វអ្វីខ្លះនៅផ្ទះ បុល?' },
          { speaker: 'Bol', avatar: '👦', text: 'They raise dogs, cats, parrots, rabbits, doves and fish.', translation: 'ពួកគេចិញ្ចឹមឆ្កែ ឆ្មា សេក ទន្សាយ ព្រាប និងត្រី។' },
          { speaker: 'Girl', avatar: '👧', text: 'Oh, do you like rabbits?', translation: 'អូ តើអ្នកចូលចិត្តទន្សាយទេ?' },
          { speaker: 'Bol', avatar: '👦', text: 'No, I do not like rabbits. I like dogs.', translation: 'ទេ ខ្ញុំមិនចូលចិត្តទន្សាយទេ។ ខ្ញុំចូលចិត្តឆ្កែ។' },
          { speaker: 'Girl', avatar: '👧', text: 'Do you have dogs at your home?', translation: 'តើអ្នកមានឆ្កែនៅផ្ទះទេ?' },
          { speaker: 'Bol', avatar: '👦', text: 'Yes, I have two dogs. They are my best friends.', translation: 'បាទ ខ្ញុំមានឆ្កែពីរ។ ពួកវាជាមិត្តល្អបំផុតរបស់ខ្ញុំ។' },
        ],
      },
    ],
    languageFocus: {
      grammarTopic: 'Like / Do not like (Don’t like / Doesn’t like)',
      rule: 'I / You / We / They + like / do not like. He / She / It + likes / does not like.',
      formula: 'Positive: S + like/likes + N | Negative: S + don’t/doesn’t like + N',
      examples: [
        { question: 'Do you like cats?', answer: 'I like dogs. I do not like cats.' },
        { question: 'Does she like parrots?', answer: 'She likes parrots. She does not like mice.' },
      ],
      practiceExercises: [
        { instruction: 'Complete with like or do not like', prompt: 'I ___ (like) dogs.', answer: 'like', options: ['like', 'likes', 'do not like'] },
        { instruction: 'Complete with like or do not like', prompt: 'My brothers ___ (not like) dogs.', answer: 'do not like', options: ['do not like', 'does not like', 'like'] },
      ],
    },
    reading: {
      title: "Raksa's Two Dogs",
      passage:
        'Raksa has two dogs. She calls them Jimmy and Dicky. Jimmy is white and Dicky is brown. They are always friendly. They are really clever and smart. They can obey her when she says sit down, stand up, stay, shake hands and follow her to ride the motorbike. They always run to welcome her when she comes back from school. They always bark at strangers. She loves them very much because they are friendly and protect her and her family every day.',
      questions: [
        { question: 'How many dogs does Raksa have?', answer: 'She has two dogs.', options: ['Two dogs', 'Three dogs', 'One dog'] },
        { question: 'What does she call them?', answer: 'Jimmy and Dicky.', options: ['Jimmy and Dicky', 'Tom and Jerry', 'Lucky and Black'] },
        { question: 'Why does she love them?', answer: 'Because they are friendly and protect her family.', options: ['They are friendly and protect her family', 'They eat a lot', 'They are expensive'] },
      ],
    },
    speaking: {
      instruction: 'Ask and answer about pet preferences with your partner.',
      modelDialogue: [
        { speaker: 'A', text: 'What pets does the girl like?' },
        { speaker: 'B', text: 'She likes dogs and fish.' },
        { speaker: 'A', text: 'Do you like cats?' },
        { speaker: 'B', text: "No, I don't like cats. I like parrots." },
      ],
      prompts: ['cats', 'dogs', 'rabbits', 'doves', 'fish'],
    },
    writing: {
      instruction: 'Write five sentences about your lovely pet.',
      exerciseType: 'sentence_construction',
      tasks: [
        { prompt: 'I like my ___ (dog / cat).', answer: 'I like my two dogs.' },
        { prompt: 'My pet is ___ (friendly / smart).', answer: 'My pet is friendly.' },
      ],
    },
    remember: {
      vocabList: ['cats', 'fish', 'doves', 'dogs', 'rabbits', 'parrots'],
      grammarSummary: 'I like dogs. He likes cats. | She doesn’t like cats. They don’t like doves. | Do you like cats?',
    },
  },

  // Chapter 6 Unit 1: The Hen And The Chicks
  {
    id: 'ch6_u1',
    chapterNumber: 6,
    chapterTitle: 'KHMER FOLK TALES',
    unitNumber: 1,
    unitTitle: 'The Hen And The Chicks',
    pages: 'Pages 118 - 121',
    badge: 'Unit 1 • Chapter 6',
    themeColor: 'rose',
    icon: '📖',
    vocabulary: [
      { word: 'yard', phonetic: '/jɑːd/', pos: 'n', khmerMeaning: 'ទីធ្លា / ទីធ្លាផ្ទះ', icon: '🏡', example: 'They walked around the yard.' },
      { word: 'hen', phonetic: '/hen/', pos: 'n', khmerMeaning: 'មេមាន់', icon: '🐔', example: 'The hen has ten chicks.' },
      { word: 'ground', phonetic: '/ɡraʊnd/', pos: 'n', khmerMeaning: 'ដី / ផ្ទៃដី', icon: '🌱', example: 'The hen scratched the ground.' },
      { word: 'eagle', phonetic: "/'iː.ɡəl/", pos: 'n', khmerMeaning: 'សត្វឥន្ទ្រី', icon: '🦅', example: 'An eagle was flying in the sky.' },
      { word: 'chicks', phonetic: '/tʃɪks/', pos: 'n', khmerMeaning: 'កូនមាន់ៗ', icon: '🐥', example: 'All chicks followed their mother.' },
      { word: 'nest', phonetic: '/nest/', pos: 'n', khmerMeaning: 'សំបុក', icon: '🪹', example: 'They got out of their nest.' },
    ],
    spellingWords: ['nest', 'ground', 'eagle', 'hen', 'yard', 'chick'],
    conversations: [
      {
        title: 'Discussing Khmer Folk Tales',
        lines: [
          { speaker: 'Boy', avatar: '👦', text: 'Hi! What are you reading, Nita?', translation: 'សួស្តី! តើអ្នកកំពុងអានអ្វី នីតា?' },
          { speaker: 'Nita', avatar: '👧', text: 'I’m reading the Khmer folk tales.', translation: 'ខ្ញុំកំពុងអានរឿងព្រេងខ្មែរ។' },
          { speaker: 'Boy', avatar: '👦', text: 'What stories are you reading?', translation: 'តើអ្នកកំពុងអានរឿងអ្វី?' },
          { speaker: 'Nita', avatar: '👧', text: 'I’m reading the story about the hen and its chicks.', translation: 'ខ្ញុំកំពុងអានរឿងមេមាន់ និងកូនមាន់។' },
          { speaker: 'Boy', avatar: '👦', text: 'Can you summarise the story?', translation: 'តើអ្នកអាចសង្ខេបរឿងនេះបានទេ?' },
          { speaker: 'Nita', avatar: '👧', text: 'When there was an eagle, its babies hid under its wings.', translation: 'នៅពេលមានសត្វឥន្ទ្រីមក កូនៗរបស់វាបានពួនក្រោមស្លាបរបស់វា។' },
          { speaker: 'Boy', avatar: '👦', text: 'How did the story educate us?', translation: 'តើរឿងនេះអប់រំយើងដូចម្តេច?' },
          { speaker: 'Nita', avatar: '👧', text: 'It educated us that mothers always take care of their children.', translation: 'រឿងនេះអប់រំថាម្តាយតែងតែថែរក្សាកូនៗជានិច្ច។' },
        ],
      },
    ],
    languageFocus: {
      grammarTopic: 'There was / There were in Past Simple',
      rule: 'Use "There was" for one singular item in the past. Use "There were" for two or more plural items in the past.',
      formula: 'There was + singular noun | There were + plural noun',
      examples: [
        { question: 'Was there an eagle?', answer: 'There was an eagle.' },
        { question: 'Were there chicks?', answer: 'There were ten chicks.' },
      ],
      practiceExercises: [
        { instruction: 'Choose was or were', prompt: 'There ___ (was/were) ten chicks.', answer: 'were', options: ['was', 'were'] },
        { instruction: 'Choose was or were', prompt: 'There ___ (was/were) one hen.', answer: 'was', options: ['was', 'were'] },
        { instruction: 'Choose was or were', prompt: 'There ___ (was/were) five nests.', answer: 'were', options: ['was', 'were'] },
      ],
    },
    reading: {
      title: 'The Hen and the Chicks',
      passage:
        'One day, the hen and ten chicks got out of their nest and walked around the yard. All chicks walked together and followed their mother. The hen scratched the ground to find food. The hen made a sound to tell the chicks to come when it saw food. Then all chicks ran to the hen. When the hen saw an eagle flying over to catch its babies, the hen called the chicks to hide under its wings. The hen reared and took care of its chicks very well. The chicks grew up very fast.',
      questions: [
        { question: 'How many hens were there?', answer: 'There was one hen.', options: ['One hen', 'Two hens', 'Ten hens'] },
        { question: 'How many chicks were there?', answer: 'There were ten chicks.', options: ['Ten chicks', 'Five chicks', 'Two chicks'] },
        { question: 'What did the hen do when it saw an eagle?', answer: 'It called the chicks to hide under its wings.', options: ['Called chicks to hide under wings', 'Ran away alone', 'Flew away'] },
      ],
    },
    speaking: {
      instruction: 'Ask and answer using "How many..." and "There was / There were".',
      modelDialogue: [
        { speaker: 'A', text: 'How many animals did you see in the picture?' },
        { speaker: 'B', text: 'There were nine chicks, and two hens.' },
      ],
      prompts: ['chicks (10)', 'hen (1)', 'eagle (1)', 'nests (5)'],
    },
    writing: {
      instruction: 'Write sentences about the hen and chicks using There was / There were.',
      exerciseType: 'sentence_construction',
      tasks: [
        { prompt: 'There ___ (was/were) ten chicks in the picture.', answer: 'There were ten chicks in the picture.' },
        { prompt: 'There ___ (was/were) an eagle in the sky.', answer: 'There was an eagle in the sky.' },
        { prompt: 'There ___ (was/were) a nest on the tree.', answer: 'There was a nest on the tree.' },
      ],
    },
    remember: {
      vocabList: ['eagle', 'chick', 'ground', 'hen', 'nest', 'yard'],
      grammarSummary: 'There were ten chicks in the picture. | There was an eagle. | There was a nest.',
    },
  },
];
