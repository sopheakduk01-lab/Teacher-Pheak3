export type BannerThemeId =
  | 'royal_purple'
  | 'digital_tech'
  | 'khmer_traditional'
  | 'emerald_nature'
  | 'national_ruby';

export interface BannerThemeConfig {
  id: BannerThemeId;
  name: string;
  nameKh: string;
  subtitle: string;
  icon: string;
  previewGradient: string;
  dotColor: string;
  accentColor: string;
  
  // Header Context Banner Classes
  headerGradient: string;
  headerBorder: string;
  headerShadow: string;
  headerSubtext: string;
  
  // Bento Active Navigation Card Classes
  bentoActiveGradient: string;
  bentoActiveRing: string;
  bentoActiveShadow: string;
  bentoSubtext: string;
  bentoActiveIconBg: string;
  bentoInactiveIconBg: string;
  bentoInactiveIconText: string;
  
  // Sub Navigation Pills
  subPillActiveBg: string;
  subPillActiveShadow: string;
  subPillInactiveBadgeBg: string;
  subPillInactiveBadgeText: string;
  subPillInactiveBadgeBorder: string;
  
  // Section Highlighted Banners (e.g. Student Roster banner)
  bannerGradient: string;
  bannerBorder: string;
  radialGlow: string;
  
  // Badges & Buttons
  accentBadgeBg: string;
  accentBadgeText: string;
  primaryButtonBg: string;
  primaryButtonText: string;
  tagColor: string;
}

export const BANNER_THEMES: Record<BannerThemeId, BannerThemeConfig> = {
  royal_purple: {
    id: 'royal_purple',
    name: 'Royal Purple & Angkor',
    nameKh: 'ស្វាយរាជវង្ស & អង្គរ',
    subtitle: 'រចនាបទស្វាយប្រណិត អមដោយមាសរាជវង្ស និងស្រមោលស្វាយក្រម៉ៅ',
    icon: '👑',
    previewGradient: 'from-purple-900 via-indigo-900 to-slate-900',
    dotColor: '#9333ea',
    accentColor: '#fbbf24',
    headerGradient: 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900',
    headerBorder: 'border-purple-700/40',
    headerShadow: 'shadow-purple-950/20',
    headerSubtext: 'text-purple-200',
    bentoActiveGradient: 'bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950',
    bentoActiveRing: 'ring-purple-500/50',
    bentoActiveShadow: 'shadow-purple-950/20',
    bentoSubtext: 'text-purple-200',
    bentoActiveIconBg: 'bg-white/20 text-white',
    bentoInactiveIconBg: 'bg-purple-50',
    bentoInactiveIconText: 'text-purple-900',
    subPillActiveBg: 'bg-purple-900 text-white',
    subPillActiveShadow: 'shadow-purple-900/20',
    subPillInactiveBadgeBg: 'bg-purple-100',
    subPillInactiveBadgeText: 'text-purple-900',
    subPillInactiveBadgeBorder: 'border-purple-200',
    bannerGradient: 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900',
    bannerBorder: 'border-purple-800/40',
    radialGlow: 'from-amber-400/20 via-purple-500/10 to-transparent',
    accentBadgeBg: 'bg-amber-400',
    accentBadgeText: 'text-slate-950',
    primaryButtonBg: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
    primaryButtonText: 'text-slate-950',
    tagColor: 'text-purple-200/80',
  },
  digital_tech: {
    id: 'digital_tech',
    name: 'Cyber Digital & AI',
    nameKh: 'ឌីជីថល & AI បច្ចេកវិទ្យា',
    subtitle: 'រចនាបទបែបឌីជីថល ស៊ីប័រ ខៀវអ៊ីយ៉ុង និងបច្ចេកវិទ្យាទំនើប',
    icon: '⚡',
    previewGradient: 'from-sky-950 via-blue-900 to-slate-950',
    dotColor: '#0ea5e9',
    accentColor: '#38bdf8',
    headerGradient: 'bg-gradient-to-r from-sky-950 via-blue-900 to-slate-950',
    headerBorder: 'border-cyan-500/40',
    headerShadow: 'shadow-sky-950/30',
    headerSubtext: 'text-cyan-200',
    bentoActiveGradient: 'bg-gradient-to-br from-sky-900 via-blue-950 to-slate-950',
    bentoActiveRing: 'ring-cyan-500/50',
    bentoActiveShadow: 'shadow-cyan-950/30',
    bentoSubtext: 'text-cyan-200',
    bentoActiveIconBg: 'bg-cyan-500/25 text-cyan-200',
    bentoInactiveIconBg: 'bg-sky-50',
    bentoInactiveIconText: 'text-sky-900',
    subPillActiveBg: 'bg-sky-900 text-white',
    subPillActiveShadow: 'shadow-sky-900/20',
    subPillInactiveBadgeBg: 'bg-sky-100',
    subPillInactiveBadgeText: 'text-sky-900',
    subPillInactiveBadgeBorder: 'border-sky-200',
    bannerGradient: 'bg-gradient-to-r from-sky-950 via-blue-900 to-slate-950',
    bannerBorder: 'border-cyan-600/40',
    radialGlow: 'from-cyan-400/25 via-sky-500/10 to-transparent',
    accentBadgeBg: 'bg-cyan-400',
    accentBadgeText: 'text-slate-950',
    primaryButtonBg: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950',
    primaryButtonText: 'text-slate-950',
    tagColor: 'text-cyan-200/80',
  },
  khmer_traditional: {
    id: 'khmer_traditional',
    name: 'Traditional Khmer & Heritage',
    nameKh: 'សិល្បៈខ្មែរបុរាណ & ស្លឹករឹត',
    subtitle: 'រចនាបទក្បាច់ខ្មែរបុរាណ ពណ៌មាសបុរាណ ឈើប្រណិត និងស្លឹករឹត',
    icon: '🏛️',
    previewGradient: 'from-amber-950 via-stone-900 to-yellow-950',
    dotColor: '#d97706',
    accentColor: '#fbbf24',
    headerGradient: 'bg-gradient-to-r from-amber-950 via-stone-900 to-yellow-950',
    headerBorder: 'border-amber-600/40',
    headerShadow: 'shadow-amber-950/30',
    headerSubtext: 'text-amber-200',
    bentoActiveGradient: 'bg-gradient-to-br from-amber-950 via-stone-900 to-yellow-950',
    bentoActiveRing: 'ring-amber-500/50',
    bentoActiveShadow: 'shadow-amber-950/30',
    bentoSubtext: 'text-amber-200',
    bentoActiveIconBg: 'bg-amber-400/20 text-amber-300',
    bentoInactiveIconBg: 'bg-amber-50',
    bentoInactiveIconText: 'text-amber-900',
    subPillActiveBg: 'bg-amber-900 text-white',
    subPillActiveShadow: 'shadow-amber-900/20',
    subPillInactiveBadgeBg: 'bg-amber-100',
    subPillInactiveBadgeText: 'text-amber-900',
    subPillInactiveBadgeBorder: 'border-amber-200',
    bannerGradient: 'bg-gradient-to-r from-amber-950 via-stone-900 to-yellow-950',
    bannerBorder: 'border-amber-700/50',
    radialGlow: 'from-amber-400/30 via-yellow-600/15 to-transparent',
    accentBadgeBg: 'bg-amber-400',
    accentBadgeText: 'text-stone-950',
    primaryButtonBg: 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950',
    primaryButtonText: 'text-stone-950',
    tagColor: 'text-amber-200/80',
  },
  emerald_nature: {
    id: 'emerald_nature',
    name: 'Emerald Green & Nature',
    nameKh: 'ត្បូងមរកត & ធម្មជាតិបៃតង',
    subtitle: 'រចនាបទបៃតងត្បូងមរកត ធម្មជាតិស្រស់ស្រាយ ជំនួយដល់សុខភាពភ្នែក',
    icon: '🌿',
    previewGradient: 'from-emerald-950 via-teal-900 to-slate-950',
    dotColor: '#059669',
    accentColor: '#34d399',
    headerGradient: 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950',
    headerBorder: 'border-emerald-600/40',
    headerShadow: 'shadow-emerald-950/30',
    headerSubtext: 'text-emerald-200',
    bentoActiveGradient: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950',
    bentoActiveRing: 'ring-emerald-500/50',
    bentoActiveShadow: 'shadow-emerald-950/30',
    bentoSubtext: 'text-emerald-200',
    bentoActiveIconBg: 'bg-emerald-400/20 text-emerald-200',
    bentoInactiveIconBg: 'bg-emerald-50',
    bentoInactiveIconText: 'text-emerald-900',
    subPillActiveBg: 'bg-emerald-900 text-white',
    subPillActiveShadow: 'shadow-emerald-900/20',
    subPillInactiveBadgeBg: 'bg-emerald-100',
    subPillInactiveBadgeText: 'text-emerald-900',
    subPillInactiveBadgeBorder: 'border-emerald-200',
    bannerGradient: 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950',
    bannerBorder: 'border-emerald-700/50',
    radialGlow: 'from-emerald-400/25 via-teal-500/10 to-transparent',
    accentBadgeBg: 'bg-emerald-400',
    accentBadgeText: 'text-slate-950',
    primaryButtonBg: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950',
    primaryButtonText: 'text-slate-950',
    tagColor: 'text-emerald-200/80',
  },
  national_ruby: {
    id: 'national_ruby',
    name: 'National Crimson & Ruby',
    nameKh: 'ក្រហមទង់ជាតិ & ក្តារខៀនមាស',
    subtitle: 'រចនាបទក្រហមទង់ជាតិ ទទឹមមាស និងសោភ័ណភាពរដ្ឋបាលផ្លូវការ',
    icon: '🚩',
    previewGradient: 'from-rose-950 via-red-950 to-slate-950',
    dotColor: '#e11d48',
    accentColor: '#fb7185',
    headerGradient: 'bg-gradient-to-r from-rose-950 via-red-950 to-slate-950',
    headerBorder: 'border-rose-600/40',
    headerShadow: 'shadow-rose-950/30',
    headerSubtext: 'text-rose-200',
    bentoActiveGradient: 'bg-gradient-to-br from-rose-950 via-red-950 to-slate-950',
    bentoActiveRing: 'ring-rose-500/50',
    bentoActiveShadow: 'shadow-rose-950/30',
    bentoSubtext: 'text-rose-200',
    bentoActiveIconBg: 'bg-rose-400/20 text-rose-200',
    bentoInactiveIconBg: 'bg-rose-50',
    bentoInactiveIconText: 'text-rose-900',
    subPillActiveBg: 'bg-rose-900 text-white',
    subPillActiveShadow: 'shadow-rose-900/20',
    subPillInactiveBadgeBg: 'bg-rose-100',
    subPillInactiveBadgeText: 'text-rose-900',
    subPillInactiveBadgeBorder: 'border-rose-200',
    bannerGradient: 'bg-gradient-to-r from-rose-950 via-red-950 to-slate-900',
    bannerBorder: 'border-rose-700/50',
    radialGlow: 'from-amber-400/25 via-rose-500/10 to-transparent',
    accentBadgeBg: 'bg-amber-400',
    accentBadgeText: 'text-slate-950',
    primaryButtonBg: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
    primaryButtonText: 'text-slate-950',
    tagColor: 'text-rose-200/80',
  },
};

const STORAGE_KEY = 'primary_teacher_admin_banner_theme';

export function getSavedBannerTheme(): BannerThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as BannerThemeId;
    if (saved && BANNER_THEMES[saved]) {
      return saved;
    }
  } catch {}
  return 'royal_purple';
}

export function saveBannerTheme(themeId: BannerThemeId): void {
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {}
}
