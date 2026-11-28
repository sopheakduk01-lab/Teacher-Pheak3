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

const iCH = code.indexOf("committeeHtml=");
if (iCH === -1) throw new Error("committeeHtml not found");
const iEnd = code.indexOf("`;", iCH);
if (iEnd === -1) throw new Error("committeeHtml end not found");

const newDecl = `committeeHtml=sanPdf?\`<div style="font-family:'Kantumruy Pro','Siemreap',sans-serif;font-size:10pt;color:#0f172a;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
    <!-- PAGE 1: គណៈកម្មាធិការថ្នាក់រៀន និងអនុសាខាទាំង៦ -->
    <div style="margin-bottom:14px;">
      <div style="font-family:moul,serif;font-size:12pt;font-weight:bold;color:#047857;text-align:center;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #059669;">👑 រចនាសម្ព័ន្ធគណៈកម្មាធិការ និងអនុសាខាទាំង៦ ថ្នាក់រៀន</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px;">
        <div style="border:2px solid #f59e0b;border-radius:12px;overflow:hidden;background:#fffbeb;text-align:center;">
          <div style="background:linear-gradient(90deg,#f59e0b,#ea580c);color:#fff;padding:6px;font-size:8.5pt;font-weight:800;">👑 ប្រធានថ្នាក់</div>
          <div style="padding:8px;font-size:9.5pt;font-weight:800;color:#78350f;">\${escS(((de.find(u=>u.id===q.presidentId))||{name:"មិនទាន់កំណត់"}).name)}</div>
        </div>
        <div style="border:2px solid #6366f1;border-radius:12px;overflow:hidden;background:#eef2ff;text-align:center;">
          <div style="background:linear-gradient(90deg,#2563eb,#4f46e5);color:#fff;padding:6px;font-size:8.5pt;font-weight:800;">🎖️ អនុប្រធានទី ១</div>
          <div style="padding:8px;font-size:9.5pt;font-weight:800;color:#312e81;">\${escS(((de.find(u=>u.id===q.vicePresident1Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
        </div>
        <div style="border:2px solid #06b6d4;border-radius:12px;overflow:hidden;background:#ecfeff;text-align:center;">
          <div style="background:linear-gradient(90deg,#06b6d4,#0d9488);color:#fff;padding:6px;font-size:8.5pt;font-weight:800;">🎖️ អនុប្រធានទី ២</div>
          <div style="padding:8px;font-size:9.5pt;font-weight:800;color:#155e75;">\${escS(((de.find(u=>u.id===q.vicePresident2Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
        </div>
        <div style="border:2px solid #9333ea;border-radius:12px;overflow:hidden;background:#faf5ff;text-align:center;">
          <div style="background:linear-gradient(90deg,#7c3aed,#9333ea);color:#fff;padding:6px;font-size:8.5pt;font-weight:800;">🎖️ អនុប្រធានទី ៣</div>
          <div style="padding:8px;font-size:9.5pt;font-weight:800;color:#581c87;">\${escS(((de.find(u=>u.id===q.vicePresident3Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
        \${[1,2,3,4,5,6].map(bn=>{
          const mems=(q.subBranches[bn]||[]).map(id=>de.find(u=>u.id===id)).filter(Boolean);
          const pal=wm[bn-1]||wm[0];
          const act=dm[(bn-1-mShift+60)%6]||dm[0];
          return '<div style="border:1.5px solid ' + pal.hex + ';border-radius:10px;overflow:hidden;background:' + pal.hexBg + ';break-inside:avoid;">' +
            '<div style="background:' + pal.hex + ';color:#ffffff;padding:6px 10px;font-weight:800;font-size:9pt;">អនុសាខាទី ' + fr(bn) + ' · ' + escS(act.name) + ' (' + fr(mems.length) + ' នាក់)</div>' +
            '<div style="padding:8px 10px;font-size:8.5pt;line-height:1.6;background:#ffffff;min-height:75px;">' + (mems.length?mems.map((st,ix)=>fr(ix+1)+'. '+escS(st.name)).join("<br/>"):'<span style="color:#94a3b8;font-style:italic;">(មិនទាន់មានសមាជិក)</span>') + '</div>' +
          '</div>';
        }).join("")}
      </div>
    </div>

    <!-- PAGE BREAK: Separate Page 2 for Sanitation & Weekly Rotation Table -->
    <div style="page-break-before:always;break-before:page;height:1px;"></div>

    <!-- PAGE 2: តារាងវេនអនាម័យ និងសកម្មភាពប្រចាំសប្តាហ៍ -->
    <div>
      <div style="font-family:moul,serif;font-size:12pt;font-weight:bold;color:#047857;text-align:center;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #059669;">📅 តារាងវេនអនាម័យ និងសកម្មភាពប្រចាំសប្តាហ៍ (ខែទី \${fr(mShift+1)})</div>
      <div style="margin-bottom:10px;padding:6px 12px;border-radius:8px;background:#ecfdf5;border:1px solid #6ee7b7;font-size:9pt;font-weight:700;color:#065f46;text-align:center;">
        💡 បញ្ជាក់៖ អនុសាខានីមួយៗដឹកនាំតាមសកម្មភាពប្រចាំថ្ងៃថេរពេញ ១ ខែ (ចន្ទ–សៅរ៍) ដោយមួយខែទើបដូរសកម្មភាពគ្នាម្តងតាមរង្វិលជុំខែទី \${fr(mShift+1)}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:9.5pt;border-radius:10px;overflow:hidden;">
        <thead><tr>
          <th style="background:#059669;color:#fff;border:1px solid #047857;padding:7px;text-align:center;">ល.រ</th>
          <th style="background:#0d9488;color:#fff;border:1px solid #0f766e;padding:7px;text-align:left;">សកម្មភាពប្រចាំថ្ងៃ</th>
          <th style="background:#f59e0b;color:#fff;border:1px solid #d97706;padding:7px;text-align:center;">ចន្ទ</th>
          <th style="background:#9333ea;color:#fff;border:1px solid #7e22ce;padding:7px;text-align:center;">អង្គារ</th>
          <th style="background:#10b981;color:#fff;border:1px solid #059669;padding:7px;text-align:center;">ពុធ</th>
          <th style="background:#f97316;color:#fff;border:1px solid #ea580c;padding:7px;text-align:center;">ព្រហស្បតិ៍</th>
          <th style="background:#0284c7;color:#fff;border:1px solid #0369a1;padding:7px;text-align:center;">សុក្រ</th>
          <th style="background:#e11d48;color:#fff;border:1px solid #be123c;padding:7px;text-align:center;">សៅរ៍</th>
        </tr></thead>
        <tbody>\${dm.map((act,ix)=>{
          const b=(ix+mShift)%6+1,p=wm[b-1]||wm[0];
          return '<tr style="background:' + (ix%2===0?"#ffffff":"#f8fafc") + '"><td style="border:1px solid #cbd5e1;padding:6px;text-align:center;font-weight:700;">' + fr(ix+1) + '</td><td style="border:1px solid #cbd5e1;padding:6px;font-weight:700;color:#0f172a;">' + escS(act.name) + '</td>' + [0,1,2,3,4,5].map(()=>'<td style="border:1px solid #cbd5e1;padding:6px;text-align:center;background:' + p.hexBg + ';color:' + p.hexTxt + ';font-weight:800;">អនុសាខាទី ' + fr(b) + '</td>').join("") + '</tr>';
        }).join("")}</tbody>
      </table>
    </div>
  </div>\`:"";`;

code = code.slice(0, iCH) + newDecl + code.slice(iEnd + 2);
console.log("✓ Applied upgraded committeeHtml with separated pages");

// 2. Upgrade vMode==="committee" UI wrapper
replaceExact(
  "Upgrade vMode committee UI wrapper",
  `vMode==="committee"&&e.jsxs("div",{className:"bg-white p-5 sm:p-7 rounded-[28px] border-2 border-sky-200 shadow-sm space-y-6",children:[`,
  `vMode==="committee"&&e.jsxs("div",{className:"bg-gradient-to-b from-emerald-50/60 via-white to-sky-50/50 p-5 sm:p-8 rounded-[32px] border-2 border-emerald-300 shadow-md space-y-7",children:[`
);

// Parse JS AST to guarantee 0 syntax errors
const sf = ts.createSourceFile("index.js", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  const first = sf.parseDiagnostics[0];
  throw new Error(`TS parse error at pos ${first.start}: ${ts.flattenDiagnosticMessageText(first.messageText, "\n")}`);
}

fs.writeFileSync(targetPath, code, "utf8");
console.log("✓ Validated AST and wrote updated bundle:", targetPath);
