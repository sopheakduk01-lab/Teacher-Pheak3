import React, { useRef, useEffect } from 'react';
import {
  Home,
  ClipboardCheck,
  PlusSquare,
  LayoutGrid,
  Gamepad2,
  Compass,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface MobileBottomDockProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({ currentTab, onTabChange }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  const tabs = [
    { id: 'home', label: 'ទំព័រដើម', icon: Home },
    { id: 'admin', label: 'រដ្ឋបាលគ្រូ', icon: ClipboardCheck },
    { id: 'create', label: 'បង្កើតតេស្ត', icon: PlusSquare },
    { id: 'library', label: 'បណ្ណាល័យ', icon: LayoutGrid },
    { id: 'student_portal', label: 'សិស្ស', icon: GraduationCap, badge: '🎓' },
    {
      id: 'join',
      label: 'ចូលរួម PIN',
      isCustomIcon: true,
      customIcon: (
        <div className="w-5 h-5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-md border border-indigo-300/60 flex items-center justify-center p-0.5 shadow-inner">
          <div className="grid grid-cols-2 gap-0.5 w-full h-full">
            <div className="bg-red-500 rounded-[2px] flex items-center justify-center text-[5px] text-white font-black shadow-xs">▲</div>
            <div className="bg-blue-600 rounded-[2px] flex items-center justify-center text-[5px] text-white font-black shadow-xs">◆</div>
            <div className="bg-amber-500 rounded-[2px] flex items-center justify-center text-[5px] text-white font-black shadow-xs">●</div>
            <div className="bg-emerald-600 rounded-[2px] flex items-center justify-center text-[5px] text-white font-black shadow-xs">■</div>
          </div>
        </div>
      )
    },
    {
      id: 'games',
      label: 'ល្បែងសិក្សា',
      icon: Gamepad2,
      isGamesTab: true,
      badge: '🎮'
    },
    { id: 'discover', label: 'ស្វែងរក', icon: Compass }
  ];

  // Auto-scroll the active tab into the center of the scroll container
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = activeTabRef.current;
      const containerWidth = container.offsetWidth;
      const elementLeft = element.offsetLeft;
      const elementWidth = element.offsetWidth;

      container.scrollTo({
        left: elementLeft - containerWidth / 2 + elementWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [currentTab]);

  const scrollHorizontally = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <nav className="no-print md:hidden fixed bottom-3 left-2.5 right-2.5 z-50 select-none mobile-bottom-dock">
      <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[28px] p-1.5 sm:p-2 shadow-[0_16px_48px_rgba(79,70,229,0.25)] border border-white/90 dark:border-slate-800 ring-1 ring-black/[0.05]">
        {/* Scroll Left Cue */}
        <button
          onClick={() => scrollHorizontally('left')}
          title="អូសទៅឆ្វេង"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-md text-slate-500 dark:text-slate-300 flex items-center justify-center text-[10px] opacity-70 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Scrollable Tabs Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto scroll-smooth px-6 py-1 no-scrollbar touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                onClick={() => onTabChange(tab.id)}
                className={`relative shrink-0 min-w-[70px] sm:min-w-[78px] flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 group cursor-pointer active:scale-95`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBottomTab"
                    className={`absolute inset-0 rounded-2xl shadow-lg ${
                      tab.id === 'games'
                        ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 shadow-purple-500/40'
                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-500/35'
                    }`}
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                )}

                <div
                  className={`relative z-10 flex flex-col items-center transition-transform duration-300 ${
                    isActive ? 'scale-105 -translate-y-0.5' : 'group-hover:scale-105'
                  }`}
                >
                  {tab.isCustomIcon ? (
                    <div
                      className={`${
                        isActive
                          ? 'ring-2 ring-white/80 rounded-lg shadow-sm scale-110'
                          : 'opacity-70 group-hover:opacity-100'
                      }`}
                    >
                      {tab.customIcon}
                    </div>
                  ) : (
                    Icon && (
                      <div className="relative">
                        <Icon
                          className={`w-5 h-5 transition-colors ${
                            isActive
                              ? 'text-white'
                              : tab.id === 'games'
                              ? 'text-violet-600 dark:text-violet-400 group-hover:text-violet-500 animate-pulse'
                              : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}
                        />
                        {tab.badge && !isActive && (
                          <span className="absolute -top-1.5 -right-2 text-[8px] leading-none">
                            {tab.badge}
                          </span>
                        )}
                      </div>
                    )
                  )}

                  <span
                    className={`text-[10.5px] font-semibold mt-1 tracking-tight transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-white font-black drop-shadow-xs'
                        : tab.id === 'games'
                        ? 'text-violet-700 dark:text-violet-300 font-bold group-hover:text-violet-600'
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Cue */}
        <button
          onClick={() => scrollHorizontally('right')}
          title="អូសទៅស្តាំ"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-md text-slate-500 dark:text-slate-300 flex items-center justify-center text-[10px] opacity-70 hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
};

