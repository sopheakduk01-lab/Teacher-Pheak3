import React from 'react';
import {
  Home,
  Shield,
  Compass,
  PlusCircle,
  BookOpen,
  Gamepad2,
  Users,
  Award,
  Settings,
  MessageSquare,
  Palette,
  Cloud,
  KeyRound,
  Heart,
  Printer,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  teacher: TeacherProfile;
  onOpenProfile: () => void;
  onOpenGroupChat: () => void;
  onOpenCustomize: () => void;
  onOpenAccountSync: () => void;
  onOpenLampAuth: () => void;
  onOpenHealthEducation: () => void;
  onPrint: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
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
  isMobileOpen,
  onCloseMobile,
}) => {
  const mainNavItems = [
    { id: 'home', label: 'ទំព័រដើម', icon: Home },
    { id: 'admin', label: 'រដ្ឋបាលថ្នាក់', icon: Shield },
    { id: 'create', label: 'បង្កើតសំណួរ', icon: PlusCircle },
    { id: 'library', label: 'បណ្ណាល័យ', icon: BookOpen },
    { id: 'discover', label: 'ស្វែងរក', icon: Compass },
    { id: 'games', label: 'ហ្គេមអប់រំ', icon: Gamepad2 },
    { id: 'honor_roll', label: 'តារាងកិត្តិយស', icon: Award },
    { id: 'student_portal', label: 'ផតថលសិស្ស', icon: Users },
  ];

  const content = (
    <div className="flex flex-col h-full justify-between p-3 select-none">
      {/* Top Section */}
      <div className="space-y-4">
        {/* Logo / Brand Header */}
        <div className="flex items-center justify-between px-2 py-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg font-black shrink-0 shadow-md">
              🏫
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <span className="font-moul text-xs text-slate-900 dark:text-white block">
                  រដ្ឋបាលគ្រូ
                </span>
                <span className="text-[10px] text-purple-600 font-bold block">
                  បឋមសិក្សា ថ្នាក់ទី៦
                </span>
              </div>
            )}
          </div>
          {isMobileOpen && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (isMobileOpen) onCloseMobile();
                }}
                title={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Action Shortcuts & Utilities */}
      <div className="space-y-1 pt-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onOpenGroupChat}
          title="ឆាតក្រុមថ្នាក់រៀន"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
          {!isCollapsed && <span>ឆាតក្រុមថ្នាក់</span>}
        </button>

        <button
          onClick={onOpenAccountSync}
          title="ភ្ជាប់គណនី Cloud Sync"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Cloud className="w-4 h-4 text-emerald-600 shrink-0" />
          {!isCollapsed && <span>ពពកទិន្នន័យ Cloud</span>}
        </button>

        <button
          onClick={onOpenCustomize}
          title="ប្តូរពណ៌ & ម៉ូដផ្ទាំង"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Palette className="w-4 h-4 text-purple-600 shrink-0" />
          {!isCollapsed && <span>ម៉ូដពណ៌</span>}
        </button>

        <button
          onClick={onOpenHealthEducation}
          title="អប់រំសុខភាពអន្តរកម្ម"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500 shrink-0" />
          {!isCollapsed && <span>អប់រំសុខភាព</span>}
        </button>

        <button
          onClick={onPrint}
          title="បោះពុម្ពឯកសារ"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Printer className="w-4 h-4 text-amber-600 shrink-0" />
          {!isCollapsed && <span>បោះពុម្ព</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`no-print hidden md:block bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 sticky top-0 h-screen transition-all duration-200 z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-2xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-slate-900 shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
