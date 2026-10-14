import React, { useState } from 'react';
import { HeartHandshake, Printer, Search, CheckCircle } from 'lucide-react';
import { TeacherProfile, Student } from '../types';

interface Props {
  teacher: TeacherProfile;
  students: Student[];
  onShowToast?: (msg: string) => void;
}

export const TeacherParentAgreementsManager: React.FC<Props> = ({
  teacher,
  students,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(students[0] || null);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 font-khmer">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-rose-600" />
            កិច្ចព្រមព្រៀងរវាងគ្រូបន្ទុកថ្នាក់ និងមាតាបិតាសិស្ស
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ការសហការរួមគ្នាក្នុងការតាមដានការសិក្សា និងអាកប្បកិរិយារបស់សិស្ស
          </p>
        </div>
        <button
          onClick={() => {
            window.print();
            if (onShowToast) onShowToast('កំពុងបើកទម្រង់បោះពុម្ពកិច្ចព្រមព្រៀង...');
          }}
          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>បោះពុម្ពកិច្ចព្រមព្រៀង</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="ស្វែងរកឈ្មោះសិស្ស..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs dark:bg-slate-750"
          />
          <div className="max-h-96 overflow-y-auto space-y-1.5">
            {filtered.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                  selectedStudent?.id === s.id
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 font-bold'
                    : 'border-slate-100 hover:bg-slate-50 dark:border-slate-700'
                }`}
              >
                <span>{s.name} ({s.gender})</span>
                {selectedStudent?.id === s.id && <CheckCircle className="w-3.5 h-3.5 text-rose-600" />}
              </div>
            ))}
          </div>
        </div>

        {/* Agreement Preview */}
        <div className="col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 text-xs space-y-4">
          <div className="text-center space-y-1 border-b pb-3">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white">
              កិច្ចសន្យាព្រមព្រៀងរួម
            </h4>
            <p className="text-slate-500">
              សិស្ស ៖ <strong className="text-slate-800 dark:text-white">{selectedStudent?.name || '...'}</strong> | ថ្នាក់ ៖ <strong>{teacher.className || 'ថ្នាក់ទី ៦'}</strong>
            </p>
          </div>

          <div className="space-y-2 leading-relaxed text-slate-700 dark:text-slate-300">
            <p><strong>ភាគីទី ១ (គ្រូបន្ទុកថ្នាក់) ៖ </strong> {teacher.name}</p>
            <p><strong>ភាគីទី ២ (មាតាបិតា/អាណាព្យាបាល) ៖ </strong> អាណាព្យាបាលសិស្ស {selectedStudent?.name || '...'}</p>
            <p className="pt-2"><strong>ខ្លឹមសារកិច្ចព្រមព្រៀង ៖</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>តាមដាន និងជំរុញការសិក្សារបស់សិស្សទាំងនៅសាលា និងនៅផ្ទះ។</li>
              <li>ជូនដំណឹងគ្នាទៅវិញទៅមកពេលសិស្សមានអវត្តមាន ឬបញ្ហាសុខភាព។</li>
              <li>ចូលរួមសហការក្នុងសកម្មភាពអភិវឌ្ឍន៍សាលារៀន និងថ្នាក់រៀន។</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
