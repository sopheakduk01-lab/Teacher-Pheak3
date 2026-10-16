import { QuizQuestion, QuestionType } from '../types';
import {
  WorksheetOptions,
  WORKSHEET_TYPE_TITLES,
  WORKSHEET_DESIGN_INFO,
  toKhmerNum,
  KHMER_OPTION_LETTERS,
  computeTwoPageSplitIndex,
} from '../components/WorksheetPaperView';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from './customPrintFont';

export { computeTwoPageSplitIndex };

function renderHtmlQuestionItem(
  q: QuizQuestion,
  idx: number,
  options: WorksheetOptions,
  theme: string,
  dense: boolean = false
): string {
  const qType: QuestionType = q.type || 'qcm';
  const khmerNum = toKhmerNum(idx + 1);

  let bodyHtml = '';

  if (qType === 'qcm') {
    const isA5 = options.paperSize === 'A5';
    const isA5Portrait = isA5 && (options.pageOrientation || 'portrait') === 'portrait';
    const optWidth = isA5Portrait ? '98%' : '48%';

    const optionsList = (q.options || [])
      .map((opt, oIdx) => {
        const letter = KHMER_OPTION_LETTERS[oIdx] || String.fromCharCode(65 + oIdx);
        const isAnswer = options.showAnswerKey && opt.isCorrect;
        return `
          <div style="display: inline-block; width: ${optWidth}; margin-bottom: 8px; vertical-align: top; ${
            isAnswer ? 'background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 4px; padding: 2px 4px;' : ''
          }">
            <span style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid ${
              isAnswer ? '#059669' : '#475569'
            }; text-align: center; line-height: 18px; font-weight: bold; font-size: 9pt; ${
          isAnswer ? 'background-color: #059669; color: #fff;' : 'color: #334155;'
        }">${letter}</span>
            <span style="font-size: ${isA5 ? '9pt' : '10pt'}; margin-left: 6px; ${isAnswer ? 'font-weight: bold; color: #065f46;' : ''}">${opt.text}</span>
            ${isAnswer ? '<span style="font-size: 8.5pt; color: #059669; font-weight: bold; margin-left: 6px;">✔ ចម្លើយ</span>' : ''}
          </div>
        `;
      })
      .join('');

    bodyHtml = `<div style="padding-left: 18px; margin-top: 6px;">${optionsList}</div>`;
  } else if (qType === 'true_false') {
    bodyHtml = `
      <div style="padding-left: 18px; margin-top: 6px;">
        <span style="display: inline-block; margin-right: 35px; ${
          options.showAnswerKey && q.isTrue ? 'background-color: #ecfdf5; border: 1px solid #10b981; padding: 2px 8px; border-radius: 4px;' : ''
        }">
          <span style="display: inline-block; width: 16px; height: 16px; border: 1.5px solid #475569; border-radius: 3px; vertical-align: middle; text-align: center; line-height: 14px; font-size: 10pt; font-weight: bold; ${
            options.showAnswerKey && q.isTrue ? 'background-color: #059669; color: #fff; border-color: #059669;' : ''
          }">${options.showAnswerKey && q.isTrue ? '✔' : ''}</span>
          <span style="margin-left: 6px; font-size: 10pt; ${options.showAnswerKey && q.isTrue ? 'font-weight: bold; color: #065f46;' : ''}">ត្រូវ (ពិត)</span>
        </span>
        <span style="display: inline-block; ${
          options.showAnswerKey && !q.isTrue ? 'background-color: #ecfdf5; border: 1px solid #10b981; padding: 2px 8px; border-radius: 4px;' : ''
        }">
          <span style="display: inline-block; width: 16px; height: 16px; border: 1.5px solid #475569; border-radius: 3px; vertical-align: middle; text-align: center; line-height: 14px; font-size: 10pt; font-weight: bold; ${
            options.showAnswerKey && !q.isTrue ? 'background-color: #059669; color: #fff; border-color: #059669;' : ''
          }">${options.showAnswerKey && !q.isTrue ? '✔' : ''}</span>
          <span style="margin-left: 6px; font-size: 10pt; ${options.showAnswerKey && !q.isTrue ? 'font-weight: bold; color: #065f46;' : ''}">ខុស (មិនពិត)</span>
        </span>
      </div>
    `;
  } else if (qType === 'matching') {
    const rows = (q.matchingPairs || [])
      .map((pair, pIdx) => {
        const letterKhmer = KHMER_OPTION_LETTERS[pIdx] || String.fromCharCode(65 + pIdx);
        return `
          <tr>
            <td style="border: 1px solid #64748b; padding: 6px 8px; font-size: 9.5pt;">${toKhmerNum(pIdx + 1)}. ${pair.left}</td>
            <td style="border: 1px solid #64748b; padding: 6px 8px; text-align: center; font-weight: bold; font-size: 9.5pt;">
              ${
                options.showAnswerKey
                  ? `<span style="background-color: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 4px;">${toKhmerNum(pIdx + 1)} ➜ ${letterKhmer}</span>`
                  : `<span style="color: #94a3b8;">[  .....  ]</span>`
              }
            </td>
            <td style="border: 1px solid #64748b; padding: 6px 8px; font-size: 9.5pt;">${letterKhmer}. ${pair.right}</td>
          </tr>
        `;
      })
      .join('');

    bodyHtml = `
      <div style="padding-left: 18px; margin-top: 6px;">
        <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #334155; margin-bottom: 4px;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #64748b; padding: 5px 8px; text-align: left; font-size: 9.5pt; width: 44%;">ជួរ ក (សំណួរ / ខ្លឹមសារ)</th>
              <th style="border: 1px solid #64748b; padding: 5px 8px; text-align: center; font-size: 9.5pt; width: 16%;">ចម្លើយ</th>
              <th style="border: 1px solid #64748b; padding: 5px 8px; text-align: left; font-size: 9.5pt; width: 40%;">ជួរ ខ (ធាតុផ្គូផ្គង)</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  } else if (qType === 'fill_blank') {
    const wordList = [q.blankAnswer, ...(q.blankDistractors || [])]
      .filter(Boolean)
      .map((w) => `<span style="display: inline-block; padding: 2px 6px; background-color: #fff; border: 1px solid #d97706; border-radius: 4px; margin-right: 6px; font-size: 9pt;">[ ${w} ]</span>`)
      .join(' ');

    bodyHtml = `
      <div style="padding-left: 18px; margin-top: 6px;">
        <div style="background-color: #fef3c7; border: 1px dashed #d97706; border-radius: 6px; padding: 6px 10px; margin-bottom: 8px;">
          <span style="font-size: 9pt; font-weight: bold; color: #92400e; display: block; margin-bottom: 3px;">ប្រអប់ពាក្យគន្លឹះសម្រាប់រើស ៖</span>
          ${wordList}
        </div>
        ${
          options.showAnswerKey
            ? `<div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 6px 10px; border-radius: 6px; font-size: 9.5pt;"><strong style="color: #065f46;">ចម្លើយត្រឹមត្រូវ ៖ </strong><span style="color: #047857; font-weight: bold; text-decoration: underline;">${q.blankAnswer}</span></div>`
            : `<div style="font-size: 9.5pt; color: #475569;">ចម្លើយសិស្ស ៖</div><div style="border-bottom: 1.5px dotted #64748b; height: 22px; margin-top: 2px;"></div>`
        }
      </div>
    `;
  } else if (qType === 'reorder_words') {
    const scrambled = (q.words || [])
      .map((w) => `<span style="display: inline-block; padding: 2px 8px; background-color: #fff; border: 1px solid #0d9488; border-radius: 4px; margin-right: 6px; font-size: 9pt; font-weight: bold; color: #115e59;">${w}</span>`)
      .join(' ');

    bodyHtml = `
      <div style="padding-left: 18px; margin-top: 6px;">
        <div style="background-color: #ccfbf1; border: 1px solid #14b8a6; border-radius: 6px; padding: 6px 10px; margin-bottom: 8px;">
          <span style="font-size: 9pt; font-weight: bold; color: #134e4a; display: block; margin-bottom: 3px;">កម្រងពាក្យរាយប៉ាយ (ចូររៀបឱ្យក្លាយជាល្បះត្រឹមត្រូវ) ៖</span>
          ${scrambled}
        </div>
        ${
          options.showAnswerKey
            ? `<div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 6px 10px; border-radius: 6px; font-size: 9.5pt;"><strong style="color: #065f46;">ល្បះត្រឹមត្រូវពេញលេញ ៖ </strong><span style="color: #047857; font-weight: bold;">${q.correctSentence}</span></div>`
            : `<div style="font-size: 9.5pt; color: #475569;">ចម្លើយសិស្ស ៖</div><div style="border-bottom: 1.5px dotted #64748b; height: 20px; margin-top: 2px;"></div><div style="border-bottom: 1.5px dotted #64748b; height: 20px; margin-top: 4px;"></div>`
        }
      </div>
    `;
  } else if (qType === 'short_answer') {
    bodyHtml = `
      <div style="padding-left: 18px; margin-top: 6px;">
        ${
          options.showAnswerKey
            ? `<div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 6px 10px; border-radius: 6px; font-size: 9.5pt;"><strong style="color: #065f46;">ចម្លើយ ឬពាក្យគន្លឹះ ៖ </strong><span style="color: #047857; font-weight: bold;">${q.correctAnswer || '(ចម្លើយខ្លី)'}</span></div>`
            : `<div style="font-size: 9.5pt; color: #475569;">ចម្លើយសិស្ស ៖</div><div style="border-bottom: 1.5px dotted #64748b; height: 22px; margin-top: 2px;"></div><div style="border-bottom: 1.5px dotted #64748b; height: 22px; margin-top: 4px;"></div>`
        }
      </div>
    `;
  } else if (qType === 'pisa') {
    const domainLabel =
      q.pisaDomain === 'math'
        ? 'គណិតវិទ្យា'
        : q.pisaDomain === 'science'
        ? 'វិទ្យាសាស្ត្រ'
        : q.pisaDomain === 'reading'
        ? 'អំណានយល់ន័យ'
        : q.pisaDomain === 'financial'
        ? 'ហិរញ្ញវត្ថុ'
        : 'ការត្រិះរិះពិចារណា';

    const partsArray = q.pisaParts || q.pisaQuestionParts || [];
    const subPartsHtml =
      partsArray.length > 0
        ? partsArray
            .map((part, pIdx) => {
              const partLetter = KHMER_OPTION_LETTERS[pIdx] || String.fromCharCode(65 + pIdx);
              return `
                <div style="margin-top: 8px;">
                  <div style="font-weight: bold; font-size: 9.5pt;">${partLetter}. ${part.prompt} ${part.points ? `<span style="font-weight: normal; color: #64748b;">[ ${part.points} ពិន្ទុ ]</span>` : ''}</div>
                  ${
                    options.showAnswerKey && part.sampleAnswer
                      ? `<div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 4px 8px; border-radius: 4px; font-size: 9pt; margin-top: 3px;"><strong style="color: #065f46;">ចម្លើយ & ហេតុផល ៖</strong> ${part.sampleAnswer}</div>`
                      : `<div style="border-bottom: 1px dotted #64748b; height: 20px; margin-top: 2px;"></div><div style="border-bottom: 1px dotted #64748b; height: 20px; margin-top: 3px;"></div>`
                  }
                </div>
              `;
            })
            .join('')
        : options.showAnswerKey
        ? `<div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 6px 10px; border-radius: 6px; font-size: 9.5pt; margin-top: 6px;"><strong style="color: #065f46;">ដំណោះស្រាយ និងការបកស្រាយហេតុផល ៖ </strong><p style="margin: 3px 0 0 0; color: #047857;">${q.correctAnswer || '(ចម្លើយវិភាគ PISA)'}</p></div>`
        : `<div style="font-size: 9.5pt; color: #475569; margin-top: 6px;">ចម្លើយ និងការបកស្រាយហេតុផលរបស់សិស្ស ៖</div><div style="border-bottom: 1.5px dotted #64748b; height: 22px; margin-top: 2px;"></div><div style="border-bottom: 1.5px dotted #64748b; height: 22px; margin-top: 4px;"></div><div style="border-bottom: 1.5px dotted #64748b; height: 22px; margin-top: 4px;"></div>`;

    bodyHtml = `
      <div style="padding-left: 18px; margin-top: 6px;">
        <div style="background-color: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #fecdd3; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: #881337; font-size: 9pt;">🌐 បរិបទស្ថានភាពជាក់ស្តែង (PISA Scenario)</strong>
            <span style="background-color: #fff; border: 1px solid #f43f5e; color: #9f1239; padding: 1px 6px; border-radius: 4px; font-size: 8pt; font-weight: bold;">ដែនសមត្ថភាព ៖ ${domainLabel}</span>
          </div>
          <div style="font-size: 9.5pt; color: #1e293b; font-style: italic; line-height: 1.4;">
            ${q.pisaContext || 'ពិនិត្យទិន្នន័យជាក់ស្តែង និងដោះស្រាយបញ្ហាខាងក្រោម។'}
          </div>
        </div>
        ${subPartsHtml}
      </div>
    `;
  } else if (qType === 'reading_comprehension') {
    const subQuestionsHtml = (q.passageQuestions || [])
      .map((pq, pqIdx) => {
        const letter = KHMER_OPTION_LETTERS[pqIdx] || String.fromCharCode(65 + pqIdx);
        return `
          <div style="margin-top: 6px;">
            <div style="font-weight: bold; font-size: 9.5pt;">${letter}. ${pq.question}</div>
            ${
              options.showAnswerKey && pq.answer
                ? `<div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 4px 8px; border-radius: 4px; font-size: 9pt; margin-top: 3px;"><strong style="color: #065f46;">ចម្លើយ ៖</strong> ${pq.answer}</div>`
                : `<div style="border-bottom: 1px dotted #64748b; height: 18px; margin-top: 2px;"></div><div style="border-bottom: 1px dotted #64748b; height: 18px; margin-top: 3px;"></div>`
            }
          </div>
        `;
      })
      .join('');

    bodyHtml = `
      <div style="padding-left: 18px; margin-top: 6px;">
        <div style="background-color: #eef2ff; border: 1.5px solid #c7d2fe; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px;">
          <strong style="color: #312e81; font-size: 9pt; display: block; border-bottom: 1px solid #c7d2fe; padding-bottom: 3px; margin-bottom: 4px;">📖 អត្ថបទអំណាន ៖ ${q.passageTitle || '« អត្ថបទខ្លីសម្រាប់អានយល់ន័យ »'}</strong>
          <p style="font-size: 9.5pt; color: #1e293b; text-indent: 18px; margin: 0; line-height: 1.4;">${q.passageText || ''}</p>
        </div>
        ${subQuestionsHtml}
      </div>
    `;
  } else if (qType === 'essay') {
    bodyHtml = `
      <div style="padding-left: 18px; margin-top: 6px;">
        ${
          q.essayRubric
            ? `<div style="background-color: #f8fafc; border-left: 3.5px solid #475569; padding: 4px 8px; font-size: 8.5pt; color: #334155; margin-bottom: 6px;"><strong>លក្ខណៈវិនិច្ឆ័យវាយតម្លៃ ៖</strong> ${q.essayRubric}</div>`
            : ''
        }
        ${
          options.showAnswerKey
            ? `<div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 6px 10px; border-radius: 6px; font-size: 9.5pt;"><strong style="color: #065f46;">គំនិតសំខាន់ៗ និងគន្លឹះតែងសេចក្តី ៖ </strong><p style="margin: 3px 0 0 0; color: #047857;">${q.correctAnswer || '(គំនិតពិចារណាគំរូ)'}</p></div>`
            : `<div style="font-size: 9.5pt; color: #475569;">សំណេរឆ្លើយរបស់សិស្ស ៖</div><div style="border-bottom: 1.5px dotted #64748b; height: 22px; margin-top: 2px;"></div><div style="border-bottom: 1.5px dotted #64748b; height: 22px; margin-top: 4px;"></div><div style="border-bottom: 1.5px dotted #64748b; height: 22px; margin-top: 4px;"></div><div style="border-bottom: 1.5px dotted #64748b; height: 22px; margin-top: 4px;"></div>`
        }
      </div>
    `;
  } else if (qType === 'multi_select') {
    const optionsList = (q.options || [])
      .map((opt, oIdx) => {
        const letter = KHMER_OPTION_LETTERS[oIdx] || String.fromCharCode(65 + oIdx);
        const isAnswer = options.showAnswerKey && opt.isCorrect;
        return `
          <div style="display: inline-block; width: 48%; margin-bottom: 6px; vertical-align: top; ${
            isAnswer ? 'background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 4px; padding: 2px 4px;' : ''
          }">
            <span style="display: inline-block; width: 16px; height: 16px; border: 1.5px solid ${
              isAnswer ? '#059669' : '#475569'
            }; text-align: center; line-height: 14px; font-weight: bold; font-size: 9pt; ${
          isAnswer ? 'background-color: #059669; color: #fff;' : 'color: #334155;'
        }">${isAnswer ? '✔' : ''}</span>
            <span style="font-size: 9.5pt; margin-left: 6px; ${isAnswer ? 'font-weight: bold; color: #065f46;' : ''}">${letter}. ${opt.text}</span>
          </div>
        `;
      })
      .join('');

    bodyHtml = `
      <div style="padding-left: 18px; margin-top: 6px;">
        <div style="font-size: 8.5pt; color: #64748b; font-style: italic; margin-bottom: 4px;">* គូសសញ្ញា [✔] ក្នុងប្រអប់ចម្លើយត្រឹមត្រូវទាំងអស់</div>
        ${optionsList}
      </div>
    `;
  }

  if (options.showAnswerKey && q.explanation) {
    bodyHtml += `
      <div style="padding-left: 18px; margin-top: 6px;">
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 4px 8px; font-size: 8.5pt; color: #78350f;">
          <strong style="color: #92400e;">💡 ការពន្យល់ & គន្លឹះដោះស្រាយ ៖</strong> ${q.explanation}
        </div>
      </div>
    `;
  }

  const badgeBg =
    theme === 'pisa_academic'
      ? '#881337'
      : theme === 'modern_indigo'
      ? '#312e81'
      : theme === 'primary_friendly'
      ? '#0f766e'
      : '#1e1b4b';

  return `
    <div style="margin-bottom: 16px; page-break-inside: avoid;">
      <div style="font-size: 10.5pt; font-weight: bold; color: #0f172a; margin-bottom: 4px;">
        <span style="background-color: ${badgeBg}; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-family: 'Khmer OS Muol Light', 'Moul', serif; font-size: 9pt;">សំណួរទី ${khmerNum}</span>
        <span style="margin-left: 6px; font-family: 'Kantumruy Pro', 'Siemreap', sans-serif;">${q.question}</span>
        ${options.showPoints ? `<span style="font-size: 9pt; font-weight: normal; color: #64748b; margin-left: 6px;">[ ${(q.points ? q.points / 1000 : 1).toFixed(1)} ពិន្ទុ ]</span>` : ''}
      </div>
      ${bodyHtml}
    </div>
  `;
}

export function generateWorksheetHtml(
  title: string,
  subject: string,
  grade: string,
  examDuration: string,
  teacherName: string,
  questions: QuizQuestion[],
  options: WorksheetOptions
): string {
  const typeInfo = WORKSHEET_TYPE_TITLES[options.sheetType] || WORKSHEET_TYPE_TITLES.worksheet;
  const theme = options.designTheme || 'moeys_classic';
  const orientation = options.pageOrientation || 'portrait';
  const isTwoPage = (options.pageMode || 'two_pages') === 'two_pages' && questions.length > 1;

  const splitIndex = isTwoPage ? computeTwoPageSplitIndex(questions) : questions.length;
  const isDense = questions.length >= 6;

  const page1Questions = questions.slice(0, splitIndex);
  const page2Questions = isTwoPage ? questions.slice(splitIndex) : [];

  const page1Html = page1Questions
    .map((q, idx) => renderHtmlQuestionItem(q, idx, options, theme, isDense))
    .join('');

  const page2Html = page2Questions
    .map((q, idx) => renderHtmlQuestionItem(q, splitIndex + idx, options, theme, isDense))
    .join('');

  // Theme borders
  let frameBorderStyle = 'border: 2px solid #0f172a;';
  if (theme === 'modern_indigo') {
    frameBorderStyle = 'border: 2px solid #4338ca; border-radius: 10px;';
  } else if (theme === 'primary_friendly') {
    frameBorderStyle = 'border: 2.5px dashed #0d9488; border-radius: 12px;';
  } else if (theme === 'pisa_academic') {
    frameBorderStyle = 'border: 2px solid #1e293b;';
  }

  // Two column style for landscape
  const columnStyle =
    orientation === 'landscape'
      ? 'column-count: 2; column-gap: 20px; -webkit-column-count: 2;'
      : '';

  const margin = options.marginMode || 'zero';
  const pageOuterPadding =
    margin === 'zero'
      ? '2mm 3mm'
      : margin === 'compact'
      ? '4mm 5mm'
      : '6mm 8mm';

  const framePaddingCss =
    margin === 'zero'
      ? 'padding: 5px 8px;'
      : margin === 'compact'
      ? 'padding: 8px 12px;'
      : 'padding: 12px 16px;';

  const isA5 = options.paperSize === 'A5';
  const pageWidth = isA5
    ? (orientation === 'landscape' ? '210mm' : '148mm')
    : (orientation === 'landscape' ? '297mm' : '210mm');
  const pageHeight = isA5
    ? (orientation === 'landscape' ? '147.5mm' : '209.5mm')
    : (orientation === 'landscape' ? '209.5mm' : '296.5mm');

  // =========================================================================
  // TYPE-SPECIFIC COMPONENT HTML GENERATORS
  // =========================================================================

  // 1. Header by sheetType
  const getHeaderHtmlByType = () => {
    switch (options.sheetType) {
      case 'exam':
        return `
          <div style="margin-bottom: ${isDense ? '4px' : '6px'}; border-bottom: 2px solid #0f172a; padding-bottom: 5px;">
            <div style="text-align: center;">
              <div class="moul" style="font-size: ${isDense ? '10pt' : '11pt'}; margin: 0;">ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div class="moul" style="font-size: ${isDense ? '8.5pt' : '9.5pt'}; margin-top: 1px;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <div style="font-size: 7.5pt; color: #475569; margin-top: 1px;">— ༺ ៚ ༻ —</div>
            </div>
            <table style="width: 100%; border: none; margin-top: 3px; font-size: 8.5pt;">
              <tr>
                <td style="width: 55%; vertical-align: top;">
                  <div style="font-weight: bold; color: #0f172a;">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
                  <div style="font-size: 8pt; color: #475569;">${options.districtOffice || 'ការិយាល័យអប់រំ យុវជន និងកីឡា'}</div>
                  <div class="moul" style="font-size: 8.5pt; color: #881337; margin-top: 1px;">${options.schoolName || 'សាលាបឋមសិក្សាគំរូ'}</div>
                </td>
                <td style="width: 45%; vertical-align: top; text-align: right; font-size: 8pt; color: #334155;">
                  <div>សម័យប្រឡង ៖ <strong>${options.examSession || options.customDate || 'ថ្ងៃទី ...... ខែ ...... ឆ្នាំ ២០២...'}</strong></div>
                  <div>មណ្ឌលប្រឡង ៖ <strong>${options.schoolName || 'សាលារៀន'}</strong></div>
                  <div>បន្ទប់ប្រឡងលេខ ៖ <strong>............</strong></div>
                </td>
              </tr>
            </table>
          </div>
        `;

      case 'homework':
        return `
          <div style="margin-bottom: ${isDense ? '4px' : '6px'}; border-bottom: 2px dashed #0d9488; padding-bottom: 5px;">
            <table style="width: 100%; border: none; font-size: 8.5pt;">
              <tr>
                <td style="width: 60%; vertical-align: middle;">
                  <div style="display: flex; align-items: center; gap: 4px; font-weight: bold; color: #134e4a; font-size: 9.5pt;">
                    <span>🏠</span> កិច្ចការស្វ័យសិក្សានៅផ្ទះ (Home Study Assignment)
                  </div>
                  <div style="font-size: 8pt; color: #047857;">${options.schoolName || 'សាលាបឋមសិក្សាគំរូ'} &bull; គ្រូបង្រៀន៖ ${teacherName}</div>
                </td>
                <td style="width: 40%; vertical-align: middle; text-align: right; font-size: 8pt;">
                  <span style="background-color: #ccfbf1; border: 1px solid #5eead4; color: #134e4a; padding: 2px 8px; border-radius: 4px; font-weight: bold;">
                    ថ្ងៃកំណត់ប្រគល់ (Due Date) ៖ ${options.customDate || '...... / ...... / ២០២...'}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        `;

      case 'test':
        return `
          <div style="margin-bottom: ${isDense ? '4px' : '6px'}; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">
            <div style="text-align: center;">
              <div class="moul" style="font-size: ${isDense ? '10pt' : '11pt'}; margin: 0;">ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div class="moul" style="font-size: ${isDense ? '8.5pt' : '9.5pt'}; margin-top: 1px;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <div style="font-size: 7.5pt; color: #475569; margin-top: 1px;">— ༺ ៚ ༻ —</div>
            </div>
            <table style="width: 100%; border: none; margin-top: 3px; font-size: 8.5pt;">
              <tr>
                <td style="width: 55%; vertical-align: top;">
                  <div style="font-weight: bold; color: #1e3a8a;">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
                  <div class="moul" style="font-size: 8.5pt; color: #1e3a8a; margin-top: 1px;">${options.schoolName || 'សាលាបឋមសិក្សាគំរូ'}</div>
                </td>
                <td style="width: 45%; vertical-align: top; text-align: right; font-size: 8pt; color: #1e3a8a;">
                  <div>តេស្តវាស់ស្ទង់សមត្ថភាពប្រចាំខែ</div>
                  <div>ឆ្នាំសិក្សា ៖ <strong>២០២...-២០២...</strong></div>
                </td>
              </tr>
            </table>
          </div>
        `;

      case 'exit_ticket':
        return `
          <div style="margin-bottom: ${isDense ? '3px' : '5px'}; border-bottom: 2px dashed #b45309; padding-bottom: 4px; background-color: #fffbeb; padding: 4px 8px; border-radius: 6px;">
            <table style="width: 100%; border: none; font-size: 8.5pt;">
              <tr>
                <td style="width: 65%; vertical-align: middle;">
                  <div style="display: flex; align-items: center; gap: 4px; font-weight: bold; color: #78350f; font-size: 9pt;">
                    <span>🎟️</span> សន្លឹកកិច្ចការវាយតម្លៃចុងម៉ោង (Exit Ticket)
                  </div>
                  <div style="font-size: 8pt; color: #92400e;">${options.schoolName || 'សាលារៀន'} &bull; គ្រូ៖ ${teacherName}</div>
                </td>
                <td style="width: 35%; vertical-align: middle; text-align: right; font-size: 8pt; color: #b45309;">
                  <span>ថិរវេលាឆ្លើយ ៖ <strong>៥-១០ នាទី</strong></span>
                </td>
              </tr>
            </table>
          </div>
        `;

      case 'worksheet':
      default:
        return `
          <div style="text-align: center; margin-bottom: 3px; border-bottom: 1.5px solid #0f172a; padding-bottom: 5px;">
            <div class="moul" style="font-size: ${isDense ? '10.5pt' : '11.5pt'}; margin: 0; line-height: 1.15;">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div class="moul" style="font-size: ${isDense ? '9pt' : '10pt'}; margin-top: 1px; line-height: 1.15;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div style="font-size: 8pt; color: #475569; margin-top: 1px;">— ༺ ៚ ༻ —</div>

            <div style="text-align: left; margin-top: 3px;">
              <div style="font-size: 8.5pt; font-weight: 500;">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
              <div style="font-size: 8pt; color: #475569;">${options.districtOffice || 'ការិយាល័យអប់រំ យុវជន និងកីឡា'}</div>
              <div class="moul" style="font-size: 9pt; color: #1e1b4b; margin-top: 1px;">${options.schoolName || 'សាលាបឋមសិក្សាគំរូ'}</div>
            </div>
          </div>
        `;
    }
  };

  // 2. Title Banner by sheetType
  const getTitleBannerHtmlByType = () => {
    const badgeStyle =
      options.sheetType === 'exit_ticket'
        ? 'background-color: #fef3c7; border: 1px solid #fcd34d; color: #78350f;'
        : options.sheetType === 'exam'
        ? 'background-color: #ffe4e6; border: 1px solid #fda4af; color: #881337;'
        : options.sheetType === 'homework'
        ? 'background-color: #ccfbf1; border: 1px solid #5eead4; color: #134e4a;'
        : options.sheetType === 'test'
        ? 'background-color: #dbeafe; border: 1px solid #93c5fd; color: #1e3a8a;'
        : 'background-color: #f3e8ff; border: 1px solid #d8b4fe; color: #581c87;';

    return `
      <div style="text-align: center; margin: ${isDense ? '3px 0 4px 0' : '5px 0 7px 0'};">
        <span style="display: inline-block; padding: 1px 10px; ${badgeStyle} border-radius: 20px; font-size: 8.5pt; font-weight: bold;">
          ${typeInfo.label}
        </span>
        <div class="moul" style="font-size: ${isDense ? '10pt' : '11pt'}; margin-top: 2px; color: #0f172a;">
          ${title || 'វិញ្ញាសាប្រឡង ឬកិច្ចការស្វ័យសិក្សា'}
        </div>
        <div style="font-size: 8.5pt; color: #334155; margin-top: 1px;">
          មុខវិជ្ជា ៖ <strong>${subject}</strong> &bull; កម្រិត ៖ <strong>${grade}</strong> &bull; ថិរវេលា ៖ <strong>${examDuration}</strong>
          ${options.showPoints ? ` &bull; ពិន្ទុសរុប ៖ <strong>${options.totalScore || '១០ ពិន្ទុ'}</strong>` : ''}
        </div>
      </div>
    `;
  };

  // 3. Student Box by sheetType
  const getStudentBoxHtmlByType = () => {
    if (!options.showStudentBox) return '';

    switch (options.sheetType) {
      case 'exam':
        return `
          <table style="width: 100%; border: 1.5px solid #881337; margin-bottom: ${isDense ? '4px' : '7px'}; font-size: 8.5pt; background-color: #fff1f2;">
            <tr>
              <td style="width: 62%; padding: ${isDense ? '4px 6px' : '5px 8px'}; border-right: 1.5px solid #881337; vertical-align: top;">
                <div style="font-weight: bold; color: #881337; margin-bottom: 2px; font-size: 8pt;">ព័ត៌មានបេក្ខជនប្រឡង</div>
                <div style="margin-bottom: 2px;">ឈ្មោះបេក្ខជន ៖ .................................................... ភេទ ៖ [  ] ប្រុស [  ] ស្រី</div>
                <div style="margin-bottom: 2px;">ថ្ងៃខែឆ្នាំកំណើត ៖ ....../....../.......... អត្តលេខ ៖ .................... ថ្នាក់ ៖ <strong>${grade}</strong></div>
                <div style="font-size: 8pt; color: #475569;">បន្ទប់លេខ ៖ ............ តុលេខ ៖ ............ ហត្ថលេខាបេក្ខជន ៖ ....................</div>
              </td>
              <td style="width: 38%; padding: ${isDense ? '3px 4px' : '4px 6px'}; vertical-align: top; background-color: #ffffff;">
                <table style="width: 100%; border: none;">
                  <tr>
                    <td style="width: 50%; border-right: 1px solid #cbd5e1; text-align: center; padding: 1px;">
                      <div style="font-size: 7.5pt; color: #881337; font-weight: bold;">ពិន្ទុជាលេខ</div>
                      <div style="font-size: 11pt; font-weight: bold; color: #881337; margin-top: 1px;">........ / ១០</div>
                    </td>
                    <td style="width: 50%; text-align: center; padding: 1px;">
                      <div style="font-size: 7.5pt; color: #475569; font-weight: bold;">និទ្ទេស</div>
                      <div style="font-size: 9pt; font-weight: bold; color: #0f172a; margin-top: 1px;">A • B • C • D • E • F</div>
                    </td>
                  </tr>
                </table>
                <div style="border-top: 1px solid #e2e8f0; margin-top: 2px; padding-top: 2px; font-size: 7.5pt; color: #475569;">
                  <div>ពិន្ទុជាអក្សរ ៖ ................................................</div>
                  <div style="margin-top: 1px;">អនុរក្ស ៖ [១] ............... [២] ............... ហ.ល អ្នកកែ ៖ .........</div>
                </div>
              </td>
            </tr>
          </table>
        `;

      case 'homework':
        return `
          <table style="width: 100%; border: 1.5px solid #0d9488; margin-bottom: ${isDense ? '4px' : '7px'}; font-size: 8.5pt; background-color: #f0fdfa;">
            <tr>
              <td style="width: 55%; padding: ${isDense ? '4px 6px' : '5px 8px'}; border-right: 1px solid #0d9488; vertical-align: top;">
                <div style="font-weight: bold; color: #0f766e; margin-bottom: 2px; font-size: 8pt;">ព័ត៌មានសិស្សធ្វើកិច្ចការផ្ទះ</div>
                <div style="margin-bottom: 2px;">ឈ្មោះសិស្ស ៖ .................................................... ថ្នាក់ ៖ <strong>${grade}</strong></div>
                <div style="margin-bottom: 2px; font-size: 8pt; color: #475569;">ថ្ងៃដាក់កិច្ចការ ៖ ....../....../២០២... &bull; ថ្ងៃកំណត់ប្រគល់ ៖ ....../....../២០២...</div>
                <div style="font-size: 8pt; color: #0f766e;">
                  ពេលសិស្សចំណាយ ៖ [  ] &lt; ៣០ នាទី &bull; [  ] ៣០-៦០ នាទី &bull; [  ] &gt; ១ ម៉ោង
                </div>
              </td>
              <td style="width: 45%; padding: ${isDense ? '3px 4px' : '4px 6px'}; vertical-align: top; background-color: #ffffff;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
                  <span style="font-size: 7.5pt; font-weight: bold; color: #0f766e;">ការចូលរួមរបស់អាណាព្យាបាល</span>
                  <span style="font-size: 8pt; font-weight: bold; color: #0f172a;">ពិន្ទុ ៖ ....../១០</span>
                </div>
                <div style="font-size: 7.5pt; color: #334155; margin-top: 2px;">
                  ការយល់ ៖ [  ] ធ្វើដោយខ្លួនឯង &bull; [  ] មានជំនួយខ្លះ &bull; [  ] ពិបាកយល់
                </div>
                <div style="font-size: 7.5pt; color: #475569; margin-top: 1px;">
                  មតិមាតាបិតា ៖ ................................................................................
                </div>
              </td>
            </tr>
          </table>
        `;

      case 'test':
        return `
          <table style="width: 100%; border: 1.5px solid #1e3a8a; margin-bottom: ${isDense ? '4px' : '7px'}; font-size: 8.5pt; background-color: #eff6ff;">
            <tr>
              <td style="width: 58%; padding: ${isDense ? '4px 6px' : '5px 8px'}; border-right: 1px solid #1e3a8a; vertical-align: top;">
                <div style="margin-bottom: 2px;">ឈ្មោះសិស្ស ៖ ............................................. អត្តលេខ ៖ ............. ថ្នាក់ ៖ <strong>${grade}</strong></div>
                <div style="font-size: 8pt; color: #1e3a8a; font-weight: bold; margin-bottom: 1px;">កម្រិតសមត្ថភាព (Competency Rubric) ៖</div>
                <div style="font-size: 7.5pt; color: #334155;">
                  [  ] កម្រិត ៤ (ល្អប្រសើរ) &bull; [  ] កម្រិត ៣ (មធ្យម) &bull; [  ] កម្រិត ២ (មូលដ្ឋាន) &bull; [  ] កម្រិត ១ (ខ្សោយ)
                </div>
              </td>
              <td style="width: 42%; padding: ${isDense ? '3px 4px' : '4px 6px'}; vertical-align: top; background-color: #ffffff;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
                  <span style="font-size: 8pt; color: #1e3a8a; font-weight: bold;">ពិន្ទុតេស្ត ៖ <strong>........ / ១០</strong></span>
                  <span style="font-size: 7.5pt; color: #475569;">និទ្ទេស ៖ A • B • C • D • E</span>
                </div>
                <div style="font-size: 7.5pt; color: #475569; margin-top: 2px;">
                  អនុសាសន៍គ្រូ ៖ ............................................................................
                </div>
              </td>
            </tr>
          </table>
        `;

      case 'exit_ticket':
        return `
          <table style="width: 100%; border: 1.5px solid #b45309; margin-bottom: ${isDense ? '3px' : '5px'}; font-size: 8.5pt; background-color: #fffbeb;">
            <tr>
              <td style="width: 55%; padding: ${isDense ? '3px 5px' : '4px 6px'}; border-right: 1px solid #b45309; vertical-align: middle;">
                <div>ឈ្មោះ ៖ .................................................... ថ្នាក់ ៖ <strong>${grade}</strong> &bull; កាលបរិច្ឆេទ ៖ ....../....../២០២...</div>
              </td>
              <td style="width: 45%; padding: ${isDense ? '3px 5px' : '4px 6px'}; vertical-align: middle; background-color: #ffffff;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 8pt; color: #78350f; font-weight: bold;">ការយល់ដឹង ៖</span>
                  <span style="font-size: 7.5pt;">[  ] 😊 យល់ច្បាស់ &bull; [  ] 🤔 យល់ខ្លះៗ &bull; [  ] ❓ នៅឆ្ងល់</span>
                </div>
              </td>
            </tr>
          </table>
        `;

      case 'worksheet':
      default:
        return `
          <table style="width: 100%; border: 1.5px solid #0f172a; margin-bottom: ${isDense ? '4px' : '7px'}; font-size: 8.5pt;">
            <tr>
              <td style="width: 60%; padding: ${isDense ? '4px 6px' : '5px 8px'}; border-right: 1px solid #0f172a; vertical-align: top;">
                <div style="margin-bottom: 2px;">ឈ្មោះសិស្ស ៖ .................................................... ភេទ ៖ [  ] ប្រុស [  ] ស្រី</div>
                <div style="margin-bottom: 2px;">លេខរៀង/តុ ៖ .................... បន្ទប់លេខ ៖ .................... ថ្នាក់ ៖ <strong>${grade}</strong></div>
                <div style="font-size: 8pt; color: #475569;">គ្រូបង្រៀន ៖ <strong>${teacherName}</strong> &bull; កាលបរិច្ឆេទ ៖ ...... / ...... / ២០២...</div>
              </td>
              <td style="width: 40%; padding: ${isDense ? '3px 4px' : '4px 6px'}; vertical-align: top; text-align: center;">
                ${
                  options.showEvaluationBox
                    ? `
                  <table style="width: 100%; border: none;">
                    <tr>
                      <td style="width: 50%; border-right: 1px solid #cbd5e1; padding: 1px;">
                        <div style="font-size: 7.5pt; color: #64748b; font-weight: bold;">ពិន្ទុទទួលបាន</div>
                        <div style="font-size: 10.5pt; font-weight: bold; margin-top: 1px;">........ / ១០</div>
                      </td>
                      <td style="width: 50%; padding: 1px;">
                        <div style="font-size: 7.5pt; color: #64748b; font-weight: bold;">និទ្ទេស</div>
                        <div style="font-size: 9pt; font-weight: bold; margin-top: 1px;">A • B • C • D • E</div>
                      </td>
                    </tr>
                  </table>
                  <div style="border-top: 1px solid #e2e8f0; margin-top: 2px; padding-top: 2px; font-size: 7.5pt; text-align: left; color: #475569;">
                    មូលវិចារណ៍គ្រូ ៖ ...........................................
                  </div>
                `
                    : `
                  <div style="font-size: 10pt; font-weight: bold; padding: 4px 0;">ពិន្ទុសរុប ៖ ......... / ១០</div>
                `
                }
              </td>
            </tr>
          </table>
        `;
    }
  };

  // 4. Special Section by sheetType (Exit Ticket reflection, Exam rules, etc.)
  const getSpecialSectionHtmlByType = () => {
    if (options.sheetType === 'exit_ticket') {
      return `
        <div style="margin-top: ${isDense ? '5px' : '8px'}; border: 1.5px dashed #b45309; background-color: #fffbeb; padding: 4px 8px; border-radius: 6px; font-size: 8pt; page-break-inside: avoid; break-inside: avoid;">
          <div style="font-weight: bold; color: #78350f; margin-bottom: 2px;">💭 ការឆ្លុះបញ្ចាំងរហ័សរបស់សិស្ស (Student Quick Reflection) ៖</div>
          <table style="width: 100%; border: none;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 4px;">
                <div style="color: #92400e;">💡 អ្វីដែលខ្ញុំយល់ច្បាស់ជាងគេ ៖</div>
                <div style="color: #cbd5e1; font-size: 7.5pt;">...............................................................................</div>
              </td>
              <td style="width: 50%; vertical-align: top; padding-left: 4px;">
                <div style="color: #92400e;">❓ សំណួរដែលខ្ញុំនៅតែឆ្ងល់ ឬមិនទាន់ច្បាស់ ៖</div>
                <div style="color: #cbd5e1; font-size: 7.5pt;">...............................................................................</div>
              </td>
            </tr>
          </table>
          <div style="border-top: 1px dashed #fcd34d; margin-top: 3px; padding-top: 2px; font-size: 7.5pt; color: #78350f; display: flex; justify-content: space-between;">
            <span>ការសម្រេចរបស់គ្រូ ៖ [  ] ✔ ឆ្លងកាត់រួចរាល់ &bull; [  ] ត្រូវពន្យល់ឡើងវិញ</span>
            <span>ហត្ថលេខាគ្រូ ៖ ..........................</span>
          </div>
        </div>
      `;
    }

    if (options.sheetType === 'exam') {
      return `
        <div style="margin-top: ${isDense ? '4px' : '6px'}; border: 1px solid #fecdd3; background-color: #fff1f2; padding: 3px 6px; border-radius: 4px; font-size: 7.5pt; color: #881337; page-break-inside: avoid; break-inside: avoid;">
          <strong>⚠️ បម្រាមប្រឡង ៖</strong> ហាមដាច់ខាតមិនឱ្យបេក្ខជនយកឯកសារ ទូរសព្ទដៃ ឬឧបករណ៍អេឡិចត្រូនិកចូលបន្ទប់ប្រឡង។ ការលួចចម្លងនឹងត្រូវឱ្យសូន្យពិន្ទុ។
        </div>
      `;
    }

    if (options.sheetType === 'homework') {
      return `
        <div style="margin-top: ${isDense ? '4px' : '6px'}; border: 1px solid #99f6e4; background-color: #f0fdfa; padding: 3px 6px; border-radius: 4px; font-size: 7.5pt; color: #134e4a; page-break-inside: avoid; break-inside: avoid;">
          <strong>💡 គោលបំណងកិច្ចការផ្ទះ ៖</strong> ជំរុញឱ្យសិស្សអនុវត្តបន្ថែម និងរំលឹកមេរៀនដោយឯករាជ្យ។ សូមមាតាបិតាជួយលើកទឹកចិត្ត និងពិនិត្យការបំពេញរបស់កូនៗ។
        </div>
      `;
    }

    return '';
  };

  // 5. Signatures by sheetType
  const getSignaturesHtmlByType = () => {
    if (!options.showSignatures) return '';

    const displayDate = options.customDate || 'ថ្ងៃទី ...... ខែ ...... ឆ្នាំ ២០២...';
    const shortDate = options.customDate || '...... / ...... / ២០២...';

    switch (options.sheetType) {
      case 'exam':
        return `
          <div style="margin-top: ${isDense ? '6px' : '12px'}; border-top: 1.5px solid #881337; padding-top: ${isDense ? '3px' : '6px'}; page-break-inside: avoid; break-inside: avoid;">
            <table style="width: 100%; border: none; margin: 0;">
              <tr>
                <td style="width: 50%; text-align: center; vertical-align: top; padding: 0 4px;">
                  <div style="font-size: ${isDense ? '7.5pt' : '8pt'}; color: #475569;">បានឃើញ និងឯកភាព</div>
                  <div class="moul" style="font-size: ${isDense ? '8pt' : '9pt'}; color: #881337; margin-top: 1px;">ប្រធានមណ្ឌល / នាយកសាលា</div>
                  <div style="height: ${isDense ? '28px' : '36px'}; display: flex; align-items: center; justify-content: center;">
                    <div style="width: ${isDense ? '70px' : '85px'}; height: ${isDense ? '26px' : '32px'}; border: 1px dashed #fda4af; font-size: 7.5pt; color: #fda4af; line-height: ${isDense ? '26px' : '32px'}; margin: 1px auto;">(ទីតាំងបោះត្រា)</div>
                  </div>
                  <div style="color: #94a3b8; font-size: 8pt;">......................................</div>
                </td>
                <td style="width: 50%; text-align: center; vertical-align: top; padding: 0 4px;">
                  <div style="font-size: ${isDense ? '7.5pt' : '8pt'}; color: #475569;">${displayDate}</div>
                  <div class="moul" style="font-size: ${isDense ? '8pt' : '9pt'}; color: #1e1b4b; margin-top: 1px;">គណៈកម្មការរៀបចំវិញ្ញាសា</div>
                  <div style="height: ${isDense ? '28px' : '36px'};"></div>
                  <div style="font-weight: bold; font-size: ${isDense ? '8pt' : '9pt'};">${teacherName || '......................................'}</div>
                </td>
              </tr>
            </table>
          </div>
        `;

      case 'homework':
        return `
          <div style="margin-top: ${isDense ? '6px' : '12px'}; border-top: 1.5px solid #0d9488; padding-top: ${isDense ? '3px' : '6px'}; page-break-inside: avoid; break-inside: avoid;">
            <table style="width: 100%; border: none; margin: 0;">
              <tr>
                <td style="width: 50%; text-align: center; vertical-align: top; padding: 0 4px;">
                  <div style="font-size: ${isDense ? '7.5pt' : '8pt'}; color: #047857; font-weight: bold;">👨‍👩‍👧‍👦 ហត្ថលេខាមាតាបិតា / អាណាព្យាបាល</div>
                  <div style="font-size: 7.5pt; color: #64748b; margin-top: 1px;">(បានពិនិត្យកិច្ចការកូនរួចរាល់)</div>
                  <div style="height: ${isDense ? '28px' : '36px'};"></div>
                  <div style="color: #94a3b8; font-size: 8pt;">កាលបរិច្ឆេទ ៖ ${shortDate}</div>
                </td>
                <td style="width: 50%; text-align: center; vertical-align: top; padding: 0 4px;">
                  <div style="font-size: ${isDense ? '7.5pt' : '8pt'}; color: #475569;">${displayDate}</div>
                  <div class="moul" style="font-size: ${isDense ? '8pt' : '9pt'}; color: #0f766e; margin-top: 1px;">គ្រូបង្រៀនប្រចាំថ្នាក់</div>
                  <div style="height: ${isDense ? '28px' : '36px'};"></div>
                  <div style="font-weight: bold; font-size: ${isDense ? '8pt' : '9pt'};">${teacherName || '......................................'}</div>
                </td>
              </tr>
            </table>
          </div>
        `;

      case 'test':
        return `
          <div style="margin-top: ${isDense ? '6px' : '12px'}; border-top: 1.5px solid #1e3a8a; padding-top: ${isDense ? '3px' : '6px'}; page-break-inside: avoid; break-inside: avoid;">
            <table style="width: 100%; border: none; margin: 0;">
              <tr>
                <td style="width: 50%; text-align: center; vertical-align: top; padding: 0 4px;">
                  <div style="font-size: ${isDense ? '7.5pt' : '8pt'}; color: #475569;">បានឃើញ និងវាយតម្លៃ</div>
                  <div class="moul" style="font-size: ${isDense ? '8pt' : '9pt'}; color: #1e3a8a; margin-top: 1px;">នាយកសាលា</div>
                  <div style="height: ${isDense ? '28px' : '36px'}; display: flex; align-items: center; justify-content: center;">
                    <div style="width: ${isDense ? '70px' : '85px'}; height: ${isDense ? '26px' : '32px'}; border: 1px dashed #93c5fd; font-size: 7.5pt; color: #93c5fd; line-height: ${isDense ? '26px' : '32px'}; margin: 1px auto;">(ទីតាំងបោះត្រា)</div>
                  </div>
                  <div style="color: #94a3b8; font-size: 8pt;">......................................</div>
                </td>
                <td style="width: 50%; text-align: center; vertical-align: top; padding: 0 4px;">
                  <div style="font-size: ${isDense ? '7.5pt' : '8pt'}; color: #475569;">${displayDate}</div>
                  <div class="moul" style="font-size: ${isDense ? '8pt' : '9pt'}; color: #1e3a8a; margin-top: 1px;">គ្រូទទួលបន្ទុកវាយតម្លៃ</div>
                  <div style="height: ${isDense ? '28px' : '36px'};"></div>
                  <div style="font-weight: bold; font-size: ${isDense ? '8pt' : '9pt'};">${teacherName || '......................................'}</div>
                </td>
              </tr>
            </table>
          </div>
        `;

      case 'exit_ticket':
        return `
          <div style="margin-top: ${isDense ? '4px' : '8px'}; border-top: 1px dashed #b45309; padding-top: ${isDense ? '3px' : '5px'}; page-break-inside: avoid; break-inside: avoid;">
            <table style="width: 100%; border: none; margin: 0; font-size: 8pt;">
              <tr>
                <td style="width: 50%; text-align: left; vertical-align: middle;">
                  <span style="color: #78350f; font-weight: bold;">ត្រាត្រួតពិនិត្យ Exit Ticket ៖</span>
                  <span style="color: #94a3b8; margin-left: 6px;">[  ] ពិនិត្យរួច</span>
                </td>
                <td style="width: 50%; text-align: right; vertical-align: middle;">
                  <span style="color: #475569;">គ្រូបង្រៀន ៖ <strong>${teacherName || '..............................'}</strong> &bull; កាលបរិច្ឆេទ ៖ ${shortDate}</span>
                </td>
              </tr>
            </table>
          </div>
        `;

      case 'worksheet':
      default:
        return `
          <div style="margin-top: ${isDense ? '8px' : '16px'}; border-top: 1.5px solid #0f172a; padding-top: ${isDense ? '4px' : '8px'}; page-break-inside: avoid; break-inside: avoid;">
            <table style="width: 100%; border: none; margin: 0;">
              <tr>
                <td style="width: 50%; text-align: center; vertical-align: top; padding: 0 4px;">
                  <div style="font-size: ${isDense ? '8pt' : '8.5pt'}; color: #475569;">បានឃើញ និងឯកភាព</div>
                  <div class="moul" style="font-size: ${isDense ? '8.5pt' : '9.5pt'}; color: #0f172a; margin-top: 1px;">នាយកសាលា</div>
                  <div style="height: ${isDense ? '32px' : '42px'}; display: flex; align-items: center; justify-content: center;">
                    <div style="width: ${isDense ? '70px' : '85px'}; height: ${isDense ? '28px' : '36px'}; border: 1px dashed #94a3b8; font-size: 7.5pt; color: #94a3b8; line-height: ${isDense ? '28px' : '36px'}; margin: 2px auto;">(ទីតាំងបោះត្រា)</div>
                  </div>
                  <div style="color: #94a3b8; font-size: 8pt;">......................................</div>
                </td>
                <td style="width: 50%; text-align: center; vertical-align: top; padding: 0 4px;">
                  <div style="font-size: ${isDense ? '8pt' : '8.5pt'}; color: #475569;">${displayDate}</div>
                  <div class="moul" style="font-size: ${isDense ? '8.5pt' : '9.5pt'}; color: #1e1b4b; margin-top: 1px;">គ្រូបង្រៀនប្រចាំថ្នាក់</div>
                  <div style="height: ${isDense ? '32px' : '42px'};"></div>
                  <div style="font-weight: bold; font-size: ${isDense ? '8.5pt' : '9.5pt'};">${teacherName || '......................................'}</div>
                </td>
              </tr>
            </table>
          </div>
        `;
    }
  };

  const headerHtml = getHeaderHtmlByType();
  const titleBannerHtml = getTitleBannerHtmlByType();
  const studentBoxHtml = getStudentBoxHtmlByType();
  const specialSectionHtml = getSpecialSectionHtmlByType();
  const signaturesHtml = getSignaturesHtmlByType();

  const instructionHtml = options.instructionText
    ? `
    <div style="background-color: #fffbeb; border-left: 3.5px solid #f59e0b; padding: 3px 8px; font-size: 8pt; font-style: italic; color: #78350f; margin-bottom: ${isDense ? '5px' : '8px'};">
      <strong>ការណែនាំ ៖</strong> ${options.instructionText}
    </div>
  `
    : '';

  const answerKeyNotice = options.showAnswerKey
    ? `<div style="background-color: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 8.5pt; text-align: center; margin-bottom: 6px;">
        សន្លឹកកិច្ចការនេះជា «សន្លឹកចម្លើយគំរូ & កំណែ» សម្រាប់គ្រូបង្រៀន (Answer Key)
       </div>`
    : '';

  const page2MiniHeaderHtml = `
    <div style="padding-bottom: 4px; margin-bottom: 8px; border-bottom: 1.5px solid #0f172a; display: flex; justify-content: space-between; font-size: 8.5pt; align-items: center;">
      <div>
        <span class="moul" style="color: #1e1b4b; font-size: 9pt;">${title || 'វិញ្ញាសាប្រឡង'} (តចប់)</span>
        <span style="color: #64748b; margin-left: 6px;">&bull; មុខវិជ្ជា៖ ${subject} (${grade})</span>
      </div>
      <div style="color: #475569; font-size: 8pt;">
        <span>ឈ្មោះសិស្ស ៖ .............................................</span>
        <span style="margin-left: 8px;">លេខតុ ៖ .........</span>
        <span style="margin-left: 8px; font-weight: bold; color: #0f172a; background-color: #f1f5f9; padding: 1px 6px; border-radius: 3px;">ទំព័រទី ២ នៃ ២</span>
      </div>
    </div>
  `;

  const activeFont = getActiveCustomFontFamily();
  const activeTheme = getActiveCustomBackgroundTheme();
  const docBackgroundCss = getThemeBackgroundCss(activeTheme);

  return `
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>${title} - ${typeInfo.label}</title>
  ${getKhmerGoogleFontsLinkHtml()}
  <style>
    @page {
      size: ${options.paperSize || 'A4'} ${orientation};
      margin: 0;
    }
    @page :first { margin: 0; }
    @page :left { margin: 0; }
    @page :right { margin: 0; }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      font-family: '${activeFont}', 'Kantumruy Pro', 'Siemreap', 'Battambang', Arial, sans-serif;
      font-size: ${isDense ? (isA5 ? '7.5pt' : '8.5pt') : (isA5 ? '8.5pt' : '9.5pt')};
      color: #000;
      background: #ffffff !important;
      background-color: #ffffff !important;
      background-image: none !important;
      line-height: 1.32;
      width: 100% !important;
    }

    .moul {
      font-family: 'Khmer OS Muol Light', 'Moul', serif;
    }

    .a4-page {
      width: ${pageWidth};
      height: ${pageHeight};
      max-height: ${pageHeight};
      box-sizing: border-box;
      padding: ${pageOuterPadding};
      margin: 0 auto;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
      overflow: hidden; /* STRICT GUARANTEE: Never spill into page 3 */
      position: relative;
      background: #ffffff !important;
      background-color: #ffffff !important;
      background-image: none !important;
    }

    .a4-page.page-2,
    .a4-page.continuous-page {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    .page-inner-frame {
      ${frameBorderStyle}
      ${framePaddingCss}
      height: 100%;
      max-height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      background: #fff;
    }

    .page-content-top {
      flex-shrink: 0;
    }

    .page-questions-area {
      flex: 1 1 auto;
      overflow: hidden;
      padding: 2px 0;
    }

    .page-content-bottom {
      flex-shrink: 0;
    }

    .page-footer {
      flex-shrink: 0;
      border-top: 1px solid #cbd5e1;
      padding-top: 3px;
      font-size: 7.5pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    table {
      border-collapse: collapse;
    }
  </style>
</head>
<body>
  ${
    isTwoPage
      ? `
    <!-- ================== PAGE 1 (STRICT A4) ================== -->
    <div class="a4-page page-1">
      <div class="page-inner-frame">
        <div class="page-content-top">
          ${answerKeyNotice}
          ${headerHtml}
          ${titleBannerHtml}
          ${studentBoxHtml}
          ${instructionHtml}
        </div>

        <div class="page-questions-area" style="${columnStyle}">
          ${page1Html}
        </div>

        <div class="page-footer">
          <span>ទំព័រទី ១ នៃ ២</span>
          <span style="font-style: italic; font-weight: bold; color: #1e1b4b;">➔ សូមបន្តទៅទំព័រទី ២ ខាងក្រោយ</span>
          <span>${subject} ${grade}</span>
        </div>
      </div>
    </div>

    <!-- ================== PAGE 2 (STRICT A4) ================== -->
    <div class="a4-page page-2">
      <div class="page-inner-frame">
        <div class="page-content-top">
          ${page2MiniHeaderHtml}
        </div>

        <div class="page-questions-area" style="${columnStyle}">
          ${page2Html}
        </div>

        <div class="page-content-bottom">
          ${specialSectionHtml}
          ${signaturesHtml}

          <div class="page-footer" style="margin-top: 4px;">
            <span>${typeInfo.label} &bull; ${subject} ${grade}</span>
            <span>« ការខិតខំរៀនសូត្រនៅថ្ងៃនេះ គឺជាអនាគតដ៏ភ្លឺស្វាងនៅថ្ងៃស្អែក »</span>
            <span>ទំព័រទី ២ នៃ ២ (ចប់)</span>
          </div>
        </div>
      </div>
    </div>
  `
      : `
    <!-- ================== CONTINUOUS / SINGLE PAGE ================== -->
    <div class="a4-page continuous-page">
      <div class="page-inner-frame">
        <div class="page-content-top">
          ${answerKeyNotice}
          ${headerHtml}
          ${titleBannerHtml}
          ${studentBoxHtml}
          ${instructionHtml}
        </div>

        <div class="page-questions-area" style="${columnStyle}">
          ${page1Html}
        </div>

        <div class="page-content-bottom">
          ${specialSectionHtml}
          ${signaturesHtml}

          <div class="page-footer" style="margin-top: 4px;">
            <span>${typeInfo.label} &bull; ${subject} ${grade}</span>
            <span>« ការខិតខំរៀនសូត្រនៅថ្ងៃនេះ គឺជាអនាគតដ៏ភ្លឺស្វាងនៅថ្ងៃស្អែក »</span>
            <span>ទំព័រទី ១</span>
          </div>
        </div>
      </div>
    </div>
  `
  }

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
  `;
}

export function printWorksheetDocument(
  title: string,
  subject: string,
  grade: string,
  examDuration: string,
  teacherName: string,
  questions: QuizQuestion[],
  options: WorksheetOptions
) {
  const html = generateWorksheetHtml(title, subject, grade, examDuration, teacherName, questions, options);

  // Use hidden iframe first for seamless, instant printing without popup blocker issues
  try {
    let iframe = document.getElementById('worksheet-print-frame') as HTMLIFrameElement;
    if (iframe) {
      iframe.remove();
    }
    iframe = document.createElement('iframe');
    iframe.id = 'worksheet-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc && iframe.contentWindow) {
      doc.open();
      doc.write(html);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          openPopupAndPrint(html);
        }
      }, 500);
      return;
    }
  } catch (err) {
    console.warn('Iframe print error, falling back to popup:', err);
  }

  openPopupAndPrint(html);
}

function openPopupAndPrint(html: string) {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  } else {
    window.print();
  }
}

export function exportWorksheetToWordDoc(
  title: string,
  subject: string,
  grade: string,
  examDuration: string,
  teacherName: string,
  questions: QuizQuestion[],
  options: WorksheetOptions
) {
  const htmlBody = generateWorksheetHtml(title, subject, grade, examDuration, teacherName, questions, options);
  const orientation = options.pageOrientation || 'portrait';

  const isA5 = options.paperSize === 'A5';
  const wordPageSize = isA5
    ? (orientation === 'landscape' ? '595.3pt 419.5pt' : '419.5pt 595.3pt')
    : (orientation === 'landscape' ? '841.9pt 595.3pt' : '595.3pt 841.9pt');
  const wordMargin = isA5
    ? (orientation === 'landscape' ? '6.0mm 8.0mm 6.0mm 8.0mm' : '8.0mm 8.0mm 8.0mm 8.0mm')
    : (orientation === 'landscape' ? '8.0mm 10.0mm 8.0mm 10.0mm' : '10.0mm 12.0mm 10.0mm 12.0mm');

  const wordHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${title}</title>
<style>
  @page Section1 {
    size: ${wordPageSize};
    mso-page-orientation: ${orientation};
    margin: ${wordMargin};
    mso-header-margin: 15.0pt;
    mso-footer-margin: 15.0pt;
  }
  div.Section1 {
    page: Section1;
    font-family: 'Khmer OS Siemreap', 'Kantumruy Pro', 'Battambang', Arial, sans-serif;
  }
  body {
    font-family: 'Khmer OS Siemreap', 'Kantumruy Pro', 'Battambang', Arial, sans-serif;
    font-size: ${isA5 ? '9pt' : '10pt'};
    line-height: 1.32;
    color: #000;
  }
  .moul {
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-weight: normal;
  }
</style>
</head>
<body>
<div class="Section1">
  ${htmlBody}
</div>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff', wordHtml], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${title.replace(/[\/\\:*?"<>|]/g, '_') || 'សន្លឹកកិច្ចការ'}.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
