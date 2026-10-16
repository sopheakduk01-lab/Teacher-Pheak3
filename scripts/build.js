import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Copy public assets to dist if present
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
}

// 2. Ensure index.html exists in dist
if (fs.existsSync(path.join(rootDir, 'index.html'))) {
  fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));
}

// 3. Bundle server.ts to dist/server.cjs using esbuild
try {
  execSync('npx esbuild server.ts --platform=node --bundle --outfile=dist/server.cjs --format=cjs --sourcemap --external:vite --external:express', {
    stdio: 'inherit',
    cwd: rootDir,
  });
} catch (err) {
  console.error('Failed to bundle server.ts with esbuild:', err);
  process.exit(1);
}

// 4. Verify build artifacts
const requiredFiles = ['index.html', 'server.cjs'];
for (const file of requiredFiles) {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing expected build artifact: dist/${file}`);
    process.exit(1);
  }
}

const distFiles = fs.readdirSync(distDir);
console.log('Build completed successfully. Artifacts in dist:');
for (const f of distFiles) {
  const stat = fs.statSync(path.join(distDir, f));
  console.log(` - dist/${f} (${stat.isDirectory() ? 'dir' : stat.size + ' bytes'})`);
}
