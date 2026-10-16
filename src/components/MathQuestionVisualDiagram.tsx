import React from 'react';
import {
  Layers,
  Calculator,
  Hash,
  Scale,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Check,
  MapPin,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { MathQCMQuestion } from '../data/mathLesson1Exam40Q';

interface MathQuestionVisualDiagramProps {
  question?: MathQCMQuestion;
  questionIndex?: number;
  lessonNumber?: number;
  diagramType?: any;
  diagramData?: any;
  [key: string]: any;
}

export const MathQuestionVisualDiagram: React.FC<MathQuestionVisualDiagramProps> = ({
  question,
  questionIndex = 0,
  lessonNumber = 1,
  diagramType,
  diagramData
}) => {
  const qId = question?.id || 1;

  // For lessons other than Lesson 1, show a tailored educational concept diagram card
  if (lessonNumber !== 1) {
    return (
      <div className="p-3.5 bg-gradient-to-br from-indigo-50/70 via-sky-50/40 to-slate-50 rounded-2xl border border-indigo-150/80 my-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-indigo-100/60">
          <div className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>គំនិតគន្លឹះ ៖ {question.partSubtitle || question.part}</span>
          </div>
          <span className="text-[10px] bg-indigo-100/80 text-indigo-800 font-bold px-2 py-0.5 rounded-md">
            សំណួរទី {questionIndex + 1}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-700 leading-relaxed font-medium">
          <div className="p-2.5 rounded-xl bg-white/80 border border-indigo-100 flex items-start gap-2 shadow-2xs">
            <span className="text-base leading-none">💡</span>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-indigo-900 block">ខ្លឹមសារសិក្សា និងគន្លឹះដោះស្រាយ ៖</span>
              <p className="text-[11px] text-slate-600 leading-normal">
                {question.part} ➔ {question.partSubtitle}។ សូមអានសំណួរ និងពិចារណាលើរូបមន្ត និងវិធានគណនាឱ្យបានច្បាស់លាស់មុននឹងជ្រើសរើសចម្លើយ។
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 1. PLACE VALUE TABLES (តារាងថ្នាក់ និងខ្ទង់)
  // =========================================================================
  if (qId === 1) {
    return (
      <div className="p-3.5 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-slate-50 rounded-2xl border border-indigo-200/80 my-2.5 overflow-x-auto shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-indigo-100">
          <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>តារាងថ្នាក់ និងខ្ទង់ ៖ ចំនួន 870 465 250</span>
          </div>
          <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-md">
            ៣ ថ្នាក់ • ៩ ខ្ទង់
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs min-w-[320px]">
          {/* Class Millions */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ថ្នាក់លាន</div>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">870</div>
          </div>

          {/* Class Thousands */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ថ្នាក់ពាន់</div>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">465</div>
          </div>

          {/* Class Units */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ថ្នាក់រាយ</div>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">250</div>
          </div>
        </div>
      </div>
    );
  }

  if (qId === 2) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 my-2.5 space-y-2">
        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-purple-600" />
          <span>ការបំប្លែងពាក្យអានទៅជាលេខ ៖ 506 300 402</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="text-[10px] text-purple-700 font-bold">ប្រាំរយប្រាំមួយលាន</div>
            <div className="text-sm font-black text-purple-950 font-mono mt-0.5">506</div>
          </div>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="text-[10px] text-blue-700 font-bold">បីរយពាន់</div>
            <div className="text-sm font-black text-blue-950 font-mono mt-0.5">300</div>
          </div>
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="text-[10px] text-emerald-700 font-bold">បួនរយពីរ</div>
            <div className="text-sm font-black text-emerald-950 font-mono mt-0.5">402</div>
          </div>
        </div>
      </div>
    );
  }

  if (qId === 3) {
    return (
      <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 my-2.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>«ពីរពាន់ប្រាំរយលាន» (2.5 Billions)</span>
          </span>
          <span className="bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded text-[10px]">
            ៨ លេខសូន្យខាងក្រោយ
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 font-mono text-sm sm:text-base font-black text-slate-800 bg-white p-2.5 rounded-xl border border-amber-200/80">
          <span className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">2</span>
          <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">500</span>
          <span className="text-slate-400">000</span>
          <span className="text-slate-400">000</span>
        </div>
        <p className="text-[10px] text-amber-800 text-center font-medium">
          = 2 500 × 1 000 000 = 2 500 000 000 (២ ពាន់លាន ៥០០ លាន)
        </p>
      </div>
    );
  }

  if (qId === 4) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 space-y-1.5">
        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-teal-600" />
          <span>ការអានចំនួន 40 005 060 តាមថ្នាក់</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-purple-50 border border-purple-200 rounded-xl">
            <span className="text-[10px] font-bold text-purple-700">ថ្នាក់លាន</span>
            <div className="text-sm font-black text-purple-900 font-mono">40</div>
            <span className="text-[9px] text-slate-600">សែសិបលាន</span>
          </div>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-[10px] font-bold text-blue-700">ថ្នាក់ពាន់</span>
            <div className="text-sm font-black text-blue-900 font-mono">005</div>
            <span className="text-[9px] text-slate-600">ប្រាំពាន់</span>
          </div>
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-[10px] font-bold text-emerald-700">ថ្នាក់រាយ</span>
            <div className="text-sm font-black text-emerald-900 font-mono">060</div>
            <span className="text-[9px] text-slate-600">ហុកសិប</span>
          </div>
        </div>
      </div>
    );
  }

  if (qId === 5) {
    return (
      <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200 my-2.5">
        <div className="text-[11px] font-bold text-purple-900 mb-2 flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5 text-purple-600" />
          <span>បំប្លែងខ្ទង់ ៖ ៧ លាន, ៩ សែន, ៣ ពាន់, ៥ រយ, ៨ រាយ</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-xs text-center">
          <div className="bg-white border border-purple-300 p-1.5 rounded-lg w-12">
            <div className="text-[9px] text-purple-600 font-bold">លាន</div>
            <div className="font-black text-purple-950">7</div>
          </div>
          <div className="bg-white border border-blue-300 p-1.5 rounded-lg w-12">
            <div className="text-[9px] text-blue-600 font-bold">សែន</div>
            <div className="font-black text-blue-950">9</div>
          </div>
          <div className="bg-amber-50 border border-amber-300 p-1.5 rounded-lg w-12">
            <div className="text-[9px] text-amber-600 font-bold">ម៉ឺន</div>
            <div className="font-black text-amber-950">0</div>
          </div>
          <div className="bg-white border border-teal-300 p-1.5 rounded-lg w-12">
            <div className="text-[9px] text-teal-600 font-bold">ពាន់</div>
            <div className="font-black text-teal-950">3</div>
          </div>
          <div className="bg-white border border-emerald-300 p-1.5 rounded-lg w-12">
            <div className="text-[9px] text-emerald-600 font-bold">រយ</div>
            <div className="font-black text-emerald-950">5</div>
          </div>
          <div className="bg-amber-50 border border-amber-300 p-1.5 rounded-lg w-12">
            <div className="text-[9px] text-amber-600 font-bold">ដប់</div>
            <div className="font-black text-amber-950">0</div>
          </div>
          <div className="bg-white border border-rose-300 p-1.5 rounded-lg w-12">
            <div className="text-[9px] text-rose-600 font-bold">រាយ</div>
            <div className="font-black text-rose-950">8</div>
          </div>
        </div>
        <div className="text-center font-mono font-bold text-sm text-purple-900 mt-2 bg-white/80 py-1 rounded-xl">
          ➔ ចំនួនគឺ ៖ 7 903 508
        </div>
      </div>
    );
  }

  if (qId === 6) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 text-center space-y-2">
        <div className="text-[11px] font-bold text-slate-700">
          ក្បួនដកឃ្លា ៣ ខ្ទង់ម្តងពីស្តាំទៅឆ្វេង (Groups of 3 Digits)
        </div>
        <div className="flex items-center justify-center gap-3 font-mono text-base font-black text-slate-800">
          <div className="p-2 bg-purple-100 text-purple-900 rounded-xl border border-purple-200">
            325 <span className="block text-[9px] font-sans font-normal text-purple-700">ថ្នាក់លាន</span>
          </div>
          <span className="text-slate-400 font-sans">•</span>
          <div className="p-2 bg-blue-100 text-blue-900 rounded-xl border border-blue-200">
            874 <span className="block text-[9px] font-sans font-normal text-blue-700">ថ្នាក់ពាន់</span>
          </div>
          <span className="text-slate-400 font-sans">•</span>
          <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-200">
            100 <span className="block text-[9px] font-sans font-normal text-emerald-700">ថ្នាក់រាយ</span>
          </div>
        </div>
      </div>
    );
  }

  if (qId === 7) {
    return (
      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 my-2.5 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-indigo-900">
          «មួយពាន់លាន» (One Billion) = 10⁹
        </div>
        <div className="inline-flex items-center gap-1 font-mono text-base font-black text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-indigo-200">
          <span className="text-purple-700">1</span>
          <span className="text-blue-600 bg-blue-50 px-1 rounded">000</span>
          <span className="text-teal-600 bg-teal-50 px-1 rounded">000</span>
          <span className="text-emerald-600 bg-emerald-50 px-1 rounded">000</span>
        </div>
        <div className="text-[10px] text-slate-500 font-bold">
          សរុបមានលេខសូន្យចំនួន <strong>៩ ខ្ទង់</strong>
        </div>
      </div>
    );
  }

  if (qId === 8) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-slate-700">«មួយរយម្ភៃលាន»</div>
        <div className="font-mono text-base font-black text-indigo-900 bg-indigo-50/70 p-2 rounded-xl border border-indigo-200 inline-block">
          120 000 000
        </div>
        <p className="text-[10px] text-slate-500 font-medium">120 នៅថ្នាក់លាន និង 000 000 នៅថ្នាក់ពាន់ និងរាយ</p>
      </div>
    );
  }

  // =========================================================================
  // 2. PLACE VALUE DIGIT HIGHLIGHTS (សំណួរ ៩ ដល់ ១៦)
  // =========================================================================
  if (qId === 9) {
    return (
      <div className="p-3.5 bg-purple-50/80 rounded-2xl border-2 border-purple-300 my-2.5 overflow-x-auto">
        <div className="text-[11px] font-bold text-purple-900 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>ពិនិត្យលេខ 7 ក្នុងចំនួន 870 465 250</span>
          </span>
          <span className="text-[10px] bg-purple-200 text-purple-900 font-black px-2 py-0.5 rounded-full">
            ខ្ទង់ដប់លាន
          </span>
        </div>
        <div className="flex items-center justify-center gap-1 font-mono text-center text-xs">
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg w-14">
            <span className="text-[9px] text-slate-500 block">រយលាន</span>
            <span className="text-base font-bold text-slate-700">8</span>
          </div>
          <div className="p-1.5 bg-purple-600 text-white border-2 border-purple-700 rounded-lg w-14 shadow-sm scale-105">
            <span className="text-[9px] text-purple-200 block font-bold">ដប់លាន</span>
            <span className="text-base font-black text-amber-300">7</span>
          </div>
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg w-14">
            <span className="text-[9px] text-slate-500 block">លាន</span>
            <span className="text-base font-bold text-slate-700">0</span>
          </div>
          <span className="text-slate-400 font-bold px-1">...</span>
          <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px]">
            465 250
          </div>
        </div>
        <div className="text-center font-bold text-xs text-purple-900 mt-2 bg-white/80 p-1.5 rounded-xl border border-purple-200">
          តម្លៃលេខ 7 = 7 × 10 000 000 = <strong className="text-purple-700 font-mono font-black">70 000 000</strong>
        </div>
      </div>
    );
  }

  if (qId === 10) {
    return (
      <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 my-2.5">
        <div className="text-[11px] font-bold text-blue-900 mb-1.5">
          ស្វែងរកលេខនៅ «ខ្ទង់សែន» នៃ 942 615 830 ៖
        </div>
        <div className="flex items-center justify-center gap-1 font-mono text-center text-xs">
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg">942</div>
          <div className="p-1.5 bg-blue-600 text-white rounded-lg font-black shadow-xs">
            <span className="text-[9px] block text-blue-200">សែន</span>
            6
          </div>
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg">15</div>
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg">830</div>
        </div>
        <p className="text-[10px] text-blue-800 text-center font-medium mt-1.5">
          លេខ 6 នៅខ្ទង់សែន មានតម្លៃ 600 000
        </p>
      </div>
    );
  }

  if (qId === 11) {
    return (
      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 my-2.5 space-y-2">
        <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-amber-600" />
          <span>ការប្រៀបធៀបតម្លៃលេខ 5 រវាងចំនួនពីរ ៖</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
          <div className="p-2 bg-white rounded-xl border border-amber-200">
            <div className="text-[10px] text-slate-500 font-sans">52 841 000 (ខ្ទង់ដប់លាន)</div>
            <div className="text-sm font-bold text-purple-900">50 000 000</div>
          </div>
          <div className="p-2 bg-white rounded-xl border border-amber-200">
            <div className="text-[10px] text-slate-500 font-sans">12 500 000 (ខ្ទង់សែន)</div>
            <div className="text-sm font-bold text-blue-900">500 000</div>
          </div>
        </div>
        <div className="text-center text-xs font-bold text-amber-950 bg-amber-200/60 py-1 rounded-xl">
          50 000 000 ÷ 500 000 = <span className="font-mono text-sm text-purple-900 font-black">100 ដង</span>
        </div>
      </div>
    );
  }

  if (qId === 12) {
    return (
      <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 my-2.5 text-center">
        <div className="text-[11px] font-bold text-blue-900 mb-1">
          ថ្នាក់ពាន់ នៃចំនួន 638 419 725 ៖
        </div>
        <div className="inline-flex items-center gap-2 font-mono text-sm font-bold">
          <span className="text-slate-400">638</span>
          <span className="p-1.5 bg-blue-600 text-white rounded-xl shadow-xs font-black scale-105">
            419
          </span>
          <span className="text-slate-400">725</span>
        </div>
        <p className="text-[10px] text-blue-700 font-medium mt-1">419 = បួនរយដប់ប្រាំបួនពាន់</p>
      </div>
    );
  }

  if (qId === 13) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 text-center">
        <div className="text-[11px] font-bold text-slate-700 mb-1">
          ក្នុងចំនួន 508 204 163 តម្លៃលេខ 8 ៖
        </div>
        <div className="font-mono text-base font-black text-purple-900 bg-purple-50 p-2 rounded-xl border border-purple-200 inline-block">
          8 000 000 (ប្រាំបីលាន)
        </div>
      </div>
    );
  }

  if (qId === 14) {
    return (
      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 my-2.5 text-center">
        <div className="text-[11px] font-bold text-emerald-900 mb-1">
          ខ្ទង់សែន (តម្លៃ 400 000) ៖
        </div>
        <div className="font-mono text-sm font-bold text-slate-800">
          15 <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-black">4</span>28 900
        </div>
      </div>
    );
  }

  if (qId === 15) {
    return (
      <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-200 my-2.5 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-indigo-900">
          រចនាសម្ព័ន្ធនៃ «មួយថ្នាក់» (1 Period / Class)
        </div>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto text-xs font-bold font-mono">
          <div className="p-2 bg-white border border-indigo-200 rounded-xl">រយ (100)</div>
          <div className="p-2 bg-white border border-indigo-200 rounded-xl">ដប់ (10)</div>
          <div className="p-2 bg-white border border-indigo-200 rounded-xl">រាយ (1)</div>
        </div>
        <p className="text-[10px] text-slate-500 font-medium">មួយថ្នាក់ៗមាន ៣ ខ្ទង់ជានិច្ច</p>
      </div>
    );
  }

  if (qId === 16) {
    return (
      <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200 my-2.5 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-purple-900">
          ចំនួន 909 090 909 (មានលេខ 9 ចំនួន ៥ តួ)
        </div>
        <div className="font-mono text-sm font-bold text-slate-800">
          <span className="p-1 bg-purple-600 text-white rounded font-black shadow-xs">9</span>09 090 909
        </div>
        <div className="text-xs font-bold text-purple-800 font-mono">
          លេខ 9 ឆ្វេងបំផុតនៅខ្ទង់រយលាន = 900 000 000
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. EXPANDED NOTATION & ABACUS (សំណួរ ១៧ ដល់ ២៤)
  // =========================================================================
  if (qId === 17) {
    return (
      <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 my-2.5 space-y-2">
        <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>ទម្រង់ពង្រាយនៃចំនួន 465 250 ៖</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 font-mono text-xs font-bold text-slate-800">
          <span className="bg-white border border-emerald-300 px-2 py-1 rounded-lg">400 000</span>
          <span>+</span>
          <span className="bg-white border border-emerald-300 px-2 py-1 rounded-lg">60 000</span>
          <span>+</span>
          <span className="bg-white border border-emerald-300 px-2 py-1 rounded-lg">5 000</span>
          <span>+</span>
          <span className="bg-white border border-emerald-300 px-2 py-1 rounded-lg">200</span>
          <span>+</span>
          <span className="bg-white border border-emerald-300 px-2 py-1 rounded-lg">50</span>
        </div>
      </div>
    );
  }

  if (qId === 18) {
    return (
      <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200 my-2.5 space-y-1.5">
        <div className="text-[11px] font-bold text-purple-900">
          បូកបញ្ចូលតម្លៃខ្ទង់ ➔ 870 465 250
        </div>
        <div className="text-[10px] text-slate-600 leading-relaxed font-mono">
          800 000 000 + 70 000 000 + 400 000 + 60 000 + 5 000 + 200 + 50
        </div>
      </div>
    );
  }

  if (qId === 19) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 text-center">
        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" /> គំនូសបំព្រួញកូនគិត (Spike Abacus) ៖ 3 024 103
        </div>
        <div className="flex justify-center items-end gap-2 sm:gap-3 py-2">
          {[
            { label: 'លាន', count: 3, color: 'bg-purple-500' },
            { label: 'សែន', count: 0, color: 'bg-indigo-500' },
            { label: 'ម៉ឺន', count: 2, color: 'bg-blue-500' },
            { label: 'ពាន់', count: 4, color: 'bg-teal-500' },
            { label: 'រយ', count: 1, color: 'bg-emerald-500' },
            { label: 'ដប់', count: 0, color: 'bg-amber-500' },
            { label: 'រាយ', count: 3, color: 'bg-rose-500' },
          ].map((col, cIdx) => (
            <div key={cIdx} className="flex flex-col items-center">
              <div className="w-1.5 h-16 bg-slate-300 rounded-full flex flex-col-reverse items-center justify-start pb-0.5 gap-0.5">
                {Array.from({ length: col.count }).map((_, bIdx) => (
                  <span key={bIdx} className={`w-3.5 h-2 rounded-full ${col.color} shadow-xs ring-1 ring-black/10`} />
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-800 mt-1 font-mono">{col.count}</span>
              <span className="text-[9px] text-slate-500 font-medium">{col.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (qId === 20) {
    return (
      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 my-2.5 text-center space-y-1">
        <div className="text-[11px] font-bold text-amber-900">
          ទម្រង់ពង្រាយដោយមិនគិតលេខ ០ ៖ 5 008 070
        </div>
        <div className="font-mono text-xs sm:text-sm font-bold text-slate-800">
          5 000 000 + 8 000 + 70
        </div>
      </div>
    );
  }

  if (qId === 21) {
    return (
      <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 my-2.5 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-blue-900">
          ទម្រង់ពង្រាយជាកត្តាគុណស្វ័យគុណ ១០ ៖
        </div>
        <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded-xl border border-blue-200">
          (6 × 10 000 000) + (4 × 100 000) + (9 × 1 000) + (2 × 10)
        </div>
        <div className="font-mono font-bold text-xs text-blue-950">
          = 60 409 020
        </div>
      </div>
    );
  }

  if (qId === 22) {
    return (
      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 my-2.5 text-center space-y-1">
        <div className="text-[11px] font-bold text-emerald-900">
          បង្គោលខ្ទង់សែន មាន ៧ គ្រាប់ក្បាច់
        </div>
        <div className="font-mono text-sm font-bold text-emerald-950">
          7 × 100 000 = 700 000
        </div>
      </div>
    );
  }

  if (qId === 23) {
    return (
      <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 my-2.5 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-purple-900">
          ស្វែងរកតួលេខបំពេញប្រអប់ ៖
        </div>
        <div className="font-mono text-xs text-slate-800">
          9 000 000 + 800 000 + <span className="bg-amber-300 text-slate-950 px-2 py-0.5 rounded font-black">4 000</span> + 50 = 9 804 050
        </div>
      </div>
    );
  }

  if (qId === 24) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 text-center space-y-1">
        <div className="text-[11px] font-bold text-slate-700">
          ផ្គុំទម្រង់ពង្រាយ ៖ 30 000 000 + 5 000 000 + 20 000 + 700 + 4
        </div>
        <div className="font-mono text-sm font-bold text-indigo-900">
          = 35 020 704
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. COMPARISON & ORDERING (សំណួរ ២៥ ដល់ ៣២)
  // =========================================================================
  if (qId === 25) {
    return (
      <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 my-2.5 space-y-2">
        <div className="text-[11px] font-bold text-amber-900 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>ប្រៀបធៀបខ្ទង់ពីឆ្វេងទៅស្តាំ ៖</span>
          </span>
          <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded">
            ខុសគ្នានៅខ្ទង់ពាន់
          </span>
        </div>
        <div className="flex items-center justify-center gap-3 font-mono text-sm sm:text-base font-bold">
          <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-700">
            3 25<span className="text-rose-600 font-black underline">6</span> 401
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
            &lt;
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-700">
            3 25<span className="text-emerald-600 font-black underline">7</span> 250
          </div>
        </div>
        <p className="text-[10px] text-center text-amber-800 font-medium">
          ដោយសារ 6 &lt; 7 ➔ 3 256 401 &lt; 3 257 250
        </p>
      </div>
    );
  }

  if (qId === 26) {
    return (
      <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 my-2.5 text-center space-y-2">
        <div className="text-[11px] font-bold text-emerald-900 flex items-center justify-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>លំដាប់កើន (ពីតូចទៅធំ ៖ A &lt; B &lt; C &lt; D)</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[11px] font-bold text-slate-800">
          <span className="p-1 bg-white border border-emerald-200 rounded">1 250 300</span>
          <span className="text-emerald-600">&lt;</span>
          <span className="p-1 bg-white border border-emerald-200 rounded">1 254 000</span>
          <span className="text-emerald-600">&lt;</span>
          <span className="p-1 bg-white border border-emerald-200 rounded">1 254 800</span>
          <span className="text-emerald-600">&lt;</span>
          <span className="p-1 bg-emerald-600 text-white rounded">2 000 100</span>
        </div>
      </div>
    );
  }

  if (qId === 27) {
    return (
      <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200 my-2.5 text-center space-y-2">
        <div className="text-[11px] font-bold text-rose-900 flex items-center justify-center gap-1">
          <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
          <span>លំដាប់ចុះ (ពីធំទៅតូច ៖ A &gt; B &gt; C &gt; D)</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[11px] font-bold text-slate-800">
          <span className="p-1 bg-rose-600 text-white rounded">95 400 000</span>
          <span className="text-rose-600">&gt;</span>
          <span className="p-1 bg-white border border-rose-200 rounded">95 040 000</span>
          <span className="text-rose-600">&gt;</span>
          <span className="p-1 bg-white border border-rose-200 rounded">94 500 000</span>
          <span className="text-rose-600">&gt;</span>
          <span className="p-1 bg-white border border-rose-200 rounded">9 540 000</span>
        </div>
      </div>
    );
  }

  if (qId === 28) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 space-y-1.5 text-center">
        <div className="text-[11px] font-bold text-slate-700">ស្វែងរកចំនួនធំជាងគេបំផុត ៖</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-xs">
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg">45 612 000</div>
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg">45 621 000</div>
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg">45 162 000</div>
          <div className="p-1.5 bg-amber-400 text-slate-950 font-black rounded-lg shadow-xs border border-amber-500">
            ★ 45 621 500
          </div>
        </div>
      </div>
    );
  }

  if (qId === 29) {
    return (
      <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 my-2.5 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-indigo-900">វិសមភាព ៖ 58□ 240 &gt; 586 240</div>
        <div className="font-mono text-sm font-bold text-slate-800">
          ខ្ទង់ពាន់ ៖ □ &gt; 6 ➔ □ = <span className="bg-purple-600 text-white px-2 py-0.5 rounded font-black">7</span>
        </div>
      </div>
    );
  }

  if (qId === 30) {
    return (
      <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 my-2.5 text-center space-y-1">
        <div className="text-[11px] font-bold text-rose-900">ពិនិត្យចំនួនខ្ទង់ ៖</div>
        <div className="font-mono text-xs font-bold text-slate-800">
          12 500 000 (៨ ខ្ទង់) &lt; 125 000 000 (៩ ខ្ទង់)
        </div>
        <p className="text-[10px] text-rose-700">សញ្ញា &gt; ជាការខុសឆ្គង</p>
      </div>
    );
  }

  if (qId === 31) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-slate-700">បង្កើតចំនួនតូចបំផុតពីលេខ 0, 1, 2, 3, 4, 5, 6 ៖</div>
        <div className="font-mono text-sm font-black text-emerald-700 bg-white p-2 rounded-xl border border-emerald-300 inline-block">
          1 023 456
        </div>
        <p className="text-[10px] text-slate-500 font-medium">លេខ 0 មិនអាចនៅខ្ទង់ដំបូង ដូច្នេះលេខ 1 នៅមុខគេ</p>
      </div>
    );
  }

  if (qId === 32) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-slate-700">បង្កើតចំនួនធំបំផុតពីលេខ 9, 3, 7, 0, 5, 8 ៖</div>
        <div className="font-mono text-sm font-black text-purple-900 bg-white p-2 rounded-xl border border-purple-300 inline-block">
          987 530
        </div>
        <p className="text-[10px] text-slate-500 font-medium">រៀបពីធំទៅតូចពីឆ្វេងទៅស្តាំ ៖ 9, 8, 7, 5, 3, 0</p>
      </div>
    );
  }

  // =========================================================================
  // 5. ROUNDING & REAL-WORLD MATH (សំណួរ ៣៣ ដល់ ៤០)
  // =========================================================================
  if (qId === 33) {
    return (
      <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 my-2.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-amber-950">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>បង្គត់ 2 782 150 ត្រឹម «ខ្ទង់លាន»</span>
          </span>
          <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-black text-[10px]">
            7 ≥ 5 ➔ បង្គត់ឡើង
          </span>
        </div>

        {/* Number line representation */}
        <div className="relative pt-6 pb-2 px-4">
          <div className="w-full h-2 bg-slate-300 rounded-full relative">
            {/* Midpoint marker */}
            <div className="absolute left-1/2 -top-1 w-1 h-4 bg-slate-500 rounded" />
            <span className="absolute left-1/2 -top-5 -translate-x-1/2 text-[9px] font-bold text-slate-500">
              2 500 000 (កណ្តាល)
            </span>

            {/* Position of 2 782 150 */}
            <div className="absolute left-[78%] -top-2.5 w-5 h-5 bg-rose-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
            <span className="absolute left-[78%] -top-7 -translate-x-1/2 text-[9px] font-black text-rose-700 bg-white px-1.5 py-0.5 rounded border border-rose-300 shadow-xs whitespace-nowrap">
              2 782 150
            </span>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-700 mt-2">
            <span>2 000 000</span>
            <span className="text-emerald-700 font-black bg-emerald-100 px-2 py-0.5 rounded">
              ➜ 3 000 000
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (qId === 34) {
    return (
      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 my-2.5 text-center space-y-1">
        <div className="text-[11px] font-bold text-amber-900">
          បង្គត់ 2 782 150 ត្រឹម «ខ្ទង់សែន» (លេខ 7) ៖
        </div>
        <div className="font-mono text-xs sm:text-sm font-bold text-slate-800">
          ខ្ទង់បន្ទាប់គឺ 8 (8 ≥ 5) ➔ 7 ក្លាយជា 8 ➔ <span className="font-black text-purple-900 bg-white px-2 py-0.5 rounded border border-amber-300">2 800 000</span>
        </div>
      </div>
    );
  }

  if (qId === 35) {
    return (
      <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 my-2.5 text-center space-y-1">
        <div className="text-[11px] font-bold text-teal-900">
          បង្គត់ 5 623 501 ត្រឹម «ខ្ទង់ម៉ឺន» (លេខ 2) ៖
        </div>
        <div className="font-mono text-xs sm:text-sm font-bold text-slate-800">
          ខ្ទង់បន្ទាប់គឺ 3 (3 &lt; 5) ➔ បង្គត់ចុះ ➔ <span className="font-black text-teal-900 bg-white px-2 py-0.5 rounded border border-teal-300">5 620 000</span>
        </div>
      </div>
    );
  }

  if (qId === 36) {
    return (
      <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 my-2.5 text-center space-y-1">
        <div className="text-[11px] font-bold text-purple-900">
          បង្គត់ 14 985 400 ត្រឹម «ខ្ទង់លាន» (14) ៖
        </div>
        <div className="font-mono text-xs sm:text-sm font-bold text-slate-800">
          ខ្ទង់សែនគឺ 9 (9 ≥ 5) ➔ 14 + 1 = <span className="font-black text-purple-950 bg-white px-2 py-0.5 rounded border border-purple-300">15 000 000</span>
        </div>
      </div>
    );
  }

  if (qId === 37) {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-slate-700">
          តើចំនួនណាបង្គត់ត្រឹមខ្ទង់ពាន់បាន 45 000?
        </div>
        <div className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 p-1.5 rounded-xl border border-emerald-300 inline-block">
          44 850 (8 ≥ 5 ➔ ឡើង 45 000)
        </div>
      </div>
    );
  }

  if (qId === 38) {
    return (
      <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 my-2.5 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-blue-900">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>ចំណោទសៀវភៅពុម្ពក្រសួងអប់រំ ៖ 3 487 260 ក្បាល</span>
        </div>
        <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-blue-100">
          <span className="text-slate-600">បង្គត់ត្រឹមខ្ទង់សែន ៖</span>
          <span className="font-mono text-sm font-black text-blue-900">
            3 500 000 ក្បាល
          </span>
        </div>
      </div>
    );
  }

  if (qId === 39) {
    return (
      <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl border border-emerald-200 my-2.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>ស្ថិតិប្រជាជន ៖ 16 718 965 នាក់</span>
          </span>
          <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-black">
            បង្គត់ត្រឹមខ្ទង់លាន
          </span>
        </div>
        <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-emerald-100">
          <span className="text-slate-600">ប្រជាជនប៉ាន់ស្មាន ៖</span>
          <span className="font-mono text-sm font-black text-emerald-800">
            17 000 000 នាក់
          </span>
        </div>
      </div>
    );
  }

  if (qId === 40) {
    return (
      <div className="p-3.5 bg-gradient-to-r from-amber-50 via-purple-50 to-indigo-50 rounded-2xl border border-purple-200 my-2.5 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-purple-950">
          <Award className="w-4 h-4 text-amber-500" />
          <span>អត្ថប្រយោជន៍ជាក់ស្តែងនៃការបង្គត់ចំនួនក្នុងជីវិត</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2 bg-white rounded-xl border border-purple-100">
            <span className="text-[10px] text-purple-700 font-bold block">💡 គិតរហ័ស</span>
            <span className="text-[10px] text-slate-600">ប៉ាន់ស្មានចំណាយទិញទំនិញ</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-purple-100">
            <span className="text-[10px] text-indigo-700 font-bold block">📊 ងាយស្រួលចងចាំ</span>
            <span className="text-[10px] text-slate-600">ទិន្នន័យស្ថិតិ និងថវិកាធំៗ</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback default diagram if needed
  return (
    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-2.5 flex items-center gap-2 text-xs text-slate-600">
      <Info className="w-4 h-4 text-indigo-600 shrink-0" />
      <span>គំនូសតាង និងគំរូគណិតវិទ្យាសម្រាប់សំណួរទី {questionIndex + 1}</span>
    </div>
  );
};
