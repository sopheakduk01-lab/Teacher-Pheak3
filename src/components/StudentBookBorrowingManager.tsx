import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Printer, CheckCircle } from 'lucide-react';
import { Student, BookBorrowingRecord, LibraryBook } from '../types';

interface Props {
  students: Student[];
  borrowings?: BookBorrowingRecord[];
  libraryBooks?: LibraryBook[];
  onAddBorrowing?: (record: any) => void;
  onUpdateBorrowing?: (record: any) => void;
  onDeleteBorrowing?: (id: number | string) => void;
  activeBannerTheme?: any;
}

export const StudentBookBorrowingManager: React.FC<Props> = ({
  students,
  borrowings = [],
  libraryBooks = [],
  onAddBorrowing,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number>(students[0]?.id || 1);
  const [bookTitle, setBookTitle] = useState('');

  const handleBorrow = () => {
    if (!bookTitle) return;
    const student = students.find((s) => s.id === selectedStudentId);
    if (onAddBorrowing) {
      onAddBorrowing({
        id: Date.now(),
        studentId: selectedStudentId,
        studentName: student?.name || '',
        bookTitle,
        borrowDate: new Date().toISOString().split('T')[0],
        status: 'កំពុងខ្ចី',
      });
    }
    setBookTitle('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 font-khmer">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            ការគ្រប់គ្រងការខ្ចី-សងសៀវភៅអានរបស់សិស្ស
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            លើកកម្ពស់វប្បធម៌អាន និងការគ្រប់គ្រងបណ្ណាល័យថ្នាក់រៀន
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>បោះពុម្ពបញ្ជីខ្ចី-សង</span>
        </button>
      </div>

      {/* Add Borrow Form */}
      <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            សិស្សខ្ចីសៀវភៅ
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.gender})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            ចំណងជើងសៀវភៅ
          </label>
          <input
            type="text"
            placeholder="ឧ. រឿងទន្សាយផ្កាយ..."
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs"
          />
        </div>

        <button
          onClick={handleBorrow}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> កត់ត្រាការខ្ចី
        </button>
      </div>

      {/* Borrowings List */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <th className="border border-slate-200 dark:border-slate-700 p-2 text-center w-12">ល.រ</th>
              <th className="border border-slate-200 dark:border-slate-700 p-2">ឈ្មោះសិស្ស</th>
              <th className="border border-slate-200 dark:border-slate-700 p-2">ចំណងជើងសៀវភៅ</th>
              <th className="border border-slate-200 dark:border-slate-700 p-2">កាលបរិច្ឆេទខ្ចី</th>
              <th className="border border-slate-200 dark:border-slate-700 p-2 text-center">ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            {borrowings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-400">
                  មិនទាន់មានទិន្នន័យខ្ចីសៀវភៅនៅឡើយទេ។
                </td>
              </tr>
            ) : (
              borrowings.map((b, idx) => (
                <tr key={b.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="border border-slate-200 dark:border-slate-700 p-2 text-center">{idx + 1}</td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold">{b.studentName}</td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2">{b.bookTitle}</td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2">{b.borrowDate}</td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2 text-center text-emerald-600 font-bold">
                    {b.status || 'កំពុងខ្ចី'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
