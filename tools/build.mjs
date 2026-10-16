// 사용법: node tools/build.mjs [--only id1,id2]
// problems_src 의 문제를 브라우저(Chromium)에서 실제 엔진으로 검증하고 site/problems 를 만든다.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx > 0 ? process.argv[onlyIdx + 1] : '';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css',
  '.wasm': 'application/wasm', '.csv': 'text/csv; charset=utf-8', '.py': 'text/plain; charset=utf-8', '.R': 'text/plain; charset=utf-8',
  '.zip': 'application/zip', '.whl': 'application/zip', '.data': 'application/octet-stream' };

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const file = path.join(root, decodeURIComponent(u.pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('console', m => console.log(m.text()));
page.on('pageerror', e => console.log('PAGE ERROR', e.message));
await page.goto(`http://127.0.0.1:${port}/site/verify.html${only ? '?only=' + only : ''}`);
await page.waitForFunction(() => window.__done, null, { timeout: 25 * 60 * 1000, polling: 1000 });
const results = await page.evaluate(() => window.__done);
await browser.close();
server.close();

const { TRACKS } = await import(path.join(root, 'site/js/tracks.js'));
const outDir = path.join(root, 'site/problems');
const failed = results.filter(r => r.errors.length);
if (only) {
  for (const r of results.filter(r => !r.errors.length && r.pub)) fs.writeFileSync(path.join(outDir, r.id + '.json'), JSON.stringify(r.pub));
  console.log(`\n(--only 모드: 개별 파일만 갱신, index.json 은 그대로) 실패 ${failed.length}개`);
  process.exit(failed.length ? 1 : 0);
}
if (failed.length) { console.log(`\n실패한 문제 ${failed.length}개 — 사이트 파일을 갱신하지 않았어요.`); process.exit(1); }

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
const rank = p => [TRACKS.findIndex(t => t.id === p.track), TRACKS.find(t => t.id === p.track).categories.indexOf(p.category), p.level, p.id];
const list = results.map(r => r.pub).sort((a, b) => {
  const x = rank(a), y = rank(b);
  for (let i = 0; i < 4; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  return 0;
});
for (const p of list) fs.writeFileSync(path.join(outDir, p.id + '.json'), JSON.stringify(p));
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify({ problems: list.map(p => ({ id: p.id, track: p.track, category: p.category, level: p.level, title: p.title })) }));
console.log(`\n문제 ${list.length}개 검증 통과 → site/problems 생성 완료`);
