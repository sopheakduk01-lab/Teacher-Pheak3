import React from 'react';
import { X, Printer, Calendar } from 'lucide-react';
import { TeacherProfile, Student, AttendanceDatabase, GradeDatabase } from '../types';

interface ThursdayWorkReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  students: Student[];
  attendance: AttendanceDatabase;
  grades: GradeDatabase;
  currentYear?: string;
  onShowToast?: (msg: string) => void;
}

export const ThursdayWorkReportModal: React.FC<ThursdayWorkReportModalProps> = ({
  isOpen,
  onClose,
  teacher,
  students,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
    if (onShowToast) onShowToast('កំពុងបើកទម្រង់បោះពុម្ពរបាយការណ៍ថ្ងៃព្រហស្បតិ៍...');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-khmer">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              📝
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-moul">
                របាយការណ៍បំពេញការងារថ្ងៃព្រហស្បតិ៍ (MoEYS)
              </h2>
              <p className="text-xs text-emerald-200">
                ការវាយតម្លៃ និងតាមដានការបំពេញការងារបច្ចេកទេស និងការបង្រៀន
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-800 dark:text-slate-200">
          <div className="grid grid-cols-2 gap-4 border-b pb-4 border-slate-100 dark:border-slate-700">
            <div>
              <span className="text-slate-500">គ្រូបង្រៀន ៖</span> <strong>{teacher.name}</strong>
            </div>
            <div>
              <span className="text-slate-500">ថ្នាក់ទទួលបន្ទុក ៖</span> <strong>{teacher.className || 'ថ្នាក់ទី ៦'}</strong>
            </div>
            <div>
              <span className="text-slate-500">សាលារៀន ៖</span> <strong>{teacher.schoolName}</strong>
            </div>
            <div>
              <span className="text-slate-500">ចំនួនសិស្សសរុប ៖</span> <strong>{students.length} នាក់</strong>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              ១. សកម្មភាពបង្រៀន និងរៀន
            </h4>
            <p className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl leading-relaxed">
              បានអនុវត្តការបង្រៀនតាមកាលវិភាគកំណត់ ដោយផ្តោតលើវិធីសាស្ត្រសិស្សមជ្ឈមណ្ឌល ការប្រើប្រាស់ស្លាយឌីជីថល និងលំហាត់អនុវត្តជាក្រុម។
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              ២. បញ្ហាប្រឈម និងដំណោះស្រាយ
            </h4>
            <p className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl leading-relaxed">
              សិស្សមួយចំនួននៅយឺតក្នុងការគណនាប្រភាគ គ្រូបានរៀបចំការបង្រៀនបន្ថែម និងបំប៉ននៅម៉ោងស្វ័យសិក្សា។
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              ៣. ទិសដៅបន្ត
            </h4>
            <p className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl leading-relaxed">
              បន្តពង្រឹងការអាន និងសរសេរភាសាខ្មែរ ព្រមទាំងការតាមដានវត្តមានជាប្រចាំជាមួយអាណាព្យាបាល។
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
