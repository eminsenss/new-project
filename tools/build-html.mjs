// Renders site/index.html from src/page.mjs + src/data.mjs.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { renderPage } from '../src/page.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const manifest = JSON.parse(await readFile(path.join(root, 'data/img-manifest.json'), 'utf8'));
const snap = JSON.parse(await readFile(path.join(root, 'data/nurajanda-snapshot-2026-11-08.json'), 'utf8'));
const css = await readFile(path.join(root, 'site/assets/css/main.css'), 'utf8');
const js = await readFile(path.join(root, 'site/assets/js/app.js'), 'utf8');
const version = createHash('sha1').update(css + js).digest('hex').slice(0, 8);

// Real product photo on nurajanda.com (original JPG) for structured data
const byUrl = new Map(snap.details.map((d) => [d.url, d]));
const origImage = (rel) => {
  const d = byUrl.get(`https://nurajanda.com${rel}`);
  return d && d.imgs[0] ? `https://nurajanda.com/image/${d.imgs[0]}.jpg` : null;
};

const heroKey = 'c/15015-1-bostanci-dikisli-siyah';
const hero = manifest[`img/${heroKey}`];
const criticalPreloads = [
  '<link rel="preload" href="assets/fonts/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>',
  '<link rel="preload" href="assets/fonts/instrument-serif-latin-400-italic.woff2" as="font" type="font/woff2" crossorigin>',
  '<link rel="preload" href="assets/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>',
  `<link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesrcset="${hero.sizes.map((s) => `assets/img/${heroKey}-${s}.avif ${s}w`).join(', ')}" imagesizes="(min-width: 1000px) 30vw, 52vw">`,
].join('\n');

const html = renderPage({ manifest, css: version, criticalPreloads, origImage });
await writeFile(path.join(root, 'site/index.html'), html);
console.log(`site/index.html ${(html.length / 1024).toFixed(1)} KB, v=${version}`);
