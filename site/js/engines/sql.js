import { PGlite } from '../../vendor/pglite/index.js';
import { parseCsv, inferTypes } from '../csv.js';

let db = null;
const lit = v => (v === '' || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);

function cell(v, typeId) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'bigint') return Number(v);
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeId === 1700 && typeof v === 'string') return Number(v);
  return v;
}

async function loadDatasets(datasets) {
  await db.exec('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  for (const [name, text] of Object.entries(datasets || {})) {
    const csv = parseCsv(text);
    const types = inferTypes(csv);
    const cols = csv.header.map((h, i) => `"${h}" ${types[i]}`).join(', ');
    let sql = `CREATE TABLE "${name}" (${cols});`;
    if (csv.rows.length) {
      sql += `INSERT INTO "${name}" VALUES ` +
        csv.rows.map(r => '(' + csv.header.map((_, j) => lit(r[j])).join(',') + ')').join(',') + ';';
    }
    await db.exec(sql);
  }
}

export const sqlEngine = {
  label: 'SQL 엔진',
  async ensure(status) {
    if (db) return;
    status?.('SQL 엔진을 불러오는 중… (처음 한 번만 몇 초 걸려요)');
    db = new PGlite();
    await db.waitReady;
  },
  async runTable({ code, datasets }) {
    try {
      await loadDatasets(datasets);
      const results = await db.exec(code, { rowMode: 'array' });
      const last = [...results].reverse().find(r => r.fields && r.fields.length);
      if (!last) return { ok: false, error: '결과 표를 돌려주는 SELECT 문이 필요해요.', stdout: '' };
      const rows = last.rows.map(r => r.map((v, i) => cell(v, last.fields[i].dataTypeID)));
      return { ok: true, table: { columns: last.fields.map(f => f.name), rows }, stdout: '' };
    } catch (e) {
      return { ok: false, error: 'SQL 오류: ' + (e.message || e), stdout: '' };
    }
  },
};
