import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Updating All Lessons (1-13) with Pure White Theme & Full Cheerful Speech ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

// Cheerful hooks map for Lessons 1-13
const lessonHooks = {
  1: "តោះ! មកស្តាប់មេរៀនទី ១ ជីវិតរុក្ខជាតិ និងការសម្របខ្លួនទាំងអស់គ្នា! អាហាហា! ពីរោះណាស់!",
  2: "ជម្រាបសួរក្មួយៗ! តោះរៀនពីការដាំដំណាំកសិកម្មឱ្យបៃតងស្រស់បំព្រង! អាហាហា! សប្បាយខ្លាំងណាស់!",
  3: "តោះ! មកស្តាប់មេរៀនការចិញ្ចឹមសត្វពាហនៈ និងបក្សីបក្សាទាំងអស់គ្នា! អាហាហា! សប្បាយរីករាយ!",
  4: "តោះ! ស្រឡាញ់បរិស្ថានធម្មជាតិខៀវស្រងាត់ និងខ្យល់អាកាសបរិសុទ្ធទាំងអស់គ្នា! អាហាហា!",
  5: "តោះ! មកស្វែងយល់ពីធនធានធម្មជាតិដ៏មានតម្លៃរបស់ប្រទេសយើង! អាហាហា!",
  6: "តោះ! មកស្តាប់ការសិក្សាពីជីវវិទ្យានិងសុខភាពប្រដាប់បន្តពូជមនុស្សទាំងអស់គ្នា! អាហាហា!",
  7: "តោះ! មកយល់ដឹងពីការលូតលាស់នៃភាពពេញវ័យ និងការថែរក្សាសុខភាពរាងកាយ! អាហាហា!",
  8: "តោះ! មកស្តាប់ចំណេះដឹងសុខភាព និងការរៀបចំផែនការគ្រួសារ! អាហាហា!",
  9: "តោះ! មកចូលរួមរៀនមេរៀនសុខភាពបន្តពូជ និងការការពារជំងឺកាមរោគទាំងអស់គ្នា! អាហាហា!",
  10: "តោះ! មកមើលការប្រែប្រួលរូប និងការប្រែប្រួលគីមីដ៏អស្ចារ្យ! អាហាហា!",
  11: "តោះ! មកស្តាប់មេរៀនកម្ដៅ និងការចម្លងថាមពលសប្បាយៗ! អាហាហា!",
  12: "តោះ! មកស្តាប់មេរៀនចរន្តអគ្គិសនី និងសុវត្ថិភាពអគ្គិសនីទាំងអស់គ្នា! អាហាហា!",
  13: "តោះ! មកចូលរួមពិភពគីមីវិទ្យានិងពិសោធន៍ញែកល្បាយទាំងអស់គ្នា! អាហាហា! អស្ចារ្យណាស់!"
};

// Helper function to sanitize and clean dark theme classes from component code
function cleanWhiteTheme(codeStr) {
  return codeStr
    // Remove dark mode utility classes
    .replace(/\bdark:[a-zA-Z0-9_-]+/g, '')
    // Modal backdrop: dark semi-transparent with blur
    .replace(/bg-slate-900\/80/g, 'bg-slate-900/40 backdrop-blur-sm')
    .replace(/bg-slate-950\/80/g, 'bg-slate-900/40 backdrop-blur-sm')
    // Ensure inner modal background is bg-white / bg-slate-50
    .replace(/bg-slate-900\b/g, 'bg-white')
    .replace(/bg-slate-950\b/g, 'bg-white')
    .replace(/bg-slate-800\b/g, 'bg-slate-50')
    // Fix text colors for light background
    .replace(/text-white\b/g, (match, offset, string) => {
      // Keep text-white inside buttons or gradients
      const snippet = string.slice(Math.max(0, offset - 100), offset + 50);
      if (snippet.includes('gradient') || snippet.includes('bg-rose') || snippet.includes('bg-emerald') || snippet.includes('bg-blue') || snippet.includes('bg-amber') || snippet.includes('bg-purple') || snippet.includes('bg-indigo') || snippet.includes('bg-teal') || snippet.includes('btn') || snippet.includes('button')) {
        return 'text-white';
      }
      return 'text-slate-900';
    });
}

// Re-generate generator scripts
console.log("Regenerating all lesson scripts...");

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');

  // Replace dark background styles on modals and cards
  code = cleanWhiteTheme(code);

  try {
    esbuild.transformSync(code, { loader: 'js' });
    fs.writeFileSync(f, code, 'utf8');
    console.log("Processed " + f + " successfully!");
  } catch(err) {
    console.error("Error in " + f + ":", err.message);
  }
}

console.log("Done updating bundle themes!");
