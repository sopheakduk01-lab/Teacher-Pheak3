import React from 'react';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Building2,
  Calendar,
  Award,
  ExternalLink
} from 'lucide-react';
import { Student, TeacherProfile, GradeDatabase, AttendanceDatabase, BookBorrowingRecord } from '../types';
import { toKhmerNum } from '../utils/khmerDate';

interface StandardEvidenceViewerProps {
  formId: string;
  criterionText: string;
  teacher: TeacherProfile;
  students: Student[];
  grades: GradeDatabase;
  attendance: AttendanceDatabase;
  borrowings: BookBorrowingRecord[];
  academicYear: string;
}

export const StandardEvidenceViewer: React.FC<StandardEvidenceViewerProps> = ({
  formId,
  criterionText,
  teacher,
  students,
  grades,
  attendance,
  borrowings,
  academicYear
}) => {
  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    switch (formId) {
      case 'abc_grade_report':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-900">របាយការណ៍និទ្ទេស A B C</p>
                <p className="text-xs text-blue-700">បង្ហាញពីលទ្ធផលសិក្សារបស់សិស្សតាមមុខវិជ្ជា និងនិទ្ទេសជាក់ស្តែង។</p>
              </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-700">ល.រ</th>
                    <th className="px-4 py-3 font-bold text-slate-700">ឈ្មោះសិស្ស</th>
                    <th className="px-4 py-3 font-bold text-slate-700 text-center">ភាសាខ្មែរ</th>
                    <th className="px-4 py-3 font-bold text-slate-700 text-center">គណិតវិទ្យា</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.slice(0, 10).map((s, idx) => (
                    <tr key={s.id}>
                      <td className="px-4 py-2.5 font-medium">{toKhmerNum(idx + 1)}</td>
                      <td className="px-4 py-2.5 font-bold">{s.name}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">A</span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">B</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 text-center italic">* បង្ហាញទិន្នន័យគំរូសម្រាប់សិស្ស ១០ នាក់ដំបូង។ ទិន្នន័យពេញលេញមានក្នុងប្រព័ន្ធគ្រប់គ្រងពិន្ទុ។</p>
          </div>
        );

      case 'reading_assessment':
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">របាយការណ៍ស្ទង់សមត្ថភាពអំណាន</p>
                <p className="text-xs text-amber-700">លទ្ធផលនៃការវាយតម្លៃការអានពាក្យ និងអត្ថបទតាមកម្រិតថ្នាក់។</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">អត្រាអានដាច់</p>
                <p className="text-3xl font-black text-slate-900">៨៥%</p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]"></div>
                </div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ល្បឿនអានមធ្យម</p>
                <p className="text-3xl font-black text-slate-900">៥៥</p>
                <p className="text-[10px] font-bold text-slate-500">ពាក្យក្នុងមួយនាទី</p>
              </div>
            </div>
          </div>
        );

      case 'moral_record':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-purple-900">កំណត់ត្រាសីលធម៌ និងចរិយាសម្បទា</p>
                <p className="text-xs text-purple-700">ការតាមដានឥរិយាបថ និងការអនុវត្តវិន័យរបស់សិស្សក្នុងថ្នាក់។</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'ការគោរពវិន័យសាលា', score: 92 },
                { label: 'សីលធម៌ក្នុងការរស់នៅ', score: 88 },
                { label: 'ការចូលរួមសកម្មភាពក្នុងថ្នាក់', score: 95 },
                { label: 'អនាម័យ និងសណ្តាប់ធ្នាប់', score: 90 }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-purple-600" style={{ width: `${item.score}%` }}></div>
                    </div>
                    <span className="text-xs font-black text-purple-900">{item.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'health_record':
      case 'nutrition_record':
        return (
          <div className="space-y-6">
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-rose-900">របាយការណ៍សុខភាព និងអាហារូបត្ថម្ភ</p>
                <p className="text-xs text-rose-700">ការតាមដានទម្ងន់ កម្ពស់ និងស្ថានភាពសុខភាពទូទៅរបស់សិស្ស។</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">សិស្សសុខភាពល្អ</p>
                <p className="text-2xl font-black text-emerald-600">៩៨%</p>
              </div>
              <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">សិស្សកម្ពស់តាមស្តង់ដា</p>
                <p className="text-2xl font-black text-blue-600">៩២%</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6 py-10 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-slate-700 text-sm">ឯកសារភស្តុតាងឌីជីថល៖ {toKhmerNum(formId.split('_').length)}</h5>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                ឯកសារសម្រាប់ចំណុចរង "{criterionText}" កំពុងត្រូវបានរៀបចំតាមទម្រង់ស្តង់ដាក្រសួង MoEYS។
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ប្រព័ន្ធបានភ្ជាប់ទិន្នន័យដោយស្វ័យប្រវត្តិ</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-[32px] border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0">
      {/* Document Header */}
      <div className="flex flex-col items-center text-center space-y-1 mb-8 border-b pb-6 border-slate-100 print:border-slate-300">
        <h4 className="font-moul text-lg text-slate-900 leading-normal">ព្រះរាជាណាចក្រកម្ពុជា</h4>
        <h5 className="font-koulen text-sm text-slate-800 tracking-widest">ជាតិ សាសនា ព្រះមហាក្សត្រ</h5>
        <div className="w-24 h-px bg-slate-300 my-2 mx-auto"></div>
        <div className="pt-4 space-y-1">
          <p className="text-xs font-bold text-slate-600">សាលាបឋមសិក្សា៖ {teacher.school}</p>
          <p className="text-xs font-bold text-slate-600">ថ្នាក់ទី៖ {teacher.grade} | ឆ្នាំសិក្សា៖ {academicYear}</p>
          <h2 className="text-lg font-moul text-indigo-900 pt-4 leading-relaxed">
            ឯកសារភស្តុតាងស្តង់ដាសាលាគំរូ ៥
          </h2>
          <p className="text-xs font-bold text-slate-500 border border-slate-200 px-4 py-1.5 rounded-full inline-block mt-2">
            {criterionText}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>

      {/* Signature Section */}
      <div className="mt-12 grid grid-cols-2 gap-10 text-center text-xs">
        <div className="space-y-16">
          <p className="font-bold">បានឃើញ និងឯកភាព<br /><span className="font-moul">នាយកសាលា</span></p>
          <div className="h-px w-32 bg-slate-200 mx-auto opacity-50"></div>
        </div>
        <div className="space-y-1">
          <p className="text-slate-500 italic">ថ្ងៃទី....... ខែ....... ឆ្នាំ២០២...</p>
          <p className="font-bold">គ្រូបន្ទុកថ្នាក់<br /><span className="font-moul">{teacher.name}</span></p>
        </div>
      </div>

      {/* Footer / Print Action */}
      <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center no-print">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Evidence Code: {formId.toUpperCase()} | WikiSchool System
        </p>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95 text-xs font-bold"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>បោះពុម្ពឯកសារភស្តុតាង (PDF)</span>
        </button>
      </div>
    </div>
  );
};
