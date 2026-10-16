import React from 'react';
import { Bell, Calendar, BookOpen, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { TeacherProfile } from '../types';

interface TeacherOfficialNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  onOpenHolidaysModal: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenGuidelineModal: () => void;
}

export const TeacherOfficialNoticeModal: React.FC<TeacherOfficialNoticeModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onOpenHolidaysModal,
  onNavigateTab,
  onOpenGuidelineModal,
}) => {
  if (!isOpen) return null;

  const notices = [
    {
      id: 1,
      title: 'សេចក្ដីណែនាំស្តីពីការវាយតម្លៃលទ្ធផលសិក្សាសិស្សបឋមសិក្សា (MoEYS)',
      date: '២០២៥-១០-០១',
      tag: 'សេចក្ដីណែនាំផ្លូវការ',
      desc: 'ការវាយតម្លៃលទ្ធផលសិក្សាប្រចាំខែ និងប្រចាំឆមាស ត្រូវអនុលោមតាមក្របខ័ណ្ឌកម្មវិធីសិក្សាស្តង់ដារ និងគាំទ្រសិស្សរៀនយឺត។',
    },
    {
      id: 2,
      title: 'ប្រតិទិនឈប់សម្រាកបុណ្យជាតិ និងអន្តរជាតិ មន្ត្រីរាជការ',
      date: '២០២៥-០៩-២០',
      tag: 'ប្រតិទិនឈប់សម្រាក',
      desc: 'អនុក្រឹត្យលេខ ១៩៨ ស្តីពីការឈប់សម្រាកការងាររបស់មន្ត្រីរាជការ និយោជិត កម្មករ ប្រចាំឆ្នាំ។',
      action: onOpenHolidaysModal,
      actionLabel: 'មើលប្រតិទិនឈប់សម្រាកពេញលេញ',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              📢
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-moul">ការជូនដំណឹងផ្លូវការដល់គ្រូ</h2>
              <p className="text-xs text-blue-200">សេចក្ដីណែនាំ និងប្រតិទិនក្រសួងអប់រំ យុវជន និងកីឡា</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                  {n.tag}
                </span>
                <span className="text-[11px] text-slate-400">{n.date}</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white">{n.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.desc}</p>
              {n.action && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      n.action();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{n.actionLabel}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
