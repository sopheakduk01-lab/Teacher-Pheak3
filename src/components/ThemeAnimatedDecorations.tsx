import React from 'react';

interface ThemeAnimatedDecorationsProps {
  themeId: string;
  variant?: 'compact' | 'full';
}

export const ThemeAnimatedDecorations: React.FC<ThemeAnimatedDecorationsProps> = ({
  themeId,
  variant = 'full',
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 select-none">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-xl animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-amber-300/20 blur-lg" />
      {variant === 'full' && (
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-cyan-300/10 blur-2xl" />
      )}
    </div>
  );
};
