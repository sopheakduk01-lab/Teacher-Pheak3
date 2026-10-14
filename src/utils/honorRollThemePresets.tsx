import React from 'react';
import { getGradeClassification } from './gradeManager';
import { toKhmerNum } from './khmerDate';

export type HonorRollThemeId = 'month_emerald' | 'semester_ruby' | 'annual_gold' | 'classic_navy';

export interface HonorRollThemeConfig {
  id: HonorRollThemeId;
  nameKh: string;
  subtitleKh: string;
  badgeLabel: string;
  badgeIcon: string;
  primaryHex: string;
  accentGoldHex: string;
  secondaryHex: string;
  frameOuterBorder: string;
  frameInnerBorder: string;
  headerTitleColor: string;
  headerTitleClass: string;
  headerSubtextColor: string;
  watermarkOpacity: number;
  previewColor: string;
}

export const HONOR_ROLL_THEMES: Record<HonorRollThemeId, HonorRollThemeConfig> = {
  month_emerald: {
    id: 'month_emerald',
    nameKh: 'រចនាបថមរកត & ក្បាច់មាស (ប្រចាំខែ)',
    subtitleKh: 'ពណ៌បៃតងត្បូងមរកត ស័ក្តិសមសម្រាប់តារាងកិត្តិយសប្រចាំខែ ស្រស់ថ្លា និងប្រកបដោយភាពរីកចម្រើន',
    badgeLabel: 'ប្រចាំខែ • MONTHLY',
    badgeIcon: '🌿',
    primaryHex: '#065f46', // Deep Emerald
    accentGoldHex: '#d97706', // Royal Gold
    secondaryHex: '#047857',
    frameOuterBorder: '#064e3b',
    frameInnerBorder: '#d97706',
    headerTitleColor: '#065f46',
    headerTitleClass: 'text-[#065f46]',
    headerSubtextColor: '#047857',
    watermarkOpacity: 0.07,
    previewColor: 'from-emerald-700 via-emerald-800 to-teal-950',
  },
  semester_ruby: {
    id: 'semester_ruby',
    nameKh: 'រចនាបថទទឹម & ក្បាច់មាសរាជវង្ស (ឆមាស)',
    subtitleKh: 'ពណ៌ក្រហមត្បូងទទឹម អមដោយក្បាច់មាសរាជវង្ស ស័ក្តិសមសម្រាប់ឆមាសទី១ និងឆមាសទី២ ដ៏ឧត្តុង្គឧត្តម',
    badgeLabel: 'ប្រចាំឆមាស • SEMESTER',
    badgeIcon: '💎',
    primaryHex: '#881337', // Royal Ruby Rose
    accentGoldHex: '#d97706', // Royal Gold
    secondaryHex: '#9f1239',
    frameOuterBorder: '#881337',
    frameInnerBorder: '#b45309',
    headerTitleColor: '#881337',
    headerTitleClass: 'text-[#881337]',
    headerSubtextColor: '#9f1239',
    watermarkOpacity: 0.08,
    previewColor: 'from-rose-900 via-rose-950 to-indigo-950',
  },
  annual_gold: {
    id: 'annual_gold',
    nameKh: 'រចនាបថមាសសុទ្ធ & ពេជ្រអធិរាជ (ប្រចាំឆ្នាំ)',
    subtitleKh: 'ពណ៌មាសសុទ្ធ ២៤ការ៉ាត់ អមដោយកម្រងផ្កាជ័យលាភី ស័ក្តិសមសម្រាប់សិស្សឆ្នើមប្រចាំឆ្នាំសិក្សា',
    badgeLabel: 'ប្រចាំឆ្នាំ • ANNUAL',
    badgeIcon: '👑',
    primaryHex: '#92400e', // Imperial Gold Amber
    accentGoldHex: '#f59e0b', // Brilliant Gold
    secondaryHex: '#b45309',
    frameOuterBorder: '#78350f',
    frameInnerBorder: '#f59e0b',
    headerTitleColor: '#78350f',
    headerTitleClass: 'text-[#78350f]',
    headerSubtextColor: '#92400e',
    watermarkOpacity: 0.1,
    previewColor: 'from-amber-600 via-amber-700 to-yellow-900',
  },
  classic_navy: {
    id: 'classic_navy',
    nameKh: 'រចនាបថខៀវស្ដង់ដារ MoEYS & មាស',
    subtitleKh: 'រចនាបថខៀវរាជធានី និងក្បាច់មាសបុរាណ តាមបែបបទរដ្ឋបាលក្រសួងអប់រំ យុវជន និងកីឡា',
    badgeLabel: 'ស្ដង់ដារ MoEYS',
    badgeIcon: '🏛️',
    primaryHex: '#1e3a8a', // Navy Blue
    accentGoldHex: '#d97706', // Gold
    secondaryHex: '#1d4ed8',
    frameOuterBorder: '#1e3a8a',
    frameInnerBorder: '#d97706',
    headerTitleColor: '#1e3a8a',
    headerTitleClass: 'text-[#1e3a8a]',
    headerSubtextColor: '#1e3a8a',
    watermarkOpacity: 0.07,
    previewColor: 'from-blue-900 via-indigo-900 to-slate-900',
  },
};

/**
 * Resolves automatic theme ID based on academic period type
 */
export const resolveThemeForPeriod = (periodType: string): HonorRollThemeId => {
  if (periodType === 'month') return 'month_emerald';
  if (periodType === 'semester1' || periodType === 'semester2') return 'semester_ruby';
  if (periodType === 'annual') return 'annual_gold';
  return 'classic_navy';
};

/**
 * Consistent Grade and Score badge formatting aligned with Student List & Profile views
 */
export const getConsistentGradeDisplay = (scoreVal?: number | null, fallbackLetter?: string) => {
  const safeVal = typeof scoreVal === 'number' && !isNaN(scoreVal) ? scoreVal : 0;
  const info = getGradeClassification(safeVal);
  const letter = info.letter || fallbackLetter || 'A';
  const label = info.label || `${letter} (${info.remarks || 'ល្អ'})`;
  const formattedScore = toKhmerNum(safeVal.toFixed(2));

  // Determine standard badge color classes matching list/profile view
  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let badgeHex = '#059669';
  let bgHex = '#ecfdf5';

  switch (letter) {
    case 'A':
      badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      badgeHex = '#059669';
      bgHex = '#ecfdf5';
      break;
    case 'B':
      badgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
      badgeHex = '#2563eb';
      bgHex = '#eff6ff';
      break;
    case 'C':
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
      badgeHex = '#d97706';
      bgHex = '#fef3c7';
      break;
    case 'D':
      badgeClass = 'bg-orange-100 text-orange-800 border-orange-300';
      badgeHex = '#ea580c';
      bgHex = '#ffedd5';
      break;
    case 'E':
      badgeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
      badgeHex = '#ca8a04';
      bgHex = '#fef9c3';
      break;
    case 'F':
      badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
      badgeHex = '#e11d48';
      bgHex = '#ffe4e6';
      break;
    default:
      badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      badgeHex = '#059669';
      bgHex = '#ecfdf5';
  }

  return {
    letter,
    label: `និទ្ទេស ${label}`,
    shortLabel: `និទ្ទេស ${letter}`,
    remarks: info.remarks || 'ល្អប្រសើរ',
    badgeClass,
    badgeHex,
    bgHex,
    scoreText: `ម.ភាគ៖ ${formattedScore}`,
    fullScoreText: `មធ្យមភាគ៖ ${formattedScore}`,
    rawScoreFormatted: formattedScore,
  };
};

/**
 * Ornate Khmer Classical Corner Flourish (Kbach Phni Tes / Kbach Chan)
 */
export const KhmerCornerOrnament: React.FC<{
  color: string;
  accentColor?: string;
  className?: string;
  themeId?: HonorRollThemeId;
}> = ({ color, accentColor = '#f59e0b', className = '', themeId = 'month_emerald' }) => {
  if (themeId === 'annual_gold') {
    // Grand Imperial Gold 3D Sculpted Corner with Diamond, Flame & Lotus
    return (
      <svg viewBox="0 0 140 140" className={`w-full h-full ${className}`} fill="none">
        {/* Main Corner Shield */}
        <path
          d="M0 0 L90 0 C70 16 55 35 48 60 C35 55 16 70 0 90 Z"
          fill={color}
          opacity="0.98"
        />
        {/* Secondary Gold Layer */}
        <path
          d="M0 0 L75 0 C60 14 45 28 38 48 C28 45 14 60 0 75 Z"
          fill={accentColor}
          opacity="0.9"
        />
        {/* Inset Bright Gold Fill */}
        <path
          d="M0 0 L55 0 C45 10 35 20 28 35 C20 35 10 45 0 55 Z"
          fill="#fef08a"
          opacity="0.95"
        />
        {/* Traditional Khmer Flame Petals (Kbach Phni Tes) */}
        <path
          d="M12 12 Q45 18 55 55 Q18 45 12 12 Z"
          fill="#fbbf24"
        />
        <path
          d="M20 20 Q50 25 50 65 Q25 50 20 20 Z"
          fill={color}
          opacity="0.75"
        />
        <path
          d="M8 8 Q25 10 32 32 Q10 25 8 8 Z"
          fill="#ffffff"
          opacity="0.85"
        />
        {/* Center Jewel / Diamond Rosette */}
        <circle cx="24" cy="24" r="10" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="24" cy="24" r="6" fill="#f59e0b" />
        <polygon points="24,14 27,21 34,24 27,27 24,34 21,27 14,24 21,21" fill="#ffffff" />
        {/* Outer Corner Running Beads & Flourish Lines */}
        <path d="M0 0 L120 0 M0 0 L0 120" stroke={accentColor} strokeWidth="3" />
        <path d="M4 4 L110 4 M4 4 L4 110" stroke="#fef08a" strokeWidth="1.5" />
        <circle cx="100" cy="10" r="4" fill={accentColor} stroke="#ffffff" strokeWidth="1" />
        <circle cx="10" cy="100" r="4" fill={accentColor} stroke="#ffffff" strokeWidth="1" />
        <circle cx="70" cy="10" r="3" fill="#fef08a" />
        <circle cx="10" cy="70" r="3" fill="#fef08a" />
      </svg>
    );
  }

  if (themeId === 'semester_ruby') {
    // Royal Ruby Crown Filigree Corner (Kbach Phni Phnom)
    return (
      <svg viewBox="0 0 140 140" className={`w-full h-full ${className}`} fill="none">
        {/* Corner Shield */}
        <path
          d="M0 0 L85 0 C68 18 52 35 42 62 C35 52 18 68 0 85 Z"
          fill={color}
          opacity="0.98"
        />
        <path
          d="M0 0 L68 0 C52 14 38 28 30 50 C28 38 14 52 0 68 Z"
          fill={accentColor}
          opacity="0.9"
        />
        {/* Inset Gold & Ruby Filigree */}
        <path
          d="M5 5 L50 5 C40 12 28 24 22 40 C24 28 12 40 5 50 Z"
          fill="#fef08a"
          opacity="0.95"
        />
        {/* Khmer Royal Crown Crest in Corner */}
        <path
          d="M15 15 L32 24 L38 15 L44 24 L60 15 L50 40 L24 40 Z"
          fill="#fbbf24"
          stroke={color}
          strokeWidth="1.5"
        />
        <circle cx="38" cy="30" r="7" fill="#be123c" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="38" cy="30" r="3" fill="#ffffff" />
        {/* Border Accent Lines */}
        <path d="M0 0 L115 0 M0 0 L0 115" stroke={accentColor} strokeWidth="3" />
        <path d="M4 4 L105 4 M4 4 L4 105" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="95" cy="9" r="4" fill={accentColor} stroke="#ffffff" strokeWidth="1" />
        <circle cx="9" cy="95" r="4" fill={accentColor} stroke="#ffffff" strokeWidth="1" />
        <circle cx="65" cy="9" r="3" fill="#fef08a" />
        <circle cx="9" cy="65" r="3" fill="#fef08a" />
      </svg>
    );
  }

  // Monthly Emerald & Classic Navy (Sacred Khmer Lotus & Phni Tes Vine)
  return (
    <svg viewBox="0 0 140 140" className={`w-full h-full ${className}`} fill="none">
      {/* Corner Outer Shield */}
      <path
        d="M0 0 L80 0 C64 16 48 32 40 58 C32 48 16 64 0 80 Z"
        fill={color}
        opacity="0.98"
      />
      <path
        d="M0 0 L65 0 C50 14 36 28 28 46 C28 36 14 50 0 65 Z"
        fill={accentColor}
        opacity="0.9"
      />
      {/* Gold Inner Inset */}
      <path
        d="M4 4 L48 4 C38 10 26 22 20 36 C22 26 10 38 4 48 Z"
        fill="#fef08a"
        opacity="0.95"
      />
      {/* Sacred Lotus Petals */}
      <path
        d="M18 18 Q40 24 44 48 Q24 40 18 18 Z"
        fill={accentColor}
      />
      <path
        d="M10 10 Q28 14 32 32 Q14 28 10 10 Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <circle cx="24" cy="24" r="8" fill={color} stroke="#fbbf24" strokeWidth="2" />
      <circle cx="24" cy="24" r="4" fill="#fbbf24" />
      <circle cx="24" cy="24" r="1.5" fill="#ffffff" />
      {/* Border Lines & Beads */}
      <path d="M0 0 L110 0 M0 0 L0 110" stroke={accentColor} strokeWidth="3" />
      <path d="M4 4 L100 4 M4 4 L4 100" stroke="#fef08a" strokeWidth="1.5" />
      <circle cx="90" cy="8" r="3.5" fill={accentColor} stroke="#ffffff" strokeWidth="1" />
      <circle cx="8" cy="90" r="3.5" fill={accentColor} stroke="#ffffff" strokeWidth="1" />
      <circle cx="60" cy="8" r="2.5" fill="#fef08a" />
      <circle cx="8" cy="60" r="2.5" fill="#fef08a" />
    </svg>
  );
};

/**
 * Center Top Royal Crest / Crown Ornament (ម្កុដក្បាច់ភ្ញីភ្នំខ្មែរ)
 */
export const TopCenterCrownOrnament: React.FC<{
  color: string;
  accentColor?: string;
  className?: string;
  themeId?: HonorRollThemeId;
}> = ({ color, accentColor = '#f59e0b', className = '', themeId = 'month_emerald' }) => {
  return (
    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-8 sm:h-9 flex items-center justify-center pointer-events-none z-20 ${className}`}>
      <svg viewBox="0 0 320 36" className="w-full h-full" fill="none">
        {/* Left Golden Wing Flourish */}
        <path
          d="M20 18 Q70 6 130 18 Q70 30 20 18 Z"
          fill={accentColor}
          opacity="0.95"
        />
        <path d="M30 18 L125 18" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 3" />
        <circle cx="50" cy="18" r="3" fill="#fef08a" />
        <circle cx="85" cy="18" r="3.5" fill="#fef08a" />
        <circle cx="115" cy="18" r="4" fill="#fef08a" />

        {/* Right Golden Wing Flourish */}
        <path
          d="M300 18 Q250 6 190 18 Q250 30 300 18 Z"
          fill={accentColor}
          opacity="0.95"
        />
        <path d="M290 18 L195 18" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 3" />
        <circle cx="270" cy="18" r="3" fill="#fef08a" />
        <circle cx="235" cy="18" r="3.5" fill="#fef08a" />
        <circle cx="205" cy="18" r="4" fill="#fef08a" />

        {/* Central Crown / Emblem (Kbach Phni Phnom) */}
        <g transform="translate(160, 18)">
          {/* Base Pedestal */}
          <path d="M-30 8 L30 8 L22 14 L-22 14 Z" fill={color} stroke={accentColor} strokeWidth="1.5" />
          <circle cx="-16" cy="11" r="2" fill="#fef08a" />
          <circle cx="0" cy="11" r="2.5" fill="#ffffff" />
          <circle cx="16" cy="11" r="2" fill="#fef08a" />

          {/* Crown Spikes */}
          <path
            d="M-24 6 L-18 -8 L-10 2 L0 -16 L10 2 L18 -8 L24 6 Z"
            fill={accentColor}
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          {/* Center Medallion */}
          <circle cx="0" cy="0" r="9" fill={color} stroke="#fef08a" strokeWidth="2" />
          <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill="#ffffff" />
          <circle cx="0" cy="0" r="2.5" fill="#f59e0b" />

          {/* Top Pinnacle Jewel */}
          <circle cx="0" cy="-16" r="3.5" fill="#fef08a" stroke={color} strokeWidth="1" />
          <circle cx="-18" cy="-8" r="2" fill="#fef08a" />
          <circle cx="18" cy="-8" r="2" fill="#fef08a" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Center Bottom Decorative Khmer Emblem Ornament (ក្បាច់ជើងទម្របាតក្រោម)
 */
export const BottomCenterOrnament: React.FC<{
  color: string;
  accentColor?: string;
  className?: string;
}> = ({ color, accentColor = '#f59e0b', className = '' }) => {
  return (
    <div className={`absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-56 sm:w-72 h-7 sm:h-8 flex items-center justify-center pointer-events-none z-20 ${className}`}>
      <svg viewBox="0 0 280 28" className="w-full h-full" fill="none">
        {/* Left Wing */}
        <path d="M30 14 Q95 2 130 14 Q95 26 30 14 Z" fill={accentColor} opacity="0.8" />
        <path d="M40 14 L125 14" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 2" />

        {/* Right Wing */}
        <path d="M250 14 Q185 2 150 14 Q185 26 250 14 Z" fill={accentColor} opacity="0.8" />
        <path d="M240 14 L155 14" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 2" />

        {/* Center Pedestal Medallion */}
        <g transform="translate(140, 14)">
          <path d="M-22 0 Q0 -10 22 0 Q0 10 -22 0 Z" fill={color} stroke={accentColor} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="7" fill={accentColor} stroke="#ffffff" strokeWidth="1.5" />
          <polygon points="0,-5 1.5,-1.5 5,0 1.5,1.5 0,5 -1.5,1.5 -5,0 -1.5,-1.5" fill="#ffffff" />
          <circle cx="-14" cy="0" r="2.5" fill="#fef08a" />
          <circle cx="14" cy="0" r="2.5" fill="#fef08a" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Complete, Majestic Khmer Ornate Border Frame (ស៊ុមផ្កាភ្ញីក្បាច់ខ្មែរព័ទ្ធជុំទិស)
 * Surrounds the document with double/triple gold borders, running beads, 4 corner flourishes, and top crown
 */
export const KhmerFullOrnateFrame: React.FC<{
  themeId: HonorRollThemeId;
  opacity?: number;
  className?: string;
}> = ({ themeId, opacity = 100, className = '' }) => {
  const theme = HONOR_ROLL_THEMES[themeId] || HONOR_ROLL_THEMES.month_emerald;
  const outerBorder = theme.frameOuterBorder;
  const innerGold = theme.accentGoldHex;

  return (
    <div
      style={{ opacity: opacity / 100 }}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
    >
      {/* Background Theme Watermark */}
      <ThemeWatermarkSvg themeId={themeId} />

      {/* Frame Container with Padding */}
      <div className="w-full h-full p-2 sm:p-3 relative flex items-center justify-center">
        {/* Tier 1: Heavy Outer Border with Rich Color */}
        <div
          className="w-full h-full relative rounded-sm shadow-md"
          style={{
            border: `7px solid ${outerBorder}`,
            boxShadow: `inset 0 0 0 2px ${innerGold}, 0 0 12px rgba(0,0,0,0.12)`,
          }}
        >
          {/* Tier 2: Golden Middle Running Filigree Border */}
          <div
            className="w-full h-full relative p-1.5"
            style={{
              border: `2.5px solid ${innerGold}`,
            }}
          >
            {/* Tier 3: Thin Inset Inner Line */}
            <div
              className="w-full h-full relative"
              style={{
                border: `1.5px solid ${outerBorder}`,
                boxShadow: `inset 0 0 0 1px ${innerGold}`,
              }}
            >
              {/* Corner 1: Top-Left */}
              <div className="absolute -top-1.5 -left-1.5 w-24 sm:w-28 h-24 sm:h-28 pointer-events-none z-10">
                <KhmerCornerOrnament color={outerBorder} accentColor={innerGold} themeId={themeId} />
              </div>

              {/* Corner 2: Top-Right */}
              <div className="absolute -top-1.5 -right-1.5 w-24 sm:w-28 h-24 sm:h-28 pointer-events-none rotate-90 z-10">
                <KhmerCornerOrnament color={outerBorder} accentColor={innerGold} themeId={themeId} />
              </div>

              {/* Corner 3: Bottom-Left */}
              <div className="absolute -bottom-1.5 -left-1.5 w-24 sm:w-28 h-24 sm:h-28 pointer-events-none -rotate-90 z-10">
                <KhmerCornerOrnament color={outerBorder} accentColor={innerGold} themeId={themeId} />
              </div>

              {/* Corner 4: Bottom-Right */}
              <div className="absolute -bottom-1.5 -right-1.5 w-24 sm:w-28 h-24 sm:h-28 pointer-events-none rotate-180 z-10">
                <KhmerCornerOrnament color={outerBorder} accentColor={innerGold} themeId={themeId} />
              </div>

              {/* Center Top Royal Crown Ornament */}
              <TopCenterCrownOrnament color={outerBorder} accentColor={innerGold} themeId={themeId} />

              {/* Center Bottom Royal Pedestal Ornament */}
              <BottomCenterOrnament color={outerBorder} accentColor={innerGold} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Beautiful Watermark Background SVG (Changes per Theme)
 */
export const ThemeWatermarkSvg: React.FC<{
  themeId: HonorRollThemeId;
}> = ({ themeId }) => {
  if (themeId === 'annual_gold') {
    // Grand Victory Trophy with Golden Laurels & Stars
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" opacity="0.08">
        <g transform="translate(200, 200)" stroke="#78350f" strokeWidth="3">
          {/* Victory Laurels */}
          <path d="M-80 -40 C-110 40 -90 100 0 120 C90 100 110 40 80 -40" fill="none" strokeWidth="4" />
          <path d="M-60 -20 C-90 40 -70 80 0 100 C70 80 90 40 60 -20" fill="none" strokeWidth="2" strokeDasharray="8 6" />
          
          {/* Trophy Cup */}
          <path d="M-45 -70 L45 -70 L35 0 C30 40 -30 40 -35 0 Z" fill="#b45309" fillOpacity="0.2" strokeWidth="3" />
          <path d="M-45 -50 C-75 -50 -75 -10 -40 -10" fill="none" strokeWidth="3" />
          <path d="M45 -50 C75 -50 75 -10 40 -10" fill="none" strokeWidth="3" />
          <rect x="-15" y="35" width="30" height="30" fill="#78350f" fillOpacity="0.3" strokeWidth="2" />
          <rect x="-35" y="65" width="70" height="15" rx="3" fill="#78350f" fillOpacity="0.4" strokeWidth="2" />
          
          {/* Champion Stars */}
          <polygon points="0,-120 4,-105 18,-105 7,-95 11,-80 0,-90 -11,-80 -7,-95 -18,-105 -4,-105" fill="#d97706" />
          <polygon points="-40,-100 -36,-88 -25,-88 -34,-80 -31,-68 -40,-76 -49,-68 -46,-80 -55,-88 -44,-88" fill="#d97706" />
          <polygon points="40,-100 44,-88 55,-88 46,-80 49,-68 40,-76 31,-68 34,-80 25,-88 36,-88" fill="#d97706" />
        </g>
      </svg>
    );
  }

  if (themeId === 'semester_ruby') {
    // Royal Seal & MoEYS Education Emblem Motif
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" opacity="0.07">
        <g transform="translate(200, 200)" stroke="#881337" strokeWidth="3">
          <circle cx="0" cy="0" r="130" strokeDasharray="10 6" strokeWidth="2" />
          <circle cx="0" cy="0" r="115" strokeWidth="4" />
          <circle cx="0" cy="0" r="95" strokeWidth="2" />
          
          {/* Crown & Book Motif */}
          <path d="M-50 -20 L-25 -50 L0 -25 L25 -50 L50 -20 L40 20 L-40 20 Z" fill="#881337" fillOpacity="0.2" strokeWidth="3" />
          <path d="M-60 30 Q0 15 60 30 L55 50 Q0 35 -55 50 Z" fill="#881337" fillOpacity="0.3" strokeWidth="2" />
          <circle cx="0" cy="-60" r="10" fill="#b45309" />
          
          {/* Radial Rays */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="-115"
              x2="0"
              y2="-130"
              transform={`rotate(${deg})`}
              stroke="#b45309"
              strokeWidth="2"
            />
          ))}
        </g>
      </svg>
    );
  }

  // Monthly Emerald & Classic Navy (Sacred Lotus Mandala Watermark)
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" opacity="0.06">
      <g transform="translate(200, 200)" stroke="#065f46" strokeWidth="2.5">
        <circle cx="0" cy="0" r="125" strokeDasharray="8 6" strokeWidth="2" />
        <circle cx="0" cy="0" r="110" strokeWidth="3" />
        
        {/* Sacred Lotus Petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <path
            key={deg}
            d="M0 0 C-30 -50 0 -90 0 -90 C0 -90 30 -50 0 0"
            transform={`rotate(${deg})`}
            fill="#065f46"
            fillOpacity="0.1"
            strokeWidth="2"
          />
        ))}
        <circle cx="0" cy="0" r="35" fill="#d97706" fillOpacity="0.2" stroke="#d97706" strokeWidth="2" />
        <circle cx="0" cy="0" r="15" fill="#065f46" fillOpacity="0.4" />
      </g>
    </svg>
  );
};
