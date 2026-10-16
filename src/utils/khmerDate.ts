// Khmer Chhankatei ( Lunar Calendar ) & Souriyatei ( Solar Calendar ) Date Generator & Utility

export interface KhmerDateOptions {
  location?: string; // e.g. "កំពង់ឆ្នាំង", "រាជធានីភ្នំពេញ"
  format?: 'combined' | 'combined_multiline' | 'souriyatei_only' | 'chhankatei_only';
}

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export const toKhmerNum = (num: number | string): string => {
  return num
    .toString()
    .split('')
    .map((char) => {
      const idx = parseInt(char, 10);
      return !isNaN(idx) ? KHMER_DIGITS[idx] : char;
    })
    .join('');
};

export const SOLAR_MONTHS_KH = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ',
];

export const KHMER_MONTH_NAMES = SOLAR_MONTHS_KH;

export const DAYS_OF_WEEK_KH = [
  'ថ្ងៃអាទិត្យ',
  'ថ្ងៃចន្ទ',
  'ថ្ងៃអង្គារ',
  'ថ្ងៃពុធ',
  'ថ្ងៃព្រហស្បតិ៍',
  'ថ្ងៃសុក្រ',
  'ថ្ងៃសៅរ៍',
];

export const LUNAR_MONTHS_KH = [
  'ចែត្រ',
  'ពិសាខ',
  'ជេស្ឋ',
  'អាសាឍ',
  'ស្រាពណ៍',
  'ភទ្របទ',
  'អស្សុជ',
  'កតិត្ដិក',
  'មិគសិរ',
  'បុស្ស',
  'មាឃ',
  'ផល្គុន',
];

export const ZODIAC_ANIMALS_KH = [
  'ជូត',
  'ឆ្លូវ',
  'ខាល',
  'ថោះ',
  'រោង',
  'ម្សាញ់',
  'មមី',
  'មមែ',
  'វក',
  'រកា',
  'ច',
  'កុរ',
];

export const SAK_TITLES_KH = [
  'សំរឹទ្ធិស័ក',
  'ឯកស័ក',
  'ទោស័ក',
  'ត្រីស័ក',
  'ចត្វាស័ក',
  'បញ្ចស័ក',
  'ឆស័ក',
  'សប្តស័ក',
  'អដ្ឋស័ក',
  'នព្វស័ក',
];

/**
 * Calculates Khmer Chhankatei (Lunar) date for a given Date object.
 */
export function getKhmerLunarDate(date: Date = new Date()) {
  const dayOfWeek = DAYS_OF_WEEK_KH[date.getDay()];

  // Reference new moon epoch: 2026-01-18 12:00:00 UTC (1Kert Month Pusa)
  const refEpoch = new Date(2026, 0, 18, 12, 0, 0).getTime();
  const targetTime = date.getTime();
  const diffDays = (targetTime - refEpoch) / (1000 * 60 * 60 * 24);
  const synodicMonth = 29.5305886;

  let cyclePos = (diffDays % synodicMonth + synodicMonth) % synodicMonth;
  let lunarDayNum = Math.floor(cyclePos) + 1;
  let isWaxing = true; // កើត vs រោច

  if (lunarDayNum <= 15) {
    isWaxing = true;
  } else {
    isWaxing = false;
    lunarDayNum = lunarDayNum - 15;
    if (lunarDayNum > 15) lunarDayNum = 15;
  }

  const lunarDayStr = `${toKhmerNum(lunarDayNum)}${isWaxing ? 'កើត' : 'រោច'}`;

  // Lunar Month estimation
  const m = date.getMonth(); // 0 to 11
  const d = date.getDate();

  // Approximate Khmer lunar month boundaries
  let lunarMonthIndex = 0;
  if ((m === 2 && d >= 15) || (m === 3 && d < 15)) lunarMonthIndex = 0; // ចែត្រ
  else if ((m === 3 && d >= 15) || (m === 4 && d < 15)) lunarMonthIndex = 1; // ពិសាខ
  else if ((m === 4 && d >= 15) || (m === 5 && d < 15)) lunarMonthIndex = 2; // ជេស្ឋ
  else if ((m === 5 && d >= 15) || (m === 6 && d < 15)) lunarMonthIndex = 3; // អាសាឍ
  else if ((m === 6 && d >= 15) || (m === 7 && d < 15)) lunarMonthIndex = 4; // ស្រាពណ៍
  else if ((m === 7 && d >= 15) || (m === 8 && d < 15)) lunarMonthIndex = 5; // ភទ្របទ
  else if ((m === 8 && d >= 15) || (m === 9 && d < 15)) lunarMonthIndex = 6; // អស្សុជ
  else if ((m === 9 && d >= 15) || (m === 10 && d < 15)) lunarMonthIndex = 7; // កតិត្ដិក
  else if ((m === 10 && d >= 15) || (m === 11 && d < 15)) lunarMonthIndex = 8; // មិគសិរ
  else if ((m === 11 && d >= 15) || (m === 0 && d < 15)) lunarMonthIndex = 9; // បុស្ស
  else if ((m === 0 && d >= 15) || (m === 1 && d < 15)) lunarMonthIndex = 10; // មាឃ
  else lunarMonthIndex = 11; // ផល្គុន

  const lunarMonthStr = LUNAR_MONTHS_KH[lunarMonthIndex];

  // Zodiac & Sak & BE calculation
  const gregorianYear = date.getFullYear();
  // Khmer New Year usually around April 14
  const isAfterKhmerNewYear = m > 3 || (m === 3 && d >= 14);

  // Zodiac calculation (2026 after KNY = Horse / មមី, 2026 before = Snake / ម្សាញ់)
  const zodiacIndex = (gregorianYear + (isAfterKhmerNewYear ? 0 : -1) + 8) % 12;
  const zodiacAnimal = ZODIAC_ANIMALS_KH[zodiacIndex];

  // Sak calculation
  const sakIndex = (gregorianYear + (isAfterKhmerNewYear ? 0 : -1)) % 10;
  const sakTitle = SAK_TITLES_KH[sakIndex];

  // Buddhist Era (BE = CE + 543 before Visak Bochea, CE + 544 after Visak Bochea around May 15)
  const isAfterVisak = m > 4 || (m === 4 && d >= 15);
  const beYear = gregorianYear + (isAfterVisak ? 544 : 543);
  const beYearStr = toKhmerNum(beYear);

  return {
    dayOfWeek,
    lunarDayStr,
    lunarMonthStr,
    zodiacAnimal,
    sakTitle,
    beYearStr,
    fullChhankatei: `${dayOfWeek} ${lunarDayStr} ខែ${lunarMonthStr} ឆ្នាំ${zodiacAnimal} ${sakTitle} ព.ស. ${beYearStr}`,
  };
}

/**
 * Calculates Khmer Souriyatei (Solar) date for a given Date object.
 */
export function getKhmerSouriyateiDate(date: Date = new Date(), location: string = '') {
  const dayOfWeek = DAYS_OF_WEEK_KH[date.getDay()];
  const dayNum = toKhmerNum(date.getDate());
  const monthStr = SOLAR_MONTHS_KH[date.getMonth()];
  const yearStr = toKhmerNum(date.getFullYear());

  const dateFormatted = `${dayOfWeek} ទី${dayNum} ខែ${monthStr} ឆ្នាំ${yearStr}`;

  if (location.trim()) {
    return `${location.trim()}, ថ្ងៃទី${dayNum} ខែ${monthStr} ឆ្នាំ${yearStr}`;
  }
  return `ថ្ងៃទី${dayNum} ខែ${monthStr} ឆ្នាំ${yearStr}`;
}

/**
 * Returns combined Khmer Chhankatei (Lunar) and Souriyatei (Solar) Date string.
 */
export function getKhmerCombinedDate(
  date: Date = new Date(),
  options: KhmerDateOptions = {}
): string {
  const { location = '', format = 'combined_multiline' } = options;

  const chhankatei = getKhmerLunarDate(date);
  const souriyatei = getKhmerSouriyateiDate(date, location);

  if (format === 'souriyatei_only') {
    return souriyatei;
  }
  if (format === 'chhankatei_only') {
    return chhankatei.fullChhankatei;
  }
  if (format === 'combined') {
    return `${chhankatei.fullChhankatei} / ${souriyatei}`;
  }

  // Default: combined_multiline (Standard for official Khmer documents)
  return `${chhankatei.fullChhankatei}\n${souriyatei}`;
}

/**
 * Returns a friendly Khmer date display string from YYYY-MM-DD or Date
 */
export function getKhmerDateDisplay(dateInput: string | Date = new Date()): string {
  try {
    if (typeof dateInput === 'string') {
      const parts = dateInput.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return getKhmerSouriyateiDate(d);
      }
    }
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return getKhmerSouriyateiDate(d);
  } catch {
    return String(dateInput);
  }
}

