import React, { useState } from 'react';
import { X, Key, Copy, Check, Printer, RefreshCw } from 'lucide-react';
import { Student, TeacherProfile } from '../types';

interface StudentPinManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  teacher: TeacherProfile;
  onUpdateStudents?: (students: Student[]) => void;
  onShowToast?: (msg: string) => void;
}

export const StudentPinManagerModal: React.FC<StudentPinManagerModalProps> = ({
  isOpen,
  onClose,
  students,
  teacher,
  onUpdateStudents,
  onShowToast,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (pin: string, studentId: number) => {
    navigator.clipboard.writeText(pin);
    setCopiedId(studentId);
    if (onShowToast) onShowToast(`បានចម្លងកូដ PIN: ${pin}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGeneratePins = () => {
    const updated = students.map((s) => ({
      ...s,
      pin: s.pin || Math.floor(1000 + Math.random() * 9000).toString(),
    }));
    if (onUpdateStudents) onUpdateStudents(updated);
    if (onShowToast) onShowToast('បានបង្កើតកូដ PIN ថ្មីសម្រាប់សិស្សទាំងអស់');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-khmer">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              🔑
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-moul">
                គ្រប់គ្រងលេខសម្ងាត់ PIN សិស្ស
              </h2>
              <p className="text-xs text-blue-200">
                សម្រាប់សិស្សចូលមើលលទ្ធផលសិក្សា និង Portal សិស្ស
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGeneratePins}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>បង្កើត PIN ស្វ័យប្រវត្តិ</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {students.map((s, idx) => {
              const pin = s.pin || `123${idx}`;
              return (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                      {idx + 1}. {s.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">{s.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-white dark:bg-slate-700 border rounded-lg font-mono font-bold text-xs tracking-wider text-indigo-600 dark:text-indigo-300">
                      {pin}
                    </span>
                    <button
                      onClick={() => handleCopy(pin, s.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition"
                      title="ចម្លង PIN"
                    >
                      {copiedId === s.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
