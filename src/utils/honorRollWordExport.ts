// Dedicated Word (.doc) and PDF (Strict 1-Page Guarantee) Exporter for Honor Roll & Certificates
import { HonorStudent } from '../components/HonorRollManager';
import { TeacherProfile } from '../types';
import { toKhmerNum } from './khmerDate';
import { getConsistentGradeDisplay, HonorRollThemeConfig } from './honorRollThemePresets';
import { getKhmerGoogleFontsLinkHtml } from './customPrintFont';

interface HonorRollExportOptions {
  periodTitle: string;
  activeYear: string;
  departmentName: string;
  officeName: string;
  schoolName: string;
  gradeClass: string;
  teacher: TeacherProfile;
  principalName: string;
  signDate: string;
  theme: HonorRollThemeConfig;
  selectedFont: string;
}

/**
 * Exports the Honor Roll Board (តារាងកិត្តិយស) to a Microsoft Word (.doc) document
 * with guaranteed 1-page layout, beautiful ornate borders, rankings, and signatures.
 */
export function exportHonorRollPosterToWord(
  honorList: HonorStudent[],
  options: HonorRollExportOptions
) {
  const {
    periodTitle,
    activeYear,
    departmentName,
    officeName,
    schoolName,
    gradeClass,
    teacher,
    principalName,
    signDate,
    theme,
    selectedFont,
  } = options;

  const rank1 = honorList.find((s) => s.rank === 1) || honorList[0];
  const rank2 = honorList.find((s) => s.rank === 2) || honorList[1];
  const rank3 = honorList.find((s) => s.rank === 3) || honorList[2];
  const rank4 = honorList.find((s) => s.rank === 4) || honorList[3];
  const rank5 = honorList.find((s) => s.rank === 5) || honorList[4];

  const r1Info = getConsistentGradeDisplay(rank1?.score, rank1?.gradeLetter);
  const r2Info = getConsistentGradeDisplay(rank2?.score, rank2?.gradeLetter);
  const r3Info = getConsistentGradeDisplay(rank3?.score, rank3?.gradeLetter);
  const r4Info = getConsistentGradeDisplay(rank4?.score, rank4?.gradeLetter);
  const r5Info = getConsistentGradeDisplay(rank5?.score, rank5?.gradeLetter);

  const mainColor = theme.frameOuterBorder || '#1e3a8a';
  const goldColor = theme.accentGoldHex || '#d97706';
  const headerColor = theme.headerTitleColor || '#1e3a8a';

  const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>តារាងកិត្តិយស_${periodTitle}_${activeYear}</title>
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page Section1 {
    size: 595.3pt 841.9pt; /* A4 Portrait in Word */
    mso-page-orientation: portrait;
    margin: 6.0mm 8.0mm 6.0mm 8.0mm;
    mso-header-margin: 15.0pt;
    mso-footer-margin: 15.0pt;
  }
  div.Section1 {
    page: Section1;
    font-family: '${selectedFont}', 'Khmer OS Siemreap', 'Kantumruy Pro', 'Battambang', Arial, sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: '${selectedFont}', 'Khmer OS Siemreap', 'Kantumruy Pro', 'Battambang', Arial, sans-serif;
    font-size: 9.5pt;
    line-height: 1.2;
    color: #0f172a;
    background-color: #ffffff;
  }
  .moul {
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-weight: normal;
  }
  table.outer-border-frame {
    width: 100%;
    border-collapse: collapse;
    border: 4.5pt double ${mainColor};
    background-color: #ffffff;
    padding: 6px;
  }
  table.inner-border-frame {
    width: 100%;
    border-collapse: collapse;
    border: 1.5pt solid ${goldColor};
    background-color: #ffffff;
  }
  .header-tbl {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2px;
  }
  .header-tbl td {
    vertical-align: top;
    padding: 0;
  }
  .title-section {
    text-align: center;
    margin: 4px 0 6px 0;
  }
  .rank-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 6px;
    margin: 4px 0;
  }
  .rank-card {
    border: 1.5pt solid ${goldColor};
    background-color: #fffdfa;
    border-radius: 8px;
    padding: 4px 6px;
    text-align: center;
  }
  .rank-card-1 {
    border: 2.5pt solid ${goldColor};
    background-color: #fefce8;
    border-radius: 10px;
    padding: 6px 8px;
    text-align: center;
  }
  .student-photo {
    width: 52px;
    height: 64px;
    object-fit: cover;
    border: 1.5pt solid ${goldColor};
    border-radius: 6px;
    display: block;
    margin: 2px auto;
  }
  .student-photo-lg {
    width: 62px;
    height: 76px;
    object-fit: cover;
    border: 2.5pt solid ${goldColor};
    border-radius: 8px;
    display: block;
    margin: 2px auto;
  }
  .score-badge {
    background-color: #fef3c7;
    color: #78350f;
    font-weight: bold;
    font-size: 8.5pt;
    padding: 1px 4px;
    border: 1px solid #fde68a;
    border-radius: 4px;
  }
  .grade-badge {
    background-color: #ecfdf5;
    color: #065f46;
    font-weight: bold;
    font-size: 8.5pt;
    padding: 1px 4px;
    border: 1px solid #a7f3d0;
    border-radius: 4px;
  }
  .signatures-tbl {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  .signatures-tbl td {
    vertical-align: top;
    text-align: center;
    width: 50%;
    font-size: 9.5pt;
  }
</style>
</head>
<body>
<div class="Section1">
  <table class="outer-border-frame">
    <tr>
      <td style="padding: 4px;">
        <table class="inner-border-frame">
          <tr>
            <td style="padding: 10px 14px;">

              <!-- Header Area -->
              <table class="header-tbl">
                <tr>
                  <td style="text-align: left; width: 50%;">
                    <div style="font-size: 9pt; color: #475569;">${departmentName}</div>
                    <div style="font-size: 9pt; color: #475569;">${officeName}</div>
                    <div style="font-size: 10.5pt; font-weight: bold; color: ${headerColor};">${schoolName}</div>
                    <div style="font-size: 9.5pt; font-weight: bold; color: #0f172a;">${gradeClass}</div>
                  </td>
                  <td style="text-align: center; width: 50%;">
                    <div class="moul" style="font-size: 10.5pt; color: ${headerColor};">ព្រះរាជាណាចក្រកម្ពុជា</div>
                    <div class="moul" style="font-size: 9.5pt; color: ${headerColor};">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                    <div style="color: ${goldColor}; font-size: 8.5pt; margin-top: 1px;">❖ ━━━━━━ ❖</div>
                  </td>
                </tr>
              </table>

              <!-- Title Banner -->
              <div class="title-section">
                <div class="moul" style="font-size: 14pt; color: ${headerColor}; letter-spacing: 0.5px;">${periodTitle}</div>
                <div style="font-size: 10pt; font-weight: bold; color: #334155; margin-top: 2px;">ឆ្នាំសិក្សា ${toKhmerNum(activeYear)}</div>
              </div>

              <!-- Podium / Ranking Section -->
              <!-- RANK 1 (Prominent Center) -->
              <div style="text-align: center; margin: 4px 0 6px 0;">
                <table style="margin: 0 auto; border-collapse: collapse;">
                  <tr>
                    <td>
                      <div class="rank-card-1" style="display: inline-block; min-width: 170px;">
                        <div style="background-color: ${goldColor}; color: #000; font-weight: 900; font-size: 9pt; padding: 2px 10px; border-radius: 12px; display: inline-block; margin-bottom: 3px;">
                          👑 ជ័យលាភីលេខ ១ (ឆ្នើម)
                        </div>
                        <img src="${rank1?.photo}" class="student-photo-lg" alt="${rank1?.name || 'Rank 1'}" />
                        <div class="moul" style="font-size: 10.5pt; color: ${headerColor}; margin: 2px 0;">${rank1?.name || 'សិស្សឆ្នើម'}</div>
                        <div style="font-size: 8.5pt; color: #475569; margin-bottom: 3px;">ភេទ៖ ${rank1?.gender || 'ស្រី'} • អត្តលេខ៖ ${rank1?.studentCode || '-'}</div>
                        <div style="margin-top: 3px;">
                          <span class="score-badge">${r1Info.scoreText}</span>
                          <span class="grade-badge" style="margin-left: 4px;">${r1Info.label}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- RANKS 2, 3 & 4, 5 (2x2 Grid) -->
              <table class="rank-table">
                <tr>
                  <!-- RANK 2 -->
                  <td style="width: 50%;">
                    <div class="rank-card">
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="width: 58px; vertical-align: middle; text-align: center;">
                            <img src="${rank2?.photo}" class="student-photo" alt="${rank2?.name || 'Rank 2'}" />
                          </td>
                          <td style="text-align: left; vertical-align: middle; padding-left: 8px;">
                            <div style="background-color: #e2e8f0; color: #0f172a; font-weight: bold; font-size: 8pt; padding: 1px 6px; border-radius: 10px; display: inline-block;">
                              🥈 លេខ ២ (${rank2?.mention || 'ឆ្នើម'})
                            </div>
                            <div class="moul" style="font-size: 9.5pt; color: #0f172a; margin: 2px 0;">${rank2?.name || 'កែវ មករា'}</div>
                            <div style="font-size: 8pt; color: #64748b;">ភេទ៖ ${rank2?.gender || 'ប្រុស'}</div>
                            <div style="margin-top: 2px;">
                              <span class="score-badge">${r2Info.scoreText}</span>
                              <span class="grade-badge" style="margin-left: 2px;">${r2Info.label}</span>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>

                  <!-- RANK 3 -->
                  <td style="width: 50%;">
                    <div class="rank-card">
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="width: 58px; vertical-align: middle; text-align: center;">
                            <img src="${rank3?.photo}" class="student-photo" alt="${rank3?.name || 'Rank 3'}" />
                          </td>
                          <td style="text-align: left; vertical-align: middle; padding-left: 8px;">
                            <div style="background-color: #fef3c7; color: #78350f; font-weight: bold; font-size: 8pt; padding: 1px 6px; border-radius: 10px; display: inline-block;">
                              🥉 លេខ ៣ (${rank3?.mention || 'ឆ្នើម'})
                            </div>
                            <div class="moul" style="font-size: 9.5pt; color: #0f172a; margin: 2px 0;">${rank3?.name || 'ចាន់ ផល្លា'}</div>
                            <div style="font-size: 8pt; color: #64748b;">ភេទ៖ ${rank3?.gender || 'ស្រី'}</div>
                            <div style="margin-top: 2px;">
                              <span class="score-badge">${r3Info.scoreText}</span>
                              <span class="grade-badge" style="margin-left: 2px;">${r3Info.label}</span>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>

                <tr>
                  <!-- RANK 4 -->
                  <td style="width: 50%;">
                    <div class="rank-card">
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="width: 58px; vertical-align: middle; text-align: center;">
                            <img src="${rank4?.photo}" class="student-photo" alt="${rank4?.name || 'Rank 4'}" />
                          </td>
                          <td style="text-align: left; vertical-align: middle; padding-left: 8px;">
                            <div style="background-color: #f1f5f9; color: #334155; font-weight: bold; font-size: 8pt; padding: 1px 6px; border-radius: 10px; display: inline-block;">
                              ⭐ លេខ ៤ (${rank4?.mention || 'ឆ្នើម'})
                            </div>
                            <div class="moul" style="font-size: 9.5pt; color: #0f172a; margin: 2px 0;">${rank4?.name || 'ស៊ន វិបុល'}</div>
                            <div style="font-size: 8pt; color: #64748b;">ភេទ៖ ${rank4?.gender || 'ប្រុស'}</div>
                            <div style="margin-top: 2px;">
                              <span class="score-badge">${r4Info.scoreText}</span>
                              <span class="grade-badge" style="margin-left: 2px;">${r4Info.label}</span>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>

                  <!-- RANK 5 -->
                  <td style="width: 50%;">
                    <div class="rank-card">
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="width: 58px; vertical-align: middle; text-align: center;">
                            <img src="${rank5?.photo}" class="student-photo" alt="${rank5?.name || 'Rank 5'}" />
                          </td>
                          <td style="text-align: left; vertical-align: middle; padding-left: 8px;">
                            <div style="background-color: #f1f5f9; color: #334155; font-weight: bold; font-size: 8pt; padding: 1px 6px; border-radius: 10px; display: inline-block;">
                              ⭐ លេខ ៥ (${rank5?.mention || 'ឆ្នើម'})
                            </div>
                            <div class="moul" style="font-size: 9.5pt; color: #0f172a; margin: 2px 0;">${rank5?.name || 'លឹម គឹមហុង'}</div>
                            <div style="font-size: 8pt; color: #64748b;">ភេទ៖ ${rank5?.gender || 'ប្រុស'}</div>
                            <div style="margin-top: 2px;">
                              <span class="score-badge">${r5Info.scoreText}</span>
                              <span class="grade-badge" style="margin-left: 2px;">${r5Info.label}</span>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Signatures Footer -->
              <table class="signatures-tbl">
                <tr>
                  <td style="text-align: center;">
                    <div style="font-size: 8.5pt; color: #64748b;">បានឃើញ និងឯកភាព</div>
                    <div class="moul" style="font-size: 9.5pt; color: ${headerColor}; margin: 2px 0 45px 0;">នាយកសាលា</div>
                    <div style="font-size: 9.5pt; font-weight: bold; color: #0f172a;">${principalName || 'លោកនាយក'}</div>
                  </td>
                  <td style="text-align: center;">
                    <div style="font-size: 8.5pt; color: #64748b;">${signDate}</div>
                    <div class="moul" style="font-size: 9.5pt; color: ${headerColor}; margin: 2px 0 45px 0;">គ្រូបន្ទុកថ្នាក់</div>
                    <div style="font-size: 9.5pt; font-weight: bold; color: #0f172a;">${teacher?.name || 'គ្រូបន្ទុកថ្នាក់'}</div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
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
  downloadLink.download = `តារាងកិត្តិយស_${periodTitle}_${activeYear}.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

/**
 * Exports a Certificate of Honor (ប័ណ្ណសរសើរ) to Microsoft Word (.doc) with A4 Landscape single page
 */
export function exportCertificateToWord(
  student: HonorStudent,
  options: HonorRollExportOptions
) {
  const {
    periodTitle,
    activeYear,
    schoolName,
    gradeClass,
    teacher,
    principalName,
    signDate,
    theme,
    selectedFont,
  } = options;

  const mainColor = theme.frameOuterBorder || '#1e3a8a';
  const goldColor = theme.accentGoldHex || '#d97706';
  const headerColor = theme.headerTitleColor || '#1e3a8a';
  const certGrade = getConsistentGradeDisplay(student?.score, student?.gradeLetter);

  const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>ប័ណ្ណសរសើរ_${student.name}_${periodTitle}</title>
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page Section1 {
    size: 841.9pt 595.3pt; /* A4 Landscape in Word */
    mso-page-orientation: landscape;
    margin: 8.0mm 10.0mm 8.0mm 10.0mm;
    mso-header-margin: 15.0pt;
    mso-footer-margin: 15.0pt;
  }
  div.Section1 {
    page: Section1;
    font-family: '${selectedFont}', 'Khmer OS Siemreap', 'Kantumruy Pro', 'Battambang', Arial, sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: '${selectedFont}', 'Khmer OS Siemreap', 'Kantumruy Pro', 'Battambang', Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.3;
    color: #0f172a;
    background-color: #ffffff;
  }
  .moul {
    font-family: 'Khmer OS Muol Light', 'Moul', serif;
    font-weight: normal;
  }
  table.outer-frame {
    width: 100%;
    border-collapse: collapse;
    border: 6pt double ${mainColor};
    padding: 6px;
    background-color: #ffffff;
  }
  table.inner-frame {
    width: 100%;
    border-collapse: collapse;
    border: 2pt solid ${goldColor};
    background-color: #ffffff;
  }
  .cert-award-box {
    border: 2pt dashed ${goldColor};
    background-color: #fffdf5;
    border-radius: 12px;
    padding: 6px 16px;
    margin: 6px auto;
    text-align: center;
    max-width: 480px;
  }
</style>
</head>
<body>
<div class="Section1">
  <table class="outer-frame">
    <tr>
      <td style="padding: 4px;">
        <table class="inner-frame">
          <tr>
            <td style="padding: 16px 24px; text-align: center;">

              <!-- Header -->
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: left; width: 45%; vertical-align: top;">
                    <div style="font-size: 11pt; font-weight: bold; color: ${headerColor};">${schoolName}</div>
                    <div style="font-size: 9.5pt; color: #475569;">${gradeClass} • ឆ្នាំសិក្សា ${toKhmerNum(activeYear)}</div>
                  </td>
                  <td style="text-align: center; width: 55%; vertical-align: top;">
                    <div class="moul" style="font-size: 12pt; color: ${headerColor};">ព្រះរាជាណាចក្រកម្ពុជា</div>
                    <div class="moul" style="font-size: 11pt; color: ${headerColor};">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                    <div style="color: ${goldColor}; font-size: 9pt;">❖ ━━━━━━ ❖</div>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <div style="margin: 8px 0 6px 0;">
                <div class="moul" style="font-size: 24pt; color: ${headerColor}; letter-spacing: 2px;">ប័ណ្ណសរសើរ</div>
                <div style="font-size: 10pt; font-weight: bold; color: ${goldColor}; letter-spacing: 1px;">CERTIFICATE OF HONOR</div>
              </div>

              <!-- Body Presentation -->
              <div style="font-size: 11pt; color: #334155; margin: 4px 0;">
                នាយកសាលា និងលោកគ្រូ/អ្នកគ្រូបន្ទុកថ្នាក់ សូមសម្តែងនូវការកោតសរសើរ និងផ្តល់កិត្តិយសជូនដល់៖
              </div>

              <!-- Student Profile Row -->
              <table style="margin: 6px auto; border-collapse: collapse;">
                <tr>
                  <td style="padding-right: 16px; vertical-align: middle;">
                    <img src="${student.photo}" style="width: 75px; height: 95px; object-fit: cover; border-radius: 8px; border: 2.5pt solid ${goldColor};" />
                  </td>
                  <td style="text-align: left; vertical-align: middle;">
                    <div class="moul" style="font-size: 16pt; color: ${headerColor};">${student.name}</div>
                    <div style="font-size: 10pt; font-weight: bold; color: #475569; margin: 2px 0;">
                      ភេទ៖ ${student.gender} • អត្តលេខ៖ ${student.studentCode || '-'}
                    </div>
                    <div style="font-size: 9.5pt; font-weight: bold; color: #475569;">
                      សិស្ស${gradeClass} នៃ${schoolName}
                    </div>
                  </td>
                </tr>
              </table>

              <div style="font-size: 10.5pt; color: #334155; margin: 4px 0;">
                ដែលបានខិតខំប្រឹងប្រែងរៀនសូត្រ ប្រកបដោយវិន័យ សីលធម៌ល្អ និងទទួលបានលទ្ធផលឆ្នើម៖
              </div>

              <!-- Award Highlight Box -->
              <div class="cert-award-box">
                <div style="font-size: 14pt; font-weight: 900; color: #b45309; margin-bottom: 2px;">
                  🏆 ចំណាត់ថ្នាក់៖ ${student.mention || `ជ័យលាភីលេខ ${toKhmerNum(student.rank)}`}
                </div>
                <div style="font-size: 11pt; font-weight: bold; color: ${headerColor};">
                  ${certGrade.scoreText} • ${certGrade.label}
                </div>
                <div style="font-size: 9.5pt; color: #64748b; margin-top: 2px;">
                  ${periodTitle} • ឆ្នាំសិក្សា ${toKhmerNum(activeYear)}
                </div>
              </div>

              <!-- Signatures -->
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                  <td style="width: 50%; text-align: center; vertical-align: top;">
                    <div style="font-size: 9pt; color: #64748b;">បានឃើញ និងឯកភាព</div>
                    <div class="moul" style="font-size: 10pt; color: ${headerColor}; margin: 2px 0 45px 0;">នាយកសាលា</div>
                    <div style="font-size: 10.5pt; font-weight: bold; color: #0f172a;">${principalName}</div>
                  </td>
                  <td style="width: 50%; text-align: center; vertical-align: top;">
                    <div style="font-size: 9pt; color: #64748b;">${signDate}</div>
                    <div class="moul" style="font-size: 10pt; color: ${headerColor}; margin: 2px 0 45px 0;">គ្រូបន្ទុកថ្នាក់</div>
                    <div style="font-size: 10.5pt; font-weight: bold; color: #0f172a;">${teacher?.name}</div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
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
  downloadLink.download = `ប័ណ្ណសរសើរ_${student.name}_${periodTitle}.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

/**
 * Robust, Universal Print & PDF Dispatcher with Hidden IFrame & Pop-up Support
 */
export function printDocumentWithFallback(fullHtml: string, title: string) {
  try {
    const printWindow = window.open('', '_blank', 'width=1050,height=1100,menubar=no,toolbar=no,location=no,status=no');
    if (printWindow && !printWindow.closed) {
      printWindow.document.open();
      printWindow.document.write(fullHtml);
      printWindow.document.close();

      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch (err) {
          console.warn('Popup print trigger failed, attempting direct print', err);
        }
      }, 400);
      return;
    }
  } catch (e) {
    console.warn('Popup blocked or error opening print window, falling back to hidden iframe:', e);
  }

  // Fallback: Invisible iframe inside current document (guaranteed to work in sandboxed iframes & popup blockers)
  const existingIframe = document.getElementById('moeys_honor_roll_print_frame');
  if (existingIframe) {
    existingIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'moeys_honor_roll_print_frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(fullHtml);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('IFrame print error:', err);
        window.print();
      }
      setTimeout(() => {
        iframe.remove();
      }, 60000);
    }, 500);
  } else {
    window.print();
  }
}

/**
 * Strict 1-Page PDF & Print Service for Honor Roll Board Poster (A4 Portrait)
 */
export function printHonorRollSinglePagePdf(
  htmlContent: string,
  title: string,
  selectedFont: string
) {
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="km">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page { size: A4 portrait; margin: 0mm !important; }
          *, *::before, *::after { box-sizing: border-box !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0 !important; padding: 0 !important; width: 210mm !important; height: 297mm !important; max-width: 210mm !important; max-height: 297mm !important; background: #ffffff !important; font-family: '${selectedFont}', 'Kantumruy Pro', 'Khmer OS Siemreap', sans-serif; overflow: hidden !important; }
          .no-print { display: flex; gap: 8px; position: fixed; top: 12px; right: 12px; z-index: 99999; }
          @media print { .no-print { display: none !important; } }
          .poster-single-page-sheet { width: 210mm !important; height: 297mm !important; max-height: 297mm !important; margin: 0 auto !important; padding: 6mm 8mm !important; box-sizing: border-box !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; background: #ffffff !important; background-color: #ffffff !important; background-image: none !important; }
          .moul { font-family: 'Moul', 'Khmer OS Muol Light', cursive; }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()" style="background:#d97706;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);">🖨️ បោះពុម្ព / Save as PDF</button>
          <button onclick="window.close()" style="background:#475569;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;">បិទ</button>
        </div>
        <div class="poster-single-page-sheet">
          ${htmlContent}
        </div>
        <script>
          setTimeout(function() { window.focus(); window.print(); }, 350);
        </script>
      </body>
    </html>
  `;
  printDocumentWithFallback(fullHtml, title);
}

/**
 * Strict 1-Page PDF & Print Service for Honor Roll Board (A4 Portrait)
 */
export function exportHonorRollBoardToPdfPrint(
  honorList: HonorStudent[],
  options: HonorRollExportOptions
) {
  const {
    periodTitle,
    activeYear,
    departmentName,
    officeName,
    schoolName,
    gradeClass,
    teacher,
    principalName,
    signDate,
    theme,
    selectedFont,
  } = options;

  const rank1 = honorList.find((s) => s.rank === 1) || honorList[0];
  const rank2 = honorList.find((s) => s.rank === 2) || honorList[1];
  const rank3 = honorList.find((s) => s.rank === 3) || honorList[2];
  const rank4 = honorList.find((s) => s.rank === 4) || honorList[3];
  const rank5 = honorList.find((s) => s.rank === 5) || honorList[4];

  const r1Info = getConsistentGradeDisplay(rank1?.score, rank1?.gradeLetter);
  const r2Info = getConsistentGradeDisplay(rank2?.score, rank2?.gradeLetter);
  const r3Info = getConsistentGradeDisplay(rank3?.score, rank3?.gradeLetter);
  const r4Info = getConsistentGradeDisplay(rank4?.score, rank4?.gradeLetter);
  const r5Info = getConsistentGradeDisplay(rank5?.score, rank5?.gradeLetter);

  const mainColor = theme.frameOuterBorder || '#1e3a8a';
  const goldColor = theme.accentGoldHex || '#d97706';
  const headerColor = theme.headerTitleColor || '#1e3a8a';

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="km">
      <head>
        <meta charset="utf-8">
        <title>តារាងកិត្តិយស_${periodTitle}_${activeYear}</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            background: #ffffff !important;
            font-family: '${selectedFont}', 'Kantumruy Pro', 'Khmer OS Siemreap', sans-serif;
            overflow: hidden !important;
            color: #0f172a;
          }
          .no-print {
            display: flex;
            gap: 8px;
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 99999;
          }
          @media print {
            .no-print { display: none !important; }
          }
          .a4-page {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            padding: 7mm 9mm;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            background: #ffffff;
            box-sizing: border-box;
            overflow: hidden;
          }
          .ornate-border {
            border: 6px double ${mainColor};
            outline: 2px solid ${goldColor};
            outline-offset: -7px;
            width: 100%;
            height: 100%;
            padding: 5mm 7mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            box-sizing: border-box;
          }
          .moul { font-family: 'Moul', 'Khmer OS Muol Light', cursive; }
          .header-tbl { width: 100%; border-collapse: collapse; }
          .title-box { text-align: center; margin: 3px 0; }
          .rank-1-card {
            background: #fffbeb;
            border: 2px solid ${goldColor};
            border-radius: 12px;
            padding: 5px 14px;
            text-align: center;
            display: inline-block;
            margin: 1px auto;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          }
          .rank-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin: 3px 0;
          }
          .rank-card {
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            padding: 5px 8px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .badge-gold {
            background: ${goldColor};
            color: #000;
            font-weight: 900;
            font-size: 8.5pt;
            padding: 1px 8px;
            border-radius: 10px;
            display: inline-block;
          }
          .photo-lg {
            width: 65px;
            height: 78px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid ${goldColor};
            display: block;
            margin: 2px auto;
          }
          .photo-sm {
            width: 48px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
            border: 1.5px solid ${mainColor};
            display: block;
            flex-shrink: 0;
          }
          .score-tag {
            background: #fef3c7;
            color: #78350f;
            font-weight: bold;
            font-size: 8pt;
            padding: 1px 4px;
            border-radius: 4px;
            border: 1px solid #fde68a;
          }
          .grade-tag {
            background: #ecfdf5;
            color: #065f46;
            font-weight: bold;
            font-size: 8pt;
            padding: 1px 4px;
            border-radius: 4px;
            border: 1px solid #a7f3d0;
          }
          .signatures-grid {
            display: flex;
            justify-content: space-between;
            text-align: center;
            font-size: 9pt;
            padding-top: 4px;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()" style="background:#d97706;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);">🖨️ បោះពុម្ព / Save as PDF</button>
          <button onclick="window.close()" style="background:#475569;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;">បិទ</button>
        </div>

        <div class="a4-page">
          <div class="ornate-border">
            <!-- Header -->
            <table class="header-tbl">
              <tr>
                <td style="text-align: left; width: 50%; vertical-align: top;">
                  <div style="font-size: 9pt; color: #475569;">${departmentName}</div>
                  <div style="font-size: 9pt; color: #475569;">${officeName}</div>
                  <div style="font-size: 10.5pt; font-weight: bold; color: ${headerColor};">${schoolName}</div>
                  <div style="font-size: 9.5pt; font-weight: bold; color: #0f172a;">${gradeClass}</div>
                </td>
                <td style="text-align: center; width: 50%; vertical-align: top;">
                  <div class="moul" style="font-size: 11pt; color: ${headerColor};">ព្រះរាជាណាចក្រកម្ពុជា</div>
                  <div class="moul" style="font-size: 10pt; color: ${headerColor}; margin: 2px 0;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                  <div style="color: ${goldColor}; font-size: 9pt;">❖ ━━━━━━ ❖</div>
                </td>
              </tr>
            </table>

            <!-- Title -->
            <div class="title-box">
              <div class="moul" style="font-size: 13.5pt; color: ${headerColor};">${periodTitle}</div>
              <div style="font-size: 9.5pt; font-weight: bold; color: #334155; margin-top: 1px;">ឆ្នាំសិក្សា ${toKhmerNum(activeYear)} • សិស្សឆ្នើមប្រចាំថ្នាក់</div>
            </div>

            <!-- Rank 1 Center -->
            <div style="text-align: center;">
              <div class="rank-1-card">
                <div class="badge-gold">👑 ជ័យលាភីលេខ ១ (ឆ្នើម)</div>
                <img src="${rank1?.photo}" class="photo-lg" alt="${rank1?.name || 'Rank 1'}" />
                <div class="moul" style="font-size: 11pt; color: ${headerColor}; margin: 2px 0;">${rank1?.name || 'សិស្សឆ្នើម'}</div>
                <div style="font-size: 8.5pt; color: #475569;">ភេទ៖ ${rank1?.gender || 'ស្រី'} • អត្តលេខ៖ ${rank1?.studentCode || '-'}</div>
                <div style="margin-top: 2px;">
                  <span class="score-tag">${r1Info.scoreText}</span>
                  <span class="grade-tag" style="margin-left: 4px;">${r1Info.label}</span>
                </div>
              </div>
            </div>

            <!-- Ranks 2-5 Grid -->
            <div class="rank-grid">
              <!-- Rank 2 -->
              <div class="rank-card">
                <img src="${rank2?.photo}" class="photo-sm" alt="${rank2?.name || 'Rank 2'}" />
                <div style="text-align: left;">
                  <span style="background: #e2e8f0; color: #1e293b; font-weight: bold; font-size: 8pt; padding: 1px 6px; border-radius: 4px;">🥈 លេខ ២</span>
                  <div class="moul" style="font-size: 9pt; color: ${headerColor}; margin: 1px 0;">${rank2?.name || '-'}</div>
                  <div style="font-size: 7.5pt; color: #64748b;">ភេទ៖ ${rank2?.gender || '-'}</div>
                  <div style="margin-top: 2px;"><span class="score-tag">${r2Info.scoreText}</span> <span class="grade-tag">${r2Info.label}</span></div>
                </div>
              </div>

              <!-- Rank 3 -->
              <div class="rank-card">
                <img src="${rank3?.photo}" class="photo-sm" alt="${rank3?.name || 'Rank 3'}" />
                <div style="text-align: left;">
                  <span style="background: #fed7aa; color: #7c2d12; font-weight: bold; font-size: 8pt; padding: 1px 6px; border-radius: 4px;">🥉 លេខ ៣</span>
                  <div class="moul" style="font-size: 9pt; color: ${headerColor}; margin: 1px 0;">${rank3?.name || '-'}</div>
                  <div style="font-size: 7.5pt; color: #64748b;">ភេទ៖ ${rank3?.gender || '-'}</div>
                  <div style="margin-top: 2px;"><span class="score-tag">${r3Info.scoreText}</span> <span class="grade-tag">${r3Info.label}</span></div>
                </div>
              </div>

              <!-- Rank 4 -->
              <div class="rank-card">
                <img src="${rank4?.photo}" class="photo-sm" alt="${rank4?.name || 'Rank 4'}" />
                <div style="text-align: left;">
                  <span style="background: #f1f5f9; color: #334155; font-weight: bold; font-size: 8pt; padding: 1px 6px; border-radius: 4px;">🎖️ លេខ ៤</span>
                  <div class="moul" style="font-size: 9pt; color: ${headerColor}; margin: 1px 0;">${rank4?.name || '-'}</div>
                  <div style="font-size: 7.5pt; color: #64748b;">ភេទ៖ ${rank4?.gender || '-'}</div>
                  <div style="margin-top: 2px;"><span class="score-tag">${r4Info.scoreText}</span> <span class="grade-tag">${r4Info.label}</span></div>
                </div>
              </div>

              <!-- Rank 5 -->
              <div class="rank-card">
                <img src="${rank5?.photo}" class="photo-sm" alt="${rank5?.name || 'Rank 5'}" />
                <div style="text-align: left;">
                  <span style="background: #f1f5f9; color: #334155; font-weight: bold; font-size: 8pt; padding: 1px 6px; border-radius: 4px;">🎖️ លេខ ៥</span>
                  <div class="moul" style="font-size: 9pt; color: ${headerColor}; margin: 1px 0;">${rank5?.name || '-'}</div>
                  <div style="font-size: 7.5pt; color: #64748b;">ភេទ៖ ${rank5?.gender || '-'}</div>
                  <div style="margin-top: 2px;"><span class="score-tag">${r5Info.scoreText}</span> <span class="grade-tag">${r5Info.label}</span></div>
                </div>
              </div>
            </div>

            <!-- Signatures -->
            <div class="signatures-grid">
              <div style="width: 48%;">
                <div style="color: #64748b;">បានឃើញ និងឯកភាព</div>
                <div class="moul" style="font-size: 9pt; color: ${headerColor}; margin: 2px 0 34px 0;">នាយកសាលា</div>
                <div style="font-weight: bold; color: #0f172a;">${principalName}</div>
              </div>
              <div style="width: 48%;">
                <div style="color: #64748b;">${signDate}</div>
                <div class="moul" style="font-size: 9pt; color: ${headerColor}; margin: 2px 0 34px 0;">គ្រូបន្ទុកថ្នាក់</div>
                <div style="font-weight: bold; color: #0f172a;">${teacher?.name}</div>
              </div>
            </div>
          </div>
        </div>

        <script>
          setTimeout(function() {
            window.focus();
            window.print();
          }, 350);
        </script>
      </body>
    </html>
  `;

  printDocumentWithFallback(fullHtml, `តារាងកិត្តិយស_${periodTitle}_${activeYear}`);
}

/**
 * Strict 1-Page PDF & Print Service for Single Certificate
 */
export function printCertificateSinglePagePdf(
  htmlContent: string,
  title: string,
  selectedFont: string
) {
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="km">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page { size: A4 landscape; margin: 0mm !important; }
          *, *::before, *::after { box-sizing: border-box !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0 !important; padding: 0 !important; width: 297mm !important; height: 210mm !important; max-width: 297mm !important; max-height: 210mm !important; background: #ffffff !important; font-family: '${selectedFont}', 'Kantumruy Pro', 'Khmer OS Siemreap', sans-serif; overflow: hidden !important; }
          .no-print { display: flex; gap: 8px; position: fixed; top: 12px; right: 12px; z-index: 99999; }
          @media print { .no-print { display: none !important; } }
          .cert-single-page-sheet { width: 297mm !important; height: 210mm !important; max-height: 210mm !important; margin: 0 auto !important; padding: 6mm 8mm !important; box-sizing: border-box !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; }
          .moul { font-family: 'Moul', 'Khmer OS Muol Light', cursive; }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()" style="background:#d97706;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);">🖨️ បោះពុម្ព / Save as PDF</button>
          <button onclick="window.close()" style="background:#475569;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;">បិទ</button>
        </div>
        <div class="cert-single-page-sheet">
          ${htmlContent}
        </div>
        <script>
          setTimeout(function() { window.focus(); window.print(); }, 350);
        </script>
      </body>
    </html>
  `;
  printDocumentWithFallback(fullHtml, title);
}

/**
 * Strict 1-Page PDF & Print Service for Single Certificate (A4 Landscape)
 */
export function exportCertificateToPdfPrint(
  student: HonorStudent,
  options: HonorRollExportOptions
) {
  const {
    periodTitle,
    activeYear,
    schoolName,
    gradeClass,
    teacher,
    principalName,
    signDate,
    theme,
    selectedFont,
  } = options;

  const mainColor = theme.frameOuterBorder || '#1e3a8a';
  const goldColor = theme.accentGoldHex || '#d97706';
  const headerColor = theme.headerTitleColor || '#1e3a8a';
  const certGrade = getConsistentGradeDisplay(student?.score, student?.gradeLetter);

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="km">
      <head>
        <meta charset="utf-8">
        <title>ប័ណ្ណសរសើរ_${student.name}_${periodTitle}</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page {
            size: A4 landscape;
            margin: 0mm !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            background: #ffffff !important;
            font-family: '${selectedFont}', 'Kantumruy Pro', 'Khmer OS Siemreap', sans-serif;
            overflow: hidden !important;
            color: #0f172a;
          }
          .no-print {
            display: flex;
            gap: 8px;
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 99999;
          }
          @media print {
            .no-print { display: none !important; }
          }
          .cert-page {
            width: 297mm;
            height: 210mm;
            max-height: 210mm;
            padding: 7mm 9mm;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            background: #ffffff;
            box-sizing: border-box;
            overflow: hidden;
          }
          .cert-border {
            border: 8px solid ${mainColor};
            outline: 3px solid ${goldColor};
            outline-offset: -12px;
            width: 100%;
            height: 100%;
            padding: 8mm 14mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            position: relative;
            box-sizing: border-box;
          }
          .moul { font-family: 'Moul', 'Khmer OS Muol Light', cursive; }
          .cert-award-card {
            border: 2px dashed ${goldColor};
            background: #fffdf5;
            border-radius: 12px;
            padding: 6px 18px;
            margin: 4px auto;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()" style="background:#d97706;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);">🖨️ បោះពុម្ព / Save as PDF</button>
          <button onclick="window.close()" style="background:#475569;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;">បិទ</button>
        </div>

        <div class="cert-page">
          <div class="cert-border">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="text-align: left; width: 45%; vertical-align: top;">
                  <div style="font-size: 11pt; font-weight: bold; color: ${headerColor};">${schoolName}</div>
                  <div style="font-size: 9.5pt; color: #475569; margin-top: 2px;">${gradeClass} • ឆ្នាំសិក្សា ${toKhmerNum(activeYear)}</div>
                </td>
                <td style="text-align: center; width: 55%; vertical-align: top;">
                  <div class="moul" style="font-size: 12pt; color: ${headerColor};">ព្រះរាជាណាចក្រកម្ពុជា</div>
                  <div class="moul" style="font-size: 10.5pt; color: ${headerColor}; margin: 2px 0;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                  <div style="color: ${goldColor}; font-size: 9pt;">❖ ━━━━━━ ❖</div>
                </td>
              </tr>
            </table>

            <div style="margin: 2px 0;">
              <h1 class="moul" style="font-size: 24pt; color: ${headerColor}; margin: 0; letter-spacing: 2px;">ប័ណ្ណសរសើរ</h1>
              <p style="font-size: 9.5pt; font-weight: bold; color: ${goldColor}; letter-spacing: 2px; margin: 1px 0 0 0;">CERTIFICATE OF HONOR & MERIT</p>
            </div>

            <div>
              <p style="font-size: 10.5pt; color: #334155; margin: 2px 0 4px 0;">នាយកសាលា និងលោកគ្រូ/អ្នកគ្រូបន្ទុកថ្នាក់ សូមសម្តែងនូវការកោតសរសើរ និងផ្តល់កិត្តិយសជូនដល់៖</p>
              
              <div style="display: flex; justify-content: center; align-items: center; gap: 16px; margin: 4px 0;">
                <img src="${student.photo}" style="width: 75px; height: 95px; object-fit: cover; border-radius: 8px; border: 3px solid ${goldColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.12);" />
                <div style="text-align: left;">
                  <h2 class="moul" style="font-size: 15pt; color: ${headerColor}; margin: 0 0 2px 0;">${student.name}</h2>
                  <p style="font-size: 10pt; font-weight: bold; color: #475569; margin: 1px 0;">ភេទ៖ ${student.gender} • អត្តលេខ៖ ${student.studentCode || '-'}</p>
                  <p style="font-size: 10pt; font-weight: bold; color: #475569; margin: 1px 0;">សិស្ស${gradeClass} នៃ${schoolName}</p>
                </div>
              </div>

              <p style="font-size: 10.5pt; color: #334155; margin: 4px 0 3px 0;">
                ដែលបានខិតខំប្រឹងប្រែងរៀនសូត្រ ប្រកបដោយវិន័យ សីលធម៌ល្អ និងទទួលបានលទ្ធផលឆ្នើម៖
              </p>

              <div class="cert-award-card">
                <div style="font-size: 13.5pt; font-weight: 900; color: #b45309; margin-bottom: 2px;">
                  🏆 ចំណាត់ថ្នាក់៖ ${student.mention || `ជ័យលាភីលេខ ${toKhmerNum(student.rank)}`}
                </div>
                <div style="font-size: 11pt; font-weight: bold; color: ${headerColor};">
                  ${certGrade.scoreText} • ${certGrade.label}
                </div>
                <div style="font-size: 9pt; color: #64748b; margin-top: 1px;">
                  ${periodTitle} • ឆ្នាំសិក្សា ${toKhmerNum(activeYear)}
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 4px;">
              <div style="text-align: center; width: 45%;">
                <div style="font-size: 9pt; color: #64748b;">បានឃើញ និងឯកភាព</div>
                <div class="moul" style="font-size: 9.5pt; color: ${headerColor}; margin: 2px 0 30px 0;">នាយកសាលា</div>
                <div style="font-size: 10pt; font-weight: bold; color: #0f172a;">${principalName}</div>
              </div>
              <div style="text-align: center; width: 45%;">
                <div style="font-size: 9pt; color: #64748b;">${signDate}</div>
                <div class="moul" style="font-size: 9.5pt; color: ${headerColor}; margin: 2px 0 30px 0;">គ្រូបន្ទុកថ្នាក់</div>
                <div style="font-size: 10pt; font-weight: bold; color: #0f172a;">${teacher?.name}</div>
              </div>
            </div>
          </div>
        </div>

        <script>
          setTimeout(function() {
            window.focus();
            window.print();
          }, 350);
        </script>
      </body>
    </html>
  `;

  printDocumentWithFallback(fullHtml, `ប័ណ្ណសរសើរ_${student.name}_${periodTitle}`);
}

/**
 * Batch 5 Certificates PDF Print Service (A4 Landscape, 5 Pages)
 */
export function exportBatchCertificatesToPdfPrint(
  honorList: HonorStudent[],
  options: HonorRollExportOptions
) {
  const {
    periodTitle,
    activeYear,
    schoolName,
    gradeClass,
    teacher,
    principalName,
    signDate,
    theme,
    selectedFont,
  } = options;

  const mainColor = theme.frameOuterBorder || '#1e3a8a';
  const goldColor = theme.accentGoldHex || '#d97706';
  const headerColor = theme.headerTitleColor || '#1e3a8a';

  const certPagesHtml = honorList
    .map((student) => {
      const certGrade = getConsistentGradeDisplay(student?.score, student?.gradeLetter);
      return `
        <div class="cert-page">
          <div class="cert-border">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="text-align: left; width: 45%; vertical-align: top;">
                  <div style="font-size: 11pt; font-weight: bold; color: ${headerColor};">${schoolName}</div>
                  <div style="font-size: 9.5pt; color: #475569; margin-top: 2px;">${gradeClass} • ឆ្នាំសិក្សា ${toKhmerNum(activeYear)}</div>
                </td>
                <td style="text-align: center; width: 55%; vertical-align: top;">
                  <div class="moul" style="font-size: 12pt; color: ${headerColor};">ព្រះរាជាណាចក្រកម្ពុជា</div>
                  <div class="moul" style="font-size: 10.5pt; color: ${headerColor}; margin: 2px 0;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                  <div style="color: ${goldColor}; font-size: 9pt;">❖ ━━━━━━ ❖</div>
                </td>
              </tr>
            </table>

            <div style="margin: 2px 0;">
              <h1 class="moul" style="font-size: 24pt; color: ${headerColor}; margin: 0; letter-spacing: 2px;">ប័ណ្ណសរសើរ</h1>
              <p style="font-size: 9.5pt; font-weight: bold; color: ${goldColor}; letter-spacing: 2px; margin: 1px 0 0 0;">CERTIFICATE OF HONOR & MERIT</p>
            </div>

            <div>
              <p style="font-size: 10.5pt; color: #334155; margin: 2px 0 4px 0;">នាយកសាលា និងលោកគ្រូ/អ្នកគ្រូបន្ទុកថ្នាក់ សូមសម្តែងនូវការកោតសរសើរ និងផ្តល់កិត្តិយសជូនដល់៖</p>
              
              <div style="display: flex; justify-content: center; align-items: center; gap: 16px; margin: 4px 0;">
                <img src="${student.photo}" style="width: 75px; height: 95px; object-fit: cover; border-radius: 8px; border: 3px solid ${goldColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.12);" />
                <div style="text-align: left;">
                  <h2 class="moul" style="font-size: 15pt; color: ${headerColor}; margin: 0 0 2px 0;">${student.name}</h2>
                  <p style="font-size: 10pt; font-weight: bold; color: #475569; margin: 1px 0;">ភេទ៖ ${student.gender} • អត្តលេខ៖ ${student.studentCode || '-'}</p>
                  <p style="font-size: 10pt; font-weight: bold; color: #475569; margin: 1px 0;">សិស្ស${gradeClass} នៃ${schoolName}</p>
                </div>
              </div>

              <p style="font-size: 10.5pt; color: #334155; margin: 4px 0 3px 0;">
                ដែលបានខិតខំប្រឹងប្រែងរៀនសូត្រ ប្រកបដោយវិន័យ សីលធម៌ល្អ និងទទួលបានលទ្ធផលឆ្នើម៖
              </p>

              <div class="cert-award-card">
                <div style="font-size: 13.5pt; font-weight: 900; color: #b45309; margin-bottom: 2px;">
                  🏆 ចំណាត់ថ្នាក់៖ ${student.mention || `ជ័យលាភីលេខ ${toKhmerNum(student.rank)}`}
                </div>
                <div style="font-size: 11pt; font-weight: bold; color: ${headerColor};">
                  ${certGrade.scoreText} • ${certGrade.label}
                </div>
                <div style="font-size: 9pt; color: #64748b; margin-top: 1px;">
                  ${periodTitle} • ឆ្នាំសិក្សា ${toKhmerNum(activeYear)}
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 4px;">
              <div style="text-align: center; width: 45%;">
                <div style="font-size: 9pt; color: #64748b;">បានឃើញ និងឯកភាព</div>
                <div class="moul" style="font-size: 9.5pt; color: ${headerColor}; margin: 2px 0 30px 0;">នាយកសាលា</div>
                <div style="font-size: 10pt; font-weight: bold; color: #0f172a;">${principalName}</div>
              </div>
              <div style="text-align: center; width: 45%;">
                <div style="font-size: 9pt; color: #64748b;">${signDate}</div>
                <div class="moul" style="font-size: 9.5pt; color: ${headerColor}; margin: 2px 0 30px 0;">គ្រូបន្ទុកថ្នាក់</div>
                <div style="font-size: 10pt; font-weight: bold; color: #0f172a;">${teacher?.name}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="km">
      <head>
        <meta charset="utf-8">
        <title>ប័ណ្ណសរសើរសិស្សទាំង៥_${periodTitle}_${activeYear}</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page {
            size: A4 landscape;
            margin: 0mm !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            font-family: '${selectedFont}', 'Kantumruy Pro', 'Khmer OS Siemreap', sans-serif;
            color: #0f172a;
          }
          .no-print {
            display: flex;
            gap: 8px;
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 99999;
          }
          @media print {
            .no-print { display: none !important; }
          }
          .cert-page {
            width: 297mm;
            height: 210mm;
            max-height: 210mm;
            padding: 7mm 9mm;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            background: #ffffff;
            box-sizing: border-box;
            overflow: hidden;
            page-break-after: always;
          }
          .cert-border {
            border: 8px solid ${mainColor};
            outline: 3px solid ${goldColor};
            outline-offset: -12px;
            width: 100%;
            height: 100%;
            padding: 8mm 14mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            position: relative;
            box-sizing: border-box;
          }
          .moul { font-family: 'Moul', 'Khmer OS Muol Light', cursive; }
          .cert-award-card {
            border: 2px dashed ${goldColor};
            background: #fffdf5;
            border-radius: 12px;
            padding: 6px 18px;
            margin: 4px auto;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()" style="background:#d97706;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);">🖨️ បោះពុម្ពប័ណ្ណទាំង ៥ / Save as PDF</button>
          <button onclick="window.close()" style="background:#475569;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;">បិទ</button>
        </div>

        ${certPagesHtml}

        <script>
          setTimeout(function() {
            window.focus();
            window.print();
          }, 400);
        </script>
      </body>
    </html>
  `;

  printDocumentWithFallback(fullHtml, `ប័ណ្ណសរសើរសិស្សទាំង៥_${periodTitle}_${activeYear}`);
}

/**
 * Strict 1-Page PDF & Print Service for Framed Table (A4 Portrait)
 */
export function exportFramedTableToPdfPrint(
  honorList: HonorStudent[],
  options: HonorRollExportOptions
) {
  const {
    periodTitle,
    activeYear,
    departmentName,
    officeName,
    schoolName,
    gradeClass,
    teacher,
    principalName,
    signDate,
    theme,
    selectedFont,
  } = options;

  const mainColor = theme.frameOuterBorder || '#1e3a8a';
  const goldColor = theme.accentGoldHex || '#d97706';
  const headerColor = theme.headerTitleColor || '#1e3a8a';

  const rowsHtml = honorList
    .map((st, i) => {
      const tGrade = getConsistentGradeDisplay(st.score, st.gradeLetter);
      return `
        <tr style="border-bottom: 1px solid #e2e8f0; ${i % 2 === 0 ? 'background: #ffffff;' : 'background: #f8fafc;'}">
          <td style="padding: 6px; font-weight: bold; text-align: center;">
            <span style="background: #fef3c7; color: #78350f; font-weight: 900; font-size: 8.5pt; padding: 2px 6px; border-radius: 50%;">
              ${toKhmerNum(st.rank)}
            </span>
          </td>
          <td style="padding: 4px; text-align: center;">
            <img src="${st.photo}" style="width: 32px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid #cbd5e1; display: block; margin: 0 auto;" />
          </td>
          <td style="padding: 6px; font-weight: bold; color: ${headerColor}; text-align: left;">
            ${st.name}
          </td>
          <td style="padding: 6px; text-align: center; color: #475569;">${st.gender}</td>
          <td style="padding: 6px; text-align: center; font-weight: bold;">${toKhmerNum(st.khmer || st.score)}</td>
          <td style="padding: 6px; text-align: center; font-weight: bold;">${toKhmerNum(st.math || st.score)}</td>
          <td style="padding: 6px; text-align: center; font-weight: 900; color: #b45309; background: #fffbeb;">
            ${toKhmerNum(st.score)}
          </td>
          <td style="padding: 6px; text-align: center;">
            <span style="font-size: 8pt; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0; background: #ecfdf5; color: #065f46;">
              ${tGrade.label}
            </span>
          </td>
          <td style="padding: 6px; text-align: center;">
            <span style="font-size: 8pt; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid #c7d2fe; background: #e0e7ff; color: #3730a3;">
              ${st.mention}
            </span>
          </td>
        </tr>
      `;
    })
    .join('');

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="km">
      <head>
        <meta charset="utf-8">
        <title>តារាងសង្ខេបលទ្ធផលសិស្សឆ្នើម_${periodTitle}_${activeYear}</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            background: #ffffff !important;
            font-family: '${selectedFont}', 'Kantumruy Pro', 'Khmer OS Siemreap', sans-serif;
            overflow: hidden !important;
            color: #0f172a;
          }
          .no-print {
            display: flex;
            gap: 8px;
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 99999;
          }
          @media print {
            .no-print { display: none !important; }
          }
          .a4-page {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            padding: 7mm 9mm;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            background: #ffffff;
            box-sizing: border-box;
            overflow: hidden;
          }
          .ornate-border {
            border: 6px double ${mainColor};
            outline: 2px solid ${goldColor};
            outline-offset: -7px;
            width: 100%;
            height: 100%;
            padding: 5mm 7mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            box-sizing: border-box;
          }
          .moul { font-family: 'Moul', 'Khmer OS Muol Light', cursive; }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #cbd5e1;
          }
          .data-table th {
            background-color: ${mainColor};
            color: #ffffff;
            padding: 7px 5px;
            font-weight: bold;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()" style="background:#d97706;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);">🖨️ បោះពុម្ព / Save as PDF</button>
          <button onclick="window.close()" style="background:#475569;color:#fff;font-weight:bold;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;">បិទ</button>
        </div>

        <div class="a4-page">
          <div class="ornate-border">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="text-align: left; width: 50%; vertical-align: top;">
                  <div style="font-size: 9pt; color: #475569;">${departmentName}</div>
                  <div style="font-size: 9pt; color: #475569;">${officeName}</div>
                  <div style="font-size: 10.5pt; font-weight: bold; color: ${headerColor};">${schoolName}</div>
                  <div style="font-size: 9.5pt; font-weight: bold; color: #0f172a;">${gradeClass}</div>
                </td>
                <td style="text-align: center; width: 50%; vertical-align: top;">
                  <div class="moul" style="font-size: 11pt; color: ${headerColor};">ព្រះរាជាណាចក្រកម្ពុជា</div>
                  <div class="moul" style="font-size: 10pt; color: ${headerColor}; margin: 2px 0;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                  <div style="color: ${goldColor}; font-size: 9pt;">❖ ━━━━━━ ❖</div>
                </td>
              </tr>
            </table>

            <div style="text-align: center; margin: 5px 0;">
              <div class="moul" style="font-size: 13.5pt; color: ${headerColor};">${periodTitle}</div>
              <div style="font-size: 9.5pt; font-weight: bold; color: #334155; margin-top: 1px;">ឆ្នាំសិក្សា ${toKhmerNum(activeYear)} • តារាងសង្ខេបលទ្ធផលសិស្សឆ្នើម</div>
            </div>

            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 35px;">ល.រ</th>
                  <th style="width: 45px;">រូបថត</th>
                  <th style="text-align: left;">គោត្តនាម-នាម</th>
                  <th style="width: 35px;">ភេទ</th>
                  <th style="width: 55px;">ភាសាខ្មែរ</th>
                  <th style="width: 55px;">គណិត</th>
                  <th style="width: 65px;">មធ្យមភាគ</th>
                  <th style="width: 65px;">និទ្ទេស</th>
                  <th style="width: 75px;">កិត្តិយស</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>

            <div style="display: flex; justify-content: space-between; text-align: center; font-size: 9pt; padding-top: 6px; border-top: 1px solid #e2e8f0;">
              <div style="width: 48%;">
                <div style="color: #64748b;">បានឃើញ និងឯកភាព</div>
                <div class="moul" style="font-size: 9pt; color: ${headerColor}; margin: 2px 0 34px 0;">នាយកសាលា</div>
                <div style="font-weight: bold; color: #0f172a;">${principalName}</div>
              </div>
              <div style="width: 48%;">
                <div style="color: #64748b;">${signDate}</div>
                <div class="moul" style="font-size: 9pt; color: ${headerColor}; margin: 2px 0 34px 0;">គ្រូបន្ទុកថ្នាក់</div>
                <div style="font-weight: bold; color: #0f172a;">${teacher?.name}</div>
              </div>
            </div>
          </div>
        </div>

        <script>
          setTimeout(function() {
            window.focus();
            window.print();
          }, 350);
        </script>
      </body>
    </html>
  `;

  printDocumentWithFallback(fullHtml, `តារាងសង្ខេបលទ្ធផល_${periodTitle}_${activeYear}`);
}
