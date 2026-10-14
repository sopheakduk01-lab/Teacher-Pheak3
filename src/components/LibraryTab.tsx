import React, { useState } from 'react';
import { BookOpen, Plus, Search, Trash2, Eye, Download, FileText } from 'lucide-react';
import { LibraryBook } from '../types';

interface LibraryTabProps {
  books?: LibraryBook[];
  onAddBook?: (book: Omit<LibraryBook, 'id'>) => void;
  onDeleteBook?: (id: string) => void;
  onShowToast?: (msg: string) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  books = [],
  onAddBook,
  onDeleteBook,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);

  const filteredBooks = books.filter(
    (b) =>
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center text-2xl">
            📚
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black font-moul text-slate-900 dark:text-white">
              បណ្ណាល័យឌីជីថល (Digital Library)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              សៀវភៅពុម្ពផ្លូវការក្រសួងអប់រំ និងឯកសារជំនួយស្មារតីថ្នាក់ទី ៦
            </p>
          </div>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ស្វែងរកសៀវភៅ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-full h-36 rounded-xl bg-gradient-to-tr from-emerald-100 to-teal-50 dark:from-emerald-950 dark:to-teal-900 flex items-center justify-center text-4xl shadow-inner border border-emerald-200/40">
                📖
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  {book.category || 'ទូទៅ'}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {book.description || 'គ្មានការពិពណ៌នា'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[11px] text-slate-400">{book.pagesCount || 100} ទំព័រ</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    onShowToast?.(`កំពុងបើកអាន "${book.title}"`);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>អាន</span>
                </button>
                {onDeleteBook && (
                  <button
                    onClick={() => onDeleteBook(book.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition cursor-pointer"
                    title="លុបសៀវភៅ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal Preview */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white">{selectedBook.title}</h3>
              <button
                onClick={() => setSelectedBook(null)}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                បិទ
              </button>
            </div>
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-2xl border space-y-3">
              <BookOpen className="w-16 h-16 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedBook.description}</p>
              <p className="text-xs text-slate-500">សៀវភៅពុម្ពផ្លូវការថ្នាក់ទី៦ ក្រសួងអប់រំ យុវជន និងកីឡា</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
