import { TRACKS } from './tracks.js';
import { store } from './store.js';
import { connect, disconnect, syncNow, isConnected, getState, onStatus, startSync } from './sync.js';
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
// 문제 화면 위쪽의 진행률 (이 언어 전체 / 이 단원)
function progHtml(p) {
  // 코딩 문제와 퀴즈가 둘 다 있는 언어는 지금 풀고 있는 종류(코딩/퀴즈)만의 진행률을 보여 준다
  const kinds = [...new Set(INDEX.filter(x => x.track === p.track).map(kindOf))];
  const k = kindOf(p);
  const list = INDEX.filter(x => x.track === p.track && (kinds.length < 2 || kindOf(x) === k));
  const done = list.filter(x => store.isSolved(x.id)).length;
  const cat = INDEX.filter(x => x.track === p.track && x.category === p.category);
  const cd = cat.filter(x => store.isSolved(x.id)).length;
  const pct = (a, b) => (b ? Math.round(100 * a / b) : 0);
  const tp = pct(done, list.length);
  const label = kinds.length < 2 ? '전체' : (k === 'quiz' ? '퀴즈' : '코딩 문제');
  progP = p;
  // 오늘 목표(선택): 이 종류 전체 문제 수의 몇 %를 오늘 풀지. 목표 대비 오늘 푼 문제와 남은 문제를 보여 준다
  const goal = Number(store.getPref(goalKey(p), 0)) || 0;
  let goalHtml = '';
  if (goal > 0 && list.length) {
    const target = Math.max(1, Math.ceil(goal * list.length / 100));
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const today = list.filter(x => store.isSolved(x.id) && store.solvedAt(x.id) >= t0.getTime()).length;
    const left = Math.max(0, target - today);
    const gp = Math.min(100, Math.round(100 * today / target));
    goalHtml = `<div class="pprog-row goal"><span><b>🎯 오늘 목표 ${goal}%</b> <span class="muted">(${target}문제)</span> · 오늘 <b>${today}</b>문제 풀었어요</span>
      <span class="${left ? 'muted' : 'goal-done'}">${left ? `목표까지 ${left}문제 (${(100 * left / list.length).toFixed(1)}%p) 남음` : '🎉 오늘 목표 달성!'}</span></div>
      <div class="bar goalbar"><i style="width:${gp}%"></i></div>`;
  }
  return `<div class="pprog-row"><span><b>${label} 진행률 ${tp}%</b> <span class="muted">(${done} / ${list.length} 문제)</span></span>
    <span class="muted">이 단원 ${cd} / ${cat.length} (${pct(cd, cat.length)}%) · <button type="button" class="goalbtn" data-goal="1">${goal > 0 ? '목표 변경' : '🎯 오늘 목표 설정'}</button></span></div>
    <div class="bar"><i style="width:${tp}%"></i></div>${goalHtml}`;
}
let progP = null;
const goalKey = p => `goal:${p.track}:${kindOf(p)}`;
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-goal]');
  if (!b || !progP) return;
  const cur = Number(store.getPref(goalKey(progP), 0)) || 0;
  const v = prompt('오늘 풀 목표를 전체 문제의 몇 %로 할까요? (예: 2)\n비우거나 0을 입력하면 목표를 끕니다.', cur || '');
  if (v === null) return;
  const n = Math.max(0, Math.min(100, Number(String(v).replace('%', '').trim()) || 0));
  store.setPref(goalKey(progP), n);
  const pg = document.getElementById('pprog'); if (pg) pg.innerHTML = progHtml(progP);
});

function progress(trackId) {
  const list = INDEX.filter(p => p.track === trackId);
  return { done: list.filter(p => store.isSolved(p.id)).length, total: list.length };
}

// 이어하기: 풀던 문제(안 풀었으면 그 문제, 풀었으면 그다음 안 푼 문제)로
// 지금 보기 방식(단원별/난이도순)과 같은 순서의 문제 목록
function orderedList(trackId, kind) {
  let list = INDEX.filter(p => p.track === trackId);
  if (kind) list = list.filter(p => kindOf(p) === kind);
  if (view.mode !== 'level') return list;
  const t = TRACKS.find(x => x.id === trackId);
  const rank = Object.fromEntries(t.categories.map((c, i) => [c, i]));
  return list.map((p, i) => [p, i]).sort((a, b) => (a[0].level - b[0].level) || ((rank[a[0].category] ?? 99) - (rank[b[0].category] ?? 99)) || (a[1] - b[1])).map(x => x[0]);
}

function continueTarget(trackId) {
  const last = store.getLast(trackId);
  const lastP = last ? INDEX.find(p => p.id === last) : null;
  const list = orderedList(trackId, lastP ? kindOf(lastP) : trackKind(trackId));
  if (!list.length) return null;
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

// 파이썬처럼 코딩 문제와 퀴즈가 모두 있는 언어는 두 하위 섹션으로 나눠 보여 준다
const trackKinds = tid => [...new Set(INDEX.filter(p => p.track === tid).map(kindOf))];
const trackKind = tid => { const ks = trackKinds(tid); const k = store.getPref('kind:' + tid, 'code'); return ks.includes(k) ? k : (ks[0] || 'code'); };

let syncOpen = false;   // 방금 연결했으면 펼쳐서 결과를 보여준다
function syncBox() {
  const on = isConnected();
  const st = getState();
  const when = st.at ? new Date(st.at).toLocaleString('ko-KR') : '아직 없음';
  if (on) {
    return `<details class="syncbox" id="syncbox" ${syncOpen ? 'open' : ''}><summary>☁️ 기기 간 동기화 <b>연결됨</b> <span class="muted" id="synclabel">${syncLabel(st)}</span></summary>
      <p class="muted">진행 상황과 작성한 코드가 본인 GitHub의 비공개 Gist에 자동으로 저장돼요. 다른 기기에서도 같은 토큰으로 연결하면 이어서 할 수 있어요.</p>
      <p class="muted">마지막 동기화: <span id="syncwhen">${esc(when)}</span></p>
      <div class="tools"><button id="syncnow">지금 동기화</button><button id="syncoff">연결 해제</button></div>
      <p class="muted" id="syncmsg"></p></details>`;
  }
  return `<details class="syncbox" id="syncbox" open><summary>☁️ 기기 간 동기화 <b>설정하면 어디서든 이어서 할 수 있어요</b></summary>
    <p class="muted">지금은 이 기기의 브라우저에만 저장돼요. 본인 GitHub 계정의 <b>비공개 Gist</b>에 자동으로 저장해 두면 PC·아이패드 어디서든 같은 진행 상황이 유지돼요. (서버 없음, 무료)</p>
    <ol class="muted">
      <li><a href="https://github.com/settings/tokens/new?scopes=gist&description=coding-practice-sync" target="_blank" rel="noopener">여기를 눌러 토큰 만들기 ↗</a> — 권한은 <code>gist</code> 하나만 체크된 상태로 열려요. 맨 아래 "Generate token"을 누르고 나온 토큰(ghp_…)을 복사하세요.</li>
      <li>아래에 붙여넣고 "연결"을 누르세요. 다른 기기에서도 <b>같은 토큰</b>으로 연결하면 돼요.</li>
    </ol>
    <div class="tools"><input id="synctoken" type="password" placeholder="ghp_로 시작하는 토큰" autocomplete="off" autocapitalize="off" spellcheck="false"><button id="syncgo" class="primary">연결</button></div>
    <p class="muted" id="syncmsg"></p>
    <p class="muted" style="font-size:.82rem">토큰은 이 브라우저에만 저장되고 GitHub 말고는 어디로도 보내지 않아요. 연결 전에 있던 기록은 합쳐져서 사라지지 않아요.</p></details>`;
}

function syncLabel(st) {
  return st.status === 'syncing' ? '동기화 중…' : st.status === 'error' ? '⚠️ ' + st.msg : st.status === 'ok' ? '✓ 동기화됨' : '';
}

function wireSync() {
  const msg = document.getElementById('syncmsg');
  const go = document.getElementById('syncgo');
  if (go) go.onclick = async () => {
    const token = document.getElementById('synctoken').value.trim();
    if (!token) { msg.textContent = '토큰을 붙여넣어 주세요.'; return; }
    go.disabled = true; msg.textContent = '연결하는 중…';
    try { await connect(token); syncOpen = true; renderHome(); }
    catch (e) { msg.textContent = '연결하지 못했어요: ' + e.message; go.disabled = false; }
  };
  const now = document.getElementById('syncnow');
  if (now) now.onclick = async () => { msg.textContent = '동기화하는 중…'; await syncNow(true); syncOpen = true; renderHome(); };
  const off = document.getElementById('syncoff');
  if (off) off.onclick = () => { if (confirm('연결을 해제할까요? 이 기기의 기록은 그대로 남아요.')) { disconnect(); syncOpen = false; renderHome(); } };
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
    ${syncBox()}
    <p><a class="notehome" href="#/n">📒 기초 노트 모음 — 막힐 때 펼쳐 보는 코드 정리 (${NOTES.length}개)</a></p>
    <div class="tools">
      <button id="exp">진행 상황 내보내기</button>
      <button id="imp">진행 상황 가져오기</button>
      <input type="file" id="impf" accept="application/json" hidden>
    </div>
    <p class="muted" style="font-size:.85rem">진행 상황은 이 기기의 브라우저에 저장돼요. 다른 기기에서 이어가려면 내보내기 → 가져오기를 사용하세요.</p>`;
  wireSync();
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
const kindOf = p => p.kind || (p.quiz ? 'quiz' : 'code');
const view = { level: 0, unsolved: false, get mode() { return store.getPref('mode', (() => { try { return localStorage.getItem('pp:mode') || 'cat'; } catch (e) { return 'cat'; } })()); }, set mode(v) { store.setPref('mode', v); } };   // 목록 필터 (페이지를 옮겨도 유지)

function renderTrack(id) {
  const t = TRACKS.find(x => x.id === id);
  if (!t) return renderHome();
  renderNav(id);
  const { done, total } = progress(id);
  const kinds = trackKinds(id);
  const kind = trackKind(id);
  const inKind = p => kindOf(p) === kind;
  const keep = p => (!view.level || p.level === view.level) && (!view.unsolved || !store.isSolved(p.id));
  const row = (p, showCat) => `
      <li><a href="#/p/${p.id}"><span class="chk">${store.isSolved(p.id) ? '✓' : ''}</span>
      <span>${esc(p.title)}${showCat ? ` <span class="muted catsmall">${esc(p.category)}</span>` : ''}</span><span class="lv" title="난이도">${stars(p.level)}</span></a></li>`;
  let sections;
  if (view.mode === 'level') {
    const rank = Object.fromEntries(t.categories.map((c, i) => [c, i]));
    sections = [1, 2, 3, 4, 5].map(lv => {
      const all = INDEX.filter(p => p.track === id && p.level === lv && inKind(p)).sort((a, b) => (rank[a.category] ?? 99) - (rank[b.category] ?? 99));
      const list = all.filter(keep);
      if (!list.length) return '';
      const d = all.filter(p => store.isSolved(p.id)).length;
      return `<details class="cat" ${lv <= 2 ? 'open' : ''}><summary><b>난이도 ${stars(lv)}</b> <span class="muted">${d} / ${all.length}</span></summary>
      <ul class="plist">${list.map(p => row(p, true)).join('')}</ul></details>`;
    }).join('');
  } else {
    sections = t.categories.map(cat => {
      const all = INDEX.filter(p => p.track === id && p.category === cat && inKind(p));
      if (!all.length) return '';
      const list = all.filter(keep);
      if (!list.length) return '';
      const d = all.filter(p => store.isSolved(p.id)).length;
      return `<details class="cat" open><summary><b>${esc(cat)}</b> <span class="muted">${d} / ${all.length}</span></summary>
      <ul class="plist">${list.map(p => row(p, false)).join('')}</ul></details>`;
    }).join('');
  }
  const kcount = k => INDEX.filter(p => p.track === id && kindOf(p) === k);
  const kdone = k => kcount(k).filter(p => store.isSolved(p.id)).length;
  const kindTabs = kinds.length > 1 ? `<div class="kindtabs">${[['code', '💻 코딩 문제'], ['quiz', '📝 OX·객관식 퀴즈']].filter(([k]) => kinds.includes(k)).map(([k, label]) => `<button class="kindtab ${kind === k ? 'on' : ''}" data-kind="${k}">${label}<span class="muted"> ${kdone(k)} / ${kcount(k).length}</span></button>`).join('')}</div>` : '';
  const chip = (lv, label) => `<button class="chip ${view.level === lv ? 'on' : ''}" data-lv="${lv}">${label}</button>`;
  $app.innerHTML = `<h1>${t.icon} ${esc(t.name)}</h1>
    <p class="muted">${esc(t.desc)} · ${done} / ${total} 해결 · 실행 환경: ${esc(t.lang)}</p>
    ${kindTabs}
    <div class="filters"><button class="chip ${view.mode === 'cat' ? 'on' : ''}" data-mode="cat">📚 단원별</button><button class="chip ${view.mode === 'level' ? 'on' : ''}" data-mode="level">📶 난이도순</button>
      <span class="sep"></span>${chip(0, '전체')}${[1, 2, 3, 4, 5].map(n => chip(n, stars(n).replace(/☆/g, ''))).join('')}
      <button class="chip ${view.unsolved ? 'on' : ''}" id="unsolved">안 푼 문제만</button></div>
    ${sections || '<p class="muted">조건에 맞는 문제가 없어요.</p>'}`;
  $app.querySelectorAll('[data-kind]').forEach(b => b.onclick = () => { store.setPref('kind:' + id, b.dataset.kind); renderTrack(id); });
  $app.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { view.mode = b.dataset.mode; renderTrack(id); });
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
  if (p.quiz) return renderQuiz(p);
  const track = TRACKS.find(t => t.id === p.track);
  const list = orderedList(p.track, kindOf(p));
  const pos = list.findIndex(x => x.id === id);
  const prev = list[pos - 1], next = list[pos + 1];
  store.setLast(p.track, id);
  const initial = store.getCode(id) ?? p.starter;
  const dsHtml = await datasetPanel(p);

  $app.innerHTML = `
    <div class="muted" style="font-size:.9rem"><a href="#/t/${p.track}">${track.icon} ${esc(track.name)}</a> › ${esc(p.category)}</div>
    <div class="pprog" id="pprog">${progHtml(p)}</div>
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
        <div class="muted keyhint">단축키: <kbd>${modKey()}</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd> 제출 · <kbd>${modKey()}</kbd>+<kbd>Enter</kbd> 실행 · <kbd>${modKey()}</kbd>+<kbd>Enter</kbd> 두 번 연속 또는 <kbd>Option/Alt</kbd>+<kbd>Enter</kbd> 도 제출</div>
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
    }
  });

  const setStatus = msg => { $res.innerHTML = `<div class="status info">${esc(msg)}</div>`; };
  const btns = ['run', 'submit'].map(i => document.getElementById(i));
  let pendingSubmit = false;
  async function go(submit) {
    btns.forEach(b => b.disabled = true);
    try {
      store.setCode(id, $code.value);
      const eng = await getEngine(p.track);
      await eng.ensure(setStatus);
      await judge(p, eng, $code.value, submit, $res, setStatus);
      if (submit && $res.querySelector('.status.ok')) { offerNext(next, $res); const pg = document.getElementById('pprog'); if (pg) pg.innerHTML = progHtml(p); }
    } catch (e) {
      $res.innerHTML = `<div class="status bad">엔진을 불러오지 못했어요: ${esc(e.message || e)}</div>`;
    }
    btns.forEach(b => b.disabled = false);
    if (pendingSubmit) { pendingSubmit = false; go(true); }
  }
  const nb = document.getElementById('nextbtn');
  if (nb) nb.onclick = () => { location.hash = `#/p/${next.id}`; };
  // 단축키: Ctrl/⌘ + Shift + Enter = 제출, Ctrl/⌘ + Enter = 실행
  // 아이패드(Safari)는 ⌘와 함께 누른 Shift가 이벤트에 안 실리기도 해서, Shift 키 자체를 따로 추적하고
  // 우회 방법(Option/Alt + Enter, ⌘+Enter 두 번 연속)도 제출로 인정한다.
  let shiftDown = false, lastRun = 0;
  $code.addEventListener('keydown', e => {
    if (e.key === 'Shift') { shiftDown = true; return; }
    if (e.key !== 'Enter') return;
    const mod = e.ctrlKey || e.metaKey;
    if (!mod && !e.altKey) return;
    e.preventDefault();
    const shift = e.shiftKey || shiftDown || (e.getModifierState && e.getModifierState('Shift'));
    const quickTwice = mod && Date.now() - lastRun < 900;   // ⌘+Enter 를 빠르게 두 번
    const wantSubmit = shift || e.altKey || quickTwice;
    if (btns[0].disabled) { if (wantSubmit) pendingSubmit = true; return; }   // 실행 중이면 끝난 뒤 제출
    if (wantSubmit) { lastRun = 0; go(true); }
    else { lastRun = Date.now(); go(false); }
  });
  $code.addEventListener('keyup', e => { if (e.key === 'Shift') shiftDown = false; });
  $code.addEventListener('blur', () => { shiftDown = false; });
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

// 맥·아이패드는 ⌘(Command), 그 외(윈도우 등)는 Ctrl
function modKey() {
  const apple = /Mac|iPad|iPhone/.test(navigator.platform || '') || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));
  return apple ? '⌘' : 'Ctrl';
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

// ---------- OX·객관식 퀴즈 ----------
async function renderQuiz(p) {
  const id = p.id;
  const track = TRACKS.find(t => t.id === p.track);
  const list = orderedList(p.track, kindOf(p));
  const pos = list.findIndex(x => x.id === id);
  const prev = list[pos - 1], next = list[pos + 1];
  store.setLast(p.track, id);
  const ox = p.quiz.choices.length === 2 && p.quiz.choices[0] === '참';
  const choices = p.quiz.choices.map((c, i) => `<label class="qchoice"><input type="radio" name="qc" value="${i}"><span>${ox ? '' : `${i + 1}. `}${esc(c)}</span></label>`).join('');
  $app.innerHTML = `
    <div class="muted" style="font-size:.9rem"><a href="#/t/${p.track}">${track.icon} ${esc(track.name)}</a> › ${esc(p.category)}</div>
    <div class="pprog" id="pprog">${progHtml(p)}</div>
    <h1>${esc(p.title)} ${store.isSolved(id) ? '<span class="badge" style="background:var(--ok-soft);color:var(--ok)">해결함 ✓</span>' : ''}</h1>
    <div class="pgrid">
      <section class="panel desc">
        <span class="badge">난이도 ${stars(p.level)}</span><span class="badge">${esc(p.category)}</span><span class="badge">${ox ? 'OX' : '객관식'}</span>
        ${p.desc}
        <div class="qchoices" id="qchoices">${choices}</div>
        <div class="actions"><button id="qsubmit" class="primary">제출</button><button id="qshow">정답·해설 보기</button>${next ? '<button id="nextbtn" type="button" class="ghost">다음 문제 →</button>' : ''}</div>
        <div id="result"></div>
        ${hintBox(p)}
        ${noteLinks(p)}
      </section>
      <section class="panel">
        ${p.code ? `<h2>🧪 직접 실행해 보기</h2><p class="muted">코드를 고쳐 가며 실행해 보세요. 정답 판정과는 상관없어요.</p>
          <textarea id="code" class="code" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off"></textarea>
          <div class="actions"><button id="run">▶ 실행</button><button id="reset">처음 코드로</button></div><div id="runres"></div>`
          : '<p class="muted">이 문제는 개념을 묻는 문제예요. 막히면 힌트를 열어 보세요.</p>'}
      </section>
    </div>
    <div class="pn"><span>${prev ? `<a href="#/p/${prev.id}">← ${esc(prev.title)}</a>` : ''}</span><span>${next ? `<a href="#/p/${next.id}">${esc(next.title)} →</a>` : ''}</span></div>`;
  wireHints(p);
  const $res = document.getElementById('result');
  const answerText = () => (ox ? p.quiz.choices[p.quiz.answer] : `${p.quiz.answer + 1}번 (${p.quiz.choices[p.quiz.answer]})`);
  const explainHtml = `<div class="desc" style="margin-top:.5rem"><b>해설</b><br>${p.explain}</div>`;
  document.getElementById('qsubmit').onclick = () => {
    const sel = document.querySelector('input[name="qc"]:checked');
    if (!sel) { $res.innerHTML = '<div class="status info">보기를 먼저 골라 주세요.</div>'; return; }
    const ok = Number(sel.value) === p.quiz.answer;
    if (ok) {
      store.markSolved(id);
      $res.innerHTML = `<div class="status ok">🎉 정답이에요!</div>${explainHtml}`;
      offerNext(next, $res);
      const pg = document.getElementById('pprog'); if (pg) pg.innerHTML = progHtml(p);
    } else {
      $res.innerHTML = '<div class="status bad">아쉬워요, 오답이에요. 다시 골라 보세요. (막히면 힌트를 열어 보거나 아래 "직접 실행해 보기"를 써 보세요)</div>';
    }
  };
  document.getElementById('qshow').onclick = () => {
    if (!confirm('정답을 보면 스스로 풀 기회가 줄어요. 그래도 볼까요?')) return;
    $res.innerHTML = `<div class="status info">정답: <b>${esc(answerText())}</b></div>${explainHtml}`;
  };
  const nb = document.getElementById('nextbtn');
  if (nb) nb.onclick = () => { location.hash = `#/p/${next.id}`; };
  document.addEventListener('keydown', function onKey(e) {
    if (!location.hash.endsWith('/' + id)) { document.removeEventListener('keydown', onKey); return; }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && document.activeElement?.tagName !== 'TEXTAREA') document.getElementById('qsubmit')?.click();
  });
  const $code = document.getElementById('code');
  if ($code) {
    $code.value = p.code;
    $code.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); $code.setRangeText('    ', $code.selectionStart, $code.selectionEnd, 'end'); } });
    document.getElementById('reset').onclick = () => { $code.value = p.code; };
    const runBtn = document.getElementById('run');
    runBtn.onclick = async () => {
      const out = document.getElementById('runres');
      runBtn.disabled = true;
      out.innerHTML = '<div class="status info">실행 중…</div>';
      try {
        const eng = await getEngine(p.track);
        await eng.ensure(msg => { out.innerHTML = `<div class="status info">${esc(msg)}</div>`; });
        const r = await eng.runScript({ code: $code.value, prelude: '', datasets: {}, packages: p.packages || [] }, msg => { out.innerHTML = `<div class="status info">${esc(msg)}</div>`; });
        out.innerHTML = r.ok ? `<div class="muted">출력</div><pre class="out">${esc(r.stdout || '(출력 없음)')}</pre>` : `<div class="status bad">오류가 났어요\n${esc(r.error)}</div>`;
      } catch (e) { out.innerHTML = `<div class="status bad">${esc(e.message || e)}</div>`; }
      runBtn.disabled = false;
    };
  }
}

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
  const badge = document.getElementById('syncstat');
  const paintBadge = st => {
    if (!badge) return;
    badge.hidden = !isConnected();
    badge.textContent = st.status === 'syncing' ? '☁️ 동기화 중…' : st.status === 'error' ? '⚠️ 동기화 오류' : '☁️ 동기화됨';
    badge.title = st.msg || '진행 상황이 GitHub Gist에 저장돼요';
    const lbl = document.getElementById('synclabel');
    if (lbl) lbl.textContent = syncLabel(st);
  };
  onStatus(paintBadge);
  paintBadge(getState());
  if (badge) badge.onclick = () => { location.hash = '#/'; };
  route();
  // 다른 기기에서 바뀐 기록이 들어오면 목록 화면만 새로 그린다 (문제 풀이 중인 코드는 건드리지 않는다)
  startSync(() => { const k = location.hash.replace(/^#\/?/, '').split('/')[0]; if (k !== 'p' && k !== 'n') route(); });
})();
