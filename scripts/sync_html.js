import fs from 'node:fs';

const content = fs.readFileSync('index.html', 'utf8');

fs.writeFileSync('public/index.html', content, 'utf8');
console.log('Synced to public/index.html');

if (fs.existsSync('dist/index.html')) {
  fs.writeFileSync('dist/index.html', content, 'utf8');
  console.log('Synced to dist/index.html');
}
