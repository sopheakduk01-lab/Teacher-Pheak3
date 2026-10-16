import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Maximize2,
  Minimize2,
  Award,
  Mic,
  PenTool,
  MessageCircle,
  HelpCircle,
  Clock,
  Calendar,
  Smile,
  Shield,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ENGLISH_GRADE_6_CHAPTERS,
  ENGLISH_GRADE_6_UNITS,
  EnglishLessonUnit,
} from '../data/englishGrade6Data';
import { EnglishTopicIllustration, getEnglishUnitTopicType } from './EnglishTopicIllustration';

interface EnglishGrade6InteractiveViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExam?: () => void;
  initialUnitIndex?: number;
}

export const EnglishGrade6InteractiveViewer: React.FC<EnglishGrade6InteractiveViewerProps> = ({
  isOpen,
  onClose,
  onOpenExam,
  initialUnitIndex = 0,
}) => {
  const [currentUnitIdx, setCurrentUnitIdx] = useState<number>(initialUnitIndex);
  const [activeSectionTab, setActiveSectionTab] = useState<
    'vocabulary' | 'spelling' | 'conversation' | 'language_focus' | 'reading' | 'speaking' | 'writing'
  >('vocabulary');

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showKhmerTranslation, setShowKhmerTranslation] = useState<boolean>(true);

  // Interactive Spelling State
  const [spellingWordIdx, setSpellingWordIdx] = useState<number>(0);
  const [userSpellingInput, setUserSpellingInput] = useState<string>('');
  const [spellingFeedback, setSpellingFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Interactive Exercises State
  const [selectedGrammarAnswers, setSelectedGrammarAnswers] = useState<Record<number, string>>({});
  const [selectedReadingAnswers, setSelectedReadingAnswers] = useState<Record<number, string>>({});
  const [writingInputs, setWritingInputs] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const currentUnit: EnglishLessonUnit = ENGLISH_GRADE_6_UNITS[currentUnitIdx] || ENGLISH_GRADE_6_UNITS[0];

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

  const handleCheckSpelling = () => {
    const targetWord = currentUnit.spellingWords[spellingWordIdx]?.toLowerCase() || '';
    if (userSpellingInput.trim().toLowerCase() === targetWord) {
      setSpellingFeedback('correct');
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } else {
      setSpellingFeedback('wrong');
    }
  };

  const sectionTabs = [
    { id: 'vocabulary', label: '១. Vocabulary', icon: '🔤', desc: 'វាក្យសព្ទ & រូបភាព' },
    { id: 'spelling', label: '២. Spelling', icon: '✍️', desc: 'ប្រកបតួអក្សរ' },
    { id: 'conversation', label: '៣. Conversation', icon: '💬', desc: 'កិច្ចសន្ទនា' },
    { id: 'language_focus', label: '៤. Language Focus', icon: '📐', desc: 'វេយ្យាករណ៍' },
    { id: 'reading', label: '៥. Reading', icon: '📖', desc: 'អំណានយល់ន័យ' },
    { id: 'speaking', label: '៦. Speaking', icon: '🗣️', desc: 'អនុវត្តការនិយាយ' },
    { id: 'writing', label: '៧. Writing', icon: '📝', desc: 'លំហាត់សរសេរ' },
  ] as const;

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'} overflow-y-auto`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white rounded-[32px] w-full ${isFullscreen ? 'h-full max-h-screen rounded-none' : 'max-w-6xl max-h-[94vh]'} flex flex-col shadow-2xl border border-slate-200 overflow-hidden`}
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-700/50 relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20 shadow-inner shrink-0">
              {currentUnit.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                  English Grade 6 • MoEYS
                </span>
                <span className="text-xs text-indigo-200 font-bold">
                  {currentUnit.pages} &bull; ៧ ផ្នែកពេញលេញ
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black font-moul mt-1 text-white flex items-center gap-2">
                <span>{currentUnit.unitTitle}</span>
              </h1>
            </div>
          </div>

          {/* Action Buttons Header */}
          <div className="flex items-center gap-2 relative z-10">
            {onOpenExam && (
              <button
                onClick={onOpenExam}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">ប្រឡង ៤០ សំណួរ QCM</span>
                <span className="sm:hidden">៤០ QCM</span>
              </button>
            )}

            <button
              onClick={() => setShowKhmerTranslation(!showKhmerTranslation)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 border ${
                showKhmerTranslation
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-white/10 border-white/20 text-indigo-200 hover:bg-white/20'
              }`}
              title="បិទ/បើកប្រែជាភាសាខ្មែរ"
            >
              <span>🇰🇭 {showKhmerTranslation ? 'ប្រែខ្មែរ : បើក' : 'ប្រែខ្មែរ : បិទ'}</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title={isFullscreen ? 'បង្រួមតូច' : 'ពង្រីកពេញអេក្រង់'}
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

        {/* Units Navigation Horizontal Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {ENGLISH_GRADE_6_UNITS.map((unit, idx) => {
            const isSelected = currentUnitIdx === idx;
            return (
              <button
                key={unit.id}
                onClick={() => {
                  setCurrentUnitIdx(idx);
                  setSpellingWordIdx(0);
                  setUserSpellingInput('');
                  setSpellingFeedback(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-md ring-2 ring-blue-400/40'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{unit.icon}</span>
                <span>Unit {unit.unitNumber}: {unit.unitTitle}</span>
              </button>
            );
          })}
        </div>

        {/* 7 Core Section Tabs (Vocabulary, Spelling, Conversation, Language Focus, Reading, Speaking, Writing) */}
        <div className="bg-slate-50 border-b border-slate-200/90 px-3 sm:px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {sectionTabs.map((tab) => {
            const isActive = activeSectionTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSectionTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Section Content Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          {/* Active Unit Hero Card with Pedagogical Illustration */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 rounded-3xl p-5 sm:p-6 border border-blue-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-full shadow-2xs">
                {currentUnit.chapterTitle}
              </span>
              <span className="text-xs text-blue-800 font-bold bg-white/80 px-3 py-1 rounded-full border border-blue-200">
                Unit {currentUnit.unitNumber} &bull; {currentUnit.pages}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-7 space-y-3">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                  Unit {currentUnit.unitNumber}: {currentUnit.unitTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {currentUnit.languageFocus.grammarTopic} &bull; {currentUnit.reading.title}
                </p>

                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100/80 text-blue-800 text-[10px] font-bold">
                    📖 វាក្យសព្ទ {currentUnit.vocabulary.length} ពាក្យ
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100/80 text-indigo-800 text-[10px] font-bold">
                    💬 សន្ទនា & អំណាន
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 text-[10px] font-bold">
                    ✍️ លំហាត់ប្រកប & សរសេរ
                  </span>
                </div>
              </div>

              {/* Unit Pedagogical Illustration */}
              <div className="lg:col-span-5 bg-white p-2 sm:p-3 rounded-2xl border border-blue-200/90 shadow-md overflow-hidden">
                <EnglishTopicIllustration
                  topic={getEnglishUnitTopicType(currentUnit.id)}
                  size="card"
                  className="w-full"
                  showCaption={true}
                />
              </div>
            </div>
          </div>

          {/* ================= 1. VOCABULARY ================= */}
          {activeSectionTab === 'vocabulary' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>A. Vocabulary — Look at the pictures. Listen and repeat.</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    ចុចលើប៊ូតុងសំឡេង ដើម្បីស្តាប់ការបញ្ចេញសំឡេងភាសាអង់គ្លេសត្រឹមត្រូវ
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentUnit.vocabulary.map((v, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl shadow-2xs">
                        {v.icon}
                      </span>
                      <button
                        onClick={() => handleSpeak(v.word)}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                        title="ស្តាប់សំឡេង"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <h4 className="text-lg font-black text-slate-900">{v.word}</h4>
                        <span className="text-xs text-slate-400 font-mono">{v.phonetic}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {v.pos}
                        </span>
                      </div>
                      {showKhmerTranslation && (
                        <p className="text-xs font-bold text-blue-700 mt-1">{v.khmerMeaning}</p>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                      "{v.example}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 2. SPELLING ================= */}
          {activeSectionTab === 'spelling' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  B. Spelling — Spell each word in the box with your partner.
                </h3>
                <p className="text-xs text-slate-500">
                  រៀនប្រកបតួអក្សរម្តងមួយៗ (Letter by letter) តាមគំរូសៀវភៅ MoEYS
                </p>
              </div>

              {/* Word Selector Chips */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {currentUnit.spellingWords.map((word, idx) => (
                  <button
                    key={word}
                    onClick={() => {
                      setSpellingWordIdx(idx);
                      setUserSpellingInput('');
                      setSpellingFeedback(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      spellingWordIdx === idx
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* Interactive Spelling Practice Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    ពាក្យដែលត្រូវប្រកប ៖
                  </span>
                  <h4 className="text-3xl font-black text-slate-900 tracking-wider">
                    {currentUnit.spellingWords[spellingWordIdx]}
                  </h4>
                  <p className="text-xs text-slate-500">
                    គំរូប្រកប ៖ "{currentUnit.spellingWords[spellingWordIdx]?.split('').join('-')}"
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleSpeak(`Please spell the word ${currentUnit.spellingWords[spellingWordIdx]}`)}
                    className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>ស្តាប់សំណួរប្រកប</span>
                  </button>
                  <button
                    onClick={() => handleSpeak(currentUnit.spellingWords[spellingWordIdx]?.split('').join(' '))}
                    className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>ស្តាប់ការប្រកបអក្សរ</span>
                  </button>
                </div>

                <div className="space-y-3 max-w-sm mx-auto">
                  <input
                    type="text"
                    value={userSpellingInput}
                    onChange={(e) => {
                      setUserSpellingInput(e.target.value);
                      setSpellingFeedback(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheckSpelling();
                    }}
                    placeholder="វាយបញ្ចូលពាក្យដើម្បីផ្ទៀងផ្ទាត់..."
                    className="w-full text-center text-lg font-bold p-3 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={handleCheckSpelling}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      ផ្ទៀងផ្ទាត់ការប្រកប
                    </button>
                    <button
                      onClick={() => {
                        setUserSpellingInput('');
                        setSpellingFeedback(null);
                      }}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {spellingFeedback === 'correct' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>ត្រឹមត្រូវណាស់! អ្នកបានប្រកបបានយ៉ាងស្ទាត់ជំនាញ។</span>
                    </div>
                  )}

                  {spellingFeedback === 'wrong' && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center justify-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>មិនទាន់ត្រឹមត្រូវទេ។ សូមព្យាយាមម្តងទៀត!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. CONVERSATION ================= */}
          {activeSectionTab === 'conversation' && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    C. Conversation — Listen to your teacher and repeat.
                  </h3>
                  <p className="text-xs text-slate-500">
                    កិច្ចសន្ទនាផ្លូវការតាមគំរូសៀវភៅ MoEYS ចុចលើបន្ទាត់នីមួយៗដើម្បីស្តាប់សំឡេង
                  </p>
                </div>
              </div>

              {currentUnit.conversations.map((conv, cIdx) => (
                <div key={cIdx} className="space-y-4">
                  <div className="space-y-3">
                    {conv.lines.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        onClick={() => handleSpeak(line.text)}
                        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-blue-300 hover:shadow-xs transition cursor-pointer flex items-start gap-3.5 group"
                      >
                        <span className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shrink-0 mt-0.5">
                          {line.avatar}
                        </span>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-blue-700">{line.speaker}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(line.text);
                              }}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 group-hover:text-blue-600 transition"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="font-bold text-sm text-slate-900">{line.text}</p>
                          {showKhmerTranslation && (
                            <p className="text-xs text-slate-500 font-medium">{line.translation}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= 4. LANGUAGE FOCUS ================= */}
          {activeSectionTab === 'language_focus' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-5 sm:p-6 border border-indigo-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black">
                    D
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                      Language Focus (វេយ្យាករណ៍គន្លឹះ)
                    </span>
                    <h3 className="text-base sm:text-xl font-black text-slate-900">
                      {currentUnit.languageFocus.grammarTopic}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {currentUnit.languageFocus.rule}
                </p>

                {currentUnit.languageFocus.formula && (
                  <div className="p-3 bg-white rounded-2xl border border-indigo-200 font-mono text-xs sm:text-sm font-bold text-indigo-900 shadow-2xs">
                    💡 រូបមន្ត ៖ {currentUnit.languageFocus.formula}
                  </div>
                )}

                {/* Examples Box */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">ឧទាហរណ៍ ៖</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentUnit.languageFocus.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-white/90 rounded-xl border border-slate-200 text-xs space-y-1">
                        {ex.question && (
                          <div className="font-semibold text-slate-600">Q: {ex.question}</div>
                        )}
                        <div className="font-bold text-indigo-700">A: {ex.answer}</div>
                        {ex.note && <div className="text-[10px] text-slate-400 font-mono">({ex.note})</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Practice Exercises */}
              <div className="space-y-3">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>លំហាត់អនុវត្តវេយ្យាករណ៍ (Practice) ៖</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentUnit.languageFocus.practiceExercises.map((ex, idx) => {
                    const selected = selectedGrammarAnswers[idx];
                    const isCorrect = selected === ex.answer;

                    return (
                      <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{ex.instruction}</span>
                        <p className="font-bold text-xs sm:text-sm text-slate-900">{ex.prompt}</p>

                        {ex.options && (
                          <div className="flex items-center gap-2 pt-1">
                            {ex.options.map((opt) => (
                              <button
                                key={opt}
                                onClick={() =>
                                  setSelectedGrammarAnswers((prev) => ({ ...prev, [idx]: opt }))
                                }
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                  selected === opt
                                    ? opt === ex.answer
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-rose-600 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {selected && (
                          <p className={`text-[11px] font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isCorrect ? '✅ ត្រឹមត្រូវ!' : `❌ ចម្លើយត្រឹមត្រូវគឺ ៖ "${ex.answer}"`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. READING ================= */}
          {activeSectionTab === 'reading' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm font-black">
                      E
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Reading — {currentUnit.reading.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleSpeak(currentUnit.reading.passage)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isSpeaking ? 'បញ្ឈប់សំឡេង' : 'អានអត្ថបទជាសំឡេង'}</span>
                  </button>
                </div>

                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
                  {currentUnit.reading.passage}
                </div>
              </div>

              {/* Comprehension Questions */}
              <div className="space-y-3">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>សំណួរយល់ន័យអត្ថបទ (Answer the questions) ៖</span>
                </h4>

                <div className="space-y-3">
                  {currentUnit.reading.questions.map((q, qIdx) => {
                    const selected = selectedReadingAnswers[qIdx];
                    const isCorrect = selected === q.answer;

                    return (
                      <div key={qIdx} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
                        <p className="font-bold text-xs sm:text-sm text-slate-900">
                          {qIdx + 1}. {q.question}
                        </p>

                        {q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt) => (
                              <button
                                key={opt}
                                onClick={() =>
                                  setSelectedReadingAnswers((prev) => ({ ...prev, [qIdx]: opt }))
                                }
                                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${
                                  selected === opt
                                    ? opt === q.answer
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-rose-600 text-white border-rose-600'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {selected && (
                          <p className={`text-[11px] font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isCorrect ? '✅ ត្រឹមត្រូវ!' : `❌ ចម្លើយត្រឹមត្រូវគឺ ៖ "${q.answer}"`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. SPEAKING ================= */}
          {activeSectionTab === 'speaking' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm font-black">
                    F
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Speaking — Practice with your partner
                    </h3>
                    <p className="text-xs text-slate-500">{currentUnit.speaking.instruction}</p>
                  </div>
                </div>

                {/* Model Dialogue */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    កិច្ចសន្ទនាគំរូ (Example) ៖
                  </span>

                  <div className="space-y-2">
                    {currentUnit.speaking.modelDialogue.map((line, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSpeak(line.text)}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 flex items-center justify-between gap-2 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-purple-700">{line.speaker}:</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{line.text}</span>
                        </div>
                        <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practice Prompts */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ប្រធានបទអនុវត្តជាមួយមិត្តរួមថ្នាក់ ៖
                  </h4>
                  <div className="space-y-1.5">
                    {currentUnit.speaking.prompts.map((p, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                        👉 {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 7. WRITING ================= */}
          {activeSectionTab === 'writing' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center text-sm font-black">
                    G
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Writing — {currentUnit.writing.instruction}
                    </h3>
                    <p className="text-xs text-slate-500">
                      សរសេរប្រយោគ និងបំពេញចន្លោះក្នុងសៀវភៅកំណត់ហេតុរបស់អ្នក
                    </p>
                  </div>
                </div>

                {currentUnit.writing.wordBank && (
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl space-y-1">
                    <span className="text-[10px] font-black uppercase text-teal-800">ធនាគារពាក្យ (Word Bank) ៖</span>
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {currentUnit.writing.wordBank.map((w) => (
                        <span key={w} className="px-2.5 py-1 rounded-lg bg-white border border-teal-300 text-xs font-bold text-teal-900">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {currentUnit.writing.tasks.map((task, idx) => {
                    const val = writingInputs[idx] || '';
                    const isSubmitted = val.length > 0;

                    return (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          {idx + 1}. {task.prompt}
                        </label>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            setWritingInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                          }
                          placeholder="វាយបញ្ចូលចម្លើយរបស់អ្នក..."
                          className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                        />
                        {isSubmitted && (
                          <div className="text-[11px] text-teal-800 font-bold bg-teal-50/70 p-2 rounded-lg">
                            💡 គំរូចម្លើយ MoEYS ៖ "{task.answer}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= REMEMBER SUMMARY BOX ================= */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              <h4 className="font-black text-sm sm:text-base text-amber-950 font-moul">
                ចំណុចត្រូវចងចាំ (Remember)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/90 p-3 rounded-2xl border border-amber-200/70 space-y-1">
                <strong className="text-amber-900 block font-bold">📚 ពាក្យគន្លឹះ (Key Words) ៖</strong>
                <p className="text-slate-700 leading-relaxed">
                  {currentUnit.remember.vocabList.join(' • ')}
                </p>
              </div>

              <div className="bg-white/90 p-3 rounded-2xl border border-amber-200/70 space-y-1">
                <strong className="text-amber-900 block font-bold">📐 រូបមន្តវេយ្យាករណ៍ (Grammar Point) ៖</strong>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {currentUnit.remember.grammarSummary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
