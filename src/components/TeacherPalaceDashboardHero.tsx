import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Camera,
  CheckCircle2,
  Clock,
  RotateCcw,
  ChevronRight,
  Bell,
  Calendar,
} from 'lucide-react';
import { TeacherProfile } from '../types';
import { TeacherAvatar } from './TeacherAvatar';
import { TeacherPalaceDecorations } from './TeacherPalaceDecorations';
import { getTeacherNoticeFeed, TeacherNoticeFeed } from '../utils/teacherNoticeEngine';

interface TeacherPalaceDashboardHeroProps {
  teacher: TeacherProfile;
  currentYear?: string;
  onOpenProfile: () => void;
  onNavigateTab: (tab: string) => void;
  onShowToast?: (msg: string) => void;
  onOpenYearManager?: () => void;
  onOpenNotices?: () => void;
}

export type PalaceThemeKey = 'sunrise' | 'galaxy' | 'forest' | 'cyber' | 'ocean';

interface PalaceThemeConfig {
  id: PalaceThemeKey;
  name: string;
  icon: string;
  iconType: 'sunrise' | 'galaxy' | 'forest' | 'cyber' | 'ocean';
  bgGradient: string;
  outerBorder: string;
  dotColor: string;
  noticeBg: string;
  noticeBorder: string;
  cardBg: string;
  cardBorder: string;
  itemBg: string;
  itemBorder: string;
  btn1Bg: string;
  btn1Border: string;
  btn1Text: string;
  btn2Bg: string;
  btn2Border: string;
  btn2Text: string;
  btn3Bg: string;
  btn3Border: string;
  btn3Text: string;
  btn4Bg: string;
  btn4Border: string;
  btn4Text: string;
}

const PALACE_THEMES: Record<PalaceThemeKey, PalaceThemeConfig> = {
  sunrise: {
    id: 'sunrise',
    name: 'រស្មីថ្ងៃរះ & មាសរាជវាំងខ្មែរ',
    icon: '🌅',
    iconType: 'sunrise',
    bgGradient: 'bg-[#150702]',
    outerBorder: 'border-[#854d0e]',
    dotColor: '#78350f',
    noticeBg: 'bg-[#2a1005]',
    noticeBorder: 'border-[#78350f]',
    cardBg: 'bg-[#180903]',
    cardBorder: 'border-[#854d0e]',
    itemBg: 'bg-[#220d04]',
    itemBorder: 'border-[#78350f]',
    btn1Bg: 'bg-[#281105]',
    btn1Border: 'border-[#f59e0b]',
    btn1Text: 'text-[#fef08a]',
    btn2Bg: 'bg-[#2e1006]',
    btn2Border: 'border-[#f97316]',
    btn2Text: 'text-[#fed7aa]',
    btn3Bg: 'bg-[#310b17]',
    btn3Border: 'border-[#fbbf24]',
    btn3Text: 'text-[#fef08a]',
    btn4Bg: 'bg-[#240b28]',
    btn4Border: 'border-[#e879f9]',
    btn4Text: 'text-[#f5d0fe]',
  },
  galaxy: {
    id: 'galaxy',
    name: 'ទីអវកាស & រាត្រីកាល',
    icon: '🌌',
    iconType: 'galaxy',
    bgGradient: 'bg-[#080816]',
    outerBorder: 'border-[#581c87]',
    dotColor: '#3b0764',
    noticeBg: 'bg-[#140b2e]',
    noticeBorder: 'border-[#6b21a8]',
    cardBg: 'bg-[#0d0a21]',
    cardBorder: 'border-[#6b21a8]',
    itemBg: 'bg-[#151036]',
    itemBorder: 'border-[#4c1d95]',
    btn1Bg: 'bg-[#170e3b]',
    btn1Border: 'border-[#a855f7]',
    btn1Text: 'text-[#e9d5ff]',
    btn2Bg: 'bg-[#220f45]',
    btn2Border: 'border-[#c084fc]',
    btn2Text: 'text-[#f3e8ff]',
    btn3Bg: 'bg-[#2b0c3f]',
    btn3Border: 'border-[#f472b6]',
    btn3Text: 'text-[#fae8ff]',
    btn4Bg: 'bg-[#101b3b]',
    btn4Border: 'border-[#60a5fa]',
    btn4Text: 'text-[#dbeafe]',
  },
  forest: {
    id: 'forest',
    name: 'ធម្មជាតិ & ត្បូងមរកត',
    icon: '🌿',
    iconType: 'forest',
    bgGradient: 'bg-[#03130a]',
    outerBorder: 'border-[#065f46]',
    dotColor: '#064e3b',
    noticeBg: 'bg-[#062415]',
    noticeBorder: 'border-[#047857]',
    cardBg: 'bg-[#051a10]',
    cardBorder: 'border-[#059669]',
    itemBg: 'bg-[#092b1a]',
    itemBorder: 'border-[#047857]',
    btn1Bg: 'bg-[#082a1a]',
    btn1Border: 'border-[#10b981]',
    btn1Text: 'text-[#a7f3d0]',
    btn2Bg: 'bg-[#073022]',
    btn2Border: 'border-[#34d399]',
    btn2Text: 'text-[#6ee7b7]',
    btn3Bg: 'bg-[#0d2e2b]',
    btn3Border: 'border-[#2dd4bf]',
    btn3Text: 'text-[#99f6e4]',
    btn4Bg: 'bg-[#142e1b]',
    btn4Border: 'border-[#a3e635]',
    btn4Text: 'text-[#d9f99d]',
  },
  cyber: {
    id: 'cyber',
    name: 'ថាមពល & នីអុងឌីជីថល',
    icon: '⚡',
    iconType: 'cyber',
    bgGradient: 'bg-[#12081c]',
    outerBorder: 'border-[#a16207]',
    dotColor: '#713f12',
    noticeBg: 'bg-[#241238]',
    noticeBorder: 'border-[#ca8a04]',
    cardBg: 'bg-[#180c26]',
    cardBorder: 'border-[#eab308]',
    itemBg: 'bg-[#24133b]',
    itemBorder: 'border-[#854d0e]',
    btn1Bg: 'bg-[#291742]',
    btn1Border: 'border-[#eab308]',
    btn1Text: 'text-[#fef08a]',
    btn2Bg: 'bg-[#31164a]',
    btn2Border: 'border-[#f59e0b]',
    btn2Text: 'text-[#fde68a]',
    btn3Bg: 'bg-[#3d113e]',
    btn3Border: 'border-[#ec4899]',
    btn3Text: 'text-[#fbcfe8]',
    btn4Bg: 'bg-[#182046]',
    btn4Border: 'border-[#38bdf8]',
    btn4Text: 'text-[#bae6fd]',
  },
  ocean: {
    id: 'ocean',
    name: 'មហាសមុទ្រ & រលកខៀវស្រស់',
    icon: '🌊',
    iconType: 'ocean',
    bgGradient: 'bg-[#02101e]',
    outerBorder: 'border-[#0369a1]',
    dotColor: '#075985',
    noticeBg: 'bg-[#061d36]',
    noticeBorder: 'border-[#0284c7]',
    cardBg: 'bg-[#041527]',
    cardBorder: 'border-[#0ea5e9]',
    itemBg: 'bg-[#072545]',
    itemBorder: 'border-[#0369a1]',
    btn1Bg: 'bg-[#072442]',
    btn1Border: 'border-[#38bdf8]',
    btn1Text: 'text-[#bae6fd]',
    btn2Bg: 'bg-[#062c4f]',
    btn2Border: 'border-[#0284c7]',
    btn2Text: 'text-[#7dd3fc]',
    btn3Bg: 'bg-[#0b2447]',
    btn3Border: 'border-[#818cf8]',
    btn3Text: 'text-[#c7d2fe]',
    btn4Bg: 'bg-[#0c2f42]',
    btn4Border: 'border-[#2dd4bf]',
    btn4Text: 'text-[#99f6e4]',
  },
};

interface TeacherMission {
  id: string;
  title: string;
  targetCount: string;
  isCompleted: boolean;
  xp: number;
  statusLabel?: string;
  targetTab?: string;
}

export const TeacherPalaceDashboardHero: React.FC<TeacherPalaceDashboardHeroProps> = ({
  teacher,
  currentYear,
  onOpenProfile,
  onNavigateTab,
  onShowToast,
  onOpenYearManager,
  onOpenNotices,
}) => {
  // Live dynamic real-time teacher notice feed (holidays, MoEYS guidelines, time-of-day teaching duties)
  const [noticeFeed, setNoticeFeed] = useState<TeacherNoticeFeed>(() => getTeacherNoticeFeed(new Date()));

  useEffect(() => {
    const update = () => {
      setNoticeFeed(getTeacherNoticeFeed(new Date()));
    };
    update();
    const interval = setInterval(update, 30000); // Live updates every 30s
    return () => clearInterval(interval);
  }, []);

  // Current active theme (Default to 'sunrise' strictly matching IMG_4109.jpeg)
  const [selectedTheme, setSelectedTheme] = useState<PalaceThemeKey>(() => {
    return (localStorage.getItem('teacher_palace_theme') as PalaceThemeKey) || 'sunrise';
  });

  const [autoRotate, setAutoRotate] = useState<boolean>(() => {
    return localStorage.getItem('teacher_palace_auto_rotate') === 'true';
  });

  // Daily missions list strictly structured like IMG_4109.jpeg
  const [missions, setMissions] = useState<TeacherMission[]>(() => {
    const saved = localStorage.getItem('teacher_daily_missions_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'attendance',
        title: 'ស្រង់វត្តមាន Online យ៉ាងតិច ១ លើក (ព្រឹក/រសៀល)',
        targetCount: '0/1',
        isCompleted: false,
        xp: 300,
        targetTab: 'attendance',
      },
      {
        id: 'lesson_plan',
        title: 'ពិនិត្យកូនសៀវភៅកិច្ចតែងការបង្រៀនប្រចាំសប្តាហ៍',
        targetCount: '0/1',
        isCompleted: true,
        xp: 300,
        statusLabel: 'រួចរាល់',
        targetTab: 'admin',
      },
      {
        id: 'emis_stats',
        title: 'ស្រង់ និងផ្ទៀងផ្ទាត់ស្ថិតិអប់រំបឋម (EMIS សេចក្តីណែនាំ ៤២)',
        targetCount: '0/1',
        isCompleted: false,
        xp: 300,
        targetTab: 'admin',
      },
    ];
  });

  // Save theme
  const handleSelectTheme = (themeKey: PalaceThemeKey) => {
    setSelectedTheme(themeKey);
    localStorage.setItem('teacher_palace_theme', themeKey);
    onShowToast?.(`បានប្តូររូបរាងទៅជា ៖ ${PALACE_THEMES[themeKey].name}`);
  };

  // Toggle Auto rotate
  const toggleAutoRotate = () => {
    const nextVal = !autoRotate;
    setAutoRotate(nextVal);
    localStorage.setItem('teacher_palace_auto_rotate', String(nextVal));
    onShowToast?.(nextVal ? 'បានបើក Auto 30m ប្តូរពណ៌ស្វ័យប្រវត្តិ' : 'បានបិទ Auto 30m');
  };

  // Auto rotate timer effect
  useEffect(() => {
    if (!autoRotate) return;
    const themeKeys: PalaceThemeKey[] = ['sunrise', 'galaxy', 'forest', 'cyber', 'ocean'];
    const timer = setInterval(() => {
      setSelectedTheme((prev) => {
        const currentIndex = themeKeys.indexOf(prev);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        const nextTheme = themeKeys[nextIndex];
        localStorage.setItem('teacher_palace_theme', nextTheme);
        return nextTheme;
      });
    }, 30 * 60 * 1000); // 30 mins
    return () => clearInterval(timer);
  }, [autoRotate]);

  // Toggle mission completion
  const handleToggleMission = (missionId: string) => {
    setMissions((prev) => {
      const updated = prev.map((m) => {
        if (m.id === missionId) {
          const nextCompleted = !m.isCompleted;
          return {
            ...m,
            isCompleted: nextCompleted,
          };
        }
        return m;
      });
      localStorage.setItem('teacher_daily_missions_v2', JSON.stringify(updated));
      return updated;
    });

    onShowToast?.('បានធ្វើបច្ចុប្បន្នភាពបេសកកម្មប្រចាំថ្ងៃ!');
  };

  const themeConfig = PALACE_THEMES[selectedTheme];

  // Teacher name displayed with full Khmer typography
  const rawName = teacher?.name && teacher.name.trim() !== '' ? teacher.name : 'លោកគ្រូ ឌុក សុភ័ក្រ';
  const cleanTeacherName = rawName.startsWith('លោកគ្រូ') || rawName.startsWith('អ្នកគ្រូ')
    ? rawName
    : `លោកគ្រូ ${rawName}`;

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] sm:rounded-[36px] ${themeConfig.bgGradient} p-4 sm:p-7 md:p-8 border-2 ${themeConfig.outerBorder} shadow-2xl text-white transition-all duration-300`}
    >
      {/* Marquee Animation Keyframes */}
      <style>{`
        @keyframes palaceMarqueeRun {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-flow {
          display: flex;
          width: max-content;
          animation: palaceMarqueeRun 30s linear infinite;
        }
        .animate-marquee-flow:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Dynamic Animated Thematic Decorations (Floating particles, rotating SVGs, atmospheric glowing halos) */}
      <TeacherPalaceDecorations themeKey={selectedTheme} />

      {/* Background patterned decorative dots (Directly replicating the amber/gold grid in IMG_4109.jpeg) */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${themeConfig.dotColor} 1.8px, transparent 1.8px)`,
          backgroundSize: '22px 22px',
        }}
      />

      {/* MoEYS Logo Watermark Background */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 opacity-10 pointer-events-none rotate-12 transition-transform duration-1000 group-hover:scale-110">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_of_MoEYS_Cambodia.png/800px-Logo_of_MoEYS_Cambodia.png" alt="MoEYS Watermark" className="w-full h-full object-contain" />
      </div>

      <div className="relative z-10 space-y-4 sm:space-y-5">
        {/* ============================================================ */}
        {/* 1. TOP CONTROL RIBBON: Theme Name + Capsule Controller (Matches Student Hero Banner) */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 pt-0 pb-1">
          {/* Framed theme icon + name + MoEYS Logo */}
          <div className="inline-flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2a1005] border border-amber-500/60 p-0.5 flex items-center justify-center shadow-xs shrink-0">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_of_MoEYS_Cambodia.png/800px-Logo_of_MoEYS_Cambodia.png" alt="MoEYS" className="w-full h-full object-contain" />
            </div>
            <div className="w-7 h-7 rounded-lg bg-[#2a1005] border border-amber-500/60 p-0.5 flex items-center justify-center shadow-xs shrink-0">
              <span className="text-base select-none leading-none">{themeConfig.icon}</span>
            </div>
            <h2 className="font-moul text-xs sm:text-sm md:text-base text-white tracking-wide drop-shadow-sm select-none">
              {themeConfig.name}
            </h2>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/80 border border-white/15 hidden md:inline">
              {autoRotate ? '⏳ ប្តូរស្វ័យប្រវត្តក្នុង 30m' : '📌 ជាប់គាំងម៉ូដនេះ'}
            </span>
          </div>

          {/* Controller Pill */}
          <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 shadow-md">
            {/* Galaxy Night button */}
            <button
              type="button"
              onClick={() => handleSelectTheme('galaxy')}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer ${
                selectedTheme === 'galaxy'
                  ? 'bg-white text-slate-950 ring-2 ring-amber-400 shadow-md scale-105'
                  : 'hover:bg-white/10 opacity-70 hover:opacity-100'
              }`}
              title="ទីអវកាស & រាត្រីកាល"
            >
              <span>🌌</span>
            </button>

            {/* Forest Sprig button */}
            <button
              type="button"
              onClick={() => handleSelectTheme('forest')}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer ${
                selectedTheme === 'forest'
                  ? 'bg-white text-slate-950 ring-2 ring-amber-400 shadow-md scale-105'
                  : 'hover:bg-white/10 opacity-70 hover:opacity-100'
              }`}
              title="ធម្មជាតិ & ត្បូងមរកត"
            >
              <span>🌿</span>
            </button>

            {/* Cyber Lightning button */}
            <button
              type="button"
              onClick={() => handleSelectTheme('cyber')}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer ${
                selectedTheme === 'cyber'
                  ? 'bg-white text-slate-950 ring-2 ring-amber-400 shadow-md scale-105'
                  : 'hover:bg-white/10 opacity-70 hover:opacity-100'
              }`}
              title="ថាមពល & នីអុងឌីជីថល"
            >
              <span>⚡</span>
            </button>

            {/* Sunrise Palace button */}
            <button
              type="button"
              onClick={() => handleSelectTheme('sunrise')}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer ${
                selectedTheme === 'sunrise'
                  ? 'bg-white text-slate-950 ring-2 ring-amber-400 shadow-md scale-105'
                  : 'hover:bg-white/10 opacity-70 hover:opacity-100'
              }`}
              title="រស្មីថ្ងៃរះ & មាសរាជវាំងខ្មែរ"
            >
              <span>🌅</span>
            </button>

            {/* Ocean Wave button */}
            <button
              type="button"
              onClick={() => handleSelectTheme('ocean')}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer ${
                selectedTheme === 'ocean'
                  ? 'bg-white text-slate-950 ring-2 ring-amber-400 shadow-md scale-105'
                  : 'hover:bg-white/10 opacity-70 hover:opacity-100'
              }`}
              title="មហាសមុទ្រ & រលកខៀវស្រស់"
            >
              <span>🌊</span>
            </button>

            {/* Divider */}
            <div className="h-4 w-px bg-white/20 mx-0.5" />

            {/* Auto 30m pill */}
            <button
              type="button"
              onClick={toggleAutoRotate}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1 transition-all active:scale-95 shadow-sm cursor-pointer ${
                autoRotate
                  ? 'bg-[#facc15] text-[#3a1a02]'
                  : 'bg-[#facc15] text-[#3a1a02] hover:bg-[#fde047]'
              }`}
              title="ប្តូរពណ៌ស្វ័យប្រវត្តរៀងរាល់ 30 នាទី"
            >
              <Clock className="w-3 h-3" />
              <span>Auto 30m</span>
            </button>

            {/* Reset / Reload icon */}
            <button
              type="button"
              onClick={() => handleSelectTheme('sunrise')}
              className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition active:scale-95 cursor-pointer"
              title="កំណត់ទៅរស្មីថ្ងៃរះវិញ"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. FULL-WIDTH DYNAMIC NOTICE TICKER (សេចក្តីជូនដំណឹងផ្លូវការរត់តាមពេលវេលា & ប្រតិទិន) */}
        {/* ============================================================ */}
        <div
          onClick={onOpenNotices}
          className={`w-full rounded-full ${themeConfig.noticeBg} border ${themeConfig.noticeBorder} px-3.5 sm:px-4 py-2 flex items-center shadow-md overflow-hidden relative cursor-pointer hover:brightness-110 transition group`}
          title="ចុចដើម្បីបើកមើលការជូនដំណឹងផ្លូវការ និងប្រតិទិនឈប់សម្រាកលម្អិត"
        >
          {/* Quick Notice Tag on Left */}
          <div className="flex items-center gap-1.5 shrink-0 mr-3 pr-2.5 border-r border-amber-500/30 z-10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] shadow-[0_0_8px_#facc15] animate-pulse shrink-0 inline-block" />
            <span className="font-moul text-[#fde047] text-xs sm:text-sm whitespace-nowrap flex items-center gap-1">
              <span>🔔 ជូនដំណឹង ៖</span>
            </span>
          </div>

          <div className="w-full overflow-hidden relative">
            <div className="animate-marquee-flow flex items-center gap-10 whitespace-nowrap text-xs sm:text-sm font-semibold text-[#fef08a]">
              {/* Loop Chunk 1 */}
              <div className="flex items-center gap-8 shrink-0">
                {noticeFeed.tickerItems.map((item, idx) => (
                  <React.Fragment key={`chunk1-${item.id}-${idx}`}>
                    <span className="inline-flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md ${item.tagColor}`}>
                        {item.tag}
                      </span>
                      <span>{item.text}</span>
                    </span>
                    <span className="text-[#facc15] select-none font-bold">✦</span>
                  </React.Fragment>
                ))}
              </div>

              {/* Loop Chunk 2 (Duplicate for 100% seamless infinite scroll) */}
              <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
                {noticeFeed.tickerItems.map((item, idx) => (
                  <React.Fragment key={`chunk2-${item.id}-${idx}`}>
                    <span className="inline-flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md ${item.tagColor}`}>
                        {item.tag}
                      </span>
                      <span>{item.text}</span>
                    </span>
                    <span className="text-[#facc15] select-none font-bold">✦</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right Indicator Pill */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-amber-300 ml-2 shrink-0 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full border border-amber-400/30 z-10 group-hover:bg-amber-400 group-hover:text-slate-950 transition">
            <span>លម្អិត</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. MAIN BODY: LEFT DETAILS & RIGHT MISSION CARD (Matches Student Hero Banner in landscape & responsive mode) */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row landscape:flex-row md:items-center landscape:items-center justify-between gap-5 sm:gap-6">
          {/* Left Details Column: Greeting & Avatar + Subtitle + Action Buttons */}
          <div className="space-y-3.5 max-w-xl w-full min-w-0">
            {/* Greeting Heading & Teacher Avatar (Side-by-side with avatar badge, matching student design) */}
            <div className="flex items-center gap-3.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-moul tracking-wide leading-tight drop-shadow-md">
                សួស្តី {cleanTeacherName}
              </h1>

              <div
                onClick={onOpenProfile}
                className="relative cursor-pointer group shrink-0 active:scale-95 transition-transform"
                title="ចុចដើម្បីមើល ឬផ្លាស់ប្តូររូបភាព Profile គ្រូបង្រៀន"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-[#facc15] via-[#eab308] to-[#ca8a04] shadow-[0_0_15px_rgba(250,204,21,0.35)] group-hover:shadow-[0_0_20px_rgba(250,204,21,0.6)] group-hover:scale-105 transition-all">
                  <div className="w-full h-full rounded-[14px] bg-[#1a0802] overflow-hidden flex items-center justify-center text-white relative">
                    <TeacherAvatar avatar={teacher?.avatar} name={rawName} fallbackIcon="👨‍🏫" />
                  </div>
                </div>

                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#facc15] text-[#3a1a02] flex items-center justify-center shadow-md border border-[#150702] group-hover:scale-110 transition-transform">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </div>

            </div>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-[#fef3c7]/90 leading-relaxed font-medium">
              សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងរដ្ឋបាលគ្រូបឋមសិក្សា! ស្រង់វត្តមានសិស្ស កត់ត្រាកិច្ចតែងការ បញ្ចូលពិន្ទុ និងរៀបចំស្ថិតិ EMIS ដើម្បីប្រមូល XP និងសម្រួលការងារបង្រៀន!
            </p>

            {/* Four Administrative Quick Action Buttons (Horizontally scrollable swipeable capsules matching IMG_4133) */}
            <div className="relative -mx-2 px-2 sm:mx-0 sm:px-0">
              <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2.5 sm:gap-3 py-1 scroll-smooth touch-pan-x w-full">
                {/* Button 1: 🛡️ រដ្ឋបាលទាំង៤ (គ្រប់គ្រងការងាររដ្ឋបាល) */}
                <button
                  type="button"
                  onClick={() => onNavigateTab('admin')}
                  className={`shrink-0 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[16px] border-2 ${themeConfig.btn1Border} ${themeConfig.btn1Bg} hover:brightness-125 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 text-left cursor-pointer snap-start group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-white/5 to-transparent pointer-events-none" />
                  {/* Animated Shield/Admin Icon */}
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center animate-pulse">
                    <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]">
                      <path d="M18 4 L30 9 V18 C30 25, 22 32, 18 34 C14 32, 6 25, 6 18 V9 Z" fill="url(#adminGrad)" stroke="#60a5fa" strokeWidth="1" />
                      <path d="M12 18 L16 22 L24 14" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="adminGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1e3a8a" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="min-w-0 pr-0.5">
                    <strong className={`block text-[10px] sm:text-xs font-bold ${themeConfig.btn1Text} font-moul tracking-wide truncate leading-tight drop-shadow-xs`}>
                      រដ្ឋបាលទាំង៤
                    </strong>
                    <span className="text-[9px] sm:text-[10px] text-[#bfdbfe]/85 block truncate font-medium leading-tight mt-0.5">
                      គ្រប់គ្រងការងាររដ្ឋបាល
                    </span>
                  </div>
                </button>

                {/* Button 2: 📚 ប័ណ្ណាល័យ (ស្វែងរកសៀវភៅ និងធនធាន) */}
                <button
                  type="button"
                  onClick={() => onNavigateTab('library')}
                  className={`shrink-0 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[16px] border-2 ${themeConfig.btn2Border} ${themeConfig.btn2Bg} hover:brightness-125 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 text-left cursor-pointer snap-start group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-white/5 to-transparent pointer-events-none" />
                  {/* Animated Book Icon */}
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center animate-bounce">
                    <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]">
                      <path d="M6 8 H16 V28 H6 Z" fill="#ffffff" stroke="#c084fc" strokeWidth="0.8" />
                      <path d="M20 8 H30 V28 H20 Z" fill="#ffffff" stroke="#c084fc" strokeWidth="0.8" />
                      <path d="M16 8 L20 8 L20 28 L16 28 Z" fill="#a855f7" />
                      <path d="M8 12 H14 M8 16 H14 M22 12 H28 M22 16 H28" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="min-w-0 pr-0.5">
                    <strong className={`block text-[10px] sm:text-xs font-bold ${themeConfig.btn2Text} font-moul tracking-wide truncate leading-tight drop-shadow-xs`}>
                      ប័ណ្ណាល័យ
                    </strong>
                    <span className="text-[9px] sm:text-[10px] text-[#e9d5ff]/85 block truncate font-medium leading-tight mt-0.5">
                      សៀវភៅ និងធនធាន
                    </span>
                  </div>
                </button>

                {/* Button 3: 👥 សិស្ស (ព័ត៌មាន និងការគ្រប់គ្រងសិស្ស) */}
                <button
                  type="button"
                  onClick={() => onNavigateTab('student_portal')}
                  className={`shrink-0 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[16px] border-2 ${themeConfig.btn3Border} ${themeConfig.btn3Bg} hover:brightness-125 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 text-left cursor-pointer snap-start group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-white/5 to-transparent pointer-events-none" />
                  {/* Animated Users Icon */}
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center animate-pulse">
                    <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">
                      <circle cx="12" cy="12" r="6" fill="#10b981" />
                      <circle cx="24" cy="12" r="6" fill="#10b981" />
                      <path d="M6 32 C6 24, 18 24, 18 32 Z" fill="#10b981" />
                      <path d="M18 32 C18 24, 30 24, 30 32 Z" fill="#059669" />
                    </svg>
                  </div>
                  <div className="min-w-0 pr-0.5">
                    <strong className={`block text-[10px] sm:text-xs font-bold ${themeConfig.btn3Text} font-moul tracking-wide truncate leading-tight drop-shadow-xs`}>
                      សិស្ស
                    </strong>
                    <span className="text-[9px] sm:text-[10px] text-[#a7f3d0]/85 block truncate font-medium leading-tight mt-0.5">
                      គ្រប់គ្រងព័ត៌មានសិស្ស
                    </span>
                  </div>
                </button>

                {/* Button 4: 🎮 ល្បែងសិក្សា (រៀនតាមរយៈការលេង) */}
                <button
                  type="button"
                  onClick={() => onNavigateTab('games')}
                  className={`shrink-0 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[16px] border-2 ${themeConfig.btn4Border} ${themeConfig.btn4Bg} hover:brightness-125 hover:shadow-[0_0_10px_rgba(244,63,94,0.3)] transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 text-left cursor-pointer snap-start group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400/5 via-white/5 to-transparent pointer-events-none" />
                  {/* Animated Gamepad Icon */}
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center animate-spin-slow">
                    <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]">
                      <path d="M4 18 C4 12, 10 8, 18 8 C26 8, 32 12, 32 18 C32 24, 26 28, 18 28 C10 28, 4 24, 4 18 Z" fill="#f43f5e" />
                      <circle cx="24" cy="18" r="3" fill="#ffffff" />
                      <rect x="8" y="16" width="6" height="4" rx="2" fill="#ffffff" />
                    </svg>
                  </div>
                  <div className="min-w-0 pr-0.5">
                    <strong className={`block text-[10px] sm:text-xs font-bold ${themeConfig.btn4Text} font-moul tracking-wide truncate leading-tight drop-shadow-xs`}>
                      ល្បែងសិក្សា
                    </strong>
                    <span className="text-[9px] sm:text-[10px] text-[#fda4af]/85 block truncate font-medium leading-tight mt-0.5">
                      រៀនតាមរយៈការលេង
                    </span>
                  </div>
                </button>

              </div>
            </div>
          </div>

          {/* Right Column: Mission Card (បេសកកម្មថ្ងៃនេះ ៖ +900 XP, matches student quest card) */}
          <div
            className={`rounded-[28px] ${themeConfig.cardBg} border-2 ${themeConfig.cardBorder} p-4 sm:p-5 shadow-2xl space-y-3 max-w-sm w-full shrink-0`}
          >
            {/* Card Header: Target Icon + Title + XP Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl text-[#fef08a] select-none leading-none">
                  ◎
                </span>
                <h3 className="font-moul text-xs sm:text-sm text-[#fef08a] tracking-wide select-none">
                  បេសកកម្មថ្ងៃនេះ ៖
                </h3>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 text-[#3a1a02] font-black text-xs tracking-wider shadow-[0_0_12px_rgba(250,204,21,0.5)] inline-flex items-center gap-1 select-none animate-pulse">
                  <span>✨</span> +900 XP
                </span>
              </div>

            </div>

            {/* Mission Checklist Rows */}
            <div className="space-y-2">
              {missions.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-2.5 ${
                    themeConfig.itemBg
                  } ${themeConfig.itemBorder} hover:brightness-110`}
                >
                  {/* Left: Circle checkbox + Task Title */}
                  <div
                    onClick={() => handleToggleMission(m.id)}
                    className="flex items-center gap-2.5 flex-1 cursor-pointer select-none min-w-0"
                  >
                    <div className="shrink-0">
                      {m.isCompleted ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-amber-400/80 flex items-center justify-center text-amber-300">
                          <span className="text-[9px] leading-none opacity-60">✓</span>
                        </div>
                      )}
                    </div>

                    <span
                      className={`text-xs font-semibold truncate ${
                        m.isCompleted
                          ? 'text-[#fef3c7]/80 line-through'
                          : 'text-[#fef3c7]'
                      }`}
                    >
                      {m.title}
                    </span>
                  </div>

                  {/* Right: Badge / Status */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {m.isCompleted ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#022c22] border border-[#059669] text-[#34d399] text-[10px] font-bold shadow-xs">
                        រួចរាល់
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#fef08a] px-1.5 py-0.5">
                        {m.targetCount}
                      </span>
                    )}

                    {/* Quick navigation link */}
                    {m.targetTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateTab(m.targetTab!)}
                        className="p-1 rounded-lg hover:bg-white/10 text-[#fef08a]/70 hover:text-white transition cursor-pointer"
                        title="ចូលទៅកាន់ផ្នែកនេះ"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPalaceDashboardHero;
