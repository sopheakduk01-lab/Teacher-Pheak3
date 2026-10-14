import { QuizQuestion } from '../types';
import { WorksheetOptions } from '../components/WorksheetPaperView';

export function printWorksheetDocument(
  title: string,
  subject: string,
  grade: string,
  examDuration: string | number,
  teacherName: string,
  questions: QuizQuestion[],
  options: WorksheetOptions
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const questionsHtml = questions
    .map(
      (q, idx) => `
    <div style="margin-bottom: 16px; page-break-inside: avoid;">
      <p style="font-weight: bold; margin-bottom: 6px; font-size: 14px;">
        <span style="display: inline-block; width: 24px;">${idx + 1}.</span> ${q.question}
        ${q.points && options.showPoints ? `<span style="color: #6b21a8; font-size: 12px;"> (${q.points} ពិន្ទុ)</span>` : ''}
      </p>
      ${
        q.options && q.options.length > 0
          ? `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-left: 24px;">
              ${q.options
                .map(
                  (opt, oIdx) => `
                <div style="padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; ${
                  options.showAnswerKey && opt.isCorrect ? 'background-color: #dcfce7; font-weight: bold; border-color: #16a34a;' : ''
                }">
                  <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt.text}
                  ${options.showAnswerKey && opt.isCorrect ? ' (✓)' : ''}
                </div>
              `
                )
                .join('')}
            </div>`
          : ''
      }
    </div>
  `
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&display=swap');
    body {
      font-family: 'Kantumruy Pro', sans-serif;
      padding: 30px;
      color: #0f172a;
      line-height: 1.5;
    }
    @media print {
      body { padding: 10px; }
      @page { size: ${options.paperSize || 'A4'} ${options.pageOrientation || 'portrait'}; margin: 15mm; }
    }
  </style>
</head>
<body>
  <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
    <div>
      <div style="font-size: 12px; font-weight: bold; color: #475569;">${options.districtOffice || 'ការិយាល័យអប់រំ យុវជន និងកីឡា'}</div>
      <div style="font-size: 14px; font-weight: bold; color: #1e293b;">${options.schoolName || 'សាលាបឋមសិក្សាគំរូ'}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 12px; font-weight: bold;">ព្រះរាជាណាចក្រកម្ពុជា</div>
      <div style="font-size: 11px;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
    </div>
  </div>

  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="margin: 0 0 6px 0; font-size: 18px;">${title}</h2>
    <div style="font-size: 12px; color: #475569;">
      មុខវិជ្ជា ៖ <strong>${subject}</strong> | កម្រិត ៖ <strong>${grade}</strong> | រយៈពេល ៖ <strong>${examDuration} នាទី</strong>
      ${options.totalScore ? ` | ពិន្ទុ ៖ <strong>${options.totalScore}</strong>` : ''}
    </div>
  </div>

  ${
    options.showStudentBox
      ? `<div style="border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; margin-bottom: 18px; font-size: 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
          <div>ឈ្មោះ ៖ ....................</div>
          <div>ភេទ ៖ ......</div>
          <div>លេខតុ ៖ ......</div>
          <div>បន្ទប់ ៖ ......</div>
        </div>`
      : ''
  }

  ${
    options.instructionText
      ? `<div style="background: #fef3c7; border: 1px solid #fde68a; padding: 8px; border-radius: 6px; margin-bottom: 18px; font-size: 12px;">
          <strong>ការណែនាំ ៖ </strong> ${options.instructionText}
        </div>`
      : ''
  }

  <div style="margin-top: 15px;">
    ${questionsHtml}
  </div>

  ${
    options.showSignatures
      ? `<div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; page-break-inside: avoid;">
          <div style="text-align: center;">
            <p>ហត្ថលេខាសិស្ស</p>
            <div style="height: 40px;"></div>
            <p>........................</p>
          </div>
          <div style="text-align: center;">
            <p>គ្រូបង្រៀន</p>
            <div style="height: 40px;"></div>
            <p><strong>${teacherName}</strong></p>
          </div>
        </div>`
      : ''
  }
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

export function exportWorksheetToWordDoc(
  title: string,
  subject: string,
  grade: string,
  examDuration: string | number,
  teacherName: string,
  questions: QuizQuestion[],
  options: WorksheetOptions
): void {
  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <style>
    body { font-family: 'Kantumruy Pro', Arial, sans-serif; font-size: 12pt; line-height: 1.5; }
    h2 { text-align: center; font-size: 16pt; margin-bottom: 5pt; }
    .header-box { width: 100%; margin-bottom: 15pt; }
    .question-item { margin-bottom: 12pt; }
  </style>
</head>
<body>
  <h2>${title}</h2>
  <p style="text-align: center;">មុខវិជ្ជា៖ <strong>${subject}</strong> | ថ្នាក់៖ <strong>${grade}</strong> | រយៈពេល៖ <strong>${examDuration} នាទី</strong></p>
  <hr/>
  ${questions
    .map(
      (q, idx) => `
    <div class="question-item">
      <p><strong>${idx + 1}. ${q.question}</strong></p>
      ${
        q.options
          ? `<ul>${q.options
              .map((o, oIdx) => `<li>${String.fromCharCode(65 + oIdx)}. ${o.text}${options.showAnswerKey && o.isCorrect ? ' [ចម្លើយត្រឹមត្រូវ]' : ''}</li>`)
              .join('')}</ul>`
          : ''
      }
    </div>
  `
    )
    .join('')}
  <br/><br/>
  <table width="100%">
    <tr>
      <td align="left">ហត្ថលេខាសិស្ស</td>
      <td align="right">គ្រូបង្រៀន៖ ${teacherName}</td>
    </tr>
  </table>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff' + content], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
