// 사용법: npm run serve  →  http://localhost:8080 (아이패드는 같은 와이파이에서 PC의 IP 주소로 접속)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../site');
const port = Number(process.env.PORT || 8080);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css',
  '.wasm': 'application/wasm', '.csv': 'text/csv; charset=utf-8', '.py': 'text/plain; charset=utf-8', '.R': 'text/plain; charset=utf-8',
  '.zip': 'application/zip', '.whl': 'application/zip', '.data': 'application/octet-stream' };

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(port, '0.0.0.0', () => console.log(`http://localhost:${port}  (Ctrl+C 로 종료)`));
