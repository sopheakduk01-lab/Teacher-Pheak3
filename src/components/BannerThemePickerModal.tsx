import React from 'react';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import { BANNER_THEMES, BannerThemeId } from '../utils/bannerThemes';
import { ThemeAnimatedDecorations } from './ThemeAnimatedDecorations';

interface BannerThemePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: BannerThemeId;
  onSelectTheme: (themeId: BannerThemeId) => void;
}

export const BannerThemePickerModal: React.FC<BannerThemePickerModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const themesList = Object.values(BANNER_THEMES);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-[28px] max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 relative overflow-hidden">
          <ThemeAnimatedDecorations themeId={currentTheme} variant="compact" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/15 shadow-inner">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black flex items-center gap-2">
                <span>រើសម៉ូដពណ៌ផ្ទាំងរដ្ឋបាល</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                  ៥ គំរូ
                </span>
              </h3>
              <p className="text-xs text-purple-200/80 mt-0.5">
                ប្តូរពណ៌ផ្ទាំងបដា ប៊ូតុង និងកាតរដ្ឋបាលតាមចំណូលចិត្ត
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Theme Options List */}
        <div className="p-4 space-y-3 overflow-y-auto no-scrollbar">
          {themesList.map((theme) => {
            const isSelected = currentTheme === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border relative overflow-hidden group cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'border-purple-600 dark:border-purple-400 ring-2 ring-purple-500/40 bg-purple-50/50 dark:bg-purple-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {/* Visual Banner Preview Strip */}
                <div className={`w-full h-14 rounded-xl bg-gradient-to-r ${theme.previewGradient} p-2.5 flex items-center justify-between text-white border border-white/10 shadow-inner relative overflow-hidden`}>
                  <ThemeAnimatedDecorations themeId={theme.id} variant="compact" />
                  <div className="flex items-center gap-2.5 relative z-10">
                    <span className="text-xl">{theme.icon}</span>
                    <div>
                      <span className="text-xs font-black text-white drop-shadow-xs block">
                        {theme.nameKh}
                      </span>
                      <span className="text-[10px] text-white/80 font-normal">
                        {theme.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 relative z-10">
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtitle description */}
                <div className="flex items-center justify-between gap-2 px-1">
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {theme.subtitle}
                  </p>
                  {isSelected && (
                    <span className="text-[10px] font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-md shrink-0">
                      កំពុងប្រើ
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>រក្សាទុកស្វ័យប្រវត្តិក្នុងឧបករណ៍របស់អ្នក</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-xs hover:opacity-90 transition active:scale-95 cursor-pointer"
          >
            រួចរាល់
          </button>
        </div>
      </div>
    </div>
  );
};
