import React, { useRef } from 'react';
import {
  Home,
  ClipboardList,
  PlusCircle,
  LayoutGrid,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Compass,
} from 'lucide-react';

interface MobileBottomDockProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({ currentTab, onTabChange }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const items = [
    { id: 'home', label: 'ទំព័រដើម', icon: Home },
    { id: 'admin', label: 'រដ្ឋបាលគ្រូ', icon: ClipboardList },
    { id: 'create', label: 'បង្កើតតេស្ត', icon: PlusCircle },
    { id: 'library', label: 'បណ្ណាល័យ', icon: LayoutGrid },
    { id: 'student_portal', label: 'សិស្ស', icon: GraduationCap },
    { id: 'games', label: 'ហ្គេម', icon: Gamepad2 },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -120 : 120;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="no-print md:hidden fixed bottom-3 left-3 right-3 z-40 flex items-center justify-center pointer-events-none">
      <nav className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[28px] shadow-2xl border border-slate-200/90 dark:border-slate-800 p-1.5 flex items-center gap-1 max-w-full w-full sm:w-auto shadow-purple-950/10">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0 transition active:scale-90 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Items Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth flex-1 justify-around"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-[18px] transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-102 font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 hover:bg-purple-50/50 dark:hover:bg-slate-800/60 font-semibold'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {item.id === 'student_portal' && !isActive && (
                    <span className="absolute -top-1 -right-1.5 text-[10px]">🎓</span>
                  )}
                </div>
                <span className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight whitespace-nowrap ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0 transition active:scale-90 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
};

export default MobileBottomDock;
