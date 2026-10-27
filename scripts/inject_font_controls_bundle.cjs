const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Lesson Header Font Buttons Injection
  // Search for the JSX rendering "ចម្លងមេរៀន"
  let lessonIdx = code.indexOf('ចម្លងមេរៀន');
  console.log('Lesson Copy Text index:', lessonIdx);

  if (lessonIdx !== -1) {
    // Find the enclosing e.jsxs("button", {...}) or neighboring buttons
    let buttonStart = code.lastIndexOf('e.jsxs("button"', lessonIdx);
    if (buttonStart !== -1) {
      const lessonFontControls = `e.jsxs("div", {
        className: "flex items-center bg-slate-100/90 border border-slate-200/90 rounded-xl p-1 gap-1 text-xs font-bold text-slate-700 shadow-2xs mr-1.5",
        children: [
          e.jsx("button", {
            onClick: () => window.adjustAppFontScale && window.adjustAppFontScale(-0.1),
            title: "ពង្រួមតួអក្សរ (A-)",
            className: "px-2 py-0.5 rounded-lg bg-white hover:bg-slate-200 active:scale-95 transition cursor-pointer text-slate-800 shadow-2xs font-extrabold text-[11px]",
            children: "A-"
          }),
          e.jsx("span", {
            className: "app-font-scale-badge px-1 text-[11px] text-indigo-700 font-extrabold min-w-[34px] text-center",
            children: Math.round((window.__fontScale || 1) * 100) + "%"
          }),
          e.jsx("button", {
            onClick: () => window.adjustAppFontScale && window.adjustAppFontScale(0.1),
            title: "ពង្រីកតួអក្សរ (A+)",
            className: "px-2 py-0.5 rounded-lg bg-white hover:bg-slate-200 active:scale-95 transition cursor-pointer text-slate-800 shadow-2xs font-extrabold text-[11px]",
            children: "A+"
          }),
          e.jsx("button", {
            onClick: () => window.resetAppFontScale && window.resetAppFontScale(),
            title: "ទំហំដើម (100%)",
            className: "px-1.5 py-0.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-[10px] text-slate-600 transition cursor-pointer",
            children: "🔄"
          })
        ]
      }), `;

      if (!code.includes('app-font-scale-badge')) {
        code = code.slice(0, buttonStart) + lessonFontControls + code.slice(buttonStart);
        console.log('Successfully inserted font resizer into Lesson header in', filePath);
      }
    }
  }

  // 2. QCM Header Font Buttons Injection
  let qcmIdx = code.indexOf('ស្ដាប់សំណួរ');
  console.log('QCM Speak Question index:', qcmIdx);

  if (qcmIdx !== -1) {
    let qcmBtnEnd = code.indexOf('})', qcmIdx);
    if (qcmBtnEnd !== -1) {
      qcmBtnEnd = code.indexOf('})', qcmBtnEnd + 2); // past button closing
      const qcmFontControls = `, e.jsxs("div", {
        className: "flex items-center bg-amber-50/90 border border-amber-200 rounded-full p-0.5 px-1.5 gap-1 text-xs font-bold text-amber-900 shadow-2xs ml-auto sm:ml-0",
        children: [
          e.jsx("span", { className: "text-[10px] text-amber-800 font-semibold mr-0.5 hidden xs:inline", children: "អក្សរ:" }),
          e.jsx("button", {
            onClick: () => window.adjustAppFontScale && window.adjustAppFontScale(-0.1),
            title: "ពង្រួមតួអក្សរ (A-)",
            className: "px-2 py-0.5 rounded-full bg-white hover:bg-amber-100 active:scale-95 transition cursor-pointer text-amber-950 font-black shadow-2xs text-[11px]",
            children: "A-"
          }),
          e.jsx("span", {
            className: "app-font-scale-badge px-1 text-[11px] text-amber-900 font-extrabold min-w-[34px] text-center",
            children: Math.round((window.__fontScale || 1) * 100) + "%"
          }),
          e.jsx("button", {
            onClick: () => window.adjustAppFontScale && window.adjustAppFontScale(0.1),
            title: "ពង្រីកតួអក្សរ (A+)",
            className: "px-2 py-0.5 rounded-full bg-white hover:bg-amber-100 active:scale-95 transition cursor-pointer text-amber-950 font-black shadow-2xs text-[11px]",
            children: "A+"
          }),
          e.jsx("button", {
            onClick: () => window.resetAppFontScale && window.resetAppFontScale(),
            title: "ទំហំដើម (100%)",
            className: "px-1.5 py-0.5 rounded-full bg-amber-200/80 hover:bg-amber-300 text-[10px] text-amber-900 transition cursor-pointer",
            children: "🔄"
          })
        ]
      })`;

      if (!code.slice(qcmIdx, qcmIdx + 500).includes('app-font-scale-badge')) {
        code = code.slice(0, qcmBtnEnd) + qcmFontControls + code.slice(qcmBtnEnd);
        console.log('Successfully inserted font resizer into QCM header in', filePath);
      }
    }
  }

  fs.writeFileSync(filePath, code, 'utf8');
}

processFile(path.join(__dirname, '../public/assets/index-BwPwHqBe.js'));
processFile(path.join(__dirname, '../dist/assets/index-BwPwHqBe.js'));

console.log('=== Injected font controls into bundle successfully ===');
