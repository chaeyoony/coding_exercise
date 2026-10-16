import { TRACKS } from './tracks.js';
import { store } from './store.js';
import { compareTables, sameValue } from './compare.js';
import { parseCsv, inferTypes } from './csv.js';

const $app = document.getElementById('app');
const $nav = document.getElementById('nav');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stars = n => '★'.repeat(n) + '☆'.repeat(Math.max(0, 4 - n));

const engineLoaders = {
  sql: () => import('./engines/sql.js').then(m => m.sqlEngine),
  python: () => import('./engines/py.js').then(m => m.pyEngine),
  ds: () => import('./engines/py.js').then(m => m.pyEngine),
  r: () => import('./engines/r.js').then(m => m.rEngine),
};
const engines = {};
const getEngine = async track => (engines[track] ??= await engineLoaders[track]());

const csvCache = {};
const loadCsv = async name => (csvCache[name] ??= await (await fetch(`datasets/${name}.csv`)).text());
const problemCache = {};
const loadProblem = async id => (problemCache[id] ??= await (await fetch(`problems/${id}.json`)).json());

let INDEX = [];

function renderNav(active) {
  $nav.innerHTML = TRACKS.map(t => `<a href="#/t/${t.id}" class="${t.id === active ? 'on' : ''}">${t.icon} ${esc(t.name)}</a>`).join('');
}

function tableHtml(t, max = 100, nullLabel = 'NULL') {
  const head = t.columns.map(c => `<th>${esc(c)}</th>`).join('');
  const body = t.rows.slice(0, max).map(r => '<tr>' + r.map(v => v === null || v === undefined
    ? `<td class="null">${nullLabel}</td>`
    : `<td>${esc(typeof v === 'object' ? JSON.stringify(v) : v)}</td>`).join('') + '</tr>').join('');
  const more = t.rows.length > max ? `<div class="muted">… 외 ${t.rows.length - max}행</div>` : '';
  return `<div class="scroll"><table class="t"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>${more}`;
}

// ---------- 홈 ----------
function progress(trackId) {
  const list = INDEX.filter(p => p.track === trackId);
  return { done: list.filter(p => store.isSolved(p.id)).length, total: list.length };
}

function renderHome() {
  renderNav('');
  $app.innerHTML = `
    <h1>코딩 연습장</h1>
    <p class="muted">SQL · 파이썬 · 데이터사이언스 · R. 코드는 이 브라우저 안에서 실행돼요. PC와 아이패드 모두 사용할 수 있어요.</p>
    <div class="cards">${TRACKS.map(t => {
      const { done, total } = progress(t.id);
      return `<a class="card" href="#/t/${t.id}"><div class="ico">${t.icon}</div><h3>${esc(t.name)}</h3>
        <div class="muted">${esc(t.desc)}</div>
        <div class="bar"><i style="width:${total ? (100 * done / total) : 0}%"></i></div>
        <div class="muted" style="font-size:.85rem;margin-top:4px">${done} / ${total} 해결</div></a>`;
    }).join('')}</div>
    <div class="tools">
      <button id="exp">진행 상황 내보내기</button>
      <button id="imp">진행 상황 가져오기</button>
      <input type="file" id="impf" accept="application/json" hidden>
    </div>
    <p class="muted" style="font-size:.85rem">진행 상황은 이 기기의 브라우저에 저장돼요. 다른 기기에서 이어가려면 내보내기 → 가져오기를 사용하세요.</p>`;
  document.getElementById('exp').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([store.exportJson()], { type: 'application/json' }));
    a.download = 'practice-progress.json';
    a.click();
  };
  const f = document.getElementById('impf');
  document.getElementById('imp').onclick = () => f.click();
  f.onchange = async () => {
    try { store.importJson(await f.files[0].text()); alert('가져왔어요!'); renderHome(); }
    catch (e) { alert('파일을 읽지 못했어요.'); }
  };
}

// ---------- 트랙 목록 ----------
const view = { level: 0, unsolved: false };   // 목록 필터 (페이지를 옮겨도 유지)

function renderTrack(id) {
  const t = TRACKS.find(x => x.id === id);
  if (!t) return renderHome();
  renderNav(id);
  const { done, total } = progress(id);
  const keep = p => (!view.level || p.level === view.level) && (!view.unsolved || !store.isSolved(p.id));
  const sections = t.categories.map(cat => {
    const all = INDEX.filter(p => p.track === id && p.category === cat);
    if (!all.length) return '';
    const list = all.filter(keep);
    if (!list.length) return '';
    const d = all.filter(p => store.isSolved(p.id)).length;
    return `<details class="cat" open><summary><b>${esc(cat)}</b> <span class="muted">${d} / ${all.length}</span></summary>
      <ul class="plist">${list.map(p => `
      <li><a href="#/p/${p.id}"><span class="chk">${store.isSolved(p.id) ? '✓' : ''}</span>
      <span>${esc(p.title)}</span><span class="lv" title="난이도">${stars(p.level)}</span></a></li>`).join('')}</ul></details>`;
  }).join('');
  const chip = (lv, label) => `<button class="chip ${view.level === lv ? 'on' : ''}" data-lv="${lv}">${label}</button>`;
  $app.innerHTML = `<h1>${t.icon} ${esc(t.name)}</h1>
    <p class="muted">${esc(t.desc)} · ${done} / ${total} 해결 · 실행 환경: ${esc(t.lang)}</p>
    <div class="filters">${chip(0, '전체')}${[1, 2, 3, 4].map(n => chip(n, stars(n).replace(/☆/g, ''))).join('')}
      <button class="chip ${view.unsolved ? 'on' : ''}" id="unsolved">안 푼 문제만</button></div>
    ${sections || '<p class="muted">조건에 맞는 문제가 없어요.</p>'}`;
  $app.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => { view.level = Number(b.dataset.lv); renderTrack(id); });
  document.getElementById('unsolved').onclick = () => { view.unsolved = !view.unsolved; renderTrack(id); };
}

// ---------- 문제 ----------
async function datasetPanel(p) {
  if (!p.datasets?.length) return '';
  const parts = [];
  for (const name of p.datasets) {
    const csv = parseCsv(await loadCsv(name));
    const types = inferTypes(csv);
    const cols = csv.header.map((h, i) => `<code>${esc(h)}</code>${p.track === 'sql' ? ` <span class="muted">${types[i]}</span>` : ''}`).join(', ');
    parts.push(`<details><summary><b>${esc(name)}</b> 테이블/데이터</summary>
      <div class="muted" style="margin:6px 0">${cols}</div>
      ${tableHtml({ columns: csv.header, rows: csv.rows.slice(0, 5).map(r => r.map(v => v === '' ? null : (/^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v))) })}
      <div class="muted" style="font-size:.85rem">전체 ${csv.rows.length}행 중 5행만 보여요</div></details>`);
  }
  return `<h2>데이터</h2>${parts.join('')}`;
}

function expectedPanel(p) {
  if (p.tests || !p.expected) return '';
  return `<details><summary>예상 결과 보기 (${p.expected.rows.length}행)</summary>
    ${tableHtml(p.expected, 10)}
    <div class="muted" style="font-size:.85rem">열 이름은 달라도 괜찮아요. 값과 ${p.ordered ? '순서' : '행 내용'}만 비교해요.</div></details>`;
}

function testsHtml(p) {
  if (!p.tests) return '';
  const vis = p.tests.filter(t => t.visible);
  return `<h2>예제</h2><ul class="tests">${vis.map(t => `<li><code>${esc(t.call)}</code> → <code>${esc(JSON.stringify(t.expected))}</code></li>`).join('')}</ul>`;
}

async function renderProblem(id) {
  const meta = INDEX.find(p => p.id === id);
  if (!meta) { location.hash = '#/'; return; }
  renderNav(meta.track);
  $app.innerHTML = '<p class="muted">불러오는 중…</p>';
  const p = await loadProblem(id);
  const track = TRACKS.find(t => t.id === p.track);
  const list = INDEX.filter(x => x.track === p.track);
  const pos = list.findIndex(x => x.id === id);
  const prev = list[pos - 1], next = list[pos + 1];
  const initial = store.getCode(id) ?? p.starter;
  const dsHtml = await datasetPanel(p);

  $app.innerHTML = `
    <div class="muted" style="font-size:.9rem"><a href="#/t/${p.track}">${track.icon} ${esc(track.name)}</a> › ${esc(p.category)}</div>
    <h1>${esc(p.title)} ${store.isSolved(id) ? '<span class="badge" style="background:var(--ok-soft);color:var(--ok)">해결함 ✓</span>' : ''}</h1>
    <div class="pgrid">
      <section class="panel desc">
        <span class="badge">난이도 ${stars(p.level)}</span><span class="badge">${esc(p.category)}</span>
        ${p.desc}
        ${testsHtml(p)}
        ${dsHtml}
        ${expectedPanel(p)}
        <details id="hintbox" ${''}><summary>힌트 보기</summary><div class="desc">${p.hint || '준비된 힌트가 없어요.'}</div></details>
      </section>
      <section class="panel">
        <textarea id="code" class="code" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off"></textarea>
        <div class="actions">
          <button id="run">▶ 실행</button>
          <button id="submit" class="primary">제출</button>
          <button id="reset">처음 코드로</button>
          <button id="sol">정답 보기</button>
        </div>
        <div id="result"></div>
        <div id="solbox"></div>
      </section>
    </div>
    <div class="pn"><span>${prev ? `<a href="#/p/${prev.id}">← ${esc(prev.title)}</a>` : ''}</span><span>${next ? `<a href="#/p/${next.id}">${esc(next.title)} →</a>` : ''}</span></div>`;

  const $code = document.getElementById('code');
  const $res = document.getElementById('result');
  $code.value = initial;
  const isPy = p.track === 'python' || p.track === 'ds';
  let t;
  $code.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => store.setCode(id, $code.value), 300); });
  $code.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = $code.selectionStart;
      $code.setRangeText('    ', s, $code.selectionEnd, 'end');
      $code.dispatchEvent(new Event('input'));
    } else if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      const s = $code.selectionStart;
      const line = $code.value.slice(0, s).split('\n').pop();
      let indent = line.match(/^\s*/)[0];
      if (isPy && /:\s*$/.test(line)) indent += '    ';
      if (indent) { e.preventDefault(); $code.setRangeText('\n' + indent, s, $code.selectionEnd, 'end'); $code.dispatchEvent(new Event('input')); }
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault(); go(false);
    }
  });

  const setStatus = msg => { $res.innerHTML = `<div class="status info">${esc(msg)}</div>`; };
  const btns = ['run', 'submit'].map(i => document.getElementById(i));
  async function go(submit) {
    btns.forEach(b => b.disabled = true);
    try {
      store.setCode(id, $code.value);
      const eng = await getEngine(p.track);
      await eng.ensure(setStatus);
      await judge(p, eng, $code.value, submit, $res, setStatus);
    } catch (e) {
      $res.innerHTML = `<div class="status bad">엔진을 불러오지 못했어요: ${esc(e.message || e)}</div>`;
    }
    btns.forEach(b => b.disabled = false);
  }
  document.getElementById('run').onclick = () => go(false);
  document.getElementById('submit').onclick = () => go(true);
  document.getElementById('reset').onclick = () => { if (confirm('작성한 코드를 지우고 처음 코드로 되돌릴까요?')) { $code.value = p.starter; store.setCode(id, p.starter); } };
  document.getElementById('sol').onclick = () => {
    if (!confirm('정답을 보면 스스로 풀 기회가 줄어요. 그래도 볼까요?')) return;
    document.getElementById('solbox').innerHTML = `<h2>정답 예시</h2><pre class="out">${esc(p.solution)}</pre>`;
  };
}

async function judge(p, eng, code, submit, $res, setStatus) {
  const datasets = {};
  for (const n of p.datasets || []) datasets[n] = await loadCsv(n);
  const base = { code, datasets, packages: p.packages || [], setup: p.setup || '' };

  if (p.tests) {
    const tests = submit ? p.tests : p.tests.filter(t => t.visible);
    const res = await eng.runTests({ ...base, calls: tests.map(t => t.call) }, setStatus);
    const out = res.stdout ? `<div class="out">${esc(res.stdout)}</div>` : '';
    if (!res.ok) { $res.innerHTML = `<div class="status bad">오류가 났어요\n${esc(res.error)}</div>${out}`; return; }
    let pass = 0;
    const items = tests.map((t, i) => {
      const r = res.results[i];
      const ok = r.ok && sameValue(r.value, t.expected);
      if (ok) pass++;
      const hidden = !t.visible;
      let body;
      if (hidden && !ok) body = `숨겨진 테스트 ${i + 1}: 실패`;
      else if (hidden) body = `숨겨진 테스트 ${i + 1}: 통과`;
      else body = `<code>${esc(t.call)}</code><br>기대: <code>${esc(JSON.stringify(t.expected))}</code><br>` +
        (r.ok ? `내 결과: <code>${esc(JSON.stringify(r.value))}</code>` : `오류: <code>${esc(r.error)}</code>`) +
        (r.stdout ? `<br>출력: <code>${esc(r.stdout)}</code>` : '');
      return `<li class="${ok ? 'ok' : 'bad'}">${ok ? '✓ ' : '✗ '}${body}</li>`;
    }).join('');
    const all = pass === tests.length;
    if (submit && all) store.markSolved(p.id);
    const head = submit
      ? (all ? `🎉 통과! 모든 테스트(${tests.length}개)를 맞혔어요.` : `테스트 ${tests.length}개 중 ${pass}개 통과`)
      : `예제 ${tests.length}개 중 ${pass}개 통과 (제출하면 숨겨진 테스트까지 확인해요)`;
    $res.innerHTML = `<div class="status ${all ? 'ok' : 'bad'}">${head}</div><ul class="tests">${items}</ul>${out}`;
    return;
  }

  const res = await eng.runTable(base, setStatus);
  const out = res.stdout ? `<div class="out">${esc(res.stdout)}</div>` : '';
  if (!res.ok) { $res.innerHTML = `<div class="status bad">오류가 났어요\n${esc(res.error)}</div>${out}`; return; }
  const cmp = compareTables(res.table, p.expected, p.ordered);
  if (submit && cmp.ok) store.markSolved(p.id);
  const head = cmp.ok
    ? (submit ? '🎉 통과! 예상 결과와 같아요.' : '예상 결과와 같아요. 제출해 보세요!')
    : (submit ? '틀렸어요: ' : '아직 달라요: ') + cmp.msg;
  $res.innerHTML = `<div class="status ${cmp.ok ? 'ok' : 'bad'}">${esc(head)}</div>
    <h2>내 결과</h2>${tableHtml(res.table)}${out}`;
}

// ---------- 라우터 ----------
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [kind, arg] = h.split('/');
  window.scrollTo(0, 0);
  if (kind === 't') renderTrack(arg);
  else if (kind === 'p') renderProblem(arg);
  else renderHome();
}

(async () => {
  try {
    INDEX = (await (await fetch('problems/index.json')).json()).problems;
  } catch (e) {
    $app.innerHTML = '<p>문제 목록을 불러오지 못했어요. <code>npm run build</code> 로 문제를 먼저 만들어 주세요.</p>';
    return;
  }
  addEventListener('hashchange', route);
  route();
})();
