import React from 'react';
import { PalaceThemeKey } from './TeacherPalaceDashboardHero';

interface TeacherPalaceDecorationsProps {
  themeKey: PalaceThemeKey;
}

export const TeacherPalaceDecorations: React.FC<TeacherPalaceDecorationsProps> = ({ themeKey }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-[inherit]">
      {/* Universal Ambient Light Shimmer Sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-theme-shimmer pointer-events-none" />

      {/* =========================================================================
          THEME 1: SUNRISE & KHMER GOLD (🌅 រស្មីថ្ងៃរះ & មាសរាជវាំងខ្មែរ)
          ========================================================================= */}
      {themeKey === 'sunrise' && (
        <>
          {/* Radiant Sun Glow Orbs */}
          <div className="absolute -right-16 -top-16 w-88 h-88 rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.32)_0%,_rgba(180,83,9,0.18)_45%,_transparent_70%)] animate-theme-pulse-glow" />
          <div className="absolute -left-12 -bottom-12 w-72 h-72 rounded-full bg-[radial-gradient(circle,_rgba(194,65,12,0.25)_0%,_transparent_70%)]" />

          {/* Golden Khmer Solar Lotus Mandala SVG */}
          <div className="absolute right-2 -bottom-10 opacity-25 text-amber-400 w-52 h-52 sm:w-68 sm:h-68 animate-theme-spin-slow">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current" strokeWidth="1.3">
              <circle cx="100" cy="100" r="92" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="72" />
              <circle cx="100" cy="100" r="50" strokeDasharray="6 3" />
              <circle cx="100" cy="100" r="28" fill="rgba(251,191,36,0.15)" />
              {/* 12 Sunbeam Lotus Petals */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <g key={deg} transform={`rotate(${deg} 100 100)`}>
                  <path d="M100 12 C114 45, 114 65, 100 80 C86 65, 86 45, 100 12 Z" fill="rgba(251,191,36,0.14)" />
                  <circle cx="100" cy="22" r="3.5" fill="currentColor" />
                </g>
              ))}
            </svg>
          </div>

          {/* Angkor Spire Silhouette SVG in Background */}
          <div className="absolute right-36 -bottom-6 opacity-15 text-amber-300 w-36 h-36 hidden sm:block animate-theme-float">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
              <path d="M50 5 L55 25 L65 30 L62 50 L75 55 L72 80 L85 85 L85 95 L15 95 L15 85 L28 80 L25 55 L38 50 L35 30 L45 25 Z" />
            </svg>
          </div>

          {/* Floating Sacred Golden Sparkles & Petals */}
          <div className="absolute top-4 right-32 text-amber-300 text-sm animate-theme-drift-1">
            🪷
          </div>
          <div className="absolute bottom-6 right-72 text-amber-200/80 text-base animate-theme-drift-2">
            ✦
          </div>
          <div className="absolute top-8 left-1/3 text-amber-300/70 text-xs animate-theme-drift-3">
            ⚜️
          </div>
          <div className="absolute bottom-3 left-1/4 text-yellow-300/60 text-xs animate-theme-float">
            ✧
          </div>
          <div className="absolute top-12 right-12 text-amber-400/50 text-xs animate-theme-float-reverse">
            👑
          </div>
        </>
      )}

      {/* =========================================================================
          THEME 2: GALAXY & MIDNIGHT (🌌 ទីអវកាស & រាត្រីកាល)
          ========================================================================= */}
      {themeKey === 'galaxy' && (
        <>
          {/* Deep Nebula Ambient Glow */}
          <div className="absolute -right-20 -top-20 w-88 h-88 rounded-full bg-[radial-gradient(circle,_rgba(168,85,247,0.35)_0%,_rgba(99,102,241,0.18)_45%,_transparent_70%)] animate-theme-pulse-glow" />
          <div className="absolute left-1/4 -bottom-12 w-76 h-76 rounded-full bg-[radial-gradient(circle,_rgba(192,38,211,0.22)_0%,_transparent_70%)]" />

          {/* Cosmic Orbit Rings & Celestial Stars SVG */}
          <div className="absolute right-4 -bottom-10 opacity-25 text-purple-300 w-52 h-52 sm:w-68 sm:h-68 animate-theme-spin-slow">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current" strokeWidth="1.2">
              <ellipse cx="100" cy="100" rx="90" ry="40" transform="rotate(-25 100 100)" strokeDasharray="5 5" />
              <ellipse cx="100" cy="100" rx="80" ry="35" transform="rotate(35 100 100)" />
              <ellipse cx="100" cy="100" rx="60" ry="25" transform="rotate(-65 100 100)" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="22" fill="rgba(168,85,247,0.2)" />
              {/* Planets and Stars */}
              <circle cx="160" cy="70" r="5" fill="#facc15" />
              <circle cx="45" cy="130" r="3.5" fill="#a855f7" />
              <circle cx="140" cy="140" r="4" fill="#38bdf8" />
            </svg>
          </div>

          {/* Floating Starlight & Constellation Dust */}
          <div className="absolute top-5 right-36 text-purple-200 text-sm animate-theme-drift-1">
            ✨
          </div>
          <div className="absolute bottom-5 right-72 text-amber-300 text-xs animate-theme-drift-2">
            ⭐
          </div>
          <div className="absolute top-9 left-1/3 text-fuchsia-300 text-xs animate-theme-drift-3">
            💫
          </div>
          <div className="absolute bottom-4 left-1/4 text-purple-400 text-xs animate-theme-float">
            🪐
          </div>
          <div className="absolute top-14 right-14 text-indigo-300/80 text-xs animate-theme-float-reverse">
            🌌
          </div>
        </>
      )}

      {/* =========================================================================
          THEME 3: FOREST & EMERALD (🌿 ធម្មជាតិ & ត្បូងមរកត)
          ========================================================================= */}
      {themeKey === 'forest' && (
        <>
          {/* Bioluminescent Emerald Glow */}
          <div className="absolute -right-20 -top-20 w-88 h-88 rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.32)_0%,_rgba(20,184,166,0.18)_45%,_transparent_70%)] animate-theme-pulse-glow" />
          <div className="absolute left-1/4 -bottom-10 w-76 h-76 rounded-full bg-[radial-gradient(circle,_rgba(5,150,105,0.25)_0%,_transparent_70%)]" />

          {/* Lush Botanical Leaves SVG */}
          <div className="absolute right-2 -bottom-10 opacity-25 text-emerald-300 w-48 h-48 sm:w-64 sm:h-64 animate-theme-float">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current" strokeWidth="1.4">
              <path
                d="M100 190 C60 150, 40 110, 45 60 C50 20, 90 10, 100 10 C110 10, 150 20, 155 60 C160 110, 140 150, 100 190 Z"
                fill="rgba(16, 185, 129, 0.15)"
              />
              <line x1="100" y1="190" x2="100" y2="15" strokeWidth="2" />
              <path d="M100 60 Q130 50 145 35" />
              <path d="M100 90 Q140 80 152 65" />
              <path d="M100 120 Q135 115 145 105" />
              <path d="M100 60 Q70 50 55 35" />
              <path d="M100 90 Q60 80 48 65" />
              <path d="M100 120 Q65 115 55 105" />
            </svg>
          </div>

          {/* Floating Bioluminescent Fireflies & Forest Leaves */}
          <div className="absolute top-4 right-32 flex items-center gap-1 text-emerald-300 animate-theme-drift-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-ping" />
            <span className="text-xs">🌿</span>
          </div>
          <div className="absolute bottom-6 right-72 text-emerald-200 text-xs animate-theme-drift-2">
            🍃
          </div>
          <div className="absolute top-9 left-1/3 flex items-center gap-1 animate-theme-drift-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_#2dd4bf] animate-pulse" />
            <span className="text-xs text-teal-200">🌱</span>
          </div>
          <div className="absolute bottom-3 left-1/4 text-emerald-400/70 text-xs animate-theme-float">
            🌾
          </div>
          <div className="absolute top-12 right-12 text-teal-300/80 text-xs animate-theme-float-reverse">
            ✨
          </div>
        </>
      )}

      {/* =========================================================================
          THEME 4: CYBER & NEON ENERGY (⚡ ថាមពល & នីអុងឌីជីថល)
          ========================================================================= */}
      {themeKey === 'cyber' && (
        <>
          {/* Cyber Neon Glow */}
          <div className="absolute -right-20 -top-20 w-88 h-88 rounded-full bg-[radial-gradient(circle,_rgba(234,179,8,0.32)_0%,_rgba(168,85,247,0.22)_45%,_transparent_70%)] animate-theme-pulse-glow" />
          <div className="absolute left-1/4 -bottom-10 w-76 h-76 rounded-full bg-[radial-gradient(circle,_rgba(236,72,153,0.22)_0%,_transparent_70%)]" />

          {/* Cyber Matrix Circuit Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(234, 179, 8, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(234, 179, 8, 0.25) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Rotating AI Hologram HUD Radar Scanner SVG */}
          <div className="absolute right-4 -top-6 opacity-30 text-amber-400 w-52 h-52 sm:w-68 sm:h-68 animate-theme-radar">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current" strokeWidth="1.3">
              <circle cx="100" cy="100" r="92" strokeDasharray="6 6" />
              <circle cx="100" cy="100" r="75" />
              <circle cx="100" cy="100" r="50" strokeDasharray="12 4" />
              <circle cx="100" cy="100" r="25" />
              <line x1="100" y1="0" x2="100" y2="200" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="200" y2="100" strokeDasharray="4 4" />
              <rect x="90" y="90" width="20" height="20" stroke="currentColor" fill="rgba(234,179,8,0.15)" />
            </svg>
          </div>

          {/* Floating Cyber Nodes & Lightning Energy */}
          <div className="absolute top-5 right-36 flex items-center gap-1.5 text-[10px] font-mono text-amber-300 animate-theme-drift-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#facc15] animate-ping" />
            <span className="font-bold">AI.ACTIVE</span>
          </div>
          <div className="absolute bottom-5 right-72 text-[9px] font-mono text-pink-300/80 animate-theme-drift-2">
            ⚡ 100% READY
          </div>
          <div className="absolute top-9 left-1/3 text-amber-300 text-xs animate-theme-drift-3">
            💠
          </div>
          <div className="absolute bottom-3 left-1/4 text-yellow-400 text-xs animate-theme-float">
            ⚡
          </div>
          <div className="absolute top-12 right-12 text-pink-400/80 text-xs animate-theme-float-reverse">
            🛰️
          </div>
        </>
      )}

      {/* =========================================================================
          THEME 5: OCEAN & AZURE WAVES (🌊 មហាសមុទ្រ & រលកខៀវស្រស់)
          ========================================================================= */}
      {themeKey === 'ocean' && (
        <>
          {/* Aquatic Lagoon Ambient Glow */}
          <div className="absolute -right-20 -top-20 w-92 h-92 rounded-full bg-[radial-gradient(circle,_rgba(14,165,233,0.38)_0%,_rgba(6,182,212,0.22)_45%,_transparent_70%)] animate-theme-pulse-glow" />
          <div className="absolute left-1/4 -bottom-10 w-80 h-80 rounded-full bg-[radial-gradient(circle,_rgba(2,132,199,0.25)_0%,_transparent_70%)]" />

          {/* Layered Rolling Ocean Waves Silhouette SVG */}
          <div className="absolute inset-x-0 bottom-0 h-28 opacity-25 text-sky-400 pointer-events-none overflow-hidden">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="w-[140%] h-full stroke-none fill-current animate-ocean-wave -ml-[20%]"
            >
              <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" fill="rgba(56, 189, 248, 0.25)" />
              <path d="M0,30 C200,100 450,20 700,80 C950,140 1050,40 1200,70 L1200,120 L0,120 Z" fill="rgba(14, 165, 233, 0.35)" />
            </svg>
          </div>

          {/* Nautical Compass & Wave Mandala SVG */}
          <div className="absolute right-3 -bottom-8 opacity-25 text-sky-300 w-52 h-52 sm:w-68 sm:h-68 animate-theme-spin-slow">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current" strokeWidth="1.3">
              <circle cx="100" cy="100" r="90" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="72" />
              <circle cx="100" cy="100" r="48" strokeDasharray="8 4" />
              <circle cx="100" cy="100" r="24" fill="rgba(56, 189, 248, 0.2)" />
              {/* Nautical Compass Points */}
              <polygon points="100,15 106,85 100,100 94,85" fill="#38bdf8" />
              <polygon points="100,185 106,115 100,100 94,115" fill="rgba(56, 189, 248, 0.4)" />
              <polygon points="185,100 115,106 100,100 115,94" fill="rgba(56, 189, 248, 0.6)" />
              <polygon points="15,100 85,106 100,100 85,94" fill="rgba(56, 189, 248, 0.4)" />
            </svg>
          </div>

          {/* Floating Ocean Bubbles & Marine Sparkles */}
          <div className="absolute top-4 right-32 flex items-center gap-1 text-sky-200 animate-bubble-1">
            <span className="text-sm">🫧</span>
            <span className="w-2 h-2 rounded-full bg-sky-300/80 shadow-[0_0_8px_#38bdf8]" />
          </div>
          <div className="absolute bottom-8 right-72 text-sky-300 text-sm animate-bubble-2">
            🫧
          </div>
          <div className="absolute top-9 left-1/3 flex items-center gap-1.5 text-cyan-200 text-xs animate-bubble-3">
            <span>🐬</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee]" />
          </div>
          <div className="absolute bottom-4 left-1/4 text-sky-300/90 text-xs animate-theme-float">
            🌊
          </div>
          <div className="absolute top-12 right-12 text-cyan-300 text-sm animate-theme-float-reverse">
            🐚
          </div>
          <div className="absolute bottom-10 left-1/2 text-sky-400 text-xs animate-bubble-1">
            💧
          </div>
        </>
      )}
    </div>
  );
};
