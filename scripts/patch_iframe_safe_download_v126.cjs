const fs = require("fs");
const path = require("path");

const targetPath = path.join(process.cwd(), "public/assets/index-BwPwHqBe.js");
let s = fs.readFileSync(targetPath, "utf8");

function replaceExact(src, find, rep, label) {
  const idx = src.indexOf(find);
  if (idx === -1) {
    throw new Error(`Missing exact target [${label}]`);
  }
  const second = src.indexOf(find, idx + find.length);
  if (second !== -1) {
    throw new Error(`Non-unique target [${label}] found multiple times`);
  }
  return src.slice(0, idx) + rep + src.slice(idx + find.length);
}

// 1. Inject global iframe-safe download/print/PDF-generation helpers right before Oi
const helpersCode = `
function __khmerSafeName(name, fallback) {
  const raw = String(name || fallback || "document").trim();
  return (raw.replace(/[\\/\\\\:*?"<>|\\r\\n]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "") || fallback || "document").slice(0, 90);
}
function __khmerSaveBlob(blob, filename) {
  const safe = __khmerSafeName(filename, "document");
  let url = "";
  try {
    url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = safe;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try { a.parentNode && a.parentNode.removeChild(a); } catch {}
    }, 1500);
    setTimeout(() => {
      try { URL.revokeObjectURL(url); } catch {}
    }, 60000);
    return !0;
  } catch (e) {
    console.error("Save blob error:", e);
    try { if (url) URL.revokeObjectURL(url); } catch {}
    return !1;
  }
}
function __khmerSaveDataUrl(dataUrl, filename) {
  const safe = __khmerSafeName(filename, "image.png");
  try {
    const parts = String(dataUrl || "").split(",");
    if (parts.length >= 2) {
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/png";
      const bin = atob(parts[1]);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return __khmerSaveBlob(new Blob([arr], { type: mime }), safe);
    }
  } catch {}
  try {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = safe;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { try { a.parentNode && a.parentNode.removeChild(a); } catch {} }, 1500);
    return !0;
  } catch { return !1; }
}
function __khmerPrintHtml(html, onToast, toastMsg) {
  let inIframe = !1;
  try { inIframe = window.self !== window.top; } catch { inIframe = !0; }
  if (!inIframe) {
    try {
      const w = window.open("", "_blank", "width=1080,height=900");
      if (w && !w.closed) {
        w.document.open();
        w.document.write(html);
        w.document.close();
        if (!/window\\.print\\s*\\(/.test(html)) {
          setTimeout(() => {
            const go = () => {
              try { w.__fitOnePage && w.__fitOnePage(); } catch {}
              try { w.focus(); w.print(); } catch {}
            };
            if (w.document && w.document.fonts && w.document.fonts.ready) {
              w.document.fonts.ready.then(() => setTimeout(go, 140)).catch(go);
            } else { go(); }
          }, 350);
        }
        if (onToast && toastMsg) onToast(toastMsg);
        return !0;
      }
    } catch {}
  }
  try {
    const prev = document.getElementById("__khmer_print_iframe");
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
    const fr = document.createElement("iframe");
    fr.id = "__khmer_print_iframe";
    fr.style.cssText = "position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none;";
    document.body.appendChild(fr);
    const fw = fr.contentWindow;
    const fdoc = (fw && fw.document) || fr.contentDocument;
    if (!fw || !fdoc) return !1;
    const cleanHtml = String(html || "").replace(/window\\.print\\s*\\(\\s*\\)\\s*;?/g, "/*__khmer_p__*/");
    fdoc.open();
    fdoc.write(cleanHtml);
    fdoc.close();
    let triggered = !1;
    const fire = () => {
      if (triggered) return;
      triggered = !0;
      try { fw.__fitOnePage && fw.__fitOnePage(); } catch {}
      try { fw.focus(); fw.print(); } catch (err) { console.error("Iframe print error:", err); }
    };
    setTimeout(() => {
      try {
        if (fdoc.fonts && fdoc.fonts.ready) {
          Promise.race([fdoc.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(() => setTimeout(fire, 140)).catch(fire);
        } else { fire(); }
      } catch { fire(); }
    }, 350);
    setTimeout(() => { try { fr.parentNode && fr.parentNode.removeChild(fr); } catch {} }, 120000);
    if (onToast && toastMsg) onToast(toastMsg);
    return !0;
  } catch (err) {
    console.error("Hidden iframe print failed:", err);
    return !1;
  }
}
function __khmerBuildPdf(pages) {
  const encLatin1 = (str) => {
    const u = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) u[i] = str.charCodeAt(i) & 0xff;
    return u;
  };
  const header = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0x0A, 0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A]);
  const chunks = [header];
  let offset = header.length;
  const offsets = [0];
  const pushBytes = (bytes) => { chunks.push(bytes); offset += bytes.length; };
  const pushStr = (str) => pushBytes(encLatin1(str));
  const addObj = (id, parts) => {
    offsets[id] = offset;
    pushStr(id + " 0 obj\\n");
    for (const p of parts) {
      if (typeof p === "string") pushStr(p);
      else pushBytes(p);
    }
    pushStr("\\nendobj\\n");
  };
  const n = pages.length;
  const kids = [];
  for (let i = 0; i < n; i++) kids.push((3 + i * 3) + " 0 R");
  addObj(1, ["<< /Type /Catalog /Pages 2 0 R >>"]);
  addObj(2, ["<< /Type /Pages /Kids [ " + kids.join(" ") + " ] /Count " + n + " >>"]);
  for (let i = 0; i < n; i++) {
    const pg = pages[i];
    const pageId = 3 + i * 3;
    const imgId = pageId + 1;
    const contId = pageId + 2;
    const pw = pg.pageW.toFixed(2);
    const ph = pg.pageH.toFixed(2);
    const drawW = pg.drawW.toFixed(2);
    const drawH = pg.drawH.toFixed(2);
    const dx = pg.dx.toFixed(2);
    const dy = pg.dy.toFixed(2);
    const content = "q\\n" + drawW + " 0 0 " + drawH + " " + dx + " " + dy + " cm\\n/Im0 Do\\nQ\\n";
    addObj(pageId, ["<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + pw + " " + ph + "] /Resources << /XObject << /Im0 " + imgId + " 0 R >> >> /Contents " + contId + " 0 R >>"]);
    addObj(imgId, [
      "<< /Type /XObject /Subtype /Image /Width " + pg.imgW + " /Height " + pg.imgH + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + pg.jpegBytes.length + " >>\\nstream\\n",
      pg.jpegBytes,
      "\\nendstream"
    ]);
    addObj(contId, ["<< /Length " + content.length + " >>\\nstream\\n" + content + "endstream"]);
  }
  const xrefOffset = offset;
  const totalObjs = 3 + n * 3;
  let xref = "xref\\n0 " + totalObjs + "\\n0000000000 65535 f \\n";
  for (let id = 1; id < totalObjs; id++) {
    xref += String(offsets[id]).padStart(10, "0") + " 00000 n \\n";
  }
  xref += "trailer\\n<< /Size " + totalObjs + " /Root 1 0 R >>\\nstartxref\\n" + xrefOffset + "\\n%%EOF\\n";
  pushStr(xref);
  const out = new Uint8Array(offset);
  let pos = 0;
  for (const c of chunks) { out.set(c, pos); pos += c.length; }
  return new Blob([out], { type: "application/pdf" });
}
function __khmerDataUrlToBytes(dataUrl) {
  const b64 = String(dataUrl || "").split(",")[1] || "";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
function __khmerCanvasToPdf(canvas, opts, baseFilename, onToast) {
  const isLand = opts && opts.orientation === "landscape";
  const isA5 = opts && opts.paperSize === "A5";
  const pageW = isA5 ? (isLand ? 595.28 : 419.53) : (isLand ? 841.89 : 595.28);
  const pageH = isA5 ? (isLand ? 419.53 : 595.28) : (isLand ? 595.28 : 841.89);
  const W = canvas.width || 1;
  const H = canvas.height || 1;
  const pdfPages = [];
  if (opts && opts.fitOnePage) {
    const scale = Math.min(pageW / W, pageH / H);
    const drawW = W * scale;
    const drawH = H * scale;
    const dx = (pageW - drawW) / 2;
    const dy = Math.max(0, pageH - drawH);
    const jpegBytes = __khmerDataUrlToBytes(canvas.toDataURL("image/jpeg", 0.94));
    pdfPages.push({ jpegBytes, imgW: W, imgH: H, pageW, pageH, drawW, drawH, dx, dy });
  } else {
    const marginPt = 14;
    const usableW = pageW - marginPt * 2;
    const usableH = pageH - marginPt * 2;
    const sliceH = Math.max(200, Math.floor(W * (usableH / usableW)));
    let y = 0;
    while (y < H) {
      const sh = Math.min(sliceH, H - y);
      const tile = document.createElement("canvas");
      tile.width = W;
      tile.height = sh;
      const ctx = tile.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, sh);
      ctx.drawImage(canvas, 0, y, W, sh, 0, 0, W, sh);
      const drawW = usableW;
      const drawH = usableW * (sh / W);
      const jpegBytes = __khmerDataUrlToBytes(tile.toDataURL("image/jpeg", 0.93));
      pdfPages.push({ jpegBytes, imgW: W, imgH: sh, pageW, pageH, drawW, drawH, dx: marginPt, dy: pageH - marginPt - drawH });
      y += sh;
    }
  }
  const pdfBlob = __khmerBuildPdf(pdfPages);
  const ok = __khmerSaveBlob(pdfBlob, __khmerSafeName(baseFilename, "document") + ".pdf");
  if (ok && onToast) onToast("បានទាញយកឯកសារ PDF រួចរាល់! 📄");
  return ok;
}
async function __khmerCaptureNode(node) {
  try {
    return await utt(node, { pixelRatio: 2, backgroundColor: "#ffffff", cacheBust: !0 });
  } catch (e1) {
    console.warn("Primary canvas capture retry without external fonts:", e1);
    return await utt(node, { pixelRatio: 1.75, backgroundColor: "#ffffff", skipFonts: !0 });
  }
}
async function __khmerDownloadPdfFromHtml(html, baseFilename, opts, onToast) {
  let cap = null;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(String(html || ""), "text/html");
    const isLand = (opts && opts.orientation === "landscape") || /@page\\s*\\{[^}]*landscape/i.test(String(html || ""));
    const fitOnePage = !!(opts && opts.fitOnePage);
    const capW = isLand ? 1123 : 794;
    const capHMax = isLand ? 780 : 1110;
    cap = document.createElement("div");
    cap.id = "__khmer_pdf_cap_root";
    cap.style.cssText = "position:fixed;left:0;top:0;z-index:1;pointer-events:none;background:#ffffff;color:#1e293b;box-sizing:border-box;width:" + capW + "px;padding:" + (fitOnePage ? "16px 20px" : "22px 26px") + ";margin:0;overflow:visible;";
    const styles = Array.from(doc.querySelectorAll("style")).map(el => el.textContent || "").join("\\n");
    const scopedCss = styles
      .replace(/@page\\s*\\{[^}]*\\}/gi, "")
      .replace(/(^|[},\\n])\\s*(?:html\\s*,\\s*body|body|html)(?=[\\s{,:])/gmi, "$1 #__khmer_pdf_cap_root")
      .replace(/@media\\s+print\\s*\\{([\\s\\S]*?)\\}/gi, "$1");
    const styleEl = document.createElement("style");
    styleEl.textContent = scopedCss + "\\n#__khmer_pdf_cap_root img{max-width:100%;} #__khmer_pdf_cap_root .no-print{display:none!important;}";
    cap.appendChild(styleEl);
    const bodyWrap = document.createElement("div");
    bodyWrap.style.cssText = "width:100%;box-sizing:border-box;transform-origin:top left;";
    const cloneBody = doc.body.cloneNode(!0);
    cloneBody.querySelectorAll("script, .no-print").forEach(el => el.remove());
    while (cloneBody.firstChild) bodyWrap.appendChild(cloneBody.firstChild);
    cap.appendChild(bodyWrap);
    document.body.appendChild(cap);
    try {
      if (document.fonts && document.fonts.ready) {
        await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]);
      }
    } catch {}
    const imgs = Array.from(cap.querySelectorAll("img"));
    if (imgs.length > 0) {
      await Promise.race([
        Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; }))),
        new Promise(r => setTimeout(r, 1200))
      ]);
    }
    await new Promise(r => setTimeout(r, 140));
    if (fitOnePage) {
      const h = cap.scrollHeight;
      if (h > capHMax) {
        const sc = Math.max(0.45, Math.floor(((capHMax - 8) / h) * 1000) / 1000);
        bodyWrap.style.zoom = String(sc);
        await new Promise(r => setTimeout(r, 60));
      }
    }
    const canvas = await __khmerCaptureNode(cap);
    if (!canvas || !canvas.width || !canvas.height) throw new Error("Empty PDF canvas");
    return __khmerCanvasToPdf(canvas, { orientation: isLand ? "landscape" : "portrait", paperSize: opts && opts.paperSize, fitOnePage }, baseFilename, onToast);
  } catch (err) {
    console.error("Direct PDF generation failed, falling back to iframe print:", err);
    __khmerPrintHtml(html, onToast, "បានបើកផ្ទាំងបោះពុម្ព PDF!");
    return !1;
  } finally {
    if (cap && cap.parentNode) {
      try { cap.parentNode.removeChild(cap); } catch {}
    }
  }
}
`;

s = replaceExact(
  s,
  "}},Oi=({isOpen:",
  "}};" + helpersCode + "\nconst Oi=({isOpen:",
  "Inject helpers before Oi"
);

// 2. Patch Oi state, Pe, dlPdfNow (direct PDF download), and header buttons
s = replaceExact(
  s,
  'const[h,m]=y.useState("header"),[w,j]=y.useState("split"),',
  'const[h,m]=y.useState("header"),[w,j]=y.useState("split"),[dlBusy,setDlBusy]=y.useState(!1),',
  "Oi dlBusy state"
);

s = replaceExact(
  s,
  'Pe=()=>{const ne=Ut(),_e=window.open("","_blank","width=1080,height=900");if(!_e){alert("សូមអនុញ្ញាត Popup នៅក្នុងកម្មវិធីជ្រាវជ្រោល (Browser) ដើម្បីបើកផ្ទាំង PDF!");return}_e.document.open(),_e.document.write(ne),_e.document.close(),setTimeout(()=>{const go=()=>{try{_e.__fitOnePage&&_e.__fitOnePage()}catch{} _e.focus(),_e.print()};_e.document&&_e.document.fonts&&_e.document.fonts.ready?_e.document.fonts.ready.then(()=>setTimeout(go,120)).catch(go):go()},350),u&&u("បានបើកផ្ទាំងបោះពុម្ព និងទាញយកជា PDF តែ ១ ទំព័រ រួចរាល់!")}',
  'Pe=()=>{const ne=Ut();__khmerPrintHtml(ne,u,"បានបើកផ្ទាំងបោះពុម្ព PDF រួចរាល់!")},dlPdfNow=async()=>{if(dlBusy)return;setDlBusy(!0);u&&u("⏳ កំពុងបង្កើតឯកសារ PDF...");try{const ne=Ut(),isOne=!!(V.fitOnePage||s==="seating_chart"||s==="sanitation_committee"||s==="timetable");await __khmerDownloadPdfFromHtml(ne,O.docTitle||s||"document",{orientation:V.orientation,paperSize:V.paperSize,fitOnePage:isOne},u)}finally{setDlBusy(!1)}}',
  "Oi Pe + dlPdfNow"
);

s = replaceExact(
  s,
  'e.jsxs("button",{onClick:Pe,className:"px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-1.5 active:scale-95 border border-red-400/40",children:[e.jsx(ts,{className:"w-4 h-4"}),e.jsx("span",{className:"hidden sm:inline",children:"ទាញយក / បោះពុម្ព PDF"}),e.jsx("span",{className:"sm:hidden",children:"PDF"})]})',
  'e.jsxs("button",{type:"button",disabled:dlBusy,onClick:dlPdfNow,className:"px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-1.5 active:scale-95 border border-emerald-400/40 disabled:opacity-50",children:[e.jsx(Vs,{className:`w-4 h-4 ${dlBusy?"animate-spin":""}`}),e.jsx("span",{className:"hidden sm:inline",children:dlBusy?"កំពុងទាញយក...":"ទាញយក PDF"}),e.jsx("span",{className:"sm:hidden",children:dlBusy?"...":"PDF"})]}),e.jsxs("button",{type:"button",onClick:Pe,className:"px-3 sm:px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5 active:scale-95 border border-slate-500/40",children:[e.jsx(ts,{className:"w-4 h-4"}),e.jsx("span",{className:"hidden sm:inline",children:"បោះពុម្ព"})]})',
  "Oi header download + print buttons"
);

// 3. Patch cCe (Timetable quick print)
s = replaceExact(
  s,
  'function cCe(r,t=!1){const s=window.open("","_blank");if(!s){window.print();return}',
  'function cCe(r,t=!1){',
  "cCe remove window.open"
);
s = replaceExact(
  s,
  'setTimeout(go, 350); }\n    };\n  <\\/script>\n</body>\n</html>\n  `;s.document.open(),s.document.write(n),s.document.close()}const q9=',
  'setTimeout(go, 350); }\n    };\n  <\\/script>\n</body>\n</html>\n  `;__khmerPrintHtml(n)}const q9=',
  "cCe use __khmerPrintHtml"
);

// 4. Patch LCe (Dedicated Seating Chart Modal)
s = replaceExact(
  s,
  '  const[o,c]=y.useState("color");\n  const[d,u]=y.useState(!1);',
  '  const[o,c]=y.useState("color");\n  const[d,u]=y.useState(!1);\n  const[lcePdfBusy,setLcePdfBusy]=y.useState(!1);',
  "LCe state hook"
);
s = replaceExact(
  s,
  '  const F=()=>{\n    const U=window.open("","_blank","width=1180,height=840");\n    if(!U){window.print();return}\n    U.document.open(),U.document.write(G()),U.document.close();\n  };\n  const Z=()=>{\n    const U=G(),q=new Blob([U],{type:"text/html;charset=utf-8"}),ae=URL.createObjectURL(q),ie=document.createElement("a");\n    ie.href=ae,ie.download=`ប្លង់តុ_A4_${s.grade||"ថ្នាក់"}.html`,document.body.appendChild(ie),ie.click(),document.body.removeChild(ie),URL.revokeObjectURL(ae);\n  };\n  const PngExp=async()=>{\n    if(!T.current)return;\n    try{\n      const url=await ftt(T.current,{quality:0.96,pixelRatio:2,backgroundColor:"#ffffff",cacheBust:!0});\n      const link=document.createElement("a");\n      link.download=`ប្លង់តុសិស្ស_${s.grade||"ថ្នាក់"}.png`;\n      link.href=url;link.click();\n    }catch(err){console.error(err)}\n  };',
  '  const F=()=>{__khmerPrintHtml(G())};\n  const Z=()=>{const U=G(),q=new Blob([U],{type:"text/html;charset=utf-8"});__khmerSaveBlob(q,`ប្លង់តុ_A4_${s.grade||"ថ្នាក់"}.html`)};\n  const PngExp=async()=>{if(!T.current)return;try{const cnv=await __khmerCaptureNode(T.current);__khmerSaveDataUrl(cnv.toDataURL("image/png"),`ប្លង់តុសិស្ស_${s.grade||"ថ្នាក់"}.png`)}catch(err){console.error(err)}};\n  const PdfExp=async()=>{if(lcePdfBusy)return;setLcePdfBusy(!0);try{if(T.current){const cnv=await __khmerCaptureNode(T.current);if(cnv&&cnv.width&&cnv.height){__khmerCanvasToPdf(cnv,{orientation:"landscape",paperSize:"A4",fitOnePage:!0},`ប្លង់តុសិស្ស_${s.grade||"ថ្នាក់"}`);return}}await __khmerDownloadPdfFromHtml(G(),`ប្លង់តុសិស្ស_${s.grade||"ថ្នាក់"}`,{orientation:"landscape",paperSize:"A4",fitOnePage:!0})}catch(err){console.error(err);__khmerPrintHtml(G())}finally{setLcePdfBusy(!1)}};',
  "LCe export handlers"
);
s = replaceExact(
  s,
  'e.jsxs("button",{type:"button",onClick:F,className:"px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold transition flex items-center gap-2 shadow-sm cursor-pointer",children:[e.jsx(ts,{className:"w-4 h-4"}),e.jsx("span",{children:"បោះពុម្ព / រក្សាទុក PDF ដូចទម្រង់ដើម"})]})',
  'e.jsxs("button",{type:"button",disabled:lcePdfBusy,onClick:PdfExp,className:"px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50",children:[e.jsx(Vs,{className:`w-4 h-4 ${lcePdfBusy?"animate-spin":""}`}),e.jsx("span",{children:lcePdfBusy?"កំពុងទាញយក...":"ទាញយក PDF"})]}),e.jsxs("button",{type:"button",onClick:F,className:"px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-extrabold transition flex items-center gap-2 shadow-sm cursor-pointer",children:[e.jsx(ts,{className:"w-4 h-4"}),e.jsx("span",{children:"បោះពុម្ព"})]})',
  "LCe PDF + Print buttons"
);

// 5. Patch FCe (Dedicated Classroom Rules Modal)
s = replaceExact(
  s,
  '[d,u]=y.useState(null),[h,m]=y.useState("")',
  '[d,u]=y.useState(null),[fcePdfBusy,setFcePdfBusy]=y.useState(!1),[h,m]=y.useState("")',
  "FCe state hook"
);
s = replaceExact(
  s,
  'ie=()=>{const R=window.open("","_blank","width=1000,height=800");if(!R){window.print();return}R.document.open(),R.document.write(ae()),R.document.close()},re=()=>{const R=ae(),J=new Blob([R],{type:"text/html;charset=utf-8"}),se=URL.createObjectURL(J),le=document.createElement("a");le.href=se,le.download=`បទបញ្ជាផ្ទៃក្នុង_${s.grade||"ថ្នាក់ទី៤"}_${new Date().toISOString().split("T")[0]}.html`,document.body.appendChild(le),le.click(),document.body.removeChild(le),URL.revokeObjectURL(se)},Q=()=>{const R=ae(),J=new Blob(["\\uFEFF"+R],{type:"application/msword"}),se=URL.createObjectURL(J),le=document.createElement("a");le.href=se,le.download=`បទបញ្ជាផ្ទៃក្នុង_${s.grade||"ថ្នាក់ទី៤"}.doc`,document.body.appendChild(le),le.click(),document.body.removeChild(le),URL.revokeObjectURL(se)}',
  'ie=()=>{__khmerPrintHtml(ae())},fcePdfExp=async()=>{if(fcePdfBusy)return;setFcePdfBusy(!0);try{await __khmerDownloadPdfFromHtml(ae(),`បទបញ្ជាផ្ទៃក្នុង_${s.grade||"ថ្នាក់ទី៤"}`,{orientation:X,paperSize:"A4",fitOnePage:!1})}finally{setFcePdfBusy(!1)}},re=()=>{const R=ae(),J=new Blob([R],{type:"text/html;charset=utf-8"});__khmerSaveBlob(J,`បទបញ្ជាផ្ទៃក្នុង_${s.grade||"ថ្នាក់ទី៤"}_${new Date().toISOString().split("T")[0]}.html`)},Q=()=>{const R=ae(),J=new Blob(["\\uFEFF"+R],{type:"application/msword"});__khmerSaveBlob(J,`បទបញ្ជាផ្ទៃក្នុង_${s.grade||"ថ្នាក់ទី៤"}.doc`)}',
  "FCe export handlers"
);
s = replaceExact(
  s,
  'e.jsxs("button",{type:"button",onClick:ie,className:"px-5 py-2 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-800 hover:from-purple-800 hover:to-indigo-700 text-white font-black transition flex items-center gap-2 shadow-md shadow-purple-900/20 active:scale-95",children:[e.jsx(ts,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{children:"បោះពុម្ព A4 ភ្លាមៗ (Print A4)"})]})',
  'e.jsxs("button",{type:"button",disabled:fcePdfBusy,onClick:fcePdfExp,className:"px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black transition flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50",children:[e.jsx(Vs,{className:`w-4 h-4 ${fcePdfBusy?"animate-spin":""}`}),e.jsx("span",{children:fcePdfBusy?"កំពុងទាញយក...":"ទាញយក PDF"})]}),e.jsxs("button",{type:"button",onClick:ie,className:"px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-800 hover:from-purple-800 hover:to-indigo-700 text-white font-black transition flex items-center gap-2 shadow-md shadow-purple-900/20 active:scale-95",children:[e.jsx(ts,{className:"w-4 h-4 text-amber-300"}),e.jsx("span",{children:"បោះពុម្ព A4"})]})',
  "FCe PDF + Print buttons"
);

// 6. Fix remaining HTML print popups to use __khmerPrintHtml (works inside iframe!)
s = replaceExact(
  s,
  'Ce=()=>{const ee=window.open("","_blank");ee&&(ee.document.write(',
  'Ce=()=>{__khmerPrintHtml(',
  "Quiz/Lesson Ce start"
);
s = replaceExact(
  s,
  'setTimeout(function() { window.print(); }, 350);\n          }\n        <\\/script>\n      </body>\n      </html>\n    `),ee.document.close())}',
  'setTimeout(function() { window.print(); }, 350);\n          }\n        <\\/script>\n      </body>\n      </html>\n    `)}',
  "Quiz/Lesson Ce end"
);

s = replaceExact(
  s,
  '  T=()=>{\n    const E=window.open("","_blank");\n    if(!E){window.print();return}\n    const X=visibleCards.map',
  '  T=()=>{\n    const X=visibleCards.map',
  "Board cards T start"
);
s = replaceExact(
  s,
  '    E.document.open(),E.document.write(O),E.document.close()\n  };',
  '    __khmerPrintHtml(O)\n  };',
  "Board cards T end"
);

s = replaceExact(
  s,
  'ue=()=>{const de=O.current;if(!de)return;const Ce=window.open("","_blank","width=1100,height=850");if(!Ce){window.print();return}const et=ac();nc(),Ce.document.write(',
  'ue=()=>{const de=O.current;if(!de)return;const et=ac();nc(),__khmerPrintHtml(',
  "6786151 ue start"
);
s = replaceExact(
  s,
  '        <\\/script>\n      </body>\n      </html>\n    `),Ce.document.close(),l("✅ កំពុងបើកផ្ទាំងបោះពុម្ព និងរក្សាទុកជា PDF...")}',
  '        <\\/script>\n      </body>\n      </html>\n    `),l("✅ កំពុងបើកផ្ទាំងបោះពុម្ព និងរក្សាទុកជា PDF...")}',
  "6786151 ue end"
);

s = replaceExact(
  s,
  ',qs=new Blob([Kt],{type:"text/html;charset=utf-8"}),ya=URL.createObjectURL(qs);if(window.open(ya,"_blank"))i("បានបើកផ្ទាំងទាញយក PDF ផ្លូវការដោយជោគជ័យ!");else{const Jn=document.createElement("a");Jn.href=ya,Jn.download=`PLC_Meeting_${w.replace(/\\s+/g,"_")}_${O}.html`,document.body.appendChild(Jn),Jn.click(),document.body.removeChild(Jn),i("បានទាញយកឯកសារកំណត់ហេតុ PLC ដោយជោគជ័យ!")}',
  ';__khmerPrintHtml(Kt,i,"បានបើកផ្ទាំងបោះពុម្ព / PDF ផ្លូវការដោយជោគជ័យ!")',
  "PLC 7553926"
);

s = replaceExact(
  s,
  'default:return null}},E=()=>{const X=window.open("","_blank");if(!X)return;const H=B.map',
  'default:return null}},E=()=>{const H=B.map',
  "7647357 E start"
);
s = replaceExact(
  s,
  'X.document.write(`\n      <html>\n        <head>',
  '__khmerPrintHtml(`\n      <html>\n        <head>',
  "7647357 E write"
);
s = replaceExact(
  s,
  '    `),X.document.close()};;y.useEffect(()=>',
  '    `)};;y.useEffect(()=>',
  "7647357 E end"
);

s = replaceExact(
  s,
  'const printMoeysRegister=()=>{const win=window.open("","_blank");if(!win)return;const rowsHtml=',
  'const printMoeysRegister=()=>{const rowsHtml=',
  "7649938 printMoeysRegister start"
);
s = replaceExact(
  s,
  'win.document.write("<!DOCTYPE html><html lang=\\"km\\"',
  '__khmerPrintHtml("<!DOCTYPE html><html lang=\\"km\\"',
  "7649938 printMoeysRegister write"
);
s = replaceExact(
  s,
  ';};<\\/script></body></html>");win.document.close();};',
  ';};<\\/script></body></html>");};',
  "7649938 printMoeysRegister end"
);

s = replaceExact(
  s,
  'V=()=>{const G=window.open("","_blank");if(!G){window.print();return}G.document.open(),G.document.write(M()),G.document.close(),G.focus(),setTimeout(()=>{G.print()},450)}',
  'V=()=>{__khmerPrintHtml(M())}',
  "8195421 V"
);

s = replaceExact(
  s,
  'ut=()=>{const He=qe(z),Ot=window.open("","_blank");if(!Ot)return;const tr=Be.map',
  'ut=()=>{const He=qe(z),tr=Be.map',
  "8261729 ut start"
);
s = replaceExact(
  s,
  'dr=ac();nc(),Ot.document.write(',
  'dr=ac();nc(),__khmerPrintHtml(',
  "8261729 ut write"
);
s = replaceExact(
  s,
  '            window.print();\n          };\n        <\\/script>\n      </body>\n      </html>\n    `),Ot.document.close()}',
  '            window.print();\n          };\n        <\\/script>\n      </body>\n      </html>\n    `)}',
  "8261729 ut end"
);

s = replaceExact(
  s,
  'B=()=>{const D=window.open("","_blank","width=1000,height=800");if(!D){window.print();return}const T=N?',
  'B=()=>{const T=N?',
  "8317598 B start"
);
s = replaceExact(
  s,
  'const H=gv();D.document.write(',
  'const H=gv();__khmerPrintHtml(',
  "8317598 B write"
);
s = replaceExact(
  s,
  '      </body>\n      </html>\n    `),D.document.close(),D.focus(),setTimeout(()=>{D.print()},450)}',
  '      </body>\n      </html>\n    `)}',
  "8317598 B end"
);

s = replaceExact(
  s,
  'X=()=>{const H=window.open("","_blank");if(!H)return;const O=ac();nc();const z=u==="bw"',
  'X=()=>{const O=ac();nc();const z=u==="bw"',
  "8636013 X start"
);
s = replaceExact(
  s,
  'H.document.write(`\n      <!DOCTYPE html>\n      <html lang="km" translate="no" class="notranslate">\n      <head>\n        <meta charset="utf-8" />\n        <meta name="google" content="notranslate" />\n        <title>បញ្ជីសិស្ស_${cleanF}_${G}</title>',
  '__khmerPrintHtml(`\n      <!DOCTYPE html>\n      <html lang="km" translate="no" class="notranslate">\n      <head>\n        <meta charset="utf-8" />\n        <meta name="google" content="notranslate" />\n        <title>បញ្ជីសិស្ស_${cleanF}_${G}</title>',
  "8636013 X write"
);
s = replaceExact(
  s,
  'ជីសិស្ស (Print)\n          </button>\n        </div>\n      </body>\n      </html>\n    `),H.document.close()}',
  'ជីសិស្ស (Print)\n          </button>\n        </div>\n      </body>\n      </html>\n    `)}',
  "8636013 X end"
);

s = replaceExact(
  s,
  'function ooe(r,t){var i;try{const l=window.open("","_blank","width=1050,height=1100,menubar=no,toolbar=no,location=no,status=no");if(l&&!l.closed){l.document.open(),l.document.write(r),l.document.close(),setTimeout(()=>{try{l.focus(),l.print()}catch(o){console.warn("Popup print trigger failed, attempting direct print",o)}},400);return}}catch(l){console.warn("Popup blocked or error opening print window, falling back to hidden iframe:",l)}const s=document.getElementById("moeys_honor_roll_print_frame");s&&s.remove();const a=document.createElement("iframe");a.id="moeys_honor_roll_print_frame",a.style.position="fixed",a.style.right="0",a.style.bottom="0",a.style.width="0",a.style.height="0",a.style.border="0",a.style.visibility="hidden",document.body.appendChild(a);const n=((i=a.contentWindow)==null?void 0:i.document)||a.contentDocument;n?(n.open(),n.write(r),n.close(),setTimeout(()=>{var l,o;try{(l=a.contentWindow)==null||l.focus(),(o=a.contentWindow)==null||o.print()}catch(c){console.error("IFrame print error:",c),window.print()}setTimeout(()=>{a.remove()},6e4)},500)):window.print()}',
  'function ooe(r,t){__khmerPrintHtml(r)}',
  "ooe use __khmerPrintHtml"
);

s = replaceExact(
  s,
  'lt=()=>{const rt=window.open("","_blank");if(!rt){window.print();return}const Xt=Be.map',
  'lt=()=>{const Xt=Be.map',
  "8718580 lt start"
);
s = replaceExact(
  s,
  'rt.document.write(`\n      <!DOCTYPE html>',
  '__khmerPrintHtml(`\n      <!DOCTYPE html>',
  "8718580 lt write"
);
s = replaceExact(
  s,
  'w.close(); }, 500);\n            };\n          <\\/script>\n        </body>\n      </html>\n    `),rt.document.close()}',
  'w.close(); }, 500);\n            };\n          <\\/script>\n        </body>\n      </html>\n    `)}',
  "8718580 lt end"
);

s = replaceExact(
  s,
  'ql=oe=>{var zo;const ft=window.open("","_blank");if(!ft)return;const ir=ac();',
  'ql=oe=>{var zo;const ir=ac();',
  "8855790 ql start"
);
s = replaceExact(
  s,
  'ft.document.write(`\n      <!DOCTYPE html>',
  '__khmerPrintHtml(`\n      <!DOCTYPE html>',
  "8855790 ql write"
);
s = replaceExact(
  s,
  '    `),ft.document.close()},R0=oe=>',
  '    `)},R0=oe=>',
  "8855790 ql end"
);

s = replaceExact(
  s,
  'me=()=>{var Qe;const ge=window.open("","_blank");if(!ge)return;const Xe=ac();',
  'me=()=>{var Qe;const Xe=ac();',
  "9694811 me start"
);
s = replaceExact(
  s,
  'ge.document.write(`\n      <!DOCTYPE html>',
  '__khmerPrintHtml(`\n      <!DOCTYPE html>',
  "9694811 me write"
);
s = replaceExact(
  s,
  '    `),ge.document.close()},ue=()=>{window.print()}',
  '    `)},ue=()=>{window.print()}',
  "9694811 me end"
);

s = replaceExact(
  s,
  'function X_(r){const t=window.open("","_blank");t?(t.document.open(),t.document.write(r),t.document.close(),setTimeout(()=>{t.focus(),t.print()},500)):window.print()}',
  'function X_(r){__khmerPrintHtml(r)}',
  "Worksheet X_"
);

// 7. Wrap all synchronous Blob download removeChild+revokeObjectURL calls with delayed cleanup
const revokePatches = [
  [
    'document.body.appendChild(c),c.click(),document.body.removeChild(c),URL.revokeObjectURL(o)',
    'document.body.appendChild(c),c.click(),setTimeout(()=>{try{document.body.removeChild(c)}catch{}},1500),setTimeout(()=>{try{URL.revokeObjectURL(o)}catch{}},6e4)',
    "Backup JSON 841507"
  ],
  [
    'document.body.appendChild(ae),ae.click(),document.body.removeChild(ae),URL.revokeObjectURL(q)',
    'document.body.appendChild(ae),ae.click(),setTimeout(()=>{try{document.body.removeChild(ae)}catch{}},1500),setTimeout(()=>{try{URL.revokeObjectURL(q)}catch{}},6e4)',
    "Holidays ICS 5557656"
  ],
  [
    'document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n)}const ttSubjStyle=',
    'document.body.appendChild(i),i.click(),setTimeout(()=>{try{document.body.removeChild(i)}catch{}},1500),setTimeout(()=>{try{URL.revokeObjectURL(n)}catch{}},6e4)}const ttSubjStyle=',
    "oCe Timetable Word"
  ],
  [
    'document.body.appendChild(Ft),Ft.click(),document.body.removeChild(Ft),URL.revokeObjectURL(ct)',
    'document.body.appendChild(Ft),Ft.click(),setTimeout(()=>{try{document.body.removeChild(Ft)}catch{}},1500),setTimeout(()=>{try{URL.revokeObjectURL(ct)}catch{}},6e4)',
    "LessonPlan Word 6659652"
  ],
  [
    'document.body.appendChild(De),De.click(),document.body.removeChild(De),URL.revokeObjectURL(Ie)',
    'document.body.appendChild(De),De.click(),setTimeout(()=>{try{document.body.removeChild(De)}catch{}},1500),setTimeout(()=>{try{URL.revokeObjectURL(Ie)}catch{}},6e4)',
    "Syllabus Word 6720244"
  ],
  [
    'document.body.appendChild(Z),Z.click(),document.body.removeChild(Z),URL.revokeObjectURL(F)',
    'document.body.appendChild(Z),Z.click(),setTimeout(()=>{try{document.body.removeChild(Z)}catch{}},1500),setTimeout(()=>{try{URL.revokeObjectURL(F)}catch{}},6e4)',
    "Honor Word 8699784"
  ],
  [
    'document.body.appendChild(D),D.click(),document.body.removeChild(D),URL.revokeObjectURL(A)',
    'document.body.appendChild(D),D.click(),setTimeout(()=>{try{document.body.removeChild(D)}catch{}},1500),setTimeout(()=>{try{URL.revokeObjectURL(A)}catch{}},6e4)',
    "Cert Word 8706482"
  ],
  [
    'document.body.appendChild(N),N.click(),document.body.removeChild(N),URL.revokeObjectURL(j)',
    'document.body.appendChild(N),N.click(),setTimeout(()=>{try{document.body.removeChild(N)}catch{}},1500),setTimeout(()=>{try{URL.revokeObjectURL(j)}catch{}},6e4)',
    "Worksheet Word 9286247"
  ],
  [
    'document.body.appendChild(Me),Me.click(),document.body.removeChild(Me),URL.revokeObjectURL(et)',
    'document.body.appendChild(Me),Me.click(),setTimeout(()=>{try{document.body.removeChild(Me)}catch{}},1500),setTimeout(()=>{try{URL.revokeObjectURL(et)}catch{}},6e4)',
    "Library TXT 9444591"
  ],
  [
    'document.body.appendChild(F),F.click(),document.body.removeChild(F),URL.revokeObjectURL(G)',
    'document.body.appendChild(F),F.click(),setTimeout(()=>{try{document.body.removeChild(F)}catch{}},1500),setTimeout(()=>{try{URL.revokeObjectURL(G)}catch{}},6e4)',
    "Backup JSON all years 10147563"
  ]
];

for (const [find, rep, label] of revokePatches) {
  s = replaceExact(s, find, rep, label);
}

fs.writeFileSync(targetPath, s, "utf8");
console.log("Successfully patched v126 ->", targetPath, "size:", s.length);
