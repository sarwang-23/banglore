import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Bundle JS directly with esbuild JS API (super fast, no extra processes)
await esbuild.build({
  entryPoints: ['app.js'],
  bundle: true,
  outfile: path.join(distDir, 'bundle.js'),
  format: 'esm',
  minify: true
});

// Also keep a copy of bundle.js in root for local server if needed
fs.copyFileSync(path.join(distDir, 'bundle.js'), path.resolve('bundle.js'));

// 2. Copy static files to dist
fs.copyFileSync('index.html', path.join(distDir, 'index.html'));
fs.copyFileSync('styles.css', path.join(distDir, 'styles.css'));

console.log('Successfully built static assets into dist/');
