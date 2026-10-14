import React, { useState } from 'react';
import { X, Play, RotateCcw, Rocket, CheckCircle2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VijjaNavaGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

export const VijjaNavaGameModal: React.FC<VijjaNavaGameModalProps> = ({
  isOpen,
  onClose,
  studentName,
}) => {
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);

  if (!isOpen) return null;

  const questions = [
    {
      q: 'តើភពណាដែលនៅជិតព្រះអាទិត្យជាងគេ?',
      options: ['ភពពុធ', 'ភពសុក្រ', 'ភពផែនដី', 'ភពអង្គារ'],
      ans: 'ភពពុធ',
    },
    {
      q: 'តើឧស្ម័នណាដែលមនុស្សត្រូវការក្នុងការដកដង្ហើម?',
      options: ['អុកស៊ីសែន', 'កាបូនិច', 'អាសូត', 'អ៊ីដ្រូសែន'],
      ans: 'អុកស៊ីសែន',
    },
    {
      q: 'តើរស្មីសំយោគកើតឡើងលើសារពាង្គកាយណា?',
      options: ['រុក្ខជាតិបៃតង', 'សត្វ', 'មនុស្ស', 'បាក់តេរី'],
      ans: 'រុក្ខជាតិបៃតង',
    },
  ];

  const currentQ = questions[qIndex];

  const handleAnswer = (opt: string) => {
    if (opt === currentQ.ans) {
      setScore((s) => s + 10);
      confetti({ particleCount: 30, spread: 60 });
    }
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setQIndex(questions.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-purple-500/30 text-white space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-amber-400" />
            <h3 className="font-black text-base font-moul text-amber-300">ហ្គេមនាវាវិជ្ជា (Space Science Quiz)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        {qIndex < questions.length ? (
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-purple-300 font-bold">
              <span>សំណួរទី {qIndex + 1} / {questions.length}</span>
              <span>ពិន្ទុ ៖ {score} XP</span>
            </div>

            <div className="p-5 rounded-2xl bg-purple-950/50 border border-purple-500/40 text-center text-base font-bold">
              {currentQ.q}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {currentQ.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="p-3.5 rounded-xl bg-purple-800/40 hover:bg-purple-700/60 border border-purple-400/30 text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <Award className="w-16 h-16 text-amber-400 mx-auto" />
            <h3 className="text-xl font-black font-moul text-amber-300">អបអរសាទរ {studentName}!</h3>
            <p className="text-lg font-bold">អ្នកទទួលបាន {score} XP ក្នុងការរុករកអវកាស!</p>
            <button
              onClick={() => {
                setScore(0);
                setQIndex(0);
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>លេងម្ដងទៀត</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
