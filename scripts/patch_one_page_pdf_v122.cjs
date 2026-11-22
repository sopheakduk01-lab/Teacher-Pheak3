const fs = require("fs");
const ts = require("typescript");

const FILE = "public/assets/index-BwPwHqBe.js";
let src = fs.readFileSync(FILE, "utf8");

// 1. Add fit1 detection + tighter 7mm tight margin in Oi Ut()
const marginOld = `let tr="15mm";V.paperSize==="A5"?tr=V.marginSize==="tight"?"6mm":V.marginSize==="wide"?"12mm":"8mm":(V.marginSize==="tight"&&(tr="10mm"),V.marginSize==="wide"&&(tr="20mm"));`;
const marginNew = `const fit1=!!(V.fitOnePage||s==="seating_chart"||s==="sanitation_committee");let tr="15mm";V.paperSize==="A5"?tr=V.marginSize==="tight"?"5mm":V.marginSize==="wide"?"12mm":"8mm":(V.marginSize==="tight"&&(tr=fit1?"6mm":"10mm"),V.marginSize==="wide"&&(tr="20mm"));`;
if (!src.includes(marginOld)) throw new Error("Missing marginOld");
src = src.replace(marginOld, marginNew);

// 2. Add compact 1-page print rules & #fit-one-page-wrap in Oi Ut()
const printCssOld = `          @media print {
            .no-print { display: none !important; }
            \${V.colorTheme==="bw"?"body { background-color: #fff !important; }":""}
          }
        </style>
      </head>
      <body>`;
const printCssNew = `          \${fit1?".pdf-header-table { margin-bottom: 5px !important; } .signatures-table { margin-top: 8px !important; }":""}
          @media print {
            .no-print { display: none !important; }
            \${V.colorTheme==="bw"?"body { background-color: #fff !important; }":""}
            \${fit1?"#fit-one-page-wrap { page-break-inside: avoid !important; break-inside: avoid !important; }":""}
          }
        </style>
      </head>
      <body>
        \${fit1?'<div id="fit-one-page-wrap" style="width:100%;">':""}`;
if (!src.includes(printCssOld)) throw new Error("Missing printCssOld");
src = src.replace(printCssOld, printCssNew);

// 3. Compact signature vertical spacing when fit1 is active inside Oi Ut()
const sigOld = `          <table class="signatures-table">
            <tr>
              <td style="\${Re("left_signature")}">
                <div style="font-weight: bold; font-size: 0.92em; white-space: pre-line;">\${O.leftSignatureTitle}</div>
                \${V.showStampBox?'<div class="stamp-box">ទីតាំងប្រោះត្រា</div>':'<div style="height: 55px;"></div>'}
                <div style="font-weight: bold; font-size: 0.95em;">\${O.leftSignatureName||"..........................................."}</div>
              </td>
              <td style="\${Re("right_signature")}">
                <div style="font-size: 0.88em; color: #475569; margin-bottom: 4px; white-space: pre-line; \${Re("location_date")}">\${O.locationAndDate}</div>
                <div style="font-weight: bold; font-size: 0.92em;">\${O.rightSignatureTitle}</div>
                <div style="height: 55px;"></div>
                <div style="font-weight: bold; font-size: 0.95em;">\${O.rightSignatureName}</div>
              </td>
            </tr>
          </table>`;
const sigNew = `          <table class="signatures-table">
            <tr>
              <td style="\${Re("left_signature")}">
                <div style="font-weight: bold; font-size: 0.9em; white-space: pre-line;">\${O.leftSignatureTitle}</div>
                \${V.showStampBox?'<div class="stamp-box">ទីតាំងប្រោះត្រា</div>':\`<div style="height: \${fit1?"26px":"55px"};"></div>\`}
                <div style="font-weight: bold; font-size: 0.92em;">\${O.leftSignatureName||"..........................................."}</div>
              </td>
              <td style="\${Re("right_signature")}">
                <div style="font-size: 0.84em; color: #475569; margin-bottom: 2px; white-space: pre-line; \${Re("location_date")}">\${O.locationAndDate}</div>
                <div style="font-weight: bold; font-size: 0.9em;">\${O.rightSignatureTitle}</div>
                <div style="height: \${fit1?"26px":"55px"};"></div>
                <div style="font-weight: bold; font-size: 0.92em;">\${O.rightSignatureName}</div>
              </td>
            </tr>
          </table>`;
if (!src.includes(sigOld)) throw new Error("Missing sigOld");
src = src.replace(sigOld, sigNew);

// 4. Close #fit-one-page-wrap + inject fitToOnePage script + update Pe() in Oi
const bodyEndOld = `        \${O.footerNote?\`
          <div style="margin-top: 20px; padding-top: 8px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.78em; color: #94a3b8; \${Re("notes_section")}">
            \${O.footerNote}
          </div>
        \`:""}
      </body>
      </html>
    \`},Pe=()=>{const ne=Ut(),_e=window.open("","_blank","width=1000,height=1100");if(!_e){alert("សូមអនុញ្ញាត Popup នៅក្នុងកម្មវិធីជ្រាវជ្រោល (Browser) ដើម្បីបើកផ្ទាំង PDF!");return}_e.document.open(),_e.document.write(ne),_e.document.close(),setTimeout(()=>{_e.focus(),_e.print()},400),u&&u("បានបើកផ្ទាំងបោះពុម្ព និងទាញយកជា PDF រួចរាល់!")};`;

const bodyEndNew = `        \${O.footerNote?\`
          <div style="margin-top: \${fit1?"8px":"20px"}; padding-top: \${fit1?"4px":"8px"}; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.78em; color: #94a3b8; \${Re("notes_section")}">
            \${O.footerNote}
          </div>
        \`:""}
        \${fit1?\`</div><script>
          (function(){
            function fitOnePage(){
              var wrap=document.getElementById('fit-one-page-wrap');
              if(!wrap)return;
              wrap.style.zoom='1';
              wrap.style.transform='';
              wrap.style.width='100%';
              var isLand='\${V.orientation}'==='landscape';
              var sz='\${V.paperSize}'||'A4';
              var mmW=sz==='A3'?(isLand?420:297):sz==='A5'?(isLand?210:148):(isLand?297:210);
              var mmH=sz==='A3'?(isLand?297:420):sz==='A5'?(isLand?148:210):(isLand?210:297);
              var mMm=\${V.marginSize==="tight"?6:V.marginSize==="wide"?20:15};
              var pxMm=96/25.4;
              var maxW=(mmW-mMm*2-2)*pxMm;
              var maxH=(mmH-mMm*2-4)*pxMm;
              var curH=Math.max(wrap.scrollHeight,wrap.getBoundingClientRect().height);
              var curW=Math.max(wrap.scrollWidth,wrap.getBoundingClientRect().width);
              var sc=Math.min(1,maxH/Math.max(curH,1),maxW/Math.max(curW,1));
              if(sc<0.998){
                sc=Math.max(0.38,sc*0.97);
                if('zoom' in wrap.style && navigator.userAgent.toLowerCase().indexOf('firefox')===-1){
                  wrap.style.zoom=String(sc);
                }else{
                  wrap.style.transformOrigin='top left';
                  wrap.style.transform='scale('+sc+')';
                  wrap.style.width=(100/sc).toFixed(2)+'%';
                }
              }
            }
            window.__fitOnePage=fitOnePage;
            window.addEventListener('beforeprint',fitOnePage);
            if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitOnePage);
            window.addEventListener('load',fitOnePage);
            setTimeout(fitOnePage,60);
          })();
        <\\/script>\`:""}
      </body>
      </html>
    \`},Pe=()=>{const ne=Ut(),_e=window.open("","_blank","width=1080,height=900");if(!_e){alert("សូមអនុញ្ញាត Popup នៅក្នុងកម្មវិធីជ្រាវជ្រោល (Browser) ដើម្បីបើកផ្ទាំង PDF!");return}_e.document.open(),_e.document.write(ne),_e.document.close(),setTimeout(()=>{const go=()=>{try{_e.__fitOnePage&&_e.__fitOnePage()}catch{} _e.focus(),_e.print()};_e.document&&_e.document.fonts&&_e.document.fonts.ready?_e.document.fonts.ready.then(()=>setTimeout(go,120)).catch(go):go()},350),u&&u("បានបើកផ្ទាំងបោះពុម្ព និងទាញយកជា PDF តែ ១ ទំព័រ រួចរាល់!")};`;

if (!src.includes(bodyEndOld)) throw new Error("Missing bodyEndOld");
src = src.replace(bodyEndOld, bodyEndNew);

// 5. Make LCe (បោះពុម្ព / រក្សាទុក PDF A4) also strictly fit 1 single A4 landscape page
const lcePrintOld = `    return \`<!DOCTYPE html><html lang="km"><head><meta charset="utf-8" /><base href="\${window.location.origin}/" /><title>ប្លង់តុថ្នាក់រៀន_\${escS(s.grade)}_\${escS(s.school)}_A4</title>\${Oo()}<style>@page{size:A4 landscape;margin:6mm 8mm;}*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'\${ae}','Kantumruy Pro','Battambang','Siemreap',sans-serif;background:#fff !important;color:#0f172a;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}@media print{.no-print{display:none !important;}}</style></head><body>\${bodyHtml}<script>window.onload=function(){setTimeout(function(){window.print();},450);};</script></body></html>\`;`;
const lcePrintNew = `    return \`<!DOCTYPE html><html lang="km"><head><meta charset="utf-8" /><base href="\${window.location.origin}/" /><title>ប្លង់តុថ្នាក់រៀន_\${escS(s.grade)}_\${escS(s.school)}_A4</title>\${Oo()}<style>@page{size:A4 landscape;margin:5mm 7mm;}*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'\${ae}','Kantumruy Pro','Battambang','Siemreap',sans-serif;background:#fff !important;color:#0f172a;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}@media print{.no-print{display:none !important;}#lce-one-page{page-break-inside:avoid !important;break-inside:avoid !important;}}</style></head><body><div id="lce-one-page" style="width:100%;">\${bodyHtml}</div><script>(function(){function fitLce(){var w=document.getElementById('lce-one-page');if(!w)return;w.style.zoom='1';w.style.transform='';w.style.width='100%';var px=96/25.4;var maxW=(297-14-2)*px;var maxH=(210-10-4)*px;var curH=Math.max(w.scrollHeight,w.getBoundingClientRect().height);var curW=Math.max(w.scrollWidth,w.getBoundingClientRect().width);var sc=Math.min(1,maxH/Math.max(curH,1),maxW/Math.max(curW,1));if(sc<0.998){sc=Math.max(0.38,sc*0.97);if('zoom' in w.style&&navigator.userAgent.toLowerCase().indexOf('firefox')===-1){w.style.zoom=String(sc);}else{w.style.transformOrigin='top left';w.style.transform='scale('+sc+')';w.style.width=(100/sc).toFixed(2)+'%';}}}window.addEventListener('beforeprint',fitLce);window.onload=function(){var go=function(){fitLce();setTimeout(function(){window.print();},120);};if(document.fonts&&document.fonts.ready){document.fonts.ready.then(go).catch(go);}else{setTimeout(go,350);}};})();<\\/script></body></html>\`;`;
if (!src.includes(lcePrintOld)) throw new Error("Missing lcePrintOld");
src = src.replace(lcePrintOld, lcePrintNew);

// 6. Compact committeeHtml (inline clean member list + tight margins so 1 page fits at high legibility)
const comHtmlOld = `  const committeeHtml=sanPdf?\`<div style="font-family:'Kantumruy Pro','Siemreap',sans-serif;font-size:10pt;color:#0f172a;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;">
      <div style="border:2px solid #f59e0b;border-radius:10px;overflow:hidden;background:#fffbeb;text-align:center;">
        <div style="background:linear-gradient(90deg,#f59e0b,#ea580c);color:#fff;padding:5px 8px;font-size:8.5pt;font-weight:800;">👑 ប្រធានថ្នាក់</div>
        <div style="padding:7px 8px;font-size:10.5pt;font-weight:800;color:#78350f;">\${escS(((de.find(u=>u.id===q.presidentId))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="border:2px solid #6366f1;border-radius:10px;overflow:hidden;background:#eef2ff;text-align:center;">
        <div style="background:linear-gradient(90deg,#2563eb,#4f46e5);color:#fff;padding:5px 8px;font-size:8.5pt;font-weight:800;">🎖️ អនុប្រធានទី ១</div>
        <div style="padding:7px 8px;font-size:10.5pt;font-weight:800;color:#312e81;">\${escS(((de.find(u=>u.id===q.vicePresident1Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="border:2px solid #06b6d4;border-radius:10px;overflow:hidden;background:#ecfeff;text-align:center;">
        <div style="background:linear-gradient(90deg,#06b6d4,#0d9488);color:#fff;padding:5px 8px;font-size:8.5pt;font-weight:800;">🎖️ អនុប្រធានទី ២</div>
        <div style="padding:7px 8px;font-size:10.5pt;font-weight:800;color:#155e75;">\${escS(((de.find(u=>u.id===q.vicePresident2Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
      \${[1,2,3,4,5,6].map(bn=>{
        const mems=(q.subBranches[bn]||[]).map(id=>de.find(u=>u.id===id)).filter(Boolean);
        const pal=wm[bn-1]||wm[0];
        return \`<div style="border:1.5px solid \${pal.hex};border-radius:9px;overflow:hidden;background:\${pal.hexBg};break-inside:avoid;">
          <div style="background:\${pal.hex};color:#ffffff;padding:5px 8px;font-weight:800;font-size:9pt;">អនុសាខាទី \${fr(bn)} (\${fr(mems.length)} នាក់)</div>
          <div style="padding:6px 8px;font-size:8.5pt;line-height:1.5;background:#ffffff;">\${mems.length?mems.map((st,ix)=>\`\${fr(ix+1)}. \${escS(st.name)}\`).join("<br/>"):"(មិនទាន់មានសមាជិក)"}</div>
        </div>\`;
      }).join("")}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:9pt;border-radius:8px;overflow:hidden;">
      <thead><tr>
        <th style="background:#059669;color:#fff;border:1px solid #047857;padding:6px;text-align:center;">ល.រ</th>
        <th style="background:#0d9488;color:#fff;border:1px solid #0f766e;padding:6px;text-align:left;">សកម្មភាពប្រចាំថ្ងៃ</th>
        <th style="background:#f59e0b;color:#fff;border:1px solid #d97706;padding:6px;">ចន្ទ</th>
        <th style="background:#9333ea;color:#fff;border:1px solid #7e22ce;padding:6px;">អង្គារ</th>
        <th style="background:#10b981;color:#fff;border:1px solid #059669;padding:6px;">ពុធ</th>
        <th style="background:#f97316;color:#fff;border:1px solid #ea580c;padding:6px;">ព្រហស្បតិ៍</th>
        <th style="background:#0284c7;color:#fff;border:1px solid #0369a1;padding:6px;">សុក្រ</th>
        <th style="background:#e11d48;color:#fff;border:1px solid #be123c;padding:6px;">សៅរ៍</th>
      </tr></thead>
      <tbody>\${dm.map((act,ix)=>{
        const rot=[0,1,2,3,4,5].map(k=>(ix-k+6)%6+1);
        return \`<tr style="background:\${ix%2===0?"#ffffff":"#f8fafc"};"><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;font-weight:700;">\${fr(ix+1)}</td><td style="border:1px solid #cbd5e1;padding:5px;font-weight:700;color:#0f172a;">\${escS(act.name)}</td>\${rot.map(b=>{const p=wm[b-1]||wm[0];return \`<td style="border:1px solid #cbd5e1;padding:5px;text-align:center;background:\${p.hexBg};color:\${p.hexTxt};font-weight:800;">អនុសាខាទី \${fr(b)}</td>\`;}).join("")}</tr>\`;
      }).join("")}</tbody>
    </table>
  </div>\`:"";`;

const comHtmlNew = `  const committeeHtml=sanPdf?\`<div style="font-family:'Kantumruy Pro','Siemreap',sans-serif;font-size:9pt;color:#0f172a;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px;">
      <div style="border:1.5px solid #f59e0b;border-radius:8px;overflow:hidden;background:#fffbeb;text-align:center;">
        <div style="background:linear-gradient(90deg,#f59e0b,#ea580c);color:#fff;padding:3px 8px;font-size:8pt;font-weight:800;">👑 ប្រធានថ្នាក់</div>
        <div style="padding:4px 8px;font-size:9.5pt;font-weight:800;color:#78350f;">\${escS(((de.find(u=>u.id===q.presidentId))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="border:1.5px solid #6366f1;border-radius:8px;overflow:hidden;background:#eef2ff;text-align:center;">
        <div style="background:linear-gradient(90deg,#2563eb,#4f46e5);color:#fff;padding:3px 8px;font-size:8pt;font-weight:800;">🎖️ អនុប្រធានទី ១</div>
        <div style="padding:4px 8px;font-size:9.5pt;font-weight:800;color:#312e81;">\${escS(((de.find(u=>u.id===q.vicePresident1Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
      <div style="border:1.5px solid #06b6d4;border-radius:8px;overflow:hidden;background:#ecfeff;text-align:center;">
        <div style="background:linear-gradient(90deg,#06b6d4,#0d9488);color:#fff;padding:3px 8px;font-size:8pt;font-weight:800;">🎖️ អនុប្រធានទី ២</div>
        <div style="padding:4px 8px;font-size:9.5pt;font-weight:800;color:#155e75;">\${escS(((de.find(u=>u.id===q.vicePresident2Id))||{name:"មិនទាន់កំណត់"}).name)}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:8px;">
      \${[1,2,3,4,5,6].map(bn=>{
        const mems=(q.subBranches[bn]||[]).map(id=>de.find(u=>u.id===id)).filter(Boolean);
        const pal=wm[bn-1]||wm[0];
        return \`<div style="border:1.5px solid \${pal.hex};border-radius:8px;overflow:hidden;background:\${pal.hexBg};break-inside:avoid;">
          <div style="background:\${pal.hex};color:#ffffff;padding:3.5px 8px;font-weight:800;font-size:8.5pt;">អនុសាខាទី \${fr(bn)} (\${fr(mems.length)} នាក់)</div>
          <div style="padding:4px 7px;font-size:8pt;line-height:1.45;background:#ffffff;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:6px;row-gap:1px;">\${mems.length?mems.map((st,ix)=>\`<div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><b>\${fr(ix+1)}.</b> \${escS(st.name)}</div>\`).join(""):"<div style='color:#94a3b8;'>(មិនទាន់មានសមាជិក)</div>"}</div>
        </div>\`;
      }).join("")}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:8.5pt;border-radius:8px;overflow:hidden;margin-bottom:0;">
      <thead><tr>
        <th style="background:#059669;color:#fff;border:1px solid #047857;padding:4px;text-align:center;">ល.រ</th>
        <th style="background:#0d9488;color:#fff;border:1px solid #0f766e;padding:4px 6px;text-align:left;">សកម្មភាពប្រចាំថ្ងៃ</th>
        <th style="background:#f59e0b;color:#fff;border:1px solid #d97706;padding:4px;">ចន្ទ</th>
        <th style="background:#9333ea;color:#fff;border:1px solid #7e22ce;padding:4px;">អង្គារ</th>
        <th style="background:#10b981;color:#fff;border:1px solid #059669;padding:4px;">ពុធ</th>
        <th style="background:#f97316;color:#fff;border:1px solid #ea580c;padding:4px;">ព្រហស្បតិ៍</th>
        <th style="background:#0284c7;color:#fff;border:1px solid #0369a1;padding:4px;">សុក្រ</th>
        <th style="background:#e11d48;color:#fff;border:1px solid #be123c;padding:4px;">សៅរ៍</th>
      </tr></thead>
      <tbody>\${dm.map((act,ix)=>{
        const rot=[0,1,2,3,4,5].map(k=>(ix-k+6)%6+1);
        return \`<tr style="background:\${ix%2===0?"#ffffff":"#f8fafc"};"><td style="border:1px solid #cbd5e1;padding:3.5px 4px;text-align:center;font-weight:700;">\${fr(ix+1)}</td><td style="border:1px solid #cbd5e1;padding:3.5px 6px;font-weight:700;color:#0f172a;">\${escS(act.name)}</td>\${rot.map(b=>{const p=wm[b-1]||wm[0];return \`<td style="border:1px solid #cbd5e1;padding:3.5px 4px;text-align:center;background:\${p.hexBg};color:\${p.hexTxt};font-weight:800;">អនុសាខាទី \${fr(b)}</td>\`;}).join("")}</tr>\`;
      }).join("")}</tbody>
    </table>
  </div>\`:"";`;

if (!src.includes(comHtmlOld)) throw new Error("Missing comHtmlOld");
src = src.replace(comHtmlOld, comHtmlNew);

// 7. Pass side_by_side + fitOnePage + no stampBox + empty footerNote in both seating_chart and sanitation_committee Oi calls
const oiPropsOld = `initialStyles:{orientation:"landscape",marginSize:"tight",fontSize:"small"},
        initialHeader:{`;
const oiPropsNew = `initialStyles:{orientation:"landscape",marginSize:"tight",fontSize:"small",signaturesLayout:"side_by_side",showStampBox:!1,fitOnePage:!0},
        initialHeader:{`;
if (!src.includes(oiPropsOld)) throw new Error("Missing oiPropsOld");
const countOi = src.split(oiPropsOld).length - 1;
console.log("Found oiPropsOld occurrences:", countOi);
src = src.split(oiPropsOld).join(oiPropsNew);

// Also ensure footerNote:"" in both seating_chart & sanitation_committee initialHeader
const hdrSeatOld = `documentType:"seating_chart",
        title:"ទាញយក PDF ប្លង់តុសិស្ស (ផ្តេក Landscape · ដូចការបង្ហាញ)",`;
const hdrSanOld = `documentType:"sanitation_committee",
        title:"ទាញយក PDF តារាងគណៈកម្មាធិការ និងវេនអនាម័យប្រចាំសប្តាហ៍",`;
if (!src.includes(hdrSeatOld) || !src.includes(hdrSanOld)) throw new Error("Missing Oi doc types");

const footSeatOld = `academicYear:Ze,
          officeInfo:"ការិយាល័យអប់រំ យុវជន និងកីឡា"
        },
        customTableHtml:pdfVisualHtml`;
const footSeatNew = `academicYear:Ze,
          officeInfo:"ការិយាល័យអប់រំ យុវជន និងកីឡា",
          footerNote:""
        },
        customTableHtml:pdfVisualHtml`;
if (!src.includes(footSeatOld)) throw new Error("Missing footSeatOld");
src = src.replace(footSeatOld, footSeatNew);

const footSanOld = `academicYear:Ze,
          officeInfo:"ការិយាល័យអប់រំ យុវជន និងកីឡា"
        },
        customTableHtml:committeeHtml`;
const footSanNew = `academicYear:Ze,
          officeInfo:"ការិយាល័យអប់រំ យុវជន និងកីឡា",
          footerNote:""
        },
        customTableHtml:committeeHtml`;
if (!src.includes(footSanOld)) throw new Error("Missing footSanOld");
src = src.replace(footSanOld, footSanNew);

// 8. Also check header spacing inside LCe buildVisualSeatingHtml (sigs margin-top & height)
const lceSigsOld = `.sp-sigs{display:flex;justify-content:space-between;align-items:flex-start;margin-top:12px;padding:0 18px;break-inside:avoid;page-break-inside:avoid;}`;
const lceSigsNew = `.sp-sigs{display:flex;justify-content:space-between;align-items:flex-start;margin-top:6px;padding:0 16px;break-inside:avoid;page-break-inside:avoid;}`;
if (!src.includes(lceSigsOld)) throw new Error("Missing lceSigsOld");
src = src.replace(lceSigsOld, lceSigsNew);
src = src.replace(/<div style="height:36px;"><\/div>/g, `<div style="height:22px;"></div>`);

fs.writeFileSync(FILE, src, "utf8");

const sf = ts.createSourceFile(FILE, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
  console.error("Parse diagnostics:", sf.parseDiagnostics.slice(0, 5));
  process.exit(1);
}
console.log("SUCCESS: patched 1-page PDF fit v122, 0 parse diagnostics, length:", src.length);
