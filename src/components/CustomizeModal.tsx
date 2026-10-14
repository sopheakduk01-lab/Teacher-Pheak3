import React, { useState } from 'react';
import { X, Check, ZoomIn, Sparkles, Palette, Type, BookOpen, Layers, Sliders, RefreshCw, Wand2, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BANNER_THEMES, BannerThemeId, getSavedBannerTheme, saveBannerTheme } from '../utils/bannerThemes';
import { ThemeAnimatedDecorations } from './ThemeAnimatedDecorations';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontFamily: string;
  onFontChange: (font: string) => void;
  backgroundTheme: string;
  onThemeChange: (theme: string) => void;
  fontSizeScale: string;
  onFontSizeChange: (scale: string) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  fontFamily,
  onFontChange,
  backgroundTheme,
  onThemeChange,
  fontSizeScale,
  onFontSizeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'banners' | 'notebook' | 'fonts' | 'sizes' | 'presets'>('all');
  const [currentBannerTheme, setCurrentBannerTheme] = useState<BannerThemeId>(() => getSavedBannerTheme());

  const handleSelectBannerTheme = (id: BannerThemeId) => {
    setCurrentBannerTheme(id);
    saveBannerTheme(id);
  };

  if (!isOpen) return null;

  // Full selection of authentic Khmer typography
  const fontOptions = [
    { id: 'Battambang', name: 'អក្សរ បាត់ដំបង (Battambang)', desc: 'ស្ដង់ដារសៀវភៅសិក្សា ស្រទន់ ច្បាស់ ស្រួលអានបំផុត', category: 'textbook' },
    { id: 'Kantumruy Pro', name: 'អក្សរ កន្ទុំរុយ ប្រូ (Kantumruy Pro)', desc: 'រចនាបទទំនើប ស្រស់ស្អាត ទាក់ទាញភ្នែក', category: 'modern' },
    { id: 'Noto Sans Khmer', name: 'អក្សរ ញូសាន់ស (Noto Sans Khmer)', desc: 'ច្បាស់ដាច់ៗ ស្តង់ដារអន្តរជាតិ Google', category: 'standard' },
    { id: 'Siemreap', name: 'អក្សរ សៀមរាប (Siemreap)', desc: 'រចនាបទខ្មែរបុរាណ ស្រទន់ សោមនស្ស', category: 'classic' },
    { id: 'Content', name: 'អក្សរ ខនថិន (Content / កូនខ្មែរ)', desc: 'ពុម្ពអក្សរសៀវភៅពុម្ព និងឯកសាររដ្ឋបាលក្រសួង', category: 'textbook' },
    { id: 'Hanuman', name: 'អក្សរ ហនុមាន (Hanuman Serif)', desc: 'ពុម្ពអក្សរមានក្បាល បែបកាសែត និងសៀវភៅប្រវត្តិសាស្ត្រ', category: 'classic' },
    { id: 'Preahvihear', name: 'អក្សរ ព្រះវិហារ (Preahvihear)', desc: 'រចនាបទក្បាច់រចនាប្រណិត ស្រស់ឆើតឆាយ', category: 'artistic' },
    { id: 'Suwannaphum', name: 'អក្សរ សុវណ្ណភូមិ (Suwannaphum)', desc: 'អក្សរក្បាលមូលស្រស់ស្អាត ស័ក្តិសមសម្រាប់បឋមសិក្សា', category: 'textbook' },
    { id: 'Dangrek', name: 'អក្សរ ដងរែក (Dangrek Round)', desc: 'អក្សររាងមូលរួញ គួរឱ្យស្រឡាញ់ និងស្រួលទស្សនា', category: 'artistic' },
    { id: 'Koulen', name: 'អក្សរ កូលេន (Koulen Display)', desc: 'អក្សរធំក្រាស់ច្បាស់ សម្រាប់ចំណងជើង និងប៉ាណូ', category: 'display' },
    { id: 'Bayon', name: 'អក្សរ បាយ័ន (Bayon Stone)', desc: 'រចនាបទប្រាសាទបុរាណសិលាចារឹកខ្មែរ', category: 'display' },
    { id: 'Bokor', name: 'អក្សរ បូកគោ (Bokor Vintage)', desc: 'រចនាបទបុរាណបែបសម័យសង្គមរាស្ត្រនិយម', category: 'artistic' },
    { id: 'Moul', name: 'អក្សរ មូល (Moul Official)', desc: 'អក្សរមូលផ្លូវការសម្រាប់ក្បាលលិខិត និងចំណងជើងធំ', category: 'display' },
  ];

  // Notebook Grids & Theme Backgrounds
  const notebookThemes = [
    {
      id: 'notebook-grid',
      name: 'ក្រឡាក្រដាសសៀវភៅគណិត (Math Grid)',
      desc: 'ក្រឡាការ៉ូ ៥មម បន្ទាត់ខៀវស្រាល + បន្ទាត់គែមក្រហមសរសេរ',
      badge: 'ពេញនិយម',
      icon: '📐',
    },
    {
      id: 'notebook-lines',
      name: 'ក្រដាសសរសេរបន្ទាត់កត់ត្រា (Ruled Lined)',
      desc: 'បន្ទាត់ផ្តេកខៀវស្តង់ដារ + បន្ទាត់គែមក្រហមសៀវភៅកត់',
      badge: 'សៀវភៅសិស្ស',
      icon: '📝',
    },
    {
      id: 'notebook-seyes',
      name: 'ក្រដាសសរសេរអក្សរផ្ចង់កុមារ (Seyès Grid)',
      desc: 'ក្រឡាសៀវភៅអក្សរផ្ចង់បឋមសិក្សា មានបន្ទាត់ធំនិងបន្ទាត់រង',
      badge: 'អក្សរផ្ចង់',
      icon: '✍️',
    },
    {
      id: 'notebook-dots',
      name: 'ក្រដាសសៀវភៅក្រឡាចុច (Dot Grid)',
      desc: 'ក្រឡាចុច Bullet Journal ស្អាតបរិសុទ្ធ ទំនើប និងស្រួលរៀបចំ',
      badge: 'ទំនើប',
      icon: '🎯',
    },
    {
      id: 'parchment',
      name: 'ក្រដាសស្លឹករឹតពណ៌មាសបុរាណ (Golden Parchment)',
      desc: 'ក្រដាសបុរាណពណ៌មាសស្រទន់ បែបសាស្ត្រាស្លឹករឹតខ្មែរ',
      badge: 'បុរាណ',
      icon: '📜',
    },
  ];

  const colorThemes = [
    { id: 'default', name: 'ផ្ទៃស្រទន់ថ្នាក់រៀន (Classroom Soft)', desc: 'ពណ៌លឿងស្រាល និងខៀវខ្ចី ស្រទន់ភ្នែកស្រួលអាន', icon: '🏫' },
    { id: 'blackboard', name: 'ក្តារខៀនបុរាណ (Classic Blackboard)', desc: 'ពណ៌បៃតងដុះស្លែក្តារខៀនបន្ទប់រៀនខ្មែរ', icon: '📋' },
    { id: 'mint', name: 'ជីរអង្កាមស្រស់ (Fresh Mint Pastel)', desc: 'ពណ៌បៃតងខ្ចីស្រទន់ ជំនួយដល់ការចងចាំ និងសុខភាពភ្នែក', icon: '🌱' },
    { id: 'lavender', name: 'ស្វាយផ្កាត្រកួន (Pastel Lavender)', desc: 'ស្វាយផ្កាត្រកួនស្រាល ផ្ដល់ភាពស្ងប់ស្ងាត់ និងសោភ័ណភាព', icon: '🪻' },
    { id: 'pink', name: 'ផ្កាឈូកកុមារភាព (Lotus Pink)', desc: 'ពណ៌ផ្កាឈូកស្រទន់ បែបកុមារភាពស្រស់ថ្លា', icon: '🪷' },
    { id: 'blue', name: 'ខៀវសមុទ្រស្រទន់ (Calm Ocean Blue)', desc: 'ផ្ដល់អារម្មណ៍ស្ងប់ ជួយឲ្យផ្ចង់ស្មារតីបានយូរ', icon: '🌊' },
    { id: 'emerald', name: 'ព្រៃធម្មជាតិបៃតង (Emerald Forest)', desc: 'ពណ៌បៃតងស្រងាត់ ផ្ដល់ភាពស្រស់ស្រាយពេញមួយថ្ងៃ', icon: '🌲' },
    { id: 'royal', name: 'មាស និងស្វាយរាជវង្ស (Royal Angkor)', desc: 'រចនាបទអប្សរា មាស និងស្វាយរាជវង្សប្រណិត', icon: '👑' },
    { id: 'sunset', name: 'ថ្ងៃលិចមាស (Golden Sunset)', desc: 'ពណ៌មាសលាយទឹកក្រូចទន់ៗ ស្រស់ស្អាតបែបធម្មជាតិ', icon: '🌅' },
    { id: 'cosmic', name: 'អវកាសរាត្រី (Cosmic Midnight Dark)', desc: 'ផ្ទៃងងឹតស្រទន់សម្រាប់អានពេលយប់ មិនចាំងភ្នែក', icon: '🌌' },
  ];

  const sizeOptions = [
    { id: 'sm', label: 'តូច', px: '14px', desc: 'បង្រួមតូច ផ្ទុកព័ត៌មានច្រើន' },
    { id: 'base', label: 'ធម្មតា', px: '16px', desc: 'ស្តង់ដារសមស្របគ្រប់អេក្រង់' },
    { id: 'lg', label: 'មធ្យម', px: '17px', desc: 'ធំល្មម ច្បាស់ងាយស្រួលមើល' },
    { id: 'xl', label: 'ធំច្បាស់', px: '18px', desc: 'អក្សរធំ ស្រួលអានមិនឈឺភ្នែក' },
    { id: '2xl', label: 'ធំបំផុត', px: '20px', desc: 'ធំបំផុត សម្រាប់បង្ហាញច្បាស់' },
  ];

  // 1-Click Complete Style Combos
  const presetCombos = [
    {
      name: 'សៀវភៅគណិតវិទ្យា',
      theme: 'notebook-grid',
      font: 'Battambang',
      size: 'base',
      desc: 'ក្រឡាក្រដាសសៀវភៅ ៥មម + អក្សរបាត់ដំបង',
      icon: '📐',
    },
    {
      name: 'អក្សរផ្ចង់កុមារ',
      theme: 'notebook-seyes',
      font: 'Kantumruy Pro',
      size: 'lg',
      desc: 'ក្រដាស Seyès បឋមសិក្សា + អក្សរកន្ទុំរុយ ប្រូ',
      icon: '✍️',
    },
    {
      name: 'ក្តារខៀនបន្ទប់រៀន',
      theme: 'blackboard',
      font: 'Preahvihear',
      size: 'lg',
      desc: 'ក្តារខៀនបៃតងដុះស្លែ + អក្សរព្រះវិហារច្បាស់',
      icon: '📋',
    },
    {
      name: 'សាស្ត្រាស្លឹករឹតបុរាណ',
      theme: 'parchment',
      font: 'Hanuman',
      size: 'base',
      desc: 'ក្រដាសមាសបុរាណ + អក្សរហនុមានមានក្បាល',
      icon: '📜',
    },
    {
      name: 'រដ្ឋបាលក្រសួងផ្លូវការ',
      theme: 'default',
      font: 'Content',
      size: 'base',
      desc: 'ផ្ទៃសស្អាតស្រទន់ + អក្សរខនថិនផ្លូវការ',
      icon: '🏛️',
    },
    {
      name: 'អានពេលរាត្រី (Dark)',
      theme: 'cosmic',
      font: 'Noto Sans Khmer',
      size: 'lg',
      desc: 'ផ្ទៃងងឹតការពារភ្នែក + អក្សរ Noto Sans',
      icon: '🌙',
    },
  ];

  const getThemePreviewBg = (themeId: string) => {
    switch (themeId) {
      case 'notebook-grid':
      case 'grid':
        return 'theme-notebook-grid text-slate-900 border-blue-300/80 shadow-md';
      case 'notebook-lines':
        return 'theme-notebook-lines text-slate-900 border-blue-300/80 shadow-md';
      case 'notebook-seyes':
        return 'theme-notebook-seyes text-slate-900 border-indigo-300/80 shadow-md';
      case 'notebook-dots':
        return 'theme-notebook-dots text-slate-900 border-slate-300 shadow-md';
      case 'parchment':
        return 'theme-parchment text-amber-950 border-amber-300 shadow-md';
      case 'blackboard':
        return 'theme-chalkboard text-emerald-100 border-emerald-600/50 shadow-md';
      case 'mint':
        return 'bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 text-teal-950 border-teal-200';
      case 'lavender':
        return 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 text-purple-950 border-purple-200';
      case 'royal':
        return 'bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-amber-200 border-amber-500/40';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-emerald-100 border-emerald-500/30';
      case 'sunset':
        return 'bg-gradient-to-br from-amber-900 via-orange-950 to-rose-950 text-amber-100 border-amber-500/30';
      case 'blue':
        return 'bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-blue-100 border-blue-500/30';
      case 'pink':
        return 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 text-slate-900 border-pink-200';
      case 'cosmic':
        return 'bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-purple-200 border-purple-500/30';
      default:
        return 'bg-gradient-to-br from-amber-50/70 via-purple-50/40 to-blue-50/50 text-slate-900 border-amber-200/80';
    }
  };

  const applyPreset = (preset: typeof presetCombos[0]) => {
    onThemeChange(preset.theme);
    onFontChange(preset.font);
    onFontSizeChange(preset.size);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs no-print overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[32px] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 my-auto overflow-hidden text-slate-800"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-amber-50/50 via-purple-50/30 to-blue-50/40 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>កែសម្រួលទម្រង់អក្សរ & ផ្ទៃក្រោយ</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300/80">
                    សៀវភៅ & ពណ៌
                  </span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  ជ្រើសរើសពុម្ពអក្សរ ផ្ទៃក្រឡាក្រដាសសៀវភៅ ពណ៌ និងទំហំដែលលោកអ្នកស្រឡាញ់
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-500 border border-slate-200/80 transition active:scale-95 shrink-0"
              aria-label="បិទ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Filter Tabs */}
          <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-slate-100 bg-slate-50/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ទាំងអស់</span>
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'banners'
                  ? 'bg-purple-950 text-amber-300 shadow-xs ring-1 ring-amber-400/40'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-purple-700" />
              <span>🎨 ម៉ូដផ្ទាំងរដ្ឋបាល (៥ គំរូ)</span>
            </button>
            <button
              onClick={() => setActiveTab('notebook')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'notebook'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600 group-hover:text-amber-700" />
              <span>📖 ផ្ទៃក្រឡាសៀវភៅ & ពណ៌</span>
            </button>
            <button
              onClick={() => setActiveTab('fonts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'fonts'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>✍️ ពុម្ពអក្សរខ្មែរ ({fontOptions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'presets'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>⚡ ម៉ូដរចនារហ័ស</span>
            </button>
            <button
              onClick={() => setActiveTab('sizes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'sizes'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>🔍 ទំហំអក្សរ</span>
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* Live Interactive Preview Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>គំរូសាកល្បងមើលការផ្លាស់ប្តូរផ្ទាល់ (Live Preview)</span>
                </span>
                <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[11px] font-bold">
                  ពុម្ព: {fontFamily} | ទំហំ: {fontSizeScale}
                </span>
              </div>
              <div
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${getThemePreviewBg(
                  backgroundTheme
                )}`}
                style={{ fontFamily }}
              >
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-current/15 pb-2">
                    <span className="font-extrabold text-sm sm:text-base">
                      📚 ភាសាខ្មែរ & គណិតវិទ្យា ថ្នាក់បឋមសិក្សា
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-80 border border-current/20 px-2 py-0.5 rounded-md">
                      ក្រសួងអប់រំ យុវជន និងកីឡា
                    </span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base">
                    មេរៀនទី ១៖ ការអានអត្ថបទ និងការគិតលេខបូកដកគុណចែក
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                    «ចំណេះវិជ្ជាជាទ្រព្យជាប់ប្រាណ ប្រសិនបើព្យាយាមសិក្សារៀនសូត្រ នោះនឹងទទួលបានលទ្ធផលគាប់ប្រសើរជាពុំខាន!»
                    ការប្រើប្រាស់ផ្ទៃក្រឡាក្រដាសសៀវភៅ និងពុម្ពអក្សរស្រទន់ ជួយឱ្យលោកគ្រូ អ្នកគ្រូ និងសិស្សានុសិស្សមានអារម្មណ៍រីករាយក្នុងការបង្រៀន និងរៀន។
                  </p>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Style Combos */}
            {(activeTab === 'all' || activeTab === 'presets') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-emerald-600" />
                    <span>⚡ ម៉ូដរចនារហ័សពេញនិយម (1-Click Style Presets)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">ចុច ១ ទទួលបានស្ទីលទាំងមូលភ្លាមៗ</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {presetCombos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 text-left transition flex items-start gap-3 group active:scale-95 shadow-2xs"
                    >
                      <span className="text-2xl p-2 rounded-xl bg-slate-100 group-hover:bg-white transition shrink-0">
                        {p.icon}
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-black text-slate-900 group-hover:text-emerald-900 transition truncate">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                          {p.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5 Admin Banner Theme Templates */}
            {(activeTab === 'all' || activeTab === 'banners') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-700" />
                    <span>ម៉ូដផ្ទាំងរដ្ឋបាល & បដាប្រចាំឆ្នាំ (Admin Banner Themes - ៥ គំរូ)</span>
                  </h3>
                  <span className="text-[11px] text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    ៥ គំរូផ្លូវការ
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(BANNER_THEMES).map((theme) => {
                    const isSelected = currentBannerTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleSelectBannerTheme(theme.id)}
                        className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 border relative overflow-hidden group cursor-pointer flex flex-col gap-2 ${
                          isSelected
                            ? 'border-purple-600 ring-2 ring-purple-500/40 bg-purple-50/50 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-full h-12 rounded-xl bg-gradient-to-r ${theme.previewGradient} p-2 flex items-center justify-between text-white border border-white/10 shadow-inner relative overflow-hidden`}>
                          <ThemeAnimatedDecorations themeId={theme.id} variant="compact" />
                          <div className="flex items-center gap-2 relative z-10">
                            <span className="text-base">{theme.icon}</span>
                            <span className="text-xs font-black text-white drop-shadow-xs">
                              {theme.nameKh}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 relative z-10">
                            <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                              {theme.name}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 px-1">
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {theme.subtitle}
                          </p>
                          {isSelected && (
                            <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md shrink-0">
                              កំពុងប្រើ
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notebook Paper Grid Patterns */}
            {(activeTab === 'all' || activeTab === 'notebook') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>១. ផ្ទៃក្រោយក្រឡាក្រដាសសៀវភៅសិស្ស (Notebook Paper Grids)</span>
                  </h3>
                  <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    ពិសេសសម្រាប់គ្រូបឋម
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {notebookThemes.map((t) => {
                    const isSelected = backgroundTheme === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => onThemeChange(t.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/50'
                            : 'border-slate-200/90 hover:border-amber-300 hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-amber-100/70 shrink-0">
                            {t.icon}
                          </span>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-xs font-black text-slate-900">{t.name}</p>
                              {t.badge && (
                                <span className="text-[9px] font-bold bg-amber-200/80 text-amber-950 px-1.5 py-0.2 rounded-md">
                                  {t.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{t.desc}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors & Environmental Themes */}
            {(activeTab === 'all' || activeTab === 'notebook') && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-600" />
                  <span>២. ពណ៌ និងផ្ទៃទូទៅ (Classroom Colors & Ambient Themes)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {colorThemes.map((t) => {
                    const isSelected = backgroundTheme === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => onThemeChange(t.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/70 shadow-md ring-2 ring-purple-400/40'
                            : 'border-slate-200/80 hover:border-purple-200 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl p-1.5 rounded-xl bg-slate-100 shrink-0">
                            {t.icon}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{t.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{t.desc}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Khmer Typography Selection */}
            {(activeTab === 'all' || activeTab === 'fonts') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Type className="w-4 h-4 text-indigo-600" />
                    <span>៣. ជ្រើសរើសប្រភេទពុម្ពអក្សរខ្មែរ (Khmer Typography)</span>
                  </h3>
                  <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    {fontOptions.length} ពុម្ពអក្សរ
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {fontOptions.map((f) => {
                    const isSelected = fontFamily === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => onFontChange(f.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-400/40'
                            : 'border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50 bg-white'
                        }`}
                        style={{ fontFamily: f.id }}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{f.name}</p>
                          <p className="text-[10px] text-slate-500 truncate" style={{ fontFamily: 'Kantumruy Pro, sans-serif' }}>
                            {f.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Font Size & Zoom Scale */}
            {(activeTab === 'all' || activeTab === 'sizes') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <ZoomIn className="w-4 h-4 text-purple-600" />
                    <span>៤. ទំហំពុម្ពអក្សរ & កម្រិតពង្រីក (Font Size Scale)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-bold">បច្ចុប្បន្ន: {fontSizeScale}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {sizeOptions.map((s) => {
                    const isSelected = fontSizeScale === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onFontSizeChange(s.id)}
                        className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 font-black shadow-md ring-2 ring-amber-400/40'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/80 font-bold'
                        }`}
                      >
                        <span className="text-sm">{s.label}</span>
                        <span className="text-[10px] opacity-75 font-mono">{s.px}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer with Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                onFontChange('Battambang');
                onThemeChange('default');
                onFontSizeChange('base');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-600 text-xs font-bold border border-slate-200/80 transition flex items-center gap-1.5 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>កំណត់ដើមវិញ (Reset)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs shadow-lg shadow-purple-900/25 transition active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>រក្សាទុក និងបិទ (Save & Close)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

