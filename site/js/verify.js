// 문제 원본(problems_src)을 실제 엔진으로 실행해 검증하고, 배포용 문제 파일을 만든다.
import { compareTables, sameValue } from './compare.js';
import { sqlEngine } from './engines/sql.js';
import { pyEngine } from './engines/py.js';
import { rEngine } from './engines/r.js';

const ENGINES = { sql: sqlEngine, py: pyEngine, r: rEngine };
const TRACK_ENGINE = { sql: 'sql', python: 'py', ds: 'py', r: 'r' };
const only = new URLSearchParams(location.search).get('only');
const log = (...a) => console.log(...a);
const csvCache = {};
const loadCsv = async n => (csvCache[n] ??= await (await fetch(`datasets/${n}.csv`)).text());

async function datasetsOf(p) {
  const d = {};
  for (const n of p.datasets || []) d[n] = await loadCsv(n);
  return d;
}

async function verifyOne(p) {
  const problems = [];
  const datasets = await datasetsOf(p);
  const eng = ENGINES[TRACK_ENGINE[p.track]];
  await eng.ensure();
  const base = { datasets, packages: p.packages || [], setup: p.setup || '' };
  const pub = { ...p };
  delete pub.cross;

  if (p.tests) {
    const res = await eng.runTests({ ...base, code: p.solution, calls: p.tests.map(t => t.call) });
    if (!res.ok) return { pub, errors: ['정답 코드 오류: ' + res.error] };
    p.tests.forEach((t, i) => {
      const r = res.results[i];
      if (!r.ok) problems.push(`테스트 ${i + 1} 오류: ${r.error}`);
      else if (!sameValue(r.value, t.expected)) problems.push(`테스트 ${i + 1} 불일치: ${t.call} → 정답코드 ${JSON.stringify(r.value)} / 기대값 ${JSON.stringify(t.expected)}`);
    });
    if (p.tests.filter(t => t.visible).length < 1) problems.push('공개 예제(visible)가 1개 이상 필요해요');
    if (p.tests.length < 4) problems.push('테스트가 4개 미만이에요');
    return { pub, errors: problems };
  }

  const res = await eng.runTable({ ...base, code: p.solution });
  if (!res.ok) return { pub, errors: ['정답 코드 오류: ' + res.error] };
  pub.expected = res.table;
  if (!res.table.rows.length) problems.push('정답 결과가 0행이에요');
  if (!p.cross) problems.push('교차검증 코드(cross)가 없어요');
  else {
    const ce = ENGINES[p.cross.lang];
    await ce.ensure();
    const cr = await ce.runTable({ ...base, datasets: await datasetsOf({ datasets: p.cross.datasets || p.datasets }), code: p.cross.code });
    if (!cr.ok) problems.push('교차검증 코드 오류: ' + cr.error);
    else {
      const c = compareTables(cr.table, res.table, !!p.ordered);
      if (!c.ok) problems.push('교차검증 불일치: ' + c.msg + ' / 정답 ' + JSON.stringify(res.table.rows.slice(0, 3)) + ' / 교차 ' + JSON.stringify(cr.table.rows.slice(0, 3)));
    }
  }
  return { pub, errors: problems.filter(m => !(m.startsWith('교차검증 코드(cross)가 없어요') && false)) };
}

(async () => {
  const all = (await import('../../problems_src/index.mjs')).default;
  const ids = new Set();
  const out = [];
  for (const p of all) {
    if (ids.has(p.id)) { out.push({ id: p.id, errors: ['id 중복'] }); continue; }
    ids.add(p.id);
    if (only && !only.split(',').includes(p.id)) continue;
    let r;
    try { r = await verifyOne(p); } catch (e) { r = { pub: p, errors: ['검증 중 예외: ' + (e.message || e)] }; }
    log(r.errors.length ? `✗ ${p.id}  ${p.title}` : `✓ ${p.id}  ${p.title}`);
    r.errors.forEach(m => log('    - ' + m));
    out.push({ id: p.id, errors: r.errors, pub: r.pub });
  }
  window.__done = out;
})();
