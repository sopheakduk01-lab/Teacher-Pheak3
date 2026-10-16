import React from 'react';
import { BookOpen, Award, CheckCircle2, Copy, FileText, ChevronRight } from 'lucide-react';
import { mathGrade6AllLessons, getMathLessonByPage } from '../data/mathGrade6Book';

interface MathGrade6ReaderViewProps {
  currentPage: number;
  totalPages: number;
  onNavigatePage: (p: number) => void;
  onShowToast: (msg: string) => void;
}

export const MathGrade6ReaderView: React.FC<MathGrade6ReaderViewProps> = ({
  currentPage,
  totalPages,
  onNavigatePage,
  onShowToast,
}) => {
  // Page 1: Official Front Cover
  if (currentPage === 1) {
    return (
      <div className="space-y-6 text-center max-w-2xl mx-auto py-4">
        <div className="p-1 rounded-3xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700 shadow-2xl">
          <div className="bg-gradient-to-b from-slate-900 to-teal-950 text-white p-6 sm:p-10 rounded-[22px] space-y-6">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-emerald-300 tracking-wider">
                ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-teal-200">
                <span>ក្រសួងអប់រំ យុវជន និងកីឡា</span>
              </div>
            </div>

            <div className="relative mx-auto w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
              <img
                src="/math_grade_6_cover.jpg"
                alt="គណិតវិទ្យា ថ្នាក់ទី ៦"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to placeholder if image fails to render
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-3 text-left">
                <span className="font-moul text-amber-300 text-sm">គណិតវិទ្យា ថ្នាក់ទី ៦</span>
                <span className="text-[10px] text-teal-100">សៀវភៅសិក្សាគោល (MoEYS)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-moul text-2xl sm:text-3xl text-amber-300 drop-shadow-md">
                គណិតវិទ្យា ថ្នាក់ទី ៦
              </h1>
              <p className="text-xs text-teal-100 font-medium">
                សៀវភៅសិក្សាគោល កម្រិតបឋមសិក្សា — គ្រប់ ២០ មេរៀន (១៤៥ ទំព័រ)
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-wrap justify-between items-center text-[11px] text-teal-200">
              <span>គ្រឹះស្ថានបោះពុម្ព និងចែកផ្សាយ</span>
              <span>បោះពុម្ពលើកទី១១ ឆ្នាំ២០២០</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onNavigatePage(5)}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>មើលមាតិកា (២០ មេរៀន)</span>
              </button>

              <button
                onClick={() => onNavigatePage(6)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>ចាប់ផ្តើមរៀន មេរៀនទី១</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Page 2: Title Page
  if (currentPage === 2) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-2">
          <h3 className="font-moul text-sm text-slate-700 dark:text-slate-300">ព្រះរាជាណាចក្រកម្ពុជា</h3>
          <p className="font-bold text-xs text-amber-700 dark:text-amber-400">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
        </div>

        <div className="py-6 border-y border-slate-200 dark:border-slate-800 space-y-4">
          <p className="font-bold text-sm text-purple-900 dark:text-purple-300">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
          <h1 className="font-moul text-3xl text-teal-700 dark:text-teal-400">គណិតវិទ្យា</h1>
          <h2 className="font-moul text-xl text-slate-800 dark:text-slate-100">ថ្នាក់ទី ៦</h2>
        </div>

        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <p className="font-bold">បោះពុម្ពផ្សាយដោយ គ្រឹះស្ថានបោះពុម្ព និងចែកផ្សាយ</p>
          <p>អគារ ១៤៨ មហាវិថី ព្រះនរោត្តម រាជធានីភ្នំពេញ</p>
        </div>
      </div>
    );
  }

  // Page 3: Editorial & Legal Information
  if (currentPage === 3) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs leading-relaxed text-slate-800 dark:text-slate-200">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2 text-teal-700 dark:text-teal-400">
          <Award className="w-5 h-5" />
          <h3 className="font-moul text-xs">គណៈកម្មការនិពន្ធ និងការទទួលស្គាល់ផ្លូវការ</h3>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">គណៈកម្មការនិពន្ធ៖</h4>
            <p>លោក ព្រំ វិបុល • លោក សួន ច័ន្ទបូរី • លោក ភី ផន់ • លោក ហាំ សេង</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">អ្នកវាយអត្ថបទ៖</h4>
              <p>លោក ខែម ម៉ារី</p>
            </div>
            <div>
              <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">វិចិត្រករ៖</h4>
              <p>លោក គន់ ជាតិ</p>
            </div>
            <div>
              <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">រៀបរៀង៖</h4>
              <p>លោក អ៊ិន គឹមស្រ៊ុន</p>
            </div>
            <div>
              <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">រចនាទំព័រ៖</h4>
              <p>លោក ខែម ម៉ារី</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">គណៈកម្មការពិនិត្យ៖</h4>
            <p>លោក ឡុង សុផេង • លោក ប៊ូ សន</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-[11px] space-y-1.5 text-teal-950 dark:text-teal-200">
            <p className="font-bold">📜 ការអនុញ្ញាតបោះពុម្ពផ្សាយ៖</p>
            <p>
              បានទទួលការអនុញ្ញាតឱ្យបោះពុម្ពផ្សាយពី <strong>ក្រសួងអប់រំ យុវជន និងកីឡា</strong> តាមប្រកាសលេខ <strong>២៥៧៣ អយក.ប្រក.</strong> ចុះថ្ងៃទី ១៦ ខែ វិច្ឆិកា ឆ្នាំ ២០១១ ដើម្បីប្រើប្រាស់នៅតាមសាលារៀនទូទាំងប្រទេស។
            </p>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-[11px] text-slate-500 space-y-1">
            <p>រក្សាសិទ្ធិ © គ្រឹះស្ថានបោះពុម្ព និងចែកផ្សាយ</p>
            <p>បោះពុម្ពលើកទី១១ ឆ្នាំ២០២០ ចំនួន ១១០ ០០០ ច្បាប់</p>
            <p className="font-mono">ISBN : 9-789-995-001-445</p>
          </div>
        </div>
      </div>
    );
  }

  // Page 4: Preface (អាមុខកថា)
  if (currentPage === 4) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs sm:text-sm leading-relaxed text-justify text-slate-800 dark:text-slate-200">
        <div className="text-center space-y-1 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="font-moul text-base text-teal-700 dark:text-teal-400">អាមុខកថា</h2>
          <p className="text-[11px] text-slate-400 font-bold">PREFACE</p>
        </div>

        <p className="indent-8 font-medium">
          សៀវភៅសិក្សាគោល <strong>គណិតវិទ្យា ថ្នាក់ទី៦</strong> ត្រូវបានរៀបចំឡើងស្របតាមកម្មវិធីសិក្សាគោលបឋមសិក្សារបស់ក្រសួងអប់រំ យុវជន និងកីឡា ដើម្បីបម្រើដល់ការបង្រៀនរបស់លោកគ្រូ អ្នកគ្រូ និងការរៀនសូត្ររបស់សិស្សានុសិស្សនៅទូទាំងព្រះរាជាណាចក្រកម្ពុជា។
        </p>

        <p className="indent-8 font-medium">
          ខ្លឹមសារក្នុងសៀវភៅនេះត្រូវបានរៀបចំឡើងយ៉ាងសម្រិតសម្រាំង ផ្សារភ្ជាប់ជាមួយរូបភាពជាក់ស្តែង និងឧទាហរណ៍ក្នុងជីវភាពរស់នៅប្រចាំថ្ងៃ ដើម្បីជួយឱ្យសិស្សានុសិស្សងាយយល់ ចាប់ពីការគិតលេខងាយៗ រហូតដល់ការដោះស្រាយចំណោទដែលមានលក្ខណៈស៊ីជម្រៅ ព្រមទាំងការអភិវឌ្ឍបំណិនត្រិះរិះពិចារណា និងការច្នៃប្រឌិត។
        </p>

        <p className="indent-8 font-medium">
          គណៈកម្មការនិពន្ធសង្ឃឹមយ៉ាងមុតមាំថា សៀវភៅនេះនឹងក្លាយជាឧបករណ៍សិក្សាដ៏មានតម្លៃ ក្នុងការលើកកម្ពស់គុណភាពអប់រំ និងការបណ្តុះបណ្តាលធនធានមនុស្សសម្រាប់អនាគតប្រទេសជាតិ។ គណៈកម្មការក៏រង់ចាំទទួលនូវរាល់មតិរិះគន់ស្ថាបនាពីសំណាក់លោកគ្រូ អ្នកគ្រូ មាតាបិតា និងអ្នកសិក្សាគ្រប់មជ្ឈដ្ឋានដើម្បីកែលម្អសៀវភៅនេះឱ្យកាន់តែល្អប្រសើរបន្ថែមទៀត។
        </p>

        <div className="pt-6 text-right font-bold text-xs text-teal-800 dark:text-teal-300">
          <p>គណៈកម្មការនិពន្ធ និងរៀបរៀង</p>
          <p className="text-[11px] text-slate-400 font-normal">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
        </div>
      </div>
    );
  }

  // Page 5: Table of Contents (បញ្ជីអត្ថបទ ២០ មេរៀន)
  if (currentPage === 5) {
    return (
      <div className="max-w-4xl mx-auto py-4 space-y-4">
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-md">
          <div className="space-y-0.5">
            <h2 className="font-moul text-sm sm:text-base text-amber-300">បញ្ជីអត្ថបទ និងមាតិកាពេញលេញ</h2>
            <p className="text-xs text-teal-100">សៀវភៅគណិតវិទ្យា ថ្នាក់ទី៦ (២០ មេរៀន — ១៤៥ ទំព័រ)</p>
          </div>
          <span className="text-xs font-mono font-bold bg-white/20 px-3 py-1 rounded-xl">ទំព័រ ៥</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mathGrade6AllLessons.map((lesson) => (
            <div
              key={lesson.lessonNumber}
              onClick={() => onNavigatePage(lesson.startPage + 5)}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-teal-800 dark:text-teal-300 group-hover:text-teal-600 transition">
                    {lesson.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full">
                    ទំព័រ {lesson.startPage}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                <span>{lesson.sections.length} ផ្នែកមេរៀន</span>
                <span className="text-teal-600 group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                  ចូលអាន <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Pages 6 to 145: Textbook Lessons (Pages 1 to 140)
  const textbookPage = currentPage - 5;
  const currentLesson = getMathLessonByPage(textbookPage);

  const handleCopyExercise = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('📋 បានចម្លងលំហាត់/ចំណោទរួចរាល់! អាចបិទភ្ជាប់ (Paste) ទៅកន្លែងផ្សេងបាន។');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-950 text-white p-5 rounded-3xl shadow-lg flex flex-wrap justify-between items-center gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              គណិតវិទ្យា ថ្នាក់ទី៦
            </span>
            <span className="text-xs text-teal-200 font-medium">
              សៀវភៅពុម្ពទំព័រទី {textbookPage} (នៃទំព័រ {currentLesson.startPage} - {currentLesson.endPage})
            </span>
          </div>
          <h2 className="font-moul text-base sm:text-lg text-amber-300">
            {currentLesson.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-white/20 px-3.5 py-1.5 rounded-2xl">
            ទំព័រទី {currentPage} / {totalPages}
          </span>
        </div>
      </div>

      {/* Lesson Summary Callout */}
      <div className="bg-teal-50/80 dark:bg-teal-950/40 p-4 rounded-2xl border border-teal-200/80 dark:border-teal-900 text-xs text-teal-950 dark:text-teal-200 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-teal-900 dark:text-teal-300">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>គោលបំណង និងខ្លឹមសារសង្ខេបនៃមេរៀន៖</span>
        </div>
        <p className="font-medium leading-relaxed indent-4">
          {currentLesson.summary}
        </p>
      </div>

      {/* Lesson Sections */}
      <div className="space-y-6">
        {currentLesson.sections.map((sec, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
          >
            {/* Section Title */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-moul text-xs sm:text-sm text-teal-800 dark:text-teal-300 flex items-center gap-2">
                <span>{sec.title}</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-xl">
                សៀវភៅពុម្ព ទំព័រ {sec.page}
              </span>
            </div>

            {/* Theory Body */}
            <div className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line text-justify font-medium">
              {sec.theory}
            </div>

            {/* Formula Card if present */}
            {sec.formula && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    📐 រូបមន្តគន្លឹះ (Formula)
                  </span>
                  <div className="font-mono font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                    {sec.formula}
                  </div>
                </div>
              </div>
            )}

            {/* Examples */}
            {sec.examples.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ឧទាហរណ៍ជាក់ស្តែង និងដំណោះស្រាយ៖</span>
                </span>
                <ul className="space-y-1.5 pl-2 font-medium text-slate-700 dark:text-slate-300">
                  {sec.examples.map((ex, exIdx) => (
                    <li key={exIdx} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exercises & Problems (ចំណោទ) */}
            {sec.exercises.length > 0 && (
              <div className="bg-purple-50/70 dark:bg-purple-950/30 p-4 sm:p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5 text-xs sm:text-sm">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>លំហាត់ និងចំណោទអនុវត្តពីសៀវភៅពុម្ព៖</span>
                  </span>

                  <button
                    onClick={() => handleCopyExercise(sec.exercises.join('\n\n'))}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 text-purple-800 dark:text-purple-300 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                    title="ចម្លងលំហាត់ទាំងអស់"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="hidden sm:inline">ចម្លងលំហាត់</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {sec.exercises.map((exe, exeIdx) => (
                    <div
                      key={exeIdx}
                      className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900/40 text-slate-800 dark:text-slate-200 font-medium leading-relaxed"
                    >
                      {exe}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
