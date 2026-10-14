import React, { useState } from 'react';
import { X, KeyRound, Lock, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TeacherProfile } from '../types';

interface TeacherAuthLampModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  onUpdateTeacher: (updated: TeacherProfile) => void;
  onShowToast: (msg: string) => void;
}

export const TeacherAuthLampModal: React.FC<TeacherAuthLampModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onUpdateTeacher,
  onShowToast,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);

  if (!isOpen) return null;

  const handleVerifyOrChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (isChangingPin) {
      if (newPin.length < 4) {
        onShowToast('សូមបញ្ចូល PIN យ៉ាងតិច ៤ ខ្ទង់!');
        return;
      }
      onUpdateTeacher({ ...teacher, adminPin: newPin });
      onShowToast('បានប្ដូរកូដសម្ងាត់រដ្ឋបាលជោគជ័យ! 🔒✅');
      onClose();
    } else {
      if (pinInput === (teacher.adminPin || '1234')) {
        onShowToast('ផ្ទៀងផ្ទាត់កូដសម្ងាត់ត្រឹមត្រូវ! ✅');
        setIsChangingPin(true);
      } else {
        onShowToast('❌ កូដសម្ងាត់មិនត្រឹមត្រូវទេ!');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 text-center">
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-amber-400/20">
          💡
        </div>

        <div>
          <h3 className="font-black text-lg font-moul text-slate-900 dark:text-white">
            {isChangingPin ? 'កំណត់ PIN ថ្មី' : 'ប្រព័ន្ធសុវត្ថិភាពរដ្ឋបាល'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isChangingPin
              ? 'បញ្ចូលកូដ PIN ថ្មីយ៉ាងតិច ៤ ខ្ទង់ ដើម្បីការពារទិន្នន័យ'
              : 'បញ្ចូលកូដ Admin PIN ដើម្បីផ្ទៀងផ្ទាត់សិទ្ធិគ្រូបង្រៀន (ដើម ៖ 1234)'}
          </p>
        </div>

        <form onSubmit={handleVerifyOrChange} className="space-y-4">
          {!isChangingPin ? (
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="បញ្ចូលកូដ PIN..."
              maxLength={8}
              className="w-full text-center text-2xl font-mono tracking-widest p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              autoFocus
            />
          ) : (
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="កូដ PIN ថ្មី..."
              maxLength={8}
              className="w-full text-center text-2xl font-mono tracking-widest p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              autoFocus
            />
          )}

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            {isChangingPin ? 'រក្សាទុក PIN ថ្មី' : 'ផ្ទៀងផ្ទាត់កូដ'}
          </button>
        </form>
      </div>
    </div>
  );
};
