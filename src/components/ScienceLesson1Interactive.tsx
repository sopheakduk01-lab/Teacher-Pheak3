import React, { useRef, useState } from 'react';
import { X, Maximize2, Minimize2, RotateCcw, ExternalLink, Leaf, Sparkles } from 'lucide-react';

interface ScienceLesson1InteractiveProps {
  onClose: () => void;
  onShowToast: (msg: string) => void;
  initialTab?: string;
}

export const ScienceLesson1Interactive: React.FC<ScienceLesson1InteractiveProps> = ({
  onClose,
  onShowToast,
  initialTab,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = `/science_lesson_1.html?t=${Date.now()}`;
      onShowToast('បានផ្ទុកមេរៀនឡើងវិញ 🔄');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const openNewTab = () => {
    window.open('/science_lesson_1.html', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md text-white no-print animate-in fade-in duration-200">
      {/* Top Controller Bar */}
      <div className="h-14 sm:h-16 bg-slate-900 border-b border-emerald-500/30 px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-900/50">
            <Leaf className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦
              </span>
              <span className="text-[10px] text-amber-300 font-bold hidden md:inline">
                • ជំពូកទី ១ ៖ រុក្ខជាតិនិងសត្វ
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-white truncate leading-tight font-moul">
              មេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ (កម្រិតពេញលេញ ៤០ សំណួរ)
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleReload}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition active:scale-95 text-xs font-semibold flex items-center gap-1.5"
            title="ផ្ទុកមេរៀនឡើងវិញ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ផ្ទុកឡើងវិញ</span>
          </button>

          <button
            onClick={openNewTab}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition active:scale-95 text-xs font-semibold flex items-center gap-1.5"
            title="បើកក្នុងផ្ទាំងថ្មី"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ផ្ទាំងថ្មី</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition active:scale-95 text-xs font-semibold flex items-center gap-1.5"
            title="ពេញអេក្រង់"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'បង្រួម' : 'ពេញអេក្រង់'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white transition active:scale-95 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-900/30"
            title="បិទមេរៀន"
          >
            <X className="w-4 h-4" />
            <span>បិទ</span>
          </button>
        </div>
      </div>

      {/* Main Lesson Frame running the exact code */}
      <div className="flex-1 w-full h-full bg-white relative overflow-hidden">
        <iframe
          ref={iframeRef}
          src="/science_lesson_1.html"
          title="វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ មេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ"
          className="w-full h-full border-0 block"
          allow="autoplay; fullscreen; clipboard-write; speaker"
        />
      </div>
    </div>
  );
};
