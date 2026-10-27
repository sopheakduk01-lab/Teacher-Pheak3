const fs = require('fs');
const esbuild = require('esbuild');

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace the problematic pattern where a comma precedes e.jsxs("div", { ... }) inside QCM speech button container
  const target = `children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: isSpeaking ? "កំពុងអាន..." : "ស្ដាប់សំណួរ" })]
                           , e.jsxs("div", {`;

  const replacement = `children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: isSpeaking ? "កំពុងអាន..." : "ស្ដាប់សំណួរ" })]
                           }),
                           e.jsxs("div", {`;

  if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log(`Replaced target pattern in ${filePath}`);
  } else {
    // Fallback regex replacement
    code = code.replace(/children:\s*\[\s*e\.jsx\("span",\s*\{[^}]+\}\),\s*e\.jsx\("span",\s*\{[^}]+\}\)\s*\]\s*,\s*(e\.jsxs\("div",)/g, (match, p1) => {
      return match.replace(/,\s*e\.jsxs\("div",/, ']\n                           }),\n                           ' + p1);
    });
    console.log(`Applied regex replacement in ${filePath}`);
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Successfully fixed and validated ${filePath}`);
  } catch (err) {
    console.error(`Validation failed for ${filePath}:`, err);
  }
});
