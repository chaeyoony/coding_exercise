// 아주 작은 CSV 파서 + 열 타입 추정 (SQL 테이블 생성에 사용)
export function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else inQ = false; }
      else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  const header = rows.shift();
  return { header, rows };
}

export function inferTypes({ header, rows }) {
  return header.map((_, j) => {
    const vals = rows.map(r => r[j]).filter(v => v !== '' && v !== undefined);
    if (vals.length && vals.every(v => /^-?\d+$/.test(v))) return 'INTEGER';
    if (vals.length && vals.every(v => /^-?\d+(\.\d+)?$/.test(v))) return 'NUMERIC';
    if (vals.length && vals.every(v => /^\d{4}-\d{2}-\d{2}$/.test(v))) return 'DATE';
    return 'TEXT';
  });
}
