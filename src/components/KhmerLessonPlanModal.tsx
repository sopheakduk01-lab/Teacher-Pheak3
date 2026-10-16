import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  Printer,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Search,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Edit3,
  FileDown,
  Download,
  Save,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Star,
  History,
  Layers,
  Filter,
  ArrowUp,
  SlidersHorizontal,
  Bookmark,
  Image as ImageIcon,
  Maximize2,
  Plus,
  Trash2,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Award,
  Heart,
  Users,
  Presentation
} from 'lucide-react';
import { khmerLessonPlansList, LessonPlanDetail, subjectsList } from '../data/khmerLessonPlansData';
import { PdfCustomizerModal } from './PdfCustomizerModal';
import { LessonCatalogModal } from './LessonCatalogModal';
import { KhmerLessonSlideModal } from './KhmerLessonSlideModal';

interface KhmerLessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  onEditTimetable?: () => void;
  initialSubject?: string;
  initialLessonId?: string;
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

/**
 * Generates official print-ready HTML for the Lesson Plan PDF Customizer
 */
const generateLessonPlanHtml = (lesson: LessonPlanDetail) => {
  return `
    <div style="font-family: 'Kantumruy Pro', 'Siemreap', sans-serif; padding: 10px 20px; color: #0f172a; line-height: 1.6; max-width: 900px; margin: 0 auto; background: #ffffff;">
      <!-- Administrative Box -->
      <div style="background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px; margin-bottom: 18px; font-size: 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px; width: 33%;"><strong>កម្រិតថ្នាក់ & មុខវិជ្ជា៖</strong> ${lesson.grade} - ${lesson.subject}</td>
            <td style="padding: 4px; width: 33%;"><strong>មេរៀនទី៖</strong> <span style="color: #4c1d95; font-weight: bold;">${lesson.lessonNo} - ${lesson.title}</span></td>
            <td style="padding: 4px; width: 33%;"><strong>រយៈពេល & គ្រូបង្រៀន៖</strong> ${lesson.duration} &bull; ${lesson.teacherName}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 4px; border-top: 1px solid #e2e8f0; padding-top: 6px; margin-top: 4px;"><strong>ឯកសារយោង៖</strong> ${lesson.sourceRef}</td>
            <td style="padding: 4px; border-top: 1px solid #e2e8f0; padding-top: 6px; margin-top: 4px;"><strong>វិធីសាស្ត្របង្រៀន៖</strong> <span style="color: #581c87; font-weight: bold;">${lesson.pedagogy}</span></td>
          </tr>
        </table>
      </div>

      <!-- Digital Tools & Games -->
      ${(lesson.digitalTools?.length || lesson.learningGames?.length) ? `
      <div style="background: #2e1065; color: white; border-radius: 10px; padding: 12px; margin-bottom: 18px; font-size: 11px;">
        <strong style="color: #fde047; font-size: 12px; display: block; margin-bottom: 4px;">💻 ឧបករណ៍ឌីជីថល និងល្បែងសិក្សា៖</strong>
        <div><strong>ឧបករណ៍៖</strong> ${(lesson.digitalTools || []).join(', ')}</div>
        <div style="margin-top: 3px;"><strong>ល្បែងសិក្សា៖</strong> ${(lesson.learningGames || []).join(', ')}</div>
      </div>
      ` : ''}

      <!-- Pedagogical Tips -->
      ${lesson.pedagogicalTips ? `
      <div style="background: #fdf4ff; border: 1.5px solid #f0abfc; border-radius: 10px; padding: 10px 14px; margin-bottom: 18px; font-size: 11.5px; color: #701a75;">
        <strong style="display: block; margin-bottom: 3px; color: #86198f;">💡 គន្លឹះគរុកោសល្យ និងវិធីសាស្ត្រអនុវត្តន៍របស់គ្រូ៖</strong>
        <div>${lesson.pedagogicalTips}</div>
      </div>
      ` : ''}

      <!-- Section I Objectives -->
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 14px; font-weight: bold; color: #3b0764; border-bottom: 2px solid #3b0764; padding-bottom: 4px; margin-bottom: 8px;">I. វត្ថុបំណងនៃមេរៀន (Learning Objectives)</h3>
        <table style="width: 100%; border-collapse: separate; border-spacing: 6px;">
          <tr>
            <td style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px; width: 33%; vertical-align: top; font-size: 11px;">
              <strong style="color: #1e40af; display: block; margin-bottom: 4px;">១. វិជ្ជាសម្បទា (Knowledge)</strong>
              <div>${lesson.objectives?.knowledge || ''}</div>
            </td>
            <td style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px; width: 33%; vertical-align: top; font-size: 11px;">
              <strong style="color: #065f46; display: block; margin-bottom: 4px;">២. បំណិនសម្បទា (Skills)</strong>
              <div>${lesson.objectives?.skills || ''}</div>
            </td>
            <td style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px; width: 33%; vertical-align: top; font-size: 11px;">
              <strong style="color: #92400e; display: block; margin-bottom: 4px;">៣. ចរិយាសម្បទា (Attitude)</strong>
              <div>${lesson.objectives?.attitude || ''}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Section II Materials -->
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 14px; font-weight: bold; color: #3b0764; border-bottom: 2px solid #3b0764; padding-bottom: 4px; margin-bottom: 8px;">II. សម្ភារឧបទេស (Teaching Materials)</h3>
        <table style="width: 100%; border-collapse: separate; border-spacing: 6px;">
          <tr>
            <td style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 11px; width: 50%;">
              <strong>👨‍🏫 សម្រាប់គ្រូបង្រៀន៖</strong> ${lesson.materials?.teacher || ''}
            </td>
            <td style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 11px; width: 50%;">
              <strong>🙋‍♂️ សម្រាប់សិស្ស៖</strong> ${lesson.materials?.students || ''}
            </td>
          </tr>
        </table>
      </div>

      <!-- Section III Teaching Steps -->
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 14px; font-weight: bold; color: #3b0764; border-bottom: 2px solid #3b0764; padding-bottom: 4px; margin-bottom: 8px;">III. ដំណើរការបង្រៀន និងរៀន ៥ ជំហាន (Teaching Steps)</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1.5px solid #475569;">
          <thead>
            <tr style="background: #312e81; color: white;">
              <th style="padding: 6px 8px; border: 1px solid #475569; width: 14%;">ជំហាន / រយៈពេល</th>
              <th style="padding: 6px 8px; border: 1px solid #475569; width: 32%;">ខ្លឹមសារមេរៀន / ដំណាក់កាលសកម្ម</th>
              <th style="padding: 6px 8px; border: 1px solid #475569; width: 27%;">សកម្មភាពគ្រូបង្រៀន</th>
              <th style="padding: 6px 8px; border: 1px solid #475569; width: 27%;">សកម្មភាពសិស្ស</th>
            </tr>
          </thead>
          <tbody>
            ${(lesson.steps || []).map(step => `
              <tr>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold; vertical-align: top; background: #f8fafc;">${step.stepNo}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; vertical-align: top;">
                  <strong style="color: #3b0764; display: block; margin-bottom: 3px;">${step.stepTitle}</strong>
                  <div style="white-space: pre-line;">${step.content}</div>
                </td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; vertical-align: top; background: #f0f9ff;">${step.teacherActivity}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; vertical-align: top; background: #ecfdf5;">${step.studentActivity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Differentiation -->
      ${lesson.differentiation ? `
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 14px; font-weight: bold; color: #3b0764; border-bottom: 2px solid #3b0764; padding-bottom: 4px; margin-bottom: 8px;">ការបង្រៀនឆ្លើយតបតាមកម្រិតសមត្ថភាព (Differentiation)</h3>
        <table style="width: 100%; border-collapse: separate; border-spacing: 6px;">
          <tr>
            <td style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 8px 12px; font-size: 11px; width: 50%; vertical-align: top;">
              <strong style="color: #991b1b; display: block; margin-bottom: 4px;">🐢 សម្រាប់សិស្សរៀនយឺត (Slow Learners)៖</strong>
              <div>${lesson.differentiation.slowLearners}</div>
            </td>
            <td style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px 12px; font-size: 11px; width: 50%; vertical-align: top;">
              <strong style="color: #166534; display: block; margin-bottom: 4px;">🚀 សម្រាប់សិស្សរៀនពូកែ (Fast Learners)៖</strong>
              <div>${lesson.differentiation.fastLearners}</div>
            </td>
          </tr>
        </table>
      </div>
      ` : ''}

      <!-- Character Values -->
      ${lesson.characterValues ? `
      <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 10px 14px; margin-bottom: 18px; font-size: 11px; color: #9a3412;">
        <strong style="display: block; margin-bottom: 4px; color: #c2410c;">🌟 បណ្ដុះស្មារតីគុណធម៌ និងសីលធម៌ (Character Values)៖</strong>
        <div>${lesson.characterValues}</div>
      </div>
      ` : ''}

      <!-- Rubric Assessment Table -->
      ${(lesson.rubric && lesson.rubric.length > 0) ? `
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 14px; font-weight: bold; color: #3b0764; border-bottom: 2px solid #3b0764; padding-bottom: 4px; margin-bottom: 8px;">បន្ទាត់កម្រិតវាស់វែងការវាយតម្លៃ (Assessment Rubric)</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px; border: 1.5px solid #cbd5e1;">
          <thead>
            <tr style="background: #1e1b4b; color: white;">
              <th style="padding: 6px; border: 1px solid #cbd5e1; width: 24%;">លក្ខណៈវិនិច្ឆ័យ (Criteria)</th>
              <th style="padding: 6px; border: 1px solid #cbd5e1; width: 19%;">កម្រិត ៤ (ល្អប្រសើរ)</th>
              <th style="padding: 6px; border: 1px solid #cbd5e1; width: 19%;">កម្រិត ៣ (ល្អ)</th>
              <th style="padding: 6px; border: 1px solid #cbd5e1; width: 19%;">កម្រិត ២ (មធ្យម)</th>
              <th style="padding: 6px; border: 1px solid #cbd5e1; width: 19%;">កម្រិត ១ (កែលម្អ)</th>
            </tr>
          </thead>
          <tbody>
            ${lesson.rubric.map(r => `
              <tr>
                <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight: bold; background: #f8fafc;">${r.criteria}</td>
                <td style="padding: 6px; border: 1px solid #cbd5e1; background: #ecfdf5; color: #065f46;">${r.level4}</td>
                <td style="padding: 6px; border: 1px solid #cbd5e1; background: #eff6ff; color: #1e40af;">${r.level3}</td>
                <td style="padding: 6px; border: 1px solid #cbd5e1; background: #fffbeb; color: #92400e;">${r.level2}</td>
                <td style="padding: 6px; border: 1px solid #cbd5e1; background: #fef2f2; color: #991b1b;">${r.level1}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <!-- Section IV Homework -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: bold; color: #3b0764; border-bottom: 2px solid #3b0764; padding-bottom: 4px; margin-bottom: 8px;">IV. កិច្ចការផ្ទះ និងការពង្រឹងបន្ថែម (Homework)</h3>
        <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 8px; padding: 10px 14px; font-size: 12px; font-weight: bold; color: #78350f;">
          ${lesson.homework || ''}
        </div>
      </div>
    </div>
  `;
};

export const KhmerLessonPlanModal: React.FC<KhmerLessonPlanModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onEditTimetable,
  initialSubject,
  initialLessonId,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(khmerLessonPlansList[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ទាំងអស់');
  const [selectedKhmerCategory, setSelectedKhmerCategory] = useState<string>('ទាំងអស់');
  const [displayStyle, setDisplayStyle] = useState<'cards' | 'table'>('cards');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedHomework, setCopiedHomework] = useState(false);
  const [copiedObjectives, setCopiedObjectives] = useState(false);
  const [isLessonMenuOpen, setIsLessonMenuOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);

  // Sync initialSubject & initialLessonId when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      if (initialSubject && initialSubject !== 'all') {
        setSelectedSubject(initialSubject);
      }
      if (initialLessonId) {
        setSelectedLessonId(initialLessonId);
      } else if (initialSubject && initialSubject !== 'all') {
        const found = khmerLessonPlansList.find(l => l.subject === initialSubject);
        if (found) {
          setSelectedLessonId(found.id);
        }
      }
    }
  }, [isOpen, initialSubject, initialLessonId]);

  // Collapsible sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Sidebar Tab: 'all' | 'starred' | 'recent'
  const [sidebarTab, setSidebarTab] = useState<'all' | 'starred' | 'recent'>('all');

  // Starred / Bookmarked Lessons in LocalStorage
  const [starredLessonIds, setStarredLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('khmer_starred_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recent Visited Lessons in LocalStorage
  const [recentLessonIds, setRecentLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('khmer_recent_lessons');
      return saved ? JSON.parse(saved) : [khmerLessonPlansList[0].id];
    } catch {
      return [khmerLessonPlansList[0].id];
    }
  });

  // Custom live editing state per lesson
  const [customLessons, setCustomLessons] = useState<Record<string, LessonPlanDetail>>({});
  const [isEditing, setIsEditing] = useState(false);

  const mainScrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Save Starred to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('khmer_starred_lessons', JSON.stringify(starredLessonIds));
    } catch (e) {
      console.error(e);
    }
  }, [starredLessonIds]);

  // Save Recent to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('khmer_recent_lessons', JSON.stringify(recentLessonIds));
    } catch (e) {
      console.error(e);
    }
  }, [recentLessonIds]);

  // Track recent lesson visited
  const handleSelectLesson = (id: string) => {
    setSelectedLessonId(id);
    setIsLessonMenuOpen(false);
    setRecentLessonIds((prev) => {
      const filtered = prev.filter((item) => item !== id);
      return [id, ...filtered].slice(0, 15);
    });
    // Scroll top when switching lessons
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStarredLessonIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      if (onShowToast) {
        onShowToast(exists ? 'បានដកចេញពីមេរៀនចំណាំ' : 'បានរក្សាទុកក្នុងមេរៀនចំណាំ ⭐');
      }
      return updated;
    });
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevLesson();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextLesson();
      } else if (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsSidebarOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      } else if (e.key === '[' || e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsCatalogModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedLessonId, selectedSubject, searchQuery, selectedKhmerCategory, sidebarTab]);

  // Filter lessons for sidebar and header
  const filteredLessons = useMemo(() => {
    return khmerLessonPlansList.filter((l) => {
      // Sidebar Tab Filter
      if (sidebarTab === 'starred' && !starredLessonIds.includes(l.id)) {
        return false;
      }
      if (sidebarTab === 'recent' && !recentLessonIds.includes(l.id)) {
        return false;
      }

      // Subject Filter
      const matchSubject = selectedSubject === 'ទាំងអស់' || l.subject === selectedSubject;
      if (!matchSubject) return false;

      // Khmer Subcategory Filter
      if (selectedSubject === 'ភាសាខ្មែរ' && selectedKhmerCategory !== 'ទាំងអស់') {
        const titleAndSub = `${l.title} ${l.subLessonTitle || ''}`;
        if (!titleAndSub.includes(selectedKhmerCategory)) {
          return false;
        }
      }

      // Search Query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.lessonNo.toLowerCase().includes(q) ||
        (l.subLessonTitle && l.subLessonTitle.toLowerCase().includes(q)) ||
        l.subject.toLowerCase().includes(q) ||
        l.pedagogy.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedSubject, selectedKhmerCategory, sidebarTab, starredLessonIds, recentLessonIds]);

  const baseLesson =
    khmerLessonPlansList.find((l) => l.id === selectedLessonId) || khmerLessonPlansList[0];
  
  const currentLesson: LessonPlanDetail = customLessons[baseLesson.id] || baseLesson;

  // Find index of current lesson in filtered list
  const currentIdxInFiltered = filteredLessons.findIndex((l) => l.id === currentLesson.id);
  const currentIdxInAll = khmerLessonPlansList.findIndex((l) => l.id === currentLesson.id);

  // Stepper handlers
  const handlePrevLesson = () => {
    const list = filteredLessons.length > 0 ? filteredLessons : khmerLessonPlansList;
    const idx = list.findIndex((l) => l.id === currentLesson.id);
    if (idx > 0) {
      handleSelectLesson(list[idx - 1].id);
    } else if (idx === -1 && list.length > 0) {
      handleSelectLesson(list[0].id);
    } else if (idx === 0) {
      // Loop or stay
      handleSelectLesson(list[list.length - 1].id);
    }
  };

  const handleNextLesson = () => {
    const list = filteredLessons.length > 0 ? filteredLessons : khmerLessonPlansList;
    const idx = list.findIndex((l) => l.id === currentLesson.id);
    if (idx !== -1 && idx < list.length - 1) {
      handleSelectLesson(list[idx + 1].id);
    } else if (idx === list.length - 1) {
      handleSelectLesson(list[0].id);
    } else if (list.length > 0) {
      handleSelectLesson(list[0].id);
    }
  };

  // Extract distinct Lesson Numbers in the current subject for fast numeric jumping
  const availableLessonNumbers = useMemo(() => {
    const subjectLessons = selectedSubject === 'ទាំងអស់'
      ? khmerLessonPlansList
      : khmerLessonPlansList.filter((l) => l.subject === selectedSubject);

    const map = new Map<string, string>(); // lessonNo -> first lesson id
    subjectLessons.forEach((l) => {
      if (!map.has(l.lessonNo)) {
        map.set(l.lessonNo, l.id);
      }
    });
    return Array.from(map.entries()).map(([lessonNo, id]) => ({ lessonNo, id }));
  }, [selectedSubject]);

  // Helper to update fields of the current lesson in state
  const handleUpdateCurrentLesson = (field: keyof LessonPlanDetail, value: any) => {
    setCustomLessons((prev) => ({
      ...prev,
      [baseLesson.id]: {
        ...currentLesson,
        [field]: value,
      },
    }));
  };

  const handleUpdateNestedField = (
    parentField: 'objectives' | 'materials',
    subField: string,
    value: string
  ) => {
    setCustomLessons((prev) => ({
      ...prev,
      [baseLesson.id]: {
        ...currentLesson,
        [parentField]: {
          ...(currentLesson[parentField] as any),
          [subField]: value,
        },
      },
    }));
  };

  const handleUpdateStepField = (stepIdx: number, stepField: string, value: string) => {
    const updatedSteps = [...currentLesson.steps];
    updatedSteps[stepIdx] = {
      ...updatedSteps[stepIdx],
      [stepField]: value,
    };
    handleUpdateCurrentLesson('steps', updatedSteps);
  };

  const handleResetCurrentLesson = () => {
    setCustomLessons((prev) => {
      const copy = { ...prev };
      delete copy[baseLesson.id];
      return copy;
    });
    if (onShowToast) {
      onShowToast(`បានកំណត់មេរៀន ${baseLesson.lessonNo} មកទម្រង់ដើមវិញ!`);
    }
  };

  const handlePrint = () => {
    window.print();
    if (onShowToast) {
      onShowToast('កំពុងបញ្ជូនកិច្ចតែងការបង្រៀនទៅកាន់ម៉ាស៊ីនបោះពុម្ព...');
    }
  };

  const handleEditTimetable = () => {
    onClose();
    if (onEditTimetable) {
      onEditTimetable();
    }
    if (onShowToast) {
      onShowToast('កំពុងបើកផ្ទាំងកែសម្រួលកាលវិភាគបង្រៀន...');
    }
  };

  const handleDownloadPDF = () => {
    setIsPdfModalOpen(true);
    if (onShowToast) {
      onShowToast('កំពុងបើកផ្ទាំងកំណត់ទម្រង់ និងទាញយក PDF កិច្ចតែងការបង្រៀន...');
    }
  };

  const handleDownloadWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${currentLesson.lessonNo} ${currentLesson.title}</title>
        <style>
          body { font-family: 'Kantumruy Pro', 'Khmer OS Battambang', 'Segoe UI', sans-serif; padding: 30px; line-height: 1.6; }
          h1, h2, h3 { text-align: center; color: #0f172a; margin: 8px 0; }
          .header-title { font-size: 20px; font-weight: bold; }
          .sub-header { font-size: 14px; text-align: center; color: #475569; margin-bottom: 20px; }
          .box { background: #f8fafc; border: 1.5px solid #cbd5e1; padding: 15px; margin-bottom: 15px; border-radius: 8px; font-size: 14px; }
          .section-title { font-size: 16px; font-weight: bold; color: #312e81; border-bottom: 2px solid #312e81; padding-bottom: 4px; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
          th, td { border: 1px solid #64748b; padding: 10px; text-align: left; vertical-align: top; }
          th { background-color: #312e81; color: white; font-weight: bold; }
          .obj-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px; margin-bottom: 8px; border-radius: 6px; }
        </style>
      </head>
      <body>
        <h2>ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
        <h1 class="header-title">កិច្ចតែងការបង្រៀន (Student-Centered Lesson Plan)</h1>
        <p class="sub-header"><b>${currentLesson.schoolName}</b> &bull; ឆ្នាំសិក្សា ២០២៥-២០២៦</p>
        
        <div class="box">
          <p><b>កម្រិតថ្នាក់៖</b> ${currentLesson.grade} &bull; <b>មុខវិជ្ជា៖</b> ${currentLesson.subject}</p>
          <p><b>មេរៀនទី៖</b> ${currentLesson.lessonNo} - ${currentLesson.title}</p>
          <p><b>រយៈពេល៖</b> ${currentLesson.duration} &bull; <b>គ្រូបង្រៀន៖</b> ${currentLesson.teacherName}</p>
          <p><b>ឯកសារយោង៖</b> ${currentLesson.sourceRef}</p>
          <p><b>វិធីសាស្ត្របង្រៀនសកម្ម៖</b> ${currentLesson.pedagogy}</p>
        </div>

        <div class="section-title">I. វត្ថុបំណងនៃមេរៀន (Learning Objectives)</div>
        <div class="obj-box"><b>១. វិជ្ជាសម្បទា (Knowledge)៖</b> ${currentLesson.objectives.knowledge}</div>
        <div class="obj-box"><b>២. បំណិនសម្បទា (Skills)៖</b> ${currentLesson.objectives.skills}</div>
        <div class="obj-box"><b>៣. ចរិយាសម្បទា (Attitude)៖</b> ${currentLesson.objectives.attitude}</div>

        <div class="section-title">II. សម្ភារឧបទេស (Teaching Materials)</div>
        <p><b>👨‍🏫 សម្រាប់គ្រូបង្រៀន៖</b> ${currentLesson.materials.teacher}</p>
        <p><b>🙋‍♂️ សម្រាប់សិស្ស៖</b> ${currentLesson.materials.students}</p>

        <div class="section-title">III. ដំណើរការបង្រៀន និងរៀន (Teaching Steps)</div>
        <table>
          <thead>
            <tr>
              <th style="width: 25%;">សកម្មភាពគ្រូ</th>
              <th style="width: 50%;">ខ្លឹមសារមេរៀន / ដំណាក់កាលសកម្ម</th>
              <th style="width: 25%;">សកម្មភាពសិស្ស</th>
            </tr>
          </thead>
          <tbody>
            ${currentLesson.steps.map(s => `
              <tr>
                <td><b>${s.stepNo}</b><br/>${s.teacherActivity}</td>
                <td><b>${s.stepTitle}</b><br/><br/>${s.content.replace(/\n/g, '<br/>')}</td>
                <td>${s.studentActivity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">IV. កិច្ចការផ្ទះ (Homework)</div>
        <div class="box"><p>${currentLesson.homework}</p></div>

        <br/><br/>
        <table style="border:none; width:100%;">
          <tr style="border:none;">
            <td style="border:none; text-align:center; width:50%;">
              បានឃើញ និងពិនិត្យ<br/><b>នាយក / នាយិកាសាលា</b><br/><br/><br/><br/>
              <i>ហត្ថលេខា និងត្រា</i>
            </td>
            <td style="border:none; text-align:center; width:50%;">
              ${currentLesson.schoolName}<br/><b>ហត្ថលេខាគ្រូបង្រៀន</b><br/><br/><br/><br/>
              <b>${currentLesson.teacherName}</b>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LessonPlan_${currentLesson.lessonNo.replace(/\s+/g, '_')}_${currentLesson.title.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast('បានទាញយកឯកសារ Word (.doc) រួចរាល់!');
  };

  const handleCopyHomework = () => {
    navigator.clipboard.writeText(`កិច្ចការផ្ទះ៖ ${currentLesson.homework}`);
    setCopiedHomework(true);
    setTimeout(() => setCopiedHomework(false), 2000);
    if (onShowToast) onShowToast('បានចម្លងកិច្ចការផ្ទះរួចរាល់!');
  };

  const handleCopyObjectives = () => {
    const text = `វត្ថុបំណងមេរៀន ${currentLesson.lessonNo}៖\n១. វិជ្ជាសម្បទា៖ ${currentLesson.objectives.knowledge}\n២. បំណិនសម្បទា៖ ${currentLesson.objectives.skills}\n៣. ចរិយាសម្បទា៖ ${currentLesson.objectives.attitude}`;
    navigator.clipboard.writeText(text);
    setCopiedObjectives(true);
    setTimeout(() => setCopiedObjectives(false), 2000);
    if (onShowToast) onShowToast('បានចម្លងវត្ថុបំណងមេរៀនរួចរាល់!');
  };

  // Zoom text styling
  const zoomClass = {
    90: 'text-sm leading-relaxed',
    100: 'text-base leading-loose',
    115: 'text-lg leading-loose',
    130: 'text-xl leading-loose',
  }[zoomLevel] || 'text-base leading-loose';

  const isCurrentStarred = starredLessonIds.includes(currentLesson.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen m-0 p-0 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* 1. TOP CONTROL HEADER BAR */}
      <header className="no-print bg-slate-900/95 border-b border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between shrink-0 shadow-2xl z-30 relative gap-3">
        
        {/* Left: Sidebar Toggle + Royal Emblem & Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-2xl border transition active:scale-95 flex items-center gap-1.5 text-xs font-bold ${
              isSidebarOpen
                ? 'bg-amber-400/10 text-amber-400 border-amber-400/40 shadow-inner'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
            }`}
            title="បិទ/បើកបញ្ជីមេរៀនឆ្វេងដៃ ([ ឬ B)"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            <span className="hidden xl:inline">{isSidebarOpen ? 'បង្រួមបញ្ជី' : 'បញ្ជីមេរៀន'}</span>
          </button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-amber-500/20 border border-amber-200/50 shrink-0">
            🇰🇭
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 tracking-tight">
              <span>កិច្ចតែងការបង្រៀន</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.2 rounded-full border border-amber-400/30">
                ថ្នាក់ទី៦
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              {currentLesson.schoolName}
            </p>
          </div>
        </div>

        {/* Center: Fast Stepper + Quick Selector Dropdown + Star & Catalog Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Previous Lesson Button */}
          <button
            type="button"
            onClick={handlePrevLesson}
            className="p-2 sm:px-3 sm:py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-2xl border border-slate-700 transition flex items-center gap-1 active:scale-95 text-xs font-bold"
            title="មេរៀនមុន (ArrowLeft ⬅️)"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">មុន</span>
          </button>

          {/* Center Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLessonMenuOpen(!isLessonMenuOpen)}
              className="px-3 sm:px-4 py-2 bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 font-black text-xs sm:text-sm rounded-2xl border border-slate-700/80 transition flex items-center gap-2 shadow-inner hover:border-amber-400/50 group"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate max-w-[140px] sm:max-w-[220px] md:max-w-[280px]">
                {currentLesson.lessonNo} : {currentLesson.title}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isLessonMenuOpen ? 'rotate-180 text-amber-300' : ''}`} />
            </button>

            {/* Quick Popover Search Menu */}
            {isLessonMenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-700/80 p-3 z-50 space-y-2 animate-in zoom-in-95 duration-150">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ស្វែងរកមេរៀនភ្លាមៗ..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/90 rounded-xl text-slate-100 placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {filteredLessons.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => handleSelectLesson(l.id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex flex-col gap-1 ${
                        l.id === currentLesson.id
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${l.id === currentLesson.id ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-amber-400'}`}>
                          {l.lessonNo}
                        </span>
                        <span className={`text-[10px] font-medium ${l.id === currentLesson.id ? 'text-slate-950/80' : 'text-slate-400'}`}>
                          {l.subject} &bull; {l.duration}
                        </span>
                      </div>
                      <span className="truncate text-xs leading-snug">{l.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Next Lesson Button */}
          <button
            type="button"
            onClick={handleNextLesson}
            className="p-2 sm:px-3 sm:py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-2xl border border-slate-700 transition flex items-center gap-1 active:scale-95 text-xs font-bold"
            title="មេរៀនបន្ទាប់ (ArrowRight ➡️)"
          >
            <span className="hidden md:inline">បន្ទាប់</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>

          {/* Star Bookmark Toggle Button */}
          <button
            type="button"
            onClick={() => toggleStar(currentLesson.id)}
            className={`p-2 rounded-2xl border transition active:scale-95 ${
              isCurrentStarred
                ? 'bg-amber-400/20 text-amber-400 border-amber-400/50 shadow-md shadow-amber-400/10'
                : 'bg-slate-800/90 text-slate-400 hover:text-amber-400 border-slate-700/80'
            }`}
            title={isCurrentStarred ? 'ដកចេញពីបញ្ជីចំណាំ' : 'ចំណាំមេរៀននេះ (Bookmark)'}
          >
            <Star className={`w-4 h-4 ${isCurrentStarred ? 'fill-amber-400' : ''}`} />
          </button>

          {/* All Lessons Catalog Matrix Button */}
          <button
            type="button"
            onClick={() => setIsCatalogModalOpen(true)}
            className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-purple-600/20 border border-purple-400/30"
            title="បើកមើលកាតាឡុកមេរៀនទាំងអស់ (Matrix / Catalog View) [M]"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">កាតាឡុក</span>
          </button>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Layout Display Style Switcher */}
          <div className="hidden lg:flex bg-slate-800/80 p-0.5 rounded-2xl border border-slate-700/80">
            <button
              onClick={() => setDisplayStyle('cards')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
                displayStyle === 'cards'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="ទម្រង់កាតអានងាយស្រួល"
            >
              កាត
            </button>
            <button
              onClick={() => setDisplayStyle('table')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
                displayStyle === 'table'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="ទម្រង់តារាងផ្លូវការ"
            >
              តារាង
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden xl:flex items-center bg-slate-800/80 px-2 py-1 rounded-2xl border border-slate-700/80 text-xs text-slate-300 gap-1">
            <button
              disabled={zoomLevel <= 90}
              onClick={() => setZoomLevel((z) => Math.max(90, z - 10))}
              className="p-1 hover:text-white disabled:opacity-30 transition"
              title="បង្រួមអក្សរ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] font-bold text-amber-300">{zoomLevel}%</span>
            <button
              disabled={zoomLevel >= 130}
              onClick={() => setZoomLevel((z) => Math.min(130, z + 15))}
              className="p-1 hover:text-white disabled:opacity-30 transition"
              title="ពង្រីកអក្សរ"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Print Quick Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-2xl transition active:scale-95 flex items-center gap-1.5 shadow-lg shadow-amber-400/20 border border-amber-300/60"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">បោះពុម្ព</span>
          </button>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-800/80 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95 border border-slate-700/80"
            title="បិទ (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. SUBJECT & FAST NUMERIC DIAL BAR */}
      <div className="no-print bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 shrink-0 z-20 shadow-md">
        
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
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
                  const found = khmerLessonPlansList.find((l) => subKey === 'ទាំងអស់' || l.subject === subKey);
                  if (found) handleSelectLesson(found.id);
                  if (subKey !== 'ភាសាខ្មែរ') setSelectedKhmerCategory('ទាំងអស់');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md shadow-amber-400/20 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
                }`}
              >
                <span>
                  {subKey === 'ភាសាខ្មែរ' ? '📖' : subKey === 'គណិតវិទ្យា' ? '📐' : subKey === 'វិទ្យាសាស្ត្រ' ? '🔬' : subKey === 'សិក្សាសង្គម' ? '🏛️' : subKey === 'អប់រំសុខភាព' ? '🏥' : subKey === 'ភាសាអង់គ្លេស និងបំណិនជីវិត' ? '🌐' : '✨'}
                </span>
                <span>{subKey}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-900 text-amber-400 font-bold'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action buttons (Slides, Edit, PDF, Word, Timetable) */}
        <div className="flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setIsSlideModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 hover:from-amber-400 hover:to-yellow-200 text-slate-950 rounded-xl font-black text-xs transition active:scale-95 flex items-center gap-1.5 shadow-lg shadow-amber-500/25 border border-amber-300 animate-pulse"
            title="បើកស្លាយបង្រៀនពេញអេក្រង់ PC / Projector សម្រាប់ថ្នាក់រៀន"
          >
            <Presentation className="w-4 h-4 text-slate-950" />
            <span>🖥️ ស្លាយបង្រៀន</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition active:scale-95 flex items-center gap-1.5 shadow-md border ${
              isEditing
                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-400/40 shadow-purple-600/20'
            }`}
            title="កែសម្រួលខ្លឹមសារកិច្ចតែងការបង្រៀន"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'មើលទម្រង់បោះពុម្ព' : 'កែសម្រួល'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl font-extrabold text-xs transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-rose-600/20 border border-rose-400/40"
          >
            <FileDown className="w-3.5 h-3.5 text-rose-200" />
            <span>ទាញយក PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadWord}
            className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white rounded-xl font-extrabold text-xs transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-blue-600/20 border border-blue-400/40"
          >
            <Download className="w-3.5 h-3.5 text-cyan-200" />
            <span>Word (.doc)</span>
          </button>

          <button
            type="button"
            onClick={handleEditTimetable}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1 border border-slate-700"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">កាលវិភាគ</span>
          </button>
        </div>
      </div>

      {/* 3. FAST LESSON NUMBER QUICK-JUMP DIAL & KHMER SUB-CATEGORY BAR */}
      <div className="no-print bg-slate-900/80 border-b border-slate-800 px-3 sm:px-6 py-1.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0 text-xs">
        
        {/* Direct Lesson Number Jump Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-bold text-amber-400 shrink-0 mr-1 flex items-center gap-1">
            <span>រើសលេខមេរៀនរហ័ស៖</span>
          </span>
          {availableLessonNumbers.map(({ lessonNo, id }) => {
            const isMatch = currentLesson.lessonNo === lessonNo;
            const shortNo = lessonNo.replace('មេរៀនទី', 'ម.').replace('មេរៀនទី ', 'ម.');

            return (
              <button
                key={id}
                onClick={() => handleSelectLesson(id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition shrink-0 ${
                  isMatch
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
                title={`លោតទៅ ${lessonNo}`}
              >
                {shortNo}
              </button>
            );
          })}
        </div>

        {/* Sub-category for Khmer */}
        {selectedSubject === 'ភាសាខ្មែរ' && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-bold text-purple-300 shrink-0">ផ្នែករង៖</span>
            {khmerCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedKhmerCategory(cat)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition shrink-0 ${
                  selectedKhmerCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. WORKSPACE: COLLAPSIBLE SIDEBAR + MAIN CANVAS */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* COLLAPSIBLE LESSON NAVIGATION SIDEBAR */}
        <aside
          className={`no-print bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out z-20 ${
            isSidebarOpen ? 'w-80 sm:w-88 md:w-96' : 'w-0 border-r-0 overflow-hidden'
          }`}
        >
          {/* Sidebar Top: Search & Tabs */}
          <div className="p-3 bg-slate-900/95 border-b border-slate-800 space-y-2.5 shrink-0">
            {/* Search input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកមេរៀន... (ចុច /)"
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-800 rounded-xl text-slate-100 placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sidebar Filter Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSidebarTab('all')}
                className={`py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  sidebarTab === 'all'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>ទាំងអស់</span>
              </button>
              <button
                onClick={() => setSidebarTab('starred')}
                className={`py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  sidebarTab === 'starred'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>ចំណាំ ({starredLessonIds.length})</span>
              </button>
              <button
                onClick={() => setSidebarTab('recent')}
                className={`py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  sidebarTab === 'recent'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>ថ្មីៗ</span>
              </button>
            </div>
          </div>

          {/* Sidebar Lesson List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
            {filteredLessons.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs px-4">
                <BookOpen className="w-8 h-8 mx-auto text-slate-600 mb-2 animate-pulse" />
                <p className="font-bold">រកមិនឃើញមេរៀនឡើយ</p>
                <p className="text-slate-500 mt-1">សូមសាកល្បងសម្អាតពាក្យស្វែងរក ឬប្ដូរប្រភេទតម្រង</p>
              </div>
            ) : (
              filteredLessons.map((l, index) => {
                const isSelected = l.id === currentLesson.id;
                const isStarred = starredLessonIds.includes(l.id);

                return (
                  <div
                    key={l.id}
                    onClick={() => handleSelectLesson(l.id)}
                    className={`group p-2.5 rounded-2xl text-xs transition cursor-pointer border flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400/20 to-amber-500/10 border-amber-400 shadow-md shadow-amber-400/10'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-amber-400 border border-slate-700'
                        }`}>
                          {l.lessonNo}
                        </span>
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-900/60">
                          {l.subject}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleStar(l.id, e)}
                        className={`p-1 rounded-lg transition ${
                          isStarred
                            ? 'text-amber-400 hover:bg-amber-400/20'
                            : 'text-slate-600 hover:text-amber-400 hover:bg-slate-700'
                        }`}
                        title={isStarred ? 'ដកចេញពីចំណាំ' : 'ចំណាំ'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    <h4 className={`font-bold leading-snug line-clamp-2 ${
                      isSelected ? 'text-amber-300 font-black' : 'text-slate-200 group-hover:text-white'
                    }`}>
                      {l.title}
                    </h4>

                    {l.subLessonTitle && (
                      <p className="text-[10px] text-purple-300/80 line-clamp-1">
                        {l.subLessonTitle}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 mt-0.5">
                      <span>{l.duration}</span>
                      <span className={`font-semibold ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                        {isSelected ? 'កំពុងមើល' : `#${index + 1}`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
            <span>{filteredLessons.length} មេរៀនក្នុងបញ្ជី</span>
            <span className="text-[10px] text-slate-500">ចុច [ ដើម្បីបង្រួម</span>
          </div>
        </aside>

        {/* MAIN READING & EDITING CANVAS */}
        <main
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-6 lg:p-8 print-area relative"
        >

            {/* Quick Action Top Banner */}
          <div className="no-print max-w-5xl mx-auto mb-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                  <span>{currentLesson.lessonNo} : {currentLesson.title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentLesson.subject} &bull; {currentLesson.duration} &bull; {currentLesson.schoolName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSlideModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 hover:from-amber-400 hover:to-yellow-200 text-slate-950 rounded-2xl font-black text-xs shadow-lg shadow-amber-500/30 transition active:scale-95 flex items-center gap-2 border border-amber-300 animate-bounce"
              >
                <Presentation className="w-4 h-4 text-slate-950" />
                <span>🖥️ បង្ហាញស្លាយបង្រៀន (Slides)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-3.5 py-2 rounded-2xl font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2 border ${
                  isEditing
                    ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-400/40 shadow-purple-600/20'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? '👁️ មើលទម្រង់បោះពុម្ព' : '✏️ កែសម្រួលកិច្ចតែងការ'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-rose-600/20 transition active:scale-95 flex items-center gap-2 border border-rose-400/40"
              >
                <FileDown className="w-4 h-4 text-rose-200" />
                <span>📄 PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadWord}
                className="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-blue-600/20 transition active:scale-95 flex items-center gap-2 border border-blue-400/40"
              >
                <Download className="w-4 h-4 text-cyan-200" />
                <span>📝 Word (.doc)</span>
              </button>
            </div>
          </div>

          {/* CONDITION 1: INLINE EDIT MODE FORM */}
          {isEditing ? (
            <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 text-white shadow-2xl animate-in zoom-in-95 duration-200">
              
              {/* Form Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-amber-400" />
                    <span>កែសម្រួលខ្លឹមសារកិច្ចតែងការបង្រៀន៖ {currentLesson.lessonNo}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    ផ្លាស់ប្តូរអត្ថបទ ឬបន្ថែមព័ត៌មានខាងក្រោម រួចចុច «រក្សាទុក» ឬ «មើលទម្រង់បោះពុម្ព»
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetCurrentLesson}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl font-bold text-xs transition flex items-center gap-1.5 border border-slate-700"
                    title="លុបការកែសម្រួលទាំងអស់ មកទម្រង់ដើម"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>កំណត់ដើម</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      if (onShowToast) onShowToast('បានរក្សាទុកការកែប្រែរួចរាល់!');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>រក្សាទុក & មើល</span>
                  </button>
                </div>
              </div>

              {/* Administrative Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ចំណងជើងមេរៀន</label>
                  <input
                    type="text"
                    value={currentLesson.title}
                    onChange={(e) => handleUpdateCurrentLesson('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">លេខមេរៀន</label>
                  <input
                    type="text"
                    value={currentLesson.lessonNo}
                    onChange={(e) => handleUpdateCurrentLesson('lessonNo', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">រយៈពេលបង្រៀន</label>
                  <input
                    type="text"
                    value={currentLesson.duration}
                    onChange={(e) => handleUpdateCurrentLesson('duration', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ឈ្មោះគ្រូបង្រៀន</label>
                  <input
                    type="text"
                    value={currentLesson.teacherName}
                    onChange={(e) => handleUpdateCurrentLesson('teacherName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ឈ្មោះសាលារៀន</label>
                  <input
                    type="text"
                    value={currentLesson.schoolName}
                    onChange={(e) => handleUpdateCurrentLesson('schoolName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">វិធីសាស្ត្របង្រៀន</label>
                  <input
                    type="text"
                    value={currentLesson.pedagogy}
                    onChange={(e) => handleUpdateCurrentLesson('pedagogy', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
              </div>

              {/* Objectives */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h3 className="text-sm font-black text-amber-400">I. វត្ថុបំណងនៃមេរៀន (Learning Objectives)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-300 mb-1.5">១. វិជ្ជាសម្បទា (Knowledge)</label>
                    <textarea
                      rows={3}
                      value={currentLesson.objectives.knowledge}
                      onChange={(e) => handleUpdateNestedField('objectives', 'knowledge', e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-300 mb-1.5">២. បំណិនសម្បទា (Skills)</label>
                    <textarea
                      rows={3}
                      value={currentLesson.objectives.skills}
                      onChange={(e) => handleUpdateNestedField('objectives', 'skills', e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1.5">៣. ចរិយាសម្បទា (Attitude)</label>
                    <textarea
                      rows={3}
                      value={currentLesson.objectives.attitude}
                      onChange={(e) => handleUpdateNestedField('objectives', 'attitude', e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400/50"
                    />
                  </div>
                </div>
              </div>



              {/* Teaching Steps */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <h3 className="text-sm font-black text-amber-400">III. ដំណើរការបង្រៀន និងរៀន ៥ ជំហាន (Teaching Steps)</h3>
                <div className="space-y-4">
                  {currentLesson.steps.map((step, idx) => (
                    <div key={idx} className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                        <span>{step.stepNo}</span>
                        <input
                          type="text"
                          value={step.stepTitle}
                          onChange={(e) => handleUpdateStepField(idx, 'stepTitle', e.target.value)}
                          placeholder="ចំណងជើងជំហាន..."
                          className="px-3 py-1 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white w-2/3"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">ខ្លឹមសារមេរៀន</label>
                          <textarea
                            rows={3}
                            value={step.content}
                            onChange={(e) => handleUpdateStepField(idx, 'content', e.target.value)}
                            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-blue-300 mb-1">សកម្មភាពគ្រូបង្រៀន</label>
                          <textarea
                            rows={3}
                            value={step.teacherActivity}
                            onChange={(e) => handleUpdateStepField(idx, 'teacherActivity', e.target.value)}
                            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-emerald-300 mb-1">សកម្មភាពសិស្ស</label>
                          <textarea
                            rows={3}
                            value={step.studentActivity}
                            onChange={(e) => handleUpdateStepField(idx, 'studentActivity', e.target.value)}
                            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Homework */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-amber-300 mb-1.5">IV. កិច្ចការផ្ទះ (Homework)</label>
                <textarea
                  rows={2}
                  value={currentLesson.homework}
                  onChange={(e) => handleUpdateCurrentLesson('homework', e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400/50"
                />
              </div>

              {/* Save Bottom */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>រក្សាទុក និងមើលទម្រង់បោះពុម្ព</span>
                </button>
              </div>
            </div>
          ) : (
            /* CONDITION 2: OFFICIAL PRINT & READING DOCUMENT */
            <article className={`max-w-5xl mx-auto bg-white text-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-200 font-khmer space-y-8 ${zoomClass}`}>
              
              {/* NATIONAL MOTTO & DOCUMENT TITLE */}
              <div className="text-center border-b-2 border-slate-900 pb-5 space-y-2">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-950">
                  ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ
                </h2>
                <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
                <h1 className="text-2xl sm:text-3xl font-black text-purple-950 pt-2 tracking-tight">
                  កិច្ចតែងការបង្រៀន (Student-Centered Lesson Plan)
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-bold">
                  {currentLesson.schoolName} &bull; ឆ្នាំសិក្សា ២០២៥ - ២០២៦
                </p>
              </div>

              {/* LESSON ADMINISTRATIVE DATA BOX */}
              <div className="bg-slate-50 border-2 border-slate-300 rounded-3xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm font-medium">
                <div>
                  <span className="text-slate-500 font-bold block">កម្រិតថ្នាក់ & មុខវិជ្ជា៖</span>
                  <span className="text-slate-950 font-black">{currentLesson.grade} &bull; {currentLesson.subject}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">មេរៀនទី & ចំណងជើង៖</span>
                  <span className="text-purple-900 font-black">{currentLesson.lessonNo} : {currentLesson.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">រយៈពេល & គ្រូបង្រៀន៖</span>
                  <span className="text-slate-950 font-black">{currentLesson.duration} &bull; {currentLesson.teacherName}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-bold block">ឯកសារយោង (សៀវភៅពុម្ពក្រសួង)៖</span>
                  <span className="text-slate-900 font-bold">{currentLesson.sourceRef}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">វិធីសាស្ត្របង្រៀនសកម្ម៖</span>
                  <span className="text-purple-950 font-bold">{currentLesson.pedagogy}</span>
                </div>
              </div>

              {/* DIGITAL TOOLS & LEARNING GAMES */}
              {((currentLesson.digitalTools && currentLesson.digitalTools.length > 0) || (currentLesson.learningGames && currentLesson.learningGames.length > 0)) && (
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-5 sm:p-6 space-y-3 shadow-md">
                  <div className="flex items-center gap-2 text-amber-300 font-black text-sm sm:text-base">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>ការបញ្រ្ជាបបច្ចេកវិទ្យាអប់រំ និងល្បែងសិក្សា (21st Century Skills)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    {currentLesson.digitalTools && currentLesson.digitalTools.length > 0 ? (
                      <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
                        <span className="font-extrabold text-amber-300 block mb-1">💻 ឧបករណ៍ឌីជីថលជំនួយ៖</span>
                        <p className="text-purple-100">{currentLesson.digitalTools.join(', ')}</p>
                      </div>
                    ) : null}
                    {currentLesson.learningGames && currentLesson.learningGames.length > 0 ? (
                      <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
                        <span className="font-extrabold text-emerald-300 block mb-1">🎮 ល្បែងសិក្សាពង្រឹងការចងចាំ៖</span>
                        <p className="text-purple-100">{currentLesson.learningGames.join(', ')}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* PEDAGOGICAL TIPS FOR TEACHER */}
              {currentLesson.pedagogicalTips && (
                <div className="bg-fuchsia-50 border-2 border-fuchsia-200 rounded-3xl p-5 sm:p-6 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-fuchsia-950 font-black text-sm sm:text-base">
                    <Lightbulb className="w-5 h-5 text-fuchsia-600" />
                    <span>💡 គន្លឹះគរុកោសល្យ និងវិធីសាស្ត្រអនុវត្តន៍របស់គ្រូ (Pedagogical Strategy)</span>
                  </div>
                  <p className="text-fuchsia-950 leading-relaxed font-medium">
                    {currentLesson.pedagogicalTips}
                  </p>
                </div>
              )}

              {/* SECTION I: OBJECTIVES */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-purple-950 pb-2">
                  <h3 className="text-base sm:text-lg font-black text-purple-950 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-600" />
                    <span>I. វត្ថុបំណងនៃមេរៀន (Learning Objectives)</span>
                  </h3>
                  <button
                    onClick={handleCopyObjectives}
                    className="no-print text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200"
                  >
                    {copiedObjectives ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedObjectives ? 'បានចម្លង' : 'ចម្លងវត្ថុបំណង'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 sm:p-5 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2">
                    <div className="font-black text-blue-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">១</span>
                      <span>វិជ្ជាសម្បទា (Knowledge)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {currentLesson.objectives.knowledge}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="font-black text-emerald-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">២</span>
                      <span>បំណិនសម្បទា (Skills)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {currentLesson.objectives.skills}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
                    <div className="font-black text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">៣</span>
                      <span>ចរិយាសម្បទា (Attitude)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {currentLesson.objectives.attitude}
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION II: TEACHING MATERIALS */}
              <section className="space-y-3">
                <h3 className="text-base sm:text-lg font-black text-purple-950 border-b-2 border-purple-950 pb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span>II. សម្ភារឧបទេស (Teaching Materials)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 text-xs sm:text-sm">
                    <span className="font-black text-slate-900 block mb-1">👨‍🏫 សម្រាប់គ្រូបង្រៀន៖</span>
                    <p className="text-slate-700">{currentLesson.materials.teacher}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 text-xs sm:text-sm">
                    <span className="font-black text-slate-900 block mb-1">🙋‍♂️ សម្រាប់សិស្ស៖</span>
                    <p className="text-slate-700">{currentLesson.materials.students}</p>
                  </div>
                </div>
              </section>



              {/* SECTION III: TEACHING STEPS */}
              <section className="space-y-4">
                <h3 className="text-base sm:text-lg font-black text-purple-950 border-b-2 border-purple-950 pb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  <span>III. ដំណើរការបង្រៀន និងរៀន ៥ ជំហាន (Teaching Steps)</span>
                </h3>

                {/* Style 1: Table Style */}
                {displayStyle === 'table' ? (
                  <div className="overflow-x-auto border-2 border-slate-800 rounded-2xl shadow-sm">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-purple-950 text-white font-black">
                          <th className="p-3.5 border-r border-purple-900 w-1/4">សកម្មភាពគ្រូ</th>
                          <th className="p-3.5 border-r border-purple-900 w-1/2">ខ្លឹមសារមេរៀន / ដំណាក់កាលសកម្ម</th>
                          <th className="p-3.5 w-1/4">សកម្មភាពសិស្ស</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                        {currentLesson.steps.map((s, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-3.5 border-r border-slate-300 align-top">
                              <span className="font-black text-purple-950 block mb-1">{s.stepNo}</span>
                              <p className="text-slate-700 leading-relaxed">{s.teacherActivity}</p>
                            </td>
                            <td className="p-3.5 border-r border-slate-300 align-top space-y-2">
                              <span className="font-black text-slate-950 block text-sm">{s.stepTitle}</span>
                              <div className="text-slate-800 whitespace-pre-line leading-relaxed">{s.content}</div>
                            </td>
                            <td className="p-3.5 align-top">
                              <p className="text-slate-700 leading-relaxed font-medium">{s.studentActivity}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Style 2: Interactive Cards Style */
                  <div className="space-y-4">
                    {currentLesson.steps.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-5 sm:p-6 bg-slate-50 hover:bg-slate-100/80 rounded-3xl border-2 border-slate-200 transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                          <span className="px-3 py-1 bg-purple-950 text-amber-300 font-black text-xs rounded-xl shadow-xs">
                            {s.stepNo}
                          </span>
                          <h4 className="font-black text-sm sm:text-base text-purple-950">
                            {s.stepTitle}
                          </h4>
                        </div>

                        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                          {s.content}
                        </div>



                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                          <div className="p-3.5 bg-blue-50/90 rounded-2xl border border-blue-200">
                            <span className="font-black text-blue-900 block mb-1">👨‍🏫 សកម្មភាពគ្រូ៖</span>
                            <p className="text-slate-700 leading-relaxed">{s.teacherActivity}</p>
                          </div>
                          <div className="p-3.5 bg-emerald-50/90 rounded-2xl border border-emerald-200">
                            <span className="font-black text-emerald-900 block mb-1">🙋‍♂️ សកម្មភាពសិស្ស៖</span>
                            <p className="text-slate-700 leading-relaxed">{s.studentActivity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* DIFFERENTIATION: STRATEGIES FOR SLOW & FAST LEARNERS */}
              {currentLesson.differentiation && (
                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-black text-purple-950 border-b-2 border-purple-950 pb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    <span>ការបង្រៀនឆ្លើយតបតាមកម្រិតសមត្ថភាពសិស្ស (Differentiated Instruction)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-rose-50/90 rounded-3xl border-2 border-rose-200 space-y-2">
                      <div className="flex items-center gap-2 text-rose-950 font-black text-xs sm:text-sm">
                        <span className="text-base">🐢</span>
                        <span>សម្រាប់សិស្សរៀនយឺត (Slow Learners / Remedial)</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {currentLesson.differentiation.slowLearners}
                      </p>
                    </div>

                    <div className="p-5 bg-emerald-50/90 rounded-3xl border-2 border-emerald-200 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-950 font-black text-xs sm:text-sm">
                        <span className="text-base">🚀</span>
                        <span>សម្រាប់សិស្សរៀនពូកែ (Fast Learners / Extension)</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {currentLesson.differentiation.fastLearners}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* CHARACTER EDUCATION & MORAL VALUES */}
              {currentLesson.characterValues && (
                <section className="space-y-3">
                  <div className="p-5 bg-orange-50/90 rounded-3xl border-2 border-orange-200 space-y-2">
                    <div className="flex items-center gap-2 text-orange-950 font-black text-xs sm:text-sm">
                      <Heart className="w-5 h-5 text-orange-600" />
                      <span>🌟 ការបណ្តុះស្មារតីគុណធម៌ សីលធម៌ និងការដឹងគុណ (Character & Moral Values)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {currentLesson.characterValues}
                    </p>
                  </div>
                </section>
              )}

              {/* RUBRIC ASSESSMENT MATRIX */}
              {currentLesson.rubric && currentLesson.rubric.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-black text-purple-950 border-b-2 border-purple-950 pb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span>បន្ទាត់កម្រិតវាស់វែងការវាយតម្លៃសមត្ថភាព (Assessment Rubric Matrix)</span>
                  </h3>
                  <div className="overflow-x-auto border-2 border-slate-300 rounded-3xl shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-indigo-950 text-white font-black text-[11px] sm:text-xs">
                          <th className="p-3 border-r border-indigo-900 w-1/4">លក្ខណៈវិនិច្ឆ័យ</th>
                          <th className="p-3 border-r border-indigo-900 text-emerald-300 w-[18.75%]">កម្រិត ៤ (ល្អប្រសើរ)</th>
                          <th className="p-3 border-r border-indigo-900 text-blue-300 w-[18.75%]">កម្រិត ៣ (ល្អ)</th>
                          <th className="p-3 border-r border-indigo-900 text-amber-300 w-[18.75%]">កម្រិត ២ (មធ្យម)</th>
                          <th className="p-3 text-rose-300 w-[18.75%]">កម្រិត ១ (ត្រូវកែលម្អ)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {currentLesson.rubric.map((item, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                            <td className="p-3 border-r border-slate-200 font-bold text-slate-900 align-top">
                              {item.criteria}
                            </td>
                            <td className="p-3 border-r border-slate-200 text-emerald-900 bg-emerald-50/40 align-top">
                              {item.level4}
                            </td>
                            <td className="p-3 border-r border-slate-200 text-blue-900 bg-blue-50/40 align-top">
                              {item.level3}
                            </td>
                            <td className="p-3 border-r border-slate-200 text-amber-900 bg-amber-50/40 align-top">
                              {item.level2}
                            </td>
                            <td className="p-3 text-rose-900 bg-rose-50/40 align-top">
                              {item.level1}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* SECTION IV: HOMEWORK */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-purple-950 pb-2">
                  <h3 className="text-base sm:text-lg font-black text-purple-950 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span>IV. កិច្ចការផ្ទះ និងការពង្រឹងបន្ថែម (Homework)</span>
                  </h3>
                  <button
                    onClick={handleCopyHomework}
                    className="no-print text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200"
                  >
                    {copiedHomework ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHomework ? 'បានចម្លង' : 'ចម្លងកិច្ចការ'}</span>
                  </button>
                </div>

                <div className="p-6 bg-amber-50/90 rounded-3xl border-2 border-amber-200 text-slate-950 font-bold text-sm sm:text-base leading-relaxed shadow-sm">
                  <p>{currentLesson.homework}</p>
                </div>
              </section>

              {/* OFFICIAL SIGNATURE FOOTER */}
              <footer className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs sm:text-sm font-bold">
                <div className="space-y-12">
                  <div>
                    <p>បានឃើញ និងពិនិត្យត្រឹមត្រូវ</p>
                    <p className="font-extrabold text-base text-slate-950 mt-1">នាយក / នាយិកាសាលា</p>
                  </div>
                  <p className="text-slate-400 italic">(ហត្ថលេខា និងត្រា)</p>
                </div>
                <div className="space-y-12">
                  <div>
                    <p>{currentLesson.schoolName}</p>
                    <p className="font-extrabold text-base text-slate-950 mt-1">ហត្ថលេខាគ្រូបង្រៀន</p>
                  </div>
                  <p className="font-black text-purple-950 text-base sm:text-lg">{currentLesson.teacherName}</p>
                </div>
              </footer>

            </article>
          )}

          {/* 5. FLOATING QUICK-NAVIGATOR DOCK */}
          <div className="no-print fixed bottom-6 right-6 sm:right-10 z-40 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-full shadow-2xl p-1.5 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <button
              onClick={handlePrevLesson}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition active:scale-95 flex items-center gap-1 text-xs font-bold"
              title="មេរៀនមុន (⬅️)"
            >
              <ChevronLeft className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline pr-1">មុន</span>
            </button>

            <button
              onClick={() => setIsCatalogModalOpen(true)}
              className="px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center gap-1.5"
              title="កាតាឡុកមេរៀនទាំងអស់ (M)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>កាតាឡុក</span>
            </button>

            <button
              onClick={() => toggleStar(currentLesson.id)}
              className={`p-2 rounded-full transition active:scale-95 ${
                isCurrentStarred ? 'text-amber-400 bg-amber-400/20' : 'text-slate-400 hover:text-amber-400 bg-slate-800'
              }`}
              title="ចំណាំមេរៀននេះ"
            >
              <Star className={`w-4 h-4 ${isCurrentStarred ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleNextLesson}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition active:scale-95 flex items-center gap-1 text-xs font-bold"
              title="មេរៀនបន្ទាប់ (➡️)"
            >
              <span className="hidden sm:inline pl-1">បន្ទាប់</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => {
                if (mainScrollRef.current) {
                  mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95"
              title="ឡើងលើបង្អស់"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </main>

      </div>

      {/* ALL LESSONS CATALOG MATRIX MODAL */}
      <LessonCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        currentLessonId={currentLesson.id}
        onSelectLesson={handleSelectLesson}
        starredLessonIds={starredLessonIds}
        onToggleStar={toggleStar}
      />

      {/* PDF Customizer Modal (Targeted explicitly for LESSON PLAN) */}
      <PdfCustomizerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        documentType="general"
        title={`កំណត់ទម្រង់ & ទាញយក PDF កិច្ចតែងការ - ${currentLesson.lessonNo}`}
        initialHeader={{
          docTitle: `កិច្ចតែងការបង្រៀន - ${currentLesson.lessonNo} ${currentLesson.title}`,
          docSubtitle: '',
          schoolName: currentLesson.schoolName,
          officeInfo: 'ការិយាល័យអប់រំ យុវជន និងកីឡា',
          academicYear: '២០២៥ - ២០២៦',
          teacherName: currentLesson.teacherName,
          gradeLevel: currentLesson.grade,
          leftSignatureTitle: 'បានឃើញ និងពិនិត្យត្រឹមត្រូវ\nនាយក / នាយិកាសាលា',
          rightSignatureTitle: 'គ្រូបន្ទុកថ្នាក់',
          rightSignatureName: currentLesson.teacherName,
        }}
        customTableHtml={generateLessonPlanHtml(currentLesson)}
        onShowToast={onShowToast}
      />

      {/* INTERACTIVE FULL-SCREEN TEACHING SLIDES MODAL */}
      <KhmerLessonSlideModal
        isOpen={isSlideModalOpen}
        onClose={() => setIsSlideModalOpen(false)}
        lesson={currentLesson}
        onShowToast={onShowToast}
      />



    </div>
  );
};
