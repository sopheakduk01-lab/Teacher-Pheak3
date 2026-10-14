import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import {
  GRADE_6_SUBJECT_SUMMARIES,
  BUILTIN_STUDENT_EXAMS,
  SubjectLessonSummary,
  StudentSubjectExam,
} from '../data/studentPortalData';
import { StudentLessonReaderModal } from './StudentLessonReaderModal';
import { StudentExamTakingModal } from './StudentExamTakingModal';
import { MathLesson1ExamModal } from './MathLesson1ExamModal';
import { HealthEducation40ExamModal } from './HealthEducation40ExamModal';

interface StudentLearningCarouselSectionProps {
  onNavigateTab: (tab: string) => void;
  onShowToast: (msg: string) => void;
}

export const StudentLearningCarouselSection: React.FC<StudentLearningCarouselSectionProps> = ({
  onNavigateTab,
  onShowToast,
}) => {
  const [subTab, setSubTab] = useState<'summaries' | 'exams'>('summaries');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [selectedSummary, setSelectedSummary] = useState<SubjectLessonSummary | null>(null);
  const [selectedExam, setSelectedExam] = useState<StudentSubjectExam | null>(null);
  const [isMathLesson1ExamOpen, setIsMathLesson1ExamOpen] = useState(false);
  const [isHealthExamOpen, setIsHealthExamOpen] = useState(false);
  const [selectedHealthLesson, setSelectedHealthLesson] = useState(1);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  // Pastel card color configurations matching student portal design
  const summaryColors = [
    {
      bg: 'bg-[#fffdf0]',
      border: 'border-amber-400',
      text: 'text-amber-800',
      badgeBg: 'bg-amber-100 text-amber-700 border border-amber-300',
      btnBg: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    {
      bg: 'bg-[#f0fdf4]',
      border: 'border-emerald-400',
      text: 'text-emerald-800',
      badgeBg: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      bg: 'bg-[#faf5ff]',
      border: 'border-purple-400',
      text: 'text-purple-800',
      badgeBg: 'bg-purple-100 text-purple-700 border border-purple-300',
      btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
    {
      bg: 'bg-[#f0f9ff]',
      border: 'border-sky-400',
      text: 'text-sky-800',
      badgeBg: 'bg-sky-100 text-sky-700 border border-sky-300',
      btnBg: 'bg-sky-600 hover:bg-sky-700 text-white',
    },
    {
      bg: 'bg-[#fff1f2]',
      border: 'border-rose-400',
      text: 'text-rose-800',
      badgeBg: 'bg-rose-100 text-rose-700 border border-rose-300',
      btnBg: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
  ];

  const examColors = [
    {
      bg: 'bg-[#f0fdf4]',
      border: 'border-emerald-400',
      text: 'text-emerald-800',
      badgeBg: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      bg: 'bg-[#fffdf0]',
      border: 'border-amber-400',
      text: 'text-amber-800',
      badgeBg: 'bg-amber-100 text-amber-700 border border-amber-300',
      btnBg: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    {
      bg: 'bg-[#f0f9ff]',
      border: 'border-sky-400',
      text: 'text-sky-800',
      badgeBg: 'bg-sky-100 text-sky-700 border border-sky-300',
      btnBg: 'bg-sky-600 hover:bg-sky-700 text-white',
    },
    {
      bg: 'bg-[#faf5ff]',
      border: 'border-purple-400',
      text: 'text-purple-800',
      badgeBg: 'bg-purple-100 text-purple-700 border border-purple-300',
      btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  ];

  return (
    <>
      <section className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-orange-500 rounded-full shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-moul flex items-center gap-2">
                <span>📖 មេរៀនសង្ខេប</span>
                <span className="text-slate-400 text-xs font-normal">|</span>
                <span>🎓 វិញ្ញាសាប្រឡង</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ស្រ្គូលទៅស្តាំ 👈 ដើម្បីជ្រើសរើសមេរៀនសង្ខេប ឬវិញ្ញាសាប្រឡងតាមគំរូសិស្ស
              </p>
            </div>
          </div>

          {/* Sub-Tabs & Left/Right Arrows */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSubTab('summaries')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  subTab === 'summaries'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📖 មេរៀនសង្ខេប</span>
              </button>
              <button
                type="button"
                onClick={() => setSubTab('exams')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  subTab === 'exams'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🎓 វិញ្ញាសាប្រឡង</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition active:scale-95 cursor-pointer"
                title="ថយក្រោយ"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition active:scale-95 cursor-pointer"
                title="ទៅមុខ"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Swipeable Carousel Cards */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {subTab === 'summaries'
            ? GRADE_6_SUBJECT_SUMMARIES.map((subject, idx) => {
                const colorStyle = summaryColors[idx % summaryColors.length];
                return (
                  <div
                    key={subject.id}
                    className={`shrink-0 w-72 sm:w-80 rounded-3xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition snap-start ${colorStyle.bg} border-2 ${colorStyle.border}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colorStyle.badgeBg}`}>
                          {subject.badgeLabel}
                        </span>
                        <span className="text-2xl select-none">{subject.icon}</span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-moul leading-snug line-clamp-1">
                          {subject.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed font-medium">
                          {subject.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <span>📖</span> {subject.lessonsCount} មេរៀនសង្ខេប
                        </span>
                        <span>&bull;</span>
                        <span className={`flex items-center gap-1 font-bold ${colorStyle.text}`}>
                          <span>⏱️</span> {subject.qcmCount} សំណួរ QCM
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200/70">
                      <button
                        type="button"
                        onClick={() => setSelectedSummary(subject)}
                        className={`w-full ${colorStyle.btnBg} font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-98 cursor-pointer`}
                      >
                        <span>📖 ចូលអានមេរៀនសង្ខេប</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                );
              })
            : BUILTIN_STUDENT_EXAMS.map((exam, idx) => {
                const colorStyle = examColors[idx % examColors.length];
                return (
                  <div
                    key={exam.id}
                    className={`shrink-0 w-72 sm:w-80 rounded-3xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition snap-start ${colorStyle.bg} border-2 ${colorStyle.border}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colorStyle.badgeBg}`}>
                          {exam.categoryLabel}
                        </span>
                        <span className="text-2xl select-none">{exam.subjectIcon}</span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-moul leading-snug line-clamp-1">
                          {exam.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 font-medium">
                          មុខវិជ្ជា ៖ {exam.subjectName} &bull; រយៈពេល ៖ {exam.durationMinutes} នាទី
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className={`font-bold ${colorStyle.text}`}>
                          ⭐ {exam.totalPoints} ពិន្ទុ
                        </span>
                        <span>&bull;</span>
                        <span className="font-bold text-slate-700">
                          📝 {exam.questions.length} សំណួរ
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200/70">
                      <button
                        type="button"
                        onClick={() => {
                          if (exam.id === 'exam-math-lesson1-40q') {
                            setIsMathLesson1ExamOpen(true);
                          } else {
                            setSelectedExam(exam);
                          }
                        }}
                        className={`w-full ${colorStyle.btnBg} font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-98 cursor-pointer`}
                      >
                        <span>📝 ចូលធ្វើវិញ្ញាសា</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Student Portal Jump Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>គំរូមេរៀន និងវិញ្ញាសាស្របតាមកម្មវិធីសិក្សាបឋមសិក្សាថ្នាក់ទី៦</span>
          </span>
          <button
            type="button"
            onClick={() => onNavigateTab('student_portal')}
            className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>បើកមើលផ្ទាំងសិស្សពេញលេញ (Student Portal)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Lesson Reader Modal */}
      <StudentLessonReaderModal
        isOpen={!!selectedSummary}
        onClose={() => setSelectedSummary(null)}
        subject={selectedSummary}
        onTakeQuiz={(quizTitle) => {
          setSelectedSummary(null);
          // Try to find matching exam
          const matchedExam = BUILTIN_STUDENT_EXAMS.find((e) =>
            e.title.toLowerCase().includes(quizTitle.toLowerCase()) ||
            (selectedSummary && e.subject === selectedSummary.subjectKey)
          ) || BUILTIN_STUDENT_EXAMS[0];

          if (matchedExam) {
            if (matchedExam.id === 'exam-math-lesson1-40q') {
              setIsMathLesson1ExamOpen(true);
            } else if (matchedExam.id === 'exam-health-40q' || matchedExam.subject === 'health') {
              if (matchedExam.id === 'exam-health-lesson1-40q') setSelectedHealthLesson(1);
              else if (matchedExam.id === 'exam-health-lesson2-40q') setSelectedHealthLesson(2);
              else if (matchedExam.id === 'exam-health-lesson3-40q') setSelectedHealthLesson(3);
              else if (matchedExam.id === 'exam-health-lesson4-40q') setSelectedHealthLesson(4);
              else setSelectedHealthLesson(0);
              setIsHealthExamOpen(true);
            } else {
              setSelectedExam(matchedExam);
            }
          } else {
            onNavigateTab('student_portal');
            onShowToast(`សូមជ្រើសរើសវិញ្ញាសា «${quizTitle}» ក្នុងផតថលសិស្ស`);
          }
        }}
      />

      {/* Math Lesson 1 40-Question QCM Exam Modal */}
      <MathLesson1ExamModal
        isOpen={isMathLesson1ExamOpen}
        onClose={() => setIsMathLesson1ExamOpen(false)}
        onShowToast={onShowToast}
      />

      {/* Health Education 40-Question QCM Exam Modal */}
      <HealthEducation40ExamModal
        isOpen={isHealthExamOpen}
        onClose={() => setIsHealthExamOpen(false)}
        onShowToast={onShowToast}
        initialLessonNumber={selectedHealthLesson}
      />

      {/* Exam Interactive Runner Modal */}
      <StudentExamTakingModal
        isOpen={!!selectedExam}
        exam={selectedExam}
        onClose={() => setSelectedExam(null)}
        onNavigateToStudentPortal={() => {
          setSelectedExam(null);
          onNavigateTab('student_portal');
        }}
        onShowToast={onShowToast}
      />
    </>
  );
};
