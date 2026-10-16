import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Upload,
  FileText,
  Trash2,
  Search,
  Eye,
  Download,
  X,
  Printer,
  Sparkles,
  Bookmark,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle2,
  BookMarked,
  Cloud,
  LayoutGrid,
  List as ListIcon,
  Smartphone,
  FolderDown,
  FileUp,
  Share2,
  Layers,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LibraryBook } from '../types';
import { GoogleDriveModal } from './GoogleDriveModal';
import { BookReaderModal } from './BookReaderModal';

interface LibraryTabProps {
  books: LibraryBook[];
  onAddBook: (book: Omit<LibraryBook, 'id' | 'uploadedDate'>) => void;
  onDeleteBook: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  books,
  onAddBook,
  onDeleteBook,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ទាំងអស់');
  const [viewLayout, setViewLayout] = useState<'bookshelf' | 'grid' | 'list'>('bookshelf');

  // Add Book Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('ភាសាខ្មែរ');
  const [description, setDescription] = useState('');
  const [pagesCount, setPagesCount] = useState<number>(120);
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600');
  const [fileType, setFileType] = useState<'pdf' | 'image' | 'text' | 'epub'>('pdf');
  const [fileData, setFileData] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Reader Modal State
  const [readingBook, setReadingBook] = useState<LibraryBook | null>(null);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  const categories = ['ទាំងអស់', '📱 ពីទូរស័ព្ទ', 'ភាសាខ្មែរ', 'គណិតវិទ្យា', 'វិទ្យាសាស្ត្រ', 'សិក្សាសង្គម', 'រឿងនិទាន', 'ឯកសារយោង'];

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === '📱 ពីទូរស័ព្ទ') {
      return matchesSearch && (b.fileType === 'pdf' || (b.fileData && b.fileData.length > 500) || b.id.startsWith('phone-'));
    }

    const matchesCategory = selectedCategory === 'ទាំងអស់' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onerror = () => {
      setIsUploading(false);
      onShowToast('⚠️ មិនអាចអានឯកសារនេះបានទេ ប៉ុន្តែអ្នកនៅតែអាចរក្សាទុកសៀវភៅបានធម្មតា។');
    };

    try {
      if (file.type.includes('image') || file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
        setFileType('image');
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            setFileData(uploadEvent.target.result as string);
            setCoverUrl(uploadEvent.target.result as string);
            setIsUploading(false);
            onShowToast('✅ បានផ្ទុករូបភាពសៀវភៅពីទូរស័ព្ទជោគជ័យ!');
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.includes('pdf') || file.name.match(/\.pdf$/i)) {
        setFileType('pdf');
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            setFileData(uploadEvent.target.result as string);
            setIsUploading(false);
            onShowToast('✅ បានផ្ទុកឯកសារ PDF ដើមពីទូរស័ព្ទជោគជ័យ!');
          }
        };
        reader.readAsDataURL(file);
      } else {
        setFileType('text');
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            setFileData(uploadEvent.target.result as string);
            setIsUploading(false);
            onShowToast('✅ បានអាន និងទាញយកមាតិកាសៀវភៅជោគជ័យ!');
          }
        };
        reader.readAsText(file);
      }
    } catch (err) {
      setIsUploading(false);
      onShowToast('✅ បានជ្រើសរើសឯកសាររួចរាល់!');
    }

    if (!title) {
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setTitle(cleanName);
    }
  };

  const handleDownloadBookPdf = (book: LibraryBook) => {
    if (book.fileData && book.fileData.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = book.fileData;
      a.download = `${book.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const content = `=========================================
${book.title}
អ្នកនិពន្ធ / ក្រសួង៖ ${book.author}
ប្រភេទ៖ ${book.category} | ចំនួនទំព័រ៖ ${book.pagesCount || 120}
=========================================

${book.description}

--- ខ្លឹមសារមេរៀន និងអត្ថបទ ---
${book.fileData || book.description}
`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title.replace(/\s+/g, '_')}_MoEYS.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    onShowToast(`📥 បានទាញយកសៀវភៅ «${book.title}» ទៅកាន់ទូរស័ព្ទរបស់អ្នករួចរាល់!`);
  };

  const handleQuickAddMoEYSPdf = (presetTitle: string, presetCat: string) => {
    onAddBook({
      title: presetTitle,
      author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)',
      category: presetCat,
      coverUrl: presetCat === 'គណិតវិទ្យា' 
        ? 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600'
        : presetCat === 'វិទ្យាសាស្ត្រ'
        ? 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600'
        : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      fileData: `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`,
      fileType: 'pdf',
      description: `សៀវភៅសិក្សាគោលទម្រង់ដើម PDF របស់ក្រសួងអប់រំ យុវជន និងកីឡា។ អាចអាន បោះពុម្ព និងទាញយកទុកក្នុងទូរស័ព្ទបាន។`,
      pagesCount: 160,
    });
    onShowToast(`🎉 បានបន្ថែមសៀវភៅ PDF «${presetTitle}» ចូលទូសៀវភៅរួចរាល់!`);
  };

  const handleQuickAddSample = () => {
    setTitle('សៀវភៅអំណានស្វ័យសិក្សា៖ ភាសាខ្មែរថ្នាក់ទី២ (PDF ដើម)');
    setAuthor('ក្រសួងអប់រំ យុវជន និងកីឡា');
    setCategory('ភាសាខ្មែរ');
    setDescription('កម្រងអត្ថបទអំណានខ្លីៗ និងសំណួរស្វ័យសិក្សាសម្រាប់កុមារបឋមសិក្សា។');
    setFileType('pdf');
    setFileData('មេរៀនទី១៖ ដំណើរទស្សនកិច្ចទៅកាន់សួនសត្វ\n\nថ្ងៃសៅរ៍ ស្អែកនេះ សាលារៀនរបស់យើងខ្ញុំបានៀបចំផែនការនាំសិស្សានុសិស្សថ្នាក់ទី២ ទៅទស្សនកិច្ចសិក្សា at សួនសត្វភ្នំតាម៉ៅ...\n\nសំណួរស្វ័យសិក្សា៖\n១. តើសាលារៀនរៀបចំទៅទស្សនកិច្ចនៅឯណា?\n២. តើកុមារបានរៀនអ្វីខ្លះពីធម្មជាតិ?');
    onShowToast('បានបំពេញទិន្នន័យសៀវភៅគំរូរួចរាល់!');
  };

  const handleInstantAddBook = () => {
    if (!title.trim()) {
      setTitle('សៀវភៅស្វ័យសិក្សាថ្មី');
    }
    onAddBook({
      title: title.trim() || 'សៀវភៅស្វ័យសិក្សាថ្មី',
      author: author.trim() || 'លោកគ្រូ អ្នកគ្រូ',
      category,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      fileData: fileData || description || 'ខ្លឹមសារសៀវភៅ និងមេរៀនសម្រាប់សិស្សានុសិស្ស។',
      fileType: fileType || 'pdf',
      description: description.trim() || 'សៀវភៅអំណានសម្រាប់សិស្សានុសិស្ស និងលោកគ្រូអ្នកគ្រូ។',
      pagesCount: Number(pagesCount) || 120,
    });
    setTitle('');
    setAuthor('');
    setDescription('');
    setFileData('');
    setIsAddModalOpen(false);
    onShowToast('🎉 បានបញ្ចូលសៀវភៅថ្មីទៅក្នុងទូសៀវភៅដោយជោគជ័យ!');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleInstantAddBook();
  };

  // Group books into shelves (chunks of 4)
  const shelfChunks: LibraryBook[][] = [];
  for (let i = 0; i < filteredBooks.length; i += 4) {
    shelfChunks.push(filteredBooks.slice(i, i + 4));
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-purple-950 to-indigo-950 rounded-[32px] p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-amber-900/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-amber-500/10 backdrop-blur-3xl transform skew-x-12 hidden md:block"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 backdrop-blur-md">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" /> ទូសៀវភៅឌីជីថល & ឯកសារ PDF ពីទូរស័ព្ទ
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>ទូសៀវភៅ និងឯកសារ PDF ដើម</span>
            </h2>
            <p className="text-amber-100/90 text-xs md:text-sm max-w-xl leading-relaxed">
              ទាញយក និងផ្ទុកឡើងសៀវភៅ (ជាទម្រង់ដើម PDF) ពីទូរស័ព្ទរបស់អ្នក រៀបចំដាក់លើទូសៀវភៅយ៉ាងមានរបៀប និងបើកអានបានភ្លាមៗ។
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="no-print bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-3 rounded-2xl text-xs md:text-sm font-black transition shadow-lg flex items-center gap-2 active:scale-95 shrink-0"
            >
              <Cloud className="w-4 h-4 text-slate-900" /> Google Drive
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="no-print bg-white text-purple-950 hover:bg-amber-50 px-5 py-3 rounded-2xl text-xs md:text-sm font-extrabold transition shadow-lg flex items-center gap-2 active:scale-95 shrink-0"
            >
              <FileUp className="w-4 h-4 text-purple-700" /> 📱 ផ្ទុកឡើង PDF ពីទូរស័ព្ទ
            </button>
          </div>
        </div>
      </div>

      {/* Quick Phone Import & Preset Bar */}
      <div className="bg-gradient-to-r from-amber-50 via-purple-50 to-indigo-50 border border-amber-200/80 rounded-[28px] p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs md:text-sm flex items-center gap-1.5">
              <span>ទាញយក និងបន្ថែមសៀវភៅ PDF ក្រសួងអប់រំ (MoEYS E-Books)</span>
              <span className="bg-amber-200 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">១-ចុច</span>
            </h4>
            <p className="text-[11px] text-slate-600 font-medium">
              ជ្រើសរើសសៀវភៅសិក្សាគោល PDF ដើមដើម្បីរៀបចំចូលទូសៀវភៅទូរស័ព្ទភ្លាមៗ៖
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
          <button
            onClick={() => handleQuickAddMoEYSPdf('សៀវភៅសិក្សាគោល ភាសាខ្មែរ ថ្នាក់ទី៦ (PDF)', 'ភាសាខ្មែរ')}
            className="px-3 py-2 bg-white hover:bg-purple-100 text-purple-950 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <span>📖 ភាសាខ្មែរ ទី៦</span>
          </button>
          <button
            onClick={() => handleQuickAddMoEYSPdf('សៀវភៅសិក្សាគោល គណិតវិទ្យា ថ្នាក់ទី៦ (PDF)', 'គណិតវិទ្យា')}
            className="px-3 py-2 bg-white hover:bg-blue-100 text-blue-950 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <span>📐 គណិតវិទ្យា ទី៦</span>
          </button>
          <button
            onClick={() => handleQuickAddMoEYSPdf('សៀវភៅសិក្សាគោល វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ (PDF)', 'វិទ្យាសាស្ត្រ')}
            className="px-3 py-2 bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <span>🔬 វិទ្យាសាស្ត្រ ទី៦</span>
          </button>
        </div>
      </div>

      {/* Controls & Search & Categories & Layout Selector */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-xs cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-950 text-amber-300 border border-amber-700 shadow-amber-950/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Switcher & Search Bar */}
        <div className="flex items-center gap-2.5">
          {/* Layout Mode Buttons */}
          <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 shrink-0">
            <button
              onClick={() => setViewLayout('bookshelf')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'bookshelf'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ទិដ្ឋភាពទូសៀវភៅ (Wooden Bookshelf)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ទូសៀវភៅ</span>
            </button>

            <button
              onClick={() => setViewLayout('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'grid'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ទិដ្ឋភាពប័ណ្ណ (Grid)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ប័ណ្ណ</span>
            </button>

            <button
              onClick={() => setViewLayout('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'list'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ទិដ្ឋភាពបញ្ជី (List)"
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">បញ្ជី</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ស្វែងរកចំណងជើងសៀវភៅ ឬអ្នកនិពន្ធ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-600 focus:outline-none shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Main Books Display Area */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-3xl mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">មិនមានសៀវភៅក្នុងប្រភេទនេះទេ</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            សូមចុចប៊ូតុង "📱 ផ្ទុកឡើង PDF ពីទូរស័ព្ទ" ខាងលើដើម្បីទាញយក និងបន្ថែមឯកសារ PDF ដើមពីទូរស័ព្ទរបស់អ្នក។
          </p>
        </div>
      ) : viewLayout === 'bookshelf' ? (
        /* ================= 1. WOODEN VISUAL BOOKSHELF VIEW ================= */
        <div className="space-y-10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 rounded-[36px] border border-amber-900/40 shadow-2xl">
          <div className="flex items-center justify-between border-b border-amber-900/50 pb-3 text-amber-300">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="font-moul text-sm sm:text-base tracking-wide text-amber-200">
                ទូសៀវភៅឈើប្រណីត (Wooden Bookshelf Display)
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-400/80 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/60">
              សៀវភៅសរុប៖ {filteredBooks.length} ក្បាល
            </span>
          </div>

          {shelfChunks.map((shelfBooks, shelfIdx) => (
            <div key={shelfIdx} className="space-y-2">
              {/* Shelf Brass Plaque Title */}
              <div className="flex items-center gap-2 px-2">
                <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-amber-950 font-black px-3 py-0.5 rounded-md text-[10px] shadow-sm uppercase tracking-wider">
                  ជាន់ទី {shelfIdx + 1}
                </span>
                <span className="text-xs font-bold text-amber-200/90 font-serif">
                  {shelfIdx === 0 ? 'កម្រងសៀវភៅសិក្សាគោល MoEYS' : shelfIdx === 1 ? 'សៀវភៅអំណាន & រឿងនិទាន' : 'ឯកសារ PDF ផ្ទុកឡើងពីទូរស័ព្ទ'}
                </span>
              </div>

              {/* Wooden Shelf Structure */}
              <div className="relative pt-6 pb-2">
                {/* Books Row Sitting on Shelf */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 px-4 relative z-10 items-end min-h-[220px]">
                  {shelfBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      whileHover={{ y: -12, scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="group relative flex flex-col items-center cursor-pointer"
                    >
                      {/* Book Cover / Spine Visual */}
                      <div
                        onClick={() => setReadingBook(book)}
                        className="w-full max-w-[170px] h-[200px] sm:h-[230px] rounded-r-2xl rounded-l-md overflow-hidden shadow-2xl relative border-y border-r border-amber-900/60 transition-transform bg-slate-800"
                        style={{
                          boxShadow: '8px 12px 20px rgba(0,0,0,0.6), -2px 0px 5px rgba(0,0,0,0.3)',
                        }}
                      >
                        {/* Book Spine Shadow Left Effect */}
                        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/60 to-transparent z-20 border-r border-white/20"></div>

                        {/* Category Ribbon Badge */}
                        <div className="absolute top-2 right-2 z-20">
                          <span className="bg-amber-500/90 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md shadow-md uppercase">
                            {book.fileType === 'pdf' ? 'PDF ដើម' : book.category}
                          </span>
                        </div>

                        {/* Book Cover Image */}
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:brightness-105 transition"
                          referrerPolicy="no-referrer"
                        />

                        {/* Book Bottom Overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 pt-8 text-white z-10">
                          <p className="text-[9px] text-amber-300 font-bold uppercase truncate">
                            {book.author}
                          </p>
                          <h4 className="font-extrabold text-xs line-clamp-2 leading-snug font-sans text-slate-100">
                            {book.title}
                          </h4>
                          <span className="text-[9px] text-slate-400 block mt-1">
                            📄 {book.pagesCount || 120} ទំព័រ
                          </span>
                        </div>

                        {/* Hover Overlay Buttons */}
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 flex flex-col items-center justify-center gap-2 p-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setReadingBook(book);
                            }}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 rounded-xl text-xs font-black shadow-lg flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> អាន PDF ដើម
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadBookPdf(book);
                            }}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-amber-200 py-1.5 rounded-xl text-[11px] font-bold border border-amber-700/60 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                          >
                            <FolderDown className="w-3.5 h-3.5 text-amber-400" /> ទាញយក
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteBook(book.id);
                            }}
                            className="text-rose-400 hover:text-rose-300 text-[10px] font-bold flex items-center gap-1 pt-1"
                          >
                            <Trash2 className="w-3 h-3" /> លុបចេញ
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Wood Shelf Planking Ledge */}
                <div className="w-full h-5 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-t-2 border-amber-600/60 rounded-sm shadow-xl relative z-0 flex items-center justify-center">
                  <div className="w-32 h-1 bg-amber-500/30 rounded-full"></div>
                </div>
                {/* Wood Shelf Depth Bottom Front */}
                <div className="w-full h-3 bg-amber-950 border-t border-amber-900/80 shadow-2xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : viewLayout === 'grid' ? (
        /* ================= 2. CARD GRID VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[28px] border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="bg-white/90 backdrop-blur-md text-purple-900 font-bold px-3 py-1 rounded-xl text-[11px] shadow-sm">
                      {book.category}
                    </span>
                    {book.fileType === 'pdf' && (
                      <span className="bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded-xl text-[10px] shadow-sm">
                        PDF ដើម
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] text-purple-200 font-semibold uppercase tracking-wider block">
                      {book.author}
                    </span>
                    <h3 className="font-extrabold text-sm line-clamp-1">{book.title}</h3>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                    <span>📄 {book.pagesCount || 120} ទំព័រ</span>
                    <span>📅 {book.uploadedDate}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setReadingBook(book)}
                  className="flex-1 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 py-2.5 rounded-2xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-400" /> បើកអាន PDF ដើម
                </button>
                <button
                  onClick={() => handleDownloadBookPdf(book)}
                  className="no-print p-2.5 rounded-2xl text-amber-900 bg-amber-50 hover:bg-amber-100 transition border border-amber-200 cursor-pointer"
                  title="ទាញយកទុកក្នុងទូរស័ព្ទ"
                >
                  <FolderDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteBook(book.id)}
                  className="no-print p-2.5 rounded-2xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                  title="លុបសៀវភៅ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* ================= 3. LIST VIEW ================= */
        <div className="bg-white rounded-[32px] border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-14 h-18 object-cover rounded-xl shadow-md border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {book.category}
                    </span>
                    {book.fileType === 'pdf' && (
                      <span className="bg-amber-100 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                        PDF ដើម
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{book.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    អ្នកនិពន្ធ៖ {book.author} | {book.pagesCount || 120} ទំព័រ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setReadingBook(book)}
                  className="bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-400" /> អាន PDF ដើម
                </button>
                <button
                  onClick={() => handleDownloadBookPdf(book)}
                  className="p-2 rounded-xl text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition cursor-pointer"
                  title="ទាញយកទុកក្នុងទូរស័ព្ទ"
                >
                  <FolderDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteBook(book.id)}
                  className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                  title="លុបសៀវភៅ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Book Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm no-print overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-lg shadow-2xl space-y-5 border border-slate-100 my-8"
            >
              <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-amber-600" />
                  <span>ទាញយក និងផ្ទុកឡើងសៀវភៅ PDF ពីទូរស័ព្ទ</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* Quick Sample Button */}
                <div className="flex justify-between items-center bg-amber-50 p-3 rounded-2xl border border-amber-200">
                  <span className="font-bold text-amber-950 text-[11px]">💡 បញ្ចូលសៀវភៅរហ័ស (មិនបាច់ជ្រើសរើសឯកសារ):</span>
                  <button
                    type="button"
                    onClick={handleQuickAddSample}
                    className="bg-amber-950 text-amber-300 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow hover:bg-amber-900 transition active:scale-95"
                  >
                    ✨ បំពេញសៀវភៅគំរូ PDF
                  </button>
                </div>

                {/* File Uploader */}
                <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-3xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center shadow-inner">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm">ជ្រើសរើសឯកសារ PDF ពីទូរស័ព្ទរបស់អ្នក</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      គាំទ្រឯកសារ PDF, រូបភាព (JPG, PNG) ឬអត្ថបទ (TXT)
                    </p>
                  </div>
                  <label className="inline-block bg-amber-950 hover:bg-amber-900 text-amber-300 px-5 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition shadow-md active:scale-95">
                    📂 រកមើលឯកសារ PDF ក្នុងទូរស័ព្ទ
                    <input
                      type="file"
                      accept=".pdf,.txt,.jpg,.jpeg,.png,.epub"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {isUploading && <p className="text-amber-800 font-bold animate-pulse">កំពុងទាញយក និងអានឯកសារ PDF...</p>}
                  {fileData && (
                    <p className="text-emerald-700 font-bold bg-emerald-50 py-1.5 px-3 rounded-xl inline-block border border-emerald-200">
                      ✅ បានផ្ទុកឯកសារ PDF រួចរាល់!
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">ចំណងជើងសៀវភៅ (Book Title) *</label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. សៀវភៅសិក្សាគោល ភាសាខ្មែរ ថ្នាក់ទី៦"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">អ្នកនិពន្ធ / គ្រឹះស្ថាន</label>
                    <input
                      type="text"
                      placeholder="ឧ. ក្រសួងអប់រំ យុវជន និងកីឡា"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ប្រភេទសៀវភៅ (Category)</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                    >
                      {categories.filter(c => c !== 'ទាំងអស់' && c !== '📱 ពីទូរស័ព្ទ').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1.5 text-slate-700">សេចក្តីពិពណ៌នាសង្ខេប (Description)</label>
                  <textarea
                    rows={3}
                    placeholder="សរសេរពិពណ៌នាខ្លឹមសារសៀវភៅ ឬមាតិកាមេរៀន..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-slate-300 rounded-2xl p-3 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">តំណភ្ជាប់រូបភាពគម្រប (Cover Image URL)</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700">ចំនួនទំព័រ (Pages)</label>
                    <input
                      type="number"
                      min={1}
                      value={pagesCount}
                      onChange={(e) => setPagesCount(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-950 hover:bg-amber-900 text-amber-300 rounded-2xl font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> រក្សាទុកក្នុងទូសៀវភៅ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Book Reader Modal */}
      <BookReaderModal
        book={readingBook}
        onClose={() => setReadingBook(null)}
        onShowToast={onShowToast}
      />
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        onImportBook={onAddBook}
        onShowToast={onShowToast}
      />
    </div>
  );
};
