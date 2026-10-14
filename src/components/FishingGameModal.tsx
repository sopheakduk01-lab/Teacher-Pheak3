import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Trophy, Volume2, VolumeX, Sparkles, RefreshCw, Check, ArrowRight, 
  Fish, Award, Star, Settings, Info, Anchor, Waves, WavesIcon, Shell, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quiz } from '../types';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation?: string;
  subject: string;
}

const FISHING_QUESTIONS: Question[] = [
  {
    id: 1,
    subject: 'គណិតវិទ្យា',
    question: 'គណនា ៖ ២៥ × ៤ + ៥០ = ?',
    options: [
      { text: '១៥០', isCorrect: true },
      { text: '១០០', isCorrect: false },
      { text: '១២៥', isCorrect: false },
      { text: '២០០', isCorrect: false },
    ],
    explanation: '២៥ × ៤ = ១០០, ១០០ + ៥០ = ១៥០',
  },
  {
    id: 2,
    subject: 'ភាសាខ្មែរ',
    question: 'តើពាក្យ «បណ្ឌិត» មានន័យដូចម្តេច?',
    options: [
      { text: 'អ្នកមានចំណេះដឹងជ្រៅជ្រះ / អ្នកប្រាជ្ញ', isCorrect: true },
      { text: 'អ្នកធ្វើស្រែចម្ការ', isCorrect: false },
      { text: 'ក្មេងតូច', isCorrect: false },
      { text: 'សិស្សទើបចូលរៀន', isCorrect: false },
    ],
    explanation: 'បណ្ឌិត សំដៅលើអ្នកចេះដឹង ឬអ្នកមានប្រាជ្ញាវាងវៃ។',
  }
];

interface FishingGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  initialQuizzes?: Quiz[];
}

export const FishingGameModal: React.FC<FishingGameModalProps> = ({
  isOpen,
  onClose,
  studentName,
  initialQuizzes = []
}) => {
  const [questions, setQuestions] = useState<Question[]>(FISHING_QUESTIONS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [fishesCaught, setFishesCaught] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'casting' | 'hooked' | 'question' | 'result'>('idle');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setScore(0);
      setFishesCaught(0);
      setCurrentQIndex(0);
      setGameState('idle');
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = questions[currentQIndex % questions.length];

  const handleCastLine = () => {
    setGameState('casting');
    setTimeout(() => {
      setGameState('hooked');
      setTimeout(() => {
        setGameState('question');
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1000);
    }, 1500);
  };

  const handleSelectAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = q.options[idx].isCorrect;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 50);
      setFishesCaught((prev) => prev + 1);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#38bdf8', '#60a5fa']
      });
    }

    setTimeout(() => {
      if (currentQIndex + 1 >= questions.length) {
        setGameState('result');
      } else {
        setCurrentQIndex((prev) => prev + 1);
        setGameState('idle');
      }
    }, 2000);
  };

  const handleRestart = () => {
    setScore(0);
    setFishesCaught(0);
    setCurrentQIndex(0);
    setGameState('idle');
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleSourceSelect = (quiz: Quiz) => {
    const newQs: Question[] = quiz.questions.map((q, idx) => ({
      id: idx + 1,
      subject: quiz.subject || 'ទូទៅ',
      question: q.question,
      options: q.options,
      explanation: ''
    }));
    setQuestions(newQs);
    handleRestart();
    setIsSettingsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 font-kantumruy overflow-hidden">
      {/* Immersive Underwater Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-950 pointer-events-none">
        {/* Animated Bubbles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/20 rounded-full blur-[1px]"
            initial={{ y: '110vh', x: `${Math.random() * 100}vw` }}
            animate={{ 
              y: '-20vh',
              x: `${Math.random() * 100}vw`,
              scale: [1, 1.5, 1],
              opacity: [0, 0.4, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
            style={{ width: `${Math.random() * 20 + 5}px`, height: `${Math.random() * 20 + 5}px` }}
          />
        ))}
        {/* Sun Rays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.4)_0%,transparent_60%)]" />
      </div>

      <div className="relative w-full h-full flex flex-col max-w-4xl sm:h-[90vh] sm:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/20 backdrop-blur-md bg-sky-950/30">
        {/* TOP HUD */}
        <div className="p-4 sm:p-8 flex items-center justify-between bg-white/10 backdrop-blur-xl border-b border-white/10 z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg transform -rotate-6">
              <Fish size={32} className="text-sky-900" />
            </div>
            <div>
              <h3 className="font-black text-xl sm:text-2xl text-white tracking-tight drop-shadow-md">ល្បែងស្ទូចត្រីចំនេះដឹង</h3>
              <div className="flex items-center gap-2 text-sky-200 font-bold text-xs uppercase tracking-widest">
                <Anchor size={12} /> {studentName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black text-sky-300 uppercase tracking-tighter">Fishes Caught</span>
              <span className="text-2xl font-black text-white">{fishesCaught}</span>
            </div>
            <div className="bg-amber-400/90 text-sky-950 px-5 py-2 rounded-2xl flex items-center gap-3 shadow-xl transform rotate-2">
              <Trophy size={20} className="animate-bounce" />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-black uppercase">Score</span>
                <span className="text-xl font-black">{score}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsSettingsOpen(true)} className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition border border-white/20 text-white"><Settings size={20}/></button>
              <button onClick={onClose} className="p-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500 transition border border-rose-500/30 text-rose-300 hover:text-white"><X size={20}/></button>
            </div>
          </div>
        </div>

        {/* MAIN STAGE */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-6 z-10">
          <AnimatePresence mode="wait">
            {gameState === 'idle' && (
              <motion.div 
                key="idle" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}
                className="text-center space-y-8"
              >
                <div className="relative inline-block">
                  <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-[10rem] drop-shadow-2xl">🛶</motion.div>
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/20 rounded-full blur-xl" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-3xl sm:text-5xl font-black text-white drop-shadow-2xl">ត្រៀមបោះសន្ទូច!</h4>
                  <p className="text-sky-100/80 font-bold max-w-sm mx-auto text-sm sm:text-base leading-relaxed">
                    ចុចប៊ូតុងខាងក្រោមដើម្បីទម្លាក់ផ្លែសន្ទូចចូលទៅក្នុងសមុទ្រចំណេះដឹង!
                  </p>
                </div>
                <button
                  onClick={handleCastLine}
                  className="group relative px-12 py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-sky-950 font-black text-xl rounded-[2rem] shadow-[0_20px_50px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">🎣 បោះសន្ទូចភ្លាមៗ</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </motion.div>
            )}

            {gameState === 'casting' && (
              <motion.div key="casting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-8xl">🌀</motion.div>
                <div className="text-2xl font-black text-amber-200 animate-pulse uppercase tracking-[0.2em]">កំពុងស្វែងរកត្រី...</div>
              </motion.div>
            )}

            {gameState === 'hooked' && (
              <motion.div key="hooked" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="text-center space-y-4">
                <div className="text-[12rem] animate-bounce drop-shadow-2xl">🐟</div>
                <div className="text-4xl font-black text-amber-400 uppercase drop-shadow-2xl">ត្រីស៊ីហើយ!</div>
              </motion.div>
            )}

            {gameState === 'question' && (
              <motion.div 
                key="question" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-[3rem] p-8 sm:p-10 text-slate-900 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-t-8 border-sky-400"
              >
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                  <span className="bg-sky-100 text-sky-700 font-black px-5 py-2 rounded-2xl text-xs uppercase tracking-widest border border-sky-200">
                    {q.subject}
                  </span>
                  <span className="text-slate-400 font-bold text-sm tracking-tighter uppercase">Question {currentQIndex + 1} / {questions.length}</span>
                </div>

                <h4 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight mb-10">
                  {q.question}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {q.options.map((opt, idx) => {
                    let btnStyle = 'bg-slate-50 hover:bg-sky-50 border-slate-200 text-slate-800 hover:border-sky-300 transform transition-all hover:scale-[1.02]';
                    if (selectedOption === idx) {
                      btnStyle = opt.isCorrect
                        ? 'bg-emerald-500 text-white font-black border-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-105'
                        : 'bg-rose-500 text-white font-black border-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.5)] scale-95';
                    } else if (selectedOption !== null && opt.isCorrect) {
                      btnStyle = 'bg-emerald-100 text-emerald-900 font-black border-emerald-400';
                    } else if (selectedOption !== null) {
                      btnStyle = 'opacity-40 grayscale pointer-events-none';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedOption !== null}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`p-5 rounded-[1.5rem] border-2 text-sm sm:text-base text-left flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <span className="font-bold">{opt.text}</span>
                        {selectedOption === idx && (
                          <div className="shrink-0">{opt.isCorrect ? <Check className="bg-white/20 rounded-full p-1" /> : <X className="bg-white/20 rounded-full p-1" />}</div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && q.explanation && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                    <Info size={18} className="shrink-0 text-amber-500" />
                    <p><strong>ការពន្យល់ ៖</strong> {q.explanation}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {gameState === 'result' && (
              <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md w-full bg-white/95 rounded-[3rem] p-10 shadow-2xl text-slate-900 border-t-8 border-amber-400">
                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[2rem] mx-auto flex items-center justify-center text-5xl shadow-inner mb-8 transform rotate-12">🏆</div>
                <h4 className="text-4xl font-black text-indigo-950 mb-2 leading-none">អបអរសាទរ!</h4>
                <p className="text-slate-500 font-bold mb-10 leading-snug">អ្នកគឺជាអ្នកស្ទូចត្រីចំនេះដឹងដ៏ពូកែបំផុត!</p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-sky-50 p-6 rounded-[2rem] border border-sky-100 text-left">
                    <div className="text-[10px] text-sky-400 font-black uppercase tracking-widest mb-1">Caught</div>
                    <div className="text-2xl font-black text-sky-700">{fishesCaught} <span className="text-sm">🐟</span></div>
                  </div>
                  <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 text-left">
                    <div className="text-[10px] text-amber-400 font-black uppercase tracking-widest mb-1">Score</div>
                    <div className="text-2xl font-black text-amber-600">{score}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={handleRestart} className="py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-lg transition shadow-xl active:scale-95 flex items-center justify-center gap-3">
                    <RefreshCw size={24} /> លេងម្តងទៀត
                  </button>
                  <button onClick={onClose} className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition">ត្រឡប់ក្រោយ</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DECORATIVE ELEMENTS */}
        <div className="absolute bottom-4 left-4 flex gap-4 opacity-30 z-0">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}><Shell size={48} className="text-white"/></motion.div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}><Waves size={48} className="text-white"/></motion.div>
        </div>

        {/* SETTINGS OVERLAY */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[3rem] p-8 flex flex-col max-h-[85vh] shadow-2xl">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3"><Settings className="text-sky-400" /> រៀបចំសំណួរ</h3>
                    <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">ជ្រើសរើសមេរៀនដែលមានក្នុងកម្មវិធី</p>
                  </div>
                  <button onClick={() => setIsSettingsOpen(false)} className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white"><X /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {initialQuizzes.map(q => (
                    <button key={q.id} onClick={() => handleSourceSelect(q)} className="w-full bg-slate-800/50 hover:bg-sky-600/20 p-5 rounded-[2rem] text-left border border-white/5 hover:border-sky-500/50 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all"><Layers size={24}/></div>
                        <div>
                          <div className="font-black text-white group-hover:text-sky-200 transition-colors">{q.title}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{q.subject} • {q.questions.length} សំណួរ</div>
                        </div>
                      </div>
                      <ArrowRight size={20} className="text-sky-400 opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1" />
                    </button>
                  ))}
                  {initialQuizzes.length === 0 && <div className="text-center py-20 text-slate-500 font-bold uppercase text-xs tracking-widest">មិនទាន់មានកម្រងសំណួរឡើយ</div>}
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="mt-8 w-full py-5 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-[2rem] shadow-2xl transition transform active:scale-95 uppercase tracking-widest text-sm">យល់ព្រម</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

