import React from 'react';
import {
  Home,
  ClipboardCheck,
  PlusSquare,
  LayoutGrid,
  Compass,
  Hash,
  Printer,
  Pencil,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  School,
  Palette,
  Gamepad2,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Lightbulb,
  Cloud,
  Trophy,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TeacherProfile } from '../types';
import { AppLogo } from './AppLogo';

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isExternal?: boolean;
  externalUrl?: string;
  badge?: string;
}

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  teacher: TeacherProfile;
  onOpenProfile: () => void;
  onOpenGroupChat?: () => void;
  onOpenCustomize?: () => void;
  onOpenAccountSync?: () => void;
  onOpenLampAuth?: () => void;
  onOpenHealthEducation?: () => void;
  onPrint: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  fontFamily?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  teacher,
  onOpenProfile,
  onOpenGroupChat,
  onOpenCustomize,
  onOpenAccountSync,
  onOpenLampAuth,
  onOpenHealthEducation,
  onPrint,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  fontFamily,
}) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'ទំព័រដើម (Kahoot! Home)', shortLabel: 'ទំព័រដើម', icon: Home, color: 'text-purple-700' },
    { id: 'admin', label: 'រដ្ឋបាលគ្រូបឋម (៤ ផ្នែក)', shortLabel: 'រដ្ឋបាលគ្រូ', icon: ClipboardCheck, color: 'text-purple-700' },
    { id: 'health_education', label: 'អប់រំសុខភាព & ៤០ QCM', shortLabel: 'សុខភាព', icon: Heart, color: 'text-emerald-600', badge: '🏥 ៤០Q' },
    { id: 'honor_roll', label: 'តារាងកិត្តិយស (Honor Roll)', shortLabel: 'តារាងកិត្តិយស', icon: Trophy, color: 'text-amber-500', badge: '🏆 ឆ្នើម' },
    { id: 'group_chat', label: 'ក្រុមជជែកក្នុងថ្នាក់ (Group Chat)', shortLabel: 'Group Chat', icon: MessageCircle, color: 'text-indigo-600', badge: '💬' },
    { id: 'create', label: 'បង្កើតសំណួរប្រឡង', shortLabel: 'បង្កើតតេស្ត', icon: PlusSquare, color: 'text-blue-600' },
    { id: 'library', label: 'បណ្ណាល័យមេរៀន', shortLabel: 'បណ្ណាល័យ', icon: LayoutGrid, color: 'text-amber-500' },
    { id: 'student_portal', label: 'ទំព័រសិស្ស (Student Portal)', shortLabel: 'សិស្ស', icon: GraduationCap, color: 'text-indigo-600', badge: '🎓 ថ្មី' },
    { id: 'discover', label: 'ស្វែងរកមេរៀន', shortLabel: 'ស្វែងរក', icon: Compass, color: 'text-emerald-600' },
    { id: 'join', label: 'ចូលរួម Game PIN', shortLabel: 'Game PIN', icon: Hash, color: 'text-rose-600' },
    { id: 'games', label: 'ល្បែងសិក្សាអន្តរកម្ម', shortLabel: 'ល្បែងសិក្សា', icon: Gamepad2, color: 'text-violet-600', badge: '🎮' },
    { id: 'backup_sync', label: 'សុវត្ថិភាព & Cloud Backup', shortLabel: 'Backup', icon: ShieldCheck, color: 'text-emerald-600', badge: '🔒' },
    { id: 'lamp_auth', label: 'អំពូលភ្លើងចូលប្រព័ន្ធ (Lamp)', shortLabel: 'Lamp Login', icon: Lightbulb, color: 'text-amber-500', badge: '💡' },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.id === 'health_education') {
      onOpenHealthEducation?.();
      return;
    }
    if (item.id === 'group_chat') {
      onOpenGroupChat?.();
      return;
    }
    if (item.id === 'backup_sync') {
      onOpenAccountSync?.();
      return;
    }
    if (item.id === 'lamp_auth') {
      onOpenLampAuth?.();
      return;
    }
    if (item.isExternal && item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    onTabChange(item.id);
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        style={{ fontFamily }}
        className={`no-print hidden md:flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-r border-slate-200/90 dark:border-slate-800 sticky top-0 h-screen z-30 shrink-0 justify-between shadow-sm transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20 p-3' : 'w-64 lg:w-72 p-5'
        }`}
      >
        <div className="space-y-6">
          {/* Branding Header & Collapse Button */}
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                onClick={onOpenProfile}
                title="កែប្រែប្រវត្តិរូប"
                className="relative group hover:scale-105 transition active:scale-95 cursor-pointer"
              >
                <AppLogo size="md" rounded="rounded-2xl" />
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-purple-950 rounded-full p-1 shadow-xs z-10">
                  <Pencil className="w-2.5 h-2.5" />
                </span>
              </button>

              <button
                onClick={onToggleCollapse}
                title="ពង្រីករបាចំហៀង (Expand Sidebar)"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition shadow-xs active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 px-1 pt-1">
              <div
                onClick={onOpenProfile}
                className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition group min-w-0"
              >
                <div className="relative shrink-0">
                  <AppLogo size="md" rounded="rounded-2xl" />
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-purple-950 rounded-full p-1 shadow-xs group-hover:scale-110 transition z-10">
                    <Pencil className="w-3 h-3" />
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm lg:text-base font-black text-slate-900 dark:text-white leading-tight truncate">រដ្ឋបាលគ្រូបឋម</h1>
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md font-kahoot shrink-0 shadow-2xs tracking-wider">
                      PRO
                    </span>
                  </div>
                  <p className="text-xs font-bold text-purple-700 dark:text-purple-400 mt-0.5 truncate">{teacher.name}</p>
                </div>
              </div>

              {/* Collapse Toggle Button */}
              <button
                onClick={onToggleCollapse}
                title="បង្រួមរបាចំហៀង (Collapse Sidebar)"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95 cursor-pointer"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="space-y-1.5 pt-2 text-xs font-bold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              if (isCollapsed) {
                return (
                  <div key={item.id} className="relative group flex justify-center">
                    <button
                      onClick={() => handleNavClick(item)}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl transition relative cursor-pointer ${
                        isActive
                          ? 'text-white bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-500 shadow-md shadow-purple-600/30 ring-2 ring-purple-400/40'
                          : item.isExternal
                          ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-amber-400 text-purple-950 text-[8px] font-black px-1 rounded-full shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </button>
                    {/* Hover Tooltip */}
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 border border-slate-700 text-white text-[11px] font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition shadow-xl z-50 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <span>{item.label}</span>
                      {item.isExternal && <ExternalLink className="w-3 h-3 text-amber-300" />}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition text-left cursor-pointer ${
                    isActive
                      ? 'text-white font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 shadow-md shadow-purple-900/30 border border-purple-400/30'
                      : item.isExternal
                      ? 'text-cyan-700 dark:text-cyan-200 font-bold bg-cyan-50 dark:bg-cyan-950/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 border border-cyan-200 dark:border-cyan-800/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.isExternal ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="bg-amber-400 text-purple-950 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                        {item.badge || 'LINK'}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300" />
                    </div>
                  ) : item.badge && !isActive ? (
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold border border-slate-200 dark:border-slate-700">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area */}
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2 pb-2">
            {onOpenAccountSync && (
              <button
                onClick={onOpenAccountSync}
                title="សុវត្ថិភាព & Cloud Backup"
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-700 dark:text-cyan-300 flex items-center justify-center transition shadow-xs active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-300" />
              </button>
            )}
            {onOpenLampAuth && (
              <button
                onClick={onOpenLampAuth}
                title="អំពូលភ្លើងចូលប្រព័ន្ធ (Lamp Login)"
                className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center transition shadow-xs active:scale-95 border border-amber-300 cursor-pointer"
              >
                <Lightbulb className="w-5 h-5 text-slate-950 animate-pulse" />
              </button>
            )}
            {onOpenCustomize && (
              <button
                onClick={onOpenCustomize}
                title="កែសម្រួលទម្រង់អក្សរ & ផ្ទៃក្រឡាសៀវភៅ"
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 flex items-center justify-center transition shadow-xs active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </button>
            )}
            <button
              onClick={onPrint}
              title="បោះពុម្ព / Print PDF"
              className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition shadow-xs active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Printer className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <button
              onClick={onToggleCollapse}
              title="ពង្រីករបាចំហៀង"
              className="w-12 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Profile & Quick Action Card */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-2.5 shadow-xs">
              <div
                onClick={onOpenProfile}
                className="flex items-center justify-between cursor-pointer hover:opacity-85 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl shrink-0">🏫</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{teacher.school}</h4>
                    <p className="text-[10px] text-purple-700 dark:text-purple-300 truncate font-semibold">ថ្នាក់ទទួលបន្ទុក៖ {teacher.grade}</p>
                  </div>
                </div>
                <Pencil className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              </div>

              {/* Quick Backup & Cloud Sync Button */}
              {onOpenAccountSync && (
                <button
                  onClick={onOpenAccountSync}
                  className="w-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shadow-2xs active:scale-98 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> សុវត្ថិភាព & Cloud Backup
                </button>
              )}

              {/* Lamp Login Quick Button */}
              {onOpenLampAuth && (
                <button
                  onClick={onOpenLampAuth}
                  className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs active:scale-98 border border-amber-300 cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-slate-950 animate-pulse" />
                  <span>អំពូលភ្លើងចូលប្រព័ន្ធ (Lamp)</span>
                </button>
              )}

              {onOpenCustomize && (
                <button
                  onClick={onOpenCustomize}
                  className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black py-2 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 border border-purple-400/40 active:scale-98 cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-amber-300" /> ម៉ូដពណ៌ & ផ្ទៃក្រឡាសៀវភៅ
                </button>
              )}

              <button
                onClick={onPrint}
                className="w-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shadow-2xs active:scale-98 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-purple-600 dark:text-purple-400" /> បោះពុម្ព / Save PDF
              </button>
            </div>

            {/* Sidebar toggle bottom bar */}
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold py-2 rounded-xl transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>បង្រួមរបាចំហៀង (Collapse)</span>
            </button>
          </div>
        )}
      </aside>

      {/* ================= MOBILE SLIDE-OUT DRAWER ================= */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden no-print">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            {/* Slide-out Sidebar Panel */}
            <motion.div
              style={{ fontFamily }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 h-full shadow-2xl z-10 flex flex-col justify-between p-5 overflow-y-auto border-r border-slate-200 dark:border-slate-800"
            >
              <div className="space-y-6">
                {/* Header in Mobile Drawer */}
                <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                  <div
                    onClick={() => {
                      onOpenProfile();
                      onCloseMobile?.();
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <AppLogo size="sm" rounded="rounded-xl" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-sm font-black text-slate-900 dark:text-white truncate">រដ្ឋបាលគ្រូបឋម</h2>
                        <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-md font-kahoot shrink-0">
                          PRO
                        </span>
                      </div>
                      <p className="text-xs font-bold text-purple-700 dark:text-purple-400 truncate">{teacher.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={onCloseMobile}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-1.5 text-xs font-bold">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleNavClick(item);
                          onCloseMobile?.();
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition text-left cursor-pointer ${
                          isActive
                            ? 'text-white font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 shadow-md shadow-purple-900/30 border border-purple-400/30'
                            : item.isExternal
                            ? 'text-cyan-700 dark:text-cyan-200 font-bold bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/40'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.isExternal ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="bg-amber-400 text-purple-950 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                              {item.badge || 'LINK'}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300" />
                          </div>
                        ) : item.badge && !isActive ? (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold border border-slate-200 dark:border-slate-700">
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 space-y-1 text-xs border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{teacher.school}</p>
                  <p className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold">ថ្នាក់ទទួលបន្ទុក៖ {teacher.grade}</p>
                </div>

                {onOpenAccountSync && (
                  <button
                    onClick={() => {
                      onOpenAccountSync();
                      onCloseMobile?.();
                    }}
                    className="w-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 active:scale-98"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> សុវត្ថិភាព & Cloud Backup
                  </button>
                )}

                {onOpenLampAuth && (
                  <button
                    onClick={() => {
                      onOpenLampAuth();
                      onCloseMobile?.();
                    }}
                    className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
                  >
                    <Lightbulb className="w-4 h-4 text-slate-950" /> អំពូលភ្លើងចូលប្រព័ន្ធ
                  </button>
                )}

                {onOpenCustomize && (
                  <button
                    onClick={() => {
                      onOpenCustomize();
                      onCloseMobile?.();
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 border border-purple-400/40 active:scale-98"
                  >
                    <Palette className="w-4 h-4 text-amber-300" /> ម៉ូដពណ៌ & ផ្ទៃក្រឡាសៀវភៅ
                  </button>
                )}

                <button
                  onClick={() => {
                    onPrint();
                    onCloseMobile?.();
                  }}
                  className="w-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                >
                  <Printer className="w-4 h-4 text-purple-600 dark:text-purple-400" /> បោះពុម្ព / Save PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
