import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Student } from '../types';

interface StudentAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: Student;
  onSaveAvatar: (newAvatar: string) => void;
  onShowToast?: (msg: string) => void;
}

const AVAILABLE_AVATARS = ['👦', '👧', '👨‍🎓', '👩‍🎓', '🦁', '🐯', '🐼', '🦊', '🚀', '⭐', '🦉', '🐬'];

export const StudentAvatarModal: React.FC<StudentAvatarModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onSaveAvatar,
  onShowToast,
}) => {
  const [selected, setSelected] = useState(currentStudent.avatar || '👦');

  if (!isOpen) return null;

  const handleSelect = (av: string) => {
    setSelected(av);
    onSaveAvatar(av);
    onShowToast?.(`បានប្ដូររូបតំណាងសិស្សទៅជា ${av} ជោគជ័យ!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-black text-sm font-moul text-slate-900 dark:text-white">ជ្រើសរើសរូបតំណាង Avatar</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 py-2">
          {AVAILABLE_AVATARS.map((av) => (
            <button
              key={av}
              onClick={() => handleSelect(av)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 transition hover:scale-110 cursor-pointer ${
                selected === av ? 'border-purple-600 bg-purple-50' : 'border-slate-200 bg-slate-50'
              }`}
            >
              {av}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
