const fs = require("fs");
const path = require("path");

const targetPath = path.join(process.cwd(), "public/assets/index-BwPwHqBe.js");
let s = fs.readFileSync(targetPath, "utf8");

function replaceExact(src, find, rep, label) {
  const idx = src.indexOf(find);
  if (idx === -1) throw new Error(`Missing exact target [${label}]`);
  const second = src.indexOf(find, idx + find.length);
  if (second !== -1) throw new Error(`Non-unique target [${label}]`);
  return src.slice(0, idx) + rep + src.slice(idx + find.length);
}

// 1. Silence cross-origin stylesheet console.errors and guard insertRule inside html-to-image's ntt()
s = replaceExact(
  s,
  'function ntt(r,t){const s=[],a=[];return r.forEach(n=>{if("cssRules"in n)try{Qh(n.cssRules||[]).forEach((i,l)=>{if(i.type===CSSRule.IMPORT_RULE){let o=l+1;const c=i.href,d=E_(c).then(u=>O_(u,t)).then(u=>H_(u).forEach(h=>{try{n.insertRule(h,h.startsWith("@import")?o+=1:n.cssRules.length)}catch(m){console.error("Error inserting rule from remote css",{rule:h,error:m})}})).catch(u=>{console.error("Error loading remote css",u.toString())});a.push(d)}})}catch(i){const l=r.find(o=>o.href==null)||document.styleSheets[0];n.href!=null&&a.push(E_(n.href).then(o=>O_(o,t)).then(o=>H_(o).forEach(c=>{l.insertRule(c,l.cssRules.length)})).catch(o=>{console.error("Error loading remote stylesheet",o)})),console.error("Error inlining remote css file",i)}}),Promise.all(a).then(()=>(r.forEach(n=>{if("cssRules"in n)try{Qh(n.cssRules||[]).forEach(i=>{s.push(i)})}catch(i){console.error(`Error while reading CSS rules from ${n.href}`,i)}}),s))}',
  'function ntt(r,t){const s=[],a=[];return r.forEach(n=>{if("cssRules"in n)try{Qh(n.cssRules||[]).forEach((i,l)=>{if(i.type===CSSRule.IMPORT_RULE){let o=l+1;const c=i.href,d=E_(c).then(u=>O_(u,t)).then(u=>H_(u).forEach(h=>{try{n.insertRule(h,h.startsWith("@import")?o+=1:n.cssRules.length)}catch{}})).catch(()=>{});a.push(d)}})}catch{const l=r.find(o=>o.href==null)||document.styleSheets[0];n.href!=null&&l&&a.push(E_(n.href).then(o=>O_(o,t)).then(o=>H_(o).forEach(c=>{try{l.insertRule(c,l.cssRules.length)}catch{}})).catch(()=>{}))}}),Promise.all(a).then(()=>(r.forEach(n=>{if("cssRules"in n)try{Qh(n.cssRules||[]).forEach(i=>{s.push(i)})}catch{}}),s))}',
  "Silence cross-origin stylesheet errors in ntt"
);

// 2. Replace __khmerCaptureNode & __khmerDownloadPdfFromHtml with html2canvas clean-iframe renderer
const oldCaptureStart = 'async function __khmerCaptureNode(node) {';
const oldCaptureEnd = '\nconst Oi=({isOpen:';
const iStart = s.indexOf(oldCaptureStart);
const iEnd = s.indexOf(oldCaptureEnd);
if (iStart === -1 || iEnd === -1 || iEnd <= iStart) {
  throw new Error(`Could not locate capture helper block (${iStart}..${iEnd})`);
}

const newCaptureBlock = `async function __khmerEnsureH2c() {
  if (typeof window.html2canvas === "function") return window.html2canvas;
  await new Promise((res, rej) => {
    const existing = document.querySelector('script[src*="html2canvas"]');
    if (existing) {
      if (typeof window.html2canvas === "function") { res(); return; }
      existing.addEventListener("load", () => res(), { once: !0 });
      existing.addEventListener("error", (e) => rej(e), { once: !0 });
      setTimeout(() => typeof window.html2canvas === "function" ? res() : rej(new Error("h2c timeout")), 5000);
      return;
    }
    const sc = document.createElement("script");
    sc.src = "/html2canvas.min.js";
    sc.onload = () => res();
    sc.onerror = (e) => rej(e);
    document.head.appendChild(sc);
  });
  if (typeof window.html2canvas !== "function") throw new Error("html2canvas unavailable");
  return window.html2canvas;
}
async function __khmerCaptureNode(node) {
  return await utt(node, { pixelRatio: 1.75, backgroundColor: "#ffffff", skipFonts: !0, fontEmbedCSS: "" });
}
async function __khmerHtmlToCanvas(html, capW, fitOnePage) {
  let fr = null;
  try {
    const h2c = await __khmerEnsureH2c();
    const raw = String(html || "")
      .replace(/<script\\b[^>]*>[\\s\\S]*?<\\/script>/gi, "")
      .replace(/<link[^>]*cdnjs\\.cloudflare\\.com[^>]*>/gi, "");
    const injectStyle = "<style>html,body{margin:0!important;background:#ffffff!important;width:" + capW + "px!important;box-sizing:border-box!important;}.no-print{display:none!important;}</style>";
    const cleanHtml = /<\\/head>/i.test(raw) ? raw.replace(/<\\/head>/i, injectStyle + "</head>") : injectStyle + raw;
    const prev = document.getElementById("__khmer_pdf_cap_iframe");
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
    fr = document.createElement("iframe");
    fr.id = "__khmer_pdf_cap_iframe";
    fr.style.cssText = "position:fixed;left:0;top:0;width:" + capW + "px;height:900px;border:0;z-index:1;opacity:1;pointer-events:none;background:#ffffff;";
    document.body.appendChild(fr);
    const fdoc = (fr.contentWindow && fr.contentWindow.document) || fr.contentDocument;
    if (!fdoc) throw new Error("Capture iframe unavailable");
    fdoc.open();
    fdoc.write(cleanHtml);
    fdoc.close();
    try {
      if (fdoc.fonts && fdoc.fonts.ready) {
        await Promise.race([fdoc.fonts.ready, new Promise(r => setTimeout(r, 1200))]);
      }
    } catch {}
    const imgs = Array.from(fdoc.querySelectorAll("img"));
    if (imgs.length > 0) {
      await Promise.race([
        Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; }))),
        new Promise(r => setTimeout(r, 1200))
      ]);
    }
    await new Promise(r => setTimeout(r, 150));
    const bodyEl = fdoc.body || fdoc.documentElement;
    if (bodyEl && fitOnePage) {
      bodyEl.style.padding = bodyEl.style.padding || "14px 18px";
    } else if (bodyEl) {
      bodyEl.style.padding = bodyEl.style.padding || "20px 24px";
    }
    const fullH = Math.max(
      fdoc.body ? fdoc.body.scrollHeight : 0,
      fdoc.documentElement ? fdoc.documentElement.scrollHeight : 0,
      780
    );
    fr.style.height = fullH + "px";
    await new Promise(r => setTimeout(r, 60));
    const canvas = await h2c(bodyEl, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: !0,
      allowTaint: !1,
      logging: !1,
      width: capW,
      height: fullH,
      windowWidth: capW,
      windowHeight: fullH
    });
    if (!canvas || !canvas.width || !canvas.height) throw new Error("Empty html2canvas output");
    return canvas;
  } finally {
    if (fr && fr.parentNode) {
      try { fr.parentNode.removeChild(fr); } catch {}
    }
  }
}
async function __khmerDownloadPdfFromHtml(html, baseFilename, opts, onToast) {
  try {
    const isLand = (opts && opts.orientation === "landscape") || /@page\\s*\\{[^}]*landscape/i.test(String(html || ""));
    const fitOnePage = !!(opts && opts.fitOnePage);
    const capW = isLand ? 1123 : 794;
    const canvas = await __khmerHtmlToCanvas(html, capW, fitOnePage);
    return __khmerCanvasToPdf(canvas, { orientation: isLand ? "landscape" : "portrait", paperSize: opts && opts.paperSize, fitOnePage }, baseFilename, onToast);
  } catch (err) {
    console.warn("Direct PDF generation fallback to iframe print:", err);
    __khmerPrintHtml(html, onToast, "បានបើកផ្ទាំងបោះពុម្ព PDF!");
    return !1;
  }
}
`;

s = s.slice(0, iStart) + newCaptureBlock + s.slice(iEnd);

// 3. Also slightly inset fitOnePage margin in __khmerCanvasToPdf so 1-page PDF looks crisp with white breathing margin
s = replaceExact(
  s,
  '  if (opts && opts.fitOnePage) {\n    const scale = Math.min(pageW / W, pageH / H);\n    const drawW = W * scale;\n    const drawH = H * scale;\n    const dx = (pageW - drawW) / 2;\n    const dy = Math.max(0, pageH - drawH);',
  '  if (opts && opts.fitOnePage) {\n    const padPt = 12;\n    const scale = Math.min((pageW - padPt * 2) / W, (pageH - padPt * 2) / H);\n    const drawW = W * scale;\n    const drawH = H * scale;\n    const dx = (pageW - drawW) / 2;\n    const dy = Math.max(padPt, pageH - padPt - drawH);',
  "__khmerCanvasToPdf balanced 1-page padding"
);

// 4. Update LCe's PngExp & PdfExp to render clean standalone G() HTML with html2canvas (no oklch / Safari foreignObject crash!)
s = replaceExact(
  s,
  '  const PngExp=async()=>{if(!T.current)return;try{const cnv=await __khmerCaptureNode(T.current);__khmerSaveDataUrl(cnv.toDataURL("image/png"),`ប្លង់តុសិស្ស_${s.grade||"ថ្នាក់"}.png`)}catch(err){console.error(err)}};\n  const PdfExp=async()=>{if(lcePdfBusy)return;setLcePdfBusy(!0);try{if(T.current){const cnv=await __khmerCaptureNode(T.current);if(cnv&&cnv.width&&cnv.height){__khmerCanvasToPdf(cnv,{orientation:"landscape",paperSize:"A4",fitOnePage:!0},`ប្លង់តុសិស្ស_${s.grade||"ថ្នាក់"}`);return}}await __khmerDownloadPdfFromHtml(G(),`ប្លង់តុសិស្ស_${s.grade||"ថ្នាក់"}`,{orientation:"landscape",paperSize:"A4",fitOnePage:!0})}catch(err){console.error(err);__khmerPrintHtml(G())}finally{setLcePdfBusy(!1)}};',
  '  const PngExp=async()=>{try{const cnv=await __khmerHtmlToCanvas(G(),1123,!0);__khmerSaveDataUrl(cnv.toDataURL("image/png"),`ប្លង់តុសិស្ស_${s.grade||"ថ្នាក់"}.png`)}catch(err){console.warn("PNG export fallback:",err)}};\n  const PdfExp=async()=>{if(lcePdfBusy)return;setLcePdfBusy(!0);try{await __khmerDownloadPdfFromHtml(G(),`ប្លង់តុសិស្ស_${s.grade||"ថ្នាក់"}`,{orientation:"landscape",paperSize:"A4",fitOnePage:!0})}catch(err){console.warn("PDF export fallback:",err);__khmerPrintHtml(G())}finally{setLcePdfBusy(!1)}};',
  "LCe use __khmerHtmlToCanvas"
);

fs.writeFileSync(targetPath, s, "utf8");
console.log("Successfully patched v127 ->", targetPath, "size:", s.length);
