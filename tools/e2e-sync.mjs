// 동기화 테스트: GitHub Gist API 를 흉내 내서(두 기기 = 두 브라우저 컨텍스트) 진행 상황이 합쳐지는지 확인
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';

const srv = spawn('node', ['tools/serve.mjs'], { env: { ...process.env, PORT: '8095' }, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const base = 'http://127.0.0.1:8095/';
let fail = 0;
const check = (name, ok, extra = '') => { console.log((ok ? '✓ ' : '✗ ') + name + (ok ? '' : '  ' + extra)); if (!ok) fail++; };
const FILE = 'practice-progress.json';

// 가짜 GitHub
const gists = {};   // id -> { description, content }
let calls = 0;
async function mock(ctx) {
  await ctx.route('https://api.github.com/**', async route => {
    const req = route.request();
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (/Bearer tok-limited/.test(req.headers().authorization || '')) return route.fulfill({ status: 403, headers: { ...cors, 'retry-after': '60' }, body: JSON.stringify({ message: 'You have exceeded a secondary rate limit.' }), contentType: 'application/json' });
    if (!/Bearer tok-good/.test(req.headers().authorization || '')) return route.fulfill({ status: 401, headers: cors, body: '{}', contentType: 'application/json' });
    calls++;
    const u = new URL(req.url());
    const json = (o, status = 200) => route.fulfill({ status, headers: cors, contentType: 'application/json', body: JSON.stringify(o) });
    const m = u.pathname.match(/^\/gists(?:\/(\w+))?$/);
    if (req.method() === 'GET' && !m[1]) return json(Object.entries(gists).map(([id, g]) => ({ id, files: { [FILE]: { filename: FILE } } })));
    if (req.method() === 'POST') { const b = req.postDataJSON(); const id = 'g' + (Object.keys(gists).length + 1); gists[id] = { content: b.files[FILE].content }; return json({ id }, 201); }
    if (req.method() === 'GET') return json({ id: m[1], files: { [FILE]: { content: gists[m[1]].content, truncated: false } } });
    if (req.method() === 'PATCH') { gists[m[1]].content = req.postDataJSON().files[FILE].content; return json({ id: m[1] }); }
    return route.fulfill({ status: 404, headers: cors, body: '{}' });
  });
}

// 기기 A: 이미 풀어 둔 기록이 있는 상태에서 연결
const ctxA = await browser.newContext({ viewport: { width: 1100, height: 800 } });
await mock(ctxA);
const A = await ctxA.newPage();
await A.addInitScript(() => { if (!localStorage.getItem('practice-platform:v1')) localStorage.setItem('practice-platform:v1', JSON.stringify({ solved: { 'py-011': 1000 }, code: { 'py-011': 'print(1)' }, last: { python: 'py-011' } })); });
await A.goto(base);
await A.waitForSelector('#synctoken');
await A.fill('#synctoken', 'tok-bad');
await A.click('#syncgo');
await A.waitForFunction(() => /연결하지 못했어요/.test(document.getElementById('syncmsg')?.textContent || ''));
check('잘못된 토큰은 오류 안내', (await A.innerText('#syncmsg')).includes('토큰'));
await A.fill('#synctoken', 'tok-limited');
await A.click('#syncgo');
await A.waitForFunction(() => /연결하지 못했어요/.test(document.getElementById('syncmsg')?.textContent || ''));
const limitedMsg = await A.innerText('#syncmsg');
check('요청 제한(403)이면 이유와 자동 재시도를 안내', limitedMsg.includes('너무 잦') && limitedMsg.includes('secondary rate limit'), limitedMsg);
await A.fill('#synctoken', 'tok-good');
await A.click('#syncgo');
await A.waitForSelector('#syncnow', { timeout: 15000 });
check('연결되면 "연결됨" 표시', (await A.innerText('#syncbox summary')).includes('연결됨'));
const first = JSON.parse(Object.values(gists)[0].content);
check('기존 기록이 Gist에 올라감 (사라지지 않음)', first.solved['py-011'] === 1000 && first.code['py-011'] === 'print(1)');

// 기기 B: 새 기기에서 같은 토큰으로 연결 → 기록이 내려옴
const ctxB = await browser.newContext({ viewport: { width: 1100, height: 800 } });
await mock(ctxB);
const B = await ctxB.newPage();
await B.goto(base);
await B.waitForSelector('#synctoken');
await B.fill('#synctoken', 'tok-good');
await B.click('#syncgo');
await B.waitForSelector('#syncnow', { timeout: 15000 });
const pyCard = await B.locator('.card', { hasText: '파이썬' }).innerText();
check('기기 B에 기기 A의 풀이 기록이 나타남', /1 \/ \d+ 해결/.test(pyCard), pyCard);
check('Gist는 하나만 (중복 생성 안 함)', Object.keys(gists).length === 1);

// 기기 B 에서 새 문제를 풀면 몇 초 뒤 Gist 로 올라간다
await B.goto(base + '#/p/py-004');
await B.waitForSelector('#code');
const sol = JSON.parse(fs.readFileSync('site/problems/py-004.json', 'utf8')).solution;
await B.fill('#code', sol);
await B.click('#submit');
await B.waitForFunction(() => /status ok/.test(document.getElementById('result').innerHTML), null, { timeout: 120000 });
await B.waitForTimeout(20000);
const second = JSON.parse(Object.values(gists)[0].content);
check('기기 B에서 푼 문제가 자동으로 Gist에 저장됨', !!second.solved['py-004'] && !!second.solved['py-011']);

// 기기 A 로 돌아오면(다시 보이면) 최신 상태로 맞춰진다
await A.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
await A.waitForTimeout(2500);
await A.goto(base);
await A.waitForSelector('.card');
const pyA = await A.locator('.card', { hasText: '파이썬' }).innerText();
check('기기 A에도 기기 B의 풀이가 반영됨', /2 \/ \d+ 해결/.test(pyA), pyA);

// 연결 해제해도 로컬 기록은 남는다
A.on('dialog', d => d.accept());
await A.click('#syncbox summary');
await A.click('#syncoff');
await A.waitForSelector('#synctoken');
const pyA2 = await A.locator('.card', { hasText: '파이썬' }).innerText();
check('연결 해제 후에도 로컬 기록 유지', /2 \/ \d+ 해결/.test(pyA2), pyA2);

await browser.close(); srv.kill();
console.log(fail ? `\n실패 ${fail}개` : '\n동기화 테스트 모두 통과');
process.exit(fail ? 1 : 0);
