import React from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showGlow?: boolean;
  interactive?: boolean;
  rounded?: string;
  alt?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  className = '',
  showGlow = true,
  interactive = true,
  rounded = 'rounded-2xl',
  alt = 'ប្រព័ន្ធរដ្ឋបាលគ្រូបឋមសិក្សា ឌីជីថល (Digital Primary Teacher Portal)',
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 min-w-7',
    sm: 'w-9 h-9 min-w-9',
    md: 'w-11 h-11 min-w-11',
    lg: 'w-14 h-14 min-w-14',
    xl: 'w-20 h-20 min-w-20',
    '2xl': 'w-28 h-28 min-w-28',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses} ${
        interactive ? 'group' : ''
      } ${className}`}
    >
      {/* Outer ambient digital cyan-indigo glow */}
      {showGlow && (
        <div
          className={`absolute -inset-0.5 bg-gradient-to-tr from-cyan-500 via-indigo-600 to-amber-400 ${rounded} opacity-60 blur-xs transition-opacity duration-300 ${
            interactive ? 'group-hover:opacity-100 group-hover:blur-sm' : ''
          }`}
        />
      )}

      {/* Main Logo Container */}
      <div
        className={`relative w-full h-full ${rounded} p-0.5 bg-gradient-to-tr from-indigo-900 via-purple-900 to-slate-900 border border-cyan-400/40 shadow-md shadow-indigo-950/40 overflow-hidden flex items-center justify-center`}
      >
        <img
          src="/digital_app_logo.jpg"
          alt={alt}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center ${rounded} transition-transform duration-300 ${
            interactive ? 'group-hover:scale-105' : ''
          }`}
          onError={(e) => {
            // Fallback to SVG icon if image loading has issues
            const target = e.currentTarget;
            target.src = '/icon.svg';
          }}
        />

        {/* Digital Grid Light Scan Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/30 pointer-events-none" />

        {/* Active Smart Digital Node Dot */}
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
      </div>
    </div>
  );
};

export default AppLogo;
