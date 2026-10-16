import React, { useState } from 'react';
import { X, Save, Printer, Users, Calendar, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { PLCMeeting, TeacherProfile } from '../types';

interface PLCMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting?: PLCMeeting | null;
  teacher?: TeacherProfile;
  onSaveMeeting?: (meeting: PLCMeeting) => void;
  onShowToast?: (msg: string) => void;
  initialFontFamily?: string;
  initialTheme?: string;
  initialFontSizeScale?: any;
}

export const PLCMeetingModal: React.FC<PLCMeetingModalProps> = ({
  isOpen,
  onClose,
  meeting,
  teacher,
  onSaveMeeting,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<PLCMeeting>(() => ({
    id: typeof meeting?.id === 'number' ? meeting.id : Date.now(),
    topic: meeting?.topic || 'កិច្ចប្រជុំបណ្តាញបច្ចេកទេស (PLC) ប្រចាំខែ',
    date: meeting?.date || new Date().toISOString().split('T')[0],
    time: meeting?.time || '០២:០០ រសៀល',
    location: meeting?.location || 'បន្ទប់ប្រជុំគ្រូ',
    facilitator: meeting?.facilitator || teacher?.name || 'ប្រធានក្រុមបច្ចេកទេស',
    participants: meeting?.participants || [],
    issuesDiscussed: meeting?.issuesDiscussed || 'ពិភាក្សាវិធីសាស្ត្របង្រៀនគណិតវិទ្យា និងការដោះស្រាយលំហាត់',
    solutions: meeting?.solutions || 'ប្រើប្រាស់សម្ភារឧបទេសរូបភាព និងល្បែងសិក្សាដើម្បីជួយសិស្សរៀនយឺត',
    actions: meeting?.actions || 'អនុវត្តវិធីសាស្ត្រថ្មីនៅសប្តាហ៍ក្រោយ',
  }));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMeeting?.(formData);
    onShowToast?.('បានរក្សាទុកកំណត់ហេតុប្រជុំ PLC');
    onClose();
  };

  const handlePrint = () => {
    window.print();
    onShowToast?.('កំពុងបើកផ្ទាំងបោះពុម្ពកំណត់ហេតុ PLC...');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">កំណត់ហេតុកិច្ចប្រជុំបច្ចេកទេស PLC</h3>
              <p className="text-xs text-purple-200">សហគមន៍សិក្សាវិជ្ជាជីវៈគ្រូបង្រៀន MoEYS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">ប្រធានបទកិច្ចប្រជុំ PLC</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">កាលបរិច្ឆេទ</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">ពេលវេលា</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">បញ្ហាគរុកោសល្យដែលបានលើកឡើង</label>
            <textarea
              rows={3}
              value={formData.issuesDiscussed}
              onChange={(e) => setFormData({ ...formData, issuesDiscussed: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">ដំណោះស្រាយរួម និងយុទ្ធសាស្ត្រកែលម្អ</label>
            <textarea
              rows={3}
              value={formData.solutions}
              onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition cursor-pointer"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>រក្សាទុក</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
