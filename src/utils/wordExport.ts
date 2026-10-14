// Utility to export clean Microsoft Word (.doc) documents with official Khmer formatting
import { TimetableInfo } from '../data/timetableData';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from './customPrintFont';

export function exportTimetableToWord(data: TimetableInfo) {
  const activeFont = getActiveCustomFontFamily();
  const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${data.title}</title>
<style>
  @page Section1 {
    size: 841.9pt 595.3pt; /* A4 Landscape in Word */
    mso-page-orientation: landscape;
    margin: 10.0mm 12.0mm 10.0mm 12.0mm;
    mso-header-margin: 20.0pt;
    mso-footer-margin: 20.0pt;
    mso-paper-source: 0;
  }
  div.Section1 {
    page: Section1;
    font-family: '${activeFont}', 'Khmer OS Siemreap', 'Kantumruy Pro', 'Battambang', Arial, sans-serif;
  }
  body {
    font-family: '${activeFont}', 'Khmer OS Siemreap', 'Kantumruy Pro', 'Battambang', Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.25;
    color: #000;
  }
  .moul {
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-weight: normal;
  }
  .center {
    text-align: center;
  }
  table.timetable-grid {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6px;
    margin-bottom: 6px;
  }
  table.timetable-grid th, table.timetable-grid td {
    border: 1px solid #000000;
    padding: 4px 3px;
    text-align: center;
    font-size: 9.5pt;
    vertical-align: middle;
  }
  table.timetable-grid th {
    background-color: #FCE4D6;
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-weight: normal;
    font-size: 9.5pt;
  }
  .bg-flag {
    background-color: #FFF0F0;
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-size: 9.5pt;
    color: #900;
  }
  .bg-break {
    background-color: #FFFDF0;
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-size: 9.5pt;
    color: #B45309;
  }
  .notes {
    font-size: 9pt;
    line-height: 1.3;
    margin-top: 6px;
  }
  .signatures {
    width: 100%;
    margin-top: 12px;
    border-collapse: collapse;
  }
  .signatures td {
    border: none;
    text-align: center;
    vertical-align: top;
    font-size: 10pt;
    width: 50%;
  }
</style>
</head>
<body>
<div class="Section1">

  <!-- Header: ១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់ -->
  <div style="text-align: center; margin-bottom: 4px;">
    <div class="moul" style="font-size: 11.5pt; color: #8B4513; margin: 0; padding: 0; line-height: 1.1;">${data.countryHeader}</div>
    <div class="moul" style="font-size: 10.5pt; margin-top: 1px; line-height: 1.1;">${data.motto}</div>
    <div style="font-size: 8.5pt; color: #555; margin-top: 1px;">— ༺ ៚ ༻ —</div>
  </div>

  <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 4px;">
    <tr>
      <td style="width: 60%; vertical-align: top; text-align: left; border: none; padding: 0;">
        <div style="font-size: 10pt; font-weight: bold;">${data.office}</div>
        <div class="moul" style="font-size: 10pt; margin-top: 2px;">${data.schoolName}</div>
      </td>
      <td style="width: 40%; vertical-align: top; text-align: right; border: none; padding: 0;">
        <div style="font-size: 9.5pt;">ឆ្នាំសិក្សា៖ <strong>${data.academicYear}</strong></div>
      </td>
    </tr>
  </table>

  <!-- Title -->
  <div class="center" style="margin-top: 4px; margin-bottom: 8px;">
    <div class="moul" style="font-size: 11.5pt; color: #1E3A8A;">${data.title} ${data.academicYear} (${data.system}) (${data.shift})</div>
  </div>

  <!-- Timetable Table -->
  <table class="timetable-grid">
    <thead>
      <tr>
        <th style="width: 11%;">ម៉ោងសិក្សា</th>
        <th style="width: 9%;">រយៈពេល</th>
        <th style="width: 13%;">ចន្ទ</th>
        <th style="width: 13%;">អង្គារ</th>
        <th style="width: 13%;">ពុធ</th>
        <th style="width: 13%;">ព្រហស្បតិ៍</th>
        <th style="width: 13%;">សុក្រ</th>
        <th style="width: 13%;">សៅរ៍</th>
      </tr>
    </thead>
    <tbody>
      ${data.rows
        .map((r) => {
          if (r.type === 'flag') {
            return `
            <tr>
              <td style="font-weight: bold;">${r.time}</td>
              <td>${r.duration}</td>
              <td colspan="6" class="bg-flag">${r.mon}</td>
            </tr>`;
          }
          if (r.type === 'break') {
            return `
            <tr>
              <td style="font-weight: bold;">${r.time}</td>
              <td>${r.duration}</td>
              <td colspan="6" class="bg-break">${r.mon}</td>
            </tr>`;
          }
          return `
          <tr>
            <td style="font-weight: bold;">${r.time}</td>
            <td>${r.duration}</td>
            <td>${r.mon}</td>
            <td>${r.tue}</td>
            <td>${r.wed}</td>
            <td>${r.thu}</td>
            <td>${r.fri}</td>
            <td>${r.sat}</td>
          </tr>`;
        })
        .join('')}
    </tbody>
  </table>

  <!-- Notes -->
  <div class="notes">
    <div style="font-weight: bold; text-decoration: underline; color: #900;">កំណត់សម្គាល់៖</div>
    <ul style="margin-top: 2px; padding-left: 18px; margin-bottom: 0;">
      ${data.notes.map((n) => `<li>${n}</li>`).join('')}
    </ul>
  </div>

  <!-- Signatures: ២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា -->
  <table class="signatures" style="margin-top: 15px;">
    <tr>
      <td style="text-align: right; padding-right: 20px;">
        <div>${data.issuedDate}</div>
        <div class="moul" style="font-size: 10pt; margin-top: 1px;">${data.teacherTitle}</div>
        <div style="height: 30pt;"></div>
      </td>
    </tr>
    <tr>
      <td style="text-align: left; padding-left: 20px;">
        <div class="moul" style="font-size: 10pt;">${data.directorTitle.split('\n')[0]}</div>
        <div style="font-weight: bold; margin-top: 1px;">${data.directorTitle.split('\n')[1] || 'នាយកសាលា'}</div>
        <div style="height: 30pt;"></div>
      </td>
    </tr>
  </table>

</div>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `កាលវិភាគបង្រៀន_${data.academicYear.replace('/', '-')}.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

export function printStandardWordDocument(data: TimetableInfo, isBW: boolean = false) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const activeFont = getActiveCustomFontFamily();
  const activeTheme = getActiveCustomBackgroundTheme();
  const backgroundCss = isBW ? 'background: #ffffff !important;' : getThemeBackgroundCss(activeTheme);

  const html = `
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>${data.title} - បោះពុម្ពស្តង់ដារ Word</title>
  ${getKhmerGoogleFontsLinkHtml()}
  <style>
    @page {
      size: A4 landscape;
      margin: 5mm 8mm 5mm 8mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      height: 100vh;
      font-family: '${activeFont}', 'Kantumruy Pro', 'Siemreap', 'Battambang', Arial, sans-serif;
      font-size: 9.5pt;
      color: #000;
      background: #ffffff !important;
      background-color: #ffffff !important;
      background-image: none !important;
      line-height: 1.25;
      overflow: hidden;
    }
    .single-page-wrapper {
      width: 100%;
      max-height: 100vh;
      background: #ffffff !important;
      background-color: #ffffff !important;
      background-image: none !important;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-before: avoid;
      page-break-after: avoid;
    }
    .moul {
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-weight: normal;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border: none;
      margin-bottom: 2px;
    }
    .header-table td {
      border: none;
      vertical-align: top;
      padding: 0;
    }
    .title-box {
      text-align: center;
      margin: 2px 0 6px 0;
    }
    .title-box h2 {
      margin: 0;
      font-size: 11.5pt;
      color: ${isBW ? '#000' : '#1e3a8a'};
    }
    .title-box p {
      margin: 1px 0 0 0;
      font-size: 9.5pt;
      font-weight: bold;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #000;
      margin-bottom: 4px;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #000;
      padding: 3.5px 2px;
      text-align: center;
      font-size: 9pt;
      vertical-align: middle;
      line-height: 1.2;
    }
    table.data-table th {
      background-color: ${isBW ? '#eee' : '#FCE4D6'};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9.5pt;
      font-weight: normal;
    }
    .flag-row {
      background-color: ${isBW ? '#fff' : '#fff0f0'};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9pt;
      color: ${isBW ? '#000' : '#900'};
    }
    .break-row {
      background-color: ${isBW ? '#fff' : '#fffdf0'};
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
      font-size: 9pt;
      color: ${isBW ? '#000' : '#b45309'};
    }
    .notes-box {
      font-size: 8.5pt;
      margin-top: 2px;
      line-height: 1.25;
    }
    .notes-box ul {
      margin: 1px 0 0 0;
      padding-left: 16px;
    }
    .signatures-table {
      width: 100%;
      border-collapse: collapse;
      border: none;
      margin-top: 8px;
    }
    .signatures-table td {
      border: none;
      text-align: center;
      vertical-align: top;
      width: 50%;
      font-size: 9.5pt;
      padding: 0;
    }
    .sign-space {
      height: 38px;
    }
  </style>
</head>
<body>
<div class="single-page-wrapper">
  <div>
    <!-- Header: ១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់ -->
    <div style="text-align: center; margin-bottom: 4px;">
      <div class="moul" style="font-size: 11.5pt; color: ${isBW ? '#000' : '#8B4513'}; margin: 0; padding: 0; line-height: 1.1;">${data.countryHeader}</div>
      <div class="moul" style="font-size: 10.5pt; margin-top: 1px; line-height: 1.1;">${data.motto}</div>
      <div style="font-size: 8.5pt; color: #555; margin-top: 1px;">— ༺ ៚ ༻ —</div>
    </div>

    <table class="header-table" style="margin-bottom: 4px;">
      <tr>
        <td style="width: 60%; text-align: left; vertical-align: top;">
          <div style="font-size: 10pt; font-weight: bold;">${data.office}</div>
          <div class="moul" style="font-size: 10pt; margin-top: 2px;">${data.schoolName}</div>
        </td>
        <td style="width: 40%; text-align: right; vertical-align: top;">
          <div style="font-size: 9.5pt;">ឆ្នាំសិក្សា៖ <strong>${data.academicYear}</strong></div>
        </td>
      </tr>
    </table>

    <!-- Title -->
    <div class="title-box">
      <h2 class="moul">${data.title}</h2>
      <p>ឆ្នាំសិក្សា ${data.academicYear} (${data.system}) (${data.shift})</p>
    </div>

    <!-- Table Grid -->
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 11%;">ម៉ោងសិក្សា</th>
          <th style="width: 9%;">រយៈពេល</th>
          <th style="width: 13%;">ចន្ទ</th>
          <th style="width: 13%;">អង្គារ</th>
          <th style="width: 13%;">ពុធ</th>
          <th style="width: 13%;">ព្រហស្បតិ៍</th>
          <th style="width: 13%;">សុក្រ</th>
          <th style="width: 13%;">សៅរ៍</th>
        </tr>
      </thead>
      <tbody>
        ${data.rows
          .map((r) => {
            if (r.type === 'flag') {
              return `
              <tr>
                <td style="font-weight: bold; font-family: monospace;">${r.time}</td>
                <td>${r.duration}</td>
                <td colspan="6" class="flag-row">${r.mon}</td>
              </tr>`;
            }
            if (r.type === 'break') {
              return `
              <tr>
                <td style="font-weight: bold; font-family: monospace;">${r.time}</td>
                <td>${r.duration}</td>
                <td colspan="6" class="break-row">${r.mon}</td>
              </tr>`;
            }
            return `
            <tr>
              <td style="font-weight: bold; font-family: monospace;">${r.time}</td>
              <td>${r.duration}</td>
              <td>${r.mon}</td>
              <td>${r.tue}</td>
              <td>${r.wed}</td>
              <td>${r.thu}</td>
              <td>${r.fri}</td>
              <td>${r.sat}</td>
            </tr>`;
          })
          .join('')}
      </tbody>
    </table>

    <!-- Notes -->
    <div class="notes-box">
      <div style="font-weight: bold; text-decoration: underline; color: ${isBW ? '#000' : '#900'};">កំណត់សម្គាល់៖</div>
      <ul>
        ${data.notes.map((n) => `<li>${n}</li>`).join('')}
      </ul>
    </div>
  </div>

  <!-- Signatures: ២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា -->
  <table class="signatures-table" style="margin-top: 15px;">
    <tr>
      <td style="text-align: right; padding-right: 20px;">
        <div style="font-size: 9.5pt;">${data.issuedDate}</div>
        <div class="moul" style="font-size: 10pt; margin-top: 1px;">${data.teacherTitle}</div>
        <div class="sign-space"></div>
        <div style="color: #666; font-size: 8.5pt;">(ហត្ថលេខា)</div>
      </td>
    </tr>
    <tr>
      <td style="text-align: left; padding-left: 20px;">
        <div class="moul" style="font-size: 10pt;">${data.directorTitle.split('\n')[0]}</div>
        <div style="font-weight: bold; margin-top: 1px;">${data.directorTitle.split('\n')[1] || 'នាយកសាលា'}</div>
        <div class="sign-space"></div>
        <div style="color: #666; font-size: 8.5pt;">(ហត្ថលេខា និងត្រា)</div>
      </td>
    </tr>
  </table>
</div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

