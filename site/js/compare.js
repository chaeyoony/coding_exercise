// 채점: 값 비교 (숫자는 오차 허용)
const EPS = 1e-6;

export function sameValue(a, b) {
  if (a === null || a === undefined) return b === null || b === undefined;
  if (b === null || b === undefined) return false;
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));
  }
  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every((x, i) => sameValue(x, b[i]));
  }
  if (typeof a === 'object') {
    if (typeof b !== 'object' || Array.isArray(b)) return false;
    const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
    return ka.length === kb.length && ka.every((k, i) => k === kb[i] && sameValue(a[k], b[k]));
  }
  return a === b;
}

function rowKey(r) {
  return JSON.stringify(r.map(v => (typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v)));
}

// 표 비교. 열 이름은 무시하고 값만 본다. ordered=false면 행 순서도 무시.
export function compareTables(actual, expected, ordered) {
  if (actual.columns.length !== expected.columns.length) {
    return { ok: false, msg: `열(컬럼) 개수가 다릅니다. (기대: ${expected.columns.length}개, 내 결과: ${actual.columns.length}개)` };
  }
  if (actual.rows.length !== expected.rows.length) {
    return { ok: false, msg: `행 개수가 다릅니다. (기대: ${expected.rows.length}행, 내 결과: ${actual.rows.length}행)` };
  }
  let a = actual.rows, e = expected.rows;
  if (!ordered) {
    a = [...a].sort((x, y) => (rowKey(x) < rowKey(y) ? -1 : 1));
    e = [...e].sort((x, y) => (rowKey(x) < rowKey(y) ? -1 : 1));
  }
  for (let i = 0; i < e.length; i++) {
    if (!sameValue(a[i], e[i])) {
      return { ok: false, msg: ordered
        ? `${i + 1}번째 행의 값이 다릅니다. 정렬 순서도 확인해 보세요.`
        : `값이 다른 행이 있습니다. 조건이나 계산식을 다시 확인해 보세요.` };
    }
  }
  return { ok: true };
}

// 출력 비교용 정리: 줄 끝 공백과 맨 끝의 빈 줄은 무시한다.
export const normOut = s => String(s ?? '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');

// 코드 조건 검사 (주석은 제외하고 검사). needs: 꼭 들어가야 하는 것, forbids: 들어가면 안 되는 것
export function checkCode(code, needs = [], forbids = []) {
  const src = code.replace(/#.*$/gm, '');
  for (const [pat, msg] of needs) if (!new RegExp(pat).test(src)) return msg;
  for (const [pat, msg] of forbids) if (new RegExp(pat).test(src)) return msg;
  return null;
}
