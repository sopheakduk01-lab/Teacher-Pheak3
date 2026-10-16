export function getActiveCustomFontFamily(): string {
  try {
    return localStorage.getItem('primary_teacher_admin_v2_font') || 'Kantumruy Pro';
  } catch {}
  return 'Kantumruy Pro';
}

export function getActiveCustomBackgroundTheme(): string {
  try {
    return localStorage.getItem('primary_teacher_admin_v2_theme') || 'default';
  } catch {}
  return 'default';
}

export function getThemeBackgroundCss(theme: string): string {
  switch (theme) {
    case 'notebook-grid':
      return 'background-color: #ffffff; background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 20px 20px;';
    case 'parchment':
      return 'background-color: #fef3c7; color: #451a03;';
    case 'mint':
      return 'background-color: #f0fdf4;';
    case 'blue':
      return 'background-color: #f0f9ff;';
    default:
      return 'background-color: #ffffff;';
  }
}

export function getThemeBackgroundClass(theme: string): string {
  switch (theme) {
    case 'notebook-grid':
      return 'bg-white text-slate-900';
    case 'parchment':
      return 'bg-amber-50 text-amber-950';
    case 'mint':
      return 'bg-emerald-50 text-emerald-950';
    case 'blue':
      return 'bg-sky-50 text-sky-950';
    default:
      return 'bg-white text-slate-900';
  }
}

export function getKhmerGoogleFontsLinkHtml(): string {
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Battambang:wght@400;700&family=Moul&display=swap" rel="stylesheet">`;
}
