import React, { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  FileText,
  MousePointerClick,
  GitFork,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Figma,
  Triangle,
  Layers,
  Sparkles,
  Command,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  active?: boolean;
}

interface IntegrationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  customColor?: string;
}

export const DataPulseSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const mainMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cms', label: 'CMS', icon: Database },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'clicks', label: 'Clicks', icon: MousePointerClick },
    { id: 'split-testing', label: 'Split Testing', icon: GitFork },
  ];

  const integrationItems: IntegrationItem[] = [
    { id: 'figma', label: 'Figma', icon: Figma, customColor: 'text-[#F24E1E]' },
    { id: 'vercel', label: 'Vercel', icon: Triangle, customColor: 'text-black' },
    { id: 'framer', label: 'Framer', icon: Layers, customColor: 'text-[#0055FF]' },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen bg-[#F8FAFC] border-r border-slate-200/80 transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-[78px]' : 'w-[260px]'
      }`}
    >
      {/* 1. Header: Logo + Brand + Collapse Toggle Button */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Circle */}
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1d70f5] text-white shadow-sm shadow-blue-500/30 shrink-0 font-bold">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          {/* Brand Name */}
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="font-extrabold text-[16px] text-slate-900 tracking-tight leading-none truncate font-sans">
                DataPulse
              </span>
              <span className="text-[11px] font-medium text-slate-400 leading-tight">
                Analytics Platform
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 2. Search Box */}
      <div className="px-3 pt-3.5 pb-2">
        {isCollapsed ? (
          <div className="relative group flex justify-center">
            <button
              onClick={() => setIsCollapsed(false)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors shadow-2xs"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Hover Tooltip when collapsed */}
            <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
              <div className="relative bg-[#1d70f5] text-white text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                Search
                {/* Arrow pointer */}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1d70f5] rotate-45" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-white border border-slate-200/90 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d70f5]/20 focus:border-[#1d70f5] transition-all shadow-2xs"
            />
            <div className="absolute right-2.5 flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 pointer-events-none">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Navigation List & Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-6 no-scrollbar">
        {/* Main Menu */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Main Menu
            </div>
          )}

          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#EBF2FE] text-[#1d70f5] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-150 ${
                      isActive ? 'text-[#1d70f5]' : 'text-slate-500 group-hover:text-slate-700'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate text-left flex-1">{item.label}</span>
                  )}
                </button>

                {/* Collapsed Hover Tooltip Badge */}
                {isCollapsed && (
                  <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                    <div className="relative bg-[#1d70f5] text-white text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                      {item.label}
                      {/* Triangle Pointer */}
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1d70f5] rotate-45" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Integrations Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Integrations
            </div>
          )}

          {integrationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#EBF2FE] text-[#1d70f5] font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      item.customColor || 'text-slate-500'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate text-left flex-1">{item.label}</span>
                  )}
                </button>

                {/* Collapsed Hover Tooltip Badge */}
                {isCollapsed && (
                  <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                    <div className="relative bg-[#1d70f5] text-white text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                      {item.label}
                      {/* Triangle Pointer */}
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1d70f5] rotate-45" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom User Profile Section */}
      <div className="p-3 border-t border-slate-200/80 bg-white/50">
        <div className="relative group">
          <button
            className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100/80 transition-colors ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* User Avatar */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Nate Johnson"
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
              />

              {/* User Details */}
              {!isCollapsed && (
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Nate Johnson
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    nate@datapulse.io
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
            )}
          </button>

          {/* Collapsed Tooltip for Profile */}
          {isCollapsed && (
            <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
              <div className="relative bg-[#1d70f5] text-white text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                Nate Johnson
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1d70f5] rotate-45" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
