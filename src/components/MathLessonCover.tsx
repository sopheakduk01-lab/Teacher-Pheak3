import React from 'react';

interface MathLessonCoverProps {
  lessonNumber: number;
  title: string;
  shortTitle: string;
  color: string;
  className?: string;
}

export const MathLessonCover: React.FC<MathLessonCoverProps> = ({
  lessonNumber,
  title,
  shortTitle,
  color,
  className = '',
}) => {
  // Map colors to vibrant palettes inspired by the reference images
  const getPalette = (num: number) => {
    const palettes = [
      { bg: ['#db2777', '#9d174d'], accent: '#fbcfe8', text: '#ffffff', char: 'pink' }, // Pink/Rose (Sample 1)
      { bg: ['#2563eb', '#1e40af'], accent: '#bfdbfe', text: '#ffffff', char: 'blue' }, // Blue (Sample 2)
      { bg: ['#ea580c', '#9a3412'], accent: '#ffedd5', text: '#ffffff', char: 'orange' }, // Orange (Sample 3)
      { bg: ['#0891b2', '#155e75'], accent: '#cffafe', text: '#ffffff', char: 'cyan' }, // Cyan
      { bg: ['#16a34a', '#14532d'], accent: '#dcfce7', text: '#ffffff', char: 'green' }, // Green
      { bg: ['#7c3aed', '#4c1d95'], accent: '#ede9fe', text: '#ffffff', char: 'purple' }, // Purple
      { bg: ['#ca8a04', '#713f12'], accent: '#fef9c3', text: '#ffffff', char: 'yellow' }, // Yellow/Gold
      { bg: ['#e11d48', '#881337'], accent: '#ffe4e6', text: '#ffffff', char: 'red' }, // Rose/Red
      { bg: ['#0d9488', '#134e4a'], accent: '#ccfbf1', text: '#ffffff', char: 'teal' }, // Teal
      { bg: ['#4f46e5', '#312e81'], accent: '#e0e7ff', text: '#ffffff', char: 'indigo' }, // Indigo
    ];
    return palettes[(num - 1) % palettes.length];
  };

  const palette = getPalette(lessonNumber);
  const [c1, c2] = palette.bg;

  const toKhmerNum = (num: number) => {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return num.toString().split('').map(d => khmerDigits[parseInt(d)] || d).join('');
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-white shadow-inner ${className}`}>
      {/* Main Background Gradient */}
      <svg width="100%" height="100%" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`grad-${lessonNumber}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: c1, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: c2, stopOpacity: 1 }} />
          </linearGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.7" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background Layer */}
        <rect width="300" height="400" fill={`url(#grad-${lessonNumber})`} />
        
        {/* Decorative Geometric Patterns (like in samples) */}
        <circle cx="300" cy="0" r="150" fill="white" fillOpacity="0.1" />
        <circle cx="0" cy="400" r="100" fill="white" fillOpacity="0.05" />
        <path d="M0,0 Q150,100 300,0 L300,50 Q150,150 0,50 Z" fill="white" fillOpacity="0.1" />

        {/* Character Illustration (Varied by lesson) */}
        <g transform={`translate(${lessonNumber % 2 === 0 ? 220 : 80}, 280) scale(${lessonNumber % 2 === 0 ? -1.2 : 1.2}, 1.2)`}>
          {/* Head */}
          <circle cx="0" cy="-45" r="22" fill="#ffd7ba" />
          {/* Hair - varied styles */}
          {lessonNumber % 3 === 0 ? (
            <path d="M-25,-45 Q-25,-75 0,-75 Q25,-75 25,-45 L25,-35 Q0,-45 -25,-35 Z" fill="#2d2a2e" />
          ) : lessonNumber % 3 === 1 ? (
            <g>
              <circle cx="0" cy="-55" r="25" fill="#1a1a1a" />
              <circle cx="-20" cy="-60" r="8" fill="#1a1a1a" />
              <circle cx="20" cy="-60" r="8" fill="#1a1a1a" />
            </g>
          ) : (
            <path d="M-22,-45 Q-20,-80 20,-60 L22,-40 Z" fill="#4a3728" />
          )}
          {/* Eyes */}
          <circle cx="-8" cy="-45" r="2" fill="#000" />
          <circle cx="8" cy="-45" r="2" fill="#000" />
          {/* Smile */}
          <path d="M-5,-35 Q0,-30 5,-35" fill="none" stroke="#e11d48" strokeWidth="1.5" />
          
          {/* Body/Shirt */}
          <path 
            d="M-20,-20 Q0,-25 20,-20 L25,40 Q0,50 -25,40 Z" 
            fill={lessonNumber % 2 === 0 ? '#ffffff' : '#f8fafc'} 
            stroke="rgba(0,0,0,0.1)"
          />
          {/* Badge or Logo on shirt */}
          <circle cx="0" cy="5" r="6" fill={c1} fillOpacity="0.2" />
        </g>

        {/* Central Educational Elements (Floating Icons) */}
        <g transform="translate(150, 180)">
          {lessonNumber % 4 === 0 ? (
            <g filter="url(#glow)">
              <text x="-40" y="0" fontSize="50" fontWeight="900" fill="white" transform="rotate(-15)">×</text>
              <text x="20" y="30" fontSize="50" fontWeight="900" fill="#fbbf24" transform="rotate(10)">÷</text>
            </g>
          ) : lessonNumber % 4 === 1 ? (
            <g filter="url(#glow)">
              <text x="-30" y="20" fontSize="60" fontWeight="900" fill="white" transform="rotate(-5)">១</text>
              <text x="30" y="-10" fontSize="40" fontWeight="900" fill="#fbbf24" transform="rotate(15)">២</text>
            </g>
          ) : lessonNumber % 4 === 2 ? (
            <g stroke="white" strokeWidth="6" fill="none" strokeLinecap="round">
              <rect x="-40" y="-40" width="80" height="80" rx="12" strokeOpacity="0.4" />
              <circle cx="0" cy="0" r="35" stroke="#fbbf24" strokeWidth="8" />
            </g>
          ) : (
            <g filter="url(#glow)">
              <text x="-50" y="10" fontSize="45" fontWeight="900" fill="white" transform="rotate(-10)">+</text>
              <text x="30" y="10" fontSize="45" fontWeight="900" fill="white" transform="rotate(10)">=</text>
              <rect x="-10" y="-20" width="20" height="60" rx="4" fill="#fbbf24" />
            </g>
          )}
        </g>

        {/* Text Labels - Stylized like Sample posters */}
        <g filter="url(#glow)">
          {/* Top Label */}
          <rect x="20" y="25" width="100" height="22" rx="11" fill="white" fillOpacity="0.2" />
          <text x="35" y="40" fontSize="10" fontWeight="900" fill="white" fontFamily="sans-serif">គណិតវិទ្យា</text>
          
          {/* Main Lesson Title */}
          <text x="25" y="85" fontSize="28" fontWeight="900" fill="white" fontFamily="sans-serif">មេរៀនទី {toKhmerNum(lessonNumber)}</text>
          <text x="25" y="125" fontSize="36" fontWeight="900" fill="#fbbf24" fontFamily="sans-serif" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
            {shortTitle}
          </text>
        </g>

        {/* "GRADE 6" Badge at bottom-right (Exact match to sample style) */}
        <g transform="translate(250, 355)">
          <circle r="32" fill="white" shadow-sm="true" />
          <circle r="28" fill="none" stroke={c1} strokeWidth="1" strokeDasharray="3,3" />
          <text y="-6" textAnchor="middle" fontSize="9" fontWeight="900" fill={c1} fontFamily="sans-serif">GRADE</text>
          <text y="18" textAnchor="middle" fontSize="28" fontWeight="900" fill="#e11d48" fontFamily="sans-serif">6</text>
        </g>

        {/* Footer Ribbon or Label */}
        <path d="M20,350 L150,350 L160,365 L150,380 L20,380 Z" fill="white" fillOpacity="0.2" />
        <text x="35" y="370" fontSize="11" fontWeight="bold" fill="white" fontFamily="sans-serif">វិញ្ញាសា QCM ៤០ សំណួរ</text>
      </svg>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-white/10 to-transparent pointer-events-none" />
    </div>
  );
};

