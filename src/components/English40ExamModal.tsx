import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Award,
  BookOpen,
  Volume2,
  VolumeX,
  Bookmark,
  Maximize2,
  Minimize2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ENGLISH_40_EXAM_QUESTIONS, English40Question } from '../data/english40QuestionsData';
import { EnglishTopicIllustration, getEnglishQuestionTopicType } from './EnglishTopicIllustration';

interface English40ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const English40ExamModal: React.FC<English40ExamModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(60 * 60);
  const [showQuestionList, setShowQuestionList] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSubmitted]);

  if (!isOpen) return null;

  const currentQ: English40Question = ENGLISH_40_EXAM_QUESTIONS[currentQIndex] || ENGLISH_40_EXAM_QUESTIONS[0];

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex,
    }));
  };

  const handleToggleBookmark = (qId: number | string) => {
    setBookmarkedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
    if (onShowToast) {
      onShowToast(bookmarkedQuestions[qId] ? 'បានដកការចំណាំ' : 'បានចំណាំសំណួរនេះទុក');
    }
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setShowQuestionList(false);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const calculateScore = () => {
    let score = 0;
    ENGLISH_40_EXAM_QUESTIONS.forEach((q) => {
      const chosenIdx = selectedAnswers[q.id];
      if (chosenIdx !== undefined && q.options[chosenIdx]?.isCorrect) {
        score += q.points;
      }
    });
    return score;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalScore = calculateScore();
  const percentage = Math.round((totalScore / 40) * 100);

  const getGrade = (pct: number) => {
    if (pct >= 90) return { letter: 'A', text: 'ល្អប្រសើរណាស់ (Excellent)', color: 'text-emerald-600 bg-emerald-50' };
    if (pct >= 80) return { letter: 'B', text: 'ល្អណាស់ (Very Good)', color: 'text-teal-600 bg-teal-50' };
    if (pct >= 70) return { letter: 'C', text: 'ល្អ (Good)', color: 'text-blue-600 bg-blue-50' };
    if (pct >= 60) return { letter: 'D', text: 'មធ្យម (Fair)', color: 'text-amber-600 bg-amber-50' };
    if (pct >= 50) return { letter: 'E', text: 'ខ្សោយ (Passing)', color: 'text-orange-600 bg-orange-50' };
    return { letter: 'F', text: 'ធ្លាក់ (Need Practice)', color: 'text-rose-600 bg-rose-50' };
  };

  const gradeInfo = getGrade(percentage);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'} overflow-y-auto`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white rounded-[32px] w-full ${isFullscreen ? 'h-full max-h-screen rounded-none' : 'max-w-5xl max-h-[95vh]'} flex flex-col shadow-2xl border border-slate-200 overflow-hidden`}
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-800/60 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl border border-white/20">
              🔤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  MoEYS Grade 6
                </span>
                <span className="text-xs text-indigo-200 font-bold hidden sm:inline">
                  ភាសាអង់គ្លេស • ៤០ សំណួរ QCM / True-False / Grammar / Blanks
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold font-moul text-white mt-0.5">
                វិញ្ញាសាភាសាអង់គ្លេស ថ្នាក់ទី៦ (៤០ សំណួរពេញលេញ)
              </h2>
            </div>
          </div>

          {/* Timer & Controls */}
          <div className="flex items-center gap-2">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-amber-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono tracking-wider">{formatTimer(timeRemainingSeconds)}</span>
              </div>
            )}

            <button
              onClick={() => setShowQuestionList(!showQuestionList)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="បញ្ជីសំណួរទាំង ៤០"
            >
              <span>{currentQIndex + 1}/40</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Question Grid Navigator Modal */}
          {showQuestionList && (
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>បញ្ជីរាយសំណួរទាំង ៤០ ៖</span>
                <span className="text-blue-700">ឆ្លើយបាន ៖ {answeredCount}/40</span>
              </div>
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                {ENGLISH_40_EXAM_QUESTIONS.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = currentQIndex === idx;
                  const isBookmarked = !!bookmarkedQuestions[q.id];

                  let btnBg = 'bg-white text-slate-700 border-slate-200';
                  if (isAnswered) btnBg = 'bg-blue-600 text-white border-blue-600 shadow-xs';
                  if (isCurrent) btnBg = 'bg-slate-900 text-white border-slate-900 ring-2 ring-blue-400';

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentQIndex(idx);
                        setShowQuestionList(false);
                      }}
                      className={`h-9 rounded-xl text-xs font-bold transition flex items-center justify-center relative border cursor-pointer ${btnBg}`}
                    >
                      <span>{idx + 1}</span>
                      {isBookmarked && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result Screen (After Submission) */}
          {isSubmitted ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 border border-blue-200 rounded-3xl p-6 text-center space-y-4">
                <span className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
                  🏆
                </span>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black font-moul text-slate-900">
                    លទ្ធផលការប្រឡងភាសាអង់គ្លេស ៤០ សំណួរ
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    អបអរសាទរ! អ្នកបានបញ្ចប់វិញ្ញាសាទាំងស្រុង។
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block">ពិន្ទុសរុប</span>
                    <strong className="text-2xl font-black text-blue-600">{totalScore} / ៤០</strong>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block">ភាគរយ</span>
                    <strong className="text-2xl font-black text-indigo-600">{percentage}%</strong>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block">និទ្ទេស</span>
                    <strong className="text-2xl font-black text-amber-600">{gradeInfo.letter}</strong>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block">ល្បឿន</span>
                    <strong className="text-xl font-black text-teal-600">
                      {formatTimer(3600 - timeRemainingSeconds)}
                    </strong>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl inline-block text-xs font-bold ${gradeInfo.color}`}>
                  {gradeInfo.text}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setCurrentQIndex(0);
                      setSelectedAnswers({});
                      setTimeRemainingSeconds(60 * 60);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>ប្រឡងម្តងទៀត</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <span>ត្រឡប់ក្រោយ</span>
                  </button>
                </div>
              </div>

              {/* Detailed Review of All 40 Questions */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>ពិនិត្យមើលចម្លើយលម្អិត និងការពន្យល់វេយ្យាករណ៍ (៤០ សំណួរ) ៖</span>
                </h4>

                <div className="space-y-3">
                  {ENGLISH_40_EXAM_QUESTIONS.map((q, idx) => {
                    const studentChoice = selectedAnswers[q.id];
                    const isCorrect = studentChoice !== undefined && q.options[studentChoice]?.isCorrect;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-3xl border space-y-2.5 transition ${
                          isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                          <div className="flex items-center gap-2.5">
                            <EnglishTopicIllustration
                              topic={getEnglishQuestionTopicType(q.category, q.question, q.id)}
                              size="thumbnail"
                              className="w-16 h-11 shrink-0 rounded-lg border border-slate-200/90 shadow-2xs bg-white"
                              showCaption={false}
                            />
                            <div>
                              <span className="font-bold text-slate-700 block">
                                សំណួរទី {idx + 1} &bull; {q.typeLabelKhmer}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {q.category}
                              </span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}>
                            {isCorrect ? 'ត្រឹមត្រូវ (+១ ពិន្ទុ)' : 'មិនត្រឹមត្រូវ'}
                          </span>
                        </div>

                        <p className="font-black text-xs sm:text-sm text-slate-900 leading-snug">
                          {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, oIdx) => {
                            const isOptCorrect = opt.isCorrect;
                            const isOptChosen = studentChoice === oIdx;

                            let optStyle = 'bg-white border-slate-200 text-slate-700';
                            if (isOptCorrect) optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                            if (isOptChosen && !isOptCorrect) optStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';

                            return (
                              <div
                                key={oIdx}
                                className={`p-2.5 rounded-xl border flex items-center gap-2 ${optStyle}`}
                              >
                                <span className="w-5 h-5 rounded-full bg-white/80 border text-[10px] font-black flex items-center justify-center shrink-0">
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt.text}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 bg-white/90 rounded-2xl border border-slate-200/80 text-[11px] text-slate-700 leading-relaxed">
                          <strong className="text-blue-700 block mb-0.5">💡 ការពន្យល់ ៖</strong>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Active Question Taking Mode */
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center">
                    {currentQIndex + 1}
                  </span>
                  <div>
                    <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">
                      {currentQ.typeLabelKhmer}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {currentQ.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleBookmark(currentQ.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      bookmarkedQuestions[currentQ.id]
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    title="ចំណាំសំណួរនេះ"
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">
                      {bookmarkedQuestions[currentQ.id] ? 'បានចំណាំ' : 'ចំណាំទុក'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleSpeak(currentQ.question)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    title="អានសំណួរ"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-slate-50/80 rounded-3xl p-5 sm:p-6 border border-slate-200/90 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">{currentQ.icon || '❓'}</span>
                  <h3 className="font-black text-sm sm:text-base md:text-lg text-slate-900 leading-snug">
                    {currentQ.question}
                  </h3>
                </div>

                {/* Options Radio Cards */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQ.id] === oIdx;

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                            : 'bg-white hover:bg-slate-100/80 text-slate-800 border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isSelected ? 'bg-white text-blue-800' : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-relaxed">{opt.text}</span>
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-white bg-white text-blue-700' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="flex items-center justify-between pt-3 gap-3">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>សំណួរមុន</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentQIndex < ENGLISH_40_EXAM_QUESTIONS.length - 1 ? (
                    <button
                      onClick={() => setCurrentQIndex((prev) => Math.min(ENGLISH_40_EXAM_QUESTIONS.length - 1, prev + 1))}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <span>សំណួរបន្ទាប់</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitExam}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black flex items-center gap-1.5 transition shadow-md cursor-pointer animate-pulse"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ប្រគល់វិញ្ញាសា (Submit)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
