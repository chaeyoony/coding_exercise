// 진행 상황 저장: 이 브라우저의 localStorage + (선택) 본인 GitHub 비공개 Gist 동기화(sync.js).
// 기기가 여러 개여도 합쳐질 수 있게 풀이/코드/마지막 문제에 시간 기록을 남기고, 합칠 때는 더 최근 것을 쓴다.
const KEY = 'practice-platform:v1';
let mem = { solved: {}, code: {}, last: {}, codeAt: {}, lastAt: {} };
const listeners = [];

function load() {
  try { const s = localStorage.getItem(KEY); if (s) mem = { ...mem, ...JSON.parse(s) }; } catch (e) { /* 저장소를 못 쓰는 환경 */ }
}
function persist() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* ignore */ } }
function save() { persist(); listeners.forEach(f => f()); }
load();

// d(다른 기기/파일의 기록)를 내 기록에 합친다. 바뀐 게 있으면 true
function merge(d) {
  let changed = false;
  for (const [id, ts] of Object.entries(d.solved || {})) {
    if (!mem.solved[id]) { mem.solved[id] = ts; changed = true; }
    else if (ts < mem.solved[id]) { mem.solved[id] = ts; changed = true; }
  }
  for (const [id, code] of Object.entries(d.code || {})) {
    const rAt = d.codeAt?.[id] || 0;
    if (!(id in mem.code) || rAt > (mem.codeAt[id] || 0)) {
      if (mem.code[id] !== code) changed = true;
      mem.code[id] = code; mem.codeAt[id] = rAt;
    }
  }
  for (const [track, id] of Object.entries(d.last || {})) {
    const rAt = d.lastAt?.[track] || 0;
    if (!(track in mem.last) || rAt > (mem.lastAt[track] || 0)) {
      if (mem.last[track] !== id) changed = true;
      mem.last[track] = id; mem.lastAt[track] = rAt;
    }
  }
  return changed;
}

// 내 기록 중 d(원격)에 없는 최신 내용이 있는가
function hasNews(d) {
  for (const id of Object.keys(mem.solved)) if (!d.solved?.[id]) return true;
  for (const id of Object.keys(mem.code)) if (!(id in (d.code || {})) || (mem.codeAt[id] || 0) > (d.codeAt?.[id] || 0)) return true;
  for (const t of Object.keys(mem.last)) if (!(t in (d.last || {})) || (mem.lastAt[t] || 0) > (d.lastAt?.[t] || 0)) return true;
  return false;
}

export const store = {
  isSolved: id => !!mem.solved[id],
  markSolved(id) { if (mem.solved[id]) return; mem.solved[id] = Date.now(); save(); },
  getLast: track => mem.last[track],
  setLast(track, id) { if (mem.last[track] === id) return; mem.last[track] = id; mem.lastAt[track] = Date.now(); save(); },
  getCode: id => mem.code[id],
  setCode(id, code) { if (mem.code[id] === code) return; mem.code[id] = code; mem.codeAt[id] = Date.now(); save(); },
  exportJson: () => JSON.stringify(mem, null, 1),
  importJson(text) { merge(JSON.parse(text)); save(); },
  // 동기화에서 받은 기록 합치기 (다시 올리지는 않음)
  mergeRemote(d) { const c = merge(d); if (c) persist(); return c; },
  hasNews,
  onChange(fn) { listeners.push(fn); },
};
