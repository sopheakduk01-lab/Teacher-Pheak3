// សៀវភៅសិក្សាគោល គណិតវិទ្យា ថ្នាក់ទី ៦ ពេញលេញ ២០ មេរៀន (១៤៥ ទំព័រ)
import { LibraryBook } from '../types';
import { mathGrade6Part1, MathLessonData } from './mathGrade6Part1';
import { mathGrade6Part2 } from './mathGrade6Part2';
import { mathGrade6Part3 } from './mathGrade6Part3';
import { mathGrade6Part4 } from './mathGrade6Part4';

export type { MathLessonData };

export const mathGrade6AllLessons = [
  ...mathGrade6Part1,
  ...mathGrade6Part2,
  ...mathGrade6Part3,
  ...mathGrade6Part4,
];

// Helper to find lesson by textbook page
export function getMathLessonByPage(pageNumber: number) {
  return mathGrade6AllLessons.find(
    (l) => pageNumber >= l.startPage && pageNumber <= l.endPage
  ) || mathGrade6AllLessons[0];
}

// Generate comprehensive full text of the entire 145 pages
export function generateMathGrade6FullText(): string {
  let text = `================================================================================
ព្រះរាជាណាចក្រកម្ពុជា
ជាតិ សាសនា ព្រះមហាក្សត្រ
ក្រសួងអប់រំ យុវជន និងកីឡា

សៀវភៅសិក្សាគោល៖ គណិតវិទ្យា ថ្នាក់ទី ៦
គ្រឹះស្ថានបោះពុម្ព និងចែកផ្សាយ
បោះពុម្ពលើកទី១១ ឆ្នាំ២០២០ ចំនួន ១១០ ០០០ ច្បាប់
ISBN : 9-789-995-001-445
================================================================================

【 គណៈកម្មការនិពន្ធ និងការរៀបរៀង 】
- គណៈកម្មការនិពន្ធ៖ លោក ព្រំ វិបុល, លោក សួន ច័ន្ទបូរី, លោក ភី ផន់, លោក ហាំ សេង
- អ្នកវាយអត្ថបទ៖ លោក ខែម ម៉ារី
- វិចិត្រករ៖ លោក គន់ ជាតិ
- រៀបរៀង៖ លោក អ៊ិន គឹមស្រ៊ុន
- រចនាទំព័រ៖ លោក ខែម ម៉ារី
- គណៈកម្មការពិនិត្យ៖ លោក ឡុង សុផេង, លោក ប៊ូ សន
- បានទទួលការអនុញ្ញាតឱ្យបោះពុម្ពផ្សាយពី ក្រសួងអប់រំ យុវជន និងកីឡា តាមប្រកាសលេខ ២៥៧៣ អយក.ប្រក. ចុះថ្ងៃទី ១៦ ខែ វិច្ឆិកា ឆ្នាំ ២០១១។

--------------------------------------------------------------------------------
【 អាមុខកថា 】
សៀវភៅគណិតវិទ្យាថ្នាក់ទី៦ ត្រូវបានរៀបចំឡើងស្របតាមកម្មវិធីសិក្សាគោលបឋមសិក្សារបស់ក្រសួងអប់រំ យុវជន និងកីឡា ដើម្បីបម្រើដល់ការបង្រៀនរបស់គ្រូ និងការរៀនរបស់សិស្សានុសិស្ស។ សៀវភៅនេះផ្តោតលើការអភិវឌ្ឍបំណិនគិតបែបវិភាគ ការដោះស្រាយបញ្ហាក្នុងជីវភាពរស់នៅជាក់ស្តែង និងការកសាងមូលដ្ឋានគ្រឹះគណិតវិទ្យារឹងមាំសម្រាប់បន្តការសិក្សានៅកម្រិតមធ្យមសិក្សា។

--------------------------------------------------------------------------------
【 បញ្ជីមាតិកាមេរៀនទាំងអស់ (២០ មេរៀន) 】
`;

  mathGrade6AllLessons.forEach((l) => {
    text += `\n• ${l.title} (ទំព័រ ${l.startPage} ដល់ ${l.endPage})\n  ${l.summary}\n`;
    l.sections.forEach((s) => {
      text += `  - ${s.title} [ទំព័រ ${s.page}]\n`;
      text += `    ខ្លឹមសារ៖ ${s.theory}\n`;
      if (s.formula) text += `    រូបមន្ត៖ ${s.formula}\n`;
      if (s.examples.length > 0) {
        text += `    ឧទាហរណ៍៖\n      * ${s.examples.join('\n      * ')}\n`;
      }
      if (s.exercises.length > 0) {
        text += `    លំហាត់ និងចំណោទ៖\n      * ${s.exercises.join('\n      * ')}\n`;
      }
    });
  });

  return text;
}

export const mathGrade6Book: LibraryBook = {
  id: 'book-math-6',
  title: 'គណិតវិទ្យា ថ្នាក់ទី ៦',
  author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)',
  category: 'គណិតវិទ្យា',
  coverUrl: '/math_grade_6_cover.jpg',
  description: 'សៀវភៅសិក្សាគោល គណិតវិទ្យា ថ្នាក់ទី ៦ ពេញលេញ ២០ មេរៀន (១៤៥ ទំព័រ) របស់ក្រសួងអប់រំ យុវជន និងកីឡា រួមមានមេរៀនចំនួន, ចំនួនទសភាគ, ប្រមាណវិធី, បរិមាត្រ, ផ្ទៃក្រឡា, ប្រភាគ, ផលធៀប, សមាមាត្រ, ល្បឿន, ចំនួនចម្រុះ, ភាគរយ, ការប្រាក់, ស្ថិតិ, រង្វាស់ពេល, មាឌ និងផ្ទៃក្រឡាសូលីត ព្រមទាំងលំហាត់ និងចំណោទពេញលេញ។',
  pagesCount: 145,
  fileType: 'pdf',
  uploadedDate: '2026-09-07',
  fileData: generateMathGrade6FullText(),
};
