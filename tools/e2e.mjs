// 화면 동작 테스트: 각 트랙에서 정답/오답을 실제로 입력해 제출해 본다.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';

const shotDir = process.argv[2] || '/tmp';
const srv = spawn('node', ['tools/serve.mjs'], { env: { ...process.env, PORT: '8099' }, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1180, height: 820 } });
page.on('pageerror', e => console.log('PAGE ERROR', e.message));
const base = 'http://127.0.0.1:8099/#/';
let fail = 0;
const check = (name, ok, extra = '') => { console.log((ok ? '✓ ' : '✗ ') + name + (ok ? '' : '  ' + extra)); if (!ok) fail++; };

async function attempt(id, code, btn) {
  await page.goto(base + 'p/' + id);
  await page.waitForSelector('#code');
  await page.fill('#code', code);
  await page.click(btn);
  await page.waitForFunction(() => /status (ok|bad)/.test(document.getElementById('result').innerHTML), null, { timeout: 120000 });
  return page.innerText('#result');
}
const sol = id => JSON.parse(fs.readFileSync(`site/problems/${id}.json`, 'utf8')).solution;

for (const id of ['sql-007', 'py-011', 'ds-006', 'ds-203', 'r-106', 'r-008', 'r-215', 'r-226', 'r-224', 'py-092', 'ds-453', 'r-310']) {
  const txt = await attempt(id, sol(id), '#submit');
  check(`${id} 정답 제출 → 통과`, txt.includes('통과'), txt.slice(0, 200));
}
let txt = await attempt('sql-007', 'SELECT customer_id, SUM(quantity) AS total FROM orders GROUP BY 1 ORDER BY 2 DESC LIMIT 3', '#submit');
check('sql-007 오답 → 틀렸어요', txt.includes('틀렸어요'), txt.slice(0, 200));
txt = await attempt('sql-007', 'SELEC oops', '#submit');
check('sql-007 문법 오류 → 오류 안내', txt.includes('SQL 오류'), txt.slice(0, 200));
txt = await attempt('py-004', 'def sum_to_n(n):\n    while True:\n        pass\n', '#submit');
check('py-004 무한 반복 → 시간 초과 안내', txt.includes('오래 걸려요'), txt.slice(0, 200));
txt = await attempt('py-004', sol('py-004'), '#submit');
check('무한 반복 뒤 엔진 복구 → 통과', txt.includes('통과'), txt.slice(0, 200));
txt = await attempt('py-001', 'def add(a, b):\n    return a +\n', '#run');
check('py-001 문법 오류 안내', txt.includes('문법 오류'), txt.slice(0, 200));
txt = await attempt('r-001', 'add <- function(a, b) {\n  a + \n', '#run');
check('r-001 문법 오류 안내', /오류/.test(txt), txt.slice(0, 200));
txt = await attempt('r-003', 'sum_to_n <- function(n) {\n  total <- 0\n  for (i in 1:n) total <- total + i\n  total\n}\n', '#submit');
check('r-003 1:n 함정 → 숨겨진 테스트 실패', txt.includes('숨겨진 테스트') && txt.includes('실패'), txt.slice(0, 300));

// 진행 상황 저장 확인
await page.goto(base + 't/sql');
await page.waitForSelector('.plist');
check('목록에 해결 표시(✓)', (await page.locator('.chk', { hasText: '✓' }).count()) >= 1);

// 스크린샷 (PC / 아이패드 세로)
await page.goto(base);
await page.screenshot({ path: shotDir + '/home.png' });
await page.goto(base + 'p/ds-006'); await page.waitForSelector('#code');
await page.click('#submit'); await page.waitForSelector('.status');
await page.screenshot({ path: shotDir + '/problem.png', fullPage: true });
await page.setViewportSize({ width: 820, height: 1180 });
await page.goto(base + 'p/py-008'); await page.waitForSelector('#code');
await page.screenshot({ path: shotDir + '/ipad.png', fullPage: true });
await page.goto(base + 't/ds');
await page.screenshot({ path: shotDir + '/track.png', fullPage: true });

await browser.close(); srv.kill();
console.log(fail ? `\n실패 ${fail}건` : '\n화면 테스트 모두 통과');
process.exit(fail ? 1 : 0);
