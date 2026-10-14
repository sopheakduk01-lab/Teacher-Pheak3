import React, { useState } from 'react';
import { X, BookOpen, Download, Printer, Search, FileText } from 'lucide-react';

interface KhmerLessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const KhmerLessonPlanModal: React.FC<KhmerLessonPlanModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              📖
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-moul">កិច្ចតែងការបង្រៀនភាសាខ្មែរ ថ្នាក់ទី៦</h2>
              <p className="text-xs text-blue-100">គំរូកិច្ចតែងការបង្រៀនស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ស្វែងរកកិច្ចតែងការ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-800/50 space-y-3">
            <h3 className="font-black text-sm text-blue-700 dark:text-blue-400">
              មេរៀនទី ១ ៖ ការរស់នៅប្រកបដោយសេចក្ដីសុខ
            </h3>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <p><strong>វត្ថុបំណង ៖</strong> សិស្សអាចអាន និងស្វែងយល់អត្ថន័យនៃអត្ថបទបានត្រឹមត្រូវ។</p>
              <p><strong>សម្ភារឧបទេស ៖</strong> សៀវភៅពុម្ពភាសាខ្មែរថ្នាក់ទី៦ បណ្ណពាក្យគន្លឹះ រូបភាពផ្សារភ្ជាប់។</p>
              <p><strong>ជំហានទី ១ (រដ្ឋបាលថ្នាក់) ៖</strong> ពិនិត្យអនាម័យ សណ្ដាប់ធ្នាប់ និងវត្តមានសិស្ស។</p>
              <p><strong>ជំហានទី ២ (រំលឹកមេរៀនចាស់) ៖</strong> សួរសំណួរខ្លីៗអំពីមេរៀនមុន។</p>
              <p><strong>ជំហានទី ៣ (មេរៀនថ្មី) ៖</strong> ណែនាំចំណងជើងមេរៀន និងពន្យល់ពាក្យពិបាក។</p>
              <p><strong>ជំហានទី ៤ (ពង្រឹងចំណេះដឹង) ៖</strong> ឱ្យសិស្សឆ្លើយសំណួរយល់ន័យជាក្រុម។</p>
              <p><strong>ជំហានទី ៥ (កិច្ចការផ្ទះ) ៖</strong> ណែនាំកិច្ចការស្រាវជ្រាវ និងកត់ត្រា។</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => {
              window.print();
              onShowToast?.('បានបញ្ជូនទៅម៉ាស៊ីនបោះពុម្ព!');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពកិច្ចតែងការ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
