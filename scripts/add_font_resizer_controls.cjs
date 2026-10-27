const fs = require('fs');
const path = require('path');

console.log('=== Adding Font Size Controls (ពង្រីក/ពង្រួមតួអក្សរ) to Lessons and QCM ===');

// 1. Update index.html with global CSS, font engine, and floating widget
let indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const fontEngineScript = `
    <!-- Global Font Scaling Engine & Floating Font Resizer Widget -->
    <style>
      :root {
        --app-font-scale: 1;
      }
      html {
        font-size: calc(16px * var(--app-font-scale, 1)) !important;
      }
      #app-global-font-widget {
        position: fixed;
        bottom: 84px;
        right: 16px;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 5px;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(12px);
        border: 1.5px solid #cbd5e1;
        border-radius: 9999px;
        padding: 5px 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        font-family: 'Kantumruy Pro', 'Battambang', system-ui, sans-serif;
        user-select: none;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      #app-global-font-widget:hover {
        border-color: #3b82f6;
        box-shadow: 0 14px 28px -5px rgba(37, 99, 235, 0.25);
      }
      .app-font-btn {
        border-radius: 9999px;
        font-weight: 900;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .app-font-btn:active {
        transform: scale(0.92);
      }
    </style>
    <script>
      (function() {
        var stored = parseFloat(localStorage.getItem('app_font_scale_val')) || 1.0;
        window.__fontScale = Math.max(0.8, Math.min(stored, 1.6));
        
        window.updateAppFontScale = function(newVal) {
          window.__fontScale = Math.round(Math.max(0.8, Math.min(newVal, 1.6)) * 100) / 100;
          localStorage.setItem('app_font_scale_val', window.__fontScale.toFixed(2));
          
          document.documentElement.style.setProperty('--app-font-scale', window.__fontScale);
          document.documentElement.style.fontSize = (16 * window.__fontScale) + 'px';
          
          var pct = Math.round(window.__fontScale * 100) + '%';
          var badges = document.querySelectorAll('.app-font-scale-badge');
          badges.forEach(function(b) {
            b.textContent = pct;
          });
        };

        window.adjustAppFontScale = function(delta) {
          window.updateAppFontScale((window.__fontScale || 1.0) + delta);
        };

        window.resetAppFontScale = function() {
          window.updateAppFontScale(1.0);
        };

        function initFontWidget() {
          window.updateAppFontScale(window.__fontScale);
          if (document.getElementById('app-global-font-widget')) return;

          var widget = document.createElement('div');
          widget.id = 'app-global-font-widget';
          widget.innerHTML = \`
            <span style="font-size: 11px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 4px;">
              <span style="font-size: 14px;">🔍</span><span style="color: #475569; font-size: 11px;">ទំហំអក្សរ</span>
            </span>
            <button onclick="window.adjustAppFontScale(-0.1)" title="ពង្រួមតួអក្សរ (A-)" class="app-font-btn" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; font-size: 12px; padding: 2px 8px;">A-</button>
            <span class="app-font-scale-badge" style="font-size: 12px; font-weight: 800; color: #2563eb; min-width: 38px; text-align: center;">\${Math.round(window.__fontScale * 100)}%</span>
            <button onclick="window.adjustAppFontScale(0.1)" title="ពង្រីកតួអក្សរ (A+)" class="app-font-btn" style="background: #2563eb; color: #ffffff; border: 1px solid #1d4ed8; font-size: 12px; padding: 2px 8px;">A+</button>
            <button onclick="window.resetAppFontScale()" title="ទំហំដើម (100%)" class="app-font-btn" style="background: #e2e8f0; color: #475569; border: 1px solid #cbd5e1; font-size: 11px; padding: 2px 6px;">🔄</button>
          \`;
          document.body.appendChild(widget);
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initFontWidget);
        } else {
          initFontWidget();
        }
      })();
    </script>
`;

if (!indexHtml.includes('app-global-font-widget')) {
  indexHtml = indexHtml.replace('</head>', fontEngineScript + '\n</head>');
  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
  console.log('Successfully added global Font Scaling Engine to index.html!');
} else {
  console.log('Font Engine already in index.html.');
}

// 2. Inject Header Control Buttons into Lesson & QCM headers in JS bundle
function updateBundleFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    return;
  }
  let js = fs.readFileSync(filePath, 'utf8');

  // Inject into Lesson header near 'ចម្លងមេរៀន'
  const lessonHeaderTarget = 'children: [                    e.jsx("span", { children: "📋" }),                    e.jsx("span", { className: "hidden sm:inline", children: "ចម្លងមេរៀន" })                  ]                }),';
  
  const lessonFontButtonsJSX = `e.jsxs("div", {
                  className: "flex items-center bg-slate-100/90 border border-slate-200/90 rounded-xl p-1 gap-1 text-xs font-bold text-slate-700 shadow-2xs mr-1",
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
                }),`;

  if (js.includes(lessonHeaderTarget) && !js.includes('app-font-scale-badge')) {
    js = js.replace(lessonHeaderTarget, lessonHeaderTarget + '\n' + lessonFontButtonsJSX);
    console.log('Injected font controls into Lesson Header in', filePath);
  }

  // Inject into QCM header near 'ស្ដាប់សំណួរ'
  const qcmHeaderTarget = 'children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: isSpeaking ? "កំពុងអាន..." : "ស្ដាប់សំណួរ" })]                          })                        ]                      }),';
  
  const qcmFontButtonsJSX = `e.jsxs("div", {
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
                      }),`;

  if (js.includes(qcmHeaderTarget) && !js.includes('app-font-scale-badge')) {
    js = js.replace(qcmHeaderTarget, qcmHeaderTarget + '\n' + qcmFontButtonsJSX);
    console.log('Injected font controls into QCM Header in', filePath);
  }

  fs.writeFileSync(filePath, js, 'utf8');
}

updateBundleFile(path.join(__dirname, '../public/assets/index-BwPwHqBe.js'));
updateBundleFile(path.join(__dirname, '../dist/assets/index-BwPwHqBe.js'));

console.log('=== Done! ===');
