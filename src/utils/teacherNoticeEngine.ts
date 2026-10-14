import { 
  getUpcomingHolidayStatus, 
  CIVIL_SERVANT_HOLIDAYS_2026, 
  CIVIL_SERVANT_HOLIDAYS_2027, 
  UpcomingHolidayStatus 
} from '../data/civilServantHolidays2027';
import { MOEYS_GUIDELINE_2026_2027_INFO } from '../data/moeysGuidelineData';
import { MOEYS_STATS_GUIDELINE_2026_2027_META } from '../data/moeysStatsGuidelineData';

export interface TeacherNoticeItem {
  id: string;
  category: 'holiday' | 'directive' | 'daily_duty' | 'meeting' | 'urgent';
  categoryLabel: string;
  title: string;
  content: string;
  badge: string;
  badgeColor: string; // e.g. 'bg-red-500 text-white'
  icon: string;
  timeContext: string;
  urgency: 'high' | 'medium' | 'low';
  actionType?: 'open_holidays' | 'open_guidelines' | 'open_attendance' | 'open_plc';
  actionLabel?: string;
  dateKey?: string;
}

export interface TeacherNoticeFeed {
  currentDateFormattedKhmer: string;
  currentTimeFormatted: string;
  holidayStatus: UpcomingHolidayStatus | null;
  tickerItems: {
    id: string;
    icon: string;
    tag: string;
    text: string;
    tagColor: string;
  }[];
  notices: TeacherNoticeItem[];
  urgentCount: number;
}

/**
 * Format a Date to Khmer solar date string
 */
export function formatKhmerDateLong(date: Date = new Date()): string {
  const khmerDays = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
  const khmerMonths = [
    'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
    'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
  ];
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  const toKhmerNumber = (num: number) =>
    num.toString().split('').map((d) => khmerDigits[parseInt(d, 10)] ?? d).join('');

  const dayName = khmerDays[date.getDay()];
  const day = toKhmerNumber(date.getDate());
  const monthName = khmerMonths[date.getMonth()];
  const year = toKhmerNumber(date.getFullYear());

  return `ថ្ងៃ${dayName} ទី${day} ខែ${monthName} ឆ្នាំ${year}`;
}

/**
 * Generates the complete, live, real-time dynamic notice feed for teachers
 * based on current date/time, civil servant holidays, and MoEYS guidelines.
 */
export function getTeacherNoticeFeed(refDate: Date = new Date()): TeacherNoticeFeed {
  const hours = refDate.getHours();
  const minutes = refDate.getMinutes();
  const month = refDate.getMonth() + 1; // 1-12
  const day = refDate.getDate();
  const year = refDate.getFullYear();

  const khmerDateStr = formatKhmerDateLong(refDate);
  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  const holidayStatus = getUpcomingHolidayStatus(refDate);
  const notices: TeacherNoticeItem[] = [];
  const tickerItems: TeacherNoticeFeed['tickerItems'] = [];

  // ==========================================
  // 1. HOLIDAY STATUS & COUNTDOWN NOTICE
  // ==========================================
  if (holidayStatus) {
    if (holidayStatus.isToday) {
      notices.push({
        id: `notice-holiday-today-${holidayStatus.holiday.id}`,
        category: 'holiday',
        categoryLabel: '🎉 ថ្ងៃឈប់សម្រាកផ្លូវការ',
        title: `ថ្ងៃនេះជាថ្ងៃឈប់សម្រាក៖ ${holidayStatus.holiday.name}`,
        content: `សម្រាកការងារផ្លូវការចំនួន ${holidayStatus.holiday.daysCount} ថ្ងៃ (${holidayStatus.holiday.durationLabel}) តាមអនុក្រឹត្យលេខ ១៩៨ អនក្រ.បក។ មិនមានការបង្រៀនឡើយ!`,
        badge: 'ថ្ងៃនេះសម្រាក',
        badgeColor: 'bg-emerald-600 text-white',
        icon: holidayStatus.holiday.icon || '🎉',
        timeContext: 'ពេញមួយថ្ងៃ',
        urgency: 'high',
        actionType: 'open_holidays',
        actionLabel: 'មើលប្រតិទិនឈប់សម្រាក',
      });

      tickerItems.push({
        id: 'tick-holiday-today',
        icon: holidayStatus.holiday.icon || '🎉',
        tag: 'ថ្ងៃនេះឈប់សម្រាក',
        text: `🎉 ថ្ងៃនេះជាថ្ងៃឈប់សម្រាកផ្លូវការ៖ ${holidayStatus.holiday.name} (${holidayStatus.holiday.durationLabel}) មិនមានការបង្រៀនឡើយ!`,
        tagColor: 'bg-emerald-500 text-slate-950 font-bold',
      });
    } else {
      const isUrgent = holidayStatus.daysRemaining <= 3;
      const badgeText = holidayStatus.daysRemaining === 1 
        ? '⚡ ថ្ងៃស្អែកនេះហើយ' 
        : holidayStatus.daysRemaining <= 3 
        ? `🔔 នៅសល់ ${holidayStatus.daysRemaining} ថ្ងៃ` 
        : `⏳ នៅសល់ ${holidayStatus.daysRemaining} ថ្ងៃ`;

      notices.push({
        id: `notice-holiday-upcoming-${holidayStatus.holiday.id}`,
        category: 'holiday',
        categoryLabel: '🏖️ ប្រតិទិនឈប់សម្រាកខាងមុខ',
        title: `${holidayStatus.statusLabel} ដល់ ${holidayStatus.holiday.name}`,
        content: `${holidayStatus.teacherNote} (កាលបរិច្ឆេទ៖ ${holidayStatus.holiday.dateKhmer} - សម្រាក ${holidayStatus.holiday.daysCount} ថ្ងៃ) ស្របតាមអនុក្រឹត្យលេខ ១៩៨ អនក្រ.បក។`,
        badge: badgeText,
        badgeColor: isUrgent ? 'bg-amber-500 text-slate-950' : 'bg-purple-600 text-white',
        icon: holidayStatus.holiday.icon || '🔔',
        timeContext: `ចាប់ពី ${holidayStatus.holiday.dateKhmer}`,
        urgency: isUrgent ? 'high' : 'medium',
        actionType: 'open_holidays',
        actionLabel: 'ពិនិត្យប្រតិទិនអនុក្រឹត្យ',
      });

      tickerItems.push({
        id: 'tick-holiday-upcoming',
        icon: holidayStatus.holiday.icon || '🔔',
        tag: badgeText,
        text: `${holidayStatus.statusLabel} ដល់ «${holidayStatus.holiday.name}» (${holidayStatus.holiday.durationLabel}) — ${holidayStatus.teacherNote}!`,
        tagColor: isUrgent ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-purple-500 text-white font-bold',
      });
    }
  }

  // ==========================================
  // 2. MOEYS GUIDELINES & DIRECTIVES (សេចក្តីណែនាំ)
  // Contextual by Academic Year Calendar
  // ==========================================
  if (month === 9 || month === 10) {
    // September - October: Preparation & EMIS Statistics & Approaching Opening
    notices.push({
      id: 'notice-directive-427',
      category: 'directive',
      categoryLabel: '📜 សេចក្តីណែនាំ ៤២៧',
      title: 'សេចក្តីណែនាំលេខ ៤២៧ អយក.សណន៖ ដំណើរការគ្រឹះស្ថានបឋមសិក្សា',
      content: 'ត្រៀមបើកបវេសនកាលឆ្នាំសិក្សាថ្មីនៅថ្ងៃទី ០១ ខែវិច្ឆិកា! ត្រូវរៀបចំបរិស្ថានសាលារៀន តុល្យភាពបន្ទប់រៀន បែងចែកគ្រូបង្រៀន និងកាលវិភាគបង្រៀនឱ្យបានត្រឹមត្រូវតាមស្តង់ដាសាលារៀនគំរូ។',
      badge: 'ក្រសួងអប់រំ',
      badgeColor: 'bg-indigo-600 text-white',
      icon: '🏛️',
      timeContext: 'ត្រៀមបើកបវេសនកាល ០១ វិច្ឆិកា',
      urgency: 'high',
      actionType: 'open_guidelines',
      actionLabel: 'អានសេចក្តីណែនាំ ៤២៧',
    });

    notices.push({
      id: 'notice-directive-42-emis',
      category: 'directive',
      categoryLabel: '📊 សេចក្តីណែនាំ ៤២ (EMIS)',
      title: 'សេចក្តីណែនាំលេខ ៤២ អយក.សណន៖ បូកសរុបស្ថិតិអប់រំបឋម',
      content: 'ធ្វើបច្ចុប្បន្នភាពទិន្នន័យស្ថិតិសិស្ស បន្ទប់រៀន និងគ្រូបង្រៀនក្នុងប្រព័ន្ធ entryemis.moeys.gov.kh ដើម្បីធានាតុល្យភាពជាក់ស្តែងមុនដំណើរការបង្រៀនពេញលេញ។',
      badge: 'ស្ថិតិ EMIS',
      badgeColor: 'bg-blue-600 text-white',
      icon: '📈',
      timeContext: 'ប្រព័ន្ធគ្រប់គ្រងអប់រំ',
      urgency: 'medium',
      actionType: 'open_guidelines',
      actionLabel: 'មើលសេចក្តីណែនាំ EMIS',
    });

    tickerItems.push({
      id: 'tick-directive-427',
      icon: '🏛️',
      tag: 'សេចក្តីណែនាំ ៤២៧',
      text: 'សេចក្តីណែនាំលេខ ៤២៧ អយក.សណន៖ សូមរៀបចំបរិស្ថានថ្នាក់រៀន និងកាលវិភាគបង្រៀនឱ្យបានរួចរាល់ ឆ្ពោះទៅថ្ងៃបើកបវេសនកាល ០១ វិច្ឆិកា!',
      tagColor: 'bg-indigo-500 text-white font-bold',
    });
  } else if (month >= 11 || month <= 2) {
    // November - February: Semester 1 Full Teaching
    notices.push({
      id: 'notice-directive-teaching-sem1',
      category: 'directive',
      categoryLabel: '📘 ដំណើរការឆមាសទី១',
      title: 'ការអនុវត្តកម្មវិធីសិក្សា និងស្តង់ដាសាលារៀនគំរូ',
      content: 'ពង្រឹងការបង្រៀនកញ្ចប់អំណាន និងគណិតវិទ្យាថ្នាក់ដំបូង ស្រង់វត្តមានសិស្សតាមប្រព័ន្ធ PLP រៀងរាល់ថ្ងៃ និងកត់ត្រាកិច្ចតែងការបង្រៀនជាប្រចាំ។',
      badge: 'ឆមាសទី១',
      badgeColor: 'bg-emerald-600 text-white',
      icon: '📚',
      timeContext: 'ដំណើរការបង្រៀនសកម្ម',
      urgency: 'medium',
      actionType: 'open_attendance',
      actionLabel: 'ស្រង់វត្តមាន PLP',
    });

    tickerItems.push({
      id: 'tick-teaching-sem1',
      icon: '📚',
      tag: 'ឆមាសទី១',
      text: 'ដំណើរការបង្រៀនឆមាសទី១៖ សូមបន្តស្រង់វត្តមានសិស្សតាមប្រព័ន្ធ PLP និងអនុវត្តវិធីសាស្ត្របង្រៀនកញ្ចប់អំណាន-គណិតវិទ្យាថ្នាក់ដំបូង!',
      tagColor: 'bg-emerald-500 text-white font-bold',
    });
  } else if (month === 3 || month === 4) {
    // March - April: Semester 1 Assessment & Khmer New Year break
    notices.push({
      id: 'notice-directive-break-april',
      category: 'directive',
      categoryLabel: '🏖️ វិស្សមកាលតូច',
      title: 'ការវាយតម្លៃលទ្ធផលឆមាសទី១ និងវិស្សមកាលតូច',
      content: 'បូកសរុបពិន្ទុឆមាសទី១ ជូនដំណឹងដល់មាតាបិតាសិស្ស និងរៀបចំកិច្ចការផ្ទះស្វ័យសិក្សាសម្រាប់សិស្សក្នុងឱកាសវិស្សមកាលតូច (ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ)។',
      badge: 'វិស្សមកាលតូច',
      badgeColor: 'bg-amber-600 text-white',
      icon: '🎊',
      timeContext: 'ខែមេសា',
      urgency: 'high',
      actionType: 'open_holidays',
      actionLabel: 'មើលកាលវិភាគវិស្សមកាល',
    });

    tickerItems.push({
      id: 'tick-break-april',
      icon: '🎊',
      tag: 'វិស្សមកាលតូច',
      text: 'ត្រៀមបូកសរុបពិន្ទុឆមាសទី១ និងរៀបចំកិច្ចការស្វ័យសិក្សាសម្រាប់សិស្សក្នុងឱកាសពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ!',
      tagColor: 'bg-amber-500 text-slate-950 font-bold',
    });
  } else {
    // May - August: Semester 2 & Year End
    notices.push({
      id: 'notice-directive-sem2-end',
      category: 'directive',
      categoryLabel: '🎓 ការវាយតម្លៃបញ្ចប់ឆ្នាំ',
      title: 'ពង្រឹងការបង្រៀនសិស្សរៀនយឺត និងត្រៀមបញ្ចប់ឆ្នាំសិក្សា',
      content: 'រៀបចំការបង្រៀនបន្ថែមដល់សិស្សរៀនយឺត ធ្វើតេស្តវាស់ស្ទង់សមត្ថភាពចុងឆ្នាំ និងរៀបចំបូកសរុបលទ្ធផលប្រចាំឆ្នាំមុនមហាវិស្សមកាល។',
      badge: 'ឆមាសទី២',
      badgeColor: 'bg-indigo-600 text-white',
      icon: '🎯',
      timeContext: 'បញ្ចប់ឆ្នាំសិក្សា',
      urgency: 'medium',
      actionType: 'open_attendance',
      actionLabel: 'ពិនិត្យលទ្ធផលសិក្សា',
    });
  }

  // ==========================================
  // 3. DAILY TIME-OF-DAY TEACHING DUTY NOTICE
  // ==========================================
  if (hours >= 6 && hours < 11) {
    notices.push({
      id: 'notice-daily-morning',
      category: 'daily_duty',
      categoryLabel: '☀️ ម៉ោងបង្រៀនពេលព្រឹក',
      title: 'ការងារបង្រៀន និងស្រង់វត្តមានពេលព្រឹក',
      content: 'សូមពិនិត្យកិច្ចតែងការបង្រៀន ស្រង់វត្តមានសិស្សតាមប្រព័ន្ធ PLP និងតាមដានសិស្សអវត្តមានគ្មានមូលហេតុដើម្បីទាក់ទងអាណាព្យាបាលទាន់ពេល។',
      badge: 'ពេលព្រឹក (៧:០០ - ១១:០០)',
      badgeColor: 'bg-amber-500 text-slate-950',
      icon: '☀️',
      timeContext: `${timeStr} ព្រឹក`,
      urgency: 'medium',
      actionType: 'open_attendance',
      actionLabel: 'ស្រង់វត្តមានពេលព្រឹក',
    });

    tickerItems.push({
      id: 'tick-morning-duty',
      icon: '☀️',
      tag: 'ម៉ោងបង្រៀនព្រឹក',
      text: 'សូមពិនិត្យកិច្ចតែងការបង្រៀនប្រចាំថ្ងៃ និងស្រង់វត្តមានសិស្សតាមប្រព័ន្ធ PLP ឱ្យបានទាន់ពេលវេលា!',
      tagColor: 'bg-amber-400 text-slate-950 font-bold',
    });
  } else if (hours >= 11 && hours < 13) {
    notices.push({
      id: 'notice-daily-noon',
      category: 'daily_duty',
      categoryLabel: '🍱 ពេលសម្រាកថ្ងៃត្រង់',
      title: 'ការសម្រាក និងពិនិត្យទិន្នន័យព្រឹកនេះ',
      content: 'សូមសម្រាកអាហារថ្ងៃត្រង់ និងពិនិត្យមើលបញ្ជីសិស្សខកខានមិនបានមកសាលាព្រឹកនេះ ដើម្បីកត់ត្រាក្នុងសៀវភៅតាមដានវត្តមាន។',
      badge: 'សម្រាកថ្ងៃត្រង់',
      badgeColor: 'bg-orange-500 text-white',
      icon: '🍱',
      timeContext: `${timeStr} ថ្ងៃត្រង់`,
      urgency: 'low',
      actionType: 'open_attendance',
      actionLabel: 'ពិនិត្យបញ្ជីវត្តមាន',
    });
  } else if (hours >= 13 && hours < 17) {
    notices.push({
      id: 'notice-daily-afternoon',
      category: 'daily_duty',
      categoryLabel: '🌤️ ម៉ោងបង្រៀនពេលរសៀល',
      title: 'ការងារបង្រៀន និងវត្តមានពេលរសៀល',
      content: 'សូមបន្តកត់ត្រាវត្តមានសិស្សពេលរសៀល តាមដានការអនុវត្តកិច្ចការផ្ទះ និងវិន័យទូទៅរបស់សិស្សក្នុងថ្នាក់រៀន។',
      badge: 'ពេលរសៀល (១៣:៣០ - ១៧:០០)',
      badgeColor: 'bg-sky-600 text-white',
      icon: '🌤️',
      timeContext: `${timeStr} រសៀល`,
      urgency: 'medium',
      actionType: 'open_attendance',
      actionLabel: 'ស្រង់វត្តមានរសៀល',
    });

    tickerItems.push({
      id: 'tick-afternoon-duty',
      icon: '🌤️',
      tag: 'ម៉ោងបង្រៀនរសៀល',
      text: 'សូមកត់ត្រាវត្តមានសិស្សពេលរសៀល និងតាមដានកិច្ចការស្វ័យសិក្សារបស់សិស្សឱ្យបានទៀងទាត់!',
      tagColor: 'bg-sky-400 text-slate-950 font-bold',
    });
  } else {
    // Evening / Night
    notices.push({
      id: 'notice-daily-evening',
      category: 'daily_duty',
      categoryLabel: '🌙 ពេលល្ងាច / រៀបចំការងារស្អែក',
      title: 'ត្រៀមកិច្ចតែងការ និងឯកសារបង្រៀនសម្រាប់ថ្ងៃស្អែក',
      content: 'សូមពិនិត្យមើលកាលវិភាគបង្រៀនថ្ងៃស្អែក ត្រៀមឧបករណ៍ឧបទេស និងបញ្ចូលពិន្ទុសិស្សប្រចាំខែឱ្យបានទៀងទាត់។',
      badge: 'ត្រៀមស្អែក',
      badgeColor: 'bg-purple-600 text-white',
      icon: '🌙',
      timeContext: `${timeStr} យប់`,
      urgency: 'low',
      actionType: 'open_plc',
      actionLabel: 'ពិនិត្យកិច្ចតែងការ',
    });

    tickerItems.push({
      id: 'tick-evening-duty',
      icon: '🌙',
      tag: 'រៀបចំការងារស្អែក',
      text: 'សូមពិនិត្យកិច្ចតែងការបង្រៀន និងត្រៀមឧបករណ៍ឧបទេសសម្រាប់ម៉ោងបង្រៀននៅថ្ងៃស្អែក!',
      tagColor: 'bg-purple-400 text-slate-950 font-bold',
    });
  }

  // ==========================================
  // 4. PLC & TECHNICAL MEETING ROUTINE NOTICE
  // ==========================================
  notices.push({
    id: 'notice-plc-weekly',
    category: 'meeting',
    categoryLabel: '🤝 កិច្ចប្រជុំបច្ចេកទេស PLC',
    title: 'ការប្រជុំកែលម្អការបង្រៀនប្រចាំសប្តាហ៍ (PLC)',
    content: 'ពិនិត្យបញ្ហាប្រឈមក្នុងការបង្រៀន ផ្លាស់ប្តូរបទពិសោធន៍បង្រៀនជាមួយសហការី និងកត់ត្រាកំណត់ហេតុប្រជុំ PLC តាមទម្រង់ក្រសួង។',
    badge: 'ប្រចាំសប្តាហ៍',
    badgeColor: 'bg-teal-600 text-white',
    icon: '👥',
    timeContext: 'កិច្ចប្រជុំក្រុមបច្ចេកទេស',
    urgency: 'low',
    actionType: 'open_plc',
    actionLabel: 'បើកកំណត់ហេតុ PLC',
  });

  const urgentCount = notices.filter((n) => n.urgency === 'high').length;

  return {
    currentDateFormattedKhmer: khmerDateStr,
    currentTimeFormatted: timeStr,
    holidayStatus,
    tickerItems,
    notices,
    urgentCount,
  };
}
