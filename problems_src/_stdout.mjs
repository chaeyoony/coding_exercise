// 출력(print) 채점 문제 만들기 도우미.
// cases: [{ pre: '미리 주어질 코드' }, ...]  — 정답 출력(expected)은 build 때 정답 코드를 실행해서 자동으로 만든다.
// needs / forbids: [[정규식, 안내 메시지], ...] — 코드에 꼭 있어야/없어야 하는 것
export const o = ({ category, level, title, desc, solution, hint, cases, needs, forbids, singleCase, track = 'python' }) => {
  const cs = cases.map(c => (typeof c === 'string' ? { pre: c } : c));
  const given = cs[0].pre
    ? '# 아래 코드는 미리 주어져 있어요. (채점할 때는 값이 달라질 수 있어요)\n' + cs[0].pre.split('\n').map(l => '# ' + l).join('\n') + '\n\n'
    : '';
  return {
    track, category, level, title, desc: desc, solution, hint, cases: cs,
    starter: given + '# 여기에 코드를 작성하세요\n',
    ...(needs ? { needs } : {}), ...(forbids ? { forbids } : {}), ...(singleCase ? { singleCase } : {}),
  };
};
