// 클래스 이후의 파이썬 문법: 이터레이터·제너레이터 / 데코레이터·클로저 / 예외 처리 심화 / 모듈·표준 라이브러리 / 파일 입출력 / dataclass
// 모두 직접 코드를 짜는 문제이고, 채점은 만든 함수·클래스를 불러서 쓰는 식(테스트)으로 한다.
const IT = '이터레이터·제너레이터';
const DE = '데코레이터·클로저';
const EX = '예외 처리 심화';
const MO = '모듈·표준 라이브러리';
const FI = '파일 입출력';
const DC = 'dataclass·타입 힌트';

// 채점용 숨은 보조 코드
const SETUP = `import itertools


def raises(fn):
    try:
        fn()
    except Exception as e:
        return type(e).__name__
    return None


def err_msg(fn):
    try:
        fn()
    except Exception as e:
        return str(e)
    return None


def flaky(n_fail):
    state = {"n": 0}

    def f():
        state["n"] += 1
        if state["n"] <= n_fail:
            raise RuntimeError("fail")
        return "ok"

    return f


def counter_fn():
    state = {"n": 0}

    def f():
        state["n"] += 1
        return state["n"]

    return f


def memo_demo(deco):
    calls = []

    @deco
    def sq(x):
        calls.append(x)
        return x * x

    sq(2)
    sq(2)
    sq(3)
    sq(3)
    return calls


def sample():
    pass
`;

const t = (call, expected, visible = false) => ({ call, expected, visible });
const V = (...xs) => xs.map((x, i) => ({ ...x, visible: i < 2 }));
const w = (category, level, title, desc, starter, solution, hint, tests, extra = {}) => ({
  track: 'python', category, level, title, desc, starter, solution, hint, tests: V(...tests), setup: SETUP, ...extra,
});
const f = sig => `def ${sig}:\n    pass\n`;

export default [
  // ================= 이터레이터 · 제너레이터 =================
  w(IT, 2, '카운트다운 제너레이터', `<p><code>yield</code>를 사용하는 <b>제너레이터 함수</b> <code>countdown(n)</code>을 만드세요. <code>n</code>부터 1까지 차례로 <b>하나씩 내보내요</b>. (<code>n</code>이 0이면 아무것도 내보내지 않아요) 채점은 <code>list(countdown(3))</code> 처럼 리스트로 바꿔서 해요.</p>`,
    f('countdown(n)'), `def countdown(n):\n    while n >= 1:\n        yield n\n        n -= 1\n`,
    '<p><code>return</code> 대신 <code>yield 값</code>을 쓰면 값을 내보내고 잠시 멈췄다가, 다음 값을 요청받으면 이어서 실행돼요.</p>',
    [t('list(countdown(3))', [3, 2, 1]), t('list(countdown(1))', [1]), t('list(countdown(0))', []), t('list(countdown(5))', [5, 4, 3, 2, 1])]),
  w(IT, 2, '짝수 제너레이터', `<p><code>0</code>부터 <code>limit</code> <b>이하</b>의 짝수를 차례로 내보내는 제너레이터 <code>even_gen(limit)</code>을 만드세요. <code>limit</code>가 음수이면 아무것도 내보내지 않아요.</p>`,
    f('even_gen(limit)'), `def even_gen(limit):\n    n = 0\n    while n <= limit:\n        yield n\n        n += 2\n`,
    '<p>반복문 안에서 <code>yield</code>하면 값이 하나씩 나와요.</p>',
    [t('list(even_gen(10))', [0, 2, 4, 6, 8, 10]), t('list(even_gen(0))', [0]), t('list(even_gen(5))', [0, 2, 4]), t('list(even_gen(-1))', [])]),
  w(IT, 3, '끝없는 피보나치 제너레이터', `<p>피보나치 수(<code>0, 1, 1, 2, 3, 5, …</code>)를 <b>끝없이</b> 내보내는 제너레이터 <code>fib_gen()</code>을 만드세요. 제너레이터는 필요할 때만 값을 만들기 때문에 끝이 없어도 괜찮아요. 채점은 <code>itertools.islice</code>로 앞부분만 꺼내서 해요.</p>`,
    f('fib_gen()'), `def fib_gen():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n`,
    '<p><code>while True:</code> 안에서 <code>yield</code>하면 영원히 값을 내보내는 제너레이터가 돼요. 호출하는 쪽에서 필요한 만큼만 가져가요.</p>',
    [t('list(itertools.islice(fib_gen(), 8))', [0, 1, 1, 2, 3, 5, 8, 13]), t('list(itertools.islice(fib_gen(), 1))', [0]), t('next(fib_gen())', 0), t('list(itertools.islice(fib_gen(), 10))[-1]', 34)]),
  w(IT, 3, '앞에서 n개 가져오기', `<p>어떤 <b>반복 가능한 것</b>(리스트, 제너레이터, 끝없는 반복자 등)이든 받아서 <b>앞에서 n개</b>를 리스트로 돌려주는 함수 <code>take(iterable, n)</code>을 만드세요. 원소가 n개보다 적으면 있는 만큼만 돌려줘요. (<code>itertools.islice</code> 없이, <code>for</code>와 <code>break</code>로)</p>`,
    f('take(iterable, n)'), `def take(iterable, n):\n    result = []\n    if n <= 0:\n        return result\n    for x in iterable:\n        result.append(x)\n        if len(result) == n:\n            break\n    return result\n`,
    '<p>끝없는 반복자도 있으니, 필요한 개수를 채우면 바로 <code>break</code>해야 해요. n이 0일 때도 주의하세요.</p>',
    [t('take((x * x for x in range(100)), 4)', [0, 1, 4, 9]), t('take(itertools.count(1), 3)', [1, 2, 3]), t('take([1, 2], 5)', [1, 2]), t('take([], 2)', []), t('take([1, 2, 3], 0)', [])]),
  w(IT, 3, '반복자 클래스: __iter__와 __next__', `<p><code>Countdown(n)</code> 클래스를 만드세요. <code>for</code>로 돌면 <code>n, n-1, …, 1</code>이 차례로 나오는 <b>반복자(iterator)</b>예요.</p><ul><li><code>__iter__(self)</code> — 자기 자신(<code>self</code>)을 돌려줘요</li><li><code>__next__(self)</code> — 다음 값을 돌려주고, 더 줄 게 없으면 <code>StopIteration</code>을 일으켜요</li></ul><p>반복자는 한 번 다 쓰면 비어요. 같은 객체로 두 번 돌면 두 번째는 아무것도 나오지 않아요.</p>`,
    `class Countdown:\n    pass\n`, `class Countdown:\n    def __init__(self, n):\n        self.n = n\n\n    def __iter__(self):\n        return self\n\n    def __next__(self):\n        if self.n < 1:\n            raise StopIteration\n        value = self.n\n        self.n -= 1\n        return value\n`,
    '<p><code>for x in 객체</code> 는 먼저 <code>iter(객체)</code>(= <code>__iter__</code>)를 부르고, 끝날 때까지 <code>__next__</code>를 반복 호출해요. <code>StopIteration</code>이 "끝"의 신호예요.</p>',
    [t('list(Countdown(3))', [3, 2, 1]), t('list(Countdown(0))', []), t('(lambda c: [list(c), list(c)])(Countdown(2))', [[2, 1], []]), t('[x * 2 for x in Countdown(3)]', [6, 4, 2])]),
  w(IT, 2, '제너레이터 표현식으로 제곱의 합', `<p><code>1² + 2² + … + n²</code>을 구하는 함수 <code>sum_squares(n)</code>을 <b>제너레이터 표현식</b> <code>(식 for 변수 in 범위)</code>과 <code>sum</code>으로 만드세요. <code>n</code>이 0이면 0이에요.</p>`,
    f('sum_squares(n)'), `def sum_squares(n):\n    return sum(i * i for i in range(1, n + 1))\n`,
    '<p>리스트 컴프리헨션 <code>[...]</code> 와 달리 <code>(...)</code> 는 리스트를 미리 만들지 않고 하나씩 계산해서 메모리를 아껴요. <code>sum( )</code> 안에서는 바깥 괄호를 생략할 수 있어요.</p>',
    [t('sum_squares(3)', 14), t('sum_squares(0)', 0), t('sum_squares(10)', 385), t('sum_squares(1)', 1)]),
  w(IT, 4, '중첩 리스트 펼치기 (yield from)', `<p>리스트 안에 리스트가 <b>몇 겹이든</b> 들어 있을 때, 모든 값을 <b>하나씩 내보내는</b> 제너레이터 <code>flatten_gen(nested)</code>를 만드세요. 값의 순서는 그대로예요. 안쪽 리스트를 처리할 때는 <code>yield from</code>을 써 보세요.</p>`,
    f('flatten_gen(nested)'), `def flatten_gen(nested):\n    for item in nested:\n        if isinstance(item, list):\n            yield from flatten_gen(item)\n        else:\n            yield item\n`,
    '<p><code>yield from 반복가능한것</code> 은 그 안의 값을 하나씩 대신 내보내 줘요. 재귀와 함께 쓰면 깔끔해요.</p>',
    [t('list(flatten_gen([1, [2, [3, 4]], 5]))', [1, 2, 3, 4, 5]), t('list(flatten_gen([]))', []), t('list(flatten_gen([[1], [2, [3]]]))', [1, 2, 3]), t('list(flatten_gen(["a", ["b"]]))', ['a', 'b'])]),
  w(IT, 3, '리스트를 n개씩 끊어 내기', `<p>리스트를 <b>길이 n짜리 덩어리</b>로 나눠 하나씩 내보내는 제너레이터 <code>chunks(lst, n)</code>를 만드세요. 마지막 덩어리는 n개보다 짧을 수 있어요. 예: <code>chunks([1,2,3,4,5], 2)</code> → <code>[1,2]</code>, <code>[3,4]</code>, <code>[5]</code></p>`,
    f('chunks(lst, n)'), `def chunks(lst, n):\n    for i in range(0, len(lst), n):\n        yield lst[i:i + n]\n`,
    '<p><code>range(0, 길이, n)</code> 은 0, n, 2n, … 으로 건너뛰고, 슬라이싱 <code>lst[i:i+n]</code> 으로 덩어리를 잘라요.</p>',
    [t('list(chunks([1, 2, 3, 4, 5], 2))', [[1, 2], [3, 4], [5]]), t('list(chunks([], 3))', []), t('list(chunks([1, 2], 5))', [[1, 2]]), t('list(chunks([1, 2, 3], 1))', [[1], [2], [3]])]),
  w(IT, 3, '이웃한 두 값 짝짓기', `<p>리스트에서 <b>이웃한 두 값</b>을 <code>(앞, 뒤)</code> 튜플로 차례로 내보내는 제너레이터 <code>pairwise(lst)</code>를 만드세요. 예: <code>[1, 2, 3]</code> → <code>(1, 2)</code>, <code>(2, 3)</code>. 원소가 2개 미만이면 아무것도 내보내지 않아요.</p>`,
    f('pairwise(lst)'), `def pairwise(lst):\n    for i in range(len(lst) - 1):\n        yield (lst[i], lst[i + 1])\n`,
    '<p>인덱스 <code>i</code>와 <code>i + 1</code>을 함께 써요. 마지막 원소는 짝이 없어서 <code>len(lst) - 1</code>까지만 돌아요.</p>',
    [t('list(pairwise([1, 2, 3]))', [[1, 2], [2, 3]]), t('list(pairwise([1]))', []), t('list(pairwise([]))', []), t('list(pairwise(["a", "b", "c", "d"]))', [['a', 'b'], ['b', 'c'], ['c', 'd']])]),
  w(IT, 3, '이동 평균을 내보내는 제너레이터', `<p>숫자 리스트를 받아, <b>앞에서부터 지금까지의 평균</b>을 하나씩 내보내는 제너레이터 <code>running_average(nums)</code>를 만드세요. 각 평균은 <b>소수 둘째 자리까지 반올림</b>해요. 예: <code>[2, 4, 6]</code> → <code>2, 3, 4</code></p>`,
    f('running_average(nums)'), `def running_average(nums):\n    total = 0\n    for i, x in enumerate(nums, start=1):\n        total += x\n        yield round(total / i, 2)\n`,
    '<p>합계를 계속 더해 가면서, 지금까지 본 개수로 나눠요. <code>enumerate(nums, start=1)</code> 이 개수를 세 줘요.</p>',
    [t('list(running_average([2, 4, 6]))', [2, 3, 4]), t('list(running_average([10]))', [10]), t('list(running_average([1, 2]))', [1, 1.5]), t('list(running_average([]))', [])]),
  w(IT, 3, '처음 나온 값만 내보내기', `<p>반복 가능한 것을 받아, <b>처음 나온 값만</b> 처음 나온 순서대로 내보내는 제너레이터 <code>unique_gen(items)</code>를 만드세요. 이미 내보낸 값은 건너뛰어요. (집합으로 "본 값"을 기억하세요)</p>`,
    f('unique_gen(items)'), `def unique_gen(items):\n    seen = set()\n    for x in items:\n        if x not in seen:\n            seen.add(x)\n            yield x\n`,
    '<p>집합에서 <code>in</code> 검사는 매우 빨라요. 처음 보는 값만 <code>seen</code>에 넣고 <code>yield</code>해요.</p>',
    [t('list(unique_gen([3, 1, 3, 2, 1]))', [3, 1, 2]), t('list(unique_gen([]))', []), t('list(unique_gen("aabb"))', ['a', 'b']), t('list(unique_gen([1, 1, 1]))', [1])]),
  w(IT, 2, '값이 있는 모든 위치 (enumerate)', `<p>반복 가능한 것(리스트, 문자열 등)에서 값 <code>x</code>가 나오는 <b>모든 위치(인덱스)</b>를 리스트로 돌려주는 함수 <code>index_of_all(seq, x)</code>를 만드세요. <code>enumerate</code>를 사용해 보세요.</p>`,
    f('index_of_all(seq, x)'), `def index_of_all(seq, x):\n    return [i for i, v in enumerate(seq) if v == x]\n`,
    '<p><code>enumerate(seq)</code> 는 (위치, 값) 쌍을 차례로 내보내요. <code>for i, v in enumerate(seq)</code> 로 풀어 받아요.</p>',
    [t('index_of_all([1, 2, 1, 3, 1], 1)', [0, 2, 4]), t('index_of_all([], 1)', []), t('index_of_all([1, 2], 9)', []), t('index_of_all("banana", "a")', [1, 3, 5])]),

  // ================= 데코레이터 · 클로저 =================
  w(DE, 3, '결과를 대문자로 바꾸는 데코레이터', `<p>함수를 받아 <b>새 함수를 돌려주는 함수</b>(데코레이터) <code>shout(func)</code>를 만드세요. 새 함수는 원래 함수를 그대로 호출(인수는 모두 전달)하되, <b>결과 문자열을 대문자로</b> 바꿔서 돌려줘요.</p><p>예: <code>shout(lambda name: "hi " + name)("ann")</code> → <code>"HI ANN"</code></p><p class="muted">보통은 <code>@shout</code>를 함수 위에 붙여 쓰는데, 채점에서는 <code>shout(함수)</code>로 직접 불러요.</p>`,
    f('shout(func)'), `def shout(func):\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs).upper()\n    return wrapper\n`,
    '<p>안쪽 함수(<code>wrapper</code>)가 원래 함수를 부르고 결과를 가공해요. 인수를 몇 개 받든 전달하려면 <code>*args, **kwargs</code>를 써요. 마지막에 <code>return wrapper</code>(괄호 없이).</p>',
    [t('shout(lambda name: "hi " + name)("ann")', 'HI ANN'), t('shout(lambda: "a")()', 'A'), t('shout(lambda a, b: a + b)("x", "y")', 'XY'), t('shout(lambda s, times=1: s * times)("ab", times=2)', 'ABAB')]),
  w(DE, 3, '호출 횟수를 세는 데코레이터', `<p>함수를 받아, <b>몇 번 호출됐는지</b> 세는 새 함수를 돌려주는 데코레이터 <code>count_calls(func)</code>를 만드세요. 돌려준 함수는 원래 결과를 그대로 돌려주고, <b>속성 <code>calls</code></b>에 호출 횟수(처음 0)를 저장해야 해요.</p>`,
    f('count_calls(func)'), `def count_calls(func):\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return func(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n`,
    '<p>함수도 객체라서 <code>wrapper.calls = 0</code> 처럼 속성을 붙일 수 있어요. 호출될 때마다 <code>wrapper.calls += 1</code>.</p>',
    [t('(lambda f: (f(), f(), f(), f.calls)[3])(count_calls(lambda: 1))', 3), t('count_calls(lambda x: x * 2)(5)', 10), t('count_calls(lambda: 0).calls', 0), t('(lambda f: (f(1), f(2), f.calls))(count_calls(lambda x: x))[2]', 2)]),
  w(DE, 3, '호출 기록을 남기는 데코레이터', `<p>함수를 받아 새 함수를 돌려주는 데코레이터 <code>log_calls(func)</code>를 만드세요. 돌려준 함수는 원래 결과를 돌려주고, <b>속성 <code>history</code></b>(처음엔 빈 리스트)에 <b>호출할 때 준 위치 인수들을 튜플</b>로 차례로 기록해요.</p><p>예: <code>f(1, 2)</code>, <code>f(3, 4)</code> 호출 뒤 <code>f.history</code> → <code>[(1, 2), (3, 4)]</code></p>`,
    f('log_calls(func)'), `def log_calls(func):\n    def wrapper(*args):\n        wrapper.history.append(args)\n        return func(*args)\n    wrapper.history = []\n    return wrapper\n`,
    '<p><code>*args</code>는 받은 위치 인수들을 튜플로 모아 줘서, 그대로 기록하면 돼요.</p>',
    [t('(lambda f: (f(1, 2), f(3, 4), f.history)[2])(log_calls(lambda a, b: a + b))', [[1, 2], [3, 4]]), t('log_calls(lambda a, b: a + b)(1, 2)', 3), t('log_calls(lambda: 0).history', []), t('(lambda f: (f("x"), f.history)[1])(log_calls(lambda s: s))', [['x']])]),
  w(DE, 4, '인수를 받는 데코레이터 (repeat)', `<p>횟수 <code>n</code>을 받는 데코레이터 <b>공장</b> <code>repeat(n)</code>을 만드세요. <code>repeat(n)(func)</code> 으로 만든 함수는 원래 함수를 <b>n번 호출</b>하고, 결과들을 <b>리스트</b>로 돌려줘요. 호출할 때 받은 인수는 매번 그대로 전달해요.</p><p>예: <code>repeat(3)(lambda: "a")()</code> → <code>["a", "a", "a"]</code></p>`,
    f('repeat(n)'), `def repeat(n):\n    def decorator(func):\n        def wrapper(*args, **kwargs):\n            return [func(*args, **kwargs) for _ in range(n)]\n        return wrapper\n    return decorator\n`,
    '<p>3겹이에요: 바깥 함수(<code>repeat</code>)는 <code>n</code>을 받고 → 데코레이터(<code>decorator</code>)를 돌려주고 → 그것이 함수를 받아 <code>wrapper</code>를 돌려줘요. <code>@repeat(3)</code> 처럼 쓰는 것이 바로 이 구조예요.</p>',
    [t('repeat(3)(lambda: "a")()', ['a', 'a', 'a']), t('repeat(0)(lambda: 1)()', []), t('repeat(2)(lambda x: x * 2)(5)', [10, 10]), t('repeat(1)(lambda a, b: a + b)(1, 2)', [3])]),
  w(DE, 4, '계산 결과를 기억하는 데코레이터 (memoize)', `<p>같은 인수로 다시 호출하면 <b>계산하지 않고 저장해 둔 결과</b>를 돌려주는 데코레이터 <code>memoize(func)</code>를 만드세요. 인수는 하나의 값(해시 가능)이라고 가정해요.</p><p class="muted">채점: <code>memo_demo(memoize)</code>가 <code>2, 2, 3, 3</code>으로 함수를 4번 호출했을 때 <b>실제로 계산한 인수의 목록</b>을 돌려줘요. 기억을 잘 한다면 <code>[2, 3]</code>이 되어야 해요.</p>`,
    f('memoize(func)'), `def memoize(func):\n    cache = {}\n\n    def wrapper(x):\n        if x not in cache:\n            cache[x] = func(x)\n        return cache[x]\n\n    return wrapper\n`,
    '<p>딕셔너리 <code>cache</code>에 "인수 → 결과"를 저장해 두고, 이미 있으면 함수를 부르지 않고 꺼내요. <code>cache</code>는 <code>wrapper</code> 바깥에 둬야 호출 사이에 유지돼요(클로저).</p>',
    [t('memo_demo(memoize)', [2, 3]), t('memoize(lambda x: x + 1)(5)', 6), t('(lambda f: [f(2), f(2)])(memoize(lambda x: x * 10))', [20, 20]), t('(lambda f: [f("a"), f("b")])(memoize(lambda s: s.upper()))', ['A', 'B'])]),
  w(DE, 3, '음수 인수를 막는 데코레이터', `<p>함수를 받아, 호출할 때 <b>인수 중 하나라도 0보다 작으면 <code>ValueError</code></b>를 일으키고, 아니면 원래 함수를 호출해 결과를 돌려주는 데코레이터 <code>validate_non_negative(func)</code>를 만드세요. (위치 인수만 검사)</p>`,
    f('validate_non_negative(func)'), `def validate_non_negative(func):\n    def wrapper(*args):\n        for a in args:\n            if a < 0:\n                raise ValueError("음수는 안 돼요")\n        return func(*args)\n    return wrapper\n`,
    '<p>원래 함수를 부르기 <b>전에</b> 인수를 검사하고, 문제가 있으면 <code>raise</code>해요.</p>',
    [t('validate_non_negative(lambda x: x * 2)(3)', 6), t('raises(lambda: validate_non_negative(lambda x: x)(-1))', 'ValueError'), t('validate_non_negative(lambda x: x)(0)', 0), t('raises(lambda: validate_non_negative(lambda a, b: a + b)(1, -2))', 'ValueError')]),
  w(DE, 4, '함수 이름을 지켜 주는 데코레이터 (wraps)', `<p>데코레이터를 쓰면 원래 함수의 <code>__name__</code> 같은 정보가 <code>wrapper</code>로 바뀌어 버려요. <code>functools.wraps</code>를 이용해 <b>이름이 유지되는</b> 데코레이터 <code>preserve_name(func)</code>를 만드세요. 돌려준 함수는 원래 함수를 그대로 호출해 결과를 돌려줘요.</p>`,
    f('preserve_name(func)'), `from functools import wraps\n\n\ndef preserve_name(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n`,
    '<p><code>wrapper</code> 위에 <code>@wraps(func)</code> 를 붙이면 이름, 설명 등을 원래 함수에서 복사해 줘요.</p>',
    [t('preserve_name(sample).__name__', 'sample'), t('preserve_name(lambda: 5)()', 5), t('preserve_name(lambda a, b: a * b)(3, 4)', 12), t('preserve_name(sample)()', null)]),
  w(DE, 3, '누적하는 함수 만들기 (클로저)', `<p><code>make_accumulator(start)</code>는 함수를 돌려줘요. 그 함수에 수를 주면 <b>지금까지의 합계(시작값 포함)</b>를 돌려줘야 해요. 만든 함수마다 합계는 따로 관리돼요.</p><p>예: <code>acc = make_accumulator(100)</code> 후 <code>acc(5)</code> → <code>105</code>, <code>acc(10)</code> → <code>115</code></p>`,
    f('make_accumulator(start)'), `def make_accumulator(start):\n    total = start\n\n    def add(x):\n        nonlocal total\n        total += x\n        return total\n\n    return add\n`,
    '<p>안쪽 함수가 바깥 변수 <code>total</code>을 <b>바꾸려면</b> <code>nonlocal total</code> 선언이 필요해요.</p>',
    [t('(lambda a: [a(5), a(10), a(-3)])(make_accumulator(100))', [105, 115, 112]), t('make_accumulator(0)(1)', 1), t('(lambda a, b: [a(1), b(1), a(1)])(make_accumulator(0), make_accumulator(10))', [1, 11, 2]), t('make_accumulator(5)(0)', 5)]),
  w(DE, 3, '함수 여러 개를 이어 붙이기', `<p>함수들을 받아, <b>앞에서부터 차례로 적용</b>하는 새 함수를 돌려주는 <code>compose_all(*funcs)</code>를 만드세요. <code>compose_all(f, g, h)(x)</code> 는 <code>h(g(f(x)))</code>예요. 함수를 하나도 안 주면 받은 값을 그대로 돌려줘요.</p>`,
    f('compose_all(*funcs)'), `def compose_all(*funcs):\n    def composed(x):\n        for fn in funcs:\n            x = fn(x)\n        return x\n    return composed\n`,
    '<p>안쪽 함수가 <code>funcs</code>를 순서대로 돌며 결과를 다시 <code>x</code>에 담아요.</p>',
    [t('compose_all(lambda x: x + 1, lambda x: x * 2)(3)', 8), t('compose_all()(5)', 5), t('compose_all(str, len)(12345)', 5), t('compose_all(lambda s: s.strip(), str.upper)("  hi ")', 'HI')]),
  w(DE, 4, '처음 한 번만 실행하는 데코레이터 (once)', `<p>함수를 받아, <b>처음 호출했을 때만 실제로 실행</b>하고 그 결과를 저장해 두었다가, 이후 호출에는 <b>저장한 결과만</b> 돌려주는 데코레이터 <code>once(func)</code>를 만드세요. (인수 없는 함수라고 가정)</p>`,
    f('once(func)'), `def once(func):\n    state = {"done": False, "value": None}\n\n    def wrapper():\n        if not state["done"]:\n            state["value"] = func()\n            state["done"] = True\n        return state["value"]\n\n    return wrapper\n`,
    '<p>"이미 실행했는가"와 "결과"를 딕셔너리(또는 <code>nonlocal</code> 변수)에 기억해 두세요.</p>',
    [t('(lambda f: [f(), f(), f()])(once(counter_fn()))', [1, 1, 1]), t('once(lambda: 42)()', 42), t('(lambda f: (f(), f()))(once(lambda: "x"))', ['x', 'x']), t('(lambda c: (c(), c(), c())[2])(counter_fn())', 3)]),

  // ================= 예외 처리 심화 =================
  w(EX, 3, '나만의 예외 클래스', `<p>두 가지를 만드세요.</p><ol><li>예외 클래스 <code>InsufficientFunds</code> (<code>Exception</code>을 상속)</li><li>함수 <code>withdraw(balance, amount)</code> — 잔액이 충분하면 <b>남은 잔액</b>을 돌려주고, 부족하면 <code>InsufficientFunds</code>를 일으켜요. 오류 메시지는 정확히 <code>"잔액 부족: 잔액 10 < 출금 20"</code> 형태예요 (잔액과 출금액을 넣어서).</li></ol>`,
    `class InsufficientFunds:\n    pass\n\n\ndef withdraw(balance, amount):\n    pass\n`,
    `class InsufficientFunds(Exception):\n    pass\n\n\ndef withdraw(balance, amount):\n    if amount > balance:\n        raise InsufficientFunds(f"잔액 부족: 잔액 {balance} < 출금 {amount}")\n    return balance - amount\n`,
    '<p>예외 클래스는 <code>class 이름(Exception):</code> 로 만들고 몸체는 <code>pass</code>여도 돼요. <code>raise 이름("메시지")</code> 로 일으켜요. 시작 코드의 <code>class InsufficientFunds:</code> 를 <code>(Exception)</code> 상속으로 고치세요.</p>',
    [t('withdraw(30, 20)', 10), t('raises(lambda: withdraw(10, 20))', 'InsufficientFunds'), t('err_msg(lambda: withdraw(10, 20))', '잔액 부족: 잔액 10 < 출금 20'), t('issubclass(InsufficientFunds, Exception)', true), t('withdraw(5, 5)', 0)]),
  w(EX, 3, '여러 종류의 오류 처리', `<p>값을 정수로 바꿔 돌려주는 함수 <code>safe_convert(x)</code>를 만드세요. 바꿀 수 없으면 <code>None</code>을 돌려줘요. <code>int(x)</code>는 문자열이 숫자 모양이 아니면 <code>ValueError</code>, <code>None</code> 같은 엉뚱한 타입이면 <code>TypeError</code>가 나요. <b>두 오류를 한 번에</b> 처리하세요.</p>`,
    f('safe_convert(x)'), `def safe_convert(x):\n    try:\n        return int(x)\n    except (ValueError, TypeError):\n        return None\n`,
    '<p>여러 오류를 한 번에 잡으려면 튜플로 묶어요: <code>except (ValueError, TypeError):</code></p>',
    [t('safe_convert("12")', 12), t('safe_convert("a")', null), t('safe_convert(None)', null), t('safe_convert(3.9)', 3), t('safe_convert("3.5")', null)]),
  w(EX, 3, 'try · except · else · finally의 순서', `<p>함수 <code>run(fail)</code>을 만드세요. 빈 리스트 <code>log</code>를 만들고 아래 순서로 문자열을 기록한 뒤 <code>log</code>를 돌려줘요.</p><ul><li><code>try</code> 블록 시작에서 <code>"try"</code> 기록. <code>fail</code>이 <code>True</code>이면 <code>ValueError</code>를 일으키고, 아니면 <code>"ok"</code> 기록</li><li><code>except ValueError</code>: <code>"error"</code> 기록</li><li><code>else</code>(오류가 없었을 때만): <code>"else"</code> 기록</li><li><code>finally</code>(항상): <code>"finally"</code> 기록</li></ul>`,
    f('run(fail)'), `def run(fail):\n    log = []\n    try:\n        log.append("try")\n        if fail:\n            raise ValueError\n        log.append("ok")\n    except ValueError:\n        log.append("error")\n    else:\n        log.append("else")\n    finally:\n        log.append("finally")\n    return log\n`,
    '<p><code>else</code>는 <code>except</code> 뒤에 오고 "오류가 없었을 때" 실행돼요. <code>finally</code>는 맨 마지막에 오고 <b>언제나</b> 실행돼요.</p>',
    [t('run(True)', ['try', 'error', 'finally']), t('run(False)', ['try', 'ok', 'else', 'finally']), t('len(run(True))', 3), t('run(False)[-1]', 'finally')]),
  w(EX, 3, '오류를 다시 일으키며 메시지 바꾸기', `<p>문자열에서 나이를 읽는 함수 <code>parse_age(text)</code>를 만드세요.</p><ul><li><code>int(text)</code>가 실패하면 <code>ValueError("나이는 숫자여야 해요")</code>를 일으켜요</li><li>정수가 음수이면 <code>ValueError("나이는 0 이상이어야 해요")</code>를 일으켜요</li><li>그 외에는 정수를 돌려줘요 (앞뒤 공백은 <code>int</code>가 알아서 무시해요)</li></ul>`,
    f('parse_age(text)'), `def parse_age(text):\n    try:\n        age = int(text)\n    except ValueError:\n        raise ValueError("나이는 숫자여야 해요")\n    if age < 0:\n        raise ValueError("나이는 0 이상이어야 해요")\n    return age\n`,
    '<p><code>except</code> 안에서 새 예외를 <code>raise</code>하면 사용자에게 더 알기 쉬운 메시지를 줄 수 있어요.</p>',
    [t('parse_age("20")', 20), t('err_msg(lambda: parse_age("abc"))', '나이는 숫자여야 해요'), t('err_msg(lambda: parse_age("-5"))', '나이는 0 이상이어야 해요'), t('parse_age(" 7 ")', 7)]),
  w(EX, 4, '실패하면 다시 시도하기 (retry)', `<p>함수 <code>retry(func, times)</code>를 만드세요. 인수 없는 함수 <code>func</code>를 호출해서 <b>성공하면 그 결과</b>를 돌려주고, 오류가 나면 <b>최대 <code>times</code>번까지</b> 다시 시도해요. <code>times</code>번 모두 실패하면 <b>마지막 오류를 그대로 일으켜요</b>.</p><p class="muted">채점용 <code>flaky(n)</code>은 처음 n번은 <code>RuntimeError</code>를 내고 그 뒤에는 <code>"ok"</code>를 돌려주는 함수를 만들어요.</p>`,
    f('retry(func, times)'), `def retry(func, times):\n    last = None\n    for _ in range(times):\n        try:\n            return func()\n        except Exception as e:\n            last = e\n    raise last\n`,
    '<p>반복문 안에서 <code>try</code>로 호출하고, 성공하면 바로 <code>return</code>해요. 마지막 오류를 변수에 저장해 두었다가 반복이 끝나면 <code>raise 변수</code>로 다시 일으켜요.</p>',
    [t('retry(flaky(2), 3)', 'ok'), t('raises(lambda: retry(flaky(5), 3))', 'RuntimeError'), t('retry(flaky(0), 1)', 'ok'), t('retry(flaky(1), 2)', 'ok')]),
  w(EX, 2, 'assert로 조건 검사하기', `<p><code>check_positive(n)</code>을 만드세요. <code>n</code>이 <b>0보다 크면 <code>n</code>을 그대로</b> 돌려주고, 아니면 <code>assert</code> 문 때문에 <code>AssertionError</code>가 나야 해요. (반드시 <code>assert</code>를 사용)</p>`,
    f('check_positive(n)'), `def check_positive(n):\n    assert n > 0, "양수여야 해요"\n    return n\n`,
    '<p><code>assert 조건, 메시지</code> 는 조건이 거짓이면 <code>AssertionError</code>를 일으켜요. 프로그램이 맞게 동작하는지 점검할 때 써요.</p>',
    [t('check_positive(5)', 5), t('raises(lambda: check_positive(0))', 'AssertionError'), t('raises(lambda: check_positive(-3))', 'AssertionError'), t('check_positive(0.1)', 0.1)],
    { needs: [['assert\\s', 'assert 문을 사용해야 해요']] }),
  w(EX, 3, '오류 종류에 따라 설명 돌려주기', `<p>인수 없는 함수 <code>func</code>를 호출해 보고 결과를 <b>문자열</b>로 알려 주는 함수 <code>describe_error(func)</code>를 만드세요.</p><ul><li>오류가 없으면 <code>"정상"</code></li><li><code>ZeroDivisionError</code> → <code>"0으로 나눔"</code></li><li><code>ValueError</code> → <code>"값 오류"</code></li><li><code>KeyError</code> → <code>"키 없음"</code></li><li>그 밖의 모든 오류 → <code>"기타"</code></li></ul>`,
    f('describe_error(func)'), `def describe_error(func):\n    try:\n        func()\n    except ZeroDivisionError:\n        return "0으로 나눔"\n    except ValueError:\n        return "값 오류"\n    except KeyError:\n        return "키 없음"\n    except Exception:\n        return "기타"\n    return "정상"\n`,
    '<p><code>except</code>를 여러 개 이어 쓸 수 있고, 위에서부터 차례로 맞는 것을 찾아요. 가장 넓은 <code>Exception</code>은 맨 마지막에 둬요.</p>',
    [t('describe_error(lambda: 1 / 0)', '0으로 나눔'), t('describe_error(lambda: int("x"))', '값 오류'), t('describe_error(lambda: {}["k"])', '키 없음'), t('describe_error(lambda: [][1])', '기타'), t('describe_error(lambda: 5)', '정상')]),

  // ================= 모듈 · 표준 라이브러리 =================
  w(MO, 3, '가장 많이 나온 단어 (Counter)', `<p>문장에서 가장 많이 나온 단어 상위 <code>n</code>개를 <code>(단어, 횟수)</code> 쌍의 리스트로 돌려주는 함수 <code>top_words(text, n)</code>을 만드세요. 소문자로 통일하고 공백으로 나눠요. 횟수가 같으면 <b>먼저 나온 단어가 앞</b>에 와요. <code>collections.Counter</code>의 <code>most_common</code>을 써 보세요.</p>`,
    f('top_words(text, n)'), `from collections import Counter\n\n\ndef top_words(text, n):\n    return Counter(text.lower().split()).most_common(n)\n`,
    '<p><code>Counter(리스트)</code> 는 값별 개수를 세는 딕셔너리예요. <code>most_common(n)</code>은 많은 순서로 (값, 개수)를 돌려줘요. 같은 횟수는 처음 나온 순서가 유지돼요.</p>',
    [t('top_words("a b a c b a", 2)', [['a', 3], ['b', 2]]), t('top_words("x y", 5)', [['x', 1], ['y', 1]]), t('top_words("Go go GO stop", 1)', [['go', 3]]), t('top_words("", 3)', [])]),
  w(MO, 3, '단어가 나온 위치 모으기 (defaultdict)', `<p>문장을 공백으로 나눈 뒤, <b>각 단어가 나온 위치(0부터)</b>를 리스트로 모은 딕셔너리를 돌려주는 함수 <code>index_words(text)</code>를 만드세요. 예: <code>"a b a"</code> → <code>{"a": [0, 2], "b": [1]}</code> (<code>collections.defaultdict</code>를 써 보세요)</p>`,
    f('index_words(text)'), `from collections import defaultdict\n\n\ndef index_words(text):\n    result = defaultdict(list)\n    for i, w in enumerate(text.split()):\n        result[w].append(i)\n    return dict(result)\n`,
    '<p><code>defaultdict(list)</code> 는 없는 키를 읽으면 자동으로 빈 리스트를 만들어 줘서, <code>if key not in d</code> 확인이 필요 없어요. 마지막에 일반 <code>dict</code>로 바꿔 돌려주세요.</p>',
    [t('index_words("a b a")', { a: [0, 2], b: [1] }), t('index_words("")', {}), t('index_words("x")', { x: [0] }), t('index_words("go go go")', { go: [0, 1, 2] })]),
  w(MO, 2, '마지막 n개만 기억하기 (deque)', `<p>리스트의 <b>마지막 n개</b>를 리스트로 돌려주는 함수 <code>last_n(items, n)</code>을 만드세요. <code>collections.deque(maxlen=n)</code>을 이용해 보세요. 원소가 n개보다 적으면 모두 돌려주고, <code>n</code>이 0이면 빈 리스트예요.</p>`,
    f('last_n(items, n)'), `from collections import deque\n\n\ndef last_n(items, n):\n    d = deque(maxlen=n)\n    for x in items:\n        d.append(x)\n    return list(d)\n`,
    '<p><code>deque(maxlen=n)</code> 는 n개가 넘으면 오래된 것부터 자동으로 밀어내요.</p>',
    [t('last_n([1, 2, 3, 4, 5], 3)', [3, 4, 5]), t('last_n([1], 3)', [1]), t('last_n([], 2)', []), t('last_n([1, 2, 3], 0)', [])]),
  w(MO, 2, '두 개씩 짝짓기 (itertools)', `<p>리스트에서 <b>서로 다른 두 원소를 뽑는 모든 경우</b>(순서 무관, 중복 없음)를 리스트로 돌려주는 함수 <code>all_pairs(items)</code>를 만드세요. 예: <code>[1, 2, 3]</code> → <code>[(1, 2), (1, 3), (2, 3)]</code> (<code>itertools.combinations</code>)</p>`,
    f('all_pairs(items)'), `from itertools import combinations\n\n\ndef all_pairs(items):\n    return list(combinations(items, 2))\n`,
    '<p><code>combinations(리스트, 2)</code> 는 두 개씩 뽑은 조합을 차례로 만들어 줘요. 결과를 <code>list( )</code>로 감싸세요.</p>',
    [t('all_pairs([1, 2, 3])', [[1, 2], [1, 3], [2, 3]]), t('all_pairs([1])', []), t('all_pairs(["a", "b"])', [['a', 'b']]), t('len(all_pairs([1, 2, 3, 4]))', 6)]),
  w(MO, 3, '주사위 두 개의 경우의 수 (product)', `<p>주사위 2개(각각 1~6)를 던져 <b>눈의 합이 <code>total</code>이 되는 경우의 수</b>를 돌려주는 함수 <code>ways_to_roll(total)</code>을 만드세요. 예: 합이 7이면 6가지. (<code>itertools.product</code>로 모든 조합을 만들어 세어 보세요)</p>`,
    f('ways_to_roll(total)'), `from itertools import product\n\n\ndef ways_to_roll(total):\n    count = 0\n    for a, b in product(range(1, 7), repeat=2):\n        if a + b == total:\n            count += 1\n    return count\n`,
    '<p><code>product(range(1, 7), repeat=2)</code> 는 (1,1), (1,2), …, (6,6) 36가지를 모두 만들어 줘요.</p>',
    [t('ways_to_roll(7)', 6), t('ways_to_roll(2)', 1), t('ways_to_roll(12)', 1), t('ways_to_roll(13)', 0), t('ways_to_roll(5)', 4)]),
  w(MO, 2, '모두 곱하기 (functools.reduce)', `<p>숫자 리스트의 <b>모든 원소의 곱</b>을 <code>functools.reduce</code>로 구하는 함수 <code>product_all(nums)</code>를 만드세요. 빈 리스트는 <code>1</code>이에요.</p>`,
    f('product_all(nums)'), `from functools import reduce\n\n\ndef product_all(nums):\n    return reduce(lambda a, b: a * b, nums, 1)\n`,
    '<p><code>reduce(함수, 리스트, 시작값)</code> 은 원소를 하나씩 합쳐 하나의 값으로 만들어요.</p>',
    [t('product_all([1, 2, 3, 4])', 24), t('product_all([])', 1), t('product_all([5])', 5), t('product_all([2, -3])', -6)]),
  w(MO, 2, '빗변의 길이 (math)', `<p>직각삼각형의 두 변 <code>a</code>, <code>b</code>가 주어질 때 <b>빗변의 길이</b>를 <b>소수 둘째 자리까지 반올림</b>해 돌려주는 함수 <code>hypotenuse(a, b)</code>를 만드세요. (<code>math.sqrt</code> 또는 <code>math.hypot</code>)</p>`,
    f('hypotenuse(a, b)'), `import math\n\n\ndef hypotenuse(a, b):\n    return round(math.sqrt(a * a + b * b), 2)\n`,
    '<p><code>import math</code> 를 파일 맨 위에 쓰고 <code>math.sqrt(...)</code>를 써요.</p>',
    [t('hypotenuse(3, 4)', 5), t('hypotenuse(1, 1)', 1.41), t('hypotenuse(5, 12)', 13), t('hypotenuse(0, 0)', 0)]),
  w(MO, 2, '평균과 중앙값 (statistics)', `<p>점수 리스트(비어 있지 않아요)의 <b>[평균, 중앙값]</b>을 돌려주는 함수 <code>score_stats(scores)</code>를 만드세요. 평균은 <b>소수 둘째 자리까지 반올림</b>해요. <code>statistics</code> 모듈의 <code>mean</code>, <code>median</code>을 써 보세요.</p>`,
    f('score_stats(scores)'), `import statistics\n\n\ndef score_stats(scores):\n    return [round(statistics.mean(scores), 2), statistics.median(scores)]\n`,
    '<p><code>statistics.mean(리스트)</code>, <code>statistics.median(리스트)</code></p>',
    [t('score_stats([1, 2, 3, 4])', [2.5, 2.5]), t('score_stats([5])', [5, 5]), t('score_stats([1, 2, 6])', [3, 2]), t('score_stats([2, 4, 4, 10])', [5, 4])]),
  w(MO, 3, '날짜 계산 (datetime)', `<p>두 함수를 만드세요. 날짜 문자열은 모두 <code>"2024-03-01"</code> 처럼 <code>연-월-일</code> 형식이에요. (<code>datetime.date</code>, <code>timedelta</code>)</p><ol><li><code>days_until(start, end)</code> — <code>start</code>부터 <code>end</code>까지 며칠인지(정수)</li><li><code>add_days(date_text, n)</code> — 날짜에 <code>n</code>일을 더한 날짜를 같은 형식의 문자열로</li></ol>`,
    `def days_until(start, end):\n    pass\n\n\ndef add_days(date_text, n):\n    pass\n`, `from datetime import date, timedelta\n\n\ndef days_until(start, end):\n    return (date.fromisoformat(end) - date.fromisoformat(start)).days\n\n\ndef add_days(date_text, n):\n    return (date.fromisoformat(date_text) + timedelta(days=n)).isoformat()\n`,
    '<p><code>date.fromisoformat("2024-03-01")</code> 로 날짜 객체를 만들고, 날짜끼리 빼면 <code>timedelta</code>가 나와요(<code>.days</code>가 일수). <code>.isoformat()</code>은 다시 문자열로 바꿔요.</p>',
    [t('days_until("2024-01-01", "2024-03-01")', 60), t('add_days("2024-02-28", 2)', '2024-03-01'), t('add_days("2023-12-31", 1)', '2024-01-01'), t('days_until("2024-05-05", "2024-05-05")', 0), t('add_days("2024-03-10", -10)', '2024-02-29')]),
  w(MO, 3, '요일 이름과 만 나이 (datetime)', `<p>두 함수를 만드세요. 날짜 문자열은 <code>"2024-03-01"</code> 형식이에요.</p><ol><li><code>weekday_name(date_text)</code> — 그 날짜의 <b>영어 요일 이름</b> (<code>"Monday"</code> …)</li><li><code>age_on(birth, on)</code> — <code>on</code> 날짜 기준 <b>만 나이</b>(생일이 지났으면 연도 차이, 아직이면 1을 뺀 값)</li></ol>`,
    `def weekday_name(date_text):\n    pass\n\n\ndef age_on(birth, on):\n    pass\n`, `from datetime import date\n\n\ndef weekday_name(date_text):\n    return date.fromisoformat(date_text).strftime("%A")\n\n\ndef age_on(birth, on):\n    b = date.fromisoformat(birth)\n    d = date.fromisoformat(on)\n    age = d.year - b.year\n    if (d.month, d.day) < (b.month, b.day):\n        age -= 1\n    return age\n`,
    '<p><code>strftime("%A")</code> 는 요일 이름이에요. 생일이 지났는지는 (월, 일) 튜플끼리 비교하면 간단해요.</p>',
    [t('weekday_name("2024-03-01")', 'Friday'), t('weekday_name("2000-01-01")', 'Saturday'), t('age_on("2000-05-10", "2024-05-09")', 23), t('age_on("2000-05-10", "2024-05-10")', 24), t('age_on("2000-12-31", "2024-01-01")', 23)]),
  w(MO, 2, '딕셔너리를 JSON 문자열로', `<p>두 함수를 만드세요. (<code>json</code> 모듈)</p><ol><li><code>to_json_text(data)</code> — 딕셔너리를 JSON 문자열로. <b>키를 정렬</b>하고, <b>한글이 그대로</b> 보이게 해요 (<code>sort_keys=True</code>, <code>ensure_ascii=False</code>)</li><li><code>from_json_text(text)</code> — JSON 문자열을 파이썬 객체로</li></ol>`,
    `def to_json_text(data):\n    pass\n\n\ndef from_json_text(text):\n    pass\n`, `import json\n\n\ndef to_json_text(data):\n    return json.dumps(data, sort_keys=True, ensure_ascii=False)\n\n\ndef from_json_text(text):\n    return json.loads(text)\n`,
    '<p><code>json.dumps(객체)</code> 는 문자열로, <code>json.loads(문자열)</code> 은 객체로 바꿔요.</p>',
    [t('to_json_text({"b": 1, "a": "한"})', '{"a": "한", "b": 1}'), t('from_json_text(\'{"a": [1, 2]}\')', { a: [1, 2] }), t('from_json_text(to_json_text({"x": [1, {"y": 2}]}))', { x: [1, { y: 2 }] }), t('to_json_text([])', '[]')]),
  w(MO, 3, '정규표현식으로 숫자 뽑기', `<p>문자열에서 <b>연속된 숫자 덩어리</b>를 모두 찾아 <b>정수 리스트</b>로 돌려주는 함수 <code>extract_numbers(text)</code>를 만드세요. 예: <code>"a12b3c456"</code> → <code>[12, 3, 456]</code> (<code>re.findall</code>)</p>`,
    f('extract_numbers(text)'), `import re\n\n\ndef extract_numbers(text):\n    return [int(x) for x in re.findall(r"\\d+", text)]\n`,
    '<p>정규표현식 <code>r"\\d+"</code> 는 "숫자 한 개 이상 연속"이에요. <code>re.findall</code>은 맞는 부분을 모두 문자열 리스트로 돌려줘요.</p>',
    [t('extract_numbers("a12b3c456")', [12, 3, 456]), t('extract_numbers("no digits")', []), t('extract_numbers("007 and 10")', [7, 10]), t('extract_numbers("1,2,3")', [1, 2, 3])]),
  w(MO, 3, '이메일 형식 검사', `<p>문자열이 이메일 형식이면 <code>True</code>인 함수 <code>is_valid_email(s)</code>를 만드세요. 규칙: <b>영문자·숫자·점(.)·밑줄(_)로 된 앞부분</b> + <code>@</code> + <b>영문자·숫자로 된 도메인</b> + <code>.</code> + <b>영문자 2글자 이상</b>. 전체가 이 규칙에 딱 맞아야 해요. (<code>re.fullmatch</code>)</p>`,
    f('is_valid_email(s)'), `import re\n\n\ndef is_valid_email(s):\n    return re.fullmatch(r"[A-Za-z0-9._]+@[A-Za-z0-9]+\\.[A-Za-z]{2,}", s) is not None\n`,
    '<p>패턴: <code>[A-Za-z0-9._]+</code> (앞부분) <code>@</code> <code>[A-Za-z0-9]+</code> (도메인) <code>\\.</code> (점) <code>[A-Za-z]{2,}</code> (끝). <code>fullmatch</code>는 문자열 전체가 맞아야 해요. 결과가 없으면 <code>None</code>이에요.</p>',
    [t('is_valid_email("user@example.com")', true), t('is_valid_email("user@example")', false), t('is_valid_email("@x.com")', false), t('is_valid_email("a.b@c.co")', true), t('is_valid_email("a b@c.com")', false)]),
  w(MO, 3, '해시태그 뽑기', `<p>문장에서 <code>#</code>으로 시작하는 <b>해시태그</b>를 <code>#</code>을 뺀 글자만 모아 리스트로 돌려주는 함수 <code>hashtags(text)</code>를 만드세요. 태그는 영문자·숫자·밑줄이 이어진 것이고, 나온 순서대로예요. 예: <code>"#a hi #b2"</code> → <code>["a", "b2"]</code></p>`,
    f('hashtags(text)'), `import re\n\n\ndef hashtags(text):\n    return re.findall(r"#(\\w+)", text)\n`,
    '<p>정규표현식에서 괄호 <code>( )</code> 는 "이 부분만 꺼내라"는 뜻이에요. <code>\\w</code>는 영문자·숫자·밑줄이에요.</p>',
    [t('hashtags("#a hi #b2")', ['a', 'b2']), t('hashtags("no tags")', []), t('hashtags("#one#two")', ['one', 'two']), t('hashtags("price #1 is 100")', ['1'])]),
  w(MO, 2, '숫자 가리기 (re.sub)', `<p>문자열의 <b>모든 숫자 한 글자 한 글자를 <code>*</code>로</b> 바꾼 문자열을 돌려주는 함수 <code>mask_digits(text)</code>를 만드세요. 예: <code>"010-1234"</code> → <code>"***-****"</code> (<code>re.sub</code>)</p>`,
    f('mask_digits(text)'), `import re\n\n\ndef mask_digits(text):\n    return re.sub(r"\\d", "*", text)\n`,
    '<p><code>re.sub(패턴, 바꿀 문자열, 대상)</code></p>',
    [t('mask_digits("010-1234")', '***-****'), t('mask_digits("abc")', 'abc'), t('mask_digits("a1b22")', 'a*b**'), t('mask_digits("")', '')]),
  w(MO, 2, '문장부호 세기 (string)', `<p>문자열에서 <b>문장부호(punctuation)</b>의 개수를 돌려주는 함수 <code>count_punctuation(s)</code>를 만드세요. <code>string.punctuation</code>은 <code>!"#$%&amp;'()*+,-./:;&lt;=&gt;?@[\\]^_\`{|}~</code> 같은 문장부호를 모은 문자열이에요.</p>`,
    f('count_punctuation(s)'), `import string\n\n\ndef count_punctuation(s):\n    return sum(1 for ch in s if ch in string.punctuation)\n`,
    '<p><code>import string</code> 후 <code>ch in string.punctuation</code> 으로 확인해요.</p>',
    [t('count_punctuation("Hi, you!")', 2), t('count_punctuation("abc")', 0), t('count_punctuation("a.b.c?")', 3), t('count_punctuation("")', 0)]),
  w(MO, 3, '이름이 있는 튜플 (namedtuple)', `<p><code>collections.namedtuple</code>로 <code>Point</code>를 만드세요. 필드는 <code>x</code>, <code>y</code>예요. <code>Point(1, 2)</code>의 <code>.x</code>, <code>.y</code>로도 읽고 <code>p[0]</code>처럼 인덱스로도 읽을 수 있어야 해요.</p>`,
    `Point = None\n`, `from collections import namedtuple\n\nPoint = namedtuple("Point", ["x", "y"])\n`,
    '<p><code>namedtuple("클래스이름", ["필드1", "필드2"])</code> 의 결과를 변수 <code>Point</code>에 담으세요. 튜플처럼 바꿀 수는 없지만 이름으로 읽을 수 있어 편해요.</p>',
    [t('(lambda p: [p.x, p.y, p[0]])(Point(1, 2))', [1, 2, 1]), t('Point(3, 4) == (3, 4)', true), t('(lambda x, y: x + y)(*Point(5, 6))', 11), t('raises(lambda: setattr(Point(1, 2), "x", 9))', 'AttributeError')]),
  w(MO, 3, '정렬 기준 바꾸기 (operator.itemgetter)', `<p><code>(이름, 나이)</code> 튜플의 리스트를 <b>나이가 어린 순서</b>(같으면 이름 알파벳 순서)로 정렬해 돌려주는 함수 <code>sort_people(people)</code>를 만드세요. <code>sorted</code>의 <code>key</code>에 <code>operator.itemgetter</code>를 써 보세요. (<code>itemgetter(1, 0)</code> 은 (나이, 이름) 순으로 꺼내요)</p>`,
    f('sort_people(people)'), `from operator import itemgetter\n\n\ndef sort_people(people):\n    return sorted(people, key=itemgetter(1, 0))\n`,
    '<p><code>itemgetter(1, 0)</code> 은 각 튜플에서 인덱스 1과 0의 값을 (1번, 0번) 튜플로 꺼내 주는 함수를 만들어요. 튜플끼리는 앞에서부터 비교하죠.</p>',
    [t('sort_people([("Ann", 30), ("Bo", 20), ("Cy", 30)])', [['Bo', 20], ['Ann', 30], ['Cy', 30]]), t('sort_people([])', []), t('sort_people([("b", 1), ("a", 1)])', [['a', 1], ['b', 1]]), t('sort_people([("x", 5)])', [['x', 5]])]),
  w(MO, 3, '정해진 값의 집합 (Enum)', `<p><code>enum.Enum</code>으로 <code>Color</code> 클래스를 만드세요. 멤버는 <code>RED = 1</code>, <code>GREEN = 2</code>, <code>BLUE = 3</code>이에요. <code>Color.RED.value</code>는 <code>1</code>, <code>Color(2).name</code>은 <code>"GREEN"</code>이어야 해요.</p>`,
    `class Color:\n    pass\n`, `from enum import Enum\n\n\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n    BLUE = 3\n`,
    '<p><code>class Color(Enum):</code> 아래에 <code>이름 = 값</code>을 써요. 시작 코드의 <code>class Color:</code> 를 <code>(Enum)</code> 상속으로 고치고, 파일 위에 <code>from enum import Enum</code>을 쓰세요.</p>',
    [t('Color.RED.value', 1), t('Color(2).name', 'GREEN'), t('[c.name for c in Color]', ['RED', 'GREEN', 'BLUE']), t('Color.BLUE == Color(3)', true), t('len(Color)', 3)]),

  // ================= 파일 입출력 =================
  w(FI, 2, '파일에 쓰고 읽기', `<p>두 함수를 만드세요. 한글이 깨지지 않도록 <code>encoding="utf-8"</code>을 쓰고, <code>with</code> 문으로 파일을 열어요.</p><ol><li><code>write_text(path, text)</code> — 파일에 <code>text</code>를 써요 (이미 있으면 덮어써요)</li><li><code>read_text(path)</code> — 파일 내용을 문자열로 읽어 돌려줘요</li></ol>`,
    `def write_text(path, text):\n    pass\n\n\ndef read_text(path):\n    pass\n`, `def write_text(path, text):\n    with open(path, "w", encoding="utf-8") as f:\n        f.write(text)\n\n\ndef read_text(path):\n    with open(path, "r", encoding="utf-8") as f:\n        return f.read()\n`,
    '<p><code>with open(경로, "w", encoding="utf-8") as f:</code> 블록이 끝나면 파일이 자동으로 닫혀요. <code>"w"</code>는 쓰기, <code>"r"</code>은 읽기예요.</p>',
    [t('(write_text("t_f1.txt", "안녕\\n반가워"), read_text("t_f1.txt"))[1]', '안녕\n반가워'), t('(write_text("t_f2.txt", ""), read_text("t_f2.txt"))[1]', ''), t('(write_text("t_f3.txt", "a"), write_text("t_f3.txt", "b"), read_text("t_f3.txt"))[2]', 'b'), t('(write_text("t_f4.txt", "x y"), len(read_text("t_f4.txt")))[1]', 3)]),
  w(FI, 2, '줄 단위로 저장하고 불러오기', `<p>두 함수를 만드세요.</p><ol><li><code>save_lines(path, lines)</code> — 문자열 리스트를 <b>한 줄에 하나씩</b> 파일에 써요</li><li><code>load_lines(path)</code> — 파일을 읽어 <b>줄 끝의 줄바꿈을 뺀</b> 문자열 리스트로 돌려줘요 (빈 파일이면 빈 리스트)</li></ol>`,
    `def save_lines(path, lines):\n    pass\n\n\ndef load_lines(path):\n    pass\n`, `def save_lines(path, lines):\n    with open(path, "w", encoding="utf-8") as f:\n        for line in lines:\n            f.write(line + "\\n")\n\n\ndef load_lines(path):\n    with open(path, "r", encoding="utf-8") as f:\n        return [line.rstrip("\\n") for line in f]\n`,
    '<p>쓸 때는 각 줄 끝에 <code>"\\n"</code>을 붙이고, 읽을 때는 파일 객체를 <code>for</code>로 돌면 한 줄씩 나와요. <code>rstrip("\\n")</code>으로 줄바꿈을 지워요.</p>',
    [t('(save_lines("t_l1.txt", ["a", "b", "c"]), load_lines("t_l1.txt"))[1]', ['a', 'b', 'c']), t('(save_lines("t_l2.txt", []), load_lines("t_l2.txt"))[1]', []), t('(save_lines("t_l3.txt", ["한글", "x y"]), load_lines("t_l3.txt"))[1]', ['한글', 'x y']), t('(save_lines("t_l4.txt", ["only"]), len(load_lines("t_l4.txt")))[1]', 1)]),
  w(FI, 2, '파일 끝에 한 줄 추가하기', `<p>두 함수를 만드세요.</p><ol><li><code>append_line(path, line)</code> — 파일 <b>끝에</b> 한 줄을 추가해요(<code>"a"</code> 모드). 파일이 없으면 새로 만들어요. 줄 끝에 줄바꿈을 붙여요</li><li><code>read_lines(path)</code> — 줄바꿈을 뺀 문자열 리스트로 읽어요</li></ol>`,
    `def append_line(path, line):\n    pass\n\n\ndef read_lines(path):\n    pass\n`, `def append_line(path, line):\n    with open(path, "a", encoding="utf-8") as f:\n        f.write(line + "\\n")\n\n\ndef read_lines(path):\n    with open(path, "r", encoding="utf-8") as f:\n        return [line.rstrip("\\n") for line in f]\n`,
    '<p><code>"w"</code>는 덮어쓰기, <code>"a"</code>(append)는 이어 붙이기예요.</p>',
    [t('(append_line("t_a1.txt", "첫째"), append_line("t_a1.txt", "둘째"), read_lines("t_a1.txt"))[2]', ['첫째', '둘째']), t('(append_line("t_a2.txt", "x"), read_lines("t_a2.txt"))[1]', ['x']), t('(append_line("t_a3.txt", "a"), append_line("t_a3.txt", "b"), append_line("t_a3.txt", "c"), len(read_lines("t_a3.txt")))[3]', 3), t('(append_line("t_a4.txt", ""), read_lines("t_a4.txt"))[1]', [''])]),
  w(FI, 3, '파일의 줄 수와 단어 수', `<p>텍스트 파일에 대해 <b>[줄 수, 단어 수]</b>를 리스트로 돌려주는 함수 <code>file_stats(path)</code>를 만드세요. 단어는 공백(여러 개 포함)으로 구분해요. 비어 있는 파일은 <code>[0, 0]</code>이에요.</p>`,
    f('file_stats(path)'), `def file_stats(path):\n    lines = 0\n    words = 0\n    with open(path, "r", encoding="utf-8") as f:\n        for line in f:\n            lines += 1\n            words += len(line.split())\n    return [lines, words]\n`,
    '<p>파일을 한 줄씩 돌면서 줄 수를 세고, 각 줄을 <code>split()</code>한 길이를 더해요.</p>',
    [t('(open("t_s1.txt", "w", encoding="utf-8").write("a b\\nc d e\\n"), file_stats("t_s1.txt"))[1]', [2, 5]), t('(open("t_s2.txt", "w", encoding="utf-8").write(""), file_stats("t_s2.txt"))[1]', [0, 0]), t('(open("t_s3.txt", "w", encoding="utf-8").write("one"), file_stats("t_s3.txt"))[1]', [1, 1]), t('(open("t_s4.txt", "w", encoding="utf-8").write("  x   y  \\n\\nz"), file_stats("t_s4.txt"))[1]', [3, 3])]),
  w(FI, 3, '없는 파일 안전하게 읽기', `<p>파일을 읽어 <b>내용 문자열</b>을 돌려주는 함수 <code>safe_read(path)</code>를 만드세요. 파일이 <b>없으면 오류 대신 <code>None</code></b>을 돌려줘요. (<code>FileNotFoundError</code>를 <code>try / except</code>로 처리)</p>`,
    f('safe_read(path)'), `def safe_read(path):\n    try:\n        with open(path, "r", encoding="utf-8") as f:\n            return f.read()\n    except FileNotFoundError:\n        return None\n`,
    '<p>없는 파일을 <code>open</code>하면 <code>FileNotFoundError</code>가 나요.</p>',
    [t('safe_read("t_no_such_file.txt")', null), t('(open("t_r1.txt", "w", encoding="utf-8").write("hi"), safe_read("t_r1.txt"))[1]', 'hi'), t('(open("t_r2.txt", "w", encoding="utf-8").write(""), safe_read("t_r2.txt"))[1]', ''), t('safe_read("nope/also_missing.txt")', null)]),
  w(FI, 3, '점수를 CSV처럼 저장하고 읽기', `<p>두 함수를 만드세요. 파일은 <code>이름,점수</code> 형태로 <b>한 줄에 한 명</b>씩 저장해요.</p><ol><li><code>save_scores(path, scores)</code> — 딕셔너리(이름 → 정수 점수)를 저장해요 (딕셔너리 순서대로)</li><li><code>load_scores(path)</code> — 파일을 읽어 딕셔너리(이름 → <b>정수</b> 점수)로 돌려줘요</li></ol>`,
    `def save_scores(path, scores):\n    pass\n\n\ndef load_scores(path):\n    pass\n`, `def save_scores(path, scores):\n    with open(path, "w", encoding="utf-8") as f:\n        for name, score in scores.items():\n            f.write(f"{name},{score}\\n")\n\n\ndef load_scores(path):\n    scores = {}\n    with open(path, "r", encoding="utf-8") as f:\n        for line in f:\n            line = line.strip()\n            if line:\n                name, score = line.split(",")\n                scores[name] = int(score)\n    return scores\n`,
    '<p>쓸 때는 <code>f"{name},{score}"</code>, 읽을 때는 <code>split(",")</code> 로 나누고 점수는 <code>int()</code>로 바꿔요. 빈 줄은 건너뛰세요.</p>',
    [t('(save_scores("t_c1.csv", {"Ann": 90, "Bo": 75}), load_scores("t_c1.csv"))[1]', { Ann: 90, Bo: 75 }), t('(save_scores("t_c2.csv", {}), load_scores("t_c2.csv"))[1]', {}), t('(save_scores("t_c3.csv", {"철수": 100}), load_scores("t_c3.csv"))[1]', { 철수: 100 }), t('(save_scores("t_c4.csv", {"a": 1, "b": 2, "c": 3}), sum(load_scores("t_c4.csv").values()))[1]', 6)]),
  w(FI, 3, 'JSON 파일로 저장하고 불러오기', `<p>두 함수를 만드세요. (<code>json</code> 모듈, <code>with open</code>)</p><ol><li><code>save_json(path, data)</code> — 데이터를 JSON 파일로 저장해요. 한글이 그대로 보이게 <code>ensure_ascii=False</code>를 써요</li><li><code>load_json(path)</code> — JSON 파일을 읽어 파이썬 객체로 돌려줘요</li></ol>`,
    `def save_json(path, data):\n    pass\n\n\ndef load_json(path):\n    pass\n`, `import json\n\n\ndef save_json(path, data):\n    with open(path, "w", encoding="utf-8") as f:\n        json.dump(data, f, ensure_ascii=False)\n\n\ndef load_json(path):\n    with open(path, "r", encoding="utf-8") as f:\n        return json.load(f)\n`,
    '<p>파일 객체를 다루는 함수는 <code>json.dump(데이터, 파일)</code> / <code>json.load(파일)</code> 이에요. (문자열을 다루는 <code>dumps</code>/<code>loads</code>와 이름이 비슷하지만 s가 없어요.)</p>',
    [t('(save_json("t_j1.json", {"a": [1, 2], "b": "한글"}), load_json("t_j1.json"))[1]', { a: [1, 2], b: '한글' }), t('(save_json("t_j2.json", []), load_json("t_j2.json"))[1]', []), t('(save_json("t_j3.json", {"x": {"y": 1}}), load_json("t_j3.json")["x"]["y"])[1]', 1), t('(save_json("t_j4.json", [1, 2, 3]), sum(load_json("t_j4.json")))[1]', 6)]),

  // ================= dataclass · 타입 힌트 =================
  w(DC, 3, '데이터를 담는 클래스 간단히 (dataclass)', `<p><code>dataclasses.dataclass</code>로 <code>Point</code> 클래스를 만드세요. 필드는 <code>x: int</code>, <code>y: int</code>예요. <code>__init__</code>, <code>__repr__</code>, <code>__eq__</code>를 직접 쓰지 않아도 <b>자동으로 만들어져요</b>. 예: <code>repr(Point(1, 2))</code> → <code>"Point(x=1, y=2)"</code></p>`,
    `class Point:\n    pass\n`, `from dataclasses import dataclass\n\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n`,
    '<p>클래스 위에 <code>@dataclass</code>를 붙이고, 안에는 <code>이름: 타입</code> 형태로 필드만 써요. 타입은 힌트일 뿐 검사하지는 않아요.</p>',
    [t('repr(Point(1, 2))', 'Point(x=1, y=2)'), t('Point(1, 2) == Point(1, 2)', true), t('Point(1, 2) == Point(2, 1)', false), t('(lambda p: [p.x, p.y])(Point(3, 4))', [3, 4])]),
  w(DC, 3, '기본값과 가변 기본값 (field)', `<p><code>Cart</code>를 <code>dataclass</code>로 만드세요. 필드는 <code>owner: str</code>과 <code>items</code>예요. <code>items</code>는 <b>매번 새 빈 리스트</b>에서 시작해야 해요. (리스트를 기본값으로 직접 쓰면 오류가 나요. <code>field(default_factory=list)</code>를 쓰세요)</p>`,
    `class Cart:\n    pass\n`, `from dataclasses import dataclass, field\n\n\n@dataclass\nclass Cart:\n    owner: str\n    items: list = field(default_factory=list)\n`,
    '<p>가변 값(리스트, 딕셔너리)을 필드 기본값으로 쓰려면 <code>field(default_factory=list)</code> 처럼 "새로 만드는 방법"을 알려 줘야 해요. 함수의 기본값 함정과 같은 이유예요.</p>',
    [t('Cart("x").items', []), t('(lambda a, b: (a.items.append(1), [a.items, b.items])[1])(Cart("a"), Cart("b"))', [[1], []]), t('Cart("a", [1, 2]).items', [1, 2]), t('Cart("z").owner', 'z')]),
  w(DC, 4, '비교할 수 있는 dataclass (order)', `<p><code>Version</code>을 <code>dataclass</code>로 만드세요. 필드는 <code>major: int</code>, <code>minor: int</code>이고, <code>&lt;</code>로 비교하거나 <code>sorted()</code>로 정렬할 수 있어야 해요. (major가 먼저, 같으면 minor로 비교) — <code>@dataclass(order=True)</code></p>`,
    `class Version:\n    pass\n`, `from dataclasses import dataclass\n\n\n@dataclass(order=True)\nclass Version:\n    major: int\n    minor: int\n`,
    '<p><code>order=True</code> 를 주면 필드 순서대로 비교하는 <code>&lt;</code>, <code>&gt;</code> 등이 자동으로 만들어져요.</p>',
    [t('[(v.major, v.minor) for v in sorted([Version(1, 2), Version(1, 0), Version(0, 9)])]', [[0, 9], [1, 0], [1, 2]]), t('Version(1, 0) < Version(1, 1)', true), t('Version(2, 0) < Version(1, 9)', false), t('max([Version(1, 5), Version(2, 0)]).major', 2)]),
  w(DC, 4, '바꿀 수 없는 dataclass (frozen)', `<p><code>Pt</code>를 <code>dataclass</code>로 만드세요. 필드는 <code>x: int</code>, <code>y: int</code>이고, 만든 뒤에 <b>값을 바꾸려 하면 오류</b>가 나야 해요(<code>frozen=True</code>). 이런 객체는 딕셔너리의 <b>키</b>로도 쓸 수 있어요.</p>`,
    `class Pt:\n    pass\n`, `from dataclasses import dataclass\n\n\n@dataclass(frozen=True)\nclass Pt:\n    x: int\n    y: int\n`,
    '<p><code>@dataclass(frozen=True)</code> 는 속성 대입을 막아 주고, 같은 값이면 같은 해시를 가지게 해 줘요.</p>',
    [t('raises(lambda: setattr(Pt(1, 2), "x", 5))', 'FrozenInstanceError'), t('{Pt(1, 2): "a"}[Pt(1, 2)]', 'a'), t('Pt(1, 2) == Pt(1, 2)', true), t('len({Pt(0, 0), Pt(0, 0), Pt(1, 1)})', 2)]),
  w(DC, 4, '만든 뒤 계산하는 필드 (__post_init__)', `<p><code>Rect</code>를 <code>dataclass</code>로 만드세요. 필드는 <code>w: int</code>, <code>h: int</code>이고, 여기에 <b>생성할 때는 받지 않고 자동으로 계산되는 필드 <code>area</code></b>(= <code>w × h</code>)를 추가해요. (<code>field(init=False)</code>와 <code>__post_init__</code>)</p>`,
    `class Rect:\n    pass\n`, `from dataclasses import dataclass, field\n\n\n@dataclass\nclass Rect:\n    w: int\n    h: int\n    area: int = field(init=False)\n\n    def __post_init__(self):\n        self.area = self.w * self.h\n`,
    '<p><code>__post_init__</code>은 <code>__init__</code>이 끝난 직후에 자동으로 불려요. 계산된 값을 여기서 채워 넣어요.</p>',
    [t('Rect(3, 4).area', 12), t('Rect(0, 5).area', 0), t('(lambda r: [r.w, r.h, r.area])(Rect(2, 2))', [2, 2, 4]), t('repr(Rect(1, 2))', 'Rect(w=1, h=2, area=2)')]),
];
