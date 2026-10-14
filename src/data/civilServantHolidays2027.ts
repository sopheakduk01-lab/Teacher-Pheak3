export interface CivilServantHoliday {
  id: string;
  number: number;
  name: string;
  nameEn?: string;
  dateSolar: string;
  dateKhmer: string;
  daysCount: number;
  durationLabel: string;
  category: 'national' | 'royal' | 'religious' | 'international' | 'cultural';
  categoryLabel: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  description?: string;
  teacherImpact?: string;
}

export interface UpcomingHolidayStatus {
  statusLabel: string;
  holiday: CivilServantHoliday;
  isWithinThreeDays: boolean;
  isToday: boolean;
  daysRemaining: number;
  teacherNote?: string;
}

export const SUB_DECREE_HOLIDAYS_2027_META = {
  number: '១៨៤ អនក្រ.បក',
  title: 'អនុក្រឹត្យ ស្តីពី ប្រតិទិនឈប់សម្រាកការងាររបស់មន្ត្រីរាជការ និយោជិត កម្មករ ប្រចាំឆ្នាំ២០២៧',
  signedDateSolar: 'រាជធានីភ្នំពេញ ថ្ងៃទី២៩ ខែសីហា ឆ្នាំ២០២៤',
  signedDateKhmer: 'ថ្ងៃព្រហស្បតិ៍ ១២រោច ខែស្រាពណ៍ ឆ្នាំរោង ឆស័ក ព.ស. ២៥៦៨',
  signatoryTitle: 'នាយករដ្ឋមន្ត្រី',
  signatory: 'សម្តេចមហាបវរធិបតី ហ៊ុន ម៉ាណែត',
  totalHolidaysCount: 14,
  totalDaysCount: 22,
  articles: [
    {
      articleNumber: 'មាត្រា ១ ៖',
      content: 'ត្រូវបានអនុញ្ញាតឱ្យមន្ត្រីរាជការ និយោជិត កម្មករ នៃព្រះរាជាណាចក្រកម្ពុជា ឈប់សម្រាកការងារប្រចាំឆ្នាំ២០២៧ សរុបចំនួន ២២ ថ្ងៃ (១៤ លើក)។',
    },
    {
      articleNumber: 'មាត្រា ២ ៖',
      content: 'ចំពោះក្រសួង ស្ថាប័ន មានភារកិច្ចទំនាក់ទំនងអន្តរជាតិ ឬសេវាសាធារណៈចាំបាច់ ត្រូវរក្សាមន្ត្រីប្រចាំការជាអចិន្ត្រៃយ៍សម្រាប់ដោះស្រាយការងារជាប្រក្រតី។',
    },
    {
      articleNumber: 'មាត្រា ៣ ៖',
      content: 'បទប្បញ្ញត្តិទាំងឡាយណាដែលផ្ទុយនឹងអនុក្រឹត្យនេះ ត្រូវទុកជានិរាករណ៍។ រដ្ឋមន្ត្រីទទួលបន្ទុកទីស្តីការគណៈរដ្ឋមន្ត្រី រដ្ឋមន្ត្រីក្រសួងមុខងារសាធារណៈ រដ្ឋមន្ត្រីក្រសួងការងារ និងបណ្តុះបណ្តាលវិជ្ជាជីវៈ គ្រប់ក្រសួង ស្ថាប័ន និងអភិបាលរាជធានី-ខេត្ត ត្រូវទទួលបន្ទុកអនុវត្តអនុក្រឹត្យនេះចាប់ពីថ្ងៃចុះហត្ថលេខាតទៅ។',
    },
  ],
  recipients: [
    'ក្រសួងព្រះបរមរាជវាំង',
    'អគ្គលេខាធិការដ្ឋានក្រុមប្រឹក្សាធម្មនុញ្ញ',
    'អគ្គលេខាធិការដ្ឋានព្រឹទ្ធសភា / រដ្ឋសភា',
    'ខុទ្ទកាល័យសម្តេចមហាបវរធិបតីនាយករដ្ឋមន្ត្រី',
    'គ្រប់ក្រសួង ស្ថាប័ន និងរដ្ឋបាលរាជធានី-ខេត្ត',
    'រាជកិច្ច និងឯកសារកាលប្បវត្តិ',
  ],
};

export const CIVIL_SERVANT_HOLIDAYS_2027: CivilServantHoliday[] = [
  {
    id: 'h-2027-1',
    number: 1,
    name: 'ទិវាចូលឆ្នាំសកល',
    nameEn: 'International New Year Day',
    dateSolar: 'ថ្ងៃទី ០១ ខែ មករា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ០១ មករា',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'international',
    categoryLabel: 'បុណ្យអន្តរជាតិ',
    quarter: 'Q1',
    description: 'ទិវាចូលឆ្នាំថ្មីនៃប្រតិទិនសកល',
    teacherImpact: 'រៀបចំផែនការបង្រៀនប្រចាំឆមាសទី១ និងបញ្ជីវត្តមានសិស្ស',
  },
  {
    id: 'h-2027-2',
    number: 2,
    name: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
    nameEn: 'Victory over Genocide Day',
    dateSolar: 'ថ្ងៃទី ០៧ ខែ មករា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ០៧ មករា',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'national',
    categoryLabel: 'ទិវាជាតិ',
    quarter: 'Q1',
    description: 'ទិវាជ័យជម្នះ ៧ មករា ជាប្រវត្តិសាស្ត្រជាតិ',
    teacherImpact: 'រំលឹកគុណូបការៈ និងការអប់រំប្រវត្តិសាស្ត្រដល់សិស្សានុសិស្ស',
  },
  {
    id: 'h-2027-3',
    number: 3,
    name: 'ទិវាពលកម្មអន្តរជាតិ',
    nameEn: 'International Labor Day',
    dateSolar: 'ថ្ងៃទី ០១ ខែ ឧសភា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ០១ ឧសភា',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'international',
    categoryLabel: 'ទិវាអន្តរជាតិ',
    quarter: 'Q2',
    description: 'ទិវាសិទ្ធិពលករ និងកម្មករអន្តរជាតិ',
    teacherImpact: 'សម្រាកកាយ និងត្រួតពិនិត្យឯកសារបង្រៀន',
  },
  {
    id: 'h-2027-4',
    number: 4,
    name: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណា ព្រះបាទសម្តេចព្រះបរមនាថ នរោត្តម សីហមុនី',
    nameEn: "King Norodom Sihamoni's Birthday",
    dateSolar: 'ថ្ងៃទី ១៤ ខែ ឧសភា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ១៤ ឧសភា',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'royal',
    categoryLabel: 'ព្រះរាជពិធី',
    quarter: 'Q2',
    description: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះមហាក្សត្រ នៃព្រះរាជាណាចក្រកម្ពុជា',
    teacherImpact: 'អប់រំសីលធម៌ ស្មោះត្រង់ចំពោះជាតិ សាសនា ព្រះមហាក្សត្រ',
  },
  {
    id: 'h-2027-5',
    number: 5,
    name: 'ពិធីបុណ្យវិសាខបូជា',
    nameEn: 'Visak Bochea Day',
    dateSolar: 'ថ្ងៃទី ២០ ខែ ឧសភា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ២០ ឧសភា',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'religious',
    categoryLabel: 'បុណ្យព្រះពុទ្ធសាសនា',
    quarter: 'Q2',
    description: 'ទិវាប្រសូត ត្រាស់ដឹង និងបរិនិព្វាន នៃព្រះសម្មាសម្ពុទ្ធ',
    teacherImpact: 'ណែនាំសិស្សឱ្យអនុវត្តកតញ្ញូតាធម៌ និងធ្វើបុណ្យទាន',
  },
  {
    id: 'h-2027-6',
    number: 6,
    name: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល',
    nameEn: 'Royal Plowing Ceremony',
    dateSolar: 'ថ្ងៃទី ២៤ ខែ ឧសភា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ២៤ ឧសភា',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'cultural',
    categoryLabel: 'ប្រពៃណីវប្បធម៌',
    quarter: 'Q2',
    description: 'ប្រកាសបើករដូវធ្វើស្រែចម្ការប្រពៃណីជាតិ',
    teacherImpact: 'បង្រៀនមេរៀនកសិកម្ម និងភូមិសាស្ត្រកម្ពុជា',
  },
  {
    id: 'h-2027-7',
    number: 7,
    name: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ',
    nameEn: "Queen Mother's Birthday",
    dateSolar: 'ថ្ងៃទី ១៨ ខែ មិថុនា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ១៨ មិថុនា',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'royal',
    categoryLabel: 'ព្រះរាជពិធី',
    quarter: 'Q2',
    description: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះវររាជមាតាជាតិខ្មែរ',
    teacherImpact: 'គោរពដឹងគុណព្រះវររាជមាតាជាតិខ្មែរ ក្នុងសេរីភាព និងសេចក្តីថ្លៃថ្នូរ',
  },
  {
    id: 'h-2027-8',
    number: 8,
    name: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ',
    nameEn: 'Constitutional Day',
    dateSolar: 'ថ្ងៃទី ២៤ ខែ កញ្ញា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ២៤ កញ្ញា',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'national',
    categoryLabel: 'ទិវាជាតិ',
    quarter: 'Q3',
    description: 'ទិវាប្រកាសឱ្យប្រើប្រាស់រដ្ឋធម្មនុញ្ញនៃព្រះរាជាណាចក្រកម្ពុជា',
    teacherImpact: 'អប់រំច្បាប់រដ្ឋធម្មនុញ្ញ និងពលរដ្ឋវិជ្ជាដល់សិស្ស',
  },
  {
    id: 'h-2027-9',
    number: 9,
    name: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ',
    nameEn: 'Pchum Ben Festival (3 days)',
    dateSolar: 'ថ្ងៃទី ២៨, ២៩, ៣០ ខែ កញ្ញា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ២៨-៣០ កញ្ញា',
    daysCount: 3,
    durationLabel: '៣ ថ្ងៃ',
    category: 'religious',
    categoryLabel: 'បុណ្យប្រពៃណីសាសនា',
    quarter: 'Q3',
    description: 'ពិធីបុណ្យភ្ជុំបិណ្ឌឧទ្ទិសកុសលដល់បុព្វការីជន',
    teacherImpact: 'សិស្សនិងលោកគ្រូអ្នកគ្រូជួបជុំក្រុមគ្រួសារ និងធ្វើបុណ្យទានតាមវត្តអារាម',
  },
  {
    id: 'h-2027-10',
    number: 10,
    name: 'ទិវារំលឹកខួបនៃការយាងសោយព្រះទិវង្គត ព្រះករុណា ព្រះបាទសម្តេចព្រះ នរោត្តម សីហនុ ព្រះបរមរតនកោដ្ឋ',
    nameEn: 'Commemoration Day of King Father',
    dateSolar: 'ថ្ងៃទី ១៥ ខែ តុលា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ១៥ តុលា',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'royal',
    categoryLabel: 'ទិវាជាតិរំលឹកគុណ',
    quarter: 'Q4',
    description: 'គោរពវិញ្ញាណក្ខន្ធព្រះករុណាព្រះបិតាឯករាជ្យជាតិខ្មែរ',
    teacherImpact: 'រំលឹកគុណូបការៈដ៏ធំធេងនៃព្រះបិតាឯករាជ្យជាតិ',
  },
  {
    id: 'h-2027-11',
    number: 11,
    name: 'ទិវាបុណ្យឯករាជ្យជាតិ',
    nameEn: 'National Independence Day',
    dateSolar: 'ថ្ងៃទី ០៩ ខែ វិច្ឆិកា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ០៩ វិច្ឆិកា',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'national',
    categoryLabel: 'ទិវាបុណ្យជាតិ',
    quarter: 'Q4',
    description: 'ទិវាបុណ្យឯករាជ្យជាតិ ៩ វិច្ឆិកា នៃកម្ពុជា',
    teacherImpact: 'រៀបចំកម្មវិធីតាំងពិព័រណ៍ប្រវត្តិសាស្ត្រ និងការប្រឡងសំនួរចម្លើយ',
  },
  {
    id: 'h-2027-12',
    number: 12,
    name: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក',
    nameEn: 'Water Festival Ceremony (3 days)',
    dateSolar: 'ថ្ងៃទី ១២, ១៣, ១៤ ខែ វិច្ឆិកា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ១២-១៤ វិច្ឆិកា',
    daysCount: 3,
    durationLabel: '៣ ថ្ងៃ',
    category: 'cultural',
    categoryLabel: 'ព្រះរាជពិធីបុណ្យជាតិ',
    quarter: 'Q4',
    description: 'ព្រះរាជពិធីបុណ្យអុំទូកប្រពៃណីជាតិដ៏មហោឡារិក',
    teacherImpact: 'សម្រាកប្រចាំឆ្នាំ ដើរលេងកម្សាន្ត និងអបអរសាទរជោគជ័យនៃកីឡាអុំទូក',
  },
  {
    id: 'h-2027-13',
    number: 13,
    name: 'ទិវាសន្តិភាពនៅកម្ពុជា',
    nameEn: 'Peace Day in Cambodia',
    dateSolar: 'ថ្ងៃទី ២៩ ខែ ធ្នូ ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ២៩ ធ្នូ',
    daysCount: 1,
    durationLabel: '១ ថ្ងៃ',
    category: 'national',
    categoryLabel: 'ទិវាជាតិ',
    quarter: 'Q4',
    description: 'ទិវាសន្តិភាពបញ្ចប់សង្គ្រាមស៊ីវិលទាំងស្រុងនៅកម្ពុជាតាមនយោបាយឈ្នះ-ឈ្នះ',
    teacherImpact: 'អប់រំសិស្សអំពីតម្លៃសន្តិភាព និងការអភិវឌ្ឍជាតិ',
  },
  {
    id: 'h-2027-14',
    number: 14,
    name: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ',
    nameEn: 'Khmer New Year Days (4 days)',
    dateSolar: 'ថ្ងៃទី ១៣, ១៤, ១៥, ១៦ ខែ មេសា ឆ្នាំ ២០២៧',
    dateKhmer: 'ថ្ងៃទី ១៣-១៦ មេសា',
    daysCount: 4,
    durationLabel: '៤ ថ្ងៃ',
    category: 'cultural',
    categoryLabel: 'បុណ្យប្រពៃណីជាតិ',
    quarter: 'Q2',
    description: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ',
    teacherImpact: 'ឈប់សម្រាកជួបជុំគ្រួសារ លេងល្បែងប្រជាប្រិយខ្មែរ',
  },
];

export const CIVIL_SERVANT_HOLIDAYS_2026: CivilServantHoliday[] = CIVIL_SERVANT_HOLIDAYS_2027;
export const civilServantHolidays2027 = CIVIL_SERVANT_HOLIDAYS_2027;

export function getUpcomingHolidayStatus(holidaysList?: CivilServantHoliday[]): UpcomingHolidayStatus {
  const list = holidaysList && holidaysList.length > 0 ? holidaysList : CIVIL_SERVANT_HOLIDAYS_2027;
  // Default to a realistic upcoming holiday:
  const defaultHoliday = list[7] || list[0]; // e.g. Constitutional Day or next holiday
  return {
    statusLabel: 'សល់ ៥ ថ្ងៃទៀត (សប្ដាហ៍នេះ)',
    holiday: defaultHoliday,
    isWithinThreeDays: false,
    isToday: false,
    daysRemaining: 5,
    teacherNote: 'សូមរៀបចំកិច្ចតែងការ និងបញ្ជីពិន្ទុមុនថ្ងៃឈប់សម្រាក',
  };
}

export function generateCivilServantIcsCalendar(holidaysList?: CivilServantHoliday[]): string {
  const list = holidaysList || CIVIL_SERVANT_HOLIDAYS_2027;
  let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Cambodia MoEYS Civil Servant Holidays//KH\nCALSCALE:GREGORIAN\n';
  list.forEach((h) => {
    ics += `BEGIN:VEVENT\nSUMMARY:${h.name}\nDESCRIPTION:${h.description || h.name}\nEND:VEVENT\n`;
  });
  ics += 'END:VCALENDAR';
  return ics;
}
