import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ExternalLink,
  BookOpen,
  Printer,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  ChevronRight,
  Sparkles,
  Globe,
  Building,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { MOEYS_GUIDELINE_2026_2027_INFO } from '../data/moeysGuidelineData';
import { MOEYS_STATS_GUIDELINE_2026_2027_META } from '../data/moeysStatsGuidelineData';
import { SUB_DECREE_HOLIDAYS_2027_META } from '../data/civilServantHolidays2027';

interface MoeysDirectivesMatrixCardProps {
  onOpenGuideline427: () => void;
  onOpenGuideline42: () => void;
  onOpenHolidays198: () => void;
  onOpenPrintModal: () => void;
  onShowToast?: (msg: string) => void;
}

export const MoeysDirectivesMatrixCard: React.FC<MoeysDirectivesMatrixCardProps> = ({
  onOpenGuideline427,
  onOpenGuideline42,
  onOpenHolidays198,
  onOpenPrintModal,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  // Calculate days remaining to September 25, 2026
  const targetDate = new Date(2026, 8, 25); // Sept 25, 2026
  const currentDate = new Date(2026, 8, 18); // Simulation date Sept 18, 2026
  const diffTime = targetDate.getTime() - currentDate.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleCopy = () => {
    const text = [
      '🇰🇭 កម្រងលិខិតបទដ្ឋាន និងសេចក្តីណែនាំផ្លូវការ ក្រសួងអប់រំ យុវជន និងកីឡា ២០២៦-២០២៧',
      '--------------------------------------------------',
      `១. សេចក្តីណែនាំលេខ ${MOEYS_GUIDELINE_2026_2027_INFO.docNumber} (${MOEYS_GUIDELINE_2026_2027_INFO.date})`,
      `   • ដំណើរការគ្រឹះស្ថានបឋមសិក្សា ២០២៦-២០២៧`,
      `   • បើកបវេសនកាល ៖ ${MOEYS_GUIDELINE_2026_2027_INFO.keyDates[0].date}`,
      `   • វិស្សមកាលតូច ៖ ${MOEYS_GUIDELINE_2026_2027_INFO.keyDates[1].date}`,
      `   • មហាវិស្សមកាល ៖ ${MOEYS_GUIDELINE_2026_2027_INFO.keyDates[2].date}`,
      '',
      `២. សេចក្តីណែនាំលេខ ${MOEYS_STATS_GUIDELINE_2026_2027_META.docNumber} (${MOEYS_STATS_GUIDELINE_2026_2027_META.dateSolar})`,
      `   • ការប្រមូលស្ថិតិអប់រំបឋមត្រៀមបើកបវេសនកាល (EMIS)`,
      `   • ឱសានវាទបញ្ចប់ ៖ ${MOEYS_STATS_GUIDELINE_2026_2027_META.deadlineDays}`,
      `   • ប្រព័ន្ធបញ្ចូលអនឡាញ ៖ ${MOEYS_STATS_GUIDELINE_2026_2027_META.systemUrl}`,
      `   • តារាងស្ថិតិបឋម ៖ ២.ក១, ២.ក២, ៣.ក, ៣.ខ១, ៣.ខ២, ៣.គ, ៤.ក, ៤.គ`,
      '',
      `៣. អនុក្រឹត្យលេខ ${SUB_DECREE_HOLIDAYS_2027_META.number} (${SUB_DECREE_HOLIDAYS_2027_META.signedDateSolar})`,
      `   • ប្រតិទិនឈប់សម្រាកការងារមន្ត្រីរាជការ និយោជិត កម្មករ ប្រចាំឆ្នាំ២០២៧`,
      `   • ចំនួនថ្ងៃឈប់សម្រាកសរុប ៖ ២២ ថ្ងៃ (១៦ ពិធីបុណ្យ)`,
      `   • ចូលឆ្នាំខ្មែរ ៖ ១៤-១៦ មេសា ២០២៧ (៣ ថ្ងៃ)`,
      `   • ភ្ជុំបិណ្ឌ ៖ ២៩-៣០ កញ្ញា & ០១ តុលា ២០២៧ (៣ ថ្ងៃ)`,
      `   • ព្រះរាជពិធីបុណ្យអុំទូក ៖ ១៣-១៥ វិច្ឆិកា ២០២៧ (៣ ថ្ងៃ)`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast?.('បានចម្លងព័ត៌មានសង្ខេបនៃលិខិតទាំង ៣ ជោគជ័យ!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-[#071329] via-[#0b1c3e] to-[#040e22] text-white rounded-[28px] p-4 sm:p-6 shadow-xl border border-amber-400/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-[2px] shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#071329] rounded-[14px] flex items-center justify-center text-xl">
                📊
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                  តារាងសង្ខេប និងប្រៀបធៀប
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  កម្រងលិខិតបទដ្ឋានគតិយុត្ត ៣ ច្បាប់
                </span>
              </div>
              <h3 className="font-moul text-base sm:text-lg text-white mt-1 leading-snug">
                ខ្លឹមសារស្នូល & កាលបរិច្ឆេទសំខាន់ៗសម្រាប់សាលាបឋមសិក្សា
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition active:scale-95 border border-white/15 flex items-center gap-1.5"
              title="ចម្លងទិន្នន័យ"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
              <span>{copied ? 'បានចម្លង' : 'ចម្លងសង្ខេប'}</span>
            </button>

            <button
              onClick={onOpenPrintModal}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs transition active:scale-95 shadow-md flex items-center gap-1.5 border border-amber-300"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ព A4</span>
            </button>
          </div>
        </div>

        {/* Urgency Alert for EMIS */}
        <div className="bg-gradient-to-r from-cyan-950/80 via-blue-950/70 to-cyan-950/80 p-3 rounded-2xl border border-cyan-400/40 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/40">
              <Clock className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-cyan-200">
                ឱសានវាទប្រមូលស្ថិតិ EMIS ៖{' '}
              </span>
              <strong className="text-amber-300 font-black">
                {MOEYS_STATS_GUIDELINE_2026_2027_META.endDate}
              </strong>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-black border border-red-500/30">
                នៅសល់ {diffDays} ថ្ងៃទៀត!
              </span>
            </div>
          </div>

          <a
            href={MOEYS_STATS_GUIDELINE_2026_2027_META.systemUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-cyan-300 hover:text-cyan-100 font-bold flex items-center gap-1 bg-cyan-500/20 px-3 py-1.5 rounded-xl border border-cyan-400/40 transition active:scale-95"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>ចូលទៅប្រព័ន្ធ EMIS</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 3 Columns Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Guideline 427 */}
          <div className="bg-white/5 hover:bg-white/[0.08] rounded-2xl p-4 border border-amber-400/30 transition flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  លេខ ៤២៧ អយក.សណន
                </span>
                <span className="text-[10px] text-slate-400">១១ កញ្ញា ២០២៦</span>
              </div>
              <h4 className="font-moul text-xs sm:text-sm text-amber-200 leading-snug">
                ដំណើរការគ្រឹះស្ថានបឋមសិក្សា
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1 border-t border-white/10">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>បវេសនកាល ៖</strong> ០១ វិច្ឆិកា ២០២៦</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-300 font-bold">•</span>
                  <span><strong>វិស្សមកាលតូច ៖</strong> ១៦-១៩ មេសា ២០២៧</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-300 font-bold">•</span>
                  <span><strong>មហាវិស្សមកាល ៖</strong> ០១ កក្កដា ២០២៧</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-300 font-bold">•</span>
                  <span>ម៉ោងបង្រៀន ២៧-៣០ ម៉ោង/សប្តាហ៍</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenGuideline427}
              className="mt-3 w-full py-2 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold rounded-xl text-xs transition border border-amber-400/40 flex items-center justify-center gap-1 active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>មើលសេចក្តីណែនាំ ៤២៧</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Guideline 42 (Stats EMIS) */}
          <div className="bg-cyan-950/40 hover:bg-cyan-950/60 rounded-2xl p-4 border border-cyan-400/40 transition flex flex-col justify-between shadow-lg shadow-cyan-950/30">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>លេខ ៤២ (ថ្មី)</span>
                </span>
                <span className="text-[10px] text-cyan-300 font-semibold">១០ កញ្ញា ២០២៦</span>
              </div>
              <h4 className="font-moul text-xs sm:text-sm text-cyan-200 leading-snug">
                ការប្រមូលស្ថិតិអប់រំបឋម (EMIS)
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1 border-t border-cyan-500/20">
                <li className="flex items-start gap-1.5 text-red-300 font-semibold">
                  <span className="text-red-400 font-bold">⚠️</span>
                  <span><strong>ឱសានវាទ ៖</strong> មុនថ្ងៃ ២៥ កញ្ញា ២០២៦</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-300 font-bold">•</span>
                  <span>ស្រង់ ៧ តារាងស្ថិតិបឋមសិក្សា</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-300 font-bold">•</span>
                  <span>តុល្យភាព សិស្ស-ថ្នាក់-គ្រូ-បន្ទប់រៀន</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-300 font-bold">•</span>
                  <span>បញ្ចូលតាម entryemis.moeys.gov.kh</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenGuideline42}
              className="mt-3 w-full py-2 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black rounded-xl text-xs transition border border-cyan-200 flex items-center justify-center gap-1 active:scale-95 shadow-md"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>មើលសេចក្តីណែនាំ ៤២ (EMIS)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Sub-decree 198 (Holidays) */}
          <div className="bg-white/5 hover:bg-white/[0.08] rounded-2xl p-4 border border-rose-400/30 transition flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-400/20 text-rose-300 border border-rose-400/40">
                  អនុក្រឹត្យ ១៩៨
                </span>
                <span className="text-[10px] text-slate-400">១៦ កញ្ញា ២០២៦</span>
              </div>
              <h4 className="font-moul text-xs sm:text-sm text-rose-200 leading-snug">
                ប្រតិទិនឈប់សម្រាក ២០២៧
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1 border-t border-white/10">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>ឈប់សម្រាកសរុប ៖</strong> ២២ ថ្ងៃ (១៦ ពិធី)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-300 font-bold">•</span>
                  <span><strong>ចូលឆ្នាំខ្មែរ ៖</strong> ១៤-១៦ មេសា ២០២៧</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-300 font-bold">•</span>
                  <span><strong>ភ្ជុំបិណ្ឌ ៖</strong> ២៩-៣០ កញ្ញា, ០១ តុលា</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-300 font-bold">•</span>
                  <span><strong>បុណ្យអុំទូក ៖</strong> ១៣-១៥ វិច្ឆិកា ២០២៧</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenHolidays198}
              className="mt-3 w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-xl text-xs transition border border-rose-400/40 flex items-center justify-center gap-1 active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>មើលប្រតិទិន ២០២៧</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
