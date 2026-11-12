import { TRACKS } from './tracks.js';
import { store } from './store.js';
import { NOTES, notesFor } from './notes.js';
import { compareTables, sameValue, normOut, checkCode } from './compare.js';
import { parseCsv, inferTypes } from './csv.js';

const $app = document.getElementById('app');
const $nav = document.getElementById('nav');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stars = n => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n));

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
  $nav.innerHTML = TRACKS.map(t => `<a href="#/t/${t.id}" class="${t.id === active ? 'on' : ''}">${t.icon} ${esc(t.name)}</a>`).join('') + `<a href="#/n" class="${active === 'notes' ? 'on' : ''}">📒 기초 노트</a>`;
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

// 이어하기: 풀던 문제(안 풀었으면 그 문제, 풀었으면 그다음 안 푼 문제)로
function continueTarget(trackId) {
  const list = INDEX.filter(p => p.track === trackId);
  if (!list.length) return null;
  const last = store.getLast(trackId);
  const i = last ? list.findIndex(p => p.id === last) : -1;
  if (i >= 0) {
    if (!store.isSolved(list[i].id)) return { p: list[i], label: '이어서 풀기' };
    const nxt = list.slice(i + 1).find(p => !store.isSolved(p.id)) || list[i + 1] || list.find(p => !store.isSolved(p.id));
    if (nxt) return { p: nxt, label: '다음 문제' };
    return { p: list[i], label: '다시 보기' };
  }
  const first = list.find(p => !store.isSolved(p.id));
  return first ? { p: first, label: '시작하기' } : { p: list[0], label: '처음부터 다시' };
}

function renderHome() {
  renderNav('');
  $app.innerHTML = `
    <h1>코딩 연습장</h1>
    <p class="muted">SQL · 파이썬 · 데이터사이언스 · R. 코드는 이 브라우저 안에서 실행돼요. PC와 아이패드 모두 사용할 수 있어요.</p>
    <div class="cards">${TRACKS.map(t => {
      const { done, total } = progress(t.id);
      const c = continueTarget(t.id);
      return `<div class="card"><a class="cardlink" href="#/t/${t.id}"><div class="ico">${t.icon}</div><h3>${esc(t.name)}</h3>
        <div class="muted">${esc(t.desc)}</div>
        <div class="bar"><i style="width:${total ? (100 * done / total) : 0}%"></i></div>
        <div class="muted" style="font-size:.85rem;margin-top:4px">${done} / ${total} 해결</div></a>
        ${c ? `<a class="play" href="#/p/${c.p.id}" title="${esc(c.p.title)}">▶ ${c.label}<span class="ptitle">${esc(c.p.title)}</span></a>` : ''}</div>`;
    }).join('')}</div>
    <p><a class="notehome" href="#/n">📒 기초 노트 모음 — 막힐 때 펼쳐 보는 코드 정리 (${NOTES.length}개)</a></p>
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
const view = { level: 0, unsolved: false, mode: (() => { try { return localStorage.getItem('pp:mode') || 'cat'; } catch (e) { return 'cat'; } })() };   // 목록 필터 (페이지를 옮겨도 유지)

function renderTrack(id) {
  const t = TRACKS.find(x => x.id === id);
  if (!t) return renderHome();
  renderNav(id);
  const { done, total } = progress(id);
  const keep = p => (!view.level || p.level === view.level) && (!view.unsolved || !store.isSolved(p.id));
  const row = (p, showCat) => `
      <li><a href="#/p/${p.id}"><span class="chk">${store.isSolved(p.id) ? '✓' : ''}</span>
      <span>${esc(p.title)}${showCat ? ` <span class="muted catsmall">${esc(p.category)}</span>` : ''}</span><span class="lv" title="난이도">${stars(p.level)}</span></a></li>`;
  let sections;
  if (view.mode === 'level') {
    const rank = Object.fromEntries(t.categories.map((c, i) => [c, i]));
    sections = [1, 2, 3, 4, 5].map(lv => {
      const all = INDEX.filter(p => p.track === id && p.level === lv).sort((a, b) => (rank[a.category] ?? 99) - (rank[b.category] ?? 99));
      const list = all.filter(keep);
      if (!list.length) return '';
      const d = all.filter(p => store.isSolved(p.id)).length;
      return `<details class="cat" ${lv <= 2 ? 'open' : ''}><summary><b>난이도 ${stars(lv)}</b> <span class="muted">${d} / ${all.length}</span></summary>
      <ul class="plist">${list.map(p => row(p, true)).join('')}</ul></details>`;
    }).join('');
  } else {
    sections = t.categories.map(cat => {
      const all = INDEX.filter(p => p.track === id && p.category === cat);
      if (!all.length) return '';
      const list = all.filter(keep);
      if (!list.length) return '';
      const d = all.filter(p => store.isSolved(p.id)).length;
      return `<details class="cat" open><summary><b>${esc(cat)}</b> <span class="muted">${d} / ${all.length}</span></summary>
      <ul class="plist">${list.map(p => row(p, false)).join('')}</ul></details>`;
    }).join('');
  }
  const chip = (lv, label) => `<button class="chip ${view.level === lv ? 'on' : ''}" data-lv="${lv}">${label}</button>`;
  $app.innerHTML = `<h1>${t.icon} ${esc(t.name)}</h1>
    <p class="muted">${esc(t.desc)} · ${done} / ${total} 해결 · 실행 환경: ${esc(t.lang)}</p>
    <div class="filters"><button class="chip ${view.mode === 'cat' ? 'on' : ''}" data-mode="cat">📚 단원별</button><button class="chip ${view.mode === 'level' ? 'on' : ''}" data-mode="level">📶 난이도순</button>
      <span class="sep"></span>${chip(0, '전체')}${[1, 2, 3, 4, 5].map(n => chip(n, stars(n).replace(/☆/g, ''))).join('')}
      <button class="chip ${view.unsolved ? 'on' : ''}" id="unsolved">안 푼 문제만</button></div>
    ${sections || '<p class="muted">조건에 맞는 문제가 없어요.</p>'}`;
  $app.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { view.mode = b.dataset.mode; try { localStorage.setItem('pp:mode', view.mode); } catch (e) { /* ignore */ } renderTrack(id); });
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

function predictPanel(p) {
  if (!p.predict) return '';
  return `<h2>코드</h2><pre class="out code-view">${esc(p.code)}</pre>`;
}

function casesPanel(p) {
  if (!p.cases) return '';
  const vis = p.cases.filter(c => c.visible);
  const first = vis[0] || p.cases[0];
  const given = first.pre ? `<h2>미리 주어진 코드</h2><pre class="out">${esc(first.pre)}</pre>
    <div class="muted" style="font-size:.85rem">이 코드는 자동으로 먼저 실행돼요. 채점할 때는 값이 달라질 수 있어요.</div>` : '';
  return `${given}<h2>예상 출력</h2><pre class="out">${esc(first.expected) || '(출력 없음)'}</pre>`;
}

function testsHtml(p) {
  if (!p.tests) return '';
  const vis = p.tests.filter(t => t.visible);
  return `<h2>예제</h2><ul class="tests">${vis.map(t => `<li><code>${esc(t.call)}</code> → <code>${esc(JSON.stringify(t.expected))}</code></li>`).join('')}</ul>`;
}

let nextTimer = null;
function clearNext() { if (nextTimer) { clearInterval(nextTimer); nextTimer = null; } }

// 정답을 맞히면 5초 뒤 다음 문제로 자동 이동 (취소 가능)
function offerNext(next, $res) {
  clearNext();
  const bar = document.createElement('div');
  bar.className = 'nextbar';
  if (!next) { bar.innerHTML = '<span>이 트랙의 마지막 문제까지 풀었어요! 🎉</span>'; $res.appendChild(bar); return; }
  let left = 5;
  bar.innerHTML = `<span id="nextmsg"></span> <button id="gonow" type="button" class="primary">지금 이동</button> <button id="stopauto" type="button">이동 취소</button>`;
  $res.appendChild(bar);
  const msg = bar.querySelector('#nextmsg');
  const show = () => { msg.textContent = `${left}초 뒤 다음 문제로 이동해요 → ${next.title}`; };
  show();
  bar.querySelector('#gonow').onclick = () => { clearNext(); location.hash = `#/p/${next.id}`; };
  bar.querySelector('#stopauto').onclick = () => { clearNext(); bar.innerHTML = '<span class="muted">자동 이동을 취소했어요. 위의 "다음 문제 →" 버튼으로 이동할 수 있어요.</span>'; };
  nextTimer = setInterval(() => {
    left--;
    if (left <= 0) { clearNext(); location.hash = `#/p/${next.id}`; } else show();
  }, 1000);
}

async function renderProblem(id) {
  clearNext();
  const meta = INDEX.find(p => p.id === id);
  if (!meta) { location.hash = '#/'; return; }
  renderNav(meta.track);
  $app.innerHTML = '<p class="muted">불러오는 중…</p>';
  const p = await loadProblem(id);
  const track = TRACKS.find(t => t.id === p.track);
  const list = INDEX.filter(x => x.track === p.track);
  const pos = list.findIndex(x => x.id === id);
  const prev = list[pos - 1], next = list[pos + 1];
  store.setLast(p.track, id);
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
        ${predictPanel(p)}
        ${casesPanel(p)}
        ${dsHtml}
        ${expectedPanel(p)}
        ${hintBox(p)}
        ${noteLinks(p)}
      </section>
      <section class="panel">
        <textarea id="code" class="code" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off"></textarea>
        <div class="actions">
          <button id="run">▶ 실행</button>
          <button id="submit" class="primary">제출</button>
          <button id="reset">처음 코드로</button>
          <button id="sol">정답 보기</button>
          ${next ? '<button id="nextbtn" type="button" class="ghost">다음 문제 →</button>' : ''}
        </div>
        <div id="result"></div>
        <div id="solbox"></div>
      </section>
    </div>
    <div class="pn"><span>${prev ? `<a href="#/p/${prev.id}">← ${esc(prev.title)}</a>` : ''}</span><span>${next ? `<a href="#/p/${next.id}">${esc(next.title)} →</a>` : ''}</span></div>`;

  wireHints(p);
  const $code = document.getElementById('code');
  const $res = document.getElementById('result');
  $code.value = p.predict ? (store.getCode(id) ?? '') : initial;
  if (p.predict) {
    $code.placeholder = '예상 출력을 그대로 적어 보세요 (여러 줄이면 줄을 바꿔서)';
    $code.style.minHeight = '140px';
    document.getElementById('run').textContent = '▶ 코드 실행해서 확인';
    document.getElementById('reset').style.display = 'none';
  }
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
      if (submit && $res.querySelector('.status.ok')) offerNext(next, $res);
    } catch (e) {
      $res.innerHTML = `<div class="status bad">엔진을 불러오지 못했어요: ${esc(e.message || e)}</div>`;
    }
    btns.forEach(b => b.disabled = false);
  }
  const nb = document.getElementById('nextbtn');
  if (nb) nb.onclick = () => { location.hash = `#/p/${next.id}`; };
  document.getElementById('run').onclick = () => go(false);
  document.getElementById('submit').onclick = () => go(true);
  document.getElementById('reset').onclick = () => { if (confirm('작성한 코드를 지우고 처음 코드로 되돌릴까요?')) { $code.value = p.starter; store.setCode(id, p.starter); } };
  document.getElementById('sol').onclick = () => {
    if (!confirm('정답을 보면 스스로 풀 기회가 줄어요. 그래도 볼까요?')) return;
    document.getElementById('solbox').innerHTML = p.predict
      ? `<h2>정답과 해설</h2><div class="muted">정답 출력</div><pre class="out">${esc(p.expected)}</pre><div class="muted">해설</div><div class="desc">${p.solution}</div>`
      : `<h2>정답 예시</h2><pre class="out">${esc(p.solution)}</pre>`;
  };
}

function noteLinks(p) {
  const ns = notesFor(p);
  if (!ns.length) return '';
  return `<div class="notelinks">📒 막히면 참고 노트: ${ns.map(x => `<a href="#/n/${x.id}" target="_blank" rel="noopener">${esc(x.title)} ↗</a>`).join(' · ')}</div>`;
}

function hintBox(p) {
  const hs = p.hints || (p.hint ? [p.hint] : []);
  if (!hs.length) return '<div class="muted" style="margin-top:.8rem">준비된 힌트가 없어요.</div>';
  return `<div id="hintbox" class="hintbox"><div class="muted">힌트는 ${hs.length}단계까지 볼 수 있어요. (1 개념·문법 설명 → 2 코드 뼈대 → 3 거의 완성 코드)</div><div id="hintlist"></div><button id="hintbtn" type="button">💡 힌트 1 보기</button></div>`;
}

function wireHints(p) {
  const hs = p.hints || (p.hint ? [p.hint] : []);
  const btn = document.getElementById('hintbtn');
  if (!btn) return;
  let shown = 0;
  btn.onclick = () => {
    if (shown === hs.length - 1 && hs.length === 3 && !confirm('힌트 3은 거의 완성된 코드예요. 그래도 볼까요?')) return;
    const box = document.createElement('details');
    box.open = true;
    box.className = 'hint';
    box.innerHTML = `<summary>힌트 ${shown + 1}</summary><div class="desc">${hs[shown]}</div>`;
    document.getElementById('hintlist').appendChild(box);
    shown++;
    if (shown >= hs.length) btn.remove();
    else btn.textContent = `💡 힌트 ${shown + 1} 보기`;
  };
}

const looseOut = t => normOut(t).split('\n').map(l => l.replace(/[ \t]+/g, ' ').trim()).join('\n');

async function judge(p, eng, code, submit, $res, setStatus) {
  if (p.predict) {
    if (!submit) {
      const r = await eng.runScript({ code: p.code, prelude: '', datasets: {}, packages: p.packages || [] }, setStatus);
      $res.innerHTML = `<div class="status info">실제로 실행한 결과예요. (정답을 미리 보는 것이니, 먼저 직접 예측해 본 뒤에 확인하세요)</div><pre class="out">${esc(r.stdout || '(출력 없음)')}</pre>`;
      return;
    }
    const ok = normOut(code) === normOut(p.expected);
    if (ok) store.markSolved(p.id);
    $res.innerHTML = ok
      ? `<div class="status ok">🎉 맞았어요! 예측이 정확해요.</div>`
      : `<div class="status bad">아직 달라요. 줄 수, 띄어쓰기, 따옴표·괄호까지 실제 출력과 똑같이 적어야 해요.\n코드를 한 줄씩 다시 따라가 보세요. 막히면 "힌트 보기"나 "코드 실행해서 확인"을 써 보세요.</div>`;
    return;
  }
  const datasets = {};
  for (const n of p.datasets || []) datasets[n] = await loadCsv(n);
  const base = { code, datasets, packages: p.packages || [], setup: p.setup || '' };

  if (p.cases) {
    const bad = checkCode(code, p.needs, p.forbids);   // 결과가 맞으면 통과. 연습용 문법 권유는 안내만 한다
    const cases = submit ? p.cases : p.cases.filter(c => c.visible);
    let pass = 0, spaceOnly = false;
    const items = [];
    for (const [i, c] of cases.entries()) {
      const r = await eng.runScript({ ...base, prelude: c.pre }, setStatus);
      const exact = r.ok && normOut(r.stdout) === normOut(c.expected);
      const loose = !exact && r.ok && looseOut(r.stdout) === looseOut(c.expected);   // 줄 안의 띄어쓰기만 다른 경우도 인정
      if (loose) spaceOnly = true;
      const ok = exact || loose;
      if (ok) pass++;
      const hidden = !c.visible;
      let body;
      if (hidden) body = ok ? `숨겨진 테스트 ${i + 1}: 통과` : `숨겨진 테스트 ${i + 1}: 실패`;
      else body = (c.pre ? `<div class="muted">주어진 코드</div><pre class="out">${esc(c.pre)}</pre>` : '') +
        `<div class="muted">기대 출력</div><pre class="out">${esc(c.expected)}</pre>` +
        `<div class="muted">내 출력</div><pre class="out">${esc(r.stdout || '(출력 없음)')}</pre>` +
        (r.ok ? '' : `<div class="status bad">오류가 났어요\n${esc(r.error)}</div>`);
      items.push(`<li class="${ok ? 'ok' : 'bad'}">${ok ? '✓ ' : '✗ '}${body}</li>`);
    }
    const all = pass === cases.length;
    if (submit && all) store.markSolved(p.id);
    const head = submit
      ? (all ? `🎉 통과! 모든 테스트(${cases.length}개)를 맞혔어요.` : `테스트 ${cases.length}개 중 ${pass}개 통과`)
      : `예제 ${cases.length}개 중 ${pass}개 통과 (제출하면 숨겨진 테스트까지 확인해요)`;
    const tip = bad ? (all
      ? `<div class="status info">💡 정답이에요! 다만 이 문제는 문법 연습용이라 이런 방법도 써 보면 좋아요: ${esc(bad)}</div>`
      : `<div class="status info">💡 이 문제의 연습 포인트: ${esc(bad)} (꼭 그래야 하는 건 아니고, 결과만 맞으면 정답이에요)</div>`) : '';
    const sp = spaceOnly ? '<div class="status info">💡 줄 안의 띄어쓰기만 달랐어요. 정답으로 인정했어요. (문제에 출력 형식이 적혀 있다면 그대로 맞춰 보세요)</div>' : '';
    const alt = submit && !all ? `<div class="muted" style="margin-top:.4rem">코드가 달라도 <b>출력이 같으면 정답</b>이에요. 기대 출력과 내 출력을 비교해 보세요.</div>` : '';
    $res.innerHTML = `<div class="status ${all ? 'ok' : 'bad'}">${head}</div>${tip}${sp}${alt}<ul class="tests">${items.join('')}</ul>`;
    return;
  }

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
    const alt = submit && !all ? `<div class="muted" style="margin-top:.4rem">풀이 방식은 자유예요. 함수가 <b>돌려주는 값</b>이 같으면 정답이에요.</div>` : '';
    $res.innerHTML = `<div class="status ${all ? 'ok' : 'bad'}">${head}</div>${alt}<ul class="tests">${items}</ul>${out}`;
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
  const alt = submit && !cmp.ok ? `<div class="muted" style="margin-top:.4rem">풀이 방식은 자유예요. 결과 표가 같으면 정답이에요. (열 이름은 달라도 되고${p.ordered ? '' : ', 행 순서도 달라도 돼요'})</div>` : '';
  $res.innerHTML = `<div class="status ${cmp.ok ? 'ok' : 'bad'}">${esc(head)}</div>${alt}
    <h2>내 결과</h2>${tableHtml(res.table)}${out}`;
}

// ---------- 기초 노트 ----------
function renderNotes(id) {
  renderNav('notes');
  const trackName = tid => TRACKS.find(t => t.id === tid)?.name || tid;
  const order = ['python', 'ds', 'r', 'sql'];
  const side = order.map(tid => {
    const list = NOTES.filter(n => n.track === tid);
    if (!list.length) return '';
    return `<div class="nsec"><b>${esc(trackName(tid))}</b>${list.map(n => `<a href="#/n/${n.id}" class="${n.id === id ? 'on' : ''}">${esc(n.title)}</a>`).join('')}</div>`;
  }).join('');
  const note = NOTES.find(n => n.id === id);
  const body = note
    ? `<h1>📒 ${esc(note.title)}</h1><div class="muted" style="margin-bottom:.6rem">${esc(trackName(note.track))} 기초 노트</div><div class="note desc">${note.html}</div>
       <div class="muted" style="margin-top:1rem">이 노트가 필요한 문제를 풀다가 왔다면 이전 탭으로 돌아가면 풀던 코드가 그대로 있어요.</div>`
    : `<h1>📒 기초 노트</h1><p class="muted">문법이나 개념이 기억나지 않을 때 펼쳐 보세요. 문제 화면 아래에서도 그 단원에 맞는 노트로 바로 연결돼요.</p>
       <input id="nsearch" class="nsearch" placeholder="노트 제목 검색 (예: 클래스, 람다, t-검정)">
       <div id="nlist">${order.map(tid => {
         const list = NOTES.filter(n => n.track === tid);
         return list.length ? `<h2>${esc(trackName(tid))}</h2><div class="ngrid">${list.map(n => `<a class="card" href="#/n/${n.id}" data-t="${esc(n.title)} ${esc(n.id)}"><b>${esc(n.title)}</b></a>`).join('')}</div>` : '';
       }).join('')}</div>`;
  $app.innerHTML = `<div class="nlayout"><aside class="nside">${side}</aside><section class="nmain">${body}</section></div>`;
  const q = document.getElementById('nsearch');
  if (q) q.oninput = () => $app.querySelectorAll('#nlist .card').forEach(c => { c.style.display = c.dataset.t.toLowerCase().includes(q.value.toLowerCase()) ? '' : 'none'; });
}

// ---------- 라우터 ----------
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [kind, arg] = h.split('/');
  window.scrollTo(0, 0);
  if (kind === 't') renderTrack(arg);
  else if (kind === 'p') renderProblem(arg);
  else if (kind === 'n') renderNotes(arg);
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
