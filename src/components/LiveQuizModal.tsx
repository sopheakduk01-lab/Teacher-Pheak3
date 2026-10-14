import React, { useState } from 'react';
import { X, Play, Trophy, Users, Award, CheckCircle2, RotateCcw } from 'lucide-react';
import { Quiz } from '../types';

interface LiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz?: Quiz | null;
  pin?: string;
}

export const LiveQuizModal: React.FC<LiveQuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
  pin,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const questions = quiz?.questions || [];
  const currentQ = questions[currentQIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                PIN: {pin || '123 456'}
              </span>
              <span className="text-xs text-purple-200 font-bold">
                សំណួរ {currentQIndex + 1} / {questions.length || 1}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black font-moul mt-1">
              {quiz?.title || 'សំណួរប្រឡងអន្តរកម្ម'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {currentQ ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-slate-900 dark:text-white font-black text-base sm:text-lg leading-relaxed text-center">
                {currentQ.question}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options?.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  let bgClass = 'bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 border-slate-200 dark:border-slate-700';
                  if (isSelected) {
                    bgClass = isSubmitted
                      ? opt.isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-rose-600 text-white border-rose-600'
                      : 'bg-purple-600 text-white border-purple-600';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => !isSubmitted && setSelectedOption(opt.id)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${bgClass}`}
                    >
                      <span>{opt.text}</span>
                      {isSubmitted && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && currentQ.explanation && (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-600 dark:text-slate-300">
                  💡 <strong>ពន្យល់ ៖</strong> {currentQ.explanation}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">គ្មានសំណួរក្នុងវិញ្ញាសានេះទេ</div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => {
              setSelectedOption(null);
              setIsSubmitted(false);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>កំណត់ឡើងវិញ</span>
          </button>

          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <button
                onClick={() => setIsSubmitted(true)}
                disabled={!selectedOption}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                ពិនិត្យចម្លើយ
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentQIndex < questions.length - 1) {
                    setCurrentQIndex(currentQIndex + 1);
                    setSelectedOption(null);
                    setIsSubmitted(false);
                  } else {
                    onClose();
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                {currentQIndex < questions.length - 1 ? 'សំណួរបន្ទាប់ 👉' : 'បញ្ចប់ការប្រឡង 🎉'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
