import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Updating Bundle with New Khmer TTS Rz13 ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

let rz13Raw = fs.readFileSync('scripts/rz13_component_code.js', 'utf8').trim();
if (rz13Raw.startsWith('var Rz13 =')) {
  rz13Raw = rz13Raw.replace(/^var Rz13\s*=\s*/, '');
}
if (rz13Raw.endsWith(';')) {
  rz13Raw = rz13Raw.slice(0, -1);
}

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');
  const rz13Idx = code.indexOf("Rz13=({");
  const rz12Idx = code.indexOf(",\nRz12=({", rz13Idx);
  if (rz13Idx === -1 || rz12Idx === -1) {
    console.error("Could not find Rz13/Rz12 boundaries in " + f);
    process.exit(1);
  }
  
  const newRz13Part = "Rz13=" + rz13Raw;
  const newCode = code.slice(0, rz13Idx) + newRz13Part + code.slice(rz12Idx);
  
  try {
    esbuild.transformSync(newCode, { loader: 'js' });
    console.log("Validation SUCCESS for " + f);
    fs.writeFileSync(f, newCode, 'utf8');
    console.log("Updated " + f + " successfully!");
  } catch (err) {
    console.error("Validation error in " + f + ":", err.message);
    process.exit(1);
  }
}
console.log("All bundles updated with enhanced Khmer Speech Engine!");
