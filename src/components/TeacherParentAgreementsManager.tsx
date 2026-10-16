import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Search,
  User,
  Phone,
  Calendar,
  Award,
  FileText,
  Printer,
  Edit3,
  Save,
  CheckCircle2,
  Users,
  Check,
  ChevronRight,
  Sparkles,
  RefreshCw,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, TeacherProfile } from '../types';
import { PdfCustomizerModal } from './PdfCustomizerModal';
import { getKhmerLunarDate, getKhmerSouriyateiDate } from '../utils/khmerDate';

export interface StudentAgreementData {
  studentId: number;
  studentName: string;
  gender: 'ប្រុស' | 'ស្រី';
  grade: string;
  schoolName: string;
  academicYear: string;
  province: string;
  fatherName: string;
  motherName: string;
  parentPhone: string;
  teacherName: string;
  teacherPhone: string;
  // Khmer Grades
  khmerStartGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  khmerTargetGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  khmerFinalGrade?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | '';
  // Math Grades
  mathStartGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  mathTargetGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  mathFinalGrade?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | '';
  // Duties
  parentDuties: string[];
  teacherDuties: string[];
  // Date & Location
  lunarDate: string;
  solarDate: string;
  location: string;
}

interface TeacherParentAgreementsManagerProps {
  teacher: TeacherProfile;
  students: Student[];
  onShowToast: (msg: string) => void;
}

const STORAGE_KEY = 'teacher_parent_agreements_db_v1';

const DEFAULT_PARENT_DUTIES = [
  'ត្រូវជួយបង្រៀន និងដឹកនាំកូនធ្វើកិច្ចការផ្ទះ ដែលលោកគ្រូ អ្នកគ្រូបានដាក់ពីសាលារៀន។',
  'ត្រូវជួយឧបត្ថម្ភគាំទ្រដល់កូនៗ ទាំងស្មារតី និងសម្ភារៈ ព្រមទាំងលើកទឹកចិត្តពួកគេបានរៀនទៀងទាត់ និងទាន់ពេលវេលាជារៀងរាល់ថ្ងៃ។',
  'ទំនាក់ទំនងជាប្រចាំ និងចូលរួមប្រជុំប្រចាំខែជាមួយគ្រូបង្រៀន ដើម្បីរួមគ្នាតាមដានការសិក្សារបស់កូន និងដោះស្រាយការលំបាកនានាដែលថ្នាក់រៀនជួបប្រទះ។'
];

const DEFAULT_TEACHER_DUTIES = [
  'រៀបចំកម្មវិធីបង្រៀនបន្ថែម និងបង្រៀនសិស្សឱ្យសម្រេចតាមផែនការ និងទាន់កម្មវិធីសិក្សាថ្នាក់កំពុងរៀន។',
  'យកចិត្តទុកដាក់បង្រៀន និងតាមដានលទ្ធផលសិក្សារបស់សិស្សជារៀងរាល់ថ្ងៃ សប្តាហ៍ ខែ និងត្រីមាស។',
  'ទំនាក់ទំនងជាមួយមាតាបិតា អ្នកអាណាព្យាបាលសិស្សជាប្រចាំ ដើម្បីរួមគ្នាដោះស្រាយការលំបាករបស់សិស្ស និងតម្រូវការចាំបាច់សម្រាប់ដំណើរការថ្នាក់រៀនបានទាន់ពេលវេលា។'
];

export const TeacherParentAgreementsManager: React.FC<TeacherParentAgreementsManagerProps> = ({
  teacher,
  students,
  onShowToast,
}) => {
  const [agreementsMap, setAgreementsMap] = useState<{ [studentId: number]: StudentAgreementData }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'ប្រុស' | 'ស្រី'>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<StudentAgreementData | null>(null);

  // PDF Preview / Customizer
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfStudentData, setPdfStudentData] = useState<StudentAgreementData | null>(null);

  // Batch print modal
  const [isBatchPrintOpen, setIsBatchPrintOpen] = useState(false);

  // Load saved agreements from localStorage or initialize from students list
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let map: { [studentId: number]: StudentAgreementData } = {};
      if (saved) {
        map = JSON.parse(saved);
      }

      // Sync with current students
      const updatedMap = { ...map };
      students.forEach((s) => {
        if (!updatedMap[s.id]) {
          updatedMap[s.id] = {
            studentId: s.id,
            studentName: s.name,
            gender: s.gender,
            grade: teacher.grade || 'ថ្នាក់ទី ៦(ក)',
            schoolName: teacher.school || 'សាលាបឋមសិក្សាអូរឫស្សីកណ្តាល',
            academicYear: teacher.academicYear || '២០២៥-២០២៦',
            province: 'ស្ទឹងត្រែង',
            fatherName: 'សី កៀត',
            motherName: 'យាយ សានីហាស់',
            parentPhone: s.parentPhone || '0883592346',
            teacherName: teacher.name || 'ឌុក សុភ័ក្ត្រ',
            teacherPhone: teacher.phone || '0718036272',
            khmerStartGrade: 'D',
            khmerTargetGrade: 'B',
            khmerFinalGrade: 'A',
            mathStartGrade: 'E',
            mathTargetGrade: 'B',
            mathFinalGrade: 'A',
            parentDuties: [...DEFAULT_PARENT_DUTIES],
            teacherDuties: [...DEFAULT_TEACHER_DUTIES],
            lunarDate: getKhmerLunarDate(new Date()).fullChhankatei,
            solarDate: getKhmerSouriyateiDate(new Date()),
            location: teacher.school ? teacher.school.replace(/^(សាលាបឋមសិក្សា|បឋមសិក្សា|សាលា)\s*/i, '').trim() : 'អូរឫស្សីកណ្តាល',
          };
        }
      });

      setAgreementsMap(updatedMap);
    } catch (e) {
      console.error('Error loading agreements from localStorage', e);
    }
  }, [students, teacher]);

  const saveAgreementsToStorage = (newMap: { [studentId: number]: StudentAgreementData }) => {
    setAgreementsMap(newMap);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMap));
    } catch (e) {
      console.error('Error saving agreements to storage', e);
    }
  };

  const getStudentAgreement = (student: Student): StudentAgreementData => {
    if (agreementsMap[student.id]) {
      return agreementsMap[student.id];
    }
    return {
      studentId: student.id,
      studentName: student.name,
      gender: student.gender,
      grade: teacher.grade || 'ថ្នាក់ទី ៦(ក)',
      schoolName: teacher.school || 'សាលាបឋមសិក្សាអូរឫស្សីកណ្តាល',
      academicYear: teacher.academicYear || '២០២៥-២០២៦',
      province: 'ស្ទឹងត្រែង',
      fatherName: 'សី កៀត',
      motherName: 'យាយ សានីហាស់',
      parentPhone: student.parentPhone || '0883592346',
      teacherName: teacher.name || 'ឌុក សុភ័ក្ត្រ',
      teacherPhone: teacher.phone || '0718036272',
      khmerStartGrade: 'D',
      khmerTargetGrade: 'B',
      khmerFinalGrade: 'A',
      mathStartGrade: 'E',
      mathTargetGrade: 'B',
      mathFinalGrade: 'A',
      parentDuties: [...DEFAULT_PARENT_DUTIES],
      teacherDuties: [...DEFAULT_TEACHER_DUTIES],
      lunarDate: getKhmerLunarDate(new Date()).fullChhankatei,
      solarDate: getKhmerSouriyateiDate(new Date()),
      location: teacher.school ? teacher.school.replace(/^(សាលាបឋមសិក្សា|បឋមសិក្សា|សាលា)\s*/i, '').trim() : 'អូរឫស្សីកណ្តាល',
    };
  };

  const handleOpenEdit = (student: Student) => {
    const data = getStudentAgreement(student);
    setEditingData({ ...data });
    setIsEditingModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingData) return;

    const newMap = {
      ...agreementsMap,
      [editingData.studentId]: editingData,
    };
    saveAgreementsToStorage(newMap);
    setIsEditingModalOpen(false);
    onShowToast(`បានរក្សាទុកកិច្ចព្រមព្រៀងរបស់សិស្ស «${editingData.studentName}» រួចរាល់!`);
  };

  const handleOpenPdf = (student: Student) => {
    const data = getStudentAgreement(student);
    setPdfStudentData(data);
    setIsPdfModalOpen(true);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.latinName && s.latinName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.rollNo.toString().includes(searchTerm);
    const matchesGender = filterGender === 'all' || s.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  // Generate single student HTML for PDF
  const renderStudentAgreementHtml = (data: StudentAgreementData) => {
    const gradesList = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

    return `
      <div style="font-family: inherit; font-size: 10pt; color: #1e293b; line-height: 1.6; padding: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="font-family: 'Moul', cursive; font-size: 13pt; color: #1e1b4b; margin: 0 0 8px 0;">កិច្ចព្រមព្រៀង</h3>
          <div style="font-size: 10.5pt; font-weight: bold; color: #334155; margin-bottom: 6px;">រវាង</div>
          <div style="font-size: 11pt; font-weight: bold; color: #047857; margin-bottom: 6px;">គ្រូបង្រៀន</div>
          <div style="font-size: 10.5pt; font-weight: bold; color: #334155; margin-bottom: 6px;">និង</div>
          <div style="font-size: 11pt; font-weight: bold; color: #1e1b4b; margin-bottom: 10px;">មាតាបិតា អ្នកអាណាព្យាបាលសិស្ស</div>
          <div style="font-size: 10.5pt; font-weight: bold; color: #334155;">ស្តីពី</div>
          <h4 style="font-size: 11.5pt; font-weight: bold; color: #b91c1c; margin: 6px 0 10px 0;">លទ្ធផលសិក្សារបស់សិស្សឈ្មោះ៖ ${data.studentName} ភេទ ${data.gender === 'ប្រុស' ? 'ប' : 'ស'} ${data.grade}</h4>
          <div style="font-size: 10pt; font-weight: bold; color: #334155;">ឆ្នាំសិក្សា ${data.academicYear}</div>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 9.5pt; line-height: 1.8;">
          <div><b>សាលារៀន៖</b> ${data.schoolName} &nbsp;&nbsp;&nbsp;&nbsp; <b>ខេត្ត៖</b> ${data.province}</div>
          <div><b>ឈ្មោះមាតាបិតា៖</b> ឪពុក <b>${data.fatherName || '............'}</b> &nbsp;&nbsp;|&nbsp;&nbsp; ម្តាយ <b>${data.motherName || '............'}</b> &nbsp;&nbsp;&nbsp;&nbsp; <b>លេខទូរស័ព្ទ៖</b> ${data.parentPhone || '..................'}</div>
          <div><b>ឈ្មោះគ្រូបន្ទុកថ្នាក់៖</b> <b>${data.teacherName}</b> &nbsp;&nbsp;&nbsp;&nbsp; <b>លេខទូរស័ព្ទ៖</b> ${data.teacherPhone || '..................'}</div>
        </div>

        <div style="margin-bottom: 14px; font-size: 8.5pt; background-color: #f1f5f9; padding: 6px 10px; border-radius: 6px; text-align: center;">
          <b>កំណត់ចំណាំលើកម្រិតពិន្ទុ៖</b> F ក្រោម 5 ពិន្ទុ &nbsp;|&nbsp; E ពី 5-5.99 ពិន្ទុ &nbsp;|&nbsp; D ពី 6-6.99 ពិន្ទុ &nbsp;|&nbsp; C ពី 7-7.99 ពិន្ទុ &nbsp;|&nbsp; B ពី 8-8.99 ពិន្ទុ &nbsp;|&nbsp; A ពី 9-10 ពិន្ទុ
        </div>

        <h4 style="font-family: 'Moul', cursive; font-size: 10pt; color: #1e1b4b; margin: 14px 0 8px 0;">លទ្ធផលរំពឹងទុកលើលទ្ធផលសិក្សារបស់សិស្សតាមមុខវិជ្ជា</h4>
        
        <!-- Khmer table -->
        <div style="margin-bottom: 12px;">
          <div style="font-weight: bold; font-size: 9.5pt; color: #047857; margin-bottom: 4px;">១) សិស្សទទួលបាននិទ្ទេសមុខវិជ្ជា៖ ភាសាខ្មែរ</div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 9pt; text-align: center;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; width: 140px;">និទ្ទេស</th>
                ${gradesList.map((g) => `<th style="border: 1px solid #cbd5e1; padding: 6px; width: 45px;">${g}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">ដើមឆ្នាំ</td>
                ${gradesList.map((g) => `<td style="border: 1px solid #cbd5e1; padding: 6px; ${data.khmerStartGrade === g ? 'background-color: #dbeafe; font-weight: bold; color: #1d4ed8;' : ''}">${data.khmerStartGrade === g ? '✓' : ''}</td>`).join('')}
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">គ្រោងចុងឆ្នាំ</td>
                ${gradesList.map((g) => `<td style="border: 1px solid #cbd5e1; padding: 6px; ${data.khmerTargetGrade === g ? 'background-color: #dbeafe; font-weight: bold; color: #1d4ed8;' : ''}">${data.khmerTargetGrade === g ? '✓' : ''}</td>`).join('')}
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">សម្រេចចុងឆ្នាំ</td>
                ${gradesList.map((g) => `<td style="border: 1px solid #cbd5e1; padding: 6px; ${data.khmerFinalGrade === g ? 'background-color: #dcfce7; font-weight: bold; color: #15803d;' : ''}">${data.khmerFinalGrade === g ? '✓' : ''}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Math table -->
        <div style="margin-bottom: 14px;">
          <div style="font-weight: bold; font-size: 9.5pt; color: #047857; margin-bottom: 4px;">២) សិស្សទទួលបាននិទ្ទេសមុខវិជ្ជា៖ គណិតវិទ្យា</div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 9pt; text-align: center;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; width: 140px;">និទ្ទេស</th>
                ${gradesList.map((g) => `<th style="border: 1px solid #cbd5e1; padding: 6px; width: 45px;">${g}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">ដើមឆ្នាំ</td>
                ${gradesList.map((g) => `<td style="border: 1px solid #cbd5e1; padding: 6px; ${data.mathStartGrade === g ? 'background-color: #dbeafe; font-weight: bold; color: #1d4ed8;' : ''}">${data.mathStartGrade === g ? '✓' : ''}</td>`).join('')}
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">គ្រោងចុងឆ្នាំ</td>
                ${gradesList.map((g) => `<td style="border: 1px solid #cbd5e1; padding: 6px; ${data.mathTargetGrade === g ? 'background-color: #dbeafe; font-weight: bold; color: #1d4ed8;' : ''}">${data.mathTargetGrade === g ? '✓' : ''}</td>`).join('')}
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: bold;">សម្រេចចុងឆ្នាំ</td>
                ${gradesList.map((g) => `<td style="border: 1px solid #cbd5e1; padding: 6px; ${data.mathFinalGrade === g ? 'background-color: #dcfce7; font-weight: bold; color: #15803d;' : ''}">${data.mathFinalGrade === g ? '✓' : ''}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top: 12px;">
          <h4 style="font-family: 'Moul', cursive; font-size: 9.5pt; color: #1e1b4b; margin: 0 0 4px 0;">ភារកិច្ចរបស់មាតាបិតា អ្នកអាណាព្យាបាលសិស្ស៖</h4>
          <div style="padding-left: 8px; line-height: 1.6; font-size: 9pt;">
            ${data.parentDuties.map((duty, idx) => `${idx + 1}. ${duty}`).join('<br/>')}
          </div>
        </div>

        <div style="margin-top: 12px;">
          <h4 style="font-family: 'Moul', cursive; font-size: 9.5pt; color: #1e1b4b; margin: 0 0 4px 0;">ភារកិច្ចរបស់គ្រូបង្រៀន៖</h4>
          <div style="padding-left: 8px; line-height: 1.6; font-size: 9pt;">
            ${data.teacherDuties.map((duty, idx) => `${idx + 1}. ${duty}`).join('<br/>')}
          </div>
        </div>

        <div style="margin-top: 12px; background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 6px; font-weight: bold; font-size: 9pt; color: #047857;">
          ភាគីទាំងពីរមានការឯកភាពក្នុងការជួយជំរុញ និងបំពេញភារកិច្ចរៀងៗខ្លួន ដើម្បីសម្រេចឱ្យបាននូវលទ្ធផលសិក្សារបស់សិស្សតាមផែនការដែលបានគ្រោងទុកខាងលើ។
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: space-between; text-align: center; font-size: 9.5pt; page-break-inside: avoid;">
          <div style="width: 220px;">
            <div style="margin-bottom: 2px;">${data.lunarDate}</div>
            <div style="margin-bottom: 4px;">${data.location}, ${data.solarDate}</div>
            <div style="font-weight: bold; margin-bottom: 45px;">ហត្ថលេខា ឬស្នាមមេដៃមាតាបិតា</div>
            <div style="border-bottom: 1px dotted #94a3b8; width: 140px; margin: 0 auto 5px auto;"></div>
            <div style="font-weight: bold;">${data.fatherName || data.motherName || '....................'}</div>
          </div>
          <div style="width: 200px;">
            <div style="margin-bottom: 38px;">&nbsp;</div>
            <div style="font-weight: bold; margin-bottom: 45px;">ហត្ថលេខាគ្រូទទួលបន្ទុកថ្នាក់</div>
            <div style="font-weight: bold; color: #047857;">${data.teacherName}</div>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-[28px] border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-base text-slate-900">
              កិច្ចព្រមព្រៀងរវាងគ្រូបង្រៀន និងមាតាបិតា អាណាព្យាបាលសិស្ស
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            កិច្ចព្រមព្រៀងមាន <b className="text-slate-800">សម្រាប់សិស្សគ្រប់ៗគ្នាក្នុងថ្នាក់ (សរុប {students.length} នាក់)</b>។ លោកគ្រូ-អ្នកគ្រូអាចចូលមើល ពិនិត្យ កែប្រែព័ត៌មាន និងទាញយកជា PDF តាមសិស្សម្នាក់ៗ ឬបោះពុម្ពទាំងអស់បានភ្លាមៗ។
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              if (students.length === 0) {
                onShowToast('មិនទាន់មានសិស្សក្នុងថ្នាក់នៅឡើយទេ!');
                return;
              }
              handleOpenPdf(students[0]);
            }}
            className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>មើលទម្រង់ PDF គំរូ</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ស្វែងរកឈ្មោះសិស្ស ឬអត្តលេខ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-rose-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setFilterGender('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filterGender === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              ទាំងអស់ ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterGender('ប្រុស')}
              className={`px-3 py-1 rounded-lg transition ${
                filterGender === 'ប្រុស' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              ប្រុស ({students.filter((s) => s.gender === 'ប្រុស').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterGender('ស្រី')}
              className={`px-3 py-1 rounded-lg transition ${
                filterGender === 'ស្រី' ? 'bg-white text-rose-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              ស្រី ({students.filter((s) => s.gender === 'ស្រី').length})
            </button>
          </div>
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="bg-white rounded-[24px] border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5 text-center w-12">ល.រ</th>
                <th className="p-3.5">ឈ្មោះសិស្ស</th>
                <th className="p-3.5 text-center">ភេទ</th>
                <th className="p-3.5">ឈ្មោះឪពុក-ម្តាយ</th>
                <th className="p-3.5">លេខទូរស័ព្ទមាតាបិតា</th>
                <th className="p-3.5 text-center">ភាសាខ្មែរ (ដើម-គ្រោង)</th>
                <th className="p-3.5 text-center">គណិត (ដើម-គ្រោង)</th>
                <th className="p-3.5 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    មិនមានទិន្នន័យសិស្សត្រូវនឹងការស្វែងរកឡើយ
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const data = getStudentAgreement(student);
                  return (
                    <tr key={student.id} className="hover:bg-rose-50/30 transition">
                      <td className="p-3.5 text-center font-bold text-slate-500">
                        {student.rollNo || idx + 1}
                      </td>
                      <td className="p-3.5 font-extrabold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {student.name.charAt(0)}
                          </span>
                          <div>
                            <div>{student.name}</div>
                            {student.latinName && (
                              <div className="text-[10px] text-slate-400 font-normal">
                                {student.latinName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            student.gender === 'ស្រី'
                              ? 'bg-rose-50 text-rose-600 border border-rose-200/50'
                              : 'bg-blue-50 text-blue-600 border border-blue-200/50'
                          }`}
                        >
                          {student.gender}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-800 font-medium">
                          {data.fatherName ? `ឪពុក: ${data.fatherName}` : ''}
                          {data.motherName ? ` | ម្តាយ: ${data.motherName}` : ''}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                        {data.parentPhone || student.parentPhone || '-'}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1 font-bold">
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                            {data.khmerStartGrade}
                          </span>
                          <span className="text-slate-400">➔</span>
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px]">
                            {data.khmerTargetGrade}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1 font-bold">
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                            {data.mathStartGrade}
                          </span>
                          <span className="text-slate-400">➔</span>
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px]">
                            {data.mathTargetGrade}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(student)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition flex items-center gap-1"
                            title="មើល និងកែប្រែខ្លឹមសារកិច្ចព្រមព្រៀង"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                            <span>កែប្រែខ្លឹមសារ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenPdf(student)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition flex items-center gap-1 shadow-2xs"
                            title="ទាញយក ឬបោះពុម្ពជា PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Agreement Modal for a single student */}
      <AnimatePresence>
        {isEditingModalOpen && editingData && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-rose-600 to-red-700 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5" />
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base">
                      កែសម្រួលកិច្ចព្រមព្រៀង៖ {editingData.studentName}
                    </h3>
                    <p className="text-[11px] text-rose-100">
                      ថ្នាក់ {editingData.grade} • ឆ្នាំសិក្សា {editingData.academicYear}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* 1. ព័ត៌មានទូទៅ */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-800 text-sm border-b pb-1.5 border-slate-100 flex items-center gap-2">
                    <User className="w-4 h-4 text-rose-600" />
                    <span>១. ព័ត៌មានសិស្ស និងមាតាបិតា</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ឈ្មោះសិស្ស</label>
                      <input
                        type="text"
                        value={editingData.studentName}
                        onChange={(e) => setEditingData({ ...editingData, studentName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ភេទ</label>
                      <select
                        value={editingData.gender}
                        onChange={(e) => setEditingData({ ...editingData, gender: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                      >
                        <option value="ប្រុស">ប្រុស</option>
                        <option value="ស្រី">ស្រី</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ថ្នាក់ទី</label>
                      <input
                        type="text"
                        value={editingData.grade}
                        onChange={(e) => setEditingData({ ...editingData, grade: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ឈ្មោះឪពុក</label>
                      <input
                        type="text"
                        value={editingData.fatherName}
                        onChange={(e) => setEditingData({ ...editingData, fatherName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ឈ្មោះម្តាយ</label>
                      <input
                        type="text"
                        value={editingData.motherName}
                        onChange={(e) => setEditingData({ ...editingData, motherName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">លេខទូរស័ព្ទមាតាបិតា</label>
                      <input
                        type="text"
                        value={editingData.parentPhone}
                        onChange={(e) => setEditingData({ ...editingData, parentPhone: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. កំណត់និទ្ទេសគោលដៅ */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-800 text-sm border-b pb-1.5 border-slate-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-rose-600" />
                    <span>២. លទ្ធផលរំពឹងទុកលើមុខវិជ្ជា (ភាសាខ្មែរ & គណិតវិទ្យា)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    {/* Khmer */}
                    <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                      <div className="font-extrabold text-emerald-800 text-xs">មុខវិជ្ជា៖ ភាសាខ្មែរ</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">ដើមឆ្នាំ</label>
                          <select
                            value={editingData.khmerStartGrade}
                            onChange={(e) => setEditingData({ ...editingData, khmerStartGrade: e.target.value as any })}
                            className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                          >
                            {['A', 'B', 'C', 'D', 'E', 'F'].map((g) => (
                              <option key={g} value={g}>
                                និទ្ទេស {g}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">គ្រោងចុងឆ្នាំ</label>
                          <select
                            value={editingData.khmerTargetGrade}
                            onChange={(e) => setEditingData({ ...editingData, khmerTargetGrade: e.target.value as any })}
                            className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-rose-600"
                          >
                            {['A', 'B', 'C', 'D', 'E', 'F'].map((g) => (
                              <option key={g} value={g}>
                                និទ្ទេស {g}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">សម្រេចចុងឆ្នាំ</label>
                          <select
                            value={editingData.khmerFinalGrade || ''}
                            onChange={(e) => setEditingData({ ...editingData, khmerFinalGrade: e.target.value as any })}
                            className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-emerald-600"
                          >
                            <option value="">(មិនទាន់មាន)</option>
                            {['A', 'B', 'C', 'D', 'E', 'F'].map((g) => (
                              <option key={g} value={g}>
                                និទ្ទេស {g}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Math */}
                    <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                      <div className="font-extrabold text-blue-800 text-xs">មុខវិជ្ជា៖ គណិតវិទ្យា</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">ដើមឆ្នាំ</label>
                          <select
                            value={editingData.mathStartGrade}
                            onChange={(e) => setEditingData({ ...editingData, mathStartGrade: e.target.value as any })}
                            className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                          >
                            {['A', 'B', 'C', 'D', 'E', 'F'].map((g) => (
                              <option key={g} value={g}>
                                និទ្ទេស {g}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">គ្រោងចុងឆ្នាំ</label>
                          <select
                            value={editingData.mathTargetGrade}
                            onChange={(e) => setEditingData({ ...editingData, mathTargetGrade: e.target.value as any })}
                            className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-rose-600"
                          >
                            {['A', 'B', 'C', 'D', 'E', 'F'].map((g) => (
                              <option key={g} value={g}>
                                និទ្ទេស {g}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">សម្រេចចុងឆ្នាំ</label>
                          <select
                            value={editingData.mathFinalGrade || ''}
                            onChange={(e) => setEditingData({ ...editingData, mathFinalGrade: e.target.value as any })}
                            className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-emerald-600"
                          >
                            <option value="">(មិនទាន់មាន)</option>
                            {['A', 'B', 'C', 'D', 'E', 'F'].map((g) => (
                              <option key={g} value={g}>
                                និទ្ទេស {g}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. ភារកិច្ចមាតាបិតា */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-800 text-sm border-b pb-1.5 border-slate-100">
                    ៣. ភារកិច្ចរបស់មាតាបិតា អ្នកអាណាព្យាបាលសិស្ស
                  </h4>
                  {editingData.parentDuties.map((duty, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="font-bold text-slate-500 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={duty}
                        onChange={(e) => {
                          const updated = [...editingData.parentDuties];
                          updated[idx] = e.target.value;
                          setEditingData({ ...editingData, parentDuties: updated });
                        }}
                        className="flex-1 p-2 rounded-lg border border-slate-200 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* 4. ភារកិច្ចគ្រូបង្រៀន */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-800 text-sm border-b pb-1.5 border-slate-100">
                    ៤. ភារកិច្ចរបស់គ្រូបង្រៀន
                  </h4>
                  {editingData.teacherDuties.map((duty, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="font-bold text-slate-500 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={duty}
                        onChange={(e) => {
                          const updated = [...editingData.teacherDuties];
                          updated[idx] = e.target.value;
                          setEditingData({ ...editingData, teacherDuties: updated });
                        }}
                        className="flex-1 p-2 rounded-lg border border-slate-200 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* 5. កាលបរិច្ឆេទ & ទីកន្លែង */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-800 text-sm border-b pb-1.5 border-slate-100">
                    ៥. កាលបរិច្ឆេទ និងទីកន្លែងចុះកិច្ចព្រមព្រៀង
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">កាលបរិច្ឆេទចន្ទគតិ</label>
                      <input
                        type="text"
                        value={editingData.lunarDate}
                        onChange={(e) => setEditingData({ ...editingData, lunarDate: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">កាលបរិច្ឆេទសុរិយគតិ</label>
                      <input
                        type="text"
                        value={editingData.solarDate}
                        onChange={(e) => setEditingData({ ...editingData, solarDate: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ទីកន្លែង</label>
                      <input
                        type="text"
                        value={editingData.location}
                        onChange={(e) => setEditingData({ ...editingData, location: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center gap-2 shadow-md shadow-rose-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>រក្សាទុកការកែប្រែ</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Customizer Modal */}
      {pdfStudentData && (
        <PdfCustomizerModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          documentType="general"
          title={`កំណត់ទម្រង់ & ទាញយក PDF កិច្ចព្រមព្រៀងសិស្ស៖ ${pdfStudentData.studentName}`}
          initialHeader={{
            docTitle: 'កិច្ចព្រមព្រៀងរវាងគ្រូបង្រៀន និងមាតាបិតា អាណាព្យាបាលសិស្ស',
            docSubtitle: `ស្តីពីលទ្ធផលសិក្សារបស់សិស្សឈ្មោះ ${pdfStudentData.studentName} ភេទ ${pdfStudentData.gender === 'ប្រុស' ? 'ប' : 'ស'} ${pdfStudentData.grade} ឆ្នាំសិក្សា ${pdfStudentData.academicYear}`,
            schoolName: pdfStudentData.schoolName,
            teacherName: pdfStudentData.teacherName,
            gradeLevel: pdfStudentData.grade,
            academicYear: pdfStudentData.academicYear,
            officeInfo: `មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត${pdfStudentData.province}`,
          }}
          customTableHtml={renderStudentAgreementHtml(pdfStudentData)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
