import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Updating Bundle Rz14 with Crash-Safe Code ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

let rz14Raw = fs.readFileSync('scripts/rz14_component_code.js', 'utf8').trim();
if (rz14Raw.startsWith('var Rz14 =')) {
  rz14Raw = rz14Raw.replace(/^var Rz14\s*=\s*/, '');
}
if (rz14Raw.endsWith(';')) {
  rz14Raw = rz14Raw.slice(0, -1);
}

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  const rz14Idx = code.indexOf("Rz14=({");
  const rz13Idx = code.indexOf(",\nRz13=({", rz14Idx);

  if (rz14Idx !== -1 && rz13Idx !== -1) {
    code = code.slice(0, rz14Idx) + "Rz14=" + rz14Raw + code.slice(rz13Idx);
    console.log("Replaced Rz14 in " + filePath);
  } else {
    console.error("Could not find Rz14 boundaries in " + filePath);
    process.exit(1);
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + filePath);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Updated " + filePath + " successfully!");
  } catch (err) {
    console.error("Validation error in " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== Crash-Safe Rz14 Bundle Update Complete! ===");
