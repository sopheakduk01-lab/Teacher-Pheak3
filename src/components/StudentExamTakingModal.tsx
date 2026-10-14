import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Award,
  Sparkles,
  BookOpen,
  Grid
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentSubjectExam } from '../data/studentPortalData';

interface StudentExamTakingModalProps {
  isOpen: boolean;
  exam: StudentSubjectExam | null;
  onClose: () => void;
  onNavigateToStudentPortal?: () => void;
  onShowToast?: (msg: string) => void;
}

export const StudentExamTakingModal: React.FC<StudentExamTakingModalProps> = ({
  isOpen,
  exam,
  onClose,
  onNavigateToStudentPortal,
  onShowToast,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [showQuestionList, setShowQuestionList] = useState<boolean>(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [resultScore, setResultScore] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
    correctCount: number;
  } | null>(null);

  // Initialize or reset exam
  useEffect(() => {
    if (exam && isOpen) {
      setCurrentQIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setResultScore(null);
      setTimeRemainingSeconds(exam.durationMinutes * 60);
      setShowQuestionList(false);

      const shuffled = (exam.questions || []).map((q) => {
        if (q.options && q.options.length > 0) {
          return {
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5),
          };
        }
        return q;
      });
      setShuffledQuestions(shuffled);
    }
  }, [exam, isOpen]);

  // Toggle answering-exam class on document.body to hide bottom bar
  useEffect(() => {
    if (isOpen && !isSubmitted) {
      document.body.classList.add('answering-exam');
    } else {
      document.body.classList.remove('answering-exam');
    }
    return () => {
      document.body.classList.remove('answering-exam');
    };
  }, [isOpen, isSubmitted]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || !exam || isSubmitted || timeRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, exam, isSubmitted, timeRemainingSeconds]);

  if (!isOpen || !exam) return null;

  const questions = shuffledQuestions.length > 0 ? shuffledQuestions : (exam.questions || []);
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIndex,
    }));
  };

  const handleSubmit = () => {
    let score = 0;
    let maxScore = 0;
    let correctCount = 0;

    questions.forEach((q, idx) => {
      const qPts = q.points || 1;
      maxScore += qPts;
      const userChoice = selectedAnswers[idx];
      const correctIdx = q.options.findIndex((o) => o.isCorrect);
      if (userChoice !== undefined && userChoice === correctIdx) {
        score += qPts;
        correctCount += 1;
      }
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    setResultScore({ score, maxScore, percentage, correctCount });
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    onShowToast?.(`បានបញ្ចប់ការប្រឡង! ទទួលបាន ${score}/${maxScore} ពិន្ទុ (${percentage}%)`);
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResultScore(null);
    setTimeRemainingSeconds(exam.durationMinutes * 60);
  };

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex flex-col bg-[#fcfcfd] overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-xs">
                  {exam.categoryLabel}
                </span>
                <span className="text-xs text-indigo-200 font-bold flex items-center gap-1">
                  <span>{exam.subjectIcon}</span>
                  <span>{exam.subjectName}</span>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold font-moul leading-snug line-clamp-1">
                {exam.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {!isSubmitted && (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-2xl font-mono text-xs font-bold shadow-inner ${
                    timeRemainingSeconds < 180
                      ? 'bg-rose-500/30 text-rose-300 border border-rose-400 animate-pulse'
                      : 'bg-white/15 text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                title="បិទ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
            {!isSubmitted ? (
              /* Taking Exam Mode */
              <div className="space-y-5">
                {/* Progress bar and question indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <button
                      type="button"
                      onClick={() => setShowQuestionList(!showQuestionList)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/50 hover:bg-indigo-100 transition active:scale-95 cursor-pointer"
                      title="បង្ហាញបញ្ជីសំណួរ"
                    >
                      <Grid className="w-3 h-3 text-indigo-600" />
                      <span>សំណួរទី {currentQIndex + 1} នៃ {questions.length} (បញ្ជីសំណួរ)</span>
                    </button>
                    <span>
                      បានឆ្លើយ {answeredCount}/{questions.length} សំណួរ
                    </span>
                  </div>

                  {/* Toggleable Question List Switcher Grid */}
                  <AnimatePresence>
                    {showQuestionList && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden"
                      >
                        <div className="text-[10px] font-bold text-slate-600 pb-2 flex items-center justify-between border-b border-slate-200/40 mb-2">
                          <span>បញ្ជីសំណួរ (ប៉ះដើម្បីផ្លោះទៅសំណួរនីមួយៗ)៖</span>
                          <button
                            type="button"
                            onClick={() => setShowQuestionList(false)}
                            className="text-[10px] text-indigo-600 hover:underline"
                          >
                            បិទ
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {questions.map((_, idx) => {
                            const isAnswered = selectedAnswers[idx] !== undefined;
                            const isCurrent = idx === currentQIndex;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setCurrentQIndex(idx);
                                  setShowQuestionList(false);
                                }}
                                className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer active:scale-95 ${
                                  isCurrent
                                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-1 font-black shadow-xs'
                                    : isAnswered
                                    ? 'bg-emerald-500 text-white shadow-2xs font-bold'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200/50'
                                }`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-indigo-600 h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${((currentQIndex + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question Box */}
                {currentQ && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {currentQIndex + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                            {currentQ.question}
                          </h3>
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1 inline-block">
                            ⭐ {currentQ.points || 1} ពិន្ទុ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {currentQ.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[currentQIndex] === optIdx;
                        const optionLabels = ['ក', 'ខ', 'គ', 'ឃ', 'ង'];
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(optIdx)}
                            className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-sm'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {optionLabels[optIdx] || optIdx + 1}
                            </span>
                            <span className="text-sm font-semibold flex-1 leading-snug">
                              {opt.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Question switcher pills (Hidden when answering as requested) */}
                {isSubmitted && (
                  <div className="pt-2 flex flex-wrap gap-1.5 justify-center">
                    {questions.map((_, idx) => {
                      const isAnswered = selectedAnswers[idx] !== undefined;
                      const isCurrent = idx === currentQIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentQIndex(idx)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                            isCurrent
                              ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-1'
                              : isAnswered
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Results & Review Mode */
              <div className="space-y-6">
                {resultScore && (
                  <div className="text-center space-y-3 py-2">
                    <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-lg ring-4 ring-amber-200 animate-bounce">
                      🏆
                    </div>
                    <div>
                      <h3 className="text-xl font-black font-moul text-indigo-950 dark:text-white">
                        លទ្ធផលនៃការប្រឡង
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        អ្នកបានបញ្ចប់វិញ្ញាសា «{exam.title}»
                      </p>
                    </div>

                    <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/80 p-4 rounded-3xl border border-indigo-100 dark:border-slate-700 shadow-xs">
                      <div className="text-center px-2">
                        <div className="text-[11px] text-slate-500 font-bold">ពិន្ទុទទួលបាន</div>
                        <div className="text-xl font-black text-indigo-700 dark:text-indigo-400">
                          {resultScore.score} / {resultScore.maxScore}
                        </div>
                      </div>
                      <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                      <div className="text-center px-2">
                        <div className="text-[11px] text-slate-500 font-bold">ភាគរយជោគជ័យ</div>
                        <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                          {resultScore.percentage}%
                        </div>
                      </div>
                      <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                      <div className="text-center px-2">
                        <div className="text-[11px] text-slate-500 font-bold">កម្រិតវាយតម្លៃ</div>
                        <div className="text-xs font-black px-2.5 py-0.5 rounded-xl bg-amber-400 text-slate-950 mt-1">
                          {resultScore.percentage >= 90
                            ? '🌟 ល្អឥតខ្ចោះ'
                            : resultScore.percentage >= 75
                            ? '🥇 ល្អណាស់'
                            : resultScore.percentage >= 50
                            ? '👍 ល្អបង្គួរ'
                            : '💪 ត្រូវខិតខំបន្ថែម'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review all questions */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ការត្រួតពិនិត្យចម្លើយ និងការពន្យល់លម្អិត</span>
                  </h4>

                  <div className="space-y-3">
                    {questions.map((q, qIdx) => {
                      const userChoice = selectedAnswers[qIdx];
                      const correctIdx = q.options.findIndex((o) => o.isCorrect);
                      const isCorrect = userChoice === correctIdx;
                      const optionLabels = ['ក', 'ខ', 'គ', 'ឃ', 'ង'];

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-2xl border-2 transition ${
                            isCorrect
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700'
                              : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-700'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-rose-600 text-white'
                              }`}
                            >
                              {qIdx + 1}
                            </span>
                            <div className="flex-1 space-y-2">
                              <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                {q.question}
                              </p>

                              <div className="space-y-1.5 pt-1">
                                {q.options.map((opt, optIdx) => {
                                  const wasChosen = userChoice === optIdx;
                                  const isTheCorrectOne = opt.isCorrect;

                                  let optClass = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                                  if (isTheCorrectOne) {
                                    optClass = 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-400 font-bold';
                                  } else if (wasChosen && !isTheCorrectOne) {
                                    optClass = 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-400 line-through';
                                  }

                                  return (
                                    <div
                                      key={optIdx}
                                      className={`p-2 rounded-xl border text-xs flex items-center gap-2 ${optClass}`}
                                    >
                                      <span className="w-5 h-5 rounded-md bg-black/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                                        {optionLabels[optIdx]}
                                      </span>
                                      <span className="flex-1">{opt.text}</span>
                                      {isTheCorrectOne && (
                                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                                          ✓ ត្រឹមត្រូវ
                                        </span>
                                      )}
                                      {wasChosen && !isTheCorrectOne && (
                                        <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                                          ✗ អ្នកបានជ្រើសរើស
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {q.explanation && (
                                <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="font-bold">ការពន្យល់៖ </strong>
                                    <span>{q.explanation}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {!isSubmitted ? (
              <>
                <button
                  type="button"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>សំណួរមុន</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentQIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>សំណួរបន្ទាប់</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>បញ្ជូនចម្លើយប្រឡង ({answeredCount}/{questions.length})</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>ប្រឡងឡើងវិញ</span>
                </button>

                <div className="flex items-center gap-2">
                  {onNavigateToStudentPortal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToStudentPortal();
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>ចូលផតថលសិស្សពេញលេញ</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                  >
                    <span>បិទ</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
