import React, { useState, useEffect } from 'react';
import { X, Trophy, Volume2, Sparkles, RefreshCw, Check, ArrowRight, BookOpen, Star, HelpCircle } from 'lucide-react';

interface WordPair {
  id: number;
  word: string;
  meaning: string;
  example: string;
  emoji: string;
}

const ENGLISH_WORDS: WordPair[] = [
  { id: 1, word: 'School', meaning: 'សាលារៀន', example: 'I walk to school every morning.', emoji: '🏫' },
  { id: 2, word: 'Teacher', meaning: 'លោកគ្រូ / អ្នកគ្រូ', example: 'Our teacher is very kind.', emoji: '👩‍🏫' },
  { id: 3, word: 'Student', meaning: 'សិស្ស', example: 'The students study hard.', emoji: '🧑‍🎓' },
  { id: 4, word: 'Book', meaning: 'សៀវភៅ', example: 'This English book is interesting.', emoji: '📖' },
  { id: 5, word: 'Family', meaning: 'គ្រួសារ', example: 'I love my family.', emoji: '👨‍👩‍👧‍👦' },
  { id: 6, word: 'Friend', meaning: 'មិត្តភក្តិ', example: 'He is my best friend.', emoji: '🤝' },
  { id: 7, word: 'Water', meaning: 'ទឹក', example: 'Drink plenty of water.', emoji: '💧' },
  { id: 8, word: 'Tree', meaning: 'ដើមឈើ', example: 'Birds sing in the green tree.', emoji: '🌳' },
];

interface EnglishGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

export const EnglishGameModal: React.FC<EnglishGameModalProps> = ({
  isOpen,
  onClose,
  studentName,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIdx(0);
      setScore(0);
      setIsDone(false);
      loadQuestion(0);
    }
  }, [isOpen]);

  const loadQuestion = (idx: number) => {
    if (idx >= ENGLISH_WORDS.length) {
      setIsDone(true);
      return;
    }
    const current = ENGLISH_WORDS[idx];
    const otherMeanings = ENGLISH_WORDS.filter((w) => w.id !== current.id).map((w) => w.meaning);
    const shuffledOthers = otherMeanings.sort(() => 0.5 - Math.random()).slice(0, 3);
    const opts = [current.meaning, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setOptions(opts);
    setSelectedWord(null);
  };

  if (!isOpen) return null;

  const currentPair = ENGLISH_WORDS[currentIdx];

  const handleChoose = (meaning: string) => {
    if (selectedWord !== null) return;
    setSelectedWord(meaning);

    const isRight = meaning === currentPair.meaning;
    if (isRight) {
      setScore((prev) => prev + 25);
    }

    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      if (nextIdx >= ENGLISH_WORDS.length) {
        setIsDone(true);
      } else {
        setCurrentIdx(nextIdx);
        loadQuestion(nextIdx);
      }
    }, 1200);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setIsDone(false);
    loadQuestion(0);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 font-kantumruy">
      <div className="relative w-full h-full sm:h-auto sm:max-w-xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-800 sm:rounded-3xl overflow-hidden shadow-2xl border border-pink-300/30 text-white flex flex-col min-h-[480px]">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔤</span>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-moul text-amber-300">English Word Challenge</h3>
              <p className="text-[11px] text-pink-100">សិស្ស ៖ {studentName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>{score} ពិន្ទុ</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 transition text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
          {!isDone && currentPair ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="text-5xl">{currentPair.emoji}</div>
                <h4 className="text-3xl font-black tracking-wide text-white drop-shadow-md">
                  {currentPair.word}
                </h4>
                <p className="text-xs text-pink-100 italic">Example: "{currentPair.example}"</p>
                <p className="text-xs text-amber-200 font-bold">តើពាក្យនេះមានន័យដូចម្តេចជាភាសាខ្មែរ?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((opt, idx) => {
                  let btnStyle = 'bg-white/90 hover:bg-white text-slate-900 font-bold';
                  if (selectedWord === opt) {
                    btnStyle = opt === currentPair.meaning
                      ? 'bg-emerald-500 text-white font-black ring-4 ring-emerald-300'
                      : 'bg-rose-500 text-white font-black ring-4 ring-rose-300';
                  } else if (selectedWord !== null && opt === currentPair.meaning) {
                    btnStyle = 'bg-emerald-400 text-slate-950 font-black';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedWord !== null}
                      onClick={() => handleChoose(opt)}
                      className={`p-4 rounded-2xl text-xs sm:text-sm shadow-md transition transform active:scale-95 text-center ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-xs text-pink-200">
                ពាក្យទី {currentIdx + 1} / {ENGLISH_WORDS.length}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-5 my-auto bg-white/95 rounded-3xl p-6 sm:p-8 text-slate-900 max-w-md w-full mx-auto shadow-2xl">
              <div className="text-5xl">🎉</div>
              <div>
                <h4 className="text-2xl font-black font-moul text-indigo-950">Good Job!</h4>
                <p className="text-xs text-slate-500 mt-1">អ្នកបានរៀន និងឆ្លើយពាក្យអង់គ្លេសទាំងអស់បានយ៉ាងល្អ!</p>
              </div>

              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 text-center">
                <div className="text-xs text-pink-700 font-bold">ពិន្ទុរបស់អ្នក</div>
                <div className="text-2xl font-black text-pink-600">🏆 {score} ពិន្ទុ</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> <span>លេងម្តងទៀត</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition shadow-lg shadow-purple-600/30"
                >
                  ត្រឡប់ក្រោយ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
