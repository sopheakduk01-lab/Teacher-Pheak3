import React, { useState } from 'react';
import { Gamepad2, Sparkles, Trophy, Play, Fish, Rocket, BookOpen, Star, RefreshCw } from 'lucide-react';
import { Quiz } from '../types';
import { FishingGameModal } from './FishingGameModal';
import { VijjaNavaGameModal } from './VijjaNavaGameModal';
import { EnglishGameModal } from './EnglishGameModal';

export interface GamesTabProps {
  quizzes?: Quiz[];
  onPlayQuiz?: (quiz: Quiz) => void;
  onShowToast?: (msg: string) => void;
}

export const GamesTab: React.FC<GamesTabProps> = ({
  quizzes = [],
  onPlayQuiz,
  onShowToast,
}) => {
  const [isFishingOpen, setIsFishingOpen] = useState(false);
  const [isVijjaNavaOpen, setIsVijjaNavaOpen] = useState(false);
  const [isEnglishGameOpen, setIsEnglishGameOpen] = useState(false);

  const handleLaunchGame = (gameName: string, opener: () => void) => {
    opener();
    if (onShowToast) {
      onShowToast(`កំពុងបើក៖ ${gameName}! សូមរីករាយជាមួយការរៀន!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-500/20">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-6 opacity-10 sm:opacity-20 pointer-events-none">
          <Gamepad2 className="w-36 h-36" />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            មជ្ឈមណ្ឌលល្បែងសិក្សាអប់រំ (Educational Games Center)
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-moul leading-snug drop-shadow-md">
            លេងល្បែងឆ្លាតវៃ រៀនសប្បាយរីករាយ
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-2 leading-relaxed">
            ពង្រឹងសមត្ថភាពគណិតវិទ្យា ភាសាខ្មែរ និងភាសាអង់គ្លេស តាមរយៈល្បែងសិក្សាអន្តរកម្មកម្សាន្តដែលរចនាឡើងយ៉ាងពិសេសសម្រាប់សិស្សបឋមសិក្សា។
          </p>
        </div>
      </div>

      {/* Featured Games Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span>ល្បែងសិក្សាពេញនិយម (Featured Games)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Game 1: Fishing Math & Khmer */}
          <div className="group bg-gradient-to-b from-sky-500/10 to-indigo-500/5 dark:from-slate-800 dark:to-slate-900 border border-sky-200 dark:border-slate-700/80 rounded-3xl p-5 hover:shadow-xl hover:border-sky-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                <Fish className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300">
                  គណិត & ភាសាខ្មែរ
                </span>
                <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                  ★ 4.9
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-moul">
                ល្បែងស្ទូចត្រីឆ្លាតវៃ
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                ឆ្លើយសំណួរស្ទូចត្រីសប្បាយៗ គណនាលេខរហ័ស និងស្វែងយល់ន័យពាក្យភាសាខ្មែរ ដើម្បីដណ្តើមពិន្ទុខ្ពស់!
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLaunchGame('ល្បែងស្ទូចត្រីឆ្លាតវៃ', () => setIsFishingOpen(true))}
              className="mt-5 w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>លេងឥឡូវនេះ (Play Now)</span>
            </button>
          </div>

          {/* Game 2: Vijja Nava Space Quiz */}
          <div className="group bg-gradient-to-b from-purple-500/10 to-indigo-500/5 dark:from-slate-800 dark:to-slate-900 border border-purple-200 dark:border-slate-700/80 rounded-3xl p-5 hover:shadow-xl hover:border-purple-400 dark:hover:border-purple-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                  ល្បឿន & ចំណេះដឹង
                </span>
                <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                  ★ 5.0
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-moul">
                នាវាវិជ្ជាអវកាស
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                បើកបរនាវាឆ្លងកាត់លំហអាកាស ដោយដោះស្រាយលំហាត់គណិតវិទ្យា និងបញ្ញាញាណឲ្យបានត្រឹមត្រូវ។
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLaunchGame('នាវាវិជ្ជាអវកាស', () => setIsVijjaNavaOpen(true))}
              className="mt-5 w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>លេងឥឡូវនេះ (Play Now)</span>
            </button>
          </div>

          {/* Game 3: English Word Quest */}
          <div className="group bg-gradient-to-b from-emerald-500/10 to-teal-500/5 dark:from-slate-800 dark:to-slate-900 border border-emerald-200 dark:border-slate-700/80 rounded-3xl p-5 hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                  ភាសាអង់គ្លេស
                </span>
                <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                  ★ 4.8
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-moul">
                ល្បែងពាក្យអង់គ្លេស
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                ទាយពាក្យអង់គ្លេសជាមួយរូបភាព សំណួរឆ្លាតវៃ និងស្វែងយល់អត្ថន័យជាភាសាខ្មែរយ៉ាងងាយស្រួល។
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLaunchGame('ល្បែងពាក្យអង់គ្លេស', () => setIsEnglishGameOpen(true))}
              className="mt-5 w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>លេងឥឡូវនេះ (Play Now)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quizzes List (if any available) */}
      {quizzes && quizzes.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-500" />
              <span>កម្រងសំណួរបន្ថែម (Classroom Quizzes)</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              សរុប {quizzes.length} កម្រង
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-indigo-400 transition"
              >
                <div className="min-w-0">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {quiz.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {quiz.subject || 'ទូទៅ'} • {quiz.questions?.length || 0} សំណួរ
                  </p>
                </div>

                {onPlayQuiz && (
                  <button
                    type="button"
                    onClick={() => onPlayQuiz(quiz)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shrink-0 transition active:scale-95 cursor-pointer"
                  >
                    លេង
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Game Modals */}
      <FishingGameModal
        isOpen={isFishingOpen}
        onClose={() => setIsFishingOpen(false)}
        studentName="សិស្សបឋម"
        initialQuizzes={quizzes}
      />

      <VijjaNavaGameModal
        isOpen={isVijjaNavaOpen}
        onClose={() => setIsVijjaNavaOpen(false)}
        studentName="សិស្សបឋម"
      />

      <EnglishGameModal
        isOpen={isEnglishGameOpen}
        onClose={() => setIsEnglishGameOpen(false)}
        studentName="សិស្សបឋម"
      />
    </div>
  );
};
