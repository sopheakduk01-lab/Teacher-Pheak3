import React from 'react';
import { FileBadge, Printer } from 'lucide-react';
import { TeacherProfile, Student } from '../types';

interface Props {
  teacher: TeacherProfile;
  students: Student[];
  onShowToast?: (msg: string) => void;
}

export const TeacherPrincipalAgreementEditor: React.FC<Props> = ({
  teacher,
  students,
  onShowToast,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 font-khmer">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileBadge className="w-5 h-5 text-purple-600" />
            កិច្ចព្រមព្រៀងការងាររវាងគ្រូបន្ទុកថ្នាក់ និងនាយកសាលា
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ការអនុវត្តកាតព្វកិច្ចវិជ្ជាជីវៈ និងការគ្រប់គ្រងថ្នាក់រៀនគំរូ
          </p>
        </div>
        <button
          onClick={() => {
            window.print();
            if (onShowToast) onShowToast('កំពុងបើកទម្រង់បោះពុម្ពកិច្ចព្រមព្រៀង...');
          }}
          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>បោះពុម្ពកិច្ចព្រមព្រៀង</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 text-xs space-y-4">
        <div className="space-y-2 leading-relaxed text-slate-700 dark:text-slate-300">
          <p><strong>ភាគី «ក» (នាយកសាលា) ៖ </strong> នាយក{teacher.schoolName}</p>
          <p><strong>ភាគី «ខ» (គ្រូបន្ទុកថ្នាក់) ៖ </strong> {teacher.name} (ទទួលបន្ទុក {teacher.className || 'ថ្នាក់ទី ៦'})</p>
          <p className="pt-2"><strong>ការប្តេជ្ញាចិត្តរួម ៖</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>អនុវត្តកម្មវិធីសិក្សាជាតិឲ្យបានពេញលេញ ១០០% ស្របតាមកាលវិភាគ។</li>
            <li>ពង្រឹងវត្តមានសិស្ស និងកាត់បន្ថយអត្រាបោះបង់ការសិក្សាឲ្យនៅកម្រិតទាបបំផុត។</li>
            <li>រៀបចំបន្ទប់រៀនតាមស្តង់ដាសាលារៀនគំរូ និងបរិស្ថានបៃតង។</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
