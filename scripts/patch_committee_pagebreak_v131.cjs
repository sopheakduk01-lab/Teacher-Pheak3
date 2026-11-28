const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const targetPath = path.join(process.cwd(), "public/assets/index-BwPwHqBe.js");
let code = fs.readFileSync(targetPath, "utf8");

function replaceExact(label, oldStr, newStr) {
  const idx = code.indexOf(oldStr);
  if (idx === -1) {
    throw new Error(`Pattern not found for [${label}]`);
  }
  const second = code.indexOf(oldStr, idx + 1);
  if (second !== -1) {
    throw new Error(`Pattern matched multiple times for [${label}]`);
  }
  code = code.slice(0, idx) + newStr + code.slice(idx + oldStr.length);
  console.log(`✓ Applied: ${label}`);
}

replaceExact(
  "Add page break before sanitation table in committeeHtml",
  `    <table style="width:100%;border-collapse:collapse;font-size:9pt;border-radius:8px;overflow:hidden;">`,
  `    <!-- PAGE BREAK: Separate Page 2 for Sanitation & Weekly Rotation Table -->
    <div style="page-break-before:always;break-before:page;height:1px;"></div>
    <div style="font-family:moul,serif;font-size:11pt;font-weight:bold;color:#047857;text-align:center;margin-bottom:8px;padding-bottom:5px;border-bottom:2px solid #059669;">📅 តារាងវេនអនាម័យ និងសកម្មភាពប្រចាំសប្តាហ៍ (ខែទី \${fr(mShift+1)})</div>
    <table style="width:100%;border-collapse:collapse;font-size:9pt;border-radius:8px;overflow:hidden;">`
);

// Parse JS AST to guarantee 0 syntax errors
const sf = ts.createSourceFile("index.js", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  const first = sf.parseDiagnostics[0];
  throw new Error(`TS parse error at pos ${first.start}: ${ts.flattenDiagnosticMessageText(first.messageText, "\n")}`);
}

fs.writeFileSync(targetPath, code, "utf8");
console.log("✓ Validated AST and wrote updated bundle:", targetPath);
