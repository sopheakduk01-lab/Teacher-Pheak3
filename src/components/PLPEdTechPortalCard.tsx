import React from 'react';
import { ExternalLink, Bell, ChevronDown, Settings, Home, BookOpen, Library, Award } from 'lucide-react';

interface PLPEdTechPortalCardProps {
  className?: string;
  onClick?: () => void;
}

export const PLPEdTechPortalCard: React.FC<PLPEdTechPortalCardProps> = ({ className = '', onClick }) => {
  const targetUrl = 'https://kru.plpedtech.com/login?from=%2Fdashboard%2Fstudent';

  return (
    <div className={`relative block w-full rounded-[32px] sm:rounded-[36px] bg-gradient-to-br from-[#0c071d] via-[#140b2e] to-[#080415] p-4 sm:p-6 text-white shadow-2xl border border-purple-500/30 overflow-hidden group transition-all duration-300 hover:border-purple-400/60 hover:shadow-purple-900/40 ${className}`}>
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>

      {/* Top Bar: Cambodian Flag + PLP EdTech Portal Header & User Profile */}
      <div className="flex items-center justify-between pb-4 relative z-10 border-b border-purple-500/20 mb-4">
        {/* Left: Flag & Title */}
        <div className="flex items-center gap-2.5">
          <span className="text-xl sm:text-2xl drop-shadow-sm">🇰🇭</span>
          <span className="font-black text-sm sm:text-base text-white tracking-wide">
            PLP EdTech Portal
          </span>
        </div>

        {/* Right: Bell Icon & User Profile Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Bell Icon */}
          <a
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#181033] border border-purple-400/30 flex items-center justify-center text-amber-300 hover:bg-purple-900/50 hover:border-amber-400/50 transition shadow-md"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-amber-300" />
          </a>

          {/* User Profile Avatar */}
          <a
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-[#181033] border border-purple-400/30 pl-1 pr-2 py-1 rounded-full hover:bg-purple-900/50 hover:border-amber-400/50 transition shadow-md"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-indigo-500 p-0.5 overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-[#0d071e] rounded-full flex items-center justify-center text-xs">
                👨‍🏫
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-purple-200" />
          </a>
        </div>
      </div>

      {/* Main Inner Portal Container Card matching IMG_3447.jpeg */}
      <a
        href={targetUrl}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        className="block relative z-10 rounded-[26px] bg-[#130b2b]/90 backdrop-blur-md border border-purple-400/30 p-4 sm:p-5 shadow-xl transition-all duration-300 hover:border-pink-400/60 hover:bg-[#180e36] group/inner"
      >
        {/* Header Section inside Card: Gold Crown Icon + Title */}
        <div className="flex items-center justify-between pb-3.5 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            {/* Gold Crown Squircle */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] bg-gradient-to-br from-[#FFC107] via-[#FF9800] to-[#F57C00] p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center shrink-0 group-hover/inner:scale-105 transition-transform">
              <div className="w-full h-full bg-gradient-to-br from-[#FFC107] to-[#FFA000] rounded-[18px] flex items-center justify-center text-2xl">
                👑
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg sm:text-xl tracking-tight leading-tight group-hover/inner:text-amber-200 transition-colors">
                គ្រូបឋម
              </h3>
              <p className="text-xs text-purple-200/70 font-medium tracking-wide">
                PLP Primary Teacher Portal
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-300/30 px-3 py-1 rounded-full">
            <span>បើកប្រព័ន្ធ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Navigation Menu List */}
        <div className="space-y-2 my-4 text-xs sm:text-sm font-bold">
          {/* 1. ទំព័រដើម (Selected State matching screenshot) */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/10 text-white border border-white/10 shadow-inner group-hover/inner:bg-white/15 transition">
            <div className="flex items-center gap-3">
              <Home className="w-4.5 h-4.5 text-amber-300" />
              <span>ទំព័រដើម</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </div>

          {/* 2. វគ្គសិក្សារបស់ខ្ញុំ */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-purple-100/90 hover:bg-white/10 hover:text-white transition">
            <BookOpen className="w-4.5 h-4.5 text-sky-300" />
            <span>វគ្គសិក្សារបស់ខ្ញុំ</span>
          </div>

          {/* 3. វគ្គសិក្សាទាំងអស់លើផ្ទាំង */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-purple-100/90 hover:bg-white/10 hover:text-white transition">
            <Library className="w-4.5 h-4.5 text-emerald-300" />
            <span>វគ្គសិក្សាទាំងអស់លើផ្ទាំង</span>
          </div>

          {/* 4. វិញ្ញាបនបត្រ */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-purple-100/90 hover:bg-white/10 hover:text-white transition">
            <Award className="w-4.5 h-4.5 text-amber-300" />
            <span>វិញ្ញាបនបត្រ</span>
          </div>
        </div>

        {/* Footer Item: Settings Box with 100 Badge */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#0f0722] border border-purple-400/30 text-xs sm:text-sm font-bold text-purple-200">
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-pink-300" />
              <span>ការកំណត់</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/30 border border-pink-400/30 text-pink-200 text-xs font-mono font-bold">
              100
            </span>
          </div>
        </div>
      </a>

      {/* Bottom Subtitle Indicator */}
      <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-purple-300/80 px-1">
        <span>ចុចចូលទៅកាន់ kru.plpedtech.com</span>
        <span className="text-amber-300 underline font-black flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>ចូលរៀនឥឡូវនេះ</span>
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
