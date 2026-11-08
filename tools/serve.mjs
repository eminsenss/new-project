// Zero-dependency static server for local preview: node tools/serve.mjs site 4173
import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { createGzip } from 'node:zlib';
import path from 'node:path';

const dir = path.resolve(process.argv[2] || 'site');
const port = Number(process.argv[3] || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.xml': 'application/xml',
};
const COMPRESS = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml']);

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(dir, url);
  if (!file.startsWith(dir)) { res.writeHead(403).end(); return; }
  try { if (statSync(file).isDirectory()) file = path.join(file, 'index.html'); } catch { /* 404 below */ }
  let st; try { st = statSync(file); } catch { res.writeHead(404, { 'content-type': 'text/plain' }).end('404'); return; }
  const ext = path.extname(file).toLowerCase();
  const headers = {
    'content-type': TYPES[ext] || 'application/octet-stream',
    'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    'x-robots-tag': 'noindex, nofollow',
    'x-content-type-options': 'nosniff',
  };
  if (COMPRESS.has(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) {
    res.writeHead(200, { ...headers, 'content-encoding': 'gzip', vary: 'accept-encoding' });
    createReadStream(file).pipe(createGzip()).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'content-length': st.size });
    createReadStream(file).pipe(res);
  }
}).listen(port, () => console.log(`Nur Ajanda demo → http://localhost:${port}`));
