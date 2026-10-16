import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from './customPrintFont';

/**
 * Utility for printing the Classroom Management Committee (គ. គ. ថ.) official A4 booklet.
 * Supports both standard browser printing and an isolated clean iframe printing method
 * that guarantees 100% full content without clipping or unwanted page breaks.
 */

export const printIsolatedCommitteeBooklet = (containerId: string = 'official-committee-print-content') => {
  const sourceEl = document.getElementById(containerId);
  if (!sourceEl) {
    window.print();
    return;
  }

  // Create or reuse hidden iframe
  let iframe = document.getElementById('committee-isolated-print-frame') as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'committee-isolated-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    window.print();
    return;
  }

  const htmlContent = sourceEl.innerHTML;
  const activeFont = getActiveCustomFontFamily();
  const activeTheme = getActiveCustomBackgroundTheme();
  const themeBackgroundCss = getThemeBackgroundCss(activeTheme);

  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="utf-8">
  <title>សៀវភៅ_គ_គ_ថ_A4_ផ្លូវការ</title>
  ${getKhmerGoogleFontsLinkHtml()}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm 8mm 10mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #ffffff !important;
      color: #000000 !important;
      font-size: 9pt !important;
      font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .font-moul {
      font-family: 'Moul', cursive, serif !important;
    }
    .booklet-page {
      box-sizing: border-box !important;
      width: 100% !important;
      max-width: 190mm !important;
      height: 268mm !important;
      max-height: 268mm !important;
      min-height: 268mm !important;
      padding: 2mm 3mm !important;
      margin: 0 auto !important;
      page-break-after: always !important;
      break-after: page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      background: #ffffff !important;
      background-color: #ffffff !important;
      background-image: none !important;
    }
    .booklet-page-last {
      page-break-after: auto !important;
      break-after: auto !important;
    }
    .booklet-page * {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    @media print {
      body {
        width: 100%;
      }
    }
  </style>
</head>
<body class="bg-white text-slate-900 leading-relaxed font-serif" style="font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', serif;">
  ${htmlContent}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`);
  doc.close();
};
