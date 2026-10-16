import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCw,
  FileText,
  Users,
  Compass,
} from 'lucide-react';
import { 
  getTeacherNoticeFeed, 
  TeacherNoticeItem, 
  TeacherNoticeFeed 
} from '../utils/teacherNoticeEngine';
import { TeacherProfile } from '../types';

interface TeacherOfficialNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: TeacherProfile;
  onOpenHolidaysModal?: () => void;
  onNavigateTab?: (tab: string) => void;
  onOpenGuidelineModal?: () => void;
  onOpenPlcModal?: () => void;
}

export const TeacherOfficialNoticeModal: React.FC<TeacherOfficialNoticeModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onOpenHolidaysModal,
  onNavigateTab,
  onOpenGuidelineModal,
  onOpenPlcModal,
}) => {
  const [feed, setFeed] = useState<TeacherNoticeFeed>(() => getTeacherNoticeFeed());
  const [activeFilter, setActiveFilter] = useState<'all' | 'holiday' | 'directive' | 'daily_duty'>('all');
  const [readNotices, setReadNotices] = useState<Set<string>>(() => new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live timer to update feed every minute
  useEffect(() => {
    if (!isOpen) return;

    const update = () => {
      setFeed(getTeacherNoticeFeed(new Date()));
    };

    update();
    const interval = setInterval(update, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setFeed(getTeacherNoticeFeed(new Date()));
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const markAllAsRead = () => {
    const allIds = new Set(feed.notices.map((n) => n.id));
    setReadNotices(allIds);
  };

  const handleAction = (notice: TeacherNoticeItem) => {
    setReadNotices((prev) => new Set(prev).add(notice.id));
    onClose();

    if (notice.actionType === 'open_holidays' && onOpenHolidaysModal) {
      onOpenHolidaysModal();
    } else if (notice.actionType === 'open_guidelines' && onOpenGuidelineModal) {
      onOpenGuidelineModal();
    } else if (notice.actionType === 'open_guidelines' && onNavigateTab) {
      onNavigateTab('home');
    } else if (notice.actionType === 'open_attendance' && onNavigateTab) {
      onNavigateTab('admin');
    } else if (notice.actionType === 'open_plc' && onOpenPlcModal) {
      onOpenPlcModal();
    } else if (onNavigateTab) {
      onNavigateTab('home');
    }
  };

  const filteredNotices = feed.notices.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-purple-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 p-4 sm:p-5 text-white relative border-b border-purple-800 shrink-0">
          {/* Background decorative pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-purple-950/70 rounded-[14px] flex items-center justify-center text-amber-300">
                  <Bell className="w-6 h-6 animate-bounce" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-amber-300 font-moul leading-snug">
                    ការជូនដំណឹងផ្លូវការដល់គ្រូ
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                    Real-time
                  </span>
                </div>
                <p className="text-xs text-purple-200 flex items-center gap-1.5 mt-0.5">
                  <span>ប្រតិទិនឈប់សម្រាក • សេចក្តីណែនាំក្រសួង • ភារកិច្ចបង្រៀន</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
              title="បិទ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Live Date & Time Bar */}
          <div className="mt-3.5 pt-3 border-t border-purple-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-200 font-medium">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{feed.currentDateFormattedKhmer}</span>
              <span className="text-purple-400">•</span>
              <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="font-bold text-white">{feed.currentTimeFormatted}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-purple-100 transition active:scale-95 cursor-pointer"
                title="ធ្វើបច្ចុប្បន្នភាពទិន្នន័យតាមពេលវេលា"
              >
                <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
                <span>Update ឥឡូវ</span>
              </button>

              <button
                onClick={markAllAsRead}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-800/80 hover:bg-purple-700 text-purple-200 transition active:scale-95 cursor-pointer"
              >
                សម្គាល់ថាបានអាន
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'all', label: 'ទាំងអស់', count: feed.notices.length },
            { id: 'holiday', label: '🏖️ ឈប់សម្រាក', count: feed.notices.filter((n) => n.category === 'holiday').length },
            { id: 'directive', label: '📜 សេចក្តីណែនាំ', count: feed.notices.filter((n) => n.category === 'directive').length },
            { id: 'daily_duty', label: '⏰ ភារកិច្ចបង្រៀន', count: feed.notices.filter((n) => n.category === 'daily_duty').length },
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Special Highlight: Next or Current Holiday Status Card */}
          {feed.holidayStatus && (
            <div className={`p-4 rounded-2xl border transition shadow-sm ${
              feed.holidayStatus.isToday
                ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300'
                : feed.holidayStatus.daysRemaining <= 3
                ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-300'
                : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border-purple-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl p-2 rounded-2xl bg-white shadow-xs border border-slate-200 shrink-0">
                    {feed.holidayStatus.holiday.icon || '🏖️'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                        feed.holidayStatus.isToday
                          ? 'bg-emerald-600 text-white'
                          : feed.holidayStatus.daysRemaining <= 3
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-purple-600 text-white'
                      }`}>
                        {feed.holidayStatus.statusLabel}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {feed.holidayStatus.holiday.durationLabel}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-sm sm:text-base mt-1 font-moul leading-snug">
                      {feed.holidayStatus.holiday.name}
                    </h3>

                    <p className="text-xs text-slate-600 mt-1">
                      📅 {feed.holidayStatus.holiday.dateKhmer} • {feed.holidayStatus.teacherNote}
                    </p>
                  </div>
                </div>

                {onOpenHolidaysModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenHolidaysModal();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold transition shadow-xs active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-center"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>មើលប្រតិទិនអនុក្រឹត្យ</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* List of Active Notices */}
          <div className="space-y-3">
            {filteredNotices.map((notice) => {
              const isRead = readNotices.has(notice.id);
              return (
                <div
                  key={notice.id}
                  className={`p-4 rounded-2xl border transition duration-200 hover:shadow-md ${
                    isRead 
                      ? 'bg-slate-50/70 border-slate-200 opacity-80' 
                      : 'bg-white border-slate-200/90 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center text-lg shrink-0 border border-purple-200">
                        {notice.icon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${notice.badgeColor}`}>
                            {notice.badge}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {notice.categoryLabel}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {notice.timeContext}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {notice.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {notice.content}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action row */}
                  {notice.actionLabel && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {isRead ? '✓ បានអាន' : '🔔 មិនទាន់អាន'}
                      </span>
                      <button
                        onClick={() => handleAction(notice)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs transition active:scale-95 flex items-center gap-1.5 border border-purple-200/80 cursor-pointer"
                      >
                        <span>{notice.actionLabel}</span>
                        <ExternalLink className="w-3 h-3 text-purple-700" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ធ្វើបច្ចុប្បន្នភាពស្វ័យប្រវត្តតាមកាលបរិច្ឆេទ</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer shadow-xs"
          >
            យល់ព្រម / បិទ
          </button>
        </div>
      </div>
    </div>
  );
};
