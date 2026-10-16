import React, { useState, useMemo } from 'react';
import { 
  BookMarked, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Printer, 
  FileText,
  User,
  Calendar,
  X,
  ChevronRight,
  Filter,
  Save,
  ArrowRight,
  BookOpen,
  UserCheck,
  LayoutList,
  History,
  Check,
  Library
} from 'lucide-react';
import { Student, BookBorrowingRecord, LibraryBook } from '../types';
import { toKhmerNum, getKhmerCombinedDate } from '../utils/khmerDate';
import { motion, AnimatePresence } from 'motion/react';

interface StudentBookBorrowingManagerProps {
  students: Student[];
  borrowings: BookBorrowingRecord[];
  libraryBooks: LibraryBook[];
  onAddBorrowing: (record: Omit<BookBorrowingRecord, 'id'>) => void;
  onUpdateBorrowing: (record: BookBorrowingRecord) => void;
  onDeleteBorrowing: (id: string) => void;
  activeBannerTheme: any;
}

export const StudentBookBorrowingManager: React.FC<StudentBookBorrowingManagerProps> = ({
  students,
  borrowings,
  libraryBooks,
  onAddBorrowing,
  onUpdateBorrowing,
  onDeleteBorrowing,
  activeBannerTheme
}) => {
  const [viewMode, setViewMode] = useState<'roster' | 'history'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Picker State
  const [pickingForStudent, setPickingForStudent] = useState<Student | null>(null);
  const [customBookTitle, setBookTitle] = useState('');

  // Derived: Active borrowings grouped by studentId
  const activeBorrowingsGroups = useMemo(() => {
    const map: Record<number, BookBorrowingRecord[]> = {};
    borrowings.forEach(b => {
      if (b.status === 'borrowing' || b.status === 'late') {
        if (!map[b.studentId]) map[b.studentId] = [];
        map[b.studentId].push(b);
      }
    });
    return map;
  }, [borrowings]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.latinName && s.latinName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [students, searchQuery]);

  const handlePickBook = (student: Student, bookTitle: string) => {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 300); // 1 academic year (~10 months)

    onAddBorrowing({
      studentId: student.id,
      studentName: student.name,
      bookTitle: bookTitle,
      borrowDate: today,
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'borrowing'
    });
    
    setPickingForStudent(null);
    setBookTitle('');
  };

  const handleMarkAsReturned = (record: BookBorrowingRecord) => {
    onUpdateBorrowing({
      ...record,
      status: 'returned',
      returnDate: new Date().toISOString().split('T')[0]
    });
  };

  const getStatusBadge = (status: BookBorrowingRecord['status']) => {
    switch (status) {
      case 'borrowing':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> កំពុងខ្ចី</span>;
      case 'late':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> យឺតយ៉ាវ</span>;
      default:
        return null;
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rows = filteredStudents.map((s, idx) => {
      const activeList = activeBorrowingsGroups[s.id] || [];
      const booksDisplay = activeList.length > 0 
        ? activeList.map(b => `${b.bookTitle} (ខ្ចី៖ ${toKhmerNum(b.borrowDate.split('-').reverse().join('/'))} - សង៖ ${toKhmerNum((b.returnDate || b.dueDate).split('-').reverse().join('/'))})`).join('<br/>') 
        : '-';
      
      return `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${toKhmerNum(idx + 1)}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${s.name}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${s.gender}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${booksDisplay}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${activeList.length} ក្បាល</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>បញ្ជីខ្ចីសៀវភៅសិស្ស - ${activeBannerTheme.label || ''}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;700&family=Moul&display=swap');
            body { font-family: 'Kantumruy Pro', sans-serif; padding: 20px; }
            h2 { font-family: 'Moul', serif; text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f2f2f2; border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
            td { font-size: 11px; vertical-align: top; }
            .header { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>ព្រះរាជាណាចក្រកម្ពុជា<br/>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div style="text-align: right;">កាលបរិច្ឆេទ៖ ${toKhmerNum(new Date().toLocaleDateString('km-KH'))}</div>
          </div>
          <h2>បញ្ជីខ្ចី-ប្រគល់សៀវភៅសិស្ស (សរុប ${students.length} នាក់)</h2>
          <table>
            <thead>
              <tr>
                <th>ល.រ</th>
                <th>ឈ្មោះសិស្ស</th>
                <th>ភេទ</th>
                <th>សៀវភៅដែលខ្ចី</th>
                <th>ចំនួនខ្ចី</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className={`${activeBannerTheme.bannerGradient} rounded-3xl p-5 text-white shadow-lg border ${activeBannerTheme.bannerBorder} relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-black">
              <BookMarked className="w-4 h-4 text-amber-300" />
              <span>រដ្ឋបាលផ្នែកទី ១ ៖ បញ្ជីឈ្មោះសិស្សខ្ចីសៀវភៅ</span>
            </div>
            <h2 className="font-black text-xl">រាយនាមសិស្ស និងការខ្ចីសៀវភៅច្រើនក្បាល</h2>
            <p className="text-xs opacity-90">សិស្សម្នាក់អាចខ្ចីសៀវភៅបានច្រើនក្បាលក្នុងពេលតែមួយ</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-indigo-950/40 hover:bg-indigo-950/60 text-white rounded-2xl font-bold text-xs transition active:scale-95 flex items-center gap-2 border border-white/10"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>ព្រីនបញ្ជី</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-2 rounded-[28px] border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setViewMode('roster')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              viewMode === 'roster' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span>បញ្ជីតាមឈ្មោះសិស្ស</span>
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              viewMode === 'history' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>ប្រវត្តិខ្ចីសរុប</span>
          </button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ស្វែងរកសិស្ស..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {viewMode === 'roster' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-4 w-12 text-center">ល.រ</th>
                  <th className="px-4 py-4 min-w-[180px]">ឈ្មោះសិស្ស</th>
                  <th className="px-4 py-4 min-w-[350px]">សៀវភៅដែលកំពុងខ្ចី</th>
                  <th className="px-5 py-4 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((s, idx) => {
                  const activeList = activeBorrowingsGroups[s.id] || [];
                  return (
                    <tr key={s.id} className="group hover:bg-slate-50/50 transition">
                      <td className="px-5 py-4 text-center font-bold text-slate-400 text-xs">
                        {toKhmerNum(idx + 1)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-xs">{s.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{s.gender} • {s.latinName || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {activeList.length > 0 ? (
                          <div className="space-y-2">
                            {activeList.map(b => (
                              <div key={b.id} className="flex items-center justify-between gap-3 bg-indigo-50/40 p-2 rounded-xl border border-indigo-100/50">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="w-3 h-3 text-indigo-600" />
                                    <span className="font-bold text-slate-700 text-[11px] truncate">{b.bookTitle}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    {getStatusBadge(b.status)}
                                    <span className="text-[9px] text-slate-400 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-100">
                                      🗓️ ខ្ចី៖ {toKhmerNum(b.borrowDate.split('-').reverse().join('/'))}
                                    </span>
                                    <span className="text-[9px] text-indigo-500 font-bold bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                                      🔄 សង៖ {toKhmerNum((b.returnDate || b.dueDate).split('-').reverse().join('/'))}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleMarkAsReturned(b)}
                                  className="shrink-0 p-1.5 rounded-lg bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50 transition shadow-xs"
                                  title="ប្រគល់សៀវភៅនេះវិញ"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">មិនមានការខ្ចី</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setPickingForStudent(s)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-[11px] font-black shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95 flex items-center gap-1.5 ml-auto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ខ្ចីថែម</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* History View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-4 w-12 text-center">ល.រ</th>
                  <th className="px-4 py-4">សិស្ស</th>
                  <th className="px-4 py-4">សៀវភៅ</th>
                  <th className="px-4 py-4">ថ្ងៃខ្ចី</th>
                  <th className="px-4 py-4">ថ្ងៃសង</th>
                  <th className="px-4 py-4 text-center">ស្ថានភាព</th>
                  <th className="px-5 py-4 text-right">លុប</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {borrowings.length > 0 ? (
                  borrowings.map((b, idx) => (
                    <tr key={b.id} className="group hover:bg-slate-50/50 transition">
                      <td className="px-5 py-4 text-center font-bold text-slate-400 text-xs">{toKhmerNum(idx + 1)}</td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-700">{b.studentName}</td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-600">{b.bookTitle}</td>
                      <td className="px-4 py-4 text-[10px] font-bold text-slate-500">{toKhmerNum(b.borrowDate.split('-').reverse().join('/'))}</td>
                      <td className="px-4 py-4 text-[10px] font-bold text-indigo-600">{toKhmerNum((b.returnDate || b.dueDate).split('-').reverse().join('/'))}</td>
                      <td className="px-4 py-4 text-center">
                        {b.status === 'returned' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">បានប្រគល់</span>
                        ) : getStatusBadge(b.status)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => onDeleteBorrowing(b.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400 font-bold">មិនទាន់មានប្រវត្តិខ្ចី</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Picker Modal */}
      <AnimatePresence>
        {pickingForStudent && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 bg-indigo-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-indigo-950 text-lg">ខ្ចីសៀវភៅសម្រាប់សិស្ស</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                        {pickingForStudent.name}
                      </div>
                      <span className="text-[11px] text-indigo-600/70 font-bold tracking-tight">({pickingForStudent.gender})</span>
                    </div>
                  </div>
                  <button onClick={() => setPickingForStudent(null)} className="w-9 h-9 rounded-2xl bg-white text-slate-400 flex items-center justify-center hover:bg-slate-100 shadow-sm transition active:scale-90 border border-slate-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                    <Library className="w-3.5 h-3.5" />
                    <span>សៀវភៅក្នុងបណ្ណាល័យ</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {libraryBooks.map(book => (
                      <button
                        key={book.id}
                        onClick={() => handlePickBook(pickingForStudent, book.title)}
                        className="group flex items-center gap-4 p-3 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition text-left active:scale-[0.98]"
                      >
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 shadow-xs">
                          <img src={book.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" alt={book.title} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-800 text-xs truncate group-hover:text-indigo-900 transition">{book.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{book.category} • {book.author}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-400 transition" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">ឬ បញ្ចូលចំណងជើងដោយផ្ទាល់</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="បញ្ចូលឈ្មោះសៀវភៅផ្សេងៗ..."
                      value={customBookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      disabled={!customBookTitle.trim()}
                      onClick={() => handlePickBook(pickingForStudent, customBookTitle)}
                      className="px-5 bg-indigo-600 disabled:bg-slate-300 text-white rounded-2xl font-black text-xs shadow-md transition active:scale-95"
                    >
                      ខ្ចី
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <p className="text-[10px] text-slate-500 font-bold leading-tight">កាលបរិច្ឆេទខ្ចីនឹងត្រូវបានកំណត់ត្រឹមថ្ងៃនេះ ហើយត្រូវប្រគល់វិញក្នុងរយៈពេល ១ ឆ្នាំសិក្សា (៣០០ ថ្ងៃ)។</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
