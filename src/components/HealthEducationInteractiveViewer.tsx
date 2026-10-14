import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Sparkles,
  Award,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Droplets,
  ShieldCheck,
  Eye,
  Activity,
  Flame,
  Scale,
  Smile,
  Compass,
  ArrowRight,
  RotateCcw,
  Maximize2,
  Minimize2,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  Play,
  Share2,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  HEALTH_EDUCATION_SECTIONS,
  HEALTH_EDUCATION_40_QUESTIONS,
  HealthLessonSection,
} from '../data/healthEducationLessonsData';
import { HealthEducation40ExamModal } from './HealthEducation40ExamModal';
import { HealthTopicIllustration, getLessonTopicType } from './HealthTopicIllustration';

interface HealthEducationInteractiveViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  onOpenExam?: (lessonNumber?: number) => void;
  initialSectionIndex?: number;
}

export const HealthEducationInteractiveViewer: React.FC<HealthEducationInteractiveViewerProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onOpenExam,
  initialSectionIndex,
}) => {
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number>(initialSectionIndex ?? 0);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState<number>(0);

  // Sync initialSectionIndex when prop changes
  React.useEffect(() => {
    if (initialSectionIndex !== undefined) {
      setSelectedSectionIdx(initialSectionIndex);
      setSelectedLessonIdx(0);
    }
  }, [initialSectionIndex]);
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<
    'pyramid' | 'growth' | 'first_aid' | 'decibel' | 'water_f_diagram' | null
  >('pyramid');
  const [isExamModalOpen, setIsExamModalOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Interactive Tool 1: Growth tracker
  const [userGender, setUserGender] = useState<'male' | 'female'>('male');
  const [userAge, setUserAge] = useState<number>(12);
  const [userWeight, setUserWeight] = useState<number>(31);
  const [userHeight, setUserHeight] = useState<number>(138);

  // Interactive Tool 2: First Aid Simulator
  const [firstAidCase, setFirstAidCase] = useState<'burn' | 'nosebleed' | 'choking' | 'dogbite'>('burn');
  const [firstAidStep, setFirstAidStep] = useState<number>(0);

  // Interactive Tool 3: Decibel Sound Meter
  const [soundDb, setSoundDb] = useState<number>(55);

  // Interactive Tool 4: Safe Water F-Diagram barriers
  const [barriers, setBarriers] = useState<{
    boiling: boolean;
    latrine: boolean;
    handwashing: boolean;
    foodCover: boolean;
  }>({
    boiling: true,
    latrine: true,
    handwashing: true,
    foodCover: true,
  });

  if (!isOpen) return null;

  const currentSection = HEALTH_EDUCATION_SECTIONS[selectedSectionIdx] || HEALTH_EDUCATION_SECTIONS[0];
  const currentLesson = currentSection.lessons[selectedLessonIdx] || currentSection.lessons[0];

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'km-KH';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'} overflow-y-auto`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white rounded-[32px] w-full ${isFullscreen ? 'h-full max-h-screen rounded-none' : 'max-w-6xl max-h-[94vh]'} flex flex-col shadow-2xl border border-slate-200 overflow-hidden`}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-700/50 relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20 shadow-inner shrink-0">
              🏥
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                  កម្មវិធីសិក្សាផ្លូវការ MoEYS
                </span>
                <span className="text-xs text-teal-200 font-bold">
                  ថ្នាក់ទី ៦ &bull; ២៥ មេរៀន &bull; ៤០ សំណួរ QCM
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black font-moul mt-1 text-white flex items-center gap-2">
                <span>អប់រំសុខភាព ឌីជីថលអន្តរកម្ម</span>
              </h1>
            </div>
          </div>

          {/* Action Buttons Header */}
          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={() => {
                if (onOpenExam) {
                  onOpenExam(selectedSectionIdx + 1);
                } else {
                  setIsExamModalOpen(true);
                }
              }}
              className="px-3 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">ប្រឡង ៤០ QCM</span>
            </button>

            <button
              onClick={() => handleSpeak(`${currentLesson.title}. ${currentLesson.description}`)}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                isSpeaking ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="អានជាសំឡេង"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
              title="បិទ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Components Pill Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {HEALTH_EDUCATION_SECTIONS.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => {
                setSelectedSectionIdx(idx);
                setSelectedLessonIdx(0);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
                selectedSectionIdx === idx
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <span className="text-base">{sec.icon}</span>
              <span>{sec.title}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedSectionIdx === idx ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                {sec.lessons.length}
              </span>
            </button>
          ))}
        </div>

        {/* Sub-bar: Lesson Pills for the Selected Component */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {currentSection.lessons.map((lesson, idx) => (
            <button
              key={lesson.number}
              onClick={() => setSelectedLessonIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedLessonIdx === idx
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{lesson.title.split('៖')[0] || `មេរៀន ${lesson.number}`}</span>
            </button>
          ))}
        </div>

        {/* Main Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Active Lesson Header Card with Pedagogical Illustration */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-5 sm:p-6 border border-emerald-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full shadow-2xs">
                {currentSection.componentTitle}
              </span>
              <span className="text-xs text-emerald-800 font-bold bg-white/80 px-3 py-1 rounded-full border border-emerald-200">
                មេរៀនទី {currentLesson.number} / ២៥
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-7 space-y-3">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                  {currentLesson.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {currentLesson.description}
                </p>

                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 text-[10px] font-bold">
                    📚 កម្មវិធីសិក្សាជាតិ
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-100/80 text-teal-800 text-[10px] font-bold">
                    🎯 ចំណុចគន្លឹះ {currentLesson.keyConcepts.length} ចំណុច
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100/80 text-amber-900 text-[10px] font-bold">
                    💡 វិធានការអនុវត្ត {currentLesson.practicalGuidelines.length}
                  </span>
                </div>
              </div>

              {/* Lesson Pedagogical Illustration */}
              <div className="lg:col-span-5 bg-white p-2 sm:p-3 rounded-2xl border border-emerald-200/90 shadow-md overflow-hidden">
                <HealthTopicIllustration
                  topic={getLessonTopicType(currentLesson.number)}
                  size="card"
                  className="w-full"
                  showCaption={true}
                />
              </div>
            </div>
          </div>

          {/* Key Concepts & Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Concepts Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span>ចំណុចគន្លឹះសំខាន់ៗនៃមេរៀន</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {currentLesson.keyConcepts.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Guidelines & Warnings */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
                  <Activity className="w-4 h-4" />
                </span>
                <span>ការអនុវត្តជាក់ស្តែង & វិធានការប្រុងប្រយ័ត្ន</span>
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700">
                {currentLesson.practicalGuidelines.map((guideline, i) => (
                  <div key={i} className="flex items-start gap-2 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/50">
                    <span className="text-amber-600 font-bold shrink-0">👉</span>
                    <span className="leading-relaxed">{guideline}</span>
                  </div>
                ))}

                {currentLesson.warnings && currentLesson.warnings.map((warn, i) => (
                  <div key={i} className="flex items-start gap-2 bg-rose-50 p-3 rounded-2xl border border-rose-200 text-rose-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span className="leading-relaxed font-semibold">{warn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= INTERACTIVE SIMULATORS & TOOLS ================= */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  បន្ទប់ពិសោធន៍សុខភាពអន្តរកម្ម (Interactive Labs)
                </span>
                <h3 className="text-base sm:text-xl font-bold font-moul text-white mt-1">
                  ឧបករណ៍អន្តរកម្មជំនួយស្មារតីសិស្ស
                </h3>
              </div>

              {/* Tool Switcher Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setActiveInteractiveTool('pyramid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeInteractiveTool === 'pyramid'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  🥗 ពីរ៉ាមីតអាហារ
                </button>
                <button
                  onClick={() => setActiveInteractiveTool('growth')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeInteractiveTool === 'growth'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ⚖️ តាមដានកម្ពស់/ទម្ងន់
                </button>
                <button
                  onClick={() => setActiveInteractiveTool('first_aid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeInteractiveTool === 'first_aid'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  🩹 សង្គ្រោះបឋម
                </button>
                <button
                  onClick={() => setActiveInteractiveTool('decibel')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeInteractiveTool === 'decibel'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  📢 វាស់កម្រិតសំឡេង (dB)
                </button>
                <button
                  onClick={() => setActiveInteractiveTool('water_f_diagram')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeInteractiveTool === 'water_f_diagram'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  💧 F-Diagram ទឹកស្អាត
                </button>
              </div>
            </div>

            {/* Tool 1: Food Pyramid */}
            {activeInteractiveTool === 'pyramid' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  ចុចលើស្រទាប់ពីរ៉ាមីតអាហារដើម្បីស្វែងយល់ពីកម្រិតបរិភោគត្រឹមត្រូវប្រចាំថ្ងៃ ៖
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-rose-950/50 border border-rose-500/40 p-4 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded-md">
                      កំពូលលើ ៖ បរិភោគតិចបំផុត
                    </span>
                    <h4 className="font-bold text-sm text-rose-200">ខ្លាញ់ ប្រេង ស្ករ អំបិល</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      ត្រូវការតិចតួចបំផុតក្នុងមួយថ្ងៃ។ បើហូបច្រើននាំឱ្យកើតលើសសម្ពាធឈាម បេះដូង ទឹកនោមផ្អែម និងធាត់។
                    </p>
                  </div>

                  <div className="bg-amber-950/50 border border-amber-500/40 p-4 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded-md">
                      ជាន់កណ្តាល ៖ បរិភោគល្មម
                    </span>
                    <h4 className="font-bold text-sm text-amber-200">សាច់ ត្រី ស៊ុត ទឹកដោះគោ សណ្តែក</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      អាហារស្ថាបនារាងកាយ សម្បូរប្រូតេអ៊ីន ជាតិដែក កាល់ស្យូម ជួយសាច់ដុំ ឆ្អឹង និងលូតលាស់កម្ពស់។
                    </p>
                  </div>

                  <div className="bg-emerald-950/50 border border-emerald-500/40 p-4 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-md">
                      ជាន់ក្រោម ៖ បរិភោគច្រើន
                    </span>
                    <h4 className="font-bold text-sm text-emerald-200">បន្លែ និងផ្លែឈើស្រស់</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      អាហារការពាររាងកាយ សម្បូរវីតាមីន និងជាតិសរសៃ (Fiber) ជួយប្រព័ន្ធរំលាយអាហារ និងការពារជំងឺ។
                    </p>
                  </div>

                  <div className="bg-blue-950/50 border border-blue-500/40 p-4 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded-md">
                      បាតក្រោមបង្អស់ ៖ បរិភោគច្រើនបំផុត
                    </span>
                    <h4 className="font-bold text-sm text-blue-200">បាយ មើមដំឡូង នំប៉័ង ទឹកស្អាត</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      អាហារផ្តល់ថាមពល (Carbohydrates) សម្រាប់ដំណើរការរាងកាយរាល់ថ្ងៃ និងទឹកស្អាតយ៉ាងតិច ១.៥-២ លីត្រ។
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tool 2: Growth Tracker (MoEYS Grade 6) */}
            {activeInteractiveTool === 'growth' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  បញ្ចូលទិន្នន័យកម្ពស់ និងទម្ងន់របស់សិស្សដើម្បីផ្ទៀងផ្ទាត់ជាមួយតារាងស្តង់ដារក្រសួងអប់រំ ៖
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-800/80 p-4 rounded-2xl">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">ភេទ</label>
                    <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl">
                      <button
                        onClick={() => setUserGender('male')}
                        className={`py-1 rounded-lg text-xs font-bold ${userGender === 'male' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                      >
                        👦 ប្រុស
                      </button>
                      <button
                        onClick={() => setUserGender('female')}
                        className={`py-1 rounded-lg text-xs font-bold ${userGender === 'female' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}
                      >
                        👧 ស្រី
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">អាយុ (ឆ្នាំ) ៖ {userAge}</label>
                    <input
                      type="range"
                      min={10}
                      max={15}
                      value={userAge}
                      onChange={(e) => setUserAge(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">ទម្ងន់ (គីឡូក្រាម) ៖ {userWeight} kg</label>
                    <input
                      type="range"
                      min={20}
                      max={55}
                      value={userWeight}
                      onChange={(e) => setUserWeight(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">កម្ពស់ (សង់ទីម៉ែត្រ) ៖ {userHeight} cm</label>
                    <input
                      type="range"
                      min={120}
                      max={165}
                      value={userHeight}
                      onChange={(e) => setUserHeight(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Growth result calculation */}
                {(() => {
                  const bmi = (userWeight / Math.pow(userHeight / 100, 2)).toFixed(1);
                  const isHealthyBmi = Number(bmi) >= 15 && Number(bmi) <= 21;
                  return (
                    <div className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 ${
                      isHealthyBmi ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                    }`}>
                      <div>
                        <span className="text-xs font-bold">សន្ទស្សន៍ម៉ាស់រាងកាយ (BMI) ៖ {bmi} kg/m²</span>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {isHealthyBmi
                            ? '✅ រាងកាយលូតលាស់ល្អស្របតាមកម្រិតអាយុ និងស្តង់ដារសុខភាពបឋមសិក្សា!'
                            : Number(bmi) < 15
                            ? '⚠️ រាងកាយស្គមជាងស្តង់ដារបន្តិច ត្រូវបង្កើនអាហារបំប៉នប្រូតេអ៊ីន និងបន្លែផ្លែឈើ។'
                            : '⚠️ រាងកាយលើសទម្ងន់បន្តិច ត្រូវកាត់បន្ថយជាតិផ្អែម/ខ្លាញ់ និងហាត់ប្រាណបន្ថែម។'}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-white/10 rounded-xl text-xs font-black">
                        ស្តង់ដារថ្នាក់ទី៦ MoEYS
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Tool 3: First Aid Interactive Steps */}
            {activeInteractiveTool === 'first_aid' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: 'burn', label: '🔥 រលាកភ្លើង/ទឹកក្តៅ' },
                    { id: 'nosebleed', label: '👃 ហូរឈាមច្រមុះ' },
                    { id: 'choking', label: '🗣️ ស្លាក់អាហារ' },
                    { id: 'dogbite', label: '🐕 ឆ្កែខាំ/ឆ្មាខាំ' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setFirstAidCase(c.id as any);
                        setFirstAidStep(0);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        firstAidCase === c.id
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                  {firstAidCase === 'burn' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-amber-300 text-sm">វិធានការសង្គ្រោះបឋមករណីរលាកភ្លើង ៖</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-emerald-400 block mb-1">ជំហាន ១ ៖ ត្រាំទឹកត្រជាក់</span>
                          បង្ហូរទឹកត្រជាក់ស្អាតលើមុខរបួសភ្លាមៗ ១០-១៥ នាទី។ ហាមប្រើទឹកកកដុំផ្ទាល់។
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-rose-400 block mb-1">ជំហាន ២ ៖ ហាមបែកពងទឹក</span>
                          ហាមយកម្ជុលចាក់បំបែកពងទឹក និងហាមលាបប្រេងកូឡា ទឹកត្រី ឬថ្នាំដុសធ្មេញជាដាច់ខាត!
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-blue-400 block mb-1">ជំហាន ៣ ៖ រុំក្រណាត់ស្អាត</span>
                          គ្របមុខរបួសដោយក្រណាត់ស្អាត ឬបង់ស្អាត ហើយបញ្ជូនទៅមណ្ឌលសុខភាពបើធ្ងន់ធ្ងរ។
                        </div>
                      </div>
                    </div>
                  )}

                  {firstAidCase === 'nosebleed' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-amber-300 text-sm">វិធានការសង្គ្រោះបឋមករណីហូរឈាមច្រមុះ ៖</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-emerald-400 block mb-1">ជំហាន ១ ៖ អង្គុយឱនក្បាលទៅមុខ</span>
                          ឱ្យអ្នករបួសអង្គុយ ឱនក្បាលទៅមុខបន្តិច។ ហាមងើយក្បាលទៅក្រោយព្រោះឈាមហូរចូលក្រពះ។
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-blue-400 block mb-1">ជំហាន ២ ៖ ច្របាច់ចុងច្រមុះ</span>
                          ច្របាច់ចុងច្រមុះផ្នែកទន់ឱ្យជាប់រយៈពេល ១០ នាទី និងដកដង្ហើមតាមមាត់។
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-amber-400 block mb-1">ជំហាន ៣ ៖ ខាកឈាមចេញ</span>
                          ខាកឈាមដែលហូរចូលក្នុងមាត់ចេញក្រៅ។ បើឈាមមិនព្រមឈប់ហូរត្រូវទៅមន្ទីរពេទ្យ។
                        </div>
                      </div>
                    </div>
                  )}

                  {firstAidCase === 'choking' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-amber-300 text-sm">វិធានការសង្គ្រោះបឋមករណីស្លាក់អាហារស្ទះបំពង់ក ៖</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-emerald-400 block mb-1">ជំហាន ១ ៖ ទះខ្នង ៥ ដង</span>
                          ឱ្យជនរងគ្រោះឱនក្បាលទៅមុខបន្តិច ហើយប្រើបាតដៃទះចំកណ្តាលឆ្អឹងស្លាបប្រចៀវ ៥ ដង។
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-amber-400 block mb-1">ជំហាន ២ ៖ សង្កត់ពោះ (Heimlich)</span>
                          ឈរពីក្រោយ ក្រសោបដៃសង្កត់ពោះខាងលើផ្ចិតរុញឡើងលើដើម្បីរុញខ្យល់សួតច្រានវត្ថុស្ទះចេញមកក្រៅ។
                        </div>
                      </div>
                    </div>
                  )}

                  {firstAidCase === 'dogbite' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-rose-300 text-sm">វិធានការសង្គ្រោះបន្ទាន់ករណីឆ្កែខាំ (បង្ការឆ្កែឆ្កួត) ៖</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-emerald-400 block mb-1">ជំហាន ១ ៖ លាងទឹកសាប៊ូ ១៥ នាទី</span>
                          លាងមុខរបួសភ្លាមៗជាមួយទឹកស្អាតហូរខ្លាំង និងសាប៊ូដុសយ៉ាងហ្មត់ចត់យ៉ាងតិច ១៥ នាទី។
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-amber-400 block mb-1">ជំហាន ២ ៖ លាបបេតាឌីន</span>
                          ជូតស្ងួតហើយលាបថ្នាំសម្លាប់មេរោគបេតាឌីន ឬជាតិអាល់កុល ៧០°។
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="font-bold text-rose-400 block mb-1">ជំហាន ៣ ៖ ចាក់វ៉ាក់សាំងបន្ទាន់</span>
                          ប្រញាប់ទៅកាន់វិទ្យាស្ថានប៉ាស្ទ័រ ឬមន្ទីរពេទ្យដើម្បីចាក់វ៉ាក់សាំងបង្ការឆ្កែឆ្កួតជាបន្ទាន់!
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tool 4: Decibel Meter */}
            {activeInteractiveTool === 'decibel' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  អូសរបារដើម្បីមើលកម្រិតសំឡេង (dB) និងផលប៉ះពាល់ដល់សោតវិញ្ញាណ ៖
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>កម្រិតសំឡេង ៖ <strong className="text-amber-400 text-base">{soundDb} dB</strong></span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      soundDb <= 65 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {soundDb <= 65 ? 'កម្រិតសុវត្ថិភាព (ធម្មតា)' : 'កម្រិតឮខ្លាំង (គ្រោះថ្នាក់ដល់ត្រចៀក!)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={140}
                    value={soundDb}
                    onChange={(e) => setSoundDb(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>២០ dB (ខ្សឹប)</span>
                    <span>៤៥-៦៥ dB (ការសន្ទនាធម្មតា)</span>
                    <span>៨៥ dB (ចរាចរណ៍កកស្ទះ)</span>
                    <span>១២០ dB (ស៊ីរ៉ែន/ធុងបាស)</span>
                    <span>១៤០ dB (យន្តហោះហោះហើរ)</span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  soundDb <= 65
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : soundDb <= 85
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                }`}>
                  {soundDb <= 65 && '✅ សំឡេងនេះមានសុវត្ថិភាពសម្រាប់ត្រចៀក និងមិនរំខានដល់ការផ្ចង់អារម្មណ៍ ឬដំណេកឡើយ។'}
                  {soundDb > 65 && soundDb <= 85 && '⚠️ សំឡេងនេះចាប់ផ្តើមឮខ្លាំង។ ប្រសិនបើស្តាប់យូរម៉ោងអាចបណ្តាលឱ្យឈឺក្បាល តានតឹង និងថយចុះការផ្ចង់អារម្មណ៍។'}
                  {soundDb > 85 && '🚨 គ្រោះថ្នាក់ខ្លាំង! សំឡេងកម្រិតនេះអាចបំផ្លាញក្រដាសត្រចៀក បណ្តាលឱ្យថ្លង់ ឬខូចសោតវិញ្ញាណជាអចិន្ត្រៃយ៍។ ត្រូវពាក់ឧបករណ៍ការពារត្រចៀកជាបន្ទាន់!'}
                </div>
              </div>
            )}

            {/* Tool 5: Safe Water F-Diagram */}
            {activeInteractiveTool === 'water_f_diagram' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  បើក/បិទរបាំងការពារ (Barriers) ដើម្បីមើលការកាត់ផ្តាច់ផ្លូវចម្លងមេរោគពីលាមក (F-Diagram) ៖
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setBarriers((b) => ({ ...b, boiling: !b.boiling }))}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                      barriers.boiling ? 'bg-emerald-900/60 border-emerald-400 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>🔥 ដាំទឹកពុះ</span>
                    <span>{barriers.boiling ? '✅' : '❌'}</span>
                  </button>

                  <button
                    onClick={() => setBarriers((b) => ({ ...b, latrine: !b.latrine }))}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                      barriers.latrine ? 'bg-emerald-900/60 border-emerald-400 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>🚽 ប្រើបង្គន់អនាម័យ</span>
                    <span>{barriers.latrine ? '✅' : '❌'}</span>
                  </button>

                  <button
                    onClick={() => setBarriers((b) => ({ ...b, handwashing: !b.handwashing }))}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                      barriers.handwashing ? 'bg-emerald-900/60 border-emerald-400 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>🧼 លាងដៃនឹងសាប៊ូ</span>
                    <span>{barriers.handwashing ? '✅' : '❌'}</span>
                  </button>

                  <button
                    onClick={() => setBarriers((b) => ({ ...b, foodCover: !b.foodCover }))}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                      barriers.foodCover ? 'bg-emerald-900/60 border-emerald-400 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>🍲 គ្របចំណីអាហារ</span>
                    <span>{barriers.foodCover ? '✅' : '❌'}</span>
                  </button>
                </div>

                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs">
                  <span className="font-bold text-amber-300 block mb-1">ការវិភាគ F-Diagram ៖</span>
                  {barriers.boiling && barriers.latrine && barriers.handwashing && barriers.foodCover ? (
                    <span className="text-emerald-400 font-semibold">
                      🌟 ល្អឥតខ្ចោះ! ផ្លូវចម្លងមេរោគទាំងអស់ (Fluids, Fields, Flies, Fingers) ត្រូវបានកាត់ផ្តាច់ទាំងស្រុង។ ក្រុមគ្រួសារមានសុខភាពល្អ និងជៀសផុតពីជំងឺរាក គ្រុនពោះវៀន និងដង្កូវព្រូន!
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      ⚠️ នៅមានចន្លោះប្រហោងចម្លងមេរោគ! សូមបើកដំណើរការរបាំងការពារទាំងអស់ដើម្បីការពារសុខភាពពេញលេញ។
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Cards */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-slate-950 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-400">
                វិញ្ញាសាប្រឡងស្តង់ដារ ៤០ សំណួរ
              </span>
              <h3 className="text-base sm:text-xl font-black font-moul text-slate-950">
                តេស្តសមត្ថភាព QCM ៤០ សំណួរ ពេញលេញ ២៥ មេរៀន
              </h3>
              <p className="text-xs text-slate-900 font-medium">
                សំណួរជ្រើសរើសចម្លើយត្រឹមត្រូវ ចែកចេញជា ៥ ផ្នែកធំៗ គ្របដណ្តប់គ្រប់សមាសភាគក្នុងសៀវភៅក្រសួង។
              </p>
            </div>

            <button
              onClick={() => {
                if (onOpenExam) {
                  onOpenExam(selectedSectionIdx + 1);
                } else {
                  setIsExamModalOpen(true);
                }
              }}
              className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>ចាប់ផ្តើមប្រឡងឥឡូវនេះ (៤០ QCM) →</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Standalone 40 QCM Exam Modal */}
      {isExamModalOpen && (
        <HealthEducation40ExamModal
          isOpen={isExamModalOpen}
          onClose={() => setIsExamModalOpen(false)}
          onShowToast={onShowToast}
          initialLessonNumber={selectedSectionIdx + 1}
        />
      )}
    </div>
  );
};
