import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Updating Lesson 15 Grade from ថ្នាក់ទី ៧-៨ to ថ្នាក់ទី ៦ ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js', 'scripts/make_perfect_lesson15.js', 'scripts/rz15_component_code.js', 'scripts/inject_science_lesson_15.js', 'scripts/force_insert_lesson15_carousel_card.js'];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  // Replacements
  if (code.includes('ថ្នាក់ទី ៧-៨')) {
    code = code.replaceAll('ថ្នាក់ទី ៧-៨', 'ថ្នាក់ទី ៦');
    modified = true;
  }

  if (code.includes('រូបវិទ្យាថ្នាក់ទី ៧-៨')) {
    code = code.replaceAll('រូបវិទ្យាថ្នាក់ទី ៧-៨', 'វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦');
    modified = true;
  }

  if (modified) {
    if (filePath.endsWith('.js') && (filePath.includes('public/') || filePath.includes('dist/'))) {
      try {
        esbuild.transformSync(code, { loader: 'js' });
        console.log("Validation SUCCESS for " + filePath);
      } catch (err) {
        console.error("Validation error in " + filePath + ":", err.message);
        process.exit(1);
      }
    }
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Saved updated grade 6 in " + filePath);
  } else {
    console.log("No Grade 7-8 found in " + filePath);
  }
}

console.log("=== Lesson 15 Grade Updated to ថ្នាក់ទី ៦ Successfully! ===");
