import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera,
  Target,
  CheckCircle2,
  Sparkles,
  Clock,
  RotateCcw,
  Palette,
  Flame,
  Star,
  ChevronRight,
  Sun,
  Moon,
  Compass,
  Zap,
  Waves,
  Trees,
} from 'lucide-react';
import { Student } from '../types';

export interface StudentHeroBannerProps {
  currentStudent: Student;
  selectedAvatar: string;
  isImageAvatar: (avatar: string) => boolean;
  setShowProfileModal: (show: boolean) => void;
  myAttempts: any[];
  playStudentSound: (sound: string, muted: boolean) => void;
  soundMuted: boolean;
  setShowFishingGame: (show: boolean) => void;
  setShowVijjaNavaGame: (show: boolean) => void;
  setShowEnglishGame: (show: boolean) => void;
}

export interface BannerTheme {
  id: number;
  nameKhmer: string;
  subtitleKhmer: string;
  icon: React.ReactNode;
  accentEmoji: string;
  // Container styling
  bgClass: string;
  borderClass: string;
  patternType: 'stardust' | 'foliage' | 'cyber' | 'sunset' | 'waves';
  orbColor1: string;
  orbColor2: string;
  // Badge styling
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  badgeDot: string;
  // Avatar ring styling
  avatarRing: string;
  avatarShadow: string;
  cameraBg: string;
  // Title & description styling
  titleColor: string;
  descriptionColor: string;
  // Action game buttons styling
  fishingBtn: string;
  boatBtn: string;
  englishBtn: string;
  // Quest card styling
  questCardBg: string;
  questCardBorder: string;
  questTitleColor: string;
  questTargetIconColor: string;
  questXpBadge: string;
  questRowBg: string;
  questRowBorder: string;
  questRowText: string;
  questCounterBg: string;
  questCounterText: string;
  questDoneBg: string;
  questDoneText: string;
}

const BANNER_THEMES: BannerTheme[] = [
  {
    id: 0,
    nameKhmer: 'រាត្រីកាឡាក់ស៊ី & ស្វាយរាជវង្ស',
    subtitleKhmer: 'Cosmic Amethyst & Starlight',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    accentEmoji: '🌌',
    bgClass: 'bg-gradient-to-br from-[#240443] via-[#140226] to-[#090114]',
    borderClass: 'border-b border-purple-500/35',
    patternType: 'stardust',
    orbColor1: 'bg-purple-600/25',
    orbColor2: 'bg-fuchsia-500/20',
    badgeBg: 'bg-purple-950/80 backdrop-blur-md',
    badgeBorder: 'border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    badgeText: 'text-amber-300',
    badgeDot: 'bg-amber-400',
    avatarRing: 'from-amber-400 via-fuchsia-500 to-indigo-500',
    avatarShadow: 'shadow-[0_0_24px_rgba(217,70,239,0.45)]',
    cameraBg: 'bg-amber-400 text-slate-950',
    titleColor: 'text-white drop-shadow-[0_2px_12px_rgba(168,85,247,0.4)]',
    descriptionColor: 'text-purple-200/90',
    fishingBtn:
      'bg-sky-500/20 hover:bg-sky-500/35 border-sky-400/50 text-sky-200 hover:text-white shadow-[0_2px_10px_rgba(56,189,248,0.15)]',
    boatBtn:
      'bg-indigo-500/25 hover:bg-indigo-500/40 border-indigo-400/50 text-indigo-200 hover:text-white shadow-[0_2px_10px_rgba(129,140,248,0.15)]',
    englishBtn:
      'bg-fuchsia-500/20 hover:bg-fuchsia-500/35 border-fuchsia-400/50 text-fuchsia-200 hover:text-white shadow-[0_2px_10px_rgba(232,121,249,0.15)]',
    questCardBg: 'bg-[#18042b]/85 backdrop-blur-xl',
    questCardBorder: 'border-purple-400/40 shadow-[0_12px_40px_rgba(147,51,234,0.3)]',
    questTitleColor: 'text-amber-300',
    questTargetIconColor: 'text-amber-400',
    questXpBadge: 'bg-amber-400/25 border-amber-400/60 text-amber-300',
    questRowBg: 'bg-purple-950/70',
    questRowBorder: 'border-purple-500/35',
    questRowText: 'text-purple-100',
    questCounterBg: 'bg-purple-900/90',
    questCounterText: 'text-amber-300',
    questDoneBg: 'bg-emerald-950/90 border border-emerald-500/40',
    questDoneText: 'text-emerald-300',
  },
  {
    id: 1,
    nameKhmer: 'ត្បូងមរកត & ព្រៃសិល្បៈធម្មជាតិ',
    subtitleKhmer: 'Royal Emerald & Forest Wisdom',
    icon: <Trees className="w-3.5 h-3.5" />,
    accentEmoji: '🌿',
    bgClass: 'bg-gradient-to-br from-[#062c1d] via-[#031d13] to-[#010e08]',
    borderClass: 'border-b border-emerald-500/35',
    patternType: 'foliage',
    orbColor1: 'bg-emerald-500/25',
    orbColor2: 'bg-teal-500/20',
    badgeBg: 'bg-emerald-950/85 backdrop-blur-md',
    badgeBorder: 'border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    badgeText: 'text-emerald-200',
    badgeDot: 'bg-emerald-400',
    avatarRing: 'from-emerald-300 via-teal-400 to-amber-300',
    avatarShadow: 'shadow-[0_0_24px_rgba(16,185,129,0.45)]',
    cameraBg: 'bg-emerald-400 text-slate-950',
    titleColor: 'text-white drop-shadow-[0_2px_12px_rgba(16,185,129,0.4)]',
    descriptionColor: 'text-emerald-100/90',
    fishingBtn:
      'bg-teal-500/20 hover:bg-teal-500/35 border-teal-400/50 text-teal-200 hover:text-white shadow-[0_2px_10px_rgba(45,212,191,0.15)]',
    boatBtn:
      'bg-emerald-500/25 hover:bg-emerald-500/40 border-emerald-400/50 text-emerald-200 hover:text-white shadow-[0_2px_10px_rgba(52,211,153,0.15)]',
    englishBtn:
      'bg-amber-500/20 hover:bg-amber-500/35 border-amber-400/50 text-amber-200 hover:text-white shadow-[0_2px_10px_rgba(251,191,36,0.15)]',
    questCardBg: 'bg-[#032014]/85 backdrop-blur-xl',
    questCardBorder: 'border-emerald-400/40 shadow-[0_12px_40px_rgba(5,150,105,0.3)]',
    questTitleColor: 'text-emerald-300',
    questTargetIconColor: 'text-emerald-400',
    questXpBadge: 'bg-emerald-400/25 border-emerald-300/60 text-emerald-300',
    questRowBg: 'bg-emerald-950/70',
    questRowBorder: 'border-emerald-500/35',
    questRowText: 'text-emerald-100',
    questCounterBg: 'bg-emerald-900/90',
    questCounterText: 'text-amber-300',
    questDoneBg: 'bg-teal-950/90 border border-teal-500/40',
    questDoneText: 'text-teal-300',
  },
  {
    id: 2,
    nameKhmer: 'បច្ចេកវិទ្យាអនាគត & សាយប័រ',
    subtitleKhmer: 'Cyber Neon & Future Tech',
    icon: <Zap className="w-3.5 h-3.5" />,
    accentEmoji: '⚡',
    bgClass: 'bg-gradient-to-br from-[#08152e] via-[#040d1e] to-[#01050e]',
    borderClass: 'border-b border-cyan-500/40',
    patternType: 'cyber',
    orbColor1: 'bg-cyan-500/25',
    orbColor2: 'bg-blue-600/25',
    badgeBg: 'bg-cyan-950/85 backdrop-blur-md',
    badgeBorder: 'border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    badgeText: 'text-cyan-200',
    badgeDot: 'bg-cyan-400',
    avatarRing: 'from-cyan-400 via-blue-500 to-indigo-400',
    avatarShadow: 'shadow-[0_0_24px_rgba(6,182,212,0.5)]',
    cameraBg: 'bg-cyan-400 text-slate-950',
    titleColor: 'text-white drop-shadow-[0_2px_12px_rgba(6,182,212,0.4)]',
    descriptionColor: 'text-cyan-100/90',
    fishingBtn:
      'bg-cyan-500/20 hover:bg-cyan-500/35 border-cyan-400/50 text-cyan-200 hover:text-white shadow-[0_2px_10px_rgba(6,182,212,0.15)]',
    boatBtn:
      'bg-blue-600/25 hover:bg-blue-600/40 border-blue-400/50 text-blue-200 hover:text-white shadow-[0_2px_10px_rgba(96,165,250,0.15)]',
    englishBtn:
      'bg-rose-500/20 hover:bg-rose-500/35 border-rose-400/50 text-rose-200 hover:text-white shadow-[0_2px_10px_rgba(244,63,94,0.15)]',
    questCardBg: 'bg-[#051327]/85 backdrop-blur-xl',
    questCardBorder: 'border-cyan-400/40 shadow-[0_12px_40px_rgba(14,165,233,0.3)]',
    questTitleColor: 'text-cyan-300',
    questTargetIconColor: 'text-cyan-400',
    questXpBadge: 'bg-cyan-400/25 border-cyan-300/70 text-cyan-300',
    questRowBg: 'bg-[#061c36]/75',
    questRowBorder: 'border-cyan-500/35',
    questRowText: 'text-cyan-100',
    questCounterBg: 'bg-cyan-950/90',
    questCounterText: 'text-amber-300',
    questDoneBg: 'bg-emerald-950/90 border border-emerald-500/40',
    questDoneText: 'text-emerald-300',
  },
  {
    id: 3,
    nameKhmer: 'រស្មីថ្ងៃរះ & មាសរាជវាំងខ្មែរ',
    subtitleKhmer: 'Sunset Amber & Royal Khmer Gold',
    icon: <Sun className="w-3.5 h-3.5" />,
    accentEmoji: '🌅',
    bgClass: 'bg-gradient-to-br from-[#3b1208] via-[#240905] to-[#120302]',
    borderClass: 'border-b border-amber-500/40',
    patternType: 'sunset',
    orbColor1: 'bg-amber-500/25',
    orbColor2: 'bg-rose-600/20',
    badgeBg: 'bg-amber-950/85 backdrop-blur-md',
    badgeBorder: 'border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    badgeText: 'text-amber-200',
    badgeDot: 'bg-amber-400',
    avatarRing: 'from-yellow-300 via-amber-500 to-rose-500',
    avatarShadow: 'shadow-[0_0_24px_rgba(245,158,11,0.45)]',
    cameraBg: 'bg-amber-400 text-slate-950',
    titleColor: 'text-white drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)]',
    descriptionColor: 'text-amber-100/90',
    fishingBtn:
      'bg-amber-500/20 hover:bg-amber-500/35 border-amber-400/50 text-amber-200 hover:text-white shadow-[0_2px_10px_rgba(245,158,11,0.15)]',
    boatBtn:
      'bg-orange-500/25 hover:bg-orange-500/40 border-orange-400/50 text-orange-200 hover:text-white shadow-[0_2px_10px_rgba(249,115,22,0.15)]',
    englishBtn:
      'bg-rose-500/20 hover:bg-rose-500/35 border-rose-400/50 text-rose-200 hover:text-white shadow-[0_2px_10px_rgba(244,63,94,0.15)]',
    questCardBg: 'bg-[#260c06]/85 backdrop-blur-xl',
    questCardBorder: 'border-amber-400/40 shadow-[0_12px_40px_rgba(217,119,6,0.3)]',
    questTitleColor: 'text-yellow-300',
    questTargetIconColor: 'text-amber-400',
    questXpBadge: 'bg-amber-400/30 border-amber-300/70 text-yellow-300',
    questRowBg: 'bg-amber-950/70',
    questRowBorder: 'border-amber-500/35',
    questRowText: 'text-amber-100',
    questCounterBg: 'bg-[#3b1207]/90',
    questCounterText: 'text-yellow-300',
    questDoneBg: 'bg-emerald-950/90 border border-emerald-500/40',
    questDoneText: 'text-emerald-300',
  },
  {
    id: 4,
    nameKhmer: 'មហាសមុទ្រជ្រៅ & គុជខ្យង',
    subtitleKhmer: 'Deep Ocean & Atlantis Pearls',
    icon: <Waves className="w-3.5 h-3.5" />,
    accentEmoji: '🌊',
    bgClass: 'bg-gradient-to-br from-[#032338] via-[#021524] to-[#010a12]',
    borderClass: 'border-b border-teal-500/35',
    patternType: 'waves',
    orbColor1: 'bg-teal-500/25',
    orbColor2: 'bg-cyan-500/20',
    badgeBg: 'bg-teal-950/85 backdrop-blur-md',
    badgeBorder: 'border-teal-400/50 shadow-[0_0_15px_rgba(20,184,166,0.25)]',
    badgeText: 'text-teal-200',
    badgeDot: 'bg-teal-400',
    avatarRing: 'from-teal-300 via-cyan-400 to-sky-500',
    avatarShadow: 'shadow-[0_0_24px_rgba(45,212,191,0.45)]',
    cameraBg: 'bg-teal-400 text-slate-950',
    titleColor: 'text-white drop-shadow-[0_2px_12px_rgba(20,184,166,0.4)]',
    descriptionColor: 'text-teal-100/90',
    fishingBtn:
      'bg-teal-500/20 hover:bg-teal-500/35 border-teal-400/50 text-teal-200 hover:text-white shadow-[0_2px_10px_rgba(20,184,166,0.15)]',
    boatBtn:
      'bg-sky-500/25 hover:bg-sky-500/40 border-sky-400/50 text-sky-200 hover:text-white shadow-[0_2px_10px_rgba(56,189,248,0.15)]',
    englishBtn:
      'bg-indigo-500/20 hover:bg-indigo-500/35 border-indigo-400/50 text-indigo-200 hover:text-white shadow-[0_2px_10px_rgba(99,102,241,0.15)]',
    questCardBg: 'bg-[#021a2c]/85 backdrop-blur-xl',
    questCardBorder: 'border-teal-400/40 shadow-[0_12px_40px_rgba(13,148,136,0.3)]',
    questTitleColor: 'text-teal-300',
    questTargetIconColor: 'text-teal-400',
    questXpBadge: 'bg-teal-400/25 border-teal-300/60 text-teal-300',
    questRowBg: 'bg-teal-950/70',
    questRowBorder: 'border-teal-500/35',
    questRowText: 'text-teal-100',
    questCounterBg: 'bg-teal-900/90',
    questCounterText: 'text-amber-300',
    questDoneBg: 'bg-emerald-950/90 border border-emerald-500/40',
    questDoneText: 'text-emerald-300',
  },
];

export const StudentHeroBanner: React.FC<StudentHeroBannerProps> = ({
  currentStudent,
  selectedAvatar,
  isImageAvatar,
  setShowProfileModal,
  myAttempts,
  playStudentSound,
  soundMuted,
  setShowFishingGame,
  setShowVijjaNavaGame,
  setShowEnglishGame,
}) => {
  // Theme Selection Mode: 'auto' (rotates every 30 mins) or manual theme id (0..4)
  const [selectedMode, setSelectedMode] = useState<string>(() => {
    return localStorage.getItem('student_banner_theme_mode') || 'auto';
  });

  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [showThemePicker, setShowThemePicker] = useState<boolean>(false);

  // Update clock every 10 seconds to detect 30-minute block changes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // 30-minute interval calculation:
  // Math.floor(timestamp / (30 * 60 * 1000))
  const thirtyMinSlot = Math.floor(currentTime / (30 * 60 * 1000));
  const autoThemeIndex = thirtyMinSlot % BANNER_THEMES.length;

  // Remaining minutes in the current 30-minute block
  const msInCurrentSlot = currentTime % (30 * 60 * 1000);
  const msRemaining = 30 * 60 * 1000 - msInCurrentSlot;
  const minutesRemaining = Math.ceil(msRemaining / (60 * 1000));

  // Determine active theme index
  const activeThemeIndex = useMemo(() => {
    if (selectedMode === 'auto') {
      return autoThemeIndex;
    }
    const parsed = parseInt(selectedMode, 10);
    return isNaN(parsed) || parsed < 0 || parsed >= BANNER_THEMES.length ? 0 : parsed;
  }, [selectedMode, autoThemeIndex]);

  const activeTheme = BANNER_THEMES[activeThemeIndex];

  const handleSelectTheme = (mode: string) => {
    playStudentSound('click', soundMuted);
    setSelectedMode(mode);
    localStorage.setItem('student_banner_theme_mode', mode);
  };

  const handleCycleNext = () => {
    playStudentSound('click', soundMuted);
    const next = (activeThemeIndex + 1) % BANNER_THEMES.length;
    handleSelectTheme(String(next));
  };

  return (
    <div
      className={`text-white px-4 sm:px-8 py-7 sm:py-9 shadow-2xl relative overflow-hidden transition-all duration-700 ease-in-out ${activeTheme.bgClass} ${activeTheme.borderClass}`}
    >
      {/* Background Graphic Pattern Layers based on Theme */}
      {activeTheme.patternType === 'stardust' && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(rgba(216, 180, 254, 0.45) 1.5px, transparent 1.5px)`,
            backgroundSize: '18px 18px',
          }}
        />
      )}

      {activeTheme.patternType === 'foliage' && (
        <div
          className="absolute inset-0 opacity-15 pointer-events-none transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(rgba(52, 211, 153, 0.4) 1.2px, transparent 1.2px)`,
            backgroundSize: '20px 20px',
          }}
        />
      )}

      {activeTheme.patternType === 'cyber' && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
      )}

      {activeTheme.patternType === 'sunset' && (
        <div
          className="absolute inset-0 opacity-15 pointer-events-none transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(rgba(251, 191, 36, 0.35) 1.5px, transparent 1.5px)`,
            backgroundSize: '22px 22px',
          }}
        />
      )}

      {activeTheme.patternType === 'waves' && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(rgba(45, 212, 191, 0.35) 1.5px, transparent 1.5px)`,
            backgroundSize: '20px 20px',
          }}
        />
      )}

      {/* Atmospheric Luminous Orbs */}
      <div
        className={`absolute top-0 right-0 w-96 h-96 ${activeTheme.orbColor1} rounded-full blur-3xl pointer-events-none transition-colors duration-700`}
      />
      <div
        className={`absolute bottom-0 left-0 w-80 h-80 ${activeTheme.orbColor2} rounded-full blur-3xl pointer-events-none transition-colors duration-700`}
      />

      <div className="max-w-6xl mx-auto space-y-4 relative z-10">
        {/* Top Control Ribbon: 30-min Auto Status, 5 Theme Mini-Pills, and Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-0 pb-1">
          <div className="inline-flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold text-white/70 flex items-center gap-1 font-moul">
              {activeTheme.accentEmoji} {activeTheme.nameKhmer}
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/80 border border-white/15 hidden md:inline">
              {selectedMode === 'auto' ? `⏳ ប្តូរស្វ័យប្រវត្តក្នុង ${minutesRemaining} នាទី` : '📌 ជាប់គាំងម៉ូដនេះ'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick 5 Themes Mini Dots / Selector */}
            <div className="flex items-center bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/15 gap-1">
              {BANNER_THEMES.map((th) => {
                const isActive = activeThemeIndex === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => handleSelectTheme(String(th.id))}
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-md font-black scale-105'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    title={`ម៉ូដ ${th.id + 1}៖ ${th.nameKhmer}`}
                  >
                    <span>{th.accentEmoji}</span>
                    <span className="hidden sm:inline text-[9px]">ម៉ូដ {th.id + 1}</span>
                  </button>
                );
              })}

              <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

              <button
                onClick={() => handleSelectTheme('auto')}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  selectedMode === 'auto'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title="ប្តូរការរចនាស្វ័យប្រវត្តរៀងរាល់ ៣០ នាទីម្តង"
              >
                <Clock className="w-3 h-3" />
                <span className="text-[9px] font-bold">Auto 30m</span>
              </button>

              <button
                onClick={handleCycleNext}
                className="p-1 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition cursor-pointer"
                title="សាកល្បងម៉ូដបន្ទាប់ (Next Design)"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Banner Content: Left Details & Right Daily Quest Box */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-xl w-full min-w-0">
            {/* Top Announcement Marquee Badge */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-500 w-full overflow-hidden ${activeTheme.badgeBg} ${activeTheme.badgeBorder} ${activeTheme.badgeText}`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${activeTheme.badgeDot}`} />
              <div className="flex-1 overflow-hidden whitespace-nowrap">
                <div className="inline-block animate-custom-marquee pl-[100%]">
                  សេចក្តីជូនដំណឹងពីលោកគ្រូ អ្នកគ្រូ៖ សូមប្អូនៗទាំងអស់ខិតខំរៀនសូត្រ និងចូលរួមធ្វើតេស្តឱ្យបានគ្រប់ៗគ្នា។ សូមជូនពរឱ្យប្អូនៗទទួលបាននិទ្ទេសល្អ!
                </div>
              </div>
            </div>

            {/* Greeting Heading & Student Avatar */}
            <div className="flex items-center gap-3.5 flex-wrap">
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-black font-moul tracking-wide leading-tight transition-colors duration-500 ${activeTheme.titleColor}`}
              >
                សួស្ដី {currentStudent.name}
              </h2>

              <div
                onClick={() => {
                  playStudentSound('click', soundMuted);
                  setShowProfileModal(true);
                }}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl p-0.5 bg-gradient-to-tr transition-all duration-500 cursor-pointer hover:scale-110 shrink-0 relative group ${activeTheme.avatarRing} ${activeTheme.avatarShadow}`}
                title="ចុចដើម្បីមើល ឬកែប្រែរូបថត និងព័ត៌មានផ្ទាល់ខ្លួន"
              >
                <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center text-white">
                  {selectedAvatar && isImageAvatar(selectedAvatar) ? (
                    <img
                      src={selectedAvatar}
                      alt={currentStudent.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-2xl">{selectedAvatar || (currentStudent.gender === 'F' ? '👧' : '👦')}</span>
                  )}
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 rounded-full p-1 shadow-md group-hover:scale-110 transition ${activeTheme.cameraBg}`}
                >
                  <Camera className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>

            {/* Subtitle Description */}
            <p
              className={`text-xs sm:text-sm leading-relaxed font-medium transition-colors duration-500 ${activeTheme.descriptionColor}`}
            >
              សូមស្វាគមន៍មកកាន់មជ្ឈមណ្ឌលសិក្សាថ្នាក់ទី៦! ធ្វើតេស្ត ប្រឡង Online និងលេងល្បែងអប់រំដើម្បីប្រមូល XP
              និងដំឡើងកម្រិត Level របស់អ្នក!
            </p>

            {/* Quick Mini Games Shortcuts Bar (Matching uploaded photo) */}
            <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2.5 pt-1 pb-3 scroll-smooth touch-pan-x w-full">
                <button
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setShowFishingGame(true);
                  }}
                  className={`shrink-0 px-4 py-2.5 border rounded-2xl text-[13px] font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer snap-start ${activeTheme.fishingBtn}`}
                >
                  <span className="text-lg">🎣</span>
                  <span>ស្ទូចត្រីចំនេះដឹង</span>
                </button>

                <button
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setShowVijjaNavaGame(true);
                  }}
                  className={`shrink-0 px-4 py-2.5 border rounded-2xl text-[13px] font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer snap-start ${activeTheme.boatBtn}`}
                >
                  <span className="text-lg">⛵</span>
                  <span>នាវាវិជ្ជា</span>
                </button>

                <button
                  onClick={() => {
                    playStudentSound('click', soundMuted);
                    setShowEnglishGame(true);
                  }}
                  className={`shrink-0 px-4 py-2.5 border rounded-2xl text-[13px] font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer snap-start ${activeTheme.englishBtn}`}
                >
                  <span className="font-mono bg-white/20 text-[11px] px-1.5 py-0.5 rounded-md leading-none">abc</span>
                  <span>English Challenge</span>
                </button>
              </div>
            </div>
          </div>

          {/* Daily Quest Card (Gamified Quests matching uploaded photo) */}
          <div
            className={`rounded-[28px] p-5 border text-xs space-y-3.5 max-w-sm w-full transition-all duration-500 ${activeTheme.questCardBg} ${activeTheme.questCardBorder}`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-bold flex items-center gap-1.5 font-moul text-sm ${activeTheme.questTitleColor}`}
              >
                <Target className={`w-4 h-4 ${activeTheme.questTargetIconColor}`} />
                <span>បេសកកម្មថ្ងៃនេះ</span>
              </span>
              <span
                className={`border px-2.5 py-0.5 rounded-full font-black text-[10px] transition-colors duration-500 ${activeTheme.questXpBadge}`}
              >
                +900 XP
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Quest item 1: Online Exam */}
              <div
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-500 ${activeTheme.questRowBg} ${activeTheme.questRowBorder}`}
              >
                <span className={`flex items-center gap-2 font-medium ${activeTheme.questRowText}`}>
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${myAttempts.length > 0 ? 'text-emerald-400' : 'text-slate-400'}`}
                  />
                  <span className="text-[11.5px] leading-snug">ធ្វើតេស្ត Online យ៉ាងតិច ១ មុខវិជ្ជា</span>
                </span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-lg text-[11px] shrink-0 font-mono ${activeTheme.questCounterBg} ${activeTheme.questCounterText}`}
                >
                  {myAttempts.length > 0 ? '១/១' : '០/១'}
                </span>
              </div>

              {/* Quest item 2: Math formula review */}
              <div
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-500 ${activeTheme.questRowBg} ${activeTheme.questRowBorder}`}
              >
                <span className={`flex items-center gap-2 font-medium ${activeTheme.questRowText}`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11.5px] leading-snug">ពិនិត្យកូនសៀវភៅរូបមន្តគណិត</span>
                </span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-lg text-[11px] shrink-0 ${activeTheme.questDoneBg} ${activeTheme.questDoneText}`}
                >
                  រួចរាល់
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHeroBanner;
