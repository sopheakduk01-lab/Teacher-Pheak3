const fs = require('fs');
const esbuild = require('esbuild');

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Let's fix the specific place where button children array ends and comma + e.jsxs("div" starts
  // We want: ... ]}),\n                          e.jsxs("div",
  code = code.replace(/(children:\s*\[e\.jsx\("span",\s*\{[^}]+\},\s*e\.jsx\("span",\s*\{[^}]+\}\)\s*\])\s*,\s*(e\.jsxs\("div",)/g, '$1}),\n                          $2');

  // If that didn't match, try string search and replace
  const searchPattern = 'children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: isSpeaking ? "កំពុងអាន..." : "ស្ដាប់សំណួរ" })]';
  if (code.includes(searchPattern + '\n                          , e.jsxs("div",')) {
    code = code.replace(searchPattern + '\n                          , e.jsxs("div",', searchPattern + '\n                          }),\n                          e.jsxs("div",');
  } else if (code.includes(searchPattern + '\n                           , e.jsxs("div",')) {
    code = code.replace(searchPattern + '\n                           , e.jsxs("div",', searchPattern + '\n                           }),\n                           e.jsxs("div",');
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Successfully fixed and validated ${filePath}`);
  } catch (err) {
    console.error(`Validation failed for ${filePath}:`, err);
    process.exit(1);
  }
});
