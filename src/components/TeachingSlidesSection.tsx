import React, { useState, useMemo } from 'react';
import {
  Presentation,
  Smartphone,
  BookOpenCheck,
  PlusCircle,
  Search,
  Filter,
  Layers,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  FolderOpen,
  Zap,
  GraduationCap,
  Clock,
  Flame,
  FileText,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
  Bookmark,
  Share2
} from 'lucide-react';
import { khmerLessonPlansList, subjectsList, LessonPlanDetail } from '../data/khmerLessonPlansData';

export interface CustomSlideDeck {
  id: string | number;
  title: string;
  subject: string;
  lessonNo?: string;
  grade: string;
  slidesCount: number;
  description: string;
  presenter: string;
  updatedAt: string;
  linkedLessonId?: string;
  slides: Array<{ title: string; content: string; bulletPoints: string[] }>;
}

interface TeachingSlidesSectionProps {
  teacher: {
    name?: string;
    school?: string;
    grade?: string;
  };
  onOpenSlidePresentation: (lesson: LessonPlanDetail) => void;
  onOpenLessonPlan: (subject: string, lessonId?: string) => void;
  onOpenSlideRemote: (pin?: string) => void;
  onShowToast: (msg: string) => void;
}

export const TeachingSlidesSection: React.FC<TeachingSlidesSectionProps> = ({
  teacher,
  onOpenSlidePresentation,
  onOpenLessonPlan,
  onOpenSlideRemote,
  onShowToast
}) => {
  // Filter States
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLessonNo, setSelectedLessonNo] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'grouped'>('grouped');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
    'ភាសាខ្មែរ': true,
    'គណិតវិទ្យា': true,
    'វិទ្យាសាស្ត្រ': true,
    'សិក្សាសង្គម': true,
    'អប់រំសុខភាព': true,
    'ភាសាអង់គ្លេស និងបំណិនជីវិត': true,
    'custom': true
  });

  // Featured Lesson
  const [featuredLesson, setFeaturedLesson] = useState<LessonPlanDetail>(khmerLessonPlansList[0]);

  // Teacher Custom Slide Decks
  const [customDecks, setCustomDecks] = useState<CustomSlideDeck[]>([
    {
      id: 'custom-1',
      title: 'ភាសាខ្មែរ៖ អានអត្ថបទ "សួនច្បារសាលារៀនខ្ញុំ"',
      subject: 'ភាសាខ្មែរ',
      lessonNo: 'មេរៀនទី ១២',
      grade: teacher.grade || 'ថ្នាក់ទី ៦',
      slidesCount: 3,
      description: 'ស្លាយបង្រៀនអន្តរកម្មសម្រាប់ណែនាំវាក្យសព្ទ ការអានយល់ន័យ និងសំណួរពិភាក្សាក្រុម។',
      presenter: teacher.name || 'លោកគ្រូ / អ្នកគ្រូ',
      updatedAt: '២០២៦-០៨-២០',
      linkedLessonId: 'khmer_gr6_lp01',
      slides: [
        { title: 'ស្វាគមន៍មកកាន់ម៉ោងសិក្សា ភាសាខ្មែរ', content: 'មេរៀនទី ១២៖ សួនច្បារសាលារៀនខ្ញុំ', bulletPoints: ['គោលបំណង៖ អាននិងយល់ន័យអត្ថបទ', 'ស្គាល់ពាក្យថ្មីៗក្នុងមេរៀន', 'ការអនុវត្តអានជាគូ និងជាក្រុម'] },
        { title: 'វាក្យសព្ទ និងអត្ថន័យ', content: 'ពាក្យគន្លឹះប្រចាំមេរៀន', bulletPoints: ['- បណ្ដុះបណ្ដាល៖ ដាំដុះ រៀបចំឱ្យលូតលាស់', '- សោភ័ណភាព៖ ភាពស្រស់ស្អាត គួរឱ្យទាក់ទាញ', '- សហការ៖ ធ្វើការងាររួមគ្នាដើម្បីសម្រេចជោគជ័យ'] },
        { title: 'សំណួរស្វែងយល់អត្ថបទ', content: 'ពិភាក្សាជាមួយមិត្តរួមតុ', bulletPoints: ['១. តើសួនច្បារក្នុងសាលារៀនមានលក្ខណៈដូចម្តេច?', '២. តើសិស្សបានធ្វើអ្វីខ្លះដើម្បីថែទាំសួនច្បារ?', '៣. តើកូនទទួលបានប្រយោជន៍អ្វីខ្លះពីសួនច្បារសាលា?'] }
      ]
    },
    {
      id: 'custom-2',
      title: 'គណិតវិទ្យា៖ ប្រភាគ និងការប្រៀបធៀបប្រភាគ',
      subject: 'គណិតវិទ្យា',
      lessonNo: 'មេរៀនទី ៥',
      grade: teacher.grade || 'ថ្នាក់ទី ៦',
      slidesCount: 2,
      description: 'ស្លាយពន្យល់ពីគំនិតប្រភាគ ការបែងចែកចំណែក និងលំហាត់អនុវត្តលើក្ដារខៀន។',
      presenter: teacher.name || 'លោកគ្រូ / អ្នកគ្រូ',
      updatedAt: '២០២៦-០៨-២១',
      slides: [
        { title: 'គំនិតមូលដ្ឋាននៃប្រភាគ', content: 'តើប្រភាគជាអ្វី?', bulletPoints: ['ប្រភាគតំណាងឱ្យផ្នែកខ្លះនៃចំនួនពេញមួយ', 'ភាគយក (Numerator) នៅផ្នែកខាងលើ', 'ភាគបែង (Denominator) នៅផ្នែកខាងក្រោម'] },
        { title: 'ឧទាហរណ៍ជាក់ស្តែង', content: 'ការបែងចែកនំភីហ្សាជា ៤ ចំណែក', bulletPoints: ['ញ៉ាំ ១ ចំណែក គឺ 1/4', 'នៅសល់ ៣ ចំណែក គឺ 3/4', 'សរុបទាំងអស់គឺ 4/4 = 1'] }
      ]
    },
    {
      id: 'custom-3',
      title: 'វិទ្យាសាស្ត្រ៖ ដំណើរការរស្មីសំយោគរបស់រុក្ខជាតិ',
      subject: 'វិទ្យាសាស្ត្រ',
      lessonNo: 'មេរៀនទី ៣',
      grade: teacher.grade || 'ថ្នាក់ទី ៦',
      slidesCount: 2,
      description: 'ស្លាយរូបភាព និងដ្យាក្រាមពន្យល់ពីរបៀបដែលរុក្ខជាតិផលិតអាហារដោយខ្លួនឯង។',
      presenter: teacher.name || 'លោកគ្រូ / អ្នកគ្រូ',
      updatedAt: '២០២៦-០៨-២២',
      slides: [
        { title: 'តើរុក្ខជាតិត្រូវការអ្វីខ្លះ?', content: 'ធាតុផ្សំសំខាន់ៗសម្រាប់រស្មីសំយោគ', bulletPoints: ['១. ពន្លឺព្រះអាទិត្យ (ថាមពល)', '២. ទឹក ពីឬស', '៣. ឧស្ម័នកាបូនឌីអុកស៊ីត ពីខ្យល់'] },
        { title: 'ផលិតផលដែលទទួលបាន', content: 'អ្វីដែលរុក្ខជាតិផលិតចេញមក', bulletPoints: ['- ជាតិស្ករ (គ្លុយកូស) សម្រាប់ចិញ្ចឹមដើម', '- ឧស្ម័នអុកស៊ីសែន សម្រាប់មនុស្សនិងសត្វដកដង្ហើម'] }
      ]
    }
  ]);

  // Modal State for Adding / Editing Custom Slides
  const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState<boolean>(false);
  const [newSlideSubject, setNewSlideSubject] = useState<string>('ភាសាខ្មែរ');
  const [newSlideLessonNo, setNewSlideLessonNo] = useState<string>('មេរៀនទី ១');
  const [newSlideTitle, setNewSlideTitle] = useState<string>('');
  const [newSlideDesc, setNewSlideDesc] = useState<string>('');
  const [newSlidePoints, setNewSlidePoints] = useState<string>('');

  // Subject definitions with styles & icons
  const subjectConfig: Record<string, { label: string; icon: string; color: string; bgBadge: string; textBadge: string; border: string }> = {
    'ភាសាខ្មែរ': {
      label: 'ភាសាខ្មែរ',
      icon: '🇰🇭',
      color: 'from-indigo-900 to-purple-950',
      bgBadge: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      textBadge: 'text-indigo-700',
      border: 'border-indigo-200'
    },
    'គណិតវិទ្យា': {
      label: 'គណិតវិទ្យា',
      icon: '🔢',
      color: 'from-blue-900 to-cyan-950',
      bgBadge: 'bg-blue-50 text-blue-900 border-blue-200',
      textBadge: 'text-blue-700',
      border: 'border-blue-200'
    },
    'វិទ្យាសាស្ត្រ': {
      label: 'វិទ្យាសាស្ត្រ',
      icon: '🔬',
      color: 'from-emerald-900 to-teal-950',
      bgBadge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      textBadge: 'text-emerald-700',
      border: 'border-emerald-200'
    },
    'សិក្សាសង្គម': {
      label: 'សិក្សាសង្គម',
      icon: '🌏',
      color: 'from-amber-900 to-orange-950',
      bgBadge: 'bg-amber-50 text-amber-900 border-amber-200',
      textBadge: 'text-amber-700',
      border: 'border-amber-200'
    },
    'អប់រំសុខភាព': {
      label: 'អប់រំសុខភាព',
      icon: '🍎',
      color: 'from-rose-900 to-pink-950',
      bgBadge: 'bg-rose-50 text-rose-900 border-rose-200',
      textBadge: 'text-rose-700',
      border: 'border-rose-200'
    },
    'ភាសាអង់គ្លេស និងបំណិនជីវិត': {
      label: 'ភាសាអង់គ្លេស & បំណិនជីវិត',
      icon: '🇬🇧',
      color: 'from-purple-900 to-slate-950',
      bgBadge: 'bg-purple-50 text-purple-900 border-purple-200',
      textBadge: 'text-purple-700',
      border: 'border-purple-200'
    }
  };

  // Distinct subjects present in lesson plan list
  const availableSubjects = useMemo(() => {
    const subs = Array.from(new Set(khmerLessonPlansList.map(l => l.subject)));
    return subs;
  }, []);

  // Distinct lesson numbers available under selected subject
  const availableLessonNos = useMemo(() => {
    let list = khmerLessonPlansList;
    if (selectedSubject !== 'all' && selectedSubject !== 'custom') {
      list = list.filter(l => l.subject === selectedSubject);
    }
    const nos = Array.from(new Set(list.map(l => l.lessonNo).filter(Boolean)));
    return nos.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, [selectedSubject]);

  // Filtered Lessons
  const filteredLessons = useMemo(() => {
    if (selectedSubject === 'custom') {
      return [];
    }

    return khmerLessonPlansList.filter((lesson) => {
      // Subject filter
      if (selectedSubject !== 'all' && lesson.subject !== selectedSubject) {
        return false;
      }
      // Lesson No filter
      if (selectedLessonNo !== 'all' && lesson.lessonNo !== selectedLessonNo) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = (lesson.title || '').toLowerCase().includes(query);
        const matchLessonNo = (lesson.lessonNo || '').toLowerCase().includes(query);
        const matchSubject = (lesson.subject || '').toLowerCase().includes(query);
        const matchSub = (lesson.subLessonTitle || '').toLowerCase().includes(query);
        const matchMain = (lesson.mainLessonTitle || '').toLowerCase().includes(query);
        const matchKnow = (lesson.objectives?.knowledge || '').toLowerCase().includes(query);
        return matchTitle || matchLessonNo || matchSubject || matchSub || matchMain || matchKnow;
      }
      return true;
    });
  }, [selectedSubject, selectedLessonNo, searchQuery]);

  // Filtered Custom Decks
  const filteredCustomDecks = useMemo(() => {
    return customDecks.filter((deck) => {
      if (selectedSubject !== 'all' && selectedSubject !== 'custom' && deck.subject !== selectedSubject) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = deck.title.toLowerCase().includes(query);
        const matchSubject = deck.subject.toLowerCase().includes(query);
        const matchDesc = deck.description.toLowerCase().includes(query);
        return matchTitle || matchSubject || matchDesc;
      }
      return true;
    });
  }, [customDecks, selectedSubject, searchQuery]);

  // Lessons Grouped by Subject for the Grouped view
  const lessonsBySubject = useMemo(() => {
    const groups: Record<string, LessonPlanDetail[]> = {};
    availableSubjects.forEach(sub => {
      groups[sub] = [];
    });

    filteredLessons.forEach(l => {
      if (!groups[l.subject]) {
        groups[l.subject] = [];
      }
      groups[l.subject].push(l);
    });

    return groups;
  }, [availableSubjects, filteredLessons]);

  const toggleSubjectExpand = (sub: string) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [sub]: !prev[sub]
    }));
  };

  const handleLaunchLesson = (lesson: LessonPlanDetail) => {
    setFeaturedLesson(lesson);
    onOpenSlidePresentation(lesson);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar with Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-900 text-amber-300 flex items-center justify-center shadow-md">
                <Presentation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <span>បណ្តុំស្លាយបង្រៀនអន្តរកម្មតាមមុខវិជ្ជា និងមេរៀន</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-black text-xs">
                    {khmerLessonPlansList.length + customDecks.length} ស្លាយដេក
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  រៀបចំតាមស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) បែងចែកតាម ៦ មុខវិជ្ជា និងមេរៀននីមួយៗយ៉ាងលម្អិត
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => onOpenSlideRemote()}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-2xl font-bold text-xs transition flex items-center gap-2 shadow-xs active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span>📱 តេឡេបញ្ជាស្លាយ (QR Remote)</span>
            </button>

            <button
              onClick={() => setIsAddSlideModalOpen(true)}
              className="px-4 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl font-bold text-xs transition flex items-center gap-2 shadow-md shadow-purple-900/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>បន្ថែមស្លាយផ្ទាល់ខ្លួនថ្មី</span>
            </button>
          </div>
        </div>

        {/* 2. SUBJECT CATEGORY PILLS (បែងចែកតាមមុខវិជ្ជា) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-purple-700" />
              <span>ជ្រើសរើសតាមមុខវិជ្ជា (Subject Filtering):</span>
            </span>
            <span>បង្ហាញ {filteredLessons.length + (selectedSubject === 'all' || selectedSubject === 'custom' ? filteredCustomDecks.length : 0)} មេរៀន</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            <button
              onClick={() => {
                setSelectedSubject('all');
                setSelectedLessonNo('all');
              }}
              className={`px-3.5 py-2 rounded-2xl font-bold text-xs transition shrink-0 flex items-center gap-2 ${
                selectedSubject === 'all'
                  ? 'bg-slate-900 text-amber-300 shadow-md shadow-slate-900/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>🌟 មុខវិជ្ជាទាំងអស់</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${selectedSubject === 'all' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
                {khmerLessonPlansList.length}
              </span>
            </button>

            {availableSubjects.map((sub) => {
              const count = khmerLessonPlansList.filter(l => l.subject === sub).length;
              const cfg = subjectConfig[sub] || { icon: '📚', bgBadge: 'bg-slate-100 text-slate-800' };
              const isSelected = selectedSubject === sub;

              return (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubject(sub);
                    setSelectedLessonNo('all');
                  }}
                  className={`px-3.5 py-2 rounded-2xl font-bold text-xs transition shrink-0 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-purple-900 text-white border-purple-800 shadow-md shadow-purple-900/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{cfg.icon}</span>
                  <span>{sub}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Custom Teacher Decks Pill */}
            <button
              onClick={() => {
                setSelectedSubject('custom');
                setSelectedLessonNo('all');
              }}
              className={`px-3.5 py-2 rounded-2xl font-bold text-xs transition shrink-0 flex items-center gap-2 border ${
                selectedSubject === 'custom'
                  ? 'bg-purple-900 text-white border-purple-800 shadow-md'
                  : 'bg-white hover:bg-slate-50 text-purple-900 border-purple-200'
              }`}
            >
              <span>✏️</span>
              <span>ស្លាយផ្ទាល់ខ្លួនគ្រូ</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${selectedSubject === 'custom' ? 'bg-amber-400 text-slate-950' : 'bg-purple-100 text-purple-900'}`}>
                {customDecks.length}
              </span>
            </button>
          </div>
        </div>

        {/* 3. LESSON FILTER & SEARCH BAR (បែងចែកតាមមេរៀន និងស្វែងរក) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកតាមចំណងជើងមេរៀន, ខ្លឹមសាររង, វត្ថុបំណង, ពាក្យគន្លឹះ..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-medium transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Lesson Number Selector Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedLessonNo}
              onChange={(e) => setSelectedLessonNo(e.target.value)}
              disabled={selectedSubject === 'custom'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:border-purple-500 focus:outline-none disabled:opacity-50"
            >
              <option value="all">📂 មេរៀនទាំងអស់ ({availableLessonNos.length} មេរៀន)</option>
              {availableLessonNos.map((no) => (
                <option key={no} value={no}>
                  {no}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="sm:col-span-3 flex items-center justify-end gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('grouped')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                viewMode === 'grouped' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="បែងចែកតាមមុខវិជ្ជា និងមេរៀន"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">តាមមុខវិជ្ជា</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="ក្រឡាកាត"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">កាត</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                viewMode === 'list' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="បញ្ជីតារាង"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">បញ្ជី</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. ⭐ FEATURED LESSON SLIDE SHOWCASE (ផ្ទាំងស្លាយលេចធ្លោប្រចាំមេរៀន) */}
      {featuredLesson && (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white p-6 sm:p-7 rounded-[32px] border-2 border-amber-400/40 shadow-2xl shadow-purple-950/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-md flex items-center gap-1.5 animate-pulse">
                  <span>✨ ស្លាយបង្រៀនអន្តរកម្មកម្រិតស្តង់ដារ MoEYS</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[11px] font-bold">
                  {featuredLesson.subject}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[11px] font-bold">
                  {featuredLesson.lessonNo}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>📱 បញ្ជាពីទូរស័ព្ទ (QR Remote)</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {featuredLesson.subject} {featuredLesson.lessonNo}៖ <span className="text-amber-300">{featuredLesson.title}</span>
              </h2>

              {featuredLesson.subLessonTitle && (
                <p className="text-sm text-purple-200 font-bold">
                  ចំណុចរង៖ {featuredLesson.subLessonTitle} (៥ ជំហានបង្រៀនសកម្ម)
                </p>
              )}

              {/* Objectives Snippet */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10">
                  <span className="text-amber-300 font-black block">១. វិជ្ជាសម្បទា</span>
                  <span className="text-slate-200 text-[11px] line-clamp-2">{featuredLesson.objectives.knowledge}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10">
                  <span className="text-cyan-300 font-black block">២. បំណិនសម្បទា</span>
                  <span className="text-slate-200 text-[11px] line-clamp-2">{featuredLesson.objectives.skill}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10">
                  <span className="text-emerald-300 font-black block">៣. ចរិយាសម្បទា</span>
                  <span className="text-slate-200 text-[11px] line-clamp-2">{featuredLesson.objectives.attitude}</span>
                </div>
              </div>
            </div>

            {/* Showcase Launch Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => handleLaunchLesson(featuredLesson)}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 transition active:scale-95 flex items-center justify-center gap-2.5 border border-amber-200 group"
              >
                <Presentation className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                <span>🖥️ បើកស្លាយបង្រៀនពេញអេក្រង់</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFeaturedLesson(featuredLesson);
                  onOpenSlidePresentation(featuredLesson);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs transition active:scale-95 flex items-center justify-center gap-2 border border-indigo-400/40 shadow-md"
              >
                <Smartphone className="w-4 h-4 text-amber-300" />
                <span>📱 បញ្ជាស្លាយពីទូរស័ព្ទ (QR)</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenLessonPlan(featuredLesson.subject, featuredLesson.id)}
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold text-xs transition active:scale-95 flex items-center justify-center gap-2 border border-slate-700"
              >
                <BookOpenCheck className="w-4 h-4 text-amber-300" />
                <span>មើលកិច្ចតែងការយោង</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAIN CONTENT DISPLAY (GROUPED BY SUBJECT / GRID / LIST) */}
      {viewMode === 'grouped' && selectedSubject !== 'custom' && (
        <div className="space-y-6">
          {availableSubjects.map((subjectKey) => {
            const lessons = lessonsBySubject[subjectKey] || [];
            if (lessons.length === 0) return null;
            const isExpanded = expandedSubjects[subjectKey] !== false;
            const cfg = subjectConfig[subjectKey] || {
              icon: '📚',
              color: 'from-slate-900 to-indigo-950',
              bgBadge: 'bg-purple-100 text-purple-900 border-purple-200'
            };

            return (
              <div key={subjectKey} className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Subject Section Header */}
                <div
                  onClick={() => toggleSubjectExpand(subjectKey)}
                  className="flex items-center justify-between p-5 bg-slate-50/80 hover:bg-slate-100/80 cursor-pointer transition border-b border-slate-200/60 select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cfg.icon}</span>
                    <div>
                      <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                        <span>មុខវិជ្ជា {subjectKey}</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-purple-900 shadow-2xs">
                          {lessons.length} មេរៀន
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        ចុចដើម្បីបើកស្លាយបង្រៀនអន្តរកម្មតាមមេរៀននីមួយៗ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLessonPlan(subjectKey);
                      }}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-900 text-xs font-bold border border-slate-200 transition"
                    >
                      <BookOpenCheck className="w-3.5 h-3.5 text-purple-700" />
                      <span>កិច្ចតែងការទាំងអស់</span>
                    </button>

                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Lessons Grid within Subject */}
                {isExpanded && (
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lessons.map((lesson) => {
                      const isCurrentlyFeatured = featuredLesson?.id === lesson.id;
                      return (
                        <div
                          key={lesson.id}
                          className={`p-4.5 rounded-[22px] border text-xs space-y-3 transition flex flex-col justify-between ${
                            isCurrentlyFeatured
                              ? 'bg-purple-50/60 border-purple-300 ring-2 ring-purple-500/20 shadow-sm'
                              : 'bg-white hover:bg-slate-50/60 border-slate-200/80 hover:border-purple-200 shadow-2xs'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 font-extrabold border border-purple-200/60 text-[11px]">
                                {lesson.lessonNo || 'មេរៀន'}
                              </span>
                              <span className="text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {lesson.duration || '៤០-៥០ នាទី'}
                              </span>
                            </div>

                            <h5 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                              {lesson.title}
                            </h5>

                            {lesson.subLessonTitle && (
                              <p className="text-[11px] font-bold text-purple-800 line-clamp-1">
                                {lesson.subLessonTitle}
                              </p>
                            )}

                            <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                              {lesson.objectives?.knowledge || 'គោលបំណងវិជ្ជាសម្បទា និងបំណិនសម្បទាប្រចាំមេរៀន'}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setFeaturedLesson(lesson);
                                onOpenLessonPlan(lesson.subject, lesson.id);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition flex items-center gap-1"
                              title="មើលកិច្ចតែងការ"
                            >
                              <BookOpenCheck className="w-3.5 h-3.5 text-purple-700" />
                              <span>កិច្ចតែងការ</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleLaunchLesson(lesson)}
                              className="flex-1 px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-[11px] transition flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <Presentation className="w-3.5 h-3.5 text-amber-300" />
                              <span>បើកស្លាយ</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 6. GRID VIEW OF ALL FILTERED LESSONS */}
      {viewMode === 'grid' && selectedSubject !== 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => {
            const isCurrentlyFeatured = featuredLesson?.id === lesson.id;
            const cfg = subjectConfig[lesson.subject] || { bgBadge: 'bg-purple-50 text-purple-900 border-purple-200' };

            return (
              <div
                key={lesson.id}
                className={`p-5 rounded-[24px] border text-xs space-y-3.5 transition flex flex-col justify-between shadow-xs ${
                  isCurrentlyFeatured
                    ? 'bg-purple-50/50 border-purple-300 ring-2 ring-purple-500/20'
                    : 'bg-white hover:bg-slate-50/70 border-slate-200/80 hover:border-purple-300'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-2.5 py-1 rounded-xl font-extrabold border text-[11px] ${cfg.bgBadge}`}>
                      {lesson.subject}
                    </span>
                    <span className="px-2 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {lesson.lessonNo}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                    {lesson.title}
                  </h4>

                  {lesson.subLessonTitle && (
                    <p className="text-[11px] font-bold text-indigo-800 line-clamp-1">
                      {lesson.subLessonTitle}
                    </p>
                  )}

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-black text-slate-400 block">គោលបំណងចម្បង</span>
                    <p className="text-slate-700 text-[11px] line-clamp-2 leading-relaxed">
                      {lesson.objectives?.knowledge}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenLessonPlan(lesson.subject, lesson.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-900 transition"
                    title="មើលកិច្ចតែងការយោង"
                  >
                    <BookOpenCheck className="w-4 h-4 text-purple-700" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchLesson(lesson)}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Presentation className="w-3.5 h-3.5 text-amber-300" />
                    <span>បើកស្លាយបង្រៀន</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. LIST / TABLE VIEW */}
      {viewMode === 'list' && selectedSubject !== 'custom' && (
        <div className="bg-white rounded-[24px] border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-800 border-b border-slate-200">
                <tr>
                  <th className="p-3.5 text-center w-14">ល.រ</th>
                  <th className="p-3.5 w-32">មុខវិជ្ជា</th>
                  <th className="p-3.5 w-28">មេរៀនទី</th>
                  <th className="p-3.5">ចំណងជើងមេរៀន & ខ្លឹមសាររង</th>
                  <th className="p-3.5 w-32">រយៈពេល</th>
                  <th className="p-3.5 text-right w-44">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLessons.map((lesson, idx) => {
                  const cfg = subjectConfig[lesson.subject] || { bgBadge: 'bg-slate-100 text-slate-800' };
                  return (
                    <tr key={lesson.id} className="hover:bg-purple-50/40 transition">
                      <td className="p-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${cfg.bgBadge}`}>
                          {lesson.subject}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-purple-950">{lesson.lessonNo}</td>
                      <td className="p-3.5">
                        <span className="font-extrabold text-slate-900 block text-xs">{lesson.title}</span>
                        {lesson.subLessonTitle && (
                          <span className="text-[11px] text-slate-500 font-medium">{lesson.subLessonTitle}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-500 font-medium">{lesson.duration || '៤០-៥០ នាទី'}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenLessonPlan(lesson.subject, lesson.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                            title="មើលកិច្ចតែងការ"
                          >
                            <BookOpenCheck className="w-3.5 h-3.5 text-purple-700" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLaunchLesson(lesson)}
                            className="px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-[11px] transition flex items-center gap-1 shadow-xs"
                          >
                            <Presentation className="w-3 h-3 text-amber-300" />
                            <span>ស្លាយ</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. CUSTOM TEACHER DECKS SECTION */}
      {(selectedSubject === 'all' || selectedSubject === 'custom') && filteredCustomDecks.length > 0 && (
        <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-4 border-slate-100">
            <div>
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <span>✏️ ស្លាយផ្ទាល់ខ្លួនរបស់គ្រូ (Custom Teacher Slide Decks)</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
                  {filteredCustomDecks.length} ស្លាយ
                </span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                ស្លាយដែលលោកគ្រូអ្នកគ្រូបានបង្កើត និងកែសម្រួលដោយផ្ទាល់សម្រាប់ថ្នាក់រៀន
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddSlideModalOpen(true)}
              className="px-3.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl font-bold text-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>បន្ថែមថ្មី</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomDecks.map((deck) => (
              <div
                key={deck.id}
                className="bg-slate-50/80 p-5 rounded-[24px] border border-slate-200/80 text-xs space-y-3 shadow-2xs hover:border-purple-300 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-white text-purple-900 font-extrabold border border-slate-200">
                      {deck.subject}
                    </span>
                    <span className="text-slate-500 font-semibold bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                      {deck.slidesCount} ស្លាយ
                    </span>
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-sm line-clamp-2">{deck.title}</h5>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">{deck.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">កែប្រែ៖ {deck.updatedAt}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Find matching lesson or create mockup
                        const matched = khmerLessonPlansList.find(l => l.id === deck.linkedLessonId || l.subject === deck.subject);
                        if (matched) {
                          handleLaunchLesson(matched);
                        } else {
                          handleLaunchLesson(khmerLessonPlansList[0]);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Presentation className="w-3.5 h-3.5 text-amber-300" />
                      <span>បង្ហាញស្លាយ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`តើអ្នកពិតជាចង់លុបស្លាយ "${deck.title}" នេះមែនទេ?`)) {
                          setCustomDecks(customDecks.filter(d => d.id !== deck.id));
                          onShowToast('បានលុបស្លាយបង្រៀនជោគជ័យ!');
                        }
                      }}
                      className="p-1.5 rounded-xl bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 transition"
                      title="លុបស្លាយ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. MODAL FOR ADDING NEW CUSTOM SLIDE DECK (ជ្រើសរើសមុខវិជ្ជា និងមេរៀន) */}
      {isAddSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Presentation className="w-5 h-5 text-purple-900" />
                <span>បង្កើតស្លាយបង្រៀនផ្ទាល់ខ្លួនថ្មី</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddSlideModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSlideTitle.trim()) {
                  alert('សូមបញ្ចូលចំណងជើងស្លាយ');
                  return;
                }
                const newDeck: CustomSlideDeck = {
                  id: Date.now(),
                  title: newSlideTitle.trim(),
                  subject: newSlideSubject,
                  lessonNo: newSlideLessonNo,
                  grade: teacher.grade || 'ថ្នាក់ទី ៦',
                  slidesCount: 3,
                  description: newSlideDesc.trim() || 'ស្លាយបង្រៀនអន្តរកម្មប្រចាំមេរៀន',
                  presenter: teacher.name || 'លោកគ្រូ / អ្នកគ្រូ',
                  updatedAt: new Date().toISOString().split('T')[0],
                  slides: [
                    {
                      title: newSlideTitle.trim(),
                      content: 'សេចក្តីផ្តើមមេរៀន & គោលបំណង',
                      bulletPoints: newSlidePoints ? newSlidePoints.split('\n').filter(Boolean) : ['គោលបំណងមេរៀន', 'ការណែនាំសកម្មភាពសិស្ស']
                    },
                    {
                      title: 'ខ្លឹមសារមេរៀន និងលំហាត់អនុវត្ត',
                      content: 'សកម្មភាពរៀនសូត្រជាគូ និងជាក្រុម',
                      bulletPoints: ['១. ពន្យល់និងពិភាក្សាខ្លឹមសារស្នូល', '២. លំហាត់អនុវត្តជាក់ស្តែងលើក្តារឈ្នួន']
                    },
                    {
                      title: 'ពង្រឹងចំណេះដឹង & កិច្ចការផ្ទះ',
                      content: 'ការវាយតម្លៃ និងការអប់រំគុណធម៌',
                      bulletPoints: ['- សំណួរវាយតម្លៃចុងម៉ោង (Exit Ticket)', '- បណ្តាំផ្ញើ និងកិច្ចការផ្ទះ']
                    }
                  ]
                };
                setCustomDecks([newDeck, ...customDecks]);
                setIsAddSlideModalOpen(false);
                setNewSlideTitle('');
                setNewSlideDesc('');
                setNewSlidePoints('');
                onShowToast('បានបង្កើតស្លាយបង្រៀនថ្មីជោគជ័យ!');
              }}
              className="space-y-4 text-xs"
            >
              {/* Subject Selection */}
              <div>
                <label className="block font-bold mb-1.5 text-slate-700">មុខវិជ្ជា</label>
                <select
                  value={newSlideSubject}
                  onChange={(e) => setNewSlideSubject(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                >
                  <option value="ភាសាខ្មែរ">🇰🇭 ភាសាខ្មែរ</option>
                  <option value="គណិតវិទ្យា">🔢 គណិតវិទ្យា</option>
                  <option value="វិទ្យាសាស្ត្រ">🔬 វិទ្យាសាស្ត្រ</option>
                  <option value="សិក្សាសង្គម">🌏 សិក្សាសង្គម</option>
                  <option value="អប់រំសុខភាព">🍎 អប់រំសុខភាព</option>
                  <option value="ភាសាអង់គ្លេស និងបំណិនជីវិត">🇬🇧 ភាសាអង់គ្លេស និងបំណិនជីវិត</option>
                </select>
              </div>

              {/* Lesson Number */}
              <div>
                <label className="block font-bold mb-1.5 text-slate-700">មេរៀនទី / ជំពូក</label>
                <input
                  type="text"
                  value={newSlideLessonNo}
                  onChange={(e) => setNewSlideLessonNo(e.target.value)}
                  placeholder="ឧ. មេរៀនទី ៥, ជំពូកទី ២..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold mb-1.5 text-slate-700">ចំណងជើងស្លាយបង្រៀន *</label>
                <input
                  type="text"
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                  placeholder="ឧ. គណិតវិទ្យា៖ ប្រមាណវិធីចែកចំនួនទសភាគ..."
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold mb-1.5 text-slate-700">សេចក្តីសង្ខេបពីខ្លឹមសារស្លាយ</label>
                <textarea
                  value={newSlideDesc}
                  onChange={(e) => setNewSlideDesc(e.target.value)}
                  rows={2}
                  placeholder="បរិយាយពីខ្លឹមសារស្លាយ វត្ថុបំណង ឬលក្ខណៈពិសេស..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              {/* Bullet Points */}
              <div>
                <label className="block font-bold mb-1.5 text-slate-700">ចំណុចគន្លឹះក្នុងស្លាយ (១ ជួរ = ១ ចំណុច)</label>
                <textarea
                  value={newSlidePoints}
                  onChange={(e) => setNewSlidePoints(e.target.value)}
                  rows={3}
                  placeholder="ឧ.&#10;- គោលបំណងមេរៀន&#10;- រូបមន្តគន្លឹះ&#10;- លំហាត់អនុវត្តជាក្រុម"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSlideModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold shadow-md shadow-purple-900/20"
                >
                  រក្សាទុកស្លាយ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
