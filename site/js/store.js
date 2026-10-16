// 진행 상황 저장 (이 브라우저의 localStorage). 내보내기/가져오기로 기기 간 이동.
const KEY = 'practice-platform:v1';
let mem = { solved: {}, code: {} };

function load() {
  try { const s = localStorage.getItem(KEY); if (s) mem = { solved: {}, code: {}, ...JSON.parse(s) }; } catch (e) { /* 저장소를 못 쓰는 환경 */ }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* ignore */ } }
load();

export const store = {
  isSolved: id => !!mem.solved[id],
  markSolved(id) { mem.solved[id] = Date.now(); save(); },
  getCode: id => mem.code[id],
  setCode(id, code) { mem.code[id] = code; save(); },
  exportJson: () => JSON.stringify(mem, null, 1),
  importJson(text) {
    const d = JSON.parse(text);
    mem = { solved: { ...mem.solved, ...(d.solved || {}) }, code: { ...mem.code, ...(d.code || {}) } };
    save();
  },
};
