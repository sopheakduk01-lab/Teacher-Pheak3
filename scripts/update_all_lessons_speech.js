import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Updating All Lessons Speech Text to Key Takeaways Summaries ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

// Read updated component codes for Lessons 11, 12, 13
let rz11Raw = fs.readFileSync('scripts/rz11_component_code.js', 'utf8').trim();
if (rz11Raw.startsWith('var Rz11 =')) rz11Raw = rz11Raw.replace(/^var Rz11\s*=\s*/, '');
if (rz11Raw.endsWith(';')) rz11Raw = rz11Raw.slice(0, -1);

let rz12Raw = fs.readFileSync('scripts/rz12_component_code.js', 'utf8').trim();
if (rz12Raw.startsWith('var Rz12 =')) rz12Raw = rz12Raw.replace(/^var Rz12\s*=\s*/, '');
if (rz12Raw.endsWith(';')) rz12Raw = rz12Raw.slice(0, -1);

let rz13Raw = fs.readFileSync('scripts/rz13_component_code.js', 'utf8').trim();
if (rz13Raw.startsWith('var Rz13 =')) rz13Raw = rz13Raw.replace(/^var Rz13\s*=\s*/, '');
if (rz13Raw.endsWith(';')) rz13Raw = rz13Raw.slice(0, -1);

const lesson1Text = "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ ៖ ទី ១. ជម្រក ៖ ជាទីកន្លែងដែលរុក្ខជាតិដុះលូតលាស់ និងរស់នៅ។ ទី ២. ការសម្របខ្លួន ៖ ជាការផ្លាស់ប្តូរទម្រង់ ឬលក្ខណៈពិសេសរបស់រុក្ខជាតិដើម្បីអាចរស់រាន និងបន្តពូជក្នុងជម្រករបស់វា។ ទី ៣. ឧទាហរណ៍ ៖ រុក្ខជាតិដើមប្រដេញ ឬប្រដេញជ្រូកសម្របខ្លួនក្នុងទឹក ដោយមានខ្យល់ក្នុងដើម ឬស្លឹក ឯដើមប្រោស ឬកាតទុស សម្របខ្លួននៅតំបន់ប្រាំងស្ងួតដោយមានបន្លា និងដើមស្តុកទឹក។ សូមចងចាំចំណុចសំខាន់ៗទាំងនេះ!";

const lesson2Text = "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ២ ៖ ការដាំដំណាំ ៖ ទី ១. សារសំខាន់ ៖ កសិកម្មជាប្រភពស្បៀងអាហារ និងសេដ្ឋកិច្ចដ៏សំខាន់។ ទី ២. បច្ចេកទេសដាំដុះ ៖ រួមមាន ៥ ជំហានសំខាន់ៗគឺ ៖ ការរៀបចំដី, ការជ្រើសរើសគ្រាប់ពូជល្អ, វិធីសាស្ត្រដាំ, ការថែទាំ (ស្រោចទឹក ជ្រោយដី ដាក់ជី កម្ចាត់សត្វល្អិត), និងការប្រមូលផលរក្សាទុក។ សូមចងចាំចំណុចសំខាន់ៗទាំងនេះ!";

const lesson3Text = "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ៣ ៖ ការថែរក្សាសត្វ ៖ ទី ១. ប្រយោជន៍នៃសត្វចិញ្ចឹម ៖ ផ្តល់អាហារូបត្ថម្ភ (សាច់ ទឹកដោះ ពង) កម្លាំងអូសទាញ ជីធម្មជាតិ និងប្រាក់ចំណូល។ ទី ២. វិធីថែរក្សាសត្វ ៖ ត្រូវរៀបចំទ្រុង ឬជម្រកស្អាត មានពន្លឺ និងខ្យល់ចេញចូល, ផ្តល់ចំណី និងទឹកស្អាតគ្រប់គ្រាន់, រក្សាអនាម័យ, និងចាក់វ៉ាក់សាំងការពារជំងឺជាប្រចាំ។ សូមចងចាំចំណុចសំខាន់ៗទាំងនេះ!";

const lesson4Text = "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ៤ ៖ បរិស្ថានធម្មជាតិ ៖ ទី ១. បរិស្ថាន ៖ ជាអ្វីៗទាំងអស់ដែលនៅជុំវិញខ្លួនយើង។ ទី ២. កត្តាបង្ក ៖ បរិស្ថានធម្មជាតិផ្សំឡើងពី កត្តាជីវៈ (មនុស្ស សត្វ រុក្ខជាតិ មីក្រូសារពាង្គកាយ) និងកត្តាអជីវៈ (ដី ទឹក ខ្យល់ ពន្លឺព្រះអាទិត្យ ថ្ម) ដែលមានទំនាក់ទំនងរស់នៅអាស្រ័យផលគ្នាទៅវិញទៅមក។ សូមចងចាំចំណុចសំខាន់ៗទាំងនេះ!";

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');

  // Replace Lesson 1-4 speech strings precisely
  code = code.replace(/tab-hero"\s*\?\s*"មេរៀនទី ១ ៖ [^"]+"/g, 'tab-hero" ? "' + lesson1Text + '"');
  code = code.replace(/tab-hero"\s*\?\s*"មេរៀនទី ២ ៖ [^"]+"/g, 'tab-hero" ? "' + lesson2Text + '"');
  code = code.replace(/tab-hero"\s*\?\s*"មេរៀនទី ៣ ៖ [^"]+"/g, 'tab-hero" ? "' + lesson3Text + '"');
  code = code.replace(/tab-hero"\s*\?\s*"មេរៀនទី ៤ ៖ [^"]+"/g, 'tab-hero" ? "' + lesson4Text + '"');

  // Replace Rz13, Rz12, Rz11
  const rz13Idx = code.indexOf("Rz13=({");
  const rz12Idx = code.indexOf(",\nRz12=({", rz13Idx !== -1 ? rz13Idx : 0);
  if (rz13Idx !== -1 && rz12Idx !== -1) {
    code = code.slice(0, rz13Idx) + "Rz13=" + rz13Raw + code.slice(rz12Idx);
  }

  const newRz12Idx = code.indexOf("Rz12=({");
  const newRz11Idx = code.indexOf(",\nRz11=({", newRz12Idx !== -1 ? newRz12Idx : 0);
  if (newRz12Idx !== -1 && newRz11Idx !== -1) {
    code = code.slice(0, newRz12Idx) + "Rz12=" + rz12Raw + code.slice(newRz11Idx);
  }

  const newRz11Idx2 = code.indexOf("Rz11=({");
  const newRz10Idx2 = code.indexOf(",\nRz10=({", newRz11Idx2 !== -1 ? newRz11Idx2 : 0);
  if (newRz11Idx2 !== -1 && newRz10Idx2 !== -1) {
    code = code.slice(0, newRz11Idx2) + "Rz11=" + rz11Raw + code.slice(newRz10Idx2);
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + f);
    fs.writeFileSync(f, code, 'utf8');
    console.log("Updated " + f + " successfully!");
  } catch (err) {
    console.error("Validation error in " + f + ":", err.message);
    process.exit(1);
  }
}

console.log("All lessons speech text successfully updated to teacher key takeaways summaries!");
