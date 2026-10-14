import { LessonPlanDetail } from './types';

const englishTitles = [
  'Unit 1: Greetings, Self-Introduction & Daily Routine',
  'Unit 2: My Family Members & Occupations',
  'Unit 3: School Subjects & Favorite Activities',
  'Unit 4: Telling the Time & Daily Schedule',
  'Unit 5: Food, Drinks & Ordering at a Restaurant',
  'Unit 6: Describing People (Appearance & Personality)',
  'Unit 7: My Home, Rooms & Household Chores',
  'Unit 8: Animals, Pets & Wildlife Habitats',
  'Unit 9: Places in Town & Giving Directions',
  'Unit 10: Weather, Seasons & Suitable Clothes',
  'Unit 11: Sports, Hobbies & Free Time Activities',
  'Unit 12: Health Problems & Giving Advice (Should/Should not)',
  'Unit 13: Shopping, Prices & Quantities (How much/How many)',
  'Unit 14: Transportation & Travel Plans',
  'Unit 15: Past Experiences (Simple Past Tense)',
  'Unit 16: Future Dreams & Aspirations (Going to / Will)',
  'Unit 17: Environment & Saving Energy',
  'Unit 18: Festivities & Cambodian Traditions in English',
  // Life skills integrated modules
  'Life Skills 1: ការដោះស្រាយទំនាស់ដោយសន្តិវិធី (Conflict Resolution)',
  'Life Skills 2: ការទំនាក់ទំនងប្រកបដោយប្រសិទ្ធភាព (Effective Communication)',
  'Life Skills 3: ការគ្រប់គ្រងពេលវេលា និងផែនការសិក្សា (Time Management)',
  'Life Skills 4: ការធ្វើការងារជាក្រុម និងភាពជាអ្នកដឹកនាំ (Teamwork & Leadership)',
  'Life Skills 5: ការសម្រេចចិត្តដោយឈ្លាសវៃ (Smart Decision Making)',
  'Life Skills 6: គំនិតច្នៃប្រឌិត និងការដោះស្រាយបញ្ហា (Creative Problem Solving)',
  'Life Skills 7: ការគ្រប់គ្រងថវិកាសន្សំផ្ទាល់ខ្លួន (Financial Literacy for Kids)',
  'Life Skills 8: ការថែរក្សាឧបករណ៍ និងទ្រព្យសម្បត្តិសាធារណៈ (Caring for Public Property)',
  'Life Skills 9: សុជីវធម៌ក្នុងការប្រើប្រាស់បណ្តាញសង្គម (Digital Citizenship)',
  'Life Skills 10: ការយល់ចិត្ត និងការជួយយកអាសាអ្នកដទៃ (Empathy & Helping Others)',
  'Life Skills 11: ការដាំបន្លែសរីរាង្គខ្នាតតូចនៅផ្ទះ (Home Gardening)',
  'Life Skills 12: ការកែច្នៃសម្ភារៈប្រើប្រាស់ឡើងវិញ (Upcycling & Recycling Craft)',
  'Life Skills 13: ការជួសជុលសៀវភៅ និងសម្ភារៈសិក្សា (Book Mending Skills)',
  'Life Skills 14: ការចម្អិនអាហារសាមញ្ញ និងសុវត្ថិភាពផ្ទះបាយ (Simple Cooking)',
  'Life Skills 15: ការរៀបចំបន្ទប់គេង និងតុរៀនឱ្យមានរបៀប (Organizing Living Space)',
  'Life Skills 16: ការការពារខ្លួនពីគ្រោះមហន្តរាយ និងភ្លើងឆេះ (Emergency Preparedness)',
  'Life Skills 17: ការគោរពភាពខុសប្លែកគ្នាក្នុងសង្គម (Respecting Diversity)',
  'Life Skills 18: ការរៀបចំគោលដៅជីវិត និងក្តីស្រមៃអនាគត (Goal Setting & Dreams)'
];

export const englishPlans: LessonPlanDetail[] = englishTitles.map((title, idx) => ({
  id: `english_lesson_${idx + 1}`,
  lessonNo: `មេរៀនទី ${idx + 1}`,
  mainLessonTitle: `មេរៀនទី ${idx + 1} : ${title}`,
  subLessonTitle: `ភាសាអង់គ្លេស និងបំណិនជីវិត - ${title}`,
  title: `ភាសាអង់គ្លេស & បំណិនជីវិត - ${title}`,
  subject: 'ភាសាអង់គ្លេស និងបំណិនជីវិត',
  grade: 'ថ្នាក់ទី ៦',
  duration: '២ ម៉ោង (៩០ នាទី)',
  sourceRef: `English Primary Curriculum & MoEYS Life Skills Framework (Pages ${10 + idx * 4}-${14 + idx * 4})`,
  pedagogy: 'វិធីសាស្ត្រទំនាក់ទំនងភាសា និងបំណិនសតវត្សរ៍ទី២១ (Communicative Language Teaching & Experiential Learning)',
  digitalTools: ['Duolingo / Wordwall Interactive Games', 'English Listening Audio / Video clips'],
  learningGames: ['Role-play Speaking Dialogue', 'Life Skills Simulation Challenge'],
  objectives: {
    knowledge: `សិស្សអាចយល់វាក្យសព្ទ វេយ្យាករណ៍ និងគោលការណ៍បំណិនជីវិតលើប្រធានបទ "${title}" បានយ៉ាងស្ទាត់ជំនាញ។`,
    skills: 'សិស្សមានជំនាញសន្ទនាភាសាអង់គ្លេស អនុវត្តបំណិនជីវិតជាក់ស្តែង និងសហការជាក្រុម។',
    attitude: 'សិស្សមានទំនុកចិត្តក្នុងការប្រើប្រាស់ភាសាអង់គ្លេស និងមានស្មារតីទទួលខុសត្រូវខ្ពស់ក្នុងជីវិត។'
  },
  materials: {
    teacher: 'English Flashcards, Life Skill Activity Cards, Audio Player & Projector',
    students: 'English Grade 6 Workbook, Notebook & Practice Sheets'
  },
  steps: [
    {
      stepNo: 'Step 1 / ជំហានទី ១ (10 Mins)',
      stepTitle: 'Warm-up & Ice Breaking Activity',
      teacherActivity: 'Play an engaging English song or dynamic greeting game to activate prior knowledge.',
      content: `Warm-up game and vocabulary recall related to ${title}`,
      studentActivity: 'Students participate enthusiastically in singing and vocabulary chant.'
    },
    {
      stepNo: 'Step 2 / ជំហានទី ២ (25 Mins)',
      stepTitle: 'Presentation & Concept Introduction',
      teacherActivity: 'Introduce new vocabulary, key grammar structures or life skill concepts with clear visual aids.',
      content: `Vocabulary, Sentence Patterns & Life Skills Core Principles of ${title}`,
      studentActivity: 'Students listen, repeat with correct pronunciation, and take notes.'
    },
    {
      stepNo: 'Step 3 / ជំហានទី ៣ (20 Mins)',
      stepTitle: 'Guided Practice & Group Collaboration',
      teacherActivity: 'Facilitate pair work, dialogue role-plays, or life skill scenario problem solving.',
      content: 'Interactive Pair Dialogue and Scenario-based Group Activity',
      studentActivity: 'Students practice conversations in pairs and brainstorm practical solutions.'
    },
    {
      stepNo: 'Step 4 / ជំហានទី ៤ (20 Mins)',
      stepTitle: 'Production & Interactive Speaking Game',
      teacherActivity: 'Invite pairs/groups to present their dialogue or life skills presentation in front of class.',
      content: 'Classroom Presentations, Role-Plays, and Peer Feedback',
      studentActivity: 'Students present confidently and give supportive feedback to peers.'
    },
    {
      stepNo: 'Step 5 / ជំហានទី ៥ (15 Mins)',
      stepTitle: 'Wrap-up, Reflection & Homework',
      teacherActivity: 'Review key takeaways, summarize the moral/skill message, and assign homework.',
      content: `Homework assignment & Daily life application for ${title}`,
      studentActivity: 'Students write down homework and reflect on applying the skill at home.'
    }
  ],
  homework: `Complete the workbook exercises for "${title}" and practice the conversational dialogue with a family member or friend.`,
  teacherName: 'លោកគ្រូ ឌ៊ុក ស៊ុភ័ក្ត',
  schoolName: 'សាលាបឋមសិកា ហ៊ុន សែន អូរឫស្សីកណ្តាល'
}));
