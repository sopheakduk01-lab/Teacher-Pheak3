export interface CommitteeMember {
  id: string;
  role: string;
  name: string;
  gender: string;
  phone?: string;
  duties?: string;
  photoUrl?: string;
  subRole?: string;
}

export interface OfficialCommitteeData {
  schoolName: string;
  gradeName: string;
  teacherName: string;
  principalName: string;
  provinceName: string;
  districtName: string;
  academicYear: string;
  coverPhotoUrl?: string;
  members: CommitteeMember[];
  mandateNumber: string;
  mandateDate: string;
  meetingMinutes: {
    meetingDate: string;
    location: string;
    attendeesCount: number;
    agenda: string;
    decisions: string;
  };
  annualPlan: {
    objectives: string;
    activities: { title: string; month: string; responsible: string }[];
  };
  quarterlyPlan: {
    quarter: string;
    focus: string;
    tasks: string[];
  }[];
  monthlyPlan: {
    month: string;
    goals: string;
    activities: string[];
  }[];
  [key: string]: any;
}

export const DEFAULT_COMMITTEE_DATA: OfficialCommitteeData = {
  schoolName: 'សាលាបឋមសិក្សាគំរូ',
  gradeName: 'ថ្នាក់ទី ៦ ក',
  teacherName: 'គ្រូបន្ទុកថ្នាក់',
  principalName: 'នាយកសាលា',
  provinceName: 'រាជធានីភ្នំពេញ',
  districtName: 'ខណ្ឌដូនពេញ',
  academicYear: '២០២៥-២០២៦',
  coverPhotoUrl: '',
  members: [
    {
      id: '1',
      role: 'ប្រធានគណៈកម្មការ',
      name: 'សិស្ស គំរូទី១',
      gender: 'ប្រុស',
      phone: '012 345 678',
      duties: 'ដឹកនាំរួម សម្របសម្រួល និងរៀបចំកិច្ចប្រជុំ',
    },
    {
      id: '2',
      role: 'អនុប្រធានគណៈកម្មការ',
      name: 'សិស្ស គំរូទី២',
      gender: 'ស្រី',
      phone: '012 345 679',
      duties: 'ជួយការងារប្រធាន និងទទួលបន្ទុកវិន័យ',
    },
    {
      id: '3',
      role: 'សមាជិកទទួលបន្ទុកសិក្សា',
      name: 'សិស្ស គំរូទី៣',
      gender: 'ស្រី',
      phone: '012 345 680',
      duties: 'តាមដានការរៀនសូត្រ និងសៀវភៅតាមដាន',
    },
    {
      id: '4',
      role: 'សមាជិកទទួលបន្ទុកអនាម័យ-បរិស្ថាន',
      name: 'សិស្ស គំរូទី៤',
      gender: 'ប្រុស',
      phone: '012 345 681',
      duties: 'ថែរក្សាអនាម័យក្នុងថ្នាក់ និងតុបតែងថ្នាក់',
    },
  ],
  mandateNumber: '០១/២០២៥',
  mandateDate: 'ថ្ងៃទី ០១ ខែ វិច្ឆិកា ឆ្នាំ ២០២៥',
  meetingMinutes: {
    meetingDate: 'ថ្ងៃទី ០៥ ខែ វិច្ឆិកា ឆ្នាំ ២០២៥',
    location: 'បន្ទប់រៀនថ្នាក់ទី ៦',
    attendeesCount: 38,
    agenda: 'បោះឆ្នោតជ្រើសរើស និងបែងចែកភារកិច្ចគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន',
    decisions: 'បានអនុម័តជាឯកច្ឆន្ទលើសមាសភាព និងផែនការសកម្មភាពប្រចាំឆ្នាំ។',
  },
  annualPlan: {
    objectives: 'ពង្រឹងគុណភាពអប់រំ សីលធម៌ និងអនាម័យបរិស្ថានក្នុងថ្នាក់រៀនឲ្យស្របតាមស្តង់ដាសាលារៀនគំរូ។',
    activities: [
      { title: 'បោះឆ្នោតជ្រើសរើសគណៈកម្មការថ្នាក់', month: 'វិច្ឆិកា', responsible: 'គ្រូបន្ទុកថ្នាក់' },
      { title: 'តុបតែងបន្ទប់រៀន និងរៀបចំសួនបៃតង', month: 'ធ្នូ', responsible: 'គណៈកម្មការថ្នាក់' },
      { title: 'ត្រួតពិនិត្យ និងវាយតម្លៃលទ្ធផលឆមាសទី១', month: 'មីនា', responsible: 'គ្រូ និងគណៈកម្មការ' },
    ],
  },
  quarterlyPlan: [
    { quarter: 'ត្រីមាសទី ១', focus: 'រៀបចំរចនាសម្ព័ន្ធ និងពង្រឹងវិន័យ', tasks: ['ជ្រើសរើសគណៈកម្មការ', 'រៀបចំបទបញ្ជាផ្ទៃក្នុង', 'តុបតែងបន្ទប់រៀន'] },
    { quarter: 'ត្រីមាសទី ២', focus: 'ជំរុញការរៀនសូត្រ និងការប្រឡងឆមាសទី១', tasks: ['ជួយសិស្សរៀនយឺត', 'រៀបចំក្រុមស្វ័យសិក្សា'] },
    { quarter: 'ត្រីមាសទី ៣', focus: 'ការប្រកួតប្រជែងស្នាដៃ និងអនាម័យ', tasks: ['អនាម័យថ្នាក់រៀន', 'រៀបចំទិវាសិស្សឆ្នើម'] },
    { quarter: 'ត្រីមាសទី ៤', focus: 'ត្រៀមប្រឡងបញ្ចប់ឆ្នាំ និងបូកសរុបការងារ', tasks: ['វាយតម្លៃចុងឆ្នាំ', 'ប្រគល់រង្វាន់លើកទឹកចិត្ត'] },
  ],
  monthlyPlan: [
    { month: 'វិច្ឆិកា', goals: 'បង្កើតគណៈកម្មការ និងរៀបចំសណ្តាប់ធ្នាប់', activities: ['ប្រជុំថ្នាក់', 'បែងចែកក្រុមស្វ័យសិក្សា'] },
    { month: 'ធ្នូ', goals: 'តុបតែងបន្ទប់រៀន និងពង្រឹងអនាម័យ', activities: ['រៀបចំផ្ទាំងព័ត៌មាន', 'ថែសួនផ្កា'] },
  ],
};
