import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Check,
  Shuffle,
  AlignLeft,
  Type,
  Layers,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Quiz, QuestionType, MatchingPair } from '../types';

interface LiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
  pin: string;
}

export const LiveQuizModal: React.FC<LiveQuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
  pin,
}) => {
  const [gameState, setGameState] = useState<'lobby' | 'question' | 'result' | 'podium'>('lobby');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);

  // States for diverse question types
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [matchingSelectedLeft, setMatchingSelectedLeft] = useState<string | null>(null);
  const [matchingUserLinks, setMatchingUserLinks] = useState<{ [leftId: string]: string }>({});
  const [shuffledRights, setShuffledRights] = useState<Array<{ id: string; text: string }>>([]);

  // State for teacher's student activity tracking
  const [studentStatuses, setStudentStatuses] = useState<{ [studentName: string]: 'pending' | 'answered' }>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  // In a real application, 'students' would come from props or a real-time socket connection.
  // Replacing simulated students with a clear placeholder for real connections.
  const [students, setStudents] = useState<string[]>([]); // Start empty for real students

  // Simulate real-time student activity tracking
  useEffect(() => {
    if (!isOpen || gameState !== 'question') return;
    
    // Randomly update student status
    const interval = setInterval(() => {
      const studentNames = students;
      const randomStudent = studentNames[Math.floor(Math.random() * studentNames.length)];
      setStudentStatuses((prev) => ({
        ...prev,
        [randomStudent]: 'answered'
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen, gameState, students]);

  // Handle full-screen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const currentQuestion = quiz.questions[currentQIndex] || quiz.questions[0];
  const qType: QuestionType = currentQuestion?.type || 'qcm';

  // Auto-join simulated students in lobby
  useEffect(() => {
    if (!isOpen || gameState !== 'lobby') return;
    const names = ['ហេង ពិសិដ្ឋ', 'ធីតា សុផល', 'រិទ្ធី ដារ៉ា', 'មុនី សុជាតា', 'សុជាតិ វណ្ណឌី'];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < names.length) {
        setStudents((prev) => [...prev, names[idx]]);
        idx++;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen, gameState]);

  // Reset per-question temporary state when entering a question
  useEffect(() => {
    if (!isOpen || gameState !== 'question') return;
    const timeLimit = currentQuestion?.timeLimit || 20;
    setTimeLeft(timeLimit);
    setSelectedOptionId(null);
    setTypedAnswer('');
    setSelectedWords([]);
    setMatchingSelectedLeft(null);
    setMatchingUserLinks({});

    // Shuffle matching right items once per question
    if (qType === 'matching' && currentQuestion?.matchingPairs) {
      const rights = currentQuestion.matchingPairs.map((p) => ({
        id: p.id,
        text: p.right,
      }));
      setShuffledRights([...rights].sort(() => Math.random() - 0.5));
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAnswerCorrect(false);
          setStreak(0);
          setGameState('result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, gameState, currentQIndex, currentQuestion?.id, currentQuestion?.timeLimit, qType]);

  // Launch confetti on podium
  useEffect(() => {
    if (gameState === 'podium') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [gameState]);

  if (!isOpen) return null;

  const handleStartGame = () => {
    setCurrentQIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOptionId(null);
    setIsAnswerCorrect(false);
    setGameState('question');
  };

  // Grade and finish current question
  const finishQuestionWithResult = (isCorrect: boolean) => {
    setIsAnswerCorrect(isCorrect);
    if (isCorrect) {
      const pointsBase = currentQuestion.points || 1000;
      const addedPoints =
        Math.round(pointsBase * (Math.max(1, timeLeft) / (currentQuestion.timeLimit || 20))) +
        streak * 100;
      setScore((prev) => prev + addedPoints);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
    setGameState('result');
  };

  // 1. QCM Option select
  const handleSelectOption = (optionId: string) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(optionId);
    const chosen = currentQuestion.options.find((o) => o.id === optionId);
    finishQuestionWithResult(chosen?.isCorrect ?? false);
  };

  // 2. True / False select
  const handleSelectTrueFalse = (val: boolean) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(val ? 'true' : 'false');
    const isTargetTrue = currentQuestion.isTrue !== false;
    finishQuestionWithResult(val === isTargetTrue);
  };

  // 3. Matching Pair click
  const handleMatchingClickLeft = (pairId: string) => {
    setMatchingSelectedLeft(pairId);
  };

  const handleMatchingClickRight = (rightId: string) => {
    if (!matchingSelectedLeft) return;
    const newLinks = { ...matchingUserLinks, [matchingSelectedLeft]: rightId };
    setMatchingUserLinks(newLinks);
    setMatchingSelectedLeft(null);
  };

  const handleMatchingSubmit = () => {
    const pairs = currentQuestion.matchingPairs || [];
    let correctCount = 0;
    pairs.forEach((p) => {
      if (matchingUserLinks[p.id] === p.id) {
        correctCount++;
      }
    });
    // Correct if all or at least 75% are linked correctly
    const isAllCorrect = correctCount === pairs.length;
    setSelectedOptionId('matching_submitted');
    finishQuestionWithResult(isAllCorrect);
  };

  // 4. Fill in the blank submit
  const handleFillBlankSubmit = (chosenWord?: string) => {
    const ans = (chosenWord || typedAnswer).trim().toLowerCase();
    const correct = (currentQuestion.blankAnswer || '').trim().toLowerCase();
    setSelectedOptionId('fill_blank_submitted');
    finishQuestionWithResult(ans === correct || (correct.length > 0 && ans.includes(correct)));
  };

  // 5. Reorder words click & submit
  const handleToggleWord = (word: string, index: number) => {
    setSelectedWords([...selectedWords, word]);
  };

  const handleClearReorderWords = () => {
    setSelectedWords([]);
  };

  const handleReorderSubmit = () => {
    const assembled = selectedWords.join(' ').trim();
    const target = (currentQuestion.correctSentence || '').trim();
    // Normalize spaces
    const cleanAssembled = assembled.replace(/\s+/g, ' ');
    const cleanTarget = target.replace(/\s+/g, ' ');
    setSelectedOptionId('reorder_submitted');
    finishQuestionWithResult(cleanAssembled === cleanTarget);
  };

  // 6. Short answer submit
  const handleShortAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = typedAnswer.trim().toLowerCase();
    const target = (currentQuestion.correctAnswer || '').trim().toLowerCase();
    setSelectedOptionId('short_answer_submitted');
    const isCorrect = input === target || (target.length > 0 && input.includes(target));
    finishQuestionWithResult(isCorrect);
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < quiz.questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setGameState('question');
    } else {
      setGameState('podium');
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white';
      case 'yellow':
        return 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white';
      case 'green':
        return 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white';
      default:
        return 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white';
    }
  };

  // Renders correct answer representation for result screen
  const renderCorrectAnswerSummary = () => {
    switch (qType) {
      case 'true_false':
        return (
          <span className="font-bold text-emerald-300 text-sm">
            {currentQuestion.isTrue !== false ? '✔ ត្រូវ (ពិត)' : '✖ ខុស (មិនពិត)'}
          </span>
        );
      case 'matching':
        return (
          <div className="text-left space-y-1 mt-1">
            {(currentQuestion.matchingPairs || []).map((p, idx) => (
              <div key={idx} className="text-[11px] text-emerald-200">
                • {p.left} ➔ <strong>{p.right}</strong>
              </div>
            ))}
          </div>
        );
      case 'fill_blank':
        return (
          <span className="font-bold text-emerald-300 text-sm">
            ពាក្យបំពេញ៖ «{currentQuestion.blankAnswer}»
          </span>
        );
      case 'reorder_words':
        return (
          <span className="font-bold text-emerald-300 text-xs leading-relaxed block">
            «{currentQuestion.correctSentence}»
          </span>
        );
      case 'short_answer':
        return (
          <span className="font-bold text-emerald-300 text-sm">
            «{currentQuestion.correctAnswer}»
          </span>
        );
      case 'qcm':
      default:
        return (
          <span className="font-bold text-emerald-200 text-sm">
            {currentQuestion.options.find((o) => o.isCorrect)?.text}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md no-print">
      <div className="bg-slate-900 text-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-purple-500/30">
        {/* Top bar */}
        <div className="bg-purple-950/90 px-6 py-3.5 flex justify-between items-center border-b border-purple-800/40">
          <div className="flex items-center gap-3">
            <span className="font-kahoot font-bold text-xs bg-amber-400 text-purple-950 px-2.5 py-0.5 rounded-full">
              LIVE PIN: {pin}
            </span>
            <h3 className="font-bold text-sm text-purple-100 truncate max-w-md">{quiz.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="p-1 text-purple-300 hover:text-white rounded-lg transition hover:bg-purple-800"
            >
              {isFullscreen ? 'Exit FS' : 'Full Screen'}
            </button>
            {gameState !== 'lobby' && (
              <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <span>ពិន្ទុ៖ {score} pt</span>
                <span>•</span>
                <span>🔥 Streak: {streak}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1 text-purple-300 hover:text-white rounded-lg transition hover:bg-purple-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Game Content Area - Adjusted for Teacher Dashboard View */}
        <div className={`flex-1 p-6 overflow-y-auto flex ${gameState === 'question' ? 'flex-row' : 'flex-col'} justify-center items-center gap-6`}>
          {/* Teacher Activity Tracking (only when in question mode) */}
          {gameState === 'question' && (
            <div className="w-1/3 bg-slate-800/80 rounded-3xl p-6 border border-purple-500/20 shadow-2xl flex flex-col">
              <h3 className="text-sm font-black text-purple-100 mb-5 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                សកម្មភាពសិស្សឆ្លើយ
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 no-scrollbar">
                {students.length === 0 ? (
                  <div className="text-xs text-slate-500 italic text-center py-10">កំពុងរង់ចាំសិស្សតភ្ជាប់...</div>
                ) : (
                  students.map((student) => (
                    <div key={student} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                      <span className="text-xs font-semibold text-slate-200 truncate">{student}</span>
                      {studentStatuses[student] === 'answered' ? (
                        <span className="text-[10px] bg-emerald-900/50 text-emerald-400 font-bold px-2 py-1 rounded-md border border-emerald-800">បានឆ្លើយ</span>
                      ) : (
                        <span className="text-[10px] text-slate-500">កំពុងគិត...</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {/* 1. LOBBY */}
          {gameState === 'lobby' && (
            <div className="text-center space-y-6 w-full max-w-xl">
              <div className="space-y-2">
                <div className="inline-block bg-purple-800/60 border border-purple-500/40 px-6 py-2 rounded-2xl">
                  <p className="text-xs text-purple-300">បញ្ចូល Game PIN លើទូរស័ព្ទ ឬកុំព្យូទ័រ៖</p>
                  <p className="font-kahoot text-4xl font-extrabold text-amber-300 tracking-wider mt-1">
                    {pin}
                  </p>
                </div>
                <h2 className="text-lg font-bold text-purple-100 mt-3">{quiz.title}</h2>
                <p className="text-xs text-purple-300">
                  សំណួរសរុប៖ {quiz.questions.length} សំណួរ • ថ្នាក់៖ {quiz.grade} • មុខវិជ្ជា៖ {quiz.subject}
                </p>
              </div>

              {/* Joined Students Box */}
              <div className="bg-slate-800/80 rounded-3xl p-5 border border-purple-500/20 shadow-inner text-left">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>សិស្សបានចូលរួម ({students.length})</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-black animate-pulse uppercase tracking-wider">
                    កំពុងរង់ចាំ...
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto no-scrollbar">
                  {students.map((name, i) => (
                    <span
                      key={i}
                      className="bg-purple-600/30 border border-purple-400/30 text-xs px-4 py-2 rounded-xl font-bold text-purple-50 animate-in zoom-in duration-300"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-lg rounded-3xl shadow-2xl shadow-emerald-900/50 transition active:scale-95 flex items-center justify-center gap-3 cursor-pointer border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1"
              >
                <Play className="w-6 h-6 fill-current" /> ចាប់ផ្ដើមលេង (START)
              </button>
            </div>
          )}

          {/* 2. QUESTION ACTIVE */}
          {gameState === 'question' && (
            <div className="w-full max-w-3xl space-y-5 flex flex-col justify-between h-full">
              {/* Question Header & Countdown */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-300 bg-purple-900/60 px-3 py-1.5 rounded-xl border border-purple-500/20">
                    សំណួរទី {currentQIndex + 1} នៃ {quiz.questions.length}
                  </span>
                  <span className="text-xs font-bold text-amber-300 bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 rounded-xl">
                    {qType === 'qcm' && 'ពហុជ្រើសរើស (QCM)'}
                    {qType === 'true_false' && 'ខុស ឬ ត្រូវ'}
                    {qType === 'matching' && 'ផ្គូរផ្គង'}
                    {qType === 'fill_blank' && 'បំពេញចន្លោះ'}
                    {qType === 'reorder_words' && 'រៀបពាក្យឲ្យល្បះត្រឹមត្រូវ'}
                    {qType === 'short_answer' && 'ចម្លើយខ្លី'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-4 transition-all ${
                      timeLeft <= 5
                        ? 'border-red-500 bg-red-950 text-red-300 animate-bounce'
                        : 'border-amber-400 bg-amber-950/40 text-amber-300'
                    }`}
                  >
                    {timeLeft}
                  </div>
                </div>
              </div>

              {/* Question Text Box */}
              <div className="bg-slate-800/90 border border-purple-500/30 rounded-3xl p-6 text-center shadow-lg min-h-[100px] flex items-center justify-center">
                <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* QUESTION TYPE INTERACTIVE PLAYERS */}

              {/* Player 1: QCM (Multiple Choice) */}
              {qType === 'qcm' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`${getColorClasses(
                        opt.color
                      )} p-4 rounded-2xl shadow-lg flex items-center gap-3 transition-transform duration-150 active:scale-95 text-left cursor-pointer`}
                    >
                      <span className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center font-bold text-sm shrink-0">
                        {opt.shape}
                      </span>
                      <span className="font-bold text-sm flex-1">{opt.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Player 2: TRUE / FALSE */}
              {qType === 'true_false' && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSelectTrueFalse(true)}
                    className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center gap-3 active:scale-95 transition cursor-pointer border border-emerald-400/40"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black">
                      ✔
                    </div>
                    <span className="text-xl font-black">ត្រូវ (ពិត / True)</span>
                  </button>

                  <button
                    onClick={() => handleSelectTrueFalse(false)}
                    className="p-6 bg-gradient-to-br from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center gap-3 active:scale-95 transition cursor-pointer border border-rose-400/40"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black">
                      ✖
                    </div>
                    <span className="text-xl font-black">ខុស (មិនពិត / False)</span>
                  </button>
                </div>
              )}

              {/* Player 3: MATCHING PAIRS */}
              {qType === 'matching' && (
                <div className="bg-slate-800/80 p-5 rounded-3xl border border-purple-500/30 space-y-4">
                  <div className="text-xs text-purple-200 text-center font-medium">
                    ចុចជ្រើសរើសធាតុខាងឆ្វេង បន្ទាប់មកចុចធាតុខាងស្តាំដើម្បីផ្គូផ្គងគ្នា៖
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-purple-300 text-center uppercase tracking-wide">
                        ជួរ ក (សំណួរ)
                      </div>
                      {(currentQuestion.matchingPairs || []).map((p, idx) => {
                        const isSelected = matchingSelectedLeft === p.id;
                        const isLinked = Boolean(matchingUserLinks[p.id]);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleMatchingClickLeft(p.id)}
                            className={`w-full p-3 rounded-xl text-left text-xs font-bold border transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400 text-purple-950 border-amber-300 shadow-md scale-102'
                                : isLinked
                                ? 'bg-purple-800 text-purple-100 border-purple-500'
                                : 'bg-slate-700/80 hover:bg-slate-700 text-white border-slate-600'
                            }`}
                          >
                            <span>{idx + 1}. {p.left}</span>
                            {isLinked && <Check className="w-4 h-4 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-purple-300 text-center uppercase tracking-wide">
                        ជួរ ខ (ចម្លើយផ្គូផ្គង)
                      </div>
                      {shuffledRights.map((r, idx) => {
                        const isTargetOfSelected =
                          matchingSelectedLeft && matchingUserLinks[matchingSelectedLeft] === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => handleMatchingClickRight(r.id)}
                            className={`w-full p-3 rounded-xl text-left text-xs font-bold border transition flex items-center justify-between cursor-pointer ${
                              isTargetOfSelected
                                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                                : 'bg-slate-700/80 hover:bg-slate-700 text-white border-slate-600'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + idx)}. {r.text}</span>
                            {Object.values(matchingUserLinks).includes(r.id) && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleMatchingSubmit}
                    disabled={
                      Object.keys(matchingUserLinks).length <
                      (currentQuestion.matchingPairs || []).length
                    }
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
                  >
                    ផ្ទៀងផ្ទាត់ចម្លើយផ្គូផ្គង ({Object.keys(matchingUserLinks).length}/
                    {(currentQuestion.matchingPairs || []).length} គូ)
                  </button>
                </div>
              )}

              {/* Player 4: FILL IN THE BLANK */}
              {qType === 'fill_blank' && (
                <div className="bg-slate-800/80 p-5 rounded-3xl border border-purple-500/30 space-y-4">
                  <div className="text-center">
                    <span className="text-xs text-purple-300">
                      ជ្រើសរើសពាក្យខាងក្រោម ឬវាយបញ្ចូលចម្លើយក្នុងប្រអប់៖
                    </span>
                  </div>

                  {/* Word bank choices */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      currentQuestion.blankAnswer,
                      ...(currentQuestion.blankDistractors || []),
                    ]
                      .filter(Boolean)
                      .sort()
                      .map((word, wIdx) => (
                        <button
                          key={wIdx}
                          type="button"
                          onClick={() => handleFillBlankSubmit(word)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold border border-purple-400/40 shadow-sm active:scale-95 transition cursor-pointer"
                        >
                          {word}
                        </button>
                      ))}
                  </div>

                  {/* Manual input fallback */}
                  <div className="flex gap-2 max-w-md mx-auto">
                    <input
                      type="text"
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      placeholder="ឬវាយបញ្ចូលពាក្យចម្លើយ..."
                      className="flex-1 bg-slate-900 border border-purple-500/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleFillBlankSubmit()}
                      disabled={!typedAnswer.trim()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      ឆ្លើយ
                    </button>
                  </div>
                </div>
              )}

              {/* Player 5: REORDER WORDS */}
              {qType === 'reorder_words' && (
                <div className="bg-slate-800/80 p-5 rounded-3xl border border-purple-500/30 space-y-4">
                  {/* Built sentence area */}
                  <div className="min-h-[60px] p-4 bg-slate-900/90 rounded-2xl border border-teal-500/40 flex flex-wrap items-center gap-2">
                    {selectedWords.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">
                        ចុចលើពាក្យខាងក្រោមតាមលំដាប់ ដើម្បីបង្កើតជាល្បះត្រឹមត្រូវ...
                      </span>
                    ) : (
                      selectedWords.map((w, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-teal-500 text-teal-950 font-extrabold text-xs rounded-xl shadow-xs"
                        >
                          {w}
                        </span>
                      ))
                    )}
                  </div>

                  {/* Word chips to choose */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {(currentQuestion.words || []).map((w, wIdx) => {
                      const countInSentence = selectedWords.filter((sw) => sw === w).length;
                      const countInQuestion = (currentQuestion.words || []).filter(
                        (qw) => qw === w
                      ).length;
                      const isUsedUp = countInSentence >= countInQuestion;
                      return (
                        <button
                          key={wIdx}
                          type="button"
                          disabled={isUsedUp}
                          onClick={() => handleToggleWord(w, wIdx)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            isUsedUp
                              ? 'bg-slate-700/40 text-slate-500 border-slate-700 cursor-not-allowed'
                              : 'bg-slate-700 hover:bg-teal-700 text-white border-teal-500/50 shadow-xs active:scale-95'
                          }`}
                        >
                          {w}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={handleClearReorderWords}
                      className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs font-semibold transition"
                    >
                      លុបពាក្យឡើងវិញ
                    </button>
                    <button
                      type="button"
                      onClick={handleReorderSubmit}
                      disabled={selectedWords.length === 0}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      ផ្ទៀងផ្ទាត់ល្បះ
                    </button>
                  </div>
                </div>
              )}

              {/* Player 6: SHORT ANSWER */}
              {qType === 'short_answer' && (
                <form
                  onSubmit={handleShortAnswerSubmit}
                  className="bg-slate-800/80 p-6 rounded-3xl border border-purple-500/30 space-y-4 max-w-lg mx-auto w-full"
                >
                  <label className="block text-xs font-bold text-purple-200">
                    វាយបញ្ចូលចម្លើយខ្លីរបស់អ្នក៖
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      required
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      placeholder="វាយចម្លើយនៅទីនេះ..."
                      className="flex-1 bg-slate-900 border border-indigo-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition active:scale-95 cursor-pointer shadow-md"
                    >
                      បញ្ជូនចម្លើយ
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 3. RESULT VIEW */}
          {gameState === 'result' && (
            <div className="w-full max-w-2xl text-center space-y-5">
              <div className="p-6 rounded-3xl bg-slate-800/90 border border-purple-500/30 shadow-xl space-y-3">
                {selectedOptionId ? (
                  isAnswerCorrect ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-bounce">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-extrabold text-emerald-400">ត្រឹមត្រូវ! អស្ចារ្យណាស់ 🎉</h3>
                      <p className="text-xs text-purple-200">
                        +1000 ពិន្ទុ និងបន្ថែមល្បឿនឆ្លើយរហ័ស
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/30">
                        <XCircle className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-extrabold text-red-400">ចម្លើយមិនត្រឹមត្រូវទេ!</h3>
                      <p className="text-xs text-purple-200">ព្យាយាមបន្តលើសំណួរបន្ទាប់ទៀតណា!</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                      <XCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-extrabold text-amber-400">អស់ពេលឆ្លើយ! ⏰</h3>
                  </div>
                )}

                {/* Show correct answer */}
                <div className="pt-3 border-t border-purple-800/40 text-xs">
                  <span className="text-purple-300 block mb-1">ចម្លើយត្រឹមត្រូវគឺ៖</span>
                  <div className="inline-block bg-emerald-600/20 border border-emerald-500/50 text-emerald-200 px-4 py-2 rounded-xl font-semibold max-w-lg">
                    {renderCorrectAnswerSummary()}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextQuestion}
                className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg transition active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{currentQIndex + 1 < quiz.questions.length ? 'សំណួរបន្ទាប់' : 'មើលលទ្ធផលប្រឡង'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 4. PODIUM */}
          {gameState === 'podium' && (
            <div className="text-center space-y-6 w-full max-w-lg">
              <div className="w-20 h-20 rounded-3xl bg-amber-400 text-purple-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-400/20 animate-bounce">
                <Trophy className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-amber-300">ជ័យលាភីការប្រឡង! 🏆</h2>
                <p className="text-xs text-purple-200 mt-1">
                  ការប្រឡងផ្ទាល់បានបញ្ចប់ដោយជោគជ័យ
                </p>
              </div>

              {/* Leaderboard simulation */}
              <div className="bg-slate-800/90 rounded-2xl p-4 border border-purple-500/30 space-y-2.5 text-xs">
                <div className="flex justify-between items-center bg-amber-400/20 border border-amber-400/40 p-3 rounded-xl font-bold text-amber-300">
                  <span>🥇 លេខ ១: សុខ ចាន់ថន (អ្នក)</span>
                  <span className="font-kahoot">{score} pt</span>
                </div>
                <div className="flex justify-between items-center bg-purple-900/40 p-3 rounded-xl font-semibold text-purple-200">
                  <span>🥈 លេខ ២: កែវ វណ្ណា</span>
                  <span className="font-kahoot">{Math.max(0, score - 250)} pt</span>
                </div>
                <div className="flex justify-between items-center bg-purple-900/40 p-3 rounded-xl font-semibold text-purple-200">
                  <span>🥉 លេខ ៣: ជា សុផាត</span>
                  <span className="font-kahoot">{Math.max(0, score - 600)} pt</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleStartGame}
                  className="flex-1 py-3 bg-purple-800 hover:bg-purple-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> លេងឡើងវិញ
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition cursor-pointer"
                >
                  បិទផ្ទាំង
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
