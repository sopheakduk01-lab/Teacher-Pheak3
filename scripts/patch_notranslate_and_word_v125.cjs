const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

// 1. Add Google Translate prevention (translate="no" class="notranslate" + <meta name="google" content="notranslate">)
// across all HTML print / PDF / Word popup documents so browsers (Chrome/Edge) NEVER auto-translate Khmer exports to English
src = src.replace(/<html lang="km">/g, `<html lang="km" translate="no" class="notranslate">`);
src = src.replace(/<html lang=\\"km\\">/g, `<html lang=\\"km\\" translate=\\"no\\" class=\\"notranslate\\">`);

// Also cover print popups that used bare <!DOCTYPE html>\n...<html> without lang="km"
const bareHtmlTargets = [
  {
    from: "<!DOCTYPE html>\n      <html>\n        <head>",
    to: `<!DOCTYPE html>\n      <html lang="km" translate="no" class="notranslate">\n        <head>\n          <meta name="google" content="notranslate" />`
  },
  {
    from: "<!DOCTYPE html>\n      <html>\n      <head>",
    to: `<!DOCTYPE html>\n      <html lang="km" translate="no" class="notranslate">\n      <head>\n        <meta name="google" content="notranslate" />`
  },
  {
    from: "<!DOCTYPE html>\n                      <html>\n                      <head>",
    to: `<!DOCTYPE html>\n                      <html lang="km" translate="no" class="notranslate">\n                      <head>\n                        <meta name="google" content="notranslate" />`
  },
  {
    from: "<head>\n        <meta charset=\"UTF-8\">",
    to: `<head>\n        <meta charset="UTF-8">\n        <meta name="google" content="notranslate">`
  },
  {
    from: "<head>\n  <meta charset=\"UTF-8\">",
    to: `<head>\n  <meta charset="UTF-8">\n  <meta name="google" content="notranslate">`
  },
  {
    from: "<head>\n  <meta charset=\"utf-8\" />",
    to: `<head>\n  <meta charset="utf-8" />\n  <meta name="google" content="notranslate" />`
  },
  {
    from: "<head>\n        <meta charset=\"utf-8\" />",
    to: `<head>\n        <meta charset="utf-8" />\n        <meta name="google" content="notranslate" />`
  },
  {
    from: "<head><meta charset=\"utf-8\" />",
    to: `<head><meta charset="utf-8" /><meta name="google" content="notranslate" />`
  },
  {
    from: "<head><meta charset=\\\"UTF-8\\\">",
    to: `<head><meta charset=\\"UTF-8\\"><meta name=\\"google\\" content=\\"notranslate\\">`
  },
  {
    from: "<head><meta charset=\"UTF-8\">",
    to: `<head><meta charset="UTF-8"><meta name="google" content="notranslate">`
  },
  {
    from: "<head>\n  <meta charset=\"utf-8\">",
    to: `<head>\n  <meta charset="utf-8">\n  <meta name="google" content="notranslate">`
  },
  {
    from: "<head>\n        <meta charset=\"utf-8\">",
    to: `<head>\n        <meta charset="utf-8">\n        <meta name="google" content="notranslate">`
  }
];

for (const { from, to } of bareHtmlTargets) {
  if (src.includes(from)) {
    src = src.split(from).join(to);
  }
}

// Inject notranslate into cCe body + fonts.ready before print
const cceHeadOld = `<!DOCTYPE html><html lang="km" translate="no" class="notranslate"><head>  <meta charset="UTF-8">  <title>\${r.title} - បោះពុម្ពស្តង់ដារ Word</title>`;
const cceHeadNew = `<!DOCTYPE html><html lang="km" translate="no" class="notranslate"><head>  <meta charset="UTF-8">  <meta name="google" content="notranslate">  <title>\${r.title} - បោះពុម្ពស្តង់ដារ Word</title>`;
if (src.includes(cceHeadOld)) {
  src = src.replace(cceHeadOld, cceHeadNew);
}

// 2. Upgrade oCe (Word .doc) Timetable export with vibrant day headers & subject colors + notranslate
const oceHeadOld = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>\n<head>\n<meta charset='utf-8'>\n<title>\${r.title}</title>`;
const oceHeadNew = `<html lang="km" translate="no" class="notranslate" xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>\n<head>\n<meta charset='utf-8'>\n<meta name="google" content="notranslate">\n<title>\${r.title}</title>`;
if (!src.includes(oceHeadOld)) throw new Error("Missing oceHeadOld");
src = src.replace(oceHeadOld, oceHeadNew);

const oceTableOld = `  <!-- Timetable Table -->
  <table class="timetable-grid">
    <thead>
      <tr>
        <th style="width: 11%;">ម៉ោងសិក្សា</th>
        <th style="width: 9%;">រយៈពេល</th>
        <th style="width: 13%;">ចន្ទ</th>
        <th style="width: 13%;">អង្គារ</th>
        <th style="width: 13%;">ពុធ</th>
        <th style="width: 13%;">ព្រហស្បតិ៍</th>
        <th style="width: 13%;">សុក្រ</th>
        <th style="width: 13%;">សៅរ៍</th>
      </tr>
    </thead>
    <tbody>
      \${r.rows.map(l=>l.type==="flag"?\`
            <tr>
              <td style="font-weight: bold;">\${l.time}</td>
              <td>\${l.duration}</td>
              <td colspan="6" class="bg-flag">\${l.mon}</td>
            </tr>\`:l.type==="break"?\`
            <tr>
              <td style="font-weight: bold;">\${l.time}</td>
              <td>\${l.duration}</td>
              <td colspan="6" class="bg-break">\${l.mon}</td>
            </tr>\`:` + "`" + `
          <tr>
            <td style="font-weight: bold;">\${l.time}</td>
            <td>\${l.duration}</td>
            <td>\${l.mon}</td>
            <td>\${l.tue}</td>
            <td>\${l.wed}</td>
            <td>\${l.thu}</td>
            <td>\${l.fri}</td>
            <td>\${l.sat}</td>
          </tr>` + "`" + `).join("")}
    </tbody>
  </table>`;

const oceTableNew = `  <!-- Timetable Table -->
  <table class="timetable-grid">
    <thead>
      <tr>
        <th style="width: 11%; background-color: #059669; color: #ffffff;">ម៉ោងសិក្សា</th>
        <th style="width: 9%; background-color: #0d9488; color: #ffffff;">រយៈពេល</th>
        <th style="width: 13%; background-color: #f59e0b; color: #ffffff;">ចន្ទ</th>
        <th style="width: 13%; background-color: #9333ea; color: #ffffff;">អង្គារ</th>
        <th style="width: 13%; background-color: #10b981; color: #ffffff;">ពុធ</th>
        <th style="width: 13%; background-color: #f97316; color: #ffffff;">ព្រហស្បតិ៍</th>
        <th style="width: 13%; background-color: #0284c7; color: #ffffff;">សុក្រ</th>
        <th style="width: 13%; background-color: #e11d48; color: #ffffff;">សៅរ៍</th>
      </tr>
    </thead>
    <tbody>
      \${r.rows.map(l=>l.type==="flag"?\`
            <tr>
              <td style="font-weight: bold; background-color: #f0fdfa; color: #0f766e;">\${l.time}</td>
              <td style="background-color: #f0f9ff; color: #0c4a6e;">\${l.duration}</td>
              <td colspan="6" class="bg-flag" style="background-color: #ffe4e6; color: #881337;">\${l.mon}</td>
            </tr>\`:l.type==="break"?\`
            <tr>
              <td style="font-weight: bold; background-color: #f0fdfa; color: #0f766e;">\${l.time}</td>
              <td style="background-color: #f0f9ff; color: #0c4a6e;">\${l.duration}</td>
              <td colspan="6" class="bg-break" style="background-color: #fef3c7; color: #78350f;">\${l.mon}</td>
            </tr>\`:` + "`" + `
          <tr>
            <td style="font-weight: bold; background-color: #f0fdfa; color: #0f766e;">\${l.time}</td>
            <td style="background-color: #f0f9ff; color: #0c4a6e;">\${l.duration}</td>
            \${[l.mon,l.tue,l.wed,l.thu,l.fri,l.sat].map(sub=>{const st=ttSubjStyle(sub);return \`<td style="background-color:\${st.bg};color:\${st.fg};font-weight:bold;">\${sub}</td>\`;}).join("")}
          </tr>` + "`" + `).join("")}
    </tbody>
  </table>`;
if (!src.includes(oceTableOld)) throw new Error("Missing oceTableOld");
src = src.replace(oceTableOld, oceTableNew);

// 3. Also make cCe wait for document.fonts.ready before printing
const cceScriptOld = `    window.onload = function() {\n      setTimeout(function() {\n        window.print();\n      }, 300);\n    };`;
const cceScriptNew = `    window.onload = function() {\n      var go = function() { setTimeout(function() { window.print(); }, 180); };\n      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(go).catch(go); } else { setTimeout(go, 350); }\n    };`;
if (src.includes(cceScriptOld)) {
  src = src.replace(cceScriptOld, cceScriptNew);
}

fs.writeFileSync(FILE, src, "utf8");

const sf = ts.createSourceFile(FILE, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("Parse diagnostics:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("SUCCESS: patched notranslate & vibrant Word export v125, 0 parse diagnostics, length:", src.length);
