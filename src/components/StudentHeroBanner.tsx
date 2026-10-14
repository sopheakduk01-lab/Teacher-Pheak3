import React from 'react';
import { Sparkles, Gamepad2, Award, BookOpen, Star } from 'lucide-react';
import { Student } from '../types';

interface StudentHeroBannerProps {
  currentStudent: Student;
  selectedAvatar?: string;
  isImageAvatar: (avatar?: string) => boolean;
  setShowProfileModal: (show: boolean) => void;
  myAttempts?: any[];
  playStudentSound?: (sound: string) => void;
  soundMuted?: boolean;
  setShowFishingGame: (show: boolean) => void;
  setShowVijjaNavaGame: (show: boolean) => void;
  setShowEnglishGame: (show: boolean) => void;
}

export const StudentHeroBanner: React.FC<StudentHeroBannerProps> = ({
  currentStudent,
  selectedAvatar,
  isImageAvatar,
  setShowProfileModal,
  setShowFishingGame,
  setShowVijjaNavaGame,
  setShowEnglishGame,
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mx-4 sm:mx-8 mt-6">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-sm">
              សួស្តីប្អូន {currentStudent.name}
            </span>
            <span className="text-xs text-purple-200 font-bold">
              លេខរៀងទី {currentStudent.rollNo || currentStudent.id}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black font-moul leading-tight">
            សូមស្វាគមន៍មកកាន់ផតថលសិស្ស ថ្នាក់ទី ៦
          </h1>

          <p className="text-xs sm:text-sm text-purple-100/90 max-w-xl">
            តាមដានលទ្ធផលសិក្សា វត្តមានប្រចាំខែ អានសៀវភៅពុម្ព និងចូលរួមប្រឡងលំហាត់អន្តរកម្មដើម្បីបង្កើនចំណេះដឹង។
          </p>

          {/* Quick game shortcuts */}
          <div className="flex items-center gap-2 pt-2 flex-wrap justify-center md:justify-start">
            <button
              onClick={() => setShowFishingGame(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>🎣 ហ្គេមស្ទូចត្រី</span>
            </button>
            <button
              onClick={() => setShowVijjaNavaGame(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>🚀 នាវាវិជ្ជា</span>
            </button>
            <button
              onClick={() => setShowEnglishGame(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>🔤 ភាសាអង់គ្លេស</span>
            </button>
          </div>
        </div>

        {/* Student Avatar Display */}
        <div
          onClick={() => setShowProfileModal(true)}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-white/20 p-2 shadow-2xl flex items-center justify-center text-5xl cursor-pointer hover:scale-105 transition shrink-0"
          title="ចុចដើម្បីកែប្រែប្រវត្តិរូបសិស្ស"
        >
          {currentStudent.avatar || '🎓'}
        </div>
      </div>

      <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};
