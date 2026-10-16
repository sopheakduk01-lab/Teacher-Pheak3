export type BannerThemeId =
  | 'official-emerald'
  | 'royal_purple'
  | 'sunrise-gold'
  | 'sunset'
  | 'ocean-cyan'
  | 'royal-indigo'
  | 'cherry-blossom'
  | string;

export interface BannerTheme {
  id: string;
  name: string;
  nameKh: string;
  subtitle: string;
  icon: string;
  previewGradient: string;
  bannerGradient: string;
}

export interface BannerThemesRecord extends Record<string, BannerTheme> {
  royal_purple: BannerTheme;
  'official-emerald': BannerTheme;
  'sunrise-gold': BannerTheme;
  sunset: BannerTheme;
  'ocean-cyan': BannerTheme;
}

export const BANNER_THEMES: BannerThemesRecord = {
  'official-emerald': {
    id: 'official-emerald',
    name: 'Nature & Emerald',
    nameKh: 'ធម្មជាតិ & ត្បូងមរកត',
    subtitle: 'រចនាបថបៃតងរដ្ឋបាលផ្លូវការ ស្រស់ថ្លា និងប្រណិត',
    icon: '🌿',
    previewGradient: 'from-emerald-700 via-teal-700 to-green-800',
    bannerGradient: 'from-[#063321] via-[#042417] to-[#021810]',
  },
  'royal_purple': {
    id: 'royal_purple',
    name: 'Cosmic Purple',
    nameKh: 'ស្វាយរាជវាំងចក្រវាល',
    subtitle: 'រចនាបថទំនើបប្រណិត និងទាក់ទាញ',
    icon: '🌌',
    previewGradient: 'from-indigo-700 via-purple-700 to-blue-800',
    bannerGradient: 'from-indigo-950 via-purple-950 to-slate-950',
  },
  'sunrise-gold': {
    id: 'sunrise-gold',
    name: 'Thunder Gold',
    nameKh: 'សុវណ្ណរស្មីរន្ទះមាស',
    subtitle: 'រចនាបថភ្លឺថ្លា ពោរពេញដោយថាមពលអប់រំ',
    icon: '⚡',
    previewGradient: 'from-amber-600 via-orange-600 to-yellow-600',
    bannerGradient: 'from-amber-950 via-orange-950 to-stone-950',
  },
  'sunset': {
    id: 'sunset',
    name: 'Sunset Glow',
    nameKh: 'អរុណរះអស្តង្គត',
    subtitle: 'រចនាបថកក់ក្តៅ និងរស់រវើក',
    icon: '🌅',
    previewGradient: 'from-orange-600 via-rose-600 to-purple-600',
    bannerGradient: 'from-orange-950 via-rose-950 to-slate-950',
  },
  'ocean-cyan': {
    id: 'ocean-cyan',
    name: 'Ocean Cyan',
    nameKh: 'សមុទ្រខៀវស្រស់ថ្លា',
    subtitle: 'រចនាបថត្រជាក់ភ្នែក ជួយសម្រួលការផ្ដោតអារម្មណ៍',
    icon: '🌊',
    previewGradient: 'from-cyan-700 via-sky-700 to-blue-700',
    bannerGradient: 'from-cyan-950 via-sky-950 to-blue-950',
  },
  'royal-indigo': {
    id: 'royal-indigo',
    name: 'Royal Indigo',
    nameKh: 'ស្វាយរាជវាំងឥន្ទនីល',
    subtitle: 'រចនាបថទំនើបប្រណិត និងទាក់ទាញ',
    icon: '👑',
    previewGradient: 'from-indigo-700 via-purple-700 to-blue-800',
    bannerGradient: 'from-indigo-950 via-purple-950 to-blue-900',
  },
  'cherry-blossom': {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    nameKh: 'ផ្កាសាគូរ៉ាផ្កាឈូក',
    subtitle: 'រចនាបថទន់ភ្លន់ សមស្របសម្រាប់បឋមសិក្សា',
    icon: '🌸',
    previewGradient: 'from-pink-600 via-rose-600 to-purple-600',
    bannerGradient: 'from-pink-700 via-rose-700 to-purple-800',
  },
};

const STORAGE_KEY = 'teacher_active_banner_theme';

export function getSavedBannerTheme(): BannerThemeId {
  if (typeof window === 'undefined') return 'official-emerald';
  const saved = localStorage.getItem(STORAGE_KEY) as BannerThemeId;
  return saved && BANNER_THEMES[saved] ? saved : 'official-emerald';
}

export function saveBannerTheme(themeId: BannerThemeId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, themeId);
}
