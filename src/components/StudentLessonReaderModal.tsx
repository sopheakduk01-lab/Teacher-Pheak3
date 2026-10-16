import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Volume2,
  Sparkles,
  HelpCircle,
  Trophy,
  ArrowRight,
  BookMarked,
  Lightbulb,
  FileText,
  RotateCcw,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubjectLessonSummary } from '../data/studentPortalData';
import { MathLesson1InteractiveViewer } from './MathLesson1InteractiveViewer';
import { MathLesson1ExamModal } from './MathLesson1ExamModal';
import { ScienceLesson1InteractiveViewer } from './ScienceLesson1InteractiveViewer';

interface StudentLessonReaderModalProps {
  isOpen?: boolean;
  summary?: SubjectLessonSummary | null;
  subject?: SubjectLessonSummary | null;
  onClose: () => void;
  onStartExam?: (subjectKey: string) => void;
  onTakeQuiz?: (quizTitle: string) => void;
}

export const StudentLessonReaderModal: React.FC<StudentLessonReaderModalProps> = ({
  isOpen = true,
  summary,
  subject,
  onClose,
  onStartExam,
  onTakeQuiz,
}) => {
  const activeSummary = summary || subject;
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'content' | 'vocabulary' | 'quiz'>('content');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMathLesson1Open, setIsMathLesson1Open] = useState<boolean>(false);
  const [isMathLesson1ExamOpen, setIsMathLesson1ExamOpen] = useState<boolean>(false);
  const [isScienceLesson1Open, setIsScienceLesson1Open] = useState<boolean>(false);

  if (!isOpen || !activeSummary) {
    return null;
  }

  const chapters = activeSummary.chapters || [];
  const currentChapter = chapters[selectedChapterIdx] || chapters[0] || {
    title: 'មេរៀនសង្ខេប',
    keyPoints: [],
    vocabulary: [],
    practiceQuestions: [],
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = activeSummary.subjectKey === 'english' ? 'en-US' : 'km-KH';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const handleCheckQuiz = () => {
    setShowResults(true);
    let correctCount = 0;
    (currentChapter.practiceQuestions || []).forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) {
        correctCount++;
      }
    });

    if (correctCount === (currentChapter.practiceQuestions || []).length && correctCount > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Modal Top Header */}
        <div className={`p-5 sm:p-6 bg-gradient-to-r ${activeSummary.themeColor?.bgGradient || 'from-indigo-900 to-slate-900'} text-white flex items-center justify-between border-b border-white/10`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20 shadow-inner">
              {activeSummary.icon || '📖'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {activeSummary.badgeLabel || 'មេរៀនសង្ខេប'}
                </span>
                <span className="text-xs text-indigo-200 font-bold">
                  {activeSummary.lessonsCount || chapters.length} មេរៀន &bull; {activeSummary.qcmCount || 0} សំណួរ QCM
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold font-moul mt-1 text-white">
                {activeSummary.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter Selection Pill Bar */}
        <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {chapters.map((chap, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedChapterIdx(idx);
                handleResetQuiz();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedChapterIdx === idx
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{chap.title.split('៖')[0] || `មេរៀន ${idx + 1}`}</span>
            </button>
          ))}
        </div>

        {/* Action / Mode Tabs */}
        <div className="px-6 pt-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'content'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>ខ្លឹមសារសង្ខេប</span>
            </button>

            {currentChapter.vocabulary && currentChapter.vocabulary.length > 0 && (
              <button
                onClick={() => setActiveTab('vocabulary')}
                className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'vocabulary'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <BookMarked className="w-4 h-4" />
                <span>ពាក្យគន្លឹះ ({currentChapter.vocabulary.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('quiz')}
              className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>សាកល្បង QCM ({currentChapter.practiceQuestions.length})</span>
            </button>

            {activeSummary.subjectKey === 'math' && (
              <button
                onClick={() => setIsMathLesson1ExamOpen(true)}
                className="mb-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Award className="w-3.5 h-3.5 text-slate-950" />
                <span>📝 វិញ្ញាសា QCM ៤០ សំណួរ</span>
              </button>
            )}

            {(activeSummary.subjectKey === 'science' || activeSummary.title.includes('វិទ្យា')) && (
              <button
                onClick={() => setIsScienceLesson1Open(true)}
                className="mb-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>🌿 មេរៀនទី១ អន្តរកម្ម & ៤០ QCM</span>
              </button>
            )}
          </div>

          <button
            onClick={() => handleSpeak(currentChapter.keyPoints.join('. '))}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              isSpeaking
                ? 'bg-rose-100 text-rose-700 animate-pulse'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'កំពុងអាន...' : 'អានជាសំឡេង'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* SPECIAL INTERACTIVE LESSON 1 BANNER FOR MATHEMATICS */}
          {activeSummary.subjectKey === 'math' && (
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-4 sm:p-5 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shrink-0">
                  📐
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                      បច្ចេកទេសពិសេស
                    </span>
                    <span className="text-xs text-emerald-200 font-bold">ក្បាច់រាប់ &bull; បន្ទាត់ចំនួន &bull; ប្រៀបធៀប &bull; បង្គត់</span>
                  </div>
                  <h4 className="font-moul text-sm sm:text-base mt-0.5 text-white">
                    ផ្ទាំងមេរៀនទី១ អន្តរកម្ម ៖ ចំនួន (MoEYS ទំព័រ ៦-៩)
                  </h4>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    រចនាឡើងយ៉ាងស្រួលមើល មានឧបករណ៍ក្បាច់រាប់អន្តរកម្ម បន្ទាត់ចំនួន និងលំហាត់គ្រប់ទំព័រ។
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMathLesson1Open(true)}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>បើកផ្ទាំងអន្តរកម្ម</span>
              </button>
            </div>
          )}

          {/* SPECIAL INTERACTIVE LESSON 1 BANNER FOR SCIENCE */}
          {(activeSummary.subjectKey === 'science' || activeSummary.title.includes('វិទ្យា')) && (
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-4 sm:p-5 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shrink-0">
                  🌿
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                      មេរៀនអន្តរកម្ម MoEYS
                    </span>
                    <span className="text-xs text-emerald-200 font-bold">ពង្រាយគ្រាប់ &bull; ជម្រក &bull; ការពារខ្លួន &bull; ពិសោធន៍</span>
                  </div>
                  <h4 className="font-moul text-sm sm:text-base mt-0.5 text-white">
                    មេរៀនទី១ អន្តរកម្ម ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ (ទំព័រ ២-៧)
                  </h4>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    រៀនតាម ៧ ផ្ទាំងអន្តរកម្ម មានមន្ទីរពិសោធន៍រំហួតទឹក ល្បែងផ្គូផ្គង និង ៤០ សំណួរ QCM ពេញលេញ។
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsScienceLesson1Open(true)}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>បើកផ្ទាំងអន្តរកម្ម</span>
              </button>
            </div>
          )}

          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-moul">
            {currentChapter.title}
          </h3>

          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed">
                  ចំណុចសំខាន់ៗដែលត្រូវចងចាំ និងយល់ឱ្យច្បាស់សម្រាប់ត្រៀមប្រឡងប្រចាំខែ និងឆមាស។
                </p>
              </div>

              <div className="space-y-3">
                {currentChapter.keyPoints.map((point, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 hover:bg-indigo-50/30 transition"
                  >
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {pIdx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vocabulary' && currentChapter.vocabulary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentChapter.vocabulary.map((voc, vIdx) => (
                <div
                  key={vIdx}
                  className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-200/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-indigo-900 font-moul">
                      {voc.word}
                    </span>
                    <button
                      onClick={() => handleSpeak(`${voc.word} មានន័យថា ${voc.meaning}`)}
                      className="p-1 rounded-lg hover:bg-indigo-100 text-indigo-600"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {voc.meaning}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {currentChapter.practiceQuestions.map((pq, qIdx) => {
                const userAns = selectedAnswers[qIdx];
                const isSelected = userAns !== undefined;
                const isCorrect = userAns === pq.answerIndex;

                return (
                  <div
                    key={qIdx}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {pq.question}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {pq.options.map((opt, oIdx) => {
                        const isChosen = userAns === oIdx;
                        let optionStyle = 'bg-white hover:bg-indigo-50 border-slate-200 text-slate-700';

                        if (showResults) {
                          if (oIdx === pq.answerIndex) {
                            optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isChosen) {
                            optionStyle = 'bg-rose-100 border-rose-400 text-rose-800';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-indigo-600 text-white font-bold border-indigo-600';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(qIdx, oIdx)}
                            className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {showResults && oIdx === pq.answerIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <div className={`p-3 rounded-xl text-xs ${isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        <strong>ពន្យល់ ៖</strong> {pq.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-2">
                {!showResults ? (
                  <button
                    onClick={handleCheckQuiz}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition"
                  >
                    ផ្ទៀងផ្ទាត់ចម្លើយ (Check Answer)
                  </button>
                ) : (
                  <button
                    onClick={handleResetQuiz}
                    className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> <span>សាកល្បងម្តងទៀត</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition"
          >
            បិទ
          </button>

          {(onStartExam || onTakeQuiz) && (
            <button
              onClick={() => {
                onClose();
                if (onStartExam) {
                  onStartExam(activeSummary.subjectKey);
                } else if (onTakeQuiz) {
                  onTakeQuiz(activeSummary.title);
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-md transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>ធ្វើវិញ្ញាសាប្រឡងមុខវិជ្ជានេះ →</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Interactive Math Lesson 1 Modal */}
      <MathLesson1InteractiveViewer
        isOpen={isMathLesson1Open}
        onClose={() => setIsMathLesson1Open(false)}
      />

      {/* 40-Question QCM Exam Modal */}
      <MathLesson1ExamModal
        isOpen={isMathLesson1ExamOpen}
        onClose={() => setIsMathLesson1ExamOpen(false)}
      />

      {/* Interactive Science Lesson 1 Modal */}
      <ScienceLesson1InteractiveViewer
        isOpen={isScienceLesson1Open}
        onClose={() => setIsScienceLesson1Open(false)}
      />
    </div>
  );
};
