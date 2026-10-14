import React, { useState } from 'react';
import { Student, BookBorrowingRecord } from '../types';

interface BookLendingTableProps {
  students: Student[];
  borrowingRecords: BookBorrowingRecord[];
  onAddBorrow: (record: BookBorrowingRecord) => void;
  onReturnBook: (id: string) => void;
}

export const BookLendingTable: React.FC<BookLendingTableProps> = ({ students, borrowingRecords, onAddBorrow, onReturnBook }) => {
  const [newBookTitle, setNewBookTitle] = useState('');

  const handleBorrow = (student: Student) => {
    if (!newBookTitle) return;
    onAddBorrow({
      id: `borrow-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      bookTitle: newBookTitle,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'borrowing',
    });
    setNewBookTitle('');
  };

  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 overflow-x-auto">
      <h2 className="text-lg font-bold mb-4 text-slate-800">បញ្ជីខ្ចីសៀវភៅ (អាចខ្ចីបានច្រើនក្បាល)</h2>
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-700">
            <th className="border p-2">ល.រ</th>
            <th className="border p-2">សិស្ស</th>
            <th className="border p-2">សៀវភៅដែលកំពុងខ្ចី</th>
            <th className="border p-2">សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const studentRecords = borrowingRecords.filter(r => r.studentId === student.id && r.status === 'borrowing');
            return (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">
                  <ul className="list-disc ml-4">
                    {studentRecords.map(r => (
                      <li key={r.id}>
                        {r.bookTitle} (ដល់ថ្ងៃ: {r.dueDate})
                        <button onClick={() => onReturnBook(r.id)} className="ml-2 text-red-600 underline">សង</button>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    placeholder="ឈ្មោះសៀវភៅ"
                    className="border p-1 rounded w-32"
                    onChange={(e) => setNewBookTitle(e.target.value)}
                  />
                  <button onClick={() => handleBorrow(student)} className="ml-2 bg-blue-600 text-white p-1 rounded">ខ្ចី</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
