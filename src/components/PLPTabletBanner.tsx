import React from 'react';
import { PLPEdTechCard } from './PLPEdTechCard';
import { ExternalLink, GraduationCap, Bell, Home, BookOpen, Library, Award, Settings, ChevronDown, Sparkles } from 'lucide-react';

interface PLPTabletBannerProps {
  compact?: boolean;
  className?: string;
}

export const PLPTabletBanner: React.FC<PLPTabletBannerProps> = ({ compact = false, className = '' }) => {
  const targetUrl = 'https://kru.plpedtech.com/login?from=%2Fdashboard%2Fstudent';

  if (compact) {
    return <PLPEdTechCard className={className} />;
  }

  return (
    <div className={className}>
      {/* Interactive Tablet Mockup Container matching IMG_3445.jpeg */}
      <a
        href={targetUrl}
        target="_blank"
        rel="noreferrer"
        className="block relative rounded-[32px] bg-slate-900/90 border-4 sm:border-8 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-3 sm:p-5 overflow-hidden transition-all duration-300 hover:border-indigo-600/60 hover:shadow-indigo-500/20 group/tablet"
      >
        {/* Tablet Top Camera Dot */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-700"></div>

        {/* Tablet Screen Canvas */}
        <div className="relative rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 overflow-hidden border border-blue-500/20 p-3 sm:p-5 min-h-[320px] sm:min-h-[380px] flex flex-col justify-between">
          
          {/* Tech Nodes Background Effect inside Tablet */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

          {/* Top Bar inside Tablet */}
          <div className="flex justify-between items-center relative z-20 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🇰🇭</span>
              <span className="font-black text-xs sm:text-sm text-indigo-200 tracking-wider">PLP EdTech Portal</span>
            </div>

            {/* Notification Bell & Profile Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800/80 border border-indigo-400/40 flex items-center justify-center text-amber-300 shadow-md">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 pl-1 pr-2 py-1 rounded-full border border-indigo-400/40 shadow-md">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 p-0.5 overflow-hidden">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    👨‍🏫
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-300" />
              </div>
            </div>
          </div>

          {/* Tablet Main Content Area: Split Left Drawer + Right Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-20 items-stretch my-auto">
            
            {/* Left Glassmorphism Menu Modal (Matching IMG_3445.jpeg pink/purple glow) */}
            <div className="md:col-span-6 bg-gradient-to-b from-indigo-950/80 via-purple-950/70 to-slate-950/80 backdrop-blur-md rounded-2xl p-4 border border-pink-400/40 shadow-[0_0_25px_rgba(236,72,153,0.25)] space-y-3.5 relative overflow-hidden group-hover/tablet:border-pink-400/70 transition-colors">
              {/* Top Menu Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-pink-500/20">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 p-0.5 flex items-center justify-center shadow-md shrink-0">
                  <span className="text-lg">👑</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base sm:text-lg tracking-tight">គ្រូបឋម</h4>
                  <p className="text-[10px] text-pink-200 font-medium">PLP Primary Teacher Portal</p>
                </div>
              </div>

              {/* Navigation Links inside Drawer */}
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 text-white border border-white/10">
                  <Home className="w-4 h-4 text-amber-300" />
                  <span>ទំព័រដើម</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-indigo-100 hover:bg-white/10 transition">
                  <BookOpen className="w-4 h-4 text-sky-300" />
                  <span>វគ្គសិក្សារបស់ខ្ញុំ</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-indigo-100 hover:bg-white/10 transition">
                  <Library className="w-4 h-4 text-emerald-300" />
                  <span>វគ្គសិក្សាទាំងអស់លើផ្ទាំង</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-indigo-100 hover:bg-white/10 transition">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>វិញ្ញាបនបត្រ</span>
                </div>
              </div>

              {/* Settings Box at bottom of Menu */}
              <div className="pt-1">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-pink-400/30 text-xs font-bold text-pink-200">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-pink-300" />
                    <span>ការកំណត់</span>
                  </div>
                  <span className="text-[10px] bg-pink-500/30 px-1.5 py-0.5 rounded text-pink-200">100</span>
                </div>
              </div>
            </div>

            {/* Right Side Cards (Matching IMG_3445.jpeg) */}
            <div className="md:col-span-6 flex flex-col justify-between gap-3">
              
              {/* Card 1: វគ្គសិក្សា 3 កំពុងសិក្សា */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-indigo-400/30 rounded-2xl p-4 shadow-lg relative overflow-hidden space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-indigo-300 font-bold block">វគ្គសិក្សា</span>
                    <span className="text-base sm:text-lg font-black text-white">3 កំពុងសិក្សា</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                    🔖
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-indigo-500/30">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full w-2/3 rounded-full"></div>
                </div>
              </div>

              {/* Card 2: វិញ្ញាបនបត្រ 2 + Wave Graph */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-indigo-400/30 rounded-2xl p-4 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                
                {/* Background Wave Graphic */}
                <div className="absolute inset-x-0 top-2 h-12 opacity-30 pointer-events-none">
                  <svg viewBox="0 0 100 30" className="w-full h-full text-indigo-400 stroke-current fill-none stroke-2">
                    <path d="M0 20 Q 25 5, 50 18 T 100 10" />
                  </svg>
                </div>

                <div className="flex justify-end">
                  <span className="text-[10px] bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 font-extrabold px-2 py-0.5 rounded-full">
                    ថ្មីៗ
                  </span>
                </div>

                <div className="relative z-10 text-center pt-2">
                  <span className="text-xs text-indigo-200 font-extrabold block">វិញ្ញាបនបត្រ</span>
                  <span className="text-3xl sm:text-4xl font-black bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-md">
                    2
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Direct Link Ribbon */}
          <div className="relative z-20 mt-3 pt-2 border-t border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-bold text-indigo-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ប្រព័ន្ធស្វ័យសិក្សាផ្លូវការសម្រាប់គ្រូបឋមសិក្សា (MoEYS & PLP EdTech)</span>
            </span>
            <span className="text-amber-300 underline font-black flex items-center gap-1 group-hover/tablet:translate-x-1 transition-transform">
              <span>ចុចបើកប្រព័ន្ធ kru.plpedtech.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>
      </a>
    </div>
  );
};
