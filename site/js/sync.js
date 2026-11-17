// 기기 간 동기화: 본인 GitHub 계정의 "비공개 Gist" 파일 하나에 진행 상황을 저장한다. (서버 없음)
// 토큰(gist 권한만)은 이 브라우저의 localStorage 에만 저장된다.
import { store } from './store.js';

const CK = 'practice-platform:sync';
const FILE = 'practice-progress.json';
const DESC = '코딩 연습장 진행 상황 (practice-platform)';
const API = 'https://api.github.com';

const readCfg = () => { try { return JSON.parse(localStorage.getItem(CK)) || {}; } catch (e) { return {}; } };
const writeCfg = c => { try { localStorage.setItem(CK, JSON.stringify(c)); } catch (e) { /* ignore */ } };

let state = { status: readCfg().gistId ? 'idle' : 'off', msg: '', at: readCfg().lastSync || 0 };
const statusSubs = [];
let onRemote = () => {};
const set = (status, msg = '') => { state = { ...state, status, msg, at: status === 'ok' ? Date.now() : state.at }; statusSubs.forEach(f => f(state)); };

async function gh(path, opts = {}) {
  const c = readCfg();
  const r = await fetch(API + path, {
    ...opts,
    headers: { Authorization: 'Bearer ' + c.token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  if (!r.ok) { const e = new Error('GitHub ' + r.status); e.status = r.status; throw e; }
  return r.json();
}

async function findGist() {
  for (let page = 1; page <= 5; page++) {
    const list = await gh(`/gists?per_page=100&page=${page}`);
    const hit = list.find(g => g.files && g.files[FILE]);
    if (hit) return hit.id;
    if (list.length < 100) break;
  }
  return null;
}

async function readGist(id) {
  const g = await gh('/gists/' + id);
  const f = g.files && g.files[FILE];
  if (!f) return null;
  const text = f.truncated ? await (await fetch(f.raw_url)).text() : f.content;
  return JSON.parse(text);
}

const writeGist = id => gh('/gists/' + id, { method: 'PATCH', body: JSON.stringify({ files: { [FILE]: { content: store.exportJson() } } }) });

const explain = e => e.status === 401 ? '토큰이 올바르지 않거나 만료됐어요.' : e.status === 403 ? 'GitHub가 요청을 막았어요. 잠시 뒤 다시 시도하거나 토큰 권한(gist)을 확인하세요.' : e.status === 404 ? '저장된 Gist를 찾지 못했어요. 연결을 해제하고 다시 연결해 보세요.' : '네트워크 오류예요. 인터넷 연결을 확인하세요.';

let running = null;
// 원격 기록을 가져와 합치고, 내 쪽에 새 내용이 있으면 올린다
export function syncNow() {
  const c = readCfg();
  if (!c.token || !c.gistId) return Promise.resolve();
  if (running) return running;
  set('syncing');
  running = (async () => {
    try {
      const remote = await readGist(c.gistId);
      let changed = false;
      if (remote) changed = store.mergeRemote(remote);
      if (!remote || store.hasNews(remote)) await writeGist(c.gistId);
      writeCfg({ ...readCfg(), lastSync: Date.now() });
      set('ok');
      if (changed) onRemote();
    } catch (e) { set('error', explain(e)); }
    finally { running = null; }
  })();
  return running;
}

export async function connect(token) {
  writeCfg({ token: token.trim() });
  set('syncing');
  try {
    let id = await findGist();
    if (!id) {
      const g = await gh('/gists', { method: 'POST', body: JSON.stringify({ description: DESC, public: false, files: { [FILE]: { content: store.exportJson() } } }) });
      id = g.id;
    }
    writeCfg({ token: token.trim(), gistId: id });
    await syncNow();
    if (state.status === 'error') throw new Error(state.msg);
  } catch (e) {
    writeCfg({});
    set('off');
    throw new Error(e.status ? explain(e) : e.message);
  }
}

export function disconnect() { writeCfg({}); set('off'); }
export const isConnected = () => !!readCfg().gistId;
export const getState = () => state;
export const onStatus = f => statusSubs.push(f);

// 앱 시작 시 한 번 호출: 변경을 몇 초 모아 올리고, 창이 다시 보일 때 최신 상태로 맞춘다
export function startSync(onRemoteChange) {
  onRemote = onRemoteChange;
  let t = null;
  store.onChange(() => { if (!isConnected()) return; clearTimeout(t); t = setTimeout(syncNow, 3000); });
  document.addEventListener('visibilitychange', () => {
    if (!isConnected()) return;
    if (document.visibilityState === 'hidden') { clearTimeout(t); syncNow(); }
    else syncNow();
  });
  addEventListener('online', () => { if (isConnected()) syncNow(); });
  if (isConnected()) syncNow();
}
