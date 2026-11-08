// Builds responsive AVIF/WebP derivatives of the real nurajanda.com product photos.
// Sources: assets-src/originals (1000x1000 JPG as downloaded; '-crop' = white margin trimmed), assets-src/cutouts
// (same photos with the white studio background removed by tools/cutout.py),
// assets-src/thumbs (300x300 WebP listing images). Output: site/assets/img/**
import sharp from 'sharp';
import { readdir, mkdir, writeFile, readFile, access, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = (p) => path.join(root, 'assets-src', p);
const out = (p) => path.join(root, 'site', 'assets', p);
const exists = (p) => access(p).then(() => true, () => false);

const SETS = [
  { dir: 'originals', to: 'img/p', widths: [480, 800, 1000], ext: '.jpg' },
  { dir: 'cutouts', to: 'img/c', widths: [360, 600, 900], ext: '.webp' },
];

const manifest = {};
const cutoutNames = new Set((await readdir(src('cutouts'))).map((f) => f.replace(/\.webp$/, '')));

async function variants(file, toDir, widths) {
  const img = sharp(file);
  const meta = await img.metadata();
  const name = path.basename(file).replace(/\.(jpg|webp|png)$/i, '');
  const ws = [...new Set(widths.map((w) => Math.min(w, meta.width)))];
  await mkdir(out(toDir), { recursive: true });
  const srcTime = (await stat(file)).mtimeMs;
  for (const w of ws) {
    const base = out(`${toDir}/${name}-${w}`);
    const fresh = await stat(`${base}.webp`).then((s) => s.mtimeMs > srcTime, () => false)
      && await exists(`${base}.avif`);
    if (fresh) continue; // incremental
    const r = sharp(file).resize({ width: w, withoutEnlargement: true });
    await r.clone().avif({ quality: 56, effort: 5 }).toFile(`${base}.avif`);
    await r.clone().webp({ quality: 80, effort: 5, alphaQuality: 90 }).toFile(`${base}.webp`);
  }
  manifest[`${toDir}/${name}`] = { w: meta.width, h: meta.height, sizes: ws };
}

for (const set of SETS) {
  let files = (await readdir(src(set.dir))).filter((f) => f.endsWith(set.ext));
  // originals that have a background-removed cutout are kept only as provenance/source
  if (set.dir === 'originals') files = files.filter((f) => !cutoutNames.has(f.replace(/\.jpg$/, '')));
  for (const f of files) await variants(src(`${set.dir}/${f}`), set.to, set.widths);
  console.log(`${set.dir}: ${files.length} files`);
}

// Search / quote-list thumbnails (160px, white square)
const snap = JSON.parse(await readFile(path.join(root, 'data/nurajanda-snapshot-2026-11-08.json'), 'utf8'));
await mkdir(out('img/t'), { recursive: true });
const catalog = [];
for (const p of snap.products) {
  let thumb = null;
  if (p.thumb) {
    const t1 = src(`thumbs/${p.thumb}.webp`);
    const t2 = src(`originals/${p.thumb}.jpg`);
    const from = (await exists(t1)) ? t1 : (await exists(t2)) ? t2 : null;
    if (from) {
      await sharp(from).resize(160, 160, { fit: 'contain', background: '#ffffff' }).flatten({ background: '#ffffff' })
        .webp({ quality: 78 }).toFile(out(`img/t/${p.thumb}.webp`));
      thumb = `assets/img/t/${p.thumb}.webp`;
    }
  }
  catalog.push({ n: p.name, m: p.model, p: p.price, u: p.url, t: thumb, c: p.cats });
}
await mkdir(out('data'), { recursive: true });
await writeFile(out('data/catalog.json'), JSON.stringify({ retrieved: snap.retrieved, products: catalog }));
await writeFile(path.join(root, 'data/img-manifest.json'), JSON.stringify(manifest, null, 1));
console.log(`catalog: ${catalog.length} products, thumbs: ${catalog.filter((c) => c.t).length}`);
