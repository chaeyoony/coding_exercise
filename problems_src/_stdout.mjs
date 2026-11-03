// 출력(print) 채점 문제 만들기 도우미.
// cases: [{ pre: '미리 주어질 코드' }, ...]  — 정답 출력(expected)은 build 때 정답 코드를 실행해서 자동으로 만든다.
// needs / forbids: [[정규식, 안내 메시지], ...] — 코드에 꼭 있어야/없어야 하는 것
export const o = ({ category, level, title, desc, solution, hint, cases, needs, forbids, singleCase, starter: starterOverride, track = 'python' }) => {
  const cs = cases.map(c => (typeof c === 'string' ? { pre: c } : c));
  const given = cs[0].pre
    ? '# 아래 코드는 미리 주어져 있어요. (채점할 때는 값이 달라질 수 있어요)\n' + cs[0].pre.split('\n').map(l => '# ' + l).join('\n') + '\n\n'
    : '';
  return {
    track, category, level, title, desc: desc, solution, hint, cases: cs,
    starter: starterOverride ?? (given + '# 여기에 코드를 작성하세요\n'),
    ...(needs ? { needs } : {}), ...(forbids ? { forbids } : {}), ...(singleCase ? { singleCase } : {}),
  };
};

// 출력 예측 문제: 코드가 보이고, 실행하면 무엇이 출력될지 직접 적는다. (정답은 코드를 실행해서 자동으로 만든다)
// explain: 풀고 나서 보는 해설
export const pr = ({ category, level, title, desc = '', code, explain, hint, track = 'python' }) => ({
  track, category, level, title, predict: true, code, starter: '',
  desc: desc || '<p>아래 코드를 실행하면 <b>무엇이 출력될까요?</b> 코드를 한 줄씩 따라가며 예상 출력을 적어 보세요. 여러 줄이면 줄을 바꿔서 적어요.</p>',
  solution: explain, hint: hint || '<p>코드를 위에서 아래로 한 줄씩 직접 따라가 보세요. 막히면 아래 "코드 실행해서 확인"으로 실제 결과를 볼 수 있어요.</p>',
});
