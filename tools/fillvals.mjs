// 사용법: node tools/fillvals.mjs build.log  → problems_src/rstats_values.mjs 에 "기대값 undefined" 로 나온 정답코드 값을 저장
import fs from 'node:fs';
const log = fs.readFileSync(process.argv[2], 'utf8').split('\n');
const file = new URL('../problems_src/' + (process.argv[3] || 'rstats_values.mjs'), import.meta.url);
const cur = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8').replace(/^export default /, '').replace(/;\s*$/, '')) : {};
let n = 0;
for (const l of log) {
  const m = l.match(/^    - 테스트 \d+ 불일치: (.*) → 정답코드 (.*) \/ 기대값 undefined$/);
  if (m) { cur[m[1]] = JSON.parse(m[2]); n++; }
}
fs.writeFileSync(file, 'export default ' + JSON.stringify(cur, null, 1) + ';\n');
console.log('채운 값', n, '전체', Object.keys(cur).length);
