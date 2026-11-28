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
  "Robust Pe PDF print fallback",
  `Pe=()=>{const ne=Ut(),_e=window.open("","_blank","width=1000,height=1100");if(!_e){alert("សូមអនុញ្ញាត Popup នៅក្នុងកម្មវិធីជ្រាវជ្រោល (Browser) ដើម្បីបើកផ្ទាំង PDF!");return}_e.document.open(),_e.document.write(ne),_e.document.close(),setTimeout(()=>{try{_e.__fitOiOnePage&&_e.__fitOiOnePage()}catch{}_e.focus(),_e.print()},550),u&&u("បានបើកផ្ទាំងបោះពុម្ព និងទាញយកជា PDF រួចរាល់!")}`,
  `Pe=()=>{const ne=Ut();let _e=null;try{_e=window.open("","_blank","width=1000,height=1100")}catch{}if(!_e){let iframe=document.getElementById("pdf-print-hidden-iframe");if(!iframe){iframe=document.createElement("iframe");iframe.id="pdf-print-hidden-iframe";iframe.style.cssText="position:fixed;width:0;height:0;top:0;left:0;border:none;opacity:0;pointer-events:none;";document.body.appendChild(iframe);}const idoc=iframe.contentWindow.document;idoc.open();idoc.write(ne);idoc.close();setTimeout(()=>{try{iframe.contentWindow.__fitOiOnePage&&iframe.contentWindow.__fitOiOnePage()}catch{}iframe.contentWindow.focus();iframe.contentWindow.print();},600);u&&u("បានបើកផ្ទាំងបោះពុម្ព និងទាញយកជា PDF រួចរាល់!");return;}_e.document.open();_e.document.write(ne);_e.document.close();setTimeout(()=>{try{_e.__fitOiOnePage&&_e.__fitOiOnePage()}catch{}_e.focus(),_e.print()},550);u&&u("បានបើកផ្ទាំងបោះពុម្ព និងទាញយកជា PDF រួចរាល់!")}`
);

// Parse JS AST to guarantee 0 syntax errors
const sf = ts.createSourceFile("index.js", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  const first = sf.parseDiagnostics[0];
  throw new Error(`TS parse error at pos ${first.start}: ${ts.flattenDiagnosticMessageText(first.messageText, "\n")}`);
}

fs.writeFileSync(targetPath, code, "utf8");
console.log("✓ Validated AST and wrote updated bundle:", targetPath);
