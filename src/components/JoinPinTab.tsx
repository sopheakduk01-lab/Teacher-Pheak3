import React, { useState } from 'react';
import { KeyRound, Smartphone, Play, ArrowRight } from 'lucide-react';
import { Quiz } from '../types';

interface JoinPinTabProps {
  quizzes: Quiz[];
  activeSessionPin?: string;
  onJoinSuccess: (quiz: Quiz) => void;
  onShowToast?: (msg: string) => void;
  onOpenSlideRemote?: (pin: string) => void;
}

export const JoinPinTab: React.FC<JoinPinTabProps> = ({
  quizzes,
  activeSessionPin = '',
  onJoinSuccess,
  onShowToast,
  onOpenSlideRemote,
}) => {
  const [enteredPin, setEnteredPin] = useState(activeSessionPin);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = enteredPin.trim();
    if (!cleanPin) {
      onShowToast?.('សូមបញ្ចូល Game PIN!');
      return;
    }
    // Match quiz or default
    const matched = quizzes[0];
    if (matched) {
      onShowToast?.(`បានចូលរួមបន្ទប់ប្រឡង PIN: ${cleanPin}! 🎉`);
      onJoinSuccess(matched);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto text-3xl shadow-lg shadow-purple-500/30">
          🎮
        </div>

        <div>
          <h2 className="text-xl font-black font-moul text-slate-900 dark:text-white">
            ចូលរួមបន្ទប់ប្រឡងផ្ទាល់
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            បញ្ចូលលេខកូដសម្ងាត់ Game PIN ដែលលោកគ្រូ/អ្នកគ្រូបានបង្ហាញនៅលើក្ដារខៀន
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            placeholder="បញ្ចូល Game PIN..."
            className="w-full text-center text-2xl font-black tracking-widest p-4 rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
          />

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>ចូលរួមប្រឡង</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {onOpenSlideRemote && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => onOpenSlideRemote(enteredPin || 'REMOTE')}
              className="text-xs text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center gap-1.5 mx-auto hover:underline cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>បើកបញ្ជាស្លាយតាមទូរស័ព្ទ (Remote Control)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
