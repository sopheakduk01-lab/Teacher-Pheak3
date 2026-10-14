import React, { useRef } from 'react';
import {
  Printer,
  X,
  Download,
  Calendar,
  Building,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Globe,
  Award,
} from 'lucide-react';
import { MOEYS_GUIDELINE_2026_2027_INFO } from '../data/moeysGuidelineData';
import { MOEYS_STATS_GUIDELINE_2026_2027_META } from '../data/moeysStatsGuidelineData';
import { SUB_DECREE_HOLIDAYS_2027_META } from '../data/civilServantHolidays2027';

interface MoeysDirectivesPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const MoeysDirectivesPrintModal: React.FC<MoeysDirectivesPrintModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
    onShowToast?.('កំពុងបើកផ្ទាំងបោះពុម្ពឯកសារ...');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center">
              🖨️
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-moul">
                បោះពុម្ពសន្លឹកសង្ខេបលិខិតបទដ្ឋានគតិយុត្ត MoEYS
              </h2>
              <p className="text-xs text-slate-300">
                ទម្រង់ A4 ផ្លូវការសម្រាប់បិទលើក្តារព័ត៌មានសាលា ឬការិយាល័យលោកគ្រូ-អ្នកគ្រូ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition"
              title="បិទ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950/50">
          <div
            ref={printAreaRef}
            className="bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-md border border-slate-200 max-w-[210mm] mx-auto print:shadow-none print:border-none print:p-0 print:m-0 font-sans"
            style={{ minHeight: '297mm' }}
          >
            {/* Cambodian National Header */}
            <div className="text-center space-y-1 pb-4 border-b border-slate-300">
              <h1 className="font-moul text-base sm:text-lg text-slate-900 tracking-wide">
                ព្រះរាជាណាចក្រកម្ពុជា
              </h1>
              <h2 className="font-moul text-sm sm:text-base text-slate-800">
                ជាតិ សាសនា ព្រះមហាក្សត្រ
              </h2>
              <div className="font-serif text-base text-slate-600 select-none">🪷 🪷 🪷</div>
              <div className="flex justify-between items-center text-xs text-slate-700 pt-2 px-2">
                <div className="text-left font-semibold">
                  <p>ក្រសួងអប់រំ យុវជន និងកីឡា</p>
                  <p>នាយកដ្ឋានបឋមសិក្សា</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">កម្រងឯកសារបទដ្ឋានផ្លូវការ</p>
                  <p className="text-[11px] text-slate-500">ឆ្នាំសិក្សា ២០២៦-២០២៧</p>
                </div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center my-5 space-y-1">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-300">
                ឯកសារសង្ខេបសម្រាប់គណៈគ្រប់គ្រង និងលោកគ្រូ-អ្នកគ្រូ
              </span>
              <h3 className="font-moul text-sm sm:text-base text-slate-900 leading-relaxed pt-1">
                តារាងសង្ខេបសេចក្តីណែនាំ និងលិខិតបទដ្ឋានគតិយុត្តសំខាន់ៗ
              </h3>
            </div>

            {/* Content Table 1: Comparative Matrix */}
            <div className="space-y-4 text-xs">
              <table className="w-full border-collapse border border-slate-300 text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold">
                    <th className="border border-slate-300 p-2 text-center w-10">ល.រ</th>
                    <th className="border border-slate-300 p-2">លិខិតបទដ្ឋាន & លេខ</th>
                    <th className="border border-slate-300 p-2">កាលបរិច្ឆេទ & ហត្ថលេខី</th>
                    <th className="border border-slate-300 p-2">ខ្លឹមសារស្នូល & ឱសានវាទ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Row 1: Guideline 427 */}
                  <tr>
                    <td className="border border-slate-300 p-2 text-center font-bold">១</td>
                    <td className="border border-slate-300 p-2">
                      <strong className="font-moul block text-slate-900">សេចក្តីណែនាំ ៤២៧</strong>
                      <span className="text-[11px] text-slate-600 block">
                        ដំណើរការគ្រឹះស្ថានបឋមសិក្សា ២០២៦-២០២៧
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2">
                      <p>{MOEYS_GUIDELINE_2026_2027_INFO.date}</p>
                      <p className="text-slate-600">
                        {MOEYS_GUIDELINE_2026_2027_INFO.signatory}
                      </p>
                    </td>
                    <td className="border border-slate-300 p-2 space-y-0.5">
                      <p>
                        • <strong>បវេសនកាល ៖</strong> ០១ ខែវិច្ឆិកា ឆ្នាំ២០២៦
                      </p>
                      <p>
                        • <strong>វិស្សមកាលតូច ៖</strong> ១៦-១៩ មេសា ២០២៧
                      </p>
                      <p>
                        • <strong>មហាវិស្សមកាល ៖</strong> ០១ កក្កដា ២០២៧ តទៅ
                      </p>
                      <p>• ពង្រឹងការរៀននិងបង្រៀន ២៧-៣០ ម៉ោង/សប្តាហ៍</p>
                    </td>
                  </tr>

                  {/* Row 2: Guideline 42 */}
                  <tr className="bg-cyan-50/50">
                    <td className="border border-slate-300 p-2 text-center font-bold text-cyan-900">
                      ២
                    </td>
                    <td className="border border-slate-300 p-2">
                      <strong className="font-moul block text-cyan-950">សេចក្តីណែនាំ ៤២ (ថ្មី)</strong>
                      <span className="text-[11px] text-slate-600 block">
                        ការប្រមូលស្ថិតិអប់រំបឋមត្រៀមបើកបវេសនកាល
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2">
                      <p>{MOEYS_STATS_GUIDELINE_2026_2027_META.dateSolar}</p>
                      <p className="text-slate-600">
                        {MOEYS_STATS_GUIDELINE_2026_2027_META.signatory}
                      </p>
                    </td>
                    <td className="border border-slate-300 p-2 space-y-0.5">
                      <p className="text-red-700 font-bold">
                        ⚠️ ឱសានវាទ ៖ មុនថ្ងៃទី២៥ ខែកញ្ញា ឆ្នាំ២០២៦
                      </p>
                      <p>• បញ្ចូលតាមប្រព័ន្ធ ៖ entryemis.moeys.gov.kh</p>
                      <p>
                        • តារាងបឋមសិក្សា ៖ ២.ក១, ២.ក២, ៣.ក, ៣.ខ១, ៣.ខ២, ៣.គ, ៤.ក, ៤.គ
                      </p>
                      <p>• ធានាតុល្យភាព សិស្ស-ថ្នាក់រៀន-គ្រូ-បន្ទប់រៀន</p>
                    </td>
                  </tr>

                  {/* Row 3: Sub-decree 198 */}
                  <tr>
                    <td className="border border-slate-300 p-2 text-center font-bold">៣</td>
                    <td className="border border-slate-300 p-2">
                      <strong className="font-moul block text-slate-900">អនុក្រឹត្យ ១៩៨</strong>
                      <span className="text-[11px] text-slate-600 block">
                        ប្រតិទិនឈប់សម្រាកមន្ត្រីរាជការ ២០២៧
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2">
                      <p>{SUB_DECREE_HOLIDAYS_2027_META.signedDateSolar}</p>
                      <p className="text-slate-600">
                        {SUB_DECREE_HOLIDAYS_2027_META.signatory}
                      </p>
                    </td>
                    <td className="border border-slate-300 p-2 space-y-0.5">
                      <p>
                        • <strong>ចំនួនថ្ងៃឈប់សរុប ៖</strong> ២២ ថ្ងៃ (១៦ ពិធីបុណ្យ)
                      </p>
                      <p>
                        • <strong>បុណ្យចូលឆ្នាំខ្មែរ ៖</strong> ១៤-១៦ មេសា ២០២៧ (៣ ថ្ងៃ)
                      </p>
                      <p>
                        • <strong>បុណ្យភ្ជុំបិណ្ឌ ៖</strong> ២៩-៣០ កញ្ញា & ០១ តុលា ២០២៧ (៣ ថ្ងៃ)
                      </p>
                      <p>
                        • <strong>បុណ្យអុំទូក ៖</strong> ១៣-១៥ វិច្ឆិកា ២០២៧ (៣ ថ្ងៃ)
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Specific Primary School Checkpoints */}
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>កាតព្វកិច្ចចម្បងដែលសាលាបឋមសិក្សាត្រូវអនុវត្តជាបន្ទាន់</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-950">
                  <div className="space-y-1">
                    <p>
                      <strong>១. ការស្រង់ស្ថិតិ EMIS:</strong> ត្រូវចាត់ចែងស្រង់ចំនួនកុមារមត្តេយ្យ
                      សិស្សឡើងថ្នាក់ ត្រួតថ្នាក់ និងបន្ទប់រៀនជាក់ស្តែង បញ្ចូលទៅក្នុងប្រព័ន្ធ
                      entryemis.moeys.gov.kh មុនថ្ងៃទី២៥ ខែកញ្ញា ឆ្នាំ២០២៦ ជាដាច់ខាត។
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <strong>២. ការរៀបចំសម្ភារ & ថ្នាក់រៀន:</strong> សម្អាតបរិវេណសាលា បន្ទប់ទឹក
                      បណ្ណាល័យ និងរៀបចំបញ្ជីសិស្សតាមថ្នាក់ ព្រមទាំងតុបតែងបន្ទប់រៀនឱ្យរួចរាល់មុនថ្ងៃទី០១
                      វិច្ឆិកា ២០២៦។
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Seal and Signature section */}
              <div className="mt-8 flex justify-between items-end pt-4 border-t border-slate-200 text-xs">
                <div className="text-left space-y-1">
                  <p className="font-semibold text-slate-700">បានឃើញ និងឯកភាព</p>
                  <p className="font-bold text-slate-800">នាយក / នាយិកាសាលា</p>
                  <div className="h-14"></div>
                  <p className="text-slate-400">.....................................................</p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-slate-600">ធ្វើនៅថ្ងៃទី ........ ខែ ........ ឆ្នាំ២០២៦</p>
                  <p className="font-bold text-slate-800">អ្នកទទួលបន្ទុកបូកសរុប</p>
                  <div className="h-14"></div>
                  <p className="text-slate-400">.....................................................</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            គន្លឹះ៖ ជ្រើសរើសទំហំក្រដាស A4 និងកម្រិតមាត្រដ្ឋាន Fit to Page ពេលបញ្ជាបោះពុម្ព។
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition active:scale-95"
          >
            បិទផ្ទាំង
          </button>
        </div>
      </div>
    </div>
  );
};
