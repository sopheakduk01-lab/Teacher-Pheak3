import React, { useState } from 'react';
import { Smartphone, ChevronLeft, ChevronRight, X, Play, RotateCcw } from 'lucide-react';

interface MobileSlideRemoteControllerProps {
  initialSessionId: string;
  onExit: () => void;
  onShowToast?: (msg: string) => void;
}

export const MobileSlideRemoteController: React.FC<MobileSlideRemoteControllerProps> = ({
  initialSessionId,
  onExit,
  onShowToast,
}) => {
  const [slideNum, setSlideNum] = useState(1);

  const sendCommand = (cmd: string) => {
    fetch('/api/remote/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: initialSessionId, command: { id: Date.now(), action: cmd } }),
    }).catch(console.warn);
  };

  const handleNext = () => {
    setSlideNum((p) => p + 1);
    sendCommand('next_slide');
    onShowToast?.('ស្លាយបន្ទាប់ 👉');
  };

  const handlePrev = () => {
    setSlideNum((p) => Math.max(1, p - 1));
    sendCommand('prev_slide');
    onShowToast?.('👈 ស្លាយមុន');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-amber-400" />
          <span className="font-mono text-xs font-bold text-slate-400">SESSION: {initialSessionId}</span>
        </div>
        <button onClick={onExit} className="p-2 rounded-xl bg-white/10 hover:bg-white/20">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center space-y-4 my-auto">
        <span className="text-xs font-black uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
          ទូរស័ព្ទបញ្ជាស្លាយពីចម្ងាយ
        </span>
        <h2 className="text-4xl font-black font-moul">ស្លាយទី {slideNum}</h2>
        <p className="text-xs text-slate-400">ចុចប៊ូតុងខាងក្រោមដើម្បីបញ្ជាស្លាយបង្រៀននៅលើកុំព្យូទ័រ</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-8">
        <button
          onClick={handlePrev}
          className="py-6 rounded-3xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
          <span>ថយក្រោយ</span>
        </button>
        <button
          onClick={handleNext}
          className="py-6 rounded-3xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
        >
          <span>ទៅមុខ</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
