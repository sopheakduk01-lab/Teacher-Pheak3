import React, { useState, useEffect } from 'react';
import {
  FileBadge,
  Save,
  Printer,
  Edit3,
  Building2,
  User,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Info,
  Users2
} from 'lucide-react';
import { Student, TeacherProfile } from '../types';
import { PdfCustomizerModal } from './PdfCustomizerModal';
import { getKhmerLunarDate, getKhmerSouriyateiDate } from '../utils/khmerDate';

export interface PerformanceIndicatorRow {
  id: string;
  indicator: string;
  startYearCount: string; // e.g. "៤១/២៦"
  startYearResult: string; // e.g. "៥នាក់ (១២.១៩%)"
  endYearCount: string; // e.g. "...... / ......"
  targetEndYearResult: string; // e.g. "១០នាក់ (២៤.៣៩%)"
  achievedEndYearResult: string; // e.g. "....នាក់ (....%)"
}

export interface PrincipalAgreementData {
  academicYear: string;
  prokasNo: string;
  prokasDate: string;
  // Teacher Info
  teacherName: string;
  teacherGender: 'ប្រុស' | 'ស្រី';
  grade: string;
  schoolName: string;
  teacherVillage: string;
  teacherCommune: string;
  teacherDistrict: string;
  teacherProvince: string;
  // Principal Info
  principalName: string;
  principalGender: 'ប្រុស' | 'ស្រី';
  principalRole: string;
  schoolVillage: string;
  schoolCommune: string;
  schoolDistrict: string;
  schoolProvince: string;
  // Indicators
  indicators: PerformanceIndicatorRow[];
  // Articles
  article1Text: string;
  article2Preamble: string;
  article3Text: string;
  // Date & Signatures
  lunarDate: string;
  solarDate: string;
  committeeChairTitle: string;
}

interface TeacherPrincipalAgreementEditorProps {
  teacher: TeacherProfile;
  students: Student[];
  onShowToast: (msg: string) => void;
}

const STORAGE_KEY = 'teacher_principal_master_agreement_v1';

// Khmer Digit Converter
export const toKhmerNum = (num: number | string): string => {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return String(num).replace(/[0-9]/g, (d) => khmerDigits[parseInt(d, 10)]);
};

export const TeacherPrincipalAgreementEditor: React.FC<TeacherPrincipalAgreementEditorProps> = ({
  teacher,
  students,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const totalStudents = students.length || 41;
  const femaleStudents = students.filter((s) => s.gender === 'ស្រី').length || 26;
  const studentRatioKhmer = `${toKhmerNum(totalStudents)}/${toKhmerNum(femaleStudents)}`;

  const getDefaultIndicators = (ratio: string): PerformanceIndicatorRow[] => [
    {
      id: '1',
      indicator: '១. ភាគរយសិស្សមាននិទ្ទេស ABC មុខវិជ្ជាភាសាខ្មែរ',
      startYearCount: ratio,
      startYearResult: '៥នាក់ (១២.១៩%)',
      endYearCount: ratio,
      targetEndYearResult: '១០នាក់ (២៤.៣៩%)',
      achievedEndYearResult: '.... នាក់ (.... %)',
    },
    {
      id: '2',
      indicator: '២. ភាគរយសិស្សមាននិទ្ទេស ABC មុខវិជ្ជាគណិតវិទ្យា',
      startYearCount: ratio,
      startYearResult: '០នាក់ (០%)',
      endYearCount: ratio,
      targetEndYearResult: '១០នាក់ (២៤.៣៩%)',
      achievedEndYearResult: '.... នាក់ (.... %)',
    },
    {
      id: '3',
      indicator: '៣. ភាគរយសិស្សមានសមត្ថភាពអានតាមស្តង់ដាថ្នាក់ទី៦',
      startYearCount: ratio,
      startYearResult: '១០នាក់ (២៤.៣៩%)',
      endYearCount: ratio,
      targetEndYearResult: '១១នាក់ (២៦.៨២%)',
      achievedEndYearResult: '.... នាក់ (.... %)',
    },
    {
      id: '4',
      indicator: '៤. កម្រិតសមត្ថភាពគ្រូលើការអនុវត្តវិធីសាស្ត្របង្រៀន (កញ្ចប់សម្ភារៈអំណាន និងគណិតវិទ្យាថ្នាក់ដំបូង) និងការប្រើប្រាស់ការអនុវត្តវិធីបង្រៀនដែលមានប្រសិទ្ធភាព',
      startYearCount: '-',
      startYearResult: 'កម្រិតមធ្យម',
      endYearCount: '-',
      targetEndYearResult: 'កម្រិតល្អប្រសើរ',
      achievedEndYearResult: 'កម្រិតល្អ',
    },
  ];

  const [agreement, setAgreement] = useState<PrincipalAgreementData>({
    academicYear: teacher.academicYear || '២០២៥-២០២៦',
    prokasNo: '១២៦៩ អយក.ប្រក',
    prokasDate: '២៧ ខែ ធ្នូ ឆ្នាំ ២០២៣',
    teacherName: teacher.name || 'ឌុក សុភ័ក្ត្រ',
    teacherGender: 'ប្រុស',
    grade: teacher.grade || 'ថ្នាក់ទី ៦(ក)',
    schoolName: teacher.school || 'សាលាបឋមសិក្សាអូរឫស្សីកណ្តាល',
    teacherVillage: 'អូរឫស្សីកណ្តាល',
    teacherCommune: 'អូរឫស្សីកណ្តាល',
    teacherDistrict: 'សៀមបូក',
    teacherProvince: 'ស្ទឹងត្រែង',
    principalName: 'ហាស់ សាវ៉ានី',
    principalGender: 'ប្រុស',
    principalRole: 'នាយកសាលាបឋមសិក្សាអូរឫស្សីកណ្តាល',
    schoolVillage: 'អូរឫស្សីកណ្តាល',
    schoolCommune: 'អូរឫស្សីកណ្តាល',
    schoolDistrict: 'សៀមបូក',
    schoolProvince: 'ស្ទឹងត្រែង',
    indicators: getDefaultIndicators(studentRatioKhmer),
    article1Text:
      'យល់ព្រមចុះកិច្ចព្រមព្រៀងការងារប្រចាំឆ្នាំ ជាមួយលោកនាយក/នាយិកាសាលារៀន ដើម្បីលើកកម្ពស់គុណភាពបង្រៀន និងលទ្ធផលសិក្សារបស់សិស្សានុសិស្ស។',
    article2Preamble:
      'ដើម្បីវាស់វែងលទ្ធផលនៃការអនុវត្តការងារបង្រៀនប្រចាំឆ្នាំ ខ្ញុំបាទ/នាងខ្ញុំបានព្រមព្រៀងបង្កើត និងអនុវត្តនូវសូចនាករសមិទ្ធកម្មដូចមានបញ្ជាក់ខាងក្រោម៖',
    article3Text:
      'កិច្ចព្រមព្រៀងនេះ មានសុពលភាពចាប់ផ្តើមពីដើមឆ្នាំសិក្សា និងត្រូវបញ្ចប់នៅចុងឆ្នាំសិក្សានីមួយៗ។ ភាគីទាំងពីរ ត្រូវពិនិត្យឡើងវិញលទ្ធផលសម្រេច និងវាយតម្លៃការងារ នៅចុងឆមាស និងចុងឆ្នាំសិក្សា ដើម្បីដាក់ជូនទៅ គ.គ.ស អនុម័ត។',
    lunarDate: getKhmerLunarDate(new Date()).fullChhankatei,
    solarDate: `ធ្វើនៅ${teacher.school ? teacher.school.replace(/^(សាលាបឋមសិក្សា|បឋមសិក្សា|សាលា)\s*/i, '').trim() : 'អូរឫស្សីកណ្តាល'}, ${getKhmerSouriyateiDate(new Date())}`,
    committeeChairTitle: 'បានឃើញ និងឯកភាព ប្រធាន គ.គ.ស.',
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Replace old គ.ក.ស with គ.គ.ស if present
        if (parsed.committeeChairTitle && parsed.committeeChairTitle.includes('គ.ក.ស')) {
          parsed.committeeChairTitle = parsed.committeeChairTitle.replace(/គ\.ក\.ស/g, 'គ.គ.ស');
        }
        if (parsed.article3Text && parsed.article3Text.includes('គ.ក.ស')) {
          parsed.article3Text = parsed.article3Text.replace(/គ\.ក\.ស/g, 'គ.គ.ស');
        }
        setAgreement(parsed);
      }
    } catch (e) {
      console.error('Error loading principal agreement', e);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(agreement));
      setIsEditing(false);
      onShowToast('បានរក្សាទុកកិច្ចព្រមព្រៀងរវាងគ្រូ និងនាយកសាលារួចរាល់!');
    } catch (e) {
      console.error('Error saving principal agreement', e);
    }
  };

  // Sync Student Stats from Section 1
  const handleSyncStudentStats = () => {
    setAgreement((prev) => ({
      ...prev,
      indicators: prev.indicators.map((ind) => {
        if (ind.startYearCount === '-' || ind.startYearCount === '') return ind;
        return {
          ...ind,
          startYearCount: studentRatioKhmer,
          endYearCount: studentRatioKhmer,
        };
      }),
    }));
    onShowToast(`បានទាញស្ថិតិសិស្ស «សរុប ${toKhmerNum(totalStudents)} នាក់ / ស្រី ${toKhmerNum(femaleStudents)} នាក់ (${studentRatioKhmer})» ពីចំណុចទី១ ដោយជោគជ័យ!`);
  };

  const handleUpdateIndicator = (id: string, field: keyof PerformanceIndicatorRow, val: string) => {
    setAgreement((prev) => ({
      ...prev,
      indicators: prev.indicators.map((ind) => (ind.id === id ? { ...ind, [field]: val } : ind)),
    }));
  };

  const handleAddIndicator = () => {
    const newRow: PerformanceIndicatorRow = {
      id: Date.now().toString(),
      indicator: `${agreement.indicators.length + 1}. សូចនាករថ្មី...`,
      startYearCount: studentRatioKhmer,
      startYearResult: '០នាក់ (០%)',
      endYearCount: studentRatioKhmer,
      targetEndYearResult: '១០នាក់ (២៤.៣៩%)',
      achievedEndYearResult: '....',
    };
    setAgreement((prev) => ({
      ...prev,
      indicators: [...prev.indicators, newRow],
    }));
  };

  const handleDeleteIndicator = (id: string) => {
    if (agreement.indicators.length <= 1) {
      onShowToast('មិនអាចលុបសូចនាករទាំងអស់បានទេ!');
      return;
    }
    setAgreement((prev) => ({
      ...prev,
      indicators: prev.indicators.filter((ind) => ind.id !== id),
    }));
  };

  // Generate HTML for PDF Customizer
  const renderAgreementHtml = () => {
    return `
      <div style="font-family: inherit; font-size: 10pt; color: #1e293b; line-height: 1.6; padding: 10px;">
        <div style="margin-bottom: 18px;">
          <!-- ១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់ -->
          <div style="text-align: center; margin-bottom: 8px;">
            <h3 style="font-family: 'Moul', cursive; font-size: 11.5pt; color: #1e1b4b; margin: 0 0 4px 0;">ព្រះរាជាណាចក្រកម្ពុជា</h3>
            <div style="font-size: 10pt; font-weight: bold; color: #334155;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div style="font-size: 8.5pt; letter-spacing: 2px; margin-top: 2px; font-weight: bold; color: #334155;">— ༺ ៚ ༻ —</div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1.5px solid #334155; padding-bottom: 6px; margin-bottom: 10px;">
            <div style="text-align: left;">
              <div style="font-size: 9.5pt; font-weight: bold; color: #1e1b4b;">ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុក${agreement.schoolDistrict || 'សៀមបូក'}</div>
              <div style="font-size: 9.5pt; font-weight: bold; color: #1e1b4b; margin-top: 2px;">${agreement.schoolName}</div>
            </div>
            <div style="text-align: right; font-size: 9pt; color: #475569;">
              <div>ថ្នាក់ទី ${agreement.grade}</div>
              <div>ឆ្នាំសិក្សា ${agreement.academicYear}</div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 6px;">
            <h4 style="font-family: 'Moul', cursive; font-size: 11pt; color: #6b21a8; margin: 0 0 6px 0;">កិច្ចព្រមព្រៀងសមិទ្ធកម្ម</h4>
            <div style="font-size: 10pt; font-weight: bold; color: #334155;">រវាង គ្រូបង្រៀន និង នាយក នាយិកា សាលារៀន</div>
            <div style="font-size: 10pt; font-weight: bold; color: #b91c1c; margin-top: 4px;">ស្តីពី លទ្ធផលសិក្សារបស់សិស្ស ឆ្នាំសិក្សា ${agreement.academicYear}</div>
          </div>
        </div>

        <div style="text-align: justify; font-size: 9.5pt; line-height: 1.7; margin-bottom: 14px; text-indent: 25px;">
          កិច្ចព្រមព្រៀងនេះធ្វើឡើងរវាងគ្រូបង្រៀន និងនាយក នាយិកាសាលារៀន ដោយអនុលោមតាមលក្ខណៈវិនិច្ឆ័យជ្រើសរើសសាលារៀនគោលដៅ ប្រតិបត្តិស្តង់ដាសាលារៀនគំរូ តាមប្រកាសលេខ <b>${agreement.prokasNo}</b> ចុះថ្ងៃទី <b>${agreement.prokasDate}</b> ស្តីពីការដាក់ឱ្យអនុវត្តយន្តការគាំទ្រស្តង់ដាសាលារៀនគំរូក្នុងការចូលរួមការកែទម្រង់វិស័យអប់រំ ពិសេសកំណែទម្រង់សាលារៀន ដោយតម្រូវឱ្យមានការវាស់វែងប្រសិទ្ធភាព និងស័ក្តិសិទ្ធិភាពនៃសូចនាករសមិទ្ធកម្ម។
        </div>

        <div style="font-size: 9.5pt; margin-bottom: 14px; line-height: 1.7;">
          <div style="font-weight: bold; margin-bottom: 4px;">ភាគីទាំងពីរបានព្រមព្រៀងគ្នាចុះកិច្ចព្រមព្រៀងក្នុងការអនុវត្ត ដូចមានចែងក្នុងប្រការខាងក្រោម៖</div>
          
          <div style="margin-top: 8px;">
            <b style="color: #6b21a8;">ប្រការ១ ៖ វិសាលភាពការងារ និងកិច្ចព្រមព្រៀង</b><br/>
            - ខ្ញុំបាទ/នាងខ្ញុំ ឈ្មោះ <b>${agreement.teacherName}</b> ភេទ <b>${agreement.teacherGender}</b> ជាគ្រូបង្រៀន${agreement.grade} នៃ${agreement.schoolName} នៅភូមិ${agreement.teacherVillage} ឃុំ${agreement.teacherCommune} ស្រុក${agreement.teacherDistrict} ខេត្ត${agreement.teacherProvince}។<br/>
            - យល់ព្រមចុះកិច្ចព្រមព្រៀងការងារប្រចាំឆ្នាំ ជាមួយលោកនាយក/នាយិកាសាលារៀន ឈ្មោះ <b>${agreement.principalName}</b> ភេទ <b>${agreement.principalGender}</b> ជា${agreement.principalRole} នៅភូមិ${agreement.schoolVillage} ឃុំ${agreement.schoolCommune} ស្រុក${agreement.schoolDistrict} ខេត្ត${agreement.schoolProvince}។
          </div>

          <div style="margin-top: 12px;">
            <b style="color: #6b21a8;">ប្រការ២ ៖ សូចនាករសមិទ្ធកម្ម និងគោលដៅ (លទ្ធផលក្នុងឆ្នាំ)</b><br/>
            ${agreement.article2Preamble}
          </div>
        </div>

        <!-- Indicator Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 8.5pt; text-align: center;">
          <thead>
            <tr style="background-color: #f3e8ff; color: #581c87;">
              <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; width: 35%;">សូចនាករ</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; width: 13%;">ចំនួនសិស្ស<br/>ដើមឆ្នាំ (សរុប/ស្រី)</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; width: 13%;">លទ្ធផលដើមឆ្នាំ<br/>ចំនួននិង%</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; width: 13%;">ចំនួនសិស្ស<br/>ចុងឆ្នាំ (សរុប/ស្រី)</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; width: 13%;">លទ្ធផលគ្រោង<br/>ចុងឆ្នាំ (%)</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; width: 13%;">សម្រេចលទ្ធផល<br/>ចុងឆ្នាំ (%)</th>
            </tr>
          </thead>
          <tbody>
            ${agreement.indicators
              .map(
                (row) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-weight: 500;">${row.indicator}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-family: 'Siemreap', sans-serif;">${row.startYearCount}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #faf5ff;">${row.startYearResult}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-family: 'Siemreap', sans-serif;">${row.endYearCount}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #fdf4ff; font-weight: bold; color: #7e22ce;">${row.targetEndYearResult}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #f0fdf4; font-weight: bold; color: #15803d;">${row.achievedEndYearResult}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div style="font-size: 9.5pt; margin-bottom: 18px; line-height: 1.7;">
          <b style="color: #6b21a8;">ប្រការ៣ ៖</b> ${agreement.article3Text}
        </div>

        <!-- ២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា -->
        <div style="margin-top: 25px; page-break-inside: avoid;">
          <!-- ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបង្រៀន/គ្រូបន្ទុកថ្នាក់ -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 22px;">
            <div style="text-align: center; min-width: 220px; font-size: 9pt;">
              <div>${agreement.lunarDate}</div>
              <div style="margin-bottom: 4px;">${agreement.solarDate}</div>
              <div style="font-weight: bold; margin-bottom: 50px;">គ្រូបន្ទុកថ្នាក់</div>
              <div style="font-weight: bold; color: #047857;">${agreement.teacherName}</div>
            </div>
          </div>

          <!-- ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា និងប្រធាន គ.គ.ស. -->
          <div style="display: flex; justify-content: space-between; text-align: center; font-size: 9pt;">
            <div style="width: 200px;">
              <div style="font-weight: bold; margin-bottom: 50px;">${agreement.committeeChairTitle}</div>
              <div style="border-bottom: 1px dotted #94a3b8; width: 120px; margin: 0 auto 5px auto;"></div>
              <div>(ហត្ថលេខា និងត្រា)</div>
            </div>
            <div style="width: 200px;">
              <div style="font-weight: bold; margin-bottom: 50px;">នាយក / នាយិកា សាលារៀន</div>
              <div style="font-weight: bold; color: #6b21a8;">${agreement.principalName}</div>
            </div>
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
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <FileBadge className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-base text-slate-900">
              កិច្ចព្រមព្រៀងសមិទ្ធកម្ម រវាងគ្រូបង្រៀន និងនាយក/នាយិកាសាលារៀន
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            កិច្ចព្រមព្រៀងនេះ <b className="text-purple-900">មានតែមួយច្បាប់ផ្លូវការ</b> រវាងគ្រូបន្ទុកថ្នាក់ និងនាយកសាលា ដោយអនុលោមតាមប្រកាសលេខ {agreement.prokasNo} (ស្តង់ដាសាលាបឋមសិក្សាគំរូ)។
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>រក្សាទុកការកែប្រែ</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 shadow-2xs active:scale-95"
            >
              <Edit3 className="w-4 h-4 text-purple-600" />
              <span>កែប្រែខ្លឹមសារ</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>មើល & ទាញយក PDF</span>
          </button>
        </div>
      </div>

      {/* Main Content Form / View */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-xs space-y-6 text-xs text-slate-700">
        {/* Section 1: Legal & Parties Info */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2 border-slate-100">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>១. ព័ត៌មានកិច្ចព្រមព្រៀង និងភាគីទាំងពីរ (ប្រការ១)</span>
            </h4>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
              ប្រកាសលេខ {agreement.prokasNo}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teacher Side */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 text-emerald-800">
                <User className="w-4 h-4" />
                <span>ភាគីគ្រូបង្រៀន</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">ឈ្មោះគ្រូបង្រៀន</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={agreement.teacherName}
                    onChange={(e) => setAgreement({ ...agreement, teacherName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">ភេទ</label>
                  <select
                    disabled={!isEditing}
                    value={agreement.teacherGender}
                    onChange={(e) => setAgreement({ ...agreement, teacherGender: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70 font-bold"
                  >
                    <option value="ប្រុស">ប្រុស</option>
                    <option value="ស្រី">ស្រី</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">ថ្នាក់ទី</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={agreement.grade}
                    onChange={(e) => setAgreement({ ...agreement, grade: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">សាលារៀន</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={agreement.schoolName}
                    onChange={(e) => setAgreement({ ...agreement, schoolName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70"
                  />
                </div>
              </div>
            </div>

            {/* Principal Side */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 text-purple-800">
                <Building2 className="w-4 h-4" />
                <span>ភាគីនាយក/នាយិកាសាលារៀន</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">ឈ្មោះនាយក/នាយិកា</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={agreement.principalName}
                    onChange={(e) => setAgreement({ ...agreement, principalName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">ភេទ</label>
                  <select
                    disabled={!isEditing}
                    value={agreement.principalGender}
                    onChange={(e) => setAgreement({ ...agreement, principalGender: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70 font-bold"
                  >
                    <option value="ប្រុស">ប្រុស</option>
                    <option value="ស្រី">ស្រី</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">តួនាទី និងសាលារៀន</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={agreement.principalRole}
                    onChange={(e) => setAgreement({ ...agreement, principalRole: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Indicator Table (Article 2) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2 border-slate-100">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>២. តារាងសូចនាករសមិទ្ធកម្ម និងគោលដៅ (ប្រការ២)</span>
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={handleSyncStudentStats}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs"
                    title="ទាញយកចំនួនសិស្សសរុប និងសិស្សស្រីពីស្ថិតិសិស្ស (ចំណុចទី១)"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                    <span>ទាញស្ថិតិសិស្ស ({studentRatioKhmer})</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddIndicator}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm shadow-purple-600/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>បន្ថែមសូចនាករ</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats Helper Bar */}
          <div className="bg-purple-50/60 border border-purple-200/80 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-600 text-white shadow-2xs">
                <Users2 className="w-4 h-4" />
              </span>
              <div>
                <span className="font-bold text-purple-950">ស្ថិតិសិស្សក្នុងថ្នាក់ (ទាញចេញពីចំណុចទី១)៖</span>{' '}
                <span className="font-bold text-purple-700 bg-white px-2 py-0.5 rounded-lg border border-purple-200 ml-1">
                  សរុប {toKhmerNum(totalStudents)} នាក់ / ស្រី {toKhmerNum(femaleStudents)} នាក់ ({studentRatioKhmer})
                </span>
              </div>
            </div>
            {!isEditing && (
              <span className="text-[11px] text-slate-500 italic">
                * ចុច «កែប្រែកិច្ចព្រមព្រៀង» ដើម្បីកែតម្រូវសូចនាករ ឬចុច «ទាញស្ថិតិសិស្ស»
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50/80 text-purple-900 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">សូចនាករ</th>
                  <th className="p-3 text-center w-28">ចំនួនសិស្ស<br/>ដើមឆ្នាំ (សរុប/ស្រី)</th>
                  <th className="p-3 text-center w-28">លទ្ធផលដើមឆ្នាំ<br/>(ចំនួន & %)</th>
                  <th className="p-3 text-center w-28">ចំនួនសិស្ស<br/>ចុងឆ្នាំ (សរុប/ស្រី)</th>
                  <th className="p-3 text-center w-28">លទ្ធផលគ្រោង<br/>ចុងឆ្នាំ (%)</th>
                  <th className="p-3 text-center w-28">សម្រេចលទ្ធផល<br/>ចុងឆ្នាំ (%)</th>
                  {isEditing && <th className="p-3 text-center w-12">លុប</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agreement.indicators.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.indicator}
                          onChange={(e) => handleUpdateIndicator(row.id, 'indicator', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 font-medium"
                        />
                      ) : (
                        <span className="font-bold text-slate-800">{row.indicator}</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.startYearCount}
                          onChange={(e) => handleUpdateIndicator(row.id, 'startYearCount', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-center font-mono"
                        />
                      ) : (
                        <span className="font-mono text-slate-700">{row.startYearCount}</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.startYearResult}
                          onChange={(e) => handleUpdateIndicator(row.id, 'startYearResult', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-center font-mono text-slate-800"
                        />
                      ) : (
                        <span className="font-mono font-bold text-slate-800">{row.startYearResult}</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.endYearCount}
                          onChange={(e) => handleUpdateIndicator(row.id, 'endYearCount', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-center font-mono"
                        />
                      ) : (
                        <span className="font-mono text-slate-600">{row.endYearCount}</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.targetEndYearResult}
                          onChange={(e) => handleUpdateIndicator(row.id, 'targetEndYearResult', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-center font-mono font-bold text-purple-700"
                        />
                      ) : (
                        <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                          {row.targetEndYearResult}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.achievedEndYearResult}
                          onChange={(e) => handleUpdateIndicator(row.id, 'achievedEndYearResult', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-center font-mono font-bold text-emerald-700"
                        />
                      ) : (
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {row.achievedEndYearResult}
                        </span>
                      )}
                    </td>
                    {isEditing && (
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteIndicator(row.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Article 3 and Signatures */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 border-b pb-2 border-slate-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-600" />
            <span>៣. សុពលភាព និងការចុះហត្ថលេខា (ប្រការ៣)</span>
          </h4>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">ខ្លឹមសារប្រការ៣</label>
            <textarea
              disabled={!isEditing}
              rows={2}
              value={agreement.article3Text}
              onChange={(e) => setAgreement({ ...agreement, article3Text: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">កាលបរិច្ឆេទចន្ទគតិ</label>
              <input
                type="text"
                disabled={!isEditing}
                value={agreement.lunarDate}
                onChange={(e) => setAgreement({ ...agreement, lunarDate: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">កាលបរិច្ឆេទសុរិយគតិ</label>
              <input
                type="text"
                disabled={!isEditing}
                value={agreement.solarDate}
                onChange={(e) => setAgreement({ ...agreement, solarDate: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">ប្រធាន គ.គ.ស.</label>
              <input
                type="text"
                disabled={!isEditing}
                value={agreement.committeeChairTitle}
                onChange={(e) => setAgreement({ ...agreement, committeeChairTitle: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100/70 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Footer actions when editing */}
        {isEditing && (
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
            >
              បោះបង់
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center gap-2 shadow-md shadow-purple-600/20"
            >
              <Save className="w-4 h-4" />
              <span>រក្សាទុកកិច្ចព្រមព្រៀង</span>
            </button>
          </div>
        )}
      </div>

      {/* PDF Customizer Modal */}
      <PdfCustomizerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        documentType="general"
        title="កំណត់ទម្រង់ & ទាញយក PDF កិច្ចព្រមព្រៀងសមិទ្ធកម្ម រវាងគ្រូ និងនាយកសាលា"
        initialHeader={{
          docTitle: 'កិច្ចព្រមព្រៀងសមិទ្ធកម្ម រវាង គ្រូបង្រៀន និង នាយក នាយិកា សាលារៀន',
          docSubtitle: `ស្តីពី លទ្ធផលសិក្សារបស់សិស្ស ថ្នាក់ទី ${agreement.grade} ឆ្នាំសិក្សា ${agreement.academicYear}`,
          schoolName: agreement.schoolName,
          teacherName: agreement.teacherName,
          gradeLevel: agreement.grade,
          academicYear: agreement.academicYear,
          officeInfo: `មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត${agreement.schoolProvince}`,
        }}
        customTableHtml={renderAgreementHtml()}
        onShowToast={onShowToast}
      />
    </div>
  );
};
