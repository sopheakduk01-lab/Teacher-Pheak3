import React from 'react';
import {
  Award,
  CalendarCheck,
  FileQuestion,
  BookOpen,
  Gamepad2,
  Calculator,
  HelpCircle,
  LogOut,
  Sparkles,
  User,
  MessageSquare,
  Palette,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { Student } from '../types';

export interface StudentSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentStudent: Student;
  totalXP: number;
  levelTitle: string;
  onOpenProfile: () => void;
  onOpenGroupChat: () => void;
  onOpenCustomize: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
  onTeacherModeExit: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  fontFamily?: string;
  backgroundTheme?: string;
  fontSizeScale?: string;
  [key: string]: any;
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
  isMobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const tabs = [
    { id: 'results', label: 'លទ្ធផល & កាតសិស្ស', icon: Award },
    { id: 'attendance', label: 'វត្តមានរបស់ខ្ញុំ', icon: CalendarCheck },
    { id: 'online_exam', label: 'ប្រឡងតាមអ៊ីនធឺណិត', icon: FileQuestion },
    { id: 'lessons', label: 'មេរៀនសង្ខេប', icon: BookOpen },
    { id: 'games', label: 'ហ្គេមអប់រំ', icon: Gamepad2 },
  ];

  const content = (
    <div className="flex flex-col h-full justify-between p-3 select-none">
      <div className="space-y-4">
        {/* Student Avatar & XP Header */}
        <div
          onClick={onOpenProfile}
          className="p-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white cursor-pointer hover:opacity-95 transition shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
              {currentStudent.avatar || '🎓'}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h4 className="font-black text-xs sm:text-sm truncate font-moul">{currentStudent.name}</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-bold mt-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{totalXP} XP &bull; {levelTitle}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  onTabChange(t.id);
                  if (isMobileOpen && onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Utilities */}
      <div className="space-y-1 pt-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onOpenGroupChat}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
          {!isCollapsed && <span>ឆាតក្រុមថ្នាក់</span>}
        </button>

        <button
          onClick={onToggleSound}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {soundMuted ? (
            <VolumeX className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
          {!isCollapsed && <span>{soundMuted ? 'បើកសំឡេង' : 'បិទសំឡេង'}</span>}
        </button>

        <button
          onClick={onTeacherModeExit}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-4 h-4 text-slate-500 shrink-0" />
          {!isCollapsed && <span>ត្រឡប់ទៅរដ្ឋបាលគ្រូ</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden md:block bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 sticky top-0 h-screen transition-all ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {content}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-950/60" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-slate-900 shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
