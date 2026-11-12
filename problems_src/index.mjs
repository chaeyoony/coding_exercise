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
import pycourse1 from './pycourse1.mjs';
import pycourse2 from './pycourse2.mjs';
import pycourse3 from './pycourse3.mjs';
import pybasic from './pybasic.mjs';
import pyfunc from './pyfunc.mjs';
import pyfunc2 from './pyfunc2.mjs';
import pyclass from './pyclass.mjs';
import pylater from './pylater.mjs';
import pyproject from './pyproject.mjs';
import rmore from './rmore.mjs';
import pyclass11 from './pyclass11.mjs';
import pyclass11b from './pyclass11b.mjs';
import rstats from './rstats.mjs';
import pylambda from './pylambda.mjs';
import dsml from './dsml.mjs';
import dsdl from './dsdl.mjs';
import r from './r.mjs';
import r2 from './r2.mjs';
import r3 from './r3.mjs';
import r4 from './r4.mjs';

// 확장 문제는 id 가 없는 원본이라 여기서 순서대로 번호를 붙인다. (순서를 바꾸면 번호가 달라지니 새 문제는 맨 뒤에 추가)
const numbered = (list, prefix, start) => list.map((x, i) => ({ ...x, id: `${prefix}-${String(start + i).padStart(3, '0')}` }));

export default [
  ...sql, ...sql2, ...sql3,
  ...python, ...python2, ...numbered([...python3, ...python4], 'py', 24),
  ...numbered([...pycourse1, ...pycourse2, ...pycourse3, ...pybasic, ...pyfunc, ...pyfunc2, ...pyclass, ...pylater, ...pyproject, ...pyclass11, ...pyclass11b, ...pylambda], 'py', 128),
  ...ds, ...ds2, ...numbered(ds3, 'ds', 401), ...numbered(dsml, 'ds', 501), ...numbered(dsdl, 'ds', 601),
  ...r, ...r2, ...numbered([...r3, ...r4], 'r', 301), ...numbered(rmore, 'r', 501), ...numbered(rstats, 'r', 601),
];
