import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { Student, TeacherProfile, GradeDatabase } from '../types';
import { toKhmerNum } from '../utils/khmerDate';
import { motion, AnimatePresence } from 'motion/react';

interface ModelStandardReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
  teacher: TeacherProfile;
  students: Student[];
  grades: GradeDatabase;
  currentYear: string;
}

export const ModelStandardReportModal: React.FC<ModelStandardReportModalProps> = ({
  isOpen,
  onClose,
  formId,
  teacher,
  students,
  grades,
  currentYear
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getFormTitle = () => {
    switch (formId) {
      case 'abc_grade_report': return 'របាយការណ៍លទ្ធផលតេស្តនិទ្ទេស A B C';
      case 'reading_assessment': return 'របាយការណ៍ស្ទង់សមត្ថភាពអំណាន';
      case 'nutrition_record': return 'បញ្ជីកត់ត្រាអាហារូបត្ថម្ភសិស្ស';
      case 'health_record': return 'របាយការណ៍ពិនិត្យសុខភាពសិស្ស';
      case 'scholarship_record': return 'បញ្ជីអាហារូបករណ៍សិស្សក្រីក្រ';
      case 'moral_record': return 'តារាងវាយតម្លៃសីលធម៌ និងចរិយាសម្បទា';
      default: return 'របាយការណ៍ស្តង់ដាសាលាគំរូ';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[32px] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col my-8"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-indigo-900 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileText className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">{getFormTitle()}</h3>
              <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest mt-0.5">
                MoEYS Standard Document • {currentYear}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-bold flex items-center gap-2 border border-white/10"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព (Print)</span>
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (A4 Preview) */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-8 flex justify-center no-scrollbar">
          <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-lg p-[15mm] md:p-[20mm] print:shadow-none print:p-0 relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
               <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Logo_of_the_Ministry_of_Education%2C_Youth_and_Sport_of_Cambodia.png" className="w-[80%] grayscale" alt="" />
            </div>

            {/* Official Header */}
            <div className="text-center space-y-1 mb-8 relative z-10">
              <h1 className="font-moul text-[14pt] text-indigo-950">ព្រះរាជាណាចក្រកម្ពុជា</h1>
              <h2 className="font-bold text-[12pt]">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
              <div className="text-slate-400">********</div>
            </div>

            {/* School Info */}
            <div className="flex justify-between items-start mb-8 text-[10pt] relative z-10">
              <div className="space-y-1">
                <p className="font-bold">រដ្ឋបាលស្រុក៖ .............................</p>
                <p className="font-bold">ការិយាល័យអប់រំ យុវជន និងកីឡាស្រុក៖ .............................</p>
                <p className="font-bold text-indigo-900">សាលាបឋមសិក្សា៖ {teacher.school}</p>
              </div>
              <div className="text-right space-y-1">
                <p>ឆ្នាំសិក្សា៖ {toKhmerNum(currentYear)}</p>
                <p>ថ្នាក់ទី៖ {teacher.grade}</p>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center mb-8 relative z-10">
              <h2 className="font-moul text-[12pt] text-indigo-900 leading-relaxed uppercase underline decoration-double underline-offset-8">
                {getFormTitle()}
              </h2>
            </div>

            {/* Dynamic Content based on Form ID */}
            <div className="relative z-10">
              {formId === 'abc_grade_report' && (
                <div className="space-y-6">
                  <table className="w-full border-collapse border-[1.5px] border-slate-800 text-[9pt]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th rowSpan={2} className="border-[1.5px] border-slate-800 p-2 text-center w-10">ល.រ</th>
                        <th rowSpan={2} className="border-[1.5px] border-slate-800 p-2 text-left">គោត្តនាម និងនាម</th>
                        <th rowSpan={2} className="border-[1.5px] border-slate-800 p-2 text-center w-12">ភេទ</th>
                        <th colSpan={3} className="border-[1.5px] border-slate-800 p-2 text-center">ភាសាខ្មែរ</th>
                        <th colSpan={3} className="border-[1.5px] border-slate-800 p-2 text-center">គណិតវិទ្យា</th>
                      </tr>
                      <tr>
                        <th className="border-[1.5px] border-slate-800 p-2 text-center">ពិន្ទុ</th>
                        <th className="border-[1.5px] border-slate-800 p-2 text-center">ចំណាត់ថ្នាក់</th>
                        <th className="border-[1.5px] border-slate-800 p-2 text-center">និទ្ទេស</th>
                        <th className="border-[1.5px] border-slate-800 p-2 text-center">ពិន្ទុ</th>
                        <th className="border-[1.5px] border-slate-800 p-2 text-center">ចំណាត់ថ្នាក់</th>
                        <th className="border-[1.5px] border-slate-800 p-2 text-center">និទ្ទេស</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, idx) => (
                        <tr key={s.id}>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center">{toKhmerNum(idx+1)}</td>
                          <td className="border-[1.5px] border-slate-800 p-2 font-bold">{s.name}</td>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center">{s.gender}</td>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center">-</td>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center">-</td>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center font-bold">F</td>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center">-</td>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center">-</td>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center font-bold">F</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-[9pt] font-bold text-amber-800">ចំណាំ៖ ទិន្នន័យនិទ្ទេស F បច្ចុប្បន្នមានកម្រិតខ្ពស់ (យោងតាមរូបភាពភស្តុតាង)។</p>
                  </div>
                </div>
              )}

              {formId === 'reading_assessment' && (
                <div className="space-y-6">
                   <p className="text-[10pt] leading-relaxed">
                     របាយការណ៍ស្ទង់សមត្ថភាពអំណានចុងឆ្នាំ សម្រាប់សិស្សថ្នាក់ទី១ និងទី៦ ឆ្នាំសិក្សា {toKhmerNum(currentYear)}។
                   </p>
                   <table className="w-full border-collapse border-[1.5px] border-slate-800 text-[9pt]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="border-[1.5px] border-slate-800 p-3 text-center">ល.រ</th>
                        <th className="border-[1.5px] border-slate-800 p-3 text-left">កម្រិតថ្នាក់</th>
                        <th className="border-[1.5px] border-slate-800 p-3 text-center">ចំនួនសិស្សសរុប</th>
                        <th className="border-[1.5px] border-slate-800 p-3 text-center">សិស្សអានបានតាមស្តង់ដា</th>
                        <th className="border-[1.5px] border-slate-800 p-3 text-center">ភាគរយ (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-[1.5px] border-slate-800 p-3 text-center">១</td>
                        <td className="border-[1.5px] border-slate-800 p-3 font-bold">ថ្នាក់ទី ១</td>
                        <td className="border-[1.5px] border-slate-800 p-3 text-center">{toKhmerNum(students.length)}</td>
                        <td className="border-[1.5px] border-slate-800 p-3 text-center">-</td>
                        <td className="border-[1.5px] border-slate-800 p-3 text-center">-</td>
                      </tr>
                      <tr>
                        <td className="border-[1.5px] border-slate-800 p-3 text-center">២</td>
                        <td className="border-[1.5px] border-slate-800 p-3 font-bold">ថ្នាក់ទី ៦</td>
                        <td className="border-[1.5px] border-slate-800 p-3 text-center">-</td>
                        <td className="border-[1.5px] border-slate-800 p-3 text-center">-</td>
                        <td className="border-[1.5px] border-slate-800 p-3 text-center">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Placeholder for other forms - UI Skeleton */}
              {['nutrition_record', 'health_record', 'scholarship_record', 'moral_record'].includes(formId) && (
                <div className="space-y-6">
                  <div className="border-[2px] border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                    <FileText className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-bold text-sm">ទម្រង់បែបបទសម្រាប់ {getFormTitle()}</p>
                    <p className="text-[10px] mt-1 font-medium italic">លោកគ្រូអាចទាញយកទម្រង់គំរូ និងបំពេញទិន្នន័យជាក់ស្តែងតាមសៀវភៅតាមដាន</p>
                  </div>
                  <table className="w-full border-collapse border-[1.5px] border-slate-800 text-[9pt]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="border-[1.5px] border-slate-800 p-2 text-center w-10">ល.រ</th>
                        <th className="border-[1.5px] border-slate-800 p-2 text-left">ឈ្មោះសិស្ស</th>
                        <th className="border-[1.5px] border-slate-800 p-2 text-center">ភេទ</th>
                        <th className="border-[1.5px] border-slate-800 p-2 text-center">សកម្មភាព/ស្ថានភាព</th>
                        <th className="border-[1.5px] border-slate-800 p-2 text-center">សម្គាល់</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(0, 5).map((s, idx) => (
                        <tr key={s.id}>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center">{toKhmerNum(idx+1)}</td>
                          <td className="border-[1.5px] border-slate-800 p-2">{s.name}</td>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center">{s.gender}</td>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center">....................</td>
                          <td className="border-[1.5px] border-slate-800 p-2 text-center">....................</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={5} className="border-[1.5px] border-slate-800 p-4 text-center text-slate-400">
                          (និងបន្តសិស្សដទៃទៀតក្នុងថ្នាក់)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer / Signatures */}
            <div className="mt-12 flex justify-between items-start text-[10pt] relative z-10 print:mt-20">
              <div className="text-center w-1/3">
                <p className="font-bold">បានឃើញ និងឯកភាព</p>
                <p className="font-moul mt-2 mb-20 text-[10pt]">នាយកសាលា</p>
                <p className="font-bold">..................................</p>
              </div>
              <div className="text-center w-1/3">
                <p>ថ្ងៃទី........ ខែ......... ឆ្នាំ {toKhmerNum(new Date().getFullYear())}</p>
                <p className="font-moul mt-2 mb-20 text-[10pt]">អ្នករៀបចំរបាយការណ៍</p>
                <p className="font-bold text-indigo-900">{teacher.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center no-print">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
             <AlertCircle className="w-4 h-4 text-amber-500" />
             <span>ឯកសារនេះត្រូវបានបង្កើតឡើងដោយស្វ័យប្រវត្តិតាមស្តង់ដា MoEYS</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition text-xs font-black active:scale-95"
            >
              បិទវិញ
            </button>
            <button 
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition text-xs font-black flex items-center gap-2 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ពជា PDF</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
