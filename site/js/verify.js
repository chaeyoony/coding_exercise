// 문제 원본(problems_src)을 실제 엔진으로 실행해 검증하고, 배포용 문제 파일을 만든다.
import { compareTables, sameValue, normOut, checkCode } from './compare.js';
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
  delete pub.verify;


  if (p.quiz) {
    // OX·객관식: 정답 번호는 문제의 코드를 실제로 실행해서 정한다 (직접 적은 정답을 믿지 않는다)
    const v = p.verify || {};
    const run = code => eng.runScript({ ...base, code, prelude: '' });
    let match = [];
    if (v.claim) {
      const r = await run(v.claim);
      const out = r.ok ? normOut(r.stdout) : '';
      if (out !== 'True' && out !== 'False') return { pub, errors: ['claim 코드가 True/False를 출력하지 않아요: ' + (r.error || out)] };
      match = [out === 'True', out === 'False'];
    } else if (v.outs) {
      const r = await run(v.code ?? p.code);
      match = v.outs.map(o => (o === null ? !r.ok : r.ok && normOut(String(o)) === normOut(r.stdout)));
      if (!match.some(Boolean)) problems.push('실행 결과와 일치하는 보기가 없어요: ' + (r.ok ? JSON.stringify(r.stdout) : '오류 ' + r.error));
    } else if (v.codes) {
      for (const c of v.codes) {
        const r = await run(c);
        match.push(v.expect === 'error' ? !r.ok : v.expect === 'ok' ? r.ok : r.ok && normOut(r.stdout) === normOut(v.expect));
      }
    } else if (typeof v.manual === 'number') {
      match = p.choices.map((_, i) => i === v.manual);
    } else return { pub, errors: ['verify 설정이 없어요'] };
    if (match.length !== p.choices.length) problems.push(`보기 개수(${p.choices.length})와 검증 결과(${match.length})가 달라요`);
    if (match.filter(Boolean).length !== 1) problems.push(`정답이 정확히 1개여야 해요: ${JSON.stringify(match)}`);
    // 정답이 늘 같은 번호에 몰리지 않도록 보기 순서를 문제마다 고정된 방식으로 섞는다 (OX는 그대로)
    let choices = p.choices, answer = match.indexOf(true);
    if (!(p.choices.length === 2 && p.choices[0] === '참')) {
      let seed = 0;
      for (const ch of p.id) seed = (seed * 131 + ch.charCodeAt(0)) >>> 0;
      const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
      const order = p.choices.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      choices = order.map(i => p.choices[i]);
      answer = order.indexOf(answer);
      pub.choices = choices;
    }
    pub.quiz = { choices, answer };
    if (!p.explain) problems.push('해설(explain)이 없어요');
    return { pub, errors: problems };
  }

  if (p.predict) {
    const r = await eng.runScript({ ...base, code: p.code, prelude: '' });
    if (!r.ok) return { pub, errors: ['예측 문제의 코드가 오류를 내요: ' + r.error] };
    pub.expected = normOut(r.stdout);
    if (!pub.expected) problems.push('예측 문제의 출력이 비어 있어요');
    if (!p.solution) problems.push('해설(explain)이 없어요');
    return { pub, errors: problems };
  }

  if (p.cases) {
    const bad = checkCode(p.solution, p.needs, p.forbids);
    if (bad) return { pub, errors: ['정답 코드가 조건을 어겨요: ' + bad] };
    pub.cases = [];
    for (const [i, c] of p.cases.entries()) {
      const r = await eng.runScript({ ...base, code: p.solution, prelude: c.pre });
      if (!r.ok) { problems.push(`케이스 ${i + 1} 정답 코드 오류: ${r.error}`); continue; }
      const expected = normOut(r.stdout);
      if (!expected) problems.push(`케이스 ${i + 1}: 정답 출력이 비어 있어요`);
      pub.cases.push({ pre: c.pre || '', expected, visible: i === 0 || (i === 1 && p.cases.length >= 3) });
    }
    if (p.cases.length < 2 && !p.singleCase) problems.push('케이스가 2개 미만이에요 (고정 출력 문제면 singleCase: true)');
    return { pub, errors: problems };
  }

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
