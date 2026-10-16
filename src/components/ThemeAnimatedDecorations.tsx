import React from 'react';
import { BannerThemeId } from '../utils/bannerThemes';

interface ThemeAnimatedDecorationsProps {
  themeId: BannerThemeId;
  variant?: 'banner' | 'card' | 'compact';
}

export const ThemeAnimatedDecorations: React.FC<ThemeAnimatedDecorationsProps> = ({
  themeId,
  variant = 'banner',
}) => {
  const isCompact = variant === 'compact';
  const isCard = variant === 'card';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-[inherit]">
      {/* Light Shimmer Sweep across all themes */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-theme-shimmer pointer-events-none" />

      {/* =========================================================================
          THEME 1: ROYAL PURPLE & ANGKOR (ស្វាយរាជវង្ស & អង្គរ)
          ========================================================================= */}
      {themeId === 'royal_purple' && (
        <>
          {/* Radial ambient glow */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[radial-gradient(circle,_rgba(251,191,36,0.22)_0%,_rgba(168,85,247,0.15)_45%,_transparent_70%)] animate-theme-pulse-glow" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-[radial-gradient(circle,_rgba(147,51,234,0.25)_0%,_transparent_70%)]" />

          {/* Rotating Angkor Lotus Mandala SVG */}
          <div className="absolute right-3 -bottom-10 opacity-20 text-amber-300 w-44 h-44 sm:w-56 sm:h-56 animate-theme-spin-slow">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current" strokeWidth="1.2">
              <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="70" />
              <circle cx="100" cy="100" r="50" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="25" />
              {/* 12-point Lotus Petals */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <g key={deg} transform={`rotate(${deg} 100 100)`}>
                  <path d="M100 10 C112 45, 112 65, 100 80 C88 65, 88 45, 100 10 Z" fill="rgba(251,191,36,0.12)" />
                  <circle cx="100" cy="20" r="3" fill="currentColor" />
                </g>
              ))}
            </svg>
          </div>

          {/* Floating Gold Sparkle Stars */}
          {!isCompact && (
            <>
              <div className="absolute top-4 right-28 text-amber-300/70 text-xs animate-theme-drift-1">
                ✦
              </div>
              <div className="absolute bottom-6 right-64 text-amber-200/60 text-base animate-theme-drift-2">
                ✧
              </div>
              <div className="absolute top-8 right-72 text-purple-300/60 text-xs animate-theme-drift-3">
                ★
              </div>
              <div className="absolute bottom-3 left-1/3 text-amber-300/40 text-xs animate-theme-float">
                ✦
              </div>
            </>
          )}
        </>
      )}

      {/* =========================================================================
          THEME 2: CYBER DIGITAL & AI TECH (ឌីជីថល & AI បច្ចេកវិទ្យា)
          ========================================================================= */}
      {themeId === 'digital_tech' && (
        <>
          {/* Cyber Neon Ambient Glow */}
          <div className="absolute -right-20 -top-20 w-84 h-84 rounded-full bg-[radial-gradient(circle,_rgba(6,182,212,0.28)_0%,_rgba(14,165,233,0.12)_45%,_transparent_70%)] animate-theme-pulse-glow" />
          <div className="absolute left-1/4 -bottom-10 w-72 h-72 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.18)_0%,_transparent_70%)]" />

          {/* Cyber Digital Matrix Grid Background */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(56, 189, 248, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.25) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Rotating AI Holographic Target Ring */}
          <div className="absolute right-4 -top-6 opacity-25 text-cyan-300 w-48 h-48 sm:w-60 sm:h-60 animate-theme-radar">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current" strokeWidth="1.2">
              <circle cx="100" cy="100" r="92" strokeDasharray="6 6" />
              <circle cx="100" cy="100" r="75" />
              <circle cx="100" cy="100" r="50" strokeDasharray="12 4" />
              <line x1="100" y1="0" x2="100" y2="200" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="200" y2="100" strokeDasharray="4 4" />
              <rect x="90" y="90" width="20" height="20" stroke="currentColor" />
            </svg>
          </div>

          {/* Floating Cyber Particle Nodes */}
          {!isCompact && (
            <>
              <div className="absolute top-5 right-36 flex items-center gap-1 text-[10px] font-mono text-cyan-300/80 animate-theme-drift-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>AI.CORE</span>
              </div>
              <div className="absolute bottom-5 right-72 text-[9px] font-mono text-sky-300/60 animate-theme-drift-2">
                01001101
              </div>
              <div className="absolute top-10 left-1/3 text-cyan-400/60 text-xs animate-theme-float">
                ⚡
              </div>
            </>
          )}
        </>
      )}

      {/* =========================================================================
          THEME 3: TRADITIONAL KHMER HERITAGE (សិល្បៈខ្មែរបុរាណ & ស្លឹករឹត)
          ========================================================================= */}
      {themeId === 'khmer_traditional' && (
        <>
          {/* Warm Temple Gold & Bronze Glow */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.25)_0%,_rgba(217,119,6,0.15)_45%,_transparent_70%)] animate-theme-pulse-glow" />
          <div className="absolute left-10 -bottom-10 w-64 h-64 rounded-full bg-[radial-gradient(circle,_rgba(180,83,9,0.22)_0%,_transparent_70%)]" />

          {/* Khmer Traditional Kbach Motif / Royal Temple Ornament SVG */}
          <div className="absolute right-2 -bottom-6 opacity-25 text-amber-400 w-48 h-48 sm:w-64 sm:h-64 animate-theme-float">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current" strokeWidth="1.4">
              {/* Traditional Kbach Flame / Leaf Flourish */}
              <path
                d="M100 180 C100 150, 140 130, 160 90 C175 60, 160 25, 130 20 C105 15, 80 40, 100 70 C110 85, 125 90, 120 105 C115 120, 95 125, 85 110 C75 95, 85 75, 75 60 C65 45, 40 50, 35 75 C30 105, 60 145, 100 180 Z"
                fill="rgba(245, 158, 11, 0.1)"
              />
              <path
                d="M100 160 C100 135, 130 120, 145 85 C155 60, 140 35, 120 30 C100 25, 85 45, 100 70"
                strokeDasharray="3 3"
              />
              <circle cx="100" cy="100" r="8" fill="rgba(245, 158, 11, 0.3)" />
              <circle cx="130" cy="55" r="4" fill="currentColor" />
              <circle cx="70" cy="65" r="3" fill="currentColor" />
            </svg>
          </div>

          {/* Floating Temple Golden Particles */}
          {!isCompact && (
            <>
              <div className="absolute top-4 right-32 text-amber-300/80 text-sm animate-theme-drift-1">
                ⚜️
              </div>
              <div className="absolute bottom-6 right-60 text-amber-400/60 text-xs animate-theme-drift-2">
                📜
              </div>
              <div className="absolute top-7 left-1/4 text-amber-200/50 text-xs animate-theme-drift-3">
                ✧
              </div>
              <div className="absolute bottom-4 left-1/2 text-yellow-300/60 text-xs animate-theme-float-reverse">
                🏛️
              </div>
            </>
          )}
        </>
      )}

      {/* =========================================================================
          THEME 4: EMERALD GREEN & NATURE (ត្បូងមរកត & ធម្មជាតិបៃតង)
          ========================================================================= */}
      {themeId === 'emerald_nature' && (
        <>
          {/* Bioluminescent Emerald Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.25)_0%,_rgba(5,150,105,0.15)_45%,_transparent_70%)] animate-theme-pulse-glow" />
          <div className="absolute left-1/4 -bottom-10 w-72 h-72 rounded-full bg-[radial-gradient(circle,_rgba(20,184,166,0.2)_0%,_transparent_70%)]" />

          {/* Organic Monstera & Botanical Leaf Silhouette SVG */}
          <div className="absolute right-2 -bottom-10 opacity-20 text-emerald-300 w-44 h-44 sm:w-60 sm:h-60 animate-theme-float">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current" strokeWidth="1.3">
              {/* Botanical Leaf Silhouette */}
              <path
                d="M100 190 C60 150, 40 110, 45 60 C50 20, 90 10, 100 10 C110 10, 150 20, 155 60 C160 110, 140 150, 100 190 Z"
                fill="rgba(16, 185, 129, 0.12)"
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

          {/* Floating Bioluminescent Spores / Fireflies */}
          {!isCompact && (
            <>
              <div className="absolute top-5 right-28 flex items-center gap-1 text-emerald-300/80 animate-theme-drift-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
                <span className="text-xs">🌿</span>
              </div>
              <div className="absolute bottom-5 right-64 text-emerald-200/70 text-xs animate-theme-drift-2">
                🍃
              </div>
              <div className="absolute top-9 left-1/3 flex items-center gap-1 animate-theme-drift-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300 shadow-[0_0_6px_#2dd4bf]" />
              </div>
              <div className="absolute bottom-3 left-1/2 text-emerald-400/50 text-xs animate-theme-float">
                🌱
              </div>
            </>
          )}
        </>
      )}

      {/* =========================================================================
          THEME 5: NATIONAL CRIMSON RUBY & GOLD (ក្រហមទង់ជាតិ & ក្តារខៀនមាស)
          ========================================================================= */}
      {themeId === 'national_ruby' && (
        <>
          {/* Radiant Ruby & Gold Glow */}
          <div className="absolute -right-16 -top-16 w-84 h-84 rounded-full bg-[radial-gradient(circle,_rgba(225,29,72,0.28)_0%,_rgba(251,191,36,0.18)_45%,_transparent_70%)] animate-theme-pulse-glow" />
          <div className="absolute left-8 -bottom-10 w-64 h-64 rounded-full bg-[radial-gradient(circle,_rgba(190,18,60,0.25)_0%,_transparent_70%)]" />

          {/* Radiant Golden Sunburst Rays SVG */}
          <div className="absolute right-2 -bottom-10 opacity-25 text-amber-300 w-48 h-48 sm:w-64 sm:h-64 animate-theme-spin-slow">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current" strokeWidth="1.2">
              <circle cx="100" cy="100" r="85" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="65" />
              <circle cx="100" cy="100" r="30" fill="rgba(251, 191, 36, 0.15)" />
              {/* 16 Radiant Rays */}
              {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
                <line
                  key={deg}
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="10"
                  transform={`rotate(${deg} 100 100)`}
                  stroke="currentColor"
                  strokeWidth={deg % 45 === 0 ? "2" : "1"}
                />
              ))}
            </svg>
          </div>

          {/* Floating National Stars & Golden Rubies */}
          {!isCompact && (
            <>
              <div className="absolute top-4 right-32 text-amber-300 text-sm animate-theme-drift-1">
                ⭐
              </div>
              <div className="absolute bottom-5 right-64 text-rose-300 text-xs animate-theme-drift-2">
                💎
              </div>
              <div className="absolute top-8 left-1/4 text-amber-200 text-xs animate-theme-drift-3">
                🚩
              </div>
              <div className="absolute bottom-3 left-1/2 text-amber-400 text-xs animate-theme-float">
                ✦
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
