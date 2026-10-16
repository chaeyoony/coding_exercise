const TIMEOUT = 15000;
let worker = null, ready = null, seq = 0;
const warmed = new Set();   // 이미 불러온 패키지 조합은 짧은 제한 시간을 쓴다
const pending = new Map();

function spawn(status) {
  worker = new Worker(new URL('./py-worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = e => {
    const p = pending.get(e.data.id);
    if (!p) return;
    pending.delete(e.data.id);
    e.data.ok ? p.resolve(e.data) : p.reject(new Error(e.data.error));
  };
  worker.onerror = e => {
    for (const p of pending.values()) p.reject(new Error(e.message || '파이썬 엔진 오류'));
    pending.clear();
  };
  status?.('파이썬 엔진을 불러오는 중… (처음 한 번만 몇 초 걸려요)');
  ready = call('init', {});
}

function call(type, payload, timeout = 0) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, type, payload });
    if (timeout) setTimeout(() => {
      if (!pending.has(id)) return;
      pending.delete(id);
      worker.terminate(); worker = null; ready = null; warmed.clear();   // 무한 반복 등으로 멈춘 엔진을 끊는다
      reject(new Error('TIMEOUT'));
    }, timeout);
  });
}

async function run(type, payload, status) {
  try {
    if (!worker) spawn(status);
    await ready;
    status?.('실행 중…');
    // 처음 불러오는 패키지 조합은 로딩 시간이 있어 넉넉히 기다린다
    const key = [...(payload.packages || []), ...(Object.keys(payload.datasets || {}).length ? ['pandas'] : [])].sort().join(',');
    const res = await call(type, payload, warmed.has(key) ? TIMEOUT : TIMEOUT * 4);
    warmed.add(key);
    return res.result;
  } catch (e) {
    if (e.message === 'TIMEOUT') return { ok: false, error: '실행 시간이 너무 오래 걸려요. 무한 반복이 있는지 확인해 보세요. (엔진을 다시 시작했어요)', stdout: '' };
    return { ok: false, error: '엔진 오류: ' + e.message, stdout: '' };
  }
}

export const pyEngine = {
  label: '파이썬 엔진',
  async ensure(status) { if (!worker) spawn(status); await ready; },
  runTable: (p, status) => run('table', p, status),
  runTests: (p, status) => run('tests', p, status),
};
