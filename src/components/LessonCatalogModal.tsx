import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Star,
  CheckCircle2,
  Filter,
  Sparkles,
  Clock,
  ChevronRight,
  Layers
} from 'lucide-react';
import { khmerLessonPlansList, LessonPlanDetail, subjectsList } from '../data/khmerLessonPlansData';

interface LessonCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLessonId: string;
  onSelectLesson: (id: string) => void;
  starredLessonIds: string[];
  onToggleStar: (id: string, e: React.MouseEvent) => void;
}

const khmerCategories = [
  'ទាំងអស់',
  'អំណាន',
  'វេយ្យាករណ៍',
  'សរសេរតាមអាន',
  'តែងសេចក្តី',
  'បំណិន',
  'សន្ទនា',
  'តែងកំណាព្យ',
  'ការស្តាប់'
];

export const LessonCatalogModal: React.FC<LessonCatalogModalProps> = ({
  isOpen,
  onClose,
  currentLessonId,
  onSelectLesson,
  starredLessonIds,
  onToggleStar
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('ទាំងអស់');
  const [selectedKhmerCategory, setSelectedKhmerCategory] = useState<string>('ទាំងអស់');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filteredLessons = useMemo(() => {
    return khmerLessonPlansList.filter((lesson) => {
      // Favorites filter
      if (onlyFavorites && !starredLessonIds.includes(lesson.id)) {
        return false;
      }

      // Subject filter
      if (selectedSubject !== 'ទាំងអស់' && lesson.subject !== selectedSubject) {
        return false;
      }

      // Khmer sub-category filter
      if (lesson.subject === 'ភាសាខ្មែរ' && selectedKhmerCategory !== 'ទាំងអស់') {
        const titleAndSub = `${lesson.title} ${lesson.subLessonTitle || ''}`;
        if (!titleAndSub.includes(selectedKhmerCategory)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullText = `${lesson.lessonNo} ${lesson.title} ${lesson.subLessonTitle || ''} ${lesson.subject} ${lesson.sourceRef} ${lesson.pedagogy}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }

      return true;
    });
  }, [selectedSubject, selectedKhmerCategory, searchQuery, onlyFavorites, starredLessonIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* HEADER */}
        <div className="p-4 sm:p-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-400/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>កាតាឡុកកិច្ចតែងការបង្រៀនទាំងអស់</span>
                <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  សរុប {khmerLessonPlansList.length} មេរៀន
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                ចុចលើមេរៀនណាមួយដើម្បីបើកអាន កែសម្រួល ឬបោះពុម្ពភ្លាមៗ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 active:scale-95"
            title="បិទ (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="p-4 sm:px-6 bg-slate-950/60 border-b border-slate-800/80 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកតាមលេខមេរៀន ចំណងជើង ឬខ្លឹមសារ (ឧ. អំណាន, ប្រភាគ, បរិស្ថាន, Unit 1)..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Favorite Filter Toggle */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 shrink-0 border ${
                onlyFavorites
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700/80'
              }`}
            >
              <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
              <span>មេរៀនចំណាំ ({starredLessonIds.length})</span>
            </button>
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>មុខវិជ្ជា៖</span>
            </span>
            {subjectsList.map((sub) => {
              const count = sub.id === 'all'
                ? khmerLessonPlansList.length
                : khmerLessonPlansList.filter((l) => l.subject === sub.id).length;
              const isSelected = selectedSubject === sub.id || (sub.id === 'all' && selectedSubject === 'ទាំងអស់');
              const subKey = sub.id === 'all' ? 'ទាំងអស់' : sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubject(subKey);
                    if (subKey !== 'ភាសាខ្មែរ') setSelectedKhmerCategory('ទាំងអស់');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20 scale-105'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>
                    {subKey === 'ភាសាខ្មែរ' ? '📖' : subKey === 'គណិតវិទ្យា' ? '📐' : subKey === 'វិទ្យាសាស្ត្រ' ? '🔬' : subKey === 'សិក្សាសង្គម' ? '🏛️' : subKey === 'អប់រំសុខភាព' ? '🏥' : subKey === 'ភាសាអង់គ្លេស និងបំណិនជីវិត' ? '🌐' : '✨'}
                  </span>
                  <span>{subKey}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-amber-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-category for Khmer */}
          {selectedSubject === 'ភាសាខ្មែរ' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 pt-0">
              <span className="text-[11px] font-bold text-amber-400 shrink-0">ផ្នែករង៖</span>
              {khmerCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedKhmerCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition shrink-0 ${
                    selectedKhmerCategory === cat
                      ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LESSONS GRID */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-slate-950/30">
          {filteredLessons.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-3 animate-pulse" />
              <p className="font-bold text-sm">រកមិនឃើញមេរៀនដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ</p>
              <p className="text-xs text-slate-500 mt-1">សូមសាកល្បងផ្លាស់ប្តូរពាក្យគន្លឹះ ឬជ្រើសរើសមុខវិជ្ជាផ្សេង</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredLessons.map((lesson) => {
                const isSelected = lesson.id === currentLessonId;
                const isStarred = starredLessonIds.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      onSelectLesson(lesson.id);
                      onClose();
                    }}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-slate-900 to-amber-950/30 border-amber-400 shadow-lg shadow-amber-400/10 ring-2 ring-amber-400/50'
                        : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-slate-700 hover:shadow-xl'
                    }`}
                  >
                    <div>
                      {/* Top tags & star */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-400 border border-slate-700'
                          }`}>
                            {lesson.lessonNo}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-950/60 border border-slate-800">
                            {lesson.subject}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => onToggleStar(lesson.id, e)}
                          className={`p-1.5 rounded-xl transition ${
                            isStarred
                              ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                              : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
                          }`}
                          title={isStarred ? 'ដកចេញពីបញ្ជីចំណាំ' : 'ដាក់ក្នុងបញ្ជីចំណាំ'}
                        >
                          <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>

                      {/* Title */}
                      <h3 className={`font-bold text-xs sm:text-sm leading-snug line-clamp-2 transition ${
                        isSelected ? 'text-amber-300' : 'text-slate-200 group-hover:text-white'
                      }`}>
                        {lesson.title}
                      </h3>

                      {/* Sub-lesson topic if available */}
                      {lesson.subLessonTitle && (
                        <p className="text-[11px] text-purple-300/80 mt-1 line-clamp-1">
                          {lesson.subLessonTitle}
                        </p>
                      )}
                    </div>

                    {/* Footer stats & Action */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{lesson.duration}</span>
                      </span>

                      <span className={`font-black flex items-center gap-1 text-[11px] ${
                        isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-300'
                      }`}>
                        <span>{isSelected ? 'កំពុងបើកមើល' : 'ជ្រើសរើស'}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 sm:px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>បង្ហាញ {filteredLessons.length} ក្នុងចំណោម {khmerLessonPlansList.length} មេរៀន</span>
          <span className="hidden sm:inline">ចុច <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 text-[10px]">Esc</kbd> ដើម្បីបិទ</span>
        </div>
      </div>
    </div>
  );
};
