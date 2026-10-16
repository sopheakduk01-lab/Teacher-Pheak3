import React, { useState } from 'react';
import { Shapes, ArrowRight, Smartphone, Sparkles } from 'lucide-react';
import { Quiz } from '../types';
import { AppLogo } from './AppLogo';

interface JoinPinTabProps {
  quizzes: Quiz[];
  activeSessionPin: string;
  onJoinSuccess: (quiz: Quiz) => void;
  onShowToast: (msg: string) => void;
  onOpenSlideRemote?: (sessionId: string) => void;
}

export const JoinPinTab: React.FC<JoinPinTabProps> = ({
  quizzes,
  activeSessionPin,
  onJoinSuccess,
  onShowToast,
  onOpenSlideRemote
}) => {
  const [mode, setMode] = useState<'quiz' | 'remote'>('quiz');
  const [pin, setPin] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [remotePin, setRemotePin] = useState('');

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || pin.length < 4) {
      onShowToast('សូមបញ្ចូល Game PIN ឲ្យបានត្រឹមត្រូវ (យ៉ាងតិច ៤ ខ្ទង់)');
      return;
    }

    onShowToast(`កំពុងភ្ជាប់ទៅកាន់ Game PIN: ${pin}...`);
    setTimeout(() => {
      const selectedQuiz = quizzes[0];
      onJoinSuccess(selectedQuiz);
    }, 800);
  };

  const handleRemoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remotePin.trim()) {
      onShowToast('សូមបញ្ចូលលេខកូដសម្គាល់ស្លាយ (Session PIN)');
      return;
    }
    if (onOpenSlideRemote) {
      onOpenSlideRemote(remotePin.trim().toUpperCase());
    } else {
      window.location.search = `?remote=${remotePin.trim().toUpperCase()}`;
    }
  };

  return (
    <div className="text-center py-6 md:py-10 max-w-md mx-auto space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl max-w-xs mx-auto border border-slate-200 shadow-inner">
        <button
          type="button"
          onClick={() => setMode('quiz')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mode === 'quiz'
              ? 'bg-purple-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shapes className="w-3.5 h-3.5" />
          <span>Game PIN</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('remote')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mode === 'remote'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>តេឡេបញ្ជាស្លាយ</span>
        </button>
      </div>

      {mode === 'quiz' ? (
        <>
          <div className="flex justify-center">
            <AppLogo size="xl" rounded="rounded-3xl" />
          </div>

          <div>
            <h2 className="font-black text-2xl text-purple-950 font-kahoot">Kahoot! Game PIN</h2>
            <p className="text-xs text-slate-500 mt-1">បញ្ចូល Game PIN ដើម្បីចូលរួមការប្រឡងសំណួរផ្ទាល់</p>
            {activeSessionPin && (
              <div className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                PIN កំពុងដំណើរការក្នុងថ្នាក់៖ <span className="font-kahoot text-sm">{activeSessionPin}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleQuizSubmit} className="space-y-3.5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Game PIN</label>
              <input
                type="number"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="000 000"
                className="w-full text-center text-2xl font-bold tracking-widest py-3.5 border-2 border-slate-200 rounded-2xl focus:border-purple-700 focus:outline-none bg-slate-50 focus:bg-white font-kahoot"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះសិស្ស</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="ឧ. សុខ ចាន់ថន"
                className="w-full text-center text-sm font-bold py-3 border border-slate-200 rounded-2xl focus:border-purple-700 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-900 text-white font-bold py-3.5 rounded-2xl hover:bg-purple-800 transition shadow-lg shadow-purple-900/20 active:scale-98 flex items-center justify-center gap-2 text-sm"
            >
              <span>ចូលរួមលេង (Enter PIN)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-amber-500/20">
            <Smartphone className="w-10 h-10" />
          </div>

          <div>
            <h2 className="font-black text-2xl text-slate-900">តេឡេបញ្ជាស្លាយពីទូរស័ព្ទ</h2>
            <p className="text-xs text-slate-500 mt-1">
              បញ្ចូលលេខកូដសម្គាល់បន្ទប់ (Session PIN) ដែលបង្ហាញលើស្លាយ PC
            </p>
          </div>

          <form onSubmit={handleRemoteSubmit} className="space-y-3.5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                លេខកូដសម្គាល់ស្លាយ (Session PIN)
              </label>
              <input
                type="text"
                required
                value={remotePin}
                onChange={(e) => setRemotePin(e.target.value.toUpperCase())}
                placeholder="ឧ. KM-8899"
                className="w-full text-center font-mono font-black text-xl tracking-wider py-3.5 border-2 border-slate-200 rounded-2xl focus:border-amber-500 focus:outline-none bg-slate-50 focus:bg-white text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3.5 rounded-2xl transition shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2 text-sm"
            >
              <span>ភ្ជាប់ជាតេឡេបញ្ជា (Connect Remote)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
