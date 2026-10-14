import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  List,
  Search,
  Bookmark,
  BookmarkCheck,
  Printer,
  X,
  Moon,
  Sun,
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  Sliders,
  ExternalLink,
  BookOpen,
  Check,
  FileCode,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LibraryBook } from '../types';
import { MathGrade6ReaderView } from './MathGrade6ReaderView';
import { mathGrade6AllLessons } from '../data/mathGrade6Book';

interface BookReaderModalProps {
  book: LibraryBook | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  book,
  onClose,
  onShowToast,
}) => {
  if (!book) return null;

  // State management
  const totalPages = book?.pagesCount || 120;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFontMenuOpen, setIsFontMenuOpen] = useState<boolean>(false);

  // Preferred view mode: 'pdf' if it's a PDF file or 'text'
  const isPdfFile = Boolean(
    book?.fileType === 'pdf' || (book?.fileData && book.fileData.startsWith('data:application/pdf'))
  );
  const [viewMode, setViewMode] = useState<'pdf' | 'text'>(isPdfFile ? 'pdf' : 'text');

  // Customization settings
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'kantumruy' | 'moul' | 'serif' | 'sans'>('kantumruy');
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [bookmarks, setBookmarks] = useState<number[]>([1, 5, 12]);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const isBookmarked = bookmarks.includes(currentPage);

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(bookmarks.filter((p) => p !== currentPage));
      onShowToast(`បានលុបការចំណាំលើទំព័រទី ${currentPage}`);
    } else {
      setBookmarks([...bookmarks, currentPage].sort((a, b) => a - b));
      onShowToast(`បានចំណាំទំព័រទី ${currentPage} រួចរាល់!`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenInNewTab = () => {
    if (book.fileData) {
      if (book.fileData.startsWith('data:') || book.fileData.startsWith('http')) {
        window.open(book.fileData, '_blank');
      } else {
        // Create printable window for text content
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${book.title}</title>
                <style>
                  body { font-family: 'Kantumruy Pro', Khmer, sans-serif; padding: 40px; line-height: 1.8; color: #1e293b; }
                  h1 { color: #581c87; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
                  .meta { color: #64748b; font-size: 14px; margin-bottom: 24px; }
                  .content { white-space: pre-wrap; font-size: 15px; }
                </style>
              </head>
              <body>
                <h1>${book.title}</h1>
                <div class="meta">អ្នកនិពន្ធ៖ ${book.author} | ជំពូក/ប្រភេទ៖ ${book.category}</div>
                <div class="content">${book.fileData}</div>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    } else {
      onShowToast('មិនមានឯកសារសម្រាប់បើកក្នុងផ្ទាំងថ្មីឡើយ');
    }
  };

  // Dynamic Table of Contents Chapters
  const tocChapters = (
    book.category === 'សិក្សាសង្គម' || book.title.includes('សិក្សាសង្គម')
  ) ? [
        { page: 1, title: 'គម្របមុខ និងព័ត៌មានសៀវភៅ' },
        { page: 2, title: 'អាមុខកថា និងសារលិខិត' },
        { page: 3, title: 'គណៈកម្មការអភិវឌ្ឍឯកសារ' },
        { page: 4, title: 'មាតិកាសៀវភៅ (Table of Contents)' },
        { page: 5, title: 'ជំពូកទី១៖ ឥរិយាបថល្អ - មេរៀនទី១៖ ការកំណត់គោលដៅ (ទំព័រ ២)' },
        { page: 10, title: 'ជំពូកទី១៖ ឥរិយាបថល្អ - មេរៀនទី២៖ ឥរិយាបថ និងតម្លៃ (ទំព័រ ១០)' },
        { page: 18, title: 'ជំពូកទី១៖ ឥរិយាបថល្អ - មេរៀនទី៣៖ សិទ្ធិ និងការទទួលខុសត្រូវ (ទំព័រ ១៨)' },
        { page: 26, title: 'ជំពូកទី១៖ ឥរិយាបថល្អ - មេរៀនទី៤៖ សិល្បៈ និងការច្នៃប្រឌិត (ទំព័រ ២៦)' },
        { page: 34, title: 'ជំពូកទី២៖ ឥរិយាបថប្រកបដោយសុវត្ថិភាព - មេរៀនទី១៖ ការចៀសវាងទង្វើគ្រោះថ្នាក់ (ទំព័រ ៣៤)' },
        { page: 42, title: 'ជំពូកទី២៖ ឥរិយាបថប្រកបដោយសុវត្ថិភាព - មេរៀនទី២៖ ផលអាក្រក់នៃគ្រោះថ្នាក់ចរាចរណ៍ (ទំព័រ ៤២)' },
        { page: 52, title: 'ជំពូកទី៣៖ ជីវភាពសង្គមនាពេលបច្ចុប្បន្ន - មេរៀនទី១៖ ចម្រៀង និងរបាំខ្មែរ (ទំព័រ ៥២)' },
        { page: 60, title: 'ជំពូកទី៣៖ ជីវភាពសង្គមនាពេលបច្ចុប្បន្ន - មេរៀនទី២៖ ពិធីបុណ្យប្រពៃណីជាតិ (ទំព័រ ៦០)' },
        { page: 68, title: 'ជំពូកទី៣៖ ជីវភាពសង្គមនាពេលបច្ចុប្បន្ន - មេរៀនទី៣៖ ការងារនៅក្នុងសហគមន៍ (ទំព័រ ៦៨)' },
        { page: 76, title: 'ជំពូកទី៣៖ ជីវភាពសង្គមនាពេលបច្ចុប្បន្ន - មេរៀនទី៤៖ តុលាការ (ទំព័រ ៧៦)' },
        { page: 84, title: 'ជំពូកទី៣៖ ជីវភាពសង្គមនាពេលបច្ចុប្បន្ន - មេរៀនទី៥៖ ទីតាំងរាជធានី និងប្រទេស (ទំព័រ ៨៤)' },
        { page: 94, title: 'ជំពូកទី៤៖ សង្គមអតីតកាល - មេរៀនទី១៖ ឧបករណ៍ភ្លេងប្រពៃណី (ទំព័រ ៩៤)' },
        { page: 102, title: 'ជំពូកទី៤៖ សង្គមអតីតកាល - មេរៀនទី២៖ សម័យចតុមុខ (ទំព័រ ១០២)' },
        { page: 110, title: 'ជំពូកទី៤៖ សង្គមអតីតកាល - មេរៀនទី៣៖ សម័យលង្វែក (ទំព័រ ១១០)' },
        { page: 123, title: 'ជំពូកទី៤៖ សង្គមអតីតកាល - មេរៀនទី៤៖ ការតាំងរាជធានីនៅឧដុង្គ (ទំព័រ ១២៣)' },
      ]
    : (book.category === 'វិទ្យាសាស្ត្រ' || book.title.includes('វិទ្យាសាស្ត្រ'))
    ? [
        { page: 1, title: 'គម្របមុខ និងព័ត៌មានសៀវភៅ' },
        { page: 2, title: 'អាមុខកថា និងសារលិខិត' },
        { page: 3, title: 'គណៈកម្មការអភិវឌ្ឍឯកសារ' },
        { page: 4, title: 'មាតិកាសៀវភៅ' },
        { page: 5, title: 'ជំពូកទី១៖ រុក្ខជាតិ និងសត្វ - មេរៀនទី១៖ ការបន្តពូជរបស់រុក្ខជាតិមានផ្កា' },
        { page: 20, title: 'ជំពូកទី១៖ រុក្ខជាតិ និងសត្វ - មេរៀនទី២៖ ការបន្សំខ្លួនរបស់សត្វទៅនឹងបរិស្ថាន' },
        { page: 40, title: 'ជំពូកទី២៖ មនុស្ស និងសុខភាព - មេរៀនទី១៖ ប្រព័ន្ធរំលាយអាហារ និងការថែទាំ' },
        { page: 65, title: 'ជំពូកទី២៖ មនុស្ស និងសុខភាព - មេរៀនទី២៖ ជំងឺឆ្លង និងការការពារ' },
        { page: 90, title: 'ជំពូកទី៣៖ ថាមពល និងចលនា - មេរៀនទី១៖ អគ្គិសនី និងសៀគ្វីអគ្គិសនី' },
        { page: 120, title: 'ជំពូកទី៣៖ ថាមពល និងចលនា - មេរៀនទី២៖ កម្លាំង និងម៉ាស៊ីនងាយ' },
      ]
    : (book.category === 'គណិតវិទ្យា' || book.title.includes('គណិតវិទ្យា'))
    ? [
        { page: 1, title: 'គម្របមុខ និងព័ត៌មានបោះពុម្ព' },
        { page: 2, title: 'ទំព័រចំណងជើង និងក្រសួង' },
        { page: 3, title: 'គណៈកម្មការនិពន្ធ និងការរក្សាសិទ្ធិ' },
        { page: 4, title: 'អាមុខកថា (Preface)' },
        { page: 5, title: 'បញ្ជីអត្ថបទ និងមាតិកា (២០ មេរៀន)' },
        ...mathGrade6AllLessons.map((l) => ({
          page: l.startPage + 5,
          title: `${l.title} (ទំព័រ ${l.startPage})`,
        })),
      ]
    : [
        { page: 1, title: 'គម្របមុខ និងអាមុខកថា' },
        { page: 2, title: 'បុព្វកថា និងសារលិខិត' },
        { page: 3, title: 'គណៈកម្មការអភិវឌ្ឍឯកសារ' },
        { page: 4, title: 'មាតិកាសៀវភៅ និងការណែនាំ' },
        { page: 5, title: 'មេរៀនទី១៖ ព្យញ្ជនៈ ស្រៈ និងអំណាន' },
        { page: 11, title: 'មេរៀនទី២៖ ការផ្សំប្រកប និងអក្ខរាវិរុទ្ធ' },
        { page: 18, title: 'មេរៀនទី៣៖ អត្ថបទអំណាន និងការយល់ដឹង' },
        { page: 26, title: 'មេរៀនទី៤៖ វាក្យសព្ទ និងការតែងល្បះ' },
      ];

  // Theme styles
  const themeContainerBg =
    readerTheme === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : readerTheme === 'sepia'
      ? 'bg-[#f4ecd8] text-[#433422]'
      : 'bg-slate-100 text-slate-900';

  const themePaperBg =
    readerTheme === 'dark'
      ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/80'
      : readerTheme === 'sepia'
      ? 'bg-[#fbf0d9] border-[#e2d5b7] text-[#2c2217] shadow-amber-900/10'
      : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50';

  const themeHeaderBg =
    readerTheme === 'dark'
      ? 'bg-slate-900 border-slate-800 text-white'
      : readerTheme === 'sepia'
      ? 'bg-[#eae0c8] border-[#d8c9a8] text-[#3d2f1f]'
      : 'bg-white border-slate-200 text-slate-800';

  const fontClass =
    fontFamily === 'moul'
      ? 'font-moul'
      : fontFamily === 'serif'
      ? 'font-serif'
      : 'font-sans';

  const fontSizeClass =
    fontSize === 'sm'
      ? 'text-xs md:text-sm'
      : fontSize === 'lg'
      ? 'text-base md:text-lg'
      : fontSize === 'xl'
      ? 'text-lg md:text-xl'
      : 'text-sm md:text-base';

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 text-slate-100 no-print font-sans select-none overflow-hidden">
      {/* Top Main Navigation Header Bar */}
      <div className={`h-14 px-3 sm:px-6 border-b flex items-center justify-between z-30 transition-colors ${themeHeaderBg}`}>
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-500/10 transition flex items-center gap-1 font-bold text-xs cursor-pointer active:scale-95"
            title="ត្រឡប់ក្រោយ"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">ត្រឡប់</span>
          </button>

          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`p-2 rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1 text-xs font-bold ${
              isTocOpen ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-slate-500/10'
            }`}
            title="មាតិកាសៀវភៅ"
          >
            <List className="w-5 h-5" />
            <span className="hidden md:inline">មាតិកា</span>
          </button>
        </div>

        {/* Title & View Mode Toggle */}
        <div className="flex items-center gap-2 max-w-md truncate">
          <span className="font-bold text-xs sm:text-sm truncate text-purple-900 dark:text-purple-300">
            {book.title}
          </span>
          
          {/* Mode Selector Pill */}
          <div className="hidden sm:flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-bold shrink-0">
            <button
              onClick={() => setViewMode('pdf')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'pdf' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>ទម្រង់ PDF ដើម</span>
            </button>

            <button
              onClick={() => setViewMode('text')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'text' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>អត្ថបទអាន</span>
            </button>
          </div>
        </div>

        {/* Right Tools & Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* External Link / Open in New Tab */}
          <button
            onClick={handleOpenInNewTab}
            className="p-2 rounded-xl hover:bg-slate-500/10 transition cursor-pointer active:scale-95 text-slate-700 dark:text-slate-200"
            title="បើកក្នុងផ្ទាំងថ្មី (Open Full Page)"
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl hover:bg-slate-500/10 transition cursor-pointer active:scale-95 text-slate-700 dark:text-slate-200"
            title="បោះពុម្ពឯកសារ (Print)"
          >
            <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Font & Theme Customizer (AA) */}
          <div className="relative">
            <button
              onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
              className={`p-2 rounded-xl transition font-extrabold text-sm flex items-center justify-center cursor-pointer active:scale-95 ${
                isFontMenuOpen ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-slate-500/10'
              }`}
              title="កំណត់ទំហំអក្សរ និងពណ៌"
            >
              <span className="tracking-tighter font-serif text-base">AA</span>
            </button>

            {/* Font / Theme Dropdown Popover */}
            <AnimatePresence>
              {isFontMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-72 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-4 z-50 text-xs"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-purple-600" />
                      <span>កំណត់ទម្រង់ការអាន</span>
                    </span>
                    <button
                      onClick={() => setIsFontMenuOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Font Size Adjuster */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500">ទំហំអក្សរ (Font Size)</label>
                    <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
                      {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setFontSize(sz)}
                          className={`py-1 rounded-lg font-bold transition text-xs ${
                            fontSize === sz ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {sz === 'sm' ? 'A-' : sz === 'base' ? 'A' : sz === 'lg' ? 'A+' : 'A++'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reader Theme Adjuster */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500">ពណ៌ផ្ទៃសៀវភៅ (Theme)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setReaderTheme('light')}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] font-bold transition ${
                          readerTheme === 'light'
                            ? 'bg-white border-purple-600 ring-2 ring-purple-600/20 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>សាកសម</span>
                      </button>

                      <button
                        onClick={() => setReaderTheme('sepia')}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] font-bold transition ${
                          readerTheme === 'sepia'
                            ? 'bg-[#fbf0d9] border-amber-700 ring-2 ring-amber-700/20 text-amber-950'
                            : 'bg-[#fbf0d9] border-[#e2d5b7] text-amber-900'
                        }`}
                      >
                        <span className="text-amber-800 font-serif font-black">📜</span>
                        <span>លឿងទុំ</span>
                      </button>

                      <button
                        onClick={() => setReaderTheme('dark')}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] font-bold transition ${
                          readerTheme === 'dark'
                            ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-500/30 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>យប់</span>
                      </button>
                    </div>
                  </div>

                  {/* Zoom controls */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-600">
                      <span>ពង្រីក/បង្រួមទំព័រ</span>
                      <span>{zoomLevel}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
                        className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="range"
                        min="70"
                        max="150"
                        step="5"
                        value={zoomLevel}
                        onChange={(e) => setZoomLevel(Number(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                      <button
                        onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
                        className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-xl transition cursor-pointer active:scale-95 ${
              isSearchOpen ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-slate-500/10'
            }`}
            title="ស្វែងរកក្នុងសៀវភៅ"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Bookmark Ribbon */}
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl transition cursor-pointer active:scale-95 ${
              isBookmarked ? 'bg-rose-500 text-white shadow-xs' : 'hover:bg-slate-500/10'
            }`}
            title={isBookmarked ? 'លុបការចំណាំទំព័រ' : 'ចំណាំទំព័រនេះ'}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-rose-500 hover:text-white transition cursor-pointer active:scale-95 text-slate-400"
            title="បិទ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expandable Search Bar Header */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-purple-900 text-white px-4 py-2.5 flex items-center gap-3 border-b border-purple-800 z-20"
          >
            <Search className="w-4 h-4 text-purple-300" />
            <input
              type="text"
              placeholder="វាយពាក្យស្វែងរកក្នុងអត្ថបទសៀវភៅ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-purple-950/60 border border-purple-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-purple-300/70 w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
              autoFocus
            />
            {searchQuery && (
              <span className="text-[10px] text-purple-200 font-bold whitespace-nowrap">
                ស្វែងរក៖ "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="p-1 hover:bg-purple-800 rounded-lg text-purple-200"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Body Area */}
      <div className={`flex-1 flex overflow-hidden relative ${themeContainerBg}`}>
        {/* Table of Contents Drawer */}
        <AnimatePresence>
          {isTocOpen && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              className="w-80 border-r shadow-2xl z-20 flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-extrabold text-xs">មាតិកាសៀវភៅ & ការចំណាំ</h4>
                </div>
                <button
                  onClick={() => setIsTocOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Bookmarks Section */}
                {bookmarks.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block px-2">
                      ទំព័រដែលបានចំណាំ ({bookmarks.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {bookmarks.map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setCurrentPage(p);
                            setIsTocOpen(false);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            currentPage === p
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                          }`}
                        >
                          <Bookmark className="w-3 h-3 fill-current" />
                          <span>ទំព័រ {p}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chapter List */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-2 mb-1">
                    ជំពូក និងមេរៀនទាំងអស់
                  </span>
                  {tocChapters.map((ch) => (
                    <button
                      key={ch.page}
                      onClick={() => {
                        setCurrentPage(ch.page);
                        setIsTocOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition flex justify-between items-center ${
                        currentPage === ch.page
                          ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-950 dark:text-purple-200 font-extrabold shadow-2xs'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate pr-2">{ch.title}</span>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0">
                        ទំព័រ {ch.page}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Viewport */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto relative p-3 sm:p-6">
          {/* VIEW MODE 1: NATIVE PDF VIEWER (When in PDF mode or PDF file) */}
          {viewMode === 'pdf' ? (
            <div className="w-full h-full flex flex-col items-center justify-start max-w-6xl mx-auto space-y-4">
              {/* PDF Header Controls */}
              <div className="w-full bg-slate-900 text-white p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-xs sm:text-sm">
                    ទិដ្ឋភាព PDF ដើមពេញលេញ (Original Document Viewer)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenInNewTab}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>បើកក្នុងផ្ទាំងថ្មី / បោះពុម្ព</span>
                  </button>

                  <button
                    onClick={() => setViewMode('text')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>ប្តូរទៅអត្ថបទអាន</span>
                  </button>
                </div>
              </div>

              {/* PDF Render Container / iframe or Object embed */}
              {book.fileData && (book.fileData.startsWith('data:') || book.fileData.startsWith('http')) ? (
                <div className="w-full flex-1 min-h-[75vh] rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl relative">
                  <iframe
                    src={book.fileData.startsWith('data:application/pdf') ? book.fileData : `${book.fileData}#page=${currentPage}`}
                    className="w-full h-full min-h-[75vh] border-0"
                    title={book.title}
                  />
                </div>
              ) : (
                /* Dynamic PDF Styled Document Preview for Books */
                <div className="w-full flex-1 min-h-[75vh] rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl relative">
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta charset="utf-8">
                        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Moul&display=swap" rel="stylesheet">
                        <style>
                          body {
                            font-family: 'Kantumruy Pro', sans-serif;
                            background-color: #525659;
                            margin: 0;
                            padding: 20px;
                            display: flex;
                            justify-content: center;
                          }
                          .pdf-page {
                            background-color: white;
                            width: 100%;
                            max-w: 800px;
                            min-height: 1050px;
                            padding: 60px 50px;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                            box-sizing: border-box;
                            position: relative;
                          }
                          .header {
                            text-align: center;
                            border-bottom: 2px solid #581c87;
                            padding-bottom: 15px;
                            margin-bottom: 25px;
                          }
                          .moeys {
                            font-family: 'Moul', cursive;
                            color: #581c87;
                            font-size: 16px;
                            margin-bottom: 5px;
                          }
                          .book-title {
                            font-family: 'Moul', cursive;
                            color: #1e1b4b;
                            font-size: 18px;
                            margin: 10px 0;
                          }
                          .meta {
                            font-size: 12px;
                            color: #64748b;
                            font-weight: 600;
                          }
                          .content {
                            font-size: 14px;
                            line-height: 1.8;
                            color: #1e293b;
                            white-space: pre-wrap;
                            text-align: justify;
                          }
                          .footer {
                            position: absolute;
                            bottom: 30px;
                            left: 50px;
                            right: 50px;
                            border-top: 1px solid #e2e8f0;
                            padding-top: 10px;
                            display: flex;
                            justify-content: space-between;
                            font-size: 11px;
                            color: #94a3b8;
                          }
                        </style>
                      </head>
                      <body>
                        <div class="pdf-page">
                          <div class="header">
                            <div class="moeys">ព្រះរាជាណាចក្រកម្ពុជា</div>
                            <div style="font-size: 12px; font-weight: bold; color: #78350f;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                            <div class="book-title">${book.title}</div>
                            <div class="meta">អ្នកនិពន្ធ / គ្រឹះស្ថាន៖ ${book.author} | ប្រភេទ៖ ${book.category}</div>
                          </div>

                          <div class="content">
                            <div style="background: #fdf4ff; border-left: 4px solid #a855f7; padding: 12px; margin-bottom: 20px; font-weight: bold; font-size: 13px; color: #581c87;">
                              📖 ទំព័រទី ${currentPage} — ខ្លឹមសារមេរៀន និងឯកសារដើម PDF
                            </div>
                            ${(book.fileData || book.description).replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                          </div>

                          <div class="footer">
                            <span>ក្រសួងអប់រំ យុវជន និងកីឡា — ឯកសារសិក្សាគោល</span>
                            <span>ទំព័រទី ${currentPage} / ${totalPages}</span>
                          </div>
                        </div>
                      </body>
                      </html>
                    `}
                    className="w-full h-full min-h-[75vh] border-0"
                    title={book.title}
                  />
                </div>
              )}
            </div>
          ) : (
            /* VIEW MODE 2: FULL TEXT DOCUMENT READER MODE */
            <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
              {/* Paper Card */}
              <motion.div
                key={currentPage}
                initial={{ opacity: 0.9, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className={`w-full rounded-2xl border p-6 sm:p-10 relative flex flex-col justify-between transition-all shadow-xl ${themePaperBg}`}
              >
                {/* Top Document Header */}
                <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-6 flex justify-between items-center text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                      {book.category}
                    </span>
                    <span className="truncate max-w-[260px]">{book.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 rounded-md text-slate-800 dark:text-slate-200">
                      ទំព័រទី {currentPage} / {totalPages}
                    </span>
                  </div>
                </div>

                {/* Main Text Content Body */}
                <div className={`space-y-6 ${fontClass} ${fontSizeClass} leading-relaxed text-justify`}>
                  {(book.category === 'គណិតវិទ្យា' || book.title.includes('គណិតវិទ្យា')) ? (
                    <MathGrade6ReaderView
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onNavigatePage={(p) => setCurrentPage(p)}
                      onShowToast={onShowToast}
                    />
                  ) : (
                    <>
                      {/* Full Text Data from Book if available */}
                      {book.fileData && (
                        <div className="bg-purple-50/70 dark:bg-purple-950/40 p-5 rounded-2xl border border-purple-200/80 dark:border-purple-900 space-y-3 mb-6">
                          <div className="flex items-center justify-between font-bold text-purple-900 dark:text-purple-300 border-b border-purple-200 dark:border-purple-800 pb-2 text-xs">
                            <span className="flex items-center gap-1.5 font-moul">
                              📖 ខ្លឹមសារដើមនៃសៀវភៅ (Original Book Text Content)
                            </span>
                            <span className="bg-purple-200 dark:bg-purple-900 text-purple-950 dark:text-purple-100 text-[10px] px-2.5 py-0.5 rounded-full">
                              ទិន្នន័យពេញលេញ
                            </span>
                          </div>

                          <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-xs sm:text-sm font-medium pr-1">
                            {book.fileData}
                          </div>
                        </div>
                      )}

                      {/* Detailed Curriculum Lesson Content */}
                      <div className="space-y-5 pt-2">
                        {(book.category === 'សិក្សាសង្គម' || book.title.includes('សិក្សាសង្គម')) ? (
                          <div className="space-y-5">
                            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 rounded-2xl flex justify-between items-center shadow-md">
                              <div>
                                <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">សៀវភៅសិក្សាគោល សិក្សាសង្គម ថ្នាក់ទី៦</p>
                                <h3 className="font-moul text-xs sm:text-sm text-amber-300 mt-0.5">
                                  {currentPage <= 9 ? 'ជំពូកទី១៖ ឥរិយាបថល្អ - មេរៀនទី១៖ ការកំណត់គោលដៅ' :
                                   currentPage <= 17 ? 'ជំពូកទី១៖ ឥរិយាបថល្អ - មេរៀនទី២៖ ឥរិយាបថ និងតម្លៃ' :
                                   currentPage <= 25 ? 'ជំពូកទី១៖ ឥរិយាបថល្អ - មេរៀនទី៣៖ សិទ្ធិ និងការទទួលខុសត្រូវ' :
                                   currentPage <= 33 ? 'ជំពូកទី១៖ ឥរិយាបថល្អ - មេរៀនទី៤៖ សិល្បៈ និងការច្នៃប្រឌិត' :
                                   currentPage <= 51 ? 'ជំពូកទី២៖ ឥរិយាបថប្រកបដោយសុវត្ថិភាព' :
                                   currentPage <= 93 ? 'ជំពូកទី៣៖ ជីវភាពសង្គមនាពេលបច្ចុប្បន្ន' :
                                   'ជំពូកទី៤៖ សង្គមអតីតកាល (សម័យចតុមុខ លង្វែក ឧដុង្គ)'}
                                </h3>
                              </div>
                              <span className="text-[11px] bg-white/20 px-3 py-1 rounded-xl font-mono font-bold">
                                ទំព័រ {currentPage}
                              </span>
                            </div>

                            <div className="space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed text-justify">
                              <p className="indent-6 font-semibold">
                                ១. <span className="font-bold text-purple-900 dark:text-purple-300">ការកំណត់គោលដៅ និងកាលវិភាគសិក្សា៖</span> កុមារគ្រប់រូបត្រូវកំណត់គោលដៅសិក្សាឱ្យបានច្បាស់លាស់ដើម្បីទទួលបានជោគជ័យក្នុងការសិក្សា និងអនាគតជីវិត។ ការកំណត់គោលដៅចែកចេញជាពីរ៖
                              </p>
                              <ul className="list-disc list-inside space-y-1.5 pl-4 font-medium text-slate-700 dark:text-slate-300">
                                <li><strong className="text-slate-900 dark:text-slate-100">គោលដៅរយៈពេលខ្លី៖</strong> ការប្រឡងជាប់ប្រចាំខែ, ការធ្វើលំហាត់ស្វ័យសិក្សាប្រចាំថ្ងៃ, ការរៀបចំកាលវិភាគអានសៀវភៅ។</li>
                                <li><strong className="text-slate-900 dark:text-slate-100">គោលដៅរយៈពេលវែង៖</strong> ការប្រឡងបញ្ចប់ភូមិសិក្សា, ការទទួលបានអាហារូបករណ៍, និងការជ្រើសរើសមុខជំនាញវិជ្ជាជីវៈ។</li>
                              </ul>

                              <p className="indent-6 font-semibold pt-1">
                                ២. <span className="font-bold text-purple-900 dark:text-purple-300">សិទ្ធិ និងការទទួលខុសត្រូវ៖</span> សិទ្ធិរស់រានមានជីវិត, សិទ្ធិទទួលបានការអភិវឌ្ឍ, សិទ្ធិទទួលបានការការពារ, និងសិទ្ធិមានការចូលរួម។
                              </p>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-2 text-xs">
                              <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                                <span>📚</span> វាក្យសព្ទគន្លឹះក្នុងមេរៀននេះ៖
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                <p>• <span className="font-bold">គោលដៅ</span> ៖ លទ្ធផលដែលចង់បាន</p>
                                <p>• <span className="font-bold">ផែនការ</span> ៖ ការរៀបចំទុកជាមុន</p>
                                <p>• <span className="font-bold">កាលវិភាគ</span> ៖ ការកំណត់ពេលវេលា</p>
                                <p>• <span className="font-bold">ស្វ័យសិក្សា</span> ៖ ការរៀនដោយខ្លួនឯង</p>
                              </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                              <p className="font-bold text-slate-900 dark:text-slate-100">❓ សំណួរស្វែងយល់ប្រចាំទំព័រ ({currentPage})៖</p>
                              <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                                <li>តើការកំណត់គោលដៅសិក្សាផ្តល់ផលប្រយោជន៍អ្វីខ្លះដល់សិស្ស?</li>
                                <li>ចូលរៀបរាប់កាលវិភាគសិក្សាប្រចាំថ្ងៃរបស់អ្នកឱ្យបាន ៤ ចំណុច។</li>
                              </ol>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-purple-100 dark:bg-purple-950 p-4 rounded-2xl flex justify-between items-center">
                              <h3 className="font-moul text-xs text-purple-950 dark:text-purple-200">
                                ខ្លឹមសារមេរៀន និងការអនុវត្តអំណាន (ទំព័រទី {currentPage})
                              </h3>
                              <span className="text-[10px] font-bold bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg text-purple-900 dark:text-purple-300">
                                {book.category}
                              </span>
                            </div>

                            <p className="indent-6 font-medium leading-relaxed text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                              {currentPage % 2 === 0
                                ? `អត្ថបទអំណានសម្រាប់ទំព័រទី ${currentPage}៖ ការសិក្សាអប់រំគឺជាគ្រឹះយ៉ាងរឹងមាំនៃការភិវឌ្ឍធនធានមនុស្ស។ សិស្សានុសិស្សត្រូវខិតខំប្រឹងប្រែងរៀនសូត្រ យកចិត្តទុកដាក់ស្តាប់ការណែនាំរបស់លោកគ្រូ អ្នកគ្រូ និងធ្វើកិច្ចការផ្ទះឱ្យបានទៀងទាត់។`
                                : `ការអនុវត្តអំណានស្ទាត់ជំនាញ (ទំព័រទី ${currentPage})៖ ចែករំលែកការអានជាគូ ឬជាក្រុមតូចៗ។ សិស្សត្រូវអានដោយបញ្ចេញសំឡេងច្បាស់ៗ លើកដាក់សំឡេងតាមសញ្ញាវណ្ណយុត្តិ និងយល់ន័យពាក្យគន្លឹះ។`}
                            </p>

                            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                              <p className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                                <span>📚</span> វាក្យសព្ទ និងពាក្យគន្លឹះ៖
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                <p>• <span className="font-bold">ស្វ័យសិក្សា</span> ៖ ការរៀនដោយខ្លួនឯង</p>
                                <p>• <span className="font-bold">សមត្ថភាព</span> ៖ ជំនាញ និងចំណេះដឹង</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Bottom Navigation Pagination Bar */}
                <div className="pt-6 mt-8 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <button
                    disabled={currentPage <= 1}
                    onClick={handlePrevPage}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    ‹ ទំព័រមុន
                  </button>

                  <div className="bg-purple-950 text-white font-mono font-bold text-xs px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                    <span>ទំព័រទី</span>
                    <span className="text-amber-300 font-extrabold">{currentPage}</span>
                    <span>/</span>
                    <span>{totalPages}</span>
                  </div>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={handleNextPage}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    ទំព័របន្ទាប់ ›
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
