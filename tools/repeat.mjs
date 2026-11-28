// 사용법: node tools/repeat.mjs [--order fwd,rev,fwd] [--only id,id]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : ''; };
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.wasm': 'application/wasm', '.csv': 'text/csv; charset=utf-8', '.py': 'text/plain; charset=utf-8', '.R': 'text/plain; charset=utf-8', '.zip': 'application/zip', '.whl': 'application/zip', '.data': 'application/octet-stream' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('console', m => console.log(m.text()));
page.on('pageerror', e => console.log('PAGE ERROR', e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/tools/repeat.html?order=${arg('--order') || 'fwd,rev,fwd'}&only=${arg('--only')}`);
await page.waitForFunction(() => window.__done, null, { timeout: 90 * 60 * 1000, polling: 2000 });
const bad = await page.evaluate(() => window.__done);
await browser.close(); server.close();
const ids = Object.keys(bad);
console.log(`\n반복 실행에서 달라진 문제: ${ids.length}개`);
ids.forEach(id => console.log(id, bad[id].join(' || ')));
process.exit(ids.length ? 1 : 0);
