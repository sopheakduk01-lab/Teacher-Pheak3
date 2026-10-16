export interface CommitteeMember {
  id: string;
  roleTitle: string; // ឧ. ប្រធាន, អនុប្រធានទី១, អនុប្រធានទី២, លេខាធិការ, សមាជិក...
  name: string;
  category: 'parent' | 'teacher' | 'student';
  representation: string; // ឧ. ជាតំណាងមាតាបិតាសិស្សថ្នាក់ទី៦ក, ជាគ្រូប្រចាំថ្នាក់ទី៦ក
  dutySummary: string; // ភារកិច្ចសង្ខេប
  dutyDetails: string[]; // ភារកិច្ចលម្អិត
  votesCount?: number; // ចំនួនសំឡេងឆ្នោត
  phone?: string;
  photoUrl?: string;
}

export interface AnnualPlanActivity {
  id: string;
  title: string;
  months: { [monthKey: string]: boolean };
}

export interface QuarterlyPlanActivity {
  id: string;
  title: string;
  months: { [monthKey: string]: boolean };
}

export interface MonthlyPlanActivity {
  id: string;
  num: string;
  title: string;
  dateStr: string;
  participants: string;
  organizer: string;
  note: string;
}

export interface OfficialCommitteeData {
  academicYear: string;
  schoolName: string;
  gradeName: string;
  provinceName: string;
  districtName: string;
  meetingDateKhmer: string;
  meetingDateSolar: string;
  meetingTime: string;
  meetingLocation: string;
  mandateDateKhmer: string;
  mandateDateSolar: string;
  approvalDateKhmer: string;
  approvalDateSolar: string;
  principalName: string;
  vicePrincipalName: string;
  teacherName?: string;
  recorderName: string;
  coverPhotoUrl?: string;
  introDescription: string;
  mandateReferences: string[];
  mandateDuties: string[];
  meetingAgendas: string[];
  meetingAttendeesSummary: string;
  members: CommitteeMember[];
  annualActivities: AnnualPlanActivity[];
  quarterlyActivities: QuarterlyPlanActivity[];
  monthlyActivities: MonthlyPlanActivity[];
}

export const MONTH_COLUMNS = [
  { key: 'm11', label: 'វិច្ឆិកា', short: 'វិច្ឆិកា' },
  { key: 'm12', label: 'ធ្នូ', short: 'ធ្នូ' },
  { key: 'm01', label: 'មករា', short: 'មករា' },
  { key: 'm02', label: 'កុម្ភៈ', short: 'កុម្ភៈ' },
  { key: 'm03', label: 'មីនា', short: 'មីនា' },
  { key: 'm04', label: 'មេសា', short: 'មេសា' },
  { key: 'm05', label: 'ឧសភា', short: 'ឧសភា' },
  { key: 'm06', label: 'មិថុនា', short: 'មិថុនា' },
  { key: 'm07', label: 'កក្កដា', short: 'កក្កដា' },
  { key: 'm08', label: 'សីហា', short: 'សីហា' },
];

export const DEFAULT_OFFICIAL_COMMITTEE_DATA: OfficialCommitteeData = {
  academicYear: '២០២៤ - ២០២៥',
  schoolName: 'សាលាបឋមសិក្សាអូរឫស្សីកណ្តាល',
  gradeName: 'ថ្នាក់ទី៦ (ក)',
  provinceName: 'ខេត្តស្ទឹងត្រែង',
  districtName: 'ស្រុកសៀមបូក',
  meetingDateKhmer: 'ថ្ងៃសៅរ៍ ១៣រោច ខែមិគសិរ ឆ្នាំរោង ឆស័ក ព.ស. ២៥៦៨',
  meetingDateSolar: 'ថ្ងៃទី២៨ ខែធ្នូ ឆ្នាំ២០២៤',
  meetingTime: 'វេលាម៉ោង ៧:៣០ នាទីព្រឹក',
  meetingLocation: 'សាលាបឋមសិក្សាអូរឫស្សីកណ្តាល',
  mandateDateKhmer: 'ថ្ងៃសៅរ៍ ១៣រោច ខែមិគសិរ ឆ្នាំរោង ឆស័ក ព.ស. ២៥៦៨',
  mandateDateSolar: 'ថ្ងៃទី២៨ ខែធ្នូ ឆ្នាំ២០២៤',
  approvalDateKhmer: 'ថ្ងៃសៅរ៍ ០៥រោច ខែផល្គុន ឆ្នាំខាល ចត្វាស័ក ព.ស. ២៥៦៦',
  approvalDateSolar: 'ថ្ងៃទី១១ ខែមីនា ឆ្នាំ២០២៥',
  principalName: 'ហាស់ សាវ៉ាន',
  vicePrincipalName: 'ស៊ាន ពិសិដ្ឋ',
  teacherName: 'ឌុក សុភ័ក្ត្រ',
  recorderName: 'ឌុក សុភ័ក្ត្រ',
  coverPhotoUrl: '',
  introDescription:
    'គណៈកម្មការគ្រប់គ្រង ថ្នាក់ទី ៦ (ក) នៃសាលាបឋមសិក្សាអូរឫស្សីកណ្តាល មានសមាសភាពចំនួន ១១ នាក់ ក្នុងនោះមានតំណាងមាតាបិតាចំនួន ០៨ នាក់ និងគ្រូបន្ទុកថ្នាក់ ១ នាក់។ គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន គឺជាតំណាងឱ្យមាតាបិតា និងអ្នកអាណាព្យាបាលសិស្សក្នុងថ្នាក់ទាំងអស់ ក្នុងការដឹកនាំ និងគ្រប់គ្រងសកម្មភាពរៀនរបស់សិស្ស ការបង្រៀនរបស់គ្រូ និងការកែលម្អបរិស្ថានថ្នាក់រៀន។',
  mandateReferences: [
    'សេចក្តីណែនាំលេខ ៥៤ អយក.សណន ចុះថ្ងៃទី១៧ ខែតុលា ឆ្នាំ២០២៤ របស់ក្រសួងអប់រំ យុវជន និងកីឡា។',
    'ស្មារតីអង្គប្រជុំចុះថ្ងៃទី២៨ ខែធ្នូ ឆ្នាំ២០២៤ ស្តីពីការបោះឆ្នោតជ្រើសរើសគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ. គ. ថ.)។',
  ],
  mandateDuties: [
    'កំណត់តម្រូវការ និងបញ្ហាប្រឈមទាក់ទងនឹងការរៀននិងបង្រៀនក្នុងថ្នាក់',
    'កសាងផែនការអភិវឌ្ឍថ្នាក់រៀន ផែនការបង្រៀន និងផែនការសិស្សរៀន',
    'កៀរគរធនធានសម្ភារៈនិងថវិកា ពីមាតាបិតាអ្នកអាណាព្យាបាល សប្បុរសជនដើម្បីអភិវឌ្ឍថ្នាក់រៀន និងបង្រៀន',
    'ផ្តើមគំនិតក្នុងការកែលម្អថ្នាក់រៀន និងជួយផលិតសម្ភារៈរៀននិងបង្រៀន',
    'ចូលរួមរៀបចំនិងសង្កេតមើលដំណើរការតេស្តសិស្ស ប្រចាំខែ ឆមាស ឆ្នាំ',
    'សហការជាមួយគ្រូបន្ទុកថ្នាក់ជួយអប់រំមាតាបិតាជួយជំរុញកូនឱ្យមកសាលារៀននិងបង្រៀនបន្ថែម',
    'ដោះស្រាយបញ្ហាទាក់ទងនឹងការរៀននិងបង្រៀន ជាពិសេសកុមារជួបការលំបាក',
    'តាមដាននិងផ្តល់ព័ត៌មានត្រឡប់ចំពោះការរៀននិងបង្រៀន ការធ្វើតេស្តសិស្សនិងលទ្ធផលនៃការសិក្សា',
    'បែងចែកវេនប្រចាំការនៅថ្នាក់រៀនដើម្បីពិនិត្យមើលអំពីដំណើរការរៀនរបស់កូនៗ',
  ],
  meetingAgendas: [
    'ចុះវត្តមានសមាសភាពចូលរួម',
    'មតិសំណេះសំណាលជាមួយលោកគ្រូអ្នកគ្រូ និងមាតាបិតា អ្នកអាណាព្យាបាលសិស្ស',
    'ការបង្ហាញពីគោលបំណងនៃការបង្កើតគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន',
    'ការបង្ហាញពីសមាសភាពដែលអាចឈរឈ្មោះបោះឆ្នោត គ. គ. ថ. និងរចនាសម្ព័ន្ធ តួនាទី គ. គ. ថ.',
    'ការបោះឆ្នោតជ្រើសរើស គ. គ. ថ. ដោយសម្ងាត់ និងស្ម័គ្រចិត្ត',
    'ផែនការបន្ត និងការប្តេជ្ញាចិត្តរួមគ្នា',
  ],
  meetingAttendeesSummary:
    '១. លោក ហាស់ សាវ៉ាន នាយកសាលា | ២. លោក ស៊ាន ពិសិដ្ឋ នាយករងសាលា | ៣. លោកគ្រូអ្នកគ្រូ | ៤. សិស្សានុសិស្សថ្នាក់ទី៦(ក) | ៥. អាណាព្យាបាលសិស្សទាំងអស់',
  members: [
    {
      id: 'mem_1',
      roleTitle: 'ប្រធាន',
      name: 'អិន សុះហ្វាហ៊ីម៌ះ',
      category: 'parent',
      representation: 'ជាតំណាងមាតាបិតាសិស្សថ្នាក់ទី៦ក',
      dutySummary: 'ទទួលខុសត្រូវរួម កិច្ចការប្រតិបត្តិការក្នុងដំណើរការគ្រប់គ្រងថ្នាក់រៀន',
      votesCount: 14,
      dutyDetails: [
        'គ្រប់គ្រង ដឹកនាំ ចាត់ចែង ត្រួតពិនិត្យ ការងាររបស់គណៈកម្មការថ្នាក់រៀន',
        'ទទួលខុសត្រូវក្នុងការទំនាក់ទំនងជាមួយគ្រូបន្ទុកថ្នាក់ និងសមាជិក',
        'ផ្តួចផ្តើមស្វែងរកថវិកា និងធនធាន',
      ],
    },
    {
      id: 'mem_2',
      roleTitle: 'អនុប្រធានទី១',
      name: 'សុះ វ៉ែវរីយ៉ាស់',
      category: 'parent',
      representation: 'ជាតំណាងមាតាបិតាសិស្សថ្នាក់ទី៦ក',
      dutySummary: 'ទទួលខុសត្រូវផែនការ និងថវិការបស់ថ្នាក់រៀន',
      votesCount: 7,
      dutyDetails: [
        'ជាជំនួយការប្រធាន',
        'ពិគ្រោះយោបល់ជាមួយប្រធានគណៈកម្មការថ្នាក់រៀន',
        'ទទួលការងារហិរញ្ញវត្ថុ និងការកែលម្អថ្នាក់រៀន',
        'ផ្តល់ព័ត៌មានរហ័ស ដែលកើតឡើងចំពោះសិស្សដូចជា អវត្តមាន',
      ],
    },
    {
      id: 'mem_3',
      roleTitle: 'អនុប្រធានទី២',
      name: 'តាំ អាស៊ីម',
      category: 'parent',
      representation: 'ជាតំណាងមាតាបិតាសិស្សថ្នាក់ទី៦ក',
      dutySummary: 'ទទួលខុសត្រូវហេដ្ឋារចនាសម្ព័ន្ធ និងបរិស្ថានសិក្សាក្នុងថ្នាក់រៀន',
      votesCount: 4,
      dutyDetails: [
        'ទទួលតួនាទីភារកិច្ចពីប្រធាន',
        'ចូលរួមរៀបចំផែនការ និងរៀបចំការប្រជុំប្រចាំខែ (ទីតាំង កម្មវិធី)',
        'ផ្តល់ព័ត៌មានរហ័ស ដែលកើតឡើងចំពោះសិស្សដូចជា បញ្ហាសុខភាព អនាម័យថ្នាក់រៀន លទ្ធផលសិក្សារបស់សិស្ស',
      ],
    },
    {
      id: 'mem_4',
      roleTitle: 'លេខាធិការ / គ្រូបន្ទុកថ្នាក់',
      name: 'ឌុក សុភ័ក្ត្រ',
      category: 'teacher',
      representation: 'ជាគ្រូប្រចាំថ្នាក់ទី៦ក',
      dutySummary: 'ជាទីប្រឹក្សា និងសម្របសម្រួលកិច្ចប្រជុំ',
      dutyDetails: [
        'រៀបចំកំណត់ហេតុប្រជុំ',
        'របាយការណ៍បូកសរុបសកម្មភាពប្រចាំខែ',
        'លិខិតស្នាមនានារបស់គណៈកម្មការថ្នាក់រៀន',
        'ទំនាក់ទំនងជាមួយប្រធានជាប្រចាំ',
      ],
    },
    {
      id: 'mem_5',
      roleTitle: 'សមាជិក (សេដ្ឋកិច្ច)',
      name: 'ឡោម លាវ',
      category: 'parent',
      representation: 'ជាតំណាងមាតាបិតាសិស្សថ្នាក់ទី៦ក',
      dutySummary: 'ទទួលខុសត្រូវការងារសេដ្ឋកិច្ចក្នុងថ្នាក់',
      votesCount: 2,
      dutyDetails: [
        'ជំរុញកូនឱ្យមករៀន',
        'ចូលរួមគ្រប់សកម្មភាពរបស់ថ្នាក់រៀន',
        'ទំនាក់ទំនងជាមួយគ្រូ+សិស្ស',
        'ផ្តល់ព័ត៌មានរហ័ស ដែលកើតឡើងចំពោះសិស្សដូចជា មករៀនយឺត គេចសាលា',
        'ចូលរួមធ្វើផែនការ និងប្រជុំថ្នាក់រៀន',
      ],
    },
    {
      id: 'mem_6',
      roleTitle: 'សមាជិក (កៀរគរជំនួយ)',
      name: 'លី កៅ',
      category: 'parent',
      representation: 'ជាតំណាងមាតាបិតាសិស្សថ្នាក់ទី៦ក',
      dutySummary: 'ទទួលខុសត្រូវកិច្ចសហការនិងកៀរគរជំនួយរបស់មាតា និងសហគមន៍',
      votesCount: 2,
      dutyDetails: [
        'ជំរុញកូនឱ្យមករៀន',
        'ចូលរួមគ្រប់សកម្មភាពរបស់ថ្នាក់រៀន',
        'ទំនាក់ទំនងជាមួយគ្រូ+សិស្ស',
        'ផ្តល់ព័ត៌មានរហ័ស ដែលកើតឡើងចំពោះសិស្សដូចជា មករៀនយឺត',
        'ចូលរួមធ្វើផែនការ និងប្រជុំថ្នាក់រៀន',
      ],
    },
    {
      id: 'mem_7',
      roleTitle: 'សមាជិក (គណនេយ្យភាព)',
      name: 'សៀក រស្មី',
      category: 'parent',
      representation: 'ជាតំណាងមាតាបិតាសិស្សថ្នាក់ទី៦ក',
      dutySummary: 'ទទួលខុសត្រូវគណនេយ្យភាពនិងការផ្សព្វផ្សាយទិន្នន័យរបស់ថ្នាក់រៀន',
      votesCount: 2,
      dutyDetails: [
        'ជំរុញកូនឱ្យមករៀន',
        'ចូលរួមគ្រប់សកម្មភាពរបស់ថ្នាក់រៀន',
        'ទំនាក់ទំនងជាមួយគ្រូ+សិស្ស',
        'ផ្តល់ព័ត៌មានរហ័ស ដែលកើតឡើងចំពោះសិស្សដូចជា គេចសាលា',
        'ចូលរួមធ្វើផែនការ និងប្រជុំថ្នាក់រៀន',
      ],
    },
    {
      id: 'mem_8',
      roleTitle: 'សមាជិក (ប្រធានថ្នាក់)',
      name: 'ម៉េង ម៉ូលីកា',
      category: 'student',
      representation: 'ជាប្រធានថ្នាក់ទី៦ក (តំណាងក្រុមប្រឹក្សាកុមារ)',
      dutySummary: 'ទទួលខុសត្រូវសកម្មភាពរបស់ក្រុមប្រឹក្សាកុមារក្នុងថ្នាក់រៀន',
      votesCount: 1,
      dutyDetails: [
        'ជំរុញកូនឱ្យមករៀន',
        'ផ្តល់អវត្តមានសិស្សជាប្រចាំថ្ងៃ ប្រចាំខែ និងប្រចាំឆ្នាំ',
        'ទំនាក់ទំនងជាមួយគ្រូ+សិស្ស',
        'ផ្តល់ព័ត៌មានរហ័ស ដែលកើតឡើងចំពោះសិស្សដូចជា បញ្ហាសុខភាព',
        'ចូលរួមធ្វើផែនការ និងប្រជុំថ្នាក់រៀន',
      ],
    },
  ],
  annualActivities: [
    { id: 'a1', title: '១. ចូលរួមក្នុងសកម្មភាពតេស្តដើមឆ្នាំ', months: { m11: true, m12: false, m01: false, m02: false, m03: false, m04: false, m05: false, m06: false, m07: false, m08: false } },
    { id: 'a2', title: '២. ចូលរួមដឹងឮ និងគាំទ្រផែនការសិក្សាឆ្នាំរបស់សិស្ស', months: { m11: true, m12: false, m01: false, m02: false, m03: false, m04: false, m05: false, m06: false, m07: false, m08: false } },
    { id: 'a3', title: '៣. ចូលរួមដឹងឮ និងគាំទ្រផែនការបង្រៀន១ឆ្នាំរបស់គ្រូ', months: { m11: true, m12: false, m01: false, m02: false, m03: false, m04: false, m05: false, m06: false, m07: false, m08: false } },
    { id: 'a4', title: '៤. ចូលរួមដឹងឮ និងគាំទ្រផែនការបង្រៀន១ខែរបស់គ្រូ', months: { m11: true, m12: true, m01: true, m02: true, m03: true, m04: true, m05: true, m06: true, m07: true, m08: true } },
    { id: 'a5', title: '៥. ចូលរួមសកម្មភាពកែលម្អថ្នាក់រៀន', months: { m11: true, m12: false, m01: true, m02: false, m03: true, m04: false, m05: false, m06: false, m07: false, m08: false } },
    { id: 'a6', title: '៦. ប្រជុំពិនិត្យតាមដានលទ្ធផលសិក្សាសិស្សប្រចាំខែ', months: { m11: true, m12: true, m01: true, m02: true, m03: true, m04: true, m05: true, m06: true, m07: true, m08: true } },
    { id: 'a7', title: '៧. មាតាបិតាមកសង្កេតកូនរៀនក្នុងថ្នាក់បាន២ដង១ឆ្នាំ', months: { m11: false, m12: false, m01: true, m02: false, m03: false, m04: false, m05: true, m06: false, m07: false, m08: false } },
    { id: 'a8', title: '៨. ចុះជួបមាតាបិតាសិស្សរៀនយឺត', months: { m11: false, m12: true, m01: true, m02: true, m03: true, m04: true, m05: true, m06: true, m07: true, m08: false } },
    { id: 'a9', title: '៩. កៀរគរ ថវិកា សម្ភារ គាំទ្រដល់ការបង្រៀន និងរៀន', months: { m11: true, m12: false, m01: false, m02: true, m03: false, m04: false, m05: true, m06: false, m07: false, m08: false } },
  ],
  quarterlyActivities: [
    { id: 'q1', title: '១. ចូលរួមរៀបចំ និងត្រួតពិនិត្យផែនការសកម្មភាពគណៈកម្មការថ្នាក់រៀនប្រចាំត្រីមាស', months: { m12: true, m03: true, m06: true } },
    { id: 'q2', title: '២. បូកសរុបសកម្មភាពការងារ និងដោះស្រាយបញ្ហាប្រឈមរបស់ថ្នាក់រៀន', months: { m12: true, m03: true, m06: true } },
    { id: 'q3', title: '៣. របាយការណ៍ប្រចាំត្រីមាស', months: { m12: true, m03: true, m06: true } },
  ],
  monthlyActivities: [
    { id: 'm1', num: '១', title: 'សង្កេតការរៀន-បង្រៀន (១-១ សង្កេតការរៀនរបស់កូនៗ, ១-២ សង្កេតការបង្រៀនរបស់គ្រូ)', dateStr: 'រៀងរាល់សប្តាហ៍ទី២', participants: 'តំណាង គ. គ. ថ.', organizer: 'គ្រូបន្ទុកថ្នាក់', note: 'កត់ត្រាក្នុងសៀវភៅតាមដាន' },
    { id: 'm2', num: '២', title: 'ប្រជុំប្រចាំខែ (២-១ អំពីលទ្ធផលសិក្សារបស់កូនៗ, ២-២ អនាម័យ និងបរិស្ថានថ្នាក់រៀន)', dateStr: 'ចុងខែនីមួយៗ', participants: 'សមាជិក គ. គ. ថ. ទាំងអស់', organizer: 'ប្រធាន គ. គ. ថ.', note: 'មានកំណត់ហេតុប្រជុំ' },
  ],
};

export const DEFAULT_COMMITTEE_DATA: OfficialCommitteeData = DEFAULT_OFFICIAL_COMMITTEE_DATA;
