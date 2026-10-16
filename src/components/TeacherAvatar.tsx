import React, { useState } from 'react';
import { isImageAvatar } from '../utils/imageCompressor';

interface TeacherAvatarProps {
  avatar?: string;
  name?: string;
  className?: string;
  fallbackIcon?: string;
  imgClassName?: string;
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  avatar,
  name = 'គ្រូបង្រៀន',
  className = 'w-full h-full',
  fallbackIcon = '👨‍🏫',
  imgClassName = 'w-full h-full object-cover',
}) => {
  const [hasError, setHasError] = useState(false);
  const isImage = !hasError && isImageAvatar(avatar);

  if (isImage && avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setHasError(true)}
        className={imgClassName}
        loading="eager"
      />
    );
  }

  return (
    <span className="select-none flex items-center justify-center">
      {avatar && !isImageAvatar(avatar) ? avatar : fallbackIcon}
    </span>
  );
};
