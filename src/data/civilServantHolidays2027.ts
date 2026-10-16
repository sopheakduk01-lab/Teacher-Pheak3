export interface CivilServantHoliday {
  id: string;
  order: number;
  dateKhmer: string;
  dateIsoStart?: string;
  dateIsoEnd?: string;
  name: string;
  daysCount: number;
  durationLabel: string;
  month: number;
  monthName: string;
  category: 'national' | 'royal' | 'traditional' | 'international';
  categoryLabel: string;
  icon: string;
  highlight?: boolean;
}

export interface SubDecreeMeta {
  number: string;
  signedDateKhmer: string;
  signedDateSolar: string;
  signedPlace: string;
  signatory: string;
  signatoryTitle: string;
  title: string;
  totalHolidaysCount: number;
  totalDaysCount: number;
  articles: {
    articleNumber: string;
    content: string;
  }[];
  recipients: string[];
}

export const SUB_DECREE_HOLIDAYS_2027_META: SubDecreeMeta = {
  number: '១៩៨ អនក្រ.បក',
  title: 'អនុក្រឹត្យ ស្តីពី ប្រតិទិនឈប់សម្រាកការងាររបស់មន្ត្រីរាជការ និយោជិត កម្មករ ប្រចាំឆ្នាំ២០២៧',
  signedDateKhmer: 'ថ្ងៃពុធ ៥ កើត ខែភទ្របទ ឆ្នាំរោង ឆស័ក ព.ស.២៥៧០',
  signedDateSolar: 'រាជធានីភ្នំពេញ, ថ្ងៃទី១៦ ខែកញ្ញា ឆ្នាំ២០២៦',
  signedPlace: 'រាជធានីភ្នំពេញ',
  signatory: 'សម្តេចមហាបវរធិបតី ហ៊ុន ម៉ាណែត',
  signatoryTitle: 'នាយករដ្ឋមន្ត្រី នៃព្រះរាជាណាចក្រកម្ពុជា',
  totalHolidaysCount: 16,
  totalDaysCount: 22,
  articles: [
    {
      articleNumber: 'មាត្រា ១',
      content: 'ត្រូវបានអនុញ្ញាតឱ្យមន្ត្រីរាជការ និយោជិត កម្មករ នៃព្រះរាជាណាចក្រកម្ពុជា បានឈប់សម្រាកការងារឆ្នាំ២០២៧ តាមប្រតិទិនកំណត់។',
    },
    {
      articleNumber: 'មាត្រា ២',
      content: 'ចំពោះក្រសួង ស្ថាប័ន មានភារកិច្ចទំនាក់ទំនងអន្តរជាតិ ត្រូវរក្សាមន្ត្រីប្រចាំការជាអចិន្ត្រៃយ៍ សម្រាប់ដោះស្រាយការងារ។',
    },
    {
      articleNumber: 'មាត្រា ៣',
      content: 'បទប្បញ្ញត្តិទាំងឡាយណាដែលផ្ទុយនឹងអនុក្រឹត្យនេះ ត្រូវទុកជានិរាករណ៍។',
    },
    {
      articleNumber: 'មាត្រា ៤',
      content: 'រដ្ឋមន្ត្រីទទួលបន្ទុកទីស្តីការគណៈរដ្ឋមន្ត្រី រដ្ឋមន្ត្រីក្រសួងសេដ្ឋកិច្ចនិងហិរញ្ញវត្ថុ ប្រធានគណៈកម្មាធិការជាតិរៀបចំបុណ្យជាតិ-អន្តរជាតិ រដ្ឋមន្ត្រីគ្រប់ក្រសួង និងប្រធានគ្រប់ស្ថាប័នដែលពាក់ព័ន្ធ និងអភិបាលនៃគណៈអភិបាលរាជធានី ខេត្ត ត្រូវទទួលបន្ទុកអនុវត្តអនុក្រឹត្យនេះ តាមភារកិច្ចរៀងៗខ្លួនចាប់ពីថ្ងៃចុះហត្ថលេខាតទៅ។',
    },
  ],
  recipients: [
    'ក្រសួងព្រះបរមរាជវាំង',
    'អគ្គលេខាធិការដ្ឋានក្រុមប្រឹក្សាធម្មនុញ្ញ',
    'អគ្គលេខាធិការដ្ឋានព្រឹទ្ធសភា',
    'អគ្គលេខាធិការដ្ឋានរដ្ឋសភា',
    'ខុទ្ទកាល័យសម្តេចមហាបវរធិបតីនាយករដ្ឋមន្ត្រី',
    'ខុទ្ទកាល័យឯកឧត្តម/លោកជំទាវឧបនាយករដ្ឋមន្ត្រី',
    'ដូចមាត្រា៤',
    'រាជកិច្ច',
    'ឯកសារ កាលប្បវត្តិ',
  ],
};

export const CIVIL_SERVANT_HOLIDAYS_2027: CivilServantHoliday[] = [
  {
    id: 'h-1',
    order: 1,
    dateKhmer: 'ថ្ងៃទី ០១ ខែមករា',
    dateIsoStart: '2027-01-01',
    name: 'ទិវាចូលឆ្នាំសកល',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 1,
    monthName: 'មករា',
    category: 'international',
    categoryLabel: 'បុណ្យអន្តរជាតិ',
    icon: '🎉',
  },
  {
    id: 'h-2',
    order: 2,
    dateKhmer: 'ថ្ងៃទី ០៧ ខែមករា',
    dateIsoStart: '2027-01-07',
    name: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 1,
    monthName: 'មករា',
    category: 'national',
    categoryLabel: 'បុណ្យជាតិ',
    icon: '🕊️',
  },
  {
    id: 'h-3',
    order: 3,
    dateKhmer: 'ថ្ងៃទី ០៨ ខែមីនា',
    dateIsoStart: '2027-03-08',
    name: 'ទិវាអន្តរជាតិនារី',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 3,
    monthName: 'មីនា',
    category: 'international',
    categoryLabel: 'បុណ្យអន្តរជាតិ',
    icon: '👩',
  },
  {
    id: 'h-4',
    order: 4,
    dateKhmer: 'ថ្ងៃទី ១៤-១៥-១៦ ខែមេសា',
    dateIsoStart: '2027-04-14',
    dateIsoEnd: '2027-04-16',
    name: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ ឆ្នាំមមែ នព្វស័ក',
    daysCount: 3,
    durationLabel: 'សម្រាក ៣ ថ្ងៃ',
    month: 4,
    monthName: 'មេសា',
    category: 'traditional',
    categoryLabel: 'បុណ្យប្រពៃណីជាតិ',
    icon: '🇰🇭',
    highlight: true,
  },
  {
    id: 'h-5',
    order: 5,
    dateKhmer: 'ថ្ងៃទី ០១ ខែឧសភា',
    dateIsoStart: '2027-05-01',
    name: 'ទិវាពលកម្មអន្តរជាតិ',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 5,
    monthName: 'ឧសភា',
    category: 'international',
    categoryLabel: 'បុណ្យអន្តរជាតិ',
    icon: '⚒️',
  },
  {
    id: 'h-6',
    order: 6,
    dateKhmer: 'ថ្ងៃទី ១៤ ខែឧសភា',
    dateIsoStart: '2027-05-14',
    name: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណាព្រះបាទសម្តេចព្រះបរមនាថ នរោត្តម សីហមុនី ព្រះមហាក្សត្រ នៃព្រះរាជាណាចក្រកម្ពុជា',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 5,
    monthName: 'ឧសភា',
    category: 'royal',
    categoryLabel: 'ព្រះរាជពិធី',
    icon: '👑',
  },
  {
    id: 'h-7',
    order: 7,
    dateKhmer: 'ថ្ងៃទី ២០ ខែឧសភា',
    dateIsoStart: '2027-05-20',
    name: 'ពិធីបុណ្យវិសាខបូជា',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 5,
    monthName: 'ឧសភា',
    category: 'traditional',
    categoryLabel: 'បុណ្យសាសនា-ប្រពៃណី',
    icon: '🪷',
  },
  {
    id: 'h-8',
    order: 8,
    dateKhmer: 'ថ្ងៃទី ២៤ ខែឧសភា',
    dateIsoStart: '2027-05-24',
    name: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 5,
    monthName: 'ឧសភា',
    category: 'royal',
    categoryLabel: 'ព្រះរាជពិធីប្រពៃណី',
    icon: '🐂',
  },
  {
    id: 'h-9',
    order: 9,
    dateKhmer: 'ថ្ងៃទី ១៨ ខែមិថុនា',
    dateIsoStart: '2027-06-18',
    name: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ ព្រះវររាជមាតាជាតិខ្មែរ',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 6,
    monthName: 'មិថុនា',
    category: 'royal',
    categoryLabel: 'ព្រះរាជពិធី',
    icon: '👑',
  },
  {
    id: 'h-10',
    order: 10,
    dateKhmer: 'ថ្ងៃទី ២៤ ខែកញ្ញា',
    dateIsoStart: '2027-09-24',
    name: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 9,
    monthName: 'កញ្ញា',
    category: 'national',
    categoryLabel: 'បុណ្យជាតិ',
    icon: '📜',
  },
  {
    id: 'h-11',
    order: 11,
    dateKhmer: 'ថ្ងៃទី ២៩-៣០ កញ្ញា និង ថ្ងៃទី ០១ តុលា',
    dateIsoStart: '2027-09-29',
    dateIsoEnd: '2027-10-01',
    name: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ',
    daysCount: 3,
    durationLabel: 'សម្រាក ៣ ថ្ងៃ',
    month: 9,
    monthName: 'កញ្ញា-តុលា',
    category: 'traditional',
    categoryLabel: 'បុណ្យប្រពៃណីជាតិ',
    icon: '🌾',
    highlight: true,
  },
  {
    id: 'h-12',
    order: 12,
    dateKhmer: 'ថ្ងៃទី ១៥ ខែតុលា',
    dateIsoStart: '2027-10-15',
    name: 'ទិវាប្រារព្ធពិធីគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះករុណាព្រះបាទសម្តេចព្រះ នរោត្តម សីហនុ ព្រះមហាវីរក្សត្រ ព្រះវររាជបិតា ឯករាជ្យ បូរណភាពទឹកដី និងឯកភាពជាតិខ្មែរ «ព្រះបរមរតនកោដ្ឋ»',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 10,
    monthName: 'តុលា',
    category: 'royal',
    categoryLabel: 'ទិវាជាតិគោរពវិញ្ញាណក្ខន្ធ',
    icon: '💐',
  },
  {
    id: 'h-13',
    order: 13,
    dateKhmer: 'ថ្ងៃទី ២៩ ខែតុលា',
    dateIsoStart: '2027-10-29',
    name: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិរបស់ ព្រះករុណាព្រះបាទសម្តេចព្រះបរមនាថ នរោត្តម សីហមុនី ព្រះមហាក្សត្រ នៃព្រះរាជាណាចក្រកម្ពុជា',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 10,
    monthName: 'តុលា',
    category: 'royal',
    categoryLabel: 'ព្រះរាជពិធី',
    icon: '👑',
  },
  {
    id: 'h-14',
    order: 14,
    dateKhmer: 'ថ្ងៃទី ០៩ ខែវិច្ឆិកា',
    dateIsoStart: '2027-11-09',
    name: 'ពិធីបុណ្យឯករាជ្យជាតិ',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 11,
    monthName: 'វិច្ឆិកា',
    category: 'national',
    categoryLabel: 'បុណ្យជាតិ',
    icon: '🇰🇭',
    highlight: true,
  },
  {
    id: 'h-15',
    order: 15,
    dateKhmer: 'ថ្ងៃទី ២២-២៣-២៤ ខែវិច្ឆិកា',
    dateIsoStart: '2027-11-22',
    dateIsoEnd: '2027-11-24',
    name: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក',
    daysCount: 3,
    durationLabel: 'សម្រាក ៣ ថ្ងៃ',
    month: 11,
    monthName: 'វិច្ឆិកា',
    category: 'traditional',
    categoryLabel: 'ព្រះរាជពិធីបុណ្យប្រពៃណីជាតិ',
    icon: '🚣',
    highlight: true,
  },
  {
    id: 'h-16',
    order: 16,
    dateKhmer: 'ថ្ងៃទី ២៩ ខែធ្នូ',
    dateIsoStart: '2027-12-29',
    name: 'ទិវាសន្តិភាពនៅកម្ពុជា',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 12,
    monthName: 'ធ្នូ',
    category: 'national',
    categoryLabel: 'បុណ្យជាតិ',
    icon: '🕊️',
  },
];

// Late 2026 holidays for real-time calculation in 2026
export const CIVIL_SERVANT_HOLIDAYS_2026: CivilServantHoliday[] = [
  {
    id: 'h-2026-1',
    order: 10,
    dateKhmer: 'ថ្ងៃទី ២៤ ខែកញ្ញា ឆ្នាំ២០២៦',
    dateIsoStart: '2026-09-24',
    name: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 9,
    monthName: 'កញ្ញា',
    category: 'national',
    categoryLabel: 'បុណ្យជាតិ',
    icon: '📜',
  },
  {
    id: 'h-2026-2',
    order: 11,
    dateKhmer: 'ថ្ងៃទី ២៩-៣០ កញ្ញា និង ០១ តុលា ២០២៦',
    dateIsoStart: '2026-09-29',
    dateIsoEnd: '2026-10-01',
    name: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ',
    daysCount: 3,
    durationLabel: 'សម្រាក ៣ ថ្ងៃ',
    month: 9,
    monthName: 'កញ្ញា-តុលា',
    category: 'traditional',
    categoryLabel: 'បុណ្យប្រពៃណីជាតិ',
    icon: '🌾',
    highlight: true,
  },
  {
    id: 'h-2026-3',
    order: 12,
    dateKhmer: 'ថ្ងៃទី ១៥ ខែតុលា ឆ្នាំ២០២៦',
    dateIsoStart: '2026-10-15',
    name: 'ទិវាប្រារព្ធពិធីគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះករុណាព្រះបាទសម្តេចព្រះ នរោត្តម សីហនុ «ព្រះបរមរតនកោដ្ឋ»',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 10,
    monthName: 'តុលា',
    category: 'royal',
    categoryLabel: 'ទិវាជាតិគោរពវិញ្ញាណក្ខន្ធ',
    icon: '💐',
  },
  {
    id: 'h-2026-4',
    order: 13,
    dateKhmer: 'ថ្ងៃទី ២៩ ខែតុលា ឆ្នាំ២០២៦',
    dateIsoStart: '2026-10-29',
    name: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិរបស់ ព្រះករុណាព្រះបាទសម្តេចព្រះបរមនាថ នរោត្តម សីហមុនី',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 10,
    monthName: 'តុលា',
    category: 'royal',
    categoryLabel: 'ព្រះរាជពិធី',
    icon: '👑',
  },
  {
    id: 'h-2026-5',
    order: 14,
    dateKhmer: 'ថ្ងៃទី ០៩ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    dateIsoStart: '2026-11-09',
    name: 'ពិធីបុណ្យឯករាជ្យជាតិ',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 11,
    monthName: 'វិច្ឆិកា',
    category: 'national',
    categoryLabel: 'បុណ្យជាតិ',
    icon: '🇰🇭',
    highlight: true,
  },
  {
    id: 'h-2026-6',
    order: 15,
    dateKhmer: 'ថ្ងៃទី ២២-២៣-២៤ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    dateIsoStart: '2026-11-22',
    dateIsoEnd: '2026-11-24',
    name: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក',
    daysCount: 3,
    durationLabel: 'សម្រាក ៣ ថ្ងៃ',
    month: 11,
    monthName: 'វិច្ឆិកា',
    category: 'traditional',
    categoryLabel: 'ព្រះរាជពិធីបុណ្យប្រពៃណីជាតិ',
    icon: '🚣',
    highlight: true,
  },
  {
    id: 'h-2026-7',
    order: 16,
    dateKhmer: 'ថ្ងៃទី ២៩ ខែធ្នូ ឆ្នាំ២០២៦',
    dateIsoStart: '2026-12-29',
    name: 'ទិវាសន្តិភាពនៅកម្ពុជា',
    daysCount: 1,
    durationLabel: 'សម្រាក ១ ថ្ងៃ',
    month: 12,
    monthName: 'ធ្នូ',
    category: 'national',
    categoryLabel: 'បុណ្យជាតិ',
    icon: '🕊️',
  },
];

export interface UpcomingHolidayStatus {
  holiday: CivilServantHoliday;
  daysRemaining: number;
  statusLabel: string;
  isToday: boolean;
  isTomorrow: boolean;
  isWithinWeek: boolean;
  isWithinThreeDays: boolean;
  startDateFormatted: string;
  teacherNote?: string;
}

/**
 * Calculates upcoming civil servant holidays and countdown from a target date.
 */
export function getUpcomingHolidayStatus(refDate: Date = new Date()): UpcomingHolidayStatus | null {
  const targetMidnight = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate()).getTime();

  // Combine 2026 and 2027 holidays sorted chronologically
  const allChronological = [...CIVIL_SERVANT_HOLIDAYS_2026, ...CIVIL_SERVANT_HOLIDAYS_2027]
    .filter((h) => !!h.dateIsoStart)
    .sort((a, b) => new Date(a.dateIsoStart!).getTime() - new Date(b.dateIsoStart!).getTime());

  for (const h of allChronological) {
    const startDate = new Date(h.dateIsoStart!);
    const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    
    // Check if multi-day and currently ongoing
    const endDate = h.dateIsoEnd ? new Date(h.dateIsoEnd) : startDate;
    const endMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59).getTime();

    if (targetMidnight >= startMidnight && targetMidnight <= endMidnight) {
      return {
        holiday: h,
        daysRemaining: 0,
        statusLabel: '🎉 ថ្ងៃនេះជាថ្ងៃឈប់សម្រាក!',
        isToday: true,
        isTomorrow: false,
        isWithinWeek: true,
        isWithinThreeDays: true,
        startDateFormatted: h.dateKhmer,
        teacherNote: 'ថ្ងៃសម្រាកការងារផ្លូវការ មិនមានការបង្រៀនឡើយ',
      };
    }

    if (startMidnight > targetMidnight) {
      const diffMs = startMidnight - targetMidnight;
      const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

      let statusLabel = `នៅសល់ ${days} ថ្ងៃទៀត`;
      if (days === 1) statusLabel = '⚡ ថ្ងៃស្អែកនេះហើយ!';
      else if (days === 2) statusLabel = '🔔 នៅសល់តែ ២ ថ្ងៃទៀត!';
      else if (days === 3) statusLabel = '🔔 នៅសល់តែ ៣ ថ្ងៃទៀត!';
      else if (days <= 7) statusLabel = `⏳ នៅសល់ ${days} ថ្ងៃទៀត (សប្តាហ៍នេះ)`;

      let teacherNote = 'សូមពិនិត្យកាលវិភាគ និងកិច្ចតែងការបង្រៀន';
      if (days <= 3) {
        teacherNote = '⚡ ជិតដល់ថ្ងៃឈប់សម្រាកហើយ សូមរៀបចំផែនការបង្រៀន និងជូនដំណឹងដល់សិស្ស';
      } else if (h.daysCount >= 3) {
        teacherNote = `បុណ្យធំសម្រាក ${h.daysCount} ថ្ងៃជាប់គ្នា សូមរៀបចំម៉ោងបង្រៀនសងទុកជាមុន`;
      }

      return {
        holiday: h,
        daysRemaining: days,
        statusLabel,
        isToday: false,
        isTomorrow: days === 1,
        isWithinWeek: days <= 7,
        isWithinThreeDays: days <= 3,
        startDateFormatted: h.dateKhmer,
        teacherNote,
      };
    }
  }

  // Fallback to first 2027 holiday if none found ahead
  const first2027 = CIVIL_SERVANT_HOLIDAYS_2027[0];
  return {
    holiday: first2027,
    daysRemaining: 30,
    statusLabel: 'កម្មវិធីបន្ទាប់',
    isToday: false,
    isTomorrow: false,
    isWithinWeek: false,
    isWithinThreeDays: false,
    startDateFormatted: first2027.dateKhmer,
    teacherNote: 'សូមត្រៀមកិច្ចតែងការបង្រៀនជាមុន',
  };
}

/**
 * Generates an iCalendar (.ics) export for phone calendar sync (iPhone / Android)
 */
export function generateCivilServantIcsCalendar(): string {
  const events = CIVIL_SERVANT_HOLIDAYS_2027.map((h) => {
    const start = h.dateIsoStart?.replace(/-/g, '') || '20270101';
    let end = start;
    if (h.dateIsoEnd) {
      // End date in ICS for all-day events is non-inclusive, so add 1 day
      const d = new Date(h.dateIsoEnd);
      d.setDate(d.getDate() + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      end = `${y}${m}${day}`;
    } else {
      const d = new Date(h.dateIsoStart || '2027-01-01');
      d.setDate(d.getDate() + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      end = `${y}${m}${day}`;
    }

    return [
      'BEGIN:VEVENT',
      `UID:cambodia-holiday-2027-${h.id}@primary-teacher.moeys`,
      `SUMMARY:🇰🇭 ${h.name} (${h.durationLabel})`,
      `DESCRIPTION:${SUB_DECREE_HOLIDAYS_2027_META.title}\\nអនុក្រឹត្យលេខ ${SUB_DECREE_HOLIDAYS_2027_META.number}\\nប្រភេទ៖ ${h.categoryLabel}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MoEYS Primary App//Cambodia Civil Servant Holidays 2027//KM',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:ប្រតិទិនឈប់សម្រាកមន្ត្រីរាជការ ២០២៧ (អនុក្រឹត្យ ១៩៨)',
    'X-WR-TIMEZONE:Asia/Phnom_Penh',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

