// 반복 실행 검사: 같은 엔진(브라우저 세션)에서 정답 코드를 여러 번, 순서를 바꿔 가며 실행해도 항상 같은 결과가 나오는지 본다.
// (고정 파일 이름에 이어 쓰기, 전역 상태 누적 같은 "두 번째 실행부터 틀리는" 문제를 찾는다)
import { compareTables, sameValue, normOut } from '../site/js/compare.js';
import { sqlEngine } from '../site/js/engines/sql.js';
import { pyEngine } from '../site/js/engines/py.js';
import { rEngine } from '../site/js/engines/r.js';
const ENGINES = { sql: sqlEngine, py: pyEngine, r: rEngine };
const TRACK_ENGINE = { sql: 'sql', python: 'py', ds: 'py', r: 'r' };
const q = new URLSearchParams(location.search);
const order = (q.get('order') || 'fwd,rev,fwd').split(',');
const only = q.get('only');
const j = async u => (await fetch(u)).json();
const csv = {};
const dataOf = async p => { const d = {}; for (const n of p.datasets || []) d[n] = csv[n] ??= await (await fetch(`../site/datasets/${n}.csv`)).text(); return d; };

async function check(p) {
  const eng = ENGINES[TRACK_ENGINE[p.track]];
  await eng.ensure();
  const base = { datasets: await dataOf(p), packages: p.packages || [], setup: p.setup || '' };
  const msgs = [];
  if (p.quiz || p.predict) return msgs;
  if (p.tests) {
    const res = await eng.runTests({ ...base, code: p.solution, calls: p.tests.map(t => t.call) });
    if (!res.ok) return ['오류: ' + res.error];
    p.tests.forEach((t, i) => { const r = res.results[i]; if (!r.ok) msgs.push(`테스트 ${i + 1} 오류: ${r.error}`); else if (!sameValue(r.value, t.expected)) msgs.push(`테스트 ${i + 1} ${t.call.slice(0, 70)} → ${JSON.stringify(r.value).slice(0, 80)} (기대 ${JSON.stringify(t.expected).slice(0, 60)})`); });
  } else if (p.cases) {
    for (const [i, c] of p.cases.entries()) {
      const r = await eng.runScript({ ...base, code: p.solution, prelude: c.pre });
      if (!r.ok) msgs.push(`케이스 ${i + 1} 오류: ${r.error}`);
      else if (normOut(r.stdout) !== normOut(c.expected)) msgs.push(`케이스 ${i + 1} 출력이 달라요: ${JSON.stringify(normOut(r.stdout)).slice(0, 80)} (기대 ${JSON.stringify(c.expected).slice(0, 60)})`);
    }
  } else if (p.expected && p.expected.rows) {
    const res = await eng.runTable({ ...base, code: p.solution });
    if (!res.ok) return ['오류: ' + res.error];
    const c = compareTables(p.expected, res.table, !!p.ordered);
    if (!c.ok) msgs.push('표 결과가 달라요: ' + c.msg);
  }
  return msgs;
}

(async () => {
  const idx = (await j('../site/problems/index.json')).problems;
  let ids = idx.map(x => x.id).filter(id => !only || only.split(',').includes(id));
  const probs = {};
  for (const id of ids) probs[id] = await j(`../site/problems/${id}.json`);
  const bad = {};
  for (const [round, o] of order.entries()) {
    const seq = o === 'rev' ? [...ids].reverse() : o === 'shuf' ? [...ids].sort((a, b) => (a.length * 7 + a.charCodeAt(a.length - 1) * 31) % 97 - (b.length * 7 + b.charCodeAt(b.length - 1) * 31) % 97) : ids;
    for (const id of seq) {
      let m;
      try { m = await check(probs[id]); } catch (e) { m = ['예외: ' + (e.message || e)]; }
      if (m.length) { (bad[id] ??= []).push(`[${round + 1}회차 ${o}] ` + m.join(' / ')); console.log('✗', id, probs[id].title, '|', m[0]); }
    }
    console.log('== 회차', round + 1, o, '끝');
  }
  window.__done = bad;
})();
