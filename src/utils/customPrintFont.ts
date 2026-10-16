/**
 * Helper utilities for dynamic font resolution across print documents & modals.
 * Synchronizes with user preferences from CustomizeModal ('primary_teacher_admin_v2_font' and 'primary_teacher_admin_v2_theme').
 */

export const getActiveCustomFontFamily = (): string => {
  if (typeof window !== 'undefined') {
    return (
      localStorage.getItem('primary_teacher_admin_v2_font') ||
      localStorage.getItem('student_portal_font') ||
      'Battambang'
    );
  }
  return 'Battambang';
};

export const getActiveCustomBackgroundTheme = (): string => {
  if (typeof window !== 'undefined') {
    return (
      localStorage.getItem('primary_teacher_admin_v2_theme') ||
      'notebook-grid'
    );
  }
  return 'notebook-grid';
};

export const getThemeBackgroundCss = (_theme?: string): string => {
  // Strict guarantee: All printed documents must have a clean, pure white background sheet (#ffffff)
  // without any grid lines, notebook margins, or dark backgrounds per user requirement:
  // "សូមសន្លឹកក្រដាសពេលព្រីនសូមមានផ្ទៃពណ៌សផង គ្រប់ឯកសារ"
  return `
    background-color: #ffffff !important;
    background: #ffffff !important;
    background-image: none !important;
    color: #000000 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  `;
};

export const getThemeBackgroundClass = (theme: string): string => {
  switch (theme) {
    case 'notebook-grid':
    case 'grid':
      return 'theme-notebook-grid text-slate-900';
    case 'notebook-lines':
      return 'theme-notebook-lines text-slate-900';
    case 'notebook-seyes':
      return 'theme-notebook-seyes text-slate-900';
    case 'notebook-dots':
      return 'theme-notebook-dots text-slate-900';
    case 'parchment':
      return 'theme-parchment text-amber-950';
    case 'blackboard':
    case 'chalkboard':
      return 'theme-chalkboard text-emerald-100';
    case 'mint':
      return 'bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 text-slate-900';
    case 'lavender':
      return 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 text-slate-900';
    case 'royal':
      return 'bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-amber-100';
    case 'emerald':
      return 'bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-emerald-50';
    case 'sunset':
      return 'bg-gradient-to-br from-amber-950 via-orange-950 to-rose-950 text-amber-50';
    case 'blue':
      return 'bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-blue-50';
    case 'pink':
      return 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 text-slate-900';
    case 'cosmic':
      return 'bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-purple-100';
    default:
      return 'bg-gradient-to-br from-slate-50 via-amber-50/25 to-blue-50/30 text-slate-800';
  }
};

export const getKhmerGoogleFontsLinkHtml = (): string => `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Angkor&family=Battambang:wght@400;700&family=Bayon&family=Bokor&family=Chenla&family=Content:wght@400;700&family=Dangrek&family=Fredoka:wght@400;600;700;800&family=Hanuman:wght@400;700&family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Koulen&family=Moul&family=Noto+Sans+Khmer:wght@400;600;700&family=Preahvihear&family=Siemreap&family=Suwannaphum:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
`;

/**
 * Returns CSS snippet for global print styling matching user-selected font and theme
 */
export const getPrintBaseCss = (options?: {
  font?: string;
  theme?: string;
  isBW?: boolean;
}): string => {
  const font = options?.font || getActiveCustomFontFamily();
  const bgCss = `
    background: #ffffff !important;
    background-color: #ffffff !important;
    background-image: none !important;
    color: #000000 !important;
  `;

  return `
    font-family: '${font}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif !important;
    ${bgCss}
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  `;
};
