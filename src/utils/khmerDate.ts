const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
const KHMER_DAYS = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
const KHMER_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

export function toKhmerNum(input: number | string | undefined | null): string {
  if (input === undefined || input === null) return '';
  return String(input).replace(/[0-9]/g, (digit) => KHMER_DIGITS[parseInt(digit, 10)] || digit);
}

export function getKhmerCombinedDate(
  dateInput?: Date | string,
  options?: { location?: string; format?: string } | string
): string {
  const d = dateInput instanceof Date ? dateInput : (dateInput ? new Date(dateInput) : new Date());
  if (isNaN(d.getTime())) return typeof dateInput === 'string' ? dateInput : '';
  const dayName = KHMER_DAYS[d.getDay()];
  const dayNum = toKhmerNum(d.getDate());
  const monthName = KHMER_MONTHS[d.getMonth()];
  const yearNum = toKhmerNum(d.getFullYear());

  const location = typeof options === 'string' ? options : options?.location;
  const base = `ថ្ងៃ${dayName} ទី${dayNum} ខែ${monthName} ឆ្នាំ${yearNum}`;
  if (location) {
    return `ធ្វើនៅ${location}, ${base}`;
  }
  return base;
}

export function getKhmerSouriyateiDate(date?: Date | string, loc?: string): string {
  const d = date instanceof Date ? date : (date ? new Date(date) : new Date());
  if (isNaN(d.getTime())) return typeof date === 'string' ? date : '';
  const dayName = KHMER_DAYS[d.getDay()];
  const dayNum = toKhmerNum(d.getDate());
  const monthName = KHMER_MONTHS[d.getMonth()];
  const yearNum = toKhmerNum(d.getFullYear());
  const base = `ថ្ងៃ${dayName} ទី${dayNum} ខែ${monthName} ឆ្នាំ${yearNum}`;
  if (loc) {
    return `ធ្វើនៅ${loc}, ${base}`;
  }
  return base;
}

export type KhmerLunarDateResult = string & {
  fullChhankatei: string;
  dayName: string;
  moonPhase: string;
  monthName: string;
  beYear: string;
};

export function getKhmerLunarDate(date?: Date | string): KhmerLunarDateResult {
  const d = date instanceof Date ? date : (date ? new Date(date) : new Date());
  const validDate = isNaN(d.getTime()) ? new Date() : d;
  const beYear = toKhmerNum(validDate.getFullYear() + 544);
  const dayNum = (validDate.getDate() % 15) || 1;
  const isWaxing = validDate.getDate() <= 15;
  const moonPhase = isWaxing ? `${toKhmerNum(dayNum)}កើត` : `${toKhmerNum(dayNum)}រោច`;
  const monthName = KHMER_MONTHS[validDate.getMonth()];
  const dayName = KHMER_DAYS[validDate.getDay()];
  const str = `ថ្ងៃ${dayName} ${moonPhase} ខែ${monthName} ព.ស. ${beYear}`;

  const strObj = new String(str);
  Object.defineProperties(strObj, {
    fullChhankatei: { value: str, enumerable: true, configurable: true, writable: false },
    dayName: { value: dayName, enumerable: true, configurable: true, writable: false },
    moonPhase: { value: moonPhase, enumerable: true, configurable: true, writable: false },
    monthName: { value: monthName, enumerable: true, configurable: true, writable: false },
    beYear: { value: beYear, enumerable: true, configurable: true, writable: false },
  });

  return strObj as unknown as KhmerLunarDateResult;
}

export function getKhmerDateDisplay(dateInput?: Date | string): string {
  const d = dateInput instanceof Date ? dateInput : (dateInput ? new Date(dateInput) : new Date());
  if (isNaN(d.getTime())) return '';
  const dayNum = toKhmerNum(d.getDate());
  const monthName = KHMER_MONTHS[d.getMonth()];
  const yearNum = toKhmerNum(d.getFullYear());
  return `ទី${dayNum} ខែ${monthName} ឆ្នាំ${yearNum}`;
}

export const KHMER_MONTH_NAMES = KHMER_MONTHS;

