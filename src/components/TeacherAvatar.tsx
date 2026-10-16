import React, { useState } from 'react';
import { User } from 'lucide-react';
import { TeacherProfile } from '../types';

export interface TeacherAvatarProps {
  teacher?: TeacherProfile | null;
  avatar?: string | null;
  name?: string | null;
  fallbackIcon?: React.ReactNode;
  size?: number;
  className?: string;
}

const isImageUrl = (val?: string | null): boolean => {
  if (!val) return false;
  const str = val.trim();
  return (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('data:') ||
    str.startsWith('blob:') ||
    str.startsWith('/')
  );
};

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  teacher,
  avatar,
  name,
  fallbackIcon,
  size = 40,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // Derive effective values from direct props or teacher object
  const effectiveAvatar = avatar !== undefined ? avatar : teacher?.avatar;
  const effectiveName = name !== undefined ? name : teacher?.name || '';

  // Check if avatar string is a valid image URL
  const isImg = !imgError && effectiveAvatar && isImageUrl(effectiveAvatar);

  if (isImg && effectiveAvatar) {
    return (
      <img
        src={effectiveAvatar}
        alt={effectiveName || 'គ្រូបង្រៀន'}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover ring-2 ring-indigo-500/40 shadow-xs ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  // If avatar is an emoji or short symbol (e.g. 👨‍🏫, 👩‍🏫)
  if (effectiveAvatar && !isImageUrl(effectiveAvatar)) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold ring-2 ring-indigo-500/40 shadow-xs select-none ${className}`}
      >
        <span style={{ fontSize: typeof size === 'number' ? `${Math.max(13, Math.floor(size * 0.45))}px` : '1rem' }}>
          {effectiveAvatar}
        </span>
      </div>
    );
  }

  // Render fallback: fallbackIcon, initials or user icon
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/40 shadow-xs select-none ${className}`}
    >
      {fallbackIcon ? (
        fallbackIcon
      ) : effectiveName ? (
        effectiveName.slice(0, 2)
      ) : (
        <User className="w-4 h-4 text-white" />
      )}
    </div>
  );
};
