import React from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen, Calendar, Bell, Palette } from 'lucide-react';
import { TeacherProfile } from '../types';
import { TeacherAvatar } from './TeacherAvatar';

interface HeaderProps {
  teacher: TeacherProfile;
  currentYear?: string;
  availableYears?: string[];
  onSelectYear?: (year: string) => void;
  onOpenYearManager?: () => void;
  onOpenProfile?: () => void;
  onOpenUpgrade?: () => void;
  onOpenCustomize?: () => void;
  onPrint?: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
  onOpenAccountSync?: () => void;
  onOpenLampAuth?: () => void;
  onOpenTeacherNotices?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  teacher,
  currentYear,
  onOpenYearManager,
  onOpenProfile,
  onOpenCustomize,
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenMobileMenu,
  onOpenTeacherNotices,
}) => {
  const activeYear = currentYear || teacher?.academicYear || '២០២៥ - ២០២៦';
  const teacherName = teacher?.name && teacher.name.trim() !== '' ? teacher.name : 'លោកគ្រូ ឌុក សុភ័ក្រ';

  return (
    <header className="no-print px-3.5 sm:px-5 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-b border-slate-200/90 dark:border-slate-800 sticky top-0 md:static z-20 shadow-xs">
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Desktop Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? 'បើកពង្រីករបាចំហៀង (Open Sidebar)' : 'បិទបង្រួមរបាចំហៀង (Close Sidebar)'}
          className="hidden md:flex items-center gap-1.5 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition active:scale-95 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-purple-700 dark:text-purple-300" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-purple-700 dark:text-purple-300" />
          )}
        </button>

        {/* Mobile Sidebar Menu Button */}
        <button
          onClick={onOpenMobileMenu}
          title="បើករបាចំហៀង (Open Menu)"
          className="md:hidden p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          <Menu className="w-5 h-5 text-purple-700 dark:text-purple-300" />
        </button>

        {/* Teacher Info */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:opacity-90 transition group"
          title="ចុចដើម្បីមើល ឬកែសម្រួលព័ត៌មានគ្រូបង្រៀន"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 via-indigo-400 to-amber-400 shadow-md group-hover:scale-105 transition shrink-0 ring-2 ring-purple-400/30">
            <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center text-white relative">
              <TeacherAvatar teacher={teacher} avatar={teacher?.avatar} name={teacherName} fallbackIcon="👨‍🏫" />
            </div>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white font-moul leading-none drop-shadow-2xs">
              រដ្ឋបាលគ្រូបឋម
            </h1>
            <p className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-400 mt-1">
              {teacherName}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Theme Palette, Notification Bell & Academic Year Button */}
      <div className="flex items-center gap-2">
        {/* Quick Theme Switcher Button */}
        {onOpenCustomize && (
          <button
            type="button"
            onClick={onOpenCustomize}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-purple-700 hover:text-purple-900 dark:text-purple-300 rounded-xl font-bold text-xs sm:text-sm transition active:scale-95 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer group"
            title="ប្តូរពណ៌ & ម៉ូដផ្ទាំង (Change Theme & Color Palette)"
          >
            <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:rotate-45 transition-transform" />
            <span className="hidden md:inline font-bold">ម៉ូដពណ៌</span>
          </button>
        )}

        {/* Real-time Teacher Notice Bell Button */}
        <button
          type="button"
          onClick={onOpenTeacherNotices}
          className="relative p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs sm:text-sm transition active:scale-95 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 cursor-pointer group"
          title="ការជូនដំណឹងផ្លូវការដល់គ្រូ & ប្រតិទិនឈប់សម្រាក"
        >
          <div className="relative">
            <Bell className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
          </div>
          <span className="hidden sm:inline font-bold">ជូនដំណឹង</span>
        </button>

        {/* Academic Year Button */}
        <button
          type="button"
          onClick={onOpenYearManager}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 text-slate-950 rounded-xl font-black text-xs sm:text-sm transition active:scale-95 border border-amber-300 shadow-md shadow-amber-500/20 group cursor-pointer"
          title="ឆ្នាំសិក្សា"
        >
          <Calendar className="w-4 h-4 text-slate-950 shrink-0 group-hover:rotate-12 transition-transform" />
          <span className="whitespace-nowrap font-black">{activeYear}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
