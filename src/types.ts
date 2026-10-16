export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  coverUrl: string;
  fileData?: string; // base64 or URL or text content
  fileType?: 'pdf' | 'image' | 'text' | 'epub';
  description: string;
  pagesCount?: number;
  uploadedDate: string;
}

export interface TeacherProfile {
  name: string;
  school: string;
  grade: string;
  phone: string;
  email: string;
  degree: string;
  avatar: string;
  academicYear: string;
  adminPin?: string; // Secret Teacher Master PIN to protect teacher admin area
}

export interface Student {
  id: number;
  rollNo: number;
  name: string;
  latinName?: string;
  civilId?: string;
  gender: 'ប្រុស' | 'ស្រី';
  dob: string;
  pob?: string;
  fatherName?: string;
  fatherJob?: string;
  motherName?: string;
  motherJob?: string;
  address?: string;
  familyStatus?: string;
  note?: string;
  isRepeating?: boolean; // សិស្សត្រួតថ្នាក់ (Repeating student for MoEYS PRI)
  disabilityType?: string; // ប្រភេទពិការភាព/ការលំបាក (MoEYS PRI Table 3)
  indigenousEthnicity?: string; // ជនជាតិដើមភាគតិច (MoEYS PRI Table 4)
  parentPhone: string;
  plpAccount?: string;
  avatar?: string;
  pin?: string; // Secret PIN code (default '1234' or set by classroom teacher)
}

export type AttendanceStatus = 'present' | 'permission' | 'absent';

export interface BookBorrowingRecord {
  id: string;
  studentId: number;
  studentName: string;
  bookId: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowing' | 'returned' | 'late' | 'lost';
  note?: string;
}

export interface AttendanceRecord {
  [studentId: number]: AttendanceStatus;
}

export interface AttendanceDatabase {
  [dateStr: string]: AttendanceRecord;
}

export type GradeSubject = 'khmer' | 'math' | 'science' | 'social';

export interface StudentGrade {
  khmer: number;
  math: number;
  science: number;
  social: number;
  subScores?: Record<string, number>;
}

export type GradeDatabase = {
  [key: string]: any;
};

export interface LogbookEntry {
  id: number;
  date: string;
  time: string;
  subject: string;
  topic: string;
  presentCount: string;
  note: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  qty: number;
  condition: 'ល្អ' | 'មធ្យម' | 'ខូច/ត្រូវជួសជុល';
  category: string;
}

export interface PLCMeeting {
  id: number;
  date: string;
  topic: string;
  attendees: string;
  issues: string;
  decision: string;
  province?: string;
  district?: string;
  school?: string;
  gradeLevel?: string;
  meetingNo?: string;
  month?: string;
  academicYear?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  chairperson?: string;
  chairpersonRole?: string;
  secretary?: string;
  secretaryRole?: string;
  presentCount?: number;
  absentCount?: number;
  excusedCount?: number;
  unexcusedCount?: number;
  agendas?: string[];
  agenda1Details?: {
    reporter?: string;
    achievements?: string;
    remainingIssues?: string;
  };
  agenda2Details?: {
    subject?: string;
    studentProblem?: string;
    rootCause?: string;
  };
  agenda3Details?: {
    teachingMethod?: string;
    materials?: string;
    lessonPlanAdjustment?: string;
  };
  agenda4Details?: {
    demoTeacher?: string;
    demoGrade?: string;
    demoSubject?: string;
    demoChapter?: string;
    demoDate?: string;
    observers?: string;
  };
  agenda5Details?: string;
  actionPlan?: string;
}

export type QuestionType =
  | 'qcm'                   // សំណួរពហុជ្រើសរើស (Multiple Choice / QCM)
  | 'true_false'            // ខុស ត្រូវ (True / False)
  | 'matching'              // ផ្គូរផ្គង (Matching Pairs)
  | 'fill_blank'            // បំពេញចន្លោះ (Fill in the blanks)
  | 'reorder_words'         // រៀបពាក្យឲ្យល្បះត្រឹមត្រូវ (Word ordering / Sentence unscramble)
  | 'short_answer'          // សំណួរចម្លើយខ្លី (Short answer)
  | 'pisa'                  // សំណួរបែប PISA (ស្ថានភាពជាក់ស្តែង និងការត្រិះរិះពិចារណា / PISA Competency)
  | 'reading_comprehension' // អត្ថបទអំណាន និងសំណួរវិភាគ (Reading Passage & Comprehension)
  | 'essay'                 // សំណួរសំណេរពិចារណា / តែងសេចក្តី (Essay / Structured Analysis)
  | 'multi_select';         // ជ្រើសរើសចម្លើយត្រូវច្រើន (Multiple Select Checkboxes)

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  color: 'red' | 'blue' | 'yellow' | 'green';
  shape: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface PisaQuestionPart {
  id: string;
  prompt: string;
  points?: number;
  sampleAnswer?: string;
}

export interface PassageQuestionItem {
  id: string;
  question: string;
  answer?: string;
}

export interface QuizQuestion {
  id: number;
  type?: QuestionType; // default 'qcm'
  question: string;
  options: QuizOption[];
  timeLimit: number; // seconds
  points: number;
  // Matching type:
  matchingPairs?: MatchingPair[];
  // Fill in blank type:
  blankAnswer?: string; // Correct word for the blank
  blankDistractors?: string[]; // Optional extra word bank choices
  // Reorder words type:
  words?: string[]; // Array of words or scrambled words
  correctSentence?: string; // The correct full sentence
  // Short answer:
  correctAnswer?: string; // Correct answer or acceptable keywords
  // True/False:
  isTrue?: boolean; // true = ត្រូវ, false = ខុស
  // PISA style question:
  pisaDomain?: 'math' | 'science' | 'reading' | 'financial' | 'creative';
  pisaContext?: string; // បរិបទស្ថានភាពជាក់ស្តែង (Real-world scenario / data table / story)
  pisaQuestionParts?: PisaQuestionPart[];
  pisaParts?: PisaQuestionPart[];
  pisaReasoning?: string;
  // Reading comprehension:
  passageTitle?: string;
  passageText?: string;
  passageQuestions?: PassageQuestionItem[];
  // Essay / Analytical:
  essayRubric?: string;
  minWords?: number;
  explanation?: string; // Optional explanation for the solution
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  questionCount: number;
  isPublic: boolean;
  imageUrl: string;
  questions: QuizQuestion[];
  examDuration?: string;
  createdAt?: string;
  updatedAt?: string;
  sheetType?: 'worksheet' | 'exam' | 'homework' | 'test' | 'exit_ticket';
  worksheetOptions?: any;
}

export interface StudentMonitoringEntry {
  id: string;
  studentId: number;
  studentName: string;
  gender: 'ប្រុស' | 'ស្រី';
  date: string;
  category: 'reading_writing' | 'math' | 'homework' | 'attendance' | 'behavior' | 'health' | 'talented' | 'other';
  severity: 'low' | 'medium' | 'high' | 'positive';
  observedIssue: string;
  teacherIntervention: string;
  progressNote: string;
  parentFeedback?: string;
  status: 'in_progress' | 'improving' | 'resolved' | 'needs_parent_meeting';
  createdAt: string;
  updatedAt: string;
}

export interface SubjectScoreItem {
  id: string;
  name: string;
  maxScore: number;
  score: number;
  rank?: number | string;
  grade?: string;
}

export interface StudentMonthlyResultRecord {
  id: string;
  studentId: number;
  studentName: string;
  gender: 'ប្រុស' | 'ស្រី';
  month: string;
  academicYear: string;
  grade: string;
  schoolName: string;
  districtOffice: string;
  scores: SubjectScoreItem[];
  totalScore: number;
  averageScore: number;
  classRank: number;
  totalStudents: number;
  excusedAbsences: number;
  unexcusedAbsences: number;
  lunarDate?: string;
  solarDate?: string;
  teacherReflection: string;
  parentFeedback?: string;
  teacherName: string;
}

export interface PracticumTrainee {
  id: string;
  code: string;
  nameKhmer: string;
  nameLatin?: string;
  gender: 'ប្រុស' | 'ស្រី';
  dob: string;
  phone: string;
  trainingInstitution: string;
  generation: string;
  specialty: string;
  assignedGrade: string;
  startDate: string;
  endDate: string;
  mentorTeacher: string;
  avatar?: string;
  overallRating?: 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'active' | 'completed' | 'withdrawn';
  note?: string;
}

export interface TraineeEvaluation {
  id: string;
  traineeId: string;
  traineeName: string;
  date: string;
  subject: string;
  lessonTitle: string;
  gradeLevel: string;
  duration: string;
  scoreLessonPlan: number;
  scoreMethodology: number;
  scoreTeachingAids: number;
  scoreClassroomManagement: number;
  totalScore: number;
  gradeClassification: 'A' | 'B' | 'C' | 'D' | 'F';
  strengths: string;
  areasForImprovement: string;
  mentorRecommendation: string;
  traineeReflection?: string;
  observerName: string;
}

export interface ActiveSession {
  pin: string;
  quizTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  studentCount: number;
  status: 'lobby' | 'in_progress' | 'podium';
  joinedStudents: string[];
}

