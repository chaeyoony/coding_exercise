import sql from './sql.mjs';
import sql2 from './sql2.mjs';
import sql3 from './sql3.mjs';
import python from './python.mjs';
import python2 from './python2.mjs';
import python3 from './python3.mjs';
import python4 from './python4.mjs';
import ds from './ds.mjs';
import ds2 from './ds2.mjs';
import ds3 from './ds3.mjs';
import r from './r.mjs';
import r2 from './r2.mjs';
import r3 from './r3.mjs';
import r4 from './r4.mjs';

// 확장 문제는 id 가 없는 원본이라 여기서 순서대로 번호를 붙인다. (순서를 바꾸면 번호가 달라지니 새 문제는 맨 뒤에 추가)
const numbered = (list, prefix, start) => list.map((x, i) => ({ ...x, id: `${prefix}-${String(start + i).padStart(3, '0')}` }));

export default [
  ...sql, ...sql2, ...sql3,
  ...python, ...python2, ...numbered([...python3, ...python4], 'py', 24),
  ...ds, ...ds2, ...numbered(ds3, 'ds', 401),
  ...r, ...r2, ...numbered([...r3, ...r4], 'r', 301),
];
