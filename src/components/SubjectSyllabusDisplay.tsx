import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Printer,
  Download,
  Clock,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  Layers,
  GraduationCap,
  Lightbulb,
  Target,
  FileCheck2,
  Filter,
  PlusCircle,
  X,
  Building2,
  UserCheck,
  Plus,
  BookMarked,
  FileText,
  Edit3,
  Trash2
} from 'lucide-react';
import { moeysSubjectSyllabusList, SubjectSyllabus } from '../data/syllabusData';
import { PdfCustomizerModal } from './PdfCustomizerModal';
import { KhmerLessonPlanModal } from './KhmerLessonPlanModal';

const SYLLABUS_STORAGE_KEY = 'primary_teacher_custom_syllabuses_v4';

interface SubjectSyllabusDisplayProps {
  onShowToast?: (msg: string) => void;
  defaultSubjectId?: string;
}

export const SubjectSyllabusDisplay: React.FC<SubjectSyllabusDisplayProps> = ({
  onShowToast,
  defaultSubjectId = 'all',
}) => {
  const [syllabusList, setSyllabusList] = useState<SubjectSyllabus[]>(() => {
    const saved = localStorage.getItem(SYLLABUS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse saved syllabuses:', err);
      }
    }
    return moeysSubjectSyllabusList;
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(defaultSubjectId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [pdfSelectedSubject, setPdfSelectedSubject] = useState<SubjectSyllabus | null>(null);
  const [isKhmerModalOpen, setIsKhmerModalOpen] = useState<boolean>(false);

  // Form state for adding new lesson to syllabus
  const [targetSubjectId, setTargetSubjectId] = useState<string>('khmer');
  const [targetTrimesterIndex, setTargetTrimesterIndex] = useState<number>(0);
  const [newChapterNo, setNewChapterNo] = useState<string>('មេរៀនទី ១');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newHours, setNewHours] = useState<string>('១០ ម៉ោង');
  const [newMonth, setNewMonth] = useState<string>('វិច្ឆិកា');
  const [newWeekNo, setNewWeekNo] = useState<string>('សប្តាហ៍ទី ១');
  const [newObjective, setNewObjective] = useState<string>('');
  const [newTopicsStr, setNewTopicsStr] = useState<string>('');
  const [newStudentBookPages, setNewStudentBookPages] = useState<string>('');
  const [newTeacherBookPages, setNewTeacherBookPages] = useState<string>('');

  // Editing existing lesson state
  const [editingLesson, setEditingLesson] = useState<{
    subjectId: string;
    trimesterIndex: number;
    chapterIndex: number;
    chapterNo: string;
    title: string;
    hours: string;
    month: string;
    weekNo: string;
    objective: string;
    topicsStr: string;
    studentBookPages: string;
    teacherBookPages: string;
  } | null>(null);

  // Insert row above/below state
  const [insertModalState, setInsertModalState] = useState<{
    subjectId: string;
    trimesterIndex: number;
    insertIndex: number;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(syllabusList));
  }, [syllabusList]);

  const filteredSubjects = syllabusList.filter((sub) => {
    const matchesId = selectedSubjectId === 'all' || sub.id === selectedSubjectId;
    if (!matchesId) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = sub.name.toLowerCase().includes(q) || sub.englishName.toLowerCase().includes(q);
    const matchTopic = sub.trimesters.some((t) =>
      t.chapters.some(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.objective.toLowerCase().includes(q) ||
          c.topics.some((top) => top.toLowerCase().includes(q)) ||
          (c.month && c.month.toLowerCase().includes(q))
      )
    );
    return matchName || matchTopic;
  });

  const handleResetToDefault = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់កម្មវិធីសិក្សាទាំងអស់ឡើងវិញតាមស្តង់ដារក្រសួងដើមមែនទេ?')) {
      setSyllabusList(moeysSubjectSyllabusList);
      localStorage.removeItem(SYLLABUS_STORAGE_KEY);
      if (onShowToast) {
        onShowToast('បានកំណត់កម្មវិធីសិក្សាទាំងអស់ឡើងវិញតាមស្តង់ដារដើម!');
      }
    }
  };

  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('សូមបញ្ចូលចំណងជើងមេរៀន ឬជំពូក!');
      return;
    }

    const topicsArray = newTopicsStr
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedList = syllabusList.map((sub) => {
      if (sub.id !== targetSubjectId) return sub;

      const updatedTrimesters = sub.trimesters.map((tri, index) => {
        if (index !== targetTrimesterIndex) return tri;

        const newChapter = {
          chapterNo: newChapterNo || `មេរៀនទី ${tri.chapters.length + 1}`,
          title: newTitle,
          hours: newHours || '១ ម៉ោង',
          month: newMonth || '',
          weekNo: newWeekNo || '',
          objective: newObjective || 'យល់ដឹងពីខ្លឹមសារមេរៀន និងអនុវត្តតាមការណែនាំ',
          topics: topicsArray.length > 0 ? topicsArray : [newTitle],
          studentBookPages: newStudentBookPages || '-',
          teacherBookPages: newTeacherBookPages || '-',
        };

        return {
          ...tri,
          chapters: [...tri.chapters, newChapter],
        };
      });

      return {
        ...sub,
        trimesters: updatedTrimesters,
      };
    });

    setSyllabusList(updatedList);
    setIsAddModalOpen(false);

    // Reset fields
    setNewTitle('');
    setNewObjective('');
    setNewTopicsStr('');
    setNewStudentBookPages('');
    setNewTeacherBookPages('');

    if (onShowToast) {
      onShowToast('បានបញ្ចូលមេរៀនថ្មីទៅក្នុងកម្មវិធីសិក្សាដោយជោគជ័យ!');
    }
  };

  const handleEditLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    const topicsArray = editingLesson.topicsStr
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedList = syllabusList.map((sub) => {
      if (sub.id !== editingLesson.subjectId) return sub;

      const updatedTrimesters = sub.trimesters.map((tri, index) => {
        if (index !== editingLesson.trimesterIndex) return tri;

        const updatedChapters = tri.chapters.map((ch, cIndex) => {
          if (cIndex !== editingLesson.chapterIndex) return ch;
          return {
            ...ch,
            chapterNo: editingLesson.chapterNo,
            title: editingLesson.title,
            hours: editingLesson.hours,
            month: editingLesson.month,
            weekNo: editingLesson.weekNo,
            objective: editingLesson.objective,
            topics: topicsArray.length > 0 ? topicsArray : [editingLesson.title],
            studentBookPages: editingLesson.studentBookPages,
            teacherBookPages: editingLesson.teacherBookPages,
          };
        });

        return { ...tri, chapters: updatedChapters };
      });

      return { ...sub, trimesters: updatedTrimesters };
    });

    setSyllabusList(updatedList);
    setEditingLesson(null);
    if (onShowToast) {
      onShowToast('បានធ្វើបច្ចុប្បន្នភាពមេរៀនដោយជោគជ័យ!');
    }
  };

  const handleDeleteLesson = (subjectId: string, trimesterIndex: number, chapterIndex: number) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបមេរៀននេះចេញពីកម្មវិធីសិក្សាមែនទេ?')) return;

    const updatedList = syllabusList.map((sub) => {
      if (sub.id !== subjectId) return sub;
      const updatedTrimesters = sub.trimesters.map((tri, index) => {
        if (index !== trimesterIndex) return tri;
        return {
          ...tri,
          chapters: tri.chapters.filter((_, cIndex) => cIndex !== chapterIndex),
        };
      });
      return { ...sub, trimesters: updatedTrimesters };
    });

    setSyllabusList(updatedList);
    if (onShowToast) {
      onShowToast('បានលុបមេរៀនចេញពីកម្មវិធីសិក្សា!');
    }
  };

  const handleInsertLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insertModalState) return;
    if (!newTitle.trim()) {
      alert('សូមបញ្ចូលចំណងជើងមេរៀន ឬជំពូក!');
      return;
    }

    const topicsArray = newTopicsStr
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedList = syllabusList.map((sub) => {
      if (sub.id !== insertModalState.subjectId) return sub;

      const updatedTrimesters = sub.trimesters.map((tri, index) => {
        if (index !== insertModalState.trimesterIndex) return tri;

        const newChapter = {
          chapterNo: newChapterNo || `មេរៀនទី ${tri.chapters.length + 1}`,
          title: newTitle,
          hours: newHours || '១ ម៉ោង',
          month: newMonth || '',
          weekNo: newWeekNo || '',
          objective: newObjective || 'យល់ដឹងពីខ្លឹមសារមេរៀន និងអនុវត្តតាមការណែនាំ',
          topics: topicsArray.length > 0 ? topicsArray : [newTitle],
          studentBookPages: newStudentBookPages || '-',
          teacherBookPages: newTeacherBookPages || '-',
        };

        const newChapters = [...tri.chapters];
        const at = insertModalState.insertIndex;
        if (at >= 0 && at <= newChapters.length) {
          newChapters.splice(at, 0, newChapter);
        } else {
          newChapters.push(newChapter);
        }

        return { ...tri, chapters: newChapters };
      });

      return { ...sub, trimesters: updatedTrimesters };
    });

    setSyllabusList(updatedList);
    setInsertModalState(null);

    // Reset fields
    setNewTitle('');
    setNewObjective('');
    setNewTopicsStr('');
    setNewStudentBookPages('');
    setNewTeacherBookPages('');

    if (onShowToast) {
      onShowToast('បានបញ្ចូលជួរមេរៀនថ្មីទៅក្នុងត្រីមាសដោយជោគជ័យ!');
    }
  };

  const handlePrintSyllabus = () => {
    window.print();
    if (onShowToast) {
      onShowToast('បានបើកផ្ទាំងបោះពុម្ពកម្មវិធីសិក្សាតាមមុខវិជ្ជា...');
    }
  };

  const handleExportSyllabusWord = (sub?: SubjectSyllabus) => {
    const subjectToExport =
      sub || (selectedSubjectId !== 'all' ? syllabusList.find((s) => s.id === selectedSubjectId) : null);

    let htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>កម្មវិធីសិក្សាតាមមុខវិជ្ជា - ក្រសួងអប់រំ យុវជន និងកីឡា</title>
<style>
  @page {
    size: A4 portrait;
    margin: 12mm 12mm 12mm 12mm;
  }
  body {
    font-family: 'Khmer OS Siemreap', 'Kantumruy Pro', 'Battambang', Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.4;
    color: #000;
  }
  .moul {
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
  }
  .header-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
  }
  .header-table td {
    vertical-align: top;
  }
  table.content-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6px;
    margin-bottom: 12px;
  }
  table.content-table th, table.content-table td {
    border: 1px solid #000;
    padding: 5px 6px;
    font-size: 9.5pt;
    vertical-align: top;
  }
  table.content-table th {
    background-color: #f2f2f2;
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    text-align: center;
  }
</style>
</head>
<body>
  <table class="header-table" style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
    <tr>
      <td style="width: 55%; text-align: left; vertical-align: top; padding-top: 10px;">
        <div style="font-weight: bold; color: #0f172a;">${subjectToExport?.officeInfo || 'ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុកសៀមបូក'}</div>
        <div class="moul" style="margin-top:2px; font-size: 9.5pt; color: #1e1b4b;">${subjectToExport?.departmentInfo || 'សាលាបឋមសិក្សាគំរូ'}</div>
        <div style="font-size: 9pt; color: #444; margin-top:2px;">${subjectToExport?.authorInfo || 'រៀបចំតាមស្តង់ដារកម្មវិធីសិក្សាផ្លូវការ'}</div>
      </td>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <div class="moul" style="font-size: 11.5pt; color: #1e1b4b;">ព្រះរាជាណាចក្រកម្ពុជា</div>
        <div class="moul" style="font-size: 10pt; color: #1e1b4b; margin-top: 2px;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
        <div style="font-size: 8.5pt; letter-spacing: 2px; margin-top: 2px; font-weight: bold; color: #334155;">— ༺ ៚ ༻ —</div>
      </td>
    </tr>
  </table>

  <div style="text-align: center; margin: 12px 0;">
    <div class="moul" style="font-size: 13pt; color: #1e3a8a;">
      ${subjectToExport ? `បំណែងចែកកម្មវិធីសិក្សា មុខវិជ្ជា ${subjectToExport.name}` : 'កម្មវិធីសិក្សាលម្អិតតាមមុខវិជ្ជា (បឋមសិក្សា)'}
    </div>
    <div style="font-size: 10.5pt; font-weight: bold; margin-top:3px;">
      អនុវត្តតាមស្តង់ដារកម្មវិធីសិក្សាក្រសួងអប់រំ យុវជន និងកីឡា
    </div>
  </div>
    `;

    const listToProcess = subjectToExport ? [subjectToExport] : syllabusList;

    listToProcess.forEach((s) => {
      htmlContent += `
        <div style="margin-top: 10px; border-top: 2px solid #000; padding-top: 8px; page-break-inside: avoid;">
          <h2 class="moul" style="font-size: 11pt; color: #1e3a8a; margin: 0 0 4px 0;">
            ${s.icon} មុខវិជ្ជា៖ ${s.name} (${s.englishName})
          </h2>
          <div style="font-size: 9.5pt; margin-bottom: 6px;">
            <strong>ម៉ោងសិក្សា៖</strong> ${s.weeklyHours} | ${s.yearlyHours} | <strong>កម្រិត៖</strong> ${s.gradeLevel}
          </div>
          <p style="font-size: 10pt; margin: 4px 0;"><strong>ពិពណ៌នាមុខវិជ្ជា៖</strong> ${s.description}</p>
          
          <div style="margin-top: 6px; font-size: 9.5pt;">
            <strong style="text-decoration: underline;">សមត្ថភាពគន្លឹះដែលសិស្សត្រូវសម្រេច៖</strong>
            <ul style="margin: 3px 0 8px 18px; padding: 0;">
              ${s.coreCompetencies.map((c) => `<li>${c}</li>`).join('')}
            </ul>
          </div>

          <h3 class="moul" style="font-size: 10pt; margin-top: 8px;">ផែនការបែងចែកមាតិកាមេរៀនតាមត្រីមាស៖</h3>
          ${s.trimesters
            .map(
              (t) => `
            <div style="font-weight: bold; font-size: 10pt; margin-top: 8px; color: #800;">
              📌 ${t.title} (${t.period})
            </div>
            <table class="content-table">
              <thead>
                <tr>
                  <th style="width: 10%;">ខែ</th>
                  <th style="width: 12%;">សប្តាហ៍ទី</th>
                  <th style="width: 28%;">ខ្លឹមសារមេរៀន (សៀវភៅសិក្សាគោល)</th>
                  <th style="width: 8%;">ម៉ោង</th>
                  <th style="width: 30%;">លទ្ធផលសិក្សា (កម្មវិធីសិក្សាមេតូឌិក)</th>
                  <th style="width: 12%;">ទំព័រ</th>
                </tr>
              </thead>
              <tbody>
                ${t.chapters
                  .map(
                    (c) => `
                  <tr>
                    <td style="font-weight:bold; color:#005577;">
                      ${c.month || '-'}
                      <div style="font-size:8pt; font-weight:normal; color:#666;">${c.chapterNo}</div>
                    </td>
                    <td style="font-weight:bold; color:#880055;">
                      ${c.weekNo || '-'}
                    </td>
                    <td>
                      <strong>${c.title}</strong>
                      ${
                        c.topics && c.topics.length > 0
                          ? `<ul style="margin:3px 0 0 12px; padding:0; font-size:8.5pt;">
                              ${c.topics.map((top) => `<li>${top}</li>`).join('')}
                            </ul>`
                          : ''
                      }
                    </td>
                    <td style="text-align: center; font-weight:bold;">${c.hours}</td>
                    <td>${c.objective}</td>
                    <td style="text-align: center; font-size: 8.5pt;">
                      ${c.studentBookPages ? `ស.ស: ${c.studentBookPages}<br/>` : ''}
                      ${c.teacherBookPages ? `ស.គ: ${c.teacherBookPages}` : ''}
                      ${!c.studentBookPages && !c.teacherBookPages ? '-' : ''}
                    </td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          `
            )
            .join('')}
        </div>
      `;
    });

    htmlContent += `</body></html>`;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = subjectToExport
      ? `កម្មវិធីសិក្សា_មុខវិជ្ជា_${subjectToExport.name}.doc`
      : `កម្មវិធីសិក្សាសរុប_គ្រប់មុខវិជ្ជា.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast('បានទាញយកកម្មវិធីសិក្សាជា Word (.doc) រួចរាល់!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Global Actions */}
      <div className="no-print bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-purple-900/20 shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                  កម្មវិធីសិក្សាបែងចែកតាមមុខវិជ្ជា MoEYS
                </h3>
                <span className="bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 font-extrabold text-xs px-2.5 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800">
                  ស្តង់ដារ ៦ មុខវិជ្ជាស្នូល
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ផែនការមាតិកាមេរៀន ម៉ោងសិក្សា គោលបំណង ទំព័រសៀវភៅសិស្ស/គ្រូ និងសមត្ថភាពគន្លឹះតាមត្រីមាស
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setIsKhmerModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 active:scale-95 border border-blue-400/30"
              title="បង្ហាញកិច្ចតែងការបង្រៀនភាសាខ្មែរ ថ្នាក់ទី៦ ពេញលេញតាមមេរៀន"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>កិច្ចតែងការបង្រៀនភាសាខ្មែរ</span>
            </button>
            <button
              onClick={() => {
                setPdfSelectedSubject(null);
                setIsPdfModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
              title="កំណត់ និងកែសម្រួលទម្រង់ឯកសារមុនទាញយកជា PDF"
            >
              <FileText className="w-4 h-4 text-red-200" />
              <span>ទាញយក / កែសម្រួល PDF</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>បញ្ចូល/បន្ថែមមេរៀន</span>
            </button>
            <button
              onClick={() => handleExportSyllabusWord()}
              className="px-3.5 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-4 h-4 text-blue-200" />
              <span>ទាញយក Word</span>
            </button>
            <button
              onClick={handlePrintSyllabus}
              className="px-3.5 py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>បោះពុម្ព</span>
            </button>
          </div>
        </div>

        {/* Search and Subject Tabs Selector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកចំណងជើងមេរៀន ជំពូក ខែ ឬប្រធានបទ..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="md:col-span-7 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setSelectedSubjectId('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedSubjectId === 'all'
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              គ្រប់មុខវិជ្ជា ({syllabusList.length})
            </button>
            {syllabusList.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                  selectedSubjectId === sub.id
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{sub.icon}</span>
                <span>{sub.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards Overview for Subjects */}
      {selectedSubjectId === 'all' && !searchQuery && (
        <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {syllabusList.map((sub) => (
            <div
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`p-5 rounded-3xl border ${sub.colorTheme.border} ${sub.colorTheme.bg} cursor-pointer hover:shadow-md transition space-y-3 group`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-slate-900 shadow-xs">
                    {sub.icon}
                  </span>
                  <div>
                    <h4 className={`font-extrabold text-base ${sub.colorTheme.text}`}>
                      {sub.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {sub.englishName}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                {sub.description}
              </p>

              {sub.officeInfo && (
                <div className="text-[10px] text-teal-800 dark:text-teal-300 font-medium bg-teal-100/60 dark:bg-teal-900/40 px-2.5 py-1 rounded-lg">
                  🏛️ {sub.officeInfo}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>{sub.weeklyHours}</span>
                </span>
                <span className="text-purple-900 dark:text-purple-300 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-lg">
                  {sub.yearlyHours}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Subjects Content Listing */}
      <div className="space-y-8">
        {filteredSubjects.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Search className="w-10 h-10 text-slate-400 mx-auto stroke-1" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              មិនរកឃើញលទ្ធផលស្វែងរក «{searchQuery}»
            </h4>
            <p className="text-xs text-slate-500">សូមសាកល្បងវាយពាក្យគន្លឹះផ្សេងទៀត</p>
          </div>
        ) : (
          filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 printable-syllabus-item"
            >
              {/* Official Ministry Header Box */}
              {sub.officeInfo && (
                <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900 text-xs text-teal-950 dark:text-teal-200 space-y-1.5">
                  <div className="flex items-center justify-between font-bold flex-wrap gap-2">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-teal-700" />
                      <span>{sub.officeInfo}</span>
                    </span>
                    {sub.authorInfo && (
                      <span className="text-[11px] text-teal-800 dark:text-teal-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl shadow-2xs">
                        ✍️ {sub.authorInfo}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Subject Title Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sub.colorTheme.gradient} text-white flex items-center justify-center font-black text-3xl shadow-md shrink-0`}>
                    {sub.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-moul text-base sm:text-lg text-slate-900 dark:text-slate-100">
                        មុខវិជ្ជា៖ {sub.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-bold">
                        ({sub.englishName})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {sub.gradeLevel} • {sub.weeklyHours} ({sub.yearlyHours})
                    </p>
                  </div>
                </div>

                <div className="no-print flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPdfSelectedSubject(sub);
                      setIsPdfModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-100 text-xs font-bold transition flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                    <span>កែសម្រួល & PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      setTargetSubjectId(sub.id);
                      setIsAddModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>បន្ថែមមេរៀន</span>
                  </button>
                  <button
                    onClick={() => handleExportSyllabusWord(sub)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Word (.doc)</span>
                  </button>
                </div>
              </div>

              {/* Description & Core Competencies */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="md:col-span-5 space-y-2">
                  <h5 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span>ពិពណ៌នាមុខវិជ្ជា</span>
                  </h5>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {sub.description}
                  </p>
                </div>

                <div className="md:col-span-7 space-y-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-slate-200 dark:border-slate-700">
                  <h5 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>សមត្ថភាពគន្លឹះដែលសិស្សត្រូវសម្រេច (Core Competencies)</span>
                  </h5>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    {sub.coreCompetencies.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Trimester Content Tables */}
              <div className="space-y-6">
                <h4 className="font-moul text-sm text-purple-950 dark:text-purple-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-700" />
                  <span>ផែនការបែងចែកមាតិកាមេរៀនតាមត្រីមាស៖</span>
                </h4>

                <div className="space-y-6">
                  {sub.trimesters.map((tri, tIdx) => (
                    <div key={tIdx} className="space-y-3">
                      <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-950/60 p-3 px-4 rounded-xl border border-purple-200 dark:border-purple-900 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-moul text-xs text-purple-950 dark:text-purple-200">
                            📌 {tri.title}
                          </span>
                          <span className="text-xs text-purple-800 dark:text-purple-300 font-bold">
                            ({tri.period})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-500 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-md">
                            {tri.chapters.length} មេរៀន/ជំពូក
                          </span>
                          <button
                            onClick={() => setInsertModalState({ subjectId: sub.id, trimesterIndex: tIdx, insertIndex: 0 })}
                            className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-[11px] font-bold hover:bg-emerald-200 transition flex items-center gap-1"
                            title="បន្ថែមជួរខាងលើสุด (Add row at top)"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ លើ</span>
                          </button>
                          <button
                            onClick={() => setInsertModalState({ subjectId: sub.id, trimesterIndex: tIdx, insertIndex: tri.chapters.length })}
                            className="px-2.5 py-1 rounded-lg bg-purple-900 text-white text-[11px] font-bold hover:bg-purple-950 transition flex items-center gap-1"
                            title="បន្ថែមជួរខាងក្រោម (Add row at bottom)"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ ក្រោម</span>
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                              <th className="p-3 w-[9%]">ខែ</th>
                              <th className="p-3 w-[10%]">សប្តាហ៍ទី</th>
                              <th className="p-3 w-[25%]">ខ្លឹមសារមេរៀន (សៀវភៅសិក្សាគោល)</th>
                              <th className="p-3 w-[8%] text-center">រយៈពេល</th>
                              <th className="p-3 w-[25%]">លទ្ធផលសិក្សា (កម្មវិធីសិក្សាមេតូឌិក)</th>
                              <th className="p-3 w-[9%] text-center">ទំព័រ</th>
                              <th className="p-3 w-[14%] text-center no-print whitespace-nowrap">សកម្មភាព (បន្ថែម/កែ/លុប)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                            {tri.chapters.map((ch, cIdx) => (
                              <tr key={cIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <td className="p-3 font-extrabold text-teal-900 dark:text-teal-300 bg-slate-50/50 dark:bg-slate-800/30">
                                  <div>{ch.month || '-'}</div>
                                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                                    {ch.chapterNo}
                                  </div>
                                </td>
                                <td className="p-3 font-extrabold text-purple-900 dark:text-purple-300">
                                  {ch.weekNo ? (
                                    <span className="inline-block bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 px-2 py-0.5 rounded text-[11px]">
                                      {ch.weekNo}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                                <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                                  <div>{ch.title}</div>
                                  {ch.topics && ch.topics.length > 0 && (
                                    <ul className="mt-1.5 space-y-0.5 list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 font-normal">
                                      {ch.topics.map((top, topIdx) => (
                                        <li key={topIdx}>{top}</li>
                                      ))}
                                    </ul>
                                  )}
                                </td>
                                <td className="p-3 text-center text-slate-600 dark:text-slate-400 font-mono font-bold">
                                  {ch.hours}
                                </td>
                                <td className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {ch.objective}
                                </td>
                                <td className="p-3 text-center text-[11px]">
                                  {ch.studentBookPages || ch.teacherBookPages ? (
                                    <div className="space-y-1">
                                      {ch.studentBookPages && (
                                        <span className="inline-block bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 text-[10px]">
                                          ស.ស: {ch.studentBookPages}
                                        </span>
                                      )}
                                      {ch.teacherBookPages && (
                                        <span className="inline-block bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-bold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 text-[10px]">
                                          ស.គ: {ch.teacherBookPages}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                                <td className="p-2.5 text-center no-print align-middle">
                                  <div className="flex items-center justify-center gap-1 flex-wrap">
                                    {/* Add Row Above */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setInsertModalState({
                                          subjectId: sub.id,
                                          trimesterIndex: tIdx,
                                          insertIndex: cIdx,
                                        })
                                      }
                                      className="px-1.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition flex items-center gap-0.5 text-[10px] font-bold border border-emerald-200/80 dark:border-emerald-800"
                                      title="បន្ថែមជួរថ្មីនៅពីលើមេរៀននេះ (+ លើ)"
                                    >
                                      <Plus className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                      <span>+លើ</span>
                                    </button>

                                    {/* Add Row Below */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setInsertModalState({
                                          subjectId: sub.id,
                                          trimesterIndex: tIdx,
                                          insertIndex: cIdx + 1,
                                        })
                                      }
                                      className="px-1.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800 transition flex items-center gap-0.5 text-[10px] font-bold border border-teal-200/80 dark:border-teal-800"
                                      title="បន្ថែមជួរថ្មីនៅពីក្រោមមេរៀននេះ (+ ក្រោម)"
                                    >
                                      <Plus className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                                      <span>+ក្រោម</span>
                                    </button>

                                    {/* Edit Row */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingLesson({
                                          subjectId: sub.id,
                                          trimesterIndex: tIdx,
                                          chapterIndex: cIdx,
                                          chapterNo: ch.chapterNo,
                                          title: ch.title,
                                          hours: ch.hours,
                                          month: ch.month || '',
                                          weekNo: ch.weekNo || '',
                                          objective: ch.objective,
                                          topicsStr: ch.topics ? ch.topics.join('\n') : ch.title,
                                          studentBookPages: ch.studentBookPages || '',
                                          teacherBookPages: ch.teacherBookPages || '',
                                        })
                                      }
                                      className="p-1 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 transition border border-purple-200 dark:border-purple-800"
                                      title="កែសម្រួលព័ត៌មានមេរៀននេះ"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete / Remove Row */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLesson(sub.id, tIdx, cIdx)}
                                      className="p-1 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900 transition border border-rose-200 dark:border-rose-800"
                                      title="លុបជួរមេរៀននេះចេញពីតារាង (- លុប)"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="no-print">
                            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                              <td colSpan={7} className="p-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setInsertModalState({
                                      subjectId: sub.id,
                                      trimesterIndex: tIdx,
                                      insertIndex: tri.chapters.length,
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs font-bold transition border border-emerald-300 dark:border-emerald-800 shadow-2xs"
                                >
                                  <Plus className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
                                  <span>+ បន្ថែមជួរមេរៀនថ្មីក្នុងតារាងត្រីមាសនេះ</span>
                                </button>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teaching Strategies & Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 space-y-2">
                  <h5 className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>វិធីសាស្ត្របង្រៀនសកម្ម (Teaching Strategies)</span>
                  </h5>
                  <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                    {sub.teachingStrategies.map((strat, idx) => (
                      <li key={idx}>{strat}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 space-y-2">
                  <h5 className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <span>ឧបករណ៍ និងវិធីសាស្ត្រវាយតម្លៃ (Assessment Tools)</span>
                  </h5>
                  <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                    {sub.assessmentTools.map((tool, idx) => (
                      <li key={idx}>{tool}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add / Insert New Lesson to Syllabus */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs no-print overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 flex items-center justify-center font-bold shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    បញ្ចូល/បន្ថែមមេរៀនថ្មីក្នុងកម្មវិធីសិក្សា
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">បន្ថែមខ្លឹមសារមេរៀនថ្មីទៅតាមមុខវិជ្ជា និងត្រីមាស</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLessonSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ជ្រើសរើសមុខវិជ្ជា
                  </label>
                  <select
                    value={targetSubjectId}
                    onChange={(e) => setTargetSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {syllabusList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.icon} {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ជ្រើសរើសត្រីមាស
                  </label>
                  <select
                    value={targetTrimesterIndex}
                    onChange={(e) => setTargetTrimesterIndex(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    <option value={0}>ត្រីមាសទី ១</option>
                    <option value={1}>ត្រីមាសទី ពីរ</option>
                    <option value={2}>ត្រីមាសទី ៣</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    លេខមេរៀន / ជំពូក
                  </label>
                  <input
                    type="text"
                    value={newChapterNo}
                    onChange={(e) => setNewChapterNo(e.target.value)}
                    placeholder="ឧ. មេរៀនទី ១"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ខែ
                  </label>
                  <input
                    type="text"
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    placeholder="ឧ. វិច្ឆិកា"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    សប្តាហ៍ទី
                  </label>
                  <input
                    type="text"
                    value={newWeekNo}
                    onChange={(e) => setNewWeekNo(e.target.value)}
                    placeholder="ឧ. សប្តាហ៍ទី ១"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ចំណងជើងមេរៀន
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="បញ្ចូលចំណងជើងមេរៀន..."
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    រយៈពេលម៉ោង
                  </label>
                  <input
                    type="text"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    placeholder="ឧ. ១ ម៉ោង"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  គោលបំណងសិក្សា (រំពឹងទុក)
                </label>
                <textarea
                  rows={2}
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="រៀបរាប់ពីអ្វីដែលសិស្សទទួលបាន (វិជ្ជាសម្បទា បំណិនសម្បទា ចរិយាសម្បទា)..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ខ្លឹមសាររង / ប្រធានបទ (ចុះបន្ទាត់សម្រាប់ការបំបែកចំនុច)
                </label>
                <textarea
                  rows={3}
                  value={newTopicsStr}
                  onChange={(e) => setNewTopicsStr(e.target.value)}
                  placeholder="១.១- និយមន័យ&#10;១.២- ខ្លឹមសារសំខាន់"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ទំព័រសៀវភៅសិស្ស (ស.ស)
                  </label>
                  <input
                    type="text"
                    value={newStudentBookPages}
                    onChange={(e) => setNewStudentBookPages(e.target.value)}
                    placeholder="ឧ. ទំព័រ ១-៥"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ទំព័រសៀវភៅគ្រូ (ស.គ)
                  </label>
                  <input
                    type="text"
                    value={newTeacherBookPages}
                    onChange={(e) => setNewTeacherBookPages(e.target.value)}
                    placeholder="ឧ. ទំព័រ ១-៧"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md"
                >
                  រក្សាទុកមេរៀន
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Existing Lesson */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 shrink-0">
                  <Edit3 className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  កែសម្រួលមេរៀន/ជំពូក (កែសម្រួលបានគ្រប់ផ្នែក)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditLessonSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ចំណងជើងមេរៀន ឬជំពូក
                </label>
                <input
                  type="text"
                  required
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    លេខមេរៀន/ជំពូក
                  </label>
                  <input
                    type="text"
                    value={editingLesson.chapterNo}
                    onChange={(e) => setEditingLesson({ ...editingLesson, chapterNo: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ខែ
                  </label>
                  <input
                    type="text"
                    value={editingLesson.month}
                    onChange={(e) => setEditingLesson({ ...editingLesson, month: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    សប្តាហ៍ទី
                  </label>
                  <input
                    type="text"
                    value={editingLesson.weekNo}
                    onChange={(e) => setEditingLesson({ ...editingLesson, weekNo: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    រយៈពេលម៉ោង
                  </label>
                  <input
                    type="text"
                    value={editingLesson.hours}
                    onChange={(e) => setEditingLesson({ ...editingLesson, hours: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  លទ្ធផលសិក្សា (កម្មវិធីសិក្សាមេតូឌិក)
                </label>
                <textarea
                  rows={3}
                  value={editingLesson.objective}
                  onChange={(e) => setEditingLesson({ ...editingLesson, objective: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ខ្លឹមសាររង / ប្រធានបទ (ចុះបន្ទាត់សម្រាប់ការបំបែកចំនុច)
                </label>
                <textarea
                  rows={3}
                  value={editingLesson.topicsStr}
                  onChange={(e) => setEditingLesson({ ...editingLesson, topicsStr: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ទំព័រសៀវភៅសិស្ស (ស.ស)
                  </label>
                  <input
                    type="text"
                    value={editingLesson.studentBookPages}
                    onChange={(e) => setEditingLesson({ ...editingLesson, studentBookPages: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ទំព័រសៀវភៅគ្រូ (ស.គ)
                  </label>
                  <input
                    type="text"
                    value={editingLesson.teacherBookPages}
                    onChange={(e) => setEditingLesson({ ...editingLesson, teacherBookPages: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold min-h-[44px]"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold shadow-md min-h-[44px]"
                >
                  រក្សាទុកការកែប្រែ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Inserting Row Above/Below */}
      {insertModalState && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  បន្ថែមជួរមេរៀនថ្មី (លើ / ក្រោម)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInsertModalState(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInsertLessonSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ចំណងជើងមេរៀន ឬជំពូក
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="បញ្ចូលចំណងជើងមេរៀន..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    លេខមេរៀន/ជំពូក
                  </label>
                  <input
                    type="text"
                    value={newChapterNo}
                    onChange={(e) => setNewChapterNo(e.target.value)}
                    placeholder="ឧ. មេរៀនទី ១"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ខែ
                  </label>
                  <input
                    type="text"
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    placeholder="ឧ. វិច្ឆិកា"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    សប្តាហ៍ទី
                  </label>
                  <input
                    type="text"
                    value={newWeekNo}
                    onChange={(e) => setNewWeekNo(e.target.value)}
                    placeholder="ឧ. សប្តាហ៍ទី ១"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    រយៈពេលម៉ោង
                  </label>
                  <input
                    type="text"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    placeholder="ឧ. ១០ ម៉ោង"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  លទ្ធផលសិក្សា (កម្មវិធីសិក្សាមេតូឌិក)
                </label>
                <textarea
                  rows={3}
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="រៀបរាប់ពីអ្វីដែលសិស្សទទួលបាន..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ខ្លឹមសាររង / ប្រធានបទ (ចុះបន្ទាត់សម្រាប់ការបំបែកចំនុច)
                </label>
                <textarea
                  rows={3}
                  value={newTopicsStr}
                  onChange={(e) => setNewTopicsStr(e.target.value)}
                  placeholder="១.១- និយមន័យ&#10;១.២- ខ្លឹមសារសំខាន់"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ទំព័រសៀវភៅសិស្ស (ស.ស)
                  </label>
                  <input
                    type="text"
                    value={newStudentBookPages}
                    onChange={(e) => setNewStudentBookPages(e.target.value)}
                    placeholder="ឧ. ទំព័រ ១-៥"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ទំព័រសៀវភៅគ្រូ (ស.គ)
                  </label>
                  <input
                    type="text"
                    value={newTeacherBookPages}
                    onChange={(e) => setNewTeacherBookPages(e.target.value)}
                    placeholder="ឧ. ទំព័រ ១-៧"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setInsertModalState(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold min-h-[44px]"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md min-h-[44px]"
                >
                  បញ្ចូលជួរមេរៀន
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Khmer Lesson Plans Complete Modal */}
      <KhmerLessonPlanModal
        isOpen={isKhmerModalOpen}
        onClose={() => setIsKhmerModalOpen(false)}
        onShowToast={onShowToast}
      />

      {/* PDF Customizer & Export Modal */}
      <PdfCustomizerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        documentType="syllabus"
        title={
          pdfSelectedSubject
            ? `កំណត់ទម្រង់ & ទាញយក PDF៖ មុខវិជ្ជា ${pdfSelectedSubject.name}`
            : 'កំណត់ទម្រង់ & ទាញយក PDF កម្មវិធីសិក្សា (គ្រប់មុខវិជ្ជា)'
        }
        initialHeader={{
          docTitle: pdfSelectedSubject
            ? `បំណែងចែកកម្មវិធីសិក្សាលម្អិត មុខវិជ្ជា ${pdfSelectedSubject.name}`
            : 'បំណែងចែកកម្មវិធីសិក្សាលម្អិតតាមមុខវិជ្ជា',
          officeInfo: pdfSelectedSubject?.officeInfo || 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកំពង់ឆ្នាំង',
          departmentInfo: 'ការិយាល័យសុខភាពសិក្សា / ការិយាល័យអប់រំ',
        }}
        syllabusData={pdfSelectedSubject ? [pdfSelectedSubject] : filteredSubjects}
        onShowToast={onShowToast}
      />
    </div>
  );
};

