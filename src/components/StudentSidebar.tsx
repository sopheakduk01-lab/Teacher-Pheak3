import React from 'react';
import {
  Home,
  GraduationCap,
  BookOpen,
  Gamepad2,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Volume2,
  VolumeX,
  Palette,
  LogOut,
  ShieldCheck,
  CalendarCheck,
  X,
  Hash,
  Library,
  MessageCircle,
  User,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from '../types';
import { isImageAvatar } from '../utils/imageCompressor';

interface StudentNavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
}

interface StudentSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentStudent: Student;
  totalXP: number;
  levelTitle: string;
  onOpenProfile: () => void;
  onOpenGroupChat?: () => void;
  onOpenCustomize: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
  onTeacherModeExit?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  fontFamily?: string;
  backgroundTheme?: string;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  currentTab,
  onTabChange,
  currentStudent,
  totalXP,
  levelTitle,
  onOpenProfile,
  onOpenGroupChat,
  onOpenCustomize,
  soundMuted,
  onToggleSound,
  onLogout,
  onTeacherModeExit,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  fontFamily,
  backgroundTheme,
}) => {
  const navItems: StudentNavItem[] = [
    { id: 'results', label: 'ទំព័រដើម & លទ្ធផល', shortLabel: 'ទំព័រដើម', icon: Home, color: 'text-sky-600' },
    { id: 'profile', label: 'ព័ត៌មានផ្ទាល់ខ្លួន', shortLabel: 'ប្រវត្តិរូប', icon: User, color: 'text-purple-600', badge: '👤' },
    { id: 'group_chat', label: 'ក្រុមជជែកក្នុងថ្នាក់', shortLabel: 'Group Chat', icon: MessageCircle, color: 'text-indigo-600', badge: '💬' },
    { id: 'attendance', label: 'វត្តមាន & អវត្តមាន', shortLabel: 'វត្តមាន', icon: CalendarCheck, color: 'text-emerald-600', badge: '📅' },
    { id: 'homework', label: 'កិច្ចការផ្ទះសិស្ស', shortLabel: 'កិច្ចការផ្ទះ', icon: GraduationCap, color: 'text-amber-600', badge: 'ថ្មី' },
    { id: 'formulas', label: 'រៀន & រូបមន្តទី៦', shortLabel: 'រៀន', icon: BookOpen, color: 'text-emerald-600' },
    { id: 'games', label: 'ល្បែងសិក្សាអន្តរកម្ម', shortLabel: 'ល្បែងសិក្សា', icon: Gamepad2, color: 'text-purple-600', badge: '🎮' },
    { id: 'join', label: 'ចូលរួម Game PIN', shortLabel: 'Game PIN', icon: Hash, color: 'text-rose-600', badge: '🎯' },
    { id: 'library', label: 'បណ្ណាល័យសៀវភៅ', shortLabel: 'បណ្ណាល័យ', icon: Library, color: 'text-teal-600', badge: '📚' },
    { id: 'online_exam', label: 'ប្រឡង & តេស្ត Online', shortLabel: 'តេស្ត', icon: FileText, color: 'text-rose-600', badge: '⭐' },
  ];

  const handleItemClick = (id: string) => {
    if (id === 'profile') {
      onOpenProfile();
      if (onCloseMobile) onCloseMobile();
      return;
    }
    if (id === 'group_chat') {
      if (onOpenGroupChat) onOpenGroupChat();
      if (onCloseMobile) onCloseMobile();
      return;
    }
    onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  const getSidebarThemeStyles = () => {
    switch (backgroundTheme) {
      case 'blackboard':
        return 'bg-emerald-950/95 text-emerald-50 border-emerald-800/60 shadow-emerald-950/30';
      case 'parchment':
        return 'bg-[#fbf7ee]/95 text-amber-950 border-amber-200/80 shadow-amber-900/10';
      case 'dark':
        return 'bg-slate-900/95 text-slate-100 border-slate-800 shadow-black/40';
      case 'lavender':
        return 'bg-purple-50/90 text-purple-950 border-purple-200/70 shadow-purple-900/10';
      case 'mint':
        return 'bg-emerald-50/90 text-teal-950 border-emerald-200/70 shadow-emerald-900/10';
      case 'pink':
        return 'bg-rose-50/90 text-rose-950 border-rose-200/70 shadow-rose-900/10';
      default:
        return 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border-slate-200/80 dark:border-slate-800';
    }
  };

  const sidebarContent = (
    <div
      style={{ fontFamily }}
      className={`no-print flex flex-col backdrop-blur-xl border-r h-full justify-between transition-all duration-300 ease-in-out ${getSidebarThemeStyles()} ${
        isCollapsed ? 'w-20 p-3' : 'w-64 lg:w-72 p-4 sm:p-5'
      }`}
    >
      <div className="space-y-4">
        {/* Branding Header & Collapse Button */}
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3 pt-1">
            <button
              onClick={onOpenProfile}
              title="ប្តូររូបតំណាងសិស្ស & កាតសិស្ស"
              className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-500 shadow-md shadow-purple-900/20 relative group hover:scale-105 transition cursor-pointer"
            >
              <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center text-white text-lg">
                {currentStudent.avatar && isImageAvatar(currentStudent.avatar) ? (
                  <img
                    src={currentStudent.avatar}
                    alt={currentStudent.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{currentStudent.avatar || (currentStudent.gender === 'F' ? '👧' : '👦')}</span>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-purple-950 rounded-full p-1 shadow-xs">
                <Pencil className="w-2.5 h-2.5" />
              </span>
            </button>

            <button
              onClick={onToggleCollapse}
              title="ពង្រីករបាចំហៀង (Expand Sidebar)"
              className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-900 dark:text-purple-200 flex items-center justify-center transition shadow-xs active:scale-95 cursor-pointer"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 px-1 pt-1">
              <div
                onClick={onOpenProfile}
                className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition group min-w-0 flex-1"
                title="ចុចដើម្បីមើល ឬកែប្រែព័ត៌មានផ្ទាល់ខ្លួន និងកាតសិស្ស"
              >
                <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-500 shadow-md shadow-purple-900/20 relative shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center text-white text-xl">
                    {currentStudent.avatar && isImageAvatar(currentStudent.avatar) ? (
                      <img
                        src={currentStudent.avatar}
                        alt={currentStudent.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{currentStudent.avatar || (currentStudent.gender === 'F' ? '👧' : '👦')}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-purple-950 rounded-full p-1 shadow-xs group-hover:scale-110 transition">
                    <Pencil className="w-3 h-3" />
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight truncate">
                      {currentStudent.name}
                    </h1>
                    <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0">
                      #{currentStudent.rollNo}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 truncate">
                    {totalXP} XP &bull; {levelTitle}
                  </p>
                </div>
              </div>

              {/* Collapse Toggle Button */}
              <button
                onClick={onToggleCollapse}
                title="បង្រួមរបាចំហៀង (Collapse Sidebar)"
                className="p-2 rounded-xl text-slate-400 hover:text-purple-900 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition shrink-0 active:scale-95 cursor-pointer"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </div>

            {/* XP Progress Bar towards next level */}
            <div className="bg-slate-100 dark:bg-slate-800/80 rounded-xl p-2 border border-slate-200/70 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                <span>កម្រិតពិន្ទុរៀនសូត្រ</span>
                <span className="text-purple-600 dark:text-purple-400 font-extrabold">{totalXP % 100}/100 XP</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, totalXP % 100))}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1 pt-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            if (isCollapsed) {
              return (
                <div key={item.id} className="relative group flex justify-center">
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition relative cursor-pointer ${
                      isActive
                        ? 'text-white bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-md shadow-purple-900/30 ring-2 ring-purple-600/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-1 rounded-full shadow-xs animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                  {/* Hover Tooltip */}
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition shadow-xl z-50 top-1/2 -translate-y-1/2">
                    {item.label}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition text-left cursor-pointer ${
                  isActive
                    ? 'text-white font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 shadow-md shadow-indigo-500/20'
                    : 'text-slate-700 dark:text-slate-200 font-bold hover:bg-purple-50/80 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
                      isActive
                        ? 'bg-white/20 text-white shadow-inner'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                  </div>
                  <span className="text-[13px] leading-tight truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-rose-500 text-white animate-pulse shadow-xs'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Utilities */}
      <div className={`space-y-2 pt-3 border-t border-slate-200/80 dark:border-slate-800 ${isCollapsed ? 'items-center' : ''}`}>
        {!isCollapsed && (
          <div className="px-1 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            ការកំណត់ & ឧបករណ៍
          </div>
        )}

        <div className={`flex ${isCollapsed ? 'flex-col items-center gap-2' : 'grid grid-cols-2 gap-2'}`}>
          {/* Customize Font & Theme Button */}
          <button
            onClick={onOpenCustomize}
            title="កែសម្រួលទម្រង់អក្សរ & ផ្ទៃក្រឡាសៀវភៅ"
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 transition text-xs font-bold border border-purple-200 dark:border-purple-800 cursor-pointer ${
              isCollapsed ? 'w-12 h-12' : 'w-full'
            }`}
          >
            <Palette className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400" />
            {!isCollapsed && <span className="text-[11px] truncate">ទម្រង់អក្សរ</span>}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleSound}
            title={soundMuted ? 'បើកសំឡេង' : 'បិទសំឡេង'}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer ${
              isCollapsed ? 'w-12 h-12' : 'w-full'
            }`}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-400 shrink-0" /> : <Volume2 className="w-4 h-4 text-indigo-600 shrink-0" />}
            {!isCollapsed && <span className="text-[11px] truncate">{soundMuted ? 'បិទសំឡេង' : 'បើកសំឡេង'}</span>}
          </button>
        </div>

        {/* Switch Student / Teacher Mode Exit */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={onLogout}
            title="ប្តូរគណនីសិស្សផ្សេង"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold transition border border-rose-200 dark:border-rose-800 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span className="text-[11px] truncate">ប្តូរគណនីសិស្ស</span>}
          </button>

          {onTeacherModeExit && (
            <button
              onClick={onTeacherModeExit}
              title="សម្រាប់តែលោកគ្រូ-អ្នកគ្រូ (ត្រូវការលេខកូដសម្ងាត់គ្រូ)"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              {!isCollapsed && <span className="text-[11px] truncate">រដ្ឋបាលគ្រូ 🔒</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`no-print hidden md:block sticky top-0 h-screen z-30 shrink-0 shadow-xs transition-all duration-300`}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              style={{ fontFamily }}
              className={`relative w-72 h-full ${getSidebarThemeStyles()} z-10 flex flex-col shadow-2xl`}
            >
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={onCloseMobile}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sidebarContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
